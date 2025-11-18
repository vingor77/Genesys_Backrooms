import React from 'react';

export default function Level({ currLevel, onShowDetails, onToggleVisibility, userIsDM }) {
  const getDangerColor = (danger) => {
    if (danger === 0) return 'from-green-600 to-emerald-700 text-green-300 border-green-500/50';
    if (danger === 1) return 'from-blue-600 to-cyan-700 text-blue-300 border-blue-500/50';
    if (danger === 2) return 'from-yellow-600 to-amber-700 text-yellow-300 border-yellow-500/50';
    if (danger === 3) return 'from-orange-600 to-red-700 text-orange-300 border-orange-500/50';
    if (danger === 4) return 'from-red-600 to-rose-700 text-red-300 border-red-500/50';
    return 'from-purple-600 to-fuchsia-700 text-purple-300 border-purple-500/50';
  };

  const getDangerLabel = (danger) => {
    const labels = {
      0: 'Safe',
      1: 'Low Danger',
      2: 'Moderate',
      3: 'Dangerous',
      4: 'Very Dangerous',
      5: 'Lethal'
    };
    return labels[danger] || 'Unknown';
  };

  const getGenerationIcon = (type) => {
    switch(type) {
      case 'procedural':
        return '🎲';
      case 'finite_mapped':
        return '🗺️';
      case 'hybrid':
        return '🔀';
      default:
        return '❓';
    }
  };

  const getGenerationColor = (type) => {
    switch(type) {
      case 'procedural':
        return 'from-purple-600/30 to-indigo-600/30';
      case 'finite_mapped':
        return 'from-blue-600/30 to-cyan-600/30';
      case 'hybrid':
        return 'from-green-600/30 to-emerald-600/30';
      default:
        return 'from-gray-600/30 to-gray-700/30';
    }
  };

  const atmosphere = currLevel.atmosphere || {};
  const spawnRates = currLevel.spawnRates || {};
  const hasEntities = spawnRates.entities?.enabled;
  const hasPhenomena = spawnRates.phenomena?.enabled;
  const hasObjects = spawnRates.objects?.enabled;
  const hasPOI = spawnRates.peopleOfInterest?.enabled;

  return (
    <div className="bg-black/20 backdrop-blur-lg border border-white/10 rounded-2xl overflow-hidden transition-all duration-300 hover:bg-black/30 hover:scale-105 hover:shadow-2xl group h-full flex flex-col">
      {/* Header */}
      <div className={`bg-gradient-to-r ${getGenerationColor(currLevel.generationType)} border-b border-white/10 p-4 relative`}>
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <span className="text-2xl">{getGenerationIcon(currLevel.generationType)}</span>
            <span className="text-xs font-medium text-white/70 uppercase tracking-wider">
              Level {currLevel.levelNumber}
            </span>
            {currLevel.isCanonical && (
              <span className="text-xs bg-yellow-500/30 text-yellow-300 px-2 py-0.5 rounded border border-yellow-500/50">
                CANON
              </span>
            )}
          </div>
          <h3 className="text-lg font-bold text-white mb-1 group-hover:text-cyan-300 transition-colors">
            {currLevel.name}
          </h3>
          <div className="text-sm text-cyan-300">
            {currLevel.survivalDifficulty || 'Unknown Difficulty'}
          </div>
        </div>
        
        {/* Status Indicator for DM */}
        {userIsDM && currLevel.hiddenInCurrentSession && (
          <div className="absolute top-4 right-4">
            <div className="bg-red-500/90 text-white text-xs font-bold px-2 py-1 rounded-full border border-red-400">
              🚫 HIDDEN
            </div>
          </div>
        )}
      </div>

      {/* Stats Chips */}
      <div className="p-4 space-y-3">
        <div className="flex flex-wrap gap-2 justify-center">
          <div className={`bg-gradient-to-r ${getDangerColor(currLevel.dangerLevel)} px-3 py-1 rounded-full text-xs font-bold border`}>
            ⚠️ {getDangerLabel(currLevel.dangerLevel)}
          </div>
          <div className="bg-gradient-to-r from-slate-600 to-gray-600 text-slate-300 px-3 py-1 rounded-full text-xs font-bold border border-slate-500/50">
            🌡️ {atmosphere.temperature || 'Unknown'}
          </div>
          <div className="bg-gradient-to-r from-amber-600 to-yellow-600 text-amber-300 px-3 py-1 rounded-full text-xs font-bold border border-amber-500/50">
            💡 {atmosphere.lightLevel || 'Unknown'}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 justify-center">
          {hasObjects && (
            <div className="bg-gradient-to-r from-cyan-600 to-blue-600 text-cyan-300 px-2 py-1 rounded-full text-xs font-bold border border-cyan-500/50">
              📦 Objects
            </div>
          )}
          {hasEntities && (
            <div className="bg-gradient-to-r from-red-600 to-rose-600 text-red-300 px-2 py-1 rounded-full text-xs font-bold border border-red-500/50">
              👹 Entities
            </div>
          )}
          {hasPhenomena && (
            <div className="bg-gradient-to-r from-purple-600 to-violet-600 text-purple-300 px-2 py-1 rounded-full text-xs font-bold border border-purple-500/50">
              ✨ Phenomena
            </div>
          )}
          {hasPOI && (
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-green-300 px-2 py-1 rounded-full text-xs font-bold border border-green-500/50">
              👤 POI
            </div>
          )}
        </div>
      </div>

      {/* Description Preview */}
      <div className="flex-1 p-4 pt-0">
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 h-full">
          <div className="text-xs font-medium text-cyan-400 mb-2">Description:</div>
          <p className="text-sm text-gray-300 line-clamp-4">
            {currLevel.description || 'No description available.'}
          </p>
          
          {atmosphere.ambientSounds && atmosphere.ambientSounds.length > 0 && (
            <div className="mt-3 pt-3 border-t border-white/10">
              <div className="text-xs font-medium text-purple-400 mb-1">Ambient Sounds:</div>
              <div className="text-xs text-purple-300">
                {atmosphere.ambientSounds[0]}
                {atmosphere.ambientSounds.length > 1 && ` +${atmosphere.ambientSounds.length - 1} more`}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Physical Stats */}
      <div className="px-4 pb-4">
        <div className="bg-white/5 border border-white/10 rounded-xl p-3 space-y-2">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <div className="text-gray-400">Complexity</div>
              <div className="text-white font-semibold capitalize">
                {currLevel.navigation?.complexity || 'Unknown'}
              </div>
            </div>
            <div>
              <div className="text-gray-400">Ceiling</div>
              <div className="text-white font-semibold capitalize">
                {currLevel.physical?.ceilingHeight || 'Unknown'}
              </div>
            </div>
          </div>
          
          {currLevel.navigation?.landmarkChance !== undefined && (
            <div className="pt-2 border-t border-white/10">
              <div className="text-gray-400 text-xs mb-1">Navigation Difficulty:</div>
              <div className="flex justify-between text-xs">
                <span className="text-blue-300">Landmarks: {currLevel.navigation.landmarkChance}%</span>
                <span className="text-amber-300">Loops: {currLevel.navigation.loopingChance}%</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="border-t border-white/10 p-4 space-y-2">
        <div className="flex flex-col gap-2">
          <button
            onClick={() => onShowDetails(currLevel)}
            className="flex items-center justify-center space-x-2 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 hover:from-cyan-600/30 hover:to-blue-600/30 text-cyan-300 font-medium px-4 py-2 rounded-lg border border-cyan-500/30 transition-all duration-300 hover:scale-105"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"></path>
            </svg>
            <span>View Complete Details</span>
          </button>
          
          {userIsDM && (
            <button
              onClick={() => onToggleVisibility(currLevel)}
              className={`flex items-center justify-center space-x-2 font-medium px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105 ${
                currLevel.hiddenInCurrentSession
                  ? 'bg-gradient-to-r from-emerald-600/20 to-green-600/20 hover:from-emerald-600/30 hover:to-green-600/30 text-emerald-300 border border-emerald-500/30'
                  : 'bg-gradient-to-r from-red-600/20 to-pink-600/20 hover:from-red-600/30 hover:to-pink-600/30 text-red-300 border border-red-500/30'
              }`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                {currLevel.hiddenInCurrentSession ? (
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                ) : (
                  <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd"></path>
                )}
                {currLevel.hiddenInCurrentSession && <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"></path>}
              </svg>
              <span>{currLevel.hiddenInCurrentSession ? '👁️ Reveal to Players' : '🚫 Hide from Players'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}