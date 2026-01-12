import { collection, doc, onSnapshot, query, setDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from 'react';
import FactionModal from '../Modals/FactionModal';
import db from '../Structural/Firebase';
import NotLoggedIn from "../Structural/Not_Logged_In";
import { getActiveSession, isDM, requireSession } from '../Structural/Session_Utils';
import Faction from "../Sub_Components/Faction";

import data from '../Data/FactionData';

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

export default function Factions() {
  const [factions, setFactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('-1');
  const [filterInfluence, setFilterInfluence] = useState('-1');
  const [filterHostility, setFilterHostility] = useState('-1');
  const [showHiddenOnly, setShowHiddenOnly] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const [detailsModal, setDetailsModal] = useState({ isOpen: false, factionData: null });
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
      showToast('Only DMs can upload faction data', 'error');
      return;
    }
  
    const confirmUpload = window.confirm(
      `This will add ${data.length} ${data.length === 1 ? 'faction' : 'factions'} to the global database (hidden by default in this session). Continue?`
    );
  
    if (!confirmUpload) return;
  
    try {
      for (let i = 0; i < data.length; i++) {
        const factionData = {
          ...data[i],
          sessionVisibility: {[getActiveSession()]: 'hidden'}
        };
      
        await setDoc(doc(db, 'Factions', data[i].id), factionData);
      }
      showToast(`Successfully added ${data.length} ${data.length === 1 ? 'faction' : 'factions'}!`);
    } catch (error) {
      showToast('Error adding faction data', 'error');
      console.error(error);
    }
  };

  const toggleVisibility = async (factionId, currentlyHidden) => {
    if (!userIsDM) {
      showToast('Only DMs can change faction visibility', 'error');
      return;
    }

    try {
      const factionRef = doc(db, 'Factions', factionId);
      const newVisibility = currentlyHidden ? 'visible' : 'hidden';
      
      await updateDoc(factionRef, {
        [`sessionVisibility.${sessionId}`]: newVisibility
      });

      showToast(
        `Faction ${newVisibility === 'visible' ? 'shown to' : 'hidden from'} players`,
        'success'
      );
    } catch (error) {
      showToast('Error updating faction visibility', 'error');
      console.error(error);
    }
  };

  useEffect(() => {
    if (!requireSession()) return;
    if (localStorage.getItem("loggedIn") !== 'false') {
      getFactionsFromDB();
    }
  }, [sessionId]);

  const getFactionsFromDB = () => {
    if (!sessionId) return;

    const q = query(collection(db, 'Factions'));

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
      setFactions(queryData);
      setLoading(false);
    });

    return () => unsub();
  };

  const getFilteredFactions = () => {
    let filtered = factions;

    // Filter by visibility
    if (showHiddenOnly) {
      filtered = filtered.filter(faction => faction.isHidden);
    } else if (!userIsDM) {
      filtered = filtered.filter(faction => !faction.isHidden);
    }

    // Filter by search term
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(faction =>
        faction.groupName?.toLowerCase().includes(search) ||
        faction.abbreviation?.toLowerCase().includes(search) ||
        faction.knownFor?.toLowerCase().includes(search) ||
        faction.tags?.some(tag => tag.toLowerCase().includes(search))
      );
    }

    // Filter by type
    if (filterType !== '-1') {
      filtered = filtered.filter(faction => 
        faction.primaryType?.includes(filterType)
      );
    }

    // Filter by influence range
    if (filterInfluence !== '-1') {
      const [min, max] = filterInfluence.split('-').map(Number);
      filtered = filtered.filter(faction => 
        faction.metrics?.influence >= min && faction.metrics?.influence <= max
      );
    }

    // Filter by hostility range
    if (filterHostility !== '-1') {
      const [min, max] = filterHostility.split('-').map(Number);
      filtered = filtered.filter(faction => 
        faction.metrics?.hostility >= min && faction.metrics?.hostility <= max
      );
    }

    return filtered;
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filterType !== '-1') count++;
    if (filterInfluence !== '-1') count++;
    if (filterHostility !== '-1') count++;
    if (showHiddenOnly) count++;
    return count;
  };

  const resetFilters = () => {
    setFilterType('-1');
    setFilterInfluence('-1');
    setFilterHostility('-1');
    setShowHiddenOnly(false);
  };

  const openDetailsModal = (faction) => {
    setDetailsModal({ isOpen: true, factionData: faction });
  };

  const closeDetailsModal = () => {
    setDetailsModal({ isOpen: false, factionData: null });
  };

  // Keep modal data synced with live updates
  useEffect(() => {
    if (detailsModal.isOpen && detailsModal.factionData) {
      const updatedFaction = factions.find(f => f.id === detailsModal.factionData.id);
      if (updatedFaction) {
        setDetailsModal(prev => ({ ...prev, factionData: updatedFaction }));
      }
    }
  }, [factions]);

  const FilterSection = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Type Filter */}
        <div>
          <label className="block text-sm font-medium text-amber-300 mb-2">Faction Type</label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
          >
            <option value="-1">All Types</option>
            <option value="Governmental">Governmental</option>
            <option value="Military">Military</option>
            <option value="Trading/Commerce">Trading/Commerce</option>
            <option value="Religious">Religious</option>
            <option value="Criminal/Outlaw">Criminal/Outlaw</option>
            <option value="Scientific/Research">Scientific/Research</option>
            <option value="Exploratory">Exploratory</option>
            <option value="Survival/Refuge">Survival/Refuge</option>
            <option value="Mercenary">Mercenary</option>
            <option value="Cult">Cult</option>
            <option value="Corporate">Corporate</option>
            <option value="Academic">Academic</option>
            <option value="Medical/Humanitarian">Medical/Humanitarian</option>
            <option value="Isolationist">Isolationist</option>
          </select>
        </div>

        {/* Influence Filter */}
        <div>
          <label className="block text-sm font-medium text-amber-300 mb-2">Influence Level</label>
          <select
            value={filterInfluence}
            onChange={(e) => setFilterInfluence(e.target.value)}
            className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
          >
            <option value="-1">All Influence</option>
            <option value="1-3">Low (1-3)</option>
            <option value="4-6">Medium (4-6)</option>
            <option value="7-9">High (7-9)</option>
            <option value="10-10">Dominant (10)</option>
          </select>
        </div>

        {/* Hostility Filter */}
        <div>
          <label className="block text-sm font-medium text-amber-300 mb-2">Hostility Level</label>
          <select
            value={filterHostility}
            onChange={(e) => setFilterHostility(e.target.value)}
            className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
          >
            <option value="-1">All Hostility</option>
            <option value="1-3">Welcoming (1-3)</option>
            <option value="4-6">Neutral (4-6)</option>
            <option value="7-9">Aggressive (7-9)</option>
            <option value="10-10">Hostile (10)</option>
          </select>
        </div>
      </div>

      {/* Hidden Only Toggle */}
      {userIsDM && (
        <div className="flex items-center justify-between bg-amber-600/10 rounded-lg p-4 border border-amber-500/30">
          <span className="text-amber-300 font-medium">Show hidden factions only</span>
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

  const filteredFactions = getFilteredFactions();

  if (localStorage.getItem("loggedIn") === 'false') {
    return <NotLoggedIn />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-amber-900 to-gray-900 p-8">
      <Toast message={toast.message} severity={toast.severity} isOpen={toast.open} onClose={hideToast} />
      
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Faction Database</h1>
            <p className="text-gray-400">Browse organizations and groups of the Backrooms</p>
          </div>
          
          {userIsDM && (
            <button
              onClick={addData}
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-6 rounded-lg transition-all shadow-lg hover:shadow-amber-500/50"
            >
              Upload Factions
            </button>
          )}
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search factions by name, abbreviation, or tags..."
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
          Showing {filteredFactions.length} of {factions.length} factions
        </div>
      </div>

      {/* Faction Grid */}
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-amber-500 mx-auto"></div>
            <p className="text-gray-400 mt-4">Loading factions...</p>
          </div>
        ) : filteredFactions.length === 0 ? (
          <div className="text-center py-20">
            <svg className="w-24 h-24 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-gray-400 text-xl">No factions found</p>
            <p className="text-gray-500 mt-2">Try adjusting your filters or search term</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFactions.map((faction) => (
              <Faction
                key={faction.id}
                faction={faction}
                onClick={() => openDetailsModal(faction)}
                isHidden={faction.isHidden}
                userIsDM={userIsDM}
              />
            ))}
          </div>
        )}
      </div>

      {/* Details Modal */}
      {detailsModal.isOpen && (
        <FactionModal
          faction={detailsModal.factionData}
          onClose={closeDetailsModal}
          userIsDM={userIsDM}
          onToggleVisibility={toggleVisibility}
        />
      )}
    </div>
  );
}