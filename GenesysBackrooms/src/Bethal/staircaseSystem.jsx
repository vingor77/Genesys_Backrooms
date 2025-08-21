// Ensure all staircases are connected to the path network
export const ensureStaircaseConnections = (layout, pathNetwork, floorNum) => {
  const staircases = Object.entries(layout).filter(([cellKey, cell]) => 
    cell.type === 'room' && cell.staircaseConnection
  );
  
  for (const [staircaseKey, staircaseCell] of staircases) {
    const [x, y] = staircaseKey.split(',').map(Number);
    
    // Check if staircase is already connected to path network
    const isConnected = isConnectedToPathNetwork(x, y, pathNetwork);
    
    if (!isConnected) {
      // Find nearest path
      const nearestPath = findNearestPathCell(x, y, pathNetwork);
      
      if (nearestPath) {
        // Create connection path using local implementation
        createSimplePathTo(layout, pathNetwork, { x, y }, nearestPath);
      }
    }
  }
};// staircaseSystem.jsx - Flexible staircase connection system

import { ROOM_TYPES } from './indoorData.jsx';
import { INTERIOR_GRID_SIZE } from './pathGenerator.jsx';

// Staircase configuration
export const STAIRCASE_CONFIG = {
  MIN_STAIRCASES_PER_BUILDING: 2,
  MAX_STAIRCASES_PER_BUILDING: 4,
  MIN_DISTANCE_FROM_CENTER: 3,
  MIN_DISTANCE_BETWEEN_STAIRCASES: 4,
  CONNECTION_RADIUS: 2 // How far to search for path connection
};

// Staircase connection tracking
export class StaircaseConnection {
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.floors = new Map(); // floorNum -> {x, y, type}
    this.connections = new Map(); // floorNum -> connectedStaircaseId
  }
  
  addFloor(floorNum, x, y, type) {
    this.floors.set(floorNum, { x, y, type });
  }
  
  getPosition(floorNum) {
    return this.floors.get(floorNum);
  }
  
  hasFloor(floorNum) {
    return this.floors.has(floorNum);
  }
  
  getFloors() {
    return Array.from(this.floors.keys()).sort((a, b) => a - b);
  }
}

// Generate flexible staircase system for the entire building
export const generateFlexibleStaircaseSystem = (totalFloors, pathNetworks) => {
  const numberOfStaircases = Math.min(
    STAIRCASE_CONFIG.MAX_STAIRCASES_PER_BUILDING,
    Math.max(STAIRCASE_CONFIG.MIN_STAIRCASES_PER_BUILDING, Math.ceil(totalFloors * 0.6))
  );
  
  const staircaseConnections = [];
  
  // Create staircase connections
  for (let i = 0; i < numberOfStaircases; i++) {
    const connection = new StaircaseConnection(
      `staircase_${i + 1}`,
      `Staircase ${String.fromCharCode(65 + i)}` // A, B, C, etc.
    );
    staircaseConnections.push(connection);
  }
  
  // Distribute staircases across floors
  for (let floorNum = 0; floorNum < totalFloors; floorNum++) {
    const pathNetwork = pathNetworks[floorNum];
    if (!pathNetwork || pathNetwork.size === 0) {
      continue;
    }
    
    // Determine which staircases should appear on this floor
    const staircasesForThisFloor = determineStaircasesForFloor(floorNum, totalFloors, staircaseConnections);
    
    // Find good positions for staircases on this floor
    const availablePositions = findStaircasePositionsOnFloor(pathNetwork, staircasesForThisFloor.length);
    
    // Assign positions to staircases
    for (let i = 0; i < Math.min(staircasesForThisFloor.length, availablePositions.length); i++) {
      const staircase = staircasesForThisFloor[i];
      const position = availablePositions[i];
      
      // Determine staircase type
      let type;
      if (floorNum === 0) {
        type = ROOM_TYPES.STAIRCASE_UP;
      } else if (floorNum === totalFloors - 1) {
        type = ROOM_TYPES.STAIRCASE_DOWN;
      } else {
        type = ROOM_TYPES.STAIRCASE_BOTH;
      }
      
      staircase.addFloor(floorNum, position.x, position.y, type);
    }
  }
  
  // Verify connections and log the system
  logStaircaseSystem(staircaseConnections);
  
  return staircaseConnections;
};

// Determine which staircases should appear on a specific floor
export const determineStaircasesForFloor = (floorNum, totalFloors, allStaircases) => {
  const staircasesForFloor = [];
  
  if (floorNum === 0) {
    // Ground floor: Need at least 2 staircases going up
    staircasesForFloor.push(...allStaircases.slice(0, Math.min(2, allStaircases.length)));
  } else if (floorNum === totalFloors - 1) {
    // Top floor: Need at least 2 staircases going down
    staircasesForFloor.push(...allStaircases.slice(0, Math.min(2, allStaircases.length)));
  } else {
    // Middle floors: All staircases should appear
    staircasesForFloor.push(...allStaircases);
  }
  
  return staircasesForFloor;
};

// Find good staircase positions on a specific floor
export const findStaircasePositionsOnFloor = (pathNetwork, neededCount) => {
  const pathArray = Array.from(pathNetwork).map(cellKey => {
    const [x, y] = cellKey.split(',').map(Number);
    return { x, y, cellKey };
  });
  
  if (pathArray.length === 0) {
    return [];
  }
  
  // Score potential positions
  const scoredPositions = pathArray.map(pos => ({
    ...pos,
    score: calculateStaircasePositionScore(pos, pathArray)
  }));
  
  // Sort by score (higher is better)
  scoredPositions.sort((a, b) => b.score - a.score);
  
  // Select positions with minimum distance between them
  const selectedPositions = [];
  
  for (const position of scoredPositions) {
    if (selectedPositions.length >= neededCount) break;
    
    // Check if this position is far enough from already selected positions
    const tooClose = selectedPositions.some(selected => {
      const distance = Math.abs(position.x - selected.x) + Math.abs(position.y - selected.y);
      return distance < STAIRCASE_CONFIG.MIN_DISTANCE_BETWEEN_STAIRCASES;
    });
    
    if (!tooClose) {
      selectedPositions.push(position);
    }
  }
  
  return selectedPositions;
};

// Calculate score for a potential staircase position
export const calculateStaircasePositionScore = (position, allPathPositions) => {
  let score = 0;
  
  // Distance from center (prefer not too close to center)
  const centerX = Math.floor(INTERIOR_GRID_SIZE / 2);
  const centerY = Math.floor(INTERIOR_GRID_SIZE / 2);
  const distanceFromCenter = Math.abs(position.x - centerX) + Math.abs(position.y - centerY);
  
  if (distanceFromCenter >= STAIRCASE_CONFIG.MIN_DISTANCE_FROM_CENTER) {
    score += Math.min(distanceFromCenter, 8); // Cap the benefit
  } else {
    score -= 5; // Penalty for being too close to center
  }
  
  // Connectivity score (how many paths are nearby)
  const nearbyPaths = allPathPositions.filter(pathPos => {
    const distance = Math.abs(position.x - pathPos.x) + Math.abs(position.y - pathPos.y);
    return distance <= STAIRCASE_CONFIG.CONNECTION_RADIUS && distance > 0;
  }).length;
  
  score += nearbyPaths * 2;
  
  // Edge preference (prefer positions closer to edges for better distribution)
  const distanceFromEdges = Math.min(
    position.x,
    position.y,
    INTERIOR_GRID_SIZE - 1 - position.x,
    INTERIOR_GRID_SIZE - 1 - position.y
  );
  
  if (distanceFromEdges >= 2) {
    score += (8 - distanceFromEdges); // Prefer positions not too close to edges
  }
  
  // Random factor for variety
  score += Math.random() * 3;
  
  return score;
};

// Place staircases in the layout and ensure path connections
export const placeStaircasesInLayout = (layout, pathNetwork, staircaseConnections, floorNum) => {
  let staircasesPlaced = 0;
  
  for (const connection of staircaseConnections) {
    if (!connection.hasFloor(floorNum)) continue;
    
    const position = connection.getPosition(floorNum);
    const cellKey = `${position.x},${position.y}`;
    
    // Check if the position is available
    if (layout[cellKey] && layout[cellKey].type === 'wall') {
      // Convert the wall to a staircase
      layout[cellKey] = {
        type: 'room',
        room: position.type,
        scrap: null,
        entity: null,
        trap: null,
        door: null,
        staircaseConnection: {
          id: connection.id,
          name: connection.name,
          floors: connection.getFloors()
        }
      };
      
      // Add to path network
      pathNetwork.add(cellKey);
      staircasesPlaced++;
    } else {
      // Try to find a nearby alternative position
      const alternative = findAlternativeStaircasePosition(layout, pathNetwork, position);
      if (alternative) {
        layout[`${alternative.x},${alternative.y}`] = {
          type: 'room',
          room: position.type,
          scrap: null,
          entity: null,
          trap: null,
          door: null,
          staircaseConnection: {
            id: connection.id,
            name: connection.name,
            floors: connection.getFloors()
          }
        };
        
        pathNetwork.add(`${alternative.x},${alternative.y}`);
        staircasesPlaced++;
        
        // Update the connection with the new position
        connection.addFloor(floorNum, alternative.x, alternative.y, position.type);
      }
    }
  }
  
  // Ensure all staircases are connected to the path network
  ensureStaircaseConnections(layout, pathNetwork, floorNum);
  return staircasesPlaced;
};

// Find alternative position for staircase if original is occupied
export const findAlternativeStaircasePosition = (layout, pathNetwork, originalPosition) => {
  const searchRadius = 3;
  
  for (let radius = 1; radius <= searchRadius; radius++) {
    for (let dx = -radius; dx <= radius; dx++) {
      for (let dy = -radius; dy <= radius; dy++) {
        if (Math.abs(dx) + Math.abs(dy) !== radius) continue; // Only check positions at exact radius
        
        const newX = originalPosition.x + dx;
        const newY = originalPosition.y + dy;
        
        if (newX >= 1 && newX < INTERIOR_GRID_SIZE - 1 && 
            newY >= 1 && newY < INTERIOR_GRID_SIZE - 1) {
          
          const cellKey = `${newX},${newY}`;
          const cell = layout[cellKey];
          
          if (cell && cell.type === 'wall') {
            // Check if it's near the path network
            const nearPath = isNearPathNetwork(newX, newY, pathNetwork);
            if (nearPath) {
              return { x: newX, y: newY };
            }
          }
        }
      }
    }
  }
  
  return null;
};

// Check if position is near path network
export const isNearPathNetwork = (x, y, pathNetwork) => {
  for (let dx = -2; dx <= 2; dx++) {
    for (let dy = -2; dy <= 2; dy++) {
      const checkKey = `${x + dx},${y + dy}`;
      if (pathNetwork.has(checkKey)) {
        return true;
      }
    }
  }
  return false;
};

// Create a simple path between two points (local implementation)
export const createSimplePathTo = (layout, pathNetwork, start, end) => {
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
          trap: null,
          door: null
        };
        pathNetwork.add(cellKey);
      } else if (layout[cellKey] && layout[cellKey].type === 'room') {
        // Add existing room cells to path network for pathfinding
        pathNetwork.add(cellKey);
      }
    }
  }
};

// Check if position is connected to path network
export const isConnectedToPathNetwork = (x, y, pathNetwork) => {
  // Check adjacent cells
  const adjacent = [
    `${x-1},${y}`, `${x+1},${y}`, `${x},${y-1}`, `${x},${y+1}`
  ];
  
  return adjacent.some(cellKey => pathNetwork.has(cellKey));
};

// Find nearest path cell to a position
export const findNearestPathCell = (x, y, pathNetwork) => {
  let nearestPath = null;
  let minDistance = Infinity;
  
  for (const cellKey of pathNetwork) {
    const [pathX, pathY] = cellKey.split(',').map(Number);
    const distance = Math.abs(x - pathX) + Math.abs(y - pathY);
    
    if (distance < minDistance) {
      minDistance = distance;
      nearestPath = { x: pathX, y: pathY };
    }
  }
  
  return nearestPath;
};

// Log the complete staircase system for debugging
export const logStaircaseSystem = (staircaseConnections) => {
  for (const connection of staircaseConnections) {
    const floors = connection.getFloors();
    for (const floorNum of floors) {
      const position = connection.getPosition(floorNum);
    }
  }
};