import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { 
  GRID_SIZE,
  TERRAIN_CODES,
  HEIGHT_MAPS,
  getHeightAt,
  getTerrainAt,
  getShipPosition,
  getFacilityPosition,
  getFireExitPosition
} from './moonData.jsx';
import { updatePlayerHealth } from './playerManager.jsx';
import { isEntityAtMaxRage } from './rageSystem.jsx';

// Simple cell component
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
  isCurrentPlayerPosition
}) => {
  let cellClass = `
    w-8 h-8 border border-gray-600 flex items-center justify-center text-xs cursor-pointer
    ${bgColor} ${textColor} ${isSelected ? 'ring-2 ring-blue-400' : ''}
    hover:scale-110 transition-transform duration-100
  `;

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
});

const TacticalGrid = ({ 
  selectedMoon,
  currentWeatherType,
  quicksandLocations = [],
  currentRound,
  selectedCell,
  setSelectedCell,
  floodedCells = new Set(),
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
  onPlayerPositionChange,
  setPlayers,
  rageSystem
}) => {
  
  // Core state
  const [entityPositions, setEntityPositions] = useState(new Map());
  const [entityMovementTimers, setEntityMovementTimers] = useState(new Map());
  const [scheduledLeviathan, setScheduledLeviathan] = useState(null);
  
  // Player movement state
  const [isPlayerMovementMode, setIsPlayerMovementMode] = useState(false);
  const [movingPlayer, setMovingPlayer] = useState(null);

  // Position getters
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

  // Player movement functions
  const startPlayerMovement = (player) => {
    setMovingPlayer(player);
    setIsPlayerMovementMode(true);
  };

  const handlePlayerMovementClick = (x, y) => {
    if (!isPlayerMovementMode || !movingPlayer) return;

    const additionalData = { terrain: getTerrainType(x, y) };

    if (onPlayerPositionChange) {
      onPlayerPositionChange(movingPlayer.id, 'exterior', x, y, additionalData);
    }

    const updatedMovingPlayer = {
      ...movingPlayer,
      position: {
        ...movingPlayer.position,
        exterior: { x, y, terrain: additionalData.terrain },
        currentArea: 'exterior'
      }
    };
    setMovingPlayer(updatedMovingPlayer);

    setTimeout(() => {
      setIsPlayerMovementMode(false);
      setMovingPlayer(null);
      setSelectedCell(null);
    }, 100);
  };

  const cancelPlayerMovement = () => {
    setIsPlayerMovementMode(false);
    setMovingPlayer(null);
  };

  const quickAdjustPlayerHealth = (playerId, type, amount) => {
    const player = players.find(p => p.id === playerId);
    if (!player) return;

    const currentValue = player[type];
    const maxValue = player[`max${type.charAt(0).toUpperCase() + type.slice(1)}`];
    const absoluteMax = type === 'wounds' ? maxValue * 2 : maxValue;
    const newValue = Math.max(0, Math.min(absoluteMax, currentValue + amount));

    updatePlayerHealth(players, setPlayers, playerId, 
      type === 'wounds' ? newValue : player.wounds,
      type === 'strain' ? newValue : player.strain
    );
  };

  // Get terrain type for a cell
  const getTerrainType = useCallback((x, y) => {
    if (!selectedMoon) return 'normal';

    // Weather effects override terrain
    if (currentWeatherType === 'rainy') {
      const hasQuicksand = quicksandLocations.some(loc => loc.x === x && loc.y === y);
      if (hasQuicksand) return 'quicksand';
    }

    if (currentWeatherType === 'flooded') {
      const cellKey = `${x},${y}`;
      if (floodedCells.has(cellKey)) return 'flooded';
    }

    if (currentWeatherType === 'stormy') {
      const recentLightning = lightningStrikes.find(strike => 
        strike.x === x && strike.y === y && (currentRound - strike.round) <= 2
      );
      if (recentLightning) return 'lightning_strike';
    }

    // Get terrain from height map
    const terrainCode = getTerrainAt(selectedMoon, x, y);
    
    switch (terrainCode) {
      case 'W': return 'water';
      case 'B': return 'bridge';
      case 'T': return 'trees';
      case 'R': return 'rocks';
      case 'L': return 'lava_pit';
      case 'G': return 'gas_vent';
      case 'M': return 'metallic_growth';
      case 'P': return 'radiation_puddle';
      case 'A': return 'acid_pool';
      case 'V': return 'steam_vent';
      case 'X': return 'toxic_pool';
      case 'Q': return 'quicksand_permanent';
      case 'I': return 'ice_patch';
      case 'C': return 'cliff';
      case 'F': return 'forest';
      case 'H': return 'facility';
      case 'S': return 'ship';
      case 'E': return 'fire_exit';
      default: return 'normal';
    }
  }, [selectedMoon, currentWeatherType, quicksandLocations, floodedCells, lightningStrikes, currentRound]);

  // Get weather status
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
        const roundsSinceFloodStart = Math.max(0, currentRound - 20);
        const floodPhase = currentRound < 20 ? 0 : Math.floor(roundsSinceFloodStart / 20) + 1;
        const nextFloodRound = currentRound < 20 ? 20 : 20 + (floodPhase * 20);
        const totalFloodedCells = floodedCells.size;
        const floodCoverage = Math.round((totalFloodedCells / (GRID_SIZE * GRID_SIZE)) * 100);
            
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

  // Get cell display data
  const getCellData = useCallback((x, y) => {
    const cellKey = `${x},${y}`;
    
    // Check for players first
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

    // Get terrain and height
    const terrainType = getTerrainType(x, y);
    const height = selectedMoon ? getHeightAt(selectedMoon, x, y) : 0;
    
    // Special locations and terrain
    switch (terrainType) {
      case 'ship':
        return {
          content: '🚀',
          bgColor: 'bg-blue-500',
          textColor: 'text-white',
          tooltip: 'Ship Landing Zone'
        };
      case 'facility':
        return {
          content: '🏭',
          bgColor: 'bg-orange-500',
          textColor: 'text-white',
          tooltip: 'Company Facility'
        };
      case 'fire_exit':
        return {
          content: '🚪',
          bgColor: 'bg-green-500',
          textColor: 'text-white',
          tooltip: 'Fire Exit'
        };
      case 'water':
        return {
          content: '🌊',
          bgColor: 'bg-blue-600',
          textColor: 'text-blue-100',
          tooltip: `Water (Height: ${height})`
        };
      case 'bridge':
        return {
          content: '🌉',
          bgColor: 'bg-yellow-600',
          textColor: 'text-yellow-100',
          tooltip: `Bridge (Height: ${height})`
        };
      case 'trees':
        return {
          content: '🌲',
          bgColor: 'bg-green-600',
          textColor: 'text-green-100',
          tooltip: `Trees (Height: ${height})`
        };
      case 'rocks':
        return {
          content: '🪨',
          bgColor: 'bg-gray-600',
          textColor: 'text-gray-100',
          tooltip: `Rocky Outcrop (Height: ${height})`
        };
      case 'lava_pit':
        return {
          content: '🔥',
          bgColor: 'bg-red-600',
          textColor: 'text-red-200',
          tooltip: `Lava Pit (DEADLY) (Height: ${height})`
        };
      case 'gas_vent':
        return {
          content: '☁️',
          bgColor: 'bg-yellow-700',
          textColor: 'text-yellow-200',
          tooltip: `Poisonous Gas Vent (Height: ${height})`
        };
      case 'metallic_growth':
        return {
          content: '⚡',
          bgColor: 'bg-purple-600',
          textColor: 'text-purple-100',
          tooltip: `Metallic Growth (Height: ${height})`
        };
      case 'radiation_puddle':
        return {
          content: '☢️',
          bgColor: 'bg-green-700',
          textColor: 'text-green-200',
          tooltip: `Radiation Puddle (Height: ${height})`
        };
      case 'toxic_pool':
        return {
          content: '☢️',
          bgColor: 'bg-green-800',
          textColor: 'text-green-200',
          tooltip: `Toxic Pool (DEADLY) (Height: ${height})`
        };
      case 'quicksand':
        return {
          content: '🕳️',
          bgColor: 'bg-yellow-700',
          textColor: 'text-yellow-200',
          tooltip: `Quicksand (Rain Weather) (Height: ${height}) - ESCAPE: Athletics vs 3 Difficulty`
        };
      case 'flooded':
        return {
          content: '🌊',
          bgColor: 'bg-blue-700',
          textColor: 'text-blue-200',
          tooltip: `Flooded Zone (Height: ${height})`
        };
      case 'lightning_strike':
        return {
          content: '⚡',
          bgColor: 'bg-yellow-500',
          textColor: 'text-yellow-100',
          tooltip: `Recent Lightning Strike (Height: ${height})`
        };
      case 'ice_patch':
        return {
          content: '❄️',
          bgColor: 'bg-blue-400',
          textColor: 'text-blue-100',
          tooltip: `Ice Patch (Height: ${height})`
        };
      case 'cliff':
        return {
          content: '⛰️',
          bgColor: 'bg-gray-700',
          textColor: 'text-gray-200',
          tooltip: `Cliff (Height: ${height})`
        };
      case 'forest':
        return {
          content: '🌲',
          bgColor: 'bg-green-700',
          textColor: 'text-green-200',
          tooltip: `Forest (Height: ${height})`
        };
      default:
        // Normal terrain - show height
        const heightColor = height === 0 ? 'bg-gray-800' : 
                           height === 1 ? 'bg-gray-700' :
                           height === 2 ? 'bg-gray-600' :
                           height === 3 ? 'bg-gray-500' :
                           height === 4 ? 'bg-gray-400' : 
                           height >= 5 ? 'bg-gray-300' : 'bg-gray-800';
        
        return {
          content: height.toString(),
          bgColor: heightColor,
          textColor: height >= 3 ? 'text-gray-800' : 'text-gray-200',
          tooltip: `Height: ${height}`
        };
    }
  }, [players, entityPositions, getTerrainType, selectedMoon]);

  // Generate grid cells
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

  // Cell click handler
  const handleCellClick = useCallback((x, y) => {
    if (isPlayerMovementMode) {
      handlePlayerMovementClick(x, y);
      return;
    }

    const cellKey = `${x},${y}`;
    const entity = entityPositions.get(cellKey);
    const height = selectedMoon ? getHeightAt(selectedMoon, x, y) : 0;
    const terrainType = getTerrainType(x, y);
    
    setSelectedCell({
      x,
      y,
      height,
      terrain: terrainType,
      entity: entity || null,
      players: players.filter(p => 
        p.position?.currentArea === 'exterior' &&
        p.position.exterior.x === x &&
        p.position.exterior.y === y
      )
    });
  }, [isPlayerMovementMode, handlePlayerMovementClick, entityPositions, selectedMoon, getTerrainType, setSelectedCell, players]);

  // Update selected cell when players change
  useEffect(() => {
    if (selectedCell) {
      const updatedPlayers = players.filter(p => 
        p.position?.currentArea === 'exterior' &&
        p.position.exterior.x === selectedCell.x &&
        p.position.exterior.y === selectedCell.y
      );
      
      if (JSON.stringify(updatedPlayers) !== JSON.stringify(selectedCell.players)) {
        setSelectedCell(prev => ({
          ...prev,
          players: updatedPlayers
        }));
      }
    }
  }, [players, selectedCell, setSelectedCell]);

  // Entity movement data
  const ENTITY_MOVEMENT_DATA = {
    "Forest Keeper": { passive: 4, chasing: 2 }, 
    "Eyeless Dog": { passive: 2, chasing: 1 }, 
    "Baboon Hawk": { passive: 3, chasing: 1 },
    "Earth Leviathan": { passive: 6, chasing: 3 }, 
    "Old Bird": { passive: 3, chasing: 1 },
    "Manticoil": { passive: 3, chasing: 3 },
    "Circuit Bee": { passive: 999, chasing: 999 }, 
    "Tulip Snake": { passive: 2, chasing: 2 }, 
    "Roaming Locust": { passive: 3, chasing: 3 }
  };

  const getClosestPlayer = (entityX, entityY) => {
    const playersOnExterior = players.filter(player => 
      player.position?.currentArea === 'exterior'
    );

    if (playersOnExterior.length === 0) return null;

    let closestPlayer = null;
    let closestDistance = Infinity;

    playersOnExterior.forEach(player => {
      const distance = Math.abs(player.position.exterior.x - entityX) + Math.abs(player.position.exterior.y - entityY);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestPlayer = player;
      }
    });

    return { player: closestPlayer, distance: closestDistance };
  };

  // Entity placement effect
  useEffect(() => {
    if (!gameStarted) return;

    const currentOutdoorIds = new Set([...entityPositions.values()].filter(e => e.type === 'outdoor').map(e => e.id));
    const currentDaytimeIds = new Set([...entityPositions.values()].filter(e => e.type === 'daytime').map(e => e.id));
    
    const newOutdoorIds = new Set(outdoorEntities.map(e => e.id));
    const newDaytimeIds = new Set(daytimeEntities.map(e => e.id));

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
    newOutdoorEntities.forEach((entity) => {
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

      setEntityMovementTimers(prev => new Map(prev.set(entity.id, {
        spawnRound: currentRound,
        lastMoveRound: currentRound,
        nextMoveRound: currentRound + (ENTITY_MOVEMENT_DATA[entity.name]?.passive || 3)
      })));
    });

    // Add new daytime entities
    const newDaytimeEntities = daytimeEntities.filter(entity => !currentDaytimeIds.has(entity.id));
    newDaytimeEntities.forEach((entity) => {
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

      setEntityMovementTimers(prev => new Map(prev.set(entity.id, {
        spawnRound: currentRound,
        lastMoveRound: currentRound,
        nextMoveRound: currentRound + (ENTITY_MOVEMENT_DATA[entity.name]?.passive || 3)
      })));
    });

    setEntityPositions(newEntityPositions);

    if (setExteriorEntityData) {
      const exteriorData = new Map();
      newEntityPositions.forEach((entity, cellKey) => {
        exteriorData.set(cellKey, entity);
      });
      setExteriorEntityData(exteriorData);
    }
  }, [gameStarted, outdoorEntities, daytimeEntities, shipPos, facilityPos, fireExitPos, entityPositions, currentRound, setExteriorEntityData]);

  // Entity movement effect
  useEffect(() => {
    if (!gameStarted || currentRound <= 0) return;

    const newEntityPositions = new Map(entityPositions);
    let entitiesMoved = 0;

    // ===== HANDLE SCHEDULED EARTH LEVIATHAN TELEPORT =====
    if (scheduledLeviathan && scheduledLeviathan.executeOnRound === currentRound) {
      const leviathanEntity = [...entityPositions.values()].find(e => e.id === scheduledLeviathan.entityId);

      if (leviathanEntity) {
        const eligiblePlayers = players.filter(p => 
          p.position?.currentArea === 'exterior' &&
          !(p.position.exterior.x === shipPos.x && p.position.exterior.y === shipPos.y)
        );

        if (eligiblePlayers.length > 0) {
          const randomPlayer = eligiblePlayers[Math.floor(Math.random() * eligiblePlayers.length)];
          const targetX = randomPlayer.position.exterior.x;
          const targetY = randomPlayer.position.exterior.y;

          // Remove from current position
          const currentCellKey = `${leviathanEntity.x},${leviathanEntity.y}`;
          newEntityPositions.delete(currentCellKey);

          // Teleport to player's location
          const updatedEntity = {
            ...leviathanEntity,
            x: targetX,
            y: targetY
          };
          const newCellKey = `${targetX},${targetY}`;
          newEntityPositions.set(newCellKey, updatedEntity);
          entitiesMoved++;

          if (onEntityPlayerCollision) {
            onEntityPlayerCollision(leviathanEntity.id, targetX, targetY, 'exterior');
          }
        }
      }

      // Clear the scheduled teleport
      setScheduledLeviathan(null);
    }

    entityPositions.forEach((entity, currentCellKey) => {
      const movementData = ENTITY_MOVEMENT_DATA[entity.name];
      if (!movementData) return;

      // Check if entity is on same tile as any player - NO MOVEMENT DURING COMBAT
      const playersOnSameTile = players?.filter(player => 
        player.position?.currentArea === 'exterior' &&
        player.position.exterior.x === entity.x &&
        player.position.exterior.y === entity.y
      ) || [];

      if (playersOnSameTile.length > 0) {
        // Entity is in combat/same tile as player - cannot move
        return;
      }

      // Check for rage-induced chasing
      const isAtMaxRage = isEntityAtMaxRage(entity.id) || false;

      const isRageEntity = [
        "Earth Leviathan",
        "Eyeless Dog", 
        "Forest Keeper"
      ].includes(entity.name);

      // ===== EARTH LEVIATHAN SPECIAL BEHAVIOR =====
      if (entity.name === "Earth Leviathan") {
        if (!isAtMaxRage) {
          // Earth Leviathan doesn't move until max rage
          return;
        } else {
          // At max rage: schedule teleport for NEXT round
          if (!scheduledLeviathan || scheduledLeviathan.entityId !== entity.id) {
            setScheduledLeviathan({
              entityId: entity.id,
              executeOnRound: currentRound + 1
            });
          }
          return;
        }
      }

      // ===== EYELESS DOG & FOREST KEEPER BEHAVIOR =====
      let isChasing = false;

      if (entity.name === "Eyeless Dog" || entity.name === "Forest Keeper") {
        // Only chase when at max rage
        if (isAtMaxRage) {
          isChasing = true;
        }
        // Otherwise just wander (isChasing = false)
      } else {
        // All other entities use 5-tile proximity for chasing
        const playersNearby = arePlayersNearEntity(entity.x, entity.y, entity.name, false, false);
        isChasing = playersNearby;
      }

      const movementRounds = isChasing ? movementData.chasing : movementData.passive;
      if (movementRounds >= 999) return;

      let timerData = entityMovementTimers.get(entity.id);
      if (!timerData) {
        const newTimerData = {
          spawnRound: currentRound,
          lastMoveRound: currentRound - movementRounds,
          nextMoveRound: currentRound,
          isChasing: isChasing
        };
        setEntityMovementTimers(prev => new Map(prev.set(entity.id, newTimerData)));
        timerData = newTimerData;
      }

      if (isChasing && !timerData.isChasing) {
        setEntityMovementTimers(prev => {
          const newTimers = new Map(prev);
          newTimers.set(entity.id, {
            ...timerData,
            nextMoveRound: currentRound + 1,
            isChasing: true
          });
          return newTimers;
        });
        return;
      }

      if (timerData.isChasing !== isChasing) {
        setEntityMovementTimers(prev => {
          const newTimers = new Map(prev);
          newTimers.set(entity.id, {
            ...timerData,
            isChasing: isChasing
          });
          return newTimers;
        });
      }

      if (currentRound >= timerData.nextMoveRound) {
        // ===== DOUBLE MOVEMENT FOR ALL ENTITIES =====
        let currentPos = { x: entity.x, y: entity.y };
        let movesSuccessful = 0;

        for (let moveNum = 0; moveNum < 2; moveNum++) {
          const moveResult = executeSingleMove(
            entity,
            currentPos.x,
            currentPos.y,
            isChasing,
            newEntityPositions
          );

          if (moveResult.success) {
            currentPos = { x: moveResult.newX, y: moveResult.newY };
            movesSuccessful++;

            // Check if entity hit a player - STOP movement
            const playerAtNewPos = players?.some(p => 
              p.position?.currentArea === 'exterior' &&
              p.position.exterior.x === moveResult.newX &&
              p.position.exterior.y === moveResult.newY
            );

            if (playerAtNewPos) {
              if (onEntityPlayerCollision) {
                onEntityPlayerCollision(entity.id, moveResult.newX, moveResult.newY, 'exterior');
              }
              break; // Stop moving if hit player
            }
          } else {
            break; // Stop if movement fails
          }
        }

        if (movesSuccessful > 0) {
          entitiesMoved++;
          setEntityMovementTimers(prev => new Map(prev.set(entity.id, {
            ...timerData,
            lastMoveRound: currentRound,
            nextMoveRound: currentRound + movementRounds,
            isChasing: isChasing
          })));
        }
      }
    });

    if (entitiesMoved > 0) {
      setEntityPositions(newEntityPositions);

      if (setExteriorEntityData) {
        const exteriorData = new Map();
        newEntityPositions.forEach((entity, cellKey) => {
          exteriorData.set(cellKey, entity);
        });
        setExteriorEntityData(exteriorData);
      }
    }
  }, [currentRound, gameStarted, entityPositions, entityMovementTimers, shipPos, facilityPos, fireExitPos, selectedMoon, onEntityPlayerCollision, setExteriorEntityData, rageSystem, players, scheduledLeviathan]);

  // NEW HELPER FUNCTION: Execute a single move for an entity
  const executeSingleMove = (entity, currentX, currentY, isChasing, positionsMap) => {
    const directions = [[-1, 0], [0, -1], [0, 1], [1, 0]];
    const validMoves = [];
  
    directions.forEach(([dx, dy]) => {
      const newX = currentX + dx;
      const newY = currentY + dy;
    
      if (newX >= 0 && newX < GRID_SIZE && newY >= 0 && newY < GRID_SIZE) {
        const newCellKey = `${newX},${newY}`;
        const terrainCode = selectedMoon ? getTerrainAt(selectedMoon, newX, newY) : '~';
        const isImpassable = ['L', 'G', 'X', 'C'].includes(terrainCode); // lava, gas, toxic, cliff
        const isOccupied = (newX === shipPos.x && newY === shipPos.y) ||
                         (newX === facilityPos.x && newY === facilityPos.y) ||
                         (newX === fireExitPos.x && newY === fireExitPos.y) ||
                         positionsMap.has(newCellKey);
      
        if (!isImpassable && !isOccupied) {
          validMoves.push({ x: newX, y: newY, cellKey: newCellKey });
        }
      }
    });
  
    if (validMoves.length === 0) {
      return { success: false, reason: 'No valid moves' };
    }
  
    let selectedMove;
  
    if (isChasing) {
      // Move towards closest player
      const closestPlayerData = getClosestPlayer(currentX, currentY);
      if (closestPlayerData && closestPlayerData.player) {
        const targetX = closestPlayerData.player.position.exterior.x;
        const targetY = closestPlayerData.player.position.exterior.y;
      
        let bestDistance = Infinity;
        let bestMove = null;
      
        validMoves.forEach(move => {
          const distance = Math.abs(move.x - targetX) + Math.abs(move.y - targetY);
          if (distance < bestDistance) {
            bestDistance = distance;
            bestMove = move;
          }
        });
      
        selectedMove = bestMove || validMoves[0];
      } else {
        selectedMove = validMoves[Math.floor(Math.random() * validMoves.length)];
      }
    } else {
      // Random movement
      selectedMove = validMoves[Math.floor(Math.random() * validMoves.length)];
    }
  
    if (selectedMove) {
      const currentCellKey = `${currentX},${currentY}`;
      positionsMap.delete(currentCellKey);
      const updatedEntity = {
        ...entity,
        x: selectedMove.x,
        y: selectedMove.y
      };
      positionsMap.set(selectedMove.cellKey, updatedEntity);
    
      return { 
        success: true, 
        newX: selectedMove.x, 
        newY: selectedMove.y,
        cellKey: selectedMove.cellKey
      };
    }
  
    return { success: false, reason: 'No move selected' };
  };

  // Entity icon getter
  const getEntityIcon = useCallback((entityName) => {
    const icons = {
      'Forest Keeper': '🌲', 'Eyeless Dog': '🐕', 'Baboon Hawk': '🦅',
      'Earth Leviathan': '🐛', 'Kidnapper Fox': '🦊', 'Old Bird': '🤖',
      'Manticoil': '🦋', 'Circuit Bee': '🐝', 'Tulip Snake': '🐍', 
      'Roaming Locust': '🦗'
    };
    return icons[entityName] || '👹';
  }, []);

  // Helper functions for entity movement
  const arePlayersNearEntity = (entityX, entityY, entityName = null, rageEntity = false, isChasing = false) => {
    const playersNearby = players.filter(player => {
      if (player.position?.currentArea !== 'interior') return false;

      // Jester always has map-wide detection regardless of chasing state
      if (rageEntity && (entityName === "Jester" || entityName === "Jester (Jack-in-the-Box)")) {
        return true;
      }

      // Other rage entities only get map-wide detection when actively chasing
      if (rageEntity && isChasing) {
        return true;
      }

      // Standard 5-tile range for all other cases
      const distance = Math.abs(player.position.interior.x - entityX) + Math.abs(player.position.interior.y - entityY);
      return distance <= 5;
    });

    return playersNearby.length > 0;
  };

  // Get stats with weather info
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
              
              <div className="text-xs text-slate-200 space-y-1 mb-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>Height: {selectedCell.height}/8</div>
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
                  <div className="space-y-2">
                    {selectedCell.players.map(player => {
                      const woundPercent = Math.round((player.wounds / player.maxWounds) * 100);
                      const strainPercent = Math.round((player.strain / player.maxStrain) * 100);

                      return (
                        <div key={player.id} className="bg-cyan-700/50 p-2 rounded">
                          <div className="flex items-center justify-between text-xs mb-2">
                            <span className="font-medium">{player.name}</span>
                            <button
                              onClick={() => startPlayerMovement(player)}
                              className="bg-cyan-500 hover:bg-cyan-600 px-2 py-0.5 rounded text-xs"
                            >
                              📍 Move
                            </button>
                          </div>

                          {/* Wounds */}
                          <div className="mb-2">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-cyan-200 text-xs">Wounds</span>
                              <span className="text-cyan-200 text-xs">{player.wounds}/{player.maxWounds} ({woundPercent}%)</span>
                            </div>

                            <div className="flex items-center space-x-1 mb-1">
                              <button
                                onClick={() => quickAdjustPlayerHealth(player.id, 'wounds', -1)}
                                className="bg-green-500 hover:bg-green-600 text-white px-1 py-0.5 rounded text-xs"
                                disabled={player.wounds === 0}
                              >
                                -1
                              </button>

                              <div className="flex-1 bg-cyan-800 rounded-full h-2 overflow-hidden relative">
                                <div 
                                  className={`h-full transition-all duration-300 ${
                                    player.wounds >= player.maxWounds * 2 ? 'bg-black animate-pulse' :
                                    player.wounds >= player.maxWounds ? 'bg-red-600' :
                                    player.wounds >= player.maxWounds * 0.5 ? 'bg-yellow-500' :
                                    'bg-green-500'
                                  }`}
                                  style={{ width: `${Math.min(100, (player.wounds / player.maxWounds) * 100)}%` }}
                                />
                              </div>
                                
                              <button
                                onClick={() => quickAdjustPlayerHealth(player.id, 'wounds', 1)}
                                className="bg-red-500 hover:bg-red-600 text-white px-1 py-0.5 rounded text-xs"
                                disabled={player.wounds >= player.maxWounds * 2}
                              >
                                +1
                              </button>
                            </div>
                          </div>
                                
                          {/* Strain */}
                          <div className="mb-2">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-cyan-200 text-xs">Strain</span>
                              <span className="text-cyan-200 text-xs">{player.strain}/{player.maxStrain} ({strainPercent}%)</span>
                            </div>
                                
                            <div className="flex items-center space-x-1">
                              <button
                                onClick={() => quickAdjustPlayerHealth(player.id, 'strain', -1)}
                                className="bg-green-500 hover:bg-green-600 text-white px-1 py-0.5 rounded text-xs"
                                disabled={player.strain === 0}
                              >
                                -1
                              </button>
                                
                              <div className="flex-1 bg-cyan-800 rounded-full h-2 overflow-hidden relative">
                                <div 
                                  className={`h-full transition-all duration-300 ${
                                    player.strain >= player.maxStrain ? 'bg-red-600 animate-pulse' :
                                    player.strain >= player.maxStrain * 0.5 ? 'bg-orange-500' :
                                    'bg-blue-500'
                                  }`}
                                  style={{ width: `${Math.max(5, (player.strain / player.maxStrain) * 100)}%` }}
                                />
                              </div>
                                
                              <button
                                onClick={() => quickAdjustPlayerHealth(player.id, 'strain', 1)}
                                className="bg-orange-500 hover:bg-orange-600 text-white px-1 py-0.5 rounded text-xs"
                                disabled={player.strain >= player.maxStrain}
                              >
                                +1
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
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
              
              <div className="bg-slate-800/50 p-2 rounded mb-2">
                <div className="text-slate-300 text-xs mb-1">Next:</div>
                <div className="text-white text-xs font-medium">{stats.weatherStatus.nextEvent}</div>
              </div>
              
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
                <span>0-8</span><span className="text-slate-300">Height</span>
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