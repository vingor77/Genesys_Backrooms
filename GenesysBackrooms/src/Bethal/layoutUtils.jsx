import { ROOM_TYPES } from './indoorData.jsx';
import { INTERIOR_TYPES } from './moonData.jsx';

// Interior grid constants
export const INTERIOR_GRID_SIZE = 15; // 15x15 grid for complex layouts
export const MAIN_ENTRANCE = { x: 7, y: 7 }; // TRUE CENTER entrance (7,7 in 15x15 grid)
export const FIRE_EXIT = { x: 0, y: 0 }; // Top left fire exit (default)

// Calculate number of floors needed based on room count
export const calculateFloorsNeeded = (totalRooms) => {
  const roomsPerFloor = 12; // Reduced to encourage more floors for larger maps
  const calculatedFloors = Math.ceil(totalRooms / roomsPerFloor);
  // Scale floors better: 2-4 floors based on room count
  if (totalRooms <= 15) return 2; // Small maps: 2 floors
  if (totalRooms <= 25) return 3; // Medium maps: 3 floors  
  return Math.min(calculatedFloors, 4); // Large maps: up to 4 floors
};

// Generate aligned staircase positions that will be consistent across all floors
export const generateAlignedStaircasePositions = (totalFloors) => {
  const staircasePositions = [];
  
  // For buildings with multiple floors, place 2-3 staircases strategically
  const numberOfStaircases = totalFloors <= 3 ? 2 : 3;
  
  // Predefined good staircase positions that work well with corridor systems
  const goodPositions = [
    { x: 4, y: 4 },   // Upper left quadrant
    { x: 10, y: 4 },  // Upper right quadrant
    { x: 4, y: 10 },  // Lower left quadrant
    { x: 10, y: 10 }, // Lower right quadrant
    { x: 7, y: 3 },   // North of center
    { x: 7, y: 11 },  // South of center
    { x: 3, y: 7 },   // West of center
    { x: 11, y: 7 }   // East of center
  ];
  
  // Shuffle and select positions
  const shuffledPositions = [...goodPositions].sort(() => Math.random() - 0.5);
  
  for (let i = 0; i < numberOfStaircases && i < shuffledPositions.length; i++) {
    staircasePositions.push(shuffledPositions[i]);
  }
  
  return staircasePositions;
};

// Generate fire exit position based on moon
export const generateFireExitPosition = (selectedMoon) => {
  if (!selectedMoon) return FIRE_EXIT;
  
  // Different moons have different fire exit patterns
  switch (selectedMoon) {
    case "61-March":
      const marches = [
        { x: 0, y: 0 }, { x: 14, y: 0 }, { x: 0, y: 14 }
      ];
      return marches[Math.floor(Math.random() * marches.length)];
    
    case "68-Artifice":
      return { x: 14, y: Math.floor(Math.random() * 4) + 4 };
    
    case "85-Rend":
    case "7-Dine":
      return Math.random() < 0.5 ? { x: 0, y: 0 } : { x: 14, y: 0 };
    
    default:
      const corners = [
        { x: 0, y: 0 }, { x: 14, y: 0 }, { x: 0, y: 14 }, { x: 14, y: 14 }
      ];
      return corners[Math.floor(Math.random() * corners.length)];
  }
};

// Create corridor system that connects to staircases and fire exit
export const createCorridorSystem = (layout, entrance, fireExit, staircasePositions) => {
  const corridorCells = new Set();
  
  // Start from entrance (ground floor) or center (upper floors)
  const startPos = entrance || { x: 7, y: 7 };
  
  // Create main corridors from start position
  const directions = [
    { dx: 0, dy: -1 }, { dx: 1, dy: 0 }, { dx: 0, dy: 1 }, { dx: -1, dy: 0 }
  ];

  for (const dir of directions) {
    let current = { x: startPos.x + dir.dx, y: startPos.y + dir.dy };
    let length = Math.floor(Math.random() * 4) + 3;
    
    for (let i = 0; i < length; i++) {
      if (current.x >= 1 && current.x < INTERIOR_GRID_SIZE - 1 && 
          current.y >= 1 && current.y < INTERIOR_GRID_SIZE - 1) {
        
        const cellKey = `${current.x},${current.y}`;
        // Don't overwrite staircases
        if (!layout[cellKey] || layout[cellKey].type === 'wall') {
          layout[cellKey] = {
            type: 'room',
            room: ROOM_TYPES.CORRIDOR,
            scrap: null,
            entity: null,
            trap: null
          };
          corridorCells.add(cellKey);
        }
      }
      
      current.x += dir.dx;
      current.y += dir.dy;
    }
  }
  
  // Ensure paths to all staircases
  for (const staircasePos of staircasePositions) {
    createPathTo(layout, corridorCells, startPos, staircasePos);
  }
  
  // Only create path to fire exit if it exists on this floor
  if (fireExit) {
    createPathTo(layout, corridorCells, startPos, fireExit);
  }
  
  return corridorCells;
};

// Create path between two points
export const createPathTo = (layout, corridorCells, start, end) => {
  let current = { ...start };
  
  while (current.x !== end.x || current.y !== end.y) {
    const dx = Math.sign(end.x - current.x);
    const dy = Math.sign(end.y - current.y);
    
    if (dx !== 0) {
      current.x += dx;
    } else if (dy !== 0) {
      current.y += dy;
    }
    
    if (current.x >= 0 && current.x < INTERIOR_GRID_SIZE && 
        current.y >= 0 && current.y < INTERIOR_GRID_SIZE) {
      
      const cellKey = `${current.x},${current.y}`;
      // Don't overwrite existing rooms (like staircases) or fire exits
      if (layout[cellKey] && layout[cellKey].type === 'wall') {
        layout[cellKey] = {
          type: 'room',
          room: ROOM_TYPES.HALLWAY,
          scrap: null,
          entity: null,
          trap: null
        };
        corridorCells.add(cellKey);
      } else if (layout[cellKey] && layout[cellKey].type === 'room') {
        // Add existing room cells to corridor system for pathfinding
        corridorCells.add(cellKey);
      }
    }
  }
};

// Get room types for interior type
export const getRoomTypesForInterior = (interiorType, targetRooms) => {
  const rooms = [];
  
  switch (interiorType) {
    case INTERIOR_TYPES.FACTORY:
      while (rooms.length < targetRooms) {
        const rand = Math.random();
        if (rand < 0.25) rooms.push(ROOM_TYPES.STORAGE);
        else if (rand < 0.35) rooms.push(ROOM_TYPES.SMALL_STORAGE);
        else if (rand < 0.50) rooms.push(ROOM_TYPES.MACHINERY);
        else if (rand < 0.65) rooms.push(ROOM_TYPES.OFFICE);
        else if (rand < 0.75) rooms.push(ROOM_TYPES.SMALL_OFFICE);
        else if (rand < 0.85) rooms.push(ROOM_TYPES.LABORATORY);
        else if (rand < 0.95) rooms.push(ROOM_TYPES.SECURITY);
        else rooms.push(ROOM_TYPES.VAULT);
      }
      break;
      
    case INTERIOR_TYPES.MANSION:
      while (rooms.length < targetRooms) {
        const rand = Math.random();
        if (rand < 0.20) rooms.push(ROOM_TYPES.BEDROOM);
        else if (rand < 0.35) rooms.push(ROOM_TYPES.OFFICE);
        else if (rand < 0.45) rooms.push(ROOM_TYPES.KITCHEN);
        else if (rand < 0.60) rooms.push(ROOM_TYPES.LIBRARY);
        else if (rand < 0.70) rooms.push(ROOM_TYPES.CAFETERIA);
        else if (rand < 0.80) rooms.push(ROOM_TYPES.STORAGE);
        else if (rand < 0.90) rooms.push(ROOM_TYPES.SMALL_STORAGE);
        else rooms.push(ROOM_TYPES.VAULT);
      }
      break;
      
    case INTERIOR_TYPES.MINESHAFT:
      while (rooms.length < targetRooms) {
        const rand = Math.random();
        if (rand < 0.30) rooms.push(ROOM_TYPES.TUNNEL);
        else if (rand < 0.45) rooms.push(ROOM_TYPES.SHAFT);
        else if (rand < 0.60) rooms.push(ROOM_TYPES.STORAGE);
        else if (rand < 0.70) rooms.push(ROOM_TYPES.MACHINERY);
        else if (rand < 0.85) rooms.push(ROOM_TYPES.BASEMENT);
        else if (rand < 0.95) rooms.push(ROOM_TYPES.SECURITY);
        else rooms.push(ROOM_TYPES.VAULT);
      }
      break;
  }
  
  return rooms.slice(0, targetRooms);
};

// Count logical rooms correctly - exclude infrastructure only
export const countLogicalRooms = (layout) => {
  const processedCells = new Set();
  let roomCount = 0;
  
  Object.entries(layout).forEach(([cellKey, cell]) => {
    if (cell.type === 'room' && cell.room && !processedCells.has(cellKey)) {
      // Don't count these as rooms - they are infrastructure/navigation only
      const excludedRoomTypes = [
        ROOM_TYPES.HALLWAY,
        ROOM_TYPES.CORRIDOR,
        ROOM_TYPES.ENTRANCE,
        ROOM_TYPES.FIRE_EXIT,
        ROOM_TYPES.STAIRCASE_UP,
        ROOM_TYPES.STAIRCASE_DOWN,
        ROOM_TYPES.STAIRCASE_BOTH
      ];
      
      if (excludedRoomTypes.includes(cell.room)) {
        processedCells.add(cellKey);
        return;
      }
      
      // This is a logical room - count it as 1
      roomCount++;
      
      // Mark all tiles of this room as processed to avoid double counting
      const [x, y] = cellKey.split(',').map(Number);
      const roomType = cell.room;
      const size = roomType.preferredSize || { width: 1, height: 1 };
      
      // Find the top-left corner of this room by checking adjacent cells
      let startX = x;
      let startY = y;
      
      // Check if this might be part of a larger room by looking for same room type in adjacent cells
      for (let checkY = Math.max(0, y - size.height + 1); checkY <= y; checkY++) {
        for (let checkX = Math.max(0, x - size.width + 1); checkX <= x; checkX++) {
          const checkKey = `${checkX},${checkY}`;
          const checkCell = layout[checkKey];
          
          if (checkCell && checkCell.type === 'room' && checkCell.room === roomType) {
            // Check if this could be the top-left of a room that includes our current cell
            let isValidRoom = true;
            for (let dy = 0; dy < size.height && isValidRoom; dy++) {
              for (let dx = 0; dx < size.width && isValidRoom; dx++) {
                const testKey = `${checkX + dx},${checkY + dy}`;
                const testCell = layout[testKey];
                if (!testCell || testCell.type !== 'room' || testCell.room !== roomType) {
                  isValidRoom = false;
                }
              }
            }
            
            if (isValidRoom && (checkX < startX || (checkX === startX && checkY < startY))) {
              startX = checkX;
              startY = checkY;
            }
          }
        }
      }
      
      // Mark all tiles of this room as processed
      for (let dy = 0; dy < size.height; dy++) {
        for (let dx = 0; dx < size.width; dx++) {
          const markKey = `${startX + dx},${startY + dy}`;
          if (layout[markKey] && layout[markKey].type === 'room' && layout[markKey].room === roomType) {
            processedCells.add(markKey);
          }
        }
      }
    }
  });
  
  return roomCount;
};