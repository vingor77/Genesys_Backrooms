// Enhanced floorManager.jsx - Multi-floor building generation with Apparatus Room support

import { ROOM_TYPES } from './indoorData.jsx';
import { INTERIOR_GRID_SIZE, CENTER_POINT, generateMazePathNetwork, findStaircasePositions } from './pathGenerator.jsx';
import { generateFlexibleStaircaseSystem, placeStaircasesInLayout, createSimplePathTo } from './staircaseSystem.jsx';
import { resetApparatusTracking } from './roomGenerator.jsx'; // ✅ Import apparatus tracking

// Building configuration
export const BUILDING_CONFIG = {
  MIN_FLOORS: 2,
  MAX_FLOORS: 5,
  ROOMS_PER_FLOOR_TARGET: 6,
  MIN_ROOMS_FOR_MULTI_FLOOR: 10
};

// Calculate optimal number of floors based on room requirements
export const calculateOptimalFloors = (targetRooms) => {
  if (targetRooms < BUILDING_CONFIG.MIN_ROOMS_FOR_MULTI_FLOOR) {
    return 2;
  }
  
  const calculatedFloors = Math.ceil(targetRooms / BUILDING_CONFIG.ROOMS_PER_FLOOR_TARGET);
  const finalFloors = Math.min(Math.max(calculatedFloors, BUILDING_CONFIG.MIN_FLOORS), BUILDING_CONFIG.MAX_FLOORS);

  return finalFloors;
};

// Generate the building structure with entrance and exit placement
export const generateBuildingStructure = (totalFloors, selectedMoon) => {
  const buildingInfo = {
    totalFloors,
    entranceFloor: Math.floor(Math.random() * totalFloors),
    fireExits: generateFireExitConfiguration(totalFloors, selectedMoon),
    staircasePositions: []
  };
  
  return buildingInfo;
};

// Generate fire exit configuration based on moon requirements
export const generateFireExitConfiguration = (totalFloors, selectedMoon) => {
  const fireExits = [];
  
  // Special case for March moon - always 3 fire exits
  if (selectedMoon && selectedMoon.includes('March')) {
    const floors = Array.from({ length: totalFloors }, (_, i) => i);
    
    for (let i = 0; i < 3; i++) {
      let exitFloor;
      if (floors.length > 0) {
        const floorIndex = Math.floor(Math.random() * floors.length);
        exitFloor = floors.splice(floorIndex, 1)[0];
      } else {
        exitFloor = Math.floor(Math.random() * totalFloors);
      }
      
      fireExits.push({
        id: `fire_exit_${i + 1}`,
        floor: exitFloor,
        position: generateFireExitPosition()
      });
    }
  } else {
    // Single fire exit for all other moons
    const exitFloor = Math.floor(Math.random() * totalFloors);
    fireExits.push({
      id: 'fire_exit_1',
      floor: exitFloor,
      position: generateFireExitPosition()
    });
  }
  
  return fireExits;
};

// Generate a fire exit position on the building perimeter
export const generateFireExitPosition = () => {
  const perimeter = [];
  
  // Top and bottom edges
  for (let x = 0; x < INTERIOR_GRID_SIZE; x++) {
    perimeter.push({ x, y: 0 });
    perimeter.push({ x, y: INTERIOR_GRID_SIZE - 1 });
  }
  
  // Left and right edges (excluding corners already added)
  for (let y = 1; y < INTERIOR_GRID_SIZE - 1; y++) {
    perimeter.push({ x: 0, y });
    perimeter.push({ x: INTERIOR_GRID_SIZE - 1, y });
  }
  
  return perimeter[Math.floor(Math.random() * perimeter.length)];
};

// Initialize empty floor layout
export const initializeFloorLayout = () => {
  const layout = {};
  
  for (let y = 0; y < INTERIOR_GRID_SIZE; y++) {
    for (let x = 0; x < INTERIOR_GRID_SIZE; x++) {
      layout[`${x},${y}`] = {
        type: 'wall',
        room: null,
        scrap: null,
        entity: null,
        trap: null,
        door: null
      };
    }
  }
  
  return layout;
};

// Generate a single floor with flexible staircase system
export const generateSingleFloorWithFlexibleStaircases = (floorNum, buildingInfo, interiorType, targetRooms, pathNetwork, staircaseConnections) => {
  const layout = initializeFloorLayout();
  
  // Step 1: Use existing path network (already generated)
  for (const cellKey of pathNetwork) {
    const [x, y] = cellKey.split(',').map(Number);
    if (layout[`${x},${y}`] && layout[`${x},${y}`].type === 'wall') {
      layout[`${x},${y}`] = {
        type: 'room',
        room: ROOM_TYPES.CORRIDOR,
        scrap: null,
        entity: null,
        trap: null,
        door: null
      };
    }
  }
  
  // Step 2: Place entrance if this is the entrance floor
  if (floorNum === buildingInfo.entranceFloor) {
    layout[`${CENTER_POINT.x},${CENTER_POINT.y}`] = {
      type: 'room',
      room: ROOM_TYPES.ENTRANCE,
      scrap: null,
      entity: null,
      trap: null,
      door: null
    };
  }
  
  // Step 3: Place fire exits if any belong on this floor
  const floorFireExits = buildingInfo.fireExits.filter(exit => exit.floor === floorNum);
  floorFireExits.forEach((exit, index) => {
    const position = exit.position;
    layout[`${position.x},${position.y}`] = {
      type: 'room',
      room: ROOM_TYPES.FIRE_EXIT,
      scrap: null,
      entity: null,
      trap: null,
      door: null
    };
    
    createPathToFireExit(layout, pathNetwork, position);
  });
  
  // Step 4: Place flexible staircases and ensure connections
  const staircasesPlaced = placeStaircasesInLayout(layout, pathNetwork, staircaseConnections, floorNum);
  
  // Step 5: Generate rooms along the path network
  generateRoomsAlongPaths(layout, pathNetwork, interiorType, targetRooms);
  
  return layout;
};

// Remove old single floor function and replace with the flexible version
export const generateSingleFloor = generateSingleFloorWithFlexibleStaircases;

// ✅ ENHANCED: Generate complete building with apparatus room support
export const generateCompleteBuilding = (targetRooms, selectedMoon, interiorType) => {
  // ✅ CRITICAL: Reset apparatus tracking for new facility
  resetApparatusTracking();
  
  const totalFloors = calculateOptimalFloors(targetRooms);
  const buildingInfo = generateBuildingStructure(totalFloors, selectedMoon);
  
  // First pass: Generate path networks for all floors
  const pathNetworks = {};
  const tempLayouts = {};
  
  for (let floorNum = 0; floorNum < totalFloors; floorNum++) {
    const tempLayout = initializeFloorLayout();
    const pathNetwork = generateMazePathNetwork(tempLayout);
    pathNetworks[floorNum] = pathNetwork;
    tempLayouts[floorNum] = tempLayout;
  }
  
  // Generate flexible staircase system using all path networks
  const staircaseConnections = generateFlexibleStaircaseSystem(totalFloors, pathNetworks);
  buildingInfo.staircaseConnections = staircaseConnections;
  
  const floors = {};
  let totalRoomsGenerated = 0;
  const roomsPerFloorTargets = [];
  
  // STRICT ROOM DISTRIBUTION - Calculate exact targets per floor
  for (let floorNum = 0; floorNum < totalFloors; floorNum++) {
    const remainingRooms = targetRooms - totalRoomsGenerated;
    const remainingFloors = totalFloors - floorNum;
    const thisFloorTarget = Math.min(
      Math.ceil(remainingRooms / remainingFloors),
      remainingRooms
    );
    roomsPerFloorTargets.push(thisFloorTarget);
    totalRoomsGenerated += thisFloorTarget;
  }
  
  // Adjust if we went over target
  let adjustment = totalRoomsGenerated - targetRooms;
  for (let i = roomsPerFloorTargets.length - 1; i >= 0 && adjustment > 0; i--) {
    const reduce = Math.min(adjustment, roomsPerFloorTargets[i] - 1);
    roomsPerFloorTargets[i] -= reduce;
    adjustment -= reduce;
  }
  
  totalRoomsGenerated = 0;
  
  // ✅ ENHANCED: Generate each floor with apparatus support
  for (let floorNum = 0; floorNum < totalFloors; floorNum++) {
    const floorLayout = generateSingleFloorWithFlexibleStaircases(
      floorNum,
      buildingInfo,
      interiorType,
      roomsPerFloorTargets[floorNum],
      pathNetworks[floorNum],
      staircaseConnections
    );
    
    floors[floorNum] = floorLayout;
    
    const actualRooms = countLogicalRoomsInLayout(floorLayout);
    totalRoomsGenerated += actualRooms;
  }
  
  // ✅ APPARATUS VERIFICATION
  const apparatusStats = verifyApparatusPlacement(floors);
  
  return {
    floors,
    buildingInfo,
    stats: {
      floorsGenerated: Object.keys(floors).length,
      totalRooms: totalRoomsGenerated,
      targetRooms,
      roomsPerFloor: roomsPerFloorTargets,
      roomCountEnforced: totalRoomsGenerated === targetRooms,
      staircaseConnections: staircaseConnections.length,
      // ✅ Add apparatus stats
      apparatusPlaced: apparatusStats.found,
      apparatusLocation: apparatusStats.location,
      apparatusFloor: apparatusStats.floor
    }
  };
};

// ✅ NEW: Verify apparatus placement across all floors
export const verifyApparatusPlacement = (floors) => {
  let apparatusFound = false;
  let apparatusLocation = null;
  let apparatusFloor = null;
  let apparatusCount = 0;
  
  Object.entries(floors).forEach(([floorNum, layout]) => {
    Object.entries(layout).forEach(([cellKey, cell]) => {
      // Check for apparatus room type
      if (cell.room === ROOM_TYPES.APPARATUS) {
        apparatusFound = true;
        apparatusCount++;
        if (!apparatusLocation) {
          const [x, y] = cellKey.split(',').map(Number);
          apparatusLocation = { x, y };
          apparatusFloor = parseInt(floorNum);
        }
      }
      
      // Also check for apparatus object
      if (cell.apparatus) {
        apparatusFound = true;
        if (!apparatusLocation) {
          const [x, y] = cellKey.split(',').map(Number);
          apparatusLocation = { x, y };
          apparatusFloor = parseInt(floorNum);
        }
      }
    });
  });
  
  return {
    found: apparatusFound,
    count: apparatusCount,
    location: apparatusLocation,
    floor: apparatusFloor,
    unique: apparatusCount <= 1
  };
};

// Create path to fire exit if needed (using local implementation)
export const createPathToFireExit = (layout, pathNetwork, fireExitPosition) => {
  const pathArray = Array.from(pathNetwork).map(cellKey => {
    const [x, y] = cellKey.split(',').map(Number);
    return { x, y, cellKey };
  });
  
  if (pathArray.length === 0) return;
  
  let nearestPath = pathArray[0];
  let minDistance = Math.abs(nearestPath.x - fireExitPosition.x) + Math.abs(nearestPath.y - fireExitPosition.y);
  
  for (const pathCell of pathArray) {
    const distance = Math.abs(pathCell.x - fireExitPosition.x) + Math.abs(pathCell.y - fireExitPosition.y);
    if (distance < minDistance) {
      minDistance = distance;
      nearestPath = pathCell;
    }
  }
  
  createSimplePathTo(layout, pathNetwork, { x: nearestPath.x, y: nearestPath.y }, fireExitPosition);
};

// Generate rooms along the path network - this will be called from the main component
export const generateRoomsAlongPaths = (layout, pathNetwork, interiorType, targetRooms) => {
  // This is a placeholder - the actual implementation is in roomGenerator.jsx
  // The main component (NewInteriorGrid) will import and call the real function directly
  return 0;
};

// Count logical rooms in a layout (excluding infrastructure)
export const countLogicalRoomsInLayout = (layout) => {
  const excludedTypes = [
    ROOM_TYPES.HALLWAY,
    ROOM_TYPES.CORRIDOR,
    ROOM_TYPES.ENTRANCE,
    ROOM_TYPES.FIRE_EXIT,
    ROOM_TYPES.STAIRCASE_UP,
    ROOM_TYPES.STAIRCASE_DOWN,
    ROOM_TYPES.STAIRCASE_BOTH
  ];
  
  let roomCount = 0;
  const processedCells = new Set();
  
  Object.entries(layout).forEach(([cellKey, cell]) => {
    if (cell.type === 'room' && cell.room && !excludedTypes.includes(cell.room) && !processedCells.has(cellKey)) {
      roomCount++;
      
      // Mark all cells of this multi-tile room as processed
      const [x, y] = cellKey.split(',').map(Number);
      const size = cell.room.preferredSize || { width: 1, height: 1 };
      
      for (let dy = 0; dy < size.height; dy++) {
        for (let dx = 0; dx < size.width; dx++) {
          processedCells.add(`${x + dx},${y + dy}`);
        }
      }
    }
  });
  
  return roomCount;
};