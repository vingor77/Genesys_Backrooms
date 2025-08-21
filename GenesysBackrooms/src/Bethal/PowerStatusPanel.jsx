import React from 'react';
import { getMoonPowerLimits, getPowerStatus } from './entityPowerSystem.jsx';

const PowerStatusPanel = ({ 
  selectedMoon, 
  gameStarted, 
  currentRound,
  indoorEntities = [], 
  outdoorEntities = [], 
  daytimeEntities = [] 
}) => {
  if (!selectedMoon || !gameStarted) {
    return (
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 text-center">
        <div className="text-4xl mb-4">⚡</div>
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Entity Power System</h2>
        <p className="text-gray-500">Start a mission to monitor power levels</p>
      </div>
    );
  }

  const powerLimits = getMoonPowerLimits(selectedMoon);
  const allEntities = [...indoorEntities, ...outdoorEntities, ...daytimeEntities];
  const powerStatus = getPowerStatus(allEntities, selectedMoon);

  const getPowerBarColor = (percentage) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 70) return 'bg-yellow-500';
    if (percentage >= 50) return 'bg-orange-500';
    return 'bg-green-500';
  };

  const getPowerTextColor = (percentage) => {
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 70) return 'text-yellow-600';
    if (percentage >= 50) return 'text-orange-600';
    return 'text-green-600';
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200">
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-t-2xl">
        <h2 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
          <span className="text-purple-600">⚡</span>
          <span>Entity Power Status</span>
        </h2>
      </div>
      
      <div className="p-4 space-y-4">
        
        {/* Moon Power Limits Overview */}
        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
          <h3 className="font-semibold text-gray-800 mb-2 text-sm">📊 {selectedMoon} Power Limits</h3>
          <div className="grid grid-cols-3 gap-3 text-xs">
            <div className="text-center">
              <div className="font-bold text-blue-600">{powerLimits.maxIndoorPower}</div>
              <div className="text-gray-600">Indoor Max</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-green-600">{powerLimits.maxOutdoorPower}</div>
              <div className="text-gray-600">Outdoor Max</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-orange-600">{powerLimits.maxDaytimePower}</div>
              <div className="text-gray-600">Daytime Max</div>
            </div>
          </div>
        </div>

        {/* Indoor Power Status */}
        <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-semibold text-blue-800 text-sm">🏭 Indoor Entities</h4>
            <span className={`font-bold text-sm ${getPowerTextColor(powerStatus.indoor.percentage)}`}>
              {powerStatus.indoor.current}/{powerStatus.indoor.max}
            </span>
          </div>
          
          <div className="w-full bg-blue-200 rounded-full h-3 overflow-hidden mb-2">
            <div 
              className={`h-3 rounded-full transition-all duration-500 ${getPowerBarColor(powerStatus.indoor.percentage)}`}
              style={{ width: `${Math.min(powerStatus.indoor.percentage, 100)}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between text-xs text-blue-700">
            <span>{powerStatus.indoor.percentage}% Used</span>
            <span>{powerStatus.indoor.entities.length} Active</span>
          </div>
          
          {powerStatus.indoor.percentage >= 95 && (
            <div className="mt-2 p-2 bg-red-100 border border-red-300 rounded text-red-800 text-xs">
              <span className="font-bold">⚠️ POWER LIMIT REACHED</span> - No new indoor entities can spawn!
            </div>
          )}
        </div>

        {/* Outdoor Power Status */}
        <div className="bg-green-50 rounded-lg p-3 border border-green-200">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-semibold text-green-800 text-sm">🌲 Outdoor Entities</h4>
            <span className={`font-bold text-sm ${getPowerTextColor(powerStatus.outdoor.percentage)}`}>
              {powerStatus.outdoor.current}/{powerStatus.outdoor.max}
            </span>
          </div>
          
          <div className="w-full bg-green-200 rounded-full h-3 overflow-hidden mb-2">
            <div 
              className={`h-3 rounded-full transition-all duration-500 ${getPowerBarColor(powerStatus.outdoor.percentage)}`}
              style={{ width: `${Math.min(powerStatus.outdoor.percentage, 100)}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between text-xs text-green-700">
            <span>{powerStatus.outdoor.percentage}% Used</span>
            <span>{powerStatus.outdoor.entities.length} Active</span>
          </div>
        </div>

        {/* Daytime Power Status */}
        <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-semibold text-orange-800 text-sm">☀️ Daytime Entities</h4>
            <span className={`font-bold text-sm ${getPowerTextColor(powerStatus.daytime.percentage)}`}>
              {powerStatus.daytime.current}/{powerStatus.daytime.max}
            </span>
          </div>
          
          <div className="w-full bg-orange-200 rounded-full h-3 overflow-hidden mb-2">
            <div 
              className={`h-3 rounded-full transition-all duration-500 ${getPowerBarColor(powerStatus.daytime.percentage)}`}
              style={{ width: `${Math.min(powerStatus.daytime.percentage, 100)}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between text-xs text-orange-700">
            <span>{powerStatus.daytime.percentage}% Used</span>
            <span>{powerStatus.daytime.entities.length} Active</span>
          </div>
        </div>

        {/* Active Entities Summary */}
        {allEntities.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <h4 className="font-semibold text-gray-800 mb-2 text-sm">👹 Active Entities ({allEntities.length})</h4>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {allEntities.slice(0, 8).map((entity, index) => (
                <div key={index} className="flex justify-between text-xs bg-white p-2 rounded border">
                  <span className="font-medium">{entity.name}</span>
                  <span className="text-gray-600">Power {entity.powerLevel || 1}</span>
                </div>
              ))}
              {allEntities.length > 8 && (
                <div className="text-xs text-gray-500 text-center">
                  +{allEntities.length - 8} more entities...
                </div>
              )}
            </div>
          </div>
        )}

        {/* Power Management Tips */}
        <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
          <h4 className="font-semibold text-yellow-800 mb-2 text-sm">💡 Power Management</h4>
          <div className="text-xs text-yellow-700 space-y-1">
            <p>• High-power entities (3+): Jester, Nutcracker, Forest Keeper</p>
            <p>• Medium-power entities (2): Bunker Spider, Hygrodere</p>
            <p>• Low-power entities (1): Most others</p>
            <p>• Defeating entities frees up power for new spawns</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PowerStatusPanel;