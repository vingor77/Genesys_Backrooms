import React, { useState, useEffect } from 'react';
import { collection, doc, onSnapshot, query, updateDoc, setDoc } from "firebase/firestore";
import db from '../Components/firebase';
import Person from "../Components/person";
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

// Sample data for upload
const peopleData = [
  {
    "name": "Marcus 'The Iron Hand' Volkmar",
    "aliases": ["The Iron Hand", "Lord Volkmar", "Marcus the Merciless"],
    "age": "47",
    "gender": "Male",
    "global_status": "Alive",
    "appearance": "A scarred veteran with a mechanical right hand forged from dark steel. Weather-beaten face, close-cropped gray hair, and piercing blue eyes. Wears a tattered black cloak over chainmail.",
    "height": "6'2\"",
    "distinguishing_features": "Mechanical right hand, scar across left eye, burns on neck",
    "personality": "Gruff and pragmatic with a strict code of honor. Doesn't suffer fools but is fiercely loyal to those who earn his trust.",
    "background": "Former royal guard turned mercenary after a tragic betrayal. Lost his hand in the Siege of Blackstone.",
    "relationships": "Mentor to Elena Stormwind, sworn enemy of Duke Malachar",
    
    // Genesys Character Aspects
    "strength": "Unwavering Loyalty - Once Marcus gives his word, he will die before breaking it.",
    "flaw": "Overprotective - Will put himself in danger to protect those he cares about, even when tactically unsound.",
    "desire": "Redemption - Seeks to atone for past war crimes by protecting the innocent.",
    "fear": "Betrayal - Haunted by the betrayal that cost him his hand and his honor.",
    
    "threat_level": 6,
    
    // Attributes
    "brawn": 4,
    "agility": 3,
    "intellect": 2,
    "cunning": 3,
    "willpower": 4,
    "presence": 3,
    
    // Derived Stats
    "wounds_threshold": 18,
    "strain_threshold": 14,
    "soak": 6,
    "melee_defense": 2,
    "ranged_defense": 1,
    
    // Skills (categorized)
    "combat_skills": "Melee 4, Brawl 3, Ranged (Heavy) 2",
    "social_skills": "Coercion 3, Leadership 4, Negotiation 2",
    "general_skills": "Athletics 3, Resilience 4, Discipline 3, Perception 3, Cool 3, Vigilance 2, Survival 2, Warfare 3",
    
    // Talents
    "talents": "Toughened (Rank 2): +2 Wound Threshold\nAdversary (Rank 2): Upgrade difficulty of attacks targeting this character twice\nInspiring Rhetoric: Can inspire allies, removing strain\nParry (Rank 3): When hit by melee attack, suffer 3 strain to reduce damage by 5",
    
    // Abilities
    "abilities": "Iron Grip: The mechanical hand cannot be disarmed and adds +1 damage to melee attacks\nBattle Commander: Once per encounter, all allies within medium range gain 1 boost die to their next attack",
    
    // Combat Info
    "combat_style": "Defensive Bruiser",
    "combat_description": "Fights with calculated aggression, using superior reach and armor to control engagement distance. Prefers to tank hits while protecting allies.",
    "preferred_tactics": "Engages strongest enemy first to draw aggro, uses Parry to mitigate damage, coordinates allies with Battle Commander",
    
    // Equipment
    "equipment": "Reinforced Chainmail (Soak 3, Melee Defense 1, Ranged Defense 1, Cumbersome 2)\nMastercrafted Longsword (Damage 8, Crit 2, Superior, Defensive 1)\nHeavy Crossbow (Damage 9, Crit 3, Range Long, Cumbersome 3, Prepare 1)\nHealing Poultice (3 uses)\nRope (50 ft)\nMilitary Rations (1 week)\nSpyglass\nSignal Horn",
    
    "potential_loot": "Mastercrafted Longsword, Reinforced Chainmail, Mechanical Hand Blueprint (Rare crafting schematic), Letter of Marque (grants access to Black Company resources)",
    
    "dm_notes": "Can become powerful ally or dangerous enemy depending on player choices. Respects strength and honor above all else. Has connections to underground resistance networks.",
    
    "tags": ["Combat", "Mercenary", "Human", "Ally", "Mentor", "Military"],
    "image_url": "https://cdn.discordapp.com/attachments/910288280354967624/1057701506964537434/Screenshot_20191010-0722191.png?ex=69175d4a&is=69160bca&hm=95b6d3c5584bb834aa687e12fb5ddf9cc3992e4b6091380d9f1bf823a7d4a64f&"
  },
  {
    "name": "Elara Moonwhisper",
    "aliases": ["The Seer", "Lady of Visions", "Starlight Prophet"],
    "age": "312",
    "gender": "Female",
    "global_status": "Alive",
    "appearance": "Ethereally beautiful with silver hair that seems to shimmer like starlight. Pale skin with faint glowing runes. Wears flowing white and silver robes adorned with celestial symbols.",
    "height": "5'8\"",
    "distinguishing_features": "Eyes that shift between silver and violet, glowing runes on forearms, always barefoot",
    "personality": "Mysterious and cryptic, speaks in riddles and prophecies. Compassionate but detached, seeing the bigger picture across timelines.",
    "background": "Ancient elf who gained prophetic powers after touching a fallen star. Has witnessed empires rise and fall.",
    "relationships": "Advisor to Queen Isadora, knows the true identity of the Shadow King",
    
    // Genesys Character Aspects
    "strength": "Prophetic Vision - Can see glimpses of possible futures, giving her strategic advantage.",
    "flaw": "Bound by Prophecy - Cannot directly interfere with events she has foreseen, even to save lives.",
    "desire": "Preservation - Wants to guide mortals away from catastrophic futures and preserve the timeline.",
    "fear": "Blind Fate - Terrified of losing her gift and being unable to prevent disaster.",
    
    "threat_level": 7,
    
    // Attributes
    "brawn": 2,
    "agility": 3,
    "intellect": 5,
    "cunning": 4,
    "willpower": 5,
    "presence": 4,
    
    // Derived Stats
    "wounds_threshold": 12,
    "strain_threshold": 18,
    "soak": 2,
    "melee_defense": 0,
    "ranged_defense": 2,
    
    // Skills (categorized)
    "combat_skills": "None",
    "social_skills": "Charm 3, Negotiation 3, Deception 2",
    "general_skills": "Knowledge (Arcana) 5, Knowledge (Lore) 4, Perception 4, Discipline 5, Cool 4, Vigilance 4",
    
    // Talents
    "talents": "Force Rating 3: Can use Force powers\nForewarning (Rank 2): Add 2 boost dice to initiative checks\nSense Danger: Once per session, may add 2 boost dice to any check to avoid danger\nKnowledge Specialization (Prophecy): Remove 2 setback dice from prophecy-related checks",
    
    // Abilities
    "abilities": "Prophetic Visions: Can see glimpses of possible futures. Once per session, may declare one event will or will not happen\nThird Eye: Upgrade all Perception checks twice\nTimeless: Immune to aging effects and age-related penalties",
    
    // Combat Info
    "combat_style": "Support / Controller",
    "combat_description": "Avoids direct combat, using divination magic to predict and counter enemy moves. Buffs allies and debuffs enemies through prophecy.",
    "preferred_tactics": "Warns allies of incoming attacks, uses confusion and illusion spells, flees if directly threatened",
    
    // Equipment
    "equipment": "Enchanted Robes (Soak 2, Ranged Defense 2)\nCeremonial Staff (Damage 5, Crit 5, Defensive 1, Disorient 2)\nCrystal Orb of Seeing\nStar Charts\nDivination Bones\nRitual Incense\nAncient Tomes (3)\nHealing Poultice (2 uses)",
    
    "potential_loot": "Crystal Orb of Seeing, Enchanted Robes, Prophecy Scrolls (3), Star Fragment (magical component)",
    
    "dm_notes": "Use her to drop hints about future plot points. Prophecies should be cryptic but accurate. Can become crucial ally in final arc. Players may become frustrated with her cryptic nature - this is intentional.",
    
    "tags": ["Magic", "Elf", "Oracle", "Support", "Knowledge", "Neutral"],
    "image_url": null
  },
  {
    "name": "Grimjaw the Breaker",
    "aliases": ["The Beast", "Pit Champion", "Karn's Fury"],
    "age": "29",
    "gender": "Male",
    "global_status": "Alive",
    "appearance": "Massive and heavily muscled with green-gray skin covered in scars and tattoos. Broken tusks, scarred face, and one milky white eye. Wears minimal armor to show off battle scars.",
    "height": "6'8\"",
    "distinguishing_features": "Broken tusks, blind in left eye, tribal tattoos covering torso, missing half of right ear",
    "personality": "Brutal and straightforward. Lives for combat and respects only strength. Surprisingly honorable in his own way - keeps his word and fights fair.",
    "background": "Sold into slavery as a child, became a legendary pit fighter. Undefeated in 73 matches. Dreams of freedom.",
    "relationships": "Owned by Lord Corvus, befriended by healer Mira who tends his wounds",
    
    // Genesys Character Aspects
    "strength": "Unstoppable Force - Once Grimjaw commits to an attack, nothing can stop him. Immune to fear and intimidation.",
    "flaw": "Simple Mind - Easily outsmarted by clever tactics. Low cunning makes him vulnerable to deception.",
    "desire": "Freedom - Earn enough coin to buy his freedom and return to his clan with honor.",
    "fear": "Enslavement Forever - Terrified he will die in the arena before earning his freedom.",
    
    "threat_level": 7,
    
    // Attributes
    "brawn": 5,
    "agility": 2,
    "intellect": 1,
    "cunning": 2,
    "willpower": 4,
    "presence": 2,
    
    // Derived Stats
    "wounds_threshold": 24,
    "strain_threshold": 12,
    "soak": 8,
    "melee_defense": 1,
    "ranged_defense": 0,
    
    // Skills (categorized)
    "combat_skills": "Brawl 5, Melee 4, Ranged (Light) 1",
    "social_skills": "Coercion 4, Intimidation 5",
    "general_skills": "Athletics 4, Resilience 5, Survival 2, Perception 2",
    
    // Talents
    "talents": "Toughened (Rank 3): +3 Wound Threshold\nDurable (Rank 2): Can take 2 additional Critical Injuries before dying\nFrenzied Attack (Rank 2): May suffer strain to add damage to melee attacks\nKnockdown: Can spend advantage to knock opponent prone\nLethal Blows (Rank 2): +20 to Critical Injury results",
    
    // Abilities
    "abilities": "Pit Fighter: Add automatic advantage to all combat checks in enclosed spaces\nUnstoppable: Once per session, when reduced to 0 wounds, remain standing with 1 wound for remainder of encounter\nSavage Roar: As a maneuver, can make Intimidation check to frighten weaker enemies (minions and rivals)",
    
    // Combat Info
    "combat_style": "Aggressive Striker",
    "combat_description": "Pure offense, overwhelming enemies with raw strength and brutality. Takes hits to deliver devastating counterattacks.",
    "preferred_tactics": "Charges strongest opponent, uses Frenzied Attack for maximum damage, knocks down enemies and executes them",
    
    // Equipment
    "equipment": "Gladiator's Harness (Soak 3, Melee Defense 1, Cumbersome 1)\nMassive Two-Handed Axe (Damage 10, Crit 3, Vicious 2, Cumbersome 3, Two-Handed)\nSpiked Gauntlets (Damage 7, Crit 4, Knockdown, Brawl)\nArena Trophy Belt\nOil for Weapons\nWater Skin\nMira's Good Luck Charm",
    
    "potential_loot": "Massive Two-Handed Axe, Gladiator's Harness, Arena Championship Belt (worth 500 credits), Freedom Papers (if helped to escape)",
    
    "dm_notes": "Can be recruited as muscle if players help free him. Extremely loyal once trust is earned. Use as intimidating presence or moral dilemma (enslaved but deadly). If Mira is threatened, he will go berserk. Low intellect means he can be tricked easily.",
    
    "tags": ["Combat", "Half-Orc", "Gladiator", "Aggressive", "Enslaved", "Melee"],
    "image_url": "https://cdn.discordapp.com/attachments/910288280354967624/1048794256942305347/91060736_p0_master1200.png?ex=69174284&is=6915f104&hm=fb8b4f7ebe6c33177de00cdae77d2a98371ecfadc6e552592af9ac35d263801b&"
  }
];

export default function PeopleOfInterest() {
  const [people, setPeople] = useState([]);
  const [name, setName] = useState('');
  const [factionFilter, setFactionFilter] = useState('');
  const [threatFilter, setThreatFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [speciesFilter, setSpeciesFilter] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const [activePerson, setActivePerson] = useState(null);
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

    const q = query(collection(db, 'PeopleOfInterest'));

    const unsub = onSnapshot(q, (querySnapshot) => {
      const queryData = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const sessionStatus = data.sessionStatus?.[sessionId] || {};
        const sessionVisibility = data.sessionVisibility || {};
        
        queryData.push({ 
          docId: doc.id, 
          ...data,
          currentSessionStatus: sessionStatus.status || data.global_status || 'Unknown',
          currentSessionNotes: sessionStatus.notes || '',
          currentSessionRelationship: sessionStatus.relationship || 'Unknown',
          hiddenInCurrentSession: sessionVisibility[sessionId] === false
        });
      });
      
      queryData.sort((a, b) => a.name.localeCompare(b.name));
      
      setPeople(queryData);
      setLoading(false);
    }, (error) => {
      console.error('Error loading people:', error);
      showToast('Error loading people', 'error');
      setLoading(false);
    });

    return () => { unsub(); };
  };

  const uploadPeopleData = async () => {
    if (!userIsDM) {
      showToast('Only DMs can upload people data', 'error');
      return;
    }

    const confirmUpload = window.confirm(
      `This will add ${peopleData.length} people to the global database. Continue?`
    );

    if (!confirmUpload) return;

    try {
      for (let i = 0; i < peopleData.length; i++) {
        await setDoc(doc(db, 'PeopleOfInterest', peopleData[i].name), {
          ...peopleData[i],
          sessionVisibility: {},
          sessionStatus: {}
        });
      }
      
      showToast(`Successfully added ${peopleData.length} people!`, 'success');
    } catch (error) {
      showToast('Error uploading people data', 'error');
      console.error('Upload error:', error);
    }
  };

  const getFilteredPeople = () => {
    return people.filter((person) => {
      // Status filtering for dead people
      if (person.currentSessionStatus === 'Dead' && !userIsDM) {
        return false; // Players can't see dead people
      }

      // Visibility check
      const visibilityCheck = userIsDM ? true : !person.hiddenInCurrentSession;
      
      // Status filter
      const statusCheck = !statusFilter || person.currentSessionStatus === statusFilter;
      
      return (
        visibilityCheck &&
        statusCheck &&
        (!name || person.name.toUpperCase().includes(name.toUpperCase()) || 
         (person.personality && person.personality.toUpperCase().includes(name.toUpperCase())) ||
         (person.background && person.background.toUpperCase().includes(name.toUpperCase()))) &&
        (!factionFilter || person.faction === factionFilter) &&
        (!threatFilter || person.threat_level === parseInt(threatFilter)) &&
        (!speciesFilter || person.species === speciesFilter)
      );
    });
  };

  const updatePersonStatus = async (person, newStatus, notes = '') => {
    if (!userIsDM || !sessionId) return;
    
    try {
      const currentSessionStatus = person.sessionStatus || {};
      const updatedSessionStatus = {
        ...currentSessionStatus,
        [sessionId]: {
          status: newStatus,
          notes: notes,
          relationship: currentSessionStatus[sessionId]?.relationship || 'Unknown',
          last_updated: new Date().toISOString()
        }
      };

      // If marked as dead, automatically hide from players
      let updatedVisibility = person.sessionVisibility || {};
      if (newStatus === 'Dead') {
        updatedVisibility = {
          ...updatedVisibility,
          [sessionId]: false
        };
      }

      await updateDoc(doc(db, 'PeopleOfInterest', person.docId), {
        sessionStatus: updatedSessionStatus,
        sessionVisibility: updatedVisibility
      });
      
      showToast(`${person.name} status updated to ${newStatus}`, 'success');
    } catch (error) {
      console.error('Error updating status:', error);
      showToast('Error updating person status', 'error');
    }
  };

  const togglePersonVisibility = async (person) => {
    if (!userIsDM || !sessionId) return;
    
    try {
      const currentVisibility = person.sessionVisibility || {};
      const newVisibility = {
        ...currentVisibility,
        [sessionId]: currentVisibility[sessionId] === false ? true : false
      };

      await updateDoc(doc(db, 'PeopleOfInterest', person.docId), {
        sessionVisibility: newVisibility
      });
      
      const action = newVisibility[sessionId] === false ? 'hidden' : 'revealed';
      showToast(`${person.name} ${action} for this session`, 'success');
    } catch (error) {
      console.error('Error toggling visibility:', error);
      showToast('Error updating person visibility', 'error');
    }
  };

  const clearAllFilters = () => {
    setName('');
    setFactionFilter('');
    setThreatFilter('');
    setStatusFilter('');
    setSpeciesFilter('');
    showToast('All filters cleared');
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (name !== '') count++;
    if (factionFilter !== '') count++;
    if (threatFilter !== '') count++;
    if (statusFilter !== '') count++;
    if (speciesFilter !== '') count++;
    return count;
  };

  const getUniqueFactions = () => {
    return [...new Set(people.map(p => p.faction).filter(Boolean))].sort();
  };

  const getUniqueSpecies = () => {
    return [...new Set(people.map(p => p.species).filter(Boolean))].sort();
  };

  if (localStorage.getItem("loggedIn") === 'false') {
    return <NotLoggedIn />;
  }

  const FilterChip = ({ label, onDelete }) => (
    <div className="inline-flex items-center space-x-2 bg-pink-500/20 text-pink-300 px-3 py-1 rounded-full text-sm border border-pink-500/30">
      <span>{label}</span>
      <button onClick={onDelete} className="text-pink-400 hover:text-pink-200 transition-colors">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
        </svg>
      </button>
    </div>
  );

  const DisplayItems = () => {
    const filteredPeople = getFilteredPeople();

    if (filteredPeople.length === 0) {
      return (
        <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-12 text-center">
          <svg className="w-16 h-16 text-gray-500 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"></path>
          </svg>
          <h3 className="text-xl font-semibold text-white mb-2">No people found</h3>
          <p className="text-gray-400 mb-4">Try adjusting your search criteria</p>
          {getActiveFilterCount() > 0 && (
            <button
              onClick={clearAllFilters}
              className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
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
            <svg className="w-6 h-6 text-pink-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"></path>
            </svg>
            <h2 className="text-xl font-bold text-white">
              Found {filteredPeople.length} person{filteredPeople.length !== 1 ? 's' : ''}
            </h2>
          </div>
          <span className="bg-pink-500/20 text-pink-300 px-3 py-1 rounded-full text-sm font-bold">
            {people.length} total
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredPeople.map((person) => (
            <div key={person.docId} className="bg-black/20 backdrop-blur-lg rounded-xl border border-white/10 p-1 hover:bg-black/30 transition-all duration-300">
              <Person 
                currPerson={person}
                onShowDetails={setActivePerson}
                onUpdateStatus={updatePersonStatus}
                onToggleVisibility={togglePersonVisibility}
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
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-5 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Faction</label>
          <select
            value={factionFilter}
            onChange={(e) => setFactionFilter(e.target.value)}
            className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
          >
            <option value="" className="bg-gray-800">Any Faction</option>
            {getUniqueFactions().map(faction => (
              <option key={faction} value={faction} className="bg-gray-800">{faction}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Species</label>
          <select
            value={speciesFilter}
            onChange={(e) => setSpeciesFilter(e.target.value)}
            className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
          >
            <option value="" className="bg-gray-800">Any Species</option>
            {getUniqueSpecies().map(species => (
              <option key={species} value={species} className="bg-gray-800">{species}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Threat Level</label>
          <select
            value={threatFilter}
            onChange={(e) => setThreatFilter(e.target.value)}
            className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
          >
            <option value="" className="bg-gray-800">Any Threat</option>
            {[0,1,2,3,4,5,6,7,8,9,10].map(level => (
              <option key={level} value={level} className="bg-gray-800">Level {level}</option>
            ))}
          </select>
        </div>

        {userIsDM && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
            >
              <option value="" className="bg-gray-800">Any Status</option>
              <option value="Alive" className="bg-gray-800">Alive</option>
              <option value="Dead" className="bg-gray-800">Dead</option>
              <option value="Missing" className="bg-gray-800">Missing</option>
              <option value="Unknown" className="bg-gray-800">Unknown</option>
            </select>
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Actions</label>
          <button
            onClick={clearAllFilters}
            disabled={getActiveFilterCount() === 0}
            className="w-full bg-gradient-to-r from-red-600/20 to-pink-600/20 hover:from-red-600/30 hover:to-pink-600/30 disabled:from-gray-600/20 disabled:to-gray-700/20 text-red-300 disabled:text-gray-500 font-medium px-4 py-3 rounded-lg border border-red-500/30 disabled:border-gray-500/30 transition-all duration-300"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {getActiveFilterCount() > 0 && (
        <div className="flex flex-wrap gap-2">
          {name && <FilterChip label={`Name: "${name}"`} onDelete={() => setName('')} />}
          {factionFilter && <FilterChip label={`Faction: ${factionFilter}`} onDelete={() => setFactionFilter('')} />}
          {speciesFilter && <FilterChip label={`Species: ${speciesFilter}`} onDelete={() => setSpeciesFilter('')} />}
          {threatFilter && <FilterChip label={`Threat: ${threatFilter}`} onDelete={() => setThreatFilter('')} />}
          {statusFilter && <FilterChip label={`Status: ${statusFilter}`} onDelete={() => setStatusFilter('')} />}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-pink-900 to-rose-900">
      <div className="w-full px-4 py-6 space-y-6">
        
        <div className="bg-gradient-to-r from-pink-900/50 to-rose-900/50 backdrop-blur-lg rounded-2xl border border-white/10 p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center">
                <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"></path>
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">People of Interest</h1>
                <p className="text-pink-300">Track NPCs, allies, enemies, and notable individuals</p>
              </div>
            </div>
            
            {userIsDM && (
              <button 
                onClick={uploadPeopleData}
                className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"></path>
                </svg>
                <span>Upload Sample People</span>
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-12">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-400 mb-4"></div>
              <h3 className="text-xl font-semibold text-white mb-2">Loading people...</h3>
              <p className="text-gray-400">Please wait</p>
            </div>
          </div>
        ) : people.length > 0 ? (
          <>
            <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 overflow-hidden">
              <div className="bg-gradient-to-r from-pink-600/20 to-rose-600/20 p-4 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <svg className="w-6 h-6 text-pink-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path>
                    </svg>
                    <h2 className="text-xl font-bold text-white">Search & Filter</h2>
                    {getActiveFilterCount() > 0 && (
                      <span className="bg-pink-500/30 text-pink-300 px-2 py-1 rounded-full text-xs font-bold">
                        {getActiveFilterCount()} active
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="bg-pink-500/20 text-pink-300 px-3 py-1 rounded-full text-sm font-bold">
                      {getFilteredPeople().length} shown
                    </span>
                    <button 
                      onClick={() => setFiltersOpen(!filtersOpen)}
                      className="md:hidden bg-pink-600/20 hover:bg-pink-600/30 text-pink-400 p-2 rounded-lg transition-colors"
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
                    placeholder="Search by name, personality, or background..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white/5 border border-white/20 rounded-xl pl-12 pr-12 py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all text-lg"
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
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"></path>
              </svg>
              <h3 className="text-xl font-semibold text-white mb-2">No people available</h3>
              <p className="text-gray-400">Upload some people to get started</p>
            </div>
          </div>
        )}

        {/* Mobile Filter Fab */}
        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          className="md:hidden fixed bottom-6 right-6 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 transform hover:scale-110 z-40"
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

      {activePerson && (
        <PersonDetailsModal 
          person={activePerson} 
          onClose={() => setActivePerson(null)} 
          userIsDM={userIsDM}
          sessionId={sessionId}
        />
      )}
    </div>
  );
}

// Person Details Modal - EXACT MATCH TO ITEMSETS
const PersonDetailsModal = ({ person, onClose, userIsDM, sessionId }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [sessionNotes, setSessionNotes] = useState(person.sessionStatus?.[sessionId]?.dm_notes || '');
  const [isSavingNotes, setIsSavingNotes] = useState(false);

  const saveSessionNotes = async () => {
    if (!userIsDM || !sessionId) return;
    
    setIsSavingNotes(true);
    try {
      const currentSessionStatus = person.sessionStatus || {};
      const updatedSessionStatus = {
        ...currentSessionStatus,
        [sessionId]: {
          ...(currentSessionStatus[sessionId] || {}),
          dm_notes: sessionNotes,
          notes_last_updated: new Date().toISOString()
        }
      };

      await updateDoc(doc(db, 'PeopleOfInterest', person.docId), {
        sessionStatus: updatedSessionStatus
      });
      
      setTimeout(() => setIsSavingNotes(false), 500);
    } catch (error) {
      console.error('Error saving notes:', error);
      setIsSavingNotes(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm animate-fadeIn">
      {/* Modal Container - Mobile Friendly - EXACT MATCH */}
      <div className="h-full w-full flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 md:m-4 md:rounded-2xl md:border-2 md:border-white/20 md:h-auto md:max-h-[90vh] md:max-w-4xl md:mx-auto overflow-hidden">
        
        {/* Compact Header */}
        <div className="flex-shrink-0 bg-gradient-to-r from-pink-600/20 to-rose-600/20 border-b border-white/10">
          {/* Top Bar */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {person.image_url && (
                <img 
                  src={person.image_url} 
                  alt={person.name}
                  className="flex-shrink-0 w-12 h-12 rounded-full object-cover border-2 border-pink-500/50"
                />
              )}
              {!person.image_url && (
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center text-2xl border border-white/30 shadow-lg">
                  <span>👤</span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h2 className="text-lg md:text-xl font-bold text-white truncate">{person.name}</h2>
                <p className="text-pink-300 text-sm">{person.age} • {person.gender}</p>
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

          {/* Aliases */}
          {person.aliases && person.aliases.length > 0 && (
            <div className="px-4 py-2 border-b border-white/10">
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-xs text-gray-400">Known as:</span>
                {person.aliases.map((alias, idx) => (
                  <span key={idx} className="text-xs text-pink-300 bg-pink-500/20 px-2 py-1 rounded-full border border-pink-500/30">
                    {alias}
                  </span>
                ))}
              </div>
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
              {userIsDM && (
                <MobileTabButton
                  active={activeTab === 'aspects'}
                  onClick={() => setActiveTab('aspects')}
                  icon="🎭"
                  label="Aspects"
                />
              )}
              {userIsDM && (
                <MobileTabButton
                  active={activeTab === 'combat'}
                  onClick={() => setActiveTab('combat')}
                  icon="⚔️"
                  label="Combat"
                />
              )}
              {userIsDM && (
                <MobileTabButton
                  active={activeTab === 'abilities'}
                  onClick={() => setActiveTab('abilities')}
                  icon="✨"
                  label="Abilities"
                />
              )}
              {userIsDM && (
                <MobileTabButton
                  active={activeTab === 'dm'}
                  onClick={() => setActiveTab('dm')}
                  icon="📝"
                  label="DM Notes"
                />
              )}
            </div>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'overview' && (
            <PersonOverviewTab person={person} />
          )}
          {activeTab === 'aspects' && userIsDM && (
            <PersonAspectsTab person={person} />
          )}
          {activeTab === 'combat' && userIsDM && (
            <PersonCombatTab person={person} />
          )}
          {activeTab === 'abilities' && userIsDM && (
            <PersonAbilitiesTab person={person} />
          )}
          {activeTab === 'dm' && userIsDM && (
            <PersonDMNotesTab 
              person={person}
              sessionNotes={sessionNotes}
              setSessionNotes={setSessionNotes}
              saveSessionNotes={saveSessionNotes}
              isSavingNotes={isSavingNotes}
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
        ? 'bg-pink-500/30 text-pink-300 border-2 border-pink-500/50'
        : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
    }`}
  >
    <span className="mr-1">{icon}</span>
    {label}
    {count !== undefined && (
      <span className={`ml-1.5 px-1.5 py-0.5 rounded text-xs ${active ? 'bg-pink-500/40' : 'bg-white/10'}`}>
        {count}
      </span>
    )}
  </button>
);

// Person Overview Tab
const PersonOverviewTab = ({ person }) => (
  <div className="space-y-4">
    <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
      <h3 className="text-white font-bold mb-2 flex items-center">
        <span className="text-pink-400 mr-2">👁️</span>
        Appearance
      </h3>
      <p className="text-gray-300 text-sm leading-relaxed">{person.appearance}</p>
      <div className="mt-3 pt-3 border-t border-slate-700">
        <p className="text-sm text-gray-400"><strong className="text-pink-400">Height:</strong> {person.height}</p>
        <p className="text-sm text-gray-400 mt-1"><strong className="text-pink-400">Features:</strong> {person.distinguishing_features}</p>
      </div>
    </div>

    <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
      <h3 className="text-white font-bold mb-2 flex items-center">
        <span className="text-pink-400 mr-2">💭</span>
        Personality
      </h3>
      <p className="text-gray-300 text-sm leading-relaxed">{person.personality}</p>
    </div>

    <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
      <h3 className="text-white font-bold mb-2 flex items-center">
        <span className="text-pink-400 mr-2">📖</span>
        Background
      </h3>
      <p className="text-gray-300 text-sm leading-relaxed">{person.background}</p>
    </div>

    {person.relationships && (
      <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
        <h3 className="text-white font-bold mb-2 flex items-center">
          <span className="text-pink-400 mr-2">🤝</span>
          Relationships
        </h3>
        <p className="text-gray-300 text-sm leading-relaxed">{person.relationships}</p>
      </div>
    )}
  </div>
);

// Person Aspects Tab
const PersonAspectsTab = ({ person }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
    <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 rounded-xl p-4 border border-green-500/30">
      <h3 className="text-white font-bold mb-2 flex items-center">
        <span className="text-green-400 mr-2 text-xl">💪</span>
        Strength
      </h3>
      <p className="text-green-200 text-sm leading-relaxed">{person.strength}</p>
    </div>

    <div className="bg-gradient-to-br from-red-900/30 to-rose-900/30 rounded-xl p-4 border border-red-500/30">
      <h3 className="text-white font-bold mb-2 flex items-center">
        <span className="text-red-400 mr-2 text-xl">⚠️</span>
        Flaw
      </h3>
      <p className="text-red-200 text-sm leading-relaxed">{person.flaw}</p>
    </div>

    <div className="bg-gradient-to-br from-yellow-900/30 to-amber-900/30 rounded-xl p-4 border border-yellow-500/30">
      <h3 className="text-white font-bold mb-2 flex items-center">
        <span className="text-yellow-400 mr-2 text-xl">✨</span>
        Desire
      </h3>
      <p className="text-yellow-200 text-sm leading-relaxed">{person.desire}</p>
    </div>

    <div className="bg-gradient-to-br from-purple-900/30 to-violet-900/30 rounded-xl p-4 border border-purple-500/30">
      <h3 className="text-white font-bold mb-2 flex items-center">
        <span className="text-purple-400 mr-2 text-xl">😨</span>
        Fear
      </h3>
      <p className="text-purple-200 text-sm leading-relaxed">{person.fear}</p>
    </div>
  </div>
);

// Person Combat Tab
const PersonCombatTab = ({ person }) => (
  <div className="space-y-4">
    {/* Attributes */}
    <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
      <h3 className="text-white font-bold mb-3 flex items-center">
        <span className="text-blue-400 mr-2">📊</span>
        Attributes
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-600">
          <div className="text-xs text-gray-400 mb-1">Brawn</div>
          <div className="text-2xl font-bold text-red-400">{person.brawn}</div>
        </div>
        <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-600">
          <div className="text-xs text-gray-400 mb-1">Agility</div>
          <div className="text-2xl font-bold text-green-400">{person.agility}</div>
        </div>
        <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-600">
          <div className="text-xs text-gray-400 mb-1">Intellect</div>
          <div className="text-2xl font-bold text-blue-400">{person.intellect}</div>
        </div>
        <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-600">
          <div className="text-xs text-gray-400 mb-1">Cunning</div>
          <div className="text-2xl font-bold text-purple-400">{person.cunning}</div>
        </div>
        <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-600">
          <div className="text-xs text-gray-400 mb-1">Willpower</div>
          <div className="text-2xl font-bold text-yellow-400">{person.willpower}</div>
        </div>
        <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-600">
          <div className="text-xs text-gray-400 mb-1">Presence</div>
          <div className="text-2xl font-bold text-pink-400">{person.presence}</div>
        </div>
      </div>
    </div>

    {/* Defenses */}
    <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
      <h3 className="text-white font-bold mb-3 flex items-center">
        <span className="text-green-400 mr-2">🛡️</span>
        Defenses
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-600">
          <div className="text-xs text-gray-400 mb-1">Wounds</div>
          <div className="text-2xl font-bold text-red-400">{person.wounds_threshold}</div>
        </div>
        <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-600">
          <div className="text-xs text-gray-400 mb-1">Strain</div>
          <div className="text-2xl font-bold text-yellow-400">{person.strain_threshold}</div>
        </div>
        <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-600">
          <div className="text-xs text-gray-400 mb-1">Soak</div>
          <div className="text-2xl font-bold text-blue-400">{person.soak}</div>
        </div>
        <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-600">
          <div className="text-xs text-gray-400 mb-1">Melee Def</div>
          <div className="text-2xl font-bold text-orange-400">{person.melee_defense}</div>
        </div>
        <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-600">
          <div className="text-xs text-gray-400 mb-1">Ranged Def</div>
          <div className="text-2xl font-bold text-purple-400">{person.ranged_defense}</div>
        </div>
      </div>
    </div>

    {/* Skills - Categorized */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700">
        <h3 className="text-white font-bold mb-2 flex items-center text-sm">
          <span className="text-red-400 mr-2">⚔️</span>
          Combat Skills
        </h3>
        <div className="text-gray-300 text-xs space-y-1">
          {person.combat_skills ? (
            person.combat_skills.split(',').map((skill, idx) => (
              <div key={idx} className="bg-slate-900/50 rounded px-2 py-1">
                {skill.trim()}
              </div>
            ))
          ) : (
            <div className="text-gray-500 italic">None</div>
          )}
        </div>
      </div>

      <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700">
        <h3 className="text-white font-bold mb-2 flex items-center text-sm">
          <span className="text-pink-400 mr-2">💬</span>
          Social Skills
        </h3>
        <div className="text-gray-300 text-xs space-y-1">
          {person.social_skills ? (
            person.social_skills.split(',').map((skill, idx) => (
              <div key={idx} className="bg-slate-900/50 rounded px-2 py-1">
                {skill.trim()}
              </div>
            ))
          ) : (
            <div className="text-gray-500 italic">None</div>
          )}
        </div>
      </div>

      <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700">
        <h3 className="text-white font-bold mb-2 flex items-center text-sm">
          <span className="text-blue-400 mr-2">🛠️</span>
          General Skills
        </h3>
        <div className="text-gray-300 text-xs space-y-1 max-h-32 overflow-y-auto">
          {person.general_skills ? (
            person.general_skills.split(',').map((skill, idx) => (
              <div key={idx} className="bg-slate-900/50 rounded px-2 py-1">
                {skill.trim()}
              </div>
            ))
          ) : (
            <div className="text-gray-500 italic">None</div>
          )}
        </div>
      </div>
    </div>

    {/* Equipment */}
    <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
      <h3 className="text-white font-bold mb-3 flex items-center">
        <span className="text-amber-400 mr-2">🎒</span>
        Equipment
      </h3>
      <div className="text-gray-300 text-sm space-y-2 whitespace-pre-line">
        {person.equipment}
      </div>
    </div>

    {/* Combat Style */}
    {person.combat_style && (
      <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
        <h3 className="text-white font-bold mb-3 flex items-center">
          <span className="text-orange-400 mr-2">🥊</span>
          Combat Style: {person.combat_style}
        </h3>
        <p className="text-gray-300 text-sm mb-3">{person.combat_description}</p>
        <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700">
          <div className="text-xs font-semibold text-yellow-400 mb-1">Preferred Tactics:</div>
          <p className="text-gray-300 text-sm">{person.preferred_tactics}</p>
        </div>
      </div>
    )}
  </div>
);

// Person Abilities Tab
const PersonAbilitiesTab = ({ person }) => (
  <div className="space-y-4">
    {/* Talents */}
    {person.talents && (
      <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
        <h3 className="text-white font-bold mb-3 flex items-center gap-2">
          <span>⭐</span> Talents
        </h3>
        <div className="space-y-3">
          {person.talents.split('\n').filter(t => t.trim()).map((talent, idx) => {
            const [name, ...descParts] = talent.split(':');
            const description = descParts.join(':').trim();
            return (
              <div key={idx} className="bg-gradient-to-r from-yellow-900/20 to-amber-900/20 border border-yellow-500/30 rounded-lg p-4">
                <h4 className="text-yellow-300 font-bold mb-2">{name.trim()}</h4>
                {description && <p className="text-gray-300 text-sm">{description}</p>}
              </div>
            );
          })}
        </div>
      </div>
    )}

    {/* Abilities */}
    {person.abilities && (
      <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
        <h3 className="text-white font-bold mb-3 flex items-center gap-2">
          <span>✨</span> Special Abilities
        </h3>
        <div className="space-y-3">
          {person.abilities.split('\n').filter(a => a.trim()).map((ability, idx) => {
            const [name, ...descParts] = ability.split(':');
            const description = descParts.join(':').trim();
            return (
              <div key={idx} className="bg-gradient-to-r from-purple-900/20 to-indigo-900/20 border border-purple-500/30 rounded-lg p-4">
                <h4 className="text-purple-300 font-bold mb-2">{name.trim()}</h4>
                {description && <p className="text-gray-300 text-sm">{description}</p>}
              </div>
            );
          })}
        </div>
      </div>
    )}

    {/* Equipment */}
    {person.equipment && (
      <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
        <h3 className="text-white font-bold mb-3 flex items-center gap-2">
          <span>🎒</span> Equipment
        </h3>
        <div className="space-y-2">
          {person.equipment.split('\n').filter(e => e.trim()).map((item, idx) => (
            <div key={idx} className="bg-white/5 rounded-lg p-3">
              <span className="text-gray-300 text-sm">{item.trim()}</span>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Potential Loot */}
    {person.potential_loot && (
      <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
        <h3 className="text-white font-bold mb-3 flex items-center gap-2">
          <span>💰</span> Potential Loot
        </h3>
        <div className="space-y-2">
          {person.potential_loot.split(',').filter(l => l.trim()).map((loot, idx) => (
            <div key={idx} className="bg-gradient-to-r from-cyan-900/20 to-blue-900/20 border border-cyan-500/30 rounded-lg p-3">
              <span className="text-cyan-300 font-medium text-sm">{loot.trim()}</span>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
);

// Person DM Notes Tab
const PersonDMNotesTab = ({ person, sessionNotes, setSessionNotes, saveSessionNotes, isSavingNotes }) => (
  <div className="space-y-4">
    {person.dm_notes && (
      <div className="bg-gradient-to-br from-blue-900/30 to-indigo-900/30 rounded-xl p-4 border border-blue-500/30">
        <h3 className="text-white font-bold mb-3 flex items-center">
          <span className="text-blue-400 mr-2">📚</span>
          General DM Notes
        </h3>
        <div className="text-blue-200 text-sm leading-relaxed whitespace-pre-line">
          {person.dm_notes}
        </div>
      </div>
    )}

    <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
      <h3 className="text-white font-bold mb-3 flex items-center">
        <span className="text-pink-400 mr-2">📝</span>
        Session-Specific Notes
        <span className="ml-auto text-xs text-gray-400 font-normal">Auto-saves</span>
      </h3>
      <textarea
        value={sessionNotes}
        onChange={(e) => setSessionNotes(e.target.value)}
        onBlur={saveSessionNotes}
        placeholder="Add notes about this person for your current session..."
        className="w-full h-64 bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all resize-none"
      />
      {isSavingNotes && (
        <div className="mt-2 text-sm text-green-400 flex items-center">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
          </svg>
          Saved
        </div>
      )}
    </div>
  </div>
);