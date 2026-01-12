import React, { useState, useEffect } from 'react';
import { getActiveSession } from '../Structural/Session_Utils';

export default function PhenomenonModal({ phenomenon, onClose, userIsDM, onToggleVisibility, onUpdateSessionNotes }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedItems, setExpandedItems] = useState({});
  const [sessionNoteText, setSessionNoteText] = useState('');
  const [isSavingNote, setIsSavingNote] = useState(false);
  const sessionId = getActiveSession();

  useEffect(() => {
    if (phenomenon?.dmNotes?.sessionNotes?.[sessionId]) {
      setSessionNoteText(phenomenon.dmNotes.sessionNotes[sessionId]);
    } else {
      setSessionNoteText('');
    }
  }, [phenomenon, sessionId]);

  if (!phenomenon) return null;

  const toggleExpanded = (key) => {
    setExpandedItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleToggleVisibility = async () => {
    if (onToggleVisibility) {
      await onToggleVisibility(phenomenon.id, phenomenon.isHidden);
    }
  };

  const handleSaveSessionNote = async () => {
    if (!onUpdateSessionNotes) return;
    setIsSavingNote(true);
    try {
      await onUpdateSessionNotes(phenomenon.id, sessionId, sessionNoteText);
    } catch (error) {
      console.error('Error saving session note:', error);
    }
    setIsSavingNote(false);
  };

  const formatName = (str) => {
    if (!str) return '';
    return str.split(/[-_]/).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Isolation': return 'text-indigo-400';
      case 'Temporal': return 'text-cyan-400';
      case 'Spatial': return 'text-purple-400';
      case 'Reality Distortion': return 'text-pink-400';
      case 'Environmental': return 'text-green-400';
      case 'Mental': return 'text-yellow-400';
      case 'Physical': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getCategoryGradient = (category) => {
    switch (category) {
      case 'Isolation': return 'from-indigo-900/50 to-blue-900/50';
      case 'Temporal': return 'from-cyan-900/50 to-teal-900/50';
      case 'Spatial': return 'from-purple-900/50 to-violet-900/50';
      case 'Reality Distortion': return 'from-pink-900/50 to-rose-900/50';
      case 'Environmental': return 'from-green-900/50 to-emerald-900/50';
      case 'Mental': return 'from-yellow-900/50 to-amber-900/50';
      case 'Physical': return 'from-red-900/50 to-orange-900/50';
      default: return 'from-gray-900/50 to-slate-900/50';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Isolation': return '👁️‍🗨️';
      case 'Temporal': return '⏳';
      case 'Spatial': return '🌀';
      case 'Reality Distortion': return '💫';
      case 'Environmental': return '🌡️';
      case 'Mental': return '🧠';
      case 'Physical': return '💀';
      default: return '❓';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 0: return 'text-green-400';
      case 1: return 'text-blue-400';
      case 2: return 'text-yellow-400';
      case 3: return 'text-orange-400';
      case 4: return 'text-red-400';
      case 5: return 'text-red-600';
      default: return 'text-gray-400';
    }
  };

  const getSeverityLabel = (severity) => {
    switch (severity) {
      case 0: return 'Beneficial';
      case 1: return 'Harmless';
      case 2: return 'Moderate';
      case 3: return 'Significant';
      case 4: return 'Severe';
      case 5: return 'Lethal';
      default: return 'Unknown';
    }
  };

  const getEffectTypeColor = (type) => {
    switch (type) {
      case 'physical': return 'border-red-500/50 bg-red-900/20';
      case 'mental': return 'border-yellow-500/50 bg-yellow-900/20';
      case 'environmental': return 'border-green-500/50 bg-green-900/20';
      case 'temporal': return 'border-cyan-500/50 bg-cyan-900/20';
      case 'spatial': return 'border-purple-500/50 bg-purple-900/20';
      case 'sanity': return 'border-pink-500/50 bg-pink-900/20';
      case 'isolation': return 'border-indigo-500/50 bg-indigo-900/20';
      default: return 'border-gray-500/50 bg-gray-900/20';
    }
  };

  const playerTabs = [
    { id: 'overview', label: 'Overview', icon: '📋' },
    { id: 'effects', label: 'Effects', icon: '⚡' },
    { id: 'counterplay', label: 'Counterplay', icon: '🛡️' },
    { id: 'indicators', label: 'Indicators', icon: '👁️' },
  ];

  const dmTabs = [
    { id: 'variants', label: 'Variants', icon: '🔀' },
    { id: 'dm-notes', label: 'DM Notes', icon: '🎲' },
  ];

  const allTabs = userIsDM ? [...playerTabs, ...dmTabs] : playerTabs;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-white/10">
        
        {/* Header */}
        <div className={`bg-gradient-to-r ${getCategoryGradient(phenomenon.category)} p-6 border-b border-white/10`}>
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <div className="text-5xl">{getCategoryIcon(phenomenon.category)}</div>
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-3xl font-bold text-white">{phenomenon.name}</h2>
                  {phenomenon.number && (
                    <span className="text-gray-400 font-mono text-sm">#{phenomenon.number}</span>
                  )}
                </div>
                {phenomenon.aliases?.length > 0 && (
                  <div className="text-gray-400 text-sm mb-1">
                    Also known as: {phenomenon.aliases.join(', ')}
                  </div>
                )}
                <div className="flex items-center space-x-3">
                  <span className={`font-semibold ${getCategoryColor(phenomenon.category)}`}>{phenomenon.category}</span>
                  <span className="text-gray-400">•</span>
                  <span className={`font-bold ${getSeverityColor(phenomenon.severity)}`}>
                    {getSeverityLabel(phenomenon.severity)} ({phenomenon.severity}/5)
                  </span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-300">
                    {phenomenon.scope === 'level-wide' ? '🌐 Level-wide' : '🚪 Room-specific'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {userIsDM && (
                <button
                  onClick={handleToggleVisibility}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all
                    ${phenomenon.isHidden 
                      ? 'bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/50' 
                      : 'bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/50'
                    }`}
                >
                  {phenomenon.isHidden ? <span>👁️ Show</span> : <span>🚫 Hide</span>}
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
              className={`px-6 py-3 font-medium transition-all whitespace-nowrap
                ${activeTab === tab.id
                  ? 'text-purple-400 border-b-2 border-purple-400 bg-purple-500/10'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-220px)]">
          
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Description */}
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-lg p-4 border border-white/10">
                <div className="text-sm text-gray-400 font-semibold mb-2">OVERVIEW</div>
                <p className="text-gray-300 leading-relaxed">{phenomenon.description?.overview}</p>
              </div>

              <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-lg p-4 border border-purple-500/30">
                <div className="text-sm text-purple-300 font-semibold mb-2">✨ MANIFESTATION</div>
                <p className="text-gray-300 leading-relaxed">{phenomenon.description?.manifestation}</p>
              </div>

              {/* Trigger System */}
              <div className="bg-black/30 rounded-lg p-4 border border-white/10">
                <div className="text-sm text-gray-400 font-semibold mb-3">⚡ TRIGGER SYSTEM</div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-500">Type:</span>
                    <span className="text-white ml-2 capitalize">{phenomenon.triggerType?.replace('-', ' ')}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Stacking:</span>
                    <span className="text-white ml-2 capitalize">{phenomenon.stackingBehavior}</span>
                  </div>
                </div>
                
                {phenomenon.triggerDetails && (
                  <div className="mt-3 space-y-2">
                    {phenomenon.triggerDetails.condition && (
                      <div className="bg-black/30 rounded p-2">
                        <span className="text-gray-500 text-sm">Condition:</span>
                        <span className="text-white text-sm ml-2">{phenomenon.triggerDetails.condition}</span>
                      </div>
                    )}
                    {phenomenon.triggerDetails.activationMethod && (
                      <div className="bg-black/30 rounded p-2">
                        <span className="text-gray-500 text-sm">Activation:</span>
                        <span className="text-white text-sm ml-2">{phenomenon.triggerDetails.activationMethod}</span>
                      </div>
                    )}
                    {phenomenon.triggerDetails.chancePerHour !== null && phenomenon.triggerDetails.chancePerHour !== undefined && (
                      <div className="bg-black/30 rounded p-2">
                        <span className="text-gray-500 text-sm">Chance per Hour:</span>
                        <span className="text-yellow-400 text-sm ml-2">{(phenomenon.triggerDetails.chancePerHour * 100).toFixed(0)}%</span>
                      </div>
                    )}
                    {phenomenon.triggerDetails.requirements && (
                      <div className="bg-black/30 rounded p-2">
                        <span className="text-gray-500 text-sm">Requirements:</span>
                        <span className="text-white text-sm ml-2">{phenomenon.triggerDetails.requirements}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Interactions */}
              {phenomenon.interactions && (
                <div className="bg-black/30 rounded-lg p-4 border border-white/10">
                  <div className="text-sm text-gray-400 font-semibold mb-3">🔗 INTERACTIONS</div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className={`rounded-lg p-3 text-center ${phenomenon.interactions.affectsEntities ? 'bg-green-500/20 border border-green-500/30' : 'bg-red-500/20 border border-red-500/30'}`}>
                      <div className="text-sm text-gray-400 mb-1">Affects Entities</div>
                      <div className={phenomenon.interactions.affectsEntities ? 'text-green-400' : 'text-red-400'}>
                        {phenomenon.interactions.affectsEntities ? '✓ Yes' : '✕ No'}
                      </div>
                    </div>
                    <div className={`rounded-lg p-3 text-center ${phenomenon.interactions.affectsPOIs ? 'bg-green-500/20 border border-green-500/30' : 'bg-red-500/20 border border-red-500/30'}`}>
                      <div className="text-sm text-gray-400 mb-1">Affects NPCs</div>
                      <div className={phenomenon.interactions.affectsPOIs ? 'text-green-400' : 'text-red-400'}>
                        {phenomenon.interactions.affectsPOIs ? '✓ Yes' : '✕ No'}
                      </div>
                    </div>
                    <div className={`rounded-lg p-3 text-center ${phenomenon.interactions.blocksTravel ? 'bg-red-500/20 border border-red-500/30' : 'bg-green-500/20 border border-green-500/30'}`}>
                      <div className="text-sm text-gray-400 mb-1">Blocks Travel</div>
                      <div className={phenomenon.interactions.blocksTravel ? 'text-red-400' : 'text-green-400'}>
                        {phenomenon.interactions.blocksTravel ? '⚠️ Yes' : '✓ No'}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Spawn Conditions (DM Only) */}
              {userIsDM && phenomenon.spawnConditions && (
                <div className="bg-amber-900/20 rounded-lg p-4 border border-amber-500/30">
                  <div className="text-sm text-amber-300 font-semibold mb-3">🎲 SPAWN CONDITIONS (DM)</div>
                  <div className="space-y-2">
                    <div>
                      <span className="text-gray-500">Min Danger Level:</span>
                      <span className="text-white ml-2">{phenomenon.spawnConditions.minimumDangerLevel}</span>
                    </div>
                    {phenomenon.spawnConditions.conflictingPhenomena?.length > 0 && (
                      <div>
                        <span className="text-gray-500">Conflicts with:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {phenomenon.spawnConditions.conflictingPhenomena.map((p, i) => (
                            <span key={i} className="px-2 py-0.5 rounded text-xs bg-red-500/20 text-red-300">{formatName(p)}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* EFFECTS TAB */}
          {activeTab === 'effects' && (
            <div className="space-y-6">
              <div className="text-xl font-bold text-red-400 mb-3">⚡ Effects ({phenomenon.effects?.length || 0})</div>
              
              {phenomenon.effects?.map((effect, idx) => (
                <div key={idx} className={`rounded-lg p-4 border ${getEffectTypeColor(effect.type)}`}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-white font-bold capitalize">{effect.type} Effect</span>
                    <span className="px-3 py-1 rounded-lg text-sm bg-black/30 text-gray-300">
                      ⏱️ {effect.duration}
                    </span>
                  </div>
                  <p className="text-gray-300 mb-3">{effect.description}</p>
                  {userIsDM && effect.mechanical && (
                    <div className="bg-black/30 rounded p-3 border border-white/10">
                      <div className="text-xs text-gray-500 mb-1">MECHANICAL (DM)</div>
                      <p className="text-gray-300 text-sm">{effect.mechanical}</p>
                    </div>
                  )}
                </div>
              ))}

              {/* Environmental Effects */}
              {phenomenon.environmentalEffects && 
              (phenomenon.environmentalEffects.modifyLighting !== null || 
              phenomenon.environmentalEffects.modifyTemperature !== null ||
              phenomenon.environmentalEffects.addAtmosphere ||
              phenomenon.environmentalEffects.removeAtmosphere) &&
              (
                <div className="bg-green-900/20 rounded-lg p-4 border border-green-500/30">
                  <div className="text-sm text-green-300 font-semibold mb-3">🌡️ ENVIRONMENTAL MODIFICATIONS</div>
                  <div className="grid grid-cols-2 gap-4">
                    {phenomenon.environmentalEffects.modifyLighting !== null && (
                      <div className="bg-black/30 rounded p-3">
                        <div className="text-xs text-gray-500 mb-1">Lighting</div>
                        <div className="text-white font-bold">Set to {phenomenon.environmentalEffects.modifyLighting}</div>
                      </div>
                    )}
                    {phenomenon.environmentalEffects.modifyTemperature !== null && (
                      <div className="bg-black/30 rounded p-3">
                        <div className="text-xs text-gray-500 mb-1">Temperature</div>
                        <div className="text-white font-bold">
                          {phenomenon.environmentalEffects.modifyTemperature > 0 ? '+' : ''}{phenomenon.environmentalEffects.modifyTemperature}°F
                        </div>
                      </div>
                    )}
                    {phenomenon.environmentalEffects.addAtmosphere && (
                      <div className="bg-black/30 rounded p-3">
                        <div className="text-xs text-gray-500 mb-1">Adds Atmosphere</div>
                        <div className="text-orange-400 font-bold">{phenomenon.environmentalEffects.addAtmosphere}</div>
                      </div>
                    )}
                    {phenomenon.environmentalEffects.removeAtmosphere && (
                      <div className="bg-black/30 rounded p-3">
                        <div className="text-xs text-gray-500 mb-1">Removes Hazards</div>
                        <div className="text-green-400 font-bold">Yes</div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* COUNTERPLAY TAB */}
          {activeTab === 'counterplay' && (
            <div className="space-y-6">
              <div className="text-xl font-bold text-green-400 mb-3">🛡️ Counterplay Options</div>

              {/* Avoidance */}
              <div className={`rounded-lg p-4 border ${phenomenon.counterplay?.canBeAvoided ? 'bg-green-900/20 border-green-500/30' : 'bg-red-900/20 border-red-500/30'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-bold">Can Be Avoided</span>
                  <span className={phenomenon.counterplay?.canBeAvoided ? 'text-green-400' : 'text-red-400'}>
                    {phenomenon.counterplay?.canBeAvoided ? '✓ Yes' : '✕ No'}
                  </span>
                </div>
                {phenomenon.counterplay?.avoidanceMethod && (
                  <p className="text-gray-300">{phenomenon.counterplay.avoidanceMethod}</p>
                )}
              </div>

              {/* Resistance */}
              <div className={`rounded-lg p-4 border ${phenomenon.counterplay?.canBeResisted ? 'bg-blue-900/20 border-blue-500/30' : 'bg-red-900/20 border-red-500/30'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-bold">Can Be Resisted</span>
                  <span className={phenomenon.counterplay?.canBeResisted ? 'text-blue-400' : 'text-red-400'}>
                    {phenomenon.counterplay?.canBeResisted ? '✓ Yes' : '✕ No'}
                  </span>
                </div>
                {phenomenon.counterplay?.resistanceCheck && (
                  <div className="bg-black/30 rounded p-3 mb-3">
                    <span className="text-gray-500">Check:</span>
                    <span className="text-cyan-400 ml-2 font-medium">{phenomenon.counterplay.resistanceCheck}</span>
                  </div>
                )}
                {phenomenon.counterplay?.resistanceOutcomes && (
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-green-500/10 rounded p-2 border border-green-500/30">
                        <div className="text-xs text-green-400 font-semibold">Success</div>
                        <div className="text-gray-300 text-sm">{phenomenon.counterplay.resistanceOutcomes.success}</div>
                      </div>
                      <div className="bg-red-500/10 rounded p-2 border border-red-500/30">
                        <div className="text-xs text-red-400 font-semibold">Failure</div>
                        <div className="text-gray-300 text-sm">{phenomenon.counterplay.resistanceOutcomes.failure}</div>
                      </div>
                    </div>
                    {(phenomenon.counterplay.resistanceOutcomes.advantage || phenomenon.counterplay.resistanceOutcomes.triumph) && (
                      <div className="grid grid-cols-2 gap-2">
                        {phenomenon.counterplay.resistanceOutcomes.advantage && (
                          <div className="bg-blue-500/10 rounded p-2 border border-blue-500/30">
                            <div className="text-xs text-blue-400 font-semibold">Advantage</div>
                            <div className="text-gray-300 text-sm">{phenomenon.counterplay.resistanceOutcomes.advantage}</div>
                          </div>
                        )}
                        {phenomenon.counterplay.resistanceOutcomes.triumph && (
                          <div className="bg-yellow-500/10 rounded p-2 border border-yellow-500/30">
                            <div className="text-xs text-yellow-400 font-semibold">Triumph</div>
                            <div className="text-gray-300 text-sm">{phenomenon.counterplay.resistanceOutcomes.triumph}</div>
                          </div>
                        )}
                      </div>
                    )}
                    {(phenomenon.counterplay.resistanceOutcomes.threat || phenomenon.counterplay.resistanceOutcomes.despair) && (
                      <div className="grid grid-cols-2 gap-2">
                        {phenomenon.counterplay.resistanceOutcomes.threat && (
                          <div className="bg-orange-500/10 rounded p-2 border border-orange-500/30">
                            <div className="text-xs text-orange-400 font-semibold">Threat</div>
                            <div className="text-gray-300 text-sm">{phenomenon.counterplay.resistanceOutcomes.threat}</div>
                          </div>
                        )}
                        {phenomenon.counterplay.resistanceOutcomes.despair && (
                          <div className="bg-purple-500/10 rounded p-2 border border-purple-500/30">
                            <div className="text-xs text-purple-400 font-semibold">Despair</div>
                            <div className="text-gray-300 text-sm">{phenomenon.counterplay.resistanceOutcomes.despair}</div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Ending */}
              <div className={`rounded-lg p-4 border ${phenomenon.counterplay?.canBeEnded ? 'bg-cyan-900/20 border-cyan-500/30' : 'bg-red-900/20 border-red-500/30'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-bold">Can Be Ended Early</span>
                  <span className={phenomenon.counterplay?.canBeEnded ? 'text-cyan-400' : 'text-red-400'}>
                    {phenomenon.counterplay?.canBeEnded ? '✓ Yes' : '✕ No'}
                  </span>
                </div>
                {phenomenon.counterplay?.endingMethod && (
                  <p className="text-gray-300">{phenomenon.counterplay.endingMethod}</p>
                )}
              </div>

              {/* Protective Items */}
              {phenomenon.counterplay?.protectiveItems?.length > 0 && (
                <div className="bg-amber-900/20 rounded-lg p-4 border border-amber-500/30">
                  <div className="text-sm text-amber-300 font-semibold mb-3">🛡️ PROTECTIVE ITEMS</div>
                  <div className="flex flex-wrap gap-2">
                    {phenomenon.counterplay.protectiveItems.map((item, idx) => (
                      <span key={idx} className="px-3 py-1 rounded-lg text-sm bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {formatName(item)}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* INDICATORS TAB */}
          {activeTab === 'indicators' && (
            <div className="space-y-6">
              <div className="text-xl font-bold text-cyan-400 mb-3">👁️ Warning Signs & Indicators</div>

              {phenomenon.indicators?.visual && (
                <div className="bg-blue-900/20 rounded-lg p-4 border border-blue-500/30">
                  <div className="text-sm text-blue-300 font-semibold mb-2">👁️ VISUAL</div>
                  <p className="text-gray-300">{phenomenon.indicators.visual}</p>
                </div>
              )}

              {phenomenon.indicators?.audio && (
                <div className="bg-purple-900/20 rounded-lg p-4 border border-purple-500/30">
                  <div className="text-sm text-purple-300 font-semibold mb-2">👂 AUDIO</div>
                  <p className="text-gray-300">{phenomenon.indicators.audio}</p>
                </div>
              )}

              {phenomenon.indicators?.environmental && (
                <div className="bg-green-900/20 rounded-lg p-4 border border-green-500/30">
                  <div className="text-sm text-green-300 font-semibold mb-2">🌡️ ENVIRONMENTAL</div>
                  <p className="text-gray-300">{phenomenon.indicators.environmental}</p>
                </div>
              )}
            </div>
          )}

          {/* VARIANTS TAB (DM Only) */}
          {activeTab === 'variants' && userIsDM && (
            <div className="space-y-6">
              <div className="text-xl font-bold text-purple-400 mb-3">🔀 Variants ({phenomenon.variants?.length || 0})</div>
              
              {phenomenon.variants?.length > 0 ? (
                phenomenon.variants.map((variant, idx) => (
                  <div key={idx} className="bg-black/30 rounded-lg p-4 border border-purple-500/30">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-white font-bold text-lg">{variant.name}</h4>
                      <span className="px-3 py-1 rounded-lg text-sm bg-purple-500/20 text-purple-300">
                        {variant.spawnChance}% spawn chance
                      </span>
                    </div>
                    <p className="text-gray-400 mb-3">{variant.description}</p>
                    
                    {variant.changes && (
                      <div className="bg-black/30 rounded p-3">
                        <div className="text-xs text-gray-500 mb-2">CHANGES FROM BASE</div>
                        {variant.changes.severity !== undefined && (
                          <div className="text-sm">
                            <span className="text-gray-500">Severity:</span>
                            <span className={`ml-2 ${getSeverityColor(variant.changes.severity)}`}>
                              {getSeverityLabel(variant.changes.severity)} ({variant.changes.severity}/5)
                            </span>
                          </div>
                        )}
                        {variant.changes.effects && (
                          <div className="mt-2">
                            <span className="text-gray-500 text-sm">Modified Effects:</span>
                            <div className="mt-1 space-y-1">
                              {variant.changes.effects.map((eff, eIdx) => (
                                <div key={eIdx} className="text-gray-300 text-sm bg-black/30 rounded p-2">
                                  <span className="capitalize">{eff.type}:</span> {eff.mechanical || eff.description}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-gray-500 text-center py-8">No variants defined</div>
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
              {phenomenon.dmNotes?.howToRun && (
                <div className="bg-black/30 rounded-lg p-4 border border-white/10">
                  <div className="text-sm text-gray-400 font-semibold mb-2">HOW TO RUN</div>
                  <p className="text-gray-300 leading-relaxed whitespace-pre-line">{phenomenon.dmNotes.howToRun}</p>
                </div>
              )}

              {/* Narrative Hooks */}
              {phenomenon.dmNotes?.narrativeHooks && (
                <div className="bg-green-900/20 rounded-lg p-4 border border-green-500/30">
                  <div className="text-sm text-green-300 font-semibold mb-2">📖 NARRATIVE HOOKS</div>
                  <p className="text-gray-300 leading-relaxed whitespace-pre-line">{phenomenon.dmNotes.narrativeHooks}</p>
                </div>
              )}

              {/* Common Mistakes */}
              {phenomenon.dmNotes?.commonMistakes && (
                <div className="bg-red-900/20 rounded-lg p-4 border border-red-500/30">
                  <div className="text-sm text-red-300 font-semibold mb-2">⚠️ COMMON MISTAKES</div>
                  <p className="text-gray-300 leading-relaxed whitespace-pre-line">{phenomenon.dmNotes.commonMistakes}</p>
                </div>
              )}

              {/* Tags */}
              {phenomenon.tags?.length > 0 && (
                <div className="bg-black/30 rounded-lg p-4 border border-white/10">
                  <div className="text-sm text-gray-400 font-semibold mb-3">🏷️ TAGS</div>
                  <div className="flex flex-wrap gap-2">
                    {phenomenon.tags.map((tag, idx) => (
                      <span key={idx} className="px-3 py-1 rounded-lg text-sm font-medium bg-gray-500/20 text-gray-300 border border-gray-500/30">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Session Notes */}
              <div className="bg-blue-900/20 rounded-lg p-4 border border-blue-500/30">
                <div className="text-sm text-blue-400 font-semibold mb-2">📝 SESSION NOTES</div>
                <p className="text-xs text-gray-500 mb-3">Notes for this session ({sessionId}). Only you can see these.</p>
                <textarea
                  value={sessionNoteText}
                  onChange={(e) => setSessionNoteText(e.target.value)}
                  placeholder="Add notes for this phenomenon in the current session..."
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