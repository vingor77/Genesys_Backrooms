import { collection, doc, onSnapshot, query, setDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from 'react';
import ObjectModal from '../Modals/ObjectModal';
import db from '../Structural/Firebase';
import NotLoggedIn from "../Structural/Not_Logged_In";
import { getActiveSession, isDM, requireSession } from '../Structural/Session_Utils';
import Object from "../Sub_Components/Object";

import data from '../Data/ObjectData';

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

export default function Objects() {
  const [objects, setObjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('-1');
  const [filterRarityMin, setFilterRarityMin] = useState('-1');
  const [filterRarityMax, setFilterRarityMax] = useState('-1');
  const [filterCraftable, setFilterCraftable] = useState('-1');
  const [filterSetOnly, setFilterSetOnly] = useState(false);
  const [filterCursedOnly, setFilterCursedOnly] = useState(false);
  const [showHiddenOnly, setShowHiddenOnly] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const [detailsModal, setDetailsModal] = useState({ isOpen: false, objectData: null });
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
      showToast('Only DMs can upload object data', 'error');
      return;
    }
  
    const confirmUpload = window.confirm(
      `This will add ${data.length} ${data.length === 1 ? 'object' : 'objects'} to the global database (hidden by default in this session). Continue?`
    );
  
    if (!confirmUpload) return;
  
    try {
      for (let i = 0; i < data.length; i++) {
        const objectData = {
          ...data[i],
          sessionVisibility: {[getActiveSession()]: 'hidden'}
        };
      
        await setDoc(doc(db, 'Objects', data[i].id), objectData);
      }
      showToast(`Successfully added ${data.length} ${data.length === 1 ? 'object' : 'objects'}!`);
    } catch (error) {
      showToast('Error adding object data', 'error');
      console.error(error);
    }
  };

  const toggleVisibility = async (objectId, currentlyHidden) => {
    if (!userIsDM) {
      showToast('Only DMs can change object visibility', 'error');
      return;
    }

    try {
      const objectRef = doc(db, 'Objects', objectId);
      const newVisibility = currentlyHidden ? 'visible' : 'hidden';
      
      await updateDoc(objectRef, {
        [`sessionVisibility.${sessionId}`]: newVisibility
      });

      showToast(
        `Object ${newVisibility === 'visible' ? 'shown to' : 'hidden from'} players`,
        'success'
      );
    } catch (error) {
      showToast('Error updating object visibility', 'error');
      console.error(error);
    }
  };

  const updateSessionNotes = async (objectId, sessionId, noteText) => {
    if (!userIsDM) {
      showToast('Only DMs can update session notes', 'error');
      return;
    }

    try {
      const objectRef = doc(db, 'Objects', objectId);
      
      await updateDoc(objectRef, {
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
      getObjectsFromDB();
    }
  }, [sessionId]);

  const getObjectsFromDB = () => {
    if (!sessionId) return;

    const q = query(collection(db, 'Objects'));

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
      setObjects(queryData);
      setLoading(false);
    });

    return () => unsub();
  };

  const getFilteredObjects = () => {
    let filtered = objects;

    // Filter by visibility
    if (showHiddenOnly) {
      filtered = filtered.filter(obj => obj.isHidden);
    } else if (!userIsDM) {
      filtered = filtered.filter(obj => !obj.isHidden);
    }

    // Filter by search term
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(obj =>
        obj.name?.toLowerCase().includes(search) ||
        obj.description?.toLowerCase().includes(search) ||
        obj.id?.toLowerCase().includes(search) ||
        obj.mechanical_effect?.toLowerCase().includes(search)
      );
    }

    // Filter by type
    if (filterType !== '-1') {
      filtered = filtered.filter(obj => obj.type === filterType);
    }

    // Filter by rarity range
    if (filterRarityMin !== '-1') {
      filtered = filtered.filter(obj => obj.rarity >= parseInt(filterRarityMin));
    }
    if (filterRarityMax !== '-1') {
      filtered = filtered.filter(obj => obj.rarity <= parseInt(filterRarityMax));
    }

    // Filter by craftable
    if (filterCraftable !== '-1') {
      filtered = filtered.filter(obj => obj.craftable === (filterCraftable === 'true'));
    }

    // Filter by set membership
    if (filterSetOnly) {
      filtered = filtered.filter(obj => obj.set_name);
    }

    // Filter by cursed
    if (filterCursedOnly) {
      filtered = filtered.filter(obj => obj.curse?.is_cursed);
    }

    // Sort by type, then rarity (descending), then name
    filtered.sort((a, b) => {
      const typeOrder = ['Weapon', 'Armor', 'Mundane Object', 'Anomalous Object', 'Construct'];
      const typeA = typeOrder.indexOf(a.type);
      const typeB = typeOrder.indexOf(b.type);
      if (typeA !== typeB) return typeA - typeB;
      if (a.rarity !== b.rarity) return b.rarity - a.rarity;
      return a.name.localeCompare(b.name);
    });

    return filtered;
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filterType !== '-1') count++;
    if (filterRarityMin !== '-1') count++;
    if (filterRarityMax !== '-1') count++;
    if (filterCraftable !== '-1') count++;
    if (filterSetOnly) count++;
    if (filterCursedOnly) count++;
    if (showHiddenOnly) count++;
    return count;
  };

  const resetFilters = () => {
    setFilterType('-1');
    setFilterRarityMin('-1');
    setFilterRarityMax('-1');
    setFilterCraftable('-1');
    setFilterSetOnly(false);
    setFilterCursedOnly(false);
    setShowHiddenOnly(false);
  };

  const openDetailsModal = (object) => {
    setDetailsModal({ isOpen: true, objectData: object });
  };

  const closeDetailsModal = () => {
    setDetailsModal({ isOpen: false, objectData: null });
  };

  // Keep modal data in sync with object updates
  useEffect(() => {
    if (detailsModal.isOpen && detailsModal.objectData) {
      const updatedObject = objects.find(o => o.id === detailsModal.objectData.id);
      if (updatedObject) {
        setDetailsModal(prev => ({ ...prev, objectData: updatedObject }));
      }
    }
  }, [objects]);

  const FilterSection = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Type Filter */}
        <div>
          <label className="block text-sm font-medium text-purple-300 mb-2">Object Type</label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          >
            <option value="-1">All Types</option>
            <option value="Weapon">⚔️ Weapon</option>
            <option value="Armor">🛡️ Armor</option>
            <option value="Mundane Object">🔧 Mundane Object</option>
            <option value="Anomalous Object">✨ Anomalous Object</option>
            <option value="Construct">🏗️ Construct</option>
          </select>
        </div>

        {/* Craftable Filter */}
        <div>
          <label className="block text-sm font-medium text-purple-300 mb-2">Craftable</label>
          <select
            value={filterCraftable}
            onChange={(e) => setFilterCraftable(e.target.value)}
            className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          >
            <option value="-1">Any</option>
            <option value="true">Craftable Only</option>
            <option value="false">Non-Craftable Only</option>
          </select>
        </div>

        {/* Rarity Min */}
        <div>
          <label className="block text-sm font-medium text-purple-300 mb-2">Min Rarity</label>
          <select
            value={filterRarityMin}
            onChange={(e) => setFilterRarityMin(e.target.value)}
            className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          >
            <option value="-1">Any</option>
            {[0,1,2,3,4,5,6,7,8,9,10].map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Rarity Max */}
        <div>
          <label className="block text-sm font-medium text-purple-300 mb-2">Max Rarity</label>
          <select
            value={filterRarityMax}
            onChange={(e) => setFilterRarityMax(e.target.value)}
            className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          >
            <option value="-1">Any</option>
            {[0,1,2,3,4,5,6,7,8,9,10].map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>

        {/* Set Only Toggle */}
        <div className="flex items-center">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={filterSetOnly}
              onChange={(e) => setFilterSetOnly(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600 relative"></div>
            <span className="ml-3 text-sm font-medium text-purple-300">Set Items Only</span>
          </label>
        </div>

        {/* Cursed Only Toggle */}
        <div className="flex items-center">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={filterCursedOnly}
              onChange={(e) => setFilterCursedOnly(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600 relative"></div>
            <span className="ml-3 text-sm font-medium text-red-300">Cursed Only</span>
          </label>
        </div>
      </div>

      {/* Hidden Only Toggle (DM) */}
      {userIsDM && (
        <div className="flex items-center justify-between bg-purple-600/10 rounded-lg p-4 border border-purple-500/30">
          <span className="text-purple-300 font-medium">Show hidden objects only</span>
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

  const filteredObjects = getFilteredObjects();

  // Get counts by type for display
  const typeCounts = {
    'Weapon': filteredObjects.filter(o => o.type === 'Weapon').length,
    'Armor': filteredObjects.filter(o => o.type === 'Armor').length,
    'Mundane Object': filteredObjects.filter(o => o.type === 'Mundane Object').length,
    'Anomalous Object': filteredObjects.filter(o => o.type === 'Anomalous Object').length,
    'Construct': filteredObjects.filter(o => o.type === 'Construct').length,
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
            <h1 className="text-4xl font-bold text-white mb-2">Backrooms Objects</h1>
            <p className="text-gray-400">Browse weapons, armor, items, and constructs</p>
          </div>
          
          {userIsDM && (
            <button
              onClick={addData}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-all shadow-lg hover:shadow-purple-500/50"
            >
              Upload Objects
            </button>
          )}
        </div>

        {/* Type Summary */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="px-3 py-1 rounded-lg text-sm bg-red-500/20 text-red-300 border border-red-500/30">
            ⚔️ {typeCounts['Weapon']} Weapons
          </span>
          <span className="px-3 py-1 rounded-lg text-sm bg-blue-500/20 text-blue-300 border border-blue-500/30">
            🛡️ {typeCounts['Armor']} Armor
          </span>
          <span className="px-3 py-1 rounded-lg text-sm bg-gray-500/20 text-gray-300 border border-gray-500/30">
            🔧 {typeCounts['Mundane Object']} Mundane
          </span>
          <span className="px-3 py-1 rounded-lg text-sm bg-purple-500/20 text-purple-300 border border-purple-500/30">
            ✨ {typeCounts['Anomalous Object']} Anomalous
          </span>
          <span className="px-3 py-1 rounded-lg text-sm bg-amber-500/20 text-amber-300 border border-amber-500/30">
            🏗️ {typeCounts['Construct']} Constructs
          </span>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search objects by name, description, or effect..."
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
          Showing {filteredObjects.length} of {objects.length} objects
        </div>
      </div>

      {/* Object Grid */}
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
            <p className="text-gray-400 mt-4">Loading objects...</p>
          </div>
        ) : filteredObjects.length === 0 ? (
          <div className="text-center py-20">
            <svg className="w-24 h-24 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-gray-400 text-xl">No objects found</p>
            <p className="text-gray-500 mt-2">Try adjusting your filters or search term</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredObjects.map((object) => (
              <Object
                key={object.id}
                object={object}
                onClick={() => openDetailsModal(object)}
                isHidden={object.isHidden}
                userIsDM={userIsDM}
              />
            ))}
          </div>
        )}
      </div>

      {/* Details Modal */}
      {detailsModal.isOpen && (
        <ObjectModal
          object={detailsModal.objectData}
          onClose={closeDetailsModal}
          userIsDM={userIsDM}
          onToggleVisibility={toggleVisibility}
          onUpdateSessionNotes={updateSessionNotes}
        />
      )}
    </div>
  );
}