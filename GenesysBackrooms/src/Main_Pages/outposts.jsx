import React, { useState, useEffect } from 'react';
import { collection, doc, onSnapshot, query, setDoc } from "firebase/firestore";
import db from '../Components/firebase';
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

const outpostsData = [
  {
    "name": "Base Alpha",
    "alternativeNames": ["Compass Point", "The Compass"],
    "location": "The Hub",
    "group": "Major Explorer Group",
    "status": "Active",
    "classification": "Sub-level of The Hub",
    "founded": 1899,
    "population": {
      "personnel": 1000,
      "wanderers": 8000
    },
    "purpose": [
      "Main M.E.G. base of operations",
      "Trade port and warehouse",
      "Safe haven for wanderers",
      "Resource coordination center"
    ],
    "description": "Base Alpha is a massive complex of tunnels and bunker-like rooms carved into the walls of The Hub. The architecture varies wildly due to over a century of construction - you might walk from decrepit concrete passages with flimsy wooden support beams straight into modern, polished granite hallways. The base has anomalous non-euclidean geometry: paths that should intersect lead to different places, and routes that should take 15 minutes only take 5. Despite this, the geometry is consistent enough to navigate once you learn it. There are minimal signs, making it easy to get lost in the winding maze-like halls.",
    "layout": {
      "map": [
        {
          "id": "the_hub_exterior",
          "name": "The Hub (Exterior)",
          "description": "The vast Hub space outside Base Alpha",
          "position": { "x": 5, "y": 0 },
          "features": {
            "center": "Endless Hub expanse",
            "atmosphere": "Mysterious, liminal"
          },
          "connections": {
            "south": "Entrance Checkpoint"
          },
          "notes": "External area - not part of base proper"
        },
        {
          "id": "entrance_checkpoint",
          "name": "Entrance Checkpoint",
          "description": "Long hallway carved into Hub's walls serving as sole entrance to Base Alpha",
          "position": { "x": 5, "y": 1 },
          "features": {
            "center": "Armed M.E.G. security personnel in yellow and black uniforms manning checkpoint desk",
            "walls": "Concrete walls with M.E.G. warning signs about restricted access",
            "atmosphere": "Professional, military checkpoint feel"
          },
          "connections": {
            "north": "The Hub (exit)",
            "south": "Intermediary Hallway A"
          },
          "notes": "Security denies entry to known members of Republic of Aurielle and Z.E.T.A."
        },
        {
          "id": "intermediary_hallway_a",
          "name": "Intermediary Hallway A",
          "description": "Transition hallway with shifting architecture, first major hallway after checkpoint",
          "position": { "x": 5, "y": 2 },
          "features": {
            "left wall": "Narrow passage with exposed concrete and wooden support beams",
            "right wall": "Wide section with polished granite floors and brick walls, faded M.E.G. recruitment posters",
            "ceiling": "Varies from 7 feet to 12 feet high as architecture shifts",
            "floor": "Transitions from rough concrete to smooth granite"
          },
          "connections": {
            "north": "Entrance Checkpoint",
            "south": "Main Hub Junction"
          },
          "notes": "Architecture shifts noticeably as you walk - example of base's non-euclidean properties"
        },
        {
          "id": "main_hub_junction",
          "name": "Main Hub Junction",
          "description": "Central junction where main pathways converge, largest open space in public areas",
          "position": { "x": 5, "y": 3 },
          "features": {
            "south": "Painted wooden sign reading 'Market & Food Courts' with arrow",
            "west": "Metal placard stating 'Recreation - Lounge Areas'",
            "east": "Handwritten sign 'Public Lodgings - 1 Gallon Almond Water'",
            "northwest (hidden)": "Unmarked corridor (leads to Command Center - most wanderers don't notice)",
            "center": "Open circular area about 30 feet in diameter, benches along walls",
            "ceiling": "15 feet high, exposed metal beam framework",
            "floor": "Worn concrete with painted directional arrows (faded)"
          },
          "connections": {
            "north": "Intermediary Hallway A",
            "south": "Market Entrance Corridor",
            "west": "Recreation Corridor",
            "east": "Public Lodging Corridor",
            "northwest (hidden)": "Command Center Access Corridor"
          },
          "notes": "This is the navigation hub - most wanderers orient themselves from here"
        },
        {
          "id": "command_center_access",
          "name": "Command Center Access Corridor",
          "description": "Hidden restricted corridor leading to base command operations",
          "position": { "x": 3, "y": 2 },
          "features": {
            "entrance": "Unmarked door, easy to miss",
            "security": "Single M.E.G. guard in tactical gear, keycard and biometric scan required",
            "walls": "Bare concrete, no decoration",
            "lighting": "Dimmer than public areas",
            "atmosphere": "Serious, military feel"
          },
          "connections": {
            "southeast (hidden)": "Main Hub Junction"
          },
          "notes": "Most wanderers never notice this entrance. Only high-clearance M.E.G. personnel allowed beyond"
        },
        {
          "id": "recreation_corridor",
          "name": "Recreation Corridor",
          "description": "Casual hallway with decorated walls leading to lounge areas",
          "position": { "x": 3, "y": 3 },
          "features": {
            "walls": "Painted murals by wanderers, motivational posters, photos of the Frontrooms",
            "left": "Bulletin board with community announcements and social event notices",
            "atmosphere": "Relaxed, less crowded than market"
          },
          "connections": {
            "east": "Main Hub Junction",
            "south": "Recreation Room 1 (TV Lounge)"
          },
          "notes": "Takes approximately 1 minute to walk"
        },
        {
          "id": "recreation_room_1",
          "name": "Recreation Room 1 - TV Lounge",
          "description": "First of three connected recreation rooms, focused on video entertainment",
          "position": { "x": 3, "y": 4 },
          "features": {
            "walls": "Four CRT televisions mounted at different heights",
            "shelves": "Shelves packed with CD cases - movies, shows, documentaries",
            "center": "Mismatched couches and armchairs facing TVs, coffee table with old magazines",
            "ceiling": "10 feet, acoustic tile panels (some water-stained)",
            "floor": "Worn carpet, stains and patches",
            "atmosphere": "Casual, usually 5-10 wanderers relaxing"
          },
          "connections": {
            "north": "Recreation Corridor",
            "south": "Recreation Room 2 (Arcade)"
          },
          "notes": "TVs often showing different programs simultaneously - can be noisy"
        },
        {
          "id": "recreation_room_2",
          "name": "Recreation Room 2 - Arcade",
          "description": "Middle recreation room filled with arcade machines from Level 399",
          "position": { "x": 3, "y": 5 },
          "features": {
            "walls": "Lined with arcade cabinets - Pac-Man, Street Fighter II, Galaga, Donkey Kong, others",
            "center": "Small seating area with stools",
            "atmosphere": "Electronic beeps and music from games, competitive energy"
          },
          "connections": {
            "north": "Recreation Room 1 - TV Lounge",
            "south": "Recreation Room 3 - Library"
          },
          "notes": "Most popular with younger wanderers, games cost tokens (available at market)"
        },
        {
          "id": "recreation_room_3",
          "name": "Recreation Room 3 - Library",
          "description": "Quiet final recreation room serving as reading and study area",
          "position": { "x": 3, "y": 6 },
          "features": {
            "walls": "Floor-to-ceiling bookshelves with books from Frontrooms and Backrooms",
            "center": "Reading tables with chairs, comfortable armchairs in corners",
            "corner": "Small desk where volunteer librarian sometimes sits",
            "atmosphere": "Quiet, peaceful, usually 3-8 people reading or writing",
            "lighting": "Softer than other rooms, desk lamps on tables"
          },
          "connections": {
            "north": "Recreation Room 2 (Arcade)"
          },
          "notes": "Quietest public area in base, unofficial 'no talking loudly' rule enforced by patrons"
        },
        {
          "id": "market_entrance_corridor",
          "name": "Market Entrance Corridor",
          "description": "Wide hallway leading to market, begins to show bustle and activity",
          "position": { "x": 5, "y": 4 },
          "features": {
            "walls": "Bulletin boards with trade advertisements, wanted posters, M.E.G. announcements",
            "center": "Increasing foot traffic as you approach market",
            "atmosphere": "Sounds of market growing louder - voices, commerce"
          },
          "connections": {
            "north": "Main Hub Junction",
            "south": "Market & Food Courts"
          },
          "notes": "Takes approximately 2 minutes to walk (but geometry can make return trip 5 minutes)"
        },
        {
          "id": "market_and_food_courts",
          "name": "Market & Food Courts",
          "description": "Massive carved cavern serving as main commercial area, busiest location in Base Alpha",
          "position": { "x": 5, "y": 5 },
          "features": {
            "left side": "Row of established storefronts - 'Wanderer's Cafe', 'Provisions & Supplies', 'Backrooms Post Office'",
            "right side": "Temporary stalls and stands - weapon trader, medical supply vendor, food carts",
            "center": "Open walking area packed with wanderers, small fountain (non-functional)",
            "far south": "Large M.E.G. supply depot with 'Official M.E.G. Trade Station'",
            "ceiling": "20 feet high with metal support beams, hanging lanterns and electric lights",
            "atmosphere": "Loud conversation, smell of cooking food and coffee, crowded"
          },
          "connections": {
            "north": "Market Entrance Corridor",
            "east": "Armory Access Corridor (restricted)",
            "southeast": "Medical Bay Corridor"
          },
          "notes": "Most visited area of base, approximately 80 feet wide by 120 feet long"
        },
        {
          "id": "medical_bay_corridor",
          "name": "Medical Bay Corridor",
          "description": "Clean, well-lit hallway leading to medical facilities",
          "position": { "x": 6, "y": 6 },
          "features": {
            "walls": "White painted concrete, medical safety posters",
            "left": "Waiting area with plastic chairs, small reception desk",
            "atmosphere": "Smell of disinfectant, quieter than market"
          },
          "connections": {
            "northwest": "Market & Food Courts"
          },
          "notes": "Public can access for treatment but cannot wander freely"
        },
        {
          "id": "armory_access_corridor",
          "name": "Armory Access Corridor",
          "description": "Restricted military corridor leading to weapons storage",
          "position": { "x": 6, "y": 5 },
          "features": {
            "entrance": "Heavy reinforced steel door with 'AUTHORIZED PERSONNEL ONLY' stenciled in yellow",
            "security": "Two armed M.E.G. guards in full tactical gear stationed outside",
            "door mechanism": "Keycard reader and biometric scanner",
            "walls": "Bare metal plating, recently installed"
          },
          "connections": {
            "west": "Market & Food Courts"
          },
          "notes": "Established after The Flicker for enhanced security. Guards will question civilians who linger nearby."
        },
        {
          "id": "public_lodging_corridor",
          "name": "Public Lodging Corridor",
          "description": "Long, narrow hallway with rows of small rental rooms",
          "position": { "x": 7, "y": 3 },
          "features": {
            "entrance": "Wide cutout in wall with sign 'Public Lodgings - 1 Gallon Almond Water'",
            "immediate left": "Small desk with M.E.G. clerk (Clerk Marcus) managing assignments",
            "left wall": "Doors numbered 1-25 (odd numbers)",
            "right wall": "Doors numbered 2-26 (even numbers)",
            "atmosphere": "Utilitarian, cramped, sounds of people living through thin walls"
          },
          "connections": {
            "west": "Main Hub Junction",
            "south": "Intermediary Hallway B"
          },
          "notes": "Rooms are small - one bedroom, one bathroom, no furniture. 52 rooms total"
        },
        {
          "id": "intermediary_hallway_b",
          "name": "Intermediary Hallway B",
          "description": "Secondary transition hallway connecting public and private areas",
          "position": { "x": 7, "y": 4 },
          "features": {
            "walls": "Mix of concrete and brick, less decorated than Hallway A",
            "atmosphere": "Quieter than main junction area"
          },
          "connections": {
            "north": "Public Lodging Corridor",
            "east": "Private Quarters Security Checkpoint",
            "south": "Warehouse Access"
          },
          "notes": "Non-M.E.G. wanderers typically turn back here"
        },
        {
          "id": "warehouse_access",
          "name": "Warehouse Section Access",
          "description": "Large cargo area for resource storage at edge of base",
          "position": { "x": 7, "y": 5 },
          "features": {
            "doors": "Double-wide metal cargo doors with mechanical lock and chain",
            "personnel entrance": "Smaller door with keycard reader",
            "walls": "Industrial, metal plating reinforcement",
            "atmosphere": "Utilitarian, sounds of machinery beyond doors"
          },
          "connections": {
            "north": "Intermediary Hallway B"
          },
          "notes": "Visible to public but clearly marked as restricted, houses supplies and resources"
        },
        {
          "id": "private_quarters_checkpoint",
          "name": "Private Quarters Security Checkpoint",
          "description": "Small security station preventing unauthorized access to M.E.G. living areas",
          "position": { "x": 8, "y": 4 },
          "features": {
            "entrance": "Reinforced door with keycard reader",
            "desk": "Small security desk with one guard on duty",
            "walls": "Notice board with M.E.G. internal announcements",
            "atmosphere": "Professional but not hostile to authorized personnel"
          },
          "connections": {
            "west": "Intermediary Hallway B",
            "east": "Private Quarters Main Hallway (M.E.G. only)"
          },
          "notes": "Guard checks M.E.G. ID before allowing access"
        },
        {
          "id": "private_quarters_hallway",
          "name": "Private Quarters Main Hallway",
          "description": "Well-maintained hallway serving M.E.G. residential wing",
          "position": { "x": 9, "y": 4 },
          "features": {
            "left wall": "Doors numbered P-1 through P-15",
            "right wall": "Doors numbered P-16 through P-30",
            "doors": "Larger than public quarters, spaced 15 feet apart, wooden with M.E.G. emblems",
            "walls": "Painted drywall (beige), framed motivational posters",
            "atmosphere": "Much quieter and cleaner than public quarters"
          },
          "connections": {
            "west": "Private Quarters Security Checkpoint",
            "south": "Private Quarters Common Room"
          },
          "notes": "30 private apartments total. Each has kitchen, bedroom, living room, bathroom, BACK-NET terminal"
        },
        {
          "id": "private_quarters_common",
          "name": "Private Quarters Common Room",
          "description": "Shared social space for M.E.G. personnel living in private quarters",
          "position": { "x": 9, "y": 5 },
          "features": {
            "center": "Large table with chairs for group meals or meetings",
            "kitchenette": "Coffee maker, microwave, mini fridge",
            "seating area": "Comfortable couch and TV",
            "walls": "Photos of M.E.G. teams and operations, achievement certificates",
            "atmosphere": "Homey, occasionally used for informal team meetings"
          },
          "connections": {
            "north": "Private Quarters Main Hallway"
          },
          "notes": "M.E.G. personnel only, serves as social hub for off-duty members"
        }
      ],
      "navigationNotes": "Base geometry is non-euclidean. A path that took 5 minutes to walk might take 15 minutes to return through. Hallways that should connect sometimes lead to different areas. However, anomalies are consistent - same path always leads to same destination, making mental mapping possible despite illogical layout."
    },
    "size": "Large - Extensive tunnel network approximately 0.5 square kilometers of accessible space",
    "defenses": "High - Entrance checkpoint with armed guards, keycard-restricted areas, biometric scanners for sensitive locations, armed patrols in restricted sections",
    "resources": [
      "Almond Water",
      "Food supplies (canned, dried, fresh from trade)",
      "Medical supplies",
      "Weapons and ammunition (restricted)",
      "General trade goods",
      "Level Keys",
      "Tools and equipment"
    ],
    "accessLevel": "Public areas open to all wanderers (except enemy groups: Republic of Aurielle and Z.E.T.A). Private areas require M.E.G. membership. Restricted areas require specific clearance levels.",
    "keyNPCs": [
      {
        "name": "Commander Sarah Vance",
        "role": "Base Commander",
        "description": "Stern woman in her 50s, veteran of Bloodbath of Cluster I. Strategic and fair leader. Short gray hair, always in M.E.G. uniform.",
        "location": "Command Center (restricted area)"
      },
      {
        "name": "Clerk Marcus Webb",
        "role": "Public Lodging Manager",
        "description": "Middle-aged man with tired eyes and receding hairline. Patient and organized, been at this desk for 8 years. Knows most regular residents by name.",
        "location": "Public Lodging Corridor - entrance desk"
      },
      {
        "name": "Dr. Amara Okonkwo",
        "role": "Chief Medical Officer",
        "description": "Confident Nigerian doctor in her 40s, specializes in entity-related injuries and Roth Syndrome treatment. Strict about medical protocols.",
        "location": "Medical Bay"
      },
      {
        "name": "Sergeant James 'Hammer' Rodriguez",
        "role": "Head of Base Security",
        "description": "Muscular Hispanic man in his 30s, intimidating presence but fair. Oversees all security personnel and checkpoint operations.",
        "location": "Rotates between Entrance Checkpoint and Command Center"
      },
      {
        "name": "Quinn 'Books' Patterson",
        "role": "Volunteer Librarian",
        "description": "Quiet non-binary person in their 20s, wanderer who stays at base permanently. Organizes library, helps people find books. Always reading something.",
        "location": "Recreation Room 3 (Library) - usually at corner desk"
      },
      {
        "name": "Merchant Vasily Kuznetsov",
        "role": "Owner of 'Provisions & Supplies'",
        "description": "Friendly Russian man in his 60s with thick accent and bushy beard. Been running his grocery store in the market for 15 years. Fair prices, good reputation.",
        "location": "Market & Food Courts - left side storefront"
      }
    ],
    "services": [
      "Public lodging (1 gallon Almond Water per room, indefinite stay)",
      "Private M.E.G. lodging (free for members)",
      "Trading and commerce (various merchants and stalls)",
      "Food and supplies (grocery, cafes, restaurants)",
      "Medical treatment (Dr. Okonkwo and staff)",
      "Recreation and socialization (lounges, arcade, library)",
      "Resource storage and distribution (M.E.G. operations)",
      "Post office services (send/receive messages to other bases)",
      "M.E.G. recruitment and coordination",
      "Information and guidance for new wanderers"
    ],
    "anomalousProperties": [
      "Non-euclidean geometry - paths don't connect logically",
      "Distance distortion - routes take different times than expected in different directions",
      "Consistent navigation possible despite spatial anomalies - same routes always lead to same destinations",
      "Classified as sub-level of The Hub due to anomalous nature (as of January 2021)",
      "Multiple level exits discovered within base (vending machines to Level 610, ceiling tiles to The Unit)"
    ],
    "entrances": [
      "Through Entrance Checkpoint in The Hub (main entrance)",
      "Breaking into base from The Hub via other means (illegal, triggers security response)",
      "Green Line in Level 154's Neon Express (every 30 min, 25% chance) - arrives at specialized platform connected to Warehouse Section"
    ],
    "exits": [
      "Leaving through Entrance Checkpoint returns to The Hub",
      "Neon Express when it arrives at warehouse platform leads to Level 154",
      "No-clipping into vending machines (located in Market area and Recreation rooms) leads to Level 610",
      "Knocking down loose ceiling tiles (found randomly throughout base, Investigation DC 15) may reveal entrance to The Unit"
    ],
    "threatLevel": {
      "class": 1,
      "exitDifficulty": "1/5 - Easy to Exit",
      "environmentalRisk": "1/5 - Low Environmental Risk",
      "entityDanger": "0/5 - No Hostile Entities"
    },
    "history": [
      {
        "period": "1899 - 1910",
        "title": "Beginnings",
        "events": [
          {
            "year": 1899,
            "event": "Discovery of The Hub and establishment of The Compass",
            "details": "M.E.G. exploration mission discovered The Hub. Established outpost nicknamed 'The Compass' dedicated to researching the level and its exits. Spearheaded age of exploration, resulting in discovery of hundreds of levels and rapid M.E.G. expansion."
          },
          {
            "year": "Early 1900s",
            "event": "Battle of the Crossroads",
            "details": "Limited space in Hub forced M.E.G. to tunnel into walls for expansion. Angered The Keymaster entity who attacked to stop 'defiling my home'. Various tactical engagements occurred. Over 100 people died. Conflict ended when M.E.G. ambush using Firesalt explosives severely wounded The Keymaster, forcing him to cease attacks. Base successfully expanded into walls."
          }
        ]
      },
      {
        "period": "1910 - 2016",
        "title": "Expansion and Stagnation",
        "events": [
          {
            "year": "1910s onwards",
            "event": "Relegated to supportive role",
            "details": "New London steadily replaced The Compass (now named 'Base Alpha') as M.E.G.'s most important base. Base Alpha relegated to supportive role but continued to expand into Hub walls, gaining more active duty members. Served primarily as supply depot and secondary recruitment center."
          },
          {
            "year": 2016,
            "event": "The Flicker begins",
            "details": "During early days of The Flicker, many people from New London fled to Base Alpha seeking shelter and food. Tensions rose as resources ran low, culminating in widespread riots throughout the Hub as people desperately searched for whatever supplies remained."
          },
          {
            "year": "Post-Flicker 2016",
            "event": "Massive reconstruction effort",
            "details": "Upon end of Flicker, Base Alpha ran massive resource supply effort with Base Omega in Level 154 to calm tensions and supply remaining wanderers with food. Performed massive reconstruction to restore M.E.G.'s infrastructure and supply chain. Commander Sarah Vance appointed as Base Commander to oversee recovery."
          }
        ]
      },
      {
        "period": "2016 - Present",
        "title": "Renovations and New Era",
        "events": [
          {
            "year": "2016-2018",
            "event": "Became main M.E.G. base",
            "details": "Due to fall of New London during Flicker, Base Alpha became M.E.G.'s new main base. Various rooms modified to facilitate civilian habitation. Constructed new public living quarters (52 rooms), expanded market with permanent storefronts, added medical bay, improved recreation areas."
          },
          {
            "year": "2019",
            "event": "Security enhancements",
            "details": "Following tensions with Republic of Aurielle after Korthie Casiagen War, base security significantly enhanced. Armory Access Corridor established, Command Center access restricted with biometric scanners, additional security personnel assigned."
          },
          {
            "year": "January 2nd, 2021",
            "event": "Discovery of anomalous properties",
            "details": "Numerous exits to other levels discovered within Base Alpha. Instances of non-euclidean geometry reported by M.E.G. employees and wanderers. Initially thought to be hoaxes but deep investigation confirmed anomalies. After long discussion by Impresarios and Archivist teams, premises officially classified as sub-level of The Hub."
          },
          {
            "year": "Current",
            "event": "Ongoing operations",
            "details": "Base Alpha continues to serve as M.E.G.'s main base of operations, housing 1,000 personnel and 8,000 wanderers. Functions as primary trade port, safe haven, and coordination center. Population has stabilized, with mix of permanent residents and transient wanderers. Market thrives with 30+ active businesses."
          }
        ]
      }
    ],
    "notes": "Home sweet home for many wanderers. Despite maze-like layout and lack of clear signage, serves as major safe haven and most important M.E.G. facility post-Flicker. Rumors persist of hidden level door in Command Center area leading to paradise-like level where Impresarios reside - unconfirmed but neither confirmed nor denied by M.E.G. leadership. The non-euclidean geometry is noticeable but predictable enough that regular residents navigate without issue."
  }
];

export default function Outposts() {
  const [outposts, setOutposts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const [searchTerm, setSearchTerm] = useState('');
  const [groupFilter, setGroupFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [activeOutpost, setActiveOutpost] = useState(null);
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

    const q = query(collection(db, 'Outposts'));

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
      
      setOutposts(queryData);
      setLoading(false);
    }, (error) => {
      console.error('Error loading outposts:', error);
      showToast('Error loading outposts', 'error');
      setLoading(false);
    });

    return () => { unsub(); };
  };

  const uploadOutpostData = async () => {
    if (!userIsDM) {
      showToast('Only DMs can upload outpost data', 'error');
      return;
    }

    const outpostNames = outpostsData.map(o => o.name).join(', ');
    const confirmUpload = window.confirm(
      `This will add ${outpostsData.length} outpost(s) to the database: ${outpostNames}. Continue?`
    );

    if (!confirmUpload) return;

    try {
      let successCount = 0;
      let errorCount = 0;

      for (const outpost of outpostsData) {
        try {
          await setDoc(doc(db, 'Outposts', outpost.name), {
            ...outpost,
            sessionVisibility: {}
          });
          successCount++;
        } catch (error) {
          console.error(`Error uploading ${outpost.name}:`, error);
          errorCount++;
        }
      }

      if (errorCount === 0) {
        showToast(`Successfully added ${successCount} outpost${successCount !== 1 ? 's' : ''}!`, 'success');
      } else {
        showToast(`Added ${successCount} outposts, ${errorCount} failed`, 'warning');
      }
    } catch (error) {
      showToast('Error uploading outpost data', 'error');
      console.error('Upload error:', error);
    }
  };

  const toggleOutpostVisibility = async (outpost) => {
    if (!userIsDM || !sessionId) return;
    
    try {
      const currentVisibility = outpost.sessionVisibility || {};
      const newVisibility = {
        ...currentVisibility,
        [sessionId]: currentVisibility[sessionId] === false ? true : false
      };

      await updateDoc(doc(db, 'Outposts', outpost.docId), {
        sessionVisibility: newVisibility
      });
      
      const action = newVisibility[sessionId] === false ? 'hidden' : 'revealed';
      showToast(`${outpost.name} ${action} for this session`, 'success');
    } catch (error) {
      console.error('Error toggling visibility:', error);
      showToast('Error updating outpost visibility', 'error');
    }
  };

  const getFilteredOutposts = () => {
    return outposts.filter((outpost) => {
      const visibilityCheck = userIsDM ? true : !outpost.hiddenInCurrentSession;
      
      return (
        visibilityCheck &&
        (!searchTerm || 
         outpost.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
         outpost.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         outpost.description?.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (!groupFilter || outpost.group === groupFilter) &&
        (!statusFilter || outpost.status === statusFilter)
      );
    });
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setGroupFilter('');
    setStatusFilter('');
    showToast('All filters cleared');
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (searchTerm !== '') count++;
    if (groupFilter !== '') count++;
    if (statusFilter !== '') count++;
    return count;
  };

  const getUniqueGroups = () => {
    return [...new Set(outposts.map(o => o.group).filter(Boolean))].sort();
  };

  const getUniqueStatuses = () => {
    return [...new Set(outposts.map(o => o.status).filter(Boolean))].sort();
  };

  if (localStorage.getItem("loggedIn") === 'false') {
    return <NotLoggedIn />;
  }

  const FilterChip = ({ label, onDelete }) => (
    <div className="inline-flex items-center space-x-2 bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm border border-blue-500/30">
      <span>{label}</span>
      <button onClick={onDelete} className="text-blue-400 hover:text-blue-200 transition-colors">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
        </svg>
      </button>
    </div>
  );

  const DisplayOutposts = () => {
    const filteredOutposts = getFilteredOutposts();

    if (filteredOutposts.length === 0) {
      return (
        <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-12 text-center">
          <svg className="w-16 h-16 text-gray-500 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
          </svg>
          <h3 className="text-xl font-semibold text-white mb-2">No outposts found</h3>
          <p className="text-gray-400 mb-4">Try adjusting your search criteria</p>
          {getActiveFilterCount() > 0 && (
            <button
              onClick={clearAllFilters}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
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
            <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
            </svg>
            <h2 className="text-xl font-bold text-white">
              Found {filteredOutposts.length} outpost{filteredOutposts.length !== 1 ? 's' : ''}
            </h2>
          </div>
          <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm font-bold">
            {outposts.length} total
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredOutposts.map((outpost) => (
            <OutpostCard 
              key={outpost.docId} 
              outpost={outpost}
              onShowDetails={setActiveOutpost}
              onToggleVisibility={toggleOutpostVisibility}
              userIsDM={userIsDM}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900">
      <div className="w-full px-4 py-6 space-y-6">
        
        <div className="bg-gradient-to-r from-blue-900/50 to-indigo-900/50 backdrop-blur-lg rounded-2xl border border-white/10 p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Outpost Directory</h1>
                <p className="text-blue-300">Explore settlements and safe havens throughout the Backrooms</p>
              </div>
            </div>
            
            {userIsDM && (
              <button 
                onClick={uploadOutpostData}
                className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"></path>
                </svg>
                <span>Upload Outposts ({outpostsData.length})</span>
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-12">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-400 mb-4"></div>
              <h3 className="text-xl font-semibold text-white mb-2">Loading outposts...</h3>
              <p className="text-gray-400">Please wait</p>
            </div>
          </div>
        ) : outposts.length > 0 ? (
          <>
            <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600/20 to-indigo-600/20 p-4 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path>
                    </svg>
                    <h2 className="text-xl font-bold text-white">Search & Filter</h2>
                    {getActiveFilterCount() > 0 && (
                      <span className="bg-blue-500/30 text-blue-300 px-2 py-1 rounded-full text-xs font-bold">
                        {getActiveFilterCount()} active
                      </span>
                    )}
                  </div>
                  <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm font-bold">
                    {getFilteredOutposts().length} shown
                  </span>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search by name, location, or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white/5 border border-white/20 rounded-xl pl-12 pr-12 py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-lg"
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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Group</label>
                    <select
                      value={groupFilter}
                      onChange={(e) => setGroupFilter(e.target.value)}
                      className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    >
                      <option value="" className="bg-gray-800">All Groups</option>
                      {getUniqueGroups().map(group => (
                        <option key={group} value={group} className="bg-gray-800">{group}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Status</label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    >
                      <option value="" className="bg-gray-800">Any Status</option>
                      {getUniqueStatuses().map(status => (
                        <option key={status} value={status} className="bg-gray-800">{status}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Actions</label>
                    <button
                      onClick={clearAllFilters}
                      disabled={getActiveFilterCount() === 0}
                      className="w-full bg-gradient-to-r from-red-600/20 to-pink-600/20 hover:from-red-600/30 hover:to-pink-600/30 disabled:from-gray-600/20 disabled:to-gray-700/20 text-red-300 disabled:text-gray-500 font-medium px-4 py-3 rounded-lg border border-red-500/30 disabled:border-gray-500/30 transition-all duration-300"
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>

                {getActiveFilterCount() > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {searchTerm && <FilterChip label={`Search: "${searchTerm}"`} onDelete={() => setSearchTerm('')} />}
                    {groupFilter && <FilterChip label={`Group: ${groupFilter}`} onDelete={() => setGroupFilter('')} />}
                    {statusFilter && <FilterChip label={`Status: ${statusFilter}`} onDelete={() => setStatusFilter('')} />}
                  </div>
                )}
              </div>
            </div>

            <DisplayOutposts />
          </>
        ) : (
          <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-12">
            <div className="flex flex-col items-center justify-center text-center">
              <svg className="w-16 h-16 text-gray-500 mb-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
              </svg>
              <h3 className="text-xl font-semibold text-white mb-2">No outposts available</h3>
              <p className="text-gray-400">Upload some outposts to get started</p>
            </div>
          </div>
        )}
      </div>

      <Toast 
        message={toast.message}
        severity={toast.severity} 
        isOpen={toast.open} 
        onClose={hideToast} 
      />

      {activeOutpost && (
        <OutpostDetailsModal 
          outpost={activeOutpost} 
          onClose={() => setActiveOutpost(null)} 
          userIsDM={userIsDM}
          sessionId={sessionId}
        />
      )}
    </div>
  );
};

// Outpost Card Component
const OutpostCard = ({ outpost, onShowDetails, onToggleVisibility, userIsDM }) => {
  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'active': return 'bg-green-500/20 text-green-300 border-green-500/50';
      case 'abandoned': return 'bg-gray-500/20 text-gray-300 border-gray-500/50';
      case 'under construction': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50';
      case 'contested': return 'bg-red-500/20 text-red-300 border-red-500/50';
      default: return 'bg-blue-500/20 text-blue-300 border-blue-500/50';
    }
  };

  return (
    <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-white/10 p-4 hover:bg-black/40 transition-all duration-300 relative group">
      {userIsDM && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleVisibility(outpost);
          }}
          className={`absolute top-2 right-2 p-2 rounded-lg transition-all ${
            outpost.hiddenInCurrentSession 
              ? 'bg-red-500/20 text-red-300 border border-red-500/50' 
              : 'bg-white/10 text-gray-400 border border-white/20'
          } hover:scale-110`}
          title={outpost.hiddenInCurrentSession ? 'Hidden from players' : 'Visible to players'}
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            {outpost.hiddenInCurrentSession ? (
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
            ) : (
              <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
            )}
          </svg>
        </button>
      )}

      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-white mb-1 truncate">{outpost.name}</h3>
          <p className="text-sm text-gray-400 truncate">📍 {outpost.location}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        <span className={`px-2 py-1 rounded-full text-xs font-bold border ${getStatusColor(outpost.status)}`}>
          {outpost.status || 'Unknown'}
        </span>
        {outpost.group && (
          <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full text-xs font-bold border border-blue-500/50">
            👥 {outpost.group}
          </span>
        )}
        {outpost.founded && (
          <span className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full text-xs font-bold border border-purple-500/50">
            📅 {outpost.founded}
          </span>
        )}
      </div>

      <p className="text-gray-300 text-sm mb-4 line-clamp-3">
        {outpost.description || 'No description available'}
      </p>

      {outpost.population && (
        <div className="grid grid-cols-2 gap-2 mb-3">
          {outpost.population.personnel !== undefined && (
            <div className="bg-black/30 rounded-lg p-2">
              <div className="text-xs text-gray-400">Personnel</div>
              <div className="text-sm font-bold text-white">{outpost.population.personnel.toLocaleString()}</div>
            </div>
          )}
          {outpost.population.wanderers !== undefined && (
            <div className="bg-black/30 rounded-lg p-2">
              <div className="text-xs text-gray-400">Wanderers</div>
              <div className="text-sm font-bold text-white">{outpost.population.wanderers.toLocaleString()}</div>
            </div>
          )}
        </div>
      )}

      <button
        onClick={() => onShowDetails(outpost)}
        className="w-full bg-gradient-to-r from-blue-600/20 to-indigo-600/20 hover:from-blue-600/30 hover:to-indigo-600/30 text-blue-300 font-medium px-4 py-2 rounded-lg border border-blue-500/30 transition-all"
      >
        View Details
      </button>
    </div>
  );
};

// Outpost Details Modal
const OutpostDetailsModal = ({ outpost, onClose, userIsDM, sessionId }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Basic Info */}
      <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
        <h3 className="text-xl font-bold text-blue-400 mb-4">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className="text-gray-400 text-sm">Name:</span>
            <p className="text-white font-medium">{outpost.name}</p>
          </div>
          {outpost.alternativeNames && outpost.alternativeNames.length > 0 && (
            <div>
              <span className="text-gray-400 text-sm">Also Known As:</span>
              <p className="text-white font-medium">{outpost.alternativeNames.join(', ')}</p>
            </div>
          )}
          <div>
            <span className="text-gray-400 text-sm">Location:</span>
            <p className="text-white font-medium">{outpost.location}</p>
          </div>
          <div>
            <span className="text-gray-400 text-sm">Group:</span>
            <p className="text-white font-medium">{outpost.group || 'Independent'}</p>
          </div>
          <div>
            <span className="text-gray-400 text-sm">Status:</span>
            <p className="text-white font-medium">{outpost.status}</p>
          </div>
          <div>
            <span className="text-gray-400 text-sm">Founded:</span>
            <p className="text-white font-medium">{outpost.founded}</p>
          </div>
          {outpost.classification && (
            <div>
              <span className="text-gray-400 text-sm">Classification:</span>
              <p className="text-white font-medium">{outpost.classification}</p>
            </div>
          )}
          {outpost.size && (
            <div>
              <span className="text-gray-400 text-sm">Size:</span>
              <p className="text-white font-medium">{outpost.size}</p>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
        <h3 className="text-xl font-bold text-blue-400 mb-4">Description</h3>
        <p className="text-gray-300 leading-relaxed">{outpost.description}</p>
      </div>

      {/* Population */}
      {outpost.population && (
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
          <h3 className="text-xl font-bold text-blue-400 mb-4">Population</h3>
          <div className="grid grid-cols-2 gap-4">
            {outpost.population.personnel !== undefined && (
              <div className="bg-slate-900/50 rounded-lg p-4">
                <span className="text-gray-400 text-sm">Personnel:</span>
                <p className="text-white font-bold text-2xl">{outpost.population.personnel.toLocaleString()}</p>
              </div>
            )}
            {outpost.population.wanderers !== undefined && (
              <div className="bg-slate-900/50 rounded-lg p-4">
                <span className="text-gray-400 text-sm">Wanderers:</span>
                <p className="text-white font-bold text-2xl">{outpost.population.wanderers.toLocaleString()}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Purpose */}
      {outpost.purpose && outpost.purpose.length > 0 && (
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
          <h3 className="text-xl font-bold text-blue-400 mb-4">Purpose</h3>
          <ul className="space-y-2">
            {outpost.purpose.map((p, idx) => (
              <li key={idx} className="flex items-start gap-2 bg-slate-900/50 rounded-lg p-3">
                <span className="text-blue-400 mt-1">▸</span>
                <span className="text-gray-300 flex-1">{p}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Threat Level */}
      {outpost.threatLevel && (
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
          <h3 className="text-xl font-bold text-blue-400 mb-4">Threat Assessment</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-900/50 rounded-lg p-4">
              <span className="text-gray-400 text-sm">Class:</span>
              <p className="text-white font-bold text-xl">{outpost.threatLevel.class}</p>
            </div>
            <div className="bg-slate-900/50 rounded-lg p-4">
              <span className="text-gray-400 text-sm">Exit Difficulty:</span>
              <p className="text-white font-medium">{outpost.threatLevel.exitDifficulty}</p>
            </div>
            <div className="bg-slate-900/50 rounded-lg p-4">
              <span className="text-gray-400 text-sm">Environmental Risk:</span>
              <p className="text-white font-medium">{outpost.threatLevel.environmentalRisk}</p>
            </div>
            <div className="bg-slate-900/50 rounded-lg p-4">
              <span className="text-gray-400 text-sm">Entity Danger:</span>
              <p className="text-white font-medium">{outpost.threatLevel.entityDanger}</p>
            </div>
          </div>
        </div>
      )}

      {/* Services */}
      {outpost.services && outpost.services.length > 0 && (
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
          <h3 className="text-xl font-bold text-blue-400 mb-4">Services Available</h3>
          <div className="flex flex-wrap gap-2">
            {outpost.services.map((service, idx) => (
              <span key={idx} className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm border border-blue-500/30">
                {service}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Resources */}
      {outpost.resources && outpost.resources.length > 0 && (
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
          <h3 className="text-xl font-bold text-blue-400 mb-4">Available Resources</h3>
          <div className="flex flex-wrap gap-2">
            {outpost.resources.map((resource, idx) => (
              <span key={idx} className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-sm border border-green-500/30">
                {resource}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderMap = () => {
    if (!outpost.layout?.map || outpost.layout.map.length === 0) {
      return (
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 text-center">
          <p className="text-gray-400">No map data available</p>
        </div>
      );
    }

    // Calculate grid bounds
    const minX = Math.min(...outpost.layout.map.map(a => a.position.x));
    const maxX = Math.max(...outpost.layout.map.map(a => a.position.x));
    const minY = Math.min(...outpost.layout.map.map(a => a.position.y));
    const maxY = Math.max(...outpost.layout.map.map(a => a.position.y));

    const gridWidth = maxX - minX + 1;
    const gridHeight = maxY - minY + 1;

    // Create empty grid
    const grid = Array(gridHeight).fill(null).map(() => Array(gridWidth).fill(null));

    // Place areas on grid
    outpost.layout.map.forEach(area => {
      const gridX = area.position.x - minX;
      const gridY = area.position.y - minY;
      grid[gridY][gridX] = area;
    });

    // Determine node color based on area type
    const getNodeColor = (area) => {
      if (area.id.includes('entrance') || area.id.includes('checkpoint') && !area.id.includes('private')) {
        return 'bg-green-500/30 border-green-500 text-green-300';
      } else if (area.id.includes('private') || area.id.includes('command')) {
        return 'bg-purple-500/30 border-purple-500 text-purple-300';
      } else if (area.id.includes('restricted') || area.id.includes('armory') || area.id.includes('warehouse')) {
        return 'bg-red-500/30 border-red-500 text-red-300';
      } else if (area.id.includes('hub') && area.id.includes('exterior')) {
        return 'bg-gray-500/30 border-gray-500 text-gray-300';
      }
      return 'bg-blue-500/30 border-blue-500 text-blue-300';
    };

    // Check if connection is hidden/secret
    const isHiddenConnection = (direction) => {
      return direction.includes('hidden') || direction.includes('secret');
    };

    const MapContent = () => {
      // Cell dimensions
      const cellWidth = 180;
      const cellHeight = 120;
      const gap = 20;

      // Total SVG dimensions
      const svgWidth = (gridWidth * cellWidth) + ((gridWidth - 1) * gap);
      const svgHeight = (gridHeight * cellHeight) + ((gridHeight - 1) * gap);

      return (
        <>
          {/* Navigation Warning */}
          {outpost.layout?.navigationNotes && (
            <div className="bg-red-900/20 border-2 border-red-500/50 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <span className="text-2xl">⚠️</span>
                <div>
                  <h4 className="text-red-400 font-bold mb-2">Navigation Warning</h4>
                  <p className="text-red-300 text-sm">{outpost.layout.navigationNotes}</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mb-6">
            {/* Map Legend */}
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 bg-slate-900/50 rounded-lg p-2 border border-slate-700">
                <div className="w-4 h-4 bg-green-500 rounded border-2 border-green-400"></div>
                <span className="text-sm text-gray-300">Entrance</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-900/50 rounded-lg p-2 border border-slate-700">
                <div className="w-4 h-4 bg-blue-500 rounded border-2 border-blue-400"></div>
                <span className="text-sm text-gray-300">Public</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-900/50 rounded-lg p-2 border border-slate-700">
                <div className="w-4 h-4 bg-purple-500 rounded border-2 border-purple-400"></div>
                <span className="text-sm text-gray-300">Private</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-900/50 rounded-lg p-2 border border-slate-700">
                <div className="w-4 h-4 bg-red-500 rounded border-2 border-red-400"></div>
                <span className="text-sm text-gray-300">Restricted</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-900/50 rounded-lg p-2 border border-slate-700">
                <div className="w-4 h-4 bg-gray-500 rounded border-2 border-gray-400"></div>
                <span className="text-sm text-gray-300">External</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-900/50 rounded-lg p-2 border border-slate-700">
                <div className="w-12 h-0.5 bg-blue-400"></div>
                <span className="text-sm text-gray-300">Path</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-900/50 rounded-lg p-2 border border-slate-700">
                <div className="w-12 h-0.5 bg-yellow-400 border-dashed border-t-2 border-yellow-400"></div>
                <span className="text-sm text-gray-300">Hidden</span>
              </div>
            </div>

            {/* Fullscreen Toggle Button */}
            {!isFullscreen && (
              <button
                onClick={() => setIsFullscreen(true)}
                className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 font-medium px-4 py-2 rounded-lg border border-blue-500/50 transition-all flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 11-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Fullscreen
              </button>
            )}
          </div>

          {/* Spatial Map */}
          <div className="bg-slate-900/80 rounded-xl p-8 border border-slate-600 overflow-auto" style={{ maxHeight: isFullscreen ? 'calc(100vh - 200px)' : '600px' }}>
            <div className="inline-block min-w-full">
              {/* Container for grid and SVG */}
              <div className="relative" style={{ width: svgWidth, height: svgHeight }}>

                {/* SVG Layer for connection lines - BEHIND boxes */}
                <svg 
                  className="absolute top-0 left-0 pointer-events-none" 
                  width={svgWidth}
                  height={svgHeight}
                  style={{ zIndex: 1 }}
                >
                  {outpost.layout.map.map(area => {
                    if (!area.connections) return null;

                    return Object.entries(area.connections).map(([direction, destName]) => {
                      const destArea = outpost.layout.map.find(a => a.name === destName);
                      if (!destArea) {
                        console.log(`Missing connection: ${area.name} -> ${destName}`);
                        return null;
                      }

                      const fromGridX = area.position.x - minX;
                      const fromGridY = area.position.y - minY;
                      const toGridX = destArea.position.x - minX;
                      const toGridY = destArea.position.y - minY;

                      // Calculate CENTER of each box
                      const fromX = (fromGridX * (cellWidth + gap)) + (cellWidth / 2);
                      const fromY = (fromGridY * (cellHeight + gap)) + (cellHeight / 2);
                      const toX = (toGridX * (cellWidth + gap)) + (cellWidth / 2);
                      const toY = (toGridY * (cellHeight + gap)) + (cellHeight / 2);

                      const isHidden = isHiddenConnection(direction);
                      const lineColor = isHidden ? '#facc15' : '#60a5fa';
                      const strokeDasharray = isHidden ? '8,8' : '0';

                      return (
                        <line
                          key={`${area.id}-${direction}`}
                          x1={fromX}
                          y1={fromY}
                          x2={toX}
                          y2={toY}
                          stroke={lineColor}
                          strokeWidth="3"
                          strokeDasharray={strokeDasharray}
                          strokeLinecap="round"
                          opacity="0.7"
                        />
                      );
                    });
                  })}
                </svg>

                {/* Grid of rooms - ON TOP */}
                <div 
                  className="relative"
                  style={{ 
                    display: 'grid', 
                    gridTemplateColumns: `repeat(${gridWidth}, ${cellWidth}px)`,
                    gridTemplateRows: `repeat(${gridHeight}, ${cellHeight}px)`,
                    gap: `${gap}px`,
                    zIndex: 10
                  }}
                >
                  {grid.map((row, rowIdx) => (
                    row.map((area, colIdx) => {
                      if (!area) {
                        // Empty cell
                        return (
                          <div 
                            key={`${rowIdx}-${colIdx}`} 
                            style={{ width: cellWidth, height: cellHeight }}
                          />
                        );
                      }

                      // Area cell
                      const nodeColor = getNodeColor(area);

                      return (
                        <div 
                          key={area.id}
                          className="relative group"
                          style={{ width: cellWidth, height: cellHeight }}
                        >
                          {/* Room/Area Box */}
                          <div className={`${nodeColor} rounded-lg p-2 border-2 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer h-full flex flex-col justify-between w-full relative`}
                            style={{ backgroundColor: 'rgba(15, 23, 42, 1)' }}
                          >
                            <div>
                              <h4 className="font-bold text-sm mb-1 leading-tight">{area.name}</h4>
                              <p className="text-xs opacity-80 line-clamp-2">{area.description}</p>
                            </div>

                            {/* Connection Indicators */}
                            <div className="mt-2 flex flex-wrap gap-1">
                              {area.connections && Object.entries(area.connections).map(([direction, dest]) => {
                                const isHidden = isHiddenConnection(direction);
                                return (
                                  <span 
                                    key={direction}
                                    className={`text-[10px] px-1.5 py-0.5 rounded border ${
                                      isHidden 
                                        ? 'bg-yellow-500/30 border-yellow-400/50 text-yellow-300' 
                                        : 'bg-black/30 border-white/20'
                                    }`}
                                    title={`${direction} to ${dest}${isHidden ? ' (hidden)' : ''}`}
                                  >
                                    {direction.includes('north') && !direction.includes('east') && !direction.includes('west') ? '↑' : 
                                     direction.includes('south') && !direction.includes('east') && !direction.includes('west') ? '↓' :
                                     direction.includes('east') && !direction.includes('north') && !direction.includes('south') ? '→' :
                                     direction.includes('west') && !direction.includes('north') && !direction.includes('south') ? '←' :
                                     direction.includes('northeast') ? '↗' :
                                     direction.includes('northwest') ? '↖' :
                                     direction.includes('southeast') ? '↘' :
                                     direction.includes('southwest') ? '↙' : '•'}
                                    {isHidden && '🔒'}
                                  </span>
                                );
                              })}
                            </div>
                          </div>

                          {/* Hover Tooltip */}
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black/95 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20 max-w-xs">
                            <div className="font-bold mb-1">{area.name}</div>
                            <div className="text-[10px] opacity-80">
                              {area.connections && Object.entries(area.connections).map(([dir, dest]) => (
                                <div key={dir} className={isHiddenConnection(dir) ? 'text-yellow-300' : ''}>
                                  {isHiddenConnection(dir) && '🔒 '}
                                  {dir}: {dest}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Map Statistics */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
              <div className="text-2xl font-bold text-blue-400">{outpost.layout.map.length}</div>
              <div className="text-sm text-gray-400">Total Areas</div>
            </div>
            <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
              <div className="text-2xl font-bold text-green-400">
                {outpost.layout.map.filter(a => a.id.includes('entrance')).length}
              </div>
              <div className="text-sm text-gray-400">Entrances</div>
            </div>
            <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
              <div className="text-2xl font-bold text-purple-400">
                {outpost.layout.map.filter(a => a.id.includes('private')).length}
              </div>
              <div className="text-sm text-gray-400">Private Areas</div>
            </div>
            <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
              <div className="text-2xl font-bold text-red-400">
                {outpost.layout.map.filter(a => a.id.includes('restricted') || a.id.includes('armory') || a.id.includes('command')).length}
              </div>
              <div className="text-sm text-gray-400">Restricted</div>
            </div>
          </div>
        </>
      );
    };

    // Fullscreen overlay
    if (isFullscreen) {
      return (
        <div className="fixed inset-0 z-50 bg-slate-900 overflow-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-blue-400">{outpost.name} - Map</h3>
              <button
                onClick={() => setIsFullscreen(false)}
                className="bg-red-500/20 hover:bg-red-500/30 text-red-300 font-medium px-4 py-2 rounded-lg border border-red-500/50 transition-all flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Exit Fullscreen
              </button>
            </div>
            <MapContent />
          </div>
        </div>
      );
    }

    // Normal view
    return (
      <div className="space-y-6">
        <MapContent />
      </div>
    );
  };

  const renderLayout = () => (
    <div className="space-y-4">
      {outpost.layout?.map ? (
        outpost.layout.map.map((area, idx) => (
          <div key={idx} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
            <h3 className="text-xl font-bold text-blue-400 mb-2">{area.name}</h3>
            <p className="text-gray-300 text-sm mb-4">{area.description}</p>
            
            {area.features && (
              <div className="space-y-2 mb-4">
                <h4 className="text-white font-semibold text-sm">Features:</h4>
                {Object.entries(area.features).map(([key, value]) => (
                  <div key={key} className="bg-slate-900/50 rounded-lg p-3">
                    <span className="text-blue-400 font-medium capitalize">{key}: </span>
                    <span className="text-gray-300">{value}</span>
                  </div>
                ))}
              </div>
            )}

            {area.connections && (
              <div className="space-y-2 mb-4">
                <h4 className="text-white font-semibold text-sm">Connections:</h4>
                {Object.entries(area.connections).map(([direction, destination]) => (
                  <div key={direction} className="bg-slate-900/50 rounded-lg p-2 flex items-center gap-2">
                    <span className="text-purple-400 font-medium capitalize">{direction}:</span>
                    <span className="text-gray-300">{destination}</span>
                  </div>
                ))}
              </div>
            )}

            {area.notes && (
              <div className="bg-amber-900/20 border border-amber-500/30 rounded-lg p-3">
                <span className="text-amber-400 font-bold">📝 Notes: </span>
                <span className="text-amber-300">{area.notes}</span>
              </div>
            )}
          </div>
        ))
      ) : (
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 text-center">
          <p className="text-gray-400">No layout information available</p>
        </div>
      )}

      {outpost.layout?.navigationNotes && (
        <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-4">
          <h4 className="text-red-400 font-bold mb-2">⚠️ Navigation Notes:</h4>
          <p className="text-red-300 text-sm">{outpost.layout.navigationNotes}</p>
        </div>
      )}
    </div>
  );

  const renderNPCs = () => (
    <div className="space-y-4">
      {outpost.keyNPCs && outpost.keyNPCs.length > 0 ? (
        outpost.keyNPCs.map((npc, idx) => (
          <div key={idx} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-xl font-bold text-white">{npc.name}</h3>
                <p className="text-blue-400 text-sm">{npc.role}</p>
              </div>
            </div>
            <p className="text-gray-300 mb-3">{npc.description}</p>
            {npc.location && (
              <div className="bg-slate-900/50 rounded-lg p-3">
                <span className="text-gray-400 text-sm">Location: </span>
                <span className="text-white font-medium">{npc.location}</span>
              </div>
            )}
          </div>
        ))
      ) : (
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 text-center">
          <p className="text-gray-400">No key NPCs recorded</p>
        </div>
      )}
    </div>
  );

  const renderAccess = () => (
    <div className="space-y-6">
      {/* Access Level */}
      <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
        <h3 className="text-xl font-bold text-blue-400 mb-4">Access Level</h3>
        <p className="text-gray-300">{outpost.accessLevel || 'No information available'}</p>
      </div>

      {/* Defenses */}
      {outpost.defenses && (
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
          <h3 className="text-xl font-bold text-blue-400 mb-4">Defenses</h3>
          <p className="text-gray-300">{outpost.defenses}</p>
        </div>
      )}

      {/* Entrances */}
      {outpost.entrances && outpost.entrances.length > 0 && (
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
          <h3 className="text-xl font-bold text-green-400 mb-4">Entrances</h3>
          <ul className="space-y-2">
            {outpost.entrances.map((entrance, idx) => (
              <li key={idx} className="flex items-start gap-2 bg-slate-900/50 rounded-lg p-3">
                <span className="text-green-400 mt-1">→</span>
                <span className="text-gray-300 flex-1">{entrance}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Exits */}
      {outpost.exits && outpost.exits.length > 0 && (
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
          <h3 className="text-xl font-bold text-red-400 mb-4">Exits</h3>
          <ul className="space-y-2">
            {outpost.exits.map((exit, idx) => (
              <li key={idx} className="flex items-start gap-2 bg-slate-900/50 rounded-lg p-3">
                <span className="text-red-400 mt-1">←</span>
                <span className="text-gray-300 flex-1">{exit}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Anomalous Properties */}
      {outpost.anomalousProperties && outpost.anomalousProperties.length > 0 && (
        <div className="bg-purple-900/20 border border-purple-500/30 rounded-xl p-6">
          <h3 className="text-xl font-bold text-purple-400 mb-4">⚠️ Anomalous Properties</h3>
          <ul className="space-y-2">
            {outpost.anomalousProperties.map((prop, idx) => (
              <li key={idx} className="flex items-start gap-2 bg-black/30 rounded-lg p-3">
                <span className="text-purple-400 mt-1">⚡</span>
                <span className="text-purple-300 flex-1">{prop}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  const renderHistory = () => (
    <div className="space-y-4">
      {outpost.history && outpost.history.length > 0 ? (
        outpost.history.map((period, idx) => (
          <div key={idx} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-blue-400">{period.title}</h3>
              <p className="text-gray-400 text-sm mt-1">⏳ {period.period}</p>
            </div>
            <div className="space-y-4">
              {period.events.map((event, eidx) => (
                <div key={eidx} className="border-l-4 border-blue-500 pl-4 py-2 bg-slate-900/30 rounded-r-lg">
                  <div className="flex items-start gap-3 mb-2">
                    <span className="text-white font-bold bg-blue-500/20 px-3 py-1 rounded-full text-sm border border-blue-500/50 whitespace-nowrap">
                      {event.year}
                    </span>
                    <span className="text-white font-bold flex-1">{event.event}</span>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">{event.details}</p>
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 text-center">
          <p className="text-gray-400">No history recorded</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="h-full w-full flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 md:m-4 md:rounded-2xl md:border-2 md:border-white/20 md:h-auto md:max-h-[90vh] md:max-w-6xl md:mx-auto overflow-hidden">
        
        {/* Header */}
        <div className="flex-shrink-0 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 border-b border-white/10">
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-2xl border border-white/30 shadow-lg">
                <span>🏰</span>
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg md:text-xl font-bold text-white truncate">{outpost.name}</h2>
                <p className="text-blue-300 text-sm">📍 {outpost.location}</p>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="flex-shrink-0 p-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg border border-red-500/50 transition-all ml-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
              </svg>
            </button>
          </div>

          {/* Tabs */}
          <div className="overflow-x-auto hide-scrollbar">
            <div className="flex gap-2 p-3 min-w-max">
              <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon="📋" label="Overview" />
              <TabButton active={activeTab === 'map'} onClick={() => setActiveTab('map')} icon="🗺️" label="Map" />
              <TabButton active={activeTab === 'layout'} onClick={() => setActiveTab('layout')} icon="📐" label="Layout" />
              <TabButton active={activeTab === 'npcs'} onClick={() => setActiveTab('npcs')} icon="👤" label="NPCs" />
              <TabButton active={activeTab === 'access'} onClick={() => setActiveTab('access')} icon="🔐" label="Access & Travel" />
              <TabButton active={activeTab === 'history'} onClick={() => setActiveTab('history')} icon="📖" label="History" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'map' && renderMap()}
          {activeTab === 'layout' && renderLayout()}
          {activeTab === 'npcs' && renderNPCs()}
          {activeTab === 'access' && renderAccess()}
          {activeTab === 'history' && renderHistory()}
        </div>
      </div>
    </div>
  );
};

const TabButton = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`flex-shrink-0 px-4 py-2 rounded-lg font-medium text-sm transition-all whitespace-nowrap ${
      active
        ? 'bg-blue-500/30 text-blue-300 border-2 border-blue-500/50'
        : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
    }`}
  >
    <span className="mr-1">{icon}</span>
    {label}
  </button>
);