import { collection, doc, onSnapshot, query, setDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from 'react';
import RelationModal from '../Modals/RelationModal';
import db from '../Structural/Firebase';
import NotLoggedIn from "../Structural/Not_Logged_In";
import { getActiveSession, isDM, requireSession } from '../Structural/Session_Utils';
import Relation from "../Sub_Components/Relation";

import data from '../Data/RelationData';

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

export default function Relations() {
  const [relations, setRelations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('-1');
  const [filterFaction, setFilterFaction] = useState('-1');
  const [showHiddenOnly, setShowHiddenOnly] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const [detailsModal, setDetailsModal] = useState({ isOpen: false, relationData: null });
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
      showToast('Only DMs can upload relation data', 'error');
      return;
    }
  
    const confirmUpload = window.confirm(
      `This will add ${data.length} ${data.length === 1 ? 'relation' : 'relations'} to the global database (hidden by default in this session). Continue?`
    );
  
    if (!confirmUpload) return;
  
    try {
      for (let i = 0; i < data.length; i++) {
        const relationData = {
          ...data[i],
          sessionVisibility: {[getActiveSession()]: 'hidden'}
        };
      
        await setDoc(doc(db, 'Relations', data[i].id), relationData);
      }
      showToast(`Successfully added ${data.length} ${data.length === 1 ? 'relation' : 'relations'}!`);
    } catch (error) {
      showToast('Error adding relation data', 'error');
      console.error(error);
    }
  };

  const toggleVisibility = async (relationId, currentlyHidden) => {
    if (!userIsDM) {
      showToast('Only DMs can change relation visibility', 'error');
      return;
    }

    try {
      const relationRef = doc(db, 'Relations', relationId);
      const newVisibility = currentlyHidden ? 'visible' : 'hidden';
      
      await updateDoc(relationRef, {
        [`sessionVisibility.${sessionId}`]: newVisibility
      });

      showToast(
        `Relation ${newVisibility === 'visible' ? 'shown to' : 'hidden from'} players`,
        'success'
      );
    } catch (error) {
      showToast('Error updating relation visibility', 'error');
      console.error(error);
    }
  };

  const updateSessionNotes = async (relationId, sessionId, noteText) => {
    if (!userIsDM) {
      showToast('Only DMs can update session notes', 'error');
      return;
    }

    try {
      const relationRef = doc(db, 'Relations', relationId);
      
      await updateDoc(relationRef, {
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
      getRelationsFromDB();
    }
  }, [sessionId]);

  const getRelationsFromDB = () => {
    if (!sessionId) return;

    const q = query(collection(db, 'Relations'));

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
      setRelations(queryData);
      setLoading(false);
    });

    return () => unsub();
  };

  // Get unique factions for filter dropdown
  const uniqueFactions = [...new Set([
    ...relations.map(r => r.factionA),
    ...relations.map(r => r.factionB)
  ].filter(Boolean))].sort();

  const formatName = (str) => {
    if (!str) return '';
    return str.split(/[-_]/).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const getFilteredRelations = () => {
    let filtered = relations;

    // Filter by visibility
    if (showHiddenOnly) {
      filtered = filtered.filter(r => r.isHidden);
    } else if (!userIsDM) {
      filtered = filtered.filter(r => !r.isHidden);
    }

    // Filter by search term
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(r =>
        r.factionA?.toLowerCase().includes(search) ||
        r.factionB?.toLowerCase().includes(search) ||
        r.id?.toLowerCase().includes(search) ||
        r.sharedHistory?.rootCause?.toLowerCase().includes(search)
      );
    }

    // Filter by status
    if (filterStatus !== '-1') {
      filtered = filtered.filter(r => r.status === filterStatus);
    }

    // Filter by faction
    if (filterFaction !== '-1') {
      filtered = filtered.filter(r => r.factionA === filterFaction || r.factionB === filterFaction);
    }

    // Sort by status severity then alphabetically
    const statusOrder = ['War', 'Hostile', 'Tense', 'Neutral', 'Friendly'];
    filtered.sort((a, b) => {
      const aIdx = statusOrder.indexOf(a.status);
      const bIdx = statusOrder.indexOf(b.status);
      if (aIdx !== bIdx) return aIdx - bIdx;
      return a.factionA.localeCompare(b.factionA);
    });

    return filtered;
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filterStatus !== '-1') count++;
    if (filterFaction !== '-1') count++;
    if (showHiddenOnly) count++;
    return count;
  };

  const resetFilters = () => {
    setFilterStatus('-1');
    setFilterFaction('-1');
    setShowHiddenOnly(false);
  };

  const openDetailsModal = (relation) => {
    setDetailsModal({ isOpen: true, relationData: relation });
  };

  const closeDetailsModal = () => {
    setDetailsModal({ isOpen: false, relationData: null });
  };

  // Keep modal data in sync
  useEffect(() => {
    if (detailsModal.isOpen && detailsModal.relationData) {
      const updatedRelation = relations.find(r => r.id === detailsModal.relationData.id);
      if (updatedRelation) {
        setDetailsModal(prev => ({ ...prev, relationData: updatedRelation }));
      }
    }
  }, [relations]);

  const FilterSection = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-teal-300 mb-2">Status</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
          >
            <option value="-1">All Statuses</option>
            <option value="Friendly">🤝 Friendly</option>
            <option value="Neutral">⚖️ Neutral</option>
            <option value="Tense">😤 Tense</option>
            <option value="Hostile">⚔️ Hostile</option>
            <option value="War">💥 War</option>
          </select>
        </div>

        {/* Faction Filter */}
        <div>
          <label className="block text-sm font-medium text-teal-300 mb-2">Faction</label>
          <select
            value={filterFaction}
            onChange={(e) => setFilterFaction(e.target.value)}
            className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
          >
            <option value="-1">All Factions</option>
            {uniqueFactions.map(faction => (
              <option key={faction} value={faction}>{formatName(faction)}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Hidden Only Toggle (DM) */}
      {userIsDM && (
        <div className="flex items-center justify-between bg-teal-600/10 rounded-lg p-4 border border-teal-500/30">
          <span className="text-teal-300 font-medium">Show hidden relations only</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={showHiddenOnly}
              onChange={(e) => setShowHiddenOnly(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
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

  const filteredRelations = getFilteredRelations();

  // Get counts by status
  const statusCounts = {
    'Friendly': filteredRelations.filter(r => r.status === 'Friendly').length,
    'Neutral': filteredRelations.filter(r => r.status === 'Neutral').length,
    'Tense': filteredRelations.filter(r => r.status === 'Tense').length,
    'Hostile': filteredRelations.filter(r => r.status === 'Hostile').length,
    'War': filteredRelations.filter(r => r.status === 'War').length,
  };

  if (localStorage.getItem("loggedIn") === 'false') {
    return <NotLoggedIn />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-teal-900/20 to-gray-900 p-8">
      <Toast message={toast.message} severity={toast.severity} isOpen={toast.open} onClose={hideToast} />
      
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Relations</h1>
            <p className="text-gray-400">Diplomatic relationships between factions</p>
          </div>
          
          {userIsDM && (
            <button
              onClick={addData}
              className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-6 rounded-lg transition-all shadow-lg hover:shadow-teal-500/50"
            >
              Upload Relations
            </button>
          )}
        </div>

        {/* Status Summary */}
        <div className="flex flex-wrap gap-2 mb-4">
          {statusCounts['War'] > 0 && (
            <span className="px-3 py-1 rounded-lg text-sm bg-red-500/20 text-red-300 border border-red-500/30">
              💥 War: {statusCounts['War']}
            </span>
          )}
          {statusCounts['Hostile'] > 0 && (
            <span className="px-3 py-1 rounded-lg text-sm bg-orange-500/20 text-orange-300 border border-orange-500/30">
              ⚔️ Hostile: {statusCounts['Hostile']}
            </span>
          )}
          {statusCounts['Tense'] > 0 && (
            <span className="px-3 py-1 rounded-lg text-sm bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">
              😤 Tense: {statusCounts['Tense']}
            </span>
          )}
          {statusCounts['Neutral'] > 0 && (
            <span className="px-3 py-1 rounded-lg text-sm bg-gray-500/20 text-gray-300 border border-gray-500/30">
              ⚖️ Neutral: {statusCounts['Neutral']}
            </span>
          )}
          {statusCounts['Friendly'] > 0 && (
            <span className="px-3 py-1 rounded-lg text-sm bg-green-500/20 text-green-300 border border-green-500/30">
              🤝 Friendly: {statusCounts['Friendly']}
            </span>
          )}
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search by faction name or root cause..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 pl-12 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
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
              <span className="bg-teal-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
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
          Showing {filteredRelations.length} of {relations.length} relations
        </div>
      </div>

      {/* Relations Grid */}
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-teal-500 mx-auto"></div>
            <p className="text-gray-400 mt-4">Loading relations...</p>
          </div>
        ) : filteredRelations.length === 0 ? (
          <div className="text-center py-20">
            <svg className="w-24 h-24 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p className="text-gray-400 text-xl">No relations found</p>
            <p className="text-gray-500 mt-2">Try adjusting your filters or search term</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRelations.map((relation) => (
              <Relation
                key={relation.id}
                relation={relation}
                onClick={() => openDetailsModal(relation)}
                isHidden={relation.isHidden}
                userIsDM={userIsDM}
              />
            ))}
          </div>
        )}
      </div>

      {/* Details Modal */}
      {detailsModal.isOpen && (
        <RelationModal
          relation={detailsModal.relationData}
          onClose={closeDetailsModal}
          userIsDM={userIsDM}
          onToggleVisibility={toggleVisibility}
          onUpdateSessionNotes={updateSessionNotes}
        />
      )}
    </div>
  );
}