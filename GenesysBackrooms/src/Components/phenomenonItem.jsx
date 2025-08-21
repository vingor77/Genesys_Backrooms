import React from 'react';

export default function PhenomenonItem(props) {
  const descriptionSegments = props.currPhenomenon.description ? props.currPhenomenon.description.split('/') : [];
  const effectSegments = props.currPhenomenon.effect ? props.currPhenomenon.effect.split('/') : [];

  // Get phenomenon type theme
  const getTypeTheme = (type) => {
    const themes = {
      'Magical': { 
        gradient: 'from-purple-600 to-indigo-700', 
        icon: '✨', 
        accent: 'purple',
        bgClass: 'bg-purple-500/20'
      },
      'Psychological': { 
        gradient: 'from-pink-600 to-purple-700', 
        icon: '🧠', 
        accent: 'pink',
        bgClass: 'bg-pink-500/20'
      },
      'Physical': { 
        gradient: 'from-blue-600 to-cyan-700', 
        icon: '⚗️', 
        accent: 'blue',
        bgClass: 'bg-blue-500/20'
      },
      'Environmental': { 
        gradient: 'from-green-600 to-emerald-700', 
        icon: '🌿', 
        accent: 'green',
        bgClass: 'bg-green-500/20'
      },
      'Temporal': { 
        gradient: 'from-yellow-600 to-orange-700', 
        icon: '⏰', 
        accent: 'yellow',
        bgClass: 'bg-yellow-500/20'
      },
      'Spatial': { 
        gradient: 'from-red-600 to-pink-700', 
        icon: '🌀', 
        accent: 'red',
        bgClass: 'bg-red-500/20'
      },
      'Mental': { 
        gradient: 'from-teal-600 to-cyan-700', 
        icon: '🤔', 
        accent: 'teal',
        bgClass: 'bg-teal-500/20'
      }
    };
    return themes[type] || { 
      gradient: 'from-gray-600 to-gray-700', 
      icon: '🔬', 
      accent: 'gray',
      bgClass: 'bg-gray-500/20'
    };
  };

  // Get size color
  const getSizeTheme = (size) => {
    const themes = {
      'Small': { color: 'text-green-300', bg: 'bg-green-500/20', border: 'border-green-500/30' },
      'Medium': { color: 'text-yellow-300', bg: 'bg-yellow-500/20', border: 'border-yellow-500/30' },
      'Large': { color: 'text-orange-300', bg: 'bg-orange-500/20', border: 'border-orange-500/30' },
      'Massive': { color: 'text-red-300', bg: 'bg-red-500/20', border: 'border-red-500/30' }
    };
    return themes[size] || { color: 'text-gray-300', bg: 'bg-gray-500/20', border: 'border-gray-500/30' };
  };

  const typeTheme = getTypeTheme(props.currPhenomenon.type);
  const sizeTheme = getSizeTheme(props.currPhenomenon.size);

  return (
    <div className={`w-full h-96 rounded-xl shadow-lg border transition-all duration-300 hover:scale-105 hover:shadow-xl relative bg-gradient-to-br ${typeTheme.gradient} border-white/20 flex flex-col`}>
      
      {/* Header */}
      <div className="p-4 text-white relative flex-shrink-0">
        {/* Notes indicator */}
        {props.currPhenomenon.notes && (
          <div className="absolute top-3 right-3">
            <div className="w-6 h-6 bg-blue-500/30 rounded-full flex items-center justify-center border border-blue-400/50" title={props.currPhenomenon.notes}>
              <span className="text-blue-300 text-xs">ℹ</span>
            </div>
          </div>
        )}

        {/* Phenomenon Icon & Title */}
        <div className="flex items-start space-x-3 mb-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl backdrop-blur-sm flex-shrink-0">
            {typeTheme.icon}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg leading-tight mb-1">{props.currPhenomenon.name}</h3>
            <div className="flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center px-2 py-1 ${typeTheme.bgClass} rounded-full text-xs font-medium border border-white/20`}>
                {props.currPhenomenon.type}
              </span>
              {props.currPhenomenon.size && (
                <span className={`inline-flex items-center px-2 py-1 ${sizeTheme.bg} ${sizeTheme.color} rounded-full text-xs font-medium ${sizeTheme.border} border`}>
                  {props.currPhenomenon.size}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content Container with proper flex structure */}
      <div className="flex-1 flex flex-col bg-black/20 backdrop-blur-sm min-h-0">
        <div className="px-4 flex-shrink-0">
          {/* Quick Info */}
          <div className="space-y-2 mb-3">
            {/* Location */}
            {props.currPhenomenon.location && (
              <div className="flex items-center text-gray-300 text-sm">
                <span className="text-blue-400 mr-2">📍</span>
                <span className="truncate">Location: {props.currPhenomenon.location}</span>
              </div>
            )}
            
            {/* Severity */}
            {props.currPhenomenon.severity && (
              <div className="flex items-center text-gray-300 text-sm">
                <span className="text-red-400 mr-2">⚠️</span>
                <span className="truncate">Severity: {props.currPhenomenon.severity}</span>
              </div>
            )}
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/20 px-4 pb-4 min-h-0">
          
          {/* Description */}
          {descriptionSegments.length > 0 && (
            <div className="mb-4">
              <h4 className="text-white font-semibold mb-2 flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                Description
              </h4>
              <div className="space-y-2">
                {descriptionSegments.map((segment, index) => {
                  const parts = segment.split(':');
                  const hasLabel = parts.length > 1 && parts[0] && parts[1];
                  
                  return (
                    <div key={index} className="bg-white/5 rounded p-2 border border-white/10">
                      <p className="text-gray-200 text-sm leading-relaxed">
                        {hasLabel ? (
                          <>
                            <span className="font-bold text-white block mb-1">
                              {parts[0]}:
                            </span>
                            {parts[1]}
                          </>
                        ) : (
                          segment
                        )}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Effects */}
          {effectSegments.length > 0 && (
            <div className="mb-4">
              <h4 className="text-white font-semibold mb-2 flex items-center">
                <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                Effects
              </h4>
              <div className="space-y-2">
                {effectSegments.map((segment, index) => {
                  const parts = segment.split(':');
                  const hasLabel = parts.length > 1 && parts[0] && parts[1];
                  
                  return (
                    <div key={index} className="bg-white/5 rounded p-2 border border-white/10">
                      <p className="text-gray-200 text-sm leading-relaxed">
                        {hasLabel ? (
                          <>
                            <span className="font-bold text-white block mb-1">
                              {parts[0]}:
                            </span>
                            {parts[1]}
                          </>
                        ) : (
                          segment
                        )}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Notes (if expanded view) */}
          {props.currPhenomenon.notes && (
            <div>
              <h4 className="text-white font-semibold mb-2 flex items-center">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                Notes
              </h4>
              <div className="bg-white/5 rounded p-2 border border-white/10">
                <p className="text-gray-200 text-sm leading-relaxed">
                  {props.currPhenomenon.notes}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Fixed Decorative accent bar - always visible */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/30 rounded-b-xl" />
    </div>
  );
}