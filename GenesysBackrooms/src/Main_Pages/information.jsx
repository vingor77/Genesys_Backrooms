import React, { useState } from 'react';

const RulesPage = () => {
  // State for managing which sections are expanded
  const [expandedSections, setExpandedSections] = useState({
    general: true,
    spending: false,
    status: false,
    lighting: false,
    exhaustion: false,
    temperature: false,
    resting: false,
    fear: false,
    fall: false,
    atmospheric: false,
    hacking: false,
    diseases: false,
    character: false,
    custom: false,
    equipment: false,
    lethal: false
  });

  // Toggle section expansion
  const toggleSection = (sectionKey) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };

  // Expand all sections
  const expandAll = () => {
    const allExpanded = {};
    Object.keys(expandedSections).forEach(key => {
      allExpanded[key] = true;
    });
    setExpandedSections(allExpanded);
  };

  // Collapse all sections
  const collapseAll = () => {
    const allCollapsed = {};
    Object.keys(expandedSections).forEach(key => {
      allCollapsed[key] = false;
    });
    setExpandedSections(allCollapsed);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <div className="bg-black/30 backdrop-blur-sm border-b border-white/10 shadow-2xl">
        <div className="max-w-full px-4 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div>
              <h1 className="text-2xl lg:text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Game Rules Reference
              </h1>
              <p className="text-blue-300 mt-1 text-sm lg:text-lg">Complete Rules & Mechanics Guide</p>
            </div>

            {/* Control Buttons */}
            <div className="flex items-center space-x-2">
              <button 
                onClick={expandAll}
                className="bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 text-green-300 px-3 py-2 rounded-lg transition-all duration-300 text-sm"
              >
                Expand All
              </button>
              <button 
                onClick={collapseAll}
                className="bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-300 px-3 py-2 rounded-lg transition-all duration-300 text-sm"
              >
                Collapse All
              </button>
              <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg lg:rounded-xl flex items-center justify-center shadow-xl">
                <span className="text-white text-xl lg:text-2xl">📚</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rules Sections */}
      <div className="max-w-full px-4 py-4 space-y-4">

        {/* General Rules */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 shadow-xl overflow-hidden">
          <div 
            className="p-3 lg:p-4 border-b border-white/10 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 cursor-pointer hover:bg-gradient-to-r hover:from-blue-600/30 hover:to-indigo-600/30 transition-all duration-300"
            onClick={() => toggleSection('general')}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-lg lg:text-xl">📜</span>
                <span className="text-white font-semibold text-base lg:text-lg">General Rules</span>
                <span className="text-xs bg-blue-500/30 text-blue-300 px-2 py-1 rounded ml-2">
                  Foundation
                </span>
              </div>
              
              <div className={`transform transition-transform duration-300 ${expandedSections.general ? 'rotate-180' : 'rotate-0'}`}>
                <svg className="w-4 h-4 lg:w-5 lg:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <div className={`transition-all duration-500 ease-in-out overflow-auto ${
            expandedSections.general 
              ? 'max-h-[800px] opacity-100'
              : 'max-h-0 opacity-0'
          }`}>
            <div className="p-3 lg:p-4 space-y-4">
              <div className="text-white space-y-3">
                
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                  <div className="font-semibold text-blue-300 mb-2">📜 Foundation Rules</div>
                  <div className="text-white/90 text-sm">
                    Core mechanics and systems that form the foundation of gameplay in the Genesys system.
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h4 className="text-blue-300 font-semibold mb-4">Check Types</h4>

                  <div className="space-y-4">
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                      <div className="font-semibold text-green-200 mb-2">Opposed Checks</div>
                      <div className="text-white/80 text-sm space-y-2">
                        <div><strong>When to use:</strong> Your character's action is directly opposed by a single individual (lying vs. detecting lies, sneaking vs. spotting, social influence vs. resistance).</div>
                        <div><strong>How it works:</strong> The opponent's skill and characteristic become purple Difficulty dice and red Challenge dice in your pool instead of fixed difficulty. Higher of opponent's skill/characteristic = number of Difficulty dice. Lower value upgrades that many Difficulty dice to Challenge dice.</div>
                        <div><strong>Example:</strong> Sneaking past a guard uses opposed Stealth vs. Vigilance.</div>
                      </div>
                    </div>

                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                      <div className="font-semibold text-yellow-200 mb-2">Competitive Checks</div>
                      <div className="text-white/80 text-sm space-y-2">
                        <div><strong>When to use:</strong> Multiple characters attempt the same goal simultaneously to determine who performs best (racing, debates, contests).</div>
                        <div><strong>How it works:</strong> GM sets one difficulty level. All participants roll against that difficulty. Winner = most net successes. Tiebreaker: most Triumph, then most Advantage. If none succeed, it's a draw.</div>
                        <div><strong>Example:</strong> Multiple runners compete in a Hard Athletics check to see who wins the race.</div>
                      </div>
                    </div>

                    <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
                      <div className="font-semibold text-purple-200 mb-2">Assisted Checks</div>
                      <div className="text-white/80 text-sm space-y-2">
                        <div><strong>When to use:</strong> Characters work together on a single task where one person leads and others help.</div>
                        <div><strong>Skilled Assistance:</strong> When helper has higher characteristic OR skill than primary actor, combine the higher characteristic from one person with higher skill from the other person.</div>
                        <div><strong>Unskilled Assistance:</strong> When helper has lower ratings in both areas, add 1 Boost die per helper (within reason, GM discretion).</div>
                        <div><strong>Limit:</strong> Generally only one skilled assistant allowed, but multiple unskilled assistants possible.</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h4 className="text-blue-300 font-semibold mb-4">Narrative Mechanics</h4>

                  <div className="space-y-4">
                    <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-3">
                      <div className="font-semibold text-indigo-200 mb-2">Story Points and Their Uses</div>
                      <div className="text-white/80 text-sm space-y-2">
                        <div><strong>Starting Pool:</strong> Begin each session with 1 Story Point per player in the Player Pool, and 1 Story Point in the GM Pool.</div>
                        <div><strong>Movement:</strong> When spent, Story Points move to the opposite pool after the action resolves. Players can only spend from Player Pool, GM only from GM Pool.</div>
                        <div><strong>Player Uses:</strong> Upgrade 1 Ability die to Proficiency die, upgrade 1 Difficulty die to Challenge die (against NPCs), activate special talents, introduce narrative facts ("Good thing we packed space suits!").</div>
                        <div><strong>GM Uses:</strong> Upgrade 1 Difficulty die to Challenge die, upgrade 1 Ability die to Proficiency die (for NPCs), activate NPC abilities, create complications.</div>
                        <div><strong>Limit:</strong> Only 1 Story Point can be spent per participant per action.</div>
                      </div>
                    </div>                    

                    <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-3">
                      <div className="font-semibold text-cyan-200 mb-2">Using Motivations</div>
                      <div className="text-white/80 text-sm space-y-2">
                        <div><strong>Four Types:</strong> Each character has one Desire (what drives them forward), Fear (what they avoid/dread), Strength (greatest positive trait), and Flaw (greatest weakness).</div>
                        <div><strong>Discovery:</strong> Use Advantage/Threat in social encounters to learn opponent's motivations, or make Perception vs. Cool check to observe and deduce them.</div>
                        <div><strong>Playing to Motivations:</strong> When your actions align with someone's Strength or Desire, add Boost dice to social checks. When actions satisfy their Flaw or Fear appropriately, gain advantage.</div>
                        <div><strong>Playing Against Motivations:</strong> When your approach conflicts with their motivations or you misread them, add Setback dice to your social checks.</div>
                        <div><strong>Roleplay Reward:</strong> Playing to your own motivations can earn bonus XP at session end.</div>
                      </div>
                    </div>                    

                    <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3">
                      <div className="font-semibold text-orange-200 mb-2">Cliffhanger Rules</div>
                      <div className="text-white/80 text-sm space-y-2">
                        <div><strong>When triggered:</strong> Session ends on a tense, dramatic moment with unresolved danger or critical situation.</div>
                        <div><strong>Next session start:</strong> All Story Points from both pools move to the Player Pool.</div>
                        <div><strong>Player options with combined Story Points:</strong></div>
                        <div className="ml-4 space-y-1">
                          <div>• <strong>Don't spend:</strong> Keep the points and proceed normally</div>
                          <div>• <strong>Spend all to escape:</strong> With GM approval, spend all points to escape the dangerous situation</div>
                          <div>• <strong>Spend all to revive:</strong> Heal all dead/incapacitated characters to half wounds and 0 strain</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h4 className="text-blue-300 font-semibold mb-4">Equipment & Economy</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-semibold text-blue-200 mb-3">Selling Items</h5>
                      <div className="space-y-3">
                        <div className="bg-teal-500/10 border border-teal-500/20 rounded-lg p-3">
                          <div className="font-semibold text-teal-200 mb-2">Selling Procedure</div>
                          <div className="text-white/80 text-sm space-y-1">
                            <div><strong>Check Required:</strong> Negotiation vs. item's rarity difficulty</div>
                            <div><strong>Base Sale Price:</strong> 1/4 of item's listed cost on success</div>
                            <div><strong>Two Successes:</strong> 1/2 of item's listed cost</div>
                            <div><strong>Three+ Successes:</strong> 3/4 of item's listed cost</div>
                          </div>
                        </div>

                        <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-3">
                          <div className="font-semibold text-cyan-200 mb-2">Rarity & Difficulty</div>
                          <div className="text-white/80 text-sm space-y-1">
                            <div><strong>Rarity 0-1:</strong> Simple (-)</div>
                            <div><strong>Rarity 2-3:</strong> Easy (d)</div>
                            <div><strong>Rarity 4-5:</strong> Average (dd)</div>
                            <div><strong>Rarity 6-7:</strong> Hard (ddd)</div>
                            <div><strong>Rarity 8-9:</strong> Daunting (dddd)</div>
                            <div><strong>Rarity 10:</strong> Formidable (ddddd)</div>
                          </div>
                        </div>

                        <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-3">
                          <div className="font-semibold text-cyan-200 mb-2">Difficulty Modifiers</div>
                          <div className="text-white/80 text-sm space-y-1">
                            <div><strong>-1 Difficulty:</strong> Consumer-Driven Economy, Major Metropolitan Area, or Trading Hub</div>
                            <div><strong>No Change:</strong> Mid-sized Metropolitan Area or Civilized Location</div>
                            <div><strong>+1 Difficulty:</strong> Rural or Agrarian Location or State-Regulated Economy</div>
                            <div><strong>+2 Difficulty:</strong> Frontier location or Laws Prohibiting Ownership</div>
                            <div><strong>+3 Difficulty:</strong> Active War Zone</div>
                            <div><strong>+4 Difficulty:</strong> Post-Disaster Wasteland</div>
                          </div>
                        </div>

                        <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-3">
                          <div className="font-semibold text-indigo-200 mb-2">Trading & Commerce</div>
                          <div className="text-white/80 text-sm space-y-1">
                            <div><strong>Legal Items:</strong> Use Negotiation check</div>
                            <div><strong>Illegal Items:</strong> Use Streetwise check</div>
                            <div><strong>Profit Formula:</strong> Base cost × rarity increase multiplier</div>
                            <div><strong>Rarity +2:</strong> ×2 cost increase</div>
                            <div><strong>Rarity +3:</strong> ×3 cost increase</div>
                            <div><strong>Rarity +4:</strong> ×4 cost increase</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h5 className="font-semibold text-blue-200 mb-3">Item Maintenance & Repair</h5>
                      <div className="space-y-3">
                        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                          <div className="font-semibold text-yellow-200 mb-2">Damage Categories</div>
                          <div className="text-white/80 text-sm space-y-1">
                            <div><strong>Minor Damage:</strong> Add 1 Setback die to use</div>
                            <div><strong>Moderate Damage:</strong> Upgrade difficulty once when using</div>
                            <div><strong>Major Damage:</strong> Item is unusable until repaired</div>
                          </div>
                        </div>

                        <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3">
                          <div className="font-semibold text-orange-200 mb-2">Repair Check (Metalworking, Leatherworking, or Crafting)</div>
                          <div className="text-white/80 text-sm space-y-1">
                            <div><strong>Minor Repairs:</strong> Easy (d) difficulty</div>
                            <div><strong>Moderate Repairs:</strong> Average (dd) difficulty</div>
                            <div><strong>Major Repairs:</strong> Hard (ddd) difficulty</div>
                            <div><strong>Time:</strong> 1-2 hours per difficulty level</div>
                            <div><strong>Rushed Work:</strong> +1 difficulty if done in half time</div>
                            <div><strong>No Tools:</strong> +1 difficulty without proper tools</div>
                          </div>
                        </div>

                        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                          <div className="font-semibold text-red-200 mb-2">Repair Costs</div>
                          <div className="text-white/80 text-sm space-y-1">
                            <div><strong>Minor Repairs:</strong> 25% of item's base cost</div>
                            <div><strong>Moderate Repairs:</strong> 50% of item's base cost</div>
                            <div><strong>Major Repairs:</strong> 100% of item's base cost</div>
                            <div><strong>Self-Repair Discount:</strong> Reduce cost by 10% per Advantage rolled</div>
                          </div>
                        </div>

                        <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
                          <div className="font-semibold text-purple-200 mb-2">Equipment Failure</div>
                          <div className="text-white/80 text-sm space-y-1">
                            <div><strong>Trigger:</strong> Despair results may indicate malfunction</div>
                            <div><strong>Effects:</strong> Jammed, broken down, misfired, or inoperable</div>
                            <div><strong>Ammo Depletion:</strong> Use Despair to make ranged weapons run out of ammo</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h4 className="text-blue-300 font-semibold mb-4">Medical & Recovery</h4>

                  <div className="space-y-4">
                    <div>
                      <h5 className="font-semibold text-blue-200 mb-3">Medical Care</h5>
                      <div className="space-y-3">
                        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                          <div className="font-semibold text-green-200 mb-2">Medicine Check Procedure</div>
                          <div className="text-white/80 text-sm space-y-1">
                            <div>• Each character may only receive one Medicine check per encounter</div>
                            <div>• Self-treatment increases difficulty by two</div>
                            <div>• No medical equipment increases difficulty by one</div>
                            <div>• Target heals wounds equal to successes generated</div>
                            <div>• Target heals strain equal to advantages generated</div>
                          </div>
                        </div>

                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                          <div className="font-semibold text-blue-200 mb-2">Medicine Check Difficulty by Health State</div>
                          <div className="text-white/80 text-sm space-y-1">
                            <div><strong>Easy (d):</strong> Current wounds at or under half wound threshold</div>
                            <div><strong>Average (dd):</strong> Current wounds over half wound threshold</div>
                            <div><strong>Hard (ddd):</strong> Current wounds exceed wound threshold</div>
                          </div>
                        </div>

                        <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
                          <div className="font-semibold text-purple-200 mb-2">Treating Critical Injuries</div>
                          <div className="text-white/80 text-sm space-y-1">
                            <div>• Make Medicine check with difficulty = Critical Injury severity rating</div>
                            <div>• One Medicine check per week per Critical Injury</div>
                            <div>• Success removes the Critical Injury completely</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h5 className="font-semibold text-blue-200 mb-3">Painkillers (Auto-Healing Items)</h5>
                      <div className="space-y-3">
                        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                          <div className="font-semibold text-yellow-200 mb-2">Diminishing Returns System</div>
                          <div className="text-white/80 text-sm space-y-1">
                            <div><strong>1st painkiller:</strong> Heals 5 wounds</div>
                            <div><strong>2nd painkiller:</strong> Heals 4 wounds</div>
                            <div><strong>3rd painkiller:</strong> Heals 3 wounds</div>
                            <div><strong>4th painkiller:</strong> Heals 2 wounds</div>
                            <div><strong>5th painkiller:</strong> Heals 1 wound</div>
                            <div><strong>6th+ painkiller:</strong> No effect (oversaturated)</div>
                          </div>
                        </div>

                        <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3">
                          <div className="font-semibold text-orange-200 mb-2">Usage Requirements</div>
                          <div className="text-white/80 text-sm space-y-1">
                            <div>• Requires one maneuver to administer</div>
                            <div>• Must be engaged with target to treat them</div>
                            <div>• Can self-administer with a free hand</div>
                            <div>• <strong>Cannot heal Critical Injuries</strong></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h5 className="font-semibold text-blue-200 mb-3">Strain Recovery</h5>
                      <div className="space-y-3">
                        <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-3">
                          <div className="font-semibold text-cyan-200 mb-2">End of Encounter Recovery</div>
                          <div className="text-white/80 text-sm space-y-1">
                            <div>• Make Simple (-) Discipline or Cool check</div>
                            <div>• Recover 1 strain per success generated</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Spending Your Rolls */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 shadow-xl overflow-hidden">
          <div 
            className="p-3 lg:p-4 border-b border-white/10 bg-gradient-to-r from-green-600/20 to-emerald-600/20 cursor-pointer hover:bg-gradient-to-r hover:from-green-600/30 hover:to-emerald-600/30 transition-all duration-300"
            onClick={() => toggleSection('spending')}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-lg lg:text-xl">🎲</span>
                <span className="text-white font-semibold text-base lg:text-lg">Spending Your Rolls</span>
                <span className="text-xs bg-green-500/30 text-green-300 px-2 py-1 rounded ml-2">
                  Dice Mechanics
                </span>
              </div>
              
              <div className={`transform transition-transform duration-300 ${expandedSections.spending ? 'rotate-180' : 'rotate-0'}`}>
                <svg className="w-4 h-4 lg:w-5 lg:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <div className={`transition-all duration-500 ease-in-out overflow-auto ${
            expandedSections.spending 
              ? 'max-h-[800px] opacity-100'
              : 'max-h-0 opacity-0'
          }`}>
            <div className="p-3 lg:p-4 space-y-4">
              <div className="text-white space-y-3">
                
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                  <div className="font-semibold text-green-300 mb-2">🎲 Spending Your Dice Results</div>
                  <div className="text-white/90 text-sm">
                    The narrative dice system allows for creative storytelling beyond simple success and failure. Here's how to spend your Advantage, Threat, Triumph, and Despair results across different contexts.
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h4 className="text-green-300 font-semibold mb-4">Spending Advantage & Triumph</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-semibold text-green-200 mb-3 flex items-center">
                        <span className="bg-red-500/20 text-red-300 px-2 py-1 rounded text-xs font-bold mr-3">COMBAT</span>
                        Combat Encounter Options
                      </h5>
                      
                      <div className="mb-3">
                        <h6 className="font-semibold text-green-300 mb-2 text-sm">1 Advantage Required</h6>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-2">
                            <div className="font-semibold text-green-200 text-xs">Recover Strain</div>
                            <div className="text-white/70 text-xs">Recover 1 strain per advantage spent</div>
                          </div>
                          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-2">
                            <div className="font-semibold text-green-200 text-xs">Add Boost to Ally</div>
                            <div className="text-white/70 text-xs">Next check by ally within short range gains 1 boost die</div>
                          </div>
                          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-2">
                            <div className="font-semibold text-green-200 text-xs">Notice Important Detail</div>
                            <div className="text-white/70 text-xs">Spot something useful in the environment or about an enemy</div>
                          </div>
                        </div>
                      </div>

                      <div className="mb-3">
                        <h6 className="font-semibold text-green-300 mb-2 text-sm">2 Advantages Required</h6>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-2">
                            <div className="font-semibold text-green-200 text-xs">Perform Free Maneuver</div>
                            <div className="text-white/70 text-xs">Perform one additional maneuver this turn</div>
                          </div>
                          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-2">
                            <div className="font-semibold text-green-200 text-xs">Add Setback to Target</div>
                            <div className="text-white/70 text-xs">Target's next check gains 1 setback die</div>
                          </div>
                        </div>
                      </div>

                      <div className="mb-3">
                        <h6 className="font-semibold text-green-300 mb-2 text-sm">3 Advantages Required</h6>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-2">
                            <div className="font-semibold text-green-200 text-xs">Remove Defense</div>
                            <div className="text-white/70 text-xs">Remove 1 melee or ranged defense from target until end of turn</div>
                          </div>
                          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-2">
                            <div className="font-semibold text-green-200 text-xs">Ignore Environmental Penalties</div>
                            <div className="text-white/70 text-xs">Ignore environmental setback dice for this action</div>
                          </div>
                          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-2">
                            <div className="font-semibold text-green-200 text-xs">Skip Target's Turn</div>
                            <div className="text-white/70 text-xs">Forgo damage to force target to skip their next turn</div>
                          </div>
                          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-2">
                            <div className="font-semibold text-green-200 text-xs">Gain Defense</div>
                            <div className="text-white/70 text-xs">Gain 1 melee or ranged defense until start of next turn</div>
                          </div>
                          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-2">
                            <div className="font-semibold text-green-200 text-xs">Disarm Target</div>
                            <div className="text-white/70 text-xs">Remove one weapon from target's grasp</div>
                          </div>
                          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-2">
                            <div className="font-semibold text-green-200 text-xs">Inflict Critical Injury</div>
                            <div className="text-white/70 text-xs">Target suffers critical injury (if weapon has crit rating)</div>
                          </div>
                        </div>
                      </div>

                      <div className="mb-3">
                        <h6 className="font-semibold text-yellow-300 mb-2 text-sm">1 Triumph Required</h6>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-2">
                            <div className="font-semibold text-yellow-200 text-xs">Any Advantage Effect</div>
                            <div className="text-white/70 text-xs">Can substitute for any advantage-based effect</div>
                          </div>
                          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-2">
                            <div className="font-semibold text-yellow-200 text-xs">Add Difficulty to Target</div>
                            <div className="text-white/70 text-xs">Target's next check gains 1 difficulty die</div>
                          </div>
                          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-2">
                            <div className="font-semibold text-yellow-200 text-xs">Upgrade Ally's Check</div>
                            <div className="text-white/70 text-xs">Ally upgrades their next check once</div>
                          </div>
                          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-2">
                            <div className="font-semibold text-yellow-200 text-xs">Do Something Vital</div>
                            <div className="text-white/70 text-xs">Accomplish something crucial to the narrative</div>
                          </div>
                          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-2">
                            <div className="font-semibold text-yellow-200 text-xs">Initiative Free Maneuver</div>
                            <div className="text-white/70 text-xs">On initiative roll, perform a free maneuver</div>
                          </div>
                          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-2">
                            <div className="font-semibold text-yellow-200 text-xs">Damage Equipment</div>
                            <div className="text-white/70 text-xs">Damage target's armor or weapon</div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h6 className="font-semibold text-yellow-300 mb-2 text-sm">2 Triumphs Required</h6>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                          <div className="bg-yellow-600/15 border border-yellow-600/25 rounded-lg p-2">
                            <div className="font-semibold text-yellow-200 text-xs">Destroy Weapon</div>
                            <div className="text-white/70 text-xs">Completely destroy target's weapon (if possible)</div>
                          </div>
                        </div>
                      </div>

                    </div>

                    <div>
                      <h5 className="font-semibold text-green-200 mb-3 flex items-center">
                        <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-xs font-bold mr-3">SOCIAL</span>
                        Social Encounter Options
                      </h5>
                      
                      <div className="mb-3">
                        <h6 className="font-semibold text-green-300 mb-2 text-sm">1 Advantage Required</h6>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-2">
                            <div className="font-semibold text-green-200 text-xs">Recover Strain</div>
                            <div className="text-white/70 text-xs">Recover 1 strain per advantage spent</div>
                          </div>
                          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-2">
                            <div className="font-semibold text-green-200 text-xs">Add Boost to Ally</div>
                            <div className="text-white/70 text-xs">Next social check by ally gains 1 boost die</div>
                          </div>
                          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-2">
                            <div className="font-semibold text-green-200 text-xs">Notice Important Detail</div>
                            <div className="text-white/70 text-xs">Learn something useful about the situation or target</div>
                          </div>
                        </div>
                      </div>

                      <div className="mb-3">
                        <h6 className="font-semibold text-green-300 mb-2 text-sm">2 Advantages Required</h6>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-2">
                            <div className="font-semibold text-green-200 text-xs">Perform Free Maneuver</div>
                            <div className="text-white/70 text-xs">Perform one additional maneuver this turn</div>
                          </div>
                          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-2">
                            <div className="font-semibold text-green-200 text-xs">Add Setback to Target</div>
                            <div className="text-white/70 text-xs">Target's next social check gains 1 setback die</div>
                          </div>
                          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-2">
                            <div className="font-semibold text-green-200 text-xs">Learn Strength or Flaw</div>
                            <div className="text-white/70 text-xs">Discover target's strength or flaw motivation</div>
                          </div>
                        </div>
                      </div>

                      <div className="mb-3">
                        <h6 className="font-semibold text-green-300 mb-2 text-sm">3 Advantages Required</h6>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-2">
                            <div className="font-semibold text-green-200 text-xs">Learn Desire or Fear</div>
                            <div className="text-white/70 text-xs">Discover target's desire or fear motivation</div>
                          </div>
                          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-2">
                            <div className="font-semibold text-green-200 text-xs">Conceal True Goal</div>
                            <div className="text-white/70 text-xs">Hide your real objective from the target</div>
                          </div>
                          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-2">
                            <div className="font-semibold text-green-200 text-xs">Learn Target's True Goal</div>
                            <div className="text-white/70 text-xs">Discover what the target really wants</div>
                          </div>
                        </div>
                      </div>

                      <div className="mb-3">
                        <h6 className="font-semibold text-green-300 mb-2 text-sm">4 Advantages Required</h6>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-2">
                            <div className="font-semibold text-green-200 text-xs">Inflict Critical Remark</div>
                            <div className="text-white/70 text-xs">Make a devastating social attack that causes strain</div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h6 className="font-semibold text-yellow-300 mb-2 text-sm">1 Triumph Required</h6>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-2">
                            <div className="font-semibold text-yellow-200 text-xs">Any Advantage Effect</div>
                            <div className="text-white/70 text-xs">Can substitute for any advantage-based effect</div>
                          </div>
                          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-2">
                            <div className="font-semibold text-yellow-200 text-xs">Add Difficulty to Target</div>
                            <div className="text-white/70 text-xs">Target's next social check gains 1 difficulty die</div>
                          </div>
                          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-2">
                            <div className="font-semibold text-yellow-200 text-xs">Upgrade Ally's Check</div>
                            <div className="text-white/70 text-xs">Ally upgrades their next social check once</div>
                          </div>
                          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-2">
                            <div className="font-semibold text-yellow-200 text-xs">Do Something Vital</div>
                            <div className="text-white/70 text-xs">Accomplish something crucial to the social situation</div>
                          </div>
                          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-2">
                            <div className="font-semibold text-yellow-200 text-xs">Initiative Free Maneuver</div>
                            <div className="text-white/70 text-xs">On initiative roll, perform a free maneuver</div>
                          </div>
                        </div>
                      </div>

                    </div>

                    <div>
                      <h5 className="font-semibold text-green-200 mb-3 flex items-center">
                        <span className="bg-gray-500/20 text-gray-300 px-2 py-1 rounded text-xs font-bold mr-3">GENERAL</span>
                        Any Context Options
                      </h5>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                        
                        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                          <div className="font-semibold text-green-200 mb-1 text-sm flex items-center justify-between">
                            <span>Recover Strain</span>
                            <span className="bg-green-500/30 text-green-300 px-1 py-0.5 rounded text-xs">1 ADV</span>
                          </div>
                          <div className="text-white/80 text-xs">Recover 1 strain per advantage spent</div>
                        </div>

                        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                          <div className="font-semibold text-green-200 mb-1 text-sm flex items-center justify-between">
                            <span>Add Boost to Next Check</span>
                            <span className="bg-green-500/30 text-green-300 px-1 py-0.5 rounded text-xs">1 ADV</span>
                          </div>
                          <div className="text-white/80 text-xs">Your next check gains 1 boost die</div>
                        </div>

                        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                          <div className="font-semibold text-green-200 mb-1 text-sm flex items-center justify-between">
                            <span>Notice Detail</span>
                            <span className="bg-green-500/30 text-green-300 px-1 py-0.5 rounded text-xs">1 ADV</span>
                          </div>
                          <div className="text-white/80 text-xs">Spot something useful or interesting in the environment</div>
                        </div>

                        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                          <div className="font-semibold text-green-200 mb-1 text-sm flex items-center justify-between">
                            <span>Perform Additional Maneuver</span>
                            <span className="bg-green-500/30 text-green-300 px-1 py-0.5 rounded text-xs">2 ADV</span>
                          </div>
                          <div className="text-white/80 text-xs">Perform one additional maneuver this turn</div>
                        </div>

                        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                          <div className="font-semibold text-green-200 mb-1 text-sm flex items-center justify-between">
                            <span>Reduce Time Required</span>
                            <span className="bg-green-500/30 text-green-300 px-1 py-0.5 rounded text-xs">2 ADV</span>
                          </div>
                          <div className="text-white/80 text-xs">Reduce time needed for extended tasks</div>
                        </div>

                        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                          <div className="font-semibold text-yellow-200 mb-1 text-sm flex items-center justify-between">
                            <span>Remarkable Success</span>
                            <span className="bg-purple-500/30 text-purple-300 px-1 py-0.5 rounded text-xs">TRIUMPH</span>
                          </div>
                          <div className="text-white/80 text-xs">Achieve an extraordinary outcome or gain major story benefit</div>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h4 className="text-red-300 font-semibold mb-4">Spending Threat & Despair</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-semibold text-red-200 mb-3 flex items-center">
                        <span className="bg-red-500/20 text-red-300 px-2 py-1 rounded text-xs font-bold mr-3">COMBAT</span>
                        Combat Encounter Effects
                      </h5>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                        
                        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                          <div className="font-semibold text-red-200 mb-1 text-sm flex items-center justify-between">
                            <span>Suffer Strain</span>
                            <span className="bg-red-500/30 text-red-300 px-1 py-0.5 rounded text-xs">1 THR</span>
                          </div>
                          <div className="text-white/80 text-xs">Character suffers 1 strain per threat spent</div>
                        </div>

                        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                          <div className="font-semibold text-red-200 mb-1 text-sm flex items-center justify-between">
                            <span>Lose Free Maneuver</span>
                            <span className="bg-red-500/30 text-red-300 px-1 py-0.5 rounded text-xs">1 THR</span>
                          </div>
                          <div className="text-white/80 text-xs">Character cannot perform free maneuver this turn</div>
                        </div>

                        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                          <div className="font-semibold text-red-200 mb-1 text-sm flex items-center justify-between">
                            <span>Add Setback to Ally</span>
                            <span className="bg-red-500/30 text-red-300 px-1 py-0.5 rounded text-xs">1 THR</span>
                          </div>
                          <div className="text-white/80 text-xs">Ally's next check gains 1 setback die</div>
                        </div>

                        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                          <div className="font-semibold text-red-200 mb-1 text-sm flex items-center justify-between">
                            <span>Fall Prone</span>
                            <span className="bg-red-500/30 text-red-300 px-1 py-0.5 rounded text-xs">2 THR</span>
                          </div>
                          <div className="text-white/80 text-xs">Character falls prone or loses balance</div>
                        </div>

                        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                          <div className="font-semibold text-red-200 mb-1 text-sm flex items-center justify-between">
                            <span>Enemy Gets Free Maneuver</span>
                            <span className="bg-red-500/30 text-red-300 px-1 py-0.5 rounded text-xs">2 THR</span>
                          </div>
                          <div className="text-white/80 text-xs">One enemy immediately performs a maneuver</div>
                        </div>

                        <div className="bg-red-600/20 border border-red-600/30 rounded-lg p-3">
                          <div className="font-semibold text-red-200 mb-1 text-sm flex items-center justify-between">
                            <span>Weapon Malfunction</span>
                            <span className="bg-purple-500/30 text-purple-300 px-1 py-0.5 rounded text-xs">DESPAIR</span>
                          </div>
                          <div className="text-white/80 text-xs">Weapon breaks, jams, or causes major complication</div>
                        </div>

                      </div>
                    </div>

                    <div>
                      <h5 className="font-semibold text-red-200 mb-3 flex items-center">
                        <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-xs font-bold mr-3">SOCIAL</span>
                        Social Encounter Effects
                      </h5>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                        
                        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                          <div className="font-semibold text-red-200 mb-1 text-sm flex items-center justify-between">
                            <span>Reveal Weakness</span>
                            <span className="bg-red-500/30 text-red-300 px-1 py-0.5 rounded text-xs">1 THR</span>
                          </div>
                          <div className="text-white/80 text-xs">Accidentally reveal one of your motivations to target</div>
                        </div>

                        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                          <div className="font-semibold text-red-200 mb-1 text-sm flex items-center justify-between">
                            <span>Upgrade Target's Next Check</span>
                            <span className="bg-red-500/30 text-red-300 px-1 py-0.5 rounded text-xs">2 THR</span>
                          </div>
                          <div className="text-white/80 text-xs">Target upgrades their next social check against you</div>
                        </div>

                        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                          <div className="font-semibold text-red-200 mb-1 text-sm flex items-center justify-between">
                            <span>Anger Bystanders</span>
                            <span className="bg-red-500/30 text-red-300 px-1 py-0.5 rounded text-xs">1 THR</span>
                          </div>
                          <div className="text-white/80 text-xs">Offend onlookers or damage your reputation</div>
                        </div>

                        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                          <div className="font-semibold text-red-200 mb-1 text-sm flex items-center justify-between">
                            <span>Suffer Strain</span>
                            <span className="bg-red-500/30 text-red-300 px-1 py-0.5 rounded text-xs">2 THR</span>
                          </div>
                          <div className="text-white/80 text-xs">Character suffers 1 strain from social stress</div>
                        </div>

                        <div className="bg-red-600/20 border border-red-600/30 rounded-lg p-3">
                          <div className="font-semibold text-red-200 mb-1 text-sm flex items-center justify-between">
                            <span>Major Social Disaster</span>
                            <span className="bg-purple-500/30 text-purple-300 px-1 py-0.5 rounded text-xs">DESPAIR</span>
                          </div>
                          <div className="text-white/80 text-xs">Catastrophic social failure with lasting consequences</div>
                        </div>

                      </div>
                    </div>

                    <div>
                      <h5 className="font-semibold text-red-200 mb-3 flex items-center">
                        <span className="bg-gray-500/20 text-gray-300 px-2 py-1 rounded text-xs font-bold mr-3">GENERAL</span>
                        Any Context Effects
                      </h5>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                        
                        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                          <div className="font-semibold text-red-200 mb-1 text-sm flex items-center justify-between">
                            <span>Suffer Strain</span>
                            <span className="bg-red-500/30 text-red-300 px-1 py-0.5 rounded text-xs">1 THR</span>
                          </div>
                          <div className="text-white/80 text-xs">Character suffers 1 strain per threat spent</div>
                        </div>

                        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                          <div className="font-semibold text-red-200 mb-1 text-sm flex items-center justify-between">
                            <span>Add Setback to Next Check</span>
                            <span className="bg-red-500/30 text-red-300 px-1 py-0.5 rounded text-xs">1 THR</span>
                          </div>
                          <div className="text-white/80 text-xs">Your next check gains 1 setback die</div>
                        </div>

                        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                          <div className="font-semibold text-red-200 mb-1 text-sm flex items-center justify-between">
                            <span>Environmental Complication</span>
                            <span className="bg-red-500/30 text-red-300 px-1 py-0.5 rounded text-xs">2 THR</span>
                          </div>
                          <div className="text-white/80 text-xs">Create minor environmental hazard or complication</div>
                        </div>

                        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                          <div className="font-semibold text-red-200 mb-1 text-sm flex items-center justify-between">
                            <span>Increase Time Required</span>
                            <span className="bg-red-500/30 text-red-300 px-1 py-0.5 rounded text-xs">2 THR</span>
                          </div>
                          <div className="text-white/80 text-xs">Increase time needed for extended tasks</div>
                        </div>

                        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                          <div className="font-semibold text-red-200 mb-1 text-sm flex items-center justify-between">
                            <span>Immediate Danger</span>
                            <span className="bg-red-500/30 text-red-300 px-1 py-0.5 rounded text-xs">3 THR</span>
                          </div>
                          <div className="text-white/80 text-xs">Create immediate threat requiring action</div>
                        </div>

                        <div className="bg-red-600/20 border border-red-600/30 rounded-lg p-3">
                          <div className="font-semibold text-red-200 mb-1 text-sm flex items-center justify-between">
                            <span>Catastrophic Failure</span>
                            <span className="bg-purple-500/30 text-purple-300 px-1 py-0.5 rounded text-xs">DESPAIR</span>
                          </div>
                          <div className="text-white/80 text-xs">Major complication with lasting story consequences</div>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-600/10 border border-blue-500/30 rounded-lg p-4">
                  <h5 className="font-semibold text-blue-300 mb-3">Quick Reference</h5>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 text-sm">
                    <div>
                      <div className="font-semibold text-blue-200 mb-1">Resolution Order</div>
                      <div className="text-white/80 text-xs">1. Success/Failure 2. Advantage/Threat 3. Triumph/Despair</div>
                    </div>

                    <div>
                      <div className="font-semibold text-blue-200 mb-1">Player Control</div>
                      <div className="text-white/80 text-xs">Players spend their own Advantage and Triumph</div>
                    </div>

                    <div>
                      <div className="font-semibold text-blue-200 mb-1">GM Control</div>
                      <div className="text-white/80 text-xs">GM spends Threat and Despair against players</div>
                    </div>

                    <div>
                      <div className="font-semibold text-blue-200 mb-1">Multiple Uses</div>
                      <div className="text-white/80 text-xs">Most effects can be used multiple times with enough symbols</div>
                    </div>

                    <div>
                      <div className="font-semibold text-blue-200 mb-1">Context Tags</div>
                      <div className="text-white/80 text-xs">ALL = Any context, specific tags for limited use</div>
                    </div>

                    <div>
                      <div className="font-semibold text-blue-200 mb-1">Narrative Priority</div>
                      <div className="text-white/80 text-xs">Always describe what happens, not just the mechanical effect</div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* Status Effects */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 shadow-xl overflow-hidden">
          <div 
            className="p-3 lg:p-4 border-b border-white/10 bg-gradient-to-r from-red-600/20 to-pink-600/20 cursor-pointer hover:bg-gradient-to-r hover:from-red-600/30 hover:to-pink-600/30 transition-all duration-300"
            onClick={() => toggleSection('status')}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-lg lg:text-xl">💫</span>
                <span className="text-white font-semibold text-base lg:text-lg">Status Effects</span>
                <span className="text-xs bg-red-500/30 text-red-300 px-2 py-1 rounded ml-2">
                  Conditions
                </span>
              </div>
              
              <div className={`transform transition-transform duration-300 ${expandedSections.status ? 'rotate-180' : 'rotate-0'}`}>
                <svg className="w-4 h-4 lg:w-5 lg:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <div className={`transition-all duration-500 ease-in-out overflow-auto ${
            expandedSections.status 
              ? 'max-h-[800px] opacity-100'
              : 'max-h-0 opacity-0'
          }`}>
            <div className="p-3 lg:p-4 space-y-4">
              <div className="text-white space-y-3">
                
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                  <div className="font-semibold text-red-300 mb-2">💡 Status Effect Rules</div>
                  <div className="text-white/90 text-sm">
                    Status effects persist until removed by specific actions, abilities, or time limits. Multiple instances of the same effect may stack or refresh duration depending on the specific effect.
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h4 className="text-red-300 font-semibold mb-4 flex items-center">
                    <span className="bg-red-500/20 text-red-300 px-2 py-1 rounded text-xs font-bold mr-3">NEGATIVE</span>
                    Detrimental Status Effects
                  </h4>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    
                    <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                      <div className="flex items-start justify-between mb-2">
                        <h5 className="font-bold text-red-200">Blinded</h5>
                        <span className="bg-red-500/20 text-red-300 px-2 py-0.5 rounded text-xs">Vision</span>
                      </div>
                      <p className="text-white/80 text-sm">Cannot see anything. Upgrade difficulty of checks relying on sight twice. When making ranged combat checks, must spend 2 Advantage to hit target in engaged range band.</p>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                      <div className="flex items-start justify-between mb-2">
                        <h5 className="font-bold text-red-200">Burning</h5>
                        <span className="bg-red-500/20 text-red-300 px-2 py-0.5 rounded text-xs">Damage</span>
                      </div>
                      <p className="text-white/80 text-sm">At the end of each turn, suffer wounds based on the burn severity. Can attempt Coordination check as action to extinguish flames. Water or similar substances automatically end this effect.</p>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                      <div className="flex items-start justify-between mb-2">
                        <h5 className="font-bold text-red-200">Confused</h5>
                        <span className="bg-red-500/20 text-red-300 px-2 py-0.5 rounded text-xs">Mental</span>
                      </div>
                      <p className="text-white/80 text-sm">Cannot tell friend from foe. At start of turn, roll d10: 1-3 act normally, 4-6 do nothing, 7-10 attack nearest character (friend or foe). Lasts until end of encounter or removed.</p>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                      <div className="flex items-start justify-between mb-2">
                        <h5 className="font-bold text-red-200">Deafened</h5>
                        <span className="bg-red-500/20 text-red-300 px-2 py-0.5 rounded text-xs">Hearing</span>
                      </div>
                      <p className="text-white/80 text-sm">Cannot hear anything. Add 2 Setback to Perception checks and social checks relying on verbal communication. Cannot benefit from audio-based advantages or warnings.</p>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                      <div className="flex items-start justify-between mb-2">
                        <h5 className="font-bold text-red-200">Disoriented</h5>
                        <span className="bg-red-500/20 text-red-300 px-2 py-0.5 rounded text-xs">Mental</span>
                      </div>
                      <p className="text-white/80 text-sm">Add 1 Setback to all skill checks. Multiple instances can stack, adding additional 1 Setback per instance. Usually lasts a specific number of rounds.</p>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                      <div className="flex items-start justify-between mb-2">
                        <h5 className="font-bold text-red-200">Ensnared/Entangled</h5>
                        <span className="bg-red-500/20 text-red-300 px-2 py-0.5 rounded text-xs">Physical</span>
                      </div>
                      <p className="text-white/80 text-sm">Cannot perform move maneuvers. Can attempt opposed Athletics vs. ensnare rating as action to break free. Being attacked by weapon with Breach may automatically free you.</p>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                      <div className="flex items-start justify-between mb-2">
                        <h5 className="font-bold text-red-200">Exhausted</h5>
                        <span className="bg-red-500/20 text-red-300 px-2 py-0.5 rounded text-xs">Physical</span>
                      </div>
                      <p className="text-white/80 text-sm">Progressive levels of fatigue with increasingly severe penalties. See Exhaustion Rules section for complete mechanics and recovery methods.</p>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                      <div className="flex items-start justify-between mb-2">
                        <h5 className="font-bold text-red-200">Frightened</h5>
                        <span className="bg-red-500/20 text-red-300 px-2 py-0.5 rounded text-xs">Mental</span>
                      </div>
                      <p className="text-white/80 text-sm">Add 2 Setback to all checks when the source of fear is present. Cannot voluntarily move closer to the source of fear. Make Discipline check at end of each turn to overcome.</p>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                      <div className="flex items-start justify-between mb-2">
                        <h5 className="font-bold text-red-200">Immobilized</h5>
                        <span className="bg-red-500/20 text-red-300 px-2 py-0.5 rounded text-xs">Physical</span>
                      </div>
                      <p className="text-white/80 text-sm">Cannot perform move maneuvers of any kind. Can still perform actions and other maneuvers that don't involve changing position. Typically removed by specific conditions or abilities.</p>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                      <div className="flex items-start justify-between mb-2">
                        <h5 className="font-bold text-red-200">Incapacitated</h5>
                        <span className="bg-red-500/20 text-red-300 px-2 py-0.5 rounded text-xs">Severe</span>
                      </div>
                      <p className="text-white/80 text-sm">Cannot perform actions, maneuvers, or incidentals. Effectively unconscious or helpless. Usually results from exceeding wound or strain thresholds.</p>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                      <div className="flex items-start justify-between mb-2">
                        <h5 className="font-bold text-red-200">Poisoned</h5>
                        <span className="bg-red-500/20 text-red-300 px-2 py-0.5 rounded text-xs">Damage</span>
                      </div>
                      <p className="text-white/80 text-sm">Suffer ongoing damage (wounds or strain) at specified intervals. May have additional effects like 1 Setback to checks. Resilience checks may reduce duration or severity.</p>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                      <div className="flex items-start justify-between mb-2">
                        <h5 className="font-bold text-red-200">Prone</h5>
                        <span className="bg-red-500/20 text-red-300 px-2 py-0.5 rounded text-xs">Position</span>
                      </div>
                      <p className="text-white/80 text-sm">Lying on the ground. Add 1 Setback to Brawl and Melee checks. Ranged attacks against you add 1 Setback. Standing up requires maneuver or talent like Jump Up.</p>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                      <div className="flex items-start justify-between mb-2">
                        <h5 className="font-bold text-red-200">Sickened</h5>
                        <span className="bg-red-500/20 text-red-300 px-2 py-0.5 rounded text-xs">Disease</span>
                      </div>
                      <p className="text-white/80 text-sm">Add 1 Setback to all Brawn and Agility checks. May have additional symptoms. Usually part of disease mechanics with specific recovery conditions.</p>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                      <div className="flex items-start justify-between mb-2">
                        <h5 className="font-bold text-red-200">Silenced</h5>
                        <span className="bg-red-500/20 text-red-300 px-2 py-0.5 rounded text-xs">Speech</span>
                      </div>
                      <p className="text-white/80 text-sm">Cannot speak or make vocal sounds. Cannot use abilities requiring speech or verbal components. Add 2 Setback to social interactions requiring verbal communication.</p>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                      <div className="flex items-start justify-between mb-2">
                        <h5 className="font-bold text-red-200">Slowed</h5>
                        <span className="bg-red-500/20 text-red-300 px-2 py-0.5 rounded text-xs">Movement</span>
                      </div>
                      <p className="text-white/80 text-sm">Can only perform one maneuver per turn (instead of the normal two). Actions are unaffected. Multiple maneuvers require spending strain as normal.</p>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                      <div className="flex items-start justify-between mb-2">
                        <h5 className="font-bold text-red-200">Staggered</h5>
                        <span className="bg-red-500/20 text-red-300 px-2 py-0.5 rounded text-xs">Action</span>
                      </div>
                      <p className="text-white/80 text-sm">Cannot perform actions, only maneuvers and incidentals. Can still move and perform simple tasks but cannot take complex actions like attacks or skill checks.</p>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                      <div className="flex items-start justify-between mb-2">
                        <h5 className="font-bold text-red-200">Stunned</h5>
                        <span className="bg-red-500/20 text-red-300 px-2 py-0.5 rounded text-xs">Strain</span>
                      </div>
                      <p className="text-white/80 text-sm">Suffer additional strain when taking damage. The amount is specified by the effect that caused the stunned condition. Usually temporary.</p>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                      <div className="flex items-start justify-between mb-2">
                        <h5 className="font-bold text-red-200">Unconscious</h5>
                        <span className="bg-red-500/20 text-red-300 px-2 py-0.5 rounded text-xs">Severe</span>
                      </div>
                      <p className="text-white/80 text-sm">Cannot perform any actions, maneuvers, or incidentals. Unaware of surroundings. Attacks against unconscious targets gain significant bonuses. Often result of critical injuries.</p>
                    </div>

                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h4 className="text-green-300 font-semibold mb-4 flex items-center">
                    <span className="bg-green-500/20 text-green-300 px-2 py-1 rounded text-xs font-bold mr-3">POSITIVE</span>
                    Beneficial Status Effects
                  </h4>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    
                    <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                      <div className="flex items-start justify-between mb-2">
                        <h5 className="font-bold text-green-200">Inspired</h5>
                        <span className="bg-green-500/20 text-green-300 px-2 py-0.5 rounded text-xs">Mental</span>
                      </div>
                      <p className="text-white/80 text-sm">Add 1 Boost to all skill checks. Often granted by leadership abilities or inspiring actions. Usually lasts for a specific duration or until used.</p>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                      <div className="flex items-start justify-between mb-2">
                        <h5 className="font-bold text-green-200">Protected</h5>
                        <span className="bg-green-500/20 text-green-300 px-2 py-0.5 rounded text-xs">Defense</span>
                      </div>
                      <p className="text-white/80 text-sm">Increase defense rating against specific types of attacks. May provide damage resistance or other protective benefits. Duration and type varies by source.</p>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                      <div className="flex items-start justify-between mb-2">
                        <h5 className="font-bold text-green-200">Regenerating</h5>
                        <span className="bg-green-500/20 text-green-300 px-2 py-0.5 rounded text-xs">Healing</span>
                      </div>
                      <p className="text-white/80 text-sm">Automatically heal wounds or strain at specified intervals. Rate of healing depends on the source of regeneration. May have specific conditions or limitations.</p>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                      <div className="flex items-start justify-between mb-2">
                        <h5 className="font-bold text-green-200">Enhanced</h5>
                        <span className="bg-green-500/20 text-green-300 px-2 py-0.5 rounded text-xs">Ability</span>
                      </div>
                      <p className="text-white/80 text-sm">Improve specific characteristics or skills temporarily. May add bonus dice, reduce difficulty, or provide other mechanical benefits to certain actions.</p>
                    </div>

                  </div>
                </div>

                <div className="bg-blue-600/10 border border-blue-500/30 rounded-lg p-4">
                  <h5 className="font-semibold text-blue-300 mb-3">Status Effect Interactions</h5>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 text-sm">
                    <div>
                      <div className="font-semibold text-blue-200 mb-1">Stacking Effects</div>
                      <div className="text-white/80 text-xs">Some effects stack (like Disoriented), while others replace previous instances (like Burning).</div>
                    </div>

                    <div>
                      <div className="font-semibold text-blue-200 mb-1">Duration</div>
                      <div className="text-white/80 text-xs">Effects last until specifically removed, end of encounter, or a set number of rounds.</div>
                    </div>

                    <div>
                      <div className="font-semibold text-blue-200 mb-1">Removal</div>
                      <div className="text-white/80 text-xs">Effects can be removed by Medicine checks, abilities, items, or specific actions.</div>
                    </div>

                    <div>
                      <div className="font-semibold text-blue-200 mb-1">Immunity</div>
                      <div className="text-white/80 text-xs">Some creatures or equipment provide immunity to specific status effects.</div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* Lighting Rules */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 shadow-xl overflow-hidden">
          <div 
            className="p-3 lg:p-4 border-b border-white/10 bg-gradient-to-r from-yellow-600/20 to-orange-600/20 cursor-pointer hover:bg-gradient-to-r hover:from-yellow-600/30 hover:to-orange-600/30 transition-all duration-300"
            onClick={() => toggleSection('lighting')}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-lg lg:text-xl">💡</span>
                <span className="text-white font-semibold text-base lg:text-lg">Lighting Rules</span>
                <span className="text-xs bg-yellow-500/30 text-yellow-300 px-2 py-1 rounded ml-2">
                  Visibility
                </span>
              </div>
              
              <div className={`transform transition-transform duration-300 ${expandedSections.lighting ? 'rotate-180' : 'rotate-0'}`}>
                <svg className="w-4 h-4 lg:w-5 lg:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <div className={`transition-all duration-500 ease-in-out overflow-auto ${
            expandedSections.lighting 
              ? 'max-h-[800px] opacity-100'
              : 'max-h-0 opacity-0'
          }`}>
            <div className="p-3 lg:p-4 space-y-4">
              <div className="text-white space-y-3">
                
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <div className="font-semibold text-yellow-300 mb-2">💡 Zone-Based Lighting System</div>
                  <div className="text-white/90 text-sm">
                    Rooms are divided into zones based on size. Each zone can have different light levels, creating realistic lighting variation and tactical opportunities.
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h4 className="text-yellow-300 font-semibold mb-4">Room Zone System</h4>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                      <div className="font-semibold text-yellow-200 mb-2">Small Rooms</div>
                      <div className="text-white/80 text-sm mb-2">Bathrooms, closets, small offices</div>
                      <div className="text-white/70 text-xs">
                        <strong>Zones:</strong> 1 zone (uniform lighting throughout)
                      </div>
                    </div>

                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                      <div className="font-semibold text-yellow-200 mb-2">Medium Rooms</div>
                      <div className="text-white/80 text-sm mb-2">Bedrooms, offices, kitchens</div>
                      <div className="text-white/70 text-xs">
                        <strong>Zones:</strong> 3 zones (Left / Center / Right)
                      </div>
                    </div>

                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                      <div className="font-semibold text-yellow-200 mb-2">Large Rooms</div>
                      <div className="text-white/80 text-sm mb-2">Warehouses, cafeterias, lobbies</div>
                      <div className="text-white/70 text-xs">
                        <strong>Option A:</strong> 3 zones (Near / Center / Far)<br/>
                        <strong>Option B:</strong> 5 zones (Center + 4 Corners)
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h4 className="text-yellow-300 font-semibold mb-4">Light Levels</h4>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    <div className="bg-gray-900/50 border border-gray-700/50 rounded-lg p-3">
                      <div className="font-semibold text-gray-200 mb-1">Pitch Black (0)</div>
                      <div className="text-white/70 text-xs">Complete darkness, no visibility</div>
                    </div>

                    <div className="bg-gray-800/50 border border-gray-600/50 rounded-lg p-3">
                      <div className="font-semibold text-gray-200 mb-1">Dark (1)</div>
                      <div className="text-white/70 text-xs">Emergency lighting, distant glow</div>
                    </div>

                    <div className="bg-gray-700/50 border border-gray-500/50 rounded-lg p-3">
                      <div className="font-semibold text-gray-200 mb-1">Dim (2)</div>
                      <div className="text-white/70 text-xs">Candlelight, dawn/dusk conditions</div>
                    </div>

                    <div className="bg-blue-600/20 border border-blue-500/30 rounded-lg p-3">
                      <div className="font-semibold text-blue-200 mb-1">Average (3)</div>
                      <div className="text-white/70 text-xs">Standard indoor lighting, overcast day</div>
                    </div>

                    <div className="bg-yellow-600/20 border border-yellow-500/30 rounded-lg p-3">
                      <div className="font-semibold text-yellow-200 mb-1">Bright (4)</div>
                      <div className="text-white/70 text-xs">Well-lit room, flashlight beam</div>
                    </div>

                    <div className="bg-yellow-500/30 border border-yellow-400/40 rounded-lg p-3">
                      <div className="font-semibold text-yellow-100 mb-1">Very Bright (5)</div>
                      <div className="text-white/70 text-xs">Sunny day, floodlights</div>
                    </div>

                    <div className="bg-white/20 border border-white/30 rounded-lg p-3">
                      <div className="font-semibold text-white mb-1">Blinding (6)</div>
                      <div className="text-white/70 text-xs">Searchlights, direct sunlight</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h4 className="text-yellow-300 font-semibold mb-4">Light Source Effects</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-semibold text-yellow-200 mb-3">Personal Light Sources</h5>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 text-sm">
                        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                          <div className="font-semibold text-yellow-200 mb-1">Flashlight</div>
                          <div className="text-white/80 text-xs">Lights your current zone and one adjacent zone</div>
                        </div>

                        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                          <div className="font-semibold text-yellow-200 mb-1">Lantern</div>
                          <div className="text-white/80 text-xs">Lights your zone and all adjacent zones</div>
                        </div>

                        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                          <div className="font-semibold text-yellow-200 mb-1">Phone Light</div>
                          <div className="text-white/80 text-xs">Only lights your current zone</div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h5 className="font-semibold text-yellow-200 mb-3">Room Light Sources</h5>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 text-sm">
                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                          <div className="font-semibold text-blue-200 mb-1">Overhead Light</div>
                          <div className="text-white/80 text-xs">Lights center zone, adjacent zones get partial light</div>
                        </div>

                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                          <div className="font-semibold text-blue-200 mb-1">Desk Lamp</div>
                          <div className="text-white/80 text-xs">Only lights the zone it's located in</div>
                        </div>

                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                          <div className="font-semibold text-blue-200 mb-1">Emergency Lighting</div>
                          <div className="text-white/80 text-xs">Provides minimal light to all zones</div>
                        </div>

                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                          <div className="font-semibold text-blue-200 mb-1">Window (Daytime)</div>
                          <div className="text-white/80 text-xs">Lights the zone nearest to it</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h4 className="text-yellow-300 font-semibold mb-4">Lighting Effects on Gameplay</h4>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-semibold text-yellow-200 mb-3">Sight-Based Check Penalties</h5>
                      <div className="space-y-2 text-sm">
                        <div className="bg-gray-900/50 border border-gray-700/50 rounded p-3">
                          <span className="font-semibold text-gray-200">Pitch Black (0)</span>
                          <div className="text-white/80 text-xs">+3 Setback to all sight-based checks</div>
                        </div>
                        <div className="bg-gray-800/50 border border-gray-600/50 rounded p-3">
                          <span className="font-semibold text-gray-200">Dark (1)</span>
                          <div className="text-white/80 text-xs">+1 Setback to all sight-based checks</div>
                        </div>
                        <div className="bg-blue-600/20 border border-blue-500/30 rounded p-3">
                          <span className="font-semibold text-blue-200">Dim (2) - Bright (4)</span>
                          <div className="text-white/80 text-xs">No penalties to sight-based checks</div>
                        </div>
                        <div className="bg-yellow-500/30 border border-yellow-400/40 rounded p-3">
                          <span className="font-semibold text-yellow-200">Very Bright (5)</span>
                          <div className="text-white/80 text-xs">+1 Setback to all sight-based checks</div>
                        </div>
                        <div className="bg-white/20 border border-white/30 rounded p-3">
                          <span className="font-semibold text-white">Blinding (6)</span>
                          <div className="text-white/80 text-xs">+3 Setback to all sight-based checks</div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h5 className="font-semibold text-yellow-200 mb-3">Stealth Check Bonuses</h5>
                      <div className="space-y-2 text-sm">
                        <div className="bg-gray-900/50 border border-gray-700/50 rounded p-3">
                          <span className="font-semibold text-gray-200">Pitch Black (0)</span>
                          <div className="text-white/80 text-xs">+3 Boost to Stealth checks</div>
                        </div>
                        <div className="bg-gray-800/50 border border-gray-600/50 rounded p-3">
                          <span className="font-semibold text-gray-200">Dark (1)</span>
                          <div className="text-white/80 text-xs">+1 Boost to Stealth checks</div>
                        </div>
                        <div className="bg-blue-600/20 border border-blue-500/30 rounded p-3">
                          <span className="font-semibold text-blue-200">Dim (2) - Bright (4)</span>
                          <div className="text-white/80 text-xs">No bonuses to Stealth checks</div>
                        </div>
                        <div className="bg-yellow-500/30 border border-yellow-400/40 rounded p-3">
                          <span className="font-semibold text-yellow-200">Very Bright (5)</span>
                          <div className="text-white/80 text-xs">No bonuses to Stealth checks</div>
                        </div>
                        <div className="bg-white/20 border border-white/30 rounded p-3">
                          <span className="font-semibold text-white">Blinding (6)</span>
                          <div className="text-white/80 text-xs">No bonuses to Stealth checks</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 bg-blue-600/10 border border-blue-500/30 rounded-lg p-3">
                    <div className="font-semibold text-blue-300 mb-2">Sight-Based Checks Include:</div>
                    <div className="text-white/80 text-sm">
                      Combat attacks, Perception, Vigilance, skill checks requiring visual identification, and any other actions that rely primarily on vision.
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* Temperature Rules */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 shadow-xl overflow-hidden">
          <div 
            className="p-3 lg:p-4 border-b border-white/10 bg-gradient-to-r from-red-600/20 to-orange-600/20 cursor-pointer hover:bg-gradient-to-r hover:from-red-600/30 hover:to-orange-600/30 transition-all duration-300"
            onClick={() => toggleSection('temperature')}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-lg lg:text-xl">🌡️</span>
                <span className="text-white font-semibold text-base lg:text-lg">Temperature Rules</span>
                <span className="text-xs bg-red-500/30 text-red-300 px-2 py-1 rounded ml-2">
                  Climate
                </span>
              </div>
              
              <div className={`transform transition-transform duration-300 ${expandedSections.temperature ? 'rotate-180' : 'rotate-0'}`}>
                <svg className="w-4 h-4 lg:w-5 lg:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <div className={`transition-all duration-500 ease-in-out overflow-auto ${
            expandedSections.temperature 
              ? 'max-h-[800px] opacity-100'
              : 'max-h-0 opacity-0'
          }`}>
            <div className="p-3 lg:p-4 space-y-4">
              <div className="text-white space-y-3">
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h4 className="text-red-300 font-semibold mb-4">Temperature Levels</h4>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    <div className="bg-blue-900/60 border border-blue-800/60 rounded-lg p-3">
                      <div className="font-semibold text-blue-200 mb-1">Deadly Cold</div>
                      <div className="text-white/70 text-xs">Arctic conditions, -40°F and below</div>
                    </div>

                    <div className="bg-blue-800/50 border border-blue-700/50 rounded-lg p-3">
                      <div className="font-semibold text-blue-200 mb-1">Extreme Cold</div>
                      <div className="text-white/70 text-xs">Freezing winter, 0-32°F</div>
                    </div>

                    <div className="bg-blue-700/40 border border-blue-600/40 rounded-lg p-3">
                      <div className="font-semibold text-blue-200 mb-1">Very Cold</div>
                      <div className="text-white/70 text-xs">Cold winter day, 33-45°F</div>
                    </div>

                    <div className="bg-blue-600/30 border border-blue-500/30 rounded-lg p-3">
                      <div className="font-semibold text-blue-200 mb-1">Cold</div>
                      <div className="text-white/70 text-xs">Cool autumn day, 46-60°F</div>
                    </div>

                    <div className="bg-cyan-600/20 border border-cyan-500/30 rounded-lg p-3">
                      <div className="font-semibold text-cyan-200 mb-1">Cool</div>
                      <div className="text-white/70 text-xs">Mild spring day, 61-70°F</div>
                    </div>

                    <div className="bg-green-600/20 border border-green-500/30 rounded-lg p-3">
                      <div className="font-semibold text-green-200 mb-1">Comfortable</div>
                      <div className="text-white/70 text-xs">Room temperature, 71-75°F</div>
                    </div>

                    <div className="bg-yellow-600/20 border border-yellow-500/30 rounded-lg p-3">
                      <div className="font-semibold text-yellow-200 mb-1">Warm</div>
                      <div className="text-white/70 text-xs">Summer day, 76-85°F</div>
                    </div>

                    <div className="bg-orange-600/30 border border-orange-500/40 rounded-lg p-3">
                      <div className="font-semibold text-orange-200 mb-1">Hot</div>
                      <div className="text-white/70 text-xs">Hot summer day, 86-95°F</div>
                    </div>

                    <div className="bg-red-600/40 border border-red-500/50 rounded-lg p-3">
                      <div className="font-semibold text-red-200 mb-1">Very Hot</div>
                      <div className="text-white/70 text-xs">Desert day, 96-110°F</div>
                    </div>

                    <div className="bg-red-700/50 border border-red-600/60 rounded-lg p-3">
                      <div className="font-semibold text-red-200 mb-1">Extreme Heat</div>
                      <div className="text-white/70 text-xs">Death Valley conditions, 111-130°F</div>
                    </div>

                    <div className="bg-red-800/60 border border-red-700/70 rounded-lg p-3">
                      <div className="font-semibold text-red-200 mb-1">Deadly Heat</div>
                      <div className="text-white/70 text-xs">Furnace-like, 130°F+</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h4 className="text-red-300 font-semibold mb-4">Temperature Sources</h4>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 text-sm">
                    <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3">
                      <div className="font-semibold text-orange-200 mb-1">Heating Systems</div>
                      <div className="text-white/80 text-xs">Raise room temperature by 2-3 levels when functional</div>
                    </div>

                    <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3">
                      <div className="font-semibold text-orange-200 mb-1">Fires/Fireplaces</div>
                      <div className="text-white/80 text-xs">Raise room temperature by 1-2 levels</div>
                    </div>

                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                      <div className="font-semibold text-red-200 mb-1">Boiler Rooms/Mechanical Areas</div>
                      <div className="text-white/80 text-xs">Naturally hot (Hot to Extreme Heat range typically)</div>
                    </div>

                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                      <div className="font-semibold text-blue-200 mb-1">Freezer/Cold Storage</div>
                      <div className="text-white/80 text-xs">Naturally cold (Extreme Cold to Very Cold range typically)</div>
                    </div>

                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                      <div className="font-semibold text-yellow-200 mb-1">Electronic Heat</div>
                      <div className="text-white/80 text-xs">Servers/machinery can raise temperature by 1 level</div>
                    </div>

                    <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
                      <div className="font-semibold text-purple-200 mb-1">Broken/Malfunctioning HVAC</div>
                      <div className="text-white/80 text-xs">Can cause extreme temperatures in either direction</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h4 className="text-red-300 font-semibold mb-4">Temperature Effects</h4>
                  
                  <div className="space-y-3 text-sm">
                    <div className="bg-blue-600/20 border border-blue-500/30 rounded-lg p-3">
                      <div className="font-semibold text-blue-200 mb-2">Extreme Cold Temperatures (Deadly Cold to Very Cold)</div>
                      <div className="text-white/80 text-xs space-y-1">
                        <div>• 2 Setback to all physical checks</div>
                        <div>• Suffer 1 strain per 10 minutes of exposure without protection</div>
                        <div>• After 1 hour of exposure, make a Hard Resilience check or suffer hypothermia</div>
                      </div>
                    </div>

                    <div className="bg-cyan-600/20 border border-cyan-500/30 rounded-lg p-3">
                      <div className="font-semibold text-cyan-200 mb-2">Cold Temperature</div>
                      <div className="text-white/80 text-xs space-y-1">
                        <div>• 1 Setback to physical checks</div>
                        <div>• No immediate damage but discomfort</div>
                      </div>
                    </div>

                    <div className="bg-green-600/20 border border-green-500/30 rounded-lg p-3">
                      <div className="font-semibold text-green-200 mb-2">Comfortable Temperatures (Cool to Warm)</div>
                      <div className="text-white/80 text-xs">No penalties or bonuses</div>
                    </div>

                    <div className="bg-orange-600/20 border border-orange-500/30 rounded-lg p-3">
                      <div className="font-semibold text-orange-200 mb-2">Hot Temperature</div>
                      <div className="text-white/80 text-xs">1 Setback to physical checks</div>
                    </div>

                    <div className="bg-red-600/20 border border-red-500/30 rounded-lg p-3">
                      <div className="font-semibold text-red-200 mb-2">Extreme Heat Temperatures (Very Hot to Deadly Heat)</div>
                      <div className="text-white/80 text-xs space-y-1">
                        <div>• 2 Setback to all physical checks</div>
                        <div>• Suffer 1 strain per 10 minutes of exposure without protection</div>
                        <div>• After 30 minutes of exposure, make a Hard Resilience check or suffer heat stroke</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h4 className="text-red-300 font-semibold mb-4">Temperature-Related Conditions</h4>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="bg-blue-600/20 border border-blue-500/30 rounded-lg p-3">
                      <div className="font-semibold text-blue-200 mb-2">Hypothermia</div>
                      <div className="text-white/80 text-sm space-y-2">
                        <div>• Gain the Sickened status effect (1 Setback to all Brawn and Agility checks)</div>
                        <div>• Must make another Hard Resilience check every 30 minutes or gain 1 Exhaustion</div>
                        <div>• Removed by warming up to Cool temperature or higher for at least 1 hour</div>
                      </div>
                    </div>

                    <div className="bg-red-600/20 border border-red-500/30 rounded-lg p-3">
                      <div className="font-semibold text-red-200 mb-2">Heat Stroke</div>
                      <div className="text-white/80 text-sm space-y-2">
                        <div>• Gain the Sickened status effect (1 Setback to all Brawn and Agility checks)</div>
                        <div>• Must make another Hard Resilience check every 15 minutes or gain 1 Exhaustion</div>
                        <div>• Removed by cooling down to Warm temperature or lower for at least 1 hour</div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* Resting Rules */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 shadow-xl overflow-hidden">
          <div 
            className="p-3 lg:p-4 border-b border-white/10 bg-gradient-to-r from-teal-600/20 to-blue-600/20 cursor-pointer hover:bg-gradient-to-r hover:from-teal-600/30 hover:to-blue-600/30 transition-all duration-300"
            onClick={() => toggleSection('resting')}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-lg lg:text-xl">🛌</span>
                <span className="text-white font-semibold text-base lg:text-lg">Resting Rules</span>
                <span className="text-xs bg-teal-500/30 text-teal-300 px-2 py-1 rounded ml-2">
                  Recovery
                </span>
              </div>
              
              <div className={`transform transition-transform duration-300 ${expandedSections.resting ? 'rotate-180' : 'rotate-0'}`}>
                <svg className="w-4 h-4 lg:w-5 lg:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <div className={`transition-all duration-500 ease-in-out overflow-auto ${
            expandedSections.resting 
              ? 'max-h-[800px] opacity-100'
              : 'max-h-0 opacity-0'
          }`}>
            <div className="p-3 lg:p-4 space-y-4">
              <div className="text-white space-y-3">
                
                <div className="bg-teal-500/10 border border-teal-500/30 rounded-lg p-3">
                  <div className="font-semibold text-teal-300 mb-2">🛌 The Basic Rule</div>
                  <div className="text-white/90 text-sm">
                    In Genesys, a night's rest heals all strain and 1 wound. In the Backrooms, <strong>danger determines how much total rest time you get</strong> before entities find you.
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h4 className="text-teal-300 font-semibold mb-4">Total Rest Time by Danger Level</h4>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                      <div className="font-semibold text-green-200 mb-1">🏠 Danger 0</div>
                      <div className="text-white/80 text-sm">Unlimited rest time</div>
                    </div>

                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                      <div className="font-semibold text-blue-200 mb-1">🛡️ Danger 1</div>
                      <div className="text-white/80 text-sm">48 hours total before entity encounter</div>
                    </div>

                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                      <div className="font-semibold text-yellow-200 mb-1">⚠️ Danger 2</div>
                      <div className="text-white/80 text-sm">16 hours total before entity encounter</div>
                    </div>

                    <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3">
                      <div className="font-semibold text-orange-200 mb-1">🚨 Danger 3</div>
                      <div className="text-white/80 text-sm">4 hours total before entity encounter</div>
                    </div>

                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                      <div className="font-semibold text-red-200 mb-1">💀 Danger 4+</div>
                      <div className="text-white/80 text-sm">No rest possible</div>
                    </div>
                  </div>

                  <div className="mt-3 bg-blue-600/20 border border-blue-500/30 rounded-lg p-3">
                    <div className="font-semibold text-blue-300 mb-1">Rest Time Rules</div>
                    <div className="text-white/80 text-sm">
                      Mix and match rest types within your time limit. Leaving and returning resets the timer.
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h4 className="text-teal-300 font-semibold mb-4">Rest Types</h4>
                  
                  <div className="space-y-4">
                    <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-3">
                      <h5 className="font-semibold text-cyan-200 mb-2">Short Rest (1 hour)</h5>
                      <div className="text-white/80 text-sm space-y-1">
                        <div>• Make <strong>Simple Discipline check</strong></div>
                        <div>• <strong>Recover strain = successes rolled</strong></div>
                        <div><strong>Danger 3:</strong> Roll d10 - on 1-2, entity encounter interrupts rest</div>
                      </div>
                    </div>

                    <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
                      <h5 className="font-semibold text-purple-200 mb-2">Full Rest (8 hours sleep)</h5>
                      <div className="text-white/80 text-sm space-y-1">
                        <div>• <strong>Recover all strain + 1 wound</strong> (standard Genesys)</div>
                        <div><strong>Danger 2:</strong> Roll d10 - on 1-2, entity encounter interrupts rest</div>
                        <div><strong>Danger 3:</strong> Roll d10 - on 1-3, entity encounter interrupts rest</div>
                      </div>
                    </div>

                    <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-3">
                      <h5 className="font-semibold text-indigo-200 mb-2">Extended Rest (24 hours)</h5>
                      <div className="text-white/80 text-sm space-y-1">
                        <div>• <strong>Recover all strain + half total wounds (rounded up)</strong></div>
                        <div><strong>Danger 1:</strong> Roll d10 - on 1, entity encounter interrupts rest</div>
                        <div><strong>Danger 2:</strong> Roll d10 - on 1-2, entity encounter interrupts rest</div>
                        <div><strong>Danger 3:</strong> Roll d10 - on 1-4, entity encounter interrupts rest</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h5 className="font-semibold text-orange-200 mb-3">Sanity Recovery</h5>
                  <div className="space-y-3">
                    <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
                      <div className="font-semibold text-purple-200 mb-1">Short Rest</div>
                      <div className="text-white/80 text-sm">No sanity recovery</div>
                    </div>

                    <div className="bg-purple-600/15 border border-purple-600/25 rounded-lg p-3">
                      <div className="font-semibold text-purple-200 mb-1">Full Rest</div>
                      <div className="text-white/80 text-sm">Recover 1 sanity</div>
                    </div>

                    <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-3">
                      <div className="font-semibold text-indigo-200 mb-1">Extended Rest</div>
                      <div className="text-white/80 text-sm">Recover 3 sanity</div>
                    </div>

                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                      <div className="font-semibold text-blue-200 mb-1">Group Rest</div>
                      <div className="text-white/80 text-sm">+1 sanity recovery bonus when resting with others</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Exhaustion Rules */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 shadow-xl overflow-hidden">
          <div 
            className="p-3 lg:p-4 border-b border-white/10 bg-gradient-to-r from-orange-600/20 to-red-600/20 cursor-pointer hover:bg-gradient-to-r hover:from-orange-600/30 hover:to-red-600/30 transition-all duration-300"
            onClick={() => toggleSection('exhaustion')}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-lg lg:text-xl">😴</span>
                <span className="text-white font-semibold text-base lg:text-lg">Exhaustion Rules</span>
                <span className="text-xs bg-orange-500/30 text-orange-300 px-2 py-1 rounded ml-2">
                  Fatigue
                </span>
              </div>
              
              <div className={`transform transition-transform duration-300 ${expandedSections.exhaustion ? 'rotate-180' : 'rotate-0'}`}>
                <svg className="w-4 h-4 lg:w-5 lg:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <div className={`transition-all duration-500 ease-in-out overflow-auto ${
            expandedSections.exhaustion 
              ? 'max-h-[800px] opacity-100'
              : 'max-h-0 opacity-0'
          }`}>
            <div className="p-3 lg:p-4 space-y-4">
              <div className="text-white space-y-3">
                
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-3">
                  <div className="font-semibold text-orange-300 mb-2">😴 Physical Fatigue in the Endless Maze</div>
                  <div className="text-white/90 text-sm">
                    Exhaustion represents physical deterioration from environmental stress and basic needs. It affects only physical capabilities, leaving mental faculties for the sanity system.
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h4 className="text-orange-300 font-semibold mb-4">Gaining Exhaustion</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-semibold text-orange-200 mb-3">Environmental Sources</h5>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                          <div className="font-semibold text-red-200 mb-1">Extreme Temperature</div>
                          <div className="text-white/80 text-sm">1 Exhaustion per hour in Very Cold/Very Hot or worse conditions</div>
                        </div>

                        <div className="bg-gray-500/10 border border-gray-500/20 rounded-lg p-3">
                          <div className="font-semibold text-gray-200 mb-1">Poor Lighting</div>
                          <div className="text-white/80 text-sm">1 Exhaustion per 8 hours in Pitch Black (0) or Blinding (6) light</div>
                        </div>

                        <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
                          <div className="font-semibold text-purple-200 mb-1">Sleep Deprivation</div>
                          <div className="text-white/80 text-sm">1 Exhaustion per 24 hours without Full Rest (8+ hours sleep)</div>
                        </div>

                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                          <div className="font-semibold text-blue-200 mb-1">No Rations</div>
                          <div className="text-white/80 text-sm">1 Exhaustion per 24 hours without food/water</div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h5 className="font-semibold text-orange-200 mb-3">Other Sources</h5>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                          <div className="font-semibold text-yellow-200 mb-1">Critical Injuries</div>
                          <div className="text-white/80 text-sm">May gain 1 Exhaustion if critical injury roll is 80 or lower (after modifiers)</div>
                        </div>

                        <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3">
                          <div className="font-semibold text-orange-200 mb-1">Overexertion</div>
                          <div className="text-white/80 text-sm">Repeated strain threshold hits in short periods</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h4 className="text-orange-300 font-semibold mb-4">Exhaustion Effects</h4>
                  <div className="mb-3 text-white/80 text-sm italic">Affects only physical capabilities</div>
                  
                  <div className="space-y-3">
                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                      <div className="font-semibold text-yellow-200 mb-1">Level 1</div>
                      <div className="text-white/80 text-sm">Add 1 Setback die to all Brawn and Agility checks</div>
                    </div>

                    <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3">
                      <div className="font-semibold text-orange-200 mb-1">Level 2</div>
                      <div className="text-white/80 text-sm">Add 2 Setback dice to all Brawn and Agility checks</div>
                    </div>

                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                      <div className="font-semibold text-red-200 mb-1">Level 3</div>
                      <div className="text-white/80 text-sm">Add 3 Setback dice to all Brawn and Agility checks</div>
                    </div>

                    <div className="bg-red-600/20 border border-red-600/30 rounded-lg p-3">
                      <div className="font-semibold text-red-200 mb-1">Level 4</div>
                      <div className="text-white/80 text-sm">Add 4 Setback dice to all Brawn and Agility checks</div>
                    </div>

                    <div className="bg-red-800/30 border border-red-700/40 rounded-lg p-3">
                      <div className="font-semibold text-red-200 mb-1">Level 5</div>
                      <div className="text-white/80 text-sm">Character becomes Incapacitated until exhaustion is reduced</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h4 className="text-orange-300 font-semibold mb-4">Removing Exhaustion</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-semibold text-orange-200 mb-3">Through Rest</h5>
                      <div className="space-y-3">
                        <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-3">
                          <div className="font-semibold text-cyan-200 mb-1">Short Rest (1 hour)</div>
                          <div className="text-white/80 text-sm">No exhaustion removal</div>
                        </div>

                        <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
                          <div className="font-semibold text-purple-200 mb-1">Full Rest (8 hours)</div>
                          <div className="text-white/80 text-sm">Remove 1 level of exhaustion</div>
                        </div>

                        <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-3">
                          <div className="font-semibold text-indigo-200 mb-1">Extended Rest (24 hours)</div>
                          <div className="text-white/80 text-sm">Remove ALL exhaustion levels</div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h5 className="font-semibold text-orange-200 mb-3">Environmental Requirements</h5>
                      <div className="space-y-3">
                        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                          <div className="font-semibold text-green-200 mb-1">Temperature</div>
                          <div className="text-white/80 text-sm">Must rest in Comfortable range (Cool to Warm) to remove exhaustion</div>
                        </div>

                        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                          <div className="font-semibold text-red-200 mb-1">Extreme Conditions</div>
                          <div className="text-white/80 text-sm">No exhaustion removal if resting in Very Cold/Very Hot or worse</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-600/10 border border-blue-500/30 rounded-lg p-4">
                  <h5 className="font-semibold text-blue-300 mb-3">Special Notes</h5>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 text-sm">
                    <div>
                      <div className="font-semibold text-blue-200 mb-1">Maximum</div>
                      <div className="text-white/80 text-xs">Exhaustion caps at Level 5 (Incapacitated)</div>
                    </div>

                    <div>
                      <div className="font-semibold text-blue-200 mb-1">Physical Focus</div>
                      <div className="text-white/80 text-xs">Only affects Brawn/Agility - mental faculties remain sharp</div>
                    </div>

                    <div>
                      <div className="font-semibold text-blue-200 mb-1">Basic Needs</div>
                      <div className="text-white/80 text-xs">Rations and proper rest are essential for physical maintenance</div>
                    </div>

                    <div>
                      <div className="font-semibold text-blue-200 mb-1">Tracking</div>
                      <div className="text-white/80 text-xs">Simple 1-5 scale for easy gameplay tracking</div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* Fear and Sanity Rules */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 shadow-xl overflow-hidden">
          <div 
            className="p-3 lg:p-4 border-b border-white/10 bg-gradient-to-r from-purple-600/20 to-indigo-600/20 cursor-pointer hover:bg-gradient-to-r hover:from-purple-600/30 hover:to-indigo-600/30 transition-all duration-300"
            onClick={() => toggleSection('fear')}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-lg lg:text-xl">😱</span>
                <span className="text-white font-semibold text-base lg:text-lg">Sanity & Fear Rules</span>
                <span className="text-xs bg-purple-500/30 text-purple-300 px-2 py-1 rounded ml-2">
                  Mental Effects
                </span>
              </div>
              
              <div className={`transform transition-transform duration-300 ${expandedSections.fear ? 'rotate-180' : 'rotate-0'}`}>
                <svg className="w-4 h-4 lg:w-5 lg:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <div className={`transition-all duration-500 ease-in-out overflow-auto ${
            expandedSections.fear 
              ? 'max-h-[800px] opacity-100'
              : 'max-h-0 opacity-0'
          }`}>
            <div className="p-3 lg:p-4 space-y-4">
              <div className="text-white space-y-3">
                
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
                  <div className="font-semibold text-purple-300 mb-2">😱 Mental Deterioration in the Infinite Maze</div>
                  <div className="text-white/90 text-sm">
                    Sanity represents mental stability and cognitive function. Fear causes sanity loss, affecting mental capabilities while leaving physical abilities intact.
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h4 className="text-purple-300 font-semibold mb-4">Fear System</h4>
                  
                  <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-3">
                    <h5 className="font-semibold text-indigo-200 mb-3">Fear Check Results</h5>
                    <div className="space-y-2 text-sm">
                      <div className="text-white/80">
                        <strong className="text-green-300">Success:</strong> No immediate effect, maintain composure
                      </div>
                      <div className="text-white/80">
                        <strong className="text-yellow-300">Failure:</strong> Gain <strong>Frightened</strong> status + lose sanity based on failure severity
                      </div>
                      <div className="text-white/80">
                        <strong className="text-red-300">Despair:</strong> Lose 2 additional sanity + potential <strong>Confused</strong> status
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h4 className="text-purple-300 font-semibold mb-4">Sanity System</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-semibold text-purple-200 mb-3">Sanity Loss</h5>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                          <div className="font-semibold text-red-200 mb-1">Failed Fear Check</div>
                          <div className="text-white/80 text-sm">Lose 1 sanity per net failure</div>
                        </div>

                        <div className="bg-red-600/15 border border-red-600/25 rounded-lg p-3">
                          <div className="font-semibold text-red-200 mb-1">Despair on Fear Check</div>
                          <div className="text-white/80 text-sm">Lose 2 additional sanity</div>
                        </div>

                        <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3">
                          <div className="font-semibold text-orange-200 mb-1">Witnessing Death</div>
                          <div className="text-white/80 text-sm">Lose 1-3 sanity (depending on circumstances)</div>
                        </div>

                        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                          <div className="font-semibold text-yellow-200 mb-1">Entity Attack</div>
                          <div className="text-white/80 text-sm">Lose 1 sanity regardless of physical damage</div>
                        </div>

                        <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
                          <div className="font-semibold text-purple-200 mb-1">Sleep Deprivation</div>
                          <div className="text-white/80 text-sm">Lose 1 sanity per 48 hours without Full Rest</div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h5 className="font-semibold text-purple-200 mb-3">Sanity Effects</h5>
                      <div className="mb-3 text-white/80 text-sm italic">Affects mental capabilities (Intellect, Cunning, Willpower)</div>
                      
                      <div className="space-y-3">
                        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                          <div className="font-semibold text-green-200 mb-1">80-100% Sanity</div>
                          <div className="text-white/80 text-sm">No penalties</div>
                        </div>

                        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                          <div className="font-semibold text-yellow-200 mb-1">60-79% Sanity</div>
                          <div className="text-white/80 text-sm">Add 1 Setback die to all mental checks</div>
                        </div>

                        <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3">
                          <div className="font-semibold text-orange-200 mb-1">40-59% Sanity</div>
                          <div className="text-white/80 text-sm">Add 2 Setback dice to all mental checks</div>
                        </div>

                        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                          <div className="font-semibold text-red-200 mb-1">20-39% Sanity</div>
                          <div className="text-white/80 text-sm">Add 3 Setback dice to all mental checks + gain <strong>Disoriented</strong></div>
                        </div>

                        <div className="bg-red-600/20 border border-red-600/30 rounded-lg p-3">
                          <div className="font-semibold text-red-200 mb-1">1-19% Sanity</div>
                          <div className="text-white/80 text-sm">Add 4 Setback dice to all mental checks + gain <strong>Confused</strong></div>
                        </div>

                        <div className="bg-red-800/30 border border-red-700/40 rounded-lg p-3">
                          <div className="font-semibold text-red-200 mb-1">0 Sanity</div>
                          <div className="text-white/80 text-sm">Character becomes <strong>Incapacitated</strong> until sanity restored</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-600/10 border border-blue-500/30 rounded-lg p-4">
                  <h5 className="font-semibold text-blue-300 mb-3">Special Notes</h5>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 text-sm">
                    <div>
                      <div className="font-semibold text-blue-200 mb-1">Maximum</div>
                      <div className="text-white/80 text-xs">Sanity starts at 100, cannot exceed starting value</div>
                    </div>

                    <div>
                      <div className="font-semibold text-blue-200 mb-1">Mental Focus</div>
                      <div className="text-white/80 text-xs">Only affects Intellect/Cunning/Willpower checks</div>
                    </div>

                    <div>
                      <div className="font-semibold text-blue-200 mb-1">Group Support</div>
                      <div className="text-white/80 text-xs">Characters can help each other resist fear through teamwork</div>
                    </div>

                    <div>
                      <div className="font-semibold text-blue-200 mb-1">Percentage Tracking</div>
                      <div className="text-white/80 text-xs">Track as 0-100 scale for clear thresholds</div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* Fall Damage Rules */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 shadow-xl overflow-hidden">
          <div 
            className="p-3 lg:p-4 border-b border-white/10 bg-gradient-to-r from-gray-600/20 to-slate-600/20 cursor-pointer hover:bg-gradient-to-r hover:from-gray-600/30 hover:to-slate-600/30 transition-all duration-300"
            onClick={() => toggleSection('fall')}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-lg lg:text-xl">🪂</span>
                <span className="text-white font-semibold text-base lg:text-lg">Fall Damage Rules</span>
                <span className="text-xs bg-gray-500/30 text-gray-300 px-2 py-1 rounded ml-2">
                  Physics
                </span>
              </div>
              
              <div className={`transform transition-transform duration-300 ${expandedSections.fall ? 'rotate-180' : 'rotate-0'}`}>
                <svg className="w-4 h-4 lg:w-5 lg:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <div className={`transition-all duration-500 ease-in-out overflow-auto ${
            expandedSections.fall 
              ? 'max-h-[800px] opacity-100'
              : 'max-h-0 opacity-0'
          }`}>
            <div className="p-3 lg:p-4 space-y-4">
              <div className="text-white space-y-3">
                
                <div className="bg-gray-500/10 border border-gray-500/30 rounded-lg p-3">
                  <div className="font-semibold text-gray-300 mb-2">🪂 Falling Damage System</div>
                  <div className="text-white/90 text-sm">
                    Falls are measured by range bands and cause both wounds and strain. Characters can attempt to reduce damage through skill checks or environmental factors.
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h4 className="text-gray-300 font-semibold mb-4">Falling Damage Table</h4>
                  
                  <div className="space-y-3">
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                      <div className="font-semibold text-green-200 mb-1">Short Range Fall</div>
                      <div className="text-white/80 text-sm">
                        <strong>Damage:</strong> 10 wounds + 10 strain<br/>
                        <strong>Examples:</strong> Falling from a low wall, or first story window
                      </div>
                    </div>

                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                      <div className="font-semibold text-yellow-200 mb-1">Medium Range Fall</div>
                      <div className="text-white/80 text-sm">
                        <strong>Damage:</strong> 30 wounds + 20 strain<br/>
                        <strong>Examples:</strong> Falling from a second story, high wall, or tall tree
                      </div>
                    </div>

                    <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3">
                      <div className="font-semibold text-orange-200 mb-1">Long Range Fall</div>
                      <div className="text-white/80 text-sm">
                        <strong>Damage:</strong> Wound Threshold + 30 strain + crit 50<br/>
                        <strong>Examples:</strong> Falling from a third story, tall building, or cliff
                      </div>
                    </div>

                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                      <div className="font-semibold text-red-200 mb-1">Extreme Range Fall</div>
                      <div className="text-white/80 text-sm">
                        <strong>Damage:</strong> Wound Threshold + 40 strain + crit 75<br/>
                        <strong>Examples:</strong> Falling from a skyscraper, mountain, or terminal velocity
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h4 className="text-gray-300 font-semibold mb-4">Reducing Fall Damage</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-semibold text-gray-200 mb-3">Skill Checks</h5>
                      <div className="space-y-3">
                        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                          <div className="font-semibold text-green-200 mb-1">Athletics Check</div>
                          <div className="text-white/80 text-sm">
                            <strong>Difficulty:</strong> Average (dd)<br/>
                            <strong>Success:</strong> Each success reduces wounds by 1<br/>
                            <strong>Advantage:</strong> Each advantage reduces strain by 1
                          </div>
                        </div>

                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                          <div className="font-semibold text-blue-200 mb-1">Coordination Check</div>
                          <div className="text-white/80 text-sm">
                            <strong>Difficulty:</strong> Average (dd)<br/>
                            <strong>Success:</strong> Each success reduces wounds by 1<br/>
                            <strong>Advantage:</strong> Each advantage reduces strain by 1
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h5 className="font-semibold text-gray-200 mb-3">Environmental Factors</h5>
                      <div className="space-y-3">
                        <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
                          <div className="font-semibold text-purple-200 mb-1">Triumph Result</div>
                          <div className="text-white/80 text-sm">
                            GM may reduce the fall distance by one range band (character grabs handhold, lands on something, etc.)
                          </div>
                        </div>

                        <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-3">
                          <div className="font-semibold text-indigo-200 mb-1">Soft Landing Surfaces</div>
                          <div className="text-white/80 text-sm">
                            <strong>Examples:</strong> Water, snow, hay, cushions<br/>
                            <strong>Effect:</strong> GM may reduce damage or allow additional checks
                          </div>
                        </div>

                        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                          <div className="font-semibold text-red-200 mb-1">Hard Landing Surfaces</div>
                          <div className="text-white/80 text-sm">
                            <strong>Examples:</strong> Concrete, rocks, spikes<br/>
                            <strong>Effect:</strong> GM may increase damage or add setback to reduction checks
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-4">
                  <h5 className="font-semibold text-yellow-300 mb-3">Special Fall Situations</h5>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 text-sm">
                    <div>
                      <div className="font-semibold text-yellow-200 mb-1">Deliberate Jumps</div>
                      <div className="text-white/80 text-xs">Characters may gain boost dice to reduction checks for planned falls</div>
                    </div>

                    <div>
                      <div className="font-semibold text-yellow-200 mb-1">Pushed/Thrown</div>
                      <div className="text-white/80 text-xs">Add setback dice to reduction checks for involuntary falls</div>
                    </div>

                    <div>
                      <div className="font-semibold text-yellow-200 mb-1">Multiple Falls</div>
                      <div className="text-white/80 text-xs">Each subsequent fall in same encounter adds 1 setback to reduction checks</div>
                    </div>

                    <div>
                      <div className="font-semibold text-yellow-200 mb-1">Equipment Assistance</div>
                      <div className="text-white/80 text-xs">Ropes, grappling hooks, or other gear may provide boost dice or reduce fall distance</div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* Atmospheric Hazard Rules */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 shadow-xl overflow-hidden">
          <div 
            className="p-3 lg:p-4 border-b border-white/10 bg-gradient-to-r from-emerald-600/20 to-cyan-600/20 cursor-pointer hover:bg-gradient-to-r hover:from-emerald-600/30 hover:to-cyan-600/30 transition-all duration-300"
            onClick={() => toggleSection('atmospheric')}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-lg lg:text-xl">🌫️</span>
                <span className="text-white font-semibold text-base lg:text-lg">Atmospheric Hazard Rules</span>
                <span className="text-xs bg-emerald-500/30 text-emerald-300 px-2 py-1 rounded ml-2">
                  Environment
                </span>
              </div>
              
              <div className={`transform transition-transform duration-300 ${expandedSections.atmospheric ? 'rotate-180' : 'rotate-0'}`}>
                <svg className="w-4 h-4 lg:w-5 lg:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <div className={`transition-all duration-500 ease-in-out overflow-auto ${
            expandedSections.atmospheric 
              ? 'max-h-[800px] opacity-100'
              : 'max-h-0 opacity-0'
          }`}>
            <div className="p-3 lg:p-4 space-y-4">
              <div className="text-white space-y-3">
                
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3">
                  <div className="font-semibold text-emerald-300 mb-2">🌫️ Poisonous Air in the Endless Maze</div>
                  <div className="text-white/90 text-sm">
                    Toxic atmospheres represent contaminated air that causes progressive damage over time. Different toxicity levels cause escalating effects from mild discomfort to life-threatening poisoning.
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h4 className="text-emerald-300 font-semibold mb-4">Atmosphere Types</h4>
                  
                  <div className="space-y-3">
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                      <div className="font-semibold text-green-200 mb-2">Level 1 - Minor Toxicity</div>
                      <div className="text-white/80 text-sm space-y-1">
                        <div><strong>Sources:</strong> Mold spores, stagnant air, dust particles</div>
                        <div><strong>Effect:</strong> 1 strain per hour of exposure</div>
                      </div>
                    </div>

                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                      <div className="font-semibold text-yellow-200 mb-2">Level 2 - Mild Toxicity</div>
                      <div className="text-white/80 text-sm space-y-1">
                        <div><strong>Sources:</strong> Chemical residue, heavy mold, old paint fumes</div>
                        <div><strong>Effect:</strong> 1 strain per 10 minutes of exposure</div>
                      </div>
                    </div>

                    <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3">
                      <div className="font-semibold text-orange-200 mb-2">Level 3 - Moderate Toxicity</div>
                      <div className="text-white/80 text-sm space-y-1">
                        <div><strong>Sources:</strong> Industrial chemicals, sewage gases, cleaning solvents</div>
                        <div><strong>Effect:</strong> 1 wound + 1 strain per 10 minutes of exposure</div>
                      </div>
                    </div>

                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                      <div className="font-semibold text-red-200 mb-2">Level 4 - Severe Toxicity</div>
                      <div className="text-white/80 text-sm space-y-1">
                        <div><strong>Sources:</strong> Concentrated chemicals, acid vapors, toxic gas pockets</div>
                        <div><strong>Effect:</strong> 2 wounds + 2 strain per 10 minutes + Poisoned status</div>
                      </div>
                    </div>

                    <div className="bg-red-700/20 border border-red-600/30 rounded-lg p-3">
                      <div className="font-semibold text-red-200 mb-2">Level 5 - Deadly Toxicity</div>
                      <div className="text-white/80 text-sm space-y-1">
                        <div><strong>Sources:</strong> Pure toxic gases, reality-warping chemicals, lethal compounds</div>
                        <div><strong>Effect:</strong> 3 wounds + 3 strain per minute + Poisoned status</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h4 className="text-emerald-300 font-semibold mb-4">Toxic Effects</h4>
                  
                  <div className="space-y-4">
                    <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
                      <h5 className="font-semibold text-purple-200 mb-2">Poisoned Status (from Level 4+ exposure)</h5>
                      <div className="text-white/80 text-sm space-y-1">
                        <div>• Add 1 Setback to all Brawn and Agility checks</div>
                        <div>• Suffer ongoing damage as specified by atmosphere type</div>
                        <div>• Make Hard Resilience check each hour to reduce severity</div>
                      </div>
                    </div>

                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                      <h5 className="font-semibold text-blue-200 mb-2">Atmospheric Adaptation</h5>
                      <div className="text-white/80 text-sm space-y-2">
                        <div><strong>Resilience Checks:</strong> Characters can attempt to resist effects</div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 text-xs">
                          <div><strong>Level 1:</strong> Simple (-) difficulty</div>
                          <div><strong>Level 2:</strong> Easy (d) difficulty</div>
                          <div><strong>Level 3:</strong> Average (dd) difficulty</div>
                          <div><strong>Level 4:</strong> Hard (ddd) difficulty</div>
                          <div><strong>Level 5:</strong> Daunting (dddd) difficulty</div>
                        </div>
                        <div><strong>Success:</strong> Reduce damage by 1 (wounds/strain)</div>
                        <div><strong>Advantage:</strong> Extend time before next damage interval</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h4 className="text-emerald-300 font-semibold mb-4">Environmental Integration</h4>
                  
                  <div className="space-y-3">
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                      <div className="font-semibold text-red-200 mb-1">Temperature</div>
                      <div className="text-white/80 text-sm">Extreme heat/cold worsens toxic effects (+1 damage)</div>
                    </div>

                    <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3">
                      <div className="font-semibold text-orange-200 mb-1">Exhaustion</div>
                      <div className="text-white/80 text-sm">Level 3+ exhaustion prevents effective resistance (add 2 Setback to Resilience checks)</div>
                    </div>

                    <div className="bg-gray-500/10 border border-gray-500/20 rounded-lg p-3">
                      <div className="font-semibold text-gray-200 mb-1">Lighting</div>
                      <div className="text-white/80 text-sm">Poor visibility makes identifying toxic areas difficult</div>
                    </div>
                  </div>
                </div>

                <div className="bg-cyan-600/10 border border-cyan-500/30 rounded-lg p-4">
                  <h5 className="font-semibold text-cyan-300 mb-3">Special Notes</h5>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 text-sm">
                    <div>
                      <div className="font-semibold text-cyan-200 mb-1">Holding Breath</div>
                      <div className="text-white/80 text-xs">Can delay effects for rounds equal to Brawn rating</div>
                    </div>

                    <div>
                      <div className="font-semibold text-cyan-200 mb-1">Cumulative Exposure</div>
                      <div className="text-white/80 text-xs">Multiple toxicity sources may stack effects</div>
                    </div>

                    <div>
                      <div className="font-semibold text-cyan-200 mb-1">Safe Zones</div>
                      <div className="text-white/80 text-xs">Moving to clean air stops damage but doesn't remove Poisoned status</div>
                    </div>

                    <div>
                      <div className="font-semibold text-cyan-200 mb-1">Progressive Damage</div>
                      <div className="text-white/80 text-xs">Effects continue until atmosphere changes or protection is used</div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* Hacking Rules */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 shadow-xl overflow-hidden">
          <div 
            className="p-3 lg:p-4 border-b border-white/10 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 cursor-pointer hover:bg-gradient-to-r hover:from-cyan-600/30 hover:to-blue-600/30 transition-all duration-300"
            onClick={() => toggleSection('hacking')}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-lg lg:text-xl">💻</span>
                <span className="text-white font-semibold text-base lg:text-lg">Hacking Rules</span>
                <span className="text-xs bg-cyan-500/30 text-cyan-300 px-2 py-1 rounded ml-2">
                  Technology
                </span>
              </div>
              
              <div className={`transform transition-transform duration-300 ${expandedSections.hacking ? 'rotate-180' : 'rotate-0'}`}>
                <svg className="w-4 h-4 lg:w-5 lg:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <div className={`transition-all duration-500 ease-in-out overflow-auto ${
            expandedSections.hacking 
              ? 'max-h-[800px] opacity-100'
              : 'max-h-0 opacity-0'
          }`}>
            <div className="p-3 lg:p-4 space-y-4">
              <div className="text-white space-y-3">
                
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3">
                  <div className="font-semibold text-cyan-300 mb-2">💻 Digital Infiltration in Technological Spaces</div>
                  <div className="text-white/90 text-sm">
                    Hacking uses structured time like combat. You fight against computer systems that defend themselves with security programs (ICE) and human operators (sysops).
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h4 className="text-cyan-300 font-semibold mb-4">System Security Levels</h4>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                      <div className="font-semibold text-green-200 mb-1">Unsecured (-)</div>
                      <div className="text-white/80 text-sm">Personal devices, basic cameras</div>
                    </div>

                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                      <div className="font-semibold text-yellow-200 mb-1">Low Security (d)</div>
                      <div className="text-white/80 text-sm">Office computers, simple databases</div>
                    </div>

                    <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3">
                      <div className="font-semibold text-orange-200 mb-1">Medium Security (dd)</div>
                      <div className="text-white/80 text-sm">Corporate systems, secure databases</div>
                    </div>

                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                      <div className="font-semibold text-red-200 mb-1">High Security (ddd)</div>
                      <div className="text-white/80 text-sm">Government systems, military networks</div>
                    </div>

                    <div className="bg-red-700/20 border border-red-600/30 rounded-lg p-3">
                      <div className="font-semibold text-red-200 mb-1">Maximum Security (dddd)</div>
                      <div className="text-white/80 text-sm">Black sites, classified systems</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h4 className="text-cyan-300 font-semibold mb-4">System Components</h4>
                  
                  <div className="space-y-3">
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                      <div className="font-semibold text-blue-200 mb-1">Firewall</div>
                      <div className="text-white/80 text-sm">Initial barrier that must be breached first. Uses system security level difficulty.</div>
                    </div>

                    <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
                      <div className="font-semibold text-purple-200 mb-1">Data Nodes</div>
                      <div className="text-white/80 text-sm">Contains information or controls. Each has its own difficulty. Once hacked, stays accessible via maneuver.</div>
                    </div>

                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                      <div className="font-semibold text-red-200 mb-1">Security Programs (ICE)</div>
                      <div className="text-white/80 text-sm">Active defenses that scan, attack, or trace hackers. Deployed by sysops or triggered automatically.</div>
                    </div>

                    <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-3">
                      <div className="font-semibold text-indigo-200 mb-1">System Operator (Sysop)</div>
                      <div className="text-white/80 text-sm">Human defender who can deploy ICE, trace users, and initiate countermeasures.</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h4 className="text-cyan-300 font-semibold mb-4">Hacker Actions</h4>
                  
                  <div className="space-y-3">
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                      <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-3">
                        <div className="font-semibold text-indigo-200 mb-2">Breach (Action)</div>
                        <div className="text-white/80 text-sm">Computers vs System Security Level to gain access to system/node</div>
                      </div>
                    </div>

                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                      <div className="font-semibold text-blue-200 mb-2">Navigate (Maneuver)</div>
                      <div className="text-white/80 text-sm">Move between accessible nodes. No check needed for already-hacked nodes</div>
                    </div>

                    <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
                      <div className="font-semibold text-purple-200 mb-2">Extract Data (Action)</div>
                      <div className="text-white/80 text-sm">Computers vs node difficulty to copy/steal information</div>
                    </div>

                    <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-3">
                      <div className="font-semibold text-indigo-200 mb-2">Cover Tracks (Action)</div>
                      <div className="text-white/80 text-sm">Computers vs Trace Value. Each difficulty above 5 turns into 1 setback dice. Success: Reduce Trace by successes + 1</div>
                    </div>

                    <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-3">
                      <div className="font-semibold text-indigo-200 mb-2">Disable System (Action)</div>
                      <div className="text-white/80 text-sm">Computers vs Trace Value + System Security Level. Each difficulty above 5 turns into 1 setback dice. Success: Shut down the system</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h4 className="text-cyan-300 font-semibold mb-4">Trace System</h4>
                  
                  <div className="bg-yellow-600/20 border border-yellow-500/30 rounded-lg p-3 mb-4">
                    <div className="font-semibold text-yellow-300 mb-2">How Trace Works</div>
                    <div className="text-white/80 text-sm">
                      Trace represents how close the system is to detecting and stopping you. It increases with Threat results and triggers security responses at key thresholds.
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                      <div className="font-semibold text-green-200 mb-1">Trace 0-4: Undetected</div>
                      <div className="text-white/80 text-sm">No penalties</div>
                    </div>

                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                      <div className="font-semibold text-yellow-200 mb-1">Trace 5: Security Alerts</div>
                      <div className="text-white/80 text-sm">+1 difficulty to all hacker actions</div>
                    </div>

                    <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3">
                      <div className="font-semibold text-orange-200 mb-1">Trace 10: Active Countermeasures</div>
                      <div className="text-white/80 text-sm">First ICE program activates (if no sysop present)</div>
                    </div>

                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                      <div className="font-semibold text-red-200 mb-1">Trace 15: Location Tracking</div>
                      <div className="text-white/80 text-sm">Second ICE program activates, tracing real-world location</div>
                    </div>

                    <div className="bg-red-700/20 border border-red-600/30 rounded-lg p-3">
                      <div className="font-semibold text-red-200 mb-1">Trace 20: System Lockout</div>
                      <div className="text-white/80 text-sm">Complete lockdown, potential real-world consequences</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h4 className="text-cyan-300 font-semibold mb-4">Security Programs (ICE)</h4>
                  
                  <div className="bg-cyan-600/20 border border-cyan-500/30 rounded-lg p-3 mb-4">
                    <div className="font-semibold text-cyan-300 mb-2">ICE Skill Formula</div>
                    <div className="text-white/80 text-sm">
                      ICE Computers skill = System breach difficulty rating (e.g., dd system = Computers 2-3, ddd system = Computers 3-4)
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                      <div className="font-semibold text-blue-200 mb-2">Detection Scanner</div>
                      <div className="text-white/80 text-sm space-y-1">
                        <div><strong>Action:</strong> Computers vs hacker's Computers - success increases Trace by 2</div>
                      </div>
                    </div>

                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                      <div className="font-semibold text-blue-200 mb-2">Data Shredder</div>
                      <div className="text-white/80 text-sm space-y-1">
                        <div><strong>Action:</strong> Computers vs Difficulty 2 - success causes strain</div>
                      </div>
                    </div>

                    <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
                      <div className="font-semibold text-purple-200 mb-2">Feedback Loop</div>
                      <div className="text-white/80 text-sm space-y-1">
                        <div><strong>Action:</strong> Attack vs hacker - success causes wounds (biofeedback)</div>
                      </div>
                    </div>

                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                      <div className="font-semibold text-red-200 mb-2">Trace Daemon</div>
                      <div className="text-white/80 text-sm space-y-1">
                        <div><strong>Passive:</strong> +2 Trace whenever hacker gains Threat</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h4 className="text-cyan-300 font-semibold mb-4">Example: 3-Round Hack</h4>
                  
                  <div className="space-y-4">
                    <div className="bg-gray-800/50 border border-gray-600/30 rounded-lg p-3">
                      <div className="font-semibold text-gray-200 mb-2">Setup</div>
                      <div className="text-white/80 text-sm">
                        Maya hacks a Corporate Server (Medium Security - dd) to steal employee files. Active sysop defending. Trace starts at 0.
                      </div>
                    </div>

                    <div className="bg-blue-600/20 border border-blue-500/30 rounded-lg p-3">
                      <div className="font-semibold text-blue-300 mb-2">Round 1</div>
                      <div className="text-white/80 text-sm space-y-1">
                        <div><strong>Maya:</strong> Breach Firewall - Computers vs dd</div>
                        <div><strong>Roll:</strong> 2 Success, 1 Threat</div>
                        <div><strong>Result:</strong> Through firewall! Trace = 1</div>
                        <div><strong>Sysop:</strong> Deploys Detection Scanner</div>
                      </div>
                    </div>

                    <div className="bg-purple-600/20 border border-purple-500/30 rounded-lg p-3">
                      <div className="font-semibold text-purple-300 mb-2">Round 2</div>
                      <div className="text-white/80 text-sm space-y-1">
                        <div><strong>Scanner ICE:</strong> Computers vs Maya's Computers</div>
                        <div><strong>Roll:</strong> 1 Success → Trace = 3</div>
                        <div><strong>Maya:</strong> Access Employee Database - Computers vs dd</div>
                        <div><strong>Roll:</strong> 1 Success, 2 Advantage</div>
                        <div><strong>Result:</strong> Data accessed! Trace reduced to 1</div>
                      </div>
                    </div>

                    <div className="bg-green-600/20 border border-green-500/30 rounded-lg p-3">
                      <div className="font-semibold text-green-300 mb-2">Round 3</div>
                      <div className="text-white/80 text-sm space-y-1">
                        <div><strong>Scanner ICE:</strong> 2 Success, 2 Advantage → Trace = 5</div>
                        <div><strong>Trigger:</strong> Security alerts! +1 difficulty</div>
                        <div><strong>Maya:</strong> Extract data - Computers vs ddd (harder)</div>
                        <div><strong>Roll:</strong> 1 Success → Got the files!</div>
                        <div><strong>Maya:</strong> Jacks out safely with stolen data</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-4">
                  <h5 className="font-semibold text-yellow-300 mb-3">Quick Reference Q&A</h5>
                  <div className="space-y-3 text-sm">
                    <div>
                      <div className="font-semibold text-yellow-200 mb-1">Q: When do ICE programs activate?</div>
                      <div className="text-white/80 text-xs"><strong>A:</strong> Immediately if active sysop present. At Trace 10+ if no sysop.</div>
                    </div>

                    <div>
                      <div className="font-semibold text-yellow-200 mb-1">Q: Do nodes stay hacked once accessed?</div>
                      <div className="text-white/80 text-xs"><strong>A:</strong> Yes! Once hacked, you can return with just a maneuver (no roll).</div>
                    </div>

                    <div>
                      <div className="font-semibold text-yellow-200 mb-1">Q: How do Advantage/Threat work?</div>
                      <div className="text-white/80 text-xs"><strong>A:</strong> Hacker Advantage reduces Trace, Threat increases it. ICE/Sysop Advantage can increase Trace or add effects.</div>
                    </div>

                    <div>
                      <div className="font-semibold text-yellow-200 mb-1">Q: What do I need to design a system?</div>
                      <div className="text-white/80 text-xs"><strong>A:</strong> Firewall difficulty, what nodes exist, each node's difficulty, and what data/controls are in each node.</div>
                    </div>

                    <div>
                      <div className="font-semibold text-yellow-200 mb-1">Q: How many ICE programs can be deployed at once?</div>
                      <div className="text-white/80 text-xs"><strong>A:</strong> One per System Breach Difficulty (e.g., dd system = 2, ddd system = 3)</div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* Diseases */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 shadow-xl overflow-hidden">
          <div 
            className="p-3 lg:p-4 border-b border-white/10 bg-gradient-to-r from-lime-600/20 to-green-600/20 cursor-pointer hover:bg-gradient-to-r hover:from-lime-600/30 hover:to-green-600/30 transition-all duration-300"
            onClick={() => toggleSection('diseases')}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-lg lg:text-xl">🦠</span>
                <span className="text-white font-semibold text-base lg:text-lg">Diseases</span>
                <span className="text-xs bg-lime-500/30 text-lime-300 px-2 py-1 rounded ml-2">
                  Afflictions
                </span>
              </div>
              
              <div className={`transform transition-transform duration-300 ${expandedSections.diseases ? 'rotate-180' : 'rotate-0'}`}>
                <svg className="w-4 h-4 lg:w-5 lg:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <div className={`transition-all duration-500 ease-in-out overflow-auto ${
            expandedSections.diseases 
              ? 'max-h-[800px] opacity-100'
              : 'max-h-0 opacity-0'
          }`}>
            <div className="p-3 lg:p-4 space-y-4">
              <div className="text-white space-y-3">
                
                <div className="bg-lime-500/10 border border-lime-500/30 rounded-lg p-3">
                  <div className="font-semibold text-lime-300 mb-2">🦠 Sickness and Infection in the Endless Maze</div>
                  <div className="text-white/90 text-sm">
                    The Backrooms harbor deadly diseases that can spread through environmental contact, entity encounters, or poor self-care. Each disease progresses through distinct stages with unique mechanical effects.
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h4 className="text-lime-300 font-semibold mb-4">Entity 19 - "The Disease"</h4>
                  
                  <div className="space-y-4">
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                      <div className="font-semibold text-red-200 mb-2">Transmission</div>
                      <div className="text-white/80 text-sm space-y-1">
                        <div><strong>Source:</strong> Contact with moist/damp environments - rotten wallpaper, moss, stagnant water, decaying corpses</div>
                        <div><strong>Contagion:</strong> Not contagious between people - only from environmental sources</div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                        <div className="font-semibold text-yellow-200 mb-1">Stage 1 (5-24 hours)</div>
                        <div className="text-white/80 text-sm">
                          Hives on arms/chest/thighs, eye irritation, severe stomach pain<br/>
                          <strong>Effect:</strong> Gain <strong>Sickened</strong> status, sanity loss doubled from all sources
                        </div>
                      </div>

                      <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3">
                        <div className="font-semibold text-orange-200 mb-1">Stage 2 (24-72 hours)</div>
                        <div className="text-white/80 text-sm">
                          Hives spread everywhere and harden, unbearable itching<br/>
                          <strong>Effect:</strong> Gain <strong>Disoriented</strong> status, suffer 1 strain per hour from constant scratching
                        </div>
                      </div>

                      <div className="bg-red-600/20 border border-red-600/30 rounded-lg p-3">
                        <div className="font-semibold text-red-200 mb-1">Stage 3 (72+ hours)</div>
                        <div className="text-white/80 text-sm">
                          Death if untreated<br/>
                          <strong>Effect:</strong> <strong>Incapacitated</strong>, automatic death in 24 hours
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h4 className="text-lime-300 font-semibold mb-4">The Wretched Cycle</h4>
                  
                  <div className="space-y-4">
                    <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
                      <div className="font-semibold text-purple-200 mb-2">Transmission</div>
                      <div className="text-white/80 text-sm space-y-1">
                        <div><strong>Source:</strong> 1 full week without food OR water OR sleep, accelerated by isolation (halves time if alone)</div>
                        <div><strong>Contagion:</strong> Not contagious - individual condition from poor self-care</div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                        <div className="font-semibold text-yellow-200 mb-1">Stage 1 (1-2 weeks)</div>
                        <div className="text-white/80 text-sm">
                          Itchiness like poison ivy, erratic behavior<br/>
                          <strong>Effect:</strong> Gain <strong>Confused</strong> status (lasts 1 round per day at random time), +1 Setback to social checks
                        </div>
                      </div>

                      <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3">
                        <div className="font-semibold text-orange-200 mb-1">Stage 2 (2-5 weeks)</div>
                        <div className="text-white/80 text-sm">
                          Skin/muscle dissolving, pustules, hair loss<br/>
                          <strong>Effect:</strong> Gain <strong>Frightened</strong> status (of your own reflection), suffer 1 wound per week, all healing halved
                        </div>
                      </div>

                      <div className="bg-red-600/20 border border-red-600/30 rounded-lg p-3">
                        <div className="font-semibold text-red-200 mb-1">Stage 3 (5-6 weeks)</div>
                        <div className="text-white/80 text-sm">
                          Complete transformation preparation<br/>
                          <strong>Effect:</strong> Gain <strong>Stunned 3</strong> status permanently, <strong>Blinded</strong> status (eyes constantly rolling), become NPC if not cured
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h4 className="text-lime-300 font-semibold mb-4">Sanguine Festivus Virus (SFV)</h4>
                  
                  <div className="space-y-4">
                    <div className="bg-pink-500/10 border border-pink-500/20 rounded-lg p-3">
                      <div className="font-semibold text-pink-200 mb-2">Transmission</div>
                      <div className="text-white/80 text-sm space-y-1">
                        <div><strong>Source:</strong> Exposure to Level Fun or contact with infected Partygoers</div>
                        <div><strong>Contagion:</strong> Highly contagious through bites, scratches, or prolonged contact with infected</div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                        <div className="font-semibold text-yellow-200 mb-1">Stage 1 (2-6 hours)</div>
                        <div className="text-white/80 text-sm">
                          Mild soreness, tiredness<br/>
                          <strong>Effect:</strong> All maneuvers cost +1 additional strain
                        </div>
                      </div>

                      <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3">
                        <div className="font-semibold text-orange-200 mb-1">Stage 2 (6 hours-3 days)</div>
                        <div className="text-white/80 text-sm">
                          Decreased energy, growing hunger<br/>
                          <strong>Effect:</strong> All strain costs increased by +2, gain <strong>Sickened</strong> status
                        </div>
                      </div>

                      <div className="bg-red-600/20 border border-red-600/30 rounded-lg p-3">
                        <div className="font-semibold text-red-200 mb-1">Stage 3 (3+ days until cured)</div>
                        <div className="text-white/80 text-sm">
                          Violent urges, cannibalistic hunger<br/>
                          <strong>Effect:</strong> Gain <strong>Confused</strong> and <strong>Frightened</strong> (of non-infected people) status effects permanently
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h4 className="text-lime-300 font-semibold mb-4">Hydrolitis Plague</h4>
                  
                  <div className="space-y-4">
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                      <div className="font-semibold text-blue-200 mb-2">Transmission</div>
                      <div className="text-white/80 text-sm space-y-1">
                        <div><strong>Source:</strong> Contact with untreated water or direct skin contact with contaminated sources</div>
                        <div><strong>Contagion:</strong> Moderately contagious through skin-to-skin contact</div>
                      </div>
                    </div>

                    <div className="bg-cyan-600/20 border border-cyan-500/30 rounded-lg p-3">
                      <div className="font-semibold text-cyan-300 mb-2">Type Determination</div>
                      <div className="text-white/80 text-sm space-y-1">
                        <div><strong>Pulmonary Type:</strong> Inhaling contaminated water vapor, mist, or droplets</div>
                        <div><strong>Septicemic Type:</strong> Direct skin contact with contaminated water or through open wounds</div>
                        <div><em>Note: Character develops ONE type, not both</em></div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h5 className="font-semibold text-blue-200 mb-3">Pulmonary Type (Respiratory)</h5>
                        <div className="space-y-3">
                          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                            <div className="font-semibold text-yellow-200 mb-1">Stage 1 (3-5 days)</div>
                            <div className="text-white/80 text-sm">
                              Intense coughing, breathing difficulties<br/>
                              <strong>Effect:</strong> All strain costs doubled, +2 Setback to Athletics/Coordination
                            </div>
                          </div>

                          <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3">
                            <div className="font-semibold text-orange-200 mb-1">Stage 2 (5-8 days)</div>
                            <div className="text-white/80 text-sm">
                              Hemoptysis (coughing blood), severe lung damage<br/>
                              <strong>Effect:</strong> Gain <strong>Stunned 2</strong> status, suffer 1 wound per day
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h5 className="font-semibold text-red-200 mb-3">Septicemic Type (Bloodstream)</h5>
                        <div className="space-y-3">
                          <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3">
                            <div className="font-semibold text-orange-200 mb-1">Stage 1 (6-18 hours)</div>
                            <div className="text-white/80 text-sm">
                              High fever (40°C+), chills, shock<br/>
                              <strong>Effect:</strong> Exhaustion gained in half the time, gain <strong>Disoriented</strong> status
                            </div>
                          </div>

                          <div className="bg-red-600/20 border border-red-600/30 rounded-lg p-3">
                            <div className="font-semibold text-red-200 mb-1">Stage 2 (18-24 hours)</div>
                            <div className="text-white/80 text-sm">
                              Organ failure, extremely high mortality<br/>
                              <strong>Effect:</strong> Gain <strong>Incapacitated</strong> status, suffer 2 wounds per hour
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h4 className="text-lime-300 font-semibold mb-4">Mandela Virus (PV-A)</h4>
                  
                  <div className="space-y-4">
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                      <div className="font-semibold text-red-200 mb-2">Transmission</div>
                      <div className="text-white/80 text-sm space-y-1">
                        <div><strong>Source:</strong> Skin contact with infected substances, liquids, or splashing</div>
                        <div><strong>Contagion:</strong> Highly contagious through any bodily fluid contact</div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                        <div className="font-semibold text-green-200 mb-1">Stage 1 (20-60 minutes)</div>
                        <div className="text-white/80 text-sm">
                          Tiredness, difficulty sleeping<br/>
                          <strong>Effect:</strong> Cannot benefit from any rest (Short, Full, or Extended)
                        </div>
                      </div>

                      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                        <div className="font-semibold text-yellow-200 mb-1">Stage 2 (1-3 hours)</div>
                        <div className="text-white/80 text-sm">
                          Headaches, energy loss<br/>
                          <strong>Effect:</strong> All mental checks (Intellect/Cunning/Willpower) gain +2 Setback dice
                        </div>
                      </div>

                      <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3">
                        <div className="font-semibold text-orange-200 mb-1">Stage 3 (3-5 hours)</div>
                        <div className="text-white/80 text-sm">
                          Blood in urine, immune system fighting<br/>
                          <strong>Effect:</strong> Gain <strong>Poisoned</strong> status, suffer 1 strain per hour
                        </div>
                      </div>

                      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                        <div className="font-semibold text-red-200 mb-1">Stage 4 (5-7 hours)</div>
                        <div className="text-white/80 text-sm">
                          Severe headaches, vomiting, appetite loss<br/>
                          <strong>Effect:</strong> Gain <strong>Stunned 4</strong> status, cannot consume food/water, suffer 1 wound per hour
                        </div>
                      </div>

                      <div className="bg-red-700/30 border border-red-600/40 rounded-lg p-3">
                        <div className="font-semibold text-red-200 mb-1">Stage 5 (7-17 hours)</div>
                        <div className="text-white/80 text-sm">
                          Hypothermia, organ failure<br/>
                          <strong>Effect:</strong> Gain <strong>Incapacitated</strong> status, suffer 2 wounds per hour, automatic death in 6 hours
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-green-600/10 border border-green-500/30 rounded-lg p-4">
                  <h5 className="font-semibold text-green-300 mb-3">Disease Mechanics</h5>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 text-sm">
                    <div>
                      <div className="font-semibold text-green-200 mb-1">Progression</div>
                      <div className="text-white/80 text-xs">Diseases advance through stages automatically unless treated or cured</div>
                    </div>

                    <div>
                      <div className="font-semibold text-green-200 mb-1">Status Effects</div>
                      <div className="text-white/80 text-xs">Diseases apply existing status effects from the Status Effects section</div>
                    </div>

                    <div>
                      <div className="font-semibold text-green-200 mb-1">Multiple Diseases</div>
                      <div className="text-white/80 text-xs">Characters can suffer from multiple diseases simultaneously</div>
                    </div>

                    <div>
                      <div className="font-semibold text-green-200 mb-1">Environmental Integration</div>
                      <div className="text-white/80 text-xs">Diseases interact with exhaustion, temperature, and rest systems</div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* Character Creation */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 shadow-xl overflow-hidden">
          <div 
            className="p-3 lg:p-4 border-b border-white/10 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 cursor-pointer hover:bg-gradient-to-r hover:from-cyan-600/30 hover:to-blue-600/30 transition-all duration-300"
            onClick={() => toggleSection('character')}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-lg lg:text-xl">👤</span>
                <span className="text-white font-semibold text-base lg:text-lg">Character Creation</span>
                <span className="text-xs bg-cyan-500/30 text-cyan-300 px-2 py-1 rounded ml-2">
                  Build System
                </span>
              </div>
              
              <div className={`transform transition-transform duration-300 ${expandedSections.character ? 'rotate-180' : 'rotate-0'}`}>
                <svg className="w-4 h-4 lg:w-5 lg:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <div className={`transition-all duration-500 ease-in-out overflow-auto ${
            expandedSections.character 
              ? 'max-h-[800px] opacity-100'
              : 'max-h-0 opacity-0'
          }`}>
            <div className="p-3 lg:p-4 space-y-4">
              <div className="text-white space-y-3">
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h4 className="text-cyan-300 font-semibold mb-3">Step 1: Character Concept</h4>
                  <p className="text-white/90 mb-2">Define your character's basic concept and role in the world. This guides all other choices.</p>
                  <ul className="text-white/70 text-sm space-y-1 ml-4">
                    <li>• What is your character's profession or background?</li>
                    <li>• What motivates them to explore the Backrooms?</li>
                    <li>• What makes them unique or interesting?</li>
                  </ul>
                </div>

                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h4 className="text-cyan-300 font-semibold mb-3">Step 2: Choose Archetype</h4>
                  <p className="text-white/90 mb-3">Select one of the four human archetypes, or go custom for maximum flexibility.</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm mb-4">
                    <div className="bg-white/5 p-3 rounded border border-white/10">
                      <div className="font-semibold text-cyan-200 mb-1">Average Human</div>
                      <div className="text-white/70 text-xs mb-2">Balanced stats: Brawn 2, Agility 2, Intellect 2, Cunning 2, Willpower 2, Presence 2</div>
                      <div className="text-white/80 text-xs"><strong>Ready For Anything:</strong> Once per session, take a Story Point from GM pool</div>
                    </div>
                    
                    <div className="bg-white/5 p-3 rounded border border-white/10">
                      <div className="font-semibold text-cyan-200 mb-1">Laborer</div>
                      <div className="text-white/70 text-xs mb-2">Physical focus: Brawn 3, others at 2</div>
                      <div className="text-white/80 text-xs"><strong>Tough As Nails:</strong> Once per session, reduce critical injury to weakest result</div>
                    </div>
                    
                    <div className="bg-white/5 p-3 rounded border border-white/10">
                      <div className="font-semibold text-cyan-200 mb-1">Intellectual</div>
                      <div className="text-white/70 text-xs mb-2">Mental focus: Intellect 3, others at 2</div>
                      <div className="text-white/80 text-xs"><strong>Educated:</strong> Gain additional knowledge and mental capabilities</div>
                    </div>
                    
                    <div className="bg-white/5 p-3 rounded border border-white/10">
                      <div className="font-semibold text-cyan-200 mb-1">Aristocrat</div>
                      <div className="text-white/70 text-xs mb-2">Social focus: Presence 3, others at 2</div>
                      <div className="text-white/80 text-xs"><strong>Wealthy:</strong> Start with additional resources and connections</div>
                    </div>
                  </div>

                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                    <div className="font-semibold text-yellow-300 mb-2">Alternative: Custom Archetype</div>
                    <div className="text-white/90 text-sm mb-2">Instead of choosing a preset archetype, you can create a custom character:</div>
                    <ul className="text-white/80 text-sm space-y-1 ml-4">
                      <li>• Start with all characteristics at 1</li>
                      <li>• No special archetype ability</li>
                      <li>• Begin with 230 XP instead of 110 XP</li>
                      <li>• Can purchase up to 2 custom abilities for 5 XP each</li>
                    </ul>
                    <div className="text-yellow-200 text-xs mt-2 italic">This option allows for complete customization but requires more planning</div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h4 className="text-cyan-300 font-semibold mb-3">Step 3: Select Career</h4>
                  <p className="text-white/90 mb-3">Your career defines your role and provides career skills (cheaper to advance). Choose four career skills to gain one rank each.</p>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 text-sm mb-4">
                    <div className="space-y-2">
                      <div className="font-semibold text-cyan-200">Explorer</div>
                      <div className="text-white/70 text-xs">Survival, Athletics, Perception, Vigilance, Knowledge, Cool, Coordination, Medicine</div>
                    </div>
                    <div className="space-y-2">
                      <div className="font-semibold text-cyan-200">Researcher</div>
                      <div className="text-white/70 text-xs">Knowledge, Computers, Medicine, Perception, Education, Cool, Vigilance, Investigation</div>
                    </div>
                    <div className="space-y-2">
                      <div className="font-semibold text-cyan-200">Survivor</div>
                      <div className="text-white/70 text-xs">Survival, Athletics, Vigilance, Cool, Stealth, Streetwise, Brawl, Ranged</div>
                    </div>
                    <div className="space-y-2">
                      <div className="font-semibold text-cyan-200">Technician</div>
                      <div className="text-white/70 text-xs">Computers, Mechanics, Knowledge, Perception, Cool, Investigation, Medicine, Education</div>
                    </div>
                  </div>

                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                    <div className="font-semibold text-yellow-300 mb-2">Alternative: Custom Career</div>
                    <div className="text-white/90 text-sm mb-2">Instead of choosing a preset career, you can create a custom skill set:</div>
                    <ul className="text-white/80 text-sm space-y-1 ml-4">
                      <li>• Choose any 8 skills as your career skills</li>
                      <li>• Either gain 2 ranks in 2 different skills</li>
                      <li>• Or gain 1 rank in 4 different skills</li>
                    </ul>
                    <div className="text-yellow-200 text-xs mt-2 italic">This allows you to build exactly the character concept you want</div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h4 className="text-cyan-300 font-semibold mb-3">Step 4: Characteristics & Experience</h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-white/90 mb-2">Starting Experience: 110 XP (spend during character creation)</p>
                      <p className="text-white/80 text-sm mb-2"><strong>Important:</strong> Characteristics can only be increased during character creation!</p>
                    </div>
                    
                    <div className="text-sm">
                      <div className="font-semibold text-cyan-200 mb-2">Characteristic Costs:</div>
                      <div className="text-white/70 space-y-1">
                        <div>• Rank 1→2: 20 XP • Rank 2→3: 30 XP • Rank 3→4: 40 XP • Rank 4→5: 50 XP</div>
                      </div>
                    </div>
                    
                    <div className="text-sm">
                      <div className="font-semibold text-cyan-200 mb-2">Skill Costs:</div>
                      <div className="text-white/70 space-y-1">
                        <div>• Career Skills: 5×new rank XP</div>
                        <div>• Non-Career Skills: 5×new rank +5 XP</div>
                      </div>
                    </div>

                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                      <div className="font-semibold text-red-300 mb-2">Skills may have a maximum of 2 ranks during character creation</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h4 className="text-cyan-300 font-semibold mb-3">Step 5: Derived Attributes</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="space-y-2">
                      <div><span className="text-cyan-200 font-semibold">Wound Threshold:</span> <span className="text-white/80">10 + Brawn</span></div>
                      <div><span className="text-cyan-200 font-semibold">Strain Threshold:</span> <span className="text-white/80">10 + Willpower</span></div>
                      <div><span className="text-cyan-200 font-semibold">Defense:</span> <span className="text-white/80">0 (modified by armor)</span></div>
                    </div>
                    <div className="space-y-2">
                      <div><span className="text-cyan-200 font-semibold">Soak:</span> <span className="text-white/80">Brawn value</span></div>
                      <div><span className="text-cyan-200 font-semibold">Encumbrance:</span> <span className="text-white/80">5 + Brawn</span></div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h4 className="text-cyan-300 font-semibold mb-3">Step 6: Motivations</h4>
                  <p className="text-white/90 mb-3">Define your character's four-part motivation system:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <div className="font-semibold text-cyan-200 mb-1">Desire</div>
                      <div className="text-white/70">What drives your character forward</div>
                    </div>
                    <div>
                      <div className="font-semibold text-cyan-200 mb-1">Fear</div>
                      <div className="text-white/70">What terrifies or concerns them</div>
                    </div>
                    <div>
                      <div className="font-semibold text-cyan-200 mb-1">Strength</div>
                      <div className="text-white/70">Their greatest positive trait</div>
                    </div>
                    <div>
                      <div className="font-semibold text-cyan-200 mb-1">Flaw</div>
                      <div className="text-white/70">Their greatest weakness or vice</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h4 className="text-cyan-300 font-semibold mb-3">Step 7: Final Details</h4>
                  <div className="space-y-2 text-sm">
                    <p className="text-white/90">Choose starting equipment</p>
                    <p className="text-white/80">• A Flashlight, 2x AA Battery, 5x Water, and 5x Rations</p>
                    <p className="text-white/80">• A Lantern, 1x C Battery, 5x Water, and 5x Rations</p>
                    <p className="text-white/80">• A Tool, 10x Rations, and 10x Water</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Custom Content */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 shadow-xl overflow-hidden">
          <div 
            className="p-3 lg:p-4 border-b border-white/10 bg-gradient-to-r from-pink-600/20 to-rose-600/20 cursor-pointer hover:bg-gradient-to-r hover:from-pink-600/30 hover:to-rose-600/30 transition-all duration-300"
            onClick={() => toggleSection('custom')}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-lg lg:text-xl">🎨</span>
                <span className="text-white font-semibold text-base lg:text-lg">Custom Content</span>
                <span className="text-xs bg-pink-500/30 text-pink-300 px-2 py-1 rounded ml-2">
                  Homebrew
                </span>
              </div>

              <div className={`transform transition-transform duration-300 ${expandedSections.custom ? 'rotate-180' : 'rotate-0'}`}>
                <svg className="w-4 h-4 lg:w-5 lg:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <div className={`transition-all duration-500 ease-in-out overflow-auto ${
            expandedSections.custom 
              ? 'max-h-[800px] opacity-100'
              : 'max-h-0 opacity-0'
          }`}>
            <div className="p-3 lg:p-4 space-y-4">
              <div className="text-white space-y-3">

                <div className="bg-pink-500/10 border border-pink-500/30 rounded-lg p-3">
                  <div className="font-semibold text-pink-300 mb-2">🎨 Custom Rules & Content</div>
                  <div className="text-white/90 text-sm">
                    House rules, custom skills, talents, and equipment modifications for enhanced gameplay.
                  </div>
                </div>
        
                {/* Custom Skills */}
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h4 className="text-pink-300 font-semibold mb-4">Custom Skills</h4>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
                      <div className="font-semibold text-purple-200 mb-1 text-sm flex items-center">
                        <span className="bg-red-500/20 text-red-300 px-2 py-0.5 rounded text-xs font-bold mr-2">WIL</span>
                        Sanity
                      </div>
                      <div className="text-white/80 text-xs">Used to prevent yourself from going insane</div>
                    </div>
        
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                      <div className="font-semibold text-blue-200 mb-1 text-sm flex items-center">
                        <span className="bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded text-xs font-bold mr-2">INT</span>
                        Knowledge [General]
                      </div>
                      <div className="text-white/80 text-xs">Non-specific knowledge on a subject</div>
                    </div>
        
                    <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-3">
                      <div className="font-semibold text-cyan-200 mb-1 text-sm flex items-center">
                        <span className="bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded text-xs font-bold mr-2">INT</span>
                        Knowledge [Mechanics]
                      </div>
                      <div className="text-white/80 text-xs">How machinery or technology operates</div>
                    </div>
        
                    <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-3">
                      <div className="font-semibold text-indigo-200 mb-1 text-sm flex items-center">
                        <span className="bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded text-xs font-bold mr-2">INT</span>
                        Knowledge [Lore]
                      </div>
                      <div className="text-white/80 text-xs">Backrooms origins, levels, and entities</div>
                    </div>
        
                    <div className="bg-teal-500/10 border border-teal-500/20 rounded-lg p-3">
                      <div className="font-semibold text-teal-200 mb-1 text-sm flex items-center">
                        <span className="bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded text-xs font-bold mr-2">INT</span>
                        Knowledge [Objects]
                      </div>
                      <div className="text-white/80 text-xs">How objects work or should be used</div>
                    </div>
        
                    <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3">
                      <div className="font-semibold text-orange-200 mb-1 text-sm flex items-center">
                        <span className="bg-orange-500/20 text-orange-300 px-2 py-0.5 rounded text-xs font-bold mr-2">BR</span>
                        Metalworking
                      </div>
                      <div className="text-white/80 text-xs">Armorer, Blacksmith, Goldsmith tools</div>
                    </div>
        
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                      <div className="font-semibold text-green-200 mb-1 text-sm flex items-center">
                        <span className="bg-green-500/20 text-green-300 px-2 py-0.5 rounded text-xs font-bold mr-2">AG</span>
                        Leatherworking
                      </div>
                      <div className="text-white/80 text-xs">Leatherworker and Weaver tools</div>
                    </div>
        
                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                      <div className="font-semibold text-yellow-200 mb-1 text-sm flex items-center">
                        <span className="bg-yellow-500/20 text-yellow-300 px-2 py-0.5 rounded text-xs font-bold mr-2">INT</span>
                        Crafting
                      </div>
                      <div className="text-white/80 text-xs">Alchemist, Carpenter, Culinarian tools</div>
                    </div>
                  </div>
                </div>
        
                {/* Custom Talents */}
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h4 className="text-pink-300 font-semibold mb-4">Custom Talents</h4>

                  <div className="space-y-4">
                    {/* Tier 1-2 Talents */}
                    <div>
                      <h5 className="font-semibold text-pink-200 mb-3">Tier 1-2 Talents</h5>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                          <div className="font-semibold text-green-200 mb-1 text-sm flex items-center justify-between">
                            <span>Healer</span>
                            <div className="flex space-x-1">
                              <span className="bg-green-500/30 text-green-300 px-1 py-0.5 rounded text-xs">Action</span>
                              <span className="bg-blue-500/30 text-blue-300 px-1 py-0.5 rounded text-xs">Ranked</span>
                            </div>
                          </div>
                          <div className="text-white/80 text-xs">Perform medicine check equal to ranks per day</div>
                        </div>
        
                        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                          <div className="font-semibold text-yellow-200 mb-1 text-sm flex items-center justify-between">
                            <span>Lightning Striker</span>
                            <span className="bg-gray-500/30 text-gray-300 px-1 py-0.5 rounded text-xs">Passive</span>
                          </div>
                          <div className="text-white/80 text-xs">Brawl weapons gain reactive trait</div>
                        </div>
        
                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                          <div className="font-semibold text-blue-200 mb-1 text-sm flex items-center justify-between">
                            <span>Bulked Load</span>
                            <div className="flex space-x-1">
                              <span className="bg-gray-500/30 text-gray-300 px-1 py-0.5 rounded text-xs">Passive</span>
                              <span className="bg-blue-500/30 text-blue-300 px-1 py-0.5 rounded text-xs">Ranked</span>
                            </div>
                          </div>
                          <div className="text-white/80 text-xs">Encumbrance threshold +1</div>
                        </div>
                      </div>
                    </div>
        
                    {/* Tier 3-4 Talents */}
                    <div>
                      <h5 className="font-semibold text-pink-200 mb-3">Tier 3-4 Talents</h5>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                        <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-3">
                          <div className="font-semibold text-indigo-200 mb-1 text-sm flex items-center justify-between">
                            <span>Adjust Eyes (Dark)</span>
                            <span className="bg-indigo-500/30 text-indigo-300 px-1 py-0.5 rounded text-xs">Action</span>
                          </div>
                          <div className="text-white/80 text-xs">Ignore darkness penalties for 5 rounds</div>
                        </div>
        
                        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                          <div className="font-semibold text-yellow-200 mb-1 text-sm flex items-center justify-between">
                            <span>Adjust Eyes (Light)</span>
                            <span className="bg-yellow-500/30 text-yellow-300 px-1 py-0.5 rounded text-xs">Action</span>
                          </div>
                          <div className="text-white/80 text-xs">Ignore light penalties for 5 rounds</div>
                        </div>
        
                        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                          <div className="font-semibold text-red-200 mb-1 text-sm flex items-center justify-between">
                            <span>Savage Attacker</span>
                            <span className="bg-red-500/30 text-red-300 px-1 py-0.5 rounded text-xs">Incidental</span>
                          </div>
                          <div className="text-white/80 text-xs">Choose critical injury result (2 strain)</div>
                        </div>
                      </div>
                    </div>
        
                    {/* Tier 5 Talents */}
                    <div>
                      <h5 className="font-semibold text-pink-200 mb-3">Tier 5 Talents</h5>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                        <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
                          <div className="font-semibold text-purple-200 mb-1 text-sm flex items-center justify-between">
                            <span>Unshakable Will</span>
                            <span className="bg-gray-500/30 text-gray-300 px-1 py-0.5 rounded text-xs">Passive</span>
                          </div>
                          <div className="text-white/80 text-xs">5 points to reduce strain, refresh per turn</div>
                        </div>
        
                        <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3">
                          <div className="font-semibold text-orange-200 mb-1 text-sm">
                            <span>Unwavering Resilience</span>
                            <span className="bg-gray-500/30 text-gray-300 px-1 py-0.5 rounded text-xs ml-2">Passive</span>
                          </div>
                          <div className="text-white/80 text-xs">
                            <div><em className="text-orange-300">Req: Toughened 4</em></div>
                            <div>Wound threshold +10</div>
                          </div>
                        </div>
        
                        <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-3">
                          <div className="font-semibold text-cyan-200 mb-1 text-sm">
                            <span>Unbreakable Fortitude</span>
                            <span className="bg-gray-500/30 text-gray-300 px-1 py-0.5 rounded text-xs ml-2">Passive</span>
                          </div>
                          <div className="text-white/80 text-xs">
                            <div><em className="text-cyan-300">Req: Grit 4</em></div>
                            <div>Strain threshold +5</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
        
                {/* Custom Equipment Traits */}
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h4 className="text-pink-300 font-semibold mb-4">Custom Equipment Traits</h4>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                      <div className="font-semibold text-red-200 mb-1 text-sm flex items-center">
                        Reactive
                      </div>
                      <div className="text-white/80 text-xs">Out-of-turn attack when enemy leaves engaged range</div>
                    </div>
        
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                      <div className="font-semibold text-blue-200 mb-1 text-sm flex items-center">
                        Reach
                      </div>
                      <div className="text-white/80 text-xs">Use weapon one range band further</div>
                    </div>
        
                    <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3">
                      <div className="font-semibold text-orange-200 mb-1 text-sm flex items-center">
                        Breaking
                      </div>
                      <div className="text-white/80 text-xs">Durability -1 each use</div>
                    </div>
        
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                      <div className="font-semibold text-green-200 mb-1 text-sm flex items-center">
                        Flurry
                      </div>
                      <div className="text-white/80 text-xs">Spend advantage for additional hits (x times)</div>
                    </div>
        
                    <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
                      <div className="font-semibold text-purple-200 mb-1 text-sm flex items-center">
                        Sneak
                      </div>
                      <div className="text-white/80 text-xs">First attack adds 2 successes automatically</div>
                    </div>

                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                      <div className="font-semibold text-red-200 mb-1 text-sm flex items-center">
                        Lethal
                      </div>
                      <div className="text-white/80 text-xs">If the weapon would incapacitate, it kills instead</div>
                    </div>
                  </div>
                </div>
        
              </div>
            </div>
          </div>
        </div>

        {/* Equipment Creation */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 shadow-xl overflow-hidden">
          <div 
            className="p-3 lg:p-4 border-b border-white/10 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 cursor-pointer hover:bg-gradient-to-r hover:from-indigo-600/30 hover:to-purple-600/30 transition-all duration-300"
            onClick={() => toggleSection('equipment')}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-lg lg:text-xl">⚒️</span>
                <span className="text-white font-semibold text-base lg:text-lg">Equipment Creation</span>
                <span className="text-xs bg-indigo-500/30 text-indigo-300 px-2 py-1 rounded ml-2">
                  Design System
                </span>
              </div>

              <div className={`transform transition-transform duration-300 ${expandedSections.equipment ? 'rotate-180' : 'rotate-0'}`}>
                <svg className="w-4 h-4 lg:w-5 lg:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <div className={`transition-all duration-500 ease-in-out overflow-auto ${
            expandedSections.equipment 
              ? 'max-h-[800px] opacity-100'
              : 'max-h-0 opacity-0'
          }`}>
            <div className="p-3 lg:p-4 space-y-4">
              <div className="text-white space-y-3">

                <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-lg p-3">
                  <div className="font-semibold text-indigo-300 mb-2">⚒️ Custom Equipment Design</div>
                  <div className="text-white/90 text-sm">
                    Guidelines for creating balanced custom armor, weapons, and attachment systems for your campaign.
                  </div>
                </div>
        
                {/* Armor Creation */}
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h4 className="text-indigo-300 font-semibold mb-4">Armor Design</h4>

                  <div className="space-y-4">
                    <div>
                      <h5 className="font-semibold text-indigo-200 mb-3">Core Attributes</h5>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                          <div className="font-semibold text-blue-200 mb-1">Soak Value</div>
                          <div className="text-white/80 text-sm space-y-1">
                            <div>• Range: 0-3 (3 is rare and expensive)</div>
                            <div>• Most important armor attribute</div>
                            <div>• Reliably reduces damage from all hits</div>
                            <div>• High soak should come with drawbacks</div>
                          </div>
                        </div>
        
                        <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
                          <div className="font-semibold text-purple-200 mb-1">Defense Value</div>
                          <div className="text-white/80 text-sm space-y-1">
                            <div>• Adds setback dice directly to attacker's dice pool</div>
                            <div>• More valuable than soak (prevents hits entirely)</div>
                            <div>• Keep values low to control dice pool size</div>
                          </div>
                        </div>
        
                        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                          <div className="font-semibold text-green-200 mb-1">Encumbrance</div>
                          <div className="text-white/80 text-sm space-y-1">
                            <div>• Range: 2-5 (5 for heavy armor only)</div>
                            <div>• Reduces by 3 when worn vs. carried</div>
                            <div>• Higher encumbrance for higher soak</div>
                          </div>
                        </div>
                      </div>
                    </div>
        
                    <div>
                      <h5 className="font-semibold text-indigo-200 mb-3">Armor Cost Calculation</h5>
                      <div className="w-1/2 bg-gray-800/50 border border-gray-600/30 rounded-lg p-3 overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-gray-600/30">
                              <th className="text-left text-gray-200 pb-2">Attribute</th>
                              <th className="text-right text-gray-200 pb-2">Cost</th>
                            </tr>
                          </thead>
                          <tbody className="text-white/80 space-y-1">
                            <tr><td>+1 Defense</td><td className="text-right">50</td></tr>
                            <tr><td>+2 Defense</td><td className="text-right">500</td></tr>
                            <tr><td>+3 Defense</td><td className="text-right">2,000</td></tr>
                            <tr><td>+4 Defense</td><td className="text-right">5,000</td></tr>
                            <tr><td>+1 Soak</td><td className="text-right">50</td></tr>
                            <tr><td>+2 Soak</td><td className="text-right">500</td></tr>
                            <tr><td>+3 Soak</td><td className="text-right">1,000</td></tr>
                            <tr><td>+4 Soak</td><td className="text-right">2,500</td></tr>
                            <tr><td>-1 Encumbrance</td><td className="text-right">75</td></tr>
                            <tr><td>-2 Encumbrance</td><td className="text-right">250</td></tr>
                            <tr><td>-3 Encumbrance</td><td className="text-right">500</td></tr>
                            <tr><td>Reinforced Quality</td><td className="text-right">3,000</td></tr>
                            <tr><td>Other Positive Qualities</td><td className="text-right">50</td></tr>
                            <tr><td>Other Negative Qualities</td><td className="text-right">-50</td></tr>
                          </tbody>
                        </table>
                      </div>

                      <div className="mt-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 w-1/2">
                        <div className="font-semibold text-yellow-300 mb-2">Combination Modifiers</div>
                        <div className="text-white/80 text-sm space-y-1">
                          <div>• Low soak + Low defense: +100-250 cost</div>
                          <div>• Low value + High value: +250-500 cost</div>
                          <div>• High value + High value: +1,000-2,000 cost</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
        
                {/* Weapon Creation */}
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h4 className="text-indigo-300 font-semibold mb-4">Weapon Design</h4>

                  <div className="space-y-4">
                    <div>
                      <h5 className="font-semibold text-indigo-200 mb-3">Universal Attributes</h5>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                          <div className="font-semibold text-red-200 mb-1">Base Damage</div>
                          <div className="text-white/80 text-sm space-y-1">
                            <div>• Consider it deals 1-2 more damage on average</div>
                            <div>• Successes from attack rolls add to base damage</div>
                            <div>• Balance against other weapon attributes</div>
                          </div>
                        </div>
        
                        <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3">
                          <div className="font-semibold text-orange-200 mb-1">Critical Rating</div>
                          <div className="text-white/80 text-sm space-y-1">
                            <div>• Range: 1-6 (1 and 6 are very rare)</div>
                            <div>• Default: 3 (balanced frequency)</div>
                            <div>• Lower = more deadly, Higher = safer</div>
                          </div>
                        </div>
        
                        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                          <div className="font-semibold text-yellow-200 mb-1">Encumbrance by Skill</div>
                          <div className="text-white/80 text-sm space-y-1">
                            <div>• Brawl: 1</div>
                            <div>• Melee/Ranged: 1-4</div>
                            <div>• Gunnery: 5-9</div>
                          </div>
                        </div>
                      </div>
                    </div>
        
                    <div>
                      <h5 className="font-semibold text-indigo-200 mb-3">Weapon Cost Calculation</h5>
                      <div className="bg-gray-800/50 border border-gray-600/30 rounded-lg p-3 overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-gray-600/30">
                              <th className="text-left text-gray-200 pb-2">Characteristic</th>
                              <th className="text-right text-gray-200 pb-2">Cost</th>
                            </tr>
                          </thead>
                          <tbody className="text-white/80">
                            <tr><td>4-5 Damage</td><td className="text-right">100</td></tr>
                            <tr><td>6-7 Damage</td><td className="text-right">250</td></tr>
                            <tr><td>8-9 Damage</td><td className="text-right">500</td></tr>
                            <tr><td>10-12 Damage</td><td className="text-right">1,000</td></tr>
                            <tr><td>13+ Damage</td><td className="text-right">3,000</td></tr>
                            <tr><td>Crit Rating 5-6</td><td className="text-right">0</td></tr>
                            <tr><td>Crit Rating 4</td><td className="text-right">50</td></tr>
                            <tr><td>Crit Rating 3</td><td className="text-right">150</td></tr>
                            <tr><td>Crit Rating 2</td><td className="text-right">300</td></tr>
                            <tr><td>Crit Rating 1</td><td className="text-right">600</td></tr>
                            <tr><td>Short Range</td><td className="text-right">0</td></tr>
                            <tr><td>Medium Range</td><td className="text-right">100</td></tr>
                            <tr><td>Long Range</td><td className="text-right">300</td></tr>
                            <tr><td>Extreme Range</td><td className="text-right">600</td></tr>
                            <tr><td>Cumbersome/Unwieldy</td><td className="text-right">-100 per rank</td></tr>
                            <tr><td>Burn/Ensnare/Linked</td><td className="text-right">200 per rank</td></tr>
                            <tr><td>Defensive/Deflection</td><td className="text-right">Use armor defense costs</td></tr>
                            <tr><td>Disorient/Accurate/Stun</td><td className="text-right">50 per rank</td></tr>
                            <tr><td>Concussive</td><td className="text-right">1,000 per rank</td></tr>
                            <tr><td>Other Positive Qualities</td><td className="text-right">100 per rank</td></tr>
                            <tr><td>Other Negative Qualities</td><td className="text-right">-75 per rank</td></tr>
                            <tr><td>Melee/Brawl Weapon</td><td className="text-right">Reduce to 50% total</td></tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
        
                {/* Hard Points System */}
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h4 className="text-indigo-300 font-semibold mb-4">Hard Points & Attachments</h4>

                  <div className="space-y-4">
                    <div className="bg-cyan-600/20 border border-cyan-500/30 rounded-lg p-3">
                      <div className="font-semibold text-cyan-300 mb-2">Hard Points Formula</div>
                      <div className="text-white/80 text-sm">
                        Hard Points = ½ Base Encumbrance (rounded up)
                      </div>
                    </div>
        
                    <div>
                      <h5 className="font-semibold text-indigo-200 mb-3">Hard Point Examples</h5>
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                          <div className="font-semibold text-green-200 mb-1">Light Items</div>
                          <div className="text-white/80 text-sm">
                            Encumbrance 1-2 = 1 Hard Point
                          </div>
                        </div>
        
                        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                          <div className="font-semibold text-yellow-200 mb-1">Medium Items</div>
                          <div className="text-white/80 text-sm">
                            Encumbrance 3-4 = 2 Hard Points
                          </div>
                        </div>
        
                        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                          <div className="font-semibold text-red-200 mb-1">Heavy Items</div>
                          <div className="text-white/80 text-sm">
                            Encumbrance 5-6 = 3 Hard Points
                          </div>
                        </div>
                      </div>
                    </div>
        
                    <div>
                      <h5 className="font-semibold text-indigo-200 mb-3">Installing Attachments</h5>
                      <div className="space-y-3">
                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                          <div className="font-semibold text-blue-200 mb-2">Installation Process</div>
                          <div className="text-white/80 text-sm space-y-1">
                            <div>• Requires approximately 1 hour of work</div>
                            <div>• Make Average Mechanics check</div>
                            <div>• Each attachment requires specific number of hard points</div>
                            <div>• Once installed, hard points are occupied permanently</div>
                          </div>
                        </div>
        
                        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                          <div className="font-semibold text-yellow-200 mb-2">Installation Results</div>
                          <div className="text-white/80 text-sm space-y-1">
                            <div>• <strong>Success:</strong> Attachment installed properly</div>
                            <div>• <strong>Failure:</strong> Installation fails, try again</div>
                            <div>• <strong>Despair:</strong> Attachment destroyed in process</div>
                            <div>• <strong>Success with Despair:</strong> Attachment may malfunction at worst time</div>
                          </div>
                        </div>
        
                        <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
                          <div className="font-semibold text-purple-200 mb-2">Design Guidelines</div>
                          <div className="text-white/80 text-sm space-y-1">
                            <div>• Attachments should provide meaningful but balanced benefits</div>
                            <div>• Consider trade-offs (weight, cost, complexity)</div>
                            <div>• Don't allow combinations that break game balance</div>
                            <div>• Limit total improvements to prevent "super items"</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
        
                <div className="bg-purple-600/10 border border-purple-500/30 rounded-lg p-4">
                  <h5 className="font-semibold text-purple-300 mb-3">Design Philosophy</h5>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 text-sm">
                    <div>
                      <div className="font-semibold text-purple-200 mb-1">Combat Pacing</div>
                      <div className="text-white/80 text-xs">Every hit should threaten characters - avoid over-protecting</div>
                    </div>
        
                    <div>
                      <div className="font-semibold text-purple-200 mb-1">Dice Pool Control</div>
                      <div className="text-white/80 text-xs">Keep defense values reasonable to maintain manageable dice pools</div>
                    </div>
        
                    <div>
                      <div className="font-semibold text-purple-200 mb-1">Meaningful Choices</div>
                      <div className="text-white/80 text-xs">High-value items should come with significant trade-offs</div>
                    </div>
        
                    <div>
                      <div className="font-semibold text-purple-200 mb-1">Quality Balance</div>
                      <div className="text-white/80 text-xs">Avoid redundant qualities (Pierce + Breach) on same item</div>
                    </div>
                  </div>
                </div>
        
              </div>
            </div>
          </div>
        </div>

        {/* Lethal Company Rules */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 shadow-xl overflow-hidden">
          <div 
            className="p-3 lg:p-4 border-b border-white/10 bg-gradient-to-r from-orange-600/20 to-yellow-600/20 cursor-pointer hover:bg-gradient-to-r hover:from-orange-600/30 hover:to-yellow-600/30 transition-all duration-300"
            onClick={() => toggleSection('lethalcompany')}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-lg lg:text-xl">⚡</span>
                <span className="text-white font-semibold text-base lg:text-lg">Lethal Company Rules</span>
                <span className="text-xs bg-orange-500/30 text-orange-300 px-2 py-1 rounded ml-2">
                  Company Protocols
                </span>
              </div>
              
              <div className={`transform transition-transform duration-300 ${expandedSections.lethalcompany ? 'rotate-180' : 'rotate-0'}`}>
                <svg className="w-4 h-4 lg:w-5 lg:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <div className={`transition-all duration-500 ease-in-out overflow-auto ${
            expandedSections.lethalcompany 
              ? 'max-h-[800px] opacity-100'
              : 'max-h-0 opacity-0'
          }`}>
            <div className="p-3 lg:p-4 space-y-4">
              <div className="text-white space-y-3">
                
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-3">
                  <div className="font-semibold text-orange-300 mb-2">⚡ Company Operational Protocols</div>
                  <div className="text-white/90 text-sm">
                    Special rules for corporate operations, equipment management, ship systems, and post-mortem assistance protocols.
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h4 className="text-orange-300 font-semibold mb-4">General Operations</h4>
                  
                  <div className="space-y-3">
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                      <div className="font-semibold text-blue-200 mb-2">Equipment & Actions</div>
                      <div className="text-white/80 text-sm space-y-1">
                        <div>• You may scan once per new room per turn as an incidental</div>
                        <div>• When using an item with battery, the item loses 1 charge at the end of the turn if it was on at any time during your turn</div>
                        <div>• While holding a two-handed item, you may not perform any actions except for downgrading to a maneuver</div>
                        <div>• Picking up an item is an incidental or a maneuver if over 30 weight. While holding a two-handed item, you may not pick up any item</div>
                        <div>• Putting an item down is an incidental</div>
                      </div>
                    </div>

                    <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
                      <div className="font-semibold text-purple-200 mb-2">Entity Encounters & Stealth</div>
                      <div className="text-white/80 text-sm space-y-1">
                        <div>• Whenever an entity and player enter the same room, a contested Stealth (Entity) vs. Perception (Player) check is made</div>
                        <div>• You may enter/exit stealth mode at the start of any round. While stealthed, your maximum maneuvers per turn is 1, the roles for the above roll is reversed to Stealth (Player) vs. Perception (Entity) with 2 boost dice added</div>
                      </div>
                    </div>

                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                      <div className="font-semibold text-red-200 mb-2">Stress & Critical Events</div>
                      <div className="text-white/80 text-sm space-y-1">
                        <div>• Sanity checks occur the first time a new entity is seen, witnessing a player's death and being alone within the facility 5 consecutive turns</div>
                      </div>
                    </div>

                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                      <div className="font-semibold text-green-200 mb-2">Mission Rewards</div>
                      <div className="text-white/80 text-sm">
                        You will receive 20xp for each moon you complete
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h4 className="text-orange-300 font-semibold mb-4">Weight & Encumbrance System</h4>
                  
                  <div className="space-y-4">
                    <div className="bg-yellow-600/20 border border-yellow-500/30 rounded-lg p-3">
                      <div className="font-semibold text-yellow-300 mb-2">Base Encumbrance</div>
                      <div className="text-white/80 text-sm">
                        Every 15 weight carried counts as 1 encumbrance
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3">
                        <div className="font-semibold text-orange-200 mb-1">Over Encumbrance Limit</div>
                        <div className="text-white/80 text-sm">
                          Each encumbrance over your limit adds 1 setback dice to all brawn and agility checks
                        </div>
                      </div>

                      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                        <div className="font-semibold text-red-200 mb-1">Heavy Load (Encumbrance + Brawn)</div>
                        <div className="text-white/80 text-sm">
                          Maneuvers cost 2 strain to perform
                        </div>
                      </div>

                      <div className="bg-red-600/20 border border-red-600/30 rounded-lg p-3">
                        <div className="font-semibold text-red-200 mb-1">Maximum Load (Encumbrance + Brawn + 2)</div>
                        <div className="text-white/80 text-sm">
                          Only 1 maneuver may be taken each turn
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                      <div className="font-semibold text-green-200 mb-1">Weight Relief</div>
                      <div className="text-white/80 text-sm">
                        Should an item be dropped and your encumbrance goes below a certain threshold, the effect immediately goes away
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h4 className="text-orange-300 font-semibold mb-4">Ship Operations</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-semibold text-orange-200 mb-3">Actions</h5>
                      <div className="space-y-3">
                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                          <div className="font-semibold text-blue-200 mb-1">Monitor System - Identify Threat</div>
                          <div className="text-white/80 text-sm">
                            Make a Difficulty 2 Perception/Computers check to clearly identify scrap, enemies, traps, or hazards within the same room and all adjacent rooms to the target crew member
                          </div>
                        </div>

                        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                          <div className="font-semibold text-green-200 mb-1">Navigation System - Predict Weather Event</div>
                          <div className="text-white/80 text-sm">
                            Make a Difficulty 2 Survival/Computers check to determine when the next weather event will occur
                          </div>
                        </div>

                        <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-3">
                          <div className="font-semibold text-cyan-200 mb-1">Terminal System - Hack System</div>
                          <div className="text-white/80 text-sm space-y-1">
                            <div>Make a Computers check to remotely disable traps or override secure doors</div>
                            <div><strong>Base difficulties:</strong> Secure Door (1), Landmine/Spike Trap (2), Turret (3), Laser Grid (4)</div>
                            <div>Each system can be hacked multiple times with increasing difficulty (+1 per previous hack attempt on same target)</div>
                            <div>Success disables target for 5 rounds; Advantage extends duration by 2 rounds per Advantage</div>
                          </div>
                        </div>

                        <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
                          <div className="font-semibold text-purple-200 mb-1">Inverse Teleporter - Precision Deployment</div>
                          <div className="text-white/80 text-sm">
                            Make a Difficulty 3 Mechanics check to teleport crew to specific facility location
                          </div>
                        </div>

                        <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-3">
                          <div className="font-semibold text-indigo-200 mb-1">Ship Door - Force Door Override</div>
                          <div className="text-white/80 text-sm">
                            Make a Difficulty 3 Mechanics check to bypass ship door cooldown requirements and operate immediately
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h5 className="font-semibold text-orange-200 mb-3">Maneuvers</h5>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                          <div className="font-semibold text-blue-200 mb-1 text-sm">Monitor System - Change Target Player</div>
                          <div className="text-white/80 text-xs">Switch to a different player on the monitor system</div>
                        </div>

                        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                          <div className="font-semibold text-green-200 mb-1 text-sm">Navigation System - Planetary Scan</div>
                          <div className="text-white/80 text-xs">Scan the planet for outdoor entities and traps within 10 tiles</div>
                        </div>

                        <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-3">
                          <div className="font-semibold text-cyan-200 mb-1 text-sm">Terminal System - Send Basic Command</div>
                          <div className="text-white/80 text-xs">Input simple facility commands</div>
                        </div>

                        <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
                          <div className="font-semibold text-purple-200 mb-1 text-sm">Inverse Teleporter - Random Facility Drop</div>
                          <div className="text-white/80 text-xs">Teleport crew to random location within facility</div>
                        </div>

                        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                          <div className="font-semibold text-yellow-200 mb-1 text-sm">Signal Translator - Send Message</div>
                          <div className="text-white/80 text-xs">Input a message to the console for all players to see</div>
                        </div>

                        <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-3">
                          <div className="font-semibold text-indigo-200 mb-1 text-sm">Ship Door - Toggle Door</div>
                          <div className="text-white/80 text-xs">Open or close ship door</div>
                        </div>

                        <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3">
                          <div className="font-semibold text-orange-200 mb-1 text-sm">Assist Planetary Navigation</div>
                          <div className="text-white/80 text-xs">Find the direction required to go to the ship, fire exit, or main entrance for the currently targeted player</div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h5 className="font-semibold text-orange-200 mb-3">Incidentals</h5>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                          <div className="font-semibold text-blue-200 mb-1 text-sm">Monitor System - Observe Feeds</div>
                          <div className="text-white/80 text-xs">Passively watch crew activities through monitor displays</div>
                        </div>

                        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                          <div className="font-semibold text-green-200 mb-1 text-sm">Navigation System - Check Time</div>
                          <div className="text-white/80 text-xs">View current mission time and departure countdown</div>
                        </div>

                        <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-3">
                          <div className="font-semibold text-cyan-200 mb-1 text-sm">Terminal System - Read System Status</div>
                          <div className="text-white/80 text-xs">Check basic terminal readouts and system information</div>
                        </div>

                        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                          <div className="font-semibold text-red-200 mb-1 text-sm">Teleporter - Emergency Extraction (Out-of-Turn)</div>
                          <div className="text-white/80 text-xs">Instantly teleport crew member in immediate danger to the ship. Can be used outside of normal turn order during emergencies</div>
                        </div>

                        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                          <div className="font-semibold text-yellow-200 mb-1 text-sm">Signal Translator - Emergency Broadcast (Out-of-Turn)</div>
                          <div className="text-white/80 text-xs">Instantly transmit urgent warnings to crew. Can be used outside of normal turn order during critical situations</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h4 className="text-orange-300 font-semibold mb-4">Post-Mortem Operations</h4>
                  <div className="mb-3 text-white/80 text-sm italic">Available to deceased crew members</div>
                  
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-semibold text-red-200 mb-3">Actions</h5>
                      <div className="space-y-3">
                        <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
                          <div className="font-semibold text-purple-200 mb-1">Teleport</div>
                          <div className="text-white/80 text-sm">Teleport directly to a living player</div>
                        </div>

                        <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-3">
                          <div className="font-semibold text-indigo-200 mb-1">Supernatural Interference</div>
                          <div className="text-white/80 text-sm">Distract an enemy for 1 round. If it is attacked, this effect ends</div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h5 className="font-semibold text-red-200 mb-3">Maneuvers</h5>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                          <div className="font-semibold text-green-200 mb-1 text-sm">Stealth Assistance</div>
                          <div className="text-white/80 text-xs">Add a boost dice to a living player's next Stealth check</div>
                        </div>

                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                          <div className="font-semibold text-blue-200 mb-1 text-sm">On Alert</div>
                          <div className="text-white/80 text-xs">Add a boost dice to a living player's next perception check</div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h5 className="font-semibold text-red-200 mb-3">Incidentals</h5>
                      <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-3">
                        <div className="font-semibold text-cyan-200 mb-1">Observe</div>
                        <div className="text-white/80 text-sm">Remotely observe a living player's location as though through the monitor on the ship</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-4">
                  <h5 className="font-semibold text-yellow-300 mb-3">Quick Reference</h5>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 text-sm">
                    <div>
                      <div className="font-semibold text-yellow-200 mb-1">Encumbrance Formula</div>
                      <div className="text-white/80 text-xs">Weight ÷ 15 = Encumbrance levels</div>
                    </div>

                    <div>
                      <div className="font-semibold text-yellow-200 mb-1">Critical Injury Option</div>
                      <div className="text-white/80 text-xs">Roll ≤80: Take Exhaustion instead</div>
                    </div>

                    <div>
                      <div className="font-semibold text-yellow-200 mb-1">Stealth Mode</div>
                      <div className="text-white/80 text-xs">1 maneuver max, +2 boost to stealth</div>
                    </div>

                    <div>
                      <div className="font-semibold text-yellow-200 mb-1">Battery Drain</div>
                      <div className="text-white/80 text-xs">-1 charge if used during turn</div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default RulesPage;