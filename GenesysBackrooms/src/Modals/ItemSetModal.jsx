import React, { useState } from 'react';
import { doc, updateDoc } from "firebase/firestore";
import db from '../Structural/Firebase';
import { getActiveSession } from '../Structural/Session_Utils';

export default function ItemSetModal({ itemSet, onClose, userIsDM, onToggleVisibility }) {
  const [activeTab, setActiveTab] = useState('overview');
  const sessionId = getActiveSession();

  // Calculate discovered pieces for this session
  const getDiscoveredPieceIds = () => {
    if (!itemSet.pieces) return [];
    const pieceVis = itemSet.pieceVisibility?.[sessionId] || {};
    return itemSet.pieces.filter(pieceId => pieceVis[pieceId] === 'visible');
  };

  const discoveredPieceIds = getDiscoveredPieceIds();
  const discoveredCount = userIsDM ? (itemSet.pieces?.length || 0) : discoveredPieceIds.length;

  // Toggle individual piece visibility
  const togglePieceVisibility = async (pieceId) => {
    if (!userIsDM) return;
    
    try {
      const itemSetRef = doc(db, 'ItemSets', itemSet.id);
      const currentVis = itemSet.pieceVisibility?.[sessionId]?.[pieceId];
      const newVis = currentVis === 'visible' ? 'hidden' : 'visible';
      
      await updateDoc(itemSetRef, {
        [`pieceVisibility.${sessionId}.${pieceId}`]: newVis
      });
    } catch (error) {
      console.error('Error updating piece visibility:', error);
    }
  };

  // Reveal all pieces at once
  const revealAllPieces = async () => {
    if (!userIsDM || !itemSet.pieces) return;
    
    try {
      const itemSetRef = doc(db, 'ItemSets', itemSet.id);
      const updates = {};
      itemSet.pieces.forEach(pieceId => {
        updates[`pieceVisibility.${sessionId}.${pieceId}`] = 'visible';
      });
      await updateDoc(itemSetRef, updates);
    } catch (error) {
      console.error('Error revealing all pieces:', error);
    }
  };

  // Hide all pieces at once
  const hideAllPieces = async () => {
    if (!userIsDM || !itemSet.pieces) return;
    
    try {
      const itemSetRef = doc(db, 'ItemSets', itemSet.id);
      const updates = {};
      itemSet.pieces.forEach(pieceId => {
        updates[`pieceVisibility.${sessionId}.${pieceId}`] = 'hidden';
      });
      await updateDoc(itemSetRef, updates);
    } catch (error) {
      console.error('Error hiding all pieces:', error);
    }
  };

  // Check if a piece is visible
  const isPieceVisible = (pieceId) => {
    return itemSet.pieceVisibility?.[sessionId]?.[pieceId] === 'visible';
  };

  if (!itemSet) return null;

  const handleToggleVisibility = async () => {
    if (onToggleVisibility) {
      await onToggleVisibility(itemSet.id, itemSet.isHidden);
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

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'Common': return 'text-gray-400';
      case 'Uncommon': return 'text-green-400';
      case 'Rare': return 'text-blue-400';
      case 'Legendary': return 'text-amber-400';
      default: return 'text-gray-400';
    }
  };

  const getRarityBg = (rarity) => {
    switch (rarity) {
      case 'Common': return 'from-gray-900/50 to-slate-900/50';
      case 'Uncommon': return 'from-green-900/50 to-emerald-900/50';
      case 'Rare': return 'from-blue-900/50 to-indigo-900/50';
      case 'Legendary': return 'from-amber-900/50 to-orange-900/50';
      default: return 'from-gray-900/50 to-slate-900/50';
    }
  };

  const getThemeColor = (theme) => {
    if (!theme) return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    
    const lowerTheme = theme.toLowerCase();
    if (lowerTheme.includes('m.e.g') || lowerTheme.includes('meg') || lowerTheme.includes('military')) {
      return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
    if (lowerTheme.includes('aurielle') || lowerTheme.includes('sacred') || lowerTheme.includes('holy')) {
      return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
    }
    if (lowerTheme.includes('void') || lowerTheme.includes('dark') || lowerTheme.includes('cursed')) {
      return 'bg-red-500/20 text-red-400 border-red-500/30';
    }
    if (lowerTheme.includes('survival') || lowerTheme.includes('wanderer') || lowerTheme.includes('explorer')) {
      return 'bg-green-500/20 text-green-400 border-green-500/30';
    }
    if (lowerTheme.includes('ancient') || lowerTheme.includes('artifact') || lowerTheme.includes('legendary')) {
      return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    }
    if (lowerTheme.includes('stealth') || lowerTheme.includes('shadow') || lowerTheme.includes('covert')) {
      return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
    if (lowerTheme.includes('trade') || lowerTheme.includes('merchant') || lowerTheme.includes('b.n.t.g')) {
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    }
    return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
  };

  // Get bonus tiers sorted
  const bonusTiers = itemSet.bonuses 
    ? Object.keys(itemSet.bonuses).sort((a, b) => parseInt(a) - parseInt(b))
    : [];

  // Filter visible bonuses based on discovered pieces (players only)
  const visibleBonusTiers = userIsDM 
    ? bonusTiers 
    : bonusTiers.filter(tier => discoveredCount >= parseInt(tier));

  const pieceCount = itemSet.pieces?.length || 0;

  // All tabs visible to players for this simpler schema
  const playerTabs = [
    { id: 'overview', label: 'Overview', icon: '📋' },
    { id: 'bonuses', label: 'Set Bonuses', icon: '⚡' },
    { id: 'pieces', label: 'Pieces', icon: '🧩' },
  ];

  // DM-only tabs
  const dmTabs = [
    { id: 'dm-notes', label: 'DM Notes', icon: '📖' },
  ];

  const allTabs = userIsDM ? [...playerTabs, ...dmTabs] : playerTabs;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden border border-white/10">
        
        {/* Header */}
        <div className={`bg-gradient-to-r ${getRarityBg(itemSet.rarity_tier)} p-6 border-b border-white/10`}>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-3xl font-bold text-white">
                  {itemSet.name}
                </h2>
              </div>
              
              {/* Badges */}
              <div className="flex flex-wrap gap-2 mt-2">
                {itemSet.rarity_tier && (
                  <span className={`text-sm font-bold px-3 py-1 rounded-full ${getRarityColor(itemSet.rarity_tier)} bg-black/30`}>
                    {itemSet.rarity_tier}
                  </span>
                )}
                {itemSet.set_theme && (
                  <span className={`text-sm font-medium px-3 py-1 rounded border ${getThemeColor(itemSet.set_theme)}`}>
                    {itemSet.set_theme}
                  </span>
                )}
                <span className="text-sm font-medium px-3 py-1 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  {userIsDM ? `${pieceCount} Pieces` : `${discoveredCount}/${pieceCount} Discovered`}
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {/* Visibility Toggle (DM Only) */}
              {userIsDM && (
                <button
                  onClick={handleToggleVisibility}
                  className={`
                    flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all
                    ${itemSet.isHidden 
                      ? 'bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/50' 
                      : 'bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/50'
                    }
                  `}
                  title={itemSet.isHidden ? 'Click to show to players' : 'Click to hide from players'}
                >
                  {itemSet.isHidden ? (
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
                    ? 'text-cyan-400 border-b-2 border-cyan-400 bg-cyan-500/10'
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
              {/* Description */}
              {itemSet.description && (
                <div className="bg-black/30 rounded-lg p-4 border border-white/10">
                  <div className="text-sm text-gray-400 font-semibold mb-2">DESCRIPTION</div>
                  <p className="text-gray-300 leading-relaxed">{itemSet.description}</p>
                </div>
              )}

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-black/30 rounded-lg p-4 border border-cyan-500/30 text-center">
                  <div className="text-sm text-gray-400 mb-1">{userIsDM ? 'Total Pieces' : 'Discovered'}</div>
                  <div className="text-3xl font-bold text-cyan-400">
                    {userIsDM ? pieceCount : `${discoveredCount}/${pieceCount}`}
                  </div>
                </div>
                
                <div className="bg-black/30 rounded-lg p-4 border border-purple-500/30 text-center">
                  <div className="text-sm text-gray-400 mb-1">{userIsDM ? 'Bonus Tiers' : 'Bonuses Unlocked'}</div>
                  <div className="text-3xl font-bold text-purple-400">
                    {userIsDM ? bonusTiers.length : `${visibleBonusTiers.length}/${bonusTiers.length}`}
                  </div>
                </div>
                
                <div className="bg-black/30 rounded-lg p-4 border border-amber-500/30 text-center">
                  <div className="text-sm text-gray-400 mb-1">Max Bonus At</div>
                  <div className="text-3xl font-bold text-amber-400">
                    {bonusTiers.length > 0 ? bonusTiers[bonusTiers.length - 1] : '—'}
                    {bonusTiers.length > 0 && <span className="text-lg">pc</span>}
                  </div>
                </div>
              </div>

              {/* Bonus Preview */}
              {visibleBonusTiers.length > 0 ? (
                <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-lg p-4 border border-purple-500/30">
                  <div className="text-sm text-purple-300 font-semibold mb-3">
                    {userIsDM ? 'SET BONUSES PREVIEW' : 'UNLOCKED BONUSES'}
                  </div>
                  <div className="space-y-2">
                    {visibleBonusTiers.map((tier) => (
                      <div key={tier} className="flex items-center gap-3">
                        <span className="text-purple-400 font-bold bg-purple-500/20 px-2 py-0.5 rounded min-w-[50px] text-center">
                          {tier} pc
                        </span>
                        <span className="text-white font-medium">{itemSet.bonuses[tier].name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : !userIsDM && bonusTiers.length > 0 ? (
                <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-500/30">
                  <div className="flex items-center gap-3 text-gray-400">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <div>
                      <div className="font-medium">Bonuses Locked</div>
                      <div className="text-sm text-gray-500">
                        Discover at least {bonusTiers[0]} pieces to reveal the first bonus
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          )}

          {/* BONUSES TAB */}
          {activeTab === 'bonuses' && (
            <div className="space-y-6">
              {/* Info Box */}
              <div className="bg-purple-900/20 border border-purple-500/50 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <svg className="w-6 h-6 text-purple-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <div className="text-purple-400 font-bold mb-1">SET BONUS MECHANICS</div>
                    <p className="text-gray-300 text-sm">
                      {userIsDM 
                        ? "Equip multiple pieces from this set to activate bonuses. All bonuses at or below equipped piece count are active simultaneously."
                        : `Discover pieces to unlock bonus information. You've discovered ${discoveredCount}/${pieceCount} pieces.`
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* Bonus Tiers */}
              {bonusTiers.length > 0 ? (
                <div className="space-y-4">
                  {bonusTiers.map((tier, index) => {
                    const bonus = itemSet.bonuses[tier];
                    const isFirstTier = index === 0;
                    const isLastTier = index === bonusTiers.length - 1;
                    const isUnlocked = userIsDM || discoveredCount >= parseInt(tier);
                    
                    if (!isUnlocked) {
                      // Locked bonus display for players
                      return (
                        <div 
                          key={tier} 
                          className="bg-gray-900/50 rounded-lg p-5 border border-gray-500/30"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-lg font-bold px-3 py-1 rounded bg-gray-500/30 text-gray-400">
                              {tier} Pieces
                            </span>
                            <div className="flex items-center gap-2 text-gray-500">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                              </svg>
                              <span>Discover {parseInt(tier) - discoveredCount} more piece{parseInt(tier) - discoveredCount > 1 ? 's' : ''} to unlock</span>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    
                    return (
                      <div 
                        key={tier} 
                        className={`
                          bg-gradient-to-br rounded-lg p-5 border
                          ${isLastTier 
                            ? 'from-amber-900/30 to-orange-900/30 border-amber-500/50' 
                            : isFirstTier 
                              ? 'from-blue-900/20 to-cyan-900/20 border-blue-500/30'
                              : 'from-purple-900/20 to-indigo-900/20 border-purple-500/30'
                          }
                        `}
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <span className={`
                            text-lg font-bold px-3 py-1 rounded
                            ${isLastTier 
                              ? 'bg-amber-500/30 text-amber-300' 
                              : isFirstTier
                                ? 'bg-blue-500/30 text-blue-300'
                                : 'bg-purple-500/30 text-purple-300'
                            }
                          `}>
                            {tier} Pieces
                          </span>
                          <span className={`
                            text-xl font-bold
                            ${isLastTier ? 'text-amber-400' : isFirstTier ? 'text-blue-400' : 'text-purple-400'}
                          `}>
                            {bonus.name}
                          </span>
                          {isLastTier && (
                            <span className="text-xs bg-amber-500/30 text-amber-300 px-2 py-0.5 rounded">
                              MAX TIER
                            </span>
                          )}
                        </div>
                        
                        <p className="text-gray-300 mb-3">{bonus.description}</p>
                        
                        <div className="bg-black/30 rounded-lg p-3 border border-white/10">
                          <div className="text-xs text-gray-500 uppercase mb-1">Mechanical Effect</div>
                          <p className="text-gray-200 text-sm">{bonus.mechanical_effect}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-gray-400 text-lg">No bonuses defined</p>
                </div>
              )}
            </div>
          )}

          {/* PIECES TAB */}
          {activeTab === 'pieces' && (
            <div className="space-y-6">
              {/* Info */}
              <div className="bg-cyan-900/20 border border-cyan-500/50 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <svg className="w-6 h-6 text-cyan-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <div>
                    <div className="text-cyan-400 font-bold mb-1">SET PIECES</div>
                    <p className="text-gray-300 text-sm">
                      {userIsDM 
                        ? `This set contains ${pieceCount} pieces. Toggle visibility to reveal pieces as players discover them.`
                        : `You've discovered ${discoveredCount} of ${pieceCount} pieces in this set.`
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* DM Controls */}
              {userIsDM && itemSet.pieces && itemSet.pieces.length > 0 && (
                <div className="flex gap-2">
                  <button
                    onClick={revealAllPieces}
                    className="flex-1 bg-green-500/20 hover:bg-green-500/30 text-green-400 font-medium py-2 px-4 rounded-lg border border-green-500/50 transition-all flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Reveal All
                  </button>
                  <button
                    onClick={hideAllPieces}
                    className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 font-medium py-2 px-4 rounded-lg border border-red-500/50 transition-all flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                    Hide All
                  </button>
                </div>
              )}

              {/* Pieces Grid */}
              {itemSet.pieces && itemSet.pieces.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {itemSet.pieces.map((pieceId, index) => {
                    const isVisible = isPieceVisible(pieceId);
                    
                    if (userIsDM) {
                      // DM view with toggle
                      return (
                        <div 
                          key={pieceId} 
                          className={`
                            rounded-lg p-4 border transition-all cursor-pointer
                            ${isVisible 
                              ? 'bg-green-900/20 border-green-500/50 hover:border-green-400' 
                              : 'bg-black/30 border-white/10 hover:border-white/30'
                            }
                          `}
                          onClick={() => togglePieceVisibility(pieceId)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`
                                w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
                                ${isVisible ? 'bg-green-500/30 text-green-400' : 'bg-gray-500/30 text-gray-400'}
                              `}>
                                {index + 1}
                              </div>
                              <div>
                                <div className="text-white font-medium">{formatName(pieceId)}</div>
                              </div>
                            </div>
                            <div className={`
                              px-2 py-1 rounded text-xs font-bold
                              ${isVisible 
                                ? 'bg-green-500/20 text-green-400' 
                                : 'bg-gray-500/20 text-gray-400'
                              }
                            `}>
                              {isVisible ? 'VISIBLE' : 'HIDDEN'}
                            </div>
                          </div>
                        </div>
                      );
                    } else {
                      // Player view
                      if (isVisible) {
                        return (
                          <div 
                            key={pieceId} 
                            className="bg-cyan-900/20 rounded-lg p-4 border border-cyan-500/30"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold text-sm">
                                ✓
                              </div>
                              <div>
                                <div className="text-white font-medium">{formatName(pieceId)}</div>
                                <div className="text-xs text-cyan-400">Discovered</div>
                              </div>
                            </div>
                          </div>
                        );
                      } else {
                        return (
                          <div 
                            key={pieceId} 
                            className="bg-gray-900/50 rounded-lg p-4 border border-gray-500/30"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gray-500/30 flex items-center justify-center text-gray-500 font-bold text-sm">
                                ?
                              </div>
                              <div>
                                <div className="text-gray-500 font-medium">Undiscovered Piece</div>
                                <div className="text-xs text-gray-600">Find this piece to reveal it</div>
                              </div>
                            </div>
                          </div>
                        );
                      }
                    }
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <p className="text-gray-400 text-lg">No pieces defined</p>
                </div>
              )}

              {/* Bonus Requirements Summary */}
              {bonusTiers.length > 0 && (
                <div className="bg-black/30 rounded-lg p-4 border border-white/10">
                  <div className="text-sm text-gray-400 font-semibold mb-3">BONUS UNLOCK PROGRESS</div>
                  <div className="flex flex-wrap gap-2">
                    {bonusTiers.map((tier) => {
                      const isUnlocked = discoveredCount >= parseInt(tier);
                      return (
                        <div 
                          key={tier} 
                          className={`
                            flex items-center gap-2 px-3 py-1.5 rounded border
                            ${isUnlocked 
                              ? 'bg-purple-500/20 border-purple-500/30' 
                              : 'bg-gray-500/10 border-gray-500/30'
                            }
                          `}
                        >
                          <span className={isUnlocked ? 'text-purple-400' : 'text-gray-500'}>
                            {isUnlocked ? '✓' : '🔒'}
                          </span>
                          <span className={`font-bold ${isUnlocked ? 'text-purple-400' : 'text-gray-500'}`}>
                            {tier}/{pieceCount}
                          </span>
                          <span className="text-gray-400">→</span>
                          <span className={`text-sm ${isUnlocked ? 'text-white' : 'text-gray-500'}`}>
                            {isUnlocked ? itemSet.bonuses[tier].name : '???'}
                          </span>
                        </div>
                      );
                    })}
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <div>
                    <div className="text-purple-400 font-bold mb-1">DM ONLY</div>
                    <p className="text-gray-300 text-sm">
                      Use this section to track notes about this set and plan how to introduce pieces to players.
                    </p>
                  </div>
                </div>
              </div>

              {/* Set ID Reference */}
              <div className="bg-black/30 rounded-lg p-4 border border-white/10">
                <div className="text-sm text-gray-400 font-semibold mb-2">SET ID (for Object references)</div>
                <code className="text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded text-sm">{itemSet.id}</code>
                <p className="text-gray-500 text-xs mt-2">
                  Objects in this set should have <code className="text-gray-400">set_name: "{itemSet.name}"</code>
                </p>
              </div>

              {/* Piece IDs */}
              <div className="bg-black/30 rounded-lg p-4 border border-white/10">
                <div className="text-sm text-gray-400 font-semibold mb-2">PIECE IDS</div>
                <div className="space-y-1">
                  {itemSet.pieces?.map((pieceId) => (
                    <code key={pieceId} className="block text-sm text-gray-300 font-mono">{pieceId}</code>
                  ))}
                </div>
              </div>

              {/* Balance Notes */}
              <div className="bg-amber-900/20 rounded-lg p-4 border border-amber-500/30">
                <div className="text-sm text-amber-400 font-semibold mb-2">BALANCE NOTES</div>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• Rarity: <span className={getRarityColor(itemSet.rarity_tier)}>{itemSet.rarity_tier}</span></li>
                  <li>• Max bonus requires {bonusTiers.length > 0 ? bonusTiers[bonusTiers.length - 1] : '—'} of {pieceCount} pieces</li>
                  <li>• Theme: {itemSet.set_theme}</li>
                </ul>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}