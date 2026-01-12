const data = [
  // Friendly Quest Giver / Faction Leader
  {
    id: "commander-hollow",
    name: "Commander Arthur Hollow",
    aliases: ["The Commander", "Hollow", "Old Man Hollow"],
    status: {
      primary: "Active",
      conditions: []
    },
    species: "Human",
    age: 52,
    gender: "Male",
    appearance: {
      height: "6'2\"",
      build: "Muscular but weathered",
      hair: "Gray, military cut, receding",
      eyes: "Blue-gray, intense",
      distinguishingFeatures: "Scar across left cheek from Level 6 incident. Always wears M.E.G. command badge.",
      fullDescription: "Tall, commanding presence with military bearing. Gray hair in regulation cut, piercing blue-gray eyes that seem to evaluate everyone. Weather-worn face with prominent scar. Always in pressed M.E.G. uniform with commander insignia."
    },
    voice: {
      accent: "Midwestern American",
      tone: "Authoritative but not harsh",
      pitch: "Deep baritone",
      speechPattern: "Speaks precisely, military terminology, pauses before important decisions",
      notableQuotes: [
        "We don't leave people behind. That's what separates us from the darkness.",
        "Every level mapped is another life saved. Remember that."
      ]
    },
    homeLevel: "level-1",
    currentLocation: {
      type: "Outpost",
      levelId: "level-11",
      outpostId: "meg-base-alpha",
      arrivedDate: "2020-06-15"
    },
    previousLocation: {
      type: "Outpost",
      levelId: "level-1",
      outpostId: "meg-first-light",
      departedDate: "2020-06-01",
      reason: "Promoted to Base Alpha commander"
    },
    affiliations: {
      primaryGroup: "M.E.G.",
      rank: "Commander",
      division: "Base Operations",
      formerGroups: [],
      relationshipStatus: "Active Member"
    },
    background: {
      origin: "Des Moines, Iowa",
      enteredBackrooms: "2005",
      discoveredBy: "Self-rescued from Level 0, found M.E.G. within 48 hours",
      backstory: "Former U.S. Army officer who no-clipped during a training exercise. Quickly adapted to the Backrooms and rose through M.E.G. ranks due to leadership skills and tactical expertise. Known for prioritizing rescue operations and maintaining high ethical standards."
    },
    accomplishments: [
      {
        title: "Established Base Alpha",
        date: "2015-03-20",
        description: "Founded M.E.G.'s primary forward operating base on Level 11"
      },
      {
        title: "Level 6 Rescue Operation",
        date: "2018-09-12",
        description: "Led team that rescued 27 wanderers trapped in Level 6 entity swarm"
      }
    ],
    personality: {
      traits: ["Disciplined", "Protective", "Pragmatic", "Fair"],
      demeanor: "Professional military bearing with genuine compassion for wanderers",
      genesysFramework: {
        motivation: "Justice - Protecting the innocent",
        strength: "Leadership - Inspires loyalty and confidence",
        flaw: "Overprotective - Takes too much responsibility for others' safety",
        desire: "Establish safe zones throughout the Backrooms where people can live normally"
      },
      fears: ["Losing soldiers under his command", "M.E.G. becoming corrupt"],
      quirks: "Always checks his watch before making important decisions, never drinks coffee after noon",
      mentalState: "Stable, though carries burden of command"
    },
    characteristics: {
      brawn: 3,
      agility: 2,
      intellect: 3,
      cunning: 3,
      willpower: 4,
      presence: 4
    },
    derived: {
      soak: 5,
      woundsThreshold: 15,
      strainThreshold: 14,
      meleeDefense: 0,
      rangedDefense: 1
    },
    skills: {
      leadership: 4,
      ranged: 3,
      discipline: 3,
      perception: 2,
      knowledge: 2,
      tactics: 3
    },
    talents: [
      {
        name: "Commanding Presence",
        tier: 2,
        description: "Remove 1 Setback die per rank from Leadership and Discipline checks"
      },
      {
        name: "Tactical Insight",
        tier: 1,
        description: "Once per session, may add automatic Success to ally's combat check"
      }
    ],
    abilities: [
      {
        name: "Rally the Troops",
        type: "Active",
        description: "As maneuver, may allow allies within Medium range to recover 2 Strain"
      }
    ],
    strengths: ["Excellent tactician", "Inspires loyalty", "Stays calm under pressure"],
    weaknesses: ["Not exceptional in direct combat", "Can be too trusting of M.E.G. members"],
    combatBehavior: {
      aggressiveness: "Tactical",
      preferredRange: "Medium",
      tactics: "Commands from mid-range, uses cover, focuses on supporting allies and coordinating team efforts. Will retreat to protect his people.",
      fleeThreshold: 5
    },
    equipment: {
      equipped: {
        head: "meg-combat-helmet",
        chest: "meg-tactical-vest",
        arms: null,
        legs: null,
        feet: "combat-boots",
        ears: "radio-headset",
        neck: null,
        wrist: null,
        ringLeft: null,
        ringRight: null,
        mainHand: "m9-pistol",
        offhand: null
      },
      inventory: ["almond-water", "first-aid-kit", "radio", "level-map"],
      signatureItems: [
        {
          name: "Commander's Badge",
          description: "Gold-plated M.E.G. command insignia. Only 12 exist.",
          effect: "+1 Boost die to Leadership checks when dealing with M.E.G. members"
        }
      ]
    },
    movement: {
      profileId: "soldier-on-patrol",
      overrides: {},
      custom: null,
      lastEncounterDate: null,
      lastMoveDate: "2020-06-01"
    },
    relationships: [
      {
        poiId: "sergeant-chen",
        name: "Sergeant Maria Chen",
        relationshipType: "Subordinate",
        description: "Trusted second-in-command at Base Alpha. Chen handles day-to-day operations."
      }
    ],
    interaction: {
      hostilityLevel: "Friendly",
      willingnessToHelp: "High",
      communicationStyle: "Direct and professional. Asks probing questions to assess trustworthiness. Offers help readily to those in need.",
      typicalRequests: [
        "Escort supply convoy between outposts",
        "Investigate anomalous activity on nearby level",
        "Rescue missing M.E.G. team"
      ],
      rewardsOffered: [
        "M.E.G. tokens",
        "Equipment from quartermaster",
        "Safe shelter at base",
        "Letters of recommendation"
      ],
      dangers: "None if players are friendly. Will defend base aggressively if threatened."
    },
    storyHooks: [
      {
        title: "The Missing Patrol",
        description: "Commander needs players to find patrol that hasn't reported in 3 days",
        questId: "quest-missing-patrol"
      }
    ],
    sleepSchedule: "2300-0600 (11 PM - 6 AM)",
    tags: ["Quest Giver", "Faction Leader", "Vendor Access", "Story Critical"],
    dmNotes: {
      howToRun: "Play Hollow as a firm but fair military commander who genuinely cares about protecting people. He's seen a lot of horror in the Backrooms but hasn't lost his humanity.",
      roleplayTips: "Speak with confidence and authority. Pause before important decisions. Use military terminology naturally but don't overdo it.",
      combatTactics: "Hollow fights smart, not hard. He uses cover, coordinates with allies, and focuses on keeping everyone alive.",
      sessionNotes: {}
    },
    sessionVisibility: {}
  },

  // Wandering Trader - Neutral
  {
    id: "trader-jackson",
    name: "Marcus 'Lucky' Jackson",
    aliases: ["Lucky", "The Trader", "Jackson"],
    status: {
      primary: "Active",
      conditions: []
    },
    species: "Human",
    age: 38,
    gender: "Male",
    appearance: {
      height: "5'10\"",
      build: "Average, slightly overweight",
      hair: "Black, dreadlocks tied back",
      eyes: "Brown, constantly scanning surroundings",
      distinguishingFeatures: "Always wears lucky charm necklace, backpack covered in patches from different levels",
      fullDescription: "Middle-aged trader with dreadlocks and friendly demeanor. Wears practical traveling clothes and oversized backpack. Covered in trinkets and charms."
    },
    voice: {
      accent: "Caribbean (Jamaica)",
      tone: "Friendly, jovial",
      pitch: "Medium, warm",
      speechPattern: "Speaks casually, uses a lot of trading metaphors, laughs easily",
      notableQuotes: [
        "Everything's got a price, friend. Question is, what're you willing to pay?",
        "Been to levels you haven't even dreamed of. Got the goods to prove it."
      ]
    },
    homeLevel: "level-11",
    currentLocation: {
      type: "Roaming",
      levelId: "level-6",
      outpostId: null,
      arrivedDate: "2025-01-10"
    },
    previousLocation: {
      type: "Outpost",
      levelId: "level-11",
      outpostId: "bntg-trading-post",
      departedDate: "2025-01-08",
      reason: "Heading to new trading route"
    },
    affiliations: {
      primaryGroup: "B.N.T.G.",
      rank: "Independent Trader",
      division: null,
      formerGroups: [],
      relationshipStatus: "Active Member"
    },
    background: {
      origin: "Kingston, Jamaica",
      enteredBackrooms: "2015",
      discoveredBy: "Found by B.N.T.G. patrol, immediately started trading",
      backstory: "Former street vendor who adapted remarkably well to the Backrooms. Saw opportunity where others saw horror. Built reputation as reliable trader."
    },
    accomplishments: [
      {
        title: "First Trader to Level 47",
        date: "2019-11-03",
        description: "Established first trading route to the dangerous Level 47"
      }
    ],
    personality: {
      traits: ["Opportunistic", "Friendly", "Risk-taker", "Resourceful"],
      demeanor: "Easy-going and approachable, but shrewd in business",
      genesysFramework: {
        motivation: "Greed - Accumulating wealth and rare items",
        strength: "Resourceful - Always finds a way to get what's needed",
        flaw: "Greedy - Sometimes takes unnecessary risks for profit",
        desire: "Build the most successful trading empire in the Backrooms"
      },
      fears: ["Owing debts he can't repay", "Losing his lucky charm"],
      quirks: "Touches his lucky charm before every major decision, haggles even when not necessary",
      mentalState: "Stable"
    },
    characteristics: {
      brawn: 2,
      agility: 3,
      intellect: 3,
      cunning: 4,
      willpower: 3,
      presence: 4
    },
    derived: {
      soak: 3,
      woundsThreshold: 12,
      strainThreshold: 13,
      meleeDefense: 0,
      rangedDefense: 1
    },
    skills: {
      negotiation: 4,
      charm: 3,
      streetwise: 3,
      perception: 3,
      stealth: 2,
      survival: 2,
      ranged: 1
    },
    talents: [
      {
        name: "Smooth Talker",
        tier: 2,
        description: "Upgrade Charm and Negotiation checks once per rank"
      }
    ],
    abilities: [
      {
        name: "Know a Guy",
        type: "Active",
        description: "Once per session, can locate any specific item or person with successful Streetwise check"
      }
    ],
    strengths: ["Master negotiator", "Extensive knowledge of levels", "Well-connected"],
    weaknesses: ["Not a fighter", "Can be bought", "Overconfident in his luck"],
    combatBehavior: {
      aggressiveness: "Flee-Oriented",
      preferredRange: "Long",
      tactics: "Avoids combat whenever possible. If forced to fight, uses distractions and escape routes.",
      fleeThreshold: 8
    },
    equipment: {
      equipped: {
        head: null,
        chest: "travel-vest",
        arms: null,
        legs: null,
        feet: "hiking-boots",
        ears: null,
        neck: "lucky-charm",
        wrist: null,
        ringLeft: null,
        ringRight: null,
        mainHand: null,
        offhand: null
      },
      inventory: ["trading-goods", "almond-water", "level-maps", "currency-pouch"],
      signatureItems: [
        {
          name: "Lucky Charm Necklace",
          description: "Collection of small trinkets from every level he's visited",
          effect: "Once per session, may reroll a failed check (must keep second result)"
        }
      ]
    },
    movement: {
      profileId: "cautious-wanderer",
      overrides: {},
      custom: null,
      lastEncounterDate: null,
      lastMoveDate: "2025-01-08"
    },
    relationships: [],
    interaction: {
      hostilityLevel: "Neutral",
      willingnessToHelp: "Medium",
      communicationStyle: "Friendly but always has an angle. Makes everything feel like a potential deal.",
      typicalRequests: [
        "Escort to dangerous level for trading",
        "Retrieve specific item from risky location",
        "Deliver package to another trader"
      ],
      rewardsOffered: [
        "Rare items at fair prices",
        "Information about levels and factions",
        "Connections to other traders"
      ],
      dangers: "May sell information about players if profitable. Won't risk his life for them."
    },
    storyHooks: [
      {
        title: "The Rare Find",
        description: "Lucky has heard about an extremely rare item on a dangerous level and needs capable escorts",
        questId: null
      }
    ],
    sleepSchedule: "Variable - sleeps when safe",
    tags: ["Vendor", "Quest Giver", "Information Source", "Roaming NPC"],
    dmNotes: {
      howToRun: "Lucky is a businessman first. He's friendly but everything is transactional. Play him as genuinely likeable but make it clear his priority is profit.",
      roleplayTips: "Smile a lot, use trading metaphors, always seem to have what players need (for a price). Touch the lucky charm during tense moments.",
      combatTactics: "Lucky doesn't fight. He runs, hides, bargains, or surrenders.",
      sessionNotes: {}
    },
    sessionVisibility: {}
  }
];

export default data;