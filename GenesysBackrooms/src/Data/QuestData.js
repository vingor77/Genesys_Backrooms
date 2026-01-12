const data = [
  // Main Quest - Rescue Mission
  {
    id: "quest-rescue-hollow",
    name: "Rescue Commander Hollow",
    type: "main",
    
    description: "Commander Hollow has gone missing during a routine patrol. Intel suggests he's been captured by hostile forces. Find him, rescue him, and bring him home.",
    context: "Commander Hollow is one of M.E.G.'s most valuable leaders. His loss would be devastating to morale and operations. Time is of the essence.",
    
    questGiver: {
      type: "poi",
      id: "lieutenant-chen",
      dialogue: "Commander Hollow hasn't checked in for 72 hours. His last known position was near the old warehouse district on Level 4. I need you to find him - alive if possible. This stays quiet until we know more.",
      conditions: [
        "Must have completed quest-meg-orientation",
        "Must have M.E.G. reputation >= 15"
      ],
      voiceActingTips: "Speak with controlled urgency. Chen is worried but trying to maintain composure."
    },
    
    questReceiver: {
      type: "poi",
      id: "lieutenant-chen",
      dialogue: "You brought him back. I... thank you. M.E.G. won't forget this.",
      alternateReceivers: [
        {
          type: "poi",
          id: "commander-hollow",
          dialogue: "You came for me. Not everyone would have. I owe you my life.",
          note: "Only available if Hollow is conscious when rescued"
        }
      ]
    },
    
    objectives: [
      {
        id: "obj-1",
        description: "Investigate Hollow's last known position",
        type: "investigation",
        details: "Search the warehouse district on Level 4 for signs of struggle or clues.",
        order: 1,
        references: {
          levelIds: ["level-4"],
          poiIds: ["commander-hollow"]
        },
        dmNotes: "Players should find signs of a struggle - spent shell casings, blood trail, torn insignia.",
        commonIssues: "Players may try to rush ahead without investigating.",
        hints: ["Look for anything out of place", "Check for signs of a struggle"]
      },
      {
        id: "obj-2",
        description: "Track the captors to their hideout",
        type: "investigation",
        details: "Follow the trail to find where they've taken Hollow.",
        order: 2,
        references: { levelIds: ["level-4"] },
        dmNotes: "Trail leads through dangerous territory.",
        hints: ["Blood trails can be followed", "Ask locals if they saw anything"]
      },
      {
        id: "obj-3",
        description: "Infiltrate the enemy compound",
        type: "task",
        details: "Get inside the hostile facility where Hollow is being held.",
        order: 3,
        references: { outpostIds: ["hostile-compound-4a"] },
        dmNotes: "Multiple approaches possible: stealth, diplomacy, or assault.",
        hints: ["Scout the perimeter first", "Look for alternative entrances"]
      },
      {
        id: "obj-4",
        description: "Rescue Commander Hollow",
        type: "combat",
        details: "Free Hollow from captivity and neutralize threats.",
        order: 4,
        references: { poiIds: ["commander-hollow"] },
        dmNotes: "Hollow is injured but can move. He'll help if given a weapon.",
        hints: ["Hollow may know the layout", "Speed is important once detected"]
      },
      {
        id: "obj-5",
        description: "Extract safely with Hollow",
        type: "task",
        details: "Get Hollow out of hostile territory.",
        order: 5,
        references: { outpostIds: ["meg-base-alpha"] },
        dmNotes: "This should feel tense - they're being pursued.",
        hints: ["The way in may be compromised", "Hollow knows some shortcuts"]
      }
    ],
    
    variants: [
      {
        id: "variant-stealth",
        name: "Ghost Extraction",
        triggerCondition: "Complete the mission without raising any alarms",
        description: "Clean in, clean out. The enemy never knew you were there.",
        objectiveChanges: [
          {
            objectiveId: "obj-4",
            newDescription: "Silently neutralize guards and free Hollow",
            newDetails: "No alarms, no witnesses, no traces."
          }
        ],
        rewardChanges: {
          items: [{ itemId: "stealth-suit", count: 1 }],
          factionReputation: [{ factionId: "meg", change: 10 }],
          consequences: "Enemy faction doesn't know who rescued Hollow."
        },
        nextQuestOverride: null,
        dmNotes: "Hardest variant but best outcome."
      },
      {
        id: "variant-assault",
        name: "Shock and Awe",
        triggerCondition: "Launch a direct assault on the compound",
        description: "You hit them hard and fast.",
        objectiveChanges: [
          {
            objectiveId: "obj-3",
            newDescription: "Breach the compound by force",
            newDetails: "Fight your way to Hollow."
          }
        ],
        rewardChanges: {
          items: [{ itemId: "heavy-weapon", count: 1 }],
          factionReputation: [{ factionId: "meg", change: 5 }],
          consequences: "Enemy faction knows M.E.G. was responsible. Expect retaliation."
        },
        nextQuestOverride: "quest-retaliation",
        dmNotes: "Easier but has consequences."
      }
    ],
    
    rewards: {
      items: [
        { itemId: "meg-commendation-medal", count: 1, note: "Official recognition" },
        { itemId: "tactical-gear-set", count: 1, note: "High-quality equipment" }
      ],
      factionReputation: [
        { factionId: "meg", change: 25, reason: "Rescued valuable commander" }
      ],
      recipeUnlocks: [],
      information: [
        { title: "Enemy Operations Intel", content: "Details about hostile operations in Level 4.", ruleUnlockId: null }
      ],
      questUnlocks: ["quest-hollow-gratitude", "quest-enemy-investigation"],
      dmNotes: "Hollow personally thanks the players."
    },
    
    locksOutQuests: [
      { questId: "quest-join-hostile-faction", reason: "Now considered enemies", affectsAllPlayers: true }
    ],
    
    questLine: {
      id: "questline-meg-command",
      name: "M.E.G. Command Arc",
      type: "main",
      position: 1,
      previousQuestId: null,
      nextQuestId: "quest-hollow-gratitude",
      branchingNote: "Assault variant leads to Retaliation quest instead"
    },
    
    sessionTracking: {
      shownToPlayers: false,
      completed: false,
      completedObjectives: [],
      completedByPlayers: [],
      activeVariant: null,
      sessionNotes: []
    },
    
    prerequisites: {
      quests: [{ questId: "quest-meg-orientation", mustBeCompleted: true, note: "Must be M.E.G. ally" }],
      factionReputation: [{ factionId: "meg", minimum: 15, note: "Must be trustworthy" }],
      worldState: "Commander Hollow must be active",
      dmNotes: "Offer when players are established with M.E.G."
    },
    
    failureConditions: [
      {
        condition: "Commander Hollow dies during rescue",
        reversible: false,
        consequences: "Quest fails. M.E.G. mourns a great loss.",
        alternativePath: "quest-avenge-hollow"
      },
      {
        condition: "Players are captured",
        reversible: true,
        consequences: "Must escape captivity. Quest becomes harder.",
        alternativePath: null
      }
    ],
    
    dmNotes: {
      runningThisQuest: "Tense rescue mission. Build atmosphere with descriptions of hostile territory.",
      playerMotivation: "Hollow is likeable - his capture should feel personal.",
      commonMistakes: "Don't make it too easy or too hard. Success should feel earned.",
      improvisationTips: "Reward creative solutions beyond the variants.",
      narrativeHooks: [
        "Combat: Direct assault is always an option",
        "Stealth: Ghost extraction is the perfect run",
        "Social: Negotiation is possible but costly"
      ],
      consequences: "Saving Hollow establishes players as trusted M.E.G. allies.",
      connectedQuests: ["quest-meg-orientation", "quest-hollow-gratitude"],
      secretInformation: "If players are slow, Hollow may have given up information under torture.",
      alternativeSolutions: ["Bribe guards", "Disguise as enemies", "Create distraction", "Tunnel in"],
      difficultyNotes: "Hard difficulty. Combat should challenge the party."
    },
    
    tags: ["rescue", "meg", "commander-hollow", "level-4", "combat", "stealth", "branching"],
    difficulty: "hard",
    themes: ["loyalty", "sacrifice", "urgency", "behind-enemy-lines"],
    
    sessionVisibility: {}
  },

  // Side Quest - Delivery
  {
    id: "quest-supply-run",
    name: "Emergency Supply Run",
    type: "side",
    
    description: "A remote outpost is running low on medical supplies. Someone needs to deliver a shipment before people start dying.",
    context: "The usual supply route has become too dangerous due to increased entity activity.",
    
    questGiver: {
      type: "poi",
      id: "trader-jackson",
      dialogue: "I've got supplies ready, but my runners won't touch this route. Too many Hounds. I need someone brave enough to make the delivery. Pay's good.",
      conditions: [],
      voiceActingTips: "Lucky is concerned but making it sound like a business opportunity."
    },
    
    questReceiver: {
      type: "poi",
      id: "medic-santos",
      dialogue: "Thank the Backrooms you made it! We were down to our last bandages. You've saved lives today.",
      alternateReceivers: []
    },
    
    objectives: [
      {
        id: "obj-1",
        description: "Pick up the medical supplies from Jackson",
        type: "delivery",
        details: "Collect the supply crate from Trader Jackson.",
        order: 1,
        references: { poiIds: ["trader-jackson"], objectIds: ["medical-supply-crate"] },
        dmNotes: "Jackson explains the route dangers.",
        hints: []
      },
      {
        id: "obj-2",
        description: "Navigate through Level 6 to reach the outpost",
        type: "task",
        details: "Cross dangerous territory to the remote outpost.",
        order: 2,
        references: { levelIds: ["level-6"], entityIds: ["hound"] },
        dmNotes: "Multiple Hound encounters. Consider 2-3 combat or stealth encounters.",
        hints: ["Hounds hunt by sound", "There may be safer but longer paths"]
      },
      {
        id: "obj-3",
        description: "Deliver supplies to Medic Santos",
        type: "delivery",
        details: "Get the supplies to the outpost medic intact.",
        order: 3,
        references: { poiIds: ["medic-santos"], outpostIds: ["outpost-haven"] },
        dmNotes: "Outpost is relieved and grateful.",
        hints: []
      }
    ],
    
    variants: [
      {
        id: "variant-fast",
        name: "Speed Delivery",
        triggerCondition: "Complete delivery in under 6 hours game time",
        description: "You pushed hard and fast, getting supplies there quickly.",
        objectiveChanges: [],
        rewardChanges: {
          items: [{ itemId: "speed-stim", count: 3 }],
          factionReputation: [],
          consequences: "Santos remembers your urgency. Future medical help discounted."
        },
        nextQuestOverride: null,
        dmNotes: "Reward players who prioritize speed."
      }
    ],
    
    rewards: {
      items: [
        { itemId: "almond-water", count: 5, note: "Payment from Jackson" },
        { itemId: "first-aid-kit", count: 2, note: "Gift from Santos" }
      ],
      factionReputation: [
        { factionId: "bntg", change: 10, reason: "Helped B.N.T.G. trader complete delivery" }
      ],
      recipeUnlocks: [],
      information: [],
      questUnlocks: [],
      dmNotes: "Good introductory quest. Moderate rewards for moderate risk."
    },
    
    locksOutQuests: [],
    questLine: null,
    
    sessionTracking: {
      shownToPlayers: false,
      completed: false,
      completedObjectives: [],
      completedByPlayers: [],
      activeVariant: null,
      sessionNotes: []
    },
    
    prerequisites: {
      quests: [],
      factionReputation: [],
      worldState: null,
      dmNotes: "Good quest when players need supplies or money."
    },
    
    failureConditions: [
      {
        condition: "Supply crate is destroyed or lost",
        reversible: false,
        consequences: "Quest fails. Outpost suffers.",
        alternativePath: null
      }
    ],
    
    dmNotes: {
      runningThisQuest: "Classic delivery quest with combat encounters. Good for a single session.",
      playerMotivation: "Good pay, helping people in need, building trader contacts.",
      commonMistakes: "Don't make encounters too easy. The danger is why Jackson can't find runners.",
      improvisationTips: "If players creatively avoid Hounds, let them succeed.",
      narrativeHooks: [
        "Combat: Multiple Hound encounters",
        "Stealth: Sneak past entirely",
        "Social: Find a guide who knows safe paths"
      ],
      consequences: "Establishes relationship with Jackson and Santos.",
      connectedQuests: [],
      secretInformation: null,
      alternativeSolutions: ["Hire guards", "Find alternate route", "Distract Hounds with bait"],
      difficultyNotes: "Medium difficulty."
    },
    
    tags: ["delivery", "medical", "level-6", "hounds", "trader"],
    difficulty: "medium",
    themes: ["urgency", "danger", "helping-others"],
    
    sessionVisibility: {}
  }
];

export default data;