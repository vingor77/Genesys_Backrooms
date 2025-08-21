// Entity Power Management System for Lethal Company
// Based on moon-specific power limits from moonData.jsx

import { moons } from './moonData.jsx';

// Power level definitions for each entity type
export const ENTITY_POWER_LEVELS = {
  // Indoor Entities
  'Barber': 1,
  'Bracken': 3,
  'Bunker Spider': 2,
  'Butler': 2,
  'Coil-Head': 1,
  'Ghost Girl': 2,
  'Hoarding Bug': 1,
  'Hygrodere': 1,
  'Jester': 3,
  'Maneater': 2,
  'Masked': 1,
  'Nutcracker': 1,
  'Snare Flea': 1,
  'Spore Lizard': 1,
  'Thumper': 3,
  'Masked Hornets': 0,
  
  // Custom Indoor Entities
  'Vine Lurker': 2,
  'Pollen Drone': 1,
  'Prototype Hunter': 3,
  'Data Wraith': 2,
  'Corporate Enforcer': 3,
  'Executive Phantom': 2,
  'Void Stalker': 4,
  'Reality Wraith': 3,
  'Chaos Spawn': 2,
  'Dimensional Horror': 5,
  
  // Outdoor/Nighttime Entities
  'Baboon Hawk': 0.5,
  'Earth Leviathan': 2,
  'Eyeless Dog': 2,
  'Forest Keeper': 3,
  'Old Bird': 3,
  
  // Custom Outdoor Entities
  'Garden Sprite': 1,
  'Security Drone': 2,
  'Escaped Subject-X': 3,
  'Security Mech': 3,
  'Corporate Sentinel': 2,
  'Apocalypse Beast': 4,
  'Void Hunter': 3,
  'Reality Tear': 2,
  
  // Daytime Entities (most are 1 power, some exceptions)
  'Circuit Bee': 1,
  'Manticoil': 1,
  'Roaming Locust': 1,
  'Tulip Snake': 0.5,
  'Pollinator Bot': 1,
  'Maintenance Bot': 1,
  'Executive Assistant Bot': 1,
  'Corporate Courier': 1,
  'Nightmare Swarm': 1,
  'Chaos Sprite': 2,
  'Void Mite': 1,
  'Dimensional Parasite': 3
};

// Get moon power limits
export const getMoonPowerLimits = (moonName) => {
  const moon = moons.find(m => m.name === moonName);
  if (!moon) {
    return {
      maxIndoorPower: 4,
      maxOutdoorPower: 4,
      maxDaytimePower: 7
    };
  }
  
  return {
    maxIndoorPower: moon.maxIndoorPower,
    maxOutdoorPower: moon.maxOutdoorPower,
    maxDaytimePower: moon.maxDaytimePower
  };
};

// Get entity power level
export const getEntityPowerLevel = (entityName) => {
  return ENTITY_POWER_LEVELS[entityName] || 1;
};

// Calculate current power usage for a list of entities
export const calculateCurrentPower = (entities) => {
  return entities.reduce((total, entity) => {
    const powerLevel = getEntityPowerLevel(entity.name);
    return total + powerLevel;
  }, 0);
};

// Check if spawning an entity would exceed power limits
export const canSpawnEntity = (entityName, currentEntities, moonName, entityType = 'indoor') => {
  const powerLimits = getMoonPowerLimits(moonName);
  const entityPower = getEntityPowerLevel(entityName);
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
    default:
      maxPower = powerLimits.maxIndoorPower;
  }
  
  return (currentPower + entityPower) <= maxPower;
};

// Get available entities that can spawn within power limits
export const getSpawnableEntities = (availableEntities, currentEntities, moonName, entityType = 'indoor') => {
  return availableEntities.filter(entity => 
    canSpawnEntity(entity.name, currentEntities, moonName, entityType)
  );
};

// Prioritize entities for spawning based on power efficiency and moon difficulty
export const prioritizeEntitySpawning = (availableEntities, currentEntities, moonName, entityType = 'indoor') => {
  const powerLimits = getMoonPowerLimits(moonName);
  const currentPower = calculateCurrentPower(currentEntities);
  const spawnableEntities = getSpawnableEntities(availableEntities, currentEntities, moonName, entityType);
  
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
    default:
      maxPower = powerLimits.maxIndoorPower;
  }
  
  const remainingPower = maxPower - currentPower;
  
  // Sort entities by power level and spawn preference
  return spawnableEntities.sort((a, b) => {
    const powerA = getEntityPowerLevel(a.name);
    const powerB = getEntityPowerLevel(b.name);
    
    // If we have limited power remaining, prefer lower power entities
    if (remainingPower <= 3) {
      return powerA - powerB;
    }
    
    // Otherwise, allow higher power entities with some randomization
    return Math.random() - 0.5;
  });
};

// Calculate power budget recommendations for different phases
export const getPowerBudgetRecommendations = (moonName, currentRound) => {
  const powerLimits = getMoonPowerLimits(moonName);
  const moon = moons.find(m => m.name === moonName);
  
  if (!moon) return null;
  
  // Calculate recommended power usage based on round progression
  const progressRatio = currentRound / 128; // 0 to 1
  
  const recommendations = {
    indoor: {
      early: Math.ceil(powerLimits.maxIndoorPower * 0.3), // 30% in early rounds
      mid: Math.ceil(powerLimits.maxIndoorPower * 0.6),   // 60% in mid rounds
      late: powerLimits.maxIndoorPower,                   // 100% in late rounds
      current: Math.ceil(powerLimits.maxIndoorPower * Math.min(0.3 + (progressRatio * 0.7), 1.0))
    },
    outdoor: {
      early: Math.ceil(powerLimits.maxOutdoorPower * 0.2),
      mid: Math.ceil(powerLimits.maxOutdoorPower * 0.7),
      late: powerLimits.maxOutdoorPower,
      current: Math.ceil(powerLimits.maxOutdoorPower * Math.min(0.2 + (progressRatio * 0.8), 1.0))
    },
    daytime: {
      constant: powerLimits.maxDaytimePower // Daytime entities are consistent
    }
  };
  
  return recommendations;
};

// Enhanced entity spawning logic with power limits
export const spawnEntityWithPowerLimits = (availableEntities, currentEntities, moonName, entityType, spawnLocation, currentRound) => {
  const spawnableEntities = prioritizeEntitySpawning(availableEntities, currentEntities, moonName, entityType);
  
  if (spawnableEntities.length === 0) {
    return {
      success: false,
      reason: 'power_limit_exceeded',
      message: `Cannot spawn entities - ${entityType} power limit reached for ${moonName}`
    };
  }
  
  // Select entity based on weighted probability considering power constraints
  const powerBudget = getPowerBudgetRecommendations(moonName, currentRound);
  const currentPower = calculateCurrentPower(currentEntities);
  
  let selectedEntity;
  
  if (entityType === 'indoor' && currentPower >= powerBudget.indoor.current) {
    // Prefer lower power entities when approaching budget limit
    selectedEntity = spawnableEntities.find(entity => getEntityPowerLevel(entity.name) <= 2) || spawnableEntities[0];
  } else {
    // Normal weighted selection
    selectedEntity = spawnableEntities[Math.floor(Math.random() * Math.min(3, spawnableEntities.length))];
  }
  
  if (!selectedEntity) {
    return {
      success: false,
      reason: 'no_suitable_entity',
      message: 'No suitable entity found for current power constraints'
    };
  }
  
  const newEntity = {
    ...selectedEntity,
    id: `entity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    spawnedAt: currentRound,
    powerLevel: getEntityPowerLevel(selectedEntity.name),
    location: spawnLocation,
    isActive: true
  };
  
  return {
    success: true,
    entity: newEntity,
    powerUsed: getEntityPowerLevel(selectedEntity.name),
    remainingPower: getPowerLimits(moonName, entityType) - currentPower - getEntityPowerLevel(selectedEntity.name)
  };
};

// Helper to get specific power limit
const getPowerLimits = (moonName, entityType) => {
  const limits = getMoonPowerLimits(moonName);
  switch (entityType) {
    case 'indoor': return limits.maxIndoorPower;
    case 'outdoor': return limits.maxOutdoorPower;
    case 'daytime': return limits.maxDaytimePower;
    default: return limits.maxIndoorPower;
  }
};

// Power monitoring utilities for GM interface
export const getPowerStatus = (currentEntities, moonName) => {
  const powerLimits = getMoonPowerLimits(moonName);
  
  // Separate entities by type (you'll need to track this in your entity objects)
  const indoorEntities = currentEntities.filter(e => e.type === 'indoor' || !e.type);
  const outdoorEntities = currentEntities.filter(e => e.type === 'outdoor');
  const daytimeEntities = currentEntities.filter(e => e.type === 'daytime');
  
  const indoorPower = calculateCurrentPower(indoorEntities);
  const outdoorPower = calculateCurrentPower(outdoorEntities);
  const daytimePower = calculateCurrentPower(daytimeEntities);
  
  return {
    indoor: {
      current: indoorPower,
      max: powerLimits.maxIndoorPower,
      percentage: Math.round((indoorPower / powerLimits.maxIndoorPower) * 100),
      entities: indoorEntities
    },
    outdoor: {
      current: outdoorPower,
      max: powerLimits.maxOutdoorPower,
      percentage: Math.round((outdoorPower / powerLimits.maxOutdoorPower) * 100),
      entities: outdoorEntities
    },
    daytime: {
      current: daytimePower,
      max: powerLimits.maxDaytimePower,
      percentage: Math.round((daytimePower / powerLimits.maxDaytimePower) * 100),
      entities: daytimeEntities
    }
  };
};