const CraftData = [
  {
    id: "craft-improvised-weapon",
    name: "Improvised Melee Weapon",
    result_item_id: "improvised-weapon",
    yield: 1,
    
    crafting_skill: "Metalworking",
    base_difficulty: "Simple",
    crafting_time: "30 minutes",
    
    base_components: [
      { item_id: "metal-pipe", quantity: 1 },
      { item_id: "duct-tape", quantity: 1 }
    ],
    
    enhancements: [
      {
        name: "Weighted Head",
        material: { item_id: "concrete-chunk", quantity: 1 },
        benefit: "+1 Damage"
      }
    ],
    
    required_workshop: null,
    required_tools: [],
    recommended_tools: ["hacksaw"],
    
    crafting_notes: "Secure grip with tape. Test swing before use. The Backrooms provide plenty of materials for basic weapons.",
    difficulty_notes: "Anyone can make a serviceable club from scavenged materials.",
    
    sessionVisibility: {}
  },
  
  {
    id: "craft-almond-water-purifier",
    name: "Almond Water Purification Kit",
    result_item_id: "water-purifier",
    yield: 1,
    
    crafting_skill: "Alchemy",
    base_difficulty: "Average",
    crafting_time: "2 hours",
    
    base_components: [
      { item_id: "plastic-bottles", quantity: 3 },
      { item_id: "charcoal", quantity: 5 },
      { item_id: "sand", quantity: 2 },
      { item_id: "cloth-filter", quantity: 2 }
    ],
    
    enhancements: [
      {
        name: "Double Filtration",
        material: { item_id: "activated-carbon", quantity: 2 },
        benefit: "Removes harmful substances on Easy (1 Purple) check instead of Average"
      }
    ],
    
    required_workshop: null,
    required_tools: [],
    recommended_tools: ["utility-knife"],
    
    crafting_notes: "Layer charcoal and sand in bottle. Almond Water flows through naturally. Essential for survival in contaminated levels.",
    difficulty_notes: "Requires understanding of filtration principles and proper layering technique.",
    
    sessionVisibility: {}
  },
  
  {
    id: "craft-hazmat-suit-patches",
    name: "Hazmat Suit Repair Kit",
    result_item_id: "hazmat-patches",
    yield: 5,
    
    crafting_skill: "Leatherworking",
    base_difficulty: "Easy",
    crafting_time: "1 hour",
    
    base_components: [
      { item_id: "rubber-sheeting", quantity: 3 },
      { item_id: "adhesive-tape", quantity: 2 }
    ],
    
    enhancements: [
      {
        name: "Reinforced Seals",
        material: { item_id: "chemical-sealant", quantity: 1 },
        benefit: "Patches last twice as long before degrading"
      }
    ],
    
    required_workshop: null,
    required_tools: [],
    recommended_tools: ["scissors", "measuring-tape"],
    
    crafting_notes: "Cut patches to size. Apply adhesive evenly. Press firmly to seal. Critical for surviving hazardous levels.",
    difficulty_notes: "Simple cutting and application, but precision matters for effective seals.",
    
    sessionVisibility: {}
  },
  
  {
    id: "craft-flashlight-modification",
    name: "Enhanced Flashlight",
    result_item_id: "enhanced-flashlight",
    yield: 1,
    
    crafting_skill: "Metalworking",
    base_difficulty: "Average",
    crafting_time: "2 hours",
    
    base_components: [
      { item_id: "standard-flashlight", quantity: 1 },
      { item_id: "led-bulb", quantity: 1 },
      { item_id: "battery-pack", quantity: 1 }
    ],
    
    enhancements: [
      {
        name: "Strobe Function",
        material: { item_id: "circuit-board", quantity: 1 },
        benefit: "Can disorient entities; adds 1 Setback die to their checks"
      },
      {
        name: "Extended Battery",
        material: { item_id: "capacitor", quantity: 2 },
        benefit: "Doubles battery life to 8 hours"
      }
    ],
    
    required_workshop: null,
    required_tools: [],
    recommended_tools: ["screwdriver-set", "wire-cutters"],
    
    crafting_notes: "Disassemble carefully. Replace bulb and rewire battery. Test before sealing. Light is life in the Backrooms.",
    difficulty_notes: "Electrical work requires care but components are standardized.",
    
    sessionVisibility: {}
  },
  
  {
    id: "craft-entity-repellent",
    name: "Chemical Entity Repellent",
    result_item_id: "entity-repellent",
    yield: 3,
    
    crafting_skill: "Alchemy",
    base_difficulty: "Hard",
    crafting_time: "3 hours",
    
    base_components: [
      { item_id: "almond-water", quantity: 2 },
      { item_id: "chemical-compound-x", quantity: 1 },
      { item_id: "spray-bottle", quantity: 3 }
    ],
    
    enhancements: [
      {
        name: "Extended Duration",
        material: { item_id: "stabilizing-agent", quantity: 1 },
        benefit: "Lasts 1 hour instead of 30 minutes"
      }
    ],
    
    required_workshop: "basic-chemistry-station",
    required_tools: ["protective-gloves"],
    recommended_tools: ["safety-goggles", "ventilation-mask"],
    
    crafting_notes: "Mix carefully in ventilated area. Compound X is volatile and sensitive to temperature. Store in cool, dark place.",
    difficulty_notes: "Dangerous chemicals and precise ratios required. One mistake creates toxic fumes instead of repellent.",
    
    sessionVisibility: {}
  },
  
  {
    id: "craft-noise-trap",
    name: "Acoustic Alert Trap",
    result_item_id: "noise-trap",
    yield: 2,
    
    crafting_skill: "Metalworking",
    base_difficulty: "Average",
    crafting_time: "1 hour",
    
    base_components: [
      { item_id: "tin-cans", quantity: 6 },
      { item_id: "string", quantity: 3 },
      { item_id: "metal-stakes", quantity: 2 }
    ],
    
    enhancements: [
      {
        name: "Flare Integration",
        material: { item_id: "emergency-flare", quantity: 1 },
        benefit: "Creates bright light when triggered"
      }
    ],
    
    required_workshop: null,
    required_tools: [],
    recommended_tools: ["pliers"],
    
    crafting_notes: "String cans between stakes at ankle height. Test tension carefully. Simple but effective early warning system.",
    difficulty_notes: "Straightforward assembly but requires spatial awareness for effective placement.",
    
    sessionVisibility: {}
  },
  
  {
    id: "craft-level-key",
    name: "Level Access Key",
    result_item_id: "level-key",
    yield: 1,
    
    crafting_skill: "Metalworking",
    base_difficulty: "Hard",
    crafting_time: "4 hours",
    
    base_components: [
      { item_id: "steel-blank", quantity: 1 },
      { item_id: "key-template", quantity: 1 },
      { item_id: "metal-file", quantity: 1 }
    ],
    
    enhancements: [
      {
        name: "Durability Coating",
        material: { item_id: "protective-lacquer", quantity: 1 },
        benefit: "Key doesn't degrade after first use"
      },
      {
        name: "Master Pattern",
        material: { item_id: "universal-template", quantity: 1 },
        benefit: "Works on similar doors in same level cluster"
      }
    ],
    
    required_workshop: "basic-forge",
    required_tools: [],
    recommended_tools: ["precision-file-set", "calipers"],
    
    crafting_notes: "File teeth precisely to template. Even 0.5mm error prevents function. Some doors only open once per key.",
    difficulty_notes: "Extremely precise work. Template knowledge is rare and valuable in the Backrooms.",
    
    sessionVisibility: {}
  },
  
  {
    id: "craft-molotov-cocktail",
    name: "Improvised Molotov Cocktail",
    result_item_id: "molotov-cocktail",
    yield: 3,
    
    crafting_skill: "Alchemy",
    base_difficulty: "Easy",
    crafting_time: "30 minutes",
    
    base_components: [
      { item_id: "glass-bottle", quantity: 3 },
      { item_id: "flammable-liquid", quantity: 3 },
      { item_id: "cloth-rag", quantity: 3 }
    ],
    
    enhancements: [
      {
        name: "Napalm Additive",
        material: { item_id: "petroleum-jelly", quantity: 2 },
        benefit: "+1 Burn duration, sticks to surfaces"
      }
    ],
    
    required_workshop: null,
    required_tools: [],
    recommended_tools: [],
    
    crafting_notes: "Fill bottle 2/3 full. Insert rag wick. Keep away from heat. Desperate weapon for desperate situations.",
    difficulty_notes: "Simple assembly, but dangerous to store and transport. Handle with extreme care.",
    
    sessionVisibility: {}
  },
  
  {
    id: "craft-rope-ladder",
    name: "Emergency Rope Ladder",
    result_item_id: "rope-ladder",
    yield: 1,
    
    crafting_skill: "Leatherworking",
    base_difficulty: "Simple",
    crafting_time: "1 hour",
    
    base_components: [
      { item_id: "rope-length", quantity: 2 },
      { item_id: "wooden-dowels", quantity: 10 }
    ],
    
    enhancements: [
      {
        name: "Reinforced Knots",
        material: { item_id: "climbing-cord", quantity: 1 },
        benefit: "Supports 400 lbs instead of 250 lbs"
      }
    ],
    
    required_workshop: null,
    required_tools: [],
    recommended_tools: ["knife"],
    
    crafting_notes: "Tie dowels at equal intervals. Test each knot under load. Essential for vertical level transitions.",
    difficulty_notes: "Basic knot work. Patience and consistency matter more than skill.",
    
    sessionVisibility: {}
  },
  
  {
    id: "craft-first-aid-kit",
    name: "Basic First Aid Kit",
    result_item_id: "first-aid-kit",
    yield: 1,
    
    crafting_skill: "Alchemy",
    base_difficulty: "Average",
    crafting_time: "2 hours",
    
    base_components: [
      { item_id: "bandages", quantity: 5 },
      { item_id: "antiseptic", quantity: 2 },
      { item_id: "painkillers", quantity: 3 },
      { item_id: "medical-tape", quantity: 2 }
    ],
    
    enhancements: [
      {
        name: "Trauma Supplies",
        material: { item_id: "tourniquet", quantity: 1 },
        benefit: "Can treat Critical Injuries without penalty"
      },
      {
        name: "Burn Treatment",
        material: { item_id: "burn-gel", quantity: 2 },
        benefit: "Heals +1 additional Wound when treating burns"
      }
    ],
    
    required_workshop: null,
    required_tools: [],
    recommended_tools: ["scissors"],
    
    crafting_notes: "Organize supplies for quick access. Label everything. In the Backrooms, being prepared saves lives.",
    difficulty_notes: "Requires medical knowledge to assemble useful kit. Proper organization is critical.",
    
    sessionVisibility: {}
  },
  
  {
    id: "craft-barricade-wall",
    name: "Defensive Barricade",
    result_item_id: "barricade-wall",
    yield: 1,
    
    crafting_skill: "Carpentry",
    base_difficulty: "Average",
    crafting_time: "3 hours",
    
    base_components: [
      { item_id: "wooden-planks", quantity: 12 },
      { item_id: "nails", quantity: 30 },
      { item_id: "metal-brackets", quantity: 4 }
    ],
    
    enhancements: [
      {
        name: "Spike Defense",
        material: { item_id: "metal-spikes", quantity: 8 },
        benefit: "Entities take 3 damage if they charge through"
      },
      {
        name: "Reinforced Frame",
        material: { item_id: "steel-beams", quantity: 2 },
        benefit: "+20 Health Points"
      }
    ],
    
    required_workshop: null,
    required_tools: [],
    recommended_tools: ["hammer", "saw"],
    
    crafting_notes: "Build frame first. Cross-brace for stability. Anchor to walls if possible. Won't stop everything, but buys time.",
    difficulty_notes: "Basic construction but must be structurally sound. Poor design collapses under pressure.",
    
    sessionVisibility: {}
  },
  
  {
    id: "craft-rebreather-filter",
    name: "Rebreather Filter Module",
    result_item_id: "rebreather-filter",
    yield: 2,
    
    crafting_skill: "Alchemy",
    base_difficulty: "Hard",
    crafting_time: "4 hours",
    
    base_components: [
      { item_id: "activated-carbon", quantity: 4 },
      { item_id: "filter-housing", quantity: 2 },
      { item_id: "rubber-seals", quantity: 4 },
      { item_id: "mesh-screen", quantity: 2 }
    ],
    
    enhancements: [
      {
        name: "Chemical Scrubber",
        material: { item_id: "soda-lime", quantity: 2 },
        benefit: "Protects against acid gas and chlorine"
      }
    ],
    
    required_workshop: "basic-chemistry-station",
    required_tools: [],
    recommended_tools: ["measuring-tools", "assembly-jig"],
    
    crafting_notes: "Pack carbon evenly. Seal must be airtight. Test before entering toxic zones. Your life depends on this working.",
    difficulty_notes: "Complex assembly with no margin for error. Improper seals mean suffocation.",
    
    sessionVisibility: {}
  }
];

export default CraftData;