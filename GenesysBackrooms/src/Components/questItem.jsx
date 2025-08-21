import React from 'react';
import db from '../Components/firebase';
import { doc, updateDoc } from "firebase/firestore";

export default function QuestItem(props) {
  const rewards = props.currQuest.rewards 
    ? props.currQuest.rewards.split("/").filter(Boolean)
    : [];

  const flipComplete = () => {
    updateDoc(doc(db, 'Quests', props.currQuest.name), {
      completed: props.currQuest.completed === 'Yes' ? 'No' : 'Yes'
    })
  }

  const flipHidden = () => {
    updateDoc(doc(db, 'Quests', props.currQuest.name), {
      hidden: props.currQuest.hidden === 'Yes' ? "No" : "Yes"
    })
  }

  const isAdmin = localStorage.getItem('loggedIn')?.toUpperCase() === 'ADMIN';
  const isCompleted = props.currQuest.completed === 'Yes';
  const isHidden = props.currQuest.hidden === 'Yes';
  const isAutoAcquired = props.currQuest.acquisition === 'None';

  // Get quest line color
  const getQuestLineTheme = (questLine) => {
    const themes = {
      'Main': { 
        gradient: 'from-red-600 to-red-700', 
        icon: '⚔️', 
        accent: 'red' 
      },
      'Side': { 
        gradient: 'from-yellow-600 to-orange-600', 
        icon: '🔍', 
        accent: 'yellow' 
      },
      'Daily': { 
        gradient: 'from-blue-600 to-cyan-600', 
        icon: '📅', 
        accent: 'blue' 
      },
      'Weekly': { 
        gradient: 'from-purple-600 to-pink-600', 
        icon: '📊', 
        accent: 'purple' 
      },
      'Event': { 
        gradient: 'from-green-600 to-emerald-600', 
        icon: '🎉', 
        accent: 'green' 
      },
      'Starter': { 
        gradient: 'from-teal-600 to-blue-600', 
        icon: '🌟', 
        accent: 'teal' 
      }
    };
    return themes[questLine] || { 
      gradient: 'from-gray-600 to-gray-700', 
      icon: '📜', 
      accent: 'gray' 
    };
  };

  const questTheme = getQuestLineTheme(props.currQuest.questLine);

  return (
    <div className={`w-full md:h-96 lg:h-80 rounded-xl shadow-lg border overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl relative ${
      isHidden && isAdmin 
        ? 'bg-gradient-to-br from-gray-700 to-gray-800 border-gray-600' 
        : isCompleted
          ? 'bg-gradient-to-br from-green-700 to-emerald-800 border-green-500/50'
          : `bg-gradient-to-br ${questTheme.gradient} border-white/20`
    }`}>
      
      {/* Header */}
      <div className="p-4 text-white relative">
        {/* Status Indicators */}
        <div className="absolute top-3 right-3 flex space-x-1">
          {isHidden && isAdmin && (
            <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">🚫</span>
            </div>
          )}
          {isCompleted && (
            <div className="w-5 h-5 bg-green-400 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">✓</span>
            </div>
          )}
        </div>

        {/* Quest Icon & Title */}
        <div className="flex items-start space-x-3 mb-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl backdrop-blur-sm flex-shrink-0">
            {questTheme.icon}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg leading-tight mb-1 truncate">{props.currQuest.name}</h3>
            <div className="flex items-center space-x-2">
              <span className={`inline-flex items-center px-2 py-1 bg-${questTheme.accent}-500/30 rounded-full text-xs font-medium`}>
                {props.currQuest.questLine}
              </span>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                isCompleted ? 'bg-green-500/30 text-green-200' : 'bg-orange-500/30 text-orange-200'
              }`}>
                {isCompleted ? '✅ Complete' : '⏳ In Progress'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-4 flex-1 flex flex-col">
        
        {/* Description */}
        <div className="bg-black/20 rounded-lg p-3 mb-3 flex-1">
          <p className="text-gray-200 text-sm leading-relaxed line-clamp-3">
            {props.currQuest.description || 'No description available'}
          </p>
        </div>

        {/* Quick Info */}
        <div className="space-y-2 mb-3">
          {/* Turn-in Location */}
          {props.currQuest.turnInLocation && (
            <div className="flex items-center text-gray-300 text-sm">
              <span className="text-blue-400 mr-2">📍</span>
              <span className="truncate">Turn in: {props.currQuest.turnInLocation}</span>
            </div>
          )}
          
          {/* Quest Giver */}
          {!isAutoAcquired && props.currQuest.questGiver && (
            <div className="flex items-center text-gray-300 text-sm">
              <span className="text-purple-400 mr-2">👤</span>
              <span className="truncate">From: {props.currQuest.questGiver}</span>
            </div>
          )}

          {/* Rewards */}
          {rewards.length > 0 && (
            <div className="space-y-1">
              <div className="flex items-center text-yellow-400 text-sm font-medium">
                <span className="mr-2">🎁</span>
                <span>Rewards:</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {rewards.map((reward, idx) => (
                  <span key={idx} className="bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded text-xs border border-yellow-500/30 break-words">
                    {reward}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {isAdmin && (
          <div className="flex space-x-2">
            <button
              onClick={flipComplete}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                isCompleted 
                  ? 'bg-orange-600 hover:bg-orange-700 text-white'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {isCompleted ? '⏳ Undo' : '✅ Complete'}
            </button>
            
            <button
              onClick={flipHidden}
              className="px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-all duration-300"
            >
              {isHidden ? '👁️' : '🚫'}
            </button>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
        <div 
          className={`h-full transition-all duration-1000 ${
            isCompleted ? 'bg-green-400 w-full' : 'bg-yellow-400 w-1/2'
          }`}
        />
      </div>
    </div>
  );
}