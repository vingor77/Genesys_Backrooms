import React from 'react';

export default function Phenomenon({ phenomenon, onClick, isHidden, userIsDM }) {
  if (!phenomenon) return null;

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Isolation': return 'from-indigo-600 to-indigo-800 border-indigo-500';
      case 'Temporal': return 'from-cyan-600 to-cyan-800 border-cyan-500';
      case 'Spatial': return 'from-purple-600 to-purple-800 border-purple-500';
      case 'Reality Distortion': return 'from-pink-600 to-pink-800 border-pink-500';
      case 'Environmental': return 'from-green-600 to-green-800 border-green-500';
      case 'Mental': return 'from-yellow-600 to-yellow-800 border-yellow-500';
      case 'Physical': return 'from-red-600 to-red-800 border-red-500';
      default: return 'from-gray-600 to-gray-800 border-gray-500';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Isolation': return '👁️‍🗨️';
      case 'Temporal': return '⏳';
      case 'Spatial': return '🌀';
      case 'Reality Distortion': return '💫';
      case 'Environmental': return '🌡️';
      case 'Mental': return '🧠';
      case 'Physical': return '💀';
      default: return '❓';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 0: return 'text-green-400 bg-green-500/20 border-green-500/50';
      case 1: return 'text-blue-400 bg-blue-500/20 border-blue-500/50';
      case 2: return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/50';
      case 3: return 'text-orange-400 bg-orange-500/20 border-orange-500/50';
      case 4: return 'text-red-400 bg-red-500/20 border-red-500/50';
      case 5: return 'text-red-600 bg-red-600/20 border-red-600/50';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/50';
    }
  };

  const getSeverityLabel = (severity) => {
    switch (severity) {
      case 0: return 'Beneficial';
      case 1: return 'Harmless';
      case 2: return 'Moderate';
      case 3: return 'Significant';
      case 4: return 'Severe';
      case 5: return 'Lethal';
      default: return 'Unknown';
    }
  };

  const getTriggerIcon = (triggerType) => {
    switch (triggerType) {
      case 'automatic': return '⚡';
      case 'player-activated': return '👆';
      case 'random-chance': return '🎲';
      case 'conditional': return '❓';
      default: return '•';
    }
  };

  const getScopeIcon = (scope) => {
    return scope === 'level-wide' ? '🌐' : '🚪';
  };

  return (
    <div
      onClick={onClick}
      className={`
        relative bg-gradient-to-br ${getCategoryColor(phenomenon.category)} 
        rounded-xl p-4 cursor-pointer transition-all duration-300
        hover:scale-[1.02] hover:shadow-xl hover:shadow-black/50
        border border-opacity-50
        ${isHidden ? 'opacity-60' : ''}
      `}
    >
      {/* Hidden Badge */}
      {isHidden && userIsDM && (
        <div className="absolute top-2 right-2 bg-black/70 text-yellow-400 text-xs font-bold px-2 py-1 rounded-full flex items-center space-x-1">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
          </svg>
          <span>Hidden</span>
        </div>
      )}

      {/* Wiki Number Badge */}
      {phenomenon.number && (
        <div className="absolute top-2 left-2 bg-black/50 text-white/70 text-xs font-mono px-2 py-0.5 rounded">
          #{phenomenon.number}
        </div>
      )}

      {/* Category Icon & Name */}
      <div className="flex items-start space-x-3 mb-3 mt-2">
        <div className="text-4xl">{getCategoryIcon(phenomenon.category)}</div>
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-bold text-lg leading-tight truncate">{phenomenon.name}</h3>
          <div className="text-white/70 text-sm">{phenomenon.category}</div>
        </div>
      </div>

      {/* Severity & Scope Row */}
      <div className="flex items-center justify-between mb-3">
        <span className={`px-2 py-0.5 rounded text-xs font-bold border ${getSeverityColor(phenomenon.severity)}`}>
          {getSeverityLabel(phenomenon.severity)} ({phenomenon.severity}/5)
        </span>
        <span className="px-2 py-0.5 rounded text-xs font-medium bg-white/10 text-white/80 border border-white/20">
          {getScopeIcon(phenomenon.scope)} {phenomenon.scope === 'level-wide' ? 'Level-wide' : 'Room-specific'}
        </span>
      </div>

      {/* Trigger Type */}
      <div className="bg-black/30 rounded-lg p-2 mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-lg">{getTriggerIcon(phenomenon.triggerType)}</span>
          <span className="text-white/80 text-sm capitalize">{phenomenon.triggerType?.replace('-', ' ')}</span>
        </div>
      </div>

      {/* Overview Preview */}
      <p className="text-white/70 text-sm line-clamp-2 mb-3">
        {phenomenon.description?.overview}
      </p>

      {/* Effects Count & Counterplay */}
      <div className="flex flex-wrap gap-2">
        {phenomenon.effects?.length > 0 && (
          <span className="px-2 py-0.5 rounded text-xs bg-red-500/20 text-red-300 border border-red-500/30">
            ⚠️ {phenomenon.effects.length} Effect{phenomenon.effects.length > 1 ? 's' : ''}
          </span>
        )}
        {phenomenon.counterplay?.canBeAvoided && (
          <span className="px-2 py-0.5 rounded text-xs bg-green-500/20 text-green-300 border border-green-500/30">
            🛡️ Avoidable
          </span>
        )}
        {phenomenon.counterplay?.canBeResisted && (
          <span className="px-2 py-0.5 rounded text-xs bg-blue-500/20 text-blue-300 border border-blue-500/30">
            💪 Resistable
          </span>
        )}
        {phenomenon.variants?.length > 0 && (
          <span className="px-2 py-0.5 rounded text-xs bg-purple-500/20 text-purple-300 border border-purple-500/30">
            🔀 {phenomenon.variants.length} Variant{phenomenon.variants.length > 1 ? 's' : ''}
          </span>
        )}
      </div>
    </div>
  );
}