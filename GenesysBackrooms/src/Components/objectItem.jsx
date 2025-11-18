import db from '../Components/firebase';
import { updateDoc, doc } from "firebase/firestore";
import { useState, useRef, useEffect } from "react";

export default function ObjectItem(props) {
  const changeVisibility = () => {
    updateDoc(doc(db, 'Objects', props.currObject.name), {
      shownToPlayer: !props.currObject.shownToPlayer
    })
  }

  const getRarityColor = (rarity) => {
    if(rarity < 2) {
      return 'from-gray-600 to-gray-700 text-gray-300 border-gray-500/50';
    }
    if(rarity < 4) {
      return 'from-blue-600 to-blue-700 text-blue-300 border-blue-500/50';
    }
    if(rarity < 6) {
      return 'from-purple-600 to-purple-700 text-purple-300 border-purple-500/50';
    }
    if(rarity < 8) {
      return 'from-orange-600 to-orange-700 text-orange-300 border-orange-500/50';
    }
    return 'from-red-600 to-red-700 text-red-300 border-red-500/50';
  };

  const getRarityLabel = (rarity) => {
    if(rarity < 2) return 'Common';
    if(rarity < 4) return 'Uncommon';
    if(rarity < 6) return 'Rare';
    if(rarity < 8) return 'Epic';
    return 'Legendary';
  };

  const getTypeColor = (type) => {
    switch(type) {
      case 'Weapon':
        return 'from-red-600/30 to-pink-600/30';
      case 'Armor':
        return 'from-blue-600/30 to-cyan-600/30';
      case 'Mundane Object':
        return 'from-yellow-600/30 to-amber-600/30';
      case 'Object':
      default:
        return 'from-emerald-600/30 to-green-600/30';
    }
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'Weapon':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
        );
      case 'Armor':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'Mundane Object':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
          </svg>
        );
      case 'Object':
      default:
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
          </svg>
        );
    }
  };

  const isAdmin = localStorage.getItem('loggedIn')?.toUpperCase() === 'ADMIN';
  const isVisible = props.currObject.shownToPlayer;
  const itemType = props.currObject.type || 'Object';

  // Render type-specific stats
  const renderTypeStats = () => {
    switch(itemType) {
      case 'Weapon':
        return (
          <>
            <div className="bg-gradient-to-r from-red-600 to-pink-600 text-red-300 px-3 py-1 rounded-full text-xs font-bold border border-red-500/50">
              Damage: {props.currObject.damage}
            </div>
            <div className="bg-gradient-to-r from-orange-600 to-red-600 text-orange-300 px-3 py-1 rounded-full text-xs font-bold border border-orange-500/50">
              Crit: {props.currObject.critical}
            </div>
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-purple-300 px-3 py-1 rounded-full text-xs font-bold border border-purple-500/50">
              Range: {props.currObject.range}
            </div>
            {props.currObject.skill && (
              <div className="bg-gradient-to-r from-cyan-600 to-blue-600 text-cyan-300 px-3 py-1 rounded-full text-xs font-bold border border-cyan-500/50">
                Skill: {props.currObject.skill}
              </div>
            )}
          </>
        );
      
      case 'Armor':
        return (
          <>
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-blue-300 px-3 py-1 rounded-full text-xs font-bold border border-blue-500/50">
              Melee Def: {props.currObject.melee_defense}
            </div>
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-indigo-300 px-3 py-1 rounded-full text-xs font-bold border border-indigo-500/50">
              Ranged Def: {props.currObject.ranged_defense}
            </div>
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-green-300 px-3 py-1 rounded-full text-xs font-bold border border-green-500/50">
              Soak: {props.currObject.soak}
            </div>
            {props.currObject.equippedTo && (
              <div className="bg-gradient-to-r from-pink-600 to-rose-600 text-pink-300 px-3 py-1 rounded-full text-xs font-bold border border-pink-500/50">
                Slot: {props.currObject.equippedTo}
              </div>
            )}
          </>
        );
      
      case 'Mundane Object':
        return (
          <>
            {/* Mundane objects just show basic stats, mechanical effect is in description area */}
          </>
        );
      
      case 'Object':
      default:
        return (
          <>
            {/* Objects show basic stats, mechanical effect is in description area */}
          </>
        );
    }
  };

  // Render equipment traits for weapons/armor
  const renderEquipmentTraits = () => {
    if (props.currObject.equipmentTraits) {
      return (
        <div className="border-t border-white/10 pt-3 mt-3">
          <div className="text-xs font-medium text-blue-400 mb-1">Equipment Traits:</div>
          <p className="text-blue-300 text-xs leading-relaxed">
            {props.currObject.equipmentTraits}
          </p>
        </div>
      );
    }
    return null;
  };

  // Render extra effect if it exists
  const renderExtraEffect = () => {
    if (props.currObject.extraEffect) {
      return (
        <div className="border-t border-white/10 pt-3 mt-3">
          <div className="text-xs font-medium text-purple-400 mb-1">Special Effect:</div>
          <p className="text-purple-300 text-xs leading-relaxed">
            {props.currObject.extraEffect}
          </p>
        </div>
      );
    }
    return null;
  };

  // Render additional info based on type
  const renderAdditionalInfo = () => {
    const info = [];
    
    if (itemType === 'Weapon' || itemType === 'Armor') {
      if (props.currObject.hardpoints !== undefined) {
        info.push({ label: 'Hardpoints', value: props.currObject.hardpoints, color: 'text-cyan-400' });
      }
      if (props.currObject.repairSkill) {
        info.push({ label: 'Repair Skill', value: props.currObject.repairSkill, color: 'text-orange-400' });
      }
      if (props.currObject.set) {
        info.push({ label: 'Set', value: props.currObject.set, color: 'text-pink-400' });
      }
      if (props.currObject.equippedTo && itemType === 'Weapon') {
        info.push({ label: 'Equipped To', value: props.currObject.equippedTo, color: 'text-green-400' });
      }
    }

    if (info.length > 0) {
      return (
        <div className="border-t border-white/10 pt-3 mt-3 space-y-1">
          {info.map((item, index) => (
            <div key={index} className="flex justify-between text-xs">
              <span className="text-gray-400">{item.label}:</span>
              <span className={`font-medium ${item.color}`}>{item.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-black/20 backdrop-blur-lg border border-white/10 rounded-2xl overflow-hidden transition-all duration-300 hover:bg-black/30 hover:scale-105 hover:shadow-2xl group h-full flex flex-col">
      {/* Header */}
      <div className={`bg-gradient-to-r ${getTypeColor(itemType)} border-b border-white/10 p-4 relative`}>
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            {getTypeIcon(itemType)}
            <span className="text-xs font-medium text-white/70 uppercase tracking-wider">
              {itemType}
            </span>
          </div>
          <h3 className="text-lg font-bold text-white mb-1 group-hover:text-emerald-300 transition-colors">
            {props.currObject.name}
          </h3>
          <div className="text-sm text-emerald-300">
            Rarity: {props.currObject.rarity}
          </div>
        </div>
        
        {/* Status Indicator - Only show if shownToPlayer field exists */}
        {props.currObject.hasOwnProperty('shownToPlayer') && (
          <div className="absolute top-4 right-4">
            <div className={`w-3 h-3 rounded-full ${isVisible ? 'bg-green-400' : 'bg-red-400'} shadow-lg ring-2 ring-white/30`}></div>
          </div>
        )}
      </div>

      {/* Stats Chips */}
      <div className="p-4 space-y-3">
        <div className="flex flex-wrap gap-2 justify-center">
          <div className={`bg-gradient-to-r ${getRarityColor(props.currObject.rarity)} px-3 py-1 rounded-full text-xs font-bold border`}>
            {getRarityLabel(props.currObject.rarity)} ({props.currObject.rarity})
          </div>
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-green-300 px-3 py-1 rounded-full text-xs font-bold border border-green-500/50">
            Buy: {props.currObject.buy_price}
          </div>
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-blue-300 px-3 py-1 rounded-full text-xs font-bold border border-blue-500/50">
            Sell: {props.currObject.sell_price}
          </div>
          <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-amber-300 px-3 py-1 rounded-full text-xs font-bold border border-amber-500/50">
            Weight: {props.currObject.encumbrance}
          </div>
          {/* Type-specific stats */}
          {renderTypeStats()}
        </div>

        {/* Tags */}
        {props.currObject.tags && props.currObject.tags.length > 0 && (
          <div className="space-y-2">
            <div className="text-xs font-medium text-gray-400 text-center">Tags:</div>
            <div className="flex flex-wrap gap-1 justify-center">
              {props.currObject.tags.slice(0, 4).map((tag, index) => (
                <div key={index} className="bg-purple-600/20 text-purple-300 px-2 py-1 rounded text-xs border border-purple-500/30">
                  {tag}
                </div>
              ))}
              {props.currObject.tags.length > 4 && (
                <div className="bg-gray-600/20 text-gray-300 px-2 py-1 rounded text-xs border border-gray-500/30">
                  +{props.currObject.tags.length - 4} more
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Description */}
      <div className="flex-1 p-4 pt-0">
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 h-full overflow-y-auto">
          <p className="text-gray-300 text-sm leading-relaxed mb-3">
            {props.currObject.description}
          </p>
          
          {/* Mechanical Effect */}
          {props.currObject.mechanical_effect && (
            <div className="border-t border-white/10 pt-3">
              <div className="text-xs font-medium text-yellow-400 mb-1">Mechanical Effect:</div>
              <p className="text-yellow-300 text-xs leading-relaxed">
                {props.currObject.mechanical_effect}
              </p>
            </div>
          )}

          {/* Equipment Traits (Weapons/Armor) */}
          {renderEquipmentTraits()}

          {/* Extra Effect */}
          {renderExtraEffect()}

          {/* Additional Info */}
          {renderAdditionalInfo()}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="border-t border-white/10 p-4 space-y-2">
        <div className="flex flex-col sm:flex-row gap-2">
          {props.currObject.variants && props.currObject.variants.length > 0 && (
            <button
              onClick={() => props.onOpenTable && props.onOpenTable(props.currObject)}
              className="flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 hover:from-blue-600/30 hover:to-cyan-600/30 text-blue-300 font-medium px-4 py-2 rounded-lg border border-blue-500/30 transition-all duration-300 hover:scale-105"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clipRule="evenodd"></path>
              </svg>
              <span>View Variants ({props.currObject.variants.length})</span>
            </button>
          )}
          
          {isAdmin && props.currObject.hasOwnProperty('shownToPlayer') && (
            <button
              onClick={changeVisibility}
              className={`flex items-center justify-center space-x-2 font-medium px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105 ${
                isVisible 
                  ? 'bg-gradient-to-r from-red-600/20 to-pink-600/20 hover:from-red-600/30 hover:to-pink-600/30 text-red-300 border border-red-500/30'
                  : 'bg-gradient-to-r from-green-600/20 to-emerald-600/20 hover:from-green-600/30 hover:to-emerald-600/30 text-green-300 border border-green-500/30'
              }`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                {isVisible ? (
                  <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd"></path>
                ) : (
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                )}
                {!isVisible && <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"></path>}
              </svg>
              <span>{isVisible ? 'Hide' : 'Show'} Object</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}