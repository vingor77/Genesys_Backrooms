import { ROOM_TYPES } from './indoorData.jsx';

// FIXED: Manual entity spawning function for placing entities when they spawn from the main app
export const placeEntityInRandomRoom = (entity, floors, updateBuildingData) => {
  // Collect all spawnable rooms from all floors
  const allSpawnableRooms = [];
  
  Object.entries(floors).forEach(([floorNum, layout]) => {
    Object.entries(layout).forEach(([cellKey, cell]) => {
      if (cell.type === 'room' && cell.room && cell.room.entitySpawnChance > 0) {
        // ✅ EXCLUDE entrance and staircases AND infrastructure rooms
        const excludedRoomTypes = [
          ROOM_TYPES.HALLWAY,
          ROOM_TYPES.CORRIDOR,
          ROOM_TYPES.ENTRANCE, // ✅ NO ENTITIES IN ENTRANCE
          ROOM_TYPES.FIRE_EXIT,
          ROOM_TYPES.STAIRCASE_UP, // ✅ NO ENTITIES IN STAIRCASES
          ROOM_TYPES.STAIRCASE_DOWN, // ✅ NO ENTITIES IN STAIRCASES
          ROOM_TYPES.STAIRCASE_BOTH // ✅ NO ENTITIES IN STAIRCASES
        ];
        
        if (!excludedRoomTypes.includes(cell.room) && !cell.entity) {
          allSpawnableRooms.push({
            floorNum: parseInt(floorNum),
            cellKey,
            cell,
            room: cell.room,
            entitySpawnChance: cell.room.entitySpawnChance
          });
        }
      }
    });
  });
  
  if (allSpawnableRooms.length === 0) {
    return false;
  }
  
  // Use weighted selection based on room entity spawn chance
  const totalWeight = allSpawnableRooms.reduce((sum, roomData) => sum + roomData.entitySpawnChance, 0);
  let randomWeight = Math.random() * totalWeight;
  let selectedRoom = null;
  
  for (const roomData of allSpawnableRooms) {
    randomWeight -= roomData.entitySpawnChance;
    if (randomWeight <= 0) {
      selectedRoom = roomData;
      break;
    }
  }
  
  if (selectedRoom) {
    // Generate enhanced entity with location info
    const enhancedEntity = {
      ...entity,
      dangerous: entity.dangerous === true, // Ensure boolean conversion
      location: {
        roomName: selectedRoom.room.name,
        floor: selectedRoom.floorNum,
        displayName: `${selectedRoom.room.name} (Floor ${selectedRoom.floorNum})`
      }
    };
    
    // ✅ FIX: Use the callback approach to update building data properly
    updateBuildingData(prevBuildingData => {
      // Create new floors object
      const newFloors = {};
      
      // Copy all floors immutably
      Object.keys(prevBuildingData.floors).forEach(floorKey => {
        if (parseInt(floorKey) === selectedRoom.floorNum) {
          // For the target floor, create new layout
          const newLayout = {};
          
          Object.keys(prevBuildingData.floors[floorKey]).forEach(cellKey => {
            if (cellKey === selectedRoom.cellKey) {
              // For the target cell, create new cell with entity
              newLayout[cellKey] = {
                ...prevBuildingData.floors[floorKey][cellKey],
                entity: enhancedEntity
              };
            } else {
              // For other cells, copy as-is
              newLayout[cellKey] = { ...prevBuildingData.floors[floorKey][cellKey] };
            }
          });
          
          newFloors[floorKey] = newLayout;
        } else {
          // For other floors, create new layout but copy cells
          const newLayout = {};
          Object.keys(prevBuildingData.floors[floorKey]).forEach(cellKey => {
            newLayout[cellKey] = { ...prevBuildingData.floors[floorKey][cellKey] };
          });
          newFloors[floorKey] = newLayout;
        }
      });
      
      // Return complete building data with updated floors
      return {
        ...prevBuildingData,
        floors: newFloors
      };
    });
    return true;
  }

  return false;
};