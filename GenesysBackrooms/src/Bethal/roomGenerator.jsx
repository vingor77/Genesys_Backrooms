// Enhanced roomGenerator.jsx - Maze-optimized room placement with Apparatus Room support

import { ROOM_TYPES } from './indoorData.jsx';
import { INTERIOR_TYPES } from './moonData.jsx';
import { INTERIOR_GRID_SIZE, getAdjacentWallCount } from './pathGenerator.jsx';

// Enhanced maze-aware room placement configuration
export const ROOM_PLACEMENT_CONFIG = {
  MIN_DISTANCE_BETWEEN_ROOMS: 4,
  MAX_PLACEMENT_ATTEMPTS: 200,
  PREFER_LARGER_ROOMS: 0.1,
  ROOM_SPACING_BUFFER: 3,
  STRICT_ENFORCEMENT: true,
  WALL_BUFFER_AROUND_ROOMS: 2,
  PREFER_DEAD_ENDS: 0.6,
  PREFER_CORNERS: 0.4,
  AVOID_JUNCTION_BLOCKING: 0.8,
  MAX_ROOM_SIZE_IN_MAZE: 2,
  PREFER_SINGLE_TILE_ROOMS: 0.7,
  // ✅ NEW: Apparatus room specific configs
  APPARATUS_PLACEMENT_PRIORITY: 0.9, // High priority for apparatus placement
  APPARATUS_DEAD_END_PREFERENCE: 0.8, // Strong preference for dead ends
  APPARATUS_SECURE_PREFERENCE: 0.7 // Prefer more secure locations
};

// ✅ NEW: Track apparatus placement across all floors
let apparatusPlacedInFacility = false;

// Reset apparatus tracking (call this when generating a new facility)
export const resetApparatusTracking = () => {
  apparatusPlacedInFacility = false;
};

// Check if apparatus has been placed in the facility
export const hasApparatusBeenPlaced = () => {
  return apparatusPlacedInFacility;
};

// Maze-aware room type distribution with Apparatus Room integration
export const getRoomTypesForInterior = (interiorType, targetRooms, floorNum = 0, totalFloors = 1) => {
  const rooms = [];
  
  // ✅ APPARATUS ROOM LOGIC: Only place on one floor per facility
  let shouldIncludeApparatus = false;
  if (!apparatusPlacedInFacility) {
    // Decide which floor gets the apparatus room
    // Prefer middle floors, but any floor is acceptable
    const preferredFloor = Math.floor(totalFloors / 2);
    
    if (floorNum === preferredFloor || 
        (floorNum === 0 && totalFloors === 1) || 
        (floorNum === totalFloors - 1 && Math.random() < 0.3)) {
      shouldIncludeApparatus = true;
    }
  }

  // Enhanced room distributions with Apparatus Room
  const mazeRoomDistributions = {
    [INTERIOR_TYPES.FACTORY]: [
      { type: ROOM_TYPES.SMALL_STORAGE, weight: 30 },
      { type: ROOM_TYPES.STORAGE, weight: 20 },
      { type: ROOM_TYPES.SMALL_OFFICE, weight: 20 },
      { type: ROOM_TYPES.MACHINERY, weight: 15 },
      { type: ROOM_TYPES.OFFICE, weight: 8 },
      { type: ROOM_TYPES.LABORATORY, weight: 5 },
      { type: ROOM_TYPES.SECURITY, weight: 5 },
      { type: ROOM_TYPES.VAULT, weight: 2 },
      // ✅ Add apparatus room if this floor should have it
      ...(shouldIncludeApparatus ? [{ type: ROOM_TYPES.APPARATUS, weight: 100 }] : [])
    ],
    [INTERIOR_TYPES.MANSION]: [
      { type: ROOM_TYPES.SMALL_STORAGE, weight: 25 },
      { type: ROOM_TYPES.BEDROOM, weight: 20 },
      { type: ROOM_TYPES.SMALL_OFFICE, weight: 15 },
      { type: ROOM_TYPES.OFFICE, weight: 12 },
      { type: ROOM_TYPES.KITCHEN, weight: 10 },
      { type: ROOM_TYPES.LIBRARY, weight: 8 },
      { type: ROOM_TYPES.CAFETERIA, weight: 5 },
      { type: ROOM_TYPES.STORAGE, weight: 8 },
      { type: ROOM_TYPES.VAULT, weight: 2 },
      // ✅ Add apparatus room if this floor should have it
      ...(shouldIncludeApparatus ? [{ type: ROOM_TYPES.APPARATUS, weight: 100 }] : [])
    ],
    [INTERIOR_TYPES.MINESHAFT]: [
      { type: ROOM_TYPES.TUNNEL, weight: 35 },
      { type: ROOM_TYPES.SMALL_STORAGE, weight: 20 },
      { type: ROOM_TYPES.SHAFT, weight: 15 },
      { type: ROOM_TYPES.STORAGE, weight: 12 },
      { type: ROOM_TYPES.MACHINERY, weight: 10 },
      { type: ROOM_TYPES.BASEMENT, weight: 5 },
      { type: ROOM_TYPES.SECURITY, weight: 2 },
      { type: ROOM_TYPES.VAULT, weight: 1 },
      // ✅ Add apparatus room if this floor should have it
      ...(shouldIncludeApparatus ? [{ type: ROOM_TYPES.APPARATUS, weight: 100 }] : [])
    ]
  };
  
  const distribution = mazeRoomDistributions[interiorType] || mazeRoomDistributions[INTERIOR_TYPES.FACTORY];
  const totalWeight = distribution.reduce((sum, room) => sum + room.weight, 0);
  
  // ✅ APPARATUS PRIORITY: If apparatus should be placed, guarantee it's first
  if (shouldIncludeApparatus) {
    rooms.push(ROOM_TYPES.APPARATUS);
    apparatusPlacedInFacility = true; // Mark as placed
    
    // Reduce target rooms by 1 since apparatus takes one slot
    targetRooms = Math.max(1, targetRooms - 1);
  }
  
  // Generate remaining rooms based on weights
  for (let i = 0; i < targetRooms; i++) {
    let randomValue = Math.random() * totalWeight;
    
    for (const roomDef of distribution) {
      // Skip apparatus if already placed
      if (roomDef.type === ROOM_TYPES.APPARATUS && apparatusPlacedInFacility) {
        continue;
      }
      
      randomValue -= roomDef.weight;
      if (randomValue <= 0) {
        rooms.push(roomDef.type);
        break;
      }
    }
  }
  
  return rooms;
};

// ✅ ENHANCED: Apparatus-aware placement spot scoring
export const calculateMazeScore = (layout, x, y, pathConnections, roomType = null) => {
  let score = 0;
  
  // Base scoring (existing logic)
  if (pathConnections === 1) {
    score += 0.8;
  }
  
  const adjacentWalls = getAdjacentWallCount(layout, x, y);
  if (adjacentWalls >= 3) {
    score += 0.6;
  } else if (adjacentWalls >= 2) {
    score += 0.3;
  }
  
  if (pathConnections >= 3) {
    score -= 0.2;
  }
  
  const nearbyWalls = countNearbyWalls(layout, x, y, 2);
  if (nearbyWalls >= 6) {
    score += 0.4;
  }
  
  // ✅ APPARATUS ROOM SPECIAL SCORING
  if (roomType === ROOM_TYPES.APPARATUS) {
    // Heavily favor dead ends for apparatus
    if (pathConnections === 1) {
      score += ROOM_PLACEMENT_CONFIG.APPARATUS_DEAD_END_PREFERENCE;
    }
    
    // Favor secure locations (more walls around)
    if (nearbyWalls >= 8) {
      score += ROOM_PLACEMENT_CONFIG.APPARATUS_SECURE_PREFERENCE;
    }
    
    // Avoid high-traffic areas (junctions) even more
    if (pathConnections >= 3) {
      score -= 0.5;
    }
    
    // Prefer corners and isolated areas
    if (adjacentWalls >= 3) {
      score += 0.4;
    }
  }
  
  // Random factor for variation (reduced for apparatus to be more deterministic)
  const randomFactor = roomType === ROOM_TYPES.APPARATUS ? 0.1 : 0.2;
  score += Math.random() * randomFactor;
  
  return score;
};

// Enhanced maze-aware room placement spot finder with apparatus priority
export const findMazeRoomPlacementSpots = (layout, pathNetwork, prioritizeApparatus = false) => {
  const placementSpots = [];
  
  for (const cellKey of pathNetwork) {
    const [x, y] = cellKey.split(',').map(Number);
    const pathCell = layout[cellKey];
    const pathConnections = getPathConnections(layout, x, y);
    
    const directions = [
      { dx: 0, dy: -1, name: 'north' },
      { dx: 1, dy: 0, name: 'east' },
      { dx: 0, dy: 1, name: 'south' },
      { dx: -1, dy: 0, name: 'west' }
    ];
    
    for (const dir of directions) {
      const roomX = x + dir.dx;
      const roomY = y + dir.dy;
      
      if (isValidMazeRoomPosition(layout, roomX, roomY, x, y)) {
        const spot = {
          x: roomX,
          y: roomY,
          pathConnectionX: x,
          pathConnectionY: y,
          direction: dir.name,
          adjacentWalls: getAdjacentWallCount(layout, roomX, roomY),
          distanceFromCenter: Math.abs(roomX - 7) + Math.abs(roomY - 7),
          pathConnections: pathConnections,
          isDeadEnd: pathConnections === 1,
          isJunction: pathConnections >= 3,
          mazeScore: calculateMazeScore(layout, roomX, roomY, pathConnections),
          // ✅ Special apparatus scoring
          apparatusScore: calculateMazeScore(layout, roomX, roomY, pathConnections, ROOM_TYPES.APPARATUS)
        };
        
        placementSpots.push(spot);
      }
    }
  }
  
  // ✅ APPARATUS PRIORITY SORTING
  if (prioritizeApparatus) {
    placementSpots.sort((a, b) => {
      // Primary: Apparatus score for special placement
      if (Math.abs(a.apparatusScore - b.apparatusScore) > 0.1) {
        return b.apparatusScore - a.apparatusScore;
      }
      
      // Secondary: Dead ends strongly preferred
      if (a.isDeadEnd !== b.isDeadEnd) {
        return b.isDeadEnd ? 1 : -1;
      }
      
      // Tertiary: More walls for security
      if (a.adjacentWalls !== b.adjacentWalls) {
        return b.adjacentWalls - a.adjacentWalls;
      }
      
      return 0;
    });
  } else {
    // Normal sorting for other rooms
    placementSpots.sort((a, b) => {
      if (Math.abs(a.mazeScore - b.mazeScore) > 0.1) {
        return b.mazeScore - a.mazeScore;
      }
      
      if (a.isDeadEnd !== b.isDeadEnd) {
        return b.isDeadEnd ? 1 : -1;
      }
      
      if (a.adjacentWalls !== b.adjacentWalls) {
        return b.adjacentWalls - a.adjacentWalls;
      }
      
      return Math.abs(a.distanceFromCenter - 6) - Math.abs(b.distanceFromCenter - 6);
    });
  }
  
  return placementSpots;
};

// ✅ ENHANCED: Special apparatus placement with guaranteed success
export const placeApparatusRoom = (layout, pathNetwork, placementSpots) => {
  // Use apparatus-optimized placement spots
  const apparatusSpots = findMazeRoomPlacementSpots(layout, pathNetwork, true);
  
  if (apparatusSpots.length === 0) {
    return false;
  }
  
  // Try the best spots first
  for (let i = 0; i < Math.min(apparatusSpots.length, 10); i++) {
    const spot = apparatusSpots[i];
    
    if (placeMazeRoomAtPosition(layout, spot.x, spot.y, ROOM_TYPES.APPARATUS, placementSpots)) {
      // ✅ GUARANTEE APPARATUS PLACEMENT
      const cellKey = `${spot.x},${spot.y}`;
      if (layout[cellKey]) {
        layout[cellKey].apparatus = {
          id: `apparatus_${Date.now()}`,
          name: 'Company Apparatus',
          value: 120, // High value item
          weight: 20, // Heavy item
          twoHanded: true,
          requiresActivation: true,
          dangerous: true,
          description: 'Critical company equipment that must be retrieved'
        };
      }
      
      return true;
    }
  }
  return false;
};

// Main maze-optimized room generation function with apparatus integration
export const generateMazeRoomsAlongPaths = (layout, pathNetwork, interiorType, targetRooms, floorNum = 0, totalFloors = 1) => {
  if (targetRooms <= 0) {
    return 0;
  }
  
  const roomTypes = getRoomTypesForInterior(interiorType, targetRooms, floorNum, totalFloors);
  const placementSpots = findMazeRoomPlacementSpots(layout, pathNetwork);
  
  if (placementSpots.length === 0) {
    return 0;
  }
  
  let roomsPlaced = 0;
  let attempts = 0;
  let roomTypeIndex = 0;
  
  // ✅ APPARATUS PRIORITY: Place apparatus room first if it's in the room types
  const apparatusIndex = roomTypes.findIndex(room => room === ROOM_TYPES.APPARATUS);
  if (apparatusIndex !== -1) {
    if (placeApparatusRoom(layout, pathNetwork, placementSpots)) {
      roomsPlaced++;
      // Remove apparatus from room types list
      roomTypes.splice(apparatusIndex, 1);
    } else {
      // Remove apparatus from list even if placement failed to avoid infinite loops
      roomTypes.splice(apparatusIndex, 1);
    }
  }
  
  // Place remaining rooms
  while (roomsPlaced < targetRooms && attempts < ROOM_PLACEMENT_CONFIG.MAX_PLACEMENT_ATTEMPTS) {
    if (placementSpots.length === 0 || roomTypeIndex >= roomTypes.length) {
      break;
    }
    
    const roomType = roomTypes[roomTypeIndex % roomTypes.length];
    roomTypeIndex++;
    
    let placed = false;
    let roomAttempts = 0;
    
    while (!placed && roomAttempts < 20 && placementSpots.length > 0) {
      let spotIndex = 0;
      
      // Special placement preferences for certain room types
      if (roomType === ROOM_TYPES.VAULT || roomType === ROOM_TYPES.SECURITY) {
        const deadEndSpots = placementSpots.filter(s => s.isDeadEnd);
        if (deadEndSpots.length > 0) {
          const deadEndIndex = placementSpots.findIndex(s => s.isDeadEnd);
          if (deadEndIndex !== -1) {
            spotIndex = deadEndIndex;
          }
        }
      }
      
      const spot = placementSpots[spotIndex];
      
      if (placeMazeRoomAtPosition(layout, spot.x, spot.y, roomType, placementSpots)) {
        roomsPlaced++;
        placed = true;
      } else {
        placementSpots.splice(spotIndex, 1);
      }
      
      roomAttempts++;
    }
    
    attempts++;
  }
  
  return roomsPlaced;
};

// Count walls within a radius
export const countNearbyWalls = (layout, centerX, centerY, radius) => {
  let wallCount = 0;
  
  for (let dy = -radius; dy <= radius; dy++) {
    for (let dx = -radius; dx <= radius; dx++) {
      if (dx === 0 && dy === 0) continue;
      
      const checkX = centerX + dx;
      const checkY = centerY + dy;
      
      if (checkX >= 0 && checkX < INTERIOR_GRID_SIZE && 
          checkY >= 0 && checkY < INTERIOR_GRID_SIZE) {
        
        const cellKey = `${checkX},${checkY}`;
        const cell = layout[cellKey];
        
        if (cell && cell.type === 'wall') {
          wallCount++;
        }
      }
    }
  }
  
  return wallCount;
};

// Get number of path connections for a cell
export const getPathConnections = (layout, x, y) => {
  let connections = 0;
  
  const directions = [
    { dx: 0, dy: -1 }, { dx: 1, dy: 0 }, { dx: 0, dy: 1 }, { dx: -1, dy: 0 }
  ];
  
  for (const dir of directions) {
    const adjX = x + dir.dx;
    const adjY = y + dir.dy;
    const cellKey = `${adjX},${adjY}`;
    const cell = layout[cellKey];
    
    if (cell && cell.type === 'room' && 
        (cell.room === ROOM_TYPES.CORRIDOR || cell.room === ROOM_TYPES.HALLWAY)) {
      connections++;
    }
  }
  
  return connections;
};

// Enhanced maze-aware room position validation
export const isValidMazeRoomPosition = (layout, x, y, pathX, pathY) => {
  if (x < 2 || x >= INTERIOR_GRID_SIZE - 2 || y < 2 || y >= INTERIOR_GRID_SIZE - 2) {
    return false;
  }
  
  const cellKey = `${x},${y}`;
  const cell = layout[cellKey];
  
  if (!cell || cell.type !== 'wall') {
    return false;
  }
  
  const pathConnections = getPathConnections(layout, pathX, pathY);
  if (pathConnections >= 3) {
    return Math.random() < (1 - ROOM_PLACEMENT_CONFIG.AVOID_JUNCTION_BLOCKING);
  }
  
  if (wouldCreateIsolatedWalls(layout, x, y)) {
    return false;
  }
  
  return true;
};

// Check if placing a room would create isolated wall sections
export const wouldCreateIsolatedWalls = (layout, x, y) => {
  const directions = [
    { dx: 0, dy: -1 }, { dx: 1, dy: 0 }, { dx: 0, dy: 1 }, { dx: -1, dy: 0 }
  ];
  
  let adjacentPaths = 0;
  let adjacentWalls = 0;
  
  for (const dir of directions) {
    const adjX = x + dir.dx;
    const adjY = y + dir.dy;
    const cellKey = `${adjX},${adjY}`;
    const cell = layout[cellKey];
    
    if (cell) {
      if (cell.type === 'room') {
        adjacentPaths++;
      } else if (cell.type === 'wall') {
        adjacentWalls++;
      }
    }
  }
  
  if (adjacentPaths >= 3) {
    return true;
  }
  
  return false;
};

// Maze-optimized room placement with size restrictions
export const placeMazeRoomAtPosition = (layout, x, y, roomType, pathSpots) => {
  const originalSize = roomType.preferredSize || { width: 1, height: 1 };
  const maxMazeSize = ROOM_PLACEMENT_CONFIG.MAX_ROOM_SIZE_IN_MAZE;
  
  let adjustedSize = {
    width: Math.min(originalSize.width, maxMazeSize),
    height: Math.min(originalSize.height, maxMazeSize)
  };
  
  // ✅ APPARATUS ROOM: Respect the 2x1 preferred size when possible
  if (roomType === ROOM_TYPES.APPARATUS) {
    // Try to place at preferred size first (2x1)
    if (canPlaceMazeRoomSize(layout, x, y, { width: 2, height: 1 })) {
      adjustedSize = { width: 2, height: 1 };
    } else if (canPlaceMazeRoomSize(layout, x, y, { width: 1, height: 2 })) {
      adjustedSize = { width: 1, height: 2 }; // Try rotated
    } else {
      adjustedSize = { width: 1, height: 1 }; // Fallback to single tile
    }
  } else {
    // Normal room size logic for other rooms
    if (Math.random() < ROOM_PLACEMENT_CONFIG.PREFER_SINGLE_TILE_ROOMS) {
      adjustedSize = { width: 1, height: 1 };
    }
  }
  
  if (!canPlaceMazeRoomSize(layout, x, y, adjustedSize)) {
    adjustedSize = { width: 1, height: 1 };
    
    if (!canPlaceMazeRoomSize(layout, x, y, adjustedSize)) {
      return false;
    }
  }
  
  // Place the room
  for (let dy = 0; dy < adjustedSize.height; dy++) {
    for (let dx = 0; dx < adjustedSize.width; dx++) {
      const cellKey = `${x + dx},${y + dy}`;
      layout[cellKey] = {
        type: 'room',
        room: roomType,
        scrap: null,
        entity: null,
        trap: null,
        door: null,
        // ✅ Add apparatus data if this is an apparatus room
        ...(roomType === ROOM_TYPES.APPARATUS && dx === 0 && dy === 0 ? {
          apparatus: {
            id: `apparatus_${Date.now()}`,
            name: 'Company Apparatus',
            value: 120,
            weight: 20,
            twoHanded: true,
            requiresActivation: true,
            dangerous: true,
            description: 'Critical company equipment that must be retrieved'
          }
        } : {})
      };
    }
  }
  
  removeMazeOverlappingSpots(pathSpots, x, y, adjustedSize);
  return true;
};

// Maze-aware room size validation
export const canPlaceMazeRoomSize = (layout, x, y, size) => {
  if (x + size.width >= INTERIOR_GRID_SIZE - 1 || y + size.height >= INTERIOR_GRID_SIZE - 1) {
    return false;
  }
  
  for (let dy = 0; dy < size.height; dy++) {
    for (let dx = 0; dx < size.width; dx++) {
      const checkX = x + dx;
      const checkY = y + dy;
      
      if (!isValidMazeRoomPosition(layout, checkX, checkY, x, y)) {
        return false;
      }
    }
  }
  
  return !wouldDisruptMazeFlow(layout, x, y, size);
};

// Check if room placement would disrupt maze flow
export const wouldDisruptMazeFlow = (layout, x, y, size) => {
  const expandedArea = {
    minX: x - 1,
    maxX: x + size.width,
    minY: y - 1,
    maxY: y + size.height
  };
  
  let blockedPaths = 0;
  
  for (let checkY = expandedArea.minY; checkY <= expandedArea.maxY; checkY++) {
    for (let checkX = expandedArea.minX; checkX <= expandedArea.maxX; checkX++) {
      if (checkX >= 0 && checkX < INTERIOR_GRID_SIZE && 
          checkY >= 0 && checkY < INTERIOR_GRID_SIZE) {
        
        const cellKey = `${checkX},${checkY}`;
        const cell = layout[cellKey];
        
        if (cell && cell.type === 'room' && 
            (cell.room === ROOM_TYPES.CORRIDOR || cell.room === ROOM_TYPES.HALLWAY)) {
          
          const pathConnections = getPathConnections(layout, checkX, checkY);
          if (pathConnections >= 3) {
            blockedPaths++;
          }
        }
      }
    }
  }
  
  return blockedPaths >= 2;
};

// Enhanced spot removal for maze layouts
export const removeMazeOverlappingSpots = (pathSpots, roomX, roomY, roomSize) => {
  const buffer = ROOM_PLACEMENT_CONFIG.ROOM_SPACING_BUFFER;
  
  for (let i = pathSpots.length - 1; i >= 0; i--) {
    const spot = pathSpots[i];
    
    if (spot.x >= roomX - buffer && spot.x < roomX + roomSize.width + buffer &&
        spot.y >= roomY - buffer && spot.y < roomY + roomSize.height + buffer) {
      pathSpots.splice(i, 1);
    }
  }
};

// Analyze maze room placement for debugging
export const analyzeMazeRoomPlacement = (layout) => {
  const analysis = {
    totalCells: 0,
    wallCells: 0,
    pathCells: 0,
    roomCells: 0,
    deadEndRooms: 0,
    junctionRooms: 0,
    roomTypes: {},
    hasApparatus: false,
    apparatusLocation: null
  };
  
  Object.entries(layout).forEach(([cellKey, cell]) => {
    analysis.totalCells++;
    
    if (cell.type === 'wall') {
      analysis.wallCells++;
    } else if (cell.type === 'room') {
      if (cell.room === ROOM_TYPES.HALLWAY || cell.room === ROOM_TYPES.CORRIDOR) {
        analysis.pathCells++;
      } else {
        analysis.roomCells++;
        const roomName = cell.room.name;
        analysis.roomTypes[roomName] = (analysis.roomTypes[roomName] || 0) + 1;
        
        // ✅ Check for apparatus
        if (cell.room === ROOM_TYPES.APPARATUS) {
          analysis.hasApparatus = true;
          const [x, y] = cellKey.split(',').map(Number);
          analysis.apparatusLocation = { x, y };
        }
        
        if (cell.apparatus) {
          analysis.hasApparatus = true;
          if (!analysis.apparatusLocation) {
            const [x, y] = cellKey.split(',').map(Number);
            analysis.apparatusLocation = { x, y };
          }
        }
        
        const [x, y] = cellKey.split(',').map(Number);
        const pathConnections = getPathConnections(layout, x, y);
        
        if (pathConnections === 1) {
          analysis.deadEndRooms++;
        } else if (pathConnections >= 3) {
          analysis.junctionRooms++;
        }
      }
    }
  });
  
  return analysis;
};