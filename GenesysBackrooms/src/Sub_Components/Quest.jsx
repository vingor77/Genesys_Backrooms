import React from 'react';

export default function Quest({ quest, onClick, isHidden, userIsDM }) {
  if (!quest) return null;

  const getTypeColor = (type) => {
    switch (type) {
      case 'main': return 'from-amber-600 to-orange-700 border-amber-500';
      case 'side': return 'from-blue-600 to-blue-800 border-blue-500';
      case 'faction': return 'from-purple-600 to-purple-800 border-purple-500';
      case 'personal': return 'from-pink-600 to-pink-800 border-pink-500';
      case 'world': return 'from-green-600 to-green-800 border-green-500';
      default: return 'from-gray-600 to-gray-800 border-gray-500';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'main': return '⭐';
      case 'side': return '📋';
      case 'faction': return '🏛️';
      case 'personal': return '👤';
      case 'world': return '🌍';
      default: return '📜';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400 bg-green-500/20 border-green-500/50';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/50';
      case 'hard': return 'text-orange-400 bg-orange-500/20 border-orange-500/50';
      case 'deadly': return 'text-red-400 bg-red-500/20 border-red-500/50';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/50';
    }
  };

  const getGiverTypeIcon = (type) => {
    switch (type) {
      case 'poi': return '👤';
      case 'faction': return '🏛️';
      case 'object': return '📦';
      case 'event': return '⚡';
      case 'discovery': return '🔍';
      case 'none': return '—';
      default: return '❓';
    }
  };

  const getCompletionStatus = () => {
    if (!quest.sessionTracking) return null;
    if (quest.sessionTracking.completed) return { text: 'Completed', color: 'bg-green-500/20 text-green-400 border-green-500/50' };
    if (quest.sessionTracking.completedObjectives?.length > 0) {
      const total = quest.objectives?.length || 0;
      const done = quest.sessionTracking.completedObjectives.length;
      return { text: `${done}/${total}`, color: 'bg-blue-500/20 text-blue-400 border-blue-500/50' };
    }
    if (quest.sessionTracking.shownToPlayers) return { text: 'Active', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50' };
    return null;
  };

  const status = getCompletionStatus();
  const sessionID = localStorage.getItem('activeSession');

  return (
    <div
      onClick={onClick}
      className={`
        relative bg-gradient-to-br ${getTypeColor(quest.type)} 
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

      {/* Completion Status Badge */}
      {quest.sessionTracking[sessionID].completed && !(isHidden && userIsDM) && (
        <div className={`absolute top-2 right-2 bg-black/70 text-green-400 text-xs font-bold px-2 py-1 rounded-full flex items-center space-x-1`}>
          Completed
        </div>
      )}

      {/* Type Icon & Name */}
      <div className="flex items-start space-x-3 mb-3 mt-1">
        <div className="text-4xl">{getTypeIcon(quest.type)}</div>
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-bold text-lg leading-tight">{quest.name}</h3>
          <div className="text-white/70 text-sm capitalize">{quest.type} Quest</div>
        </div>
      </div>

      {/* Difficulty & Type Row */}
      <div className="flex items-center justify-between mb-3">
        {quest.difficulty && (
          <span className={`px-2 py-0.5 rounded text-xs font-bold border capitalize ${getDifficultyColor(quest.difficulty)}`}>
            {quest.difficulty}
          </span>
        )}
        {quest.questLine && (
          <span className="px-2 py-0.5 rounded text-xs bg-white/10 text-white/80 border border-white/20">
            {quest.questLine.name} ({quest.questLine.position})
          </span>
        )}
      </div>

      {/* Quest Giver */}
      {quest.questGiver && (
        <div className="bg-black/30 rounded-lg p-2 mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-lg">{getGiverTypeIcon(quest.questGiver.type)}</span>
            <div className="flex-1 min-w-0">
              <div className="text-xs text-gray-400">Quest Giver</div>
              <div className="text-white text-sm truncate">
                {quest.questGiver.id ? quest.questGiver.id.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : quest.questGiver.type}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Description Preview */}
      <p className="text-white/70 text-sm line-clamp-2 mb-3">
        {quest.description}
      </p>

      {/* Stats Row */}
      <div className="flex flex-wrap gap-2">
        {quest.objectives?.length > 0 && (
          <span className="px-2 py-0.5 rounded text-xs bg-blue-500/20 text-blue-300 border border-blue-500/30">
            📝 {quest.objectives.length} Objective{quest.objectives.length > 1 ? 's' : ''}
          </span>
        )}
        {quest.variants?.length > 0 && (
          <span className="px-2 py-0.5 rounded text-xs bg-purple-500/20 text-purple-300 border border-purple-500/30">
            🔀 {quest.variants.length} Variant{quest.variants.length > 1 ? 's' : ''}
          </span>
        )}
        {quest.rewards?.items?.length > 0 && (
          <span className="px-2 py-0.5 rounded text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30">
            🎁 {quest.rewards.items.length} Reward{quest.rewards.items.length > 1 ? 's' : ''}
          </span>
        )}
        {quest.prerequisites?.quests?.length > 0 && (
          <span className="px-2 py-0.5 rounded text-xs bg-red-500/20 text-red-300 border border-red-500/30">
            🔒 Prerequisites
          </span>
        )}
      </div>

      {/* Themes */}
      {quest.themes?.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {quest.themes.slice(0, 3).map((theme, idx) => (
            <span key={idx} className="px-2 py-0.5 rounded text-xs bg-white/10 text-white/60">
              {theme}
            </span>
          ))}
          {quest.themes.length > 3 && (
            <span className="px-2 py-0.5 rounded text-xs bg-white/10 text-white/60">
              +{quest.themes.length - 3}
            </span>
          )}
        </div>
      )}
    </div>
  );
}