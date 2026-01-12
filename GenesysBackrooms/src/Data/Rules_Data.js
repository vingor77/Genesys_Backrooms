const data = [
  {
    "id": "status-effects",
    "category": "Core Mechanics",
    "title": "Status Effects",
    "description": "Conditions that affect characters during gameplay",
    "order": 1,
    "content": [
      {
        "type": "text",
        "heading": "Negative Status Effects",
        "text": "These conditions hinder characters and can stack with each other.",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Blinded",
        "text": "Cannot see. Checks requiring sight automatically fail or suffer 3 Setback dice.",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Deafened",
        "text": "Cannot hear. Miss all audio cues and suffer communication difficulties.",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Disoriented",
        "text": "Suffer 1 Setback die to all checks.",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Frightened",
        "text": "While Frightened of a source, must use first maneuver each turn to move away from source OR make an Average Fear check. On success, remove Frightened status.",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Immobilized",
        "text": "Cannot perform maneuvers.",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Poisoned",
        "text": "Take X damage per round as specified by the source.",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Prone",
        "text": "Knocked down. Ranged attacks against the character suffer 1 Setback die. Melee attacks against the character gain 1 Boost die.",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Silenced",
        "text": "Cannot speak or make vocal sounds.",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Staggered",
        "text": "Cannot perform actions.",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Stunned",
        "text": "Cannot perform actions or maneuvers.",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Paranoid (60-79% Sanity)",
        "text": "Effects:\n\u2022 Distrust allies completely\n\u2022 Cannot receive Boost dice from allies or assistance\n\u2022 Cannot help in Group Checks\n\u2022 Social checks vs. allies: +2 Setback\n\nDuration: While sanity remains in 60-79% threshold",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Hallucinating (40-59% Sanity)",
        "text": "Effects:\n\u2022 See/hear unreal things\n\u2022 +2 Setback to Perception/Vigilance\n\u2022 GM introduces false information/threats\n\u2022 Hard (ddd) Discipline check to distinguish real from hallucination\n\nDuration: While sanity remains in 40-59% threshold",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Phobic (Triggered by Trauma)",
        "text": "Effects:\n\u2022 Uses character's Fear motivation OR triggering event\n\u2022 Auto-Frightened when encountering trigger\n\u2022 Hard (ddd) Fear check or must flee\n\u2022 Can have multiple different Phobias\n\nDuration: Permanent until therapy/quest resolution",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Catatonic (0% Sanity)",
        "text": "Effects:\n\u2022 Cannot act/communicate\n\u2022 Auto-fail all checks\n\u2022 Requires 8hr rest + Medicine (Hard ddd) to recover\n\u2022 May cause permanent consequences (GM discretion)\n\nDuration: While at 0% sanity",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Heat Stroke",
        "text": "Effects:\n\u2022 Upgrade all physical checks once\n\u2022 Suffer 2 strain/turn\n\u2022 Disoriented status\n\nDuration: Until cured with Medicine check + 1hr in Comfortable temperature",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Hypothermia",
        "text": "Effects:\n\u2022 Upgrade all physical checks once\n\u2022 Suffer 1 strain/turn\n\u2022 Max 1 maneuver/turn\n\nDuration: Until cured with Medicine check + 1hr in Comfortable temperature",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Positive Status Effects",
        "text": "These conditions benefit characters and can stack with each other.",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Boosted",
        "text": "Gain 1 Boost die to checks as specified by the source.",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Energized",
        "text": "At the beginning of the affected character's turn, recover 1 Strain.",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Fortified",
        "text": "Increase Soak by X as specified by the source.",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Protected",
        "text": "Increase Melee Defense or Ranged Defense by X as specified by the source.",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Regenerating",
        "text": "At the beginning of the affected character's turn, recover X Wounds as specified by the source.",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Special Status Effects",
        "text": "These conditions have unique mechanics.",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Confused",
        "text": "At the start of the affected character's turn, roll 1d6:\n(1-2) must move toward nearest threat\n(3-4) stand still and take no action\n(5-6) act normally",
        "style": "normal"
      }
    ]
  },
  {
    "id": "fear-sanity",
    "category": "Core Mechanics",
    "title": "Sanity & Fear System",
    "description": "Mental health and fear mechanics for the Backrooms",
    "order": 2,
    "content": [
      {
        "type": "text",
        "heading": "Sanity Scale",
        "text": "Characters have Sanity rated from 0-100 (fixed maximum, cannot increase).",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Failed Fear Check",
        "text": "1 per net Failure, +2 if Despair",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Entity Attack",
        "text": "1 sanity loss per attack",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Witness Death (unwanted)",
        "text": "1-3 sanity loss (GM discretion)",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Witness Death (wanted)",
        "text": "+1 sanity recovery",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Critical Injuries",
        "text": "Cumulative: 1st = 1, 2nd = 2, 3rd = 3, etc.",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Sleep Deprivation",
        "text": "1 per 48hr without sleep",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Time in Backrooms",
        "text": "1 per week",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Prolonged Isolation",
        "text": "1 per 72hr (no human contact, stacks with time)",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Impossible Geometry/Reality Distortions",
        "text": "2-4 sanity loss",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Forbidden Knowledge/Eldritch Texts",
        "text": "3-5 sanity loss",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Evidence of Wanderers' Fates",
        "text": "Resilience (Average dd) - success 1 loss, failure 3 loss",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Contact with Cosmic Entities",
        "text": "4-6 sanity loss",
        "style": "normal"
      },
      {
        "type": "table",
        "heading": "Sanity Effects by Threshold",
        "columns": [
          "Sanity %",
          "Effects"
        ],
        "rows": [
          {
            "col1": "80-100%",
            "col2": "No penalties"
          },
          {
            "col1": "60-79%",
            "col2": "1 Setback to Intellect/Cunning/Willpower. Paranoid status."
          },
          {
            "col1": "40-59%",
            "col2": "2 Setback to Intellect/Cunning/Willpower. Hallucinating status."
          },
          {
            "col1": "20-39%",
            "col2": "3 Setback to Intellect/Cunning/Willpower. Disoriented status."
          },
          {
            "col1": "1-19%",
            "col2": "4 Setback to Intellect/Cunning/Willpower. Confused status."
          },
          {
            "col1": "0%",
            "col2": "Catatonic status. Cannot act."
          }
        ]
      },
      {
        "type": "text",
        "heading": "Fear Checks",
        "text": "Skill: Fear (Willpower-based)\n\nDifficulty: GM discretion OR entity Difficulty rating:\n\u2022 Entity 1-2 = Easy (d)\n\u2022 Entity 3-4 = Average (dd)\n\u2022 Entity 5-6 = Hard (ddd)\n\u2022 Entity 7-8 = Daunting (dddd)\n\u2022 Entity 9-10 = Formidable (ddddd)\n\nFailure: Frightened status + sanity loss (1 per net Failure)\nDespair: +2 additional sanity loss",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Sanity Recovery",
        "text": "Normal/Uncomfortable Rest: +1 sanity per hour\n24hr Uncomfortable Rest Milestone: +5 sanity\nWitness Wanted Death: +1 sanity\nObjects Database Items: Some consumables/effects provide sanity recovery",
        "style": "normal"
      }
    ]
  },
  {
    "id": "time-tracking",
    "category": "Core Mechanics",
    "title": "Time Tracking",
    "description": "How time passes in and out of combat",
    "order": 3,
    "content": [
      {
        "type": "text",
        "heading": "Combat Time",
        "text": "Every turn = 6 seconds\n10 turns = 1 minute\nMax 3 incidentals per turn",
        "style": "normal"
      },
      {
        "type": "table",
        "heading": "Action Economy",
        "columns": [
          "Action Type",
          "Limit per Turn"
        ],
        "rows": [
          {
            "col1": "Actions",
            "col2": "1"
          },
          {
            "col1": "Maneuvers",
            "col2": "Up to 2"
          },
          {
            "col1": "Incidentals",
            "col2": "Maximum 3"
          }
        ]
      },
      {
        "type": "text",
        "heading": "Exploration Time (Out of Combat)",
        "text": "Time is tracked in minutes based on room size and actions taken.",
        "style": "normal"
      },
      {
        "type": "table",
        "heading": "Base Room Traversal Times",
        "columns": [
          "Room Size",
          "Normal Time",
          "Running (\u00d70.5)",
          "Careful (\u00d72)"
        ],
        "rows": [
          {
            "col1": "Engaged",
            "col2": "1 minute",
            "col3": "1 minute",
            "col4": "2 minutes"
          },
          {
            "col1": "Short",
            "col2": "3 minutes",
            "col3": "2 minutes",
            "col4": "6 minutes"
          },
          {
            "col1": "Medium",
            "col2": "7 minutes",
            "col3": "4 minutes",
            "col4": "14 minutes"
          },
          {
            "col1": "Long",
            "col2": "15 minutes",
            "col3": "8 minutes",
            "col4": "30 minutes"
          },
          {
            "col1": "Extreme",
            "col2": "30 minutes",
            "col3": "15 minutes",
            "col4": "60 minutes"
          }
        ]
      },
      {
        "type": "table",
        "heading": "Additional Actions",
        "columns": [
          "Action",
          "Time Added"
        ],
        "rows": [
          {
            "col1": "Glance around",
            "col2": "+1 minute"
          },
          {
            "col1": "Quick search",
            "col2": "+2 minutes"
          },
          {
            "col1": "Thorough search",
            "col2": "+5 minutes"
          },
          {
            "col1": "Exhaustive search",
            "col2": "+10 minutes"
          },
          {
            "col1": "Pick lock (Easy)",
            "col2": "+2 minutes"
          },
          {
            "col1": "Pick lock (Average)",
            "col2": "+5 minutes"
          },
          {
            "col1": "Pick lock (Hard)",
            "col2": "+10 minutes"
          },
          {
            "col1": "Interact with object",
            "col2": "+1 minute"
          },
          {
            "col1": "Operate machinery",
            "col2": "+2-5 minutes"
          },
          {
            "col1": "Solve puzzle",
            "col2": "+5-20 minutes"
          },
          {
            "col1": "Set up ambush",
            "col2": "+5 minutes"
          },
          {
            "col1": "Lay trap",
            "col2": "+10 minutes"
          },
          {
            "col1": "Barricade door (basic)",
            "col2": "+5 minutes"
          },
          {
            "col1": "Barricade door (reinforced)",
            "col2": "+15 minutes"
          },
          {
            "col1": "Climb obstacle",
            "col2": "+2-5 minutes"
          },
          {
            "col1": "Swim (per Short range)",
            "col2": "+1 minute"
          },
          {
            "col1": "Difficult terrain",
            "col2": "+50% base room time"
          }
        ]
      },
      {
        "type": "text",
        "heading": "Directional Traversal",
        "text": "For non-square rooms (e.g., hallways), use the dimension being traversed.\n\nExample: An Engaged \u00d7 Extreme hallway (2m \u00d7 500m) takes 30 minutes to walk lengthwise, but only 1 minute to cross the width.",
        "style": "normal"
      }
    ]
  },
  {
    "id": "range-bands",
    "category": "Core Mechanics",
    "title": "Range Bands System",
    "description": "Distance measurement system for movement, combat, and perception",
    "order": 7,
    "content": [
      {
        "type": "text",
        "heading": "Overview",
        "text": "The Backrooms uses abstract range bands instead of precise measurements. Range bands determine movement speed, weapon effectiveness, and perception difficulty.\n\nEach range band represents both a distance in meters and a narrative time to traverse during exploration.",
        "style": "normal"
      },
      {
        "type": "table",
        "heading": "Range Bands",
        "columns": [
          "Range Band",
          "Distance (Meters)",
          "Combat Context",
          "Traversal Time (Exploration)"
        ],
        "rows": [
          {
            "col1": "Engaged",
            "col2": "0-1m",
            "col3": "Melee range, grappling distance",
            "col4": "1 minute"
          },
          {
            "col1": "Short",
            "col2": "1-9m",
            "col3": "Close quarters, small room",
            "col4": "3 minutes"
          },
          {
            "col1": "Medium",
            "col2": "10-50m",
            "col3": "Mid-range, across large room",
            "col4": "7 minutes"
          },
          {
            "col1": "Long",
            "col2": "51-250m",
            "col3": "Long-range, down hallway",
            "col4": "15 minutes"
          },
          {
            "col1": "Extreme",
            "col2": "251m+",
            "col3": "Extreme distance, across zone",
            "col4": "30 minutes"
          }
        ]
      },
      {
        "type": "text",
        "heading": "Movement",
        "text": "During structured time (combat, chases):\n\u2022 Characters can move 1 range band per maneuver\n\u2022 Moving 2+ range bands requires multiple maneuvers or actions\n\u2022 Difficult terrain may require checks to move\n\nDuring narrative time (exploration):\n\u2022 Use traversal times from table above\n\u2022 GM adjusts based on obstacles, hazards, or urgency",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Melee Weapons",
        "text": "Can only attack targets at Engaged range. Some weapons with the Reach quality can attack at Short range.",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Ranged Weapons",
        "text": "Each ranged weapon specifies its effective range band:\n\u2022 Thrown weapons: Short or Medium\n\u2022 Pistols: Short to Medium\n\u2022 Rifles: Medium to Long\n\u2022 Sniper weapons: Long to Extreme\n\nAttacking beyond a weapon's effective range adds difficulty or becomes impossible.",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Perception and Range",
        "text": "Identifying details at a distance becomes harder:\n\n\u2022 Engaged/Short: Automatic perception of obvious features\n\u2022 Medium: Average Perception check for details\n\u2022 Long: Hard Perception check for details\n\u2022 Extreme: Formidable Perception check, only general shapes visible\n\nLighting, sound, and environmental conditions modify these difficulties.",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Vertical Distance",
        "text": "Climbing or descending counts as moving through range bands:\n\u2022 3 meters vertical = 1 range band of movement\n\u2022 Requires Athletics check if no ladder/stairs\n\u2022 Falling damage based on range bands fallen",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Confined Spaces",
        "text": "In tight corridors or small rooms, GM may limit maximum range to Short or Medium regardless of actual distance.",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Open Spaces",
        "text": "In vast open areas (large caverns, outdoor zones), distances may extend beyond normal range band definitions. Extreme range can represent kilometers in these cases.",
        "style": "normal"
      }
    ]
  },
  {
    "id": "group-checks",
    "category": "Core Mechanics",
    "title": "Group Checks",
    "description": "When the entire group attempts the same task together",
    "order": 8,
    "content": [
      {
        "type": "text",
        "heading": "Boost/Setback Assistance Rule",
        "text": "When the entire group attempts the same task together (Stealth, Perception, Athletics, etc.):",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Step 1: Determine Lead",
        "text": "Player with highest skill rank is the lead roller",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Step 2: Helpers Roll",
        "text": "All other players roll their own checks against same difficulty",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Step 3: Add Dice to Lead",
        "text": "\u2022 Each helper who succeeds \u2192 Add 1 Boost die to lead's pool\n\u2022 Each helper who fails \u2192 Add 1 Setback die to lead's pool\n\u2022 Each helper who did not succeed or fail \u2192 Add nothing to the lead's pool.",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Step 4: Lead Rolls",
        "text": "Lead player rolls once with all Boost/Setback dice added",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Step 5: Use Lead's Result",
        "text": "Lead's roll determines group success/failure",
        "style": "normal"
      }
    ]
  },
  {
    "id": "spending-symbols",
    "category": "Core Mechanics",
    "title": "Spending Symbols (Advantage, Threat, Triumph, Despair)",
    "description": "How to spend Advantage, Threat, Triumph, and Despair symbols on your dice rolls",
    "order": 10,
    "content": [
      {
        "type": "text",
        "heading": "Overview",
        "text": "After rolling dice, you'll have Success/Failure (determines if you succeed) and Advantage/Threat/Triumph/Despair (determines side effects). This section explains how to spend these symbols for mechanical benefits.",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Advantage (a)",
        "text": "a: Recover 1 strain\na: Add 1 Boost to your next check or an ally's next check\naa: Notice a single important point in the environment or narrative\naa: Perform an additional maneuver (once per turn)\naaa: Upgrade difficulty of target's next check once",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Threat (t)",
        "text": "t: Suffer 1 strain\nt: Lose benefit of a previous Boost die\ntt: Opponent recovers 1 strain\ntt: Add 1 Setback to your next check or an ally's next check\nttt: Fall prone, drop weapon, or lose equipment\nttt: Upgrade difficulty of an ally's next check once",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Triumph (x)",
        "text": "x: Automatically succeed on check (even with net Failure)\nx: Gain significant narrative advantage or game-changing benefit\nx: Upgrade ability twice on next check",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Despair (y)",
        "text": "y: Automatically fail check (even with net Success)\ny: Suffer significant narrative setback or complication\ny: Equipment breaks, weapon jams, or catastrophic failure occurs",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Advantage (a) - Combat",
        "text": "a: +1 damage (once per Success rolled)\naa: Inflict Critical Injury (requires hitting wound threshold)\naa: Activate weapon quality (if available)\naa: Perform free maneuver (move, aim, etc.)\naaa: Target is staggered (cannot perform actions) until end of next turn\naaaa: Target is knocked prone or disarmed",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Threat (t) - Combat",
        "text": "t: Attacker suffers 1 strain\ntt: Defender recovers 1 strain\ntt: Attacker loses benefits of prior maneuvers (aim, cover, etc.)\nttt: Attacker falls prone or drops weapon\ntttt: Attacker's weapon or equipment is damaged (loses 1 durability)",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Triumph (x) - Combat",
        "text": "x: Inflict Critical Injury (bypass wound threshold requirement)\nx: Destroy piece of cover or inflict 3 durability loss on target's equipment\nx: Attack hits multiple targets in blast radius (GM discretion)",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Despair (y) - Combat",
        "text": "y: Weapon jams, breaks, or runs out of ammo\ny: Attacker suffers Critical Injury from mishap\ny: Ally is accidentally hit by attack (GM determines damage)",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Advantage (a) - Social",
        "text": "aa: Learn an aspect of target's Motivation\naa: Inflict 1 strain on target (stress, embarrassment, anger)\naaa: Target believes a small lie or misleading statement\naaaa: Improve target's disposition (hostile \u2192 unfriendly \u2192 neutral \u2192 friendly)",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Threat (t) - Social",
        "text": "tt: Reveal important information accidentally\ntt: Target becomes suspicious or hostile\nttt: Social situation escalates negatively",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Triumph (x) - Social",
        "text": "x: Inflict Critical Remark (social Critical Injury, causes strain and status effect)\nx: Target becomes ally or provides major assistance",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Despair (y) - Social",
        "text": "y: Suffer Critical Remark yourself (target humiliates you)\ny: Target becomes permanently hostile or relationship is destroyed",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Advantage (a) - Exploration",
        "text": "a: Reduce time required by 25%\naa: Find additional clues or information\naa: Discover hidden passage, supply cache, or shortcut\naaa: Avoid triggering trap, hazard, or entity detection",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Threat (t) - Exploration",
        "text": "t: Increase time required by 25%\ntt: Attract unwanted attention (entity, wanderer, hazard)\nttt: Trigger trap or environmental hazard\nttt: Get lost or disoriented",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Triumph (x) - Exploration",
        "text": "x: Discover rare supply, powerful item, or safe exit\nx: Find critical information that solves mystery or problem",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Despair (y) - Exploration",
        "text": "y: Accidentally no-clip into dangerous Level\ny: Attract deadly entity or multiple entities\ny: Destroy clue or make situation worse",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Advantage (a) - Backrooms",
        "text": "aa: Find common supply (Almond Water, battery, ration)\naaa: Temporarily reduce Danger Level by 1 in current area\naaaa: Find rare supply or functioning equipment",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Threat (t) - Backrooms",
        "text": "tt: Increase Danger Level by 1 in current area (attract entity attention)\nttt: Trigger entity spawn or environmental hazard activation\ntttt: Accidentally damage or destroy valuable supply",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Triumph (x) - Backrooms",
        "text": "x: Find stable exit to safer Level\nx: Discover outpost, safe room, or allied wanderer group\nx: Recover 5 sanity from moment of clarity or hope",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Despair (y) - Backrooms",
        "text": "y: Accidentally trigger reality-warping event (sanity loss, no-clip, level shift)\ny: Attract multiple entities or boss-tier entity\ny: Equipment malfunctions catastrophically",
        "style": "normal"
      }
    ]
  },
  {
    "id": "starvation-dehydration",
    "category": "Survival",
    "title": "Starvation & Dehydration",
    "description": "Rules for tracking food and water needs in the Backrooms",
    "order": 3,
    "content": [
      {
        "type": "text",
        "heading": "Overview",
        "text": "Characters must eat and drink regularly to survive. The Backrooms' endless nature makes resource scarcity a constant threat.\n\nCharacters can survive:\n\u2022 3 days without water\n\u2022 30 days without food\n\nHowever, penalties begin much sooner.",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Water Requirements",
        "text": "Characters need 2 liters (roughly 2 bottles) of water per day under normal conditions.\n\nHot environments (Temperature 7+) double water needs.\nStrenuous activity increases water needs by 50%.",
        "style": "normal"
      },
      {
        "type": "table",
        "heading": "Dehydration Effects",
        "columns": [
          "Time Without Water",
          "Stage",
          "Effects"
        ],
        "rows": [
          {
            "col1": "0-12 hours",
            "col2": "Normal",
            "col3": "No effects"
          },
          {
            "col1": "12-24 hours",
            "col2": "Thirsty",
            "col3": "Add 1 Setback die to all checks"
          },
          {
            "col1": "24-48 hours",
            "col2": "Dehydrated",
            "col3": "Upgrade difficulty of all checks once. Suffer 1 Strain per hour."
          },
          {
            "col1": "48-72 hours",
            "col2": "Severe Dehydration",
            "col3": "Upgrade difficulty of all checks twice. Suffer 2 Strain per hour. Maximum 1 maneuver per turn."
          },
          {
            "col1": "72+ hours",
            "col2": "Critical",
            "col3": "Suffer 1 Wound per hour. When Wounds exceed Threshold, character dies."
          }
        ]
      },
      {
        "type": "text",
        "heading": "Food Requirements",
        "text": "Characters need 1 substantial meal (or 2-3 rations) per day.\n\nStrenuous activity or cold environments (Temperature 3 or lower) increase food needs by 50%.",
        "style": "normal"
      },
      {
        "type": "table",
        "heading": "Starvation Effects",
        "columns": [
          "Time Without Food",
          "Stage",
          "Effects"
        ],
        "rows": [
          {
            "col1": "0-24 hours",
            "col2": "Normal",
            "col3": "No effects"
          },
          {
            "col1": "1-3 days",
            "col2": "Hungry",
            "col3": "Add 1 Setback die to all checks"
          },
          {
            "col1": "3-7 days",
            "col2": "Starving",
            "col3": "Upgrade difficulty of physical checks once. Reduce Brawn by 1 (minimum 1)."
          },
          {
            "col1": "7-14 days",
            "col2": "Severe Starvation",
            "col3": "Upgrade difficulty of all checks once. Reduce Brawn and Agility by 1 each (minimum 1). Cannot recover Wounds naturally."
          },
          {
            "col1": "14-30 days",
            "col2": "Critical",
            "col3": "Upgrade difficulty of all checks twice. Reduce all Characteristics by 1 (minimum 1). Suffer 1 Wound per day."
          },
          {
            "col1": "30+ days",
            "col2": "Death",
            "col3": "Character dies without intervention."
          }
        ]
      },
      {
        "type": "text",
        "heading": "Recovering from Dehydration",
        "text": "Drinking sufficient water immediately removes Thirsty stage.\n\nDehydrated and worse stages require:\n\u2022 Drinking 3+ liters of water\n\u2022 4 hours of rest\n\u2022 Medicine check (Average) to stabilize if Severe or Critical",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Recovering from Starvation",
        "text": "Eating a meal removes Hungry stage after 1 hour.\n\nStarving and worse stages require:\n\u2022 Multiple meals over several days\n\u2022 8 hours rest per day\n\u2022 Characteristic penalties recover at 1 point per 3 days of proper nutrition",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Almond Water",
        "text": "Almond Water counts as both food and water, providing full nutrition. One bottle satisfies both daily requirements.",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Contaminated Water",
        "text": "Drinking unsafe water requires Resilience check:\n\u2022 Success: Water provides hydration normally\n\u2022 Failure: Suffer Poisoned status (1 Strain per hour for 1d6 hours)\n\u2022 Despair: Contract disease (GM discretion on effects)",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Spoiled Food",
        "text": "Eating spoiled food requires Resilience check:\n\u2022 Success: Food provides nutrition normally  \n\u2022 Failure: Suffer 2 Strain and Disoriented for 1d6 hours\n\u2022 Despair: Severe food poisoning (1 Wound + 2 Strain per hour for 1d6 hours)",
        "style": "normal"
      }
    ]
  },
  {
    "id": "rest-recovery",
    "category": "Survival",
    "title": "Rest & Recovery",
    "description": "How characters recover Wounds, Strain, and Sanity",
    "order": 4,
    "content": [
      {
        "type": "table",
        "heading": "Recovery per Hour of Rest",
        "columns": [
          "Rest Type",
          "Wounds",
          "Strain",
          "Sanity"
        ],
        "rows": [
          {
            "col1": "Normal Rest",
            "col2": "1 per hour",
            "col3": "10 per hour",
            "col4": "1 per hour"
          },
          {
            "col1": "Uncomfortable Rest",
            "col2": "1 per 2 hours",
            "col3": "10 per hour",
            "col4": "1 per hour"
          }
        ]
      },
      {
        "type": "text",
        "heading": "Milestone Bonuses",
        "text": "Consecutive rest provides additional bonuses at certain thresholds.",
        "style": "normal"
      },
      {
        "type": "table",
        "heading": "8-Hour Milestone (Full Rest)",
        "columns": [
          "Rest Type",
          "Bonus"
        ],
        "rows": [
          {
            "col1": "Normal Rest",
            "col2": "Clear ALL remaining Strain"
          },
          {
            "col1": "Uncomfortable Rest",
            "col2": "Clear HALF remaining Strain (round down)"
          }
        ]
      },
      {
        "type": "table",
        "heading": "16-Hour Milestone (Extended Rest)",
        "columns": [
          "Rest Type",
          "Bonus"
        ],
        "rows": [
          {
            "col1": "Normal Rest",
            "col2": "+5 Wounds bonus (21 total)"
          },
          {
            "col1": "Uncomfortable Rest",
            "col2": "+2 Wounds bonus (10 total)"
          }
        ]
      },
      {
        "type": "table",
        "heading": "24-Hour Milestone (Deep Rest)",
        "columns": [
          "Rest Type",
          "Bonus"
        ],
        "rows": [
          {
            "col1": "Normal Rest",
            "col2": "+10 Wounds bonus (34 total), may attempt to remove 1 Critical Injury (difficulty determined by injury), -1 Exhaustion"
          },
          {
            "col1": "Uncomfortable Rest",
            "col2": "+5 Wounds bonus (17 total), +5 Sanity bonus (29 total), -1 Exhaustion"
          }
        ]
      },
      {
        "type": "text",
        "heading": "Danger Level Rest Limits",
        "text": "Different danger levels restrict how long and how often you can rest.",
        "style": "normal"
      },
      {
        "type": "table",
        "heading": "Duration Limits (Maximum consecutive rest)",
        "columns": [
          "Danger Level",
          "Max Rest Duration",
          "Milestone Achievable"
        ],
        "rows": [
          {
            "col1": "0 (Safe Zones)",
            "col2": "Unlimited",
            "col3": "All milestones"
          },
          {
            "col1": "1-2 (Low)",
            "col2": "16 hours",
            "col3": "Up to 16-hour"
          },
          {
            "col1": "3-4 (Moderate)",
            "col2": "8 hours",
            "col3": "Up to 8-hour"
          },
          {
            "col1": "5-6 (High)",
            "col2": "4 hours",
            "col3": "None"
          },
          {
            "col1": "7+ (Extreme)",
            "col2": "1 hour",
            "col3": "None"
          }
        ]
      },
      {
        "type": "table",
        "heading": "Frequency Limits (Minimum time between rests)",
        "columns": [
          "Danger Level",
          "Min Time Between Rests"
        ],
        "rows": [
          {
            "col1": "0-2",
            "col2": "None (rest freely)"
          },
          {
            "col1": "3-4",
            "col2": "2 hours"
          },
          {
            "col1": "5-6",
            "col2": "4 hours"
          },
          {
            "col1": "7+",
            "col2": "8 hours"
          }
        ]
      },
      {
        "type": "text",
        "heading": "Interrupted Rest Mechanics",
        "text": "Resting beyond limits or too frequently risks encounters.",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Exceeding Duration Limit",
        "text": "Each hour rested BEYOND the danger level's limit:\n\u2022 20% cumulative chance of encounter per hour\n\u2022 Hour 5 over = guaranteed encounter (100%)\n\u2022 Recovery counts for ALL hours rested before encounter triggers",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Resting Too Frequently",
        "text": "Each 30 minutes rested EARLIER than allowed:\n\u2022 20% cumulative chance of encounter\n\u2022 2.5 hours early = guaranteed encounter (100%)\n\u2022 NO recovery gained if encounter triggers at rest start",
        "style": "normal"
      }
    ]
  },
  {
    "id": "sleep-deprivation",
    "category": "Survival",
    "title": "Sleep Deprivation",
    "description": "Rules for tracking sleep needs and the effects of going without rest",
    "order": 4,
    "content": [
      {
        "type": "text",
        "heading": "Overview",
        "text": "Characters need regular sleep to function. While the Rest & Recovery rules cover healing, this rule specifically addresses the cognitive and physical decline from lack of sleep itself.\n\nA full night's rest requires 6-8 hours of uninterrupted sleep (some talents can reduce this).",
        "style": "normal"
      },
      {
        "type": "table",
        "heading": "Effects of Sleep Deprivation",
        "columns": [
          "Time Awake",
          "Stage",
          "Effects"
        ],
        "rows": [
          {
            "col1": "0-16 hours",
            "col2": "Normal",
            "col3": "No effects"
          },
          {
            "col1": "16-24 hours",
            "col2": "Tired",
            "col3": "Add 1 Setback die to Vigilance and Perception checks"
          },
          {
            "col1": "24-36 hours",
            "col2": "Exhausted",
            "col3": "Add 1 Setback die to all checks. Increase difficulty of Vigilance and Perception by one."
          },
          {
            "col1": "36-48 hours",
            "col2": "Sleep Deprived",
            "col3": "Upgrade difficulty of all checks once. Suffer 1 Strain per hour. Micro-sleeps occur (see below)."
          },
          {
            "col1": "48-72 hours",
            "col2": "Severely Sleep Deprived",
            "col3": "Upgrade difficulty of all checks twice. Suffer 2 Strain per hour. Hallucinations begin (as 40-59% Sanity). Micro-sleeps increase."
          },
          {
            "col1": "72+ hours",
            "col2": "Critical",
            "col3": "Automatically fall asleep unless immediately threatened. If kept awake: Suffer 1 Wound per hour. Hallucinations worsen. Risk of permanent damage."
          }
        ]
      },
      {
        "type": "text",
        "heading": "Micro-Sleeps",
        "text": "At Sleep Deprived stage and beyond, characters experience involuntary micro-sleeps:\n\n**Sleep Deprived (36-48 hours):**\n\u2022 Once per hour, make Average Discipline check\n\u2022 Failure: Briefly lose awareness for 1d6 seconds\n\u2022 Despair: Fall unconscious for 1 minute\n\n**Severely Sleep Deprived (48-72 hours):**\n\u2022 Once per 30 minutes, make Hard Discipline check\n\u2022 Failure: Lose awareness for 1d6 \u00d7 10 seconds  \n\u2022 Despair: Fall unconscious for 1d6 minutes\n\n**Critical (72+ hours):**\n\u2022 Once per 10 minutes, make Daunting Discipline check\n\u2022 Failure: Fall unconscious for 1d6 \u00d7 10 minutes\n\u2022 Success: Still experience 1d6 seconds of micro-sleep\n\u2022 Cannot resist sleep if not in immediate danger",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Hallucinations from Sleep Deprivation",
        "text": "At Severely Sleep Deprived and Critical stages, characters experience hallucinations similar to low sanity:\n\n\u2022 Visual and auditory distortions\n\u2022 Difficulty distinguishing real from imagined threats\n\u2022 GM may introduce false information or phantom entities\n\u2022 Hard Discipline check required to verify reality\n\nThese hallucinations stack with any existing sanity-based hallucinations, making reality even harder to discern.",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Recovery from Sleep Deprivation",
        "text": "Sleep deprivation effects are removed by sleeping:\n\n**Tired:** 4+ hours of sleep removes all effects\n\n**Exhausted:** 6+ hours of sleep removes all effects\n\n**Sleep Deprived:** 8+ hours of sleep required. After waking, character is Tired for 4 hours.\n\n**Severely Sleep Deprived:** 10+ hours of sleep required. After waking, character is Exhausted for 8 hours.\n\n**Critical:** 12+ hours of sleep required. Medicine check (Hard) recommended. After waking, character is Sleep Deprived for 12 hours, then Exhausted for 8 hours.\n\nInterrupted sleep only counts if interruptions are less than 1 hour total.",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Stimulants",
        "text": "Coffee, energy drinks, or pills can temporarily suppress Tired and Exhausted effects for 4 hours.\n\nThey do NOT suppress Sleep Deprived or worse stages.\n\nWhen stimulants wear off, add 1 additional Setback die to all checks for 2 hours (\"crash\").",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Forced March",
        "text": "Characters attempting to push through severe sleep deprivation while traveling:\n\n\u2022 Sleep Deprived: Can continue with penalties listed\n\u2022 Severely Sleep Deprived: Every 2 hours, make Average Discipline check or collapse unconscious\n\u2022 Critical: Automatically collapse unless threatened. If threatened, make Hard Discipline check every 30 minutes or collapse.",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Dangerous Environments",
        "text": "In high-danger areas (Danger Level 7+), characters cannot safely sleep without:\n\u2022 Secure shelter (locked room, barricaded area)\n\u2022 Someone on watch\n\u2022 Entity deterrents active\n\nSleeping in unsafe conditions may result in entity encounters during sleep.",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Permanent Damage",
        "text": "Remaining at Critical sleep deprivation (72+ hours) for extended periods may cause permanent effects at GM discretion:\n\n\u2022 Reduce maximum Strain by 1-3 permanently\n\u2022 Permanent status effect (Paranoid, etc.)\n\u2022 Reduce Willpower by 1 (recoverable with weeks of proper rest)\n\nGM should warn players before implementing permanent consequences.",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Interaction with Exhaustion System",
        "text": "Sleep Deprivation is separate from the Exhaustion system but can stack:\n\n\u2022 Sleep Deprivation affects cognitive function (Vigilance, Perception, awareness)\n\u2022 Exhaustion affects physical function (Brawn, Agility, endurance)\n\u2022 A character can be both Sleep Deprived AND Exhausted simultaneously\n\u2022 Effects stack - a character who is both Sleep Deprived and Exhausted suffers both sets of penalties",
        "style": "normal"
      }
    ]
  },
  {
    "id": "exhaustion",
    "category": "Survival",
    "title": "Exhaustion System",
    "description": "Physical depletion from lack of food, water, or rest",
    "order": 5,
    "content": [
      {
        "type": "text",
        "heading": "Gaining Exhaustion",
        "text": "Exhaustion increases from lack of basic needs. All three sources track independently:",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Without Rest",
        "text": "+1 Exhaustion per 24 hours",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Without Food",
        "text": "+1 Exhaustion per 24 hours",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Without Water",
        "text": "+1 Exhaustion per 12 hours",
        "style": "normal"
      },
      {
        "type": "table",
        "heading": "Exhaustion Penalties",
        "columns": [
          "Exhaustion Level",
          "Effects"
        ],
        "rows": [
          {
            "col1": "0",
            "col2": "No penalties"
          },
          {
            "col1": "1-2",
            "col2": "Suffer 1 Setback die on all Brawn and Agility checks"
          },
          {
            "col1": "3-4",
            "col2": "Suffer 2 Setback dice on all Brawn and Agility checks"
          },
          {
            "col1": "5-6",
            "col2": "Suffer 2 Setback dice on all Brawn and Agility checks and reduce Strain Threshold by 2"
          },
          {
            "col1": "7-8",
            "col2": "Suffer 3 Setback dice on all Brawn and Agility checks and reduce Strain Threshold by 4"
          },
          {
            "col1": "9",
            "col2": "Suffer 3 Setback dice on all checks and reduce Strain Threshold by 6. In addition, whenever the character suffers Strain, they suffer 1 additional Strain."
          },
          {
            "col1": "10",
            "col2": "Character collapses and becomes Incapacitated until Exhaustion is reduced below 10"
          }
        ]
      },
      {
        "type": "text",
        "heading": "Exhaustion Recovery",
        "text": "Exhaustion is reduced by consuming food/water and resting:",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Consuming Food",
        "text": "Reduces Exhaustion as specified by the food item",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Consuming Water",
        "text": "Reduces Exhaustion as specified by the water item",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "24-Hour Rest Milestone",
        "text": "Reduces Exhaustion by 1 (both normal and uncomfortable)",
        "style": "normal"
      }
    ]
  },
  {
    "id": "durability-repair",
    "category": "Equipment",
    "title": "Durability & Repair System",
    "description": "How weapons and armor degrade and can be repaired",
    "order": 6,
    "content": [
      {
        "type": "list",
        "heading": "Items WITH Durability:",
        "items": [
          "Weapons (all melee and ranged)",
          "Armor (all worn protection)"
        ],
        "style": "bullet",
        "color": "default"
      },
      {
        "type": "list",
        "heading": "Items WITHOUT Durability:",
        "items": [
          "Mundane objects",
          "Anomalous objects (only break when effect specifies)"
        ],
        "style": "bullet",
        "color": "default"
      },
      {
        "type": "text",
        "heading": "Losing Durability",
        "text": "Durability loss is ALWAYS a choice to spend symbols, never automatic.",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Weapons",
        "text": "\u2022 Despair on your attack roll (if spent): Lose 1 Durability per Despair spent on item damage\n\u2022 Triumph rolled by enemy (if spent): Lose 1 Durability per Triumph spent on item damage",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Armor",
        "text": "\u2022 Triumph on enemy attack against you (if spent): Lose 1 Durability per Triumph spent on item damage\n\u2022 Despair you roll (if enemy spends it): Lose 1 Durability per Despair spent on item damage",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Durability Milestones",
        "text": "*Heavily Damaged state is skipped for Durability 3 items",
        "style": "normal"
      },
      {
        "type": "table",
        "heading": "For Durability 6+ Items",
        "columns": [
          "Durability %",
          "Condition",
          "Weapon Penalties",
          "Armor Penalties"
        ],
        "rows": [
          {
            "col1": "100-76%",
            "col2": "Perfect",
            "col3": "None",
            "col4": "None"
          },
          {
            "col1": "75-51%",
            "col2": "Worn",
            "col3": "-1 Damage",
            "col4": "-1 Soak"
          },
          {
            "col1": "50-26%",
            "col2": "Damaged",
            "col3": "-2 Damage, Critical +1",
            "col4": "-1 Soak, -1 Defense"
          },
          {
            "col1": "25-1%",
            "col2": "Heavily Damaged",
            "col3": "-3 Damage, Critical +2",
            "col4": "-2 Soak, -1 Defense"
          },
          {
            "col1": "0%",
            "col2": "Broken",
            "col3": "Unusable",
            "col4": "Unusable"
          }
        ]
      },
      {
        "type": "table",
        "heading": "For Durability 5 or Lower Items (Simplified)",
        "columns": [
          "Durability %",
          "Condition",
          "Weapon Penalties",
          "Armor Penalties"
        ],
        "rows": [
          {
            "col1": "100%",
            "col2": "Perfect",
            "col3": "None",
            "col4": "None"
          },
          {
            "col1": "67-99%",
            "col2": "Worn",
            "col3": "-1 Damage",
            "col4": "-1 Soak"
          },
          {
            "col1": "34-66%",
            "col2": "Damaged",
            "col3": "-2 Damage, Critical +1",
            "col4": "-1 Soak, -1 Defense"
          },
          {
            "col1": "1-33%",
            "col2": "Heavily Damaged*",
            "col3": "-3 Damage, Critical +2",
            "col4": "-2 Soak, -1 Defense"
          },
          {
            "col1": "0%",
            "col2": "Broken",
            "col3": "Unusable",
            "col4": "Unusable"
          }
        ]
      },
      {
        "type": "text",
        "heading": "Repair System",
        "text": "Items can be repaired using appropriate skills and materials.",
        "style": "normal"
      },
      {
        "type": "table",
        "heading": "General Repair Rules",
        "columns": [
          "Repair Stage",
          "Difficulty",
          "Time"
        ],
        "rows": [
          {
            "col1": "Worn \u2192 Perfect",
            "col2": "Easy",
            "col3": "30 minutes"
          },
          {
            "col1": "Damaged \u2192 Perfect",
            "col2": "Average",
            "col3": "1 hour"
          },
          {
            "col1": "Heavily Damaged \u2192 Perfect",
            "col2": "Hard",
            "col3": "2 hours"
          },
          {
            "col1": "Broken \u2192 Perfect",
            "col2": "Daunting",
            "col3": "4 hours"
          }
        ]
      },
      {
        "type": "text",
        "heading": "Repair Location",
        "text": "Can be done anywhere:\n\u2022 Appropriate tools: Add Boost dice\n\u2022 Missing tools: Add Setback dice\n\u2022 NPC crafters: Guaranteed success (may cost extra)",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Failed Repair",
        "text": "Materials are consumed and degrade:\n\u2022 Failed materials become lower-quality version\n\u2022 If it cannot become a lower tier, the material is lost",
        "style": "normal"
      }
    ]
  },
  {
    "id": "crafting-system",
    "category": "Equipment",
    "title": "Dynamic Crafting System",
    "description": "Create items with optional enhancements that increase difficulty",
    "order": 12,
    "content": [
      {
        "type": "text",
        "heading": "Recipe Structure",
        "text": "Each craftable item has:",
        "style": "normal"
      },
      {
        "type": "list",
        "heading": "",
        "items": [
          "Base Components (Required): Materials always consumed on attempt",
          "Enhancement Slots (0-3 Optional): Each requires material and upgrades difficulty",
          "Base Difficulty: Starting difficulty dice pool",
          "Yield: Number of items produced on success",
          "Crafting Skill: Metalworking, Leatherworking, Alchemy, Carpentry, or Cooking",
          "Crafting Time: Can be modified by Rush Job or Take Your Time"
        ],
        "style": "bullet",
        "color": "default"
      },
      {
        "type": "text",
        "heading": "Enhancement System",
        "text": "Each enhancement you add:\n1. Requires its specific material (consumed on attempt)\n2. Upgrades the difficulty once (purple \u2192 red)\n3. Grants its benefit to the final item (if successful)",
        "style": "normal"
      },
      {
        "type": "table",
        "heading": "Enhancement Examples (Base: Average difficulty)",
        "columns": [
          "Enhancements",
          "Difficulty Pool"
        ],
        "rows": [
          {
            "col1": "0 (Basic)",
            "col2": "2 purple"
          },
          {
            "col1": "+1 Enhancement",
            "col2": "1 purple, 1 red"
          },
          {
            "col1": "+2 Enhancements",
            "col2": "2 red"
          },
          {
            "col1": "+3 Enhancements",
            "col2": "2 red, 1 purple"
          }
        ]
      },
      {
        "type": "text",
        "heading": "Difficulty Upgrades",
        "text": "\u2022 Upgrade purple dice to red dice\n\u2022 If all dice are already red, add one purple die instead",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Material Consumption",
        "text": "CRITICAL RULE: All materials (base components AND enhancement materials) are consumed when you attempt to craft, regardless of success or failure.\n\nOn failure, materials may degrade to lower-quality versions.",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Step 1: Choose Enhancements",
        "text": "Decide which enhancements (0-3) to add and confirm you have all required materials",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Step 2: Calculate Difficulty",
        "text": "Start with recipe's base difficulty, upgrade once per enhancement, apply tool/location modifiers",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Step 3: Roll Crafting Check",
        "text": "Use recipe's specified skill and roll against final difficulty pool",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Step 4: Resolve Results",
        "text": "Success: Produce Yield items with all enhancements\nFailure: No items, materials consumed/degraded\nSpend symbols as desired",
        "style": "normal"
      },
      {
        "type": "table",
        "heading": "Advantage Options",
        "columns": [
          "Cost",
          "Effect"
        ],
        "rows": [
          {
            "col1": "2 Advantage",
            "col2": "Recovered Material: One base component returns to inventory (once per craft)"
          },
          {
            "col1": "3 Advantage",
            "col2": "Bonus Quality: Minor cosmetic/narrative bonus (once per craft)"
          },
          {
            "col1": "4 Advantage",
            "col2": "Free Enhancement: Add enhancement without difficulty increase, material consumed (once per craft)"
          },
          {
            "col1": "4 Advantage",
            "col2": "Extra Yield: Produce one additional item"
          }
        ]
      },
      {
        "type": "table",
        "heading": "Triumph Options",
        "columns": [
          "Cost",
          "Effect"
        ],
        "rows": [
          {
            "col1": "1 Triumph",
            "col2": "Master's Touch: Add enhancement without consuming material, difficulty still increases (once per craft)"
          },
          {
            "col1": "1 Triumph",
            "col2": "Efficient Craft: One base component returns to inventory (once per craft)"
          },
          {
            "col1": "2 Triumph",
            "col2": "Superior Quality: +1 to primary stat OR -1 Encumbrance OR 'Superior' tag (sells 150%) (once per craft)"
          },
          {
            "col1": "2 Triumph",
            "col2": "Bonus Yield: +50% more items (round up)"
          },
          {
            "col1": "2+ Triumph",
            "col2": "Legendary Creation: Unique version with special properties and memorable name (once per craft)"
          }
        ]
      },
      {
        "type": "table",
        "heading": "Threat Options",
        "columns": [
          "Cost",
          "Effect"
        ],
        "rows": [
          {
            "col1": "1 Threat",
            "col2": "Minor Setback: Cosmetic/narrative consequence (ugly, messy, etc.)"
          },
          {
            "col1": "2 Threat",
            "col2": "Time Delay: Crafting takes +50% longer"
          },
          {
            "col1": "3 Threat",
            "col2": "Reduced Yield: Produce one fewer item (minimum 1)"
          },
          {
            "col1": "4 Threat",
            "col2": "Wasted Materials: Consume one additional base component (if unavailable, no item produced)"
          }
        ]
      },
      {
        "type": "table",
        "heading": "Despair Options",
        "columns": [
          "Cost",
          "Effect"
        ],
        "rows": [
          {
            "col1": "1 Despair",
            "col2": "Enhancement Failure: One enhancement fails (difficulty/materials already committed, no benefit)"
          },
          {
            "col1": "1 Despair",
            "col2": "Inferior Quality: -1 to primary stat OR +1 Encumbrance OR starts Worn OR 'Inferior' tag (sells 50%)"
          },
          {
            "col1": "1 Despair",
            "col2": "Tool Breaks: One tool breaks. If no tool, recieve a critical injury of rating 26."
          },
          {
            "col1": "1 Despair",
            "col2": "Minor Injury: Crafter suffers Strain = half characteristic (round up), min 3. May be upgraded to Critical Injury"
          }
        ]
      },
      {
        "type": "text",
        "heading": "Rush Job (Voluntary)",
        "text": "Halve crafting time (round up):\n\u2022 Crafting time: \u00d70.5\n\u2022 Difficulty: Upgrade twice\n\u2022 If all dice are red, add purple dice equal to upgrades instead",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Take Your Time (Voluntary)",
        "text": "Double crafting time:\n\u2022 Crafting time: \u00d72\n\u2022 Choose ONE:\n  - Downgrade difficulty once (purple removed, or red \u2192 purple)\n  - Add 2 Boost dice",
        "style": "normal"
      },
      {
        "type": "list",
        "heading": "Appropriate Tools",
        "items": [
          "Each tool specifies Boost dice provided",
          "Example: 'Blacksmith's Hammer: Add 1 Boost to Metalworking checks'"
        ],
        "style": "bullet",
        "color": "default"
      },
      {
        "type": "list",
        "heading": "Inappropriate Location",
        "items": [
          "Crafting without proper workspace may add Setback dice",
          "Example: Crafting in dangerous area, no light, moving vehicle"
        ],
        "style": "bullet",
        "color": "default"
      },
      {
        "type": "list",
        "heading": "NPC Crafters",
        "items": [
          "Guaranteed success (no roll needed)",
          "May cost additional payment beyond materials"
        ],
        "style": "bullet",
        "color": "default"
      }
    ]
  },
  {
    "id": "cover-concealment",
    "category": "Entities & Combat",
    "title": "Cover & Concealment",
    "description": "Rules for using environmental protection and hiding during combat",
    "order": 4,
    "content": [
      {
        "type": "text",
        "heading": "Overview",
        "text": "Cover provides physical protection from attacks. Concealment hides you from view but doesn't stop bullets.\n\nUsing the environment tactically is crucial for survival in the Backrooms.",
        "style": "normal"
      },
      {
        "type": "table",
        "heading": "Cover Levels",
        "columns": [
          "Cover Type",
          "Protection",
          "Examples",
          "Effects"
        ],
        "rows": [
          {
            "col1": "No Cover",
            "col2": "None",
            "col3": "Standing in open",
            "col4": "No bonuses"
          },
          {
            "col1": "Partial Cover",
            "col2": "Limited",
            "col3": "Low wall, desk, doorframe",
            "col4": "+1 Ranged Defense, blocks 25% of body"
          },
          {
            "col1": "Half Cover",
            "col2": "Moderate",
            "col3": "Overturned table, thick pillar",
            "col4": "+2 Ranged Defense, blocks 50% of body"
          },
          {
            "col1": "Full Cover",
            "col2": "Substantial",
            "col3": "Wall, concrete barrier, vehicle",
            "col4": "+4 Ranged Defense, blocks 75%+ of body, cannot be targeted unless exposed"
          }
        ]
      },
      {
        "type": "text",
        "heading": "Taking Cover",
        "text": "**Maneuver:** Move to position behind cover object\n\n**Requirements:**\n\u2022 Must be at Engaged range with cover object\n\u2022 Cover must be between you and attacker\n\u2022 Must declare which direction you're protected from\n\n**Benefits persist** until you move away from cover or cover is destroyed.",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Attacking from Cover",
        "text": "While in cover, you can:\n\n**Stay Protected:**\n\u2022 Retain full cover benefits\n\u2022 Cannot attack (no line of sight)\n\u2022 Safe from incoming fire\n\n**Expose to Attack:**\n\u2022 Give up cover benefits for 1 turn\n\u2022 Make ranged attack normally\n\u2022 Enemies can target you normally this turn\n\n**Partial Exposure:**\n\u2022 Reduce cover by 1 level (Full \u2192 Half \u2192 Partial \u2192 None)\n\u2022 Make ranged attack with 1 Setback die\n\u2022 Retain reduced cover benefits",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Cover Degradation",
        "text": "Some cover can be destroyed by repeated fire:\n\n**Fragile Cover** (wood furniture, drywall):\n\u2022 3 hits: Reduces to next lower cover level\n\u2022 6 hits total: Cover destroyed\n\n**Standard Cover** (concrete, metal, thick furniture):\n\u2022 6 hits: Reduces to next lower cover level\n\u2022 12 hits total: Cover destroyed\n\n**Reinforced Cover** (reinforced concrete, armored vehicle):\n\u2022 Nearly indestructible under small arms fire\n\u2022 May be damaged by explosives or heavy weapons",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Concealment",
        "text": "Concealment hides you but doesn't stop bullets:\n\n**Sources:**\n\u2022 Darkness (Lighting 0-3)\n\u2022 Smoke/fog\n\u2022 Tall grass, bushes\n\u2022 Hanging sheets, curtains\n\n**Effects:**\n\u2022 Adds difficulty to Perception checks to spot you\n\u2022 Does NOT provide Ranged Defense\n\u2022 Bullets pass through concealment normally\n\u2022 Works best combined with Stealth",
        "style": "normal"
      },
      {
        "type": "table",
        "heading": "Concealment Effectiveness",
        "columns": [
          "Concealment",
          "Perception Penalty",
          "Examples"
        ],
        "rows": [
          {
            "col1": "Light",
            "col2": "+1 Difficulty",
            "col3": "Dim lighting, light fog, thin curtains"
          },
          {
            "col1": "Moderate",
            "col2": "+2 Difficulty",
            "col3": "Heavy fog, darkness, tall grass"
          },
          {
            "col1": "Heavy",
            "col2": "+3 Difficulty",
            "col3": "Pitch black, dense smoke, thick foliage"
          }
        ]
      },
      {
        "type": "text",
        "heading": "Blind Fire",
        "text": "Shooting at concealed target you can't clearly see:\n\n\u2022 Upgrade difficulty twice\n\u2022 Rely on last known position\n\u2022 Success still deals damage (bullets penetrate concealment)\n\u2022 Despair: Hit ally or innocent if present",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Suppressive Fire",
        "text": "**Action:** Spray area with automatic weapon fire\n\n**Effect:**\n\u2022 Choose 1 zone at Short-Medium range\n\u2022 All targets in zone make Fear check or gain Pinned status\n\u2022 **Pinned:** Cannot leave cover, add 2 Setback to attacks\n\u2022 Uses 10+ rounds of ammunition\n\u2022 Lasts until start of your next turn",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Advancing Under Fire",
        "text": "**Maneuver:** Sprint from one cover to another\n\n**Risk:**\n\u2022 Enemies can make attacks of opportunity (no action cost)\n\u2022 Add 2 Setback dice to enemy attacks (you're moving fast)\n\u2022 If hit, stop movement at current position",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Tactical Movement",
        "text": "**2 Maneuvers (suffer 2 Strain):** Careful advance using cover\n\n**Benefit:**\n\u2022 Move 1 range band\n\u2022 Stay low, minimize exposure\n\u2022 Enemies cannot make attacks of opportunity\n\u2022 Arrive at new cover position safely",
        "style": "normal"
      },
      {
        "type": "list",
        "heading": "Partial Cover:",
        "items": [
          "Office desk (flipped on side)",
          "Doorframe (lean around corner)",
          "Low cubicle walls",
          "Trash bins",
          "Wooden crates"
        ],
        "style": "bullet",
        "color": "default"
      },
      {
        "type": "list",
        "heading": "Half Cover:",
        "items": [
          "Filing cabinets",
          "Concrete pillars",
          "Overturned tables",
          "Car doors",
          "Thick pipes"
        ],
        "style": "bullet",
        "color": "default"
      },
      {
        "type": "list",
        "heading": "Full Cover:",
        "items": [
          "Concrete walls",
          "Solid metal doors",
          "Vehicle engine blocks",
          "Reinforced barricades",
          "Thick structural pillars"
        ],
        "style": "bullet",
        "color": "default"
      }
    ]
  },
  {
    "id": "entity-chase",
    "category": "Entities & Combat",
    "title": "Entity Chase System",
    "description": "Time-based pursuit mechanics for entities",
    "order": 7,
    "content": [
      {
        "type": "text",
        "heading": "Chase Mechanics Overview",
        "text": "Chases are tracked using TIME (minutes), not rooms. This prevents room size from affecting chase fairness.",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Entity Chase Stats",
        "text": "Each entity defines:",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Chase Speed",
        "text": "How fast the entity moves compared to players (1.5 means 50% faster than players)",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Chase Duration",
        "text": "How many minutes the entity will pursue before giving up",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Maximum Gap",
        "text": "How many rooms worth of distance before the entity loses track",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Starting a Chase",
        "text": "When an entity detects a player, calculate the starting conditions:",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Initial Time Gap",
        "text": "Starting Time Gap = Detection Distance (in rooms) \u00d7 Average Room Time (for this level)\n\nExample: If a Hound hears combat 2 rooms away on Level 0 (5 minutes per room average):\nStarting Time Gap = 2 \u00d7 5 = 10 minutes",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Maximum Time Gap",
        "text": "Maximum Time Gap = Entity's Maximum Gap (in rooms) \u00d7 Average Room Time (for this level)\n\nExample: If a Hound has a Maximum Gap of 4 rooms on Level 0 (5 minutes per room):\nMaximum Time Gap = 4 \u00d7 5 = 20 minutes\n\nIf the time gap ever exceeds this, the entity loses track of the players.",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Chase Progression",
        "text": "Every minute of game time, the time gap changes based on what the players are doing:",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "When Players Are Moving",
        "text": "Gap Closure Per Minute = Time Spent Moving \u00d7 (Entity's Chase Speed - 1.0)\n\nExample: Players spend 7 minutes crossing a room. A Hound with Chase Speed 1.5 pursues:\nGap Closure = 7 \u00d7 (1.5 - 1.0) = 7 \u00d7 0.5 = 3.5 minutes\n\nIf the gap was 10 minutes, it's now 6.5 minutes.",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "When Players Are Stationary",
        "text": "Gap Closure Per Minute = Time Spent Stationary \u00d7 Entity's Chase Speed\n\nExample: Players spend 5 minutes searching a room. A Hound with Chase Speed 1.5 pursues:\nGap Closure = 5 \u00d7 1.5 = 7.5 minutes\n\nIf the gap was 6.5 minutes, it's now -1 minute (the Hound catches them!)",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Entity Catches Player",
        "text": "The time gap reaches zero and combat begins",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Entity Loses Track",
        "text": "The time gap exceeds the maximum distance",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Entity Gives Up",
        "text": "The chase duration expires",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Player Hides Successfully",
        "text": "Stealth check succeeds when at least one room ahead",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Escape Methods",
        "text": "Players have multiple ways to escape pursuing entities:",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Hiding",
        "text": "Make a Stealth check when not within the same room as the Entity. Success ends the chase.",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Barricading",
        "text": "Spend time barricading a door behind you. This adds 10 to 30 minutes to the time gap, buying time to escape or hide.",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Distractions",
        "text": "Make a Deception check to throw an item or create noise in a different direction. Success redirects the entity and ends the chase.",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Environmental Hazards",
        "text": "Trigger traps, cause collapses, or start fires behind you. The entity must navigate around or through the hazard, potentially ending the chase.",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Safe Zones",
        "text": "Reach an outpost or protected area. Entities cannot enter these locations and automatically end pursuit.",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Changing Levels",
        "text": "Use a level exit to travel to a different level. Entities do not follow between levels.",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Combat Deterrent",
        "text": "Fight back and wound the entity significantly. Some entities will flee when severely injured.",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Bribery & Appeasement",
        "text": "Certain entities can be placated with offerings. This is highly entity-specific (e.g., throwing food to a Hound).",
        "style": "normal"
      }
    ]
  },
  {
    "id": "custom-skills",
    "category": "Character Creation",
    "title": "Custom Skills",
    "description": "Backrooms-specific skills beyond standard Genesys",
    "order": 9,
    "content": [
      {
        "type": "text",
        "heading": "Custom Skills List",
        "text": "Use standard Genesys skills (Mechanics, Knowledge (Education), Survival, Perception, etc.) for other tasks.",
        "style": "normal"
      },
      {
        "type": "table",
        "heading": "Backrooms Custom Skills (8 total)",
        "columns": [
          "Skill",
          "Characteristic",
          "Use"
        ],
        "rows": [
          {
            "col1": "Fear",
            "col2": "Willpower",
            "col3": "Resist sanity loss, fear checks, handle reality-warping effects"
          },
          {
            "col1": "Knowledge (Lore)",
            "col2": "Intellect",
            "col3": "Identify levels, entities, Backrooms phenomena, anomalous objects"
          },
          {
            "col1": "Scavenging",
            "col2": "Cunning",
            "col3": "Find useful items efficiently, identify valuable salvage, search thoroughly"
          },
          {
            "col1": "Metalworking",
            "col2": "Brawn",
            "col3": "Craft/repair metal armor, weapons, tools (Armorer, Blacksmith, Goldsmith)"
          },
          {
            "col1": "Leatherworking",
            "col2": "Agility",
            "col3": "Craft/repair leather armor, clothing, gear (Leatherworker, Weaver)"
          },
          {
            "col1": "Alchemy",
            "col2": "Intellect",
            "col3": "Craft potions, chemicals, medical compounds"
          },
          {
            "col1": "Carpentry",
            "col2": "Brawn",
            "col3": "Craft furniture, structures, wooden items"
          },
          {
            "col1": "Cooking",
            "col2": "Cunning",
            "col3": "Prepare food, preserve resources"
          }
        ]
      }
    ]
  },
  {
    "id": "character-creation",
    "category": "Character Creation",
    "title": "Character Creation System",
    "description": "Two approaches: Preset Archetypes or Custom Build",
    "order": 10,
    "content": [
      {
        "type": "text",
        "heading": "Preset Archetypes (110 XP start)",
        "text": "Quick and beginner-friendly character creation.",
        "style": "normal"
      },
      {
        "type": "table",
        "heading": "Available Archetypes",
        "columns": [
          "Archetype",
          "Starting Characteristics",
          "Special Ability"
        ],
        "rows": [
          {
            "col1": "Average Human",
            "col2": "All characteristics at 2",
            "col3": "Ready For Anything: Once per session, take a Story Point from GM pool"
          },
          {
            "col1": "Laborer",
            "col2": "Brawn 3, others at 2",
            "col3": "Tough As Nails: Once per session, reduce critical injury to weakest result"
          },
          {
            "col1": "Intellectual",
            "col2": "Intellect 3, others at 2",
            "col3": "Educated: Gain additional knowledge and mental capabilities"
          },
          {
            "col1": "Aristocrat",
            "col2": "Presence 3, others at 2",
            "col3": "Wealthy: Start with additional resources and connections"
          }
        ]
      },
      {
        "type": "text",
        "heading": "Custom Archetype (230 XP start)",
        "text": "Complete customization for experienced players.",
        "style": "normal"
      },
      {
        "type": "list",
        "heading": "",
        "items": [
          "Start with all characteristics at 1",
          "No archetype ability (unless purchased)",
          "Begin with 230 XP instead of 110 XP",
          "Can purchase up to 2 custom abilities for 5 XP each (player-created, DM-approved)"
        ],
        "style": "bullet",
        "color": "default"
      },
      {
        "type": "text",
        "heading": "Career Selection",
        "text": "Choose preset career or create custom skill set.",
        "style": "normal"
      },
      {
        "type": "table",
        "heading": "Preset Careers",
        "columns": [
          "Career",
          "Career Skills"
        ],
        "rows": [
          {
            "col1": "Explorer",
            "col2": "Survival, Athletics, Perception, Vigilance, Knowledge, Cool, Coordination, Medicine"
          },
          {
            "col1": "Researcher",
            "col2": "Knowledge, Computers, Medicine, Perception, Education, Cool, Vigilance, Investigation"
          },
          {
            "col1": "Survivor",
            "col2": "Survival, Athletics, Vigilance, Cool, Stealth, Streetwise, Brawl, Ranged"
          },
          {
            "col1": "Technician",
            "col2": "Computers, Mechanics, Knowledge, Perception, Cool, Investigation, Medicine, Education"
          }
        ]
      },
      {
        "type": "text",
        "heading": "Custom Career",
        "text": "\u2022 Choose any 8 skills as career skills\n\u2022 Either gain 2 ranks in 2 different skills\n\u2022 OR gain 1 rank in 4 different skills",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Spending Experience",
        "text": "Starting Experience: 110 XP (preset) or 230 XP (custom)",
        "style": "normal"
      },
      {
        "type": "table",
        "heading": "Characteristic Costs (Creation Only)",
        "columns": [
          "Upgrade",
          "XP Cost"
        ],
        "rows": [
          {
            "col1": "Rank 1 \u2192 2",
            "col2": "20 XP"
          },
          {
            "col1": "Rank 2 \u2192 3",
            "col2": "30 XP"
          },
          {
            "col1": "Rank 3 \u2192 4",
            "col2": "40 XP"
          },
          {
            "col1": "Rank 4 \u2192 5",
            "col2": "50 XP"
          }
        ]
      },
      {
        "type": "table",
        "heading": "Skill Costs",
        "columns": [
          "Skill Type",
          "XP Cost"
        ],
        "rows": [
          {
            "col1": "Career Skills",
            "col2": "5 \u00d7 new rank"
          },
          {
            "col1": "Non-Career Skills",
            "col2": "(5 \u00d7 new rank) + 5"
          }
        ]
      },
      {
        "type": "text",
        "heading": "Important Rules",
        "text": "\u2022 Characteristics can ONLY be increased during character creation\n\u2022 After creation, characteristics are locked (except via specific talents)\n\u2022 Maximum characteristic rank: 5\n\u2022 Maximum skill rank during creation: 2",
        "style": "normal"
      },
      {
        "type": "list",
        "heading": "",
        "items": [
          "Wound Threshold: 10 + Brawn",
          "Strain Threshold: 10 + Willpower",
          "Defense: 0 (modified by armor)",
          "Soak: Brawn value",
          "Encumbrance: 5 + Brawn"
        ],
        "style": "bullet",
        "color": "default"
      }
    ]
  },
  {
    "id": "xp-progression",
    "category": "Character Creation",
    "title": "XP & Progression",
    "description": "How characters earn and spend experience points",
    "order": 11,
    "content": [
      {
        "type": "text",
        "heading": "Earning XP",
        "text": "Characters gain XP from multiple sources:",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Per Session",
        "text": "10 XP (default)",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Quests",
        "text": "Variable XP based on difficulty",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Milestones",
        "text": "Variable XP for major achievements",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "XP Pace Guidelines",
        "text": "GMs can adjust session XP based on campaign style:",
        "style": "normal"
      },
      {
        "type": "table",
        "heading": "Progression Rates",
        "columns": [
          "Pace",
          "XP per Session",
          "Best For"
        ],
        "rows": [
          {
            "col1": "Slow",
            "col2": "5-8 XP",
            "col3": "Gritty, long campaigns"
          },
          {
            "col1": "Standard",
            "col2": "10 XP",
            "col3": "Default Genesys rate"
          },
          {
            "col1": "Fast",
            "col2": "15-20 XP",
            "col3": "Shorter campaigns, quick advancement"
          }
        ]
      },
      {
        "type": "text",
        "heading": "Spending XP",
        "text": "Post-creation XP can be spent on:",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Skills",
        "text": "Career skills cost (5 \u00d7 new rank), non-career cost ((5 \u00d7 new rank) + 5)",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Talents",
        "text": "Per talent tree requirements",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Custom Talents & Perks",
        "text": "To be added later",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Characteristics",
        "text": "Cannot be purchased after creation (locked)",
        "style": "normal"
      }
    ]
  },
  {
    "id": "sound-rules",
    "category": "Environmental",
    "title": "Sound System",
    "description": "Environmental sound mechanics affecting stealth, perception, and communication",
    "order": 4,
    "content": [
      {
        "type": "text",
        "heading": "Overview",
        "text": "Sound levels in the environment affect stealth, perception, and communication. The sound scale ranges from 0 (complete silence) to 10 (deafening noise).\n\nSound is measured in decibels (dB) and converted to tiers for gameplay purposes. Environmental objects and phenomena can modify the ambient sound level.",
        "style": "normal"
      },
      {
        "type": "table",
        "heading": "Sound Tiers (0-10 with Decibel Ranges)",
        "columns": [
          "Tier",
          "Decibels",
          "Condition",
          "Mechanical Effects"
        ],
        "rows": [
          {
            "col1": "0",
            "col2": "0-10 dB",
            "col3": "Complete Silence",
            "col4": "Sound-based Perception: Upgrade once / Sound-based Stealth: Upgrade difficulty once / After 1 hour: Add 1 Setback die to all checks"
          },
          {
            "col1": "1-2",
            "col2": "11-30 dB",
            "col3": "Near Silence",
            "col4": "Sound-based Perception: Add 1 Boost die / Sound-based Stealth: Add 1 Setback die"
          },
          {
            "col1": "3-4",
            "col2": "31-50 dB",
            "col3": "Quiet",
            "col4": "No effect"
          },
          {
            "col1": "5-6",
            "col2": "51-70 dB",
            "col3": "Moderate",
            "col4": "Sound-based Perception: Add 1 Setback die / Sound-based Stealth: Add 1 Boost die"
          },
          {
            "col1": "7-8",
            "col2": "71-90 dB",
            "col3": "Loud",
            "col4": "Sound-based Perception: Add 2 Setback dice / Sound-based Stealth: Add 2 Boost dice / Must shout to communicate beyond 9 meters (Short range)"
          },
          {
            "col1": "9-10",
            "col2": "91+ dB",
            "col3": "Deafening",
            "col4": "Sound-based Perception: Upgrade difficulty twice / Sound-based Stealth: Add 3 Boost dice / Communication impossible without line of sight / Every 10 minutes: Resilience check or suffer 1 Strain"
          }
        ]
      },
      {
        "type": "text",
        "heading": "Stealth and Sound",
        "text": "Sound-based stealth checks occur when trying to move quietly:\n\n\u2022 Quiet environments make every sound obvious (penalties to stealth)\n\u2022 Loud environments mask footsteps and movement (bonuses to stealth)\n\u2022 Characters can use environmental noise to cover their approach\n\nExample: Sneaking through machinery room (Tier 7) gives +2 Boost dice to Stealth checks.",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Perception and Sound",
        "text": "Sound-based Perception checks occur when trying to hear things:\n\n\u2022 Quiet environments make sounds easier to detect (bonuses to perception)\n\u2022 Loud environments drown out subtle sounds (penalties to perception)\n\u2022 Used to hear approaching entities, conversations, or environmental clues\n\nExample: Trying to hear footsteps in deafening factory (Tier 10) upgrades difficulty twice.",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Communication",
        "text": "Speaking with allies requires appropriate volume:\n\n\u2022 Quiet environments: Whispers carry normally\n\u2022 Moderate environments: Normal conversation works\n\u2022 Loud environments (7-8): Must shout beyond Short range (9m)\n\u2022 Deafening environments (9-10): Line of sight required, hand signals or written notes\n\nCharacters separated by walls or distance may be unable to communicate in loud areas.",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Stacking Rules",
        "text": "Sound sources are ADDITIVE:\n\n\u2022 All decibel values in a room add together\n\u2022 Convert final total to nearest tier\n\u2022 Example: Base 45 dB + Fluorescent light 20 dB + Machinery 60 dB = 125 dB = Tier 10 (Deafening)\n\n**Multiple of Same Source:**\n\u2022 Each identical source adds its full dB value\n\u2022 Example: 3 fluorescent lights = 20 + 20 + 20 = 60 dB total contribution",
        "style": "normal"
      },
      {
        "type": "list",
        "heading": "Quiet Sources (10-30 dB):",
        "items": [
          "Dripping water",
          "Soft fluorescent hum",
          "Distant footsteps",
          "Faint wind through vents",
          "Quiet electronic devices"
        ],
        "style": "bullet",
        "color": "default"
      },
      {
        "type": "list",
        "heading": "Moderate Sources (31-70 dB):",
        "items": [
          "Normal conversation",
          "Running water from pipe",
          "Buzzing fluorescent lights (multiple)",
          "Crackling fire",
          "Background HVAC system"
        ],
        "style": "bullet",
        "color": "default"
      },
      {
        "type": "list",
        "heading": "Loud Sources (71-90 dB):",
        "items": [
          "Heavy machinery",
          "Loud music/alarms",
          "Power tools",
          "Shouting",
          "Small explosions"
        ],
        "style": "bullet",
        "color": "default"
      },
      {
        "type": "list",
        "heading": "Deafening Sources (91+ dB):",
        "items": [
          "Industrial equipment",
          "Jet engines",
          "Explosions nearby",
          "Gunfire",
          "Massive machinery"
        ],
        "style": "bullet",
        "color": "default"
      },
      {
        "type": "text",
        "heading": "Creating Distractions",
        "text": "Characters can intentionally make noise to distract entities:\n\n\u2022 Throw object to create sound at distance\n\u2022 Activate alarm or machinery\n\u2022 Shout to draw attention\n\nEntities investigate loud unexpected sounds (GM discretion on effectiveness).",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Silencing Equipment",
        "text": "Characters can reduce sound they make:\n\n\u2022 Remove jingling keys/items (reduces personal noise by 10 dB)\n\u2022 Tape down loose gear (reduces noise by 5 dB)\n\u2022 Move slowly and deliberately (add 1 Boost to Stealth checks)\n\u2022 Use silenced weapons (gunshot reduced from 140 dB to 110 dB)",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Listening for Danger",
        "text": "In quiet environments, characters can hear approaching threats:\n\n\u2022 Make Perception check to detect entities moving nearby\n\u2022 Success: Hear entity 1 range band before visual contact\n\u2022 Advantage: Determine direction and approximate distance\n\u2022 Triumph: Identify entity type by sound (footsteps pattern, vocalizations)\n\nLoud environments negate this advantage.",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Long-Term Exposure",
        "text": "Extended exposure to loud sounds causes fatigue:\n\n**Tier 7-8 (Loud):**\n\u2022 After 8 hours: Make Resilience check or suffer 2 Strain\n\u2022 Check every 8 hours afterward\n\n**Tier 9-10 (Deafening):**\n\u2022 After 1 hour: Make Resilience check or suffer 2 Strain\n\u2022 Check every 10 minutes afterward\n\u2022 After 8 hours: Risk of permanent hearing damage (Resilience check, failure = -1 Setback die to all Perception checks permanently)",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Protection from Loud Noise",
        "text": "Ear protection reduces effective sound tier:\n\n**Foam Earplugs:**\n\u2022 Reduce effective tier by 1-2 (still hear somewhat)\n\u2022 Cannot communicate verbally while wearing\n\u2022 Cheap and available (rarity 0-1)\n\n**Industrial Ear Muffs:**\n\u2022 Reduce effective tier by 3 (heavy protection)\n\u2022 Nearly deaf to everything while wearing\n\u2022 Uncommon (rarity 2-3)\n\n**Electronic Ear Protection:**\n\u2022 Reduce loud sounds while amplifying quiet sounds\n\u2022 Reduce tier by 3 for sounds above Tier 6\n\u2022 Preserve ability to hear conversations\n\u2022 Rare (rarity 4-5), requires batteries",
        "style": "normal"
      }
    ]
  },
  {
    "id": "smell-rules",
    "category": "Environmental",
    "title": "Smell System",
    "description": "Environmental smell mechanics affecting tracking, health, and mental focus",
    "order": 5,
    "content": [
      {
        "type": "text",
        "heading": "Overview",
        "text": "Smell intensity in the environment affects tracking ability, health, and mental focus. The smell scale ranges from 0 (no smell) to 10 (overwhelming odor).\n\nSmells also have quality types that determine their effects: Neutral, Pleasant, Unpleasant, or Dangerous.",
        "style": "normal"
      },
      {
        "type": "table",
        "heading": "Smell Tiers (0-10)",
        "columns": [
          "Tier",
          "Condition",
          "Mechanical Effects"
        ],
        "rows": [
          {
            "col1": "0",
            "col2": "No Smell",
            "col3": "Unsettling - after 30 minutes: Add 1 Setback die to Vigilance checks"
          },
          {
            "col1": "1-2",
            "col2": "Faint",
            "col3": "Smell-based Perception: Add 2 Setback dice to identify specific smell"
          },
          {
            "col1": "3-4",
            "col2": "Mild",
            "col3": "No effect"
          },
          {
            "col1": "5-6",
            "col2": "Moderate",
            "col3": "Smell-based tracking: Add 1 Boost die / If Unpleasant/Dangerous: Add 1 Setback die to Focus/Concentration checks"
          },
          {
            "col1": "7-8",
            "col2": "Strong",
            "col3": "Smell-based tracking: Add 2 Boost dice (overpowering smell) + 2 Setback dice (other smells) / If Unpleasant: Resilience check every 10 min or 1 Strain / If Dangerous: Resilience check every 10 min or 2 Strain + 1 Wound"
          },
          {
            "col1": "9-10",
            "col2": "Overwhelming",
            "col3": "Impossible to detect other smells / If Unpleasant: Resilience check every 5 min or 2 Strain / If Dangerous: Resilience check every 5 min or 2 Strain + 2 Wounds / All mental/social checks: Add 2 Setback dice / After 30 min in Dangerous: Upgrade difficulty once on all checks"
          }
        ]
      },
      {
        "type": "text",
        "heading": "Neutral",
        "text": "Normal environmental smells with no special effects:\n\n\u2022 Paper, carpet, concrete, metal, dust\n\u2022 Musty air, old buildings\n\u2022 General staleness\n\nNo additional effects beyond intensity tier.",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Pleasant",
        "text": "Appealing or food-related smells:\n\n\u2022 Fresh air, flowers, perfume\n\u2022 Cooking food, baked goods\n\u2022 Clean laundry, soap\n\n**Effect at Tier 5+:** Remove 1 Setback die from social checks (improves morale)",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Unpleasant",
        "text": "Decay, waste, or biological smells:\n\n\u2022 Rot, sewage, mold\n\u2022 Body odor, stagnant water\n\u2022 Garbage, decay\n\n**Effects:** Triggers negative mechanical effects at Tier 5+ (see table above)",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Dangerous",
        "text": "Toxic, chemical, or harmful smells:\n\n\u2022 Gas leaks (natural gas, propane)\n\u2022 Chemical spills, industrial solvents\n\u2022 Smoke, burning materials\n\u2022 Toxic fumes\n\n**Effects:** Triggers damage at Tier 7+ (see table above)\n**Warning:** Should prompt immediate investigation or evacuation",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Stacking Rules",
        "text": "Smell sources DO NOT stack additively:\n\n**Intensity:** Use HIGHEST tier present\n\u2022 Multiple smell sources in room \u2192 room takes intensity of strongest smell\n\u2022 Example: Tier 2 musty air + Tier 4 trash + Tier 6 chemical = Room is Tier 6\n\n**Quality:** Use most dangerous quality present\n\u2022 Priority: Dangerous > Unpleasant > Pleasant > Neutral\n\u2022 Example: Tier 4 Pleasant (flowers) + Tier 6 Dangerous (gas leak) = Room is Tier 6 Dangerous\n\nThis prevents smell stacking from becoming absurd.",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Tracking by Smell",
        "text": "Characters can follow strong smells:\n\n\u2022 Tier 5-6: Add 1 Boost die to track the source\n\u2022 Tier 7-8: Add 2 Boost dice to track the overpowering smell\n\u2022 Tier 9-10: Can track smell without any check (follow your nose)\n\n**BUT:** Strong smells mask weaker scents\n\u2022 At Tier 7-8: Add 2 Setback dice to detect OTHER smells\n\u2022 At Tier 9-10: Impossible to detect other smells\n\nUseful for following gas leaks, finding food sources, or avoiding decay.",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Health Effects",
        "text": "Unpleasant and Dangerous smells cause physical discomfort:\n\n**Unpleasant Smells (Tier 5+):**\n\u2022 Nausea and discomfort\n\u2022 Difficulty concentrating\n\u2022 Morale impact\n\n**Dangerous Smells (Tier 7+):**\n\u2022 Actual toxic exposure\n\u2022 Strain AND Wound damage\n\u2022 Potential long-term health effects\n\u2022 Requires protective equipment or evacuation",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Mental Focus",
        "text": "Strong smells distract from mental tasks:\n\n\u2022 Tier 5-6 Unpleasant/Dangerous: +1 Setback to mental checks\n\u2022 Tier 9-10: +2 Setback to all mental/social checks\n\nAffects: Computer use, Research, Negotiation, Deception, Investigation",
        "style": "normal"
      },
      {
        "type": "list",
        "heading": "Neutral Smells:",
        "items": [
          "Tier 2-3: Musty air, old carpet, concrete dust",
          "Tier 4-5: Stale office smell, mildew, damp walls"
        ],
        "style": "bullet",
        "color": "default"
      },
      {
        "type": "list",
        "heading": "Pleasant Smells:",
        "items": [
          "Tier 3-4: Fresh air, faint flowers",
          "Tier 5-6: Cooking food, baked goods, perfume"
        ],
        "style": "bullet",
        "color": "default"
      },
      {
        "type": "list",
        "heading": "Unpleasant Smells:",
        "items": [
          "Tier 3-4: Mild mold, stale water, body odor",
          "Tier 5-6: Strong garbage, sewage, decay",
          "Tier 7-8: Rotting corpse, open sewer, putrid waste",
          "Tier 9-10: Overwhelming decay, massive sewage breach"
        ],
        "style": "bullet",
        "color": "default"
      },
      {
        "type": "list",
        "heading": "Dangerous Smells:",
        "items": [
          "Tier 5-6: Faint gas leak, mild chemical odor, light smoke",
          "Tier 7-8: Strong gas leak, chemical spill, heavy smoke",
          "Tier 9-10: Concentrated toxic fumes, industrial chemical release"
        ],
        "style": "bullet",
        "color": "default"
      },
      {
        "type": "text",
        "heading": "Improvised Protection",
        "text": "Covering nose and mouth with cloth:\n\n\u2022 Reduces Unpleasant smell tier by 1\n\u2022 Reduces Dangerous smell tier by 1 (minimal protection)\n\u2022 Does NOT prevent toxic exposure at high tiers\n\u2022 Free/improvised",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Respirator Mask",
        "text": "Half-face respirator with filters:\n\n\u2022 Reduces Dangerous smell tier by 3\n\u2022 Protects against most chemical fumes and toxic gases\n\u2022 Requires appropriate filter cartridge for hazard type\n\u2022 Filters have limited duration (4-8 hours active use)\n\u2022 Rarity 3-4",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Gas Mask",
        "text": "Full-face gas mask with filters:\n\n\u2022 Reduces Dangerous smell tier by 5 (near-complete protection)\n\u2022 Protects against severe toxic environments\n\u2022 Requires filter cartridge (multiple types available)\n\u2022 Filters last 4-8 hours depending on hazard severity\n\u2022 Also protects eyes from irritants\n\u2022 Rarity 4-5\n\n**Note:** Filters eventually saturate and must be replaced",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Scent Blocking",
        "text": "To hide YOUR smell from entities that track by scent:\n\n\u2022 Cover yourself in strong-smelling substance (mud, chemicals)\n\u2022 Upgrade difficulty of entity's tracking checks once\n\u2022 Duration: 1-4 hours depending on substance\n\u2022 May replace your scent with different smell (attracts different entities)",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Identifying Smells",
        "text": "Recognizing what a smell indicates:\n\n**Familiar Smells:**\n\u2022 Common scents (rot, gas, food): Automatic recognition\n\u2022 No check needed\n\n**Unusual Smells:**\n\u2022 Survival or Perception check to identify\n\u2022 Difficulty based on obscurity\n\u2022 Success: Identify source and potential danger\n\n**Chemical Smells:**\n\u2022 Knowledge (Science) or similar check\n\u2022 Identify specific chemical or hazard level\n\u2022 Failure: Might misidentify as safe when dangerous",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Smell Memory and Triggers",
        "text": "Smells can trigger memories or associations:\n\n**Familiar Smell from Earth:**\n\u2022 Character encounters smell from before Backrooms\n\u2022 May trigger emotional response\n\u2022 GM can require Discipline check to avoid distraction\n\u2022 Can be positive (comfort) or negative (trauma reminder)\n\n**Entity Scent:**\n\u2022 Some entities have distinctive smells\n\u2022 Characters who survived encounter remember the smell\n\u2022 Smelling it again: Automatic Fear check\n\u2022 Advantage: Recognize entity type before visual contact",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Long-Term Exposure",
        "text": "Extended time in strong smells:\n\n**Olfactory Fatigue (Tier 7+):**\n\u2022 After 30 minutes: Smell seems less intense (reduce perceived tier by 2)\n\u2022 Character acclimates to the smell\n\u2022 Mechanical effects still apply (toxic damage continues)\n\u2022 DANGER: May not realize smell is still dangerous\n\n**Recovery:**\n\u2022 After leaving smelly area: 15 minutes for nose to reset\n\u2022 Can smell normally again\n\u2022 May re-experience full intensity if returning",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Warning Signs",
        "text": "Smells can warn of danger:\n\n\u2022 Gas leaks: Smell before explosion risk\n\u2022 Decay: Dead body or entity nest ahead\n\u2022 Smoke: Fire hazard approaching\n\u2022 Chemical: Hazardous area ahead\n\n**Smart survivors pay attention to smell as early warning system.**",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Finding Resources",
        "text": "Following pleasant smells:\n\n\u2022 Food smell: May lead to kitchen, pantry, or outpost\n\u2022 Fresh air: May indicate exit or outdoor area\n\u2022 Water smell: May lead to clean water source\n\n**Risk:** Could also be trap or entity lure",
        "style": "normal"
      }
    ]
  },
  {
    "id": "lighting-rules",
    "category": "Environmental",
    "title": "Lighting Rules (0-10 Scale)",
    "description": "How lighting levels affect visibility, combat, and stealth",
    "order": 11,
    "content": [
      {
        "type": "text",
        "heading": "Overview",
        "text": "Lighting affects visibility, combat effectiveness, and stealth. The Backrooms often have unpredictable or impossible lighting conditions.",
        "style": "normal"
      },
      {
        "type": "table",
        "heading": "Lighting Levels (0-10)",
        "columns": [
          "Level",
          "Condition",
          "Effects"
        ],
        "rows": [
          {
            "col1": "10",
            "col2": "Blinding",
            "col3": "Automatic failure on all sight-based checks. Treat as blind."
          },
          {
            "col1": "9",
            "col2": "Harsh Light",
            "col3": "+1 Setback to Perception, Vigilance, Medicine, Mechanics (squinting, glare)"
          },
          {
            "col1": "7-8",
            "col2": "Bright Light",
            "col3": "No penalties. Comfortable visibility."
          },
          {
            "col1": "5-6",
            "col2": "Dim Light",
            "col3": "+1 Setback to Perception, Vigilance, Ranged. +1 Boost to Stealth."
          },
          {
            "col1": "3-4",
            "col2": "Darkness",
            "col3": "+2 Setback to Perception, Vigilance, Ranged. +1 Setback to Melee, Coordination, Operating. +2 Boost to Stealth."
          },
          {
            "col1": "2",
            "col2": "Deep Darkness",
            "col3": "+3 Setback to all Perception, Vigilance, Combat. +1 Setback to Medicine, Mechanics. +2 Setback to Coordination, Operating. +3 Boost to Stealth."
          },
          {
            "col1": "0-1",
            "col2": "Pitch Black",
            "col3": "Blinded (3 Setback to sight checks). Movement requires checks. Computer/Hacking exempt (screens provide light)."
          }
        ]
      },
      {
        "type": "text",
        "heading": "DM Guidance",
        "text": "Combat Areas: Default to Dim Light (5-6) unless otherwise specified.\n\nExploration Areas: Varies widely. Use Darkness (3-4) for suspense.\n\nSafe Zones: Usually Bright Light (7-8).\n\nBackrooms Hazards: Many Levels have impossible lighting (flickering, sourceless, reality-warping).",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Sudden Light Changes",
        "text": "When lighting suddenly changes by 3+ levels (flash grenade, power outage, entity ability), characters must make an Average (dd) Resilience check:\n\nSuccess: No effect\nFailure: Disoriented for 1 round\nFailure + Threat: Also suffer 2 strain from shock",
        "style": "normal"
      }
    ]
  },
  {
    "id": "temperature-rules",
    "category": "Environmental",
    "title": "Temperature Rules (0-10 Scale)",
    "description": "How temperature extremes affect characters and survival",
    "order": 12,
    "content": [
      {
        "type": "text",
        "heading": "Overview",
        "text": "Temperature extremes cause wounds, status effects, and prevent comfortable rest. Many Backrooms Levels have impossible or deadly temperatures.",
        "style": "normal"
      },
      {
        "type": "table",
        "heading": "Temperature Levels (0-10)",
        "columns": [
          "Level",
          "Range",
          "Condition",
          "Effects"
        ],
        "rows": [
          {
            "col1": "10",
            "col2": "60\u00b0C+ / 140\u00b0F+",
            "col3": "Extreme Heat",
            "col4": "3 Setback (physical). 2 wounds/hour. Heat Stroke after 1hr. No comfortable rest."
          },
          {
            "col1": "9",
            "col2": "50-59\u00b0C / 122-139\u00b0F",
            "col3": "Severe Heat",
            "col4": "3 Setback (physical). 1 wound/hour. Heat Stroke after 2hr. No comfortable rest."
          },
          {
            "col1": "8",
            "col2": "40-49\u00b0C / 104-121\u00b0F",
            "col3": "Intense Heat",
            "col4": "2 Setback (Brawn), 1 Setback (Agility). 1 wound per 2hr."
          },
          {
            "col1": "7",
            "col2": "32-39\u00b0C / 90-103\u00b0F",
            "col3": "Hot",
            "col4": "1 Setback to Brawn/Resilience."
          },
          {
            "col1": "6",
            "col2": "26-31\u00b0C / 79-89\u00b0F",
            "col3": "Warm",
            "col4": "1 Setback to Brawn/Resilience during strenuous activity."
          },
          {
            "col1": "5",
            "col2": "18-25\u00b0C / 65-78\u00b0F",
            "col3": "Comfortable",
            "col4": "No penalties."
          },
          {
            "col1": "4",
            "col2": "10-17\u00b0C / 50-64\u00b0F",
            "col3": "Cool",
            "col4": "1 Setback to Agility (fine motor tasks)."
          },
          {
            "col1": "3",
            "col2": "0-9\u00b0C / 32-49\u00b0F",
            "col3": "Cold",
            "col4": "2 Setback (Agility), 1 Setback (Brawn). 1 wound/hour without clothing."
          },
          {
            "col1": "2",
            "col2": "-10 to -1\u00b0C / 14-31\u00b0F",
            "col3": "Freezing",
            "col4": "3 Setback (physical). 2 wounds/hour without clothing. Hypothermia after 2hr. No comfortable rest."
          },
          {
            "col1": "1",
            "col2": "-20 to -11\u00b0C / -4-12\u00b0F",
            "col3": "Severe Cold",
            "col4": "3 Setback (physical). Upgrade Agility once. 3 wounds/hour. Hypothermia after 1hr. No comfortable rest."
          },
          {
            "col1": "0",
            "col2": "-21\u00b0C+ / -5\u00b0F+",
            "col3": "Extreme Cold",
            "col4": "3 Setback (physical). Upgrade Agility once. 4 wounds/hour even with gear. Hypothermia after 30min. No comfortable rest."
          }
        ]
      },
      {
        "type": "text",
        "heading": "Heat Stroke",
        "text": "Effects: Upgrade all physical checks once. Suffer 2 strain/turn. Disoriented.\n\nDuration: Until cured with Medicine check + 1hr in Comfortable temperature.",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Hypothermia",
        "text": "Effects: Upgrade all physical checks once. Suffer 1 strain/turn. Max 1 maneuver/turn.\n\nDuration: Until cured with Medicine check + 1hr in Comfortable temperature.",
        "style": "normal"
      }
    ]
  },
  {
    "id": "atmospheric-hazards",
    "category": "Environmental",
    "title": "Atmospheric Hazards (Variant System)",
    "description": "Environmental hazards with multiple severity levels",
    "order": 13,
    "content": [
      {
        "type": "text",
        "heading": "System Overview",
        "text": "10 hazard types, each with BASE effect + 4 severity variants (Deadly, Severe, Harmful, Irritating). Levels may combine multiple hazards.",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "1. Low Oxygen / Thin Air",
        "text": "BASE: 1 Setback to Brawn/Agility. 1 wound per 6hr. No comfortable rest.\n\nDeadly (Vacuum): Hold breath for Brawn rounds, then 3 strain/round. Critical Injury when incapacitated.\n\nSevere: 2 Setback. 1 wound per 2hr. Upgrade physical checks once.\n\nHarmful: 1 wound per 16hr. May rest comfortably.\n\nIrritating: Narrative only. May rest comfortably.",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "2. Toxic Gas (Chlorine/Ammonia/Chemical)",
        "text": "BASE: 1 wound/round. 1 Setback to all checks. Disoriented.\n\nDeadly: 3 wounds/round. Upgrade physical checks once.\n\nSevere: 2 wounds/round. 2 Setback to all checks.\n\nHarmful: 1 wound per 2 rounds.\n\nIrritating: 1 strain/round.",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "3. Corrosive Vapor (Acid Mist/Chemical Fog)",
        "text": "BASE: 1 wound/round. Equipment loses 1 durability/hour.\n\nDeadly: 3 wounds/round. Equipment loses 1 durability/round.\n\nSevere: 2 wounds/round. Equipment loses 1 durability/30min.\n\nHarmful: 1 wound per 2 rounds. Equipment loses 1 durability/2hr.\n\nIrritating: 1 strain/round. Equipment loses 1 durability/4hr.",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "4. Biological (Spores/Mold/Pathogens)",
        "text": "BASE: Resilience (Average dd) each hour. Failure = disease. 1 Setback to all checks.\n\nDeadly: Resilience (Hard ddd) per 30min. Failure = Critical Injury + disease. 2 Setback.\n\nSevere: Resilience (Hard ddd) per hour. Failure = disease + 2 strain.\n\nHarmful: Resilience (Easy d) per 2hr.\n\nIrritating: Resilience (Simple) per 4hr. Failure = 2 strain.\n\nNote: Specific diseases defined in Diseases section.",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "5. Smoke / Particulates",
        "text": "BASE: Vision = Darkness (3-4). 1 strain/round. 2 Setback to Perception/Vigilance.\n\nDeadly: Vision = Pitch Black (0-1). 1 wound/round. 3 Setback to all checks.\n\nSevere: Vision = Deep Darkness (2). 1 wound per 2 rounds. 2 Setback to all checks.\n\nHarmful: 1 strain per 2 rounds. 1 Setback to Perception/Vigilance.\n\nIrritating: Vision = Dim Light (5-6). Narrative coughing.",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "6. High Pressure",
        "text": "BASE: 1 Setback to physical checks. 1 strain/hour. Movement = difficult terrain.\n\nDeadly: 2 wounds/round. 3 Setback to physical checks. Upgrade physical checks twice.\n\nSevere: 1 wound/round. 2 Setback to physical checks.\n\nHarmful: 1 strain per 2hr. 1 Setback to all checks.\n\nIrritating: Narrative discomfort.",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "7. Radiation",
        "text": "BASE: 1 wound/hour. Resilience (Average dd) after 4hr or Radiation Sickness.\n\nDeadly: 2 wounds/round. Immediate Radiation Sickness. 2 Setback to all checks.\n\nSevere: 1 wound/round. Resilience (Hard ddd) per hour.\n\nHarmful: 1 wound per 2hr. Resilience (Average dd) per 4hr.\n\nIrritating: 1 wound per 8hr. Resilience (Easy d) per 8hr.",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "8. Extreme Humidity",
        "text": "BASE: 1 Setback to physical checks. Electronics 10% malfunction/hour. No comfortable rest.\n\nDeadly: 1 wound/round. 3 Setback to all checks. Electronics fail in 1hr.\n\nSevere: 1 strain/round. 2 Setback to physical checks. Electronics 25% malfunction/hour.\n\nHarmful: 1 strain/hour. Electronics 15% malfunction/hour.\n\nIrritating: Narrative dampness. Electronics 5% malfunction/hour.",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "9. Methane / Flammable Gas",
        "text": "BASE: 1 Setback to Brawn/Agility. Spark = 3d10 wounds (Hard ddd Coordination to halve).\n\nDeadly: 1 wound/round. Spark = 5d10 (Daunting dddd Coordination). Room ignites (Temp 10 for 1d10 rounds).\n\nSevere: 1 wound per 2 rounds. Spark = 4d10 (Hard ddd Coordination).\n\nHarmful: 1 strain/round. Spark = 2d10 (Average dd Coordination).\n\nIrritating: Narrative smell. Spark = 1d10 (Easy d Coordination).",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "10. Carbon Monoxide (Silent Killer)",
        "text": "BASE: No immediate effects. After 1hr = 2 wounds/hour. After 2hr = 2 Setback (drowsy/confused). Requires detection equipment or Hard (ddd) Perception.\n\nDeadly: After 30min = 2 wounds/round. After 1hr = incapacitated + Critical Injury/round.\n\nSevere: After 30min = 1 wound/round. After 1hr = 3 Setback.\n\nHarmful: After 2hr = 1 wound/hour. After 4hr = 1 Setback.\n\nIrritating: After 4hr = 1 strain/hour. After 8hr = narrative headache.",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "DM Guidance",
        "text": "Room generation selects hazard type + severity variant using weighted random probabilities based on Danger Level.\n\nTrack exposure timers carefully. Combine multiple hazards for extreme Levels (e.g., Toxic Gas + Low Oxygen).\n\nDetection methods vary: some are obvious (smoke), others require checks or equipment (carbon monoxide).",
        "style": "normal"
      }
    ]
  },
  {
    "id": "custom-talents",
    "category": "Custom Content",
    "title": "Custom Talents",
    "description": "Guidelines for creating and using custom talents, plus pre-made Backrooms talents",
    "order": 20,
    "content": [
      {
        "type": "text",
        "heading": "Overview",
        "text": "Talents are special abilities purchased with XP. They can be passive (always on), active (require activation), or triggered (activate automatically under conditions).",
        "style": "normal"
      },
      {
        "type": "table",
        "heading": "Talent Costs by Tier",
        "columns": [
          "Tier",
          "XP Cost",
          "Power Level"
        ],
        "rows": [
          {
            "col1": "1",
            "col2": "5 XP",
            "col3": "Minor bonus, situational benefit"
          },
          {
            "col1": "2",
            "col2": "10 XP",
            "col3": "Moderate bonus, useful ability"
          },
          {
            "col1": "3",
            "col2": "15 XP",
            "col3": "Significant bonus, powerful ability"
          },
          {
            "col1": "4",
            "col2": "20 XP",
            "col3": "Major bonus, very powerful ability"
          },
          {
            "col1": "5",
            "col2": "25 XP",
            "col3": "Exceptional bonus, game-changing ability"
          }
        ]
      },
      {
        "type": "text",
        "heading": "Ranked Talents",
        "text": "IMPORTANT: Each additional purchase of a ranked talent counts as the next tier:\n\u2022 1st purchase: Tier 1 (5 XP)\n\u2022 2nd purchase: Tier 2 (10 XP)\n\u2022 3rd purchase: Tier 3 (15 XP)\n\u2022 4th purchase: Tier 4 (20 XP)\n\u2022 5th purchase: Tier 5 (25 XP)\n\nMaximum 5 ranks per ranked talent.",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Pre-Made Talents - Tier 1",
        "text": "Efficient Scavenger (Ranked): Reroll dice on Scavenging checks\nPack Rat (Ranked): +2 Encumbrance per rank\nCraftsman's Eye (Ranked): Reroll dice on crafting checks\nRational Mind (Ranked): Sanity loss reduction pool\nQuick Draw: Drawing/holstering is an incidental",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Pre-Made Talents - Tier 2",
        "text": "Resourceful: Find rarity 0-1 consumable once per session\nSurvivalist (Ranked): Remove Setback from Survival checks\nLight Sleeper: -1hr rest requirement, entities upgrade first attack 3 times\nIron Stomach: Consume spoiled food safely (3/session)\nRapid Recovery (Ranked): Receive additional Medicine checks per encounter\nDuelist (Ranked): Boost dice in 1v1 combat (max 5)\nDefensive Stance (Ranked): Suffer 1 strain to increase Defense\nFearless (Ranked): Remove Setback from Fear checks\nSeen It All: Once/session negate sanity loss from horrific event\nZen Meditation: Action to recover sanity (Discipline check)\nEfficient Crafter: -25% crafting time\nMaterial Conservation: Once/session recover half materials on failed craft\nImprovised Repairs: Repair without tools (harder difficulty)\nNight Vision: Remove 2 Setback from darkness\nThermal Regulation: Double time before temperature wounds\nGas Mask Efficiency: Double breath-holding and filter duration\nPressure Acclimation: Ignore Harmful/below High Pressure\nLucky: Once/session upgrade ability or downgrade difficulty",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Pre-Made Talents - Tier 3",
        "text": "Precision Strike: Spend 1 strain for auto-Advantage\nHunter's Instinct: Boost dice = Cunning for danger detection\nUnshakeable: Immune to Frightened (2 strain instead)\nMaster Crafter: Triumph adds beneficial property\nSecond Wind: Once/session recover Brawn or Willpower strain\nSixth Sense: Once/session GM warns of danger",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Pre-Made Talents - Tier 4",
        "text": "Hardened Survivor: +5 Wound, +5 Strain, -10 to Crit rolls (Requires 30 days in Backrooms)",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Pre-Made Talents - Tier 5",
        "text": "Mind Fortress: Ignore first 26 sanity loss/session (Requires Rational Mind 4)\nAgainst All Odds: Once/session auto-recover when incapacitated (Requires 60 days in Backrooms)\nUnshakable Will: 5 strain reduction points per session",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Creating Custom Talents",
        "text": "Players can create custom talents with GM approval. Guidelines:\n\n1. Define concept and type (passive/active/triggered, ranked/unranked)\n2. Write clear mechanics with specific costs and limitations\n3. Determine appropriate tier based on power level\n4. Add prerequisites if appropriate\n5. Present to GM for approval and adjustment\n\nSee full guidelines document for detailed balance recommendations.",
        "style": "normal"
      }
    ]
  },
  {
    "id": "custom-equipment-traits",
    "category": "Custom Content",
    "title": "Custom Equipment Traits",
    "description": "Guidelines for creating custom weapon/armor qualities and item properties",
    "order": 21,
    "content": [
      {
        "type": "text",
        "heading": "Overview",
        "text": "Equipment traits are special properties that modify how weapons, armor, and items function. They can be passive (always on) or active (require spending Advantage to trigger).",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Weapon Qualities",
        "text": "Special properties for weapons. Can be:\n\u2022 Passive: Always active (e.g., Accurate, Pierce, Breach)\n\u2022 Active: Require 2 Advantage to trigger (e.g., Burn, Blast, Stun)\n\u2022 Ranked: Effect scales with rank number",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Armor Qualities",
        "text": "Special properties for armor:\n\u2022 Passive: Always active (e.g., Reinforced, Insulated)\n\u2022 Active: Require action/maneuver (e.g., Sealed, Powered)\n\u2022 Provide defense, protection, or environmental resistance",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Item Properties",
        "text": "Special rules for non-combat items:\n\u2022 Define usage limits (Single-Use, Rechargeable)\n\u2022 Affect durability (Degradable, Delicate, Preserved)\n\u2022 Provide unique effects (Cursed, Reality-Anchored)",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Pre-Made Weapon Qualities",
        "text": "NEGATIVE:\nImprovised: +1 Setback, breaks on Despair\nFragile: Loses 1 durability on failed check\nUnstable: Suffer attack damage on Despair\nMakeshift: Harder to repair, no trade value\nPrimitive: No attachments, +1 Setback vs armor\nUnwieldy (Ranked): +Difficulty to use\nDeteriorating (Ranked): Loses durability per encounter\n\nPOSITIVE:\nBrutal (Active): 2 Advantage to stagger target\nConcussive (Active, Ranked): 2 Advantage for strain = rating\nEntangling (Active): 2 Advantage to immobilize\nFrightening (Active, Ranked): 2 Advantage to force Fear check\nSanity-Breaking (Active): Triumph inflicts sanity = damage\nReach (Ranked): Attack at Short range, +Boost to Defense\nSilent: No noise, remove 2 Setback from Stealth\nEntity-Slayer (Ranked): +Damage vs entities only",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Pre-Made Armor Qualities",
        "text": "NEGATIVE:\nCumbersome (Ranked): Reduce Agility\nLoud: +2 Setback to Stealth\nRestrictive (Ranked): Limit maneuvers per turn\nJury-Rigged: Harder to repair, loses durability on crits\n\nPOSITIVE:\nReinforced (Ranked): +Soak\nInsulated (Ranked): Treat temperature closer to Comfortable\nSealed (Active): Maneuver to become immune to airborne hazards\nAdaptive: Ignore Lighting 0-2 and 9-10 penalties\nPowered (Active): +1 Brawn while powered\nAblative: Absorb first Critical Injury (one-time)\nHazard-Resistant (Ranked): Reduce specific hazard severity\nLightweight: -2 Encumbrance, remove 1 Setback\nReflective (Ranked): +Boost to Ranged Defense\nCamouflaged (Ranked): +Boost to Stealth in appropriate terrain",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Pre-Made Item Properties",
        "text": "USAGE:\nSingle-Use: Consumed on use\nRechargeable: Can be refilled\nDegradable (Ranked): Loses durability per use\nEmergency-Use: Only usable at low health/strain/sanity\n\nDURABILITY:\nVolatile: May explode if damaged\nDelicate: Breaks on Despair\nPreserved: Immune to natural decay\nSelf-Repairing (Ranked): Recovers durability per 24hr rest\n\nSPECIAL:\nBulky (Ranked): +Encumbrance, can't store normally\nLinked: Part of set, works best combined\nIrreplaceable: Cannot be replaced if lost\nCursed: Negative effect, can't discard\nMysterious: Requires identification\nEntity-Attracting: +1 Danger Level while carried\nReality-Anchored: Halves sanity loss from reality warping",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Creating Custom Traits",
        "text": "Players and GMs can create custom traits following these guidelines:\n\n1. Define concept: What does this represent?\n2. Choose type: Weapon/Armor/Item, Passive/Active, Ranked/Unranked\n3. Write mechanics: Exact effects, costs, limitations\n4. Balance: Compare to existing traits of similar power\n5. Get GM approval before implementation\n\nSee full guidelines document for detailed balance recommendations and examples.",
        "style": "normal"
      },
      {
        "type": "text",
        "heading": "Combining Traits",
        "text": "Items can have multiple traits:\n\nCommon Items: 0-2 minor traits\nUncommon Items: 1-3 traits (mix of minor/moderate)\nRare Items: 2-4 traits (including powerful)\nLegendary Items: 3-5+ traits (multiple powerful)\n\nNegative traits (Improvised, Fragile, Cumbersome) balance powerful positive traits for interesting risk/reward items.",
        "style": "normal"
      }
    ]
  }
]

export default data;