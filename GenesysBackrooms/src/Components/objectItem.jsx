import db from '../Components/firebase';
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

  const isAdmin = localStorage.getItem('loggedIn')?.toUpperCase() === 'ADMIN';
  const isVisible = props.currObject.shownToPlayer;

  return (
    <div className="bg-black/20 backdrop-blur-lg border border-white/10 rounded-2xl overflow-hidden transition-all duration-300 hover:bg-black/30 hover:scale-105 hover:shadow-2xl group h-full flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600/30 to-green-600/30 border-b border-white/10 p-4 relative">
        <div className="text-center">
          <h3 className="text-lg font-bold text-white mb-1 group-hover:text-emerald-300 transition-colors">
            {props.currObject.name}
          </h3>
          <div className="text-sm text-emerald-300">
            Object #{props.currObject.objectNumber}
          </div>
        </div>
        
        {/* Status Indicator */}
        <div className="absolute top-4 right-4">
          <div className={`w-3 h-3 rounded-full ${isVisible ? 'bg-green-400' : 'bg-red-400'} shadow-lg ring-2 ring-white/30`}></div>
        </div>
      </div>

      {/* Stats Chips */}
      <div className="p-4 space-y-3">
        <div className="flex flex-wrap gap-2 justify-center">
          <div className={`bg-gradient-to-r ${getRarityColor(props.currObject.rarity)} px-3 py-1 rounded-full text-xs font-bold border`}>
            {getRarityLabel(props.currObject.rarity)} ({props.currObject.rarity})
          </div>
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-green-300 px-3 py-1 rounded-full text-xs font-bold border border-green-500/50">
            Price: {props.currObject.price}
          </div>
          <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-amber-300 px-3 py-1 rounded-full text-xs font-bold border border-amber-500/50">
            Weight: {props.currObject.encumbrance}
          </div>
        </div>

        {/* Spawn Locations */}
        {props.currObject.spawnLocations && props.currObject.spawnLocations.length > 0 && (
          <div className="space-y-2">
            <div className="text-xs font-medium text-gray-400 text-center">Spawn Locations:</div>
            <div className="flex flex-wrap gap-1 justify-center">
              {props.currObject.spawnLocations.slice(0, 3).map((location, index) => (
                <div key={index} className="bg-blue-600/20 text-blue-300 px-2 py-1 rounded text-xs border border-blue-500/30">
                  {location}
                </div>
              ))}
              {props.currObject.spawnLocations.length > 3 && (
                <div className="bg-gray-600/20 text-gray-300 px-2 py-1 rounded text-xs border border-gray-500/30">
                  +{props.currObject.spawnLocations.length - 3} more
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Description */}
      <div className="flex-1 p-4 pt-0">
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 h-full overflow-y-auto">
          <p className="text-gray-300 text-sm leading-relaxed">
            {props.currObject.description}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="border-t border-white/10 p-4 space-y-2">
        <div className="flex flex-col sm:flex-row gap-2">
          {props.currObject.table !== 'No' && (
            <button
              onClick={() => props.onOpenTable && props.onOpenTable(props.currObject)}
              className="flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 hover:from-blue-600/30 hover:to-cyan-600/30 text-blue-300 font-medium px-4 py-2 rounded-lg border border-blue-500/30 transition-all duration-300 hover:scale-105"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clipRule="evenodd"></path>
              </svg>
              <span>View Table</span>
            </button>
          )}
          
          {isAdmin && (
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