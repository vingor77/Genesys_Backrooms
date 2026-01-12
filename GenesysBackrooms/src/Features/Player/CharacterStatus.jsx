import React from 'react';

export default function CharacterStatus({ character, onSave, readOnly }) {
  const status = character?.status || {};

  // Exhaustion effects by level (from rules)
  const exhaustionEffects = {
    0: 'No penalties',
    1: '1 Setback to Brawn/Agility checks',
    2: '1 Setback to Brawn/Agility checks',
    3: '2 Setback to Brawn/Agility checks',
    4: '2 Setback to Brawn/Agility checks',
    5: '2 Setback to Brawn/Agility, -2 Strain Threshold',
    6: '2 Setback to Brawn/Agility, -2 Strain Threshold',
    7: '3 Setback to Brawn/Agility, -4 Strain Threshold',
    8: '3 Setback to Brawn/Agility, -4 Strain Threshold',
    9: '3 Setback to all checks, -6 Strain Threshold, +1 Strain on Strain',
    10: 'Incapacitated'
  };

  // Sanity thresholds and their effects
  const sanityThresholds = [
    { range: '80-100%', status: 'Stable', effect: 'No penalties', color: 'green' },
    { range: '60-79%', status: 'Paranoid', effect: '1 Setback to Int/Cun/Will, cannot receive ally Boost', color: 'yellow' },
    { range: '40-59%', status: 'Hallucinating', effect: '2 Setback to Int/Cun/Will, GM introduces false info', color: 'orange' },
    { range: '20-39%', status: 'Unstable', effect: '3 Setback to Int/Cun/Will, Disoriented', color: 'red' },
    { range: '1-19%', status: 'Breaking', effect: '4 Setback to Int/Cun/Will, Confused', color: 'red' },
    { range: '0%', status: 'Catatonic', effect: 'Cannot act, auto-fail all checks', color: 'gray' },
  ];

  // Survival stages
  const survivalStages = {
    hydration: ['Normal', 'Thirsty', 'Dehydrated', 'Severe Dehydration', 'Critical'],
    hunger: ['Normal', 'Hungry', 'Starving', 'Severe Starvation', 'Critical', 'Death'],
    sleep: ['Normal', 'Tired', 'Exhausted', 'Sleep Deprived', 'Severely Sleep Deprived', 'Critical']
  };

  return (
    <div className="space-y-6">
      <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4 text-yellow-300">
        <strong>Status Effects</strong> - To be implemented
        <p className="text-sm text-yellow-400 mt-1">
          Exhaustion, Sanity, Dehydration, Starvation, Sleep Deprivation, Diseases - all with stacking effects displayed
        </p>
      </div>

      {/* Exhaustion */}
      <div className="bg-amber-900/20 rounded-lg p-4 border border-amber-500/30">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-amber-300 font-semibold flex items-center space-x-2">
            <span>😰</span>
            <span>Exhaustion</span>
          </h3>
          <span className="text-2xl font-bold text-white">{status.exhaustion || 0}/10</span>
        </div>
        
        {/* Exhaustion Bar */}
        <div className="flex space-x-1 mb-3">
          {[...Array(10)].map((_, i) => (
            <div 
              key={i}
              className={`flex-1 h-4 rounded ${
                i < (status.exhaustion || 0) 
                  ? i >= 9 ? 'bg-red-500' : i >= 7 ? 'bg-orange-500' : i >= 5 ? 'bg-yellow-500' : 'bg-amber-500'
                  : 'bg-gray-700'
              }`}
            />
          ))}
        </div>
        
        <p className="text-gray-400 text-sm">
          <strong>Current Effect:</strong> {exhaustionEffects[status.exhaustion || 0]}
        </p>
      </div>

      {/* Sanity */}
      <div className="bg-purple-900/20 rounded-lg p-4 border border-purple-500/30">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-purple-300 font-semibold flex items-center space-x-2">
            <span>🧠</span>
            <span>Sanity</span>
          </h3>
          <span className="text-2xl font-bold text-white">{status.sanity ?? 100}%</span>
        </div>
        
        {/* Sanity Bar */}
        <div className="h-4 bg-gray-700 rounded-full overflow-hidden mb-3">
          <div 
            className={`h-full transition-all ${
              (status.sanity ?? 100) >= 80 ? 'bg-green-500' :
              (status.sanity ?? 100) >= 60 ? 'bg-yellow-500' :
              (status.sanity ?? 100) >= 40 ? 'bg-orange-500' :
              (status.sanity ?? 100) >= 20 ? 'bg-red-500' :
              'bg-gray-500'
            }`}
            style={{ width: `${status.sanity ?? 100}%` }}
          />
        </div>
        
        {/* Threshold Display */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
          {sanityThresholds.map((t, idx) => {
            const sanity = status.sanity ?? 100;
            const isActive = 
              (t.range === '80-100%' && sanity >= 80) ||
              (t.range === '60-79%' && sanity >= 60 && sanity < 80) ||
              (t.range === '40-59%' && sanity >= 40 && sanity < 60) ||
              (t.range === '20-39%' && sanity >= 20 && sanity < 40) ||
              (t.range === '1-19%' && sanity >= 1 && sanity < 20) ||
              (t.range === '0%' && sanity === 0);
            
            return (
              <div 
                key={idx} 
                className={`p-2 rounded ${isActive ? 'bg-white/20 border border-white/30' : 'bg-black/20 opacity-50'}`}
              >
                <div className="font-medium text-white">{t.range}</div>
                <div className={`text-${t.color}-400`}>{t.status}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Survival Trackers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Hydration */}
        <div className="bg-blue-900/20 rounded-lg p-4 border border-blue-500/30">
          <h4 className="text-blue-300 font-semibold mb-2 flex items-center space-x-2">
            <span>💧</span>
            <span>Hydration</span>
          </h4>
          <div className="text-white font-medium">{survivalStages.hydration[status.hydrationStage || 0]}</div>
          <p className="text-gray-500 text-xs mt-1">Time until next stage: --:--</p>
        </div>
        
        {/* Hunger */}
        <div className="bg-orange-900/20 rounded-lg p-4 border border-orange-500/30">
          <h4 className="text-orange-300 font-semibold mb-2 flex items-center space-x-2">
            <span>🍖</span>
            <span>Hunger</span>
          </h4>
          <div className="text-white font-medium">{survivalStages.hunger[status.hungerStage || 0]}</div>
          <p className="text-gray-500 text-xs mt-1">Time until next stage: --:--</p>
        </div>
        
        {/* Sleep */}
        <div className="bg-indigo-900/20 rounded-lg p-4 border border-indigo-500/30">
          <h4 className="text-indigo-300 font-semibold mb-2 flex items-center space-x-2">
            <span>😴</span>
            <span>Sleep</span>
          </h4>
          <div className="text-white font-medium">{survivalStages.sleep[status.sleepStage || 0]}</div>
          <p className="text-gray-500 text-xs mt-1">Time until next stage: --:--</p>
        </div>
      </div>

      {/* Diseases */}
      <div className="bg-green-900/20 rounded-lg p-4 border border-green-500/30">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-green-300 font-semibold flex items-center space-x-2">
            <span>🦠</span>
            <span>Diseases</span>
          </h3>
          {!readOnly && (
            <button className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors">
              + Add Disease
            </button>
          )}
        </div>
        
        {(status.diseases || []).length === 0 ? (
          <p className="text-gray-500 text-center py-4">No active diseases</p>
        ) : (
          <div className="space-y-2">
            {(status.diseases || []).map((disease, idx) => (
              <div key={idx} className="bg-black/30 rounded p-3">
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">{disease.name}</span>
                  <span className="text-yellow-400 text-sm">Stage {disease.stage || 1}</span>
                </div>
                <p className="text-gray-400 text-sm">{disease.symptoms}</p>
                <p className="text-red-400 text-xs mt-1">{disease.effect}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Active Status Effects (from rules) */}
      <div className="bg-red-900/20 rounded-lg p-4 border border-red-500/30">
        <h3 className="text-red-300 font-semibold mb-3 flex items-center space-x-2">
          <span>⚡</span>
          <span>Active Status Effects</span>
        </h3>
        
        <div className="flex flex-wrap gap-2">
          {(status.activeEffects || []).length === 0 ? (
            <p className="text-gray-500">No active status effects</p>
          ) : (
            (status.activeEffects || []).map((effect, idx) => (
              <span key={idx} className="px-3 py-1 rounded-lg text-sm bg-red-500/20 text-red-300 border border-red-500/30">
                {effect}
              </span>
            ))
          )}
        </div>
        
        <p className="text-gray-500 text-xs mt-3">
          Examples: Disoriented, Frightened, Paranoid, Hallucinating, Heat Stroke, Hypothermia
        </p>
      </div>
      
      {readOnly && (
        <p className="text-gray-500 text-sm text-center">👁️ Read-only view</p>
      )}
    </div>
  );
}