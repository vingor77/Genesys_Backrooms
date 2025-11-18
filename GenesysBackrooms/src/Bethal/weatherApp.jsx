import React, { useState, useEffect, useMemo } from 'react';
import { 
  GRID_SIZE,
  getShipPosition,
  getFacilityPosition,
  HEIGHT_MAPS,
  moons
} from './moonData.jsx';
import { weatherData } from './weatherData.jsx';
import { 
  generateDailyWeatherForAllMoons, 
  roundToTime
} from './weatherHelpers.jsx';
import { getEntityPowerLevel } from './entityPowerSystem.jsx';
import PlayerManager from './playerManager.jsx';
import TacticalGrid from './tacticalGrid.jsx';
import NewInteriorGrid from './interiorGrid.jsx';
import WeatherForecast from './WeatherForecast.jsx';
import MissionControl from './MissionControl.jsx';
import MissionAlerts from './MissionAlerts.jsx';
import WeatherMechanics from './WeatherMechanics.jsx';
import { useEntityManager } from './entityManager.jsx';
import EntityEncounterPanel from './entityEncounterPanel.jsx';
import { getEntityByName } from './entityData.jsx';
import { weapons, suits, baseStore } from './shop.jsx';
import ShipSystems from './shipSystems.jsx';
import ShipInventory from './ShipInventory.jsx';
import { RageManagementPanel, useRageSystem } from './rageSystem.jsx';

const WeatherApp = () => {
  const [selectedMoon, setSelectedMoon] = useState('');
  const [currentWeatherType, setCurrentWeatherType] = useState('');
  const [gameStarted, setGameStarted] = useState(false);
  const [currentRound, setCurrentRound] = useState(0);
  const [alerts, setAlerts] = useState([]);
  const [players, setPlayers] = useState(() => {
    const savedPlayers = localStorage.getItem('lethalCompanyPlayers');
    return savedPlayers ? JSON.parse(savedPlayers) : [];
  });
  const [playerPosition, setPlayerPosition] = useState({ x: 0, y: 0 });
  const [selectedCell, setSelectedCell] = useState(null);
  const [quicksandLocations, setQuicksandLocations] = useState([]);
  const [eclipseEntities, setEclipseEntities] = useState([]);
  const [eclipseStress, setEclipseStress] = useState(0);
  const [equipmentMalfunctions, setEquipmentMalfunctions] = useState([]);
  const [currentFogLevel, setCurrentFogLevel] = useState(0);
  const [lightningStrikes, setLightningStrikes] = useState([]);
  const [floodedCells, setFloodedCells] = useState(new Set());
  const [floodLevel, setFloodLevel] = useState(0);
  const [dailyWeather, setDailyWeather] = useState({});
  const [currentDay, setCurrentDay] = (localStorage.getItem("currentDay") && localStorage.getItem("currentDay") !== "") ? useState(parseInt(localStorage.getItem("currentDay"))) : useState(1);
  const [currentQuota, setCurrentQuota] = (localStorage.getItem("currentQuota") && localStorage.getItem("currentQuota") !== "") ? useState(parseInt(localStorage.getItem("currentQuota"))) : useState(130);
  const [daysUntilDeadline, setDaysUntilDeadline] = (localStorage.getItem("deadline") && localStorage.getItem("deadline") !== "") ? useState(parseInt(localStorage.getItem("deadline"))) : useState(3);
  const [quotasFulfilled, setQuotasFulfilled] = (localStorage.getItem("quotasFulfilled") && localStorage.getItem("quotasFulfilled") !== "") ? useState(parseInt(localStorage.getItem("quotasFulfilled"))) : useState(0);
  const entities = useEntityManager();
  const indoorEntities = entities.getEntitiesByType('indoor');
  const outdoorEntities = entities.getEntitiesByType('outdoor');
  const daytimeEntities = entities.getEntitiesByType('daytime');
  const [pendingPlacementAlerts, setPendingPlacementAlerts] = useState(new Map());
  const [selectedEntityForEncounter, setSelectedEntityForEncounter] = useState(null);
  const [buildingData, setBuildingData] = useState(null); // For interior grid data
  const [currentFloor, setCurrentFloor] = useState(0);   // Current floor in interior
  const [entityHealthStates, setEntityHealthStates] = useState(new Map());
  const [exteriorEntityData, setExteriorEntityData] = useState(new Map());
  const [lastSpawnFloor, setLastSpawnFloor] = useState(null); 
  const [showWeatherForecast, setShowWeatherForecast] = useState(true);
  const [activeMainTab, setActiveMainTab] = useState('players');
  const rageSystem = useRageSystem();

  // Helper Functions
  const getCurrentMoonWeather = () => {
    if (!selectedMoon) return '';
    return dailyWeather[selectedMoon] || '';
  };

  useEffect(() => {
    localStorage.setItem('lethalCompanyPlayers', JSON.stringify(players));
  }, [players]);

  let alertIdCounter = 0;

  // Updated addAlert function that returns the alert ID
  const addAlert = (type, message, round, alertId = null) => {
    const uniqueId = alertId || `${Date.now()}-${++alertIdCounter}-${Math.random().toString(36).substr(2, 9)}`;

    const newAlert = {
      id: uniqueId,
      type,
      message,
      round,
      time: roundToTime(round),
      timestamp: new Date()
    };

    setAlerts(prev => [newAlert, ...prev].slice(0, 50));
    return uniqueId; // Return the ID so we can update it later
  };

  // Function to update an existing alert
  const updateAlert = (alertId, newMessage) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId 
        ? { ...alert, message: newMessage }
        : alert
    ));
  };

  // Helper function to determine if it's nighttime based on moon-specific data
  const isNighttimeForMoon = (currentRound, moonName) => {
    const moon = moons.find(m => m.name === moonName);
    if (!moon || !moon.nighttimeStart) return false;
    
    const timeOfDay = roundToTime(currentRound);
    const [hours, minutes] = timeOfDay.split(':').map(Number);
    
    // Parse moon's nighttime start time
    const nighttimeStr = moon.nighttimeStart;
    let nightHour, nightMinute = 0;
    
    if (nighttimeStr.includes(':')) {
      const parts = nighttimeStr.split(':');
      nightHour = parseInt(parts[0]);
      nightMinute = parseInt(parts[1].replace(/[^\d]/g, ''));
    } else {
      nightHour = parseInt(nighttimeStr.replace(/[^\d]/g, ''));
    }

    // Handle AM/PM conversion
    if (nighttimeStr.includes('PM') && nightHour !== 12) {
      nightHour += 12;
    } else if (nighttimeStr.includes('AM') && nightHour === 12) {
      nightHour = 0;
    }

    // Convert to minutes for comparison
    const currentTimeMinutes = hours * 60 + minutes;
    const nightStartMinutes = nightHour * 60 + nightMinute;

    // Nighttime is from nighttimeStart until 6 AM (360 minutes)
    const isNight = currentTimeMinutes >= nightStartMinutes || currentTimeMinutes < 360;

    return isNight;
  };

  // SIMPLIFIED: Main component entity spawning - much cleaner now
  const handleEntitySpawning = (round) => {
    if (!selectedMoon || !gameStarted) {
      return;
    }

    const moon = moons.find(m => m.name === selectedMoon);
    if (!moon) {
      return;
    }

    // Only spawn entities every 6 rounds starting from round 6
    if (round % 6 !== 0 || round < 6) {
      return;
    }

    const isNighttime = currentWeatherType === 'eclipsed' ? true : isNighttimeForMoon(round, selectedMoon);
    const isDaytime = !isNighttime;

    // Determine spawn type based on time
    let spawnType;
    if (isDaytime) {
      const rand = Math.random();
      spawnType = rand < 0.6 ? 'indoor' : 'daytime';
    } else {
      const rand = Math.random();
      spawnType = rand < 0.6 ? 'outdoor' : rand < 0.9 ? 'indoor' : 'daytime';
    }

    if (round < 13) spawnType = 'indoor';

    // Handle indoor spawning with floor balancing logic
    if (spawnType === 'indoor') {
      // Check if we have building data to determine available floors
      const availableFloors = buildingData?.floors ? Object.keys(buildingData.floors).map(Number) : [0];

      if (availableFloors.length === 0) {
        addAlert('spawn-error', `❌ No floors available for entity spawning`, round);
        return;
      }

      // Count entities on each floor
      const floorEntityCounts = {};
      availableFloors.forEach(floor => {
        floorEntityCounts[floor] = 0;
      });

      // Count existing entities on each floor
      if (buildingData?.floors) {
        Object.entries(buildingData.floors).forEach(([floorNum, layout]) => {
          const floor = parseInt(floorNum);
          if (floorEntityCounts.hasOwnProperty(floor)) {
            Object.values(layout).forEach(cell => {
              if (cell.entity && !cell.entity.defeated) {
                floorEntityCounts[floor]++;
              }
            });
          }
        });
      }

      // Find the minimum entity count
      const minEntityCount = Math.min(...Object.values(floorEntityCounts));

      // Get all floors that have the minimum entity count
      const floorsWithMinEntities = availableFloors.filter(floor => 
        floorEntityCounts[floor] === minEntityCount
      );

      // Apply "no same floor twice in a row" rule if possible
      let targetFloor = null;
      const viableFloors = floorsWithMinEntities.filter(floor => floor !== lastSpawnFloor);

      if (viableFloors.length > 0) {
        // Choose randomly from floors with minimum entities (excluding last spawn floor)
        targetFloor = viableFloors[Math.floor(Math.random() * viableFloors.length)];
      } else {
        // If all minimum floors are the same as last spawn, pick any minimum floor
        targetFloor = floorsWithMinEntities[Math.floor(Math.random() * floorsWithMinEntities.length)];
      }

      // Update last spawn floor
      setLastSpawnFloor(targetFloor);

      // Create entity count summary for alert
      const floorSummary = availableFloors.map(floor => 
        `Floor ${floor}: ${floorEntityCounts[floor]} entities`
      ).join(', ');

      addAlert('entity-spawn', 
        `🎯 FLOOR BALANCING: Targeting Floor ${targetFloor} (${floorEntityCounts[targetFloor]} entities). Current: ${floorSummary}`, 
        round
      );

      // Try to spawn the entity using entity manager with the specific floor
      const newEntity = entities.spawnEntity(
        spawnType, 
        selectedMoon, 
        'Interior', 
        round,
        { preferredFloor: targetFloor, addAlert }
      );

      if (newEntity) {
        const timeContext = isNighttime ? '🌙' : '☀️';

        // Create a pending alert that will be updated with room info
        const alertId = addAlert('entity-spawn', 
          `${timeContext} 👹 ${newEntity.name} detected inside facility (Power: ${newEntity.powerLevel}) - Locating on Floor ${targetFloor}...`, 
          round
        );

        // Store the pending alert for when placement happens
        setPendingPlacementAlerts(prev => new Map(prev.set(newEntity.id, {
          alertId,
          entityName: newEntity.name,
          powerLevel: newEntity.powerLevel,
          timeContext,
          round
        })));

        return;
      }
    }

    // Handle non-indoor spawning (existing logic)
    let spawnLocation = '';
    let alertLocation = '';
    switch (spawnType) {
      case 'outdoor':
        spawnLocation = 'Exterior';
        alertLocation = 'outside the facility';
        break;
      case 'daytime':
        spawnLocation = 'Exterior';
        alertLocation = 'in the surrounding area';
        break;
    }

    // Check if entity manager exists and has spawnEntity method
    if (!entities || typeof entities.spawnEntity !== 'function') {
      addAlert('spawn-error', `❌ Entity spawning system not available`, round);
      return;
    }

    // Try to spawn the entity using entity manager
    const newEntity = entities.spawnEntity(
      spawnType, 
      selectedMoon, 
      spawnLocation, 
      round,
      { addAlert }
    );

    if (newEntity) {
      const timeContext = isNighttime ? '🌙' : '☀️';
      addAlert('entity-spawn', 
        `${timeContext} 👹 ${newEntity.name} detected ${alertLocation} (Power: ${newEntity.powerLevel})`, 
        round
      );
      return;
    }

    // Enhanced fallback spawning with better debugging
    let alternativeTypes = [];
    if (isDaytime) {
      alternativeTypes = spawnType === 'indoor' ? ['daytime'] : ['indoor'];
    } else {
      alternativeTypes = spawnType === 'indoor' ? ['outdoor'] : ['indoor'];
    }

    for (const altType of alternativeTypes) {
      let altSpawnLocation = '';
      let altAlertLocation = '';

      switch (altType) {
        case 'indoor':
          altSpawnLocation = 'Interior';
          altAlertLocation = 'inside the facility';
          break;
        case 'outdoor':
          altSpawnLocation = 'Exterior';
          altAlertLocation = 'outside the facility';
          break;
        case 'daytime':
          altSpawnLocation = 'Exterior';
          altAlertLocation = 'in the surrounding area';
          break;
      }

      const altEntity = entities.spawnEntity(
        altType, 
        selectedMoon, 
        altSpawnLocation, 
        round,
        { addAlert }
      );

      if (altEntity) {
        const timeContext = isNighttime ? '🌙 NIGHTTIME' : '☀️ DAYTIME';

        if (altType === 'indoor') {
          // Handle indoor fallback with pending alert
          const alertId = addAlert('entity-spawn', 
            `${timeContext} 👹 FALLBACK: ${altEntity.name} detected ${altAlertLocation} (Power: ${altEntity.powerLevel}) - Locating...`, 
            round
          );

          setPendingPlacementAlerts(prev => new Map(prev.set(altEntity.id, {
            alertId,
            entityName: altEntity.name,
            powerLevel: altEntity.powerLevel,
            timeContext: `${timeContext} FALLBACK:`,
            round
          })));
        } else {
          // Regular fallback alert
          addAlert('entity-spawn', 
            `${timeContext} 👹 FALLBACK: ${altEntity.name} detected ${altAlertLocation} (Power: ${altEntity.powerLevel})`, 
            round
          );
        }
        return;
      }
    }

    addAlert('spawn-failed', 
      `💀 CRITICAL: Cannot spawn any entity type - Round ${round}! Check power limits.`, 
      round
    );
  };

  // Simplified entity defeat handler
  const handleEntityDefeat = (entityData) => {
    const entity = entities.removeEntity(entityData.id);
    if (entity) {
      const powerFreed = getEntityPowerLevel(entity.name);
      addAlert('entity-defeat', 
        `💀 ${entity.name} defeated! Power freed: ${powerFreed}`, 
        currentRound
      );
    }
  };

  const handleEntityPlacement = (placementInfo) => {
    const pendingAlert = pendingPlacementAlerts.get(placementInfo.entityId);

    if (pendingAlert) {
      // Update the alert with the actual room location
      const updatedMessage = `${pendingAlert.timeContext} 👹 ${pendingAlert.entityName} detected in ${placementInfo.displayName} (Power: ${pendingAlert.powerLevel})`;
      updateAlert(pendingAlert.alertId, updatedMessage);

      // Remove from pending alerts
      setPendingPlacementAlerts(prev => {
        const newMap = new Map(prev);
        newMap.delete(placementInfo.entityId);
        return newMap;
      });
    }
  };

  // Initialize daily weather on component mount or day advance
  useEffect(() => {
    if (Object.keys(dailyWeather).length === 0) {
      const newWeather = generateDailyWeatherForAllMoons();
      setDailyWeather(newWeather);
    }
  }, [currentDay, dailyWeather]);

  // Event Handlers
  const handleMoonChange = (moonName) => {
    if (gameStarted) return;
    
    setSelectedMoon(moonName);
    
    // Reset weather-specific state
    setQuicksandLocations([]);
    setEclipseEntities([]);
    setEclipseStress(0);
    setEquipmentMalfunctions([]);
    setCurrentFogLevel(0);
    
    // Clear all entities from entity manager
    entities.clear();
  };

  const startGame = () => {
    const moonWeather = getCurrentMoonWeather();
    if (!moonWeather) {
      addAlert('game', `⚠️ No weather data available for ${selectedMoon}. Try advancing the day first.`, 0);
      return;
    }
  
    setGameStarted(true);
    setCurrentRound(0);
    setCurrentWeatherType(moonWeather);
  
    // CLEAR ALL WEATHER STATE - Let handleWeatherEffects manage everything
    setQuicksandLocations([]);
    setEclipseEntities([]);
    setEclipseStress(0);
    setEquipmentMalfunctions([]);
    setCurrentFogLevel(0);
    setLightningStrikes([]);
    setFloodedCells(new Set());
    setFloodLevel(0);
  
    addAlert('game', `Mission started on ${selectedMoon} with ${weatherData[moonWeather]?.name || moonWeather} conditions.`, 0);
    
    // TRIGGER ROUND 0 WEATHER EFFECTS after state settles
    setTimeout(() => {
      handleWeatherEffects(0);
    }, 100);
  };

  const nextRound = () => {
    const newRound = currentRound + 1;
    
    setCurrentRound(newRound);
    
    // Handle weather effects FIRST
    handleWeatherEffects(newRound);
    
    // Handle entity spawning
    handleEntitySpawning(newRound);
  };

  // FIXED: Storm effects function - consistent with 4-phase system
  const handleStormEffects = (round) => {
    // Determine current storm phase
    const getStormPhase = (round) => {
      if (round <= 30) return 1;
      if (round <= 46) return 2;
      if (round <= 62) return 3;
      return 4;
    };

    const currentPhase = getStormPhase(round);

    // Check for phase transitions
    if (round === 31) {
      addAlert('weather-effect', `⚡ STORM INTENSIFYING: Phase 2 - Lightning every 12 rounds, entire grid exposed!`, round);
      addAlert('weather-mechanics', `⚡ LIGHTNING PHASE 2: Vigilance vs 1 Difficulty to detect sparking. 12 wounds + Crit (+50) direct hit.`, round);
    } else if (round === 47) {
      addAlert('weather-effect', `⚡ SEVERE STORM: Phase 3 - Lightning every 8 rounds!`, round);
      addAlert('weather-mechanics', `⚡ LIGHTNING PHASE 3: Equipment malfunction chance increases to 25%.`, round);
    } else if (round === 63) {
      addAlert('weather-effect', `⚡ PEAK STORM: Phase 4 - Lightning every 6 rounds, multiple strikes possible!`, round);
      addAlert('weather-mechanics', `⚡ LIGHTNING PHASE 4: Maximum danger - 30% equipment malfunction, multiple simultaneous strikes.`, round);
    }

    // Lightning strikes based on phase - ENTIRE GRID AT RISK
    let shouldStrike = false;
    let strikeFrequency = 16;

    if (currentPhase === 1 && round % 16 === 0 && round > 0) {
      shouldStrike = true;
      strikeFrequency = 16;
    } else if (currentPhase === 2 && round % 12 === 0 && round > 30) {
      shouldStrike = true;
      strikeFrequency = 12;
    } else if (currentPhase === 3 && round % 8 === 0 && round > 46) {
      shouldStrike = true;
      strikeFrequency = 8;
    } else if (currentPhase === 4 && round % 6 === 0 && round > 62) {
      shouldStrike = true;
      strikeFrequency = 6;
    }

    if (shouldStrike) {
      const strikeCount = currentPhase >= 4 ? Math.floor(Math.random() * 3) + 1 : 1;

      for (let i = 0; i < strikeCount; i++) {
        const targetX = Math.floor(Math.random() * GRID_SIZE);
        const targetY = Math.floor(Math.random() * GRID_SIZE);

        // Add to lightning strikes tracking
        setLightningStrikes(prev => [...prev, {
          id: `lightning_${Date.now()}_${i}`,
          x: targetX,
          y: targetY,
          round: round,
          phase: currentPhase
        }]);

        // Check if lightning hits players
        const playersAtLocation = players.filter(p => 
          p.position?.currentArea === 'exterior' &&
          p.position.exterior.x === targetX &&
          p.position.exterior.y === targetY
        );

        if (playersAtLocation.length > 0) {
          const playerNames = playersAtLocation.map(p => p.name).join(', ');
          addAlert('weather-emergency', `⚡ LIGHTNING STRIKE: Direct hit on ${playerNames} at (${targetX}, ${targetY})! 12 wounds + Critical Injury!`, round);
        } else {
          addAlert('weather-effect', `⚡ Lightning struck grid (${targetX}, ${targetY})! Phase ${currentPhase} intensity. Area unsafe for 2 rounds.`, round);
        }
      }

      if (strikeCount > 1) {
        addAlert('weather-effect', `🌩️ MULTIPLE LIGHTNING STRIKES: ${strikeCount} simultaneous hits in Phase ${currentPhase}!`, round);
      }

      // Clean up old lightning strikes (remove strikes older than 2 rounds)
      setLightningStrikes(prev => prev.filter(strike => round - strike.round <= 2));
    }

    // Equipment malfunction checks
    const malfunctionRate = currentPhase === 1 ? 0.15 : currentPhase === 2 ? 0.20 : currentPhase === 3 ? 0.25 : 0.30;

    if (Math.random() < malfunctionRate) {
      const equipment = ['Flashlight', 'Radio', 'Radar Booster', 'Apparatus', 'Zap Gun'];
      const malfunctionedEquipment = equipment[Math.floor(Math.random() * equipment.length)];
      addAlert('weather-effect', `⚡ EQUIPMENT MALFUNCTION: ${malfunctionedEquipment} affected by Phase ${currentPhase} storm interference!`, round);
      addAlert('weather-mechanics', `🔧 REPAIR NEEDED: Mechanics (Intellect) vs 2 Difficulty. Failure = 1d5 rounds (minor) or 2d10 rounds (major) downtime.`, round);
    }

    // Metal charge buildup warnings every 4 rounds
    if (round > 0 && round % 4 === 0) {
      addAlert('weather-mechanics', `⚡ METAL CHARGE BUILDUP: Check equipment for electrical charge. Level 3 = automatic lightning strike next round!`, round);
    }
  };

  const handleWeatherEffects = (round) => {
    if (!currentWeatherType || currentWeatherType === 'clear') {
      return;
    }

    switch (currentWeatherType) {
      case 'rainy':

        if (round === 0) {
          // FIXED: Initial quicksand spawn at round 0

          const xLoc = Math.floor(Math.random() * 14);
          const yLoc = Math.floor(Math.random() * 14);

          const initialQuicksand = [];
          const shipPos = { x: xLoc, y: yLoc };
          const facilityPos = selectedMoon ? getFacilityPosition(selectedMoon) : { x: 0, y: 0 };

          for (let i = 0; i < 3; i++) {
            let attempts = 0;
            let placed = false;

            while (!placed && attempts < 20) {
              const x = Math.floor(Math.random() * GRID_SIZE);
              const y = Math.floor(Math.random() * GRID_SIZE);

              const isShip = (x === shipPos.x && y === shipPos.y);
              const isFacility = (x === facilityPos.x && y === facilityPos.y);
              const hasQuicksand = initialQuicksand.some(loc => loc.x === x && loc.y === y);

              if (!isShip && !isFacility && !hasQuicksand) {
                const quicksandObj = {
                  id: `quicksand_initial_${i}`,
                  x, y,
                  round: 0,
                  gridRef: `(${x}, ${y})`
                };
                initialQuicksand.push(quicksandObj);
                placed = true;
              }
              attempts++;
            }
          }
          setQuicksandLocations(initialQuicksand);

          addAlert('weather-effect', `🌧️ Rain storm begins! ${initialQuicksand.length} quicksand puddles formed: ${initialQuicksand.map(q => q.gridRef).join(', ')}`, round);
          addAlert('weather-mechanics', `⚠️ RAIN EFFECTS: +1 Setback to outdoor Athletics/Coordination, +1 Setback to Perception beyond Medium range`, round);

        } else if (round > 0 && round % 12 === 0) {
          const shipPos = selectedMoon ? getShipPosition(selectedMoon) : { x: 6, y: 6 };
          const facilityPos = selectedMoon ? getFacilityPosition(selectedMoon) : { x: 0, y: 0 };

          let attempts = 0;
          let placed = false;

          while (!placed && attempts < 10) {
            const x = Math.floor(Math.random() * GRID_SIZE);
            const y = Math.floor(Math.random() * GRID_SIZE);

            const isShip = (x === shipPos.x && y === shipPos.y);
            const isFacility = (x === facilityPos.x && y === facilityPos.y);
            const hasQuicksand = quicksandLocations.some(loc => loc.x === x && loc.y === y);

            if (!isShip && !isFacility && !hasQuicksand) {
              const newQuicksand = {
                id: `quicksand_${Date.now()}_${round}`,
                x, y,
                round,
                gridRef: `(${x}, ${y})`
              };

              setQuicksandLocations(prev => {
                const updated = [...prev, newQuicksand];
                return updated;
              });

              addAlert('weather-effect', `🌧️ NEW QUICKSAND: Puddle formed at ${newQuicksand.gridRef} due to heavy rain! Total: ${quicksandLocations.length + 1}`, round);
              addAlert('weather-mechanics', `🕳️ QUICKSAND ESCAPE: Athletics (Brawn) vs 3 Difficulty. Failure = sink deeper. Round 4+ = drowning (4 wounds/round)`, round);
              placed = true;
            }
            attempts++;
          }

          if (!placed) {
            addAlert('weather-effect', `🌧️ Rain continues but no new quicksand could form (grid full)`, round);
          }
        }
        break;

      case 'stormy':
        handleStormEffects(round);
        break;

      case 'foggy':
        if (round === 0) {
          setCurrentFogLevel(2);
          addAlert('weather-effect', `🌫️ Fog rolls in at level 2 (Moderate)! Visibility reduced to Short range.`, round);
          addAlert('weather-mechanics', `🌫️ FOG EFFECTS: +2 Setback to Perception, communication range reduced. Fog changes each round.`, round);
        } else {
          const change = Math.random();
          let newFogLevel = currentFogLevel || 2;

          if (change < 0.45) {
            newFogLevel = Math.min(5, newFogLevel + 1);
          } else if (change < 0.60) {
            // 15% chance to stay the same
          } else {
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
        break;

        case 'flooded':
          // FIXED: Start flooding at round 20, then every 20 rounds after (20, 40, 60, 80...)
          if (round >= 20 && (round - 20) % 20 === 0) {
            const floodPhase = Math.floor((round - 20) / 20) + 1; // Phase 1 at round 20, Phase 2 at round 40, etc.
            setFloodLevel(floodPhase);
          
            if (selectedMoon && HEIGHT_MAPS[selectedMoon]) {
              const heightMap = HEIGHT_MAPS[selectedMoon];
              const shipPos = selectedMoon ? getShipPosition(selectedMoon) : { x: 6, y: 6 };
              const facilityPos = selectedMoon ? getFacilityPosition(selectedMoon) : { x: 0, y: 0 };

              let newFloodedCells = new Set();
              let newCellsThisPhase = 0;

              if (floodPhase === 1) {
                // First, find all available heights on the map (excluding ship/facility)
                const availableHeights = new Set();
                const tilesByHeight = new Map(); // height -> array of {x, y} positions

                for (let y = 0; y < GRID_SIZE; y++) {
                  for (let x = 0; x < GRID_SIZE; x++) {
                    // Skip ship and facility
                    const isShip = (x === shipPos.x && y === shipPos.y);
                    const isFacility = (x === facilityPos.x && y === facilityPos.y);

                    if (!isShip && !isFacility) {
                      const cellHeight = heightMap[y][x];
                      availableHeights.add(cellHeight);

                      if (!tilesByHeight.has(cellHeight)) {
                        tilesByHeight.set(cellHeight, []);
                      }
                      tilesByHeight.get(cellHeight).push({ x, y });
                    }
                  }
                }

                // Find the lowest available height
                const lowestHeight = Math.min(...Array.from(availableHeights));

                // Get all tiles at the lowest height
                const targetTiles = tilesByHeight.get(lowestHeight) || [];

                // 25% chance for each tile at the lowest height to flood
                targetTiles.forEach(({ x, y }) => {
                  if (Math.random() < 0.25) {
                    const cellKey = `${x},${y}`;
                    newFloodedCells.add(cellKey);
                    newCellsThisPhase++;
                  }
                });

                // Update alert to show which height was targeted
                if (newCellsThisPhase === 0) {
                  addAlert('weather-effect', `🌊 FLOOD START: No initial flooding occurred (all height-${lowestHeight} tiles stayed dry by chance)`, round);
                } else {
                  addAlert('weather-effect', `🌊 FLOOD BEGINS: ${newCellsThisPhase} height-${lowestHeight} areas flooded! Started at lowest available elevation.`, round);
                  addAlert('weather-mechanics', `🌊 INITIAL FLOODING: Shallow puddles in lowest areas. +1 Setback to movement through water.`, round);
                }

              } else {
                // Start with previously flooded cells
                newFloodedCells = new Set(Array.from(floodedCells));

                // Find all tiles adjacent to currently flooded areas
                const adjacentCandidates = new Set();

                floodedCells.forEach(cellKey => {
                  const [x, y] = cellKey.split(',').map(Number);

                  // Check 8 adjacent cells (including diagonals)
                  const directions = [
                    [-1, -1], [-1, 0], [-1, 1],
                    [0, -1],           [0, 1],
                    [1, -1],  [1, 0],  [1, 1]
                  ];

                  directions.forEach(([dx, dy]) => {
                    const newX = x + dx;
                    const newY = y + dy;

                    // Check bounds
                    if (newX >= 0 && newX < GRID_SIZE && newY >= 0 && newY < GRID_SIZE) {
                      const newCellKey = `${newX},${newY}`;

                      // Skip if already flooded
                      if (newFloodedCells.has(newCellKey)) return;

                      // Skip ship and facility
                      const isShip = (newX === shipPos.x && newY === shipPos.y);
                      const isFacility = (newX === facilityPos.x && newY === facilityPos.y);
                      if (isShip || isFacility) return;

                      // Add to candidates
                      adjacentCandidates.add(newCellKey);
                    }
                  });
                });

                // For each adjacent tile, 50% chance to flood
                adjacentCandidates.forEach(cellKey => {
                  if (Math.random() < 0.50) {
                    newFloodedCells.add(cellKey);
                    newCellsThisPhase++;
                    const [x, y] = cellKey.split(',').map(Number);
                    const height = heightMap[y][x];
                  }
                });
              
                // Generate spread alerts
                if (newCellsThisPhase === 0) {
                  addAlert('weather-effect', `🌊 FLOOD CONTAINED: No new areas flooded this phase (flood spread blocked)`, round);
                } else {
                  addAlert('weather-effect', `🌊 FLOOD SPREADS: ${newCellsThisPhase} adjacent areas flooded! Water continues expanding.`, round);
                }

                // Phase-specific mechanics alerts
                if (floodPhase === 2) {
                  addAlert('weather-mechanics', `🌊 SPREADING FLOOD: Ankle-deep water. +1-2 Setback to Athletics in water areas.`, round);
                } else if (floodPhase === 3) {
                  addAlert('weather-mechanics', `🌊 DEEPENING WATER: Knee-deep flooding. +2-3 Setback, limited movement in flooded zones.`, round);
                } else if (floodPhase >= 4) {
                  addAlert('weather-emergency', `🚨 DANGEROUS FLOODING: Waist-deep+ water! Swimming checks required in many areas.`, round);
                  addAlert('weather-mechanics', `🏊 DEEP WATER: Athletics (Brawn) vs 2-3 Difficulty for movement. High drowning risk.`, round);
                }
              }

              // CRITICAL: Set the new flooded state
              setFloodedCells(newFloodedCells);

              const totalFlooded = newFloodedCells.size;
              const percentFlooded = Math.round((totalFlooded / (GRID_SIZE * GRID_SIZE)) * 100);

              // Probability explanation alerts
              if (floodPhase === 1) {
                addAlert('weather-effect', `🎲 Random flooding: Each lowest-elevation tile had a 25% chance to flood initially.`, round);
              } else if (totalFlooded > 0) {
                const adjacentTileCount = adjacentCandidates ? adjacentCandidates.size : 0;
                addAlert('weather-effect', `🎲 Spread mechanics: ${adjacentTileCount} tiles adjacent to water each had 50% flood chance.`, round);
              }

            } else {
              addAlert('weather-effect', `🌊 Flood effects cannot be calculated (no height map for ${selectedMoon})`, round);
            }
          }
          break;

      case 'eclipsed':
        if (round % 16 === 0) {
          const eclipseIntensity = Math.floor(round / 16) + 1;
          const totalOutdoorEntities = outdoorEntities.length + daytimeEntities.length;

          if (totalOutdoorEntities > 0) {
            addAlert('weather-effect', `🌑 Eclipse energy intensifies! All ${totalOutdoorEntities} entities gain +${eclipseIntensity} power boost!`, round);
            addAlert('weather-mechanics', `👹 ECLIPSE ENHANCEMENT: Existing entities boosted by Intensity ${eclipseIntensity}. Fear check when encountering enhanced entities.`, round);
          } else if (round === 0) {
            addAlert('weather-effect', `🌑 Solar eclipse begins! Entities will be empowered by eclipse energy when they spawn.`, round);
            addAlert('weather-mechanics', `🌑 ECLIPSE EFFECTS: 1 strain/round outside (0.5 with ally), Fear check vs 2 Difficulty at start and when seeing entities.`, round);
          }
        }

        if (round > 0) {
          const playersOutside = players.filter(p => 
            p.position?.currentArea === 'exterior' && 
            p.status !== 'incapacitated'
          ).length;

          if (playersOutside > 0) {
            setEclipseStress(prev => prev + playersOutside);
            addAlert('weather-effect', `😰 ${playersOutside} player(s) gained 1 strain from eclipse exposure.`, round);
          }
        }

        const eclipsePhase = Math.floor(round / 16) + 1;
        const interferenceChance = eclipsePhase === 1 ? 0.10 : eclipsePhase === 2 ? 0.15 : eclipsePhase === 3 ? 0.20 : 0.25;
        if (Math.random() < interferenceChance) {
          addAlert('weather-effect', `📱 Equipment interference from eclipse energy! Intensity ${eclipsePhase} effects.`, round);
          addAlert('weather-mechanics', `📱 EQUIPMENT INTERFERENCE: Flashlights flicker, radios static. Repair: Mechanics vs 2-3 Difficulty.`, round);
        }
        break;

      default:
        break;
    }
  };

  // Reset game function update
  const resetGame = () => {
    setGameStarted(false);
    setCurrentRound(0);
    setCurrentWeatherType('');
    setQuicksandLocations([]);
    setEclipseEntities([]);
    setEclipseStress(0);
    setEquipmentMalfunctions([]);
    setCurrentFogLevel(0);
    setPlayerPosition({ x: 0, y: 0 });
    setSelectedCell(null);
    setLightningStrikes([]);
    setFloodedCells(new Set());
    setFloodLevel(0);
    setBuildingData(null);
    setCurrentFloor(0);

    // Clear all entities from entity manager
    entities.clear();

    // Ensure weather data exists
    if (Object.keys(dailyWeather).length === 0) {
      const newWeather = generateDailyWeatherForAllMoons();
      setDailyWeather(newWeather);
    }

    // Clear alerts LAST to prevent any race conditions
    setTimeout(() => {
      setAlerts([]);
    }, 100);

    setPlayers(prev => prev.map(player => ({
      ...player,
      position: {
        interior: { x: null, y: null, floor: 0, room: null },
        exterior: { x: null, y: null, terrain: null },
        currentArea: 'exterior'
      }
    })));
  };

  const resetCampaign = () => {
    // Clear alerts first for campaign reset
    setAlerts([]);
    setGameStarted(false);
    setCurrentRound(0);
    setCurrentWeatherType('');
    setCurrentQuota(130);
    setDaysUntilDeadline(3);
    setQuotasFulfilled(0);
    setSelectedMoon('');
    setPlayers([]);
    setCurrentDay(1);
    setDailyWeather({});
    setQuicksandLocations([]);
    setEclipseEntities([]);
    setEclipseStress(0);
    setEquipmentMalfunctions([]);
    setCurrentFogLevel(0);
    setPlayerPosition({ x: 0, y: 0 });
    setSelectedCell(null);
    setLightningStrikes([]);
    setFloodedCells(new Set());
    setFloodLevel(0);
    setBuildingData(null);
    setCurrentFloor(0);
    setPlayers([]);
    setLastSpawnFloor(null);

    // Clear all entities from entity manager
    entities.clear();

    // Generate new weather data after a brief delay
    setTimeout(() => {
      const newWeather = generateDailyWeatherForAllMoons();
      setDailyWeather(newWeather);
      // Clear alerts again after weather generation to be extra sure
      setAlerts([]);
    }, 100);

    localStorage.removeItem("currentDay");
    localStorage.removeItem("currentQuota");
    localStorage.removeItem("deadline");
    localStorage.removeItem("quotasFulfilled");
    localStorage.removeItem("lethalCompanyPlayers");
    localStorage.removeItem("shipInventory");
    localStorage.removeItem("shipMoney");
    localStorage.removeItem("shipSystemStates");
  };

  const advanceDay = () => {
    const newDaysLeft = daysUntilDeadline - 1;
    let sellDay = false;

    if(newDaysLeft < 0) {
      setDaysUntilDeadline(3);
      setQuotasFulfilled(quotasFulfilled + 1);
      const tempFulfilled = quotasFulfilled + 1;
      setCurrentQuota(Math.round(currentQuota + (100 * (1 + (tempFulfilled * tempFulfilled) / 16))));
      sellDay = true;
    }
    else {
      setDaysUntilDeadline(newDaysLeft);
    }
    
    let newDay = currentDay;
    if(sellDay) {
      setCurrentDay(newDay);
    }
    else {
      newDay = currentDay + 1;
      setCurrentDay(newDay);
      const newWeather = generateDailyWeatherForAllMoons();
      setDailyWeather(newWeather);
    }

    resetGame();

    localStorage.setItem("currentDay", newDay);
    localStorage.setItem("currentQuota", newDaysLeft < 0 ? Math.round(currentQuota + (100 * (1 + ((quotasFulfilled + 1) * (quotasFulfilled + 1)) / 16))) : currentQuota);
    localStorage.setItem("deadline", newDaysLeft < 0 ? 3 : newDaysLeft);
    localStorage.setItem("quotasFulfilled", newDaysLeft < 0 ? quotasFulfilled + 1 : quotasFulfilled);
  };

  const handleEntityEncounter = (entity) => {
    // Get the full entity data by name
    const fullEntityData = getEntityByName(entity.name);

    // Create a unique key for this entity (prefer ID, fallback to name)
    const entityKey = entity.id || entity.name;

    if (fullEntityData) {
      // Merge saved health state with entity data
      const savedHealth = entityHealthStates.get(entityKey);
      const entityWithHealth = {
        ...fullEntityData,
        id: entityKey, // Ensure we have a consistent ID
        currentWounds: savedHealth?.currentWounds || 0,
        currentStrain: savedHealth?.currentStrain || 0
      };

      // Show the detailed encounter panel
      setSelectedEntityForEncounter(entityWithHealth);
    } else {
      // Fallback - show the basic entity data with saved health
      const savedHealth = entityHealthStates.get(entityKey);
      const entityWithHealth = {
        ...entity,
        id: entityKey, // Ensure we have a consistent ID
        currentWounds: savedHealth?.currentWounds || 0,
        currentStrain: savedHealth?.currentStrain || 0
      };
      setSelectedEntityForEncounter(entityWithHealth);
    }
  };

  const handleEntityHealthUpdate = (entityId, healthData) => {
    setEntityHealthStates(prev => {
      const newMap = new Map(prev);
      const existingHealth = newMap.get(entityId) || {};
      const updatedHealth = { ...existingHealth, ...healthData };
      newMap.set(entityId, updatedHealth);
      return newMap;
    });
  };

  // Add this function to close the encounter panel
  const closeEntityEncounter = () => {
    setSelectedEntityForEncounter(null);
  };

  const handleTrapTriggered = (trap) => {
    addAlert('trap', `🪤 Triggered ${trap.name} (${trap.danger} danger)!`, currentRound);
  };

  // Get current power status using entity manager
  const getCurrentPowerStatus = () => {
    return entities.getPowerStatus(selectedMoon);
  };

  const handlePlayerPositionChange = (playerId, area, x, y, additionalData) => {
    const player = players.find(p => p.id === playerId);
    
    if (!player) {
      return;
    }

    setPlayers(prev => {
     const updated = prev.map(p => {
       if (p.id === playerId) {
         const newPosition = { ...p.position };
         newPosition[area] = { 
           x, 
           y, 
           ...additionalData 
         };
         newPosition.currentArea = area;

         const updatedPlayer = { 
           ...p, 
           position: newPosition 
         };
         return updatedPlayer;
       }
       return p;
     });
     return updated;
    });

    // CHECK FOR ENTITY ENCOUNTERS - WORKS FOR BOTH INTERIOR AND EXTERIOR
    let entitiesAtLocation = [];

    if (area === 'interior') {
      // Check building data directly for entities at this exact position - EXISTING CODE
      if (buildingData && buildingData.floors && buildingData.floors[additionalData.floor]) {
        const cellKey = `${x},${y}`;
        const cell = buildingData.floors[additionalData.floor][cellKey];

        // Check if this cell has an entity
        if (cell && cell.entity && !cell.entity.defeated) {
          entitiesAtLocation.push(cell.entity);
        }
      }
    } else if (area === 'exterior') {
      // NEW: Check exterior entity data map (similar to interior approach)
      const cellKey = `${x},${y}`;
      const entityAtPosition = exteriorEntityData.get(cellKey);

      if (entityAtPosition && !entityAtPosition.defeated) {
        entitiesAtLocation.push(entityAtPosition);
      }
    }

    // IMMEDIATE POPUP ALERT for each entity encounter
    entitiesAtLocation.forEach(entity => {
      const encounterMessage = `🚨 ENTITY ENCOUNTER!\n\n${player.name} moved into ${entity.name}!\n\nLocation: ${area === 'interior' ? `${additionalData.room} (Floor ${additionalData.floor})` : `Exterior (${x},${y})`}\nTime: ${roundToTime(currentRound)}\n\nImmediate action required!`;

      // Browser alert popup - immediate and blocking
      alert(encounterMessage);

      // Also add to mission alerts
      addAlert('entity-encounter', 
        `🚨 ENTITY ENCOUNTER! ${player.name} moved into ${entity.name} at (${x},${y})! ⚠️`, 
        currentRound
      );

      // Trigger the entity encounter panel for detailed info
      handleEntityEncounter(entity);
    });

    // CHECK FOR TRAP ENCOUNTERS - WORKING VERSION (EXISTING CODE - DON'T CHANGE)
    if (area === 'interior' && buildingData) {
      const cellKey = `${x},${y}`;
      const cell = buildingData.floors[additionalData.floor]?.[cellKey];

      if (cell && cell.trap && 
          !cell.trap.triggered && 
          !cell.trap.cleared && 
          !cell.trap.disabled && 
          !cell.trap.removed &&
          cell.trap.active !== false) {
          
        const trapMessage = `🪤 TRAP TRIGGERED!\n\n${player.name} triggered ${cell.trap.name}!\n\nLocation: ${additionalData.room} (Floor ${additionalData.floor})\nDanger Level: ${cell.trap.danger}\nTime: ${roundToTime(currentRound)}\n\nRoll for effects immediately!`;
          
        alert(trapMessage);
          
        setBuildingData(prev => {
          const newData = { ...prev };
          if (newData.floors[additionalData.floor] && newData.floors[additionalData.floor][cellKey]) {
            newData.floors[additionalData.floor][cellKey] = {
              ...newData.floors[additionalData.floor][cellKey],
              trap: { 
                ...newData.floors[additionalData.floor][cellKey].trap, 
                triggered: true,
                triggeredBy: player.name,
                triggeredAt: currentRound
              }
            };
          }
          return newData;
        });

        addAlert('trap-encounter', 
          `🪤 TRAP TRIGGERED! ${player.name} triggered ${cell.trap.name} in ${additionalData.room}! ${cell.trap.danger} danger!`, 
          currentRound
        );

        handleTrapTriggered({
          ...cell.trap,
          triggeredBy: player.name,
          triggeredAt: currentRound
        });
      }
    }

    // Environmental hazards remain the same... (EXISTING CODE - DON'T CHANGE)
    if (area === 'exterior') {
      const quicksandAtLocation = quicksandLocations.find(qs => qs.x === x && qs.y === y);
      if (quicksandAtLocation) {
        const quicksandMessage = `🌊 QUICKSAND DANGER!\n\n${player.name} stepped into quicksand!\n\nLocation: Exterior (${x},${y})\nTime: ${roundToTime(currentRound)}\n\nImmediate assistance required!`;
        alert(quicksandMessage);
        addAlert('environmental-hazard', `🌊 QUICKSAND! ${player.name} stepped into quicksand at (${x},${y})! Immediate assistance required!`, currentRound);
      }

      if (floodedCells.has(`${x},${y}`)) {
        const floodMessage = `💧 FLOOD ZONE!\n\n${player.name} entered flooded area!\n\nLocation: Exterior (${x},${y})\nTime: ${roundToTime(currentRound)}\n\nMovement may be restricted!`;
        alert(floodMessage);
        addAlert('environmental-hazard', `💧 FLOOD ZONE! ${player.name} entered flooded area at (${x},${y})! Movement may be restricted!`, currentRound);
      }

      const recentLightning = lightningStrikes.find(strike => 
        strike.x === x && strike.y === y && (currentRound - strike.round) <= 2
      );
      if (recentLightning) {
        const lightningMessage = `⚡ LIGHTNING DANGER!\n\n${player.name} is near recent lightning strike!\n\nLocation: Exterior (${x},${y})\nStrike Round: ${recentLightning.round}\nCurrent Round: ${currentRound}\nTime: ${roundToTime(currentRound)}\n\nHigh risk area!`;
        alert(lightningMessage);
        addAlert('environmental-hazard', `⚡ LIGHTNING DANGER! ${player.name} is near recent lightning strike at (${x},${y})! High risk area!`, currentRound);
      }
    }
  };

  const checkEntityPlayerCollisions = (movedEntityId, newX, newY, area) => {
    // Find players at the new position
    const playersAtPosition = players.filter(player => {
      if (area === 'interior') {
        return player.position?.currentArea === 'interior' &&
               player.position.interior.x === newX &&
               player.position.interior.y === newY &&
               player.position.interior.floor === currentFloor;
      } else if (area === 'exterior') {
        return player.position?.currentArea === 'exterior' &&
               player.position.exterior.x === newX &&
               player.position.exterior.y === newY;
      }
      return false;
    });

    // If players are found at this position, trigger collision alert
    if (playersAtPosition.length > 0) {
      // Find the entity that moved
      let movedEntity = null;

      if (area === 'interior') {
        movedEntity = indoorEntities.find(e => e.id === movedEntityId);
      } else {
        movedEntity = [...outdoorEntities, ...daytimeEntities].find(e => e.id === movedEntityId);
      }

      if (movedEntity) {
        const playerNames = playersAtPosition.map(p => p.name).join(', ');
        const locationText = area === 'interior' 
          ? `interior at (${newX},${newY}) Floor ${currentFloor}`
          : `exterior at (${newX},${newY})`;

        // Browser alert popup - immediate and blocking
        const collisionMessage = `🚨 ENTITY COLLISION!\n\n${movedEntity.name} moved into ${playerNames}'s position!\n\nLocation: ${locationText}\nTime: ${roundToTime(currentRound)}\n\nImmediate encounter!`;

        alert(collisionMessage);

        // Also add to mission alerts
        addAlert('entity-collision', 
          `🚨 COLLISION! ${movedEntity.name} moved into ${playerNames} at (${newX},${newY})! ⚠️`, 
          currentRound
        );

        // Trigger entity encounter panel
        if (handleEntityEncounter) {
          handleEntityEncounter(movedEntity);
        }
      }
    }
  };

  const currentPowerStatus = getCurrentPowerStatus();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900">
      {/* Enhanced Header */}
      <div className="bg-black/30 backdrop-blur-sm border-b border-white/10 shadow-2xl">
        <div className="max-w-full px-4 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div>
              <h1 className="text-2xl lg:text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Lethal Company Operations Center
              </h1>
              <p className="text-blue-300 mt-1 text-sm lg:text-lg">Advanced Mission Control System - Day {currentDay}</p>
            </div>

            {/* Status Cards */}
            <div className="flex items-center space-x-2 lg:space-x-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg lg:rounded-xl p-2 lg:p-4 border border-white/20 shadow-lg">
                <div className="text-white text-lg lg:text-xl font-bold">Day {currentDay}</div>
                <div className="text-blue-300 text-xs lg:text-sm">Current Mission</div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg lg:rounded-xl p-2 lg:p-4 border border-white/20 shadow-lg">
                <div className="text-white text-lg lg:text-xl font-bold">{currentRound}/128</div>
                <div className="text-blue-300 text-xs lg:text-sm">{roundToTime(currentRound)}</div>
              </div>

              <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg lg:rounded-xl flex items-center justify-center shadow-xl">
                <span className="text-white text-xl lg:text-2xl">🚀</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard */}
      <div className="max-w-full px-4 py-4 space-y-4">

        {/* Weather Forecast Accordion */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 shadow-xl overflow-hidden">
          <div 
            className="p-3 lg:p-4 border-b border-white/10 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 cursor-pointer hover:bg-gradient-to-r hover:from-blue-600/30 hover:to-indigo-600/30 transition-all duration-300"
            onClick={() => setShowWeatherForecast(!showWeatherForecast)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-lg lg:text-xl">🌤️</span>
                <span className="text-white font-semibold text-base lg:text-lg">Weather Forecast</span>
                <span className="text-sm text-blue-400 ml-4">(Day {currentDay})</span>
                {selectedMoon && (
                  <span className="text-xs bg-blue-500/30 text-blue-300 px-2 py-1 rounded ml-2">
                    {selectedMoon} selected
                  </span>
                )}
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 text-xs">
                  <span className="text-white/60">
                    {Object.keys(dailyWeather).length} moons available
                  </span>
                </div>

                <div className={`transform transition-transform duration-300 ${showWeatherForecast ? 'rotate-180' : 'rotate-0'}`}>
                  <svg className="w-4 h-4 lg:w-5 lg:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className={`transition-all duration-500 ease-in-out overflow-hidden ${
            showWeatherForecast 
              ? 'max-h-[400px] opacity-100'
              : 'max-h-0 opacity-0'
          }`}>
            <div className="p-3 lg:p-4">
              <WeatherForecast 
                currentDay={currentDay}
                dailyWeather={dailyWeather}
                selectedMoon={selectedMoon}
                onMoonSelect={handleMoonChange}
              />
            </div>
          </div>
        </div>

        {/* Mission Control and Alerts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Mission Control */}
          <div className="lg:col-span-2">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 shadow-xl overflow-hidden h-full">
              <div className="p-3 lg:p-4 border-b border-white/10 bg-gradient-to-r from-indigo-600/20 to-purple-600/20">
                <h2 className="text-white font-semibold text-base lg:text-lg flex items-center space-x-2">
                  <span className="text-lg lg:text-xl">🎮</span>
                  <span>Mission Control</span>
                </h2>
              </div>
              <div className="p-3 lg:p-4">
                <MissionControl 
                  selectedMoon={selectedMoon}
                  dailyWeather={dailyWeather}
                  currentRound={currentRound}
                  gameStarted={gameStarted}
                  currentQuota={currentQuota}
                  daysUntilDeadline={daysUntilDeadline}
                  quotasFulfilled={quotasFulfilled}
                  onStartGame={startGame}
                  onNextRound={nextRound}
                  onResetGame={resetGame}
                  onAdvanceDay={advanceDay}
                  onResetCampaign={resetCampaign}
                  players={players}
                  totalEntities={indoorEntities.length + outdoorEntities.length + daytimeEntities.length}
                  powerStatus={currentPowerStatus}
                  weapons={weapons}
                  suits={suits}
                  baseStore={baseStore}
                />
              </div>
            </div>
          </div>

          {/* Mission Alerts */}
          <div className="lg:col-span-1">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 shadow-xl overflow-hidden h-full">
              <div className="p-3 lg:p-4 border-b border-white/10 bg-gradient-to-r from-red-600/20 to-orange-600/20">
                <h2 className="text-white font-semibold text-base lg:text-lg flex items-center space-x-2">
                  <span className="text-lg lg:text-xl">🚨</span>
                  <span>Mission Alerts</span>
                </h2>
              </div>
              <div className="p-3 lg:p-4">
                <MissionAlerts alerts={alerts} />
              </div>
            </div>
          </div>
        </div>

        {/* Rage Management */}
        <div className="lg:col-span-1">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 shadow-xl overflow-hidden h-full">
            <div className="p-3 lg:p-4 border-b border-white/10 bg-gradient-to-r from-purple-600/20 to-pink-600/20">
              <h2 className="text-white font-semibold text-base lg:text-lg flex items-center space-x-2">
                <span className="text-lg lg:text-xl">😡</span>
                <span>Rage Control</span>
              </h2>
            </div>
            <div className="p-3 lg:p-4 h-full overflow-y-auto">
              <RageManagementPanel 
                entities={[...indoorEntities, ...outdoorEntities, ...daytimeEntities]}
                onRageUpdate={(entityId, rage) => {
                  const entityRage = rageSystem.getEntityRage(entityId);
                  if (entityRage && rage >= entityRage.maxRage) {
                    addAlert('rage-max', `🔥 ${entityRage.configName} has reached maximum rage!`, currentRound);
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Tactical Grid Accordion */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 shadow-xl overflow-hidden">
          <div 
            className="p-3 lg:p-4 border-b border-white/10 bg-gradient-to-r from-green-600/20 to-emerald-600/20 cursor-pointer hover:bg-gradient-to-r hover:from-green-600/30 hover:to-emerald-600/30 transition-all duration-300"
            onClick={() => setActiveMainTab(activeMainTab === 'tactical' ? '' : 'tactical')}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-lg lg:text-xl">🗺️</span>
                <span className="text-white font-semibold text-base lg:text-lg">Tactical Grid</span>
                <span className="text-xs bg-green-500/30 text-green-300 px-2 py-1 rounded ml-2">
                  {players.filter(p => p.position?.currentArea === 'exterior').length} outside
                </span>
              </div>

              <div className={`transform transition-transform duration-300 ${activeMainTab === 'tactical' ? 'rotate-180' : 'rotate-0'}`}>
                <svg className="w-4 h-4 lg:w-5 lg:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <div className={`transition-all duration-500 ease-in-out overflow-hidden ${
            activeMainTab === 'tactical' 
              ? 'max-h-[800px] opacity-100'
              : 'max-h-0 opacity-0'
          }`}>
            <div className="p-3 lg:p-4 h-[700px] overflow-y-auto">
              {selectedMoon ? (
                <TacticalGrid
                  selectedMoon={selectedMoon}
                  currentWeatherType={currentWeatherType}
                  quicksandLocations={quicksandLocations}
                  currentRound={currentRound}
                  playerPosition={playerPosition}
                  selectedCell={selectedCell}
                  setSelectedCell={setSelectedCell}
                  floodedCells={floodedCells}
                  floodLevel={floodLevel}
                  outdoorEntities={outdoorEntities}
                  daytimeEntities={daytimeEntities}
                  onEntityDefeat={handleEntityDefeat}
                  gameStarted={gameStarted}
                  players={players}
                  currentFogLevel={currentFogLevel}
                  lightningStrikes={lightningStrikes}
                  eclipseEntities={eclipseEntities}
                  onEntityPlayerCollision={checkEntityPlayerCollisions}
                  onEntityEncounter={handleEntityEncounter}
                  exteriorEntityData={exteriorEntityData}
                  setExteriorEntityData={setExteriorEntityData}
                  onPlayerPositionChange={handlePlayerPositionChange}
                  onTrapTriggered
                  setPlayers={setPlayers}
                  rageSystem={rageSystem}
                />
              ) : (
                <div className="h-full flex items-center justify-center text-center text-white/70">
                  <div>
                    <span className="text-6xl block mb-4">🗺️</span>
                    <p className="text-xl">Please select a moon to view the tactical grid.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Interior Grid Accordion */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 shadow-xl overflow-hidden">
          <div 
            className="p-3 lg:p-4 border-b border-white/10 bg-gradient-to-r from-orange-600/20 to-red-600/20 cursor-pointer hover:bg-gradient-to-r hover:from-orange-600/30 hover:to-red-600/30 transition-all duration-300"
            onClick={() => setActiveMainTab(activeMainTab === 'interior' ? '' : 'interior')}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-lg lg:text-xl">🏭</span>
                <span className="text-white font-semibold text-base lg:text-lg">Interior Grid</span>
                <span className="text-xs bg-orange-500/30 text-orange-300 px-2 py-1 rounded ml-2">
                  {players.filter(p => p.position?.currentArea === 'interior').length} inside
                </span>
              </div>

              <div className={`transform transition-transform duration-300 ${activeMainTab === 'interior' ? 'rotate-180' : 'rotate-0'}`}>
                <svg className="w-4 h-4 lg:w-5 lg:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
            
          <div className={`transition-all duration-500 ease-in-out overflow-hidden ${
            activeMainTab === 'interior' 
              ? 'max-h-[800px] opacity-100'
              : 'max-h-0 opacity-0'
          }`}>
            <div className="p-3 lg:p-4 h-[800px] overflow-y-auto">
              <NewInteriorGrid
                selectedMoon={selectedMoon}
                gameStarted={gameStarted}
                currentRound={currentRound}
                onEntityEncounter={handleEntityEncounter}
                onTrapTriggered={handleTrapTriggered}
                entityManager={entities}
                onEntityDefeat={handleEntityDefeat}
                onEntityPlacement={handleEntityPlacement}
                players={players}
                buildingData={buildingData}
                setBuildingData={setBuildingData}
                currentFloor={currentFloor}
                setCurrentFloor={setCurrentFloor}
                onEntityPlayerCollision={checkEntityPlayerCollisions}
                onPlayerPositionChange={handlePlayerPositionChange}
                setPlayers={setPlayers}
                addAlert={addAlert}
                rageSystem={rageSystem}
              />
            </div>
          </div>
        </div>

        {/* Player Management Accordion */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 shadow-xl overflow-hidden">
          <div 
            className="p-3 lg:p-4 border-b border-white/10 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 cursor-pointer hover:bg-gradient-to-r hover:from-cyan-600/30 hover:to-blue-600/30 transition-all duration-300"
            onClick={() => setActiveMainTab(activeMainTab === 'players' ? '' : 'players')}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-lg lg:text-xl">👥</span>
                <span className="text-white font-semibold text-base lg:text-lg">Player Management</span>
                <span className="text-xs bg-cyan-500/30 text-cyan-300 px-2 py-1 rounded ml-2">
                  {players.length} total
                </span>
              </div>

              <div className={`transform transition-transform duration-300 ${activeMainTab === 'players' ? 'rotate-180' : 'rotate-0'}`}>
                <svg className="w-4 h-4 lg:w-5 lg:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <div className={`transition-all duration-500 ease-in-out overflow-hidden ${
            activeMainTab === 'players' 
              ? 'max-h-[800px] opacity-100'
              : 'max-h-0 opacity-0'
          }`}>
            <div className="p-3 lg:p-4 h-[800px] overflow-y-auto">
              <PlayerManager 
                players={players}
                setPlayers={setPlayers}
                selectedMoon={selectedMoon}
                currentRound={currentRound}
                buildingData={buildingData}
                setBuildingData={setBuildingData}  // Add this line
                currentFloor={currentFloor}
                onPlayerPositionChange={handlePlayerPositionChange}
              />
            </div>
          </div>
        </div>

        {/* Weather Mechanics Accordion */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 shadow-xl overflow-hidden">
          <div 
            className="p-3 lg:p-4 border-b border-white/10 bg-gradient-to-r from-teal-600/20 to-green-600/20 cursor-pointer hover:bg-gradient-to-r hover:from-teal-600/30 hover:to-green-600/30 transition-all duration-300"
            onClick={() => setActiveMainTab(activeMainTab === 'weather' ? '' : 'weather')}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-lg lg:text-xl">🌦️</span>
                <span className="text-white font-semibold text-base lg:text-lg">Weather Mechanics</span>
                <span className="text-xs bg-teal-500/30 text-teal-300 px-2 py-1 rounded ml-2">
                  {currentWeatherType || 'clear'}
                </span>
              </div>

              <div className={`transform transition-transform duration-300 ${activeMainTab === 'weather' ? 'rotate-180' : 'rotate-0'}`}>
                <svg className="w-4 h-4 lg:w-5 lg:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <div className={`transition-all duration-500 ease-in-out overflow-hidden ${
            activeMainTab === 'weather' 
              ? 'max-h-[800px] opacity-100'
              : 'max-h-0 opacity-0'
          }`}>
            <div className="p-3 lg:p-4 h-[800px] overflow-y-auto">
              <WeatherMechanics currentWeatherType={currentWeatherType} />
            </div>
          </div>
        </div>

        {/* Ship Systems Accordion */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 shadow-xl overflow-hidden">
          <div 
            className="p-3 lg:p-4 border-b border-white/10 bg-gradient-to-r from-red-600/20 to-pink-600/20 cursor-pointer hover:bg-gradient-to-r hover:from-red-600/30 hover:to-pink-600/30 transition-all duration-300"
            onClick={() => setActiveMainTab(activeMainTab === 'systems' ? '' : 'systems')}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-lg lg:text-xl">🚀</span>
                <span className="text-white font-semibold text-base lg:text-lg">Ship Systems</span>
                <span className="text-xs bg-red-500/30 text-red-300 px-2 py-1 rounded ml-2">
                  Durability Tracking
                </span>
              </div>

              <div className={`transform transition-transform duration-300 ${activeMainTab === 'systems' ? 'rotate-180' : 'rotate-0'}`}>
                <svg className="w-4 h-4 lg:w-5 lg:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <div className={`transition-all duration-500 ease-in-out overflow-hidden ${
            activeMainTab === 'systems' 
              ? 'max-h-[800px] opacity-100'
              : 'max-h-0 opacity-0'
          }`}>
            <div className="p-3 lg:p-4 h-[800px] overflow-y-auto">
              <ShipSystems
                currentRound={currentRound}
                lightningStrikes={lightningStrikes}
                addAlert={addAlert}
                selectedMoon={selectedMoon}
                dailyWeather={dailyWeather}
                currentWeatherType={currentWeatherType}
              />
            </div>
          </div>
        </div>

        {/*Ship Inventory*/}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 shadow-xl overflow-hidden">
          <div 
            className="p-3 lg:p-4 border-b border-white/10 bg-gradient-to-r from-red-600/20 to-pink-600/20 cursor-pointer hover:bg-gradient-to-r hover:from-red-600/30 hover:to-pink-600/30 transition-all duration-300"
            onClick={() => setActiveMainTab(activeMainTab === 'inventory' ? '' : 'inventory')}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-lg lg:text-xl">🚢</span>
                <span className="text-white font-semibold text-base lg:text-lg">Ship Inventory</span>
              </div>

              <div className={`transform transition-transform duration-300 ${activeMainTab === 'inventory' ? 'rotate-180' : 'rotate-0'}`}>
                <svg className="w-4 h-4 lg:w-5 lg:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <div className={`transition-all duration-500 ease-in-out overflow-hidden ${
            activeMainTab === 'inventory' 
              ? 'max-h-[800px] opacity-100'
              : 'max-h-0 opacity-0'
          }`}>
            <div className="p-3 lg:p-4 h-[800px] overflow-y-auto">
              <ShipInventory daysUntilDeadline={daysUntilDeadline - 1}/>
            </div>
          </div>
        </div>
      </div>

      {/* Entity Encounter Panel */}
      {selectedEntityForEncounter && (
        <EntityEncounterPanel 
          entity={selectedEntityForEncounter}
          onClose={closeEntityEncounter}
          onEntityUpdate={handleEntityHealthUpdate}
        />
      )}
    </div>
  );
};

export default WeatherApp;