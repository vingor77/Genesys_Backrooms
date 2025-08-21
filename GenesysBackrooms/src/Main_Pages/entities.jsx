import React, { useMemo, useState, useEffect } from 'react';
import { collection, doc, onSnapshot, orderBy, query, setDoc } from "firebase/firestore";
import db from '../Components/firebase';
import EntityItem from "../Components/entityItem";
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

export default function Entities() {
  const [entities, setEntities] = useState([]);
  const [currEntity, setCurrEntity] = useState('Deathmoth');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('All');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [showDetails, setShowDetails] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  const showToast = (message, severity = 'success') => {
    setToast({ open: true, message, severity });
  };

  const hideToast = () => {
    setToast({ ...toast, open: false });
  };

  const getFromDB = () => {
    const q = query(collection(db, 'Entities'), orderBy("name", "asc"));
    const unsub = onSnapshot(q, (querySnapshot) => {
      const queryData = [];
      querySnapshot.forEach((doc) => {
        queryData.push(doc.data());
      });
      setEntities(queryData);
      setLoading(false);
    });

    return () => { unsub(); };
  };

  useEffect(() => {
    if (entities.length === 0) {
      getFromDB();
    }
  }, []);

  // Helper functions for styling
  const getDifficultyColor = (difficulty) => {
    if (difficulty < 2) return { color: 'bg-green-500/20 text-green-300 border-green-500/30', label: 'Easy' };
    if (difficulty < 4) return { color: 'bg-blue-500/20 text-blue-300 border-blue-500/30', label: 'Medium' };
    if (difficulty < 6) return { color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30', label: 'Hard' };
    if (difficulty < 8) return { color: 'bg-orange-500/20 text-orange-300 border-orange-500/30', label: 'Very Hard' };
    return { color: 'bg-red-500/20 text-red-300 border-red-500/30', label: 'Extreme' };
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Minion': return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
      case 'Rival': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'Nemesis': return 'bg-red-500/20 text-red-300 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getDifficultyRange = (difficulty) => {
    if (difficulty < 2) return 'Easy';
    if (difficulty < 4) return 'Medium';
    if (difficulty < 6) return 'Hard';
    if (difficulty < 8) return 'Very Hard';
    return 'Extreme';
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (searchTerm !== '') count++;
    if (filterType !== 'All') count++;
    if (difficultyFilter !== 'All') count++;
    return count;
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setFilterType('All');
    setDifficultyFilter('All');
    showToast('All filters cleared');
  };

  // Filtered entities based on search, type filter, and difficulty filter
  const filteredEntities = useMemo(() => {
    return entities.filter(entity => {
      const matchesSearch = entity.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          entity.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'All' || entity.type === filterType;
      const matchesDifficulty = difficultyFilter === 'All' || getDifficultyRange(entity.difficulty) === difficultyFilter;
      
      return matchesSearch && matchesType && matchesDifficulty;
    });
  }, [entities, searchTerm, filterType, difficultyFilter]);

  const handleEntitySelect = (entityName) => {
    setCurrEntity(entityName);
    setShowDetails(true);
  };

  const handleBackToList = () => {
    setShowDetails(false);
  };

  const FilterChip = ({ label, onDelete }) => (
    <div className="inline-flex items-center space-x-2 bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm border border-purple-500/30">
      <span>{label}</span>
      <button
        onClick={onDelete}
        className="text-purple-400 hover:text-purple-200 transition-colors"
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Entity Type</label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          >
            <option value="All" className="bg-gray-800">All Types</option>
            <option value="Minion" className="bg-gray-800">Minion</option>
            <option value="Rival" className="bg-gray-800">Rival</option>
            <option value="Nemesis" className="bg-gray-800">Nemesis</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Difficulty</label>
          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          >
            <option value="All" className="bg-gray-800">All Difficulties</option>
            <option value="Easy" className="bg-gray-800">Easy (0-1)</option>
            <option value="Medium" className="bg-gray-800">Medium (2-3)</option>
            <option value="Hard" className="bg-gray-800">Hard (4-5)</option>
            <option value="Very Hard" className="bg-gray-800">Very Hard (6-7)</option>
            <option value="Extreme" className="bg-gray-800">Extreme (8+)</option>
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
            {searchTerm && (
              <FilterChip
                label={`Search: "${searchTerm}"`}
                onDelete={() => setSearchTerm('')}
              />
            )}
            {filterType !== 'All' && (
              <FilterChip
                label={`Type: ${filterType}`}
                onDelete={() => setFilterType('All')}
              />
            )}
            {difficultyFilter !== 'All' && (
              <FilterChip
                label={`Difficulty: ${difficultyFilter}`}
                onDelete={() => setDifficultyFilter('All')}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );

  const EntityList = () => {
    if (filteredEntities.length === 0) {
      return (
        <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-12 text-center">
          <svg className="w-16 h-16 text-gray-500 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path>
          </svg>
          <h3 className="text-xl font-semibold text-white mb-2">No entities found</h3>
          <p className="text-gray-400 mb-4">Try adjusting your search criteria to find more entities</p>
          <button
            onClick={clearAllFilters}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
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
            <svg className="w-6 h-6 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <h2 className="text-xl font-bold text-white">
              Found {filteredEntities.length} entit{filteredEntities.length !== 1 ? 'ies' : 'y'}
            </h2>
          </div>
          <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm font-bold">
            {entities.length} total
          </span>
        </div>

        {/* Entities Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
          {filteredEntities.map((entity) => {
            const difficultyInfo = getDifficultyColor(entity.difficulty);
            const typeColor = getTypeColor(entity.type);
            const isSelected = currEntity === entity.name;
            
            return (
              <div 
                key={entity.name}
                onClick={() => handleEntitySelect(entity.name)}
                className={`bg-black/20 backdrop-blur-lg rounded-xl border ${isSelected ? 'border-purple-400 ring-2 ring-purple-400/50' : 'border-white/10'} p-4 hover:bg-black/30 transition-all duration-300 cursor-pointer transform hover:scale-105 min-h-[200px] flex flex-col`}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <h3 className={`font-bold text-base ${isSelected ? 'text-purple-300' : 'text-white'} leading-tight flex-1 pr-2`}>
                    {entity.name}
                  </h3>
                  <div className="flex flex-col space-y-1 flex-shrink-0">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${typeColor} whitespace-nowrap`}>
                      {entity.type}
                    </span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${difficultyInfo.color} whitespace-nowrap`}>
                      Diff: {entity.difficulty}
                    </span>
                  </div>
                </div>
                
                {/* Description */}
                <div className="flex-1 mb-3">
                  <p className="text-gray-400 text-sm line-clamp-3 leading-relaxed">
                    {entity.description || 'No description available'}
                  </p>
                </div>
                
                {/* Stats Preview */}
                <div className="pt-3 border-t border-white/10 mt-auto">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-red-500/10 border border-red-500/20 rounded px-2 py-1 text-center">
                      <div className="text-red-400 font-medium">Wounds</div>
                      <div className="text-red-300 font-bold">{entity.wounds}</div>
                    </div>
                    <div className="bg-green-500/10 border border-green-500/20 rounded px-2 py-1 text-center">
                      <div className="text-green-400 font-medium">Soak</div>
                      <div className="text-green-300 font-bold">{entity.soak}</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const DisplayEntity = () => {
    const entity = entities.find(e => e.name === currEntity);
    if (!entity) return (
      <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-12 text-center">
        <svg className="w-16 h-16 text-gray-500 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <h3 className="text-xl font-semibold text-white mb-2">Select an entity</h3>
        <p className="text-gray-400">Choose an entity from the list to view its details</p>
      </div>
    );
    
    return (
      <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
        <EntityItem entity={entity} person={false}/>
      </div>
    );
  };

  if (localStorage.getItem("loggedIn") === 'false') {
    return <NotLoggedIn />;
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900">
      <div className="max-w-full mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-900/50 to-indigo-900/50 backdrop-blur-lg rounded-2xl border border-white/10 p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Entity Database</h1>
                <p className="text-purple-300">Browse and explore game entities</p>
              </div>
            </div>
            
            {showDetails && (
              <button
                onClick={handleBackToList}
                className="xl:hidden bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd"></path>
                </svg>
                <span>Back to List</span>
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-12">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-400 mb-4"></div>
              <h3 className="text-xl font-semibold text-white mb-2">Loading entity database...</h3>
              <p className="text-gray-400">Please wait while we fetch the data</p>
            </div>
          </div>
        ) : entities.length > 0 ? (
          <>
            {/* Mobile Detail View */}
            {showDetails && (
              <div className="xl:hidden">
                <DisplayEntity />
              </div>
            )}

            {/* Search and Filter Section */}
            <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600/20 to-indigo-600/20 p-4 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <svg className="w-6 h-6 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3 7v10a2 2 0 002 2h14l-2-2H5V7h14V5a2 2 0 00-2-2H5a2 2 0 00-2 2v2z"></path>
                      <path d="M21 7H3v2h18V7z"></path>
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
                      {filteredEntities.length} shown
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
                {/* Search Bar - Always Visible */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search by name, description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white/5 border border-white/20 rounded-xl pl-12 pr-12 py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-lg"
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

            {/* Entity Grid/List Section */}
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
              {/* Entity List/Grid */}
              <div className="xl:col-span-3">
                <EntityList />
              </div>

              {/* Entity Details Panel (Desktop) */}
              <div className="hidden xl:block xl:col-span-1">
                <DisplayEntity />
              </div>
            </div>
          </>
        ) : (
          <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-12">
            <div className="flex flex-col items-center justify-center text-center">
              <svg className="w-16 h-16 text-gray-500 mb-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <h3 className="text-xl font-semibold text-white mb-2">No entity data available</h3>
              <p className="text-gray-400">There are currently no entities in the database</p>
            </div>
          </div>
        )}

        {/* Mobile Filter Fab */}
        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          className="md:hidden fixed bottom-6 right-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 transform hover:scale-110"
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