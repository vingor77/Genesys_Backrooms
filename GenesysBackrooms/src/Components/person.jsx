import React, { useState } from 'react';

export default function Person({ currPerson, onShowDetails, onUpdateStatus, onToggleVisibility, userIsDM }) {
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  const getThreatColor = (level) => {
    if (level <= 2) return 'from-green-600 to-emerald-700 text-green-300 border-green-500/50';
    if (level <= 4) return 'from-blue-600 to-cyan-700 text-blue-300 border-blue-500/50';
    if (level <= 6) return 'from-yellow-600 to-amber-700 text-yellow-300 border-yellow-500/50';
    if (level <= 8) return 'from-orange-600 to-red-700 text-orange-300 border-orange-500/50';
    return 'from-red-600 to-rose-700 text-red-300 border-red-500/50';
  };

  const getThreatLabel = (level) => {
    if (level <= 2) return 'Minor';
    if (level <= 4) return 'Moderate';
    if (level <= 6) return 'Dangerous';
    if (level <= 8) return 'Deadly';
    return 'Legendary';
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Alive':
        return 'bg-green-500/90 text-white border-green-400';
      case 'Dead':
        return 'bg-red-500/90 text-white border-red-400';
      case 'Missing':
        return 'bg-yellow-500/90 text-white border-yellow-400';
      case 'Unknown':
        return 'bg-gray-500/90 text-white border-gray-400';
      default:
        return 'bg-gray-500/90 text-white border-gray-400';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Alive':
        return '✓';
      case 'Dead':
        return '💀';
      case 'Missing':
        return '❓';
      case 'Unknown':
        return '?';
      default:
        return '?';
    }
  };

  return (
    <div className="bg-black/20 backdrop-blur-lg border border-white/10 rounded-2xl overflow-hidden transition-all duration-300 hover:bg-black/30 hover:scale-105 hover:shadow-2xl group h-full flex flex-col">
      {/* Header with Image */}
      <div className="relative">
        {currPerson.image_url ? (
          <div className="h-48 bg-gradient-to-b from-pink-900/50 to-transparent">
            <img 
              src={currPerson.image_url} 
              alt={currPerson.name}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="h-48 bg-gradient-to-br from-pink-600/30 to-rose-600/30 flex items-center justify-center">
            <svg className="w-24 h-24 text-white/20" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
            </svg>
          </div>
        )}
        
        {/* Status Indicators Overlay */}
        <div className="absolute top-2 right-2 flex flex-col space-y-2">
          {userIsDM && (
            <div className="relative">
              <button
                onClick={() => setShowStatusMenu(!showStatusMenu)}
                className={`${getStatusColor(currPerson.currentSessionStatus)} text-xs font-bold px-2 py-1 rounded-full border shadow-lg flex items-center space-x-1`}
              >
                <span>{getStatusIcon(currPerson.currentSessionStatus)}</span>
                <span>{currPerson.currentSessionStatus}</span>
              </button>
              
              {showStatusMenu && (
                <div className="absolute top-full right-0 mt-2 bg-slate-800 border border-white/20 rounded-lg shadow-xl z-10 min-w-[120px]">
                  {['Alive', 'Dead', 'Missing', 'Unknown'].map(status => (
                    <button
                      key={status}
                      onClick={() => {
                        onUpdateStatus(currPerson, status);
                        setShowStatusMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-white hover:bg-white/10 transition-colors first:rounded-t-lg last:rounded-b-lg"
                    >
                      {getStatusIcon(status)} {status}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {userIsDM && currPerson.hiddenInCurrentSession && (
            <div className="bg-red-500/90 text-white text-xs font-bold px-2 py-1 rounded-full border border-red-400">
              🚫 HIDDEN
            </div>
          )}
        </div>

        {/* Name Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <h3 className="text-xl font-bold text-white mb-1 group-hover:text-pink-300 transition-colors">
            {currPerson.name}
          </h3>
          <div className="text-sm text-pink-300 flex items-center space-x-2">
            <span>{currPerson.age}</span>
            <span>•</span>
            <span>{currPerson.gender}</span>
          </div>
        </div>
      </div>

      {/* Stats Chips */}
      <div className="p-4 space-y-3">
        <div className="flex flex-wrap gap-2 justify-center">
          <div className={`bg-gradient-to-r ${getThreatColor(currPerson.threat_level)} px-3 py-1 rounded-full text-xs font-bold border`}>
            ⚔️ {getThreatLabel(currPerson.threat_level)} ({currPerson.threat_level})
          </div>
        </div>

        {/* Aliases */}
        {currPerson.aliases && currPerson.aliases.length > 0 && (
          <div className="bg-white/5 rounded-lg p-2">
            <div className="text-xs text-gray-400 mb-1">Also known as:</div>
            <div className="flex flex-wrap gap-1">
              {currPerson.aliases.map((alias, idx) => (
                <span key={idx} className="text-xs text-pink-300 bg-pink-500/20 px-2 py-0.5 rounded">
                  {alias}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Description Preview */}
      <div className="flex-1 p-4 pt-0">
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 h-full overflow-y-auto">
          <div className="text-xs font-medium text-pink-400 mb-2">Personality:</div>
          <p className="text-gray-300 text-sm leading-relaxed line-clamp-4">
            {currPerson.personality}
          </p>
          
          {userIsDM && currPerson.desire && (
            <div className="mt-3 pt-3 border-t border-white/10">
              <div className="text-xs font-medium text-yellow-400 mb-1">Desire:</div>
              <p className="text-gray-300 text-xs leading-relaxed line-clamp-2">
                {currPerson.desire}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="border-t border-white/10 p-4 space-y-2">
        <div className="flex flex-col gap-2">
          <button
            onClick={() => onShowDetails(currPerson)}
            className="flex items-center justify-center space-x-2 bg-gradient-to-r from-pink-600/20 to-rose-600/20 hover:from-pink-600/30 hover:to-rose-600/30 text-pink-300 font-medium px-4 py-2 rounded-lg border border-pink-500/30 transition-all duration-300 hover:scale-105"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"></path>
            </svg>
            <span>View Full Details</span>
          </button>
          
          {userIsDM && (
            <button
              onClick={() => onToggleVisibility(currPerson)}
              className={`flex items-center justify-center space-x-2 font-medium px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105 ${
                currPerson.hiddenInCurrentSession
                  ? 'bg-gradient-to-r from-emerald-600/20 to-green-600/20 hover:from-emerald-600/30 hover:to-green-600/30 text-emerald-300 border border-emerald-500/30'
                  : 'bg-gradient-to-r from-red-600/20 to-pink-600/20 hover:from-red-600/30 hover:to-pink-600/30 text-red-300 border border-red-500/30'
              }`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                {currPerson.hiddenInCurrentSession ? (
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                ) : (
                  <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd"></path>
                )}
                {currPerson.hiddenInCurrentSession && <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"></path>}
              </svg>
              <span>{currPerson.hiddenInCurrentSession ? '👁️ Reveal' : '🚫 Hide'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Tags */}
      {currPerson.tags && currPerson.tags.length > 0 && (
        <div className="px-4 pb-4">
          <div className="flex flex-wrap gap-1">
            {currPerson.tags.slice(0, 4).map((tag, idx) => (
              <span key={idx} className="bg-pink-500/20 text-pink-300 px-2 py-0.5 rounded text-xs border border-pink-500/30">
                {tag}
              </span>
            ))}
            {currPerson.tags.length > 4 && (
              <span className="bg-gray-500/20 text-gray-300 px-2 py-0.5 rounded text-xs border border-gray-500/30">
                +{currPerson.tags.length - 4}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}