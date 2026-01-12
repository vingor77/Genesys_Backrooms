const data = [
  {
    id: "haven-trading-post",
    name: "Haven Trading Post",
    aliases: ["The Haven", "Trader's Rest", "Crossroads Market"],
    
    location: "Level 1",
    controllingFaction: "Backroom Colonists",
    residentFactions: ["M.E.G.", "Wanderers Union"],
    
    status: "Active",
    classification: "Trading Post",
    
    founded: "2018",
    size: "Medium compound (200m x 150m)",
    
    population: {
      personnel: 45,
      civilians: 180,
      stationedSubGroups: [
        {
          subGroupId: "trade-guard-alpha",
          factionId: "backroom-colonists",
          personnel: 20,
          purpose: "Security and trade route protection"
        },
        {
          subGroupId: "meg-liaison-team",
          factionId: "meg",
          personnel: 5,
          purpose: "Diplomatic presence and intelligence gathering"
        }
      ]
    },
    
    defenses: {
      rating: 5,
      description: "Moderate fortifications with emphasis on deterrence rather than heavy defense. Multiple checkpoints and a well-trained militia provide reasonable security for a trading post.",
      physicalDefenses: {
        walls: "Reinforced wooden palisade with sheet metal reinforcement, 3 meters tall",
        gates: "Two main gates with steel-reinforced doors and guard posts",
        barriers: ["Sandbag emplacements at gates", "Retractable spike strips on main road", "Emergency barricade positions"],
        traps: ["Alarm tripwires on perimeter", "Concealed pit traps on unauthorized approach routes"]
      },
      securityForces: {
        total: 35,
        assignedSubGroups: [
          {
            subGroupId: "trade-guard-alpha",
            factionId: "backroom-colonists",
            personnel: 20,
            role: "Primary perimeter security and gate operations"
          },
          {
            subGroupId: "haven-militia",
            factionId: "independent",
            personnel: 15,
            role: "Internal security and emergency response"
          }
        ],
        equipment: ["Crossbows", "Melee weapons", "Basic body armor", "Radios", "Flashlights"],
        training: "Mixed - professional guards supplemented by trained civilians"
      },
      surveillance: {
        cameras: "Basic CCTV at gates and market square",
        sensors: ["Motion sensors on walls", "Sound detection at key points"],
        coverage: "70% of public areas, blind spots in residential section"
      },
      responseProtocols: {
        entityBreach: "Sound general alarm, evacuate civilians to central bunker, security teams engage while evacuation proceeds",
        hostileFaction: "Seal gates, arm militia, send runners to allied outposts for assistance",
        internalThreat: "Detain suspects, alert leadership, investigate before escalation"
      },
      weaknesses: ["Wooden walls vulnerable to fire", "Limited ranged weapons", "Single water source outside walls", "No aerial defenses"],
      lastUpgraded: "2023"
    },
    
    economy: {
      autoUpdate: true,
      lastUpdated: "2025-01-05",
      updateInterval: "weekly",
      supplies: [
        {
          resourceId: "preserved-food",
          availability: "Abundant",
          quantity: 500,
          price: 2,
          source: "Local farming and foraging operations",
          expiresOn: "2025-01-12"
        },
        {
          resourceId: "basic-tools",
          availability: "Available",
          quantity: 50,
          price: 15,
          source: "Salvage operations and local crafting",
          expiresOn: "2025-01-12"
        },
        {
          resourceId: "rope",
          availability: "Abundant",
          quantity: 200,
          price: 3,
          source: "Rope-making workshop in compound",
          expiresOn: "2025-01-12"
        }
      ],
      demands: [
        {
          resourceId: "medical-supplies",
          urgency: "High",
          quantityNeeded: 100,
          willingToPay: 8,
          reason: "Recent illness outbreak depleted medical stores",
          expiresOn: "2025-01-12"
        },
        {
          resourceId: "ammunition",
          urgency: "Medium",
          quantityNeeded: 200,
          willingToPay: 5,
          reason: "Security forces running low on crossbow bolts",
          expiresOn: "2025-01-12"
        },
        {
          resourceId: "almond-water",
          urgency: "Low",
          quantityNeeded: 50,
          willingToPay: 2,
          reason: "Always needed for trade and medicinal purposes",
          expiresOn: "2025-01-12"
        }
      ]
    },
    
    layout: {
      description: "A compact trading post built around a central market square. The compound is roughly rectangular with the main gate facing a safe corridor in Level 1. Buildings are a mix of salvaged materials and purpose-built structures.",
      rooms: [
        {
          id: "main-gate",
          name: "Main Gate",
          description: "The primary entrance to Haven. A sturdy gatehouse with guard posts on either side. Visitors are checked for weapons and contraband before entry.",
          connections: {
            north: {
              destination: "entry-corridor",
              description: "A short path leading into the compound"
            },
            south: {
              destination: "level-1",
              description: "Exit to Level 1's yellow corridors"
            }
          },
          facilitiesHere: ["gatehouse-security"]
        },
        {
          id: "entry-corridor",
          name: "Entry Corridor",
          description: "A wide pathway between the gate and the market. Lined with notice boards, wanted posters, and advertisements for local businesses.",
          connections: {
            north: "market-square",
            south: "main-gate",
            east: "warehouse-district",
            west: "residential-quarter"
          },
          facilitiesHere: []
        },
        {
          id: "market-square",
          name: "Market Square",
          description: "The heart of Haven - a bustling open area surrounded by vendor stalls and shops. The smell of cooking food mingles with the sounds of haggling merchants.",
          connections: {
            south: "entry-corridor",
            east: "craftsman-row",
            west: "tavern-district",
            north: "admin-building"
          },
          facilitiesHere: ["central-market", "food-stalls", "message-board"]
        },
        {
          id: "warehouse-district",
          name: "Warehouse District",
          description: "Several large storage buildings house trade goods, supplies, and equipment. Guards patrol regularly to prevent theft.",
          connections: {
            west: "entry-corridor",
            north: "craftsman-row"
          },
          facilitiesHere: ["main-warehouse", "cold-storage"]
        },
        {
          id: "residential-quarter",
          name: "Residential Quarter",
          description: "Rows of small dwellings house Haven's permanent residents. The atmosphere is quieter here, with families and long-term settlers.",
          connections: {
            east: "entry-corridor",
            north: "tavern-district"
          },
          facilitiesHere: ["resident-housing", "community-well"]
        },
        {
          id: "craftsman-row",
          name: "Craftsman Row",
          description: "A street of workshops where Haven's artisans produce goods. The clang of hammers and smell of leather fill the air.",
          connections: {
            west: "market-square",
            south: "warehouse-district"
          },
          facilitiesHere: ["blacksmith-forge", "leather-workshop", "carpentry-shop"]
        },
        {
          id: "tavern-district",
          name: "Tavern District",
          description: "Entertainment and relaxation area featuring the Wanderer's Rest tavern and a small inn. Music and laughter can be heard at most hours.",
          connections: {
            east: "market-square",
            south: "residential-quarter"
          },
          facilitiesHere: ["wanderers-rest-tavern", "haven-inn"]
        },
        {
          id: "admin-building",
          name: "Administration Building",
          description: "The governing center of Haven where the Council of Traders meets. Also houses the medical clinic and records office.",
          connections: {
            south: "market-square"
          },
          facilitiesHere: ["council-chambers", "medical-clinic", "records-office"]
        }
      ]
    },
    
    facilities: [
      {
        id: "gatehouse-security",
        name: "Main Gatehouse",
        type: "Security Post",
        description: "The primary security checkpoint for Haven. All visitors are logged and checked before entry. Known troublemakers may be denied access.",
        layout: {
          size: "Small building, 10m x 8m",
          features: ["Guard booth", "Weapon lockup", "Holding cell", "Logbook station"],
          atmosphere: "Professional and slightly tense - guards take their job seriously"
        },
        operatedBy: {
          factionId: "backroom-colonists",
          managerId: "captain-hayes",
          staff: 8
        },
        services: ["Entry processing", "Weapon storage", "Security escort requests", "Bounty postings"],
        hours: "24/7",
        accessRestrictions: "Open to all - required for entry"
      },
      {
        id: "central-market",
        name: "Central Market",
        type: "Market",
        description: "The main trading hub of Haven featuring 20+ vendor stalls selling everything from food to weapons. Prices are fair and haggling is expected.",
        layout: {
          size: "Large open area, 50m x 40m",
          features: ["Covered stalls", "Central fountain (non-functional)", "Merchant booths", "Trade scales"],
          atmosphere: "Bustling and noisy, always crowded during trading hours"
        },
        operatedBy: {
          factionId: "backroom-colonists",
          managerId: "market-master-chen",
          staff: 5
        },
        services: ["General goods trading", "Currency exchange", "Trade dispute resolution", "Stall rental"],
        hours: "0600-2200 daily",
        accessRestrictions: "Open to all, 2 almond water market fee for non-residents"
      },
      {
        id: "wanderers-rest-tavern",
        name: "The Wanderer's Rest",
        type: "Tavern",
        description: "Haven's most popular gathering spot. Serves food, drinks, and stories. A good place to find information, companions, or trouble.",
        layout: {
          size: "Medium building, 25m x 20m",
          features: ["Main bar", "Private booths", "Fireplace", "Stage for performers", "Back room for private meetings"],
          atmosphere: "Warm and welcoming, smell of cooking meat and spilled ale"
        },
        operatedBy: {
          factionId: "independent",
          managerId: "barkeep-sal",
          staff: 6
        },
        services: ["Food and drink", "Rumors and information", "Entertainment", "Private meeting room rental", "Job postings"],
        hours: "1000-0200 daily",
        accessRestrictions: "Open to all, troublemakers banned"
      },
      {
        id: "medical-clinic",
        name: "Haven Medical Clinic",
        type: "Medical Bay",
        description: "A small but well-equipped clinic run by a former Frontrooms nurse. Provides basic medical care and trauma treatment.",
        layout: {
          size: "Small building, 15m x 12m",
          features: ["Examination room", "4 patient beds", "Medicine storage", "Surgical area"],
          atmosphere: "Clean and sterile, smell of antiseptic"
        },
        operatedBy: {
          factionId: "independent",
          managerId: "doctor-amara",
          staff: 3
        },
        services: ["Wound treatment", "Disease diagnosis", "Surgery (limited)", "Medicine dispensing", "Health checkups"],
        hours: "0800-2000, emergency 24/7",
        accessRestrictions: "Open to all, payment required for non-emergency care"
      },
      {
        id: "blacksmith-forge",
        name: "Iron Haven Forge",
        type: "Workshop",
        description: "A working forge where weapons, tools, and metal goods are crafted and repaired. The smith is known for quality work.",
        layout: {
          size: "Medium workshop, 20m x 15m",
          features: ["Forge and anvil", "Tool racks", "Cooling trough", "Display of finished goods"],
          atmosphere: "Hot and loud, sparks flying, smell of hot metal"
        },
        operatedBy: {
          factionId: "independent",
          managerId: "smith-korgan",
          staff: 2
        },
        services: ["Weapon crafting", "Tool making", "Metal repairs", "Custom orders", "Weapon sharpening"],
        hours: "0700-1900, closed Sundays",
        accessRestrictions: "Open to all"
      }
    ],
    
    threats: [
      "Occasional Hound sightings in corridors near the outpost",
      "Bandit groups operating on trade routes",
      "Structural instability in the northeast section of Level 1",
      "Rival traders spreading false rumors to damage Haven's reputation"
    ],
    
    history: [
      {
        period: "2018 - 2020",
        title: "Founding Years",
        events: [
          {
            year: "2018",
            event: "Haven Established",
            details: "A group of Backroom Colonists discover a defensible position in Level 1 and establish a small trading post."
          },
          {
            year: "2019",
            event: "First Major Trade Deal",
            details: "Haven brokers a significant trade agreement with M.E.G., establishing legitimacy as a neutral trading hub."
          },
          {
            year: "2020",
            event: "Wall Construction Complete",
            details: "The wooden palisade is completed, dramatically improving security and attracting more permanent residents."
          }
        ]
      },
      {
        period: "2021 - Present",
        title: "Growth and Prosperity",
        events: [
          {
            year: "2021",
            event: "Population Boom",
            details: "Word spreads of Haven's relative safety, drawing refugees and traders. Population triples in one year."
          },
          {
            year: "2022",
            event: "The Bandit War",
            details: "A bandit confederation attacks Haven. After a three-day siege, defenders repel the attackers with M.E.G. assistance."
          },
          {
            year: "2023",
            event: "Security Upgrade",
            details: "Following the attack, significant improvements are made to defenses and a formal militia is established."
          },
          {
            year: "2024",
            event: "Trade Route Expansion",
            details: "New trade routes established to Level 2 and Level 4, increasing Haven's economic importance."
          }
        ]
      }
    ],
    
    access: {
      entrances: [
        {
          method: "Walk through Main Gate from Level 1 corridor",
          appearance: "Large wooden gate with metal reinforcement, two guard towers flanking. Signs reading 'HAVEN TRADING POST - ALL WELCOME'",
          restrictions: "All visitors checked at gate. Known hostile faction members denied entry. Weapons must be peace-bonded."
        },
        {
          method: "Service entrance on east side (requires permission)",
          appearance: "Smaller reinforced door, usually closed, single guard post",
          restrictions: "Merchants with bulk goods only, requires prior arrangement"
        }
      ],
      exits: [
        {
          destination: "level-1",
          method: "Exit through Main Gate",
          restrictions: null
        },
        {
          destination: "level-2",
          method: "Trade caravan escort (departs weekly)",
          restrictions: "Must join caravan, 10 almond water fee"
        },
        {
          destination: "level-4",
          method: "Through the old maintenance tunnel (dangerous)",
          restrictions: "Locals discourage use due to entity activity"
        }
      ],
      generalRestrictions: "Haven welcomes all peaceful travelers. Weapons must be peace-bonded (secured so they cannot be quickly drawn). Open hostility or theft results in immediate expulsion and potential bounty. Known members of hostile groups (to be determined by DM) may be denied entry."
    },
    
    dmNotes: {
      howToRun: "Haven should feel like a breath of fresh air after the dangers of the Backrooms. It's bustling, noisy, and alive. NPCs have their own concerns and aren't just waiting for the players. The market is always active, the tavern always has patrons, and there's always gossip to overhear.\n\nUse Haven as a home base where players can rest, resupply, and gather information. The various factions present (Colonists, M.E.G., independents) provide natural sources of quests and intrigue. The economy system creates organic quest hooks - if medical supplies are critically needed, that's an adventure waiting to happen.\n\nDon't let Haven feel completely safe though. Mention guards, locked doors, and the ever-present reality that the Backrooms are just outside. Random encounters with shady characters, pickpockets, or drunk troublemakers keep things interesting.",
      questHooks: [
        "Medical supplies critically low - someone needs to raid an abandoned hospital on Level 2",
        "Bandits attacking trade caravans - guards need backup for the next supply run",
        "Strange disappearances in the residential quarter at night",
        "A merchant claims a competitor is selling cursed goods",
        "The water source outside the walls is becoming contaminated",
        "A M.E.G. agent needs discrete help investigating a suspected infiltrator",
        "An old resident claims there's a hidden room beneath the marketplace",
        "A wanderer arrives with news of a new, unexplored level nearby",
        "The blacksmith needs a rare material from a dangerous level",
        "Tensions rising between resident factions - someone needs to mediate"
      ],
      sessionNotes: {}
    },
    
    sessionVisibility: {},
    tags: ["trading-hub", "safe-zone", "neutral-ground", "quest-central", "level-1", "colonist-controlled"]
  }
];

export default data;