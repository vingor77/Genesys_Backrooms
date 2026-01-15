import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import db from '../../Structural/Firebase';

// Complete skill list organized by characteristic
const SKILLS_BY_CHARACTERISTIC = {
  brawn: [
    { id: 'athletics', name: 'Athletics', custom: false },
    { id: 'brawl', name: 'Brawl', custom: false },
    { id: 'melee', name: 'Melee', custom: false },
    { id: 'resilience', name: 'Resilience', custom: false },
    { id: 'metalworking', name: 'Metalworking', custom: true },
    { id: 'carpentry', name: 'Carpentry', custom: true },
  ],
  agility: [
    { id: 'coordination', name: 'Coordination', custom: false },
    { id: 'gunnery', name: 'Gunnery', custom: false },
    { id: 'ranged', name: 'Ranged', custom: false },
    { id: 'stealth', name: 'Stealth', custom: false },
    { id: 'leatherworking', name: 'Leatherworking', custom: true },
  ],
  intellect: [
    { id: 'computers', name: 'Computers', custom: false },
    { id: 'knowledge-education', name: 'Knowledge (Education)', custom: false },
    { id: 'knowledge-lore', name: 'Knowledge (Lore)', custom: true },
    { id: 'mechanics', name: 'Mechanics', custom: false },
    { id: 'medicine', name: 'Medicine', custom: false },
    { id: 'alchemy', name: 'Alchemy', custom: true },
  ],
  cunning: [
    { id: 'deception', name: 'Deception', custom: false },
    { id: 'perception', name: 'Perception', custom: false },
    { id: 'skulduggery', name: 'Skulduggery', custom: false },
    { id: 'streetwise', name: 'Streetwise', custom: false },
    { id: 'survival', name: 'Survival', custom: false },
    { id: 'scavenging', name: 'Scavenging', custom: true },
    { id: 'cooking', name: 'Cooking', custom: true },
  ],
  willpower: [
    { id: 'coercion', name: 'Coercion', custom: false },
    { id: 'discipline', name: 'Discipline', custom: false },
    { id: 'vigilance', name: 'Vigilance', custom: false },
    { id: 'fear', name: 'Fear', custom: true },
  ],
  presence: [
    { id: 'charm', name: 'Charm', custom: false },
    { id: 'cool', name: 'Cool', custom: false },
    { id: 'leadership', name: 'Leadership', custom: false },
    { id: 'negotiation', name: 'Negotiation', custom: false },
  ],
};

const ALL_SKILLS = Object.entries(SKILLS_BY_CHARACTERISTIC).flatMap(([char, skills]) =>
  skills.map(s => ({ ...s, characteristic: char }))
);

// Archetypes - 110 XP for all 2s, 100 XP if any stat is 3
const ARCHETYPES = [
  {
    id: 'average',
    name: 'Average Human',
    description: 'Balanced characteristics, adaptable to any situation',
    characteristics: { brawn: 2, agility: 2, intellect: 2, cunning: 2, willpower: 2, presence: 2 },
    woundBase: 10, strainBase: 10,
    ability: { name: 'Ready For Anything', description: 'Once per session, may move a Story Point from the GM pool to the player pool' },
    xp: 110
  },
  {
    id: 'laborer',
    name: 'Laborer',
    description: 'Strong and tough, built for physical challenges',
    characteristics: { brawn: 3, agility: 2, intellect: 2, cunning: 2, willpower: 2, presence: 2 },
    woundBase: 11, strainBase: 8,
    ability: { name: 'Tough As Nails', description: 'Once per session, reduce a Critical Injury result by 10 (to a minimum of 1)' },
    xp: 100
  },
  {
    id: 'intellectual',
    name: 'Intellectual',
    description: 'Smart and analytical, excels at mental tasks',
    characteristics: { brawn: 2, agility: 2, intellect: 3, cunning: 2, willpower: 2, presence: 2 },
    woundBase: 8, strainBase: 11,
    ability: { name: 'Brilliant', description: 'Once per session, reroll any one Intellect-based check' },
    xp: 100
  },
  {
    id: 'aristocrat',
    name: 'Aristocrat',
    description: 'Charismatic and influential, a natural leader',
    characteristics: { brawn: 2, agility: 2, intellect: 2, cunning: 2, willpower: 2, presence: 3 },
    woundBase: 9, strainBase: 10,
    ability: { name: 'Forceful Personality', description: 'Once per session, reroll any one Presence-based check' },
    xp: 100
  },
  {
    id: 'athlete',
    name: 'Athlete',
    description: 'Fast, nimble, and physically coordinated',
    characteristics: { brawn: 2, agility: 3, intellect: 2, cunning: 2, willpower: 2, presence: 2 },
    woundBase: 9, strainBase: 10,
    ability: { name: 'Quick Reflexes', description: 'Once per session, may take a free maneuver (does not count toward 2 maneuver limit)' },
    xp: 100
  },
  {
    id: 'survivalist',
    name: 'Survivalist',
    description: 'Resourceful and perceptive, thrives in harsh conditions',
    characteristics: { brawn: 2, agility: 2, intellect: 2, cunning: 3, willpower: 2, presence: 2 },
    woundBase: 10, strainBase: 9,
    ability: { name: 'Resourceful', description: 'Once per session, find a useful common item in the environment (GM discretion)' },
    xp: 100
  },
  {
    id: 'stalwart',
    name: 'Stalwart',
    description: 'Mentally tough and resistant to fear and stress',
    characteristics: { brawn: 2, agility: 2, intellect: 2, cunning: 2, willpower: 3, presence: 2 },
    woundBase: 8, strainBase: 11,
    ability: { name: 'Iron Will', description: 'Once per session, automatically succeed on a Fear check' },
    xp: 100
  },
  {
    id: 'craftsman',
    name: 'Craftsman',
    description: 'Skilled with tools and building things',
    characteristics: { brawn: 3, agility: 2, intellect: 2, cunning: 2, willpower: 2, presence: 2 },
    woundBase: 10, strainBase: 9,
    ability: { name: 'Handy', description: 'Once per session, add automatic Success to a crafting or repair check' },
    xp: 100
  },
  {
    id: 'scholar',
    name: 'Scholar',
    description: 'Deeply knowledgeable with excellent memory',
    characteristics: { brawn: 2, agility: 2, intellect: 3, cunning: 2, willpower: 2, presence: 2 },
    woundBase: 8, strainBase: 10,
    ability: { name: 'Well Read', description: 'Once per session, may ask the GM one yes/no question about lore or history' },
    xp: 100
  },
  {
    id: 'jack',
    name: 'Jack of All Trades',
    description: 'A little bit of everything, master of none',
    characteristics: { brawn: 2, agility: 2, intellect: 2, cunning: 2, willpower: 2, presence: 2 },
    woundBase: 10, strainBase: 10,
    ability: { name: 'Adaptable', description: 'Once per session, treat any one skill as a career skill for a single check' },
    xp: 110
  }
];

const CAREERS = [
  { id: 'explorer', name: 'Explorer', description: 'Navigating the unknown depths of the Backrooms', skills: ['survival', 'athletics', 'perception', 'vigilance', 'knowledge-lore', 'discipline', 'coordination', 'medicine'] },
  { id: 'researcher', name: 'Researcher', description: 'Studying the mysteries and anomalies', skills: ['knowledge-lore', 'computers', 'medicine', 'perception', 'knowledge-education', 'discipline', 'vigilance', 'mechanics'] },
  { id: 'survivor', name: 'Survivor', description: 'Staying alive against all odds', skills: ['survival', 'athletics', 'vigilance', 'discipline', 'stealth', 'streetwise', 'brawl', 'ranged'] },
  { id: 'technician', name: 'Technician', description: 'Keeping equipment running and finding solutions', skills: ['computers', 'mechanics', 'knowledge-lore', 'perception', 'discipline', 'vigilance', 'medicine', 'knowledge-education'] },
  { id: 'scavenger', name: 'Scavenger', description: 'Finding valuable resources others miss', skills: ['scavenging', 'perception', 'stealth', 'streetwise', 'skulduggery', 'survival', 'negotiation', 'vigilance'] },
  { id: 'medic', name: 'Medic', description: 'Keeping others alive and healthy', skills: ['medicine', 'discipline', 'resilience', 'knowledge-education', 'perception', 'survival', 'alchemy', 'cool'] },
  { id: 'enforcer', name: 'Enforcer', description: 'Combat-focused protector and fighter', skills: ['brawl', 'melee', 'ranged', 'athletics', 'coercion', 'vigilance', 'resilience', 'cool'] },
  { id: 'negotiator', name: 'Negotiator', description: 'Smooth-talking diplomat and dealmaker', skills: ['charm', 'negotiation', 'deception', 'cool', 'leadership', 'perception', 'streetwise', 'knowledge-education'] }
];

const getCharacteristicCost = (fromRank, toRank) => {
  let cost = 0;
  for (let r = fromRank + 1; r <= toRank; r++) {
    cost += r * 10;
  }
  return cost;
};

const getSkillCost = (newRank, isCareer) => {
  const base = 5 * newRank;
  return isCareer ? base : base + 5;
};

export default function CharacterCreator({ onCreate, onCancel }) {
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [freeSkillMode, setFreeSkillMode] = useState(null);
  const [allTalents, setAllTalents] = useState([]);
  const [loadingTalents, setLoadingTalents] = useState(true);
  
  const [characterData, setCharacterData] = useState({
    name: '',
    description: {
      gender: '',
      age: '',
      height: '',
      build: '',
      hair: '',
      eyes: '',
      notableFeatures: '',
      background: ''
    },
    portrait: '👤',
    creationType: null,
    archetype: null,
    archetypeAbility: null,
    characteristics: { brawn: 2, agility: 2, intellect: 2, cunning: 2, willpower: 2, presence: 2 },
    baseCharacteristics: {},
    woundBase: 10,
    strainBase: 10,
    careerType: null,
    career: null,
    careerSkills: [],
    skills: {},
    freeSkillRanks: {},
    motivations: { strength: '', flaw: '', desire: '', fear: '' },
    talents: [],
    customAbilities: [],
    notes: [],
    startingXP: 110
  });

  const [customWoundStrain, setCustomWoundStrain] = useState({ wound: 10, strain: 10 });

  // Load talents from Firestore
  useEffect(() => {
    const loadTalents = async () => {
      try {
        const talentsSnap = await getDocs(query(collection(db, 'Talents'), orderBy('tier')));
        const talents = talentsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAllTalents(talents);
      } catch (err) {
        console.error('Error loading talents:', err);
      } finally {
        setLoadingTalents(false);
      }
    };
    loadTalents();
  }, []);

  const totalSteps = 9;
  const steps = [
    { num: 1, label: 'Archetype', icon: '🎭' },
    { num: 2, label: 'Characteristics', icon: '💪' },
    { num: 3, label: 'Career', icon: '💼' },
    { num: 4, label: 'Free Skills', icon: '🎁' },
    { num: 5, label: 'Buy Skills', icon: '📚' },
    { num: 6, label: 'Talents', icon: '⭐' },
    { num: 7, label: 'Motivations', icon: '❤️' },
    { num: 8, label: 'Description', icon: '📝' },
    { num: 9, label: 'Finish', icon: '✨' },
  ];

  // XP Calculations
  const calculateCharacteristicXP = () => {
    let spent = 0;
    const base = characterData.baseCharacteristics;
    const current = characterData.characteristics;
    Object.keys(current).forEach(char => {
      if (base[char] !== undefined && current[char] > base[char]) {
        spent += getCharacteristicCost(base[char], current[char]);
      }
    });
    return spent;
  };

  const calculateSkillXP = () => {
    let spent = 0;
    Object.entries(characterData.skills).forEach(([skillId, totalRank]) => {
      const freeRank = characterData.freeSkillRanks[skillId] || 0;
      const isCareer = characterData.careerSkills.includes(skillId);
      for (let r = freeRank + 1; r <= totalRank; r++) {
        spent += getSkillCost(r, isCareer);
      }
    });
    return spent;
  };

  const calculateTalentXP = () => {
    return characterData.talents.reduce((sum, t) => sum + ((t.effectiveTier || t.tier) * 5), 0);
  };

  const getTalentCountByTier = () => {
    const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    characterData.talents.forEach(t => {
      const tier = t.effectiveTier || t.tier || 1;
      counts[tier] = (counts[tier] || 0) + 1;
    });
    return counts;
  };

  const canBuyTalentTier = (tier) => {
    if (tier === 1) return true;
    const counts = getTalentCountByTier();

    // Count how many of this tier we already have
    const currentCount = counts[tier] || 0;

    // For each previous tier, check if we have enough
    // To buy (currentCount + 1) talents of tier T, we need:
    // - 2 * (currentCount + 1) of tier T-1
    // - 4 * (currentCount + 1) of tier T-2
    // - 8 * (currentCount + 1) of tier T-3, etc.
    for (let checkTier = tier - 1; checkTier >= 1; checkTier--) {
      const depthDiff = tier - checkTier;
      const required = Math.pow(2, depthDiff) * (currentCount + 1);
      if ((counts[checkTier] || 0) < required) return false;
    }

    return true;
  };

  const getPlayerTalentCount = (talentId) => {
    return characterData.talents.filter(t => t.talentId === talentId).length;
  };

  const getTalentEffectiveTier = (talent) => {
    const timesBought = getPlayerTalentCount(talent.id);
    if (!talent.ranked) return talent.tier;
    return Math.min(talent.tier + timesBought, 5);
  };

  const totalXPSpent = calculateCharacteristicXP() + calculateSkillXP() + calculateTalentXP();
  const xpRemaining = characterData.startingXP - totalXPSpent;

  // Validation
  const validateFreeSkills = () => {
    const freeRanks = characterData.freeSkillRanks;
    const totalFreeRanks = Object.values(freeRanks).reduce((sum, r) => sum + r, 0);
    const skillCount = Object.keys(freeRanks).length;
    
    if (characterData.careerType === 'preset') {
      return totalFreeRanks === 4 && skillCount === 4;
    } else {
      const maxRank = Math.max(...Object.values(freeRanks), 0);
      if (skillCount === 4 && totalFreeRanks === 4 && maxRank === 1) return true;
      if (skillCount === 2 && totalFreeRanks === 4 && maxRank === 2) return true;
      return false;
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1: return characterData.creationType !== null;
      case 2: return xpRemaining >= 0;
      case 3: return characterData.careerSkills.length === 8;
      case 4: return validateFreeSkills();
      case 5: return xpRemaining >= 0;
      case 6: return xpRemaining >= 0;
      case 7: return true;
      case 8: return true;
      case 9: return characterData.name.trim() !== '';
      default: return true;
    }
  };

  // Handlers
  const selectArchetype = (archetype) => {
    setCharacterData({
      ...characterData,
      creationType: 'preset',
      archetype: archetype.name,
      archetypeAbility: archetype.ability,
      characteristics: { ...archetype.characteristics },
      baseCharacteristics: { ...archetype.characteristics },
      woundBase: archetype.woundBase,
      strainBase: archetype.strainBase,
      startingXP: archetype.xp,
      customAbilities: []
    });
    setError('');
  };

  const selectCustomArchetype = () => {
    const baseChars = { brawn: 1, agility: 1, intellect: 1, cunning: 1, willpower: 1, presence: 1 };
    setCharacterData({
      ...characterData,
      creationType: 'custom',
      archetype: 'Custom',
      archetypeAbility: null,
      characteristics: { ...baseChars },
      baseCharacteristics: { ...baseChars },
      woundBase: customWoundStrain.wound,
      strainBase: customWoundStrain.strain,
      startingXP: 230,
      customAbilities: [{ name: '', description: '' }, { name: '', description: '' }]
    });
    setError('');
  };

  const adjustCustomWoundStrain = (type, delta) => {
    const current = customWoundStrain[type];
    const newValue = current + delta;
    
    if (newValue < 8 || newValue > 12) return;
    const newOther = 20 - newValue;
    if (newOther < 8 || newOther > 12) return;
    
    const other = type === 'wound' ? 'strain' : 'wound';
    const newWoundStrain = { [type]: newValue, [other]: newOther };
    setCustomWoundStrain(newWoundStrain);
    
    if (characterData.creationType === 'custom') {
      setCharacterData({
        ...characterData,
        woundBase: newWoundStrain.wound,
        strainBase: newWoundStrain.strain
      });
    }
  };

  const updateCustomAbility = (index, field, value) => {
    const newAbilities = [...characterData.customAbilities];
    newAbilities[index] = { ...newAbilities[index], [field]: value };
    setCharacterData({ ...characterData, customAbilities: newAbilities });
  };

  const adjustCharacteristic = (char, delta) => {
    const current = characterData.characteristics[char];
    const newValue = current + delta;
    const base = characterData.baseCharacteristics[char];
    
    if (newValue < base || newValue > 5 || newValue < 1) return;
    
    if (delta > 0) {
      const cost = (newValue) * 10;
      if (cost > xpRemaining) {
        setError(`Not enough XP. Need ${cost}, have ${xpRemaining}`);
        return;
      }
    }
    
    setCharacterData({
      ...characterData,
      characteristics: { ...characterData.characteristics, [char]: newValue }
    });
    setError('');
  };

  const selectCareer = (career) => {
    setCharacterData({
      ...characterData,
      careerType: 'preset',
      career: career.name,
      careerSkills: [...career.skills],
      freeSkillRanks: {},
      skills: {}
    });
    setFreeSkillMode(null);
    setError('');
  };

  const selectCustomCareer = () => {
    setCharacterData({
      ...characterData,
      careerType: 'custom',
      career: 'Custom',
      careerSkills: [],
      freeSkillRanks: {},
      skills: {}
    });
    setFreeSkillMode(null);
    setError('');
  };

  const toggleCareerSkill = (skillId) => {
    const current = characterData.careerSkills;
    if (current.includes(skillId)) {
      setCharacterData({ ...characterData, careerSkills: current.filter(s => s !== skillId) });
    } else if (current.length < 8) {
      setCharacterData({ ...characterData, careerSkills: [...current, skillId] });
    }
  };

  const adjustFreeSkillRank = (skillId, delta) => {
    const current = characterData.freeSkillRanks[skillId] || 0;
    const newValue = current + delta;
    
    if (!characterData.careerSkills.includes(skillId)) return;
    
    const totalOtherRanks = Object.entries(characterData.freeSkillRanks)
      .filter(([id]) => id !== skillId)
      .reduce((sum, [, r]) => sum + r, 0);
    
    if (characterData.careerType === 'preset') {
      if (newValue < 0 || newValue > 1) return;
      if (totalOtherRanks + newValue > 4) return;
    } else {
      if (!freeSkillMode) return;
      if (freeSkillMode === '4x1') {
        if (newValue < 0 || newValue > 1) return;
        if (totalOtherRanks + newValue > 4) return;
      } else {
        if (newValue < 0 || newValue > 2) return;
        const otherCount = Object.entries(characterData.freeSkillRanks)
          .filter(([id]) => id !== skillId && characterData.freeSkillRanks[id] > 0).length;
        if (newValue > 0 && current === 0 && otherCount >= 2) return;
      }
    }
    
    const newFreeRanks = { ...characterData.freeSkillRanks };
    const newSkills = { ...characterData.skills };
    
    if (newValue === 0) {
      delete newFreeRanks[skillId];
      delete newSkills[skillId];
    } else {
      newFreeRanks[skillId] = newValue;
      newSkills[skillId] = newValue;
    }
    
    setCharacterData({ ...characterData, freeSkillRanks: newFreeRanks, skills: newSkills });
  };

  const adjustSkillRank = (skillId, delta) => {
    const currentTotal = characterData.skills[skillId] || 0;
    const freeRank = characterData.freeSkillRanks[skillId] || 0;
    const newTotal = currentTotal + delta;
    
    if (newTotal < freeRank || newTotal > 2) return;
    
    const isCareer = characterData.careerSkills.includes(skillId);
    
    if (delta > 0) {
      const cost = getSkillCost(newTotal, isCareer);
      if (cost > xpRemaining) {
        setError(`Not enough XP. Need ${cost}, have ${xpRemaining}`);
        return;
      }
    }
    
    const newSkills = { ...characterData.skills };
    if (newTotal === 0) {
      delete newSkills[skillId];
    } else {
      newSkills[skillId] = newTotal;
    }
    
    setCharacterData({ ...characterData, skills: newSkills });
    setError('');
  };

  const canBuyTalent = (talent) => {
    const effectiveTier = getTalentEffectiveTier(talent);
    const cost = effectiveTier * 5;
    
    if (cost > xpRemaining) return false;
    if (!talent.ranked && getPlayerTalentCount(talent.id) > 0) return false;
    if (!canBuyTalentTier(effectiveTier)) return false;
    
    return true;
  };

  const buyTalent = (talent) => {
    if (!canBuyTalent(talent)) return;
    
    const effectiveTier = getTalentEffectiveTier(talent);
    
    const newTalent = {
      id: Date.now(),
      talentId: talent.id,
      name: talent.name,
      tier: talent.tier,
      effectiveTier: effectiveTier,
      effect: talent.effect,
      ranked: talent.ranked,
      activation: talent.activation,
      purchasedAt: new Date().toISOString()
    };
    
    setCharacterData({
      ...characterData,
      talents: [...characterData.talents, newTalent]
    });
    setError('');
  };

  const removeTalent = (talentInstanceId) => {
    setCharacterData({
      ...characterData,
      talents: characterData.talents.filter(t => t.id !== talentInstanceId)
    });
  };

  const handleNext = () => {
    if (!canProceed()) {
      setError('Please complete this step before continuing');
      return;
    }
    setError('');
    if (step < totalSteps) setStep(step + 1);
  };

  const handleBack = () => {
    setError('');
    if (step > 1) setStep(step - 1);
  };

  const handleCreate = () => {
    if (!characterData.name.trim()) {
      setError('Please enter a character name');
      return;
    }
    
    const woundThreshold = characterData.woundBase + characterData.characteristics.brawn;
    const strainThreshold = characterData.strainBase + characterData.characteristics.willpower;
    
    // Filter out empty custom abilities
    const validCustomAbilities = characterData.customAbilities.filter(a => a.name.trim() && a.description.trim());
    
    const finalData = {
      ...characterData,
      customAbilities: validCustomAbilities,
      woundThreshold,
      strainThreshold,
      soak: characterData.characteristics.brawn,
      meleeDefense: 0,
      rangedDefense: 0,
      maxEncumbrance: 5 + characterData.characteristics.brawn,
      currentWounds: 0,
      currentStrain: 0,
      currentSanity: 100,
      xpTotal: characterData.startingXP,
      xpAvailable: xpRemaining,
      inventory: [],
      equipped: {},
      resources: [],
      criticalInjuries: [],
      status: {
        exhaustion: 0,
        sanity: 100,
        hydrationStage: 0,
        hungerStage: 0,
        sleepStage: 0,
        diseases: [],
        activeEffects: []
      }
    };
    onCreate(finalData);
  };

  const getSkillInfo = (skillId) => ALL_SKILLS.find(s => s.id === skillId);

  // STEP 1: Archetype
  const renderArchetypeStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-white mb-2">Choose Your Archetype</h3>
        <p className="text-gray-300">Select a preset archetype or build custom (230 XP)</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ARCHETYPES.map((arch) => (
          <button
            key={arch.id}
            onClick={() => selectArchetype(arch)}
            className={`p-4 rounded-lg border text-left transition-all ${
              characterData.archetype === arch.name && characterData.creationType === 'preset'
                ? 'bg-indigo-600 border-indigo-400' 
                : 'bg-gray-800 border-gray-600 hover:bg-gray-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-white">{arch.name}</h4>
              <span className="text-indigo-400 text-sm font-medium">{arch.xp} XP</span>
            </div>
            <p className="text-sm text-gray-400 mb-2">{arch.description}</p>
            <div className="text-xs bg-green-900/50 text-green-300 p-2 rounded border border-green-700 mb-2">
              <strong>{arch.ability.name}:</strong> {arch.ability.description}
            </div>
            <div className="flex flex-wrap gap-1 mb-2">
              {Object.entries(arch.characteristics).map(([char, val]) => (
                <span key={char} className={`px-2 py-0.5 rounded text-xs ${val > 2 ? 'bg-yellow-900/50 text-yellow-300 border border-yellow-700' : 'bg-gray-700 text-gray-400'}`}>
                  {char.slice(0, 3).toUpperCase()}: {val}
                </span>
              ))}
            </div>
            <div className="text-xs text-gray-500">
              Wounds: {arch.woundBase}+Brawn | Strain: {arch.strainBase}+Will
            </div>
          </button>
        ))}
      </div>

      {/* Custom Archetype */}
      <div className={`p-4 rounded-lg border transition-all ${
        characterData.creationType === 'custom' ? 'bg-purple-600 border-purple-400' : 'bg-gray-800 border-gray-600'
      }`}>
        <button onClick={selectCustomArchetype} className="w-full text-left">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-bold text-white">Custom Build</h4>
            <span className="text-purple-400 text-sm font-medium">230 XP</span>
          </div>
          <p className="text-sm text-gray-400 mb-3">Start with all characteristics at 1 and build freely. No archetype ability, but create up to 2 custom abilities and choose your wound/strain distribution.</p>
        </button>
        
        {characterData.creationType === 'custom' && (
          <div className="mt-4 pt-4 border-t border-purple-500/50 space-y-4">
            <div>
              <h5 className="text-white font-medium mb-3">Wound/Strain Distribution</h5>
              <p className="text-gray-400 text-sm mb-3">Total of 20 points. Min 8, Max 12 each.</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-800 rounded-lg p-3 border border-gray-600">
                  <div className="text-red-400 text-sm font-medium mb-2">Wound Base</div>
                  <div className="flex items-center justify-center space-x-3">
                    <button onClick={() => adjustCustomWoundStrain('wound', -1)} disabled={customWoundStrain.wound <= 8} className="w-8 h-8 rounded bg-red-900/50 text-red-300 disabled:opacity-30 border border-red-700 font-bold">-</button>
                    <span className="text-2xl font-bold text-white">{customWoundStrain.wound}</span>
                    <button onClick={() => adjustCustomWoundStrain('wound', 1)} disabled={customWoundStrain.wound >= 12} className="w-8 h-8 rounded bg-green-900/50 text-green-300 disabled:opacity-30 border border-green-700 font-bold">+</button>
                  </div>
                </div>
                <div className="bg-gray-800 rounded-lg p-3 border border-gray-600">
                  <div className="text-blue-400 text-sm font-medium mb-2">Strain Base</div>
                  <div className="flex items-center justify-center space-x-3">
                    <button onClick={() => adjustCustomWoundStrain('strain', -1)} disabled={customWoundStrain.strain <= 8} className="w-8 h-8 rounded bg-red-900/50 text-red-300 disabled:opacity-30 border border-red-700 font-bold">-</button>
                    <span className="text-2xl font-bold text-white">{customWoundStrain.strain}</span>
                    <button onClick={() => adjustCustomWoundStrain('strain', 1)} disabled={customWoundStrain.strain >= 12} className="w-8 h-8 rounded bg-green-900/50 text-green-300 disabled:opacity-30 border border-green-700 font-bold">+</button>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h5 className="text-white font-medium mb-3">Custom Abilities (Optional)</h5>
              <p className="text-gray-400 text-sm mb-3">Create up to 2 custom abilities (subject to GM approval)</p>
              {characterData.customAbilities.map((ability, index) => (
                <div key={index} className="bg-gray-800 rounded-lg p-3 border border-gray-600 mb-2">
                  <input
                    type="text"
                    value={ability.name}
                    onChange={(e) => updateCustomAbility(index, 'name', e.target.value)}
                    placeholder={`Ability ${index + 1} Name`}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white placeholder-gray-500 mb-2"
                  />
                  <textarea
                    value={ability.description}
                    onChange={(e) => updateCustomAbility(index, 'description', e.target.value)}
                    placeholder="Describe what this ability does..."
                    rows={2}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white placeholder-gray-500 text-sm"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // STEP 2: Characteristics
  const renderCharacteristicsStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-white mb-2">Set Characteristics</h3>
        <p className="text-gray-300">
          XP Remaining: <span className={`font-bold ${xpRemaining < 0 ? 'text-red-400' : 'text-indigo-400'}`}>{xpRemaining}</span>
        </p>
      </div>

      <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4 text-blue-300 text-sm">
        <strong>Cost:</strong> Rank 2 = 20 XP | Rank 3 = 30 XP | Rank 4 = 40 XP | Rank 5 = 50 XP
        <br /><span className="text-yellow-300">⚠️ Characteristics can only be increased during character creation!</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {Object.entries(characterData.characteristics).map(([char, value]) => {
          const base = characterData.baseCharacteristics[char];
          const canDecrease = value > base;
          const canIncrease = value < 5;
          const nextCost = value < 5 ? (value + 1) * 10 : 0;
          
          return (
            <div key={char} className="bg-gray-800 rounded-lg p-4 border border-gray-600">
              <div className="text-indigo-300 text-sm font-medium capitalize mb-2">{char}</div>
              <div className="flex items-center justify-center space-x-3">
                <button onClick={() => adjustCharacteristic(char, -1)} disabled={!canDecrease} className="w-10 h-10 rounded-lg bg-red-900/50 text-red-300 hover:bg-red-800 disabled:opacity-30 disabled:cursor-not-allowed border border-red-700 font-bold text-xl">-</button>
                <span className="text-3xl font-bold text-white w-10 text-center">{value}</span>
                <button onClick={() => adjustCharacteristic(char, 1)} disabled={!canIncrease || nextCost > xpRemaining} className="w-10 h-10 rounded-lg bg-green-900/50 text-green-300 hover:bg-green-800 disabled:opacity-30 disabled:cursor-not-allowed border border-green-700 font-bold text-xl">+</button>
              </div>
              {canIncrease && <div className="text-center text-xs text-gray-500 mt-2">Next: {nextCost} XP</div>}
            </div>
          );
        })}
      </div>

      <div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
        <h4 className="text-white font-medium mb-2">XP Breakdown</h4>
        <div className="text-sm text-gray-300 space-y-1">
          <div className="flex justify-between"><span>Starting XP:</span><span className="text-white">{characterData.startingXP}</span></div>
          <div className="flex justify-between"><span>Spent on Characteristics:</span><span className="text-yellow-400">-{calculateCharacteristicXP()}</span></div>
          <div className="flex justify-between border-t border-gray-600 pt-2 mt-2"><span>Remaining:</span><span className={xpRemaining < 0 ? 'text-red-400' : 'text-green-400'}>{xpRemaining}</span></div>
        </div>
      </div>
    </div>
  );

  // STEP 3: Career
  const renderCareerStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-white mb-2">Choose Your Career</h3>
        <p className="text-gray-300">Your career determines your 8 career skills (cheaper to advance)</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {CAREERS.map((career) => (
          <button
            key={career.id}
            onClick={() => selectCareer(career)}
            className={`p-4 rounded-lg border text-left transition-all ${
              characterData.career === career.name && characterData.careerType === 'preset'
                ? 'bg-indigo-600 border-indigo-400' 
                : 'bg-gray-800 border-gray-600 hover:bg-gray-700'
            }`}
          >
            <h4 className="text-white font-bold mb-1">{career.name}</h4>
            <p className="text-gray-400 text-sm mb-2">{career.description}</p>
            <div className="flex flex-wrap gap-1">
              {career.skills.map((skillId) => {
                const skill = getSkillInfo(skillId);
                return (
                  <span key={skillId} className={`px-2 py-0.5 rounded text-xs ${skill?.custom ? 'bg-purple-900/50 text-purple-300 border border-purple-700' : 'bg-gray-700 text-gray-300'}`}>
                    {skill?.name || skillId}
                  </span>
                );
              })}
            </div>
          </button>
        ))}
      </div>

      <button
        onClick={selectCustomCareer}
        className={`w-full p-4 rounded-lg border text-left transition-all ${
          characterData.careerType === 'custom' ? 'bg-purple-600 border-purple-400' : 'bg-gray-800 border-gray-600 hover:bg-gray-700'
        }`}
      >
        <h4 className="text-white font-bold mb-1">Custom Career</h4>
        <p className="text-gray-400 text-sm">Choose any 8 skills as your career skills</p>
      </button>

      {characterData.careerType === 'custom' && (
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-white font-medium">Select 8 Career Skills</h4>
            <span className={`text-sm font-medium ${characterData.careerSkills.length === 8 ? 'text-green-400' : 'text-yellow-400'}`}>
              {characterData.careerSkills.length}/8 selected
            </span>
          </div>
          
          {Object.entries(SKILLS_BY_CHARACTERISTIC).map(([char, skills]) => (
            <div key={char} className="mb-4">
              <div className="text-indigo-300 text-sm font-medium capitalize mb-2">{char}</div>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => {
                  const isSelected = characterData.careerSkills.includes(skill.id);
                  const canSelect = isSelected || characterData.careerSkills.length < 8;
                  return (
                    <button
                      key={skill.id}
                      onClick={() => toggleCareerSkill(skill.id)}
                      disabled={!canSelect}
                      className={`px-3 py-1.5 rounded text-sm transition-all border ${
                        isSelected ? 'bg-indigo-600 text-white border-indigo-400' 
                        : canSelect ? 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600' 
                        : 'bg-gray-800 text-gray-600 border-gray-700 cursor-not-allowed'
                      } ${skill.custom ? 'ring-1 ring-purple-500/50' : ''}`}
                    >
                      {skill.name}{skill.custom && <span className="ml-1 text-purple-400">★</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // STEP 4: Free Skills
  const renderFreeSkillsStep = () => {
    const totalFreeRanks = Object.values(characterData.freeSkillRanks).reduce((sum, r) => sum + r, 0);
    
    return (
      <div className="space-y-6">
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-white mb-2">Allocate Free Skill Ranks</h3>
          <p className="text-gray-300">
            {characterData.careerType === 'preset' 
              ? 'Choose 4 career skills to gain 1 free rank each'
              : 'Choose how to allocate your free ranks'}
          </p>
        </div>

        {characterData.careerType === 'custom' && (
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
            <h4 className="text-white font-medium mb-3">Choose Allocation Method</h4>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => { setFreeSkillMode('4x1'); setCharacterData({ ...characterData, freeSkillRanks: {}, skills: {} }); }}
                className={`p-3 rounded-lg border text-center transition-all ${freeSkillMode === '4x1' ? 'bg-indigo-600 border-indigo-400 text-white' : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'}`}
              >
                <div className="font-bold">4 Skills × 1 Rank</div>
                <div className="text-sm opacity-75">Broader spread</div>
              </button>
              <button
                onClick={() => { setFreeSkillMode('2x2'); setCharacterData({ ...characterData, freeSkillRanks: {}, skills: {} }); }}
                className={`p-3 rounded-lg border text-center transition-all ${freeSkillMode === '2x2' ? 'bg-indigo-600 border-indigo-400 text-white' : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'}`}
              >
                <div className="font-bold">2 Skills × 2 Ranks</div>
                <div className="text-sm opacity-75">Deeper focus</div>
              </button>
            </div>
          </div>
        )}

        <div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
          <div className="flex justify-between items-center">
            <span className="text-gray-300">Free Ranks Allocated:</span>
            <span className={`font-bold ${totalFreeRanks === 4 ? 'text-green-400' : 'text-yellow-400'}`}>{totalFreeRanks}/4</span>
          </div>
          <div className="mt-2 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div className={`h-full transition-all ${totalFreeRanks === 4 ? 'bg-green-500' : 'bg-yellow-500'}`} style={{ width: `${(totalFreeRanks / 4) * 100}%` }} />
          </div>
        </div>

        {(characterData.careerType === 'preset' || freeSkillMode) && (
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
            <h4 className="text-white font-medium mb-4">Your Career Skills</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {characterData.careerSkills.map((skillId) => {
                const skill = getSkillInfo(skillId);
                const currentRank = characterData.freeSkillRanks[skillId] || 0;
                const maxRank = characterData.careerType === 'preset' || freeSkillMode === '4x1' ? 1 : 2;
                
                let canIncrease = currentRank < maxRank && totalFreeRanks < 4;
                if (freeSkillMode === '2x2') {
                  const currentSkillCount = Object.keys(characterData.freeSkillRanks).filter(id => characterData.freeSkillRanks[id] > 0).length;
                  if (currentRank === 0 && currentSkillCount >= 2) canIncrease = false;
                }
                
                return (
                  <div key={skillId} className="flex items-center justify-between bg-gray-700 rounded-lg p-3">
                    <div>
                      <span className="text-white">{skill?.name}</span>
                      <span className="text-gray-500 text-sm ml-2 capitalize">({skill?.characteristic})</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button onClick={() => adjustFreeSkillRank(skillId, -1)} disabled={currentRank === 0} className="w-8 h-8 rounded bg-red-900/50 text-red-300 disabled:opacity-30 border border-red-700 font-bold">-</button>
                      <span className="text-xl font-bold text-white w-6 text-center">{currentRank}</span>
                      <button onClick={() => adjustFreeSkillRank(skillId, 1)} disabled={!canIncrease} className="w-8 h-8 rounded bg-green-900/50 text-green-300 disabled:opacity-30 border border-green-700 font-bold">+</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  // STEP 5: Buy Skills
  const renderBuySkillsStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-white mb-2">Purchase Additional Skills</h3>
        <p className="text-gray-300">XP Remaining: <span className={`font-bold ${xpRemaining < 0 ? 'text-red-400' : 'text-indigo-400'}`}>{xpRemaining}</span></p>
      </div>

      <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4 text-blue-300 text-sm">
        <strong>Career Skills:</strong> 5 × rank (Rank 1 = 5, Rank 2 = 10)<br />
        <strong>Non-Career:</strong> (5 × rank) + 5 (Rank 1 = 10, Rank 2 = 15)<br />
        <span className="text-yellow-300">Max rank during creation: 2</span>
      </div>

      {Object.entries(SKILLS_BY_CHARACTERISTIC).map(([char, skills]) => (
        <div key={char} className="bg-gray-800 rounded-lg p-4 border border-gray-600">
          <div className="text-indigo-300 text-sm font-medium capitalize mb-3">{char}</div>
          <div className="space-y-2">
            {skills.map((skill) => {
              const isCareer = characterData.careerSkills.includes(skill.id);
              const currentRank = characterData.skills[skill.id] || 0;
              const freeRank = characterData.freeSkillRanks[skill.id] || 0;
              const canDecrease = currentRank > freeRank;
              const canIncrease = currentRank < 2;
              const nextCost = currentRank < 2 ? getSkillCost(currentRank + 1, isCareer) : 0;
              
              return (
                <div key={skill.id} className="flex items-center justify-between bg-gray-700 rounded-lg p-2">
                  <div className="flex items-center space-x-2 flex-wrap">
                    <span className={`text-sm ${isCareer ? 'text-white' : 'text-gray-400'}`}>{skill.name}</span>
                    {isCareer && <span className="px-1.5 py-0.5 text-xs bg-indigo-900/50 text-indigo-300 rounded border border-indigo-700">Career</span>}
                    {skill.custom && <span className="px-1.5 py-0.5 text-xs bg-purple-900/50 text-purple-300 rounded border border-purple-700">Custom</span>}
                    {freeRank > 0 && <span className="px-1.5 py-0.5 text-xs bg-green-900/50 text-green-300 rounded border border-green-700">+{freeRank} free</span>}
                  </div>
                  <div className="flex items-center space-x-2">
                    {canIncrease && <span className="text-xs text-gray-500 mr-2">{nextCost} XP</span>}
                    <button onClick={() => adjustSkillRank(skill.id, -1)} disabled={!canDecrease} className="w-7 h-7 rounded bg-red-900/50 text-red-300 disabled:opacity-30 border border-red-700 text-sm font-bold">-</button>
                    <span className="text-lg font-bold text-white w-5 text-center">{currentRank}</span>
                    <button onClick={() => adjustSkillRank(skill.id, 1)} disabled={!canIncrease || nextCost > xpRemaining} className="w-7 h-7 rounded bg-green-900/50 text-green-300 disabled:opacity-30 border border-green-700 text-sm font-bold">+</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );

  // STEP 6: Talents
  const renderTalentsStep = () => {
    const talentCounts = getTalentCountByTier();
    
    if (loadingTalents) {
      return <div className="text-center py-12 text-gray-400">Loading talents...</div>;
    }
    
    return (
      <div className="space-y-6">
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-white mb-2">Purchase Talents</h3>
          <p className="text-gray-300">XP Remaining: <span className={`font-bold ${xpRemaining < 0 ? 'text-red-400' : 'text-indigo-400'}`}>{xpRemaining}</span></p>
        </div>

        <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4 text-blue-300 text-sm">
          <strong>Talent Tree Rules:</strong><br />
          • Tier 1 = 5 XP | Tier 2 = 10 XP | Tier 3 = 15 XP | Tier 4 = 20 XP | Tier 5 = 25 XP<br />
          • Need 2 talents of previous tier to unlock next tier<br />
          • Ranked talents can be purchased multiple times (tier increases each time)
        </div>

        {/* Talent Tree Progress */}
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
          <h4 className="text-white font-medium mb-3">Talent Tree Progress</h4>
          <div className="flex justify-between">
            {[1, 2, 3, 4, 5].map(tier => {
              const count = talentCounts[tier];
              const canBuy = canBuyTalentTier(tier);
              const needed = tier > 1 ? 2 : 0;
              const prevCount = tier > 1 ? talentCounts[tier - 1] : 0;
              
              return (
                <div key={tier} className="text-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 mx-auto mb-1 ${
                    canBuy ? 'bg-indigo-900/50 border-indigo-500 text-indigo-300' : 'bg-gray-700 border-gray-600 text-gray-500'
                  }`}>
                    {count}
                  </div>
                  <div className="text-xs text-gray-400">Tier {tier}</div>
                  <div className="text-xs text-gray-500">{tier * 5} XP</div>
                  {tier > 1 && <div className={`text-xs ${prevCount >= needed ? 'text-green-400' : 'text-red-400'}`}>Need {needed} T{tier-1}</div>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Purchased Talents */}
        {characterData.talents.length > 0 && (
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
            <h4 className="text-white font-medium mb-3">Your Talents ({calculateTalentXP()} XP)</h4>
            <div className="space-y-2">
              {characterData.talents.map((talent) => (
                <div key={talent.id} className="flex items-center justify-between bg-gray-700 rounded-lg p-3">
                  <div>
                    <span className="text-white font-medium">{talent.name}</span>
                    <span className="text-indigo-400 text-sm ml-2">Tier {talent.effectiveTier || talent.tier}</span>
                    <span className="text-gray-500 text-sm ml-2">({(talent.effectiveTier || talent.tier) * 5} XP)</span>
                    {talent.ranked && <span className="text-purple-400 text-xs ml-2">(Ranked)</span>}
                    {talent.activation && <span className="text-blue-400 text-xs ml-2">{talent.activation}</span>}
                    <p className="text-gray-400 text-sm mt-1">{talent.effect}</p>
                  </div>
                  <button onClick={() => removeTalent(talent.id)} className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/30 rounded-lg">✕</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Available Talents by Tier */}
        {[1, 2, 3, 4, 5].map(tier => {
          const canBuy = canBuyTalentTier(tier);
          
          // Get talents that should appear in this tier
          const tierTalents = allTalents.filter(t => {
            const effectiveTier = getTalentEffectiveTier(t);
            // Show here if: base tier matches, OR ranked talent has escalated to this tier
            if (t.tier === tier && getPlayerTalentCount(t.id) === 0) return true;
            if (t.ranked && effectiveTier === tier) return true;
            return false;
          });
          
          if (tierTalents.length === 0) return null;
          
          return (
            <div key={tier} className={`bg-gray-800 rounded-lg p-4 border ${canBuy ? 'border-gray-600' : 'border-gray-700 opacity-50'}`}>
              <h4 className={`font-medium mb-3 flex items-center justify-between ${canBuy ? 'text-white' : 'text-gray-500'}`}>
                <span>Tier {tier} Talents ({tier * 5} XP each)</span>
                {!canBuy && tier > 1 && <span className="text-xs text-red-400">Requires 2 Tier {tier - 1} talents</span>}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {tierTalents.map(talent => {
                  const owned = getPlayerTalentCount(talent.id);
                  const effectiveTier = getTalentEffectiveTier(talent);
                  const cost = effectiveTier * 5;
                  const canAfford = cost <= xpRemaining;
                  const meetsRequirements = canBuyTalentTier(effectiveTier);
                  const canBuyThis = canAfford && meetsRequirements && (talent.ranked || owned === 0);
                  
                  return (
                    <div key={talent.id} className={`p-3 rounded-lg border ${canBuyThis ? 'bg-gray-700 border-gray-600' : 'bg-gray-800 border-gray-700 opacity-50'}`}>
                      <div className="flex items-center justify-between mb-1">
                        <span className={canBuyThis ? 'text-white font-medium' : 'text-gray-500'}>{talent.name}</span>
                        <div className="flex items-center space-x-2">
                          {talent.ranked && <span className="text-purple-400 text-xs">Ranked</span>}
                          {owned > 0 && <span className="text-green-400 text-xs">×{owned}</span>}
                          {talent.activation && <span className="text-blue-400 text-xs">{talent.activation}</span>}
                        </div>
                      </div>
                      <p className={`text-sm mb-2 ${canBuyThis ? 'text-gray-400' : 'text-gray-600'}`}>{talent.effect}</p>
                      {talent.requirements && <p className="text-yellow-400 text-xs mb-2">Requires: {talent.requirements}</p>}
                      <button
                        onClick={() => buyTalent(talent)}
                        disabled={!canBuyThis}
                        className="w-full px-3 py-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded text-sm font-medium"
                      >
                        Buy ({cost} XP)
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // STEP 7: Motivations
  const renderMotivationsStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-white mb-2">Define Your Motivations</h3>
        <p className="text-gray-300">What drives your character? (Optional but recommended)</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { key: 'strength', label: 'Strength', icon: '💪', hint: 'A positive personality trait', bg: 'bg-green-900/20', border: 'border-green-700/50', text: 'text-green-400' },
          { key: 'flaw', label: 'Flaw', icon: '💔', hint: 'A weakness or negative trait', bg: 'bg-red-900/20', border: 'border-red-700/50', text: 'text-red-400' },
          { key: 'desire', label: 'Desire', icon: '⭐', hint: 'What your character wants most', bg: 'bg-yellow-900/20', border: 'border-yellow-700/50', text: 'text-yellow-400' },
          { key: 'fear', label: 'Fear', icon: '😨', hint: 'What your character fears most', bg: 'bg-purple-900/20', border: 'border-purple-700/50', text: 'text-purple-400' },
        ].map(({ key, label, icon, hint, bg, border, text }) => (
          <div key={key} className={`${bg} border ${border} rounded-lg p-4`}>
            <label className={`${text} text-sm font-medium mb-2 block`}>{icon} {label}</label>
            <p className="text-gray-500 text-xs mb-2">{hint}</p>
            <input
              type="text"
              value={characterData.motivations[key]}
              onChange={(e) => setCharacterData({ ...characterData, motivations: { ...characterData.motivations, [key]: e.target.value } })}
              placeholder={`Enter ${key}...`}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        ))}
      </div>
    </div>
  );

  // STEP 8: Description
  const renderDescriptionStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-white mb-2">Character Description</h3>
        <p className="text-gray-300">Describe your character's appearance and background</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { key: 'gender', label: 'Gender' },
          { key: 'age', label: 'Age' },
          { key: 'height', label: 'Height' },
          { key: 'build', label: 'Build' },
          { key: 'hair', label: 'Hair' },
          { key: 'eyes', label: 'Eyes' },
        ].map(({ key, label }) => (
          <div key={key}>
            <label className="text-gray-400 text-xs block mb-1">{label}</label>
            <input
              type="text"
              value={characterData.description[key]}
              onChange={(e) => setCharacterData({ ...characterData, description: { ...characterData.description, [key]: e.target.value } })}
              placeholder={label}
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white placeholder-gray-500"
            />
          </div>
        ))}
        <div className="col-span-2">
          <label className="text-gray-400 text-xs block mb-1">Notable Features</label>
          <input
            type="text"
            value={characterData.description.notableFeatures}
            onChange={(e) => setCharacterData({ ...characterData, description: { ...characterData.description, notableFeatures: e.target.value } })}
            placeholder="Scars, tattoos, unusual traits..."
            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white placeholder-gray-500"
          />
        </div>
      </div>

      <div>
        <label className="text-gray-400 text-xs block mb-1">Background Story</label>
        <textarea
          value={characterData.description.background}
          onChange={(e) => setCharacterData({ ...characterData, description: { ...characterData.description, background: e.target.value } })}
          placeholder="Where did your character come from? How did they end up in the Backrooms?"
          rows={5}
          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-500"
        />
      </div>
    </div>
  );

  // STEP 9: Finish
  const renderFinishStep = () => {
    const woundThreshold = characterData.woundBase + characterData.characteristics.brawn;
    const strainThreshold = characterData.strainBase + characterData.characteristics.willpower;
    
    return (
      <div className="space-y-6">
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-white mb-2">Final Details</h3>
          <p className="text-gray-300">Name your character and review</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
          <label className="text-indigo-300 text-sm font-medium mb-2 block">Character Name *</label>
          <input
            type="text"
            value={characterData.name}
            onChange={(e) => setCharacterData({ ...characterData, name: e.target.value })}
            placeholder="Enter character name..."
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 text-xl"
          />
        </div>

        <div className="bg-indigo-900/30 rounded-lg p-4 border border-indigo-700">
          <h4 className="text-indigo-300 font-semibold mb-4">📋 Character Summary</h4>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div><span className="text-gray-400 text-sm">Archetype</span><div className="text-white font-medium">{characterData.archetype}</div></div>
            <div><span className="text-gray-400 text-sm">Career</span><div className="text-white font-medium">{characterData.career}</div></div>
            <div><span className="text-gray-400 text-sm">XP Spent</span><div className="text-yellow-400 font-medium">{totalXPSpent}</div></div>
            <div><span className="text-gray-400 text-sm">XP Remaining</span><div className="text-green-400 font-medium">{xpRemaining}</div></div>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-4">
            {Object.entries(characterData.characteristics).map(([char, val]) => (
              <div key={char} className="bg-gray-800 rounded p-2 text-center">
                <div className="text-xs text-gray-400 capitalize">{char.slice(0, 3)}</div>
                <div className="text-xl font-bold text-white">{val}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-4 text-center mb-4">
            <div className="bg-red-900/30 rounded-lg p-2 border border-red-700">
              <div className="text-xs text-red-300">Wounds</div>
              <div className="text-xl font-bold text-white">{woundThreshold}</div>
            </div>
            <div className="bg-blue-900/30 rounded-lg p-2 border border-blue-700">
              <div className="text-xs text-blue-300">Strain</div>
              <div className="text-xl font-bold text-white">{strainThreshold}</div>
            </div>
            <div className="bg-gray-700 rounded-lg p-2 border border-gray-600">
              <div className="text-xs text-gray-400">Soak</div>
              <div className="text-xl font-bold text-white">{characterData.characteristics.brawn}</div>
            </div>
          </div>

          {Object.keys(characterData.skills).length > 0 && (
            <div className="mb-4">
              <div className="text-gray-400 text-sm mb-2">Skills</div>
              <div className="flex flex-wrap gap-1">
                {Object.entries(characterData.skills).map(([skillId, rank]) => (
                  <span key={skillId} className="px-2 py-1 bg-gray-700 rounded text-sm text-gray-300">
                    {getSkillInfo(skillId)?.name} {rank}
                  </span>
                ))}
              </div>
            </div>
          )}

          {characterData.talents.length > 0 && (
            <div>
              <div className="text-gray-400 text-sm mb-2">Talents</div>
              <div className="flex flex-wrap gap-1">
                {characterData.talents.map((talent) => (
                  <span key={talent.id} className="px-2 py-1 bg-purple-900/50 rounded text-sm text-purple-300 border border-purple-700">
                    {talent.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderStepContent = () => {
    switch (step) {
      case 1: return renderArchetypeStep();
      case 2: return renderCharacteristicsStep();
      case 3: return renderCareerStep();
      case 4: return renderFreeSkillsStep();
      case 5: return renderBuySkillsStep();
      case 6: return renderTalentsStep();
      case 7: return renderMotivationsStep();
      case 8: return renderDescriptionStep();
      case 9: return renderFinishStep();
      default: return null;
    }
  };

  return (
    <div className="bg-gray-800 border border-gray-600 rounded-xl overflow-hidden">
      <div className="bg-gray-900 p-6 border-b border-gray-700">
        <h2 className="text-2xl font-bold text-white">Character Creator</h2>
        <p className="text-gray-400">Step {step} of {totalSteps}: {steps[step - 1]?.label}</p>
      </div>

      <div className="flex border-b border-gray-700 bg-gray-900/50 overflow-x-auto">
        {steps.map((s) => (
          <button
            key={s.num}
            onClick={() => s.num < step && setStep(s.num)}
            disabled={s.num > step}
            className={`flex-1 px-2 py-3 text-center transition-all min-w-[70px] ${
              step === s.num ? 'text-indigo-400 border-b-2 border-indigo-400 bg-indigo-900/20' 
              : s.num < step ? 'text-green-400 cursor-pointer hover:bg-gray-800' 
              : 'text-gray-600 cursor-not-allowed'
            }`}
          >
            <div className="text-lg">{s.icon}</div>
            <div className="text-xs mt-1 hidden sm:block">{s.label}</div>
          </button>
        ))}
      </div>

      {error && (
        <div className="mx-6 mt-4 p-3 bg-red-900/30 border border-red-700 rounded-lg text-red-300 text-sm">{error}</div>
      )}

      <div className="p-6 max-h-[60vh] overflow-y-auto">
        {renderStepContent()}
      </div>

      <div className="flex justify-between p-6 border-t border-gray-700 bg-gray-900/50">
        <button onClick={step === 1 ? onCancel : handleBack} className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors font-medium">
          {step === 1 ? 'Cancel' : 'Back'}
        </button>
        
        {step < totalSteps ? (
          <button onClick={handleNext} disabled={!canProceed()} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium">
            Next
          </button>
        ) : (
          <button onClick={handleCreate} disabled={!characterData.name.trim()} className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium">
            Create Character
          </button>
        )}
      </div>
    </div>
  );
}