import { DOOR_TYPES, ROOM_TYPES } from './indoorData.jsx';

// NEW: Generate random door with proper state logic
export const generateRandomDoor = (roomType) => {
  let doorType;
  
  // Determine base door type based on room importance
  if (roomType === ROOM_TYPES.VAULT || roomType === ROOM_TYPES.SECURITY) {
    // High security rooms: prefer secure doors
    doorType = Math.random() < 0.8 ? 'secure' : 'locked';
  } else if (roomType === ROOM_TYPES.LABORATORY || roomType === ROOM_TYPES.MACHINERY) {
    // Medium security rooms: mix of secure and regular
    const rand = Math.random();
    if (rand < 0.4) doorType = 'secure';
    else if (rand < 0.7) doorType = 'locked';
    else doorType = 'regular';
  } else {
    // Regular rooms: mostly regular doors
    const rand = Math.random();
    if (rand < 0.1) doorType = 'secure';
    else if (rand < 0.3) doorType = 'locked';
    else doorType = 'regular';
  }
  
  // Generate door state based on type
  let selectedDoor;
  if (doorType === 'secure') {
    // Secure doors: randomly open or closed
    selectedDoor = Math.random() < 0.3 ? DOOR_TYPES.SECURE_OPEN : DOOR_TYPES.SECURE_CLOSED;
  } else if (doorType === 'locked') {
    // Locked doors: always start closed/locked
    selectedDoor = DOOR_TYPES.LOCKED;
  } else {
    // Regular doors: randomly open or closed
    selectedDoor = Math.random() < 0.6 ? DOOR_TYPES.OPEN : DOOR_TYPES.CLOSED;
  }

  return selectedDoor;
};

// NEW: Distribute doors across all floors like scrap
export const distributeDoorsAcrossFloors = (allFloors) => {
  // Collect all eligible rooms from all floors
  const allEligibleRooms = [];
  
  Object.entries(allFloors).forEach(([floorNum, layout]) => {
    Object.entries(layout).forEach(([cellKey, cell]) => {
      if (cell.type === 'room' && cell.room && cell.room.doorChance && cell.room.doorChance > 0) {
        allEligibleRooms.push({
          floorNum: parseInt(floorNum),
          cellKey,
          cell,
          room: cell.room,
          doorChance: cell.room.doorChance
        });
      }
    });
  });
  
  if (allEligibleRooms.length === 0) {
    return;
  }
  
  // Place doors using weighted selection
  let doorsPlaced = 0;
  
  for (const roomData of allEligibleRooms) {
    // Roll for door placement
    if (Math.random() < roomData.doorChance) {
      const door = generateRandomDoor(roomData.room);
      if (door) {
        // Place door in the cell
        roomData.cell.door = door;
        doorsPlaced++;
      }
    }
  }
  
  // Count doors per floor
  const doorsPerFloor = {};
  Object.entries(allFloors).forEach(([floorNum, layout]) => {
    const floorDoorCount = Object.values(layout).filter(cell => cell.door).length;
    doorsPerFloor[floorNum] = floorDoorCount;
  });
};

// Handle door interactions with proper button actions
export const handleDoorAction = (door, cellKey, action, playerKeycards, setPlayerKeycards, setFloors, currentFloor) => {
  if (!door) return { success: false, message: 'No door found' };

  let newDoorType = door;
  let actionSuccess = true;
  let message = '';
  let newKeycardCount = playerKeycards;

  switch (action) {
    case 'open':
      if (door === DOOR_TYPES.CLOSED) {
        newDoorType = DOOR_TYPES.OPEN;
        message = 'Door opened';
      } else if (door === DOOR_TYPES.LOCKED) {
        if (playerKeycards > 0) {
          newDoorType = DOOR_TYPES.OPEN;
          newKeycardCount = playerKeycards - 1;
          message = 'Locked door opened with keycard';
        } else {
          actionSuccess = false;
          message = 'Need keycard to open locked door';
        }
      } else if (door === DOOR_TYPES.SECURE_CLOSED) {
        if (playerKeycards > 0) {
          newDoorType = DOOR_TYPES.SECURE_OPEN;
          message = 'Secure door opened with keycard';
        } else {
          actionSuccess = false;
          message = 'Need keycard to open secure door';
        }
      } else {
        actionSuccess = false;
        message = 'Door is already open';
      }
      break;

    case 'close':
      if (door === DOOR_TYPES.OPEN) {
        newDoorType = DOOR_TYPES.CLOSED;
        message = 'Door closed';
      } else if (door === DOOR_TYPES.SECURE_OPEN) {
        newDoorType = DOOR_TYPES.SECURE_CLOSED;
        message = 'Secure door closed';
      } else {
        actionSuccess = false;
        message = 'Door is already closed or locked';
      }
      break;

    case 'lock':
      if (door === DOOR_TYPES.CLOSED) {
        newDoorType = DOOR_TYPES.LOCKED;
        message = 'Door locked';
      } else if (door === DOOR_TYPES.OPEN) {
        newDoorType = DOOR_TYPES.LOCKED;
        message = 'Door closed and locked';
      } else {
        actionSuccess = false;
        message = 'Cannot lock this door type';
      }
      break;

    case 'unlock':
      if (door === DOOR_TYPES.LOCKED) {
        if (playerKeycards > 0) {
          newDoorType = DOOR_TYPES.CLOSED;
          newKeycardCount = playerKeycards - 1;
          message = 'Door unlocked with keycard';
        } else {
          actionSuccess = false;
          message = 'Need keycard to unlock door';
        }
      } else {
        actionSuccess = false;
        message = 'Door is not locked';
      }
      break;

    default:
      actionSuccess = false;
      message = 'Invalid action';
  }

  if (actionSuccess) {
    // Update keycard count if changed
    if (newKeycardCount !== playerKeycards) {
      setPlayerKeycards(newKeycardCount);
    }
    
    // Update the door in the floor layout
    setFloors(prev => ({
      ...prev,
      [currentFloor]: {
        ...prev[currentFloor],
        [cellKey]: {
          ...prev[currentFloor][cellKey],
          door: newDoorType
        }
      }
    }));
  }
  
  return { success: actionSuccess, message };
};