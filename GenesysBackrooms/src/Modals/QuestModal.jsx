import React, { useState, useEffect } from 'react';
import { getActiveSession } from '../Structural/Session_Utils';

export default function QuestModal({ 
  quest, 
  onClose, 
  userIsDM, 
  onToggleVisibility, 
  onUpdateSessionNotes,
  onToggleObjective,
  onToggleCompleted,
  onSetActiveVariant
}) {
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedItems, setExpandedItems] = useState({});
  const [sessionNoteText, setSessionNoteText] = useState('');
  const [isSavingNote, setIsSavingNote] = useState(false);
  const sessionId = getActiveSession();

  useEffect(() => {
    const sessionNotes = quest?.sessionTracking?.[sessionId]?.sessionNotes || [];
    const latestNote = sessionNotes[sessionNotes.length - 1];
    if (latestNote) {
      setSessionNoteText(latestNote.note);
    } else {
      setSessionNoteText('');
    }
  }, [quest, sessionId]);

  if (!quest) return null;

  // Get session-specific tracking data
  const getSessionTracking = () => {
    return quest.sessionTracking?.[sessionId] || {
      completedObjectives: [],
      completed: false,
      activeVariants: [],
      sessionNotes: []
    };
  };

  const sessionTrackingData = getSessionTracking();

  const isObjectiveCompleted = (objId) => {
    return sessionTrackingData.completedObjectives?.includes(objId);
  };

  const isQuestCompleted = () => {
    return sessionTrackingData.completed === true;
  };

  const getActiveVariants = () => {
    // Support both old single variant and new array format
    const tracking = sessionTrackingData;
    if (Array.isArray(tracking.activeVariants)) {
      return tracking.activeVariants;
    }
    // Legacy support for single activeVariant
    if (tracking.activeVariant) {
      return [tracking.activeVariant];
    }
    return [];
  };

  const isVariantActive = (variantId) => {
    return getActiveVariants().includes(variantId);
  };

  const toggleExpanded = (key) => {
    setExpandedItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleToggleVisibility = async () => {
    if (onToggleVisibility) {
      await onToggleVisibility(quest.id, quest.isHidden);
    }
  };

  const handleSaveSessionNote = async () => {
    if (!onUpdateSessionNotes) return;
    setIsSavingNote(true);
    try {
      await onUpdateSessionNotes(quest.id, sessionId, sessionNoteText);
    } catch (error) {
      console.error('Error saving session note:', error);
    }
    setIsSavingNote(false);
  };

  const handleToggleObjective = async (objectiveId) => {
    if (!onToggleObjective || !userIsDM) return;
    const currentlyCompleted = isObjectiveCompleted(objectiveId);
    await onToggleObjective(quest.id, sessionId, objectiveId, !currentlyCompleted);
  };

  const handleToggleCompleted = async () => {
    if (!onToggleCompleted || !userIsDM) return;
    await onToggleCompleted(quest.id, sessionId, !isQuestCompleted());
  };

  const handleSetActiveVariant = async (variantId) => {
    if (!onSetActiveVariant || !userIsDM) return;
    const currentActive = getActiveVariants();
    let newVariants;
    
    if (currentActive.includes(variantId)) {
      // Remove if already active
      newVariants = currentActive.filter(id => id !== variantId);
    } else {
      // Add to active variants
      newVariants = [...currentActive, variantId];
    }
    
    await onSetActiveVariant(quest.id, sessionId, newVariants);
  };

  const formatName = (str) => {
    if (!str) return '';
    return str.split(/[-_]/).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'main': return 'text-amber-400';
      case 'side': return 'text-blue-400';
      case 'faction': return 'text-purple-400';
      case 'personal': return 'text-pink-400';
      case 'world': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const getTypeGradient = (type) => {
    switch (type) {
      case 'main': return 'from-amber-900/50 to-orange-900/50';
      case 'side': return 'from-blue-900/50 to-indigo-900/50';
      case 'faction': return 'from-purple-900/50 to-violet-900/50';
      case 'personal': return 'from-pink-900/50 to-rose-900/50';
      case 'world': return 'from-green-900/50 to-emerald-900/50';
      default: return 'from-gray-900/50 to-slate-900/50';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'main': return '⭐';
      case 'side': return '📋';
      case 'faction': return '🏛️';
      case 'personal': return '👤';
      case 'world': return '🌍';
      default: return '📜';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400 bg-green-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'hard': return 'text-orange-400 bg-orange-500/20';
      case 'deadly': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getObjectiveTypeIcon = (type) => {
    switch (type) {
      case 'task': return '✓';
      case 'delivery': return '📦';
      case 'investigation': return '🔍';
      case 'combat': return '⚔️';
      case 'social': return '💬';
      default: return '•';
    }
  };

  const playerTabs = [
    { id: 'overview', label: 'Overview', icon: '📋' },
    { id: 'objectives', label: 'Objectives', icon: '✓' },
    { id: 'rewards', label: 'Rewards', icon: '🎁' },
  ];

  const dmTabs = [
    { id: 'variants', label: 'Variants', icon: '🔀' },
    { id: 'prerequisites', label: 'Prerequisites', icon: '🔒' },
    { id: 'failure', label: 'Failure', icon: '❌' },
    { id: 'tracking', label: 'Tracking', icon: '📊' },
    { id: 'dm-notes', label: 'DM Notes', icon: '🎲' },
  ];

  const allTabs = userIsDM ? [...playerTabs, ...dmTabs] : playerTabs;

  // Calculate progress
  const completedCount = sessionTrackingData.completedObjectives?.length || 0;
  const totalObjectives = quest.objectives?.length || 0;
  const progressPercent = totalObjectives > 0 ? Math.round((completedCount / totalObjectives) * 100) : 0;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden border border-white/10">
        
        {/* Header */}
        <div className={`bg-gradient-to-r ${getTypeGradient(quest.type)} p-6 border-b border-white/10`}>
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <div className="text-5xl">{getTypeIcon(quest.type)}</div>
              <div>
                <div className="flex items-center space-x-3">
                  <h2 className="text-3xl font-bold text-white">{quest.name}</h2>
                  {isQuestCompleted() && (
                    <span className="px-3 py-1 rounded-lg text-sm font-bold bg-green-500/30 text-green-300 border border-green-500/50">
                      ✓ COMPLETED
                    </span>
                  )}
                </div>
                <div className="text-xs text-gray-400 mb-1">ID: {quest.id}</div>
                <div className="flex items-center space-x-3 mt-1">
                  <span className={`font-semibold capitalize ${getTypeColor(quest.type)}`}>{quest.type} Quest</span>
                  {quest.difficulty && (
                    <>
                      <span className="text-gray-400">•</span>
                      <span className={`px-2 py-0.5 rounded text-sm font-medium capitalize ${getDifficultyColor(quest.difficulty)}`}>
                        {quest.difficulty}
                      </span>
                    </>
                  )}
                  {quest.questLine && (
                    <>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-300">{quest.questLine.name} #{quest.questLine.position}</span>
                    </>
                  )}
                </div>
                {/* Progress Bar */}
                {totalObjectives > 0 && (
                  <div className="mt-3 flex items-center space-x-3">
                    <div className="flex-1 max-w-48 bg-black/30 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all ${isQuestCompleted() ? 'bg-green-500' : 'bg-amber-500'}`}
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                    <span className="text-gray-400 text-sm">{completedCount}/{totalObjectives} objectives</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {/* Quest Completion Toggle (DM) */}
              {userIsDM && (
                <button
                  onClick={handleToggleCompleted}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all
                    ${isQuestCompleted()
                      ? 'bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/50' 
                      : 'bg-gray-500/20 hover:bg-gray-500/30 text-gray-400 border border-gray-500/50'
                    }`}
                >
                  {isQuestCompleted() ? <span>✓ Completed</span> : <span>○ Mark Complete</span>}
                </button>
              )}
              {userIsDM && (
                <button
                  onClick={handleToggleVisibility}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all
                    ${quest.isHidden 
                      ? 'bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 border border-yellow-500/50' 
                      : 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/50'
                    }`}
                >
                  {quest.isHidden ? <span>👁️ Show</span> : <span>🚫 Hide</span>}
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
                  ? 'text-amber-400 border-b-2 border-amber-400 bg-amber-500/10'
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
              {/* Active Variants Banner */}
              {getActiveVariants().length > 0 && (
                <div className="bg-purple-900/30 rounded-lg p-4 border border-purple-500/50">
                  <div className="text-sm text-purple-300 font-semibold mb-2">🔀 ACTIVE VARIANTS ({getActiveVariants().length})</div>
                  <div className="flex flex-wrap gap-2">
                    {getActiveVariants().map(variantId => {
                      const variant = quest.variants?.find(v => v.id === variantId);
                      return (
                        <div key={variantId} className="flex items-center space-x-2 bg-purple-500/20 rounded-lg px-3 py-1.5 border border-purple-500/30">
                          <span className="text-white font-medium">{variant?.name || variantId}</span>
                          {userIsDM && (
                            <button
                              onClick={() => handleSetActiveVariant(variantId)}
                              className="text-red-400 hover:text-red-300 transition-colors"
                              title="Remove variant"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-lg p-4 border border-white/10">
                <div className="text-sm text-gray-400 font-semibold mb-2">DESCRIPTION</div>
                <p className="text-gray-300 leading-relaxed">{quest.description}</p>
              </div>

              {/* Context */}
              {quest.context && (
                <div className="bg-blue-900/20 rounded-lg p-4 border border-blue-500/30">
                  <div className="text-sm text-blue-300 font-semibold mb-2">📖 CONTEXT</div>
                  <p className="text-gray-300 leading-relaxed">{quest.context}</p>
                </div>
              )}

              {/* Quest Giver */}
              {quest.questGiver && (
                <div className="bg-green-900/20 rounded-lg p-4 border border-green-500/30">
                  <div className="text-sm text-green-300 font-semibold mb-3">👤 QUEST GIVER</div>
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <div className="text-xs text-gray-500">Type</div>
                      <div className="text-white capitalize">{quest.questGiver.type}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">ID</div>
                      <div className="text-white">{formatName(quest.questGiver.id) || 'None'}</div>
                    </div>
                  </div>
                  {quest.questGiver.dialogue && (
                    <div className="bg-black/30 rounded p-3 mb-3">
                      <div className="text-xs text-gray-500 mb-1">Dialogue</div>
                      <p className="text-gray-300 italic">"{quest.questGiver.dialogue}"</p>
                    </div>
                  )}
                  {quest.questGiver.conditions?.length > 0 && (
                    <div className="mb-3">
                      <div className="text-xs text-gray-500 mb-1">Conditions</div>
                      <ul className="space-y-1">
                        {quest.questGiver.conditions.map((cond, idx) => (
                          <li key={idx} className="text-gray-300 text-sm flex items-center space-x-2">
                            <span className="text-green-400">•</span><span>{cond}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {userIsDM && quest.questGiver.voiceActingTips && (
                    <div className="bg-purple-900/20 rounded p-2 border border-purple-500/30">
                      <div className="text-xs text-purple-300">Voice Acting Tips (DM)</div>
                      <p className="text-gray-300 text-sm">{quest.questGiver.voiceActingTips}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Quest Receiver */}
              {quest.questReceiver && (
                <div className="bg-amber-900/20 rounded-lg p-4 border border-amber-500/30">
                  <div className="text-sm text-amber-300 font-semibold mb-3">🎯 QUEST RECEIVER (Turn-in)</div>
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <div className="text-xs text-gray-500">Type</div>
                      <div className="text-white capitalize">{quest.questReceiver.type}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">ID</div>
                      <div className="text-white">{formatName(quest.questReceiver.id)}</div>
                    </div>
                  </div>
                  {quest.questReceiver.dialogue && (
                    <div className="bg-black/30 rounded p-3">
                      <div className="text-xs text-gray-500 mb-1">Turn-in Dialogue</div>
                      <p className="text-gray-300 italic">"{quest.questReceiver.dialogue}"</p>
                    </div>
                  )}
                  {quest.questReceiver.alternateReceivers?.length > 0 && userIsDM && (
                    <div className="mt-3">
                      <div className="text-xs text-gray-500 mb-2">Alternate Receivers (DM)</div>
                      {quest.questReceiver.alternateReceivers.map((alt, idx) => (
                        <div key={idx} className="bg-black/30 rounded p-2 mb-2">
                          <div className="flex items-center justify-between">
                            <span className="text-white">{formatName(alt.id)}</span>
                            <span className="text-gray-400 text-xs capitalize">{alt.type}</span>
                          </div>
                          {alt.dialogue && <p className="text-gray-300 text-sm italic mt-1">"{alt.dialogue}"</p>}
                          {alt.note && <p className="text-gray-400 text-xs mt-1">{alt.note}</p>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Quest Line */}
              {quest.questLine && (
                <div className="bg-purple-900/20 rounded-lg p-4 border border-purple-500/30">
                  <div className="text-sm text-purple-300 font-semibold mb-3">📚 QUEST LINE</div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-3">
                    <div>
                      <div className="text-xs text-gray-500">Name</div>
                      <div className="text-white">{quest.questLine.name}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Quest Line ID</div>
                      <div className="text-white font-mono text-sm">{quest.questLine.id}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Type</div>
                      <div className="text-white capitalize">{quest.questLine.type}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <div className="text-xs text-gray-500">Position</div>
                      <div className="text-white">#{quest.questLine.position}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Previous Quest</div>
                      <div className="text-white">{formatName(quest.questLine.previousQuestId) || 'None'}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Next Quest</div>
                      <div className="text-white">{formatName(quest.questLine.nextQuestId) || 'None'}</div>
                    </div>
                  </div>
                  {quest.questLine.branchingNote && userIsDM && (
                    <div className="mt-3 bg-black/30 rounded p-2">
                      <div className="text-xs text-gray-500">Branching Note (DM)</div>
                      <p className="text-gray-300 text-sm">{quest.questLine.branchingNote}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Themes & Tags */}
              <div className="flex flex-wrap gap-2">
                {quest.themes?.map((theme, idx) => (
                  <span key={idx} className="px-3 py-1 rounded-lg text-sm bg-pink-500/20 text-pink-300 border border-pink-500/30">
                    {theme}
                  </span>
                ))}
                {quest.tags?.map((tag, idx) => (
                  <span key={idx} className="px-3 py-1 rounded-lg text-sm bg-gray-500/20 text-gray-300 border border-gray-500/30">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* OBJECTIVES TAB */}
          {activeTab === 'objectives' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-3">
                <div className="text-xl font-bold text-blue-400">✓ Objectives ({quest.objectives?.length || 0})</div>
                <div className="text-gray-400 text-sm">
                  {completedCount}/{totalObjectives} completed ({progressPercent}%)
                </div>
              </div>
              
              {quest.objectives?.map((obj, idx) => {
                const completed = isObjectiveCompleted(obj.id);
                return (
                  <div 
                    key={obj.id} 
                    className={`rounded-lg p-4 border transition-all ${completed 
                      ? 'bg-green-900/20 border-green-500/30' 
                      : 'bg-black/30 border-white/10'}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-start space-x-3">
                        {/* Clickable checkbox for DM */}
                        {userIsDM ? (
                          <button
                            onClick={() => handleToggleObjective(obj.id)}
                            className={`text-2xl transition-all hover:scale-110 ${completed ? 'text-green-400' : 'text-gray-500 hover:text-gray-300'}`}
                          >
                            {completed ? '✓' : '○'}
                          </button>
                        ) : (
                          <span className={`text-2xl ${completed ? 'text-green-400' : 'text-gray-400'}`}>
                            {completed ? '✓' : getObjectiveTypeIcon(obj.type)}
                          </span>
                        )}
                        <div>
                          <div className={`font-medium ${completed ? 'text-green-300 line-through' : 'text-white'}`}>
                            {obj.description}
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-gray-400 text-sm capitalize">{obj.type}</span>
                            <span className="text-gray-600">•</span>
                            <span className="text-gray-500 text-xs font-mono">{obj.id}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {obj.order > 0 && (
                          <span className="px-2 py-0.5 rounded text-xs bg-blue-500/20 text-blue-300">
                            Step {obj.order}
                          </span>
                        )}
                        {obj.order === 0 && (
                          <span className="px-2 py-0.5 rounded text-xs bg-gray-500/20 text-gray-400">
                            Any Order
                          </span>
                        )}
                      </div>
                    </div>

                    {obj.details && (
                      <div className="bg-black/30 rounded p-3 mt-3 ml-9">
                        <p className="text-gray-300 text-sm">{obj.details}</p>
                      </div>
                    )}

                    {/* References - All Types */}
                    {obj.references && Object.keys(obj.references).some(k => obj.references[k]?.length > 0) && (
                      <div className="mt-3 ml-9 flex flex-wrap gap-2">
                        {obj.references.entityIds?.map((id, i) => (
                          <span key={`e-${i}`} className="px-2 py-0.5 rounded text-xs bg-red-500/20 text-red-300">👹 {formatName(id)}</span>
                        ))}
                        {obj.references.objectIds?.map((id, i) => (
                          <span key={`o-${i}`} className="px-2 py-0.5 rounded text-xs bg-amber-500/20 text-amber-300">📦 {formatName(id)}</span>
                        ))}
                        {obj.references.levelIds?.map((id, i) => (
                          <span key={`l-${i}`} className="px-2 py-0.5 rounded text-xs bg-blue-500/20 text-blue-300">🗺️ {formatName(id)}</span>
                        ))}
                        {obj.references.poiIds?.map((id, i) => (
                          <span key={`p-${i}`} className="px-2 py-0.5 rounded text-xs bg-green-500/20 text-green-300">👤 {formatName(id)}</span>
                        ))}
                        {obj.references.factionIds?.map((id, i) => (
                          <span key={`f-${i}`} className="px-2 py-0.5 rounded text-xs bg-purple-500/20 text-purple-300">🏛️ {formatName(id)}</span>
                        ))}
                        {obj.references.outpostIds?.map((id, i) => (
                          <span key={`out-${i}`} className="px-2 py-0.5 rounded text-xs bg-cyan-500/20 text-cyan-300">🏠 {formatName(id)}</span>
                        ))}
                        {obj.references.phenomenonIds?.map((id, i) => (
                          <span key={`ph-${i}`} className="px-2 py-0.5 rounded text-xs bg-pink-500/20 text-pink-300">✨ {formatName(id)}</span>
                        ))}
                        {obj.references.customReferences?.map((ref, i) => (
                          <span key={`c-${i}`} className="px-2 py-0.5 rounded text-xs bg-gray-500/20 text-gray-300">📌 {ref}</span>
                        ))}
                      </div>
                    )}

                    {/* DM Info */}
                    {userIsDM && (
                      <div className="mt-3 ml-9 space-y-2">
                        {obj.dmNotes && (
                          <div className="bg-purple-900/20 rounded p-2 border border-purple-500/30">
                            <div className="text-xs text-purple-300">DM Notes</div>
                            <p className="text-gray-300 text-sm">{obj.dmNotes}</p>
                          </div>
                        )}
                        {obj.commonIssues && (
                          <div className="bg-orange-900/20 rounded p-2 border border-orange-500/30">
                            <div className="text-xs text-orange-300">Common Issues</div>
                            <p className="text-gray-300 text-sm">{obj.commonIssues}</p>
                          </div>
                        )}
                        {obj.hints?.length > 0 && (
                          <div className="bg-yellow-900/20 rounded p-2 border border-yellow-500/30">
                            <div className="text-xs text-yellow-300">Hints for Stuck Players</div>
                            <ul className="text-gray-300 text-sm">
                              {obj.hints.map((hint, i) => (
                                <li key={i}>• {hint}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* REWARDS TAB */}
          {activeTab === 'rewards' && (
            <div className="space-y-6">
              <div className="text-xl font-bold text-amber-400 mb-3">🎁 Rewards</div>

              {/* Items */}
              {quest.rewards?.items?.length > 0 && (
                <div className="bg-amber-900/20 rounded-lg p-4 border border-amber-500/30">
                  <div className="text-sm text-amber-300 font-semibold mb-3">📦 ITEMS</div>
                  <div className="space-y-2">
                    {quest.rewards.items.map((item, idx) => (
                      <div key={idx} className="bg-black/30 rounded p-3 flex items-center justify-between">
                        <span className="text-white">{formatName(item.itemId)}</span>
                        <div className="flex items-center space-x-3">
                          <span className="text-amber-400 font-bold">x{item.count}</span>
                          {item.note && userIsDM && (
                            <span className="text-gray-400 text-sm">({item.note})</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Faction Reputation */}
              {quest.rewards?.factionReputation?.length > 0 && (
                <div className="bg-purple-900/20 rounded-lg p-4 border border-purple-500/30">
                  <div className="text-sm text-purple-300 font-semibold mb-3">🏛️ FACTION REPUTATION</div>
                  <div className="space-y-2">
                    {quest.rewards.factionReputation.map((rep, idx) => (
                      <div key={idx} className="bg-black/30 rounded p-3">
                        <div className="flex items-center justify-between">
                          <span className="text-white">{formatName(rep.factionId)}</span>
                          <span className={`font-bold ${rep.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {rep.change >= 0 ? '+' : ''}{rep.change}
                          </span>
                        </div>
                        {rep.reason && (
                          <p className="text-gray-400 text-sm mt-1">{rep.reason}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recipe Unlocks */}
              {quest.rewards?.recipeUnlocks?.length > 0 && (
                <div className="bg-cyan-900/20 rounded-lg p-4 border border-cyan-500/30">
                  <div className="text-sm text-cyan-300 font-semibold mb-3">🔨 RECIPE UNLOCKS</div>
                  <div className="space-y-2">
                    {quest.rewards.recipeUnlocks.map((recipe, idx) => (
                      <div key={idx} className="bg-black/30 rounded p-3">
                        <div className="text-white font-medium">{formatName(recipe.recipeId)}</div>
                        <p className="text-gray-400 text-sm">{recipe.howLearned}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Information */}
              {quest.rewards?.information?.length > 0 && (
                <div className="bg-blue-900/20 rounded-lg p-4 border border-blue-500/30">
                  <div className="text-sm text-blue-300 font-semibold mb-3">📖 INFORMATION</div>
                  <div className="space-y-2">
                    {quest.rewards.information.map((info, idx) => (
                      <div key={idx} className="bg-black/30 rounded p-3">
                        <div className="text-white font-medium">{info.title}</div>
                        <p className="text-gray-400 text-sm mt-1">{info.content}</p>
                        {info.ruleUnlockId && (
                          <div className="mt-2 text-xs text-blue-400">
                            Unlocks Rule: {formatName(info.ruleUnlockId)}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quest Unlocks */}
              {quest.rewards?.questUnlocks?.length > 0 && (
                <div className="bg-green-900/20 rounded-lg p-4 border border-green-500/30">
                  <div className="text-sm text-green-300 font-semibold mb-3">🔓 UNLOCKS QUESTS</div>
                  <div className="flex flex-wrap gap-2">
                    {quest.rewards.questUnlocks.map((qId, idx) => (
                      <span key={idx} className="px-3 py-1 rounded-lg text-sm bg-green-500/20 text-green-300 border border-green-500/30">
                        {formatName(qId)}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* DM Notes for Rewards */}
              {userIsDM && quest.rewards?.dmNotes && (
                <div className="bg-purple-900/20 rounded-lg p-4 border border-purple-500/30">
                  <div className="text-sm text-purple-300 font-semibold mb-2">📝 REWARD NOTES (DM)</div>
                  <p className="text-gray-300">{quest.rewards.dmNotes}</p>
                </div>
              )}

              {/* Locks Out Quests */}
              {quest.locksOutQuests?.length > 0 && userIsDM && (
                <div className="bg-red-900/20 rounded-lg p-4 border border-red-500/30">
                  <div className="text-sm text-red-300 font-semibold mb-3">🔒 LOCKS OUT QUESTS (DM)</div>
                  <div className="space-y-2">
                    {quest.locksOutQuests.map((lock, idx) => (
                      <div key={idx} className="bg-black/30 rounded p-3">
                        <div className="flex items-center justify-between">
                          <span className="text-white">{formatName(lock.questId)}</span>
                          <span className={`px-2 py-0.5 rounded text-xs ${lock.affectsAllPlayers ? 'bg-red-500/20 text-red-300' : 'bg-yellow-500/20 text-yellow-300'}`}>
                            {lock.affectsAllPlayers ? 'All Players' : 'Per Player'}
                          </span>
                        </div>
                        <p className="text-gray-400 text-sm mt-1">{lock.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* VARIANTS TAB (DM) */}
          {activeTab === 'variants' && userIsDM && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-3">
                <div className="text-xl font-bold text-purple-400">🔀 Variants ({quest.variants?.length || 0})</div>
                {getActiveVariants().length > 0 && (
                  <span className="px-3 py-1 rounded-lg text-sm bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    {getActiveVariants().length} Active
                  </span>
                )}
              </div>
              
              {quest.variants?.length > 0 ? (
                quest.variants.map((variant, idx) => {
                  const isActive = isVariantActive(variant.id);
                  return (
                    <div key={idx} className={`rounded-lg p-4 border transition-all ${isActive ? 'bg-purple-900/30 border-purple-500/50' : 'bg-black/30 border-purple-500/30'}`}>
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="text-white font-bold text-lg">{variant.name}</h4>
                          <div className="text-gray-500 text-xs font-mono">{variant.id}</div>
                        </div>
                        <button
                          onClick={() => handleSetActiveVariant(variant.id)}
                          className={`px-4 py-2 rounded-lg font-medium transition-all ${isActive
                            ? 'bg-purple-500/30 text-purple-300 border border-purple-500/50'
                            : 'bg-gray-500/20 text-gray-400 border border-gray-500/30 hover:bg-purple-500/20 hover:text-purple-300 hover:border-purple-500/30'
                          }`}
                        >
                          {isActive ? '✓ Active' : 'Set Active'}
                        </button>
                      </div>
                      
                      <div className="bg-purple-900/20 rounded p-3 mb-3">
                        <div className="text-xs text-purple-300">Trigger Condition</div>
                        <p className="text-gray-300">{variant.triggerCondition}</p>
                      </div>

                      <p className="text-gray-400 mb-3">{variant.description}</p>

                      {variant.objectiveChanges?.length > 0 && (
                        <div className="mb-3">
                          <div className="text-xs text-gray-500 mb-2">Objective Changes</div>
                          {variant.objectiveChanges.map((change, i) => (
                            <div key={i} className="bg-black/30 rounded p-2 mb-1">
                              <div className="text-yellow-400 text-xs font-mono mb-1">{change.objectiveId}</div>
                              <div className="text-gray-300 text-sm">{change.newDescription}</div>
                              {change.newDetails && (
                                <div className="text-gray-500 text-xs mt-1">{change.newDetails}</div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {variant.rewardChanges && (
                        <div className="mb-3">
                          <div className="text-xs text-gray-500 mb-2">Reward Changes</div>
                          <div className="bg-black/30 rounded p-2 space-y-2">
                            {variant.rewardChanges.items?.length > 0 && (
                              <div>
                                <div className="text-xs text-amber-300">Items</div>
                                <div className="flex flex-wrap gap-1">
                                  {variant.rewardChanges.items.map((item, i) => (
                                    <span key={i} className="px-2 py-0.5 rounded text-xs bg-amber-500/20 text-amber-300">
                                      {formatName(item.itemId)} x{item.count}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                            {variant.rewardChanges.factionReputation?.length > 0 && (
                              <div>
                                <div className="text-xs text-purple-300">Faction Reputation</div>
                                <div className="flex flex-wrap gap-1">
                                  {variant.rewardChanges.factionReputation.map((rep, i) => (
                                    <span key={i} className={`px-2 py-0.5 rounded text-xs ${rep.change >= 0 ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                                      {formatName(rep.factionId)}: {rep.change >= 0 ? '+' : ''}{rep.change}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                            {variant.rewardChanges.consequences && (
                              <div>
                                <div className="text-xs text-gray-400">Consequences</div>
                                <p className="text-gray-300 text-sm">{variant.rewardChanges.consequences}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {variant.nextQuestOverride && (
                        <div className="mb-3 flex items-center space-x-2">
                          <span className="text-gray-500 text-sm">Next Quest Override:</span>
                          <span className="px-2 py-0.5 rounded text-xs bg-green-500/20 text-green-300">{formatName(variant.nextQuestOverride)}</span>
                        </div>
                      )}

                      {variant.dmNotes && (
                        <div className="bg-purple-900/30 rounded p-2 border border-purple-500/30">
                          <div className="text-xs text-purple-300">DM Notes</div>
                          <p className="text-gray-300 text-sm">{variant.dmNotes}</p>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="text-gray-500 text-center py-8">No variants defined</div>
              )}
            </div>
          )}

          {/* PREREQUISITES TAB (DM) */}
          {activeTab === 'prerequisites' && userIsDM && (
            <div className="space-y-6">
              <div className="text-xl font-bold text-red-400 mb-3">🔒 Prerequisites</div>

              {quest.prerequisites?.quests?.length > 0 && (
                <div className="bg-blue-900/20 rounded-lg p-4 border border-blue-500/30">
                  <div className="text-sm text-blue-300 font-semibold mb-3">REQUIRED QUESTS</div>
                  <div className="space-y-2">
                    {quest.prerequisites.quests.map((req, idx) => (
                      <div key={idx} className="bg-black/30 rounded p-3">
                        <div className="flex items-center justify-between">
                          <span className="text-white">{formatName(req.questId)}</span>
                          <span className={`px-2 py-0.5 rounded text-xs ${req.mustBeCompleted ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'}`}>
                            {req.mustBeCompleted ? 'Must Complete' : 'Must Start'}
                          </span>
                        </div>
                        {req.note && <p className="text-gray-400 text-sm mt-1">{req.note}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {quest.prerequisites?.factionReputation?.length > 0 && (
                <div className="bg-purple-900/20 rounded-lg p-4 border border-purple-500/30">
                  <div className="text-sm text-purple-300 font-semibold mb-3">FACTION REPUTATION</div>
                  <div className="space-y-2">
                    {quest.prerequisites.factionReputation.map((req, idx) => (
                      <div key={idx} className="bg-black/30 rounded p-3">
                        <div className="flex items-center justify-between">
                          <span className="text-white">{formatName(req.factionId)}</span>
                          <div className="flex items-center space-x-2">
                            {req.minimum !== undefined && (
                              <span className="px-2 py-0.5 rounded text-xs bg-green-500/20 text-green-300">
                                Min: {req.minimum}
                              </span>
                            )}
                            {req.maximum !== undefined && (
                              <span className="px-2 py-0.5 rounded text-xs bg-red-500/20 text-red-300">
                                Max: {req.maximum}
                              </span>
                            )}
                          </div>
                        </div>
                        {req.note && <p className="text-gray-400 text-sm mt-1">{req.note}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {quest.prerequisites?.worldState && (
                <div className="bg-amber-900/20 rounded-lg p-4 border border-amber-500/30">
                  <div className="text-sm text-amber-300 font-semibold mb-2">WORLD STATE</div>
                  <p className="text-gray-300">{quest.prerequisites.worldState}</p>
                </div>
              )}

              {quest.prerequisites?.dmNotes && (
                <div className="bg-black/30 rounded-lg p-4 border border-white/10">
                  <div className="text-sm text-gray-400 font-semibold mb-2">DM NOTES</div>
                  <p className="text-gray-300">{quest.prerequisites.dmNotes}</p>
                </div>
              )}

              {!quest.prerequisites?.quests?.length && !quest.prerequisites?.factionReputation?.length && !quest.prerequisites?.worldState && (
                <div className="text-gray-500 text-center py-8">No prerequisites defined</div>
              )}
            </div>
          )}

          {/* FAILURE TAB (DM) */}
          {activeTab === 'failure' && userIsDM && (
            <div className="space-y-6">
              <div className="text-xl font-bold text-red-400 mb-3">❌ Failure Conditions</div>

              {quest.failureConditions?.length > 0 ? (
                quest.failureConditions.map((fail, idx) => (
                  <div key={idx} className={`rounded-lg p-4 border ${fail.reversible ? 'bg-yellow-900/20 border-yellow-500/30' : 'bg-red-900/20 border-red-500/30'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-medium">{fail.condition}</span>
                      <span className={`px-2 py-0.5 rounded text-xs ${fail.reversible ? 'bg-yellow-500/20 text-yellow-300' : 'bg-red-500/20 text-red-300'}`}>
                        {fail.reversible ? 'Reversible' : 'Permanent'}
                      </span>
                    </div>
                    <p className="text-gray-400 mb-2">{fail.consequences}</p>
                    {fail.alternativePath && (
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-500 text-sm">Alternative Path:</span>
                        <span className="px-2 py-0.5 rounded text-xs bg-green-500/20 text-green-300">{formatName(fail.alternativePath)}</span>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-gray-500 text-center py-8">No failure conditions defined</div>
              )}
            </div>
          )}

          {/* TRACKING TAB (DM) */}
          {activeTab === 'tracking' && userIsDM && (
            <div className="space-y-6">
              <div className="text-xl font-bold text-blue-400 mb-3">📊 Session Tracking</div>
              <p className="text-gray-400 text-sm mb-4">Tracking data for session: <span className="text-white font-mono">{sessionId}</span></p>

              {/* Status Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className={`rounded-lg p-4 text-center cursor-pointer transition-all hover:scale-105 ${isQuestCompleted() ? 'bg-green-900/20 border border-green-500/30' : 'bg-gray-800/50 border border-gray-500/30 hover:border-gray-400/50'}`}
                  onClick={handleToggleCompleted}
                >
                  <div className="text-xs text-gray-500">Quest Completed</div>
                  <div className={`text-lg font-bold ${isQuestCompleted() ? 'text-green-400' : 'text-gray-400'}`}>
                    {isQuestCompleted() ? '✓ Yes' : '○ No'}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">Click to toggle</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4 text-center border border-gray-500/30">
                  <div className="text-xs text-gray-500">Objectives Done</div>
                  <div className="text-lg font-bold text-white">
                    {completedCount} / {totalObjectives}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">{progressPercent}%</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4 text-center border border-gray-500/30">
                  <div className="text-xs text-gray-500">Active Variants</div>
                  <div className="text-lg font-bold text-purple-400">{getActiveVariants().length || 'None'}</div>
                </div>
                <div className={`rounded-lg p-4 text-center ${quest.isHidden ? 'bg-yellow-900/20 border border-yellow-500/30' : 'bg-blue-900/20 border border-blue-500/30'}`}>
                  <div className="text-xs text-gray-500">Visibility</div>
                  <div className={`text-lg font-bold ${quest.isHidden ? 'text-yellow-400' : 'text-blue-400'}`}>
                    {quest.isHidden ? 'Hidden' : 'Visible'}
                  </div>
                </div>
              </div>

              {/* Active Variants List */}
              {getActiveVariants().length > 0 && (
                <div className="bg-purple-900/20 rounded-lg p-4 border border-purple-500/30">
                  <div className="text-sm text-purple-300 font-semibold mb-2">ACTIVE VARIANTS</div>
                  <div className="flex flex-wrap gap-2">
                    {getActiveVariants().map((variantId, idx) => {
                      const variant = quest.variants?.find(v => v.id === variantId);
                      return (
                        <span key={idx} className="px-3 py-1 rounded-lg text-sm bg-purple-500/20 text-purple-300 border border-purple-500/30">
                          {variant?.name || variantId}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Completed Objectives */}
              {sessionTrackingData.completedObjectives?.length > 0 && (
                <div className="bg-green-900/20 rounded-lg p-4 border border-green-500/30">
                  <div className="text-sm text-green-300 font-semibold mb-2">COMPLETED OBJECTIVES</div>
                  <div className="flex flex-wrap gap-2">
                    {sessionTrackingData.completedObjectives.map((objId, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded text-xs bg-green-500/20 text-green-300 font-mono">
                        {objId}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Session Notes History */}
              {sessionTrackingData.sessionNotes?.length > 0 && (
                <div className="bg-purple-900/20 rounded-lg p-4 border border-purple-500/30">
                  <div className="text-sm text-purple-300 font-semibold mb-3">SESSION NOTES HISTORY</div>
                  {sessionTrackingData.sessionNotes.map((note, idx) => (
                    <div key={idx} className="bg-black/30 rounded p-3 mb-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-gray-400 text-sm">{note.timestamp}</span>
                      </div>
                      <p className="text-gray-300 text-sm">{note.note}</p>
                    </div>
                  ))}
                </div>
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

              {quest.dmNotes?.runningThisQuest && (
                <div className="bg-black/30 rounded-lg p-4 border border-white/10">
                  <div className="text-sm text-gray-400 font-semibold mb-2">RUNNING THIS QUEST</div>
                  <p className="text-gray-300 leading-relaxed whitespace-pre-line">{quest.dmNotes.runningThisQuest}</p>
                </div>
              )}

              {quest.dmNotes?.playerMotivation && (
                <div className="bg-green-900/20 rounded-lg p-4 border border-green-500/30">
                  <div className="text-sm text-green-300 font-semibold mb-2">🎯 PLAYER MOTIVATION</div>
                  <p className="text-gray-300">{quest.dmNotes.playerMotivation}</p>
                </div>
              )}

              {quest.dmNotes?.commonMistakes && (
                <div className="bg-red-900/20 rounded-lg p-4 border border-red-500/30">
                  <div className="text-sm text-red-300 font-semibold mb-2">⚠️ COMMON MISTAKES</div>
                  <p className="text-gray-300">{quest.dmNotes.commonMistakes}</p>
                </div>
              )}

              {quest.dmNotes?.improvisationTips && (
                <div className="bg-yellow-900/20 rounded-lg p-4 border border-yellow-500/30">
                  <div className="text-sm text-yellow-300 font-semibold mb-2">💡 IMPROVISATION TIPS</div>
                  <p className="text-gray-300">{quest.dmNotes.improvisationTips}</p>
                </div>
              )}

              {quest.dmNotes?.narrativeHooks?.length > 0 && (
                <div className="bg-blue-900/20 rounded-lg p-4 border border-blue-500/30">
                  <div className="text-sm text-blue-300 font-semibold mb-2">📖 NARRATIVE HOOKS</div>
                  <ul className="space-y-1">
                    {quest.dmNotes.narrativeHooks.map((hook, idx) => (
                      <li key={idx} className="text-gray-300 flex items-start space-x-2">
                        <span className="text-blue-400">•</span><span>{hook}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {quest.dmNotes?.alternativeSolutions?.length > 0 && (
                <div className="bg-cyan-900/20 rounded-lg p-4 border border-cyan-500/30">
                  <div className="text-sm text-cyan-300 font-semibold mb-2">🔄 ALTERNATIVE SOLUTIONS</div>
                  <ul className="space-y-1">
                    {quest.dmNotes.alternativeSolutions.map((sol, idx) => (
                      <li key={idx} className="text-gray-300 flex items-start space-x-2">
                        <span className="text-cyan-400">•</span><span>{sol}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {quest.dmNotes?.consequences && (
                <div className="bg-amber-900/20 rounded-lg p-4 border border-amber-500/30">
                  <div className="text-sm text-amber-300 font-semibold mb-2">⚡ CONSEQUENCES</div>
                  <p className="text-gray-300">{quest.dmNotes.consequences}</p>
                </div>
              )}

              {quest.dmNotes?.connectedQuests?.length > 0 && (
                <div className="bg-purple-900/20 rounded-lg p-4 border border-purple-500/30">
                  <div className="text-sm text-purple-300 font-semibold mb-2">🔗 CONNECTED QUESTS</div>
                  <div className="flex flex-wrap gap-2">
                    {quest.dmNotes.connectedQuests.map((qId, idx) => (
                      <span key={idx} className="px-3 py-1 rounded-lg text-sm bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        {formatName(qId)}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {quest.dmNotes?.secretInformation && (
                <div className="bg-red-900/30 rounded-lg p-4 border border-red-500/50">
                  <div className="text-sm text-red-400 font-semibold mb-2">🤫 SECRET INFORMATION</div>
                  <p className="text-gray-300">{quest.dmNotes.secretInformation}</p>
                </div>
              )}

              {quest.dmNotes?.difficultyNotes && (
                <div className="bg-orange-900/20 rounded-lg p-4 border border-orange-500/30">
                  <div className="text-sm text-orange-300 font-semibold mb-2">⚔️ DIFFICULTY NOTES</div>
                  <p className="text-gray-300">{quest.dmNotes.difficultyNotes}</p>
                </div>
              )}

              {/* Add Session Note */}
              <div className="bg-blue-900/20 rounded-lg p-4 border border-blue-500/30">
                <div className="text-sm text-blue-400 font-semibold mb-2">📝 ADD SESSION NOTE</div>
                <p className="text-xs text-gray-500 mb-3">Notes for session: {sessionId}</p>
                <textarea
                  value={sessionNoteText}
                  onChange={(e) => setSessionNoteText(e.target.value)}
                  placeholder="Add a note for this session..."
                  className="w-full bg-black/30 border border-blue-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  rows={4}
                />
                <button
                  onClick={handleSaveSessionNote}
                  disabled={isSavingNote}
                  className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all"
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