import React from 'react';

export default function Entity({ entity, onClick, isHidden, userIsDM }) {
  const getCategoryColor = (category) => {
    switch (category) {
      case 'Hostile': return 'text-red-400 bg-red-500/10 border-red-500/30';
      case 'Boss': return 'text-purple-400 bg-purple-500/10 border-purple-500/30';
      case 'Neutral': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
      case 'Beneficial': return 'text-green-400 bg-green-500/10 border-green-500/30';
      case 'Ambient': return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
      case 'Environmental': return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30';
      case 'Anomalous': return 'text-pink-400 bg-pink-500/10 border-pink-500/30';
      case 'Intelligent': return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
    }
  };

  const getAdversaryColor = (type) => {
    switch (type) {
      case 'minion': return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
      case 'rival': return 'text-orange-400 bg-orange-500/10 border-orange-500/30';
      case 'nemesis': return 'text-red-400 bg-red-500/10 border-red-500/30';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
    }
  };

  const getDifficultyColor = (rating) => {
    if (rating <= 2) return 'text-green-400';
    if (rating <= 4) return 'text-blue-400';
    if (rating <= 6) return 'text-yellow-400';
    if (rating <= 8) return 'text-orange-400';
    return 'text-red-400';
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Hostile':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      case 'Boss':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        );
      case 'Neutral':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'Beneficial':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        );
      case 'Ambient':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        );
      case 'Anomalous':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        );
      case 'Intelligent':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
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
        hover:border-red-500/50
        hover:shadow-xl hover:shadow-red-500/10
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
        <div className="flex items-start gap-2 mb-3">
          <h3 className="text-xl font-bold text-white leading-tight flex-1 pr-16">
            {entity.name || 'Unknown Entity'}
          </h3>
        </div>
        
        {/* Category, Adversary Type, and Difficulty Row */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Category Badge */}
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border ${getCategoryColor(entity.category)}`}>
            <span>{getCategoryIcon(entity.category)}</span>
            <span className="text-sm font-medium">{entity.category}</span>
          </div>

          {/* Adversary Type Badge */}
          <div className={`px-2.5 py-1 rounded-lg border text-sm font-bold capitalize ${getAdversaryColor(entity.adversaryType)}`}>
            {entity.adversaryType}
          </div>

          {/* Difficulty Rating */}
          <div className="px-2.5 py-1 rounded-lg bg-gray-500/10 border border-gray-500/30">
            <span className={`text-sm font-bold ${getDifficultyColor(entity.difficultyRating)}`}>
              ⚔ {entity.difficultyRating}/10
            </span>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {/* Wounds */}
        <div className="flex items-center gap-1.5 text-sm">
          <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <span className="text-red-400">{entity.derived?.woundsThreshold || 0}</span>
        </div>

        {/* Soak */}
        <div className="flex items-center gap-1.5 text-sm">
          <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span className="text-blue-400">{entity.derived?.soak || 0}</span>
        </div>

        {/* Group Size */}
        <div className="flex items-center gap-1.5 text-sm">
          <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span className="text-purple-400">
            {entity.groupSize?.min === entity.groupSize?.max 
              ? entity.groupSize?.min 
              : `${entity.groupSize?.min}-${entity.groupSize?.max}`}
          </span>
        </div>
      </div>

      {/* Boss Warning */}
      {entity.bossEncounter?.isBoss && (
        <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg px-3 py-2 mb-4">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-purple-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
            <span className="text-purple-300 text-xs font-medium">
              Boss Encounter • Party of {entity.challengeRating?.groupSize || '?'}
            </span>
          </div>
        </div>
      )}

      {/* Abilities Preview */}
      {entity.abilities && entity.abilities.length > 0 && (
        <div className="flex items-center gap-1.5 text-sm text-gray-400 mb-3">
          <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span className="text-amber-400">{entity.abilities.length} Abilities</span>
        </div>
      )}

      {/* Description Preview */}
      {entity.description?.appearance && (
        <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed">
          {entity.description.appearance}
        </p>
      )}
    </div>
  );
}