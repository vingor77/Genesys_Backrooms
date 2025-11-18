import React, { useState, useEffect } from 'react';
import { collection, doc, onSnapshot, query, updateDoc, setDoc } from "firebase/firestore";
import db from '../Components/firebase';
import EntityItem from "../Components/entityItem";
import NotLoggedIn from "../Components/notLoggedIn";
import { requireSession, getActiveSession, isDM } from '../Components/sessionUtils';

// Toast notification component
const Toast = ({ message, severity, isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const severityClasses = {
    success: 'bg-emerald-500 border-emerald-400',
    error: 'bg-red-500 border-red-400',
    warning: 'bg-amber-500 border-amber-400',
    info: 'bg-blue-500 border-blue-400'
  };

  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  };

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-down">
      <div className={`${severityClasses[severity]} text-white px-6 py-4 rounded-lg border shadow-xl flex items-center space-x-3 min-w-80`}>
        <div className="text-xl font-bold">{icons[severity]}</div>
        <span className="flex-1">{message}</span>
        <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

// Example entity data for upload
const entityData = [
  // ENTITY 1: DEATHMOTH (MINION)
  {
    "name": "Deathmoth",
    "scientific_name": "Necroleptira mortalis",
    "alternate_names": ["Shadow Moth", "Night Reaper"],
    "entity_type": "Beast",
    "short_description": "A large predatory moth that hunts at night, drawn to sources of light and warmth.",
    "full_description": "Deathmoths are nocturnal predators that prowl forests and ruins in small swarms. Their wings span 4-6 feet and are covered in iridescent scales that shimmer with an otherworldly purple-black hue. These creatures are drawn to campfires and torchlight, often mistaken for ordinary moths until they reveal their aggressive nature and attack in coordinated groups.",
    "physical_appearance": "A large moth with a wingspan of 4-6 feet. Its body is covered in thick, velvety black fur, and its compound eyes glow with a faint crimson light. The wings feature intricate patterns that resemble small skulls when fully spread, and they shed a fine dust when agitated. They move with eerie silence and often attack in groups.",
    "adversary_type": "Minion",
    "silhouette": 1,
    "characteristics": {
      "brawn": 2,
      "agility": 3,
      "intellect": 1,
      "cunning": 2,
      "willpower": 1,
      "presence": 1
    },
    "derived_attributes": {
      "wounds": 5,
      "strain": 0,
      "soak": 2,
      "defense_melee": 0,
      "defense_ranged": 1
    },
    "skills": [
      { "name": "Brawl", "characteristic": "Brawn", "ranks": 1 },
      { "name": "Coordination", "characteristic": "Agility", "ranks": 2 },
      { "name": "Stealth", "characteristic": "Agility", "ranks": 2 }
    ],
    "talents": [],
    "abilities": [
      {
        "name": "Silent Flight",
        "activation": "Passive",
        "description": "The Deathmoth makes no sound while flying. Checks to detect it suffer 1 Setback die."
      }
    ],
    "actions": [
      {
        "name": "Mandible Bite",
        "type": "Attack",
        "skill": "Brawl",
        "damage": 3,
        "critical": 4,
        "range": "Engaged",
        "qualities": ["Pierce 1"],
        "description": "A quick bite attack from the moth's sharp mandibles."
      }
    ],
    "equipment": [],
    "encounter_setup": {
      "balanced_count_vs_4players": "4-6 Deathmoths (minion group)",
      "combat_style": "Swarm tactics, surrounding isolated targets and attacking from multiple angles",
      "retreat_conditions": "Swarm breaks apart if more than half are killed or if bright light sources are created"
    },
    "escape_methods": [
      {
        "method": "Create Bright Light",
        "difficulty": "Easy",
        "description": "Deathmoths are repelled by sudden bright light. Creating a torch, Light spell, or other bright illumination (even temporary) causes them to scatter and flee for 2-3 rounds, giving players time to escape.",
        "success_rate": "High"
      },
      {
        "method": "Produce Loud Noise",
        "difficulty": "Average",
        "description": "Sudden loud noises (banging shields, Thunder spell, or similar) disorient the swarm. Make an Average Athletics or Coordination check to create enough noise. Success causes the swarm to become confused for 1 round.",
        "success_rate": "Medium"
      },
      {
        "method": "Drop Food/Bait",
        "difficulty": "Average",
        "description": "Deathmoths are drawn to fresh blood and warm-blooded prey. Leaving behind a bleeding animal carcass or fresh meat causes them to stop and feed, allowing escape. Requires having appropriate bait.",
        "success_rate": "High (if bait available)"
      },
      {
        "method": "Enter Water",
        "difficulty": "Easy",
        "description": "Deathmoths cannot fly well near or over water due to their wing dust dissolving. Diving into water or crossing a river/stream forces them to break off pursuit.",
        "success_rate": "Very High (near water)"
      }
    ],
    "loot": {
      "guaranteed_drops": [],
      "random_drops": [
        {
          "item": "Moth Wing Dust",
          "chance": 40,
          "quantity": "1 vial",
          "rarity": 2,
          "description": "Fine dust from moth wings, useful as an alchemical reagent for sleep potions"
        }
      ],
      "harvestable_components": [
        {
          "component": "Intact Moth Wings",
          "harvest_difficulty": "Easy",
          "required_skill": "Survival",
          "quantity": "2 per moth",
          "rarity": 3,
          "time_window": "Must harvest immediately after death before wings deteriorate"
        }
      ]
    },
    "diet": "Life energy and blood of warm-blooded creatures",
    "intelligence_level": "Cunning",
    "communication": {
      "can_speak": false,
      "languages_understood": [],
      "special_notes": "Communicates with others of its kind through wing vibrations at ultrasonic frequencies"
    },
    "motivation": "Hunger for life essence, territorial instinct",
    "detection": {
      "warning_signs": ["Glittering dust in the air", "Eerie silence in the area", "Drained animal corpses", "Faint sound of wing beats"],
      "detection_skills": ["Perception", "Survival", "Vigilance"],
      "detection_difficulty": "Hard"
    },
    "vulnerabilities": [
      {
        "type": "Bright Light",
        "severity": "Major",
        "description": "Suffers 2 Setback dice on all checks in bright light. Takes 2 strain per round in direct sunlight."
      },
      {
        "type": "Fire",
        "severity": "Minor",
        "description": "Wings are highly flammable. Fire damage gains Pierce 2 against Deathmoths."
      }
    ],
    "resistances": [
      {
        "type": "Poison",
        "level": "Medium",
        "description": "Upgrade difficulty of poison effects twice"
      }
    ],
    "condition_immunities": ["Poisoned (natural toxins only)"],
    "variants": [
      {
        "name": "Swarm Queen",
        "adversary_type": "Rival",
        "spawn_chance": 10,
        "description": "Larger specimen that leads the swarm. This rare variant is twice the size of normal Deathmoths and exhibits greater intelligence and aggression.",
        "stat_changes": "Wounds 12, Soak 3, Brawn 3, Agility 4",
        "special_notes": "Can command the swarm to focus attacks; killing the queen scatters the swarm immediately",

        // Only list talents that are NEW or DIFFERENT from base
        "talents": [
          {
            "name": "Adversary 1",
            "tier": 1,
            "description": "Upgrade the difficulty of combat checks against the Swarm Queen once."
          }
        ],

        // Only list abilities that are NEW or REPLACE base abilities
        "abilities": [
          {
            "name": "Command Swarm",
            "activation": "Maneuver",
            "description": "Once per round, the Swarm Queen can direct all allied Deathmoths within Medium range to focus on a single target. That target upgrades the difficulty of all checks once until the start of the Queen's next turn."
          },
          {
            "name": "Death's Wing Dust",
            "activation": "Incidental",
            "description": "Once per encounter when damaged, the Swarm Queen releases toxic dust in Engaged range. All characters make Average Resilience check or suffer 4 strain and become Disoriented for 2 rounds."
          }
        ],

        // Only list actions that are NEW or REPLACE base actions
        "actions": [
          {
            "name": "Mandible Strike",
            "replaces": "Mandible Bite", // This indicates it replaces the base action
            "type": "Attack",
            "skill": "Brawl",
            "damage": 5,
            "critical": 3,
            "range": "Engaged",
            "qualities": ["Pierce 1", "Vicious 1"],
            "description": "A powerful bite attack from the Queen's enlarged mandibles, much stronger than the regular Deathmoth's bite."
          }
        ]
      }
    ],
    "lore_text": "Deathmoths are common nocturnal pests in forested regions, though they become dangerous when encountered in large numbers. They are thought to be related to common moths but have developed predatory instincts. Local farmers often use bright lanterns to keep them away from livestock.",
    "origin": {
      "known": false,
      "theories": [
        "Natural evolution of giant moths in magic-rich environments",
        "Byproduct of failed druidic experiments",
        "Simply large, aggressive moths that have always existed"
      ]
    },
    "procedural_notes": "Use Deathmoths as minion groups (4-6 per group). Have them swarm from darkness when the party makes camp. Remember minion group rules: they share wound threshold and act as one. Use their Silent Flight to create ambush scenarios. Target the weakest-looking party member first.",
    "dm_secrets": "Deathmoths are actually attracted to the smell of magic more than light itself. Characters who recently cast spells are more likely to be targeted. A Deathmoth swarm can be 'tamed' temporarily by a skilled beast handler for use as a distraction or weapon.",
    "sessionVisibility": {},
    "sessionNotes": {},
    "sessionVariants": {},
    "entity_image_url": null,
    "sounds_calls": ["Soft wing fluttering", "High-pitched chittering when in groups", "Rustling sounds"],
    "tags": ["Minion", "Nocturnal", "Flying", "Swarm", "Common", "Forest"],
    "rarity": 2
  },

  // ENTITY 2: STONEHEART GOLEM (NEMESIS)
  {
    "name": "Stoneheart Golem",
    "scientific_name": "Constructus petramortis",
    "alternate_names": ["Living Statue", "Stone Guardian", "The Eternal Sentinel"],
    "entity_type": "Construct",
    "short_description": "A masterwork animated construct of stone and metal, an ancient guardian of immense power.",
    "full_description": "Stoneheart Golems are legendary constructs created through a fusion of master engineering and powerful magic. Standing 10-12 feet tall, they are hewn from the finest granite and reinforced with enchanted iron bands and runes. At their core lies a massive crystalline heart that pulses with intense arcane energy, giving them both semblance of life and devastating power. These golems are prized as ultimate guardians, capable of holding a position against entire armies. Each one is a unique masterwork that took years to create.",
    "physical_appearance": "An imposing humanoid figure carved from dark grey granite with elaborate chisel marks and glowing runic inscriptions covering its entire surface. Enchanted iron bands encircle its chest, arms, and legs, some still bearing the marks of master smiths. Its eyes burn with bright amber light that intensifies during combat. The golem's movements are surprisingly fluid for its size, accompanied by the deep grinding of stone on stone. A brilliant crystalline glow emanates from the thick seams in its chest where the massive heart is housed, pulsing like a heartbeat.",
    "adversary_type": "Nemesis",
    "silhouette": 3,
    "characteristics": {
      "brawn": 6,
      "agility": 1,
      "intellect": 2,
      "cunning": 2,
      "willpower": 5,
      "presence": 1
    },
    "derived_attributes": {
      "wounds": 35,
      "strain": 18,
      "soak": 9,
      "defense_melee": 1,
      "defense_ranged": 1
    },
    "skills": [
      { "name": "Brawl", "characteristic": "Brawn", "ranks": 4 },
      { "name": "Melee", "characteristic": "Brawn", "ranks": 3 },
      { "name": "Discipline", "characteristic": "Willpower", "ranks": 4 },
      { "name": "Resilience", "characteristic": "Brawn", "ranks": 3 },
      { "name": "Vigilance", "characteristic": "Willpower", "ranks": 2 }
    ],
    "talents": [
      {
        "name": "Adversary 2",
        "tier": 2,
        "description": "Upgrade difficulty of combat checks against this target twice."
      },
      {
        "name": "Durable",
        "tier": 1,
        "description": "May reduce any Critical Injury suffered by 10 per rank of Durable, to a minimum of 1."
      }
    ],
    "abilities": [
      {
        "name": "Construct",
        "activation": "Passive",
        "description": "Immune to poison, disease, and mind-affecting effects. Does not need to breathe, eat, or sleep."
      },
      {
        "name": "Immovable Object",
        "activation": "Passive",
        "description": "Cannot be moved involuntarily by any effect. Immune to Knockdown, Stagger, and forced movement. Cannot sprint or perform maneuvers requiring fine motor control. Add 2 Setback dice to attempts to grapple or trip the golem."
      },
      {
        "name": "Greater Magic Resistance",
        "activation": "Passive",
        "description": "Upgrade the difficulty of all magic attacks targeting the golem twice. Reduce damage from magical sources by 3 (after soak)."
      },
      {
        "name": "Relentless Guardian",
        "activation": "Passive",
        "description": "Once per round when the golem takes damage, it may immediately make a Stoneheart Retribution attack as an out-of-turn incidental."
      }
    ],
    "actions": [
      {
        "name": "Devastating Stone Fist",
        "type": "Attack",
        "skill": "Brawl",
        "damage": 12,
        "critical": 3,
        "range": "Engaged",
        "qualities": ["Knockdown", "Disorient 3", "Vicious 2"],
        "description": "A devastating punch that can shatter bone, crush armor, and send foes flying."
      },
      {
        "name": "Earthquake Stomp",
        "type": "Special",
        "cost": "Action (can use twice per encounter)",
        "effect": "The golem slams the ground with tremendous force. All characters within Medium range must make a Daunting Coordination check or be knocked prone and become Disoriented and Staggered for 2 rounds. Structures and terrain in range suffer major damage, potentially creating difficult terrain or collapsing walls.",
        "description": "The golem channels massive energy through its feet to create a devastating localized earthquake."
      },
      {
        "name": "Stoneheart Retribution",
        "type": "Attack",
        "skill": "Brawl",
        "damage": 10,
        "critical": 4,
        "range": "Engaged",
        "qualities": ["Pierce 2"],
        "description": "A swift retaliatory strike triggered by Relentless Guardian ability."
      },
      {
        "name": "Rune Surge",
        "type": "Special",
        "cost": "Action (once per encounter)",
        "effect": "The golem's runes flare with power. For the next 3 rounds, the golem gains +2 Soak, upgrades all combat checks once, and its attacks gain Pierce 3. During this time, the crystalline heart glows brilliantly.",
        "description": "The golem temporarily amplifies its magical power reserves."
      }
    ],
    "equipment": [],
    "encounter_setup": {
      "balanced_count_vs_4players": "1 Stoneheart Golem (designed as a climactic boss encounter)",
      "combat_style": "Aggressive guardian that blocks key passages and protects objectives. Uses terrain and chokepoints. Alternates between devastating melee strikes and area control with Earthquake Stomp.",
      "retreat_conditions": "Cannot retreat - fights until destroyed or command word spoken. Will pursue intruders relentlessly but cannot leave designated guard zone."
    },
    "escape_methods": [
      {
        "method": "Speak the Command Word",
        "difficulty": "Formidable",
        "description": "Every Stoneheart Golem has a unique command word (usually in an ancient language) that deactivates it. This must be discovered through research, divination magic, or finding documentation. Speaking it requires a Hard Lore or Knowledge (Arcana) check to pronounce correctly.",
        "success_rate": "Guaranteed (if word is known and spoken correctly)"
      },
      {
        "method": "Leave the Guard Zone",
        "difficulty": "Variable",
        "description": "Stoneheart Golems cannot pursue beyond their designated guard area (usually a specific room, corridor, or building). Once players leave this zone, the golem returns to its position. Requires identifying the boundary and successfully reaching it while under attack.",
        "success_rate": "High (if boundary is reachable)"
      },
      {
        "method": "Destroy the Stoneheart Crystal",
        "difficulty": "Daunting",
        "description": "If someone can reach and destroy the crystalline heart in the golem's chest, it immediately deactivates. This requires either: (1) Called Shot to the heart (upgrade difficulty twice, but damage bypasses Soak), (2) Grappling the golem and physically attacking the chest, or (3) Using targeted magic. The heart has 10 wounds and Soak 5.",
        "success_rate": "Medium (high risk, high reward)"
      },
      {
        "method": "Collapse the Passage",
        "difficulty": "Hard",
        "description": "If in a dungeon or structure, bringing down the ceiling or walls on the golem can trap or slow it (though not destroy it). Requires identifying structural weaknesses and having means to trigger collapse (explosives, magic, etc.). Make a Hard Mechanics or Knowledge (Engineering) check.",
        "success_rate": "Medium (buys time, doesn't eliminate threat)"
      },
      {
        "method": "Exploit Its Speed",
        "difficulty": "Average",
        "description": "The golem is incredibly slow (Agility 1). Fast characters can potentially kite it, keep it distracted, or lead it away while others accomplish objectives or escape. Requires coordination and multiple characters.",
        "success_rate": "High (for escape, not elimination)"
      },
      {
        "method": "Use Sonic/Thunder Attacks",
        "difficulty": "Average",
        "description": "The golem is vulnerable to sonic damage. Concentrated sonic or thunder-based attacks have a chance to temporarily Stun the golem (opposed Resilience check). This creates openings for escape but doesn't defeat it.",
        "success_rate": "Medium (temporary reprieve)"
      }
    ],
    "loot": {
      "guaranteed_drops": ["Enchanted Iron Bands (4-6)", "Runic Stone Fragments", "Masterwork Stone Core"],
      "random_drops": [
        {
          "item": "Greater Stoneheart Crystal",
          "chance": 100,
          "quantity": "1",
          "rarity": 9,
          "description": "The golem's massive power source. Can power magical items, be used in legendary crafting, or sold for 800-1200gp to collectors or artificers"
        },
        {
          "item": "Ancient Runic Plates",
          "chance": 85,
          "quantity": "2d3",
          "rarity": 7,
          "description": "Large pieces of the golem's body with perfectly intact, glowing runes of great power. Essential for high-level enchanting"
        },
        {
          "item": "Golem Construction Manual",
          "chance": 30,
          "quantity": "1",
          "rarity": 10,
          "description": "Hidden compartment in the golem contains partial instructions for its creation. Priceless to artificers and scholars."
        }
      ],
      "harvestable_components": [
        {
          "component": "Legendary Golem Core Matrix",
          "harvest_difficulty": "Daunting",
          "required_skill": "Knowledge (Arcana) or Mechanics",
          "quantity": "1",
          "rarity": 10,
          "time_window": "Requires 30 minutes and masterwork tools. Must be extracted before magical resonance fades (1 hour after defeat)"
        },
        {
          "component": "Living Stone Essence",
          "harvest_difficulty": "Hard",
          "required_skill": "Alchemy or Medicine",
          "quantity": "1d3 vials",
          "rarity": 8,
          "time_window": "Must harvest within 20 minutes while the stone retains its animating magic"
        }
      ]
    },
    "diet": "Does not eat; sustained by magical energy",
    "intelligence_level": "Bestial",
    "communication": {
      "can_speak": false,
      "languages_understood": ["Language of its creator"],
      "special_notes": "Understands commands but cannot speak. May have specific command words that override normal behavior."
    },
    "motivation": "Following programmed directives, protecting designated area/object/person",
    "detection": {
      "warning_signs": ["Heavy footsteps", "Stone grinding sounds", "Magical aura detectable", "Disturbed stone dust patterns"],
      "detection_skills": ["Perception", "Knowledge (Arcana)"],
      "detection_difficulty": "Average"
    },
    "vulnerabilities": [
      {
        "type": "Sonic/Thunder",
        "severity": "Major",
        "description": "Sonic attacks ignore 3 points of Soak and have a 50% chance to Stun the golem for 1 round"
      },
      {
        "type": "Targeted Magic (Stoneheart)",
        "severity": "Critical",
        "description": "If the crystalline heart is specifically targeted (requires Called Shot, upgrade difficulty twice), damage bypasses Soak entirely"
      }
    ],
    "resistances": [
      {
        "type": "Physical Damage",
        "level": "High",
        "description": "High Soak value and damage reduction"
      },
      {
        "type": "Fire",
        "level": "High",
        "description": "Fire damage reduced by half"
      },
      {
        "type": "Cold",
        "level": "High",
        "description": "Cold damage reduced by half"
      }
    ],
    "condition_immunities": ["Poisoned", "Diseased", "Charmed", "Frightened", "Exhausted"],
    "variants": [
      {
        "name": "Obsidian War Golem",
        "adversary_type": "Nemesis",
        "spawn_chance": 10,
        "description": "Military-grade golem crafted from volcanic obsidian and designed for war. These rare variants were created specifically for battlefield dominance and feature integrated ranged weaponry.",
        "stat_changes": "Wounds 40, Strain 20, Brawn 6, Soak 10",
        "special_notes": "Often found guarding ancient armories or war vaults. The obsidian construction makes it immune to fire damage entirely.",

        "talents": [
          {
            "name": "Adversary 3",
            "replaces": "Adversary 2", // Upgrades the existing talent
            "tier": 3,
            "description": "Upgrade the difficulty of combat checks against the Obsidian War Golem three times."
          },
          {
            "name": "Durable",
            "tier": 1,
            "description": "May reduce any Critical Injury suffered by 10 per rank of Durable, to a minimum of 1."
          }
        ],

        "abilities": [
          {
            "name": "Obsidian Shell",
            "replaces": "Greater Magic Resistance", // Replaces the base ability
            "activation": "Passive",
            "description": "The Obsidian War Golem is immune to fire damage and reduces all other elemental damage by half. Additionally, magical attacks against it upgrade difficulty three times (Adversary 3 applies to magic)."
          },
          {
            "name": "War Protocol",
            "activation": "Passive",
            "description": "The Obsidian War Golem can make ranged attacks without penalty and does not suffer setback dice for cover or obscurement."
          },
          {
            "name": "Siege Mode",
            "activation": "Maneuver",
            "description": "The golem plants itself and gains +3 Soak and +2 Defense (Ranged) until it moves. While in Siege Mode, its Stone Spike Barrage gains the Blast 6 quality."
          }
        ],

        "actions": [
          {
            "name": "Obsidian Fist",
            "replaces": "Devastating Stone Fist", // Replaces the base action
            "type": "Attack",
            "skill": "Brawl",
            "damage": 14,
            "critical": 2,
            "range": "Engaged",
            "qualities": ["Knockdown", "Breach 2", "Vicious 3"],
            "description": "Devastating melee attack with razor-sharp obsidian fists that can shatter armor even more effectively than regular stone fists."
          },
          {
            "name": "Stone Spike Barrage",
            "type": "Attack",
            "skill": "Ranged (Heavy)",
            "damage": 10,
            "critical": 3,
            "range": "Long",
            "qualities": ["Pierce 3", "Limited Ammo 3"],
            "description": "Launches sharpened stone spikes from integrated launchers in its shoulders. Can fire three times per encounter."
          },
          {
            "name": "Seismic Devastation",
            "replaces": "Earthquake Stomp", // Replaces the base action with more powerful version
            "type": "Special",
            "cost": "Action (once per encounter)",
            "effect": "Enhanced version of Earthquake Stomp. All characters within Long range must make a Formidable Coordination check or be knocked prone, become Disoriented and Staggered for 3 rounds, and suffer 6 wounds (ignores soak). Structures collapse, creating extreme difficult terrain.",
            "description": "The War Golem channels massive destructive force through the earth, far more powerful than a standard Earthquake Stomp."
          }
        ]
      }
    ],
    "lore_text": "Stoneheart Golems were first created by the legendary Architect-Mages of the Old Kingdom to guard their most precious vaults and serve as the ultimate defense of their fortresses. Only a handful were ever made, each taking a master team years to construct and requiring materials worth 15,000+ gold. The secret to their creation was thought completely lost in the Cataclysm, making existing Stoneheart Golems priceless artifacts. Scholars and artificers would kill to study one intact. Some believe fewer than twenty still exist in the world.",
    "origin": {
      "known": true,
      "theories": []
    },
    "procedural_notes": "The Stoneheart Golem should be a memorable boss encounter. Place it guarding something critically important in a location with interesting terrain (pillars to hide behind, multiple elevation levels, destructible environment). \n\nUse its slow speed as both weakness and strength - it creates tension as it inexorably advances. Telegraph the Earthquake Stomp (runes glowing brighter, raising foot) so players can try to distance themselves. Use Relentless Guardian to punish hit-and-run tactics. Activate Rune Surge when the party seems to be gaining the upper hand to create a second phase feeling.\n\nHint at escape methods through environmental clues: ancient inscriptions mentioning command words, visible boundaries of its patrol area, the glowing vulnerable heart, structural weaknesses in the room. This is a boss fight where clever players should be able to find alternatives to pure combat.",
    "dm_secrets": "The command word for THIS particular golem is 'Khaz-durum' in the Dwarvish tongue of the mountain kingdoms. It is inscribed in microscopic Dwarvish runes on the back of its neck. A character with Dwarven heritage or who speaks Dwarvish fluently gets Boost dice on checks to discover or pronounce it.\n\nThe golem was created to guard the Royal Treasury. Its guard zone is the Treasury Hall and 30 feet into any connected corridors. If deactivated with the command word rather than destroyed, an intact Stoneheart Golem could be sold for 8,000-12,000gp to the right buyer, or potentially reprogrammed by a sufficiently skilled artificer.",
    "sessionVisibility": {},
    "sessionNotes": {},
    "sessionVariants": {},
    "entity_image_url": null,
    "sounds_calls": ["Deep grinding stone (like millstones)", "Thunderous footfalls that shake the ground", "Crystalline resonant humming that intensifies during Rune Surge", "Explosive rumbling during Earthquake Stomp", "Echoing boom of stone fists"],
    "tags": ["Nemesis", "Construct", "Guardian", "Boss", "Slow", "Heavy", "Magic", "Dungeon", "Legendary"],
    "rarity": 9
  },

  // ENTITY 3: WHISPERING WRAITH
  {
    "name": "Whispering Wraith",
    "scientific_name": "Animae sussurus",
    "alternate_names": ["Shadow Specter", "Echo of the Damned"],
    "entity_type": "Undead",
    "short_description": "A tormented spirit bound to the mortal plane, feeding on fear and draining life force.",
    "full_description": "Whispering Wraiths are the cursed remnants of individuals who died with deep regrets or were victims of betrayal. They exist in a half-state between life and death, unable to rest. Their very presence chills the air and fills the minds of the living with dread. They appear as semi-translucent humanoid shapes shrouded in tattered, ethereal robes, their faces twisted masks of anguish.",
    "physical_appearance": "An incorporeal humanoid figure roughly 6 feet tall, appearing as a dark silhouette wrapped in flowing, tattered robes that drift as if underwater. Its face is a pale, gaunt visage with hollow, glowing eyes - sometimes blue, sometimes green. Wisps of dark mist trail from its form, and the temperature drops noticeably in its presence. No feet touch the ground; it hovers inches above surfaces.",
    "adversary_type": "Rival",
    "silhouette": 1,
    "characteristics": {
      "brawn": 1,
      "agility": 3,
      "intellect": 2,
      "cunning": 3,
      "willpower": 4,
      "presence": 3
    },
    "derived_attributes": {
      "wounds": 12,
      "strain": 0,
      "soak": 0,
      "defense_melee": 1,
      "defense_ranged": 3
    },
    "skills": [
      { "name": "Coercion", "characteristic": "Willpower", "ranks": 2 },
      { "name": "Cool", "characteristic": "Presence", "ranks": 2 },
      { "name": "Deception", "characteristic": "Cunning", "ranks": 2 },
      { "name": "Perception", "characteristic": "Cunning", "ranks": 2 },
      { "name": "Stealth", "characteristic": "Agility", "ranks": 3 }
    ],
    "talents": [
      {
        "name": "Adversary 1",
        "tier": 1,
        "description": "Upgrade difficulty of combat checks against this target once per rank of Adversary."
      }
    ],
    "abilities": [
      {
        "name": "Incorporeal",
        "activation": "Passive",
        "description": "The Wraith can pass through solid objects and is immune to non-magical physical damage. Only magic weapons or spells can harm it."
      },
      {
        "name": "Aura of Dread",
        "activation": "Passive",
        "description": "All characters within Short range suffer 1 Setback die on all checks due to supernatural fear. Characters with Fear rating must check when entering this range."
      },
      {
        "name": "Phase Shift",
        "activation": "Maneuver",
        "description": "Once per round, the Wraith can become fully invisible and intangible as a maneuver, reappearing at the start of its next turn anywhere within Medium range."
      }
    ],
    "actions": [
      {
        "name": "Spectral Touch",
        "type": "Attack",
        "skill": "Brawl",
        "damage": 6,
        "critical": 2,
        "range": "Engaged",
        "qualities": ["Pierce 3", "Vicious 2"],
        "description": "The Wraith's chilling touch bypasses armor and strikes directly at the life force. This attack ignores Soak from armor."
      },
      {
        "name": "Whisper of Despair",
        "type": "Special",
        "cost": "Action",
        "effect": "Target one character within Short range. That character makes an opposed Discipline vs. Coercion check. If the Wraith wins, the target suffers 6 strain and gains 2 Conflict (if applicable). On a Despair, the target is also Immobilized by fear for 1 round.",
        "description": "The Wraith whispers terrible truths and regrets directly into a victim's mind."
      }
    ],
    "equipment": [],
    "encounter_setup": {
      "balanced_count_vs_4players": "1-2 Whispering Wraiths",
      "combat_style": "Hit-and-run using Phase Shift, targeting the mentally weakest party members",
      "retreat_conditions": "Flees if exposed to holy symbols/magic or reduced below 4 wounds, returns to haunt party later"
    },
    "escape_methods": [
      {
        "method": "Present Holy Symbol",
        "difficulty": "Easy",
        "description": "Displaying a holy symbol or invoking divine power (requires holy symbol and faith, or Lore check to use it properly) forces the Wraith to maintain at least Medium range. If the wraith is cornered with a holy symbol, it cannot approach and will eventually dissipate to escape.",
        "success_rate": "Very High"
      },
      {
        "method": "Cross a Line of Salt",
        "difficulty": "Easy",
        "description": "Wraiths cannot cross pure salt lines. Pouring a circle or line of salt creates an absolute barrier. If players can reach salt and create a barrier between themselves and the wraith, they are safe. The wraith will haunt the area but cannot pursue.",
        "success_rate": "Very High (if salt is available)"
      },
      {
        "method": "Resolve Its Unfinished Business",
        "difficulty": "Variable (Average to Daunting)",
        "description": "If players can discover what binds the wraith (usually requires Lore, Perception, or social skills to learn its history), they may be able to put it to rest without combat. This could involve: retrieving a lost item, delivering a message, confronting someone, or performing a burial rite. Requires investigation and roleplay.",
        "success_rate": "Guaranteed (if completed correctly)"
      },
      {
        "method": "Flee to Sunlight/Bright Light",
        "difficulty": "Average",
        "description": "Wraiths are severely weakened by bright light and cannot tolerate direct sunlight. If outdoors during day, reaching sunlight provides sanctuary. Wraiths will not pursue into brightly lit areas. Creating magical light in dark areas grants Boost dice to escape attempts.",
        "success_rate": "High (if light source accessible)"
      },
      {
        "method": "Target Its Fear",
        "difficulty": "Hard",
        "description": "Wraiths are actually afraid of being forgotten or having their pain dismissed. An opposed Coercion or Charm check to acknowledge its suffering, validate its pain, or promise to remember its story can cause it to temporarily cease hostilities. This is not a permanent solution but buys time.",
        "success_rate": "Medium (temporary)"
      },
      {
        "method": "Dispel Magic/Exorcism",
        "difficulty": "Hard",
        "description": "A proper exorcism ritual or powerful dispel magic can banish the wraith (not permanently, but for days or weeks). Requires appropriate magic, religious rites, or a Hard Lore check to perform makeshift banishment. Takes 1-2 rounds of concentration during which the caster is vulnerable.",
        "success_rate": "High (but dangerous)"
      }
    ],
    "loot": {
      "guaranteed_drops": [],
      "random_drops": [
        {
          "item": "Ectoplasmic Residue",
          "chance": 80,
          "quantity": "1d3 vials",
          "rarity": 4,
          "description": "Alchemical component that glows faintly. Used in creating ghost-touch weapons or spirit wards"
        },
        {
          "item": "Soul Fragment",
          "chance": 30,
          "quantity": "1",
          "rarity": 7,
          "description": "A crystallized piece of the wraith's essence. Extremely valuable to necromancers and researchers"
        },
        {
          "item": "Cursed Personal Item",
          "chance": 50,
          "quantity": "1",
          "rarity": 3,
          "description": "An item from the wraith's past life (locket, ring, etc). May contain clues about why they became a wraith"
        }
      ],
      "harvestable_components": [
        {
          "component": "Wraith Essence",
          "harvest_difficulty": "Daunting",
          "required_skill": "Knowledge (Forbidden Lore) or special spirit bottle",
          "quantity": "1",
          "rarity": 8,
          "time_window": "Must capture within 1 minute of destruction using prepared spirit vessel"
        }
      ]
    },
    "diet": "Feeds on fear, despair, and life energy",
    "intelligence_level": "Human-level",
    "communication": {
      "can_speak": true,
      "languages_understood": ["Any languages it knew in life"],
      "special_notes": "Speaks in whispers that echo in the minds of listeners. Its words are often cryptic or focused on its torment."
    },
    "motivation": "Bound by unfinished business, seeking revenge or trying to communicate regrets, or simply spreading misery",
    "detection": {
      "warning_signs": ["Sudden temperature drop", "Whispers with no source", "Feelings of dread", "Flickering lights", "Breath becomes visible"],
      "detection_skills": ["Perception", "Knowledge (Forbidden Lore)", "Vigilance"],
      "detection_difficulty": "Hard"
    },
    "vulnerabilities": [
      {
        "type": "Radiant/Holy Energy",
        "severity": "Critical",
        "description": "Radiant damage ignores Incorporeal defense and deals double damage. Holy symbols force the wraith to stay at Medium range or farther."
      },
      {
        "type": "Salt Circles",
        "severity": "Major",
        "description": "Cannot cross a line of salt or enter a salt circle. Takes 3 strain per round if trapped within one."
      }
    ],
    "resistances": [
      {
        "type": "Physical (Non-magical)",
        "level": "Immunity",
        "description": "Completely immune to non-magical physical damage due to Incorporeal nature"
      },
      {
        "type": "Cold",
        "level": "High",
        "description": "Being undead and associated with cold, takes half damage from cold effects"
      }
    ],
    "condition_immunities": ["Poisoned", "Diseased", "Exhaustion", "Grappled", "Restrained"],
    "variants": [
      {
        "name": "Vengeful Spectre",
        "adversary_type": "Nemesis",
        "spawn_chance": 15,
        "description": "A more powerful wraith consumed by rage and focused on a specific target of revenge. These spectres have given in completely to their obsession and gained terrifying powers in the process.",
        "stat_changes": "Wounds 18, Strain 14, Presence 4, Willpower 5",
        "special_notes": "Fixated on one individual (determine based on backstory); will ignore others unless directly threatened. Can possess living creatures.",

        "talents": [
          {
            "name": "Adversary 2",
            "replaces": "Adversary 1", // Upgrades from base
            "tier": 2,
            "description": "Upgrade the difficulty of combat checks against the Vengeful Spectre twice."
          }
        ],

        "abilities": [
          {
            "name": "Vengeful Aura",
            "replaces": "Aura of Dread", // Enhanced version
            "activation": "Passive",
            "description": "All characters within Medium range (instead of Short) suffer 2 Setback dice (instead of 1) on all checks. Additionally, the Spectre's target of vengeance suffers an additional Setback die and cannot spend Destiny Points while within this aura."
          },
          {
            "name": "Possession",
            "activation": "Action",
            "description": "The Spectre attempts to possess one living creature within Short range. Target makes an opposed Discipline vs. Coercion check. If the Spectre wins, it possesses the target's body. While possessed, the Spectre controls the target's actions, can speak through them, and cannot be targeted separately. The target can attempt a Hard Discipline check at the start of each of their turns to expel the Spectre. Possession ends if the host body is incapacitated."
          },
          {
            "name": "Manifestation",
            "activation": "Incidental",
            "description": "Once per encounter, when reduced to 0 wounds, the Spectre can immediately manifest again at full wounds at the start of the next round, appearing anywhere within Long range. This can only happen once per encounter."
          },
          {
            "name": "Greater Incorporeal",
            "replaces": "Incorporeal", // Enhanced version
            "activation": "Passive",
            "description": "Enhanced Incorporeal nature. The Spectre is immune to non-magical physical damage, gains Defense (Ranged) 4 (instead of 3), and can pass through living creatures, dealing 4 wounds (ignores Soak) when doing so."
          }
        ],

        "actions": [
          {
            "name": "Spectral Drain",
            "replaces": "Spectral Touch", // Enhanced version of base attack
            "type": "Attack",
            "skill": "Brawl",
            "damage": 8,
            "critical": 2,
            "range": "Engaged",
            "qualities": ["Pierce 4", "Vicious 3", "Ensnare 2"],
            "description": "An enhanced version of Spectral Touch that drains the target's essence more aggressively and can potentially root them in place with ghostly chains."
          },
          {
            "name": "Howl of Anguish",
            "replaces": "Whisper of Despair", // More powerful version
            "type": "Special",
            "cost": "Action (twice per encounter)",
            "effect": "The Spectre releases a terrifying wail. All characters within Medium range must make a Hard Fear check with 3 setback dice. Those who fail suffer 8 strain, become Immobilized for 2 rounds, and gain the Despair condition. Even those who succeed suffer 4 strain.",
            "description": "The Spectre channels its rage and sorrow into a devastating psychic attack, far more powerful than the base Whisper of Despair."
          },
          {
            "name": "Curse of Vengeance",
            "type": "Special",
            "cost": "Maneuver (once per session)",
            "effect": "The Spectre curses its target of vengeance. For the rest of the session, that character downgrades all positive dice once and upgrades all negative dice once. The curse can only be removed by completing the Spectre's vengeance or through powerful divine magic (Formidable difficulty).",
            "description": "The Spectre marks its target with a lasting supernatural curse."
          }
        ]
      }
    ],
    "lore_text": "Whispering Wraiths are created when a person dies with overwhelming regret, was betrayed at the moment of death, or had their soul bound by dark magic. They are trapped between worlds, unable to move on. Some can be released by resolving their unfinished business, while others are too far gone and must be destroyed. Graveyards, battlefields, and places of great tragedy are common haunting grounds.",
    "origin": {
      "known": true,
      "theories": []
    },
    "procedural_notes": "Use the Wraith's Incorporeal nature to create tension - players can't just hack at it. Have it appear and disappear using Phase Shift. Use Whisper of Despair on spellcasters or low-Willpower characters. Consider giving it a tragic backstory that players can discover, allowing for a non-combat resolution.",
    "dm_secrets": "This particular Wraith was once a scholar named Elias Mordren who was murdered by his apprentice. He haunts the old library where he died. If players discover his hidden journal and confront the apprentice (now an old man), the Wraith can be put to rest peacefully. The apprentice lives in the nearby town as a respected elder.",
    "sessionVisibility": {},
    "sessionNotes": {},
    "sessionVariants": {},
    "entity_image_url": null,
    "sounds_calls": ["Soft whispers", "Mournful wailing", "Echoing sighs", "Wind chimes (when no wind is present)"],
    "tags": ["Undead", "Incorporeal", "Intelligent", "Tragic", "Haunting", "Fear"],
    "rarity": 6
  }
];

export default function Entities() {
  const [entities, setEntities] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('All');
  const [adversaryFilter, setAdversaryFilter] = useState('All');
  const [showHiddenOnly, setShowHiddenOnly] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const [activeEntity, setActiveEntity] = useState(null);
  const sessionId = getActiveSession();
  const userIsDM = isDM();

  const showToast = (message, severity = 'success') => {
    setToast({ open: true, message, severity });
  };

  const hideToast = () => {
    setToast({ ...toast, open: false });
  };

  useEffect(() => {
    if (!requireSession()) return;
    if (localStorage.getItem("loggedIn") !== 'false') {
      getFromDB();
    }
  }, [sessionId]);

  const getFromDB = () => {
    if (!sessionId) return;

    const q = query(collection(db, 'Entities'));

    const unsub = onSnapshot(q, (querySnapshot) => {
      const queryData = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const sessionVisibility = data.sessionVisibility || {};
        
        queryData.push({ 
          docId: doc.id, 
          ...data,
          hiddenInCurrentSession: sessionVisibility[sessionId] === false
        });
      });
      
      queryData.sort((a, b) => a.name.localeCompare(b.name));
      
      setEntities(queryData);
      setLoading(false);
    }, (error) => {
      console.error('Error loading entities:', error);
      showToast('Error loading entities', 'error');
      setLoading(false);
    });

    return () => { unsub(); };
  };

  const uploadEntityData = async () => {
    if (!userIsDM) {
      showToast('Only DMs can upload entity data', 'error');
      return;
    }

    const confirmUpload = window.confirm(
      `This will add ${entityData.length} entities to the global database (visible to all sessions by default). Continue?`
    );

    if (!confirmUpload) return;

    try {
      for (let i = 0; i < entityData.length; i++) {
        const entity = {
          ...entityData[i],
          sessionVisibility: {}
        };

        await setDoc(doc(db, 'Entities', entityData[i].name), entity);
      }
      
      showToast(`Successfully added ${entityData.length} entities!`, 'success');
    } catch (error) {
      showToast('Error uploading entity data', 'error');
      console.error('Upload error:', error);
    }
  };

  const toggleEntityVisibility = async (entity) => {
    if (!userIsDM || !sessionId) return;
    
    try {
      const currentSessionVisibility = entity.sessionVisibility || {};
      const newVisibility = {
        ...currentSessionVisibility,
        [sessionId]: currentSessionVisibility[sessionId] === false ? true : false
      };

      await updateDoc(doc(db, 'Entities', entity.docId), {
        sessionVisibility: newVisibility
      });
      
      const action = newVisibility[sessionId] === false ? 'hidden' : 'revealed';
      showToast(`${entity.name} ${action} for this session`, 'success');
    } catch (error) {
      console.error('Error toggling visibility:', error);
      showToast('Error updating entity visibility', 'error');
    }
  };

  const getFilteredEntities = () => {
    return entities.filter((entity) => {
      const visibilityCheck = userIsDM ? true : !entity.hiddenInCurrentSession;
      const hiddenFilterCheck = showHiddenOnly ? entity.hiddenInCurrentSession : true;
      
      return (
        visibilityCheck &&
        hiddenFilterCheck &&
        (entity.entity_type === filterType || filterType === 'All') &&
        (entity.adversary_type === adversaryFilter || adversaryFilter === 'All') &&
        (entity.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
         entity.short_description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         searchTerm === '')
      );
    });
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setFilterType('All');
    setAdversaryFilter('All');
    setShowHiddenOnly(false);
    showToast('All filters cleared');
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (searchTerm !== '') count++;
    if (filterType !== 'All') count++;
    if (adversaryFilter !== 'All') count++;
    if (showHiddenOnly) count++;
    return count;
  };

  if (localStorage.getItem("loggedIn") === 'false') {
    return <NotLoggedIn />;
  }

  const FilterChip = ({ label, onDelete }) => (
    <div className="inline-flex items-center space-x-2 bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm border border-purple-500/30">
      <span>{label}</span>
      <button onClick={onDelete} className="text-purple-400 hover:text-purple-200 transition-colors">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
        </svg>
      </button>
    </div>
  );

  const FilterSection = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Entity Type</label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          >
            <option value="All" className="bg-gray-800">All Types</option>
            <option value="Beast" className="bg-gray-800">🐺 Beast</option>
            <option value="Humanoid" className="bg-gray-800">👤 Humanoid</option>
            <option value="Construct" className="bg-gray-800">🤖 Construct</option>
            <option value="Undead" className="bg-gray-800">💀 Undead</option>
            <option value="Aberration" className="bg-gray-800">👁️ Aberration</option>
            <option value="Spectral" className="bg-gray-800">👻 Spectral</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Adversary Type</label>
          <select
            value={adversaryFilter}
            onChange={(e) => setAdversaryFilter(e.target.value)}
            className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          >
            <option value="All" className="bg-gray-800">All Adversaries</option>
            <option value="Minion" className="bg-gray-800">Minion</option>
            <option value="Rival" className="bg-gray-800">Rival</option>
            <option value="Nemesis" className="bg-gray-800">Nemesis</option>
          </select>
        </div>

        {userIsDM && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Visibility Filter</label>
            <button
              onClick={() => setShowHiddenOnly(!showHiddenOnly)}
              className={`w-full px-4 py-3 rounded-lg font-medium transition-all ${
                showHiddenOnly
                  ? 'bg-red-500/30 text-red-300 border-2 border-red-500/50'
                  : 'bg-white/5 text-gray-300 border-2 border-white/20 hover:bg-white/10'
              }`}
            >
              {showHiddenOnly ? '🚫 Hidden Only' : '👁️ Show All'}
            </button>
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Actions</label>
          <button
            onClick={clearAllFilters}
            disabled={getActiveFilterCount() === 0}
            className="w-full bg-gradient-to-r from-red-600/20 to-pink-600/20 hover:from-red-600/30 hover:to-pink-600/30 disabled:from-gray-600/20 disabled:to-gray-700/20 text-red-300 disabled:text-gray-500 font-medium px-4 py-3 rounded-lg border border-red-500/30 disabled:border-gray-500/30 transition-all duration-300 hover:scale-105 disabled:hover:scale-100 flex items-center justify-center space-x-2"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
            </svg>
            <span>Clear Filters</span>
          </button>
        </div>
      </div>

      {getActiveFilterCount() > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-300">Active Filters:</h3>
            <button
              onClick={clearAllFilters}
              className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors flex items-center space-x-1"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
              </svg>
              <span>Clear All</span>
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {searchTerm && <FilterChip label={`Search: "${searchTerm}"`} onDelete={() => setSearchTerm('')} />}
            {filterType !== 'All' && <FilterChip label={`Type: ${filterType}`} onDelete={() => setFilterType('All')} />}
            {adversaryFilter !== 'All' && <FilterChip label={`Adversary: ${adversaryFilter}`} onDelete={() => setAdversaryFilter('All')} />}
            {showHiddenOnly && <FilterChip label="Hidden Only" onDelete={() => setShowHiddenOnly(false)} />}
          </div>
        </div>
      )}
    </div>
  );

  const DisplayEntities = () => {
    const filteredEntities = getFilteredEntities();

    if (filteredEntities.length === 0) {
      return (
        <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-12 text-center">
          <svg className="w-16 h-16 text-gray-500 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path>
          </svg>
          <h3 className="text-xl font-semibold text-white mb-2">No entities found</h3>
          <p className="text-gray-400 mb-4">Try adjusting your search criteria to find more entities</p>
          {getActiveFilterCount() > 0 && (
            <button
              onClick={clearAllFilters}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Clear All Filters
            </button>
          )}
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <svg className="w-6 h-6 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <h2 className="text-xl font-bold text-white">
              Found {filteredEntities.length} entit{filteredEntities.length !== 1 ? 'ies' : 'y'}
            </h2>
          </div>
          <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm font-bold">
            {entities.length} total
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredEntities.map((entity) => (
            <div key={entity.docId} className="bg-black/20 backdrop-blur-lg rounded-xl border border-white/10 p-1 hover:bg-black/30 transition-all duration-300">
              <EntityItem 
                entity={entity}
                onShowDetails={setActiveEntity}
                onToggleVisibility={toggleEntityVisibility}
                userIsDM={userIsDM}
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900">
      <div className="w-full px-4 py-6 space-y-6">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-900/50 to-indigo-900/50 backdrop-blur-lg rounded-2xl border border-white/10 p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd"></path>
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Entity Codex</h1>
                <p className="text-purple-300">Browse all creatures, constructs, and adversaries</p>
              </div>
            </div>
            
            {userIsDM && (
              <button 
                onClick={uploadEntityData}
                className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"></path>
                </svg>
                <span>Upload Sample Entities</span>
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-12">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-400 mb-4"></div>
              <h3 className="text-xl font-semibold text-white mb-2">Loading entity codex...</h3>
              <p className="text-gray-400">Please wait while we fetch the data</p>
            </div>
          </div>
        ) : entities.length > 0 ? (
          <>
            {/* Search and Filter Section */}
            <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600/20 to-indigo-600/20 p-4 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <svg className="w-6 h-6 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3 7v10a2 2 0 002 2h14l-2-2H5V7h14V5a2 2 0 00-2-2H5a2 2 0 00-2 2v2z"></path>
                      <path d="M21 7H3v2h18V7z"></path>
                    </svg>
                    <h2 className="text-xl font-bold text-white">Search & Filter</h2>
                    {getActiveFilterCount() > 0 && (
                      <span className="bg-purple-500/30 text-purple-300 px-2 py-1 rounded-full text-xs font-bold">
                        {getActiveFilterCount()} active
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm font-bold">
                      {getFilteredEntities().length} shown
                    </span>
                    <button 
                      onClick={() => setFiltersOpen(!filtersOpen)}
                      className="md:hidden bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 p-2 rounded-lg transition-colors"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Search Bar - Always Visible */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search entities by name or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white/5 border border-white/20 rounded-xl pl-12 pr-12 py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-lg"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white transition-colors"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                      </svg>
                    </button>
                  )}
                </div>

                {/* Advanced Filters - Collapsible on Mobile */}
                <div className="hidden md:block">
                  <FilterSection />
                </div>
                
                {filtersOpen && (
                  <div className="md:hidden">
                    <FilterSection />
                  </div>
                )}
              </div>
            </div>

            {/* Results */}
            <DisplayEntities />
          </>
        ) : (
          <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-12">
            <div className="flex flex-col items-center justify-center text-center">
              <svg className="w-16 h-16 text-gray-500 mb-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd"></path>
              </svg>
              <h3 className="text-xl font-semibold text-white mb-2">No entity data available</h3>
              <p className="text-gray-400">Upload some entities to get started</p>
            </div>
          </div>
        )}

        {/* Mobile Filter Fab */}
        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          className="md:hidden fixed bottom-6 right-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 transform hover:scale-110"
        >
          <div className="relative">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd"></path>
            </svg>
            {getActiveFilterCount() > 0 && (
              <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {getActiveFilterCount()}
              </div>
            )}
          </div>
        </button>
      </div>

      {/* Toast Notification */}
      <Toast 
        message={toast.message}
        severity={toast.severity} 
        isOpen={toast.open} 
        onClose={hideToast} 
      />

      {/* Entity Details Modal */}
      {activeEntity && <EntityDetailsModal entity={activeEntity} onClose={() => setActiveEntity(null)} />}
    </div>
  );
}

// Entity Details Modal Component
const EntityDetailsModal = ({ entity, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedVariant, setSelectedVariant] = useState(null);

  const parseStatChanges = (statChangesString, baseEntity) => {
    if (!statChangesString) return {};

    const changes = {
      characteristics: {},
      derived_attributes: {}
    };

    // Split by comma and parse each change
    const parts = statChangesString.split(',').map(s => s.trim());

    parts.forEach(part => {
      // Match patterns like "Wounds 12", "Brawn 3", "Soak 5", etc.
      const match = part.match(/^(\w+)\s+(\d+)$/);
      if (match) {
        const [, stat, value] = match;
        const numValue = parseInt(value);

        // Map stat names to their locations
        const statLower = stat.toLowerCase();

        // Derived attributes
        if (statLower === 'wounds') {
          changes.derived_attributes.wounds = numValue;
        } else if (statLower === 'strain') {
          changes.derived_attributes.strain = numValue;
        } else if (statLower === 'soak') {
          changes.derived_attributes.soak = numValue;
        } else if (statLower === 'defense' || statLower === 'defense_melee') {
          changes.derived_attributes.defense_melee = numValue;
        } else if (statLower === 'defense_ranged') {
          changes.derived_attributes.defense_ranged = numValue;
        } else if (statLower === 'silhouette') {
          changes.silhouette = numValue;
        }
        // Characteristics
        else if (statLower === 'brawn') {
          changes.characteristics.brawn = numValue;
        } else if (statLower === 'agility') {
          changes.characteristics.agility = numValue;
        } else if (statLower === 'intellect') {
          changes.characteristics.intellect = numValue;
        } else if (statLower === 'cunning') {
          changes.characteristics.cunning = numValue;
        } else if (statLower === 'willpower') {
          changes.characteristics.willpower = numValue;
        } else if (statLower === 'presence') {
          changes.characteristics.presence = numValue;
        }
      }
    });

    console.log(changes);
    return changes;
  };

  const getDisplayEntity = () => {
    if (!selectedVariant) return entity;
    
    const variant = entity.variants.find(v => v.name === selectedVariant);
    if (!variant) return entity;
    
    // Create merged entity
    const mergedEntity = { ...entity };
    
    // Parse and apply stat changes from the string
    const statChanges = parseStatChanges(variant.stat_changes, entity);
    
    // Apply parsed characteristic changes
    if (Object.keys(statChanges.characteristics).length > 0) {
      mergedEntity.characteristics = { 
        ...entity.characteristics, 
        ...statChanges.characteristics 
      };
    }

    // Apply parsed derived attribute changes
    if (Object.keys(statChanges.derived_attributes).length > 0) {
      mergedEntity.derived_attributes = { 
        ...entity.derived_attributes, 
        ...statChanges.derived_attributes 
      };
    }

    // Apply silhouette change if present
    if (statChanges.silhouette !== undefined) {
      mergedEntity.silhouette = statChanges.silhouette;
    }

    // Merge/replace talents
    if (variant.talents && variant.talents.length > 0) {
      const baseTalents = entity.talents || [];
      const variantTalents = variant.talents.map(t => ({ ...t, isVariant: true }));

      const mergedTalents = [...baseTalents];
      variantTalents.forEach(vt => {
        const existingIndex = mergedTalents.findIndex(t => t.name === vt.name);
        if (vt.replaces) {
          const replaceIndex = mergedTalents.findIndex(t => t.name === vt.replaces);
          if (replaceIndex !== -1) mergedTalents.splice(replaceIndex, 1);
          mergedTalents.push(vt);
        } else if (existingIndex !== -1) {
          mergedTalents[existingIndex] = vt;
        } else {
          mergedTalents.push(vt);
        }
      });
      mergedEntity.talents = mergedTalents;
    }

    // Merge/replace abilities
    if (variant.abilities && variant.abilities.length > 0) {
      const baseAbilities = entity.abilities || [];
      const variantAbilities = variant.abilities.map(a => ({ ...a, isVariant: true }));

      const mergedAbilities = [...baseAbilities];
      variantAbilities.forEach(va => {
        if (va.replaces) {
          const replaceIndex = mergedAbilities.findIndex(a => a.name === va.replaces);
          if (replaceIndex !== -1) mergedAbilities.splice(replaceIndex, 1);
          mergedAbilities.push(va);
        } else {
          const existingIndex = mergedAbilities.findIndex(a => a.name === va.name);
          if (existingIndex !== -1) {
            mergedAbilities[existingIndex] = va;
          } else {
            mergedAbilities.push(va);
          }
        }
      });
      mergedEntity.abilities = mergedAbilities;
    }

    // Merge/replace actions
    if (variant.actions && variant.actions.length > 0) {
      const baseActions = entity.actions || [];
      const variantActions = variant.actions.map(a => ({ ...a, isVariant: true }));

      const mergedActions = [...baseActions];
      variantActions.forEach(va => {
        if (va.replaces) {
          const replaceIndex = mergedActions.findIndex(a => a.name === va.replaces);
          if (replaceIndex !== -1) mergedActions.splice(replaceIndex, 1);
          mergedActions.push(va);
        } else {
          const existingIndex = mergedActions.findIndex(a => a.name === va.name);
          if (existingIndex !== -1) {
            mergedActions[existingIndex] = va;
          } else {
            mergedActions.push(va);
          }
        }
      });
      mergedEntity.actions = mergedActions;
    }

    // Add variant metadata
    mergedEntity._activeVariant = variant.name;
    mergedEntity._variantDescription = variant.description;

    return mergedEntity;
  };

  const displayEntity = getDisplayEntity();

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="h-full w-full flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 md:m-4 md:rounded-2xl md:border-2 md:border-white/20 md:h-auto md:max-h-[90vh] md:max-w-6xl md:mx-auto overflow-hidden">
        
        {/* Compact Header */}
        <div className="flex-shrink-0 bg-gradient-to-r from-purple-600/20 to-indigo-600/20 border-b border-white/10">
          {/* Top Bar */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center text-2xl border border-white/30 shadow-lg">
                <span>{getEntityTypeIcon(entity.entity_type)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg md:text-xl font-bold text-white truncate">{entity.name}</h2>
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-purple-300 text-sm">{entity.entity_type} • {entity.adversary_type}</p>
                  {selectedVariant && (
                    <span className="px-2 py-0.5 bg-amber-500/30 text-amber-300 rounded text-xs font-bold border border-amber-500/50 flex items-center gap-1">
                      <span>🔀</span>
                      {selectedVariant}
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            {/* Close Button */}
            <button
              onClick={onClose}
              className="flex-shrink-0 p-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg border border-red-500/50 transition-all ml-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
              </svg>
            </button>
          </div>

          {/* Tabs - Horizontal Scroll on Mobile */}
          <div className="overflow-x-auto hide-scrollbar">
            <div className="flex gap-2 p-3 min-w-max">
              <MobileTabButton
                active={activeTab === 'overview'}
                onClick={() => setActiveTab('overview')}
                icon="📋"
                label="Overview"
              />
              <MobileTabButton
                active={activeTab === 'combat'}
                onClick={() => setActiveTab('combat')}
                icon="⚔️"
                label="Combat"
              />
              <MobileTabButton
                active={activeTab === 'abilities'}
                onClick={() => setActiveTab('abilities')}
                icon="✨"
                label="Abilities"
                count={entity.abilities?.length || 0}
              />
              <MobileTabButton
                active={activeTab === 'lore'}
                onClick={() => setActiveTab('lore')}
                icon="📖"
                label="Lore"
              />
            </div>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'overview' && <EntityOverviewTab entity={displayEntity} selectedVariant={selectedVariant} onSelectVariant={setSelectedVariant} />}
          {activeTab === 'combat' && <EntityCombatTab entity={displayEntity} />}
          {activeTab === 'abilities' && <EntityAbilitiesTab entity={displayEntity} />}
          {activeTab === 'lore' && <EntityLoreTab entity={displayEntity} />}
        </div>
      </div>
    </div>
  );
};

// Helper function for entity type icons
const getEntityTypeIcon = (type) => {
  const icons = {
    'Beast': '🐺',
    'Humanoid': '👤',
    'Construct': '🤖',
    'Undead': '💀',
    'Aberration': '👁️',
    'Spectral': '👻',
    'Dragon': '🐉',
    'Elemental': '🔥'
  };
  return icons[type] || '❓';
};

const getDifficultyColorForEscape = (difficulty) => {
  switch(difficulty) {
    case 'Easy':
      return 'bg-green-500/30 text-green-300 border border-green-500/50';
    case 'Average':
      return 'bg-blue-500/30 text-blue-300 border border-blue-500/50';
    case 'Hard':
      return 'bg-yellow-500/30 text-yellow-300 border border-yellow-500/50';
    case 'Daunting':
      return 'bg-orange-500/30 text-orange-300 border border-orange-500/50';
    case 'Formidable':
      return 'bg-red-500/30 text-red-300 border border-red-500/50';
    default:
      return 'bg-gray-500/30 text-gray-300 border border-gray-500/50';
  }
};

const getSuccessRateColor = (rate) => {
  if (rate.includes('Very High')) return 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/50';
  if (rate.includes('High')) return 'bg-green-500/30 text-green-300 border border-green-500/50';
  if (rate.includes('Medium')) return 'bg-yellow-500/30 text-yellow-300 border border-yellow-500/50';
  if (rate.includes('Low')) return 'bg-orange-500/30 text-orange-300 border border-orange-500/50';
  return 'bg-gray-500/30 text-gray-300 border border-gray-500/50';
};

// Mobile Tab Button Component
const MobileTabButton = ({ active, onClick, icon, label, count }) => (
  <button
    onClick={onClick}
    className={`flex-shrink-0 px-4 py-2 rounded-lg font-medium text-sm transition-all whitespace-nowrap ${
      active
        ? 'bg-purple-500/30 text-purple-300 border-2 border-purple-500/50'
        : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
    }`}
  >
    <span className="mr-1">{icon}</span>
    {label}
    {count !== undefined && count > 0 && (
      <span className={`ml-1.5 px-1.5 py-0.5 rounded text-xs ${active ? 'bg-purple-500/40' : 'bg-white/10'}`}>
        {count}
      </span>
    )}
  </button>
);

// Entity Overview Tab
const EntityOverviewTab = ({ entity, selectedVariant, onSelectVariant }) => {
  return (
    <div className="space-y-4">
      {/* Physical Appearance */}
      {entity.physical_appearance && (
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
          <h3 className="text-white font-bold mb-2 flex items-center gap-2">
            <span>👁️</span> Physical Appearance
          </h3>
          <p className="text-gray-300 leading-relaxed">{entity.physical_appearance}</p>
        </div>
      )}

      {/* Full Description */}
      {entity.full_description && (
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
          <h3 className="text-white font-bold mb-2 flex items-center gap-2">
            <span>📝</span> Description
          </h3>
          <p className="text-gray-300 leading-relaxed">{entity.full_description}</p>
        </div>
      )}

      {/* Short Description if no Full Description */}
      {!entity.full_description && entity.short_description && (
        <div className="bg-purple-900/20 border border-purple-500/30 rounded-xl p-4">
          <p className="text-purple-200 italic leading-relaxed">{entity.short_description}</p>
        </div>
      )}

      {/* Loot Section */}
      <div className="space-y-4">
        {/* Guaranteed Drops */}
        {entity.loot?.guaranteed_drops && entity.loot.guaranteed_drops.length > 0 && (
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
            <h3 className="text-white font-bold mb-3 flex items-center gap-2">
              <span>💰</span> Guaranteed Drops
            </h3>
            <div className="space-y-2">
              {entity.loot.guaranteed_drops.map((drop, idx) => (
                <div key={idx} className="bg-green-900/20 border border-green-500/30 rounded-lg p-3">
                  <span className="text-green-300 font-medium">{drop}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Random Drops */}
        {entity.loot?.random_drops && entity.loot.random_drops.length > 0 && (
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
            <h3 className="text-white font-bold mb-3 flex items-center gap-2">
              <span>🎲</span> Random Drops
            </h3>
            <div className="space-y-3">
              {entity.loot.random_drops.map((drop, idx) => (
                <div key={idx} className="bg-gradient-to-r from-cyan-900/20 to-blue-900/20 border border-cyan-500/30 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-cyan-300 font-bold">{drop.item}</h4>
                    <div className="flex gap-2">
                      <span className="px-2 py-1 bg-cyan-500/30 text-cyan-300 rounded text-xs font-bold">
                        {drop.chance}%
                      </span>
                      <span className="px-2 py-1 bg-purple-500/30 text-purple-300 rounded text-xs font-bold">
                        R{drop.rarity}
                      </span>
                    </div>
                  </div>
                  <div className="text-cyan-400 text-xs mb-2">Quantity: {drop.quantity}</div>
                  <p className="text-gray-300 text-sm">{drop.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Harvestable Components */}
        {entity.loot?.harvestable_components && entity.loot.harvestable_components.length > 0 && (
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
            <h3 className="text-white font-bold mb-3 flex items-center gap-2">
              <span>🔬</span> Harvestable Components
            </h3>
            <div className="space-y-3">
              {entity.loot.harvestable_components.map((comp, idx) => (
                <div key={idx} className="bg-gradient-to-r from-amber-900/20 to-orange-900/20 border border-amber-500/30 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-amber-300 font-bold">{comp.component}</h4>
                    <span className="px-2 py-1 bg-purple-500/30 text-purple-300 rounded text-xs font-bold">
                      R{comp.rarity}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <div className="text-xs">
                      <span className="text-gray-400">Difficulty:</span>
                      <span className="text-white font-bold ml-1">{comp.harvest_difficulty}</span>
                    </div>
                    <div className="text-xs">
                      <span className="text-gray-400">Quantity:</span>
                      <span className="text-white font-bold ml-1">{comp.quantity}</span>
                    </div>
                  </div>
                  <div className="text-amber-400 text-xs mb-2">Skill: {comp.required_skill}</div>
                  {comp.time_window && (
                    <div className="bg-red-500/20 border border-red-500/30 rounded p-2">
                      <span className="text-red-300 text-xs font-bold">⏰ {comp.time_window}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

            {/* Variants */}
      {entity.variants && entity.variants.length > 0 && (
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
          <h3 className="text-white font-bold mb-3 flex items-center gap-2">
            <span>🔀</span> Variants
            {selectedVariant && (
              <button
                onClick={() => onSelectVariant(null)}
                className="ml-auto px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded text-xs font-bold border border-red-500/50 transition-all"
              >
                Reset to Base
              </button>
            )}
          </h3>
          
          <div className="space-y-2">
            {entity.variants.map((variant, idx) => (
              <button
                key={idx}
                onClick={() => onSelectVariant(selectedVariant === variant.name ? null : variant.name)}
                className={`w-full text-left transition-all ${
                  selectedVariant === variant.name
                    ? 'bg-gradient-to-r from-amber-600/40 to-orange-600/40 border-2 border-amber-500 shadow-lg'
                    : 'bg-gradient-to-r from-indigo-900/20 to-purple-900/20 border border-indigo-500/30 hover:border-indigo-500/60 hover:bg-indigo-900/30'
                } rounded-lg p-4`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className={`font-bold ${selectedVariant === variant.name ? 'text-amber-300' : 'text-indigo-300'}`}>
                        {variant.name}
                      </h4>
                      {selectedVariant === variant.name && (
                        <span className="px-2 py-0.5 bg-amber-500/40 text-amber-200 rounded text-xs font-bold">
                          ACTIVE
                        </span>
                      )}
                    </div>
                    <p className={`text-xs ${selectedVariant === variant.name ? 'text-amber-200/80' : 'text-gray-400'}`}>
                      {variant.description}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1 ml-2">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      selectedVariant === variant.name
                        ? 'bg-amber-500/40 text-amber-200 border border-amber-500/60'
                        : 'bg-indigo-500/30 text-indigo-300 border border-indigo-500/50'
                    }`}>
                      {variant.adversary_type}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      selectedVariant === variant.name
                        ? 'bg-orange-500/40 text-orange-200 border border-orange-500/60'
                        : 'bg-purple-500/30 text-purple-300 border border-purple-500/50'
                    }`}>
                      {variant.spawn_chance}%
                    </span>
                  </div>
                </div>
                  
                {/* Summary of changes */}
                {variant.stat_changes && (
                  <div className={`text-xs mt-2 px-2 py-1 rounded ${
                    selectedVariant === variant.name
                      ? 'bg-amber-500/20 text-amber-200'
                      : 'bg-white/5 text-gray-400'
                  }`}>
                    {variant.stat_changes}
                  </div>
                )}

                {/* Change indicators */}
                <div className="flex gap-2 mt-2 flex-wrap">
                  {variant.talents && variant.talents.length > 0 && (
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      selectedVariant === variant.name
                        ? 'bg-yellow-500/30 text-yellow-200'
                        : 'bg-yellow-500/20 text-yellow-300'
                    }`}>
                      +{variant.talents.length} Talent{variant.talents.length !== 1 ? 's' : ''}
                    </span>
                  )}
                  {variant.abilities && variant.abilities.length > 0 && (
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      selectedVariant === variant.name
                        ? 'bg-purple-500/30 text-purple-200'
                        : 'bg-purple-500/20 text-purple-300'
                    }`}>
                      +{variant.abilities.length} Abilit{variant.abilities.length !== 1 ? 'ies' : 'y'}
                    </span>
                  )}
                  {variant.actions && variant.actions.length > 0 && (
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      selectedVariant === variant.name
                        ? 'bg-red-500/30 text-red-200'
                        : 'bg-red-500/20 text-red-300'
                    }`}>
                      +{variant.actions.length} Action{variant.actions.length !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>
                
                {selectedVariant === variant.name && (
                  <div className="mt-3 pt-3 border-t border-amber-500/30">
                    <p className="text-amber-200 text-xs">
                      ✨ Click tabs above to see variant changes applied throughout
                    </p>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Entity Combat Tab
const EntityCombatTab = ({ entity }) => {
  return (
    <div className="space-y-4">
      {/* Attributes (Characteristics) */}
      <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
        <h3 className="text-white font-bold mb-3 flex items-center gap-2">
          <span>📊</span> Attributes
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {Object.entries(entity.characteristics || {}).map(([key, value]) => (
            <div key={key} className="bg-slate-900/50 rounded-lg p-3 border border-slate-600">
              <div className="text-xs text-gray-400 mb-1 capitalize">{key}</div>
              <div className="text-2xl font-bold text-white">{value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Defenses */}
      <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
        <h3 className="text-white font-bold mb-3 flex items-center gap-2">
          <span>🛡️</span> Defenses
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-600">
            <div className="text-xs text-gray-400 mb-1">Silhouette</div>
            <div className="text-2xl font-bold text-purple-400">{entity.silhouette}</div>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-600">
            <div className="text-xs text-gray-400 mb-1">Wounds</div>
            <div className="text-2xl font-bold text-red-400">{entity.derived_attributes?.wounds || 0}</div>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-600">
            <div className="text-xs text-gray-400 mb-1">Strain</div>
            <div className="text-2xl font-bold text-yellow-400">{entity.derived_attributes?.strain || 0}</div>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-600">
            <div className="text-xs text-gray-400 mb-1">Soak</div>
            <div className="text-2xl font-bold text-green-400">{entity.derived_attributes?.soak || 0}</div>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-600">
            <div className="text-xs text-gray-400 mb-1">Defense</div>
            <div className="text-2xl font-bold text-blue-400">
              {entity.derived_attributes?.defense_melee || 0}/{entity.derived_attributes?.defense_ranged || 0}
            </div>
          </div>
        </div>
      </div>

      {/* Skills */}
      {entity.skills && entity.skills.length > 0 && (
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
          <h3 className="text-white font-bold mb-3 flex items-center gap-2">
            <span>🎯</span> Skills
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {entity.skills.map((skill, idx) => (
              <div key={idx} className="bg-white/5 rounded-lg p-3 flex justify-between items-center">
                <span className="text-gray-300">{skill.name}</span>
                <span className="text-purple-400 font-bold">
                  {skill.ranks} ({entity.characteristics?.[skill.characteristic.toLowerCase()] || 0})
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      {entity.actions && entity.actions.length > 0 && (
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
          <h3 className="text-white font-bold mb-3 flex items-center gap-2">
            <span>⚔️</span> Actions
          </h3>
          <div className="space-y-3">
            {entity.actions.map((action, idx) => (
              <div key={idx} className="bg-gradient-to-r from-red-900/20 to-orange-900/20 border border-red-500/30 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-red-300 font-bold">{action.name}</h4>
                  <div className="flex gap-2">
                    {action.isVariant && (
                      <span className="px-2 py-1 bg-amber-500/40 text-amber-200 rounded text-xs font-bold border border-amber-500/60">
                        VARIANT
                      </span>
                    )}
                    <span className="px-2 py-1 bg-red-500/30 text-red-300 rounded text-xs font-bold">
                      {action.type}
                    </span>
                  </div>
                </div>
                {action.type === 'Attack' && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-2">
                    <div className="text-xs">
                      <span className="text-gray-400">Damage:</span>
                      <span className="text-white font-bold ml-1">{action.damage}</span>
                    </div>
                    <div className="text-xs">
                      <span className="text-gray-400">Crit:</span>
                      <span className="text-white font-bold ml-1">{action.critical}</span>
                    </div>
                    <div className="text-xs">
                      <span className="text-gray-400">Range:</span>
                      <span className="text-white font-bold ml-1">{action.range}</span>
                    </div>
                    <div className="text-xs">
                      <span className="text-gray-400">Skill:</span>
                      <span className="text-white font-bold ml-1">{action.skill}</span>
                    </div>
                  </div>
                )}
                {action.qualities && action.qualities.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {action.qualities.map((quality, qIdx) => (
                      <span key={qIdx} className="px-2 py-1 bg-orange-500/20 text-orange-300 rounded text-xs">
                        {quality}
                      </span>
                    ))}
                  </div>
                )}
                <p className="text-gray-300 text-sm">{action.description || action.effect}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Vulnerabilities & Resistances */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {entity.vulnerabilities && entity.vulnerabilities.length > 0 && (
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
            <h3 className="text-white font-bold mb-3 flex items-center gap-2">
              <span>⚠️</span> Vulnerabilities
            </h3>
            <div className="space-y-2">
              {entity.vulnerabilities.map((vuln, idx) => (
                <div key={idx} className="bg-red-900/20 border border-red-500/30 rounded-lg p-3">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-red-300 font-bold text-sm">{vuln.type}</span>
                    <span className="px-2 py-0.5 bg-red-500/30 text-red-300 rounded text-xs">
                      {vuln.severity}
                    </span>
                  </div>
                  <p className="text-gray-300 text-xs">{vuln.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {entity.resistances && entity.resistances.length > 0 && (
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
            <h3 className="text-white font-bold mb-3 flex items-center gap-2">
              <span>🛡️</span> Resistances
            </h3>
            <div className="space-y-2">
              {entity.resistances.map((resist, idx) => (
                <div key={idx} className="bg-green-900/20 border border-green-500/30 rounded-lg p-3">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-green-300 font-bold text-sm">{resist.type}</span>
                    <span className="px-2 py-0.5 bg-green-500/30 text-green-300 rounded text-xs">
                      {resist.level}
                    </span>
                  </div>
                  <p className="text-gray-300 text-xs">{resist.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Entity Abilities Tab
const EntityAbilitiesTab = ({ entity }) => {
  return (
    <div className="space-y-4">
      {/* Talents */}
      {entity.talents && entity.talents.length > 0 && (
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
          <h3 className="text-white font-bold mb-3 flex items-center gap-2">
            <span>⭐</span> Talents
          </h3>
          <div className="space-y-3">
            {entity.talents.map((talent, idx) => (
              <div key={idx} className="bg-gradient-to-r from-yellow-900/20 to-amber-900/20 border border-yellow-500/30 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-yellow-300 font-bold">{talent.name}</h4>
                  <div className="flex gap-2">
                    {talent.isVariant && (
                      <span className="px-2 py-1 bg-amber-500/40 text-amber-200 rounded text-xs font-bold border border-amber-500/60">
                        VARIANT
                      </span>
                    )}
                    {talent.tier && (
                      <span className="px-2 py-1 bg-yellow-500/30 text-yellow-300 rounded text-xs font-bold">
                        Tier {talent.tier}
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-gray-300 text-sm">{talent.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Abilities */}
      {entity.abilities && entity.abilities.length > 0 && (
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
          <h3 className="text-white font-bold mb-3 flex items-center gap-2">
            <span>✨</span> Special Abilities
          </h3>
          <div className="space-y-3">
            {entity.abilities.map((ability, idx) => (
              <div key={idx} className="bg-gradient-to-r from-purple-900/20 to-indigo-900/20 border border-purple-500/30 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-purple-300 font-bold">{ability.name}</h4>
                  <div className="flex gap-2">
                    {ability.isVariant && (
                      <span className="px-2 py-1 bg-amber-500/40 text-amber-200 rounded text-xs font-bold border border-amber-500/60">
                        VARIANT
                      </span>
                    )}
                    <span className="px-2 py-1 bg-purple-500/30 text-purple-300 rounded text-xs font-bold">
                      {ability.activation}
                    </span>
                  </div>
                </div>
                <p className="text-gray-300 text-sm">{ability.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Equipment */}
      {entity.equipment && entity.equipment.length > 0 && (
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
          <h3 className="text-white font-bold mb-3 flex items-center gap-2">
            <span>🎒</span> Equipment
          </h3>
          <div className="space-y-2">
            {entity.equipment.map((item, idx) => (
              <div key={idx} className="bg-white/5 rounded-lg p-3">
                <span className="text-gray-300">{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Entity Lore Tab
const EntityLoreTab = ({ entity }) => {
  return (
    <div className="space-y-4">
      {/* Lore Text */}
      {entity.lore_text && (
        <div className="bg-gradient-to-r from-amber-900/20 to-yellow-900/20 border border-amber-500/30 rounded-xl p-4">
          <h3 className="text-amber-300 font-bold mb-3 flex items-center gap-2">
            <span>📜</span> Historical Records
          </h3>
          <p className="text-amber-200 leading-relaxed">{entity.lore_text}</p>
        </div>
      )}

      {/* Origin */}
      {entity.origin && (
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
          <h3 className="text-white font-bold mb-3 flex items-center gap-2">
            <span>🌟</span> Origin
          </h3>
          {entity.origin.known ? (
            <p className="text-gray-300 leading-relaxed">The origin of this entity is documented and known to scholars.</p>
          ) : (
            <div>
              <p className="text-gray-300 mb-3">The true origin remains a mystery. Several theories exist:</p>
              <div className="space-y-2">
                {entity.origin.theories?.map((theory, idx) => (
                  <div key={idx} className="bg-white/5 rounded-lg p-3 flex items-start gap-2">
                    <span className="text-purple-400 font-bold">{idx + 1}.</span>
                    <span className="text-gray-300">{theory}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Behavior & Motivation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {entity.diet && (
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
            <h3 className="text-white font-bold mb-3 flex items-center gap-2">
              <span>🍖</span> Diet
            </h3>
            <p className="text-gray-300">{entity.diet}</p>
          </div>
        )}

        {entity.intelligence_level && (
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
            <h3 className="text-white font-bold mb-3 flex items-center gap-2">
              <span>🧠</span> Intelligence
            </h3>
            <p className="text-gray-300">{entity.intelligence_level}</p>
          </div>
        )}
      </div>

      {entity.motivation && (
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
          <h3 className="text-white font-bold mb-3 flex items-center gap-2">
            <span>🎯</span> Motivation
          </h3>
          <p className="text-gray-300">{entity.motivation}</p>
        </div>
      )}

      {/* Communication */}
      {entity.communication && (
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
          <h3 className="text-white font-bold mb-3 flex items-center gap-2">
            <span>💬</span> Communication
          </h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-gray-400">Can Speak:</span>
              <span className={`px-2 py-1 rounded text-xs font-bold ${
                entity.communication.can_speak 
                  ? 'bg-green-500/30 text-green-300' 
                  : 'bg-red-500/30 text-red-300'
              }`}>
                {entity.communication.can_speak ? 'Yes' : 'No'}
              </span>
            </div>
            {entity.communication.languages_understood?.length > 0 && (
              <div>
                <span className="text-gray-400">Understands:</span>
                <span className="text-white ml-2">{entity.communication.languages_understood.join(', ')}</span>
              </div>
            )}
            {entity.communication.special_notes && (
              <p className="text-gray-300 text-sm mt-2">{entity.communication.special_notes}</p>
            )}
          </div>
        </div>
      )}

      {/* Detection */}
      {entity.detection && (
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
          <h3 className="text-white font-bold mb-3 flex items-center gap-2">
            <span>🔍</span> Detection
          </h3>
          <div className="space-y-3">
            {entity.detection.warning_signs?.length > 0 && (
              <div>
                <h4 className="text-yellow-400 text-sm font-bold mb-2">Warning Signs:</h4>
                <div className="flex flex-wrap gap-2">
                  {entity.detection.warning_signs.map((sign, idx) => (
                    <span key={idx} className="px-2 py-1 bg-yellow-500/20 text-yellow-300 rounded text-xs">
                      {sign}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-gray-400 text-sm">Difficulty:</span>
                <span className="text-white font-bold ml-2">{entity.detection.detection_difficulty}</span>
              </div>
              {entity.detection.detection_skills?.length > 0 && (
                <div>
                  <span className="text-gray-400 text-sm">Skills:</span>
                  <span className="text-white ml-2">{entity.detection.detection_skills.join(', ')}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Encounter Setup */}
      {entity.encounter_setup && (
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
          <h3 className="text-white font-bold mb-3 flex items-center gap-2">
            <span>⚔️</span> Encounter Guidelines
          </h3>
          <div className="space-y-3">
            {entity.encounter_setup.balanced_count_vs_4players && (
              <div>
                <h4 className="text-purple-400 text-sm font-bold mb-1">Balanced Encounter (4 Players):</h4>
                <p className="text-gray-300 text-sm">{entity.encounter_setup.balanced_count_vs_4players}</p>
              </div>
            )}
            {entity.encounter_setup.combat_style && (
              <div>
                <h4 className="text-blue-400 text-sm font-bold mb-1">Combat Style:</h4>
                <p className="text-gray-300 text-sm">{entity.encounter_setup.combat_style}</p>
              </div>
            )}
            {entity.encounter_setup.retreat_conditions && (
              <div>
                <h4 className="text-red-400 text-sm font-bold mb-1">Retreat Conditions:</h4>
                <p className="text-gray-300 text-sm">{entity.encounter_setup.retreat_conditions}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {entity.escape_methods && entity.escape_methods.length > 0 && (
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
          <h3 className="text-white font-bold mb-3 flex items-center gap-2">
            <span>🏃</span> Escape Methods
          </h3>
          <div className="space-y-3">
            {entity.escape_methods.map((escape, idx) => (
              <div key={idx} className="bg-gradient-to-r from-cyan-900/20 to-blue-900/20 border border-cyan-500/30 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2 flex-wrap gap-2">
                  <h4 className="text-cyan-300 font-bold flex-1">{escape.method}</h4>
                  <div className="flex gap-2 flex-shrink-0">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${getDifficultyColorForEscape(escape.difficulty)}`}>
                      {escape.difficulty}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-bold ${getSuccessRateColor(escape.success_rate)}`}>
                      {escape.success_rate}
                    </span>
                  </div>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">{escape.description}</p>
              </div>
            ))}
          </div>
          
          {/* Info Banner */}
          <div className="mt-4 bg-gradient-to-r from-blue-900/30 to-cyan-900/30 rounded-lg p-3 border border-blue-500/30">
            <p className="text-blue-200 text-xs leading-relaxed">
              <strong>💡 DM Tip:</strong> Provide clues about these escape methods through environmental details, NPC knowledge, or successful skill checks. Players should discover these options naturally during play.
            </p>
          </div>
        </div>
      )}

      {/* DM Secrets (only if available) */}
      {entity.dm_secrets && (
        <div className="bg-gradient-to-r from-red-900/20 to-pink-900/20 border border-red-500/30 rounded-xl p-4">
          <h3 className="text-red-300 font-bold mb-3 flex items-center gap-2">
            <span>🔒</span> DM Secrets
          </h3>
          <p className="text-red-200 text-sm leading-relaxed">{entity.dm_secrets}</p>
        </div>
      )}
    </div>
  );
};