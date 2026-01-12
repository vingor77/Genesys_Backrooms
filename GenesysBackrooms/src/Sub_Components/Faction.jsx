import React from 'react';

export default function Faction({ faction, onClick, isHidden, userIsDM }) {
  const getInfluenceColor = (value) => {
    if (value <= 3) return 'text-gray-400';
    if (value <= 5) return 'text-blue-400';
    if (value <= 7) return 'text-purple-400';
    return 'text-amber-400';
  };

  const getHostilityColor = (value) => {
    if (value <= 3) return 'text-green-400';
    if (value <= 5) return 'text-yellow-400';
    if (value <= 7) return 'text-orange-400';
    return 'text-red-400';
  };

  const getOrganizationColor = (value) => {
    if (value <= 3) return 'text-red-400';
    if (value <= 5) return 'text-yellow-400';
    if (value <= 7) return 'text-blue-400';
    return 'text-cyan-400';
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Governmental': return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'Military': return 'bg-red-500/10 text-red-400 border-red-500/30';
      case 'Trading/Commerce': return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'Religious': return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'Criminal/Outlaw': return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
      case 'Scientific/Research': return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
      case 'Exploratory': return 'bg-green-500/10 text-green-400 border-green-500/30';
      case 'Survival/Refuge': return 'bg-teal-500/10 text-teal-400 border-teal-500/30';
      case 'Mercenary': return 'bg-orange-500/10 text-orange-400 border-orange-500/30';
      case 'Cult': return 'bg-pink-500/10 text-pink-400 border-pink-500/30';
      case 'Corporate': return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
      case 'Academic': return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';
      case 'Medical/Humanitarian': return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      case 'Isolationist': return 'bg-stone-500/10 text-stone-400 border-stone-500/30';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
    }
  };

  const formatNumber = (num) => {
    if (!num) return '0';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
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
        hover:border-amber-500/50
        hover:shadow-xl hover:shadow-amber-500/10
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
        <div className="flex items-start gap-2 mb-1">
          <h3 className="text-xl font-bold text-white leading-tight flex-1 pr-16">
            {faction.groupName || 'Unknown Faction'}
          </h3>
        </div>
        {faction.abbreviation && (
          <span className="text-sm font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
            {faction.abbreviation}
          </span>
        )}
        
        {/* Motto */}
        {faction.motto && (
          <p className="text-gray-400 text-sm italic mt-2">"{faction.motto}"</p>
        )}
      </div>

      {/* Type Badges */}
      {faction.primaryType && faction.primaryType.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {faction.primaryType.slice(0, 3).map((type, index) => (
            <span key={index} className={`text-xs font-medium px-2 py-0.5 rounded border ${getTypeColor(type)}`}>
              {type}
            </span>
          ))}
          {faction.primaryType.length > 3 && (
            <span className="text-xs text-gray-500">+{faction.primaryType.length - 3}</span>
          )}
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {/* Influence */}
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-1 text-sm">
            <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className={`font-bold ${getInfluenceColor(faction.metrics?.influence)}`}>
              {faction.metrics?.influence || 0}
            </span>
          </div>
          <span className="text-xs text-gray-500">Influence</span>
        </div>

        {/* Hostility */}
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-1 text-sm">
            <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className={`font-bold ${getHostilityColor(faction.metrics?.hostility)}`}>
              {faction.metrics?.hostility || 0}
            </span>
          </div>
          <span className="text-xs text-gray-500">Hostility</span>
        </div>

        {/* Organization */}
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-1 text-sm">
            <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span className={`font-bold ${getOrganizationColor(faction.metrics?.organization)}`}>
              {faction.metrics?.organization || 0}
            </span>
          </div>
          <span className="text-xs text-gray-500">Organization</span>
        </div>
      </div>

      {/* Member Count */}
      <div className="flex items-center justify-between mb-3 text-sm">
        <div className="flex items-center gap-1.5">
          <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span className="text-purple-400">{formatNumber(faction.overview?.estimatedMembers)} members</span>
        </div>
        {faction.overview?.foundingYear && (
          <span className="text-gray-500 text-xs">Est. {faction.overview.foundingYear}</span>
        )}
      </div>

      {/* Currency Badge */}
      {faction.currency?.hasCurrency && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg px-3 py-2 mb-3">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-amber-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-amber-300 text-xs font-medium">{faction.currency.coinName}</span>
          </div>
        </div>
      )}

      {/* Known For Preview */}
      {faction.knownFor && (
        <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed">
          {faction.knownFor}
        </p>
      )}
    </div>
  );
}