// Grid system constants
export const GRID_SIZE = 13;

const isPositionBlocked = (x, y, moonName) => {
  const staticFeatures = STATIC_TERRAIN_FEATURES[moonName];
  if (!staticFeatures) return false;
  
  // Check all terrain feature types
  const featureTypes = [
    'rivers', 'cliffs', 'deep_chasms', 'toxic_pools', 'industrial_barriers',
    'ponds', 'forest', 'steep_hills', 'dangerous_lowlands', 'platform_barriers',
    'industrial_structures', 'containment_barriers', 'corporate_barriers',
    'void_zones', 'reality_tears'
  ];
  
  for (const featureType of featureTypes) {
    const features = staticFeatures[featureType];
    if (!features) continue;
    
    // Handle different feature formats
    if (Array.isArray(features)) {
      // Handle arrays of objects with tiles property (like rivers)
      for (const feature of features) {
        if (feature.tiles && Array.isArray(feature.tiles)) {
          if (feature.tiles.some(tile => tile.x === x && tile.y === y)) {
            return true;
          }
        }
        // Handle arrays of coordinate objects
        else if (feature.x !== undefined && feature.y !== undefined) {
          if (feature.x === x && feature.y === y) {
            return true;
          }
        }
      }
    }
  }
  
  // Check bridge tiles
  if (staticFeatures.bridges) {
    for (const bridge of staticFeatures.bridges) {
      if (bridge.tiles && bridge.tiles.some(tile => tile.x === x && tile.y === y)) {
        return true;
      }
    }
  }
  
  return false;
};

const getAllBlockedPositions = (moonName) => {
  const blocked = new Set();
  const staticFeatures = STATIC_TERRAIN_FEATURES[moonName];
  if (!staticFeatures) return blocked;
  
  // Add all terrain features to blocked set
  Object.values(staticFeatures).forEach(features => {
    if (Array.isArray(features)) {
      features.forEach(feature => {
        if (feature.tiles && Array.isArray(feature.tiles)) {
          // Handle features with tiles array (rivers, bridges)
          feature.tiles.forEach(tile => {
            blocked.add(`${tile.x},${tile.y}`);
          });
        } else if (feature.x !== undefined && feature.y !== undefined) {
          // Handle individual coordinate objects
          blocked.add(`${feature.x},${feature.y}`);
        }
      });
    }
  });
  
  return blocked;
};

// Ship positions strategically placed to force navigation through terrain features
export const SHIP_POSITIONS = {
  // Ship positioned to force bridge usage and terrain navigation
  "41-Experimentation": { x: 2, y: 11 }, // Forces river crossing via bridge
  "220-Assurance": { x: 11, y: 11 }, // Forces canyon descent and bridge usage
  "56-Vow": { x: 1, y: 12 }, // Forces multiple bridge crossings through ravine system
  "21-Offense": { x: 1, y: 12 }, // Forces navigation through toxic/mine fields
  "61-March": { x: 12, y: 11 }, // Forces path through dangerous lowlands and quicksand
  "20-Adamance": { x: 1, y: 12 }, // Forces full valley traversal via bridge system
  "85-Rend": { x: 1, y: 11 }, // Forces mountain pass navigation
  "7-Dine": { x: 12, y: 11 }, // Forces cliff traverse and dangerous bridge crossing
  "8-Titan": { x: 1, y: 12 }, // Forces platform descent and bridge usage
  "68-Artifice": { x: 1, y: 12 }, // Forces warehouse navigation and industrial hazards
  // Custom moons
  "47-Serenity": { x: 1, y: 12 }, // Forces peaceful pond navigation
  "92-Prometheus": { x: 1, y: 12 }, // Forces containment zone crossing
  "13-Nexus": { x: 1, y: 12 }, // Forces corporate security navigation
  "00-Pandemonium": { x: 1, y: 12 } // Forces void zone navigation
};

export const FACILITY_POSITIONS = {
  // Facilities positioned on opposite side of major terrain barriers from ship
  "41-Experimentation": { x: 11, y: 2 }, // Across river system, requires bridge crossing
  "220-Assurance": { x: 1, y: 1 }, // Deep in canyon, requires descent and bridge usage
  "56-Vow": { x: 11, y: 1 }, // Across ravine system, requires multiple bridge crossings
  "21-Offense": { x: 11, y: 1 }, // Through toxic waste zone, requires bridge crossing
  "61-March": { x: 1, y: 1 }, // Across dangerous lowlands, requires hill bridge
  "20-Adamance": { x: 11, y: 1 }, // Across entire valley system, requires bridge network
  "85-Rend": { x: 11, y: 1 }, // Across mountain gap, requires mountain pass bridge
  "7-Dine": { x: 1, y: 1 }, // Across cliff system, requires cliff traverse bridge
  "8-Titan": { x: 9, y: 1 }, // On platform, requires platform bridge access
  "68-Artifice": { x: 11, y: 1 }, // Through warehouse complex, requires overpass
  // Custom moons  
  "47-Serenity": { x: 11, y: 1 }, // Across pond system, requires garden bridges
  "92-Prometheus": { x: 11, y: 1 }, // Through containment zone, requires lab bridge
  "13-Nexus": { x: 11, y: 1 }, // Through corporate barriers, requires skybridge system
  "00-Pandemonium": { x: 11, y: 1 } // Through void zones, requires reality bridges
};

// Fire exit positions create alternative routes with unique tactical considerations
export const FIRE_EXIT_POSITIONS = {
  // Each fire exit positioned to offer a genuinely different route option
  "41-Experimentation": { x: 1, y: 4 }, // Western river bank, requires different bridge approach
  "220-Assurance": { x: 12, y: 8 }, // Canyon rim escape, high ground advantage
  "56-Vow": { x: 4, y: 1 }, // Forest edge, avoids main ravine but requires forest navigation
  "21-Offense": { x: 9, y: 12 }, // Eastern perimeter, different toxic field route
  "61-March": { x: 2, y: 12 }, // Southern forest approach, avoids worst quicksand zones
  "20-Adamance": { x: 12, y: 5 }, // Eastern valley wall, requires cliff navigation
  "85-Rend": { x: 7, y: 12 }, // Southern mountain approach, lamp-lit route
  "7-Dine": { x: 12, y: 7 }, // Eastern cliff face, treacherous but shorter
  "8-Titan": { x: 5, y: 12 }, // Ground level eastern access, platform edge route
  "68-Artifice": { x: 3, y: 1 }, // Northern warehouse, security perimeter route
  // Custom moons - each with unique positioning
  "47-Serenity": { x: 12, y: 6 }, // Eastern garden boundary, peaceful pond route
  "92-Prometheus": { x: 2, y: 1 }, // Northern lab perimeter, containment edge route
  "13-Nexus": { x: 8, y: 1 }, // Northern corporate district, executive zone access
  "00-Pandemonium": { x: 3, y: 3 } // Chaos quadrant, equally dangerous but different void pattern
};

// Helper function to get ship position for selected moon
export const getShipPosition = (moonName) => {
  // Generate random position that doesn't conflict with terrain
  const blockedPositions = getAllBlockedPositions(moonName);
  const maxAttempts = 100;
  let attempts = 0;
  
  while (attempts < maxAttempts) {
    const x = Math.floor(Math.random() * GRID_SIZE);
    const y = Math.floor(Math.random() * GRID_SIZE);
    
    if (!blockedPositions.has(`${x},${y}`)) {
      return { x, y };
    }
    attempts++;
  }
  
  // Fallback to a corner if no valid position found
  console.warn(`Could not find valid ship position for ${moonName}, using fallback`);
  return { x: 0, y: 0 };
};

export const getFacilityPosition = (moonName) => {
  // Generate random position that doesn't conflict with terrain
  const blockedPositions = getAllBlockedPositions(moonName);
  const shipPos = getShipPosition(moonName);
  
  // Also avoid ship position
  blockedPositions.add(`${shipPos.x},${shipPos.y}`);
  
  const maxAttempts = 100;
  let attempts = 0;
  
  while (attempts < maxAttempts) {
    const x = Math.floor(Math.random() * GRID_SIZE);
    const y = Math.floor(Math.random() * GRID_SIZE);
    
    if (!blockedPositions.has(`${x},${y}`)) {
      return { x, y };
    }
    attempts++;
  }
  
  // Fallback to opposite corner from ship if no valid position found
  console.warn(`Could not find valid facility position for ${moonName}, using fallback`);
  return { 
    x: GRID_SIZE - 1 - shipPos.x, 
    y: GRID_SIZE - 1 - shipPos.y 
  };
};

export const getFireExitPosition = (moonName) => {
  // Generate random position that doesn't conflict with terrain
  const blockedPositions = getAllBlockedPositions(moonName);
  const shipPos = getShipPosition(moonName);
  const facilityPos = getFacilityPosition(moonName);
  
  // Also avoid ship and facility positions
  blockedPositions.add(`${shipPos.x},${shipPos.y}`);
  blockedPositions.add(`${facilityPos.x},${facilityPos.y}`);
  
  const maxAttempts = 100;
  let attempts = 0;
  
  while (attempts < maxAttempts) {
    const x = Math.floor(Math.random() * GRID_SIZE);
    const y = Math.floor(Math.random() * GRID_SIZE);
    
    if (!blockedPositions.has(`${x},${y}`)) {
      return { x, y };
    }
    attempts++;
  }
  
  // Fallback to a different corner if no valid position found
  console.warn(`Could not find valid fire exit position for ${moonName}, using fallback`); // Fix warning message
  return { 
    x: Math.floor(GRID_SIZE / 2), // Use center area as fallback
    y: 0  // Top edge
  };
};

// Terrain feature definitions for rich, varied landscapes
export const TERRAIN_FEATURES = {
  BRIDGE: 'bridge',
  POND: 'pond',
  RIVER: 'river',
  CLIFF: 'cliff',
  STEEP_HILL: 'steep_hill',
  FOREST: 'forest',
  QUICKSAND: 'quicksand',
  LANDMINE: 'landmine',
  TURRET: 'turret',
  LAVA_PIT: 'lava_pit',
  ICE_PATCH: 'ice_patch',
  VOID_ZONE: 'void_zone',
  REALITY_TEAR: 'reality_tear',
  TOXIC_POOL: 'toxic_pool'
};

// Static terrain features (strategic placement to force interesting paths)
export const STATIC_TERRAIN_FEATURES = {
  "41-Experimentation": {
    bridges: [
      { 
        id: "main_crossing", 
        tiles: [{ x: 6, y: 8 }, { x: 7, y: 8 }, { x: 8, y: 8 }], 
        connects: "only_safe_river_crossing" 
      },
      { 
        id: "facility_bridge", 
        tiles: [{ x: 10, y: 3 }, { x: 11, y: 3 }], 
        connects: "facility_approach" 
      }
    ],
    rivers: [
      // Major river blocking ALL direct paths
      { tiles: [{ x: 3, y: 7 }, { x: 4, y: 7 }, { x: 5, y: 7 }, { x: 6, y: 7 }, { x: 7, y: 7 }, { x: 8, y: 7 }, { x: 9, y: 7 }, { x: 10, y: 7 }, { x: 11, y: 7 }] },
      { tiles: [{ x: 6, y: 5 }, { x: 6, y: 6 }, { x: 6, y: 7 }, { x: 6, y: 9 }, { x: 6, y: 10 }] },
      // Secondary river near facility
      { tiles: [{ x: 9, y: 2 }, { x: 9, y: 3 }, { x: 9, y: 4 }, { x: 9, y: 5 }] }
    ],
    cliffs: [
      // Cliff barriers forcing bridge usage
      { x: 5, y: 8 }, { x: 9, y: 8 }, { x: 10, y: 8 },
      { x: 10, y: 2 }, { x: 11, y: 2 }, { x: 12, y: 2 }
    ],
    ponds: [{ x: 2, y: 5 }, { x: 4, y: 9 }]
  },
  
  "220-Assurance": {
    bridges: [
      { 
        id: "canyon_descent", 
        tiles: [{ x: 7, y: 7 }, { x: 8, y: 7 }, { x: 9, y: 7 }], 
        connects: "only_canyon_access" 
      },
      { 
        id: "facility_bridge", 
        tiles: [{ x: 2, y: 2 }, { x: 3, y: 2 }], 
        connects: "facility_approach" 
      }
    ],
    cliffs: [
      // Massive cliff barrier forcing specific descent route
      { x: 4, y: 6 }, { x: 5, y: 6 }, { x: 6, y: 6 }, { x: 7, y: 6 }, { x: 8, y: 6 }, { x: 9, y: 6 }, { x: 10, y: 6 }, { x: 11, y: 6 },
      { x: 4, y: 8 }, { x: 5, y: 8 }, { x: 6, y: 8 }, { x: 10, y: 8 }, { x: 11, y: 8 },
      // Facility approach barriers
      { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 3, y: 1 }, { x: 4, y: 1 }
    ],
    deep_chasms: [
      // Impassable canyon areas
      { x: 5, y: 7 }, { x: 6, y: 7 }, { x: 9, y: 7 }, { x: 10, y: 7 }
    ]
  },
  
  "56-Vow": {
    bridges: [
      { 
        id: "ravine_entrance", 
        tiles: [{ x: 5, y: 9 }, { x: 6, y: 9 }], 
        connects: "enters_ravine_system" 
      },
      { 
        id: "main_ravine", 
        tiles: [{ x: 6, y: 6 }, { x: 7, y: 6 }, { x: 8, y: 6 }], 
        connects: "crosses_main_ravine" 
      },
      { 
        id: "facility_access", 
        tiles: [{ x: 10, y: 2 }, { x: 11, y: 2 }], 
        connects: "facility_approach" 
      }
    ],
    rivers: [
      // Complete ravine system blocking ALL other routes
      { tiles: [{ x: 3, y: 8 }, { x: 4, y: 8 }, { x: 5, y: 8 }, { x: 6, y: 8 }, { x: 7, y: 8 }, { x: 8, y: 8 }, { x: 9, y: 8 }] },
      { tiles: [{ x: 5, y: 5 }, { x: 5, y: 6 }, { x: 5, y: 7 }, { x: 5, y: 8 }] },
      { tiles: [{ x: 9, y: 3 }, { x: 9, y: 4 }, { x: 9, y: 5 }, { x: 9, y: 6 }, { x: 9, y: 7 }, { x: 9, y: 8 }] },
      // Facility approach river
      { tiles: [{ x: 9, y: 1 }, { x: 10, y: 1 }, { x: 11, y: 1 }, { x: 12, y: 1 }] }
    ],
    forest: [
      // Dense forest creating additional barriers
      { x: 0, y: 5 }, { x: 1, y: 5 }, { x: 2, y: 5 }, { x: 3, y: 5 },
      { x: 0, y: 6 }, { x: 1, y: 6 }, { x: 2, y: 6 }, { x: 3, y: 6 },
      { x: 12, y: 3 }, { x: 12, y: 4 }, { x: 12, y: 5 }
    ],
    ponds: [{ x: 2, y: 10 }, { x: 4, y: 4 }]
  },
  
  "21-Offense": {
    bridges: [
      { 
        id: "industrial_overpass", 
        tiles: [{ x: 5, y: 7 }, { x: 6, y: 7 }, { x: 7, y: 7 }], 
        connects: "crosses_waste_zone" 
      }
    ],
    toxic_pools: [
      // Static toxic barriers
      { x: 4, y: 6 }, { x: 5, y: 6 }, { x: 6, y: 6 }, { x: 7, y: 6 }, { x: 8, y: 6 },
      { x: 12, y: 3 }, { x: 1, y: 8 }
    ],
    industrial_barriers: [
      // Impassable industrial structures
      { x: 9, y: 5 }, { x: 10, y: 5 }, { x: 11, y: 5 }, { x: 12, y: 5 }
    ]
  },
  
  "61-March": {
    bridges: [
      { 
        id: "hill_crossing", 
        tiles: [{ x: 7, y: 5 }, { x: 8, y: 5 }, { x: 9, y: 5 }], 
        connects: "crosses_dangerous_lowlands" 
      },
      { 
        id: "facility_approach", 
        tiles: [{ x: 2, y: 3 }, { x: 3, y: 3 }], 
        connects: "facility_access" 
      }
    ],
    ponds: [{ x: 1, y: 7 }, { x: 11, y: 6 }],
    forest: [
      // Dense forest creating barriers
      { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 },
      { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 3, y: 1 },
      { x: 8, y: 1 }, { x: 9, y: 1 }, { x: 10, y: 1 }, { x: 11, y: 1 }, { x: 12, y: 1 }
    ],
    steep_hills: [
      // Hills blocking direct paths
      { x: 5, y: 4 }, { x: 6, y: 4 }, { x: 7, y: 4 }, { x: 8, y: 4 }
    ],
    dangerous_lowlands: [
      // Areas prone to quicksand - forces bridge use
      { x: 4, y: 5 }, { x: 5, y: 5 }, { x: 6, y: 5 }, { x: 9, y: 5 }, { x: 10, y: 5 }
    ]
  },
  
  "20-Adamance": {
    bridges: [
      { 
        id: "valley_entrance", 
        tiles: [{ x: 3, y: 9 }, { x: 4, y: 9 }], 
        connects: "enters_valley_system" 
      },
      { 
        id: "main_crossing", 
        tiles: [{ x: 6, y: 6 }, { x: 7, y: 6 }, { x: 8, y: 6 }], 
        connects: "main_valley_crossing" 
      },
      { 
        id: "valley_exit", 
        tiles: [{ x: 9, y: 3 }, { x: 10, y: 3 }], 
        connects: "exits_to_facility" 
      }
    ],
    rivers: [
      // Complete valley river system - NO other routes possible
      { tiles: [{ x: 2, y: 8 }, { x: 3, y: 8 }, { x: 4, y: 8 }, { x: 5, y: 8 }, { x: 6, y: 8 }, { x: 7, y: 8 }, { x: 8, y: 8 }, { x: 9, y: 8 }, { x: 10, y: 8 }, { x: 11, y: 8 }] },
      { tiles: [{ x: 6, y: 4 }, { x: 6, y: 5 }, { x: 6, y: 6 }, { x: 6, y: 7 }, { x: 6, y: 8 }] },
      { tiles: [{ x: 2, y: 4 }, { x: 3, y: 4 }, { x: 4, y: 4 }, { x: 5, y: 4 }, { x: 6, y: 4 }, { x: 7, y: 4 }, { x: 8, y: 4 }, { x: 9, y: 4 }, { x: 10, y: 4 }, { x: 11, y: 4 }] },
      // Facility approach river
      { tiles: [{ x: 8, y: 2 }, { x: 9, y: 2 }, { x: 10, y: 2 }, { x: 11, y: 2 }, { x: 12, y: 2 }] }
    ],
    cliffs: [
      // Valley walls - completely impassable
      { x: 1, y: 5 }, { x: 1, y: 6 }, { x: 1, y: 7 },
      { x: 12, y: 5 }, { x: 12, y: 6 }, { x: 12, y: 7 },
      { x: 2, y: 3 }, { x: 3, y: 3 }, { x: 4, y: 3 }, { x: 5, y: 3 }, { x: 7, y: 3 }, { x: 8, y: 3 }, { x: 9, y: 3 }
    ]
  },
  
  "85-Rend": {
    bridges: [
      { 
        id: "mountain_pass", 
        tiles: [{ x: 4, y: 6 }, { x: 5, y: 6 }, { x: 6, y: 6 }], 
        connects: "crosses_mountain_gap" 
      },
      { 
        id: "lamp_bridge", 
        tiles: [{ x: 8, y: 2 }, { x: 9, y: 2 }], 
        connects: "facility_lamp_path" 
      }
    ],
    cliffs: [
      // Mountain barriers
      { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 },
      { x: 9, y: 0 }, { x: 10, y: 0 }, { x: 11, y: 0 }, { x: 12, y: 0 },
      // Mountain gap
      { x: 3, y: 5 }, { x: 4, y: 5 }, { x: 5, y: 5 }, { x: 6, y: 5 }, { x: 7, y: 5 }, { x: 8, y: 5 }, { x: 9, y: 5 }
    ],
    steep_hills: [
      { x: 4, y: 3 }, { x: 5, y: 3 }, { x: 7, y: 3 }, { x: 8, y: 3 }
    ]
  },
  
  "7-Dine": {
    bridges: [
      { 
        id: "cliff_traverse", 
        tiles: [{ x: 3, y: 7 }, { x: 4, y: 7 }, { x: 5, y: 7 }], 
        connects: "crosses_deadly_gap" 
      },
      { 
        id: "facility_access", 
        tiles: [{ x: 1, y: 9 }, { x: 1, y: 10 }], 
        connects: "facility_cliff_access" 
      }
    ],
    cliffs: [
      // Massive cliff system
      { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 },
      { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 3, y: 1 },
      { x: 10, y: 2 }, { x: 11, y: 2 }, { x: 12, y: 2 },
      { x: 11, y: 3 }, { x: 12, y: 3 }, { x: 12, y: 4 },
      // Cliff gap requiring bridge
      { x: 2, y: 6 }, { x: 3, y: 6 }, { x: 4, y: 6 }, { x: 5, y: 6 }, { x: 6, y: 6 }
    ],
    steep_hills: [
      { x: 2, y: 4 }, { x: 3, y: 4 }, { x: 4, y: 4 }, { x: 9, y: 4 }, { x: 10, y: 4 }
    ]
  },
  
  "8-Titan": {
    bridges: [
      { 
        id: "platform_access", 
        tiles: [{ x: 6, y: 4 }, { x: 7, y: 4 }, { x: 8, y: 4 }], 
        connects: "platform_level_access" 
      },
      { 
        id: "mid_level", 
        tiles: [{ x: 4, y: 7 }, { x: 5, y: 7 }], 
        connects: "mid_platform_access" 
      },
      { 
        id: "ground_ramp", 
        tiles: [{ x: 8, y: 9 }, { x: 8, y: 10 }, { x: 8, y: 11 }], 
        connects: "ground_to_ship_access" 
      }
    ],
    steep_hills: [
      // Massive platform creating barriers
      { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 }, { x: 5, y: 0 }, { x: 6, y: 0 }, { x: 7, y: 0 },
      { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 3, y: 1 }, { x: 4, y: 1 }, { x: 5, y: 1 }, { x: 6, y: 1 }, { x: 7, y: 1 },
      // Platform edges
      { x: 5, y: 5 }, { x: 6, y: 5 }, { x: 7, y: 5 }, { x: 8, y: 5 }
    ],
    platform_barriers: [
      // Impassable platform edges
      { x: 6, y: 3 }, { x: 7, y: 3 }, { x: 8, y: 3 }, { x: 9, y: 3 }
    ]
  },
  
  "68-Artifice": {
    bridges: [
      { 
        id: "warehouse_overpass", 
        tiles: [{ x: 5, y: 5 }, { x: 6, y: 5 }, { x: 7, y: 5 }], 
        connects: "crosses_loading_area" 
      },
      { 
        id: "facility_access", 
        tiles: [{ x: 9, y: 7 }, { x: 10, y: 7 }], 
        connects: "facility_approach" 
      }
    ],
    toxic_pools: [
      // Industrial hazard barriers
      { x: 4, y: 4 }, { x: 5, y: 4 }, { x: 6, y: 4 }, { x: 7, y: 4 }, { x: 8, y: 4 },
      { x: 11, y: 2 }, { x: 1, y: 9 }
    ],
    industrial_structures: [
      // Warehouse barriers
      { x: 2, y: 6 }, { x: 3, y: 6 }, { x: 4, y: 6 }, { x: 8, y: 6 }, { x: 9, y: 6 }, { x: 10, y: 6 }
    ]
  },
  
  // Custom moons
  "47-Serenity": {
    bridges: [
      { 
        id: "garden_path", 
        tiles: [{ x: 4, y: 6 }, { x: 5, y: 6 }, { x: 6, y: 6 }], 
        connects: "crosses_pond_system" 
      },
      { 
        id: "greenhouse_access", 
        tiles: [{ x: 2, y: 8 }, { x: 3, y: 8 }], 
        connects: "greenhouse_approach" 
      }
    ],
    ponds: [
      // Peaceful pond system requiring bridges
      { x: 3, y: 5 }, { x: 4, y: 5 }, { x: 5, y: 5 }, { x: 6, y: 5 }, { x: 7, y: 5 },
      { x: 2, y: 7 }, { x: 3, y: 7 }, { x: 4, y: 7 },
      { x: 9, y: 4 }, { x: 10, y: 4 }
    ],
    forest: [
      { x: 0, y: 3 }, { x: 1, y: 3 }, { x: 11, y: 3 }, { x: 12, y: 3 }
    ]
  },
  
  "92-Prometheus": {
    bridges: [
      { 
        id: "lab_access", 
        tiles: [{ x: 5, y: 5 }, { x: 6, y: 5 }, { x: 7, y: 5 }], 
        connects: "crosses_containment_zone" 
      },
      { 
        id: "facility_bridge", 
        tiles: [{ x: 7, y: 7 }, { x: 8, y: 7 }], 
        connects: "facility_approach" 
      }
    ],
    toxic_pools: [
      // Containment breach barriers
      { x: 4, y: 4 }, { x: 5, y: 4 }, { x: 6, y: 4 }, { x: 7, y: 4 }, { x: 8, y: 4 },
      { x: 3, y: 6 }, { x: 9, y: 6 }
    ],
    containment_barriers: [
      // Lab security barriers
      { x: 2, y: 5 }, { x: 3, y: 5 }, { x: 8, y: 5 }, { x: 9, y: 5 }
    ]
  },
  
  "13-Nexus": {
    bridges: [
      { 
        id: "corporate_skybridge", 
        tiles: [{ x: 4, y: 5 }, { x: 5, y: 5 }, { x: 6, y: 5 }], 
        connects: "crosses_corporate_plaza" 
      },
      { 
        id: "executive_access", 
        tiles: [{ x: 9, y: 9 }, { x: 10, y: 9 }], 
        connects: "executive_tower_access" 
      },
      { 
        id: "tower_approach", 
        tiles: [{ x: 7, y: 10 }, { x: 8, y: 10 }], 
        connects: "tower_base_access" 
      }
    ],
    corporate_barriers: [
      // Security barriers
      { x: 3, y: 4 }, { x: 4, y: 4 }, { x: 5, y: 4 }, { x: 6, y: 4 }, { x: 7, y: 4 },
      { x: 6, y: 8 }, { x: 7, y: 8 }, { x: 8, y: 8 }, { x: 9, y: 8 }
    ],
    steep_hills: [
      { x: 10, y: 10 }, { x: 11, y: 10 }, { x: 10, y: 11 }, { x: 11, y: 11 }
    ]
  },
  
  "00-Pandemonium": {
    bridges: [
      { 
        id: "reality_bridge", 
        tiles: [{ x: 4, y: 5 }, { x: 5, y: 5 }, { x: 6, y: 5 }], 
        connects: "crosses_void_gap" 
      },
      { 
        id: "chaos_crossing", 
        tiles: [{ x: 7, y: 7 }, { x: 8, y: 7 }], 
        connects: "chaos_zone_crossing" 
      }
    ],
    void_zones: [
      // Static void barriers
      { x: 3, y: 4 }, { x: 4, y: 4 }, { x: 5, y: 4 }, { x: 6, y: 4 }, { x: 7, y: 4 },
      { x: 8, y: 6 }, { x: 9, y: 6 }, { x: 10, y: 6 }
    ],
    reality_tears: [
      { x: 2, y: 3 }, { x: 10, y: 3 }, { x: 5, y: 9 }, { x: 9, y: 8 }
    ]
  }
};

export const DYNAMIC_HAZARD_CONFIG = {
  "41-Experimentation": {
    landmines: { count: { min: 3, max: 5 }, avoidAreas: ["ship", "facility", "fire_exit", "bridge"] },
    turrets: { count: { min: 2, max: 4 }, avoidAreas: ["ship", "facility", "fire_exit", "bridge"] }
  },
  
  "220-Assurance": {
    quicksand: { count: { min: 3, max: 6 }, avoidAreas: ["ship", "facility", "fire_exit", "bridge"] },
    landmines: { count: { min: 2, max: 3 }, avoidAreas: ["ship", "facility", "fire_exit", "bridge"] }
  },
  
  "56-Vow": {
    // No dynamic hazards - natural moon
  },
  
  "21-Offense": {
    turrets: { count: { min: 6, max: 8 }, avoidAreas: ["ship", "facility", "fire_exit"] },
    landmines: { count: { min: 6, max: 10 }, avoidAreas: ["ship", "facility", "fire_exit"] }
  },
  
  "61-March": {
    quicksand: { count: { min: 4, max: 8 }, avoidAreas: ["ship", "facility", "fire_exit", "forest"] }
  },
  
  "20-Adamance": {
    quicksand: { count: { min: 2, max: 4 }, avoidAreas: ["ship", "facility", "fire_exit", "bridge"] }
  },
  
  "85-Rend": {
    ice_patches: { count: { min: 6, max: 10 }, avoidAreas: ["ship", "facility", "fire_exit", "bridge"] }
  },
  
  "7-Dine": {
    ice_patches: { count: { min: 6, max: 12 }, avoidAreas: ["ship", "facility", "fire_exit", "bridge"] }
  },
  
  "8-Titan": {
    turrets: { count: { min: 2, max: 3 }, avoidAreas: ["ship", "facility", "fire_exit", "bridge"] }
  },
  
  "68-Artifice": {
    turrets: { count: { min: 4, max: 7 }, avoidAreas: ["ship", "facility", "fire_exit", "bridge"] },
    landmines: { count: { min: 3, max: 5 }, avoidAreas: ["ship", "facility", "fire_exit", "bridge"] }
  },
  
  // Custom moons
  "47-Serenity": {
    // Peaceful moon - no dynamic hazards
  },
  
  "92-Prometheus": {
    turrets: { count: { min: 3, max: 5 }, avoidAreas: ["ship", "facility", "fire_exit", "bridge"] },
    landmines: { count: { min: 2, max: 4 }, avoidAreas: ["ship", "facility", "fire_exit", "bridge"] }
  },
  
  "13-Nexus": {
    turrets: { count: { min: 4, max: 6 }, avoidAreas: ["ship", "facility", "fire_exit", "bridge"] }
  },
  
  "00-Pandemonium": {
    // Chaos moon - hazards are built into the reality tears and void zones
  }
};

// Verify that ship-to-facility path requires terrain navigation
export const verifyForcedNavigation = (moonName) => {
  const shipPos = getShipPosition(moonName);
  const facilityPos = FACILITY_POSITIONS[moonName];
  const fireExitPos = FIRE_EXIT_POSITIONS[moonName];
  const terrain = STATIC_TERRAIN_FEATURES[moonName] || {};
  
  // Calculate direct distance
  const directDistance = Math.abs(facilityPos.x - shipPos.x) + Math.abs(facilityPos.y - shipPos.y);
  
  // Check if bridges are required (count bridges between ship and facility)
  const bridgesRequired = terrain.bridges ? terrain.bridges.length : 0;
  
  // Check terrain barriers in direct path
  const pathBlocked = checkDirectPathBlocked(shipPos, facilityPos, terrain);
  
  return {
    directDistance,
    bridgesRequired,
    pathBlocked,
    navigationRequired: pathBlocked || directDistance > 15
  };
};

// Helper function to check if direct path is blocked
const checkDirectPathBlocked = (start, end, terrain) => {
  // Simple line check for major barriers
  const dx = Math.sign(end.x - start.x);
  const dy = Math.sign(end.y - start.y);
  
  let current = { ...start };
  const barriers = [
    ...(terrain.rivers ? terrain.rivers.flatMap(r => r.tiles) : []),
    ...(terrain.cliffs || []),
    ...(terrain.deep_chasms || []),
    ...(terrain.toxic_pools || [])
  ];
  
  while (current.x !== end.x || current.y !== end.y) {
    current.x += dx;
    current.y += dy;
    
    // Check if current position has a barrier
    const hasBarrier = barriers.some(barrier => 
      barrier.x === current.x && barrier.y === current.y
    );
    
    if (hasBarrier) return true;
  }
  
  return false;
};

// Interior Layout Types
export const INTERIOR_TYPES = {
  FACTORY: "Factory",
  MANSION: "Mansion", 
  MINESHAFT: "Mineshaft"
};

// Room count estimates based on map size multiplier and interior type
export const calculateRoomCount = (multiplier, interiorType) => {
  let baseMin, baseMax;
  
  switch (interiorType) {
    case INTERIOR_TYPES.FACTORY:
      baseMin = 8;
      baseMax = 12;
      break;
    case INTERIOR_TYPES.MANSION:
      baseMin = 12;
      baseMax = 18;
      break;
    case INTERIOR_TYPES.MINESHAFT:
      baseMin = 6;
      baseMax = 10;
      break;
    default:
      baseMin = 8;
      baseMax = 12;
  }
  
  return {
    min: Math.round(baseMin * multiplier),
    max: Math.round(baseMax * multiplier)
  };
};

// Helper function to get height at specific coordinates for a moon
export const getHeightAt = (moonName, x, y) => {
  const heightMap = HEIGHT_MAPS[moonName];
  if (!heightMap || y < 0 || y >= heightMap.length || x < 0 || x >= heightMap[0].length) {
    return 0; // Default to ground level if out of bounds
  }
  return heightMap[y][x];
};

// Helper function to get height difference between two points
export const getHeightDifference = (moonName, pos1, pos2) => {
  const height1 = getHeightAt(moonName, pos1.x, pos1.y);
  const height2 = getHeightAt(moonName, pos2.x, pos2.y);
  return Math.abs(height1 - height2);
};

// Helper function to check if movement is uphill/downhill
export const getElevationChange = (moonName, fromPos, toPos) => {
  const fromHeight = getHeightAt(moonName, fromPos.x, fromPos.y);
  const toHeight = getHeightAt(moonName, toPos.x, toPos.y);
  const difference = toHeight - fromHeight;
  
  if (difference > 0) return { type: 'uphill', change: difference };
  if (difference < 0) return { type: 'downhill', change: Math.abs(difference) };
  return { type: 'level', change: 0 };
};

// Height-based movement cost modifiers
export const ELEVATION_MODIFIERS = {
  level: 0,        // No additional cost
  uphill_1: 0.5,   // +0.5 maneuver per height level gained
  uphill_2: 1,     // +1 maneuver for 2+ height levels
  uphill_3: 2,     // +2 maneuvers for 3+ height levels
  downhill: -0.5   // -0.5 maneuver when going downhill (minimum 1)
};

// Genesys range bands (each grid cell = 1 range band)
export const RANGE_BANDS = {
  ENGAGED: { name: 'Engaged', color: 'bg-red-500', distance: 0 },
  SHORT: { name: 'Short', color: 'bg-orange-500', distance: 1 },
  MEDIUM: { name: 'Medium', color: 'bg-yellow-500', distance: 2 },
  LONG: { name: 'Long', color: 'bg-green-500', distance: 3 },
  EXTREME: { name: 'Extreme', color: 'bg-purple-500', distance: 4 }
};

// Moon data - PART 2: Height Maps
// Height maps for each moon (0 = ground level, 5 = highest elevation)

export const HEIGHT_MAPS = {
  "41-Experimentation": [
    [3, 4, 4, 3, 2, 2, 3, 4, 4, 3, 2, 1, 1], // y=0 - elevated train complex
    [2, 3, 4, 4, 3, 2, 2, 3, 4, 4, 3, 2, 1], // y=1 - industrial terraces
    [2, 2, 3, 3, 4, 3, 2, 2, 3, 3, 2, 1, 0], // y=2 - factory levels (landmine at 4,2)
    [1, 2, 2, 0, 1, 2, 3, 3, 2, 1, 1, 0, 0], // y=3 - river valley (river 0-3,3)
    [0, 0, 1, 1, 2, 2, 3, 2, 1, 1, 0, 0, 0], // y=4 - pond basin (pond at 1,4)
    [1, 1, 2, 3, 2, 1, 2, 3, 2, 1, 1, 0, 0], // y=5 - rising ground
    [2, 2, 3, 3, 2, 2, 1, 2, 3, 3, 2, 1, 1], // y=6 - bridge level (bridge at 5,6)
    [2, 3, 3, 2, 1, 1, 2, 2, 1, 2, 3, 2, 1], // y=7 - pond area (pond at 11,7)
    [3, 3, 2, 2, 1, 1, 1, 0, 1, 2, 2, 3, 2], // y=8 - landmine field (landmine at 7,8)
    [3, 2, 2, 1, 1, 2, 2, 3, 3, 2, 1, 2, 3], // y=9 - facility approach
    [2, 2, 3, 3, 2, 2, 3, 3, 2, 2, 3, 3, 2], // y=10 - mixed elevation
    [2, 2, 2, 2, 3, 3, 3, 3, 2, 2, 2, 2, 2], // y=11 - ship landing (ship at 3,11)
    [3, 3, 3, 4, 4, 4, 4, 4, 3, 3, 3, 3, 3]  // y=12 - back wall
  ],

  "220-Assurance": [
    [5, 5, 5, 4, 3, 2, 2, 3, 4, 5, 5, 5, 5], // y=0 - canyon rim (cliffs 0-2,0)
    [4, 4, 3, 3, 2, 1, 1, 2, 3, 3, 4, 4, 4], // y=1 - canyon slopes
    [3, 2, 1, 1, 1, 0, 0, 1, 1, 1, 2, 3, 4], // y=2 - facility in canyon
    [2, 1, 0, 0, 0, 0, 0, 0, 1, 1, 2, 3, 3], // y=3 - canyon floor (landmine at 6,3)
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 3], // y=4 - deepest area (bridge at 8,4)
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2], // y=5 - bridge crossing (bridge at 4,5)
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3], // y=6 - quicksand areas (quicksand 3,6 5,7 7,6)
    [1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 2, 2, 2], // y=7 - climbing out (landmine at 4,8)
    [2, 2, 2, 1, 0, 1, 1, 1, 2, 2, 2, 2, 2], // y=8 - mid level
    [3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3], // y=9 - ship area (ship at 10,9)
    [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3], // y=10 - plateau
    [4, 4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4], // y=11 - back hills
    [5, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 5]  // y=12 - rim wall (cliffs 11-12,12)
  ],

  "56-Vow": [
    [5, 4, 3, 3, 4, 5, 4, 3, 2, 2, 4, 5, 5], // y=0 - forested peaks (forest 10-12,0)
    [4, 3, 2, 2, 3, 4, 3, 2, 1, 1, 3, 4, 4], // y=1 - dam area (forest 0-2,1)
    [3, 2, 1, 1, 2, 3, 2, 1, 0, 0, 2, 3, 3], // y=2 - facility on hill (river 9,2-9,7)
    [2, 1, 0, 0, 1, 2, 1, 0, 0, 0, 1, 2, 2], // y=3 - slope to ravine (river 3,0-3,4)
    [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1], // y=4 - bridge crossing (bridge at 6,4)
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // y=5 - ravine floor (bridge at 8,5)
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1], // y=6 - ravine bottom (bridge at 4,6)
    [2, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 2, 2], // y=7 - climbing out
    [3, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 3, 3], // y=8 - forest level (pond at 7,8)
    [3, 3, 3, 3, 3, 3, 3, 3, 2, 3, 3, 3, 3], // y=9 - gentle hills (pond at 2,9)
    [4, 4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4], // y=10 - elevated area
    [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4], // y=11 - ship area (ship at 1,11)
    [5, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 5]  // y=12 - forest canopy
  ],

  "21-Offense": [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // y=0 - flat industrial
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // y=1 - factory floor
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // y=2 - turret positions (turrets 3,2 7,2)
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // y=3 - wasteland (toxic pool at 12,3)
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // y=4 - landmine fields (landmine 4,4, turret 10,4)
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // y=5 - toxic areas (landmine 6,5, toxic pool 1,5)
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // y=6 - facility area (landmine at 8,6)
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // y=7 - flat expanse (landmine 9,7, turret 2,7)
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // y=8 - wasteland (landmine 5,8, turret 8,8)
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // y=9 - approach (landmine 3,9, turret 11,9)
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // y=10 - ground level
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // y=11 - approach to ship
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]  // y=12 - ship landing (ship at 6,12)
  ],

  "61-March": [
    [5, 5, 4, 4, 3, 3, 4, 4, 3, 3, 4, 5, 5], // y=0 - forest peaks (forest 0-3,0)
    [4, 4, 3, 3, 2, 2, 3, 3, 2, 2, 3, 4, 4], // y=1 - dense forest (forest 9-12,1)
    [3, 3, 2, 2, 1, 1, 2, 2, 1, 1, 2, 3, 3], // y=2 - facility ridge (steep hill 5,2)
    [2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2], // y=3 - slope down (steep hill 7,3)
    [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1], // y=4 - low areas
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // y=5 - quicksand zones (quicksand 2,5 4,6 6,5)
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], // y=6 - dangerous lowlands (quicksand 8,6)
    [1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1], // y=7 - rising ground (quicksand 3,7 7,7)
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2], // y=8 - elevated area (pond 1,8, ship 11,8)
    [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3], // y=9 - plateau
    [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3], // y=10 - ship approach
    [4, 4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4], // y=11 - elevated forest (pond 11,4)
    [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4]  // y=12 - forest crown
  ],

  "20-Adamance": [
    [4, 4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4], // y=0 - valley rim
    [3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3], // y=1 - slope down (cliffs 0-1,1 11-12,1)
    [2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2], // y=2 - valley entrance
    [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1], // y=3 - valley floor
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // y=4 - deepest valley (river 2-10,4)
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // y=5 - bridge crossing (bridge at 6,5)
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // y=6 - cabin area (bridges 4,6 8,6)
    [1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1], // y=7 - slight rise (quicksand 3,7 9,7)
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // y=8 - climbing
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2], // y=9 - facility level
    [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3], // y=10 - elevated area
    [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3], // y=11 - rim level
    [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3]  // y=12 - ship area (ship at 6,12)
  ],

  "85-Rend": [
    [5, 5, 5, 4, 4, 4, 5, 5, 4, 3, 4, 5, 5], // y=0 - snowy peaks (cliffs 0-2,0 10-12,0)
    [4, 4, 4, 3, 3, 3, 4, 4, 3, 3, 3, 4, 4], // y=1 - facility ridge
    [3, 3, 3, 2, 2, 2, 3, 3, 2, 2, 2, 3, 3], // y=2 - snowy slopes (steep hills 4,2 8,2)
    [2, 2, 2, 1, 1, 1, 2, 2, 1, 1, 1, 2, 2], // y=3 - mid elevation (ice patch 4,3 6,4 8,3)
    [2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2], // y=4 - cottage area
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // y=5 - lamp paths
    [2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2], // y=6 - gentle slopes (bridge at 6,6)
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2], // y=7 - rising ground (ice patch 5,7 7,8 9,7)
    [3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3], // y=8 - elevated area
    [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3], // y=9 - snow level (ice patch 4,8 9,8)
    [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3], // y=10 - ship area (ship at 2,10)
    [4, 4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4], // y=11 - back slopes
    [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4]  // y=12 - mountain wall
  ],

  "7-Dine": [
    [5, 5, 5, 5, 4, 4, 4, 5, 5, 4, 3, 4, 5], // y=0 - extreme cliffs (cliffs 0-3,0)
    [5, 5, 5, 4, 3, 3, 4, 4, 4, 3, 3, 3, 4], // y=1 - cliff faces (cliffs 0-2,1)
    [4, 4, 3, 3, 2, 2, 3, 3, 3, 2, 2, 2, 3], // y=2 - treacherous paths (cliffs 11-12,2)
    [3, 3, 2, 2, 1, 1, 2, 2, 2, 1, 1, 1, 2], // y=3 - steep descent (steep hill 2,3, cliff 12,3)
    [2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // y=4 - mid level (ice patch 5,4, steep hill 10,4)
    [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // y=5 - scattered lamps (ice patch 7,5)
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // y=6 - lamp network (bridge 3,6)
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // y=7 - stable ground (ice patch 6,7)
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2], // y=8 - fire exit level (ice patches 4,8 8,6 9,8)
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2], // y=9 - approach
    [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3], // y=10 - elevated area
    [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3], // y=11 - cliff base
    [4, 4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4]  // y=12 - back plateau
  ],

  "8-Titan": [
    [5, 5, 5, 5, 5, 5, 5, 5, 4, 3, 2, 1, 0], // y=0 - massive platform (steep hills 0-7,0)
    [5, 5, 5, 5, 5, 5, 5, 4, 3, 2, 1, 0, 0], // y=1 - facility level (turrets 8,1 9,2)
    [4, 4, 4, 4, 4, 4, 4, 3, 2, 1, 0, 0, 0], // y=2 - upper stairs
    [3, 3, 3, 3, 3, 3, 3, 2, 1, 0, 0, 0, 0], // y=3 - mid stairs (bridge 4,3)
    [2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0], // y=4 - lower stairs
    [1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0], // y=5 - ground approach (bridge 6,5)
    [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0], // y=6 - base level
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // y=7 - ground level (bridge 3,7)
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // y=8 - flat ground
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // y=9 - approach
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // y=10 - ground level
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // y=11 - approach
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]  // y=12 - ship area (ship at 2,12)
  ],

  "68-Artifice": [
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2], // y=0 - warehouse level
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // y=1 - storage areas
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // y=2 - loading zones (turrets 2,2 5,3 8,2)
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // y=3 - facility access
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // y=4 - warehouse floor (toxic pool 11,4)
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // y=5 - storage grid (landmine 4,5)
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // y=6 - complex center (turret 3,6, landmine 7,6)
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // y=7 - cargo area (turret 9,7)
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2], // y=8 - elevated zone (bridge 5,8, landmine 10,8)
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2], // y=9 - platform approach (turret 6,9, toxic pool 1,9)
    [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3], // y=10 - ship landing
    [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3], // y=11 - elevated platform
    [4, 4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4]  // y=12 - back hills (ship at 1,12)
  ],

  // Custom moons
  "47-Serenity": [
    [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4], // y=0 - gentle hills
    [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3], // y=1 - garden terraces
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2], // y=2 - cultivation areas (forest 0-1,2 11-12,2)
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // y=3 - growing fields (pond 2,3)
    [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // y=4 - greenhouse complex (pond 5,4)
    [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // y=5 - cultivation zones (bridge 4,5)
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // y=6 - garden paths (pond 10,6)
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // y=7 - botanical areas (bridge 7,7, pond 3,7)
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2], // y=8 - elevated gardens (pond 8,3)
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2], // y=9 - approach paths (pond 6,9)
    [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3], // y=10 - elevated area
    [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3], // y=11 - ship area (ship at 8,11)
    [4, 4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4]  // y=12 - gentle peaks
  ],

  "92-Prometheus": [
    [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4], // y=0 - research complex hills
    [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3], // y=1 - laboratory terraces
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2], // y=2 - research platforms
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // y=3 - facility approach (turret 5,3)
    [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1], // y=4 - lab complex (toxic pool 3,4)
    [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // y=5 - containment areas (toxic pool 9,5)
    [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // y=6 - underground access (bridge 6,6, landmine 2,6)
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // y=7 - surface level (turret 4,7, landmine 10,7)
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2], // y=8 - elevated walkways
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2], // y=9 - observation deck
    [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3], // y=10 - approach
    [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3], // y=11 - ship landing (ship at 11,11)
    [4, 4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4]  // y=12 - hillside crown
  ],

  "13-Nexus": [
    [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5], // y=0 - corporate district
    [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4], // y=1 - business plaza
    [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3], // y=2 - office levels
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2], // y=3 - commercial zone (turret 2,3 8,3)
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // y=4 - ground plaza (bridge 3,4)
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // y=5 - corporate campus (bridge 7,5)
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // y=6 - executive area (turret 4,6)
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2], // y=7 - elevated walkways (turret 9,7)
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2], // y=8 - platform level (bridge 5,8)
    [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3], // y=9 - upper terrace
    [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3], // y=10 - platform (turret 6,10)
    [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 5], // y=11 - tower base (steep hills 10,11 11,10)
    [5, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 5]  // y=12 - megastructure (ship at 1,12)
  ],

  "00-Pandemonium": [
    [4, 1, 5, 2, 0, 3, 4, 1, 2, 5, 3, 0, 4], // y=0 - chaotic reality
    [2, 5, 0, 4, 3, 1, 2, 4, 0, 3, 5, 2, 1], // y=1 - distorted terrain (reality tear 6,1)
    [5, 2, 3, 0, 4, 2, 5, 1, 3, 0, 4, 3, 2], // y=2 - impossible geometry (void zone 2,2, reality tear 10,2)
    [1, 4, 2, 5, 1, 3, 0, 4, 2, 1, 3, 5, 0], // y=3 - reality flux (reality tear 7,3)
    [3, 0, 4, 1, 5, 2, 3, 0, 4, 1, 2, 4, 3], // y=4 - dimensional rifts (void zone 7,3, bridge 8,4, reality tear 1,4)
    [2, 3, 1, 4, 0, 5, 2, 3, 1, 4, 0, 3, 2], // y=5 - chaos patterns (void zone 4,5)
    [4, 1, 5, 2, 3, 0, 4, 1, 5, 2, 3, 1, 4], // y=6 - void zones (void zone 9,6)
    [0, 5, 2, 3, 1, 4, 0, 5, 2, 3, 1, 4, 0], // y=7 - unstable ground (bridge 4,7)
    [3, 2, 4, 1, 5, 0, 3, 2, 4, 1, 5, 2, 3], // y=8 - reality tears (ship at 6,8)
    [1, 4, 0, 5, 2, 3, 1, 4, 0, 5, 2, 3, 1], // y=9 - twisted space (void zone 3,9)
    [5, 1, 3, 2, 4, 0, 5, 1, 3, 2, 4, 0, 5], // y=10 - nightmare realm (void zone 8,10, reality tear 11,7)
    [2, 3, 1, 4, 0, 5, 2, 3, 1, 4, 0, 5, 2], // y=11 - chaos storm (reality tear 5,11)
    [4, 0, 5, 1, 3, 2, 4, 0, 5, 1, 3, 2, 4]  // y=12 - dimensional barrier
  ]
};

// Generate random hazard positions for a moon - FIXED RANDOMIZATION
export const generateDynamicHazards = (moonName) => {
  const config = DYNAMIC_HAZARD_CONFIG[moonName];
  if (!config) return {};
  
  const hazards = {};
  const shipPos = getShipPosition(moonName);
  const facilityPos = FACILITY_POSITIONS[moonName];
  const fireExitPos = FIRE_EXIT_POSITIONS[moonName];
  const staticFeatures = STATIC_TERRAIN_FEATURES[moonName] || {};
  
  // Get all bridge tiles for avoidance
  const bridgeTiles = new Set();
  if (staticFeatures.bridges) {
    staticFeatures.bridges.forEach(bridge => {
      bridge.tiles.forEach(tile => {
        bridgeTiles.add(`${tile.x},${tile.y}`);
      });
    });
  }
  
  // Get all static feature positions for avoidance
  const staticPositions = new Set();
  Object.entries(staticFeatures).forEach(([featureType, locations]) => {
    if (Array.isArray(locations)) {
      locations.forEach(loc => {
        if (loc.x !== undefined && loc.y !== undefined) {
          staticPositions.add(`${loc.x},${loc.y}`);
        }
      });
    }
  });
  
  // Helper function to check if position should be avoided
  const shouldAvoidPosition = (x, y, avoidAreas) => {
    const key = `${x},${y}`;
    
    // Check static features first
    if (staticPositions.has(key) || bridgeTiles.has(key)) {
      return true;
    }
    
    for (const area of avoidAreas) {
      switch (area) {
        case "ship":
          // Avoid 5x5 area around ship for safety
          if (Math.abs(x - shipPos.x) <= 2 && Math.abs(y - shipPos.y) <= 2) return true;
          break;
        case "facility":
          // Avoid 5x5 area around facility for safety
          if (Math.abs(x - facilityPos.x) <= 2 && Math.abs(y - facilityPos.y) <= 2) return true;
          break;
        case "fire_exit":
          // Avoid 5x5 area around fire exit for safety
          if (Math.abs(x - fireExitPos.x) <= 2 && Math.abs(y - fireExitPos.y) <= 2) return true;
          break;
        case "bridge":
          if (bridgeTiles.has(key)) return true;
          break;
        case "forest":
          if (staticFeatures.forest) {
            const isForest = staticFeatures.forest.some(f => f.x === x && f.y === y);
            if (isForest) return true;
          }
          break;
      }
    }
    return false;
  };
  
  // Generate each hazard type with TRULY RANDOM positions
  Object.entries(config).forEach(([hazardType, hazardConfig]) => {
    const count = Math.floor(Math.random() * (hazardConfig.count.max - hazardConfig.count.min + 1)) + hazardConfig.count.min;
    const positions = [];
    const maxAttempts = 500; // Increase attempts for better randomization
    let totalAttempts = 0;
    
    while (positions.length < count && totalAttempts < maxAttempts) {
      const x = Math.floor(Math.random() * GRID_SIZE);
      const y = Math.floor(Math.random() * GRID_SIZE);
      
      // Check if position is valid
      if (!shouldAvoidPosition(x, y, hazardConfig.avoidAreas)) {
        // Check if position is not already occupied by another hazard from this generation
        const occupied = positions.some(pos => pos.x === x && pos.y === y);
        if (!occupied) {
          positions.push({ x, y });
        }
      }
      totalAttempts++;
    }
    
    if (positions.length < count) {
      console.warn(`Could only place ${positions.length}/${count} ${hazardType} for ${moonName}`);
    }
    
    hazards[hazardType] = positions;
  });
  return hazards;
};

// Helper function to get all terrain features for a moon (static + dynamic)
export const getAllTerrainFeatures = (moonName, dynamicHazards = {}) => {
  const staticFeatures = STATIC_TERRAIN_FEATURES[moonName] || {};
  const allFeatures = { ...staticFeatures };
  
  // Add dynamic hazards
  Object.entries(dynamicHazards).forEach(([hazardType, positions]) => {
    allFeatures[hazardType] = positions;
  });
  
  return allFeatures;
};

export const TIER_1_MOONS = [
  {
    name: "41-Experimentation",
    cost: 0,
    difficulty: "B",
    facility: { x: 6, y: 3 },
    hazards: ["quicksand"],
    description: "Elevated industrial complex with train tracks and pipe systems",
    weatherTypes: ["clear", "rainy", "stormy", "foggy", "flooded"],
    mapSizeMultiplier: 1.0,
    defaultInterior: "Factory",
    interiorChances: { 
      Factory: 99.7, 
      Mansion: 0.3, 
      Mineshaft: 0 
    },
    min: 8,
    max: 12,
    scrapRange: { min: 8, max: 12 },
    maxIndoorPower: 4,
    maxOutdoorPower: 4,
    maxDaytimePower: 7,
    scrapItems: [
      { name: "V-Type Engine", spawnChance: 13.7, value: { min: 20, max: 56 }, weight: 16, twoHanded: true, conductive: true },
      { name: "Large Axle", spawnChance: 11.5, value: { min: 36, max: 56 }, weight: 16, twoHanded: true, conductive: true },
      { name: "Tattered Metal Sheet", spawnChance: 7.9, value: { min: 10, max: 22 }, weight: 26, twoHanded: false, conductive: true },
      { name: "Scrap Metal", spawnChance: 8.2, value: { min: 6, max: 18 }, weight: 8, twoHanded: false, conductive: true },
      { name: "Old Phone", spawnChance: 6.7, value: { min: 48, max: 64 }, weight: 8, twoHanded: false, conductive: true },
      { name: "Toy Robot", spawnChance: 6.5, value: { min: 72, max: 90 }, weight: 21, twoHanded: false, conductive: true },
      { name: "Brass Bell", spawnChance: 5.8, value: { min: 48, max: 80 }, weight: 0, twoHanded: false, conductive: true },
      { name: "Cash Register", spawnChance: 4.9, value: { min: 80, max: 160 }, weight: 84, twoHanded: true, conductive: true },
      { name: "Tea Kettle", spawnChance: 4.4, value: { min: 32, max: 56 }, weight: 21, twoHanded: false, conductive: true },
      { name: "Stop Sign", spawnChance: 3.9, value: { min: 20, max: 52 }, weight: 21, twoHanded: false, conductive: true },
      { name: "Steering Wheel", spawnChance: 3.3, value: { min: 16, max: 32 }, weight: 16, twoHanded: false, conductive: false },
      { name: "Gold Bar", spawnChance: 2.1, value: { min: 100, max: 210 }, weight: 77, twoHanded: false, conductive: true },
      { name: "Apparatus", spawnChance: "Special", value: { min: 80, max: 80 }, weight: 32, twoHanded: false, conductive: true },
      { name: "Key", spawnChance: 3, value: { min: 3, max: 3 }, weight: 0, twoHanded: false, conductive: true }
    ],
    indoorEntities: [
      { name: "Bunker Spider", spawnChance: 26, powerLevel: 2, maxCount: 1, dangerous: true },
      { name: "Snare Flea", spawnChance: 23, powerLevel: 1, maxCount: 4, dangerous: true },
      { name: "Hygrodere", spawnChance: 14, powerLevel: 1, maxCount: 2, dangerous: true },
      { name: "Hoarding Bug", spawnChance: 12, powerLevel: 1, maxCount: 8, dangerous: false },
      { name: "Spore Lizard", spawnChance: 12, powerLevel: 1, maxCount: 2, dangerous: false },
      { name: "Thumper", spawnChance: 7, powerLevel: 3, maxCount: 4, dangerous: true },
      { name: "Bracken", spawnChance: 5, powerLevel: 3, maxCount: 1, dangerous: true },
      { name: "Ghost Girl", spawnChance: 0.5, powerLevel: 2, maxCount: 1, dangerous: true },
      { name: "Nutcracker", spawnChance: 0.4, powerLevel: 1, maxCount: 10, dangerous: true }
    ],
    outdoorEntities: [
      { name: "Eyeless Dog", spawnChance: 58, powerLevel: 2, maxCount: 8, dangerous: true },
      { name: "Earth Leviathan", spawnChance: 42, powerLevel: 2, maxCount: 3, dangerous: true },
      { name: "Forest Keeper", spawnChance: 0, powerLevel: 3, maxCount: 3, dangerous: true }
    ],
    daytimeEntities: [
      { name: "Manticoil", spawnChance: 50, powerLevel: 1, maxCount: 16, dangerous: false },
      { name: "Roaming Locust", spawnChance: 35, powerLevel: 1, maxCount: 5, dangerous: false },
      { name: "Circuit Bee", spawnChance: 15, powerLevel: 1, maxCount: 6, dangerous: true }
    ],
    nighttimeStart: "6:00 PM"
  },
  {
    name: "220-Assurance", 
    cost: 0,
    difficulty: "D",
    facility: { x: 1, y: 1 },
    hazards: ["landmines", "turrets"],
    description: "Desert canyon with rocky formations and narrow passages",
    weatherTypes: ["clear", "stormy", "eclipsed"],
    mapSizeMultiplier: 1.0,
    defaultInterior: "Factory",
    interiorChances: { 
      Factory: 99.0, 
      Mansion: 1.0, 
      Mineshaft: 0 
    },
    min: 8,
    max: 12,
    scrapRange: { min: 13, max: 16 },
    maxIndoorPower: 6,
    maxOutdoorPower: 8,
    maxDaytimePower: 7,
    scrapItems: [
      { name: "V-Type Engine", spawnChance: 11.8, value: { min: 20, max: 56 }, weight: 16, twoHanded: true, conductive: true },
      { name: "Large Axle", spawnChance: 9.2, value: { min: 36, max: 56 }, weight: 16, twoHanded: true, conductive: true },
      { name: "Tattered Metal Sheet", spawnChance: 8.5, value: { min: 10, max: 22 }, weight: 26, twoHanded: false, conductive: true },
      { name: "Scrap Metal", spawnChance: 9.1, value: { min: 6, max: 18 }, weight: 8, twoHanded: false, conductive: true },
      { name: "Remote", spawnChance: 7.3, value: { min: 2, max: 10 }, weight: 0, twoHanded: false, conductive: true },
      { name: "Old Phone", spawnChance: 6.8, value: { min: 48, max: 64 }, weight: 8, twoHanded: false, conductive: true },
      { name: "Toy Robot", spawnChance: 6.2, value: { min: 72, max: 90 }, weight: 21, twoHanded: false, conductive: true },
      { name: "Brass Bell", spawnChance: 5.5, value: { min: 48, max: 80 }, weight: 0, twoHanded: false, conductive: true },
      { name: "Cash Register", spawnChance: 4.1, value: { min: 80, max: 160 }, weight: 84, twoHanded: true, conductive: true },
      { name: "Laser Pointer", spawnChance: 3.8, value: { min: 32, max: 100 }, weight: 0, twoHanded: false, conductive: true },
      { name: "Stop Sign", spawnChance: 3.5, value: { min: 20, max: 52 }, weight: 21, twoHanded: false, conductive: true },
      { name: "Steering Wheel", spawnChance: 3.2, value: { min: 16, max: 32 }, weight: 16, twoHanded: false, conductive: false },
      { name: "Apparatus", spawnChance: "Special", value: { min: 80, max: 80 }, weight: 32, twoHanded: false, conductive: true },
      { name: "Key", spawnChance: 3, value: { min: 3, max: 3 }, weight: 0, twoHanded: false, conductive: true }
    ],
    indoorEntities: [
      { name: "Snare Flea", spawnChance: 29, powerLevel: 1, maxCount: 4, dangerous: true },
      { name: "Hoarding Bug", spawnChance: 24, powerLevel: 1, maxCount: 8, dangerous: false },
      { name: "Bunker Spider", spawnChance: 22, powerLevel: 2, maxCount: 1, dangerous: true },
      { name: "Hygrodere", spawnChance: 9, powerLevel: 1, maxCount: 2, dangerous: true },
      { name: "Thumper", spawnChance: 7, powerLevel: 3, maxCount: 4, dangerous: true },
      { name: "Spore Lizard", spawnChance: 4, powerLevel: 1, maxCount: 2, dangerous: false },
      { name: "Bracken", spawnChance: 4, powerLevel: 3, maxCount: 1, dangerous: true },
      { name: "Nutcracker", spawnChance: 0.3, powerLevel: 1, maxCount: 10, dangerous: true }
    ],
    outdoorEntities: [
      { name: "Eyeless Dog", spawnChance: 40, powerLevel: 2, maxCount: 8, dangerous: true },
      { name: "Baboon Hawk", spawnChance: 10, powerLevel: 0.5, maxCount: 15, dangerous: true },
      { name: "Earth Leviathan", spawnChance: 5, powerLevel: 2, maxCount: 3, dangerous: true },
      { name: "Forest Keeper", spawnChance: 1, powerLevel: 3, maxCount: 3, dangerous: true }
    ],
    daytimeEntities: [
      { name: "Manticoil", spawnChance: 49, powerLevel: 1, maxCount: 16, dangerous: false },
      { name: "Roaming Locust", spawnChance: 28, powerLevel: 1, maxCount: 5, dangerous: false },
      { name: "Circuit Bee", spawnChance: 22, powerLevel: 1, maxCount: 6, dangerous: true }
    ],
    nighttimeStart: "5:00 PM"
  },
  {
    name: "56-Vow",
    cost: 0, 
    difficulty: "C",
    facility: { x: 7, y: 1 },
    hazards: ["fragile_bridge"],
    description: "Forested hills with ravine crossing and dam structure",
    weatherTypes: ["clear", "stormy", "foggy", "flooded", "eclipsed"],
    mapSizeMultiplier: 1.5,
    defaultInterior: "Factory",
    interiorChances: { 
      Factory: 45, 
      Mansion: 5, 
      Mineshaft: 50 
    },
    min: 12,
    max: 18,
    scrapRange: { min: 11, max: 14 },
    maxIndoorPower: 7,
    maxOutdoorPower: 6,
    maxDaytimePower: 17,
    scrapItems: [
      { name: "V-Type Engine", spawnChance: 10.5, value: { min: 20, max: 56 }, weight: 16, twoHanded: true, conductive: true },
      { name: "Large Axle", spawnChance: 8.8, value: { min: 36, max: 56 }, weight: 16, twoHanded: true, conductive: true },
      { name: "Tattered Metal Sheet", spawnChance: 7.7, value: { min: 10, max: 22 }, weight: 26, twoHanded: false, conductive: true },
      { name: "Scrap Metal", spawnChance: 8.3, value: { min: 6, max: 18 }, weight: 8, twoHanded: false, conductive: true },
      { name: "Remote", spawnChance: 7.8, value: { min: 2, max: 10 }, weight: 0, twoHanded: false, conductive: true },
      { name: "Old Phone", spawnChance: 7.2, value: { min: 48, max: 64 }, weight: 8, twoHanded: false, conductive: true },
      { name: "Toy Robot", spawnChance: 6.5, value: { min: 72, max: 90 }, weight: 21, twoHanded: false, conductive: true },
      { name: "Brass Bell", spawnChance: 5.1, value: { min: 48, max: 80 }, weight: 0, twoHanded: false, conductive: true },
      { name: "Stop Sign", spawnChance: 4.2, value: { min: 20, max: 52 }, weight: 21, twoHanded: false, conductive: true },
      { name: "Cash Register", spawnChance: 3.8, value: { min: 80, max: 160 }, weight: 84, twoHanded: true, conductive: true },
      { name: "Steering Wheel", spawnChance: 3.3, value: { min: 16, max: 32 }, weight: 16, twoHanded: false, conductive: false },
      { name: "Tea Kettle", spawnChance: 2.9, value: { min: 32, max: 56 }, weight: 21, twoHanded: false, conductive: true },
      { name: "Apparatus", spawnChance: "Special", value: { min: 80, max: 80 }, weight: 32, twoHanded: false, conductive: true },
      { name: "Key", spawnChance: 3, value: { min: 3, max: 3 }, weight: 0, twoHanded: false, conductive: true }
    ],
    indoorEntities: [
      { name: "Bracken", spawnChance: 27, powerLevel: 3, maxCount: 1, dangerous: true },
      { name: "Hoarding Bug", spawnChance: 21, powerLevel: 1, maxCount: 8, dangerous: false },
      { name: "Snare Flea", spawnChance: 20, powerLevel: 1, maxCount: 4, dangerous: true },
      { name: "Bunker Spider", spawnChance: 13, powerLevel: 2, maxCount: 1, dangerous: true },
      { name: "Hygrodere", spawnChance: 9, powerLevel: 1, maxCount: 2, dangerous: true },
      { name: "Spore Lizard", spawnChance: 6, powerLevel: 1, maxCount: 2, dangerous: false },
      { name: "Thumper", spawnChance: 3, powerLevel: 3, maxCount: 4, dangerous: true },
      { name: "Coil Head", spawnChance: 2, powerLevel: 1, maxCount: 5, dangerous: true }
    ],
    outdoorEntities: [
      { name: "Forest Keeper", spawnChance: 83, powerLevel: 3, maxCount: 3, dangerous: true },
      { name: "Earth Leviathan", spawnChance: 15, powerLevel: 2, maxCount: 3, dangerous: true },
      { name: "Eyeless Dog", spawnChance: 3, powerLevel: 2, maxCount: 8, dangerous: true },
      { name: "Baboon Hawk", spawnChance: 0, powerLevel: 0.5, maxCount: 15, dangerous: true }
    ],
    daytimeEntities: [
      { name: "Manticoil", spawnChance: 43, powerLevel: 1, maxCount: 16, dangerous: false },
      { name: "Roaming Locust", spawnChance: 28, powerLevel: 1, maxCount: 5, dangerous: false },
      { name: "Circuit Bee", spawnChance: 27, powerLevel: 1, maxCount: 6, dangerous: true }
    ],
    nighttimeStart: "2:00 PM"
  }
];

// Moon data - PART 4: Tier 2 Moons (Free - Intermediate Difficulty)

export const TIER_2_MOONS = [
  {
    name: "21-Offense",
    cost: 0,
    difficulty: "B", 
    facility: { x: 8, y: 4 },
    hazards: ["landmines", "turrets", "pipe_system"],
    description: "Flat industrial wasteland with sprawling complex",
    weatherTypes: ["clear", "rainy", "stormy", "foggy", "flooded", "eclipsed"],
    mapSizeMultiplier: 1.7,
    defaultInterior: "Mineshaft",
    interiorChances: { 
      Factory: 20, 
      Mansion: 5, 
      Mineshaft: 75 
    },
    min: 10,
    max: 17,
    scrapRange: { min: 14, max: 17 },
    maxIndoorPower: 8,
    maxOutdoorPower: 8,
    maxDaytimePower: 15,
    scrapItems: [
      { name: "V-Type Engine", spawnChance: 12.2, value: { min: 20, max: 56 }, weight: 16, twoHanded: true, conductive: true },
      { name: "Large Axle", spawnChance: 10.8, value: { min: 36, max: 56 }, weight: 16, twoHanded: true, conductive: true },
      { name: "Tattered Metal Sheet", spawnChance: 8.3, value: { min: 10, max: 22 }, weight: 26, twoHanded: false, conductive: true },
      { name: "Scrap Metal", spawnChance: 8.7, value: { min: 6, max: 18 }, weight: 8, twoHanded: false, conductive: true },
      { name: "Remote", spawnChance: 8.1, value: { min: 2, max: 10 }, weight: 0, twoHanded: false, conductive: true },
      { name: "Old Phone", spawnChance: 7.5, value: { min: 48, max: 64 }, weight: 8, twoHanded: false, conductive: true },
      { name: "Flask", spawnChance: 6.8, value: { min: 16, max: 44 }, weight: 19, twoHanded: false, conductive: true },
      { name: "Comedy", spawnChance: 6.2, value: { min: 28, max: 52 }, weight: 11, twoHanded: false, conductive: false },
      { name: "Brass Bell", spawnChance: 5.4, value: { min: 48, max: 80 }, weight: 0, twoHanded: false, conductive: true },
      { name: "Cash Register", spawnChance: 4.7, value: { min: 80, max: 160 }, weight: 84, twoHanded: true, conductive: true },
      { name: "Stop Sign", spawnChance: 4.2, value: { min: 20, max: 52 }, weight: 21, twoHanded: false, conductive: true },
      { name: "Steering Wheel", spawnChance: 3.8, value: { min: 16, max: 32 }, weight: 16, twoHanded: false, conductive: false },
      { name: "Apparatus", spawnChance: "Special", value: { min: 80, max: 80 }, weight: 32, twoHanded: false, conductive: true },
      { name: "Key", spawnChance: 3, value: { min: 3, max: 3 }, weight: 0, twoHanded: false, conductive: true }
    ],
    indoorEntities: [
      { name: "Snare Flea", spawnChance: 29, powerLevel: 1, maxCount: 4, dangerous: true },
      { name: "Bunker Spider", spawnChance: 22, powerLevel: 2, maxCount: 1, dangerous: true },
      { name: "Hygrodere", spawnChance: 15, powerLevel: 1, maxCount: 2, dangerous: true },
      { name: "Hoarding Bug", spawnChance: 8, powerLevel: 1, maxCount: 8, dangerous: false },
      { name: "Thumper", spawnChance: 7, powerLevel: 3, maxCount: 4, dangerous: true },
      { name: "Bracken", spawnChance: 4, powerLevel: 3, maxCount: 1, dangerous: true },
      { name: "Spore Lizard", spawnChance: 3, powerLevel: 1, maxCount: 2, dangerous: false },
      { name: "Nutcracker", spawnChance: 1, powerLevel: 1, maxCount: 10, dangerous: true },
      { name: "Jester", spawnChance: 0.5, powerLevel: 3, maxCount: 1, dangerous: true },
      { name: "Coil Head", spawnChance: 0.3, powerLevel: 1, maxCount: 5, dangerous: true }
    ],
    outdoorEntities: [
      { name: "Eyeless Dog", spawnChance: 48, powerLevel: 2, maxCount: 8, dangerous: true },
      { name: "Baboon Hawk", spawnChance: 29, powerLevel: 0.5, maxCount: 15, dangerous: true },
      { name: "Earth Leviathan", spawnChance: 18, powerLevel: 2, maxCount: 3, dangerous: true },
      { name: "Forest Keeper", spawnChance: 4, powerLevel: 3, maxCount: 3, dangerous: true }
    ],
    daytimeEntities: [
      { name: "Manticoil", spawnChance: 100, powerLevel: 1, maxCount: 16, dangerous: false }
    ],
    nighttimeStart: "2:00 PM"
  },
  {
    name: "61-March",
    cost: 0,
    difficulty: "B",
    facility: { x: 2, y: 1 },
    hazards: ["quicksand", "multiple_fire_exits"],
    description: "Hilly forest with multiple elevation changes and permanent hazards",
    weatherTypes: ["clear", "stormy", "foggy", "flooded", "eclipsed"],
    mapSizeMultiplier: 2.0,
    defaultInterior: "Factory",
    interiorChances: { 
      Factory: 100, 
      Mansion: 0, 
      Mineshaft: 0 
    },
    min: 16,
    max: 24,
    scrapRange: { min: 13, max: 16 },
    maxIndoorPower: 14,
    maxOutdoorPower: 12,
    maxDaytimePower: 20,
    scrapItems: [
      { name: "V-Type Engine", spawnChance: 11.3, value: { min: 20, max: 56 }, weight: 16, twoHanded: true, conductive: true },
      { name: "Large Axle", spawnChance: 9.8, value: { min: 36, max: 56 }, weight: 16, twoHanded: true, conductive: true },
      { name: "Tattered Metal Sheet", spawnChance: 8.1, value: { min: 10, max: 22 }, weight: 26, twoHanded: false, conductive: true },
      { name: "Scrap Metal", spawnChance: 8.5, value: { min: 6, max: 18 }, weight: 8, twoHanded: false, conductive: true },
      { name: "Remote", spawnChance: 7.9, value: { min: 2, max: 10 }, weight: 0, twoHanded: false, conductive: true },
      { name: "Old Phone", spawnChance: 7.4, value: { min: 48, max: 64 }, weight: 8, twoHanded: false, conductive: true },
      { name: "Toy Robot", spawnChance: 6.7, value: { min: 72, max: 90 }, weight: 21, twoHanded: false, conductive: true },
      { name: "Flask", spawnChance: 6.1, value: { min: 16, max: 44 }, weight: 19, twoHanded: false, conductive: true },
      { name: "Brass Bell", spawnChance: 5.3, value: { min: 48, max: 80 }, weight: 0, twoHanded: false, conductive: true },
      { name: "Cash Register", spawnChance: 4.6, value: { min: 80, max: 160 }, weight: 84, twoHanded: true, conductive: true },
      { name: "Stop Sign", spawnChance: 4.1, value: { min: 20, max: 52 }, weight: 21, twoHanded: false, conductive: true },
      { name: "Steering Wheel", spawnChance: 3.7, value: { min: 16, max: 32 }, weight: 16, twoHanded: false, conductive: false },
      { name: "Apparatus", spawnChance: "Special", value: { min: 80, max: 80 }, weight: 32, twoHanded: false, conductive: true },
      { name: "Key", spawnChance: 3, value: { min: 3, max: 3 }, weight: 0, twoHanded: false, conductive: true }
    ],
    indoorEntities: [
      { name: "Thumper", spawnChance: 25, powerLevel: 3, maxCount: 4, dangerous: true },
      { name: "Bunker Spider", spawnChance: 24, powerLevel: 2, maxCount: 1, dangerous: true },
      { name: "Snare Flea", spawnChance: 18, powerLevel: 1, maxCount: 4, dangerous: true },
      { name: "Hoarding Bug", spawnChance: 12, powerLevel: 1, maxCount: 8, dangerous: false },
      { name: "Bracken", spawnChance: 8, powerLevel: 3, maxCount: 1, dangerous: true },
      { name: "Hygrodere", spawnChance: 6, powerLevel: 1, maxCount: 2, dangerous: true },
      { name: "Spore Lizard", spawnChance: 3, powerLevel: 1, maxCount: 2, dangerous: false },
      { name: "Nutcracker", spawnChance: 1, powerLevel: 1, maxCount: 10, dangerous: true },
      { name: "Jester", spawnChance: 1, powerLevel: 3, maxCount: 1, dangerous: true },
      { name: "Coil Head", spawnChance: 1, powerLevel: 1, maxCount: 5, dangerous: true },
      { name: "Maneater", spawnChance: 1, powerLevel: 2, maxCount: 1, dangerous: true }
    ],
    outdoorEntities: [
      { name: "Baboon Hawk", spawnChance: 45, powerLevel: 0.5, maxCount: 15, dangerous: true },
      { name: "Forest Keeper", spawnChance: 35, powerLevel: 3, maxCount: 3, dangerous: true },
      { name: "Eyeless Dog", spawnChance: 15, powerLevel: 2, maxCount: 8, dangerous: true },
      { name: "Earth Leviathan", spawnChance: 5, powerLevel: 2, maxCount: 3, dangerous: true }
    ],
    daytimeEntities: [
      { name: "Circuit Bee", spawnChance: 45, powerLevel: 1, maxCount: 6, dangerous: true },
      { name: "Manticoil", spawnChance: 35, powerLevel: 1, maxCount: 16, dangerous: false },
      { name: "Roaming Locust", spawnChance: 20, powerLevel: 1, maxCount: 5, dangerous: false }
    ],
    nighttimeStart: "2:00 PM"
  },
  {
    name: "20-Adamance", 
    cost: 0,
    difficulty: "B",
    facility: { x: 8, y: 7 },
    hazards: ["quicksand", "long_bridge", "short_bridge", "cabin"],
    description: "Deep valley system with bridge crossings and hidden cabin",
    weatherTypes: ["clear", "rainy", "stormy", "foggy", "flooded", "eclipsed"],
    mapSizeMultiplier: 1.4,
    defaultInterior: "Factory",
    interiorChances: { 
      Factory: 95, 
      Mansion: 3, 
      Mineshaft: 2 
    },
    min: 11,
    max: 17,
    scrapRange: { min: 15, max: 19 },
    maxIndoorPower: 13,
    maxOutdoorPower: 13,
    maxDaytimePower: 20,
    scrapItems: [
      { name: "V-Type Engine", spawnChance: 12.8, value: { min: 20, max: 56 }, weight: 16, twoHanded: true, conductive: true },
      { name: "Large Axle", spawnChance: 10.2, value: { min: 36, max: 56 }, weight: 16, twoHanded: true, conductive: true },
      { name: "Tattered Metal Sheet", spawnChance: 8.8, value: { min: 10, max: 22 }, weight: 26, twoHanded: false, conductive: true },
      { name: "Scrap Metal", spawnChance: 8.9, value: { min: 6, max: 18 }, weight: 8, twoHanded: false, conductive: true },
      { name: "Remote", spawnChance: 8.2, value: { min: 2, max: 10 }, weight: 0, twoHanded: false, conductive: true },
      { name: "Old Phone", spawnChance: 7.6, value: { min: 48, max: 64 }, weight: 8, twoHanded: false, conductive: true },
      { name: "Toy Robot", spawnChance: 6.9, value: { min: 72, max: 90 }, weight: 21, twoHanded: false, conductive: true },
      { name: "Flask", spawnChance: 6.3, value: { min: 16, max: 44 }, weight: 19, twoHanded: false, conductive: true },
      { name: "Brass Bell", spawnChance: 5.7, value: { min: 48, max: 80 }, weight: 0, twoHanded: false, conductive: true },
      { name: "Cash Register", spawnChance: 4.9, value: { min: 80, max: 160 }, weight: 84, twoHanded: true, conductive: true },
      { name: "Stop Sign", spawnChance: 4.4, value: { min: 20, max: 52 }, weight: 21, twoHanded: false, conductive: true },
      { name: "Steering Wheel", spawnChance: 3.8, value: { min: 16, max: 32 }, weight: 16, twoHanded: false, conductive: false },
      { name: "Apparatus", spawnChance: "Special", value: { min: 80, max: 80 }, weight: 32, twoHanded: false, conductive: true },
      { name: "Key", spawnChance: 3, value: { min: 3, max: 3 }, weight: 0, twoHanded: false, conductive: true }
    ],
    indoorEntities: [
      { name: "Thumper", spawnChance: 22, powerLevel: 3, maxCount: 4, dangerous: true },
      { name: "Bunker Spider", spawnChance: 21, powerLevel: 2, maxCount: 1, dangerous: true },
      { name: "Snare Flea", spawnChance: 18, powerLevel: 1, maxCount: 4, dangerous: true },
      { name: "Hoarding Bug", spawnChance: 14, powerLevel: 1, maxCount: 8, dangerous: false },
      { name: "Bracken", spawnChance: 8, powerLevel: 3, maxCount: 1, dangerous: true },
      { name: "Hygrodere", spawnChance: 7, powerLevel: 1, maxCount: 2, dangerous: true },
      { name: "Spore Lizard", spawnChance: 4, powerLevel: 1, maxCount: 2, dangerous: false },
      { name: "Nutcracker", spawnChance: 2, powerLevel: 1, maxCount: 10, dangerous: true },
      { name: "Jester", spawnChance: 1.5, powerLevel: 3, maxCount: 1, dangerous: true },
      { name: "Masked", spawnChance: 1.2, powerLevel: 1, maxCount: 10, dangerous: true },
      { name: "Coil Head", spawnChance: 1, powerLevel: 1, maxCount: 5, dangerous: true },
      { name: "Maneater", spawnChance: 1, powerLevel: 2, maxCount: 1, dangerous: true }
    ],
    outdoorEntities: [
      { name: "Baboon Hawk", spawnChance: 69, powerLevel: 0.5, maxCount: 15, dangerous: true },
      { name: "Forest Keeper", spawnChance: 15, powerLevel: 3, maxCount: 3, dangerous: true },
      { name: "Eyeless Dog", spawnChance: 10, powerLevel: 2, maxCount: 8, dangerous: true },
      { name: "Earth Leviathan", spawnChance: 5, powerLevel: 2, maxCount: 3, dangerous: true },
      { name: "Old Bird", spawnChance: 1, powerLevel: 3, maxCount: 20, dangerous: true }
    ],
    daytimeEntities: [
      { name: "Manticoil", spawnChance: 50, powerLevel: 1, maxCount: 16, dangerous: false },
      { name: "Roaming Locust", spawnChance: 30, powerLevel: 1, maxCount: 5, dangerous: false },
      { name: "Circuit Bee", spawnChance: 15, powerLevel: 1, maxCount: 6, dangerous: true },
      { name: "Tulip Snake", spawnChance: 5, powerLevel: 0.5, maxCount: 12, dangerous: false }
    ],
    nighttimeStart: "2:00 PM"
  }
];

// Moon data - PART 5: Tier 3 Moons (Paid - Hard Difficulty)

export const TIER_3_MOONS = [
  {
    name: "85-Rend",
    cost: 550,
    difficulty: "A",
    facility: { x: 6, y: 1 },
    hazards: ["permanent_blizzard", "lamp_path", "cliff_drops"],
    description: "Snowy mountainous terrain with guided lamp paths",
    weatherTypes: ["clear", "stormy", "foggy", "eclipsed"],
    mapSizeMultiplier: 1.8,
    defaultInterior: "Mansion",
    interiorChances: { 
      Factory: 2, 
      Mansion: 98, 
      Mineshaft: 0 
    },
    min: 22,
    max: 32,
    scrapRange: { min: 18, max: 23 },
    maxIndoorPower: 10,
    maxOutdoorPower: 6,
    maxDaytimePower: 0,
    scrapItems: [
      { name: "Painting", spawnChance: 14.2, value: { min: 60, max: 124 }, weight: 31, twoHanded: true, conductive: false },
      { name: "Fancy Lamp", spawnChance: 11.8, value: { min: 60, max: 128 }, weight: 21, twoHanded: true, conductive: true },
      { name: "Perfume Bottle", spawnChance: 10.4, value: { min: 76, max: 104 }, weight: 3, twoHanded: false, conductive: false },
      { name: "V-Type Engine", spawnChance: 10.1, value: { min: 20, max: 56 }, weight: 16, twoHanded: true, conductive: true },
      { name: "Gold Bar", spawnChance: 8.7, value: { min: 100, max: 210 }, weight: 77, twoHanded: false, conductive: true },
      { name: "Cash Register", spawnChance: 7.3, value: { min: 80, max: 160 }, weight: 84, twoHanded: true, conductive: true },
      { name: "Large Axle", spawnChance: 6.9, value: { min: 36, max: 56 }, weight: 16, twoHanded: true, conductive: true },
      { name: "Tattered Metal Sheet", spawnChance: 5.8, value: { min: 10, max: 22 }, weight: 26, twoHanded: false, conductive: true },
      { name: "Scrap Metal", spawnChance: 5.2, value: { min: 6, max: 18 }, weight: 8, twoHanded: false, conductive: true },
      { name: "Stop Sign", spawnChance: 4.6, value: { min: 20, max: 52 }, weight: 21, twoHanded: false, conductive: true },
      { name: "Steering Wheel", spawnChance: 4.1, value: { min: 16, max: 32 }, weight: 16, twoHanded: false, conductive: false },
      { name: "Brass Bell", spawnChance: 3.7, value: { min: 48, max: 80 }, weight: 0, twoHanded: false, conductive: true },
      { name: "Apparatus", spawnChance: "Special", value: { min: 80, max: 80 }, weight: 32, twoHanded: false, conductive: true },
      { name: "Key", spawnChance: 3, value: { min: 3, max: 3 }, weight: 0, twoHanded: false, conductive: true }
    ],
    indoorEntities: [
      { name: "Nutcracker", spawnChance: 35, powerLevel: 1, maxCount: 10, dangerous: true },
      { name: "Jester", spawnChance: 18, powerLevel: 3, maxCount: 1, dangerous: true },
      { name: "Ghost Girl", spawnChance: 12, powerLevel: 2, maxCount: 1, dangerous: true },
      { name: "Bracken", spawnChance: 10, powerLevel: 3, maxCount: 1, dangerous: true },
      { name: "Snare Flea", spawnChance: 8, powerLevel: 1, maxCount: 4, dangerous: true },
      { name: "Bunker Spider", spawnChance: 6, powerLevel: 2, maxCount: 1, dangerous: true },
      { name: "Butler", spawnChance: 4, powerLevel: 2, maxCount: 7, dangerous: true },
      { name: "Hygrodere", spawnChance: 3, powerLevel: 1, maxCount: 2, dangerous: true },
      { name: "Masked", spawnChance: 2, powerLevel: 1, maxCount: 10, dangerous: true },
      { name: "Coil Head", spawnChance: 1.5, powerLevel: 1, maxCount: 5, dangerous: true },
      { name: "Spore Lizard", spawnChance: 0.5, powerLevel: 1, maxCount: 2, dangerous: false }
    ],
    outdoorEntities: [
      { name: "Eyeless Dog", spawnChance: 60, powerLevel: 2, maxCount: 8, dangerous: true },
      { name: "Forest Keeper", spawnChance: 35, powerLevel: 3, maxCount: 3, dangerous: true },
      { name: "Earth Leviathan", spawnChance: 5, powerLevel: 2, maxCount: 3, dangerous: true }
    ],
    daytimeEntities: [],
    nighttimeStart: "1:00 PM"
  },
  {
    name: "7-Dine",
    cost: 600,
    difficulty: "S", 
    facility: { x: 1, y: 6 },
    hazards: ["permanent_blizzard", "cliff_terrain", "scattered_lamps"],
    description: "Extreme elevation snow cliffs with treacherous paths",
    weatherTypes: ["clear", "rainy", "stormy", "foggy", "eclipsed"],
    mapSizeMultiplier: 1.9,
    defaultInterior: "Mansion",
    interiorChances: { 
      Factory: 2, 
      Mansion: 67, 
      Mineshaft: 31 
    },
    min: 23,
    max: 34,
    scrapRange: { min: 20, max: 25 },
    maxIndoorPower: 15,
    maxOutdoorPower: 6,
    maxDaytimePower: 0,
    scrapItems: [
      { name: "Painting", spawnChance: 15.1, value: { min: 60, max: 124 }, weight: 31, twoHanded: true, conductive: false },
      { name: "Fancy Lamp", spawnChance: 12.5, value: { min: 60, max: 128 }, weight: 21, twoHanded: true, conductive: true },
      { name: "Perfume Bottle", spawnChance: 11.2, value: { min: 76, max: 104 }, weight: 3, twoHanded: false, conductive: false },
      { name: "V-Type Engine", spawnChance: 10.8, value: { min: 20, max: 56 }, weight: 16, twoHanded: true, conductive: true },
      { name: "Gold Bar", spawnChance: 9.3, value: { min: 100, max: 210 }, weight: 77, twoHanded: false, conductive: true },
      { name: "Cash Register", spawnChance: 8.1, value: { min: 80, max: 160 }, weight: 84, twoHanded: true, conductive: true },
      { name: "Large Axle", spawnChance: 7.4, value: { min: 36, max: 56 }, weight: 16, twoHanded: true, conductive: true },
      { name: "Tattered Metal Sheet", spawnChance: 6.2, value: { min: 10, max: 22 }, weight: 26, twoHanded: false, conductive: true },
      { name: "Scrap Metal", spawnChance: 5.5, value: { min: 6, max: 18 }, weight: 8, twoHanded: false, conductive: true },
      { name: "Stop Sign", spawnChance: 4.8, value: { min: 20, max: 52 }, weight: 21, twoHanded: false, conductive: true },
      { name: "Steering Wheel", spawnChance: 4.1, value: { min: 16, max: 32 }, weight: 16, twoHanded: false, conductive: false },
      { name: "Brass Bell", spawnChance: 2.0, value: { min: 48, max: 80 }, weight: 0, twoHanded: false, conductive: true },
      { name: "Apparatus", spawnChance: "Special", value: { min: 80, max: 80 }, weight: 32, twoHanded: false, conductive: true },
      { name: "Key", spawnChance: 3, value: { min: 3, max: 3 }, weight: 0, twoHanded: false, conductive: true }
    ],
    indoorEntities: [
      { name: "Butler", spawnChance: 62, powerLevel: 2, maxCount: 7, dangerous: true },
      { name: "Nutcracker", spawnChance: 12, powerLevel: 1, maxCount: 10, dangerous: true },
      { name: "Jester", spawnChance: 8, powerLevel: 3, maxCount: 1, dangerous: true },
      { name: "Ghost Girl", spawnChance: 6, powerLevel: 2, maxCount: 1, dangerous: true },
      { name: "Bracken", spawnChance: 5, powerLevel: 3, maxCount: 1, dangerous: true },
      { name: "Snare Flea", spawnChance: 3, powerLevel: 1, maxCount: 4, dangerous: true },
      { name: "Bunker Spider", spawnChance: 2, powerLevel: 2, maxCount: 1, dangerous: true },
      { name: "Hygrodere", spawnChance: 1.5, powerLevel: 1, maxCount: 2, dangerous: true },
      { name: "Coil Head", spawnChance: 0.5, powerLevel: 1, maxCount: 5, dangerous: true }
    ],
    outdoorEntities: [
      { name: "Eyeless Dog", spawnChance: 55, powerLevel: 2, maxCount: 8, dangerous: true },
      { name: "Forest Keeper", spawnChance: 35, powerLevel: 3, maxCount: 3, dangerous: true },
      { name: "Earth Leviathan", spawnChance: 8, powerLevel: 2, maxCount: 3, dangerous: true },
      { name: "Old Bird", spawnChance: 2, powerLevel: 3, maxCount: 20, dangerous: true }
    ],
    daytimeEntities: [],
    nighttimeStart: "3:00 PM"
  },
  {
    name: "8-Titan",
    cost: 700,
    difficulty: "S+",
    facility: { x: 5, y: 1 },
    hazards: ["small_outdoor_area", "staircase_system", "entity_stair_access"],
    description: "Massive elevated platform structure with extensive stairway systems",
    weatherTypes: ["clear", "stormy", "foggy", "eclipsed"],
    mapSizeMultiplier: 2.2,
    defaultInterior: "Factory",
    interiorChances: { 
      Factory: 81.3, 
      Mansion: 18.6, 
      Mineshaft: 0.1 
    },
    min: 26,
    max: 40,
    scrapRange: { min: 28, max: 31 },
    maxIndoorPower: 18,
    maxOutdoorPower: 7,
    maxDaytimePower: 0,
    scrapItems: [
      { name: "Painting", spawnChance: 13.2, value: { min: 60, max: 124 }, weight: 31, twoHanded: true, conductive: false },
      { name: "V-Type Engine", spawnChance: 11.8, value: { min: 20, max: 56 }, weight: 16, twoHanded: true, conductive: true },
      { name: "Fancy Lamp", spawnChance: 10.5, value: { min: 60, max: 128 }, weight: 21, twoHanded: true, conductive: true },
      { name: "Gold Bar", spawnChance: 10.3, value: { min: 100, max: 210 }, weight: 77, twoHanded: false, conductive: true },
      { name: "Cash Register", spawnChance: 9.1, value: { min: 80, max: 160 }, weight: 84, twoHanded: true, conductive: true },
      { name: "Perfume Bottle", spawnChance: 8.4, value: { min: 76, max: 104 }, weight: 3, twoHanded: false, conductive: false },
      { name: "Large Axle", spawnChance: 7.2, value: { min: 36, max: 56 }, weight: 16, twoHanded: true, conductive: true },
      { name: "Tattered Metal Sheet", spawnChance: 6.1, value: { min: 10, max: 22 }, weight: 26, twoHanded: false, conductive: true },
      { name: "Scrap Metal", spawnChance: 5.5, value: { min: 6, max: 18 }, weight: 8, twoHanded: false, conductive: true },
      { name: "Stop Sign", spawnChance: 4.8, value: { min: 20, max: 52 }, weight: 21, twoHanded: false, conductive: true },
      { name: "Steering Wheel", spawnChance: 4.2, value: { min: 16, max: 32 }, weight: 16, twoHanded: false, conductive: false },
      { name: "Brass Bell", spawnChance: 3.6, value: { min: 48, max: 80 }, weight: 0, twoHanded: false, conductive: true },
      { name: "Remote", spawnChance: 2.3, value: { min: 2, max: 10 }, weight: 0, twoHanded: false, conductive: true },
      { name: "Apparatus", spawnChance: "Special", value: { min: 80, max: 80 }, weight: 32, twoHanded: false, conductive: true },
      { name: "Key", spawnChance: 3, value: { min: 3, max: 3 }, weight: 0, twoHanded: false, conductive: true }
    ],
    indoorEntities: [
      { name: "Jester", spawnChance: 22, powerLevel: 3, maxCount: 1, dangerous: true },
      { name: "Nutcracker", spawnChance: 20, powerLevel: 1, maxCount: 10, dangerous: true },
      { name: "Bracken", spawnChance: 12, powerLevel: 3, maxCount: 1, dangerous: true },
      { name: "Coil Head", spawnChance: 10, powerLevel: 1, maxCount: 5, dangerous: true },
      { name: "Thumper", spawnChance: 8, powerLevel: 3, maxCount: 4, dangerous: true },
      { name: "Bunker Spider", spawnChance: 7, powerLevel: 2, maxCount: 1, dangerous: true },
      { name: "Snare Flea", spawnChance: 6, powerLevel: 1, maxCount: 4, dangerous: true },
      { name: "Ghost Girl", spawnChance: 5, powerLevel: 2, maxCount: 1, dangerous: true },
      { name: "Hoarding Bug", spawnChance: 4, powerLevel: 1, maxCount: 8, dangerous: false },
      { name: "Hygrodere", spawnChance: 2.5, powerLevel: 1, maxCount: 2, dangerous: true },
      { name: "Spore Lizard", spawnChance: 1.5, powerLevel: 1, maxCount: 2, dangerous: false },
      { name: "Butler", spawnChance: 1, powerLevel: 2, maxCount: 7, dangerous: true },
      { name: "Masked", spawnChance: 0.5, powerLevel: 1, maxCount: 10, dangerous: true },
      { name: "Maneater", spawnChance: 0.3, powerLevel: 2, maxCount: 1, dangerous: true }
    ],
    outdoorEntities: [
      { name: "Eyeless Dog", spawnChance: 55, powerLevel: 2, maxCount: 8, dangerous: true },
      { name: "Forest Keeper", spawnChance: 35, powerLevel: 3, maxCount: 3, dangerous: true },
      { name: "Earth Leviathan", spawnChance: 10, powerLevel: 2, maxCount: 3, dangerous: true }
    ],
    daytimeEntities: [],
    nighttimeStart: "1:00 PM"
  },
  {
    name: "68-Artifice",
    cost: 1500, 
    difficulty: "S++",
    facility: { x: 7, y: 6 },
    hazards: ["warehouse_complex", "old_bird_dominance", "fenced_perimeter"],
    description: "Industrial warehouse complex on elevated ship landing zone",
    weatherTypes: ["clear", "rainy", "stormy", "flooded", "eclipsed"],
    mapSizeMultiplier: 1.6,
    defaultInterior: "Mansion",
    interiorChances: { 
      Factory: 23, 
      Mansion: 70, 
      Mineshaft: 7 
    },
    min: 19,
    max: 29,
    scrapRange: { min: 26, max: 30 },
    maxIndoorPower: 13,
    maxOutdoorPower: 13,
    maxDaytimePower: 15,
    scrapItems: [
      { name: "Gold Bar", spawnChance: 15.2, value: { min: 100, max: 210 }, weight: 77, twoHanded: false, conductive: true },
      { name: "Painting", spawnChance: 13.8, value: { min: 60, max: 124 }, weight: 31, twoHanded: true, conductive: false },
      { name: "Fancy Lamp", spawnChance: 11.5, value: { min: 60, max: 128 }, weight: 21, twoHanded: true, conductive: true },
      { name: "Cash Register", spawnChance: 10.3, value: { min: 80, max: 160 }, weight: 84, twoHanded: true, conductive: true },
      { name: "V-Type Engine", spawnChance: 9.7, value: { min: 20, max: 56 }, weight: 16, twoHanded: true, conductive: true },
      { name: "Perfume Bottle", spawnChance: 8.9, value: { min: 76, max: 104 }, weight: 3, twoHanded: false, conductive: false },
      { name: "Large Axle", spawnChance: 6.8, value: { min: 36, max: 56 }, weight: 16, twoHanded: true, conductive: true },
      { name: "Stop Sign", spawnChance: 5.2, value: { min: 20, max: 52 }, weight: 21, twoHanded: false, conductive: true },
      { name: "Tattered Metal Sheet", spawnChance: 4.5, value: { min: 10, max: 22 }, weight: 26, twoHanded: false, conductive: true },
      { name: "Steering Wheel", spawnChance: 3.8, value: { min: 16, max: 32 }, weight: 16, twoHanded: false, conductive: false },
      { name: "Scrap Metal", spawnChance: 3.1, value: { min: 6, max: 18 }, weight: 8, twoHanded: false, conductive: true },
      { name: "Brass Bell", spawnChance: 2.4, value: { min: 48, max: 80 }, weight: 0, twoHanded: false, conductive: true },
      { name: "Remote", spawnChance: 1.8, value: { min: 2, max: 10 }, weight: 0, twoHanded: false, conductive: true },
      { name: "Apparatus", spawnChance: "Special", value: { min: 80, max: 80 }, weight: 32, twoHanded: false, conductive: true },
      { name: "Key", spawnChance: 3, value: { min: 3, max: 3 }, weight: 0, twoHanded: false, conductive: true }
    ],
    indoorEntities: [
      { name: "Nutcracker", spawnChance: 12, powerLevel: 1, maxCount: 10, dangerous: true },
      { name: "Bracken", spawnChance: 9, powerLevel: 3, maxCount: 1, dangerous: true },
      { name: "Jester", spawnChance: 8.5, powerLevel: 3, maxCount: 1, dangerous: true },
      { name: "Butler", spawnChance: 8, powerLevel: 2, maxCount: 7, dangerous: true },
      { name: "Thumper", spawnChance: 8, powerLevel: 3, maxCount: 4, dangerous: true },
      { name: "Bunker Spider", spawnChance: 8, powerLevel: 2, maxCount: 1, dangerous: true },
      { name: "Snare Flea", spawnChance: 8, powerLevel: 1, maxCount: 4, dangerous: true },
      { name: "Coil Head", spawnChance: 8, powerLevel: 1, maxCount: 5, dangerous: true },
      { name: "Hoarding Bug", spawnChance: 8, powerLevel: 1, maxCount: 8, dangerous: false },
      { name: "Hygrodere", spawnChance: 8, powerLevel: 1, maxCount: 2, dangerous: true },
      { name: "Spore Lizard", spawnChance: 8, powerLevel: 1, maxCount: 2, dangerous: false },
      { name: "Masked", spawnChance: 5, powerLevel: 1, maxCount: 10, dangerous: true },
      { name: "Ghost Girl", spawnChance: 2, powerLevel: 2, maxCount: 1, dangerous: true },
      { name: "Maneater", spawnChance: 1.5, powerLevel: 2, maxCount: 1, dangerous: true }
    ],
    outdoorEntities: [
      { name: "Old Bird", spawnChance: 60, powerLevel: 3, maxCount: 20, dangerous: true },
      { name: "Eyeless Dog", spawnChance: 15, powerLevel: 2, maxCount: 8, dangerous: true },
      { name: "Forest Keeper", spawnChance: 15, powerLevel: 3, maxCount: 3, dangerous: true },
      { name: "Baboon Hawk", spawnChance: 7, powerLevel: 0.5, maxCount: 15, dangerous: true },
      { name: "Earth Leviathan", spawnChance: 3, powerLevel: 2, maxCount: 3, dangerous: true }
    ],
    daytimeEntities: [
      { name: "Manticoil", spawnChance: 60, powerLevel: 1, maxCount: 16, dangerous: false },
      { name: "Roaming Locust", spawnChance: 25, powerLevel: 1, maxCount: 5, dangerous: false },
      { name: "Circuit Bee", spawnChance: 15, powerLevel: 1, maxCount: 6, dangerous: true }
    ],
    nighttimeStart: "3:00 PM"
  }
];

// Moon data - PART 6: Custom Moons and Final Export

export const CUSTOM_MOONS = [
  {
    name: "47-Serenity",
    cost: 0,
    difficulty: "C",
    facility: { x: 3, y: 6 },
    hazards: ["botanical_gardens", "unstable_greenhouse_glass", "overgrown_pathways"],
    description: "Gentle hills surrounding greenhouse research facility",
    weatherTypes: ["clear", "rainy", "foggy", "flooded"],
    mapSizeMultiplier: 1.3,
    defaultInterior: "Factory",
    interiorChances: { 
      Factory: 70, 
      Mansion: 25, 
      Mineshaft: 5 
    },
    min: 10,
    max: 16,
    scrapRange: { min: 12, max: 16 },
    maxIndoorPower: 6,
    maxOutdoorPower: 5,
    maxDaytimePower: 12,
    scrapItems: [
      { name: "Seed Vault", spawnChance: 17.5, value: { min: 45, max: 85 }, weight: 12, twoHanded: false, conductive: false },
      { name: "Botanical Scanner", spawnChance: 15.2, value: { min: 32, max: 68 }, weight: 8, twoHanded: false, conductive: true },
      { name: "Growth Hormone Vial", spawnChance: 13.8, value: { min: 28, max: 56 }, weight: 2, twoHanded: false, conductive: false },
      { name: "Hydroponic Unit", spawnChance: 12.1, value: { min: 65, max: 110 }, weight: 22, twoHanded: true, conductive: true },
      { name: "Research Journal", spawnChance: 10.7, value: { min: 15, max: 35 }, weight: 3, twoHanded: false, conductive: false },
      { name: "Chlorophyll Extractor", spawnChance: 8.9, value: { min: 38, max: 72 }, weight: 14, twoHanded: false, conductive: true },
      { name: "Tattered Metal Sheet", spawnChance: 6.8, value: { min: 10, max: 22 }, weight: 26, twoHanded: false, conductive: true },
      { name: "Large Axle", spawnChance: 5.4, value: { min: 36, max: 56 }, weight: 16, twoHanded: true, conductive: true },
      { name: "Scrap Metal", spawnChance: 4.2, value: { min: 6, max: 18 }, weight: 8, twoHanded: false, conductive: true },
      { name: "Old Phone", spawnChance: 2.4, value: { min: 48, max: 64 }, weight: 8, twoHanded: false, conductive: true },
      { name: "Apparatus", spawnChance: "Special", value: { min: 80, max: 80 }, weight: 32, twoHanded: false, conductive: true },
      { name: "Key", spawnChance: 3, value: { min: 3, max: 3 }, weight: 0, twoHanded: false, conductive: true }
    ],
    indoorEntities: [
      { name: "Vine Lurker", spawnChance: 28, powerLevel: 2, maxCount: 2, dangerous: true },
      { name: "Spore Lizard", spawnChance: 22, powerLevel: 1, maxCount: 2, dangerous: false },
      { name: "Hoarding Bug", spawnChance: 18, powerLevel: 1, maxCount: 8, dangerous: false },
      { name: "Snare Flea", spawnChance: 12, powerLevel: 1, maxCount: 4, dangerous: true },
      { name: "Pollen Drone", spawnChance: 10, powerLevel: 1, maxCount: 3, dangerous: false },
      { name: "Hygrodere", spawnChance: 6, powerLevel: 1, maxCount: 2, dangerous: true },
      { name: "Bunker Spider", spawnChance: 4, powerLevel: 2, maxCount: 1, dangerous: true }
    ],
    outdoorEntities: [
      { name: "Garden Sprite", spawnChance: 45, powerLevel: 1, maxCount: 8, dangerous: false },
      { name: "Eyeless Dog", spawnChance: 25, powerLevel: 2, maxCount: 8, dangerous: true },
      { name: "Baboon Hawk", spawnChance: 20, powerLevel: 0.5, maxCount: 15, dangerous: true },
      { name: "Earth Leviathan", spawnChance: 10, powerLevel: 2, maxCount: 3, dangerous: true }
    ],
    daytimeEntities: [
      { name: "Pollinator Bot", spawnChance: 35, powerLevel: 1, maxCount: 12, dangerous: false },
      { name: "Manticoil", spawnChance: 30, powerLevel: 1, maxCount: 16, dangerous: false },
      { name: "Circuit Bee", spawnChance: 20, powerLevel: 1, maxCount: 6, dangerous: true },
      { name: "Roaming Locust", spawnChance: 15, powerLevel: 1, maxCount: 5, dangerous: false }
    ],
    nighttimeStart: "6:00 PM"
  },
  {
    name: "92-Prometheus", 
    cost: 250,
    difficulty: "B",
    facility: { x: 6, y: 6 },
    hazards: ["research_facility_complex", "laser_security_grid", "containment_chambers"],
    description: "Multi-level laboratory complex built into hillside",
    weatherTypes: ["clear", "rainy", "stormy", "foggy", "eclipsed"],
    mapSizeMultiplier: 1.5,
    defaultInterior: "Factory",
    interiorChances: { 
      Factory: 80, 
      Mansion: 15, 
      Mineshaft: 5 
    },
    min: 12,
    max: 18,
    scrapRange: { min: 16, max: 21 },
    maxIndoorPower: 9,
    maxOutdoorPower: 7,
    maxDaytimePower: 15,
    scrapItems: [
      { name: "Quantum Processor", spawnChance: 15.8, value: { min: 88, max: 156 }, weight: 18, twoHanded: false, conductive: true },
      { name: "Plasma Containment Cell", spawnChance: 13.5, value: { min: 92, max: 180 }, weight: 24, twoHanded: true, conductive: true },
      { name: "Neural Interface Headset", spawnChance: 12.2, value: { min: 65, max: 125 }, weight: 6, twoHanded: false, conductive: true },
      { name: "Cryogenic Sample Tube", spawnChance: 11.8, value: { min: 45, max: 85 }, weight: 4, twoHanded: false, conductive: false },
      { name: "Holographic Projector", spawnChance: 10.1, value: { min: 72, max: 140 }, weight: 15, twoHanded: false, conductive: true },
      { name: "Experimental Battery", spawnChance: 8.7, value: { min: 28, max: 58 }, weight: 8, twoHanded: false, conductive: true },
      { name: "V-Type Engine", spawnChance: 6.9, value: { min: 20, max: 56 }, weight: 16, twoHanded: true, conductive: true },
      { name: "Cash Register", spawnChance: 5.3, value: { min: 80, max: 160 }, weight: 84, twoHanded: true, conductive: true },
      { name: "Tattered Metal Sheet", spawnChance: 4.8, value: { min: 10, max: 22 }, weight: 26, twoHanded: false, conductive: true },
      { name: "Large Axle", spawnChance: 4.1, value: { min: 36, max: 56 }, weight: 16, twoHanded: true, conductive: true },
      { name: "Scrap Metal", spawnChance: 3.8, value: { min: 6, max: 18 }, weight: 8, twoHanded: false, conductive: true },
      { name: "Apparatus", spawnChance: "Special", value: { min: 80, max: 80 }, weight: 32, twoHanded: false, conductive: true },
      { name: "Key", spawnChance: 3, value: { min: 3, max: 3 }, weight: 0, twoHanded: false, conductive: true }
    ],
    indoorEntities: [
      { name: "Prototype Hunter", spawnChance: 22, powerLevel: 3, maxCount: 1, dangerous: true },
      { name: "Thumper", spawnChance: 18, powerLevel: 3, maxCount: 4, dangerous: true },
      { name: "Snare Flea", spawnChance: 15, powerLevel: 1, maxCount: 4, dangerous: true },
      { name: "Bunker Spider", spawnChance: 12, powerLevel: 2, maxCount: 1, dangerous: true },
      { name: "Data Wraith", spawnChance: 10, powerLevel: 2, maxCount: 2, dangerous: true },
      { name: "Bracken", spawnChance: 8, powerLevel: 3, maxCount: 1, dangerous: true },
      { name: "Hoarding Bug", spawnChance: 7, powerLevel: 1, maxCount: 8, dangerous: false },
      { name: "Hygrodere", spawnChance: 5, powerLevel: 1, maxCount: 2, dangerous: true },
      { name: "Nutcracker", spawnChance: 2, powerLevel: 1, maxCount: 10, dangerous: true },
      { name: "Coil Head", spawnChance: 1, powerLevel: 1, maxCount: 5, dangerous: true }
    ],
    outdoorEntities: [
      { name: "Security Drone", spawnChance: 35, powerLevel: 2, maxCount: 6, dangerous: true },
      { name: "Eyeless Dog", spawnChance: 25, powerLevel: 2, maxCount: 8, dangerous: true },
      { name: "Escaped Subject-X", spawnChance: 20, powerLevel: 3, maxCount: 2, dangerous: true },
      { name: "Forest Keeper", spawnChance: 15, powerLevel: 3, maxCount: 3, dangerous: true },
      { name: "Earth Leviathan", spawnChance: 5, powerLevel: 2, maxCount: 3, dangerous: true }
    ],
    daytimeEntities: [
      { name: "Maintenance Bot", spawnChance: 40, powerLevel: 1, maxCount: 10, dangerous: false },
      { name: "Manticoil", spawnChance: 25, powerLevel: 1, maxCount: 16, dangerous: false },
      { name: "Circuit Bee", spawnChance: 20, powerLevel: 1, maxCount: 6, dangerous: true },
      { name: "Roaming Locust", spawnChance: 15, powerLevel: 1, maxCount: 5, dangerous: false }
    ],
    nighttimeStart: "4:00 PM"
  },
  {
    name: "13-Nexus",
    cost: 700,
    difficulty: "A", 
    facility: { x: 8, y: 8 },
    hazards: ["corporate_megastructure", "executive_elevator_system", "automated_defense_grid"],
    description: "Corporate district with massive tower megastructure",
    weatherTypes: ["clear", "stormy", "foggy", "eclipsed"],
    mapSizeMultiplier: 2.1,
    defaultInterior: "Mansion",
    interiorChances: { 
      Factory: 20, 
      Mansion: 75, 
      Mineshaft: 5 
    },
    min: 25,
    max: 38,
    scrapRange: { min: 24, max: 29 },
    maxIndoorPower: 16,
    maxOutdoorPower: 9,
    maxDaytimePower: 18,
    scrapItems: [
      { name: "Executive Desk Set", spawnChance: 14.2, value: { min: 140, max: 260 }, weight: 20, twoHanded: true, conductive: false },
      { name: "Quantum Stock Terminal", spawnChance: 12.8, value: { min: 180, max: 340 }, weight: 25, twoHanded: true, conductive: true },
      { name: "Diamond Cufflinks", spawnChance: 11.4, value: { min: 95, max: 185 }, weight: 1, twoHanded: false, conductive: false },
      { name: "Holographic Conference Table", spawnChance: 11.1, value: { min: 220, max: 380 }, weight: 35, twoHanded: true, conductive: true },
      { name: "Corporate Seal", spawnChance: 10.7, value: { min: 120, max: 240 }, weight: 8, twoHanded: false, conductive: false },
      { name: "Neural Enhancement Chip", spawnChance: 9.3, value: { min: 88, max: 156 }, weight: 2, twoHanded: false, conductive: true },
      { name: "Painting", spawnChance: 8.5, value: { min: 60, max: 124 }, weight: 31, twoHanded: true, conductive: false },
      { name: "Fancy Lamp", spawnChance: 7.1, value: { min: 60, max: 128 }, weight: 21, twoHanded: true, conductive: true },
      { name: "Gold Bar", spawnChance: 5.8, value: { min: 100, max: 210 }, weight: 77, twoHanded: false, conductive: true },
      { name: "Cash Register", spawnChance: 4.2, value: { min: 80, max: 160 }, weight: 84, twoHanded: true, conductive: true },
      { name: "V-Type Engine", spawnChance: 1.9, value: { min: 20, max: 56 }, weight: 16, twoHanded: true, conductive: true },
      { name: "Apparatus", spawnChance: "Special", value: { min: 80, max: 80 }, weight: 32, twoHanded: false, conductive: true },
      { name: "Key", spawnChance: 3, value: { min: 3, max: 3 }, weight: 0, twoHanded: false, conductive: true }
    ],
    indoorEntities: [
      { name: "Corporate Enforcer", spawnChance: 20, powerLevel: 3, maxCount: 2, dangerous: true },
      { name: "Nutcracker", spawnChance: 18, powerLevel: 1, maxCount: 10, dangerous: true },
      { name: "Jester", spawnChance: 15, powerLevel: 3, maxCount: 1, dangerous: true },
      { name: "Executive Phantom", spawnChance: 12, powerLevel: 2, maxCount: 2, dangerous: true },
      { name: "Bracken", spawnChance: 10, powerLevel: 3, maxCount: 1, dangerous: true },
      { name: "Butler", spawnChance: 8, powerLevel: 2, maxCount: 7, dangerous: true },
      { name: "Snare Flea", spawnChance: 6, powerLevel: 1, maxCount: 4, dangerous: true },
      { name: "Bunker Spider", spawnChance: 4, powerLevel: 2, maxCount: 1, dangerous: true },
      { name: "Ghost Girl", spawnChance: 3, powerLevel: 2, maxCount: 1, dangerous: true },
      { name: "Coil Head", spawnChance: 2, powerLevel: 1, maxCount: 5, dangerous: true },
      { name: "Hygrodere", spawnChance: 2, powerLevel: 1, maxCount: 2, dangerous: true }
    ],
    outdoorEntities: [
      { name: "Security Mech", spawnChance: 40, powerLevel: 3, maxCount: 4, dangerous: true },
      { name: "Eyeless Dog", spawnChance: 25, powerLevel: 2, maxCount: 8, dangerous: true },
      { name: "Corporate Sentinel", spawnChance: 20, powerLevel: 2, maxCount: 8, dangerous: true },
      { name: "Forest Keeper", spawnChance: 10, powerLevel: 3, maxCount: 3, dangerous: true },
      { name: "Earth Leviathan", spawnChance: 5, powerLevel: 2, maxCount: 3, dangerous: true }
    ],
    daytimeEntities: [
      { name: "Executive Assistant Bot", spawnChance: 35, powerLevel: 1, maxCount: 15, dangerous: false },
      { name: "Manticoil", spawnChance: 25, powerLevel: 1, maxCount: 16, dangerous: false },
      { name: "Corporate Courier", spawnChance: 20, powerLevel: 1, maxCount: 8, dangerous: false },
      { name: "Circuit Bee", spawnChance: 15, powerLevel: 1, maxCount: 6, dangerous: true },
      { name: "Roaming Locust", spawnChance: 5, powerLevel: 1, maxCount: 5, dangerous: false }
    ],
    nighttimeStart: "2:00 PM"
  },
  {
    name: "00-Pandemonium",
    cost: 2000,
    difficulty: "S+++",
    facility: { x: 4, y: 4 },
    hazards: ["fractured_reality_complex", "dimensional_rifts", "void_zones"],
    description: "Chaotic terrain with reality distortions and impossible geometry",
    weatherTypes: ["stormy", "eclipsed"],
    mapSizeMultiplier: 1.8,
    defaultInterior: "Factory",
    interiorChances: { 
      Factory: 50, 
      Mansion: 30, 
      Mineshaft: 20 
    },
    min: 22,
    max: 32,
    scrapRange: { min: 22, max: 28 },
    maxIndoorPower: 25,
    maxOutdoorPower: 20,
    maxDaytimePower: 30,
    scrapItems: [
      { name: "Void Crystal", spawnChance: 15.5, value: { min: 200, max: 400 }, weight: 15, twoHanded: false, conductive: false },
      { name: "Reality Anchor", spawnChance: 13.2, value: { min: 180, max: 350 }, weight: 28, twoHanded: true, conductive: true },
      { name: "Nightmare Fuel Canister", spawnChance: 11.8, value: { min: 150, max: 300 }, weight: 12, twoHanded: false, conductive: false },
      { name: "Distortion Engine", spawnChance: 11.4, value: { min: 220, max: 380 }, weight: 35, twoHanded: true, conductive: true },
      { name: "Chaos Orb", spawnChance: 10.1, value: { min: 95, max: 185 }, weight: 6, twoHanded: false, conductive: true },
      { name: "Dimensional Key", spawnChance: 8.7, value: { min: 120, max: 240 }, weight: 3, twoHanded: false, conductive: false },
      { name: "Corrupted Gold Bar", spawnChance: 7.3, value: { min: 200, max: 250 }, weight: 10, twoHanded: false, conductive: true },
      { name: "Twisted Painting", spawnChance: 5.9, value: { min: 160, max: 320 }, weight: 18, twoHanded: false, conductive: false },
      { name: "Phantom Cash Register", spawnChance: 4.6, value: { min: 140, max: 300 }, weight: 32, twoHanded: true, conductive: true },
      { name: "Warped V-Type Engine", spawnChance: 3.8, value: { min: 60, max: 144 }, weight: 48, twoHanded: true, conductive: true },
      { name: "Unstable Apparatus", spawnChance: 2.2, value: { min: 100, max: 200 }, weight: 20, twoHanded: false, conductive: true },
      { name: "Madness Shard", spawnChance: 2.5, value: { min: 80, max: 160 }, weight: 4, twoHanded: false, conductive: false },
      { name: "Key", spawnChance: 3, value: { min: 3, max: 3 }, weight: 0, twoHanded: false, conductive: true }
    ],
    indoorEntities: [
      { name: "Void Stalker", spawnChance: 18, powerLevel: 4, maxCount: 3, dangerous: true },
      { name: "Reality Wraith", spawnChance: 16, powerLevel: 3, maxCount: 4, dangerous: true },
      { name: "Chaos Spawn", spawnChance: 14, powerLevel: 2, maxCount: 6, dangerous: true },
      { name: "Jester", spawnChance: 12, powerLevel: 3, maxCount: 1, dangerous: true },
      { name: "Nutcracker", spawnChance: 10, powerLevel: 1, maxCount: 10, dangerous: true },
      { name: "Dimensional Horror", spawnChance: 8, powerLevel: 5, maxCount: 1, dangerous: true },
      { name: "Bracken", spawnChance: 6, powerLevel: 3, maxCount: 1, dangerous: true },
      { name: "Ghost Girl", spawnChance: 5, powerLevel: 2, maxCount: 3, dangerous: true },
      { name: "Coil Head", spawnChance: 4, powerLevel: 1, maxCount: 5, dangerous: true },
      { name: "Thumper", spawnChance: 3, powerLevel: 3, maxCount: 4, dangerous: true },
      { name: "Butler", spawnChance: 2, powerLevel: 2, maxCount: 7, dangerous: true },
      { name: "Masked", spawnChance: 2, powerLevel: 1, maxCount: 10, dangerous: true }
    ],
    outdoorEntities: [
      { name: "Apocalypse Beast", spawnChance: 30, powerLevel: 4, maxCount: 5, dangerous: true },
      { name: "Void Hunter", spawnChance: 25, powerLevel: 3, maxCount: 8, dangerous: true },
      { name: "Old Bird", spawnChance: 20, powerLevel: 3, maxCount: 20, dangerous: true },
      { name: "Reality Tear", spawnChance: 15, powerLevel: 2, maxCount: 10, dangerous: true },
      { name: "Forest Keeper", spawnChance: 5, powerLevel: 3, maxCount: 3, dangerous: true },
      { name: "Earth Leviathan", spawnChance: 5, powerLevel: 2, maxCount: 3, dangerous: true }
    ],
    daytimeEntities: [
      { name: "Nightmare Swarm", spawnChance: 35, powerLevel: 1, maxCount: 30, dangerous: true },
      { name: "Chaos Sprite", spawnChance: 25, powerLevel: 2, maxCount: 15, dangerous: true },
      { name: "Void Mite", spawnChance: 20, powerLevel: 1, maxCount: 20, dangerous: true },
      { name: "Circuit Bee", spawnChance: 15, powerLevel: 1, maxCount: 6, dangerous: true },
      { name: "Dimensional Parasite", spawnChance: 5, powerLevel: 3, maxCount: 6, dangerous: true }
    ],
    nighttimeStart: "12:00 PM"
  }
];

export const moons = [
  ...TIER_1_MOONS,
  ...TIER_2_MOONS, 
  ...TIER_3_MOONS,
  ...CUSTOM_MOONS
];