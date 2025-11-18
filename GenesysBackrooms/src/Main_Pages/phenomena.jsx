import React, { useState, useEffect } from 'react';
import { collection, doc, onSnapshot, query, updateDoc, setDoc } from "firebase/firestore";
import db from '../Components/firebase';
import PhenomenonItem from "../Components/phenomenonItem";
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

// Sample phenomena data
const phenomenaData = [
  {
    // === BASIC INFO ===
    name: "Arcane Storm",
    phenomenon_type: "Environmental",
    classification_tags: ["Weather", "Magic", "Hostile"],
    
    // === DESCRIPTION ===
    short_description: "A violent storm of raw magical energy",
    full_description: "An arcane storm manifests as swirling clouds of multicolored energy that crackle with raw magical power. The air itself seems to warp and shimmer as reality struggles to contain the overwhelming magical forces.",
    
    // === TRIGGER/OCCURRENCE ===
    trigger_type: "Location-based",
    trigger_conditions: "Occurs in areas with high ambient magic or near ley line intersections",
    frequency: "Rare",
    duration: "1d10 hours",
    
    // === MECHANICAL EFFECTS ===
    mechanical_effects: {
      primary_effect: {
        description: "All magic-related skill checks upgrade difficulty once",
        game_impact: "Increases risk of magical mishaps and makes spellcasting more dangerous"
      },
      secondary_effects: [
        {
          description: "Technological devices suffer 2 setback dice",
          game_impact: "Makes technology unreliable"
        },
        {
          description: "Magically-attuned beings gain +1 strain recovery when resting",
          game_impact: "Some benefit from the magical saturation"
        }
      ],
      special_conditions: "Casting magic during the storm has a 25% chance to trigger a wild magic surge"
    },
    
    // === RANGE (GENESYS) ===
    range: "Extreme",
    range_description: "Affects all within a 5 kilometer radius. Edge effects are less severe.",
    
    // === AFFECTED TARGETS ===
    affects: {
      characters: true,
      entities: true,
      environment: true,
      objects: true
    },
    affect_details: "All characters and entities within range. Magical items resonate, technology malfunctions, physical environment becomes unstable.",
    
    // === SEVERITY & DANGER ===
    severity: "Moderate",
    threat_level: "Medium",
    can_be_deadly: true,
    lethality_conditions: "Extended exposure without magical protection can cause strain damage",
    
    // === INTERACTION & COUNTERPLAY ===
    can_be_resisted: true,
    resistance_method: "Resilience check (Hard, 3 difficulty) to ignore strain damage",
    can_be_dispelled: true,
    dispel_method: "Requires multiple powerful mages working in concert or a ley line ritual",
    can_be_avoided: true,
    avoidance_method: "Leave the affected area or seek magically-shielded shelter",
    can_be_exploited: true,
    exploitation_method: "Mages can attempt to harness the wild energy for powerful but risky spells",
    
    // === DETECTION & WARNING ===
    detection_difficulty: "Easy",
    detection_skills: ["Arcana", "Perception", "Survival"],
    warning_signs: [
      "Animals become agitated and flee the area",
      "Compass needles spin wildly",
      "Hair stands on end, metallic taste in the air",
      "Distant thunder and flashes of colored lightning"
    ],
    advance_warning_time: "30 minutes to 2 hours",
    
    // === STORY & LORE ===
    lore_text: "Arcane storms have plagued the realm since the Sundering, when the barriers between planes were weakened. Mages study them hoping to understand the fundamental nature of magic itself.",
    known_origins: "Created by ley line disruptions, planar breaches, or catastrophic magical events",
    historical_occurrences: "The Great Storm of 1247 lasted three weeks and transformed the Eastern Wastes into a magical dead zone",
    
    // === DM NOTES ===
    dm_notes: "Use arcane storms to create tension and force difficult decisions. Players must choose between pushing through danger or losing time seeking shelter. The storm's intensity can vary - roll 1d10 when it begins: 1-3 intensifies (upgrade difficulty twice), 4-7 standard effects, 8-10 weakens early.",
    dm_secrets: "Storms can be artificially created by powerful artifacts. The BBEG may be using one to hide their activities or prevent pursuit.",
    procedural_notes: "Track exposure time. Each hour in the storm without proper shelter requires a Resilience check or suffer 1 strain. Magical equipment may require checks to function properly. Wild magic surges should be creative and unpredictable.",
    encounter_ideas: [
      "Rescue civilians trapped in the storm",
      "Magical entities emerge from ley lines during peak intensity",
      "Rival mages attempt to harness the storm's power for their own purposes"
    ],
    
    // === VARIANTS & SCALING ===
    has_variants: true,
    variants: [
      {
        name: "Minor Arcane Disturbance",
        severity: "Minor",
        range: "Short",
        duration: "1d6 minutes",
        mechanical_effect: "Magic checks add 1 setback die"
      },
      {
        name: "Cataclysmic Mana Vortex",
        severity: "Catastrophic",
        range: "Strategic",
        duration: "1d6 days",
        mechanical_effect: "All magic checks upgrade difficulty twice, wild magic on any Despair"
      }
    ],
    
    // === RELATED CONTENT ===
    related_phenomena: ["Mana Drought", "Ley Line Surge", "Planar Bleed"],
    related_locations: ["The Shattered Peaks", "Crystal Wastes"],
    related_npcs: ["Archmage Velara", "Storm Rider Cultists"],
    
    // === NATURAL OUTCOMES ===
    aftermath: "Survivors may experience lingering magical sensitivity for 1-2 days, with occasional minor sparks or unusual magical perceptions. Equipment that malfunctioned during the storm typically returns to normal function once the phenomenon ends. Locals may view survivors with a mix of respect and superstitious wariness, sometimes calling them 'storm-touched,' though this provides no mechanical benefit. In rare cases, fragments of crystallized mana can be found in areas where the storm was most intense.",
    
    // === METADATA ===
    phenomenon_image_url: null,
    tags: ["Combat", "Exploration", "Magic", "Hazard"],
    sessionVisibility: {}
  },
  
  {
    // === BASIC INFO ===
    name: "Temporal Echo",
    phenomenon_type: "Temporal",
    classification_tags: ["Time", "Investigation", "Benign"],
    
    // === DESCRIPTION ===
    short_description: "Ghostly replays of past events bleeding through time",
    full_description: "Temporal echoes are fragments of the past that replay themselves in the present. Translucent, ghostly figures repeat actions from days, years, or centuries ago, completely unaware of modern observers. These are not illusions but actual temporal anomalies.",
    
    // === TRIGGER/OCCURRENCE ===
    trigger_type: "Location-based",
    trigger_conditions: "Occurs at sites of extreme trauma, historical significance, or temporal instability",
    frequency: "Uncommon",
    duration: "1d6 hours, repeating daily at the same time",
    
    // === MECHANICAL EFFECTS ===
    mechanical_effects: {
      primary_effect: {
        description: "All Perception checks related to the present upgrade difficulty once",
        game_impact: "Sensory confusion from overlapping timelines makes observing current events harder"
      },
      secondary_effects: [
        {
          description: "History or Lore checks gain 2 boost dice when investigating past events",
          game_impact: "Characters can learn historical information directly by observation"
        },
        {
          description: "Initiative checks add 1 setback die",
          game_impact: "Temporal disorientation affects combat readiness"
        }
      ],
      special_conditions: "On Despair during any check, character briefly experiences the echo firsthand and suffers strain equal to the emotional trauma (typically 2-4 strain)"
    },
    
    // === RANGE (GENESYS) ===
    range: "Short",
    range_description: "Affects a specific location, typically 10-50 meters radius",
    
    // === AFFECTED TARGETS ===
    affects: {
      characters: true,
      entities: false,
      environment: false,
      objects: false
    },
    affect_details: "Only affects characters capable of perceiving the past. The echoes themselves cannot be interacted with.",
    
    // === SEVERITY & DANGER ===
    severity: "Minor",
    threat_level: "Low",
    can_be_deadly: false,
    lethality_conditions: "Not directly lethal, though intense emotional trauma from experiencing echoes can be psychologically damaging",
    
    // === INTERACTION & COUNTERPLAY ===
    can_be_resisted: true,
    resistance_method: "Discipline check (Average, 2 difficulty) to mentally block out the echo and focus on the present",
    can_be_dispelled: true,
    dispel_method: "Resolving the historical trauma or using temporal magic to seal the temporal breach",
    can_be_avoided: true,
    avoidance_method: "Leave the affected area or return at a different time of day",
    can_be_exploited: true,
    exploitation_method: "Use echoes to gather intelligence about past events, solve mysteries, or find hidden treasures",
    
    // === DETECTION & WARNING ===
    detection_difficulty: "Automatic",
    detection_skills: ["Perception", "Vigilance"],
    warning_signs: [
      "Sense of déjà vu or temporal displacement",
      "Cold spots in the air",
      "Faint sounds or whispers from the past",
      "Flickering lights or shadows"
    ],
    advance_warning_time: "1-5 minutes before echoes become visible",
    
    // === STORY & LORE ===
    lore_text: "Temporal echoes are wounds in time itself, created when events of great emotional or magical intensity leave permanent impressions on reality. Scholars debate whether they are mere recordings or if the past truly reaches forward.",
    known_origins: "Battlefields, sites of betrayal, murder scenes, powerful magical rituals, or places where the veil between times is thin",
    historical_occurrences: "The Palace of Echoes replays the assassination of King Aldric every night at midnight. Investigators have used this to identify the true killer.",
    
    // === DM NOTES ===
    dm_notes: "Temporal echoes are excellent investigation tools. Use them to reveal backstory, provide clues, or create atmospheric moments. They work best when the past event is emotionally significant. Consider having players roleplay being briefly 'possessed' by echo participants.",
    dm_secrets: "The echoes can sometimes be manipulated by powerful temporal mages. The BBEG might be using fake echoes to mislead investigators, or could be trying to prevent characters from witnessing a revealing echo.",
    procedural_notes: "When characters first encounter an echo, have each player make a Discipline check. Those who fail become transfixed and may act out behaviors from the echo for 1 round. Repeated exposure to the same echo grants boost dice to resist.",
    encounter_ideas: [
      "Solve a centuries-old murder by watching it replay",
      "Learn the location of a hidden treasure from observing past thieves",
      "Discover a betrayal that led to a kingdom's fall",
      "Witness the last moments of a legendary hero"
    ],
    
    // === VARIANTS & SCALING ===
    has_variants: true,
    variants: [
      {
        name: "Temporal Whisper",
        severity: "Minor",
        range: "Personal",
        duration: "1d6 minutes",
        mechanical_effect: "Only auditory echoes, no visual. Add 1 boost to investigation checks."
      },
      {
        name: "Time Loop",
        severity: "Major",
        range: "Medium",
        duration: "Until broken",
        mechanical_effect: "Area repeats the same hour over and over. Characters must succeed at Hard Discipline check to remember previous loops."
      }
    ],
    
    // === RELATED CONTENT ===
    related_phenomena: ["Time Dilation Field", "Causal Paradox", "Chrono-Sickness"],
    related_locations: ["The Palace of Echoes", "Temporal Rift Caverns", "Battle of Crimson Fields"],
    related_npcs: ["Chronos the Timekeeper", "Ghost of Lady Elara"],
    
    // === NATURAL OUTCOMES ===
    aftermath: "Characters who witness temporal echoes often report lingering déjà vu sensations for several days. Those who experienced echoes firsthand (via Despair) may have intrusive memories or brief flashbacks to the event. Some individuals develop a permanent sensitivity to temporal anomalies, sensing them more easily in the future. The emotional weight of witnessing traumatic historical events can be significant - DMs should allow characters time to process what they've seen.",
    
    // === METADATA ===
    phenomenon_image_url: null,
    tags: ["Investigation", "Social", "Mystery", "Non-Combat"],
    sessionVisibility: {}
  },
  
  {
    // === BASIC INFO ===
    name: "Flesh Meld",
    phenomenon_type: "Physical",
    classification_tags: ["Body Horror", "Hostile", "Contagious"],
    
    // === DESCRIPTION ===
    short_description: "Living tissue unnaturally merges and fuses together",
    full_description: "Flesh Meld is a horrifying phenomenon where the bodies of living creatures in close proximity begin to merge. Skin, muscle, and bone blur together at contact points, creating grotesque amalgamations. What begins as warm tingling quickly becomes excruciating as individual forms lose distinction.",
    
    // === TRIGGER/OCCURRENCE ===
    trigger_type: "Conditional",
    trigger_conditions: "Triggered by forbidden biological experiments, necromantic rituals, consuming tainted flesh, or exposure to mutagenic substances",
    frequency: "Very Rare",
    duration: "Permanent until treated or cured",
    
    // === MECHANICAL EFFECTS ===
    mechanical_effects: {
      primary_effect: {
        description: "Hard (3 difficulty) Resilience check each hour or take 4 wounds as tissue merges",
        game_impact: "Progressive physical damage that can kill if untreated"
      },
      secondary_effects: [
        {
          description: "All Agility and Brawn checks upgrade difficulty once",
          game_impact: "Physical capabilities severely hampered by fusion"
        },
        {
          description: "Damage dealt to one merged entity is divided among all merged individuals",
          game_impact: "Shared pain distributes injury across the merged mass"
        },
        {
          description: "Cannot move more than Engaged range from merged partners",
          game_impact: "Movement severely restricted, tactical positioning impossible"
        }
      ],
      special_conditions: "If all merged creatures drop to 0 wounds while still fused, they transform into a single horrific entity controlled by the DM with combined wound threshold and abilities"
    },
    
    // === RANGE (GENESYS) ===
    range: "Engaged",
    range_description: "Only affects creatures in direct physical contact with each other",
    
    // === AFFECTED TARGETS ===
    affects: {
      characters: true,
      entities: true,
      environment: false,
      objects: false
    },
    affect_details: "Any living creature with physical form. Constructs, undead, and incorporeal beings are immune.",
    
    // === SEVERITY & DANGER ===
    severity: "Severe",
    threat_level: "High",
    can_be_deadly: true,
    lethality_conditions: "If not treated, victims will eventually die from tissue damage and transformation. Death occurs when wounds exceed threshold.",
    
    // === INTERACTION & COUNTERPLAY ===
    can_be_resisted: true,
    resistance_method: "Resilience check each hour (Hard, 3 difficulty). Success prevents wound damage for that hour.",
    can_be_dispelled: true,
    dispel_method: "Powerful healing magic, surgical separation (requires Medicine check at Daunting difficulty), or neutralizing the source",
    can_be_avoided: true,
    avoidance_method: "Avoid physical contact with others once phenomenon begins. Maintain at least Short range from others.",
    can_be_exploited: false,
    exploitation_method: "None - this phenomenon offers no benefits",
    
    // === DETECTION & WARNING ===
    detection_difficulty: "Average",
    detection_skills: ["Medicine", "Perception", "Survival"],
    warning_signs: [
      "Warm tingling sensation at contact points",
      "Skin appears unusually adhesive or sticky",
      "Minor pain or itching where bodies touch",
      "Visible blurring of skin boundaries"
    ],
    advance_warning_time: "5-15 minutes before merging becomes irreversible without magical intervention",
    
    // === STORY & LORE ===
    lore_text: "Flesh Meld was first documented as a curse created by the mad biomancer Vexith. It has since appeared sporadically wherever forbidden biological experiments are conducted. Some theorize it's a disease that exists outside normal biological laws.",
    known_origins: "Forbidden biomancy, failed resurrection attempts, consuming flesh from melded creatures, exposure to The Flesh Pits",
    historical_occurrences: "The Tragedy of Rothdale - an entire village merged into a single massive entity after consuming tainted meat. The creature still lives in the ruins.",
    
    // === DM NOTES ===
    dm_notes: "Flesh Meld creates horror and urgency. Use it sparingly for maximum impact. Give players clear warning signs and options to prevent it. This is body horror - ensure your table is comfortable with this content before introducing it. The phenomenon works best as a ticking clock scenario.",
    dm_secrets: "Some cults deliberately use Flesh Meld to create flesh golems or living weapons. The merged entity retains fragments of all absorbed personalities, creating internal conflict. Characters might hear the voices of previous victims calling for help from within an amalgam.",
    procedural_notes: "Track each merged character's wounds separately until fully merged. Once fully merged, combine all attributes and wounds into single entity stat block. Separation before full merging is possible but painful (3 wounds to each party).",
    encounter_ideas: [
      "Rescue victims from a Flesh Meld event before they fully merge",
      "Battle a massive merged entity that was once a group of adventurers",
      "Investigate the source of a Flesh Meld outbreak in a city district",
      "Prevent a cult from using Flesh Meld to create a living weapon"
    ],
    
    // === VARIANTS & SCALING ===
    has_variants: true,
    variants: [
      {
        name: "Partial Fusion",
        severity: "Moderate",
        range: "Engaged",
        duration: "1d6 hours",
        mechanical_effect: "Only hands/limbs merge. Upgrade difficulty once on physical checks. Separable with Medicine check."
      },
      {
        name: "Flesh Tide",
        severity: "Catastrophic",
        range: "Short",
        duration: "Permanent",
        mechanical_effect: "Airborne contagion. All within Short range must resist each round or begin merging."
      }
    ],
    
    // === RELATED CONTENT ===
    related_phenomena: ["Biological Rejection", "Cellular Cascade", "The Hunger"],
    related_locations: ["The Flesh Pits", "Vexith's Laboratory", "Rothdale Ruins"],
    related_npcs: ["Vexith the Biomancer", "The Rothdale Amalgam", "Surgeon-Priest Kael"],
    
    // === NATURAL OUTCOMES ===
    aftermath: "Successfully separated individuals bear permanent scars at fusion points - thick, discolored scar tissue that is numb to touch. Psychological trauma from the experience is severe and long-lasting; nightmares and phantom sensations are common. Those who were partially merged may experience discomfort, itching, or phantom pain when near the other person. Characters may develop a phobia of physical contact. The experience is profoundly dehumanizing - DMs should handle the emotional aftermath with care and allow characters time to process the trauma. In extreme cases, separated individuals may retain fragments of each other's memories or feel an unsettling connection.",
    
    // === METADATA ===
    phenomenon_image_url: null,
    tags: ["Horror", "Combat", "Survival", "Body Horror"],
    sessionVisibility: {}
  },
  
  {
    // === BASIC INFO ===
    name: "Crowd Euphoria",
    phenomenon_type: "Social",
    classification_tags: ["Emotion", "Crowds", "Benign"],
    
    // === DESCRIPTION ===
    short_description: "Infectious wave of overwhelming happiness spreads through crowds",
    full_description: "Crowd Euphoria is a social phenomenon where positive emotions in large gatherings amplify and spread exponentially. What begins as genuine celebration becomes an almost manic state of bliss. People laugh uncontrollably, embrace strangers, and act with complete lack of inhibition. Rational thought diminishes as collective joy takes over.",
    
    // === TRIGGER/OCCURRENCE ===
    trigger_type: "Conditional",
    trigger_conditions: "Requires large celebration, festival, victory speech, or gathering where positive emotions run high (50+ people minimum)",
    frequency: "Uncommon",
    duration: "2d6 hours or until crowd disperses",
    
    // === MECHANICAL EFFECTS ===
    mechanical_effects: {
      primary_effect: {
        description: "All social checks within the crowd add 2 boost dice",
        game_impact: "People become extremely receptive to suggestions and social influence"
      },
      secondary_effects: [
        {
          description: "Discipline and Vigilance checks upgrade difficulty once",
          game_impact: "Rational judgment and awareness severely impaired"
        },
        {
          description: "Affected individuals recover 2 strain per hour",
          game_impact: "The euphoria is physically and mentally restorative"
        },
        {
          description: "Suggestions spread rapidly - one successful Leadership or Charm check affects entire crowd",
          game_impact: "Herd mentality allows one person to direct large groups"
        }
      ],
      special_conditions: "On Triumph during social check, character can redirect entire crowd's mood or send them in a specific direction. On Despair, character gets trampled or swept away (3 wounds)."
    },
    
    // === RANGE (GENESYS) ===
    range: "Medium",
    range_description: "Spreads from person to person through social contact. Can affect entire city districts if unchecked.",
    
    // === AFFECTED TARGETS ===
    affects: {
      characters: true,
      entities: true,
      environment: false,
      objects: false
    },
    affect_details: "Affects all sentient beings capable of emotional contagion. Those with very high Discipline may resist.",
    
    // === SEVERITY & DANGER ===
    severity: "Minor",
    threat_level: "Low",
    can_be_deadly: false,
    lethality_conditions: "Not directly lethal, but poor judgment during euphoria can lead to accidents, trampling, or mob violence. Indirect deaths possible.",
    
    // === INTERACTION & COUNTERPLAY ===
    can_be_resisted: true,
    resistance_method: "Discipline check (Average, 2 difficulty) to maintain emotional control. Must be repeated each hour.",
    can_be_dispelled: true,
    dispel_method: "Introduce strong negative emotion (shocking news, violence) or disperse the crowd physically",
    can_be_avoided: true,
    avoidance_method: "Stay away from large gatherings or maintain emotional distance through meditation/focus",
    can_be_exploited: true,
    exploitation_method: "Manipulate crowds for political purposes, start riots disguised as celebrations, or extract information from uninhibited people",
    
    // === DETECTION & WARNING ===
    detection_difficulty: "Easy",
    detection_skills: ["Perception", "Vigilance", "Charm"],
    warning_signs: [
      "Laughter becomes slightly too loud and prolonged",
      "People start embracing strangers",
      "Rational conversation becomes difficult",
      "Crowd begins moving as one organism"
    ],
    advance_warning_time: "10-30 minutes as euphoria gradually builds",
    
    // === STORY & LORE ===
    lore_text: "Crowd Euphoria is believed to be a natural resonance of collective consciousness. Some philosophers argue it proves the existence of a shared emotional field. Others see it as evidence of humanity's herd instincts.",
    known_origins: "Large celebrations, religious ecstasy, victory rallies, festivals. Can be artificially induced by certain drugs or magic.",
    historical_occurrences: "The Coronation Festival of King Jareth IV lasted three days as Crowd Euphoria swept the capital. The king passed twelve new laws during this time that were later regretted.",
    
    // === DM NOTES ===
    dm_notes: "Crowd Euphoria is great for social encounters and political intrigue. Players might exploit it, or be caught in it themselves. It's not inherently good or evil - depends on who's using it. Can create interesting moral dilemmas when characters must break the euphoria to prevent harm.",
    dm_secrets: "Certain groups (cults, political movements) have learned to artificially trigger Crowd Euphoria to control masses. The BBEG might use this to start a false revolution or manipulate elections. Some discover too late that the euphoria was magically enhanced.",
    procedural_notes: "Track duration and intensity. As euphoria builds, increase boost dice but also increase consequences of Despair (trampling, mob violence). Consider having players make increasingly difficult Discipline checks to avoid being swept up.",
    encounter_ideas: [
      "Political rally where players must resist euphoria to spot an assassination attempt",
      "Cult uses euphoria to recruit new members en masse",
      "Players must break crowd euphoria to prevent them from marching into danger",
      "Character accidentally triggers euphoria and must deal with consequences"
    ],
    
    // === VARIANTS & SCALING ===
    has_variants: true,
    variants: [
      {
        name: "Mild Excitement",
        severity: "Minor",
        range: "Short",
        duration: "1d6 hours",
        mechanical_effect: "Add 1 boost die to social checks. No other penalties."
      },
      {
        name: "Berserker Joy",
        severity: "Major",
        range: "Long",
        duration: "1d6 days",
        mechanical_effect: "Crowd becomes violently ecstatic. All attacks add 1 success. Crowd will fight anyone who threatens their joy."
      }
    ],
    
    // === RELATED CONTENT ===
    related_phenomena: ["Mass Hysteria", "Emotional Resonance", "The Singing"],
    related_locations: ["Festival Grounds", "Victory Square", "The Grand Amphitheater"],
    related_npcs: ["Demagogue Varro", "High Priestess of Joy", "The Smiling Man"],
    
    // === NATURAL OUTCOMES ===
    aftermath: "Once the euphoria fades, many participants experience a 'crash' - feelings of exhaustion, mild depression, or embarrassment about their uninhibited behavior. Some may have made promises, agreements, or declarations they don't remember or regret. Minor injuries from being jostled in crowds are common (bruises, sprained ankles, lost items). Characters may find they've become fast friends with strangers they met during the event, or alternatively, may have made enemies by saying something inappropriate. The social bonds formed during euphoria can be surprisingly strong, though whether they're genuine is up to interpretation. People may approach characters days later with 'Remember me? We were best friends at the festival!'",
    
    // === METADATA ===
    phenomenon_image_url: null,
    tags: ["Social", "Non-Combat", "Intrigue", "Crowds"],
    sessionVisibility: {}
  },
  
  {
    // === BASIC INFO ===
    name: "Void Tear",
    phenomenon_type: "Cosmic",
    classification_tags: ["Planar", "Catastrophic", "Existential"],
    
    // === DESCRIPTION ===
    short_description: "A rift in reality revealing the vast emptiness beyond existence",
    full_description: "A Void Tear is a crack in the fabric of reality itself, revealing the infinite, incomprehensible emptiness that exists between planes. The tear appears as a jagged wound in space, bordered by fractured reality. Beyond it lies absolute nothingness - not darkness, but the absence of existence. The tear pulls at matter, energy, and even concepts, threatening to unmake everything nearby.",
    
    // === TRIGGER/OCCURRENCE ===
    trigger_type: "Story-triggered",
    trigger_conditions: "Created by catastrophic magical failure, planar convergence, divine intervention, or deliberate high-level ritual",
    frequency: "Unique",
    duration: "Permanent until sealed through major quest",
    
    // === MECHANICAL EFFECTS ===
    mechanical_effects: {
      primary_effect: {
        description: "Everything within range moves one range band closer to the tear per round (Extreme→Long→Medium→Short→Engaged→consumed)",
        game_impact: "Inevitable progression toward annihilation creates desperate urgency"
      },
      secondary_effects: [
        {
          description: "All skill checks add 1 difficulty die as fundamental physics break down",
          game_impact: "Reality becomes unreliable, even basic actions become difficult"
        },
        {
          description: "Looking directly at tear requires Daunting (4 difficulty) Discipline check or suffer Critical Injury",
          game_impact: "Mortal minds cannot comprehend true void without breaking"
        },
        {
          description: "When casting magic, roll 1d10: 1-3 spell backfires catastrophically, 8-10 spell amplifies beyond control",
          game_impact: "Magic becomes dangerously unpredictable near tears"
        }
      ],
      special_conditions: "Entities pulled into the tear are ERASED from existence - no body remains, no resurrection possible, no afterlife. They simply cease to have ever been. Reality retroactively adjusts to their absence."
    },
    
    // === RANGE (GENESYS) ===
    range: "Strategic",
    range_description: "Affects everything within several kilometers. Pull effect starts at Extreme range and increases exponentially as distance closes.",
    
    // === AFFECTED TARGETS ===
    affects: {
      characters: true,
      entities: true,
      environment: true,
      objects: true
    },
    affect_details: "Affects literally everything - matter, energy, magic, concepts, souls. Nothing is immune except artifacts specifically designed to resist void.",
    
    // === SEVERITY & DANGER ===
    severity: "Catastrophic",
    threat_level: "Extreme",
    can_be_deadly: true,
    lethality_conditions: "Absolutely lethal. Being pulled into the void means complete erasure from existence. This is worse than death - you never existed at all.",
    
    // === INTERACTION & COUNTERPLAY ===
    can_be_resisted: false,
    resistance_method: "Cannot be resisted - only delayed. Characters can try to move away but the pull is inexorable.",
    can_be_dispelled: true,
    dispel_method: "Requires legendary artifact, direct divine intervention, or completion of an epic quest to seal the tear. Not simply dispellable.",
    can_be_avoided: true,
    avoidance_method: "Stay beyond Extreme range. Evacuate entire region. Build barriers (though these will eventually fail).",
    can_be_exploited: false,
    exploitation_method: "None. There is no benefit to void exposure. Anyone claiming otherwise is lying or insane.",
    
    // === DETECTION & WARNING ===
    detection_difficulty: "Automatic",
    detection_skills: ["None needed - immediately obvious"],
    warning_signs: [
      "Reality becomes increasingly unstable in the region",
      "Gravitational anomalies detected",
      "Stars disappear from night sky",
      "Prophecies and divine warnings",
      "Mass exodus of animals and magical creatures"
    ],
    advance_warning_time: "Days to weeks before tear opens, depending on cause",
    
    // === STORY & LORE ===
    lore_text: "Void Tears are the most dangerous phenomenon in existence. In the First Age, the Archmage Collective accidentally created one that consumed an entire kingdom before being sealed. The Void Between Realms is not meant to touch mortal reality - when it does, existence itself recoils.",
    known_origins: "Failed ascension rituals, multiple simultaneous planar breaches, gods dying violently, reality itself being damaged by immense power",
    historical_occurrences: "The Kingdom of Aethermoor vanished in 342 AE when their ritual to achieve godhood failed. No ruins remain. No one remembers it ever existed except those protected by divine intervention.",
    
    // === DM NOTES ===
    dm_notes: "Void Tears are campaign-ending threats. Use them as ultimate stakes. The quest to seal it should be the climax of your campaign. Do not use lightly - this fundamentally changes your world. Players should feel the weight of this threat. Make NPCs terrified. Show consequences early (minor tears consuming objects or NPCs).",
    dm_secrets: "Some beings (ancient entities, outer gods) deliberately create Void Tears to unmake reality. The BBEG might be trying to open one as their ultimate plan. Sealing requires sacrifice - someone or something must be permanently given up. The ritual might require a character's sacrifice, or the destruction of a powerful artifact, or the willing sacrifice of a god.",
    procedural_notes: "Track distance from tear each round. Anyone at Engaged range at start of round is consumed. Allow creative solutions (teleportation, time magic, reality anchors) but make the threat feel real and unstoppable. The tear's pull should be a constant background threat during the finale.",
    encounter_ideas: [
      "Race against time to gather artifacts needed for sealing ritual",
      "Hold the line against void-touched entities while ritual completes",
      "One character must sacrifice themselves to seal the tear permanently",
      "Evacuate a city before the tear reaches it"
    ],
    
    // === VARIANTS & SCALING ===
    has_variants: true,
    variants: [
      {
        name: "Void Crack",
        severity: "Severe",
        range: "Long",
        duration: "1d6 days",
        mechanical_effect: "Small tear that pulls at Short range. Can be sealed by powerful mage. Still extremely dangerous."
      },
      {
        name: "Planar Collapse",
        severity: "Catastrophic",
        range: "Unlimited",
        duration: "Permanent",
        mechanical_effect: "Multiple tears combine. Entire plane of existence being unmade. Requires divine intervention to stop."
      }
    ],
    
    // === RELATED CONTENT ===
    related_phenomena: ["Planar Bleed", "Reality Breakdown", "The Unmaking"],
    related_locations: ["Site of Aethermoor", "The Sealed Tear", "Void-Touched Wastes"],
    related_npcs: ["The Seal Keepers", "Void Prophet", "Gods of the Veil"],
    
    // === NATURAL OUTCOMES ===
    aftermath: "If a Void Tear is successfully sealed, reality slowly stabilizes over weeks or months, but the area remains permanently scarred. The location becomes a 'dead zone' where magic behaves unpredictably and reality feels thin. Survivors experience profound existential dread - they witnessed the end of everything and barely escaped. Many develop conditions akin to severe PTSD, with nightmares of falling into infinite nothingness. Some become obsessed with preventing future tears, dedicating their lives to studying planar stability. The event becomes legend, but few truly comprehend what was at stake. Those who were close to the tear and survived may find that small objects occasionally disappear from their vicinity, or experience moments where they feel they're 'flickering' out of existence briefly. Reality itself remembers the wound.",
    
    // === METADATA ===
    phenomenon_image_url: null,
    tags: ["Campaign Climax", "Cosmic Horror", "Epic", "Existential"],
    sessionVisibility: {}
  }
];

export default function Phenomena() {
  const [phenomena, setPhenomena] = useState([]);
  const [activePhenomena, setActivePhenomena] = useState([]);
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [showHiddenOnly, setShowHiddenOnly] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const [selectedPhenomenon, setSelectedPhenomenon] = useState(null);
  
  const sessionId = getActiveSession();
  const userIsDM = isDM();

  const showToast = (message, severity = 'success') => {
    setToast({ open: true, message, severity });
  };

  const hideToast = () => {
    setToast({ ...toast, open: false });
  };

  const addData = async () => {
    if (!userIsDM) {
      showToast('Only DMs can upload phenomenon data', 'error');
      return;
    }

    try {
      for(let i = 0; i < phenomenaData.length; i++) {
        await setDoc(doc(db, 'Phenomena', phenomenaData[i].name), {
          ...phenomenaData[i],
          sessionVisibility: {}
        });
      }
      showToast('Phenomena data added successfully!');
    } catch (error) {
      showToast('Error adding phenomena data', 'error');
      console.error(error);
    }
  };

  const getFromDB = () => {
    if (!sessionId) return;

    const q = query(collection(db, 'Phenomena'));
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
      setPhenomena(queryData);
      setLoading(false);
    });

    return () => { unsub(); };
  };

  const togglePhenomenonVisibility = async (phenomenon) => {
    if (!userIsDM || !sessionId) return;
    
    try {
      const currentSessionVisibility = phenomenon.sessionVisibility || {};
      const newVisibility = {
        ...currentSessionVisibility,
        [sessionId]: currentSessionVisibility[sessionId] === false ? true : false
      };

      await updateDoc(doc(db, 'Phenomena', phenomenon.docId), {
        sessionVisibility: newVisibility
      });
      
      const action = newVisibility[sessionId] === false ? 'hidden' : 'revealed';
      showToast(`${phenomenon.name} ${action} for this session`, 'success');
    } catch (error) {
      console.error('Error toggling visibility:', error);
      showToast('Error updating phenomenon visibility', 'error');
    }
  };

  const toggleActivePhenomenon = async (phenomenon) => {
    if (!userIsDM || !sessionId) return;

    try {
      const isActive = activePhenomena.some(p => p.name === phenomenon.name);
      
      let updatedActive;
      if (isActive) {
        updatedActive = activePhenomena.filter(p => p.name !== phenomenon.name);
        showToast(`${phenomenon.name} deactivated`, 'success');
      } else {
        updatedActive = [...activePhenomena, {
          name: phenomenon.name,
          activated_at: new Date().toISOString()
        }];
        showToast(`${phenomenon.name} activated`, 'success');
      }

      await updateDoc(doc(db, 'Sessions', sessionId), {
        activePhenomena: updatedActive
      });
    } catch (error) {
      console.error('Error toggling phenomenon:', error);
      showToast('Error updating phenomenon', 'error');
    }
  };

  useEffect(() => {
    if (!requireSession()) return;
    if (localStorage.getItem("loggedIn") !== 'false') {
      getFromDB();
      
      // Listen to active phenomena
      if (sessionId) {
        const unsubscribe = onSnapshot(doc(db, 'Sessions', sessionId), (docSnapshot) => {
          if (docSnapshot.exists()) {
            const data = docSnapshot.data();
            setActivePhenomena(data.activePhenomena || []);
          }
        });
        return () => unsubscribe();
      }
    }
  }, [sessionId]);

  const getUniqueTypes = () => {
    const types = [...new Set(phenomena.map(phenomenon => phenomenon.phenomenon_type).filter(type => type && typeof type === 'string' && type.trim() !== ''))];
    return types.sort();
  };

  const getUniqueSeverities = () => {
    const severities = [...new Set(phenomena.map(phenomenon => phenomenon.severity).filter(severity => severity && typeof severity === 'string' && severity.trim() !== ''))];
    return severities.sort();
  };

  const getUniqueLocations = () => {
    const locations = [...new Set(phenomena.map(phenomenon => phenomenon.location).filter(location => location && typeof location === 'string' && location.trim() !== ''))];
    return locations.sort();
  };

  const getFilteredPhenomena = () => {
    return phenomena.filter(phenomenon => {
      const visibilityCheck = userIsDM ? true : !phenomenon.hiddenInCurrentSession;
      const hiddenFilterCheck = showHiddenOnly ? phenomenon.hiddenInCurrentSession : true;

      const matchesName = !name || 
        (phenomenon.name && phenomenon.name.toLowerCase().includes(name.toLowerCase())) ||
        (phenomenon.short_description && phenomenon.short_description.toLowerCase().includes(name.toLowerCase())) ||
        (phenomenon.full_description && phenomenon.full_description.toLowerCase().includes(name.toLowerCase()));

      const matchesType = !type || (phenomenon.phenomenon_type && phenomenon.phenomenon_type === type);
      const matchesSeverity = !severityFilter || (phenomenon.severity && phenomenon.severity === severityFilter);
      const matchesLocation = !locationFilter || (phenomenon.location && phenomenon.location === locationFilter);

      return visibilityCheck && hiddenFilterCheck && matchesName && matchesType && matchesSeverity && matchesLocation;
    });
  };

  const clearAllFilters = () => {
    setName('');
    setType('');
    setSeverityFilter('');
    setLocationFilter('');
    setShowHiddenOnly(false);
    showToast('All filters cleared');
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (name !== '') count++;
    if (type !== '') count++;
    if (severityFilter !== '') count++;
    if (locationFilter !== '') count++;
    if (showHiddenOnly) count++;
    return count;
  };

  if (localStorage.getItem("loggedIn") === 'false') {
    return <NotLoggedIn />;
  }

  const FilterChip = ({ label, onDelete }) => (
    <div className="inline-flex items-center space-x-2 bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm border border-purple-500/30">
      <span>{label}</span>
      <button
        onClick={onDelete}
        className="text-purple-400 hover:text-purple-200 transition-colors"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
        </svg>
      </button>
    </div>
  );

  const DisplayItems = () => {
    const filteredPhenomena = getFilteredPhenomena();

    return (
      <div className="space-y-6">
        {filteredPhenomena.length === 0 ? (
          <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-12 text-center">
            <svg className="w-16 h-16 text-gray-500 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path>
            </svg>
            <h3 className="text-xl font-semibold text-white mb-2">No phenomena found</h3>
            <p className="text-gray-400 mb-4">Try adjusting your search criteria to find more phenomena</p>
            <button
              onClick={clearAllFilters}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Results Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <svg className="w-6 h-6 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <h2 className="text-xl font-bold text-white">
                  Found {filteredPhenomena.length} phenomenon{filteredPhenomena.length !== 1 ? 'a' : ''}
                </h2>
              </div>
              <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm font-bold">
                {phenomena.length} total
              </span>
            </div>

            {/* Phenomena Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-6">
              {filteredPhenomena.map((phenomenon, index) => (
                <PhenomenonItem 
                  key={index} 
                  currPhenomenon={phenomenon}
                  onToggleVisibility={togglePhenomenonVisibility}
                  onToggleActive={toggleActivePhenomenon}
                  userIsDM={userIsDM}
                  isActive={activePhenomena.some(p => p.name === phenomenon.name)}
                  onSelect={setSelectedPhenomenon}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const FilterSection = () => (
    <div className="space-y-6">
      {/* Advanced Filters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Phenomenon Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          >
            <option value="" className="bg-gray-800">Any Type</option>
            <option value="Environmental" className="bg-gray-800">Environmental</option>
            <option value="Physical" className="bg-gray-800">Physical</option>
            <option value="Mental" className="bg-gray-800">Mental</option>
            <option value="Temporal" className="bg-gray-800">Temporal</option>
            <option value="Social" className="bg-gray-800">Social</option>
            <option value="Cosmic" className="bg-gray-800">Cosmic</option>
            <option value="Personal" className="bg-gray-800">Personal</option>
            {getUniqueTypes().map(uniqueType => (
              !['Environmental', 'Physical', 'Mental', 'Temporal', 'Social', 'Cosmic', 'Personal'].includes(uniqueType) && (
                <option key={uniqueType} value={uniqueType} className="bg-gray-800">{uniqueType}</option>
              )
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Severity Level</label>
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          >
            <option value="" className="bg-gray-800">Any Severity</option>
            {getUniqueSeverities().map(severity => (
              <option key={severity} value={severity} className="bg-gray-800">{severity}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Location</label>
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          >
            <option value="" className="bg-gray-800">Any Location</option>
            {getUniqueLocations().map(location => (
              <option key={location} value={location} className="bg-gray-800">{location}</option>
            ))}
          </select>
        </div>

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

      {/* Active Filters */}
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
            {name && (
              <FilterChip
                label={`Name: "${name}"`}
                onDelete={() => setName('')}
              />
            )}
            {type && (
              <FilterChip
                label={`Type: ${type}`}
                onDelete={() => setType('')}
              />
            )}
            {severityFilter && (
              <FilterChip
                label={`Severity: ${severityFilter}`}
                onDelete={() => setSeverityFilter('')}
              />
            )}
            {locationFilter && (
              <FilterChip
                label={`Location: ${locationFilter}`}
                onDelete={() => setLocationFilter('')}
              />
            )}
            {showHiddenOnly && (
              <FilterChip
                label="Hidden Only"
                onDelete={() => setShowHiddenOnly(false)}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900">
      <div className="max-w-full mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-900/50 to-indigo-900/50 backdrop-blur-lg rounded-2xl border border-white/10 p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Phenomena Collection</h1>
                <p className="text-purple-300">Dynamic effects that alter the game world</p>
              </div>
            </div>
            {userIsDM && (
              <button 
                onClick={addData}
                className="bg-white/20 hover:bg-white/30 text-white font-medium px-6 py-3 rounded-lg border border-white/30 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"></path>
                </svg>
                <span>Add Data</span>
              </button>
            )}
          </div>
        </div>

        {/* Active Phenomena Bar */}
        {userIsDM && activePhenomena.length > 0 && (
          <div className="bg-black/20 backdrop-blur-lg border border-green-500/30 rounded-xl p-4">
            <h3 className="text-green-300 font-bold mb-2 flex items-center">
              <span className="mr-2">⚡</span>
              Currently Active in Session
            </h3>
            <div className="flex flex-wrap gap-2">
              {activePhenomena.map((active, idx) => (
                <div 
                  key={idx}
                  className="bg-green-500/20 border border-green-500/50 rounded-lg px-3 py-2 text-green-300 font-medium text-sm"
                >
                  {active.name}
                </div>
              ))}
            </div>
          </div>
        )}

        {loading ? (
          <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-12">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-400 mb-4"></div>
              <h3 className="text-xl font-semibold text-white mb-2">Loading phenomena collection...</h3>
              <p className="text-gray-400">Please wait while we fetch the data</p>
            </div>
          </div>
        ) : phenomena.length > 0 ? (
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
                      {getFilteredPhenomena().length} shown
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
                    placeholder="Search by name or description..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white/5 border border-white/20 rounded-xl pl-12 pr-12 py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-lg"
                  />
                  {name && (
                    <button
                      onClick={() => setName('')}
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
            <DisplayItems />
          </>
        ) : (
          <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-12">
            <div className="flex flex-col items-center justify-center text-center">
              <svg className="w-16 h-16 text-gray-500 mb-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <h3 className="text-xl font-semibold text-white mb-2">No phenomena data available</h3>
              <p className="text-gray-400">There are currently no phenomena in the database</p>
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

      {/* Phenomenon Details Modal */}
      {selectedPhenomenon && (
        <PhenomenonDetailsModal
          phenomenon={selectedPhenomenon}
          onClose={() => setSelectedPhenomenon(null)}
          userIsDM={userIsDM}
          onToggleActive={toggleActivePhenomenon}
          onToggleVisibility={togglePhenomenonVisibility}
          isActive={activePhenomena.some(p => p.name === selectedPhenomenon.name)}
        />
      )}
    </div>
  );
}

// Phenomenon Details Modal Component
// Phenomenon Details Modal Component - MOBILE FRIENDLY
const PhenomenonDetailsModal = ({ phenomenon, onClose, userIsDM, onToggleActive, onToggleVisibility, isActive }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const getPhenomenonTypeColor = (type) => {
    const colors = {
      'Personal': 'from-blue-600 to-cyan-700 text-blue-300 border-blue-500/50',
      'Environmental': 'from-green-600 to-emerald-700 text-green-300 border-green-500/50',
      'Mental': 'from-purple-600 to-violet-700 text-purple-300 border-purple-500/50',
      'Physical': 'from-red-600 to-rose-700 text-red-300 border-red-500/50',
      'Cosmic': 'from-indigo-600 to-purple-700 text-indigo-300 border-indigo-500/50',
      'Temporal': 'from-yellow-600 to-amber-700 text-yellow-300 border-yellow-500/50',
      'Social': 'from-pink-600 to-fuchsia-700 text-pink-300 border-pink-500/30'
    };
    return colors[type] || 'from-gray-600 to-slate-700 text-gray-300 border-gray-500/50';
  };

  const getPhenomenonTypeIcon = (type) => {
    const icons = {
      'Personal': '👤',
      'Environmental': '🌿',
      'Mental': '🧠',
      'Physical': '💪',
      'Cosmic': '🌌',
      'Temporal': '⏰',
      'Social': '👥'
    };
    return icons[type] || '❓';
  };

  const getThreatIcon = (level) => {
    const icons = {
      'Low': '🟢',
      'Medium': '🟡',
      'High': '🟠',
      'Extreme': '🔴'
    };
    return icons[level] || '⚪';
  };

  const getSeverityColor = (severity) => {
    const colors = {
      'Minor': 'bg-green-500',
      'Moderate': 'bg-yellow-500',
      'Major': 'bg-orange-500',
      'Severe': 'bg-red-500',
      'Catastrophic': 'bg-purple-500'
    };
    return colors[severity] || 'bg-gray-500';
  };

  // Mobile Tab Button Component
  const MobileTabButton = ({ active, onClick, icon, label }) => (
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
    </button>
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm animate-fadeIn">
      {/* Modal Container - Mobile Friendly */}
      <div className="h-full w-full flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 md:m-4 md:rounded-2xl md:border-2 md:border-white/20 md:h-auto md:max-h-[90vh] md:max-w-5xl md:mx-auto overflow-hidden">
        
        {/* Compact Header */}
        <div className="flex-shrink-0 bg-gradient-to-r from-purple-600/20 to-indigo-600/20 border-b border-white/10">
          {/* Top Bar */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-600/30 to-indigo-600/30 rounded-full flex items-center justify-center text-2xl border-2 border-purple-500/50">
                {getPhenomenonTypeIcon(phenomenon.phenomenon_type)}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg md:text-xl font-bold text-white truncate">{phenomenon.name}</h2>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
                  <span className="text-purple-300">{phenomenon.phenomenon_type}</span>
                  <span className="text-gray-400">•</span>
                  <span className={`px-2 py-0.5 rounded-full ${getSeverityColor(phenomenon.severity)} text-white`}>
                    {phenomenon.severity}
                  </span>
                  <span className="text-gray-400">•</span>
                  <span className="flex items-center text-gray-300">
                    {getThreatIcon(phenomenon.threat_level)} {phenomenon.threat_level}
                  </span>
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

          {/* Active Status Banner */}
          {isActive && (
            <div className="mx-4 my-2 bg-green-500/20 border border-green-500/50 rounded-xl p-3">
              <div className="flex items-center space-x-2">
                <span className="text-xl animate-pulse">⚡</span>
                <div>
                  <div className="text-green-300 font-bold text-sm">This phenomenon is currently ACTIVE in your session</div>
                  <div className="text-green-200 text-xs">Duration: {phenomenon.duration}</div>
                </div>
              </div>
            </div>
          )}

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
                active={activeTab === 'mechanics'}
                onClick={() => setActiveTab('mechanics')}
                icon="⚙️"
                label="Mechanics"
              />
              <MobileTabButton
                active={activeTab === 'counterplay'}
                onClick={() => setActiveTab('counterplay')}
                icon="🛡️"
                label="Counterplay"
              />
              <MobileTabButton
                active={activeTab === 'lore'}
                onClick={() => setActiveTab('lore')}
                icon="📚"
                label="Lore"
              />
              {userIsDM && (
                <MobileTabButton
                  active={activeTab === 'dm'}
                  onClick={() => setActiveTab('dm')}
                  icon="🎲"
                  label="DM Notes"
                />
              )}
            </div>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4">
          
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              {/* Full Description */}
              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                <h3 className="text-white font-bold mb-2 flex items-center">
                  <span className="text-purple-400 mr-2">📖</span>
                  Description
                </h3>
                <p className="text-gray-300 leading-relaxed">{phenomenon.full_description}</p>
              </div>

              {/* Key Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Trigger */}
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                  <h3 className="text-white font-bold mb-3 flex items-center">
                    <span className="text-orange-400 mr-2">⚠️</span>
                    Trigger
                  </h3>
                  <div className="space-y-2 text-gray-300 text-sm">
                    <p><strong className="text-purple-400">Type:</strong> {phenomenon.trigger_type}</p>
                    <p><strong className="text-purple-400">Conditions:</strong> {phenomenon.trigger_conditions}</p>
                    <p><strong className="text-purple-400">Frequency:</strong> {phenomenon.frequency}</p>
                  </div>
                </div>

                {/* Duration & Range */}
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                  <h3 className="text-white font-bold mb-3 flex items-center">
                    <span className="text-blue-400 mr-2">⏱️</span>
                    Timing & Range
                  </h3>
                  <div className="space-y-2 text-gray-300 text-sm">
                    <p><strong className="text-purple-400">Duration:</strong> {phenomenon.duration}</p>
                    <p><strong className="text-purple-400">Range:</strong> {phenomenon.range}</p>
                    <p className="text-xs text-gray-400">{phenomenon.range_description}</p>
                  </div>
                </div>

                {/* Affected Targets */}
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                  <h3 className="text-white font-bold mb-3 flex items-center">
                    <span className="text-yellow-400 mr-2">🎯</span>
                    Affects
                  </h3>
                  <div className="space-y-1 text-sm">
                    {phenomenon.affects.characters && <div className="text-green-300">✓ Characters</div>}
                    {phenomenon.affects.entities && <div className="text-green-300">✓ Entities</div>}
                    {phenomenon.affects.environment && <div className="text-green-300">✓ Environment</div>}
                    {phenomenon.affects.objects && <div className="text-green-300">✓ Objects</div>}
                    <p className="text-xs text-gray-400 mt-2">{phenomenon.affect_details}</p>
                  </div>
                </div>

                {/* Lethality */}
                {phenomenon.can_be_deadly && (
                  <div className="bg-gradient-to-br from-red-900/30 to-black/40 rounded-xl p-4 border-2 border-red-500/50">
                    <h3 className="text-white font-bold mb-3 flex items-center">
                      <span className="text-red-400 mr-2">☠️</span>
                      Deadly
                    </h3>
                    <p className="text-red-200 text-sm leading-relaxed">{phenomenon.lethality_conditions}</p>
                  </div>
                )}
              </div>

              {/* Detection & Warning */}
              <div className="bg-gradient-to-br from-yellow-900/30 to-amber-900/30 rounded-xl p-4 border border-yellow-500/30">
                <h3 className="text-white font-bold mb-3 flex items-center">
                  <span className="text-yellow-400 mr-2">👁️</span>
                  Detection & Warning Signs
                </h3>
                <div className="space-y-3">
                  <div>
                    <strong className="text-yellow-300 text-sm">Detection Difficulty:</strong>
                    <span className="ml-2 text-yellow-200">{phenomenon.detection_difficulty}</span>
                  </div>
                  {phenomenon.detection_skills && phenomenon.detection_skills.length > 0 && (
                    <div>
                      <strong className="text-yellow-300 text-sm">Detection Skills:</strong>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {phenomenon.detection_skills.map((skill, idx) => (
                          <span key={idx} className="bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded text-xs border border-yellow-500/30">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {phenomenon.warning_signs && phenomenon.warning_signs.length > 0 && (
                    <div>
                      <strong className="text-yellow-300 text-sm">Warning Signs:</strong>
                      <ul className="mt-1 space-y-1">
                        {phenomenon.warning_signs.map((sign, idx) => (
                          <li key={idx} className="text-yellow-200 text-sm flex items-start">
                            <span className="text-yellow-400 mr-2">•</span>
                            <span>{sign}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div>
                    <strong className="text-yellow-300 text-sm">Advance Warning:</strong>
                    <span className="ml-2 text-yellow-200">{phenomenon.advance_warning_time}</span>
                  </div>
                </div>
              </div>

              {/* Tags */}
              {phenomenon.classification_tags && phenomenon.classification_tags.length > 0 && (
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                  <h3 className="text-white font-bold mb-3 flex items-center">
                    <span className="text-pink-400 mr-2">🏷️</span>
                    Classification Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {phenomenon.classification_tags.map((tag, idx) => (
                      <span key={idx} className="bg-pink-500/20 text-pink-300 px-3 py-1 rounded-lg text-sm border border-pink-500/30">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* MECHANICS TAB */}
          {activeTab === 'mechanics' && (
            <div className="space-y-4">
              {/* Primary Effect */}
              <div className="bg-gradient-to-br from-red-900/30 to-rose-900/30 rounded-xl p-5 border border-red-500/30">
                <h3 className="text-white font-bold mb-3 text-lg flex items-center">
                  <span className="text-red-400 mr-2">💥</span>
                  Primary Effect
                </h3>
                <div className="space-y-2">
                  <p className="text-red-200 leading-relaxed">{phenomenon.mechanical_effects.primary_effect.description}</p>
                  <div className="bg-red-500/20 rounded-lg p-3 mt-3">
                    <div className="text-xs font-bold text-red-300 mb-1">Game Impact:</div>
                    <p className="text-red-200 text-sm">{phenomenon.mechanical_effects.primary_effect.game_impact}</p>
                  </div>
                </div>
              </div>

              {/* Secondary Effects */}
              {phenomenon.mechanical_effects.secondary_effects && phenomenon.mechanical_effects.secondary_effects.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-white font-bold text-lg flex items-center">
                    <span className="text-orange-400 mr-2">⚡</span>
                    Secondary Effects
                  </h3>
                  {phenomenon.mechanical_effects.secondary_effects.map((effect, idx) => (
                    <div key={idx} className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                      <p className="text-gray-300 mb-2">{effect.description}</p>
                      <div className="bg-purple-500/20 rounded-lg p-2">
                        <div className="text-xs font-bold text-purple-300 mb-1">Impact:</div>
                        <p className="text-purple-200 text-sm">{effect.game_impact}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Special Conditions */}
              {phenomenon.mechanical_effects.special_conditions && (
                <div className="bg-gradient-to-br from-purple-900/30 to-violet-900/30 rounded-xl p-5 border border-purple-500/30">
                  <h3 className="text-white font-bold mb-3 text-lg flex items-center">
                    <span className="text-purple-400 mr-2">✨</span>
                    Special Conditions
                  </h3>
                  <p className="text-purple-200 leading-relaxed">{phenomenon.mechanical_effects.special_conditions}</p>
                </div>
              )}

              {/* Variants */}
              {phenomenon.has_variants && phenomenon.variants && phenomenon.variants.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-white font-bold text-lg flex items-center">
                    <span className="text-blue-400 mr-2">🔄</span>
                    Variants
                  </h3>
                  {phenomenon.variants.map((variant, idx) => (
                    <div key={idx} className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-white font-bold">{variant.name}</h4>
                        <span className="text-xs px-2 py-1 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                          {variant.severity}
                        </span>
                      </div>
                      <div className="space-y-1 text-sm text-gray-300">
                        <p><strong className="text-purple-400">Range:</strong> {variant.range}</p>
                        <p><strong className="text-purple-400">Duration:</strong> {variant.duration}</p>
                        <p><strong className="text-purple-400">Effect:</strong> {variant.mechanical_effect}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* COUNTERPLAY TAB */}
          {activeTab === 'counterplay' && (
            <div className="space-y-4">
              {/* Resistance */}
              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                <h3 className="text-white font-bold mb-3 flex items-center">
                  <span className="text-blue-400 mr-2">🛡️</span>
                  Resistance
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className={`font-bold ${phenomenon.can_be_resisted ? 'text-green-300' : 'text-red-300'}`}>
                      {phenomenon.can_be_resisted ? '✓ Can be resisted' : '✗ Cannot be resisted'}
                    </span>
                  </div>
                  {phenomenon.can_be_resisted && phenomenon.resistance_method && (
                    <div className="bg-blue-500/20 rounded-lg p-3 mt-2">
                      <div className="text-xs font-bold text-blue-300 mb-1">Resistance Method:</div>
                      <p className="text-blue-200 text-sm">{phenomenon.resistance_method}</p>
                    </div>
                  )}
                </div>
              </div>
                
              {/* Dispelling */}
              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                <h3 className="text-white font-bold mb-3 flex items-center">
                  <span className="text-purple-400 mr-2">✨</span>
                  Dispelling
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className={`font-bold ${phenomenon.can_be_dispelled ? 'text-green-300' : 'text-red-300'}`}>
                      {phenomenon.can_be_dispelled ? '✓ Can be dispelled' : '✗ Cannot be dispelled'}
                    </span>
                  </div>
                  {phenomenon.can_be_dispelled && phenomenon.dispel_method && (
                    <div className="bg-purple-500/20 rounded-lg p-3 mt-2">
                      <div className="text-xs font-bold text-purple-300 mb-1">Dispel Method:</div>
                      <p className="text-purple-200 text-sm">{phenomenon.dispel_method}</p>
                    </div>
                  )}
                </div>
              </div>
                
              {/* Avoidance */}
              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                <h3 className="text-white font-bold mb-3 flex items-center">
                  <span className="text-green-400 mr-2">🏃</span>
                  Avoidance
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className={`font-bold ${phenomenon.can_be_avoided ? 'text-green-300' : 'text-red-300'}`}>
                      {phenomenon.can_be_avoided ? '✓ Can be avoided' : '✗ Cannot be avoided'}
                    </span>
                  </div>
                  {phenomenon.can_be_avoided && phenomenon.avoidance_method && (
                    <div className="bg-green-500/20 rounded-lg p-3 mt-2">
                      <div className="text-xs font-bold text-green-300 mb-1">Avoidance Method:</div>
                      <p className="text-green-200 text-sm">{phenomenon.avoidance_method}</p>
                    </div>
                  )}
                </div>
              </div>
                
              {/* Exploitation */}
              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                <h3 className="text-white font-bold mb-3 flex items-center">
                  <span className="text-yellow-400 mr-2">💡</span>
                  Exploitation
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className={`font-bold ${phenomenon.can_be_exploited ? 'text-green-300' : 'text-red-300'}`}>
                      {phenomenon.can_be_exploited ? '✓ Can be exploited' : '✗ Cannot be exploited'}
                    </span>
                  </div>
                  {phenomenon.can_be_exploited && phenomenon.exploitation_method && (
                    <div className="bg-yellow-500/20 rounded-lg p-3 mt-2">
                      <div className="text-xs font-bold text-yellow-300 mb-1">Exploitation Method:</div>
                      <p className="text-yellow-200 text-sm">{phenomenon.exploitation_method}</p>
                    </div>
                  )}
                </div>
              </div>
                
              {/* Aftermath */}
              {phenomenon.aftermath && (
                <div className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 rounded-xl p-5 border border-indigo-500/30">
                  <h3 className="text-white font-bold mb-3 text-lg flex items-center">
                    <span className="text-indigo-400 mr-2">🌅</span>
                    Aftermath
                  </h3>
                  <p className="text-indigo-200 leading-relaxed">{phenomenon.aftermath}</p>
                </div>
              )}
            </div>
          )}

          {/* LORE TAB */}
          {activeTab === 'lore' && (
            <div className="space-y-4">
              {/* Lore Text */}
              {phenomenon.lore_text && (
                <div className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 rounded-xl p-5 border border-indigo-500/30">
                  <h3 className="text-white font-bold mb-3 text-lg flex items-center">
                    <span className="text-indigo-400 mr-2">📜</span>
                    Lore
                  </h3>
                  <p className="text-indigo-200 leading-relaxed italic">{phenomenon.lore_text}</p>
                </div>
              )}

              {/* Origins */}
              {phenomenon.known_origins && (
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                  <h3 className="text-white font-bold mb-3 flex items-center">
                    <span className="text-blue-400 mr-2">🔬</span>
                    Known Origins
                  </h3>
                  <p className="text-gray-300 leading-relaxed">{phenomenon.known_origins}</p>
                </div>
              )}

              {/* Historical Occurrences */}
              {phenomenon.historical_occurrences && (
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                  <h3 className="text-white font-bold mb-3 flex items-center">
                    <span className="text-yellow-400 mr-2">📖</span>
                    Historical Occurrences
                  </h3>
                  <p className="text-gray-300 leading-relaxed">{phenomenon.historical_occurrences}</p>
                </div>
              )}

              {/* Related Content */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Related Phenomena */}
                {phenomenon.related_phenomena && phenomenon.related_phenomena.length > 0 && (
                  <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                    <h3 className="text-white font-bold mb-3 flex items-center text-sm">
                      <span className="text-purple-400 mr-2">🔗</span>
                      Related Phenomena
                    </h3>
                    <div className="space-y-1">
                      {phenomenon.related_phenomena.map((related, idx) => (
                        <div key={idx} className="text-purple-300 text-sm">• {related}</div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Related Locations */}
                {phenomenon.related_locations && phenomenon.related_locations.length > 0 && (
                  <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                    <h3 className="text-white font-bold mb-3 flex items-center text-sm">
                      <span className="text-green-400 mr-2">📍</span>
                      Related Locations
                    </h3>
                    <div className="space-y-1">
                      {phenomenon.related_locations.map((location, idx) => (
                        <div key={idx} className="text-green-300 text-sm">• {location}</div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Related NPCs */}
                {phenomenon.related_npcs && phenomenon.related_npcs.length > 0 && (
                  <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                    <h3 className="text-white font-bold mb-3 flex items-center text-sm">
                      <span className="text-pink-400 mr-2">👥</span>
                      Related NPCs
                    </h3>
                    <div className="space-y-1">
                      {phenomenon.related_npcs.map((npc, idx) => (
                        <div key={idx} className="text-pink-300 text-sm">• {npc}</div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* DM NOTES TAB */}
          {activeTab === 'dm' && userIsDM && (
            <div className="space-y-4">
              {/* DM Notes */}
              {phenomenon.dm_notes && (
                <div className="bg-gradient-to-br from-blue-900/30 to-indigo-900/30 rounded-xl p-5 border border-blue-500/30">
                  <h3 className="text-white font-bold mb-3 text-lg flex items-center">
                    <span className="text-blue-400 mr-2">📝</span>
                    DM Notes
                  </h3>
                  <p className="text-blue-200 leading-relaxed whitespace-pre-line">{phenomenon.dm_notes}</p>
                </div>
              )}

              {/* DM Secrets */}
              {phenomenon.dm_secrets && (
                <div className="bg-gradient-to-br from-red-900/30 to-rose-900/30 rounded-xl p-5 border border-red-500/30">
                  <h3 className="text-white font-bold mb-3 text-lg flex items-center">
                    <span className="text-red-400 mr-2">🔒</span>
                    Secrets
                  </h3>
                  <p className="text-red-200 leading-relaxed whitespace-pre-line">{phenomenon.dm_secrets}</p>
                </div>
              )}

              {/* Procedural Notes */}
              {phenomenon.procedural_notes && (
                <div className="bg-gradient-to-br from-purple-900/30 to-violet-900/30 rounded-xl p-5 border border-purple-500/30">
                  <h3 className="text-white font-bold mb-3 text-lg flex items-center">
                    <span className="text-purple-400 mr-2">🎲</span>
                    Procedural Notes
                  </h3>
                  <p className="text-purple-200 leading-relaxed whitespace-pre-line">{phenomenon.procedural_notes}</p>
                </div>
              )}

              {/* Encounter Ideas */}
              {phenomenon.encounter_ideas && phenomenon.encounter_ideas.length > 0 && (
                <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 rounded-xl p-5 border border-green-500/30">
                  <h3 className="text-white font-bold mb-3 text-lg flex items-center">
                    <span className="text-green-400 mr-2">💡</span>
                    Encounter Ideas
                  </h3>
                  <ul className="space-y-2">
                    {phenomenon.encounter_ideas.map((idea, idx) => (
                      <li key={idx} className="text-green-200 flex items-start">
                        <span className="text-green-400 mr-2 mt-1">•</span>
                        <span>{idea}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Quick Reference Card */}
              <div className="bg-gradient-to-br from-yellow-900/30 to-amber-900/30 rounded-xl p-5 border border-yellow-500/30">
                <h3 className="text-white font-bold mb-3 text-lg flex items-center">
                  <span className="text-yellow-400 mr-2">⚡</span>
                  Quick Reference
                </h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="text-yellow-300 font-bold mb-1">Type:</div>
                    <div className="text-yellow-200">{phenomenon.phenomenon_type}</div>
                  </div>
                  <div>
                    <div className="text-yellow-300 font-bold mb-1">Range:</div>
                    <div className="text-yellow-200">{phenomenon.range}</div>
                  </div>
                  <div>
                    <div className="text-yellow-300 font-bold mb-1">Duration:</div>
                    <div className="text-yellow-200">{phenomenon.duration}</div>
                  </div>
                  <div>
                    <div className="text-yellow-300 font-bold mb-1">Threat:</div>
                    <div className="text-yellow-200">{getThreatIcon(phenomenon.threat_level)} {phenomenon.threat_level}</div>
                  </div>
                  <div>
                    <div className="text-yellow-300 font-bold mb-1">Detection:</div>
                    <div className="text-yellow-200">{phenomenon.detection_difficulty}</div>
                  </div>
                  <div>
                    <div className="text-yellow-300 font-bold mb-1">Deadly:</div>
                    <div className="text-yellow-200">{phenomenon.can_be_deadly ? 'Yes ☠️' : 'No'}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex-shrink-0 p-4 border-t border-white/10 bg-gradient-to-r from-purple-600/10 to-indigo-600/10">
          <div className="flex flex-col sm:flex-row gap-3">
            {userIsDM && (
              <button
                onClick={() => onToggleActive(phenomenon)}
                className={`flex-1 font-bold px-6 py-3 rounded-xl transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white shadow-lg'
                    : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg'
                }`}
              >
                {isActive ? '❌ Deactivate in Session' : '⚡ Activate in Session'}
              </button>
            )}
            <button
              onClick={onClose}
              className="flex-1 bg-gradient-to-r from-purple-600/20 to-indigo-600/20 hover:from-purple-600/30 hover:to-indigo-600/30 text-purple-300 font-bold px-6 py-3 rounded-xl border border-purple-500/30 transition-all duration-300"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};