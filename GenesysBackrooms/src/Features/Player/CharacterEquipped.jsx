import React from 'react';

export default function CharacterEquipped({ character, onSave, readOnly }) {
  const equipped = character?.equipped || {};
  
  const armorSlots = [
    { id: 'head', label: 'Head', icon: '🎩' },
    { id: 'neck', label: 'Neck', icon: '📿' },
    { id: 'ear', label: 'Ear', icon: '👂' },
    { id: 'chest', label: 'Chest', icon: '👕' },
    { id: 'arms', label: 'Arms', icon: '💪' },
    { id: 'wrist', label: 'Wrist', icon: '⌚' },
    { id: 'leftRing', label: 'Left Ring', icon: '💍' },
    { id: 'rightRing', label: 'Right Ring', icon: '💍' },
    { id: 'legs', label: 'Legs', icon: '👖' },
    { id: 'feet', label: 'Feet', icon: '👟' },
  ];

  const weaponSlots = [
    { id: 'mainHand', label: 'Main Hand', icon: '🗡️' },
    { id: 'offHand', label: 'Off Hand', icon: '🛡️' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4 text-yellow-300">
        <strong>Equipped</strong> - To be implemented
        <p className="text-sm text-yellow-400 mt-1">
          Armor slots (10) + Weapon slots (Main/Off, two-handed support), inline stats display
        </p>
      </div>

      {/* Weapons Section */}
      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
        <h3 className="text-white font-semibold mb-4">⚔️ Weapons</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {weaponSlots.map(slot => (
            <div key={slot.id} className="bg-black/30 rounded-lg p-4 border border-white/10">
              <div className="flex items-center space-x-3 mb-2">
                <span className="text-2xl">{slot.icon}</span>
                <span className="text-gray-400">{slot.label}</span>
              </div>
              {equipped[slot.id] ? (
                <div className="text-white">
                  <div className="font-medium">{equipped[slot.id].name}</div>
                  <div className="text-sm text-gray-400">Stats will show here</div>
                </div>
              ) : (
                <p className="text-gray-600 text-sm">Empty slot</p>
              )}
            </div>
          ))}
        </div>
        <p className="text-gray-500 text-xs mt-2">* Two-handed weapons occupy both slots</p>
      </div>

      {/* Armor Section */}
      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
        <h3 className="text-white font-semibold mb-4">🛡️ Armor & Accessories</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {armorSlots.map(slot => (
            <div key={slot.id} className="bg-black/30 rounded-lg p-3 border border-white/10 text-center">
              <div className="text-2xl mb-1">{slot.icon}</div>
              <div className="text-gray-400 text-xs mb-2">{slot.label}</div>
              {equipped[slot.id] ? (
                <div className="text-white text-sm truncate" title={equipped[slot.id].name}>
                  {equipped[slot.id].name}
                </div>
              ) : (
                <div className="text-gray-600 text-xs">Empty</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Total Defense/Soak from Equipment */}
      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
        <h3 className="text-white font-semibold mb-2">Equipment Bonuses</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-gray-400 text-sm">Total Soak Bonus</div>
            <div className="text-white text-xl font-bold">+0</div>
          </div>
          <div>
            <div className="text-gray-400 text-sm">Melee Defense</div>
            <div className="text-white text-xl font-bold">+0</div>
          </div>
          <div>
            <div className="text-gray-400 text-sm">Ranged Defense</div>
            <div className="text-white text-xl font-bold">+0</div>
          </div>
        </div>
      </div>
      
      {readOnly && (
        <p className="text-gray-500 text-sm text-center">👁️ Read-only view</p>
      )}
    </div>
  );
}