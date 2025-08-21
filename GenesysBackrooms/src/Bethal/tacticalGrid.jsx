import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { 
  GRID_SIZE, 
  getShipPosition,
  FACILITY_POSITIONS, 
  FIRE_EXIT_POSITIONS,
  STATIC_TERRAIN_FEATURES,
  generateDynamicHazards,
  getAllTerrainFeatures,
  RANGE_BANDS, 
  getHeightAt, 
  getFacilityPosition,
  getFireExitPosition
} from './moonData.jsx';

// Ultra-simple cell component - minimal styling, maximum performance
const SimpleCell = memo(({ 
  x, 
  y, 
  content,
  bgColor,
  textColor,
  isSelected,
  onClick,
  tooltip,
  isPlayerMovementMode,
  isCurrentPlayerPosition,
  movingPlayer
}) => {
  let cellClass = `
    w-8 h-8 border border-gray-600 flex items-center justify-center text-xs cursor-pointer
    ${bgColor} ${textColor} ${isSelected ? 'ring-2 ring-blue-400' : ''}
    hover:scale-110 transition-transform duration-100
  `;

  // Add movement mode styling
  if (isPlayerMovementMode) {
    if (isCurrentPlayerPosition) {
      cellClass += ' ring-4 ring-cyan-300 bg-cyan-600/50';
    } else {
      cellClass += ' ring-2 ring-cyan-400 hover:bg-cyan-500/30';
    }
  }

  return (
    <div
      className={cellClass}
      onClick={onClick}
      title={tooltip}
    >
      {content}
    </div>
  );
}, (prev, next) => (
  prev.x === next.x &&
  prev.y === next.y &&
  prev.content === next.content &&
  prev.bgColor === next.bgColor &&
  prev.textColor === next.textColor &&
  prev.isSelected === next.isSelected &&
  prev.isPlayerMovementMode === next.isPlayerMovementMode &&
  prev.isCurrentPlayerPosition === next.isCurrentPlayerPosition
));

const TacticalGrid = ({ 
  selectedMoon,
  currentWeatherType,
  quicksandLocations = [],
  currentRound,
  selectedCell,
  setSelectedCell,
  floodedCells = new Set(),
  floodLevel = 0,
  outdoorEntities = [],
  daytimeEntities = [],
  onEntityDefeat,
  gameStarted,
  players = [],
  currentFogLevel = 0,
  lightningStrikes = [],
  onEntityPlayerCollision,
  onEntityEncounter,
  setExteriorEntityData,
  onPlayerPositionChange // NEW: Add this prop
}) => {
  
  // Simplified state - only track what we absolutely need
  const [entityPositions, setEntityPositions] = useState(new Map());
  const [terrainData, setTerrainData] = useState({});
  const [entityMovementTimers, setEntityMovementTimers] = useState(new Map());
  const [dynamicHazards, setDynamicHazards] = useState({});

  // NEW: Player movement state
  const [isPlayerMovementMode, setIsPlayerMovementMode] = useState(false);
  const [movingPlayer, setMovingPlayer] = useState(null);

  // Basic position getters
  const shipPos = useMemo(() => 
    selectedMoon ? getShipPosition(selectedMoon) : { x: 6, y: 6 },
    [selectedMoon]
  );

  const facilityPos = useMemo(() => 
    selectedMoon ? getFacilityPosition(selectedMoon) : { x: 0, y: 0 },
    [selectedMoon]
  );

  const fireExitPos = useMemo(() => 
    selectedMoon ? getFireExitPosition(selectedMoon) : { x: 12, y: 12 },
    [selectedMoon]
  );

  // NEW: Player movement functions
  const startPlayerMovement = (player) => {
    setMovingPlayer(player);
    setIsPlayerMovementMode(true);
  };

  const handlePlayerMovementClick = (x, y) => {
    console.log('🎯 Player movement click:', { x, y, movingPlayer, isPlayerMovementMode });

    if (!isPlayerMovementMode || !movingPlayer) {
      console.log('❌ Not in movement mode or no moving player');
      return;
    }

    // Validate position (no walls in exterior, but could check for other restrictions)
    console.log('🗺️ Moving player to exterior position:', { x, y });

    const additionalData = {
      terrain: getSimpleTerrainType(x, y) // Get terrain type for the position
    };

    console.log('📍 Calling onPlayerPositionChange:', {
      playerId: movingPlayer.id,
      area: 'exterior',
      x, y,
      additionalData,
      onPlayerPositionChange: typeof onPlayerPositionChange
    });

    // Call the position change handler
    if (onPlayerPositionChange) {
      onPlayerPositionChange(movingPlayer.id, 'exterior', x, y, additionalData);
      console.log('✅ Position change called');
    } else {
      console.log('❌ onPlayerPositionChange not available');
    }

    // FORCE IMMEDIATE RE-RENDER by updating a local state
    // This ensures the grid shows the updated player position immediately
    const updatedMovingPlayer = {
      ...movingPlayer,
      position: {
        ...movingPlayer.position,
        exterior: { x, y, terrain: additionalData.terrain },
        currentArea: 'exterior'
      }
    };
    setMovingPlayer(updatedMovingPlayer);

    // Exit movement mode after a brief delay to show the updated position
    setTimeout(() => {
      setIsPlayerMovementMode(false);
      setMovingPlayer(null);
      setSelectedCell(null);
    }, 100);

    console.log('🔄 Movement mode ended');
  };

  const cancelPlayerMovement = () => {
    setIsPlayerMovementMode(false);
    setMovingPlayer(null);
  };

  // FIXED: Enhanced weather effects based on WeatherMechanics component
  const getSimpleTerrainType = useCallback((x, y) => {
    if (currentWeatherType === 'rainy') {
      const hasQuicksand = quicksandLocations.some(loc => loc.x === x && loc.y === y);
      if (hasQuicksand) {
        return 'quicksand';
      }
    }

    if (currentWeatherType === 'flooded') {
      // FIXED: Check if this specific cell is underwater
      const cellKey = `${x},${y}`;
      if (floodedCells.has(cellKey)) {
        console.log(`💧 Cell (${x},${y}) is flooded`); // Debug
        return 'flooded';
      }
    }

    if (currentWeatherType === 'stormy') {
      // Only show lightning strikes where they actually hit
      const recentLightning = lightningStrikes.find(strike => 
        strike.x === x && strike.y === y && (currentRound - strike.round) <= 2
      );
      if (recentLightning) return 'lightning_strike';
    }

    // Dynamic hazards (FIXED)
    if (dynamicHazards.landmines && dynamicHazards.landmines.some(loc => loc.x === x && loc.y === y)) {
      return 'landmine';
    }
    if (dynamicHazards.turrets && dynamicHazards.turrets.some(loc => loc.x === x && loc.y === y)) {
      return 'turret';
    }
    if (dynamicHazards.quicksand && dynamicHazards.quicksand.some(loc => loc.x === x && loc.y === y)) {
      return 'quicksand_permanent';
    }
    if (dynamicHazards.ice_patches && dynamicHazards.ice_patches.some(loc => loc.x === x && loc.y === y)) {
      return 'ice_patch';
    }

    // Static terrain
    const features = terrainData[`${x},${y}`];
    if (features) {
      if (features.includes('bridge')) return 'bridge';
      if (features.includes('river')) return 'river';
      if (features.includes('forest')) return 'forest';
      if (features.includes('cliff')) return 'cliff';
      if (features.includes('pond')) return 'pond';
      if (features.includes('void_zone')) return 'void_zone';
      if (features.includes('reality_tear')) return 'reality_tear';
      if (features.includes('toxic_pool')) return 'toxic_pool';
      if (features.includes('lava_pit')) return 'lava_pit';
    }

    return 'normal';
  }, [currentWeatherType, quicksandLocations, floodedCells, lightningStrikes, dynamicHazards, terrainData, currentRound]);

  // Simple distance calculation
  const getDistance = useCallback((x1, y1, x2, y2) => {
    return Math.abs(x1 - x2) + Math.abs(y1 - y2);
  }, []);

  // Get current weather status and progression info
  const getWeatherStatus = useCallback(() => {
    if (!currentWeatherType || currentWeatherType === 'clear') {
      return {
        type: 'clear',
        phase: 'Normal',
        level: 0,
        nextEvent: 'No weather events',
        effects: ['No weather penalties'],
        severity: 'none'
      };
    }

    switch (currentWeatherType) {
      case 'rainy':
        const nextQuicksandRound = Math.ceil((currentRound + 1) / 12) * 12;
        return {
          type: 'rainy',
          phase: 'Rain Storm',
          level: quicksandLocations.length,
          nextEvent: currentRound < 12 ? `First quicksand spawns Round 12` : `Next quicksand spawns Round ${nextQuicksandRound}`,
          effects: [
            '+1 Setback to Athletics/Coordination (slippery)',
            '+1 Setback to Perception beyond Medium range',
            `${quicksandLocations.length} active quicksand locations`,
            'New quicksand every 12 rounds (12, 24, 36...)'
          ],
          severity: 'moderate'
        };

      case 'stormy':
        const phase = currentRound <= 30 ? 1 : currentRound <= 46 ? 2 : currentRound <= 62 ? 3 : 4;
        const lightningInterval = phase === 1 ? 16 : phase === 2 ? 12 : phase === 3 ? 8 : 6;

        // Calculate next lightning round based on phase
        let nextLightningRound;
        if (phase === 1) {
          nextLightningRound = Math.ceil((currentRound + 1) / 16) * 16;
        } else if (phase === 2 && currentRound >= 31) {
          nextLightningRound = Math.ceil((currentRound - 30) / 12) * 12 + 30;
          if (nextLightningRound <= currentRound) nextLightningRound += 12;
        } else if (phase === 3 && currentRound >= 47) {
          nextLightningRound = Math.ceil((currentRound - 46) / 8) * 8 + 46;
          if (nextLightningRound <= currentRound) nextLightningRound += 8;
        } else if (phase === 4 && currentRound >= 63) {
          nextLightningRound = Math.ceil((currentRound - 62) / 6) * 6 + 62;
          if (nextLightningRound <= currentRound) nextLightningRound += 6;
        } else {
          // Phase transition coming
          nextLightningRound = phase === 1 ? 31 : phase === 2 ? 47 : 63;
        }

        const malfunctionChance = phase === 1 ? 15 : phase === 2 ? 20 : phase === 3 ? 25 : 30;

        return {
          type: 'stormy',
          phase: `Storm Phase ${phase}`,
          level: phase,
          nextEvent: `Lightning strikes Round ${nextLightningRound}`,
          effects: [
            `${malfunctionChance}% equipment malfunction chance each round`,
            `Lightning every ${lightningInterval} rounds`,
            'ENTIRE GRID exposed to lightning strikes',
            'Metal items build electrical charge (3 levels)',
            'Vigilance check to detect sparking before strike'
          ],
          severity: phase >= 3 ? 'critical' : 'high'
        };

      case 'foggy':
        // Probability-based fog progression
        const baseFogLevel = Math.max(1, currentFogLevel || 2);
        return {
          type: 'foggy',
          phase: `Fog Level ${baseFogLevel}`,
          level: baseFogLevel,
          nextEvent: 'Fog changes each round (45% thicker, 15% same, 40% thinner)',
          effects: [
            `+${baseFogLevel} Setback to Perception checks`,
            baseFogLevel <= 2 ? 'Visibility to Short range' : 
            baseFogLevel <= 4 ? 'Visibility to Engaged range only' :
            'Auto-fail Perception beyond Engaged range',
            'Communication range reduced by 1-2 bands',
            'Navigation checks get harder with thicker fog'
          ],
          severity: baseFogLevel >= 4 ? 'high' : 'moderate'
        };

      case 'flooded':
        // FIXED: Adjust phase calculation for round 20 start
        const roundsSinceFloodStart = Math.max(0, currentRound - 20);
        const floodPhase = currentRound < 20 ? 0 : Math.floor(roundsSinceFloodStart / 20) + 1;
        const nextFloodRound = currentRound < 20 ? 20 : 20 + (floodPhase * 20);
        const totalFloodedCells = floodedCells.size;
        const floodCoverage = Math.round((totalFloodedCells / (GRID_SIZE * GRID_SIZE)) * 100);
            
        // Calculate what should happen next round
        let nextEventDescription;
        if (currentRound < 20) {
          nextEventDescription = `Round 20: Initial flooding begins (25% chance per height-0 tile)`;
        } else if (nextFloodRound <= 128) {
          if (floodPhase === 1) {
            nextEventDescription = `Round ${nextFloodRound}: Adjacent spread phase (50% chance per tile)`;
          } else {
            nextEventDescription = `Round ${nextFloodRound}: Flood spreads to more adjacent areas`;
          }
        } else {
          nextEventDescription = 'No further flood progression';
        }
        
        return {
          type: 'flooded',
          phase: currentRound < 20 ? 'Pre-Flood' : `Flood Phase ${floodPhase}`,
          level: Math.max(0, floodPhase),
          nextEvent: nextEventDescription,
          effects: [
            currentRound < 20 ? 'No flooding yet - starts at Round 20' : `${floodCoverage}% of map flooded (${totalFloodedCells} cells)`,
            currentRound < 20 ? 'Flooding will begin at low-lying areas (height 0)' : 
            `Water depth: ${floodPhase <= 1 ? 'Shallow puddles' : floodPhase <= 2 ? 'Ankle-deep water' : floodPhase <= 3 ? 'Knee-deep flooding' : 'Waist-deep+ water (dangerous)'}`,
            currentRound < 20 ? 'Initial flood: 25% chance per height-0 tile' :
            floodPhase <= 2 ? '+1-2 Setback to movement in water' :
            floodPhase <= 3 ? '+2-3 Setback, limited movement in flooded zones' :
            'Swimming checks required in deep areas',
            currentRound < 20 ? 'Spread: 50% chance per adjacent tile (Round 40+)' :
            floodPhase === 1 ? 'Next phase: 50% chance per adjacent tile' : 'Continued: 50% chance per adjacent tile',
            'Probability-based flooding every 20 rounds'
          ],
          severity: currentRound < 20 ? 'none' : 
                   floodPhase >= 4 ? 'critical' : 
                   floodPhase >= 3 ? 'high' : 
                   totalFloodedCells > 0 ? 'moderate' : 'low'
        };

      case 'eclipsed':
        const eclipsePhase = Math.floor(currentRound / 16) + 1;
        const nextEntityRound = eclipsePhase * 16;
        const malfunctionRate = eclipsePhase <= 1 ? 10 : eclipsePhase <= 2 ? 15 : eclipsePhase <= 3 ? 20 : 25;

        return {
          type: 'eclipsed',
          phase: `Eclipse Intensity ${eclipsePhase}`,
          level: eclipsePhase,
          nextEvent: nextEntityRound <= 128 ? `Eclipse intensifies Round ${nextEntityRound}` : 'Maximum eclipse intensity',
          effects: [
            '1 strain per round outside (0.5 if near ally)',
            `${malfunctionRate}% equipment interference each round`,
            'Fear checks required when eclipse begins and seeing entities',
            `All entities enhanced by +${eclipsePhase} power`,
            'Entity enhancement occurs every 16 rounds'
          ],
          severity: eclipsePhase >= 4 ? 'lethal' : 'high'
        };

      default:
        return {
          type: currentWeatherType,
          phase: 'Unknown',
          level: 0,
          nextEvent: 'Unknown progression',
          effects: ['Weather effects may not be implemented'],
          severity: 'unknown'
        };
    }
  }, [currentWeatherType, currentRound, quicksandLocations.length, floodedCells.size, currentFogLevel]);

  // Ultra-simple cell data generator
  const getCellData = useCallback((x, y) => {
    const cellKey = `${x},${y}`;
    
    // Check for players first (highest priority)
    const playersHere = players.filter(p => 
      p.position?.currentArea === 'exterior' &&
      p.position.exterior.x === x &&
      p.position.exterior.y === y
    );
    
    if (playersHere.length > 0) {
      return {
        content: playersHere.length > 1 ? `👥${playersHere.length}` : '👤',
        bgColor: 'bg-cyan-500',
        textColor: 'text-white',
        tooltip: `Players: ${playersHere.map(p => p.name).join(', ')}`
      };
    }

    // Check for entities
    const entity = entityPositions.get(cellKey);
    if (entity) {
      return {
        content: entity.icon || '👹',
        bgColor: 'bg-red-500',
        textColor: 'text-white',
        tooltip: `${entity.name} (${entity.type})`
      };
    }

    // Check for special locations
    if (x === shipPos.x && y === shipPos.y) {
      return {
        content: '🚀',
        bgColor: 'bg-blue-500',
        textColor: 'text-white',
        tooltip: 'Ship Landing Zone'
      };
    }

    if (x === facilityPos.x && y === facilityPos.y) {
      return {
        content: '🏭',
        bgColor: 'bg-orange-500',
        textColor: 'text-white',
        tooltip: 'Company Facility'
      };
    }

    if (x === fireExitPos.x && y === fireExitPos.y) {
      return {
        content: '🚪',
        bgColor: 'bg-green-500',
        textColor: 'text-white',
        tooltip: 'Fire Exit'
      };
    }

    // Terrain-based display
    const terrainType = getSimpleTerrainType(x, y);
    const height = selectedMoon ? getHeightAt(selectedMoon, x, y) : 0;
    const distance = getDistance(x, y, shipPos.x, shipPos.y);
    
    switch (terrainType) {
      case 'river':
        return {
          content: '🌊',
          bgColor: 'bg-blue-600',
          textColor: 'text-blue-100',
          tooltip: `River - Distance: ${distance}`
        };
      case 'bridge':
        return {
          content: '🌉',
          bgColor: 'bg-yellow-600',
          textColor: 'text-yellow-100',
          tooltip: `Bridge - Distance: ${distance}`
        };
      case 'forest':
        return {
          content: '🌲',
          bgColor: 'bg-green-600',
          textColor: 'text-green-100',
          tooltip: `Forest - Distance: ${distance}`
        };
      case 'cliff':
        return {
          content: '⛰️',
          bgColor: 'bg-gray-600',
          textColor: 'text-gray-100',
          tooltip: `Cliff - Distance: ${distance}`
        };
      case 'quicksand':
        return {
          content: '🕳️',
          bgColor: 'bg-yellow-700',
          textColor: 'text-yellow-200',
          tooltip: `Quicksand (Rain Weather) - Distance: ${distance} - ESCAPE: Athletics vs 3 Difficulty`
        };
      case 'flooded':
        return {
          content: '🌊',
          bgColor: 'bg-blue-700',
          textColor: 'text-blue-200',
          tooltip: `Flooded Zone - Distance: ${distance}`
        };
      case 'landmine':
        return {
          content: '💣',
          bgColor: 'bg-red-700',
          textColor: 'text-red-200',
          tooltip: `Landmine - Distance: ${distance}`
        };
      case 'turret':
        return {
          content: '🔫',
          bgColor: 'bg-gray-700',
          textColor: 'text-gray-200',
          tooltip: `Turret - Distance: ${distance}`
        };
      case 'lightning_strike':
        return {
          content: '⚡',
          bgColor: 'bg-yellow-500',
          textColor: 'text-yellow-100',
          tooltip: `Recent Lightning Strike - Distance: ${distance}`
        };
      case 'quicksand_permanent':
        return {
          content: '🕳️',
          bgColor: 'bg-amber-700',
          textColor: 'text-amber-200',
          tooltip: `Permanent Quicksand - Distance: ${distance}`
        };
      case 'ice_patch':
        return {
          content: '❄️',
          bgColor: 'bg-blue-400',
          textColor: 'text-blue-100',
          tooltip: `Ice Patch - Distance: ${distance}`
        };
      case 'pond':
        return {
          content: '💧',
          bgColor: 'bg-blue-500',
          textColor: 'text-blue-100',
          tooltip: `Pond - Distance: ${distance}`
        };
      case 'void_zone':
        return {
          content: '⚫',
          bgColor: 'bg-black',
          textColor: 'text-white',
          tooltip: `Void Zone (DEADLY) - Distance: ${distance}`
        };
      case 'reality_tear':
        return {
          content: '🌀',
          bgColor: 'bg-purple-700',
          textColor: 'text-purple-200',
          tooltip: `Reality Tear - Distance: ${distance}`
        };
      case 'toxic_pool':
        return {
          content: '☢️',
          bgColor: 'bg-green-800',
          textColor: 'text-green-200',
          tooltip: `Toxic Pool (DEADLY) - Distance: ${distance}`
        };
      case 'lava_pit':
        return {
          content: '🔥',
          bgColor: 'bg-red-600',
          textColor: 'text-red-200',
          tooltip: `Lava Pit (DEADLY) - Distance: ${distance}`
        };
      default:
        // Normal terrain - show height
        const heightColor = height === 0 ? 'bg-gray-800' : 
                           height === 1 ? 'bg-gray-700' :
                           height === 2 ? 'bg-gray-600' :
                           height === 3 ? 'bg-gray-500' :
                           height === 4 ? 'bg-gray-400' : 'bg-gray-300';
        
        return {
          content: height.toString(),
          bgColor: heightColor,
          textColor: height >= 3 ? 'text-gray-800' : 'text-gray-200',
          tooltip: `Height: ${height} - Distance: ${distance}`
        };
    }
  }, [players, entityPositions, shipPos, facilityPos, fireExitPos, getSimpleTerrainType, selectedMoon, getDistance, floodLevel, getWeatherStatus]);

  // Generate grid data - much simpler
  const gridCells = useMemo(() => {
    const cells = [];
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const cellData = getCellData(x, y);
        const isSelected = selectedCell && selectedCell.x === x && selectedCell.y === y;
        const isCurrentPlayerPosition = movingPlayer && 
          movingPlayer.position?.exterior?.x === x && 
          movingPlayer.position?.exterior?.y === y;
        
        cells.push({
          key: `${x}-${y}`,
          x,
          y,
          isSelected,
          isCurrentPlayerPosition,
          ...cellData
        });
      }
    }
    return cells;
  }, [getCellData, selectedCell, movingPlayer]);

  // MODIFIED: Cell click handler to support movement mode
  const handleCellClick = useCallback((x, y) => {
    // If in player movement mode, handle movement
    if (isPlayerMovementMode) {
      handlePlayerMovementClick(x, y);
      return;
    }

    // Normal cell selection logic
    const cellKey = `${x},${y}`;
    const entity = entityPositions.get(cellKey);
    const distance = getDistance(x, y, shipPos.x, shipPos.y);
    const height = selectedMoon ? getHeightAt(selectedMoon, x, y) : 0;
    const terrainType = getSimpleTerrainType(x, y);
    
    setSelectedCell({
      x,
      y,
      distance,
      height,
      terrain: terrainType,
      entity: entity || null,
      players: players.filter(p => 
        p.position?.currentArea === 'exterior' &&
        p.position.exterior.x === x &&
        p.position.exterior.y === y
      )
    });
  }, [isPlayerMovementMode, handlePlayerMovementClick, entityPositions, getDistance, shipPos, selectedMoon, getSimpleTerrainType, setSelectedCell, players]);

  // FIXED: Entity movement data and logic
  const ENTITY_MOVEMENT_DATA = {
    "Forest Keeper": { rounds: 4 }, "Eyeless Dog": { rounds: 2 }, "Baboon Hawk": { rounds: 3 },
    "Earth Leviathan": { rounds: 6 }, "Kidnapper Fox": { rounds: 2 }, "Old Bird": { rounds: 3 },
    "Security Mech": { rounds: 3 }, "Garden Sprite": { rounds: 1 }, "Security Drone": { rounds: 2 },
    "Escaped Subject-X": { rounds: 2 }, "Corporate Sentinel": { rounds: 2 }, "Apocalypse Beast": { rounds: 5 },
    "Void Hunter": { rounds: 1 }, "Reality Tear": { rounds: 99 }, "Manticoil": { rounds: 1 },
    "Circuit Bee": { rounds: 1 }, "Tulip Snake": { rounds: 2 }, "Roaming Locusts": { rounds: 1 },
    "Pollinator Bot": { rounds: 4 }, "Maintenance Bot": { rounds: 5 }, "Executive Assistant Bot": { rounds: 3 },
    "Corporate Courier": { rounds: 2 }, "Nightmare Swarm": { rounds: 1 }, "Chaos Sprite": { rounds: 1 },
    "Void Mite": { rounds: 1 }, "Dimensional Parasite": { rounds: 99 }
  };

  // FIXED: Stable entity placement - only when entities actually change
  useEffect(() => {
    if (!gameStarted) return;

    const currentOutdoorIds = new Set([...entityPositions.values()].filter(e => e.type === 'outdoor').map(e => e.id));
    const currentDaytimeIds = new Set([...entityPositions.values()].filter(e => e.type === 'daytime').map(e => e.id));
    
    const newOutdoorIds = new Set(outdoorEntities.map(e => e.id));
    const newDaytimeIds = new Set(daytimeEntities.map(e => e.id));

    // Only update if entity lists actually changed
    const outdoorChanged = currentOutdoorIds.size !== newOutdoorIds.size || 
                          [...currentOutdoorIds].some(id => !newOutdoorIds.has(id)) ||
                          [...newOutdoorIds].some(id => !currentOutdoorIds.has(id));
    
    const daytimeChanged = currentDaytimeIds.size !== newDaytimeIds.size || 
                          [...currentDaytimeIds].some(id => !newDaytimeIds.has(id)) ||
                          [...newDaytimeIds].some(id => !currentDaytimeIds.has(id));

    if (!outdoorChanged && !daytimeChanged) return;

    const newEntityPositions = new Map();
    
    // Keep existing positions for entities that haven't changed
    entityPositions.forEach((entity, cellKey) => {
      if ((entity.type === 'outdoor' && newOutdoorIds.has(entity.id)) ||
          (entity.type === 'daytime' && newDaytimeIds.has(entity.id))) {
        newEntityPositions.set(cellKey, entity);
      }
    });

    // Add new outdoor entities
    const newOutdoorEntities = outdoorEntities.filter(entity => !currentOutdoorIds.has(entity.id));
    newOutdoorEntities.forEach((entity, index) => {
      let x, y, attempts = 0;
      do {
        x = Math.floor(Math.random() * GRID_SIZE);
        y = Math.floor(Math.random() * GRID_SIZE);
        attempts++;
      } while (
        attempts < 50 && (
          (x === shipPos.x && y === shipPos.y) ||
          (x === facilityPos.x && y === facilityPos.y) ||
          (x === fireExitPos.x && y === fireExitPos.y) ||
          newEntityPositions.has(`${x},${y}`)
        )
      );
      
      const cellKey = `${x},${y}`;
      newEntityPositions.set(cellKey, {
        ...entity,
        type: 'outdoor',
        icon: getEntityIcon(entity.name),
        x,
        y
      });

      // Initialize movement timer
      setEntityMovementTimers(prev => new Map(prev.set(entity.id, {
        spawnRound: currentRound,
        lastMoveRound: currentRound,
        nextMoveRound: currentRound + (ENTITY_MOVEMENT_DATA[entity.name]?.rounds || 3)
      })));
    });

    // Add new daytime entities
    const newDaytimeEntities = daytimeEntities.filter(entity => !currentDaytimeIds.has(entity.id));
    newDaytimeEntities.forEach((entity, index) => {
      let x, y, attempts = 0;
      do {
        x = Math.floor(Math.random() * GRID_SIZE);
        y = Math.floor(Math.random() * GRID_SIZE);
        attempts++;
      } while (
        attempts < 50 && (
          (x === shipPos.x && y === shipPos.y) ||
          (x === facilityPos.x && y === facilityPos.y) ||
          (x === fireExitPos.x && y === fireExitPos.y) ||
          newEntityPositions.has(`${x},${y}`)
        )
      );
      
      const cellKey = `${x},${y}`;
      newEntityPositions.set(cellKey, {
        ...entity,
        type: 'daytime',
        icon: getEntityIcon(entity.name),
        x,
        y
      });

      // Initialize movement timer
      setEntityMovementTimers(prev => new Map(prev.set(entity.id, {
        spawnRound: currentRound,
        lastMoveRound: currentRound,
        nextMoveRound: currentRound + (ENTITY_MOVEMENT_DATA[entity.name]?.rounds || 3)
      })));
    });

    setEntityPositions(newEntityPositions);

    // Update exterior entity data
    if (setExteriorEntityData) {
      const exteriorData = new Map();
      newEntityPositions.forEach((entity, cellKey) => {
        exteriorData.set(cellKey, entity);
      });
      setExteriorEntityData(exteriorData);
    }
  }, [gameStarted, outdoorEntities, daytimeEntities, shipPos, facilityPos, fireExitPos, 
      entityPositions, currentRound, setExteriorEntityData]);

  // FIXED: Controlled entity movement based on timers
  useEffect(() => {
    if (!gameStarted || currentRound <= 0) return;

    const newEntityPositions = new Map(entityPositions);
    let entitiesProcessed = 0;
    let entitiesMoved = 0;
    let entitiesFound = 0;

    entityPositions.forEach((entity, currentCellKey) => {
      const movementData = ENTITY_MOVEMENT_DATA[entity.name] || { rounds: 3 };
      const timerData = entityMovementTimers.get(entity.id);
      
      if (!timerData) return;

      const roundsSinceLastMove = currentRound - timerData.lastMoveRound;
      
      if (roundsSinceLastMove >= movementData.rounds) {
        // Try to move entity
        const directions = [[-1, 0], [0, -1], [0, 1], [1, 0]];
        const validMoves = [];
        
        directions.forEach(([dx, dy]) => {
          const newX = entity.x + dx;
          const newY = entity.y + dy;
          
          if (newX >= 0 && newX < GRID_SIZE && newY >= 0 && newY < GRID_SIZE) {
            const newCellKey = `${newX},${newY}`;
            const terrainType = getSimpleTerrainType(newX, newY);
            const isImpassable = ['cliff', 'void_zone', 'reality_tear', 'toxic_pool', 'lava_pit'].includes(terrainType);
            const isOccupied = (newX === shipPos.x && newY === shipPos.y) ||
                             (newX === facilityPos.x && newY === facilityPos.y) ||
                             (newX === fireExitPos.x && newY === fireExitPos.y) ||
                             newEntityPositions.has(newCellKey);
            
            if (!isImpassable && !isOccupied) {
              validMoves.push({ x: newX, y: newY, cellKey: newCellKey });
            }
          }
        });

        if (validMoves.length > 0) {
          // Move to random valid position
          const selectedMove = validMoves[Math.floor(Math.random() * validMoves.length)];
          
          // Remove from old position
          newEntityPositions.delete(currentCellKey);
          
          // Add to new position
          const updatedEntity = {
            ...entity,
            x: selectedMove.x,
            y: selectedMove.y
          };
          newEntityPositions.set(selectedMove.cellKey, updatedEntity);
          
          entitiesMoved++;

          // Update movement timer
          setEntityMovementTimers(prev => new Map(prev.set(entity.id, {
            ...timerData,
            lastMoveRound: currentRound,
            nextMoveRound: currentRound + movementData.rounds
          })));

          // Notify collision detection
          if (onEntityPlayerCollision) {
            onEntityPlayerCollision(entity.id, selectedMove.x, selectedMove.y, 'exterior');
          }
        }
      }
    });

    if (entitiesMoved > 0) {
      setEntityPositions(newEntityPositions);
      
      // Update exterior entity data
      if (setExteriorEntityData) {
        const exteriorData = new Map();
        newEntityPositions.forEach((entity, cellKey) => {
          exteriorData.set(cellKey, entity);
        });
        setExteriorEntityData(exteriorData);
      }
    }
  }, [currentRound, gameStarted, entityPositions, entityMovementTimers, shipPos, facilityPos, fireExitPos,
      getSimpleTerrainType, onEntityPlayerCollision, setExteriorEntityData]);

  // Simple terrain setup
  useEffect(() => {
    if (!selectedMoon) return;

    const newTerrainData = {};
    const staticFeatures = STATIC_TERRAIN_FEATURES[selectedMoon] || {};
    const newDynamicHazards = generateDynamicHazards(selectedMoon);

    // Process static features
    Object.entries(staticFeatures).forEach(([featureType, locations]) => {
      if (!Array.isArray(locations)) return;
      
      locations.forEach(location => {
        if (featureType === 'bridges' && location.tiles) {
          location.tiles.forEach(tile => {
            const key = `${tile.x},${tile.y}`;
            if (!newTerrainData[key]) newTerrainData[key] = [];
            newTerrainData[key].push('bridge');
          });
        } else if (location.x !== undefined && location.y !== undefined) {
          const key = `${location.x},${location.y}`;
          if (!newTerrainData[key]) newTerrainData[key] = [];
          newTerrainData[key].push(featureType.slice(0, -1)); // Remove 's' from plural
        }
      });
    });

    // Set both terrain data and dynamic hazards
    setTerrainData(newTerrainData);
    setDynamicHazards(newDynamicHazards);
  }, [selectedMoon]);

  // Simple entity icon getter
  const getEntityIcon = useCallback((entityName) => {
    const icons = {
      'Forest Keeper': '🌲', 'Eyeless Dog': '🐕', 'Baboon Hawk': '🦅',
      'Earth Leviathan': '🐛', 'Kidnapper Fox': '🦊', 'Old Bird': '🤖',
      'Security Mech': '🤖', 'Garden Sprite': '✨', 'Security Drone': '🚁',
      'Escaped Subject-X': '🧟', 'Corporate Sentinel': '🛡️', 'Apocalypse Beast': '🐲',
      'Void Hunter': '👻', 'Reality Tear': '🌀', 'Manticoil': '🦋',
      'Circuit Bee': '🐝', 'Tulip Snake': '🐍', 'Roaming Locusts': '🦗',
      'Pollinator Bot': '🤖', 'Maintenance Bot': '🔧', 'Executive Assistant Bot': '💼',
      'Corporate Courier': '📦', 'Nightmare Swarm': '🌫️', 'Chaos Sprite': '⚡',
      'Void Mite': '🕷️', 'Dimensional Parasite': '👽'
    };
    return icons[entityName] || '👹';
  }, []);

  // Get basic stats with weather info
  const stats = useMemo(() => {
    const weatherStatus = getWeatherStatus();
    return {
      totalEntities: outdoorEntities.length + daytimeEntities.length,
      outdoorEntities: outdoorEntities.length,
      daytimeEntities: daytimeEntities.length,
      weather: currentWeatherType || 'Clear',
      moon: selectedMoon || 'None',
      weatherStatus
    };
  }, [outdoorEntities.length, daytimeEntities.length, currentWeatherType, selectedMoon, getWeatherStatus]);

  if (!selectedMoon && !gameStarted) {
    return (
      <div className="text-center text-slate-300 py-12">
        <div className="text-4xl mb-4">🗺️</div>
        <h2 className="text-xl font-semibold mb-2 text-white">Tactical Exterior Grid</h2>
        <p className="text-slate-400">Start a mission to view the outdoor tactical map</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Header Stats Bar */}
      <div className="bg-slate-800 p-3 rounded-lg border border-slate-600">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <span className="text-slate-400">Moon:</span>
              <span className="text-white font-semibold">{stats.moon}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-slate-400">Round:</span>
              <span className="text-white font-semibold">{currentRound}/128</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-slate-400">Entities:</span>
              <span className="text-white font-semibold">{stats.totalEntities}</span>
              <span className="text-slate-500">({stats.outdoorEntities}🌙 + {stats.daytimeEntities}☀️)</span>
            </div>
          </div>
          
          {/* Weather Indicator */}
          <div className="flex items-center space-x-2">
            <span className="text-slate-400">Weather:</span>
            <div className="flex items-center space-x-1">
              <span>
                {currentWeatherType === 'rainy' ? '🌧️' :
                 currentWeatherType === 'stormy' ? '⚡' :
                 currentWeatherType === 'foggy' ? '🌫️' :
                 currentWeatherType === 'flooded' ? '🌊' :
                 currentWeatherType === 'eclipsed' ? '🌑' : '☀️'}
              </span>
              <span className={`font-semibold ${
                stats.weatherStatus.severity === 'moderate' ? 'text-orange-400' :
                stats.weatherStatus.severity === 'high' ? 'text-red-400' :
                stats.weatherStatus.severity === 'critical' ? 'text-purple-400' :
                stats.weatherStatus.severity === 'lethal' ? 'text-red-600' :
                'text-green-400'
              }`}>
                {stats.weatherStatus.phase}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Player Movement Mode Banner */}
      {isPlayerMovementMode && movingPlayer && (
        <div className="bg-cyan-500/20 border border-cyan-400/30 rounded-lg p-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <span className="text-cyan-300 font-semibold">📍 Moving: {movingPlayer.name}</span>
              <span className="text-cyan-200 text-sm">Click any cell to move there</span>
            </div>
            <button
              onClick={cancelPlayerMovement}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
        
        {/* Tactical Grid */}
        <div className="xl:col-span-3">
          <div className="bg-slate-800 p-4 rounded-lg border border-slate-600">
            <div 
              className="grid gap-0.5 mx-auto bg-slate-900 p-2 rounded"
              style={{
                width: 'fit-content',
                gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`
              }}
            >
              {gridCells.map((cell) => (
                <SimpleCell
                  key={cell.key}
                  x={cell.x}
                  y={cell.y}
                  content={cell.content}
                  bgColor={cell.bgColor}
                  textColor={cell.textColor}
                  isSelected={cell.isSelected}
                  tooltip={cell.tooltip}
                  onClick={() => handleCellClick(cell.x, cell.y)}
                  isPlayerMovementMode={isPlayerMovementMode}
                  isCurrentPlayerPosition={cell.isCurrentPlayerPosition}
                  movingPlayer={movingPlayer}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar - Stacked Info Panels */}
        <div className="space-y-3">
          
          {/* Selected Cell Info */}
          {selectedCell && (
            <div className="bg-slate-700 p-3 rounded border border-slate-500">
              <h4 className="font-bold text-white mb-2 text-sm">📍 ({selectedCell.x}, {selectedCell.y})</h4>
              
              {/* Basic Cell Info */}
              <div className="text-xs text-slate-200 space-y-1 mb-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>Height: {selectedCell.height}/5</div>
                  <div>Distance: {selectedCell.distance}</div>
                </div>
                <div className="text-slate-300 capitalize">{selectedCell.terrain.replace('_', ' ')}</div>
              </div>
              
              {/* Entity Info */}
              {selectedCell.entity && (
                <div className="bg-red-600/80 p-2 rounded text-white mb-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-sm">{selectedCell.entity.name}</span>
                    <span className="text-xs bg-red-700 px-1 rounded">Lv{selectedCell.entity.powerLevel}</span>
                  </div>
                  <div className="flex space-x-1">
                    {onEntityEncounter && (
                      <button
                        onClick={() => onEntityEncounter(selectedCell.entity)}
                        className="bg-orange-500 hover:bg-orange-600 px-2 py-1 rounded text-xs flex-1"
                      >
                        ⚔️ Fight
                      </button>
                    )}
                    {onEntityDefeat && (
                      <button
                        onClick={() => {
                          if (confirm(`Defeat ${selectedCell.entity.name}?`)) {
                            onEntityDefeat({ id: selectedCell.entity.id });
                            setSelectedCell(null);
                          }
                        }}
                        className="bg-red-500 hover:bg-red-600 px-2 py-1 rounded text-xs flex-1"
                      >
                        💀 Kill
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Player Info */}
              {selectedCell.players && selectedCell.players.length > 0 && (
                <div className="bg-cyan-600/80 p-2 rounded text-white">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-sm">👥 Players ({selectedCell.players.length})</span>
                  </div>
                  <div className="space-y-1">
                    {selectedCell.players.map(player => (
                      <div key={player.id} className="flex items-center justify-between text-xs bg-cyan-700/50 p-1 rounded">
                        <span>{player.name}</span>
                        <span>W: {player.wounds}/{player.maxWounds}</span>
                        <span>S: {player.strain}/{player.maxStrain}</span>
                        <button
                          onClick={() => startPlayerMovement(player)}
                          className="bg-cyan-500 hover:bg-cyan-600 px-2 py-0.5 rounded text-xs"
                        >
                          📍 Move
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Weather Effects Panel */}
          {currentWeatherType && currentWeatherType !== 'clear' ? (
            <div className="bg-slate-700 p-3 rounded border border-slate-500">
              <h4 className="font-bold text-white mb-2 text-sm flex items-center">
                <span className="mr-1">
                  {currentWeatherType === 'rainy' ? '🌧️' :
                   currentWeatherType === 'stormy' ? '⚡' :
                   currentWeatherType === 'foggy' ? '🌫️' :
                   currentWeatherType === 'flooded' ? '🌊' :
                   currentWeatherType === 'eclipsed' ? '🌑' : '🌦️'}
                </span>
                Weather Effects
              </h4>
              
              {/* Key Stats Row */}
              <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                <div className="bg-slate-800 p-1 rounded text-center">
                  <div className="text-slate-400">Level</div>
                  <div className={`font-bold ${
                    stats.weatherStatus.severity === 'moderate' ? 'text-orange-400' :
                    stats.weatherStatus.severity === 'high' ? 'text-red-400' :
                    stats.weatherStatus.severity === 'critical' ? 'text-purple-400' :
                    stats.weatherStatus.severity === 'lethal' ? 'text-red-600' :
                    'text-white'
                  }`}>
                    {stats.weatherStatus.level}
                  </div>
                </div>
                <div className="bg-slate-800 p-1 rounded text-center">
                  <div className="text-slate-400">Severity</div>
                  <div className="text-white font-bold capitalize text-xs">
                    {stats.weatherStatus.severity}
                  </div>
                </div>
              </div>
              
              {/* Next Event */}
              <div className="bg-slate-800/50 p-2 rounded mb-2">
                <div className="text-slate-300 text-xs mb-1">Next:</div>
                <div className="text-white text-xs font-medium">{stats.weatherStatus.nextEvent}</div>
              </div>
              
              {/* Effects List - Compact */}
              <div className="space-y-1">
                {stats.weatherStatus.effects.slice(0, 3).map((effect, index) => (
                  <div key={index} className="text-white text-xs bg-slate-800/30 p-1 rounded">
                    • {effect}
                  </div>
                ))}
                {stats.weatherStatus.effects.length > 3 && (
                  <div className="text-slate-400 text-xs">+ {stats.weatherStatus.effects.length - 3} more effects</div>
                )}
              </div>
              
              {/* Quick Dice Reference - Collapsed */}
              <details className="mt-2">
                <summary className="text-yellow-300 text-xs font-semibold cursor-pointer hover:text-yellow-200">
                  🎲 Dice Reference
                </summary>
                <div className="mt-1 text-xs text-slate-200 bg-slate-800/50 p-2 rounded">
                  {currentWeatherType === 'rainy' && (
                    <>
                      <div>Spot: Perception vs 2</div>
                      <div>Escape: Athletics vs 3</div>
                    </>
                  )}
                  {currentWeatherType === 'stormy' && (
                    <>
                      <div>Detect: Vigilance vs 1</div>
                      <div>Damage: 12 wounds + Crit</div>
                    </>
                  )}
                  {currentWeatherType === 'foggy' && (
                    <>
                      <div>Perception: +{stats.weatherStatus.level} Setback</div>
                      <div>Navigate: Survival vs 1-3</div>
                    </>
                  )}
                  {currentWeatherType === 'flooded' && (
                    <>
                      <div>Move: +{Math.min(5, Math.floor(currentRound / 20) + 1)} Setback</div>
                      <div>Swim: Athletics vs 2-3</div>
                    </>
                  )}
                  {currentWeatherType === 'eclipsed' && (
                    <>
                      <div>Fear: Discipline vs 2</div>
                      <div>Strain: 1/round outside</div>
                    </>
                  )}
                </div>
              </details>
            </div>
          ) : (
            <div className="bg-green-700/20 p-3 rounded border border-green-500/30">
              <h4 className="font-bold text-green-300 mb-1 text-sm flex items-center">
                <span className="mr-1">☀️</span>
                Clear Weather
              </h4>
              <div className="text-xs text-green-200">
                No penalties • Standard mechanics
              </div>
            </div>
          )}

          {/* Quick Legend */}
          <div className="bg-slate-700 p-3 rounded border border-slate-500">
            <h4 className="font-bold text-white mb-2 text-sm">🗺️ Legend</h4>
            <div className="grid grid-cols-2 gap-1 text-xs">
              <div className="flex items-center space-x-1">
                <span>🚀</span><span className="text-slate-300">Ship</span>
              </div>
              <div className="flex items-center space-x-1">
                <span>🏭</span><span className="text-slate-300">Facility</span>
              </div>
              <div className="flex items-center space-x-1">
                <span>👤</span><span className="text-slate-300">Players</span>
              </div>
              <div className="flex items-center space-x-1">
                <span>👹</span><span className="text-slate-300">Entities</span>
              </div>
              <div className="flex items-center space-x-1">
                <span>0-5</span><span className="text-slate-300">Height</span>
              </div>
              <div className="flex items-center space-x-1">
                <span>🌊</span><span className="text-slate-300">Hazards</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TacticalGrid;