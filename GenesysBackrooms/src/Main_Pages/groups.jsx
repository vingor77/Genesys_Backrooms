import React, { useState, useEffect } from 'react';
import { collection, doc, onSnapshot, query, updateDoc, setDoc } from "firebase/firestore";
import db from '../Components/firebase';
import GroupCard from "../Components/groupCard";
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

const data = [
  {
    "groupName": "Major Explorer Group",
    "abbreviation": "MEG",
    "motto": "We will keep you safe.",
    "primaryType": "Exploratory",
    "metrics": {
      "influence": 8,
      "hostility": 5,
      "organization": 6
    },
    "overview": {
      "description": "The Major Explorer Group, commonly abbreviated as the M.E.G for general convenience and originally dubbed the British Coalition of Liminal Exploration, is a hybrid exploratory-governmental group dedicated primarily to exploration of the Backrooms' various Levels. Made up of a variety of self-governing teams, departments, and outposts regulated by the Impresarios, the MEG's influence extends all over the Backrooms.",
      "foundingYear": 1885,
      "formerNames": ["British Coalition of Liminal Exploration"],
      "estimatedMembers": 25000,
      "estimatedCivilians": 30000,
      "notableAchievements": [
        "Discovered the largest number of levels out of any group",
        "Created the Casper-Bray Numbering System",
        "Invented the Major Navigation System"
      ]
    },
    "leadership": {
      "structure": [
        {
          "position": "The First",
          "count": 1,
          "description": "Head of the Major Explorer Group with power over the entirety of the Group, including the Consensus",
          "powers": ["Complete authority over the group", "Present at majority of Consensus meetings"]
        },
        {
          "position": "Impresarios",
          "count": 26,
          "description": "Elite group designated A to Z who hold almost complete power, second only to The First",
          "powers": [
            "Add or remove individuals from the Group",
            "Create or disband Departments or Teams",
            "Institute new Head of Department",
            "Remove Heads of Department",
            "Control over functional arsenal",
            "Vote at Consensus meetings"
          ],
          "limitations": "Decisions opposed by another Impresario require consensus vote"
        },
        {
          "position": "Head of Department",
          "count": 4,
          "description": "Leaders managing one of the four main departments",
          "responsibilities": ["Manage their respective department", "Promote/demote Overseers"]
        },
        {
          "position": "Overseers",
          "count": "3 per team",
          "description": "Manage and lead their respective teams",
          "limitations": "Opposed decisions require consensus vote among the three"
        }
      ]
    },
    "groupStructure": {
      "departments": [
        {
          "name": "Department of Exploration",
          "purpose": "Handles the exploration of levels",
          "teams": [
            {
              "designation": "Team E-0",
              "name": "Volunteer Squad",
              "specialization": "Novice Explorers",
              "memberCount": 5000,
              "description": "Largest team composed of new recruits. All wanderers above 18 in M.E.G outposts can be drafted, required to serve minimum one year. Focuses on training new recruits, often missions with Team Voyager.",
              "additionalDuties": ["Construction", "Gathering resources"]
            },
            {
              "designation": "Team E-1",
              "name": "Team Voyager",
              "specialization": "General Exploration & Reconnaissance",
              "memberCount": 1000,
              "description": "Professional exploration team. Most common team for promoted Volunteer Squad members. Conducts majority of initial level explorations for preliminary data collection."
            },
            {
              "designation": "Team E-2",
              "name": "Midas' Collection",
              "specialization": "Scavenging and Resource Acquisition",
              "memberCount": 2000,
              "description": "Dedicated to collection of anomalous and non-anomalous resources. Members vary: explorers, miners, hunters."
            },
            {
              "designation": "Team E-3",
              "name": "Paracartography Department",
              "specialization": "Cartography & Mapping",
              "memberCount": 950,
              "description": "Documents consistent paths throughout the Backrooms via the Major Navigation System."
            },
            {
              "designation": "Team E-4",
              "name": "Cavern Explorers",
              "specialization": "Enclosed Level Exploration",
              "memberCount": 500,
              "description": "Explores interior levels, commonly cramped or cave-like ones. Notable explorations: Level 8.1, Level 8.55, Level 81, Level 117."
            },
            {
              "designation": "Team E-5",
              "name": "Terra Expedition Team",
              "specialization": "Exterior Level Exploration",
              "memberCount": 600,
              "description": "Explores exterior levels, commonly natural environments. Equipped for harsh environments. Notable explorations: Level 10, Level 11, The Thin Barrier."
            },
            {
              "designation": "Team E-6",
              "name": "Alice In Wonderland",
              "specialization": "Unstable & Mentally Hazardous Level Exploration",
              "memberCount": 200,
              "description": "Explores levels with significant anomalous or psychological effects. Well-versed in avoiding Roth Syndrome. Notable explorations: Level -1000, The Corrupted Instability, Level 111."
            },
            {
              "designation": "Team E-7",
              "name": "Hazmat Squad",
              "specialization": "Environmentally & Biologically Hazardous Level Exploration",
              "memberCount": 150,
              "description": "Explores heavily biohazardous or environmentally hazardous levels. Equipped with protective hazmat suits and heavy armor. Notable explorations: Level -606, Level 998, Level 11.11."
            },
            {
              "designation": "Team E-8",
              "name": "Pestis Affiliate",
              "specialization": "Entity-Infested Level Exploration",
              "memberCount": 65,
              "description": "Explores entity-infested levels. Often transferred from military teams. Heavily armed with military gear. Notable explorations: Level -6, The Hotel Crimson."
            }
          ]
        },
        {
          "name": "Department of Research",
          "purpose": "Handles research and documentation of the Backrooms",
          "teams": [
            {
              "designation": "Team R-1",
              "name": "Prometheus Library",
              "specialization": "Public Database Contact & Documentation",
              "memberCount": 1000,
              "description": "Edits the Database using latest exploration information. One of the most active teams, making thousands of edits daily."
            },
            {
              "designation": "Team R-2",
              "name": "Enigmatic Space Information Security & Protection System",
              "specialization": "Private Database Documentation",
              "memberCount": 500,
              "description": "Comprehensive, secure database for anomalous locations ensuring information is properly protected, stored, and encrypted between bases."
            },
            {
              "designation": "Team R-3",
              "name": "Team Turing",
              "specialization": "Technical Maintenance",
              "memberCount": 200,
              "description": "Technical maintenance of M.E.G's digital software, database, and more. Comprised of skilled programmers with high database access levels."
            },
            {
              "designation": "Team R-4",
              "name": "Major Research Organization",
              "specialization": "Scientific Research",
              "memberCount": 700,
              "description": "Founded 1920. Scientific research of the Backrooms and its anomalies. Composed of physicists, biologists, and other scientists. Frequent correspondence with Kauer Research Organization."
            },
            {
              "designation": "Team R-5",
              "name": "Medusa's Blindfold",
              "specialization": "Cognitohazardous Information Archival",
              "memberCount": 1,
              "description": "Archives and contains cognitohazardous information. Heavily classified work. Formerly 50 members; each quit, disappeared, or died over 10 years. Only remaining member: Veronika Lyssa (de-facto overseer)."
            },
            {
              "designation": "Team R-6",
              "name": "Midnight Library",
              "specialization": "Physical Archival",
              "memberCount": 200,
              "description": "Archives physical copies of documentation for reserve use. Formed after The Flicker due to possibility of digital database compromise. Strict security on contents."
            }
          ]
        },
        {
          "name": "Department of Colonization",
          "purpose": "Handles creation and upkeep of colonies",
          "teams": [
            {
              "designation": "Team C-1",
              "name": "Magellan Initiative",
              "specialization": "Initial Level Colonization",
              "memberCount": 500,
              "description": "Initial setup of new colonies and outposts. Includes construction workers, armed personnel, and Paracartography members. Starts hundreds of outposts per year."
            },
            {
              "designation": "Team C-2",
              "name": "Major Construction Inc.",
              "specialization": "Construction",
              "memberCount": 1200,
              "description": "Constructs buildings and infrastructure for colonies. Composed of architects, electricians, plumbers, and other professions. Often collaborates with Midas Collection."
            },
            {
              "designation": "Team C-3",
              "name": "An Apple A Day",
              "specialization": "Medical Care",
              "memberCount": 1000,
              "description": "Medical care for M.E.G members. Works with exploration and defense teams. Equipped with Almond Water, Neon Backshrooms, Achrophiline. Protocols for Roth Syndrome, Hydrolitis Plague, Sanguine Festivus."
            },
            {
              "designation": "Team C-4",
              "name": "Porters",
              "specialization": "Resource Transport",
              "memberCount": 2000,
              "description": "Facilitates transport of valuable resources. Heavily armed against bandits and entities. Instrumental in continued group functioning."
            },
            {
              "designation": "Team C-5",
              "name": "Backrooms Barnyard",
              "specialization": "Agriculture",
              "memberCount": 1000,
              "description": "Maintains agricultural infrastructure. Personnel specialize in agronomy and agricultural work. Collaborates with Porters to transfer produce."
            },
            {
              "designation": "Team C-6",
              "name": "Money Game",
              "specialization": "Economy & Resource Storage",
              "memberCount": 450,
              "description": "Manages trade and resource management within the group. Maintains resource stockpiles in bases. Works with Porters to upkeep supply chain."
            }
          ]
        },
        {
          "name": "Department of Defense",
          "purpose": "Defends against entities and hostile groups",
          "teams": [
            {
              "designation": "Team D-1",
              "name": "Arminius Squadron",
              "specialization": "Entity Pest Control",
              "memberCount": 500,
              "description": "Heavily armed military branch. Kills large populations of hostile entities around critical outposts. Collaborates with Anti-Entity Group and Party Crashers. Kills ~7,000 hostile entities per year."
            },
            {
              "designation": "Team D-2",
              "name": "Major Armed Forces",
              "specialization": "General Military Operations",
              "memberCount": 2000,
              "description": "Main military branch. Notable in Korthie Casiagen War, Bloodbath of Cluster I, Incident 154. Heavily armed with military gear from Level 73 and other levels."
            },
            {
              "designation": "Team D-3",
              "name": "Iron Wall",
              "specialization": "Base & Colony Defense",
              "memberCount": 1000,
              "description": "Base and colony defense. Keeps order within colonies, defends outposts from external threats (entity and human), creates defensive infrastructure."
            },
            {
              "designation": "Team D-4",
              "name": "C.L.E.F",
              "specialization": "Unknown",
              "memberCount": "Classified",
              "description": "Heavily classified. Speculated to be military or defensive group. Only known activity: study of Procul Lumina."
            }
          ]
        }
      ]
    },
    "settlements": [
      {
        "name": "New London",
        "location": "Level 1",
        "status": "Abandoned",
        "founded": 1909,
        "population": {
          "personnel": 0,
          "wanderers": 0,
          "formerTotal": 10000
        },
        "area": "5 square kilometers",
        "history": "Former largest M.E.G settlement, named after The First's home country capital. Main recruitment area, supply storage, living quarters. Started as minor outpost near Hub entrance, grew into city. Abandoned due to entity attacks during The Flicker. Some wanderers still reside but M.E.G no longer controls."
      },
      {
        "name": "Base Alpha",
        "location": "The Hub",
        "status": "Active - Largest remaining outpost",
        "founded": "Early 1900s",
        "population": {
          "personnel": 1000,
          "wanderers": 3000
        },
        "purpose": ["Resource distribution", "Recruitment", "Trade port", "Rest stop for explorers"],
        "history": "During Flicker, refugees from New London fled here causing tensions and riots. Post-Flicker, ran massive resource supply effort with Base Omega to restore infrastructure and supply chain."
      },
      {
        "name": "M.E.G. Outpost Itinerari",
        "location": "The Metro (Yellow Line train)",
        "status": "Active",
        "founded": "Unknown",
        "population": {
          "personnel": 100,
          "wanderers": 0
        },
        "purpose": "Resource transport using Metro travel. Friendly to wanderers, willing to trade. Mostly Team C-4 members."
      },
      {
        "name": "First Light",
        "location": "Level 1",
        "status": "Active",
        "founded": "Unknown",
        "population": {
          "personnel": 80,
          "wanderers": 0
        },
        "purpose": "Recruitment area and guide for lost wanderers to safer places."
      },
      {
        "name": "Wandermere",
        "location": "Level 4",
        "status": "Active",
        "founded": 1957,
        "population": {
          "personnel": 0,
          "wanderers": 5000
        },
        "purpose": "Rest stop for wanderers and M.E.G explorers. Civilian area.",
        "history": "Founded when M.E.G looked into tearing apart Level 4 structure for building material. Evolved into small town due to Level 4's relative safety."
      },
      {
        "name": "Base Omega",
        "location": "Level 154",
        "status": "Active",
        "founded": "Unknown",
        "population": {
          "personnel": 100,
          "wanderers": 0
        },
        "purpose": "Trade port and warehouse for resources. Recruitment center.",
        "notes": "Visited by Base Alpha members from Hub to supply other outposts and explorers."
      },
      {
        "name": "The Crewmembers",
        "location": "Level 3.24 (train station)",
        "status": "Active",
        "founded": "Unknown",
        "population": {
          "personnel": 30,
          "wanderers": 140
        },
        "purpose": "Easy travel via trains, hospitality for wanderers. Has multiple BACK-NET terminals."
      }
    ],
    "relations": [
      {
        "groupName": "The Kauer Research Organization",
        "status": "Allied",
        "description": "Ties cemented in 1950 with Treaty of Base Alpha. Both groups have been assisting each other following the Flicker."
      },
      {
        "groupName": "The Anti-Entity Group",
        "status": "Friendly",
        "description": "Team D-1 commonly cooperates with A.E.G to clear levels of hostile entities. No official diplomatic relation exists."
      },
      {
        "groupName": "Backroom Colonists",
        "status": "Neutral",
        "description": "Co-operated until distrust grew, reaching peak with The Bloodbath where M.E.G prevailed. As both endured The Flicker struggle, cooperation grew. Both governments and majority of people remain on peaceful terms. M.E.G has quantum technology from the colonists for certain expedition teams."
      },
      {
        "groupName": "Backrooms Investigation Foundation",
        "status": "Tense",
        "description": "Mostly friendly terms but history of conflict. B.I.F has attempted to assassinate multiple M.E.G Overseers due to alleged institutional corruption (most attempts failed). Tension high but no war plans."
      },
      {
        "groupName": "The Architects",
        "status": "Tense",
        "description": "Relations somewhat strained due to founding circumstances. Groups continue to engage in trade. Conflict unlikely in near future."
      },
      {
        "groupName": "Republic of Aurielle",
        "status": "Hostile",
        "description": "Relations are horrible. Initially engaged in trade for military resources during Bloodbath of Cluster I. After alleged sabotage of military supplies by Aurielle, relations soured. M.E.G funding of Antilian soldiers and planned invasion resulted in bloody Korthie Casiagen War. No official war since 2019 but isolated tactical skirmishes continue."
      },
      {
        "groupName": "Auto Nexus",
        "status": "Hostile",
        "description": "Aggressive relations due to territorial and resource disputes. Auto Nexus formed partly to oppose M.E.G, claiming M.E.G's explorations are useless. Dislikes M.E.G's large dominance. Infamous for torturing, abducting, imprisoning M.E.G agents."
      }
    ],
    "history": [
      {
        "period": "1885 - 1900",
        "title": "Early Beginnings",
        "events": [
          {
            "year": 1885,
            "event": "Formation of British Coalition of Liminal Exploration",
            "details": "Alliance between four groups in Level 1: United Azeutian Empire (~2,500 citizens, founded 1734), The Explorers (~100 wanderers from 2012 transported to 1800s via temporal anomaly), Her Majesty's Agency For Parallel Universes (500 people, founded 1870, trapped when Terminal demanifested), and New Britain (1000 people, 10 years old)."
          },
          {
            "year": "Late 1800s",
            "event": "Major Civil War",
            "details": "Internal conflict due to disorganized nature. Few casualties but impeded functions. Led to agreement on leadership selection."
          },
          {
            "year": "~1890s",
            "event": "The First chosen as leader",
            "details": "The First (from New Britain) chosen to lead. Fully fused four groups together. Renamed to Major Explorer Group. Appointed first Impresarios."
          },
          {
            "year": 1899,
            "event": "Discovery of The Hub",
            "details": "Exploration mission discovered The Hub."
          }
        ]
      },
      {
        "period": "1900 - 1920",
        "title": "On The Rise",
        "events": [
          {
            "year": "Early 1900s",
            "event": "The Compass created",
            "details": "New outpost in Hub for research. Spearheaded age of exploration, resulting in discovery of dozens of levels and rapid M.E.G expansion."
          },
          {
            "year": "Early 1900s",
            "event": "Switch to Major Numbering System",
            "details": "Switched from name-based to number-based classification following discovery of hundreds of new levels. Levels referred to as 'Areas' at the time."
          },
          {
            "year": 1909,
            "event": "New London founded",
            "details": "Minor outpost built near Hub entrance. Would grow into largest M.E.G settlement."
          },
          {
            "year": "Unknown",
            "event": "Battle of the Crossroads",
            "details": "M.E.G tunneled into Hub walls for expansion, angering The Keymaster. Tactical engagements occurred. M.E.G ambush with Firesalt explosives critically wounded Keymaster, forcing surrender."
          }
        ]
      },
      {
        "period": "1920 - 1950",
        "title": "New Dawn, Old Remnants",
        "events": [
          {
            "year": 1920,
            "event": "Major Research Organization founded",
            "details": "Team R-4 established for scientific research."
          },
          {
            "year": "1920s",
            "event": "Alliance with Backrooms Pioneers",
            "details": "M.E.G allied with Backrooms Pioneers (later Backroom Colonists). Both groups underwent period of growth, exploring hundreds of levels, improving living conditions for tens of thousands."
          },
          {
            "year": "October 21, 1937",
            "event": "Attempted Coup",
            "details": "Coup attempt by M.E.G members including two Heads of Department, six Overseers, one Impresario. British Wake Army prevented takeover. Coup members split to form Unbound Explorer Coalition (UEC)."
          },
          {
            "year": "1937-1947",
            "event": "Great Wake War",
            "details": "UEC (fascist ideology, British Fascism influenced) committed human rights abuses including genocide of disabled, ethnic minorities, sapient entities, rival group citizens. Many groups formed Allied Liminal Coalition to fight UEC. UEC collapsed 1947 due to failing supply chains, infighting, series of defeats."
          },
          {
            "year": "Post-1947",
            "event": "Allied Liminal Coalition renamed",
            "details": "Renamed to Cartographer Alliance. Opened membership to all applying groups to prevent similar incidents."
          }
        ]
      },
      {
        "period": "1950 - 2000",
        "title": "Strife",
        "events": [
          {
            "year": 1950,
            "event": "Treaty of Base Alpha",
            "details": "Cemented ties between K.R.O. and M.E.G."
          },
          {
            "year": "1950s",
            "event": "Cold War period",
            "details": "Distrust from Great Wake War. Majority of factions locked in cold war. Internal conflicts caused M.E.G and Backroom Colonists to enter adversarial relationship with espionage missions."
          },
          {
            "year": 1957,
            "event": "Wandermere founded",
            "details": "Colony established in Level 4."
          },
          {
            "year": 1965,
            "event": "Discovery of Level Key properties",
            "details": "Impresario H Judah Casper and Impresario K Sarah Bray discovered Level Keys emit radio waves (1-1000 MHz) that correspond to level audio/properties."
          },
          {
            "year": 1967,
            "event": "Casper-Bray System adopted",
            "details": "Formula created to determine level ordering. Hypothesis made that Level 400 was aquatic. After years of searching, Level 400 discovered, confirming system. M.E.G adopted CBNS and 'Levels' terminology."
          },
          {
            "year": 1971,
            "event": "Bloodbath of Cluster I begins",
            "details": "Political tension peaked. Total war within Cluster I. Most groups participated, members ordered to kill enemy personnel on sight."
          },
          {
            "year": "1971 (during war)",
            "event": "Super-weapon incident",
            "details": "All factions received intel about colossal super-weapon on Level 108 (each believing different faction built it). All converged simultaneously, causing unprecedented bloodbath. Weapon ('Kijimi') mysteriously activated, opening wormhole sucking in operatives. Energy imploded, killing many more, terraforming rest of level. Red plantations allegedly dyed from bloodshed. Investigations revealed errors in data, disappearing documents, conflicting memories, mysterious phenomena throughout war. No plausible explanation found."
          },
          {
            "year": 1990,
            "event": "Bloodbath of Cluster I ends",
            "details": "M.E.G victory. Cartographer Alliance dissolved. M.E.G demilitarized somewhat to avoid future conflicts at this scale."
          }
        ]
      },
      {
        "period": "2000 - 2016",
        "title": "Expansion, Stagnation",
        "events": [
          {
            "year": "Early 2000s",
            "event": "Technology integration period",
            "details": "Average no-clippers well-versed in computing. M.E.G infrastructure used increasing technology. Digital systems assisted exploration, resulting in growth period."
          },
          {
            "year": "~2016",
            "event": "The Flicker",
            "details": "Complete electrical grid failure. Absence of natural skylight in exterior levels. Rise in entity population. Failure of critical supply chains. Decreasing habitability of exterior levels (dropping temperatures). Fall of New London due to continual entity assaults. M.E.G personnel reduced from 46,000 to 25,000."
          },
          {
            "year": "Post-Flicker",
            "event": "Korthie Casiagen War",
            "details": "Souring relations between M.E.G and Republic of Aurielle. Massive blow to group, period of humiliation."
          }
        ]
      },
      {
        "period": "2016 - Present",
        "title": "Current Day",
        "events": [
          {
            "year": "2016-2019",
            "event": "Continued conflict with Aurielle",
            "details": "Official war ended 2019 but isolated tactical skirmishes continue."
          },
          {
            "year": "Current",
            "event": "Precarious state",
            "details": "Visibly weaker than formerly. The First's new initiative: increasing militarization. Recent conflicts (Incident 154) show tension with other groups may be increasing."
          }
        ]
      }
    ]
  },
  {
    "groupName": "Back-Flags",
    "abbreviation": "BF",
    "motto": "Building the Future of Commerce",
    "primaryType": "Commercial/Corporate",
    "metrics": {
      "influence": 7,
      "hostility": 3,
      "organization": 8
    },
    "overview": {
      "description": "Back-Flags is a corporate entity that operates the largest online marketplace, digital currency system (Back-Cash), and gambling services in the Backrooms. Originally starting as a flag designer service as a marketing stunt, they have grown into a commercial monopoly with significant economic influence despite numerous controversies involving bribery, fraud, and poor security practices.",
      "foundingYear": 1985,
      "formerNames": ["Back-Flags Flag Designer Service"],
      "estimatedMembers": 101,
      "estimatedCivilians": 0,
      "notableAchievements": [
        "Created Back-Cash digital currency system",
        "Established monopoly on online trading in the Backrooms",
        "Built comprehensive marketplace with stock tracking",
        "Survived multiple major scandals and maintained dominance"
      ]
    },
    "leadership": {
      "structure": [
        {
          "position": "Chief Executive Officer",
          "count": 1,
          "description": "Unknown individual leading Back-Flags operations",
          "powers": ["Complete corporate authority", "Final decisions on business operations"]
        },
        {
          "position": "Board of Directors",
          "count": "Unknown",
          "description": "Executive leadership making strategic decisions",
          "powers": ["Oversee business operations", "Set company policy", "Manage finances"]
        },
        {
          "position": "Department Managers",
          "count": "Unknown",
          "description": "Manage marketplace, currency, gambling, and security divisions"
        }
      ]
    },
    "groupStructure": {
      "departments": [
        {
          "name": "Marketplace Operations",
          "purpose": "Manages the online marketplace and product listings",
          "teams": [
            {
              "designation": "Unknown",
              "name": "Trading Platform Team",
              "specialization": "Marketplace Management",
              "memberCount": 20,
              "description": "Maintains the online marketplace, processes transactions, and manages product listings. Handles disputes and monitors trading activity."
            }
          ]
        },
        {
          "name": "Financial Services",
          "purpose": "Manages Back-Cash currency and stock tracking systems",
          "teams": [
            {
              "designation": "Unknown",
              "name": "Currency Management",
              "specialization": "Digital Currency Operations",
              "memberCount": 20,
              "description": "Manages the Back-Cash digital currency system, monitors stock values, adjusts for inflation, and maintains the value tracking graph for products."
            },
            {
              "designation": "Unknown",
              "name": "Investment Services",
              "specialization": "Online Gambling & Investment",
              "memberCount": 20,
              "description": "Operates gambling services and investment platforms. Recently implemented age restrictions following user complaints."
            }
          ]
        },
        {
          "name": "Security & Compliance",
          "purpose": "Handles cybersecurity and regulatory compliance (poorly)",
          "teams": [
            {
              "designation": "Unknown",
              "name": "Security Team",
              "specialization": "Platform Security",
              "memberCount": 20,
              "description": "Responsible for platform security, fraud prevention, and user verification. Notoriously inadequate, only making updates after major incidents and revenue losses."
            }
          ]
        },
        {
          "name": "Legacy Services",
          "purpose": "Maintains original flag designer service",
          "teams": [
            {
              "designation": "Unknown",
              "name": "Flag Design Team",
              "specialization": "Flag Creation Service",
              "memberCount": 20,
              "description": "Maintains the original flag designer service with minimal updates. New templates added approximately every 2 weeks. Service is overpriced and largely ignored."
            }
          ]
        }
      ]
    },
    "settlements": [
      {
        "name": "Back-Flags Corporate Headquarters",
        "location": "Level 11",
        "status": "Active",
        "founded": 1985,
        "population": {
          "personnel": 101,
          "wanderers": 0
        },
        "purpose": "Primary base of operations for Back-Flags corporate activities, server infrastructure, and all business operations. Hidden among the countless buildings of Level 11."
      }
    ],
    "relations": [
      {
        "groupName": "The Database",
        "status": "Tense",
        "description": "Back-Flags has consistently attempted to bribe The Database into altering unflattering information about themselves, offering illegal insider trading knowledge in exchange for creating oligopolies and sharing private user information. The Database has resisted these attempts."
      },
      {
        "groupName": "Backrooms Investigation Foundation",
        "status": "Tense",
        "description": "Suspicious relationship with allegations of bribery. The Backrooms Investigation Foundation has been accused of failing to report Back-Flags' criminal activities and arrested whistleblowers, though they later apologized claiming they arrested the wrong individuals after public outcry."
      },
      {
        "groupName": "The Anti-Entity Group",
        "status": "Neutral",
        "description": "Business relationship complicated by the Large Liquid Pain Cargo Incident where A.E.G. accidentally uncovered a human trafficking ring through Back-Flags' marketplace. While Back-Flags was found unaware of the trafficking, they were blamed for inadequate security."
      },
      {
        "groupName": "Backrooms Today",
        "status": "Neutral",
        "description": "Backrooms Today has made various reports on both business aspects and scandals involving Back-Flags, showing a neutral journalistic approach."
      },
      {
        "groupName": "General Wanderer Population",
        "status": "Tense",
        "description": "Many wanderers dislike Back-Flags due to overpriced services, predatory contracts, monopolistic practices, and history of fraud/scams. Despite this, wanderers continue using their services due to lack of alternatives. Bootleg versions of their services have emerged."
      }
    ],
    "history": [
      {
        "period": "1985 - 1986",
        "title": "Foundation & Flag Service",
        "events": [
          {
            "year": 1985,
            "event": "Back-Flags founded as flag designer service",
            "details": "Started as an online flag designer service on Level 11, promoted heavily on Back-Chat forums. Used automated spamming and sock puppet accounts which led to account terminations. Services criticized as overpriced."
          },
          {
            "year": 1986,
            "event": "Flag service revealed as marketing stunt",
            "details": "After 4 months, Back-Flags announced flag designer was merely marketing to grab attention. Real focus was digital currency, gambling, and marketplace services."
          }
        ]
      },
      {
        "period": "1987 - 1995",
        "title": "Commercial Growth",
        "events": [
          {
            "year": 1987,
            "event": "Launch of Back-Cash digital currency",
            "details": "Introduced Back-Cash to monitor stocks and product values, adjustable for inflation. Initially met with suspicion but gradually adopted by users."
          },
          {
            "year": 1989,
            "event": "Marketplace and gambling services launched",
            "details": "Expanded into online marketplace and gambling. Despite initial suspicion, services became widely used due to lack of alternatives."
          },
          {
            "year": 1995,
            "event": "Monopoly established",
            "details": "Through constant attempts to buy out or shut down competitors, Back-Flags established monopoly on online trading in the Backrooms."
          }
        ]
      },
      {
        "period": "2000 - 2020",
        "title": "Period of Scandals",
        "events": [
          {
            "year": 2003,
            "event": "Bribery attempts exposed",
            "details": "Consistent attempts to bribe The Database into altering information revealed. Offered illegal insider trading knowledge in exchange for creating oligopolies."
          },
          {
            "year": 2011,
            "event": "Backrooms Investigation Foundation whistleblower scandal",
            "details": "The Backrooms Investigation Foundation arrested Back-Flags whistleblowers for 'media leaks.' Public outcry and distribution of classified documents showing misconduct forced the Backrooms Investigation Foundation to apologize, claiming wrong individuals arrested."
          },
          {
            "year": 2015,
            "event": "Large Liquid Pain Cargo Incident",
            "details": "Human trafficking ring uncovered when A.E.G. accidentally received containers of trafficking victims (nicknamed Object 12) instead of Liquid Pain weapons. Back-Flags proved unaware but blamed for inadequate security."
          },
          {
            "year": 2018,
            "event": "Fraud and scam epidemic",
            "details": "Many users became victims of fraud and scams on platform. After massive complaints and revenue loss, Back-Flags implemented security updates and banned underage users from investment/gambling."
          }
        ]
      },
      {
        "period": "2020 - Present",
        "title": "Maintained Dominance",
        "events": [
          {
            "year": "Current",
            "event": "Ongoing operations",
            "details": "Despite multiple scandals and controversies, Back-Flags maintains monopoly on online trading. Recommended to use services with caution due to predatory practices and poor security."
          }
        ]
      }
    ]
  }
]

export default function Groups() {
  const [groups, setGroups] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [relationFilter, setRelationFilter] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const [activeGroup, setActiveGroup] = useState(null);
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

    const q = query(collection(db, 'Groups'));

    const unsub = onSnapshot(q, (querySnapshot) => {
      const queryData = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const sessionStatus = data.sessionStatus?.[sessionId] || {};
        const sessionVisibility = data.sessionVisibility || {};
        
        queryData.push({ 
          docId: doc.id, 
          ...data,
          currentSessionStatus: sessionStatus.status || 'Active',
          currentSessionRelationship: sessionStatus.relationship_with_party || 'Unknown',
          hiddenInCurrentSession: sessionVisibility[sessionId] === false
        });
      });
      
      queryData.sort((a, b) => a.groupName.localeCompare(b.groupName));
      
      setGroups(queryData);
      setLoading(false);
    }, (error) => {
      console.error('Error loading groups:', error);
      showToast('Error loading groups', 'error');
      setLoading(false);
    });

    return () => { unsub(); };
  };

  const uploadGroupData = async () => {
    if (!userIsDM) {
      showToast('Only DMs can upload group data', 'error');
      return;
    } 

    const groupNames = data.map(g => g.groupName).join(', ');
    const confirmUpload = window.confirm(
      `This will add ${data.length} groups to the database: ${groupNames}. Continue?`
    );  

    if (!confirmUpload) return; 

    try {
      let successCount = 0;
      let errorCount = 0; 

      for (const group of data) {
        try {
          await setDoc(doc(db, 'Groups', group.groupName), {
            ...group,
            sessionVisibility: {},
            sessionStatus: {}
          });
          successCount++;
        } catch (error) {
          console.error(`Error uploading ${data.groupName}:`, error);
          errorCount++;
        }
      } 

      if (errorCount === 0) {
        showToast(`Successfully added ${successCount} group${successCount !== 1 ? 's' : ''}!`, 'success');
      } else {
        showToast(`Added ${successCount} groups, ${errorCount} failed`, 'warning');
      }
    } catch (error) {
      showToast('Error uploading group data', 'error');
      console.error('Upload error:', error);
    }
  };

  const toggleGroupVisibility = async (group) => {
    if (!userIsDM || !sessionId) return;
    
    try {
      const currentVisibility = group.sessionVisibility || {};
      const newVisibility = {
        ...currentVisibility,
        [sessionId]: currentVisibility[sessionId] === false ? true : false
      };

      await updateDoc(doc(db, 'Groups', group.docId), {
        sessionVisibility: newVisibility
      });
      
      const action = newVisibility[sessionId] === false ? 'hidden' : 'revealed';
      showToast(`${group.groupName} ${action} for this session`, 'success');
    } catch (error) {
      console.error('Error toggling visibility:', error);
      showToast('Error updating group visibility', 'error');
    }
  };

  const getFilteredGroups = () => {
    return groups.filter((group) => {
      const visibilityCheck = userIsDM ? true : !group.hiddenInCurrentSession;
      
      return (
        visibilityCheck &&
        (!searchTerm || 
         group.groupName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
         group.abbreviation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         group.overview?.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         group.motto?.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (!typeFilter || group.primaryType === typeFilter) &&
        (!statusFilter || group.currentSessionStatus === statusFilter) &&
        (!relationFilter || group.currentSessionRelationship === relationFilter)
      );
    });
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setTypeFilter('');
    setStatusFilter('');
    setRelationFilter('');
    showToast('All filters cleared');
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (searchTerm !== '') count++;
    if (typeFilter !== '') count++;
    if (statusFilter !== '') count++;
    if (relationFilter !== '') count++;
    return count;
  };

  const getUniqueTypes = () => {
    return [...new Set(groups.map(g => g.primaryType).filter(Boolean))].sort();
  };

  const getUniqueStatuses = () => {
    return ['Active', 'Disbanded', 'Unknown', 'Destroyed'];
  };

  if (localStorage.getItem("loggedIn") === 'false') {
    return <NotLoggedIn />;
  }

  const FilterChip = ({ label, onDelete }) => (
    <div className="inline-flex items-center space-x-2 bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full text-sm border border-amber-500/30">
      <span>{label}</span>
      <button onClick={onDelete} className="text-amber-400 hover:text-amber-200 transition-colors">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
        </svg>
      </button>
    </div>
  );

  const DisplayGroups = () => {
    const filteredGroups = getFilteredGroups();

    if (filteredGroups.length === 0) {
      return (
        <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-12 text-center">
          <svg className="w-16 h-16 text-gray-500 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path>
          </svg>
          <h3 className="text-xl font-semibold text-white mb-2">No groups found</h3>
          <p className="text-gray-400 mb-4">Try adjusting your search criteria</p>
          {getActiveFilterCount() > 0 && (
            <button
              onClick={clearAllFilters}
              className="bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
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
            <svg className="w-6 h-6 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path>
            </svg>
            <h2 className="text-xl font-bold text-white">
              Found {filteredGroups.length} group{filteredGroups.length !== 1 ? 's' : ''}
            </h2>
          </div>
          <span className="bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full text-sm font-bold">
            {groups.length} total
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredGroups.map((group) => (
            <div key={group.docId} className="bg-black/20 backdrop-blur-lg rounded-xl border border-white/10 p-1 hover:bg-black/30 transition-all duration-300">
              <GroupCard 
                group={group}
                onShowDetails={setActiveGroup}
                onToggleVisibility={toggleGroupVisibility}
                userIsDM={userIsDM}
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  const FilterSection = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Group Type</label>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
          >
            <option value="" className="bg-gray-800">All Types</option>
            {getUniqueTypes().map(type => (
              <option key={type} value={type} className="bg-gray-800">{type}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
          >
            <option value="" className="bg-gray-800">Any Status</option>
            {getUniqueStatuses().map(status => (
              <option key={status} value={status} className="bg-gray-800">{status}</option>
            ))}
          </select>
        </div>

        {userIsDM && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Relationship</label>
            <select
              value={relationFilter}
              onChange={(e) => setRelationFilter(e.target.value)}
              className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
            >
              <option value="" className="bg-gray-800">Any Relationship</option>
              <option value="Allied" className="bg-gray-800">Allied</option>
              <option value="Friendly" className="bg-gray-800">Friendly</option>
              <option value="Neutral" className="bg-gray-800">Neutral</option>
              <option value="Hostile" className="bg-gray-800">Hostile</option>
              <option value="Unknown" className="bg-gray-800">Unknown</option>
            </select>
          </div>
        )}

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
          {typeFilter && <FilterChip label={`Type: ${typeFilter}`} onDelete={() => setTypeFilter('')} />}
          {statusFilter && <FilterChip label={`Status: ${statusFilter}`} onDelete={() => setStatusFilter('')} />}
          {relationFilter && <FilterChip label={`Relation: ${relationFilter}`} onDelete={() => setRelationFilter('')} />}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-amber-900 to-yellow-900">
      <div className="w-full px-4 py-6 space-y-6">
        
        <div className="bg-gradient-to-r from-amber-900/50 to-yellow-900/50 backdrop-blur-lg rounded-2xl border border-white/10 p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-xl flex items-center justify-center">
                <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path>
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Groups & Factions</h1>
                <p className="text-amber-300">Track organizations, alliances, and power structures</p>
              </div>
            </div>
            
            <button 
              onClick={uploadGroupData}
              className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"></path>
              </svg>
              <span>Upload Groups</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-12">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-400 mb-4"></div>
              <h3 className="text-xl font-semibold text-white mb-2">Loading groups...</h3>
              <p className="text-gray-400">Please wait</p>
            </div>
          </div>
        ) : groups.length > 0 ? (
          <>
            <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 overflow-hidden">
              <div className="bg-gradient-to-r from-amber-600/20 to-yellow-600/20 p-4 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <svg className="w-6 h-6 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path>
                    </svg>
                    <h2 className="text-xl font-bold text-white">Search & Filter</h2>
                    {getActiveFilterCount() > 0 && (
                      <span className="bg-amber-500/30 text-amber-300 px-2 py-1 rounded-full text-xs font-bold">
                        {getActiveFilterCount()} active
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full text-sm font-bold">
                      {getFilteredGroups().length} shown
                    </span>
                    <button 
                      onClick={() => setFiltersOpen(!filtersOpen)}
                      className="md:hidden bg-amber-600/20 hover:bg-amber-600/30 text-amber-400 p-2 rounded-lg transition-colors"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd"></path>
                      </svg>
                    </button>
                  </div>
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
                    placeholder="Search by name, abbreviation, motto, or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white/5 border border-white/20 rounded-xl pl-12 pr-12 py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all text-lg"
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

            <DisplayGroups />
          </>
        ) : (
          <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-12">
            <div className="flex flex-col items-center justify-center text-center">
              <svg className="w-16 h-16 text-gray-500 mb-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path>
              </svg>
              <h3 className="text-xl font-semibold text-white mb-2">No groups available</h3>
              <p className="text-gray-400">Upload some groups to get started</p>
            </div>
          </div>
        )}

        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          className="md:hidden fixed bottom-6 right-6 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 transform hover:scale-110 z-40"
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

      <Toast 
        message={toast.message}
        severity={toast.severity} 
        isOpen={toast.open} 
        onClose={hideToast} 
      />

      {activeGroup && (
        <GroupDetailsModal 
          group={activeGroup} 
          onClose={() => setActiveGroup(null)} 
          userIsDM={userIsDM}
          sessionId={sessionId}
        />
      )}
    </div>
  );
}

// Group Details Modal Component
const GroupDetailsModal = ({ group, onClose, userIsDM, sessionId }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedCategories, setExpandedCategories] = useState({
    Allied: false,
    Friendly: false,
    Neutral: false,
    Tense: false,
    Hostile: false,
    Unknown: false
  });

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Basic Info */}
      <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
        <h3 className="text-xl font-bold text-amber-400 mb-4">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className="text-gray-400 text-sm">Full Name:</span>
            <p className="text-white font-medium">{group.groupName}</p>
          </div>
          <div>
            <span className="text-gray-400 text-sm">Abbreviation:</span>
            <p className="text-white font-medium">{group.abbreviation || 'N/A'}</p>
          </div>
          <div>
            <span className="text-gray-400 text-sm">Primary Type:</span>
            <p className="text-white font-medium">{group.primaryType || 'N/A'}</p>
          </div>
          <div>
            <span className="text-gray-400 text-sm">Founded:</span>
            <p className="text-white font-medium">{group.overview?.foundingYear || 'Unknown'}</p>
          </div>
        </div>
        {group.motto && (
          <div className="mt-4 pt-4 border-t border-slate-700">
            <span className="text-gray-400 text-sm">Motto:</span>
            <p className="text-amber-300 italic font-medium">"{group.motto}"</p>
          </div>
        )}
        {group.overview?.formerNames && group.overview.formerNames.length > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-700">
            <span className="text-gray-400 text-sm">Former Names:</span>
            <p className="text-white font-medium">{group.overview.formerNames.join(', ')}</p>
          </div>
        )}
      </div>

      {/* Description */}
      {group.overview?.description && (
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
          <h3 className="text-xl font-bold text-amber-400 mb-4">Description</h3>
          <p className="text-gray-300 leading-relaxed">{group.overview.description}</p>
        </div>
      )}

      {/* Metrics */}
      {group.metrics && (
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
          <h3 className="text-xl font-bold text-amber-400 mb-4">Metrics</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center bg-slate-900/50 rounded-lg p-4">
              <div className="text-3xl font-bold text-blue-400">{group.metrics.influence}/10</div>
              <div className="text-sm text-gray-400 mt-1">Influence</div>
            </div>
            <div className="text-center bg-slate-900/50 rounded-lg p-4">
              <div className="text-3xl font-bold text-red-400">{group.metrics.hostility}/10</div>
              <div className="text-sm text-gray-400 mt-1">Hostility</div>
            </div>
            <div className="text-center bg-slate-900/50 rounded-lg p-4">
              <div className="text-3xl font-bold text-green-400">{group.metrics.organization}/10</div>
              <div className="text-sm text-gray-400 mt-1">Organization</div>
            </div>
          </div>
        </div>
      )}

      {/* Population */}
      {group.overview && (group.overview.estimatedMembers !== undefined || group.overview.estimatedCivilians !== undefined) && (
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
          <h3 className="text-xl font-bold text-amber-400 mb-4">Population</h3>
          <div className="grid grid-cols-2 gap-4">
            {group.overview.estimatedMembers !== undefined && (
              <div className="bg-slate-900/50 rounded-lg p-4">
                <span className="text-gray-400 text-sm">Members:</span>
                <p className="text-white font-bold text-2xl">{group.overview.estimatedMembers.toLocaleString()}</p>
              </div>
            )}
            {group.overview.estimatedCivilians !== undefined && (
              <div className="bg-slate-900/50 rounded-lg p-4">
                <span className="text-gray-400 text-sm">Civilians:</span>
                <p className="text-white font-bold text-2xl">{group.overview.estimatedCivilians.toLocaleString()}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Notable Achievements */}
      {group.overview?.notableAchievements && group.overview.notableAchievements.length > 0 && (
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
          <h3 className="text-xl font-bold text-amber-400 mb-4">Notable Achievements</h3>
          <ul className="space-y-2">
            {group.overview.notableAchievements.map((achievement, idx) => (
              <li key={idx} className="flex items-start gap-2 bg-slate-900/50 rounded-lg p-3">
                <span className="text-amber-400 mt-1 text-xl">🏆</span>
                <span className="text-gray-300 flex-1">{achievement}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  const renderStructure = () => (
    <div className="space-y-6">
      {/* Leadership */}
      {group.leadership?.structure && (
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
          <h3 className="text-xl font-bold text-amber-400 mb-4">Leadership Structure</h3>
          <div className="space-y-4">
            {group.leadership.structure.map((level, idx) => (
              <div key={idx} className="border-l-4 border-amber-500 pl-4 py-2 bg-slate-900/30 rounded-r-lg">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="text-lg font-bold text-white">{level.position}</h4>
                  <span className="text-sm text-gray-400 bg-slate-700 px-2 py-1 rounded">
                    {typeof level.count === 'number' ? `${level.count} position${level.count !== 1 ? 's' : ''}` : level.count}
                  </span>
                </div>
                <p className="text-gray-300 text-sm mb-2">{level.description}</p>
                {level.responsibilities && level.responsibilities.length > 0 && (
                  <div className="mt-2">
                    <span className="text-xs text-gray-400 font-bold">Responsibilities:</span>
                    <ul className="list-disc list-inside text-sm text-gray-300 ml-2 mt-1">
                      {level.responsibilities.map((resp, ridx) => (
                        <li key={ridx}>{resp}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {level.powers && level.powers.length > 0 && (
                  <div className="mt-2">
                    <span className="text-xs text-gray-400 font-bold">Powers:</span>
                    <ul className="list-disc list-inside text-sm text-gray-300 ml-2 mt-1">
                      {level.powers.map((power, pidx) => (
                        <li key={pidx}>{power}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {level.limitations && (
                  <div className="mt-2 text-sm bg-amber-900/20 border border-amber-500/30 rounded p-2">
                    <span className="text-amber-400 font-bold">⚠ Limitations:</span>
                    <span className="text-amber-300 ml-2">{level.limitations}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Departments & Teams */}
      {group.groupStructure?.departments && (
        <div className="space-y-4">
          {group.groupStructure.departments.map((dept, idx) => (
            <div key={idx} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
              <div className="mb-4 pb-4 border-b border-slate-600">
                <h3 className="text-xl font-bold text-amber-400">{dept.name}</h3>
                <p className="text-gray-400 text-sm mt-1">{dept.purpose}</p>
              </div>
              <div className="space-y-3">
                {dept.teams && dept.teams.map((team, tidx) => (
                  <div key={tidx} className="bg-slate-900/50 rounded-lg p-4 border border-slate-600 hover:border-amber-500/30 transition-all">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-white font-bold">{team.designation}</h4>
                          <span className="text-amber-400">•</span>
                          <h4 className="text-white font-bold">{team.name}</h4>
                        </div>
                        <p className="text-amber-300 text-sm">{team.specialization}</p>
                      </div>
                      <span className="text-white font-bold bg-amber-500/20 px-3 py-1 rounded-full text-sm border border-amber-500/50 whitespace-nowrap ml-2">
                        {typeof team.memberCount === 'number' ? team.memberCount.toLocaleString() : team.memberCount} {typeof team.memberCount === 'number' && 'members'}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed">{team.description}</p>
                    {team.additionalDuties && team.additionalDuties.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-slate-700">
                        <span className="text-xs text-gray-400 font-bold">Additional Duties:</span>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {team.additionalDuties.map((duty, didx) => (
                            <span key={didx} className="text-xs bg-slate-700 text-gray-300 px-2 py-1 rounded">
                              {duty}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderRelations = () => {
    const toggleCategory = (category) => {
      setExpandedCategories(prev => ({
        ...prev,
        [category]: !prev[category]
      }));
    };

    if (!group.relations || group.relations.length === 0) {
      return (
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 text-center">
          <p className="text-gray-400">No relations recorded</p>
        </div>
      );
    }

    // Categorize relations by status
    const categorized = {
      Allied: [],
      Friendly: [],
      Neutral: [],
      Tense: [],
      Hostile: [],
      Unknown: []
    };

    group.relations.forEach(relation => {
      const status = relation.status || 'Unknown';
      if (categorized[status]) {
        categorized[status].push(relation);
      } else {
        categorized.Unknown.push(relation);
      }
    });

    const getStatusColor = (status) => {
      switch(status) {
        case 'Allied': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50';
        case 'Friendly': return 'bg-blue-500/20 text-blue-300 border-blue-500/50';
        case 'Neutral': return 'bg-gray-500/20 text-gray-300 border-gray-500/50';
        case 'Tense': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50';
        case 'Hostile': return 'bg-red-500/20 text-red-300 border-red-500/50';
        case 'Unknown': return 'bg-purple-500/20 text-purple-300 border-purple-500/50';
        default: return 'bg-gray-500/20 text-gray-300 border-gray-500/50';
      }
    };

    const getCategoryIcon = (status) => {
      switch(status) {
        case 'Allied': return '🤝';
        case 'Friendly': return '👋';
        case 'Neutral': return '⚖️';
        case 'Tense': return '⚠️';
        case 'Hostile': return '⚔️';
        case 'Unknown': return '❓';
        default: return '•';
      }
    };

    const getCategoryDescription = (status) => {
      switch(status) {
        case 'Allied': return 'Formal alliances with mutual defense and deep cooperation';
        case 'Friendly': return 'Positive relations with regular cooperation';
        case 'Neutral': return 'No formal ties, may cooperate on specific issues';
        case 'Tense': return 'Strained relations with distrust and avoidance';
        case 'Hostile': return 'Active conflict with aggression on sight';
        case 'Unknown': return 'No contact or insufficient information';
        default: return '';
      }
    };

    return (
      <div className="space-y-4">
        {Object.entries(categorized).map(([status, relations]) => {
          if (relations.length === 0) return null;

          const isExpanded = expandedCategories[status];

          return (
            <div key={status} className="space-y-3">
              {/* Category Header - Clickable */}
              <button
                onClick={() => toggleCategory(status)}
                className={`w-full ${getStatusColor(status)} rounded-xl p-4 border-2 hover:opacity-80 transition-all`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getCategoryIcon(status)}</span>
                  <div className="flex-1 text-left">
                    <h3 className="text-lg font-bold">{status}</h3>
                    <p className="text-sm opacity-80">{getCategoryDescription(status)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold bg-black/20 px-3 py-1 rounded-full">
                      {relations.length}
                    </span>
                    <svg 
                      className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                </div>
              </button>

              {/* Relations in this category - Collapsible */}
              {isExpanded && (
                <div className="space-y-3 pl-4 animate-fadeIn">
                  {relations.map((relation, idx) => (
                    <div key={idx} className="bg-slate-800/50 rounded-xl p-5 border border-slate-700 hover:border-slate-600 transition-all">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="text-lg font-bold text-white">{relation.groupName}</h4>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(status)}`}>
                          {status}
                        </span>
                      </div>
                      <p className="text-gray-300 leading-relaxed text-sm">{relation.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderSettlements = () => (
    <div className="space-y-4">
      {group.settlements && group.settlements.length > 0 ? (
        group.settlements.map((settlement, idx) => (
          <div key={idx} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">{settlement.name}</h3>
                <p className="text-amber-300 text-sm flex items-center gap-1">
                  <span>📍</span>
                  {settlement.location}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-bold border ${
                settlement.status === 'Active' || settlement.status?.includes('Active') ? 'bg-green-500/20 text-green-300 border-green-500/50' :
                settlement.status === 'Abandoned' ? 'bg-gray-500/20 text-gray-300 border-gray-500/50' :
                'bg-yellow-500/20 text-yellow-300 border-yellow-500/50'
              }`}>
                {settlement.status}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {settlement.founded && (
                <div className="bg-slate-900/50 rounded-lg p-3">
                  <span className="text-gray-400 text-xs">Founded:</span>
                  <p className="text-white font-bold">{settlement.founded}</p>
                </div>
              )}
              {settlement.area && (
                <div className="bg-slate-900/50 rounded-lg p-3">
                  <span className="text-gray-400 text-xs">Area:</span>
                  <p className="text-white font-bold">{settlement.area}</p>
                </div>
              )}
            </div>

            {settlement.population && (
              <div className="mb-4 bg-slate-900/50 rounded-lg p-4">
                <span className="text-gray-400 text-sm font-bold mb-2 block">Population:</span>
                <div className="grid grid-cols-3 gap-3">
                  {settlement.population.personnel !== undefined && (
                    <div>
                      <p className="text-xs text-gray-400">Personnel</p>
                      <p className="text-white font-bold text-lg">{settlement.population.personnel.toLocaleString()}</p>
                    </div>
                  )}
                  {settlement.population.wanderers !== undefined && (
                    <div>
                      <p className="text-xs text-gray-400">Wanderers</p>
                      <p className="text-white font-bold text-lg">{settlement.population.wanderers.toLocaleString()}</p>
                    </div>
                  )}
                  {settlement.population.formerTotal !== undefined && (
                    <div>
                      <p className="text-xs text-gray-400">Former Total</p>
                      <p className="text-gray-400 font-bold text-lg">{settlement.population.formerTotal.toLocaleString()}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {settlement.purpose && (
              <div className="mb-4">
                <span className="text-gray-400 text-sm font-bold block mb-2">Purpose:</span>
                {Array.isArray(settlement.purpose) ? (
                  <div className="flex flex-wrap gap-2">
                    {settlement.purpose.map((p, pidx) => (
                      <span key={pidx} className="bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full text-sm border border-amber-500/30">
                        {p}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-white">{settlement.purpose}</p>
                )}
              </div>
            )}

            {settlement.history && (
              <div className="pt-4 border-t border-slate-700">
                <span className="text-gray-400 text-sm font-bold block mb-2">History:</span>
                <p className="text-gray-300 text-sm leading-relaxed">{settlement.history}</p>
              </div>
            )}

            {settlement.notes && (
              <div className="pt-4 border-t border-slate-700 mt-4">
                <span className="text-gray-400 text-sm font-bold block mb-2">Notes:</span>
                <p className="text-gray-300 text-sm leading-relaxed">{settlement.notes}</p>
              </div>
            )}
          </div>
        ))
      ) : (
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 text-center">
          <p className="text-gray-400">No settlements recorded</p>
        </div>
      )}
    </div>
  );

  const renderHistory = () => (
    <div className="space-y-4">
      {group.history && group.history.length > 0 ? (
        group.history.map((period, idx) => (
          <div key={idx} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-amber-400">{period.title}</h3>
              <p className="text-gray-400 text-sm mt-1">⏳ {period.period}</p>
            </div>
            <div className="space-y-4">
              {period.events.map((event, eidx) => (
                <div key={eidx} className="border-l-4 border-amber-500 pl-4 py-2 bg-slate-900/30 rounded-r-lg">
                  <div className="flex items-start gap-3 mb-2">
                    <span className="text-white font-bold bg-amber-500/20 px-3 py-1 rounded-full text-sm border border-amber-500/50 whitespace-nowrap">
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
        <div className="flex-shrink-0 bg-gradient-to-r from-amber-600/20 to-yellow-600/20 border-b border-white/10">
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-xl flex items-center justify-center text-2xl border border-white/30 shadow-lg">
                <span>🏛️</span>
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg md:text-xl font-bold text-white truncate">{group.groupName}</h2>
                <p className="text-amber-300 text-sm">{group.abbreviation} • {group.primaryType}</p>
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
              <TabButton active={activeTab === 'structure'} onClick={() => setActiveTab('structure')} icon="🏗️" label="Structure" />
              <TabButton active={activeTab === 'relations'} onClick={() => setActiveTab('relations')} icon="🤝" label="Relations" />
              <TabButton active={activeTab === 'settlements'} onClick={() => setActiveTab('settlements')} icon="🏰" label="Settlements" />
              <TabButton active={activeTab === 'history'} onClick={() => setActiveTab('history')} icon="📖" label="History" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'structure' && renderStructure()}
          {activeTab === 'relations' && renderRelations()}
          {activeTab === 'settlements' && renderSettlements()}
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
        ? 'bg-amber-500/30 text-amber-300 border-2 border-amber-500/50'
        : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
    }`}
  >
    <span className="mr-1">{icon}</span>
    {label}
  </button>
);