import React, { useState, useEffect } from 'react';
import { collection, doc, onSnapshot, orderBy, query, setDoc } from "firebase/firestore";
import db from '../Components/firebase';
import People from "../Components/people";
import NotLoggedIn from "../Components/notLoggedIn";

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

export default function PeopleOfInterest() {
  const [people, setPeople] = useState([]);
  const [name, setName] = useState('');
  const [groupFilter, setGroupFilter] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');
  const [fighterFilter, setFighterFilter] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const [showDetails, setShowDetails] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);

  const data = [];

  const showToast = (message, severity = 'success') => {
    setToast({ open: true, message, severity });
  };

  const hideToast = () => {
    setToast({ ...toast, open: false });
  };

  const addData = async () => {
    try {
      for(let i = 0; i < data.length; i++) {
        await setDoc(doc(db, 'PeopleOfInterest', data[i].name), {
          name: data[i].name,
          introduction: data[i].introduction,
          reason: data[i].reason,
          personality: data[i].personality,
          spawnLocations: data[i].spawnLocations,
          associatedGroup: data[i].associatedGroup,
          hidden: data[i].hidden,
          importantAffiliations: data[i].importantAffiliations,
          fighter: data[i].fighter,
          stats: data[i].stats,
          soak: data[i].soak,
          wounds: data[i].wounds,
          strain: data[i].strain,
          defenses: data[i].defenses,
          skills: data[i].skills,
          talents: data[i].talents,
          abilities: data[i].abilities,
          actions: data[i].actions,
          equipment: data[i].equipment,
          difficulty: data[i].difficulty
        });
      }
      showToast('People data added successfully!');
    } catch (error) {
      showToast('Error adding people data', 'error');
      console.error(error);
    }
  };

  const getFromDB = () => {
    const q = query(collection(db, 'PeopleOfInterest'), orderBy("name", "asc"));
    const unsub = onSnapshot(q, (querySnapshot) => {
      const queryData = [];
      querySnapshot.forEach((doc) => {
        queryData.push(doc.data());
      });
      setPeople(queryData);
      setLoading(false);
    });

    return () => { unsub(); };
  };

  const getUniqueGroups = () => {
    const groups = [...new Set(people.map(person => person.associatedGroup).filter(group => group && typeof group === 'string' && group.trim() !== ''))];
    return groups.sort();
  };

  const getUniqueDifficulties = () => {
    const difficulties = [...new Set(people.map(person => person.difficulty).filter(diff => diff && typeof diff === 'string' && diff.trim() !== ''))];
    return difficulties.sort();
  };

  const getFilteredPeople = () => {
    return people.filter(person => {
      const matchesName = !name || 
        (person.name && person.name.toLowerCase().includes(name.toLowerCase())) ||
        (person.introduction && person.introduction.toLowerCase().includes(name.toLowerCase())) ||
        (person.personality && person.personality.toLowerCase().includes(name.toLowerCase()));
      
      const matchesGroup = !groupFilter || (person.associatedGroup && person.associatedGroup === groupFilter);
      const matchesDifficulty = !difficultyFilter || (person.difficulty && person.difficulty === difficultyFilter);
      const matchesFighter = !fighterFilter || (person.fighter && person.fighter === fighterFilter);
      const matchesVisibility = person.hidden === 'No' || localStorage.getItem('loggedIn')?.toUpperCase() === 'ADMIN';
      
      return matchesName && matchesGroup && matchesDifficulty && matchesFighter && matchesVisibility;
    });
  };

  const clearAllFilters = () => {
    setName('');
    setGroupFilter('');
    setDifficultyFilter('');
    setFighterFilter('');
    showToast('All filters cleared');
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (name !== '') count++;
    if (groupFilter !== '') count++;
    if (difficultyFilter !== '') count++;
    if (fighterFilter !== '') count++;
    return count;
  };

  const handlePersonSelect = (person) => {
    setSelectedPerson(person);
    setShowDetails(true);
  };

  const handleBackToList = () => {
    setShowDetails(false);
  };

  useEffect(() => {
    if (localStorage.getItem("loggedIn") !== 'false') {
      getFromDB();
    }
  }, []);

  if (localStorage.getItem("loggedIn") === 'false') {
    return <NotLoggedIn />;
  }

  const FilterChip = ({ label, onDelete }) => (
    <div className="inline-flex items-center space-x-2 bg-pink-500/20 text-pink-300 px-3 py-1 rounded-full text-sm border border-pink-500/30">
      <span>{label}</span>
      <button
        onClick={onDelete}
        className="text-pink-400 hover:text-pink-200 transition-colors"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
        </svg>
      </button>
    </div>
  );

  const FilterSection = () => (
    <div className="space-y-6">
      {/* Filter Controls Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Associated Group</label>
          <select
            value={groupFilter}
            onChange={(e) => setGroupFilter(e.target.value)}
            className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
          >
            <option value="" className="bg-gray-800">Any Group</option>
            {getUniqueGroups().map(group => (
              <option key={group} value={group} className="bg-gray-800">{group}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Difficulty Level</label>
          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
          >
            <option value="" className="bg-gray-800">Any Difficulty</option>
            {getUniqueDifficulties().map(difficulty => (
              <option key={difficulty} value={difficulty} className="bg-gray-800">{difficulty}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Fighter Status</label>
          <select
            value={fighterFilter}
            onChange={(e) => setFighterFilter(e.target.value)}
            className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
          >
            <option value="" className="bg-gray-800">Any Status</option>
            <option value="Yes" className="bg-gray-800">Fighter</option>
            <option value="No" className="bg-gray-800">Non-Fighter</option>
          </select>
        </div>

        <div className="sm:col-span-2 space-y-2">
          <label className="text-sm font-medium text-gray-300">Actions</label>
          <button
            onClick={clearAllFilters}
            disabled={getActiveFilterCount() === 0}
            className="w-full bg-gradient-to-r from-red-600/20 to-pink-600/20 hover:from-red-600/30 hover:to-pink-600/30 disabled:from-gray-600/20 disabled:to-gray-700/20 text-red-300 disabled:text-gray-500 font-medium px-4 py-3 rounded-lg border border-red-500/30 disabled:border-gray-500/30 transition-all duration-300 hover:scale-105 disabled:hover:scale-100 flex items-center justify-center space-x-2"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
            </svg>
            <span>Clear Filters</span>
          </button>
        </div>
      </div>

      {/* Active Filters */}
      {getActiveFilterCount() > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-300">Active Filters:</h3>
            <button
              onClick={clearAllFilters}
              className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors flex items-center space-x-1"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
              </svg>
              <span>Clear All</span>
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {name && (
              <FilterChip
                label={`Name: "${name}"`}
                onDelete={() => setName('')}
              />
            )}
            {groupFilter && (
              <FilterChip
                label={`Group: ${groupFilter}`}
                onDelete={() => setGroupFilter('')}
              />
            )}
            {difficultyFilter && (
              <FilterChip
                label={`Difficulty: ${difficultyFilter}`}
                onDelete={() => setDifficultyFilter('')}
              />
            )}
            {fighterFilter && (
              <FilterChip
                label={`Fighter: ${fighterFilter}`}
                onDelete={() => setFighterFilter('')}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );

  const DisplayItems = () => {
    const filteredPeople = getFilteredPeople();

    if (filteredPeople.length === 0) {
      return (
        <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-12 text-center">
          <svg className="w-16 h-16 text-gray-500 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"></path>
          </svg>
          <h3 className="text-xl font-semibold text-white mb-2">No people found</h3>
          <p className="text-gray-400 mb-4">Try adjusting your search criteria to find more people</p>
          <button
            onClick={clearAllFilters}
            className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Clear All Filters
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <svg className="w-6 h-6 text-pink-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"></path>
            </svg>
            <h2 className="text-xl font-bold text-white">
              Found {filteredPeople.length} person{filteredPeople.length !== 1 ? 's' : ''}
            </h2>
          </div>
          <span className="bg-pink-500/20 text-pink-300 px-3 py-1 rounded-full text-sm font-bold">
            {people.length} total
          </span>
        </div>

        {/* People Grid */}
        <div className="flex flex-wrap justify-center gap-6">
          {filteredPeople.map((person, index) => (
            <div key={index} className="transform transition-all duration-300 hover:scale-105">
              <People currPerson={person} onPersonSelect={handlePersonSelect} />
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-pink-900 to-rose-900">
      <div className="max-w-full mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-900/50 to-rose-900/50 backdrop-blur-lg rounded-2xl border border-white/10 p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center">
                <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"></path>
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">People of Interest</h1>
                <p className="text-pink-300">Browse and search through notable individuals</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {showDetails && (
                <button
                  onClick={handleBackToList}
                  className="xl:hidden bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd"></path>
                  </svg>
                  <span>Back to List</span>
                </button>
              )}
              
              {localStorage.getItem('loggedIn')?.toUpperCase() === 'ADMIN' && (
                <button 
                  onClick={addData}
                  className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"></path>
                  </svg>
                  <span>Add Data</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-12">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-400 mb-4"></div>
              <h3 className="text-xl font-semibold text-white mb-2">Loading people collection...</h3>
              <p className="text-gray-400">Please wait while we fetch the data</p>
            </div>
          </div>
        ) : people.length > 0 ? (
          <>
            {/* Mobile Detail View */}
            {showDetails && (
              <div className="xl:hidden">
                <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
                  {selectedPerson && <People currPerson={selectedPerson} />}
                </div>
              </div>
            )}

            {/* Desktop Layout or Mobile List */}
            <div className={`${showDetails ? 'hidden xl:block' : 'block'}`}>
              {/* Search and Filter Section */}
              <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 overflow-hidden mb-6">
                <div className="bg-gradient-to-r from-pink-600/20 to-rose-600/20 p-4 border-b border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <svg className="w-6 h-6 text-pink-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M3 7v10a2 2 0 002 2h14l-2-2H5V7h14V5a2 2 0 00-2-2H5a2 2 0 00-2 2v2z"></path>
                        <path d="M21 7H3v2h18V7z"></path>
                      </svg>
                      <h2 className="text-xl font-bold text-white">Search & Filter</h2>
                      {getActiveFilterCount() > 0 && (
                        <span className="bg-pink-500/30 text-pink-300 px-2 py-1 rounded-full text-xs font-bold">
                          {getActiveFilterCount()} active
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="bg-pink-500/20 text-pink-300 px-3 py-1 rounded-full text-sm font-bold">
                        {getFilteredPeople().length} shown
                      </span>
                      <button 
                        onClick={() => setFiltersOpen(!filtersOpen)}
                        className="md:hidden bg-pink-600/20 hover:bg-pink-600/30 text-pink-400 p-2 rounded-lg transition-colors"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* Search Bar - Always Visible */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                    <input
                      type="text"
                      placeholder="Search by name, introduction, or personality..."
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-white/5 border border-white/20 rounded-xl pl-12 pr-12 py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all text-lg"
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

                  {/* Advanced Filters - Collapsible on Mobile */}
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

              {/* Results */}
              <DisplayItems />
            </div>
          </>
        ) : (
          <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-12">
            <div className="flex flex-col items-center justify-center text-center">
              <svg className="w-16 h-16 text-gray-500 mb-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"></path>
              </svg>
              <h3 className="text-xl font-semibold text-white mb-2">No people data available</h3>
              <p className="text-gray-400">There are currently no people in the database</p>
            </div>
          </div>
        )}

        {/* Mobile Filter Fab */}
        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          className="md:hidden fixed bottom-6 right-6 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 transform hover:scale-110"
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

      {/* Toast Notification */}
      <Toast 
        message={toast.message}
        severity={toast.severity} 
        isOpen={toast.open} 
        onClose={hideToast} 
      />
    </div>
  );
}