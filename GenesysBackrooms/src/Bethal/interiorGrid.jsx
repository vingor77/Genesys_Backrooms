import React, { useState, useEffect } from 'react';
import { INTERIOR_TYPES, moons } from './moonData.jsx';
import { ROOM_TYPES, TRAP_TYPES, DOOR_TYPES } from './indoorData.jsx';
import { generateScrapFromMoonData } from './scrapUtils.jsx';
import { generateCompleteBuilding } from './floorManager.jsx';
import { generateMazeRoomsAlongPaths } from './roomGenerator.jsx';
import { distributeDoorsAcrossFloors } from './doorSystem.jsx';
import { useDoorActions, FunctionalDoorPanel, getEnhancedDoorIndicator, getEnhancedDoorTooltip } from './functionalDoorComponent.jsx';
import { INTERIOR_GRID_SIZE, CENTER_POINT, validateAndFixPaths } from './pathGenerator.jsx';
import { applyDamageToPlayer } from './playerManager.jsx';
import { 
  enhanceHallwayCell, 
  getEnhancedHallwayTooltip, 
  getHallwayFeatureIndicator,
  integrateHallwayFeatures 
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
  setPlayers
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
  
  // ===== NEW: Lighting state =====
  const [floorLighting, setFloorLighting] = useState({});

  // Entity movement data (keep this the same)
  const ENTITY_MOVEMENT_DATA = {
    // Indoor entities
    "Barber": { rounds: 2 },
    "Bracken": { rounds: 2 },
    "Bunker Spider": { rounds: 2 },
    "Butler": { rounds: 2 },
    "Coil-Head": { rounds: 2 },
    "Ghost Girl": { rounds: 2 },
    "Hoarding Bug": { rounds: 2 },
    "Hygrodere": { rounds: 3 },
    "Jester": { rounds: 2 },
    "Maneater": { rounds: 2 },
    "Masked": { rounds: 2 },
    "Nutcracker": { rounds: 2 },
    "Snare Flea": { rounds: 99 },
    "Spore Lizard": { rounds: 2 },
    "Thumper": { rounds: 2 },
    "Masked Hornets": { rounds: 1 },
    "Vine Lurker": { rounds: 3 },
    "Pollen Drone": { rounds: 2 },
    "Prototype Hunter": { rounds: 2 },
    "Data Wraith": { rounds: 2 },
    "Corporate Enforcer": { rounds: 2 },
    "Executive Phantom": { rounds: 2 },
    "Void Stalker": { rounds: 1 },
    "Reality Wraith": { rounds: 1 },
    "Chaos Spawn": { rounds: 1 },
    "Dimensional Horror": { rounds: 1 }
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

  // FIXED: Function to get connected rooms - simplified door logic
  const getConnectedRooms = (currentX, currentY, currentFloor) => {
    const connectedRooms = [];
    const currentFloorLayout = buildingData?.floors[currentFloor];
    if (!currentFloorLayout) return connectedRooms; 

    // Check all 4 directions
    const directions = [[-1, 0], [0, -1], [0, 1], [1, 0]];  

    directions.forEach(([dx, dy]) => {
      const newX = currentX + dx;
      const newY = currentY + dy;
      const cellKey = `${newX},${newY}`;
      const targetCell = currentFloorLayout[cellKey]; 

      // Check if target cell exists and is a room (not wall)
      if (targetCell && targetCell.type === 'room' && targetCell.room) {
        const excludedRoomTypes = [
          ROOM_TYPES.ENTRANCE,
          ROOM_TYPES.FIRE_EXIT,
          ROOM_TYPES.STAIRCASE_UP,
          ROOM_TYPES.STAIRCASE_DOWN,
          ROOM_TYPES.STAIRCASE_BOTH
        ];  

        // FIXED: Check if room is valid - entities can move to cells with other entities
        if (!excludedRoomTypes.includes(targetCell.room)) {
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
      }
    });

    return connectedRooms;
  };

  // FIXED: Corrected door opening function
  const attemptDoorOpen = (doorCell, cellKey, floorNum) => {
    if (!doorCell.door) {
      return true; // No door means can pass through
    }

    if (doorCell.door.passable) {
      return true; // Already open
    }

    // FIXED: Check door type properly using the door type object
    const door = doorCell.door;

    // Helper function to check door types by comparing properties (from doorSystem.jsx)
    const isDoorType = (doorToCheck, targetType) => {
      return doorToCheck.name === targetType.name && 
             doorToCheck.passable === targetType.passable;
    };

    // FIXED: Only allow entities to open standard doors that are closed
    // Entities CANNOT open locked or secure doors
    if (isDoorType(door, DOOR_TYPES.CLOSED)) {
      // Standard closed door - entities can open this
      setBuildingData(prev => ({
        ...prev,
        floors: {
          ...prev.floors,
          [floorNum]: {
            ...prev.floors[floorNum],
            [cellKey]: {
              ...prev.floors[floorNum][cellKey],
              door: {
                ...DOOR_TYPES.OPEN, // Use the complete OPEN door type
                side: door.side,
                connectsTo: door.connectsTo,
                id: door.id
              }
            }
          }
        }
      }));
      return true;
    } 
    else if (isDoorType(door, DOOR_TYPES.SECURE_CLOSED)) {
      // Secure doors - entities CANNOT open these
      return false;
    }
    else if (isDoorType(door, DOOR_TYPES.LOCKED)) {
      // Locked doors - entities CANNOT open these  
      return false;
    }

    // Door is already open or unknown type
    return door.passable || false;
  };

  // Function to move entity to new room (keep this the same)
  const moveEntityToRoom = (entity, fromX, fromY, toX, toY, floorNum) => {
    setBuildingData(prev => {
      if (!prev || !prev.floors) return prev;

      const newFloors = { ...prev.floors };
      const floorLayout = { ...newFloors[floorNum] };

      // Remove entity from current position
      const fromKey = `${fromX},${fromY}`;
      if (floorLayout[fromKey]) {
        const fromCell = floorLayout[fromKey];

        if (Array.isArray(fromCell.entities)) {
          // Remove from entities array
          floorLayout[fromKey] = {
            ...fromCell,
            entities: fromCell.entities.filter(e => e.id !== entity.id),
            entity: fromCell.entities.filter(e => e.id !== entity.id)[0] || null // Keep first entity for backward compatibility
          };
        } else if (fromCell.entity && fromCell.entity.id === entity.id) {
          // Legacy single entity removal
          floorLayout[fromKey] = {
            ...fromCell,
            entity: null,
            entities: []
          };
        }
      }

      // Add entity to new position
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

        // Initialize entities array if it doesn't exist
        const existingEntities = Array.isArray(toCell.entities) ? toCell.entities : 
                                (toCell.entity ? [toCell.entity] : []);

        // Add the new entity to the array
        const newEntities = [...existingEntities, updatedEntity];

        floorLayout[toKey] = {
          ...toCell,
          entities: newEntities,
          entity: newEntities[0] // Keep first entity for backward compatibility with existing UI
        };
      }

      newFloors[floorNum] = floorLayout;

      return {
        ...prev,
        floors: newFloors
      };
    });

    if (typeof onEntityPlayerCollision === 'function') {
      onEntityPlayerCollision(entity.id, toX, toY, 'interior');
    }
  };

  // FIXED: Simplified movement processing
  const processEntityMovement = (entity, currentX, currentY, floorNum) => {

    // Get connected rooms (now includes hallways)
    const connectedRooms = getConnectedRooms(currentX, currentY, floorNum);

    if (connectedRooms.length === 0) {
      return false;
    }

    // Process each potential destination
    const accessibleRooms = [];

    for (const room of connectedRooms) {
      let canAccess = true;

      // Check if target room has a door that needs opening
      if (room.cell.door) {
        canAccess = attemptDoorOpen(room.cell, room.cellKey, floorNum);
      }

      // Also check current room for doors (in case we need to exit through a door)
      const currentCell = buildingData.floors[floorNum][`${currentX},${currentY}`];
      if (canAccess && currentCell?.door && !currentCell.door.passable) {
        canAccess = attemptDoorOpen(currentCell, `${currentX},${currentY}`, floorNum);
      }

      if (canAccess) {
        accessibleRooms.push(room);
      }
    }

    if (accessibleRooms.length === 0) {
      return false;
    }

    // Randomly select a room to move to
    const selectedRoom = accessibleRooms[Math.floor(Math.random() * accessibleRooms.length)];
    // Move entity to selected room
    moveEntityToRoom(entity, currentX, currentY, selectedRoom.x, selectedRoom.y, floorNum);

    return true;
  };

  // FIXED: Initialize entity movement timers when entities are placed
  const initializeEntityMovementTimer = (entityId, spawnRound) => {
    setEntityMovementTimers(prev => new Map(prev.set(entityId, {
      spawnRound: spawnRound,
      lastMoveRound: spawnRound,
      nextMoveRound: spawnRound // Will move immediately on first check after spawn
    })));
  };

  // FIXED: Process entity movement based on rounds (call this from your nextRound function)
  const processRoundBasedEntityMovement = (currentRound) => {
    if (!gameStarted || !buildingData?.floors) {
      return;
    }

    let entitiesProcessed = 0;
    let entitiesMoved = 0;
    let entitiesFound = 0;

    // Process movement for all entities on all floors
    Object.entries(buildingData.floors).forEach(([floorNum, layout]) => {
      Object.entries(layout).forEach(([cellKey, cell]) => {
        // FIXED: Check both single entity and entities array
        const entitiesToProcess = [];

        if (Array.isArray(cell.entities)) {
          entitiesToProcess.push(...cell.entities.filter(e => !e.defeated && e.type === 'indoor'));
        } else if (cell.entity && !cell.entity.defeated && cell.entity.type === 'indoor') {
          entitiesToProcess.push(cell.entity);
        }

        entitiesToProcess.forEach(entity => {
          entitiesFound++;
          entitiesProcessed++;
          const [x, y] = cellKey.split(',').map(Number);

          // Get movement data for this entity
          const movementData = ENTITY_MOVEMENT_DATA[entity.name];
          if (!movementData) {
            // Use default if no data found
            const defaultMovementData = { rounds: 2 };

            let timerData = entityMovementTimers.get(entity.id);
            if (!timerData) {
              setEntityMovementTimers(prev => new Map(prev.set(entity.id, {
                spawnRound: currentRound,
                lastMoveRound: currentRound,
                nextMoveRound: currentRound + defaultMovementData.rounds
              })));
              timerData = { spawnRound: currentRound, lastMoveRound: currentRound, nextMoveRound: currentRound + defaultMovementData.rounds };
            }

            const roundsSinceLastMove = currentRound - timerData.lastMoveRound;
            if (roundsSinceLastMove >= defaultMovementData.rounds) {
              const moved = processEntityMovement(entity, x, y, parseInt(floorNum));
              if (moved) entitiesMoved++;
            }
            return;
          }

          // Get or initialize timer for this entity
          let timerData = entityMovementTimers.get(entity.id);
          if (!timerData) {
            setEntityMovementTimers(prev => new Map(prev.set(entity.id, {
              spawnRound: currentRound,
              lastMoveRound: currentRound,
              nextMoveRound: currentRound + movementData.rounds
            })));
            timerData = { spawnRound: currentRound, lastMoveRound: currentRound, nextMoveRound: currentRound + movementData.rounds };
          }

          // Check if it's time to move
          const roundsSinceLastMove = currentRound - timerData.lastMoveRound;

          if (roundsSinceLastMove >= movementData.rounds) {
            const moved = processEntityMovement(entity, x, y, parseInt(floorNum));

            if (moved) {
              entitiesMoved++;
              // Update timer after successful movement
              setEntityMovementTimers(prev => {
                const newTimers = new Map(prev);
                newTimers.set(entity.id, {
                  ...timerData,
                  lastMoveRound: currentRound,
                  nextMoveRound: currentRound + movementData.rounds
                });
                return newTimers;
              });
            } else {
              // If movement failed, try again next round
              setEntityMovementTimers(prev => {
                const newTimers = new Map(prev);
                newTimers.set(entity.id, {
                  ...timerData,
                  lastMoveRound: currentRound - movementData.rounds + 1,
                  nextMoveRound: currentRound + 1
                });
                return newTimers;
              });
            }
          }
        });
      });
    });
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
  }, [currentRound, gameStarted]); // This triggers when currentRound changes

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
    
    // Calculate target rooms
    const targetRooms = Math.floor(Math.random() * (currentMoon.max - currentMoon.min + 1)) + currentMoon.min;
    
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
    
    // ===== NEW: Generate lighting for all floors =====
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
    const scrapRange = currentMoon?.scrapRange || { min: 8, max: 12 };
    const targetScrapCount = Math.floor(Math.random() * (scrapRange.max - scrapRange.min + 1)) + scrapRange.min;

    // Collect all eligible rooms from all floors (EXCLUDING entrance and staircases)
    const allEligibleRooms = [];

    Object.entries(floors).forEach(([floorNum, layout]) => {
      Object.entries(layout).forEach(([cellKey, cell]) => {
        if (cell.type === 'room' && cell.room && cell.room.scrapChance > 0) {
          // Exclude infrastructure rooms AND entrance/staircases
          const excludedRoomTypes = [
            ROOM_TYPES.ENTRANCE, // ✅ NO SCRAP IN ENTRANCE
            ROOM_TYPES.FIRE_EXIT,
            ROOM_TYPES.STAIRCASE_UP, // ✅ NO SCRAP IN STAIRCASES
            ROOM_TYPES.STAIRCASE_DOWN, // ✅ NO SCRAP IN STAIRCASES
            ROOM_TYPES.STAIRCASE_BOTH // ✅ NO SCRAP IN STAIRCASES
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
    const hallwayTypes = ['Long Corridor', 'Hallway']; // Add other hallway types if needed
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
          selectedRoom.cell.scrap = scrap;
          scrapPlaced++;
          scrapGeneratedCount++;
          placedHallScrapCount++;
        } else {
          console.warn(`❌ Failed to generate scrap for hallway ${selectedRoom.roomType}`);
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

      if (totalWeight === 0) {
        console.warn('No non-hallway rooms with scrap chance available');
        break;
      }

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
          selectedRoom.cell.scrap = scrap;
          scrapPlaced++;
          scrapGeneratedCount++;
        } else {
          console.warn(`❌ Failed to generate scrap for ${selectedRoom.roomType}`);
        }
        availableNonHallways.splice(selectedIndex, 1);
      } else {
        break;
      }

      attempts++;
    }

    // PHASE 3: Emergency placement if still short (try any remaining rooms including unused hallways)
    if (scrapPlaced < targetScrapCount) {
      const remainingRooms = [...availableHallways, ...availableNonHallways];

      while (scrapPlaced < targetScrapCount && remainingRooms.length > 0) {
        const randomRoom = remainingRooms[Math.floor(Math.random() * remainingRooms.length)];
        const scrap = generateScrapFromMoonData(randomRoom.cell.room, currentMoon);

        if (scrap) {
          randomRoom.cell.scrap = scrap;
          scrapPlaced++;
          scrapGeneratedCount++;
        } else {
          console.warn(`❌ Emergency scrap generation failed for ${randomRoom.roomType}`);
        }

        const roomIndex = remainingRooms.indexOf(randomRoom);
        remainingRooms.splice(roomIndex, 1);
      }
    }

    const scrapResult = scrapPlaced >= targetScrapCount ? '✅ SCRAP TARGET ACHIEVED' : `❌ SCRAP SHORTFALL: ${scrapPlaced}/${targetScrapCount}`;

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
              
              cell.trap = {
                id: `trap_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                name: selectedTrap.name,
                danger: selectedTrap.danger,
                detection: selectedTrap.detection,
                roll: selectedTrap.roll,
                wounds: selectedTrap.wounds,
                strain: selectedTrap.strain
              };
              
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

  const handleTrapTrigger = (trap) => {
    if (triggeredTraps.has(trap.id)) return;
    if (!trap) return;

    // Check if any players are in the same room
    const playersInRoom = players?.filter(player => 
      player.position?.currentArea === 'interior' &&
      player.position.interior.x === selectedCell.x &&
      player.position.interior.y === selectedCell.y &&
      player.position.interior.floor === currentFloor
    ) || [];

    if (playersInRoom.length > 0) {
      if (playersInRoom.length === 1) {
        // Only one player - apply damage to them
        const player = playersInRoom[0];

        applyDamageToPlayer(players, setPlayers, player.id, trap.wounds || 0, trap.strain || 0);
      } else {
        // Multiple players - let user choose who gets hit
        const playerNames = playersInRoom.map(p => p.name);
        const choice = prompt(`Multiple players in room: ${playerNames.join(', ')}\n\nWho triggered ${trap.name}?\n\nEnter player name or cancel to abort:`);

        if (!choice) return; // User cancelled

        const selectedPlayer = playersInRoom.find(p => p.name.toLowerCase() === choice.toLowerCase().trim());

        if (!selectedPlayer) {
          alert(`Player "${choice}" not found in room!`);
          return;
        }

        applyDamageToPlayer(players, setPlayers, selectedPlayer.id, trap.wounds || 0, trap.strain || 0);
      }
    }

    // Mark trap as triggered
    const newTriggered = new Set(triggeredTraps);
    newTriggered.add(trap.id);
    setTriggeredTraps(newTriggered);

    if (onTrapTriggered) {
      onTrapTriggered(trap);
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

    // ✅ NEW: Enhance hallway cells with features
    cell = enhanceHallwayCell(cell, x, y, currentFloor, currentInteriorType);

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
              {cell.scrap && !collectedScrap.has(cell.scrap.id) && (
                <div className="w-2 h-2 bg-yellow-500 rounded-full border border-yellow-700 shadow-lg"></div>
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
              {cell.trap && !triggeredTraps.has(cell.trap.id) && (
                <div className="w-2 h-2 bg-purple-600 rounded-full border border-purple-800 shadow-lg"></div>
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

    if (cell.scrap && !collectedScrap.has(cell.scrap.id)) {
      tooltip += ` | 💰 ${cell.scrap.name} (${cell.scrap.value} credits)`;
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

    if (cell.trap && !triggeredTraps.has(cell.trap.id)) {
      tooltip += ` | 🪤 ${cell.trap.name}`;
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
    let hallwayFeatures = 0; // ✅ NEW
    
    Object.values(buildingData.floors).forEach(layout => {
      Object.values(layout).forEach(cell => {
        if (cell.type === 'room' && cell.room && 
            ![ROOM_TYPES.HALLWAY, ROOM_TYPES.CORRIDOR, ROOM_TYPES.ENTRANCE, 
              ROOM_TYPES.FIRE_EXIT, ROOM_TYPES.STAIRCASE_UP, 
              ROOM_TYPES.STAIRCASE_DOWN, ROOM_TYPES.STAIRCASE_BOTH].includes(cell.room)) {
          totalRooms++;
        }
        if (cell.scrap) totalScrap++;
        if (cell.trap) totalTraps++;
        if (cell.door) totalDoors++;
        if (cell.hallwayFeature) hallwayFeatures++; // ✅ NEW
      });
    });
    
    // Get placed entities count from grid (not entity manager arrays)
    const placedEntities = entityManager ? entityManager.getPlacedEntities(buildingData.floors) : [];
    const totalEntities = placedEntities.length;
    
    // ===== NEW: Add lighting stats =====
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
      hallwayFeatures, // ✅ NEW
      entranceFloor: buildingData.buildingInfo.entranceFloor,
      fireExits: buildingData.buildingInfo.fireExits.length,
      avgLighting: avgLighting.toFixed(1),
      lightDesc: getLightDescription(Math.round(avgLighting))
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
                    <div className="space-y-1">
                      {playersAtPosition.map(player => (
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
              {selectedCell.scrap && !collectedScrap.has(selectedCell.scrap.id) && (
                <div className="bg-yellow-600/80 p-2 rounded text-white mb-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-sm">💰 {selectedCell.scrap.name}</span>
                    <span className='text-xs bg-yellow-700 px-1 rounded'>Weight: {selectedCell.scrap.weight}</span>
                    <span className="text-xs bg-yellow-700 px-1 rounded">Value: {selectedCell.scrap.value}</span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleScrapCollection(selectedCell.scrap)}
                      className="bg-yellow-500 hover:bg-yellow-600 px-2 py-1 rounded text-xs flex-1"
                    >
                      Collect
                    </button>
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
                                onClick={() => handleEntityDefeat(entity.id)}
                                className="bg-red-500 hover:bg-red-600 px-2 py-0.5 rounded text-xs flex-1"
                              >
                                💀 Kill
                              </button>
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
                              entitiesAtPosition.forEach(entity => handleEntityDefeat(entity.id));
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
              {selectedCell.trap && !triggeredTraps.has(selectedCell.trap.id) && (
                <div className="bg-orange-600/80 p-2 rounded text-white mb-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-sm">{selectedCell.trap.name}</span>
                    <span className="text-xs bg-orange-700 px-1 rounded">Detection: {selectedCell.trap.detection}</span>
                  </div>
                  {selectedCell.trap.roll !== "None" ? <span className="text-xs bg-orange-700 px-1 rounded">Roll: {selectedCell.trap.roll}</span> : ""}
                  {selectedCell.trap.name === "Pitfall" ? <div className="flex items-center justify-between mb-1"><span>Instant {selectedCell.trap.wounds}</span></div> :
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs bg-orange-700 px-1 rounded">Wounds: {selectedCell.trap.wounds}</span>
                      <span className="text-xs bg-orange-700 px-1 rounded">Strain: {selectedCell.trap.strain}</span>
                    </div>
                  }
                  {selectedCell.trap.name === 'Pitfall' || selectedCell.trap.name === 'Turret' ? "" :
                    <button
                      onClick={() => handleTrapTrigger(selectedCell.trap)}
                      className="bg-orange-500 hover:bg-orange-600 px-2 py-1 rounded text-xs w-full"
                    >
                      Trigger
                    </button>
                  }
                </div>
              )}

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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewInteriorGrid;