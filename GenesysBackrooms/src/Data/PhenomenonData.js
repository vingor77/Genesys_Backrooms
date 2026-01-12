const data = [
  // Level-wide Isolation Phenomenon
  {
    id: "phenomenon-alone",
    name: "Alone",
    aliases: ["Isolation", "The Separation"],
    number: 15,
    category: "Isolation",
    severity: 3,
    scope: "level-wide",
    
    description: {
      overview: "A supernatural isolation effect that separates individuals from their companions, leaving them unable to perceive or interact with others despite physical proximity.",
      manifestation: "Companions' voices fade into echoing silence. They can be seen as ghostly figures but cannot be heard, touched, or communicated with."
    },
    
    indicators: {
      visual: "Companions appear as translucent, ghost-like figures. Movements seem delayed by a fraction of a second.",
      audio: "Complete silence except for your own sounds. No footsteps, breathing, or voices from others.",
      environmental: "Air feels unnaturally still. No ambient noise whatsoever."
    },
    
    triggerType: "automatic",
    triggerDetails: {
      condition: "Entering an affected level",
      activationMethod: null,
      chancePerHour: null,
      requirements: null
    },
    stackingBehavior: "none",
    
    effects: [
      {
        type: "isolation",
        duration: "Until exit",
        description: "You are completely isolated from your companions. They exist in the same space but you cannot interact.",
        mechanical: "Cannot provide or receive Assistance. Cannot use Aid Another. Cannot transfer items. Can see companions but cannot communicate. Each isolated individual rolls separately for everything."
      },
      {
        type: "mental",
        duration: "1 hour",
        description: "The crushing loneliness takes its toll on your mind.",
        mechanical: "After 1 hour of isolation, suffer 3 Strain. Repeat every hour isolated. At 4+ hours, upgrade difficulty of all checks once due to psychological stress."
      }
    ],
    
    environmentalEffects: {
      modifyLighting: null,
      modifyTemperature: null,
      addAtmosphere: null,
      removeAtmosphere: false
    },
    
    counterplay: {
      canBeAvoided: false,
      avoidanceMethod: null,
      
      canBeResisted: true,
      resistanceCheck: "Hard Discipline check upon entering level",
      resistanceOutcomes: {
        success: "Can perceive companions dimly and hear muffled voices. Cannot physically interact but can communicate.",
        advantage: "Can also provide Boost dice to companions through encouragement.",
        triumph: "Completely immune to isolation. Functions normally.",
        failure: "Full isolation as described.",
        threat: "Isolation is more severe - cannot even see companions.",
        despair: "Complete sensory deprivation - cannot see OR hear companions. Upgrade all checks twice."
      },
      
      canBeEnded: true,
      endingMethod: "Exit the level. No other method known.",
      
      protectiveItems: ["reality-anchor", "almond-water"]
    },
    
    spawnConditions: {
      minimumDangerLevel: 2,
      conflictingPhenomena: ["phenomenon-crowd", "phenomenon-echoes"]
    },
    
    interactions: {
      affectsEntities: false,
      affectsPOIs: true,
      blocksTravel: false
    },
    
    variants: [
      {
        name: "Partial Isolation",
        description: "Less severe version where communication is still possible but physical interaction is blocked.",
        spawnChance: 40,
        changes: {
          severity: 2,
          effects: [
            {
              type: "isolation",
              duration: "Until exit",
              description: "You can see and hear companions but cannot touch them or hand them items.",
              mechanical: "Can communicate normally. Can provide Boost dice through advice. Cannot use Aid Another or transfer physical items. Cannot physically assist in skill checks."
            }
          ]
        }
      }
    ],
    
    tags: ["liminal", "isolated", "office", "abandoned"],
    
    dmNotes: {
      howToRun: "Describe the isolation gradually. Start with voices becoming distant, then muffled, then silent. Players can still see each other but it should feel unsettling - like they're in parallel dimensions. Emphasize the psychological weight of being alone in the Backrooms. Each player should feel genuinely isolated even though their companions are right there.",
      narrativeHooks: "Use Alone to force character development. Isolated players must face their fears solo. Great for splitting party temporarily without physically separating them. Can reveal character strengths when they must rely only on themselves.",
      commonMistakes: "Don't make it punitive - allow creative solutions. Players might write notes, use flashlight signals, or find other ways to communicate. The phenomenon blocks direct interaction but creativity should be rewarded. Also don't drag it out - few hours maximum before they find exit.",
      sessionNotes: {}
    },
    
    sessionVisibility: {}
  },

  // Room-specific Environmental Phenomenon
  {
    id: "phenomenon-consuming-darkness",
    name: "Consuming Darkness",
    aliases: ["The Black", "Lightless Void"],
    number: null,
    category: "Environmental",
    severity: 4,
    scope: "room-specific",
    
    description: {
      overview: "An unnatural darkness that devours all sources of light and spreads to consume the room in absolute blackness.",
      manifestation: "Light sources flicker and dim, then extinguish one by one. Darkness spreads from corners and shadows like living ink until the room is pitch black."
    },
    
    indicators: {
      visual: "Shadows seem to move and reach toward light sources. Edges of vision darken.",
      audio: "Faint whispering in the darkness. Sounds become muffled and distorted.",
      environmental: "Temperature drops 20 degrees. Air becomes heavy and oppressive."
    },
    
    triggerType: "player-activated",
    triggerDetails: {
      condition: null,
      activationMethod: "Extinguish a light source in the room (flashlight, candle, etc.)",
      chancePerHour: null,
      requirements: null
    },
    stackingBehavior: "none",
    
    effects: [
      {
        type: "environmental",
        duration: "2d6 hours",
        description: "The room is plunged into absolute darkness. No light can penetrate the void.",
        mechanical: "Lighting set to 0. All light sources in room are suppressed - flashlights don't work, fires extinguish, even magical light fails. Upgrade all checks 3 times due to blindness. Ranged attacks impossible. Melee attacks upgrade difficulty twice."
      },
      {
        type: "physical",
        duration: "Permanent",
        description: "The cold darkness saps warmth and vitality.",
        mechanical: "Suffer 1 Wound per 10 minutes spent in the darkness due to hypothermia. At 30+ minutes, upgrade all checks once more due to cold."
      },
      {
        type: "sanity",
        duration: "Instantaneous",
        description: "The absolute darkness triggers primal fear.",
        mechanical: "When darkness first consumes the room, make Average Fear check. Failure causes 3 Strain. Despair causes Fear condition."
      }
    ],
    
    environmentalEffects: {
      modifyLighting: 0,
      modifyTemperature: -20,
      addAtmosphere: null,
      removeAtmosphere: false
    },
    
    counterplay: {
      canBeAvoided: true,
      avoidanceMethod: "Don't extinguish any light sources in suspicious rooms. Keep at least one light burning at all times.",
      
      canBeResisted: false,
      resistanceCheck: null,
      resistanceOutcomes: null,
      
      canBeEnded: true,
      endingMethod: "Exit the room OR wait for duration to expire naturally. Once outside, darkness remains in that room.",
      
      protectiveItems: ["almond-water", "blessed-candle", "reality-anchor"]
    },
    
    spawnConditions: {
      minimumDangerLevel: 4,
      conflictingPhenomena: []
    },
    
    interactions: {
      affectsEntities: false,
      affectsPOIs: true,
      blocksTravel: false
    },
    
    variants: [
      {
        name: "Partial Darkness",
        description: "Less severe version that dims but doesn't completely extinguish light.",
        spawnChance: 30,
        changes: {
          severity: 3,
          environmentalEffects: {
            modifyLighting: 1,
            modifyTemperature: -10,
            addAtmosphere: null,
            removeAtmosphere: false
          },
          effects: [
            {
              type: "environmental",
              duration: "1d10 hours",
              description: "The room dims to near-darkness. Light sources provide minimal illumination.",
              mechanical: "Lighting reduced to 1. Light sources provide only 1/4 normal range. Upgrade all checks once. Add 1 Setback die to Ranged attacks."
            }
          ]
        }
      }
    ],
    
    tags: ["dark", "dangerous", "abandoned", "hostile"],
    
    dmNotes: {
      howToRun: "This should feel terrifying when triggered. Describe lights dying one by one, shadows rushing in. The darkness should feel alive and malevolent. Players trapped in consumed rooms should feel genuine horror at being blind. Let them stumble, fumble, and struggle. This is a severe phenomenon that punishes carelessness - make sure they understand the danger.",
      narrativeHooks: "Use to teach players not to mess with strange phenomena. Can trap players who split up. Creates memorable horror moments. Works well with entities that hunt in darkness. Can force difficult moral choices - abandon trapped allies or risk entering darkness to save them?",
      commonMistakes: "Don't spring this on players without warning signs. There should be clues - maybe previous rooms had darkened corners, or an NPC mentioned rooms that 'eat light'. Also don't let entire party get trapped - have at least one escape or the session stalls.",
      sessionNotes: {}
    },
    
    sessionVisibility: {}
  },

  // Room-specific Temporal Phenomenon  
  {
    id: "phenomenon-time-loop",
    name: "Temporal Loop",
    aliases: ["The Repeat", "Groundhog Zone"],
    number: null,
    category: "Temporal",
    severity: 2,
    scope: "room-specific",
    
    description: {
      overview: "A localized time anomaly that causes anyone inside to relive the same few minutes repeatedly until they break the loop's pattern.",
      manifestation: "A sudden sense of déjà vu, followed by the realization that events are repeating. The room seems to 'reset' every 3-5 minutes."
    },
    
    indicators: {
      visual: "Objects return to original positions. Clock hands (if present) spin backwards then reset. Slight visual stuttering at loop boundaries.",
      audio: "Sounds repeat in perfect loops. Conversations restart mid-sentence. Background noise cycles.",
      environmental: "Brief disorientation at each reset. Mild nausea during loop transitions."
    },
    
    triggerType: "random-chance",
    triggerDetails: {
      condition: null,
      activationMethod: null,
      chancePerHour: 0.15,
      requirements: null
    },
    stackingBehavior: "refresh",
    
    effects: [
      {
        type: "temporal",
        duration: "Until broken",
        description: "Time loops every 3-5 minutes. All actions reset except memories. Physical progress is undone.",
        mechanical: "Every 3-5 minutes (DM discretion), the room resets. All physical changes revert. Characters retain memories. Items taken from the room vanish at reset. Must identify and break the loop pattern to escape."
      },
      {
        type: "mental",
        duration: "Per loop",
        description: "Each repetition strains the mind as reality contradicts memory.",
        mechanical: "After 3 loops, suffer 1 Strain per subsequent loop. After 10 loops, must make Average Discipline check each loop or gain Disoriented condition."
      }
    ],
    
    environmentalEffects: {
      modifyLighting: null,
      modifyTemperature: null,
      addAtmosphere: null,
      removeAtmosphere: false
    },
    
    counterplay: {
      canBeAvoided: true,
      avoidanceMethod: "Don't enter rooms where you experience déjà vu. If objects seem to have moved back, leave immediately.",
      
      canBeResisted: false,
      resistanceCheck: null,
      resistanceOutcomes: null,
      
      canBeEnded: true,
      endingMethod: "Identify and break the loop's trigger. Each loop has a specific condition that must be changed - leaving an object, NOT touching something, saying specific words. Requires Average Perception check to notice pattern, then roleplay solution.",
      
      protectiveItems: ["temporal-anchor", "paradox-stone"]
    },
    
    spawnConditions: {
      minimumDangerLevel: 1,
      conflictingPhenomena: ["phenomenon-time-dilation"]
    },
    
    interactions: {
      affectsEntities: true,
      affectsPOIs: true,
      blocksTravel: true
    },
    
    variants: [
      {
        name: "Degrading Loop",
        description: "Each iteration, reality degrades slightly. Objects become less detailed, colors fade.",
        spawnChance: 20,
        changes: {
          severity: 3,
          effects: [
            {
              type: "temporal",
              duration: "Until broken",
              description: "Time loops with progressive degradation. Reality becomes less stable each cycle.",
              mechanical: "Standard loop rules plus: After 5 loops, room details start disappearing. After 10, add 1 Setback to all checks due to unstable environment. After 15, risk of permanent reality damage - characters may lose items or memories."
            }
          ]
        }
      }
    ],
    
    tags: ["temporal", "puzzle", "liminal", "office"],
    
    dmNotes: {
      howToRun: "The key is making the loop feel consistent but solvable. Decide the trigger condition before players enter (e.g., 'the loop breaks when all books are returned to the shelf' or 'the loop breaks when someone leaves through the window instead of the door'). Give subtle hints each iteration. This is a puzzle, not a punishment.",
      narrativeHooks: "Great for revealing information - players can witness past events looping. Can use to let players 'practice' a dangerous encounter. Creates memorable moments when they finally break free. Can contain important clues they need to observe multiple times.",
      commonMistakes: "Don't make the solution too obscure. 3-5 loops should be enough to figure it out with good roleplaying. Don't let Strain accumulate too fast - the loop should challenge, not kill. Also track what changes each loop so it feels consistent.",
      sessionNotes: {}
    },
    
    sessionVisibility: {}
  }
];

export default data;