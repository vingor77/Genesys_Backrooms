import React from 'react';

const MissionAlerts = ({ alerts }) => {
  return (
    <div className="h-full flex flex-col max-h-[600px]"> {/* Added max-height constraint */}
      <div className="flex-1 min-h-0 overflow-auto">
        {alerts.length > 0 ? (
          <div className="h-full overflow-y-auto pr-2 space-y-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
            {alerts.slice(0, 50).map((alert) => (
              <div key={alert.id} className={`p-3 rounded-lg border-l-4 shadow-sm hover:shadow-md transition-all duration-200 backdrop-blur-sm flex-shrink-0 ${
                alert.type === 'weather' ? 'bg-blue-500/20 border-blue-400' :
                alert.type === 'weather-effect' ? 'bg-yellow-500/20 border-yellow-400' :
                alert.type === 'weather-change' ? 'bg-green-500/20 border-green-400' :
                alert.type === 'weather-forecast' ? 'bg-teal-500/20 border-teal-400' :
                alert.type === 'weather-emergency' ? 'bg-red-600/30 border-red-500' :
                alert.type === 'weather-mechanics' ? 'bg-indigo-500/20 border-indigo-400' :
                alert.type === 'entity-spawn' ? 'bg-red-500/20 border-red-400' :
                alert.type === 'entity-defeat' ? 'bg-purple-500/20 border-purple-400' :
                alert.type === 'entity-encounter' ? 'bg-red-600/30 border-red-500' :
                alert.type === 'entity-collision' ? 'bg-orange-600/30 border-orange-500' :
                alert.type === 'power-limit' ? 'bg-orange-500/20 border-orange-400' :
                alert.type === 'power-status' ? 'bg-cyan-500/20 border-cyan-400' :
                alert.type === 'spawn-failed' ? 'bg-red-700/40 border-red-600' :
                alert.type === 'spawn-error' ? 'bg-red-600/30 border-red-500' :
                alert.type === 'scrap' ? 'bg-yellow-500/20 border-yellow-400' :
                alert.type === 'entity' ? 'bg-red-500/20 border-red-400' :
                alert.type === 'trap' ? 'bg-orange-500/20 border-orange-400' :
                alert.type === 'trap-encounter' ? 'bg-orange-600/30 border-orange-500' :
                alert.type === 'quota' ? 'bg-green-500/20 border-green-400' :
                alert.type === 'game' ? 'bg-blue-500/20 border-blue-400' :
                alert.type === 'player-move' ? 'bg-cyan-500/20 border-cyan-400' :
                alert.type === 'environmental-hazard' ? 'bg-yellow-600/30 border-yellow-500' :
                alert.type === 'error' ? 'bg-red-600/30 border-red-500' :
                'bg-purple-500/20 border-purple-400'
              }`}>
                <div className="flex justify-between items-start">
                  <div className="flex-1 pr-3">
                    <p className="text-sm text-white leading-relaxed">{alert.message}</p>
                    
                    {/* Priority indicator for critical alerts */}
                    {(alert.type === 'entity-encounter' || 
                      alert.type === 'entity-collision' || 
                      alert.type === 'weather-emergency' || 
                      alert.type === 'trap-encounter' ||
                      alert.type === 'environmental-hazard') && (
                      <div className="mt-1">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-500/30 text-red-200 border border-red-400/50">
                          ⚠️ URGENT
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="text-xs text-white/70 text-right flex-shrink-0">
                    <div className="font-medium">R{alert.round}</div>
                    <div>{alert.time}</div>
                    {alert.timestamp && (
                      <div className="text-white/50 mt-1">
                        {new Date(alert.timestamp).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit',
                          second: '2-digit'
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {/* Load more indicator if there are more alerts */}
            {alerts.length > 50 && (
              <div className="text-center py-2 flex-shrink-0">
                <span className="text-white/50 text-xs">
                  Showing latest 50 of {alerts.length} alerts
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center text-white/70">
              <div className="text-4xl lg:text-6xl mb-4">📭</div>
              <p className="text-sm lg:text-base font-medium">No alerts yet</p>
              <p className="text-xs lg:text-sm text-white/50 mt-2">Mission events will appear here</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Quick Stats Footer */}
      {alerts.length > 0 && (
        <div className="flex-shrink-0 mt-4 pt-4 border-t border-white/20">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
            <div className="bg-red-500/20 rounded-lg p-2 text-center border border-red-400/30">
              <div className="text-red-300 font-bold">
                {alerts.filter(a => a.type.includes('entity')).length}
              </div>
              <div className="text-red-200 text-xs">Entity</div>
            </div>
            
            <div className="bg-yellow-500/20 rounded-lg p-2 text-center border border-yellow-400/30">
              <div className="text-yellow-300 font-bold">
                {alerts.filter(a => a.type.includes('weather')).length}
              </div>
              <div className="text-yellow-200 text-xs">Weather</div>
            </div>
            
            <div className="bg-cyan-500/20 rounded-lg p-2 text-center border border-cyan-400/30">
              <div className="text-cyan-300 font-bold">
                {alerts.filter(a => a.type.includes('player')).length}
              </div>
              <div className="text-cyan-200 text-xs">Player</div>
            </div>
            
            <div className="bg-orange-500/20 rounded-lg p-2 text-center border border-orange-400/30">
              <div className="text-orange-300 font-bold">
                {alerts.filter(a => a.type.includes('trap') || a.type.includes('hazard')).length}
              </div>
              <div className="text-orange-200 text-xs">Hazards</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MissionAlerts;