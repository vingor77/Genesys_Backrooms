import React, { useState, useEffect } from 'react';
import { collection, doc, onSnapshot, orderBy, query, setDoc } from "firebase/firestore";
import db from '../Components/firebase';
import QuestItem from '../Components/questItem';
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

// Individual Outpost Card Component
const OutpostCard = ({ outpost, quests, questsLoading, onClick }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const relevantQuests = quests.filter(quest => 
    quest.acquisition === outpost.name || quest.turnInLocation === outpost.name
  );

  const getLevelTheme = (level) => {
    if (level <= 2) return { gradient: 'from-green-600 to-emerald-700', icon: '🌱' };
    if (level <= 4) return { gradient: 'from-blue-600 to-cyan-700', icon: '🏘️' };
    if (level <= 6) return { gradient: 'from-purple-600 to-indigo-700', icon: '🏰' };
    if (level <= 8) return { gradient: 'from-orange-600 to-red-700', icon: '🏛️' };
    return { gradient: 'from-yellow-600 to-orange-700', icon: '👑' };
  };

  const levelTheme = getLevelTheme(outpost.level);

  return (
    <div className={`w-full rounded-xl shadow-lg border transition-all duration-300 hover:scale-105 hover:shadow-xl bg-gradient-to-br ${levelTheme.gradient} border-white/20 ${isExpanded ? 'h-auto' : 'h-80'}`}>
      
      {/* Header */}
      <div className="p-4 text-white relative">
        {/* Expand button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="absolute top-3 right-3 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
        >
          <span className={`text-white transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </button>

        {/* Outpost Icon & Title */}
        <div className="flex items-start space-x-3 mb-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl backdrop-blur-sm flex-shrink-0">
            {levelTheme.icon}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg leading-tight mb-1">{outpost.name}</h3>
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-white/20 text-white px-2 py-1 rounded-full text-xs font-medium border border-white/20">
                Level {outpost.level}
              </span>
              {outpost.group && (
                <span className="bg-white/20 text-white px-2 py-1 rounded-full text-xs font-medium border border-white/20">
                  👥 {outpost.group}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-4 flex-1 flex flex-col bg-black/20 backdrop-blur-sm">
        
        {/* Basic Info - Always Visible */}
        <div className="space-y-2 mb-3">
          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <p className="text-gray-200 text-sm leading-relaxed line-clamp-2">
              {outpost.description || 'No description available'}
            </p>
          </div>
          
          {/* Quest count */}
          <div className="flex items-center text-gray-300 text-sm">
            <span className="text-yellow-400 mr-2">📜</span>
            <span>{relevantQuests.length} related quest{relevantQuests.length !== 1 ? 's' : ''}</span>
          </div>
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="space-y-4 animate-fadeIn">
            
            {/* Full Description */}
            <div>
              <h4 className="text-white font-semibold mb-2 flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                Full Description
              </h4>
              <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                <p className="text-gray-200 text-sm leading-relaxed">
                  {outpost.description || 'No description available'}
                </p>
              </div>
            </div>

            {/* Amenities */}
            {outpost.amenities && outpost.amenities.length > 0 && (
              <div>
                <h4 className="text-white font-semibold mb-2 flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Amenities ({outpost.amenities.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {outpost.amenities.map((amenity, index) => (
                    <span key={index} className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-sm border border-green-500/30">
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Related Quests */}
            {relevantQuests.length > 0 && (
              <div>
                <h4 className="text-white font-semibold mb-2 flex items-center">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                  Related Quests
                </h4>
                {questsLoading ? (
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <p className="text-gray-400 text-sm">Loading quests...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    {relevantQuests.map((quest, index) => (
                      <div key={index} className="transform scale-90 origin-top-left">
                        <QuestItem currQuest={quest} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Decorative accent bar */}
      <div className="h-1 bg-white/30" />
    </div>
  );
};

export default function Outposts() {
  const [outposts, setOutposts] = useState([]);
  const [quests, setQuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [questsLoading, setQuestsLoading] = useState(true);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const [searchTerm, setSearchTerm] = useState('');
  const [groupFilter, setGroupFilter] = useState('');
  const [levelFilter, setLevelFilter] = useState('');

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
        await setDoc(doc(db, 'Outposts', data[i].name), {
          name: data[i].name,
          description: data[i].description,
          level: data[i].level,
          group: data[i].group,
          amenities: data[i].amenities
        });
      }
      showToast('Outpost data added successfully!');
    } catch (error) {
      showToast('Error adding outpost data', 'error');
      console.error(error);
    }
  };

  const getFromDB = () => {
    const q = query(collection(db, 'Outposts'), orderBy("level", "asc"));
    const unsub = onSnapshot(q, (querySnapshot) => {
      const queryData = [];
      querySnapshot.forEach((doc) => {
        queryData.push(doc.data());
      });
      setOutposts(queryData);
      setLoading(false);
    });

    return () => { unsub(); };
  };

  const getQuests = () => {
    const q = query(collection(db, 'Quests'));
    const unsub = onSnapshot(q, (querySnapshot) => {
      const queryData = [];
      querySnapshot.forEach((doc) => {
        queryData.push(doc.data());
      });
      setQuests(queryData);
      setQuestsLoading(false);
    });

    return () => { unsub(); };
  };

  const getUniqueGroups = () => {
    const groups = [...new Set(outposts.map(outpost => outpost.group).filter(Boolean))];
    return groups.sort();
  };

  const getUniqueLevels = () => {
    const levels = [...new Set(outposts.map(outpost => outpost.level).filter(level => level !== undefined))];
    return levels.sort((a, b) => a - b);
  };

  const getFilteredOutposts = () => {
    return outposts.filter(outpost => {
      const matchesSearch = !searchTerm || 
        outpost.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (outpost.description && outpost.description.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesGroup = !groupFilter || outpost.group === groupFilter;
      const matchesLevel = !levelFilter || outpost.level === parseInt(levelFilter);
      
      return matchesSearch && matchesGroup && matchesLevel;
    });
  };

  const FilterChip = ({ label, onDelete }) => (
    <div className="inline-flex items-center space-x-2 bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm border border-blue-500/30">
      <span>{label}</span>
      <button
        onClick={onDelete}
        className="text-blue-400 hover:text-blue-200 transition-colors"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
        </svg>
      </button>
    </div>
  );

  const getActiveFilterCount = () => {
    let count = 0;
    if (searchTerm !== '') count++;
    if (groupFilter !== '') count++;
    if (levelFilter !== '') count++;
    return count;
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setGroupFilter('');
    setLevelFilter('');
    showToast('All filters cleared');
  };

  const DisplayItems = () => {
    const filteredOutposts = getFilteredOutposts();

    return (
      <div className="space-y-6">
        {filteredOutposts.length === 0 ? (
          <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-12 text-center">
            <svg className="w-16 h-16 text-gray-500 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path>
            </svg>
            <h3 className="text-xl font-semibold text-white mb-2">No outposts found</h3>
            <p className="text-gray-400 mb-4">Try adjusting your search criteria to find more outposts</p>
            <button
              onClick={clearAllFilters}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Results Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
                </svg>
                <h2 className="text-xl font-bold text-white">
                  Found {filteredOutposts.length} outpost{filteredOutposts.length !== 1 ? 's' : ''}
                </h2>
              </div>
              <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm font-bold">
                {outposts.length} total
              </span>
            </div>

            {/* Outposts Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredOutposts.map((outpost, index) => (
                <OutpostCard 
                  key={index} 
                  outpost={outpost} 
                  quests={quests}
                  questsLoading={questsLoading}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  useEffect(() => {
    if (localStorage.getItem("loggedIn") !== 'false') {
      getFromDB();
      getQuests();
    }
  }, []);

  if (localStorage.getItem("loggedIn") === 'false') {
    return <NotLoggedIn />;
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900">
      <div className="max-w-full mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900/50 to-indigo-900/50 backdrop-blur-lg rounded-2xl border border-white/10 p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Outpost Directory</h1>
                <p className="text-blue-300">Explore and manage outpost locations and their details</p>
              </div>
            </div>
            {localStorage.getItem('loggedIn')?.toUpperCase() === 'ADMIN' && (
              <button 
                onClick={addData}
                className="bg-white/20 hover:bg-white/30 text-white font-medium px-6 py-3 rounded-lg border border-white/30 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"></path>
                </svg>
                <span>Add Data</span>
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-12">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-400 mb-4"></div>
              <h3 className="text-xl font-semibold text-white mb-2">Loading outpost directory...</h3>
              <p className="text-gray-400">Please wait while we fetch the data</p>
            </div>
          </div>
        ) : outposts.length > 0 ? (
          <>
            {/* Search and Filter Section */}
            <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600/20 to-indigo-600/20 p-4 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3 7v10a2 2 0 002 2h14l-2-2H5V7h14V5a2 2 0 00-2-2H5a2 2 0 00-2 2v2z"></path>
                      <path d="M21 7H3v2h18V7z"></path>
                    </svg>
                    <h2 className="text-xl font-bold text-white">Search & Filter</h2>
                    {getActiveFilterCount() > 0 && (
                      <span className="bg-blue-500/30 text-blue-300 px-2 py-1 rounded-full text-xs font-bold">
                        {getActiveFilterCount()} active
                      </span>
                    )}
                  </div>
                  <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm font-bold">
                    {getFilteredOutposts().length} shown
                  </span>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Search Bar */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search outposts by name or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white/5 border border-white/20 rounded-xl pl-12 pr-12 py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg"
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

                {/* Filters */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Group</label>
                    <select
                      value={groupFilter}
                      onChange={(e) => setGroupFilter(e.target.value)}
                      className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      <option value="" className="bg-gray-800">All Groups</option>
                      {getUniqueGroups().map(group => (
                        <option key={group} value={group} className="bg-gray-800">{group}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Level</label>
                    <select
                      value={levelFilter}
                      onChange={(e) => setLevelFilter(e.target.value)}
                      className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      <option value="" className="bg-gray-800">All Levels</option>
                      {getUniqueLevels().map(level => (
                        <option key={level} value={level} className="bg-gray-800">Level {level}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
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
                      {groupFilter && (
                        <FilterChip
                          label={`Group: ${groupFilter}`}
                          onDelete={() => setGroupFilter('')}
                        />
                      )}
                      {levelFilter && (
                        <FilterChip
                          label={`Level: ${levelFilter}`}
                          onDelete={() => setLevelFilter('')}
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Results */}
            <DisplayItems />
          </>
        ) : (
          <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-12">
            <div className="flex flex-col items-center justify-center text-center">
              <svg className="w-16 h-16 text-gray-500 mb-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
              </svg>
              <h3 className="text-xl font-semibold text-white mb-2">No outpost data available</h3>
              <p className="text-gray-400">There are currently no outposts in the database</p>
            </div>
          </div>
        )}
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