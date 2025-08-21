import { doc, updateDoc } from "firebase/firestore";
import db from '../Components/firebase';

export default function MundaneItem(props) {
  const usedBy = props.currMundane.usedBy 
    ? props.currMundane.usedBy.split("/").filter(Boolean)
    : [];

  // Get rarity color and gradient
  const getRarityColor = (rarity) => {
    const rarityMap = {
      0: 'from-gray-600 to-gray-700 text-gray-300 border-gray-500/50',
      1: 'from-green-600 to-green-700 text-green-300 border-green-500/50',
      2: 'from-emerald-600 to-emerald-700 text-emerald-300 border-emerald-500/50',
      3: 'from-blue-600 to-blue-700 text-blue-300 border-blue-500/50',
      4: 'from-indigo-600 to-indigo-700 text-indigo-300 border-indigo-500/50',
      5: 'from-purple-600 to-purple-700 text-purple-300 border-purple-500/50',
      6: 'from-pink-600 to-pink-700 text-pink-300 border-pink-500/50',
      7: 'from-red-600 to-red-700 text-red-300 border-red-500/50',
      8: 'from-orange-600 to-orange-700 text-orange-300 border-orange-500/50',
      9: 'from-amber-600 to-amber-700 text-amber-300 border-amber-500/50',
      10: 'from-yellow-600 to-yellow-700 text-yellow-300 border-yellow-500/50'
    };
    return rarityMap[rarity] || rarityMap[0];
  };

  const getRarityLabel = (rarity) => {
    const labels = {
      0: 'Common',
      1: 'Uncommon',
      2: 'Rare',
      3: 'Epic',
      4: 'Legendary',
      5: 'Artifact',
      6: 'Mythic',
      7: 'Divine',
      8: 'Cosmic',
      9: 'Transcendent',
      10: 'Absolute'
    };
    return labels[rarity] || 'Common';
  };

  // Get item category icon based on common item types
  const getItemIcon = (name) => {
    const itemName = name.toLowerCase();
    if (itemName.includes('book') || itemName.includes('tome') || itemName.includes('manual')) return '📚';
    if (itemName.includes('tool') || itemName.includes('kit')) return '🛠️';
    if (itemName.includes('potion') || itemName.includes('vial') || itemName.includes('bottle')) return '🧪';
    if (itemName.includes('key') || itemName.includes('lock')) return '🗝️';
    if (itemName.includes('rope') || itemName.includes('chain')) return '🪢';
    if (itemName.includes('torch') || itemName.includes('lantern') || itemName.includes('light')) return '🔦';
    if (itemName.includes('bag') || itemName.includes('pack') || itemName.includes('container')) return '🎒';
    if (itemName.includes('coin') || itemName.includes('gold') || itemName.includes('silver')) return '🪙';
    if (itemName.includes('gem') || itemName.includes('jewel') || itemName.includes('crystal')) return '💎';
    if (itemName.includes('scroll') || itemName.includes('parchment')) return '📜';
    return '📦'; // Default generic item
  };

  const isAdmin = localStorage.getItem('loggedIn')?.toUpperCase() === 'ADMIN';
  const isHidden = props.currMundane.hidden === 'Yes';
  
  const flipHidden = () => {
    updateDoc(doc(db, 'MundaneObjects', props.currMundane.name), {
      hidden: props.currMundane.hidden === 'Yes' ? 'No' : 'Yes'
    });
  };

  return (
    <div className="bg-black/20 backdrop-blur-lg border border-white/10 rounded-2xl overflow-hidden transition-all duration-300 hover:bg-black/30 hover:scale-105 hover:shadow-2xl group h-full flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-600/30 to-orange-600/30 border-b border-white/10 p-4 relative">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-xl border border-white/20">
              {getItemIcon(props.currMundane.name)}
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
              {props.currMundane.name}
            </h3>
          </div>
          <div className="text-sm text-amber-300">
            Mundane Item
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
          <div className={`bg-gradient-to-r ${getRarityColor(props.currMundane.rarity)} px-3 py-1 rounded-full text-xs font-bold border`}>
            {getRarityLabel(props.currMundane.rarity)} ({props.currMundane.rarity})
          </div>
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-green-300 px-3 py-1 rounded-full text-xs font-bold border border-green-500/50">
            Price: {props.currMundane.price}
          </div>
          {isHidden && isAdmin && (
            <div className="bg-gradient-to-r from-red-600 to-pink-600 text-red-300 px-3 py-1 rounded-full text-xs font-bold border border-red-500/50">
              Hidden
            </div>
          )}
        </div>

        {/* Used By Section */}
        {usedBy.length > 0 && (
          <div className="space-y-2">
            <div className="text-xs font-medium text-gray-400 text-center">Used By:</div>
            <div className="flex flex-wrap gap-1 justify-center">
              {usedBy.slice(0, 3).map((user, index) => (
                <div key={index} className="bg-blue-600/20 text-blue-300 px-2 py-1 rounded text-xs border border-blue-500/30">
                  {user}
                </div>
              ))}
              {usedBy.length > 3 && (
                <div className="bg-gray-600/20 text-gray-300 px-2 py-1 rounded text-xs border border-gray-500/30">
                  +{usedBy.length - 3} more
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Description */}
      <div className="flex-1 p-4 pt-0">
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 h-full overflow-y-auto">
          <p className="text-gray-300 text-sm leading-relaxed italic">
            {props.currMundane.description}
          </p>
        </div>
      </div>

      {/* Admin Button */}
      {isAdmin && (
        <div className="border-t border-white/10 p-4">
          <button
            onClick={flipHidden}
            className={`w-full flex items-center justify-center space-x-2 font-medium px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105 ${
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
            <span>{isHidden ? 'Show' : 'Hide'} Object</span>
          </button>
        </div>
      )}
    </div>
  );
}