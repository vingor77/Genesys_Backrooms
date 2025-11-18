import React, { useState, useEffect } from 'react';
import { collection, doc, onSnapshot, query, updateDoc, setDoc } from "firebase/firestore";
import db from '../Components/firebase';
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

// Sample item sets data
const itemSetsData = [
  {
    name: "Voidwalker's Regalia",
    set_id: "voidwalker_regalia",
    set_type: "Armor",
    rarity: "Legendary",
    theme: "Cosmic/Void",
    short_description: "Ancient armor forged in the spaces between realities",
    full_description: "The Voidwalker's Regalia was crafted by the last Astral Knights before their order fell into the void. Each piece resonates with energy from beyond the material plane, and when worn together, they allow the wearer to slip between worlds.",
    set_pieces: [
      "Voidwalker's Helm",
      "Voidwalker's Cuirass",
      "Voidwalker's Gauntlets",
      "Voidwalker's Greaves",
      "Voidwalker's Cloak"
    ],
    set_bonuses: [
      {
        pieces_required: 2,
        bonus_name: "Void Affinity",
        description: "You feel the pull of the spaces between",
        mechanical_effect: "Gain 1 rank in Knowledge (Forbidden) if you don't have it, or add 1 boost die to Knowledge (Forbidden) checks if you do",
        narrative_effect: "You can sense nearby planar rifts and dimensional instabilities",
        sessionVisibility: {}
      },
      {
        pieces_required: 3,
        bonus_name: "Phase Step",
        description: "Reality becomes negotiable",
        mechanical_effect: "Once per encounter, may move through solid objects as a maneuver. Must end movement in empty space or suffer 5 wounds.",
        narrative_effect: "Your form flickers and becomes translucent when concentrating",
        sessionVisibility: {}
      },
      {
        pieces_required: 4,
        bonus_name: "Void Resilience",
        description: "The void protects its own",
        mechanical_effect: "Increase strain threshold by 3. Immune to vacuum and pressure effects.",
        narrative_effect: "Cosmic energies no longer harm you - you are becoming something more",
        sessionVisibility: {}
      },
      {
        pieces_required: 5,
        bonus_name: "Walk Between Worlds",
        description: "The greatest power - freedom from reality's constraints",
        mechanical_effect: "Once per session, may teleport to any location you can see within Extreme range as an action. Additionally, may spend 2 strain to become incorporeal for 1 round.",
        narrative_effect: "You have truly become a Voidwalker. Reality is a suggestion, and you can step outside it at will.",
        sessionVisibility: {}
      }
    ],
    attunement_required: true,
    attunement_process: "Each piece must be attuned separately (1 hour meditation). Wearing multiple attuned pieces automatically grants set bonuses.",
    appearance: {
      material: "Dark metal that seems to absorb light, with edges that shimmer like distant stars",
      color_scheme: "Deep black with purple and blue highlights, occasional sparks of silver",
      distinctive_features: "Each piece bears constellation patterns that slowly shift and change",
      glow_effect: "Faint purple glow when set bonuses are active"
    },
    has_consequences: true,
    wearing_consequences: {
      "2": "Minor - occasional unsettling dreams of floating in void",
      "3": "Moderate - food tastes bland, colors seem muted, feeling of detachment",
      "4": "Significant - difficulty relating to others, occasional memory lapses, compulsion to seek out void phenomena",
      "5": "Severe - must make Hard Discipline check once per week or gain 1 point of void corruption. At 5 corruption, begin to fade from reality."
    },
    tags: ["Void", "Armor", "Legendary", "Corrupting"],
    set_image_url: null,
    sessionVisibility: {}
  },
  {
    name: "Dragon's Arsenal",
    set_id: "dragons_arsenal",
    set_type: "Weapons",
    rarity: "Epic",
    theme: "Draconic",
    short_description: "Weapons forged from the fangs and claws of an ancient dragon",
    full_description: "When the great wyrm Ignathar fell in battle, master weaponsmiths crafted three legendary weapons from his remains. Each weapon burns with the dragon's eternal fire, and together they channel the full fury of dragonkind.",
    set_pieces: [
      "Fang of Ignathar",
      "Claw of Ignathar",
      "Breath of Ignathar"
    ],
    set_bonuses: [
      {
        pieces_required: 2,
        bonus_name: "Dragon's Might",
        description: "The fire within awakens",
        mechanical_effect: "All weapons in this set gain +1 damage and the Burn 1 quality",
        narrative_effect: "Your weapons glow with inner fire and emit faint smoke when drawn",
        sessionVisibility: {}
      },
      {
        pieces_required: 3,
        bonus_name: "Wyrm's Wrath",
        description: "Channel the full power of the ancient dragon",
        mechanical_effect: "Once per session, may unleash a cone of dragonfire (Short range, 8 damage, Burn 2, Blast 4). Gain immunity to fire damage.",
        narrative_effect: "Dragon scales begin to appear on your arms. Your eyes glow like embers.",
        sessionVisibility: {}
      }
    ],
    attunement_required: true,
    attunement_process: "Must be bathed in dragonfire or intense heat (forge, volcano, etc.) while holding the weapon for 10 minutes.",
    appearance: {
      material: "Dark red dragon bone and scale, with veins of molten gold",
      color_scheme: "Deep crimson, black, and glowing orange",
      distinctive_features: "Weapons pulse with inner heat, warm to touch, leave ember trails when swung",
      glow_effect: "Intensifies with wielder's emotions, especially anger"
    },
    has_consequences: false,
    wearing_consequences: null,
    tags: ["Dragon", "Weapons", "Epic", "Fire"],
    set_image_url: null,
    sessionVisibility: {}
  },
  {
    name: "Chronomancer's Regalia",
    set_id: "chronomancer_regalia",
    set_type: "Accessories",
    rarity: "Legendary",
    theme: "Time/Temporal",
    short_description: "Artifacts that grant mastery over the flow of time",
    full_description: "These four artifacts were created by the Temporal Conclave to protect reality from paradoxes. Each piece allows minor manipulation of time, but together they grant powers that border on divine.",
    set_pieces: [
      "Hourglass Amulet",
      "Clockwork Ring",
      "Timeless Pocket Watch",
      "Paradox Belt"
    ],
    set_bonuses: [
      {
        pieces_required: 2,
        bonus_name: "Temporal Awareness",
        description: "Time reveals its secrets to you",
        mechanical_effect: "Add 2 boost dice to all Initiative checks. Cannot be surprised.",
        narrative_effect: "You perceive events a split-second before they occur, giving you preternatural reflexes",
        sessionVisibility: {}
      },
      {
        pieces_required: 3,
        bonus_name: "Borrowed Time",
        description: "Borrow seconds from the future",
        mechanical_effect: "Once per encounter, may take an additional maneuver without suffering strain. Once per session, may take an additional action.",
        narrative_effect: "Time seems to slow for others while you move at normal speed",
        sessionVisibility: {}
      },
      {
        pieces_required: 4,
        bonus_name: "Chronomancy",
        description: "True mastery over temporal flow",
        mechanical_effect: "Once per session, may rewind time by 1 round - everything resets to the start of that round except you retain your memories and knowledge. Additionally, age at 1/10th normal rate.",
        narrative_effect: "Your eyes show multiple timelines simultaneously. Clocks near you run erratically.",
        sessionVisibility: {}
      }
    ],
    attunement_required: true,
    attunement_process: "Must meditate while wearing/holding the item during a time of temporal significance (eclipse, new year, midnight, etc.) for 1 hour.",
    appearance: {
      material: "Silver, crystal, and eternally ticking mechanisms",
      color_scheme: "Silver, gold, blue, with constantly shifting patterns",
      distinctive_features: "Gears visible within crystal, hands move backwards sometimes, shows glimpses of past/future",
      glow_effect: "Soft blue-white glow that pulses like a heartbeat"
    },
    has_consequences: true,
    wearing_consequences: {
      "2": "Minor - occasional déjà vu, clocks near you run 1-2 minutes fast or slow",
      "3": "Moderate - difficulty remembering if events happened already or will happen. Prophetic dreams that may or may not be accurate.",
      "4": "Severe - risk of temporal dissonance. Each week, roll 1d10. On 1, you skip forward 1d6 hours with no memory of the time passing. On 10, you experience the same hour twice."
    },
    tags: ["Time", "Accessories", "Legendary", "Temporal"],
    set_image_url: null,
    sessionVisibility: {}
  },
  {
    name: "Ironclad Bulwark",
    set_id: "ironclad_bulwark",
    set_type: "Armor",
    rarity: "Rare",
    theme: "Defense/Protection",
    short_description: "Heavy plate armor favored by royal guards and elite defenders",
    full_description: "Forged in the royal armories, the Ironclad Bulwark set represents the pinnacle of defensive craftsmanship. Generations of guards have worn these pieces, each adding minor enchantments of protection.",
    set_pieces: [
      "Ironclad Helm",
      "Ironclad Breastplate",
      "Ironclad Pauldrons",
      "Ironclad Gauntlets",
      "Ironclad Greaves",
      "Ironclad Boots"
    ],
    set_bonuses: [
      {
        pieces_required: 2,
        bonus_name: "Defensive Stance",
        description: "Training and equipment work in harmony",
        mechanical_effect: "+1 Soak",
        narrative_effect: "You move with the confidence of a trained defender",
        sessionVisibility: {}
      },
      {
        pieces_required: 4,
        bonus_name: "Stalwart Guardian",
        description: "You are a wall that does not break",
        mechanical_effect: "+1 Melee Defense, +1 Ranged Defense",
        narrative_effect: "Attacks seem to deflect away from you almost supernaturally",
        sessionVisibility: {}
      },
      {
        pieces_required: 6,
        bonus_name: "Unbreakable",
        description: "The full armor makes you nearly invincible",
        mechanical_effect: "Additional +1 Soak (total +2). Once per encounter, may reduce a Critical Injury by 2 severity levels (maximum: reduce to severity 1).",
        narrative_effect: "You stand like a fortress. Weapons ring off your armor like bells.",
        sessionVisibility: {}
      }
    ],
    attunement_required: false,
    attunement_process: null,
    appearance: {
      material: "Tempered steel with bronze accents",
      color_scheme: "Steel gray with royal blue and bronze trim",
      distinctive_features: "Royal crest emblazoned on breastplate, intricate etchings of defensive runes",
      glow_effect: "Runes glow faint blue when struck in combat"
    },
    has_consequences: false,
    wearing_consequences: null,
    tags: ["Defense", "Armor", "Rare", "Royal"],
    set_image_url: null,
    sessionVisibility: {}
  },
  {
    name: "Shadowdancer's Kit",
    set_id: "shadowdancer_kit",
    set_type: "Mixed",
    rarity: "Epic",
    theme: "Stealth/Shadow",
    short_description: "Tools and garments of legendary thieves and assassins",
    full_description: "The Shadowdancer's Kit was assembled over decades by the master thief known only as 'The Whisper.' Each piece enhances stealth and agility, and together they make the wearer nearly invisible.",
    set_pieces: [
      "Shadow Cloak",
      "Silent Boots",
      "Nightveil Mask",
      "Whisper Blade",
      "Thief's Lucky Coin"
    ],
    set_bonuses: [
      {
        pieces_required: 2,
        bonus_name: "Skulker",
        description: "You move like a ghost",
        mechanical_effect: "Add 1 boost die to Stealth and Coordination checks",
        narrative_effect: "Your footsteps make no sound. You leave no tracks.",
        sessionVisibility: {}
      },
      {
        pieces_required: 3,
        bonus_name: "Shadow Step",
        description: "Darkness becomes a doorway",
        mechanical_effect: "Once per encounter, may move from one shadow to another within Medium range as a maneuver",
        narrative_effect: "You seem to dissolve into shadows and reappear elsewhere",
        sessionVisibility: {}
      },
      {
        pieces_required: 5,
        bonus_name: "Shadowdancer",
        description: "Master of stealth and shadows",
        mechanical_effect: "Upgrade Stealth checks once. In dim light or darkness, add 1 automatic advantage to all checks.",
        narrative_effect: "You are one with the shadows. In darkness, you are nearly invisible.",
        sessionVisibility: {}
      }
    ],
    attunement_required: true,
    attunement_process: "Must successfully steal something valuable while wearing the item without being detected.",
    appearance: {
      material: "Dark leather, black silk, and tarnished silver",
      color_scheme: "Matte black, dark gray, deep purple accents",
      distinctive_features: "Seems to absorb light rather than reflect it. Edges blur slightly.",
      glow_effect: "No glow - actively darkens nearby light"
    },
    has_consequences: false,
    wearing_consequences: null,
    tags: ["Stealth", "Mixed", "Epic", "Shadow"],
    set_image_url: null,
    sessionVisibility: {}
  }
];

export default function ItemSets() {
  const [itemSets, setItemSets] = useState([]);
  const [selectedSetId, setSelectedSetId] = useState(null); // Store ID instead of object
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterRarity, setFilterRarity] = useState('All');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  
  const sessionId = getActiveSession();
  const userIsDM = isDM();

  // Get the current selected set from the itemSets array (auto-updates)
  const selectedSet = selectedSetId ? itemSets.find(set => set.docId === selectedSetId) : null;

  const showToast = (message, severity = 'success') => {
    setToast({ open: true, message, severity });
  };

  const hideToast = () => {
    setToast({ ...toast, open: false });
  };

  const addData = async () => {
    if (!userIsDM) {
      showToast('Only DMs can upload item set data', 'error');
      return;
    }

    try {
      for(let i = 0; i < itemSetsData.length; i++) {
        await setDoc(doc(db, 'ItemSets', itemSetsData[i].set_id), {
          ...itemSetsData[i]
        });
      }
      showToast('Item sets data added successfully!');
    } catch (error) {
      showToast('Error adding item sets data', 'error');
      console.error(error);
    }
  };

  const getFromDB = () => {
    if (!sessionId) return;

    const q = query(collection(db, 'ItemSets'));
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
      
      queryData.sort((a, b) => a.name.localeCompare(b.name));
      setItemSets(queryData);
      setLoading(false);
    });

    return () => { unsub(); };
  };

  const toggleSetVisibility = async (itemSet) => {
    if (!userIsDM || !sessionId) return;
    
    try {
      const currentSessionVisibility = itemSet.sessionVisibility || {};
      const newVisibility = {
        ...currentSessionVisibility,
        [sessionId]: currentSessionVisibility[sessionId] === false ? true : false
      };

      await updateDoc(doc(db, 'ItemSets', itemSet.docId), {
        sessionVisibility: newVisibility
      });
      
      const action = newVisibility[sessionId] === false ? 'hidden' : 'revealed';
      showToast(`${itemSet.name} ${action} for this session`, 'success');
    } catch (error) {
      console.error('Error toggling visibility:', error);
      showToast('Error updating set visibility', 'error');
    }
  };

  const toggleBonusVisibility = async (itemSet, bonusIndex) => {
    if (!userIsDM || !sessionId) return;
    
    try {
      const updatedBonuses = [...itemSet.set_bonuses];
      const currentVisibility = updatedBonuses[bonusIndex].sessionVisibility || {};
      
      updatedBonuses[bonusIndex] = {
        ...updatedBonuses[bonusIndex],
        sessionVisibility: {
          ...currentVisibility,
          [sessionId]: currentVisibility[sessionId] === false ? true : false
        }
      };

      await updateDoc(doc(db, 'ItemSets', itemSet.docId), {
        set_bonuses: updatedBonuses
      });
      
      const action = updatedBonuses[bonusIndex].sessionVisibility[sessionId] === false ? 'hidden' : 'revealed';
      showToast(`${updatedBonuses[bonusIndex].bonus_name} ${action}`, 'success');
    } catch (error) {
      console.error('Error toggling bonus visibility:', error);
      showToast('Error updating bonus visibility', 'error');
    }
  };

  useEffect(() => {
    if (!requireSession()) return;
    if (localStorage.getItem("loggedIn") !== 'false') {
      getFromDB();
    }
  }, [sessionId]);

  const getFilteredSets = () => {
    return itemSets.filter(set => {
      const visibilityCheck = userIsDM ? true : !set.hiddenInCurrentSession;
      
      const matchesSearch = !searchTerm || 
        (set.name && set.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (set.short_description && set.short_description.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesType = filterType === 'All' || set.set_type === filterType;
      const matchesRarity = filterRarity === 'All' || set.rarity === filterRarity;
      
      return visibilityCheck && matchesSearch && matchesType && matchesRarity;
    });
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (searchTerm !== '') count++;
    if (filterType !== 'All') count++;
    if (filterRarity !== 'All') count++;
    return count;
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setFilterType('All');
    setFilterRarity('All');
    showToast('All filters cleared');
  };

  const getSetTypeIcon = (type) => {
    const icons = {
      'Armor': '🛡️',
      'Weapons': '⚔️',
      'Accessories': '💍',
      'Mixed': '🎒',
      'Utility': '🔧'
    };
    return icons[type] || '📦';
  };

  const getRarityGradient = (rarity) => {
    const gradients = {
      'Common': 'from-gray-600 to-slate-700',
      'Uncommon': 'from-green-600 to-emerald-700',
      'Rare': 'from-blue-600 to-cyan-700',
      'Epic': 'from-purple-600 to-violet-700',
      'Legendary': 'from-amber-600 to-orange-700',
      'Mythic': 'from-red-600 to-rose-700'
    };
    return gradients[rarity] || 'from-gray-600 to-slate-700';
  };

  const getRarityBadgeColor = (rarity) => {
    const colors = {
      'Common': 'bg-gray-500',
      'Uncommon': 'bg-green-500',
      'Rare': 'bg-blue-500',
      'Epic': 'bg-purple-500',
      'Legendary': 'bg-amber-500',
      'Mythic': 'bg-red-500'
    };
    return colors[rarity] || 'bg-gray-500';
  };

  if (localStorage.getItem("loggedIn") === 'false') {
    return <NotLoggedIn />;
  }

  const filteredSets = getFilteredSets();

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

  const FilterSection = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Set Type</label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
          >
            <option value="All" className="bg-gray-800">All Types</option>
            <option value="Armor" className="bg-gray-800">Armor</option>
            <option value="Weapons" className="bg-gray-800">Weapons</option>
            <option value="Accessories" className="bg-gray-800">Accessories</option>
            <option value="Mixed" className="bg-gray-800">Mixed</option>
            <option value="Utility" className="bg-gray-800">Utility</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Rarity</label>
          <select
            value={filterRarity}
            onChange={(e) => setFilterRarity(e.target.value)}
            className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
          >
            <option value="All" className="bg-gray-800">All Rarities</option>
            <option value="Common" className="bg-gray-800">Common</option>
            <option value="Uncommon" className="bg-gray-800">Uncommon</option>
            <option value="Rare" className="bg-gray-800">Rare</option>
            <option value="Epic" className="bg-gray-800">Epic</option>
            <option value="Legendary" className="bg-gray-800">Legendary</option>
            <option value="Mythic" className="bg-gray-800">Mythic</option>
          </select>
        </div>

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
            {searchTerm && (
              <FilterChip
                label={`Search: "${searchTerm}"`}
                onDelete={() => setSearchTerm('')}
              />
            )}
            {filterType !== 'All' && (
              <FilterChip
                label={`Type: ${filterType}`}
                onDelete={() => setFilterType('All')}
              />
            )}
            {filterRarity !== 'All' && (
              <FilterChip
                label={`Rarity: ${filterRarity}`}
                onDelete={() => setFilterRarity('All')}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-amber-900 to-orange-900">
      <div className="max-w-full mx-auto px-4 py-6 space-y-6">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-900/50 to-orange-900/50 backdrop-blur-lg rounded-2xl border border-white/10 p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-1 md:mb-2">Item Sets</h1>
                <p className="text-sm md:text-base text-amber-300">Discover powerful synergies by collecting complete equipment sets</p>
              </div>
            </div>
            
            {userIsDM && (
              <button 
                onClick={addData}
                className="w-full md:w-auto bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"></path>
                </svg>
                <span>Upload Sample Sets</span>
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-12">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-400 mb-4"></div>
              <h3 className="text-xl font-semibold text-white mb-2">Loading item sets...</h3>
              <p className="text-gray-400">Please wait while we fetch the data</p>
            </div>
          </div>
        ) : itemSets.length > 0 ? (
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
                    <span className="hidden sm:inline-block bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full text-sm font-bold">
                      {filteredSets.length} shown
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

              <div className="p-4 md:p-6 space-y-6">
                {/* Search Bar - Always Visible */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search by name or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white/5 border border-white/20 rounded-xl pl-12 pr-12 py-3 md:py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all text-base md:text-lg"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
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
            <SetCardGrid 
              sets={filteredSets}
              onSelectSet={(itemSet) => setSelectedSetId(itemSet.docId)}
              onToggleVisibility={toggleSetVisibility}
              onToggleBonusVisibility={toggleBonusVisibility}
              userIsDM={userIsDM}
              sessionId={sessionId}
              getSetTypeIcon={getSetTypeIcon}
              getRarityGradient={getRarityGradient}
              getRarityBadgeColor={getRarityBadgeColor}
            />
          </>
        ) : (
          <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-12">
            <div className="flex flex-col items-center justify-center text-center">
              <svg className="w-16 h-16 text-gray-500 mb-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
              <h3 className="text-xl font-semibold text-white mb-2">No item sets available</h3>
              <p className="text-gray-400">Upload some item sets to get started</p>
            </div>
          </div>
        )}

        {/* Mobile Filter Fab */}
        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          className="md:hidden fixed bottom-6 right-6 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 transform hover:scale-110 z-40"
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

      {/* Set Details Modal */}
      {selectedSet && (
        <SetDetailsModal
          itemSet={selectedSet}
          onClose={() => setSelectedSetId(null)}
          userIsDM={userIsDM}
          sessionId={sessionId}
          onToggleVisibility={toggleSetVisibility}
          onToggleBonusVisibility={toggleBonusVisibility}
          getSetTypeIcon={getSetTypeIcon}
          getRarityBadgeColor={getRarityBadgeColor}
        />
      )}
    </div>
  );
}

// Set Card Grid Component
const SetCardGrid = ({ sets, onSelectSet, onToggleVisibility, onToggleBonusVisibility, userIsDM, sessionId, getSetTypeIcon, getRarityGradient, getRarityBadgeColor }) => {
  if (sets.length === 0) {
    return (
      <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-12 text-center">
        <svg className="w-16 h-16 text-gray-500 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path>
        </svg>
        <h3 className="text-xl font-semibold text-white mb-2">No item sets found</h3>
        <p className="text-gray-400 mb-4">Try adjusting your search criteria</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <svg className="w-6 h-6 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
          </svg>
          <h2 className="text-xl font-bold text-white">
            Found {sets.length} set{sets.length !== 1 ? 's' : ''}
          </h2>
        </div>
      </div>

      {/* Set Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4 md:gap-6">
        {sets.map((itemSet) => (
          <SetCard
            key={itemSet.docId}
            itemSet={itemSet}
            onSelect={onSelectSet}
            onToggleVisibility={onToggleVisibility}
            userIsDM={userIsDM}
            getSetTypeIcon={getSetTypeIcon}
            getRarityGradient={getRarityGradient}
            getRarityBadgeColor={getRarityBadgeColor}
          />
        ))}
      </div>
    </div>
  );
};

// Set Card Component
const SetCard = ({ itemSet, onSelect, onToggleVisibility, userIsDM, getSetTypeIcon, getRarityGradient, getRarityBadgeColor }) => {
  return (
    <div className={`group relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl border-2 border-white/10 hover:border-amber-500/50 ${itemSet.hiddenInCurrentSession && userIsDM ? 'opacity-60' : ''}`}>
      
      {/* Top Accent Line */}
      <div className={`h-1 bg-gradient-to-r ${getRarityGradient(itemSet.rarity)}`}></div>

      {/* Status Badges */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        {itemSet.hiddenInCurrentSession && userIsDM && (
          <div className="bg-gradient-to-r from-red-500 to-rose-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg border border-red-400">
            🚫 HIDDEN
          </div>
        )}
      </div>

      {/* Header Section */}
      <div className="relative p-4 md:p-6 pb-3 md:pb-4">
        <div className="flex items-start gap-3 md:gap-4">
          {/* Icon */}
          <div className={`relative flex-shrink-0 w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br ${getRarityGradient(itemSet.rarity)} bg-opacity-30 backdrop-blur-xl rounded-2xl flex items-center justify-center text-2xl md:text-3xl border-2 border-white/20 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            <span className="relative z-10">{getSetTypeIcon(itemSet.set_type)}</span>
          </div>

          {/* Title and Type */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg md:text-xl font-bold text-white mb-1 md:mb-2 leading-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 transition-all duration-300 line-clamp-2">
              {itemSet.name}
            </h3>
            
            {/* Type & Rarity Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2 md:px-3 py-1 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 text-white font-semibold text-xs">
                {itemSet.set_type}
              </span>
              <span className={`px-2 md:px-3 py-1 ${getRarityBadgeColor(itemSet.rarity)} rounded-lg text-white font-bold text-xs`}>
                {itemSet.rarity}
              </span>
              <span className="px-2 md:px-3 py-1 bg-amber-500/20 border border-amber-500/30 rounded-lg text-amber-300 font-medium text-xs">
                {itemSet.set_pieces.length} pieces
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="px-4 md:px-6">
        <div className={`h-px bg-gradient-to-r ${getRarityGradient(itemSet.rarity)} opacity-30`}></div>
      </div>

      {/* Content Section */}
      <div className="p-4 md:p-6 space-y-4">
        {/* Description */}
        <div>
          <p className="text-sm text-gray-300 leading-relaxed line-clamp-3">
            {itemSet.short_description}
          </p>
        </div>

        {/* Set Bonuses Preview */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
            <h4 className="text-sm font-bold text-amber-300 uppercase tracking-wide">
              Set Bonuses ({itemSet.set_bonuses.length})
            </h4>
          </div>
          <div className="space-y-2">
            {itemSet.set_bonuses.slice(0, 2).map((bonus, idx) => (
              <div key={idx} className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-2">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-5 h-5 md:w-6 md:h-6 bg-amber-500/30 rounded-full flex items-center justify-center text-amber-400 text-xs font-bold border border-amber-500/50">
                    {bonus.pieces_required}
                  </div>
                  <span className="text-white font-bold text-xs">{bonus.bonus_name}</span>
                </div>
                <p className="text-xs text-amber-200 line-clamp-1 italic">{bonus.description}</p>
              </div>
            ))}
            {itemSet.set_bonuses.length > 2 && (
              <p className="text-xs text-amber-300/60 italic text-center">
                +{itemSet.set_bonuses.length - 2} more bonuses
              </p>
            )}
          </div>
        </div>

        {/* Tags */}
        {itemSet.tags && itemSet.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {itemSet.tags.slice(0, 4).map((tag, index) => (
              <span 
                key={index}
                className="px-2 py-1 text-xs font-medium rounded-md bg-white/5 border border-white/20 text-gray-300"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="px-4 md:px-6">
        <div className={`h-px bg-gradient-to-r ${getRarityGradient(itemSet.rarity)} opacity-30`}></div>
      </div>

      {/* Actions Section */}
      <div className="p-4 md:p-6 space-y-2">
        {/* View Details Button */}
        <button
          onClick={() => onSelect(itemSet)}
          className={`w-full group/btn relative overflow-hidden bg-gradient-to-r ${getRarityGradient(itemSet.rarity)} hover:shadow-lg text-white font-bold py-2.5 md:py-3 px-4 rounded-xl transition-all duration-300 hover:scale-[1.02] border-2 border-white/20 hover:border-white/40`}
        >
          <div className="absolute inset-0 bg-white opacity-0 group-hover/btn:opacity-20 transition-opacity duration-300"></div>
          <div className="relative flex items-center justify-center gap-2">
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"></path>
            </svg>
            <span className="text-sm md:text-base">View Full Details</span>
          </div>
        </button>

        {/* DM Controls */}
        {userIsDM && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleVisibility(itemSet);
            }}
            className={`w-full group/btn relative overflow-hidden font-bold py-2 md:py-2.5 px-3 rounded-xl transition-all duration-300 hover:scale-[1.02] border-2 ${
              itemSet.hiddenInCurrentSession
                ? 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 border-emerald-400 text-white'
                : 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 border-amber-400 text-white'
            }`}
          >
            <div className="absolute inset-0 bg-white opacity-0 group-hover/btn:opacity-20 transition-opacity duration-300"></div>
            <div className="relative flex items-center justify-center gap-1.5 text-xs md:text-sm">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                {itemSet.hiddenInCurrentSession ? (
                  <>
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"></path>
                  </>
                ) : (
                  <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd"></path>
                )}
              </svg>
              <span>{itemSet.hiddenInCurrentSession ? 'Reveal Set' : 'Hide Set'}</span>
            </div>
          </button>
        )}
      </div>

      {/* Bottom Accent */}
      <div className={`h-1 bg-gradient-to-r ${getRarityGradient(itemSet.rarity)} opacity-50`}></div>
    </div>
  );
};

// Set Details Modal Component - MOBILE FRIENDLY REDESIGN
const SetDetailsModal = ({ itemSet, onClose, userIsDM, sessionId, onToggleVisibility, onToggleBonusVisibility, getSetTypeIcon, getRarityBadgeColor }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const getRarityGradient = (rarity) => {
    const gradients = {
      'Common': 'from-gray-600 to-slate-700',
      'Uncommon': 'from-green-600 to-emerald-700',
      'Rare': 'from-blue-600 to-cyan-700',
      'Epic': 'from-purple-600 to-violet-700',
      'Legendary': 'from-amber-600 to-orange-700',
      'Mythic': 'from-red-600 to-rose-700'
    };
    return gradients[rarity] || 'from-gray-600 to-slate-700';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm animate-fadeIn">
      {/* Modal Container - Mobile Friendly */}
      <div className="h-full w-full flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 md:m-4 md:rounded-2xl md:border-2 md:border-white/20 md:h-auto md:max-h-[90vh] md:max-w-4xl md:mx-auto overflow-hidden">
        
        {/* Compact Header */}
        <div className={`flex-shrink-0 bg-gradient-to-r ${getRarityGradient(itemSet.rarity)} bg-opacity-20 border-b border-white/10`}>
          {/* Top Bar */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className={`flex-shrink-0 w-12 h-12 bg-gradient-to-br ${getRarityGradient(itemSet.rarity)} rounded-xl flex items-center justify-center text-2xl border border-white/30`}>
                {getSetTypeIcon(itemSet.set_type)}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg md:text-xl font-bold text-white truncate">{itemSet.name}</h2>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`px-2 py-0.5 ${getRarityBadgeColor(itemSet.rarity)} rounded text-white font-bold text-xs`}>
                    {itemSet.rarity}
                  </span>
                  <span className="px-2 py-0.5 bg-white/10 rounded text-white text-xs">
                    {itemSet.set_type}
                  </span>
                </div>
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

          {/* DM Controls */}
          {userIsDM && (
            <div className="px-4 py-2 bg-black/20 border-b border-white/10">
              <button
                onClick={() => onToggleVisibility(itemSet)}
                className={`w-full px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  itemSet.hiddenInCurrentSession
                    ? 'bg-green-500/20 text-green-300 border border-green-500/50 hover:bg-green-500/30'
                    : 'bg-red-500/20 text-red-300 border border-red-500/50 hover:bg-red-500/30'
                }`}
              >
                {itemSet.hiddenInCurrentSession ? '👁️ Reveal Set' : '🚫 Hide Set'}
              </button>
            </div>
          )}

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
                active={activeTab === 'bonuses'}
                onClick={() => setActiveTab('bonuses')}
                icon="⭐"
                label="Bonuses"
                count={itemSet.set_bonuses.length}
              />
              <MobileTabButton
                active={activeTab === 'appearance'}
                onClick={() => setActiveTab('appearance')}
                icon="🎨"
                label="Appearance"
              />
              {itemSet.has_consequences && (
                <MobileTabButton
                  active={activeTab === 'consequences'}
                  onClick={() => setActiveTab('consequences')}
                  icon="⚠️"
                  label="Risks"
                />
              )}
            </div>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'overview' && (
            <MobileOverviewTab itemSet={itemSet} />
          )}
          {activeTab === 'bonuses' && (
            <MobileBonusesTab 
              itemSet={itemSet} 
              userIsDM={userIsDM} 
              sessionId={sessionId} 
              onToggleBonusVisibility={onToggleBonusVisibility} 
            />
          )}
          {activeTab === 'appearance' && (
            <MobileAppearanceTab itemSet={itemSet} />
          )}
          {activeTab === 'consequences' && itemSet.has_consequences && (
            <MobileConsequencesTab itemSet={itemSet} />
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

// Mobile Overview Tab
const MobileOverviewTab = ({ itemSet }) => (
  <div className="space-y-4">
    {/* Description */}
    <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-amber-400 text-xl">📖</span>
        <h3 className="text-white font-bold">Description</h3>
      </div>
      <p className="text-gray-300 text-sm leading-relaxed">{itemSet.full_description}</p>
    </div>

    {/* Set Pieces - Compact Grid */}
    <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-blue-400 text-xl">📦</span>
          <h3 className="text-white font-bold">Set Pieces</h3>
        </div>
        <span className="text-blue-400 text-sm font-bold">{itemSet.set_pieces.length} items</span>
      </div>
      <div className="space-y-2">
        {itemSet.set_pieces.map((piece, idx) => (
          <div
            key={idx}
            className="bg-gradient-to-r from-blue-900/20 to-cyan-900/20 border border-blue-500/30 rounded-lg p-3 flex items-center gap-3"
          >
            <div className="w-6 h-6 bg-blue-500/30 rounded-full flex items-center justify-center text-blue-400 text-xs font-bold border border-blue-500/50 flex-shrink-0">
              {idx + 1}
            </div>
            <span className="text-white text-sm font-medium">{piece}</span>
          </div>
        ))}
      </div>
    </div>

    {/* Attunement */}
    {itemSet.attunement_required && (
      <div className="bg-gradient-to-br from-purple-900/30 to-violet-900/30 rounded-xl p-4 border border-purple-500/30">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-purple-400 text-xl">✨</span>
          <h3 className="text-white font-bold">Attunement Required</h3>
        </div>
        <p className="text-purple-200 text-sm leading-relaxed">{itemSet.attunement_process}</p>
      </div>
    )}

    {/* Tags */}
    {itemSet.tags && itemSet.tags.length > 0 && (
      <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-pink-400 text-xl">🏷️</span>
          <h3 className="text-white font-bold">Tags</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {itemSet.tags.map((tag, idx) => (
            <span key={idx} className="bg-pink-500/20 text-pink-300 px-2.5 py-1 rounded-lg text-xs border border-pink-500/30 font-medium">
              {tag}
            </span>
          ))}
        </div>
      </div>
    )}
  </div>
);

// Mobile Bonuses Tab
const MobileBonusesTab = ({ itemSet, userIsDM, sessionId, onToggleBonusVisibility }) => (
  <div className="space-y-4">
    {/* Info Banner */}
    <div className="bg-gradient-to-r from-amber-900/30 to-yellow-900/30 rounded-xl p-3 border border-amber-500/30">
      <p className="text-amber-200 text-xs leading-relaxed">
        <strong>Staggered Bonuses:</strong> Each bonus activates when you wear the required number of pieces. Bonuses stack.
      </p>
    </div>

    {/* Bonuses List */}
    <div className="space-y-3">
      {itemSet.set_bonuses.map((bonus, idx) => {
        const isBonusHidden = bonus.sessionVisibility && bonus.sessionVisibility[sessionId] === false;
        const shouldShowToPlayers = userIsDM || !isBonusHidden;

        if (!shouldShowToPlayers) return null;

        return (
          <div
            key={idx}
            className={`bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden ${isBonusHidden && userIsDM ? 'opacity-60' : ''}`}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-900/20 to-orange-900/20 p-3 border-b border-white/10">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div className="w-8 h-8 bg-gradient-to-br from-amber-500/30 to-orange-500/30 rounded-full flex items-center justify-center text-amber-400 text-sm font-bold border border-amber-500/50 flex-shrink-0">
                    {bonus.pieces_required}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-bold text-sm truncate">{bonus.bonus_name}</h3>
                    <p className="text-amber-300 text-xs italic truncate">{bonus.description}</p>
                  </div>
                </div>

                {userIsDM && (
                  <button
                    onClick={() => onToggleBonusVisibility(itemSet, idx)}
                    className={`px-2 py-1 rounded text-xs font-medium transition-all flex-shrink-0 ${
                      isBonusHidden
                        ? 'bg-green-500/20 text-green-300 border border-green-500/50'
                        : 'bg-red-500/20 text-red-300 border border-red-500/50'
                    }`}
                  >
                    {isBonusHidden ? '👁️' : '🚫'}
                  </button>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="p-3 space-y-2">
              {/* Mechanical Effect */}
              <div className="bg-gradient-to-r from-blue-900/30 to-cyan-900/30 rounded-lg p-3 border border-blue-500/30">
                <div className="text-xs font-bold text-blue-300 mb-1">MECHANICAL EFFECT</div>
                <p className="text-blue-200 text-sm leading-relaxed">{bonus.mechanical_effect}</p>
              </div>

              {/* Narrative Effect */}
              <div className="bg-gradient-to-r from-purple-900/30 to-violet-900/30 rounded-lg p-3 border border-purple-500/30">
                <div className="text-xs font-bold text-purple-300 mb-1">NARRATIVE EFFECT</div>
                <p className="text-purple-200 text-sm leading-relaxed italic">{bonus.narrative_effect}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

// Mobile Appearance Tab
const MobileAppearanceTab = ({ itemSet }) => (
  <div className="space-y-3">
    <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-cyan-400 text-xl">🎨</span>
        <h3 className="text-white font-bold text-sm">Material</h3>
      </div>
      <p className="text-gray-300 text-sm leading-relaxed">{itemSet.appearance.material}</p>
    </div>

    <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-pink-400 text-xl">🌈</span>
        <h3 className="text-white font-bold text-sm">Color Scheme</h3>
      </div>
      <p className="text-gray-300 text-sm leading-relaxed">{itemSet.appearance.color_scheme}</p>
    </div>

    <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-yellow-400 text-xl">✨</span>
        <h3 className="text-white font-bold text-sm">Distinctive Features</h3>
      </div>
      <p className="text-gray-300 text-sm leading-relaxed">{itemSet.appearance.distinctive_features}</p>
    </div>

    <div className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 rounded-xl p-4 border border-indigo-500/30">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-indigo-400 text-xl">💫</span>
        <h3 className="text-white font-bold text-sm">Glow Effect</h3>
      </div>
      <p className="text-indigo-200 text-sm leading-relaxed">{itemSet.appearance.glow_effect}</p>
    </div>
  </div>
);

// Mobile Consequences Tab
const MobileConsequencesTab = ({ itemSet }) => (
  <div className="space-y-4">
    {/* Warning Banner */}
    <div className="bg-gradient-to-r from-red-900/30 to-rose-900/30 rounded-xl p-3 border border-red-500/30">
      <p className="text-red-200 text-xs leading-relaxed">
        <strong>⚠️ Warning:</strong> This set has consequences for wearing multiple pieces. Consider the risks carefully.
      </p>
    </div>

    {/* Consequences List */}
    <div className="space-y-3">
      {Object.entries(itemSet.wearing_consequences).map(([pieces, consequence]) => (
        <div
          key={pieces}
          className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden"
        >
          <div className="bg-gradient-to-r from-red-900/20 to-rose-900/20 p-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-red-500/30 to-rose-500/30 rounded-full flex items-center justify-center text-red-400 text-sm font-bold border border-red-500/50 flex-shrink-0">
                {pieces}
              </div>
              <h3 className="text-white font-bold text-sm">
                {pieces} Piece{pieces > 1 ? 's' : ''}
              </h3>
            </div>
          </div>
          <div className="p-3">
            <p className="text-gray-300 text-sm leading-relaxed">{consequence}</p>
          </div>
        </div>
      ))}
    </div>

    {/* Tip Banner */}
    <div className="bg-gradient-to-r from-amber-900/30 to-orange-900/30 rounded-xl p-3 border border-amber-500/30">
      <p className="text-amber-200 text-xs leading-relaxed">
        <strong>💡 Tip:</strong> You can wear fewer pieces to gain some bonuses while avoiding severe consequences.
      </p>
    </div>
  </div>
);