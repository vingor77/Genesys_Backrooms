import React from 'react';

export default function PhenomenonItem({ currPhenomenon, onToggleVisibility, onToggleActive, userIsDM, isActive, onSelect }) {
  // Get phenomenon type theme
  const getTypeTheme = (type) => {
    const themes = {
      'Environmental': { 
        gradient: 'from-emerald-500 via-green-600 to-teal-700',
        lightGradient: 'from-emerald-400/20 to-green-600/20',
        icon: '🌿',
        iconBg: 'bg-emerald-500/30',
        border: 'border-emerald-500/50',
        glow: 'shadow-emerald-500/20'
      },
      'Physical': { 
        gradient: 'from-rose-500 via-red-600 to-pink-700',
        lightGradient: 'from-rose-400/20 to-red-600/20',
        icon: '💪',
        iconBg: 'bg-rose-500/30',
        border: 'border-rose-500/50',
        glow: 'shadow-rose-500/20'
      },
      'Mental': { 
        gradient: 'from-purple-500 via-violet-600 to-indigo-700',
        lightGradient: 'from-purple-400/20 to-violet-600/20',
        icon: '🧠',
        iconBg: 'bg-purple-500/30',
        border: 'border-purple-500/50',
        glow: 'shadow-purple-500/20'
      },
      'Temporal': { 
        gradient: 'from-amber-500 via-yellow-600 to-orange-700',
        lightGradient: 'from-amber-400/20 to-yellow-600/20',
        icon: '⏰',
        iconBg: 'bg-amber-500/30',
        border: 'border-amber-500/50',
        glow: 'shadow-amber-500/20'
      },
      'Social': { 
        gradient: 'from-fuchsia-500 via-pink-600 to-rose-700',
        lightGradient: 'from-fuchsia-400/20 to-pink-600/20',
        icon: '👥',
        iconBg: 'bg-fuchsia-500/30',
        border: 'border-fuchsia-500/50',
        glow: 'shadow-fuchsia-500/20'
      },
      'Cosmic': { 
        gradient: 'from-indigo-500 via-purple-600 to-violet-700',
        lightGradient: 'from-indigo-400/20 to-purple-600/20',
        icon: '🌌',
        iconBg: 'bg-indigo-500/30',
        border: 'border-indigo-500/50',
        glow: 'shadow-indigo-500/20'
      },
      'Personal': { 
        gradient: 'from-cyan-500 via-blue-600 to-indigo-700',
        lightGradient: 'from-cyan-400/20 to-blue-600/20',
        icon: '👤',
        iconBg: 'bg-cyan-500/30',
        border: 'border-cyan-500/50',
        glow: 'shadow-cyan-500/20'
      }
    };
    return themes[type] || { 
      gradient: 'from-gray-500 via-slate-600 to-gray-700',
      lightGradient: 'from-gray-400/20 to-slate-600/20',
      icon: '❓',
      iconBg: 'bg-gray-500/30',
      border: 'border-gray-500/50',
      glow: 'shadow-gray-500/20'
    };
  };

  // Get severity theme
  const getSeverityTheme = (severity) => {
    const themes = {
      'Minor': { 
        color: 'text-emerald-300',
        bg: 'bg-emerald-500/30',
        border: 'border-emerald-400/50',
        icon: '🟢'
      },
      'Moderate': { 
        color: 'text-yellow-300',
        bg: 'bg-yellow-500/30',
        border: 'border-yellow-400/50',
        icon: '🟡'
      },
      'Major': { 
        color: 'text-orange-300',
        bg: 'bg-orange-500/30',
        border: 'border-orange-400/50',
        icon: '🟠'
      },
      'Severe': { 
        color: 'text-red-300',
        bg: 'bg-red-500/30',
        border: 'border-red-400/50',
        icon: '🔴'
      },
      'Catastrophic': { 
        color: 'text-purple-300',
        bg: 'bg-purple-500/30',
        border: 'border-purple-400/50',
        icon: '💀'
      }
    };
    return themes[severity] || { 
      color: 'text-gray-300',
      bg: 'bg-gray-500/30',
      border: 'border-gray-400/50',
      icon: '⚪'
    };
  };

  const getThreatIcon = (level) => {
    const icons = {
      'Low': '🟢',
      'Medium': '🟡',
      'High': '🟠',
      'Extreme': '🔴'
    };
    return icons[level] || '⚪';
  };

  const typeTheme = getTypeTheme(currPhenomenon.phenomenon_type);
  const severityTheme = getSeverityTheme(currPhenomenon.severity);

  return (
    <div className={`group relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl overflow-hidden transition-all duration-500 hover:scale-[1.02] ${typeTheme.glow} hover:shadow-2xl border-2 ${typeTheme.border}`}>
      
      {/* Animated Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${typeTheme.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
      
      {/* Top Accent Line */}
      <div className={`h-1 bg-gradient-to-r ${typeTheme.gradient}`}></div>

      {/* Status Badges - Top Right */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        {isActive && (
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg animate-pulse flex items-center gap-1 border border-green-400">
            <span className="text-sm">⚡</span>
            <span>ACTIVE</span>
          </div>
        )}
        {userIsDM && currPhenomenon.hiddenInCurrentSession && (
          <div className="bg-gradient-to-r from-red-500 to-rose-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1 border border-red-400">
            <span className="text-sm">🚫</span>
            <span>HIDDEN</span>
          </div>
        )}
      </div>

      {/* Header Section */}
      <div className="relative p-6 pb-4">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className={`relative flex-shrink-0 w-16 h-16 ${typeTheme.iconBg} backdrop-blur-xl rounded-2xl flex items-center justify-center text-3xl border-2 ${typeTheme.border} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            <div className={`absolute inset-0 bg-gradient-to-br ${typeTheme.gradient} opacity-20 rounded-2xl`}></div>
            <span className="relative z-10">{typeTheme.icon}</span>
          </div>

          {/* Title and Type */}
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-white mb-2 leading-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 transition-all duration-300">
              {currPhenomenon.name}
            </h3>
            
            {/* Type Badge */}
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r ${typeTheme.lightGradient} backdrop-blur-sm rounded-lg border ${typeTheme.border} shadow-lg`}>
              <span className="text-white font-semibold text-sm">{currPhenomenon.phenomenon_type}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="px-6 pb-4">
        <div className="grid grid-cols-2 gap-2">
          {/* Severity */}
          <div className={`flex items-center gap-2 px-3 py-2 ${severityTheme.bg} backdrop-blur-sm rounded-lg border ${severityTheme.border}`}>
            <span className="text-lg">{severityTheme.icon}</span>
            <div className="flex flex-col">
              <span className="text-xs text-gray-400 font-medium">Severity</span>
              <span className={`text-sm font-bold ${severityTheme.color}`}>{currPhenomenon.severity}</span>
            </div>
          </div>

          {/* Threat */}
          <div className="flex items-center gap-2 px-3 py-2 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
            <span className="text-lg">{getThreatIcon(currPhenomenon.threat_level)}</span>
            <div className="flex flex-col">
              <span className="text-xs text-gray-400 font-medium">Threat</span>
              <span className="text-sm font-bold text-white">{currPhenomenon.threat_level}</span>
            </div>
          </div>

          {/* Range */}
          <div className="flex items-center gap-2 px-3 py-2 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
            <span className="text-blue-400 text-sm">📏</span>
            <div className="flex flex-col">
              <span className="text-xs text-gray-400 font-medium">Range</span>
              <span className="text-sm font-bold text-blue-300">{currPhenomenon.range}</span>
            </div>
          </div>

          {/* Duration */}
          <div className="flex items-center gap-2 px-3 py-2 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
            <span className="text-purple-400 text-sm flex-shrink-0">⏱️</span>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs text-gray-400 font-medium">Duration</span>
              <span className="text-xs font-bold text-purple-300 truncate" title={currPhenomenon.duration}>
                {currPhenomenon.duration}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="px-6">
        <div className={`h-px bg-gradient-to-r ${typeTheme.gradient} opacity-30`}></div>
      </div>

      {/* Content Section */}
      <div className="p-6 space-y-4">
        {/* Description */}
        {currPhenomenon.short_description && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${typeTheme.gradient}`}></div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wide">Description</h4>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed line-clamp-3">
              {currPhenomenon.short_description}
            </p>
          </div>
        )}

        {/* Primary Effect */}
        {currPhenomenon.mechanical_effects?.primary_effect && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
              <h4 className="text-sm font-bold text-red-300 uppercase tracking-wide">Primary Effect</h4>
            </div>
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
              <p className="text-sm text-red-200 leading-relaxed">
                {currPhenomenon.mechanical_effects.primary_effect.description}
              </p>
            </div>
          </div>
        )}

        {/* Secondary Effects Preview */}
        {currPhenomenon.mechanical_effects?.secondary_effects && currPhenomenon.mechanical_effects.secondary_effects.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
              <h4 className="text-sm font-bold text-orange-300 uppercase tracking-wide">
                Secondary Effects ({currPhenomenon.mechanical_effects.secondary_effects.length})
              </h4>
            </div>
            <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-3">
              <p className="text-xs text-orange-200 leading-relaxed line-clamp-2">
                {currPhenomenon.mechanical_effects.secondary_effects[0].description}
              </p>
              {currPhenomenon.mechanical_effects.secondary_effects.length > 1 && (
                <p className="text-xs text-orange-300/60 mt-1 italic">
                  +{currPhenomenon.mechanical_effects.secondary_effects.length - 1} more effects
                </p>
              )}
            </div>
          </div>
        )}

        {/* Tags */}
        {currPhenomenon.classification_tags && currPhenomenon.classification_tags.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${typeTheme.gradient}`}></div>
              <h4 className="text-sm font-bold text-gray-300 uppercase tracking-wide">Tags</h4>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {currPhenomenon.classification_tags.slice(0, 4).map((tag, index) => (
                <span 
                  key={index}
                  className={`px-2 py-1 text-xs font-medium rounded-md bg-gradient-to-r ${typeTheme.lightGradient} border ${typeTheme.border} text-white`}
                >
                  {tag}
                </span>
              ))}
              {currPhenomenon.classification_tags.length > 4 && (
                <span className="px-2 py-1 text-xs font-medium rounded-md bg-white/5 border border-white/20 text-gray-400">
                  +{currPhenomenon.classification_tags.length - 4}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="px-6">
        <div className={`h-px bg-gradient-to-r ${typeTheme.gradient} opacity-30`}></div>
      </div>

      {/* Actions Section */}
      <div className="p-6 space-y-2">
        {/* View Details Button */}
        {onSelect && (
          <button
            onClick={() => onSelect(currPhenomenon)}
            className={`w-full group/btn relative overflow-hidden bg-gradient-to-r ${typeTheme.gradient} hover:shadow-lg hover:shadow-${typeTheme.glow} text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 hover:scale-[1.02] border-2 border-white/20 hover:border-white/40`}
          >
            <div className="absolute inset-0 bg-white opacity-0 group-hover/btn:opacity-20 transition-opacity duration-300"></div>
            <div className="relative flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"></path>
              </svg>
              <span>View Full Details</span>
            </div>
          </button>
        )}

        {/* DM Controls */}
        {userIsDM && (
          <div className="grid grid-cols-2 gap-2">
            {/* Activate/Deactivate */}
            {onToggleActive && (
              <button
                onClick={() => onToggleActive(currPhenomenon)}
                className={`group/btn relative overflow-hidden font-bold py-2.5 px-3 rounded-xl transition-all duration-300 hover:scale-[1.02] border-2 ${
                  isActive
                    ? 'bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 border-red-400 text-white'
                    : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 border-green-400 text-white'
                }`}
              >
                <div className="absolute inset-0 bg-white opacity-0 group-hover/btn:opacity-20 transition-opacity duration-300"></div>
                <div className="relative flex items-center justify-center gap-1.5 text-sm">
                  <span className="text-lg">{isActive ? '❌' : '⚡'}</span>
                  <span className="hidden sm:inline">{isActive ? 'Stop' : 'Start'}</span>
                </div>
              </button>
            )}

            {/* Hide/Reveal */}
            <button
              onClick={() => onToggleVisibility(currPhenomenon)}
              className={`group/btn relative overflow-hidden font-bold py-2.5 px-3 rounded-xl transition-all duration-300 hover:scale-[1.02] border-2 ${
                currPhenomenon.hiddenInCurrentSession
                  ? 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 border-emerald-400 text-white'
                  : 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 border-amber-400 text-white'
              }`}
            >
              <div className="absolute inset-0 bg-white opacity-0 group-hover/btn:opacity-20 transition-opacity duration-300"></div>
              <div className="relative flex items-center justify-center gap-1.5 text-sm">
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  {currPhenomenon.hiddenInCurrentSession ? (
                    <>
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"></path>
                    </>
                  ) : (
                    <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd"></path>
                  )}
                </svg>
                <span className="hidden sm:inline">{currPhenomenon.hiddenInCurrentSession ? 'Show' : 'Hide'}</span>
              </div>
            </button>
          </div>
        )}
      </div>

      {/* Bottom Accent */}
      <div className={`h-1 bg-gradient-to-r ${typeTheme.gradient} opacity-50`}></div>
    </div>
  );
}