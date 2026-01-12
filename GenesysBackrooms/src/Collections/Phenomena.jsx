import { collection, doc, onSnapshot, query, setDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from 'react';
import PhenomenonModal from '../Modals/PhenomenonModal';
import db from '../Structural/Firebase';
import NotLoggedIn from "../Structural/Not_Logged_In";
import { getActiveSession, isDM, requireSession } from '../Structural/Session_Utils';
import Phenomenon from "../Sub_Components/Phenomenon";

import data from '../Data/PhenomenonData';

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

export default function Phenomena() {
  const [phenomena, setPhenomena] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('-1');
  const [filterSeverity, setFilterSeverity] = useState('-1');
  const [filterScope, setFilterScope] = useState('-1');
  const [filterTrigger, setFilterTrigger] = useState('-1');
  const [showHiddenOnly, setShowHiddenOnly] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const [detailsModal, setDetailsModal] = useState({ isOpen: false, phenomenonData: null });
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
      showToast('Only DMs can upload phenomena data', 'error');
      return;
    }
  
    const confirmUpload = window.confirm(
      `This will add ${data.length} ${data.length === 1 ? 'phenomenon' : 'phenomena'} to the global database (hidden by default in this session). Continue?`
    );
  
    if (!confirmUpload) return;
  
    try {
      for (let i = 0; i < data.length; i++) {
        const phenomenonData = {
          ...data[i],
          sessionVisibility: {[getActiveSession()]: 'hidden'}
        };
      
        await setDoc(doc(db, 'Phenomena', data[i].id), phenomenonData);
      }
      showToast(`Successfully added ${data.length} ${data.length === 1 ? 'phenomenon' : 'phenomena'}!`);
    } catch (error) {
      showToast('Error adding phenomena data', 'error');
      console.error(error);
    }
  };

  const toggleVisibility = async (phenomenonId, currentlyHidden) => {
    if (!userIsDM) {
      showToast('Only DMs can change phenomenon visibility', 'error');
      return;
    }

    try {
      const phenomenonRef = doc(db, 'Phenomena', phenomenonId);
      const newVisibility = currentlyHidden ? 'visible' : 'hidden';
      
      await updateDoc(phenomenonRef, {
        [`sessionVisibility.${sessionId}`]: newVisibility
      });

      showToast(
        `Phenomenon ${newVisibility === 'visible' ? 'shown to' : 'hidden from'} players`,
        'success'
      );
    } catch (error) {
      showToast('Error updating phenomenon visibility', 'error');
      console.error(error);
    }
  };

  const updateSessionNotes = async (phenomenonId, sessionId, noteText) => {
    if (!userIsDM) {
      showToast('Only DMs can update session notes', 'error');
      return;
    }

    try {
      const phenomenonRef = doc(db, 'Phenomena', phenomenonId);
      
      await updateDoc(phenomenonRef, {
        [`dmNotes.sessionNotes.${sessionId}`]: noteText
      });

      showToast('Session note saved', 'success');
    } catch (error) {
      showToast('Error saving session note', 'error');
      console.error(error);
    }
  };

  useEffect(() => {
    if (!requireSession()) return;
    if (localStorage.getItem("loggedIn") !== 'false') {
      getPhenomenaFromDB();
    }
  }, [sessionId]);

  const getPhenomenaFromDB = () => {
    if (!sessionId) return;

    const q = query(collection(db, 'Phenomena'));

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
      setPhenomena(queryData);
      setLoading(false);
    });

    return () => unsub();
  };

  const getFilteredPhenomena = () => {
    let filtered = phenomena;

    // Filter by visibility
    if (showHiddenOnly) {
      filtered = filtered.filter(p => p.isHidden);
    } else if (!userIsDM) {
      filtered = filtered.filter(p => !p.isHidden);
    }

    // Filter by search term
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(p =>
        p.name?.toLowerCase().includes(search) ||
        p.aliases?.some(a => a.toLowerCase().includes(search)) ||
        p.description?.overview?.toLowerCase().includes(search) ||
        p.id?.toLowerCase().includes(search)
      );
    }

    // Filter by category
    if (filterCategory !== '-1') {
      filtered = filtered.filter(p => p.category === filterCategory);
    }

    // Filter by severity
    if (filterSeverity !== '-1') {
      filtered = filtered.filter(p => p.severity === parseInt(filterSeverity));
    }

    // Filter by scope
    if (filterScope !== '-1') {
      filtered = filtered.filter(p => p.scope === filterScope);
    }

    // Filter by trigger type
    if (filterTrigger !== '-1') {
      filtered = filtered.filter(p => p.triggerType === filterTrigger);
    }

    // Sort by severity (descending), then name
    filtered.sort((a, b) => {
      if (a.severity !== b.severity) return b.severity - a.severity;
      return a.name.localeCompare(b.name);
    });

    return filtered;
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filterCategory !== '-1') count++;
    if (filterSeverity !== '-1') count++;
    if (filterScope !== '-1') count++;
    if (filterTrigger !== '-1') count++;
    if (showHiddenOnly) count++;
    return count;
  };

  const resetFilters = () => {
    setFilterCategory('-1');
    setFilterSeverity('-1');
    setFilterScope('-1');
    setFilterTrigger('-1');
    setShowHiddenOnly(false);
  };

  const openDetailsModal = (phenomenon) => {
    setDetailsModal({ isOpen: true, phenomenonData: phenomenon });
  };

  const closeDetailsModal = () => {
    setDetailsModal({ isOpen: false, phenomenonData: null });
  };

  // Keep modal data in sync
  useEffect(() => {
    if (detailsModal.isOpen && detailsModal.phenomenonData) {
      const updatedPhenomenon = phenomena.find(p => p.id === detailsModal.phenomenonData.id);
      if (updatedPhenomenon) {
        setDetailsModal(prev => ({ ...prev, phenomenonData: updatedPhenomenon }));
      }
    }
  }, [phenomena]);

  const FilterSection = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-purple-300 mb-2">Category</label>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          >
            <option value="-1">All Categories</option>
            <option value="Isolation">👁️‍🗨️ Isolation</option>
            <option value="Temporal">⏳ Temporal</option>
            <option value="Spatial">🌀 Spatial</option>
            <option value="Reality Distortion">💫 Reality Distortion</option>
            <option value="Environmental">🌡️ Environmental</option>
            <option value="Mental">🧠 Mental</option>
            <option value="Physical">💀 Physical</option>
          </select>
        </div>

        {/* Severity Filter */}
        <div>
          <label className="block text-sm font-medium text-purple-300 mb-2">Severity</label>
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          >
            <option value="-1">All Severities</option>
            <option value="0">0 - Beneficial</option>
            <option value="1">1 - Harmless</option>
            <option value="2">2 - Moderate</option>
            <option value="3">3 - Significant</option>
            <option value="4">4 - Severe</option>
            <option value="5">5 - Lethal</option>
          </select>
        </div>

        {/* Scope Filter */}
        <div>
          <label className="block text-sm font-medium text-purple-300 mb-2">Scope</label>
          <select
            value={filterScope}
            onChange={(e) => setFilterScope(e.target.value)}
            className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          >
            <option value="-1">All Scopes</option>
            <option value="level-wide">🌐 Level-wide</option>
            <option value="room-specific">🚪 Room-specific</option>
          </select>
        </div>

        {/* Trigger Filter */}
        <div>
          <label className="block text-sm font-medium text-purple-300 mb-2">Trigger Type</label>
          <select
            value={filterTrigger}
            onChange={(e) => setFilterTrigger(e.target.value)}
            className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          >
            <option value="-1">All Triggers</option>
            <option value="automatic">⚡ Automatic</option>
            <option value="player-activated">👆 Player-activated</option>
            <option value="random-chance">🎲 Random Chance</option>
            <option value="conditional">❓ Conditional</option>
          </select>
        </div>
      </div>

      {/* Hidden Only Toggle (DM) */}
      {userIsDM && (
        <div className="flex items-center justify-between bg-purple-600/10 rounded-lg p-4 border border-purple-500/30">
          <span className="text-purple-300 font-medium">Show hidden phenomena only</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={showHiddenOnly}
              onChange={(e) => setShowHiddenOnly(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
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

  const filteredPhenomena = getFilteredPhenomena();

  // Get counts by category for display
  const categoryCounts = {
    'Isolation': filteredPhenomena.filter(p => p.category === 'Isolation').length,
    'Temporal': filteredPhenomena.filter(p => p.category === 'Temporal').length,
    'Spatial': filteredPhenomena.filter(p => p.category === 'Spatial').length,
    'Reality Distortion': filteredPhenomena.filter(p => p.category === 'Reality Distortion').length,
    'Environmental': filteredPhenomena.filter(p => p.category === 'Environmental').length,
    'Mental': filteredPhenomena.filter(p => p.category === 'Mental').length,
    'Physical': filteredPhenomena.filter(p => p.category === 'Physical').length,
  };

  if (localStorage.getItem("loggedIn") === 'false') {
    return <NotLoggedIn />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-8">
      <Toast message={toast.message} severity={toast.severity} isOpen={toast.open} onClose={hideToast} />
      
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Backrooms Phenomena</h1>
            <p className="text-gray-400">Anomalous events, reality distortions, and environmental effects</p>
          </div>
          
          {userIsDM && (
            <button
              onClick={addData}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-all shadow-lg hover:shadow-purple-500/50"
            >
              Upload Phenomena
            </button>
          )}
        </div>

        {/* Category Summary */}
        <div className="flex flex-wrap gap-2 mb-4">
          {Object.entries(categoryCounts).map(([cat, count]) => count > 0 && (
            <span key={cat} className="px-3 py-1 rounded-lg text-sm bg-white/5 text-gray-300 border border-white/10">
              {cat}: {count}
            </span>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search phenomena by name, alias, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 pl-12 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
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
              <span className="bg-purple-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
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
          Showing {filteredPhenomena.length} of {phenomena.length} phenomena
        </div>
      </div>

      {/* Phenomena Grid */}
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
            <p className="text-gray-400 mt-4">Loading phenomena...</p>
          </div>
        ) : filteredPhenomena.length === 0 ? (
          <div className="text-center py-20">
            <svg className="w-24 h-24 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-gray-400 text-xl">No phenomena found</p>
            <p className="text-gray-500 mt-2">Try adjusting your filters or search term</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPhenomena.map((phenomenon) => (
              <Phenomenon
                key={phenomenon.id}
                phenomenon={phenomenon}
                onClick={() => openDetailsModal(phenomenon)}
                isHidden={phenomenon.isHidden}
                userIsDM={userIsDM}
              />
            ))}
          </div>
        )}
      </div>

      {/* Details Modal */}
      {detailsModal.isOpen && (
        <PhenomenonModal
          phenomenon={detailsModal.phenomenonData}
          onClose={closeDetailsModal}
          userIsDM={userIsDM}
          onToggleVisibility={toggleVisibility}
          onUpdateSessionNotes={updateSessionNotes}
        />
      )}
    </div>
  );
}