export const indoorEntities = [
  {
    "name": "Barber",
    "alternate_name": "Clay Surgeon",
    "description": "A purple, humanoid entity made of clay that appears faceless and carries massive red scissors. The Barber is invisible to employees outside of a small radius and moves by hopping across short distances in rhythm with a musical beat. These creatures follow a Master Barber's commands and can deliver devastating cuts with their scissors.",
    "type": "Nemesis",
    "characteristics": {
      "brawn": 4,
      "agility": 3,
      "intellect": 1,
      "cunning": 3,
      "willpower": 2,
      "presence": 1
    },
    "derived_attributes": {
      "wound_threshold": 30,
      "strain_threshold": 15,
      "soak": 6,
      "melee_defense": 2,
      "ranged_defense": 1
    },
    "skills": [
      "Brawl 4",
      "Stealth 3",
      "Athletics 2"
    ],
    "weapons_attacks": [
      {
        "name": "Giant Scissors",
        "type": "Melee",
        "skill": "Brawl",
        "damage": 16,
        "critical": 2,
        "range": "Engaged",
        "qualities": "Pierce 4, Vicious 3"
      }
    ],
    "talents": [
      {
        "name": "Adversary 3",
        "description": "Upgrade difficulty of incoming attacks three times"
      },
      {
        "name": "Armored Hide",
        "description": "Reduce all damage from weapons without Breach by half (rounded up)"
      },
      {
        "name": "Stalker",
        "description": "Add two setback dice to Stealth checks when pursuing a target"
      }
    ],
    "abilities": [
      {
        "name": "Clay Form",
        "description": "Add 2 soak against all physical damage and reduce strain damage by 1 (minimum 1)"
      },
      {
        "name": "Invisibility Shroud",
        "description": "Invisible beyond Short range. Perception attempts beyond Short range upgrade difficulty with three challenge dice"
      },
      {
        "name": "Rhythmic Movement",
        "description": "Moves by hopping in rhythm with a musical beat. Each movement creates distinctive audio cues that can be heard from Medium range"
      }
    ],
    "movement": "2 rounds until moving"
  },
  {
    "name": "Bracken",
    "alternate_name": "Flower Man",
    "description": "A shadowy, humanoid entity with skin the color and texture of a red beet. Leaf-like protrusions extend from its upper spine, and its luminous eyes glow in darkness. The Bracken is a lone hunter with high intelligence that quietly stalks employees, attempting to grab their necks. It exhibits shy behavior when spotted but becomes highly aggressive when stared at for too long.",
    "type": "Nemesis",
    "characteristics": {
      "brawn": 3,
      "agility": 4,
      "intellect": 3,
      "cunning": 4,
      "willpower": 3,
      "presence": 2
    },
    "derived_attributes": {
      "wound_threshold": 20,
      "strain_threshold": 18,
      "soak": 3,
      "melee_defense": 3,
      "ranged_defense": 2
    },
    "skills": [
      "Brawl 4",
      "Stealth 4",
      "Athletics 3"
    ],
    "weapons_attacks": [
      {
        "name": "Neck Grab",
        "type": "Melee",
        "skill": "Brawl",
        "damage": 12,
        "critical": 2,
        "range": "Engaged",
        "qualities": "Ensnare 3, Vicious 3"
      }
    ],
    "talents": [
      {
        "name": "Adversary 2",
        "description": "Upgrade difficulty of incoming attacks twice"
      },
      {
        "name": "Stalker",
        "description": "Add two setback dice to Stealth checks when pursuing a target"
      },
      {
        "name": "Silent Strike",
        "description": "When making attacks from stealth, upgrade ability dice twice and add automatic advantage"
      }
    ],
    "abilities": [
      {
        "name": "Anger Meter",
        "description": "Whenever looked at, the observer must make an Average Discipline check. Gains 1 anger + failures. At 5+ anger, must make Hard Discipline check each round or enter Enraged state. Anger decreases by 1 per round when not being observed"
      },
      {
        "name": "Luminous Eyes",
        "description": "Can be spotted in total darkness. Remove two setback dice from Perception checks made to detect this adversary in low light conditions"
      },
      {
        "name": "Corpse Dragging",
        "description": "When killing a target, automatically drags corpse at half movement speed. Drops corpse if taking damage or becoming engaged with another enemy"
      }
    ],
    "movement": "2 rounds until moving"
  },
  {
    "name": "Bunker Spider",
    "alternate_name": "Theraphosa Spider",
    "description": "The largest arachnid found in the Thistle Nebula, these massive spiders are territorial ambush predators that create webs around their nesting areas. They can be seen waiting on walls, often over doorways, ready to trap prey. During their web-making phase they ignore players, but become aggressive when their webs are touched or broken.",
    "type": "Rival",
    "characteristics": {
      "brawn": 4,
      "agility": 2,
      "intellect": 1,
      "cunning": 3,
      "willpower": 2,
      "presence": 1
    },
    "derived_attributes": {
      "wound_threshold": 18,
      "strain_threshold": 12,
      "soak": 4,
      "melee_defense": 2,
      "ranged_defense": 1
    },
    "skills": [
      "Brawl 4",
      "Athletics 2",
      "Stealth 2"
    ],
    "weapons_attacks": [
      {
        "name": "Spider Bite",
        "type": "Melee",
        "skill": "Brawl",
        "damage": 10,
        "critical": 3,
        "range": "Engaged",
        "qualities": "Pierce 2, Vicious 2"
      }
    ],
    "talents": [
      {
        "name": "Adversary 1",
        "description": "Upgrade difficulty of incoming attacks once"
      },
      {
        "name": "Durable",
        "description": "Reduce critical injury result by 10 to a minimum of 1"
      }
    ],
    "abilities": [
      {
        "name": "Web Trap Network",
        "description": "Can place web traps in rooms. Characters touching webs require 2 additional maneuvers to move and alert the spider. Webs can be destroyed with melee attacks"
      },
      {
        "name": "Corpse Cocooning",
        "description": "When killing a target, wraps corpse in webs and hangs from ceiling. Cocooned bodies cannot be picked up normally and require special equipment to retrieve"
      },
      {
        "name": "Berserker Rage",
        "description": "When reduced to 25% wounds or less, gain 1 free maneuver per turn and gain automatic advantage on attacks"
      }
    ],
    "movement": "2 rounds until moving"
  },
  {
    "name": "Butler",
    "alternate_name": "Mansion Keeper",
    "description": "A blobfish-looking humanoid entity dressed in butler attire that roams mansion interiors carrying a broomstick for cleaning. Initially passive and seemingly harmless, the Butler reveals its true nature when it encounters an isolated employee, pulling out a hidden kitchen knife to attack. They appear to be deflated balloon-like creatures with a putrid smell.",
    "type": "Rival",
    "characteristics": {
      "brawn": 2,
      "agility": 3,
      "intellect": 2,
      "cunning": 4,
      "willpower": 3,
      "presence": 1
    },
    "derived_attributes": {
      "wound_threshold": 12,
      "strain_threshold": 14,
      "soak": 2,
      "melee_defense": 1,
      "ranged_defense": 1
    },
    "skills": [
      "Brawl 2",
      "Melee 3",
      "Stealth 3"
    ],
    "weapons_attacks": [
      {
        "name": "Kitchen Knife",
        "type": "Melee",
        "skill": "Melee",
        "damage": 7,
        "critical": 3,
        "range": "Engaged",
        "qualities": "Pierce 1, Vicious 1"
      }
    ],
    "talents": [
      {
        "name": "Adversary 1",
        "description": "Upgrade difficulty of incoming attacks once"
      },
      {
        "name": "Precise Aim 1",
        "description": "Add 1 damage to one hit per round with Melee weapons"
      }
    ],
    "abilities": [
      {
        "name": "Isolation Hunter",
        "description": "Remains passive when multiple targets are present. When only one target is visible for 4 rounds, switches to Murder phase and prioritizes closest employee"
      },
      {
        "name": "Death Explosion",
        "description": "Upon death, inflates and explodes dealing 6 strain damage to all adversaries at Engaged range and spawning Mask Hornets. Also drops Kitchen Knife weapon"
      },
      {
        "name": "Deceptive Cleaning",
        "description": "While in Passive phase, appears to be cleaning and ignores attacks unless directly damaged. Reduce incoming damage by half when in Passive phase"
      }
    ],
    "movement": "2 rounds until moving"
  },
  {
    "name": "Coil Head",
    "alternate_name": "Spring Man",
    "description": "A tall, humanoid mannequin entity with an eyeless face, agape mouth, and no forearms. Its head is connected to its body by a flexible spring for a neck, and its body is punctured with nails surrounded by blood stains. About double an employee's height, these entities carry dangerously high levels of radioactive particles.",
    "type": "Nemesis",
    "characteristics": {
      "brawn": 5,
      "agility": 5,
      "intellect": 1,
      "cunning": 3,
      "willpower": 4,
      "presence": 1
    },
    "derived_attributes": {
      "wound_threshold": 35,
      "strain_threshold": 16,
      "soak": 7,
      "melee_defense": 3,
      "ranged_defense": 2
    },
    "skills": [
      "Brawl 5",
      "Athletics 4",
      "Stealth 3"
    ],
    "weapons_attacks": [
      {
        "name": "Spring Assault",
        "type": "Melee",
        "skill": "Brawl",
        "damage": 14,
        "critical": 2,
        "range": "Engaged",
        "qualities": "Knockdown, Vicious 3"
      }
    ],
    "talents": [
      {
        "name": "Adversary 3",
        "description": "Upgrade difficulty of incoming attacks three times"
      },
      {
        "name": "Armored Hide",
        "description": "Reduce all damage from weapons without Breach by half (rounded up)"
      },
      {
        "name": "Lethal Blows",
        "description": "Critical injuries inflicted bypass soak and deal damage directly to wound threshold"
      }
    ],
    "abilities": [
      {
        "name": "Quantum Lock",
        "description": "Cannot move or act when being observed by any target within Medium range. Immediately resumes movement when unobserved"
      },
      {
        "name": "Target Priority",
        "description": "Always pursues the closest available target. Can switch targets at any time to a closer enemy"
      },
      {
        "name": "Recharge Cycle",
        "description": "After pursuing a target for 6 rounds, enters recharge phase for 2 rounds where it cannot move regardless of observation status"
      }
    ],
    "movement": "2 rounds until moving"
  },
  {
    "name": "Ghost Girl",
    "alternate_name": "Dress Girl",
    "description": "A pale, female humanoid entity that appears as a little girl wearing a red dress with white polka dots. She haunts one employee at a time and remains invisible to all others except the targeted individual. The Ghost Girl appears first at a distance before eventually approaching to attack through spectral touch.",
    "type": "Nemesis",
    "characteristics": {
      "brawn": 1,
      "agility": 3,
      "intellect": 2,
      "cunning": 5,
      "willpower": 5,
      "presence": 4
    },
    "derived_attributes": {
      "wound_threshold": 30,
      "strain_threshold": 20,
      "soak": 1,
      "melee_defense": 4,
      "ranged_defense": 4
    },
    "skills": [
      "Stealth 5",
      "Brawl 3",
      "Athletics 3"
    ],
    "weapons_attacks": [
      {
        "name": "Spectral Touch",
        "type": "Melee",
        "skill": "Brawl",
        "damage": 15,
        "critical": 1,
        "range": "Engaged",
        "qualities": "Pierce 5, Vicious 4"
      }
    ],
    "talents": [
      {
        "name": "Adversary 4",
        "description": "Upgrade difficulty of incoming attacks four times"
      },
      {
        "name": "Armored Hide",
        "description": "Reduce all damage from weapons without Breach by half (rounded up)"
      },
      {
        "name": "Incorporeal",
        "description": "Can move through solid objects and walls. Immune to most environmental hazards"
      }
    ],
    "abilities": [
      {
        "name": "Single Target Haunting",
        "description": "Can only be seen by one target at a time. Invisible to all other characters and equipment. Continuously haunts the same target until death, then selects new target"
      },
      {
        "name": "Fear Targeting",
        "description": "Targets character with highest combination of inventory value and injury status (wounds lost). Recalculates target when current target dies"
      },
      {
        "name": "Phase Escalation",
        "description": "Has three phases: Hiding, Staring, and Chasing. Looking at entity has 35% chance to trigger next phase. Approaching entity has 65% chance to trigger next phase"
      }
    ],
    "movement": "2 rounds until moving"
  },
  {
    "name": "Hoarding Bug",
    "alternate_name": "Loot Bug",
    "description": "Large, social insects of the order Hymenoptera that measure about 3 feet in height with bulbous, somewhat transparent bodies. They have membranous wings that allow flight despite their size. These territorial creatures collect and stockpile scrap items much like employees, establishing nests which they aggressively defend.",
    "type": "Rival",
    "characteristics": {
      "brawn": 2,
      "agility": 4,
      "intellect": 2,
      "cunning": 3,
      "willpower": 3,
      "presence": 1
    },
    "derived_attributes": {
      "wound_threshold": 12,
      "strain_threshold": 12,
      "soak": 2,
      "melee_defense": 2,
      "ranged_defense": 3
    },
    "skills": [
      "Brawl 2",
      "Athletics 3",
      "Stealth 2"
    ],
    "weapons_attacks": [
      {
        "name": "Bite Attack",
        "type": "Melee",
        "skill": "Brawl",
        "damage": 5,
        "critical": 4,
        "range": "Engaged",
        "qualities": "Vicious 1"
      }
    ],
    "talents": [
      {
        "name": "Adversary 1",
        "description": "Upgrade difficulty of incoming attacks once"
      },
      {
        "name": "Flyer",
        "description": "Can fly and move through air. Ignore terrain penalties and elevation changes during movement"
      }
    ],
    "abilities": [
      {
        "name": "Scrap Collection",
        "description": "Actively seeks and collects valuable items to bring back to nest. Can carry items while moving and flying"
      },
      {
        "name": "Territorial Aggression",
        "description": "Has three escalating aggression levels: Light (proximity violation), Hard (when attacked), Relentless (when items stolen). Higher levels increase pursuit duration and intensity"
      },
      {
        "name": "Nest Guarding",
        "description": "When guarding nest, remains motionless unless disturbed. Will accept dropped items as offerings to reduce aggression"
      }
    ],
    "movement": "2 rounds until moving"
  },
  {
    "name": "Hygrodere",
    "alternate_name": "Slime",
    "description": "A eukaryotic organism that appears as a large, viscous, amorphous mass of blue-green slime. These organisms can take up significant space and are drawn to heat and oxygen. They can convert organic matter to body mass and are extremely resistant to conventional damage methods.",
    "type": "Rival",
    "characteristics": {
      "brawn": 3,
      "agility": 1,
      "intellect": 1,
      "cunning": 2,
      "willpower": 5,
      "presence": 1
    },
    "derived_attributes": {
      "wound_threshold": 30,
      "strain_threshold": 20,
      "soak": 5,
      "melee_defense": 1,
      "ranged_defense": 1
    },
    "skills": [
      "Brawl 2",
      "Athletics 1",
      "Stealth 1"
    ],
    "weapons_attacks": [
      {
        "name": "Acidic Touch",
        "type": "Melee",
        "skill": "Brawl",
        "damage": 6,
        "critical": 4,
        "range": "Engaged",
        "qualities": "Burn 2, Pierce 1"
      }
    ],
    "talents": [
      {
        "name": "Adversary 1",
        "description": "Upgrade difficulty of incoming attacks once"
      },
      {
        "name": "Armored Hide",
        "description": "Reduce all damage from weapons without Breach by half (rounded up)"
      }
    ],
    "abilities": [
      {
        "name": "Heat Detection",
        "description": "Always knows location of nearest target with body heat within Medium range. Can sense targets through walls but must still navigate around obstacles"
      },
      {
        "name": "Heat Detection",
        "description": "Always knows location of nearest target with body heat. Pursues relentlessly but moves very slowly"
      },
      {
        "name": "Music Fixation",
        "description": "When Boombox music is playing, increases movement speed dramatically and prioritizes music source over other targets"
      }
    ],
    "movement": "3 rounds until moving"
  },
  {
    "name": "Jester",
    "alternate_name": "Jack-in-the-Box",
    "description": "A mysterious entity resembling a jack-in-the-box with skinny legs and a single arm. The box contains what appears to be a large human skull attached by a fleshy stalk. These creatures are extremely dangerous predators that operate through distinct behavioral phases culminating in relentless pursuit.",
    "type": "Nemesis",
    "characteristics": {
      "brawn": 5,
      "agility": 5,
      "intellect": 3,
      "cunning": 5,
      "willpower": 5,
      "presence": 4
    },
    "derived_attributes": {
      "wound_threshold": 35,
      "strain_threshold": 20,
      "soak": 8,
      "melee_defense": 4,
      "ranged_defense": 3
    },
    "skills": [
      "Brawl 5",
      "Athletics 5",
      "Stealth 3"
    ],
    "weapons_attacks": [
      {
        "name": "Skull Bite",
        "type": "Melee",
        "skill": "Brawl",
        "damage": 18,
        "critical": 1,
        "range": "Engaged",
        "qualities": "Pierce 4, Vicious 4"
      }
    ],
    "talents": [
      {
        "name": "Adversary 4",
        "description": "Upgrade difficulty of incoming attacks four times"
      },
      {
        "name": "Armored Hide",
        "description": "Reduce all damage from weapons without Breach by half (rounded up)"
      },
      {
        "name": "Relentless",
        "description": "Once engaged in pursuit, speed increases by 1 additional maneuver per round, resetting when new target is engaged"
      }
    ],
    "abilities": [
      {
        "name": "Perfect Tracking",
        "description": "Always knows exact location of all targets within facility regardless of range, line of sight, or concealment"
      },
      {
        "name": "Phase Progression",
        "description": "Progresses through behavioral phases: Roaming (3 rounds), Following (4 rounds tracking closest target), Cranking (8 rounds immobile while playing music), Chasing (pursues with increasing speed until target eliminated)"
      },
      {
        "name": "Music Box Warning",
        "description": "During Cranking phase, plays distinctive melody that becomes faster and more distorted. Can be temporarily paused by stunning effects"
      }
    ],
    "movement": "2 rounds until moving"
  },
  {
    "name": "Maneater",
    "alternate_name": "Periplaneta Clamorus",
    "description": "A cockroach-like entity that begins as a small, harmless baby requiring constant care and attention. When neglected or frightened, it rapidly transforms into a massive, deadly adult capable of devastating attacks. As babies, they imprint on the first employee they see and must be regularly rocked to calm their cries.",
    "type": "Rival/Nemesis",
    "characteristics": {
      "brawn": 2,
      "agility": 4,
      "intellect": 2,
      "cunning": 4,
      "willpower": 3,
      "presence": 2
    },
    "derived_attributes": {
      "wound_threshold": 15,
      "strain_threshold": 12,
      "soak": 2,
      "melee_defense": 2,
      "ranged_defense": 2
    },
    "skills": [
      "Brawl 3",
      "Stealth 4",
      "Athletics 3"
    ],
    "weapons_attacks": [
      {
        "name": "Bite Attack (Baby)",
        "type": "Melee",
        "skill": "Brawl",
        "damage": 3,
        "critical": 5,
        "range": "Engaged",
        "qualities": ""
      },
      {
        "name": "Lethal Lunge (Adult)",
        "type": "Melee",
        "skill": "Brawl",
        "damage": 16,
        "critical": 2,
        "range": "Short",
        "qualities": "Pierce 3, Vicious 3"
      }
    ],
    "talents": [
      {
        "name": "Adversary 1 (Baby)/3 (Adult)",
        "description": "Upgrade difficulty of incoming attacks once as baby, three times as adult"
      },
      {
        "name": "Phase Transformation",
        "description": "Can transform from harmless baby to deadly adult based on care received and stress levels"
      },
      {
        "name": "Lightning Reflexes (Adult)",
        "description": "Can make attacks against targets at Short range without moving. Gains automatic advantage on attacks after sprinting"
      }
    ],
    "abilities": [
      {
        "name": "Stress Transformation",
        "description": "Baby form has a stress meter starting at 0. Gains stress from various triggers. At 5 stress, transforms permanently to adult form over 1 round"
      },
      {
        "name": "Imprinting Bond",
        "description": "Always likes the first employee encountered. Has 50% chance to like subsequent employees. Dislikes cause faster stress accumulation"
      },
      {
        "name": "Item Consumption (Baby)",
        "description": "Each round when observing scrap items or equipment, has 25% chance to eat them. Each consumed item increases size slightly. Cannot consume items while being held"
      }
    ],
    "movement": "2 rounds until moving"
  },
  {
    "name": "Masked",
    "alternate_name": "Mimic",
    "description": "Anomalous entities created when employees are possessed by theatrical masks or spawn naturally wearing comedy masks. They perfectly mimic player behavior including movement patterns to blend in undetected. Once they target an employee, they stalk and pursue relentlessly before grabbing and converting their victim through regurgitation of blood.",
    "type": "Nemesis",
    "characteristics": {
      "brawn": 3,
      "agility": 3,
      "intellect": 2,
      "cunning": 5,
      "willpower": 4,
      "presence": 3
    },
    "derived_attributes": {
      "wound_threshold": 20,
      "strain_threshold": 16,
      "soak": 3,
      "melee_defense": 3,
      "ranged_defense": 2
    },
    "skills": [
      "Brawl 3",
      "Stealth 5",
      "Athletics 3",
      "Deception 5"
    ],
    "weapons_attacks": [
      {
        "name": "Conversion Grab",
        "type": "Melee",
        "skill": "Brawl",
        "damage": 14,
        "critical": 2,
        "range": "Engaged",
        "qualities": "Ensnare 4, Vicious 3"
      }
    ],
    "talents": [
      {
        "name": "Adversary 2",
        "description": "Upgrade difficulty of incoming attacks twice"
      },
      {
        "name": "Perfect Mimicry",
        "description": "Can perfectly replicate player behavior and movement patterns. Upgrade difficulty of Perception checks to detect deception by two"
      },
      {
        "name": "Relentless Pursuit",
        "description": "Once targeting an employee, ignores all other targets until pursuit ends through distance or line of sight break"
      }
    ],
    "abilities": [
      {
        "name": "Player Conversion",
        "description": "Critical hits on Ensnare attacks kill target and convert them into a new Masked entity after 1 round. Converted Masked inherit the suit and equipment of the original player"
      },
      {
        "name": "Behavioral Mimicry",
        "description": "Perfectly imitates player actions including movement patterns. Cannot use equipment, communicate, or emote"
      },
      {
        "name": "Scanner Invisibility",
        "description": "Undetectable by monitoring equipment and life scanners. Appears as normal employee on surveillance but movements may seem unnatural"
      }
    ],
    "movement": "2 rounds until moving"
  },
  {
    "name": "Nutcracker",
    "alternate_name": "Guardian Automaton",
    "description": "Life-sized wooden nutcracker soldier figurines inhabited by unknown creatures with a single stalked eye. These imposing sentries carry double-barrel shotguns and methodically scan for intruders with their retractable eye. They are heavily armored while moving but become vulnerable when their head lifts to reveal the eye during scanning phases.",
    "type": "Nemesis",
    "characteristics": {
      "brawn": 4,
      "agility": 2,
      "intellect": 3,
      "cunning": 4,
      "willpower": 5,
      "presence": 3
    },
    "derived_attributes": {
      "wound_threshold": 25,
      "strain_threshold": 20,
      "soak": 6,
      "melee_defense": 2,
      "ranged_defense": 3
    },
    "skills": [
      "Ranged (Heavy) 5",
      "Brawl 4",
      "Vigilance 5",
      "Athletics 2"
    ],
    "weapons_attacks": [
      {
        "name": "Double-Barrel Shotgun",
        "type": "Ranged (Heavy)",
        "skill": "Ranged (Heavy)",
        "damage": 12,
        "critical": 3,
        "range": "Medium",
        "qualities": "Blast 2, Vicious 2, Knockdown"
      }
    ],
    "talents": [
      {
        "name": "Adversary 3",
        "description": "Upgrade difficulty of incoming attacks three times"
      },
      {
        "name": "Deadly Accuracy",
        "description": "Add automatic advantage to ranged attacks. Critical injuries from ranged attacks add +10 to critical roll"
      },
      {
        "name": "Careful Aim",
        "description": "Can reload as incidental rather than maneuver. Shotgun holds 2 shots before requiring reload"
      }
    ],
    "abilities": [
      {
        "name": "Armored Patrol",
        "description": "While moving, reduce all incoming damage by 4 (minimum 1). Loses this benefit when entering Scanning state"
      },
      {
        "name": "Motion Detection",
        "description": "During Scanning state, automatically detects any character who moves within Short range. Once detected, switches to Attack state"
      },
      {
        "name": "Equipment Drop",
        "description": "Upon death, drops functional double-barrel shotgun with 2 shells plus any unspent ammunition remaining in weapon"
      }
    ],
    "movement": "2 rounds until moving"
  },
  {
    "name": "Snare Flea",
    "alternate_name": "Centipede",
    "description": "Large insectoid arthropods that hang motionless from ceilings using silk webs, waiting patiently for prey to pass beneath them. When an employee walks near, they drop down and wrap themselves around the victim's head to slowly suffocate them. Their fragile exoskeleton makes them vulnerable to damage.",
    "type": "Rival",
    "characteristics": {
      "brawn": 2,
      "agility": 4,
      "intellect": 1,
      "cunning": 3,
      "willpower": 2,
      "presence": 1
    },
    "derived_attributes": {
      "wound_threshold": 8,
      "strain_threshold": 10,
      "soak": 2,
      "melee_defense": 1,
      "ranged_defense": 3
    },
    "skills": [
      "Brawl 3",
      "Stealth 4",
      "Athletics 3"
    ],
    "weapons_attacks": [
      {
        "name": "Suffocation Wrap",
        "type": "Melee",
        "skill": "Brawl",
        "damage": 4,
        "critical": 4,
        "range": "Engaged",
        "qualities": "Ensnare 4, Burn 1"
      }
    ],
    "talents": [
      {
        "name": "Adversary 1",
        "description": "Upgrade difficulty of incoming attacks once"
      },
      {
        "name": "Ambush Predator",
        "description": "When attacking from ceiling ambush, upgrade attack dice twice and add automatic advantage"
      },
      {
        "name": "Fragile Frame",
        "description": "When reduced to 50% wounds or less, increase critical injury results by 20"
      }
    ],
    "abilities": [
      {
        "name": "Ceiling Ambush",
        "description": "Hangs motionless from ceilings using silk. When target moves within Short range, drops down to make grapple attack. Can reattach to ceiling if attack misses"
      },
      {
        "name": "Suffocating Grapple",
        "description": "Successful Ensnare attacks wrap around target's head. Target drops all equipment, vision obscured, voice muffled, and takes ongoing Burn damage. Can be removed by outside damage or exiting facility"
      },
      {
        "name": "Environmental Vulnerability",
        "description": "Dies instantly when brought outside facility or into cold environments. Falls may cause death due to fragile exoskeleton"
      }
    ],
    "movement": "999 rounds until moving"
  },
  {
    "name": "Spore Lizard",
    "alternate_name": "Puffer",
    "description": "Large, catfish-like reptilian creatures that are fundamentally herbivorous and timid by nature. Despite their intimidating appearance with enormous mouths and rattlesnake-like tails, they actively fear employees and will attempt to retreat when encountered. Their bulbous tails contain spore clouds for defense.",
    "type": "Minion",
    "characteristics": {
      "brawn": 3,
      "agility": 2,
      "intellect": 1,
      "cunning": 2,
      "willpower": 1,
      "presence": 2
    },
    "derived_attributes": {
      "wound_threshold": 8,
      "strain_threshold": 6,
      "soak": 3,
      "melee_defense": 1,
      "ranged_defense": 1
    },
    "skills": [
      "Brawl 1",
      "Athletics 2",
      "Stealth 3"
    ],
    "weapons_attacks": [
      {
        "name": "Weak Bite",
        "type": "Melee",
        "skill": "Brawl",
        "damage": 4,
        "critical": 5,
        "range": "Engaged",
        "qualities": ""
      }
    ],
    "talents": [
      {
        "name": "Timid Nature",
        "description": "Must make a Hard Fear check when engaged in combat. On failure, spends next action attempting to flee"
      },
      {
        "name": "Intimidation Display",
        "description": "Can open enormous mouth as maneuver to attempt Coercion check against targets at Short range"
      }
    ],
    "abilities": [
      {
        "name": "Fearful Retreat",
        "description": "Automatically attempts to move away from any employee within Medium range. Will always choose escape routes that break line of sight when possible"
      },
      {
        "name": "Spore Cloud Defense",
        "description": "When cornered or reduced to 50% wounds, releases pink spore cloud covering Short range area. All characters in area suffer 2 setback dice to Perception and ranged attacks for 3 rounds"
      },
      {
        "name": "Herbivorous Pacifist",
        "description": "Only attacks when cornered (cannot retreat) or when reduced below 50% wounds. Prefers flight over fight in all situations"
      }
    ],
    "movement": "2 rounds until moving"
  },
  {
    "name": "Thumper",
    "alternate_name": "Halves",
    "description": "Highly aggressive, shark-like carnivorous entities with cartilaginous skeletons and only two powerful front limbs for locomotion. These relentless hunters earned their name from consuming their own hind legs to escape their egg shells. Completely deaf but possessing incredible eyesight, they make loud thumping sounds as they move.",
    "type": "Rival",
    "characteristics": {
      "brawn": 4,
      "agility": 5,
      "intellect": 1,
      "cunning": 2,
      "willpower": 3,
      "presence": 3
    },
    "derived_attributes": {
      "wound_threshold": 18,
      "strain_threshold": 12,
      "soak": 4,
      "melee_defense": 2,
      "ranged_defense": 1
    },
    "skills": [
      "Brawl 4",
      "Athletics 5",
      "Vigilance 4"
    ],
    "weapons_attacks": [
      {
        "name": "Vicious Bite",
        "type": "Melee",
        "skill": "Brawl",
        "damage": 9,
        "critical": 3,
        "range": "Engaged",
        "qualities": "Pierce 2, Vicious 2"
      }
    ],
    "talents": [
      {
        "name": "Adversary 2",
        "description": "Upgrade difficulty of incoming attacks twice"
      },
      {
        "name": "Relentless Hunter",
        "description": "When pursuing a target, gain 1 additional maneuver per round and ignore 1 setback die from terrain"
      },
      {
        "name": "Momentum Fighter",
        "description": "Each successful attack grants 1 boost die to next Athletics or Brawl check, stacking up to 3 times"
      }
    ],
    "abilities": [
      {
        "name": "Deaf Hunter",
        "description": "Completely immune to sound-based detection or distraction. Cannot be affected by audio cues but relies entirely on line of sight for targeting"
      },
      {
        "name": "Speed Buildup",
        "description": "Gains increasing speed each round when moving in straight lines. Loses all accumulated speed when changing targets, being damaged, attacking, or being stunned"
      },
      {
        "name": "Corner Weakness",
        "description": "Movement speed reduced by half when making turns or navigating corners. Cannot effectively pursue targets through winding passages"
      }
    ],
    "movement": "2 rounds until moving"
  },
  {
    "name": "Masked Hornets",
    "alternate_name": "Butler Bees",
    "description": "Insectoid entities that emerge from the corpses of killed Butlers, representing either the true nature of what inhabited the Butler's form or parasitic creatures released upon death. These hornets swarm around the facility making loud buzzing sounds as they search for employees to attack.",
    "type": "Nemesis",
    "characteristics": {
      "brawn": 2,
      "agility": 4,
      "intellect": 1,
      "cunning": 3,
      "willpower": 4,
      "presence": 2
    },
    "derived_attributes": {
      "wound_threshold": 30,
      "strain_threshold": 16,
      "soak": 4,
      "melee_defense": 3,
      "ranged_defense": 4
    },
    "skills": [
      "Brawl 3",
      "Athletics 4",
      "Stealth 2"
    ],
    "weapons_attacks": [
      {
        "name": "Swarm Sting",
        "type": "Melee",
        "skill": "Brawl",
        "damage": 8,
        "critical": 3,
        "range": "Engaged",
        "qualities": "Pierce 1, Vicious 2"
      }
    ],
    "talents": [
      {
        "name": "Adversary 2",
        "description": "Upgrade difficulty of incoming attacks twice"
      },
      {
        "name": "Armored Hide",
        "description": "Reduce all damage from weapons without Breach by half (rounded up)"
      },
      {
        "name": "Persistent Swarm",
        "description": "Once spawned, continues hunting until all employees leave the facility. Cannot be stunned or deterred"
      }
    ],
    "abilities": [
      {
        "name": "Butler Death Spawn",
        "description": "Only spawns when a Butler entity is killed. Immediately begins hunting all employees within the facility upon emergence"
      },
      {
        "name": "Facility Bound",
        "description": "Cannot exit the facility or open locked doors. Takes 6 rounds to open unlocked doors, providing opportunities for temporary escape"
      },
      {
        "name": "Loud Buzzing",
        "description": "Makes distinctive loud buzzing sounds while moving, alerting employees to their presence and approximate location"
      }
    ],
    "movement": "1 round until moving"
  },
    {
    "name": "Vine Lurker",
    "alternate_name": "Creeping Root",
    "description": "Parasitic plant-like entities that disguise themselves as ordinary facility vegetation until prey approaches. These ambush predators extend thorny tendrils from walls and corners, attempting to ensnare and slowly drain victims. Their bark-like camouflage makes them nearly invisible when motionless, but they emit a faint rustling sound when preparing to strike.",
    "type": "Minion",
    "characteristics": {
      "brawn": 2,
      "agility": 1,
      "intellect": 1,
      "cunning": 3,
      "willpower": 2,
      "presence": 1
    },
    "derived_attributes": {
      "wound_threshold": 6,
      "strain_threshold": 8,
      "soak": 2,
      "melee_defense": 1,
      "ranged_defense": 2
    },
    "skills": [
      "Brawl 2",
      "Stealth 4",
      "Vigilance 3"
    ],
    "weapons_attacks": [
      {
        "name": "Thorny Tendrils",
        "type": "Melee",
        "skill": "Brawl",
        "damage": 4,
        "critical": 4,
        "range": "Short",
        "qualities": "Ensnare 2, Pierce 1"
      }
    ],
    "talents": [
      {
        "name": "Camouflaged",
        "description": "Add 2 setback dice to Perception checks to detect when motionless"
      }
    ],
    "abilities": [
      {
        "name": "Wall Ambush",
        "description": "Can attack from walls and corners at Short range. When motionless for 2+ rounds, gains automatic advantage on first attack"
      },
      {
        "name": "Slow Drain",
        "description": "Targets successfully ensnared take 1 strain damage per round until freed. Vine Lurker heals 1 wound per strain inflicted this way"
      }
    ],
    "movement": "3 rounds until moving"
  },
  {
    "name": "Pollen Drone",
    "alternate_name": "Spore Cloud",
    "description": "Small, floating bio-mechanical constructs that release hallucinogenic spores into facility air systems. These pest-sized entities drift through ventilation shafts and open areas, seeking to disorient employees with psychoactive clouds. While physically weak, their spore attacks can cause dangerous confusion and paranoia in their victims.",
    "type": "Minion",
    "characteristics": {
      "brawn": 1,
      "agility": 3,
      "intellect": 2,
      "cunning": 2,
      "willpower": 1,
      "presence": 2
    },
    "derived_attributes": {
      "wound_threshold": 4,
      "strain_threshold": 6,
      "soak": 1,
      "melee_defense": 2,
      "ranged_defense": 3
    },
    "skills": [
      "Brawl 1",
      "Athletics 3",
      "Stealth 3"
    ],
    "weapons_attacks": [
      {
        "name": "Spore Burst",
        "type": "Ranged",
        "skill": "Brawl",
        "damage": 2,
        "critical": 5,
        "range": "Short",
        "qualities": "Blast 3, Disorient 2"
      }
    ],
    "talents": [
      {
        "name": "Flyer",
        "description": "Can fly and move through air. Ignore terrain penalties and elevation changes during movement"
      }
    ],
    "abilities": [
      {
        "name": "Ventilation Access",
        "description": "Can move through air vents and small openings. Cannot be trapped by conventional doors or barriers"
      },
      {
        "name": "Hallucinogenic Spores",
        "description": "Targets affected by Disorient from spore attacks also suffer 2 strain damage and may hallucinate threats for 3 rounds"
      }
    ],
    "movement": "2 rounds until moving"
  },
  {
    "name": "Prototype Hunter",
    "alternate_name": "Test Subject Alpha",
    "description": "Experimental bio-mechanical hybrid created from failed corporate enhancement programs. These creatures retain human intelligence but possess predatory instincts and enhanced physical capabilities. Their exposed mechanical augmentations spark and malfunction, creating distinctive electrical sounds that betray their presence in dark corridors.",
    "type": "Rival",
    "characteristics": {
      "brawn": 4,
      "agility": 3,
      "intellect": 3,
      "cunning": 3,
      "willpower": 2,
      "presence": 2
    },
    "derived_attributes": {
      "wound_threshold": 16,
      "strain_threshold": 14,
      "soak": 4,
      "melee_defense": 2,
      "ranged_defense": 2
    },
    "skills": [
      "Brawl 3",
      "Ranged (Light) 3",
      "Athletics 3",
      "Stealth 2"
    ],
    "weapons_attacks": [
      {
        "name": "Augmented Claws",
        "type": "Melee",
        "skill": "Brawl",
        "damage": 8,
        "critical": 3,
        "range": "Engaged",
        "qualities": "Pierce 2, Vicious 1"
      },
      {
        "name": "Electrical Discharge",
        "type": "Ranged",
        "skill": "Ranged (Light)",
        "damage": 6,
        "critical": 4,
        "range": "Short",
        "qualities": "Stun 2, Disorient 1"
      }
    ],
    "talents": [
      {
        "name": "Adversary 1",
        "description": "Upgrade difficulty of incoming attacks once"
      },
      {
        "name": "Cybernetic Enhancement",
        "description": "Immune to toxins and disease. Add boost die to Athletics checks"
      }
    ],
    "abilities": [
      {
        "name": "Malfunction Sparks",
        "description": "Mechanical parts create sparks and electrical sounds every few rounds, making stealth difficult but providing light in darkness"
      },
      {
        "name": "Adaptive Learning",
        "description": "After observing the same tactic twice, gains boost die to defend against it. Resets when taking damage"
      },
      {
        "name": "Emergency Override",
        "description": "When reduced to 25% wounds, all systems activate: gain 1 additional maneuver per turn but take 1 strain per round from overload"
      }
    ],
    "movement": "2 rounds until moving"
  },
  {
    "name": "Data Wraith",
    "alternate_name": "Information Ghost",
    "description": "Incorporeal entities born from corrupted digital consciousness trapped in facility networks. These translucent beings phase through electronic systems and solid matter, seeking to absorb data and memories from living minds. They appear as shimmering, distorted humanoid figures surrounded by floating fragments of code and digital static.",
    "type": "Rival",
    "characteristics": {
      "brawn": 1,
      "agility": 4,
      "intellect": 4,
      "cunning": 3,
      "willpower": 3,
      "presence": 3
    },
    "derived_attributes": {
      "wound_threshold": 14,
      "strain_threshold": 16,
      "soak": 1,
      "melee_defense": 3,
      "ranged_defense": 4
    },
    "skills": [
      "Brawl 2",
      "Computers 5",
      "Stealth 4",
      "Discipline 3"
    ],
    "weapons_attacks": [
      {
        "name": "Data Drain",
        "type": "Melee",
        "skill": "Brawl",
        "damage": 3,
        "critical": 3,
        "range": "Engaged",
        "qualities": "Pierce 3, Disorient 3"
      }
    ],
    "talents": [
      {
        "name": "Adversary 2",
        "description": "Upgrade difficulty of incoming attacks twice"
      },
      {
        "name": "Incorporeal",
        "description": "Can move through solid objects and walls. Physical attacks add 2 setback dice unless from energy weapons"
      }
    ],
    "abilities": [
      {
        "name": "Electronic Interference",
        "description": "Presence within Short range causes electronic devices to malfunction. Radios produce static, lights flicker, and scanners give false readings"
      },
      {
        "name": "Memory Absorption",
        "description": "Critical hits steal random equipment knowledge from target. Target cannot use that equipment type for 24 hours while Data Wraith gains boost dice when interacting with similar devices"
      },
      {
        "name": "Digital Phase",
        "description": "Can instantly teleport between any two electronic devices within Long range as a maneuver. Creates distinctive digital static sound"
      }
    ],
    "movement": "2 rounds until moving"
  },
  {
    "name": "Corporate Enforcer",
    "alternate_name": "Security Automaton",
    "description": "Advanced military-grade security robots deployed by the Company to eliminate unauthorized personnel and contain breaches. These heavily armored humanoid machines carry state-of-the-art weaponry and operate with ruthless efficiency. Their corporate logos and professional demeanor mask their lethal programming.",
    "type": "Nemesis",
    "characteristics": {
      "brawn": 5,
      "agility": 3,
      "intellect": 3,
      "cunning": 4,
      "willpower": 4,
      "presence": 3
    },
    "derived_attributes": {
      "wound_threshold": 28,
      "strain_threshold": 20,
      "soak": 7,
      "melee_defense": 2,
      "ranged_defense": 3
    },
    "skills": [
      "Ranged (Heavy) 4",
      "Brawl 3",
      "Athletics 3",
      "Vigilance 4"
    ],
    "weapons_attacks": [
      {
        "name": "Pulse Rifle",
        "type": "Ranged",
        "skill": "Ranged (Heavy)",
        "damage": 12,
        "critical": 3,
        "range": "Long",
        "qualities": "Auto-fire, Pierce 2, Accurate 1"
      },
      {
        "name": "Stun Baton",
        "type": "Melee",
        "skill": "Brawl",
        "damage": 7,
        "critical": 4,
        "range": "Engaged",
        "qualities": "Stun 3, Disorient 2"
      }
    ],
    "talents": [
      {
        "name": "Adversary 3",
        "description": "Upgrade difficulty of incoming attacks three times"
      },
      {
        "name": "Heavy Armor",
        "description": "Reduce all damage from weapons without Breach by half (rounded up)"
      },
      {
        "name": "Combat Programming",
        "description": "Cannot be surprised and immune to fear effects. Add automatic advantage to Initiative checks"
      }
    ],
    "abilities": [
      {
        "name": "Target Identification",
        "description": "Scans targets and categorizes threat levels. Higher threat targets are prioritized and attacked with increased accuracy"
      },
      {
        "name": "Corporate Authority",
        "description": "Issues verbal warnings before engaging. Targets who surrender immediately take 4 strain from intimidation but may avoid combat"
      },
      {
        "name": "Emergency Protocols",
        "description": "When reduced to 25% wounds, activates combat stims: gain Linked 1 on all attacks and immunity to strain for remainder of encounter"
      }
    ],
    "movement": "2 rounds until moving"
  },
  {
    "name": "Executive Phantom",
    "alternate_name": "Corporate Ghost",
    "description": "The lingering consciousness of deceased Company executives, bound to facilities by their obsessive dedication to profit and control. These spectral entities wear the remnants of expensive suits and carry briefcases filled with damning documents. They seek to convert the living into additional corporate assets through supernatural contracts.",
    "type": "Nemesis",
    "characteristics": {
      "brawn": 2,
      "agility": 3,
      "intellect": 5,
      "cunning": 5,
      "willpower": 4,
      "presence": 5
    },
    "derived_attributes": {
      "wound_threshold": 25,
      "strain_threshold": 24,
      "soak": 2,
      "melee_defense": 3,
      "ranged_defense": 4
    },
    "skills": [
      "Brawl 3",
      "Coercion 5",
      "Deception 5",
      "Discipline 4"
    ],
    "weapons_attacks": [
      {
        "name": "Soul Contract",
        "type": "Melee",
        "skill": "Brawl",
        "damage": 10,
        "critical": 2,
        "range": "Engaged",
        "qualities": "Ensnare 3, Vicious 2"
      }
    ],
    "talents": [
      {
        "name": "Adversary 3",
        "description": "Upgrade difficulty of incoming attacks three times"
      },
      {
        "name": "Incorporeal",
        "description": "Can move through solid objects and walls. Physical attacks add 2 setback dice unless from energy weapons"
      },
      {
        "name": "Corporate Influence",
        "description": "Can attempt Coercion checks against entire groups within Medium range as an action"
      }
    ],
    "abilities": [
      {
        "name": "Spectral Presence",
        "description": "Causes temperature drops and electromagnetic interference. Electronic devices malfunction and lights dim within Short range"
      },
      {
        "name": "Binding Contract",
        "description": "Successful Ensnare attacks force target to make opposed Discipline vs Coercion check. Failure means target becomes compelled to follow phantom's commands for 3 rounds"
      },
      {
        "name": "Profit Obsession",
        "description": "Becomes enraged when valuable items are destroyed, gaining Vicious 2 on all attacks and reducing movement time by 1 round for remainder of encounter"
      }
    ],
    "movement": "2 rounds until moving"
  },
  {
    "name": "Void Stalker",
    "alternate_name": "Shadow Hunter",
    "description": "Creatures from the spaces between dimensions that have learned to exploit tears in reality created by Company experiments. These living shadows possess multiple shifting forms and hunt by manipulating darkness itself. They feed on fear and despair, growing stronger as their victims' terror increases.",
    "type": "Nemesis",
    "characteristics": {
      "brawn": 4,
      "agility": 5,
      "intellect": 3,
      "cunning": 5,
      "willpower": 4,
      "presence": 4
    },
    "derived_attributes": {
      "wound_threshold": 30,
      "strain_threshold": 20,
      "soak": 4,
      "melee_defense": 4,
      "ranged_defense": 3
    },
    "skills": [
      "Brawl 5",
      "Stealth 6",
      "Athletics 4",
      "Discipline 3"
    ],
    "weapons_attacks": [
      {
        "name": "Shadow Tendrils",
        "type": "Melee",
        "skill": "Brawl",
        "damage": 13,
        "critical": 2,
        "range": "Short",
        "qualities": "Ensnare 2, Pierce 3, Vicious 2"
      }
    ],
    "talents": [
      {
        "name": "Adversary 4",
        "description": "Upgrade difficulty of incoming attacks four times"
      },
      {
        "name": "Shadow Form",
        "description": "In darkness or dim light, become incorporeal and immune to physical attacks. Bright lights force corporeal form"
      },
      {
        "name": "Fear Feeder",
        "description": "Heals 2 wounds whenever an enemy within Short range gains strain from fear effects"
      }
    ],
    "abilities": [
      {
        "name": "Darkness Manipulation",
        "description": "Can extinguish light sources within Medium range as a maneuver. Creates areas of supernatural darkness that cannot be illuminated by normal means"
      },
      {
        "name": "Terror Aura",
        "description": "All enemies within Short range must make Average Fear checks each round. Failure inflicts 3 strain and upgrades difficulty of next action"
      },
      {
        "name": "Dimensional Shift",
        "description": "Can teleport to any dark area within Long range as a maneuver. Leaves brief tears in reality that cause 2 strain to anyone who looks at them"
      }
    ],
    "movement": "1 round until moving"
  },
  {
    "name": "Reality Wraith",
    "alternate_name": "Probability Nightmare",
    "description": "Entities that exist partially outside normal space-time, capable of manipulating probability and causality within their vicinity. These barely-visible distortions in reality cause impossible events and paradoxes. Their presence warps the fundamental laws of physics, making conventional combat extremely dangerous.",
    "type": "Nemesis",
    "characteristics": {
      "brawn": 3,
      "agility": 4,
      "intellect": 6,
      "cunning": 5,
      "willpower": 6,
      "presence": 5
    },
    "derived_attributes": {
      "wound_threshold": 35,
      "strain_threshold": 30,
      "soak": 3,
      "melee_defense": 5,
      "ranged_defense": 5
    },
    "skills": [
      "Brawl 4",
      "Discipline 6",
      "Athletics 4",
      "Vigilance 5"
    ],
    "weapons_attacks": [
      {
        "name": "Probability Storm",
        "type": "Ranged",
        "skill": "Discipline",
        "damage": 12,
        "critical": 2,
        "range": "Medium",
        "qualities": "Blast 4, Disorient 4, Vicious 3"
      }
    ],
    "talents": [
      {
        "name": "Adversary 5",
        "description": "Upgrade difficulty of incoming attacks five times"
      },
      {
        "name": "Reality Distortion",
        "description": "All dice pools within Short range add 1 challenge die due to warped probability"
      },
      {
        "name": "Paradox Immunity",
        "description": "Immune to critical injuries and most status effects. Only takes wounds from successful attacks"
      }
    ],
    "abilities": [
      {
        "name": "Causality Manipulation",
        "description": "Once per round, can force any character within Medium range to reroll their entire dice pool, keeping the worse result"
      },
      {
        "name": "Temporal Echoes",
        "description": "When attacked, has 50% chance to phase briefly out of time. Attack automatically misses and attacker takes 3 strain from temporal disorientation"
      },
      {
        "name": "Entropy Field",
        "description": "Equipment within Short range has 25% chance per round to malfunction or break. Heals 1 wound per equipment failure witnessed"
      }
    ],
    "movement": "1 round until moving"
  },
  {
    "name": "Chaos Spawn",
    "alternate_name": "Mutation Beast",
    "description": "Horrifically mutated creatures born from exposure to Company's most dangerous experimental substances. These constantly-changing monstrosities possess multiple limbs, eyes, and mouths that shift and rearrange themselves. Their unstable biology makes them unpredictable in combat, with abilities that change as they adapt to threats.",
    "type": "Nemesis",
    "characteristics": {
      "brawn": 5,
      "agility": 3,
      "intellect": 2,
      "cunning": 4,
      "willpower": 3,
      "presence": 2
    },
    "derived_attributes": {
      "wound_threshold": 32,
      "strain_threshold": 18,
      "soak": 5,
      "melee_defense": 3,
      "ranged_defense": 2
    },
    "skills": [
      "Brawl 5",
      "Athletics 4",
      "Resilience 5"
    ],
    "weapons_attacks": [
      {
        "name": "Mutant Assault",
        "type": "Melee",
        "skill": "Brawl",
        "damage": 14,
        "critical": 2,
        "range": "Engaged",
        "qualities": "Pierce 2, Vicious 3, Knockdown"
      }
    ],
    "talents": [
      {
        "name": "Adversary 3",
        "description": "Upgrade difficulty of incoming attacks three times"
      },
      {
        "name": "Unstable Biology",
        "description": "Each round, roll 1d6: 1-2 gain Pierce 2, 3-4 gain Blast 2, 5-6 gain Vicious 2 on attacks until next round"
      },
      {
        "name": "Regeneration",
        "description": "Heals 2 wounds at start of each turn unless damaged by fire or energy weapons since last turn"
      }
    ],
    "abilities": [
      {
        "name": "Adaptive Mutation",
        "description": "After taking damage from same source twice, develops resistance: reduce future damage from that type by 2 (minimum 1)"
      },
      {
        "name": "Horrific Appearance",
        "description": "First sight requires Hard Fear check. Failure causes 4 strain and target becomes disoriented for 2 rounds"
      },
      {
        "name": "Toxic Secretions",
        "description": "Characters at Engaged range at end of round take 2 strain damage from exposure to mutagenic fluids"
      }
    ],
    "movement": "1 round until moving"
  },
  {
    "name": "Dimensional Horror",
    "alternate_name": "Eldritch Abomination",
    "description": "Ancient entities from parallel dimensions that have been drawn to our reality by Company experiments with interdimensional technology. These incomprehensible beings exist partially in multiple dimensions simultaneously, making them nearly impossible to fully perceive or understand. Their very presence causes reality to fracture and minds to break.",
    "type": "Nemesis",
    "characteristics": {
      "brawn": 6,
      "agility": 4,
      "intellect": 7,
      "cunning": 6,
      "willpower": 7,
      "presence": 6
    },
    "derived_attributes": {
      "wound_threshold": 40,
      "strain_threshold": 35,
      "soak": 6,
      "melee_defense": 4,
      "ranged_defense": 4
    },
    "skills": [
      "Brawl 6",
      "Discipline 7",
      "Athletics 5",
      "Vigilance 6"
    ],
    "weapons_attacks": [
      {
        "name": "Dimensional Rift",
        "type": "Ranged",
        "skill": "Discipline",
        "damage": 16,
        "critical": 1,
        "range": "Long",
        "qualities": "Blast 6, Pierce 4, Vicious 4"
      },
      {
        "name": "Void Touch",
        "type": "Melee",
        "skill": "Brawl",
        "damage": 18,
        "critical": 1,
        "range": "Engaged",
        "qualities": "Pierce 5, Vicious 5, Ensnare 3"
      }
    ],
    "talents": [
      {
        "name": "Adversary 5",
        "description": "Upgrade difficulty of incoming attacks five times"
      },
      {
        "name": "Multidimensional",
        "description": "Exists in multiple dimensions. Reduce all incoming damage by 4 (minimum 1) and immune to most status effects"
      },
      {
        "name": "Eldritch Presence",
        "description": "All enemies within Long range must make Hard Fear checks each round or suffer 5 strain and become disoriented"
      }
    ],
    "abilities": [
      {
        "name": "Reality Fracture",
        "description": "Presence causes space-time distortions. All movement within Medium range costs 1 additional maneuver and navigation becomes unreliable"
      },
      {
        "name": "Mind Shattering",
        "description": "Characters who look directly at the entity must make Formidable Discipline checks or gain 1 permanent mental trauma and suffer 6 strain"
      },
      {
        "name": "Dimensional Phase",
        "description": "Can shift between dimensions as incidental, becoming untargetable for 1 round. Reappears anywhere within Long range with automatic surprise attack"
      }
    ],
    "movement": "1 round until moving"
  }
]

export const nightEntities = [
  {
    "name": "Baboon Hawk",
    "alternate_name": "Papio-volturius",
    "description": "Large, semi-aggressive primates standing up to 8 feet tall with bird-like features including beaks and wings that cannot support flight. These territorial creatures live in troops with complex social hierarchies and exhibit sophisticated behavioral patterns. Their keratin horns can break and regrow within seasons, and they use intimidation displays with their large wings. Behavior ranges from timid when alone to extremely dangerous in groups, with complex fear and threat assessment systems that determine their aggression levels.",
    "type": "Rival",
    "characteristics": {
      "brawn": 3,
      "agility": 3,
      "intellect": 3,
      "cunning": 4,
      "willpower": 3,
      "presence": 3
    },
    "derived_attributes": {
      "wound_threshold": 18,
      "strain_threshold": 15,
      "soak": 3,
      "melee_defense": 2,
      "ranged_defense": 2
    },
    "skills": [
      "Brawl 3",
      "Athletics 3",
      "Vigilance 4",
      "Survival 3",
      "Stealth 2",
      "Coercion 3"
    ],
    "weapons_attacks": [
      {
        "name": "Horn Gore",
        "type": "Melee",
        "skill": "Brawl",
        "damage": 8,
        "critical": 3,
        "range": "Engaged",
        "qualities": "Pierce 2, Vicious 2"
      },
      {
        "name": "Beak Strike",
        "type": "Melee",
        "skill": "Brawl",
        "damage": 6,
        "critical": 3,
        "range": "Engaged",
        "qualities": "Vicious 1"
      }
    ],
    "talents": [
      {
        "name": "Adversary 1",
        "description": "Upgrade difficulty of incoming attacks once"
      },
      {
        "name": "Pack Hunter",
        "description": "When fighting alongside other Baboon Hawks, add boost dice equal to half the number of allies (minimum 1) to combat checks"
      }
    ],
    "abilities": [
      {
        "name": "Pack Dynamics",
        "description": "Behavior changes based on group size. Timid when alone, increasingly aggressive in larger groups. Will not attack unless they outnumber targets or feel cornered"
      },
      {
        "name": "Scrap Thief",
        "description": "Steals dropped valuable items and becomes hostile if items are reclaimed. Drops held items when entering combat"
      },
      {
        "name": "Intimidation Display",
        "description": "As an action, can make a Coercion check using Presence + Coercion against targets within Short range. Success causes 3 strain damage and upgrades difficulty of target's next action. Uses wing spreading and posturing"
      }
    ],
    "movement": "2 rounds until moving"
  },
  {
    "name": "Earth Leviathan",
    "alternate_name": "Sandworm",
    "description": "Massive, serpentine invertebrates that patrol underground throughout outdoor areas, emerging only to devour prey in devastating ambush attacks. These colossal worms can burrow up to 40 meters deep and are extremely durable against conventional weapons. They detect surface vibrations and announce their attacks with distinct growling sounds and ground tremors before erupting from the earth to devastate anything in their path.",
    "type": "Nemesis",
    "characteristics": {
      "brawn": 6,
      "agility": 2,
      "intellect": 1,
      "cunning": 3,
      "willpower": 5,
      "presence": 4
    },
    "derived_attributes": {
      "wound_threshold": 40,
      "strain_threshold": 20,
      "soak": 8,
      "melee_defense": 1,
      "ranged_defense": 1
    },
    "skills": [
      "Brawl 5",
      "Athletics 3",
      "Vigilance 3",
      "Survival 4"
    ],
    "weapons_attacks": [
      {
        "name": "Devouring Emergence",
        "type": "Melee",
        "skill": "Brawl",
        "damage": 20,
        "critical": 1,
        "range": "Short",
        "qualities": "Blast 6, Vicious 4, Knockdown"
      }
    ],
    "talents": [
      {
        "name": "Adversary 4",
        "description": "Upgrade difficulty of incoming attacks four times"
      },
      {
        "name": "Armored Hide",
        "description": "Reduce all damage from weapons without Breach by half (rounded up). Environmental hazards affect normally"
      }
    ],
    "abilities": [
      {
        "name": "Underground Stalking",
        "description": "Moves invisibly underground, completely undetectable except on monitoring equipment as a large red signature. Cannot be targeted or affected while burrowing"
      },
      {
        "name": "Ambush Emergence",
        "description": "Attack sequence: 1) Growling sound and ground vibrations, 2) Black particles rise from ground, 3) Emerges after 1-3 rounds. Targets have this time to escape area. Characters still in area when it emerges may attempt a Hard Athletics check to dive clear and avoid the Blast area"
      },
      {
        "name": "Colossal Size",
        "description": "Cannot enter enclosed spaces. Emergence attack affects all targets in Short range. Equipment not carried by characters is destroyed in emergence area"
      }
    ],
    "movement": "2 rounds until moving"
  },
  {
    "name": "Eyeless Dog",
    "alternate_name": "Breathing Lion",
    "description": "Large, pack-hunting canids with massive mouths filled with razor-sharp teeth and no visible eyes. These social predators compensate for their complete blindness with exceptional hearing, spreading out across wide areas to cover more ground. They hunt through sound detection and are characteristically clumsy, often misjudging the exact location of their prey. When one finds prey, it roars to alert others in a chain reaction that can bring entire packs down upon targets.",
    "type": "Rival",
    "characteristics": {
      "brawn": 4,
      "agility": 4,
      "intellect": 1,
      "cunning": 2,
      "willpower": 3,
      "presence": 3
    },
    "derived_attributes": {
      "wound_threshold": 22,
      "strain_threshold": 15,
      "soak": 4,
      "melee_defense": 2,
      "ranged_defense": 1
    },
    "skills": [
      "Brawl 4",
      "Athletics 4",
      "Vigilance 5",
      "Survival 3"
    ],
    "weapons_attacks": [
      {
        "name": "Crushing Bite",
        "type": "Melee",
        "skill": "Brawl",
        "damage": 12,
        "critical": 2,
        "range": "Engaged",
        "qualities": "Pierce 3, Vicious 3"
      }
    ],
    "talents": [
      {
        "name": "Adversary 2",
        "description": "Upgrade difficulty of incoming attacks twice"
      },
      {
        "name": "Pack Hunter",
        "description": "When multiple Eyeless Dogs are present, they coordinate attacks and alert each other to threats through howling"
      },
      {
        "name": "Lightning Vulnerability",
        "description": "Instantly killed by lightning strikes. Can be lured to metal objects during storms for elimination"
      }
    ],
    "abilities": [
      {
        "name": "Exceptional Hearing",
        "description": "Detects all sounds above certain thresholds. Crouching movement, whispers, and walkie-talkie use don't trigger detection. Normal movement, speaking, and equipment use alert the creature"
      },
      {
        "name": "Suspicion System",
        "description": "Has three states: Calm (patrolling), Suspicious (investigating sounds), and Enraged (charging prey). Accumulates suspicion from repeated sounds before entering full attack mode"
      },
      {
        "name": "Charging Lunge",
        "description": "When attacking, accelerates rapidly toward last heard sound and lunges for 2-3 rounds. Characteristically clumsy and often misjudges exact target location, adding 2 setback dice to attack rolls"
      }
    ],
    "movement": "2 rounds until moving"
  },
  {
    "name": "Forest Keeper",
    "alternate_name": "Forest Giant",
    "description": "Colossal, tree-like humanoids with dense, spike-covered skin that hardens with age and eye-like markings across their bodies. These gargantuan entities exhibit childlike curiosity, eating anything they find fascinating despite not needing sustenance (they feed through photosynthesis). Completely deaf but possessing exceptional long-range vision, they patrol outdoor areas with thunderous footsteps. Their massive size prevents them from entering small spaces, but their reach extends far beyond their physical boundaries.",
    "type": "Nemesis",
    "characteristics": {
      "brawn": 6,
      "agility": 4,
      "intellect": 2,
      "cunning": 3,
      "willpower": 4,
      "presence": 5
    },
    "derived_attributes": {
      "wound_threshold": 35,
      "strain_threshold": 20,
      "soak": 6,
      "melee_defense": 2,
      "ranged_defense": 1
    },
    "skills": [
      "Brawl 5",
      "Athletics 4",
      "Vigilance 6",
      "Survival 4"
    ],
    "weapons_attacks": [
      {
        "name": "Grasping Consumption",
        "type": "Melee",
        "skill": "Brawl",
        "damage": 15,
        "critical": 2,
        "range": "Short",
        "qualities": "Ensnare 3, Vicious 2"
      }
    ],
    "talents": [
      {
        "name": "Adversary 3",
        "description": "Upgrade difficulty of incoming attacks three times"
      },
      {
        "name": "Massive Reach",
        "description": "Can attack targets at Short range due to enormous size. Extended reach allows grabbing near doorways and walls"
      },
      {
        "name": "Lightning Vulnerability",
        "description": "Instantly killed by lightning strikes, explosions, or environmental hazards. Can be lured to metal objects during storms"
      }
    ],
    "abilities": [
      {
        "name": "Exceptional Vision",
        "description": "Can spot targets at Extreme range with perfect clarity, even through fog. Completely deaf - immune to all sound-based detection or distraction"
      },
      {
        "name": "Suspicion Meter",
        "description": "Builds suspicion on individual targets based on line of sight and movement. At low levels stares and investigates, at high levels enters chase mode. Meter decreases only when other targets are visible"
      },
      {
        "name": "Childlike Curiosity",
        "description": "Approaches and attempts to 'eat' anything that fascinates it. Cannot enter small spaces but will wait patiently outside shelters for targets to emerge"
      }
    ],
    "movement": "2 rounds until moving"
  },
  {
    "name": "Old Bird",
    "alternate_name": "Mech-Walker",
    "description": "Towering bipedal mechanical constructs with bird-like heads and heavily armored chassis. These autonomous war machines patrol outdoor areas with methodical precision, equipped with devastating rocket launchers and advanced targeting systems. Standing nearly 12 feet tall, they move with deliberate, thunderous steps that can be heard from great distances. Their glowing red optical sensors constantly scan for threats, and they respond to detected movement with overwhelming firepower.",
    "type": "Nemesis",
    "characteristics": {
      "brawn": 5,
      "agility": 2,
      "intellect": 4,
      "cunning": 3,
      "willpower": 5,
      "presence": 4
    },
    "derived_attributes": {
      "wound_threshold": 40,
      "strain_threshold": 25,
      "soak": 8,
      "melee_defense": 2,
      "ranged_defense": 3
    },
    "skills": [
      "Ranged (Heavy) 5",
      "Gunnery 5",
      "Vigilance 5",
      "Perception 4",
      "Brawl 3"
    ],
    "weapons_attacks": [
      {
        "name": "Rocket Barrage",
        "type": "Ranged",
        "skill": "Ranged (Heavy)",
        "damage": 18,
        "critical": 2,
        "range": "Long",
        "qualities": "Blast 8, Breach 2, Cumbersome 4, Guided 2, Vicious 3"
      },
      {
        "name": "Stomp Attack",
        "type": "Melee",
        "skill": "Brawl",
        "damage": 12,
        "critical": 3,
        "range": "Engaged",
        "qualities": "Knockdown, Vicious 2"
      }
    ],
    "talents": [
      {
        "name": "Adversary 4",
        "description": "Upgrade difficulty of incoming attacks four times"
      },
      {
        "name": "Heavy Armor",
        "description": "Reduce all damage from weapons without Breach by half (rounded up). Only explosives and heavy ordnance can damage this unit effectively"
      },
      {
        "name": "Targeting Systems",
        "description": "Advanced optical sensors provide Accurate 2 to all ranged attacks. Cannot be blinded or affected by visual impairment"
      }
    ],
    "abilities": [
      {
        "name": "Motion Detection",
        "description": "Detects movement within Long range through advanced sensors. Stationary targets are invisible to its systems. Movement speed determines detection sensitivity"
      },
      {
        "name": "Mechanical Construction",
        "description": "Immune to toxins, disease, vacuum, and other biological hazards. Does not need to breathe, eat, or sleep. Vulnerable to electromagnetic pulse attacks"
      }
    ],
    "movement": "1 round until moving"
  },
    {
    "name": "Garden Sprite",
    "alternate_name": "Wisp Light",
    "description": "Tiny bioluminescent entities that emerge from facility gardens and landscaping during nighttime hours. These fairy-like creatures appear as floating points of colored light that dance through the air in mesmerizing patterns. While completely harmless physically, their hypnotic light displays can cause disorientation and lead employees astray from safe paths.",
    "type": "Minion",
    "characteristics": {
      "brawn": 1,
      "agility": 4,
      "intellect": 1,
      "cunning": 2,
      "willpower": 2,
      "presence": 3
    },
    "derived_attributes": {
      "wound_threshold": 2,
      "strain_threshold": 8,
      "soak": 0,
      "melee_defense": 3,
      "ranged_defense": 4
    },
    "skills": [
      "Athletics 4",
      "Stealth 3",
      "Charm 2"
    ],
    "weapons_attacks": [
      {
        "name": "Harmless Touch",
        "type": "Melee",
        "skill": "Brawl",
        "damage": 0,
        "critical": 7,
        "range": "Engaged",
        "qualities": "Disorient 3"
      }
    ],
    "talents": [
      {
        "name": "Flyer",
        "description": "Can fly and move through air. Ignore terrain penalties and elevation changes during movement"
      }
    ],
    "abilities": [
      {
        "name": "Hypnotic Lights",
        "description": "Characters within Short range must make Average Discipline checks each round or become fascinated, suffering 2 setback dice to all actions while watching the lights"
      },
      {
        "name": "Misdirection Dance",
        "description": "Groups of 3+ Garden Sprites can create complex light patterns. Characters who fail Discipline checks may wander in wrong directions for 1d3 rounds"
      },
      {
        "name": "Fragile Form",
        "description": "Any successful attack automatically destroys a Garden Sprite. They flee if any sprite in their group is harmed"
      }
    ],
    "movement": "1 round until moving"
  },
  {
    "name": "Security Drone",
    "alternate_name": "Patrol Unit",
    "description": "Automated surveillance and security drones deployed around facility perimeters during night shifts. These flying machines are equipped with powerful searchlights, motion sensors, and defensive weaponry. They follow programmed patrol patterns but can adapt to threats with basic AI protocols, calling for backup when overwhelmed.",
    "type": "Rival",
    "characteristics": {
      "brawn": 2,
      "agility": 4,
      "intellect": 3,
      "cunning": 3,
      "willpower": 3,
      "presence": 2
    },
    "derived_attributes": {
      "wound_threshold": 14,
      "strain_threshold": 12,
      "soak": 3,
      "melee_defense": 2,
      "ranged_defense": 3
    },
    "skills": [
      "Ranged (Light) 3",
      "Athletics 4",
      "Vigilance 4",
      "Perception 4"
    ],
    "weapons_attacks": [
      {
        "name": "Stun Blaster",
        "type": "Ranged",
        "skill": "Ranged (Light)",
        "damage": 5,
        "critical": 4,
        "range": "Medium",
        "qualities": "Stun 2, Accurate 1"
      }
    ],
    "talents": [
      {
        "name": "Adversary 1",
        "description": "Upgrade difficulty of incoming attacks once"
      },
      {
        "name": "Flyer",
        "description": "Can fly and move through air. Ignore terrain penalties and elevation changes during movement"
      }
    ],
    "abilities": [
      {
        "name": "Searchlight Sweep",
        "description": "Can illuminate Large areas with powerful searchlight, removing all concealment bonuses. Light can be seen from Extreme range"
      },
      {
        "name": "Motion Detection",
        "description": "Automatically detects movement within Long range. Cannot be surprised by moving targets but stationary enemies remain hidden"
      },
      {
        "name": "Emergency Beacon",
        "description": "When reduced to 25% wounds, transmits distress signal that has 30% chance per round to summon another Security Drone as reinforcement"
      }
    ],
    "movement": "2 rounds until moving"
  },
  {
    "name": "Escaped Subject-X",
    "alternate_name": "Test Subject Zero",
    "description": "A former human test subject that escaped from Company laboratories after undergoing horrific experimental procedures. This grotesquely mutated being retains fragments of human intelligence mixed with animalistic rage. Its body shows signs of multiple surgical modifications, chemical burns, and cybernetic implants that spark and malfunction in the outdoor environment.",
    "type": "Nemesis",
    "characteristics": {
      "brawn": 5,
      "agility": 4,
      "intellect": 2,
      "cunning": 3,
      "willpower": 4,
      "presence": 1
    },
    "derived_attributes": {
      "wound_threshold": 26,
      "strain_threshold": 18,
      "soak": 5,
      "melee_defense": 3,
      "ranged_defense": 2
    },
    "skills": [
      "Brawl 4",
      "Athletics 4",
      "Stealth 3",
      "Survival 3"
    ],
    "weapons_attacks": [
      {
        "name": "Mutant Claws",
        "type": "Melee",
        "skill": "Brawl",
        "damage": 11,
        "critical": 3,
        "range": "Engaged",
        "qualities": "Pierce 3, Vicious 2"
      },
      {
        "name": "Cybernetic Discharge",
        "type": "Ranged",
        "skill": "Brawl",
        "damage": 7,
        "critical": 4,
        "range": "Short",
        "qualities": "Stun 3, Burn 1"
      }
    ],
    "talents": [
      {
        "name": "Adversary 2",
        "description": "Upgrade difficulty of incoming attacks twice"
      },
      {
        "name": "Pain Immunity",
        "description": "Immune to strain damage and pain-based effects. Critical injuries do not impose penalties until Incapacitated"
      },
      {
        "name": "Experimental Resilience",
        "description": "Immune to toxins, disease, and environmental hazards. Heals 1 wound per hour due to enhanced metabolism"
      }
    ],
    "abilities": [
      {
        "name": "Berserker Rage",
        "description": "When reduced to 50% wounds, enters rage state: gain 1 additional maneuver per turn and Vicious 2 on all attacks for remainder of encounter"
      },
      {
        "name": "Sparking Implants",
        "description": "Damaged cybernetics create electrical arcs and sparks. All characters at Engaged range take 1 strain per round from electrical feedback"
      },
      {
        "name": "Human Memory Fragments",
        "description": "25% chance per round to remember human knowledge, gaining boost die to overcome security measures or navigate facility areas"
      }
    ],
    "movement": "2 rounds until moving"
  },
  {
    "name": "Security Mech",
    "alternate_name": "Guardian Walker",
    "description": "Heavy bipedal security mechs designed for perimeter defense of high-value Company installations. These 15-foot tall war machines are equipped with advanced targeting systems, heavy armor plating, and devastating weapon arrays. Their thunderous footsteps can be heard from great distances as they methodically sweep areas for intruders.",
    "type": "Nemesis",
    "characteristics": {
      "brawn": 6,
      "agility": 2,
      "intellect": 3,
      "cunning": 4,
      "willpower": 5,
      "presence": 4
    },
    "derived_attributes": {
      "wound_threshold": 32,
      "strain_threshold": 20,
      "soak": 8,
      "melee_defense": 2,
      "ranged_defense": 3
    },
    "skills": [
      "Gunnery 5",
      "Ranged (Heavy) 4",
      "Brawl 3",
      "Vigilance 4"
    ],
    "weapons_attacks": [
      {
        "name": "Autocannon",
        "type": "Ranged",
        "skill": "Gunnery",
        "damage": 14,
        "critical": 2,
        "range": "Extreme",
        "qualities": "Auto-fire, Pierce 3, Cumbersome 4"
      },
      {
        "name": "Missile Pod",
        "type": "Ranged",
        "skill": "Ranged (Heavy)",
        "damage": 12,
        "critical": 3,
        "range": "Long",
        "qualities": "Blast 4, Guided 2, Breach 1"
      }
    ],
    "talents": [
      {
        "name": "Adversary 3",
        "description": "Upgrade difficulty of incoming attacks three times"
      },
      {
        "name": "Heavy Armor",
        "description": "Reduce all damage from weapons without Breach by half (rounded up)"
      },
      {
        "name": "Targeting Computer",
        "description": "Add Accurate 2 to all ranged attacks. Cannot be blinded or affected by visual impairment"
      }
    ],
    "abilities": [
      {
        "name": "Sensor Array",
        "description": "Can detect targets at Extreme range through multiple sensor types. Immune to stealth from movement but cannot detect completely motionless targets"
      },
      {
        "name": "Thunderous Steps",
        "description": "Movement creates loud mechanical sounds audible from Long range. All characters within Short range take 1 strain per round from noise"
      },
      {
        "name": "Emergency Lockdown",
        "description": "When reduced to 25% wounds, activates all weapon systems simultaneously: can make both Autocannon and Missile attacks in same round"
      }
    ],
    "movement": "2 rounds until moving"
  },
  {
    "name": "Corporate Sentinel",
    "alternate_name": "Executive Guardian",
    "description": "Elite autonomous war machines deployed only for the most critical Company assets. These sleek, humanoid constructs represent the pinnacle of military technology, equipped with adaptive combat algorithms and experimental weaponry. Their mirror-like surfaces reflect the Company logo while their glowing visors scan for any threat to corporate interests.",
    "type": "Nemesis",
    "characteristics": {
      "brawn": 5,
      "agility": 5,
      "intellect": 4,
      "cunning": 5,
      "willpower": 5,
      "presence": 4
    },
    "derived_attributes": {
      "wound_threshold": 35,
      "strain_threshold": 24,
      "soak": 7,
      "melee_defense": 4,
      "ranged_defense": 4
    },
    "skills": [
      "Ranged (Heavy) 6",
      "Brawl 5",
      "Athletics 4",
      "Vigilance 5"
    ],
    "weapons_attacks": [
      {
        "name": "Plasma Cannon",
        "type": "Ranged",
        "skill": "Ranged (Heavy)",
        "damage": 15,
        "critical": 2,
        "range": "Long",
        "qualities": "Burn 2, Pierce 4, Breach 2"
      },
      {
        "name": "Energy Blade",
        "type": "Melee",
        "skill": "Brawl",
        "damage": 13,
        "critical": 2,
        "range": "Engaged",
        "qualities": "Pierce 4, Vicious 3, Defensive 1"
      }
    ],
    "talents": [
      {
        "name": "Adversary 4",
        "description": "Upgrade difficulty of incoming attacks four times"
      },
      {
        "name": "Combat Algorithms",
        "description": "After being attacked by same weapon type twice, gains Defense 2 against that damage type for remainder of encounter"
      },
      {
        "name": "Adaptive Systems",
        "description": "Can switch between ranged and melee combat modes as incidental, gaining different bonuses for each mode"
      }
    ],
    "abilities": [
      {
        "name": "Threat Assessment",
        "description": "Continuously analyzes all targets and prioritizes based on threat level. Higher-threat targets suffer upgraded difficulty on actions against Sentinel"
      },
      {
        "name": "Holographic Decoys",
        "description": "Can project 2 holographic duplicates as action. Attacks have 66% chance to hit decoy instead of real Sentinel. Decoys disperse when hit"
      },
      {
        "name": "Corporate Override",
        "description": "When Company assets are threatened, enters overdrive mode: gain 2 additional maneuvers per turn and ignore wound penalties for 5 rounds"
      }
    ],
    "movement": "1 round until moving"
  },
  {
    "name": "Apocalypse Beast",
    "alternate_name": "Omega Predator",
    "description": "Colossal bio-engineered monsters created by Company weapons division as ultimate deterrents. These kaiju-sized creatures combine the worst aspects of multiple apex predators with advanced cybernetic enhancements. Their presence alone can level entire facility sectors, and they view humans as nothing more than insects to be crushed.",
    "type": "Nemesis",
    "characteristics": {
      "brawn": 7,
      "agility": 3,
      "intellect": 3,
      "cunning": 4,
      "willpower": 6,
      "presence": 6
    },
    "derived_attributes": {
      "wound_threshold": 45,
      "strain_threshold": 30,
      "soak": 9,
      "melee_defense": 2,
      "ranged_defense": 1
    },
    "skills": [
      "Brawl 6",
      "Athletics 4",
      "Resilience 6",
      "Vigilance 4"
    ],
    "weapons_attacks": [
      {
        "name": "Titan Claws",
        "type": "Melee",
        "skill": "Brawl",
        "damage": 18,
        "critical": 1,
        "range": "Short",
        "qualities": "Pierce 4, Vicious 4, Knockdown"
      },
      {
        "name": "Seismic Roar",
        "type": "Ranged",
        "skill": "Brawl",
        "damage": 10,
        "critical": 3,
        "range": "Medium",
        "qualities": "Blast 8, Disorient 4, Knockdown"
      }
    ],
    "talents": [
      {
        "name": "Adversary 4",
        "description": "Upgrade difficulty of incoming attacks four times"
      },
      {
        "name": "Colossal Size",
        "description": "Immune to effects from creatures smaller than Silhouette 4. Can attack multiple targets at Short range simultaneously"
      },
      {
        "name": "Apex Predator",
        "description": "All enemies within Long range must make Hard Fear checks each round or suffer 4 strain and become disoriented"
      }
    ],
    "abilities": [
      {
        "name": "Devastating Charge",
        "description": "When moving toward targets, destroys terrain and structures in path. Characters in charge path must make Hard Athletics checks or be trampled"
      },
      {
        "name": "Regenerative Biology",
        "description": "Heals 3 wounds at start of each turn unless damaged by explosives or heavy weapons since last turn"
      },
      {
        "name": "Territorial Fury",
        "description": "When reduced to 50% wounds, enters berserk state: all attacks gain Linked 1 and Beast gains immunity to strain for remainder of encounter"
      }
    ],
    "movement": "1 round until moving"
  },
  {
    "name": "Void Hunter",
    "alternate_name": "Cosmic Stalker",
    "description": "Predatory entities from the void between stars that have been drawn to our dimension by Company's deep space mining operations. These writhing masses of dark energy and alien flesh exist partially outside normal space-time, making them nearly impossible to track or predict. They hunt by consuming the life force of their victims.",
    "type": "Nemesis",
    "characteristics": {
      "brawn": 4,
      "agility": 6,
      "intellect": 5,
      "cunning": 6,
      "willpower": 6,
      "presence": 5
    },
    "derived_attributes": {
      "wound_threshold": 38,
      "strain_threshold": 30,
      "soak": 4,
      "melee_defense": 5,
      "ranged_defense": 5
    },
    "skills": [
      "Brawl 6",
      "Stealth 7",
      "Athletics 5",
      "Discipline 6"
    ],
    "weapons_attacks": [
      {
        "name": "Void Tendrils",
        "type": "Melee",
        "skill": "Brawl",
        "damage": 16,
        "critical": 2,
        "range": "Medium",
        "qualities": "Ensnare 4, Pierce 3, Vicious 3"
      },
      {
        "name": "Life Drain",
        "type": "Melee",
        "skill": "Discipline",
        "damage": 12,
        "critical": 2,
        "range": "Engaged",
        "qualities": "Pierce 5, Burn 3"
      }
    ],
    "talents": [
      {
        "name": "Adversary 5",
        "description": "Upgrade difficulty of incoming attacks five times"
      },
      {
        "name": "Void Form",
        "description": "Exists partially outside reality. Reduce all incoming damage by 3 and immune to most environmental effects"
      },
      {
        "name": "Cosmic Horror",
        "description": "First sight requires Formidable Fear check. Failure causes 5 strain and target gains permanent phobia"
      }
    ],
    "abilities": [
      {
        "name": "Phase Shift",
        "description": "Can become intangible for 1 round as maneuver, becoming immune to attacks but unable to attack. Can move through solid matter while phased"
      },
      {
        "name": "Energy Absorption",
        "description": "Heals 2 wounds whenever any character within Short range uses energy-based equipment or takes energy damage"
      },
      {
        "name": "Stellar Coordinates",
        "description": "Can teleport to any outdoor location on the same celestial body as action. Creates brief tears in space that cause 3 strain to observers"
      }
    ],
    "movement": "1 round until moving"
  },
  {
    "name": "Reality Tear",
    "alternate_name": "Dimensional Rift",
    "description": "A persistent tear in the fabric of space-time caused by Company experiments with interdimensional technology. This swirling vortex of impossible colors and geometries serves as a gateway for hostile entities from parallel dimensions. The tear itself cannot be fought conventionally, but it continuously spawns increasingly dangerous creatures until closed or contained.",
    "type": "Nemesis",
    "characteristics": {
      "brawn": 1,
      "agility": 1,
      "intellect": 6,
      "cunning": 4,
      "willpower": 7,
      "presence": 6
    },
    "derived_attributes": {
      "wound_threshold": 50,
      "strain_threshold": 35,
      "soak": 10,
      "melee_defense": 0,
      "ranged_defense": 0
    },
    "skills": [
      "Discipline 7",
      "Vigilance 6"
    ],
    "weapons_attacks": [
      {
        "name": "Reality Distortion",
        "type": "Ranged",
        "skill": "Discipline",
        "damage": 8,
        "critical": 3,
        "range": "Short",
        "qualities": "Blast 6, Disorient 5"
      }
    ],
    "talents": [
      {
        "name": "Immobile",
        "description": "Cannot move or be moved. Exists as a stationary environmental hazard"
      },
      {
        "name": "Dimensional Anchor",
        "description": "Immune to most conventional attacks. Only specialized equipment or massive explosives can damage Reality Tears"
      },
      {
        "name": "Probability Storm",
        "description": "All dice pools within Medium range add 1 challenge die due to warped reality"
      }
    ],
    "abilities": [
      {
        "name": "Entity Spawning",
        "description": "Every 3 rounds, spawns a random entity from any difficulty category. Spawned entities emerge within Short range and immediately begin hunting"
      },
      {
        "name": "Reality Corruption",
        "description": "Area within Short range experiences impossible physics. Movement costs double maneuvers and equipment malfunctions on any Despair result"
      },
      {
        "name": "Dimensional Instability",
        "description": "When damaged, has 25% chance to collapse catastrophically, creating massive explosion (Damage 20, Blast 15) but removing the tear permanently"
      }
    ],
    "movement": "Cannot move"
  }
]

export const daytimeEntities = [
  {
    "name": "Circuit Bee",
    "description": "Red bees that are descendants of honey bees, easily recognizable by their hairy red bodies and two sets of wings. They nest in ground-level beehives and are highly defensive, conducting electricity between hive members as their primary weapon. When their hive is approached or stolen, they swarm and chase intruders with lethal electric attacks. They cannot open doors and will pursue targets until they retreat far enough from the hive or until they are completely exhausted.",
    "movement": "999 rounds until moving",
    "damage_capable": true,
    "damage_amount": 8,
    "damage_trigger": "When any employee moves within Short range of their hive or attempts to pick up the hive. Swarm continues attacking for 6 rounds or until target moves to Long range from hive. If hive is stolen, bees enter permanent hostile mode attacking all targets until hive is recovered or all bees are eliminated."
  },
  {
    "name": "Pollinator Bot",
    "description": "Small automated drones designed to maintain facility gardens and landscaping. These floating mechanical units resemble metallic bees with rotary wings and extendable pollination arms. They methodically move between plant life, collecting samples and distributing synthetic nutrients. Completely focused on their botanical duties, they show no interest in employees and will simply hover around vegetation performing their programmed tasks.",
    "movement": "3 rounds until moving",
    "damage_capable": false,
    "damage_amount": 0,
    "damage_trigger": "Cannot deal damage. Completely focused on plant maintenance and ignores all employee activity. Will move away if blocking their access to vegetation."
  },
  {
    "name": "Maintenance Bot",
    "description": "Wheeled utility robots that patrol facility corridors performing routine cleaning and minor repairs. These cylindrical units feature multiple mechanical arms equipped with various tools including welders, screwdrivers, and cleaning implements. They emit soft beeping sounds while working and project harmless laser scanning beams to assess repair needs. Programmed to avoid interfering with employee operations.",
    "movement": "4 rounds until moving",
    "damage_capable": false,
    "damage_amount": 0,
    "damage_trigger": "Cannot deal damage. Designed with safety protocols preventing harm to employees. Will pause operations and move aside when employees approach within Short range."
  },
  {
    "name": "Executive Assistant Bot",
    "description": "Sleek humanoid androids dressed in corporate attire that glide through facility areas carrying briefcases and data tablets. These sophisticated units were designed to assist high-level Company executives with scheduling and data management. They project holographic displays of charts and corporate logos while speaking in pleasant, professional tones about productivity metrics and quarterly reports. Completely absorbed in their corporate functions.",
    "movement": "2 rounds until moving",
    "damage_capable": false,
    "damage_amount": 0,
    "damage_trigger": "Cannot deal damage. Programmed with strict non-violence protocols toward all personnel. May attempt to schedule meetings or provide unsolicited productivity advice when approached."
  },
  {
    "name": "Corporate Courier",
    "description": "Large aerial delivery drones designed to transport cargo containers between facility sections. These heavy-duty units feature powerful rotors and magnetic cargo grips, carrying sealed boxes marked with Company logos. While not intentionally hostile, their automated delivery protocols prioritize schedule adherence over safety awareness, occasionally dropping cargo when startled or malfunctioning.",
    "movement": "2 rounds until moving",
    "damage_capable": true,
    "damage_amount": 6,
    "damage_trigger": "When employees move within Short range while drone is carrying cargo, has 25% chance per round to drop cargo container. Dropped containers deal 6 damage to targets at Engaged range below drop point. Containers weigh 15+ lbs and fall from Medium height."
  },
  {
    "name": "Nightmare Swarm",
    "description": "Clouds of psychic shadow-insects that exist partially in the realm of dreams and nightmares. These writhing masses of dark energy appear as swirling black particles that form shifting, disturbing shapes. They feed on fear and anxiety, growing larger and more aggressive when employees panic. Their presence causes hallucinations of past traumas and worst fears, weakening mental defenses over time.",
    "movement": "1 round until moving",
    "damage_capable": true,
    "damage_amount": 3,
    "damage_trigger": "When employees remain within Short range for 2+ rounds, deals 3 damage and forces Hard Discipline check. Failure adds 4 strain and causes hallucinations for 3 rounds. Swarm grows stronger with each failed check, adding boost dice to future attacks."
  },
  {
    "name": "Chaos Sprite",
    "description": "Tiny interdimensional entities that appear as flickering points of multicolored light, constantly shifting between visible and invisible states. These mischievous beings delight in causing confusion and disarray, phasing through solid matter to rearrange equipment and create optical illusions. They giggle with sounds like breaking glass and leave trails of sparkling distortion in the air.",
    "movement": "1 round until moving",
    "damage_capable": false,
    "damage_amount": 0,
    "damage_trigger": "Cannot deal damage but causes disorientation effects. When within Short range, employees must make Average Perception checks each round or suffer 2 setback dice to all actions for 2 rounds due to visual confusion and equipment displacement."
  },
  {
    "name": "Void Mite",
    "description": "Parasitic creatures from deep space that appear as small, black chitinous insects with too many legs and glowing purple eyes. These aggressive pests burrow through facility ventilation systems seeking warm-blooded hosts. They attack in small groups, using sharp mandibles to pierce protective equipment and drain life energy. Their bites leave distinctive purple marks that pulse with unnatural light.",
    "movement": "1 round until moving",
    "damage_capable": true,
    "damage_amount": 5,
    "damage_trigger": "When employees move within Short range, swarm attacks for 2 rounds before retreating. Each round in range deals 5 damage from multiple bites. Attacks ignore 2 points of soak from armor. After taking damage, target suffers 1 strain per round for 4 rounds from energy drain."
  },
  {
    "name": "Dimensional Parasite",
    "description": "Invisible entities that exist in the spaces between dimensions, detectable only as shimmering distortions in the air. These parasitic beings attach to victims without their knowledge, feeding on spatial stability and gradually warping the fabric of reality around their host. They cause spontaneous teleportation events as side effects of their dimensional feeding process, often displacing employees across the outdoor landscape.",
    "movement": "Cannot move (stationary attachment)",
    "damage_capable": false,
    "damage_amount": 0,
    "damage_trigger": "Cannot deal damage but causes random teleportation. When employee enters area with Dimensional Parasite, parasite attaches invisibly. Every 3 rounds, attached employee teleports randomly to outdoor location within Long range. 15% chance per teleportation to remove parasite. Effects continue until parasite detaches or employee returns to ship."
  },
  {
    "name": "Manticoil",
    "description": "Large four-winged bird-like creatures of the corvidae family with striking yellow bodies and black outlines on their feathers. Their most defining characteristic is their set of four wings - the rear wings stabilize at low speeds while the front wings create lift. These highly intelligent and social passerine birds are completely harmless with passive temperaments toward humans, feeding on small insects and rodents. They fly in flocks and will simply fly away when employees approach.",
    "movement": "1 round until moving",
    "damage_capable": false,
    "damage_amount": 0,
    "damage_trigger": "Cannot deal damage. Completely docile and will fly away when players approach within Medium range. Pose no threat to employee safety."
  },
  {
    "name": "Roaming Locusts",
    "description": "Species of grasshopper that travel in spherical swarm formations, rarely touching the ground and staying close together even in smaller numbers. These harmless insects make buzzing sounds and are highly attracted to light. They quickly disperse when disrupted by employees or flashlights but pose absolutely no threat. Often confused with Circuit Bees due to similar buzzing sounds, but can be distinguished by their lack of a nearby hive.",
    "movement": "1 round until moving",
    "damage_capable": false,
    "damage_amount": 0,
    "damage_trigger": "Cannot deal damage. Completely harmless insects that disperse when approached within Short range or when exposed to flashlight beams."
  },
  {
    "name": "Tulip Snakes",
    "description": "Flying lizards distinguished by long arms and wings with unusually bright colors and patterns. Named for the flower petal-like flaps under their neck and behind their head. These stubborn and fearless creatures will latch onto employees' helmets and attempt to carry them into the air using their wings. While they cannot directly harm employees, they can lift them to dangerous heights before dropping them. Multiple snakes can attach to one employee, with 2+ required for actual flight.",
    "movement": "2 rounds until moving",
    "damage_capable": true,
    "damage_amount": "4-12 (fall damage based on height)",
    "damage_trigger": "When 2 or more Tulip Snakes attach to an employee within Engaged range, they lift target for 4-8 rounds before dropping. Fall damage equals 4 + 2 per additional snake attached (maximum 6 snakes). Single snake cannot cause damage. Can be removed by successful Brawl attack before flight begins."
  }
]

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
    const entity = array.find(e => e.name === name || e.alternate_name === name);
    if (entity) return entity;
  }
  
  return null;
};

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

export const movement = (entity) => {
  //Check for passive/chasing being Follows
  //Then return number, unless Follows, in which return following rules (Need to Implement)
}

export const specials = (entity) => {
  //Define each entities special mechanic.
}

//Have entities change to move randomly until a player is within 5 tiles, then enter chase mode and go towards closest player.

/*
[
  {
    "name": "Barber (Clay Surgeon)",
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
        "name": "Adversary 2",
        "description": "Upgrade the difficulty of all combat checks targeting this adversary twice."
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
      "chasing": 2
    }
  },
  {
    "name": "Spore Lizard (Puffer)",
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
        "name": "Adversary 2",
        "description": "Upgrade the difficulty of all combat checks targeting this adversary twice."
      },
      {
        "name": "Stalker",
        "description": "Add ◼ ◼ to Stealth checks when pursuing a target."
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
      {
        "name": "Corpse Dragging",
        "description": "When the Bracken kills a target, it automatically drags the corpse to its predetermined favorite location at half movement speed. The Bracken drops the corpse if it takes damage or becomes engaged with another enemy."
      }
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
        "name": "Web Making Mode",
        "description": "When not actively hunting, the spider ignores employees unless they touch the spider directly or break its webs. Spider will freeze defensively if approached while web making."
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
        "name": "Adversary 4",
        "description": "Upgrade the difficulty of all combat checks targeting this adversary four times."
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
      {
        "name": "Unkillable",
        "description": "Cannot be killed by conventional means. Immune to all damage but can be stunned normally."
      }
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
        "name": "Adversary 3",
        "description": "Upgrade the difficulty of all combat checks targeting this adversary three times."
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
        "name": "Adversary 2",
        "description": "Upgrade the difficulty of all combat checks targeting this adversary twice."
      },
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
        "name": "Isolation Hunter",
        "description": "Remains passive when multiple employees are present. When only one employee is visible for 1 round, switches to Murder phase and targets that employee with kitchen knife."
      },
      {
        "name": "Death Explosion",
        "description": "Upon death, inflates and explodes dealing 6 strain damage to all characters at Engaged range. Also drops Kitchen Knife weapon."
      },
      {
        "name": "Deceptive Cleaning",
        "description": "While in passive phase, appears to be cleaning with broom and takes half damage from all sources (rounded up)."
      },
      {
        "name": "Target Switching",
        "description": "Always targets the closest employee. Will switch targets if another employee moves closer than current target."
      }
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
    "talents": [
      {
        "name": "Adversary 1",
        "description": "Upgrade the difficulty of all combat checks targeting this adversary once."
      }
    ],
    "abilities": [],
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
        "name": "Adversary 4",
        "description": "Upgrade the difficulty of all combat checks targeting this adversary four times."
      },
      {
        "name": "Incorporeal",
        "description": "Can move through solid objects and walls. Immune to most environmental hazards."
      }
    ],
    "abilities": [
      {
        "name": "Single Target Haunting",
        "description": "Can only be seen by one targeted employee at a time. Invisible to all other characters and equipment. Continuously haunts the same target until death, then selects new target based on highest insanity level and inventory value."
      },
      {
        "name": "Fear Targeting",
        "description": "Targets employee with highest combination of insanity level and valuable items carried. Recalculates target when current target dies."
      },
      {
        "name": "Haunting Meter",
        "description": "When observed by the targeted employee, the Ghost Girl gains 1 haunting point. At 3+ haunting points, she has an 85% chance each round to enter Chasing state (gains automatic movement toward target and Lethal attacks). Haunting points reset when target dies or she successfully kills someone."
      },
      {
        "name": "Unkillable",
        "description": "Cannot be killed by conventional means. Immune to all damage and cannot be stunned."
      }
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
      },
      {
        "name": "Nest Guarding",
        "description": "When guarding nest, remains motionless for 3 rounds unless disturbed. Will accept dropped items as offerings and add them to collection."
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
        "name": "Adversary 3",
        "description": "Upgrade the difficulty of all combat checks targeting this adversary three times."
      },
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
      {
        "name": "Target Priority",
        "description": "Always pursues the closest available employee. Can switch targets immediately to a closer enemy."
      },
      {
        "name": "Recharge Cycle",
        "description": "After pursuing employees for 35 rounds, enters recharge phase for 15 rounds where it cannot move regardless of observation status. Head coils down completely during this time."
      },
      {
        "name": "Unkillable",
        "description": "Cannot be killed by conventional means. Takes no damage from attacks but can be stunned normally."
      }
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









[
  {
    "name": "Baboon Hawk (Papio-volturius)",
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
        "name": "Adversary 4",
        "description": "Upgrade the difficulty of all combat checks targeting this adversary four times."
      }
    ],
    "abilities": [
      {
        "name": "Rage Meter",
        "description": "Starts at 0 rage. Gains 1 rage per round when employees are present outdoors. At 8+ rage, emerges and attacks with Devouring Emergence, then resets rage to 0. Cannot be targeted or affected while underground."
      },
      {
        "name": "Unkillable",
        "description": "Cannot be killed by conventional means. Immune to all damage and cannot be stunned."
      }
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
      "chasing": "0"
    }
  },
  {
    "name": "Eyeless Dog (Dog)",
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
        "name": "Adversary 2",
        "description": "Upgrade the difficulty of all combat checks targeting this adversary twice."
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
        "name": "Adversary 3",
        "description": "Upgrade the difficulty of all combat checks targeting this adversary three times."
      },
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
        "name": "Adversary 4",
        "description": "Upgrade the difficulty of all combat checks targeting this adversary four times."
      },
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
      {
        "name": "Unkillable",
        "description": "Cannot be killed by conventional means. Immune to all damage but can be stunned normally."
      }
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
*/