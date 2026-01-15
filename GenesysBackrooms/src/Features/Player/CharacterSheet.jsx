import React, { useState, useEffect, useRef } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import db from '../../Structural/Firebase';

// Skills organized by characteristic
const SKILLS_BY_CHARACTERISTIC = {
  brawn: [
    { id: 'athletics', name: 'Athletics', custom: false },
    { id: 'brawl', name: 'Brawl', custom: false },
    { id: 'melee', name: 'Melee', custom: false },
    { id: 'resilience', name: 'Resilience', custom: false },
    { id: 'metalworking', name: 'Metalworking', custom: true },
    { id: 'carpentry', name: 'Carpentry', custom: true },
  ],
  agility: [
    { id: 'coordination', name: 'Coordination', custom: false },
    { id: 'gunnery', name: 'Gunnery', custom: false },
    { id: 'ranged', name: 'Ranged', custom: false },
    { id: 'stealth', name: 'Stealth', custom: false },
    { id: 'leatherworking', name: 'Leatherworking', custom: true },
  ],
  intellect: [
    { id: 'computers', name: 'Computers', custom: false },
    { id: 'knowledge-education', name: 'Knowledge (Education)', custom: false },
    { id: 'knowledge-lore', name: 'Knowledge (Lore)', custom: true },
    { id: 'mechanics', name: 'Mechanics', custom: false },
    { id: 'medicine', name: 'Medicine', custom: false },
    { id: 'alchemy', name: 'Alchemy', custom: true },
  ],
  cunning: [
    { id: 'deception', name: 'Deception', custom: false },
    { id: 'perception', name: 'Perception', custom: false },
    { id: 'skulduggery', name: 'Skulduggery', custom: false },
    { id: 'streetwise', name: 'Streetwise', custom: false },
    { id: 'survival', name: 'Survival', custom: false },
    { id: 'scavenging', name: 'Scavenging', custom: true },
    { id: 'cooking', name: 'Cooking', custom: true },
  ],
  willpower: [
    { id: 'coercion', name: 'Coercion', custom: false },
    { id: 'discipline', name: 'Discipline', custom: false },
    { id: 'vigilance', name: 'Vigilance', custom: false },
    { id: 'fear', name: 'Fear', custom: true },
  ],
  presence: [
    { id: 'charm', name: 'Charm', custom: false },
    { id: 'cool', name: 'Cool', custom: false },
    { id: 'leadership', name: 'Leadership', custom: false },
    { id: 'negotiation', name: 'Negotiation', custom: false },
  ],
};

const CHARACTERISTIC_COLORS = {
  brawn: { bg: 'bg-red-900/30', border: 'border-red-700', text: 'text-red-300' },
  agility: { bg: 'bg-green-900/30', border: 'border-green-700', text: 'text-green-300' },
  intellect: { bg: 'bg-blue-900/30', border: 'border-blue-700', text: 'text-blue-300' },
  cunning: { bg: 'bg-yellow-900/30', border: 'border-yellow-700', text: 'text-yellow-300' },
  willpower: { bg: 'bg-purple-900/30', border: 'border-purple-700', text: 'text-purple-300' },
  presence: { bg: 'bg-pink-900/30', border: 'border-pink-700', text: 'text-pink-300' },
};

// Genesys Dice Components
const DiceProficiency = () => (
  <span className="inline-flex items-center justify-center w-5 h-5 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-sm transform rotate-45 mr-0.5" title="Proficiency">
    <span className="transform -rotate-45">P</span>
  </span>
);

const DiceAbility = () => (
  <span className="inline-flex items-center justify-center w-5 h-5 bg-green-500 text-green-900 text-xs font-bold rounded-full mr-0.5" title="Ability">
    A
  </span>
);

// Skill XP cost calculation
const getSkillCost = (newRank, isCareer) => {
  const base = 5 * newRank;
  return isCareer ? base : base + 5;
};

export default function CharacterSheet({ character, onSave, readOnly }) {
  const [editMode, setEditMode] = useState(false);
  const [localChar, setLocalChar] = useState(null);
  const [xpInputValue, setXpInputValue] = useState('');
  const xpDebounceTimer = useRef(null);
  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (xpDebounceTimer.current) {
        clearTimeout(xpDebounceTimer.current);
      }
    };
  }, []);
  // Sync xpInputValue when edit mode changes
  useEffect(() => {
    if (editMode) {
      setXpInputValue('');
    }
  }, [editMode]);


  const [critRoll, setCritRoll] = useState('');
  const [allTalents, setAllTalents] = useState([]);
  const [allCriticals, setAllCriticals] = useState([]);
  const [showTalentPicker, setShowTalentPicker] = useState(false);
  const [activeNote, setActiveNote] = useState(null);
  const [noteText, setNoteText] = useState('');

  // Load talents and criticals from Firestore
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load Talents
        const talentsSnap = await getDocs(query(collection(db, 'Talents'), orderBy('tier')));
        const talents = talentsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAllTalents(talents);

        // Load Critical Injuries
        const critsSnap = await getDocs(collection(db, 'CriticalInjuries'));
        const crits = critsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAllCriticals(crits);
      } catch (err) {
        console.error('Error loading data:', err);
      }
    };
    loadData();
  }, []);

  if (!character) {
    return (
      <div className="text-center py-12 text-gray-400">
        No character data available
      </div>
    );
  }

  const char = editMode && localChar ? localChar : character;
  const playerId = character.ownerId;

  const startEditing = () => {
    setLocalChar(JSON.parse(JSON.stringify(character)));
    setEditMode(true);
  };

  const cancelEditing = () => {
    setLocalChar(null);
    setEditMode(false);
  };

  const saveChanges = () => {
    if (onSave && localChar) {
      onSave({ ...localChar, lastUpdated: new Date().toISOString() });
      setEditMode(false);
      setLocalChar(null);
    }
  };

  const updateLocal = (path, value) => {
    if (!localChar) return;
    const newChar = JSON.parse(JSON.stringify(localChar));
    const keys = path.split('.');
    let obj = newChar;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!obj[keys[i]]) obj[keys[i]] = {};
      obj = obj[keys[i]];
    }
    obj[keys[keys.length - 1]] = value;
    setLocalChar(newChar);
  };

  // XP management
  const addXP = (amount) => {
    if (!localChar) return;
    const newAvailable = (localChar.xpAvailable || 0) + amount;
    const newTotal = (localChar.xpTotal || 0) + amount;
    setLocalChar({ ...localChar, xpAvailable: newAvailable, xpTotal: newTotal });
  };

  const spendXP = (amount) => {
    if (!localChar || (localChar.xpAvailable || 0) < amount) return false;
    setLocalChar({ ...localChar, xpAvailable: (localChar.xpAvailable || 0) - amount });
    return true;
  };

  // Skill management
  const updateSkill = (skillId, delta) => {
    if (!localChar) return;
    const currentRank = localChar.skills?.[skillId] || 0;
    const newRank = currentRank + delta;
    
    if (newRank < 0 || newRank > 5) return;
    
    const isCareer = localChar.careerSkills?.includes(skillId) || false;
    
    if (delta > 0) {
      const cost = getSkillCost(newRank, isCareer);
      if ((localChar.xpAvailable || 0) < cost) return; // Not enough XP
      
      const newSkills = { ...localChar.skills, [skillId]: newRank };
      setLocalChar({ 
        ...localChar, 
        skills: newSkills, 
        xpAvailable: (localChar.xpAvailable || 0) - cost 
      });
    } else {
      // Refund XP when decreasing
      const refund = getSkillCost(currentRank, isCareer);
      const newSkills = { ...localChar.skills };
      if (newRank <= 0) {
        delete newSkills[skillId];
      } else {
        newSkills[skillId] = newRank;
      }
      setLocalChar({ 
        ...localChar, 
        skills: newSkills, 
        xpAvailable: (localChar.xpAvailable || 0) + refund 
      });
    }
  };

  const getSkillRank = (skillId) => char.skills?.[skillId] || 0;
  const isCareerSkill = (skillId) => char.careerSkills?.includes(skillId) || false;
  const getCharValue = (charName) => char.characteristics?.[charName] || 0;

  // Dice pool rendering
  const renderDicePool = (characteristic, skillRank) => {
    const charValue = getCharValue(characteristic);
    const proficiency = Math.min(charValue, skillRank);
    const ability = Math.max(charValue, skillRank) - proficiency;
    
    const dice = [];
    for (let i = 0; i < proficiency; i++) dice.push(<DiceProficiency key={`p${i}`} />);
    for (let i = 0; i < ability; i++) dice.push(<DiceAbility key={`a${i}`} />);
    
    return dice.length > 0 ? <span className="flex items-center">{dice}</span> : <span className="text-gray-600 text-xs">—</span>;
  };

  // Critical injury by roll
  const addCriticalByRoll = () => {
    const roll = parseInt(critRoll);
    if (isNaN(roll)) return;
    
    // Find matching critical
    const crit = allCriticals.find(c => {
      const [min, max] = c.roll.split('-').map(Number);
      return roll >= min && roll <= max;
    });
    
    if (!crit) {
      alert(`No critical injury found for roll ${roll}`);
      return;
    }
    
    const criticals = [...(localChar?.criticalInjuries || []), {
      id: Date.now(),
      criticalId: crit.id,
      name: crit.name,
      severity: crit.severity,
      effect: crit.effect,
      roll: roll,
      addedAt: new Date().toISOString()
    }];
    setLocalChar({ ...localChar, criticalInjuries: criticals });
    setCritRoll('');
  };

  const removeCriticalInjury = (id) => {
    const criticals = (localChar?.criticalInjuries || []).filter(c => c.id !== id);
    setLocalChar({ ...localChar, criticalInjuries: criticals });
  };

  // Talent management
  const getTalentTimesBought = (talentId) => {
    const talent = allTalents.find(t => t.id === talentId);
    if (!talent?.timesBought) return 0;
    return talent.timesBought[playerId] || 0;
  };

  const getPlayerTalentCount = (talentId) => {
    // Count from character's local talents
    return (char.talents || []).filter(t => t.talentId === talentId).length;
  };

  const getTalentEffectiveTier = (talent) => {
    const timesBought = getPlayerTalentCount(talent.id);
    if (!talent.ranked) return talent.tier;
    return Math.min(talent.tier + timesBought, 5);
  };

  const canBuyTalent = (talent) => {
    if (!localChar) return false;
    
    const effectiveTier = getTalentEffectiveTier(talent);
    const cost = effectiveTier * 5;
    
    // Check XP
    if ((localChar.xpAvailable || 0) < cost) return false;
    
    // Check if non-ranked and already owned
    if (!talent.ranked && getPlayerTalentCount(talent.id) > 0) return false;
    
    // Check tier requirements
    // To buy the Nth talent of tier T, you need 2*N talents of tier T-1
    // And those tier T-1 talents need 2 talents of tier T-2 each, etc.
    if (effectiveTier > 1) {
      const talentsByTier = {};
      (localChar.talents || []).forEach(t => {
        const tier = t.effectiveTier || t.tier || 1;
        talentsByTier[tier] = (talentsByTier[tier] || 0) + 1;
      });
      
      // Count how many of this tier we already have
      const currentCount = talentsByTier[effectiveTier] || 0;
      
      // For each previous tier, check if we have enough
      // To buy (currentCount + 1) talents of tier T, we need:
      // - 2 * (currentCount + 1) of tier T-1
      // - 4 * (currentCount + 1) of tier T-2
      // - 8 * (currentCount + 1) of tier T-3, etc.
      for (let checkTier = effectiveTier - 1; checkTier >= 1; checkTier--) {
        const depthDiff = effectiveTier - checkTier;
        const required = Math.pow(2, depthDiff) * (currentCount + 1);
        if ((talentsByTier[checkTier] || 0) < required) return false;
      }
    }
    
    return true;
  };

  const buyTalent = (talent) => {
    if (!canBuyTalent(talent)) return;
    
    const effectiveTier = getTalentEffectiveTier(talent);
    const cost = effectiveTier * 5;
    
    const newTalent = {
      id: Date.now(),
      talentId: talent.id,
      name: talent.name,
      tier: talent.tier,
      effectiveTier: effectiveTier,
      effect: talent.effect,
      ranked: talent.ranked,
      activation: talent.activation,
      purchasedAt: new Date().toISOString()
    };
    
    setLocalChar({
      ...localChar,
      talents: [...(localChar.talents || []), newTalent],
      xpAvailable: (localChar.xpAvailable || 0) - cost
    });
  };

  const removeTalent = (talentInstanceId) => {
    const talent = (localChar?.talents || []).find(t => t.id === talentInstanceId);
    if (!talent) return;
    
    // Refund XP
    const refund = (talent.effectiveTier || talent.tier) * 5;
    
    setLocalChar({
      ...localChar,
      talents: (localChar.talents || []).filter(t => t.id !== talentInstanceId),
      xpAvailable: (localChar.xpAvailable || 0) + refund
    });
  };

  // Notes management
  const addNote = () => {
    const notes = [...(localChar?.notes || []), {
      id: Date.now(),
      title: 'New Note',
      text: '',
      addedAt: new Date().toISOString()
    }];
    setLocalChar({ ...localChar, notes: notes });
  };

  const updateNote = (id, updates) => {
    if (editMode) {
      // In edit mode, update localChar
      const notes = (localChar?.notes || []).map(n => 
        n.id === id ? { ...n, ...updates, editedAt: new Date().toISOString() } : n
      );
      setLocalChar({ ...localChar, notes: notes });
    } else {
      // Not in edit mode, update directly (for title changes in modal)
      const notes = (char?.notes || []).map(n => 
        n.id === id ? { ...n, ...updates, editedAt: new Date().toISOString() } : n
      );
      setLocalChar({ ...char, notes: notes });
    }
  };

  const removeNote = (id) => {
    const notes = (localChar?.notes || []).filter(n => n.id !== id);
    setLocalChar({ ...localChar, notes: notes });
    if (activeNote === id) setActiveNote(null);
  };

  const openNote = (note) => {
    setActiveNote(note.id);
    setNoteText(note.text);
    // If not in edit mode, set localChar to current char so modal can work
    if (!editMode) {
      setLocalChar(char);
    }
  };

  const saveNote = () => {
    if (activeNote) {
      const updatedNotes = (localChar?.notes || []).map(n =>
        n.id === activeNote ? { ...n, text: noteText, editedAt: new Date().toISOString() } : n
      );

      if (editMode) {
        // In edit mode, just update localChar
        setLocalChar({ ...localChar, notes: updatedNotes });
      } else {
        // Not in edit mode, save directly to the character
        const updatedChar = { ...char, notes: updatedNotes, lastUpdated: new Date().toISOString() };
        if (onSave) {
          onSave(updatedChar);
        }
      }

      setActiveNote(null);
      setNoteText('');
    }
  };

  // Group talents by tier
  const getTalentsByTier = () => {
    const tiers = { 1: [], 2: [], 3: [], 4: [], 5: [] };
    (char.talents || []).forEach(t => {
      const tier = t.effectiveTier || t.tier || 1;
      if (!tiers[tier]) tiers[tier] = [];
      tiers[tier].push(t);
    });
    return tiers;
  };

  return (
    <div className="space-y-6">
      {/* Note Editor Modal */}
      {activeNote && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl border border-gray-600 w-full max-w-2xl max-h-[80vh] flex flex-col">
            <div className="p-4 border-b border-gray-700 flex items-center justify-between">
              <input
                type="text"
                value={(localChar?.notes || []).find(n => n.id === activeNote)?.title || ''}
                onChange={(e) => updateNote(activeNote, { title: e.target.value })}
                className="bg-transparent text-white text-xl font-semibold focus:outline-none flex-1"
                placeholder="Note title..."
              />
              <button onClick={() => setActiveNote(null)} className="text-gray-400 hover:text-white p-2">✕</button>
            </div>
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              className="flex-1 p-4 bg-gray-900 text-white resize-none focus:outline-none"
              placeholder="Write your note here..."
            />
            <div className="p-4 border-t border-gray-700 flex justify-end space-x-2">
              <button onClick={() => setActiveNote(null)} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg">Cancel</button>
              <button onClick={saveNote} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg">Save Note</button>
            </div>
          </div>
        </div>
      )}

      {/* Talent Picker Modal */}
      {showTalentPicker && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl border border-gray-600 w-full max-w-4xl max-h-[80vh] flex flex-col">
            <div className="p-4 border-b border-gray-700 flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">Purchase Talent</h3>
              <div className="flex items-center space-x-4">
                <span className="text-amber-400">XP Available: {localChar?.xpAvailable || 0}</span>
                <button onClick={() => setShowTalentPicker(false)} className="text-gray-400 hover:text-white p-2">✕</button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {[1, 2, 3, 4, 5].map(tier => {
                const tierTalents = allTalents.filter(t => {
                  const effectiveTier = getTalentEffectiveTier(t);
                  return effectiveTier === tier || (t.tier === tier && getPlayerTalentCount(t.id) === 0);
                });
                
                if (tierTalents.length === 0) return null;
                
                return (
                  <div key={tier}>
                    <div className="flex items-center mb-2">
                      <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                        tier === 1 ? 'bg-gray-600 text-gray-200' :
                        tier === 2 ? 'bg-green-700 text-green-200' :
                        tier === 3 ? 'bg-blue-700 text-blue-200' :
                        tier === 4 ? 'bg-purple-700 text-purple-200' :
                        'bg-amber-600 text-amber-200'
                      }`}>
                        Tier {tier} ({tier * 5} XP)
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {tierTalents.map(talent => {
                        const canBuy = canBuyTalent(talent);
                        const owned = getPlayerTalentCount(talent.id);
                        const effectiveTier = getTalentEffectiveTier(talent);
                        
                        return (
                          <div key={talent.id} className={`p-3 rounded-lg border ${canBuy ? 'bg-gray-700 border-gray-600' : 'bg-gray-800 border-gray-700 opacity-50'}`}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-white font-medium">{talent.name}</span>
                              <div className="flex items-center space-x-2">
                                {talent.ranked && <span className="text-purple-400 text-xs">Ranked</span>}
                                {owned > 0 && <span className="text-green-400 text-xs">×{owned}</span>}
                                {talent.activation && <span className="text-blue-400 text-xs">{talent.activation}</span>}
                              </div>
                            </div>
                            <p className="text-gray-400 text-sm mb-2">{talent.effect}</p>
                            {talent.requirements && <p className="text-yellow-400 text-xs mb-2">Requires: {talent.requirements}</p>}
                            <button
                              onClick={() => { buyTalent(talent); }}
                              disabled={!canBuy}
                              className="w-full px-3 py-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded text-sm font-medium"
                            >
                              Buy ({effectiveTier * 5} XP)
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Edit Mode Controls */}
      {!readOnly && (
        <div className="flex justify-end space-x-2">
          {editMode ? (
            <>
              <button onClick={cancelEditing} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium">Cancel</button>
              <button onClick={saveChanges} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium">💾 Save Changes</button>
            </>
          ) : (
            <button onClick={startEditing} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium">✏️ Edit Character</button>
          )}
        </div>
      )}

      {/* Characteristics + Derived Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
            <h3 className="text-white font-semibold mb-4">💪 Characteristics</h3>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {Object.entries(char.characteristics || {}).map(([charName, value]) => {
                const colors = CHARACTERISTIC_COLORS[charName];
                return (
                  <div key={charName} className={`${colors.bg} ${colors.border} border rounded-lg p-3 text-center`}>
                    <div className={`text-xs ${colors.text} font-medium uppercase mb-1`}>{charName.slice(0, 3)}</div>
                    <div className="text-3xl font-bold text-white">{value}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-600 h-full">
            <h3 className="text-white font-semibold mb-4">📊 Derived Stats</h3>
            <div className="space-y-2">
              {[
                { key: 'soak', label: 'Soak' },
                { key: 'meleeDefense', label: 'Melee Def' },
                { key: 'rangedDefense', label: 'Ranged Def' },
                { key: 'maxEncumbrance', label: 'Max Encumb' },
              ].map(({ key, label }) => (
                <div key={key} className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">{label}</span>
                  {editMode ? (
                    <input
                      type="number"
                      value={char[key] || 0}
                      onChange={(e) => updateLocal(key, parseInt(e.target.value) || 0)}
                      className="w-16 text-lg font-bold text-white bg-gray-700 border border-gray-600 rounded px-2 py-1 text-center"
                    />
                  ) : (
                    <span className="text-lg font-bold text-white bg-gray-700 px-3 py-1 rounded">{char[key] || 0}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Thresholds Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-red-900/30 rounded-lg p-4 border border-red-700">
          <div className="text-red-300 text-sm font-medium mb-1">Wounds</div>
          <div className="flex items-center space-x-2">
            {editMode ? (
              <>
                <input type="number" value={char.currentWounds || 0} onChange={(e) => updateLocal('currentWounds', parseInt(e.target.value) || 0)} className="w-16 text-2xl font-bold text-white bg-gray-700 border border-gray-600 rounded px-2 py-1 text-center" min="0" />
                <span className="text-red-400">/</span>
                <span className="text-xl text-red-300">{char.woundThreshold || 0}</span>
              </>
            ) : (
              <>
                <span className="text-3xl font-bold text-white">{char.currentWounds || 0}</span>
                <span className="text-red-400">/</span>
                <span className="text-xl text-red-300">{char.woundThreshold || 0}</span>
              </>
            )}
          </div>
          <div className="mt-2 h-2 bg-red-950 rounded-full overflow-hidden">
            <div className="h-full bg-red-500 transition-all" style={{ width: `${Math.min(((char.currentWounds || 0) / (char.woundThreshold || 1)) * 100, 100)}%` }} />
          </div>
        </div>
        
        <div className="bg-blue-900/30 rounded-lg p-4 border border-blue-700">
          <div className="text-blue-300 text-sm font-medium mb-1">Strain</div>
          <div className="flex items-center space-x-2">
            {editMode ? (
              <>
                <input type="number" value={char.currentStrain || 0} onChange={(e) => updateLocal('currentStrain', parseInt(e.target.value) || 0)} className="w-16 text-2xl font-bold text-white bg-gray-700 border border-gray-600 rounded px-2 py-1 text-center" min="0" />
                <span className="text-blue-400">/</span>
                <span className="text-xl text-blue-300">{char.strainThreshold || 0}</span>
              </>
            ) : (
              <>
                <span className="text-3xl font-bold text-white">{char.currentStrain || 0}</span>
                <span className="text-blue-400">/</span>
                <span className="text-xl text-blue-300">{char.strainThreshold || 0}</span>
              </>
            )}
          </div>
          <div className="mt-2 h-2 bg-blue-950 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 transition-all" style={{ width: `${Math.min(((char.currentStrain || 0) / (char.strainThreshold || 1)) * 100, 100)}%` }} />
          </div>
        </div>
        
        <div className="bg-purple-900/30 rounded-lg p-4 border border-purple-700">
          <div className="text-purple-300 text-sm font-medium mb-1">Sanity</div>
          <div className="flex items-center space-x-2">
            {editMode ? (
              <>
                <input type="number" value={char.currentSanity ?? 100} onChange={(e) => updateLocal('currentSanity', parseInt(e.target.value) || 0)} className="w-20 text-2xl font-bold text-white bg-gray-700 border border-gray-600 rounded px-2 py-1 text-center" min="0" max="100" />
                <span className="text-purple-400">%</span>
              </>
            ) : (
              <>
                <span className="text-3xl font-bold text-white">{char.currentSanity ?? 100}</span>
                <span className="text-purple-400">%</span>
              </>
            )}
          </div>
          <div className="mt-2 h-2 bg-purple-950 rounded-full overflow-hidden">
            <div className="h-full bg-purple-500 transition-all" style={{ width: `${char.currentSanity ?? 100}%` }} />
          </div>
        </div>
        
        <div className="bg-amber-900/30 rounded-lg p-4 border border-amber-700">
          <div className="text-amber-300 text-sm font-medium mb-1">XP</div>
          {editMode ? (
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="text-gray-400 text-xs">Avail:</span>
                <input type="number" value={xpInputValue || localChar?.xpAvailable || 0} onChange={(e) => {
                  const newAvail = parseInt(e.target.value) || 0;

                  // Update input display immediately for UI responsiveness
                  setXpInputValue(newAvail);

                  // Clear existing timer
                  if (xpDebounceTimer.current) {
                    clearTimeout(xpDebounceTimer.current);
                  }

                  // Set new timer to update xpTotal after 1 second of no typing
                  xpDebounceTimer.current = setTimeout(() => {
                    // Calculate diff from ORIGINAL char values, not localChar
                    const originalAvail = char?.xpAvailable || 0;
                    const originalTotal = char?.xpTotal || 0;
                    const diff = newAvail - originalAvail;
                    const newTotal = originalTotal + diff;

                    setLocalChar(prev => ({ 
                      ...prev, 
                      xpAvailable: newAvail, 
                      xpTotal: newTotal > 0 ? newTotal : 0 
                    }));

                    // Clear the input value so it uses localChar on next render
                    setXpInputValue('');
                  }, 250);
                }} className="w-16 text-lg font-bold text-white bg-gray-700 border border-gray-600 rounded px-2 py-1 text-center" min="0" />
              </div>
              <div className="text-xs text-amber-400">Total: {localChar?.xpTotal || 0}</div>
            </div>
          ) : (
            <>
              <span className="text-3xl font-bold text-white">{char.xpAvailable || 0}</span>
              <div className="text-xs text-amber-400 mt-1">Total: {char.xpTotal || 0}</div>
            </>
          )}
        </div>

        {/* Exhaustion */}
        <div className="bg-orange-900/30 rounded-lg p-4 border border-orange-700">
          <div className="text-orange-300 text-sm font-medium mb-1">Exhaustion</div>
          <div className="flex items-center space-x-2">
            {editMode ? (
              <div className="flex items-center space-x-1">
                <button 
                  onClick={() => updateLocal('status.exhaustion', Math.max(0, (localChar?.status?.exhaustion || 0) - 1))}
                  className="w-6 h-6 rounded bg-red-900/50 text-red-300 border border-red-700 font-bold text-sm"
                >-</button>
                <span className="text-2xl font-bold text-white w-8 text-center">{char.status?.exhaustion || 0}</span>
                <button 
                  onClick={() => updateLocal('status.exhaustion', Math.min(10, (localChar?.status?.exhaustion || 0) + 1))}
                  className="w-6 h-6 rounded bg-green-900/50 text-green-300 border border-green-700 font-bold text-sm"
                >+</button>
                <span className="text-orange-400 text-sm">/10</span>
              </div>
            ) : (
              <>
                <span className="text-3xl font-bold text-white">{char.status?.exhaustion || 0}</span>
                <span className="text-orange-400">/10</span>
              </>
            )}
          </div>
          <div className="mt-2 flex space-x-0.5">
            {[...Array(10)].map((_, i) => (
              <div 
                key={i} 
                className={`flex-1 h-2 rounded-sm ${
                  i < (char.status?.exhaustion || 0)
                    ? i >= 9 ? 'bg-red-500' : i >= 7 ? 'bg-orange-500' : i >= 5 ? 'bg-yellow-500' : 'bg-orange-400'
                    : 'bg-gray-700'
                }`} 
              />
            ))}
          </div>
        </div>
      </div>

      {/* Critical Injuries */}
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
        <h3 className="text-white font-semibold mb-4">🩹 Critical Injuries</h3>
        
        {(char.criticalInjuries || []).length > 0 ? (
          <div className="space-y-2 mb-4">
            {(char.criticalInjuries || []).map((crit) => (
              <div key={crit.id} className="flex items-start justify-between bg-red-900/20 border border-red-800 rounded-lg p-3">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-red-400 font-bold">[{crit.roll}]</span>
                    <span className="text-white font-medium">{crit.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      crit.severity === 1 ? 'bg-yellow-900 text-yellow-300' :
                      crit.severity === 2 ? 'bg-orange-900 text-orange-300' :
                      crit.severity === 3 ? 'bg-red-900 text-red-300' :
                      'bg-purple-900 text-purple-300'
                    }`}>Severity {crit.severity}</span>
                  </div>
                  <p className="text-gray-400 text-sm">{crit.effect}</p>
                </div>
                {editMode && (
                  <button onClick={() => removeCriticalInjury(crit.id)} className="text-red-400 hover:text-red-300 p-1">✕</button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-2 mb-4">No critical injuries</p>
        )}
        
        {editMode && (
          <div className="flex space-x-2">
            <input
              type="number"
              placeholder="Roll (1-150)"
              value={critRoll}
              onChange={(e) => setCritRoll(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addCriticalByRoll()}
              className="w-32 bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white placeholder-gray-500"
              min="1"
              max="150"
            />
            <button onClick={addCriticalByRoll} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-medium">
              Add by Roll
            </button>
          </div>
        )}
      </div>

      {/* Skills Section */}
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
        <h3 className="text-white font-semibold mb-4">
          📚 Skills
          {editMode && <span className="ml-2 text-xs text-gray-400">(Costs XP to increase)</span>}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Object.entries(SKILLS_BY_CHARACTERISTIC).map(([charName, skills]) => {
            const colors = CHARACTERISTIC_COLORS[charName];
            return (
              <div key={charName} className={`${colors.bg} ${colors.border} border rounded-lg p-3`}>
                <div className={`${colors.text} text-sm font-medium uppercase mb-2`}>{charName}</div>
                <div className="space-y-1">
                  {skills.map(skill => {
                    const rank = getSkillRank(skill.id);
                    const isCareer = isCareerSkill(skill.id);
                    const nextCost = rank < 5 ? getSkillCost(rank + 1, isCareer) : 0;
                    const canAfford = editMode && localChar && (localChar.xpAvailable || 0) >= nextCost;
                    
                    return (
                      <div key={skill.id} className="flex items-center justify-between bg-gray-900/50 rounded px-2 py-1">
                        <div className="flex items-center space-x-2">
                          <span className={`text-sm ${rank > 0 ? 'text-white' : 'text-gray-500'}`}>{skill.name}</span>
                          {isCareer && <span className="w-2 h-2 rounded-full bg-indigo-500" title="Career" />}
                          {skill.custom && <span className="text-purple-400 text-xs">★</span>}
                        </div>
                        <div className="flex items-center space-x-2">
                          {renderDicePool(charName, rank)}
                          {editMode ? (
                            <div className="flex items-center space-x-1">
                              <button onClick={() => updateSkill(skill.id, -1)} disabled={rank <= 0} className="w-5 h-5 rounded bg-red-900/50 text-red-300 disabled:opacity-30 text-xs font-bold">-</button>
                              <span className="text-white font-bold w-4 text-center">{rank}</span>
                              <button onClick={() => updateSkill(skill.id, 1)} disabled={rank >= 5 || !canAfford} title={rank < 5 ? `${nextCost} XP` : ''} className="w-5 h-5 rounded bg-green-900/50 text-green-300 disabled:opacity-30 text-xs font-bold">+</button>
                            </div>
                          ) : (
                            <span className="text-white font-bold w-4 text-center">{rank}</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-3 flex items-center space-x-4 text-xs text-gray-500 flex-wrap gap-2">
          <div className="flex items-center space-x-1"><span className="w-2 h-2 rounded-full bg-indigo-500" /><span>Career</span></div>
          <div className="flex items-center space-x-1"><span className="text-purple-400">★</span><span>Custom</span></div>
          <div className="flex items-center space-x-1"><DiceProficiency /><span>Proficiency</span></div>
          <div className="flex items-center space-x-1"><DiceAbility /><span>Ability</span></div>
        </div>
      </div>

      {/* Talents Section */}
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold">⭐ Talents</h3>
          {editMode && (
            <button onClick={() => setShowTalentPicker(true)} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium">
              + Add Talent
            </button>
          )}
        </div>
        
        {(char.talents || []).length > 0 ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(tier => {
              const tierTalents = getTalentsByTier()[tier] || [];
              if (tierTalents.length === 0) return null;
              
              return (
                <div key={tier}>
                  <div className="flex items-center mb-2">
                    <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                      tier === 1 ? 'bg-gray-600 text-gray-200' :
                      tier === 2 ? 'bg-green-700 text-green-200' :
                      tier === 3 ? 'bg-blue-700 text-blue-200' :
                      tier === 4 ? 'bg-purple-700 text-purple-200' :
                      'bg-amber-600 text-amber-200'
                    }`}>Tier {tier}</div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {tierTalents.map((talent) => (
                      <div key={talent.id} className="rounded-lg p-3 border bg-gray-700/50 border-gray-600">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-white font-medium">{talent.name}</span>
                          <div className="flex items-center space-x-2">
                            {talent.ranked && <span className="text-purple-400 text-xs">Ranked</span>}
                            {talent.activation && <span className="text-blue-400 text-xs">{talent.activation}</span>}
                            {editMode && (
                              <button onClick={() => removeTalent(talent.id)} className="text-red-400 hover:text-red-300 text-sm">✕</button>
                            )}
                          </div>
                        </div>
                        <p className="text-gray-400 text-sm">{talent.effect}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-gray-500 text-center py-8">No talents purchased yet</div>
        )}
      </div>

      {/* Abilities */}
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
        <h3 className="text-white font-semibold mb-4">✨ Abilities</h3>
        
        {char.archetypeAbility ? (
          <div className="bg-amber-900/30 border border-amber-700 rounded-lg p-4 mb-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-amber-300 font-semibold text-lg">{char.archetypeAbility.name}</span>
              <span className="text-amber-500 text-sm">Archetype: {char.archetype}</span>
            </div>
            <p className="text-gray-300">{char.archetypeAbility.description}</p>
          </div>
        ) : (
          <div className="bg-purple-900/30 border border-purple-700 rounded-lg p-4 mb-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-purple-300 font-semibold text-lg">Custom Build</span>
              <span className="text-purple-500 text-sm">Wound {char.woundBase || 10} / Strain {char.strainBase || 10}</span>
            </div>
            <p className="text-gray-300 mb-3">Extra starting XP in exchange for no archetype ability.</p>
          </div>
        )}
        
        {/* Custom Abilities */}
        {(char.customAbilities || []).length > 0 && (
          <div className="space-y-2">
            {(char.customAbilities || []).map((ability, index) => (
              <div key={index} className="bg-indigo-900/30 border border-indigo-700 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-indigo-300 font-medium">{ability.name}</span>
                  <span className="text-indigo-500 text-xs">Custom Ability</span>
                </div>
                <p className="text-gray-400 text-sm">{ability.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Motivations */}
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
        <h3 className="text-white font-semibold mb-4">❤️ Motivations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { key: 'strength', label: 'Strength', icon: '💪', bg: 'bg-green-900/20', border: 'border-green-700/50', text: 'text-green-400' },
            { key: 'flaw', label: 'Flaw', icon: '💔', bg: 'bg-red-900/20', border: 'border-red-700/50', text: 'text-red-400' },
            { key: 'desire', label: 'Desire', icon: '⭐', bg: 'bg-yellow-900/20', border: 'border-yellow-700/50', text: 'text-yellow-400' },
            { key: 'fear', label: 'Fear', icon: '😨', bg: 'bg-purple-900/20', border: 'border-purple-700/50', text: 'text-purple-400' },
          ].map(({ key, label, icon, bg, border, text }) => (
            <div key={key} className={`${bg} border ${border} rounded-lg p-3`}>
              <div className={`${text} text-sm font-medium mb-1`}>{icon} {label}</div>
              {editMode ? (
                <input type="text" value={char.motivations?.[key] || ''} onChange={(e) => updateLocal(`motivations.${key}`, e.target.value)} placeholder={`Enter ${label.toLowerCase()}...`} className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white placeholder-gray-500 text-sm" />
              ) : (
                <div className="text-white">{char.motivations?.[key] || <span className="text-gray-600 italic">Not set</span>}</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Description */}
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
        <h3 className="text-white font-semibold mb-4">📝 Description</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-4">
          {[
            { key: 'gender', label: 'Gender' },
            { key: 'age', label: 'Age' },
            { key: 'height', label: 'Height' },
            { key: 'build', label: 'Build' },
            { key: 'hair', label: 'Hair' },
            { key: 'eyes', label: 'Eyes' },
            { key: 'notableFeatures', label: 'Notable Features' },
          ].map(({ key, label }) => (
            <div key={key} className={key === 'notableFeatures' ? 'col-span-2 md:col-span-4 lg:col-span-1' : ''}>
              <label className="text-gray-400 text-xs block mb-1">{label}</label>
              {editMode ? (
                <input type="text" value={char.description?.[key] || ''} onChange={(e) => updateLocal(`description.${key}`, e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-sm" />
              ) : (
                <div className="text-white text-sm">{char.description?.[key] || '—'}</div>
              )}
            </div>
          ))}
        </div>
        
        <div>
          <label className="text-gray-400 text-xs block mb-1">Background</label>
          {editMode ? (
            <textarea value={char.description?.background || ''} onChange={(e) => updateLocal('description.background', e.target.value)} placeholder="Character background..." rows={3} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-500" />
          ) : (
            <div className="text-gray-300 whitespace-pre-wrap">{char.description?.background || <span className="text-gray-600 italic">No background</span>}</div>
          )}
        </div>
      </div>

      {/* Notes */}
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold">📋 Notes</h3>
          {editMode && (
            <button onClick={addNote} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium">+ Add Note</button>
          )}
        </div>
        
        {(char.notes || []).length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {(char.notes || []).map((note) => (
              <div key={note.id} onClick={() => editMode && openNote(note)} className={`bg-gray-700 rounded-lg p-3 border border-gray-600 ${editMode ? 'cursor-pointer hover:bg-gray-600' : ''}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-white font-medium truncate">{note.title || 'Untitled'}</span>
                  {editMode && (
                    <button onClick={(e) => { e.stopPropagation(); removeNote(note.id); }} className="text-red-400 hover:text-red-300 text-sm">✕</button>
                  )}
                </div>
                <p className="text-gray-400 text-sm line-clamp-2">{note.text || 'Empty note...'}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No notes</p>
        )}
      </div>

      {/* Character Info Footer */}
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div><span className="text-gray-400 text-sm">Archetype</span><div className="text-white font-medium">{char.archetype || 'Unknown'}</div></div>
          <div><span className="text-gray-400 text-sm">Career</span><div className="text-white font-medium">{char.career || 'Unknown'}</div></div>
          <div><span className="text-gray-400 text-sm">Created</span><div className="text-white font-medium">{char.createdAt ? new Date(char.createdAt).toLocaleDateString() : 'Unknown'}</div></div>
          <div><span className="text-gray-400 text-sm">Last Updated</span><div className="text-white font-medium">{char.lastUpdated ? new Date(char.lastUpdated).toLocaleDateString() : 'Never'}</div></div>
        </div>
      </div>

      {readOnly && (
        <div className="text-center py-2">
          <span className="text-gray-500 text-sm">👁️ Read-only view — This is another player's character</span>
        </div>
      )}
    </div>
  );
}