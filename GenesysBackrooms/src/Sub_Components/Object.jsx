import React from 'react';

export default function Object({ object, onClick, isHidden, userIsDM }) {
  if (!object) return null;

  const getTypeColor = (type) => {
    switch (type) {
      case 'Armor': return 'from-blue-600 to-blue-800 border-blue-500';
      case 'Weapon': return 'from-red-600 to-red-800 border-red-500';
      case 'Mundane Object': return 'from-gray-600 to-gray-800 border-gray-500';
      case 'Anomalous Object': return 'from-purple-600 to-purple-800 border-purple-500';
      case 'Construct': return 'from-amber-600 to-amber-800 border-amber-500';
      default: return 'from-gray-600 to-gray-800 border-gray-500';
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
    if (rarity <= 1) return 'text-gray-400 bg-gray-500/20 border-gray-500/50';
    if (rarity <= 3) return 'text-green-400 bg-green-500/20 border-green-500/50';
    if (rarity <= 5) return 'text-blue-400 bg-blue-500/20 border-blue-500/50';
    if (rarity <= 7) return 'text-purple-400 bg-purple-500/20 border-purple-500/50';
    if (rarity <= 9) return 'text-orange-400 bg-orange-500/20 border-orange-500/50';
    return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/50';
  };

  const getRarityLabel = (rarity) => {
    if (rarity <= 1) return 'Common';
    if (rarity <= 3) return 'Uncommon';
    if (rarity <= 5) return 'Rare';
    if (rarity <= 7) return 'Epic';
    if (rarity <= 9) return 'Legendary';
    return 'Mythic';
  };

  // Get primary stat based on type
  const getPrimaryStat = () => {
    switch (object.type) {
      case 'Armor':
        return { label: 'Soak', value: object.soak, icon: '🛡️' };
      case 'Weapon':
        return { label: 'Damage', value: object.damage, icon: '💥' };
      case 'Construct':
        return { label: 'HP', value: object.health_points, icon: '❤️' };
      case 'Mundane Object':
        return object.uses ? { label: 'Uses', value: object.uses, icon: '🔄' } : null;
      case 'Anomalous Object':
        return object.uses ? { label: 'Uses', value: object.uses, icon: '🔄' } : { label: 'Eternal', value: '∞', icon: '✨' };
      default:
        return null;
    }
  };

  const primaryStat = getPrimaryStat();

  return (
    <div
      onClick={onClick}
      className={`
        relative bg-gradient-to-br ${getTypeColor(object.type)} 
        rounded-xl p-4 cursor-pointer transition-all duration-300
        hover:scale-[1.02] hover:shadow-xl hover:shadow-black/50
        border border-opacity-50
        ${isHidden ? 'opacity-60' : ''}
      `}
    >
      {/* Hidden Badge */}
      {isHidden && userIsDM && (
        <div className="absolute top-2 right-2 bg-black/70 text-yellow-400 text-xs font-bold px-2 py-1 rounded-full flex items-center space-x-1">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
          </svg>
          <span>Hidden</span>
        </div>
      )}

      {/* Cursed Badge */}
      {object.curse?.is_cursed && (
        <div className="absolute top-2 left-2 bg-red-900/90 text-red-300 text-xs font-bold px-2 py-1 rounded-full">
          ☠️ Cursed
        </div>
      )}

      {/* Type Icon & Name */}
      <div className="flex items-start space-x-3 mb-3">
        <div className="text-3xl">{getTypeIcon(object.type)}</div>
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-bold text-lg leading-tight truncate">{object.name}</h3>
          <div className="text-white/70 text-sm">{object.type}</div>
        </div>
      </div>

      {/* Rarity & Price Row */}
      <div className="flex items-center justify-between mb-3">
        <span className={`px-2 py-0.5 rounded text-xs font-bold border ${getRarityColor(object.rarity)}`}>
          {getRarityLabel(object.rarity)} ({object.rarity})
        </span>
        <div className="text-yellow-300 text-sm font-medium">
          💰 {object.buy_price}
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        {primaryStat && (
          <div className="bg-black/30 rounded-lg p-2 text-center">
            <div className="text-xs text-white/60">{primaryStat.label}</div>
            <div className="text-white font-bold">{primaryStat.icon} {primaryStat.value}</div>
          </div>
        )}
        
        <div className="bg-black/30 rounded-lg p-2 text-center">
          <div className="text-xs text-white/60">Encum</div>
          <div className="text-white font-bold">⚖️ {object.encumbrance}</div>
        </div>

        {/* Type-specific secondary stat */}
        {object.type === 'Armor' && (
          <div className="bg-black/30 rounded-lg p-2 text-center">
            <div className="text-xs text-white/60">Durability</div>
            <div className="text-white font-bold">🔧 {object.durability}</div>
          </div>
        )}
        {object.type === 'Weapon' && (
          <div className="bg-black/30 rounded-lg p-2 text-center">
            <div className="text-xs text-white/60">Crit</div>
            <div className="text-white font-bold">💀 {object.critical}</div>
          </div>
        )}
        {object.type === 'Construct' && (
          <div className="bg-black/30 rounded-lg p-2 text-center">
            <div className="text-xs text-white/60">Soak</div>
            <div className="text-white font-bold">🛡️ {object.soak}</div>
          </div>
        )}
        {(object.type === 'Mundane Object' || object.type === 'Anomalous Object') && object.fuel_type && (
          <div className="bg-black/30 rounded-lg p-2 text-center">
            <div className="text-xs text-white/60">Fuel</div>
            <div className="text-white font-bold text-xs">🔋 Yes</div>
          </div>
        )}
        {(object.type === 'Mundane Object' || object.type === 'Anomalous Object') && !object.fuel_type && !primaryStat && (
          <div className="bg-black/30 rounded-lg p-2 text-center">
            <div className="text-xs text-white/60">Fuel</div>
            <div className="text-white font-bold text-xs">None</div>
          </div>
        )}
      </div>

      {/* Equipped To / Category */}
      {(object.equippedTo || object.construct_category) && (
        <div className="mb-3">
          <span className="px-2 py-1 rounded text-xs font-medium bg-white/10 text-white/80 border border-white/20">
            {object.equippedTo || object.construct_category}
          </span>
          {object.skill && (
            <span className="ml-2 px-2 py-1 rounded text-xs font-medium bg-white/10 text-white/80 border border-white/20">
              {object.skill}
            </span>
          )}
          {object.range && (
            <span className="ml-2 px-2 py-1 rounded text-xs font-medium bg-white/10 text-white/80 border border-white/20">
              {object.range}
            </span>
          )}
        </div>
      )}

      {/* Set Name */}
      {object.set_name && (
        <div className="mb-3">
          <span className="px-2 py-1 rounded text-xs font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30">
            🎴 {object.set_name}
          </span>
        </div>
      )}

      {/* Description Preview */}
      <p className="text-white/70 text-sm line-clamp-2 mb-2">
        {object.description}
      </p>

      {/* Bottom badges */}
      <div className="flex flex-wrap gap-1">
        {object.craftable && (
          <span className="px-2 py-0.5 rounded text-xs bg-green-500/20 text-green-300 border border-green-500/30">
            🔨 Craftable
          </span>
        )}
        {object.variants?.length > 0 && (
          <span className="px-2 py-0.5 rounded text-xs bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            🔀 {object.variants.length} Variants
          </span>
        )}
        {object.equipmentTraits && (
          <span className="px-2 py-0.5 rounded text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30">
            ⭐ Traits
          </span>
        )}
      </div>
    </div>
  );
}