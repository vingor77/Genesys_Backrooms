const data = [
  {
    "id": "tactical-operations",
    "name": "Tactical Operations",
    "description": "Elite military-grade equipment designed for coordinated assault operations. Standard issue for M.E.G. special forces units.",
    "pieces": [
      "reinforced-kevlar-vest",
      "tactical-helmet",
      "combat-boots",
      "meg-assault-rifle"
    ],
    "bonuses": {
      "2": {
        "name": "Minor Coordination",
        "description": "+1 Ranged Defense",
        "mechanical_effect": "Increase Ranged Defense by 1."
      },
      "4": {
        "name": "Squad Tactics",
        "description": "Grant ally Boost die once per encounter",
        "mechanical_effect": "Once per encounter, as an incidental, grant one ally within Short range 1 Boost die on their next combat check."
      }
    },
    "set_theme": "M.E.G. Military",
    "rarity_tier": "Uncommon",
    "sessionVisibility": {},
    "pieceVisibility": {}
  },
  {
    "id": "wanderers-survival",
    "name": "Wanderer's Survival Kit",
    "description": "Mismatched but reliable gear scavenged and maintained by experienced Backrooms survivors. Nothing fancy, but it keeps you alive.",
    "pieces": [
      "leather-vest",
      "hiking-boots",
      "utility-belt",
      "survival-knife",
      "hunting-rifle"
    ],
    "bonuses": {
      "2": {
        "name": "Field Preparation",
        "description": "+1 Boost to all Survival checks",
        "mechanical_effect": "Add 1 Boost die to all Survival skill checks."
      },
      "4": {
        "name": "Wilderness Expert",
        "description": "Reduced encumbrance and improved foraging",
        "mechanical_effect": "Reduce total encumbrance by 2. When making Survival checks to find food/water/supplies, treat all Threat results as Advantage."
      }
    },
    "set_theme": "Survival Expert",
    "rarity_tier": "Common",
    "sessionVisibility": {},
    "pieceVisibility": {}
  },
  {
    "id": "void-touched",
    "name": "Void-Touched Regalia",
    "description": "Equipment tainted by prolonged exposure to the darker levels. Powerful but corrupting - only the desperate or foolish seek these pieces.",
    "pieces": [
      "void-stained-cloak",
      "whispering-blade",
      "shadow-greaves",
      "eyes-of-nothing",
      "nullstone-amulet"
    ],
    "bonuses": {
      "2": {
        "name": "Whispers of the Void",
        "description": "+1 to Stealth but enemies sense your presence",
        "mechanical_effect": "Add 1 Boost die to all Stealth checks. However, entities within Medium range become aware something unnatural is nearby (though not your exact location)."
      },
      "3": {
        "name": "Embrace Darkness",
        "description": "See in complete darkness, take less Sanity damage",
        "mechanical_effect": "Gain Darkvision (can see in complete darkness). Reduce all Sanity damage taken by 1 (minimum 1)."
      },
      "5": {
        "name": "One With Nothing",
        "description": "Phase through walls but risk permanent corruption",
        "mechanical_effect": "Once per session, you may phase through a solid wall or obstacle up to 1 meter thick. After using this ability, make a Hard (3 purple) Discipline check. On failure, gain 1 permanent Conflict and suffer 3 Strain."
      }
    },
    "set_theme": "Void Corruption",
    "rarity_tier": "Legendary",
    "sessionVisibility": {},
    "pieceVisibility": {}
  },
  {
    "id": "duelists-edge",
    "name": "Duelist's Edge",
    "description": "A matched rapier and buckler favored by skilled swordsmen. Light, quick, and deadly in experienced hands.",
    "pieces": [
      "steel-rapier",
      "iron-buckler"
    ],
    "bonuses": {
      "2": {
        "name": "Parry and Riposte",
        "description": "+1 Melee Defense, reroll missed attack once per encounter",
        "mechanical_effect": "Increase Melee Defense by 1. Once per encounter, immediately reroll a failed Melee combat check."
      }
    },
    "set_theme": "Dueling",
    "rarity_tier": "Uncommon",
    "sessionVisibility": {},
    "pieceVisibility": {}
  },
  {
    "id": "aurielle-blessed",
    "name": "Aurielle's Blessing",
    "description": "Sacred vestments and weapons blessed by Aurielle priests. Provides protection against corruption and entities.",
    "pieces": [
      "blessed-robes",
      "holy-symbol-necklace",
      "sanctified-blade",
      "prayer-beads"
    ],
    "bonuses": {
      "2": {
        "name": "Divine Protection",
        "description": "+1 to resist Sanity damage",
        "mechanical_effect": "Add 1 Boost die to all checks to resist Sanity damage or madness effects."
      },
      "4": {
        "name": "Smite the Unclean",
        "description": "+2 damage against entities, can turn entities",
        "mechanical_effect": "Increase damage by 2 when attacking entities or anomalous creatures. Once per session, as an action, make a Hard (3 purple) Leadership check. If successful, all entities within Short range must immediately move to Long range or farther if possible."
      }
    },
    "set_theme": "Aurielle Sacred",
    "rarity_tier": "Rare",
    "sessionVisibility": {},
    "pieceVisibility": {}
  }
];

export default data;