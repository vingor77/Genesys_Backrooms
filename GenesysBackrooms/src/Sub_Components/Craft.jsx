import React from 'react';

export default function Craft({ recipe, onClick, isHidden, userIsDM }) {
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Simple': return 'text-green-400 bg-green-500/10 border-green-500/30';
      case 'Easy': return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
      case 'Average': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
      case 'Hard': return 'text-orange-400 bg-orange-500/10 border-orange-500/30';
      case 'Daunting': return 'text-red-400 bg-red-500/10 border-red-500/30';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
    }
  };

  const getSkillIcon = (skill) => {
    switch (skill) {
      case 'Metalworking':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        );
      case 'Leatherworking':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
          </svg>
        );
      case 'Alchemy':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        );
      case 'Carpentry':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        );
      case 'Cooking':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
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
        <h3 className="text-xl font-bold text-white mb-3 pr-20 leading-tight">
          {recipe.name || 'Unknown Recipe'}
        </h3>
        
        {/* Skill and Difficulty Row */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Skill Badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/30">
            <span className="text-purple-400">
              {getSkillIcon(recipe.crafting_skill)}
            </span>
            <span className="text-sm font-medium text-purple-300">
              {recipe.crafting_skill}
            </span>
          </div>

          {/* Difficulty Badge */}
          <div className={`px-2.5 py-1 rounded-lg border text-sm font-bold ${getDifficultyColor(recipe.base_difficulty)}`}>
            {recipe.base_difficulty}
          </div>

          {/* Time Badge */}
          <div className="px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
            <span className="text-sm font-medium text-cyan-300">{recipe.crafting_time}</span>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {/* Materials */}
        <div className="flex items-center gap-1.5 text-sm">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <span className="text-gray-400">{recipe.base_components?.length || 0}</span>
        </div>

        {/* Enhancements */}
        <div className="flex items-center gap-1.5 text-sm">
          <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
          <span className="text-purple-400">{recipe.enhancements?.length || 0}</span>
        </div>

        {/* Yield */}
        <div className="flex items-center gap-1.5 text-sm">
          <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-green-400">×{recipe.yield || 1}</span>
        </div>
      </div>

      {/* Workshop Warning */}
      {recipe.required_workshop && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg px-3 py-2 mb-4">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-amber-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="text-amber-300 text-xs font-medium">Requires Workshop</span>
          </div>
        </div>
      )}

      {/* Crafting Notes Preview */}
      {recipe.crafting_notes && (
        <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed">
          {recipe.crafting_notes}
        </p>
      )}
    </div>
  );
}