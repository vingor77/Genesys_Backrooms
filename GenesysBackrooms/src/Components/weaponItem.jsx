import { doc, updateDoc } from "firebase/firestore";
import { useState } from "react";
import db from '../Components/firebase';

// Anomalous Effect Modal Component
const AnomalousEffectModal = ({ isOpen, onClose, weapon }) => {
  if (!isOpen || !weapon) return null;

  const getRarityColor = (rarity) => {
    if(rarity < 2) return 'from-gray-600 to-gray-700';
    if(rarity < 4) return 'from-blue-600 to-blue-700';
    if(rarity < 6) return 'from-purple-600 to-purple-700';
    if(rarity < 8) return 'from-orange-600 to-orange-700';
    return 'from-red-600 to-red-700';
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[10000] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className={`bg-gradient-to-br ${getRarityColor(weapon.rarity)} backdrop-blur-xl border border-white/20 rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-black/20 border-b border-white/10 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <svg className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
              <h2 className="text-xl font-bold text-white">{weapon.name} - Anomalous Effect</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6">
            <p className="text-white text-lg leading-relaxed">
              {weapon.anomalousEffect}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-white/10 p-4">
          <button
            onClick={onClose}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default function WeaponItem(props) {
  const [anomalousDisplayed, setAnomalousDisplayed] = useState(false);
  const specials = props.currWeapon.specials ? props.currWeapon.specials.split("/").filter(Boolean) : [];

  // Get rarity color and gradient
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

  // Get weapon type icon based on skill
  const getWeaponIcon = (skill) => {
    const iconMap = {
      'Melee': '⚔️',
      'Ranged': '🏹',
      'Gunnery': '🚀',
      'Heavy': '🔨',
      'Light': '🗡️',
      'Firearms': '🔫',
      'Thrown': '🪃'
    };
    return iconMap[skill] || '⚔️';
  };

  const isAdmin = localStorage.getItem('loggedIn')?.toUpperCase() === 'ADMIN';
  const isHidden = props.currWeapon.hidden === 'Yes';
  const hasAnomalousEffect = props.currWeapon.anomalousEffect !== "None";
  const isMelee = props.currWeapon.skill === 'Melee';

  const flipHidden = () => {
    updateDoc(doc(db, 'Weapons', props.currWeapon.name), {
      hidden: props.currWeapon.hidden === 'Yes' ? 'No' : 'Yes'
    });
  };

  return (
    <>
      <div className="bg-black/20 backdrop-blur-lg border border-white/10 rounded-2xl overflow-hidden transition-all duration-300 hover:bg-black/30 hover:scale-105 hover:shadow-2xl group h-full flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600/30 to-red-600/30 border-b border-white/10 p-4 relative">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-2">
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-xl border border-white/20">
                {getWeaponIcon(props.currWeapon.skill)}
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-orange-300 transition-colors">
                {props.currWeapon.name}
              </h3>
            </div>
            <div className="text-sm text-orange-300">
              {props.currWeapon.skill} Weapon
            </div>
          </div>
          
          {/* Status Indicator */}
          <div className="absolute top-4 right-4">
            <div className={`w-3 h-3 rounded-full ${!isHidden ? 'bg-green-400' : 'bg-red-400'} shadow-lg ring-2 ring-white/30`}></div>
          </div>
        </div>

        {/* Stats Chips */}
        <div className="p-4 space-y-3">
          <div className="flex flex-wrap gap-2 justify-center">
            <div className={`bg-gradient-to-r ${getRarityColor(props.currWeapon.rarity)} px-3 py-1 rounded-full text-xs font-bold border`}>
              {getRarityLabel(props.currWeapon.rarity)} ({props.currWeapon.rarity})
            </div>
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-green-300 px-3 py-1 rounded-full text-xs font-bold border border-green-500/50">
              Price: {props.currWeapon.price}
            </div>
            {hasAnomalousEffect && (
              <div className="bg-gradient-to-r from-yellow-600 to-amber-600 text-yellow-300 px-3 py-1 rounded-full text-xs font-bold border border-yellow-500/50">
                Anomalous
              </div>
            )}
            {isHidden && isAdmin && (
              <div className="bg-gradient-to-r from-red-600 to-pink-600 text-red-300 px-3 py-1 rounded-full text-xs font-bold border border-red-500/50">
                Hidden
              </div>
            )}
          </div>

          {/* Combat Stats */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-red-600/20 text-red-300 px-2 py-1 rounded text-xs border border-red-500/30 text-center">
              <div className="font-bold">{isMelee ? '+' : ''}{props.currWeapon.damage}</div>
              <div className="text-xs opacity-75">Damage</div>
            </div>
            <div className="bg-yellow-600/20 text-yellow-300 px-2 py-1 rounded text-xs border border-yellow-500/30 text-center">
              <div className="font-bold">{props.currWeapon.crit}</div>
              <div className="text-xs opacity-75">Critical</div>
            </div>
            <div className="bg-blue-600/20 text-blue-300 px-2 py-1 rounded text-xs border border-blue-500/30 text-center">
              <div className="font-bold">{props.currWeapon.range}</div>
              <div className="text-xs opacity-75">Range</div>
            </div>
            <div className="bg-amber-600/20 text-amber-300 px-2 py-1 rounded text-xs border border-amber-500/30 text-center">
              <div className="font-bold">{props.currWeapon.encumbrance}</div>
              <div className="text-xs opacity-75">Encumbrance</div>
            </div>
          </div>

          {/* Specials */}
          {specials.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-medium text-gray-400 text-center">Special Properties:</div>
              <div className="grid grid-cols-2 lg:grid-cols-3">
                {specials.map((special, index) => (
                  <div key={index} className="bg-cyan-600/20 text-cyan-300 px-2 py-1 rounded text-xs border border-cyan-500/30">
                    {special}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Set Bonus */}
          {props.currWeapon.setBonus && props.currWeapon.setBonus !== "None" && (
            <div className="space-y-2">
              <div className="text-xs font-medium text-gray-400 text-center">Set Bonus:</div>
              <div className="bg-pink-600/20 text-pink-300 px-3 py-1 rounded-full text-xs border border-pink-500/30 text-center font-bold">
                {props.currWeapon.setBonus}
              </div>
            </div>
          )}

          {/* Additional Stats */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-purple-600/20 text-purple-300 px-2 py-1 rounded border border-purple-500/30 text-center">
              <div className="font-bold">{props.currWeapon.skill}</div>
              <div className="text-xs opacity-75">Skill</div>
            </div>
            <div className="bg-green-600/20 text-green-300 px-2 py-1 rounded border border-green-500/30 text-center">
              <div className="font-bold">{props.currWeapon.repairSkill}</div>
              <div className="text-xs opacity-75">Repair Skill</div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="flex-1 p-4 pt-0">
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 h-full overflow-y-auto">
            <p className="text-gray-300 text-sm leading-relaxed italic">
              {props.currWeapon.description}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="border-t border-white/10 p-4 space-y-2">
          <div className="flex flex-col gap-2">
            {hasAnomalousEffect && (
              <button
                onClick={() => setAnomalousDisplayed(true)}
                className="flex items-center justify-center space-x-2 bg-gradient-to-r from-yellow-600/20 to-amber-600/20 hover:from-yellow-600/30 hover:to-amber-600/30 text-yellow-300 font-medium px-4 py-2 rounded-lg border border-yellow-500/30 transition-all duration-300 hover:scale-105"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
                <span>Anomalous Effect</span>
              </button>
            )}
            
            {isAdmin && (
              <button
                onClick={flipHidden}
                className={`flex items-center justify-center space-x-2 font-medium px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105 ${
                  isHidden 
                    ? 'bg-gradient-to-r from-green-600/20 to-emerald-600/20 hover:from-green-600/30 hover:to-emerald-600/30 text-green-300 border border-green-500/30'
                    : 'bg-gradient-to-r from-red-600/20 to-pink-600/20 hover:from-red-600/30 hover:to-pink-600/30 text-red-300 border border-red-500/30'
                }`}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  {isHidden ? (
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                  ) : (
                    <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd"></path>
                  )}
                  {!isHidden && <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"></path>}
                </svg>
                <span>{isHidden ? 'Show' : 'Hide'} Weapon</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Anomalous Effect Modal */}
      <AnomalousEffectModal 
        isOpen={anomalousDisplayed}
        onClose={() => setAnomalousDisplayed(false)}
        weapon={props.currWeapon}
      />
    </>
  );
}