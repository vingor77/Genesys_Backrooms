import React, { useState, useCallback } from 'react';
import {
  AppBar, Toolbar, Typography, Container, Grid, Card, CardContent,
  Button, Dialog, DialogTitle, DialogContent, Box, Chip, Table,
  TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Select, MenuItem, FormControl, InputLabel, Tabs, Tab, Alert,
  Tooltip, LinearProgress, DialogActions
} from '@mui/material';
import { 
  Map, Refresh, Security, Dangerous, AccessTime, Warning, Info
} from '@mui/icons-material';

// Enhanced Game Data with Accurate Spawning Rules
const MOONS = {
  'Company Building': {
    difficulty: 'S', weather: ['Clear'], minScrapValue: 0, maxScrapValue: 0,
    scrapSpawnRange: { min: 0, max: 0 }, mapSizeMultiplier: 1.0,
    entities: { inside: [], outside: [], daytime: [] },
    roomCount: { min: 3, max: 5 }, hazardLevel: 0, cost: 0,
    powerLevels: { maxIndoor: 0, maxOutdoor: 0, maxDaytime: 0 },
    interiorTypes: { 'Facility': 100.0, 'Mansion': 0.0, 'Mineshaft': 0.0 },
    nightStartTime: 1080, // 6:00 PM (never has outdoor entities anyway)
    description: 'The Company headquarters. Safe but offers no scrap value.'
  },
  'Experimentation': {
    difficulty: 'B', weather: ['Clear', 'Dusty', 'Foggy'], minScrapValue: 120, maxScrapValue: 250,
    scrapSpawnRange: { min: 8, max: 14 }, mapSizeMultiplier: 1.0,
    entities: {
      inside: ['Bracken', 'Thumper', 'Spiders', 'Hoarding Bug', 'Coil-Head', 'Snare Flea', 'Hygrodere'],
      outside: ['Eyeless Dog', 'Forest Keeper', 'Manticoil', 'Roaming Locust'],
      daytime: ['Manticoil', 'Roaming Locust', 'Circuit Bees']
    },
    roomCount: { min: 8, max: 12 }, hazardLevel: 2, cost: 0,
    powerLevels: { maxIndoor: 4, maxOutdoor: 6, maxDaytime: 15 },
    interiorTypes: { 'Facility': 98.0, 'Mansion': 1.5, 'Mineshaft': 0.5 },
    eclipseSpawn: { minIndoorEntities: 1, minOutdoorEntities: 2 },
    nightStartTime: 1080, // 6:00 PM - Standard night start
    description: 'A moderately dangerous industrial facility with standard Company security protocols.'
  },
  'Assurance': {
    difficulty: 'D', weather: ['Clear', 'Overcast', 'Dusty'], minScrapValue: 80, maxScrapValue: 180,
    scrapSpawnRange: { min: 6, max: 12 }, mapSizeMultiplier: 1.0,
    entities: {
      inside: ['Spiders', 'Hoarding Bug', 'Hygrodere', 'Snare Flea'],
      outside: ['Manticoil', 'Eyeless Dog'], daytime: ['Manticoil', 'Circuit Bees']
    },
    roomCount: { min: 8, max: 12 }, hazardLevel: 1, cost: 0,
    powerLevels: { maxIndoor: 2, maxOutdoor: 4, maxDaytime: 15 },
    interiorTypes: { 'Facility': 98.5, 'Mansion': 1.0, 'Mineshaft': 0.5 },
    eclipseSpawn: { minIndoorEntities: 0, minOutdoorEntities: 1 },
    nightStartTime: 1140, // 7:00 PM - Safer moon, later night start
    description: 'The safest operational moon with minimal hostile presence but lower scrap yields.'
  },
  'Vow': {
    difficulty: 'C', weather: ['Clear', 'Stormy', 'Foggy', 'Overcast'], minScrapValue: 100, maxScrapValue: 200,
    scrapSpawnRange: { min: 7, max: 13 }, mapSizeMultiplier: 1.15,
    entities: {
      inside: ['Bracken', 'Thumper', 'Spiders', 'Hoarding Bug', 'Coil-Head', 'Snare Flea', 'Hygrodere'],
      outside: ['Eyeless Dog', 'Forest Keeper', 'Manticoil'],
      daytime: ['Manticoil', 'Roaming Locust', 'Circuit Bees']
    },
    roomCount: { min: 9, max: 14 }, hazardLevel: 2, cost: 0,
    powerLevels: { maxIndoor: 6, maxOutdoor: 8, maxDaytime: 20 },
    interiorTypes: { 'Facility': 100.0, 'Mansion': 0.0, 'Mineshaft': 0.0 },
    eclipseSpawn: { minIndoorEntities: 1, minOutdoorEntities: 2 },
    nightStartTime: 1080, // 6:00 PM - Standard night start
    description: 'A balanced facility offering moderate risk and reward ratios with high Bracken spawn rates.'
  },
  'Offense': {
    difficulty: 'B', weather: ['Clear', 'Dusty', 'Foggy', 'Stormy'], minScrapValue: 140, maxScrapValue: 220,
    scrapSpawnRange: { min: 9, max: 17 }, mapSizeMultiplier: 1.35,
    entities: {
      inside: ['Bracken', 'Thumper', 'Spiders', 'Hoarding Bug', 'Coil-Head', 'Jester', 'Nutcracker', 'Snare Flea', 'Hygrodere'],
      outside: ['Eyeless Dog', 'Forest Keeper', 'Baboon Hawk', 'Manticoil'],
      daytime: ['Manticoil', 'Baboon Hawk', 'Circuit Bees']
    },
    roomCount: { min: 10, max: 15 }, hazardLevel: 3, cost: 0,
    powerLevels: { maxIndoor: 8, maxOutdoor: 10, maxDaytime: 25 },
    interiorTypes: { 'Facility': 98.0, 'Mansion': 1.5, 'Mineshaft': 0.5 },
    eclipseSpawn: { minIndoorEntities: 2, minOutdoorEntities: 3 },
    nightStartTime: 1020, // 5:00 PM - More dangerous moon, earlier night start
    description: 'A military installation with increased security measures and hostile entities.'
  },
  'Rend': {
    difficulty: 'A', weather: ['Clear', 'Eclipsed', 'Foggy', 'Dusty'], minScrapValue: 180, maxScrapValue: 350,
    scrapSpawnRange: { min: 12, max: 20 }, mapSizeMultiplier: 1.7,
    entities: {
      inside: ['Bracken', 'Thumper', 'Spiders', 'Hoarding Bug', 'Coil-Head', 'Jester', 'Nutcracker', 'Masked', 'Ghost Girl', 'Snare Flea', 'Hygrodere'],
      outside: ['Eyeless Dog', 'Forest Keeper', 'Baboon Hawk', 'Earth Leviathan'],
      daytime: []
    },
    roomCount: { min: 14, max: 22 }, hazardLevel: 4, cost: 550,
    powerLevels: { maxIndoor: 10, maxOutdoor: 6, maxDaytime: 0 },
    interiorTypes: { 'Facility': 3.0, 'Mansion': 97.0, 'Mineshaft': 0.0 },
    eclipseSpawn: { minIndoorEntities: 3, minOutdoorEntities: 4 },
    nightStartTime: 960, // 4:00 PM - Very dangerous moon, early night start
    description: 'A high-security facility with frequent eclipse events and aggressive entity populations.'
  },
  'Titan': {
    difficulty: 'A+', weather: ['Clear', 'Stormy', 'Foggy', 'Eclipsed', 'Dusty'], minScrapValue: 200, maxScrapValue: 400,
    scrapSpawnRange: { min: 15, max: 25 }, mapSizeMultiplier: 2.2,
    entities: {
      inside: ['Bracken', 'Thumper', 'Spiders', 'Hoarding Bug', 'Coil-Head', 'Jester', 'Nutcracker', 'Masked', 'Ghost Girl', 'Snare Flea', 'Hygrodere'],
      outside: ['Eyeless Dog', 'Forest Keeper', 'Baboon Hawk', 'Earth Leviathan'],
      daytime: []
    },
    roomCount: { min: 18, max: 26 }, hazardLevel: 5, cost: 700,
    powerLevels: { maxIndoor: 18, maxOutdoor: 7, maxDaytime: 0 },
    interiorTypes: { 'Facility': 81.4, 'Mansion': 18.6, 'Mineshaft': 0.0 },
    eclipseSpawn: { minIndoorEntities: 5, minOutdoorEntities: 6 },
    nightStartTime: 900, // 3:00 PM - Most dangerous moon, very early night start
    description: 'The most dangerous operational facility with maximum entity density and lethal conditions.'
  }
};

const ENTITY_POWER_LEVELS = {
  'Bracken': 3, 'Thumper': 3, 'Spiders': 1, 'Hoarding Bug': 1, 'Coil-Head': 1,
  'Jester': 3, 'Nutcracker': 3, 'Masked': 1, 'Ghost Girl': 2, 'Snare Flea': 1,
  'Hygrodere': 1, 'Eyeless Dog': 1, 'Forest Keeper': 3, 'Baboon Hawk': 1,
  'Earth Leviathan': 3, 'Manticoil': 1, 'Roaming Locust': 1, 'Circuit Bees': 2
};

const SCRAPS = {
  'Apparatus': { minValue: 80, maxValue: 280, weight: 'Heavy', rarity: 'Legendary', rarityWeight: 1 },
  'Gold Bar': { minValue: 156, maxValue: 176, weight: 'Light', rarity: 'Legendary', rarityWeight: 5 },
  'Cash Register': { minValue: 120, maxValue: 200, weight: 'Heavy', rarity: 'Rare', rarityWeight: 15 },
  'Painting': { minValue: 80, maxValue: 120, weight: 'Medium', rarity: 'Rare', rarityWeight: 25 },
  'Stop Sign': { minValue: 42, maxValue: 120, weight: 'Medium', rarity: 'Uncommon', rarityWeight: 35 },
  'Engine': { minValue: 40, maxValue: 78, weight: 'Heavy', rarity: 'Uncommon', rarityWeight: 20 },
  'Chemical Jug': { minValue: 7, maxValue: 21, weight: 'Medium', rarity: 'Common', rarityWeight: 45 },
  'Metal Sheet': { minValue: 2, maxValue: 7, weight: 'Light', rarity: 'Common', rarityWeight: 65 },
  'Scrap Metal': { minValue: 6, maxValue: 18, weight: 'Light', rarity: 'Common', rarityWeight: 85 },
  'Flashlight': { minValue: 12, maxValue: 25, weight: 'Light', rarity: 'Uncommon', rarityWeight: 20 }
};

const ENTITIES = {
  'Bracken': {
    brawn: 4, agility: 5, intellect: 3, cunning: 4, willpower: 3, presence: 2,
    soak: 6, wounds: 18, strain: 12, defense: { melee: 2, ranged: 3 },
    abilities: ['Ambush Predator: Add ⬢⬢ when attacking from stealth', 'Neck Snap: Critical +50 on ⚡⚡⚡', 'Shadow Stalker: Move when unobserved'],
    description: 'A tall, dark humanoid entity that stalks prey from the shadows and strikes when unobserved.'
  },
  'Thumper': {
    brawn: 5, agility: 3, intellect: 1, cunning: 2, willpower: 4, presence: 1,
    soak: 8, wounds: 25, strain: 8, defense: { melee: 1, ranged: 1 },
    abilities: ['Powerful Bite: +2 damage', 'Vent Crawler: Move through small spaces', 'Loud Movement: Heard from Long range'],
    description: 'A large, aggressive quadruped with powerful jaws that hunts through facility ventilation systems.'
  },
  'Coil-Head': {
    brawn: 6, agility: 2, intellect: 1, cunning: 1, willpower: 5, presence: 3,
    soak: 10, wounds: 30, strain: 15, defense: { melee: 0, ranged: 0 },
    abilities: ['Quantum Lock: Cannot move when observed', 'Instant Kill: Lethal attack when unobserved', 'Unblinking Stare: Add ⬢ to nearby targets'],
    description: 'A nightmarish spring-loaded mannequin that freezes when observed but kills instantly when unseen.'
  },
  'Jester': {
    brawn: 4, agility: 4, intellect: 2, cunning: 3, willpower: 4, presence: 4,
    soak: 6, wounds: 20, strain: 16, defense: { melee: 2, ranged: 2 },
    abilities: ['Wind-up Music: 3 rounds before rampage', 'Rampage Mode: Add ⬢⬢⬢ and +2 damage', 'Immune to strain/fear'],
    description: 'A wind-up jester toy that becomes extremely violent after its music box melody completes.'
  }
};

const ROOM_TYPES = ['Main Entrance', 'Storage Room', 'Office', 'Maintenance', 'Generator Room', 'Cafeteria', 'Laboratory'];
const DOOR_TYPES = ['Open', 'Standard Door', 'Security Door', 'Vent', 'Locked Door'];
const TRAPS = [
  { name: 'Spike Trap', damage: 8, difficulty: 2 },
  { name: 'Turret', damage: 12, difficulty: 3 },
  { name: 'Mine', damage: 15, difficulty: 3 }
];

const WEATHER_EFFECTS = {
  'Clear': {
    description: 'Perfect conditions for Company operations with clear skies and calm weather.',
    mechanicalEffects: 'No additional dice modifiers.',
    effects: ['No weather penalties', 'Normal visibility', 'Communication functions normally']
  },
  'Eclipsed': {
    description: 'Unnatural eclipse blocks out the sun, plunging the moon into perpetual darkness.',
    mechanicalEffects: 'Poor Lighting everywhere. Add ⬢⬢ to vision checks. Entity spawn +50%. Entities +1 damage.',
    effects: ['Unnatural darkness', 'Entities more aggressive', 'Communication intermittent', 'Psychological pressure']
  },
  'Foggy': {
    description: 'Dense fog blankets the area, reducing visibility to mere meters.',
    mechanicalEffects: 'Visibility limited to Short range. Add ⬢⬢⬢ to Ranged attacks. Add ⬢⬢ to Perception.',
    effects: ['Severely reduced visibility', 'Navigation difficult', 'Sound carries strangely', 'Entities gain +2 Stealth']
  },
  'Stormy': {
    description: 'Violent thunderstorms with heavy rain, high winds, and dangerous lightning strikes.',
    mechanicalEffects: 'Add ⬢⬢ to Perception. Random lightning illumination. Add ⬢ to Athletics.',
    effects: ['Heavy rain reduces perception', 'Lightning illuminates randomly', 'Surfaces slippery', 'Equipment malfunctions']
  }
};

function LethalCompanyRPG() {
  const [selectedMoon, setSelectedMoon] = useState('Experimentation');
  const [generatedFacility, setGeneratedFacility] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [currentTime, setCurrentTime] = useState(420);
  const [gameEntities, setGameEntities] = useState([]);
  const [nextEntitySpawn, setNextEntitySpawn] = useState(465);
  const [announcements, setAnnouncements] = useState([]);
  const [currentPowerUsage, setCurrentPowerUsage] = useState({ indoor: 0, outdoor: 0, daytime: 0 });
  const [isEclipsed, setIsEclipsed] = useState(false);

  const ENTITY_BEHAVIORS = {
    'Bracken': { 
      moveFrequency: 1, movePattern: 'stealth', speed: 'fast', powerLevel: 3,
      roundsToMove: () => 1 + Math.floor(Math.random() * 2) // 1-2 rounds
    },
    'Thumper': { 
      moveFrequency: 2, movePattern: 'patrol', speed: 'very_fast', powerLevel: 3,
      roundsToMove: () => 1 + Math.floor(Math.random() * 2) // 1-2 rounds
    },
    'Spiders': { 
      moveFrequency: 3, movePattern: 'territorial', speed: 'medium', powerLevel: 1,
      roundsToMove: () => 2 + Math.floor(Math.random() * 3) // 2-4 rounds
    },
    'Hoarding Bug': { 
      moveFrequency: 2, movePattern: 'scavenger', speed: 'fast', powerLevel: 1,
      roundsToMove: () => 2 + Math.floor(Math.random() * 3) // 2-4 rounds
    },
    'Coil-Head': { 
      moveFrequency: 0, movePattern: 'quantum', speed: 'instant', powerLevel: 1,
      roundsToMove: () => 1 // Always moves every round when not observed
    },
    'Jester': { 
      moveFrequency: 1, movePattern: 'follow', speed: 'medium', powerLevel: 3,
      roundsToMove: () => 2 + Math.floor(Math.random() * 2) // 2-3 rounds
    },
    'Nutcracker': { 
      moveFrequency: 2, movePattern: 'patrol', speed: 'slow', powerLevel: 3,
      roundsToMove: () => 3 + Math.floor(Math.random() * 3) // 3-5 rounds
    },
    'Masked': { 
      moveFrequency: 1, movePattern: 'mimic', speed: 'medium', powerLevel: 1,
      roundsToMove: () => 2 + Math.floor(Math.random() * 2) // 2-3 rounds
    },
    'Ghost Girl': {
      moveFrequency: 1, movePattern: 'haunt', speed: 'fast', powerLevel: 2,
      roundsToMove: () => 1 + Math.floor(Math.random() * 3) // 1-3 rounds
    },
    'Snare Flea': {
      moveFrequency: 2, movePattern: 'ceiling_ambush', speed: 'medium', powerLevel: 1,
      roundsToMove: () => 3 + Math.floor(Math.random() * 3) // 3-5 rounds
    },
    'Hygrodere': {
      moveFrequency: 3, movePattern: 'slow_pursuit', speed: 'slow', powerLevel: 1,
      roundsToMove: () => 4 + Math.floor(Math.random() * 2) // 4-5 rounds
    },
    'Eyeless Dog': { 
      moveFrequency: 2, movePattern: 'hunt', speed: 'fast', powerLevel: 1,
      roundsToMove: () => 2 + Math.floor(Math.random() * 2) // 2-3 rounds
    },
    'Forest Keeper': { 
      moveFrequency: 3, movePattern: 'patrol', speed: 'slow', powerLevel: 3,
      roundsToMove: () => 4 + Math.floor(Math.random() * 2) // 4-5 rounds
    },
    'Baboon Hawk': { 
      moveFrequency: 1, movePattern: 'aerial', speed: 'very_fast', powerLevel: 1,
      roundsToMove: () => 1 + Math.floor(Math.random() * 2) // 1-2 rounds
    },
    'Earth Leviathan': { 
      moveFrequency: 3, movePattern: 'burrow', speed: 'slow', powerLevel: 3,
      roundsToMove: () => 4 + Math.floor(Math.random() * 2) // 4-5 rounds
    },
    'Manticoil': { 
      moveFrequency: 1, movePattern: 'flee', speed: 'fast', powerLevel: 1,
      roundsToMove: () => 1 + Math.floor(Math.random() * 2) // 1-2 rounds
    },
    'Circuit Bees': {
      moveFrequency: 2, movePattern: 'territorial', speed: 'fast', powerLevel: 2,
      roundsToMove: () => 2 + Math.floor(Math.random() * 2) // 2-3 rounds
    },
    'Roaming Locust': {
      moveFrequency: 1, movePattern: 'random', speed: 'medium', powerLevel: 1,
      roundsToMove: () => 2 + Math.floor(Math.random() * 3) // 2-4 rounds
    }
  };

  // Utility Functions
  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours > 12 ? hours - 12 : (hours === 0 ? 12 : hours);
    return `${displayHours}:${mins.toString().padStart(2, '0')} ${period}`;
  };

  const generateRandomValue = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const getRandomElement = (array) => array[Math.floor(Math.random() * array.length)];

  const calculateCurrentPowerUsage = useCallback((entities, moonData) => {
    let indoorPower = 0, outdoorPower = 0, daytimePower = 0;
    entities.forEach(entity => {
      // Use ENTITY_POWER_LEVELS as the primary source, fallback to ENTITY_BEHAVIORS
      const powerLevel = ENTITY_POWER_LEVELS[entity.type] || ENTITY_BEHAVIORS[entity.type]?.powerLevel || 1;
      if (entity.isOutdoor) {
        if (moonData.entities.daytime.includes(entity.type)) {
          daytimePower += powerLevel;
        } else {
          outdoorPower += powerLevel;
        }
      } else {
        indoorPower += powerLevel;
      }
    });
    return { indoor: indoorPower, outdoor: outdoorPower, daytime: daytimePower };
  }, []);

  const addAnnouncement = useCallback((message) => {
    const timestamp = new Date().toLocaleTimeString();
    setAnnouncements(prev => [...prev.slice(-4), { message, timestamp }]);
  }, []);

  const canSpawnEntity = useCallback((entityType, moonData, currentPower) => {
    // Use ENTITY_POWER_LEVELS as the primary source for accurate power levels
    const entityPowerLevel = ENTITY_POWER_LEVELS[entityType] || ENTITY_BEHAVIORS[entityType]?.powerLevel || 1;
    
    // Check if it's a daytime entity - these can only spawn during daytime hours
    if (moonData.entities.daytime.includes(entityType)) {
      return currentTime < moonData.nightStartTime && (currentPower.daytime + entityPowerLevel) <= moonData.powerLevels.maxDaytime;
    }
    
    // Check if it's an outdoor entity - these can only spawn during nighttime OR eclipse
    if (moonData.entities.outside.includes(entityType)) {
      const isNightTime = currentTime >= moonData.nightStartTime;
      const isEclipse = generatedFacility?.weather === 'Eclipsed';
      
      // Outdoor entities can only spawn at night OR during eclipse
      if (!isNightTime && !isEclipse) {
        return false;
      }
      
      return (currentPower.outdoor + entityPowerLevel) <= moonData.powerLevels.maxOutdoor;
    }
    
    // Indoor entities can spawn at any time (as long as power allows)
    if (moonData.entities.inside.includes(entityType)) {
      return (currentPower.indoor + entityPowerLevel) <= moonData.powerLevels.maxIndoor;
    }
    
    return false;
  }, [currentTime, generatedFacility]);

  const spawnSpecificEntity = useCallback((entityType, isOutdoor) => {
    if (!generatedFacility) return;
    const spawnLocation = isOutdoor ? 
      getRandomElement(['Outside - North', 'Outside - South', 'Outside - East', 'Outside - West']) :
      getRandomElement(generatedFacility.rooms).id;
    
    // Use ENTITY_POWER_LEVELS as the primary source for accurate power levels
    const entityPowerLevel = ENTITY_POWER_LEVELS[entityType] || ENTITY_BEHAVIORS[entityType]?.powerLevel || 1;
    const behavior = ENTITY_BEHAVIORS[entityType];
    
    const newEntity = {
      id: `entity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: entityType, location: spawnLocation, isOutdoor: isOutdoor, spawned: true,
      moveCounter: 0, lastMoved: currentTime, state: 'active', spawnTime: currentTime,
      powerLevel: entityPowerLevel,
      roundsUntilMove: behavior ? behavior.roundsToMove() : 3, // Initialize with random rounds
      roundsCounter: 0
    };
    
    setGameEntities(prev => {
      const newEntities = [...prev, newEntity];
      // Immediately update power usage after adding the entity
      const moonData = MOONS[selectedMoon];
      const newPowerUsage = calculateCurrentPowerUsage(newEntities, moonData);
      setCurrentPowerUsage(newPowerUsage);
      return newEntities;
    });
    
    addAnnouncement(`🚨 ENTITY SPAWN: ${entityType} (Power: ${entityPowerLevel}) detected ${isOutdoor ? 'outside facility' : `in Room ${spawnLocation}`}`);
  }, [generatedFacility, currentTime, selectedMoon, calculateCurrentPowerUsage, addAnnouncement]);

  const moveEntities = useCallback(() => {
    if (!generatedFacility) return;
    
    setGameEntities(prev => {
      const updatedEntities = prev.map(entity => {
        const behavior = ENTITY_BEHAVIORS[entity.type];
        if (!behavior) return entity;
        
        // Create a new entity object to ensure React re-renders
        const updatedEntity = { ...entity };
        
        // Increment round counter
        updatedEntity.roundsCounter = (updatedEntity.roundsCounter || 0) + 1;
        
        // Check if it's time for this entity to move
        if (updatedEntity.roundsCounter < updatedEntity.roundsUntilMove) {
          return updatedEntity; // Not time to move yet
        }
        
        // Reset counters and set next move time
        updatedEntity.roundsCounter = 0;
        updatedEntity.roundsUntilMove = behavior.roundsToMove();
        updatedEntity.lastMoved = currentTime;
        
        // Handle outdoor entities differently
        if (updatedEntity.isOutdoor) {
          const outdoorAreas = ['Outside - North', 'Outside - South', 'Outside - East', 'Outside - West', 'Outside - Ship Area'];
          const newLocation = getRandomElement(outdoorAreas);
          
          if (newLocation !== updatedEntity.location) {
            updatedEntity.location = newLocation;
            updatedEntity.state = 'moving';
            addAnnouncement(`📍 ${updatedEntity.type} moved to ${newLocation}`);
          }
          return updatedEntity;
        }
        
        // Indoor entity movement with door mechanics
        const currentRoom = generatedFacility.rooms.find(room => room.id === updatedEntity.location);
        if (!currentRoom) {
          console.warn(`Entity ${updatedEntity.type} in unknown room ${updatedEntity.location}`);
          return updatedEntity;
        }
        
        // Find possible exits from current room
        const possibleExits = [];
        const directions = [
          { dir: 'north', deltaRow: -1, deltaCol: 0 },
          { dir: 'south', deltaRow: 1, deltaCol: 0 },
          { dir: 'east', deltaRow: 0, deltaCol: 1 },
          { dir: 'west', deltaRow: 0, deltaCol: -1 }
        ];
        
        directions.forEach(({ dir, deltaRow, deltaCol }) => {
          const doorType = currentRoom.doors[dir];
          
          // Check if entity can pass through this door
          if (doorType === 'Wall') {
            return; // Can't go through walls
          }
          
          if (doorType === 'Security Door' || doorType === 'Locked Door') {
            // Only certain entities can open secure doors
            const canOpenSecureDoors = ['Nutcracker', 'Jester', 'Ghost Girl'];
            if (!canOpenSecureDoors.includes(updatedEntity.type)) {
              return; // Can't open secure doors
            }
          }
          
          // Find the room in this direction
          const currentPos = currentRoom.position;
          if (!currentPos) return;
          
          const targetPos = {
            row: currentPos.row + deltaRow,
            col: currentPos.col + deltaCol
          };
          
          // Find room at target position
          const targetRoom = generatedFacility.rooms.find(room => 
            room.position && room.position.row === targetPos.row && room.position.col === targetPos.col
          );
          
          if (targetRoom) {
            possibleExits.push({
              room: targetRoom,
              direction: dir,
              doorType: doorType
            });
          }
        });
        
        // If no valid exits, entity stays put
        if (possibleExits.length === 0) {
          updatedEntity.state = 'waiting';
          return updatedEntity;
        }
        
        // Choose movement based on entity behavior
        let targetRoom = null;
        
        switch (behavior.movePattern) {
          case 'territorial': // Spiders - tend to stay in same area
            // 70% chance to stay, 30% chance to move
            if (Math.random() < 0.7) {
              updatedEntity.state = 'guarding';
              return updatedEntity;
            }
            targetRoom = getRandomElement(possibleExits).room;
            break;
            
          case 'scavenger': // Hoarding Bug - seeks rooms with scrap
            const scrapRooms = possibleExits.filter(exit => exit.room.scraps.length > 0);
            if (scrapRooms.length > 0) {
              targetRoom = getRandomElement(scrapRooms).room;
            } else {
              targetRoom = getRandomElement(possibleExits).room;
            }
            break;
            
          case 'quantum': // Coil-Head - special movement rules  
            targetRoom = getRandomElement(possibleExits).room;
            break;
            
          case 'stealth': // Bracken - moves between rooms
          case 'patrol': // Thumper, Nutcracker - systematic routes
          case 'follow': // Jester - follows players
          case 'mimic': // Masked - mimics behavior
          case 'haunt': // Ghost Girl - haunts areas
          case 'ceiling_ambush': // Snare Flea - ambush positions
          case 'slow_pursuit': // Hygrodere - slow pursuit
          default:
            targetRoom = getRandomElement(possibleExits).room;
            break;
        }
        
        // Move to target room if different from current
        if (targetRoom && targetRoom.id !== updatedEntity.location) {
          const oldLocation = updatedEntity.location;
          updatedEntity.location = targetRoom.id;
          updatedEntity.state = 'moving';
          
          // Announce movement for dangerous entities
          const dangerousEntities = ['Bracken', 'Thumper', 'Coil-Head', 'Jester', 'Nutcracker', 'Ghost Girl'];
          if (dangerousEntities.includes(updatedEntity.type)) {
            addAnnouncement(`🚶 ${updatedEntity.type} moved from Room ${oldLocation} to Room ${targetRoom.id}`);
          }
        } else {
          updatedEntity.state = 'active';
        }
        
        return updatedEntity;
      });
      
      return updatedEntities;
    });
  }, [generatedFacility, currentTime, addAnnouncement]);

  const advanceTime = useCallback(() => {
    const newTime = currentTime + 15;
    const moonData = MOONS[selectedMoon];
    const currentWeather = generatedFacility?.weather;
    const isCurrentlyEclipsed = currentWeather === 'Eclipsed';
    setIsEclipsed(isCurrentlyEclipsed);
    
    // Move entities FIRST (before potential spawning)
    moveEntities();
    
    // Spawn logic with power level checking
    if (newTime >= nextEntitySpawn && generatedFacility) {
      // Calculate current power usage before attempting to spawn
      const currentPower = calculateCurrentPowerUsage(gameEntities, moonData);
      
      // Get all available entities for this moon
      const availableEntities = [...moonData.entities.inside, ...moonData.entities.outside, ...moonData.entities.daytime];
      
      // Filter entities that can actually spawn based on power constraints
      const spawnableEntities = availableEntities.filter(entityType => 
        canSpawnEntity(entityType, moonData, currentPower)
      );
      
      if (spawnableEntities.length > 0) {
        const selectedEntityType = getRandomElement(spawnableEntities);
        const isOutdoor = moonData.entities.outside.includes(selectedEntityType) || 
                         moonData.entities.daytime.includes(selectedEntityType);
        spawnSpecificEntity(selectedEntityType, isOutdoor);
        addAnnouncement(`✅ Entity spawned successfully. Power usage updated.`);
      } else {
        addAnnouncement(`⚠️ Cannot spawn entities - Power limits reached! Indoor: ${currentPower.indoor}/${moonData.powerLevels.maxIndoor}, Outdoor: ${currentPower.outdoor}/${moonData.powerLevels.maxOutdoor}, Daytime: ${currentPower.daytime}/${moonData.powerLevels.maxDaytime}`);
      }
      
      setNextEntitySpawn(nextEntitySpawn + (isCurrentlyEclipsed ? 30 : 45));
    }
    
    setCurrentTime(newTime);
    addAnnouncement(`Time advanced to ${formatTime(newTime)} - Entities moved`);
  }, [currentTime, selectedMoon, generatedFacility, nextEntitySpawn, gameEntities, calculateCurrentPowerUsage, canSpawnEntity, spawnSpecificEntity, addAnnouncement, moveEntities]);

  const generateFacility = useCallback(() => {
    try {
      const moonData = MOONS[selectedMoon];
      const roomCount = generateRandomValue(moonData.roomCount.min, moonData.roomCount.max);
      const rooms = [];

      // Generate rooms first with simple layout
      for (let i = 0; i < roomCount; i++) {
        const roomType = i === 0 ? 'Main Entrance' : getRandomElement(ROOM_TYPES.filter(type => type !== 'Main Entrance'));
        const room = {
          id: i,
          type: roomType,
          position: { row: 0, col: 0 }, // Temporary position
          doors: {
            north: 'Wall', south: 'Wall', east: 'Wall', west: 'Wall'
          },
          entities: [], scraps: [], traps: [],
          lighting: getRandomElement(['Bright', 'Dim', 'Dark']),
          condition: getRandomElement(['Clean', 'Dusty', 'Damaged'])
        };

        // Generate scrap
        if (Math.random() < 0.7) {
          const scrapCount = generateRandomValue(1, 3);
          for (let j = 0; j < scrapCount; j++) {
            const scrapName = getRandomElement(Object.keys(SCRAPS));
            const scrap = SCRAPS[scrapName];
            room.scraps.push({
              name: scrapName,
              value: generateRandomValue(scrap.minValue, scrap.maxValue),
              weight: scrap.weight,
              rarity: scrap.rarity
            });
          }
        }

        // Generate traps
        if (Math.random() < (0.1 + moonData.hazardLevel * 0.05)) {
          room.traps.push(getRandomElement(TRAPS));
        }

        rooms.push(room);
      }

      // GUARANTEED CONNECTED layout generation
      const gridSize = 7;
      const grid = [];
      for (let i = 0; i < gridSize; i++) {
        const row = [];
        for (let j = 0; j < gridSize; j++) {
          row.push(null);
        }
        grid.push(row);
      }
      
      const roomPositions = {};
      
      // Place entrance in center area
      const entrance = rooms[0];
      const entrancePos = { row: 3, col: 3 };
      grid[entrancePos.row][entrancePos.col] = entrance;
      roomPositions[entrance.id] = entrancePos;
      entrance.position = entrancePos;
      
      // Track which rooms are connected to the network
      const connectedRooms = new Set([entrance.id]);
      const unplacedRooms = [...rooms.slice(1)];
      
      // Shuffle unplaced rooms for variety
      for (let i = unplacedRooms.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [unplacedRooms[i], unplacedRooms[j]] = [unplacedRooms[j], unplacedRooms[i]];
      }
      
      // Adjacent directions (only orthogonal for guaranteed connections)
      const orthogonalDirections = [
        { row: -1, col: 0, dir: 'north', opposite: 'south' },
        { row: 1, col: 0, dir: 'south', opposite: 'north' },
        { row: 0, col: 1, dir: 'east', opposite: 'west' },
        { row: 0, col: -1, dir: 'west', opposite: 'east' }
      ];
      
      // Place each room ensuring it connects to an already placed room  
      while (unplacedRooms.length > 0) {
        let placed = false;
        
        // Get all rooms that are already connected
        const placedConnectedRooms = rooms.filter(room => connectedRooms.has(room.id));
        
        // Shuffle the connected rooms to add variety
        for (let i = placedConnectedRooms.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [placedConnectedRooms[i], placedConnectedRooms[j]] = [placedConnectedRooms[j], placedConnectedRooms[i]];
        }
        
        // Try to place next room adjacent to any connected room
        for (let connectedRoom of placedConnectedRooms) {
          if (placed) break;
          
          const basePos = roomPositions[connectedRoom.id];
          
          // Shuffle directions for variety
          const shuffledDirections = [...orthogonalDirections];
          for (let i = shuffledDirections.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledDirections[i], shuffledDirections[j]] = [shuffledDirections[j], shuffledDirections[i]];
          }
          
          for (let direction of shuffledDirections) {
            const newPos = {
              row: basePos.row + direction.row,
              col: basePos.col + direction.col
            };
            
            // Check if position is valid and empty
            if (newPos.row >= 0 && newPos.row < gridSize && 
                newPos.col >= 0 && newPos.col < gridSize && 
                grid[newPos.row][newPos.col] === null) {
              
              // Place the room
              const roomToPlace = unplacedRooms.shift();
              grid[newPos.row][newPos.col] = roomToPlace;
              roomPositions[roomToPlace.id] = newPos;
              roomToPlace.position = newPos;
              
              // Create bidirectional door connection
              const doorType = getRandomElement(['Open', 'Standard Door', 'Security Door']);
              connectedRoom.doors[direction.dir] = doorType;
              roomToPlace.doors[direction.opposite] = doorType;
              
              // Add to connected network
              connectedRooms.add(roomToPlace.id);
              placed = true;
              break;
            }
          }
        }
        
        // If we couldn't place a room, we have a problem
        if (!placed) {
          console.error(`Could not place room - no valid adjacent positions available`);
          addAnnouncement(`⚠️ Warning: Could not place ${unplacedRooms.length} rooms - insufficient space`);
          break;
        }
      }
      
      // Initialize all doors as walls first, then set connections
      rooms.forEach(room => {
        room.doors = { north: 'Wall', south: 'Wall', east: 'Wall', west: 'Wall' };
      });
      
      // Set door connections for adjacent rooms
      rooms.forEach(room => {
        const pos = roomPositions[room.id];
        if (!pos) return;
        
        orthogonalDirections.forEach(({ row: deltaRow, col: deltaCol, dir, opposite }) => {
          const adjRow = pos.row + deltaRow;
          const adjCol = pos.col + deltaCol;
          
          if (adjRow >= 0 && adjRow < gridSize && adjCol >= 0 && adjCol < gridSize) {
            const adjacentRoom = grid[adjRow][adjCol];
            
            if (adjacentRoom && room.doors[dir] === 'Wall' && adjacentRoom.doors[opposite] === 'Wall') {
              // Create matching doors between adjacent rooms
              const doorType = getRandomElement(['Open', 'Standard Door', 'Security Door']);
              room.doors[dir] = doorType;
              adjacentRoom.doors[opposite] = doorType;
            }
          }
        });
      });
      
      // Final verification - ensure every room has at least one connection
      let isolatedCount = 0;
      rooms.forEach(room => {
        const hasConnection = Object.values(room.doors).some(door => door !== 'Wall');
        if (!hasConnection) {
          isolatedCount++;
          console.error(`Room ${room.id} (${room.type}) has no connections!`);
        }
      });
      
      if (isolatedCount === 0) {
        addAnnouncement(`✅ All ${rooms.length} rooms successfully connected`);
      } else {
        addAnnouncement(`❌ ${isolatedCount} rooms are isolated - generation failed`);
      }

      const totalValue = rooms.reduce((sum, room) => 
        sum + room.scraps.reduce((scrapSum, scrap) => scrapSum + scrap.value, 0), 0);

      const facility = {
        moon: selectedMoon,
        weather: getRandomElement(moonData.weather),
        interiorType: 'Facility',
        rooms: rooms,
        totalValue: totalValue,
        outsideEntities: [],
        generatedAt: new Date().toLocaleString(),
        mapSizeMultiplier: moonData.mapSizeMultiplier,
        grid: grid,
        roomPositions: roomPositions
      };

      setGeneratedFacility(facility);
      setCurrentTime(420);
      setGameEntities([]);
      setNextEntitySpawn(465);
      setAnnouncements([]);
      setCurrentPowerUsage({ indoor: 0, outdoor: 0, daytime: 0 });
      setIsEclipsed(facility.weather === 'Eclipsed');
      addAnnouncement('New facility generated successfully - All systems nominal');
    } catch (error) {
      console.error('Error generating facility:', error);
      addAnnouncement(`❌ Error generating facility: ${error.message}. Please try again.`);
    }
  }, [selectedMoon, addAnnouncement]);

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'Common': return 'default';
      case 'Uncommon': return 'primary';
      case 'Rare': return 'secondary';
      case 'Legendary': return 'warning';
      default: return 'default';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'S': return 'info';
      case 'D': return 'success';
      case 'C': return 'info';
      case 'B': return 'warning';
      case 'A': case 'A+': return 'error';
      default: return 'default';
    }
  };

  const getPowerLevelProgress = (current, max) => Math.min((current / max) * 100, 100);
  const getPowerLevelColor = (current, max) => {
    const percentage = (current / max) * 100;
    if (percentage >= 90) return 'error';
    if (percentage >= 70) return 'warning';
    if (percentage >= 50) return 'info';
    return 'success';
  };

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <AppBar position="static" sx={{ bgcolor: '#d32f2f' }}>
        <Toolbar>
          <Security sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Lethal Company - Enhanced Genesys RPG
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 3, mb: 3 }}>
        <Grid container spacing={3}>
          {/* Mission Control */}
          <Grid item xs={12}>
            <Card sx={{ bgcolor: 'white', boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h5" gutterBottom color="primary">Mission Control</Typography>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                  <FormControl sx={{ minWidth: 250 }}>
                    <InputLabel>Select Moon</InputLabel>
                    <Select value={selectedMoon} onChange={(e) => setSelectedMoon(e.target.value)}>
                      <MenuItem disabled sx={{ fontWeight: 'bold', color: 'primary.main' }}>Free Moons</MenuItem>
                      {Object.entries(MOONS).filter(([moon, data]) => data.cost === 0).map(([moon, data]) => (
                        <MenuItem key={moon} value={moon}>
                          {moon} - Difficulty {data.difficulty}
                        </MenuItem>
                      ))}
                      <MenuItem disabled sx={{ fontWeight: 'bold', color: 'warning.main', mt: 1 }}>Paid Moons</MenuItem>
                      {Object.entries(MOONS).filter(([moon, data]) => data.cost > 0).map(([moon, data]) => (
                        <MenuItem key={moon} value={moon}>
                          {moon} - Difficulty {data.difficulty} ({data.cost} credits)
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <Button variant="contained" color="primary" startIcon={<Map />} onClick={generateFacility} size="large">
                    Generate Facility
                  </Button>
                  {generatedFacility && (
                    <Button variant="outlined" startIcon={<Refresh />} onClick={generateFacility}>
                      Regenerate
                    </Button>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Time Control Panel */}
          {generatedFacility && (
            <Grid item xs={12}>
              <Card sx={{ bgcolor: '#1a1a1a', boxShadow: 3, border: isEclipsed ? '2px solid #9c27b0' : '2px solid #d32f2f' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ color: isEclipsed ? '#9c27b0' : '#d32f2f', display: 'flex', alignItems: 'center' }}>
                    <Security sx={{ mr: 1 }} />
                    {isEclipsed ? '🌑 ECLIPSE MODE - Enhanced Monitoring' : 'Mission Timeline Control'}
                  </Typography>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={3}>
                      <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#2a2a2a', borderRadius: 2 }}>
                        <Typography variant="h4" sx={{ color: '#00ff00', fontFamily: 'monospace', fontWeight: 'bold' }}>
                          {formatTime(currentTime)}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#ffffff' }}>Current Time</Typography>
                        {isEclipsed && (
                          <Typography variant="caption" sx={{ color: '#9c27b0', fontWeight: 'bold' }}>
                            ECLIPSE ACTIVE
                          </Typography>
                        )}
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Button
                          variant="contained"
                          color={isEclipsed ? "secondary" : "warning"}
                          size="large"
                          onClick={advanceTime}
                          sx={{ mb: 1, fontSize: '1.1rem', minWidth: '200px' }}
                        >
                          Advance Time (+15 min)
                        </Button>
                        <Typography variant="caption" display="block" sx={{ color: '#ffffff' }}>
                          Next Spawn: {formatTime(nextEntitySpawn)}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box sx={{ p: 2, bgcolor: '#2a2a2a', borderRadius: 2 }}>
                        <Typography variant="subtitle2" sx={{ color: '#ffffff', mb: 2 }}>
                          Entity Power Levels
                        </Typography>
                        <Box sx={{ mb: 1 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                            <Typography variant="caption" sx={{ color: '#ffffff' }}>
                              Indoor: {currentPowerUsage.indoor}/{MOONS[selectedMoon].powerLevels.maxIndoor}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#ffffff' }}>
                              {Math.round(getPowerLevelProgress(currentPowerUsage.indoor, MOONS[selectedMoon].powerLevels.maxIndoor))}%
                            </Typography>
                          </Box>
                          <LinearProgress 
                            variant="determinate" 
                            value={getPowerLevelProgress(currentPowerUsage.indoor, MOONS[selectedMoon].powerLevels.maxIndoor)}
                            color={getPowerLevelColor(currentPowerUsage.indoor, MOONS[selectedMoon].powerLevels.maxIndoor)}
                            sx={{ height: 8, borderRadius: 4 }}
                          />
                        </Box>
                        <Box sx={{ mb: 1 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                            <Typography variant="caption" sx={{ color: '#ffffff' }}>
                              Outdoor: {currentPowerUsage.outdoor}/{MOONS[selectedMoon].powerLevels.maxOutdoor}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#ffffff' }}>
                              {Math.round(getPowerLevelProgress(currentPowerUsage.outdoor, MOONS[selectedMoon].powerLevels.maxOutdoor))}%
                            </Typography>
                          </Box>
                          <LinearProgress 
                            variant="determinate" 
                            value={getPowerLevelProgress(currentPowerUsage.outdoor, MOONS[selectedMoon].powerLevels.maxOutdoor)}
                            color={getPowerLevelColor(currentPowerUsage.outdoor, MOONS[selectedMoon].powerLevels.maxOutdoor)}
                            sx={{ height: 8, borderRadius: 4 }}
                          />
                        </Box>
                        <Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                            <Typography variant="caption" sx={{ color: '#ffffff' }}>
                              Daytime: {currentPowerUsage.daytime}/{MOONS[selectedMoon].powerLevels.maxDaytime}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#ffffff' }}>
                              {Math.round(getPowerLevelProgress(currentPowerUsage.daytime, MOONS[selectedMoon].powerLevels.maxDaytime))}%
                            </Typography>
                          </Box>
                          <LinearProgress 
                            variant="determinate" 
                            value={getPowerLevelProgress(currentPowerUsage.daytime, MOONS[selectedMoon].powerLevels.maxDaytime)}
                            color={getPowerLevelColor(currentPowerUsage.daytime, MOONS[selectedMoon].powerLevels.maxDaytime)}
                            sx={{ height: 8, borderRadius: 4 }}
                          />
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                  
                  {/* System Announcements */}
                  {announcements.length > 0 && (
                    <Box sx={{ mt: 2, p: 2, bgcolor: '#0a0a0a', borderRadius: 2, border: '1px solid #444' }}>
                      <Typography variant="subtitle2" sx={{ color: '#00ff00', mb: 1 }}>
                        📻 SYSTEM ALERTS
                      </Typography>
                      {announcements.slice(-3).map((announcement, index) => (
                        <Typography key={index} variant="body2" sx={{ color: '#ffffff', fontSize: '0.85rem', mb: 0.5 }}>
                          <span style={{ color: '#888' }}>[{announcement.timestamp}]</span> {announcement.message}
                        </Typography>
                      ))}
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* Main Content Tabs */}
          {generatedFacility && (
            <Grid item xs={12}>
              <Card sx={{ bgcolor: 'white', boxShadow: 3 }}>
                <CardContent>
                  <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
                    <Tab label="Facility Overview" />
                    <Tab label="Room Details" />
                    <Tab label="Entity Stats" />
                    <Tab label="Scrap Database" />
                    <Tab label="Weather Rules" />
                  </Tabs>

                  {/* Tab 0: Facility Overview */}
                  {activeTab === 0 && (
                    <Box sx={{ mt: 3 }}>
                      <Typography variant="h6" gutterBottom color="primary">
                        {generatedFacility.moon} Facility - {generatedFacility.interiorType}
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <Alert severity={isEclipsed ? "error" : "info"} sx={{ mb: 2 }}>
                            <strong>Weather:</strong> {generatedFacility.weather} | 
                            <strong> Total Rooms:</strong> {generatedFacility.rooms.length} | 
                            <strong> Estimated Value:</strong> ${generatedFacility.totalValue}
                          </Alert>
                          
                          {/* Active Entities Display */}
                          {gameEntities.length > 0 && (
                            <Box sx={{ mt: 2 }}>
                              <Typography variant="subtitle1" gutterBottom color="error">
                                Active Spawned Entities ({gameEntities.length}):
                              </Typography>
                              <Box sx={{ maxHeight: 650, overflowY: 'auto', p: 1, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                            {gameEntities.map((entity) => (
                              <Box key={entity.id} sx={{ mb: 1, p: 1, bgcolor: 'white', borderRadius: 1, border: '1px solid #ddd' }}>
                                <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#d32f2f' }}>
                                  {entity.type} (Power: {entity.powerLevel})
                                </Typography>
                                <Typography variant="caption" display="block">
                                  Location: {entity.isOutdoor ? entity.location : `Room ${entity.location}`}
                                </Typography>
                                <Typography variant="caption" display="block" sx={{ color: 'text.secondary' }}>
                                  State: {entity.state} | Spawned: {formatTime(entity.spawnTime)}
                                </Typography>
                              </Box>
                            ))}
                              </Box>
                            </Box>
                          )}
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Typography variant="subtitle1" gutterBottom color="text.primary">
                            Facility Map Layout:
                          </Typography>
                          <Box sx={{ 
                            display: 'grid', 
                            gridTemplateColumns: 'repeat(7, 1fr)', 
                            gap: 2,
                            maxWidth: 630,
                            mx: 'auto',
                            p: 2,
                            border: '2px solid #ddd',
                            borderRadius: 2,
                            bgcolor: '#f9f9f9'
                          }}>
                            {generatedFacility.grid.flat().map((room, index) => {
                              const row = Math.floor(index / 7);
                              const col = index % 7;
                              
                              if (!room) {
                                // Empty grid cell
                                return (
                                  <Box
                                    key={`empty-${row}-${col}`}
                                    sx={{
                                      minHeight: 70,
                                      bgcolor: '#f0f0f0',
                                      borderRadius: 1,
                                      border: '1px dashed #ccc',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center'
                                    }}
                                  >
                                    <Typography variant="caption" sx={{ color: '#999', fontSize: '0.7rem' }}>
                                      {row},{col}
                                    </Typography>
                                  </Box>
                                );
                              }

                              const entitiesInRoom = gameEntities.filter(entity => 
                                !entity.isOutdoor && entity.location === room.id
                              );
                              
                              let backgroundColor = '#757575';
                              let borderColor = '2px solid #666';
                              
                              if (room.type === 'Main Entrance') {
                                backgroundColor = '#1976d2';
                                borderColor = '3px solid #0d47a1';
                              } else if (entitiesInRoom.length > 0) {
                                backgroundColor = '#d32f2f';
                                borderColor = '2px solid #b71c1c';
                              } else if (room.scraps.length > 0) {
                                backgroundColor = '#388e3c';
                                borderColor = '2px solid #2e7d32';
                              }
                              
                              return (
                                <Tooltip
                                  key={room.id}
                                  title={`Room ${room.id}: ${room.type}
                                  Position: Row ${room.position?.row || 0}, Col ${room.position?.col || 0}
                                  Entities: ${entitiesInRoom.length}, Scraps: ${room.scraps.length}
                                  Doors: N:${room.doors.north}, S:${room.doors.south}, E:${room.doors.east}, W:${room.doors.west}`}
                                >
                                  <Card
                                    sx={{
                                      minHeight: 70,
                                      cursor: 'pointer',
                                      bgcolor: backgroundColor,
                                      color: 'white',
                                      border: borderColor,
                                      '&:hover': { opacity: 0.8, transform: 'scale(1.05)' },
                                      position: 'relative',
                                      display: 'flex',
                                      flexDirection: 'column',
                                      justifyContent: 'center',
                                      alignItems: 'center',
                                      transition: 'all 0.2s ease'
                                    }}
                                    onClick={() => setSelectedRoom(room)}
                                  >
                                    <CardContent sx={{ p: 1, textAlign: 'center', width: '100%' }}>
                                      <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold', lineHeight: 1 }}>
                                        {room.id}
                                      </Typography>
                                      <Typography variant="caption" display="block" sx={{ color: 'white', fontSize: '0.65rem', mb: 0.5 }}>
                                        {room.type.length > 10 ? room.type.split(' ')[0] : room.type}
                                      </Typography>
                                      
                                      {entitiesInRoom.length > 0 && (
                                        <Typography variant="caption" display="block" sx={{ color: '#ffcdd2', fontSize: '0.6rem', fontWeight: 'bold' }}>
                                          👹 {entitiesInRoom.length}
                                        </Typography>
                                      )}
                                      
                                      {room.scraps.length > 0 && (
                                        <Typography variant="caption" display="block" sx={{ color: '#c8e6c9', fontSize: '0.6rem' }}>
                                          💰 {room.scraps.length}
                                        </Typography>
                                      )}
                                      
                                      {/* Door indicators with better positioning */}
                                      {room.doors.north !== 'Wall' && (
                                        <Box sx={{ 
                                          position: 'absolute', 
                                          top: 1, 
                                          left: '50%', 
                                          transform: 'translateX(-50%)',
                                          width: 12, 
                                          height: 3, 
                                          bgcolor: room.doors.north === 'Open' ? '#4caf50' : '#fff',
                                          borderRadius: '2px'
                                        }} />
                                      )}
                                      {room.doors.south !== 'Wall' && (
                                        <Box sx={{ 
                                          position: 'absolute', 
                                          bottom: 1, 
                                          left: '50%', 
                                          transform: 'translateX(-50%)',
                                          width: 12, 
                                          height: 3, 
                                          bgcolor: room.doors.south === 'Open' ? '#4caf50' : '#fff',
                                          borderRadius: '2px'
                                        }} />
                                      )}
                                      {room.doors.west !== 'Wall' && (
                                        <Box sx={{ 
                                          position: 'absolute', 
                                          left: 1, 
                                          top: '50%', 
                                          transform: 'translateY(-50%)',
                                          width: 3, 
                                          height: 12, 
                                          bgcolor: room.doors.west === 'Open' ? '#4caf50' : '#fff',
                                          borderRadius: '2px'
                                        }} />
                                      )}
                                      {room.doors.east !== 'Wall' && (
                                        <Box sx={{ 
                                          position: 'absolute', 
                                          right: 1, 
                                          top: '50%', 
                                          transform: 'translateY(-50%)',
                                          width: 3, 
                                          height: 12, 
                                          bgcolor: room.doors.east === 'Open' ? '#4caf50' : '#fff',
                                          borderRadius: '2px'
                                        }} />
                                      )}
                                    </CardContent>
                                  </Card>
                                </Tooltip>
                              );
                            })}
                          </Box>
                          <Typography variant="caption" sx={{ mt: 2, display: 'block', color: 'text.secondary', textAlign: 'center' }}>
                            🔵 Blue: Main Entrance | 🔴 Red: Entities Present | 🟢 Green: Scrap Present | ⚫ Gray: Empty<br />
                            Door indicators: 🟢 Green = Open, ⚪ White = Door/Security, None = Wall
                          </Typography>
                        </Grid>
                      </Grid>
                    </Box>
                  )}

                  {/* Tab 1: Room Details */}
                  {activeTab === 1 && (
                    <Box sx={{ mt: 3 }}>
                      <Typography variant="h6" gutterBottom color="primary">Room Details</Typography>
                      <Grid container spacing={2}>
                        {generatedFacility.rooms.map((room) => {
                          const entitiesInRoom = gameEntities.filter(entity => 
                            !entity.isOutdoor && entity.location === room.id
                          );
                          
                          return (
                            <Grid item xs={12} md={6} lg={4} key={room.id}>
                              <Card sx={{ 
                                bgcolor: entitiesInRoom.length > 0 ? '#ffebee' : '#fafafa', 
                                height: '100%', 
                                boxShadow: 2,
                                border: entitiesInRoom.length > 0 ? '2px solid #d32f2f' : 'none'
                              }}>
                                <CardContent>
                                  <Typography variant="h6" gutterBottom color="primary">
                                    Room {room.id}: {room.type}
                                  </Typography>
                                  <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
                                    Lighting: {room.lighting} | Condition: {room.condition}
                                  </Typography>
                                  
                                  {/* Active Spawned Entities in Room */}
                                  {entitiesInRoom.length > 0 && (
                                    <Box sx={{ mb: 2, p: 1, bgcolor: '#ffcdd2', borderRadius: 1 }}>
                                      <Typography variant="subtitle2" color="error" sx={{ fontWeight: 'bold' }}>
                                        ⚠️ ACTIVE ENTITIES ({entitiesInRoom.length}):
                                      </Typography>
                                      {entitiesInRoom.map((entity, index) => (
                                        <Chip
                                          key={index}
                                          label={`${entity.type} (P:${entity.powerLevel}, ${entity.state})`}
                                          size="small"
                                          color="error"
                                          sx={{ mr: 1, mb: 1 }}
                                          onClick={() => setSelectedEntity(entity.type)}
                                        />
                                      ))}
                                    </Box>
                                  )}

                                  {room.scraps.length > 0 && (
                                    <Box sx={{ mb: 2 }}>
                                      <Typography variant="subtitle2" color="success.main">
                                        Scrap Items:
                                      </Typography>
                                      {room.scraps.map((scrap, index) => (
                                        <Chip
                                          key={index}
                                          label={`${scrap.name} (${scrap.value})`}
                                          size="small"
                                          color={getRarityColor(scrap.rarity)}
                                          sx={{ mr: 1, mb: 1 }}
                                        />
                                      ))}
                                    </Box>
                                  )}

                                  {room.traps.length > 0 && (
                                    <Box>
                                      <Typography variant="subtitle2" color="warning.main">
                                        Traps:
                                      </Typography>
                                      {room.traps.map((trap, index) => (
                                        <Typography key={index} variant="caption" display="block">
                                          {trap.name} (Damage: {trap.damage}, Difficulty: {trap.difficulty})
                                        </Typography>
                                      ))}
                                    </Box>
                                  )}
                                </CardContent>
                              </Card>
                            </Grid>
                          );
                        })}
                      </Grid>
                    </Box>
                  )}

                  {/* Tab 2: Entity Stats */}
                  {activeTab === 2 && (
                    <Box sx={{ mt: 3 }}>
                      <Typography variant="h6" gutterBottom>
                        Entity Adversary Stats (Genesys RPG)
                      </Typography>
                      <Alert severity="info" sx={{ mb: 2 }}>
                        Power levels determine spawn limits: Indoor entities cannot exceed {MOONS[selectedMoon].powerLevels.maxIndoor} total power, 
                        Outdoor entities cannot exceed {MOONS[selectedMoon].powerLevels.maxOutdoor} total power.
                      </Alert>
                      <TableContainer component={Paper} sx={{ bgcolor: '#2e2e2e' }}>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell sx={{ color: 'white' }}>Entity</TableCell>
                              <TableCell sx={{ color: 'white' }}>Power Level</TableCell>
                              <TableCell sx={{ color: 'white' }}>Characteristics</TableCell>
                              <TableCell sx={{ color: 'white' }}>Combat Stats</TableCell>
                              <TableCell sx={{ color: 'white' }}>Special Abilities</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {Object.entries(ENTITIES).map(([name, stats]) => {
                              const powerLevel = ENTITY_POWER_LEVELS[name] || 1;
                              return (
                                <TableRow key={name}>
                                  <TableCell sx={{ color: 'white' }}>
                                    <Typography variant="subtitle2">{name}</Typography>
                                    <Typography variant="caption" color="text.secondary">
                                      {stats.description}
                                    </Typography>
                                  </TableCell>
                                  <TableCell sx={{ color: 'white' }}>
                                    <Chip 
                                      label={`Power: ${powerLevel}`} 
                                      color={powerLevel >= 3 ? 'error' : powerLevel === 2 ? 'warning' : 'success'}
                                      size="small"
                                    />
                                  </TableCell>
                                  <TableCell sx={{ color: 'white' }}>
                                    <Typography variant="caption" display="block">
                                      BR: {stats.brawn} | AG: {stats.agility} | INT: {stats.intellect}
                                    </Typography>
                                    <Typography variant="caption" display="block">
                                      CUN: {stats.cunning} | WIL: {stats.willpower} | PR: {stats.presence}
                                    </Typography>
                                  </TableCell>
                                  <TableCell sx={{ color: 'white' }}>
                                    <Typography variant="caption" display="block">
                                      Soak: {stats.soak} | Wounds: {stats.wounds} | Strain: {stats.strain}
                                    </Typography>
                                    <Typography variant="caption" display="block">
                                      Defense: {stats.defense.melee}/{stats.defense.ranged}
                                    </Typography>
                                  </TableCell>
                                  <TableCell sx={{ color: 'white' }}>
                                    <Typography variant="caption">
                                      {stats.abilities.slice(0, 2).join('; ')}
                                    </Typography>
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Box>
                  )}

                  {/* Tab 3: Scrap Database */}
                  {activeTab === 3 && (
                    <Box sx={{ mt: 3 }}>
                      <Typography variant="h6" gutterBottom>Enhanced Scrap Item Database</Typography>
                      <Alert severity="info" sx={{ mb: 2 }}>
                        Scrap spawning uses weighted rarity system. Higher-tier moons have increased chances for rare items.
                        Current moon tier: {MOONS[selectedMoon].hazardLevel}/5
                      </Alert>
                      <Grid container spacing={2}>
                        {Object.entries(SCRAPS).map(([name, scrap]) => (
                          <Grid item xs={12} sm={6} md={4} lg={3} key={name}>
                            <Card sx={{ bgcolor: '#fafafa', height: '100%', boxShadow: 2 }}>
                              <CardContent>
                                <Typography variant="h6" gutterBottom color="primary">{name}</Typography>
                                <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                                  <Chip label={scrap.rarity} color={getRarityColor(scrap.rarity)} size="small" />
                                  <Chip label={scrap.weight} variant="outlined" size="small" />
                                  <Chip label={`Weight: ${scrap.rarityWeight || 10}`} variant="outlined" size="small" color="info" />
                                </Box>
                                <Typography variant="body2" color="success.main" sx={{ fontWeight: 'bold' }}>
                                  Value: ${scrap.minValue} - ${scrap.maxValue}
                                </Typography>
                              </CardContent>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  )}

                  {/* Tab 4: Weather Rules */}
                  {activeTab === 4 && (
                    <Box sx={{ mt: 3 }}>
                      <Typography variant="h6" gutterBottom>Weather Conditions & Effects</Typography>
                      <Alert severity="info" sx={{ mb: 3 }}>
                        Weather conditions affect the entire mission and apply various mechanical effects to player actions. 
                        {generatedFacility && (
                          <>The current facility weather is: <strong>{generatedFacility.weather}</strong></>
                        )}
                      </Alert>
                      <Grid container spacing={3}>
                        {Object.entries(WEATHER_EFFECTS).map(([weatherType, effects]) => (
                          <Grid item xs={12} key={weatherType}>
                            <Card sx={{ 
                              bgcolor: generatedFacility?.weather === weatherType ? 
                                (weatherType === 'Eclipsed' ? '#f3e5f5' : '#e3f2fd') : '#fafafa',
                              border: generatedFacility?.weather === weatherType ? 
                                (weatherType === 'Eclipsed' ? '2px solid #9c27b0' : '2px solid #1976d2') : 'none',
                              boxShadow: 2 
                            }}>
                              <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                  <Typography variant="h5" color="primary" sx={{ flexGrow: 1 }}>
                                    {weatherType} {weatherType === 'Eclipsed' && ' 🌑'}
                                  </Typography>
                                  {generatedFacility?.weather === weatherType && (
                                    <Chip
                                      label="Current Weather"
                                      color={weatherType === 'Eclipsed' ? 'secondary' : 'primary'}
                                      variant="filled"
                                    />
                                  )}
                                </Box>
                                
                                <Typography variant="body1" paragraph color="text.secondary">
                                  {effects.description}
                                </Typography>
                                
                                <Grid container spacing={2}>
                                  <Grid item xs={12} md={6}>
                                    <Typography variant="h6" gutterBottom color="secondary">Environmental Effects</Typography>
                                    <Typography variant="subtitle2" gutterBottom>Narrative Effects:</Typography>
                                    {effects.effects.map((effect, index) => (
                                      <Typography key={index} variant="body2" sx={{ mb: 1 }}>• {effect}</Typography>
                                    ))}
                                  </Grid>
                                  <Grid item xs={12} md={6}>
                                    <Typography variant="h6" gutterBottom color="secondary">Mechanical Effects</Typography>
                                    <Alert 
                                      severity={weatherType === 'Clear' ? 'success' : 
                                               weatherType === 'Eclipsed' ? 'error' : 'warning'}
                                      sx={{ mb: 2 }}
                                    >
                                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                        {effects.mechanicalEffects}
                                      </Typography>
                                    </Alert>
                                  </Grid>
                                </Grid>
                              </CardContent>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* Moon Information Panel */}
          <Grid item xs={12} md={6}>
            <Card sx={{ bgcolor: 'white', boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">
                  Moon Information: {selectedMoon}
                </Typography>
                
                <Typography variant="body2" paragraph color="text.secondary" sx={{ fontStyle: 'italic' }}>
                  {MOONS[selectedMoon].description}
                </Typography>
                
                <Box sx={{ mb: 2 }}>
                  <Chip
                    label={`Difficulty: ${MOONS[selectedMoon].difficulty}`}
                    color={getDifficultyColor(MOONS[selectedMoon].difficulty)}
                    sx={{ mr: 1, mb: 1 }}
                  />
                  <Chip
                    label={`Hazard Level: ${MOONS[selectedMoon].hazardLevel}`}
                    color="warning"
                    sx={{ mr: 1, mb: 1 }}
                  />
                  <Chip
                    label={`Cost: ${MOONS[selectedMoon].cost} credits`}
                    color={MOONS[selectedMoon].cost === 0 ? 'success' : 'error'}
                    sx={{ mr: 1, mb: 1 }}
                  />
                  <Chip
                    label={`Map Size: x${MOONS[selectedMoon].mapSizeMultiplier}`}
                    variant="outlined"
                    sx={{ mr: 1, mb: 1 }}
                  />
                </Box>
                
                <Typography variant="subtitle2" gutterBottom>Power Limits:</Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                  <Chip label={`Indoor: ${MOONS[selectedMoon].powerLevels.maxIndoor}`} color="info" size="small" />
                  <Chip label={`Outdoor: ${MOONS[selectedMoon].powerLevels.maxOutdoor}`} color="warning" size="small" />
                  <Chip label={`Daytime: ${MOONS[selectedMoon].powerLevels.maxDaytime}`} color="success" size="small" />
                </Box>
                
                <Typography variant="subtitle2" gutterBottom>Weather Conditions:</Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                  {MOONS[selectedMoon].weather.map((weather, index) => (
                    <Chip
                      key={index}
                      label={weather}
                      variant="outlined"
                      size="small"
                      color={weather === 'Eclipsed' ? 'secondary' : 'default'}
                    />
                  ))}
                </Box>

                <Typography variant="subtitle2" gutterBottom>
                  Expected Scrap: ${MOONS[selectedMoon].minScrapValue} - ${MOONS[selectedMoon].maxScrapValue} 
                  ({MOONS[selectedMoon].scrapSpawnRange.min}-{MOONS[selectedMoon].scrapSpawnRange.max} items)
                </Typography>

                <Typography variant="subtitle2" gutterBottom>
                  <strong>Night Start Time:</strong> {formatTime(MOONS[selectedMoon].nightStartTime)}
                </Typography>
                <Typography variant="caption" display="block" sx={{ color: 'text.secondary', mb: 2 }}>
                  Outdoor entities (except daytime) can only spawn after {formatTime(MOONS[selectedMoon].nightStartTime)} or during Eclipse
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Statistics Panel */}
          <Grid item xs={12} md={6}>
            <Card sx={{ bgcolor: 'white', boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">Enhanced Session Statistics</Typography>
                
                {generatedFacility ? (
                  <Box>
                    <Typography variant="body2" gutterBottom>
                      <strong>Current Facility:</strong> {generatedFacility.moon}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>Generated:</strong> {generatedFacility.generatedAt}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>Mission Time:</strong> {formatTime(currentTime)}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>Weather:</strong> {generatedFacility.weather} {isEclipsed && '🌑'}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>Active Entities:</strong> {gameEntities.length}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>Total Scrap Items:</strong> {generatedFacility.rooms.reduce((sum, room) => sum + room.scraps.length, 0)}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>Estimated Total Value:</strong> ${generatedFacility.totalValue}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>Next Entity Spawn:</strong> {formatTime(nextEntitySpawn)}
                    </Typography>
                  </Box>
                ) : (
                  <Alert severity="info">Generate a facility to see statistics</Alert>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Entity Tracking Panel */}
          {generatedFacility && gameEntities.length > 0 && (
            <Grid item xs={12}>
              <Card sx={{ bgcolor: '#1a1a1a', boxShadow: 3, border: isEclipsed ? '2px solid #9c27b0' : '2px solid #ff6b6b' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ color: isEclipsed ? '#9c27b0' : '#ff6b6b' }}>
                    {isEclipsed ? '🌑 Eclipse Entity Tracking System' : '🚨 Entity Tracking System'}
                  </Typography>
                  <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
                    {gameEntities.map((entity) => (
                      <Card key={entity.id} sx={{ mb: 1, bgcolor: '#2a2a2a', border: '1px solid #444' }}>
                        <CardContent sx={{ p: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography variant="subtitle1" sx={{ color: isEclipsed ? '#9c27b0' : '#ff6b6b', fontWeight: 'bold' }}>
                              {entity.type} (Power: {entity.powerLevel})
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Chip 
                                label={entity.state} 
                                size="small" 
                                color={entity.state === 'moving' ? 'warning' : 'error'}
                                sx={{ color: 'white' }}
                              />
                              <Chip 
                                label={entity.isOutdoor ? 'Outdoor' : 'Indoor'}
                                size="small"
                                color={entity.isOutdoor ? 'info' : 'secondary'}
                                sx={{ color: 'white' }}
                              />
                            </Box>
                          </Box>
                          <Typography variant="body2" sx={{ color: '#ffffff' }}>
                            <strong>Location:</strong> {entity.isOutdoor ? entity.location : `Room ${entity.location}`}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#bbbbbb' }}>
                            <strong>Spawned:</strong> {formatTime(entity.spawnTime)} | 
                            <strong> Last Activity:</strong> {formatTime(entity.lastMoved)}
                          </Typography>
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      </Container>

      {/* Entity Details Dialog */}
      <Dialog open={!!selectedEntity} onClose={() => setSelectedEntity(null)} maxWidth="md" fullWidth>
        <DialogTitle>Entity Details: {selectedEntity}</DialogTitle>
        <DialogContent>
          {selectedEntity && ENTITIES[selectedEntity] && (
            <Box>
              <Typography variant="body1" paragraph>
                {ENTITIES[selectedEntity].description}
              </Typography>
              
              <Typography variant="h6" gutterBottom>Characteristics</Typography>
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={6}>
                  <Typography variant="body2">Brawn: {ENTITIES[selectedEntity].brawn}</Typography>
                  <Typography variant="body2">Agility: {ENTITIES[selectedEntity].agility}</Typography>
                  <Typography variant="body2">Intellect: {ENTITIES[selectedEntity].intellect}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">Cunning: {ENTITIES[selectedEntity].cunning}</Typography>
                  <Typography variant="body2">Willpower: {ENTITIES[selectedEntity].willpower}</Typography>
                  <Typography variant="body2">Presence: {ENTITIES[selectedEntity].presence}</Typography>
                </Grid>
              </Grid>
              
              <Typography variant="h6" gutterBottom>Combat Statistics</Typography>
              <Typography variant="body2">Soak Value: {ENTITIES[selectedEntity].soak}</Typography>
              <Typography variant="body2">Wound Threshold: {ENTITIES[selectedEntity].wounds}</Typography>
              <Typography variant="body2">Strain Threshold: {ENTITIES[selectedEntity].strain}</Typography>
              <Typography variant="body2">
                Defense: {ENTITIES[selectedEntity].defense.melee} Melee / {ENTITIES[selectedEntity].defense.ranged} Ranged
              </Typography>
              
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Special Abilities</Typography>
              {ENTITIES[selectedEntity].abilities.map((ability, index) => (
                <Typography key={index} variant="body2" sx={{ mb: 1 }}>• {ability}</Typography>
              ))}
              
              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  <strong>Power Level:</strong> {ENTITY_POWER_LEVELS[selectedEntity] || 1}
                </Typography>
              </Alert>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedEntity(null)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Room Details Dialog */}
      <Dialog open={!!selectedRoom} onClose={() => setSelectedRoom(null)} maxWidth="md" fullWidth>
        <DialogTitle>Room {selectedRoom?.id}: {selectedRoom?.type}</DialogTitle>
        <DialogContent>
          {selectedRoom && (
            <Box>
              <Typography variant="h6" gutterBottom>Room Conditions</Typography>
              <Typography variant="body2">Lighting: {selectedRoom.lighting}</Typography>
              <Typography variant="body2">Condition: {selectedRoom.condition}</Typography>
              
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Door Connections</Typography>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Typography variant="body2">North: {selectedRoom.doors.north}</Typography>
                  <Typography variant="body2">South: {selectedRoom.doors.south}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">East: {selectedRoom.doors.east}</Typography>
                  <Typography variant="body2">West: {selectedRoom.doors.west}</Typography>
                </Grid>
              </Grid>
              
              {selectedRoom.scraps.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="h6" gutterBottom>Scrap Items</Typography>
                  {selectedRoom.scraps.map((scrap, index) => (
                    <Box key={index} sx={{ mb: 1 }}>
                      <Chip 
                        label={`${scrap.name} - ${scrap.value}`} 
                        color={getRarityColor(scrap.rarity)} 
                        sx={{ mr: 1 }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        {scrap.weight} weight, {scrap.rarity} rarity
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}
              
              {selectedRoom.traps.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="h6" gutterBottom>Traps</Typography>
                  {selectedRoom.traps.map((trap, index) => (
                    <Alert key={index} severity="warning" sx={{ mb: 1 }}>
                      <Typography variant="body2">
                        <strong>{trap.name}</strong> - Damage: {trap.damage}, Difficulty: {trap.difficulty}
                      </Typography>
                    </Alert>
                  ))}
                </Box>
              )}
              
              {/* Show active entities in this room */}
              {gameEntities.filter(entity => !entity.isOutdoor && entity.location === selectedRoom.id).length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="h6" gutterBottom color="error">Active Entities in Room</Typography>
                  {gameEntities
                    .filter(entity => !entity.isOutdoor && entity.location === selectedRoom.id)
                    .map((entity, index) => (
                      <Alert key={index} severity="error" sx={{ mb: 1 }}>
                        <Typography variant="body2">
                          <strong>{entity.type}</strong> (Power: {entity.powerLevel}) - State: {entity.state}
                        </Typography>
                      </Alert>
                    ))}
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedRoom(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default LethalCompanyRPG;