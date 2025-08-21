// Enhanced hallway description system for NewInteriorGrid.jsx
import { ROOM_TYPES } from './indoorData.jsx';
import { INTERIOR_TYPES } from './moonData.jsx';

// Massive feature pool for near-infinite variety
export const HALLWAY_FEATURES = {
  // Visual/Environmental Features (40+ options)
  VISUAL: [
    // Lighting variants
    { name: "Flickering Fluorescents", description: "Tube lights stutter between light and darkness", effect: "Intermittent illumination", icon: "💡" },
    { name: "Dying LED Strips", description: "Blue LED strips fade in and out along the baseboards", effect: "Eerie blue glow", icon: "🔵" },
    { name: "Emergency Red Lighting", description: "Crimson emergency lights bathe everything in blood-red", effect: "Ominous atmosphere", icon: "🔴" },
    { name: "Sparking Junction Box", description: "An electrical panel throws occasional sparks", effect: "Electrical hazard", icon: "⚡" },
    { name: "Strobing Security Light", description: "Motion sensor light rapidly flickers on and off", effect: "Disorienting flashes", icon: "🚨" },
    { name: "Broken Skylight", description: "Shattered glass allows pale light to filter down", effect: "Natural lighting with hazards", icon: "🌤️" },
    { name: "Neon Exit Sign", description: "Buzzing green exit sign casts sickly light", effect: "Constant electrical hum", icon: "🟢" },
    { name: "UV Blacklight", description: "Purple ultraviolet light reveals hidden stains", effect: "Shows things better left unseen", icon: "🟣" },
    
    // Wall conditions
    { name: "Rust Stains", description: "Orange-brown oxidation streaks down metal walls", effect: "Industrial decay", icon: "🦠" },
    { name: "Peeling Institutional Paint", description: "Mint green paint curls off in long strips", effect: "Institutional neglect", icon: "🎨" },
    { name: "Graffiti Tags", description: "Spray-painted tags cover concrete surfaces", effect: "Urban decay", icon: "🏷️" },
    { name: "Bullet Holes", description: "Small circular impacts pockmark the walls", effect: "Evidence of violence", icon: "🔫" },
    { name: "Scorch Marks", description: "Black burn patterns mar the ceiling", effect: "Fire damage", icon: "🔥" },
    { name: "Mold Growth", description: "Dark green fungus spreads across damp corners", effect: "Unhealthy air quality", icon: "🦠" },
    { name: "Cracked Plaster", description: "Spider web fractures spread across aged walls", effect: "Structural aging", icon: "🕸️" },
    { name: "Water Damage", description: "Brown stains bloom across ceiling tiles", effect: "Moisture problems", icon: "💧" },
    { name: "Exposed Insulation", description: "Pink fiberglass hangs from gaps in the ceiling", effect: "Poor maintenance", icon: "🧶" },
    { name: "Chipped Concrete", description: "Chunks of concrete litter the floor edges", effect: "Deteriorating structure", icon: "🧱" },
    
    // Atmospheric effects
    { name: "Steam Leak", description: "Pressurized steam hisses from a ceiling pipe", effect: "Reduces visibility", icon: "💨" },
    { name: "Condensation Drip", description: "Water droplets fall rhythmically from above", effect: "Constant dripping sound", icon: "💧" },
    { name: "Dust Particles", description: "Thick motes dance in shafts of light", effect: "Poor air quality", icon: "✨" },
    { name: "Chemical Vapor", description: "Faint wisps of unknown gas drift past", effect: "Unidentified hazard", icon: "☁️" },
    { name: "Oil Sheen", description: "Rainbow film covers puddles on the floor", effect: "Slippery surface", icon: "🌈" },
    
    // Architectural details
    { name: "Vaulted Ceiling", description: "High arched ceiling creates echoing acoustics", effect: "Sound amplification", icon: "⛪" },
    { name: "Low Hanging Pipes", description: "Industrial conduits force you to duck", effect: "Restricted headroom", icon: "🪠" },
    { name: "Tiled Walls", description: "Institutional white tiles, many cracked or missing", effect: "Clinical atmosphere", icon: "⬜" },
    { name: "Brick Archway", description: "Old red brick frames the passage entrance", effect: "Historic architecture", icon: "🧱" },
    { name: "Metal Grating Floor", description: "Perforated steel plates reveal darkness below", effect: "Industrial flooring", icon: "🔳" },
    { name: "Concrete Pillars", description: "Thick support columns narrow the walkway", effect: "Structural obstacles", icon: "🏛️" },
    { name: "Dropped Ceiling", description: "Acoustic tiles hang at various heights", effect: "Uneven headspace", icon: "📐" },
    
    // Doors and openings
    { name: "Sealed Doorway", description: "Steel plates weld shut a former entrance", effect: "Blocked access", icon: "🚪" },
    { name: "Broken Window", description: "Shattered glass window overlooks another area", effect: "Visibility to adjacent spaces", icon: "🪟" },
    { name: "Ventilation Grate", description: "Large air intake draws a constant breeze", effect: "Air circulation", icon: "🌪️" },
    { name: "Security Camera", description: "Defunct surveillance camera hangs askew", effect: "Former monitoring", icon: "📹" },
    
    // Color variations
    { name: "Yellow Warning Stripes", description: "Faded hazard tape lines the walls", effect: "Safety marking", icon: "⚠️" },
    { name: "Blue Floor Marking", description: "Painted navigation lines guide the way", effect: "Directional aid", icon: "🔵" },
    { name: "Red Restricted Zone", description: "Crimson paint marks this as off-limits", effect: "Forbidden area", icon: "🔴" },
    { name: "Green Safety Path", description: "Luminescent paint glows faintly", effect: "Emergency route", icon: "🟢" },
    
    // Decay variations
    { name: "Rusted Metal Sheets", description: "Corrugated steel walls show extensive corrosion", effect: "Industrial deterioration", icon: "🦠" },
    { name: "Crumbling Mortar", description: "Cement between bricks has eroded away", effect: "Structural weakness", icon: "🏗️" },
    { name: "Warped Flooring", description: "Wooden planks have buckled and twisted", effect: "Uneven walking surface", icon: "🪵" },
    { name: "Sagging Ceiling", description: "Support beams bow under unseen weight", effect: "Structural concern", icon: "📉" },
  ],

  // Physical Obstacles (40+ options)
  OBSTACLES: [
    // Debris types
    { name: "Concrete Rubble", description: "Chunks of reinforced concrete block the path", effect: "Navigation obstacle", icon: "🪨" },
    { name: "Twisted Rebar", description: "Bent steel reinforcement bars jut dangerously", effect: "Sharp hazard", icon: "🔩" },
    { name: "Fallen Ceiling Tiles", description: "Acoustic panels litter the walkway", effect: "Crunchy footing", icon: "🔲" },
    { name: "Shattered Glass", description: "Window fragments create a glittering carpet", effect: "Cutting hazard", icon: "💎" },
    { name: "Collapsed Shelving", description: "Metal storage racks have toppled over", effect: "Climbing obstacle", icon: "📚" },
    { name: "Overturned Desk", description: "Office furniture blocks half the corridor", effect: "Partial obstruction", icon: "🪑" },
    { name: "Cable Spaghetti", description: "Hundreds of wires tangle across the floor", effect: "Trip hazard", icon: "🍝" },
    { name: "Broken Mannequin", description: "Store display dummy lies dismembered", effect: "Eerie obstruction", icon: "🏃" },
    { name: "Spilled Chemical Barrels", description: "Industrial drums leak unknown substances", effect: "Chemical hazard", icon: "🛢️" },
    { name: "Fallen Beam", description: "Steel I-beam has crashed from the ceiling", effect: "Major blockage", icon: "🏗️" },
    
    // Water/liquid obstacles
    { name: "Knee-Deep Flood", description: "Murky water fills the lower portion", effect: "Slow movement", icon: "🌊" },
    { name: "Slippery Oil Spill", description: "Black petroleum creates a treacherous surface", effect: "Fall risk", icon: "⚫" },
    { name: "Frozen Puddle", description: "Ice sheet covers the entire walkway", effect: "Slipping hazard", icon: "🧊" },
    { name: "Sewage Backup", description: "Unpleasant brown liquid seeps from drains", effect: "Disgusting obstacle", icon: "💩" },
    { name: "Acid Pool", description: "Corrosive liquid has eaten through the floor", effect: "Dangerous pit", icon: "🟢" },
    { name: "Steam Geyser", description: "Broken pipe shoots scalding water upward", effect: "Burn hazard", icon: "💨" },
    
    // Equipment obstacles
    { name: "Abandoned Forklift", description: "Industrial vehicle blocks the entire width", effect: "Complete blockage", icon: "🚚" },
    { name: "Medical Gurney", description: "Hospital bed sits motionless in the center", effect: "Partial obstruction", icon: "🛏️" },
    { name: "Shopping Cart Pile", description: "Dozens of carts form a metallic barricade", effect: "Climbing required", icon: "🛒" },
    { name: "Server Racks", description: "Computer equipment towers create a maze", effect: "Narrow passages", icon: "🖥️" },
    { name: "Laboratory Equipment", description: "Overturned scientific instruments scatter about", effect: "Delicate obstacles", icon: "🧪" },
    { name: "Vending Machine", description: "Toppled snack dispenser blocks the way", effect: "Heavy obstacle", icon: "🥤" },
    { name: "Copy Machine", description: "Office printer lies on its side", effect: "Awkward barrier", icon: "🖨️" },
    
    // Natural/organic obstacles
    { name: "Overgrown Vines", description: "Thick vegetation has invaded through cracks", effect: "Jungle-like obstruction", icon: "🌿" },
    { name: "Bird Nest Blockage", description: "Massive nest blocks the upper portion", effect: "Ducking required", icon: "🪺" },
    { name: "Spider Web Wall", description: "Enormous web spans the entire opening", effect: "Sticky barrier", icon: "🕷️" },
    { name: "Mushroom Growth", description: "Giant fungi have sprouted from the floor", effect: "Organic obstacles", icon: "🍄" },
    { name: "Tree Root Intrusion", description: "Thick roots have pushed through the concrete", effect: "Natural barrier", icon: "🌳" },
    
    // Construction/maintenance
    { name: "Caution Tape Maze", description: "Yellow warning tape crisscrosses everywhere", effect: "Tangled navigation", icon: "⚠️" },
    { name: "Scaffolding Collapse", description: "Construction framework has fallen inward", effect: "Metal obstacle course", icon: "🏗️" },
    { name: "Paint Buckets", description: "Spilled containers create colorful hazards", effect: "Slippery mess", icon: "🪣" },
    { name: "Tool Cart Wreck", description: "Overturned maintenance cart spills tools", effect: "Sharp debris", icon: "🧰" },
    { name: "Plastic Sheeting", description: "Construction plastic hangs like curtains", effect: "Vision obstruction", icon: "🛠️" },
    
    // Vehicle obstacles
    { name: "Golf Cart", description: "Electric utility vehicle sits abandoned", effect: "Moderate blockage", icon: "🏌️" },
    { name: "Wheelchair", description: "Empty mobility device blocks the center", effect: "Eerie obstacle", icon: "♿" },
    { name: "Hand Truck", description: "Delivery cart lies tipped over", effect: "Metal barrier", icon: "📦" },
    { name: "Motorcycle", description: "Crashed bike creates an odd obstruction", effect: "Unexpected barrier", icon: "🏍️" },
    
    // Furniture obstacles
    { name: "Conference Table", description: "Long wooden table spans the width", effect: "Crawling required", icon: "🪑" },
    { name: "Filing Cabinets", description: "Metal drawers have toppled like dominoes", effect: "Stepped obstacles", icon: "🗄️" },
    { name: "Couch Barricade", description: "Upholstered furniture forms a wall", effect: "Soft but complete block", icon: "🛋️" },
    { name: "Piano", description: "Grand piano somehow blocks the passage", effect: "Massive obstacle", icon: "🎹" },
    { name: "Bookshelf Avalanche", description: "Fallen shelves create a paper mountain", effect: "Climbable debris", icon: "📚" },
  ],

  // Lore Elements (50+ options)
  LORE: [
    // Audio devices
    { name: "Crackling Radio", description: "Emergency radio broadcasts static and fragments", media: "Audio Log", content: "Distress calls and evacuation orders", icon: "📻" },
    { name: "Answering Machine", description: "Office phone blinks with unheard messages", media: "Voice Messages", content: "Employee communications", icon: "📞" },
    { name: "Intercom Feedback", description: "PA system occasionally squeals to life", media: "Public Address", content: "Automated facility warnings", icon: "📢" },
    { name: "Tape Recorder", description: "Handheld device plays on endless loop", media: "Personal Recording", content: "Survivor's journal entries", icon: "📼" },
    { name: "Music Box", description: "Broken toy plays a haunting melody", media: "Environmental Sound", content: "Childhood memories", icon: "🎵" },
    
    // Visual displays
    { name: "Security Feed", description: "Monitor displays looping surveillance footage", media: "Video Log", content: "Incident documentation", icon: "📺" },
    { name: "Digital Display", description: "LED sign scrolls error messages endlessly", media: "System Messages", content: "Technical diagnostics", icon: "💻" },
    { name: "Projection Screen", description: "Wall display shows frozen presentation", media: "Corporate Briefing", content: "Company procedures", icon: "📽️" },
    { name: "Tablet Computer", description: "Cracked device still shows last opened file", media: "Digital Document", content: "Employee schedules", icon: "📱" },
    { name: "CRT Monitor", description: "Old computer screen flickers with green text", media: "Terminal Interface", content: "System logs", icon: "🖥️" },
    
    // Written materials
    { name: "Scattered Documents", description: "Important papers litter the ground", media: "Paper Files", content: "Classified reports", icon: "📄" },
    { name: "Whiteboard Notes", description: "Urgent messages scrawled in dry erase", media: "Written Messages", content: "Last-minute communications", icon: "📝" },
    { name: "Bulletin Board", description: "Cork surface covered in pushpin notices", media: "Posted Announcements", content: "Safety updates and warnings", icon: "📌" },
    { name: "Sticky Note Trail", description: "Yellow notes create a breadcrumb path", media: "Personal Notes", content: "Escape route markers", icon: "🗒️" },
    { name: "Graffitied Wall", description: "Desperate messages carved into concrete", media: "Survivor Messages", content: "Warnings and pleas for help", icon: "✍️" },
    
    // Personal effects
    { name: "Dropped Wallet", description: "Leather billfold contains ID and photos", media: "Personal Items", content: "Employee identification", icon: "🪪" },
    { name: "Coffee Mug", description: "Half-empty cup with lipstick stain", media: "Personal Belongings", content: "Signs of interrupted routine", icon: "☕" },
    { name: "Reading Glasses", description: "Broken spectacles with prescription label", media: "Personal Effects", content: "Owner identification", icon: "👓" },
    { name: "Keychain Collection", description: "Janitor's keys scattered on the floor", media: "Access Items", content: "Facility master keys", icon: "🗝️" },
    { name: "Employee Badge", description: "Photo ID clipped to torn shirt fabric", media: "Identification", content: "Staff member information", icon: "🆔" },
    
    // Evidence of struggle
    { name: "Overturned Table", description: "Furniture shows signs of violent disturbance", media: "Physical Evidence", content: "Scene of conflict", icon: "🪑" },
    { name: "Broken Window", description: "Glass shards suggest explosive exit", media: "Escape Evidence", content: "Emergency evacuation route", icon: "🪟" },
    { name: "Torn Clothing", description: "Fabric strips hang from sharp edges", media: "Personal Evidence", content: "Hasty escape indicators", icon: "👕" },
    { name: "Spilled Blood", description: "Dark stains tell a violent story", media: "Forensic Evidence", content: "Incident scene markers", icon: "🩸" },
    { name: "Claw Marks", description: "Deep gouges score the metal walls", media: "Attack Evidence", content: "Creature encounter signs", icon: "🐾" },
    
    // Technology
    { name: "Server Terminal", description: "Blinking lights indicate active processes", media: "Computer System", content: "Facility management data", icon: "🖥️" },
    { name: "Backup Generator", description: "Emergency power system hums quietly", media: "Technical Equipment", content: "Power grid information", icon: "⚡" },
    { name: "Ventilation Control", description: "Air system panel shows red warning lights", media: "Environmental Controls", content: "Atmospheric monitoring", icon: "🌪️" },
    { name: "Fire Suppression", description: "Sprinkler system shows malfunction codes", media: "Safety Systems", content: "Emergency response logs", icon: "🚿" },
    
    // Medical/scientific
    { name: "Medical Chart", description: "Patient clipboard with disturbing notes", media: "Medical Records", content: "Quarantine documentation", icon: "📋" },
    { name: "Lab Notebook", description: "Research journal with urgent scribbles", media: "Scientific Data", content: "Experiment observations", icon: "🧪" },
    { name: "Specimen Container", description: "Empty jar with warning labels", media: "Research Materials", content: "Biological sample data", icon: "🧫" },
    { name: "X-Ray Viewer", description: "Medical imaging shows unusual anomalies", media: "Diagnostic Images", content: "Biological anomaly records", icon: "🔍" },
    
    // Security/military
    { name: "Weapon Cache", description: "Hidden compartment contains emergency arms", media: "Security Equipment", content: "Tactical response protocols", icon: "🔫" },
    { name: "Surveillance Hub", description: "Multiple monitors show facility coverage", media: "Security Network", content: "Real-time monitoring data", icon: "📹" },
    { name: "Access Control", description: "Card reader flashes red denial messages", media: "Security System", content: "Authorization logs", icon: "🔐" },
    { name: "Panic Button", description: "Emergency alert switch has been triggered", media: "Alert System", content: "Emergency activation records", icon: "🚨" },
  ],

  // Atmospheric Elements (20+ options)
  ATMOSPHERIC: [
    // Temperature effects
    { name: "Freezing Cold", description: "Breath mists in the frigid air", effect: "Uncomfortable chill", icon: "🧊" },
    { name: "Oppressive Heat", description: "Stifling warmth radiates from nearby machinery", effect: "Uncomfortable warmth", icon: "🔥" },
    { name: "Temperature Gradient", description: "One side cold, the other uncomfortably warm", effect: "Uneven climate", icon: "🌡️" },
    { name: "Humid Condensation", description: "Moisture beads on every surface", effect: "Sticky atmosphere", icon: "💧" },
    
    // Air quality
    { name: "Stale Air", description: "Oxygen feels thin and recycled", effect: "Breathing difficulty", icon: "💨" },
    { name: "Chemical Scent", description: "Sharp industrial odor burns the nostrils", effect: "Unpleasant smell", icon: "⚗️" },
    { name: "Metallic Taste", description: "Copper flavor coats the tongue", effect: "Disturbing sensation", icon: "🪙" },
    { name: "Ozone Smell", description: "Electric discharge creates sharp aroma", effect: "Electrical activity nearby", icon: "⚡" },
    { name: "Decay Odor", description: "Something organic is rotting nearby", effect: "Nauseating smell", icon: "🦠" },
    
    // Acoustic effects
    { name: "Perfect Silence", description: "Sound seems to be absorbed completely", effect: "Unnaturally quiet", icon: "🔇" },
    { name: "Mechanical Rhythm", description: "Distant machinery creates steady beat", effect: "Hypnotic percussion", icon: "🥁" },
    { name: "Echo Amplification", description: "Every sound reverberates endlessly", effect: "Sound magnification", icon: "📢" },
    { name: "Subsonic Vibration", description: "Low frequency hum felt in bones", effect: "Physical discomfort", icon: "🔊" },
    { name: "White Noise", description: "Constant static fills the audio space", effect: "Sound masking", icon: "📻" },
    
    // Pressure/air movement
    { name: "Strong Draft", description: "Constant wind pulls through the corridor", effect: "Air circulation", icon: "🌪️" },
    { name: "Pressure Drop", description: "Ears pop as elevation seems to change", effect: "Altitude sensation", icon: "✈️" },
    { name: "Vacuum Effect", description: "Air seems to be drawn away constantly", effect: "Breathing resistance", icon: "🌪️" },
    { name: "Gentle Breeze", description: "Soft air movement provides mild relief", effect: "Pleasant circulation", icon: "🍃" },
    
    // Magnetic/electrical
    { name: "Static Charge", description: "Hair stands on end from electrical buildup", effect: "Electromagnetic activity", icon: "⚡" },
    { name: "Magnetic Pull", description: "Metal objects seem drawn to the walls", effect: "Magnetic anomaly", icon: "🧲" },
    { name: "Radio Interference", description: "Electronic devices malfunction here", effect: "Communication disruption", icon: "📡" },
    
    // Psychological
    { name: "Oppressive Feeling", description: "Inexplicable sense of being watched", effect: "Psychological unease", icon: "👁️" },
    { name: "Claustrophobic Space", description: "Walls seem to press inward", effect: "Spatial anxiety", icon: "📦" },
    { name: "Vertigo Sensation", description: "Floor appears to tilt despite being level", effect: "Balance disruption", icon: "🌀" },
    { name: "Time Distortion", description: "Clocks seem to move differently here", effect: "Temporal confusion", icon: "⏰" },
  ],

  BENEFICIAL: [
    // Temporary Boosts and Minor Aids (15+ options)
    { name: "Fresh Battery", description: "Single AA battery with some charge left", effect: "Restore 15 battery charge to one electronic item", icon: "🔋" },
    { name: "Emergency Flare", description: "Red signal flare with limited burn time", effect: "Create bright illumination in current room for 1 round", icon: "🔥" },
    { name: "Pocket Mirror", description: "Small reflective surface for signaling", effect: "Add 2 boost dice to next Perception check to see around corners", icon: "🪞" },
    { name: "Chalk Stick", description: "White marking chalk, almost used up", effect: "Mark current room - add 1 boost die to Navigation checks when returning here", icon: "✏️" },
    { name: "Paper Clip", description: "Bent metal wire for simple tasks", effect: "Add 2 boost dice to next Skulduggery check to pick a simple lock", icon: "📎" },
    { name: "Rubber Band", description: "Elastic band for improvised solutions", effect: "Hold one door open or trigger one pressure plate for 2 rounds", icon: "🔗" },
    { name: "Coin", description: "Metal disk for simple mechanical needs", effect: "Add 1 boost die to next Mechanics check involving screws or small parts", icon: "🪙" },
    { name: "Sticky Note", description: "Adhesive paper for quick messages", effect: "Leave one message that gives team +1 boost die to related checks", icon: "🗒️" },
    { name: "Shoelace", description: "Spare bootlace for binding things", effect: "Secure one small item or bind one immobilized target", icon: "👟" },
    { name: "Magnifying Glass", description: "Cracked lens still partially functional", effect: "Add 2 boost dice to next check examining small details or clues", icon: "🔍" },
    { name: "Whistle", description: "Emergency signaling device", effect: "Alert all team members within 5 rooms of your location", icon: "🎺" },
    { name: "Marble", description: "Small glass sphere for testing slopes", effect: "Detect floor vibrations or movement in adjacent rooms", icon: "⚪" },
    { name: "Safety Pin", description: "Sharp metal fastener", effect: "Add 1 boost die to Skulduggery or Mechanics check involving small mechanisms", icon: "📍" },
    { name: "Rubber Glove", description: "Single protective hand covering", effect: "Handle one electrically charged or contaminated item safely", icon: "🧤" },
    { name: "Button", description: "Plastic fastener from clothing", effect: "Wedge one door slightly open or trigger one button/switch remotely", icon: "⚫" },

    // Consumables and Chemicals (12+ options)
    { name: "Focus Stimulant", description: "Laboratory nootropic enhancer", effect: "Add 1 boost die to all Perception checks for 4 rounds", icon: "💊" },
    { name: "Energy Drink", description: "High-caffeine beverage, still cold", effect: "Add 1 boost die to all Athletics checks for 8 rounds", icon: "🥤" },
    { name: "Protein Bar", description: "High-calorie emergency ration", effect: "Recover 2 strain immediately", icon: "🍫" },
    { name: "Antiseptic Wipes", description: "Sterile cleaning packets", effect: "Remove 1 poison or disease condition", icon: "🧽" },
    { name: "Pain Reliever", description: "Over-the-counter medication bottle", effect: "Ignore all wound penalties for 16 rounds", icon: "💉" },
    { name: "Vitamin Supplements", description: "Immune system boosters", effect: "Add 1 boost die to Resilience checks for 8 rounds", icon: "🟡" },
    { name: "Hand Sanitizer", description: "Alcohol-based disinfectant gel", effect: "Remove contamination conditions from hands", icon: "🧴" },
    { name: "Electrolyte Solution", description: "Sports drink for rehydration", effect: "Remove fatigue and dehydration conditions", icon: "💧" },
    { name: "Oxygen Canister", description: "Emergency breathing supplement", effect: "Ignore suffocation effects for 3 rounds", icon: "🫁" },
    { name: "Smelling Salts", description: "Ammonia capsules for revival", effect: "Immediately wake one unconscious character", icon: "💨" },
    { name: "Antacid Tablets", description: "Stomach relief medication", effect: "Neutralize one ingested poison or toxin", icon: "🟢" },
    { name: "Eye Drops", description: "Saline solution for eye irritation", effect: "Remove blinded condition from chemical exposure", icon: "👁️" },

    // Temporary Navigation and Access (10+ options)
    { name: "Torn Keycard", description: "Damaged access badge with partial function", effect: "Add 3 boost dice to next Skulduggery check to bypass electronic door", icon: "🔑" },
    { name: "Scribbled Map Fragment", description: "Hand-drawn partial floor plan", effect: "Add 2 boost dice to Navigation checks on current floor for 8 rounds", icon: "🗺️" },
    { name: "Dying Phone GPS", description: "Smartphone with 5% battery showing location", effect: "Know exact grid position and add 1 boost die to Navigation for 3 rounds", icon: "📱" },
    { name: "Pocket Compass", description: "Magnetic needle stuck in cracked case", effect: "Add 1 boost die to Navigation checks for 4 rounds", icon: "🧭" },
    { name: "Scrawled Door Code", description: "4-digit number written on wall", effect: "Automatically open one electronic lock without a check", icon: "🔢" },
    { name: "Vending Machine Change", description: "Scattered coins from broken dispenser", effect: "Purchase one item from any functioning vending machine", icon: "🪙" },
    { name: "Fake ID Badge", description: "Expired employee credentials", effect: "Add 3 boost dice to next Deception check against security systems", icon: "🆔" },
    { name: "Shift Schedule Note", description: "Crumpled paper with patrol times", effect: "Add 2 boost dice to Stealth checks for 6 rounds", icon: "📅" },
    { name: "Emergency Exit Arrow", description: "Glowing sign pointing toward safety", effect: "Automatically succeed on next Navigation check to find building exit", icon: "🚪" },
    { name: "Post-it Combo", description: "Sticky note with locker numbers", effect: "Open one storage container without Skulduggery check", icon: "🔐" },

    // Quick Information and Clues (12+ options)
    { name: "Flickering Security Monitor", description: "Screen shows brief footage of other areas", effect: "Reveal contents and entities in 2 adjacent rooms", icon: "📹" },
    { name: "Scattered Memo Pages", description: "Torn employee notices blowing around", effect: "Learn one facility detail: add 1 boost die to next Knowledge check", icon: "📝" },
    { name: "Overheard Radio Chatter", description: "Brief transmission from emergency responders", effect: "Learn location of one entity within 3 rooms", icon: "📻" },
    { name: "Weather Alert Display", description: "Digital sign showing current conditions", effect: "Know outdoor weather: add 2 boost dice to outdoor Survival checks", icon: "🌤️" },
    { name: "Inventory Slip", description: "Crumpled supply list from clipboard", effect: "Know scrap locations in one adjacent room", icon: "📋" },
    { name: "Emergency Contact Poster", description: "Faded wall chart with phone numbers", effect: "If communication available, call for rescue (GM determines response)", icon: "📞" },
    { name: "Safety Warning Sign", description: "Posted notice about local hazards", effect: "Add 2 boost dice to next check avoiding environmental dangers", icon: "⚠️" },
    { name: "Employee Photo Board", description: "Staff pictures with name tags", effect: "Identify personnel: add 1 boost die to social checks with facility staff", icon: "👥" },
    { name: "Maintenance Sticker", description: "Equipment tag showing last service date", effect: "Add 2 boost dice to Mechanics checks on tagged equipment", icon: "🔧" },
    { name: "Delivery Receipt", description: "Carbon copy of recent shipment", effect: "Know what supplies arrived recently and where they might be", icon: "📦" },
    { name: "Training Poster", description: "Laminated instructions for equipment", effect: "Use one unfamiliar device without penalty to difficulty", icon: "📖" },
    { name: "Incident Report Copy", description: "Duplicate of accident documentation", effect: "Learn about one specific hazard: add 2 boost dice to avoid similar dangers", icon: "📄" },

    // Brief Environmental Relief (8+ options)
    { name: "Working AC Vent", description: "Cool air flows for a few minutes", effect: "Remove heat exhaustion condition and recover 1 strain", icon: "❄️" },
    { name: "Fresh Air Leak", description: "Crack in wall lets outside air in", effect: "Remove suffocation and gas poisoning conditions", icon: "🌬️" },
    { name: "Sunbeam", description: "Natural light streams through small opening", effect: "Add 1 boost die to Discipline checks for 6 rounds", icon: "☀️" },
    { name: "Cushioned Debris", description: "Pile of soft material good for quick rest", effect: "Recover 1 additional strain when resting here", icon: "💺" },
    { name: "Clean Water Drip", description: "Condensation collects in clean container", effect: "Remove dehydration condition", icon: "💧" },
    { name: "Sound Buffer Zone", description: "Acoustic deadening reduces noise briefly", effect: "Add 2 boost dice to Stealth checks for 3 rounds", icon: "🔇" },
    { name: "Emergency Wash Station", description: "Eye wash with limited water supply", effect: "Remove blinded condition and chemical contamination", icon: "🚿" },
    { name: "Lead Lined Section", description: "Thick walls block radiation temporarily", effect: "Remove radiation poisoning condition while in this room", icon: "☢️" },

    // Temporary Technology Access (10+ options)
    { name: "Live Power Outlet", description: "Wall socket with limited electricity remaining", effect: "Restore 10 battery charge to one electronic device", icon: "🔌" },
    { name: "Functioning Terminal", description: "Computer with brief access before auto-logout", effect: "Access facility database: add 3 boost dice to next Knowledge check", icon: "💻" },
    { name: "Spare Battery Pack", description: "Backup cell with partial charge remaining", effect: "Restore 20 battery charge to one electronic device", icon: "🔋" },
    { name: "Signal Amplifier", description: "Antenna boosts radio for one transmission", effect: "Send one walkie-talkie message to any range within facility", icon: "📡" },
    { name: "Motion Sensor Light", description: "Detector illuminates area when triggered", effect: "Automatically detect entities entering adjacent rooms for 4 rounds", icon: "👀" },
    { name: "Emergency Beacon Button", description: "One-time distress signal transmitter", effect: "Send rescue signal (GM determines if/when help arrives)", icon: "🚨" },
    { name: "Infrared Thermometer", description: "Handheld device with single reading left", effect: "Detect heat signatures through walls in one adjacent room", icon: "🌡️" },
    { name: "Voice Message Player", description: "Device plays one recorded message", effect: "Hear facility staff message: add 2 boost dice to related Knowledge check", icon: "🎙️" },
    { name: "UV Sanitizer Wand", description: "Sterilization device with brief battery", effect: "Remove one disease or contamination condition", icon: "💡" },
    { name: "Metal Detector Sweep", description: "Handheld scanner with one detection left", effect: "Detect all metallic scrap in current room automatically", icon: "🔍" },

    // Temporary Protection and Relief (8+ options)
    { name: "Makeshift Shield", description: "Piece of metal provides brief cover", effect: "Add 1 defense die to next attack, then item is destroyed", icon: "🛡️" },
    { name: "Filter Mask", description: "Disposable respirator with limited filtration", effect: "Ignore gas and airborne toxin effects for 4 rounds", icon: "😷" },
    { name: "Thick Newspaper", description: "Multiple layers provide foot protection", effect: "Move through hazardous floor tiles without taking damage once", icon: "📰" },
    { name: "Thermal Blanket", description: "Emergency foil wrap retains body heat", effect: "Remove cold exposure condition and add 1 boost die to Resilience vs cold", icon: "🥶" },
    { name: "Plastic Bag", description: "Waterproof covering for one item", effect: "Protect one carried item from water or chemical damage", icon: "🛍️" },
    { name: "Safety Vest Scrap", description: "Reflective fabric torn from clothing", effect: "Add 2 boost dice to being spotted by rescue teams for 16 rounds", icon: "🦺" },
    { name: "Rubber Mat Piece", description: "Insulating floor covering", effect: "Stand on electrified surfaces without taking damage for 2 rounds", icon: "⚡" },
    { name: "Cardboard Padding", description: "Thick material for impact protection", effect: "Reduce damage from next fall by 3 points", icon: "📦" },
  ]
};

// Position descriptors for features
export const POSITION_DESCRIPTORS = {
  WALL_POSITIONS: [
    "along the north wall", "against the south wall", "pressed against the east wall", "hugging the west wall",
    "in the northeast corner", "in the northwest corner", "in the southeast corner", "in the southwest corner",
    "mounted on the north wall", "affixed to the south wall", "attached to the east wall", "bolted to the west wall"
  ],
  
  CEILING_POSITIONS: [
    "hanging from the ceiling", "suspended overhead", "dangling from above", "mounted on the ceiling",
    "hanging at head height", "suspended in the center", "drooping from the ceiling", "affixed to the overhead", "swaying from above"
  ],
  
  FLOOR_POSITIONS: [
    "scattered across the floor", "littering the ground", "spread on the floor", "covering the walkway",
    "strewn about the floor", "piled in the center", "heaped on the ground", "clustered on the floor"
  ],
  
  BLOCKING_POSITIONS: [
    "blocking the north passage", "obstructing the south exit", "barring the east path", "blocking the west route",
    "completely blocking passage", "partially obstructing the way", "creating a bottleneck", "forcing navigation around it",
    "sprawled across the entrance", "wedged in the doorway"
  ],
  
  CENTER_POSITIONS: [
    "dominating the center", "positioned in the middle", "occupying the center space",
    "standing in the middle", "centered in the hallway", "placed prominently in center"
  ],
  
  AMBIENT_POSITIONS: [
    "permeating the entire area", "filling the whole space", "throughout the corridor",
    "enveloping the hallway", "present everywhere", "affecting the entire area"
  ]
};

// Determine appropriate position based on feature type
export const getFeaturePosition = (feature, positionSeed) => {
  const rand = Math.abs(Math.sin(positionSeed) * 10000) % 1;
  
  // Safe string checking with fallbacks
  const name = feature.name || '';
  const description = feature.description || '';
  const effect = feature.effect || '';
  const media = feature.media || '';
  
  // Determine position category based on feature characteristics
  if (name.includes('Ceiling') || name.includes('Light') || 
      name.includes('Beam') || name.includes('Pipe') ||
      description.includes('ceiling') || description.includes('overhead')) {
    const positions = POSITION_DESCRIPTORS.CEILING_POSITIONS;
    return positions[Math.floor(rand * positions.length)];
  }
  
  if (name.includes('Floor') || name.includes('Debris') || 
      name.includes('Spill') || name.includes('Scattered') ||
      description.includes('floor') || description.includes('ground')) {
    const positions = POSITION_DESCRIPTORS.FLOOR_POSITIONS;
    return positions[Math.floor(rand * positions.length)];
  }
  
  if (name.includes('Block') || name.includes('Cart') || 
      name.includes('Machine') || name.includes('Vehicle') ||
      effect.includes('obstacle') || effect.includes('block')) {
    const positions = POSITION_DESCRIPTORS.BLOCKING_POSITIONS;
    return positions[Math.floor(rand * positions.length)];
  }
  
  if (name.includes('Wall') || name.includes('Paint') || 
      name.includes('Monitor') || name.includes('Terminal') ||
      description.includes('wall') || media.length > 0) {
    const positions = POSITION_DESCRIPTORS.WALL_POSITIONS;
    return positions[Math.floor(rand * positions.length)];
  }
  
  if (effect.includes('atmosphere') || effect.includes('air') || 
      effect.includes('sound') || effect.includes('smell')) {
    const positions = POSITION_DESCRIPTORS.AMBIENT_POSITIONS;
    return positions[Math.floor(rand * positions.length)];
  }
  
  // Default to center positions for other features
  const positions = POSITION_DESCRIPTORS.CENTER_POSITIONS;
  return positions[Math.floor(rand * positions.length)];
};

// Enhanced random generation with multiple features support
export const generateHallwayFeatures = (x, y, floorNum, interiorType) => {
  // 70% chance to have at least one feature (30% are plain hallways)
  const hasAnyFeature = Math.random() < 0.7;
  if (!hasAnyFeature) {
    return [];
  }
  
  // Determine number of features (1-2, with 2 being less common)
  const numFeatures = Math.random() < 0.75 ? 1 : 2;
  const features = [];
  
  for (let i = 0; i < numFeatures; i++) {
    // Create different seeds for each feature to ensure variety
    const seed1 = (x * 31 + y * 17 + floorNum * 13 + i * 97) % 982451653;
    const seed2 = (x * 47 + y * 23 + floorNum * 29 + i * 73) % 1299721;
    const seed3 = (x * 61 + y * 37 + floorNum * 41 + i * 59) % 7919;
    const positionSeed = (x * 83 + y * 79 + floorNum * 71 + i * 101) % 999983;
    
    // Multiple random values to reduce clustering
    const rand1 = Math.abs(Math.sin(seed1) * 10000) % 1;
    const rand2 = Math.abs(Math.sin(seed2) * 10000) % 1;
    const rand3 = Math.abs(Math.sin(seed3) * 10000) % 1;
    const rand4 = Math.abs(Math.sin(seed1 + seed2 + seed3) * 10000) % 1;
    
    // For multiple features, avoid same category unless very rare
    let availableCategories = ['VISUAL', 'OBSTACLES', 'LORE', 'ATMOSPHERIC', 'BENEFICIAL'];
    if (i > 0 && features.length > 0) {
      const existingCategories = features.map(f => f.category);
      // 80% chance to pick different category, 20% chance to allow same
      if (Math.random() < 0.8) {
        availableCategories = availableCategories.filter(cat => !existingCategories.includes(cat));
        if (availableCategories.length === 0) {
          availableCategories = ['VISUAL', 'OBSTACLES', 'LORE', 'ATMOSPHERIC']; // Fallback
        }
      }
    }
    
    // Weighted category selection based on interior type
    let categoryWeights = {
      VISUAL: 0.35,
      OBSTACLES: 0.25,
      LORE: 0.25,
      ATMOSPHERIC: 0.15,
      BENEFICIAL: 0.20
    };
    
    // Adjust weights based on interior type
    if (interiorType === 'Factory') {
      categoryWeights = { VISUAL: 0.4, OBSTACLES: 0.3, LORE: 0.2, ATMOSPHERIC: 0.1 };
    } else if (interiorType === 'Mansion') {
      categoryWeights = { VISUAL: 0.3, OBSTACLES: 0.2, LORE: 0.35, ATMOSPHERIC: 0.15 };
    } else if (interiorType === 'Mineshaft') {
      categoryWeights = { VISUAL: 0.25, OBSTACLES: 0.45, LORE: 0.15, ATMOSPHERIC: 0.15 };
    }
    
    // Filter weights to only available categories
    const filteredWeights = {};
    let totalWeight = 0;
    for (const cat of availableCategories) {
      filteredWeights[cat] = categoryWeights[cat] || 0.25;
      totalWeight += filteredWeights[cat];
    }
    
    // Normalize weights
    for (const cat in filteredWeights) {
      filteredWeights[cat] = filteredWeights[cat] / totalWeight;
    }
    
    // Select category using weighted random
    let cumulative = 0;
    let selectedCategoryName = null;
    const categoryRand = Math.abs(rand1);
    
    for (const [category, weight] of Object.entries(filteredWeights)) {
      cumulative += weight;
      if (categoryRand <= cumulative) {
        selectedCategoryName = category;
        break;
      }
    }
    
    if (!selectedCategoryName) {
      selectedCategoryName = availableCategories[0];
    }
    
    const selectedCategory = HALLWAY_FEATURES[selectedCategoryName];
    if (!selectedCategory || selectedCategory.length === 0) {
      continue; // Skip this feature if category is empty
    }
    
    // Add interior-specific features to the pool
    let enhancedPool = [...selectedCategory];
    
    // Factory-specific additions
    if (interiorType === 'Factory') {
      enhancedPool = enhancedPool.concat([
        { name: "Assembly Line Debris", description: "Conveyor belt parts scattered across the floor", effect: "Industrial obstacles", icon: "🏭" },
        { name: "Pneumatic Hiss", description: "Air pressure systems cycle with mechanical precision", effect: "Rhythmic industrial sounds", icon: "💨" },
        { name: "Quality Control Station", description: "Abandoned inspection booth with clipboards", media: "Production Records", content: "Manufacturing quality data", icon: "📊" },
        { name: "Warning Klaxon", description: "Red industrial alarm light spins silently", effect: "Emergency alert system", icon: "🚨" },
        { name: "Robotic Arm", description: "Motionless mechanical appendage hangs overhead", effect: "Automation equipment", icon: "🦾" }
      ]);
    }
    
    // Mansion-specific additions
    if (interiorType === 'Mansion') {
      enhancedPool = enhancedPool.concat([
        { name: "Crystal Chandelier", description: "Ornate light fixture dangles at odd angle", effect: "Elegant decay", icon: "💎" },
        { name: "Persian Rug", description: "Expensive carpet shows signs of violence", effect: "Luxurious obstacle", icon: "🏺" },
        { name: "Family Portrait", description: "Oil painting with eyes that seem to follow", media: "Personal History", content: "Family genealogy", icon: "🖼️" },
        { name: "Grandfather Clock", description: "Antique timepiece chimes at wrong intervals", effect: "Temporal distortion", icon: "🕰️" },
        { name: "Wine Cellar Aroma", description: "Rich burgundy scents drift from hidden spaces", effect: "Alcoholic fragrance", icon: "🍷" }
      ]);
    }
    
    // Mineshaft-specific additions
    if (interiorType === 'Mineshaft') {
      enhancedPool = enhancedPool.concat([
        { name: "Mine Cart Rails", description: "Twisted steel tracks create floor hazards", effect: "Trip obstacles", icon: "🛤️" },
        { name: "Support Timber", description: "Rotting wooden beams creak ominously", effect: "Structural instability", icon: "🪵" },
        { name: "Coal Dust", description: "Black powder coats every surface", effect: "Breathing hazard", icon: "⚫" },
        { name: "Miner's Helmet", description: "Hard hat with defunct headlamp", media: "Personal Equipment", content: "Worker identification", icon: "⛑️" },
        { name: "Cave-in Warning", description: "Posted signs warn of unstable ceiling", media: "Safety Documentation", content: "Geological hazard reports", icon: "⚠️" }
      ]);
    }

    // Factory-specific beneficial additions
    if (interiorType === 'Factory') {
      enhancedPool = enhancedPool.concat([
        { name: "Emergency Stop Button", description: "Red switch that shuts down nearby machinery", effect: "Disable dangerous machinery in current room for 8 rounds", icon: "🛑" },
        { name: "Compressed Air Burst", description: "Pressurized line with quick release valve", effect: "Clear all debris obstacles from one adjacent room", icon: "💨" },
        { name: "Assembly Instructions", description: "Laminated card showing equipment operation", effect: "Add 3 boost dice to next Mechanics check on industrial equipment", icon: "📋" },
        { name: "Quality Control Stamp", description: "Approval marker for passing inspection", effect: "Mark one item as 'certified safe' - add 2 boost dice to convince others", icon: "✅" },
        { name: "Warning Light", description: "Amber beacon that still flashes briefly", effect: "Signal team location - all allies add 1 boost die to Navigation to reach you", icon: "🚨" }
      ]);
    }
    
    // Mansion-specific beneficial additions
    if (interiorType === 'Mansion') {
      enhancedPool = enhancedPool.concat([
        { name: "Silver Dinner Bell", description: "Tarnished bell with clear tone", effect: "Alert all team members within mansion of your location", icon: "🔔" },
        { name: "Vintage Wine Cork", description: "High-quality stopper for sealing containers", effect: "Seal one leak or prevent gas escape for 6 rounds", icon: "🍷" },
        { name: "Opera Glasses", description: "Antique binoculars for distant viewing", effect: "Add 3 boost dice to Perception checks in large rooms", icon: "🔭" },
        { name: "Servant Call Button", description: "Brass switch connected to mansion system", effect: "Send one audio signal through mansion intercom system", icon: "📞" },
        { name: "Hidden Panel Latch", description: "Concealed mechanism reveals storage space", effect: "Reveal secret compartment containing random scrap", icon: "🗝️" }
      ]);
    }
    
    // Mineshaft-specific beneficial additions
    if (interiorType === 'Mineshaft') {
      enhancedPool = enhancedPool.concat([
        { name: "Canary Feather", description: "Yellow plume indicates good air quality", effect: "Confirm one adjacent room is free of toxic gases", icon: "🪶" },
        { name: "Mine Cart Brake", description: "Hand lever for controlling cart speed", effect: "Stop any moving mine cart safely without damage", icon: "🚛" },
        { name: "Rock Sample", description: "Mineral specimen showing tunnel stability", effect: "Add 2 boost dice to assess structural safety of walls and ceiling", icon: "🪨" },
        { name: "Ventilation Pipe", description: "Air tube with brief fresh air flow", effect: "Clear toxic gas conditions from current room for 4 rounds", icon: "🌪️" },
        { name: "Safety Rope End", description: "Frayed climbing line still partially secure", effect: "Safely descend one level or climb to adjacent elevated area", icon: "🪢" }
      ]);
    }
    
    // Filter out already selected features to avoid exact duplicates
    if (i > 0) {
      const existingNames = features.map(f => f.name);
      enhancedPool = enhancedPool.filter(f => !existingNames.includes(f.name));
    }
    
    if (enhancedPool.length === 0) {
      continue; // Skip if no unique features available
    }
    
    // Use multiple random values to select feature (reduces adjacent similarity)
    const featureIndex = Math.floor(Math.abs(rand2) * enhancedPool.length);
    const selectedFeature = enhancedPool[featureIndex];
    
    // Add variation to the selected feature using additional randomness
    const variation = Math.floor(Math.abs(rand3) * 5); // 0-4 variations
    let modifiedFeature = { ...selectedFeature };
    
    // Apply subtle variations to reduce repetition
    if (variation === 1 && selectedFeature.description) {
      modifiedFeature.description = selectedFeature.description.replace(/\b(the|a|an)\b/g, match => {
        return Math.abs(rand4) > 0.5 ? match : (match === 'the' ? 'this' : match === 'a' ? 'one' : 'some');
      });
    } else if (variation === 2 && selectedFeature.effect) {
      const intensifiers = ['slightly', 'moderately', 'significantly', 'severely', 'barely'];
      const intensifier = intensifiers[Math.floor(Math.abs(rand4) * intensifiers.length)];
      modifiedFeature.effect = `${intensifier} ${selectedFeature.effect}`;
    }
    
    // Generate position for this feature
    const position = getFeaturePosition(modifiedFeature, positionSeed);
    
    features.push({
      ...modifiedFeature,
      id: `hallway_feature_${x}_${y}_${floorNum}_${i}_${variation}`,
      position: { x, y, floor: floorNum },
      discovered: false,
      variation: variation,
      category: selectedCategoryName,
      locationInRoom: position
    });
  }
  
  return features;
};

// Add to NewInteriorGrid.jsx - integrate this into the existing cell rendering
export const enhanceHallwayCell = (cell, x, y, currentFloor, currentInteriorType) => {
  // Only enhance hallways and corridors
  if (!cell || cell.type !== 'room' || 
      (cell.room !== ROOM_TYPES.HALLWAY && cell.room !== ROOM_TYPES.CORRIDOR)) {
    return cell;
  }
  
  // Generate or retrieve hallway features (multiple features support)
  if (!cell.hallwayFeatures) {
    cell.hallwayFeatures = generateHallwayFeatures(x, y, currentFloor, currentInteriorType);
    // Maintain backward compatibility with single feature
    cell.hallwayFeature = cell.hallwayFeatures.length > 0 ? cell.hallwayFeatures[0] : null;
  }
  
  return cell;
};

// Update tooltip to include all hallway features
export const getEnhancedHallwayTooltip = (cell, originalTooltip) => {
  const features = cell.hallwayFeatures || (cell.hallwayFeature ? [cell.hallwayFeature] : []);
  if (features.length === 0) return originalTooltip;
  
  let enhancedTooltip = originalTooltip;
  
  features.forEach((feature, index) => {
    enhancedTooltip += ` | ${feature.icon} ${feature.name}`;
    if (feature.locationInRoom) {
      enhancedTooltip += ` (${feature.locationInRoom})`;
    }
    if (feature.media) {
      enhancedTooltip += ` | 📁 ${feature.media}`;
    }
  });
  
  return enhancedTooltip;
};

// Add visual indicator for hallway features (supports multiple features)
export const getHallwayFeatureIndicator = (feature) => {
  if (!feature) return null;
  
  const categoryColors = {
    VISUAL: 'bg-blue-500',
    OBSTACLES: 'bg-orange-600', 
    LORE: 'bg-purple-600',
    ATMOSPHERIC: 'bg-green-500',
    BENEFICIAL: 'bg-emerald-500'
  };
  
  return {
    color: categoryColors[feature.category] || 'bg-blue-500',
    icon: feature.icon,
    category: feature.category
  };
};

// Integration example for the main renderGridCell function:
export const integrateHallwayFeatures = {
  // Add this to the existing renderGridCell function in NewInteriorGrid.jsx
  
  enhanceCell: (cell, x, y, currentFloor, currentInteriorType) => {
    return enhanceHallwayCell(cell, x, y, currentFloor, currentInteriorType);
  },
  
  addTooltip: (cell, originalTooltip) => {
    return getEnhancedHallwayTooltip(cell, originalTooltip);
  },
  
  addVisualIndicator: (cell) => {
    const features = cell.hallwayFeatures || (cell.hallwayFeature ? [cell.hallwayFeature] : []);
    if (features.length === 0) return null;
    
    // Show indicator for first feature, with count if multiple
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
  
  // Add to selected cell info panel (supports multiple features)
  renderFeaturePanel: (cell) => {
    const features = cell.hallwayFeatures || (cell.hallwayFeature ? [cell.hallwayFeature] : []);
    if (features.length === 0) return null;
    
    return (
      <div className="space-y-2 mb-2">
        {features.map((feature, index) => {
          const indicator = getHallwayFeatureIndicator(feature);
          
          return (
            <div key={feature.id || index} className={`${indicator.color}/80 p-2 rounded text-white`}>
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-sm">{feature.icon} {feature.name}</span>
                {feature.media && (
                  <span className="text-xs bg-black/30 px-1 rounded">{feature.media}</span>
                )}
              </div>
              <div className="text-xs text-gray-100 mb-1">
                {feature.description}
              </div>
              {feature.locationInRoom && (
                <div className="text-xs text-gray-200 italic mb-1">
                  Location: {feature.locationInRoom}
                </div>
              )}
              {feature.effect && (
                <div className="text-xs text-gray-200 italic">
                  Effect: {feature.effect}
                </div>
              )}
              {feature.content && (
                <div className="text-xs text-gray-200 mt-1">
                  Contains: {feature.content}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }
};