// Story-aligned hallway features with Genesys RPG mechanics for Voidsteel contamination narrative
import { ROOM_TYPES } from './indoorData.jsx';
import { INTERIOR_TYPES } from './moonData.jsx';

// Core contamination and facility features aligned with the Voidsteel story and Genesys mechanics
export const HALLWAY_FEATURES = {
  // Voidsteel Contamination Hazards (30+ options)
  CONTAMINATION_HAZARDS: [
    // Radiation hazards
    { name: "Voidsteel Radiation Zone", description: "Dark crystals emit dangerous levels of contamination", effect: "Add 2 Setback dice to all checks while in this room. Make Hard (3) Resilience check each round or suffer 1 strain", icon: "☢️", dangerous: true },
    { name: "Crystalline Growth Barrier", description: "Jagged Voidsteel crystals block half the corridor", effect: "Movement through this area requires Average (2) Athletics check or suffer 2 wounds from cuts", icon: "💎", blocking: true },
    { name: "Radiation Leak", description: "Broken containment unit spews contaminated particles", effect: "Upgrade difficulty of all checks by 1 while in area. Resilience vs 2 Difficulty each turn or gain 1 strain", icon: "⚠️", environmental: true },
    { name: "Geiger Counter Alarm", description: "Abandoned detector clicking frantically", effect: "Loud clicking adds 1 Setback to Stealth checks", icon: "📡", mixed: true },
    { name: "Quarantine Breach", description: "Torn plastic barriers flutter uselessly", effect: "No Effect", icon: "🚧", informational: true },
    { name: "Hazmat Equipment Failure", description: "Shredded protective suits litter the floor", effect: "No Effect", icon: "🧥", warning: true },
    { name: "Contamination Footprints", description: "Glowing boot prints show contaminated personnel paths", effect: "Add 2 Boost to all navigation checks for 5 rounds", icon: "👣", tracking: true },
    { name: "Voidsteel Dust Cloud", description: "Fine particles hang in the air like deadly snow", effect: "Reduce visibility to Short range. Breathing requires Resilience vs 1 Difficulty each round", icon: "✨", vision: true },
    { name: "Emergency Shower Malfunction", description: "Decontamination station sprays contaminated water", effect: "Using shower requires Average (2) Mechanics + 1 setback check or suffer chemical burns (2 wounds)", icon: "🚿", trap: true },
    { name: "Lead Shielding Collapse", description: "Heavy protective barriers have fallen, creating obstacles", effect: "Blocks movement. Athletics vs 3 Difficulty to climb over, or Coordination vs 2 to squeeze around", icon: "🛡️", blocking: true },
    { name: "Dosimeter Overload", description: "Radiation badges scattered, all reading maximum exposure", effect: "Clear evidence of lethal contamination levels. Add 1 Boost to Medicine checks to treat radiation", icon: "🏷️", medical: true },
    { name: "Glowing Condensation", description: "Water droplets pulse with dark Voidsteel energy", effect: "Contact with water causes 1 strain. Can be collected for Mechanics checks on Voidsteel equipment", icon: "💧", resource: true },
    { name: "Corroded Ventilation", description: "Air ducts eaten away by Voidsteel particles", effect: "Air quality degraded. All characters suffer 1 strain per round in this area", icon: "🌪️", persistent: true },
    { name: "Containment Breach Alarm", description: "Red lights flash emergency warnings continuously", effect: "Strobing light causes disorientation. Add 1 Setback to Perception and Vigilance checks for 3 rounds", icon: "🚨", hindering: true },
    { name: "Mutation Warning Charts", description: "Medical posters showing stages of Voidsteel transformation", effect: "Study for 2 rounds to add 2 Boost dice to next Medicine check", icon: "📊", educational: true },
  ],

  // Corporate/Syndicate Evidence (25+ options)
  CORPORATE_HAZARDS: [
    // Syndicate control systems
    { name: "Surveillance Terminal", description: "Active security station monitoring facility", effect: "Computers vs 3 Difficulty to access security feeds. Success reveals entity locations within 3 adjacent rooms", icon: "📺", terminal: true },
    { name: "Efficiency Monitor", description: "Screen showing worker productivity metrics and quotas", effect: "Displays current facility scrap total. Knowledge (Lore) check reveals nearest scrap location", icon: "📊", informational: true },
    { name: "Worker Tracking System", description: "Digital board showing employee locations and status", effect: "Computers vs 2 Difficulty to access. Success shows which rooms have had movement within the last 3 rounds", icon: "🗂️", tracking: true },
    { name: "Emergency Lockdown Panel", description: "Corporate override system for facility control", effect: "Skulduggery vs 4 Difficulty to activate. Success opens or closes any one door (secure or not)", icon: "🔐", control: true },
    { name: "Propaganda Speaker", description: "PA system broadcasting Syndicate efficiency messages", effect: "Constant corporate messaging. Add 1 Setback to Discipline checks against fear and despair", icon: "📢", psychological: true },
    { name: "Quality Control Override", description: "Station marked 'SAFETY CHECKS DISABLED'", effect: "Evidence of deliberate negligence. No Effect", icon: "❌", sabotage: true },
    { name: "Executive Access Terminal", description: "High-clearance workstation with active connection", effect: "Computers vs 4 Difficulty. Success allows one ship action to be performed remotely", icon: "💻", ship_access: true },
    { name: "Profit Calculation Display", description: "Real-time revenue from contaminated products", effect: "Average (2) Knowledge check reveals top valued scrap within the facility", icon: "💰", economics: true },
    { name: "Worker Expendability Chart", description: "Graph showing acceptable loss rates for productivity", effect: "Disturbing corporate data. Viewing requires Average (2) Discipline check or suffer 2 strain", icon: "📈", disturbing: true },
    { name: "Syndicate Communication Hub", description: "Multi-channel corporate communication array", effect: "Computers vs 3 Difficulty to access. Can send messages to ship or other team members anywhere", icon: "📡", communication: true },
    { name: "Automated Quota Enforcement", description: "System that punishes workers for quota failures", effect: "Mechanical trap. Skulduggery vs 3 Difficulty to disable, or triggers security alert", icon: "⚙️", enforcement: true },
    { name: "Executive Emergency Kit", description: "Management survival supplies in locked cabinet", effect: "Skulduggery vs 2 Difficulty to open. 2 Use Medkit", icon: "🎒", beneficial: true },
  ],

  // Facility Infrastructure Hazards (20+ options per facility type)
  FACILITY_HAZARDS: [
    // March/Adamance (Mining Operations) - Hazardous
    { name: "Collapsed Mining Shaft", description: "Cave-in blocks passage with unstable rubble", effect: "Complete blockage. Athletics vs 4 Difficulty to clear safely, failure causes 3 wounds from falling debris", icon: "⛏️", blocking: true, facility: ["61-March", "20-Adamance"] },
    { name: "Ore Processing Malfunction", description: "Broken equipment sprays Voidsteel particles", effect: "Hazardous area. Resilience vs 3 Difficulty each round or suffer 2 strain from ore exposure", icon: "🪨", environmental: true, facility: ["61-March", "20-Adamance"] },
    { name: "Mining Drill Overload", description: "Massive boring equipment sparks and smokes dangerously", effect: "Mechanics vs 3 Difficulty to shut down safely, or room fills with toxic fumes (2 strain/round)", icon: "🔨", mechanical: true, facility: ["61-March", "20-Adamance"] },
    { name: "Geological Instability Scanner", description: "Warning system shows critical structural damage", effect: "Terminal shows unstable areas. Computer Use vs 1 Difficulty reveals safe paths through building", icon: "📊", navigation: true, facility: ["61-March", "20-Adamance"] },

    // Vow/Rend (Processing Operations) - High Heat/Pressure
    { name: "Gamma Radiation Leak", description: "Processing equipment sprays molecular bombardment", effect: "Extreme radiation zone. Resilience vs 4 Difficulty each round or suffer 1 wound from cellular damage", icon: "☢️", extreme: true, facility: ["56-Vow", "85-Rend"] },
    { name: "Superheated Slag Spill", description: "30% processing waste blocks corridor as molten hazard", effect: "Impassable while hot. Wait 30 minutes or Athletics vs 4 Difficulty to leap across (failure = 4 wounds)", icon: "🔥", timed: true, facility: ["56-Vow", "85-Rend"] },
    { name: "Cooling System Rupture", description: "Massive pipes spray scalding coolant across area", effect: "Coordination vs 2 Difficulty to avoid spray each round in room, failure causes 2 wounds from burns", icon: "💨", persistent: true, facility: ["56-Vow", "85-Rend"] },
    { name: "Pressure Monitoring Terminal", description: "System shows dangerous pressure buildup in facility", effect: "Computer Use vs 2 Difficulty. Success warns of areas about to explode, adding 2 Boost to avoid", icon: "🖥️", warning: true, facility: ["56-Vow", "85-Rend"] },

    // Titan (Manufacturing) - Industrial Hazards
    { name: "Assembly Line Malfunction", description: "Conveyor belt creates contaminated products uncontrolled", effect: "Moving machinery hazard. Coordination vs 2 Difficulty to cross safely or be pulled in (3 wounds)", icon: "🏭", moving: true, facility: ["8-Titan"] },
    { name: "Quality Control Failure", description: "Inspection station randomly accepts dangerous products", effect: "Evidence of systemic failure. Mechanics checks on facility equipment gain 2 Setback dice", icon: "❌", systemic: true, facility: ["8-Titan"] },
    { name: "Robotic Assembly Arm", description: "Malfunctioning robot continues dangerous manufacturing", effect: "Athletics vs 3 Difficulty to duck under arm, or Mechanics vs 4 Difficulty to shut down safely", icon: "🦾", robotic: true, facility: ["8-Titan"] },
    { name: "Production Control Terminal", description: "Central manufacturing oversight system", effect: "Computer Use vs 3 Difficulty. Success can shut down dangerous equipment or activate emergency protocols", icon: "🖥️", control: true, facility: ["8-Titan"] },

    // Offense (Weapons) - Military Hazards
    { name: "Voidsteel Weapon Discharge", description: "Dark energy weapons have fired, leaving radiation burns", effect: "Weapon testing area. Resilience vs 3 Difficulty or suffer 2 strain from residual weapon energy", icon: "💥", weapon: true, facility: ["21-Offense"] },
    { name: "Tactical Deployment Malfunction", description: "Automated weapon systems track movement", effect: "Security hazard. Stealth vs 3 Difficulty to avoid detection, failure triggers non-lethal deterrent", icon: "🎯", security: true, facility: ["21-Offense"] },
    { name: "Weapons Testing Terminal", description: "Control system for dangerous weapon experiments", effect: "Computer Use vs 4 Difficulty. Success can disable security systems or access tactical data", icon: "🖥️", tactical: true, facility: ["21-Offense"] },

    // Assurance (Agriculture) - Biological Hazards
    { name: "Contaminated Crop Mutation", description: "Voidsteel-affected plants grow in twisted patterns", effect: "Biological hazard. Medicine vs 2 Difficulty to safely navigate, failure causes 1 strain from spores", icon: "🌱", biological: true, facility: ["220-Assurance"] },
    { name: "Irrigation System Breach", description: "Contaminated water floods the area", effect: "Flooded area. Athletics vs 2 Difficulty for movement, contact with water causes 1 strain", icon: "💧", flooded: true, facility: ["220-Assurance"] },
    { name: "Agricultural Terminal", description: "Crop monitoring system showing contamination spread", effect: "Computer Use vs 2 Difficulty. Success reveals contamination patterns and safe food sources", icon: "📊", agricultural: true, facility: ["220-Assurance"] },

    // Artifice (Research) - Experimental Hazards
    { name: "Halden Incident Ground Zero", description: "Epicenter of catastrophic Voidsteel breach", effect: "Extreme contamination. All checks gain 3 Setback dice. Resilience vs 5 Difficulty or suffer Critical Injury", icon: "💀", extreme: true, facility: ["68-Artifice"] },
    { name: "Experimental Equipment Leak", description: "Research apparatus continuously releases contamination", effect: "Ongoing hazard. Each round in area requires Resilience vs 2 Difficulty or gain 1 strain", icon: "⚗️", experimental: true, facility: ["68-Artifice"] },
    { name: "Research Terminal Network", description: "Advanced scientific computing system", effect: "Computer Use vs 2 Difficulty. Success provides detailed contamination data and emergency protocols", icon: "🖥️", research: true, facility: ["68-Artifice"] },

    // Dine (Waste Management) - Environmental Hazards
    { name: "Waste Processing Overflow", description: "Treatment systems have failed, spilling toxic materials", effect: "Environmental hazard. Resilience vs 3 Difficulty each round or suffer 1 wound from toxic exposure", icon: "☠️", toxic: true, facility: ["7-Dine"] },
    { name: "Environmental System Failure", description: "Air and water purification has completely broken down", effect: "Life support failure. All characters suffer 1 strain per 10 minutes in this area", icon: "🌡️", life_support: true, facility: ["7-Dine"] },
    { name: "Waste Management Terminal", description: "Environmental control and monitoring system", effect: "Computer Use vs 2 Difficulty. Success can restore life support or identify clean areas", icon: "🖥️", environmental: true, facility: ["7-Dine"] },

    // Experimentation (Abandoned) - Historical Hazards
    { name: "Early Research Remnants", description: "Prototype Voidsteel experiments left to decay", effect: "Historical contamination. Medicine vs 3 Difficulty to safely examine and gain research insights", icon: "🧪", historical: true, facility: ["41-Experimentation"] },
    { name: "Abandoned Safety Systems", description: "Original protective measures no longer function", effect: "Safety equipment failure. All environmental hazards in facility gain 1 additional Setback die", icon: "⚠️", systemic: true, facility: ["41-Experimentation"] },
    { name: "Research Archive Terminal", description: "Original research database with safety protocols", effect: "Computer Use vs 3 Difficulty. Success provides pre-Syndicate safety data, reducing facility hazards", icon: "🖥️", archival: true, facility: ["41-Experimentation"] },
  ],

  // Worker Evidence and Environmental Storytelling (25+ options)
  WORKER_EVIDENCE: [
    // Personal tragedy
    { name: "Worker Transformation Recording", description: "Security footage shows employee becoming entity", effect: "Disturbing evidence. Viewing requires Hard (3) Discipline check or suffer 3 strain from horror", icon: "📹", disturbing: true },
    { name: "Medical Alert Bracelet", description: "Health monitor showing increasing contamination levels", effect: "Medical data. Medicine check reveals contamination progression stages and symptoms", icon: "🏥", medical: true },
    { name: "Final Message Terminal", description: "Computer with half-typed goodbye letter", effect: "Computer Use reveals worker's final thoughts. Gain 1 Boost to Knowledge about entity behavior", icon: "💻", insight: true },
    { name: "Employee Time Clock", description: "Punch cards show workers never checked out", effect: "Personnel records show missing workers. Knowledge check reveals shift patterns and safe times", icon: "🕐", timing: true },
    { name: "Contaminated Work Tools", description: "Equipment glowing with absorbed Voidsteel energy", effect: "Dangerous tools. Can be used for +1 Mechanics check bonus but cause 1 strain from exposure", icon: "🔧", tool: true },
    { name: "Worker Union Documents", description: "Hidden organizing materials and safety complaints", effect: "Labor evidence. Knowledge check reveals facility weak points and emergency procedures", icon: "📄", intelligence: true },
    { name: "Personal Protective Equipment", description: "Safety gear that failed to protect workers", effect: "False security. Using similar equipment provides only half normal protection against hazards", icon: "🦺", false_security: true },
  ],

  // Environmental Systems and Atmosphere (15+ options)
  ENVIRONMENTAL_SYSTEMS: [
    // Infrastructure
    { name: "Life Support Monitoring", description: "Terminal showing critical environmental systems", effect: "Computer Use vs 2 Difficulty. Success reveals air quality and can improve environmental conditions", icon: "🖥️", life_support: true },
    { name: "Ventilation System Override", description: "Emergency air circulation controls", effect: "Mechanics vs 3 Difficulty to activate. Success clears toxic air from adjacent rooms for 1 hour", icon: "🌪️", air_control: true },
    { name: "Emergency Lighting Failure", description: "Backup illumination systems have died", effect: "Darkness hazard. Add 2 Setback to all checks requiring vision until lights restored", icon: "💡", lighting: true },
    { name: "Structural Integrity Alert", description: "Warning system showing building instability", effect: "Computer Use reveals dangerous areas. Knowledge of unstable zones adds 2 Boost to Athletics", icon: "🏗️", structural: true },
    { name: "Temperature Control Malfunction", description: "Climate system creating extreme hot/cold zones", effect: "Environmental extreme. Resilience vs 2 Difficulty each 10 minutes or suffer 1 strain", icon: "🌡️", climate: true },
    { name: "Magnetic Field Distortion", description: "Voidsteel creating electromagnetic anomalies", effect: "Equipment malfunction. All electronic devices have 25% chance to fail each use", icon: "🧲", electromagnetic: true },
    { name: "Gravity Fluctuation Zone", description: "Voidsteel energy affects local gravitational fields", effect: "Movement difficulty. All Athletics and Coordination checks gain 1 Setback die", icon: "🌀", gravity: true },
  ],

  // Beneficial Corporate/Technical Items (30+ options)
  BENEFICIAL_SYSTEMS: [
    // Ship access terminals
    { name: "Ship Communication Array", description: "High-power transmitter with facility access", effect: "Computer Use vs 2 Difficulty. Success allows one ship action: landing zone change, cargo scan, or emergency beacon", icon: "📡", ship_action: true },
    { name: "Cargo Manifest Terminal", description: "System showing ship inventory and capacity", effect: "Computer Use vs 1 Difficulty. Success reveals optimal scrap to collect and current ship inventory status", icon: "📦", cargo: true },
    { name: "Navigation Uplink", description: "Satellite connection for ship positioning", effect: "Computer Use vs 2 Difficulty. Success allows ship repositioning or weather avoidance maneuvers", icon: "🛰️", navigation: true },
    { name: "Emergency Extraction Beacon", description: "Direct line to ship emergency systems", effect: "Computer Use vs 3 Difficulty. Success can trigger immediate ship emergency protocols or pickup", icon: "🚨", extraction: true },
    { name: "Ship System Diagnostics", description: "Remote monitoring of ship health and status", effect: "Computer Use vs 2 Difficulty. Success reveals ship system status and can run basic repairs", icon: "🔧", diagnostics: true },
    
    // Facility benefits
    { name: "Executive Override Terminal", description: "High-clearance access to facility systems", effect: "Computer Use vs 3 Difficulty. Success grants temporary access to any locked door or system", icon: "🔐", override: true },
    { name: "Medical Supply Dispenser", description: "Automated medical equipment distribution", effect: "Medicine vs 1 Difficulty. Success provides medical supplies: remove 1 wound or 2 strain", icon: "🏥", medical_supplies: true },
    { name: "Emergency Oxygen Station", description: "Backup life support with fresh air supply", effect: "Automatic benefit. All characters in room recover 1 strain and ignore air quality hazards", icon: "💨", oxygen: true },
    { name: "Facility Map Terminal", description: "Interactive building layout and navigation aid", effect: "Computer Use vs 1 Difficulty. Success provides facility map, adding 2 Boost to Navigation checks", icon: "🗺️", mapping: true },
    { name: "Security Camera Access", description: "Surveillance system showing facility status", effect: "Computer Use vs 2 Difficulty. Success reveals entity locations and safe routes through facility", icon: "📹", surveillance: true },
    { name: "Environmental Controls", description: "Climate and hazard management system", effect: "Computer Use vs 3 Difficulty. Success can neutralize environmental hazards in chosen areas", icon: "🌡️", environmental_control: true },
    { name: "Power Distribution Panel", description: "Electrical system controls for facility sections", effect: "Mechanics vs 2 Difficulty. Success can restore power to chosen areas or shut down dangerous equipment", icon: "⚡", power_control: true },
    { name: "Emergency Supply Cache", description: "Corporate emergency stockpile", effect: "Skulduggery vs 2 Difficulty to access. Success provides: food (recover 2 strain) and tools (+1 Mechanics)", icon: "🎒", supply_cache: true },
    { name: "Radiation Shielding Controls", description: "Protective barrier management system", effect: "Computer Use vs 3 Difficulty. Success activates shielding, reducing radiation effects by half in area", icon: "🛡️", shielding: true },
    { name: "Decontamination Station", description: "Working hazmat cleaning system", effect: "Mechanics vs 1 Difficulty to operate. Success removes all contamination conditions and prevents new ones for 1 hour", icon: "🚿", decontamination: true },

    // Interior type specific benefits
    { name: "Mining Equipment Cache", description: "Heavy-duty tools for excavation work", effect: "Tool access. Gain +2 Boost dice to Athletics checks involving climbing or breaking barriers", icon: "⛏️", tools: true, interior: ["Mineshaft"] },
    { name: "Luxury Emergency Kit", description: "High-end supplies from executive areas", effect: "Quality items. Recover 3 strain immediately and gain +1 Boost die to next social check", icon: "🍾", luxury: true, interior: ["Mansion"] },
    { name: "Industrial Safety Override", description: "Master shutdown for dangerous factory equipment", effect: "Mechanics vs 2 Difficulty. Success shuts down all hazardous machinery on current floor", icon: "🏭", industrial_safety: true, interior: ["Factory"] },
    { name: "Corporate Executive Terminal", description: "High-level access with ship command authority", effect: "Computer Use vs 4 Difficulty. Success allows two ship actions or facility-wide system control", icon: "💼", executive: true, interior: ["Mansion"] },
    { name: "Processing Control Station", description: "Master controls for facility refinement systems", effect: "Computer Use vs 3 Difficulty. Success can halt contamination spread or optimize material processing", icon: "🏭", processing: true, interior: ["Factory"] },
    { name: "Geological Survey Data", description: "Rock formation analysis and stability mapping", effect: "Knowledge check reveals safe paths and structural weak points. Add 3 Boost to Athletics in unstable areas", icon: "📊", geology: true, interior: ["Mineshaft"] }
  ]
};

// Facility-specific feature pools based on supply chain role and interior type
export const FACILITY_FEATURES = {
  "41-Experimentation": {
    primary: ["CORPORATE_HAZARDS", "WORKER_EVIDENCE", "ENVIRONMENTAL_SYSTEMS"],
    hazards: ["CONTAMINATION_HAZARDS"],
    beneficial: ["BENEFICIAL_SYSTEMS"],
    specific: [
      { name: "Original Safety Protocols Terminal", description: "Pre-Syndicate worker protection database", effect: "Computer Use vs 2 Difficulty. Success reduces all facility hazard difficulties by 1 for team", icon: "📋", historical: true },
      { name: "Early Voidsteel Research", description: "Prototype contamination with unknown properties", effect: "Medicine vs 4 Difficulty to study safely. Success provides unique insights about Voidsteel properties", icon: "🧪", research: true },
      { name: "Legitimate Company Archives", description: "Original corporate values before transformation", effect: "Knowledge check reveals pre-Syndicate procedures. Add 2 Boost to resist corporate manipulation", icon: "🏢", historical: true }
    ]
  },
  
  "220-Assurance": {
    primary: ["FACILITY_HAZARDS", "CONTAMINATION_HAZARDS", "ENVIRONMENTAL_SYSTEMS"],
    hazards: ["CORPORATE_HAZARDS"],
    beneficial: ["BENEFICIAL_SYSTEMS"],
    specific: [
      { name: "Crop Contamination Analysis", description: "Agricultural monitoring showing food chain corruption", effect: "Computer Use vs 2 Difficulty. Success reveals contaminated food sources and safe alternatives", icon: "🌾", agricultural: true },
      { name: "Pesticide Distribution System", description: "Equipment for mixing Voidsteel into agricultural chemicals", effect: "Dangerous chemical system. Mechanics vs 4 Difficulty to safely shut down contamination source", icon: "🧪", hazardous: true },
      { name: "Agricultural Emergency Protocol", description: "Crisis response system for contaminated crops", effect: "Computer Use vs 3 Difficulty. Success can isolate contamination or activate emergency food supplies", icon: "📊", emergency: true }
    ]
  },
  
  "56-Vow": {
    primary: ["FACILITY_HAZARDS", "CONTAMINATION_HAZARDS", "CORPORATE_HAZARDS"],
    hazards: ["ENVIRONMENTAL_SYSTEMS"],
    beneficial: ["BENEFICIAL_SYSTEMS"],
    specific: [
      { name: "Refinement Efficiency Monitor", description: "Display showing 70% Voidsteel conversion rate", effect: "Computer Use vs 1 Difficulty. Success provides processing data to optimize scrap collection routes", icon: "📊", processing: true },
      { name: "Gamma Bombardment Controls", description: "Molecular restructuring equipment controls", effect: "Computer Use vs 4 Difficulty. Success can shut down dangerous radiation or boost processing efficiency", icon: "☢️", radiation: true },
      { name: "Slag Waste Management", description: "System for handling 30% processing byproduct", effect: "Mechanics vs 3 Difficulty. Success can clear slag blockages or redirect waste flow safely", icon: "⚫", waste: true }
    ]
  },
  
  "21-Offense": {
    primary: ["FACILITY_HAZARDS", "CORPORATE_HAZARDS", "WORKER_EVIDENCE"],
    hazards: ["CONTAMINATION_HAZARDS"],
    beneficial: ["BENEFICIAL_SYSTEMS"],
    specific: [
      { name: "Weapons Testing Override", description: "Control system for Voidsteel weapon experiments", effect: "Computer Use vs 4 Difficulty. Success can disable weapon testing or access tactical protocols", icon: "⚔️", weapons: true },
      { name: "Tactical Deployment Database", description: "Military strategies for Voidsteel weapon usage", effect: "Knowledge check reveals weapon deployment patterns. Add 2 Boost to avoid military hazards", icon: "📋", tactical: true },
      { name: "Arsenal Security Terminal", description: "Weapons storage and tracking system", effect: "Computer Use vs 3 Difficulty. Success reveals weapon locations or can trigger security lockdown", icon: "🎯", security: true }
    ]
  },
  
  "61-March": {
    primary: ["FACILITY_HAZARDS", "WORKER_EVIDENCE", "ENVIRONMENTAL_SYSTEMS"],
    hazards: ["CONTAMINATION_HAZARDS"],
    beneficial: ["BENEFICIAL_SYSTEMS"],
    specific: [
      { name: "Deep Mining Control", description: "Excavation system for asteroid core extraction", effect: "Computer Use vs 3 Difficulty. Success can shut down dangerous mining equipment or access ore data", icon: "⛏️", mining: true },
      { name: "Ore Composition Database", description: "Geological surveys marking Voidsteel deposits", effect: "Knowledge check reveals valuable ore locations. Add 2 Boost to identify high-value scrap", icon: "📊", geological: true },
      { name: "Mining Safety Override", description: "Emergency shutdown for dangerous extraction equipment", effect: "Mechanics vs 3 Difficulty. Success can prevent cave-ins or stabilize mining structures", icon: "⚠️", safety: true }
    ]
  },
  
  "20-Adamance": {
    primary: ["FACILITY_HAZARDS", "ENVIRONMENTAL_SYSTEMS", "CONTAMINATION_HAZARDS"],
    hazards: ["CORPORATE_HAZARDS"],
    beneficial: ["BENEFICIAL_SYSTEMS"],
    specific: [
      { name: "Mountain Extraction Terminal", description: "Massive excavation control system", effect: "Computer Use vs 4 Difficulty. Success can shut down large-scale mining or prevent structural collapse", icon: "🏔️", extraction: true },
      { name: "Geological Instability Warning", description: "System monitoring mining-induced damage", effect: "Computer Use vs 2 Difficulty. Success reveals unstable areas and provides safe navigation routes", icon: "🌍", stability: true },
      { name: "Ore Transport Controls", description: "Conveyor system management for raw materials", effect: "Mechanics vs 2 Difficulty. Success can redirect ore flow or clear transport blockages", icon: "🚛", transport: true }
    ]
  },
  
  "85-Rend": {
    primary: ["FACILITY_HAZARDS", "CONTAMINATION_HAZARDS", "ENVIRONMENTAL_SYSTEMS"],
    hazards: ["CORPORATE_HAZARDS"],
    beneficial: ["BENEFICIAL_SYSTEMS"],
    specific: [
      { name: "Heat Processing Controls", description: "High-temperature Voidsteel refinement system", effect: "Computer Use vs 3 Difficulty. Success can regulate temperature or shut down overheating equipment", icon: "🔥", thermal: true },
      { name: "Cooling System Emergency", description: "Critical temperature management for processing", effect: "Mechanics vs 4 Difficulty. Success prevents thermal overload or restores safe cooling", icon: "💨", cooling: true },
      { name: "Thermal Processing Data", description: "Temperature monitoring and safety thresholds", effect: "Knowledge check reveals thermal hazards. Add 2 Boost to avoid heat-related dangers", icon: "🌡️", thermal_data: true }
    ]
  },
  
  "7-Dine": {
    primary: ["ENVIRONMENTAL_SYSTEMS", "CONTAMINATION_HAZARDS", "CORPORATE_HAZARDS"],
    hazards: ["FACILITY_HAZARDS"],
    beneficial: ["BENEFICIAL_SYSTEMS"],
    specific: [
      { name: "Waste Treatment Override", description: "Environmental system controls for contamination", effect: "Computer Use vs 3 Difficulty. Success can restore water treatment or isolate toxic waste", icon: "🗑️", treatment: true },
      { name: "Environmental Monitoring Hub", description: "Air and water quality management system", effect: "Computer Use vs 2 Difficulty. Success reveals contamination levels and can improve air quality", icon: "💧", monitoring: true },
      { name: "Emergency Life Support", description: "Backup environmental controls for crisis situations", effect: "Computer Use vs 3 Difficulty. Success restores safe air and water to facility sections", icon: "🫁", life_support: true }
    ]
  },
  
  "8-Titan": {
    primary: ["FACILITY_HAZARDS", "CORPORATE_HAZARDS", "CONTAMINATION_HAZARDS"],
    hazards: ["ENVIRONMENTAL_SYSTEMS"],
    beneficial: ["BENEFICIAL_SYSTEMS"],
    specific: [
      { name: "Manufacturing Hub Control", description: "Central processing for contaminated product creation", effect: "Computer Use vs 4 Difficulty. Success can halt contaminated production or access distribution data", icon: "🏭", manufacturing: true },
      { name: "Quality Control Bypass Terminal", description: "System showing deliberately skipped safety inspections", effect: "Computer Use vs 2 Difficulty. Success reveals which products are most dangerous to handle", icon: "❌", quality_control: true },
      { name: "Product Distribution Override", description: "Shipping control for contaminated items", effect: "Computer Use vs 3 Difficulty. Success can redirect shipments or access facility supply data", icon: "📦", distribution: true }
    ]
  },
  
  "68-Artifice": {
    primary: ["CONTAMINATION_HAZARDS", "CORPORATE_HAZARDS", "FACILITY_HAZARDS"],
    hazards: ["ENVIRONMENTAL_SYSTEMS", "WORKER_EVIDENCE"],
    beneficial: ["BENEFICIAL_SYSTEMS"],
    specific: [
      { name: "Halden Incident Archive", description: "Complete records of the catastrophic Voidsteel breach", effect: "Computer Use vs 4 Difficulty. Success provides incident timeline and emergency containment protocols", icon: "☢️", incident: true },
      { name: "Experimental Containment Override", description: "Emergency shutdown for dangerous research equipment", effect: "Computer Use vs 5 Difficulty. Success can halt ongoing experiments or seal breach areas", icon: "⚗️", containment: true },
      { name: "Corporate Cover-up Database", description: "Evidence of Syndicate concealing incident details", effect: "Knowledge check reveals corporate conspiracy. Add 3 Boost to resist corporate authority", icon: "🤐", conspiracy: true }
    ]
  }
};

// Generate features based on facility role, story context, and interior type
export const generateStoryAlignedFeatures = (x, y, floorNum, interiorType, moonName) => {
  const hasAnyFeature = Math.random() < 0.85; // 85% chance for story relevance
  if (!hasAnyFeature) return [];
  
  const facilityConfig = FACILITY_FEATURES[moonName];
  if (!facilityConfig) return [];
  
  const numFeatures = Math.random() < 0.8 ? 1 : 2;
  const features = [];
  
  for (let i = 0; i < numFeatures; i++) {
    const seed = (x * 97 + y * 89 + floorNum * 83 + i * 79) % 999983;
    const rand = Math.abs(Math.sin(seed) * 10000) % 1;
    
    let selectedFeature;
    let categoryName;
    
    // 30% facility-specific, 40% primary categories, 20% hazards, 10% beneficial
    if (rand < 0.3 && facilityConfig.specific.length > 0) {
      const specificIndex = Math.floor(rand * facilityConfig.specific.length * 3.33) % facilityConfig.specific.length;
      selectedFeature = facilityConfig.specific[specificIndex];
      categoryName = 'FACILITY_SPECIFIC';
    } else if (rand < 0.7) {
      // Select from primary categories
      const primaryCategory = facilityConfig.primary[Math.floor((rand - 0.3) * facilityConfig.primary.length * 2.5) % facilityConfig.primary.length];
      const categoryFeatures = HALLWAY_FEATURES[primaryCategory];
      
      if (categoryFeatures && categoryFeatures.length > 0) {
        // Filter by interior type if applicable
        let availableFeatures = categoryFeatures.filter(feature => {
          if (feature.interior) {
            return feature.interior.includes(interiorType);
          }
          if (feature.facility) {
            return feature.facility.includes(moonName);
          }
          return true;
        });
        
        if (availableFeatures.length === 0) availableFeatures = categoryFeatures;
        
        const featureIndex = Math.floor((rand - 0.3) * availableFeatures.length * 2.5) % availableFeatures.length;
        selectedFeature = availableFeatures[featureIndex];
        categoryName = primaryCategory;
      }
    } else if (rand < 0.9) {
      // Select from hazard categories
      const hazardCategory = facilityConfig.hazards[Math.floor((rand - 0.7) * facilityConfig.hazards.length * 5) % facilityConfig.hazards.length];
      const categoryFeatures = HALLWAY_FEATURES[hazardCategory];
      
      if (categoryFeatures && categoryFeatures.length > 0) {
        let availableFeatures = categoryFeatures.filter(feature => {
          if (feature.interior) {
            return feature.interior.includes(interiorType);
          }
          if (feature.facility) {
            return feature.facility.includes(moonName);
          }
          return true;
        });
        
        if (availableFeatures.length === 0) availableFeatures = categoryFeatures;
        
        const featureIndex = Math.floor((rand - 0.7) * availableFeatures.length * 5) % availableFeatures.length;
        selectedFeature = availableFeatures[featureIndex];
        categoryName = hazardCategory;
      }
    } else {
      // Select from beneficial systems
      const beneficialFeatures = HALLWAY_FEATURES.BENEFICIAL_SYSTEMS.filter(feature => {
        if (feature.interior) {
          return feature.interior.includes(interiorType);
        }
        return true;
      });
      
      if (beneficialFeatures.length > 0) {
        const featureIndex = Math.floor((rand - 0.9) * beneficialFeatures.length * 10) % beneficialFeatures.length;
        selectedFeature = beneficialFeatures[featureIndex];
        categoryName = 'BENEFICIAL_SYSTEMS';
      }
    }
    
    if (selectedFeature) {
      const position = getStoryFeaturePosition(selectedFeature, seed);
      
      features.push({
        ...selectedFeature,
        id: `story_feature_${moonName}_${x}_${y}_${floorNum}_${i}`,
        position: { x, y, floor: floorNum },
        discovered: false,
        category: categoryName,
        locationInRoom: position,
        storyRelevant: true,
        facility: moonName,
        interiorType: interiorType,
        mechanicsType: getMechanicsType(selectedFeature)
      });
    }
  }
  
  return features;
};

// Determine mechanics type for UI styling
export const getMechanicsType = (feature) => {
  if (feature.dangerous || feature.extreme) return 'dangerous';
  if (feature.beneficial || feature.ship_action) return 'beneficial';
  if (feature.terminal || feature.control) return 'interactive';
  if (feature.blocking || feature.trap) return 'obstacle';
  return 'narrative';
};

// Position determination based on story context and feature type
export const getStoryFeaturePosition = (feature, seed) => {
  const rand = Math.abs(Math.sin(seed) * 10000) % 1;
  const name = feature.name || '';
  const description = feature.description || '';
  
  const positions = {
    wall: ["mounted on the north wall", "built into the south wall", "embedded in the east wall", "affixed to the west wall"],
    floor: ["scattered across the floor", "blocking the walkway", "strewn throughout the area", "piled in the corners"],
    ceiling: ["hanging dangerously overhead", "suspended from damaged supports", "drooping from the ceiling", "mounted above"],
    blocking: ["completely blocking passage", "partially obstructing the corridor", "creating a dangerous bottleneck", "forcing careful navigation"],
    ambient: ["affecting the entire area", "permeating the atmosphere", "influencing the whole space", "present throughout"]
  };
  
  // Terminal/computer systems go on walls
  if (name.includes("Terminal") || name.includes("System") || name.includes("Display") || name.includes("Monitor")) {
    return positions.wall[Math.floor(rand * positions.wall.length)];
  }
  // Spills, debris, equipment go on floor
  else if (name.includes("Spill") || name.includes("Debris") || name.includes("Equipment") || feature.blocking) {
    return positions.floor[Math.floor(rand * positions.floor.length)];
  }
  // Hanging/suspended dangers
  else if (name.includes("Hanging") || name.includes("Suspended") || description.includes("overhead")) {
    return positions.ceiling[Math.floor(rand * positions.ceiling.length)];
  }
  // Environmental/atmospheric effects
  else if (feature.environmental || feature.atmospheric || description.includes("permeating")) {
    return positions.ambient[Math.floor(rand * positions.ambient.length)];
  }
  // Default to floor positioning
  else {
    return positions.floor[Math.floor(rand * positions.floor.length)];
  }
};

// Enhanced hallway cell function that works with story-aligned features
export const enhanceHallwayCell = (cell, x, y, currentFloor, currentInteriorType, moonName) => {
  // Only enhance hallways and corridors
  if (!cell || cell.type !== 'room' || 
      (cell.room !== ROOM_TYPES.HALLWAY && cell.room !== ROOM_TYPES.CORRIDOR)) {
    return cell;
  }
  
  // Generate or retrieve story-aligned hallway features
  if (!cell.hallwayFeatures) {
    cell.hallwayFeatures = generateHallwayFeatures(x, y, currentFloor, currentInteriorType, moonName);
    // Maintain backward compatibility with single feature
    cell.hallwayFeature = cell.hallwayFeatures.length > 0 ? cell.hallwayFeatures[0] : null;
  }
  
  return cell;
};

// Enhanced tooltip function
export const getEnhancedHallwayTooltip = (cell, originalTooltip) => {
  const features = cell.hallwayFeatures || (cell.hallwayFeature ? [cell.hallwayFeature] : []);
  if (features.length === 0) return originalTooltip;
  
  let enhancedTooltip = originalTooltip;
  
  features.forEach((feature, index) => {
    enhancedTooltip += ` | ${feature.icon} ${feature.name}`;
    if (feature.locationInRoom) {
      enhancedTooltip += ` (${feature.locationInRoom})`;
    }
    if (feature.effect) {
      enhancedTooltip += ` | Effect: ${feature.effect}`;
    }
  });
  
  return enhancedTooltip;
};

// Visual indicator function with mechanics-based styling
export const getHallwayFeatureIndicator = (feature) => {
  if (!feature) return null;
  
  const mechanicsType = getMechanicsType(feature);
  const categoryColors = {
    dangerous: 'bg-red-600',
    beneficial: 'bg-green-600', 
    interactive: 'bg-blue-600',
    obstacle: 'bg-orange-600',
    narrative: 'bg-purple-600'
  };
  
  return {
    color: categoryColors[mechanicsType] || 'bg-gray-600',
    icon: feature.icon,
    category: feature.category,
    mechanicsType: mechanicsType
  };
};

// Integration helper object
export const integrateHallwayFeatures = {
  enhanceCell: (cell, x, y, currentFloor, currentInteriorType, moonName) => {
    return enhanceHallwayCell(cell, x, y, currentFloor, currentInteriorType, moonName);
  },
  
  addTooltip: (cell, originalTooltip) => {
    return getEnhancedHallwayTooltip(cell, originalTooltip);
  },
  
  addVisualIndicator: (cell) => {
    const features = cell.hallwayFeatures || (cell.hallwayFeature ? [cell.hallwayFeature] : []);
    if (features.length === 0) return null;
    
    const indicator = getHallwayFeatureIndicator(features[0]);
    
    return (
      <div className={`w-1.5 h-1.5 ${indicator.color} rounded-full border border-white shadow-sm relative`} 
           title={features.map(f => f.name).join(', ')}>
        {features.length > 1 && (
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full border border-white text-xs flex items-center justify-center">
            <span className="text-black font-bold" style={{fontSize: '6px'}}>
              {features.length}
            </span>
          </div>
        )}
      </div>
    );
  },
  
  renderFeaturePanel: (cell) => {
    const features = cell.hallwayFeatures || (cell.hallwayFeature ? [cell.hallwayFeature] : []);
    if (features.length === 0) return null;
    
    return (
      <div className="space-y-2 mb-2">
        {features.map((feature, index) => {
          const indicator = getHallwayFeatureIndicator(feature);
          const mechanicsType = getMechanicsType(feature);
          
          return (
            <div key={feature.id || index} className={`${indicator.color}/80 p-2 rounded text-white border-l-4 border-${indicator.color.replace('bg-', '')}`}>
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-sm">{feature.icon} {feature.name}</span>
                <div className="flex space-x-1">
                  {mechanicsType === 'dangerous' && (
                    <span className="text-xs bg-red-800 px-1 rounded">⚠️ HAZARD</span>
                  )}
                  {mechanicsType === 'beneficial' && (
                    <span className="text-xs bg-green-800 px-1 rounded">✅ BENEFIT</span>
                  )}
                  {mechanicsType === 'interactive' && (
                    <span className="text-xs bg-blue-800 px-1 rounded">💻 TERMINAL</span>
                  )}
                  {feature.ship_action && (
                    <span className="text-xs bg-cyan-800 px-1 rounded">🚀 SHIP</span>
                  )}
                </div>
              </div>
              <div className="text-xs text-gray-100 mb-1">
                {feature.description}
              </div>
              {feature.locationInRoom && (
                <div className="text-xs text-gray-200 italic mb-1">
                  📍 {feature.locationInRoom}
                </div>
              )}
              <div className="text-xs text-yellow-200 font-medium bg-black/30 p-1 rounded">
                🎲 {feature.effect}
              </div>
            </div>
          );
        })}
      </div>
    );
  }
};

// Export the story-aligned generation function
export const generateHallwayFeatures = generateStoryAlignedFeatures;