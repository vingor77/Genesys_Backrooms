import React, { useState, useEffect } from 'react';

export default function EncounterTracker({ session, onSave, readOnly }) {
  const [activeEncounter, setActiveEncounter] = useState(null);
  const [showAddCombatantModal, setShowAddCombatantModal] = useState(false);
  const [showInitiativeModal, setShowInitiativeModal] = useState(false);
  const [newCombatant, setNewCombatant] = useState({
    name: '',
    type: 'npc',
    successes: 0,
    advantages: 0,
    triumphs: 0
  });

  // Save to session when encounter changes
  useEffect(() => {
    if (onSave && activeEncounter) {
      onSave({ ...session, activeEncounter });
    }
  }, [activeEncounter]);

  // Auto-regenerate initiative slots when combatants change
  useEffect(() => {
    if (activeEncounter?.slots?.length > 0 && activeEncounter?.combatants?.length > 0) {
      // Only auto-regenerate if slots already exist
      const sorted = [...activeEncounter.combatants].sort((a, b) => {
        if (b.successes !== a.successes) return b.successes - a.successes;
        if (b.triumphs !== a.triumphs) return b.triumphs - a.triumphs;
        return b.advantages - a.advantages;
      });

      const newSlots = sorted.map((combatant, index) => ({
        id: Date.now() + index,
        slotNumber: index + 1,
        type: combatant.type,
        successes: combatant.successes,
        advantages: combatant.advantages,
        triumphs: combatant.triumphs,
        hasGone: false
      }));

      setActiveEncounter(prev => ({
        ...prev,
        slots: newSlots,
        currentSlot: 0
      }));
    }
  }, [activeEncounter?.combatants]);


  // Start new encounter
  const startNewEncounter = () => {
    setActiveEncounter({
      name: 'New Encounter',
      round: 1,
      currentSlot: 0,
      slots: [],
      combatants: []
    });
    setShowInitiativeModal(true);
  };

  // Add combatant to initiative pool
  const addCombatant = () => {
    if (!newCombatant.name.trim()) return;

    const combatant = {
      id: Date.now(),
      ...newCombatant,
      hasGone: false
    };

    setActiveEncounter(prev => ({
      ...prev,
      combatants: [...(prev.combatants || []), combatant]
    }));

    setNewCombatant({
      name: '',
      type: 'npc',
      successes: 0,
      advantages: 0,
      triumphs: 0
    });
  };

  // Generate initiative slots
  const generateInitiativeSlots = () => {
    if (!activeEncounter?.combatants?.length) return;

    // Sort by successes (desc), then triumphs (desc), then advantages (desc)
    const sorted = [...activeEncounter.combatants].sort((a, b) => {
      if (b.successes !== a.successes) return b.successes - a.successes;
      if (b.triumphs !== a.triumphs) return b.triumphs - a.triumphs;
      return b.advantages - a.advantages;
    });

    // Create slots based on initiative results
    const slots = sorted.map((combatant, index) => ({
      id: Date.now() + index,
      slotNumber: index + 1,
      type: combatant.type,
      successes: combatant.successes,
      advantages: combatant.advantages,
      triumphs: combatant.triumphs,
      hasGone: false
    }));

    setActiveEncounter(prev => ({
      ...prev,
      slots,
      currentSlot: 0
    }));

    setShowInitiativeModal(false);
  };

  // Mark slot as gone
  const markSlotGone = (slotId) => {
    if (readOnly) return;

    setActiveEncounter(prev => ({
      ...prev,
      slots: prev.slots.map(slot =>
        slot.id === slotId ? { ...slot, hasGone: true } : slot
      ),
      currentSlot: Math.min(prev.currentSlot + 1, prev.slots.length)
    }));
  };

  // Next round
  const nextRound = () => {
    if (readOnly) return;

    setActiveEncounter(prev => ({
      ...prev,
      round: prev.round + 1,
      currentSlot: 0,
      slots: prev.slots.map(slot => ({ ...slot, hasGone: false }))
    }));
  };

  // Move slot up/down
  const moveSlot = (slotId, direction) => {
    if (readOnly) return;

    setActiveEncounter(prev => {
      const slots = [...prev.slots];
      const index = slots.findIndex(s => s.id === slotId);
      if (index === -1) return prev;

      const newIndex = direction === 'up' ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= slots.length) return prev;

      [slots[index], slots[newIndex]] = [slots[newIndex], slots[index]];

      // Update slot numbers
      slots.forEach((slot, idx) => {
        slot.slotNumber = idx + 1;
      });

      return { ...prev, slots };
    });
  };

  // Delete slot
  const deleteSlot = (slotId) => {
    if (readOnly) return;

    setActiveEncounter(prev => ({
      ...prev,
      slots: prev.slots.filter(s => s.id !== slotId).map((slot, idx) => ({
        ...slot,
        slotNumber: idx + 1
      }))
    }));
  };

  // Delete combatant
  const deleteCombatant = (combatantId) => {
    if (readOnly) return;

    setActiveEncounter(prev => ({
      ...prev,
      combatants: prev.combatants.filter(c => c.id !== combatantId)
    }));
  };

  // Add new slot manually
  const addNewSlot = (type) => {
    if (readOnly) return;

    setActiveEncounter(prev => ({
      ...prev,
      slots: [...prev.slots, {
        id: Date.now(),
        slotNumber: prev.slots.length + 1,
        type,
        successes: 0,
        advantages: 0,
        triumphs: 0,
        hasGone: false
      }]
    }));
  };

  // End encounter
  const endEncounter = () => {
    if (readOnly) return;
    setActiveEncounter(null);
  };

  // Render dice result display
  const renderDiceResult = (successes, advantages, triumphs) => {
    return (
      <div className="flex gap-2 items-center text-sm">
        {triumphs > 0 && (
          <span className="bg-yellow-600/30 text-yellow-300 px-2 py-0.5 rounded font-semibold">
            ★ {triumphs}
          </span>
        )}
        {successes > 0 && (
          <span className="bg-green-600/30 text-green-300 px-2 py-0.5 rounded">
            ✓ {successes}
          </span>
        )}
        {advantages > 0 && (
          <span className="bg-blue-600/30 text-blue-300 px-2 py-0.5 rounded">
            ⚡ {advantages}
          </span>
        )}
      </div>
    );
  };

  if (!activeEncounter) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Encounter Tracker</h2>
            <p className="text-gray-400">Genesys slot-based initiative system</p>
          </div>
        </div>

        <div className="bg-white/5 rounded-lg p-12 border border-white/10 text-center">
          <div className="text-6xl mb-4">⚔️</div>
          <p className="text-gray-400 text-lg mb-4">No active encounter</p>
          <p className="text-gray-500 text-sm mb-6">
            Start a new encounter to track initiative slots and combat
          </p>
          {!readOnly && (
            <button 
              onClick={startNewEncounter}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-medium"
            >
              Start New Encounter
            </button>
          )}
        </div>

        <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
          <h4 className="text-purple-300 font-medium mb-2">🎲 Genesys Initiative System</h4>
          <ul className="text-purple-400 text-sm space-y-1">
            <li>• <strong>Slot-based:</strong> PC and NPC/Adversary slots determined by initiative rolls</li>
            <li>• <strong>Flexible:</strong> Any PC can act in a PC slot, any NPC in an NPC slot</li>
            <li>• <strong>Cool or Vigilance:</strong> Roll initiative using appropriate skill</li>
            <li>• <strong>Triumphs, Successes & Advantages:</strong> Track all three for proper ordering</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Encounter Tracker</h2>
          <p className="text-gray-400">Round {activeEncounter.round}</p>
        </div>
        {!readOnly && (
          <div className="flex gap-2">
            <button 
              onClick={nextRound}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium"
            >
              Next Round
            </button>
            <button 
              onClick={endEncounter}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
            >
              End Encounter
            </button>
          </div>
        )}
      </div>

      {/* Initiative Slots */}
      <div className="bg-white/5 rounded-lg p-6 border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">Initiative Slots</h3>
          {!readOnly && (
            <div className="flex gap-2">
              <button
                onClick={() => addNewSlot('pc')}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
              >
                + PC Slot
              </button>
              <button
                onClick={() => addNewSlot('npc')}
                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors"
              >
                + NPC Slot
              </button>
            </div>
          )}
        </div>

        {activeEncounter.slots?.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No initiative slots yet</p>
            {!readOnly && (
              <button
                onClick={() => setShowInitiativeModal(true)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
              >
                Roll Initiative
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {activeEncounter.slots.map((slot, index) => {
              const isCurrent = index === activeEncounter.currentSlot && !slot.hasGone;

              return (
                <div
                  key={slot.id}
                  className={`rounded-lg p-4 border-2 transition-all ${
                    isCurrent 
                      ? 'border-yellow-500 bg-yellow-500/10' 
                      : slot.hasGone
                      ? 'border-gray-600 bg-gray-800/30 opacity-60'
                      : slot.type === 'pc'
                      ? 'border-blue-500/30 bg-blue-900/20'
                      : 'border-red-500/30 bg-red-900/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      {/* Slot Number */}
                      <div className={`text-2xl font-bold ${
                        isCurrent ? 'text-yellow-400' : 'text-gray-500'
                      }`}>
                        #{slot.slotNumber}
                      </div>

                      {/* Type Badge */}
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        slot.type === 'pc'
                          ? 'bg-blue-600/30 text-blue-300'
                          : 'bg-red-600/30 text-red-300'
                      }`}>
                        {slot.type === 'pc' ? '🛡️ PC' : '⚔️ NPC/Adversary'}
                      </span>

                      {/* Dice Result */}
                      {renderDiceResult(slot.successes, slot.advantages, slot.triumphs)}

                      {/* Status */}
                      {slot.hasGone && (
                        <span className="text-green-400 text-sm">✓ Gone</span>
                      )}
                      {isCurrent && (
                        <span className="text-yellow-400 text-sm font-semibold animate-pulse">
                          ▶ Current Turn
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    {!readOnly && (
                      <div className="flex gap-2">
                        {!slot.hasGone && (
                          <button
                            onClick={() => markSlotGone(slot.id)}
                            className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition-colors"
                          >
                            Mark Done
                          </button>
                        )}
                        <button
                          onClick={() => moveSlot(slot.id, 'up')}
                          disabled={index === 0}
                          className="px-2 py-1 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          ▲
                        </button>
                        <button
                          onClick={() => moveSlot(slot.id, 'down')}
                          disabled={index === activeEncounter.slots.length - 1}
                          className="px-2 py-1 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          ▼
                        </button>
                        <button
                          onClick={() => deleteSlot(slot.id)}
                          className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors"
                        >
                          🗑️
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Combatants Panel */}
      <div className="bg-white/5 rounded-lg p-6 border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">Combatants</h3>
          {!readOnly && (
            <button
              onClick={() => setShowAddCombatantModal(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors text-sm font-medium"
            >
              + Add Combatant
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {activeEncounter.combatants?.map(combatant => (
            <div
              key={combatant.id}
              className={`rounded-lg p-4 border ${
                combatant.type === 'pc'
                  ? 'border-blue-500/30 bg-blue-900/20'
                  : 'border-red-500/30 bg-red-900/20'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="text-white font-semibold">{combatant.name}</div>
                  <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium mt-1 ${
                    combatant.type === 'pc'
                      ? 'bg-blue-600/30 text-blue-300'
                      : 'bg-red-600/30 text-red-300'
                  }`}>
                    {combatant.type.toUpperCase()}
                  </span>
                </div>
                {!readOnly && (
                  <button
                    onClick={() => deleteCombatant(combatant.id)}
                    className="text-red-400 hover:text-red-300 text-sm"
                  >
                    🗑️
                  </button>
                )}
              </div>

              <div className="mt-3">
                {renderDiceResult(combatant.successes, combatant.advantages, combatant.triumphs)}
              </div>
            </div>
          ))}

          {!activeEncounter.combatants?.length && (
            <div className="col-span-full text-center py-8 text-gray-500">
              No combatants added yet
            </div>
          )}
        </div>
      </div>

      {/* Add Combatant Modal */}
      {showAddCombatantModal && !readOnly && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-4">Add Combatant</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                <input
                  type="text"
                  value={newCombatant.name}
                  onChange={(e) => setNewCombatant(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-indigo-500 outline-none"
                  placeholder="Character or NPC name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Type</label>
                <select
                  value={newCombatant.type}
                  onChange={(e) => setNewCombatant(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-indigo-500 outline-none"
                >
                  <option value="pc">PC</option>
                  <option value="npc">NPC/Adversary</option>
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Triumphs</label>
                  <input
                    type="number"
                    min="0"
                    value={newCombatant.triumphs}
                    onChange={(e) => setNewCombatant(prev => ({ ...prev, triumphs: Number(e.target.value) }))}
                    className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Successes</label>
                  <input
                    type="number"
                    min="0"
                    value={newCombatant.successes}
                    onChange={(e) => setNewCombatant(prev => ({ ...prev, successes: Number(e.target.value) }))}
                    className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Advantages</label>
                  <input
                    type="number"
                    min="0"
                    value={newCombatant.advantages}
                    onChange={(e) => setNewCombatant(prev => ({ ...prev, advantages: Number(e.target.value) }))}
                    className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  addCombatant();
                  setShowAddCombatantModal(false);
                }}
                className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-medium"
              >
                Add
              </button>
              <button
                onClick={() => {
                  setShowAddCombatantModal(false);
                  setNewCombatant({ name: '', type: 'npc', successes: 0, advantages: 0, triumphs: 0 });
                }}
                className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Initiative Roll Modal */}
      {showInitiativeModal && !readOnly && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-3xl w-full mx-4 border border-gray-700 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-white mb-4">Roll Initiative</h3>

            <div className="mb-6">
              <p className="text-gray-400 mb-4">Add all combatants with their initiative results (Cool or Vigilance)</p>

              <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 mb-4">
                <h4 className="text-blue-300 font-medium mb-3">Add Combatant</h4>
                <div className="grid grid-cols-1 gap-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                      <input
                        type="text"
                        value={newCombatant.name}
                        onChange={(e) => setNewCombatant(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-indigo-500 outline-none"
                        placeholder="Name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Type</label>
                      <select
                        value={newCombatant.type}
                        onChange={(e) => setNewCombatant(prev => ({ ...prev, type: e.target.value }))}
                        className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-indigo-500 outline-none"
                      >
                        <option value="pc">PC</option>
                        <option value="npc">NPC</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Triumphs ★</label>
                      <input
                        type="number"
                        min="0"
                        value={newCombatant.triumphs}
                        onChange={(e) => setNewCombatant(prev => ({ ...prev, triumphs: Number(e.target.value) }))}
                        className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-indigo-500 outline-none"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Successes ✓</label>
                      <input
                        type="number"
                        min="0"
                        value={newCombatant.successes}
                        onChange={(e) => setNewCombatant(prev => ({ ...prev, successes: Number(e.target.value) }))}
                        className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-indigo-500 outline-none"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Advantages ⚡</label>
                      <input
                        type="number"
                        min="0"
                        value={newCombatant.advantages}
                        onChange={(e) => setNewCombatant(prev => ({ ...prev, advantages: Number(e.target.value) }))}
                        className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-indigo-500 outline-none"
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>
                <button
                  onClick={addCombatant}
                  className="mt-3 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded transition-colors text-sm font-medium"
                >
                  Add Combatant
                </button>
              </div>

              <div className="space-y-2">
                <h4 className="text-white font-medium mb-2">Combatants ({activeEncounter.combatants?.length || 0})</h4>
                {activeEncounter.combatants?.map(combatant => (
                  <div
                    key={combatant.id}
                    className={`rounded p-3 flex items-center justify-between ${
                      combatant.type === 'pc' ? 'bg-blue-900/30' : 'bg-red-900/30'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-white font-medium">{combatant.name}</span>
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        combatant.type === 'pc' ? 'bg-blue-600/30 text-blue-300' : 'bg-red-600/30 text-red-300'
                      }`}>
                        {combatant.type.toUpperCase()}
                      </span>
                      {renderDiceResult(combatant.successes, combatant.advantages, combatant.triumphs)}
                    </div>
                    <button
                      onClick={() => deleteCombatant(combatant.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      🗑️
                    </button>
                  </div>
                ))}
                {!activeEncounter.combatants?.length && (
                  <p className="text-gray-500 text-sm text-center py-4">No combatants added yet</p>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={generateInitiativeSlots}
                disabled={!activeEncounter.combatants?.length}
                className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Generate Initiative Slots
              </button>
              <button
                onClick={() => setShowInitiativeModal(false)}
                className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {readOnly && (
        <p className="text-gray-500 text-sm text-center">👁️ Read-only view</p>
      )}
    </div>
  );
}
