import React from 'react';

export default function Level({ level, onClick, isHidden, userIsDM }) {
  const getClassificationColor = (classification) => {
    switch (classification) {
      case 'Safe': return 'text-green-400 bg-green-500/10 border-green-500/30';
      case 'Habitable': return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
      case 'Dangerous': return 'text-orange-400 bg-orange-500/10 border-orange-500/30';
      case 'Deadly': return 'text-red-400 bg-red-500/10 border-red-500/30';
      case 'Unconfirmed': return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
    }
  };

  const getDangerColor = (dangerLevel) => {
    if (dangerLevel <= 2) return 'text-green-400';
    if (dangerLevel <= 4) return 'text-yellow-400';
    if (dangerLevel <= 6) return 'text-orange-400';
    if (dangerLevel <= 8) return 'text-red-400';
    return 'text-red-600';
  };

  const getLevelTypeIcon = (levelType) => {
    if (levelType === 'procedural') {
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      );
    }
    return (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
      </svg>
    );
  };

  const getTopologyIcon = (topology) => {
    switch (topology) {
      case 'non-euclidean':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'loop':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        );
      case 'maze':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
        );
    }
  };

  const formatTopology = (topology) => {
    if (!topology) return 'Unknown';
    return topology.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join('-');
  };

  return (
    <div
      onClick={onClick}
      className={`
        relative
        bg-gradient-to-br from-white/5 to-white/0
        backdrop-blur-lg
        rounded-2xl p-5
        border border-white/10
        hover:border-purple-500/50
        hover:shadow-xl hover:shadow-purple-500/10
        transition-all duration-300 cursor-pointer
        ${isHidden ? 'opacity-80' : ''}
      `}
    >
      {/* Hidden Badge (DM only) */}
      {userIsDM && isHidden && (
        <div className="absolute top-3 right-3">
          <span className="bg-red-500/20 text-red-400 px-2 py-0.5 rounded text-xs font-bold border border-red-500/50">
            HIDDEN
          </span>
        </div>
      )}

      {/* Header */}
      <div className="mb-4">
        {/* Level Number Badge */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-purple-400 font-mono text-sm">Level {level.levelNumber}</span>
        </div>
        
        <h3 className="text-xl font-bold text-white mb-3 pr-20 leading-tight">
          {level.levelName || 'Unknown Level'}
        </h3>
        
        {/* Classification and Type Row */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Classification Badge */}
          <div className={`px-2.5 py-1 rounded-lg border text-sm font-bold ${getClassificationColor(level.classification)}`}>
            {level.classification}
          </div>

          {/* Level Type Badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/30">
            <span className="text-purple-400">
              {getLevelTypeIcon(level.levelType)}
            </span>
            <span className="text-sm font-medium text-purple-300 capitalize">
              {level.levelType}
            </span>
          </div>

          {/* Topology Badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
            <span className="text-cyan-400">
              {getTopologyIcon(level.spatialProperties?.topology)}
            </span>
            <span className="text-sm font-medium text-cyan-300">
              {formatTopology(level.spatialProperties?.topology)}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {/* Danger Level */}
        <div className="flex items-center gap-1.5 text-sm">
          <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span className={getDangerColor(level.dangerLevel)}>{level.dangerLevel}/10</span>
        </div>

        {/* Lighting */}
        <div className="flex items-center gap-1.5 text-sm">
          <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <span className="text-yellow-400">{level.lightingMin}-{level.lightingMax}</span>
        </div>

        {/* Temperature */}
        <div className="flex items-center gap-1.5 text-sm">
          <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <span className="text-blue-400">{level.temperatureMin}-{level.temperatureMax}</span>
        </div>
      </div>

      {/* Hazards Warning */}
      {level.atmosphericHazards && level.atmosphericHazards.length > 0 && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2 mb-4">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="text-red-300 text-xs font-medium">
              {level.atmosphericHazards.length} Hazard{level.atmosphericHazards.length > 1 ? 's' : ''} Present
            </span>
          </div>
        </div>
      )}

      {/* Tags */}
      {level.tags && level.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {level.tags.slice(0, 4).map((tag, index) => (
            <span 
              key={index}
              className="px-2 py-0.5 rounded text-xs font-medium bg-white/5 text-gray-400 border border-white/10"
            >
              {tag}
            </span>
          ))}
          {level.tags.length > 4 && (
            <span className="px-2 py-0.5 rounded text-xs font-medium bg-white/5 text-gray-500 border border-white/10">
              +{level.tags.length - 4} more
            </span>
          )}
        </div>
      )}

      {/* Description Preview */}
      {level.description && (
        <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed">
          {level.description}
        </p>
      )}
    </div>
  );
}