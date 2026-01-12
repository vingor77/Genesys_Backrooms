import React, { useState } from 'react';

export default function CharacterCreator({ onCreate, onCancel }) {
  const [step, setStep] = useState(1);
  const [characterData, setCharacterData] = useState({
    name: '',
    description: '',
    portrait: '👤',
    
    // Step 1: Archetype
    creationType: null, // 'preset' or 'custom'
    archetype: null,
    archetypeAbility: null,
    
    // Step 2: Characteristics (start at 2 for preset, 1 for custom)
    characteristics: {
      brawn: 2,
      agility: 2,
      intellect: 2,
      cunning: 2,
      willpower: 2,
      presence: 2
    },
    
    // Step 3: Career
    career: null,
    careerSkills: [],
    
    // Step 4: Skills
    skills: {},
    
    // Step 5: Motivations
    motivations: {
      strength: '',
      flaw: '',
      desire: '',
      fear: ''
    },
    
    // Step 6: Talents & Finishing
    talents: [],
    abilities: [],
    
    // Derived (calculated at end)
    woundThreshold: 0,
    strainThreshold: 0,
    soak: 0,
    meleeDefense: 0,
    rangedDefense: 0,
    maxEncumbrance: 0,
    
    // Starting XP tracking
    startingXP: 0,
    xpSpent: 0,
    xpRemaining: 0
  });

  const totalSteps = 6;

  const steps = [
    { num: 1, label: 'Archetype', icon: '🎭' },
    { num: 2, label: 'Characteristics', icon: '💪' },
    { num: 3, label: 'Career', icon: '💼' },
    { num: 4, label: 'Skills', icon: '📚' },
    { num: 5, label: 'Motivations', icon: '❤️' },
    { num: 6, label: 'Finish', icon: '✨' },
  ];

  // Preset Archetypes (from rules)
  const archetypes = [
    {
      id: 'average',
      name: 'Average Human',
      description: 'Balanced characteristics, adaptable',
      characteristics: { brawn: 2, agility: 2, intellect: 2, cunning: 2, willpower: 2, presence: 2 },
      ability: 'Ready For Anything',
      abilityDesc: 'Once per session, take a Story Point from GM pool',
      xp: 110
    },
    {
      id: 'laborer',
      name: 'Laborer',
      description: 'Strong and tough, physical focus',
      characteristics: { brawn: 3, agility: 2, intellect: 2, cunning: 2, willpower: 2, presence: 2 },
      ability: 'Tough As Nails',
      abilityDesc: 'Once per session, reduce critical injury to weakest result',
      xp: 110
    },
    {
      id: 'intellectual',
      name: 'Intellectual',
      description: 'Smart and knowledgeable, mental focus',
      characteristics: { brawn: 2, agility: 2, intellect: 3, cunning: 2, willpower: 2, presence: 2 },
      ability: 'Educated',
      abilityDesc: 'Gain additional knowledge and mental capabilities',
      xp: 110
    },
    {
      id: 'aristocrat',
      name: 'Aristocrat',
      description: 'Charismatic and influential, social focus',
      characteristics: { brawn: 2, agility: 2, intellect: 2, cunning: 2, willpower: 2, presence: 3 },
      ability: 'Wealthy',
      abilityDesc: 'Start with additional resources and connections',
      xp: 110
    }
  ];

  // Preset Careers (from rules)
  const careers = [
    {
      id: 'explorer',
      name: 'Explorer',
      skills: ['Survival', 'Athletics', 'Perception', 'Vigilance', 'Knowledge (Lore)', 'Cool', 'Coordination', 'Medicine']
    },
    {
      id: 'researcher',
      name: 'Researcher',
      skills: ['Knowledge (Lore)', 'Computers', 'Medicine', 'Perception', 'Knowledge (Education)', 'Cool', 'Vigilance', 'Investigation']
    },
    {
      id: 'survivor',
      name: 'Survivor',
      skills: ['Survival', 'Athletics', 'Vigilance', 'Cool', 'Stealth', 'Streetwise', 'Brawl', 'Ranged']
    },
    {
      id: 'technician',
      name: 'Technician',
      skills: ['Computers', 'Mechanics', 'Knowledge (Lore)', 'Perception', 'Cool', 'Investigation', 'Medicine', 'Knowledge (Education)']
    }
  ];

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleCreate = () => {
    // Calculate derived stats
    const finalData = {
      ...characterData,
      woundThreshold: 10 + characterData.characteristics.brawn,
      strainThreshold: 10 + characterData.characteristics.willpower,
      soak: characterData.characteristics.brawn,
      maxEncumbrance: 5 + characterData.characteristics.brawn,
      currentWounds: 0,
      currentStrain: 0,
      currentSanity: 100,
      inventory: [],
      equipped: {},
      resources: [],
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

  const selectArchetype = (archetype) => {
    setCharacterData({
      ...characterData,
      creationType: 'preset',
      archetype: archetype.name,
      archetypeAbility: { name: archetype.ability, description: archetype.abilityDesc },
      characteristics: { ...archetype.characteristics },
      startingXP: archetype.xp,
      xpRemaining: archetype.xp
    });
  };

  const selectCustom = () => {
    setCharacterData({
      ...characterData,
      creationType: 'custom',
      archetype: 'Custom',
      archetypeAbility: null,
      characteristics: { brawn: 1, agility: 1, intellect: 1, cunning: 1, willpower: 1, presence: 1 },
      startingXP: 230,
      xpRemaining: 230
    });
  };

  return (
    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 p-6 border-b border-white/10">
        <h2 className="text-2xl font-bold text-white">Character Creator</h2>
        <p className="text-gray-400">Step {step} of {totalSteps}</p>
      </div>

      {/* Progress Steps */}
      <div className="flex border-b border-white/10 bg-black/20 overflow-x-auto">
        {steps.map((s) => (
          <button
            key={s.num}
            onClick={() => s.num <= step && setStep(s.num)}
            className={`flex-1 px-4 py-3 text-center transition-all min-w-[100px]
              ${step === s.num 
                ? 'text-indigo-400 border-b-2 border-indigo-400 bg-indigo-500/10' 
                : step > s.num 
                  ? 'text-green-400 cursor-pointer hover:bg-white/5'
                  : 'text-gray-600 cursor-not-allowed'
              }`}
            disabled={s.num > step}
          >
            <div className="text-lg">{s.icon}</div>
            <div className="text-xs mt-1">{s.label}</div>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-6 min-h-[400px]">
        {/* Step 1: Archetype Selection */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-white mb-2">Choose Your Archetype</h3>
              <p className="text-gray-400">Select a preset archetype (110 XP) or build custom (230 XP)</p>
            </div>

            {/* Preset Archetypes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {archetypes.map((arch) => (
                <button
                  key={arch.id}
                  onClick={() => selectArchetype(arch)}
                  className={`p-4 rounded-lg border text-left transition-all
                    ${characterData.archetype === arch.name 
                      ? 'bg-indigo-600/30 border-indigo-500' 
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-white font-bold">{arch.name}</h4>
                    <span className="text-indigo-400 text-sm">{arch.xp} XP</span>
                  </div>
                  <p className="text-gray-400 text-sm mb-2">{arch.description}</p>
                  <div className="text-xs text-green-400">
                    <strong>{arch.ability}:</strong> {arch.abilityDesc}
                  </div>
                </button>
              ))}
            </div>

            {/* Custom Option */}
            <button
              onClick={selectCustom}
              className={`w-full p-4 rounded-lg border text-left transition-all
                ${characterData.creationType === 'custom' 
                  ? 'bg-purple-600/30 border-purple-500' 
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-white font-bold">Custom Build</h4>
                <span className="text-purple-400 text-sm">230 XP</span>
              </div>
              <p className="text-gray-400 text-sm">Start with all characteristics at 1 and build freely. No archetype ability unless purchased.</p>
            </button>
          </div>
        )}

        {/* Step 2: Characteristics */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-white mb-2">Set Characteristics</h3>
              <p className="text-gray-400">
                XP Remaining: <span className="text-indigo-400 font-bold">{characterData.xpRemaining}</span>
              </p>
            </div>

            <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 text-blue-300 text-sm">
              <strong>Cost:</strong> Rank 1→2: 20 XP | 2→3: 30 XP | 3→4: 40 XP | 4→5: 50 XP
              <br />
              <strong>Note:</strong> Characteristics can only be increased during character creation!
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(characterData.characteristics).map(([char, value]) => (
                <div key={char} className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="text-gray-400 text-sm capitalize mb-2">{char}</div>
                  <div className="flex items-center justify-center space-x-4">
                    <button 
                      className="w-8 h-8 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30 disabled:opacity-50"
                      disabled={value <= 1}
                    >
                      -
                    </button>
                    <span className="text-3xl font-bold text-white w-8 text-center">{value}</span>
                    <button 
                      className="w-8 h-8 rounded bg-green-500/20 text-green-400 hover:bg-green-500/30 disabled:opacity-50"
                      disabled={value >= 5}
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Career */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-white mb-2">Choose Your Career</h3>
              <p className="text-gray-400">Your career determines your 8 career skills (cheaper to advance)</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {careers.map((career) => (
                <button
                  key={career.id}
                  onClick={() => setCharacterData({ ...characterData, career: career.name, careerSkills: career.skills })}
                  className={`p-4 rounded-lg border text-left transition-all
                    ${characterData.career === career.name 
                      ? 'bg-indigo-600/30 border-indigo-500' 
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                >
                  <h4 className="text-white font-bold mb-2">{career.name}</h4>
                  <div className="flex flex-wrap gap-1">
                    {career.skills.map((skill, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded text-xs bg-gray-500/20 text-gray-300">
                        {skill}
                      </span>
                    ))}
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={() => setCharacterData({ ...characterData, career: 'Custom', careerSkills: [] })}
              className={`w-full p-4 rounded-lg border text-left transition-all
                ${characterData.career === 'Custom' 
                  ? 'bg-purple-600/30 border-purple-500' 
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
            >
              <h4 className="text-white font-bold mb-2">Custom Career</h4>
              <p className="text-gray-400 text-sm">Choose any 8 skills as career skills</p>
            </button>
          </div>
        )}

        {/* Step 4: Skills */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-white mb-2">Spend XP on Skills</h3>
              <p className="text-gray-400">
                XP Remaining: <span className="text-indigo-400 font-bold">{characterData.xpRemaining}</span>
              </p>
            </div>

            <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 text-blue-300 text-sm">
              <strong>Career Skills:</strong> Cost = 5 × new rank
              <br />
              <strong>Non-Career Skills:</strong> Cost = (5 × new rank) + 5
              <br />
              <strong>Max during creation:</strong> Rank 2
            </div>

            <p className="text-gray-500 text-center py-8">
              Skills selection interface will be implemented here.
              <br />
              Will show all standard Genesys skills + 8 custom skills with career indicator.
            </p>
          </div>
        )}

        {/* Step 5: Motivations */}
        {step === 5 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-white mb-2">Define Your Motivations</h3>
              <p className="text-gray-400">What drives your character?</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['strength', 'flaw', 'desire', 'fear'].map((motivation) => (
                <div key={motivation} className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <label className="text-gray-400 text-sm capitalize mb-2 block">{motivation}</label>
                  <input
                    type="text"
                    value={characterData.motivations[motivation]}
                    onChange={(e) => setCharacterData({
                      ...characterData,
                      motivations: { ...characterData.motivations, [motivation]: e.target.value }
                    })}
                    placeholder={`Enter ${motivation}...`}
                    className="w-full bg-black/30 border border-white/10 rounded px-3 py-2 text-white placeholder-gray-500"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 6: Finish */}
        {step === 6 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-white mb-2">Final Details</h3>
              <p className="text-gray-400">Name your character and review</p>
            </div>

            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <label className="text-gray-400 text-sm mb-2 block">Character Name</label>
              <input
                type="text"
                value={characterData.name}
                onChange={(e) => setCharacterData({ ...characterData, name: e.target.value })}
                placeholder="Enter character name..."
                className="w-full bg-black/30 border border-white/10 rounded px-3 py-2 text-white placeholder-gray-500 text-xl"
              />
            </div>

            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <label className="text-gray-400 text-sm mb-2 block">Description / Background</label>
              <textarea
                value={characterData.description}
                onChange={(e) => setCharacterData({ ...characterData, description: e.target.value })}
                placeholder="Describe your character's background..."
                rows={4}
                className="w-full bg-black/30 border border-white/10 rounded px-3 py-2 text-white placeholder-gray-500"
              />
            </div>

            {/* Summary */}
            <div className="bg-indigo-900/20 rounded-lg p-4 border border-indigo-500/30">
              <h4 className="text-indigo-300 font-semibold mb-3">Character Summary</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Archetype:</span>
                  <span className="text-white ml-2">{characterData.archetype || 'None'}</span>
                </div>
                <div>
                  <span className="text-gray-400">Career:</span>
                  <span className="text-white ml-2">{characterData.career || 'None'}</span>
                </div>
                <div>
                  <span className="text-gray-400">XP Remaining:</span>
                  <span className="text-indigo-400 ml-2">{characterData.xpRemaining}</span>
                </div>
                <div>
                  <span className="text-gray-400">Wound Threshold:</span>
                  <span className="text-white ml-2">{10 + characterData.characteristics.brawn}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Navigation */}
      <div className="flex justify-between p-6 border-t border-white/10 bg-black/20">
        <button
          onClick={step === 1 ? onCancel : handleBack}
          className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
        >
          {step === 1 ? 'Cancel' : 'Back'}
        </button>
        
        {step < totalSteps ? (
          <button
            onClick={handleNext}
            disabled={step === 1 && !characterData.creationType}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleCreate}
            disabled={!characterData.name}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
          >
            Create Character
          </button>
        )}
      </div>
    </div>
  );
}