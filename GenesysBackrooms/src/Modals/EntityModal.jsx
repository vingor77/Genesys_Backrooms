import React, { useState } from 'react';

export default function EntityModal({ entity, onClose, userIsDM, onToggleVisibility }) {
  const [activeTab, setActiveTab] = useState('overview');

  if (!entity) return null;

  const handleToggleVisibility = async () => {
    if (onToggleVisibility) {
      await onToggleVisibility(entity.id, entity.isHidden);
    }
  };

  // Utility function to convert kebab-case to Title Case
  const formatName = (str) => {
    if (!str) return '';
    return str
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Hostile': return 'text-red-400';
      case 'Boss': return 'text-purple-400';
      case 'Neutral': return 'text-yellow-400';
      case 'Beneficial': return 'text-green-400';
      case 'Ambient': return 'text-blue-400';
      case 'Environmental': return 'text-cyan-400';
      case 'Anomalous': return 'text-pink-400';
      case 'Intelligent': return 'text-amber-400';
      default: return 'text-gray-400';
    }
  };

  const getAdversaryColor = (type) => {
    switch (type) {
      case 'minion': return 'text-gray-300';
      case 'rival': return 'text-orange-400';
      case 'nemesis': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getDifficultyColor = (rating) => {
    if (rating <= 2) return 'text-green-400';
    if (rating <= 4) return 'text-blue-400';
    if (rating <= 6) return 'text-yellow-400';
    if (rating <= 8) return 'text-orange-400';
    return 'text-red-400';
  };

  const getCharacteristicColor = (value) => {
    if (value <= 1) return 'text-gray-400';
    if (value <= 2) return 'text-green-400';
    if (value <= 3) return 'text-blue-400';
    if (value <= 4) return 'text-yellow-400';
    if (value <= 5) return 'text-orange-400';
    return 'text-red-400';
  };

  const getAbilityTypeColor = (type) => {
    switch (type) {
      case 'passive': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'triggered': return 'bg-amber-500/20 text-amber-400 border-amber-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const getDifficultyText = (diff) => {
    switch (diff) {
      case 'easy': return 'Easy (1 purple)';
      case 'average': return 'Average (2 purple)';
      case 'hard': return 'Hard (3 purple)';
      case 'daunting': return 'Daunting (4 purple)';
      case 'formidable': return 'Formidable (5 purple)';
      default: return diff;
    }
  };

  // Tabs available to all users
  const playerTabs = [
    { id: 'overview', label: 'Overview', icon: '📋' },
  ];

  // DM-only tabs
  const dmTabs = [
    { id: 'stats', label: 'Stats', icon: '📊' },
    { id: 'abilities', label: 'Abilities', icon: '⚡' },
    { id: 'combat', label: 'Combat', icon: '⚔️' },
    { id: 'behavior', label: 'Behavior', icon: '🧠' },
    { id: 'chase', label: 'Chase & Movement', icon: '🏃' },
    { id: 'variants', label: 'Variants', icon: '🔀' },
    { id: 'spawn', label: 'Spawn & Loot', icon: '🎲' },
    { id: 'dm-notes', label: 'DM Notes', icon: '📖' },
  ];

  const allTabs = userIsDM ? [...playerTabs, ...dmTabs] : playerTabs;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-white/10">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-red-900/50 to-purple-900/50 p-6 border-b border-white/10">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-3xl font-bold text-white">
                  {entity.name}
                </h2>
                {entity.number && (
                  <span className="text-sm font-mono text-gray-400 bg-gray-500/20 px-2 py-0.5 rounded">
                    Entity #{entity.number}
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-4">
                <span className={`text-lg font-semibold ${getCategoryColor(entity.category)}`}>
                  {entity.category}
                </span>
                <span className="text-gray-400">•</span>
                <span className={`text-lg font-bold capitalize ${getAdversaryColor(entity.adversaryType)}`}>
                  {entity.adversaryType}
                </span>
                <span className="text-gray-400">•</span>
                <span className={`text-lg font-bold ${getDifficultyColor(entity.difficultyRating)}`}>
                  Difficulty {entity.difficultyRating}/10
                </span>
              </div>
              {entity.aliases && entity.aliases.length > 0 && (
                <div className="mt-2 text-gray-400 text-sm">
                  Also known as: {entity.aliases.join(', ')}
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              {/* Visibility Toggle (DM Only) */}
              {userIsDM && (
                <button
                  onClick={handleToggleVisibility}
                  className={`
                    flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all
                    ${entity.isHidden 
                      ? 'bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/50' 
                      : 'bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/50'
                    }
                  `}
                  title={entity.isHidden ? 'Click to show to players' : 'Click to hide from players'}
                >
                  {entity.isHidden ? (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <span>Show</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                      <span>Hide</span>
                    </>
                  )}
                </button>
              )}

              {/* Close Button */}
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10 bg-black/20 overflow-x-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent hover:scrollbar-thumb-white/30" style={{
          scrollbarWidth: 'thin',
          msOverflowStyle: 'none'
        }}>
          <style>{`
            .tab-container::-webkit-scrollbar {
              height: 6px;
            }
            .tab-container::-webkit-scrollbar-track {
              background: transparent;
            }
            .tab-container::-webkit-scrollbar-thumb {
              background: rgba(255, 255, 255, 0.2);
              border-radius: 3px;
            }
            .tab-container::-webkit-scrollbar-thumb:hover {
              background: rgba(255, 255, 255, 0.3);
            }
          `}</style>
          <div className="flex tab-container min-w-full">
            {allTabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  px-5 py-3 font-medium transition-all whitespace-nowrap flex-shrink-0
                  ${activeTab === tab.id
                    ? 'text-red-400 border-b-2 border-red-400 bg-red-500/10'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }
                `}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Challenge Rating */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/30 rounded-lg p-4 border border-white/10">
                  <div className="text-sm text-gray-400 mb-1">Solo Difficulty</div>
                  <div className={`text-2xl font-bold capitalize ${getDifficultyColor(
                    entity.challengeRating?.solo === 'trivial' ? 1 :
                    entity.challengeRating?.solo === 'easy' ? 3 :
                    entity.challengeRating?.solo === 'average' ? 5 :
                    entity.challengeRating?.solo === 'hard' ? 7 :
                    entity.challengeRating?.solo === 'formidable' ? 9 : 10
                  )}`}>
                    {entity.challengeRating?.solo || 'Unknown'}
                  </div>
                </div>
                
                <div className="bg-black/30 rounded-lg p-4 border border-white/10">
                  <div className="text-sm text-gray-400 mb-1">Recommended Party</div>
                  <div className="text-2xl font-bold text-purple-400">
                    {entity.challengeRating?.groupSize || '?'} Players
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-gradient-to-br from-red-900/20 to-purple-900/20 rounded-lg p-4 border border-red-500/30">
                <div className="text-sm text-red-300 font-semibold mb-2">APPEARANCE</div>
                <p className="text-gray-300 leading-relaxed">
                  {entity.description?.appearance || 'No description available.'}
                </p>
              </div>

              {/* Behavior Description */}
              {entity.description?.behaviorDescription && (
                <div className="bg-black/30 rounded-lg p-4 border border-white/10">
                  <div className="text-sm text-gray-400 font-semibold mb-2">BEHAVIOR</div>
                  <p className="text-gray-300 leading-relaxed">
                    {entity.description.behaviorDescription}
                  </p>
                </div>
              )}

              {/* Sounds */}
              {entity.description?.sounds && (
                <div className="bg-black/30 rounded-lg p-4 border border-white/10">
                  <div className="text-sm text-gray-400 font-semibold mb-2">AUDIO CUES</div>
                  <p className="text-gray-300 leading-relaxed">
                    {entity.description.sounds}
                  </p>
                </div>
              )}

              {/* Distinguishing Features */}
              {entity.description?.distinguishingFeatures && entity.description.distinguishingFeatures.length > 0 && (
                <div className="bg-amber-900/20 rounded-lg p-4 border border-amber-500/30">
                  <div className="text-sm text-amber-300 font-semibold mb-3">IDENTIFYING FEATURES</div>
                  <div className="space-y-2">
                    {entity.description.distinguishingFeatures.map((feature, index) => (
                      <div key={index} className="flex items-start space-x-2 text-sm">
                        <svg className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STATS TAB */}
          {activeTab === 'stats' && userIsDM && (
            <div className="space-y-6">
              {/* DM Notice */}
              <div className="bg-purple-900/20 border border-purple-500/50 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <svg className="w-6 h-6 text-purple-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <div>
                    <div className="text-purple-400 font-bold mb-1">DM ONLY</div>
                    <p className="text-gray-300 text-sm">
                      Genesys stat blocks are only visible to Game Masters.
                    </p>
                  </div>
                </div>
              </div>

              {/* Characteristics */}
              <div>
                <div className="text-lg font-bold text-cyan-400 mb-3 flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span>Characteristics</span>
                </div>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                  {entity.characteristics && Object.entries(entity.characteristics)
                    .sort(([a], [b]) => a.localeCompare(b))
                    .map(([key, value]) => (
                    <div key={key} className="bg-black/30 rounded-lg p-3 border border-white/10 text-center">
                      <div className="text-xs text-gray-400 uppercase mb-1">{key}</div>
                      <div className={`text-2xl font-bold ${getCharacteristicColor(value)}`}>{value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Derived Stats */}
              <div>
                <div className="text-lg font-bold text-purple-400 mb-3 flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span>Derived Stats</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  <div className="bg-black/30 rounded-lg p-3 border border-red-500/30 text-center">
                    <div className="text-xs text-red-400 uppercase mb-1">Wounds</div>
                    <div className="text-2xl font-bold text-red-400">{entity.derived?.woundsThreshold || 0}</div>
                  </div>
                  <div className="bg-black/30 rounded-lg p-3 border border-blue-500/30 text-center">
                    <div className="text-xs text-blue-400 uppercase mb-1">Strain</div>
                    <div className="text-2xl font-bold text-blue-400">{entity.derived?.strainThreshold || 0}</div>
                  </div>
                  <div className="bg-black/30 rounded-lg p-3 border border-cyan-500/30 text-center">
                    <div className="text-xs text-cyan-400 uppercase mb-1">Soak</div>
                    <div className="text-2xl font-bold text-cyan-400">{entity.derived?.soak || 0}</div>
                  </div>
                  <div className="bg-black/30 rounded-lg p-3 border border-green-500/30 text-center">
                    <div className="text-xs text-green-400 uppercase mb-1">M. Def</div>
                    <div className="text-2xl font-bold text-green-400">{entity.derived?.meleeDefense || 0}</div>
                  </div>
                  <div className="bg-black/30 rounded-lg p-3 border border-amber-500/30 text-center">
                    <div className="text-xs text-amber-400 uppercase mb-1">R. Def</div>
                    <div className="text-2xl font-bold text-amber-400">{entity.derived?.rangedDefense || 0}</div>
                  </div>
                </div>
              </div>

              {/* Skills */}
              {entity.skills && Object.keys(entity.skills).length > 0 && (
                <div>
                  <div className="text-lg font-bold text-green-400 mb-3 flex items-center space-x-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    <span>Skills</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {Object.entries(entity.skills)
                      .sort(([a], [b]) => a.localeCompare(b))
                      .map(([skill, ranks]) => (
                      <div key={skill} className="bg-black/30 rounded-lg p-3 border border-green-500/30 flex items-center justify-between">
                        <span className="text-white font-medium capitalize">{skill}</span>
                        <span className="text-green-400 font-bold">{ranks}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Talents */}
              {entity.talents && entity.talents.length > 0 && (
                <div>
                  <div className="text-lg font-bold text-amber-400 mb-3 flex items-center space-x-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                    <span>Talents</span>
                  </div>
                  <div className="space-y-3">
                    {entity.talents.map((talent, index) => (
                      <div key={index} className="bg-black/30 rounded-lg p-4 border border-amber-500/30">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white font-bold">{talent.name}</span>
                          <span className="text-xs font-bold text-amber-400 bg-amber-500/20 px-2 py-1 rounded">
                            TIER {talent.tier}
                          </span>
                        </div>
                        <p className="text-gray-400 text-sm">{talent.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ABILITIES TAB */}
          {activeTab === 'abilities' && userIsDM && (
            <div className="space-y-6">
              {entity.abilities && entity.abilities.length > 0 ? (
                <>
                  {/* Info Box */}
                  <div className="bg-purple-900/20 border border-purple-500/50 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <svg className="w-6 h-6 text-purple-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <div>
                        <div className="text-purple-400 font-bold mb-1">DM ONLY - SPECIAL ABILITIES</div>
                        <p className="text-gray-300 text-sm">
                          This entity has {entity.abilities.length} special {entity.abilities.length === 1 ? 'ability' : 'abilities'}.
                          <span className="text-blue-400"> Passive</span> abilities are always active,
                          <span className="text-green-400"> Active</span> abilities require an action, and
                          <span className="text-amber-400"> Triggered</span> abilities activate under specific conditions.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Ability Cards */}
                  {entity.abilities.map((ability, index) => (
                    <div key={index} className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-lg p-5 border border-purple-500/30">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-xl font-bold text-white">
                          {ability.name}
                        </h3>
                        <span className={`text-xs font-bold px-2 py-1 rounded border uppercase ${getAbilityTypeColor(ability.type)}`}>
                          {ability.type}
                        </span>
                      </div>

                      <div className="bg-black/30 rounded-lg p-3 border border-white/10">
                        <p className="text-gray-300">{ability.description}</p>
                      </div>

                      {ability.activation && (
                        <div className="mt-3 bg-amber-900/20 rounded-lg p-3 border border-amber-500/30">
                          <div className="text-sm text-amber-400 mb-1 font-semibold">ACTIVATION</div>
                          <p className="text-gray-300 text-sm">{ability.activation}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </>
              ) : (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <p className="text-gray-400 text-lg">No special abilities</p>
                  <p className="text-gray-500 mt-2">This entity relies on basic attacks only</p>
                </div>
              )}
            </div>
          )}

          {/* COMBAT TAB */}
          {activeTab === 'combat' && userIsDM && (
            <div className="space-y-6">
              {/* DM Notice */}
              <div className="bg-purple-900/20 border border-purple-500/50 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <svg className="w-6 h-6 text-purple-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <div>
                    <div className="text-purple-400 font-bold mb-1">DM ONLY</div>
                    <p className="text-gray-300 text-sm">
                      Combat statistics and weapon profiles are only visible to Game Masters.
                    </p>
                  </div>
                </div>
              </div>

              {/* Natural Weapons */}
              {entity.equipment?.naturalWeapons && entity.equipment.naturalWeapons.length > 0 && (
                <div>
                  <div className="text-lg font-bold text-red-400 mb-3 flex items-center space-x-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span>Natural Weapons</span>
                  </div>
                  <div className="space-y-3">
                    {entity.equipment.naturalWeapons.map((weapon, index) => (
                      <div key={index} className="bg-black/30 rounded-lg p-4 border border-red-500/30">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-white font-bold text-lg">{weapon.name}</span>
                          <span className="text-xs font-bold text-red-400 bg-red-500/20 px-2 py-1 rounded uppercase">
                            {weapon.skill}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-3 mb-3">
                          <div className="text-center">
                            <div className="text-xs text-gray-400 uppercase">Damage</div>
                            <div className="text-lg font-bold text-red-400">{weapon.damage}</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-gray-400 uppercase">Critical</div>
                            <div className="text-lg font-bold text-amber-400">{weapon.critical}</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-gray-400 uppercase">Range</div>
                            <div className="text-lg font-bold text-blue-400 capitalize">{weapon.range}</div>
                          </div>
                        </div>
                        {weapon.qualities && weapon.qualities.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {weapon.qualities.map((quality, qIndex) => (
                              <span key={qIndex} className="text-xs font-medium text-purple-300 bg-purple-500/20 px-2 py-1 rounded border border-purple-500/30">
                                {quality}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Natural Armor */}
              {entity.equipment?.naturalArmor && (
                <div>
                  <div className="text-lg font-bold text-blue-400 mb-3 flex items-center space-x-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span>Natural Armor</span>
                  </div>
                  <div className="bg-black/30 rounded-lg p-4 border border-blue-500/30">
                    <div className="flex items-center justify-between">
                      <span className="text-white font-bold">{entity.equipment.naturalArmor.name}</span>
                      <div className="flex gap-4">
                        <div className="text-center">
                          <div className="text-xs text-gray-400 uppercase">Soak</div>
                          <div className="text-lg font-bold text-cyan-400">+{entity.equipment.naturalArmor.soak}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-gray-400 uppercase">Defense</div>
                          <div className="text-lg font-bold text-green-400">+{entity.equipment.naturalArmor.defense}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* BEHAVIOR TAB */}
          {activeTab === 'behavior' && userIsDM && (
            <div className="space-y-6">
              {/* DM Notice */}
              <div className="bg-purple-900/20 border border-purple-500/50 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <svg className="w-6 h-6 text-purple-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <div>
                    <div className="text-purple-400 font-bold mb-1">DM ONLY</div>
                    <p className="text-gray-300 text-sm">
                      Behavioral patterns and tactics are only visible to Game Masters.
                    </p>
                  </div>
                </div>
              </div>

              {/* Behavior Overview */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-black/30 rounded-lg p-4 border border-white/10 text-center">
                  <div className="text-xs text-gray-400 uppercase mb-1">Hunting Style</div>
                  <div className="text-lg font-bold text-red-400 capitalize">{entity.behavior?.huntingStyle || 'Unknown'}</div>
                </div>
                <div className="bg-black/30 rounded-lg p-4 border border-white/10 text-center">
                  <div className="text-xs text-gray-400 uppercase mb-1">Aggression</div>
                  <div className="text-lg font-bold text-orange-400 capitalize">{entity.behavior?.aggression || 'Unknown'}</div>
                </div>
                <div className="bg-black/30 rounded-lg p-4 border border-white/10 text-center">
                  <div className="text-xs text-gray-400 uppercase mb-1">Intelligence</div>
                  <div className="text-lg font-bold text-cyan-400 capitalize">{entity.behavior?.intelligence || 'Unknown'}</div>
                </div>
                <div className="bg-black/30 rounded-lg p-4 border border-white/10 text-center">
                  <div className="text-xs text-gray-400 uppercase mb-1">Pack Behavior</div>
                  <div className="text-lg font-bold text-purple-400 capitalize">{entity.behavior?.packBehavior || 'Unknown'}</div>
                </div>
              </div>

              {/* Tactics */}
              {entity.behavior?.tactics && (
                <div className="bg-red-900/20 rounded-lg p-4 border border-red-500/30">
                  <div className="text-sm text-red-400 font-semibold mb-2">COMBAT TACTICS</div>
                  <p className="text-gray-300 leading-relaxed">{entity.behavior.tactics}</p>
                </div>
              )}

              {/* Retreat Condition */}
              {entity.behavior?.retreatCondition && (
                <div className="bg-green-900/20 rounded-lg p-4 border border-green-500/30">
                  <div className="text-sm text-green-400 font-semibold mb-2">RETREAT CONDITION</div>
                  <p className="text-gray-300">{entity.behavior.retreatCondition}</p>
                </div>
              )}

              {/* Communication */}
              {entity.behavior?.communication && entity.behavior.communication !== 'none' && (
                <div className="bg-blue-900/20 rounded-lg p-4 border border-blue-500/30">
                  <div className="text-sm text-blue-400 font-semibold mb-2">COMMUNICATION</div>
                  <p className="text-gray-300 capitalize">{entity.behavior.communication}</p>
                </div>
              )}
            </div>
          )}

          {/* CHASE & MOVEMENT TAB (DM ONLY) */}
          {activeTab === 'chase' && userIsDM && (
            <div className="space-y-6">
              {/* DM Notice */}
              <div className="bg-purple-900/20 border border-purple-500/50 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <svg className="w-6 h-6 text-purple-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <div>
                    <div className="text-purple-400 font-bold mb-1">DM ONLY</div>
                    <p className="text-gray-300 text-sm">
                      Movement capabilities and chase mechanics are only visible to Game Masters.
                    </p>
                  </div>
                </div>
              </div>

              {/* Roaming Movement */}
              <div>
                <div className="text-lg font-bold text-cyan-400 mb-3 flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>Roaming Movement</span>
                </div>
                <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-lg p-4 mb-4">
                  <p className="text-gray-300 text-sm mb-3">
                    When spawned but not actively pursuing or attacking players, this entity roams the level based on these parameters.
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    <div className="bg-black/30 rounded-lg p-3 border border-cyan-500/30 text-center">
                      <div className="text-xs text-gray-400 uppercase mb-1">Roam Speed</div>
                      <div className="text-xl font-bold text-cyan-400">{entity.movement?.speed || 0}</div>
                      <div className="text-xs text-gray-500">{entity.movement.speed === 1 ? "zone" : "zones"}</div>
                    </div>
                    <div className="bg-black/30 rounded-lg p-3 border border-cyan-500/30 text-center">
                      <div className="text-xs text-gray-400 uppercase mb-1">Interval</div>
                      <div className="text-xl font-bold text-cyan-400">{entity.movement?.roamInterval || '—'}</div>
                      <div className="text-xs text-gray-500">minutes</div>
                    </div>
                    <div className="bg-black/30 rounded-lg p-3 border border-white/10 text-center">
                      <div className="text-xs text-gray-400 uppercase mb-1">Movement Type</div>
                      <div className="text-lg font-bold text-white capitalize">{entity.movement?.movementType || 'Ground'}</div>
                    </div>
                    <div className="bg-black/30 rounded-lg p-3 border border-white/10 text-center col-span-2">
                      <div className="text-xs text-gray-400 uppercase mb-1">Movement Capabilities</div>
                      <div className="flex justify-center gap-3 mt-1">
                        <span className={`text-sm ${entity.movement?.canClimb ? 'text-green-400' : 'text-gray-600'}`}>
                          🧗 Climb
                        </span>
                        <span className={`text-sm ${entity.movement?.canSwim ? 'text-green-400' : 'text-gray-600'}`}>
                          🏊 Swim
                        </span>
                        <span className={`text-sm ${entity.movement?.canFly ? 'text-green-400' : 'text-gray-600'}`}>
                          🪽 Fly
                        </span>
                      </div>
                    </div>
                  </div>
                  {/* Summary sentence */}
                  {entity.movement?.speed > 0 && entity.movement?.roamInterval && (
                    <div className="mt-3 text-center text-sm text-cyan-300 bg-black/20 rounded-lg p-2">
                      Moves <span className="font-bold">{entity.movement.speed} {entity.movement.speed === 1 ? 'zone' : 'zones'}</span> every <span className="font-bold">{entity.movement.roamInterval} {entity.movement.roamInterval === 1 ? 'minute' : 'minutes'}</span> while roaming
                    </div>
                  )}
                </div>
              </div>

              {/* Senses */}
              <div>
                <div className="text-lg font-bold text-amber-400 mb-3 flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span>Senses</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="bg-black/30 rounded-lg p-3 border border-amber-500/30 text-center">
                    <div className="text-xs text-gray-400 uppercase mb-1">Vision</div>
                    <div className="text-lg font-bold text-amber-400 capitalize">{entity.senses?.vision || 'Normal'}</div>
                    {entity.senses?.visionRange && (
                      <div className="text-xs text-gray-500">{entity.senses.visionRange} zones</div>
                    )}
                  </div>
                  <div className="bg-black/30 rounded-lg p-3 border border-white/10 text-center">
                    <div className="text-xs text-gray-400 uppercase mb-1">Hearing</div>
                    <div className="text-lg font-bold text-white">
                      {entity.senses?.hearingRange ? `${entity.senses.hearingRange} zones` : 'Unlimited'}
                    </div>
                  </div>
                  {entity.senses?.specialSenses && entity.senses.specialSenses.length > 0 && (
                    <div className="bg-black/30 rounded-lg p-3 border border-purple-500/30 text-center">
                      <div className="text-xs text-gray-400 uppercase mb-1">Special Senses</div>
                      <div className="text-sm font-medium text-purple-400">
                        {entity.senses.specialSenses.map(s => formatName(s)).join(', ')}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Chase Stats */}
              <div>
                <div className="text-lg font-bold text-orange-400 mb-3 flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  <span>Chase Behavior</span>
                </div>
                
                {entity.chaseStats?.canChase ? (
                  <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-4">
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-xs text-gray-400 uppercase">Speed Multiplier</div>
                        <div className="text-xl font-bold text-orange-400">×{entity.chaseStats.chaseSpeed}</div>
                        <div className="text-xs text-gray-500">vs player speed</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-gray-400 uppercase">Duration</div>
                        <div className="text-xl font-bold text-orange-400">{entity.chaseStats.chaseDuration}</div>
                        <div className="text-xs text-gray-500">minutes max</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-gray-400 uppercase">Max Gap</div>
                        <div className="text-xl font-bold text-orange-400">{entity.chaseStats.maximumGap}</div>
                        <div className="text-xs text-gray-500">zones before losing track</div>
                      </div>
                    </div>
                    {entity.chaseStats.chaseTriggers && entity.chaseStats.chaseTriggers.length > 0 && (
                      <div className="mb-3">
                        <div className="text-sm text-orange-400 font-semibold mb-2">Chase Triggers:</div>
                        <div className="flex flex-wrap gap-2">
                          {entity.chaseStats.chaseTriggers.map((trigger, index) => (
                            <span key={index} className="text-xs text-gray-300 bg-black/30 px-2 py-1 rounded">
                              {trigger}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {entity.chaseStats.giveUpConditions && entity.chaseStats.giveUpConditions.length > 0 && (
                      <div>
                        <div className="text-sm text-green-400 font-semibold mb-2">Give Up Conditions:</div>
                        <div className="flex flex-wrap gap-2">
                          {entity.chaseStats.giveUpConditions.map((condition, index) => (
                            <span key={index} className="text-xs text-gray-300 bg-black/30 px-2 py-1 rounded">
                              {condition}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-gray-900/50 border border-gray-500/30 rounded-lg p-4 text-center">
                    <svg className="w-12 h-12 text-gray-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                    </svg>
                    <p className="text-gray-400">This entity does not chase fleeing targets</p>
                    <p className="text-gray-500 text-sm mt-1">It will not pursue players who disengage from combat</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* VARIANTS TAB (DM ONLY) */}
          {activeTab === 'variants' && userIsDM && (
            <div className="space-y-6">
              {/* DM Notice */}
              <div className="bg-purple-900/20 border border-purple-500/50 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <svg className="w-6 h-6 text-purple-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <div>
                    <div className="text-purple-400 font-bold mb-1">DM ONLY</div>
                    <p className="text-gray-300 text-sm">
                      Entity variants and their modifications are only visible to Game Masters.
                    </p>
                  </div>
                </div>
              </div>

              {entity.variants && entity.variants.length > 0 ? (
                <>
                  {/* Info Box */}
                  <div className="bg-amber-900/20 border border-amber-500/50 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <svg className="w-6 h-6 text-amber-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <div className="text-amber-400 font-bold mb-1">VARIANT SPAWNING</div>
                        <p className="text-gray-300 text-sm">
                          When this entity spawns, roll d100. If the roll is equal to or below a variant's spawn chance, 
                          apply that variant's modifications to the base entity. Variants modify the base - they don't replace it entirely.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Variant Cards */}
                  {entity.variants.map((variant, index) => (
                    <div key={index} className="bg-gradient-to-br from-amber-900/20 to-orange-900/20 rounded-lg p-5 border border-amber-500/30">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-amber-300">{variant.name}</h3>
                          <p className="text-gray-400 mt-1">{variant.description}</p>
                        </div>
                        <div className="text-center bg-amber-500/20 px-3 py-2 rounded-lg border border-amber-500/50">
                          <div className="text-2xl font-bold text-amber-400">{variant.spawnChance}%</div>
                          <div className="text-xs text-amber-300">Spawn Chance</div>
                        </div>
                      </div>

                      {/* Modifications */}
                      <div className="bg-black/30 rounded-lg p-4 border border-white/10">
                        <div className="text-sm text-gray-400 font-semibold mb-3">MODIFICATIONS FROM BASE</div>
                        
                        {variant.modifications && (
                          <div className="space-y-3">
                            {/* Difficulty Rating */}
                            {variant.modifications.difficultyRating && (
                              <div className="flex justify-between items-center py-2 border-b border-white/10">
                                <span className="text-gray-400">Difficulty Rating</span>
                                <div className="flex items-center gap-2">
                                  <span className="text-gray-500">{entity.difficultyRating}</span>
                                  <span className="text-gray-500">→</span>
                                  <span className="text-amber-400 font-bold">{variant.modifications.difficultyRating}</span>
                                </div>
                              </div>
                            )}

                            {/* Characteristics */}
                            {variant.modifications.characteristics && (
                              <div className="py-2 border-b border-white/10">
                                <div className="text-gray-400 mb-2">Characteristics:</div>
                                <div className="flex flex-wrap gap-2">
                                  {Object.entries(variant.modifications.characteristics).map(([key, value]) => (
                                    <span key={key} className="text-sm bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded border border-cyan-500/30">
                                      {key}: {entity.characteristics?.[key] || '?'} → <span className="font-bold">{value}</span>
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Derived Stats */}
                            {variant.modifications.derived && (
                              <div className="py-2 border-b border-white/10">
                                <div className="text-gray-400 mb-2">Derived Stats:</div>
                                <div className="flex flex-wrap gap-2">
                                  {Object.entries(variant.modifications.derived).map(([key, value]) => (
                                    <span key={key} className="text-sm bg-purple-500/20 text-purple-300 px-2 py-1 rounded border border-purple-500/30">
                                      {key}: <span className="font-bold">{value}</span>
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Abilities */}
                            {variant.modifications.abilities && variant.modifications.abilities.length > 0 && (
                              <div className="py-2">
                                <div className="text-gray-400 mb-2">Added Abilities:</div>
                                <div className="space-y-2">
                                  {variant.modifications.abilities.map((ability, aIndex) => (
                                    <div key={aIndex} className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                                      <div className="flex items-center justify-between mb-1">
                                        <span className="text-green-400 font-bold">{ability.name}</span>
                                        <span className="text-xs text-green-300 bg-green-500/20 px-2 py-0.5 rounded uppercase">
                                          {ability.type}
                                        </span>
                                      </div>
                                      <p className="text-gray-300 text-sm">{ability.description}</p>
                                      {ability.activation && (
                                        <p className="text-amber-300 text-xs mt-1">Activation: {ability.activation}</p>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Boss Encounter Changes */}
                            {variant.modifications.bossEncounter && (
                              <div className="py-2 border-t border-white/10">
                                <div className="text-red-400 font-semibold mb-2">⚠️ Becomes Boss Encounter</div>
                                <p className="text-gray-300 text-sm">
                                  This variant transforms the entity into a boss fight with minion/rival spawns.
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <p className="text-gray-400 text-lg">No variants for this entity</p>
                  <p className="text-gray-500 mt-2">This entity always spawns in its base form</p>
                </div>
              )}
            </div>
          )}

          {/* SPAWN & LOOT TAB (DM ONLY) */}
          {activeTab === 'spawn' && userIsDM && (
            <div className="space-y-6">
              <div className="bg-purple-900/20 border border-purple-500/50 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <svg className="w-6 h-6 text-purple-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <div>
                    <div className="text-purple-400 font-bold mb-1">DM ONLY</div>
                    <p className="text-gray-300 text-sm">
                      Spawn conditions and loot tables are only visible to Game Masters.
                    </p>
                  </div>
                </div>
              </div>

              {/* Spawn Conditions */}
              <div>
                <div className="text-lg font-bold text-cyan-400 mb-3">Spawn Conditions</div>
                <div className="bg-black/30 rounded-lg p-4 border border-white/10 space-y-3">
                  {entity.spawnConditions?.environmentalConditions && (
                    <>
                      {entity.spawnConditions.environmentalConditions.lightingRange && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Lighting Range:</span>
                          <span className="text-yellow-400">{entity.spawnConditions.environmentalConditions.lightingRange[0]} - {entity.spawnConditions.environmentalConditions.lightingRange[1]}</span>
                        </div>
                      )}
                      {entity.spawnConditions.environmentalConditions.temperatureRange && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Temperature Range:</span>
                          <span className="text-orange-400">{entity.spawnConditions.environmentalConditions.temperatureRange[0]}°F - {entity.spawnConditions.environmentalConditions.temperatureRange[1]}°F</span>
                        </div>
                      )}
                      {entity.spawnConditions.environmentalConditions.atmosphereTypes && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Atmosphere Types:</span>
                          <span className="text-red-400">{entity.spawnConditions.environmentalConditions.atmosphereTypes.join(', ')}</span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Group Size */}
              <div className="bg-purple-900/20 rounded-lg p-4 border border-purple-500/30">
                <div className="text-sm text-purple-400 font-semibold mb-2">SPAWN GROUP SIZE</div>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-xs text-gray-400">Minimum</div>
                    <div className="text-2xl font-bold text-white">{entity.groupSize?.min || 1}</div>
                  </div>
                  <div className="text-gray-500">—</div>
                  <div className="text-center">
                    <div className="text-xs text-gray-400">Maximum</div>
                    <div className="text-2xl font-bold text-white">{entity.groupSize?.max || 1}</div>
                  </div>
                </div>
              </div>

              {/* Boss Encounter */}
              {entity.bossEncounter?.isBoss && (
                <div>
                  <div className="text-lg font-bold text-purple-400 mb-3">Boss Encounter Setup</div>
                  
                  {entity.bossEncounter.minionSpawns && entity.bossEncounter.minionSpawns.length > 0 && (
                    <div className="bg-black/30 rounded-lg p-4 border border-purple-500/30 mb-3">
                      <div className="text-sm text-purple-400 font-semibold mb-2">MINION SPAWNS</div>
                      <div className="space-y-2">
                        {entity.bossEncounter.minionSpawns.map((spawn, index) => (
                          <div key={index} className="flex items-center justify-between bg-black/30 rounded p-2">
                            <span className="text-white">{formatName(spawn.entityId)}</span>
                            <div className="flex items-center gap-3">
                              <span className="text-gray-400">{spawn.minQuantity}-{spawn.maxQuantity}</span>
                              <span className="text-green-400">{Math.round(spawn.spawnProbability * 100)}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {entity.bossEncounter.rivalSpawns && entity.bossEncounter.rivalSpawns.length > 0 && (
                    <div className="bg-black/30 rounded-lg p-4 border border-orange-500/30">
                      <div className="text-sm text-orange-400 font-semibold mb-2">RIVAL SPAWNS</div>
                      <div className="space-y-2">
                        {entity.bossEncounter.rivalSpawns.map((spawn, index) => (
                          <div key={index} className="flex items-center justify-between bg-black/30 rounded p-2">
                            <span className="text-white">{formatName(spawn.entityId)}</span>
                            <div className="flex items-center gap-3">
                              <span className="text-gray-400">{spawn.minQuantity}-{spawn.maxQuantity}</span>
                              <span className="text-green-400">{Math.round(spawn.spawnProbability * 100)}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Loot Table */}
              {entity.lootTable?.dropsLoot && (
                <div>
                  <div className="text-lg font-bold text-green-400 mb-3">Loot Table</div>
                  
                  {entity.lootTable.lootItems && entity.lootTable.lootItems.length > 0 && (
                    <div className="bg-black/30 rounded-lg p-4 border border-green-500/30 mb-3">
                      <div className="text-sm text-green-400 font-semibold mb-2">COMMON DROPS</div>
                      <div className="space-y-2">
                        {entity.lootTable.lootItems.map((item, index) => (
                          <div key={index} className="flex items-center justify-between bg-black/30 rounded p-2">
                            <span className="text-white">{formatName(item.itemId)}</span>
                            <div className="flex items-center gap-3">
                              <span className="text-gray-400">×{item.minQuantity}-{item.maxQuantity}</span>
                              <span className="text-green-400">Weight: {item.spawnWeight}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {entity.lootTable.specialDrops && entity.lootTable.specialDrops.length > 0 && (
                    <div className="bg-black/30 rounded-lg p-4 border border-amber-500/30 mb-3">
                      <div className="text-sm text-amber-400 font-semibold mb-2">SPECIAL DROPS</div>
                      <div className="space-y-2">
                        {entity.lootTable.specialDrops.map((drop, index) => (
                          <div key={index} className="bg-black/30 rounded p-2">
                            <div className="flex items-center justify-between">
                              <span className="text-white">{formatName(drop.itemId)}</span>
                              <span className="text-amber-400">{Math.round(drop.dropChance * 100)}% chance</span>
                            </div>
                            {drop.condition && (
                              <div className="text-gray-400 text-sm mt-1">{drop.condition}</div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {entity.lootTable.harvestableMaterials && entity.lootTable.harvestableMaterials.length > 0 && (
                    <div className="bg-black/30 rounded-lg p-4 border border-cyan-500/30">
                      <div className="text-sm text-cyan-400 font-semibold mb-2">HARVESTABLE MATERIALS</div>
                      <div className="space-y-3">
                        {entity.lootTable.harvestableMaterials.map((material, index) => (
                          <div key={index} className="bg-black/30 rounded p-3">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-white font-medium">{formatName(material.materialId)}</span>
                              <span className="text-cyan-400">×{material.quantity}</span>
                            </div>
                            <div className="flex items-center gap-4 text-sm mb-2">
                              <span className="text-gray-400">Skill: <span className="text-white capitalize">{material.skillRequired}</span></span>
                              <span className="text-gray-400">Difficulty: <span className="text-yellow-400 capitalize">{material.difficulty}</span></span>
                            </div>
                            <p className="text-gray-400 text-sm">{material.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Tags */}
              {entity.tags && entity.tags.length > 0 && (
                <div>
                  <div className="text-lg font-bold text-gray-400 mb-3">Spawn Tags</div>
                  <div className="flex flex-wrap gap-2">
                    {entity.tags.map((tag, index) => (
                      <span key={index} className="text-sm text-gray-300 bg-gray-500/20 px-3 py-1 rounded-full border border-gray-500/30">
                        {tag}
                      </span>
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
                <div className="flex items-start space-x-3">
                  <svg className="w-6 h-6 text-purple-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <div>
                    <div className="text-purple-400 font-bold mb-1">DM ONLY</div>
                    <p className="text-gray-300 text-sm">
                      This tab is only visible to Game Masters. Use this information to run encounters effectively.
                    </p>
                  </div>
                </div>
              </div>

              {/* How To Run */}
              {entity.dmNotes?.howToRun && (
                <div className="bg-black/30 rounded-lg p-4 border border-white/10">
                  <div className="text-sm text-gray-400 font-semibold mb-2">HOW TO RUN</div>
                  <p className="text-gray-300 leading-relaxed">{entity.dmNotes.howToRun}</p>
                </div>
              )}

              {/* Tactics Tips */}
              {entity.dmNotes?.tacticsTips && (
                <div className="bg-red-900/20 rounded-lg p-4 border border-red-500/30">
                  <div className="text-sm text-red-400 font-semibold mb-2">COMBAT TACTICS</div>
                  <p className="text-gray-300 leading-relaxed">{entity.dmNotes.tacticsTips}</p>
                </div>
              )}

              {/* Narrative Hooks */}
              {entity.dmNotes?.narrativeHooks && (
                <div className="bg-blue-900/20 rounded-lg p-4 border border-blue-500/30">
                  <div className="text-sm text-blue-400 font-semibold mb-2">NARRATIVE HOOKS</div>
                  <p className="text-gray-300 leading-relaxed">{entity.dmNotes.narrativeHooks}</p>
                </div>
              )}

              {/* Common Mistakes */}
              {entity.dmNotes?.commonMistakes && (
                <div className="bg-amber-900/20 rounded-lg p-4 border border-amber-500/30">
                  <div className="text-sm text-amber-400 font-semibold mb-2">COMMON MISTAKES TO AVOID</div>
                  <p className="text-gray-300 leading-relaxed">{entity.dmNotes.commonMistakes}</p>
                </div>
              )}

              {/* Quick Reference */}
              <div className="bg-black/30 rounded-lg p-4 border border-white/10">
                <div className="text-sm text-gray-400 font-semibold mb-3">QUICK REFERENCE</div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Adversary Type:</span>
                    <span className="text-white capitalize">{entity.adversaryType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Minion Groups:</span>
                    <span className="text-purple-300">{entity.adversaryType === 'minion' ? 'Share wound threshold' : 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Has Strain:</span>
                    <span className={entity.derived?.strainThreshold > 0 ? 'text-green-300' : 'text-red-300'}>
                      {entity.derived?.strainThreshold > 0 ? `Yes (${entity.derived.strainThreshold})` : 'No (mindless)'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Can Chase:</span>
                    <span className={entity.chaseStats?.canChase ? 'text-orange-300' : 'text-gray-500'}>
                      {entity.chaseStats?.canChase ? `Yes (${entity.chaseStats.chaseSpeed}× speed)` : 'No'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Drops Loot:</span>
                    <span className={entity.lootTable?.dropsLoot ? 'text-green-300' : 'text-gray-500'}>
                      {entity.lootTable?.dropsLoot ? 'Yes' : 'No'}
                    </span>
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