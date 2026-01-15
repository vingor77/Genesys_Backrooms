import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import db from '../../Structural/Firebase';

export default function CharacterStatus({ character, onSave, readOnly }) {
  const [editMode, setEditMode] = useState(false);
  const [localChar, setLocalChar] = useState(null);
  const [rules, setRules] = useState({});
  const [loadingRules, setLoadingRules] = useState(true);
  const [showEffectPicker, setShowEffectPicker] = useState(false);
  const [activeEffectInput, setActiveEffectInput] = useState('');

  // Load rules from Firestore
  useEffect(() => {
    const loadRules = async () => {
      try {
        const rulesSnap = await getDocs(collection(db, 'Rules'));
        const rulesData = {};
        rulesSnap.docs.forEach(doc => {
          rulesData[doc.data().id || doc.id] = doc.data();
        });
        setRules(rulesData);
      } catch (err) {
        console.error('Error loading rules:', err);
      } finally {
        setLoadingRules(false);
      }
    };
    loadRules();
  }, []);

  if (!character) {
    return <div className="text-center py-12 text-gray-400">No character data available</div>;
  }

  // Use localChar when editing, otherwise use character prop directly
  const char = editMode && localChar ? localChar : character;

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

  const updateLocal = (key, value) => {
    if (!localChar) return;
    setLocalChar({ ...localChar, [key]: value });
  };

  const updateLocalNested = (path, value) => {
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

  // Parse exhaustion effects from rules
  const getExhaustionEffects = () => {
    const exhaustionRule = rules['exhaustion'];
    if (!exhaustionRule) {
      return {
        0: 'No penalties',
        1: '1 Setback to Brawn/Agility checks', 2: '1 Setback to Brawn/Agility checks',
        3: '2 Setback to Brawn/Agility checks', 4: '2 Setback to Brawn/Agility checks',
        5: '2 Setback to Brawn/Agility, -2 Strain Threshold', 6: '2 Setback to Brawn/Agility, -2 Strain Threshold',
        7: '3 Setback to Brawn/Agility, -4 Strain Threshold', 8: '3 Setback to Brawn/Agility, -4 Strain Threshold',
        9: '3 Setback to all checks, -6 Strain Threshold, +1 Strain on Strain',
        10: 'Incapacitated'
      };
    }
    const table = exhaustionRule.content?.find(c => c.type === 'table' && c.heading?.includes('Exhaustion Penalties'));
    if (table) {
      const effects = {};
      table.rows?.forEach(row => {
        const level = row.col1;
        const effect = row.col2;
        if (level.includes('-')) {
          const [start, end] = level.split('-').map(Number);
          for (let i = start; i <= end; i++) effects[i] = effect;
        } else {
          effects[parseInt(level)] = effect;
        }
      });
      return effects;
    }
    return {};
  };

  // Parse sanity thresholds from rules
  const getSanityThresholds = () => {
    const sanityRule = rules['fear-sanity'];
    if (!sanityRule) {
      return [
        { min: 80, max: 100, status: 'Stable', effect: 'No penalties', color: 'green' },
        { min: 60, max: 79, status: 'Paranoid', effect: '1 Setback to Int/Cun/Will. Cannot receive ally Boost.', color: 'yellow' },
        { min: 40, max: 59, status: 'Hallucinating', effect: '2 Setback to Int/Cun/Will. GM introduces false info.', color: 'orange' },
        { min: 20, max: 39, status: 'Unstable', effect: '3 Setback to Int/Cun/Will. Disoriented status.', color: 'red' },
        { min: 1, max: 19, status: 'Breaking', effect: '4 Setback to Int/Cun/Will. Confused status.', color: 'red' },
        { min: 0, max: 0, status: 'Catatonic', effect: 'Cannot act. Auto-fail all checks.', color: 'gray' },
      ];
    }
    const table = sanityRule.content?.find(c => c.type === 'table' && c.heading?.includes('Sanity Effects'));
    if (table) {
      return table.rows?.map(row => {
        const range = row.col1;
        let min, max;
        if (range.includes('-')) {
          [min, max] = range.replace('%', '').split('-').map(s => parseInt(s.trim()));
        } else {
          min = max = parseInt(range.replace('%', ''));
        }
        const effect = row.col2;
        let statusName = 'Unknown', color = 'gray';
        if (min >= 80) { statusName = 'Stable'; color = 'green'; }
        else if (min >= 60) { statusName = 'Paranoid'; color = 'yellow'; }
        else if (min >= 40) { statusName = 'Hallucinating'; color = 'orange'; }
        else if (min >= 20) { statusName = 'Unstable'; color = 'red'; }
        else if (min >= 1) { statusName = 'Breaking'; color = 'red'; }
        else { statusName = 'Catatonic'; color = 'gray'; }
        return { min, max, status: statusName, effect, color };
      }) || [];
    }
    return [];
  };

  // Parse survival stages from rules
  const getDehydrationStages = () => {
    const rule = rules['starvation-dehydration'];
    if (!rule) {
      return [
        { name: 'Normal', time: '0-12 hours', effect: 'No effects' },
        { name: 'Thirsty', time: '12-24 hours', effect: 'Add 1 Setback die to all checks' },
        { name: 'Dehydrated', time: '24-48 hours', effect: 'Upgrade difficulty once. 1 Strain/hour.' },
        { name: 'Severe Dehydration', time: '48-72 hours', effect: 'Upgrade difficulty twice. 2 Strain/hour. Max 1 maneuver.' },
        { name: 'Critical', time: '72+ hours', effect: '1 Wound/hour. Death when exceeding threshold.' },
      ];
    }
    const table = rule.content?.find(c => c.type === 'table' && c.heading?.includes('Dehydration'));
    return table?.rows?.map(row => ({ name: row.col2, time: row.col1, effect: row.col3 })) || [];
  };

  const getStarvationStages = () => {
    const rule = rules['starvation-dehydration'];
    if (!rule) {
      return [
        { name: 'Normal', time: '0-24 hours', effect: 'No effects' },
        { name: 'Hungry', time: '1-3 days', effect: 'Add 1 Setback die to all checks' },
        { name: 'Starving', time: '3-7 days', effect: 'Upgrade physical checks. -1 Brawn.' },
        { name: 'Severe Starvation', time: '7-14 days', effect: 'Upgrade all checks. -1 Brawn/Agility. No natural healing.' },
        { name: 'Critical', time: '14-30 days', effect: 'Upgrade all checks twice. -1 all stats. 1 Wound/day.' },
        { name: 'Death', time: '30+ days', effect: 'Character dies without intervention.' },
      ];
    }
    const table = rule.content?.find(c => c.type === 'table' && c.heading?.includes('Starvation'));
    return table?.rows?.map(row => ({ name: row.col2, time: row.col1, effect: row.col3 })) || [];
  };

  const getSleepStages = () => {
    const rule = rules['sleep-deprivation'];
    if (!rule) {
      return [
        { name: 'Normal', time: '0-16 hours', effect: 'No effects' },
        { name: 'Tired', time: '16-24 hours', effect: '1 Setback to Vigilance/Perception' },
        { name: 'Exhausted', time: '24-36 hours', effect: '1 Setback to all. Upgrade Vig/Perc difficulty.' },
        { name: 'Sleep Deprived', time: '36-48 hours', effect: 'Upgrade all checks. 1 Strain/hour. Micro-sleeps.' },
        { name: 'Severely Sleep Deprived', time: '48-72 hours', effect: 'Upgrade all twice. 2 Strain/hour. Hallucinations.' },
        { name: 'Critical', time: '72+ hours', effect: 'Auto-sleep unless threatened. 1 Wound/hour.' },
      ];
    }
    const table = rule.content?.find(c => c.type === 'table' && c.heading?.includes('Sleep Deprivation'));
    return table?.rows?.map(row => ({ name: row.col2, time: row.col1, effect: row.col3 })) || [];
  };

  // Get all status effects from rules
  const getStatusEffects = () => {
    const statusRule = rules['status-effects'];
    if (!statusRule) return { negative: [], positive: [], special: [] };
    
    const effects = { negative: [], positive: [], special: [] };
    let currentSection = 'negative';
    
    statusRule.content?.forEach(item => {
      if (item.type === 'text') {
        if (item.heading === 'Negative Status Effects') currentSection = 'negative';
        else if (item.heading === 'Positive Status Effects') currentSection = 'positive';
        else if (item.heading === 'Special Status Effects') currentSection = 'special';
        else if (item.heading && item.text && !item.heading.includes('Status Effects')) {
          effects[currentSection].push({ name: item.heading, description: item.text });
        }
      }
    });
    return effects;
  };

  const exhaustionEffects = getExhaustionEffects();
  const sanityThresholds = getSanityThresholds();
  const dehydrationStages = getDehydrationStages();
  const starvationStages = getStarvationStages();
  const sleepStages = getSleepStages();
  const allStatusEffects = getStatusEffects();

  // Get values from character - using top-level fields
  const exhaustion = char.status?.exhaustion || 0;
  const sanity = char.currentSanity ?? 100;
  const hydrationStage = char.status?.hydrationStage || 0;
  const hungerStage = char.status?.hungerStage || 0;
  const sleepStage = char.status?.sleepStage || 0;
  const diseases = char.status?.diseases || [];
  const activeEffects = char.status?.activeEffects || [];

  const getCurrentSanityThreshold = () => {
    return sanityThresholds.find(t => sanity >= t.min && sanity <= t.max) || sanityThresholds[0];
  };

  // Status update helpers - updates nested status object
  const updateStatusField = (field, value) => {
    const newStatus = { ...(localChar?.status || {}), [field]: value };
    updateLocal('status', newStatus);
  };

  // For sanity, update the top-level currentSanity field
  const updateSanity = (value) => {
    updateLocal('currentSanity', Math.min(100, Math.max(0, value)));
  };

  const addActiveEffect = (effectName) => {
    if (!localChar) return;
    const current = localChar.status?.activeEffects || [];
    if (!current.includes(effectName)) {
      updateStatusField('activeEffects', [...current, effectName]);
    }
    setActiveEffectInput('');
    setShowEffectPicker(false);
  };

  const removeActiveEffect = (effectName) => {
    if (!localChar) return;
    const current = localChar.status?.activeEffects || [];
    updateStatusField('activeEffects', current.filter(e => e !== effectName));
  };

  const addDisease = () => {
    if (!localChar) return;
    const current = localChar.status?.diseases || [];
    updateStatusField('diseases', [...current, {
      id: Date.now(), name: 'New Disease', stage: 1, symptoms: '', effect: ''
    }]);
  };

  const updateDisease = (id, updates) => {
    if (!localChar) return;
    const current = localChar.status?.diseases || [];
    updateStatusField('diseases', current.map(d => d.id === id ? { ...d, ...updates } : d));
  };

  const removeDisease = (id) => {
    if (!localChar) return;
    const current = localChar.status?.diseases || [];
    updateStatusField('diseases', current.filter(d => d.id !== id));
  };

  if (loadingRules) {
    return <div className="text-center py-12 text-gray-400">Loading rules...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Status Effect Picker Modal */}
      {showEffectPicker && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl border border-gray-600 w-full max-w-2xl max-h-[80vh] flex flex-col">
            <div className="p-4 border-b border-gray-700 flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">Add Status Effect</h3>
              <button onClick={() => setShowEffectPicker(false)} className="text-gray-400 hover:text-white p-2">✕</button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div>
                <h4 className="text-red-400 font-semibold mb-2">Negative Effects</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {allStatusEffects.negative.map((effect, idx) => (
                    <button key={idx} onClick={() => addActiveEffect(effect.name)}
                      className="p-2 bg-red-900/30 hover:bg-red-900/50 border border-red-700 rounded-lg text-left">
                      <div className="text-red-300 font-medium text-sm">{effect.name}</div>
                      <div className="text-gray-400 text-xs line-clamp-2">{effect.description}</div>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-green-400 font-semibold mb-2">Positive Effects</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {allStatusEffects.positive.map((effect, idx) => (
                    <button key={idx} onClick={() => addActiveEffect(effect.name)}
                      className="p-2 bg-green-900/30 hover:bg-green-900/50 border border-green-700 rounded-lg text-left">
                      <div className="text-green-300 font-medium text-sm">{effect.name}</div>
                      <div className="text-gray-400 text-xs line-clamp-2">{effect.description}</div>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-purple-400 font-semibold mb-2">Special Effects</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {allStatusEffects.special.map((effect, idx) => (
                    <button key={idx} onClick={() => addActiveEffect(effect.name)}
                      className="p-2 bg-purple-900/30 hover:bg-purple-900/50 border border-purple-700 rounded-lg text-left">
                      <div className="text-purple-300 font-medium text-sm">{effect.name}</div>
                      <div className="text-gray-400 text-xs line-clamp-2">{effect.description}</div>
                    </button>
                  ))}
                </div>
              </div>
              <div className="pt-4 border-t border-gray-700">
                <h4 className="text-gray-400 font-semibold mb-2">Custom Effect</h4>
                <div className="flex space-x-2">
                  <input type="text" value={activeEffectInput} onChange={(e) => setActiveEffectInput(e.target.value)}
                    placeholder="Enter custom effect name..."
                    className="flex-1 bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white placeholder-gray-500" />
                  <button onClick={() => activeEffectInput.trim() && addActiveEffect(activeEffectInput.trim())}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-medium">Add</button>
                </div>
              </div>
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
            <button onClick={startEditing} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium">✏️ Edit Status</button>
          )}
        </div>
      )}

      {/* Exhaustion */}
      <div className="bg-amber-900/20 rounded-lg p-4 border border-amber-500/30">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-amber-300 font-semibold flex items-center space-x-2">
            <span>😰</span><span>Exhaustion</span>
          </h3>
          {editMode ? (
            <div className="flex items-center space-x-2">
              <button onClick={() => updateStatusField('exhaustion', Math.max(0, exhaustion - 1))}
                className="w-8 h-8 rounded bg-red-900/50 text-red-300 border border-red-700 font-bold">-</button>
              <span className="text-2xl font-bold text-white w-12 text-center">{exhaustion}</span>
              <button onClick={() => updateStatusField('exhaustion', Math.min(10, exhaustion + 1))}
                className="w-8 h-8 rounded bg-green-900/50 text-green-300 border border-green-700 font-bold">+</button>
              <span className="text-amber-400">/10</span>
            </div>
          ) : (
            <span className="text-2xl font-bold text-white">{exhaustion}/10</span>
          )}
        </div>
        <div className="flex space-x-1 mb-3">
          {[...Array(10)].map((_, i) => (
            <div key={i} className={`flex-1 h-4 rounded transition-all ${
              i < exhaustion
                ? i >= 9 ? 'bg-red-500' : i >= 7 ? 'bg-orange-500' : i >= 5 ? 'bg-yellow-500' : 'bg-amber-500'
                : 'bg-gray-700'
            }`} />
          ))}
        </div>
        <p className="text-gray-400 text-sm">
          <strong className="text-amber-300">Current Effect:</strong> {exhaustionEffects[exhaustion] || 'No penalties'}
        </p>
      </div>

      {/* Sanity - uses character.currentSanity */}
      <div className="bg-purple-900/20 rounded-lg p-4 border border-purple-500/30">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-purple-300 font-semibold flex items-center space-x-2">
            <span>🧠</span><span>Sanity</span>
          </h3>
          {editMode ? (
            <div className="flex items-center space-x-2">
              <button onClick={() => updateSanity(sanity - 1)}
                className="w-8 h-8 rounded bg-red-900/50 text-red-300 border border-red-700 font-bold">-</button>
              <input type="number" value={sanity}
                onChange={(e) => updateSanity(parseInt(e.target.value) || 0)}
                className="w-20 text-xl font-bold text-white bg-gray-700 border border-gray-600 rounded px-2 py-1 text-center" min="0" max="100" />
              <button onClick={() => updateSanity(sanity + 1)}
                className="w-8 h-8 rounded bg-green-900/50 text-green-300 border border-green-700 font-bold">+</button>
              <span className="text-purple-400">%</span>
            </div>
          ) : (
            <span className="text-2xl font-bold text-white">{sanity}%</span>
          )}
        </div>
        <div className="h-4 bg-gray-700 rounded-full overflow-hidden mb-3">
          <div className={`h-full transition-all ${
            sanity >= 80 ? 'bg-green-500' :
            sanity >= 60 ? 'bg-yellow-500' :
            sanity >= 40 ? 'bg-orange-500' :
            sanity >= 20 ? 'bg-red-500' :
            sanity >= 1 ? 'bg-red-700' : 'bg-gray-500'
          }`} style={{ width: `${sanity}%` }} />
        </div>
        {(() => {
          const current = getCurrentSanityThreshold();
          const bgColors = { green: 'bg-green-900/30 border-green-700/50', yellow: 'bg-yellow-900/30 border-yellow-700/50',
            orange: 'bg-orange-900/30 border-orange-700/50', red: 'bg-red-900/30 border-red-700/50', gray: 'bg-gray-900/30 border-gray-700/50' };
          const textColors = { green: 'text-green-300', yellow: 'text-yellow-300', orange: 'text-orange-300', red: 'text-red-300', gray: 'text-gray-300' };
          return (
            <div className={`p-3 rounded-lg border ${bgColors[current.color]} mb-3`}>
              <div className="flex items-center justify-between">
                <span className={`${textColors[current.color]} font-bold`}>{current.status}</span>
                <span className="text-gray-400 text-sm">{current.min === current.max ? `${current.min}%` : `${current.min}-${current.max}%`}</span>
              </div>
              <p className="text-gray-300 text-sm mt-1">{current.effect}</p>
            </div>
          );
        })()}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
          {sanityThresholds.map((t, idx) => {
            const isActive = sanity >= t.min && sanity <= t.max;
            const textColors = { green: 'text-green-400', yellow: 'text-yellow-400', orange: 'text-orange-400', red: 'text-red-400', gray: 'text-gray-400' };
            return (
              <div key={idx} className={`p-2 rounded transition-all ${isActive ? 'bg-white/20 border border-white/30 ring-2 ring-white/20' : 'bg-black/20 opacity-50'}`}>
                <div className="font-medium text-white">{t.min === t.max ? `${t.min}%` : `${t.min}-${t.max}%`}</div>
                <div className={textColors[t.color]}>{t.status}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Survival Trackers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Hydration */}
        <div className="bg-blue-900/20 rounded-lg p-4 border border-blue-500/30">
          <h4 className="text-blue-300 font-semibold mb-3 flex items-center space-x-2">
            <span>💧</span><span>Hydration</span>
          </h4>
          {editMode ? (
            <select value={hydrationStage} onChange={(e) => updateStatusField('hydrationStage', parseInt(e.target.value))}
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white mb-2">
              {dehydrationStages.map((stage, idx) => <option key={idx} value={idx}>{stage.name}</option>)}
            </select>
          ) : (
            <div className="text-white font-medium mb-2">{dehydrationStages[hydrationStage]?.name || 'Normal'}</div>
          )}
          <div className="text-xs text-gray-400"><strong>Time:</strong> {dehydrationStages[hydrationStage]?.time || '0-12 hours'}</div>
          <div className="text-xs text-blue-300 mt-1">{dehydrationStages[hydrationStage]?.effect || 'No effects'}</div>
        </div>
        
        {/* Hunger */}
        <div className="bg-orange-900/20 rounded-lg p-4 border border-orange-500/30">
          <h4 className="text-orange-300 font-semibold mb-3 flex items-center space-x-2">
            <span>🍖</span><span>Hunger</span>
          </h4>
          {editMode ? (
            <select value={hungerStage} onChange={(e) => updateStatusField('hungerStage', parseInt(e.target.value))}
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white mb-2">
              {starvationStages.map((stage, idx) => <option key={idx} value={idx}>{stage.name}</option>)}
            </select>
          ) : (
            <div className="text-white font-medium mb-2">{starvationStages[hungerStage]?.name || 'Normal'}</div>
          )}
          <div className="text-xs text-gray-400"><strong>Time:</strong> {starvationStages[hungerStage]?.time || '0-24 hours'}</div>
          <div className="text-xs text-orange-300 mt-1">{starvationStages[hungerStage]?.effect || 'No effects'}</div>
        </div>
        
        {/* Sleep */}
        <div className="bg-indigo-900/20 rounded-lg p-4 border border-indigo-500/30">
          <h4 className="text-indigo-300 font-semibold mb-3 flex items-center space-x-2">
            <span>😴</span><span>Sleep</span>
          </h4>
          {editMode ? (
            <select value={sleepStage} onChange={(e) => updateStatusField('sleepStage', parseInt(e.target.value))}
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white mb-2">
              {sleepStages.map((stage, idx) => <option key={idx} value={idx}>{stage.name}</option>)}
            </select>
          ) : (
            <div className="text-white font-medium mb-2">{sleepStages[sleepStage]?.name || 'Normal'}</div>
          )}
          <div className="text-xs text-gray-400"><strong>Time:</strong> {sleepStages[sleepStage]?.time || '0-16 hours'}</div>
          <div className="text-xs text-indigo-300 mt-1">{sleepStages[sleepStage]?.effect || 'No effects'}</div>
        </div>
      </div>

      {/* Diseases */}
      <div className="bg-green-900/20 rounded-lg p-4 border border-green-500/30">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-green-300 font-semibold flex items-center space-x-2">
            <span>🦠</span><span>Diseases</span>
          </h3>
          {editMode && (
            <button onClick={addDisease} className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg">+ Add Disease</button>
          )}
        </div>
        {diseases.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No active diseases</p>
        ) : (
          <div className="space-y-2">
            {diseases.map((disease) => (
              <div key={disease.id} className="bg-black/30 rounded-lg p-3">
                {editMode ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <input type="text" value={disease.name} onChange={(e) => updateDisease(disease.id, { name: e.target.value })}
                        placeholder="Disease name" className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white flex-1 mr-2" />
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-400 text-sm">Stage:</span>
                        <input type="number" value={disease.stage || 1} onChange={(e) => updateDisease(disease.id, { stage: parseInt(e.target.value) || 1 })}
                          className="w-16 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-center" min="1" />
                        <button onClick={() => removeDisease(disease.id)} className="p-1 text-red-400 hover:text-red-300">✕</button>
                      </div>
                    </div>
                    <input type="text" value={disease.symptoms || ''} onChange={(e) => updateDisease(disease.id, { symptoms: e.target.value })}
                      placeholder="Symptoms..." className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-sm" />
                    <input type="text" value={disease.effect || ''} onChange={(e) => updateDisease(disease.id, { effect: e.target.value })}
                      placeholder="Mechanical effects..." className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-sm" />
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-white font-medium">{disease.name}</span>
                      <span className="text-yellow-400 text-sm">Stage {disease.stage || 1}</span>
                    </div>
                    {disease.symptoms && <p className="text-gray-400 text-sm">{disease.symptoms}</p>}
                    {disease.effect && <p className="text-red-400 text-xs mt-1">{disease.effect}</p>}
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Active Status Effects */}
      <div className="bg-red-900/20 rounded-lg p-4 border border-red-500/30">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-red-300 font-semibold flex items-center space-x-2">
            <span>⚡</span><span>Active Status Effects</span>
          </h3>
          {editMode && (
            <button onClick={() => setShowEffectPicker(true)} className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg">+ Add Effect</button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {activeEffects.length === 0 ? (
            <p className="text-gray-500">No active status effects</p>
          ) : (
            activeEffects.map((effect, idx) => {
              const isNegative = allStatusEffects.negative.some(e => e.name === effect);
              const isPositive = allStatusEffects.positive.some(e => e.name === effect);
              const colorClass = isPositive ? 'bg-green-500/20 text-green-300 border-green-500/30' :
                                 isNegative ? 'bg-red-500/20 text-red-300 border-red-500/30' :
                                 'bg-purple-500/20 text-purple-300 border-purple-500/30';
              return (
                <div key={idx} className={`px-3 py-1 rounded-lg text-sm border ${colorClass} flex items-center space-x-2`}>
                  <span>{effect}</span>
                  {editMode && <button onClick={() => removeActiveEffect(effect)} className="text-red-400 hover:text-red-300">✕</button>}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Combined Effects Summary */}
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
        <h3 className="text-white font-semibold mb-3 flex items-center space-x-2">
          <span>📊</span><span>Combined Effects Summary</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="bg-gray-700/50 rounded-lg p-3">
            <div className="text-gray-400 text-xs mb-1">Total Setback Dice</div>
            <div className="space-y-1">
              {(() => {
                const effects = [];
                
                if (exhaustion >= 1 && exhaustion <= 2) effects.push({ source: 'Exhaustion', dice: 1, applies: 'Brawn/Agility' });
                else if (exhaustion >= 3 && exhaustion <= 6) effects.push({ source: 'Exhaustion', dice: 2, applies: 'Brawn/Agility' });
                else if (exhaustion >= 7 && exhaustion <= 8) effects.push({ source: 'Exhaustion', dice: 3, applies: 'Brawn/Agility' });
                else if (exhaustion >= 9) effects.push({ source: 'Exhaustion', dice: 3, applies: 'All checks' });
                
                if (sanity >= 60 && sanity <= 79) effects.push({ source: 'Paranoid', dice: 1, applies: 'Int/Cun/Will' });
                else if (sanity >= 40 && sanity <= 59) effects.push({ source: 'Hallucinating', dice: 2, applies: 'Int/Cun/Will' });
                else if (sanity >= 20 && sanity <= 39) effects.push({ source: 'Unstable', dice: 3, applies: 'Int/Cun/Will' });
                else if (sanity >= 1 && sanity <= 19) effects.push({ source: 'Breaking', dice: 4, applies: 'Int/Cun/Will' });
                
                if (hydrationStage === 1) effects.push({ source: 'Thirsty', dice: 1, applies: 'All checks' });
                if (hungerStage === 1) effects.push({ source: 'Hungry', dice: 1, applies: 'All checks' });
                if (sleepStage === 1) effects.push({ source: 'Tired', dice: 1, applies: 'Vigilance/Perception' });
                if (sleepStage === 2) effects.push({ source: 'Exhausted (Sleep)', dice: 1, applies: 'All checks' });
                
                if (effects.length === 0) return <div className="text-green-400">No setback penalties active</div>;
                return effects.map((e, i) => (
                  <div key={i} className="flex justify-between">
                    <span className="text-gray-300">{e.source}</span>
                    <span className="text-red-400">{e.dice} Setback ({e.applies})</span>
                  </div>
                ));
              })()}
            </div>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-3">
            <div className="text-gray-400 text-xs mb-1">Difficulty Upgrades</div>
            <div className="space-y-1">
              {(() => {
                const effects = [];
                
                if (hydrationStage === 2) effects.push({ source: 'Dehydrated', upgrades: 1, applies: 'All checks' });
                else if (hydrationStage === 3) effects.push({ source: 'Severe Dehydration', upgrades: 2, applies: 'All checks' });
                
                if (hungerStage === 2) effects.push({ source: 'Starving', upgrades: 1, applies: 'Physical checks' });
                else if (hungerStage >= 3) effects.push({ source: 'Severe Starvation+', upgrades: hungerStage >= 4 ? 2 : 1, applies: 'All checks' });
                
                if (sleepStage === 2) effects.push({ source: 'Exhausted (Sleep)', upgrades: 1, applies: 'Vigilance/Perception' });
                else if (sleepStage === 3) effects.push({ source: 'Sleep Deprived', upgrades: 1, applies: 'All checks' });
                else if (sleepStage >= 4) effects.push({ source: 'Severely Sleep Deprived+', upgrades: 2, applies: 'All checks' });
                
                if (effects.length === 0) return <div className="text-green-400">No difficulty upgrades active</div>;
                return effects.map((e, i) => (
                  <div key={i} className="flex justify-between">
                    <span className="text-gray-300">{e.source}</span>
                    <span className="text-purple-400">{e.upgrades}× upgrade ({e.applies})</span>
                  </div>
                ));
              })()}
            </div>
          </div>
        </div>
      </div>
      
      {readOnly && <p className="text-gray-500 text-sm text-center">👁️ Read-only view</p>}
    </div>
  );
}