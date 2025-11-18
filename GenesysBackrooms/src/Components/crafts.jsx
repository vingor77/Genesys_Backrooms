import React from 'react';

export default function Craft({ currCraft, onShowMaterials, onToggleVisibility, userIsDM }) {
  const materials = currCraft.dynamicMaterial ? currCraft.dynamicMaterial.split('/') : [];
  const components = currCraft.components.split('/');
  const hasDynamicMaterials = materials.length > 0 && currCraft.dynamicMaterial !== 'None';

  const getDifficultyColor = (diff) => {
    const difficulty = parseInt(diff);
    if (difficulty <= 2) return 'from-green-600 to-emerald-700 text-green-300 border-green-500/50';
    if (difficulty === 3) return 'from-blue-600 to-cyan-700 text-blue-300 border-blue-500/50';
    if (difficulty === 4) return 'from-orange-600 to-amber-700 text-orange-300 border-orange-500/50';
    return 'from-red-600 to-rose-700 text-red-300 border-red-500/50';
  };

  const getDifficultyLabel = (diff) => {
    const difficulty = parseInt(diff);
    if (difficulty <= 2) return 'Simple';
    if (difficulty === 3) return 'Average';
    if (difficulty === 4) return 'Hard';
    return 'Daunting';
  };

  const getSkillColor = (skill) => {
    switch(skill) {
      case 'Metalworking':
        return 'from-gray-600/30 to-slate-600/30';
      case 'Leatherworking':
        return 'from-amber-600/30 to-yellow-600/30';
      case 'Crafting':
        return 'from-purple-600/30 to-indigo-600/30';
      default:
        return 'from-gray-600/30 to-gray-700/30';
    }
  };

  const getSkillIcon = (skill) => {
    switch(skill) {
      case 'Metalworking':
        return '⚒️';
      case 'Leatherworking':
        return '🧵';
      case 'Crafting':
        return '🔨';
      default:
        return '🛠️';
    }
  };

  return (
    <div className="bg-black/20 backdrop-blur-lg border border-white/10 rounded-2xl overflow-hidden transition-all duration-300 hover:bg-black/30 hover:scale-105 hover:shadow-2xl group h-full flex flex-col">
      {/* Header */}
      <div className={`bg-gradient-to-r ${getSkillColor(currCraft.skill)} border-b border-white/10 p-4 relative`}>
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <span className="text-2xl">{getSkillIcon(currCraft.skill)}</span>
            <span className="text-xs font-medium text-white/70 uppercase tracking-wider">
              {currCraft.skill}
            </span>
          </div>
          <h3 className="text-lg font-bold text-white mb-1 group-hover:text-amber-300 transition-colors">
            {currCraft.name}
          </h3>
          <div className="text-sm text-amber-300">
            {currCraft.craftTime}
          </div>
        </div>
        
        {/* Status Indicator for DM */}
        {userIsDM && currCraft.hiddenInCurrentSession && (
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
          <div className={`bg-gradient-to-r ${getDifficultyColor(currCraft.baseDifficulty)} px-3 py-1 rounded-full text-xs font-bold border`}>
            {getDifficultyLabel(currCraft.baseDifficulty)} ({currCraft.baseDifficulty}◆)
          </div>
          <div className="bg-gradient-to-r from-emerald-600 to-green-600 text-emerald-300 px-3 py-1 rounded-full text-xs font-bold border border-emerald-500/50">
            Attempts: {currCraft.baseAttempts}
          </div>
          <div className="bg-gradient-to-r from-cyan-600 to-blue-600 text-cyan-300 px-3 py-1 rounded-full text-xs font-bold border border-cyan-500/50">
            Components: {components.length}
          </div>
          {hasDynamicMaterials && (
            <div className="bg-gradient-to-r from-purple-600 to-violet-600 text-purple-300 px-3 py-1 rounded-full text-xs font-bold border border-purple-500/50">
              ✨ {materials.length} Enhancements
            </div>
          )}
        </div>
      </div>

      {/* Components List */}
      <div className="flex-1 p-4 pt-0">
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 h-full overflow-y-auto">
          <div className="text-xs font-medium text-amber-400 mb-2">Required Components:</div>
          <div className="space-y-2">
            {components.map((comp, idx) => (
              <div key={idx} className="text-sm text-gray-300 flex items-start">
                <span className="text-amber-500 mr-2 font-bold min-w-[20px]">{idx + 1}.</span>
                <span className="flex-1">{comp}</span>
              </div>
            ))}
          </div>

          {hasDynamicMaterials && (
            <div className="border-t border-white/10 pt-3 mt-3">
              <div className="text-xs font-medium text-purple-400 mb-2">Available Enhancements:</div>
              <div className="space-y-1">
                {materials.map((mat, idx) => (
                  <div key={idx} className="text-xs text-purple-300 flex items-center">
                    <span className="text-purple-500 mr-2">✨</span>
                    <span>{mat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="border-t border-white/10 p-4 space-y-2">
        <div className="flex flex-col gap-2">
          {hasDynamicMaterials && (
            <button
              onClick={() => onShowMaterials(currCraft)}
              className="flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600/20 to-violet-600/20 hover:from-purple-600/30 hover:to-violet-600/30 text-purple-300 font-medium px-4 py-2 rounded-lg border border-purple-500/30 transition-all duration-300 hover:scale-105"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"></path>
              </svg>
              <span>View Enhancement Effects</span>
            </button>
          )}
          
          {userIsDM && (
            <button
              onClick={() => onToggleVisibility(currCraft)}
              className={`flex items-center justify-center space-x-2 font-medium px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105 ${
                currCraft.hiddenInCurrentSession
                  ? 'bg-gradient-to-r from-emerald-600/20 to-green-600/20 hover:from-emerald-600/30 hover:to-green-600/30 text-emerald-300 border border-emerald-500/30'
                  : 'bg-gradient-to-r from-red-600/20 to-pink-600/20 hover:from-red-600/30 hover:to-pink-600/30 text-red-300 border border-red-500/30'
              }`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                {currCraft.hiddenInCurrentSession ? (
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                ) : (
                  <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd"></path>
                )}
                {currCraft.hiddenInCurrentSession && <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"></path>}
              </svg>
              <span>{currCraft.hiddenInCurrentSession ? '👁️ Reveal to Players' : '🚫 Hide from Players'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}