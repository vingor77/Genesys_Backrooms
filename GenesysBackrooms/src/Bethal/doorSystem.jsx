// Enhanced doorSystem.jsx - Fixed door interaction logic

import { ROOM_TYPES, DOOR_TYPES } from './indoorData.jsx';
import { INTERIOR_GRID_SIZE } from './pathGenerator.jsx';

// Door placement configuration
export const DOOR_CONFIG = {
  MAX_DOORS_PER_ROOM: 2,
  MIN_ROOM_SIZE_FOR_MULTIPLE_DOORS: 4,
  DOOR_SPACING_MINIMUM: 2,
  SECURITY_DOOR_CHANCE: 0.15,
  LOCKED_DOOR_CHANCE: 0.25
};

// Room types that should have security doors
const SECURITY_ROOM_TYPES = [
  ROOM_TYPES.VAULT,
  ROOM_TYPES.SECURITY,
  ROOM_TYPES.LABORATORY
];

// Room types that rarely get doors
const LOW_DOOR_PRIORITY_ROOMS = [
  ROOM_TYPES.HALLWAY,
  ROOM_TYPES.CORRIDOR,
  ROOM_TYPES.ENTRANCE,
  ROOM_TYPES.FIRE_EXIT
];

// Check if door is a secure door type
export const isSecureDoor = (doorType) => {
  return doorType === DOOR_TYPES.SECURE_OPEN || 
         doorType === DOOR_TYPES.SECURE_CLOSED;
};

// Enhanced door interaction handler without keycard system
export const handleDoorInteraction = (door, cellKey, action) => {
  let newDoorType = door;
  let success = false;
  let message = '';
  
  // Helper function to check door types by comparing properties
  const isDoorType = (doorToCheck, targetType) => {
    return doorToCheck.name === targetType.name && 
           doorToCheck.passable === targetType.passable;
  };
  
  switch (action) {
    case 'open':
      if (isDoorType(door, DOOR_TYPES.CLOSED)) {
        newDoorType = { ...DOOR_TYPES.OPEN, side: door.side, connectsTo: door.connectsTo, id: door.id };
        success = true;
        message = 'Door opened';
      } else if (isDoorType(door, DOOR_TYPES.SECURE_CLOSED)) {
        newDoorType = { ...DOOR_TYPES.SECURE_OPEN, side: door.side, connectsTo: door.connectsTo, id: door.id };
        success = true;
        message = 'Secure door opened';
      } else if (isDoorType(door, DOOR_TYPES.LOCKED)) {
        newDoorType = { ...DOOR_TYPES.OPEN, side: door.side, connectsTo: door.connectsTo, id: door.id };
        success = true;
        message = 'Locked door opened';
      } else {
        message = 'Door is already open';
      }
      break;
      
    case 'close':
      if (isDoorType(door, DOOR_TYPES.OPEN)) {
        newDoorType = { ...DOOR_TYPES.CLOSED, side: door.side, connectsTo: door.connectsTo, id: door.id };
        success = true;
        message = 'Door closed';
      } else if (isDoorType(door, DOOR_TYPES.SECURE_OPEN)) {
        newDoorType = { ...DOOR_TYPES.SECURE_CLOSED, side: door.side, connectsTo: door.connectsTo, id: door.id };
        success = true;
        message = 'Secure door closed';
      } else {
        message = 'Door is already closed or locked';
      }
      break;
      
    case 'lock':
      // Only allow locking non-secure doors
      if (isSecureDoor(door)) {
        message = 'Cannot manually lock secure doors';
      } else if (isDoorType(door, DOOR_TYPES.CLOSED)) {
        newDoorType = { ...DOOR_TYPES.LOCKED, side: door.side, connectsTo: door.connectsTo, id: door.id };
        success = true;
        message = 'Door locked';
      } else if (isDoorType(door, DOOR_TYPES.OPEN)) {
        // Close and lock in one action
        newDoorType = { ...DOOR_TYPES.LOCKED, side: door.side, connectsTo: door.connectsTo, id: door.id };
        success = true;
        message = 'Door closed and locked';
      } else if (isDoorType(door, DOOR_TYPES.LOCKED)) {
        message = 'Door is already locked';
      } else {
        message = 'Cannot lock this door type';
      }
      break;
      
    case 'unlock':
      // Only allow unlocking non-secure doors
      if (isSecureDoor(door)) {
        message = 'Secure doors cannot be manually unlocked';
      } else if (isDoorType(door, DOOR_TYPES.LOCKED)) {
        newDoorType = { ...DOOR_TYPES.CLOSED, side: door.side, connectsTo: door.connectsTo, id: door.id };
        success = true;
        message = 'Door unlocked (now closed)';
      } else {
        message = 'Door is not locked';
      }
      break;
      
    default:
      message = 'Invalid door action';
  }
  
  return {
    newDoorType,
    success,
    message
  };
};

// Get available actions for a door (no keycard requirements)
export const getAvailableActions = (door) => {
  const actions = [];
  
  if (!door) return actions;
  
  // Helper function to check door types by comparing properties
  const isDoorType = (doorToCheck, targetType) => {
    return doorToCheck.name === targetType.name && 
           doorToCheck.passable === targetType.passable;
  };
  
  // Open actions - all doors can be opened manually
  if (isDoorType(door, DOOR_TYPES.CLOSED)) {
    actions.push({ action: 'open', label: 'Open', enabled: true, color: 'green' });
  } else if (isDoorType(door, DOOR_TYPES.SECURE_CLOSED)) {
    actions.push({ action: 'open', label: 'Open', enabled: true, color: 'green' });
  } else if (isDoorType(door, DOOR_TYPES.LOCKED)) {
    actions.push({ action: 'open', label: 'Open', enabled: true, color: 'green' });
  }
  
  // Close actions
  if (isDoorType(door, DOOR_TYPES.OPEN) || isDoorType(door, DOOR_TYPES.SECURE_OPEN)) {
    actions.push({ action: 'close', label: 'Close', enabled: true, color: 'blue' });
  }
  
  // Lock actions (only for non-secure doors)
  if (!isSecureDoor(door)) {
    if (isDoorType(door, DOOR_TYPES.CLOSED) || isDoorType(door, DOOR_TYPES.OPEN)) {
      actions.push({ action: 'lock', label: 'Lock', enabled: true, color: 'orange' });
    }
    
    // Unlock actions (only for non-secure doors)
    if (isDoorType(door, DOOR_TYPES.LOCKED)) {
      actions.push({ action: 'unlock', label: 'Unlock', enabled: true, color: 'purple' });
    }
  }
  
  return actions;
};

// Identify all multi-cell rooms in the layout
export const identifyMultiCellRooms = (layout) => {
  const processedCells = new Set();
  const roomGroups = [];
  
  Object.entries(layout).forEach(([cellKey, cell]) => {
    if (processedCells.has(cellKey) || cell.type !== 'room' || !cell.room) {
      return;
    }
    
    // Skip infrastructure rooms
    if (LOW_DOOR_PRIORITY_ROOMS.includes(cell.room)) {
      processedCells.add(cellKey);
      return;
    }
    
    // Find all connected cells of the same room type
    const roomCells = findConnectedRoomCells(layout, cellKey, cell.room, processedCells);
    
    if (roomCells.length > 0) {
      roomGroups.push({
        roomType: cell.room,
        cells: roomCells,
        size: roomCells.length
      });
    }
  });
  return roomGroups;
};

// Find all cells belonging to the same room
export const findConnectedRoomCells = (layout, startKey, roomType, processedCells) => {
  const visited = new Set();
  const stack = [startKey];
  const roomCells = [];
  
  while (stack.length > 0) {
    const currentKey = stack.pop();
    
    if (visited.has(currentKey) || processedCells.has(currentKey)) {
      continue;
    }
    
    const cell = layout[currentKey];
    if (!cell || cell.type !== 'room' || cell.room !== roomType) {
      continue;
    }
    
    visited.add(currentKey);
    processedCells.add(currentKey);
    roomCells.push(currentKey);
    
    // Check adjacent cells
    const [x, y] = currentKey.split(',').map(Number);
    const adjacentKeys = [
      `${x-1},${y}`, `${x+1},${y}`, `${x},${y-1}`, `${x},${y+1}`
    ];
    
    for (const adjKey of adjacentKeys) {
      if (!visited.has(adjKey) && !processedCells.has(adjKey)) {
        stack.push(adjKey);
      }
    }
  }
  
  return roomCells;
};

// Find optimal door placement positions for a room
export const findDoorPositionsForRoom = (layout, roomGroup) => {
  const potentialDoors = [];
  
  for (const cellKey of roomGroup.cells) {
    const [x, y] = cellKey.split(',').map(Number);
    
    // Check all four directions
    const directions = [
      { dx: 0, dy: -1, name: 'north', opposite: 'south' },
      { dx: 1, dy: 0, name: 'east', opposite: 'west' },
      { dx: 0, dy: 1, name: 'south', opposite: 'north' },
      { dx: -1, dy: 0, name: 'west', opposite: 'east' }
    ];
    
    for (const dir of directions) {
      const adjX = x + dir.dx;
      const adjY = y + dir.dy;
      const adjKey = `${adjX},${adjY}`;
      const adjCell = layout[adjKey];
      
      // Check if adjacent cell is a path (corridor/hallway)
      if (adjCell && adjCell.type === 'room' && 
          (adjCell.room === ROOM_TYPES.CORRIDOR || adjCell.room === ROOM_TYPES.HALLWAY)) {
        
        potentialDoors.push({
          roomCell: cellKey,
          roomX: x,
          roomY: y,
          pathCell: adjKey,
          pathX: adjX,
          pathY: adjY,
          direction: dir.name,
          opposite: dir.opposite,
          priority: calculateDoorPriority(layout, x, y, dir, roomGroup)
        });
      }
    }
  }
  
  return potentialDoors;
};

// Calculate priority score for door placement
export const calculateDoorPriority = (layout, x, y, direction, roomGroup) => {
  let priority = 0;
  
  // Higher priority for room edges
  if (isRoomEdgeCell(layout, x, y, roomGroup.roomType)) {
    priority += 5;
  }
  
  // Lower priority if there are nearby doors
  const nearbyDoors = countNearbyDoors(layout, x, y, 3);
  priority -= nearbyDoors * 2;
  
  // Prefer certain directions based on room type
  if (roomGroup.roomType === ROOM_TYPES.OFFICE && direction.name === 'south') {
    priority += 2;
  }
  
  if (roomGroup.roomType === ROOM_TYPES.STORAGE && direction.name === 'north') {
    priority += 1;
  }
  
  // Random factor to prevent too much predictability
  priority += Math.random() * 2;
  
  return priority;
};

// Check if a cell is on the edge of its room
export const isRoomEdgeCell = (layout, x, y, roomType) => {
  const directions = [
    { dx: 0, dy: -1 }, { dx: 1, dy: 0 }, { dx: 0, dy: 1 }, { dx: -1, dy: 0 }
  ];
  
  for (const dir of directions) {
    const adjX = x + dir.dx;
    const adjY = y + dir.dy;
    const adjKey = `${adjX},${adjY}`;
    const adjCell = layout[adjKey];
    
    // If adjacent cell is not the same room type, this is an edge
    if (!adjCell || adjCell.type !== 'room' || adjCell.room !== roomType) {
      return true;
    }
  }
  
  return false;
};

// Count doors within a radius
export const countNearbyDoors = (layout, x, y, radius) => {
  let count = 0;
  
  for (let dy = -radius; dy <= radius; dy++) {
    for (let dx = -radius; dx <= radius; dx++) {
      if (dx === 0 && dy === 0) continue;
      
      const checkKey = `${x + dx},${y + dy}`;
      const cell = layout[checkKey];
      
      if (cell && cell.door) {
        count++;
      }
    }
  }
  
  return count;
};

// Select optimal door placements for a room
export const selectOptimalDoorPlacements = (potentialDoors, roomGroup) => {
  if (potentialDoors.length === 0) return [];
  
  // Sort by priority
  potentialDoors.sort((a, b) => b.priority - a.priority);
  
  // Determine number of doors based on room size
  let maxDoors = 1;
  if (roomGroup.size >= DOOR_CONFIG.MIN_ROOM_SIZE_FOR_MULTIPLE_DOORS) {
    maxDoors = Math.min(DOOR_CONFIG.MAX_DOORS_PER_ROOM, Math.floor(roomGroup.size / 3));
  }
  
  const selectedDoors = [];
  
  for (let i = 0; i < potentialDoors.length && selectedDoors.length < maxDoors; i++) {
    const door = potentialDoors[i];
    
    // Check if this door is too close to already selected doors
    const tooClose = selectedDoors.some(selected => {
      const distance = Math.abs(door.roomX - selected.roomX) + Math.abs(door.roomY - selected.roomY);
      return distance < DOOR_CONFIG.DOOR_SPACING_MINIMUM;
    });
    
    if (!tooClose) {
      selectedDoors.push(door);
    }
  }
  
  return selectedDoors;
};

// Determine door type based on room type and random factors
export const determineDoorType = (roomType) => {
  // Security rooms get security doors
  if (SECURITY_ROOM_TYPES.includes(roomType)) {
    return Math.random() < 0.7 ? DOOR_TYPES.SECURE_CLOSED : DOOR_TYPES.LOCKED;
  }
  
  // Laboratory and machinery rooms often get security doors
  if (roomType === ROOM_TYPES.MACHINERY || roomType === ROOM_TYPES.LABORATORY) {
    if (Math.random() < DOOR_CONFIG.SECURITY_DOOR_CHANCE) {
      return DOOR_TYPES.SECURE_CLOSED;
    }
  }
  
  // Regular rooms get normal doors
  const random = Math.random();
  
  if (random < DOOR_CONFIG.LOCKED_DOOR_CHANCE) {
    return DOOR_TYPES.LOCKED;
  } else if (random < DOOR_CONFIG.LOCKED_DOOR_CHANCE + 0.4) {
    return DOOR_TYPES.CLOSED;
  } else {
    return DOOR_TYPES.OPEN;
  }
};

// Place a door between room and path cells
export const placeDoor = (layout, doorPlacement, roomGroup) => {
  const doorType = determineDoorType(roomGroup.roomType);
  const doorId = `door_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  // Create door objects for both cells
  const roomDoor = {
    ...doorType,
    side: doorPlacement.direction,
    connectsTo: doorPlacement.pathCell,
    id: doorId
  };
  
  const pathDoor = {
    ...doorType,
    side: doorPlacement.opposite,
    connectsTo: doorPlacement.roomCell,
    id: doorId
  };
  
  // Place doors
  layout[doorPlacement.roomCell].door = roomDoor;
  layout[doorPlacement.pathCell].door = pathDoor;
  
  return doorId;
};

// Main door distribution function for all floors
export const distributeDoorsAcrossFloors = (floors) => {
  let totalDoorsPlaced = 0;
  
  Object.entries(floors).forEach(([floorNum, layout]) => {
    const roomGroups = identifyMultiCellRooms(layout);
    let floorDoorsPlaced = 0;
    
    for (const roomGroup of roomGroups) {
      const potentialDoors = findDoorPositionsForRoom(layout, roomGroup);
      const selectedDoors = selectOptimalDoorPlacements(potentialDoors, roomGroup);
      
      for (const doorPlacement of selectedDoors) {
        placeDoor(layout, doorPlacement, roomGroup);
        floorDoorsPlaced++;
        totalDoorsPlaced++;
      }
    }
  });
  
  return totalDoorsPlaced;
};