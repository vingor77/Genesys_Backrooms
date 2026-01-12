import { collection, doc, onSnapshot, query, setDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from 'react';
import EntityModal from '../Modals/EntityModal';
import db from '../Structural/Firebase';
import NotLoggedIn from "../Structural/Not_Logged_In";
import { getActiveSession, isDM, requireSession } from '../Structural/Session_Utils';
import Entity from "../Sub_Components/Entity";

import data from '../Data/EntityData';

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

export default function Entities() {
  const [entities, setEntities] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('-1');
  const [filterAdversaryType, setFilterAdversaryType] = useState('-1');
  const [filterDifficulty, setFilterDifficulty] = useState('-1');
  const [showHiddenOnly, setShowHiddenOnly] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const [detailsModal, setDetailsModal] = useState({ isOpen: false, entityData: null });
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
      showToast('Only DMs can upload entity data', 'error');
      return;
    }
  
    const confirmUpload = window.confirm(
      `This will add ${data.length} ${data.length === 1 ? 'entity' : 'entities'} to the global database (hidden by default in this session). Continue?`
    );
  
    if (!confirmUpload) return;
  
    try {
      for (let i = 0; i < data.length; i++) {
        const entityData = {
          ...data[i],
          sessionVisibility: {[getActiveSession()]: 'hidden'}
        };
      
        await setDoc(doc(db, 'Entities', data[i].id), entityData);
      }
      showToast(`Successfully added ${data.length} ${data.length === 1 ? 'entity' : 'entities'}!`);
    } catch (error) {
      showToast('Error adding entity data', 'error');
      console.error(error);
    }
  };

  const toggleVisibility = async (entityId, currentlyHidden) => {
    if (!userIsDM) {
      showToast('Only DMs can change entity visibility', 'error');
      return;
    }

    try {
      const entityRef = doc(db, 'Entities', entityId);
      const newVisibility = currentlyHidden ? 'visible' : 'hidden';
      
      await updateDoc(entityRef, {
        [`sessionVisibility.${sessionId}`]: newVisibility
      });

      showToast(
        `Entity ${newVisibility === 'visible' ? 'shown to' : 'hidden from'} players`,
        'success'
      );
    } catch (error) {
      showToast('Error updating entity visibility', 'error');
      console.error(error);
    }
  };

  useEffect(() => {
    if (!requireSession()) return;
    if (localStorage.getItem("loggedIn") !== 'false') {
      getEntitiesFromDB();
    }
  }, [sessionId]);

  const getEntitiesFromDB = () => {
    if (!sessionId) return;

    const q = query(collection(db, 'Entities'));

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
      setEntities(queryData);
      setLoading(false);
    });

    return () => unsub();
  };

  const getFilteredEntities = () => {
    let filtered = entities;

    // Filter by visibility
    if (showHiddenOnly) {
      filtered = filtered.filter(entity => entity.isHidden);
    } else if (!userIsDM) {
      filtered = filtered.filter(entity => !entity.isHidden);
    }

    // Filter by search term
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(entity =>
        entity.name?.toLowerCase().includes(search) ||
        entity.aliases?.some(alias => alias.toLowerCase().includes(search)) ||
        entity.description?.appearance?.toLowerCase().includes(search) ||
        entity.tags?.some(tag => tag.toLowerCase().includes(search))
      );
    }

    // Filter by category
    if (filterCategory !== '-1') {
      filtered = filtered.filter(entity => 
        entity.category === filterCategory
      );
    }

    // Filter by adversary type
    if (filterAdversaryType !== '-1') {
      filtered = filtered.filter(entity => 
        entity.adversaryType === filterAdversaryType
      );
    }

    // Filter by difficulty range
    if (filterDifficulty !== '-1') {
      const [min, max] = filterDifficulty.split('-').map(Number);
      filtered = filtered.filter(entity => 
        entity.difficultyRating >= min && entity.difficultyRating <= max
      );
    }

    return filtered;
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filterCategory !== '-1') count++;
    if (filterAdversaryType !== '-1') count++;
    if (filterDifficulty !== '-1') count++;
    if (showHiddenOnly) count++;
    return count;
  };

  const resetFilters = () => {
    setFilterCategory('-1');
    setFilterAdversaryType('-1');
    setFilterDifficulty('-1');
    setShowHiddenOnly(false);
  };

  const openDetailsModal = (entity) => {
    setDetailsModal({ isOpen: true, entityData: entity });
  };

  const closeDetailsModal = () => {
    setDetailsModal({ isOpen: false, entityData: null });
  };

  // Keep modal data synced with live updates
  useEffect(() => {
    if (detailsModal.isOpen && detailsModal.entityData) {
      const updatedEntity = entities.find(e => e.id === detailsModal.entityData.id);
      if (updatedEntity) {
        setDetailsModal(prev => ({ ...prev, entityData: updatedEntity }));
      }
    }
  }, [entities]);

  const FilterSection = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-red-300 mb-2">Category</label>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
          >
            <option value="-1">All Categories</option>
            <option value="Hostile">Hostile</option>
            <option value="Boss">Boss</option>
            <option value="Neutral">Neutral</option>
            <option value="Beneficial">Beneficial</option>
            <option value="Ambient">Ambient</option>
            <option value="Environmental">Environmental</option>
            <option value="Anomalous">Anomalous</option>
            <option value="Intelligent">Intelligent</option>
          </select>
        </div>

        {/* Adversary Type Filter */}
        <div>
          <label className="block text-sm font-medium text-red-300 mb-2">Adversary Type</label>
          <select
            value={filterAdversaryType}
            onChange={(e) => setFilterAdversaryType(e.target.value)}
            className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
          >
            <option value="-1">All Types</option>
            <option value="minion">Minion</option>
            <option value="rival">Rival</option>
            <option value="nemesis">Nemesis</option>
          </select>
        </div>

        {/* Difficulty Filter */}
        <div>
          <label className="block text-sm font-medium text-red-300 mb-2">Difficulty Rating</label>
          <select
            value={filterDifficulty}
            onChange={(e) => setFilterDifficulty(e.target.value)}
            className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
          >
            <option value="-1">All Difficulties</option>
            <option value="1-2">Trivial (1-2)</option>
            <option value="3-4">Easy (3-4)</option>
            <option value="5-6">Average (5-6)</option>
            <option value="7-8">Hard (7-8)</option>
            <option value="9-10">Legendary (9-10)</option>
          </select>
        </div>
      </div>

      {/* Hidden Only Toggle */}
      {userIsDM && (
        <div className="flex items-center justify-between bg-red-600/10 rounded-lg p-4 border border-red-500/30">
          <span className="text-red-300 font-medium">Show hidden entities only</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={showHiddenOnly}
              onChange={(e) => setShowHiddenOnly(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
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

  const filteredEntities = getFilteredEntities();

  if (localStorage.getItem("loggedIn") === 'false') {
    return <NotLoggedIn />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-gray-900 p-8">
      <Toast message={toast.message} severity={toast.severity} isOpen={toast.open} onClose={hideToast} />
      
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Entity Database</h1>
            <p className="text-gray-400">Browse creatures and beings of the Backrooms</p>
          </div>
          
          {userIsDM && (
            <button
              onClick={addData}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-all shadow-lg hover:shadow-red-500/50"
            >
              Upload Entities
            </button>
          )}
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search entities by name, alias, description, or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 pl-12 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
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
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
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
          Showing {filteredEntities.length} of {entities.length} entities
        </div>
      </div>

      {/* Entity Grid */}
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-500 mx-auto"></div>
            <p className="text-gray-400 mt-4">Loading entities...</p>
          </div>
        ) : filteredEntities.length === 0 ? (
          <div className="text-center py-20">
            <svg className="w-24 h-24 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-gray-400 text-xl">No entities found</p>
            <p className="text-gray-500 mt-2">Try adjusting your filters or search term</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEntities.map((entity) => (
              <Entity
                key={entity.id}
                entity={entity}
                onClick={() => openDetailsModal(entity)}
                isHidden={entity.isHidden}
                userIsDM={userIsDM}
              />
            ))}
          </div>
        )}
      </div>

      {/* Details Modal */}
      {detailsModal.isOpen && (
        <EntityModal
          entity={detailsModal.entityData}
          onClose={closeDetailsModal}
          userIsDM={userIsDM}
          onToggleVisibility={toggleVisibility}
        />
      )}
    </div>
  );
}