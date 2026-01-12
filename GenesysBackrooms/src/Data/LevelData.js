const data = [
  {
    // Basic Identification
    id: "level-10",
    levelNumber: "10",
    levelName: "The Bumper Crop",
    classification: "Safe",
    description: "An expansive pasture of wheat and barley fields stretching endlessly in all directions, divided into plots by lines of trees and shrubbery. The climate never appears to shift from an overcast, leaden sky, with brief and infrequent spells of light rain and fog. The dreary atmosphere, coupled with its unchanging state of daylight, makes it somewhat difficult to keep track of time.",

    // Level Type
    levelType: "procedural",

    // Environmental Conditions
    lightingMin: 5,
    lightingMax: 6,
    temperatureMin: 4,
    temperatureMax: 5,
    temperatureRangeF: { min: 55, max: 65 },
    temperatureRangeC: { min: 13, max: 18 },
    atmosphericHazards: [],

    // Physical Appearance
    physicalAppearance: {
      wallMaterial: [
        { material: "Wooden barn siding", weight: 40 },
        { material: "Weathered planks", weight: 35 },
        { material: "Stone foundation", weight: 25 }
      ],
      wallPattern: [
        { pattern: "Horizontal planks", weight: 50 },
        { pattern: "Vertical boards", weight: 30 },
        { pattern: "Mixed stonework", weight: 20 }
      ],
      floorMaterial: [
        { material: "Soil and grass", weight: 45 },
        { material: "Dirt path with tire tracks", weight: 25 },
        { material: "Wheat field rows", weight: 20 },
        { material: "Wooden barn flooring", weight: 10 }
      ],
      floorCondition: [
        { condition: "Damp from light rain", weight: 40 },
        { condition: "Muddy", weight: 20 },
        { condition: "Dry and firm", weight: 30 },
        { condition: "Waterlogged near lakes", weight: 10 }
      ],
      ceilingType: [
        { type: "None (overcast sky)", weight: 70 },
        { type: "Barn rafters", weight: 20 },
        { type: "Shed roofing", weight: 10 }
      ]
    },

    // Spatial Properties
    spatialProperties: {
      euclidean: true,
      topology: "euclidean",
      navigationDifficulty: "moderate"
    },

    // Room Dimensions
    zoneDimensions: {
      width: { min: 50, max: 200, unit: "meters" },
      length: { min: 50, max: 500, unit: "meters" },
      height: { min: 0, max: 0, unit: "meters" }
    },
    zoneShapes: ["rectangular", "irregular", "open_space"],

    // Environmental Details
    environmentalDetails: {
      hasElectricity: false,
      spawnProbability: 40,
      maxSimultaneous: 3,
      categories: {
        electrical: { enabled: false },
        furniture: { enabled: true },
        storage: { enabled: true },
        debris: { enabled: true },
        decoration: { enabled: false },
        naturalEffects: { enabled: true },
        utilities: { enabled: false }
      },
      available: [
        {
          type: "wooden_shed",
          name: "Wooden Shed",
          category: "storage",
          requiresPower: false,
          weight: 30,
          baseDescription: "Small wooden outbuilding for farm equipment storage",
          mechanicalEffect: "Can be entered for shelter, may contain resources, provides cover",
          variants: {
            state: [
              { variant: "intact", weight: 30, description: "Structurally sound, door works" },
              { variant: "weathered", weight: 40, description: "Worn but functional" },
              { variant: "damaged", weight: 20, description: "Missing boards, partial roof" },
              { variant: "collapsed", weight: 10, description: "Partially fallen, difficult entry" }
            ],
            functionality: [
              { variant: "empty", weight: 40, description: "Cleared out, nothing inside" },
              { variant: "tools_present", weight: 30, description: "Contains old farming tools" },
              { variant: "supplies_stored", weight: 20, description: "Boxes and containers inside" },
              { variant: "nest", weight: 10, description: "Something has made a home here" }
            ],
            size: [
              { variant: "small", weight: 40, description: "Single room, 3x3 meters", depth: { width: 3, length: 3 } },
              { variant: "medium", weight: 45, description: "Room for equipment, 5x4 meters", depth: { width: 5, length: 4 } },
              { variant: "large", weight: 15, description: "Multi-purpose shed, 8x6 meters", depth: { width: 8, length: 6 } }
            ],
            design: [
              { variant: "basic", weight: 50, description: "Simple rectangular structure" },
              { variant: "peaked_roof", weight: 30, description: "Traditional peaked roof design" },
              { variant: "lean_to", weight: 20, description: "Slanted single-slope roof" }
            ],
            material: [
              { variant: "pine", weight: 40, texture: "Light wood, visible grain" },
              { variant: "oak", weight: 30, texture: "Dark hardwood, sturdy" },
              { variant: "mixed_salvage", weight: 30, texture: "Various wood types patched together" }
            ],
            age: [
              { variant: "recent", weight: 15, era: "Built within years, nails not rusted" },
              { variant: "decades_old", weight: 50, era: "Decades of weathering, grey wood" },
              { variant: "ancient", weight: 35, era: "Could be centuries old, wood nearly petrified" }
            ],
            occupancy: [
              { variant: "abandoned", weight: 50, description: "Long unused, dusty" },
              { variant: "recently_used", weight: 25, description: "Signs of recent activity" },
              { variant: "maintained", weight: 15, description: "Someone keeps this up" },
              { variant: "contested", weight: 10, description: "Multiple parties have used this" }
            ]
          },
          environmentalEffects: {
            temperature: { variantCondition: "state=intact AND size=large", change: "+2°C" },
            humidity: { variantCondition: "state=damaged OR state=collapsed", change: "+10%" },
            lighting: { variantCondition: "state=intact", value: -2, description: "Interior darker than outside" },
            sound: { variantCondition: "state=weathered OR state=damaged", description: "Creaking wood in wind", decibels: 15, type: "ambient" },
            smell: { variantCondition: "age=decades_old OR age=ancient", description: "Musty old wood smell", radius: 10, intensity: "moderate" },
            other: { effectName: "Shelter", description: "Provides cover from rain, wind. Can be barricaded (Athletics DC 10)." }
          }
        },
        {
          type: "water_lake",
          name: "Water Lake",
          category: "naturalEffects",
          requiresPower: false,
          weight: 20,
          baseDescription: "Body of water at consistent elevation",
          mechanicalEffect: "Safe to drink (earthy taste), swimming may lead to aquatic levels",
          variants: {
            state: [
              { variant: "still", weight: 50, description: "Completely calm surface" },
              { variant: "rippling", weight: 30, description: "Light wind creating ripples" },
              { variant: "churning", weight: 15, description: "Something disturbing the water" },
              { variant: "frozen_edge", weight: 5, description: "Thin ice at edges despite temperature" }
            ],
            functionality: [
              { variant: "drinkable", weight: 60, description: "Safe to drink, earthy taste" },
              { variant: "fishing", weight: 20, description: "Fish-like shapes visible below" },
              { variant: "portal", weight: 15, description: "Swimming deep leads elsewhere" },
              { variant: "bottomless", weight: 5, description: "No bottom can be found" }
            ],
            size: [
              { variant: "pond", weight: 30, description: "20-50 meters across", depth: { width: 35, depth: 3 } },
              { variant: "small_lake", weight: 45, description: "100-200 meters across", depth: { width: 150, depth: 8 } },
              { variant: "large_lake", weight: 25, description: "500+ meters, horizon visible", depth: { width: 500, depth: 15 } }
            ],
            design: [
              { variant: "natural", weight: 60, description: "Organic shoreline shape" },
              { variant: "circular", weight: 25, description: "Unnaturally round" },
              { variant: "geometric", weight: 15, description: "Impossible precise angles" }
            ],
            material: [
              { variant: "clear_water", weight: 50, texture: "Highly oxygenated, clear" },
              { variant: "dark_water", weight: 30, texture: "Deep color, can't see bottom" },
              { variant: "murky", weight: 20, texture: "Sediment obscures vision" }
            ],
            age: [
              { variant: "recent", weight: 10, era: "Formed recently somehow" },
              { variant: "established", weight: 50, era: "Been here as long as anyone knows" },
              { variant: "primordial", weight: 40, era: "Feels older than the level itself" }
            ],
            occupancy: [
              { variant: "pristine", weight: 40, description: "No signs of use" },
              { variant: "shore_camps", weight: 30, description: "Evidence of people camping nearby" },
              { variant: "fishing_spot", weight: 20, description: "Old fishing equipment nearby" },
              { variant: "avoided", weight: 10, description: "Warnings carved into nearby trees" }
            ]
          },
          environmentalEffects: {
            temperature: { variantCondition: "size=large_lake", change: "-2°C" },
            humidity: { variantCondition: "size=small_lake OR size=large_lake", change: "+25%" },
            lighting: { variantCondition: "material=clear_water AND state=still", value: 1, description: "Reflects sky, adds ambient light" },
            sound: { variantCondition: "state=rippling OR state=churning", description: "Water lapping at shore", decibels: 20, type: "ambient" },
            smell: { variantCondition: "functionality=drinkable", description: "Clean water with earthy undertone", radius: 15, intensity: "subtle" },
            other: { effectName: "Exit Potential", description: "Swimming to depth of 5+ meters, Athletics DC 12, may transport to aquatic levels." }
          }
        },
        {
          type: "hay_bale",
          name: "Hay Bale",
          category: "debris",
          requiresPower: false,
          weight: 35,
          baseDescription: "Bundled dried grass or wheat stalks",
          mechanicalEffect: "Can be moved for cover, flammable, may hide objects",
          variants: {
            state: [
              { variant: "intact", weight: 40, description: "Tightly bound, holds shape" },
              { variant: "loose", weight: 35, description: "Bindings fraying, spreading" },
              { variant: "scattered", weight: 15, description: "Broken apart, hay everywhere" },
              { variant: "compressed", weight: 10, description: "Unusually dense and heavy" }
            ],
            functionality: [
              { variant: "normal", weight: 60, description: "Standard hay bale" },
              { variant: "hollow", weight: 20, description: "Something removed from inside" },
              { variant: "cache", weight: 15, description: "Items hidden within" },
              { variant: "nest", weight: 5, description: "Creature living inside" }
            ],
            size: [
              { variant: "small_square", weight: 35, description: "40x40x80cm, 20kg", depth: { width: 0.4, length: 0.8 } },
              { variant: "large_square", weight: 40, description: "80x80x120cm, 50kg", depth: { width: 0.8, length: 1.2 } },
              { variant: "round", weight: 25, description: "1.5m diameter cylinder, 250kg", depth: { width: 1.5, length: 1.2 } }
            ],
            design: [
              { variant: "twine_bound", weight: 50, description: "Natural fiber binding" },
              { variant: "wire_bound", weight: 30, description: "Metal wire holding shape" },
              { variant: "net_wrapped", weight: 20, description: "Plastic netting exterior" }
            ],
            material: [
              { variant: "wheat_straw", weight: 40, texture: "Golden wheat stalks" },
              { variant: "grass_hay", weight: 35, texture: "Mixed dried grasses" },
              { variant: "alfalfa", weight: 25, texture: "Greenish, leafy hay" }
            ],
            age: [
              { variant: "fresh", weight: 20, era: "Recently baled, still fragrant" },
              { variant: "seasoned", weight: 50, era: "Months old, dry and stable" },
              { variant: "old", weight: 30, era: "Years, greying and dusty" }
            ],
            occupancy: [
              { variant: "undisturbed", weight: 45, description: "Exactly as left" },
              { variant: "moved", weight: 30, description: "Drag marks visible" },
              { variant: "searched", weight: 15, description: "Torn into, examined" },
              { variant: "stacked", weight: 10, description: "Part of larger pile" }
            ]
          },
          environmentalEffects: {
            temperature: { variantCondition: "state=intact AND occupancy=stacked", change: "+1°C" },
            humidity: { variantCondition: "material=alfalfa AND age=fresh", change: "+5%" },
            lighting: { variantCondition: "none", value: 0, description: "No lighting effect" },
            sound: { variantCondition: "functionality=nest", description: "Scratching, rustling from within", decibels: 15, type: "ambient" },
            smell: { variantCondition: "age=fresh OR age=seasoned", description: "Dry hay smell", radius: 5, intensity: "moderate" },
            other: { effectName: "Utility", description: "Movable with Brawn 2+. Provides soft cover. Highly flammable - burns 1d6 rounds." }
          }
        }
      ]
    },

    // Atmospheric Details
    atmosphericDetails: {
      enabled: true,
      spawnProbability: 60,
      maxSimultaneous: 2,
      categories: {
        stainsMarks: { enabled: true },
        structuralImperfections: { enabled: true },
        lightingPhenomena: { enabled: true },
        movementFlow: { enabled: true }
      },
      available: [
        {
          type: "tire_tracks",
          name: "Tire Tracks",
          category: "stainsMarks",
          weight: 40,
          baseDescription: "Parallel impressions in dirt from vehicle tires",
          narrativeImpact: "Suggests vehicles exist but are never seen",
          variants: {
            state: [
              { variant: "fresh", weight: 20, description: "Sharp edges, recent" },
              { variant: "established", weight: 50, description: "Worn into permanent paths" },
              { variant: "fading", weight: 20, description: "Grass growing back over" },
              { variant: "permanent", weight: 10, description: "Impossibly persistent" }
            ],
            functionality: [
              { variant: "normal_path", weight: 60, description: "Standard vehicle passage" },
              { variant: "exit_marker", weight: 25, description: "Following leads somewhere" },
              { variant: "loop", weight: 10, description: "Circles back on itself" },
              { variant: "misleading", weight: 5, description: "Leads nowhere useful" }
            ],
            size: [
              { variant: "single_vehicle", weight: 50, description: "One set of tracks" },
              { variant: "well_traveled", weight: 35, description: "Multiple overlapping tracks" },
              { variant: "convoy", weight: 15, description: "Many parallel tracks" }
            ],
            design: [
              { variant: "car_tires", weight: 30, description: "Standard automobile pattern" },
              { variant: "tractor_tires", weight: 50, description: "Wide, deep agricultural treads" },
              { variant: "unknown", weight: 20, description: "Pattern doesn't match known vehicles" }
            ],
            material: [
              { variant: "mud_impression", weight: 40, description: "Pressed into mud" },
              { variant: "grass_flattened", weight: 35, description: "Vegetation crushed" },
              { variant: "carved_earth", weight: 25, description: "Deep ruts in hard soil" }
            ],
            age: [
              { variant: "hours", weight: 15, description: "Made very recently" },
              { variant: "days", weight: 35, description: "Several days old" },
              { variant: "timeless", weight: 50, description: "Age impossible to determine" }
            ],
            occupancy: [
              { variant: "abandoned", weight: 60, description: "No current use apparent" },
              { variant: "active", weight: 25, description: "Seems regularly used" },
              { variant: "monitored", weight: 15, description: "Someone watches these paths" }
            ]
          },
          atmosphericEffects: {
            lighting: { variantCondition: "none", value: 0, description: "No lighting effect" },
            sound: { variantCondition: "occupancy=active", description: "Occasional distant engine sounds", decibels: 30, type: "occasional" },
            psychological: { variantCondition: "design=unknown", effect: "unease", severity: "subtle", mechanicalEffect: "Players may feel watched" },
            narrative: { variantCondition: "functionality=exit_marker", implication: "Following these tracks eventually leads to Level 11" }
          }
        },
        {
          type: "fog_patches",
          name: "Fog Patches",
          category: "movementFlow",
          weight: 30,
          baseDescription: "Low-lying mist drifting across the fields",
          narrativeImpact: "Reduces visibility, creates unease",
          variants: {
            state: [
              { variant: "thin", weight: 40, description: "Wispy, see-through" },
              { variant: "moderate", weight: 35, description: "Noticeably obscuring" },
              { variant: "thick", weight: 20, description: "Difficult to see through" },
              { variant: "impenetrable", weight: 5, description: "Cannot see at all" }
            ],
            functionality: [
              { variant: "natural_fog", weight: 50, description: "Normal moisture condensation" },
              { variant: "concealing", weight: 30, description: "Hides things within" },
              { variant: "disorienting", weight: 15, description: "Easy to get lost in" },
              { variant: "inhabited", weight: 5, description: "Something moves in the fog" }
            ],
            size: [
              { variant: "pocket", weight: 35, description: "Small isolated patch" },
              { variant: "bank", weight: 45, description: "Large rolling mass" },
              { variant: "sea", weight: 20, description: "Covers vast area" }
            ],
            design: [
              { variant: "ground_hugging", weight: 50, description: "Stays below waist height" },
              { variant: "rising", weight: 30, description: "Extends upward" },
              { variant: "layered", weight: 20, description: "Multiple density bands" }
            ],
            material: [
              { variant: "water_vapor", weight: 70, description: "Normal fog moisture" },
              { variant: "cold_mist", weight: 20, description: "Chilling dampness" },
              { variant: "unknown_substance", weight: 10, description: "Not quite water" }
            ],
            age: [
              { variant: "forming", weight: 25, description: "Currently condensing" },
              { variant: "stable", weight: 50, description: "Been here a while" },
              { variant: "dissipating", weight: 15, description: "Slowly clearing" },
              { variant: "permanent", weight: 10, description: "Never goes away" }
            ],
            occupancy: [
              { variant: "empty", weight: 60, description: "Just fog" },
              { variant: "shapes", weight: 25, description: "Suggestions of forms" },
              { variant: "presence", weight: 15, description: "Something is definitely there" }
            ]
          },
          atmosphericEffects: {
            lighting: { variantCondition: "state=thick OR state=impenetrable", value: -2, description: "Visibility significantly reduced" },
            sound: { variantCondition: "functionality=inhabited", description: "Muffled movements within fog", decibels: 15, type: "occasional" },
            psychological: { variantCondition: "functionality=disorienting OR occupancy=presence", effect: "dread", severity: "moderate", mechanicalEffect: "Navigation checks +1 Difficulty while in fog" },
            narrative: { variantCondition: "material=unknown_substance", implication: "This is not natural fog - something generates it" }
          }
        },
        {
          type: "swaying_wheat",
          name: "Swaying Wheat",
          category: "movementFlow",
          weight: 60,
          baseDescription: "Wheat stalks moving in the breeze",
          narrativeImpact: "Only visual variety in the monotonous landscape",
          variants: {
            state: [
              { variant: "gentle", weight: 50, description: "Soft, rhythmic movement" },
              { variant: "vigorous", weight: 25, description: "Strong wind buffeting" },
              { variant: "still", weight: 15, description: "Eerily motionless" },
              { variant: "wrong", weight: 10, description: "Moving against the wind" }
            ],
            functionality: [
              { variant: "wind_indicator", weight: 50, description: "Shows wind direction" },
              { variant: "hypnotic", weight: 25, description: "Mesmerizing to watch" },
              { variant: "concealing", weight: 15, description: "Movement hides other motion" },
              { variant: "signaling", weight: 10, description: "Pattern seems deliberate" }
            ],
            size: [
              { variant: "patch", weight: 30, description: "Local area swaying" },
              { variant: "field", weight: 50, description: "Entire field in motion" },
              { variant: "wave", weight: 20, description: "Rolling wave across landscape" }
            ],
            design: [
              { variant: "random", weight: 40, description: "Natural chaotic movement" },
              { variant: "wave_pattern", weight: 40, description: "Visible wave propagation" },
              { variant: "spiral", weight: 15, description: "Circular pattern center" },
              { variant: "path", weight: 5, description: "Line of disturbance" }
            ],
            material: [
              { variant: "golden_wheat", weight: 60, description: "Ripe golden stalks" },
              { variant: "green_wheat", weight: 25, description: "Unripe green growth" },
              { variant: "mixed", weight: 15, description: "Various growth stages" }
            ],
            age: [
              { variant: "young_crop", weight: 20, description: "Short, fresh growth" },
              { variant: "mature", weight: 60, description: "Full height, seed heads" },
              { variant: "overripe", weight: 20, description: "Past harvest, drying" }
            ],
            occupancy: [
              { variant: "empty", weight: 50, description: "Just wheat" },
              { variant: "creatures", weight: 25, description: "Small animals move through" },
              { variant: "paths", weight: 15, description: "Trampled routes visible" },
              { variant: "watcher", weight: 10, description: "Something stands in the wheat" }
            ]
          },
          atmosphericEffects: {
            lighting: { variantCondition: "none", value: 0, description: "No lighting effect" },
            sound: { variantCondition: "state=gentle OR state=vigorous", description: "Rustling wheat stalks", decibels: 20, type: "ambient" },
            psychological: { variantCondition: "state=wrong OR functionality=signaling OR occupancy=watcher", effect: "unease", severity: "strong", mechanicalEffect: "Vigilance check or gain 1 Strain" },
            narrative: { variantCondition: "design=path", implication: "Something large recently moved through here" }
          }
        }
      ]
    },

    // Ambient Effects
    ambientEffects: {
      sound: {
        type: "wind",
        variant: "intermittent_gusts",
        volume: "quiet",
        description: "Occasional gusts of wind rustling through crops, otherwise near silence",
        mechanicalEffect: null
      },
      smell: {
        primary: {
          type: "natural",
          variant: "wheat_grain",
          intensity: "moderate",
          description: "Strong smell of wheat grain permeates the air"
        },
        secondary: {
          type: "musty",
          variant: "earthy_damp",
          intensity: "faint",
          description: "Earthy undertone from the damp soil"
        }
      },
      visualEffects: {
        enabled: true,
        type: "disorientation",
        triggerCondition: "Prolonged exposure to unchanging daylight (8+ hours)",
        effects: ["time_distortion", "disorientation", "peripheral_shadows"],
        severity: "mild",
        mechanicalEffect: "Difficulty tracking time passage. After 12+ hours, Perception checks at +2 Difficulty."
      },
      temperature: {
        baseline: 15,
        variant: "humid_stale",
        description: "Cool and damp - the overcast sky traps moisture near the ground, creating a clammy sensation"
      },
      airQuality: {
        type: "fresh",
        breathability: "excellent",
        description: "Air is fresh and clean despite the dampness. Almost too clean - sterile in a way that feels wrong for farmland.",
        mechanicalEffect: "No breathing penalties. The unnatural freshness may unsettle observant characters."
      }
    },

    // Danger Level & Chase
    dangerLevel: 1,
    averageZoneTime: 10,

    // Tags
    tags: ["Natural", "Rural", "Safe", "Wilderness", "Spacious"],

    // Spawn Tables
    spawnTables: {
      entities: { enabled: true, spawnProbability: 5 },
      objects: { enabled: true, spawnProbability: 30 },
      poi: { enabled: true, spawnProbability: 15 },
      phenomena: {
        level_wide: { enabled: false, spawnProbability: 0 },
        zone_specific: { enabled: true, spawnProbability: 10 }
      },
      factionEncounters: {
        enabled: true,
        spawnProbability: 10,
        memberCount: { min: 2, max: 5 },
        missionTypes: ["settlement", "resource-gathering", "exploration"],
        equipmentLevel: "standard"
      }
    },

    // Exit Configuration
    exits: {
      spawnable: {
        enabled: true,
        minExits: 1,
        maxExits: 2,
        destinationProbabilities: { sameLevel: 0.60, differentLevel: 0.30, outpost: 0.10 },

        sameLevel: {
          exitTypes: [
            {
              type: "dirt_path",
              baseDescription: "A worn dirt path with parallel tire tracks",
              weight: 50,
              variants: {
                state: [
                  { variant: "clear", weight: 40, description: "Path is easy to follow" },
                  { variant: "overgrown", weight: 30, description: "Grass encroaching on edges" },
                  { variant: "muddy", weight: 20, description: "Recent rain made it soft" },
                  { variant: "flooded", weight: 10, description: "Standing water in ruts" }
                ],
                material: [
                  { variant: "packed_earth", weight: 50, description: "Hard-packed dirt" },
                  { variant: "gravel", weight: 30, description: "Scattered gravel surface" },
                  { variant: "grass_track", weight: 20, description: "Two dirt strips with grass center" }
                ],
                condition: [
                  { variant: "well_used", weight: 40, description: "Clear signs of traffic" },
                  { variant: "neglected", weight: 35, description: "Not used recently" },
                  { variant: "maintained", weight: 15, description: "Someone tends this" },
                  { variant: "ancient", weight: 10, description: "Impossibly old but present" }
                ],
                lighting: [
                  { variant: "same", weight: 70, description: "Same overcast light" },
                  { variant: "brighter", weight: 15, description: "Slightly brighter ahead" },
                  { variant: "dimmer", weight: 10, description: "Darker in the distance" },
                  { variant: "different", weight: 5, description: "Light quality changes" }
                ],
                atmosphere: [
                  { variant: "normal", weight: 60, description: "Feels like rest of level" },
                  { variant: "inviting", weight: 20, description: "Draws you forward" },
                  { variant: "uncertain", weight: 15, description: "Something feels off" },
                  { variant: "ominous", weight: 5, description: "Dread grows as you look" }
                ]
              },
              exitEffects: {
                sound: { variantCondition: "atmosphere=uncertain OR atmosphere=ominous", probability: 0.4, description: "Distant sounds from the path", examples: ["engine rumbling", "footsteps", "wheat rustling differently"] },
                smell: { variantCondition: "lighting=different", probability: 0.3, description: "Different scent from that direction", examples: ["exhaust fumes", "smoke", "decay"] },
                visibility: { variantCondition: "lighting=dimmer", probability: 1.0, description: "Cannot see clearly what lies beyond" },
                accessibility: { variantCondition: "state=flooded", probability: 1.0, description: "Must wade through water to proceed", mechanicalEffect: "Athletics DC 6 to cross without slipping" }
              }
            },
            {
              type: "tree_gap",
              baseDescription: "A gap in the tree line between field plots",
              weight: 30,
              variants: {
                state: [
                  { variant: "open", weight: 45, description: "Clear passage through" },
                  { variant: "narrow", weight: 30, description: "Tight squeeze between trees" },
                  { variant: "overgrown", weight: 20, description: "Branches partially blocking" },
                  { variant: "blocked", weight: 5, description: "Fallen tree or debris" }
                ],
                material: [
                  { variant: "natural_gap", weight: 50, description: "Trees never grew here" },
                  { variant: "cut_passage", weight: 30, description: "Trees were cleared" },
                  { variant: "fallen_tree", weight: 20, description: "Gap from downed tree" }
                ],
                condition: [
                  { variant: "stable", weight: 50, description: "Will remain passable" },
                  { variant: "growing_closed", weight: 25, description: "Saplings filling in" },
                  { variant: "widening", weight: 15, description: "More trees dying" },
                  { variant: "shifting", weight: 10, description: "Gap seems to move" }
                ],
                lighting: [
                  { variant: "shadowed", weight: 40, description: "Darker under the trees" },
                  { variant: "dappled", weight: 30, description: "Light filtering through" },
                  { variant: "bright_beyond", weight: 20, description: "Open field visible" },
                  { variant: "dark_beyond", weight: 10, description: "Darkness past the gap" }
                ],
                atmosphere: [
                  { variant: "natural", weight: 50, description: "Normal forest feeling" },
                  { variant: "peaceful", weight: 25, description: "Calm, inviting" },
                  { variant: "watchful", weight: 15, description: "Something observing" },
                  { variant: "wrong", weight: 10, description: "Trees seem hostile" }
                ]
              },
              exitEffects: {
                sound: { variantCondition: "atmosphere=watchful OR atmosphere=wrong", probability: 0.5, description: "Sounds from within the tree line", examples: ["branches cracking", "rustling that stops", "breathing"] },
                smell: { variantCondition: "material=fallen_tree", probability: 0.6, description: "Scent of decaying wood", examples: ["rotting wood", "fungus", "sap"] },
                visibility: { variantCondition: "lighting=dark_beyond OR state=overgrown", probability: 1.0, description: "Difficult to see the other side" },
                accessibility: { variantCondition: "state=blocked OR state=narrow", probability: 1.0, description: "Physical obstacle to passage", mechanicalEffect: "Blocked: Athletics DC 12. Narrow: Athletics DC 6." }
              }
            },
            {
              type: "field_edge",
              baseDescription: "Where the wheat field ends and another begins",
              weight: 20,
              variants: {
                state: [
                  { variant: "clear_boundary", weight: 40, description: "Distinct edge visible" },
                  { variant: "gradual", weight: 35, description: "Fields blend together" },
                  { variant: "fenced", weight: 15, description: "Fence marks the edge" },
                  { variant: "ditched", weight: 10, description: "Irrigation ditch between" }
                ],
                material: [
                  { variant: "grass_strip", weight: 40, description: "Mowed grass between crops" },
                  { variant: "bare_earth", weight: 30, description: "Strip of dirt" },
                  { variant: "hedgerow", weight: 20, description: "Low shrubs mark edge" },
                  { variant: "nothing", weight: 10, description: "Just different crop height" }
                ],
                condition: [
                  { variant: "maintained", weight: 25, description: "Clear boundary kept" },
                  { variant: "natural", weight: 45, description: "Left to grow naturally" },
                  { variant: "eroding", weight: 20, description: "Boundaries breaking down" },
                  { variant: "unnatural", weight: 10, description: "Too perfect, too straight" }
                ],
                lighting: [
                  { variant: "uniform", weight: 60, description: "Same light both sides" },
                  { variant: "shadow_line", weight: 25, description: "Darker on one side" },
                  { variant: "color_shift", weight: 10, description: "Light has different tint" },
                  { variant: "time_difference", weight: 5, description: "Different time of day visible" }
                ],
                atmosphere: [
                  { variant: "continuous", weight: 55, description: "Same feeling throughout" },
                  { variant: "change_ahead", weight: 25, description: "Different atmosphere beyond" },
                  { variant: "threshold", weight: 15, description: "Feels like crossing a boundary" },
                  { variant: "forbidden", weight: 5, description: "Sense you shouldn't cross" }
                ]
              },
              exitEffects: {
                sound: { variantCondition: "atmosphere=change_ahead OR atmosphere=threshold", probability: 0.3, description: "Different ambient sounds from other field", examples: ["different wind", "new bird calls", "mechanical sounds"] },
                smell: { variantCondition: "state=ditched", probability: 0.5, description: "Water and vegetation smells from ditch", examples: ["stagnant water", "reeds", "mud"] },
                visibility: { variantCondition: "lighting=time_difference", probability: 1.0, description: "Disorienting view of different lighting" },
                accessibility: { variantCondition: "state=fenced OR state=ditched", probability: 1.0, description: "Obstacle at the boundary", mechanicalEffect: "Fenced: Athletics DC 4. Ditched: Athletics DC 8." }
              }
            }
          ]
        },

        documentedLevels: [
          {
            name: "Road to Level 11",
            destinationType: "level",
            destinationId: "level-11",
            spawnProbability: 40,
            description: "Following the dirt paths for a prolonged period eventually leads to Level 11",
            exitTypes: [
              {
                type: "extending_road",
                baseDescription: "The dirt path continues far into the distance",
                weight: 100,
                variants: {
                  state: [
                    { variant: "straight", weight: 50, description: "Road stretches straight ahead" },
                    { variant: "curving", weight: 35, description: "Gentle curves toward horizon" },
                    { variant: "climbing", weight: 15, description: "Road rises slightly" }
                  ],
                  material: [
                    { variant: "dirt_to_gravel", weight: 50, description: "Gradually becomes gravel" },
                    { variant: "dirt_to_asphalt", weight: 35, description: "Pavement appears ahead" },
                    { variant: "unchanged", weight: 15, description: "Stays dirt the whole way" }
                  ],
                  condition: [
                    { variant: "improving", weight: 40, description: "Road quality improves" },
                    { variant: "consistent", weight: 40, description: "Same condition throughout" },
                    { variant: "signs_appear", weight: 20, description: "Road signs become visible" }
                  ],
                  lighting: [
                    { variant: "brightening", weight: 35, description: "Light increases in distance" },
                    { variant: "darkening", weight: 25, description: "Grows darker ahead" },
                    { variant: "streetlights", weight: 25, description: "Lights visible far away" },
                    { variant: "same", weight: 15, description: "No change in lighting" }
                  ],
                  atmosphere: [
                    { variant: "hopeful", weight: 40, description: "Civilization feels closer" },
                    { variant: "uncertain", weight: 35, description: "Unknown ahead" },
                    { variant: "calling", weight: 15, description: "Drawn forward" },
                    { variant: "warning", weight: 10, description: "Instinct says beware" }
                  ]
                },
                exitEffects: {
                  sound: { variantCondition: "lighting=streetlights OR condition=signs_appear", probability: 0.6, description: "Urban sounds from the distance", examples: ["traffic", "voices", "city ambiance"] },
                  smell: { variantCondition: "material=dirt_to_asphalt", probability: 0.5, description: "Scent of civilization", examples: ["asphalt", "exhaust", "food cooking"] },
                  visibility: { variantCondition: "lighting=darkening", probability: 1.0, description: "Difficult to see what awaits" },
                  accessibility: { variantCondition: "atmosphere=warning", probability: 1.0, description: "Strong hesitation to proceed", mechanicalEffect: "Discipline DC 8 to ignore instincts and continue" }
                }
              }
            ]
          },
          {
            name: "Border to Level 35",
            destinationType: "level",
            destinationId: "level-35",
            spawnProbability: 25,
            description: "A visible border where the wheat fields abruptly change environment",
            exitTypes: [
              {
                type: "environmental_border",
                baseDescription: "A stark line where the landscape changes completely",
                weight: 100,
                variants: {
                  state: [
                    { variant: "sharp", weight: 40, description: "Instant transition visible" },
                    { variant: "blurred", weight: 35, description: "Few meters of transition" },
                    { variant: "wavering", weight: 15, description: "Border seems to shift" },
                    { variant: "invisible", weight: 10, description: "Only notice when crossed" }
                  ],
                  material: [
                    { variant: "wheat_to_grass", weight: 30, description: "Crops end, grass begins" },
                    { variant: "wheat_to_forest", weight: 30, description: "Trees start abruptly" },
                    { variant: "wheat_to_barren", weight: 25, description: "Vegetation ends" },
                    { variant: "wheat_to_unknown", weight: 15, description: "Something unfamiliar" }
                  ],
                  condition: [
                    { variant: "stable", weight: 50, description: "Border doesn't move" },
                    { variant: "expanding", weight: 20, description: "Other side growing" },
                    { variant: "contracting", weight: 20, description: "Wheat reclaiming ground" },
                    { variant: "contested", weight: 10, description: "Both fighting for space" }
                  ],
                  lighting: [
                    { variant: "same", weight: 35, description: "Light unchanged across" },
                    { variant: "brighter", weight: 25, description: "Brighter on other side" },
                    { variant: "darker", weight: 25, description: "Darker on other side" },
                    { variant: "different_color", weight: 15, description: "Different light quality" }
                  ],
                  atmosphere: [
                    { variant: "welcoming", weight: 25, description: "Other side feels safer" },
                    { variant: "neutral", weight: 35, description: "No emotional pull" },
                    { variant: "foreboding", weight: 25, description: "Danger sense activates" },
                    { variant: "alien", weight: 15, description: "Completely foreign feeling" }
                  ]
                },
                exitEffects: {
                  sound: { variantCondition: "material=wheat_to_forest", probability: 0.5, description: "Forest sounds from across", examples: ["birds", "wind in trees", "animal calls"] },
                  smell: { variantCondition: "state=sharp", probability: 0.7, description: "Completely different smell at border", examples: ["pine", "flowers", "decay", "nothing"] },
                  visibility: { variantCondition: "state=invisible", probability: 1.0, description: "Cannot see the transition coming" },
                  accessibility: { variantCondition: "condition=contested OR state=wavering", probability: 1.0, description: "Crossing feels difficult", mechanicalEffect: "Coordination DC 10 to cross smoothly" }
                }
              }
            ]
          },
          {
            name: "Lake Dive to Aquatic Levels",
            destinationType: "level",
            destinationId: "aquatic-levels",
            spawnProbability: 20,
            description: "Swimming deep into a lake may transport to aquatic levels",
            exitTypes: [
              {
                type: "lake_depths",
                baseDescription: "The dark depths of a lake beckoning downward",
                weight: 100,
                variants: {
                  state: [
                    { variant: "calm_surface", weight: 45, description: "Still water conceals depths" },
                    { variant: "rippling", weight: 30, description: "Disturbances hint at depth" },
                    { variant: "current", weight: 15, description: "Water pulling downward" },
                    { variant: "glowing", weight: 10, description: "Light visible below" }
                  ],
                  material: [
                    { variant: "clear_water", weight: 40, description: "Can see deep down" },
                    { variant: "murky_water", weight: 35, description: "Visibility limited" },
                    { variant: "dark_water", weight: 25, description: "Cannot see bottom" }
                  ],
                  condition: [
                    { variant: "safe_looking", weight: 35, description: "Appears normal" },
                    { variant: "deep", weight: 35, description: "Obviously very deep" },
                    { variant: "bottomless", weight: 20, description: "No bottom visible" },
                    { variant: "inhabited", weight: 10, description: "Movement below" }
                  ],
                  lighting: [
                    { variant: "surface_light", weight: 40, description: "Light doesn't penetrate far" },
                    { variant: "blue_glow", weight: 25, description: "Bioluminescence below" },
                    { variant: "complete_dark", weight: 25, description: "Pitch black depths" },
                    { variant: "other_light", weight: 10, description: "Light source at bottom" }
                  ],
                  atmosphere: [
                    { variant: "mysterious", weight: 35, description: "Curiosity draws you" },
                    { variant: "peaceful", weight: 25, description: "Calm, inviting depths" },
                    { variant: "threatening", weight: 25, description: "Danger lurks below" },
                    { variant: "calling", weight: 15, description: "Something wants you to dive" }
                  ]
                },
                exitEffects: {
                  sound: { variantCondition: "state=current OR condition=inhabited", probability: 0.5, description: "Sounds from beneath the water", examples: ["rushing water", "bubbles", "whale-like calls"] },
                  smell: { variantCondition: "material=clear_water", probability: 0.3, description: "Clean water with hint of elsewhere", examples: ["salt", "ocean", "minerals"] },
                  visibility: { variantCondition: "material=dark_water OR lighting=complete_dark", probability: 1.0, description: "Cannot see what you're diving into" },
                  accessibility: { variantCondition: "condition=deep OR condition=bottomless", probability: 1.0, description: "Must dive deep to trigger transition", mechanicalEffect: "Athletics DC 12 to dive 5+ meters" }
                }
              }
            ]
          },
          {
            name: "Endless Wandering to Level 83",
            destinationType: "level",
            destinationId: "level-83",
            spawnProbability: 15,
            description: "Wandering far enough may gradually lead to Level 83",
            exitTypes: [
              {
                type: "gradual_transition",
                baseDescription: "The fields slowly change as you walk",
                weight: 100,
                variants: {
                  state: [
                    { variant: "subtle", weight: 50, description: "Changes barely noticeable" },
                    { variant: "gradual", weight: 30, description: "Slow but clear transition" },
                    { variant: "sudden_realization", weight: 15, description: "Notice you've transitioned" },
                    { variant: "disorienting", weight: 5, description: "Can't tell when it happened" }
                  ],
                  material: [
                    { variant: "wheat_thinning", weight: 40, description: "Crops become sparse" },
                    { variant: "wheat_changing", weight: 30, description: "Plants look different" },
                    { variant: "ground_changing", weight: 20, description: "Soil texture shifts" },
                    { variant: "air_changing", weight: 10, description: "Atmosphere feels different" }
                  ],
                  condition: [
                    { variant: "natural", weight: 40, description: "Feels like normal travel" },
                    { variant: "dreamlike", weight: 30, description: "Surreal quality to walk" },
                    { variant: "endless", weight: 20, description: "Walking forever" },
                    { variant: "looping", weight: 10, description: "Feels like going in circles" }
                  ],
                  lighting: [
                    { variant: "unchanged", weight: 35, description: "Same grey sky" },
                    { variant: "dimming", weight: 30, description: "Growing darker" },
                    { variant: "color_shifting", weight: 25, description: "Light taking new tint" },
                    { variant: "flickering", weight: 10, description: "Light becomes unstable" }
                  ],
                  atmosphere: [
                    { variant: "lost", weight: 40, description: "No longer know where you are" },
                    { variant: "acceptance", weight: 25, description: "Stop caring about location" },
                    { variant: "panic", weight: 20, description: "Realization of being lost" },
                    { variant: "peace", weight: 15, description: "Contentment with wandering" }
                  ]
                },
                exitEffects: {
                  sound: { variantCondition: "condition=dreamlike OR condition=endless", probability: 0.4, description: "Sounds become strange", examples: ["footsteps echo oddly", "distant music", "voices of people you know"] },
                  smell: { variantCondition: "material=air_changing", probability: 0.6, description: "Smell of the destination level", examples: ["different vegetation", "industrial", "something familiar yet wrong"] },
                  visibility: { variantCondition: "state=disorienting OR lighting=flickering", probability: 1.0, description: "Reality becomes unclear" },
                  accessibility: { variantCondition: "atmosphere=panic", probability: 1.0, description: "Fear may prevent progress", mechanicalEffect: "Discipline DC 12 to continue despite panic" }
                }
              }
            ]
          }
        ]
      },

      alwaysActive: [
        {
          name: "Dig Through Soil",
          method: "dig",
          destinationType: "special",
          destinationId: "worm-layer",
          requirements: {
            tools: [
              { type: "shovel", required: true, benefit: "Required for digging" },
              { type: "pickaxe", required: false, benefit: "Add 1 Boost die to check" }
            ],
            time: { minutes: 15, description: "15 minutes of digging to reach 1 meter depth" }
          },
          skillCheck: { skill: "Athletics", difficulty: "Easy", description: "Dig through the topsoil" },
          modifiers: [
            { condition: "partySize >= 2", effect: "Reduce time by 5 minutes", description: "Taking turns digging" },
            { condition: "groundWet", effect: "Add 1 Setback die", description: "Muddy soil is harder to dig" }
          ],
          outcomes: {
            triumph: { destinationId: "observation-only", description: "You dig carefully and observe the worm layer without disturbing it.", effects: ["loudNoise"] },
            success: { destinationId: "worm-layer", description: "At 1 meter depth, you break through into a mass of writhing worms. They begin emerging.", effects: ["loudNoise", "wormEmergence"] },
            failure: { description: "The soil is harder than expected. You make a shallow hole but don't reach the worm layer.", effects: ["loudNoise", "toolDamage20"] },
            despair: { destinationId: "worm-layer", description: "The ground collapses beneath you, dropping you into the worm mass. They immediately try to burrow into your skin.", effects: ["loudNoise", "wormAttack", "minorInjury"] }
          },
          description: "The soil is only 1 meter deep before giving way to an endless mass of worms",
          playerAction: "Player can attempt to dig into the ground to explore what lies beneath"
        }
      ]
    },

    finiteLayout: null,

    sessionVisibility: { all: true, sessions: [] },

    dmNotes: {
      runningThisLevel: "Level 10 should feel peaceful yet unsettling. The monotony of endless wheat fields under perpetual overcast sky creates psychological pressure. Players may initially feel relief at the 'safe' classification but inability to track time and endless sameness should gradually build unease.",
      atmosphereAdvice: "Emphasize sensory details: the smell of wheat grain, occasional wind gusts, earthy water taste. Every direction looks the same. Use the unchanging overcast sky to create timelessness. Players should never be quite sure how long they've been here.",
      horrorElements: "Subtle psychological horror. The wheat doesn't decompose (may not provide nutrition), worms beneath the soil that swarm if disturbed, disorienting effect of endless sameness. Families have tried settling here only to slowly weaken despite apparent abundance.",
      timeProgression: "After 4-6 hours: Difficulty tracking time, minor disorientation. After 12+ hours: Strong disorientation, arguments about duration. After 24+ hours: Inexplicable weakness if relying on level resources. Wheat may not provide real nutrition.",
      narrativeHooks: [
        "Finding abandoned settlement attempts - structures built from barn materials, empty of inhabitants",
        "Discovering things left behind don't decompose - wheat stalks, apple cores remain unchanged",
        "Encountering the worms when digging - they writhe endlessly beneath the thin soil layer",
        "Meeting survivors who've been here 'a few days' but look like they've been starving for weeks",
        "Tire tracks on paths but no vehicles ever seen - who or what made them?"
      ],
      secrets: "The wheat and barley are not truly edible - they don't decompose and provide no real nutrition. Extended stays lead to gradual starvation despite eating. The worms extend infinitely downward. Some theorize the entire level is a single organism's surface, with worms being its true form below.",
      commonMistakes: "Don't let players establish a 'safe base' too easily. Track food consumption if players rely on local wheat. The dirt paths lead to Level 11 eventually - don't let players follow indefinitely without transition. Worms are dangerous if disturbed but shouldn't be a constant threat.",
      balance: "Low-danger transitional level. For experienced parties, emphasize psychological elements and resource concerns. For new players, use as safe exploration area while foreshadowing Backrooms' deceptive nature. Entity encounters should be rare.",
      sessionNotes: {}
    }
  }
];

export default data;