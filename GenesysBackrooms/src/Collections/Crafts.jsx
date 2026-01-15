import { collection, doc, onSnapshot, query, setDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from 'react';
import CraftModal from '../Modals/CraftModal';
import db from '../Structural/Firebase';
import NotLoggedIn from "../Structural/Not_Logged_In";
import { getActiveSession, isDM, requireSession } from '../Structural/Session_Utils';
import Craft from "../Sub_Components/Craft";

import data from '../Data/CraftData';

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

export default function Crafts() {
  const [recipes, setRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSkill, setFilterSkill] = useState('-1');
  const [filterDifficulty, setFilterDifficulty] = useState('-1');
  const [filterWorkshop, setFilterWorkshop] = useState('-1');
  const [showHiddenOnly, setShowHiddenOnly] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const [detailsModal, setDetailsModal] = useState({ isOpen: false, recipeData: null });
  const sessionId = getActiveSession();
  const userIsDM = isDM();

  const showToast = (message, severity = 'success') => {
    setToast({ open: true, message, severity });
  };

  const hideToast = () => {
    setToast({ ...toast, open: false });
  };

  const addData = async () => {
    if (!userIsDM) {
      showToast('Only DMs can upload crafting data', 'error');
      return;
    }
  
    const confirmUpload = window.confirm(
      `This will add ${data.length} ${data.length === 1 ? 'recipe' : 'recipes'} to the global database (hidden by default in this session). Continue?`
    );
  
    if (!confirmUpload) return;
  
    try {
      for (let i = 0; i < data.length; i++) {
        const recipeData = {
          ...data[i],
          sessionVisibility: {[getActiveSession()]: 'hidden'}
        };
      
        await setDoc(doc(db, 'Crafting', data[i].id), recipeData);
      }
      showToast(`Successfully added ${data.length} ${data.length === 1 ? 'recipe' : 'recipes'}!`);
    } catch (error) {
      showToast('Error adding crafting data', 'error');
      console.error(error);
    }
  };

  const addTempData = () => {
    const data = [
  {
    "name": "Clever Retort",
    "ranked": false,
    "tier": 1,
    "activation": "Incidental (Out of Turn)",
    "effect": "Once per encounter, add 2 automatic advantage to another character’s social skill check.",
    "requirements": null
  },
  {
    "name": "Desperate Recovery",
    "ranked": false,
    "tier": 1,
    "activation": "Passive",
    "effect": "Before healing strain at the end of an encounter, if strain exceeds half your strain threshold, heal 2 additional strain.",
    "requirements": null
  },
  {
    "name": "Duelist",
    "ranked": false,
    "tier": 1,
    "activation": "Passive",
    "effect": "Add 1 boost to melee checks when engaged with a single opponent. Add 1 setback to melee checks when engaged with three or more opponents.",
    "requirements": null
  },
  {
    "name": "Durable",
    "ranked": true,
    "tier": 1,
    "activation": "Passive",
    "effect": "Reduce Critical Injury results suffered by 10 per rank (minimum 01).",
    "requirements": null
  },
  {
    "name": "Forager",
    "ranked": false,
    "tier": 1,
    "activation": "Passive",
    "effect": "Remove up to 2 setback from checks to find food, water, or shelter. Such checks take half the normal time.",
    "requirements": null
  },
  {
    "name": "Grit",
    "ranked": true,
    "tier": 1,
    "activation": "Passive",
    "effect": "Increase strain threshold by 1 per rank.",
    "requirements": null
  },
  {
    "name": "Hamstring Shot",
    "ranked": false,
    "tier": 1,
    "activation": "Action",
    "effect": "Once per round, make a ranged attack against a non-vehicle target. If successful, halve the damage before soak; target is immobilized until end of its next turn.",
    "requirements": null
  },
  {
    "name": "Jump Up",
    "ranked": false,
    "tier": 1,
    "activation": "Incidental",
    "effect": "Once per round, stand from prone or seated as an incidental.",
    "requirements": null
  },
  {
    "name": "Knack for It",
    "ranked": true,
    "tier": 1,
    "activation": "Passive",
    "effect": "Choose one skill; remove 2 setback from checks using that skill. Each additional purchase selects two more skills. Cannot choose combat or magic skills.",
    "requirements": null
  },
  {
    "name": "One With Nature",
    "ranked": false,
    "tier": 1,
    "activation": "Incidental",
    "effect": "When in the wilderness, make a Simple (–) Survival check instead of Discipline or Cool to recover strain at the end of an encounter.",
    "requirements": null
  },
  {
    "name": "Parry",
    "ranked": true,
    "tier": 1,
    "activation": "Incidental (Out of Turn)",
    "effect": "When hit by a melee attack, suffer 3 strain to reduce damage by 2 plus ranks in Parry. Must be wielding a Melee weapon. Once per hit.",
    "requirements": null
  },
  {
    "name": "Proper Upbringing",
    "ranked": true,
    "tier": 1,
    "activation": "Incidental",
    "effect": "When making a social skill check in polite company, suffer strain up to ranks in Proper Upbringing to add an equal number of boost dice.",
    "requirements": null
  },
  {
    "name": "Quick Draw",
    "ranked": false,
    "tier": 1,
    "activation": "Incidental",
    "effect": "Once per round, draw or holster an easily accessible weapon or item as an incidental. Reduces a weapon’s Prepare rating by 1 (minimum 1).",
    "requirements": null
  },
  {
    "name": "Quick Strike",
    "ranked": true,
    "tier": 1,
    "activation": "Passive",
    "effect": "Add 1 boost per rank of Quick Strike to combat checks against targets that have not yet acted in the encounter.",
    "requirements": null
  },
  {
    "name": "Rapid Reaction",
    "ranked": true,
    "tier": 1,
    "activation": "Incidental (Out of Turn)",
    "effect": "Suffer strain up to ranks in Rapid Reaction to add an equal number of successes to a Vigilance or Cool check for initiative.",
    "requirements": null
  },
  {
    "name": "Second Wind",
    "ranked": true,
    "tier": 1,
    "activation": "Incidental",
    "effect": "Once per encounter, heal strain equal to ranks in Second Wind.",
    "requirements": null
  },
  {
    "name": "Surgeon",
    "ranked": true,
    "tier": 1,
    "activation": "Passive",
    "effect": "When making a Medicine check to heal wounds, heal 1 additional wound per rank of Surgeon.",
    "requirements": null
  },
  {
    "name": "Swift",
    "ranked": false,
    "tier": 1,
    "activation": "Passive",
    "effect": "Ignore penalties for moving through difficult terrain.",
    "requirements": null
  },
  {
    "name": "Toughened",
    "ranked": true,
    "tier": 1,
    "activation": "Passive",
    "effect": "Increase wound threshold by 2 per rank.",
    "requirements": null
  },
  {
    "name": "Unremarkable",
    "ranked": false,
    "tier": 1,
    "activation": "Passive",
    "effect": "Other characters add 1 setback to checks made to find or identify your character in a crowd.",
    "requirements": null
  },

  /* --- TIER 2 STARTS HERE --- */

  {
    "name": "Basic Military Training",
    "ranked": false,
    "tier": 2,
    "activation": "Passive",
    "effect": "Athletics, Ranged, and Resilience become career skills.",
    "requirements": null
  },
  {
    "name": "Berserk",
    "ranked": false,
    "tier": 2,
    "activation": "Maneuver",
    "effect": "Once per encounter, add 2 boost to all melee checks until incapacitated or encounter ends. Opponents add 1 boost to attacks targeting you. Cannot make ranged attacks. Suffer 6 strain when effect ends.",
    "requirements": null
  },
  {
    "name": "Coordinated Assault",
    "ranked": true,
    "tier": 2,
    "activation": "Maneuver",
    "effect": "Once per turn, a number of allies up to ranks in Leadership that are engaged with you add 1 boost to combat checks until your next turn. Range increases by 1 band per additional rank.",
    "requirements": null
  },
  {
    "name": "Counteroffer",
    "ranked": false,
    "tier": 2,
    "activation": "Action",
    "effect": "Once per session, make an opposed Negotiation vs Discipline check against a non-nemesis within medium range. On success, target is staggered until end of next turn. May spend advantage to make them an ally temporarily.",
    "requirements": null
  },
  {
    "name": "Defensive Stance",
    "ranked": true,
    "tier": 2,
    "activation": "Maneuver",
    "effect": "Once per round, suffer strain up to ranks in Defensive Stance to upgrade difficulty of all melee attacks targeting you an equal number of times until your next turn.",
    "requirements": null
  },
  {
    "name": "Inventor",
    "ranked": true,
    "tier": 2,
    "activation": "Incidental",
    "effect": "When constructing or modifying items, add advantage equal to ranks in Inventor. May attempt to reconstruct devices based only on descriptions.",
    "requirements": null
  },
  {
    "name": "Dual Wielder",
    "ranked": false,
    "tier": 2,
    "activation": "Maneuver",
    "effect": "Decrease the difficulty of the next combined combat check made this turn by 1.",
    "requirements": null
  },
  {
    "name": "Fan the Hammer",
    "ranked": false,
    "tier": 2,
    "activation": "Incidental",
    "effect": "Once per encounter, before making a combat check with a pistol, add the Auto-fire quality. The weapon then runs out of ammo as if an Out of Ammo result occurred.",
    "requirements": null
  },
  {
    "name": "Heightened Awareness",
    "ranked": false,
    "tier": 2,
    "activation": "Passive",
    "effect": "Allies within short range add 1 boost to Perception and Vigilance checks. Allies engaged with you add 2 boost instead.",
    "requirements": null
  },
  {
    "name": "Inspiring Rhetoric",
    "ranked": false,
    "tier": 2,
    "activation": "Action",
    "effect": "Make an Average Leadership check. For each success, one ally within short range heals 1 strain. For each advantage, one affected ally heals 1 additional strain.",
    "requirements": null
  },
  {
    "name": "Lucky Strike",
    "ranked": false,
    "tier": 2,
    "activation": "Incidental",
    "effect": "Choose one characteristic when purchasing this talent. After a successful combat check, spend a Story Point to add damage equal to ranks in that characteristic to one hit.",
    "requirements": null
  },
  {
    "name": "Scathing Tirade",
    "ranked": false,
    "tier": 2,
    "activation": "Action",
    "effect": "Make an Average Coercion check. For each success, one enemy within short range suffers 1 strain. For each advantage, one affected enemy suffers 1 additional strain.",
    "requirements": null
  },
  {
    "name": "Side Step",
    "ranked": true,
    "tier": 2,
    "activation": "Action",
    "effect": "Once per round, suffer strain up to ranks in Side Step to upgrade the difficulty of all ranged attacks targeting you an equal number of times until your next turn.",
    "requirements": null
  },

  /* --- TIER 3 STARTS HERE --- */

  {
    "name": "Animal Companion",
    "ranked": true,
    "tier": 3,
    "activation": "Passive",
    "effect": "Gain a bonded silhouette 0 animal companion. Once per round, spend a maneuver to direct it to perform one action and one maneuver. Additional ranks increase allowed silhouette by 1.",
    "requirements": null
  },
  {
    "name": "Dodge",
    "ranked": true,
    "tier": 3,
    "activation": "Incidental (Out of Turn)",
    "effect": "When targeted by a combat check, suffer strain up to ranks in Dodge to upgrade the difficulty of the attack an equal number of times.",
    "requirements": null
  },
  {
    "name": "Forgot to Count?",
    "ranked": false,
    "tier": 3,
    "activation": "Incidental (Out of Turn)",
    "effect": "When an opponent makes a ranged combat check, spend 2 threats from that check to cause their weapon to run out of ammo, if applicable.",
    "requirements": null
  },
  {
    "name": "Eagle Eyes",
    "ranked": false,
    "tier": 3,
    "activation": "Incidental",
    "effect": "Once per encounter before making a ranged combat check, increase the weapon’s range by one band (max extreme) for that check.",
    "requirements": null
  },
  {
    "name": "Field Commander",
    "ranked": false,
    "tier": 3,
    "activation": "Action",
    "effect": "Make an Average Leadership check. On success, a number of allies equal to Presence may suffer 1 strain to perform one maneuver out of turn.",
    "requirements": null
  },
  {
    "name": "Grenadier",
    "ranked": false,
    "tier": 3,
    "activation": "Incidental",
    "effect": "When making a ranged attack with a Blast weapon, spend a Story Point to trigger Blast instead of spending advantage, even on a miss. Grenades count as medium range.",
    "requirements": null
  },
  {
    "name": "Inspiring Rhetoric (Improved)",
    "ranked": false,
    "tier": 3,
    "activation": "Passive",
    "effect": "Allies affected by Inspiring Rhetoric add 1 boost to all skill checks for rounds equal to ranks in Leadership.",
    "requirements": "Inspiring Rhetoric"
  },
  {
    "name": "Painkiller Specialization",
    "ranked": true,
    "tier": 3,
    "activation": "Passive",
    "effect": "When using painkillers, the target heals 1 additional wound per rank. The sixth painkiller and beyond each day still has no effect.",
    "requirements": null
  },
  {
    "name": "Scathing Tirade (Improved)",
    "ranked": false,
    "tier": 3,
    "activation": "Passive",
    "effect": "Enemies affected by Scathing Tirade add 1 setback to all skill checks for rounds equal to ranks in Coercion.",
    "requirements": "Scathing Tirade"
  },
  {
    "name": "Heroic Will",
    "ranked": false,
    "tier": 3,
    "activation": "Incidental (Out of Turn)",
    "effect": "Choose two characteristics when purchasing this talent. Spend a Story Point to ignore Critical Injury effects on checks using those characteristics for the encounter.",
    "requirements": null
  },
  {
    "name": "Natural",
    "ranked": false,
    "tier": 3,
    "activation": "Incidental",
    "effect": "Choose two skills when purchasing this talent. Once per session, reroll one check using one of those skills.",
    "requirements": null
  },
  {
    "name": "Rapid Archery",
    "ranked": false,
    "tier": 3,
    "activation": "Maneuver",
    "effect": "While armed with a bow (or similar weapon), suffer 2 strain to give the bow Linked equal to ranks in the Ranged skill for the next ranged combat check this turn.",
    "requirements": null
  },
  {
    "name": "Parry (Improved)",
    "ranked": false,
    "tier": 3,
    "activation": "Incidental (Out of Turn)",
    "effect": "After using Parry to reduce damage from a melee hit, spend 3 threat or 1 despair from the attacker’s roll to automatically hit them once with a wielded Brawl or Melee weapon for base damage plus modifiers. Cannot be used if incapacitated by the attack.",
    "requirements": "Parry"
  },


  {
    "name": "Can't We Talk About This?",
    "ranked": false,
    "tier": 4,
    "activation": "Action",
    "effect": "Make an opposed Charm or Deception vs Discipline check targeting a non-nemesis within medium range. On success, the target cannot attack or take hostile actions against you until the end of their next turn. Spend 2 advantage to extend duration by one turn; spend 1 triumph to extend effect to all identified allies within short range. Effect ends if you or an ally attacks the target.",
    "requirements": null
  },
  {
    "name": "Deadeye",
    "ranked": false,
    "tier": 4,
    "activation": "Incidental",
    "effect": "After inflicting a Critical Injury with a ranged weapon and rolling the result, suffer 2 strain to choose any Critical Injury of the same severity instead.",
    "requirements": null
  },
  {
    "name": "Defensive",
    "ranked": true,
    "tier": 4,
    "activation": "Passive",
    "effect": "Increase melee and ranged defense by 1 per rank.",
    "requirements": null
  },
  {
    "name": "Enduring",
    "ranked": true,
    "tier": 4,
    "activation": "Passive",
    "effect": "Increase soak by 1 per rank.",
    "requirements": null
  },
  {
    "name": "Field Commander (Improved)",
    "ranked": false,
    "tier": 4,
    "activation": "Passive",
    "effect": "When using Field Commander, it affects up to 2 times your presence allies. May spend advantage to allow one ally to suffer 1 strain to perform an action instead of a maneuver.",
    "requirements": "Field Commander"
  },
  {
    "name": "How Convenient!",
    "ranked": false,
    "tier": 4,
    "activation": "Action",
    "effect": "Once per session, make a Hard Mechanics check. On success, one device involved in the encounter spontaneously fails, either due to your actions or convenient timing.",
    "requirements": null
  },
  {
    "name": "Inspiring Rhetoric (Supreme)",
    "ranked": false,
    "tier": 4,
    "activation": "Incidental",
    "effect": "Suffer 1 strain to use Inspiring Rhetoric as a maneuver instead of an action.",
    "requirements": "Inspiring Rhetoric"
  },
  {
    "name": "Overcharge",
    "ranked": false,
    "tier": 4,
    "activation": "Action",
    "effect": "Once per encounter, make a Hard Mechanics check and choose one cybernetic implant that grants +1 to a characteristic, skill, or ranked talent. On success, the implant provides +2 instead (up to characteristic 7, skill 5). GM may spend 3 threat or 1 despair to cause the implant to short out after the encounter.",
    "requirements": null
  },
  {
    "name": "Scathing Tirade (Supreme)",
    "ranked": false,
    "tier": 4,
    "activation": "Incidental",
    "effect": "Suffer 1 strain to use Scathing Tirade as a maneuver instead of an action.",
    "requirements": "Scathing Tirade"
  },

  /* --- TIER 5 STARTS HERE --- */

  {
    "name": "Dedication",
    "ranked": true,
    "tier": 5,
    "activation": "Passive",
    "effect": "Increase one characteristic by 1, up to a maximum of 5. Cannot increase the same characteristic twice.",
    "requirements": null
  },
  {
    "name": "Indomitable",
    "ranked": false,
    "tier": 5,
    "activation": "Incidental (Out of Turn)",
    "effect": "Once per encounter, when you would be incapacitated by exceeding wound or strain threshold, spend a Story Point to remain active until the end of your next turn. If you reduce wounds or strain below threshold before then, you avoid incapacitation.",
    "requirements": null
  },
  {
    "name": "Master",
    "ranked": false,
    "tier": 5,
    "activation": "Incidental",
    "effect": "Choose one skill when purchasing this talent. Once per round, suffer 2 strain to reduce the difficulty of the next check using that skill by 2 (minimum Easy).",
    "requirements": null
  },
  {
    "name": "Overcharge (Improved)",
    "ranked": false,
    "tier": 5,
    "activation": "Passive",
    "effect": "When using Overcharge, may spend 2 advantage or 1 triumph from the Mechanics check to immediately take one additional action. Once per check.",
    "requirements": "Overcharge"
  },
  {
    "name": "Ruinous Repartee",
    "ranked": false,
    "tier": 5,
    "activation": "Action",
    "effect": "Once per encounter, make an opposed Charm or Coercion vs Discipline check targeting one character within medium range. On success, the target suffers strain equal to twice your Presence plus 1 per success. You heal strain equal to the strain inflicted.",
    "requirements": null
  }
]

      for(let i = 0; i < data.length; i++) {
        setDoc(doc(db, 'Talents', "Talent-" + data[i].name), {
          name: data[i].name,
          effect: data[i].effect,
          tier: data[i].tier,
          timesBought: {},
          activation: data[i].activation,
          ranked: data[i].ranked,
          requirements: data[i].requirements
        })
      }
  }

  const toggleVisibility = async (recipeId, currentlyHidden) => {
    if (!userIsDM) {
      showToast('Only DMs can change recipe visibility', 'error');
      return;
    }

    try {
      const recipeRef = doc(db, 'Crafting', recipeId);
      const newVisibility = currentlyHidden ? 'visible' : 'hidden';
      
      await updateDoc(recipeRef, {
        [`sessionVisibility.${sessionId}`]: newVisibility
      });

      showToast(
        `Recipe ${newVisibility === 'visible' ? 'shown to' : 'hidden from'} players`,
        'success'
      );
    } catch (error) {
      showToast('Error updating recipe visibility', 'error');
      console.error(error);
    }
  };

  useEffect(() => {
    if (!requireSession()) return;
    if (localStorage.getItem("loggedIn") !== 'false') {
      getRecipesFromDB();
    }
  }, [sessionId]);

  const getRecipesFromDB = () => {
    if (!sessionId) return;

    const q = query(collection(db, 'Crafting'));

    const unsub = onSnapshot(q, (querySnapshot) => {
      const queryData = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const sessionVisibility = data.sessionVisibility || {};
        
        queryData.push({ 
          ...data,
          isHidden: sessionVisibility[sessionId] !== 'visible'
        });
      });
      setRecipes(queryData);
      setLoading(false);
    });

    return () => unsub();
  };

  const getFilteredRecipes = () => {
    let filtered = recipes;

    // Filter by visibility
    if (showHiddenOnly) {
      filtered = filtered.filter(recipe => recipe.isHidden);
    } else if (!userIsDM) {
      filtered = filtered.filter(recipe => !recipe.isHidden);
    }

    // Filter by search term
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(recipe =>
        recipe.name?.toLowerCase().includes(search) ||
        recipe.result_item_id?.toLowerCase().includes(search) ||
        recipe.crafting_notes?.toLowerCase().includes(search)
      );
    }

    // Filter by skill
    if (filterSkill !== '-1') {
      filtered = filtered.filter(recipe => 
        recipe.crafting_skill === filterSkill
      );
    }

    // Filter by difficulty
    if (filterDifficulty !== '-1') {
      filtered = filtered.filter(recipe => 
        recipe.base_difficulty === filterDifficulty
      );
    }

    // Filter by workshop requirement
    if (filterWorkshop === 'required') {
      filtered = filtered.filter(recipe => recipe.required_workshop !== null);
    } else if (filterWorkshop === 'none') {
      filtered = filtered.filter(recipe => recipe.required_workshop === null);
    }

    return filtered;
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filterSkill !== '-1') count++;
    if (filterDifficulty !== '-1') count++;
    if (filterWorkshop !== '-1') count++;
    if (showHiddenOnly) count++;
    return count;
  };

  const resetFilters = () => {
    setFilterSkill('-1');
    setFilterDifficulty('-1');
    setFilterWorkshop('-1');
    setShowHiddenOnly(false);
  };

  const openDetailsModal = (recipe) => {
    setDetailsModal({ isOpen: true, recipeData: recipe });
  };

  const closeDetailsModal = () => {
    setDetailsModal({ isOpen: false, recipeData: null });
  };

  // Update modal data when recipes change (for real-time updates)
  useEffect(() => {
    if (detailsModal.isOpen && detailsModal.recipeData) {
      const updatedRecipe = recipes.find(r => r.id === detailsModal.recipeData.id);
      if (updatedRecipe) {
        setDetailsModal(prev => ({ ...prev, recipeData: updatedRecipe }));
      }
    }
  }, [recipes]);

  const FilterSection = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Skill Filter */}
        <div>
          <label className="block text-sm font-medium text-purple-300 mb-2">Crafting Skill</label>
          <select
            value={filterSkill}
            onChange={(e) => setFilterSkill(e.target.value)}
            className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          >
            <option value="-1">All Skills</option>
            <option value="Metalworking">Metalworking</option>
            <option value="Leatherworking">Leatherworking</option>
            <option value="Alchemy">Alchemy</option>
            <option value="Carpentry">Carpentry</option>
            <option value="Cooking">Cooking</option>
          </select>
        </div>

        {/* Difficulty Filter */}
        <div>
          <label className="block text-sm font-medium text-purple-300 mb-2">Difficulty</label>
          <select
            value={filterDifficulty}
            onChange={(e) => setFilterDifficulty(e.target.value)}
            className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          >
            <option value="-1">All Difficulties</option>
            <option value="Simple">Simple</option>
            <option value="Easy">Easy</option>
            <option value="Average">Average</option>
            <option value="Hard">Hard</option>
            <option value="Daunting">Daunting</option>
          </select>
        </div>

        {/* Workshop Filter */}
        <div>
          <label className="block text-sm font-medium text-purple-300 mb-2">Workshop Requirement</label>
          <select
            value={filterWorkshop}
            onChange={(e) => setFilterWorkshop(e.target.value)}
            className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          >
            <option value="-1">All Recipes</option>
            <option value="required">Workshop Required</option>
            <option value="none">No Workshop Needed</option>
          </select>
        </div>
      </div>

      {/* Hidden Only Toggle */}
      {userIsDM && (
        <div className="flex items-center justify-between bg-purple-600/10 rounded-lg p-4 border border-purple-500/30">
          <span className="text-purple-300 font-medium">Show hidden recipes only</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={showHiddenOnly}
              onChange={(e) => setShowHiddenOnly(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
          </label>
        </div>
      )}

      {/* Reset Button */}
      {getActiveFilterCount() > 0 && (
        <button
          onClick={resetFilters}
          className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-400 font-medium py-3 px-4 rounded-lg border border-red-500/50 transition-all"
        >
          Reset Filters ({getActiveFilterCount()} active)
        </button>
      )}
    </div>
  );

  const filteredRecipes = getFilteredRecipes();

  if (localStorage.getItem("loggedIn") === 'false') {
    return <NotLoggedIn />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-8">
      <Toast message={toast.message} severity={toast.severity} isOpen={toast.open} onClose={hideToast} />
      
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Crafting Recipes</h1>
            <p className="text-gray-400">Browse available crafting recipes</p>
          </div>
          
          {userIsDM && (
            <button
              onClick={addData}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-all shadow-lg hover:shadow-purple-500/50"
            >
              Upload Recipes
            </button>
          )}
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search recipes by name, item, or notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 pl-12 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          />
          <svg className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Filters Toggle */}
        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          className="w-full bg-white/5 hover:bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white font-medium transition-all flex items-center justify-between mb-4"
        >
          <span className="flex items-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span>Filters</span>
            {getActiveFilterCount() > 0 && (
              <span className="bg-purple-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {getActiveFilterCount()}
              </span>
            )}
          </span>
          <svg className={`w-5 h-5 transition-transform ${filtersOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Filters Panel */}
        {filtersOpen && (
          <div className="bg-white/5 backdrop-blur-lg border border-white/20 rounded-lg p-6 mb-4">
            <FilterSection />
          </div>
        )}

        {/* Results Count */}
        <div className="text-gray-400 text-sm">
          Showing {filteredRecipes.length} of {recipes.length} recipes
        </div>
      </div>

      {/* Recipe Grid */}
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
            <p className="text-gray-400 mt-4">Loading recipes...</p>
          </div>
        ) : filteredRecipes.length === 0 ? (
          <div className="text-center py-20">
            <svg className="w-24 h-24 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-gray-400 text-xl">No recipes found</p>
            <p className="text-gray-500 mt-2">Try adjusting your filters or search term</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes.map((recipe) => (
              <Craft
                key={recipe.id}
                recipe={recipe}
                onClick={() => openDetailsModal(recipe)}
                isHidden={recipe.isHidden}
                userIsDM={userIsDM}
              />
            ))}
          </div>
        )}
      </div>

      {/* Details Modal */}
      {detailsModal.isOpen && (
        <CraftModal
          recipe={detailsModal.recipeData}
          onClose={closeDetailsModal}
          userIsDM={userIsDM}
          onToggleVisibility={toggleVisibility}
        />
      )}

      <div onClick={() => addTempData()}>ADD TO DB</div>
    </div>
  );
}