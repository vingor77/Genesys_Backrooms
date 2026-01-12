import React from 'react';
import { getActiveSession } from '../Structural/Session_Utils';

export default function ItemSet({ itemSet, onClick, isHidden, userIsDM }) {
  const sessionId = getActiveSession();
  
  // Calculate discovered pieces for this session
  const getDiscoveredPieces = () => {
    if (!itemSet.pieces) return { discovered: 0, total: 0 };
    const pieceVis = itemSet.pieceVisibility?.[sessionId] || {};
    const discovered = itemSet.pieces.filter(pieceId => pieceVis[pieceId] === 'visible').length;
    return { discovered, total: itemSet.pieces.length };
  };

  const { discovered, total } = userIsDM 
    ? { discovered: itemSet.pieces?.length || 0, total: itemSet.pieces?.length || 0 }
    : getDiscoveredPieces();
  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'Common': return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
      case 'Uncommon': return 'text-green-400 bg-green-500/10 border-green-500/30';
      case 'Rare': return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
      case 'Legendary': return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
    }
  };

  const getRarityGlow = (rarity) => {
    switch (rarity) {
      case 'Common': return 'hover:shadow-gray-500/20';
      case 'Uncommon': return 'hover:shadow-green-500/20';
      case 'Rare': return 'hover:shadow-blue-500/20';
      case 'Legendary': return 'hover:shadow-amber-500/20';
      default: return 'hover:shadow-white/20';
    }
  };

  const getRarityBorder = (rarity) => {
    switch (rarity) {
      case 'Common': return 'hover:border-gray-500/50';
      case 'Uncommon': return 'hover:border-green-500/50';
      case 'Rare': return 'hover:border-blue-500/50';
      case 'Legendary': return 'hover:border-amber-500/50';
      default: return 'hover:border-white/50';
    }
  };

  const getThemeColor = (theme) => {
    if (!theme) return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
    
    const lowerTheme = theme.toLowerCase();
    if (lowerTheme.includes('m.e.g') || lowerTheme.includes('meg') || lowerTheme.includes('military')) {
      return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
    }
    if (lowerTheme.includes('aurielle') || lowerTheme.includes('sacred') || lowerTheme.includes('holy')) {
      return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
    }
    if (lowerTheme.includes('void') || lowerTheme.includes('dark') || lowerTheme.includes('cursed')) {
      return 'bg-red-500/10 text-red-400 border-red-500/30';
    }
    if (lowerTheme.includes('survival') || lowerTheme.includes('wanderer') || lowerTheme.includes('explorer')) {
      return 'bg-green-500/10 text-green-400 border-green-500/30';
    }
    if (lowerTheme.includes('ancient') || lowerTheme.includes('artifact') || lowerTheme.includes('legendary')) {
      return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    }
    if (lowerTheme.includes('stealth') || lowerTheme.includes('shadow') || lowerTheme.includes('covert')) {
      return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
    }
    if (lowerTheme.includes('trade') || lowerTheme.includes('merchant') || lowerTheme.includes('b.n.t.g')) {
      return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
    }
    return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
  };

  // Get bonus tiers sorted
  const bonusTiers = itemSet.bonuses 
    ? Object.keys(itemSet.bonuses).sort((a, b) => parseInt(a) - parseInt(b))
    : [];

  // Filter visible bonuses based on discovered pieces (players only)
  const visibleBonusTiers = userIsDM 
    ? bonusTiers 
    : bonusTiers.filter(tier => discovered >= parseInt(tier));

  const pieceCount = itemSet.pieces?.length || 0;

  return (
    <div
      onClick={onClick}
      className={`
        relative
        bg-gradient-to-br from-white/5 to-white/0
        backdrop-blur-lg
        rounded-2xl p-5
        border border-white/10
        ${getRarityBorder(itemSet.rarity_tier)}
        hover:shadow-xl ${getRarityGlow(itemSet.rarity_tier)}
        transition-all duration-300 cursor-pointer
        ${isHidden ? 'opacity-80' : ''}
      `}
    >
      {/* Hidden Badge (DM only) */}
      {userIsDM && isHidden && (
        <div className="absolute top-3 right-3">
          <span className="bg-red-500/20 text-red-400 px-2 py-0.5 rounded text-xs font-bold border border-red-500/50">
            HIDDEN
          </span>
        </div>
      )}

      {/* Header */}
      <div className="mb-3">
        <h3 className="text-xl font-bold text-white leading-tight pr-16 mb-2">
          {itemSet.name || 'Unknown Set'}
        </h3>
        
        {/* Rarity & Theme Badges */}
        <div className="flex flex-wrap gap-2">
          {itemSet.rarity_tier && (
            <span className={`text-xs font-bold px-2 py-0.5 rounded border ${getRarityColor(itemSet.rarity_tier)}`}>
              {itemSet.rarity_tier}
            </span>
          )}
          {itemSet.set_theme && (
            <span className={`text-xs font-medium px-2 py-0.5 rounded border ${getThemeColor(itemSet.set_theme)}`}>
              {itemSet.set_theme}
            </span>
          )}
        </div>
      </div>

      {/* Piece Count */}
      <div className="flex items-center gap-2 mb-3">
        <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        {userIsDM ? (
          <span className="text-cyan-400 font-medium">{pieceCount} Pieces</span>
        ) : (
          <span className="text-cyan-400 font-medium">{discovered}/{total} Discovered</span>
        )}
      </div>

      {/* Bonus Tiers Preview */}
      {visibleBonusTiers.length > 0 ? (
        <div className="space-y-2 mb-3">
          {visibleBonusTiers.slice(0, 2).map((tier) => (
            <div key={tier} className="flex items-center gap-2 text-sm">
              <span className="text-purple-400 font-bold min-w-[24px]">{tier}pc</span>
              <span className="text-gray-300 truncate">{itemSet.bonuses[tier].name}</span>
            </div>
          ))}
          {visibleBonusTiers.length > 2 && (
            <div className="text-xs text-gray-500">+{visibleBonusTiers.length - 2} more bonus{visibleBonusTiers.length - 2 > 1 ? 'es' : ''}</div>
          )}
        </div>
      ) : !userIsDM && bonusTiers.length > 0 ? (
        <div className="mb-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>Discover more pieces to reveal bonuses</span>
          </div>
        </div>
      ) : null}

      {/* Description Preview */}
      {itemSet.description && (
        <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed">
          {itemSet.description}
        </p>
      )}
    </div>
  );
}