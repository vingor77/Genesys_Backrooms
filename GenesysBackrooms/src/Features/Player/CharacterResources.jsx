import React, { useState, useEffect } from 'react';

export default function CharacterResources({ character, onSave, readOnly }) {
  const [resources, setResources] = useState(character?.resources || []);
  const [showModal, setShowModal] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    current: 0,
    max: 1,
    description: ''
  });

  // Sync with character prop changes
  useEffect(() => {
    setResources(character?.resources || []);
  }, [character]);

  // Save resources when they change
  useEffect(() => {
    if (onSave && resources !== character?.resources) {
      onSave({ ...character, resources });
    }
  }, [resources]);

  // Open modal for adding new resource
  const openAddModal = () => {
    setEditingResource(null);
    setFormData({
      name: '',
      current: 0,
      max: 1,
      description: ''
    });
    setShowModal(true);
  };

  // Open modal for editing existing resource
  const openEditModal = (resource, index) => {
    setEditingResource(index);
    setFormData({ ...resource });
    setShowModal(true);
  };

  // Save resource (add or edit)
  const saveResource = () => {
    if (!formData.name.trim()) {
      alert('Resource name is required');
      return;
    }

    if (formData.current > formData.max) {
      alert('Resource cannot have more uses than maximum')
      return;
    }

    const newResource = {
      name: formData.name.trim(),
      current: parseInt(formData.current) || 0,
      max: parseInt(formData.max) || 0,
      description: formData.description.trim()
    };

    let newResources;
    if (editingResource !== null) {
      // Edit existing
      newResources = [...resources];
      newResources[editingResource] = newResource;
    } else {
      // Add new
      newResources = [...resources, newResource];
    }

    setResources(newResources);
    setShowModal(false);
  };

  // Delete resource
  const deleteResource = (index) => {
    if (confirm('Delete this resource?')) {
      const newResources = resources.filter((_, i) => i !== index);
      setResources(newResources);
    }
  };

  // Adjust current value
  const adjustCurrent = (index, amount) => {
    const newResources = [...resources];
    const resource = newResources[index];
    resource.current = Math.max(0, Math.min(resource.max, resource.current + amount));
    setResources(newResources);
  };

  // Reset to max
  const resetToMax = (index) => {
    const newResources = [...resources];
    newResources[index].current = newResources[index].max;
    setResources(newResources);
  };

  return (
    <div className="space-y-6">
      {/* Add/Edit Modal */}
      {showModal && !readOnly && (
        <div className="fixed inset-0 bg-black/80 z-50 overflow-y-auto">
          <div className="min-h-screen px-4 py-8">
            <div className="bg-gray-800 rounded-xl border border-gray-600 w-full max-w-2xl mx-auto">
              <div className="p-6 border-b border-gray-700 flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">
                  {editingResource !== null ? 'Edit Resource' : 'Add New Resource'}
                </h3>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white p-2">✕</button>
              </div>

              <div className="p-6 space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-1">
                    Resource Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g., 9mm Ammo, Ability Charges, Health Potion"
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Current and Max */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-1">
                      Current Value
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.current}
                      onChange={(e) => setFormData({...formData, current: e.target.value})}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-1">
                      Max Value
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.max}
                      onChange={(e) => setFormData({...formData, max: e.target.value})}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-1">
                    Description / Notes
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="e.g., Recharge conditions, how to use, etc."
                    rows="3"
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 resize-none"
                  />
                </div>

                {/* Save Button */}
                <button
                  onClick={saveResource}
                  disabled={!formData.name.trim()}
                  className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
                >
                  {editingResource !== null ? 'Save Changes' : 'Add Resource'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Resources</h2>
          <p className="text-gray-400 text-sm">Track ammo, charges, uses, and other consumables</p>
        </div>
        {!readOnly && (
          <button 
            onClick={openAddModal}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center space-x-2"
          >
            <span>+</span>
            <span>Add Resource</span>
          </button>
        )}
      </div>

      {/* Resources Grid */}
      {resources.length === 0 ? (
        <div className="bg-white/5 rounded-lg p-8 border border-white/10 text-center">
          <p className="text-gray-500 text-lg mb-2">No resources tracked</p>
          <p className="text-gray-600 text-sm mb-4">Add ammo, ability charges, or other consumable resources</p>
          {!readOnly && (
            <button 
              onClick={openAddModal}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
            >
              + Add Your First Resource
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {resources.map((resource, idx) => (
            <div key={idx} className="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-white/20 transition-colors">
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="text-white font-semibold text-lg mb-1">{resource.name}</h4>
                  {resource.current === 0 && (
                    <span className="inline-block px-2 py-0.5 rounded text-xs bg-red-500/20 text-red-400 border border-red-500/30">
                      Empty
                    </span>
                  )}
                </div>
                {!readOnly && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(resource, idx)}
                      className="p-1.5 text-gray-400 hover:text-indigo-400 hover:bg-indigo-900/30 rounded transition-colors"
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => deleteResource(idx)}
                      className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-900/30 rounded transition-colors"
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                )}
              </div>

              {/* Progress Bar */}
              <div className="mb-3">
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-gray-400">Current / Max</span>
                  <span className="text-white font-bold">{resource.current} / {resource.max}</span>
                </div>
                <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all ${
                      resource.current === 0 ? 'bg-red-500' : 
                      resource.current < resource.max * 0.25 ? 'bg-yellow-500' : 
                      resource.current < resource.max ? 'bg-blue-500' :
                      'bg-green-500'
                    }`}
                    style={{ width: `${resource.max > 0 ? Math.min((resource.current / resource.max) * 100, 100) : 0}%` }}
                  />
                </div>
              </div>

              {/* Description */}
              {resource.description && (
                <div className="mb-3 p-2 bg-gray-800/50 rounded border-l-2 border-indigo-500">
                  <p className="text-gray-300 text-sm">{resource.description}</p>
                </div>
              )}

              {/* Quick Adjust Buttons */}
              {!readOnly && (
                <div className="flex items-center justify-between gap-2">
                  <button 
                    onClick={() => adjustCurrent(idx, -1)}
                    disabled={resource.current === 0}
                    className="flex-1 px-3 py-2 bg-red-500/20 hover:bg-red-500/30 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed text-red-400 rounded transition-colors font-medium"
                  >
                    -1
                  </button>
                  <button 
                    onClick={() => adjustCurrent(idx, 1)}
                    disabled={resource.current >= resource.max}
                    className="flex-1 px-3 py-2 bg-green-500/20 hover:bg-green-500/30 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed text-green-400 rounded transition-colors font-medium"
                  >
                    +1
                  </button>
                  <button 
                    onClick={() => resetToMax(idx)}
                    disabled={resource.current === resource.max}
                    className="flex-1 px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed text-blue-400 rounded transition-colors text-sm font-medium"
                  >
                    Reset
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Example Resources Help */}
      {resources.length === 0 && (
        <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
          <h4 className="text-blue-300 font-medium mb-2">💡 Example Resources</h4>
          <ul className="text-blue-400 text-sm space-y-1">
            <li>• <strong>9mm Ammo</strong> - Current: 24 / Max: 30 - "Standard pistol rounds"</li>
            <li>• <strong>Flashlight Battery</strong> - Current: 4 / Max: 8 - "1 hour per charge"</li>
            <li>• <strong>Lucky Reroll</strong> - Current: 1 / Max: 1 - "Resets per session"</li>
            <li>• <strong>Medkit Uses</strong> - Current: 3 / Max: 5 - "Heals 2d6 HP per use"</li>
          </ul>
        </div>
      )}

      {readOnly && (
        <p className="text-gray-500 text-sm text-center">👁️ Read-only view</p>
      )}
    </div>
  );
}
