// pathGenerator.jsx - Enhanced maze-like path generation with asymmetrical forks

import { ROOM_TYPES } from './indoorData.jsx';

export const INTERIOR_GRID_SIZE = 15;
export const CENTER_POINT = { x: 7, y: 7 }; // True center of 15x15 grid

// Enhanced maze-like path generation configuration
export const PATH_CONFIG = {
  MIN_BRANCH_LENGTH: 2,
  MAX_BRANCH_LENGTH: 6,
  BRANCH_PROBABILITY: 0.8, // Increased for more branching
  TURN_PROBABILITY: 0.45, // Higher turn probability for maze feel
  DEAD_END_PROBABILITY: 0.35, // More dead ends for maze complexity
  MIN_PATHS_FROM_CENTER: 4, // More initial paths
  MAX_PATHS_FROM_CENTER: 7, // Allow even more variation
  CORRIDOR_WIDTH: 1,
  ROOM_SPACING: 5, // More spacing for maze walls
  WALL_DENSITY: 0.25, // Higher wall density
  HUB_SIZE: 1, // Smaller hub for more asymmetry
  CROSS_CONNECTIONS: 0.25, // Fewer cross-connections to maintain maze feel
  ORGANIC_VARIATION: 0.6, // More variation for asymmetry
  ASYMMETRY_FACTOR: 0.7, // New: controls how asymmetrical the layout becomes
  FORK_PROBABILITY: 0.9, // New: chance to create forks in paths
  ZIGZAG_PROBABILITY: 0.3, // New: chance for paths to zigzag
  SPIRAL_PROBABILITY: 0.8, // New: chance for spiral patterns
  LOOP_AVOIDANCE: 0.95 // New: how much to avoid creating loops (higher = more maze-like)
};

// Direction vectors for path generation
const DIRECTIONS = {
  NORTH: { dx: 0, dy: -1, name: 'north' },
  SOUTH: { dx: 0, dy: 1, name: 'south' },
  EAST: { dx: 1, dy: 0, name: 'east' },
  WEST: { dx: -1, dy: 0, name: 'west' }
};

const ALL_DIRECTIONS = Object.values(DIRECTIONS);

// Enhanced direction selection with asymmetry bias
export const getAsymmetricalDirections = (layout, x, y, excludeDirection = null, biasDirection = null) => {
  const available = [];
  
  for (const direction of ALL_DIRECTIONS) {
    if (excludeDirection && direction === excludeDirection) continue;
    
    const newX = x + direction.dx;
    const newY = y + direction.dy;
    
    // Check bounds with more restrictive maze boundaries
    if (newX >= 2 && newX < INTERIOR_GRID_SIZE - 2 && 
        newY >= 2 && newY < INTERIOR_GRID_SIZE - 2) {
      
      const cellKey = `${newX},${newY}`;
      const cell = layout[cellKey];
      
      // Available if it's a wall and doesn't create unwanted loops
      if (cell && cell.type === 'wall' && !wouldCreateLoop(layout, newX, newY)) {
        // Add bias for asymmetrical growth
        if (biasDirection && direction === biasDirection) {
          available.push(direction, direction); // Double weight for bias
        } else {
          available.push(direction);
        }
      }
    }
  }
  
  return available;
};

// Check if placing a path here would create an unwanted loop
export const wouldCreateLoop = (layout, x, y) => {
  let pathNeighbors = 0;
  
  for (const direction of ALL_DIRECTIONS) {
    const checkX = x + direction.dx;
    const checkY = y + direction.dy;
    const cellKey = `${checkX},${checkY}`;
    const cell = layout[cellKey];
    
    if (cell && cell.type === 'room' && 
        (cell.room === ROOM_TYPES.CORRIDOR || cell.room === ROOM_TYPES.HALLWAY)) {
      pathNeighbors++;
    }
  }
  
  // Avoid creating loops by limiting adjacent path connections
  return pathNeighbors >= 2 && Math.random() < PATH_CONFIG.LOOP_AVOIDANCE;
};

// Generate asymmetrical maze-like path with forks and dead ends
export const generateMazePath = (layout, startX, startY, initialDirection = null, maxLength = null, depth = 0) => {
  const pathCells = [];
  let currentX = startX;
  let currentY = startY;
  let currentDirection = initialDirection;
  
  const pathLength = maxLength || (Math.floor(Math.random() * (PATH_CONFIG.MAX_BRANCH_LENGTH - PATH_CONFIG.MIN_BRANCH_LENGTH + 1)) + PATH_CONFIG.MIN_BRANCH_LENGTH);
  
  // Add asymmetry bias - prefer one side randomly
  const asymmetryBias = Math.random() < PATH_CONFIG.ASYMMETRY_FACTOR ? 
    ALL_DIRECTIONS[Math.floor(Math.random() * ALL_DIRECTIONS.length)] : null;
  
  for (let step = 0; step < pathLength; step++) {
    // Get available directions with asymmetry bias
    const oppositeDir = currentDirection ? getOppositeDirection(currentDirection) : null;
    const availableDirections = getAsymmetricalDirections(layout, currentX, currentY, oppositeDir, asymmetryBias);
    
    if (availableDirections.length === 0) {
      // Create intentional dead end
      break;
    }
    
    // Enhanced direction selection for maze-like behavior
    let chosenDirection;
    
    // Zigzag pattern chance
    if (Math.random() < PATH_CONFIG.ZIGZAG_PROBABILITY && step > 0) {
      const perpendicularDirs = availableDirections.filter(dir => 
        currentDirection && ((dir.dx === 0) !== (currentDirection.dx === 0))
      );
      if (perpendicularDirs.length > 0) {
        chosenDirection = perpendicularDirs[Math.floor(Math.random() * perpendicularDirs.length)];
      }
    }
    
    // If no zigzag, choose direction with maze bias
    if (!chosenDirection) {
      if (currentDirection && availableDirections.includes(currentDirection) && 
          Math.random() > PATH_CONFIG.TURN_PROBABILITY) {
        // Continue straight sometimes
        chosenDirection = currentDirection;
      } else {
        // Turn or choose new direction with asymmetry preference
        chosenDirection = availableDirections[Math.floor(Math.random() * availableDirections.length)];
      }
    }
    
    // Move in chosen direction
    currentX += chosenDirection.dx;
    currentY += chosenDirection.dy;
    currentDirection = chosenDirection;
    
    // Validate position and place path
    if (currentX >= 1 && currentX < INTERIOR_GRID_SIZE - 1 && 
        currentY >= 1 && currentY < INTERIOR_GRID_SIZE - 1) {
      
      const cellKey = `${currentX},${currentY}`;
      const cell = layout[cellKey];
      
      if (cell && cell.type === 'wall') {
        // Place corridor
        layout[cellKey] = {
          type: 'room',
          room: ROOM_TYPES.CORRIDOR,
          scrap: null,
          entity: null,
          trap: null
        };
        
        pathCells.push({ x: currentX, y: currentY, direction: chosenDirection });
        
        // Enhanced fork creation
        if (Math.random() < PATH_CONFIG.FORK_PROBABILITY && step > 1 && depth < 3) {
          const forkDirections = getAsymmetricalDirections(layout, currentX, currentY, getOppositeDirection(chosenDirection));
          
          // Create multiple forks for true maze complexity
          const numberOfForks = Math.random() < 0.3 ? 2 : 1;
          
          for (let f = 0; f < Math.min(numberOfForks, forkDirections.length); f++) {
            if (forkDirections.length > f) {
              const forkDirection = forkDirections[f];
              const forkLength = Math.floor(Math.random() * 4) + 2;
              
              // Recursively generate fork with increased depth
              const forkCells = generateMazePath(layout, currentX, currentY, forkDirection, forkLength, depth + 1);
              pathCells.push(...forkCells);
            }
          }
        }
        
        // Spiral pattern chance (creates interesting maze sections)
        if (Math.random() < PATH_CONFIG.SPIRAL_PROBABILITY && step > 2 && depth === 0) {
          createSpiralPattern(layout, currentX, currentY, chosenDirection);
        }
      } else {
        // Hit existing path or obstacle
        break;
      }
    } else {
      // Hit boundary
      break;
    }
  }
  
  return pathCells;
};

// Create spiral pattern for maze complexity
export const createSpiralPattern = (layout, centerX, centerY, initialDirection) => {
  const spiralCells = [];
  let currentX = centerX;
  let currentY = centerY;
  let currentDir = initialDirection;
  const spiralLength = 4; // Small spiral
  
  for (let i = 0; i < spiralLength; i++) {
    // Turn right to create clockwise spiral
    currentDir = getClockwiseDirection(currentDir);
    
    currentX += currentDir.dx;
    currentY += currentDir.dy;
    
    if (currentX >= 1 && currentX < INTERIOR_GRID_SIZE - 1 && 
        currentY >= 1 && currentY < INTERIOR_GRID_SIZE - 1) {
      
      const cellKey = `${currentX},${currentY}`;
      const cell = layout[cellKey];
      
      if (cell && cell.type === 'wall') {
        layout[cellKey] = {
          type: 'room',
          room: ROOM_TYPES.CORRIDOR,
          scrap: null,
          entity: null,
          trap: null
        };
        spiralCells.push({ x: currentX, y: currentY });
      } else {
        break;
      }
    }
  }
  
  return spiralCells;
};

// Get clockwise direction for spirals
export const getClockwiseDirection = (direction) => {
  const clockwise = {
    north: DIRECTIONS.EAST,
    east: DIRECTIONS.SOUTH,
    south: DIRECTIONS.WEST,
    west: DIRECTIONS.NORTH
  };
  return clockwise[direction.name] || DIRECTIONS.EAST;
};

// Generate asymmetrical maze-like hub
export const generateAsymmetricalHub = (centerX, centerY) => {
  const hubPositions = [{ x: centerX, y: centerY }];
  
  // Asymmetrical hub patterns
  const asymmetricalPatterns = [
    // L-shape
    [{ dx: 1, dy: 0 }, { dx: 0, dy: 1 }],
    // Small line
    [{ dx: -1, dy: 0 }, { dx: 1, dy: 0 }],
    // Offset cross
    [{ dx: 0, dy: -1 }, { dx: 1, dy: 0 }, { dx: 0, dy: 1 }],
    // Compact corner
    [{ dx: 1, dy: 0 }, { dx: 1, dy: 1 }, { dx: 0, dy: 1 }],
    // Single extension
    [{ dx: 0, dy: -1 }]
  ];
  
  const selectedPattern = asymmetricalPatterns[Math.floor(Math.random() * asymmetricalPatterns.length)];
  
  for (const offset of selectedPattern) {
    hubPositions.push({
      x: centerX + offset.dx,
      y: centerY + offset.dy
    });
  }
  
  return hubPositions;
};

// Enhanced main path network generation for maze-like asymmetrical layouts
export const generateMazePathNetwork = (layout) => {
  const allPathCells = new Set();
  const centerX = CENTER_POINT.x;
  const centerY = CENTER_POINT.y;
  
  // Create asymmetrical hub
  const hubPositions = generateAsymmetricalHub(centerX, centerY);
  hubPositions.forEach(pos => {
    if (pos.x >= 1 && pos.x < INTERIOR_GRID_SIZE - 1 && 
        pos.y >= 1 && pos.y < INTERIOR_GRID_SIZE - 1) {
      const cellKey = `${pos.x},${pos.y}`;
      layout[cellKey] = {
        type: 'room',
        room: ROOM_TYPES.HALLWAY,
        scrap: null,
        entity: null,
        trap: null
      };
      allPathCells.add(cellKey);
    }
  });
  
  // Generate asymmetrical main paths with varied counts
  const numberOfMainPaths = Math.floor(Math.random() * (PATH_CONFIG.MAX_PATHS_FROM_CENTER - PATH_CONFIG.MIN_PATHS_FROM_CENTER + 1)) + PATH_CONFIG.MIN_PATHS_FROM_CENTER;
  
  // Create asymmetrical starting directions (not evenly distributed)
  const startingDirections = generateAsymmetricalDirections(numberOfMainPaths);
  
  for (let i = 0; i < startingDirections.length; i++) {
    const startDirection = startingDirections[i];
    const startPos = findAsymmetricalStartPosition(hubPositions, startDirection);
    
    if (startPos) {
      // Generate maze path with enhanced features
      const pathCells = generateMazePath(layout, startPos.x, startPos.y, startDirection, null, 0);
      pathCells.forEach(cell => allPathCells.add(`${cell.x},${cell.y}`));
    }
  }
  
  // Add minimal cross-connections to maintain maze feel
  addMinimalCrossConnections(layout, allPathCells);
  
  // Add asymmetrical secondary branches
  addAsymmetricalSecondaryPaths(layout, allPathCells);
  
  // Validate and fix any isolation issues
  validateAndFixPaths(layout, allPathCells);

  return allPathCells;
};

// Generate asymmetrical direction distribution
export const generateAsymmetricalDirections = (numberOfPaths) => {
  const directions = [];
  
  // Weight directions asymmetrically
  const weightedDirections = [
    { dir: DIRECTIONS.NORTH, weight: Math.random() },
    { dir: DIRECTIONS.EAST, weight: Math.random() },
    { dir: DIRECTIONS.SOUTH, weight: Math.random() },
    { dir: DIRECTIONS.WEST, weight: Math.random() }
  ];
  
  // Sort by weight and select asymmetrically
  weightedDirections.sort((a, b) => b.weight - a.weight);
  
  // Take more from heavily weighted directions
  for (let i = 0; i < numberOfPaths; i++) {
    const index = i % weightedDirections.length;
    const selectedDir = weightedDirections[index].dir;
    
    // Add some randomness to the exact direction
    directions.push({
      ...selectedDir,
      // Small variation for more organic feel
      priority: Math.random()
    });
  }
  
  return directions;
};

// Find asymmetrical start position
export const findAsymmetricalStartPosition = (hubPositions, direction) => {
  // Prefer positions that are offset from center for asymmetry
  const weightedPositions = hubPositions.map(pos => ({
    pos,
    score: Math.random() + (Math.abs(pos.x - CENTER_POINT.x) + Math.abs(pos.y - CENTER_POINT.y)) * 0.3
  }));
  
  weightedPositions.sort((a, b) => b.score - a.score);
  return weightedPositions[0]?.pos || hubPositions[0];
};

// Add minimal cross-connections (fewer than before for maze feel)
export const addMinimalCrossConnections = (layout, pathCells) => {
  const pathArray = Array.from(pathCells).map(cellKey => {
    const [x, y] = cellKey.split(',').map(Number);
    return { x, y, cellKey };
  });
  
  // Very few connections to maintain maze complexity
  const numberOfConnections = Math.max(1, Math.floor(pathArray.length * 0.08));
  
  for (let i = 0; i < numberOfConnections; i++) {
    const startPath = pathArray[Math.floor(Math.random() * pathArray.length)];
    
    // Find distant paths for connections
    const distantPaths = pathArray.filter(p => {
      const distance = Math.abs(p.x - startPath.x) + Math.abs(p.y - startPath.y);
      return distance >= 5 && distance <= 10 && p !== startPath;
    });
    
    if (distantPaths.length > 0) {
      const targetPath = distantPaths[Math.floor(Math.random() * distantPaths.length)];
      createMazeConnection(layout, pathCells, startPath, targetPath);
    }
  }
};

// Create maze-style connection (more complex than L-shaped)
export const createMazeConnection = (layout, pathCells, start, end) => {
  let currentX = start.x;
  let currentY = start.y;
  const targetX = end.x;
  const targetY = end.y;
  
  // Create a more maze-like path with turns
  while (currentX !== targetX || currentY !== targetY) {
    const deltaX = targetX - currentX;
    const deltaY = targetY - currentY;
    
    // Introduce more turns for maze feel
    let moveX = false;
    let moveY = false;
    
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      moveX = Math.random() < 0.8; // Bias toward larger delta
      moveY = !moveX && deltaY !== 0;
    } else {
      moveY = Math.random() < 0.8;
      moveX = !moveY && deltaX !== 0;
    }
    
    // Add random turns for complexity
    if (Math.random() < 0.3) {
      moveX = !moveX;
      moveY = !moveY;
    }
    
    if (moveX && deltaX !== 0) {
      currentX += Math.sign(deltaX);
    }
    if (moveY && deltaY !== 0) {
      currentY += Math.sign(deltaY);
    }
    
    // Place corridor if valid and doesn't create loops
    if (currentX >= 1 && currentX < INTERIOR_GRID_SIZE - 1 && 
        currentY >= 1 && currentY < INTERIOR_GRID_SIZE - 1) {
      
      const cellKey = `${currentX},${currentY}`;
      const cell = layout[cellKey];
      
      if (cell && cell.type === 'wall' && !wouldCreateLoop(layout, currentX, currentY)) {
        layout[cellKey] = {
          type: 'room',
          room: ROOM_TYPES.HALLWAY,
          scrap: null,
          entity: null,
          trap: null
        };
        pathCells.add(cellKey);
      }
    }
  }
};

// Add asymmetrical secondary paths
export const addAsymmetricalSecondaryPaths = (layout, pathCells) => {
  
  const pathArray = Array.from(pathCells).map(cellKey => {
    const [x, y] = cellKey.split(',').map(Number);
    return { x, y, cellKey };
  });
  
  // More secondary paths for maze complexity
  const numberOfSecondaryPaths = Math.floor(pathArray.length * 0.25) + 2;
  
  for (let i = 0; i < numberOfSecondaryPaths; i++) {
    const startPath = pathArray[Math.floor(Math.random() * pathArray.length)];
    
    // Choose direction with asymmetrical bias
    const availableDirections = getAsymmetricalDirections(layout, startPath.x, startPath.y);
    
    if (availableDirections.length > 0) {
      const direction = availableDirections[Math.floor(Math.random() * availableDirections.length)];
      const secondaryLength = Math.floor(Math.random() * 5) + 2;
      
      // Generate secondary maze path
      const secondaryPath = generateMazePath(layout, startPath.x, startPath.y, direction, secondaryLength, 1);
      secondaryPath.forEach(cell => pathCells.add(`${cell.x},${cell.y}`));
    }
  }
};

// Enhanced validation for maze paths
export const validateAndFixPaths = (layout, pathCells) => {
  let fixedCount = 0;
  const pathArray = Array.from(pathCells);
  
  for (const cellKey of pathArray) {
    const [x, y] = cellKey.split(',').map(Number);
    const cell = layout[cellKey];
    
    if (cell && cell.type === 'room' && 
        (cell.room === ROOM_TYPES.CORRIDOR || cell.room === ROOM_TYPES.HALLWAY)) {
      
      // Check cardinal connections only
      const directions = [
        { dx: 0, dy: -1, name: 'north' },
        { dx: 1, dy: 0, name: 'east' },
        { dx: 0, dy: 1, name: 'south' },
        { dx: -1, dy: 0, name: 'west' }
      ];
      
      let connectionCount = 0;
      for (const dir of directions) {
        const adjX = x + dir.dx;
        const adjY = y + dir.dy;
        const adjKey = `${adjX},${adjY}`;
        const adjCell = layout[adjKey];
        
        if (adjCell && adjCell.type === 'room') {
          connectionCount++;
        }
      }
      
      // Keep dead ends (connectionCount === 1) as they're important for mazes
      // Only remove completely isolated cells (connectionCount === 0)
      if (connectionCount === 0) {
        layout[cellKey] = { type: 'wall' };
        pathCells.delete(cellKey);
        fixedCount++;
      }
    }
  }

  return fixedCount;
};

// Get opposite direction
export const getOppositeDirection = (direction) => {
  const opposites = {
    north: DIRECTIONS.SOUTH,
    south: DIRECTIONS.NORTH,
    east: DIRECTIONS.WEST,
    west: DIRECTIONS.EAST
  };
  return opposites[direction.name];
};

// Get count of adjacent walls (for determining room placement potential)
export const getAdjacentWallCount = (layout, x, y) => {
  let wallCount = 0;
  
  for (const direction of ALL_DIRECTIONS) {
    const adjX = x + direction.dx;
    const adjY = y + direction.dy;
    
    if (adjX >= 0 && adjX < INTERIOR_GRID_SIZE && adjY >= 0 && adjY < INTERIOR_GRID_SIZE) {
      const cellKey = `${adjX},${adjY}`;
      const cell = layout[cellKey];
      
      if (cell && cell.type === 'wall') {
        wallCount++;
      }
    }
  }
  
  return wallCount;
};

// Find staircase positions for maze layouts
export const findStaircasePositions = (layout, pathCells, numberOfStaircases) => {
  const pathArray = Array.from(pathCells).map(cellKey => {
    const [x, y] = cellKey.split(',').map(Number);
    return { x, y, cellKey };
  });
  
  // For maze layouts, prefer positions at dead ends or major junctions
  const goodPositions = pathArray.filter(pos => {
    const distanceFromCenter = Math.abs(pos.x - CENTER_POINT.x) + Math.abs(pos.y - CENTER_POINT.y);
    
    // Must be at least 3 cells from center
    if (distanceFromCenter < 3) return false;
    
    // Check if this is a dead end or junction
    let pathConnections = 0;
    const directions = [
      { dx: 0, dy: -1 }, { dx: 1, dy: 0 }, { dx: 0, dy: 1 }, { dx: -1, dy: 0 }
    ];
    
    for (const dir of directions) {
      const adjX = pos.x + dir.dx;
      const adjY = pos.y + dir.dy;
      const adjKey = `${adjX},${adjY}`;
      const adjCell = layout[adjKey];
      
      if (adjCell && adjCell.type === 'room') {
        pathConnections++;
      }
    }
    
    // Prefer dead ends (1 connection) or junctions (3+ connections)
    return pathConnections === 1 || pathConnections >= 3;
  });
  
  if (goodPositions.length === 0) {
    return [
      { x: 4, y: 4 },
      { x: 10, y: 10 },
      { x: 10, y: 4 }
    ].slice(0, numberOfStaircases);
  }
  
  // Select positions to maximize maze spread
  const selectedPositions = [];
  const minDistance = 5; // Larger minimum distance for maze layouts
  
  for (let i = 0; i < numberOfStaircases && goodPositions.length > 0; i++) {
    let bestPosition = null;
    let bestScore = -1;
    
    for (const pos of goodPositions) {
      let score = Math.random();
      
      // Prefer dead ends for maze feel
      let pathConnections = 0;
      const directions = [
        { dx: 0, dy: -1 }, { dx: 1, dy: 0 }, { dx: 0, dy: 1 }, { dx: -1, dy: 0 }
      ];
      
      for (const dir of directions) {
        const adjX = pos.x + dir.dx;
        const adjY = pos.y + dir.dy;
        const adjKey = `${adjX},${adjY}`;
        const adjCell = layout[adjKey];
        
        if (adjCell && adjCell.type === 'room') {
          pathConnections++;
        }
      }
      
      if (pathConnections === 1) score += 0.5; // Bonus for dead ends
      
      // Prefer positions far from existing staircases
      if (selectedPositions.length > 0) {
        const minDistToExisting = Math.min(...selectedPositions.map(existing => 
          Math.abs(pos.x - existing.x) + Math.abs(pos.y - existing.y)
        ));
        score += minDistToExisting * 0.3;
      }
      
      if (score > bestScore) {
        bestScore = score;
        bestPosition = pos;
      }
    }
    
    if (bestPosition) {
      selectedPositions.push(bestPosition);
      
      // Remove positions too close to the selected one
      goodPositions.splice(goodPositions.findIndex(p => p === bestPosition), 1);
      for (let j = goodPositions.length - 1; j >= 0; j--) {
        const distance = Math.abs(goodPositions[j].x - bestPosition.x) + Math.abs(goodPositions[j].y - bestPosition.y);
        if (distance < minDistance) {
          goodPositions.splice(j, 1);
        }
      }
    }
  }
  
  return selectedPositions;
};