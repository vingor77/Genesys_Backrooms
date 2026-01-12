const data = [
  {
    "id": "wanderers-guild",
    "groupName": "The Wanderer's Guild",
    "abbreviation": "T.W.G.",
    "formerNames": ["Pathfinder Collective", "The Lost Ones Society"],
    "motto": "Every step forward is a step home.",
    "primaryType": ["Exploratory", "Survival/Refuge", "Trading/Commerce"],
    "knownFor": "A loose confederation of experienced wanderers who share knowledge, trade supplies, and help newcomers survive. Known for their extensive maps and survival guides.",
    
    "metrics": {
      "influence": 5,
      "hostility": 2,
      "organization": 4
    },
    
    "overview": {
      "description": "The Wanderer's Guild emerged organically from the need for cooperation in the hostile environment of the Backrooms. Unlike rigid hierarchical organizations, the Guild operates as a decentralized network of experienced survivors who share a common code: help those who need it, share knowledge freely, and never abandon a fellow wanderer.\n\nMembers range from veteran explorers who've mapped dozens of levels to traders who maintain supply routes between safe zones. The Guild maintains several waystation outposts where travelers can rest, resupply, and exchange information.\n\nWhile lacking the military might of larger factions, the Guild's true strength lies in its extensive knowledge base and the loyalty of its members. A Guild waymark carved into a wall is a universally recognized sign of nearby safety.",
      "foundingYear": 1952,
      "estimatedMembers": 2500,
      "estimatedCivilians": 500
    },
    
    "ideology": {
      "politicalAlignment": "Anarchist Collective",
      "religiousAlignment": "Secular",
      "coreBeliefs": [
        "Knowledge should be freely shared",
        "No wanderer left behind",
        "Survival through cooperation",
        "Respect for all who struggle to survive",
        "Independence from larger political powers"
      ],
      "inPractice": "The Guild genuinely lives by its ideals, though this sometimes leads to conflict with more territorial factions who see their open information sharing as a threat. Some members have been accused of being naive about the dangers of helping strangers indiscriminately."
    },
    
    "currency": {
      "hasCurrency": true,
      "coinName": "Test",
      "almondWaterConversion": 2
    },
    
    "leadership": {
      "structure": [
        {
          "position": "Pathkeeper",
          "count": 7,
          "description": "Senior members who've demonstrated exceptional knowledge and service. They guide major decisions through consensus.",
          "powers": "Can call Guild meetings, authorize new waystations, mediate disputes between members, and grant full membership.",
          "limitations": "Cannot make unilateral decisions - all major choices require majority agreement among Pathkeepers.",
          "notableMembers": [
            {
              "poiId": "elena-vasquez",
              "designation": "Pathkeeper of the Southern Routes"
            },
            {
              "poiId": "old-tom",
              "designation": "Pathkeeper Emeritus"
            }
          ]
        },
        {
          "position": "Wayfinder",
          "count": 45,
          "description": "Experienced members who lead expeditions, maintain waystations, and train newcomers.",
          "powers": "Can accept provisional members, lead expeditions, and manage individual waystations.",
          "limitations": "Must report significant decisions to Pathkeepers. Cannot commit Guild resources without approval.",
          "notableMembers": []
        },
        {
          "position": "Member",
          "count": 2448,
          "description": "Full members who've proven their commitment to Guild values through service.",
          "powers": "Access to all Guild resources, waystations, and knowledge. Can vote on major decisions.",
          "limitations": "Cannot lead official expeditions without Wayfinder supervision.",
          "notableMembers": []
        }
      ]
    },
    
    "subGroups": [
      {
        "id": "twg-cartography-circle",
        "name": "Cartography Circle",
        "description": "Dedicated mapmakers who compile, verify, and distribute Guild maps. They maintain the Master Atlas - the most comprehensive map collection outside the M.E.G.",
        "focus": "Mapping new levels and maintaining accurate navigation resources",
        "headId": "marcus-chen",
        "teams": [
          {
            "id": "team-survey-alpha",
            "name": "Survey Team Alpha",
            "overseers": ["marcus-chen"],
            "personnel": 8,
            "specialization": "Primary exploration and initial mapping of unknown levels"
          },
          {
            "id": "team-verification",
            "name": "Verification Team",
            "overseers": ["sara-okonkwo"],
            "personnel": 12,
            "specialization": "Cross-referencing and verifying submitted maps for accuracy"
          }
        ]
      },
      {
        "id": "twg-supply-network",
        "name": "Supply Network",
        "description": "Traders and couriers who maintain supply lines between waystations and facilitate barter between members.",
        "focus": "Resource distribution and trade route maintenance",
        "headId": "dmitri-volkov",
        "teams": [
          {
            "id": "team-runners",
            "name": "The Runners",
            "overseers": ["dmitri-volkov", "anna-bell"],
            "personnel": 20,
            "specialization": "Fast courier service between established waystations"
          }
        ]
      },
      {
        "id": "twg-welcome-committee",
        "name": "Welcome Committee",
        "description": "Members who patrol entry points to help newly-arrived wanderers survive their first days.",
        "focus": "Newcomer rescue and orientation",
        "headId": null,
        "teams": [
          {
            "id": "team-level-0-watch",
            "name": "Level 0 Watch",
            "overseers": ["jenny-zhao"],
            "personnel": 15,
            "specialization": "Monitoring Level 0 for new arrivals and providing immediate assistance"
          }
        ]
      }
    ],
    
    "keyNPCs": [
      {
        "poiId": "elena-vasquez",
        "rolePurpose": "Pathkeeper - Primary quest giver for exploration missions, maintains southern route maps"
      },
      {
        "poiId": "old-tom",
        "rolePurpose": "Pathkeeper Emeritus - Living encyclopedia of Backrooms lore, retired from active duty but advises on dangerous expeditions"
      },
      {
        "poiId": "jenny-zhao",
        "rolePurpose": "Welcome Committee Lead - First contact for new players in Level 0, provides starting equipment and orientation"
      },
      {
        "poiId": "dmitri-volkov",
        "rolePurpose": "Supply Network Head - Merchant contact for trading, can source rare items given time"
      }
    ],
    
    "territory": {
      "headquarters": "Waystation Prime",
      "outposts": [
        {
          "outpostId": "waystation-prime",
          "name": "Waystation Prime",
          "location": "Level 1"
        },
        {
          "outpostId": "crossroads-cache",
          "name": "Crossroads Cache",
          "location": "Level 4"
        },
        {
          "outpostId": "deep-haven",
          "name": "Deep Haven",
          "location": "Level 6"
        },
        {
          "outpostId": null,
          "name": "The Lighthouse",
          "location": "Level 11"
        }
      ]
    },
    
    "relations": [
      {
        "factionId": "meg",
        "relationId": null,
        "status": "Friendly",
        "coinExchangeRate": 0.9,
        "quickSummary": "Cooperative relationship. M.E.G. respects Guild's exploration expertise; Guild appreciates M.E.G.'s protection but maintains independence."
      },
      {
        "factionId": "backrooms-robotics",
        "relationId": null,
        "status": "Neutral",
        "coinExchangeRate": 0.8,
        "quickSummary": "Limited contact. Guild members trade for tech supplies but are wary of corporate motives."
      },
      {
        "factionId": "crimson-raiders",
        "relationId": null,
        "status": "Hostile",
        "coinExchangeRate": 0,
        "quickSummary": "Raiders have attacked Guild waystations multiple times. Kill-on-sight for known Raider members."
      }
    ],
    
    "history": [
      {
        "period": "1952 - 1960",
        "title": "The Founding",
        "events": [
          {
            "year": "1952",
            "event": "First Meeting",
            "details": "A group of seven wanderers who'd independently survived for years met by chance in Level 4. They agreed to share knowledge and look out for each other - the first informal Guild gathering."
          },
          {
            "year": "1955",
            "event": "The Pathfinder Code",
            "details": "The original seven codified their principles into the Pathfinder Code, establishing the Guild's core values. They began carving waymarks to help others navigate."
          },
          {
            "year": "1958",
            "event": "First Waystation",
            "details": "The Guild established its first permanent outpost in Level 1, offering shelter and supplies to passing wanderers. Word spread quickly."
          }
        ]
      },
      {
        "period": "1960 - 1990",
        "title": "Growth and Recognition",
        "events": [
          {
            "year": "1962",
            "event": "M.E.G. Contact",
            "details": "First formal contact with the M.E.G. After initial suspicion, the two groups established a cooperative relationship, sharing mapping data."
          },
          {
            "year": "1975",
            "event": "The Great Mapping Project",
            "details": "Guild cartographers began systematically mapping safe routes through Levels 0-10, creating the foundation of the Master Atlas."
          },
          {
            "year": "1988",
            "event": "Raider Wars Begin",
            "details": "The Crimson Raiders attacked Crossroads Cache, killing three Guild members. This began an ongoing conflict that continues today."
          }
        ]
      },
      {
        "period": "2000 - Present",
        "title": "Modern Era",
        "events": [
          {
            "year": "2016-2017",
            "event": "The Flicker",
            "details": "The Guild lost contact with several waystations during The Flicker. Deep Haven was overrun but later reclaimed. Membership dropped from 3,500 to 2,500."
          },
          {
            "year": "2020",
            "event": "Welcome Committee Founded",
            "details": "Increased influx of new wanderers led to the formal establishment of the Welcome Committee to help newcomers survive."
          },
          {
            "year": "Current",
            "event": "Rebuilding",
            "details": "The Guild focuses on rebuilding strength, establishing new waystations, and training the next generation of Wayfinders."
          }
        ]
      }
    ],
    
    "gameplay": {
      "playerCanJoin": true,
      "joinRequirements": "Complete the 'Lost and Found' quest (rescue a stranded wanderer) OR provide significant service to a waystation. Provisional membership granted immediately; full membership after 3 successful expeditions with Guild supervision.",
      "reputationEnabled": true,
      "benefits": "Access to all waystations (free lodging, supplies at cost), Guild maps and navigation data, expedition opportunities, training from experienced Wayfinders, emergency rescue service, trade network access",
      "drawbacks": "Expected to help fellow wanderers when able, must share discovered information with the Guild, may be called upon for rescue missions, no salary (barter economy), less protection than military factions"
    },
    
    "reputation": {},
    
    "dmNotes": {
      "howToRun": "The Wanderer's Guild should feel like a found family of survivors. They're genuine good guys in a world full of moral ambiguity - but they're also underpowered compared to groups like the M.E.G. Play up the warmth and camaraderie, but also the vulnerability.\n\nGuild members speak plainly and practically. No military jargon or corporate speak. They judge people by actions, not words. A helpful stranger gets the benefit of the doubt; someone who refuses to help others is viewed with suspicion.\n\nWaystations should feel like oases - warm lights in the darkness, the smell of cooking food, quiet conversations around a table. Contrast this with the hostile emptiness of the Backrooms.",
      "interactionGuidelines": "Guild members are helpful by default. They'll offer food, shelter, and basic supplies to anyone who isn't actively hostile. They ask for nothing in return but appreciate help.\n\nFor players with positive reputation: Treated like family. Given best supplies, insider information, and priority for expeditions.\n\nFor players with negative reputation: Politely refused service. 'We've heard things about you. Prove us wrong and we'll talk.'\n\nGuild members love to swap stories. They'll trade information freely and are excellent sources of level-specific lore and warnings.",
      "commonScenarios": "1. New players arrive in Level 0 - Jenny Zhao finds them, offers basic orientation and supplies\n2. Players need maps for a specific level - Visit Waystation Prime, trade information or service for access\n3. Rescue mission - Guild asks players to find overdue expedition team\n4. Raider attack - Players present when Crimson Raiders assault a waystation\n5. Membership test - Escort vulnerable wanderer to safety through dangerous level\n6. Supply run - Help Runners deliver critical supplies between waystations\n7. Mapping expedition - Join Survey Team exploring new level",
      "roleplayTips": "Pathkeepers: Wise, patient, speak from experience. They've seen everything and lost friends. Quietly authoritative.\n\nWayfinders: Competent and confident but not arrogant. Teacher mentality - want to share what they know.\n\nRegular Members: Diverse backgrounds united by shared trauma and purpose. Some are chatty, some quiet. All have stories.\n\nCommon phrases: 'Safe travels, wanderer.' 'The path provides.' 'We don't leave our own behind.'\n\nGuild members often have visible scars, worn equipment, and thousand-yard stares. They've survived things. But they smile easily among friends.",
      "balanceTips": "The Guild is NOT a deus ex machina:\n\n1. They can't fight large threats directly - they're survivors, not soldiers\n2. Their resources are limited - can't just hand out rare equipment\n3. They don't have presence in most levels - waystations are rare oases\n4. They won't risk members on suicide missions\n5. Their information isn't perfect - maps have errors, rumors aren't always true\n6. They have enemies who might attack players associated with them\n\nUse the Guild to provide starting support and occasional rest stops, not constant backup.",
      "questHooks": "1. The Lost Waystation: An expedition to The Lighthouse hasn't reported in weeks. What happened?\n2. Raider Retaliation: Crimson Raiders kidnapped a Pathkeeper. Rescue mission or negotiation?\n3. The Forger: Someone is creating fake Guild waymarks leading travelers into danger.\n4. Deep Level Mapping: Survey Team Alpha needs escort into Level 13 for first-ever mapping.\n5. Old Tom's Secret: The Pathkeeper Emeritus knows something about the Backrooms' origin but won't share.\n6. Supply Crisis: Raiders destroyed a supply cache. Emergency mission to establish new route.\n7. The Newcomer Wave: Unusual number of new arrivals overwhelming Welcome Committee. What's causing it?\n8. Traitor in the Ranks: Someone is feeding Raider positions to attack Guild caravans.",
      "sessionNotes": {}
    },
    
    "sessionVisibility": {},
    
    "tags": [
      "helpful",
      "exploratory",
      "decentralized",
      "survival-focused",
      "good-aligned",
      "trading",
      "newcomer-friendly",
      "underdog"
    ]
  }
];

export default data;