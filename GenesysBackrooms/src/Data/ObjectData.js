const data = [
  // ARMOR EXAMPLE - Tactical Vest
  {
    id: "tactical-combat-vest",
    name: "Tactical Combat Vest",
    type: "Armor",
    rarity: 5,
    buy_price: 480,
    sell_price: 120,
    encumbrance: 3,
    uses: null,
    fuel_type: null,
    fuel_duration: null,
    description: "A black tactical vest with modular MOLLE webbing, reinforced ceramic plate inserts, and adjustable Velcro straps. The vest shows signs of professional use but remains in excellent condition with all plates intact.",
    mechanical_effect: "Once per encounter, when you would suffer a Critical Injury, you may reduce the result by 20 (to a minimum of 01). After using this ability, the vest's soak is reduced by 1 until repaired.",
    tags: ["Urban", "Bunker", "Industrial", "Military"],
    variants: [
      {
        name: "Police Issue Vest",
        description: "A lighter vest with POLICE markings, designed for urban patrol rather than combat.",
        mechanical_effect: "Add 1 Boost die to Coercion checks when wearing visibly. Soak reduced to 1.",
        buy_price: 280,
        sell_price: 70,
        encumbrance: 2,
        fuel_type: null,
        fuel_duration: null,
        rarity: 3,
        chance: 30
      },
      {
        name: "Heavy Assault Vest",
        description: "A bulky military-grade vest with trauma plates and neck/groin protection.",
        mechanical_effect: "Once per encounter, when you would suffer a Critical Injury, you may reduce the result by 30 (to a minimum of 01). Soak increased to 3. Add 1 Setback die to all Athletics checks due to weight.",
        buy_price: 850,
        sell_price: 212,
        encumbrance: 4,
        fuel_type: null,
        fuel_duration: null,
        rarity: 7,
        chance: 10
      }
    ],
    soak: 2,
    melee_defense: 0,
    ranged_defense: 1,
    durability: 8,
    hardpoints: 2,
    equipmentTraits: null,
    equippedTo: "Chest",
    repairSkill: "Mechanics",
    set_name: "Tactical Operations",
    craftable: true,
    curse: {
      is_cursed: false,
      curse_chance: 5,
      curse_description: "The vest was worn by someone who died violently. Their final moments of terror replay in the wearer's dreams.",
      curse_effect: "After each rest, make a Hard Discipline check or gain 1 Strain that cannot be recovered until curse is removed. Wearer suffers recurring nightmares.",
      removal_requirement: "The vest must be cleansed by burning sage while reciting the names of all previous wearers, or be blessed by an Aurielle priest."
    },
    sessionVisibility: {}
  },

  // WEAPON EXAMPLE - Fire Axe
  {
    id: "fire-axe",
    name: "Fire Axe",
    type: "Weapon",
    rarity: 2,
    buy_price: 75,
    sell_price: 18,
    encumbrance: 3,
    uses: null,
    fuel_type: null,
    fuel_duration: null,
    description: "A standard firefighter's axe with a red-painted head featuring a blade on one side and a pick on the other. The fiberglass handle is wrapped in non-slip grip tape. Effective for both combat and breaching doors.",
    mechanical_effect: "Add 1 Boost die when attempting to breach doors or destroy barriers. Critical hits with the pick side ignore 2 points of soak.",
    tags: ["Urban", "Industrial", "Utility", "Emergency"],
    variants: [
      {
        name: "Rusty Fire Axe",
        description: "A neglected fire axe with significant rust and a cracked handle.",
        mechanical_effect: "Damage reduced to 5. On a Despair, the handle breaks and the weapon becomes unusable.",
        buy_price: 20,
        sell_price: 5,
        encumbrance: 3,
        fuel_type: null,
        fuel_duration: null,
        rarity: 1,
        chance: 25
      },
      {
        name: "Tactical Breaching Axe",
        description: "A modern tactical axe with a polymer handle, pry bar integrated into the head, and matte black coating.",
        mechanical_effect: "Add 2 Boost dice when attempting to breach doors or destroy barriers. The integrated pry bar allows forcing locks without a separate tool. Critical hits ignore 2 points of soak.",
        buy_price: 180,
        sell_price: 45,
        encumbrance: 2,
        fuel_type: null,
        fuel_duration: null,
        rarity: 4,
        chance: 15
      }
    ],
    damage: 6,
    critical: 3,
    range: "Engaged",
    skill: "Melee",
    durability: 7,
    hardpoints: 1,
    equipmentTraits: "Sunder, Vicious 1",
    equippedTo: "Two-Handed",
    repairSkill: "Mechanics",
    set_name: null,
    craftable: false,
    curse: {
      is_cursed: false,
      curse_chance: 0,
      curse_description: null,
      curse_effect: null,
      removal_requirement: null
    },
    sessionVisibility: {}
  },

  // MUNDANE OBJECT EXAMPLE - First Aid Kit
  {
    id: "first-aid-kit",
    name: "First Aid Kit",
    type: "Mundane Object",
    rarity: 2,
    buy_price: 45,
    sell_price: 11,
    encumbrance: 1,
    uses: 5,
    fuel_type: null,
    fuel_duration: null,
    description: "A red plastic case containing bandages, antiseptic wipes, gauze pads, medical tape, scissors, tweezers, and basic pain medication. The universal first aid symbol is printed on the lid.",
    mechanical_effect: "Expend 1 use to add 1 Boost die to a Medicine check to heal wounds. Expend 2 uses to attempt treating a Critical Injury without proper medical facilities (increases difficulty by 1).",
    tags: ["Urban", "Office", "Residential", "Industrial", "Utility", "ALL"],
    variants: [
      {
        name: "Expired First Aid Kit",
        description: "A dusty first aid kit with expired medications and dried-out antiseptic wipes.",
        mechanical_effect: "Expend 1 use to add 1 Boost die to a Medicine check, but also add 1 Setback die due to expired supplies.",
        buy_price: 15,
        sell_price: 3,
        encumbrance: 1,
        fuel_type: null,
        fuel_duration: null,
        rarity: 1,
        chance: 30
      },
      {
        name: "Trauma Kit",
        description: "A professional-grade trauma kit with hemostatic agents, chest seals, tourniquets, and emergency medications.",
        mechanical_effect: "Expend 1 use to add 2 Boost dice to a Medicine check. Expend 2 uses to treat a Critical Injury without increasing difficulty. Contains 3 uses.",
        buy_price: 180,
        sell_price: 45,
        encumbrance: 2,
        fuel_type: null,
        fuel_duration: null,
        rarity: 5,
        chance: 10
      }
    ],
    repairSkill: null,
    craftable: true,
    sessionVisibility: {}
  },

  // ANOMALOUS OBJECT EXAMPLE - Liquid Silence
  {
    id: "liquid-silence",
    name: "Liquid Silence",
    type: "Anomalous Object",
    rarity: 6,
    buy_price: 800,
    sell_price: 240,
    encumbrance: 0,
    uses: 1,
    fuel_type: null,
    fuel_duration: null,
    description: "A small glass vial containing a shimmering silver liquid that appears to absorb sound. When shaken, the liquid makes no noise despite visibly sloshing. The vial feels unnaturally cold and the liquid seems to pull at nearby sounds, creating a subtle quiet zone around it.",
    mechanical_effect: "When consumed or poured on a surface, creates a 10-meter radius zone of complete silence for 1 hour. No sound can be created or heard within this zone - this includes speech, footsteps, gunshots, and Entity vocalizations. Creatures within cannot communicate verbally or use sound-based abilities. Stealth checks within the zone automatically succeed against sound-based detection.",
    tags: ["Anomalous", "Rare", "Stealth"],
    variants: [
      {
        name: "Diluted Liquid Silence",
        description: "A larger vial containing Liquid Silence that has been diluted with Almond Water, reducing its potency.",
        mechanical_effect: "Creates a 5-meter radius zone of muffled sound for 30 minutes. Sounds are heavily dampened but not eliminated. Add 2 Boost dice to Stealth checks within the zone.",
        buy_price: 300,
        sell_price: 90,
        encumbrance: 0,
        fuel_type: null,
        fuel_duration: null,
        rarity: 4,
        chance: 25
      },
      {
        name: "Concentrated Liquid Silence",
        description: "A tiny vial of pure, undiluted Liquid Silence. The liquid is almost black and seems to devour light as well as sound.",
        mechanical_effect: "Creates a 20-meter radius zone of complete silence AND darkness for 2 hours. Light sources within the zone are suppressed to half their normal radius. Entities that rely on sound are Disoriented while in the zone.",
        buy_price: 2500,
        sell_price: 750,
        encumbrance: 0,
        fuel_type: null,
        fuel_duration: null,
        rarity: 9,
        chance: 5
      }
    ],
    repairSkill: null,
    craftable: false,
    sessionVisibility: {}
  },

  // CONSTRUCT EXAMPLE - Reinforced Barricade
  {
    id: "reinforced-barricade",
    name: "Reinforced Barricade",
    type: "Construct",
    rarity: 3,
    buy_price: 0,
    sell_price: 0,
    encumbrance: 0,
    uses: null,
    fuel_type: null,
    fuel_duration: null,
    description: "A sturdy defensive barrier constructed from metal sheets, wooden planks, and steel reinforcement bars. The barricade stands about 1.5 meters tall and 3 meters wide, with firing ports cut into the upper section. Sandbags reinforce the base.",
    mechanical_effect: "Characters taking cover behind the barricade gain +2 Ranged Defense and add 2 to their Soak against attacks from the opposite side. The barricade completely blocks line of sight for targeting purposes unless using the firing ports. Moving through the barricade requires climbing over (Average Athletics check) or destroying it.",
    tags: ["Defensive", "Urban", "Industrial", "Fortification"],
    variants: [],
    health_points: 80,
    soak: 5,
    defense: 0,
    construct_category: "Defensive",
    placement_requirements: "Requires a 4×2 meter area of relatively level ground. Cannot be placed on stairs, slopes greater than 15 degrees, or unstable terrain. Must be anchored to floor or ground.",
    benefits: "+2 Ranged Defense, +2 Soak from cover, blocks line of sight. Firing ports allow attacking without leaving cover.",
    capacity: 4,
    repairSkill: "Mechanics",
    craftable: true,
    sessionVisibility: {}
  }
];

export default data;