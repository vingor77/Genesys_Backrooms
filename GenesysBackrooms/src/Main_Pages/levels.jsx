import React, { useState, useEffect } from 'react';
import { collection, doc, onSnapshot, query, updateDoc, setDoc } from "firebase/firestore";
import db from '../Components/firebase';
import Level from "../Components/level";
import NotLoggedIn from "../Components/notLoggedIn";
import { requireSession, getActiveSession, isDM } from '../Components/sessionUtils';

// Toast notification component
const Toast = ({ message, severity, isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const severityClasses = {
    success: 'bg-emerald-500 border-emerald-400',
    error: 'bg-red-500 border-red-400',
    warning: 'bg-amber-500 border-amber-400',
    info: 'bg-blue-500 border-blue-400'
  };

  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  };

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-down">
      <div className={`${severityClasses[severity]} text-white px-6 py-4 rounded-lg border shadow-xl flex items-center space-x-3 min-w-80`}>
        <div className="text-xl font-bold">{icons[severity]}</div>
        <span className="flex-1">{message}</span>
        <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

// Example Level 0 data for upload
const levelData = [
  {
    "name": "Level 0 - The Lobby",
    "levelNumber": 0,
    "description": "An endless maze of randomly segmented yellow-tinted rooms with old moist carpet, walls with a monochromatic tone of yellow, and buzzing fluorescent lights. The hum-buzz of the lights is omnipresent.",
    "generationType": "procedural",
    "isCanonical": true,
    
    "atmosphere": {
      "baseDescription": "Liminal, unsettling, familiar yet wrong. The endless monotony of identical rooms creates a profound sense of isolation and wrongness.",
      "lightLevel": "adequate",
      "lighting": "fluorescent",
      "perceptionModifier": 0,
      "temperature": "warm",
      "humidity": "damp",
      "airQuality": "stale",
      "soundLevel": "ambient",
      "ambientSounds": ["Fluorescent light buzzing", "Distant humming", "Occasional electrical crackling", "Muffled footsteps", "Walls settling"]
    },
    
    "physical": {
      "floorMaterial": "Old moist carpet, yellowed with age",
      "wallMaterial": "Yellowed wallpaper over drywall",
      "ceilingHeight": "standard",
      "roomSizeRange": {
        "min": 12,
        "max": 40
      },
      "structuralIntegrity": "worn"
    },
    
    "dangerLevel": 1,
    "survivalDifficulty": "easy",
    
    "spawnRates": {
      "objects": {
        "enabled": true,
        "chance": 35,
        "minPerRoom": 0,
        "maxPerRoom": 3,
        "categoryWeights": {
          "common": 60,
          "uncommon": 30,
          "rare": 8,
          "special": 2
        },
        "specificObjects": [
          {
            "name": "Almond Water",
            "rarity": 3,
            "weight": 25,
            "description": "A bottle of strange-tasting water that somehow restores vitality"
          },
          {
            "name": "Rotted Food",
            "rarity": 2,
            "weight": 15,
            "description": "Moldy, unusable food remnants"
          },
          {
            "name": "Flashlight",
            "rarity": 4,
            "weight": 20,
            "description": "A working flashlight, battery life unknown"
          },
          {
            "name": "Office Supplies",
            "rarity": 1,
            "weight": 30,
            "description": "Pens, paper, staplers - mundane office items"
          },
          {
            "name": "Fire Exit Sign",
            "rarity": 2,
            "weight": 10,
            "description": "A detached emergency exit sign"
          }
        ]
      },
      
      "phenomena": {
        "enabled": true,
        "chance": 15,
        "maxSimultaneous": 1,
        "specificPhenomena": [
          {
            "name": "Lights Flickering",
            "weight": 40,
            "description": "The fluorescent lights flicker ominously, temporarily increasing darkness perception penalties"
          },
          {
            "name": "Wall Phase",
            "weight": 20,
            "description": "Walls seem to shift and phase slightly, disorienting observers"
          },
          {
            "name": "Echo Chamber",
            "weight": 25,
            "description": "Sounds echo strangely, making it difficult to determine their source"
          },
          {
            "name": "Temperature Spike",
            "weight": 15,
            "description": "Room temperature suddenly increases, causing discomfort and mild exhaustion"
          }
        ]
      },
      
      "entities": {
        "enabled": true,
        "chance": 8,
        "minPerRoom": 0,
        "maxPerRoom": 1,
        "hostilityChance": 30,
        "entityTypes": [
          {
            "name": "Hound",
            "weight": 30,
            "maxCount": 1,
            "description": "Aggressive quadrupedal entities that hunt in packs"
          },
          {
            "name": "Smiler",
            "weight": 20,
            "maxCount": 1,
            "description": "Entities that lurk in darkness, identifiable by their glowing smile"
          },
          {
            "name": "Faceling",
            "weight": 35,
            "maxCount": 2,
            "description": "Humanoid entities with no facial features, generally docile but unpredictable"
          },
          {
            "name": "Skin-Stealer",
            "weight": 10,
            "maxCount": 1,
            "description": "Mimics humans by wearing their skin, highly dangerous"
          },
          {
            "name": "Clump",
            "weight": 5,
            "maxCount": 1,
            "description": "Amorphous entities made of carpet fibers and dust"
          }
        ]
      },
      
      "peopleOfInterest": {
        "enabled": true,
        "chance": 2,
        "specificPeople": [
          {
            "name": "The Wanderer",
            "weight": 50,
            "description": "A helpful survivor who has been here for years"
          },
          {
            "name": "The Lost Child",
            "weight": 30,
            "description": "A disoriented young person seeking their way out"
          },
          {
            "name": "The Hermit",
            "weight": 20,
            "description": "A reclusive individual who has adapted to Level 0"
          }
        ]
      },
      
      "exits": {
        "toOtherLevels": {
          "chance": 5,
          "possibleDestinations": [
            {
              "levelName": "Level 1 - Habitable Zone",
              "levelNumber": 1,
              "weight": 40,
              "method": "Door with concrete stairwell"
            },
            {
              "levelName": "Level 2 - Pipe Dreams",
              "levelNumber": 2,
              "weight": 25,
              "method": "Maintenance door"
            },
            {
              "levelName": "Level 3 - Electrical Station",
              "levelNumber": 3,
              "weight": 20,
              "method": "Service elevator"
            },
            {
              "levelName": "Level 4 - Abandoned Office",
              "levelNumber": 4,
              "weight": 15,
              "method": "Office door with flickering lights"
            }
          ]
        },
        "toOutposts": {
          "chance": 3,
          "possibleOutposts": [
            {
              "name": "The Manila Room",
              "weight": 60,
              "description": "A safe haven established by M.E.G."
            },
            {
              "name": "Trader's Den",
              "weight": 40,
              "description": "A small trading post run by survivors"
            }
          ]
        },
        "toNextRoom": {
          "minExits": 2,
          "maxExits": 5,
          "deadEndChance": 8
        }
      },
      
      "hazards": {
        "enabled": true,
        "chance": 12,
        "types": [
          {
            "type": "electrical_short",
            "chance": 35,
            "severity": 2,
            "description": "Exposed wiring that can shock the unwary"
          },
          {
            "type": "carpet_tear",
            "chance": 40,
            "severity": 1,
            "description": "Torn carpet that can cause tripping"
          },
          {
            "type": "ceiling_leak",
            "chance": 20,
            "severity": 1,
            "description": "Water dripping from damaged ceiling"
          },
          {
            "type": "unstable_wall",
            "chance": 5,
            "severity": 3,
            "description": "Wall section that could collapse"
          }
        ]
      }
    },
    
    "navigation": {
      "complexity": "maze_like",
      "loopingChance": 30,
      "landmarkChance": 5,
      "seedBased": true,
      "corridorChance": 40
    },
    
    "resources": {
      "waterAvailability": "occasional",
      "foodAvailability": "scarce",
      "restingSpots": {
        "chance": 20,
        "quality": "poor"
      },
      "scrapMaterialChance": 15
    },
    
    "specialMechanics": {
      "timeDistortion": false,
      "dimensionalInstability": true,
      "memoryEffects": false,
      "communicationInterference": {
        "enabled": true,
        "severity": 1
      },
      "gravitationalAnomalies": false,
      "customRules": [
        "The Buzzing: Constant exposure to fluorescent lights causes minor strain accumulation (1 strain per 4 hours)",
        "Endless Monotony: Navigation checks receive +1 Setback die due to identical-looking rooms",
        "Carpet Memory: Footprints in the damp carpet fade after 30 minutes but can be tracked",
        "No-Clipping: Rare chance (1%) when passing through doorways to phase into the walls"
      ]
    },
    
    "fearFactors": {
      "baseFearLevel": 2,
      "isolationFactor": true,
      "claustrophobiaFactor": false,
      "darknessFactor": false,
      "fearTriggers": [
        "Sudden light failure",
        "Hearing footsteps when alone",
        "Encountering entities",
        "Realization of being lost",
        "Finding evidence of previous victims"
      ]
    },
    
    "lore": {
      "discoveryNotes": [
        "A torn journal page describing descent into madness",
        "Markings on walls counting days survived",
        "M.E.G. informational pamphlet about Level 0",
        "Warning signs about entity encounters",
        "Map fragments drawn by previous wanderers"
      ],
      "backgroundStory": "Level 0 is the primary entrance to the Backrooms. It manifests as an endless complex of mono-yellow rooms, with the sound of fluorescent lights humming at a constant frequency. The level appears to be an abandoned office complex, but its true nature is far more sinister. Many who enter never find their way out.",
      "rumorsMentioned": [
        "There's a way to escape back to reality from Level 0",
        "The walls are alive and watching",
        "Some rooms repeat in patterns if you can decode them",
        "Almond water can cure any ailment from the Backrooms"
      ],
      "warnings": [
        "Never drink water from the ceiling leaks",
        "If the lights go out, don't move",
        "Entities are attracted to loud noises",
        "Don't trust anyone who knows your name",
        "Mark your path or risk walking in circles forever"
      ]
    },
    
    "access": {
      "entryPoints": [
        {
          "fromLocation": "Reality",
          "method": "No-clipping through walls, floors, or reality",
          "description": "The primary method of entering the Backrooms - accidentally phasing through reality"
        }
      ],
      "exitPoints": [
        {
          "toLevel": "Level 1",
          "method": "Stairwell door",
          "description": "Concrete stairwells that descend into Level 1",
          "difficulty": "Easy to find, moderate to access"
        },
        {
          "toLocation": "Reality",
          "method": "Unknown/Rumored",
          "description": "Supposedly possible but unconfirmed",
          "difficulty": "Unknown - possibly impossible"
        }
      ],
      "escapeToShipAllowed": true,
      "teleporterRange": true
    },
    
    "balance": {
      "recommendedLevel": 1,
      "recommendedGroupSize": {
        "min": 2,
        "max": 6
      },
      "estimatedTimeMinutes": 120,
      "restingFrequency": "occasional"
    },
    
    "randomEvents": [
      {
        "name": "Entity Patrol",
        "chance": 10,
        "conditions": ["At least 30 minutes in level"],
        "description": "A hostile entity begins actively hunting in the area"
      },
      {
        "name": "Supply Cache",
        "chance": 8,
        "conditions": ["Less than 50% resources"],
        "description": "Discover a hidden stash of almond water and supplies"
      },
      {
        "name": "Survivor Encounter",
        "chance": 12,
        "conditions": ["No recent combat"],
        "description": "Meet another wanderer, possibly friendly"
      },
      {
        "name": "Power Surge",
        "chance": 15,
        "conditions": ["Any time"],
        "description": "Lights intensify painfully before dimming, temporarily blinding occupants"
      },
      {
        "name": "The Hum",
        "chance": 20,
        "conditions": ["Any time"],
        "description": "The omnipresent buzzing grows louder and more oppressive, causing strain"
      }
    ],
    
    "tags": ["indoor", "liminal", "canonical", "starter", "maze", "office", "endless", "yellow", "fluorescent"],
    "status": "active"
  }
];

export default function Levels() {
  const [levels, setLevels] = useState([]);
  const [dangerLevel, setDangerLevel] = useState('None');
  const [generationType, setGenerationType] = useState('None');
  const [name, setName] = useState('');
  const [showHiddenOnly, setShowHiddenOnly] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const [activeLevel, setActiveLevel] = useState(null);
  const sessionId = getActiveSession();
  const userIsDM = isDM();

  const showToast = (message, severity = 'success') => {
    setToast({ open: true, message, severity });
  };

  const hideToast = () => {
    setToast({ ...toast, open: false });
  };

  useEffect(() => {
    if (!requireSession()) return;
    if (localStorage.getItem("loggedIn") !== 'false') {
      getFromDB();
    }
  }, [sessionId]);

  const getFromDB = () => {
    if (!sessionId) return;

    const q = query(collection(db, 'Levels'));

    const unsub = onSnapshot(q, (querySnapshot) => {
      const queryData = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const sessionVisibility = data.sessionVisibility || {};
        
        queryData.push({ 
          docId: doc.id, 
          ...data,
          hiddenInCurrentSession: sessionVisibility[sessionId] === false
        });
      });
      
      queryData.sort((a, b) => a.levelNumber - b.levelNumber);
      
      setLevels(queryData);
      setLoading(false);
    }, (error) => {
      console.error('Error loading levels:', error);
      showToast('Error loading levels', 'error');
      setLoading(false);
    });

    return () => { unsub(); };
  };

  const uploadLevelData = async () => {
    if (!userIsDM) {
      showToast('Only DMs can upload level data', 'error');
      return;
    }

    const confirmUpload = window.confirm(
      `This will add ${levelData.length} level(s) to the global database (visible to all sessions by default). Continue?`
    );

    if (!confirmUpload) return;

    try {
      for (let i = 0; i < levelData.length; i++) {
        const level = levelData[i];
        const levelDoc = {
          ...level,
          sessionVisibility: {}
        };

        await setDoc(doc(db, 'Levels', `Level${level.levelNumber}`), levelDoc);
      }
      
      showToast(`Successfully added ${levelData.length} level(s)!`, 'success');
    } catch (error) {
      showToast('Error uploading level data', 'error');
      console.error('Upload error:', error);
    }
  };

  const getFilteredLevels = () => {
    return levels.filter((item) => {
      const visibilityCheck = userIsDM ? true : !item.hiddenInCurrentSession;
      const hiddenFilterCheck = showHiddenOnly ? item.hiddenInCurrentSession : true;
      
      return (
        visibilityCheck &&
        hiddenFilterCheck &&
        (item.dangerLevel?.toString() === dangerLevel || dangerLevel === 'None') &&
        (item.generationType === generationType || generationType === 'None') &&
        (item.name.toUpperCase().includes(name.toUpperCase()) || name === '')
      );
    });
  };

  const toggleLevelVisibility = async (level) => {
    if (!userIsDM || !sessionId) return;
    
    try {
      const currentSessionVisibility = level.sessionVisibility || {};
      const newVisibility = {
        ...currentSessionVisibility,
        [sessionId]: currentSessionVisibility[sessionId] === false ? true : false
      };

      await updateDoc(doc(db, 'Levels', level.docId), {
        sessionVisibility: newVisibility
      });
      
      const action = newVisibility[sessionId] === false ? 'hidden' : 'revealed';
      showToast(`${level.name} ${action} for this session`, 'success');
    } catch (error) {
      console.error('Error toggling visibility:', error);
      showToast('Error updating level visibility', 'error');
    }
  };

  const clearAllFilters = () => {
    setName('');
    setDangerLevel('None');
    setGenerationType('None');
    setShowHiddenOnly(false);
    showToast('All filters cleared');
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (name !== '') count++;
    if (dangerLevel !== 'None') count++;
    if (generationType !== 'None') count++;
    if (showHiddenOnly) count++;
    return count;
  };

  const getDangerLabel = (danger) => {
    const labels = {
      0: 'Safe',
      1: 'Low Danger',
      2: 'Moderate',
      3: 'Dangerous',
      4: 'Very Dangerous',
      5: 'Lethal'
    };
    return labels[danger] || 'Unknown';
  };

  if (localStorage.getItem("loggedIn") === 'false') {
    return <NotLoggedIn />;
  }

  const FilterChip = ({ label, onDelete }) => (
    <div className="inline-flex items-center space-x-2 bg-cyan-500/20 text-cyan-300 px-3 py-1 rounded-full text-sm border border-cyan-500/30">
      <span>{label}</span>
      <button onClick={onDelete} className="text-cyan-400 hover:text-cyan-200 transition-colors">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
        </svg>
      </button>
    </div>
  );

  const DisplayItems = () => {
    const filteredLevels = getFilteredLevels();

    if (filteredLevels.length === 0) {
      return (
        <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-12 text-center">
          <svg className="w-16 h-16 text-gray-500 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd"></path>
          </svg>
          <h3 className="text-xl font-semibold text-white mb-2">No levels found</h3>
          <p className="text-gray-400 mb-4">Try adjusting your search criteria to find more levels</p>
          {getActiveFilterCount() > 0 && (
            <button
              onClick={clearAllFilters}
              className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Clear All Filters
            </button>
          )}
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <svg className="w-6 h-6 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd"></path>
            </svg>
            <h2 className="text-xl font-bold text-white">
              Found {filteredLevels.length} level{filteredLevels.length !== 1 ? 's' : ''}
            </h2>
          </div>
          <span className="bg-cyan-500/20 text-cyan-300 px-3 py-1 rounded-full text-sm font-bold">
            {levels.length} total
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLevels.map((item) => (
            <div key={item.docId} className="bg-black/20 backdrop-blur-lg rounded-xl border border-white/10 p-1 hover:bg-black/30 transition-all duration-300">
              <Level 
                currLevel={item} 
                onShowDetails={setActiveLevel}
                onToggleVisibility={toggleLevelVisibility}
                userIsDM={userIsDM}
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  const FilterSection = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Danger Level</label>
          <select
            value={dangerLevel}
            onChange={(e) => setDangerLevel(e.target.value)}
            className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
          >
            <option value="None" className="bg-gray-800">Any Danger Level</option>
            <option value="0" className="bg-gray-800">0 - Safe</option>
            <option value="1" className="bg-gray-800">1 - Low Danger</option>
            <option value="2" className="bg-gray-800">2 - Moderate</option>
            <option value="3" className="bg-gray-800">3 - Dangerous</option>
            <option value="4" className="bg-gray-800">4 - Very Dangerous</option>
            <option value="5" className="bg-gray-800">5 - Lethal</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Generation Type</label>
          <select
            value={generationType}
            onChange={(e) => setGenerationType(e.target.value)}
            className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
          >
            <option value="None" className="bg-gray-800">Any Type</option>
            <option value="procedural" className="bg-gray-800">🎲 Procedural</option>
            <option value="finite_mapped" className="bg-gray-800">🗺️ Finite/Mapped</option>
            <option value="hybrid" className="bg-gray-800">🔀 Hybrid</option>
          </select>
        </div>

        {userIsDM && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Visibility Filter</label>
            <button
              onClick={() => setShowHiddenOnly(!showHiddenOnly)}
              className={`w-full px-4 py-3 rounded-lg font-medium transition-all ${
                showHiddenOnly
                  ? 'bg-red-500/30 text-red-300 border-2 border-red-500/50'
                  : 'bg-white/5 text-gray-300 border-2 border-white/20 hover:bg-white/10'
              }`}
            >
              {showHiddenOnly ? '🚫 Hidden Only' : '👁️ Show All'}
            </button>
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Actions</label>
          <button
            onClick={clearAllFilters}
            disabled={getActiveFilterCount() === 0}
            className="w-full bg-gradient-to-r from-red-600/20 to-pink-600/20 hover:from-red-600/30 hover:to-pink-600/30 disabled:from-gray-600/20 disabled:to-gray-700/20 text-red-300 disabled:text-gray-500 font-medium px-4 py-3 rounded-lg border border-red-500/30 disabled:border-gray-500/30 transition-all duration-300 hover:scale-105 disabled:hover:scale-100 flex items-center justify-center space-x-2"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
            </svg>
            <span>Clear Filters</span>
          </button>
        </div>
      </div>

      {getActiveFilterCount() > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-300">Active Filters:</h3>
            <button
              onClick={clearAllFilters}
              className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors flex items-center space-x-1"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
              </svg>
              <span>Clear All</span>
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {name && <FilterChip label={`Name: "${name}"`} onDelete={() => setName('')} />}
            {dangerLevel !== 'None' && <FilterChip label={`Danger: ${getDangerLabel(parseInt(dangerLevel))}`} onDelete={() => setDangerLevel('None')} />}
            {generationType !== 'None' && <FilterChip label={`Type: ${generationType}`} onDelete={() => setGenerationType('None')} />}
            {showHiddenOnly && <FilterChip label="Hidden Only" onDelete={() => setShowHiddenOnly(false)} />}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-slate-900 to-cyan-900">
      <div className="w-full px-4 py-6 space-y-6">
        
        <div className="bg-gradient-to-r from-slate-900/50 to-cyan-900/50 backdrop-blur-lg rounded-2xl border border-white/10 p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
                <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd"></path>
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Backrooms Levels</h1>
                <p className="text-cyan-300">Explore the endless maze of reality's backrooms</p>
              </div>
            </div>
            
            {userIsDM && (
              <button 
                onClick={uploadLevelData}
                className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"></path>
                </svg>
                <span>Upload Level 0</span>
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-12">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-400 mb-4"></div>
              <h3 className="text-xl font-semibold text-white mb-2">Loading levels...</h3>
              <p className="text-gray-400">Please wait while we fetch the data</p>
            </div>
          </div>
        ) : levels.length > 0 ? (
          <>
            <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 overflow-hidden">
              <div className="bg-gradient-to-r from-cyan-600/20 to-blue-600/20 p-4 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <svg className="w-6 h-6 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3 7v10a2 2 0 002 2h14l-2-2H5V7h14V5a2 2 0 00-2-2H5a2 2 0 00-2 2v2z"></path>
                      <path d="M21 7H3v2h18V7z"></path>
                    </svg>
                    <h2 className="text-xl font-bold text-white">Search & Filter</h2>
                    {getActiveFilterCount() > 0 && (
                      <span className="bg-cyan-500/30 text-cyan-300 px-2 py-1 rounded-full text-xs font-bold">
                        {getActiveFilterCount()} active
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="bg-cyan-500/20 text-cyan-300 px-3 py-1 rounded-full text-sm font-bold">
                      {getFilteredLevels().length} shown
                    </span>
                    <button 
                      onClick={() => setFiltersOpen(!filtersOpen)}
                      className="md:hidden bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-400 p-2 rounded-lg transition-colors"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search levels by name..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white/5 border border-white/20 rounded-xl pl-12 pr-12 py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all text-lg"
                  />
                  {name && (
                    <button
                      onClick={() => setName('')}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white transition-colors"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                      </svg>
                    </button>
                  )}
                </div>

                <div className="hidden md:block">
                  <FilterSection />
                </div>
                
                {filtersOpen && (
                  <div className="md:hidden">
                    <FilterSection />
                  </div>
                )}
              </div>
            </div>

            <DisplayItems />
          </>
        ) : (
          <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-12">
            <div className="flex flex-col items-center justify-center text-center">
              <svg className="w-16 h-16 text-gray-500 mb-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd"></path>
              </svg>
              <h3 className="text-xl font-semibold text-white mb-2">No levels available</h3>
              <p className="text-gray-400">Upload Level 0 to get started</p>
            </div>
          </div>
        )}

        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          className="md:hidden fixed bottom-6 right-6 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 transform hover:scale-110"
        >
          <div className="relative">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd"></path>
            </svg>
            {getActiveFilterCount() > 0 && (
              <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {getActiveFilterCount()}
              </div>
            )}
          </div>
        </button>
      </div>

      <Toast 
        message={toast.message}
        severity={toast.severity} 
        isOpen={toast.open} 
        onClose={hideToast} 
      />

      {activeLevel && <LevelDetailsModal level={activeLevel} onClose={() => setActiveLevel(null)} />}
    </div>
  );
}

// Level Details Modal with comprehensive tabs
const LevelDetailsModal = ({ level, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="h-full w-full flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 md:m-4 md:rounded-2xl md:border-2 md:border-white/20 md:h-auto md:max-h-[90vh] md:max-w-6xl md:mx-auto overflow-hidden">
        
        <div className="flex-shrink-0 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border-b border-white/10">
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center text-2xl border border-white/30 shadow-lg">
                <span>🏢</span>
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg md:text-xl font-bold text-white truncate">{level.name}</h2>
                <p className="text-cyan-300 text-sm">{level.survivalDifficulty} | Danger Level {level.dangerLevel}</p>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="flex-shrink-0 p-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg border border-red-500/50 transition-all ml-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
              </svg>
            </button>
          </div>

          <div className="overflow-x-auto hide-scrollbar">
            <div className="flex gap-2 p-3 min-w-max">
              <MobileTabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon="📋" label="Overview" />
              <MobileTabButton active={activeTab === 'atmosphere'} onClick={() => setActiveTab('atmosphere')} icon="🌫️" label="Atmosphere" />
              <MobileTabButton active={activeTab === 'spawns'} onClick={() => setActiveTab('spawns')} icon="🎲" label="Spawns" />
              <MobileTabButton active={activeTab === 'navigation'} onClick={() => setActiveTab('navigation')} icon="🧭" label="Navigation" />
              <MobileTabButton active={activeTab === 'lore'} onClick={() => setActiveTab('lore')} icon="📜" label="Lore" />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'overview' && <LevelOverviewTab level={level} />}
          {activeTab === 'atmosphere' && <LevelAtmosphereTab level={level} />}
          {activeTab === 'spawns' && <LevelSpawnsTab level={level} />}
          {activeTab === 'navigation' && <LevelNavigationTab level={level} />}
          {activeTab === 'lore' && <LevelLoreTab level={level} />}
        </div>
      </div>
    </div>
  );
};

const MobileTabButton = ({ active, onClick, icon, label, count }) => (
  <button
    onClick={onClick}
    className={`flex-shrink-0 px-4 py-2 rounded-lg font-medium text-sm transition-all whitespace-nowrap ${
      active
        ? 'bg-cyan-500/30 text-cyan-300 border-2 border-cyan-500/50'
        : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
    }`}
  >
    <span className="mr-1">{icon}</span>
    {label}
    {count !== undefined && (
      <span className={`ml-1.5 px-1.5 py-0.5 rounded text-xs ${active ? 'bg-cyan-500/40' : 'bg-white/10'}`}>
        {count}
      </span>
    )}
  </button>
);

const LevelOverviewTab = ({ level }) => {
  return (
    <div className="space-y-4">
      <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
        <p className="text-white leading-relaxed">{level.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <StatCard icon="⚠️" label="Danger Level" value={`${level.dangerLevel}/5`} color="red" />
        <StatCard icon="🎯" label="Generation" value={level.generationType} color="purple" />
        <StatCard icon="🏃" label="Survival" value={level.survivalDifficulty} color="orange" />
        <StatCard icon="👥" label="Group Size" value={`${level.balance?.recommendedGroupSize?.min}-${level.balance?.recommendedGroupSize?.max}`} color="blue" />
      </div>

      {level.specialMechanics?.customRules && level.specialMechanics.customRules.length > 0 && (
        <div className="bg-amber-900/30 rounded-xl p-4 border border-amber-500/30">
          <h3 className="text-amber-300 font-bold mb-3 flex items-center gap-2">
            <span>⚙️</span> Special Rules
          </h3>
          <div className="space-y-2">
            {level.specialMechanics.customRules.map((rule, idx) => (
              <div key={idx} className="text-amber-200 text-sm flex items-start gap-2">
                <span className="text-amber-400 font-bold mt-0.5">•</span>
                <span>{rule}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const LevelAtmosphereTab = ({ level }) => {
  const atm = level.atmosphere;
  const phys = level.physical;
  
  return (
    <div className="space-y-4">
      <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
        <h3 className="text-white font-bold mb-2">Description</h3>
        <p className="text-gray-300 text-sm">{atm.baseDescription}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <StatCard icon="💡" label="Light Level" value={atm.lightLevel} color="yellow" />
        <StatCard icon="🌡️" label="Temperature" value={atm.temperature} color="red" />
        <StatCard icon="💧" label="Humidity" value={atm.humidity} color="cyan" />
        <StatCard icon="🌫️" label="Air Quality" value={atm.airQuality} color="gray" />
        <StatCard icon="🔊" label="Sound Level" value={atm.soundLevel} color="purple" />
        <StatCard icon="🏗️" label="Structure" value={phys.structuralIntegrity} color="orange" />
      </div>

      {atm.ambientSounds && atm.ambientSounds.length > 0 && (
        <div className="bg-purple-900/30 rounded-xl p-4 border border-purple-500/30">
          <h3 className="text-purple-300 font-bold mb-3 flex items-center gap-2">
            <span>🎵</span> Ambient Sounds
          </h3>
          <div className="flex flex-wrap gap-2">
            {atm.ambientSounds.map((sound, idx) => (
              <span key={idx} className="bg-purple-500/20 text-purple-200 px-3 py-1 rounded-full text-sm border border-purple-500/30">
                {sound}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
        <h3 className="text-white font-bold mb-3">Physical Properties</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Floor:</span>
            <span className="text-white">{phys.floorMaterial}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Walls:</span>
            <span className="text-white">{phys.wallMaterial}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Ceiling:</span>
            <span className="text-white">{phys.ceilingHeight}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Room Size:</span>
            <span className="text-white">{phys.roomSizeRange?.min}-{phys.roomSizeRange?.max}m²</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const LevelSpawnsTab = ({ level }) => {
  const spawns = level.spawnRates;
  
  return (
    <div className="space-y-4">
      <SpawnCategory 
        title="Objects" 
        icon="📦" 
        data={spawns.objects}
        items={spawns.objects?.specificObjects}
        color="cyan"
      />
      
      <SpawnCategory 
        title="Entities" 
        icon="👹" 
        data={spawns.entities}
        items={spawns.entities?.entityTypes}
        color="red"
      />
      
      <SpawnCategory 
        title="Phenomena" 
        icon="✨" 
        data={spawns.phenomena}
        items={spawns.phenomena?.specificPhenomena}
        color="purple"
      />
      
      <SpawnCategory 
        title="People of Interest" 
        icon="👤" 
        data={spawns.peopleOfInterest}
        items={spawns.peopleOfInterest?.specificPeople}
        color="blue"
      />

      {spawns.hazards?.enabled && (
        <div className="bg-orange-900/30 rounded-xl p-4 border border-orange-500/30">
          <h3 className="text-orange-300 font-bold mb-3 flex items-center gap-2">
            <span>⚠️</span> Environmental Hazards ({spawns.hazards.chance}% chance)
          </h3>
          <div className="space-y-2">
            {spawns.hazards.types?.map((hazard, idx) => (
              <div key={idx} className="bg-orange-500/10 rounded-lg p-3 border border-orange-500/20">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-orange-200 font-semibold text-sm">{hazard.type.replace(/_/g, ' ')}</span>
                  <span className="text-orange-300 text-xs">{hazard.chance}% | Severity {hazard.severity}</span>
                </div>
                <p className="text-orange-200/80 text-xs">{hazard.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const SpawnCategory = ({ title, icon, data, items, color }) => {
  if (!data?.enabled) return null;

  const colorClasses = {
    cyan: 'bg-cyan-900/30 border-cyan-500/30 text-cyan-300',
    red: 'bg-red-900/30 border-red-500/30 text-red-300',
    purple: 'bg-purple-900/30 border-purple-500/30 text-purple-300',
    blue: 'bg-blue-900/30 border-blue-500/30 text-blue-300',
    orange: 'bg-orange-900/30 border-orange-500/30 text-orange-300'
  };

  return (
    <div className={`${colorClasses[color]} rounded-xl p-4 border`}>
      <h3 className="font-bold mb-3 flex items-center gap-2">
        <span>{icon}</span> {title} ({data.chance}% spawn chance)
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3 text-sm">
        <div>Min per room: <span className="font-bold">{data.minPerRoom || 0}</span></div>
        <div>Max per room: <span className="font-bold">{data.maxPerRoom || 'N/A'}</span></div>
      </div>
      {items && items.length > 0 && (
        <div className="space-y-2">
          {items.map((item, idx) => (
            <div key={idx} className="bg-black/20 rounded-lg p-3 border border-white/10">
              <div className="flex justify-between items-start mb-1">
                <span className="font-semibold text-sm">{item.name}</span>
                <span className="text-xs opacity-75">Weight: {item.weight}</span>
              </div>
              {item.description && <p className="text-xs opacity-80">{item.description}</p>}
              {item.rarity !== undefined && <p className="text-xs opacity-75 mt-1">Rarity: {item.rarity}/10</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const LevelNavigationTab = ({ level }) => {
  const nav = level.navigation;
  const exits = level.spawnRates?.exits;
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <StatCard icon="🗺️" label="Complexity" value={nav.complexity} color="purple" />
        <StatCard icon="🔄" label="Loops" value={`${nav.loopingChance}%`} color="cyan" />
        <StatCard icon="📍" label="Landmarks" value={`${nav.landmarkChance}%`} color="orange" />
        <StatCard icon="🚪" label="Corridors" value={`${nav.corridorChance}%`} color="blue" />
      </div>

      <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
        <h3 className="text-white font-bold mb-3">Room Exits</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Min Exits:</span>
            <span className="text-white font-bold">{exits?.toNextRoom?.minExits}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Max Exits:</span>
            <span className="text-white font-bold">{exits?.toNextRoom?.maxExits}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Dead End Chance:</span>
            <span className="text-white font-bold">{exits?.toNextRoom?.deadEndChance}%</span>
          </div>
        </div>
      </div>

      {exits?.toOtherLevels?.possibleDestinations && (
        <div className="bg-green-900/30 rounded-xl p-4 border border-green-500/30">
          <h3 className="text-green-300 font-bold mb-3 flex items-center gap-2">
            <span>🚪</span> Level Exits ({exits.toOtherLevels.chance}% chance)
          </h3>
          <div className="space-y-2">
            {exits.toOtherLevels.possibleDestinations.map((dest, idx) => (
              <div key={idx} className="bg-green-500/10 rounded-lg p-3 border border-green-500/20">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-green-200 font-semibold text-sm">{dest.levelName}</span>
                  <span className="text-green-300 text-xs">Weight: {dest.weight}</span>
                </div>
                <p className="text-green-200/80 text-xs">{dest.method}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {exits?.toOutposts?.possibleOutposts && (
        <div className="bg-blue-900/30 rounded-xl p-4 border border-blue-500/30">
          <h3 className="text-blue-300 font-bold mb-3 flex items-center gap-2">
            <span>🏕️</span> Outpost Exits ({exits.toOutposts.chance}% chance)
          </h3>
          <div className="space-y-2">
            {exits.toOutposts.possibleOutposts.map((outpost, idx) => (
              <div key={idx} className="bg-blue-500/10 rounded-lg p-3 border border-blue-500/20">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-blue-200 font-semibold text-sm">{outpost.name}</span>
                  <span className="text-blue-300 text-xs">Weight: {outpost.weight}</span>
                </div>
                <p className="text-blue-200/80 text-xs">{outpost.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const LevelLoreTab = ({ level }) => {
  const lore = level.lore;
  const fears = level.fearFactors;
  
  return (
    <div className="space-y-4">
      <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
        <h3 className="text-white font-bold mb-2">Background</h3>
        <p className="text-gray-300 text-sm leading-relaxed">{lore.backgroundStory}</p>
      </div>

      <div className="bg-red-900/30 rounded-xl p-4 border border-red-500/30">
        <h3 className="text-red-300 font-bold mb-3 flex items-center gap-2">
          <span>😱</span> Fear Level: {fears.baseFearLevel}/5
        </h3>
        <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
          <div className="flex items-center gap-2">
            <span>{fears.isolationFactor ? '✓' : '✗'}</span>
            <span className={fears.isolationFactor ? 'text-red-200' : 'text-gray-500'}>Isolation</span>
          </div>
          <div className="flex items-center gap-2">
            <span>{fears.claustrophobiaFactor ? '✓' : '✗'}</span>
            <span className={fears.claustrophobiaFactor ? 'text-red-200' : 'text-gray-500'}>Claustrophobia</span>
          </div>
          <div className="flex items-center gap-2">
            <span>{fears.darknessFactor ? '✓' : '✗'}</span>
            <span className={fears.darknessFactor ? 'text-red-200' : 'text-gray-500'}>Darkness</span>
          </div>
        </div>
        {fears.fearTriggers && (
          <div className="space-y-1">
            <div className="text-red-200 text-xs font-semibold mb-1">Fear Triggers:</div>
            {fears.fearTriggers.map((trigger, idx) => (
              <div key={idx} className="text-red-200/80 text-xs flex items-start gap-2">
                <span className="text-red-400">•</span>
                <span>{trigger}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {lore.warnings && lore.warnings.length > 0 && (
        <div className="bg-amber-900/30 rounded-xl p-4 border border-amber-500/30">
          <h3 className="text-amber-300 font-bold mb-3 flex items-center gap-2">
            <span>⚠️</span> Warnings
          </h3>
          <div className="space-y-2">
            {lore.warnings.map((warning, idx) => (
              <div key={idx} className="bg-amber-500/10 rounded-lg p-2 border border-amber-500/20">
                <p className="text-amber-200 text-sm">{warning}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {lore.rumorsMentioned && lore.rumorsMentioned.length > 0 && (
        <div className="bg-purple-900/30 rounded-xl p-4 border border-purple-500/30">
          <h3 className="text-purple-300 font-bold mb-3 flex items-center gap-2">
            <span>💭</span> Rumors
          </h3>
          <div className="space-y-2">
            {lore.rumorsMentioned.map((rumor, idx) => (
              <div key={idx} className="text-purple-200 text-sm flex items-start gap-2">
                <span className="text-purple-400">•</span>
                <span>{rumor}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {lore.discoveryNotes && lore.discoveryNotes.length > 0 && (
        <div className="bg-cyan-900/30 rounded-xl p-4 border border-cyan-500/30">
          <h3 className="text-cyan-300 font-bold mb-3 flex items-center gap-2">
            <span>📝</span> Discoverable Notes
          </h3>
          <div className="space-y-2">
            {lore.discoveryNotes.map((note, idx) => (
              <div key={idx} className="text-cyan-200 text-sm flex items-start gap-2">
                <span className="text-cyan-400">{idx + 1}.</span>
                <span>{note}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ icon, label, value, color }) => {
  const colorClasses = {
    red: 'from-red-600/20 to-rose-600/20 border-red-500/30 text-red-300',
    purple: 'from-purple-600/20 to-violet-600/20 border-purple-500/30 text-purple-300',
    orange: 'from-orange-600/20 to-amber-600/20 border-orange-500/30 text-orange-300',
    blue: 'from-blue-600/20 to-cyan-600/20 border-blue-500/30 text-blue-300',
    yellow: 'from-yellow-600/20 to-amber-600/20 border-yellow-500/30 text-yellow-300',
    cyan: 'from-cyan-600/20 to-blue-600/20 border-cyan-500/30 text-cyan-300',
    gray: 'from-gray-600/20 to-slate-600/20 border-gray-500/30 text-gray-300'
  };

  return (
    <div className={`bg-gradient-to-r ${colorClasses[color]} rounded-xl p-3 border`}>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xl">{icon}</span>
        <span className="text-xs font-medium opacity-75">{label}</span>
      </div>
      <div className="font-bold capitalize">{value}</div>
    </div>
  );
};