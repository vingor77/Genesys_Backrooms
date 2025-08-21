// === NEW: entityManager.jsx ===
// This will handle all entity logic and be imported by both components

import { ROOM_TYPES } from './indoorData.jsx';
import { moons } from './moonData.jsx';
import { 
  getMoonPowerLimits, 
  getEntityPowerLevel,
  calculateCurrentPower
} from './entityPowerSystem.jsx';

export class EntityManager {
  constructor() {
    this.entities = new Map(); // id -> entity data
    this.listeners = new Set(); // callbacks for entity changes
  }

  // Subscribe to entity changes
  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  // Notify all listeners of changes
  notify() {
    this.listeners.forEach(callback => callback());
  }

  // Add entity to system
  addEntity(entity) {
    this.entities.set(entity.id, entity);
    this.notify();
  }

  // Remove entity from system
  removeEntity(entityId) {
    const entity = this.entities.get(entityId);
    if (entity) {
      this.entities.delete(entityId);
      this.notify();
      return entity;
    }
    return null;
  }

  // Get all entities of a specific type
  getEntitiesByType(type) {
    return Array.from(this.entities.values()).filter(e => e.type === type);
  }

  // Get all entities
  getAllEntities() {
    return Array.from(this.entities.values());
  }

  // Get entity by ID
  getEntity(entityId) {
    return this.entities.get(entityId);
  }

  // Check if entity exists
  hasEntity(entityId) {
    return this.entities.has(entityId);
  }

  // Get current power usage by type
  getCurrentPower(type) {
    const entities = this.getEntitiesByType(type);
    return calculateCurrentPower(entities);
  }

  // Get entities placed in grid
  getPlacedEntities(floors) {
    const placedEntities = [];
    Object.values(floors).forEach(layout => {
      Object.values(layout).forEach(cell => {
        if (cell.entity) {
          placedEntities.push(cell.entity);
        }
      });
    });
    return placedEntities;
  }

  // Get entities needing placement
  getEntitiesNeedingPlacement(floors) {
    const placedEntityIds = new Set();
    Object.values(floors).forEach(layout => {
      Object.values(layout).forEach(cell => {
        if (cell.entity) {
          placedEntityIds.add(cell.entity.id);
        }
      });
    });

    return Array.from(this.entities.values()).filter(entity => 
      !placedEntityIds.has(entity.id)
    );
  }

  // Weighted entity selection
  selectEntityByWeight(entities) {
    if (entities.length === 0) return null;
    if (entities.length === 1) return entities[0];

    const totalWeight = entities.reduce((sum, entity) => sum + (entity.spawnChance || 1), 0);
    let randomWeight = Math.random() * totalWeight;

    for (const entity of entities) {
      const weight = entity.spawnChance || 1;
      randomWeight -= weight;
      if (randomWeight <= 0) {
        return entity;
      }
    }

    return entities[0];
  }

  // Spawn new entity
  spawnEntity(entityType, selectedMoon, spawnLocation, currentRound, options = {}) {
    const moon = moons.find(m => m.name === selectedMoon);
    if (!moon) return null;

    // Extract options
    const { preferredFloor, addAlert } = options;

    let availableEntities = [];
    switch (entityType) {
      case 'indoor':
        availableEntities = moon.indoorEntities || [];
        break;
      case 'outdoor':
        availableEntities = moon.outdoorEntities || [];
        break;
      case 'daytime':
        availableEntities = moon.daytimeEntities || [];
        break;
      default:
        return null;
    }

    if (availableEntities.length === 0) return null;

    // Check power limits
    const powerLimits = getMoonPowerLimits(selectedMoon);
    const currentEntities = this.getEntitiesByType(entityType);
    const currentPower = calculateCurrentPower(currentEntities);

    let maxPower;
    switch (entityType) {
      case 'indoor':
        maxPower = powerLimits.maxIndoorPower;
        break;
      case 'outdoor':
        maxPower = powerLimits.maxOutdoorPower;
        break;
      case 'daytime':
        maxPower = powerLimits.maxDaytimePower;
        break;
    }

    // Filter spawnable entities
    const spawnableEntities = availableEntities.filter(entity => {
      const entityPower = getEntityPowerLevel(entity.name);
      const powerCheck = (currentPower + entityPower) <= maxPower;

      const currentCount = currentEntities.filter(e => e.name === entity.name).length;
      const maxCount = entity.maxCount || 1;
      const countCheck = currentCount < maxCount;

      return powerCheck && countCheck;
    });

    // Return null if no spawnable entities
    if (spawnableEntities.length === 0) {
      return null;
    }

    // Select and create entity
    const selectedEntity = this.selectEntityByWeight(spawnableEntities);
    const entityPower = getEntityPowerLevel(selectedEntity.name);

    const newEntity = {
      id: `entity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: selectedEntity.name,
      powerLevel: entityPower,
      maxCount: selectedEntity.maxCount,
      dangerous: selectedEntity.dangerous,
      spawnChance: selectedEntity.spawnChance,
      type: entityType,
      spawnLocation,
      spawnRound: currentRound,
      isActive: true,
      isPlaced: entityType !== 'indoor',
      preferredFloor: preferredFloor, // Store the preferred floor
      location: entityType !== 'indoor' ? {
        displayName: spawnLocation,
        area: entityType
      } : null
    };

    this.addEntity(newEntity);
    return newEntity;
  };

  // Place entity in random room
  placeEntityInRandomRoom(entity, floors, setBuildingData, onPlacementComplete = null) {
    const allSpawnableRooms = [];

    Object.entries(floors).forEach(([floorNum, layout]) => {
      const currentFloor = parseInt(floorNum);

      // If entity has a preferred floor, only consider that floor
      if (entity.preferredFloor !== undefined && entity.preferredFloor !== currentFloor) {
        return; // Skip this floor entirely
      }

      Object.entries(layout).forEach(([cellKey, cell]) => {
        if (cell.type === 'room' && cell.room && cell.room.entitySpawnChance > 0) {
          const excludedRoomTypes = [
            ROOM_TYPES.HALLWAY,
            ROOM_TYPES.CORRIDOR,
            ROOM_TYPES.ENTRANCE,
            ROOM_TYPES.FIRE_EXIT,
            ROOM_TYPES.STAIRCASE_UP,
            ROOM_TYPES.STAIRCASE_DOWN,
            ROOM_TYPES.STAIRCASE_BOTH
          ];

          if (!excludedRoomTypes.includes(cell.room) && !cell.entity) {
            allSpawnableRooms.push({
              floorNum: currentFloor,
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

    // Use weighted selection
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
      // Enhanced entity with location
      const enhancedEntity = {
        ...entity,
        location: {
          roomName: selectedRoom.room.name,
          floor: selectedRoom.floorNum,
          displayName: `${selectedRoom.room.name} (Floor ${selectedRoom.floorNum})`
        }
      };

      // Update building data
      setBuildingData(prevBuildingData => {
        const newFloors = {};

        Object.keys(prevBuildingData.floors).forEach(floorKey => {
          if (parseInt(floorKey) === selectedRoom.floorNum) {
            const newLayout = {};

            Object.keys(prevBuildingData.floors[floorKey]).forEach(cellKey => {
              if (cellKey === selectedRoom.cellKey) {
                newLayout[cellKey] = {
                  ...prevBuildingData.floors[floorKey][cellKey],
                  entity: enhancedEntity
                };
              } else {
                newLayout[cellKey] = { ...prevBuildingData.floors[floorKey][cellKey] };
              }
            });

            newFloors[floorKey] = newLayout;
          } else {
            const newLayout = {};
            Object.keys(prevBuildingData.floors[floorKey]).forEach(cellKey => {
              newLayout[cellKey] = { ...prevBuildingData.floors[floorKey][cellKey] };
            });
            newFloors[floorKey] = newLayout;
          }
        });

        return {
          ...prevBuildingData,
          floors: newFloors
        };
      });

      // Call the placement complete callback with location info
      if (onPlacementComplete) {
        onPlacementComplete({
          entityId: entity.id,
          entityName: entity.name,
          roomName: selectedRoom.room.name,
          floor: selectedRoom.floorNum,
          displayName: `${selectedRoom.room.name} (Floor ${selectedRoom.floorNum})`
        });
      }

      return true;
    }

    return false;
  };

  // Get power status for all types
  getPowerStatus(selectedMoon) {
    if (!selectedMoon) {
      return { 
        indoor: { current: 0, max: 0, percentage: 0, entities: [] }, 
        outdoor: { current: 0, max: 0, percentage: 0, entities: [] }, 
        daytime: { current: 0, max: 0, percentage: 0, entities: [] } 
      };
    }

    const powerLimits = getMoonPowerLimits(selectedMoon);
    const result = {};

    ['indoor', 'outdoor', 'daytime'].forEach(type => {
      const entities = this.getEntitiesByType(type);
      const current = calculateCurrentPower(entities);
      let max;
      
      switch (type) {
        case 'indoor':
          max = powerLimits.maxIndoorPower;
          break;
        case 'outdoor':
          max = powerLimits.maxOutdoorPower;
          break;
        case 'daytime':
          max = powerLimits.maxDaytimePower;
          break;
      }

      result[type] = {
        current,
        max,
        percentage: max > 0 ? (current / max) * 100 : 0,
        entities
      };
    });

    return result;
  }

  // Clear all entities
  clear() {
    this.entities.clear();
    this.notify();
  }
}

// Create singleton instance
export const entityManager = new EntityManager();

// === HOOK FOR REACT COMPONENTS ===
import { useState, useEffect } from 'react';

export const useEntityManager = () => {
  const [, forceUpdate] = useState({});

  useEffect(() => {
    const unsubscribe = entityManager.subscribe(() => {
      forceUpdate({});
    });
    return unsubscribe;
  }, []);

  return entityManager;
};