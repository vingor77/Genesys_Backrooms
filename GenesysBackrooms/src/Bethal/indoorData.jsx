// Enhanced indoorData.jsx - Adding Apparatus Room

// Door types
export const DOOR_TYPES = {
  OPEN: { 
    name: 'Open Door', 
    color: 'bg-green-200', 
    passable: true,
    lockable: false 
  },
  CLOSED: { 
    name: 'Closed Door', 
    color: 'bg-yellow-200', 
    passable: false,
    lockable: true 
  },
  LOCKED: { 
    name: 'Locked Door', 
    color: 'bg-red-200', 
    passable: false,
    lockable: true 
  },
  SECURE_OPEN: { 
    name: 'Secure Door (Open)', 
    color: 'bg-blue-200', 
    passable: true,
    lockable: false,
    requiresKeycard: true 
  },
  SECURE_CLOSED: { 
    name: 'Secure Door (Closed)', 
    color: 'bg-purple-200', 
    passable: false,
    lockable: false,
    requiresKeycard: true 
  }
};

// Trap types
export const TRAP_TYPES = {
  LANDMINE: { name: 'Landmine', danger: 'Lethal', detection: 'Easy', roll: "None", wounds: 8, strain: 4 },
  SPIKE_TRAP: { name: 'Spike Trap', danger: 'High', detection: 'Medium', roll: "None", wounds: 4, strain: 6 },
  TURRET: { name: 'Turret', danger: 'High', detection: 'Easy', roll: "3 separate times (1 Yellow 2 Green)", wounds: "(3 + Successes) * 3", strain: "(1 + Advantages) * 3" },
  BEAR_TRAP: { name: 'Bear Trap', danger: 'Medium', detection: 'Hard', roll: "None", wounds: 6, strain: 2 },
  PITFALL: { name: 'Pitfall', danger: 'Lethal', detection: 'Easy', roll: "Difficulty 2 Athletics/Coordination", wounds: "Death", strain: 0 },
  LASER_GRID: { name: 'Laser Grid', danger: 'High', detection: 'Easy', roll: "Difficulty 2 Athletics/Coordination", wounds: 8, strain: 6 }
};

// Room types with door spawn chances (significantly reduced)
export const ROOM_TYPES = {
  ENTRANCE: { 
    name: 'Main Entrance', 
    color: 'bg-green-200 border-2 border-green-500',
    scrapChance: 0,
    entitySpawnChance: 0.05,
    trapChance: 0,
    doorChance: 0,
    preferredSize: { width: 2, height: 2 }
  },
  FIRE_EXIT: { 
    name: 'Fire Exit', 
    color: 'bg-red-200 border-2 border-red-500',
    scrapChance: 0,
    entitySpawnChance: 0,
    trapChance: 0,
    doorChance: 0,
    preferredSize: { width: 1, height: 1 }
  },
  HALLWAY: { 
    name: 'Hallway', 
    color: 'bg-gray-200 border border-gray-400',
    scrapChance: 0.1,
    entitySpawnChance: 0.15,
    trapChance: 0.05,
    doorChance: 0,
    preferredSize: { width: 1, height: 1 }
  },
  CORRIDOR: { 
    name: 'Long Corridor', 
    color: 'bg-gray-300 border border-gray-500',
    scrapChance: 0.1,
    entitySpawnChance: 0.2,
    trapChance: 0.1,
    doorChance: 0,
    preferredSize: { width: 1, height: 3 }
  },
  STORAGE: { 
    name: 'Storage Room', 
    color: 'bg-yellow-100 border-2 border-yellow-400',
    scrapChance: 0.85,
    entitySpawnChance: 0.1,
    trapChance: 0.1,
    doorChance: 0,
    preferredSize: { width: 2, height: 2 }
  },
  SMALL_STORAGE: { 
    name: 'Storage Closet', 
    color: 'bg-yellow-100 border border-yellow-300',
    scrapChance: 0.70,
    entitySpawnChance: 0.05,
    trapChance: 0.15,
    doorChance: 0,
    preferredSize: { width: 1, height: 1 }
  },
  OFFICE: { 
    name: 'Office', 
    color: 'bg-blue-100 border-2 border-blue-400',
    scrapChance: 0.50,
    entitySpawnChance: 0.2,
    trapChance: 0.15,
    doorChance: 0,
    preferredSize: { width: 2, height: 2 }
  },
  SMALL_OFFICE: { 
    name: 'Cubicle', 
    color: 'bg-blue-50 border border-blue-300',
    scrapChance: 0.35,
    entitySpawnChance: 0.15,
    trapChance: 0.1,
    doorChance: 0,
    preferredSize: { width: 1, height: 1 }
  },
  MACHINERY: { 
    name: 'Machinery Room', 
    color: 'bg-orange-100 border-2 border-orange-400',
    scrapChance: 0.80,
    entitySpawnChance: 0.3,
    trapChance: 0.25,
    doorChance: 0,
    preferredSize: { width: 3, height: 2 }
  },
  CAFETERIA: { 
    name: 'Cafeteria', 
    color: 'bg-pink-100 border-2 border-pink-400',
    scrapChance: 0.25,
    entitySpawnChance: 0.15,
    trapChance: 0.1,
    doorChance: 0,
    preferredSize: { width: 3, height: 2 }
  },
  LABORATORY: { 
    name: 'Laboratory', 
    color: 'bg-cyan-100 border-2 border-cyan-400',
    scrapChance: 0.80,
    entitySpawnChance: 0.4,
    trapChance: 0.3,
    doorChance: 0,
    preferredSize: { width: 2, height: 2 }
  },
  VAULT: { 
    name: 'Vault/Safe Room', 
    color: 'bg-purple-100 border-2 border-purple-500',
    scrapChance: 0.95,
    entitySpawnChance: 0.5,
    trapChance: 0.4,
    doorChance: 0,
    preferredSize: { width: 2, height: 2 }
  },
  BASEMENT: { 
    name: 'Basement Area', 
    color: 'bg-gray-200 border-2 border-gray-600',
    scrapChance: 0.50,
    entitySpawnChance: 0.6,
    trapChance: 0.35,
    doorChance: 0,
    preferredSize: { width: 2, height: 2 }
  },
  BEDROOM: { 
    name: 'Bedroom', 
    color: 'bg-pink-50 border-2 border-pink-300',
    scrapChance: 0.40,
    entitySpawnChance: 0.2,
    trapChance: 0.1,
    doorChance: 0,
    preferredSize: { width: 2, height: 2 }
  },
  KITCHEN: { 
    name: 'Kitchen', 
    color: 'bg-amber-100 border-2 border-amber-500',
    scrapChance: 0.30,
    entitySpawnChance: 0.15,
    trapChance: 0.2,
    doorChance: 0,
    preferredSize: { width: 2, height: 2 }
  },
  LIBRARY: { 
    name: 'Library', 
    color: 'bg-amber-50 border-2 border-amber-300',
    scrapChance: 0.25,
    entitySpawnChance: 0.25,
    trapChance: 0.05,
    doorChance: 0,
    preferredSize: { width: 3, height: 2 }
  },
  TUNNEL: { 
    name: 'Mine Tunnel', 
    color: 'bg-amber-200 border-2 border-amber-700',
    scrapChance: 0.40,
    entitySpawnChance: 0.4,
    trapChance: 0.3,
    doorChance: 0,
    preferredSize: { width: 1, height: 4 }
  },
  SHAFT: { 
    name: 'Vertical Shaft', 
    color: 'bg-slate-200 border-2 border-slate-700',
    scrapChance: 0.25,
    entitySpawnChance: 0.5,
    trapChance: 0.4,
    doorChance: 0,
    preferredSize: { width: 1, height: 1 }
  },
  SECURITY: { 
    name: 'Security Room', 
    color: 'bg-red-100 border-2 border-red-500',
    scrapChance: 0.35,
    entitySpawnChance: 0.3,
    trapChance: 0.5,
    doorChance: 0,
    preferredSize: { width: 2, height: 1 }
  },
  // ✅ NEW: Apparatus Room
  APPARATUS: {
    name: 'Apparatus Room',
    color: 'bg-violet-200 border-3 border-violet-600',
    scrapChance: 0, // No random scrap - apparatus is guaranteed
    entitySpawnChance: 0.4, // Moderate entity spawn chance
    trapChance: 0.2, // Some trap chance for danger
    doorChance: 0,
    preferredSize: { width: 2, height: 1 }, // 2x1 room as requested
    isSpecialRoom: true, // Mark as special room
    uniquePerFacility: true, // Only one per facility
    guaranteedApparatus: true // Always has apparatus
  },
  VENT: { 
    name: 'Vent', 
    color: 'bg-gray-300 border border-gray-500',
    scrapChance: 0,
    entitySpawnChance: 1.0,
    trapChance: 0,
    doorChance: 0,
    preferredSize: { width: 1, height: 1 }
  },
  STAIRCASE_UP: { 
    name: 'Staircase Up', 
    color: 'bg-indigo-200 border-2 border-indigo-500',
    scrapChance: 0.10,
    entitySpawnChance: 0.05,
    trapChance: 0.05,
    doorChance: 0,
    preferredSize: { width: 1, height: 1 }
  },
  STAIRCASE_DOWN: { 
    name: 'Staircase Down', 
    color: 'bg-indigo-200 border-2 border-indigo-500',
    scrapChance: 0.10,
    entitySpawnChance: 0.05,
    trapChance: 0.05,
    doorChance: 0,
    preferredSize: { width: 1, height: 1 }
  },
  STAIRCASE_BOTH: { 
    name: 'Staircase Both', 
    color: 'bg-indigo-200 border-2 border-indigo-500',
    scrapChance: 0.10,
    entitySpawnChance: 0.05,
    trapChance: 0.05,
    doorChance: 0,
    preferredSize: { width: 1, height: 1 }
  }
};