import React from 'react';

export default function Person({ person, onClick, isHidden, userIsDM }) {
  if (!person) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'text-green-400 bg-green-500/20 border-green-500/50';
      case 'Deceased': return 'text-red-400 bg-red-500/20 border-red-500/50';
      case 'Comatose': return 'text-purple-400 bg-purple-500/20 border-purple-500/50';
      case 'MIA': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/50';
      case 'Unknown': return 'text-gray-400 bg-gray-500/20 border-gray-500/50';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/50';
    }
  };

  const getHostilityColor = (hostility) => {
    switch (hostility) {
      case 'Friendly': return 'text-green-400';
      case 'Neutral': return 'text-yellow-400';
      case 'Hostile': return 'text-red-400';
      case 'Varies': return 'text-purple-400';
      default: return 'text-gray-400';
    }
  };

  const getSpeciesIcon = (species) => {
    switch (species?.toLowerCase()) {
      case 'human': return '👤';
      case 'entity': return '👁️';
      case 'hybrid': return '🧬';
      case 'unknown': return '❓';
      default: return '👤';
    }
  };

  const getLocationTypeIcon = (type) => {
    switch (type) {
      case 'Outpost': return '🏠';
      case 'Roaming': return '🚶';
      case 'Level': return '📍';
      case 'Unknown': return '❓';
      default: return '📍';
    }
  };

  const getTagIcon = (tag) => {
    const lower = tag.toLowerCase();
    if (lower.includes('quest')) return '📜';
    if (lower.includes('vendor')) return '🛒';
    if (lower.includes('leader')) return '👑';
    if (lower.includes('antagonist')) return '⚔️';
    if (lower.includes('story')) return '📖';
    if (lower.includes('companion')) return '🤝';
    return '🏷️';
  };

  // Get first 2 relevant tags
  const displayTags = person.tags?.slice(0, 2) || [];

  return (
    <div
      onClick={onClick}
      className={`
        relative bg-gradient-to-br from-slate-800 to-slate-900 
        rounded-xl p-4 cursor-pointer transition-all duration-300
        hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/20
        border border-blue-500/30
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

      {/* Species Icon & Name */}
      <div className="flex items-start space-x-3 mb-3">
        <div className="text-4xl">{getSpeciesIcon(person.species)}</div>
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-bold text-lg leading-tight truncate">{person.name}</h3>
          {person.aliases?.length > 0 && (
            <div className="text-gray-400 text-xs truncate">
              "{person.aliases[0]}"
            </div>
          )}
        </div>
      </div>

      {/* Status & Species Row */}
      <div className="flex items-center justify-between mb-3">
        <span className={`px-2 py-0.5 rounded text-xs font-bold border ${getStatusColor(person.status?.primary)}`}>
          {person.status?.primary}
        </span>
        <span className="text-gray-400 text-sm">
          {person.species} • {person.age}y • {person.gender}
        </span>
      </div>

      {/* Faction & Rank */}
      {person.affiliations?.primaryGroup && (
        <div className="bg-black/30 rounded-lg p-2 mb-3">
          <div className="text-xs text-gray-500 mb-0.5">Affiliation</div>
          <div className="flex items-center justify-between">
            <span className="text-blue-300 font-medium text-sm truncate">{person.affiliations.primaryGroup}</span>
            {person.affiliations.rank && (
              <span className="text-gray-400 text-xs">{person.affiliations.rank}</span>
            )}
          </div>
        </div>
      )}

      {/* Location */}
      <div className="flex items-center space-x-2 mb-3 text-sm">
        <span className="text-lg">{getLocationTypeIcon(person.currentLocation?.type)}</span>
        <span className="text-gray-400">
          {person.currentLocation?.type}: 
          <span className="text-white ml-1">
            {person.currentLocation?.outpostId || person.currentLocation?.levelId || 'Unknown'}
          </span>
        </span>
      </div>

      {/* Hostility & Willingness */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-1">
          <span className="text-xs text-gray-500">Hostility:</span>
          <span className={`text-sm font-medium ${getHostilityColor(person.interaction?.hostilityLevel)}`}>
            {person.interaction?.hostilityLevel}
          </span>
        </div>
        <div className="flex items-center space-x-1">
          <span className="text-xs text-gray-500">Help:</span>
          <span className="text-sm text-gray-300">{person.interaction?.willingnessToHelp}</span>
        </div>
      </div>

      {/* Conditions */}
      {person.status?.conditions?.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {person.status.conditions.map((condition, idx) => (
            <span key={idx} className="px-2 py-0.5 rounded text-xs bg-orange-500/20 text-orange-300 border border-orange-500/30">
              {condition}
            </span>
          ))}
        </div>
      )}

      {/* Tags */}
      {displayTags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {displayTags.map((tag, idx) => (
            <span key={idx} className="px-2 py-0.5 rounded text-xs bg-blue-500/20 text-blue-300 border border-blue-500/30">
              {getTagIcon(tag)} {tag}
            </span>
          ))}
          {person.tags?.length > 2 && (
            <span className="px-2 py-0.5 rounded text-xs bg-gray-500/20 text-gray-400">
              +{person.tags.length - 2} more
            </span>
          )}
        </div>
      )}

      {/* Story Hooks indicator */}
      {person.storyHooks?.length > 0 && (
        <div className="mt-2 flex items-center space-x-1 text-amber-400 text-xs">
          <span>📜</span>
          <span>{person.storyHooks.length} quest hook{person.storyHooks.length > 1 ? 's' : ''}</span>
        </div>
      )}
    </div>
  );
}