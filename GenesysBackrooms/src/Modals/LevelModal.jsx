import React, { useState, useEffect } from 'react';
import { getActiveSession } from '../Structural/Session_Utils';

export default function LevelModal({ level, onClose, userIsDM, onToggleVisibility, onUpdateSessionNotes }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedItems, setExpandedItems] = useState({});
  const [sessionNoteText, setSessionNoteText] = useState('');
  const [isSavingNote, setIsSavingNote] = useState(false);
  const sessionId = getActiveSession();

  // Initialize session note text from level data
  useEffect(() => {
    if (level?.dmNotes?.sessionNotes?.[sessionId]) {
      setSessionNoteText(level.dmNotes.sessionNotes[sessionId]);
    } else {
      setSessionNoteText('');
    }
  }, [level, sessionId]);

  const handleSaveSessionNote = async () => {
    if (!onUpdateSessionNotes) return;
    setIsSavingNote(true);
    try {
      await onUpdateSessionNotes(level.id, sessionId, sessionNoteText);
    } catch (error) {
      console.error('Error saving session note:', error);
    }
    setIsSavingNote(false);
  };

  if (!level) return null;

  const toggleExpanded = (key) => {
    setExpandedItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleToggleVisibility = async () => {
    if (onToggleVisibility) {
      await onToggleVisibility(level.id, level.isHidden);
    }
  };

  const formatName = (str) => {
    if (!str) return '';
    return str.split(/[-_]/).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const getClassificationColor = (classification) => {
    switch (classification) {
      case 'Safe': return 'text-green-400';
      case 'Habitable': return 'text-blue-400';
      case 'Dangerous': return 'text-orange-400';
      case 'Deadly': return 'text-red-400';
      case 'Unconfirmed': return 'text-gray-400';
      default: return 'text-gray-400';
    }
  };

  const getDangerColor = (dangerLevel) => {
    if (dangerLevel <= 2) return 'text-green-400';
    if (dangerLevel <= 4) return 'text-yellow-400';
    if (dangerLevel <= 6) return 'text-orange-400';
    if (dangerLevel <= 8) return 'text-red-400';
    return 'text-red-600';
  };

  const getLightingDescription = (value) => {
    if (value <= 0) return 'Pitch Black';
    if (value <= 2) return 'Near Darkness';
    if (value <= 4) return 'Dim';
    if (value <= 6) return 'Moderate';
    if (value <= 8) return 'Well-Lit';
    return 'Extremely Bright';
  };

  const getTemperatureDescription = (value) => {
    if (value <= 0) return 'Extreme Cold';
    if (value <= 2) return 'Very Cold';
    if (value <= 4) return 'Cold';
    if (value <= 6) return 'Comfortable';
    if (value <= 8) return 'Warm/Hot';
    return 'Extreme Heat';
  };

  const getNavigationColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400';
      case 'moderate': return 'text-yellow-400';
      case 'disorienting': return 'text-orange-400';
      case 'extremely_disorienting': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'irritating': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
      case 'harmful': return 'text-orange-400 bg-orange-500/10 border-orange-500/30';
      case 'severe': return 'text-red-400 bg-red-500/10 border-red-500/30';
      case 'deadly': return 'text-red-600 bg-red-600/10 border-red-600/30';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
    }
  };

  // Component for rendering variants
  const VariantDisplay = ({ variants, title }) => {
    if (!variants) return null;
    return (
      <div className="mt-3 space-y-2">
        <div className="text-xs text-gray-500 uppercase font-semibold">{title || 'Variants'}</div>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(variants).map(([category, options]) => (
            <div key={category} className="bg-black/20 rounded p-2">
              <div className="text-xs text-purple-400 font-medium mb-1 capitalize">{category}</div>
              <div className="space-y-1">
                {options.slice(0, 3).map((opt, idx) => (
                  <div key={idx} className="flex justify-between text-xs">
                    <span className="text-gray-400">{opt.variant || opt.description?.substring(0, 20)}</span>
                    <span className="text-gray-500">{opt.weight}%</span>
                  </div>
                ))}
                {options.length > 3 && <div className="text-xs text-gray-600">+{options.length - 3} more</div>}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Component for environmental/atmospheric effects
  const EffectsDisplay = ({ effects, type }) => {
    if (!effects) return null;
    const effectColor = type === 'environmental' ? 'cyan' : 'purple';
    return (
      <div className="mt-3 border-t border-white/5 pt-3">
        <div className="text-xs text-gray-500 uppercase font-semibold mb-2">{type} Effects</div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {effects.temperature && (
            <div className="bg-blue-500/10 rounded p-2">
              <span className="text-blue-400">Temp:</span>
              <span className="text-gray-300 ml-1">{effects.temperature.change}</span>
            </div>
          )}
          {effects.humidity && (
            <div className="bg-cyan-500/10 rounded p-2">
              <span className="text-cyan-400">Humidity:</span>
              <span className="text-gray-300 ml-1">{effects.humidity.change}</span>
            </div>
          )}
          {effects.lighting && effects.lighting.value !== 0 && (
            <div className="bg-yellow-500/10 rounded p-2">
              <span className="text-yellow-400">Light:</span>
              <span className="text-gray-300 ml-1">{effects.lighting.value > 0 ? '+' : ''}{effects.lighting.value}</span>
            </div>
          )}
          {effects.sound && (
            <div className="bg-purple-500/10 rounded p-2">
              <span className="text-purple-400">Sound:</span>
              <span className="text-gray-300 ml-1">{effects.sound.description?.substring(0, 25)}...</span>
            </div>
          )}
          {effects.smell && (
            <div className="bg-green-500/10 rounded p-2">
              <span className="text-green-400">Smell:</span>
              <span className="text-gray-300 ml-1">{effects.smell.intensity}</span>
            </div>
          )}
          {effects.psychological && (
            <div className="bg-red-500/10 rounded p-2">
              <span className="text-red-400">Psych:</span>
              <span className="text-gray-300 ml-1">{effects.psychological.effect} ({effects.psychological.severity})</span>
            </div>
          )}
          {effects.other && (
            <div className="col-span-2 bg-amber-500/10 rounded p-2">
              <span className="text-amber-400">{effects.other.effectName}:</span>
              <span className="text-gray-300 ml-1">{effects.other.description}</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Component for exit effects
  const ExitEffectsDisplay = ({ exitEffects }) => {
    if (!exitEffects) return null;
    return (
      <div className="mt-2 space-y-1">
        <div className="text-xs text-gray-500 uppercase">Exit Effects</div>
        <div className="grid grid-cols-2 gap-1 text-xs">
          {exitEffects.sound && (
            <div className="bg-purple-500/10 rounded px-2 py-1">
              <span className="text-purple-400">🔊</span>
              <span className="text-gray-400 ml-1">{(exitEffects.sound.probability * 100).toFixed(0)}%</span>
            </div>
          )}
          {exitEffects.smell && (
            <div className="bg-green-500/10 rounded px-2 py-1">
              <span className="text-green-400">👃</span>
              <span className="text-gray-400 ml-1">{(exitEffects.smell.probability * 100).toFixed(0)}%</span>
            </div>
          )}
          {exitEffects.visibility && (
            <div className="bg-yellow-500/10 rounded px-2 py-1">
              <span className="text-yellow-400">👁️</span>
              <span className="text-gray-400 ml-1">{exitEffects.visibility.description?.substring(0, 20)}</span>
            </div>
          )}
          {exitEffects.accessibility && (
            <div className="col-span-2 bg-red-500/10 rounded px-2 py-1">
              <span className="text-red-400">⚠️</span>
              <span className="text-gray-400 ml-1">{exitEffects.accessibility.mechanicalEffect}</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  const playerTabs = [
    { id: 'overview', label: 'Overview', icon: '📋' },
    { id: 'environment', label: 'Environment', icon: '🌡️' },
    { id: 'appearance', label: 'Appearance', icon: '🎨' },
    { id: 'spatial', label: 'Spatial', icon: '🗺️' },
    { id: 'spawns', label: 'Spawns', icon: '👾' },
    { id: 'exits', label: 'Exits', icon: '🚪' },
  ];

  const dmTabs = [
    { id: 'dm-notes', label: 'DM Notes', icon: '🎲' },
  ];

  const allTabs = userIsDM ? [...playerTabs, ...dmTabs] : playerTabs;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden border border-white/10">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 p-6 border-b border-white/10">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-purple-400 font-mono text-sm">Level {level.levelNumber}</span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">{level.levelName}</h2>
              <div className="flex items-center space-x-4">
                <span className={`text-lg font-semibold ${getClassificationColor(level.classification)}`}>
                  {level.classification}
                </span>
                <span className="text-gray-400">•</span>
                <span className={`text-lg font-bold ${getDangerColor(level.dangerLevel)}`}>
                  Danger {level.dangerLevel}/10
                </span>
                <span className="text-gray-400">•</span>
                <span className="text-purple-400 font-medium capitalize">{level.levelType}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {userIsDM && (
                <button
                  onClick={handleToggleVisibility}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all
                    ${level.isHidden 
                      ? 'bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/50' 
                      : 'bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/50'
                    }`}
                >
                  {level.isHidden ? <span>👁️ Show</span> : <span>🚫 Hide</span>}
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
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-black/30 rounded-lg p-4 border border-white/10">
                  <div className="text-sm text-gray-400 mb-1">Classification</div>
                  <div className={`text-2xl font-bold ${getClassificationColor(level.classification)}`}>{level.classification}</div>
                </div>
                <div className="bg-black/30 rounded-lg p-4 border border-white/10">
                  <div className="text-sm text-gray-400 mb-1">Danger Level</div>
                  <div className={`text-2xl font-bold ${getDangerColor(level.dangerLevel)}`}>{level.dangerLevel}/10</div>
                </div>
                <div className="bg-black/30 rounded-lg p-4 border border-white/10">
                  <div className="text-sm text-gray-400 mb-1">Zone Time</div>
                  <div className="text-2xl font-bold text-blue-400">~{level.averageZoneTime || 5} min</div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-lg p-4 border border-purple-500/30">
                <div className="text-sm text-purple-300 font-semibold mb-2">DESCRIPTION</div>
                <p className="text-gray-300 leading-relaxed">{level.description}</p>
              </div>

              {level.tags?.length > 0 && (
                <div className="bg-black/30 rounded-lg p-4 border border-white/10">
                  <div className="text-sm text-gray-400 font-semibold mb-3">TAGS</div>
                  <div className="flex flex-wrap gap-2">
                    {level.tags.map((tag, idx) => (
                      <span key={idx} className="px-3 py-1 rounded-lg text-sm font-medium bg-purple-500/10 text-purple-300 border border-purple-500/30">{tag}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Ambient Effects Summary */}
              {level.ambientEffects && (
                <div className="bg-cyan-900/20 rounded-lg p-4 border border-cyan-500/30">
                  <div className="text-sm text-cyan-300 font-semibold mb-3">AMBIENT ATMOSPHERE</div>
                  <div className="space-y-3 text-sm">
                    {level.ambientEffects.sound && (
                      <div><span className="text-gray-400">Sound:</span> <span className="text-gray-300">{level.ambientEffects.sound.description}</span></div>
                    )}
                    {level.ambientEffects.smell?.primary && (
                      <div><span className="text-gray-400">Smell:</span> <span className="text-gray-300">{level.ambientEffects.smell.primary.description}</span>
                        {level.ambientEffects.smell.secondary && <span className="text-gray-500 ml-2">+ {level.ambientEffects.smell.secondary.description}</span>}
                      </div>
                    )}
                    {level.ambientEffects.temperature && (
                      <div><span className="text-gray-400">Temperature:</span> <span className="text-gray-300">{level.ambientEffects.temperature.description}</span></div>
                    )}
                    {level.ambientEffects.airQuality && (
                      <div><span className="text-gray-400">Air Quality:</span> <span className="text-gray-300">{level.ambientEffects.airQuality.description}</span>
                        {level.ambientEffects.airQuality.mechanicalEffect && <div className="text-orange-300 mt-1 text-xs">⚠️ {level.ambientEffects.airQuality.mechanicalEffect}</div>}
                      </div>
                    )}
                    {level.ambientEffects.visualEffects?.enabled && (
                      <div><span className="text-gray-400">Visual:</span> <span className="text-gray-300">{level.ambientEffects.visualEffects.triggerCondition}</span>
                        {level.ambientEffects.visualEffects.mechanicalEffect && <div className="text-orange-300 mt-1 text-xs">⚠️ {level.ambientEffects.visualEffects.mechanicalEffect}</div>}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ENVIRONMENT TAB */}
          {activeTab === 'environment' && (
            <div className="space-y-6">
              {/* Environmental Conditions */}
              <div>
                <div className="text-xl font-bold text-cyan-400 mb-3">🌡️ Environmental Conditions</div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-black/30 border border-yellow-500/30 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-yellow-400 font-bold">☀️ Lighting</span>
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">{level.lightingMin} - {level.lightingMax}</div>
                    <div className="text-sm text-gray-400">{getLightingDescription(level.lightingMin)} to {getLightingDescription(level.lightingMax)}</div>
                  </div>
                  <div className="bg-black/30 border border-blue-500/30 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-blue-400 font-bold">🌡️ Temperature</span>
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">{level.temperatureMin} - {level.temperatureMax}</div>
                    <div className="text-sm text-gray-400">
                      {level.temperatureRangeF && `${level.temperatureRangeF.min}°F - ${level.temperatureRangeF.max}°F`}
                      {level.temperatureRangeC && ` (${level.temperatureRangeC.min}°C - ${level.temperatureRangeC.max}°C)`}
                    </div>
                  </div>
                </div>
              </div>

              {/* Atmospheric Hazards */}
              {level.atmosphericHazards?.length > 0 ? (
                <div>
                  <div className="text-xl font-bold text-red-400 mb-3">⚠️ Atmospheric Hazards</div>
                  <div className="space-y-2">
                    {level.atmosphericHazards.map((hazard, idx) => (
                      <div key={idx} className={`rounded-lg p-3 border ${getSeverityColor(hazard.severity)}`}>
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{formatName(hazard.type)}</span>
                          <span className="text-xs font-bold uppercase">{hazard.severity}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                  <span className="text-green-300">✓ No atmospheric hazards - air is safe to breathe</span>
                </div>
              )}

              {/* Environmental Details */}
              {level.environmentalDetails?.available?.length > 0 && (
                <div>
                  <div className="text-xl font-bold text-emerald-400 mb-3">🏗️ Environmental Details</div>
                  <div className="text-sm text-gray-400 mb-3">
                    Spawn: {level.environmentalDetails.spawnProbability}% | Max: {level.environmentalDetails.maxSimultaneous} | Power: {level.environmentalDetails.hasElectricity ? 'Yes' : 'No'}
                  </div>
                  <div className="space-y-3">
                    {level.environmentalDetails.available.map((item, idx) => (
                      <div key={idx} className="bg-black/30 border border-emerald-500/20 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="text-white font-bold">{item.name}</h4>
                            <span className="text-xs text-emerald-400 uppercase">{item.category}</span>
                          </div>
                          <span className="text-emerald-400 text-sm">{item.weight}%</span>
                        </div>
                        <p className="text-gray-400 text-sm mb-2">{item.baseDescription}</p>
                        {item.mechanicalEffect && <p className="text-orange-300 text-xs">⚡ {item.mechanicalEffect}</p>}
                        
                        <button onClick={() => toggleExpanded(`env-${idx}`)} className="text-xs text-purple-400 mt-2 hover:text-purple-300">
                          {expandedItems[`env-${idx}`] ? '▼ Hide Details' : '▶ Show Variants & Effects'}
                        </button>
                        
                        {expandedItems[`env-${idx}`] && (
                          <>
                            <VariantDisplay variants={item.variants} />
                            <EffectsDisplay effects={item.environmentalEffects} type="Environmental" />
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Atmospheric Details */}
              {level.atmosphericDetails?.available?.length > 0 && (
                <div>
                  <div className="text-xl font-bold text-violet-400 mb-3">🌫️ Atmospheric Details</div>
                  <div className="text-sm text-gray-400 mb-3">
                    Spawn: {level.atmosphericDetails.spawnProbability}% | Max: {level.atmosphericDetails.maxSimultaneous}
                  </div>
                  <div className="space-y-3">
                    {level.atmosphericDetails.available.map((item, idx) => (
                      <div key={idx} className="bg-black/30 border border-violet-500/20 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="text-white font-bold">{item.name}</h4>
                            <span className="text-xs text-violet-400 uppercase">{item.category}</span>
                          </div>
                          <span className="text-violet-400 text-sm">{item.weight}%</span>
                        </div>
                        <p className="text-gray-400 text-sm mb-2">{item.baseDescription}</p>
                        {item.narrativeImpact && <p className="text-purple-300 text-xs italic">"{item.narrativeImpact}"</p>}
                        
                        <button onClick={() => toggleExpanded(`atm-${idx}`)} className="text-xs text-purple-400 mt-2 hover:text-purple-300">
                          {expandedItems[`atm-${idx}`] ? '▼ Hide Details' : '▶ Show Variants & Effects'}
                        </button>
                        
                        {expandedItems[`atm-${idx}`] && (
                          <>
                            <VariantDisplay variants={item.variants} />
                            <EffectsDisplay effects={item.atmosphericEffects} type="Atmospheric" />
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* APPEARANCE TAB */}
          {activeTab === 'appearance' && (
            <div className="space-y-6">
              {level.physicalAppearance && (
                <>
                  {level.physicalAppearance.wallMaterial?.length > 0 && (
                    <div>
                      <div className="text-lg font-bold text-amber-400 mb-3">Wall Materials</div>
                      <div className="space-y-2">
                        {level.physicalAppearance.wallMaterial.map((item, idx) => (
                          <div key={idx} className="bg-black/30 border border-amber-500/30 rounded-lg p-3 flex justify-between items-center">
                            <span className="text-white">{item.material}</span>
                            <span className="text-amber-400 text-sm font-medium">{item.weight}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {level.physicalAppearance.wallPattern?.length > 0 && (
                    <div>
                      <div className="text-lg font-bold text-purple-400 mb-3">Wall Patterns</div>
                      <div className="space-y-2">
                        {level.physicalAppearance.wallPattern.map((item, idx) => (
                          <div key={idx} className="bg-black/30 border border-purple-500/30 rounded-lg p-3 flex justify-between items-center">
                            <span className="text-white">{item.pattern}</span>
                            <span className="text-purple-400 text-sm font-medium">{item.weight}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {level.physicalAppearance.floorMaterial?.length > 0 && (
                    <div>
                      <div className="text-lg font-bold text-cyan-400 mb-3">Floor Materials</div>
                      <div className="space-y-2">
                        {level.physicalAppearance.floorMaterial.map((item, idx) => (
                          <div key={idx} className="bg-black/30 border border-cyan-500/30 rounded-lg p-3 flex justify-between items-center">
                            <span className="text-white">{item.material}</span>
                            <span className="text-cyan-400 text-sm font-medium">{item.weight}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {level.physicalAppearance.floorCondition?.length > 0 && (
                    <div>
                      <div className="text-lg font-bold text-green-400 mb-3">Floor Conditions</div>
                      <div className="space-y-2">
                        {level.physicalAppearance.floorCondition.map((item, idx) => (
                          <div key={idx} className="bg-black/30 border border-green-500/30 rounded-lg p-3 flex justify-between items-center">
                            <span className="text-white">{item.condition}</span>
                            <span className="text-green-400 text-sm font-medium">{item.weight}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {level.physicalAppearance.ceilingType?.length > 0 && (
                    <div>
                      <div className="text-lg font-bold text-blue-400 mb-3">Ceiling Types</div>
                      <div className="space-y-2">
                        {level.physicalAppearance.ceilingType.map((item, idx) => (
                          <div key={idx} className="bg-black/30 border border-blue-500/30 rounded-lg p-3 flex justify-between items-center">
                            <span className="text-white">{item.type}</span>
                            <span className="text-blue-400 text-sm font-medium">{item.weight}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* SPATIAL TAB */}
          {activeTab === 'spatial' && (
            <div className="space-y-6">
              {level.spatialProperties && (
                <div>
                  <div className="text-xl font-bold text-cyan-400 mb-3">🗺️ Spatial Properties</div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-black/30 border border-white/10 rounded-lg p-4">
                      <div className="text-sm text-gray-400 mb-1">Euclidean</div>
                      <div className={`text-xl font-bold ${level.spatialProperties.euclidean ? 'text-green-400' : 'text-red-400'}`}>
                        {level.spatialProperties.euclidean ? 'Yes' : 'No'}
                      </div>
                    </div>
                    <div className="bg-black/30 border border-white/10 rounded-lg p-4">
                      <div className="text-sm text-gray-400 mb-1">Topology</div>
                      <div className="text-xl font-bold text-purple-400 capitalize">{formatName(level.spatialProperties.topology)}</div>
                    </div>
                    <div className="bg-black/30 border border-white/10 rounded-lg p-4">
                      <div className="text-sm text-gray-400 mb-1">Navigation</div>
                      <div className={`text-xl font-bold ${getNavigationColor(level.spatialProperties.navigationDifficulty)}`}>
                        {formatName(level.spatialProperties.navigationDifficulty)}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {level.roomDimensions && (
                <div>
                  <div className="text-xl font-bold text-amber-400 mb-3">📐 Zone Dimensions</div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-black/30 border border-amber-500/30 rounded-lg p-4">
                      <div className="text-sm text-gray-400 mb-1">Width</div>
                      <div className="text-xl font-bold text-white">{level.roomDimensions.width.min} - {level.roomDimensions.width.max}m</div>
                    </div>
                    <div className="bg-black/30 border border-amber-500/30 rounded-lg p-4">
                      <div className="text-sm text-gray-400 mb-1">Length</div>
                      <div className="text-xl font-bold text-white">{level.roomDimensions.length.min} - {level.roomDimensions.length.max}m</div>
                    </div>
                    <div className="bg-black/30 border border-amber-500/30 rounded-lg p-4">
                      <div className="text-sm text-gray-400 mb-1">Height</div>
                      <div className="text-xl font-bold text-white">{level.roomDimensions.height.min} - {level.roomDimensions.height.max}m</div>
                    </div>
                  </div>
                </div>
              )}

              {level.roomShapes?.length > 0 && (
                <div>
                  <div className="text-lg font-bold text-purple-400 mb-3">Zone Shapes</div>
                  <div className="flex flex-wrap gap-2">
                    {level.roomShapes.map((shape, idx) => (
                      <span key={idx} className="px-3 py-1.5 rounded-lg text-sm font-medium bg-purple-500/10 text-purple-300 border border-purple-500/30">
                        {formatName(shape)}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SPAWNS TAB */}
          {activeTab === 'spawns' && (
            <div className="space-y-4">
              {level.spawnTables && (
                <>
                  <div className="bg-black/30 border border-red-500/30 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-red-400 font-bold">👹 Entities</span>
                      <span className={`px-2 py-1 rounded text-xs font-bold ${level.spawnTables.entities?.enabled ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                        {level.spawnTables.entities?.enabled ? 'ENABLED' : 'DISABLED'}
                      </span>
                    </div>
                    {level.spawnTables.entities?.enabled && <div className="text-sm text-gray-300">Spawn: {level.spawnTables.entities.spawnProbability}%</div>}
                  </div>

                  <div className="bg-black/30 border border-cyan-500/30 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-cyan-400 font-bold">📦 Objects</span>
                      <span className={`px-2 py-1 rounded text-xs font-bold ${level.spawnTables.objects?.enabled ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                        {level.spawnTables.objects?.enabled ? 'ENABLED' : 'DISABLED'}
                      </span>
                    </div>
                    {level.spawnTables.objects?.enabled && <div className="text-sm text-gray-300">Spawn: {level.spawnTables.objects.spawnProbability}%</div>}
                  </div>

                  <div className="bg-black/30 border border-purple-500/30 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-purple-400 font-bold">📍 Points of Interest</span>
                      <span className={`px-2 py-1 rounded text-xs font-bold ${level.spawnTables.poi?.enabled ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                        {level.spawnTables.poi?.enabled ? 'ENABLED' : 'DISABLED'}
                      </span>
                    </div>
                    {level.spawnTables.poi?.enabled && <div className="text-sm text-gray-300">Spawn: {level.spawnTables.poi.spawnProbability}%</div>}
                  </div>

                  <div className="bg-black/30 border border-amber-500/30 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-amber-400 font-bold">⚡ Phenomena</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="bg-black/30 rounded p-2">
                        <div className="text-gray-400 text-xs mb-1">Level-Wide</div>
                        <span className={level.spawnTables.phenomena?.level_wide?.enabled ? 'text-green-400' : 'text-gray-500'}>
                          {level.spawnTables.phenomena?.level_wide?.enabled ? `${level.spawnTables.phenomena.level_wide.spawnProbability}%` : 'Disabled'}
                        </span>
                      </div>
                      <div className="bg-black/30 rounded p-2">
                        <div className="text-gray-400 text-xs mb-1">Zone-Specific</div>
                        <span className={level.spawnTables.phenomena?.room_specific?.enabled ? 'text-green-400' : 'text-gray-500'}>
                          {level.spawnTables.phenomena?.room_specific?.enabled ? `${level.spawnTables.phenomena.room_specific.spawnProbability}%` : 'Disabled'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-black/30 border border-blue-500/30 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-blue-400 font-bold">👥 Faction Encounters</span>
                      <span className={`px-2 py-1 rounded text-xs font-bold ${level.spawnTables.factionEncounters?.enabled ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                        {level.spawnTables.factionEncounters?.enabled ? 'ENABLED' : 'DISABLED'}
                      </span>
                    </div>
                    {level.spawnTables.factionEncounters?.enabled && (
                      <div className="space-y-1 text-sm">
                        <div className="text-gray-300">Spawn: {level.spawnTables.factionEncounters.spawnProbability}%</div>
                        <div className="text-gray-300">Members: {level.spawnTables.factionEncounters.memberCount?.min}-{level.spawnTables.factionEncounters.memberCount?.max}</div>
                        <div className="text-gray-300">Equipment: <span className="capitalize">{level.spawnTables.factionEncounters.equipmentLevel}</span></div>
                        {level.spawnTables.factionEncounters.missionTypes?.length > 0 && (
                          <div className="text-gray-300">
                            Mission Types: 
                            <span className="ml-1">{level.spawnTables.factionEncounters.missionTypes.map(m => formatName(m)).join(', ')}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {/* EXITS TAB */}
          {activeTab === 'exits' && (
            <div className="space-y-6">
              {/* Spawnable Exits */}
              {level.exits?.spawnable && (
                <div>
                  <div className="text-xl font-bold text-green-400 mb-3">🚪 Spawnable Exits</div>
                  
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="bg-black/30 border border-white/10 rounded-lg p-3 text-center">
                      <div className="text-sm text-gray-400 mb-1">Min</div>
                      <div className="text-xl font-bold text-white">{level.exits.spawnable.minExits}</div>
                    </div>
                    <div className="bg-black/30 border border-white/10 rounded-lg p-3 text-center">
                      <div className="text-sm text-gray-400 mb-1">Max</div>
                      <div className="text-xl font-bold text-white">{level.exits.spawnable.maxExits}</div>
                    </div>
                    <div className="bg-black/30 border border-white/10 rounded-lg p-3 text-center">
                      <div className="text-sm text-gray-400 mb-1">Status</div>
                      <div className={`text-xl font-bold ${level.exits.spawnable.enabled ? 'text-green-400' : 'text-red-400'}`}>
                        {level.exits.spawnable.enabled ? 'ON' : 'OFF'}
                      </div>
                    </div>
                  </div>

                  {level.exits.spawnable.destinationProbabilities && (
                    <div className="bg-black/30 border border-white/10 rounded-lg p-4 mb-4">
                      <div className="text-sm text-gray-400 font-semibold mb-2">DESTINATION PROBABILITIES</div>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between"><span>Same Level</span><span className="text-green-400">{(level.exits.spawnable.destinationProbabilities.sameLevel * 100).toFixed(0)}%</span></div>
                        <div className="flex justify-between"><span>Different Level</span><span className="text-blue-400">{(level.exits.spawnable.destinationProbabilities.differentLevel * 100).toFixed(0)}%</span></div>
                        <div className="flex justify-between"><span>Outpost</span><span className="text-purple-400">{(level.exits.spawnable.destinationProbabilities.outpost * 100).toFixed(0)}%</span></div>
                      </div>
                    </div>
                  )}

                  {/* Same Level Exit Types */}
                  {level.exits.spawnable.sameLevel?.exitTypes?.length > 0 && (
                    <div className="mb-4">
                      <div className="text-lg font-bold text-green-400 mb-3">Same Level Exit Types</div>
                      <div className="space-y-3">
                        {level.exits.spawnable.sameLevel.exitTypes.map((exitType, idx) => (
                          <div key={idx} className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 rounded-lg p-4 border border-green-500/30">
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="text-white font-bold">{formatName(exitType.type)}</h4>
                              <span className="text-green-400 text-sm">{exitType.weight}%</span>
                            </div>
                            <p className="text-gray-400 text-sm mb-2">{exitType.baseDescription}</p>
                            
                            <button onClick={() => toggleExpanded(`same-exit-${idx}`)} className="text-xs text-purple-400 hover:text-purple-300">
                              {expandedItems[`same-exit-${idx}`] ? '▼ Hide Details' : '▶ Show Variants & Effects'}
                            </button>
                            
                            {expandedItems[`same-exit-${idx}`] && (
                              <>
                                <VariantDisplay variants={exitType.variants} />
                                <ExitEffectsDisplay exitEffects={exitType.exitEffects} />
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Documented Level Exits */}
                  {level.exits.spawnable.documentedLevels?.length > 0 && (
                    <div>
                      <div className="text-lg font-bold text-blue-400 mb-3">Documented Level Exits</div>
                      <div className="space-y-3">
                        {level.exits.spawnable.documentedLevels.map((exit, idx) => (
                          <div key={idx} className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-lg p-4 border border-blue-500/30">
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="text-white font-bold">{exit.name}</h4>
                              <span className="text-blue-400 text-sm">{exit.spawnProbability}%</span>
                            </div>
                            <div className="text-sm text-gray-400 mb-2">→ {formatName(exit.destinationId)} ({exit.destinationType})</div>
                            <p className="text-sm text-gray-300 mb-2">{exit.description}</p>
                            
                            {exit.exitTypes?.length > 0 && (
                              <>
                                <button onClick={() => toggleExpanded(`doc-exit-${idx}`)} className="text-xs text-purple-400 hover:text-purple-300">
                                  {expandedItems[`doc-exit-${idx}`] ? '▼ Hide Exit Types' : `▶ Show ${exit.exitTypes.length} Exit Type(s)`}
                                </button>
                                
                                {expandedItems[`doc-exit-${idx}`] && (
                                  <div className="mt-3 space-y-2">
                                    {exit.exitTypes.map((et, etIdx) => (
                                      <div key={etIdx} className="bg-black/30 rounded-lg p-3 border border-blue-500/20">
                                        <div className="text-white font-medium mb-1">{formatName(et.type)}</div>
                                        <p className="text-gray-400 text-xs mb-2">{et.baseDescription}</p>
                                        <VariantDisplay variants={et.variants} />
                                        <ExitEffectsDisplay exitEffects={et.exitEffects} />
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Always Active Exits */}
              {level.exits?.alwaysActive?.length > 0 && (
                <div>
                  <div className="text-xl font-bold text-amber-400 mb-3">⚡ Always Active Exits</div>
                  <div className="space-y-3">
                    {level.exits.alwaysActive.map((exit, idx) => (
                      <div key={idx} className="bg-gradient-to-br from-amber-900/20 to-orange-900/20 rounded-lg p-4 border border-amber-500/30">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="text-white font-bold">{exit.name}</h4>
                          <span className="text-xs font-bold text-amber-400 bg-amber-500/20 px-2 py-1 rounded uppercase">{exit.method}</span>
                        </div>
                        <div className="text-sm text-gray-400 mb-2">→ {formatName(exit.destinationId)} ({exit.destinationType})</div>
                        <p className="text-sm text-gray-300 mb-2">{exit.description}</p>
                        {exit.playerAction && <p className="text-sm text-amber-300 italic mb-3">💡 {exit.playerAction}</p>}
                        
                        <button onClick={() => toggleExpanded(`always-${idx}`)} className="text-xs text-purple-400 hover:text-purple-300">
                          {expandedItems[`always-${idx}`] ? '▼ Hide Details' : '▶ Show Requirements, Checks & Outcomes'}
                        </button>
                        
                        {expandedItems[`always-${idx}`] && (
                          <div className="mt-3 space-y-3">
                            {/* Requirements */}
                            {exit.requirements && (
                              <div className="bg-black/30 rounded p-3">
                                <div className="text-xs text-gray-500 uppercase mb-2">Requirements</div>
                                {exit.requirements.tools?.map((tool, tIdx) => (
                                  <div key={tIdx} className="text-sm">
                                    <span className={tool.required ? 'text-red-400' : 'text-gray-400'}>
                                      {tool.required ? '⚠️ Required: ' : '◉ Optional: '}
                                    </span>
                                    <span className="text-white">{formatName(tool.type)}</span>
                                    <span className="text-gray-500 ml-2">- {tool.benefit}</span>
                                  </div>
                                ))}
                                {exit.requirements.time && (
                                  <div className="text-sm mt-1">
                                    <span className="text-cyan-400">⏱️ Time:</span>
                                    <span className="text-white ml-2">{exit.requirements.time.minutes} min</span>
                                    <span className="text-gray-500 ml-2">- {exit.requirements.time.description}</span>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Skill Check */}
                            {exit.skillCheck && (
                              <div className="bg-black/30 rounded p-3">
                                <div className="text-xs text-gray-500 uppercase mb-2">Skill Check</div>
                                <div className="text-sm">
                                  <span className="text-purple-400">{exit.skillCheck.skill}</span>
                                  <span className="text-gray-400 mx-2">|</span>
                                  <span className="text-yellow-400">{exit.skillCheck.difficulty}</span>
                                  <span className="text-gray-500 ml-2">- {exit.skillCheck.description}</span>
                                </div>
                              </div>
                            )}

                            {/* Modifiers */}
                            {exit.modifiers?.length > 0 && (
                              <div className="bg-black/30 rounded p-3">
                                <div className="text-xs text-gray-500 uppercase mb-2">Modifiers</div>
                                {exit.modifiers.map((mod, mIdx) => (
                                  <div key={mIdx} className="text-sm">
                                    <span className="text-cyan-400">IF</span>
                                    <span className="text-white ml-1">{mod.condition}</span>
                                    <span className="text-gray-400 mx-2">→</span>
                                    <span className="text-green-400">{mod.effect}</span>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Outcomes */}
                            {exit.outcomes && (
                              <div className="bg-black/30 rounded p-3">
                                <div className="text-xs text-gray-500 uppercase mb-2">Outcomes</div>
                                <div className="space-y-2 text-sm">
                                  {exit.outcomes.triumph && (
                                    <div className="border-l-2 border-yellow-500 pl-2">
                                      <span className="text-yellow-400 font-bold">TRIUMPH:</span>
                                      <span className="text-gray-300 ml-2">{exit.outcomes.triumph.description}</span>
                                    </div>
                                  )}
                                  {exit.outcomes.success && (
                                    <div className="border-l-2 border-green-500 pl-2">
                                      <span className="text-green-400 font-bold">SUCCESS:</span>
                                      <span className="text-gray-300 ml-2">{exit.outcomes.success.description}</span>
                                    </div>
                                  )}
                                  {exit.outcomes.failure && (
                                    <div className="border-l-2 border-orange-500 pl-2">
                                      <span className="text-orange-400 font-bold">FAILURE:</span>
                                      <span className="text-gray-300 ml-2">{exit.outcomes.failure.description}</span>
                                    </div>
                                  )}
                                  {exit.outcomes.despair && (
                                    <div className="border-l-2 border-red-500 pl-2">
                                      <span className="text-red-400 font-bold">DESPAIR:</span>
                                      <span className="text-gray-300 ml-2">{exit.outcomes.despair.description}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
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

              {level.dmNotes && (
                <>
                  {level.dmNotes.runningThisLevel && (
                    <div className="bg-black/30 rounded-lg p-4 border border-white/10">
                      <div className="text-sm text-gray-400 font-semibold mb-2">RUNNING THIS LEVEL</div>
                      <p className="text-gray-300 leading-relaxed">{level.dmNotes.runningThisLevel}</p>
                    </div>
                  )}

                  {level.dmNotes.atmosphereAdvice && (
                    <div className="bg-black/30 rounded-lg p-4 border border-white/10">
                      <div className="text-sm text-gray-400 font-semibold mb-2">ATMOSPHERE ADVICE</div>
                      <p className="text-gray-300 leading-relaxed">{level.dmNotes.atmosphereAdvice}</p>
                    </div>
                  )}

                  {level.dmNotes.horrorElements && (
                    <div className="bg-black/30 rounded-lg p-4 border border-white/10">
                      <div className="text-sm text-gray-400 font-semibold mb-2">HORROR ELEMENTS</div>
                      <p className="text-gray-300 leading-relaxed">{level.dmNotes.horrorElements}</p>
                    </div>
                  )}

                  {level.dmNotes.timeProgression && (
                    <div className="bg-black/30 rounded-lg p-4 border border-white/10">
                      <div className="text-sm text-gray-400 font-semibold mb-2">TIME PROGRESSION</div>
                      <p className="text-gray-300 leading-relaxed">{level.dmNotes.timeProgression}</p>
                    </div>
                  )}

                  {level.dmNotes.narrativeHooks?.length > 0 && (
                    <div className="bg-black/30 rounded-lg p-4 border border-white/10">
                      <div className="text-sm text-gray-400 font-semibold mb-2">NARRATIVE HOOKS</div>
                      <ul className="space-y-2">
                        {level.dmNotes.narrativeHooks.map((hook, idx) => (
                          <li key={idx} className="flex items-start space-x-2 text-gray-300">
                            <span className="text-purple-400">•</span><span>{hook}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {level.dmNotes.secrets && (
                    <div className="bg-red-900/20 rounded-lg p-4 border border-red-500/30">
                      <div className="text-sm text-red-400 font-semibold mb-2">🔒 SECRETS</div>
                      <p className="text-gray-300 leading-relaxed">{level.dmNotes.secrets}</p>
                    </div>
                  )}

                  {level.dmNotes.commonMistakes && (
                    <div className="bg-amber-900/20 rounded-lg p-4 border border-amber-500/30">
                      <div className="text-sm text-amber-400 font-semibold mb-2">⚠️ COMMON MISTAKES</div>
                      <p className="text-gray-300 leading-relaxed">{level.dmNotes.commonMistakes}</p>
                    </div>
                  )}

                  {level.dmNotes.balance && (
                    <div className="bg-black/30 rounded-lg p-4 border border-white/10">
                      <div className="text-sm text-gray-400 font-semibold mb-2">BALANCE</div>
                      <p className="text-gray-300 leading-relaxed">{level.dmNotes.balance}</p>
                    </div>
                  )}

                  {/* Session Notes - Editable */}
                  <div className="bg-blue-900/20 rounded-lg p-4 border border-blue-500/30">
                    <div className="text-sm text-blue-400 font-semibold mb-2">📝 SESSION NOTES</div>
                    <p className="text-xs text-gray-500 mb-3">Notes for this session ({sessionId}). Only you can see these.</p>
                    <textarea
                      value={sessionNoteText}
                      onChange={(e) => setSessionNoteText(e.target.value)}
                      placeholder="Add notes for this level in the current session..."
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

                    {/* Other sessions' notes (read-only) */}
                    {level.dmNotes.sessionNotes && Object.keys(level.dmNotes.sessionNotes).filter(sid => sid !== sessionId).length > 0 && (
                      <div className="mt-4 pt-4 border-t border-blue-500/20">
                        <div className="text-xs text-gray-500 mb-2">Notes from other sessions:</div>
                        <div className="space-y-2">
                          {Object.entries(level.dmNotes.sessionNotes)
                            .filter(([sid]) => sid !== sessionId)
                            .map(([sid, notes]) => (
                              <div key={sid} className="bg-black/30 rounded p-2">
                                <div className="text-xs text-gray-600 mb-1">Session: {sid}</div>
                                <p className="text-gray-400 text-sm">{notes}</p>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Quick Reference */}
              <div className="bg-black/30 rounded-lg p-4 border border-white/10">
                <div className="text-sm text-gray-400 font-semibold mb-3">QUICK REFERENCE</div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Max Entity Slots:</span>
                    <span className="text-red-300">{Math.round(level.dangerLevel * 0.8)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Max Object Slots:</span>
                    <span className="text-cyan-300">{Math.max(1, Math.round(4 - (level.dangerLevel * 0.3)))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Entity Difficulty Range:</span>
                    <span className="text-purple-300">{Math.max(1, level.dangerLevel - 2)} - {Math.min(10, level.dangerLevel + 2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Zone Phenomena Slots:</span>
                    <span className="text-amber-300">{Math.round(level.dangerLevel * 0.4)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}