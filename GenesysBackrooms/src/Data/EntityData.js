const data = [
  // MINION - Crawling Husk (Pack Creature)
  {
    "id": "entity-crawling-husk",
    "name": "Crawling Husk",
    "aliases": ["Crawler", "Floor Feeder", "The Hungry"],
    "number": 7,
    
    "category": "Hostile",
    "adversaryType": "minion",
    "difficultyRating": 3,
    "challengeRating": {
      "solo": "easy",
      "groupSize": 1
    },
    
    "description": {
      "appearance": "A desiccated humanoid form that drags itself across the floor on broken, twisted limbs. Its skin is papery and translucent, revealing dried organs beneath. Empty eye sockets weep a black, tar-like substance that leaves trails wherever it goes.",
      "behaviorDescription": "Crawlers move in groups, attracted to sound and vibration. They pile onto isolated targets, attempting to overwhelm through numbers. When alone, they hide in dark corners and under debris, waiting for prey to pass.",
      "sounds": "Wet dragging sounds, occasional rasping breaths, clicking of broken joints against hard floors. Groups create a disturbing chorus of overlapping scraping noises.",
      "distinguishingFeatures": [
        "Moves exclusively by dragging along the ground",
        "Leaves black tar-like trails",
        "Empty, weeping eye sockets",
        "Papery translucent skin"
      ]
    },
    
    "characteristics": {
      "brawn": 2,
      "agility": 2,
      "intellect": 1,
      "cunning": 2,
      "willpower": 1,
      "presence": 1
    },
    
    "derived": {
      "soak": 2,
      "woundsThreshold": 4,
      "strainThreshold": 0,
      "meleeDefense": 0,
      "rangedDefense": 0
    },
    
    "skills": {
      "brawl": 1,
      "stealth": 2,
      "perception": 1
    },
    
    "talents": [],
    
    "abilities": [
      {
        "name": "Swarm Tactics",
        "type": "passive",
        "description": "When 3 or more Crawling Husks attack the same target in a round, they add 1 Boost die to all combat checks against that target.",
        "activation": null
      },
      {
        "name": "Low Profile",
        "type": "passive",
        "description": "Ranged attacks against Crawling Husks from Medium range or further add 1 Setback die due to their low, prone movement.",
        "activation": null
      }
    ],
    
    "equipment": {
      "naturalWeapons": [
        {
          "name": "Grasping Claws",
          "skill": "brawl",
          "damage": 3,
          "critical": 5,
          "range": "engaged",
          "qualities": ["Knockdown"]
        }
      ],
      "naturalArmor": null,
      "equipped": {
        "head": null,
        "chest": null,
        "mainHand": null,
        "offhand": null
      },
      "gear": []
    },
    
    "groupSize": {
      "min": 4,
      "max": 10
    },
    
    "spawnConditions": {
      "minimumDangerLevel": 2,
      "environmentalConditions": {
        "lightingRange": [0, 5],
        "temperatureRange": null,
        "atmosphereTypes": null,
        "atmosphereSeverity": null
      }
    },
    
    "bossEncounter": {
      "isBoss": false,
      "minionSpawns": [],
      "rivalSpawns": []
    },
    
    "movement": {
      "speed": 1,
      "roamInterval": 15,
      "movementType": "ground",
      "canClimb": false,
      "canSwim": false,
      "canFly": false
    },
    
    "senses": {
      "vision": "darkvision",
      "visionRange": 2,
      "hearingRange": 4,
      "specialSenses": ["tremorsense"]
    },
    
    "behavior": {
      "huntingStyle": "pack",
      "aggression": "aggressive",
      "intelligence": "animal",
      "packBehavior": "swarm",
      "tactics": "Swarm isolated targets, pile on to drag down prey. Avoid well-lit areas and groups of armed wanderers. Will sacrifice individuals to allow others to flank.",
      "retreatCondition": "When reduced to 2 or fewer individuals, or exposed to bright light (lighting 8+)",
      "communication": "none"
    },
    
    "chaseStats": {
      "canChase": true,
      "chaseSpeed": 0.7,
      "chaseDuration": 5,
      "maximumGap": 2,
      "chaseTriggers": [
        "Target runs from combat",
        "Smell of blood"
      ],
      "giveUpConditions": [
        "Target reaches bright light",
        "Target climbs to unreachable location",
        "Loses tremorsense contact"
      ]
    },
    
    "lootTable": {
      "dropsLoot": true,
      "lootItems": [
        {
          "itemId": "black-tar-residue",
          "spawnWeight": 80,
          "minQuantity": 1,
          "maxQuantity": 2
        },
        {
          "itemId": "bottlecaps",
          "spawnWeight": 20,
          "minQuantity": 1,
          "maxQuantity": 3
        }
      ],
      "specialDrops": [],
      "harvestableMaterials": [
        {
          "materialId": "crawler-sinew",
          "skillRequired": "survival",
          "difficulty": "easy",
          "quantity": 2,
          "description": "Extract the tough, fibrous tendons from the creature's limbs. Useful for crafting rope or bindings."
        }
      ]
    },
    
    "variants": [
      {
        "name": "Bloated Crawler",
        "description": "Overfed specimen that explodes on death",
        "spawnChance": 10,
        "modifications": {
          "difficultyRating": 4,
          "characteristics": {
            "brawn": 3
          },
          "derived": {
            "soak": 3,
            "woundsThreshold": 6,
            "strainThreshold": 0,
            "meleeDefense": 0,
            "rangedDefense": 0
          },
          "abilities": [
            {
              "name": "Death Burst",
              "type": "triggered",
              "description": "When reduced to 0 wounds, explodes in a spray of black tar. All characters at Engaged range must make a Hard (3 purple) Coordination check or suffer 4 damage and gain the Disoriented condition for 2 rounds.",
              "activation": "Upon death"
            }
          ]
        }
      }
    ],
    
    "tags": ["hostile", "pack", "dark-dwelling", "low-danger", "common"],
    
    "dmNotes": {
      "howToRun": "Run Crawlers as a minion group - they share a wound threshold. A group of 5 has 20 total wounds (4 per minion × 5). When the group takes 4 wounds, remove one minion from the group and reduce their skill dice accordingly. They should feel like a tide of bodies, not individual threats.",
      "tacticsTips": "Have them emerge from unexpected directions - under furniture, through vents, from piles of debris. Use their tremorsense to have them locate hiding players. Their slow speed means players can outrun them easily, but their numbers should create pressure. Perfect for teaching new players about minion mechanics.",
      "narrativeHooks": "Crawler infestations often indicate a recent death in the area - they're attracted to remains. Finding their trails can lead to supplies left by previous wanderers. A room full of Crawlers might be guarding something valuable they dragged there.",
      "commonMistakes": "Don't run them as solo encounters - they're only threatening in numbers. Don't forget their Low Profile ability against ranged attacks. Remember they can't climb, so elevated positions are safe.",
      "sessionNotes": {}
    },
    
    "sessionVisibility": {}
  },

  // RIVAL - The Watcher (Solo Stalker)
  {
    "id": "entity-watcher",
    "name": "The Watcher",
    "aliases": ["Silent Eye", "Corner Stalker", "The Patient One"],
    "number": 23,
    
    "category": "Hostile",
    "adversaryType": "rival",
    "difficultyRating": 6,
    "challengeRating": {
      "solo": "hard",
      "groupSize": 3
    },
    
    "description": {
      "appearance": "A tall, impossibly thin humanoid standing motionless in the peripheral vision. Its body is matte black and featureless except for a single massive eye that dominates its face - an eye that never blinks and seems to absorb light rather than reflect it. When it moves, it does so in jerky, stop-motion increments.",
      "behaviorDescription": "The Watcher stalks prey for hours or days, always staying at the edge of vision. It feeds on fear and paranoia, growing stronger the longer it observes. It only attacks when its prey is exhausted, isolated, and terrified. Staring directly at it causes it to freeze, but looking away allows it to move closer.",
      "sounds": "Complete silence. No footsteps, no breathing. The only sound is a faint static buzz that grows louder the closer it gets - but only the target can hear it.",
      "distinguishingFeatures": [
        "Single enormous unblinking eye",
        "Matte black featureless body",
        "Moves only when not directly observed",
        "Causes static noise only the target can hear"
      ]
    },
    
    "characteristics": {
      "brawn": 3,
      "agility": 4,
      "intellect": 2,
      "cunning": 4,
      "willpower": 3,
      "presence": 4
    },
    
    "derived": {
      "soak": 4,
      "woundsThreshold": 16,
      "strainThreshold": 12,
      "meleeDefense": 1,
      "rangedDefense": 2
    },
    
    "skills": {
      "brawl": 3,
      "stealth": 4,
      "vigilance": 3,
      "coercion": 3,
      "perception": 2
    },
    
    "talents": [
      {
        "name": "Stalker",
        "tier": 2,
        "description": "Add 1 Boost die to all Stealth and Coordination checks."
      }
    ],
    
    "abilities": [
      {
        "name": "Quantum Movement",
        "type": "passive",
        "description": "The Watcher can only move when no one is directly looking at it. If observed (character spends maneuver to watch), the Watcher cannot move that turn. However, maintaining observation requires a Hard (3 purple) Discipline check each round or the observer involuntarily looks away.",
        "activation": null
      },
      {
        "name": "Fear Feeder",
        "type": "passive",
        "description": "For each hour the Watcher has stalked its current target, it gains +1 damage on all attacks (maximum +5). This bonus resets if the target successfully escapes or the Watcher is wounded.",
        "activation": null
      },
      {
        "name": "Paralyzing Gaze",
        "type": "active",
        "description": "The Watcher focuses its eye on a single target at Short range. The target must make an opposed Discipline vs Coercion check. If the Watcher wins, the target is Staggered for 1 round and suffers 3 strain.",
        "activation": "Action"
      },
      {
        "name": "Static Veil",
        "type": "passive",
        "description": "Electronic devices malfunction within Short range of the Watcher. Flashlights flicker, radios produce only static, and digital displays scramble.",
        "activation": null
      }
    ],
    
    "equipment": {
      "naturalWeapons": [
        {
          "name": "Void Grasp",
          "skill": "brawl",
          "damage": 6,
          "critical": 3,
          "range": "engaged",
          "qualities": ["Pierce 2", "Stun Damage"]
        }
      ],
      "naturalArmor": {
        "name": "Light-Absorbing Skin",
        "soak": 1,
        "defense": 1
      },
      "equipped": {
        "head": null,
        "chest": null,
        "mainHand": null,
        "offhand": null
      },
      "gear": []
    },
    
    "groupSize": {
      "min": 1,
      "max": 1
    },
    
    "spawnConditions": {
      "minimumDangerLevel": 5,
      "environmentalConditions": {
        "lightingRange": null,
        "temperatureRange": null,
        "atmosphereTypes": null,
        "atmosphereSeverity": null
      }
    },
    
    "bossEncounter": {
      "isBoss": false,
      "minionSpawns": [],
      "rivalSpawns": []
    },
    
    "movement": {
      "speed": 2,
      "roamInterval": 5,
      "movementType": "phasing",
      "canClimb": true,
      "canSwim": false,
      "canFly": false
    },
    
    "senses": {
      "vision": "darkvision",
      "visionRange": null,
      "hearingRange": null,
      "specialSenses": ["fear-sense"]
    },
    
    "behavior": {
      "huntingStyle": "stalker",
      "aggression": "opportunistic",
      "intelligence": "cunning",
      "packBehavior": "solitary",
      "tactics": "Follow target for extended periods, building Fear Feeder bonus. Use Paralyzing Gaze to isolate wounded or separated party members. Phase through walls to cut off escape routes. Never attack groups head-on - wait for the perfect moment.",
      "retreatCondition": "If reduced below 50% wounds and target is still with group. Will return once healed.",
      "communication": "telepathic"
    },
    
    "chaseStats": {
      "canChase": true,
      "chaseSpeed": 1.2,
      "chaseDuration": 60,
      "maximumGap": 10,
      "chaseTriggers": [
        "Target attempts to flee alone",
        "Target shows fear"
      ],
      "giveUpConditions": [
        "Target reaches heavily populated outpost",
        "Target exits to different level",
        "Watcher takes critical injury"
      ]
    },
    
    "lootTable": {
      "dropsLoot": true,
      "lootItems": [
        {
          "itemId": "void-fragment",
          "spawnWeight": 60,
          "minQuantity": 1,
          "maxQuantity": 1
        },
        {
          "itemId": "bottlecaps",
          "spawnWeight": 40,
          "minQuantity": 10,
          "maxQuantity": 25
        }
      ],
      "specialDrops": [
        {
          "itemId": "watchers-eye",
          "dropChance": 0.15,
          "quantity": 1,
          "condition": "Only if killed while being directly observed"
        }
      ],
      "harvestableMaterials": [
        {
          "materialId": "light-absorbing-essence",
          "skillRequired": "medicine",
          "difficulty": "hard",
          "quantity": 1,
          "description": "Extract the strange substance that allows the Watcher to absorb light. Requires working in near-total darkness."
        }
      ]
    },
    
    "variants": [],
    
    "tags": ["hostile", "stalker", "psychological", "solo", "mid-danger"],
    
    "dmNotes": {
      "howToRun": "The Watcher is a psychological threat first, combat threat second. Describe it appearing in mirrors, doorways, at the end of corridors. Have players make Perception checks - on success, they notice it watching. Build tension over multiple sessions if possible. The static buzz should be mentioned frequently to the stalked character.",
      "tacticsTips": "Track how many hours it has been stalking (Fear Feeder bonus). Use the Quantum Movement creatively - it can appear anywhere the players aren't looking. The Paralyzing Gaze is best used to separate a character from the group. Remember it can phase through walls but still needs to not be observed.",
      "narrativeHooks": "The Watcher might have been following the party for days before they notice. Finding static-damaged electronics could foreshadow its presence. Other wanderers might warn about 'something that watches from corners.' A character waking to find it standing over them is classic horror.",
      "commonMistakes": "Don't have it attack immediately - build tension first. Don't forget the Discipline check to maintain observation. The Watcher should feel like a persistent dread, not just another monster fight. It's smart enough to retreat and try again later.",
      "sessionNotes": {}
    },
    
    "sessionVisibility": {}
  },

  // NEMESIS - The Threshold Guardian (Boss)
  {
    "id": "entity-threshold-guardian",
    "name": "The Threshold Guardian",
    "aliases": ["Gatekeeper", "The Boundary", "Door Warden"],
    "number": null,
    
    "category": "Boss",
    "adversaryType": "nemesis",
    "difficultyRating": 9,
    "challengeRating": {
      "solo": "legendary",
      "groupSize": 5
    },
    
    "description": {
      "appearance": "A massive entity composed of countless doors, frames, and thresholds fused into a vaguely humanoid shape. It stands three meters tall, its body constantly shifting as doors open and close across its surface. Through the opening doors, glimpses of impossible locations flash briefly - other levels, the Frontrooms, places that may not exist. Its 'head' is a grand archway with no door, only absolute darkness within.",
      "behaviorDescription": "The Guardian exists to protect major exit points between levels. It does not hunt - it waits. When intruders approach the threshold it guards, it rises from apparent dormancy and offers a choice: prove worthy through combat, solve its riddle, or turn back. It fights with deliberate, measured movements, never pursuing beyond its territory.",
      "sounds": "The constant creaking of hinges, the slam of doors, and a deep resonant voice that seems to come from every doorway simultaneously. When it attacks, the sound of splintering wood and breaking locks echoes impossibly.",
      "distinguishingFeatures": [
        "Body made of fused doors and frames",
        "Doors constantly open showing other locations",
        "Head is an empty doorway filled with darkness",
        "Does not leave its threshold territory"
      ]
    },
    
    "characteristics": {
      "brawn": 5,
      "agility": 2,
      "intellect": 4,
      "cunning": 3,
      "willpower": 5,
      "presence": 5
    },
    
    "derived": {
      "soak": 8,
      "woundsThreshold": 35,
      "strainThreshold": 20,
      "meleeDefense": 1,
      "rangedDefense": 0
    },
    
    "skills": {
      "brawl": 4,
      "melee": 3,
      "discipline": 4,
      "vigilance": 3,
      "coercion": 4,
      "knowledge": 3,
      "resilience": 4
    },
    
    "talents": [
      {
        "name": "Adversary",
        "tier": 3,
        "description": "Upgrade the difficulty of all combat checks against this target three times."
      },
      {
        "name": "Durable",
        "tier": 3,
        "description": "Reduce all Critical Injury results by 30 (minimum 1)."
      },
      {
        "name": "Terrifying",
        "tier": 3,
        "description": "At the start of encounter, all opponents must make a Hard (3 purple) Fear check."
      }
    ],
    
    "abilities": [
      {
        "name": "Dimensional Anchor",
        "type": "passive",
        "description": "The Threshold Guardian cannot be moved against its will by any means. It is immune to knockdown, forced movement, and effects that would relocate it. It also cannot pursue targets beyond Short range of its threshold.",
        "activation": null
      },
      {
        "name": "Portal Strike",
        "type": "active",
        "description": "The Guardian opens a door on its body and strikes through a corresponding door that appears behind a target at Medium range. Make a Melee attack against target regardless of actual distance. On 3+ Advantage, the door remains briefly open, allowing the Guardian to make a second attack against a different target within Short range of the first.",
        "activation": "Action"
      },
      {
        "name": "Threshold Slam",
        "type": "active",
        "description": "The Guardian slams the ground, causing all doors within Medium range to violently open and close. All characters in the area must make a Hard (3 purple) Athletics check or be knocked prone and suffer 6 damage. Characters behind cover reduce damage by their cover's soak value.",
        "activation": "Action, once per 3 rounds"
      },
      {
        "name": "Exile",
        "type": "active",
        "description": "The Guardian attempts to force a target through one of its doors to another location. Make an opposed Coercion vs Discipline check against a target at Engaged range. If successful, the target is teleported to a random location 1d10 rooms away from the encounter. Triumph: Target is teleported to a different level entirely.",
        "activation": "Action, costs 3 strain"
      },
      {
        "name": "The Guardian's Challenge",
        "type": "triggered",
        "description": "Before combat begins, the Guardian offers a choice: Combat, Riddle, or Retreat. If Riddle is chosen, one character must make a Formidable (5 purple) Knowledge check with assistance allowed. Success grants passage without combat. Failure means combat begins with the party suffering 2 strain each. Retreat is always allowed - the Guardian will not pursue.",
        "activation": "At start of encounter"
      },
      {
        "name": "Regenerating Frame",
        "type": "passive",
        "description": "At the end of each round, the Threshold Guardian recovers 3 wounds as doors shift and reform across its body. This regeneration stops if the Guardian has suffered a Critical Injury.",
        "activation": null
      }
    ],
    
    "equipment": {
      "naturalWeapons": [
        {
          "name": "Door Frame Slam",
          "skill": "brawl",
          "damage": 8,
          "critical": 3,
          "range": "engaged",
          "qualities": ["Knockdown", "Concussive 1"]
        },
        {
          "name": "Threshold Edge",
          "skill": "melee",
          "damage": 10,
          "critical": 2,
          "range": "short",
          "qualities": ["Pierce 3", "Vicious 2"]
        }
      ],
      "naturalArmor": {
        "name": "Layered Doors",
        "soak": 3,
        "defense": 1
      },
      "equipped": {
        "head": null,
        "chest": null,
        "mainHand": null,
        "offhand": null
      },
      "gear": []
    },
    
    "groupSize": {
      "min": 1,
      "max": 1
    },
    
    "spawnConditions": {
      "minimumDangerLevel": 8,
      "environmentalConditions": {
        "lightingRange": null,
        "temperatureRange": null,
        "atmosphereTypes": null,
        "atmosphereSeverity": null
      }
    },
    
    "bossEncounter": {
      "isBoss": true,
      "minionSpawns": [
        {
          "entityId": "entity-door-mimic",
          "minQuantity": 2,
          "maxQuantity": 4,
          "spawnProbability": 1.0
        }
      ],
      "rivalSpawns": [
        {
          "entityId": "entity-key-keeper",
          "minQuantity": 1,
          "maxQuantity": 1,
          "spawnProbability": 0.5
        }
      ]
    },
    
    "movement": {
      "speed": 0,
      "roamInterval": null,
      "movementType": "ground",
      "canClimb": false,
      "canSwim": false,
      "canFly": false
    },
    
    "senses": {
      "vision": "blindsight",
      "visionRange": null,
      "hearingRange": null,
      "specialSenses": ["threshold-sense"]
    },
    
    "behavior": {
      "huntingStyle": "defensive",
      "aggression": "provoked",
      "intelligence": "sapient",
      "packBehavior": "solitary",
      "tactics": "Opens with Threshold Slam to scatter the party, then uses Portal Strike to attack isolated targets. Saves Exile for heavily armored or dangerous opponents. Uses the environment - fights near its threshold where doors on walls can be used for Portal Strikes. Prioritizes characters attempting to bypass it.",
      "retreatCondition": "Never retreats. Fights until destroyed or intruders withdraw.",
      "communication": "complex"
    },
    
    "chaseStats": {
      "canChase": false,
      "chaseSpeed": 0,
      "chaseDuration": 0,
      "maximumGap": 0,
      "chaseTriggers": [],
      "giveUpConditions": []
    },
    
    "lootTable": {
      "dropsLoot": true,
      "lootItems": [
        {
          "itemId": "bottlecaps",
          "spawnWeight": 50,
          "minQuantity": 50,
          "maxQuantity": 100
        },
        {
          "itemId": "threshold-fragment",
          "spawnWeight": 50,
          "minQuantity": 2,
          "maxQuantity": 4
        }
      ],
      "specialDrops": [
        {
          "itemId": "guardians-key",
          "dropChance": 1.0,
          "quantity": 1,
          "condition": "Always drops - this is the key to the threshold it guards"
        },
        {
          "itemId": "door-to-nowhere",
          "dropChance": 0.25,
          "quantity": 1,
          "condition": "Only if defeated without using the Riddle option"
        }
      ],
      "harvestableMaterials": [
        {
          "materialId": "dimensional-hinge",
          "skillRequired": "mechanics",
          "difficulty": "daunting",
          "quantity": 3,
          "description": "Carefully extract the impossible hinges that connect the Guardian's doors to other realities. Extremely valuable for crafting portal devices."
        },
        {
          "materialId": "threshold-wood",
          "skillRequired": "survival",
          "difficulty": "hard",
          "quantity": 5,
          "description": "Salvage the strange wood that makes up the Guardian's frame. It exists partially in multiple dimensions."
        }
      ]
    },
    
    "variants": [],
    
    "tags": ["boss", "guardian", "dimensional", "threshold", "high-danger", "sapient"],
    
    "dmNotes": {
      "howToRun": "The Threshold Guardian should feel like a force of nature, not just a big monster. It speaks in a booming voice that comes from everywhere. It's not evil - it's performing a function. Play up the choice it offers; this isn't a monster attacking them, it's a test they chose to take. The riddle option should be genuinely difficult but solvable.",
      "tacticsTips": "Use Portal Strike to keep pressure on the backline while Door Mimics engage the frontline. Threshold Slam is best when the party clusters together. Save Exile for whoever is dealing the most damage - removing them for several rounds changes the fight dramatically. The regeneration means the party needs to deal consistent damage or land a critical.",
      "narrativeHooks": "The Guardian might have guarded this threshold for centuries. It could share cryptic information about the level beyond if asked respectfully. Defeating it might have consequences - other Guardians becoming more aggressive, or the threshold becoming unstable. A defeated Guardian's territory might become contested by other entities.",
      "commonMistakes": "Don't forget it can't pursue - players can always retreat. Don't spam Exile - it costs strain and should be dramatic. Remember the riddle option exists for parties who can't win the fight. The Terrifying talent fear check happens before any action - enforce it. Track the regeneration each round.",
      "sessionNotes": {}
    },
    
    "sessionVisibility": {}
  }
];

export default data;