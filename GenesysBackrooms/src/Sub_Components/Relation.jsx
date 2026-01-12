import React from 'react';

export default function Relation({ relation, onClick, isHidden, userIsDM }) {
  if (!relation) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case 'Friendly': return 'from-green-600 to-emerald-700 border-green-500';
      case 'Neutral': return 'from-gray-600 to-slate-700 border-gray-500';
      case 'Tense': return 'from-yellow-600 to-amber-700 border-yellow-500';
      case 'Hostile': return 'from-orange-600 to-red-700 border-orange-500';
      case 'War': return 'from-red-700 to-red-900 border-red-500';
      default: return 'from-gray-600 to-gray-800 border-gray-500';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Friendly': return '🤝';
      case 'Neutral': return '⚖️';
      case 'Tense': return '😤';
      case 'Hostile': return '⚔️';
      case 'War': return '💥';
      default: return '❓';
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'Friendly': return 'bg-green-500/20 text-green-300 border-green-500/50';
      case 'Neutral': return 'bg-gray-500/20 text-gray-300 border-gray-500/50';
      case 'Tense': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50';
      case 'Hostile': return 'bg-orange-500/20 text-orange-300 border-orange-500/50';
      case 'War': return 'bg-red-500/20 text-red-300 border-red-500/50';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/50';
    }
  };

  const formatName = (str) => {
    if (!str) return '';
    return str.split(/[-_]/).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const eventCount = relation.sharedHistory?.majorEvents?.length || 0;
  const questHookCount = relation.questHooks?.length || 0;

  return (
    <div
      onClick={onClick}
      className={`
        relative bg-gradient-to-br ${getStatusColor(relation.status)} 
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

      {/* Status Icon & Factions */}
      <div className="flex items-center justify-center mb-4">
        <div className="flex items-center space-x-3">
          <div className="bg-black/30 rounded-lg px-3 py-2 text-center">
            <div className="text-white font-bold text-lg">{formatName(relation.factionA)}</div>
          </div>
          <div className="text-4xl">{getStatusIcon(relation.status)}</div>
          <div className="bg-black/30 rounded-lg px-3 py-2 text-center">
            <div className="text-white font-bold text-lg">{formatName(relation.factionB)}</div>
          </div>
        </div>
      </div>

      {/* Status Badge */}
      <div className="flex justify-center mb-3">
        <span className={`px-4 py-1.5 rounded-lg text-sm font-bold border ${getStatusBadgeColor(relation.status)}`}>
          {relation.status}
        </span>
      </div>

      {/* Timeline Info */}
      <div className="grid grid-cols-3 gap-2 text-center mb-3">
        <div className="bg-black/20 rounded p-2">
          <div className="text-xs text-white/60">First Contact</div>
          <div className="text-white font-medium">{relation.firstContact}</div>
        </div>
        <div className="bg-black/20 rounded p-2">
          <div className="text-xs text-white/60">Established</div>
          <div className="text-white font-medium">{relation.established}</div>
        </div>
        <div className="bg-black/20 rounded p-2">
          <div className="text-xs text-white/60">Last Updated</div>
          <div className="text-white font-medium">{relation.lastUpdated}</div>
        </div>
      </div>

      {/* Root Cause Preview */}
      {relation.sharedHistory?.rootCause && (
        <p className="text-white/70 text-sm line-clamp-2 mb-3">
          {relation.sharedHistory.rootCause}
        </p>
      )}

      {/* Stats Row */}
      <div className="flex flex-wrap gap-2">
        {eventCount > 0 && (
          <span className="px-2 py-0.5 rounded text-xs bg-blue-500/20 text-blue-300 border border-blue-500/30">
            📜 {eventCount} Event{eventCount > 1 ? 's' : ''}
          </span>
        )}
        {questHookCount > 0 && (
          <span className="px-2 py-0.5 rounded text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30">
            🎯 {questHookCount} Quest Hook{questHookCount > 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Tags */}
      {relation.tags?.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {relation.tags.slice(0, 3).map((tag, idx) => (
            <span key={idx} className="px-2 py-0.5 rounded text-xs bg-white/10 text-white/60">
              {tag}
            </span>
          ))}
          {relation.tags.length > 3 && (
            <span className="px-2 py-0.5 rounded text-xs bg-white/10 text-white/60">
              +{relation.tags.length - 3}
            </span>
          )}
        </div>
      )}
    </div>
  );
}