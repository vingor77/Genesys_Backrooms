import React, { useState, useEffect } from 'react';
import { collection, doc, onSnapshot, query, updateDoc, setDoc } from "firebase/firestore";
import db from '../Components/firebase';
import Quest from "../Components/quest";
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

// Sample quest data
const questsData = [{
    name: "The Missing Caravan",
    quest_type: "Side Quest",
    short_description: "Find the missing merchant caravan",
    description: "A merchant caravan traveling from Ironkeep to Silvermont has gone missing. The Merchant's Guild is offering a substantial reward for information about their whereabouts.",
    quest_giver: "Guild Master Theron",
    quest_giver_location: "Merchant's Guild Hall, Ironkeep",
    turn_in_npc: "Guild Master Theron",
    turn_in_location: "Merchant's Guild Hall, Ironkeep",
    difficulty: "Average",
    
    prerequisite_quests: [],
    required_items: [],
    required_reputation: null,
    
    rewards: {
      experience: { amount: 400, visible: true },
      currency: { amount: 200, visible: true },
      reputation: { text: "Merchant's Guild +50", visible: true },
      items: { list: ["Guild Seal"], visible: false },
      other: { text: "Basic guild standing", visible: false }
    },
    
    initial_objectives: [
      { description: "Investigate the last known location of the caravan", completed: false, optional: false },
      { description: "Follow the tracks into the Dark Forest", completed: false, optional: false },
      { description: "Locate the bandit camp", completed: false, optional: false }
    ],
    
    has_paths: true,
    turning_point: {
      trigger: "When you find the bandits holding the merchants captive",
      description: "You discover the 'bandits' are actually desperate farmers whose land was seized. The merchants' leader, Marcus, seems nervous when you mention recovering the goods.",
      decision_prompt: "How do you resolve this situation?"
    },
    
    paths: [
      {
        name: "Peaceful Resolution",
        short_description: "Negotiate peace between both parties",
        icon: "🤝",
        description: "You chose to mediate between the farmers and the guild. Through investigation, you discover Marcus's embezzlement scheme and broker a deal where the farmers return most goods in exchange for land rights.",
        
        objectives: [
          { description: "Investigate Marcus's ledgers for evidence", completed: false, optional: false },
          { description: "Negotiate terms with the farmer leader", completed: false, optional: false },
          { description: "Convince Marcus to confess to Guild Master Theron", completed: false, optional: false }
        ],
        
        rewards: {
          experience: { amount: 500, visible: true },
          currency: { amount: 250, visible: true },
          reputation: { text: "Merchant's Guild +75, Local Farmers +50", visible: true },
          items: { list: ["Guild Seal", "Diplomat's Badge", "Ledger of Evidence"], visible: false },
          other: { text: "Both guilds offer future cooperation, farmers become allies", visible: false }
        },
        
        turn_in_npc: "Guild Master Theron",
        turn_in_location: "Merchant's Guild Hall, Ironkeep",
        
        unlocks_quest: "The Corrupt Network",
        blocks_quest: null,
        
        path_notes: "Hardest path - requires investigation and social skills. Best long-term outcome.",
        consequences: "Both sides trust you. Marcus faces justice. Farmers get their land back."
      },
      
      {
        name: "Total Victory",
        short_description: "Fight the bandits and rescue the merchants",
        icon: "⚔️",
        description: "You chose to fight the farmers to rescue the merchants by force. You don't discover Marcus's corruption, and the farmers are defeated.",
        
        objectives: [
          { description: "Defeat the farmer militia", completed: false, optional: false },
          { description: "Rescue all captured merchants", completed: false, optional: false },
          { description: "Recover the stolen goods", completed: false, optional: true },
          { description: "Escort the caravan back to Ironkeep", completed: false, optional: false }
        ],
        
        rewards: {
          experience: { amount: 600, visible: true },
          currency: { amount: 300, visible: true },
          reputation: { text: "Merchant's Guild +100, Local Farmers -50", visible: true },
          items: { list: ["Guild Seal", "Hero's Medal", "Farmer Leader's Sword"], visible: false },
          other: { text: "Merchant's Guild offers elite contracts", visible: false }
        },
        
        turn_in_npc: "Guild Master Theron",
        turn_in_location: "Merchant's Guild Hall, Ironkeep",
        
        unlocks_quest: "Guild Champion",
        blocks_quest: "The Farmer's Rebellion",
        
        path_notes: "Combat-focused path. High rewards from guild but creates enemies. Marcus's corruption goes unnoticed.",
        consequences: "Guild loves you. Farmers hate you and may cause trouble later. Marcus continues embezzling."
      },
      
      {
        name: "Side with the Farmers",
        short_description: "Help the farmers expose Marcus's corruption",
        icon: "🌾",
        description: "You chose to help the desperate farmers. You discover Marcus staged the kidnapping to cover his embezzlement and help expose him to the Thieves' Guild instead.",
        
        objectives: [
          { description: "Gather evidence of Marcus's crimes", completed: false, optional: false },
          { description: "Help farmers secure the stolen goods as leverage", completed: false, optional: false },
          { description: "Contact the Thieves' Guild with evidence", completed: false, optional: false },
          { description: "Ensure farmers escape safely", completed: false, optional: false }
        ],
        
        rewards: {
          experience: { amount: 500, visible: true },
          currency: { amount: 200, visible: true },
          reputation: { text: "Thieves' Guild +100, Merchant's Guild -75, Local Farmers +100", visible: true },
          items: { list: ["Thieves' Mark", "Stolen Ledger", "Forged Land Deed", "Farmer's Gratitude Token"], visible: false },
          other: { text: "Access to Thieves' Guild black market, farmers will aid you in future", visible: false }
        },
        
        turn_in_npc: "Shadow Broker",
        turn_in_location: "Thieves' Guild Hideout (revealed after quest)",
        
        unlocks_quest: "The Underground Network",
        blocks_quest: "Guild Champion",
        
        path_notes: "Morally complex path. Side with the underdog. Opens criminal questline.",
        consequences: "Merchant's Guild blacklists you. Thieves' Guild embraces you. Farmers become loyal allies."
      },
      
      {
        name: "Take the Goods",
        short_description: "Betray everyone and keep the caravan goods",
        icon: "💰",
        description: "You chose to betray both sides, taking the valuable caravan goods for yourself and leaving both parties to fight it out.",
        
        objectives: [
          { description: "Eliminate witnesses from both sides", completed: false, optional: false },
          { description: "Secure the most valuable goods", completed: false, optional: false },
          { description: "Escape before reinforcements arrive", completed: false, optional: false },
          { description: "Fence the stolen goods", completed: false, optional: false }
        ],
        
        rewards: {
          experience: { amount: 400, visible: true },
          currency: { amount: 600, visible: true },
          reputation: { text: "Merchant's Guild -100, Local Farmers -50, Criminal Underworld +50", visible: true },
          items: { list: ["Stolen Merchant Goods", "Bloodstained Coin Purse", "Wanted Poster (You)"], visible: false },
          other: { text: "Hunted by guild. Must lay low. Can fence goods at criminal contacts.", visible: false }
        },
        
        turn_in_npc: "Black Market Fence",
        turn_in_location: "Seedy Tavern, Lower District",
        
        unlocks_quest: "Life on the Run",
        blocks_quest: "Guild Champion",
        
        path_notes: "Evil path. High immediate reward but severe long-term consequences. Both sides hunt you.",
        consequences: "You're now a wanted criminal. Both guild and farmers want you dead. Must operate in shadows."
      }
    ],
    
    can_fail: true,
    failure_conditions: "If all merchants and farmers die before reaching turning point",
    failure_consequences: "Quest fails, no rewards, lose reputation with both factions",
    has_choices: true,
    choice_descriptions: "Major branching paths available at turning point",
    
    quest_locations: ["Ironkeep - Merchant's Guild", "Trade Road - Last Known Position", "Dark Forest - Bandit Camp"],
    related_npcs: ["Guild Master Theron", "Marcus the Caravan Master", "Farmer Leader Dane"],
    
    lore_text: "The Merchant's Guild has been the backbone of trade in this region for centuries. Any disruption threatens the economic stability of multiple towns.",
    
    dm_notes: "This quest introduces the rivalry between Merchant's Guild and Thieves' Guild. The 'bandits' are actually desperate farmers whose land was seized by corrupt guild officials. Marcus is embezzling and staged his own kidnapping.",
    dm_secrets: "Marcus is embezzling from the guild. He staged his own kidnapping to cover missing funds. Evidence can be found in his personal ledger hidden in the caravan.",
    procedural_notes: "Scale enemy numbers based on party size and chosen path. Peaceful path requires Hard Negotiation checks. Combat path has 8-12 farmer militia + leader.",
    
    is_part_of_chain: false,
    
    tags: ["Investigation", "Moral Choice", "Guild Quest", "Combat", "Social"],
    quest_image_url: null,
    map_image_url: null
  },
  {
    name: "The Cursed Amulet",
    quest_type: "Main Quest",
    short_description: "Deal with a cursed artifact terrorizing the town",
    description: "A mysterious amulet has been causing nightmares and madness throughout the town. The local priest believes it must be dealt with, but its fate is uncertain.",
    quest_giver: "Father Benedict",
    quest_giver_location: "Holy Chapel, Silvermont",
    turn_in_npc: "Father Benedict",
    turn_in_location: "Holy Chapel, Silvermont",
    difficulty: "Hard",
    
    prerequisite_quests: ["Strange Omens"],
    required_items: [],
    required_reputation: null,
    
    rewards: {
      experience: { amount: 600, visible: true },
      currency: { amount: 350, visible: true },
      reputation: { text: "Church of Light +75", visible: true },
      items: { list: ["Holy Water (3 vials)"], visible: false },
      other: { text: "Church gratitude", visible: false }
    },
    
    initial_objectives: [
      { description: "Research the amulet's history in the Ancient Library", completed: false, optional: false },
      { description: "Gather ritual components (Holy Water, Silver Dust, Blessed Candles)", completed: false, optional: false },
      { description: "Confront the amulet in the Cursed Crypt at midnight", completed: false, optional: false }
    ],
    
    has_paths: true,
    turning_point: {
      trigger: "When you reach the amulet in the crypt at midnight",
      description: "The amulet pulses with dark energy, whispering promises of power. Father Benedict's ritual could cleanse it, but you could also destroy it completely... or claim its power for yourself.",
      decision_prompt: "What is the amulet's fate?"
    },
    
    paths: [
      {
        name: "Path of Cleansing",
        short_description: "Purify the amulet through sacred ritual",
        icon: "✨",
        description: "You chose to cleanse the amulet through Father Benedict's sacred ritual. The process is dangerous and requires great willpower, but it preserves the artifact's magical properties while removing the curse.",
        
        objectives: [
          { description: "Perform the cleansing ritual without breaking concentration", completed: false, optional: false },
          { description: "Resist the curse's mental assault (3 Discipline checks)", completed: false, optional: false },
          { description: "Complete the final benediction", completed: false, optional: false },
          { description: "Return the cleansed amulet to Father Benedict", completed: false, optional: false }
        ],
        
        rewards: {
          experience: { amount: 800, visible: true },
          currency: { amount: 400, visible: true },
          reputation: { text: "Church of Light +100", visible: true },
          items: { list: ["Blessed Amulet (Cleansed - Grants +1 to Discipline)", "Holy Water (5 vials)", "Blessing of Protection"], visible: false },
          other: { text: "Church provides healing services at half cost. You may keep the cleansed amulet.", visible: false }
        },
        
        turn_in_npc: "Father Benedict",
        turn_in_location: "Holy Chapel, Silvermont",
        
        unlocks_quest: "The Light's Champion",
        blocks_quest: "Shadow's Embrace",
        
        path_notes: "Balanced path. Medium difficulty with skill checks. Keep the amulet's power. Church rewards.",
        consequences: "Church trusts you deeply. Shadow cultists view you as an enemy. Amulet power reduced but safe."
      },
      
      {
        name: "Path of Destruction",
        short_description: "Shatter the amulet and end the curse forever",
        icon: "💥",
        description: "You chose to destroy the cursed amulet completely in holy fire. It's the safest option that guarantees the curse can never return, though the amulet's power is lost forever.",
        
        objectives: [
          { description: "Prepare the holy pyre with Father Benedict", completed: false, optional: false },
          { description: "Shatter the amulet in the blessed flames", completed: false, optional: false },
          { description: "Contain the curse's final death throes", completed: false, optional: false },
          { description: "Consecrate the crypt to prevent future corruption", completed: false, optional: false }
        ],
        
        rewards: {
          experience: { amount: 700, visible: true },
          currency: { amount: 500, visible: true },
          reputation: { text: "Church of Light +150", visible: true },
          items: { list: ["Holy Water (10 vials)", "Church Commendation Medal", "Divine Blessing Token (Single-use: Auto-pass one check)"], visible: false },
          other: { text: "Church provides ALL services for free permanently. Hero status in Silvermont.", visible: false }
        },
        
        turn_in_npc: "Father Benedict",
        turn_in_location: "Holy Chapel, Silvermont",
        
        unlocks_quest: "The Church's Defender",
        blocks_quest: "Shadow's Embrace",
        
        path_notes: "Safe path. Easiest difficulty. Maximum Church favor. No amulet power.",
        consequences: "Church views you as a champion of light. Town celebrates you. Amulet power lost forever."
      },
      
      {
        name: "Path of Darkness",
        short_description: "Embrace the curse and seize its power",
        icon: "🌑",
        description: "You chose to embrace the amulet's curse and claim its dark power for yourself. The whispers promise you strength beyond measure, but Father Benedict will try to stop you.",
        
        objectives: [
          { description: "Bond with the cursed amulet (Willpower check)", completed: false, optional: false },
          { description: "Survive the curse's overwhelming mental assault", completed: false, optional: false },
          { description: "Defeat or escape from Father Benedict", completed: false, optional: false },
          { description: "Flee the chapel and find the Shadow Cult contact", completed: false, optional: false }
        ],
        
        rewards: {
          experience: { amount: 900, visible: true },
          currency: { amount: 300, visible: true },
          reputation: { text: "Church of Light -150, Shadow Cults +100", visible: true },
          items: { list: ["Cursed Amulet (Full Power - Grants +2 to all Dark magic, +1 Willpower, suffer 2 strain per day)", "Dark Grimoire", "Shadow Cloak (Grants 2 boost to Stealth)"], visible: false },
          other: { text: "Access to forbidden shadow magic. Hunted by the Church. Shadow cultists aid you.", visible: false }
        },
        
        turn_in_npc: "Veiled Prophet",
        turn_in_location: "Shadow Cult Hideout (revealed after escaping chapel)",
        
        unlocks_quest: "Shadow's Embrace",
        blocks_quest: "The Light's Champion",
        
        path_notes: "Evil path. Hardest difficulty with combat. Powerful dark rewards. Major consequences.",
        consequences: "Church hunts you. Town fears you. Shadow cultists embrace you. You gain immense dark power but at a cost."
      }
    ],
    
    can_fail: true,
    failure_conditions: "If the ritual is interrupted or you die during the confrontation",
    failure_consequences: "Amulet's curse spreads to entire town. Silvermont becomes corrupted. Quest chain fails.",
    has_choices: true,
    choice_descriptions: "Critical choice determines amulet's fate and your allegiance",
    
    quest_locations: ["Silvermont - Holy Chapel", "Ancient Library", "Cursed Crypt"],
    related_npcs: ["Father Benedict", "Scholar Elise", "The Cursed Spirit", "Veiled Prophet"],
    
    lore_text: "The amulet was created centuries ago by the sorcerer-king Malachar as a repository for a fragment of the Shadow King's essence. It has caused suffering and madness wherever it appears throughout history.",
    
    dm_notes: "KEY MAIN QUEST. This choice defines player alignment for rest of campaign. The amulet contains a fragment of the Shadow King's power. Cleansing it weakens him. Destroying it removes his influence. Embracing it strengthens him and corrupts the player.",
    dm_secrets: "The amulet is intelligent and will tempt players with visions of power. It shows them their deepest desires. Father Benedict suspects this but doesn't know for certain. If players embrace it, Benedict will try to stop them (use as boss fight).",
    procedural_notes: "Cleansing path requires 3 Hard Discipline checks. Destruction path requires 1 Average check. Darkness path requires 1 Daunting Willpower check + combat with Father Benedict (use People of Interest stats).",
    
    is_part_of_chain: true,
    chain_name: "The Shadow King",
    chain_position: 2,
    chain_total: 5,
    previous_quest: "Strange Omens",
    next_quest: "Path-dependent: Either 'The Light's Champion', 'The Church's Defender', or 'Shadow's Embrace'",
    
    tags: ["Main Quest", "Magic", "Horror", "Investigation", "Chain", "Alignment"],
    quest_image_url: null,
    map_image_url: null
  },
  {
    name: "Goblin Bounty",
    quest_type: "Bounty",
    short_description: "Clear out a goblin camp threatening travelers",
    description: "A gang of goblins has been raiding travelers on the eastern road. The town guard is offering a bounty for clearing out their camp.",
    quest_giver: "Captain Mara",
    quest_giver_location: "Town Guard Barracks",
    turn_in_npc: "Captain Mara",
    turn_in_location: "Town Guard Barracks",
    difficulty: "Easy",
    
    prerequisite_quests: [],
    required_items: [],
    required_reputation: null,
    
    rewards: {
      experience: { amount: 250, visible: true },
      currency: { amount: 125, visible: true },
      reputation: { text: "Town Guard +20", visible: true },
      items: { list: ["Basic Bounty Token"], visible: true },
      other: { text: null, visible: false }
    },
    
    initial_objectives: [
      { description: "Track the goblins to their camp", completed: false, optional: false },
      { description: "Scout the camp and assess their strength", completed: false, optional: false },
      { description: "Approach the goblin camp", completed: false, optional: false }
    ],
    
    has_paths: true,
    turning_point: {
      trigger: "When you reach the goblin camp",
      description: "The goblins seem poorly armed and disorganized. Their chieftain appears to be desperately trying to keep them fed. You find evidence someone has been supplying them with stolen goods.",
      decision_prompt: "How do you handle the goblins?"
    },
    
    paths: [
      {
        name: "Exterminate the Goblins",
        short_description: "Kill all goblins and claim the bounty",
        icon: "⚔️",
        description: "You chose to eliminate the goblin threat completely as requested by the town guard.",
        
        objectives: [
          { description: "Defeat the goblin warriors", completed: false, optional: false },
          { description: "Kill the goblin chieftain", completed: false, optional: false },
          { description: "Recover stolen goods", completed: false, optional: true },
          { description: "Return to Captain Mara for reward", completed: false, optional: false }
        ],
        
        rewards: {
          experience: { amount: 300, visible: true },
          currency: { amount: 150, visible: true },
          reputation: { text: "Town Guard +25", visible: true },
          items: { list: ["Goblin Chieftain's Blade", "Recovered Merchant Goods"], visible: true },
          other: { text: null, visible: false }
        },
        
        turn_in_npc: "Captain Mara",
        turn_in_location: "Town Guard Barracks",
        
        unlocks_quest: null,
        blocks_quest: null,
        
        path_notes: "Straightforward combat. Standard rewards. Simple completion.",
        consequences: "Goblins eliminated. Travelers safe. Quest complete."
      },
      
      {
        name: "Negotiate Relocation",
        short_description: "Convince goblins to leave peacefully",
        icon: "🤝",
        description: "You chose to negotiate with the goblins, convincing them to relocate to a safer area away from the trade routes.",
        
        objectives: [
          { description: "Speak with the goblin chieftain", completed: false, optional: false },
          { description: "Find evidence of who's supplying the goblins", completed: false, optional: false },
          { description: "Help goblins relocate to the Wastes", completed: false, optional: false },
          { description: "Report successful resolution to Captain Mara", completed: false, optional: false }
        ],
        
        rewards: {
          experience: { amount: 350, visible: true },
          currency: { amount: 100, visible: true },
          reputation: { text: "Town Guard +15, Goblin Tribes +50", visible: true },
          items: { list: ["Peace Treaty Token", "Goblin-made Trinket"], visible: true },
          other: { text: "Goblins remember your mercy and may aid you later", visible: false }
        },
        
        turn_in_npc: "Captain Mara",
        turn_in_location: "Town Guard Barracks",
        
        unlocks_quest: "The Goblin Debt",
        blocks_quest: null,
        
        path_notes: "Social/investigation path. Lower immediate reward. Goblin allies gained.",
        consequences: "Goblins relocate peacefully. They owe you a debt. You discover someone was manipulating them."
      }
    ],
    
    can_fail: false,
    failure_conditions: null,
    failure_consequences: null,
    has_choices: true,
    choice_descriptions: "Choose between violence or diplomacy",
    
    quest_locations: ["Eastern Road", "Goblin Camp"],
    related_npcs: ["Captain Mara", "Goblin Chieftain Snaggletooth"],
    
    lore_text: "Goblins are common nuisances in this region, but this gang is unusually organized and seems to be following orders.",
    
    dm_notes: "Simple bounty quest with a twist. Goblins are pawns being used by a larger villain. Can be pure combat or introduce moral complexity.",
    dm_secrets: "The goblins were hired by a corrupt merchant to raid specific caravans. Evidence is in the chieftain's tent - a contract with a wax seal. This ties to a larger conspiracy if players investigate.",
    procedural_notes: "Scale goblin numbers: 4-6 minions + 1 rival chieftain for small party. 8-10 minions + chieftain for large party. Negotiation path requires Average Negotiation or Charm check.",
    
    is_part_of_chain: false,
    
    tags: ["Bounty", "Combat", "Goblins", "Simple", "Choice"],
    quest_image_url: null,
    map_image_url: null
  }
];

export default function Quests() {
  const [quests, setQuests] = useState([]);
  const [name, setName] = useState('');
  const [questTypeFilter, setQuestTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');
  const [chainFilter, setChainFilter] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const [activeQuest, setActiveQuest] = useState(null);
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

    const q = query(collection(db, 'Quests'));

    const unsub = onSnapshot(q, (querySnapshot) => {
      const queryData = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const sessionStatus = data.sessionProgress?.[sessionId] || {};
        const sessionVisibility = data.sessionVisibility || {};
        
        queryData.push({ 
          docId: doc.id, 
          ...data,
          currentSessionStatus: sessionStatus.status || 'Available',
          currentCompletedObjectives: sessionStatus.completed_objectives || [],
          hiddenInCurrentSession: sessionVisibility[sessionId] === false
        });
      });
      
      queryData.sort((a, b) => a.name.localeCompare(b.name));
      
      setQuests(queryData);
      setLoading(false);
    }, (error) => {
      console.error('Error loading quests:', error);
      showToast('Error loading quests', 'error');
      setLoading(false);
    });

    return () => { unsub(); };
  };

  const uploadQuestData = async () => {
    if (!userIsDM) {
      showToast('Only DMs can upload quest data', 'error');
      return;
    }

    const confirmUpload = window.confirm(
      `This will add ${questsData.length} quests to the global database. Continue?`
    );

    if (!confirmUpload) return;

    try {
      for (let i = 0; i < questsData.length; i++) {
        await setDoc(doc(db, 'Quests', questsData[i].name), {
          ...questsData[i],
          sessionVisibility: {},
          sessionProgress: {},
          sessionRewardVisibility: {}
        });
      }
      
      showToast(`Successfully added ${questsData.length} quests!`, 'success');
    } catch (error) {
      showToast('Error uploading quest data', 'error');
      console.error('Upload error:', error);
    }
  };

  const getFilteredQuests = () => {
    return quests.filter((quest) => {
      const visibilityCheck = userIsDM ? true : !quest.hiddenInCurrentSession;
      const statusCheck = !statusFilter || quest.currentSessionStatus === statusFilter;
      
      return (
        visibilityCheck &&
        statusCheck &&
        (!name || quest.name.toUpperCase().includes(name.toUpperCase()) || 
         (quest.description && quest.description.toUpperCase().includes(name.toUpperCase()))) &&
        (!questTypeFilter || quest.quest_type === questTypeFilter) &&
        (!difficultyFilter || quest.difficulty === difficultyFilter) &&
        (!chainFilter || (quest.is_part_of_chain && quest.chain_name === chainFilter))
      );
    });
  };

  const updateQuestStatus = async (quest, newStatus) => {
    if (!userIsDM || !sessionId) return;
    
    try {
      const currentProgress = quest.sessionProgress || {};
      const updatedProgress = {
        ...currentProgress,
        [sessionId]: {
          ...(currentProgress[sessionId] || {}),
          status: newStatus,
          last_updated: new Date().toISOString()
        }
      };

      await updateDoc(doc(db, 'Quests', quest.docId), {
        sessionProgress: updatedProgress
      });
      
      showToast(`${quest.name} marked as ${newStatus}`, 'success');
    } catch (error) {
      console.error('Error updating status:', error);
      showToast('Error updating quest status', 'error');
    }
  };

  const toggleQuestVisibility = async (quest) => {
    if (!userIsDM || !sessionId) return;
    
    try {
      const currentVisibility = quest.sessionVisibility || {};
      const newVisibility = {
        ...currentVisibility,
        [sessionId]: currentVisibility[sessionId] === false ? true : false
      };

      await updateDoc(doc(db, 'Quests', quest.docId), {
        sessionVisibility: newVisibility
      });
      
      const action = newVisibility[sessionId] === false ? 'hidden' : 'revealed';
      showToast(`${quest.name} ${action} for this session`, 'success');
    } catch (error) {
      console.error('Error toggling visibility:', error);
      showToast('Error updating quest visibility', 'error');
    }
  };

  const toggleRewardVisibility = async (quest, rewardType) => {
    if (!userIsDM || !sessionId) return;

    try {
      const currentRewardVis = quest.sessionRewardVisibility || {};
      const sessionRewardVis = currentRewardVis[sessionId] || {};
      const visKey = `${rewardType}_visible`;

      const newVisibility = !sessionRewardVis[visKey];

      const updatedRewardVis = {
        ...currentRewardVis,
        [sessionId]: {
          ...sessionRewardVis,
          [visKey]: newVisibility
        }
      };

      await updateDoc(doc(db, 'Quests', quest.docId), {
        sessionRewardVisibility: updatedRewardVis
      });

      showToast(`${rewardType} visibility updated`, 'success');
    } catch (error) {
      console.error('Error toggling reward visibility:', error);
      showToast('Error updating reward visibility', 'error');
    }
  };

  const clearAllFilters = () => {
    setName('');
    setQuestTypeFilter('');
    setStatusFilter('');
    setDifficultyFilter('');
    setChainFilter('');
    showToast('All filters cleared');
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (name !== '') count++;
    if (questTypeFilter !== '') count++;
    if (statusFilter !== '') count++;
    if (difficultyFilter !== '') count++;
    if (chainFilter !== '') count++;
    return count;
  };

  const getUniqueQuestTypes = () => {
    return [...new Set(quests.map(q => q.quest_type).filter(Boolean))].sort();
  };

  const getUniqueChains = () => {
    return [...new Set(quests.filter(q => q.is_part_of_chain).map(q => q.chain_name).filter(Boolean))].sort();
  };

  if (localStorage.getItem("loggedIn") === 'false') {
    return <NotLoggedIn />;
  }

  const FilterChip = ({ label, onDelete }) => (
    <div className="inline-flex items-center space-x-2 bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm border border-purple-500/30">
      <span>{label}</span>
      <button onClick={onDelete} className="text-purple-400 hover:text-purple-200 transition-colors">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
        </svg>
      </button>
    </div>
  );

  const DisplayItems = () => {
    const filteredQuests = getFilteredQuests();

    if (filteredQuests.length === 0) {
      return (
        <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-12 text-center">
          <svg className="w-16 h-16 text-gray-500 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 14a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 5.677V9a1 1 0 11-2 0V5.677L6.237 6.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 14a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.616a1 1 0 01.894-1.79l1.599.8L9 4.323V3a1 1 0 011-1z" clipRule="evenodd"></path>
          </svg>
          <h3 className="text-xl font-semibold text-white mb-2">No quests found</h3>
          <p className="text-gray-400 mb-4">Try adjusting your search criteria</p>
          {getActiveFilterCount() > 0 && (
            <button
              onClick={clearAllFilters}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
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
            <svg className="w-6 h-6 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 14a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 5.677V9a1 1 0 11-2 0V5.677L6.237 6.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 14a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.616a1 1 0 01.894-1.79l1.599.8L9 4.323V3a1 1 0 011-1z" clipRule="evenodd"></path>
            </svg>
            <h2 className="text-xl font-bold text-white">
              Found {filteredQuests.length} quest{filteredQuests.length !== 1 ? 's' : ''}
            </h2>
          </div>
          <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm font-bold">
            {quests.length} total
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredQuests.map((quest) => (
            <div key={quest.docId} className="bg-black/20 backdrop-blur-lg rounded-xl border border-white/10 p-1 hover:bg-black/30 transition-all duration-300">
              <Quest 
                currQuest={quest}
                onShowDetails={setActiveQuest}
                onUpdateStatus={updateQuestStatus}
                onToggleVisibility={toggleQuestVisibility}
                onToggleRewardVisibility={toggleRewardVisibility}
                userIsDM={userIsDM}
                sessionId={sessionId}
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  const FilterSection = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-5 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Quest Type</label>
          <select
            value={questTypeFilter}
            onChange={(e) => setQuestTypeFilter(e.target.value)}
            className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
          >
            <option value="" className="bg-gray-800">Any Type</option>
            {getUniqueQuestTypes().map(type => (
              <option key={type} value={type} className="bg-gray-800">{type}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Difficulty</label>
          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
          >
            <option value="" className="bg-gray-800">Any Difficulty</option>
            <option value="Easy" className="bg-gray-800">Easy</option>
            <option value="Average" className="bg-gray-800">Average</option>
            <option value="Hard" className="bg-gray-800">Hard</option>
            <option value="Very Hard" className="bg-gray-800">Very Hard</option>
            <option value="Deadly" className="bg-gray-800">Deadly</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Quest Chain</label>
          <select
            value={chainFilter}
            onChange={(e) => setChainFilter(e.target.value)}
            className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
          >
            <option value="" className="bg-gray-800">Any Chain</option>
            {getUniqueChains().map(chain => (
              <option key={chain} value={chain} className="bg-gray-800">{chain}</option>
            ))}
          </select>
        </div>

        {userIsDM && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
            >
              <option value="" className="bg-gray-800">Any Status</option>
              <option value="Available" className="bg-gray-800">Available</option>
              <option value="Active" className="bg-gray-800">Active</option>
              <option value="Completed" className="bg-gray-800">Completed</option>
              <option value="Failed" className="bg-gray-800">Failed</option>
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
          {name && <FilterChip label={`Name: "${name}"`} onDelete={() => setName('')} />}
          {questTypeFilter && <FilterChip label={`Type: ${questTypeFilter}`} onDelete={() => setQuestTypeFilter('')} />}
          {difficultyFilter && <FilterChip label={`Difficulty: ${difficultyFilter}`} onDelete={() => setDifficultyFilter('')} />}
          {chainFilter && <FilterChip label={`Chain: ${chainFilter}`} onDelete={() => setChainFilter('')} />}
          {statusFilter && <FilterChip label={`Status: ${statusFilter}`} onDelete={() => setStatusFilter('')} />}
        </div>
      )}
    </div>
  );
  
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900">
      <div className="w-full px-4 py-6 space-y-6">
        
        <div className="bg-gradient-to-r from-purple-900/50 to-indigo-900/50 backdrop-blur-lg rounded-2xl border border-white/10 p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 14a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 5.677V9a1 1 0 11-2 0V5.677L6.237 6.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 14a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.616a1 1 0 01.894-1.79l1.599.8L9 4.323V3a1 1 0 011-1z" clipRule="evenodd"></path>
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Quest Log</h1>
                <p className="text-purple-300">Track and manage your adventures</p>
              </div>
            </div>
            
            {userIsDM && (
              <button 
                onClick={uploadQuestData}
                className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"></path>
                </svg>
                <span>Upload Sample Quests</span>
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-12">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-400 mb-4"></div>
              <h3 className="text-xl font-semibold text-white mb-2">Loading quests...</h3>
              <p className="text-gray-400">Please wait</p>
            </div>
          </div>
        ) : quests.length > 0 ? (
          <>
            <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600/20 to-indigo-600/20 p-4 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <svg className="w-6 h-6 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path>
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
                      {getFilteredQuests().length} shown
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
                    className="w-full bg-white/5 border border-white/20 rounded-xl pl-12 pr-12 py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-lg"
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

            <DisplayItems />
          </>
        ) : (
          <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-12">
            <div className="flex flex-col items-center justify-center text-center">
              <svg className="w-16 h-16 text-gray-500 mb-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 14a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 5.677V9a1 1 0 11-2 0V5.677L6.237 6.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 14a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.616a1 1 0 01.894-1.79l1.599.8L9 4.323V3a1 1 0 011-1z" clipRule="evenodd"></path>
              </svg>
              <h3 className="text-xl font-semibold text-white mb-2">No quests available</h3>
              <p className="text-gray-400">Upload some quests to get started</p>
            </div>
          </div>
        )}

        {/* Mobile Filter Fab */}
        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          className="md:hidden fixed bottom-6 right-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 transform hover:scale-110 z-40"
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

      {activeQuest && (
        <QuestDetailsModal 
          quest={activeQuest} 
          onClose={() => setActiveQuest(null)} 
          userIsDM={userIsDM}
          sessionId={sessionId}
          onToggleRewardVisibility={toggleRewardVisibility}
        />
      )}
    </div>
  );
}

// Mobile Tab Button Component
const MobileTabButton = ({ active, onClick, icon, label, badge }) => (
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
    {badge && (
      <span className={`ml-1.5 px-1.5 py-0.5 rounded text-xs ${active ? 'bg-purple-500/40' : 'bg-white/10'}`}>
        {badge}
      </span>
    )}
  </button>
);

// Quest Details Modal - MOBILE FRIENDLY
const QuestDetailsModal = ({ quest: initialQuest, onClose, userIsDM, sessionId, onToggleRewardVisibility }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [quest, setQuest] = useState(initialQuest);
  const [sessionNotes, setSessionNotes] = useState(quest.sessionProgress?.[sessionId]?.dm_session_notes || '');
  const [isSavingNotes, setIsSavingNotes] = useState(false);

  // Listen to real-time updates for this quest
  useEffect(() => {
    if (!quest.docId) return;

    const unsubscribe = onSnapshot(doc(db, 'Quests', quest.docId), (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        const sessionStatus = data.sessionProgress?.[sessionId] || {};
        const sessionVisibility = data.sessionVisibility || {};
        
        setQuest({
          docId: docSnapshot.id,
          ...data,
          currentSessionStatus: sessionStatus.status || 'Available',
          currentCompletedObjectives: sessionStatus.completed_objectives || [],
          currentPathObjectivesCompleted: sessionStatus.path_objectives_completed || [],
          chosenPath: sessionStatus.chosen_path || null,
          hiddenInCurrentSession: sessionVisibility[sessionId] === false
        });
      }
    });

    return () => unsubscribe();
  }, [quest.docId, sessionId]);

  // Update session notes when quest changes
  useEffect(() => {
    setSessionNotes(quest.sessionProgress?.[sessionId]?.dm_session_notes || '');
  }, [quest.sessionProgress, sessionId]);

  // Define getStatusColor function inside modal
  const getStatusColor = (status) => {
    const colors = {
      'Available': 'bg-blue-500/90 text-white border-blue-400',
      'Active': 'bg-yellow-500/90 text-white border-yellow-400',
      'Completed': 'bg-green-500/90 text-white border-green-400',
      'Failed': 'bg-red-500/90 text-white border-red-400',
      'Abandoned': 'bg-gray-500/90 text-white border-gray-400'
    };
    return colors[status] || 'bg-gray-500/90 text-white border-gray-400';
  };

  const saveSessionNotes = async () => {
    if (!userIsDM || !sessionId) return;
    
    setIsSavingNotes(true);
    try {
      const currentProgress = quest.sessionProgress || {};
      const updatedProgress = {
        ...currentProgress,
        [sessionId]: {
          ...(currentProgress[sessionId] || {}),
          dm_session_notes: sessionNotes,
          notes_last_updated: new Date().toISOString()
        }
      };

      await updateDoc(doc(db, 'Quests', quest.docId), {
        sessionProgress: updatedProgress
      });
      
      setTimeout(() => setIsSavingNotes(false), 500);
    } catch (error) {
      console.error('Error saving notes:', error);
      setIsSavingNotes(false);
    }
  };

  const toggleObjectiveComplete = async (objectiveIndex, isPathObjective = false) => {
    if (!userIsDM || !sessionId) return;
    
    try {
      const currentProgress = quest.sessionProgress || {};
      const sessionData = currentProgress[sessionId] || {};
      
      if (isPathObjective) {
        const currentCompleted = sessionData.path_objectives_completed || [];
        let updatedCompleted;
        
        if (currentCompleted.includes(objectiveIndex)) {
          updatedCompleted = currentCompleted.filter(idx => idx !== objectiveIndex);
        } else {
          updatedCompleted = [...currentCompleted, objectiveIndex];
        }
        
        const updatedProgress = {
          ...currentProgress,
          [sessionId]: {
            ...sessionData,
            path_objectives_completed: updatedCompleted,
            last_updated: new Date().toISOString()
          }
        };

        await updateDoc(doc(db, 'Quests', quest.docId), {
          sessionProgress: updatedProgress
        });
      } else {
        const currentCompleted = sessionData.completed_objectives || [];
        let updatedCompleted;
        
        if (currentCompleted.includes(objectiveIndex)) {
          updatedCompleted = currentCompleted.filter(idx => idx !== objectiveIndex);
        } else {
          updatedCompleted = [...currentCompleted, objectiveIndex];
        }
        
        const updatedProgress = {
          ...currentProgress,
          [sessionId]: {
            ...sessionData,
            completed_objectives: updatedCompleted,
            last_updated: new Date().toISOString()
          }
        };

        await updateDoc(doc(db, 'Quests', quest.docId), {
          sessionProgress: updatedProgress
        });
      }
    } catch (error) {
      console.error('Error toggling objective:', error);
    }
  };

  // Get reward visibility for this session
  const getRewardVisibility = (rewardType) => {
    const sessionOverride = quest.sessionRewardVisibility?.[sessionId];
    if (sessionOverride && sessionOverride[`${rewardType}_visible`] !== undefined) {
      return sessionOverride[`${rewardType}_visible`];
    }
    
    const currentRewards = getCurrentRewards();
    return currentRewards?.[rewardType]?.visible || false;
  };

  // Get the current rewards (from chosen path or default)
  const getCurrentRewards = () => {
    const chosenPathName = quest.sessionProgress?.[sessionId]?.chosen_path;
    if (chosenPathName && quest.paths) {
      const chosenPath = quest.paths.find(p => p.name === chosenPathName);
      if (chosenPath && chosenPath.rewards) {
        return chosenPath.rewards;
      }
    }
    return quest.rewards || {};
  };

  // Get current path data
  const getCurrentPath = () => {
    const chosenPathName = quest.sessionProgress?.[sessionId]?.chosen_path;
    if (chosenPathName && quest.paths) {
      return quest.paths.find(p => p.name === chosenPathName);
    }
    return null;
  };

  const currentRewards = getCurrentRewards();
  const currentPath = getCurrentPath();
  const isExperienceVisible = getRewardVisibility('experience');
  const isCurrencyVisible = getRewardVisibility('currency');
  const isReputationVisible = getRewardVisibility('reputation');
  const isItemsVisible = getRewardVisibility('items');
  const isOtherVisible = getRewardVisibility('other');

  // Check if at turning point
  const initialCompleted = quest.currentCompletedObjectives?.length === quest.initial_objectives?.length;
  const atTurningPoint = quest.has_paths && initialCompleted && !currentPath;

  const setChosenPath = async (pathName) => {
    if (!userIsDM || !sessionId) return;
    
    try {
      const currentProgress = quest.sessionProgress || {};
      const isCurrentlyChosen = currentProgress[sessionId]?.chosen_path === pathName;
      
      const updatedProgress = {
        ...currentProgress,
        [sessionId]: {
          ...(currentProgress[sessionId] || {}),
          chosen_path: isCurrentlyChosen ? null : pathName,
          path_objectives_completed: isCurrentlyChosen ? [] : (currentProgress[sessionId]?.path_objectives_completed || []),
          path_chosen_date: isCurrentlyChosen ? null : new Date().toISOString(),
          status: isCurrentlyChosen ? 'Active' : 'Active'
        }
      };

      await updateDoc(doc(db, 'Quests', quest.docId), {
        sessionProgress: updatedProgress
      });
    } catch (error) {
      console.error('Error setting path:', error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm animate-fadeIn">
      {/* Modal Container - Mobile Friendly - EXACT MATCH */}
      <div className="h-full w-full flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 md:m-4 md:rounded-2xl md:border-2 md:border-white/20 md:h-auto md:max-h-[90vh] md:max-w-4xl md:mx-auto overflow-auto p-2">
        
        {/* Compact Header */}
        <div className="flex-shrink-0 bg-gradient-to-r from-purple-600/20 to-indigo-600/20 border-b border-white/10">
          {/* Top Bar */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {quest.quest_image_url && (
                <img 
                  src={quest.quest_image_url} 
                  alt={quest.name}
                  className="flex-shrink-0 w-12 h-12 rounded-full object-cover border-2 border-purple-500/50"
                />
              )}
              {!quest.quest_image_url && (
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center text-2xl border border-white/30 shadow-lg">
                  <span>📜</span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h2 className="text-lg md:text-xl font-bold text-white truncate">{quest.name}</h2>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
                  <span className="text-purple-300">{quest.quest_type}</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-yellow-300">{quest.difficulty}</span>
                  {quest.is_part_of_chain && (
                    <>
                      <span className="text-gray-400">•</span>
                      <span className="text-blue-300">
                        {quest.chain_name} ({quest.chain_position}/{quest.chain_total})
                      </span>
                    </>
                  )}
                  {currentPath && (
                    <>
                      <span className="text-gray-400">•</span>
                      <span className="text-green-300">
                        {currentPath.icon} {currentPath.name}
                      </span>
                    </>
                  )}
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

          {/* Alert if at turning point */}
          {userIsDM && atTurningPoint && (
            <div className="mx-4 my-2 bg-orange-500/20 border border-orange-500/50 rounded-xl p-3">
              <div className="flex items-center space-x-2">
                <span className="text-xl">⚠️</span>
                <div>
                  <div className="text-orange-300 font-bold text-sm">Path Choice Required!</div>
                  <div className="text-orange-200 text-xs">Initial objectives complete. Choose a path in the "Paths" tab.</div>
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
                active={activeTab === 'objectives'}
                onClick={() => setActiveTab('objectives')}
                icon="✓"
                label="Objectives"
              />
              <MobileTabButton
                active={activeTab === 'rewards'}
                onClick={() => setActiveTab('rewards')}
                icon="🎁"
                label="Rewards"
              />
              {(quest.initial_objectives.length === quest.currentCompletedObjectives.length) && quest.has_paths && (
                <MobileTabButton
                  active={activeTab === 'paths'}
                  onClick={() => setActiveTab('paths')}
                  icon="🛤️"
                  label="Paths"
                  badge={atTurningPoint ? '⚠️' : undefined}
                />
              )}
              {userIsDM && (
                <>
                  <MobileTabButton
                    active={activeTab === 'dm'}
                    onClick={() => setActiveTab('dm')}
                    icon="📝"
                    label="DM Notes"
                  />
                  <MobileTabButton
                    active={activeTab === 'session'}
                    onClick={() => setActiveTab('session')}
                    icon="🎮"
                    label="Session"
                  />
                </>
              )}
            </div>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4"></div>
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              {/* Current Path Info */}
              {currentPath && (
                <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 rounded-xl p-4 border border-green-500/30">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-2xl">{currentPath.icon}</span>
                    <h3 className="text-white font-bold text-lg">Current Path: {currentPath.name}</h3>
                  </div>
                  <p className="text-green-200 text-sm">{currentPath.description}</p>
                </div>
              )}

              {/* Base Description */}
              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                <h3 className="text-white font-bold mb-2 flex items-center">
                  <span className="text-purple-400 mr-2">📖</span>
                  {currentPath ? 'Original Quest' : 'Description'}
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">{quest.description}</p>
              </div>

              {/* Prerequisites */}
              {(quest.prerequisite_quests?.length > 0 || quest.required_items?.length > 0 || quest.required_reputation) && (
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                  <h3 className="text-white font-bold mb-3 flex items-center">
                    <span className="text-red-400 mr-2">🔒</span>
                    Prerequisites
                  </h3>
                  <div className="space-y-2 text-gray-300 text-sm">
                    {quest.prerequisite_quests?.length > 0 && (
                      <div>
                        <strong className="text-purple-400">Required Quests:</strong>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {quest.prerequisite_quests.map((q, idx) => (
                            <span key={idx} className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded text-xs border border-purple-500/30">
                              {q}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {quest.required_items?.length > 0 && (
                      <div>
                        <strong className="text-purple-400">Required Items:</strong>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {quest.required_items.map((item, idx) => (
                            <span key={idx} className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-xs border border-blue-500/30">
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {quest.required_reputation && (
                      <div>
                        <strong className="text-purple-400">Required Reputation:</strong>
                        <span className="ml-2 text-yellow-300">{quest.required_reputation}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                  <h3 className="text-white font-bold mb-3 flex items-center">
                    <span className="text-blue-400 mr-2">👤</span>
                    Quest Giver
                  </h3>
                  <div className="space-y-2 text-gray-300 text-sm">
                    <p><strong className="text-purple-400">Name:</strong> {quest.quest_giver}</p>
                    <p><strong className="text-purple-400">Location:</strong> {quest.quest_giver_location}</p>
                  </div>
                </div>

                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                  <h3 className="text-white font-bold mb-3 flex items-center">
                    <span className="text-green-400 mr-2">📍</span>
                    Turn In
                  </h3>
                  <div className="space-y-2 text-gray-300 text-sm">
                    <p><strong className="text-purple-400">NPC:</strong> {currentPath?.turn_in_npc || quest.turn_in_npc}</p>
                    <p><strong className="text-purple-400">Location:</strong> {currentPath?.turn_in_location || quest.turn_in_location}</p>
                  </div>
                </div>
              </div>

              {/* Current Rewards Preview */}
              {(isExperienceVisible || isCurrencyVisible || isReputationVisible || isItemsVisible || isOtherVisible) && (
                <div className="bg-gradient-to-br from-yellow-900/30 to-amber-900/30 rounded-xl p-4 border border-yellow-500/30">
                  <h3 className="text-white font-bold mb-3 flex items-center">
                    <span className="text-yellow-400 mr-2">🎁</span>
                    Rewards
                    {currentPath && (
                      <span className="ml-2 text-sm text-green-300">
                        (From: {currentPath.name})
                      </span>
                    )}
                  </h3>
                  <div className="space-y-2 text-sm">
                    {isExperienceVisible && currentRewards.experience?.amount && (
                      <div className="text-yellow-200">⭐ {currentRewards.experience.amount} XP</div>
                    )}
                    {isCurrencyVisible && currentRewards.currency?.amount && (
                      <div className="text-green-200">💰 {currentRewards.currency.amount} Credits</div>
                    )}
                    {isReputationVisible && currentRewards.reputation?.text && (
                      <div className="text-blue-200">🎖️ {currentRewards.reputation.text}</div>
                    )}
                    {isItemsVisible && currentRewards.items?.list?.length > 0 && (
                      <div className="text-purple-200">
                        🎁 Items: {currentRewards.items.list.join(', ')}
                      </div>
                    )}
                    {isOtherVisible && currentRewards.other?.text && (
                      <div className="text-pink-200">✨ {currentRewards.other.text}</div>
                    )}
                  </div>
                </div>
              )}

              {quest.quest_locations && quest.quest_locations.length > 0 && (
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                  <h3 className="text-white font-bold mb-3 flex items-center">
                    <span className="text-yellow-400 mr-2">🗺️</span>
                    Quest Locations
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {quest.quest_locations.map((loc, idx) => (
                      <span key={idx} className="bg-yellow-500/20 text-yellow-300 px-3 py-1 rounded-lg text-sm border border-yellow-500/30">
                        {loc}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {userIsDM && quest.related_npcs && quest.related_npcs.length > 0 && (
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                  <h3 className="text-white font-bold mb-3 flex items-center">
                    <span className="text-pink-400 mr-2">👥</span>
                    Related NPCs
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {quest.related_npcs.map((npc, idx) => (
                      <span key={idx} className="bg-pink-500/20 text-pink-300 px-3 py-1 rounded-lg text-sm border border-pink-500/30">
                        {npc}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {quest.lore_text && (
                <div className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 rounded-xl p-4 border border-indigo-500/30">
                  <h3 className="text-white font-bold mb-3 flex items-center">
                    <span className="text-indigo-400 mr-2">📚</span>
                    Lore
                  </h3>
                  <p className="text-indigo-200 text-sm leading-relaxed italic">{quest.lore_text}</p>
                </div>
              )}

              {/* Turning Point Info */}
              {quest.has_paths && quest.turning_point && !currentPath && (
                <div className="bg-gradient-to-br from-orange-900/30 to-red-900/30 rounded-xl p-4 border border-orange-500/30">
                  <h3 className="text-white font-bold mb-3 flex items-center">
                    <span className="text-orange-400 mr-2">⚠️</span>
                    Upcoming Turning Point
                  </h3>
                  <div className="space-y-2 text-orange-200 text-sm">
                    <p><strong className="text-orange-300">Trigger:</strong> {quest.turning_point.trigger}</p>
                    {userIsDM && 
                      <>
                        <p><strong className="text-orange-300">Description:</strong> {quest.turning_point.description}</p>
                        <p><strong className="text-orange-300">Decision:</strong> {quest.turning_point.decision_prompt}</p>
                      </>
                    }
                  </div>
                </div>
              )}
            </div>
          )}

          {/* OBJECTIVES TAB */}
          {activeTab === 'objectives' && (
            <div className="space-y-4">
              {/* Show path objectives if path is chosen */}
              {currentPath ? (
                <>
                  <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 rounded-xl p-4 border border-green-500/30 mb-4">
                    <h3 className="text-white font-bold flex items-center">
                      <span className="text-green-400 mr-2">{currentPath.icon}</span>
                      {currentPath.name} - Objectives
                    </h3>
                    <p className="text-green-200 text-sm mt-1">{currentPath.short_description}</p>
                  </div>

                  {currentPath.objectives && currentPath.objectives.length > 0 ? (
                    currentPath.objectives.map((objective, idx) => {
                      const isCompleted = quest.currentPathObjectivesCompleted?.includes(idx);
                      return (
                        <div key={idx} className={`rounded-xl p-4 border transition-all ${
                          isCompleted 
                            ? 'bg-green-900/30 border-green-500/30' 
                            : 'bg-slate-800/50 border-slate-700'
                        }`}>
                          <div className="flex items-start space-x-3">
                            {userIsDM ? (
                              <button
                                onClick={() => toggleObjectiveComplete(idx, true)}
                                className={`mt-1 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                                  isCompleted
                                    ? 'bg-green-500 border-green-400'
                                    : 'border-gray-500 hover:border-purple-400'
                                }`}
                              >
                                {isCompleted && <span className="text-white text-sm">✓</span>}
                              </button>
                            ) : (
                              <div className={`mt-1 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                isCompleted
                                  ? 'bg-green-500 border-green-400'
                                  : 'border-gray-500'
                              }`}>
                                {isCompleted && <span className="text-white text-sm">✓</span>}
                              </div>
                            )}
                            <div className="flex-1">
                              <p className={`${isCompleted ? 'text-green-300 line-through' : 'text-white'}`}>
                                {objective.description}
                              </p>
                              {objective.optional && (
                                <span className="inline-block mt-1 bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded text-xs border border-blue-500/30">
                                  Optional
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center text-gray-400 py-8">
                      No objectives defined for this path
                    </div>
                  )}
                </>
              ) : (
                <>
                  {/* Show initial objectives if no path chosen */}
                  <div className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 rounded-xl p-4 border border-purple-500/30 mb-4">
                    <h3 className="text-white font-bold flex items-center">
                      <span className="text-purple-400 mr-2">📋</span>
                      Initial Objectives
                    </h3>
                    <p className="text-purple-200 text-sm mt-1">Complete these to reach the turning point</p>
                  </div>

                  {quest.initial_objectives && quest.initial_objectives.length > 0 ? (
                    quest.initial_objectives.map((objective, idx) => {
                      const isCompleted = quest.currentCompletedObjectives?.includes(idx);
                      return (
                        <div key={idx} className={`rounded-xl p-4 border transition-all ${
                          isCompleted 
                            ? 'bg-green-900/30 border-green-500/30' 
                            : 'bg-slate-800/50 border-slate-700'
                        }`}>
                          <div className="flex items-start space-x-3">
                            {userIsDM ? (
                              <button
                                onClick={() => toggleObjectiveComplete(idx, false)}
                                className={`mt-1 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                                  isCompleted
                                    ? 'bg-green-500 border-green-400'
                                    : 'border-gray-500 hover:border-purple-400'
                                }`}
                              >
                                {isCompleted && <span className="text-white text-sm">✓</span>}
                              </button>
                            ) : (
                              <div className={`mt-1 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                isCompleted
                                  ? 'bg-green-500 border-green-400'
                                  : 'border-gray-500'
                              }`}>
                                {isCompleted && <span className="text-white text-sm">✓</span>}
                              </div>
                            )}
                            <div className="flex-1">
                              <p className={`${isCompleted ? 'text-green-300 line-through' : 'text-white'}`}>
                                {objective.description}
                              </p>
                              {objective.optional && (
                                <span className="inline-block mt-1 bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded text-xs border border-blue-500/30">
                                  Optional
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center text-gray-400 py-8">
                      No initial objectives defined
                    </div>
                  )}

                  {/* Alert if at turning point */}
                  {atTurningPoint && (
                    <div className="bg-orange-500/20 border border-orange-500/50 rounded-xl p-4 mt-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">⚠️</span>
                        <div>
                          <div className="text-orange-300 font-bold">Turning Point Reached!</div>
                          <div className="text-orange-200 text-sm">Go to the "Paths" tab to choose your direction.</div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* REWARDS TAB */}
          {activeTab === 'rewards' && (
            <div className="space-y-4">
              {currentPath && (
                <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 rounded-xl p-4 border border-green-500/30">
                  <div className="flex items-center space-x-2">
                    <span className="text-green-400 text-xl">{currentPath.icon}</span>
                    <div>
                      <h3 className="text-white font-bold">
                        Showing rewards from: {currentPath.name}
                      </h3>
                      <p className="text-green-300 text-sm">
                        These are the rewards for the path chosen in your session
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Experience */}
              {currentRewards?.experience?.amount && (
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-white font-bold flex items-center">
                      <span className="text-yellow-400 mr-2">⭐</span>
                      Experience
                    </h3>
                    {userIsDM && (
                      <button
                        onClick={() => onToggleRewardVisibility(quest, 'experience')}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                          isExperienceVisible
                            ? 'bg-green-500/20 text-green-300 border border-green-500/30 hover:bg-green-500/30'
                            : 'bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30'
                        }`}
                      >
                        {isExperienceVisible ? '👁️ Visible' : '🚫 Hidden'}
                      </button>
                    )}
                  </div>
                  {(isExperienceVisible || userIsDM) && (
                    <p className="text-2xl font-bold text-yellow-300">{currentRewards.experience.amount} XP</p>
                  )}
                  {!isExperienceVisible && !userIsDM && (
                    <p className="text-gray-500 italic">Hidden from players</p>
                  )}
                </div>
              )}

              {/* Currency */}
              {currentRewards?.currency?.amount && (
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-white font-bold flex items-center">
                      <span className="text-green-400 mr-2">💰</span>
                      Currency
                    </h3>
                    {userIsDM && (
                      <button
                        onClick={() => onToggleRewardVisibility(quest, 'currency')}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                          isCurrencyVisible
                            ? 'bg-green-500/20 text-green-300 border border-green-500/30 hover:bg-green-500/30'
                            : 'bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30'
                        }`}
                      >
                        {isCurrencyVisible ? '👁️ Visible' : '🚫 Hidden'}
                      </button>
                    )}
                  </div>
                  {(isCurrencyVisible || userIsDM) && (
                    <p className="text-2xl font-bold text-green-300">{currentRewards.currency.amount} Credits</p>
                  )}
                  {!isCurrencyVisible && !userIsDM && (
                    <p className="text-gray-500 italic">Hidden from players</p>
                  )}
                </div>
              )}

              {/* Reputation */}
              {currentRewards?.reputation?.text && (
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-white font-bold flex items-center">
                      <span className="text-blue-400 mr-2">🎖️</span>
                      Reputation
                    </h3>
                    {userIsDM && (
                      <button
                        onClick={() => onToggleRewardVisibility(quest, 'reputation')}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                          isReputationVisible
                            ? 'bg-green-500/20 text-green-300 border border-green-500/30 hover:bg-green-500/30'
                            : 'bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30'
                        }`}
                      >
                        {isReputationVisible ? '👁️ Visible' : '🚫 Hidden'}
                      </button>
                    )}
                  </div>
                  {(isReputationVisible || userIsDM) && (
                    <p className="text-lg text-blue-300">{currentRewards.reputation.text}</p>
                  )}
                  {!isReputationVisible && !userIsDM && (
                    <p className="text-gray-500 italic">Hidden from players</p>
                  )}
                </div>
              )}

              {/* Items */}
              {currentRewards?.items?.list && currentRewards.items.list.length > 0 && (
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-white font-bold flex items-center">
                      <span className="text-purple-400 mr-2">🎁</span>
                      Items
                    </h3>
                    {userIsDM && (
                      <button
                        onClick={() => onToggleRewardVisibility(quest, 'items')}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                          isItemsVisible
                            ? 'bg-green-500/20 text-green-300 border border-green-500/30 hover:bg-green-500/30'
                            : 'bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30'
                        }`}
                      >
                        {isItemsVisible ? '👁️ Visible' : '🚫 Hidden'}
                      </button>
                    )}
                  </div>
                  {(isItemsVisible || userIsDM) && (
                    <ul className="space-y-2">
                      {currentRewards.items.list.map((item, idx) => (
                        <li key={idx} className="bg-purple-500/20 text-purple-200 px-3 py-2 rounded-lg border border-purple-500/30 text-sm">
                          • {item}
                        </li>
                      ))}
                    </ul>
                  )}
                  {!isItemsVisible && !userIsDM && (
                    <p className="text-gray-500 italic">Hidden from players (surprise items!)</p>
                  )}
                </div>
              )}

              {/* Other */}
              {currentRewards?.other?.text && (
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-white font-bold flex items-center">
                      <span className="text-pink-400 mr-2">✨</span>
                      Other Benefits
                    </h3>
                    {userIsDM && (
                      <button
                        onClick={() => onToggleRewardVisibility(quest, 'other')}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                          isOtherVisible
                            ? 'bg-green-500/20 text-green-300 border border-green-500/30 hover:bg-green-500/30'
                            : 'bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30'
                        }`}
                      >
                        {isOtherVisible ? '👁️ Visible' : '🚫 Hidden'}
                      </button>
                    )}
                  </div>
                  {(isOtherVisible || userIsDM) && (
                    <p className="text-lg text-pink-300">{currentRewards.other.text}</p>
                  )}
                  {!isOtherVisible && !userIsDM && (
                    <p className="text-gray-500 italic">Hidden from players</p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* PATHS TAB */}
          {activeTab === 'paths' && quest.has_paths && (
            <div className="space-y-4">
              {/* Info Header */}
              <div className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 rounded-xl p-4 border border-purple-500/30">
                <h3 className="text-white font-bold mb-2 flex items-center">
                  <span className="text-purple-400 mr-2">ℹ️</span>
                  About Quest Paths
                </h3>
                <p className="text-purple-200 text-sm mb-2">
                  {currentPath 
                    ? 'You have chosen a path. You can change it if needed, but objectives will reset.'
                    : 'Select the path your party has chosen. This will update objectives and rewards accordingly.'
                  }
                </p>
                {userIsDM && (
                  <p className="text-purple-300 text-xs italic">
                    DM Only: Players cannot see this tab. Choose the path after they make their decision.
                  </p>
                )}
              </div>

              {/* Turning Point Info */}
              {quest.turning_point && (
                <div className="bg-gradient-to-br from-orange-900/30 to-red-900/30 rounded-xl p-4 border border-orange-500/30">
                  <h3 className="text-white font-bold mb-3 flex items-center">
                    <span className="text-orange-400 mr-2">⚠️</span>
                    The Turning Point
                  </h3>
                  <div className="space-y-2 text-orange-200 text-sm">
                    <div>
                      <strong className="text-orange-300">Trigger:</strong>
                      <p className="ml-4 mt-1">{quest.turning_point.trigger}</p>
                    </div>
                    <div>
                      <strong className="text-orange-300">Description:</strong>
                      <p className="ml-4 mt-1">{quest.turning_point.description}</p>
                    </div>
                    <div>
                      <strong className="text-orange-300">Decision Prompt:</strong>
                      <p className="ml-4 mt-1">{quest.turning_point.decision_prompt}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Available Paths */}
              {quest.paths && quest.paths.length > 0 ? (
                <div className="space-y-4">
                  {quest.paths.map((path, idx) => {
                    const isChosen = currentPath?.name === path.name;
                    
                    return (
                      <div 
                        key={idx} 
                        className={`rounded-xl border transition-all ${
                          isChosen 
                            ? 'bg-gradient-to-br from-green-900/40 to-emerald-900/40 border-green-500/50' 
                            : 'bg-slate-800/50 border-slate-700 hover:border-purple-500/50'
                        }`}
                      >
                        <div className="p-4">
                          {/* Path Header */}
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h4 className="text-xl font-bold text-white mb-2 flex items-center">
                                {isChosen && <span className="text-green-400 mr-2">✓</span>}
                                <span className="mr-2">{path.icon}</span>
                                {path.name}
                              </h4>
                              <p className="text-gray-400 text-sm mb-2">{path.short_description}</p>
                              <p className="text-gray-300 text-sm leading-relaxed">{path.description}</p>
                            </div>
                            {userIsDM && (
                              <button
                                onClick={() => setChosenPath(path.name)}
                                className={`ml-4 px-4 py-2 rounded-lg font-medium text-sm transition-all whitespace-nowrap ${
                                  isChosen
                                    ? 'bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30'
                                    : 'bg-green-500/20 text-green-300 border border-green-500/30 hover:bg-green-500/30'
                                }`}
                              >
                                {isChosen ? 'Unselect' : 'Choose Path'}
                              </button>
                            )}
                          </div>

                          {/* Path Objectives Preview */}
                          <div className="mt-4 pt-4 border-t border-white/10">
                            <h5 className="text-sm font-bold text-gray-400 mb-2">Path Objectives:</h5>
                            <ul className="space-y-1">
                              {path.objectives?.map((obj, objIdx) => (
                                <li key={objIdx} className="text-sm text-gray-300 flex items-start">
                                  <span className="text-purple-400 mr-2">•</span>
                                  <span>{obj.description}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Path Rewards */}
                          {userIsDM && (
                            <div className="mt-4 pt-4 border-t border-white/10">
                              <h5 className="text-sm font-bold text-gray-400 mb-3">Rewards for this path:</h5>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {path.rewards?.experience?.amount && (
                                  <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700">
                                    <div className="text-xs text-gray-400 mb-1">Experience</div>
                                    <div className="text-lg font-bold text-yellow-300">
                                      {path.rewards.experience.amount} XP
                                    </div>
                                  </div>
                                )}

                                {path.rewards?.currency?.amount && (
                                  <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700">
                                    <div className="text-xs text-gray-400 mb-1">Currency</div>
                                    <div className="text-lg font-bold text-green-300">
                                      {path.rewards.currency.amount} Credits
                                    </div>
                                  </div>
                                )}

                                {path.rewards?.reputation?.text && (
                                  <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700 md:col-span-2">
                                    <div className="text-xs text-gray-400 mb-1">Reputation</div>
                                    <div className="text-sm text-blue-300">
                                      {path.rewards.reputation.text}
                                    </div>
                                  </div>
                                )}

                                {path.rewards?.items?.list && path.rewards.items.list.length > 0 && (
                                  <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700 md:col-span-2">
                                    <div className="text-xs text-gray-400 mb-2">Items</div>
                                    <div className="flex flex-wrap gap-2">
                                      {path.rewards.items.list.map((item, itemIdx) => (
                                        <span 
                                          key={itemIdx}
                                          className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded text-xs border border-purple-500/30"
                                        >
                                          {item}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {path.rewards?.other?.text && (
                                  <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700 md:col-span-2">
                                    <div className="text-xs text-gray-400 mb-1">Other Benefits</div>
                                    <div className="text-sm text-pink-300">
                                      {path.rewards.other.text}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Path Consequences */}
                          {userIsDM && (path.unlocks_quest || path.blocks_quest || path.consequences) && (
                            <div className="mt-4 pt-4 border-t border-white/10">
                              <h5 className="text-sm font-bold text-gray-400 mb-2">Path Consequences:</h5>
                              <div className="space-y-2 text-sm">
                                {path.consequences && (
                                  <div className="text-orange-300">
                                    <strong>Impact:</strong> {path.consequences}
                                  </div>
                                )}
                                {path.unlocks_quest && (
                                  <div className="text-green-300">
                                    <strong>Unlocks:</strong> {path.unlocks_quest}
                                  </div>
                                )}
                                {path.blocks_quest && (
                                  <div className="text-red-300">
                                    <strong>Blocks:</strong> {path.blocks_quest}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* DM Path Notes */}
                          {userIsDM && path.path_notes && (
                            <div className="mt-4 pt-4 border-t border-white/10">
                              <div className="bg-blue-900/30 rounded-lg p-3 border border-blue-500/30">
                                <h5 className="text-sm font-bold text-blue-300 mb-1">DM Notes:</h5>
                                <p className="text-sm text-blue-200">{path.path_notes}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center text-gray-400 py-8">
                  No paths defined for this quest
                </div>
              )}
            </div>
          )}
          
          {/* DM NOTES TAB */}
          {activeTab === 'dm' && userIsDM && (
            <div className="space-y-4">
              {quest.dm_notes && (
                <div className="bg-gradient-to-br from-blue-900/30 to-indigo-900/30 rounded-xl p-4 border border-blue-500/30">
                  <h3 className="text-white font-bold mb-3 flex items-center">
                    <span className="text-blue-400 mr-2">📚</span>
                    General DM Notes
                  </h3>
                  <div className="text-blue-200 text-sm leading-relaxed whitespace-pre-line">
                    {quest.dm_notes}
                  </div>
                </div>
              )}

              {quest.dm_secrets && (
                <div className="bg-gradient-to-br from-red-900/30 to-rose-900/30 rounded-xl p-4 border border-red-500/30">
                  <h3 className="text-white font-bold mb-3 flex items-center">
                    <span className="text-red-400 mr-2">🔒</span>
                    Secrets
                  </h3>
                  <div className="text-red-200 text-sm leading-relaxed whitespace-pre-line">
                    {quest.dm_secrets}
                  </div>
                </div>
              )}

              {quest.procedural_notes && (
                <div className="bg-gradient-to-br from-purple-900/30 to-violet-900/30 rounded-xl p-4 border border-purple-500/30">
                  <h3 className="text-white font-bold mb-3 flex items-center">
                    <span className="text-purple-400 mr-2">🎲</span>
                    Procedural Notes
                  </h3>
                  <div className="text-purple-200 text-sm leading-relaxed whitespace-pre-line">
                    {quest.procedural_notes}
                  </div>
                </div>
              )}

              {quest.can_fail && (
                <div className="bg-gradient-to-br from-orange-900/30 to-red-900/30 rounded-xl p-4 border border-orange-500/30">
                  <h3 className="text-white font-bold mb-3 flex items-center">
                    <span className="text-orange-400 mr-2">⚠️</span>
                    Failure Conditions
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm font-semibold text-orange-300 mb-1">Conditions:</div>
                      <p className="text-orange-200 text-sm">{quest.failure_conditions}</p>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-orange-300 mb-1">Consequences:</div>
                      <p className="text-orange-200 text-sm">{quest.failure_consequences}</p>
                    </div>
                  </div>
                </div>
              )}

              {quest.has_choices && quest.choice_descriptions && (
                <div className="bg-gradient-to-br from-yellow-900/30 to-amber-900/30 rounded-xl p-4 border border-yellow-500/30">
                  <h3 className="text-white font-bold mb-3 flex items-center">
                    <span className="text-yellow-400 mr-2">🔀</span>
                    Branching Information
                  </h3>
                  <div className="text-yellow-200 text-sm leading-relaxed">
                    {quest.choice_descriptions}
                  </div>
                </div>
              )}

              {/* Current Path DM Info */}
              {currentPath && (
                <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 rounded-xl p-4 border border-green-500/30">
                  <h3 className="text-white font-bold mb-3 flex items-center">
                    <span className="text-green-400 mr-2">{currentPath.icon}</span>
                    Current Path: {currentPath.name}
                  </h3>
                  {currentPath.path_notes && (
                    <div className="mb-3">
                      <div className="text-sm font-semibold text-green-300 mb-1">Path Notes:</div>
                      <p className="text-green-200 text-sm">{currentPath.path_notes}</p>
                    </div>
                  )}
                  {currentPath.consequences && (
                    <div className="mb-3">
                      <div className="text-sm font-semibold text-green-300 mb-1">Consequences:</div>
                      <p className="text-green-200 text-sm">{currentPath.consequences}</p>
                    </div>
                  )}
                  {(currentPath.unlocks_quest || currentPath.blocks_quest) && (
                    <div>
                      <div className="text-sm font-semibold text-green-300 mb-1">Quest Chain Impact:</div>
                      {currentPath.unlocks_quest && (
                        <p className="text-green-200 text-sm">✅ Unlocks: {currentPath.unlocks_quest}</p>
                      )}
                      {currentPath.blocks_quest && (
                        <p className="text-red-300 text-sm">🚫 Blocks: {currentPath.blocks_quest}</p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* SESSION PROGRESS TAB */}
          {activeTab === 'session' && userIsDM && (
            <div className="space-y-4">
              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                <h3 className="text-white font-bold mb-3 flex items-center">
                  <span className="text-pink-400 mr-2">📝</span>
                  Session-Specific Notes
                  <span className="ml-auto text-xs text-gray-400 font-normal">Auto-saves</span>
                </h3>
                <textarea
                  value={sessionNotes}
                  onChange={(e) => setSessionNotes(e.target.value)}
                  onBlur={saveSessionNotes}
                  placeholder="Add notes about this quest for your current session..."
                  className="w-full h-64 bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all resize-none"
                />
                {isSavingNotes && (
                  <div className="mt-2 text-sm text-green-400 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                    Saved
                  </div>
                )}
              </div>

              {/* Progress Summary */}
              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                <h3 className="text-white font-bold mb-3 flex items-center">
                  <span className="text-blue-400 mr-2">📊</span>
                  Progress Summary
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 text-sm">Status:</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(quest.currentSessionStatus)}`}>
                      {quest.currentSessionStatus}
                    </span>
                  </div>
                  
                  {currentPath ? (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300 text-sm">Chosen Path:</span>
                        <span className="text-green-300 font-bold flex items-center text-sm">
                          <span className="mr-1">{currentPath.icon}</span>
                          {currentPath.name}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300 text-sm">Path Objectives:</span>
                        <span className="text-purple-300 font-bold text-sm">
                          {quest.currentPathObjectivesCompleted?.length || 0} / {currentPath.objectives?.length || 0}
                        </span>
                      </div>
                      {quest.sessionProgress?.[sessionId]?.path_chosen_date && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-300 text-sm">Path Chosen:</span>
                          <span className="text-gray-400 text-xs">
                            {new Date(quest.sessionProgress[sessionId].path_chosen_date).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300 text-sm">Initial Objectives:</span>
                        <span className="text-purple-300 font-bold text-sm">
                          {quest.currentCompletedObjectives?.length || 0} / {quest.initial_objectives?.length || 0}
                        </span>
                      </div>
                      {atTurningPoint && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-300 text-sm">Status:</span>
                          <span className="text-orange-300 font-bold flex items-center text-sm">
                            <span className="mr-1">⚠️</span>
                            At Turning Point
                          </span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
    </div>
  );
};