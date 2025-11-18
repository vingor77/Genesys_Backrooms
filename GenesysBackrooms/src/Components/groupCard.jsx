import React from 'react';

const GroupCard = ({ group, onShowDetails, onToggleVisibility, userIsDM }) => {
  const getRelationshipColor = (relationship) => {
    switch(relationship) {
      case 'Allied': return 'bg-green-500/30 text-green-300 border-green-500/50';
      case 'Friendly': return 'bg-blue-500/30 text-blue-300 border-blue-500/50';
      case 'Neutral': return 'bg-gray-500/30 text-gray-300 border-gray-500/50';
      case 'Hostile': return 'bg-red-500/30 text-red-300 border-red-500/50';
      case 'Unknown': return 'bg-purple-500/30 text-purple-300 border-purple-500/50';
      default: return 'bg-gray-500/30 text-gray-300 border-gray-500/50';
    }
  };

  const getMetricColor = (value) => {
    if (value <= 3) return 'text-green-400';
    if (value <= 6) return 'text-yellow-400';
    if (value <= 8) return 'text-orange-400';
    return 'text-red-400';
  };

  return (
    <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-4 border border-amber-500/20 hover:border-amber-500/40 transition-all duration-300 h-full flex flex-col">
      {/* Visibility Toggle (DM only) */}
      {userIsDM && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleVisibility(group);
          }}
          className={`absolute top-2 right-2 p-1.5 rounded-lg transition-all z-10 ${
            group.hiddenInCurrentSession
              ? 'bg-red-500/20 text-red-400 border border-red-500/50'
              : 'bg-green-500/20 text-green-400 border border-green-500/50'
          }`}
          title={group.hiddenInCurrentSession ? 'Hidden from players' : 'Visible to players'}
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            {group.hiddenInCurrentSession ? (
              <path d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"></path>
            ) : (
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
            )}
            {!group.hiddenInCurrentSession && (
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"></path>
            )}
          </svg>
        </button>
      )}

      {/* Header */}
      <div className="mb-3">
        <div className="flex items-start gap-2 mb-1">
          <h3 className="text-lg font-bold text-white flex-1 leading-tight">
            {group.groupName}
          </h3>
        </div>
        {group.abbreviation && (
          <div className="text-amber-400 text-sm font-medium">
            {group.abbreviation}
          </div>
        )}
        {group.motto && (
          <div className="text-gray-400 text-xs italic mt-1">
            "{group.motto}"
          </div>
        )}
      </div>

      {/* Description */}
      {group.overview?.description && (
        <p className="text-gray-300 text-sm mb-3 line-clamp-3 flex-1">
          {group.overview.description}
        </p>
      )}

      {/* Metrics Grid */}
      {group.metrics && (
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="bg-black/30 rounded-lg p-2">
            <div className="text-xs text-gray-400">Influence</div>
            <div className={`text-sm font-bold ${getMetricColor(group.metrics.influence)}`}>
              {group.metrics.influence}/10
            </div>
          </div>
          <div className="bg-black/30 rounded-lg p-2">
            <div className="text-xs text-gray-400">Hostility</div>
            <div className={`text-sm font-bold ${getMetricColor(group.metrics.hostility)}`}>
              {group.metrics.hostility}/10
            </div>
          </div>
          <div className="bg-black/30 rounded-lg p-2">
            <div className="text-xs text-gray-400">Organization</div>
            <div className={`text-sm font-bold ${getMetricColor(group.metrics.organization)}`}>
              {group.metrics.organization}/10
            </div>
          </div>
        </div>
      )}

      {/* Population */}
      {group.overview && (group.overview.estimatedMembers !== undefined || group.overview.estimatedCivilians !== undefined) && (
        <div className="grid grid-cols-2 gap-2 mb-3">
          {group.overview.estimatedMembers !== undefined && (
            <div className="bg-black/30 rounded-lg p-2">
              <div className="text-xs text-gray-400">Members</div>
              <div className="text-sm font-bold text-white truncate">
                {group.overview.estimatedMembers.toLocaleString()}
              </div>
            </div>
          )}
          {group.overview.estimatedCivilians !== undefined && (
            <div className="bg-black/30 rounded-lg p-2">
              <div className="text-xs text-gray-400">Civilians</div>
              <div className="text-sm font-bold text-white truncate">
                {group.overview.estimatedCivilians.toLocaleString()}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Founded Year */}
      {group.overview?.foundingYear && (
        <div className="mb-3 text-xs">
          <div className="flex items-start gap-1">
            <span className="text-gray-400">📅</span>
            <span className="text-gray-300">Founded {group.overview.foundingYear}</span>
          </div>
        </div>
      )}

      {/* Status Badges */}
      <div className="flex flex-wrap gap-2 mb-3">
        {group.primaryType && (
          <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs font-medium border border-blue-500/30">
            {group.primaryType}
          </span>
        )}
        {userIsDM && group.currentSessionRelationship && (
          <span className={`px-2 py-1 rounded text-xs font-medium border ${getRelationshipColor(group.currentSessionRelationship)}`}>
            {group.currentSessionRelationship}
          </span>
        )}
      </div>

      {/* View Details Button */}
      <button
        onClick={() => onShowDetails(group)}
        className="w-full bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg mt-auto"
      >
        View Details
      </button>
    </div>
  );
};

export default GroupCard;