import React, { useState } from 'react';

export default function CraftModal({ recipe, onClose, userIsDM, onToggleVisibility }) {
  const [activeTab, setActiveTab] = useState('overview');

  if (!recipe) return null;

  const handleToggleVisibility = async () => {
    if (onToggleVisibility) {
      await onToggleVisibility(recipe.id, recipe.isHidden);
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

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Simple': return 'text-green-400';
      case 'Easy': return 'text-blue-400';
      case 'Average': return 'text-yellow-400';
      case 'Hard': return 'text-orange-400';
      case 'Daunting': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getSkillColor = (skill) => {
    switch (skill) {
      case 'Metalworking': return 'text-gray-300';
      case 'Leatherworking': return 'text-amber-400';
      case 'Alchemy': return 'text-purple-400';
      case 'Carpentry': return 'text-yellow-600';
      case 'Cooking': return 'text-orange-400';
      default: return 'text-gray-400';
    }
  };

  // Tabs available to all users
  const playerTabs = [
    { id: 'overview', label: 'Overview', icon: '📋' },
    { id: 'materials', label: 'Materials', icon: '🧱' },
    { id: 'enhancements', label: 'Enhancements', icon: '✨' },
    { id: 'tools', label: 'Tools & Workshop', icon: '🔧' },
  ];

  // DM-only tabs
  const dmTabs = [
    { id: 'dm-notes', label: 'DM Notes', icon: '🎲' },
  ];

  const allTabs = userIsDM ? [...playerTabs, ...dmTabs] : playerTabs;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-white/10">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 p-6 border-b border-white/10">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">
                {recipe.name}
              </h2>
              <div className="flex items-center space-x-4">
                <span className={`text-lg font-semibold ${getSkillColor(recipe.crafting_skill)}`}>
                  {recipe.crafting_skill}
                </span>
                <span className="text-gray-400">•</span>
                <span className={`text-lg font-bold ${getDifficultyColor(recipe.base_difficulty)}`}>
                  {recipe.base_difficulty}
                </span>
                <span className="text-gray-400">•</span>
                <span className="text-blue-400 font-medium">
                  {recipe.crafting_time}
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
                    ${recipe.isHidden 
                      ? 'bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/50' 
                      : 'bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/50'
                    }
                  `}
                  title={recipe.isHidden ? 'Click to show to players' : 'Click to hide from players'}
                >
                  {recipe.isHidden ? (
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
        <div className="flex border-b border-white/10 bg-black/20 overflow-x-auto">
          {allTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                px-6 py-3 font-medium transition-all whitespace-nowrap
                ${activeTab === tab.id
                  ? 'text-purple-400 border-b-2 border-purple-400 bg-purple-500/10'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
                }
              `}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Key Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-black/30 rounded-lg p-4 border border-white/10">
                  <div className="text-sm text-gray-400 mb-1">Base Difficulty</div>
                  <div className={`text-2xl font-bold ${getDifficultyColor(recipe.base_difficulty)}`}>
                    {recipe.base_difficulty}
                  </div>
                </div>
                
                <div className="bg-black/30 rounded-lg p-4 border border-white/10">
                  <div className="text-sm text-gray-400 mb-1">Crafting Time</div>
                  <div className="text-2xl font-bold text-blue-400">
                    {recipe.crafting_time}
                  </div>
                </div>
                
                <div className="bg-black/30 rounded-lg p-4 border border-white/10">
                  <div className="text-sm text-gray-400 mb-1">Yield</div>
                  <div className="text-2xl font-bold text-green-400">
                    {recipe.yield || 1} item{recipe.yield > 1 ? 's' : ''}
                  </div>
                </div>
              </div>

              {/* Result Item */}
              <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-lg p-4 border border-purple-500/30">
                <div className="text-sm text-purple-300 font-semibold mb-2">CREATES</div>
                <div className="text-xl font-bold text-white">
                  {formatName(recipe.result_item_id)}
                </div>
              </div>

              {/* Crafting Notes */}
              {recipe.crafting_notes && (
                <div className="bg-black/30 rounded-lg p-4 border border-white/10">
                  <div className="text-sm text-gray-400 font-semibold mb-2">CRAFTING NOTES</div>
                  <p className="text-gray-300 leading-relaxed">
                    {recipe.crafting_notes}
                  </p>
                </div>
              )}

              {/* Enhancement Summary */}
              {recipe.enhancements && recipe.enhancements.length > 0 && (
                <div className="bg-purple-900/20 rounded-lg p-4 border border-purple-500/30">
                  <div className="text-sm text-purple-300 font-semibold mb-2">
                    AVAILABLE ENHANCEMENTS
                  </div>
                  <p className="text-gray-300 text-sm mb-3">
                    This recipe has {recipe.enhancements.length} optional enhancement{recipe.enhancements.length > 1 ? 's' : ''}. 
                    Each enhancement requires additional materials and upgrades the difficulty by one step.
                  </p>
                  <div className="space-y-2">
                    {recipe.enhancements.map((enhancement, index) => (
                      <div key={index} className="flex items-start space-x-2 text-sm">
                        <svg className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-300">
                          <span className="text-purple-300 font-medium">{enhancement.name}:</span> {enhancement.benefit}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* MATERIALS TAB */}
          {activeTab === 'materials' && (
            <div className="space-y-6">
              {/* Warning Box */}
              <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <svg className="w-6 h-6 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div>
                    <div className="text-red-400 font-bold mb-1">MATERIALS CONSUMED ON ATTEMPT</div>
                    <p className="text-gray-300 text-sm">
                      All materials (base and enhancements) are consumed when you attempt crafting, regardless of success or failure. 
                      You can only recover materials by spending Advantage or Triumph symbols.
                    </p>
                  </div>
                </div>
              </div>

              {/* Base Components */}
              <div>
                <div className="text-xl font-bold text-cyan-400 mb-3 flex items-center space-x-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  <span>Base Materials (Required)</span>
                </div>
                
                <div className="space-y-3">
                  {recipe.base_components && recipe.base_components.map((component, index) => (
                    <div key={index} className="bg-black/30 border border-cyan-500/30 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-white font-medium text-lg">
                          {formatName(component.item_id)}
                        </span>
                        <span className="text-cyan-400 font-bold text-xl">
                          × {component.quantity}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ENHANCEMENTS TAB */}
          {activeTab === 'enhancements' && (
            <div className="space-y-6">
              {recipe.enhancements && recipe.enhancements.length > 0 ? (
                <>
                  {/* Info Box */}
                  <div className="bg-purple-900/20 border border-purple-500/50 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <svg className="w-6 h-6 text-purple-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <div className="text-purple-400 font-bold mb-1">OPTIONAL ENHANCEMENTS</div>
                        <p className="text-gray-300 text-sm">
                          Each enhancement requires additional materials and <span className="text-purple-300 font-semibold">upgrades the difficulty by one step</span>. 
                          You can choose 0 to {recipe.enhancements.length} enhancement{recipe.enhancements.length > 1 ? 's' : ''}.
                          Enhancement benefits only apply if the craft succeeds.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Enhancement Cards */}
                  {recipe.enhancements.map((enhancement, index) => (
                    <div key={index} className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-lg p-5 border border-purple-500/30">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-xl font-bold text-purple-300">
                          {enhancement.name}
                        </h3>
                        <span className="text-xs font-bold text-purple-400 bg-purple-500/20 px-2 py-1 rounded">
                          ENHANCEMENT {index + 1}
                        </span>
                      </div>

                      <div className="bg-black/30 rounded-lg p-3 mb-3 border border-white/10">
                        <div className="text-sm text-gray-400 mb-2">Required Material</div>
                        <div className="flex items-center justify-between">
                          <span className="text-white font-medium">
                            {formatName(enhancement.material.item_id)}
                          </span>
                          <span className="text-purple-400 font-bold">
                            × {enhancement.material.quantity}
                          </span>
                        </div>
                      </div>

                      <div className="bg-green-900/20 rounded-lg p-3 border border-green-500/30">
                        <div className="text-sm text-green-400 mb-1 font-semibold">BENEFIT</div>
                        <p className="text-gray-300">{enhancement.benefit}</p>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                  <p className="text-gray-400 text-lg">No enhancements available for this recipe</p>
                </div>
              )}
            </div>
          )}

          {/* TOOLS & WORKSHOP TAB */}
          {activeTab === 'tools' && (
            <div className="space-y-6">
              {/* Workshop Section */}
              <div>
                <div className="text-xl font-bold text-amber-400 mb-3 flex items-center space-x-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span>Workshop Requirements</span>
                </div>

                {recipe.required_workshop ? (
                  <div className="bg-amber-900/20 border border-amber-500/50 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <svg className="w-6 h-6 text-amber-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <div className="flex-1">
                        <div className="text-amber-400 font-bold mb-1">WORKSHOP REQUIRED</div>
                        <p className="text-gray-300 mb-3 text-sm">
                          This recipe requires access to a specific workshop. You cannot craft this item anywhere else.
                        </p>
                        <div className="bg-black/30 rounded-lg p-3 border border-amber-500/30">
                          <span className="text-white font-medium text-lg">
                            {formatName(recipe.required_workshop)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                    <div className="flex items-center space-x-3 text-green-400">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-green-300">No workshop required - can craft anywhere</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Required Tools */}
              {recipe.required_tools && recipe.required_tools.length > 0 && (
                <div>
                  <div className="text-lg font-bold text-red-400 mb-3 flex items-center space-x-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span>Required Tools (Must Have)</span>
                  </div>
                  
                  <div className="space-y-2">
                    {recipe.required_tools.map((tool, index) => (
                      <div key={index} className="bg-red-900/20 border border-red-500/30 rounded-lg p-3">
                        <div className="flex items-center space-x-3">
                          <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="text-white font-medium">{formatName(tool)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommended Tools */}
              {recipe.recommended_tools && recipe.recommended_tools.length > 0 && (
                <div>
                  <div className="text-lg font-bold text-blue-400 mb-3 flex items-center space-x-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Recommended Tools (Bonuses)</span>
                  </div>
                  
                  <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 mb-3">
                    <p className="text-gray-300 text-sm">
                      These tools provide bonuses to your crafting check. You can craft without them, but it will be harder. 
                      Check each tool's description in the Objects database for specific bonuses.
                    </p>
                  </div>

                  <div className="space-y-2">
                    {recipe.recommended_tools.map((tool, index) => (
                      <div key={index} className="bg-black/30 border border-blue-500/30 rounded-lg p-3">
                        <div className="flex items-center space-x-3">
                          <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="text-white font-medium">{formatName(tool)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {!recipe.required_tools?.length && !recipe.recommended_tools?.length && (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <p className="text-gray-400 text-lg">No special tools needed</p>
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <div>
                    <div className="text-purple-400 font-bold mb-1">DM ONLY</div>
                    <p className="text-gray-300 text-sm">
                      This tab is only visible to Game Masters. Use this information to enhance gameplay and guide crafting sessions.
                    </p>
                  </div>
                </div>
              </div>

              {/* Crafting Notes */}
              {recipe.crafting_notes && (
                <div className="bg-black/30 rounded-lg p-4 border border-white/10">
                  <div className="text-sm text-gray-400 font-semibold mb-2">CRAFTING NOTES</div>
                  <p className="text-gray-300 leading-relaxed">{recipe.crafting_notes}</p>
                </div>
              )}

              {/* Difficulty Notes */}
              {recipe.difficulty_notes && (
                <div className="bg-black/30 rounded-lg p-4 border border-white/10">
                  <div className="text-sm text-gray-400 font-semibold mb-2">DIFFICULTY EXPLANATION</div>
                  <p className="text-gray-300 leading-relaxed">{recipe.difficulty_notes}</p>
                </div>
              )}

              {/* Quick Reference */}
              <div className="bg-black/30 rounded-lg p-4 border border-white/10">
                <div className="text-sm text-gray-400 font-semibold mb-3">QUICK REFERENCE</div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Materials consumed:</span>
                    <span className="text-red-300">On attempt (success or failure)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Material recovery:</span>
                    <span className="text-green-300">Advantage/Triumph only</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Each enhancement:</span>
                    <span className="text-purple-300">Upgrades difficulty once</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Rush job:</span>
                    <span className="text-yellow-300">½ time, upgrade 2×</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Take your time:</span>
                    <span className="text-blue-300">2× time, downgrade 1× or +2 Boost</span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}