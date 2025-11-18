// Enhanced weather effect processor that works with the updated TacticalGrid
// This integrates with the new weather mechanics and provides proper visual feedback

import { moons } from './moonData.jsx';

// Weather generation utilities (RESTORED from original)
export const generateDailyWeatherForAllMoons = () => {
  const newDailyWeather = {};

  // Each moon rolls its own weather based on its specific chances
  moons.forEach(moon => {
    if (moon.weatherTypes) {
      // Generate random weather based on moon-specific percentages
      const randomValue = Math.random() * 100;
      let cumulativeChance = 0;
      
      for (const [weatherType, chance] of Object.entries(moon.weatherTypes)) {
        cumulativeChance += chance;
        if (randomValue <= cumulativeChance) {
          newDailyWeather[moon.name] = weatherType.toLowerCase();
          break;
        }
      }
    } else {
      // Fallback if no weather chances defined
      newDailyWeather[moon.name] = 'clear';
    }
  });

  return newDailyWeather;
};

export const getMoonWeatherTypes = (moonName) => {
  const moon = moons.find(m => m.name === moonName);
  return moon ? moon.weatherTypes : [];
};

// Time utilities (RESTORED from original)
export const roundToTime = (round) => {
  const hours = Math.floor(round / 8) + 8; // 8 rounds per hour
  const minutes = Math.round((round % 8) * 7.5); // 7.5 minutes per round
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

// Quota utilities (RESTORED from original)
export const generateNewQuota = (quotasFulfilled) => {
  const baseIncrease = 100 * (1 + Math.pow(quotasFulfilled + 1, 2) / 16);
  const variation = Math.random() * 40 - 20;
  return Math.round(130 + baseIncrease + variation);
};

export const getSellingRate = (daysUntilDeadline) => {
  if (daysUntilDeadline === 3) return 1.0;
  if (daysUntilDeadline === 2) return 0.8;
  if (daysUntilDeadline === 1) return 0.6;
  return 1.0;
};

// UPDATED: Enhanced weather processing with proper alert integration (MAIN EXPORT - replaces processWeatherEffects)
export const processWeatherEffects = (
  currentWeatherType, 
  round, 
  setQuicksandLocations, 
  setCurrentFogLevel, 
  setFloodedCells, 
  setFloodLevel, 
  setEclipseEntities, 
  setEclipseStress, 
  addAlert, 
  quicksandLocations, 
  currentFogLevel, 
  eclipseStress, 
  players, 
  selectedMoon, 
  GRID_SIZE, 
  SHIP_POSITION, 
  getCurrentFacilityPosition, 
  HEIGHT_MAPS,
  setLightningStrikes, // For tracking lightning strike locations
  outdoorEntities = [],
  daytimeEntities = []
) => {
  switch (currentWeatherType) {
    case 'rainy':
      handleRainEffects(
        round, 
        setQuicksandLocations,
        addAlert,
        quicksandLocations,
        GRID_SIZE,
        SHIP_POSITION,
        getCurrentFacilityPosition
      );
      break;

    case 'stormy':
      handleStormEffects(
        round, 
        addAlert, 
        setLightningStrikes, 
        players, 
        GRID_SIZE
      );
      break;

    case 'foggy':
      handleFogEffects(
        round,
        setCurrentFogLevel,
        addAlert,
        currentFogLevel
      );
      break;

    case 'flooded':
      handleFloodEffects(
        round, 
        selectedMoon, 
        setFloodLevel, 
        setFloodedCells, 
        addAlert, 
        GRID_SIZE, 
        HEIGHT_MAPS, 
        SHIP_POSITION, 
        getCurrentFacilityPosition
      );
      break;

    case 'eclipsed':
      handleEclipseEffects(
        round, 
        setEclipseEntities, 
        setEclipseStress, 
        addAlert, 
        eclipseStress, 
        players, 
        GRID_SIZE, 
        outdoorEntities, 
        daytimeEntities
      );
      break;
  }
};

// UPDATED: Rain effects with proper quicksand spawning (3 initial, then every 12 rounds)
const handleRainEffects = (
  round, 
  setQuicksandLocations,
  addAlert,
  quicksandLocations,
  GRID_SIZE,
  SHIP_POSITION,
  getCurrentFacilityPosition
) => {
  if (round === 0) {
    // Initial quicksand - exactly 3 locations
    const initialQuicksand = [];
    for (let i = 0; i < 3; i++) {
      let attempts = 0;
      let placed = false;

      while (!placed && attempts < 20) {
        const x = Math.floor(Math.random() * GRID_SIZE);
        const y = Math.floor(Math.random() * GRID_SIZE);

        const facilityPos = getCurrentFacilityPosition();
        const isShip = (x === SHIP_POSITION.x && y === SHIP_POSITION.y);
        const isFacility = (x === facilityPos.x && y === facilityPos.y);
        const hasQuicksand = initialQuicksand.some(loc => loc.x === x && loc.y === y);

        if (!isShip && !isFacility && !hasQuicksand) {
          initialQuicksand.push({
            id: `quicksand_initial_${i}`,
            x, y,
            round: 0,
            gridRef: `(${x}, ${y})`
          });
          placed = true;
        }
        attempts++;
      }
    }
    setQuicksandLocations(initialQuicksand);
    addAlert('weather-effect', `🌧️ Rain storm begins! 3 quicksand puddles formed at start.`, round);
    addAlert('weather-mechanics', `⚠️ RAIN EFFECTS: +1 Setback to outdoor Athletics/Coordination, +1 Setback to Perception beyond Medium range`, round);
  } else if (round % 12 === 0 && round > 0) {
    // New quicksand every 12 rounds after start
    let attempts = 0;
    let placed = false;

    while (!placed && attempts < 10) {
      const x = Math.floor(Math.random() * GRID_SIZE);
      const y = Math.floor(Math.random() * GRID_SIZE);

      const facilityPos = getCurrentFacilityPosition();
      const isShip = (x === SHIP_POSITION.x && y === SHIP_POSITION.y);
      const isFacility = (x === facilityPos.x && y === facilityPos.y);
      const hasQuicksand = quicksandLocations.some(loc => loc.x === x && loc.y === y);

      if (!isShip && !isFacility && !hasQuicksand) {
        setQuicksandLocations(prev => [...prev, {
          id: `quicksand_${Date.now()}`,
          x, y,
          round,
          gridRef: `(${x}, ${y})`
        }]);
        addAlert('weather-effect', `⚠️ New quicksand puddle formed at grid (${x}, ${y})! Total: ${quicksandLocations.length + 1}`, round);
        addAlert('weather-mechanics', `🕳️ QUICKSAND ESCAPE: Athletics (Brawn) vs 3 Difficulty. Failure = sink deeper. Round 4+ = drowning (4 wounds/round)`, round);
        placed = true;
      }
      attempts++;
    }
  }
};

// UPDATED: Storm effects with proper phase tracking and entire grid exposure
const handleStormEffects = (round, addAlert, setLightningStrikes, players, GRID_SIZE) => {
  // Clean up old lightning strikes first (remove strikes older than 2 rounds)
  if (setLightningStrikes) {
    setLightningStrikes(prev => prev.filter(strike => (round - strike.round) <= 2));
  }

  // Determine current storm phase
  const getStormPhase = (round) => {
    if (round <= 30) return 1;
    if (round <= 46) return 2;
    if (round <= 62) return 3;
    return 4;
  };

  const currentPhase = getStormPhase(round);
  
  // Check for phase transitions with enhanced alerts
  if (round === 31) {
    addAlert('weather-effect', `⚡ STORM INTENSIFYING: Phase 2 begins! ENTIRE GRID exposed to lightning!`, round);
    addAlert('weather-mechanics', `⚡ LIGHTNING PHASE 2: Strikes every 12 rounds. Vigilance vs 1 Difficulty to detect sparking. 12 wounds + Crit (+50) damage.`, round);
  } else if (round === 47) {
    addAlert('weather-effect', `⚡ SEVERE STORM: Phase 3 begins! Frequent strikes across the map!`, round);
    addAlert('weather-mechanics', `⚡ LIGHTNING PHASE 3: Strikes every 8 rounds. Equipment malfunction chance: 25%.`, round);
  } else if (round === 63) {
    addAlert('weather-effect', `⚡ PEAK STORM: Phase 4 begins! Multiple simultaneous strikes!`, round);
    addAlert('weather-mechanics', `⚡ LIGHTNING PHASE 4: Strikes every 6 rounds with multiple simultaneous hits. Equipment malfunction chance: 30%.`, round);
  }

  // Lightning strikes based on phase - ENTIRE GRID AT RISK
  let shouldStrike = false;
  if (currentPhase === 1 && round % 16 === 0 && round > 0) shouldStrike = true;
  else if (currentPhase === 2 && round % 12 === 0 && round > 30) shouldStrike = true;
  else if (currentPhase === 3 && round % 8 === 0 && round > 46) shouldStrike = true;
  else if (currentPhase === 4 && round % 6 === 0 && round > 62) shouldStrike = true;

  if (shouldStrike) {
    const strikeCount = currentPhase >= 4 ? Math.floor(Math.random() * 3) + 1 : 1;
    const newStrikes = [];
    
    for (let i = 0; i < strikeCount; i++) {
      const targetX = Math.floor(Math.random() * GRID_SIZE);
      const targetY = Math.floor(Math.random() * GRID_SIZE);
      
      newStrikes.push({
        x: targetX,
        y: targetY,
        round: round,
        id: `lightning_${round}_${i}`
      });
      
      addAlert('weather-effect', `⚡ Lightning struck grid (${targetX}, ${targetY})! Area unsafe for 2 rounds.`, round);
    }
    
    if (strikeCount > 1) {
      addAlert('weather-effect', `🌩️ MULTIPLE LIGHTNING STRIKES: ${strikeCount} simultaneous hits! Phase ${currentPhase} storm intensity.`, round);
    }
    
    // Update lightning strikes for grid display
    if (setLightningStrikes) {
      setLightningStrikes(prev => [...prev, ...newStrikes]);
    }
  }

  // Equipment malfunction checks with detailed alerts
  const malfunctionChance = currentPhase === 1 ? 0.15 : currentPhase === 2 ? 0.20 : currentPhase === 3 ? 0.25 : 0.30;
  if (Math.random() < malfunctionChance) {
    addAlert('weather-effect', `🔧 Equipment malfunction detected! Phase ${currentPhase} storm interference (${Math.round(malfunctionChance * 100)}% chance).`, round);
    addAlert('weather-mechanics', `🔧 EQUIPMENT REPAIR: Mechanics (Intellect) vs 2 Difficulty. Failure = 1d5 rounds (minor) or 2d10 rounds (major) downtime.`, round);
  }

  // Metal charge buildup warnings
  if (round > 0 && round % 4 === 0) {
    addAlert('weather-mechanics', `⚡ METAL CHARGE BUILDUP: Check metal items for electrical charge. Level 3 = automatic lightning strike!`, round);
  }
};

// UPDATED: Fog effects with probability-based changes
const handleFogEffects = (round, setCurrentFogLevel, addAlert, currentFogLevel) => {
  if (round === 0) {
    // Initialize fog at level 2
    setCurrentFogLevel(2);
    addAlert('weather-effect', `🌫️ Fog rolls in at level 2 (Moderate)! Visibility to Short range.`, round);
    addAlert('weather-mechanics', `🌫️ FOG EFFECTS: +2 Setback to Perception, reduced communication range. Fog changes each round.`, round);
  } else if (round > 0) {
    // Probability-based fog changes each round
    const change = Math.random();
    let newFogLevel = currentFogLevel || 2;

    if (change < 0.40) {
      // 40% chance to get thicker
      newFogLevel = Math.min(5, newFogLevel + 1);
    } else if (change < 0.60) {
      // 20% chance to stay the same (0.40 + 0.20 = 0.60)
      // No change
    } else {
      // 40% chance to get thinner (0.60 to 1.00 = 0.40)
      newFogLevel = Math.max(1, newFogLevel - 1);
    }

    if (newFogLevel !== currentFogLevel) {
      setCurrentFogLevel(newFogLevel);
      const levelNames = ['', 'Light', 'Moderate', 'Heavy', 'Dense', 'Impenetrable'];
      const changeText = newFogLevel > currentFogLevel ? 'thickened' : 'cleared slightly';
      const visibilityText = newFogLevel <= 2 ? 'Short range' : 
                           newFogLevel <= 4 ? 'Engaged range only' : 
                           'Auto-fail beyond Engaged';
      
      addAlert('weather-effect', `🌫️ Fog ${changeText} to level ${newFogLevel} (${levelNames[newFogLevel]})! Visibility: ${visibilityText}`, round);
      
      if (newFogLevel >= 4) {
        addAlert('weather-mechanics', `🌫️ DENSE FOG: +${newFogLevel} Setback to Perception. Navigation requires Survival vs 2-3 Difficulty.`, round);
      }
    }
  }
};

// UPDATED: Flood effects with zone-based progression every 20 rounds
const handleFloodEffects = (
  round, 
  selectedMoon, 
  setFloodLevel, 
  setFloodedCells, 
  addAlert, 
  GRID_SIZE, 
  HEIGHT_MAPS, 
  SHIP_POSITION, 
  getCurrentFacilityPosition
) => {
  // Simple flooding every 20 rounds
  if (round % 20 === 0) {
    const floodPhase = Math.floor(round / 20) + 1;
    setFloodLevel(floodPhase);
    
    if (selectedMoon && HEIGHT_MAPS[selectedMoon]) {
      const heightMap = HEIGHT_MAPS[selectedMoon];
      const newFloodedCells = new Set();
      
      // Flood all cells at or below current flood level
      for (let y = 0; y < GRID_SIZE; y++) {
        for (let x = 0; x < GRID_SIZE; x++) {
          const cellHeight = heightMap[y][x];
          
          // Don't flood ship or facility
          const facilityPos = getCurrentFacilityPosition();
          const isShip = (x === SHIP_POSITION.x && y === SHIP_POSITION.y);
          const isFacility = (x === facilityPos.x && y === facilityPos.y);
          
          if (cellHeight < floodPhase && !isShip && !isFacility) {
            newFloodedCells.add(`${x},${y}`);
          }
        }
      }
      
      setFloodedCells(newFloodedCells);
      
      const percentFlooded = Math.round((newFloodedCells.size / (GRID_SIZE * GRID_SIZE)) * 100);
      const depthNames = ['', 'Ankle-deep', 'Knee-deep', 'Waist-deep', 'Chest-deep', 'Neck-deep'];
      const currentDepth = depthNames[Math.min(floodPhase, 5)] || 'EXTREME DEPTH';
      
      addAlert('weather-effect', `🌊 Flood Level ${floodPhase}: ${currentDepth} water! ${percentFlooded}% of map flooded.`, round);
      
      // Enhanced flood mechanics alerts
      if (floodPhase === 1) {
        addAlert('weather-mechanics', `🌊 FLOOD LEVEL 1: +1 Setback to Athletics in water. No Running in flooded areas.`, round);
      } else if (floodPhase === 2) {
        addAlert('weather-mechanics', `🌊 FLOOD LEVEL 2: +2 Setback to Athletics in water. Knee-deep conditions.`, round);
      } else if (floodPhase === 3) {
        addAlert('weather-mechanics', `🌊 FLOOD LEVEL 3: +3 Setback, move only 1 range band per maneuver. Waist-deep water.`, round);
      } else if (floodPhase >= 4) {
        addAlert('weather-effect', `🚨 CRITICAL FLOOD LEVEL: Swimming checks required in flooded areas!`, round);
        addAlert('weather-mechanics', `🏊 SWIMMING REQUIRED: Athletics (Brawn) vs 2-3 Difficulty. Failure = begin drowning sequence. +1 Setback per Encumbrance.`, round);
      }
    }
  }
};

// UPDATED: Eclipse effects with entity enhancement instead of spawning
const handleEclipseEffects = (
  round, 
  setEclipseEntities, 
  setEclipseStress, 
  addAlert, 
  eclipseStress, 
  players, 
  GRID_SIZE, 
  outdoorEntities, 
  daytimeEntities
) => {
  // Eclipse intensity increases over time
  const eclipseIntensity = Math.floor(round / 16) + 1;
  
  // Apply static buffs to existing entities every 16 rounds
  if (round % 16 === 0 && round > 0) {
    const totalEntities = outdoorEntities.length + daytimeEntities.length;
    if (totalEntities > 0) {
      addAlert('weather-effect', `🌑 Eclipse energy intensifies! All ${totalEntities} entities gain +${eclipseIntensity} power boost!`, round);
      addAlert('weather-mechanics', `👹 ECLIPSE ENHANCEMENT: Existing entities boosted by Intensity ${eclipseIntensity}. Fear check when encountering enhanced entities.`, round);
    } else {
      addAlert('weather-effect', `🌑 Eclipse intensity increases to level ${eclipseIntensity}. No entities currently present to enhance.`, round);
    }
  }

  // Initial eclipse warning with mechanics
  if (round === 0) {
    addAlert('weather-effect', `🌑 Solar eclipse begins! All entities will be empowered by eclipse energy.`, round);
    addAlert('weather-mechanics', `🌑 ECLIPSE EFFECTS: 1 strain/round outside (0.5 with ally), Fear check vs 2 Difficulty at start and when seeing entities.`, round);
  }

  // Continuous strain for outside players with detailed tracking
  const playersOutside = players.filter(p => 
    p.position?.currentArea === 'exterior' && 
    p.status !== 'incapacitated'
  );
  
  if (playersOutside.length > 0 && round > 0) {
    const strainGained = playersOutside.length;
    setEclipseStress(prev => prev + strainGained);
    
    addAlert('weather-effect', `😰 ${playersOutside.length} players gained 1 strain from eclipse exposure. Total eclipse stress: ${eclipseStress + strainGained}`, round);
    
    // Warning at high stress levels
    if (eclipseStress + strainGained >= 10) {
      addAlert('weather-mechanics', `⚠️ HIGH ECLIPSE STRESS: ${eclipseStress + strainGained} total strain accumulated. Consider rotating players or seeking shelter.`, round);
    }
  }
  
  // Equipment interference with enhanced details
  const interferenceChance = round <= 16 ? 0.10 : round <= 32 ? 0.15 : round <= 48 ? 0.20 : 0.25;
  if (Math.random() < interferenceChance) {
    addAlert('weather-effect', `📱 Equipment interference detected! Eclipse intensity ${eclipseIntensity} effects (${Math.round(interferenceChance * 100)}% chance).`, round);
    addAlert('weather-mechanics', `📱 EQUIPMENT INTERFERENCE: Flashlights flicker, radios static, apparatus malfunction. Repair: Mechanics vs 2-3 Difficulty.`, round);
  }

  // Special eclipse phase warnings
  if (round === 48) {
    addAlert('weather-effect', `🌑 PEAK ECLIPSE PHASE: Maximum entity enhancement and equipment interference!`, round);
  }
};

// Utility functions for weather alerts
export const getWeatherAlertType = (weatherType, effectType) => {
  const alertTypes = {
    'rainy': {
      'effect': 'rain-effect',
      'mechanics': 'rain-mechanics'
    },
    'stormy': {
      'effect': 'storm-effect', 
      'mechanics': 'storm-mechanics'
    },
    'foggy': {
      'effect': 'fog-effect',
      'mechanics': 'fog-mechanics'
    },
    'flooded': {
      'effect': 'flood-effect',
      'mechanics': 'flood-mechanics'
    },
    'eclipsed': {
      'effect': 'eclipse-effect',
      'mechanics': 'eclipse-mechanics'
    }
  };
  
  return alertTypes[weatherType]?.[effectType] || 'weather-general';
};

// Weather progression predictions
export const predictNextWeatherEvent = (weatherType, currentRound) => {
  switch (weatherType) {
    case 'rainy':
      // FIXED: Next quicksand spawns every 12 rounds
      const nextQuicksandRound = Math.ceil((currentRound + 1) / 12) * 12;
      return {
        event: 'New quicksand formation',
        round: nextQuicksandRound,
        description: `Additional quicksand puddle will spawn at Round ${nextQuicksandRound}`
      };
      
    case 'stormy':
      // FIXED: Consistent storm phase timing
      const phase = currentRound <= 30 ? 1 : currentRound <= 46 ? 2 : currentRound <= 62 ? 3 : 4;
      const interval = phase === 1 ? 16 : phase === 2 ? 12 : phase === 3 ? 8 : 6;
      const nextLightning = Math.ceil((currentRound + 1) / interval) * interval;
      
      // Handle phase transitions
      if (currentRound < 31) {
        return {
          event: currentRound < 16 ? 'First lightning strike' : 'Lightning strike',
          round: Math.min(nextLightning, 31),
          description: currentRound < 31 && nextLightning > 30 ? 
            'Storm Phase 2 begins (lightning every 12 rounds)' : 
            `Phase ${phase} lightning (entire grid exposed)`
        };
      } else if (currentRound < 47) {
        return {
          event: nextLightning > 46 ? 'Storm Phase 3 begins' : 'Lightning strike',
          round: Math.min(nextLightning, 47),
          description: nextLightning > 46 ? 
            'Storm Phase 3 begins (lightning every 8 rounds)' : 
            `Phase ${phase} lightning (entire grid exposed)`
        };
      } else if (currentRound < 63) {
        return {
          event: nextLightning > 62 ? 'Storm Phase 4 begins' : 'Lightning strike',
          round: Math.min(nextLightning, 63),
          description: nextLightning > 62 ? 
            'Storm Phase 4 begins (lightning every 6 rounds, multiple strikes)' : 
            `Phase ${phase} lightning (entire grid exposed)`
        };
      } else {
        return {
          event: 'Lightning strike',
          round: nextLightning,
          description: `Phase ${phase} lightning (multiple strikes possible)`
        };
      }
      
    case 'foggy':
      return {
        event: 'Fog level change',
        round: currentRound + 1,
        description: '45% thicker, 15% same, 40% thinner'
      };
      
    case 'flooded':
      // FIXED: Consistent 20-round flood progression
      const nextFloodExpansion = Math.ceil((currentRound + 1) / 20) * 20;
      const nextLevel = Math.floor(nextFloodExpansion / 20) + 1;
      const levelNames = ['', 'ankle-deep', 'knee-deep', 'waist-deep', 'chest-deep', 'neck-deep', 'drowning depth'];
      
      return {
        event: 'Flood expansion',
        round: nextFloodExpansion,
        description: `Water level rises to ${levelNames[nextLevel] || 'maximum depth'}`
      };
      
    case 'eclipsed':
      // FIXED: Consistent 16-round eclipse enhancement
      const nextIntensity = Math.ceil((currentRound + 1) / 16) * 16;
      const intensityLevel = Math.floor(nextIntensity / 16) + 1;
      return {
        event: 'Eclipse intensity increase',
        round: nextIntensity,
        description: `All entities gain +${intensityLevel} power boost (cumulative)`
      };
      
    default:
      return null;
  }
};