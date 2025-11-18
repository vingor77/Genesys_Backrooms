import React, { useState } from 'react';

export default function Quest({ currQuest, onShowDetails, onUpdateStatus, onToggleVisibility, onToggleRewardVisibility, userIsDM, sessionId }) {
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  const getQuestTypeColor = (type) => {
    const colors = {
      'Main Quest': 'from-red-600 to-rose-700 text-red-300 border-red-500/50',
      'Side Quest': 'from-yellow-600 to-amber-700 text-yellow-300 border-yellow-500/50',
      'Bounty': 'from-orange-600 to-red-700 text-orange-300 border-orange-500/50',
      'Fetch Quest': 'from-blue-600 to-cyan-700 text-blue-300 border-blue-500/50',
      'Escort': 'from-green-600 to-emerald-700 text-green-300 border-green-500/50',
      'Investigation': 'from-purple-600 to-violet-700 text-purple-300 border-purple-500/50',
      'Delivery': 'from-teal-600 to-cyan-700 text-teal-300 border-teal-500/50',
      'Collection': 'from-pink-600 to-rose-700 text-pink-300 border-pink-500/50',
      'Exploration': 'from-indigo-600 to-blue-700 text-indigo-300 border-indigo-500/50',
      'Social': 'from-fuchsia-600 to-pink-700 text-fuchsia-300 border-fuchsia-500/50',
      'Repeatable': 'from-gray-600 to-slate-700 text-gray-300 border-gray-500/50'
    };
    return colors[type] || 'from-gray-600 to-slate-700 text-gray-300 border-gray-500/50';
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      'Easy': 'from-green-600 to-emerald-700 text-green-300 border-green-500/50',
      'Average': 'from-blue-600 to-cyan-700 text-blue-300 border-blue-500/50',
      'Hard': 'from-orange-600 to-amber-700 text-orange-300 border-orange-500/50',
      'Very Hard': 'from-red-600 to-rose-700 text-red-300 border-red-500/50',
      'Deadly': 'from-purple-600 to-fuchsia-700 text-purple-300 border-purple-500/50'
    };
    return colors[difficulty] || 'from-gray-600 to-slate-700 text-gray-300 border-gray-500/50';
  };

  const getStatusColor = (status) => {
    const colors = {
      'Available': 'bg-blue-500/90 text-white border-blue-400',
      'Active': 'bg-yellow-500/90 text-white border-yellow-400',
      'Completed': 'bg-green-500/90 text-white border-green-400',
      'Failed': 'bg-red-500/90 text-white border-red-400',
      'Abandoned': 'bg-gray-500/90 text-white border-gray-400'
    };
    return colors[status] || 'bg-gray-500/90 text-white border-gray-400';
  };

  const getStatusIcon = (status) => {
    const icons = {
      'Available': '📋',
      'Active': '⚡',
      'Completed': '✅',
      'Failed': '❌',
      'Abandoned': '🚫'
    };
    return icons[status] || '📋';
  };

  const getQuestTypeIcon = (type) => {
    const icons = {
      'Main Quest': '⚔️',
      'Side Quest': '🔍',
      'Bounty': '💰',
      'Fetch Quest': '📦',
      'Escort': '🛡️',
      'Investigation': '🔎',
      'Delivery': '📬',
      'Collection': '🗂️',
      'Exploration': '🗺️',
      'Social': '💬',
      'Repeatable': '🔄'
    };
    return icons[type] || '📜';
  };

  // Determine which objectives to show
  const chosenPath = currQuest.sessionProgress?.[sessionId]?.chosen_path;
  const pathData = chosenPath && currQuest.paths 
    ? currQuest.paths.find(p => p.name === chosenPath)
    : null;
  
  const displayObjectives = pathData ? pathData.objectives : currQuest.initial_objectives;
  const totalObjectives = displayObjectives?.length || 0;
  
  // Get completed objectives
  const completedObjectives = pathData 
    ? (currQuest.sessionProgress?.[sessionId]?.path_objectives_completed || [])
    : (currQuest.currentCompletedObjectives || []);
  
  const completedCount = completedObjectives.length || 0;
  const progressPercentage = totalObjectives > 0 ? (completedCount / totalObjectives) * 100 : 0;

  // Check if at turning point (initial objectives done but no path chosen)
  const initialCompleted = currQuest.currentCompletedObjectives?.length === currQuest.initial_objectives?.length;
  const atTurningPoint = currQuest.has_paths && initialCompleted && !chosenPath;

  // Get current rewards (from chosen path or fallback to base rewards)
  const getCurrentRewards = () => {
    if (pathData && pathData.rewards) {
      return pathData.rewards;
    }
    return currQuest.rewards || {};
  };

  // Check reward visibility
  const getRewardVisibility = (rewardType) => {
    const sessionOverride = currQuest.sessionRewardVisibility?.[sessionId];
    if (sessionOverride && sessionOverride[`${rewardType}_visible`] !== undefined) {
      return sessionOverride[`${rewardType}_visible`];
    }
    return getCurrentRewards()[rewardType]?.visible || false;
  };

  const currentRewards = getCurrentRewards();
  const isExperienceVisible = getRewardVisibility('experience');
  const isCurrencyVisible = getRewardVisibility('currency');
  const isReputationVisible = getRewardVisibility('reputation');
  const isItemsVisible = getRewardVisibility('items');
  const isOtherVisible = getRewardVisibility('other');

  const hasVisibleRewards = isExperienceVisible || isCurrencyVisible || isReputationVisible || isItemsVisible || isOtherVisible;

  // Check if has prerequisites
  const hasPrerequisites = (currQuest.prerequisite_quests && currQuest.prerequisite_quests.length > 0) ||
                           (currQuest.required_items && currQuest.required_items.length > 0) ||
                           currQuest.required_reputation;

  return (
    <div className="bg-black/20 backdrop-blur-lg border border-white/10 rounded-2xl overflow-hidden transition-all duration-300 hover:bg-black/30 hover:shadow-2xl group h-full flex flex-col">
      {/* Header with Image */}
      <div className="relative">
        {currQuest.quest_image_url ? (
          <div className="h-40 bg-gradient-to-b from-purple-900/50 to-transparent">
            <img 
              src={currQuest.quest_image_url} 
              alt={currQuest.name}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="h-40 bg-gradient-to-br from-purple-600/30 to-indigo-600/30 flex items-center justify-center">
            <span className="text-6xl">{getQuestTypeIcon(currQuest.quest_type)}</span>
          </div>
        )}
        
        {/* Status Indicators Overlay */}
        <div className="absolute top-2 right-2 flex flex-col space-y-2">
          {userIsDM && (
            <div className="relative">
              <button
                onClick={() => setShowStatusMenu(!showStatusMenu)}
                className={`${getStatusColor(currQuest.currentSessionStatus)} text-xs font-bold px-2 py-1 rounded-full border shadow-lg flex items-center space-x-1`}
              >
                <span>{getStatusIcon(currQuest.currentSessionStatus)}</span>
                <span>{currQuest.currentSessionStatus}</span>
              </button>
              
              {showStatusMenu && (
                <div className="absolute top-full right-0 mt-2 bg-slate-800 border border-white/20 rounded-lg shadow-xl z-10 min-w-[140px]">
                  {['Available', 'Active', 'Completed', 'Failed', 'Abandoned'].map(status => (
                    <button
                      key={status}
                      onClick={() => {
                        onUpdateStatus(currQuest, status);
                        setShowStatusMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-white hover:bg-white/10 transition-colors first:rounded-t-lg last:rounded-b-lg"
                    >
                      {getStatusIcon(status)} {status}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {userIsDM && currQuest.hiddenInCurrentSession && (
            <div className="bg-red-500/90 text-white text-xs font-bold px-2 py-1 rounded-full border border-red-400">
              🚫 HIDDEN
            </div>
          )}

          {/* Path/Choice Required Badge */}
          {userIsDM && atTurningPoint && (
            <div className="bg-orange-500/90 text-white text-xs font-bold px-2 py-1 rounded-full border border-orange-400 animate-pulse">
              ⚠️ CHOICE
            </div>
          )}

          {/* Current Path Badge */}
          {chosenPath && (
            <div className="bg-purple-500/90 text-white text-xs font-bold px-2 py-1 rounded-full border border-purple-400">
              {pathData?.icon || '🛤️'}
            </div>
          )}
        </div>

        {/* Quest Type Badge */}
        <div className="absolute top-2 left-2">
          <div className={`bg-gradient-to-r ${getQuestTypeColor(currQuest.quest_type)} px-3 py-1 rounded-full text-xs font-bold border`}>
            {getQuestTypeIcon(currQuest.quest_type)} {currQuest.quest_type}
          </div>
        </div>

        {/* Name Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <h3 className="text-lg font-bold text-white mb-1 group-hover:text-purple-300 transition-colors">
            {currQuest.name}
          </h3>
          {currQuest.is_part_of_chain && (
            <div className="text-xs text-purple-300">
              📚 {currQuest.chain_name} ({currQuest.chain_position}/{currQuest.chain_total})
            </div>
          )}
          {chosenPath && (
            <div className="text-xs text-green-300 mt-1">
              🛤️ Path: {chosenPath}
            </div>
          )}
        </div>
      </div>

      {/* Stats Chips */}
      <div className="p-4 space-y-3">
        <div className="flex flex-wrap gap-2 justify-center">
          <div className={`bg-gradient-to-r ${getDifficultyColor(currQuest.difficulty)} px-3 py-1 rounded-full text-xs font-bold border`}>
            {currQuest.difficulty}
          </div>
          {currQuest.can_fail && (
            <div className="bg-gradient-to-r from-red-600 to-rose-700 text-red-300 px-3 py-1 rounded-full text-xs font-bold border border-red-500/50">
              ⚠️ Can Fail
            </div>
          )}
          {currQuest.has_paths && (
            <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-indigo-300 px-3 py-1 rounded-full text-xs font-bold border border-indigo-500/50">
              🔀 {currQuest.paths?.length || 0} Paths
            </div>
          )}
        </div>

        {/* Prerequisites */}
        {hasPrerequisites && (
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-2">
            <div className="text-xs font-bold text-red-300 mb-1 flex items-center">
              <span className="mr-1">🔒</span>
              Prerequisites Required
            </div>
            <div className="space-y-1">
              {currQuest.prerequisite_quests && currQuest.prerequisite_quests.length > 0 && (
                <div className="text-xs text-red-200">
                  Quest: {currQuest.prerequisite_quests.join(', ')}
                </div>
              )}
              {currQuest.required_items && currQuest.required_items.length > 0 && (
                <div className="text-xs text-red-200">
                  Items: {currQuest.required_items.join(', ')}
                </div>
              )}
              {currQuest.required_reputation && (
                <div className="text-xs text-red-200">
                  Rep: {currQuest.required_reputation}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Quest Giver */}
        {currQuest.quest_giver && (
          <div className="bg-white/5 rounded-lg p-2 text-center">
            <div className="text-xs text-gray-400">Quest Giver:</div>
            <div className="text-sm text-purple-300 font-medium">{currQuest.quest_giver}</div>
            {currQuest.quest_giver_location && (
              <div className="text-xs text-gray-400">{currQuest.quest_giver_location}</div>
            )}
          </div>
        )}

        {/* Objectives Progress */}
        {totalObjectives > 0 && (
          <div className="bg-white/5 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-300">
                {chosenPath ? 'Path Progress' : 'Objectives'}
              </span>
              <span className="text-xs font-bold text-purple-300">{completedCount}/{totalObjectives}</span>
            </div>
            <div className="w-full bg-black/30 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Description Preview */}
      <div className="flex-1 p-4 pt-0">
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 h-full overflow-y-auto">
          <div className="text-xs font-medium text-purple-400 mb-2">
            {chosenPath ? 'Current Path:' : 'Description:'}
          </div>
          <p className="text-gray-300 text-sm leading-relaxed line-clamp-3">
            {pathData ? pathData.short_description : (currQuest.short_description || currQuest.description)}
          </p>

          {/* Turning Point Alert */}
          {atTurningPoint && (
            <div className="mt-3 pt-3 border-t border-orange-500/30 bg-orange-500/10 rounded p-2">
              <div className="text-xs font-bold text-orange-300 flex items-center">
                <span className="mr-1">⚠️</span>
                Path Choice Required
              </div>
            </div>
          )}

          {/* Rewards Preview (ALWAYS SHOW IF VISIBLE) */}
          {hasVisibleRewards && !atTurningPoint && (
            <div className="mt-3 pt-3 border-t border-white/10">
              <div className="text-xs font-medium text-yellow-400 mb-2">
                Rewards:
                {chosenPath && <span className="text-green-300 ml-1">(from {pathData.name})</span>}
              </div>
              <div className="space-y-1 text-xs text-gray-300">
                {isExperienceVisible && currentRewards.experience?.amount && (
                  <div>⭐ {currentRewards.experience.amount} XP</div>
                )}
                {isCurrencyVisible && currentRewards.currency?.amount && (
                  <div>💰 {currentRewards.currency.amount} Credits</div>
                )}
                {isReputationVisible && currentRewards.reputation?.text && (
                  <div className="line-clamp-1">🎖️ {currentRewards.reputation.text}</div>
                )}
                {isItemsVisible && currentRewards.items?.list?.length > 0 && (
                  <div>🎁 {currentRewards.items.list.length} item(s)</div>
                )}
                {isOtherVisible && currentRewards.other?.text && (
                  <div>🎁 {currentRewards.other.text} </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="border-t border-white/10 p-4 space-y-2">
        <div className="flex flex-col gap-2">
          <button
            onClick={() => onShowDetails(currQuest)}
            className="flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600/20 to-indigo-600/20 hover:from-purple-600/30 hover:to-indigo-600/30 text-purple-300 font-medium px-4 py-2 rounded-lg border border-purple-500/30 transition-all duration-300"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"></path>
            </svg>
            <span>View Full Details</span>
          </button>
          
          {userIsDM && (
            <button
              onClick={() => onToggleVisibility(currQuest)}
              className={`flex items-center justify-center space-x-2 font-medium px-4 py-2 rounded-lg transition-all duration-300 ${
                currQuest.hiddenInCurrentSession
                  ? 'bg-gradient-to-r from-emerald-600/20 to-green-600/20 hover:from-emerald-600/30 hover:to-green-600/30 text-emerald-300 border border-emerald-500/30'
                  : 'bg-gradient-to-r from-red-600/20 to-pink-600/20 hover:from-red-600/30 hover:to-pink-600/30 text-red-300 border border-red-500/30'
              }`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                {currQuest.hiddenInCurrentSession ? (
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                ) : (
                  <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd"></path>
                )}
                {currQuest.hiddenInCurrentSession && <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"></path>}
              </svg>
              <span>{currQuest.hiddenInCurrentSession ? '👁️ Reveal' : '🚫 Hide'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Tags */}
      {currQuest.tags && currQuest.tags.length > 0 && (
        <div className="px-4 pb-4">
          <div className="flex flex-wrap gap-1">
            {currQuest.tags.slice(0, 4).map((tag, idx) => (
              <span key={idx} className="bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded text-xs border border-purple-500/30">
                {tag}
              </span>
            ))}
            {currQuest.tags.length > 4 && (
              <span className="bg-gray-500/20 text-gray-300 px-2 py-0.5 rounded text-xs border border-gray-500/30">
                +{currQuest.tags.length - 4}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}