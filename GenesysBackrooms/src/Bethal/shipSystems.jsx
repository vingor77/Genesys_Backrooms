import React, { useState, useEffect } from 'react';

const ShipSystems = ({ 
  currentRound, 
  lightningStrikes, 
  addAlert
}) => {
  // Initialize state properly with localStorage data
  const [systemStates, setSystemStates] = useState(() => {
    const saved = localStorage.getItem('shipSystemStates');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return new Map(Object.entries(parsed));
      } catch (error) {
        console.error('Error parsing saved system states:', error);
        return new Map();
      }
    }
    return new Map();
  });
  
  const [expandedSystem, setExpandedSystem] = useState(null);
  const [lastRoundChecked, setLastRoundChecked] = useState(0);
  const [lastLightningCheck, setLastLightningCheck] = useState(0);

  // Save to localStorage whenever systemStates changes
  useEffect(() => {
    const statesObject = Object.fromEntries(systemStates);
    localStorage.setItem('shipSystemStates', JSON.stringify(statesObject));
  }, [systemStates]);

  // Ship system definitions - simplified per requirements
  const shipSystems = {
    monitor: {
      id: 'monitor',
      name: 'Monitor System',
      description: 'Displays player locations and facility surveillance',
      maxDurability: 8,
      repairCost: 30,
      repairSkill: 'Crafting',
      repairDifficulty: 'Average (2 Difficulty)',
      usageChance: 0.05,
      baseCost: 0, // Core system - always installed
      effects: {
        7: 'Slight screen flickering. No penalties.',
        6: 'Occasional static. +1 Setback to monitoring checks.',
        5: 'Frequent static interruptions. +1 Setback to monitoring, screen goes dark for 1 round every 8 rounds.',
        4: 'Poor image quality. +2 Setback to monitoring, cannot see fine details.',
        3: 'Severe display issues. +2 Setback to monitoring, 25% chance screen fails each round.',
        2: 'Critical malfunction. +3 Setback to monitoring.',
        1: 'Near failure. +3 Setback to monitoring, random camera switching every round.',
        0: 'Monitor destroyed. Cannot view players or use monitoring commands.'
      },
      icon: '📺'
    },

    navigation: {
      id: 'navigation',
      name: 'Navigation System',
      description: 'Controls ship movement and weather detection systems',
      maxDurability: 10,
      repairCost: 50,
      repairSkill: 'Metalworking',
      repairDifficulty: 'Hard (3 Difficulty)',
      usageChance: 0.05,
      baseCost: 0, // Core system - always installed
      effects: {
        9: 'Minor calibration drift. No penalties.',
        8: 'Slight navigation errors. Weather forecast 10% chance to be wrong.',
        7: 'Navigation instability. Weather forecast 20% chance to be wrong.',
        6: 'Sensor interference. Weather forecast 30% chance to be wrong, arrive 1 round late.',
        5: 'Major sensor issues. Weather forecast 40% chance to be wrong, arrive 3 rounds late.',
        4: 'Critical navigation errors. Weather forecast 50% chance to be wrong, arrive 5 rounds late.',
        3: 'Severe malfunction. Weather forecast 60% chance to be wrong, arrive 8 rounds late, 5% chance ship lands 1 day late.',
        2: 'Navigation failing. Weather forecast 75% chance to be wrong, arrive 11 rounds late, 10% chance ship lands 1 day late.',
        1: 'Near total failure. Weather forecast 90% chance to be wrong, arrive 15 rounds late, 15% chance ship lands 1 day late.',
        0: 'Navigation destroyed. Weather forecast always wrong, arrive 19 rounds late, 20% chance ship lands 1 day late.'
      },
      icon: '🧭'
    },

    terminal: {
      id: 'terminal',
      name: 'Terminal System',
      description: 'Command interface for doors, turrets, and facility control',
      maxDurability: 6,
      repairCost: 25,
      repairSkill: 'Crafting',
      repairDifficulty: 'Average (2 Difficulty)',
      usageChance: 0.05,
      baseCost: 0, // Core system - always installed
      effects: {
        5: 'Minor lag. No penalties.',
        4: 'Slow response times. +1 Setback to terminal command checks.',
        3: 'Command delays. +1 Setback to terminal commands, 20% chance commands are delayed by 1 round.',
        2: 'Severe lag. +2 Setback to terminal commands, 40% chance commands are delayed by 1 round.',
        1: 'Critical malfunction. +3 Setback to terminal commands, 60% chance commands fail completely.',
        0: 'Terminal destroyed. Cannot use facility commands.'
      },
      icon: '💻'
    },

    shipDoor: {
      id: 'shipDoor',
      name: 'Ship Door',
      description: 'Entrance to the ship - can be closed to keep crew safe from outdoor entities',
      maxDurability: 10,
      repairCost: 15,
      repairSkill: 'Metalworking/Crafting',
      repairDifficulty: 'Medium (2 Difficulty)',
      usageChance: 0.05,
      baseCost: 0, // Core system - always installed
      effects: {
        9: 'Minor hydraulic lag. Takes 1 round to open, 1 round to close. No cooldown needed.',
        8: 'Slight mechanical wear. Takes 1 round to open, 2 rounds to close. 1 round cooldown if door was closed for 5+ rounds.',
        7: 'Hydraulic strain. Takes 2 rounds to open, 2 rounds to close. 2 round cooldown if door was closed for 7+ rounds.',
        6: 'Motor stress. Takes 2 rounds to open, 3 rounds to close. 3 round cooldown if door was closed for 10+ rounds.',
        5: 'System fatigue. Takes 3 rounds to open, 3 rounds to close. 4 round cooldown if door was closed for 12+ rounds.',
        4: 'Hydraulic problems. Takes 3 rounds to open, 4 rounds to close. 5 round cooldown if door was closed for 15+ rounds.',
        3: 'Serious malfunction. Takes 4 rounds to open, 4 rounds to close. 6 round cooldown if door was closed for 18+ rounds.',
        2: 'Critical instability. Takes 5 rounds to open, 5 rounds to close. 8 round cooldown if door was closed for 20+ rounds.',
        1: 'Near failure. Takes 6 rounds to open, 6 rounds to close. 10 round cooldown if door was closed for 25+ rounds.',
        0: 'Door destroyed. Cannot open or close ship entrance, no protection from outdoor entities.'
      },
      icon: '🚪'
    },

    teleporter: {
      id: 'teleporter',
      name: 'Teleporter',
      description: 'Emergency extraction system for players in danger',
      maxDurability: 8,
      repairCost: 150,
      repairSkill: 'Metalworking',
      repairDifficulty: 'Hard (3 Difficulty)',
      usageChance: 0.05,
      baseCost: 375, // Purchaseable upgrade
      effects: {
        7: 'Minor power fluctuations. No penalties.',
        6: 'Targeting drift. 10% chance to teleport within 1 tile.',
        5: 'Power instability. 20% chance to teleport within 1 tile',
        4: 'Serious malfunction. 30% chance to teleport within 1 tile, 10% chance teleport fails, player takes 2 wounds if successful.',
        3: 'Critical instability. 40% chance to teleport within 2 tiles, 15% chance teleport fails, player takes 3 wounds if successful.',
        2: 'Dangerous operation. 50% chance to teleport within 3 tiles, 20% chance teleport fails, player takes 5 wounds if successful.',
        1: 'Near failure. 100% chance to teleport within 5 tiles, 50% chance teleport fails, player takes 8 wounds if successful.',
        0: 'Teleporter destroyed. Cannot extract players remotely.'
      },
      icon: '🔴'
    },
    
    inverseTeleporter: {
      id: 'inverseTeleporter',
      name: 'Inverse Teleporter',
      description: 'Teleport players to a random location within the facility',
      maxDurability: 8,
      repairCost: 150,
      repairSkill: 'Metalworking',
      repairDifficulty: 'Hard (3 Difficulty)',
      usageChance: 0.05,
      baseCost: 425, // Core system - always installed
      effects: {
        7: 'Minor drift. 10% chance to teleport to adjacent room instead of target.',
        6: 'Targeting errors. 15% chance to teleport to wrong room within facility.',
        5: 'Targeting errors. 20% chance to teleport to wrong room, 5% chance to teleport to hazardous area.',
        4: 'Serious malfunction. 30% chance to teleport to wrong room, 15% chance to teleport to hazardous area, 5% chance teleport fails.',
        3: 'Critical instability. 40% chance to teleport to wrong room, 25% chance to teleport to hazardous area, 10% chance teleport fails.',
        2: 'Dangerous operation. 50% chance to teleport to wrong room, 35% chance to teleport to hazardous area, 20% chance teleport fails.',
        1: 'Near failure. 70% chance to teleport to wrong room, 50% chance to teleport to hazardous area, 40% chance teleport fails.',
        0: 'Inverse teleporter destroyed. Cannot teleport players into facility.'
      },
      icon: '🔴'
    },

    signalTranslator: {
      id: 'signalTranslator',
      name: 'Signal Translator',
      description: 'Communication system for transmitting messages to crew',
      maxDurability: 5,
      repairCost: 10,
      repairSkill: 'Leatherworking',
      repairDifficulty: 'Easy (1 Difficulty)',
      usageChance: 0.05,
      baseCost: 255, // Purchaseable upgrade
      effects: {
        4: 'Minor static. No penalties.',
        3: 'Message distortion. 10% chance message is garbled.',
        2: 'Signal interference. 20% chance message is incomplete.',
        1: 'Critical malfunction. 50% chance message fails to send. Arrives 1 round late.',
        0: 'Signal translator destroyed. Cannot send messages to crew.'
      },
      icon: '📡'
    }
  };

  // Initialize systems with appropriate durability - only if not already loaded
  useEffect(() => {
    // Only initialize if we have no saved data or if some systems are missing
    const needsInitialization = systemStates.size === 0 || 
      Object.keys(shipSystems).some(id => !systemStates.has(id));
    
    if (needsInitialization) {
      setSystemStates(prevStates => {
        const newStates = new Map(prevStates);
        
        Object.values(shipSystems).forEach(system => {
          if (!newStates.has(system.id)) {
            newStates.set(system.id, {
              currentDurability: system.maxDurability,
              isInstalled: system.baseCost === 0 // Core systems start installed, upgrades must be purchased
            });
          }
        });
        
        return newStates;
      });
    }
  }, []);

  // Check for round-based degradation (every 10 rounds)
  useEffect(() => {
    if (currentRound > 0 && currentRound % 10 === 0 && currentRound !== lastRoundChecked) {
      setLastRoundChecked(currentRound);
      
      // Select random system to lose durability
      const systemIds = Object.keys(shipSystems);
      let attempts = 0;
      let selectedId = null;
      
      // Try to find an installed system (avoid infinite loop)
      while (attempts < 10 && !selectedId) {
        const randomId = systemIds[Math.floor(Math.random() * systemIds.length)];
        const systemState = systemStates.get(randomId);
        if (systemState && systemState.isInstalled) {
          selectedId = randomId;
        }
        attempts++;
      }
      
      if (selectedId) {
        const chanceOfDegradation = Math.random();
        if (chanceOfDegradation < 0.2) {
          degradeSystem(selectedId, 1, 'time');
        }
      }
    }
  }, [currentRound, lastRoundChecked, systemStates]);

  // Check for lightning damage
  useEffect(() => {
    if (lightningStrikes && lightningStrikes.length > lastLightningCheck) {
      const newStrikes = lightningStrikes.slice(lastLightningCheck);
      setLastLightningCheck(lightningStrikes.length);
      
      newStrikes.forEach(strike => {
        // Check if lightning is within 2 tiles of ship (assuming ship is at center of grid)
        const shipX = 6; // Default ship position
        const shipY = 6;
        const distance = Math.abs(strike.x - shipX) + Math.abs(strike.y - shipY);
        
        if (distance <= 2) {
          // Random system loses durability
          const systemIds = Object.keys(shipSystems);
          const installedSystemIds = systemIds.filter(id => {
            const state = systemStates.get(id);
            return state && state.isInstalled;
          });
          
          if (installedSystemIds.length > 0) {
            const randomSystemId = installedSystemIds[Math.floor(Math.random() * installedSystemIds.length)];
            degradeSystem(randomSystemId, 1, 'lightning');
          }
        }
      });
    }
  }, [lightningStrikes, lastLightningCheck, systemStates]);

  // Degrade system function
  const degradeSystem = (systemId, amount, cause) => {
    setSystemStates(prev => {
      const newStates = new Map(prev);
      const currentState = newStates.get(systemId);
      
      if (currentState && currentState.currentDurability > 0) {
        const newDurability = Math.max(0, currentState.currentDurability - amount);
        const system = shipSystems[systemId];
        
        newStates.set(systemId, {
          ...currentState,
          currentDurability: newDurability
        });
        
        const causeText = cause === 'lightning' ? 'lightning strike' : 
                         cause === 'usage' ? 'system usage' : 
                         'natural degradation';
        
        if (addAlert) {
          if (newDurability === 0) {
            addAlert('system-critical', 
              `🔥 SYSTEM DESTROYED! ${system.name} has failed completely due to ${causeText}!`, 
              currentRound
            );
          } else if (newDurability <= 2) {
            addAlert('system-damage', 
              `⚠️ CRITICAL DAMAGE: ${system.name} severely damaged by ${causeText}! (${newDurability}/${system.maxDurability})`, 
              currentRound
            );
          } else if (newDurability <= 4) {
            addAlert('system-damage', 
              `🔧 MAJOR DAMAGE: ${system.name} damaged by ${causeText}! (${newDurability}/${system.maxDurability})`, 
              currentRound
            );
          } else {
            addAlert('system-damage', 
              `⚠️ ${system.name} damaged by ${causeText}! (${newDurability}/${system.maxDurability})`, 
              currentRound
            );
          }
        }
      }
      
      return newStates;
    });
  };

  // Use system function (5% chance to degrade)
  const useSystem = (systemId) => {
    if (Math.random() < 0.05) {
      degradeSystem(systemId, 1, 'usage');
    }
  };

  // Purchase system function
  const purchaseSystem = (systemId) => {
    const system = shipSystems[systemId];
    
    setSystemStates(prev => {
      const newStates = new Map(prev);
      newStates.set(systemId, {
        currentDurability: system.maxDurability,
        isInstalled: true
      });
      return newStates;
    });
    
    if (addAlert) {
      addAlert('system-purchase', 
        `💰 ${system.name} purchased and installed! (${system.baseCost} credits)`, 
        currentRound
      );
    }
  };

  // Repair system function
  const repairSystem = (systemId, points = 1) => {
    setSystemStates(prev => {
      const newStates = new Map(prev);
      const currentState = newStates.get(systemId);
      const system = shipSystems[systemId];
      
      if (currentState) {
        const newDurability = Math.min(
          system.maxDurability, 
          currentState.currentDurability + points
        );
        newStates.set(systemId, {
          ...currentState,
          currentDurability: newDurability
        });
        
        if (addAlert) {
          addAlert('system-repair', 
            `🔧 ${system.name} repaired! (+${points} durability, now ${newDurability}/${system.maxDurability})`, 
            currentRound
          );
        }
      }
      
      return newStates;
    });
  };

  // Sell system function
  const sellSystem = (systemId) => {
    const system = shipSystems[systemId];
    const sellPrice = Math.floor(system.baseCost * 0.5); // 50% of original cost
    
    setSystemStates(prev => {
      const newStates = new Map(prev);
      newStates.set(systemId, {
        currentDurability: 0,
        isInstalled: false
      });
      return newStates;
    });
    
    if (addAlert) {
      addAlert('system-sell', 
        `💰 ${system.name} sold for ${sellPrice} credits!`, 
        currentRound
      );
    }
  };

  // Get system condition color
  const getConditionColor = (currentDurability, maxDurability) => {
    const percent = currentDurability / maxDurability;
    if (currentDurability === 0) return 'text-gray-400 bg-gray-800/40 border-gray-500/50';
    if (percent <= 0.25) return 'text-red-400 bg-red-500/20 border-red-400/30';
    if (percent <= 0.50) return 'text-orange-400 bg-orange-500/20 border-orange-400/30';
    if (percent <= 0.75) return 'text-yellow-400 bg-yellow-500/20 border-yellow-400/30';
    return 'text-green-400 bg-green-500/20 border-green-400/30';
  };

  // Get condition text
  const getConditionText = (currentDurability, maxDurability) => {
    const percent = currentDurability / maxDurability;
    if (currentDurability === 0) return 'DESTROYED';
    if (percent <= 0.25) return 'CRITICAL';
    if (percent <= 0.50) return 'MAJOR DAMAGE';
    if (percent <= 0.75) return 'MINOR DAMAGE';
    return 'FUNCTIONAL';
  };

  return (
    <div className="space-y-6">
      
      {/* Status Header */}
      <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-xl p-4 border border-indigo-400/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">🚀</span>
            <div>
              <h3 className="text-white font-semibold text-lg">Ship Systems Status</h3>
              <p className="text-indigo-300 text-sm">
                Round {currentRound} • Next degradation check: Round {Math.ceil((currentRound + 1) / 10) * 10}
              </p>
            </div>
          </div>
          
          <div className="text-right text-sm text-white/70">
            <p>Degradation: Every 10 rounds</p>
            <p>Lightning damage: Within 2 tiles</p>
            <p>Usage damage: 5% per use</p>
          </div>
        </div>
      </div>

      {/* Systems Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {Object.values(shipSystems).map(system => {
          const currentState = systemStates.get(system.id);
          const currentDurability = currentState?.currentDurability || 0;
          const isInstalled = currentState?.isInstalled || false;
          const conditionColor = getConditionColor(currentDurability, system.maxDurability);
          const conditionText = getConditionText(currentDurability, system.maxDurability);
          
          return (
            <div key={system.id} className="bg-white/5 rounded-xl border border-white/20 overflow-hidden">
              
              {/* System Header */}
              <div 
                className="p-4 cursor-pointer hover:bg-white/5 transition-colors duration-200"
                onClick={() => setExpandedSystem(expandedSystem === system.id ? null : system.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">{system.icon}</span>
                    <div>
                      <h4 className="text-white font-semibold">{system.name}</h4>
                      {isInstalled ? (
                        <div className="flex items-center space-x-2">
                          <span className={`text-xs px-2 py-1 rounded border ${conditionColor}`}>
                            {conditionText}
                          </span>
                          <span className="text-white/60 text-sm">
                            {currentDurability}/{system.maxDurability}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-400 text-sm">Not Installed</span>
                          <span className="text-yellow-300 text-xs bg-yellow-500/20 px-2 py-1 rounded">
                            {system.baseCost} Credits
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {/* Purchase button for upgrades */}
                    {!isInstalled && system.baseCost > 0 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          purchaseSystem(system.id);
                        }}
                        className="bg-yellow-500/30 hover:bg-yellow-500/50 text-yellow-300 px-2 py-1 rounded text-xs transition-colors duration-200"
                      >
                        Buy
                      </button>
                    )}
                    
                    {/* Use button - only for installed systems */}
                    {isInstalled && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          useSystem(system.id);
                        }}
                        disabled={currentDurability === 0}
                        className="bg-blue-500/30 hover:bg-blue-500/50 disabled:bg-gray-500/20 disabled:text-gray-400 text-blue-300 px-2 py-1 rounded text-xs transition-colors duration-200"
                      >
                        Use
                      </button>
                    )}
                    
                    {/* Repair button - only for installed systems */}
                    {isInstalled && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          repairSystem(system.id, 1);
                        }}
                        disabled={currentDurability >= system.maxDurability}
                        className="bg-green-500/30 hover:bg-green-500/50 disabled:bg-gray-500/20 disabled:text-gray-400 text-green-300 px-2 py-1 rounded text-xs transition-colors duration-200"
                      >
                        Repair
                      </button>
                    )}
                    
                    {/* Sell button - only for upgrades (non-core systems) */}
                    {isInstalled && system.baseCost > 0 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          sellSystem(system.id);
                        }}
                        className="bg-red-500/30 hover:bg-red-500/50 text-red-300 px-2 py-1 rounded text-xs transition-colors duration-200"
                      >
                        Sell
                      </button>
                    )}
                    
                    <div className={`transform transition-transform duration-200 ${
                      expandedSystem === system.id ? 'rotate-180' : 'rotate-0'
                    }`}>
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Expanded System Details */}
              <div className={`transition-all duration-300 overflow-hidden ${
                expandedSystem === system.id ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
              }`}>
                <div className="p-4 bg-gray-800/20 border-t border-white/10 space-y-4">
                  
                  {/* Description */}
                  <p className="text-white/80 text-sm">{system.description}</p>
                  
                  {/* Purchase Information for uninstalled systems */}
                  {!isInstalled && system.baseCost > 0 && (
                    <div className="bg-yellow-500/20 border border-yellow-400/30 rounded-lg p-3">
                      <h6 className="text-yellow-300 font-semibold text-sm mb-1">System Not Installed</h6>
                      <p className="text-yellow-200 text-sm">
                        This upgrade must be purchased before use. Cost: {system.baseCost} credits
                      </p>
                    </div>
                  )}
                  
                  {/* Core System Information */}
                  {!isInstalled && system.baseCost === 0 && (
                    <div className="bg-blue-500/20 border border-blue-400/30 rounded-lg p-3">
                      <h6 className="text-blue-300 font-semibold text-sm mb-1">Core System</h6>
                      <p className="text-blue-200 text-sm">
                        This is a core ship system and cannot be sold. It should always be installed.
                      </p>
                    </div>
                  )}
                  
                  {/* Sell Information for installed upgrades */}
                  {isInstalled && system.baseCost > 0 && (
                    <div className="bg-orange-500/20 border border-orange-400/30 rounded-lg p-3">
                      <h6 className="text-orange-300 font-semibold text-sm mb-1">Upgrade System</h6>
                      <p className="text-orange-200 text-sm">
                        This upgrade can be sold for {Math.floor(system.baseCost * 0.5)} credits (50% of purchase price).
                      </p>
                    </div>
                  )}
                  
                  {/* Current Effects - only for installed systems */}
                  {isInstalled && currentDurability < system.maxDurability && (
                    <div className="bg-red-500/20 border border-red-400/30 rounded-lg p-3">
                      <h6 className="text-red-300 font-semibold text-sm mb-1">Current Effects:</h6>
                      <p className="text-red-200 text-sm">{system.effects[currentDurability]}</p>
                    </div>
                  )}
                  
                  {/* Repair Information */}
                  <div className="bg-green-500/20 border border-green-400/30 rounded-lg p-3">
                    <h6 className="text-green-300 font-semibold text-sm mb-2">Repair Information:</h6>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-white/60">Skill Required:</span>
                        <span className="text-white ml-2">{system.repairSkill}</span>
                      </div>
                      <div>
                        <span className="text-white/60">Difficulty:</span>
                        <span className="text-white ml-2">{system.repairDifficulty}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-white/60">Cost per Point:</span>
                        <span className="text-white ml-2">{system.repairCost} credits</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* All Effects by Durability */}
                  <div className="bg-blue-500/20 border border-blue-400/30 rounded-lg p-3">
                    <h6 className="text-blue-300 font-semibold text-sm mb-2">Effects by Durability Level:</h6>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {Object.entries(system.effects).reverse().map(([durability, effect]) => (
                        <div 
                          key={durability} 
                          className={`text-xs p-2 rounded ${
                            parseInt(durability) === currentDurability 
                              ? 'bg-yellow-500/30 border border-yellow-400/50' 
                              : 'bg-gray-800/30'
                          }`}
                        >
                          <span className="text-white/70 font-semibold">{durability}/{system.maxDurability}:</span>
                          <span className="text-white/90 ml-2">{effect}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Quick Repair Options - only for installed systems */}
                  {isInstalled && currentDurability < system.maxDurability && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => repairSystem(system.id, 1)}
                        className="flex-1 bg-green-500/30 hover:bg-green-500/50 text-green-300 py-2 rounded text-sm transition-colors duration-200"
                      >
                        Repair +1 ({system.repairCost} credits)
                      </button>
                      {currentDurability < system.maxDurability - 1 && (
                        <button
                          onClick={() => repairSystem(system.id, Math.min(3, system.maxDurability - currentDurability))}
                          className="flex-1 bg-green-500/30 hover:bg-green-500/50 text-green-300 py-2 rounded text-sm transition-colors duration-200"
                        >
                          Repair +{Math.min(3, system.maxDurability - currentDurability)} ({system.repairCost * Math.min(3, system.maxDurability - currentDurability)} credits)
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ShipSystems;