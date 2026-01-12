import { collection, doc, onSnapshot, query, setDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from 'react';
import PersonModal from '../Modals/PersonModal';
import db from '../Structural/Firebase';
import NotLoggedIn from "../Structural/Not_Logged_In";
import { getActiveSession, isDM, requireSession } from '../Structural/Session_Utils';
import Person from "../Sub_Components/Person";

import data from '../Data/PersonData';

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

export default function POI() {
  const [people, setPeople] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('-1');
  const [filterFaction, setFilterFaction] = useState('-1');
  const [filterHostility, setFilterHostility] = useState('-1');
  const [filterSpecies, setFilterSpecies] = useState('-1');
  const [showHiddenOnly, setShowHiddenOnly] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const [detailsModal, setDetailsModal] = useState({ isOpen: false, personData: null });
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
      showToast('Only DMs can upload POI data', 'error');
      return;
    }
  
    const confirmUpload = window.confirm(
      `This will add ${data.length} ${data.length === 1 ? 'person' : 'people'} to the global database (hidden by default in this session). Continue?`
    );
  
    if (!confirmUpload) return;
  
    try {
      for (let i = 0; i < data.length; i++) {
        const personData = {
          ...data[i],
          sessionVisibility: {[getActiveSession()]: 'hidden'}
        };
      
        await setDoc(doc(db, 'POI', data[i].id), personData);
      }
      showToast(`Successfully added ${data.length} ${data.length === 1 ? 'person' : 'people'}!`);
    } catch (error) {
      showToast('Error adding POI data', 'error');
      console.error(error);
    }
  };

  const toggleVisibility = async (personId, currentlyHidden) => {
    if (!userIsDM) {
      showToast('Only DMs can change POI visibility', 'error');
      return;
    }

    try {
      const personRef = doc(db, 'POI', personId);
      const newVisibility = currentlyHidden ? 'visible' : 'hidden';
      
      await updateDoc(personRef, {
        [`sessionVisibility.${sessionId}`]: newVisibility
      });

      showToast(
        `Character ${newVisibility === 'visible' ? 'shown to' : 'hidden from'} players`,
        'success'
      );
    } catch (error) {
      showToast('Error updating POI visibility', 'error');
      console.error(error);
    }
  };

  const updateSessionNotes = async (personId, sessionId, noteText) => {
    if (!userIsDM) {
      showToast('Only DMs can update session notes', 'error');
      return;
    }

    try {
      const personRef = doc(db, 'POI', personId);
      
      await updateDoc(personRef, {
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
      getPOIFromDB();
    }
  }, [sessionId]);

  const getPOIFromDB = () => {
    if (!sessionId) return;

    const q = query(collection(db, 'POI'));

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
      setPeople(queryData);
      setLoading(false);
    });

    return () => unsub();
  };

  // Get unique values for filter dropdowns
  const uniqueFactions = [...new Set(people.map(p => p.affiliations?.primaryGroup).filter(Boolean))].sort();

  const getFilteredPeople = () => {
    let filtered = people;

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
        p.affiliations?.primaryGroup?.toLowerCase().includes(search) ||
        p.affiliations?.rank?.toLowerCase().includes(search) ||
        p.id?.toLowerCase().includes(search)
      );
    }

    // Filter by status
    if (filterStatus !== '-1') {
      filtered = filtered.filter(p => p.status?.primary === filterStatus);
    }

    // Filter by faction
    if (filterFaction !== '-1') {
      filtered = filtered.filter(p => p.affiliations?.primaryGroup === filterFaction);
    }

    // Filter by hostility
    if (filterHostility !== '-1') {
      filtered = filtered.filter(p => p.interaction?.hostilityLevel === filterHostility);
    }

    // Filter by species
    if (filterSpecies !== '-1') {
      filtered = filtered.filter(p => p.species === filterSpecies);
    }

    // Sort by name
    filtered.sort((a, b) => a.name.localeCompare(b.name));

    return filtered;
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filterStatus !== '-1') count++;
    if (filterFaction !== '-1') count++;
    if (filterHostility !== '-1') count++;
    if (filterSpecies !== '-1') count++;
    if (showHiddenOnly) count++;
    return count;
  };

  const resetFilters = () => {
    setFilterStatus('-1');
    setFilterFaction('-1');
    setFilterHostility('-1');
    setFilterSpecies('-1');
    setShowHiddenOnly(false);
  };

  const openDetailsModal = (person) => {
    setDetailsModal({ isOpen: true, personData: person });
  };

  const closeDetailsModal = () => {
    setDetailsModal({ isOpen: false, personData: null });
  };

  // Keep modal data in sync
  useEffect(() => {
    if (detailsModal.isOpen && detailsModal.personData) {
      const updatedPerson = people.find(p => p.id === detailsModal.personData.id);
      if (updatedPerson) {
        setDetailsModal(prev => ({ ...prev, personData: updatedPerson }));
      }
    }
  }, [people]);

  const FilterSection = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-blue-300 mb-2">Status</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            <option value="-1">All Statuses</option>
            <option value="Active">✅ Active</option>
            <option value="Deceased">💀 Deceased</option>
            <option value="Comatose">😴 Comatose</option>
            <option value="MIA">❓ MIA</option>
            <option value="Unknown">🔮 Unknown</option>
          </select>
        </div>

        {/* Faction Filter */}
        <div>
          <label className="block text-sm font-medium text-blue-300 mb-2">Faction</label>
          <select
            value={filterFaction}
            onChange={(e) => setFilterFaction(e.target.value)}
            className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            <option value="-1">All Factions</option>
            {uniqueFactions.map(faction => (
              <option key={faction} value={faction}>{faction}</option>
            ))}
          </select>
        </div>

        {/* Hostility Filter */}
        <div>
          <label className="block text-sm font-medium text-blue-300 mb-2">Hostility</label>
          <select
            value={filterHostility}
            onChange={(e) => setFilterHostility(e.target.value)}
            className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            <option value="-1">All Hostility Levels</option>
            <option value="Friendly">🟢 Friendly</option>
            <option value="Neutral">🟡 Neutral</option>
            <option value="Hostile">🔴 Hostile</option>
            <option value="Varies">🟣 Varies</option>
          </select>
        </div>

        {/* Species Filter */}
        <div>
          <label className="block text-sm font-medium text-blue-300 mb-2">Species</label>
          <select
            value={filterSpecies}
            onChange={(e) => setFilterSpecies(e.target.value)}
            className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            <option value="-1">All Species</option>
            <option value="Human">👤 Human</option>
            <option value="Entity">👁️ Entity</option>
            <option value="Hybrid">🧬 Hybrid</option>
            <option value="Unknown">❓ Unknown</option>
          </select>
        </div>
      </div>

      {/* Hidden Only Toggle (DM) */}
      {userIsDM && (
        <div className="flex items-center justify-between bg-blue-600/10 rounded-lg p-4 border border-blue-500/30">
          <span className="text-blue-300 font-medium">Show hidden characters only</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={showHiddenOnly}
              onChange={(e) => setShowHiddenOnly(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
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

  const filteredPeople = getFilteredPeople();

  // Get counts by hostility
  const hostilityCounts = {
    'Friendly': filteredPeople.filter(p => p.interaction?.hostilityLevel === 'Friendly').length,
    'Neutral': filteredPeople.filter(p => p.interaction?.hostilityLevel === 'Neutral').length,
    'Hostile': filteredPeople.filter(p => p.interaction?.hostilityLevel === 'Hostile').length,
    'Varies': filteredPeople.filter(p => p.interaction?.hostilityLevel === 'Varies').length,
  };

  if (localStorage.getItem("loggedIn") === 'false') {
    return <NotLoggedIn />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-8">
      <Toast message={toast.message} severity={toast.severity} isOpen={toast.open} onClose={hideToast} />
      
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">People of Interest</h1>
            <p className="text-gray-400">Named NPCs, faction members, and recurring characters</p>
          </div>
          
          {userIsDM && (
            <button
              onClick={addData}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all shadow-lg hover:shadow-blue-500/50"
            >
              Upload Characters
            </button>
          )}
        </div>

        {/* Hostility Summary */}
        <div className="flex flex-wrap gap-2 mb-4">
          {hostilityCounts['Friendly'] > 0 && (
            <span className="px-3 py-1 rounded-lg text-sm bg-green-500/20 text-green-300 border border-green-500/30">
              🟢 Friendly: {hostilityCounts['Friendly']}
            </span>
          )}
          {hostilityCounts['Neutral'] > 0 && (
            <span className="px-3 py-1 rounded-lg text-sm bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">
              🟡 Neutral: {hostilityCounts['Neutral']}
            </span>
          )}
          {hostilityCounts['Hostile'] > 0 && (
            <span className="px-3 py-1 rounded-lg text-sm bg-red-500/20 text-red-300 border border-red-500/30">
              🔴 Hostile: {hostilityCounts['Hostile']}
            </span>
          )}
          {hostilityCounts['Varies'] > 0 && (
            <span className="px-3 py-1 rounded-lg text-sm bg-purple-500/20 text-purple-300 border border-purple-500/30">
              🟣 Varies: {hostilityCounts['Varies']}
            </span>
          )}
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search by name, alias, faction, or rank..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 pl-12 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
              <span className="bg-blue-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
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
          Showing {filteredPeople.length} of {people.length} characters
        </div>
      </div>

      {/* POI Grid */}
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-gray-400 mt-4">Loading characters...</p>
          </div>
        ) : filteredPeople.length === 0 ? (
          <div className="text-center py-20">
            <svg className="w-24 h-24 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <p className="text-gray-400 text-xl">No characters found</p>
            <p className="text-gray-500 mt-2">Try adjusting your filters or search term</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPeople.map((person) => (
              <Person
                key={person.id}
                person={person}
                onClick={() => openDetailsModal(person)}
                isHidden={person.isHidden}
                userIsDM={userIsDM}
              />
            ))}
          </div>
        )}
      </div>

      {/* Details Modal */}
      {detailsModal.isOpen && (
        <PersonModal
          person={detailsModal.personData}
          onClose={closeDetailsModal}
          userIsDM={userIsDM}
          onToggleVisibility={toggleVisibility}
          onUpdateSessionNotes={updateSessionNotes}
        />
      )}
    </div>
  );
}