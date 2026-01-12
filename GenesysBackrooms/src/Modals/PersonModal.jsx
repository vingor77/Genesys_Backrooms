import React, { useState, useEffect } from 'react';
import { getActiveSession } from '../Structural/Session_Utils';

export default function PersonModal({ person, onClose, userIsDM, onToggleVisibility, onUpdateSessionNotes }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedItems, setExpandedItems] = useState({});
  const [sessionNoteText, setSessionNoteText] = useState('');
  const [isSavingNote, setIsSavingNote] = useState(false);
  const sessionId = getActiveSession();

  useEffect(() => {
    if (person?.dmNotes?.sessionNotes?.[sessionId]) {
      setSessionNoteText(person.dmNotes.sessionNotes[sessionId]);
    } else {
      setSessionNoteText('');
    }
  }, [person, sessionId]);

  if (!person) return null;

  const toggleExpanded = (key) => {
    setExpandedItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleToggleVisibility = async () => {
    if (onToggleVisibility) {
      await onToggleVisibility(person.id, person.isHidden);
    }
  };

  const handleSaveSessionNote = async () => {
    if (!onUpdateSessionNotes) return;
    setIsSavingNote(true);
    try {
      await onUpdateSessionNotes(person.id, sessionId, sessionNoteText);
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
      case 'Active': return 'text-green-400';
      case 'Deceased': return 'text-red-400';
      case 'Comatose': return 'text-purple-400';
      case 'MIA': return 'text-yellow-400';
      case 'Unknown': return 'text-gray-400';
      default: return 'text-gray-400';
    }
  };

  const getHostilityColor = (hostility) => {
    switch (hostility) {
      case 'Friendly': return 'text-green-400 bg-green-500/20';
      case 'Neutral': return 'text-yellow-400 bg-yellow-500/20';
      case 'Hostile': return 'text-red-400 bg-red-500/20';
      case 'Varies': return 'text-purple-400 bg-purple-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getCharacteristicColor = (value) => {
    if (value <= 1) return 'text-red-400';
    if (value <= 2) return 'text-orange-400';
    if (value <= 3) return 'text-yellow-400';
    if (value <= 4) return 'text-green-400';
    if (value <= 5) return 'text-blue-400';
    return 'text-purple-400';
  };

  const playerTabs = [
    { id: 'overview', label: 'Overview', icon: '📋' },
    { id: 'location', label: 'Location', icon: '📍' },
    { id: 'appearance', label: 'Appearance', icon: '👤' },
    { id: 'personality', label: 'Personality', icon: '🧠' },
    { id: 'background', label: 'Background', icon: '📖' },
    { id: 'interaction', label: 'Interaction', icon: '💬' },
  ];

  const dmTabs = [
    { id: 'stats', label: 'Stats', icon: '📊' },
    { id: 'combat', label: 'Combat', icon: '⚔️' },
    { id: 'equipment', label: 'Equipment', icon: '🎒' },
    { id: 'movement', label: 'Movement', icon: '🚶' },
    { id: 'dm-notes', label: 'DM Notes', icon: '🎲' },
  ];

  const allTabs = userIsDM ? [...playerTabs, ...dmTabs] : playerTabs;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden border border-white/10">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900/50 to-indigo-900/50 p-6 border-b border-white/10">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <div className="text-5xl">
                {person.species?.toLowerCase() === 'human' ? '👤' : 
                 person.species?.toLowerCase() === 'entity' ? '👁️' : '🧬'}
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white">{person.name}</h2>
                {person.aliases?.length > 0 && (
                  <div className="text-gray-400 text-sm mb-1">
                    Also known as: {person.aliases.join(', ')}
                  </div>
                )}
                <div className="flex items-center space-x-3">
                  <span className={`font-semibold ${getStatusColor(person.status?.primary)}`}>
                    {person.status?.primary}
                  </span>
                  {person.status?.conditions?.length > 0 && (
                    <>
                      <span className="text-gray-400">•</span>
                      <span className="text-orange-400">{person.status.conditions.join(', ')}</span>
                    </>
                  )}
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-300">{person.species} • {person.age}y • {person.gender}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {userIsDM && (
                <button
                  onClick={handleToggleVisibility}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all
                    ${person.isHidden 
                      ? 'bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/50' 
                      : 'bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/50'
                    }`}
                >
                  {person.isHidden ? <span>👁️ Show</span> : <span>🚫 Hide</span>}
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
                  ? 'text-blue-400 border-b-2 border-blue-400 bg-blue-500/10'
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
              {/* Faction Affiliation */}
              {person.affiliations && (
                <div className="bg-blue-900/20 rounded-lg p-4 border border-blue-500/30">
                  <div className="text-sm text-blue-300 font-semibold mb-3">FACTION AFFILIATION</div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <div className="text-xs text-gray-500">Primary Group</div>
                      <div className="text-white font-medium">{person.affiliations.primaryGroup}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Rank</div>
                      <div className="text-white font-medium">{person.affiliations.rank || 'None'}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Division</div>
                      <div className="text-white">{person.affiliations.division || 'None'}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Status</div>
                      <div className="text-white">{person.affiliations.relationshipStatus}</div>
                    </div>
                  </div>
                  {person.affiliations.formerGroups?.length > 0 && (
                    <div className="mt-3">
                      <div className="text-xs text-gray-500">Former Groups</div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {person.affiliations.formerGroups.map((g, i) => (
                          <span key={i} className="px-2 py-0.5 rounded text-xs bg-gray-500/20 text-gray-300">{g}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Relationships */}
              {person.relationships?.length > 0 && (
                <div className="bg-purple-900/20 rounded-lg p-4 border border-purple-500/30">
                  <div className="text-sm text-purple-300 font-semibold mb-3">🤝 RELATIONSHIPS</div>
                  <div className="space-y-2">
                    {person.relationships.map((rel, idx) => (
                      <div key={idx} className="bg-black/30 rounded-lg p-3 flex items-start justify-between">
                        <div>
                          <div className="text-white font-medium">{rel.name}</div>
                          <div className="text-gray-400 text-sm">{rel.description}</div>
                        </div>
                        <span className="px-2 py-0.5 rounded text-xs bg-purple-500/20 text-purple-300 border border-purple-500/30 ml-2 whitespace-nowrap">
                          {rel.relationshipType}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Story Hooks */}
              {person.storyHooks?.length > 0 && (
                <div className="bg-amber-900/20 rounded-lg p-4 border border-amber-500/30">
                  <div className="text-sm text-amber-300 font-semibold mb-3">📜 STORY HOOKS</div>
                  <div className="space-y-2">
                    {person.storyHooks.map((hook, idx) => (
                      <div key={idx} className="bg-black/30 rounded-lg p-3">
                        <div className="text-white font-medium">{hook.title}</div>
                        <div className="text-gray-400 text-sm">{hook.description}</div>
                        {hook.questId && (
                          <div className="text-xs text-amber-400 mt-1">Quest: {hook.questId}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              {person.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {person.tags.map((tag, idx) => (
                    <span key={idx} className="px-3 py-1 rounded-lg text-sm bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* LOCATION TAB */}
          {activeTab === 'location' && (
            <div className="space-y-6">
              {/* Home Level */}
              {person.homeLevel && (
                <div className="bg-green-900/20 rounded-lg p-4 border border-green-500/30">
                  <div className="text-sm text-green-300 font-semibold mb-2">🏠 HOME LEVEL</div>
                  <div className="text-white text-xl font-medium">{formatName(person.homeLevel)}</div>
                  <div className="text-gray-400 text-sm">Where this character originated or prefers to be</div>
                </div>
              )}

              {/* Current Location */}
              {person.currentLocation && (
                <div className="bg-blue-900/20 rounded-lg p-4 border border-blue-500/30">
                  <div className="text-sm text-blue-300 font-semibold mb-3">📍 CURRENT LOCATION</div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <div className="text-xs text-gray-500">Type</div>
                      <div className="text-white font-medium">{person.currentLocation.type}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Level</div>
                      <div className="text-white">{formatName(person.currentLocation.levelId) || 'Unknown'}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Outpost</div>
                      <div className="text-white">{formatName(person.currentLocation.outpostId) || 'None'}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Arrived</div>
                      <div className="text-white">{person.currentLocation.arrivedDate}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Previous Location */}
              {person.previousLocation && (
                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-600/30">
                  <div className="text-sm text-gray-400 font-semibold mb-3">📍 PREVIOUS LOCATION</div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                    <div>
                      <div className="text-xs text-gray-500">Type</div>
                      <div className="text-gray-300">{person.previousLocation.type}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Level</div>
                      <div className="text-gray-300">{formatName(person.previousLocation.levelId) || 'Unknown'}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Outpost</div>
                      <div className="text-gray-300">{formatName(person.previousLocation.outpostId) || 'None'}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Departed</div>
                      <div className="text-gray-300">{person.previousLocation.departedDate}</div>
                    </div>
                  </div>
                  {person.previousLocation.reason && (
                    <div className="bg-black/30 rounded p-3">
                      <div className="text-xs text-gray-500 mb-1">Reason for Move</div>
                      <div className="text-gray-300">{person.previousLocation.reason}</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* APPEARANCE TAB */}
          {activeTab === 'appearance' && (
            <div className="space-y-6">
              {person.appearance && (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-black/30 rounded-lg p-4 border border-white/10">
                      <div className="text-xs text-gray-500 mb-1">Height</div>
                      <div className="text-white font-medium">{person.appearance.height}</div>
                    </div>
                    <div className="bg-black/30 rounded-lg p-4 border border-white/10">
                      <div className="text-xs text-gray-500 mb-1">Build</div>
                      <div className="text-white font-medium">{person.appearance.build}</div>
                    </div>
                    <div className="bg-black/30 rounded-lg p-4 border border-white/10">
                      <div className="text-xs text-gray-500 mb-1">Hair</div>
                      <div className="text-white">{person.appearance.hair}</div>
                    </div>
                    <div className="bg-black/30 rounded-lg p-4 border border-white/10">
                      <div className="text-xs text-gray-500 mb-1">Eyes</div>
                      <div className="text-white">{person.appearance.eyes}</div>
                    </div>
                  </div>

                  {person.appearance.distinguishingFeatures && (
                    <div className="bg-purple-900/20 rounded-lg p-4 border border-purple-500/30">
                      <div className="text-sm text-purple-300 font-semibold mb-2">DISTINGUISHING FEATURES</div>
                      <p className="text-gray-300">{person.appearance.distinguishingFeatures}</p>
                    </div>
                  )}

                  {person.appearance.fullDescription && (
                    <div className="bg-black/30 rounded-lg p-4 border border-white/10">
                      <div className="text-sm text-gray-400 font-semibold mb-2">FULL DESCRIPTION</div>
                      <p className="text-gray-300 leading-relaxed">{person.appearance.fullDescription}</p>
                    </div>
                  )}
                </>
              )}

              {/* Voice */}
              {person.voice && (
                <div className="bg-cyan-900/20 rounded-lg p-4 border border-cyan-500/30">
                  <div className="text-sm text-cyan-300 font-semibold mb-3">🗣️ VOICE & SPEECH</div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <div className="text-xs text-gray-500">Accent</div>
                      <div className="text-white">{person.voice.accent}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Tone</div>
                      <div className="text-white">{person.voice.tone}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Pitch</div>
                      <div className="text-white">{person.voice.pitch}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Pattern</div>
                      <div className="text-white">{person.voice.speechPattern}</div>
                    </div>
                  </div>
                  {person.voice.notableQuotes?.length > 0 && (
                    <div>
                      <div className="text-xs text-gray-500 mb-2">Notable Quotes</div>
                      <div className="space-y-2">
                        {person.voice.notableQuotes.map((quote, idx) => (
                          <div key={idx} className="bg-black/30 rounded p-3 italic text-gray-300">
                            "{quote}"
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* PERSONALITY TAB */}
          {activeTab === 'personality' && (
            <div className="space-y-6">
              {person.personality && (
                <>
                  {/* Traits */}
                  {person.personality.traits?.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {person.personality.traits.map((trait, idx) => (
                        <span key={idx} className="px-3 py-1 rounded-lg text-sm bg-blue-500/20 text-blue-300 border border-blue-500/30">
                          {trait}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Demeanor */}
                  {person.personality.demeanor && (
                    <div className="bg-black/30 rounded-lg p-4 border border-white/10">
                      <div className="text-sm text-gray-400 font-semibold mb-2">DEMEANOR</div>
                      <p className="text-gray-300">{person.personality.demeanor}</p>
                    </div>
                  )}

                  {/* Genesys Framework */}
                  {person.personality.genesysFramework && (
                    <div className="bg-purple-900/20 rounded-lg p-4 border border-purple-500/30">
                      <div className="text-sm text-purple-300 font-semibold mb-3">GENESYS CHARACTER FRAMEWORK</div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-black/30 rounded p-3">
                          <div className="text-xs text-gray-500">Motivation</div>
                          <div className="text-white font-medium">{person.personality.genesysFramework.motivation}</div>
                        </div>
                        <div className="bg-black/30 rounded p-3">
                          <div className="text-xs text-gray-500">Strength</div>
                          <div className="text-green-400 font-medium">{person.personality.genesysFramework.strength}</div>
                        </div>
                        <div className="bg-black/30 rounded p-3">
                          <div className="text-xs text-gray-500">Flaw</div>
                          <div className="text-red-400 font-medium">{person.personality.genesysFramework.flaw}</div>
                        </div>
                        <div className="bg-black/30 rounded p-3">
                          <div className="text-xs text-gray-500">Desire</div>
                          <div className="text-yellow-400 font-medium">{person.personality.genesysFramework.desire}</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Fears */}
                  {person.personality.fears?.length > 0 && (
                    <div className="bg-red-900/20 rounded-lg p-4 border border-red-500/30">
                      <div className="text-sm text-red-300 font-semibold mb-2">😨 FEARS</div>
                      <ul className="space-y-1">
                        {person.personality.fears.map((fear, idx) => (
                          <li key={idx} className="text-gray-300 flex items-center space-x-2">
                            <span className="text-red-400">•</span><span>{fear}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Quirks & Mental State */}
                  <div className="grid grid-cols-2 gap-4">
                    {person.personality.quirks && (
                      <div className="bg-black/30 rounded-lg p-4 border border-white/10">
                        <div className="text-sm text-gray-400 font-semibold mb-2">QUIRKS</div>
                        <p className="text-gray-300">{person.personality.quirks}</p>
                      </div>
                    )}
                    {person.personality.mentalState && (
                      <div className="bg-black/30 rounded-lg p-4 border border-white/10">
                        <div className="text-sm text-gray-400 font-semibold mb-2">MENTAL STATE</div>
                        <p className="text-gray-300">{person.personality.mentalState}</p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {/* BACKGROUND TAB */}
          {activeTab === 'background' && (
            <div className="space-y-6">
              {person.background && (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="bg-black/30 rounded-lg p-4 border border-white/10">
                      <div className="text-xs text-gray-500 mb-1">Origin</div>
                      <div className="text-white font-medium">{person.background.origin}</div>
                    </div>
                    <div className="bg-black/30 rounded-lg p-4 border border-white/10">
                      <div className="text-xs text-gray-500 mb-1">Entered Backrooms</div>
                      <div className="text-white font-medium">{person.background.enteredBackrooms}</div>
                    </div>
                    <div className="bg-black/30 rounded-lg p-4 border border-white/10">
                      <div className="text-xs text-gray-500 mb-1">Discovered By</div>
                      <div className="text-white">{person.background.discoveredBy}</div>
                    </div>
                  </div>

                  {person.background.backstory && (
                    <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-lg p-4 border border-white/10">
                      <div className="text-sm text-gray-400 font-semibold mb-2">BACKSTORY</div>
                      <p className="text-gray-300 leading-relaxed whitespace-pre-line">{person.background.backstory}</p>
                    </div>
                  )}
                </>
              )}

              {/* Accomplishments */}
              {person.accomplishments?.length > 0 && (
                <div className="bg-amber-900/20 rounded-lg p-4 border border-amber-500/30">
                  <div className="text-sm text-amber-300 font-semibold mb-3">🏆 ACCOMPLISHMENTS</div>
                  <div className="space-y-3">
                    {person.accomplishments.map((acc, idx) => (
                      <div key={idx} className="bg-black/30 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-white font-medium">{acc.title}</span>
                          <span className="text-amber-400 text-sm">{acc.date}</span>
                        </div>
                        <p className="text-gray-400 text-sm">{acc.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sleep Schedule */}
              {person.sleepSchedule && (
                <div className="bg-black/30 rounded-lg p-4 border border-white/10">
                  <div className="text-sm text-gray-400 font-semibold mb-2">😴 SLEEP SCHEDULE</div>
                  <p className="text-gray-300">{person.sleepSchedule}</p>
                </div>
              )}
            </div>
          )}

          {/* INTERACTION TAB */}
          {activeTab === 'interaction' && (
            <div className="space-y-6">
              {person.interaction && (
                <>
                  {/* Hostility & Willingness */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className={`rounded-lg p-4 border ${getHostilityColor(person.interaction.hostilityLevel)}`}>
                      <div className="text-sm font-semibold mb-1">Hostility Level</div>
                      <div className="text-2xl font-bold">{person.interaction.hostilityLevel}</div>
                    </div>
                    <div className="bg-black/30 rounded-lg p-4 border border-white/10">
                      <div className="text-sm text-gray-400 mb-1">Willingness to Help</div>
                      <div className="text-2xl font-bold text-white">{person.interaction.willingnessToHelp}</div>
                    </div>
                  </div>

                  {/* Communication Style */}
                  {person.interaction.communicationStyle && (
                    <div className="bg-cyan-900/20 rounded-lg p-4 border border-cyan-500/30">
                      <div className="text-sm text-cyan-300 font-semibold mb-2">💬 COMMUNICATION STYLE</div>
                      <p className="text-gray-300">{person.interaction.communicationStyle}</p>
                    </div>
                  )}

                  {/* Typical Requests */}
                  {person.interaction.typicalRequests?.length > 0 && (
                    <div className="bg-blue-900/20 rounded-lg p-4 border border-blue-500/30">
                      <div className="text-sm text-blue-300 font-semibold mb-2">📝 TYPICAL REQUESTS</div>
                      <ul className="space-y-1">
                        {person.interaction.typicalRequests.map((req, idx) => (
                          <li key={idx} className="text-gray-300 flex items-center space-x-2">
                            <span className="text-blue-400">•</span><span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Rewards Offered */}
                  {person.interaction.rewardsOffered?.length > 0 && (
                    <div className="bg-green-900/20 rounded-lg p-4 border border-green-500/30">
                      <div className="text-sm text-green-300 font-semibold mb-2">🎁 REWARDS OFFERED</div>
                      <ul className="space-y-1">
                        {person.interaction.rewardsOffered.map((reward, idx) => (
                          <li key={idx} className="text-gray-300 flex items-center space-x-2">
                            <span className="text-green-400">•</span><span>{reward}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Dangers */}
                  {person.interaction.dangers && (
                    <div className="bg-red-900/20 rounded-lg p-4 border border-red-500/30">
                      <div className="text-sm text-red-300 font-semibold mb-2">⚠️ DANGERS</div>
                      <p className="text-gray-300">{person.interaction.dangers}</p>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* STATS TAB (DM) */}
          {activeTab === 'stats' && userIsDM && (
            <div className="space-y-6">
              {/* Characteristics */}
              {person.characteristics && (
                <div className="bg-black/30 rounded-lg p-4 border border-white/10">
                  <div className="text-sm text-gray-400 font-semibold mb-3">CHARACTERISTICS</div>
                  <div className="grid grid-cols-6 gap-2">
                    {Object.entries(person.characteristics).map(([stat, value]) => (
                      <div key={stat} className="bg-black/30 rounded-lg p-3 text-center">
                        <div className="text-xs text-gray-500 uppercase">{stat}</div>
                        <div className={`text-2xl font-bold ${getCharacteristicColor(value)}`}>{value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Derived Stats */}
              {person.derived && (
                <div className="bg-black/30 rounded-lg p-4 border border-white/10">
                  <div className="text-sm text-gray-400 font-semibold mb-3">DERIVED STATS</div>
                  <div className="grid grid-cols-5 gap-2">
                    <div className="bg-red-900/20 rounded-lg p-3 text-center border border-red-500/30">
                      <div className="text-xs text-gray-500">Soak</div>
                      <div className="text-xl font-bold text-red-400">{person.derived.soak}</div>
                    </div>
                    <div className="bg-red-900/20 rounded-lg p-3 text-center border border-red-500/30">
                      <div className="text-xs text-gray-500">Wounds</div>
                      <div className="text-xl font-bold text-red-400">{person.derived.woundsThreshold}</div>
                    </div>
                    <div className="bg-purple-900/20 rounded-lg p-3 text-center border border-purple-500/30">
                      <div className="text-xs text-gray-500">Strain</div>
                      <div className="text-xl font-bold text-purple-400">{person.derived.strainThreshold}</div>
                    </div>
                    <div className="bg-blue-900/20 rounded-lg p-3 text-center border border-blue-500/30">
                      <div className="text-xs text-gray-500">M Def</div>
                      <div className="text-xl font-bold text-blue-400">{person.derived.meleeDefense}</div>
                    </div>
                    <div className="bg-blue-900/20 rounded-lg p-3 text-center border border-blue-500/30">
                      <div className="text-xs text-gray-500">R Def</div>
                      <div className="text-xl font-bold text-blue-400">{person.derived.rangedDefense}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Skills */}
              {person.skills && Object.keys(person.skills).length > 0 && (
                <div className="bg-black/30 rounded-lg p-4 border border-white/10">
                  <div className="text-sm text-gray-400 font-semibold mb-3">SKILLS</div>
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                    {Object.entries(person.skills).map(([skill, ranks]) => (
                      <div key={skill} className="bg-black/30 rounded p-2 flex items-center justify-between">
                        <span className="text-gray-300 capitalize text-sm">{skill}</span>
                        <span className="text-yellow-400 font-bold">{ranks}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Talents */}
              {person.talents?.length > 0 && (
                <div className="bg-amber-900/20 rounded-lg p-4 border border-amber-500/30">
                  <div className="text-sm text-amber-300 font-semibold mb-3">TALENTS</div>
                  <div className="space-y-2">
                    {person.talents.map((talent, idx) => (
                      <div key={idx} className="bg-black/30 rounded p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-white font-medium">{talent.name}</span>
                          <span className="px-2 py-0.5 rounded text-xs bg-amber-500/20 text-amber-300">Tier {talent.tier}</span>
                        </div>
                        <p className="text-gray-400 text-sm">{talent.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Abilities */}
              {person.abilities?.length > 0 && (
                <div className="bg-purple-900/20 rounded-lg p-4 border border-purple-500/30">
                  <div className="text-sm text-purple-300 font-semibold mb-3">SPECIAL ABILITIES</div>
                  <div className="space-y-2">
                    {person.abilities.map((ability, idx) => (
                      <div key={idx} className="bg-black/30 rounded p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-white font-medium">{ability.name}</span>
                          <span className="px-2 py-0.5 rounded text-xs bg-purple-500/20 text-purple-300">{ability.type}</span>
                        </div>
                        <p className="text-gray-400 text-sm">{ability.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* COMBAT TAB (DM) */}
          {activeTab === 'combat' && userIsDM && (
            <div className="space-y-6">
              {/* Strengths & Weaknesses */}
              <div className="grid grid-cols-2 gap-4">
                {person.strengths?.length > 0 && (
                  <div className="bg-green-900/20 rounded-lg p-4 border border-green-500/30">
                    <div className="text-sm text-green-300 font-semibold mb-2">💪 STRENGTHS</div>
                    <ul className="space-y-1">
                      {person.strengths.map((s, idx) => (
                        <li key={idx} className="text-gray-300 flex items-center space-x-2">
                          <span className="text-green-400">+</span><span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {person.weaknesses?.length > 0 && (
                  <div className="bg-red-900/20 rounded-lg p-4 border border-red-500/30">
                    <div className="text-sm text-red-300 font-semibold mb-2">⚠️ WEAKNESSES</div>
                    <ul className="space-y-1">
                      {person.weaknesses.map((w, idx) => (
                        <li key={idx} className="text-gray-300 flex items-center space-x-2">
                          <span className="text-red-400">-</span><span>{w}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Combat Behavior */}
              {person.combatBehavior && (
                <div className="bg-orange-900/20 rounded-lg p-4 border border-orange-500/30">
                  <div className="text-sm text-orange-300 font-semibold mb-3">⚔️ COMBAT BEHAVIOR</div>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="bg-black/30 rounded p-3">
                      <div className="text-xs text-gray-500">Aggressiveness</div>
                      <div className="text-white font-medium">{person.combatBehavior.aggressiveness}</div>
                    </div>
                    <div className="bg-black/30 rounded p-3">
                      <div className="text-xs text-gray-500">Preferred Range</div>
                      <div className="text-white font-medium">{person.combatBehavior.preferredRange}</div>
                    </div>
                    <div className="bg-black/30 rounded p-3">
                      <div className="text-xs text-gray-500">Flee Threshold</div>
                      <div className="text-white font-medium">{person.combatBehavior.fleeThreshold} wounds</div>
                    </div>
                  </div>
                  {person.combatBehavior.tactics && (
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Tactics</div>
                      <p className="text-gray-300">{person.combatBehavior.tactics}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* EQUIPMENT TAB (DM) */}
          {activeTab === 'equipment' && userIsDM && (
            <div className="space-y-6">
              {person.equipment && (
                <>
                  {/* Equipped */}
                  <div className="bg-black/30 rounded-lg p-4 border border-white/10">
                    <div className="text-sm text-gray-400 font-semibold mb-3">🎽 EQUIPPED</div>
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                      {Object.entries(person.equipment.equipped || {}).map(([slot, item]) => (
                        <div key={slot} className={`rounded p-2 ${item ? 'bg-blue-900/20 border border-blue-500/30' : 'bg-black/30 border border-white/10'}`}>
                          <div className="text-xs text-gray-500 capitalize">{slot}</div>
                          <div className={`text-sm ${item ? 'text-blue-300' : 'text-gray-600'}`}>
                            {item ? formatName(item) : '—'}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Inventory */}
                  {person.equipment.inventory?.length > 0 && (
                    <div className="bg-black/30 rounded-lg p-4 border border-white/10">
                      <div className="text-sm text-gray-400 font-semibold mb-3">🎒 INVENTORY</div>
                      <div className="flex flex-wrap gap-2">
                        {person.equipment.inventory.map((item, idx) => (
                          <span key={idx} className="px-3 py-1 rounded-lg text-sm bg-gray-700 text-gray-300">
                            {formatName(item)}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Signature Items */}
                  {person.equipment.signatureItems?.length > 0 && (
                    <div className="bg-amber-900/20 rounded-lg p-4 border border-amber-500/30">
                      <div className="text-sm text-amber-300 font-semibold mb-3">⭐ SIGNATURE ITEMS</div>
                      <div className="space-y-3">
                        {person.equipment.signatureItems.map((item, idx) => (
                          <div key={idx} className="bg-black/30 rounded-lg p-3">
                            <div className="text-white font-medium">{item.name}</div>
                            <p className="text-gray-400 text-sm">{item.description}</p>
                            {item.effect && (
                              <div className="mt-2 text-amber-400 text-sm">Effect: {item.effect}</div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* MOVEMENT TAB (DM) */}
          {activeTab === 'movement' && userIsDM && (
            <div className="space-y-6">
              {person.movement && (
                <>
                  {/* Movement Profile */}
                  <div className="bg-blue-900/20 rounded-lg p-4 border border-blue-500/30">
                    <div className="text-sm text-blue-300 font-semibold mb-3">🚶 MOVEMENT PROFILE</div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-black/30 rounded p-3">
                        <div className="text-xs text-gray-500">Profile ID</div>
                        <div className="text-white font-medium">{person.movement.profileId || 'Custom'}</div>
                      </div>
                      <div className="bg-black/30 rounded p-3">
                        <div className="text-xs text-gray-500">Last Move Date</div>
                        <div className="text-white">{person.movement.lastMoveDate || 'Never'}</div>
                      </div>
                    </div>
                  </div>

                  {/* Last Encounter */}
                  <div className="bg-black/30 rounded-lg p-4 border border-white/10">
                    <div className="text-sm text-gray-400 font-semibold mb-2">ENCOUNTER TRACKING</div>
                    <div className="text-white">
                      Last Encounter: {person.movement.lastEncounterDate || 'Never encountered'}
                    </div>
                  </div>

                  {/* Overrides */}
                  {person.movement.overrides && Object.keys(person.movement.overrides).length > 0 && (
                    <div className="bg-purple-900/20 rounded-lg p-4 border border-purple-500/30">
                      <div className="text-sm text-purple-300 font-semibold mb-3">PROFILE OVERRIDES</div>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(person.movement.overrides).map(([key, value]) => (
                          <div key={key} className="bg-black/30 rounded p-2">
                            <div className="text-xs text-gray-500 capitalize">{key}</div>
                            <div className="text-white">{String(value)}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Custom Movement */}
                  {person.movement.custom && (
                    <div className="bg-amber-900/20 rounded-lg p-4 border border-amber-500/30">
                      <div className="text-sm text-amber-300 font-semibold mb-3">CUSTOM MOVEMENT</div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        <div className="bg-black/30 rounded p-2">
                          <div className="text-xs text-gray-500">Movement Type</div>
                          <div className="text-white">{person.movement.custom.movementType}</div>
                        </div>
                        <div className="bg-black/30 rounded p-2">
                          <div className="text-xs text-gray-500">Move Frequency</div>
                          <div className="text-white">{(person.movement.custom.moveFrequency * 100).toFixed(0)}%</div>
                        </div>
                        <div className="bg-black/30 rounded p-2">
                          <div className="text-xs text-gray-500">Check Interval</div>
                          <div className="text-white">{person.movement.custom.checkInterval} days</div>
                        </div>
                        <div className="bg-black/30 rounded p-2">
                          <div className="text-xs text-gray-500">Transit Time</div>
                          <div className="text-white">{person.movement.custom.transitTime} days</div>
                        </div>
                        <div className="bg-black/30 rounded p-2">
                          <div className="text-xs text-gray-500">Max Danger Level</div>
                          <div className="text-white">{person.movement.custom.maxDangerLevel}</div>
                        </div>
                        <div className="bg-black/30 rounded p-2">
                          <div className="text-xs text-gray-500">Outpost Preference</div>
                          <div className="text-white">{(person.movement.custom.outpostPreference * 100).toFixed(0)}%</div>
                        </div>
                        <div className="bg-black/30 rounded p-2">
                          <div className="text-xs text-gray-500">Encounter Cooldown</div>
                          <div className="text-white">{person.movement.custom.encounterCooldown} days</div>
                        </div>
                      </div>
                      {person.movement.custom.preferredTags?.length > 0 && (
                        <div className="mt-3">
                          <div className="text-xs text-gray-500 mb-1">Preferred Tags</div>
                          <div className="flex flex-wrap gap-1">
                            {person.movement.custom.preferredTags.map((tag, i) => (
                              <span key={i} className="px-2 py-0.5 rounded text-xs bg-green-500/20 text-green-300">{tag}</span>
                            ))}
                          </div>
                        </div>
                      )}
                      {person.movement.custom.avoidTags?.length > 0 && (
                        <div className="mt-2">
                          <div className="text-xs text-gray-500 mb-1">Avoid Tags</div>
                          <div className="flex flex-wrap gap-1">
                            {person.movement.custom.avoidTags.map((tag, i) => (
                              <span key={i} className="px-2 py-0.5 rounded text-xs bg-red-500/20 text-red-300">{tag}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </>
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
              {person.dmNotes?.howToRun && (
                <div className="bg-black/30 rounded-lg p-4 border border-white/10">
                  <div className="text-sm text-gray-400 font-semibold mb-2">HOW TO RUN</div>
                  <p className="text-gray-300 leading-relaxed whitespace-pre-line">{person.dmNotes.howToRun}</p>
                </div>
              )}

              {/* Roleplay Tips */}
              {person.dmNotes?.roleplayTips && (
                <div className="bg-cyan-900/20 rounded-lg p-4 border border-cyan-500/30">
                  <div className="text-sm text-cyan-300 font-semibold mb-2">🎭 ROLEPLAY TIPS</div>
                  <p className="text-gray-300 leading-relaxed whitespace-pre-line">{person.dmNotes.roleplayTips}</p>
                </div>
              )}

              {/* Combat Tactics */}
              {person.dmNotes?.combatTactics && (
                <div className="bg-orange-900/20 rounded-lg p-4 border border-orange-500/30">
                  <div className="text-sm text-orange-300 font-semibold mb-2">⚔️ COMBAT TACTICS</div>
                  <p className="text-gray-300 leading-relaxed whitespace-pre-line">{person.dmNotes.combatTactics}</p>
                </div>
              )}

              {/* Session Notes */}
              <div className="bg-blue-900/20 rounded-lg p-4 border border-blue-500/30">
                <div className="text-sm text-blue-400 font-semibold mb-2">📝 SESSION NOTES</div>
                <p className="text-xs text-gray-500 mb-3">Notes for this session ({sessionId}). Only you can see these.</p>
                <textarea
                  value={sessionNoteText}
                  onChange={(e) => setSessionNoteText(e.target.value)}
                  placeholder="Add notes for this character in the current session..."
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