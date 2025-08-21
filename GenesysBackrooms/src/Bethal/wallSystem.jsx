// wallSystem.jsx - Add walls to make grid more maze-like

import { ROOM_TYPES } from './indoorData.jsx';
import { INTERIOR_GRID_SIZE } from './pathGenerator.jsx';

// Wall types for different visual styles
export const WALL_TYPES = {
  SOLID: { symbol: '█', color: 'bg-gray-800', name: 'Solid Wall' },
  THICK: { symbol: '▉', color: 'bg-gray-700', name: 'Thick Wall' },
  MEDIUM: { symbol: '▊', color: 'bg-gray-600', name: 'Medium Wall' },
  THIN: { symbol: '▌', color: 'bg-gray-500', name: 'Thin Wall' },
  CORNER: { symbol: '▐', color: 'bg-gray-800', name: 'Corner Wall' }
};

// Directions for neighbor checking
const DIRECTIONS = {
  NORTH: { dx: 0, dy: -1, name: 'north' },
  SOUTH: { dx: 0, dy: 1, name: 'south' },
  EAST: { dx: 1, dy: 0, name: 'east' },
  WEST: { dx: -1, dy: 0, name: 'west' },
  NORTHEAST: { dx: 1, dy: -1, name: 'northeast' },
  NORTHWEST: { dx: -1, dy: -1, name: 'northwest' },
  SOUTHEAST: { dx: 1, dy: 1, name: 'southeast' },
  SOUTHWEST: { dx: -1, dy: 1, name: 'southwest' }
};

// Check if a cell should have a wall based on its neighbors
export const determineWallsForCell = (layout, x, y) => {
  const cellKey = `${x},${y}`;
  const cell = layout[cellKey];
  
  // Don't add walls to existing non-room cells or undefined cells
  if (!cell || cell.type !== 'room') {
    return null;
  }
  
  const walls = {
    north: false,
    south: false,
    east: false,
    west: false,
    hasWalls: false
  };
  
  // Check each cardinal direction
  Object.entries(DIRECTIONS).forEach(([dirName, dir]) => {
    if (['NORTH', 'SOUTH', 'EAST', 'WEST'].includes(dirName)) {
      const neighborX = x + dir.dx;
      const neighborY = y + dir.dy;
      const neighborKey = `${neighborX},${neighborY}`;
      const neighbor = layout[neighborKey];
      
      // Add wall if:
      // 1. Neighbor is outside grid bounds
      // 2. Neighbor doesn't exist in layout
      // 3. Neighbor is a different room type
      // 4. Neighbor is a wall cell
      const shouldHaveWall = (
        neighborX < 0 || neighborX >= INTERIOR_GRID_SIZE ||
        neighborY < 0 || neighborY >= INTERIOR_GRID_SIZE ||
        !neighbor ||
        neighbor.type === 'wall' ||
        (neighbor.type === 'room' && neighbor.room !== cell.room)
      );
      
      if (shouldHaveWall) {
        walls[dir.name] = true;
        walls.hasWalls = true;
      }
    }
  });
  
  return walls;
};

// Determine wall visual style based on wall configuration
export const getWallStyle = (walls) => {
  if (!walls || !walls.hasWalls) {
    return null;
  }
  
  const wallCount = [walls.north, walls.south, walls.east, walls.west].filter(Boolean).length;
  
  // Different styles based on number of walls
  switch (wallCount) {
    case 1:
      return WALL_TYPES.THIN;
    case 2:
      // Check if opposite walls (creates corridor effect)
      if ((walls.north && walls.south) || (walls.east && walls.west)) {
        return WALL_TYPES.MEDIUM;
      }
      // Adjacent walls (corner)
      return WALL_TYPES.CORNER;
    case 3:
      return WALL_TYPES.THICK;
    case 4:
      return WALL_TYPES.SOLID;
    default:
      return WALL_TYPES.MEDIUM;
  }
};

// Generate wall data for entire floor layout
export const generateWallsForFloor = (layout) => {
  const wallData = {};
  let wallsAdded = 0;
  
  // Process each cell in the grid
  for (let y = 0; y < INTERIOR_GRID_SIZE; y++) {
    for (let x = 0; x < INTERIOR_GRID_SIZE; x++) {
      const cellKey = `${x},${y}`;
      const walls = determineWallsForCell(layout, x, y);
      
      if (walls && walls.hasWalls) {
        wallData[cellKey] = {
          walls,
          style: getWallStyle(walls)
        };
        wallsAdded++;
      }
    }
  }
  return wallData;
};

// Enhanced cell renderer that includes wall visualization
export const renderCellWithWalls = (x, y, cell, isSelected, isCenter, wallData, originalCellContent) => {
  const cellKey = `${x},${y}`;
  const cellWalls = wallData[cellKey];
  
  // Base cell classes
  let cellClass = 'w-8 h-8 border border-gray-500 flex items-center justify-center text-sm font-bold relative cursor-pointer transition-all hover:scale-105 ';
  
  // If cell has walls, modify the appearance
  if (cellWalls && cellWalls.walls.hasWalls) {
    const wallStyle = cellWalls.style;
    
    // Add wall styling
    cellClass += `${wallStyle.color} text-gray-300 border-2 `;
    
    // Add specific border styles based on wall directions
    if (cellWalls.walls.north) cellClass += 'border-t-4 border-t-gray-900 ';
    if (cellWalls.walls.south) cellClass += 'border-b-4 border-b-gray-900 ';
    if (cellWalls.walls.east) cellClass += 'border-r-4 border-r-gray-900 ';
    if (cellWalls.walls.west) cellClass += 'border-l-4 border-l-gray-900 ';
    
    // Override content for walled cells
    const wallCount = [cellWalls.walls.north, cellWalls.walls.south, cellWalls.walls.east, cellWalls.walls.west].filter(Boolean).length;
    
    // Show different symbols based on wall configuration
    let wallSymbol = wallStyle.symbol;
    
    // Special symbols for specific wall patterns
    if (cellWalls.walls.north && cellWalls.walls.south && !cellWalls.walls.east && !cellWalls.walls.west) {
      wallSymbol = '║'; // Vertical corridor
    } else if (cellWalls.walls.east && cellWalls.walls.west && !cellWalls.walls.north && !cellWalls.walls.south) {
      wallSymbol = '═'; // Horizontal corridor
    } else if (wallCount === 3) {
      // T-junctions
      if (!cellWalls.walls.north) wallSymbol = '╦';
      else if (!cellWalls.walls.south) wallSymbol = '╩';
      else if (!cellWalls.walls.east) wallSymbol = '╠';
      else if (!cellWalls.walls.west) wallSymbol = '╣';
    } else if (wallCount === 2 && 
               ((cellWalls.walls.north && cellWalls.walls.east) ||
                (cellWalls.walls.east && cellWalls.walls.south) ||
                (cellWalls.walls.south && cellWalls.walls.west) ||
                (cellWalls.walls.west && cellWalls.walls.north))) {
      // Corner pieces
      if (cellWalls.walls.north && cellWalls.walls.east) wallSymbol = '╗';
      else if (cellWalls.walls.east && cellWalls.walls.south) wallSymbol = '╝';
      else if (cellWalls.walls.south && cellWalls.walls.west) wallSymbol = '╚';
      else if (cellWalls.walls.west && cellWalls.walls.north) wallSymbol = '╔';
    }
    
    return {
      cellClass,
      content: wallSymbol,
      hasWalls: true,
      wallInfo: cellWalls
    };
  }
  
  // No walls - return original cell styling
  return {
    cellClass: cellClass + (cell?.room?.color || 'bg-gray-100'),
    content: originalCellContent,
    hasWalls: false,
    wallInfo: null
  };
};

// Function to add walls to all floors
export const addWallsToAllFloors = (buildingData) => {
  if (!buildingData || !buildingData.floors) {
    return buildingData;
  }
  
  const enhancedFloors = { ...buildingData.floors };
  
  Object.entries(enhancedFloors).forEach(([floorNum, layout]) => {
    const wallData = generateWallsForFloor(layout);
    
    // Store wall data with the floor
    enhancedFloors[floorNum] = {
      ...layout,
      _wallData: wallData
    };
  });
  
  return {
    ...buildingData,
    floors: enhancedFloors
  };
};

// Helper function to get wall data for a floor
export const getWallDataForFloor = (floorLayout) => {
  return floorLayout._wallData || {};
};

// Wall configuration settings
export const WALL_CONFIG = {
  SHOW_WALL_BORDERS: true,
  USE_UNICODE_SYMBOLS: true,
  WALL_OPACITY: 0.9,
  HIGHLIGHT_CORNERS: true,
  SHOW_DOOR_OPENINGS: true
};

// Function to modify the existing renderGridCell to use walls
export const enhanceGridCellWithWalls = (renderGridCellFunction) => {
  return (x, y, currentFloorLayout, selectedCell, collectedScrap, triggeredTraps, handleCellClick, getCellTooltip) => {
    const cellKey = `${x},${y}`;
    const cell = currentFloorLayout[cellKey];
    const isSelected = selectedCell && selectedCell.x === x && selectedCell.y === y;
    const isCenter = x === CENTER_POINT.x && y === CENTER_POINT.y;
    
    // Get wall data for this floor
    const wallData = getWallDataForFloor(currentFloorLayout);
    
    // Get original cell rendering
    const originalCell = renderGridCellFunction(x, y);
    
    // If cell doesn't exist, return wall
    if (!cell) {
      return (
        <div
          key={cellKey}
          className="w-8 h-8 bg-gray-900 border border-gray-700 flex items-center justify-center text-gray-600"
          title="Boundary Wall"
        >
          ▓
        </div>
      );
    }
    
    // Apply wall rendering
    const wallRender = renderCellWithWalls(x, y, cell, isSelected, isCenter, wallData, originalCell?.props?.children || '');
    
    // Combine wall styling with original functionality
    return (
      <div
        key={cellKey}
        className={wallRender.cellClass + (isSelected ? ' ring-4 ring-blue-400 scale-110 z-10 ' : '')}
        onClick={() => handleCellClick(x, y)}
        title={getCellTooltip(cell, x, y) + (wallRender.hasWalls ? ' | Walled' : '')}
      >
        {wallRender.content}
        
        {/* Only show status indicators if not heavily walled */}
        {!wallRender.hasWalls && cell.type === 'room' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center space-y-0.5">
              {cell.scrap && !collectedScrap.has(cell.scrap.id) && (
                <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
              )}
              {cell.entity && !cell.entity.defeated && (
                <div className="w-1.5 h-1.5 rounded-full bg-orange-600"></div>
              )}
              {cell.trap && !triggeredTraps.has(cell.trap.id) && (
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
              )}
              {cell.door && (
                <div className={`w-1.5 h-1.5 rounded-full ${cell.door.passable ? 'bg-lime-400' : 'bg-red-600'}`}></div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };
};