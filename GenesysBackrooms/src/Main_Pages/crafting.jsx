import React, { useState, useEffect } from 'react';
import { collection, doc, onSnapshot, query, updateDoc, setDoc } from "firebase/firestore";
import db from '../Components/firebase';
import Craft from "../Components/crafts";
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

// Example craft data for upload
const craftData = [
  {
    "name": "Reinforced Leather Armor",
    "skill": "Leatherworking",
    "baseDifficulty": "2",
    "baseAttempts": "1",
    "craftTime": "4 hours",
    "components": "Cured Leather (3 pieces)/Leather Straps/Buckles",
    "dynamicMaterial": "Iron Studs/Quilted Fabric/Dye Kit + Pattern Stencils",
    "dynamicEffect": "Adds +1 additional Soak value, making the armor more protective against physical damage/Removes 1 Setback die from Athletics and Coordination checks, improving mobility/Adds 1 Boost die to Stealth checks while worn in appropriate environments",
    "difficultyModifier": "+1/+1/+1",
    "attemptsModifier": "0/0/0"
  },
  {
    "name": "Alchemical Fire Bomb",
    "skill": "Crafting",
    "baseDifficulty": "3",
    "baseAttempts": "3",
    "craftTime": "2 hours",
    "components": "Volatile Oil/Glass Vial (3x)/Fuse or Wick (3x)",
    "dynamicMaterial": "Tree Sap + Sulfur/Metal Shavings/Slow-Burn Cord",
    "dynamicEffect": "Burn quality increased from 1 to 3, causing prolonged fire damage/Adds Pierce 2 quality, allowing the bomb to ignore 2 points of soak/Removes the Prepare maneuver requirement, allowing immediate use",
    "difficultyModifier": "+1/+1/+1",
    "attemptsModifier": "0/0/0"
  },
  {
    "name": "Healing Poultice",
    "skill": "Crafting",
    "baseDifficulty": "2",
    "baseAttempts": "4",
    "craftTime": "1 hour",
    "components": "Medicinal Herbs/Binding Agent (cloth wraps)/Clean Water",
    "dynamicMaterial": "Alcohol + Rare Herb/Processed Root/Alchemical Catalyst",
    "dynamicEffect": "Heals 1 additional wound (total 4 wounds) when applied/Also removes 1 strain in addition to healing wounds/Can be applied as an incidental instead of requiring a maneuver",
    "difficultyModifier": "+1/+1/+1",
    "attemptsModifier": "0/0/0"
  },
  {
    "name": "Steel Longsword",
    "skill": "Metalworking",
    "baseDifficulty": "3",
    "baseAttempts": "1",
    "craftTime": "8 hours",
    "components": "Steel Ingots (3)/Leather Grip/Cross-guard/Pommel",
    "dynamicMaterial": "Silver Inlay/Damascus Pattern/Weighted Pommel",
    "dynamicEffect": "Weapon gains +1 damage against supernatural creatures/Adds Superior quality (can be sold for 150% value)/Adds Defensive 1 quality, providing better defensive capabilities",
    "difficultyModifier": "+1/+2/+1",
    "attemptsModifier": "0/0/0"
  },
  {
    "name": "Traveler's Backpack",
    "skill": "Leatherworking",
    "baseDifficulty": "1",
    "baseAttempts": "1",
    "craftTime": "3 hours",
    "components": "Leather (2 pieces)/Canvas Cloth/Buckles and Straps",
    "dynamicMaterial": "Reinforced Stitching/Waterproof Coating/Hidden Pockets",
    "dynamicEffect": "Increases Encumbrance capacity by +2/Items stored remain dry in rain or water/Provides +1 Boost to Streetwise checks to conceal items",
    "difficultyModifier": "+1/+1/+1",
    "attemptsModifier": "0/0/0"
  },
  {
    "name": "Poisoned Arrows",
    "skill": "Crafting",
    "baseDifficulty": "3",
    "baseAttempts": "6",
    "craftTime": "2 hours",
    "components": "Arrow Shafts (6)/Arrowheads (6)/Fletching (6)/Poison Extract",
    "dynamicMaterial": "Paralytic Toxin/Hallucinogenic Compound/Corrosive Acid",
    "dynamicEffect": "Target must make Hard Resilience check or become Immobilized for 2 rounds/Target suffers Disoriented status for 3 rounds on failed Average Resilience check/Arrows gain Pierce 2 and deal +2 ongoing damage per round for 3 rounds",
    "difficultyModifier": "+2/+1/+2",
    "attemptsModifier": "-2/-1/-2"
  },
  {
    "name": "Iron Chainmail",
    "skill": "Metalworking",
    "baseDifficulty": "4",
    "baseAttempts": "1",
    "craftTime": "16 hours",
    "components": "Iron Wire/Rivets/Leather Backing",
    "dynamicMaterial": "Steel Rings/Padded Underlayer/Reinforced Shoulders",
    "dynamicEffect": "Increases Soak by +1 (total +3)/Reduces strain cost of maneuvers by 1 while worn/Adds 1 point of Melee Defense",
    "difficultyModifier": "+1/+1/+2",
    "attemptsModifier": "0/0/0"
  },
  {
    "name": "Lock Picks",
    "skill": "Crafting",
    "baseDifficulty": "2",
    "baseAttempts": "1",
    "craftTime": "2 hours",
    "components": "Metal Wire/Small File/Tension Wrench",
    "dynamicMaterial": "Spring Steel/Magnetic Tips/Illuminated Tips",
    "dynamicEffect": "Adds 1 Boost die to Skullduggery checks when picking locks/Can sense internal lock mechanisms (reduce difficulty by 1)/Provides light source while picking locks in darkness",
    "difficultyModifier": "+1/+1/+1",
    "attemptsModifier": "0/0/0"
  },
  {
    "name": "Smoke Bombs",
    "skill": "Crafting",
    "baseDifficulty": "2",
    "baseAttempts": "5",
    "craftTime": "1.5 hours",
    "components": "Potassium Nitrate/Sugar/Baking Soda/Glass Vials (5)",
    "dynamicMaterial": "Colored Dye/Flash Powder/Tear Gas Agent",
    "dynamicEffect": "Smoke is colored for signaling purposes/Creates brief flash of light (upgrade difficulty of attacks in area once)/Causes Disoriented status to anyone in the smoke cloud",
    "difficultyModifier": "+0/+1/+2",
    "attemptsModifier": "0/0/-2"
  },
  {
    "name": "Climbing Spikes",
    "skill": "Metalworking",
    "baseDifficulty": "2",
    "baseAttempts": "2",
    "craftTime": "3 hours",
    "components": "Steel Rods/Leather Straps/Buckles",
    "dynamicMaterial": "Serrated Edges/Collapsible Design/Quick-Release Mechanism",
    "dynamicEffect": "Can be used as improvised weapons (Damage 4, Crit 3)/Reduces encumbrance by 1 when not in use/Can be attached or removed as incidental instead of maneuver",
    "difficultyModifier": "+1/+1/+1",
    "attemptsModifier": "0/0/0"
  }
];

export default function Crafting() {
  const [crafts, setCrafts] = useState([]);
  const [difficulty, setDifficulty] = useState('None');
  const [skill, setSkill] = useState('None');
  const [name, setName] = useState('');
  const [showHiddenOnly, setShowHiddenOnly] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const [activeCraft, setActiveCraft] = useState(null);
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

    // Get ALL crafts from the database
    const q = query(collection(db, 'Crafts'));

    const unsub = onSnapshot(q, (querySnapshot) => {
      const queryData = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const sessionVisibility = data.sessionVisibility || {};
        
        // Add craft with its visibility status for this session
        queryData.push({ 
          docId: doc.id, 
          ...data,
          hiddenInCurrentSession: sessionVisibility[sessionId] === false
        });
      });
      
      // Sort by name in memory
      queryData.sort((a, b) => a.name.localeCompare(b.name));
      
      setCrafts(queryData);
      setLoading(false);
    }, (error) => {
      console.error('Error loading crafts:', error);
      showToast('Error loading crafts', 'error');
      setLoading(false);
    });

    return () => { unsub(); };
  };

  const uploadCraftData = async () => {
    if (!userIsDM) {
      showToast('Only DMs can upload craft data', 'error');
      return;
    }

    const confirmUpload = window.confirm(
      `This will add ${craftData.length} crafts to the global database (visible to all sessions by default). Continue?`
    );

    if (!confirmUpload) return;

    try {
      for (let i = 0; i < craftData.length; i++) {
        const craftItem = {
          name: craftData[i].name,
          skill: craftData[i].skill,
          baseDifficulty: craftData[i].baseDifficulty,
          baseAttempts: craftData[i].baseAttempts,
          craftTime: craftData[i].craftTime,
          components: craftData[i].components,
          sessionVisibility: {} // Empty object - visible to all sessions by default
        };

        // Add optional fields if they exist
        if (craftData[i].dynamicMaterial && craftData[i].dynamicMaterial !== 'None') {
          craftItem.dynamicMaterial = craftData[i].dynamicMaterial;
        }
        if (craftData[i].dynamicEffect) {
          craftItem.dynamicEffect = craftData[i].dynamicEffect;
        }
        if (craftData[i].difficultyModifier) {
          craftItem.difficultyModifier = craftData[i].difficultyModifier;
        }
        if (craftData[i].attemptsModifier) {
          craftItem.attemptsModifier = craftData[i].attemptsModifier;
        }

        // Use just the craft name as document ID (no session prefix)
        await setDoc(doc(db, 'Crafts', craftData[i].name), craftItem);
      }
      
      showToast(`Successfully added ${craftData.length} crafts!`, 'success');
    } catch (error) {
      showToast('Error uploading craft data', 'error');
      console.error('Upload error:', error);
    }
  };

  const getFilteredCrafts = () => {
    return crafts.filter((item) => {
      // For DMs: can see everything, filter by showHiddenOnly toggle
      // For Players: only see crafts that are NOT hidden in this session
      const visibilityCheck = userIsDM ? true : !item.hiddenInCurrentSession;
      const hiddenFilterCheck = showHiddenOnly ? item.hiddenInCurrentSession : true;
      
      return (
        visibilityCheck &&
        hiddenFilterCheck &&
        (item.baseDifficulty === difficulty || difficulty === 'None') &&
        (item.skill === skill || skill === 'None') &&
        (item.name.toUpperCase().includes(name.toUpperCase()) || name === '')
      );
    });
  };

  const toggleCraftVisibility = async (craft) => {
    if (!userIsDM || !sessionId) return;
    
    try {
      const currentSessionVisibility = craft.sessionVisibility || {};
      const newVisibility = {
        ...currentSessionVisibility,
        [sessionId]: currentSessionVisibility[sessionId] === false ? true : false
      };

      await updateDoc(doc(db, 'Crafts', craft.docId), {
        sessionVisibility: newVisibility
      });
      
      const action = newVisibility[sessionId] === false ? 'hidden' : 'revealed';
      showToast(`${craft.name} ${action} for this session`, 'success');
    } catch (error) {
      console.error('Error toggling visibility:', error);
      showToast('Error updating craft visibility', 'error');
    }
  };

  const clearAllFilters = () => {
    setName('');
    setDifficulty('None');
    setSkill('None');
    setShowHiddenOnly(false);
    showToast('All filters cleared');
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (name !== '') count++;
    if (difficulty !== 'None') count++;
    if (skill !== 'None') count++;
    if (showHiddenOnly) count++;
    return count;
  };

  const getDifficultyLabel = (diff) => {
    const labels = {
      '1': 'Simple (◆)',
      '2': 'Easy (◆◆)',
      '3': 'Average (◆◆◆)',
      '4': 'Hard (◆◆◆◆)',
      '5': 'Daunting (◆◆◆◆◆)',
    };
    return labels[diff] || diff;
  };

  if (localStorage.getItem("loggedIn") === 'false') {
    return <NotLoggedIn />;
  }

  const FilterChip = ({ label, onDelete }) => (
    <div className="inline-flex items-center space-x-2 bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full text-sm border border-amber-500/30">
      <span>{label}</span>
      <button onClick={onDelete} className="text-amber-400 hover:text-amber-200 transition-colors">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
        </svg>
      </button>
    </div>
  );

  const DisplayItems = () => {
    const filteredCrafts = getFilteredCrafts();

    if (filteredCrafts.length === 0) {
      return (
        <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-12 text-center">
          <svg className="w-16 h-16 text-gray-500 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"></path>
          </svg>
          <h3 className="text-xl font-semibold text-white mb-2">No crafts found</h3>
          <p className="text-gray-400 mb-4">Try adjusting your search criteria to find more crafting recipes</p>
          {getActiveFilterCount() > 0 && (
            <button
              onClick={clearAllFilters}
              className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Clear All Filters
            </button>
          )}
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Results Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <svg className="w-6 h-6 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path>
            </svg>
            <h2 className="text-xl font-bold text-white">
              Found {filteredCrafts.length} recipe{filteredCrafts.length !== 1 ? 's' : ''}
            </h2>
          </div>
          <span className="bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full text-sm font-bold">
            {crafts.length} total
          </span>
        </div>

        {/* Crafts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredCrafts.map((item) => (
            <div key={item.docId} className="bg-black/20 backdrop-blur-lg rounded-xl border border-white/10 p-1 hover:bg-black/30 transition-all duration-300">
              <Craft 
                currCraft={item} 
                onShowMaterials={setActiveCraft}
                onToggleVisibility={toggleCraftVisibility}
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
      {/* Filter Controls Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Base Difficulty</label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
          >
            <option value="None" className="bg-gray-800">Any Difficulty</option>
            <option value="1" className="bg-gray-800">Simple (◆)</option>
            <option value="2" className="bg-gray-800">Easy (◆◆)</option>
            <option value="3" className="bg-gray-800">Average (◆◆◆)</option>
            <option value="4" className="bg-gray-800">Hard (◆◆◆◆)</option>
            <option value="5" className="bg-gray-800">Daunting (◆◆◆◆◆)</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Crafting Skill</label>
          <select
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
            className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
          >
            <option value="None" className="bg-gray-800">Any Skill</option>
            <option value="Metalworking" className="bg-gray-800">⚒️ Metalworking</option>
            <option value="Leatherworking" className="bg-gray-800">🧵 Leatherworking</option>
            <option value="Crafting" className="bg-gray-800">🔨 Crafting</option>
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

      {/* Active Filters */}
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
            {difficulty !== 'None' && <FilterChip label={`Difficulty: ${getDifficultyLabel(difficulty)}`} onDelete={() => setDifficulty('None')} />}
            {skill !== 'None' && <FilterChip label={`Skill: ${skill}`} onDelete={() => setSkill('None')} />}
            {showHiddenOnly && <FilterChip label="Hidden Only" onDelete={() => setShowHiddenOnly(false)} />}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-amber-900 to-orange-900">
      <div className="w-full px-4 py-6 space-y-6">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-900/50 to-orange-900/50 backdrop-blur-lg rounded-2xl border border-white/10 p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
                <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"></path>
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Crafting Workshop</h1>
                <p className="text-amber-300">Browse all crafting recipes and create amazing items</p>
              </div>
            </div>
            
            {userIsDM && (
              <button 
                onClick={uploadCraftData}
                className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"></path>
                </svg>
                <span>Upload Sample Crafts</span>
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-12">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-400 mb-4"></div>
              <h3 className="text-xl font-semibold text-white mb-2">Loading crafting recipes...</h3>
              <p className="text-gray-400">Please wait while we fetch the data</p>
            </div>
          </div>
        ) : crafts.length > 0 ? (
          <>
            {/* Search and Filter Section */}
            <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 overflow-hidden">
              <div className="bg-gradient-to-r from-amber-600/20 to-orange-600/20 p-4 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <svg className="w-6 h-6 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3 7v10a2 2 0 002 2h14l-2-2H5V7h14V5a2 2 0 00-2-2H5a2 2 0 00-2 2v2z"></path>
                      <path d="M21 7H3v2h18V7z"></path>
                    </svg>
                    <h2 className="text-xl font-bold text-white">Search & Filter</h2>
                    {getActiveFilterCount() > 0 && (
                      <span className="bg-amber-500/30 text-amber-300 px-2 py-1 rounded-full text-xs font-bold">
                        {getActiveFilterCount()} active
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full text-sm font-bold">
                      {getFilteredCrafts().length} shown
                    </span>
                    <button 
                      onClick={() => setFiltersOpen(!filtersOpen)}
                      className="md:hidden bg-amber-600/20 hover:bg-amber-600/30 text-amber-400 p-2 rounded-lg transition-colors"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Search Bar - Always Visible */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search crafting recipes by name..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white/5 border border-white/20 rounded-xl pl-12 pr-12 py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all text-lg"
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

                {/* Advanced Filters - Collapsible on Mobile */}
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

            {/* Results */}
            <DisplayItems />
          </>
        ) : (
          <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-12">
            <div className="flex flex-col items-center justify-center text-center">
              <svg className="w-16 h-16 text-gray-500 mb-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path>
              </svg>
              <h3 className="text-xl font-semibold text-white mb-2">No crafting recipes available</h3>
              <p className="text-gray-400">Upload some crafts to get started</p>
            </div>
          </div>
        )}

        {/* Mobile Filter Fab */}
        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          className="md:hidden fixed bottom-6 right-6 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 transform hover:scale-110"
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

      {/* Toast Notification */}
      <Toast 
        message={toast.message}
        severity={toast.severity} 
        isOpen={toast.open} 
        onClose={hideToast} 
      />

      {/* Material Details Modal */}
      {activeCraft && <CraftDetailsModal craft={activeCraft} onClose={() => setActiveCraft(null)} />}
    </div>
  );
}

// Mobile-Friendly Modal Component with Tabs - EXACT MATCH TO ITEMSETS
const CraftDetailsModal = ({ craft, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const materials = craft.dynamicMaterial ? craft.dynamicMaterial.split('/') : [];
  const difficulties = craft.difficultyModifier ? craft.difficultyModifier.split('/') : [];
  const attempts = craft.attemptsModifier ? craft.attemptsModifier.split('/') : [];
  const effects = craft.dynamicEffect ? craft.dynamicEffect.split('/') : [];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="h-full w-full flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 md:m-4 md:rounded-2xl md:border-2 md:border-white/20 md:h-auto md:max-h-[90vh] md:max-w-4xl md:mx-auto overflow-hidden">
        
        {/* Compact Header */}
        <div className="flex-shrink-0 bg-gradient-to-r from-amber-600/20 to-orange-600/20 border-b border-white/10">
          {/* Top Bar */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center text-2xl border border-white/30 shadow-lg">
                <span>🔨</span>
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg md:text-xl font-bold text-white truncate">{craft.name}</h2>
                <p className="text-amber-300 text-sm">Crafting Details</p>
              </div>
            </div>
            
            {/* Close Button */}
            <button
              onClick={onClose}
              className="flex-shrink-0 p-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg border border-red-500/50 transition-all ml-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
              </svg>
            </button>
          </div>

          {/* Tabs - Horizontal Scroll on Mobile */}
          <div className="overflow-x-auto hide-scrollbar">
            <div className="flex gap-2 p-3 min-w-max">
              <MobileTabButton
                active={activeTab === 'overview'}
                onClick={() => setActiveTab('overview')}
                icon="📋"
                label="Overview"
              />
              <MobileTabButton
                active={activeTab === 'enhancements'}
                onClick={() => setActiveTab('enhancements')}
                icon="✨"
                label="Enhancements"
                count={materials.length}
              />
            </div>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'overview' && (
            <CraftOverviewTab craft={craft} />
          )}
          {activeTab === 'enhancements' && (
            <CraftEnhancementsTab 
              materials={materials}
              difficulties={difficulties}
              attempts={attempts}
              effects={effects}
            />
          )}
        </div>
      </div>
    </div>
  );
};

// Mobile Tab Button Component
const MobileTabButton = ({ active, onClick, icon, label, count }) => (
  <button
    onClick={onClick}
    className={`flex-shrink-0 px-4 py-2 rounded-lg font-medium text-sm transition-all whitespace-nowrap ${
      active
        ? 'bg-amber-500/30 text-amber-300 border-2 border-amber-500/50'
        : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
    }`}
  >
    <span className="mr-1">{icon}</span>
    {label}
    {count !== undefined && (
      <span className={`ml-1.5 px-1.5 py-0.5 rounded text-xs ${active ? 'bg-amber-500/40' : 'bg-white/10'}`}>
        {count}
      </span>
    )}
  </button>
);

// Craft Overview Tab
const CraftOverviewTab = ({ craft }) => {
  const getDifficultyLabel = (diff) => {
    const labels = {
      '1': 'Simple (◆)',
      '2': 'Easy (◆◆)',
      '3': 'Average (◆◆◆)',
      '4': 'Hard (◆◆◆◆)',
      '5': 'Daunting (◆◆◆◆◆)',
    };
    return labels[diff] || diff;
  };

  const getSkillIcon = (skill) => {
    const icons = {
      'Metalworking': '⚒️',
      'Leatherworking': '🧵',
      'Crafting': '🔨'
    };
    return icons[skill] || '🔧';
  };

  return (
    <div className="space-y-4">
      {/* Basic Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-purple-400 text-xl">📊</span>
            <h3 className="text-white font-bold text-sm">Difficulty</h3>
          </div>
          <p className="text-purple-300 text-sm font-medium">{getDifficultyLabel(craft.baseDifficulty)}</p>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-blue-400 text-xl">{getSkillIcon(craft.skill)}</span>
            <h3 className="text-white font-bold text-sm">Skill</h3>
          </div>
          <p className="text-blue-300 text-sm font-medium">{craft.skill}</p>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-amber-400 text-xl">🎯</span>
            <h3 className="text-white font-bold text-sm">Attempts</h3>
          </div>
          <p className="text-amber-300 text-sm font-medium">{craft.baseAttempts}</p>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-green-400 text-xl">⏱️</span>
            <h3 className="text-white font-bold text-sm">Time</h3>
          </div>
          <p className="text-green-300 text-sm font-medium">{craft.craftTime}</p>
        </div>
      </div>

      {/* Components */}
      <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-cyan-400 text-xl">📦</span>
          <h3 className="text-white font-bold">Required Components</h3>
        </div>
        <div className="space-y-2">
          {craft.components.split('/').map((component, idx) => (
            <div
              key={idx}
              className="bg-gradient-to-r from-cyan-900/20 to-blue-900/20 border border-cyan-500/30 rounded-lg p-3 flex items-center gap-3"
            >
              <div className="w-6 h-6 bg-cyan-500/30 rounded-full flex items-center justify-center text-cyan-400 text-xs font-bold border border-cyan-500/50 flex-shrink-0">
                {idx + 1}
              </div>
              <span className="text-white text-sm font-medium">{component.trim()}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-gradient-to-r from-amber-900/30 to-yellow-900/30 rounded-xl p-3 border border-amber-500/30">
        <p className="text-amber-200 text-xs leading-relaxed">
          <strong>💡 Tip:</strong> Check the Enhancements tab to see optional materials that can improve this craft's properties!
        </p>
      </div>
    </div>
  );
};

// Craft Enhancements Tab
const CraftEnhancementsTab = ({ materials, difficulties, attempts, effects }) => {
  if (materials.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-center">
        <div className="w-20 h-20 bg-gray-700/30 rounded-2xl flex items-center justify-center mb-4">
          <span className="text-4xl">📦</span>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">No Enhancements</h3>
        <p className="text-gray-400">This craft has no material enhancements available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Info Banner */}
      <div className="bg-gradient-to-r from-purple-900/30 to-violet-900/30 rounded-xl p-3 border border-purple-500/30">
        <p className="text-purple-200 text-xs leading-relaxed">
          <strong>✨ Enhancement Materials:</strong> Add these optional materials to enhance the crafted item's properties. Each enhancement may modify difficulty and attempts.
        </p>
      </div>

      {/* Enhancements List */}
      <div className="space-y-3">
        {materials.map((mat, idx) => (
          <div
            key={idx}
            className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-900/20 to-orange-900/20 p-3 border-b border-white/10">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div className="w-8 h-8 bg-gradient-to-br from-amber-500/30 to-orange-500/30 rounded-full flex items-center justify-center text-amber-400 text-sm font-bold border border-amber-500/50 flex-shrink-0">
                    {idx + 1}
                  </div>
                  <h3 className="text-white font-bold text-sm break-words">{mat}</h3>
                </div>
                
                {/* Stats Badges */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="px-2 py-1 bg-purple-500/30 text-purple-300 rounded text-xs font-bold border border-purple-500/50 whitespace-nowrap">
                    📊 {difficulties[idx]}
                  </span>
                  <span className="px-2 py-1 bg-amber-500/30 text-amber-300 rounded text-xs font-bold border border-amber-500/50 whitespace-nowrap">
                    🎯 {attempts[idx]}
                  </span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-3">
              <div className="bg-gradient-to-r from-blue-900/30 to-cyan-900/30 rounded-lg p-3 border border-blue-500/30">
                <div className="text-xs font-bold text-blue-300 mb-1">ENHANCEMENT EFFECT</div>
                <p className="text-blue-200 text-sm leading-relaxed">{effects[idx] || 'No special effects.'}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};