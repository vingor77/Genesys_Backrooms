import React, { useState, useEffect } from 'react';
import { collection, doc, onSnapshot, orderBy, query, setDoc } from "firebase/firestore";
import db from '../Components/firebase';
import QuestItem from "../Components/questItem";
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

export default function Quests() {
  const [quests, setQuests] = useState([]);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [acquisition, setAcquisition] = useState('');
  const [questLine, setQuestLine] = useState('');
  const [completedFilter, setCompletedFilter] = useState('');
  const [questGiverFilter, setQuestGiverFilter] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  const data = [
    {"name":"Introduction","questGiver":"None","turnInLocation":"Trader's Keep","description":"Arrive at the Trader's Keep and speak with The Keeper","rewards":"4 Weapons/4 Armor/4 Gray Almond Water/A compass","completed":"No","hidden":"No","acquisition":"None","questLine":"Starter"}
  ];

  const showToast = (message, severity = 'success') => {
    setToast({ open: true, message, severity });
  };

  const hideToast = () => {
    setToast({ ...toast, open: false });
  };

  const addData = async () => {
    try {
      for(let i = 0; i < data.length; i++) {
        await setDoc(doc(db, 'Quests', data[i].name), {
          name: data[i].name,
          questGiver: data[i].questGiver,
          turnInLocation: data[i].turnInLocation,
          description: data[i].description,
          rewards: data[i].rewards,
          completed: data[i].completed,
          hidden: data[i].hidden,
          acquisition: data[i].acquisition,
          questLine: data[i].questLine
        });
      }
      showToast('Quest data added successfully!');
    } catch (error) {
      showToast('Error adding quest data', 'error');
      console.error(error);
    }
  };

  const getFromDB = () => {
    const q = query(collection(db, 'Quests'), orderBy("questLine", "asc"));
    const unsub = onSnapshot(q, (querySnapshot) => {
      const queryData = [];
      querySnapshot.forEach((doc) => {
        queryData.push(doc.data());
      });
      setQuests(queryData);
      setLoading(false);
    });

    return () => { unsub(); };
  };

  const getQuestLines = () => {
    const questLines = [...new Set(quests.map(quest => quest.questLine).filter(line => line && typeof line === 'string' && line.trim() !== ''))];
    return questLines.sort();
  };

  const getUniqueLocations = () => {
    const locations = [...new Set(quests.map(quest => quest.turnInLocation).filter(loc => loc && typeof loc === 'string' && loc.trim() !== ''))];
    return locations.sort();
  };

  const getUniqueAcquisitions = () => {
    const acquisitions = [...new Set(quests.map(quest => quest.acquisition).filter(acq => acq && typeof acq === 'string' && acq.trim() !== ''))];
    return acquisitions.sort();
  };

  const getUniqueQuestGivers = () => {
    const questGivers = [...new Set(quests.map(quest => quest.questGiver).filter(giver => giver && typeof giver === 'string' && giver.trim() !== '' && giver !== 'None'))];
    return questGivers.sort();
  };

  const getFilteredQuests = () => {
    return quests.filter(quest => {
      const matchesName = !name || 
        (quest.name && quest.name.toLowerCase().includes(name.toLowerCase())) ||
        (quest.description && quest.description.toLowerCase().includes(name.toLowerCase()));
      
      const matchesLocation = !location || 
        (quest.turnInLocation && quest.turnInLocation.toLowerCase().includes(location.toLowerCase()));
      
      const matchesAcquisition = !acquisition || 
        (quest.acquisition && quest.acquisition.toLowerCase().includes(acquisition.toLowerCase()));
      
      const matchesQuestLine = !questLine || (quest.questLine && quest.questLine === questLine);
      const matchesCompleted = !completedFilter || (quest.completed && quest.completed === completedFilter);
      const matchesQuestGiver = !questGiverFilter || (quest.questGiver && quest.questGiver === questGiverFilter);
      const matchesVisibility = quest.hidden === 'No' || localStorage.getItem('loggedIn')?.toUpperCase() === 'ADMIN';
      
      return matchesName && matchesLocation && matchesAcquisition && matchesQuestLine && 
             matchesCompleted && matchesQuestGiver && matchesVisibility;
    });
  };

  const clearAllFilters = () => {
    setName('');
    setLocation('');
    setAcquisition('');
    setQuestLine('');
    setCompletedFilter('');
    setQuestGiverFilter('');
    showToast('All filters cleared');
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (name !== '') count++;
    if (location !== '') count++;
    if (acquisition !== '') count++;
    if (questLine !== '') count++;
    if (completedFilter !== '') count++;
    if (questGiverFilter !== '') count++;
    return count;
  };

  const DisplayItems = () => {
    const filteredQuests = getFilteredQuests();

    return (
      <div className="space-y-6">
        {filteredQuests.length === 0 ? (
          <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-12 text-center">
            <svg className="w-16 h-16 text-gray-500 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path>
            </svg>
            <h3 className="text-xl font-semibold text-white mb-2">No quests found</h3>
            <p className="text-gray-400 mb-4">Try adjusting your search criteria to find more quests</p>
            <button
              onClick={clearAllFilters}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
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
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 14a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 5.677V9a1 1 0 11-2 0V5.677L6.237 6.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 14a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.616a1 1 0 01.894-1.79l1.599.8L9 4.323V3a1 1 0 011-1z" clipRule="evenodd"></path>
                </svg>
                <h2 className="text-xl font-bold text-white">
                  Found {filteredQuests.length} quest{filteredQuests.length !== 1 ? 's' : ''}
                </h2>
              </div>
              <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm font-bold">
                {quests.length} total
              </span>
            </div>

            {/* Quests Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-6">
              {filteredQuests.map((quest, index) => (
                <QuestItem key={index} currQuest={quest} />
              ))}
            </div>
          </div>
        )}
      </div>
    );
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
      {/* Advanced Filters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Turn-in Location</label>
          <input
            type="text"
            placeholder="Enter location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Acquisition</label>
          <input
            type="text"
            placeholder="Enter acquisition"
            value={acquisition}
            onChange={(e) => setAcquisition(e.target.value)}
            className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Quest Line</label>
          <select
            value={questLine}
            onChange={(e) => setQuestLine(e.target.value)}
            className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          >
            <option value="" className="bg-gray-800">Any Quest Line</option>
            {getQuestLines().map(line => (
              <option key={line} value={line} className="bg-gray-800">{line}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Completion Status</label>
          <select
            value={completedFilter}
            onChange={(e) => setCompletedFilter(e.target.value)}
            className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          >
            <option value="" className="bg-gray-800">Any Status</option>
            <option value="Yes" className="bg-gray-800">Completed</option>
            <option value="No" className="bg-gray-800">Not Completed</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Quest Giver</label>
          <select
            value={questGiverFilter}
            onChange={(e) => setQuestGiverFilter(e.target.value)}
            className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          >
            <option value="" className="bg-gray-800">Any Quest Giver</option>
            {getUniqueQuestGivers().map(giver => (
              <option key={giver} value={giver} className="bg-gray-800">{giver}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Clear Filters Button */}
      <div className="flex justify-center">
        <button
          onClick={clearAllFilters}
          disabled={getActiveFilterCount() === 0}
          className="bg-gradient-to-r from-red-600/20 to-pink-600/20 hover:from-red-600/30 hover:to-pink-600/30 disabled:from-gray-600/20 disabled:to-gray-700/20 text-red-300 disabled:text-gray-500 font-medium px-6 py-3 rounded-lg border border-red-500/30 disabled:border-gray-500/30 transition-all duration-300 hover:scale-105 disabled:hover:scale-100 flex items-center space-x-2"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
          </svg>
          <span>Clear All Filters</span>
        </button>
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
            {location && (
              <FilterChip
                label={`Location: "${location}"`}
                onDelete={() => setLocation('')}
              />
            )}
            {acquisition && (
              <FilterChip
                label={`Acquisition: "${acquisition}"`}
                onDelete={() => setAcquisition('')}
              />
            )}
            {questLine && (
              <FilterChip
                label={`Quest Line: ${questLine}`}
                onDelete={() => setQuestLine('')}
              />
            )}
            {completedFilter && (
              <FilterChip
                label={`Status: ${completedFilter === 'Yes' ? 'Completed' : 'Not Completed'}`}
                onDelete={() => setCompletedFilter('')}
              />
            )}
            {questGiverFilter && (
              <FilterChip
                label={`Giver: ${questGiverFilter}`}
                onDelete={() => setQuestGiverFilter('')}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );

  useEffect(() => {
    if (localStorage.getItem("loggedIn") !== 'false') {
      getFromDB();
    }
  }, []);

  if (localStorage.getItem("loggedIn") === 'false') {
    return <NotLoggedIn />;
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900">
      <div className="max-w-full mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900/50 to-indigo-900/50 backdrop-blur-lg rounded-2xl border border-white/10 p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 14a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 5.677V9a1 1 0 11-2 0V5.677L6.237 6.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 14a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.616a1 1 0 01.894-1.79l1.599.8L9 4.323V3a1 1 0 011-1z" clipRule="evenodd"></path>
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Quest Collection</h1>
                <p className="text-blue-300">Manage and track your quest progress</p>
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
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-400 mb-4"></div>
              <h3 className="text-xl font-semibold text-white mb-2">Loading quest collection...</h3>
              <p className="text-gray-400">Please wait while we fetch the data</p>
            </div>
          </div>
        ) : quests.length > 0 ? (
          <>
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
                    <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm font-bold">
                      {getFilteredQuests().length} shown
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
                    placeholder="Search by name or description..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white/5 border border-white/20 rounded-xl pl-12 pr-12 py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-lg"
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
          </>
        ) : (
          <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-12">
            <div className="flex flex-col items-center justify-center text-center">
              <svg className="w-16 h-16 text-gray-500 mb-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 14a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 5.677V9a1 1 0 11-2 0V5.677L6.237 6.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 14a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.616a1 1 0 01.894-1.79l1.599.8L9 4.323V3a1 1 0 011-1z" clipRule="evenodd"></path>
              </svg>
              <h3 className="text-xl font-semibold text-white mb-2">No quest data available</h3>
              <p className="text-gray-400">There are currently no quests in the database</p>
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