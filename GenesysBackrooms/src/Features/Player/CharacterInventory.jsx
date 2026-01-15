import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import db from '../../Structural/Firebase';
import { getActiveSession, isDM } from '../../Structural/Session_Utils';

export default function CharacterInventory({ character, onSave, readOnly }) {
  const [inventory, setInventory] = useState(character?.inventory || []);
  const [objects, setObjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addMode, setAddMode] = useState('database'); // 'database' or 'custom'
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  // Filter state for inventory display
  const [activeFilters, setActiveFilters] = useState({
    'Weapon': true,
    'Armor': true,
    'Mundane Object': true,
    'Anomalous Object': true
  });

  // Custom item form state
  const [customItem, setCustomItem] = useState({
    name: '',
    category: 'Mundane Object',
    quantity: 1,
    encumbrance: 0,
    price: 0,
    notes: ''
  });

  const sessionId = getActiveSession();
  const userIsDM = isDM();

  const totalEncumbrance = inventory.reduce((sum, item) => sum + ((item.encumbrance || 0) * (item.quantity || 1)), 0);
  const maxEncumbrance = character?.maxEncumbrance || (5 + (character?.characteristics?.brawn || 2));

  // Sync with character prop changes
  useEffect(() => {
    setInventory(character?.inventory || []);
  }, [character]);

  // Helper function to clean object of undefined values
  const cleanObject = (obj) => {
    const cleaned = {};
    Object.keys(obj).forEach(key => {
      if (obj[key] !== undefined && obj[key] !== null) {
        cleaned[key] = obj[key];
      }
    });
    return cleaned;
  };

  // Fetch objects from database
  useEffect(() => {
    const q = query(collection(db, 'Objects'), where("type", "!=", "Construct"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const objectsList = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        const visibility = data.sessionVisibility?.[sessionId];
        const isHidden = visibility === 'hidden';

        // Only show visible objects (unless user is DM)
        if (userIsDM || !isHidden) {
          objectsList.push({
            id: doc.id,
            ...data,
            isHidden
          });
        }
      });
      setObjects(objectsList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [sessionId, userIsDM]);

  // Filter objects for database picker
  const filteredObjects = objects.filter(obj => {
    const matchesSearch = !searchTerm || 
      obj.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      obj.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = filterCategory === 'all' || 
      obj.type === filterCategory;

    return matchesSearch && matchesCategory;
  });

  // Toggle filter
  const toggleFilter = (category) => {
    setActiveFilters(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  // Toggle all filters
  const toggleAllFilters = () => {
    const allActive = Object.values(activeFilters).every(v => v);
    const newState = {
      'Weapon': !allActive,
      'Armor': !allActive,
      'Mundane Object': !allActive,
      'Anomalous Object': !allActive
    };
    setActiveFilters(newState);
  };

  // Add item from database
  const addFromDatabase = (dbObject) => {
    const newItem = cleanObject({
      ...dbObject,
      id: `${Date.now()}-${Math.random()}`,
      dbId: dbObject.id, // Reference to database object
      name: dbObject.name,
      category: dbObject.type || 'Mundane Object',
      quantity: 1,
      encumbrance: dbObject.encumbrance || 0,
      price: dbObject.price || 0,
      notes: ''
    });

    const newInventory = [...inventory, newItem];
    setInventory(newInventory);
    setShowAddModal(false);
    setSearchTerm('');
    setFilterCategory('all');
  };

  // Add custom item
  const addCustomItem = () => {
    if (!customItem.name.trim()) return;

    const newItem = cleanObject({
      id: `${Date.now()}-${Math.random()}`,
      name: customItem.name,
      category: customItem.category,
      quantity: parseInt(customItem.quantity) || 1,
      encumbrance: parseFloat(customItem.encumbrance) || 0,
      price: parseFloat(customItem.price) || 0,
      notes: customItem.notes || ''
    });

    const newInventory = [...inventory, newItem];
    setInventory(newInventory);
    setShowAddModal(false);
    setCustomItem({
      name: '',
      category: 'Mundane Object',
      quantity: 1,
      encumbrance: 0,
      price: 0,
      notes: ''
    });
  };

  // Remove item
  const removeItem = (itemId) => {
    const newInventory = inventory.filter(item => item.id !== itemId);
    setInventory(newInventory);
  };

  // Update item quantity
  const updateQuantity = (itemId, newQuantity) => {
    const newInventory = inventory.map(item => 
      item.id === itemId ? { ...item, quantity: Math.max(1, parseInt(newQuantity) || 1) } : item
    );
    setInventory(newInventory);
  };

  // Save to parent when inventory changes
  useEffect(() => {
    if (onSave && inventory !== character?.inventory) {
      onSave({ ...character, inventory });
    }
  }, [inventory]);

  // Group inventory by category
  const groupedInventory = inventory.reduce((acc, item) => {
    const cat = item.category || 'Mundane Object';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  const categories = ['Weapon', 'Armor', 'Mundane Object', 'Anomalous Object'];

  // Category icons and colors
  const categoryConfig = {
    'Weapon': { icon: '⚔️', color: 'red' },
    'Armor': { icon: '🛡️', color: 'blue' },
    'Mundane Object': { icon: '📦', color: 'gray' },
    'Anomalous Object': { icon: '✨', color: 'purple' }
  };

  // Render item stats based on category
  const renderItemStats = (item) => {
    return (
      <div className="space-y-3">
        {/* Description */}
        {item.description && (
          <p className="text-gray-400 text-sm">{item.description}</p>
        )}

        {/* Personal Notes */}
        {item.notes && (
          <p className="text-gray-300 text-sm italic bg-gray-800/50 p-2 rounded border-l-2 border-indigo-500">
            💭 {item.notes}
          </p>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {/* Quantity */}
          {!readOnly ? (
            <div className="bg-gray-800 px-3 py-2 rounded border border-gray-600">
              <div className="text-gray-400 text-xs mb-1">Quantity</div>
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => updateQuantity(item.id, e.target.value)}
                className="w-full bg-transparent text-white text-sm font-medium focus:outline-none"
              />
            </div>
          ) : (
            <div className="bg-gray-800 px-3 py-2 rounded border border-gray-600">
              <div className="text-gray-400 text-xs mb-1">Quantity</div>
              <div className="text-white text-sm font-medium">{item.quantity}</div>
            </div>
          )}

          {/* Encumbrance */}
          {item.encumbrance > 0 && (
            <div className="bg-amber-900/30 px-3 py-2 rounded border border-amber-600/50">
              <div className="text-amber-400 text-xs mb-1">Encumbrance</div>
              <div className="text-amber-200 text-sm font-medium">
                {item.encumbrance} {item.quantity > 1 && `(${item.encumbrance * item.quantity} total)`}
              </div>
            </div>
          )}

          {/* Price */}
          {item.price > 0 && (
            <div className="bg-green-900/30 px-3 py-2 rounded border border-green-600/50">
              <div className="text-green-400 text-xs mb-1">Value</div>
              <div className="text-green-200 text-sm font-medium">{item.price} cr</div>
            </div>
          )}

          {/* Rarity */}
          {item.rarity && (
            <div className="bg-purple-900/30 px-3 py-2 rounded border border-purple-600/50">
              <div className="text-purple-400 text-xs mb-1">Rarity</div>
              <div className="text-purple-200 text-sm font-medium">{item.rarity}</div>
            </div>
          )}

          {/* === WEAPON STATS === */}
          {item.damage && (
            <div className="bg-red-900/30 px-3 py-2 rounded border border-red-600/50">
              <div className="text-red-400 text-xs mb-1">Damage</div>
              <div className="text-red-200 text-sm font-medium">{item.damage}</div>
            </div>
          )}

          {item.critical && (
            <div className="bg-orange-900/30 px-3 py-2 rounded border border-orange-600/50">
              <div className="text-orange-400 text-xs mb-1">Critical</div>
              <div className="text-orange-200 text-sm font-medium">{item.critical}</div>
            </div>
          )}

          {item.range && (
            <div className="bg-yellow-900/30 px-3 py-2 rounded border border-yellow-600/50">
              <div className="text-yellow-400 text-xs mb-1">Range</div>
              <div className="text-yellow-200 text-sm font-medium">{item.range}</div>
            </div>
          )}

          {/* === ARMOR STATS === */}
          {item.soak && (
            <div className="bg-blue-900/30 px-3 py-2 rounded border border-blue-600/50">
              <div className="text-blue-400 text-xs mb-1">Soak</div>
              <div className="text-blue-200 text-sm font-medium">+{item.soak}</div>
            </div>
          )}

          {item.melee_defense || item.melee_defense > -1 && (
            <div className="bg-cyan-900/30 px-3 py-2 rounded border border-cyan-600/50">
              <div className="text-cyan-400 text-xs mb-1">Melee Defense</div>
              <div className="text-cyan-200 text-sm font-medium">+{item.melee_defense}</div>
            </div>
          )}

          {item.ranged_defense && (
            <div className="bg-teal-900/30 px-3 py-2 rounded border border-teal-600/50">
              <div className="text-teal-400 text-xs mb-1">Ranged Defense</div>
              <div className="text-teal-200 text-sm font-medium">+{item.ranged_defense}</div>
            </div>
          )}
        </div>

        {/* Special Abilities/Properties */}
        {item.special && (
          <div className="bg-indigo-900/30 px-3 py-2 rounded border border-indigo-600/50">
            <div className="text-indigo-400 text-xs font-medium mb-1">⚡ Special Properties</div>
            <div className="text-indigo-200 text-sm">{item.special}</div>
          </div>
        )}

        {/* Mechanical Effect (for Anomalous Objects) */}
        {item.mechanical_effect && (
          <div className="bg-purple-900/30 px-3 py-2 rounded border border-purple-600/50">
            <div className="text-purple-400 text-xs font-medium mb-1">✨ Mechanical Effect</div>
            <div className="text-purple-200 text-sm">{item.mechanical_effect}</div>
          </div>
        )}

        {/* Two-Handed Indicator */}
        {item.twoHanded && (
          <div className="bg-gray-800 px-3 py-2 rounded border border-gray-600 text-center">
            <span className="text-gray-400 text-sm">🤲 Two-Handed Weapon</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Add Item Modal */}
      {showAddModal && !readOnly && (
        <div className="fixed inset-0 bg-black/80 z-50 overflow-y-auto">
          <div className="min-h-screen px-4 py-8">
            <div className="bg-gray-800 rounded-xl border border-gray-600 w-full max-w-4xl mx-auto">
              <div className="p-6 border-b border-gray-700 flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">Add Item to Inventory</h3>
                <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-white p-2">✕</button>
              </div>

              {/* Mode Toggle */}
              <div className="p-6 border-b border-gray-700 flex gap-2">
                <button
                  onClick={() => setAddMode('database')}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                    addMode === 'database' 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  📚 From Database
                </button>
                <button
                  onClick={() => setAddMode('custom')}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                    addMode === 'custom' 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  ✏️ Custom Item
                </button>
              </div>

              {/* Database Mode */}
              {addMode === 'database' && (
                <div className="p-6">
                  {/* Search and Filter */}
                  <div className="mb-4 space-y-3">
                    <input
                      type="text"
                      placeholder="Search objects..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
                    />
                    <select
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value="all">All Categories</option>
                      <option value="Weapon">Weapons</option>
                      <option value="Armor">Armor</option>
                      <option value="Mundane Object">Mundane Objects</option>
                      <option value="Anomalous Object">Anomalous Objects</option>
                    </select>
                  </div>

                  {/* Objects List */}
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {loading ? (
                      <p className="text-gray-500 text-center py-8">Loading objects...</p>
                    ) : filteredObjects.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">No objects found</p>
                    ) : (
                      filteredObjects.map(obj => (
                        <button
                          key={obj.id}
                          onClick={() => addFromDatabase(obj)}
                          className="w-full text-left p-4 bg-gray-700 hover:bg-gray-600 rounded-lg border border-gray-600 transition-colors"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="text-white font-medium">{obj.name}</h4>
                                <span className="px-2 py-0.5 text-xs rounded bg-gray-600 text-gray-300">
                                  {obj.type}
                                </span>
                                {obj.isHidden && userIsDM && (
                                  <span className="px-2 py-0.5 text-xs rounded bg-yellow-600 text-yellow-200">
                                    Hidden
                                  </span>
                                )}
                              </div>
                              {obj.description && (
                                <p className="text-gray-400 text-sm mb-2 line-clamp-2">{obj.description}</p>
                              )}
                              <div className="flex flex-wrap gap-2 text-sm">
                                {obj.damage && (
                                  <span className="px-2 py-1 bg-red-500/20 text-red-300 rounded border border-red-500/30">
                                    Damage: {obj.damage}
                                  </span>
                                )}
                                {obj.soak && (
                                  <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded border border-blue-500/30">
                                    Soak: +{obj.soak}
                                  </span>
                                )}
                                {obj.encumbrance > 0 && (
                                  <span className="px-2 py-1 bg-amber-500/20 text-amber-300 rounded border border-amber-500/30">
                                    Enc: {obj.encumbrance}
                                  </span>
                                )}
                                {obj.rarity && (
                                  <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded border border-purple-500/30">
                                    Rarity: {obj.rarity}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Custom Mode */}
              {addMode === 'custom' && (
                <div className="p-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-1">Item Name *</label>
                      <input
                        type="text"
                        value={customItem.name}
                        onChange={(e) => setCustomItem({...customItem, name: e.target.value})}
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                        placeholder="Enter item name"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-300 text-sm font-medium mb-1">Type</label>
                        <select
                          value={customItem.category}
                          onChange={(e) => setCustomItem({...customItem, category: e.target.value})}
                          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                        >
                          <option value="Weapon">⚔️ Weapon</option>
                          <option value="Armor">🛡️ Armor</option>
                          <option value="Mundane Object">📦 Mundane Object</option>
                          <option value="Anomalous Object">✨ Anomalous Object</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-gray-300 text-sm font-medium mb-1">Quantity</label>
                        <input
                          type="number"
                          min="1"
                          value={customItem.quantity}
                          onChange={(e) => setCustomItem({...customItem, quantity: e.target.value})}
                          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-300 text-sm font-medium mb-1">Encumbrance</label>
                        <input
                          type="number"
                          min="0"
                          step="0.1"
                          value={customItem.encumbrance}
                          onChange={(e) => setCustomItem({...customItem, encumbrance: e.target.value})}
                          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-300 text-sm font-medium mb-1">Price (credits)</label>
                        <input
                          type="number"
                          min="0"
                          value={customItem.price}
                          onChange={(e) => setCustomItem({...customItem, price: e.target.value})}
                          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-1">Notes</label>
                      <textarea
                        value={customItem.notes}
                        onChange={(e) => setCustomItem({...customItem, notes: e.target.value})}
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-indigo-500 resize-none"
                        rows="3"
                        placeholder="Optional notes..."
                      />
                    </div>

                    <button
                      onClick={addCustomItem}
                      disabled={!customItem.name.trim()}
                      className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
                    >
                      Add Custom Item
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Encumbrance Summary */}
      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-semibold">Encumbrance</h3>
          <div className={`text-lg font-bold ${totalEncumbrance > maxEncumbrance ? 'text-red-400' : 'text-green-400'}`}>
            {totalEncumbrance} / {maxEncumbrance}
          </div>
        </div>
        <div className="mt-2 h-2 bg-gray-700 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all ${totalEncumbrance > maxEncumbrance ? 'bg-red-500' : 'bg-green-500'}`}
            style={{ width: `${Math.min((totalEncumbrance / maxEncumbrance) * 100, 100)}%` }}
          />
        </div>
        {totalEncumbrance > maxEncumbrance && (
          <p className="text-red-400 text-sm mt-2">⚠️ Overencumbered! Suffer penalties to actions.</p>
        )}
      </div>

      {/* Filter Buttons */}
      {inventory.length > 0 && (
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-semibold">Filter by Type</h3>
            <button
              onClick={toggleAllFilters}
              className="text-sm px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
            >
              {Object.values(activeFilters).every(v => v) ? 'Hide All' : 'Show All'}
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => {
              const config = categoryConfig[category];
              const isActive = activeFilters[category];
              const itemCount = (groupedInventory[category] || []).length;

              if (itemCount === 0) return null;

              return (
                <button
                  key={category}
                  onClick={() => toggleFilter(category)}
                  className={`px-3 py-2 rounded-lg font-medium transition-all ${
                    isActive
                      ? `bg-${config.color}-600 text-white shadow-lg`
                      : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                  }`}
                >
                  {config.icon} {category} ({itemCount})
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Inventory by Category */}
      {categories.map(category => {
        const items = groupedInventory[category] || [];
        if (items.length === 0 || !activeFilters[category]) return null;

        const config = categoryConfig[category];

        return (
          <div key={category} className="bg-white/5 rounded-lg p-4 border border-white/10">
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              <span>{config.icon}</span>
              <span>{category}</span>
              <span className="text-gray-400 text-sm font-normal">({items.length})</span>
            </h3>
            <div className="space-y-3">
              {items.map(item => (
                <div key={item.id} className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-white font-medium text-lg">{item.name}</h4>
                        {item.dbId && (
                          <span className="px-2 py-0.5 text-xs rounded bg-indigo-600 text-indigo-200" title="From database">
                            DB
                          </span>
                        )}
                        {item.equippedTo && (
                          <span className="px-2 py-0.5 text-xs rounded bg-indigo-600 text-indigo-200">
                            {item.equippedTo}
                          </span>
                        )}
                      </div>
                    </div>

                    {!readOnly && (
                      <button
                        onClick={() => removeItem(item.id)}
                        className="ml-2 text-red-400 hover:text-red-300 p-1 hover:bg-red-900/30 rounded"
                        title="Remove item"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  {renderItemStats(item)}
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Empty State */}
      {inventory.length === 0 && (
        <div className="bg-white/5 rounded-lg p-8 border border-white/10 text-center">
          <p className="text-gray-500 mb-4">No items in inventory</p>
          {!readOnly && (
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
            >
              + Add Your First Item
            </button>
          )}
        </div>
      )}

      {/* Add Item Button */}
      {!readOnly && inventory.length > 0 && (
        <button
          onClick={() => setShowAddModal(true)}
          className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
        >
          + Add Item
        </button>
      )}

      {readOnly && (
        <p className="text-gray-500 text-sm text-center">👁️ Read-only view</p>
      )}
    </div>
  );
}
