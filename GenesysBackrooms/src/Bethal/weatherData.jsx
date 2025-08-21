// Weather types available in the system
export const weatherTypes = ['clear', 'rainy', 'stormy', 'foggy', 'flooded', 'eclipsed'];

// Comprehensive weather data with updated mechanics
export const weatherData = {
  clear: {
    name: 'Clear Weather',
    description: 'Perfect outdoor conditions with no weather-related penalties. Standard Genesys mechanics apply with optimal visibility and movement.',
    mechanical_effects: {
      visibility: 'Normal',
      movement: 'No penalties',
      equipment: 'No interference',
      special_rules: 'Spend 2 Advantage on Perception checks to spot additional scrap or hazards'
    },
    frequency: {
      occurrence: '15% chance all moons clear, otherwise 30-70% of moons have clear weather',
      duration: 'Full day cycle (128 rounds)'
    }
  },

  rainy: {
    name: 'Rain Storm',
    description: 'Heavy rainfall creates slippery conditions and spawns dangerous quicksand puddles that can trap unwary employees.',
    mechanical_effects: {
      visibility: '+1 Setback to Perception beyond Medium range',
      movement: '+1 Setback to Athletics and Coordination checks outdoors (slippery)',
      equipment: 'No major interference',
      quicksand: {
        initial: '3 quicksand puddles spawn at mission start (Round 0)',
        progression: 'New quicksand every 12 rounds (Rounds 12, 24, 36, 48, 60, 72, 84, 96, 108, 120)',
        detection: 'Perception (Cunning) vs Average (2 dice)',
        escape: 'Athletics (Brawn) vs Hard (3 dice)',
        drowning: '4 wounds per round after 3 rounds trapped (ignores Soak)'
      }
    },
    frequency: {
      occurrence: '25% weight when weather occurs',
      duration: 'Full day cycle'
    }
  },

  stormy: {
    name: 'Electrical Storm',
    description: 'Violent thunderstorm with frequent lightning strikes across the entire map. Metal equipment builds dangerous electrical charges.',
    mechanical_effects: {
      visibility: 'Normal during day, reduced at night',
      movement: 'No penalties',
      equipment: {
        malfunction_chance: '15% (Phase 1) → 20% (Phase 2) → 25% (Phase 3) → 30% (Phase 4)',
        lightning_detection: 'Vigilance (Cunning) vs Easy (1 die) to notice charge buildup',
        charge_levels: '3 levels: Warm → Sparking → STRIKE!'
      },
      lightning: {
        coverage: 'ENTIRE GRID exposed to lightning strikes - NO SAFE ZONES',
        frequency: 'Every 16 rounds (Phase 1) → 12 rounds → 8 rounds → 6 rounds',
        damage: '12 wounds + Critical Injury (+50) direct hit, 8 wounds + Critical (+25) area effect',
        phases: {
          1: 'Rounds 0-30: Lightning every 16 rounds, 15% equipment malfunction',
          2: 'Rounds 31-46: Lightning every 12 rounds, 20% equipment malfunction', 
          3: 'Rounds 47-62: Lightning every 8 rounds, 25% equipment malfunction',
          4: 'Rounds 63-128: Lightning every 6 rounds, 30% equipment malfunction, multiple strikes'
        }
      }
    },
    frequency: {
      occurrence: '20% weight when weather occurs',
      duration: 'Full day cycle'
    }
  },

  foggy: {
    name: 'Dense Fog',
    description: 'Thick fog that dynamically changes intensity every round, severely limiting visibility and making navigation treacherous.',
    mechanical_effects: {
      visibility: {
        level_1_2: 'Visibility to Short range only',
        level_3_4: 'Visibility to Engaged range only',
        level_5: 'Auto-fail Perception beyond Engaged range'
      },
      movement: 'Navigation checks become harder with thicker fog',
      equipment: 'Communication range reduced by 1-2 range bands',
      fog_progression: {
        starting_level: 'Level 2 (Moderate fog)',
        change_frequency: 'Every round',
        probabilities: '45% chance thicker, 15% chance same, 40% chance thinner',
        modifiers: '+X Setback dice to Perception (X = fog level)'
      },
      navigation: 'Survival (Cunning) vs Easy/Average/Hard based on familiarity'
    },
    frequency: {
      occurrence: '25% weight when weather occurs',
      duration: 'Full day cycle'
    }
  },

  flooded: {
    name: 'Flash Flooding',
    description: 'Probability-based flooding that starts by randomly affecting the lowest-elevation areas (height 0, or height 1 if no height 0 exists), then spreads to adjacent terrain.',
    mechanical_effects: {
      visibility: 'Normal above water',
      movement: {
        phase_1_2: '+1-2 Setback to movement in water, no Running',
        phase_3_4: '+2-3 Setback, limited movement in flooded zones', 
        phase_5_plus: 'Swimming required - Athletics (Brawn) vs 2-3 Difficulty'
      },
      equipment: 'Water damage risk for submerged equipment',
      flood_progression: {
        timing: 'Every 20 rounds starting at Round 20',
        phase_1: 'Round 20: 25% chance for each lowest-elevation tile to flood initially',
        elevation_targeting: 'Targets height 0 if available, otherwise height 1, etc.',
        phase_2_plus: 'Round 40, 60, 80...: 50% chance for tiles adjacent to flooded areas',
        spread_pattern: 'Floods spread organically based on chance, creating irregular patterns'
      },
      probability_mechanics: {
        initial_flooding: '25% chance per lowest-elevation tile (Round 20)',
        height_fallback: 'If no height-0 tiles exist, targets height-1 tiles instead',
        adjacent_spread: '50% chance per tile next to water (Round 40+)',
        coverage_varies: 'Flood extent depends on random chance results',
        natural_barriers: 'Ship and facility positions never flood'
      },
      drowning: {
        sequence: '2 strain (Round 1) → 3 wounds (Round 2) → 3 wounds per round',
        rescue: 'Athletics (Brawn) vs Hard (3 dice) from stable position',
        risk_areas: 'Phase 4+ creates dangerous deep water zones'
      }
    },
    frequency: {
      occurrence: '20% weight when weather occurs',
      duration: 'Full day cycle with chance-based progression'
    }
  },

  eclipsed: {
    name: 'Solar Eclipse',
    description: 'A rare and ominous solar eclipse that enhances existing entities with dark energy every 16 rounds instead of spawning new threats.',
    mechanical_effects: {
      visibility: 'Unnatural darkness, normal equipment lighting reduced',
      movement: 'No penalties',
      equipment: {
        interference: '10% (Rounds 0-15) → 15% (16-31) → 20% (32-47) → 25% (48+) malfunction chance',
        affected: 'Flashlights, radios, apparatus, zap guns'
      },
      psychological: {
        strain: '1 strain per round outside (0.5 if within Engaged range of ally)',
        fear_checks: 'Discipline (Willpower) vs Average (2 dice) when eclipse begins',
        failure_effects: '2 strain + 1 Setback to actions for 1 hour'
      },
      entity_enhancement: {
        timing: 'Every 16 rounds (0, 16, 32, 48, 64, 80, 96, 112)',
        effect: 'All existing entities gain +X power boost (X = eclipse intensity)',
        intensity_scaling: 'Round 0-15: +1, Round 16-31: +2, Round 32-47: +3, Round 48-63: +4, etc.',
        cumulative: 'Each enhancement stacks with previous boosts',
        no_spawning: 'Eclipse enhances existing threats instead of creating new ones'
      }
    },
    frequency: {
      occurrence: '10% weight when weather occurs (rarest)',
      duration: 'Full day cycle'
    }
  }
};

// Moon-specific weather compatibilities
export const moonWeatherTypes = {
  '41-Experimentation': ['clear', 'rainy', 'foggy'],
  '220-Assurance': ['clear', 'stormy', 'flooded'],
  '56-Vow': ['clear', 'rainy', 'eclipsed'],
  '21-Offense': ['clear', 'stormy', 'foggy'],
  '61-March': ['clear', 'flooded', 'eclipsed'],
  '85-Rend': ['clear', 'stormy', 'eclipsed'],
  '7-Dine': ['clear', 'rainy', 'foggy', 'flooded'],
  '8-Titan': ['clear', 'stormy', 'eclipsed'],
  '68-Artifice': ['clear', 'foggy', 'flooded'],
  '5-Embrion': ['clear', 'rainy', 'stormy', 'eclipsed']
};

export const weatherIcons = {
  clear: "☀️",
  rainy: "🌧️",
  stormy: "⚡",
  foggy: "🌫️", 
  flooded: "🌊",
  eclipsed: "🌑"
};

export default weatherData;