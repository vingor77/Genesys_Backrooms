import React from 'react';

export default function CharacterInventory({ character, onSave, readOnly }) {
  const inventory = character?.inventory || [];
  const totalEncumbrance = inventory.reduce((sum, item) => sum + ((item.encumbrance || 0) * (item.quantity || 1)), 0);
  const maxEncumbrance = character?.maxEncumbrance || (5 + (character?.characteristics?.brawn || 2));

  return (
    <div className="space-y-6">
      <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4 text-yellow-300">
        <strong>Inventory</strong> - To be implemented
        <p className="text-sm text-yellow-400 mt-1">
          Items with Name, Quantity, Encumbrance, Price, Notes, Equipped status, DB link or custom
        </p>
      </div>

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
      </div>

      {/* Categories Placeholder */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {['Weapons', 'Armor', 'Consumables', 'Misc'].map(cat => (
          <button key={cat} className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-gray-300 transition-colors">
            {cat}
          </button>
        ))}
      </div>

      {/* Inventory List Placeholder */}
      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold">Items</h3>
          {!readOnly && (
            <button className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-lg transition-colors">
              + Add Item
            </button>
          )}
        </div>
        
        {inventory.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No items in inventory</p>
        ) : (
          <p className="text-gray-500 text-center py-8">Item list will render here</p>
        )}
      </div>
      
      {readOnly && (
        <p className="text-gray-500 text-sm text-center">👁️ Read-only view</p>
      )}
    </div>
  );
}