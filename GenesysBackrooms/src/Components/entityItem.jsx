import React from 'react';

export default function EntityItem({ entity, onShowDetails, onToggleVisibility, userIsDM }) {
  const getEntityTypeColor = (type) => {
    switch(type) {
      case 'Beast':
        return 'from-green-600/30 to-emerald-600/30';
      case 'Humanoid':
        return 'from-blue-600/30 to-cyan-600/30';
      case 'Construct':
        return 'from-gray-600/30 to-slate-600/30';
      case 'Undead':
        return 'from-purple-600/30 to-violet-600/30';
      case 'Aberration':
        return 'from-pink-600/30 to-rose-600/30';
      case 'Spectral':
        return 'from-indigo-600/30 to-purple-600/30';
      default:
        return 'from-gray-600/30 to-gray-700/30';
    }
  };

  const getEntityTypeIcon = (type) => {
    const icons = {
      'Beast': '🐺',
      'Humanoid': '👤',
      'Construct': '🤖',
      'Undead': '💀',
      'Aberration': '👁️',
      'Spectral': '👻',
      'Dragon': '🐉',
      'Elemental': '🔥'
    };
    return icons[type] || '❓';
  };

  const getAdversaryColor = (type) => {
    switch(type) {
      case 'Minion':
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
      case 'Rival':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'Nemesis':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const skillCount = entity.skills?.length || 0;
  const abilityCount = (entity.talents?.length || 0) + (entity.abilities?.length || 0);
  const actionCount = entity.actions?.length || 0;

  return (
    <div className="bg-black/20 backdrop-blur-lg border border-white/10 rounded-2xl overflow-hidden transition-all duration-300 hover:bg-black/30 hover:scale-105 hover:shadow-2xl group h-full flex flex-col">
      {/* Header */}
      <div className={`bg-gradient-to-r ${getEntityTypeColor(entity.entity_type)} border-b border-white/10 p-4 relative`}>
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <span className="text-2xl">{getEntityTypeIcon(entity.entity_type)}</span>
            <span className="text-xs font-medium text-white/70 uppercase tracking-wider">
              {entity.entity_type}
            </span>
          </div>
          <h3 className="text-lg font-bold text-white mb-1 group-hover:text-purple-300 transition-colors">
            {entity.name}
          </h3>
          {entity.scientific_name && (
            <div className="text-xs italic text-gray-400">
              {entity.scientific_name}
            </div>
          )}
        </div>
        
        {/* Status Indicator for DM */}
        {userIsDM && entity.hiddenInCurrentSession && (
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
          <div className={`px-3 py-1 rounded-full text-xs font-bold border ${getAdversaryColor(entity.adversary_type)}`}>
            {entity.adversary_type}
          </div>
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-purple-300 px-3 py-1 rounded-full text-xs font-bold border border-purple-500/50">
            Silhouette: {entity.silhouette}
          </div>
          {skillCount > 0 && (
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-blue-300 px-3 py-1 rounded-full text-xs font-bold border border-blue-500/50">
              📚 {skillCount} Skills
            </div>
          )}
          {abilityCount > 0 && (
            <div className="bg-gradient-to-r from-amber-600 to-yellow-600 text-amber-300 px-3 py-1 rounded-full text-xs font-bold border border-amber-500/50">
              ✨ {abilityCount} Abilities
            </div>
          )}
          {actionCount > 0 && (
            <div className="bg-gradient-to-r from-red-600 to-orange-600 text-red-300 px-3 py-1 rounded-full text-xs font-bold border border-red-500/50">
              ⚔️ {actionCount} Actions
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      {entity.short_description && (
        <div className="flex-1 px-4 pb-4">
          <div className="bg-white/5 border border-white/10 rounded-xl p-3 h-full">
            <div className="text-xs font-medium text-purple-400 mb-2">Description:</div>
            <p className="text-sm text-gray-300 line-clamp-4">{entity.short_description}</p>
          </div>
        </div>
      )}

      {/* Combat Stats Preview */}
      <div className="px-4 pb-4">
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-2 text-center">
            <div className="text-red-400 text-xs font-medium">Wounds</div>
            <div className="text-red-300 font-bold">{entity.derived_attributes?.wounds || 0}</div>
          </div>
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-2 text-center">
            <div className="text-green-400 text-xs font-medium">Soak</div>
            <div className="text-green-300 font-bold">{entity.derived_attributes?.soak || 0}</div>
          </div>
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-2 text-center">
            <div className="text-blue-400 text-xs font-medium">Defense</div>
            <div className="text-blue-300 font-bold text-xs">
              {entity.derived_attributes?.defense_melee || 0}/{entity.derived_attributes?.defense_ranged || 0}
            </div>
          </div>
        </div>
      </div>

      {/* Characteristics Preview */}
      <div className="px-4 pb-4">
        <div className="bg-white/5 border border-white/10 rounded-xl p-3">
          <div className="text-xs font-medium text-amber-400 mb-2">Characteristics:</div>
          <div className="grid grid-cols-3 gap-2">
            <div className="text-xs">
              <span className="text-gray-400">BR:</span>
              <span className="text-white font-bold ml-1">{entity.characteristics?.brawn || 0}</span>
            </div>
            <div className="text-xs">
              <span className="text-gray-400">AG:</span>
              <span className="text-white font-bold ml-1">{entity.characteristics?.agility || 0}</span>
            </div>
            <div className="text-xs">
              <span className="text-gray-400">INT:</span>
              <span className="text-white font-bold ml-1">{entity.characteristics?.intellect || 0}</span>
            </div>
            <div className="text-xs">
              <span className="text-gray-400">CUN:</span>
              <span className="text-white font-bold ml-1">{entity.characteristics?.cunning || 0}</span>
            </div>
            <div className="text-xs">
              <span className="text-gray-400">WIL:</span>
              <span className="text-white font-bold ml-1">{entity.characteristics?.willpower || 0}</span>
            </div>
            <div className="text-xs">
              <span className="text-gray-400">PR:</span>
              <span className="text-white font-bold ml-1">{entity.characteristics?.presence || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="border-t border-white/10 p-4 space-y-2">
        <div className="flex flex-col gap-2">
          <button
            onClick={() => onShowDetails(entity)}
            className="flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600/20 to-indigo-600/20 hover:from-purple-600/30 hover:to-indigo-600/30 text-purple-300 font-medium px-4 py-2 rounded-lg border border-purple-500/30 transition-all duration-300 hover:scale-105"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"></path>
            </svg>
            <span>View Full Details</span>
          </button>
        </div>
      </div>
    </div>
  );
}