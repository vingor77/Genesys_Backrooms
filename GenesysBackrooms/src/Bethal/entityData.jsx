export const indoorEntities = [
  {
    "name": "Barber (Clay Surgeon)",
    "characteristics": {
      "Brawn": 4,
      "Agility": 3,
      "Intellect": 1,
      "Cunning": 3,
      "Willpower": 2,
      "Presence": 1
    },
    "derived_attributes": {
      "wound_threshold": 19,
      "strain_threshold": 12,
      "soak": 6,
      "melee_defense": 2,
      "ranged_defense": 1
    },
    "skills": {
      "brawl": 4,
      "stealth": 3,
      "athletics": 2,
      "vigilance": 2
    },
    "talents": [
      {
        "name": "Adversary 3",
        "description": "Upgrade the difficulty of all combat checks targeting this adversary three times."
      }
    ],
    "abilities": [
      {
        "name": "Invisibility Shroud",
        "description": "The Barber is invisible to employees beyond Short range. Perception checks to spot the Barber at Medium range or further upgrade the difficulty three times (add ◆◆◆)."
      }
    ],
    "weapons": [
      {
        "name": "Giant Scissors",
        "skill": "Brawl",
        "damage": 12,
        "critical": 2,
        "range": "Engaged",
        "special": [
          "Pierce 4",
          "Vicious 3", 
          "Lethal"
        ]
      }
    ],
    "movement": {
      "passive": 2,
      "chasing": 1
    }
  },
  {
    "name": "Thumper (Halves)",
    "characteristics": {
      "Brawn": 4,
      "Agility": 5,
      "Intellect": 1,
      "Cunning": 2,
      "Willpower": 3,
      "Presence": 3
    },
    "derived_attributes": {
      "wound_threshold": 14,
      "soak": 4,
      "melee_defense": 2,
      "ranged_defense": 1
    },
    "skills": {
      "brawl": 4,
      "athletics": 5,
      "vigilance": 4
    },
    "talents": [
      {
        "name": "Adversary 1",
        "description": "Upgrade the difficulty of all combat checks targeting this adversary once."
      },
      {
        "name": "Relentless Hunter",
        "description": "When pursuing, gain 1 additional maneuver per round and ignore ◼ from terrain."
      }
    ],
    "abilities": [
      {
        "name": "Charger",
        "description": "If the Thumper performs 2 or more maneuvers in a single turn, it gains a free bite attack at the end of its turn."
      }
    ],
    "weapons": [
      {
        "name": "Vicious Bite",
        "skill": "Brawl",
        "damage": 8,
        "critical": 3,
        "range": "Engaged",
        "special": [
          "Pierce 2",
          "Vicious 2"
        ]
      }
    ],
    "movement": {
      "passive": 2,
      "chasing": 1
    }
  },
  {
    "name": "Snare Flea (Centipede)",
    "characteristics": {
      "Brawn": 2,
      "Agility": 4,
      "Intellect": 1,
      "Cunning": 3,
      "Willpower": 2,
      "Presence": 1
    },
    "derived_attributes": {
      "wound_threshold": 8,
      "soak": 2,
      "melee_defense": 1,
      "ranged_defense": 3
    },
    "skills": {
      "brawl": 3,
      "stealth": 4,
      "athletics": 3
    },
    "talents": [
      {
        "name": "Adversary 1",
        "description": "Upgrade the difficulty of all combat checks targeting this adversary once."
      },
      {
        "name": "Ambush Predator",
        "description": "When attacking from ceiling ambush, upgrade attack twice and add automatic ◇."
      }
    ],
    "abilities": [
      {
        "name": "Ceiling Ambush",
        "description": "Hangs motionless from ceilings using silk. When target moves within Short range, drops down to make grapple attack. Can reattach to ceiling if attack misses."
      }
    ],
    "weapons": [
      {
        "name": "Suffocation Wrap",
        "skill": "Brawl",
        "damage": 4,
        "critical": 4,
        "range": "Engaged",
        "special": [
          "Ensnare 4",
          "Burn 1"
        ]
      }
    ],
    "movement": {
      "passive": 0,
      "chasing": 1
    }
  },
  {
    "name": "Spore Lizard (Puffer)",
    "characteristics": {
      "Brawn": 3,
      "Agility": 2,
      "Intellect": 1,
      "Cunning": 2,
      "Willpower": 1,
      "Presence": 2
    },
    "derived_attributes": {
      "wound_threshold": 18,
      "soak": 3,
      "melee_defense": 1,
      "ranged_defense": 1
    },
    "skills": {
      "brawl": 1,
      "athletics": 2,
      "stealth": 3,
      "coercion": 2
    },
    "talents": [
      {
        "name": "Timid Nature",
        "description": "Must make Hard (◆◆◆) Fear check when engaged in combat. On failure, spends next action attempting to flee."
      }
    ],
    "abilities": [
      {
        "name": "Intimidation Display",
        "description": "As an action, can open enormous mouth to attempt Coercion check against targets at Short range. Success causes 1 + successes strain damage."
      }
    ],
    "weapons": [
      {
        "name": "Weak Bite (At 50% or lower HP)",
        "skill": "Brawl",
        "damage": 3,
        "critical": 5,
        "range": "Engaged"
      },
      {
        "name": "Spore Cloud (At 50% or lower HP)",
        "skill": "Brawl",
        "damage": 2,
        "critical": 5,
        "range": "Short",
        "special": [
          "Blast 5",
          "Burn 1"
        ]
      }
    ],
    "movement": {
      "passive": 2,
      "chasing": 1
    }
  },
  {
    "name": "Bracken (Flower Man)",
    "characteristics": {
      "Brawn": 3,
      "Agility": 4,
      "Intellect": 3,
      "Cunning": 4,
      "Willpower": 3,
      "Presence": 2
    },
    "derived_attributes": {
      "wound_threshold": 18,
      "strain_threshold": 13,
      "soak": 3,
      "melee_defense": 3,
      "ranged_defense": 2
    },
    "skills": {
      "brawl": 4,
      "stealth": 5,
      "athletics": 3,
      "vigilance": 4
    },
    "talents": [
      {
        "name": "Adversary 3",
        "description": "Upgrade the difficulty of all combat checks targeting this adversary three times."
      },
      {
        "name": "Stalker",
        "description": "Add ◼ ◼ to Stealth checks."
      }
    ],
    "abilities": [
      {
        "name": "Auto-Targeting",
        "description": "Always targets the closest employee in the facility. If no employees are present when spawned, targets the first employee to enter the facility."
      },
      {
        "name": "Anger Meter",
        "description": "When observed by an employee, that employee makes an Average (◆◆) Discipline check. The Bracken gains 1 anger + ✖ rolled. At 5+ anger, the observer must make a Hard (◆◆◆) Discipline check each round or the Bracken enters Enraged state (gains Vicious 2 on all attacks). Anger decreases by 1 per round when not being observed."
      },
      {
        "name": "Luminous Eyes",
        "description": "The Bracken can be spotted in total darkness due to its glowing eyes. Remove ◼ ◼ from Perception checks to detect the Bracken in low light conditions."
      },
    ],
    "weapons": [
      {
        "name": "Neck Snap",
        "skill": "Brawl",
        "damage": 8,
        "critical": 2,
        "range": "Engaged",
        "special": [
          "Ensnare 3",
          "Vicious 3",
          "Lethal"
        ]
      }
    ],
    "movement": {
      "passive": "Follows",
      "chasing": "Follows"
    }
  },
  {
    "name": "Bunker Spider (Theraphosa Spider)",
    "characteristics": {
      "Brawn": 4,
      "Agility": 2,
      "Intellect": 1,
      "Cunning": 3,
      "Willpower": 2,
      "Presence": 1
    },
    "derived_attributes": {
      "wound_threshold": 14,
      "soak": 4,
      "melee_defense": 2,
      "ranged_defense": 1
    },
    "skills": {
      "brawl": 4,
      "athletics": 2,
      "stealth": 2,
      "survival": 3
    },
    "talents": [
      {
        "name": "Adversary 1",
        "description": "Upgrade the difficulty of all combat checks targeting this adversary once."
      },
      {
        "name": "Durable",
        "description": "Reduce critical injury result by 10 (minimum 1)."
      }
    ],
    "abilities": [
      {
        "name": "Berserker Rage",
        "description": "When reduced to 25% wounds or less, gain 1 free maneuver per turn and automatic ◇ on all attacks."
      },
      {
        "name": "Auto Web Placement",
        "description": "Places webs in its current room every time it moves (every 3 rounds). Webs require 1 additional maneuver to move through and alert the spider when touched."
      }
    ],
    "weapons": [
      {
        "name": "Spider Bite",
        "skill": "Brawl",
        "damage": 9,
        "critical": 3,
        "range": "Engaged",
        "special": [
          "Pierce 2",
          "Vicious 2"
        ]
      }
    ],
    "movement": {
      "passive": 3,
      "chasing": 2
    }
  },
  {
    "name": "Jester (Jack-in-the-Box)",
    "characteristics": {
      "Brawn": 5,
      "Agility": 5,
      "Intellect": 3,
      "Cunning": 5,
      "Willpower": 5,
      "Presence": 4
    },
    "derived_attributes": {
      "wound_threshold": 20,
      "strain_threshold": 20,
      "soak": 8,
      "melee_defense": 4,
      "ranged_defense": 3
    },
    "skills": {
      "brawl": 5,
      "athletics": 5,
      "stealth": 3,
      "vigilance": 5
    },
    "talents": [
      {
        "name": "Adversary 3",
        "description": "Upgrade the difficulty of all combat checks targeting this adversary three times."
      },
      {
        "name": "Relentless",
        "description": "Once pursuing, speed increases by 1 maneuver per round until engaging new target."
      }
    ],
    "abilities": [
      {
        "name": "Rage Meter",
        "description": "Starts at 0 rage. Gains 1 rage per round when following an employee. At 15+ rage, enters Chase mode and plays music while cranking. If all employees leave the facility, reduce rage by 4 each round until returning to 0."
      },
    ],
    "weapons": [
      {
        "name": "Skull Bite",
        "skill": "Brawl",
        "damage": 15,
        "critical": 1,
        "range": "Engaged",
        "special": [
          "Pierce 4",
          "Vicious 4",
          "Lethal"
        ]
      }
    ],
    "movement": {
      "passive": 3,
      "chasing": 1
    }
  },
  {
    "name": "Nutcracker (Guardian Automaton)",
    "characteristics": {
      "Brawn": 4,
      "Agility": 2,
      "Intellect": 3,
      "Cunning": 4,
      "Willpower": 5,
      "Presence": 3
    },
    "derived_attributes": {
      "wound_threshold": 14,
      "soak": 6,
      "melee_defense": 2,
      "ranged_defense": 3
    },
    "skills": {
      "ranged": 5,
      "brawl": 4,
      "vigilance": 5,
      "perception": 4
    },
    "talents": [
      {
        "name": "Adversary 1",
        "description": "Upgrade the difficulty of all combat checks targeting this adversary once."
      },
      {
        "name": "Deadly Accuracy",
        "description": "Add automatic ◇ to ranged attacks. Critical injuries from ranged attacks add +10 to critical roll."
      }
    ],
    "abilities": [
      {
        "name": "Equipment Drop",
        "description": "Upon death, drops functional double-barrel shotgun with 2 shells plus any unspent ammunition remaining in weapon."
      }
    ],
    "weapons": [
      {
        "name": "Double-Barrel Shotgun",
        "skill": "Ranged",
        "damage": 9,
        "critical": 3,
        "range": "Medium",
        "special": [
          "Blast 3",
          "Knockdown",
          "Limited Ammo 2"
        ]
      },
      {
        "name": "Kick Attack",
        "skill": "Brawl",
        "damage": 12,
        "critical": 2,
        "range": "Engaged",
        "special": [
          "Knockdown",
          "Vicious 2",
          "Lethal"
        ]
      }
    ],
    "movement": {
      "passive": 2,
      "chasing": 1
    }
  },
  {
    "name": "Maneater (Periplaneta Clamorus)",
    "characteristics": {
      "Brawn": 2,
      "Agility": 4,
      "Intellect": 2,
      "Cunning": 4,
      "Willpower": 3,
      "Presence": 2
    },
    "derived_attributes": {
      "wound_threshold": 17,
      "strain_threshold": 13,
      "soak": "4 (Baby) / 6 (Adult)",
      "melee_defense": 2,
      "ranged_defense": 2
    },
    "skills": {
      "brawl": 3,
      "stealth": 4,
      "athletics": 3,
      "vigilance": 3
    },
    "talents": [
      {
        "name": "Adversary 1 (Baby) / Adversary 3 (Adult)",
        "description": "Upgrade the difficulty of all combat checks targeting this adversary."
      }
    ],
    "abilities": [
      {
        "name": "Stress Transformation",
        "description": "Baby form has a stress meter starting at 0. Gains stress from various triggers (loud noises, being attacked, being dropped, etc.). At 10 stress points, transforms permanently to adult form over 1 round. Adult form cannot revert."
      },
      {
        "name": "Item Consumption (Baby Only)",
        "description": "Each round when observing scrap items or equipment, has 25% chance to eat them. Cannot consume items while being held."
      }
    ],
    "weapons": [
      {
        "name": "Lethal Lunge (Adult Only)",
        "skill": "Brawl",
        "damage": 16,
        "critical": 2,
        "range": "Short",
        "special": [
          "Pierce 3",
          "Vicious 3",
          "Lethal"
        ]
      }
    ],
    "movement": {
      "passive": 2,
      "chasing": 1
    }
  },
  {
    "name": "Masked (Mimic)",
    "characteristics": {
      "Brawn": 3,
      "Agility": 3,
      "Intellect": 2,
      "Cunning": 5,
      "Willpower": 4,
      "Presence": 3
    },
    "derived_attributes": {
      "wound_threshold": 18,
      "strain_threshold": 14,
      "soak": 3,
      "melee_defense": 3,
      "ranged_defense": 2
    },
    "skills": {
      "brawl": 3,
      "stealth": 5,
      "athletics": 3,
      "deception": 5
    },
    "talents": [
      {
        "name": "Perfect Mimicry",
        "description": "Upgrade difficulty of Perception checks to detect deception twice."
      }
    ],
    "abilities": [
      {
        "name": "Player Conversion",
        "description": "If an attack would kill an employee, instead convert them into a new Masked entity after 1 round. Converted Masked inherit the suit and equipment appearance of the original player."
      }
    ],
    "weapons": [
      {
        "name": "Conversion Grab",
        "skill": "Brawl",
        "damage": 10,
        "critical": 2,
        "range": "Engaged",
        "special": [
          "Ensnare 4",
          "Vicious 3",
          "Lethal"
        ]
      }
    ],
    "movement": {
      "passive": 3,
      "chasing": 1
    }
  },
  {
    "name": "Butler (Mansion Keeper)",
    "characteristics": {
      "Brawn": 2,
      "Agility": 3,
      "Intellect": 2,
      "Cunning": 4,
      "Willpower": 3,
      "Presence": 1
    },
    "derived_attributes": {
      "wound_threshold": 12,
      "soak": 2,
      "melee_defense": 1,
      "ranged_defense": 1
    },
    "skills": {
      "brawl": 2,
      "melee": 3,
      "stealth": 3,
      "vigilance": 3
    },
    "talents": [
      {
        "name": "Adversary 1",
        "description": "Upgrade the difficulty of all combat checks targeting this adversary once."
      },
      {
        "name": "Precise Aim 1",
        "description": "Add 1 damage to one hit per round with Melee weapons."
      }
    ],
    "abilities": [
      {
        "name": "Death Explosion",
        "description": "Upon death, inflates and explodes dealing 6 strain damage to all characters at Engaged range. Also drops Kitchen Knife weapon."
      },
    ],
    "weapons": [
      {
        "name": "Kitchen Knife",
        "skill": "Melee",
        "damage": 6,
        "critical": 3,
        "range": "Engaged",
        "special": [
          "Pierce 1",
          "Vicious 1"
        ]
      }
    ],
    "movement": {
      "passive": 3,
      "chasing": 1
    }
  },
  {
    "name": "Hygrodere (Slime)",
    "characteristics": {
      "Brawn": 3,
      "Agility": 1,
      "Intellect": 1,
      "Cunning": 2,
      "Willpower": 5,
      "Presence": 1
    },
    "derived_attributes": {
      "wound_threshold": 13,
      "soak": 7,
      "melee_defense": 1,
      "ranged_defense": 1
    },
    "skills": {
      "brawl": 2,
      "athletics": 1,
      "stealth": 1,
      "resilience": 4
    },
    "talents": [],
    "abilities": [
      {
        "name": "Slime Resistance",
        "description": "Takes 3 less non-mental damage from all sources."
      }
    ],
    "weapons": [
      {
        "name": "Acidic Touch",
        "skill": "Brawl",
        "damage": 6,
        "critical": 4,
        "range": "Engaged",
        "special": [
          "Burn 2",
          "Pierce 1",
          "Lethal"
        ]
      }
    ],
    "movement": {
      "passive": 3,
      "chasing": 2
    }
  },
  {
    "name": "Ghost Girl (Dress Girl)",
    "characteristics": {
      "Brawn": 1,
      "Agility": 3,
      "Intellect": 2,
      "Cunning": 5,
      "Willpower": 5,
      "Presence": 4
    },
    "derived_attributes": {
      "wound_threshold": 16,
      "strain_threshold": 20,
      "soak": 1,
      "melee_defense": 4,
      "ranged_defense": 4
    },
    "skills": {
      "stealth": 5,
      "brawl": 3,
      "athletics": 3,
      "discipline": 4
    },
    "talents": [
      {
        "name": "Adversary 3",
        "description": "Upgrade the difficulty of all combat checks targeting this adversary three times."
      },
      {
        "name": "Incorporeal",
        "description": "Can move through solid objects and walls. Immune to most environmental hazards."
      }
    ],
    "abilities": [
      {
        "name": "Haunting Meter",
        "description": "When observed by the targeted employee, the Ghost Girl gains 1 haunting point. At 3+ haunting points, she has an 85% chance each round to enter Chasing state (gains automatic movement toward target and Lethal attacks). Haunting points reset when target dies or she successfully kills someone."
      },
    ],
    "weapons": [
      {
        "name": "Spectral Touch",
        "skill": "Brawl",
        "damage": 12,
        "critical": 1,
        "range": "Engaged",
        "special": [
          "Pierce 5",
          "Vicious 4",
          "Lethal"
        ]
      }
    ],
    "movement": {
      "passive": "Follows",
      "chasing": "Follows"
    }
  },
  {
    "name": "Hoarding Bug (Loot Bug)",
    "characteristics": {
      "Brawn": 2,
      "Agility": 3,
      "Intellect": 2,
      "Cunning": 3,
      "Willpower": 3,
      "Presence": 1
    },
    "type": "Minion Group (3)",
    "derived_attributes": {
      "wound_threshold": 7,
      "group_wound_threshold": 21,
      "soak": 2
    },
    "skills": {
      "brawl": "Group gains ranks equal to group members beyond the first",
      "athletics": "Group gains ranks equal to group members beyond the first",
      "stealth": "Group gains ranks equal to group members beyond the first",
      "survival": "Group gains ranks equal to group members beyond the first"
    },
    "talents": [
      {
        "name": "Flyer",
        "description": "Ignore terrain penalties and elevation changes during movement."
      }
    ],
    "abilities": [
      {
        "name": "Scrap Collection",
        "description": "Actively seeks and collects valuable items to bring back to nest. Can carry items while moving and flying."
      },
      {
        "name": "Aggression Meter",
        "description": "Starts at 0 aggression. Gains 1 point for proximity violation, 2 points when attacked, 3 points when items stolen. At 1 point: chases briefly. At 2+ points: chases relentlessly until 3 rounds out of sight or target death. At 3+ points: chases until death, item returned, or target killed."
      }
    ],
    "weapons": [
      {
        "name": "Bite Attack",
        "skill": "Brawl",
        "damage": 4,
        "critical": 4,
        "range": "Engaged",
        "special": [
          "Vicious 1"
        ]
      }
    ],
    "movement": {
      "passive": 3,
      "chasing": 1
    }
  },
  {
    "name": "Coil-Head (Spring Man)",
    "characteristics": {
      "Brawn": 5,
      "Agility": 5,
      "Intellect": 1,
      "Cunning": 3,
      "Willpower": 4,
      "Presence": 1
    },
    "derived_attributes": {
      "wound_threshold": 20,
      "strain_threshold": 14,
      "soak": 7,
      "melee_defense": 3,
      "ranged_defense": 2
    },
    "skills": {
      "brawl": 5,
      "athletics": 4,
      "stealth": 3,
      "vigilance": 4
    },
    "talents": [
      {
        "name": "Lethal Blows",
        "description": "If the attack would trigger a Critical Injury, it instead gains Breach 1 (ignore 10 soak)."
      }
    ],
    "abilities": [
      {
        "name": "Quantum Lock",
        "description": "Cannot move or act when being observed by any employee within Medium range. Immediately resumes movement when unobserved."
      },
    ],
    "weapons": [
      {
        "name": "Spring Assault",
        "skill": "Brawl",
        "damage": 15,
        "critical": 2,
        "range": "Engaged",
        "special": [
          "Knockdown",
          "Vicious 3",
          "Lethal"
        ]
      }
    ],
    "movement": {
      "passive": 3,
      "chasing": 1
    }
  }
]

export const nightEntities = [
  {
    "name": "Baboon Hawk (Papio-volturius)",
    "characteristics": {
      "Brawn": 3,
      "Agility": 3,
      "Intellect": 3,
      "Cunning": 3,
      "Willpower": 3,
      "Presence": 3
    },
    "type": "Minion Group (4)",
    "derived_attributes": {
      "wound_threshold": 8,
      "group_wound_threshold": 32,
      "soak": 3
    },
    "skills": {
      "brawl": "Group gains ranks equal to group members beyond the first",
      "athletics": "Group gains ranks equal to group members beyond the first",
      "vigilance": "Group gains ranks equal to group members beyond the first",
      "survival": "Group gains ranks equal to group members beyond the first",
      "stealth": "Group gains ranks equal to group members beyond the first",
      "coercion": "Group gains ranks equal to group members beyond the first"
    },
    "talents": [
      {
        "name": "Pack Hunter",
        "description": "When multiple members remain, gain automatic ◇ to combat checks due to coordinated attacks."
      }
    ],
    "abilities": [
      {
        "name": "Intimidation Display",
        "description": "As an action, can make a Coercion check using wing spreading and posturing against targets within Short range. Success causes 1 + successes strain damage and upgrades difficulty of target's next action."
      }
    ],
    "weapons": [
      {
        "name": "Horn Gore",
        "skill": "Brawl",
        "damage": 6,
        "critical": 3,
        "range": "Engaged",
        "special": [
          "Pierce 2",
          "Vicious 2"
        ]
      },
      {
        "name": "Beak Strike",
        "skill": "Brawl",
        "damage": 5,
        "critical": 3,
        "range": "Engaged",
        "special": [
          "Vicious 1"
        ]
      }
    ],
    "movement": {
      "passive": 2,
      "chasing": 1
    }
  },
  {
    "name": "Earth Leviathan (Sandworm)",
    "characteristics": {
      "Brawn": 6,
      "Agility": 2,
      "Intellect": 1,
      "Cunning": 3,
      "Willpower": 5,
      "Presence": 4
    },
    "derived_attributes": {
      "wound_threshold": 21,
      "strain_threshold": 20,
      "soak": 8,
      "melee_defense": 1,
      "ranged_defense": 1
    },
    "skills": {
      "brawl": 5,
      "athletics": 3,
      "vigilance": 3,
      "survival": 4
    },
    "talents": [
      {
        "name": "Adversary 3",
        "description": "Upgrade the difficulty of all combat checks targeting this adversary three times."
      }
    ],
    "abilities": [
      {
        "name": "Rage Meter",
        "description": "Starts at 0 rage. Gains 1 rage per round when employees are present outdoors. At 8+ rage, emerges and attacks with Devouring Emergence, then resets rage to 0. Cannot be targeted or affected while underground."
      },
    ],
    "weapons": [
      {
        "name": "Devouring Emergence",
        "skill": "Brawl",
        "damage": 20,
        "critical": 1,
        "range": "Short",
        "special": [
          "Adjacent Tiles",
          "Vicious 4",
          "Knockdown",
          "Lethal"
        ]
      }
    ],
    "movement": {
      "passive": "2",
      "chasing": "1"
    }
  },
  {
    "name": "Eyeless Dog (Dog)",
    "characteristics": {
      "Brawn": 4,
      "Agility": 4,
      "Intellect": 1,
      "Cunning": 2,
      "Willpower": 3,
      "Presence": 3
    },
    "derived_attributes": {
      "wound_threshold": 14,
      "soak": 4,
      "melee_defense": 2,
      "ranged_defense": 1
    },
    "skills": {
      "brawl": 4,
      "athletics": 4,
      "vigilance": 5,
      "survival": 3
    },
    "talents": [
      {
        "name": "Adversary 1",
        "description": "Upgrade the difficulty of all combat checks targeting this adversary once."
      }
    ],
    "abilities": [
      {
        "name": "Suspicion Meter",
        "description": "Starts at 0 suspicion. Gains 3 suspicion per sound detected. At 9+ suspicion, enters Chase mode and howls to alert other Dogs. Suspicion decreases by 1 per round when no sounds detected."
      }
    ],
    "weapons": [
      {
        "name": "Crushing Bite",
        "skill": "Brawl",
        "damage": 9,
        "critical": 2,
        "range": "Engaged",
        "special": [
          "Pierce 3",
          "Vicious 3",
          "Lethal"
        ]
      }
    ],
    "movement": {
      "passive": 2,
      "chasing": 1
    }
  },
  {
    "name": "Forest Keeper (Forest Giant)",
    "characteristics": {
      "Brawn": 6,
      "Agility": 4,
      "Intellect": 2,
      "Cunning": 3,
      "Willpower": 4,
      "Presence": 5
    },
    "derived_attributes": {
      "wound_threshold": 21,
      "strain_threshold": 19,
      "soak": 6,
      "melee_defense": 2,
      "ranged_defense": 1
    },
    "skills": {
      "brawl": 5,
      "athletics": 4,
      "vigilance": 6,
      "survival": 4
    },
    "talents": [
      {
        "name": "Massive Reach",
        "description": "Can attack targets at Short range due to enormous size."
      }
    ],
    "abilities": [
      {
        "name": "Suspicion Meter",
        "description": "Builds suspicion on individual targets based on line of sight and movement. Gains 2 suspicion per round when target is seen. At 8+ suspicion enters chase mode. Meter decreases by 1 per round only when other targets are visible."
      }
    ],
    "weapons": [
      {
        "name": "Grasping Consumption",
        "skill": "Brawl",
        "damage": 15,
        "critical": 2,
        "range": "Short",
        "special": [
          "Ensnare 3",
          "Vicious 2",
          "Lethal"
        ]
      }
    ],
    "movement": {
      "passive": 2,
      "chasing": 1
    }
  },
  {
    "name": "Old Bird (Mech-Walker)",
    "characteristics": {
      "Brawn": 5,
      "Agility": 2,
      "Intellect": 4,
      "Cunning": 3,
      "Willpower": 5,
      "Presence": 4
    },
    "derived_attributes": {
      "wound_threshold": 20,
      "strain_threshold": 20,
      "soak": 8,
      "melee_defense": 2,
      "ranged_defense": 3
    },
    "skills": {
      "ranged": 5,
      "gunnery": 5,
      "brawl": 4,
      "vigilance": 5
    },
    "talents": [
      {
        "name": "Deadly Accuracy",
        "description": "Add automatic ◇ to ranged attacks. Critical injuries from ranged attacks add +10 to critical roll."
      },
      {
        "name": "Targeting Systems",
        "description": "Advanced optical sensors provide Accurate 2 to all ranged attacks. Cannot be blinded or affected by visual impairment."
      }
    ],
    "abilities": [
      {
        "name": "Motion Detection",
        "description": "Detects movement within Long range through advanced sensors. Stationary targets are invisible to its systems. Movement speed determines detection sensitivity."
      },
    ],
    "weapons": [
      {
        "name": "Rocket Barrage",
        "skill": "Ranged",
        "damage": 12,
        "critical": 2,
        "range": "Long",
        "special": [
          "Blast 8",
          "Breach 2",
          "Guided 2",
          "Vicious 3",
          "Limited Ammo 6"
        ]
      },
      {
        "name": "Stomp Attack",
        "skill": "Brawl",
        "damage": 12,
        "critical": 3,
        "range": "Engaged",
        "special": [
          "Knockdown",
          "Vicious 2"
        ]
      },
      {
        "name": "Flame Grab",
        "skill": "Brawl",
        "damage": 10,
        "critical": 2,
        "range": "Engaged",
        "special": [
          "Burn 3",
          "Ensnare 2",
          "Lethal"
        ]
      }
    ],
    "movement": {
      "passive": 1,
      "chasing": 1
    }
  }
]

export const daytimeEntities = [
  {
    "name": "Circuit Bee",
    "description": "Red bees that are descendants of honey bees, easily recognizable by their hairy red bodies and two sets of wings. They nest in ground-level beehives and are highly defensive, conducting electricity between hive members as their primary weapon. When their hive is approached or stolen, they swarm and chase intruders with lethal electric attacks. They cannot open doors and will pursue targets until they retreat far enough from the hive or until they are completely exhausted.",
    "movement": {
      "passive": 999,
      "chasing": 999
    },
    "damage_capable": true,
    "damage_amount": 8,
    "damage_trigger": "When any employee moves within Short range of their hive or attempts to pick up the hive. Swarm continues attacking for 6 rounds or until target moves to Long range from hive. If hive is stolen, bees enter permanent hostile mode attacking all targets until hive is recovered or all bees are eliminated."
  },
  {
    "name": "Manticoil",
    "description": "Large four-winged bird-like creatures of the corvidae family with striking yellow bodies and black outlines on their feathers. Their most defining characteristic is their set of four wings - the rear wings stabilize at low speeds while the front wings create lift. These highly intelligent and social passerine birds are completely harmless with passive temperaments toward humans, feeding on small insects and rodents. They fly in flocks and will simply fly away when employees approach.",
    "movement": {
      "passive": 3,
      "chasing": 3
    },
    "damage_capable": false,
    "damage_amount": 0,
    "damage_trigger": "Cannot deal damage. Completely docile and will fly away when players approach within Medium range. Pose no threat to employee safety."
  },
  {
    "name": "Roaming Locusts",
    "description": "Species of grasshopper that travel in spherical swarm formations, rarely touching the ground and staying close together even in smaller numbers. These harmless insects make buzzing sounds and are highly attracted to light. They quickly disperse when disrupted by employees or flashlights but pose absolutely no threat. Often confused with Circuit Bees due to similar buzzing sounds, but can be distinguished by their lack of a nearby hive.",
    "movement": {
      "passive": 3,
      "chasing": 3
    },
    "damage_capable": false,
    "damage_amount": 0,
    "damage_trigger": "Cannot deal damage. Completely harmless insects that disperse when approached within Short range or when exposed to flashlight beams."
  },
  {
    "name": "Tulip Snakes",
    "description": "Flying lizards distinguished by long arms and wings with unusually bright colors and patterns. Named for the flower petal-like flaps under their neck and behind their head. These stubborn and fearless creatures will latch onto employees' helmets and attempt to carry them into the air using their wings. While they cannot directly harm employees, they can lift them to dangerous heights before dropping them. Multiple snakes can attach to one employee, with 2+ required for actual flight.",
    "movement": {
      "passive": 2,
      "chasing": 2
    },
    "damage_capable": true,
    "damage_amount": "4-12 (fall damage based on height)",
    "damage_trigger": "When 2 or more Tulip Snakes attach to an employee within Engaged range, they lift target for 4-8 rounds before dropping. Fall damage equals 4 + 2 per additional snake attached (maximum 6 snakes). Single snake cannot cause damage. Can be removed by successful Brawl attack before flight begins."
  }
]

// Helper function to get all entities
export const getAllEntities = () => {
  return {
    indoor: indoorEntities,
    night: nightEntities,
    daytime: daytimeEntities
  };
};

// Helper function to get random entity by type
export const getRandomEntity = (type) => {
  let entities = [];
  
  switch (type) {
    case 'indoor':
      entities = indoorEntities;
      break;
    case 'outdoor':
    case 'night':
      entities = nightEntities;
      break;
    case 'daytime':
      entities = daytimeEntities;
      break;
    default:
      entities = [...indoorEntities, ...nightEntities, ...daytimeEntities];
  }
  
  if (entities.length === 0) return null;
  return entities[Math.floor(Math.random() * entities.length)];
};

export const getEntityByName = (name, type = 'all') => {
  let searchArrays = [];
  
  switch (type) {
    case 'indoor':
      searchArrays = [indoorEntities];
      break;
    case 'outdoor':
    case 'night':
      searchArrays = [nightEntities];
      break;
    case 'daytime':
      searchArrays = [daytimeEntities];
      break;
    default:
      searchArrays = [indoorEntities, nightEntities, daytimeEntities];
  }
  
  for (const array of searchArrays) {
    // Try exact name match first
    let entity = array.find(e => e.name === name);
    if (entity) {
      return entity;
    }
    
    // Try alternate name match
    entity = array.find(e => e.alternate_name === name);
    if (entity) {
      return entity;
    }
    
    // Try partial name matching (case insensitive)
    entity = array.find(e => 
      e.name.toLowerCase().includes(name.toLowerCase()) ||
      name.toLowerCase().includes(e.name.toLowerCase())
    );
    if (entity) {
      return entity;
    }
    
    // Try matching common name variations
    const nameVariations = [
      name.replace(/\s*\([^)]*\)/g, ''), // Remove parenthetical parts
      name.split(' ')[0], // Try just first word
      name.split('(')[0].trim() // Try part before parentheses
    ];
    
    for (const variation of nameVariations) {
      if (variation && variation !== name) {
        entity = array.find(e => 
          e.name.toLowerCase().includes(variation.toLowerCase()) ||
          variation.toLowerCase().includes(e.name.toLowerCase())
        );
        if (entity) {
          return entity;
        }
      }
    }
  }
  
  return null;
};

export const specials = (entity) => {
  //Define each entities special mechanic.
  /*
    List of special Mechanics:
      1. Extra Maneuver (1 extra tile) while in chasing movement for Thumper
      2. Auto-targeting the first player to enter a facility if spawned while none are there, OR target a random within the facility if spawned when there are some for Bracken AND Ghost Girl
      3. Auto Web Placing and enrage extra maneuver (1 extra tile) at 25% hp or under for Bunker Spider
      4. Extra maneuver per round for Jester while in chasing movement. (This means it becomes 1 to 2 to 3 etc.).
      5. Nutcracker drops a Double-Barrel Shotgun and 2 Shotgun Shells on death.
      6. Maneater Transformation. Likely to just be a button.
      7. Butler drops Kitchen Knife on Death.
      8. Ghost Girl enters Chasing state. Likely to just be a button.
      9. Gather's scrap within 7 tiles and adds it to a pile randomly chosen on spawn for Hoarding Bug.
      10. Coil Head Cannot move while looked at. Likely to just be a button.
      11. Earth Leviathan, Eyeless Dog, and Forest Keeper enter Chasing on a button.

    This list has been designed using the entities below. Refer there for more details or check for any I missed.
    I do not know a way to implement this, but I have instructions here.
  */
}