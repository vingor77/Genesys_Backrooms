import React, { useState, useEffect } from 'react';
import { getActiveSession } from '../Structural/Session_Utils';

export default function RelationModal({ relation, onClose, userIsDM, onToggleVisibility, onUpdateSessionNotes }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [sessionNoteText, setSessionNoteText] = useState('');
  const [isSavingNote, setIsSavingNote] = useState(false);
  const sessionId = getActiveSession();

  useEffect(() => {
    if (relation?.dmNotes?.sessionNotes?.[sessionId]) {
      setSessionNoteText(relation.dmNotes.sessionNotes[sessionId]);
    } else {
      setSessionNoteText('');
    }
  }, [relation, sessionId]);

  if (!relation) return null;

  const handleToggleVisibility = async () => {
    if (onToggleVisibility) {
      await onToggleVisibility(relation.id, relation.isHidden);
    }
  };

  const handleSaveSessionNote = async () => {
    if (!onUpdateSessionNotes) return;
    setIsSavingNote(true);
    try {
      await onUpdateSessionNotes(relation.id, sessionId, sessionNoteText);
    } catch (error) {
      console.error('Error saving session note:', error);
    }
    setIsSavingNote(false);
  };

  const formatName = (str) => {
    if (!str) return '';
    return str.split(/[-_]/).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Friendly': return 'text-green-400';
      case 'Neutral': return 'text-gray-400';
      case 'Tense': return 'text-yellow-400';
      case 'Hostile': return 'text-orange-400';
      case 'War': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusGradient = (status) => {
    switch (status) {
      case 'Friendly': return 'from-green-900/50 to-emerald-900/50';
      case 'Neutral': return 'from-gray-900/50 to-slate-900/50';
      case 'Tense': return 'from-yellow-900/50 to-amber-900/50';
      case 'Hostile': return 'from-orange-900/50 to-red-900/50';
      case 'War': return 'from-red-900/50 to-red-950/50';
      default: return 'from-gray-900/50 to-slate-900/50';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Friendly': return '🤝';
      case 'Neutral': return '⚖️';
      case 'Tense': return '😤';
      case 'Hostile': return '⚔️';
      case 'War': return '💥';
      default: return '❓';
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'Friendly': return 'bg-green-500/20 text-green-300 border-green-500/50';
      case 'Neutral': return 'bg-gray-500/20 text-gray-300 border-gray-500/50';
      case 'Tense': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50';
      case 'Hostile': return 'bg-orange-500/20 text-orange-300 border-orange-500/50';
      case 'War': return 'bg-red-500/20 text-red-300 border-red-500/50';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/50';
    }
  };

  const playerTabs = [
    { id: 'overview', label: 'Overview', icon: '📋' },
    { id: 'perspectives', label: 'Perspectives', icon: '👁️' },
    { id: 'history', label: 'History', icon: '📜' },
    { id: 'encounters', label: 'Encounters', icon: '🎭' },
  ];

  const dmTabs = [
    { id: 'quests', label: 'Quest Hooks', icon: '🎯' },
    { id: 'dm-notes', label: 'DM Notes', icon: '🎲' },
  ];

  const allTabs = userIsDM ? [...playerTabs, ...dmTabs] : playerTabs;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden border border-white/10">
        
        {/* Header */}
        <div className={`bg-gradient-to-r ${getStatusGradient(relation.status)} p-6 border-b border-white/10`}>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              {/* Factions Display */}
              <div className="flex items-center space-x-4 mb-2">
                <div className="bg-black/30 rounded-lg px-4 py-2">
                  <div className="text-white font-bold text-xl">{formatName(relation.factionA)}</div>
                </div>
                <div className="text-4xl">{getStatusIcon(relation.status)}</div>
                <div className="bg-black/30 rounded-lg px-4 py-2">
                  <div className="text-white font-bold text-xl">{formatName(relation.factionB)}</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 mt-2">
                <span className={`px-3 py-1 rounded-lg font-bold border ${getStatusBadgeColor(relation.status)}`}>
                  {relation.status}
                </span>
                <span className="text-gray-400 text-sm">ID: {relation.id}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {userIsDM && (
                <button
                  onClick={handleToggleVisibility}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all
                    ${relation.isHidden 
                      ? 'bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/50' 
                      : 'bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/50'
                    }`}
                >
                  {relation.isHidden ? <span>👁️ Show</span> : <span>🚫 Hide</span>}
                </button>
              )}
              <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10 bg-black/20 overflow-x-auto">
          {allTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-3 font-medium transition-all whitespace-nowrap text-sm
                ${activeTab === tab.id
                  ? `${getStatusColor(relation.status)} border-b-2 border-current bg-white/5`
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
            >
              <span className="mr-1">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-220px)]">
          
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Timeline */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-900/20 rounded-lg p-4 border border-blue-500/30 text-center">
                  <div className="text-xs text-blue-300 mb-1">First Contact</div>
                  <div className="text-white text-2xl font-bold">{relation.firstContact}</div>
                </div>
                <div className="bg-purple-900/20 rounded-lg p-4 border border-purple-500/30 text-center">
                  <div className="text-xs text-purple-300 mb-1">Status Established</div>
                  <div className="text-white text-2xl font-bold">{relation.established}</div>
                </div>
                <div className="bg-amber-900/20 rounded-lg p-4 border border-amber-500/30 text-center">
                  <div className="text-xs text-amber-300 mb-1">Last Updated</div>
                  <div className="text-white text-2xl font-bold">{relation.lastUpdated}</div>
                </div>
              </div>

              {/* Root Cause */}
              {relation.sharedHistory?.rootCause && (
                <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-lg p-4 border border-white/10">
                  <div className="text-sm text-gray-400 font-semibold mb-2">ROOT CAUSE</div>
                  <p className="text-gray-300 leading-relaxed">{relation.sharedHistory.rootCause}</p>
                </div>
              )}

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/30 rounded-lg p-4 border border-white/10">
                  <div className="text-sm text-gray-400 mb-2">Historical Events</div>
                  <div className="text-white text-3xl font-bold">{relation.sharedHistory?.majorEvents?.length || 0}</div>
                </div>
                <div className="bg-black/30 rounded-lg p-4 border border-white/10">
                  <div className="text-sm text-gray-400 mb-2">Quest Hooks</div>
                  <div className="text-white text-3xl font-bold">{relation.questHooks?.length || 0}</div>
                </div>
              </div>

              {/* Tags */}
              {relation.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {relation.tags.map((tag, idx) => (
                    <span key={idx} className="px-3 py-1 rounded-lg text-sm bg-gray-500/20 text-gray-300 border border-gray-500/30">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* PERSPECTIVES TAB */}
          {activeTab === 'perspectives' && (
            <div className="space-y-6">
              {/* Faction A Perspective */}
              <div className="bg-blue-900/20 rounded-lg p-4 border border-blue-500/30">
                <div className="text-lg text-blue-300 font-bold mb-4">
                  🏛️ {formatName(relation.factionA)}'s Perspective
                </div>
                
                {relation.perspectives?.factionA?.viewpoint && (
                  <div className="bg-black/30 rounded p-3 mb-4">
                    <div className="text-xs text-gray-500 mb-1">Viewpoint</div>
                    <p className="text-gray-300 italic">"{relation.perspectives.factionA.viewpoint}"</p>
                  </div>
                )}

                {relation.perspectives?.factionA?.significantEvents?.length > 0 && (
                  <div className="mb-4">
                    <div className="text-sm text-blue-300 mb-2">Significant Events (Their View)</div>
                    <div className="space-y-2">
                      {relation.perspectives.factionA.significantEvents.map((evt, idx) => (
                        <div key={idx} className="bg-black/30 rounded p-3">
                          <div className="text-white font-medium">{evt.event}</div>
                          <p className="text-gray-400 text-sm mt-1">{evt.reason}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {relation.perspectives?.factionA?.currentSentiment && (
                  <div className="bg-blue-900/30 rounded p-3 border border-blue-500/20">
                    <div className="text-xs text-blue-300 mb-1">Current Sentiment</div>
                    <p className="text-gray-300">{relation.perspectives.factionA.currentSentiment}</p>
                  </div>
                )}
              </div>

              {/* Faction B Perspective */}
              <div className="bg-purple-900/20 rounded-lg p-4 border border-purple-500/30">
                <div className="text-lg text-purple-300 font-bold mb-4">
                  🏛️ {formatName(relation.factionB)}'s Perspective
                </div>
                
                {relation.perspectives?.factionB?.viewpoint && (
                  <div className="bg-black/30 rounded p-3 mb-4">
                    <div className="text-xs text-gray-500 mb-1">Viewpoint</div>
                    <p className="text-gray-300 italic">"{relation.perspectives.factionB.viewpoint}"</p>
                  </div>
                )}

                {relation.perspectives?.factionB?.significantEvents?.length > 0 && (
                  <div className="mb-4">
                    <div className="text-sm text-purple-300 mb-2">Significant Events (Their View)</div>
                    <div className="space-y-2">
                      {relation.perspectives.factionB.significantEvents.map((evt, idx) => (
                        <div key={idx} className="bg-black/30 rounded p-3">
                          <div className="text-white font-medium">{evt.event}</div>
                          <p className="text-gray-400 text-sm mt-1">{evt.reason}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {relation.perspectives?.factionB?.currentSentiment && (
                  <div className="bg-purple-900/30 rounded p-3 border border-purple-500/20">
                    <div className="text-xs text-purple-300 mb-1">Current Sentiment</div>
                    <p className="text-gray-300">{relation.perspectives.factionB.currentSentiment}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* HISTORY TAB */}
          {activeTab === 'history' && (
            <div className="space-y-6">
              <div className="text-xl font-bold text-blue-400 mb-3">📜 Shared History (Objective)</div>
              
              {/* Root Cause */}
              {relation.sharedHistory?.rootCause && (
                <div className="bg-amber-900/20 rounded-lg p-4 border border-amber-500/30">
                  <div className="text-sm text-amber-300 font-semibold mb-2">ROOT CAUSE</div>
                  <p className="text-gray-300">{relation.sharedHistory.rootCause}</p>
                </div>
              )}

              {/* Timeline */}
              {relation.sharedHistory?.majorEvents?.length > 0 && (
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-700"></div>
                  <div className="space-y-4">
                    {relation.sharedHistory.majorEvents.map((evt, idx) => (
                      <div key={idx} className="relative pl-10">
                        <div className="absolute left-2 w-4 h-4 rounded-full bg-blue-500 border-2 border-gray-800"></div>
                        <div className="bg-black/30 rounded-lg p-4 border border-white/10">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-white font-bold">{evt.event}</span>
                            <span className="text-blue-400 text-sm">
                              {evt.year}{evt.month ? ` - ${evt.month}` : ''}
                            </span>
                          </div>
                          <p className="text-gray-300 text-sm mb-2">{evt.description}</p>
                          {evt.outcome && (
                            <div className="text-sm">
                              <span className="text-gray-500">Outcome: </span>
                              <span className="text-gray-400">{evt.outcome}</span>
                            </div>
                          )}
                          {evt.impact && (
                            <div className="text-sm">
                              <span className="text-gray-500">Impact: </span>
                              <span className="text-amber-400">{evt.impact}</span>
                            </div>
                          )}
                          {evt.casualties && userIsDM && (
                            <div className="text-sm text-red-400 mt-1">
                              Casualties: {evt.casualties}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ENCOUNTERS TAB */}
          {activeTab === 'encounters' && (
            <div className="space-y-6">
              <div className="text-xl font-bold text-purple-400 mb-3">🎭 Encounter Behavior</div>
              
              {relation.encounterBehavior && (
                <>
                  {/* Civilized Public Spaces */}
                  <div className="bg-green-900/20 rounded-lg p-4 border border-green-500/30">
                    <div className="text-sm text-green-300 font-semibold mb-2">🏛️ CIVILIZED PUBLIC SPACES</div>
                    <p className="text-xs text-gray-500 mb-2">Markets, hubs, trading posts with neutral presence</p>
                    <p className="text-gray-300">{relation.encounterBehavior.civilizedPublicSpaces}</p>
                  </div>

                  {/* Faction Territories */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-900/20 rounded-lg p-4 border border-blue-500/30">
                      <div className="text-sm text-blue-300 font-semibold mb-2">
                        🏠 {formatName(relation.factionA)} Territory
                      </div>
                      <p className="text-gray-300 text-sm">{relation.encounterBehavior.factionATerritory}</p>
                    </div>
                    <div className="bg-purple-900/20 rounded-lg p-4 border border-purple-500/30">
                      <div className="text-sm text-purple-300 font-semibold mb-2">
                        🏠 {formatName(relation.factionB)} Territory
                      </div>
                      <p className="text-gray-300 text-sm">{relation.encounterBehavior.factionBTerritory}</p>
                    </div>
                  </div>

                  {/* Wilderness */}
                  <div className="bg-amber-900/20 rounded-lg p-4 border border-amber-500/30">
                    <div className="text-sm text-amber-300 font-semibold mb-2">🌲 WILDERNESS</div>
                    <p className="text-xs text-gray-500 mb-2">Random meeting in unexplored/dangerous territory</p>
                    <p className="text-gray-300">{relation.encounterBehavior.wilderness}</p>
                  </div>

                  {/* Player With Ally Coins */}
                  <div className="bg-cyan-900/20 rounded-lg p-4 border border-cyan-500/30">
                    <div className="text-sm text-cyan-300 font-semibold mb-2">💰 PLAYER WITH ALLY COINS</div>
                    <p className="text-xs text-gray-500 mb-2">Player carrying currency from the other faction</p>
                    <p className="text-gray-300">{relation.encounterBehavior.playerWithAllyCoins}</p>
                  </div>
                </>
              )}
            </div>
          )}

          {/* QUEST HOOKS TAB (DM) */}
          {activeTab === 'quests' && userIsDM && (
            <div className="space-y-6">
              <div className="text-xl font-bold text-amber-400 mb-3">🎯 Quest Hooks ({relation.questHooks?.length || 0})</div>
              
              {relation.questHooks?.length > 0 ? (
                <div className="space-y-3">
                  {relation.questHooks.map((hook, idx) => (
                    <div key={idx} className="bg-amber-900/20 rounded-lg p-4 border border-amber-500/30 flex items-start space-x-3">
                      <span className="text-amber-400 text-xl">•</span>
                      <p className="text-gray-300">{hook}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500 text-center py-8">No quest hooks defined</div>
              )}
            </div>
          )}

          {/* DM NOTES TAB */}
          {activeTab === 'dm-notes' && userIsDM && (
            <div className="space-y-6">
              <div className="bg-purple-900/20 border border-purple-500/50 rounded-lg p-4">
                <div className="text-purple-400 font-bold mb-1">🎲 DM ONLY</div>
                <p className="text-gray-300 text-sm">This tab is only visible to Game Masters.</p>
              </div>

              {/* How to Run */}
              {relation.dmNotes?.howToRun && (
                <div className="bg-black/30 rounded-lg p-4 border border-white/10">
                  <div className="text-sm text-gray-400 font-semibold mb-2">HOW TO RUN</div>
                  <p className="text-gray-300 leading-relaxed whitespace-pre-line">{relation.dmNotes.howToRun}</p>
                </div>
              )}

              {/* Common Scenarios */}
              {relation.dmNotes?.commonScenarios?.length > 0 && (
                <div className="bg-blue-900/20 rounded-lg p-4 border border-blue-500/30">
                  <div className="text-sm text-blue-300 font-semibold mb-3">📋 COMMON SCENARIOS</div>
                  <div className="space-y-2">
                    {relation.dmNotes.commonScenarios.map((scenario, idx) => (
                      <div key={idx} className="bg-black/30 rounded p-3 flex items-start space-x-2">
                        <span className="text-blue-400">•</span>
                        <p className="text-gray-300 text-sm">{scenario}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Balance Tips */}
              {relation.dmNotes?.balanceTips && (
                <div className="bg-amber-900/20 rounded-lg p-4 border border-amber-500/30">
                  <div className="text-sm text-amber-300 font-semibold mb-2">⚖️ BALANCE TIPS</div>
                  <p className="text-gray-300 leading-relaxed whitespace-pre-line">{relation.dmNotes.balanceTips}</p>
                </div>
              )}

              {/* Session Notes */}
              <div className="bg-purple-900/20 rounded-lg p-4 border border-purple-500/30">
                <div className="text-sm text-purple-400 font-semibold mb-2">📝 SESSION NOTES</div>
                <p className="text-xs text-gray-500 mb-3">Notes for session: {sessionId}</p>
                <textarea
                  value={sessionNoteText}
                  onChange={(e) => setSessionNoteText(e.target.value)}
                  placeholder="Add notes about this relationship for the current session..."
                  className="w-full bg-black/30 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                  rows={4}
                />
                <button
                  onClick={handleSaveSessionNote}
                  disabled={isSavingNote}
                  className="mt-3 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all"
                >
                  {isSavingNote ? 'Saving...' : 'Save Note'}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}