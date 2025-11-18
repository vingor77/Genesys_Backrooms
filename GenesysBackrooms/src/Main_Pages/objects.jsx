import React, { useState, useEffect } from 'react';
import { collection, doc, onSnapshot, orderBy, query, setDoc } from "firebase/firestore";
import db from '../Components/firebase';
import ObjectItem from "../Components/objectItem";
import NotLoggedIn from "../Components/notLoggedIn";

// Draggable Table Modal Component - Now handles variants instead of table data
const DraggableTableModal = ({ isOpen, onClose, objectData }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [windowPosition, setWindowPosition] = useState({ x: 100, y: 100 });

  // Reset position when modal opens
  useEffect(() => {
    if (isOpen) {
      const centerX = window.innerWidth / 2 - 400;
      const centerY = window.innerHeight / 2 - 300;
      setWindowPosition({ 
        x: Math.max(20, centerX), 
        y: Math.max(20, centerY) 
      });
    }
  }, [isOpen]);

  const handleMouseDown = (e) => {
    if (e.target.closest('.modal-content')) return;
    setIsDragging(true);
    setDragStart({
      x: e.clientX - windowPosition.x,
      y: e.clientY - windowPosition.y
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    
    const maxX = window.innerWidth - 400;
    const maxY = window.innerHeight - 200;
    
    setWindowPosition({
      x: Math.max(0, Math.min(newX, maxX)),
      y: Math.max(0, Math.min(newY, maxY))
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = 'none';
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.userSelect = '';
      };
    }
  }, [isDragging, dragStart, windowPosition]);

  if (!isOpen || !objectData || !objectData.variants || objectData.variants.length === 0) return null;

  return (
    <div className="fixed inset-0 z-[10000] pointer-events-none">
      <div 
        className="absolute bg-gray-900/95 backdrop-blur-xl border border-gray-600/50 rounded-xl shadow-2xl pointer-events-auto overflow-hidden"
        style={{
          left: windowPosition.x,
          top: windowPosition.y,
          width: '800px',
          maxHeight: '600px',
          cursor: isDragging ? 'grabbing' : 'default'
        }}
      >
        {/* Window Title Bar */}
        <div 
          className="bg-gradient-to-r from-purple-600/40 to-indigo-600/40 border-b border-gray-600/50 p-3 cursor-grab active:cursor-grabbing select-none"
          onMouseDown={handleMouseDown}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <h2 className="text-sm font-semibold text-white">{objectData.name} - Variants</h2>
            </div>
            
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-white/10 rounded"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
              </svg>
            </button>
          </div>
        </div>

        {/* Variants Content */}
        <div className="modal-content p-4 overflow-auto" style={{ maxHeight: '500px' }}>
          <div className="bg-gray-800/50 rounded-lg border border-gray-600/30 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gradient-to-r from-purple-600/30 to-indigo-600/30 border-b border-gray-600/30">
                  <th className="text-left p-3 text-purple-300 font-semibold">Variant Name</th>
                  <th className="text-left p-3 text-purple-300 font-semibold">Mechanical Effect</th>
                </tr>
              </thead>
              <tbody>
                {objectData.variants.map((variant, index) => (
                  <tr key={index} className="border-b border-gray-600/20 hover:bg-gray-700/30 transition-colors">
                    <td className="p-3 text-white font-medium">{variant.name}</td>
                    <td className="p-3 text-gray-300">{variant.mechanical_effect || variant.effect}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Window Footer */}
        <div className="border-t border-gray-600/50 p-3 bg-gray-800/30">
          <div className="flex justify-between items-center">
            <div className="text-xs text-gray-400">
              Drag the title bar to move this window
            </div>
            <button
              onClick={onClose}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium px-4 py-2 rounded-lg transition-all duration-200 text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

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

export default function Objects() {
  const [objects, setObjects] = useState([]);
  const [objectName, setObjectName] = useState('');
  const [buyPrice, setBuyPrice] = useState('-1');
  const [sellPrice, setSellPrice] = useState('-1');
  const [rarity, setRarity] = useState('-1');
  const [type, setType] = useState("-1");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const [tableModal, setTableModal] = useState({ isOpen: false, objectData: null });

  const data = [
    // ===== OBJECTS =====
    {
      "name": "Almond Water",
      "description": "A sweet almond/vanilla flavored beverage commonly found in various bottle types throughout the Backrooms.",
      "mechanical_effect": "Counts as 1 ration when consumed. Grants +1 Boost die to the next Resilience check made within 1 hour. Restores 1 Sanity.",
      "buy_price": 1,
      "sell_price": 1,
      "rarity": 0,
      "encumbrance": 0,
      "tags": ["All"],
      "type": "Object",
      "variants": []
    },
    {
      "name": "Level Key",
      "description": "Cast-iron keys that resemble 20th century keys but with unique runic symbols engraved on rectangular labels attached to the handle.",
      "mechanical_effect": "Opens any lock within the specified level. Provides access to designated level through Hub doors. Consumed upon Hub use.",
      "buy_price": 500,
      "sell_price": 125,
      "rarity": 9,
      "encumbrance": 0,
      "tags": ["All"],
      "type": "Object",
      "variants": []
    },

    // ===== MUNDANE OBJECTS =====
    {
      "name": "Climbing Rope (50ft)",
      "description": "A durable nylon rope with reinforced braiding. Rated for 500 lbs and includes a carabiner clip.",
      "mechanical_effect": "Can be used to climb or descend vertical surfaces. Athletics check difficulty based on surface. May be used to tie up targets with a successful Coordination check opposed by target's Athletics or Coordination. Can support up to 500 lbs of weight.",
      "buy_price": 25,
      "sell_price": 6,
      "encumbrance": 2,
      "rarity": 2,
      "tags": ["Common", "Outdoors", "Urban", "Safe"],
      "type": "Mundane Object"
    },
    {
      "name": "Gas Canister",
      "description": "A red pressurized metal canister filled with flammable propane. Warning labels are faded but still legible.",
      "mechanical_effect": "Can be used as improvised fuel for 10 hours of burning. If punctured or shot, makes an Average (dd) Resilience check for everyone within short range or suffer 8 wounds and Burn 2. Can be thrown at short range as an improvised explosive.",
      "buy_price": 35,
      "sell_price": 8,
      "encumbrance": 3,
      "rarity": 3,
      "tags": ["Dangerous", "Urban", "Indoors"],
      "type": "Mundane Object"
    },
    {
      "name": "Medkit",
      "description": "A white plastic case with a red cross. Contains bandages, antiseptic, painkillers, and basic medical supplies.",
      "mechanical_effect": "3 uses. Allows Medicine checks to heal wounds outside of combat. Add 2 boost dice to Medicine checks when using this kit. Each use heals 1 wound plus 1 additional wound per success.",
      "buy_price": 100,
      "sell_price": 25,
      "encumbrance": 1,
      "rarity": 3,
      "tags": ["Safe", "Indoors", "Urban", "Common"],
      "type": "Mundane Object"
    },

    // ===== WEAPONS =====
    {
      "name": "Plasma Cutter",
      "description": "An industrial tool repurposed as a weapon. Glows blue-white when activated and emits a high-pitched whine.",
      "damage": 6,
      "critical": 3,
      "range": "Engaged",
      "encumbrance": 3,
      "hardpoints": 2,
      "rarity": 4,
      "buy_price": 275,
      "sell_price": 68,
      "skill": "Melee",
      "equipmentTraits": "Burn 2, Pierce 2",
      "extraEffect": "Once per encounter, may spend 2 advantages to superheat the blade, causing all damage from this attack to ignore soak.",
      "equippedTo": "One-Handed",
      "repairSkill": "Mechanics",
      "set": null,
      "tags": ["Sci-Fi", "Industrial", "Dangerous"],
      "type": "Weapon"
    },
    {
      "name": "Compound Bow",
      "description": "A modern hunting bow with pulley system and fiber optic sights. Lightweight carbon fiber construction.",
      "damage": 7,
      "critical": 3,
      "range": "Long",
      "encumbrance": 3,
      "hardpoints": 3,
      "rarity": 3,
      "buy_price": 180,
      "sell_price": 45,
      "skill": "Ranged",
      "equipmentTraits": "Prepare 1, Cumbersome 2, Limited Ammo 1",
      "extraEffect": "When aiming, add an additional boost die to the attack. Arrows can be retrieved and reused on a successful Perception check.",
      "equippedTo": "Two-Handed",
      "repairSkill": "Mechanics",
      "set": "Wilderness Survival Kit",
      "tags": ["Modern", "Outdoors", "Hunting"],
      "type": "Weapon"
    },
    {
      "name": "Stun Baton",
      "description": "A black polymer baton with electrical discharge nodes at the striking end. Emits crackling blue sparks when activated.",
      "damage": 4,
      "critical": 5,
      "range": "Engaged",
      "encumbrance": 2,
      "hardpoints": 1,
      "rarity": 4,
      "buy_price": 150,
      "sell_price": 37,
      "skill": "Melee",
      "equipmentTraits": "Stun 3, Disorient 2, Stun Damage",
      "extraEffect": "Once per session, may overcharge the baton to increase Stun quality to 6 for one attack, but the baton becomes unusable for 2 rounds afterwards.",
      "equippedTo": "One-Handed",
      "repairSkill": "Mechanics",
      "set": "Security Equipment",
      "tags": ["Modern", "Law Enforcement", "Urban", "Safe"],
      "type": "Weapon"
    },

    // ===== ARMOR =====
    {
      "name": "Reinforced Kevlar Vest",
      "description": "A black tactical vest with ceramic plate inserts and adjustable straps. Shows signs of wear but remains structurally sound.",
      "melee_defense": 0,
      "ranged_defense": 1,
      "soak": 2,
      "encumbrance": 3,
      "hardpoints": 2,
      "rarity": 5,
      "buy_price": 450,
      "sell_price": 112,
      "equippedTo": "Chest",
      "repairSkill": "Mechanics",
      "equipmentTraits": null,
      "extraEffect": "Once per session, may reduce one Critical Injury result by 20 (to a minimum of 01). When this effect is used, one ceramic plate shatters and must be replaced.",
      "set": "Tactical Operations",
      "tags": ["Modern", "Military", "Urban", "Safe"],
      "type": "Armor"
    },
    {
      "name": "Spectral Warding Circlet",
      "description": "An ornate silver circlet etched with glowing runes that pulse with ethereal light. The metal feels cold to the touch.",
      "melee_defense": 1,
      "ranged_defense": 1,
      "soak": 0,
      "encumbrance": 0,
      "hardpoints": 1,
      "rarity": 8,
      "buy_price": 1200,
      "sell_price": 300,
      "equippedTo": "Head",
      "repairSkill": "Arcana",
      "equipmentTraits": null,
      "extraEffect": "Grants 2 boost dice to all Discipline checks made to resist fear or mental effects. Wearer can see invisible entities within short range and may spend 2 strain to project a mental shield that upgrades the difficulty of the next incoming mental attack once per encounter.",
      "set": "Archmage's Regalia",
      "tags": ["Fantasy", "Magic", "Rare", "Indoors"],
      "type": "Armor"
    },
    {
      "name": "Riot Shield",
      "description": "A transparent polycarbonate shield with reinforced edges and a padded grip handle. Scratched but still provides excellent protection.",
      "melee_defense": 2,
      "ranged_defense": 2,
      "soak": 0,
      "encumbrance": 4,
      "hardpoints": 1,
      "rarity": 4,
      "buy_price": 300,
      "sell_price": 75,
      "equippedTo": "Off-Hand",
      "repairSkill": "Mechanics",
      "equipmentTraits": "Deflection 1, Defensive 1",
      "extraEffect": "May use a maneuver to provide cover to one ally at engaged range until the start of your next turn. That ally gains the benefit of your melee and ranged defense.",
      "set": null,
      "tags": ["Modern", "Police", "Urban", "Common"],
      "type": "Armor"
    }
  ];

  const showToast = (message, severity = 'success') => {
    setToast({ open: true, message, severity });
  };

  const hideToast = () => {
    setToast({ ...toast, open: false });
  };

  const addData = async () => {
    try {
      for(let i = 0; i < data.length; i++) {
        const itemData = {
          name: data[i].name,
          description: data[i].description,
          buy_price: data[i].buy_price,
          sell_price: data[i].sell_price,
          rarity: data[i].rarity,
          encumbrance: data[i].encumbrance,
          tags: data[i].tags,
          type: data[i].type
        };

        // Add common optional fields
        if (data[i].variants) itemData.variants = data[i].variants;

        // Type-specific fields
        if (data[i].type === "Object" || data[i].type === "Mundane Object") {
          if (data[i].mechanical_effect) itemData.mechanical_effect = data[i].mechanical_effect;
        }

        if (data[i].type === "Weapon") {
          itemData.damage = data[i].damage;
          itemData.critical = data[i].critical;
          itemData.range = data[i].range;
          itemData.skill = data[i].skill;
          if (data[i].hardpoints !== undefined) itemData.hardpoints = data[i].hardpoints;
          if (data[i].equipmentTraits) itemData.equipmentTraits = data[i].equipmentTraits;
          if (data[i].extraEffect) itemData.extraEffect = data[i].extraEffect;
          if (data[i].equippedTo) itemData.equippedTo = data[i].equippedTo;
          if (data[i].repairSkill) itemData.repairSkill = data[i].repairSkill;
          if (data[i].set) itemData.set = data[i].set;
        }

        if (data[i].type === "Armor") {
          itemData.melee_defense = data[i].melee_defense;
          itemData.ranged_defense = data[i].ranged_defense;
          itemData.soak = data[i].soak;
          if (data[i].hardpoints !== undefined) itemData.hardpoints = data[i].hardpoints;
          if (data[i].equipmentTraits) itemData.equipmentTraits = data[i].equipmentTraits;
          if (data[i].extraEffect) itemData.extraEffect = data[i].extraEffect;
          if (data[i].equippedTo) itemData.equippedTo = data[i].equippedTo;
          if (data[i].repairSkill) itemData.repairSkill = data[i].repairSkill;
          if (data[i].set) itemData.set = data[i].set;
        }

        await setDoc(doc(db, 'Objects', data[i].name), itemData);
      }
      showToast(`Successfully added ${data.length} items!`);
    } catch (error) {
      showToast('Error adding item data', 'error');
      console.error(error);
    }
  };

  const getObjectsFromDB = () => {
    const q = query(collection(db, 'Objects'), orderBy("name", "asc"));
    const unsub = onSnapshot(q, (querySnapshot) => {
      const queryData = [];
      querySnapshot.forEach((doc) => {
        queryData.push(doc.data());
      });
      setObjects(queryData);
      setLoading(false);
    });

    return () => { unsub(); };
  };

  const withinParameters = (object) => {
    const matchesName = object.name.toUpperCase().includes(objectName.toUpperCase()) || objectName === '';
    const matchesRarity = object.rarity === parseInt(rarity) || rarity === '-1';
    const matchesBuyPrice = (buyPrice === '1000' && object.buy_price >= 1000) || 
                            (buyPrice !== '1000' && buyPrice !== '-1' && object.buy_price <= parseInt(buyPrice)) || 
                            buyPrice === '-1';
    const matchesSellPrice = (sellPrice === '1000' && object.sell_price >= 1000) || 
                             (sellPrice !== '1000' && sellPrice !== '-1' && object.sell_price <= parseInt(sellPrice)) || 
                             sellPrice === '-1';
    const matchesType = object.type === type || type === '-1';
    
    return matchesName && matchesRarity && matchesBuyPrice && matchesSellPrice && matchesType;
  };

  const clearAllFilters = () => {
    setObjectName('');
    setBuyPrice('-1');
    setSellPrice('-1');
    setRarity('-1');
    setType('-1');
    showToast('All filters cleared');
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (objectName !== '') count++;
    if (buyPrice !== '-1') count++;
    if (sellPrice !== '-1') count++;
    if (rarity !== '-1') count++;
    if (type !== '-1') count++;
    return count;
  };

  const getFilteredObjects = () => {
    return objects.filter(object => withinParameters(object));
  };

  const openTableModal = (objectData) => {
    setTableModal({ isOpen: true, objectData });
  };

  const closeTableModal = () => {
    setTableModal({ isOpen: false, objectData: null });
  };

  useEffect(() => {
    if (localStorage.getItem("loggedIn") !== 'false') {
      getObjectsFromDB();
    }
  }, []);

  if (localStorage.getItem("loggedIn") === 'false') {
    return <NotLoggedIn />;
  }

  const DisplayObjects = () => {
    const filteredObjects = getFilteredObjects();

    return (
      <div className="space-y-6">
        {filteredObjects.length === 0 ? (
          <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-12 text-center">
            <svg className="w-16 h-16 text-gray-500 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path>
            </svg>
            <h3 className="text-xl font-semibold text-white mb-2">No objects found</h3>
            <p className="text-gray-400 mb-4">Try adjusting your search criteria to find more items</p>
            <button
              onClick={clearAllFilters}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Results Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <svg className="w-6 h-6 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path>
                </svg>
                <h2 className="text-xl font-bold text-white">
                  Found {filteredObjects.length} item{filteredObjects.length !== 1 ? 's' : ''}
                </h2>
              </div>
              <span className="bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-sm font-bold">
                {objects.length} total
              </span>
            </div>

            {/* Objects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredObjects.map((object, index) => (
                <div key={index} className="bg-black/20 backdrop-blur-lg rounded-xl border border-white/10 p-1 hover:bg-black/30 transition-all duration-300">
                  <ObjectItem currObject={object} mainPage={true} onOpenTable={openTableModal} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const FilterChip = ({ label, onDelete }) => (
    <div className="inline-flex items-center space-x-2 bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm border border-purple-500/30">
      <span>{label}</span>
      <button
        onClick={onDelete}
        className="text-purple-400 hover:text-purple-200 transition-colors"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
        </svg>
      </button>
    </div>
  );

  const FilterSection = () => (
    <div className="space-y-6">
      {/* Advanced Filters Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Buy Price (Max)</label>
          <select
            value={buyPrice}
            onChange={(e) => setBuyPrice(e.target.value)}
            className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          >
            <option value="-1" className="bg-gray-800">Any Price</option>
            <option value="1" className="bg-gray-800">≤ 1</option>
            <option value="5" className="bg-gray-800">≤ 5</option>
            <option value="10" className="bg-gray-800">≤ 10</option>
            <option value="25" className="bg-gray-800">≤ 25</option>
            <option value="50" className="bg-gray-800">≤ 50</option>
            <option value="100" className="bg-gray-800">≤ 100</option>
            <option value="250" className="bg-gray-800">≤ 250</option>
            <option value="500" className="bg-gray-800">≤ 500</option>
            <option value="1000" className="bg-gray-800">≥ 1000</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Sell Price (Max)</label>
          <select
            value={sellPrice}
            onChange={(e) => setSellPrice(e.target.value)}
            className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          >
            <option value="-1" className="bg-gray-800">Any Price</option>
            <option value="1" className="bg-gray-800">≤ 1</option>
            <option value="5" className="bg-gray-800">≤ 5</option>
            <option value="10" className="bg-gray-800">≤ 10</option>
            <option value="25" className="bg-gray-800">≤ 25</option>
            <option value="50" className="bg-gray-800">≤ 50</option>
            <option value="100" className="bg-gray-800">≤ 100</option>
            <option value="250" className="bg-gray-800">≤ 250</option>
            <option value="500" className="bg-gray-800">≤ 500</option>
            <option value="1000" className="bg-gray-800">≥ 1000</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Rarity Level</label>
          <select
            value={rarity}
            onChange={(e) => setRarity(e.target.value)}
            className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          >
            <option value="-1" className="bg-gray-800">Any Rarity</option>
            <option value="0" className="bg-gray-800">Common (0)</option>
            <option value="1" className="bg-gray-800">Uncommon (1)</option>
            <option value="2" className="bg-gray-800">Rare (2)</option>
            <option value="3" className="bg-gray-800">Epic (3)</option>
            <option value="4" className="bg-gray-800">Legendary (4)</option>
            <option value="5" className="bg-gray-800">Mythic (5)</option>
            <option value="6" className="bg-gray-800">Divine (6)</option>
            <option value="7" className="bg-gray-800">Cosmic (7)</option>
            <option value="8" className="bg-gray-800">Transcendent (8)</option>
            <option value="9" className="bg-gray-800">Omnipotent (9)</option>
            <option value="10" className="bg-gray-800">Absolute (10)</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Item Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          >
            <option value="-1" className="bg-gray-800">Any Type</option>
            <option value="Object" className="bg-gray-800">Object</option>
            <option value="Mundane Object" className="bg-gray-800">Mundane Object</option>
            <option value="Weapon" className="bg-gray-800">Weapon</option>
            <option value="Armor" className="bg-gray-800">Armor</option>
          </select>
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
            {objectName && (
              <FilterChip
                label={`Name: "${objectName}"`}
                onDelete={() => setObjectName('')}
              />
            )}
            {buyPrice !== '-1' && (
              <FilterChip
                label={`Buy Price: ${buyPrice === '1000' ? '≥ 1000' : '≤ ' + buyPrice}`}
                onDelete={() => setBuyPrice('-1')}
              />
            )}
            {sellPrice !== '-1' && (
              <FilterChip
                label={`Sell Price: ${sellPrice === '1000' ? '≥ 1000' : '≤ ' + sellPrice}`}
                onDelete={() => setSellPrice('-1')}
              />
            )}
            {rarity !== '-1' && (
              <FilterChip
                label={`Rarity: ${rarity}`}
                onDelete={() => setRarity('-1')}
              />
            )}
            {type !== '-1' && (
              <FilterChip
                label={`Type: ${type}`}
                onDelete={() => setType('-1')}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900">
      <div className="w-full px-4 py-6 space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-900/50 to-green-900/50 backdrop-blur-lg rounded-2xl border border-white/10 p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center">
                <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path>
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Item Collection</h1>
                <p className="text-emerald-300">Browse all items: Objects, Weapons, Armor, and Mundane Objects</p>
              </div>
            </div>
            
            {localStorage.getItem('loggedIn')?.toUpperCase() === 'ADMIN' && (
              <button 
                onClick={addData}
                className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"></path>
                </svg>
                <span>Add Data</span>
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-12">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-400 mb-4"></div>
              <h3 className="text-xl font-semibold text-white mb-2">Loading item collection...</h3>
              <p className="text-gray-400">Please wait while we fetch the data</p>
            </div>
          </div>
        ) : objects.length > 0 ? (
          <>
            {/* Search and Filter Section */}
            <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600/20 to-indigo-600/20 p-4 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <svg className="w-6 h-6 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3 7v10a2 2 0 002 2h14l-2-2H5V7h14V5a2 2 0 00-2-2H5a2 2 0 00-2 2v2z"></path>
                      <path d="M21 7H3v2h18V7z"></path>
                    </svg>
                    <h2 className="text-xl font-bold text-white">Search & Filter</h2>
                    {getActiveFilterCount() > 0 && (
                      <span className="bg-purple-500/30 text-purple-300 px-2 py-1 rounded-full text-xs font-bold">
                        {getActiveFilterCount()} active
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-sm font-bold">
                      {getFilteredObjects().length} shown
                    </span>
                    <button 
                      onClick={() => setFiltersOpen(!filtersOpen)}
                      className="md:hidden bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 p-2 rounded-lg transition-colors"
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
                    placeholder="Search by item name..."
                    value={objectName}
                    onChange={(e) => setObjectName(e.target.value)}
                    className="w-full bg-white/5 border border-white/20 rounded-xl pl-12 pr-12 py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-lg"
                  />
                  {objectName && (
                    <button
                      onClick={() => setObjectName('')}
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
            <DisplayObjects />
          </>
        ) : (
          <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-12">
            <div className="flex flex-col items-center justify-center text-center">
              <svg className="w-16 h-16 text-gray-500 mb-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path>
              </svg>
              <h3 className="text-xl font-semibold text-white mb-2">No item data available</h3>
              <p className="text-gray-400">There are currently no items in the database</p>
            </div>
          </div>
        )}

        {/* Mobile Filter Fab */}
        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          className="md:hidden fixed bottom-6 right-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 transform hover:scale-110"
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

      {/* Draggable Table Modal */}
      <DraggableTableModal 
        isOpen={tableModal.isOpen}
        onClose={closeTableModal}
        objectData={tableModal.objectData}
      />
    </div>
  );
}