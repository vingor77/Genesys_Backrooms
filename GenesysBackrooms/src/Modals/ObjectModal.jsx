import React, { useState, useEffect } from 'react';
import { getActiveSession } from '../Structural/Session_Utils';

export default function ObjectModal({ object, onClose, userIsDM, onToggleVisibility, onUpdateSessionNotes }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedItems, setExpandedItems] = useState({});
  const [sessionNoteText, setSessionNoteText] = useState('');
  const [isSavingNote, setIsSavingNote] = useState(false);
  const sessionId = getActiveSession();

  useEffect(() => {
    if (object?.dmNotes?.sessionNotes?.[sessionId]) {
      setSessionNoteText(object.dmNotes.sessionNotes[sessionId]);
    } else {
      setSessionNoteText('');
    }
  }, [object, sessionId]);

  if (!object) return null;

  const toggleExpanded = (key) => {
    setExpandedItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleToggleVisibility = async () => {
    if (onToggleVisibility) {
      await onToggleVisibility(object.id, object.isHidden);
    }
  };

  const handleSaveSessionNote = async () => {
    if (!onUpdateSessionNotes) return;
    setIsSavingNote(true);
    try {
      await onUpdateSessionNotes(object.id, sessionId, sessionNoteText);
    } catch (error) {
      console.error('Error saving session note:', error);
    }
    setIsSavingNote(false);
  };

  const formatName = (str) => {
    if (!str) return '';
    return str.split(/[-_]/).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Armor': return 'text-blue-400';
      case 'Weapon': return 'text-red-400';
      case 'Mundane Object': return 'text-gray-400';
      case 'Anomalous Object': return 'text-purple-400';
      case 'Construct': return 'text-amber-400';
      default: return 'text-gray-400';
    }
  };

  const getTypeGradient = (type) => {
    switch (type) {
      case 'Armor': return 'from-blue-900/50 to-cyan-900/50';
      case 'Weapon': return 'from-red-900/50 to-orange-900/50';
      case 'Mundane Object': return 'from-gray-900/50 to-slate-900/50';
      case 'Anomalous Object': return 'from-purple-900/50 to-pink-900/50';
      case 'Construct': return 'from-amber-900/50 to-orange-900/50';
      default: return 'from-gray-900/50 to-slate-900/50';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Armor': return '🛡️';
      case 'Weapon': return '⚔️';
      case 'Mundane Object': return '🔧';
      case 'Anomalous Object': return '✨';
      case 'Construct': return '🏗️';
      default: return '📦';
    }
  };

  const getRarityColor = (rarity) => {
    if (rarity <= 1) return 'text-gray-400';
    if (rarity <= 3) return 'text-green-400';
    if (rarity <= 5) return 'text-blue-400';
    if (rarity <= 7) return 'text-purple-400';
    if (rarity <= 9) return 'text-orange-400';
    return 'text-yellow-400';
  };

  const getRarityLabel = (rarity) => {
    if (rarity <= 1) return 'Common';
    if (rarity <= 3) return 'Uncommon';
    if (rarity <= 5) return 'Rare';
    if (rarity <= 7) return 'Epic';
    if (rarity <= 9) return 'Legendary';
    return 'Mythic';
  };

  // Determine available tabs based on object type
  const getTabs = () => {
    const baseTabs = [
      { id: 'overview', label: 'Overview', icon: '📋' },
      { id: 'stats', label: 'Stats', icon: '📊' },
    ];

    if (object.variants?.length > 0) {
      baseTabs.push({ id: 'variants', label: 'Variants', icon: '🔀' });
    }

    if (object.curse && (object.type === 'Armor' || object.type === 'Weapon')) {
      baseTabs.push({ id: 'curse', label: 'Curse', icon: '☠️' });
    }

    if (userIsDM) {
      baseTabs.push({ id: 'dm-notes', label: 'DM Notes', icon: '🎲' });
    }

    return baseTabs;
  };

  const allTabs = getTabs();

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-white/10">
        
        {/* Header */}
        <div className={`bg-gradient-to-r ${getTypeGradient(object.type)} p-6 border-b border-white/10`}>
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <div className="text-5xl">{getTypeIcon(object.type)}</div>
              <div>
                <h2 className="text-3xl font-bold text-white mb-1">{object.name}</h2>
                <div className="flex items-center space-x-3">
                  <span className={`text-lg font-semibold ${getTypeColor(object.type)}`}>{object.type}</span>
                  <span className="text-gray-400">•</span>
                  <span className={`font-bold ${getRarityColor(object.rarity)}`}>
                    {getRarityLabel(object.rarity)} (R{object.rarity})
                  </span>
                </div>
                {object.curse?.is_cursed && (
                  <div className="mt-2 px-3 py-1 bg-red-900/50 border border-red-500/50 rounded-lg inline-block">
                    <span className="text-red-400 font-bold">☠️ CURSED</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {userIsDM && (
                <button
                  onClick={handleToggleVisibility}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all
                    ${object.isHidden 
                      ? 'bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/50' 
                      : 'bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/50'
                    }`}
                >
                  {object.isHidden ? <span>👁️ Show</span> : <span>🚫 Hide</span>}
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
              {/* Price & Economy */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-black/30 rounded-lg p-4 border border-yellow-500/30">
                  <div className="text-sm text-gray-400 mb-1">Buy Price</div>
                  <div className="text-2xl font-bold text-yellow-400">💰 {object.buy_price}</div>
                </div>
                <div className="bg-black/30 rounded-lg p-4 border border-green-500/30">
                  <div className="text-sm text-gray-400 mb-1">Sell Price</div>
                  <div className="text-2xl font-bold text-green-400">💵 {object.sell_price}</div>
                </div>
                <div className="bg-black/30 rounded-lg p-4 border border-white/10">
                  <div className="text-sm text-gray-400 mb-1">Encumbrance</div>
                  <div className="text-2xl font-bold text-white">⚖️ {object.encumbrance}</div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-lg p-4 border border-white/10">
                <div className="text-sm text-gray-400 font-semibold mb-2">DESCRIPTION</div>
                <p className="text-gray-300 leading-relaxed">{object.description}</p>
              </div>

              {/* Mechanical Effect */}
              {object.mechanical_effect && (
                <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-lg p-4 border border-purple-500/30">
                  <div className="text-sm text-purple-300 font-semibold mb-2">⚡ MECHANICAL EFFECT</div>
                  <p className="text-gray-300 leading-relaxed">{object.mechanical_effect}</p>
                </div>
              )}

              {/* Fuel Requirements */}
              {object.fuel_type && (
                <div className="bg-amber-900/20 rounded-lg p-4 border border-amber-500/30">
                  <div className="text-sm text-amber-300 font-semibold mb-2">🔋 FUEL REQUIREMENTS</div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-gray-400">Type:</span>
                      <span className="text-white ml-2">{object.fuel_type}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Duration:</span>
                      <span className="text-white ml-2">{object.fuel_duration}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Uses (for consumables) */}
              {object.uses !== null && object.uses !== undefined && (
                <div className="bg-cyan-900/20 rounded-lg p-4 border border-cyan-500/30">
                  <div className="text-sm text-cyan-300 font-semibold mb-2">🔄 USES</div>
                  <div className="text-2xl font-bold text-white">{object.uses} {object.uses === 1 ? 'use' : 'uses'} remaining</div>
                </div>
              )}

              {/* Quick Info Row */}
              <div className="flex flex-wrap gap-3">
                {object.equippedTo && (
                  <div className="bg-black/30 rounded-lg px-4 py-2 border border-white/10">
                    <span className="text-gray-400 text-sm">Slot:</span>
                    <span className="text-white ml-2 font-medium">{object.equippedTo}</span>
                  </div>
                )}
                {object.construct_category && (
                  <div className="bg-black/30 rounded-lg px-4 py-2 border border-white/10">
                    <span className="text-gray-400 text-sm">Category:</span>
                    <span className="text-white ml-2 font-medium">{object.construct_category}</span>
                  </div>
                )}
                {object.set_name && (
                  <div className="bg-purple-500/20 rounded-lg px-4 py-2 border border-purple-500/30">
                    <span className="text-purple-300 text-sm">Set:</span>
                    <span className="text-white ml-2 font-medium">{object.set_name}</span>
                  </div>
                )}
                {object.craftable && (
                  <div className="bg-green-500/20 rounded-lg px-4 py-2 border border-green-500/30">
                    <span className="text-green-300 font-medium">🔨 Craftable</span>
                  </div>
                )}
                {object.repairSkill && (
                  <div className="bg-blue-500/20 rounded-lg px-4 py-2 border border-blue-500/30">
                    <span className="text-gray-400 text-sm">Repair:</span>
                    <span className="text-blue-300 ml-2 font-medium">{object.repairSkill}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STATS TAB */}
          {activeTab === 'stats' && (
            <div className="space-y-6">
              {/* Armor Stats */}
              {object.type === 'Armor' && (
                <>
                  <div className="text-xl font-bold text-blue-400 mb-3">🛡️ Armor Statistics</div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-black/30 rounded-lg p-4 border border-blue-500/30 text-center">
                      <div className="text-sm text-gray-400 mb-1">Soak</div>
                      <div className="text-3xl font-bold text-blue-400">{object.soak}</div>
                    </div>
                    <div className="bg-black/30 rounded-lg p-4 border border-green-500/30 text-center">
                      <div className="text-sm text-gray-400 mb-1">Melee Defense</div>
                      <div className="text-3xl font-bold text-green-400">{object.melee_defense}</div>
                    </div>
                    <div className="bg-black/30 rounded-lg p-4 border border-cyan-500/30 text-center">
                      <div className="text-sm text-gray-400 mb-1">Ranged Defense</div>
                      <div className="text-3xl font-bold text-cyan-400">{object.ranged_defense}</div>
                    </div>
                    <div className="bg-black/30 rounded-lg p-4 border border-amber-500/30 text-center">
                      <div className="text-sm text-gray-400 mb-1">Durability</div>
                      <div className="text-3xl font-bold text-amber-400">{object.durability}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-black/30 rounded-lg p-4 border border-white/10">
                      <div className="text-sm text-gray-400 mb-1">Hardpoints</div>
                      <div className="text-xl font-bold text-white">{object.hardpoints} slots</div>
                    </div>
                    <div className="bg-black/30 rounded-lg p-4 border border-white/10">
                      <div className="text-sm text-gray-400 mb-1">Equipped To</div>
                      <div className="text-xl font-bold text-white">{object.equippedTo}</div>
                    </div>
                  </div>

                  {object.equipmentTraits && (
                    <div className="bg-amber-900/20 rounded-lg p-4 border border-amber-500/30">
                      <div className="text-sm text-amber-300 font-semibold mb-2">⭐ EQUIPMENT TRAITS</div>
                      <p className="text-white">{object.equipmentTraits}</p>
                    </div>
                  )}
                </>
              )}

              {/* Weapon Stats */}
              {object.type === 'Weapon' && (
                <>
                  <div className="text-xl font-bold text-red-400 mb-3">⚔️ Weapon Statistics</div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-black/30 rounded-lg p-4 border border-red-500/30 text-center">
                      <div className="text-sm text-gray-400 mb-1">Damage</div>
                      <div className="text-3xl font-bold text-red-400">{object.damage}</div>
                    </div>
                    <div className="bg-black/30 rounded-lg p-4 border border-yellow-500/30 text-center">
                      <div className="text-sm text-gray-400 mb-1">Critical</div>
                      <div className="text-3xl font-bold text-yellow-400">{object.critical}</div>
                    </div>
                    <div className="bg-black/30 rounded-lg p-4 border border-cyan-500/30 text-center">
                      <div className="text-sm text-gray-400 mb-1">Range</div>
                      <div className="text-xl font-bold text-cyan-400">{object.range}</div>
                    </div>
                    <div className="bg-black/30 rounded-lg p-4 border border-amber-500/30 text-center">
                      <div className="text-sm text-gray-400 mb-1">Durability</div>
                      <div className="text-3xl font-bold text-amber-400">{object.durability}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-black/30 rounded-lg p-4 border border-white/10">
                      <div className="text-sm text-gray-400 mb-1">Skill</div>
                      <div className="text-xl font-bold text-white">{object.skill}</div>
                    </div>
                    <div className="bg-black/30 rounded-lg p-4 border border-white/10">
                      <div className="text-sm text-gray-400 mb-1">Hardpoints</div>
                      <div className="text-xl font-bold text-white">{object.hardpoints} slots</div>
                    </div>
                    <div className="bg-black/30 rounded-lg p-4 border border-white/10">
                      <div className="text-sm text-gray-400 mb-1">Equipped To</div>
                      <div className="text-xl font-bold text-white">{object.equippedTo}</div>
                    </div>
                  </div>

                  {object.equipmentTraits && (
                    <div className="bg-amber-900/20 rounded-lg p-4 border border-amber-500/30">
                      <div className="text-sm text-amber-300 font-semibold mb-2">⭐ EQUIPMENT TRAITS</div>
                      <p className="text-white">{object.equipmentTraits}</p>
                    </div>
                  )}
                </>
              )}

              {/* Construct Stats */}
              {object.type === 'Construct' && (
                <>
                  <div className="text-xl font-bold text-amber-400 mb-3">🏗️ Construct Statistics</div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-black/30 rounded-lg p-4 border border-red-500/30 text-center">
                      <div className="text-sm text-gray-400 mb-1">Health Points</div>
                      <div className="text-3xl font-bold text-red-400">{object.health_points}</div>
                    </div>
                    <div className="bg-black/30 rounded-lg p-4 border border-blue-500/30 text-center">
                      <div className="text-sm text-gray-400 mb-1">Soak</div>
                      <div className="text-3xl font-bold text-blue-400">{object.soak}</div>
                    </div>
                    <div className="bg-black/30 rounded-lg p-4 border border-green-500/30 text-center">
                      <div className="text-sm text-gray-400 mb-1">Defense</div>
                      <div className="text-3xl font-bold text-green-400">{object.defense}</div>
                    </div>
                    <div className="bg-black/30 rounded-lg p-4 border border-purple-500/30 text-center">
                      <div className="text-sm text-gray-400 mb-1">Capacity</div>
                      <div className="text-3xl font-bold text-purple-400">{object.capacity || 'N/A'}</div>
                    </div>
                  </div>

                  <div className="bg-black/30 rounded-lg p-4 border border-white/10">
                    <div className="text-sm text-gray-400 mb-1">Category</div>
                    <div className="text-xl font-bold text-white">{object.construct_category}</div>
                  </div>

                  {object.placement_requirements && (
                    <div className="bg-cyan-900/20 rounded-lg p-4 border border-cyan-500/30">
                      <div className="text-sm text-cyan-300 font-semibold mb-2">📍 PLACEMENT REQUIREMENTS</div>
                      <p className="text-gray-300">{object.placement_requirements}</p>
                    </div>
                  )}

                  {object.benefits && (
                    <div className="bg-green-900/20 rounded-lg p-4 border border-green-500/30">
                      <div className="text-sm text-green-300 font-semibold mb-2">✨ BENEFITS</div>
                      <p className="text-gray-300">{object.benefits}</p>
                    </div>
                  )}
                </>
              )}

              {/* Mundane/Anomalous Objects - simple stats */}
              {(object.type === 'Mundane Object' || object.type === 'Anomalous Object') && (
                <>
                  <div className="text-xl font-bold text-gray-400 mb-3">
                    {object.type === 'Anomalous Object' ? '✨' : '🔧'} {object.type} Properties
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-black/30 rounded-lg p-4 border border-white/10 text-center">
                      <div className="text-sm text-gray-400 mb-1">Rarity</div>
                      <div className={`text-2xl font-bold ${getRarityColor(object.rarity)}`}>{object.rarity}</div>
                    </div>
                    <div className="bg-black/30 rounded-lg p-4 border border-white/10 text-center">
                      <div className="text-sm text-gray-400 mb-1">Encumbrance</div>
                      <div className="text-2xl font-bold text-white">{object.encumbrance}</div>
                    </div>
                    <div className="bg-black/30 rounded-lg p-4 border border-white/10 text-center">
                      <div className="text-sm text-gray-400 mb-1">Uses</div>
                      <div className="text-2xl font-bold text-white">{object.uses ?? '∞'}</div>
                    </div>
                  </div>

                  {object.type === 'Anomalous Object' && (
                    <div className="bg-purple-900/20 rounded-lg p-4 border border-purple-500/30">
                      <div className="text-sm text-purple-300 font-semibold mb-2">🔮 ANOMALOUS NATURE</div>
                      <p className="text-gray-300">This object is supernatural in nature and does not degrade over time. Its properties may defy conventional physics.</p>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* VARIANTS TAB */}
          {activeTab === 'variants' && object.variants?.length > 0 && (
            <div className="space-y-4">
              <div className="text-xl font-bold text-cyan-400 mb-3">🔀 Item Variants</div>
              <p className="text-gray-400 text-sm mb-4">
                When this item spawns, there's a chance it appears as one of these variants instead.
              </p>
              
              {object.variants.map((variant, idx) => (
                <div key={idx} className="bg-black/30 rounded-lg p-4 border border-cyan-500/30">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="text-white font-bold text-lg">{variant.name}</h4>
                      <span className={`text-sm ${getRarityColor(variant.rarity)}`}>
                        {getRarityLabel(variant.rarity)} (R{variant.rarity})
                      </span>
                    </div>
                    {userIsDM && (
                      <span className="text-cyan-400 text-sm bg-cyan-500/20 px-2 py-1 rounded">
                        {variant.chance}% spawn chance
                      </span>
                    )}
                  </div>

                  <p className="text-gray-400 text-sm mb-3">{variant.description}</p>

                  {variant.mechanical_effect && (
                    <div className="bg-purple-900/20 rounded p-3 mb-3">
                      <span className="text-purple-300 text-sm font-semibold">Effect: </span>
                      <span className="text-gray-300 text-sm">{variant.mechanical_effect}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="bg-black/30 rounded p-2">
                      <span className="text-gray-500">Buy:</span>
                      <span className="text-yellow-400 ml-1">{variant.buy_price}</span>
                    </div>
                    <div className="bg-black/30 rounded p-2">
                      <span className="text-gray-500">Sell:</span>
                      <span className="text-green-400 ml-1">{variant.sell_price}</span>
                    </div>
                    <div className="bg-black/30 rounded p-2">
                      <span className="text-gray-500">Encum:</span>
                      <span className="text-white ml-1">{variant.encumbrance}</span>
                    </div>
                  </div>

                  {(variant.fuel_type || variant.fuel_duration) && (
                    <div className="mt-2 text-sm text-amber-300">
                      🔋 {variant.fuel_type} ({variant.fuel_duration})
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* CURSE TAB */}
          {activeTab === 'curse' && object.curse && (
            <div className="space-y-6">
              <div className="text-xl font-bold text-red-400 mb-3">☠️ Curse Information</div>

              {/* Current Curse Status */}
              <div className={`rounded-lg p-4 border ${object.curse.is_cursed ? 'bg-red-900/30 border-red-500/50' : 'bg-green-900/20 border-green-500/30'}`}>
                <div className="text-lg font-bold mb-2">
                  {object.curse.is_cursed ? (
                    <span className="text-red-400">☠️ THIS ITEM IS CURSED</span>
                  ) : (
                    <span className="text-green-400">✓ Item is not currently cursed</span>
                  )}
                </div>
                {userIsDM && (
                  <div className="text-sm text-gray-400">
                    Curse Spawn Chance: <span className="text-yellow-400">{object.curse.curse_chance}%</span>
                  </div>
                )}
              </div>

              {/* Curse Details */}
              {(object.curse.curse_description || object.curse.curse_effect || object.curse.removal_requirement) && (
                <>
                  {object.curse.curse_description && (
                    <div className="bg-red-900/20 rounded-lg p-4 border border-red-500/30">
                      <div className="text-sm text-red-300 font-semibold mb-2">CURSE DESCRIPTION</div>
                      <p className="text-gray-300 leading-relaxed">{object.curse.curse_description}</p>
                    </div>
                  )}

                  {object.curse.curse_effect && (
                    <div className="bg-red-900/20 rounded-lg p-4 border border-red-500/30">
                      <div className="text-sm text-red-300 font-semibold mb-2">⚠️ CURSE EFFECT</div>
                      <p className="text-gray-300 leading-relaxed">{object.curse.curse_effect}</p>
                    </div>
                  )}

                  {object.curse.removal_requirement && (
                    <div className="bg-purple-900/20 rounded-lg p-4 border border-purple-500/30">
                      <div className="text-sm text-purple-300 font-semibold mb-2">🔮 REMOVAL REQUIREMENT</div>
                      <p className="text-gray-300 leading-relaxed">{object.curse.removal_requirement}</p>
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

              {/* Tags */}
              {object.tags?.length > 0 && (
                <div className="bg-black/30 rounded-lg p-4 border border-white/10">
                  <div className="text-sm text-gray-400 font-semibold mb-3">🏷️ SPAWN TAGS</div>
                  <div className="flex flex-wrap gap-2">
                    {object.tags.map((tag, idx) => (
                      <span key={idx} className="px-3 py-1 rounded-lg text-sm font-medium bg-gray-500/20 text-gray-300 border border-gray-500/30">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Variant Spawn Chances */}
              {object.variants?.length > 0 && (
                <div className="bg-black/30 rounded-lg p-4 border border-cyan-500/30">
                  <div className="text-sm text-cyan-400 font-semibold mb-3">🎲 VARIANT SPAWN CHANCES</div>
                  <div className="space-y-2">
                    {object.variants.map((variant, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span className="text-gray-300">{variant.name}</span>
                        <span className="text-cyan-400">{variant.chance}%</span>
                      </div>
                    ))}
                    <div className="flex justify-between text-sm border-t border-white/10 pt-2 mt-2">
                      <span className="text-gray-300">Base Version</span>
                      <span className="text-gray-400">
                        {100 - object.variants.reduce((sum, v) => sum + v.chance, 0)}%
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Curse Chance (if applicable) */}
              {object.curse && object.curse.curse_chance > 0 && (
                <div className="bg-red-900/20 rounded-lg p-4 border border-red-500/30">
                  <div className="text-sm text-red-400 font-semibold mb-2">☠️ CURSE SPAWN CHANCE</div>
                  <div className="text-2xl font-bold text-red-400">{object.curse.curse_chance}%</div>
                  <p className="text-gray-400 text-sm mt-1">Roll d100 when item spawns. Result ≤ {object.curse.curse_chance} = cursed.</p>
                </div>
              )}

              {/* Session Notes */}
              <div className="bg-blue-900/20 rounded-lg p-4 border border-blue-500/30">
                <div className="text-sm text-blue-400 font-semibold mb-2">📝 SESSION NOTES</div>
                <p className="text-xs text-gray-500 mb-3">Notes for this session ({sessionId}). Only you can see these.</p>
                <textarea
                  value={sessionNoteText}
                  onChange={(e) => setSessionNoteText(e.target.value)}
                  placeholder="Add notes for this object in the current session..."
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