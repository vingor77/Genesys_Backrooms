import React, { useState, useEffect } from 'react';
import { 
  INTERIOR_TYPES, 
  moons,
  calculateRoomCount  // Add this import
} from './moonData.jsx';
import { ROOM_TYPES, TRAP_TYPES } from './indoorData.jsx';
import { generateScrapFromMoonData } from './scrapUtils.jsx';
import { generateCompleteBuilding } from './floorManager.jsx';
import { generateMazeRoomsAlongPaths } from './roomGenerator.jsx';
import { distributeDoorsAcrossFloors } from './doorSystem.jsx';
import { useDoorActions, FunctionalDoorPanel, getEnhancedDoorIndicator, getEnhancedDoorTooltip } from './functionalDoorComponent.jsx';
import { INTERIOR_GRID_SIZE, CENTER_POINT, validateAndFixPaths } from './pathGenerator.jsx';
import { applyDamageToPlayer, updatePlayerHealth } from './playerManager.jsx';
import { 
  enhanceHallwayCell, 
  getEnhancedHallwayTooltip,
  integrateHallwayFeatures,
} from './hallwayFeatures.jsx';

// ===== LIGHTING SYSTEM =====
const LIGHTING_CONFIG = {
  MIN_LIGHT: 0,
  MAX_LIGHT: 10,
  BASE_ROOM_LIGHT_MIN: 3,
  BASE_ROOM_LIGHT_MAX: 7,
  HALLWAY_LIGHT_MIN: 1,
  HALLWAY_LIGHT_MAX: 8,
  APPARATUS_PENALTY: 4, // When apparatus is removed
  NEIGHBOR_INFLUENCE: 0.5, // How much neighboring rooms affect light
  SPECIAL_ROOM_BONUSES: {
    [ROOM_TYPES.OFFICE]: 2,
    [ROOM_TYPES.SMALL_OFFICE]: 1,
    [ROOM_TYPES.LABORATORY]: 3,
    [ROOM_TYPES.SECURITY]: 2,
    [ROOM_TYPES.APPARATUS]: 4, // Apparatus room is well-lit
    [ROOM_TYPES.ENTRANCE]: 3,
    [ROOM_TYPES.LIBRARY]: 2
  },
  SPECIAL_ROOM_PENALTIES: {
    [ROOM_TYPES.BASEMENT]: -2,
    [ROOM_TYPES.TUNNEL]: -1,
    [ROOM_TYPES.SHAFT]: -2,
    [ROOM_TYPES.VAULT]: -1 // Vaults are dimmer for security
  }
};

// Function to generate initial lighting for a floor
const generateFloorLighting = (layout) => {
  const lightingMap = {};
  const processedCells = new Set();
  
  // First pass: Generate base lighting for all cells
  Object.entries(layout).forEach(([cellKey, cell]) => {
    if (cell.type === 'room') {
      let baseLight;
      
      // Different base lighting for different room types
      if (cell.room === ROOM_TYPES.HALLWAY || cell.room === ROOM_TYPES.CORRIDOR) {
        baseLight = Math.floor(Math.random() * (LIGHTING_CONFIG.HALLWAY_LIGHT_MAX - LIGHTING_CONFIG.HALLWAY_LIGHT_MIN + 1)) + LIGHTING_CONFIG.HALLWAY_LIGHT_MIN;
      } else {
        baseLight = Math.floor(Math.random() * (LIGHTING_CONFIG.BASE_ROOM_LIGHT_MAX - LIGHTING_CONFIG.BASE_ROOM_LIGHT_MIN + 1)) + LIGHTING_CONFIG.BASE_ROOM_LIGHT_MIN;
      }
      
      // Apply special room bonuses/penalties
      if (LIGHTING_CONFIG.SPECIAL_ROOM_BONUSES[cell.room]) {
        baseLight += LIGHTING_CONFIG.SPECIAL_ROOM_BONUSES[cell.room];
      }
      if (LIGHTING_CONFIG.SPECIAL_ROOM_PENALTIES[cell.room]) {
        baseLight += LIGHTING_CONFIG.SPECIAL_ROOM_PENALTIES[cell.room];
      }
      
      // Clamp to valid range
      baseLight = Math.max(LIGHTING_CONFIG.MIN_LIGHT, Math.min(LIGHTING_CONFIG.MAX_LIGHT, baseLight));
      
      lightingMap[cellKey] = baseLight;
    } else {
      // Walls have no lighting
      lightingMap[cellKey] = 0;
    }
  });
  
  // Second pass: Apply neighbor influence using flood fill from entrance
  const applyNeighborInfluence = (startCellKey, visited = new Set()) => {
    if (visited.has(startCellKey)) return;
    visited.add(startCellKey);
    
    const [x, y] = startCellKey.split(',').map(Number);
    const currentCell = layout[startCellKey];
    
    if (!currentCell || currentCell.type !== 'room') return;
    
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    const neighborLights = [];
    
    // Get neighboring room lights
    directions.forEach(([dx, dy]) => {
      const neighborKey = `${x + dx},${y + dy}`;
      const neighborCell = layout[neighborKey];
      
      if (neighborCell && neighborCell.type === 'room' && lightingMap[neighborKey] !== undefined) {
        neighborLights.push(lightingMap[neighborKey]);
      }
    });
    
    if (neighborLights.length > 0) {
      const averageNeighborLight = neighborLights.reduce((sum, light) => sum + light, 0) / neighborLights.length;
      const currentLight = lightingMap[startCellKey];
      
      // Blend current light with neighbor average
      const influencedLight = currentLight * (1 - LIGHTING_CONFIG.NEIGHBOR_INFLUENCE) + averageNeighborLight * LIGHTING_CONFIG.NEIGHBOR_INFLUENCE;
      
      lightingMap[startCellKey] = Math.max(LIGHTING_CONFIG.MIN_LIGHT, Math.min(LIGHTING_CONFIG.MAX_LIGHT, Math.round(influencedLight)));
    }
    
    // Recursively process neighbors
    directions.forEach(([dx, dy]) => {
      const neighborKey = `${x + dx},${y + dy}`;
      applyNeighborInfluence(neighborKey, visited);
    });
  };
  
  // Find entrance and start influence propagation
  const entranceCell = Object.entries(layout).find(([cellKey, cell]) => 
    cell.type === 'room' && cell.room === ROOM_TYPES.ENTRANCE
  );
  
  if (entranceCell) {
    applyNeighborInfluence(entranceCell[0]);
  } else {
    // If no entrance found, start from center or first room
    const firstRoom = Object.entries(layout).find(([cellKey, cell]) => 
      cell.type === 'room' && cell.room !== ROOM_TYPES.HALLWAY && cell.room !== ROOM_TYPES.CORRIDOR
    );
    if (firstRoom) {
      applyNeighborInfluence(firstRoom[0]);
    }
  }
  
  return lightingMap;
};

// Function to check if apparatus has been collected from the facility
const isApparatusCollected = (buildingData, collectedApparatus) => {
  if (!buildingData || !buildingData.floors) return false;
  
  // Check if any apparatus room exists and if its apparatus has been collected
  for (const layout of Object.values(buildingData.floors)) {
    for (const cell of Object.values(layout)) {
      if (cell.apparatus && collectedApparatus.has(cell.apparatus.id)) {
        return true;
      }
    }
  }
  return false;
};

// Function to get display light level (applies apparatus penalty if needed)
const getDisplayLightLevel = (baseLight, apparatusCollected) => {
  if (apparatusCollected) {
    return Math.max(LIGHTING_CONFIG.MIN_LIGHT, baseLight - LIGHTING_CONFIG.APPARATUS_PENALTY);
  }
  return baseLight;
};

// Function to get light level description
const getLightDescription = (lightLevel) => {
  if (lightLevel === 0) return "Pitch Dark";
  if (lightLevel <= 2) return "Very Dim";
  if (lightLevel <= 4) return "Dim";
  if (lightLevel <= 6) return "Moderate";
  if (lightLevel <= 8) return "Bright";
  if (lightLevel <= 9) return "Very Bright";
  return "Blinding";
};

// Function to get light level color for UI
const getLightColor = (lightLevel) => {
  if (lightLevel === 0) return "text-gray-900";
  if (lightLevel <= 2) return "text-gray-700";
  if (lightLevel <= 4) return "text-gray-500";
  if (lightLevel <= 6) return "text-yellow-600";
  if (lightLevel <= 8) return "text-yellow-400";
  if (lightLevel <= 9) return "text-yellow-200";
  return "text-white";
};

const getLightingOverlay = (lightLevel) => {
  if (lightLevel === 0) {
    return 'rgba(0, 0, 0, 0.9)'; // Very dark overlay for pitch black
  } else if (lightLevel <= 2) {
    return 'rgba(0, 0, 0, 0.7)'; // Dark overlay for very dim
  } else if (lightLevel <= 4) {
    return 'rgba(0, 0, 0, 0.4)'; // Medium dark overlay for dim
  } else if (lightLevel <= 6) {
    return 'rgba(0, 0, 0, 0.1)'; // Slight dark overlay for moderate
  } else if (lightLevel <= 8) {
    return 'rgba(255, 255, 255, 0.0)'; // No overlay for bright (normal)
  } else if (lightLevel <= 9) {
    return 'rgba(255, 255, 255, 0.2)'; // Slight bright overlay for very bright
  } else {
    return 'rgba(255, 255, 255, 0.4)'; // Bright overlay for blinding
  }
};

// ===== END LIGHTING SYSTEM =====

const NewInteriorGrid = ({ 
  selectedMoon, 
  gameStarted, 
  currentRound,
  onEntityEncounter,
  onTrapTriggered,
  entityManager,
  onEntityDefeat,
  onEntityPlacement,
  players = [],
  buildingData,
  setBuildingData,
  currentFloor = 0,
  setCurrentFloor,
  onEntityPlayerCollision,
  onPlayerPositionChange,
  setPlayers,
  addAlert,
  rageSystem
}) => {
  // Building state
  const [selectedCell, setSelectedCell] = useState(null);
  
  // Game state
  const [collectedScrap, setCollectedScrap] = useState(new Set());
  const [triggeredTraps, setTriggeredTraps] = useState(new Set());
  const [currentInteriorType, setCurrentInteriorType] = useState(INTERIOR_TYPES.FACTORY);
  const [doorActionMessage, setDoorActionMessage] = useState('');
  const [entityMovementTimers, setEntityMovementTimers] = useState(new Map());
  const [collectedApparatus, setCollectedApparatus] = useState(new Set());
  const [isPlayerMovementMode, setIsPlayerMovementMode] = useState(false);
  const [movingPlayer, setMovingPlayer] = useState(null);
  const [entityTargets, setEntityTargets] = useState(new Map()); // Bracken/Ghost Girl targets
  const [spiderWebTriggers, setSpiderWebTriggers] = useState(new Map()); // Spider web reactions
  const [jesterChaseDuration, setJesterChaseDuration] = useState(new Map()); // Jester escalation
  const [pendingEntityMoves, setPendingEntityMoves] = useState([]);

  // ===== NEW: Lighting state =====
  const [floorLighting, setFloorLighting] = useState({});

  // Entity movement data - rounds between moves
  const ENTITY_MOVEMENT_DATA = {
    "Barber (Clay Surgeon)": { passive: 2, chasing: 1 },
    "Barber": { passive: 2, chasing: 1 },
    "Thumper (Halves)": { passive: 2, chasing: 1 },
    "Thumper": { passive: 2, chasing: 1 },
    "Snare Flea (Centipede)": { passive: 999, chasing: 1 },
    "Snare Flea": { passive: 999, chasing: 1 },
    "Spore Lizard (Puffer)": { passive: 2, chasing: 1 },
    "Spore Lizard": { passive: 2, chasing: 1 },
    "Bracken (Flower Man)": { passive: 999, chasing: 999 },
    "Bracken": { passive: 999, chasing: 999 },
    "Bunker Spider (Theraphosa Spider)": { passive: 3, chasing: 2 },
    "Bunker Spider": { passive: 3, chasing: 2 },
    "Jester (Jack-in-the-Box)": { passive: 2, chasing: 2 },
    "Jester": { passive: 2, chasing: 2 },
    "Nutcracker (Guardian Automaton)": { passive: 2, chasing: 1 },
    "Nutcracker": { passive: 2, chasing: 1 },
    "Maneater (Periplaneta Clamorus)": { passive: 2, chasing: 1 },
    "Maneater": { passive: 2, chasing: 1 },
    "Masked (Mimic)": { passive: 3, chasing: 1 },
    "Masked": { passive: 3, chasing: 1 },
    "Butler (Mansion Keeper)": { passive: 3, chasing: 1 },
    "Butler": { passive: 3, chasing: 1 },
    "Hygrodere (Slime)": { passive: 3, chasing: 2 },
    "Hygrodere": { passive: 3, chasing: 2 },
    "Ghost Girl (Dress Girl)": { passive: 999, chasing: 999 },
    "Ghost Girl": { passive: 999, chasing: 999 },
    "Hoarding Bug (Loot Bug)": { passive: 3, chasing: 1 },
    "Hoarding Bug": { passive: 3, chasing: 1 },
    "Coil-Head (Spring Man)": { passive: 3, chasing: 1 },
    "Coil-Head": { passive: 3, chasing: 1 },
  };

  // Helper: Get closest player to entity
  const getClosestPlayerToEntity = (entityX, entityY, entityFloor) => {
    const playersOnSameFloor = players.filter(player => 
      player.position?.currentArea === 'interior' &&
      player.position.interior.floor === entityFloor
    );

    if (playersOnSameFloor.length === 0) return null;

    let closestPlayer = null;
    let closestDistance = Infinity;

    playersOnSameFloor.forEach(player => {
      const distance = Math.abs(player.position.interior.x - entityX) + Math.abs(player.position.interior.y - entityY);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestPlayer = player;
      }
    });

    return { player: closestPlayer, distance: closestDistance };
  };

  // Helper: Check if players within range
  const hasPlayersInRange = (entityX, entityY, entityFloor, range) => {
    return players.some(player => {
      if (player.position?.currentArea !== 'interior') return false;
      if (player.position.interior.floor !== entityFloor) return false;

      const distance = Math.abs(player.position.interior.x - entityX) + Math.abs(player.position.interior.y - entityY);
      return distance <= range;
    });
  };

  // Helper: Move entity one step towards target
  const moveTowardsTarget = (entity, fromX, fromY, toX, toY, floorNum) => {
    const connectedRooms = getConnectedRooms(fromX, fromY, floorNum);

    console.log(`${entity.name} at (${fromX},${fromY}) trying to move to (${toX},${toY})`);
    console.log(`Connected rooms:`, connectedRooms.length);

    if (connectedRooms.length === 0) {
      console.log(`${entity.name} TRAPPED - no connected rooms!`);
      return { success: false };
    }

    // Calculate direction preference
    const dx = toX - fromX;
    const dy = toY - fromY;

    let bestRoom = null;
    let bestDistance = Infinity;

    connectedRooms.forEach(room => {
      const distance = Math.abs(room.x - toX) + Math.abs(room.y - toY);

      // Prefer moves in the correct direction
      let priority = distance;
      const roomDx = room.x - fromX;
      const roomDy = room.y - fromY;

      // Bonus for moving in right direction
      if ((dx > 0 && roomDx > 0) || (dx < 0 && roomDx < 0)) priority -= 0.3;
      if ((dy > 0 && roomDy > 0) || (dy < 0 && roomDy < 0)) priority -= 0.3;

      if (priority < bestDistance) {
        bestDistance = priority;
        bestRoom = room;
      }
    });

    if (!bestRoom) bestRoom = connectedRooms[0];

    console.log(`${entity.name} moving from (${fromX},${fromY}) to (${bestRoom.x},${bestRoom.y})`);

    moveEntityToRoom(entity, fromX, fromY, bestRoom.x, bestRoom.y, floorNum);

    // Check if hit player
    const hitPlayer = players.some(p => 
      p.position?.currentArea === 'interior' &&
      p.position.interior.x === bestRoom.x &&
      p.position.interior.y === bestRoom.y &&
      p.position.interior.floor === floorNum
    );

    return { success: true, x: bestRoom.x, y: bestRoom.y, hitPlayer };
  };

  // Helper: Move entity one step away from target
  const moveAwayFromTarget = (entity, fromX, fromY, targetX, targetY, floorNum) => {
    const connectedRooms = getConnectedRooms(fromX, fromY, floorNum);
    if (connectedRooms.length === 0) return { success: false };

    let bestRoom = null;
    let bestDistance = -Infinity;

    connectedRooms.forEach(room => {
      const distance = Math.abs(room.x - targetX) + Math.abs(room.y - targetY);
      if (distance > bestDistance) {
        bestDistance = distance;
        bestRoom = room;
      }
    });

    if (!bestRoom) bestRoom = connectedRooms[0];

    moveEntityToRoom(entity, fromX, fromY, bestRoom.x, bestRoom.y, floorNum);

    const hitPlayer = players.some(p => 
      p.position?.currentArea === 'interior' &&
      p.position.interior.x === bestRoom.x &&
      p.position.interior.y === bestRoom.y &&
      p.position.interior.floor === floorNum
    );

    return { success: true, x: bestRoom.x, y: bestRoom.y, hitPlayer };
  };

  // Helper: Random move
  const moveRandomly = (entity, fromX, fromY, floorNum) => {
    const connectedRooms = getConnectedRooms(fromX, fromY, floorNum);

    console.log(`${entity.name} random move from (${fromX},${fromY}) - ${connectedRooms.length} options`);

    if (connectedRooms.length === 0) {
      console.log(`${entity.name} TRAPPED - no connected rooms for random move!`);
      return { success: false };
    }

    const room = connectedRooms[Math.floor(Math.random() * connectedRooms.length)];

    console.log(`${entity.name} randomly moving to (${room.x},${room.y})`);

    moveEntityToRoom(entity, fromX, fromY, room.x, room.y, floorNum);

    const hitPlayer = players.some(p => 
      p.position?.currentArea === 'interior' &&
      p.position.interior.x === room.x &&
      p.position.interior.y === room.y &&
      p.position.interior.floor === floorNum
    );

    return { success: true, x: room.x, y: room.y, hitPlayer };
  };

  // Helper: Place spider web trap
  const placeSpiderWeb = (x, y, floorNum, entityId, round) => {
    setBuildingData(prev => {
      if (!prev || !prev.floors) return prev;

      const newFloors = { ...prev.floors };
      const floorLayout = { ...newFloors[floorNum] };
      const cellKey = `${x},${y}`;

      if (floorLayout[cellKey]) {
        const cell = floorLayout[cellKey];

        const webTrap = {
          id: `spiderweb_${entityId}_${round}_${Date.now()}`,
          name: "Spider Web",
          danger: "Low",
          detection: "Easy",
          roll: "Difficulty 2 Athletics/Coordination",
          wounds: 0,
          strain: 0,
          placedBy: entityId,
          placedAt: round,
          webType: "spider_web"
        };

        const existingTraps = cell.traps || [];
        floorLayout[cellKey] = {
          ...cell,
          traps: [...existingTraps, webTrap],
          trap: existingTraps.length === 0 ? webTrap : cell.trap
        };
      }

      newFloors[floorNum] = floorLayout;
      return { ...prev, floors: newFloors };
    });

    addAlert('entity-effect', `🕸️ Bunker Spider placed web at (${x},${y})!`, round);
  };

  // Main entity movement processor
  const processEntityMovement = (entity, currentX, currentY, floorNum, currentRound) => {
    const movementData = ENTITY_MOVEMENT_DATA[entity.name];
    if (!movementData) return false;

    // Don't move if on same tile as player
    const playersHere = players.filter(p => 
      p.position?.currentArea === 'interior' &&
      p.position.interior.x === currentX &&
      p.position.interior.y === currentY &&
      p.position.interior.floor === floorNum
    );
    if (playersHere.length > 0) return false;

    const entityRage = rageSystem?.getEntityRage?.(entity.id) || 0;

    // ===== BRACKEN & GHOST GIRL: STATIONARY, TARGET PLAYER =====
    if (entity.name.includes("Bracken") || entity.name.includes("Ghost Girl")) {
      if (!entityTargets.has(entity.id)) {
        const playersInside = players.filter(p => p.position?.currentArea === 'interior');
        if (playersInside.length > 0) {
          const target = playersInside[Math.floor(Math.random() * playersInside.length)];
          setEntityTargets(prev => new Map(prev.set(entity.id, target.id)));
          addAlert('entity-effect', `${entity.name} targeted ${target.name}!`, currentRound);
        }
      }
      return false; // Never move
    }

    // ===== COIL-HEAD: FROZEN AT MAX RAGE =====
    if (entity.name.includes("Coil-Head") && entityRage >= 3) {
      return false;
    }

    // ===== SNARE FLEA: ONLY CHASES WITHIN 1 TILE =====
    if (entity.name.includes("Snare Flea")) {
      if (!hasPlayersInRange(currentX, currentY, floorNum, 1)) return false;

      const closest = getClosestPlayerToEntity(currentX, currentY, floorNum);
      if (!closest) return false;

      const result = moveTowardsTarget(entity, currentX, currentY, 
        closest.player.position.interior.x, closest.player.position.interior.y, floorNum);
      return result.success;
    }

    // ===== BUNKER SPIDER: WEB PLACEMENT & TRIGGERED CHASING =====
    if (entity.name.includes("Bunker Spider")) {
      const webTrigger = spiderWebTriggers.get(entity.id);

      // Check if reacting to web trigger
      if (webTrigger) {
        const inRange = hasPlayersInRange(currentX, currentY, floorNum, 5);

        if (inRange) {
          // Resume normal chasing
          setSpiderWebTriggers(prev => {
            const newMap = new Map(prev);
            newMap.delete(entity.id);
            return newMap;
          });

          const closest = getClosestPlayerToEntity(currentX, currentY, floorNum);
          if (closest) {
            let pos = { x: currentX, y: currentY };
            for (let i = 0; i < 2; i++) {
              const move = moveTowardsTarget(entity, pos.x, pos.y,
                closest.player.position.interior.x, closest.player.position.interior.y, floorNum);
              if (!move.success || move.hitPlayer) break;
              pos = { x: move.x, y: move.y };
            }
            return true;
          }
        } else {
          // Move towards triggered web
          const move = moveTowardsTarget(entity, currentX, currentY, webTrigger.x, webTrigger.y, floorNum);
          if (move.success && move.x === webTrigger.x && move.y === webTrigger.y) {
            setSpiderWebTriggers(prev => {
              const newMap = new Map(prev);
              newMap.delete(entity.id);
              return newMap;
            });
          }
          return move.success;
        }
      }

      const inRange = hasPlayersInRange(currentX, currentY, floorNum, 5);

      if (!inRange) {
        // Passive: 50% web or move
        if (Math.random() < 0.5) {
          placeSpiderWeb(currentX, currentY, floorNum, entity.id, currentRound);
          return false;
        } else {
          let pos = { x: currentX, y: currentY };
          for (let i = 0; i < 2; i++) {
            const move = moveRandomly(entity, pos.x, pos.y, floorNum);
            if (!move.success || move.hitPlayer) break;
            pos = { x: move.x, y: move.y };
          }
          return true;
        }
      } else {
        // Chase player
        const closest = getClosestPlayerToEntity(currentX, currentY, floorNum);
        if (!closest) return false;

        let pos = { x: currentX, y: currentY };
        for (let i = 0; i < 2; i++) {
          const move = moveTowardsTarget(entity, pos.x, pos.y,
            closest.player.position.interior.x, closest.player.position.interior.y, floorNum);
          if (!move.success || move.hitPlayer) break;
          pos = { x: move.x, y: move.y };
        }
        return true;
      }
    }

    // ===== JESTER: ALWAYS TOWARDS CLOSEST PLAYER, ESCALATING =====
    if (entity.name.includes("Jester")) {
      const closest = getClosestPlayerToEntity(currentX, currentY, floorNum);
      if (!closest) return false;

      let moveCount = 2;

      if (entityRage >= 3) {
        let duration = jesterChaseDuration.get(entity.id) || 0;
        duration++;
        moveCount = 2 + duration;
        setJesterChaseDuration(prev => new Map(prev.set(entity.id, duration)));
      } else {
        setJesterChaseDuration(prev => {
          const newMap = new Map(prev);
          newMap.delete(entity.id);
          return newMap;
        });
      }

      let pos = { x: currentX, y: currentY };
      for (let i = 0; i < moveCount; i++) {
        const move = moveTowardsTarget(entity, pos.x, pos.y,
          closest.player.position.interior.x, closest.player.position.interior.y, floorNum);
        if (!move.success || move.hitPlayer) break;
        pos = { x: move.x, y: move.y };
      }
      return true;
    }

    // ===== MANEATER: SCRAP CONSUMPTION & RAGE CHASING =====
    if (entity.name.includes("Maneater")) {
      if (entityRage < 3) {
        // Passive: consume scrap + wander
        const cellKey = `${currentX},${currentY}`;
        const cell = buildingData.floors[floorNum]?.[cellKey];

        if (cell?.scraps && cell.scraps.length > 0 && Math.random() < 0.2) {
          const uncollected = cell.scraps.filter(s => !collectedScrap.has(s.id));
          if (uncollected.length > 0) {
            const consumed = uncollected[0];

            setBuildingData(prev => {
              const newFloors = { ...prev.floors };
              const newLayout = { ...newFloors[floorNum] };
              const newCell = { ...newLayout[cellKey] };
              newCell.scraps = newCell.scraps.filter(s => s.id !== consumed.id);
              newLayout[cellKey] = newCell;
              newFloors[floorNum] = newLayout;
              return { ...prev, floors: newFloors };
            });

            addAlert('entity-effect', `🦶 Maneater consumed ${consumed.name}!`, currentRound);
          }
        }

        let pos = { x: currentX, y: currentY };
        for (let i = 0; i < 2; i++) {
          const move = moveRandomly(entity, pos.x, pos.y, floorNum);
          if (!move.success || move.hitPlayer) break;
          pos = { x: move.x, y: move.y };
        }
        return true;
      } else {
        // Rage 3+: chase within 5 tiles
        if (!hasPlayersInRange(currentX, currentY, floorNum, 5)) return false;

        const closest = getClosestPlayerToEntity(currentX, currentY, floorNum);
        if (!closest) return false;

        let pos = { x: currentX, y: currentY };
        for (let i = 0; i < 2; i++) {
          const move = moveTowardsTarget(entity, pos.x, pos.y,
            closest.player.position.interior.x, closest.player.position.interior.y, floorNum);
          if (!move.success || move.hitPlayer) break;
          pos = { x: move.x, y: move.y };
        }
        return true;
      }
    }

    // ===== SPORE LIZARD: FLEE BEHAVIOR =====
    if (entity.name.includes("Spore Lizard")) {
      const inRange = hasPlayersInRange(currentX, currentY, floorNum, 5);

      if (!inRange) {
        // Random wander
        let pos = { x: currentX, y: currentY };
        for (let i = 0; i < 2; i++) {
          const move = moveRandomly(entity, pos.x, pos.y, floorNum);
          if (!move.success || move.hitPlayer) break;
          pos = { x: move.x, y: move.y };
        }
        return true;
      } else {
        // Flee
        const closest = getClosestPlayerToEntity(currentX, currentY, floorNum);
        if (!closest) return false;

        let pos = { x: currentX, y: currentY };
        for (let i = 0; i < 2; i++) {
          const move = moveAwayFromTarget(entity, pos.x, pos.y,
            closest.player.position.interior.x, closest.player.position.interior.y, floorNum);
          if (!move.success || move.hitPlayer) break;
          pos = { x: move.x, y: move.y };
        }
        return true;
      }
    }

    // ===== THUMPER: 3 MOVES WHILE CHASING =====
    if (entity.name.includes("Thumper")) {
      const inRange = hasPlayersInRange(currentX, currentY, floorNum, 5);

      if (!inRange) {
        // Random wander
        let pos = { x: currentX, y: currentY };
        for (let i = 0; i < 2; i++) {
          const move = moveRandomly(entity, pos.x, pos.y, floorNum);
          if (!move.success || move.hitPlayer) break;
          pos = { x: move.x, y: move.y };
        }
        return true;
      } else {
        // Chase with 3 moves
        const closest = getClosestPlayerToEntity(currentX, currentY, floorNum);
        if (!closest) return false;

        let pos = { x: currentX, y: currentY };
        for (let i = 0; i < 3; i++) {
          const move = moveTowardsTarget(entity, pos.x, pos.y,
            closest.player.position.interior.x, closest.player.position.interior.y, floorNum);
          if (!move.success || move.hitPlayer) break;
          pos = { x: move.x, y: move.y };
        }
        return true;
      }
    }

    // ===== STANDARD ENTITIES: 2 MOVES, CHASE WITHIN 5 TILES =====
    // (Hygrodere, Masked, Barber, Nutcracker, Butler, Coil-Head)
    const inRange = hasPlayersInRange(currentX, currentY, floorNum, 5);

    if (!inRange) {
      // Random wander
      let pos = { x: currentX, y: currentY };
      for (let i = 0; i < 2; i++) {
        const move = moveRandomly(entity, pos.x, pos.y, floorNum);
        if (!move.success || move.hitPlayer) break;
        pos = { x: move.x, y: move.y };
      }
      return true;
    } else {
      // Chase player
      const closest = getClosestPlayerToEntity(currentX, currentY, floorNum);
      if (!closest) return false;

      let pos = { x: currentX, y: currentY };
      for (let i = 0; i < 2; i++) {
        const move = moveTowardsTarget(entity, pos.x, pos.y,
          closest.player.position.interior.x, closest.player.position.interior.y, floorNum);
        if (!move.success || move.hitPlayer) break;
        pos = { x: move.x, y: move.y };
      }
      return true;
    }
  };

  // Entity death drops
  const processEntityDeathEffects = (entity, position, currentRound) => {
    const { x, y, floor } = position;

    if (entity.name.includes("Nutcracker")) {
      setBuildingData(prev => {
        const newFloors = { ...prev.floors };
        const newLayout = { ...newFloors[floor] };
        const cellKey = `${x},${y}`;
        const newCell = { ...newLayout[cellKey] };

        if (!newCell.scraps) newCell.scraps = [];
        newCell.scraps.push({
          id: `nutcracker_shotgun_${Date.now()}`,
          name: "Double-barrel Shotgun",
          weight: 16,
          value: 80,
          conductive: false,
          twoHanded: false
        });
        newCell.scraps.push({
          id: `nutcracker_shells_${Date.now()}`,
          name: "2 Shotgun Shells",
          weight: 0,
          value: 40,
          conductive: false,
          twoHanded: false
        });

        newLayout[cellKey] = newCell;
        newFloors[floor] = newLayout;
        return { ...prev, floors: newFloors };
      });

      addAlert('entity-death-effect', 
        `💀 Nutcracker dropped Double-barrel Shotgun and Shells at (${x},${y})!`, 
        currentRound
      );
    }

    if (entity.name.includes("Butler")) {
      setBuildingData(prev => {
        const newFloors = { ...prev.floors };
        const newLayout = { ...newFloors[floor] };
        const cellKey = `${x},${y}`;
        const newCell = { ...newLayout[cellKey] };

        if (!newCell.scraps) newCell.scraps = [];
        newCell.scraps.push({
          id: `butler_knife_${Date.now()}`,
          name: "Kitchen Knife",
          weight: 1,
          value: 30,
          conductive: true,
          twoHanded: false
        });

        newLayout[cellKey] = newCell;
        newFloors[floor] = newLayout;
        return { ...prev, floors: newFloors };
      });

      addAlert('entity-death-effect', 
        `💀 Butler dropped Kitchen Knife at (${x},${y})!`, 
        currentRound
      );
    }
  };

  // Updated trap trigger handler to notify spiders
  const handleTrapTrigger = (trap) => {
    if (triggeredTraps.has(trap.id)) return;
    if (!trap) return;

    const playersInRoom = players?.filter(player => 
      player.position?.currentArea === 'interior' &&
      player.position.interior.x === selectedCell.x &&
      player.position.interior.y === selectedCell.y &&
      player.position.interior.floor === currentFloor
    ) || [];

    if (playersInRoom.length > 0) {
      if (playersInRoom.length === 1) {
        const player = playersInRoom[0];
        applyDamageToPlayer(players, setPlayers, player.id, trap.wounds || 0, trap.strain || 0);
      } else {
        const playerNames = playersInRoom.map(p => p.name);
        const choice = prompt(`Multiple players in room: ${playerNames.join(', ')}\n\nWho triggered ${trap.name}?\n\nEnter player name or cancel to abort:`);

        if (!choice) return;

        const selectedPlayer = playersInRoom.find(p => p.name.toLowerCase() === choice.toLowerCase().trim());

        if (!selectedPlayer) {
          alert(`Player "${choice}" not found in room!`);
          return;
        }

        applyDamageToPlayer(players, setPlayers, selectedPlayer.id, trap.wounds || 0, trap.strain || 0);
      }
    }

    const newTriggered = new Set(triggeredTraps);
    newTriggered.add(trap.id);
    setTriggeredTraps(newTriggered);

    // If spider web triggered, alert the spider
    if (trap.webType === "spider_web" && trap.placedBy) {
      setSpiderWebTriggers(prev => new Map(prev.set(trap.placedBy, {
        x: selectedCell.x,
        y: selectedCell.y,
        floor: currentFloor,
        round: currentRound
      })));

      addAlert('entity-effect', 
        `🕷️ Bunker Spider alerted to web at (${selectedCell.x},${selectedCell.y})!`, 
        currentRound
      );
    }

    if (onTrapTriggered) {
      onTrapTriggered(trap);
    }
  };

  // Helper to get entity target name (for Bracken/Ghost Girl)
  const getEntityTargetName = (entityId) => {
    const targetPlayerId = entityTargets.get(entityId);
    if (!targetPlayerId) return "No target";

    const targetPlayer = players.find(p => p.id === targetPlayerId);
    return targetPlayer ? targetPlayer.name : "Target left facility";
  };

  const startPlayerMovement = (player) => {
    setMovingPlayer(player);
    setIsPlayerMovementMode(true);
  };

  // Handle cell click during movement mode
  const handlePlayerMovementClick = (x, y) => {
    console.log('🎯 Player movement click:', { x, y, movingPlayer, isPlayerMovementMode });

    if (!isPlayerMovementMode || !movingPlayer) {
      console.log('❌ Not in movement mode or no moving player');
      return;
    }

    const cellKey = `${x},${y}`;
    const cell = currentFloorLayout[cellKey];

    console.log('🏠 Cell data:', { cellKey, cell });

    // Validate the position (same logic as in PlayerManager)
    if (!cell || cell.type !== 'room' || !cell.room) {
      console.log('❌ Invalid cell selected');
      alert('Invalid position! Please select a room cell.');
      return;
    }

    const additionalData = {
      floor: currentFloor,
      room: cell.room.name,
      roomType: cell.room
    };

    // Call the position change handler
    if (onPlayerPositionChange) {
      onPlayerPositionChange(movingPlayer.id, 'interior', x, y, additionalData);
    }

    // Exit movement mode
    setIsPlayerMovementMode(false);
    setMovingPlayer(null);
    setSelectedCell(null);
  };

  // Cancel player movement
  const cancelPlayerMovement = () => {
    setIsPlayerMovementMode(false);
    setMovingPlayer(null);
  };

  // Quick health adjustment function
  const quickAdjustPlayerHealth = (playerId, type, amount) => {
    const player = players.find(p => p.id === playerId);
    if (!player) return;

    const currentValue = player[type];
    const maxValue = player[`max${type.charAt(0).toUpperCase() + type.slice(1)}`];
    const absoluteMax = type === 'wounds' ? maxValue * 2 : maxValue;
    const newValue = Math.max(0, Math.min(absoluteMax, currentValue + amount));

    // Use the imported function from playerManager.jsx
    updatePlayerHealth(players, setPlayers, playerId, 
      type === 'wounds' ? newValue : player.wounds,
      type === 'strain' ? newValue : player.strain
    );
  };

  // FIXED: Function to get connected rooms - simplified door logic
  const getConnectedRooms = (currentX, currentY, currentFloor) => {
    const connectedRooms = [];
    const currentFloorLayout = buildingData?.floors[currentFloor];
    if (!currentFloorLayout) return connectedRooms; 

    const directions = [[-1, 0], [0, -1], [0, 1], [1, 0]];  

    directions.forEach(([dx, dy]) => {
      const newX = currentX + dx;
      const newY = currentY + dy;
      const cellKey = `${newX},${newY}`;
      const targetCell = currentFloorLayout[cellKey]; 

      if (targetCell && targetCell.type === 'room' && targetCell.room) {
        const excludedRoomTypes = [
          ROOM_TYPES.ENTRANCE,
          ROOM_TYPES.FIRE_EXIT,
          ROOM_TYPES.STAIRCASE_UP,
          ROOM_TYPES.STAIRCASE_DOWN,
          ROOM_TYPES.STAIRCASE_BOTH
        ];  

        // Skip excluded room types
        if (excludedRoomTypes.includes(targetCell.room)) return;

        // Check if there's a door blocking the way
        if (targetCell.door) {
          // Only allow passage if door is open (passable)
          // OR if it's a standard closed door (entities can open these)
          const canPass = targetCell.door.passable || 
                         (targetCell.door.name === "Closed Door");

          if (!canPass) {
            // Door is locked or secure - cannot pass
            return;
          }

          // If door is closed but openable, entity opens it automatically
          if (!targetCell.door.passable && targetCell.door.name === "Closed Door") {
            // Auto-open the door for the entity
            setBuildingData(prev => {
              const newFloors = { ...prev.floors };
              const newLayout = { ...newFloors[currentFloor] };
              const newCell = { ...newLayout[cellKey] };

              newCell.door = {
                ...newCell.door,
                passable: true,
                name: "Open Door"
              };

              newLayout[cellKey] = newCell;
              newFloors[currentFloor] = newLayout;
              return { ...prev, floors: newFloors };
            });
          }
        }

        connectedRooms.push({
          x: newX,
          y: newY,
          cellKey,
          cell: targetCell,
          distance: Math.max(Math.abs(dx), Math.abs(dy)),
          entityCount: Array.isArray(targetCell.entities) ? targetCell.entities.length : 
                      (targetCell.entity ? 1 : 0)
        });
      }
    });

    return connectedRooms;
  };

  // Modified moveEntityToRoom - just records the move
  const moveEntityToRoom = (entity, fromX, fromY, toX, toY, floorNum) => {
    setPendingEntityMoves(prev => [...prev, {
      entity,
      fromX,
      fromY,
      toX,
      toY,
      floorNum
    }]);
  };

  // Apply all pending moves at once
  useEffect(() => {
    if (pendingEntityMoves.length === 0) return;

    setBuildingData(prev => {
      if (!prev || !prev.floors) return prev;

      const newFloors = { ...prev.floors };

      // Apply all moves
      pendingEntityMoves.forEach(({ entity, fromX, fromY, toX, toY, floorNum }) => {
        const floorLayout = { ...newFloors[floorNum] };

        // Remove from old position
        const fromKey = `${fromX},${fromY}`;
        if (floorLayout[fromKey]) {
          const fromCell = floorLayout[fromKey];
          if (Array.isArray(fromCell.entities)) {
            floorLayout[fromKey] = {
              ...fromCell,
              entities: fromCell.entities.filter(e => e.id !== entity.id),
              entity: fromCell.entities.filter(e => e.id !== entity.id)[0] || null
            };
          } else if (fromCell.entity && fromCell.entity.id === entity.id) {
            floorLayout[fromKey] = {
              ...fromCell,
              entity: null,
              entities: []
            };
          }
        }

        // Add to new position
        const toKey = `${toX},${toY}`;
        if (floorLayout[toKey]) {
          const toCell = floorLayout[toKey];
          const updatedEntity = {
            ...entity,
            location: {
              roomName: toCell.room.name,
              floor: floorNum,
              displayName: `${toCell.room.name} (Floor ${floorNum})`
            }
          };

          const existingEntities = Array.isArray(toCell.entities) ? toCell.entities : 
                                  (toCell.entity ? [toCell.entity] : []);
          const newEntities = [...existingEntities, updatedEntity];

          floorLayout[toKey] = {
            ...toCell,
            entities: newEntities,
            entity: newEntities[0]
          };
        }

        newFloors[floorNum] = floorLayout;
      });

      return {
        ...prev,
        floors: newFloors
      };
    });

    // Trigger collisions after moves are applied
    pendingEntityMoves.forEach(({ entity, toX, toY }) => {
      if (typeof onEntityPlayerCollision === 'function') {
        onEntityPlayerCollision(entity.id, toX, toY, 'interior');
      }
    });

    // Clear pending moves
    setPendingEntityMoves([]);
  }, [pendingEntityMoves]);

  const handleEntityDefeatWithEffects = (entityId, currentRound) => {
    // Find the entity before removing it
    let defeatedEntity = null;
    let entityPosition = null;

    // Search for entity in building data
    if (buildingData?.floors) {
      Object.entries(buildingData.floors).forEach(([floorNum, layout]) => {
        Object.entries(layout).forEach(([cellKey, cell]) => {
          const entitiesInCell = Array.isArray(cell.entities) ? cell.entities : 
                                (cell.entity ? [cell.entity] : []);

          const foundEntity = entitiesInCell.find(e => e.id === entityId && !e.defeated);
          if (foundEntity) {
            defeatedEntity = foundEntity;
            const [x, y] = cellKey.split(',').map(Number);
            entityPosition = { x, y, floor: parseInt(floorNum) };
          }
        });
      });
    }

    // Process death effects before removal
    if (defeatedEntity && entityPosition) {
      processEntityDeathEffects(defeatedEntity, entityPosition, currentRound);
    }

    // Call original defeat handler
    handleEntityDefeat(entityId);
  };

  // FIXED: Initialize entity movement timers when entities are placed
  const initializeEntityMovementTimer = (entityId, spawnRound) => {
    setEntityMovementTimers(prev => new Map(prev.set(entityId, {
      spawnRound: spawnRound,
      lastMoveRound: spawnRound,
      nextMoveRound: spawnRound // Will move immediately on first check after spawn
    })));
  };

  // UPDATED: Process entity movement based on new movement rules
  const processRoundBasedEntityMovement = (currentRound) => {
    if (!gameStarted || !buildingData?.floors) {
      return;
    }

    let entitiesProcessed = 0;
    let entitiesMoved = 0;

    // CRITICAL FIX: Collect all entities with their current positions FIRST
    const entitiesToMove = [];

    Object.entries(buildingData.floors).forEach(([floorNum, layout]) => {
      Object.entries(layout).forEach(([cellKey, cell]) => {
        const entitiesInCell = Array.isArray(cell.entities) 
          ? cell.entities.filter(e => !e.defeated && e.type === 'indoor')
          : (cell.entity && !cell.entity.defeated && cell.entity.type === 'indoor' ? [cell.entity] : []);

        entitiesInCell.forEach(entity => {
          const [x, y] = cellKey.split(',').map(Number);
          entitiesToMove.push({
            entity,
            x,
            y,
            floorNum: parseInt(floorNum)
          });
        });
      });
    });

    console.log(`Found ${entitiesToMove.length} entities to process`);

    // Process each entity's movement
    entitiesToMove.forEach(({ entity, x, y, floorNum }) => {
      entitiesProcessed++;

      const movementData = ENTITY_MOVEMENT_DATA[entity.name];
      if (!movementData) {
        console.warn(`No movement data for ${entity.name}`);
        return;
      }

      let timerData = entityMovementTimers.get(entity.id);
      if (!timerData) {
        // NEW ENTITY - Initialize and move immediately
        const newTimerData = {
          spawnRound: currentRound,
          lastMoveRound: currentRound,
          nextMoveRound: currentRound
        };

        setEntityMovementTimers(prev => new Map(prev.set(entity.id, newTimerData)));

        const moved = processEntityMovement(entity, x, y, floorNum, currentRound);
        if (moved) {
          entitiesMoved++;
          setEntityMovementTimers(prev => {
            const newTimers = new Map(prev);
            newTimers.set(entity.id, {
              spawnRound: currentRound,
              lastMoveRound: currentRound,
              nextMoveRound: currentRound + movementData.passive
            });
            return newTimers;
          });
        }
        return;
      }

      // Check if it's time to move
      if (currentRound >= timerData.nextMoveRound) {
        const moved = processEntityMovement(entity, x, y, floorNum, currentRound);

        if (moved) {
          entitiesMoved++;
        }

        // Determine next move timing
        const inRange = hasPlayersInRange(x, y, floorNum, 5);
        const entityRage = rageSystem?.getEntityRage?.(entity.id) || 0;

        let isChasing = false;

        if (entity.name.includes("Snare Flea")) {
          isChasing = hasPlayersInRange(x, y, floorNum, 1);
        } else if (entity.name.includes("Jester")) {
          isChasing = true;
        } else if (entity.name.includes("Hoarding Bug")) {
          isChasing = entityRage >= 3 || inRange;
        } else if (entity.name.includes("Maneater")) {
          isChasing = entityRage >= 3 && inRange;
        } else if (entity.name.includes("Spore Lizard")) {
          isChasing = inRange;
        } else if (entity.name.includes("Bunker Spider")) {
          isChasing = inRange;
        } else if (entity.name.includes("Bracken") || entity.name.includes("Ghost Girl")) {
          isChasing = false;
        } else {
          isChasing = inRange;
        }

        const movementRounds = isChasing ? movementData.chasing : movementData.passive;

        setEntityMovementTimers(prev => {
          const newTimers = new Map(prev);
          newTimers.set(entity.id, {
            ...timerData,
            lastMoveRound: currentRound,
            nextMoveRound: currentRound + movementRounds
          });
          return newTimers;
        });
      }
    });

    console.log(`Movement processed: ${entitiesProcessed} entities, ${entitiesMoved} moved`);
  };

  // FIXED: Update entity placement to initialize timers
  useEffect(() => {
    if (!gameStarted || !buildingData?.floors || !entityManager) return;

    // Get entities needing placement
    const allEntitiesNeedingPlacement = entityManager.getEntitiesNeedingPlacement(buildingData.floors);

    // CRITICAL FIX: Filter for ONLY indoor entities
    const indoorEntitiesNeedingPlacement = allEntitiesNeedingPlacement.filter(entity => 
      entity.type === 'indoor'
    );

    if (indoorEntitiesNeedingPlacement.length === 0) {
      // No indoor entities to place
      return;
    }

    // Only process indoor entities
    const entityToPlace = indoorEntitiesNeedingPlacement[0];

    const success = entityManager.placeEntityInRandomRoom(
      entityToPlace, 
      buildingData.floors, 
      setBuildingData,
      (placementInfo) => {
        // Initialize movement timer for newly placed entity
        initializeEntityMovementTimer(entityToPlace.id, currentRound);

        if (onEntityPlacement) {
          onEntityPlacement({
            ...placementInfo,
            entityId: entityToPlace.id
          });
        }
      }
    );
  }, [entityManager.getAllEntities().length, buildingData?.floors, gameStarted]);

  const enhancedHandleDoorAction = (door, cellKey, action) => {
    const result = handleDoorAction(door, cellKey, action);
    
    // Show message to user
    setDoorActionMessage(result.message);
    setTimeout(() => setDoorActionMessage(''), 3000);
    
    return result;
  };

  // Get current moon data
  const currentMoon = moons.find(m => m.name === selectedMoon);

  // Get current floor layout
  const currentFloorLayout = buildingData?.floors[currentFloor] || {};

  // Generate interior when moon changes or game starts
  useEffect(() => {
    if (selectedMoon && gameStarted && currentMoon) {
      generateNewInteriorLayout();
    }
  }, [selectedMoon, gameStarted]);

  useEffect(() => {
    if (currentRound > 0 && gameStarted && buildingData?.floors) {
      processRoundBasedEntityMovement(currentRound);
    }
  }, [currentRound]); // This triggers when currentRound changes

  // UPDATED: Entity defeat handler - much simpler now
  const handleEntityDefeat = (entityId) => {
    // Remove from grid
    setBuildingData(prev => {
      if (!prev || !prev.floors) return prev;

      const newFloors = { ...prev.floors };

      Object.keys(newFloors).forEach(floorNum => {
        const layout = { ...newFloors[floorNum] };
        Object.keys(layout).forEach(cellKey => {
          const cell = layout[cellKey];

          if (Array.isArray(cell.entities)) {
            // Remove from entities array
            const filteredEntities = cell.entities.filter(e => e.id !== entityId);
            layout[cellKey] = {
              ...cell,
              entities: filteredEntities,
              entity: filteredEntities[0] || null // Update primary entity reference
            };
          } else if (cell.entity && cell.entity.id === entityId) {
            // Legacy single entity removal
            layout[cellKey] = {
              ...cell,
              entity: null,
              entities: []
            };
          }
        });
        newFloors[floorNum] = layout;
      });

      return { ...prev, floors: newFloors };
    });

    // Clean up movement timer
    setEntityMovementTimers(prev => {
      const newTimers = new Map(prev);
      newTimers.delete(entityId);
      return newTimers;
    });

    // Remove from entity manager and notify main app
    if (onEntityDefeat) {
      onEntityDefeat({ id: entityId });
    }

    setSelectedCell(prev => prev ? { ...prev } : null);
  };

  // ===== MODIFIED: Generate new interior layout WITH LIGHTING =====
  const generateNewInteriorLayout = () => {
    if (!currentMoon) return;
    
    // Determine interior type
    const interiorType = determineInteriorType();
    setCurrentInteriorType(interiorType);
    
    // Calculate target rooms using the new system
    const roomCount = calculateRoomCount(currentMoon.mapSizeMultiplier, interiorType);
    const targetRooms = Math.floor(Math.random() * (roomCount.max - roomCount.min + 1)) + roomCount.min;
    
    // Generate complete building
    const building = generateCompleteBuilding(targetRooms, selectedMoon, interiorType);

    // Add this after generateCompleteBuilding but before room generation
    Object.entries(building.floors).forEach(([floorNum, layout]) => {
      const pathNetwork = findPathNetworkInLayout(layout);
      validateAndFixPaths(layout, pathNetwork);
    });

    // Add room generation to each floor
    Object.entries(building.floors).forEach(([floorNum, layout]) => {
      const pathNetwork = findPathNetworkInLayout(layout);
      const floorRoomTarget = Math.ceil(targetRooms / Object.keys(building.floors).length);
      generateMazeRoomsAlongPaths(layout, pathNetwork, interiorType, floorRoomTarget);
    });

    // Distribute scrap, doors, and traps
    distributeScrapAcrossFloors(building.floors);
    distributeDoorsAcrossFloors(building.floors);
    distributeTrapsAcrossFloors(building.floors);

    // Generate lighting for all floors
    const lightingData = {};
    Object.entries(building.floors).forEach(([floorNum, layout]) => {
      lightingData[floorNum] = generateFloorLighting(layout);
    });
    setFloorLighting(lightingData);

    // Set building data and reset game state
    setBuildingData(building);
    setCurrentFloor(building.buildingInfo.entranceFloor); // Start on entrance floor
    setCollectedScrap(new Set());
    setTriggeredTraps(new Set());
    setSelectedCell(null);
    setCollectedApparatus(new Set()); // Reset apparatus collection
  };

  // Determine interior type based on moon chances
  const determineInteriorType = () => {
    if (!currentMoon) return INTERIOR_TYPES.FACTORY;
    
    const chances = currentMoon.interiorChances;
    const random = Math.random() * 100;
    
    if (random < chances[INTERIOR_TYPES.FACTORY]) {
      return INTERIOR_TYPES.FACTORY;
    } else if (random < chances[INTERIOR_TYPES.FACTORY] + chances[INTERIOR_TYPES.MANSION]) {
      return INTERIOR_TYPES.MANSION;
    } else {
      return INTERIOR_TYPES.MINESHAFT;
    }
  };

  // Find path network in existing layout
  const findPathNetworkInLayout = (layout) => {
    const pathNetwork = new Set();
    
    Object.entries(layout).forEach(([cellKey, cell]) => {
      if (cell.type === 'room' && 
          (cell.room === ROOM_TYPES.CORRIDOR || cell.room === ROOM_TYPES.HALLWAY)) {
        pathNetwork.add(cellKey);
      }
    });
    
    return pathNetwork;
  };

  // Distribute scrap across floors with STRICT ENFORCEMENT + EXCLUSION ZONES
  const distributeScrapAcrossFloors = (floors) => {
    // Calculate scrap count based on room count and moon multiplier
    const roomCount = calculateRoomCount(currentMoon?.mapSizeMultiplier || 1.0, currentInteriorType);
    const avgRooms = (roomCount.min + roomCount.max) / 2;
    
    // Scale scrap based on facility size (0.8-1.2x room count)
    const scrapMin = Math.floor(avgRooms * 0.8);
    const scrapMax = Math.floor(avgRooms * 1.2);
    const targetScrapCount = Math.floor(Math.random() * (scrapMax - scrapMin + 1)) + scrapMin;
    
    // Collect all eligible rooms from all floors (EXCLUDING entrance and staircases)
    const allEligibleRooms = [];
    
    Object.entries(floors).forEach(([floorNum, layout]) => {
      Object.entries(layout).forEach(([cellKey, cell]) => {
        if (cell.type === 'room' && cell.room && cell.room.scrapChance > 0) {
          // Exclude infrastructure rooms AND entrance/staircases
          const excludedRoomTypes = [
            ROOM_TYPES.ENTRANCE,
            ROOM_TYPES.FIRE_EXIT,
            ROOM_TYPES.STAIRCASE_UP,
            ROOM_TYPES.STAIRCASE_DOWN,
            ROOM_TYPES.STAIRCASE_BOTH
          ];
        
          if (!excludedRoomTypes.includes(cell.room)) {
            allEligibleRooms.push({
              floorNum: parseInt(floorNum),
              cellKey,
              cell,
              scrapChance: cell.room.scrapChance,
              roomType: cell.room.name
            });
          }
        }
      });
    });
  
    // Calculate hallway scrap allocation (25-40% of total)
    const hallwayPercentage = Math.floor(Math.random() * (40 - 25 + 1)) + 25;
    const hallScrapCount = Math.ceil(targetScrapCount * (hallwayPercentage / 100));
  
    // Separate hallways from other rooms
    const hallwayTypes = ['Long Corridor', 'Hallway'];
    const hallwayRooms = allEligibleRooms.filter(room => hallwayTypes.includes(room.roomType));
    const nonHallwayRooms = allEligibleRooms.filter(room => !hallwayTypes.includes(room.roomType));
  
    let scrapPlaced = 0;
    let scrapGeneratedCount = 0;
    let placedHallScrapCount = 0;
  
    // PHASE 1: Place scrap in hallways first (up to hallScrapCount)
    const availableHallways = [...hallwayRooms];
    while (placedHallScrapCount < hallScrapCount && availableHallways.length > 0 && scrapPlaced < targetScrapCount) {
      // Use weighted selection for hallways
      const totalWeight = availableHallways.reduce((sum, room) => sum + room.scrapChance, 0);
    
      if (totalWeight === 0) break;
    
      let randomWeight = Math.random() * totalWeight;
      let selectedRoom = null;
      let selectedIndex = -1;
    
      for (let i = 0; i < availableHallways.length; i++) {
        randomWeight -= availableHallways[i].scrapChance;
        if (randomWeight <= 0) {
          selectedRoom = availableHallways[i];
          selectedIndex = i;
          break;
        }
      }
    
      if (selectedRoom) {
        const scrap = generateScrapFromMoonData(selectedRoom.cell.room, currentMoon);
        if (scrap) {
          if (!selectedRoom.cell.scraps) selectedRoom.cell.scraps = [];
          selectedRoom.cell.scraps.push(scrap);
          scrapPlaced++;
          scrapGeneratedCount++;
          placedHallScrapCount++;
        }
        availableHallways.splice(selectedIndex, 1);
      }
    }
  
    // PHASE 2: Place remaining scrap in non-hallway rooms
    const availableNonHallways = [...nonHallwayRooms];
    let attempts = 0;
    const maxAttempts = (targetScrapCount - scrapPlaced) * 3;
  
    while (scrapPlaced < targetScrapCount && availableNonHallways.length > 0 && attempts < maxAttempts) {
      const totalWeight = availableNonHallways.reduce((sum, room) => sum + room.scrapChance, 0);
    
      if (totalWeight === 0) break;
    
      let randomWeight = Math.random() * totalWeight;
      let selectedRoom = null;
      let selectedIndex = -1;
    
      for (let i = 0; i < availableNonHallways.length; i++) {
        randomWeight -= availableNonHallways[i].scrapChance;
        if (randomWeight <= 0) {
          selectedRoom = availableNonHallways[i];
          selectedIndex = i;
          break;
        }
      }
    
      if (selectedRoom) {
        const scrap = generateScrapFromMoonData(selectedRoom.cell.room, currentMoon);
        if (scrap) {
          if (!selectedRoom.cell.scraps) selectedRoom.cell.scraps = [];
          selectedRoom.cell.scraps.push(scrap);
          scrapPlaced++;
          scrapGeneratedCount++;
        }
        availableNonHallways.splice(selectedIndex, 1);
      }
    
      attempts++;
    }
  
    // PHASE 3: Emergency placement if still short
    if (scrapPlaced < targetScrapCount) {
      const remainingRooms = [...availableHallways, ...availableNonHallways];
    
      while (scrapPlaced < targetScrapCount && remainingRooms.length > 0) {
        const randomRoom = remainingRooms[Math.floor(Math.random() * remainingRooms.length)];
        const scrap = generateScrapFromMoonData(randomRoom.cell.room, currentMoon);
      
        if (scrap) {
          randomRoom.cell.scrap = scrap;
          scrapPlaced++;
          scrapGeneratedCount++;
        }
      
        const roomIndex = remainingRooms.indexOf(randomRoom);
        remainingRooms.splice(roomIndex, 1);
      }
    }
  
    // Store scrap stats for UI display
    if (buildingData) {
      setBuildingData(prev => ({
        ...prev,
        scrapStats: {
          target: targetScrapCount,
          placed: scrapPlaced,
          generated: scrapGeneratedCount,
          successRate: ((scrapPlaced / targetScrapCount) * 100).toFixed(1),
          roomsUsed: allEligibleRooms.length - availableHallways.length - availableNonHallways.length,
          totalEligibleRooms: allEligibleRooms.length,
          hallwayScrap: placedHallScrapCount,
          roomScrap: scrapPlaced - placedHallScrapCount,
          hallwayPercentage: hallwayPercentage
        }
      }));
    }
  };

  // Distribute traps across floors (EXCLUDING entrance and staircases)
  const distributeTrapsAcrossFloors = (floors) => {
    let trapsPlaced = 0;
    let trapAttempts = 0;
    
    Object.entries(floors).forEach(([floorNum, layout]) => {
      Object.entries(layout).forEach(([cellKey, cell]) => {
        if (cell.type === 'room' && cell.room && cell.room.trapChance > 0) {
          // ✅ EXCLUDE entrance and staircases from trap placement
          const excludedFromTraps = [
            ROOM_TYPES.ENTRANCE, // ✅ NO TRAPS IN ENTRANCE
            ROOM_TYPES.STAIRCASE_UP, // ✅ NO TRAPS IN STAIRCASES
            ROOM_TYPES.STAIRCASE_DOWN, // ✅ NO TRAPS IN STAIRCASES
            ROOM_TYPES.STAIRCASE_BOTH // ✅ NO TRAPS IN STAIRCASES
          ];
          
          if (!excludedFromTraps.includes(cell.room)) {
            trapAttempts++;
            if (Math.random() < cell.room.trapChance) {
              const trapTypes = Object.values(TRAP_TYPES);
              const selectedTrap = trapTypes[Math.floor(Math.random() * trapTypes.length)];
              
              const newTrap = {
                id: `trap_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                name: selectedTrap.name,
                danger: selectedTrap.danger,
                detection: selectedTrap.detection,
                roll: selectedTrap.roll,
                wounds: selectedTrap.wounds,
                strain: selectedTrap.strain
              };

              cell.traps = [newTrap];
              cell.trap = newTrap;
              
              trapsPlaced++;
            }
          }
        }
      });
    });
  };

  // Floor navigation
  const changeFloor = (direction) => {
    if (!buildingData) return;
    
    const newFloor = currentFloor + direction;
    if (newFloor >= 0 && newFloor < buildingData.buildingInfo.totalFloors) {
      setCurrentFloor(newFloor);
      setSelectedCell(null);
    }
  };

  // Cell click handler
  const handleCellClick = (x, y) => {
    if (isPlayerMovementMode) {
      handlePlayerMovementClick(x, y);
      return;
    }

    const cellKey = `${x},${y}`;
    const cell = currentFloorLayout[cellKey];

    if (!cell) return;

    // Handle staircase clicks
    if (cell.type === 'room' && 
        (cell.room === ROOM_TYPES.STAIRCASE_UP || 
         cell.room === ROOM_TYPES.STAIRCASE_DOWN || 
         cell.room === ROOM_TYPES.STAIRCASE_BOTH)) {
      handleStaircaseClick(cell, x, y);
      return;
    }

    // UPDATED: Include entities array in selected cell
    const entitiesAtPosition = Array.isArray(cell.entities) ? 
      cell.entities.filter(e => !e.defeated) :
      (cell.entity && !cell.entity.defeated ? [cell.entity] : []);

    setSelectedCell({ 
      x, 
      y, 
      ...cell, 
      floor: currentFloor,
      entities: entitiesAtPosition // Add entities array to selected cell
    });
  };

  // Staircase click handler with connection info
  const handleStaircaseClick = (staircase, x, y) => {
    if (staircase.room === ROOM_TYPES.STAIRCASE_UP && currentFloor < buildingData.buildingInfo.totalFloors - 1) {
      changeFloor(1);
    } else if (staircase.room === ROOM_TYPES.STAIRCASE_DOWN && currentFloor > 0) {
      changeFloor(-1);
    } else if (staircase.room === ROOM_TYPES.STAIRCASE_BOTH) {
      // For both-way staircases, go up by default, down if at top
      if (currentFloor < buildingData.buildingInfo.totalFloors - 1) {
        changeFloor(1);
      } else if (currentFloor > 0) {
        changeFloor(-1);
      }
    }
  };

  // Event handlers
  const handleScrapCollection = (scrap) => {
    if (collectedScrap.has(scrap.id)) return;

    // Check if any players are in the same room
    const playersInRoom = players?.filter(player => 
      player.position?.currentArea === 'interior' &&
      player.position.interior.x === selectedCell.x &&
      player.position.interior.y === selectedCell.y &&
      player.position.interior.floor === currentFloor
    ) || [];

    if (playersInRoom.length > 0) {
      if (playersInRoom.length === 1) {
        // Only one player - try to add to their inventory
        const player = playersInRoom[0];
        const inventory = player.inventory || [];

        // Check for empty slots more reliably
        const filledSlots = inventory.filter(item => item && item.name && item.name.trim() !== '' && item.name !== 'Walkie-Talkie' && item.name !== 'Pro Flashlight').length;

        if (filledSlots >= 4) {
          alert(`Cannot collect ${scrap.name} - ${player.name}'s inventory is full!`);
          return;
        }

        const scrapItem = {
          name: scrap.name,
          weight: scrap.weight || 0,
          price: scrap.value || 0,
          conductive: scrap.conductive || false,
          twoHanded: scrap.twoHanded || false
        };

        // Add item to player's inventory using setPlayers
        setPlayers(prev => prev.map(p => {
          if (p.id === player.id) {
            const currentInventory = p.inventory || [
              { name: '', weight: 0, price: 0, conductive: false, twoHanded: false },
              { name: '', weight: 0, price: 0, conductive: false, twoHanded: false },
              { name: '', weight: 0, price: 0, conductive: false, twoHanded: false },
              { name: '', weight: 0, price: 0, conductive: false, twoHanded: false },
              { name: 'Pro Flashlight', weight: 5, price: 0, conductive: false, twoHanded: false },
              { name: 'Walkie-Talkie', weight: 0, price: 0, conductive: false, twoHanded: false }
            ];

            const newInventory = [...currentInventory];
            const emptySlotIndex = newInventory.findIndex(item => !item.name || item.name.trim() === '');

            if (emptySlotIndex !== -1) {
              newInventory[emptySlotIndex] = scrapItem;
            }

            return { ...p, inventory: newInventory };
          }
          return p;
        }));
      } else {
        // Multiple players - let user choose
        const playerNames = playersInRoom.map(p => p.name);
        const choice = prompt(`Multiple players in room: ${playerNames.join(', ')}\n\nWho should collect ${scrap.name}?\n\nEnter player name or cancel to abort:`);

        if (!choice) return; // User cancelled

        const selectedPlayer = playersInRoom.find(p => p.name.toLowerCase() === choice.toLowerCase().trim());

        if (!selectedPlayer) {
          alert(`Player "${choice}" not found in room!`);
          return;
        }

        // Check if selected player has space
        const inventory = selectedPlayer.inventory || [];
        const filledSlots = inventory.filter(item => item && item.name && item.name.trim() !== '').length;

        if (filledSlots >= 4) {
          alert(`Cannot collect ${scrap.name} - ${selectedPlayer.name}'s inventory is full!`);
          return;
        }

        const scrapItem = {
          name: scrap.name,
          weight: scrap.weight || 0,
          price: scrap.value || 0,
          conductive: scrap.conductive || false,
          twoHanded: scrap.twoHanded || false
        };

        // Add item to selected player's inventory using setPlayers
        setPlayers(prev => prev.map(p => {
          if (p.id === selectedPlayer.id) {
            const currentInventory = p.inventory || [
              { name: '', weight: 0, price: 0, conductive: false, twoHanded: false },
              { name: '', weight: 0, price: 0, conductive: false, twoHanded: false },
              { name: '', weight: 0, price: 0, conductive: false, twoHanded: false },
              { name: '', weight: 0, price: 0, conductive: false, twoHanded: false },
              { name: 'Pro Flashlight', weight: 5, price: 0, conductive: false, twoHanded: false },
              { name: 'Walkie-Talkie', weight: 0, price: 0, conductive: false, twoHanded: false }
            ];

            const newInventory = [...currentInventory];
            const emptySlotIndex = newInventory.findIndex(item => !item.name || item.name.trim() === '');

            if (emptySlotIndex !== -1) {
              newInventory[emptySlotIndex] = scrapItem;
            }

            return { ...p, inventory: newInventory };
          }
          return p;
        }));
      }
    }

    // Mark scrap as collected
    const newCollected = new Set(collectedScrap);
    newCollected.add(scrap.id);
    setCollectedScrap(newCollected);

    console.log(scrap);
  };

  const handleEntityEncounter = (entityId) => {
    // Find entity across all floors
    for (const layout of Object.values(buildingData.floors)) {
      for (const cell of Object.values(layout)) {
        if (cell.entity && cell.entity.id === entityId) {
          if (onEntityEncounter) {
            onEntityEncounter(cell.entity);
          }
          return;
        }
      }
    }
  };

  // Door interaction handler
  const { handleDoorAction } = useDoorActions(
    setBuildingData, 
    currentFloor, 
    setSelectedCell
  );

  // ADD ENHANCED ENTITY BLINKING STYLES
  const entityStyles = `
    @keyframes entityBlink {
      0%, 50% {
        background-color: rgba(255, 140, 0, 0.8) !important;
        border: 2px solid #ff8c00 !important;
        box-shadow: 
          0 0 15px rgba(255, 140, 0, 0.9),
          0 0 25px rgba(255, 140, 0, 0.6),
          inset 0 0 10px rgba(255, 140, 0, 0.3);
        transform: scale(1.1);
      }
      51%, 100% {
        background-color: rgba(255, 69, 0, 0.9) !important;
        border: 2px solid #ff4500 !important;
        box-shadow: 
          0 0 20px rgba(255, 69, 0, 1),
          0 0 35px rgba(255, 69, 0, 0.8),
          inset 0 0 15px rgba(255, 69, 0, 0.4);
        transform: scale(1.15);
      }
    }
    
    .entity-blink {
      animation: entityBlink 1.5s infinite ease-in-out;
      position: relative;
      z-index: 10;
    }
    
    /* Alternative pulsing ring effect */
    @keyframes entityPulseRing {
      0% {
        box-shadow: 
          0 0 0 0 rgba(255, 140, 0, 0.8),
          0 0 15px rgba(255, 140, 0, 0.6);
      }
      50% {
        box-shadow: 
          0 0 0 8px rgba(255, 140, 0, 0.3),
          0 0 25px rgba(255, 140, 0, 0.8);
      }
      100% {
        box-shadow: 
          0 0 0 0 rgba(255, 140, 0, 0),
          0 0 15px rgba(255, 140, 0, 0.6);
      }
    }
    
    .entity-pulse-ring {
      animation: entityPulseRing 2s infinite;
      background-color: rgba(255, 140, 0, 0.4) !important;
      border: 2px solid #ff8c00 !important;
    }
  `;

  // UPDATED: Grid cell renderer with entity blinking animation
  const renderGridCell = (x, y) => {
    const cellKey = `${x},${y}`;
    let cell = currentFloorLayout[cellKey];
    const isSelected = selectedCell && selectedCell.x === x && selectedCell.y === y;
    const isCenter = x === CENTER_POINT.x && y === CENTER_POINT.y;

    if (!cell) return null;

    // ✅ NEW: Enhance hallway cells with story-aligned features
    cell = enhanceHallwayCell(cell, x, y, currentFloor, currentInteriorType, selectedMoon);

    // Get all entities at this position
    const entitiesAtPosition = Array.isArray(cell.entities) ? cell.entities.filter(e => !e.defeated) :
                              (cell.entity && !cell.entity.defeated ? [cell.entity] : []);

    // Check for players at this position
    const playersAtPosition = players?.filter(player => 
      player.position?.currentArea === 'interior' &&
      player.position.interior.x === x &&
      player.position.interior.y === y &&
      player.position.interior.floor === currentFloor
    ) || [];

    let cellClass = 'w-8 h-8 border border-gray-500 flex items-center justify-center text-sm font-bold relative cursor-pointer transition-all hover:scale-105 ';
    let content = '';
    let showStatusIndicators = true;

    // ADD ENTITY BLINKING CLASS if any entities present
    if (entitiesAtPosition.length > 0) {
      cellClass += 'entity-blink ';
    }

    if (isPlayerMovementMode) {
      if (cell && cell.type === 'room' && cell.room) {
        cellClass += 'ring-2 ring-cyan-400 hover:bg-cyan-500/30 ';
      } else {
        cellClass += 'opacity-30 cursor-not-allowed ';
      }

      // Highlight current player position
      if (movingPlayer && 
          movingPlayer.position?.interior.x === x && 
          movingPlayer.position?.interior.y === y &&
          movingPlayer.position?.interior.floor === currentFloor) {
        cellClass += 'bg-cyan-600/50 ring-4 ring-cyan-300 ';
      }
    }

    // ===== LIGHTING OVERLAY =====
    let lightingOverlay = null;
    if (cell.type === 'room' && floorLighting[currentFloor]) {
      const baseLight = floorLighting[currentFloor][cellKey];
      if (baseLight !== undefined) {
        const apparatusCollected = isApparatusCollected(buildingData, collectedApparatus);
        const displayLight = getDisplayLightLevel(baseLight, apparatusCollected);
        lightingOverlay = getLightingOverlay(displayLight);
      }
    }

    // Player styling (highest priority)
    if (playersAtPosition.length > 0) {
      cellClass += 'ring-4 ring-cyan-400 bg-cyan-500/20 ';
      if (playersAtPosition.length > 1) {
        content = `👥${playersAtPosition.length}`;
      } else {
        content = '👤';
      }
      showStatusIndicators = false;
    } else if (cell.type === 'room') {
      const room = cell.room;
      cellClass += `${room.color} text-white `;

      // Special indicators for key rooms
      if (room === ROOM_TYPES.ENTRANCE) {
        content = '🚪';
        cellClass += 'ring-2 ring-green-400 animate-pulse ';
      } else if (room === ROOM_TYPES.FIRE_EXIT) {
        content = '🚨';
        cellClass += 'ring-2 ring-red-400 animate-pulse ';
      } else if (room === ROOM_TYPES.STAIRCASE_UP || 
                 room === ROOM_TYPES.STAIRCASE_DOWN || 
                 room === ROOM_TYPES.STAIRCASE_BOTH) {
        if (cell.staircaseConnection) {
          const staircaseLetter = cell.staircaseConnection.name.split(' ')[1] || '?';
          content = staircaseLetter;
        } else {
          content = '🪜';
        }
        cellClass += 'ring-2 ring-indigo-400 ';
        showStatusIndicators = false;
      }
      // Apparatus Room special styling
      else if (room === ROOM_TYPES.APPARATUS) {
        content = '🔧';
        cellClass += 'ring-3 ring-violet-400 animate-pulse ';
        cellClass += 'shadow-lg shadow-violet-500/50 ';
      }
      else if (cell.door) {
        const directionIndicators = {
          north: '▲',
          south: '▼',
          east: '▶',
          west: '◀'
        };
        content = directionIndicators[cell.door.side] || '●';
        if (!cell.door.passable) {
          cellClass += 'ring-2 ring-red-300 ';
        } else {
          cellClass += 'ring-1 ring-green-300 ';
        }
      } else if (entitiesAtPosition.length > 0) {
        // Show entity count if multiple entities
        if (entitiesAtPosition.length > 1) {
          content = `👹${entitiesAtPosition.length}`;
        } else {
          content = '👹';
        }
      }
    }

    if (isSelected) {
      cellClass += 'ring-4 ring-blue-400 scale-110 z-10 ';
    }

    // ✅ ENHANCED: Build tooltip including hallway features
    let tooltip = getCellTooltip(cell, x, y);
    tooltip = getEnhancedHallwayTooltip(cell, tooltip);

    if (playersAtPosition.length > 0) {
      const playerNames = playersAtPosition.map(p => p.name).join(', ');
      tooltip += ` | 👤 Players: ${playerNames}`;
      playersAtPosition.forEach(player => {
        if (player.wounds > 0 || player.strain > 0 || player.status !== 'healthy') {
          tooltip += ` | ${player.name}: ${player.status}`;
          if (player.wounds > 0 || player.strain > 0) {
            tooltip += ` (${player.wounds}W/${player.strain}S)`;
          }
        }
      });
    }

    return (
      <div
        key={cellKey}
        className={cellClass}
        onClick={() => handleCellClick(x, y)}
        title={tooltip}
      >
        {/* Lighting overlay */}
        {lightingOverlay && (
          <div 
            className="absolute inset-0 pointer-events-none z-0"
            style={{ backgroundColor: lightingOverlay }}
          />
        )}

        {/* Content layer */}
        <div className="relative z-10">
          {content}
        </div>

        {/* Player indicator overlay */}
        {playersAtPosition.length > 0 && (
          <div className="absolute top-0 right-0 -mt-1 -mr-1 z-20">
            <div className="w-3 h-3 bg-cyan-500 rounded-full border border-cyan-300 flex items-center justify-center shadow-lg">
              {playersAtPosition.length > 1 && (
                <span className="text-xs text-white font-bold">
                  {playersAtPosition.length}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Status indicators */}
        {showStatusIndicators && playersAtPosition.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="flex flex-col items-center space-y-0.5">
              {/* Hazard indicators */}
              {cell.hazards && cell.hazards.length > 0 && cell.hazards.map(hazard => (
                <div key={hazard.id} className="w-2 h-2 bg-purple-500 rounded-full border border-purple-700 shadow-lg animate-pulse">
                  {hazard.type === 'spider_web' && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-gray-800 rounded-full border border-gray-600 flex items-center justify-center">
                      <span className="text-xs text-white font-bold">🕸️</span>
                    </div>
                  )}
                </div>
              ))}
              {cell.scraps && cell.scraps.filter(s => !collectedScrap.has(s.id)).length > 0 && (
                <div className="w-2 h-2 bg-yellow-500 rounded-full border border-yellow-700 shadow-lg">
                  {cell.scraps.filter(s => !collectedScrap.has(s.id)).length > 1 && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full border border-yellow-600 flex items-center justify-center">
                      <span className="text-xs text-white font-bold">{cell.scraps.filter(s => !collectedScrap.has(s.id)).length}</span>
                    </div>
                  )}
                </div>
              )}
              {cell.apparatus && !collectedApparatus.has(cell.apparatus.id) && (
                <div className="w-2 h-2 bg-violet-600 rounded-full border border-violet-800 shadow-lg animate-pulse">
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-violet-500 rounded-full border border-violet-700 flex items-center justify-center">
                    <span className="text-xs text-white font-bold">A</span>
                  </div>
                </div>
              )}
              {cell.droppedItems && cell.droppedItems.length > 0 && (
                <div className="w-2 h-2 bg-blue-500 rounded-full border border-blue-700 shadow-lg">
                  {cell.droppedItems.length > 1 && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-400 rounded-full border border-blue-600 flex items-center justify-center">
                      <span className="text-xs text-white font-bold">{cell.droppedItems.length}</span>
                    </div>
                  )}
                </div>
              )}
              {/* Show entity count indicator */}
              {entitiesAtPosition.length > 0 && (
                <div className="w-2 h-2 bg-orange-600 rounded-full border border-orange-800 shadow-lg animate-pulse">
                  {entitiesAtPosition.length > 1 && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-600 rounded-full border border-red-800 flex items-center justify-center">
                      <span className="text-xs text-white font-bold">{entitiesAtPosition.length}</span>
                    </div>
                  )}
                </div>
              )}
              {((cell.traps && cell.traps.some(trap => !triggeredTraps.has(trap.id))) || 
                (cell.trap && !triggeredTraps.has(cell.trap.id))) && (
                <div className="w-2 h-2 bg-purple-600 rounded-full border border-purple-800 shadow-lg">
                  {cell.traps && cell.traps.filter(trap => !triggeredTraps.has(trap.id)).length > 1 && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-400 rounded-full border border-purple-600 flex items-center justify-center">
                      <span className="text-xs text-white font-bold">{cell.traps.filter(trap => !triggeredTraps.has(trap.id)).length}</span>
                    </div>
                  )}
                </div>
              )}
              {cell.door && (
                <div className={`w-2 h-2 rounded-full border shadow-lg ${getEnhancedDoorIndicator(cell.door)}`}></div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  // ===== MODIFIED: Enhanced tooltip with lighting information =====
  const getCellTooltip = (cell, x, y) => {
    let tooltip = `(${x},${y}) Floor ${currentFloor}`;

    if (cell.type === 'wall') {
      tooltip = `Wall at ${tooltip}`;
      if (x === CENTER_POINT.x && y === CENTER_POINT.y) {
        tooltip += ' - CENTER POINT';
      }
    } else if (cell.type === 'room') {
      tooltip = `${cell.room.name} at ${tooltip}`;

      // ===== NEW: Add lighting information =====
      if (floorLighting[currentFloor]) {
        const cellKey = `${x},${y}`;
        const baseLight = floorLighting[currentFloor][cellKey];
        
        if (baseLight !== undefined) {
          const apparatusCollected = isApparatusCollected(buildingData, collectedApparatus);
          const displayLight = getDisplayLightLevel(baseLight, apparatusCollected);
          const lightDesc = getLightDescription(displayLight);
          
          tooltip += ` | 💡 Light: ${displayLight}/10 (${lightDesc})`;
          
          if (apparatusCollected && baseLight > displayLight) {
            tooltip += ` [Apparatus penalty applied]`;
          }
        }
      }

      // ✅ ADD: Special apparatus room information
      if (cell.room === ROOM_TYPES.APPARATUS) {
        tooltip += ' - APPARATUS ROOM';
        if (cell.apparatus) {
          tooltip += ` | Contains: ${cell.apparatus.name}`;
        }
      }

      if (cell.staircaseConnection) {
        tooltip += ` | 🪜 ${cell.staircaseConnection.name}`;
        tooltip += ` | Floors: ${cell.staircaseConnection.floors.join(', ')}`;
      }

      if (cell.room === ROOM_TYPES.STAIRCASE_UP) {
        tooltip += ` - Go UP to Floor ${currentFloor + 1}`;
      } else if (cell.room === ROOM_TYPES.STAIRCASE_DOWN) {
        tooltip += ` - Go DOWN to Floor ${currentFloor - 1}`;
      } else if (cell.room === ROOM_TYPES.STAIRCASE_BOTH) {
        tooltip += ` - Change floors`;
      }
    }

    if (cell.scraps && cell.scraps.length > 0) {
      const uncollectedScraps = cell.scraps.filter(s => !collectedScrap.has(s.id));
      if (uncollectedScraps.length > 0) {
        const scrapNames = uncollectedScraps.map(s => `${s.name} (${s.value}¢)`).join(', ');
        tooltip += ` | 💰 ${uncollectedScraps.length} scrap: ${scrapNames}`;
      }
    }

    // ✅ NEW: Add apparatus information to tooltip
    if (cell.apparatus && !collectedApparatus.has(cell.apparatus.id)) {
      tooltip += ` | 🔧 ${cell.apparatus.name} (${cell.apparatus.value} credits)`;
      if (cell.apparatus.weight) {
        tooltip += ` | Weight: ${cell.apparatus.weight}kg`;
      }
      if (cell.apparatus.twoHanded) {
        tooltip += ` | Two-handed`;
      }
      if (cell.apparatus.dangerous) {
        tooltip += ` | DANGEROUS`;
      }
    }

    if (cell.droppedItems && cell.droppedItems.length > 0) {
      const itemNames = cell.droppedItems.map(item => item.name).join(', ');
      tooltip += ` | 📦 Dropped items: ${itemNames}`;
    }

    // Entity information (existing code)
    const entitiesAtPosition = Array.isArray(cell.entities) ? 
      cell.entities.filter(e => !e.defeated) :
      (cell.entity && !cell.entity.defeated ? [cell.entity] : []);

    if (entitiesAtPosition.length > 0) {
      if (entitiesAtPosition.length === 1) {
        const entity = entitiesAtPosition[0];
        const entityLocation = entity.location?.displayName || 
                             `${cell.room?.name || 'Unknown Room'} (Floor ${currentFloor})`;
      
        const movementData = ENTITY_MOVEMENT_DATA[entity.name];
        const currentTimer = entityMovementTimers.get(entity.id);
        const movementInfo = movementData && currentTimer
          ? ` | Next move: ${currentTimer.nextMoveRound - currentRound} rounds` 
          : '';
      
        tooltip += ` | 👾 ${entity.name} (Power: ${entity.powerLevel}) in ${entityLocation}${movementInfo}`;
      } else {
        tooltip += ` | 👾 ${entitiesAtPosition.length} ENTITIES: ${entitiesAtPosition.map(e => e.name).join(', ')}`;
        const totalPower = entitiesAtPosition.reduce((sum, e) => sum + (e.powerLevel || 0), 0);
        tooltip += ` | Total Power: ${totalPower}`;
      }

      if (gameStarted && entitiesAtPosition.length === 1) {
        const connectedRooms = getConnectedRooms(x, y, currentFloor);
        if (connectedRooms.length > 0) {
          const roomNames = connectedRooms.map(room => room.cell.room.name).slice(0, 3);
          tooltip += ` | Connected: ${roomNames.join(', ')}${connectedRooms.length > 3 ? '...' : ''}`;
        }
      }
    }

    const activeTraps = cell.traps ? cell.traps.filter(trap => !triggeredTraps.has(trap.id)) : 
                   (cell.trap && !triggeredTraps.has(cell.trap.id) ? [cell.trap] : []);

    if (activeTraps.length > 0) {
      if (activeTraps.length === 1) {
        tooltip += ` | 🪤 ${activeTraps[0].name}`;
      } else {
        tooltip += ` | 🪤 ${activeTraps.length} traps: ${activeTraps.map(t => t.name).join(', ')}`;
      }
    }

    // Add hazard information to tooltip
    if (cell.hazards && cell.hazards.length > 0) {
      cell.hazards.forEach(hazard => {
        tooltip += ` | 🚨 ${hazard.name}: ${hazard.effect}`;
        if (hazard.duration > 0) {
          tooltip += ` (${hazard.duration} rounds left)`;
        }
      });
    }

    if (cell.door) {
      tooltip += ` | ${getEnhancedDoorTooltip(cell.door)}`;

      if (cell.door.passable) {
        tooltip += ' (OPEN)';
      } else {
        switch (cell.door.type?.name) {
          case 'Locked Door':
          case 'Secure Door':
            tooltip += ' (BLOCKS ENTITIES)';
            break;
          default:
            tooltip += ' (CAN BE OPENED)';
        }
      }
    }

    return tooltip;
  };

  const handleApparatusCollection = (apparatusId) => {
    if (collectedApparatus.has(apparatusId)) return;
    
    const newCollected = new Set(collectedApparatus);
    newCollected.add(apparatusId);
    setCollectedApparatus(newCollected);
  };

  // ===== MODIFIED: Get building statistics with lighting =====
  const getBuildingStats = () => {
    if (!buildingData) return null;
    
    let totalRooms = 0;
    let totalScrap = 0;
    let totalTraps = 0;
    let totalDoors = 0;
    let hallwayFeatures = 0;
    let mostExpensiveScrap = 0;
    let leastExpensiveScrap = Infinity;
    let totalScrapValue = 0; // NEW: Track total value
    
    Object.values(buildingData.floors).forEach(layout => {
      Object.values(layout).forEach(cell => {
        if (cell.type === 'room' && cell.room && 
            ![ROOM_TYPES.HALLWAY, ROOM_TYPES.CORRIDOR, ROOM_TYPES.ENTRANCE, 
              ROOM_TYPES.FIRE_EXIT, ROOM_TYPES.STAIRCASE_UP, 
              ROOM_TYPES.STAIRCASE_DOWN, ROOM_TYPES.STAIRCASE_BOTH].includes(cell.room)) {
          totalRooms++;
        }
        // Count scraps and track most/least expensive (ONLY UNCOLLECTED)
        if (cell.scraps && cell.scraps.length > 0) {
          // Filter out collected scraps
          const uncollectedScraps = cell.scraps.filter(scrap => !collectedScrap.has(scrap.id));
          totalScrap += uncollectedScraps.length;

          uncollectedScraps.forEach(scrap => {
            totalScrapValue += scrap.value; // NEW: Add to total value

            if (scrap.value > mostExpensiveScrap) {
              mostExpensiveScrap = scrap.value;
            }
            if (scrap.value < leastExpensiveScrap) {
              leastExpensiveScrap = scrap.value;
            }
          });
        }
        if (cell.trap) totalTraps++;
        if (cell.door) totalDoors++;
        if (cell.hallwayFeature) hallwayFeatures++;
      });
    });

    // Get placed entities count from grid (not entity manager arrays)
    const placedEntities = entityManager ? entityManager.getPlacedEntities(buildingData.floors) : [];
    const totalEntities = placedEntities.length;

    // Lighting stats
    let avgLighting = 0;
    let totalRoomsWithLight = 0;

    if (floorLighting[currentFloor]) {
      const currentFloorLayout = buildingData.floors[currentFloor];
      Object.entries(currentFloorLayout).forEach(([cellKey, cell]) => {
        if (cell.type === 'room' && cell.room !== ROOM_TYPES.HALLWAY && cell.room !== ROOM_TYPES.CORRIDOR) {
          const baseLight = floorLighting[currentFloor][cellKey];
          if (baseLight !== undefined) {
            const apparatusCollected = isApparatusCollected(buildingData, collectedApparatus);
            const displayLight = getDisplayLightLevel(baseLight, apparatusCollected);
            avgLighting += displayLight;
            totalRoomsWithLight++;
          }
        }
      });

      if (totalRoomsWithLight > 0) {
        avgLighting = Math.round(avgLighting / totalRoomsWithLight * 10) / 10;
      }
    }

    return {
      floors: buildingData.buildingInfo.totalFloors,
      currentFloor,
      rooms: totalRooms,
      scrap: `${collectedScrap.size}/${totalScrap}`,
      traps: `${triggeredTraps.size}/${totalTraps}`,
      doors: totalDoors,
      entities: totalEntities,
      hallwayFeatures,
      entranceFloor: buildingData.buildingInfo.entranceFloor,
      fireExits: buildingData.buildingInfo.fireExits.length,
      avgLighting: avgLighting.toFixed(1),
      lightDesc: getLightDescription(Math.round(avgLighting)),
      mostExpensiveScrap: mostExpensiveScrap > 0 ? mostExpensiveScrap : null,
      leastExpensiveScrap: leastExpensiveScrap !== Infinity ? leastExpensiveScrap : null,
      totalScrapValue: totalScrapValue // NEW: Add to return object
    };
  };

  if (!selectedMoon || !gameStarted) {
    return (
      <div className="text-center text-white/70 py-12">
        <div className="text-6xl mb-4">🏗️</div>
        <h2 className="text-xl font-semibold mb-2">Organic Interior Layout</h2>
        <p className="text-white/50">Start a mission to generate organic multi-floor interior</p>
      </div>
    );
  }

  if (!buildingData) {
    return (
      <div className="text-center text-white/70 py-12">
        <div className="text-6xl mb-4">⚙️</div>
        <h2 className="text-xl font-semibold mb-2">Generating Layout...</h2>
        <p className="text-white/50">Creating organic paths and rooms</p>
      </div>
    );
  }

  const stats = getBuildingStats();

  return (
    <div className="space-y-3">
      <style>{entityStyles}</style>

      {/* Header Stats Bar */}
      <div className="bg-slate-800 p-3 rounded-lg border border-slate-600">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <span className="text-slate-400">🏗️ Building:</span>
              <span className="text-white font-semibold">{currentInteriorType}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-slate-400">Floor:</span>
              <span className="text-white font-semibold">{currentFloor}/{stats.floors - 1}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-slate-400">Rooms:</span>
              <span className="text-white font-semibold">{stats.rooms}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-slate-400">Scrap:</span>
              <span className="text-white font-semibold">{stats.scrap}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-slate-400">Entities:</span>
              <span className="text-white font-semibold">{stats.entities}</span>
            </div>
          </div>

          {/* Lighting Indicator */}
          <div className="flex items-center space-x-2">
            <span className="text-slate-400">💡 Light:</span>
            <span className={`font-semibold ${getLightColor(Math.round(parseFloat(stats.avgLighting)))}`}>
              {stats.avgLighting}/10 ({stats.lightDesc})
            </span>
            {isApparatusCollected(buildingData, collectedApparatus) && (
              <span className="text-red-400 text-xs">⚠️ Apparatus penalty</span>
            )}
          </div>
        </div>
      </div>

      {/* Floor Navigation Bar */}
      <div className="bg-indigo-700/20 p-3 rounded-lg border border-indigo-500/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => changeFloor(-1)}
              disabled={currentFloor === 0}
              className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                currentFloor === 0 
                  ? 'bg-slate-600 text-slate-400 cursor-not-allowed' 
                  : 'bg-indigo-500 hover:bg-indigo-600 text-white'
              }`}
            >
              ⬇️ Down
            </button>
            <span className="px-4 py-1 bg-indigo-600 text-white rounded font-bold">
              Floor {currentFloor}
            </span>
            <button
              onClick={() => changeFloor(1)}
              disabled={currentFloor === stats.floors - 1}
              className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                currentFloor === stats.floors - 1
                  ? 'bg-slate-600 text-slate-400 cursor-not-allowed' 
                  : 'bg-indigo-500 hover:bg-indigo-600 text-white'
              }`}
            >
              ⬆️ Up
            </button>
          </div>
          <div className="text-sm text-indigo-300">
            Entrance: Floor {stats.entranceFloor} • Exits: {stats.fireExits} • Center: ({CENTER_POINT.x},{CENTER_POINT.y})
          </div>
        </div>
      </div>

      {/* Player Movement Mode Banner */}
      {isPlayerMovementMode && movingPlayer && (
        <div className="bg-cyan-500/20 border border-cyan-400/30 rounded-lg p-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <span className="text-cyan-300 font-semibold">📍 Moving: {movingPlayer.name}</span>
              <span className="text-cyan-200 text-sm">Click any room to move there</span>
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

      {/* Door Action Message */}
      {doorActionMessage && (
        <div className={`p-2 rounded text-sm font-medium ${
          doorActionMessage.includes('failed') || doorActionMessage.includes('Need') || doorActionMessage.includes('Cannot')
            ? 'bg-red-500/20 text-red-300 border border-red-400/30'
            : 'bg-green-500/20 text-green-300 border border-green-400/30'
        }`}>
          🚪 {doorActionMessage}
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">

        {/* Interior Grid */}
        <div className="xl:col-span-3">
          <div className="bg-gray-900/50 p-4 rounded-lg border border-slate-600">
            <div 
              className="grid gap-1 mx-auto bg-gray-800/50 p-3 rounded-lg border border-white/10" 
              style={{
                width: 'fit-content',
                gridTemplateColumns: `repeat(${INTERIOR_GRID_SIZE}, minmax(0, 1fr))`
              }}
            >
              {Array.from({length: INTERIOR_GRID_SIZE}, (_, y) => 
                Array.from({length: INTERIOR_GRID_SIZE}, (_, x) => renderGridCell(x, y))
              ).flat()}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-3">
            
          {/* Selected Cell Info */}
          {selectedCell && (
            <div className="bg-slate-700 p-3 rounded border border-slate-500">
              <h4 className="font-bold text-white mb-2 text-sm">
                📍 ({selectedCell.x}, {selectedCell.y}) Floor {selectedCell.floor}
              </h4>

              {/* Basic Cell Info */}
              <div className="text-xs text-slate-200 space-y-1 mb-2">
                {selectedCell.type === 'room' && (
                  <div className="bg-slate-800 p-2 rounded">
                    <div className="font-semibold">{selectedCell.room?.name || 'Unknown'}</div>

                    {/* Lighting Info - Compact */}
                    {selectedCell.type === 'room' && floorLighting[currentFloor] && (() => {
                      const cellKey = `${selectedCell.x},${selectedCell.y}`;
                      const baseLight = floorLighting[currentFloor][cellKey];

                      if (baseLight === undefined) return null;

                      const apparatusCollected = isApparatusCollected(buildingData, collectedApparatus);
                      const displayLight = getDisplayLightLevel(baseLight, apparatusCollected);
                      const lightDesc = getLightDescription(displayLight);

                      return (
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-slate-400">💡 Light:</span>
                          <span className={`font-semibold ${getLightColor(displayLight)}`}>
                            {displayLight}/10 ({lightDesc})
                          </span>
                          {apparatusCollected && baseLight > displayLight && (
                            <span className="text-red-400 text-xs">⚠️</span>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>

              {selectedCell && selectedCell.hallwayFeature && 
                integrateHallwayFeatures.renderFeaturePanel(selectedCell)
              }

              {/* Players at Position */}
              {(() => {
                const playersAtPosition = players?.filter(player => 
                  player.position?.currentArea === 'interior' &&
                  player.position.interior.x === selectedCell.x &&
                  player.position.interior.y === selectedCell.y &&
                  player.position.interior.floor === currentFloor
                ) || [];
              
                if (playersAtPosition.length === 0) return null;
              
                return (
                  <div className="bg-cyan-600/80 p-2 rounded text-white mb-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-sm">👥 Players ({playersAtPosition.length})</span>
                    </div>
                    <div className="space-y-2">
                      {playersAtPosition.map(player => {
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
                );
              })()}

              {/* Apparatus */}
              {selectedCell.apparatus && !collectedApparatus.has(selectedCell.apparatus.id) && (
                <div className="bg-violet-600/80 p-2 rounded text-white mb-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-sm">🔧 {selectedCell.apparatus.name}</span>
                    <span className="text-xs bg-violet-700 px-1 rounded">80cr</span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleApparatusCollection(selectedCell.apparatus.id)}
                      className="bg-violet-500 hover:bg-violet-600 px-2 py-1 rounded text-xs flex-1"
                    >
                      Collect
                    </button>
                  </div>
                </div>
              )}

              {selectedCell.droppedItems && selectedCell.droppedItems.length > 0 && (
                <div className="bg-blue-600/80 p-2 rounded text-white mb-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-sm">📦 Dropped Items ({selectedCell.droppedItems.length})</span>
                  </div>
                  <div className="space-y-1">
                    {selectedCell.droppedItems.map((item, index) => (
                      <div key={item.id || index} className="flex items-center justify-between text-xs bg-blue-700/50 p-1 rounded">
                        <span>{item.name}</span>
                        <span>{item.weight}lbs</span>
                        <span>{item.price}¢</span>
                        <button
                          onClick={() => {
                            // Remove from dropped items
                            setBuildingData(prev => {
                              const newData = { ...prev };
                              const cellKey = `${selectedCell.x},${selectedCell.y}`;
                              if (newData.floors[currentFloor] && newData.floors[currentFloor][cellKey]) {
                                newData.floors[currentFloor][cellKey].droppedItems = 
                                  newData.floors[currentFloor][cellKey].droppedItems.filter(di => di.id !== item.id);
                              }
                              return newData;
                            });

                            // Refresh selected cell
                            setSelectedCell(prev => prev ? { ...prev } : null);
                          }}
                          className="bg-red-500 hover:bg-red-600 px-1 py-0.5 rounded text-xs"
                        >
                          🗑️
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Scrap */}
              {selectedCell.scraps && selectedCell.scraps.filter(s => !collectedScrap.has(s.id)).length > 0 && (
                <div className="bg-yellow-600/80 p-2 rounded text-white mb-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-sm">💰 Scrap ({selectedCell.scraps.filter(s => !collectedScrap.has(s.id)).length})</span>
                  </div>
                  <div className="space-y-1">
                    {selectedCell.scraps.filter(s => !collectedScrap.has(s.id)).map((scrap, index) => (
                      <div key={scrap.id || index} className="flex items-center justify-between text-xs bg-yellow-700/50 p-1 rounded">
                        <span>{scrap.name}</span>
                        <span>{scrap.weight}lbs</span>
                        <span>{scrap.value}¢</span>
                        <button
                          onClick={() => handleScrapCollection(scrap)}
                          className="bg-yellow-500 hover:bg-yellow-600 px-2 py-0.5 rounded text-xs"
                        >
                          Collect
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Entities - Compact List */}
              {(() => {
                const entitiesAtPosition = Array.isArray(selectedCell.entities) ? 
                  selectedCell.entities.filter(e => !e.defeated) :
                  (selectedCell.entity && !selectedCell.entity.defeated ? [selectedCell.entity] : []);
              
                if (entitiesAtPosition.length === 0) return null;
              
                return (
                  <div className="bg-red-600/80 p-2 rounded text-white mb-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-sm">👾 Entities ({entitiesAtPosition.length})</span>
                    </div>

                    {entitiesAtPosition.length <= 2 ? (
                      // Show individual entities if 2 or fewer
                      <div className="space-y-1">
                        {entitiesAtPosition.map((entity, index) => (
                          <div key={entity.id || index} className="bg-red-700/50 p-1 rounded">
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span className="font-medium">{entity.name}</span>
                              <span className="bg-red-800 px-1 rounded">Lv{entity.powerLevel}</span>
                            </div>
                            <div className="flex space-x-1">
                              <button
                                onClick={() => handleEntityEncounter(entity.id)}
                                className="bg-orange-500 hover:bg-orange-600 px-2 py-0.5 rounded text-xs flex-1"
                              >
                                ⚔️ Fight
                              </button>
                              <button
                                onClick={() => handleEntityDefeatWithEffects(entity.id)}
                                className="bg-red-500 hover:bg-red-600 px-2 py-0.5 rounded text-xs flex-1"
                              >
                                💀 Kill
                              </button>
                              {(entity.name.includes("Bracken") || entity.name.includes("Ghost Girl")) && (
                                <div className="text-xs text-white bg-purple-600/50 p-1 rounded mt-1">
                                  🎯 Target: {getEntityTargetName(entity.id)}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      // Show compact list if 3+ entities
                      <div>
                        <div className="text-xs text-red-200 mb-2">
                          {entitiesAtPosition.map(e => e.name).join(', ')}
                          <div className="text-xs mt-1">
                            Total Power: {entitiesAtPosition.reduce((sum, e) => sum + (e.powerLevel || 0), 0)}
                          </div>
                        </div>
                        <div className="flex space-x-1">
                          <button
                            onClick={() => handleEntityEncounter(entitiesAtPosition[0].id)}
                            className="bg-orange-500 hover:bg-orange-600 px-2 py-1 rounded text-xs flex-1"
                          >
                            ⚔️ Fight First
                          </button>
                          <button
                            onClick={() => {
                              entitiesAtPosition.forEach(entity => handleEntityDefeatWithEffects(entity.id));
                            }}
                            className="bg-red-500 hover:bg-red-600 px-2 py-1 rounded text-xs flex-1"
                          >
                            💀 Kill All
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Trap */}
              {selectedCell.traps && selectedCell.traps.filter(trap => !triggeredTraps.has(trap.id)).length > 0 ? (
                <div className="space-y-2">
                  {selectedCell.traps.filter(trap => !triggeredTraps.has(trap.id)).map((trap, index) => (
                    <div key={trap.id} className="bg-orange-600/80 p-2 rounded text-white">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-sm">{trap.name}</span>
                        <span className="text-xs bg-orange-700 px-1 rounded">Detection: {trap.detection}</span>
                      </div>
                      {trap.roll !== "None" && <span className="text-xs bg-orange-700 px-1 rounded">Roll: {trap.roll}</span>}
                      {trap.name === "Pitfall" ? <div className="flex items-center justify-between mb-1"><span>Instant {trap.wounds}</span></div> :
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs bg-orange-700 px-1 rounded">Wounds: {trap.wounds}</span>
                          <span className="text-xs bg-orange-700 px-1 rounded">Strain: {trap.strain}</span>
                        </div>
                      }
                      {trap.name !== 'Pitfall' && trap.name !== 'Turret' && (
                        <button
                          onClick={() => handleTrapTrigger(trap)}
                          className="bg-orange-500 hover:bg-orange-600 px-2 py-1 rounded text-xs w-full mt-1"
                        >
                          Trigger
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : selectedCell.trap && !triggeredTraps.has(selectedCell.trap.id) ? (
                // Fallback for backward compatibility with single trap
                <div className="bg-orange-600/80 p-2 rounded text-white mb-2">
                  {/* existing single trap display code */}
                </div>
              ) : null}

              {/* Door Panel */}
              {selectedCell && selectedCell.door && (
                <FunctionalDoorPanel 
                  selectedCell={selectedCell}
                  onDoorAction={enhancedHandleDoorAction}
                  doorMessage={doorActionMessage}
                />
              )}
            </div>
          )}

          {/* Moon & Building Info */}
          <div className="bg-slate-700 p-3 rounded border border-slate-500">
            <h4 className="font-bold text-white mb-2 text-sm">🏗️ Building Info</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-800 p-1 rounded text-center">
                <div className="text-slate-400">Type</div>
                <div className="text-white font-bold">{currentInteriorType}</div>
              </div>
              <div className="bg-slate-800 p-1 rounded text-center">
                <div className="text-slate-400">Floors</div>
                <div className="text-white font-bold">{stats.floors}</div>
              </div>
              <div className="bg-slate-800 p-1 rounded text-center">
                <div className="text-slate-400">Doors</div>
                <div className="text-white font-bold">{stats.doors}</div>
              </div>
              <div className="bg-slate-800 p-1 rounded text-center">
                <div className="text-slate-400">Traps</div>
                <div className="text-white font-bold">{stats.traps}</div>
              </div>
              <div className="bg-slate-800 p-1 rounded text-center">
                <div className="text-slate-400">Total Value</div>
                <div className="text-yellow-400 font-bold">{stats.totalScrapValue}¢</div>
              </div>
              {stats.mostExpensiveScrap !== null && (
                <div className="bg-slate-800 p-1 rounded text-center">
                  <div className="text-slate-400">Max Value</div>
                  <div className="text-yellow-400 font-bold">{stats.mostExpensiveScrap}¢</div>
                </div>
              )}
              {stats.leastExpensiveScrap !== null && (
                <div className="bg-slate-800 p-1 rounded text-center">
                  <div className="text-slate-400">Min Value</div>
                  <div className="text-gray-400 font-bold">{stats.leastExpensiveScrap}¢</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewInteriorGrid;