import React from 'react';

export default function CharacterResources({ character, onSave, readOnly }) {
  const resources = character?.resources || [];

  return (
    <div className="space-y-6">
      <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4 text-yellow-300">
        <strong>Resources</strong> - To be implemented
        <p className="text-sm text-yellow-400 mt-1">
          Ammo, charges, ability uses - Name, Current/Max, Notes (recharge conditions)
        </p>
      </div>

      {/* Add Resource Button */}
      {!readOnly && (
        <div className="flex justify-end">
          <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center space-x-2">
            <span>+</span>
            <span>Add Resource</span>
          </button>
        </div>
      )}

      {/* Resources List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {resources.length === 0 ? (
          <div className="col-span-full bg-white/5 rounded-lg p-8 border border-white/10 text-center">
            <p className="text-gray-500">No resources tracked</p>
            <p className="text-gray-600 text-sm mt-1">Add ammo, ability charges, or other consumable resources</p>
          </div>
        ) : (
          resources.map((resource, idx) => (
            <div key={idx} className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-white font-medium">{resource.name || 'Unnamed'}</h4>
                {resource.current === 0 && (
                  <span className="px-2 py-0.5 rounded text-xs bg-red-500/20 text-red-400 border border-red-500/30">
                    Empty
                  </span>
                )}
              </div>
              
              {/* Progress Bar */}
              <div className="mb-2">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Current</span>
                  <span className="text-white font-medium">{resource.current || 0} / {resource.max || 0}</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all ${
                      resource.current === 0 ? 'bg-red-500' : 
                      resource.current < resource.max * 0.25 ? 'bg-yellow-500' : 
                      'bg-green-500'
                    }`}
                    style={{ width: `${resource.max > 0 ? (resource.current / resource.max) * 100 : 0}%` }}
                  />
                </div>
              </div>
              
              {/* Notes */}
              {resource.notes && (
                <p className="text-gray-500 text-sm">{resource.notes}</p>
              )}
              
              {/* Quick Adjust Buttons */}
              {!readOnly && (
                <div className="flex items-center justify-center space-x-2 mt-3">
                  <button className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded transition-colors">
                    -1
                  </button>
                  <button className="px-3 py-1 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded transition-colors">
                    +1
                  </button>
                  <button className="px-3 py-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded transition-colors text-sm">
                    Reset
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Example Resources */}
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
        <h4 className="text-blue-300 font-medium mb-2">Example Resources</h4>
        <ul className="text-blue-400 text-sm space-y-1">
          <li>• <strong>9mm Ammo</strong> - Current: 24 / Max: 30 - Note: "Standard pistol rounds"</li>
          <li>• <strong>Flashlight Battery</strong> - Current: 4 / Max: 8 - Note: "1 hour per charge"</li>
          <li>• <strong>Lucky Reroll</strong> - Current: 1 / Max: 1 - Note: "Resets per session"</li>
        </ul>
      </div>
      
      {readOnly && (
        <p className="text-gray-500 text-sm text-center">👁️ Read-only view</p>
      )}
    </div>
  );
}