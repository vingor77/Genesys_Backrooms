import { collection, doc, onSnapshot, query, setDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from 'react';
import QuestModal from '../Modals/QuestModal';
import db from '../Structural/Firebase';
import NotLoggedIn from "../Structural/Not_Logged_In";
import { getActiveSession, isDM, requireSession } from '../Structural/Session_Utils';
import Quest from "../Sub_Components/Quest";

import data from '../Data/QuestData';

// Toast notification component
const Toast = ({ message, severity, isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => { onClose(); }, 4000);
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

  const icons = { success: '✓', error: '✕', warning: '⚠', info: 'ℹ' };

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

export default function Quests() {
  const [quests, setQuests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('-1');
  const [filterDifficulty, setFilterDifficulty] = useState('-1');
  const [filterQuestLine, setFilterQuestLine] = useState('-1');
  const [filterStatus, setFilterStatus] = useState('-1');
  const [showHiddenOnly, setShowHiddenOnly] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const [detailsModal, setDetailsModal] = useState({ isOpen: false, questData: null });
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
      showToast('Only DMs can upload quest data', 'error');
      return;
    }
  
    const confirmUpload = window.confirm(
      `This will add ${data.length} ${data.length === 1 ? 'quest' : 'quests'} to the global database (hidden by default in this session). Continue?`
    );
  
    if (!confirmUpload) return;
  
    try {
      for (let i = 0; i < data.length; i++) {
        const questData = {
          ...data[i],
          sessionVisibility: {[getActiveSession()]: 'hidden'}
        };
      
        await setDoc(doc(db, 'Quests', data[i].id), questData);
      }
      showToast(`Successfully added ${data.length} ${data.length === 1 ? 'quest' : 'quests'}!`);
    } catch (error) {
      showToast('Error adding quest data', 'error');
      console.error(error);
    }
  };

  const toggleVisibility = async (questId, currentlyHidden) => {
    if (!userIsDM) {
      showToast('Only DMs can change quest visibility', 'error');
      return;
    }

    try {
      const questRef = doc(db, 'Quests', questId);
      const newVisibility = currentlyHidden ? 'visible' : 'hidden';
      
      await updateDoc(questRef, {
        [`sessionVisibility.${sessionId}`]: newVisibility
      });

      showToast(
        `Quest ${newVisibility === 'visible' ? 'shown to' : 'hidden from'} players`,
        'success'
      );
    } catch (error) {
      showToast('Error updating quest visibility', 'error');
      console.error(error);
    }
  };

  const updateSessionNotes = async (questId, sessionId, noteText) => {
    if (!userIsDM) {
      showToast('Only DMs can update session notes', 'error');
      return;
    }

    try {
      const questRef = doc(db, 'Quests', questId);
      const timestamp = new Date().toISOString();
      
      // Get current session tracking data
      const currentQuest = quests.find(q => q.id === questId);
      const currentSessionTracking = currentQuest?.sessionTracking?.[sessionId] || {
        completedObjectives: [],
        completed: false,
        activeVariant: null,
        sessionNotes: []
      };

      // Add new note
      const updatedNotes = [...(currentSessionTracking.sessionNotes || []), {
        note: noteText,
        timestamp: timestamp
      }];

      await updateDoc(questRef, {
        [`sessionTracking.${sessionId}.sessionNotes`]: updatedNotes
      });

      showToast('Session note saved', 'success');
    } catch (error) {
      showToast('Error saving session note', 'error');
      console.error(error);
    }
  };

  const toggleObjective = async (questId, sessionId, objectiveId, completed) => {
    if (!userIsDM) {
      showToast('Only DMs can update objectives', 'error');
      return;
    }

    try {
      const questRef = doc(db, 'Quests', questId);
      const currentQuest = quests.find(q => q.id === questId);
      const currentCompleted = currentQuest?.sessionTracking?.[sessionId]?.completedObjectives || [];

      let updatedCompleted;
      if (completed) {
        updatedCompleted = [...currentCompleted, objectiveId];
      } else {
        updatedCompleted = currentCompleted.filter(id => id !== objectiveId);
      }

      await updateDoc(questRef, {
        [`sessionTracking.${sessionId}.completedObjectives`]: updatedCompleted
      });

      showToast(`Objective ${completed ? 'completed' : 'uncompleted'}`, 'success');
    } catch (error) {
      showToast('Error updating objective', 'error');
      console.error(error);
    }
  };

  const toggleQuestCompleted = async (questId, sessionId, completed) => {
    if (!userIsDM) {
      showToast('Only DMs can update quest status', 'error');
      return;
    }

    try {
      const questRef = doc(db, 'Quests', questId);

      await updateDoc(questRef, {
        [`sessionTracking.${sessionId}.completed`]: completed
      });

      showToast(`Quest marked as ${completed ? 'completed' : 'incomplete'}`, 'success');
    } catch (error) {
      showToast('Error updating quest status', 'error');
      console.error(error);
    }
  };

  const setActiveVariant = async (questId, sessionId, variants) => {
    if (!userIsDM) {
      showToast('Only DMs can set variants', 'error');
      return;
    }

    try {
      const questRef = doc(db, 'Quests', questId);

      await updateDoc(questRef, {
        [`sessionTracking.${sessionId}.activeVariants`]: variants
      });

      if (variants.length === 0) {
        showToast('All variants cleared', 'success');
      } else {
        showToast(`${variants.length} variant${variants.length > 1 ? 's' : ''} active`, 'success');
      }
    } catch (error) {
      showToast('Error setting variants', 'error');
      console.error(error);
    }
  };

  useEffect(() => {
    if (!requireSession()) return;
    if (localStorage.getItem("loggedIn") !== 'false') {
      getQuestsFromDB();
    }
  }, [sessionId]);

  const getQuestsFromDB = () => {
    if (!sessionId) return;

    const q = query(collection(db, 'Quests'));

    const unsub = onSnapshot(q, (querySnapshot) => {
      const queryData = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const sessionVisibility = data.sessionVisibility || {};
        
        queryData.push({ 
          ...data,
          isHidden: sessionVisibility[sessionId] !== 'visible'
        });
      });
      setQuests(queryData);
      setLoading(false);
    });

    return () => unsub();
  };

  // Get unique quest lines for filter dropdown
  const uniqueQuestLines = [...new Set(quests.map(q => q.questLine?.name).filter(Boolean))].sort();

  const getFilteredQuests = () => {
    let filtered = quests;

    // Filter by visibility
    if (showHiddenOnly) {
      filtered = filtered.filter(q => q.isHidden);
    } else if (!userIsDM) {
      filtered = filtered.filter(q => !q.isHidden);
    }

    // Filter by search term
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(q =>
        q.name?.toLowerCase().includes(search) ||
        q.description?.toLowerCase().includes(search) ||
        q.questGiver?.id?.toLowerCase().includes(search) ||
        q.id?.toLowerCase().includes(search)
      );
    }

    // Filter by type
    if (filterType !== '-1') {
      filtered = filtered.filter(q => q.type === filterType);
    }

    // Filter by difficulty
    if (filterDifficulty !== '-1') {
      filtered = filtered.filter(q => q.difficulty === filterDifficulty);
    }

    // Filter by quest line
    if (filterQuestLine !== '-1') {
      filtered = filtered.filter(q => q.questLine?.name === filterQuestLine);
    }

    // Filter by status (DM only)
    if (filterStatus !== '-1' && userIsDM) {
      if (filterStatus === 'completed') {
        filtered = filtered.filter(q => q.sessionTracking?.completed);
      } else if (filterStatus === 'active') {
        filtered = filtered.filter(q => q.sessionTracking?.shownToPlayers && !q.sessionTracking?.completed);
      } else if (filterStatus === 'not-started') {
        filtered = filtered.filter(q => !q.sessionTracking?.shownToPlayers);
      }
    }

    // Sort: Main quests first, then by name
    filtered.sort((a, b) => {
      if (a.type === 'main' && b.type !== 'main') return -1;
      if (a.type !== 'main' && b.type === 'main') return 1;
      return a.name.localeCompare(b.name);
    });

    return filtered;
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filterType !== '-1') count++;
    if (filterDifficulty !== '-1') count++;
    if (filterQuestLine !== '-1') count++;
    if (filterStatus !== '-1') count++;
    if (showHiddenOnly) count++;
    return count;
  };

  const resetFilters = () => {
    setFilterType('-1');
    setFilterDifficulty('-1');
    setFilterQuestLine('-1');
    setFilterStatus('-1');
    setShowHiddenOnly(false);
  };

  const openDetailsModal = (quest) => {
    setDetailsModal({ isOpen: true, questData: quest });
  };

  const closeDetailsModal = () => {
    setDetailsModal({ isOpen: false, questData: null });
  };

  // Keep modal data in sync
  useEffect(() => {
    if (detailsModal.isOpen && detailsModal.questData) {
      const updatedQuest = quests.find(q => q.id === detailsModal.questData.id);
      if (updatedQuest) {
        setDetailsModal(prev => ({ ...prev, questData: updatedQuest }));
      }
    }
  }, [quests]);

  const FilterSection = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Type Filter */}
        <div>
          <label className="block text-sm font-medium text-amber-300 mb-2">Type</label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
          >
            <option value="-1">All Types</option>
            <option value="main">⭐ Main</option>
            <option value="side">📋 Side</option>
            <option value="faction">🏛️ Faction</option>
            <option value="personal">👤 Personal</option>
            <option value="world">🌍 World</option>
          </select>
        </div>

        {/* Difficulty Filter */}
        <div>
          <label className="block text-sm font-medium text-amber-300 mb-2">Difficulty</label>
          <select
            value={filterDifficulty}
            onChange={(e) => setFilterDifficulty(e.target.value)}
            className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
          >
            <option value="-1">All Difficulties</option>
            <option value="easy">🟢 Easy</option>
            <option value="medium">🟡 Medium</option>
            <option value="hard">🟠 Hard</option>
            <option value="deadly">🔴 Deadly</option>
          </select>
        </div>

        {/* Quest Line Filter */}
        <div>
          <label className="block text-sm font-medium text-amber-300 mb-2">Quest Line</label>
          <select
            value={filterQuestLine}
            onChange={(e) => setFilterQuestLine(e.target.value)}
            className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
          >
            <option value="-1">All Quest Lines</option>
            {uniqueQuestLines.map(line => (
              <option key={line} value={line}>{line}</option>
            ))}
          </select>
        </div>

        {/* Status Filter (DM) */}
        {userIsDM && (
          <div>
            <label className="block text-sm font-medium text-amber-300 mb-2">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
            >
              <option value="-1">All Statuses</option>
              <option value="not-started">Not Started</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        )}
      </div>

      {/* Hidden Only Toggle (DM) */}
      {userIsDM && (
        <div className="flex items-center justify-between bg-amber-600/10 rounded-lg p-4 border border-amber-500/30">
          <span className="text-amber-300 font-medium">Show hidden quests only</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={showHiddenOnly}
              onChange={(e) => setShowHiddenOnly(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
          </label>
        </div>
      )}

      {/* Reset Button */}
      {getActiveFilterCount() > 0 && (
        <button
          onClick={resetFilters}
          className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-400 font-medium py-3 px-4 rounded-lg border border-red-500/50 transition-all"
        >
          Reset Filters ({getActiveFilterCount()} active)
        </button>
      )}
    </div>
  );

  const filteredQuests = getFilteredQuests();

  // Get counts by type
  const typeCounts = {
    'main': filteredQuests.filter(q => q.type === 'main').length,
    'side': filteredQuests.filter(q => q.type === 'side').length,
    'faction': filteredQuests.filter(q => q.type === 'faction').length,
    'personal': filteredQuests.filter(q => q.type === 'personal').length,
    'world': filteredQuests.filter(q => q.type === 'world').length,
  };

  if (localStorage.getItem("loggedIn") === 'false') {
    return <NotLoggedIn />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-amber-900/30 to-gray-900 p-8">
      <Toast message={toast.message} severity={toast.severity} isOpen={toast.open} onClose={hideToast} />
      
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Quests</h1>
            <p className="text-gray-400">Missions, story arcs, and objectives</p>
          </div>
          
          {userIsDM && (
            <button
              onClick={addData}
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-6 rounded-lg transition-all shadow-lg hover:shadow-amber-500/50"
            >
              Upload Quests
            </button>
          )}
        </div>

        {/* Type Summary */}
        <div className="flex flex-wrap gap-2 mb-4">
          {typeCounts['main'] > 0 && (
            <span className="px-3 py-1 rounded-lg text-sm bg-amber-500/20 text-amber-300 border border-amber-500/30">
              ⭐ Main: {typeCounts['main']}
            </span>
          )}
          {typeCounts['side'] > 0 && (
            <span className="px-3 py-1 rounded-lg text-sm bg-blue-500/20 text-blue-300 border border-blue-500/30">
              📋 Side: {typeCounts['side']}
            </span>
          )}
          {typeCounts['faction'] > 0 && (
            <span className="px-3 py-1 rounded-lg text-sm bg-purple-500/20 text-purple-300 border border-purple-500/30">
              🏛️ Faction: {typeCounts['faction']}
            </span>
          )}
          {typeCounts['personal'] > 0 && (
            <span className="px-3 py-1 rounded-lg text-sm bg-pink-500/20 text-pink-300 border border-pink-500/30">
              👤 Personal: {typeCounts['personal']}
            </span>
          )}
          {typeCounts['world'] > 0 && (
            <span className="px-3 py-1 rounded-lg text-sm bg-green-500/20 text-green-300 border border-green-500/30">
              🌍 World: {typeCounts['world']}
            </span>
          )}
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search quests by name, description, or quest giver..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 pl-12 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
          />
          <svg className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Filters Toggle */}
        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          className="w-full bg-white/5 hover:bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white font-medium transition-all flex items-center justify-between mb-4"
        >
          <span className="flex items-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span>Filters</span>
            {getActiveFilterCount() > 0 && (
              <span className="bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {getActiveFilterCount()}
              </span>
            )}
          </span>
          <svg className={`w-5 h-5 transition-transform ${filtersOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Filters Panel */}
        {filtersOpen && (
          <div className="bg-white/5 backdrop-blur-lg border border-white/20 rounded-lg p-6 mb-4">
            <FilterSection />
          </div>
        )}

        {/* Results Count */}
        <div className="text-gray-400 text-sm">
          Showing {filteredQuests.length} of {quests.length} quests
        </div>
      </div>

      {/* Quests Grid */}
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-amber-500 mx-auto"></div>
            <p className="text-gray-400 mt-4">Loading quests...</p>
          </div>
        ) : filteredQuests.length === 0 ? (
          <div className="text-center py-20">
            <svg className="w-24 h-24 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-gray-400 text-xl">No quests found</p>
            <p className="text-gray-500 mt-2">Try adjusting your filters or search term</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQuests.map((quest) => (
              <Quest
                key={quest.id}
                quest={quest}
                onClick={() => openDetailsModal(quest)}
                isHidden={quest.isHidden}
                userIsDM={userIsDM}
              />
            ))}
          </div>
        )}
      </div>

      {/* Details Modal */}
      {detailsModal.isOpen && (
        <QuestModal
          quest={detailsModal.questData}
          onClose={closeDetailsModal}
          userIsDM={userIsDM}
          onToggleVisibility={toggleVisibility}
          onUpdateSessionNotes={updateSessionNotes}
          onToggleObjective={toggleObjective}
          onToggleCompleted={toggleQuestCompleted}
          onSetActiveVariant={setActiveVariant}
        />
      )}
    </div>
  );
}