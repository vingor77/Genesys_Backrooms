import React, { useState, useEffect } from 'react';

export default function CharacterEquipped({ character, onSave, readOnly }) {
  const [equipped, setEquipped] = useState(character?.equipped || {});
  const [showEquipModal, setShowEquipModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const inventory = character?.inventory || [];

  // Sync with character prop changes
  useEffect(() => {
    setEquipped(character?.equipped || {});
  }, [character]);

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

  // Get equipped item for a slot
  const getEquippedItem = (slotId) => {
    const itemId = equipped[slotId];
    if (!itemId) return null;
    return inventory.find(item => item.id === itemId);
  };

  // Get available items for a slot (filtered by equippedTo field)
  const getAvailableItems = (slotId) => {
    // Check if this is a weapon slot
    const filtered = [];
    for (let i = 0; i < inventory.length; i++) {
      console.log(inventory[i])
      if (inventory[i].category === 'Armor' && inventory[i].equippedTo.toLowerCase() === slotId && (slotId !== "mainHand" && slotId !== "offHand")) {
        filtered.push(inventory[i]);
      }
      else if (inventory[i].category === 'Weapon' && (inventory[i].equippedTo.toLowerCase() === slotId || inventory[i].equippedTo === "Two-Handed") && (slotId === "mainHand" || slotId === "offHand")) {
        filtered.push(inventory[i]);
      }
    }
    return filtered;
  };

  // Equip item to slot
  const equipItem = (slotId, itemId) => {
    const item = inventory.find(i => i.id === itemId);
    if (!item) return;

    const newEquipped = { ...equipped };

    // If two-handed weapon, occupy both hands with the SAME item ID
    if (item.equippedTo === 'Two-Handed') {
      // Unequip anything in both hands
      delete newEquipped.mainHand;
      delete newEquipped.offHand;
      // Set BOTH slots to the same item ID
      newEquipped.mainHand = itemId;
      newEquipped.offHand = itemId;
    } else {
      // If equipping to mainHand or offHand, check if there's a two-handed weapon
      if (slotId === 'mainHand' || slotId === 'offHand') {
        const mainHandItem = inventory.find(i => i.id === newEquipped.mainHand);
        const offHandItem = inventory.find(i => i.id === newEquipped.offHand);

        // If there's a two-handed weapon, clear both slots
        if (mainHandItem?.twoHanded || offHandItem?.twoHanded) {
          delete newEquipped.mainHand;
          delete newEquipped.offHand;
        }
      }

      // Equip to the selected slot
      newEquipped[slotId] = itemId;
    }

    setEquipped(newEquipped);
    setShowEquipModal(false);
    setSelectedSlot(null);

    // Save to parent
    if (onSave) {
      onSave({ ...character, equipped: newEquipped });
    }
  };

  // Unequip item from slot
  const unequipItem = (slotId) => {
    const newEquipped = { ...equipped };

    // If unequipping a two-handed weapon, clear BOTH slots
    const item = getEquippedItem(slotId);
    if (item?.equippedTo === 'Two-Handed') {
      delete newEquipped.mainHand;
      delete newEquipped.offHand;
    } else {
      delete newEquipped[slotId];
    }

    setEquipped(newEquipped);

    // Save to parent
    if (onSave) {
      onSave({ ...character, equipped: newEquipped });
    }
  };

  // Open equip modal for a slot
  const openEquipModal = (slotId) => {
    if (readOnly) return;
    setSelectedSlot(slotId);
    setShowEquipModal(true);
  };

  // Calculate armor encumbrance reduction (up to 3 per armor piece)
  const getArmorEncumbranceReduction = () => {
    let reduction = 0;

    // Check all armor slots
    armorSlots.forEach(slot => {
      const item = getEquippedItem(slot.id);
      if (item && item.category === 'Armor') {
        const itemEnc = item.encumbrance || 0;
        // Reduce by up to 3 per armor piece
        reduction += Math.min(itemEnc, 3);
      }
    });

    return reduction;
  };

  // Calculate total encumbrance with armor reduction
  const calculateTotalEncumbrance = () => {
    const baseEncumbrance = inventory.reduce((sum, item) => {
      return sum + ((item.encumbrance || 0) * (item.quantity || 1));
    }, 0);

    const armorReduction = getArmorEncumbranceReduction();
    return Math.max(0, baseEncumbrance - armorReduction);
  };

  // Calculate equipment bonuses
  const calculateBonuses = () => {
    let totalSoak = 0;
    let totalMeleeDefense = 0;
    let totalRangedDefense = 0;

    // Check all equipped items
    [...armorSlots, ...weaponSlots].forEach(slot => {
      const item = getEquippedItem(slot.id);
      if (item) {
        totalSoak += item.soak || 0;
        totalMeleeDefense += item.meleeDefense || 0;
        totalRangedDefense += item.rangedDefense || 0;
      }
    });

    return { totalSoak, totalMeleeDefense, totalRangedDefense };
  };

  // Render item stats
  const renderItemStats = (item) => {
    if (!item) return null;

    return (
      <div className="mt-2 space-y-1">
        {item.damage && (
          <div className="text-xs text-red-300">⚔️ Damage: {item.damage}</div>
        )}
        {item.critical && (
          <div className="text-xs text-orange-300">💥 Crit: {item.critical}</div>
        )}
        {item.range && (
          <div className="text-xs text-yellow-300">🎯 Range: {item.range}</div>
        )}
        {item.soak && (
          <div className="text-xs text-blue-300">🛡️ Soak: +{item.soak}</div>
        )}
        {item.meleeDefense && (
          <div className="text-xs text-cyan-300">⚔️ Melee Def: +{item.melee_defense}</div>
        )}
        {item.rangedDefense && (
          <div className="text-xs text-teal-300">🏹 Ranged Def: +{item.ranged_defense}</div>
        )}
        {item.encumbrance > 0 && (
          <div className="text-xs text-amber-300">
            📦 Enc: {item.encumbrance}
            {item.category === 'Armor' && ` (-${Math.min(item.encumbrance, 3)} when worn)`}
          </div>
        )}
        {item.special && (
          <div className="text-xs text-indigo-300">✨ {item.special}</div>
        )}
      </div>
    );
  };

  const bonuses = calculateBonuses();
  const totalEncumbrance = calculateTotalEncumbrance();
  const maxEncumbrance = character?.maxEncumbrance || (5 + (character?.characteristics?.brawn || 2));
  const armorReduction = getArmorEncumbranceReduction();

  return (
    <div className="space-y-6">
      {/* Equip Modal */}
      {showEquipModal && selectedSlot && (
        <div className="fixed inset-0 bg-black/80 z-50 overflow-y-auto">
          <div className="min-h-screen px-4 py-8">
            <div className="bg-gray-800 rounded-xl border border-gray-600 w-full max-w-2xl mx-auto">
              <div className="p-6 border-b border-gray-700 flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">
                  Equip to {weaponSlots.find(s => s.id === selectedSlot)?.label || armorSlots.find(s => s.id === selectedSlot)?.label}
                </h3>
                <button onClick={() => setShowEquipModal(false)} className="text-gray-400 hover:text-white p-2">✕</button>
              </div>

              <div className="p-6">
                {/* Currently Equipped */}
                {getEquippedItem(selectedSlot) && (
                  <div className="mb-4 p-4 bg-gray-700 rounded-lg border border-gray-600">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="text-white font-medium mb-1">Currently Equipped:</div>
                        <div className="text-lg text-indigo-300">{getEquippedItem(selectedSlot).name}</div>
                        {renderItemStats(getEquippedItem(selectedSlot))}
                      </div>
                      <button
                        onClick={() => unequipItem(selectedSlot)}
                        className="ml-2 px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors"
                      >
                        Unequip
                      </button>
                    </div>
                  </div>
                )}

                {/* Available Items */}
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {getAvailableItems(selectedSlot).length === 0 ? (
                    <p className="text-gray-500 text-center py-8">
                      No items available for this slot.
                      <br />
                      <span className="text-sm">Add items with "equippedTo" field in inventory.</span>
                    </p>
                  ) : (
                    getAvailableItems(selectedSlot).map(item => (
                      <button
                        key={item.id}
                        onClick={() => equipItem(selectedSlot, item.id)}
                        className="w-full text-left p-4 bg-gray-700 hover:bg-gray-600 rounded-lg border border-gray-600 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="text-white font-medium text-lg">{item.name}</h4>
                              <span className="px-2 py-0.5 text-xs rounded bg-gray-600 text-gray-300">
                                {item.category}
                              </span>
                              {item.twoHanded && (
                                <span className="px-2 py-0.5 text-xs rounded bg-amber-600 text-amber-200">
                                  Two-Handed
                                </span>
                              )}
                            </div>
                            {item.description && (
                              <p className="text-gray-400 text-sm mb-2">{item.description}</p>
                            )}
                            {renderItemStats(item)}
                          </div>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Encumbrance with Armor Reduction */}
      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-white font-semibold">Encumbrance</h3>
          <div className={`text-lg font-bold ${totalEncumbrance > maxEncumbrance ? 'text-red-400' : 'text-green-400'}`}>
            {totalEncumbrance} / {maxEncumbrance}
          </div>
        </div>
        {armorReduction > 0 && (
          <div className="text-sm text-blue-300 mb-2">
            🛡️ Armor reduces encumbrance by {armorReduction}
          </div>
        )}
        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all ${totalEncumbrance > maxEncumbrance ? 'bg-red-500' : 'bg-green-500'}`}
            style={{ width: `${Math.min((totalEncumbrance / maxEncumbrance) * 100, 100)}%` }}
          />
        </div>
        {totalEncumbrance > maxEncumbrance && (
          <p className="text-red-400 text-sm mt-2">⚠️ Overencumbered! Suffer penalties to actions.</p>
        )}
      </div>

      {/* Weapons Section */}
      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
        <h3 className="text-white font-semibold mb-4">⚔️ Weapons</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {weaponSlots.map(slot => {
            const item = getEquippedItem(slot.id);
            const mainHandItem = getEquippedItem('mainHand');
            const isDisabled = slot.id === 'offHand' && mainHandItem?.twoHanded;

            return (
              <div 
                key={slot.id} 
                onClick={() => !isDisabled && openEquipModal(slot.id)}
                className={`bg-black/30 rounded-lg p-4 border border-white/10 transition-all ${
                  !readOnly && !isDisabled ? 'cursor-pointer hover:bg-black/50 hover:border-indigo-500' : ''
                } ${isDisabled ? 'opacity-50' : ''}`}
              >
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-2xl">{slot.icon}</span>
                  <span className="text-gray-400">{slot.label}</span>
                </div>
                {isDisabled ? (
                  <p className="text-gray-600 text-sm">Occupied by two-handed weapon</p>
                ) : item ? (
                  <div className="text-white">
                    <div className="font-medium text-lg mb-1">{item.name}</div>
                    {renderItemStats(item)}
                  </div>
                ) : (
                  <p className="text-gray-600 text-sm">Empty slot - Click to equip</p>
                )}
              </div>
            );
          })}
        </div>
        <p className="text-gray-500 text-xs mt-2">* Two-handed weapons occupy both slots</p>
      </div>

      {/* Armor Section */}
      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
        <h3 className="text-white font-semibold mb-4">🛡️ Armor & Accessories</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {armorSlots.map(slot => {
            const item = getEquippedItem(slot.id);

            return (
              <div 
                key={slot.id} 
                onClick={() => openEquipModal(slot.id)}
                className={`bg-black/30 rounded-lg p-3 border border-white/10 transition-all ${
                  !readOnly ? 'cursor-pointer hover:bg-black/50 hover:border-indigo-500' : ''
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-1">{slot.icon}</div>
                  <div className="text-gray-400 text-xs mb-2">{slot.label}</div>
                  {item ? (
                    <div className="text-white">
                      <div className="text-sm font-medium truncate mb-1" title={item.name}>
                        {item.name}
                      </div>
                      {renderItemStats(item)}
                    </div>
                  ) : (
                    <div className="text-gray-600 text-xs">Empty</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Total Defense/Soak from Equipment */}
      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
        <h3 className="text-white font-semibold mb-4">Equipment Bonuses</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-blue-900/30 rounded-lg p-4 border border-blue-600/50">
            <div className="text-blue-400 text-sm mb-1">Total Soak Bonus</div>
            <div className="text-blue-200 text-2xl font-bold">+{bonuses.totalSoak}</div>
          </div>
          <div className="bg-cyan-900/30 rounded-lg p-4 border border-cyan-600/50">
            <div className="text-cyan-400 text-sm mb-1">Melee Defense</div>
            <div className="text-cyan-200 text-2xl font-bold">+{bonuses.totalMeleeDefense}</div>
          </div>
          <div className="bg-teal-900/30 rounded-lg p-4 border border-teal-600/50">
            <div className="text-teal-400 text-sm mb-1">Ranged Defense</div>
            <div className="text-teal-200 text-2xl font-bold">+{bonuses.totalRangedDefense}</div>
          </div>
        </div>
      </div>

      {readOnly && (
        <p className="text-gray-500 text-sm text-center">👁️ Read-only view</p>
      )}
    </div>
  );
}
