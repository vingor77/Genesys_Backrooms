import React from 'react';

export default function Outpost({ outpost, onClick, isHidden, userIsDM }) {
  if (!outpost) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'text-green-400 bg-green-500/20 border-green-500/50';
      case 'Abandoned': return 'text-gray-400 bg-gray-500/20 border-gray-500/50';
      case 'Ruined': return 'text-red-400 bg-red-500/20 border-red-500/50';
      case 'Under Construction': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/50';
      case 'Damaged': return 'text-orange-400 bg-orange-500/20 border-orange-500/50';
      case 'Overrun': return 'text-red-600 bg-red-600/20 border-red-600/50';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/50';
    }
  };

  const getClassificationIcon = (classification) => {
    const lower = classification?.toLowerCase() || '';
    if (lower.includes('military') || lower.includes('base')) return '🏰';
    if (lower.includes('settlement') || lower.includes('town')) return '🏘️';
    if (lower.includes('trading') || lower.includes('market')) return '🛒';
    if (lower.includes('research') || lower.includes('lab')) return '🔬';
    if (lower.includes('refugee') || lower.includes('camp')) return '⛺';
    if (lower.includes('prison') || lower.includes('detention')) return '🔒';
    if (lower.includes('industrial') || lower.includes('factory')) return '🏭';
    if (lower.includes('medical') || lower.includes('hospital')) return '🏥';
    if (lower.includes('safe') || lower.includes('haven')) return '🛡️';
    if (lower.includes('archive') || lower.includes('library')) return '📚';
    if (lower.includes('workshop') || lower.includes('forge')) return '🔨';
    return '🏛️';
  };

  const getDefenseColor = (rating) => {
    if (rating <= 3) return 'text-red-400';
    if (rating <= 6) return 'text-yellow-400';
    if (rating <= 9) return 'text-green-400';
    return 'text-cyan-400';
  };

  const totalPopulation = (outpost.population?.personnel || 0) + (outpost.population?.civilians || 0);

  return (
    <div
      onClick={onClick}
      className={`
        relative bg-gradient-to-br from-slate-800 to-slate-900 
        rounded-xl p-4 cursor-pointer transition-all duration-300
        hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/20
        border border-purple-500/30
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

      {/* Classification Icon & Name */}
      <div className="flex items-start space-x-3 mb-3">
        <div className="text-4xl">{getClassificationIcon(outpost.classification)}</div>
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-bold text-lg leading-tight truncate">{outpost.name}</h3>
          <div className="text-purple-300 text-sm">{outpost.classification}</div>
        </div>
      </div>

      {/* Status & Location */}
      <div className="flex items-center justify-between mb-3">
        <span className={`px-2 py-0.5 rounded text-xs font-bold border ${getStatusColor(outpost.status)}`}>
          {outpost.status}
        </span>
        <span className="text-gray-400 text-sm">
          📍 {outpost.location}
        </span>
      </div>

      {/* Controlling Faction */}
      <div className="bg-black/30 rounded-lg p-2 mb-3">
        <div className="text-xs text-gray-500 mb-1">Controlled By</div>
        <div className="text-white font-medium text-sm truncate">
          {outpost.controllingFaction}
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="bg-black/30 rounded-lg p-2 text-center">
          <div className="text-xs text-gray-500">Population</div>
          <div className="text-white font-bold text-sm">👥 {totalPopulation.toLocaleString()}</div>
        </div>
        <div className="bg-black/30 rounded-lg p-2 text-center">
          <div className="text-xs text-gray-500">Defense</div>
          <div className={`font-bold text-sm ${getDefenseColor(outpost.defenses?.rating)}`}>
            🛡️ {outpost.defenses?.rating || '?'}/10
          </div>
        </div>
        <div className="bg-black/30 rounded-lg p-2 text-center">
          <div className="text-xs text-gray-500">Founded</div>
          <div className="text-white font-bold text-sm">📅 {outpost.founded}</div>
        </div>
      </div>

      {/* Facilities & Rooms Count */}
      <div className="flex items-center space-x-3 mb-3">
        {outpost.facilities?.length > 0 && (
          <span className="px-2 py-1 rounded text-xs bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            🏪 {outpost.facilities.length} Facilities
          </span>
        )}
        {outpost.layout?.rooms?.length > 0 && (
          <span className="px-2 py-1 rounded text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30">
            🗺️ {outpost.layout.rooms.length} Zones
          </span>
        )}
      </div>

      {/* Resident Factions */}
      {outpost.residentFactions?.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {outpost.residentFactions.slice(0, 3).map((faction, idx) => (
            <span key={idx} className="px-2 py-0.5 rounded text-xs bg-purple-500/20 text-purple-300 border border-purple-500/30">
              {faction}
            </span>
          ))}
          {outpost.residentFactions.length > 3 && (
            <span className="px-2 py-0.5 rounded text-xs bg-gray-500/20 text-gray-400">
              +{outpost.residentFactions.length - 3} more
            </span>
          )}
        </div>
      )}

      {/* Threats indicator */}
      {outpost.threats?.length > 0 && (
        <div className="flex items-center space-x-1 text-red-400 text-xs">
          <span>⚠️</span>
          <span>{outpost.threats.length} known threat{outpost.threats.length > 1 ? 's' : ''}</span>
        </div>
      )}
    </div>
  );
}