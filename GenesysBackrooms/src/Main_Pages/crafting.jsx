import React, { useState, useEffect } from 'react';
import { collection, doc, onSnapshot, orderBy, query, setDoc } from "firebase/firestore";
import db from '../Components/firebase';
import Craft from "../Components/crafts";
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

export default function Crafting() {
  const [crafts, setCrafts] = useState([]);
  const [difficulty, setDifficulty] = useState('None');
  const [name, setName] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const [activeCraft, setActiveCraft] = useState(null);

  const showToast = (message, severity = 'success') => {
    setToast({ open: true, message, severity });
  };

  const hideToast = () => {
    setToast({ ...toast, open: false });
  };

  const getFromDB = () => {
    const q = query(collection(db, 'Crafts'), orderBy("name", "asc"));
    const unsub = onSnapshot(q, (querySnapshot) => {
      const queryData = [];
      querySnapshot.forEach((doc) => {
        queryData.push(doc.data());
      });
      setCrafts(queryData);
      setLoading(false);
    });

    return () => { unsub(); };
  };

  const getFilteredCrafts = () => {
    return crafts.filter((item) => 
      (item.baseDifficulty === difficulty || difficulty === 'None') &&
      (item.name.toUpperCase().includes(name.toUpperCase()) || name === '') &&
      (item.hidden === 'No' || localStorage.getItem('loggedIn')?.toUpperCase() === 'ADMIN')
    );
  };

  const clearAllFilters = () => {
    setName('');
    setDifficulty('None');
    showToast('All filters cleared');
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (name !== '') count++;
    if (difficulty !== 'None') count++;
    return count;
  };

  const getDifficultyLabel = (diff) => {
    const labels = {
      '1': 'Simple (1)',
      '2': 'Easy (2)', 
      '3': 'Average (3)',
      '4': 'Hard (4)',
      '5': 'Daunting (5)',
      'Dynamic': 'Dynamic'
    };
    return labels[diff] || diff;
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
    <div className="inline-flex items-center space-x-2 bg-orange-500/20 text-orange-300 px-3 py-1 rounded-full text-sm border border-orange-500/30">
      <span>{label}</span>
      <button
        onClick={onDelete}
        className="text-orange-400 hover:text-orange-200 transition-colors"
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Base Difficulty</label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
          >
            <option value="None" className="bg-gray-800">Any Difficulty</option>
            <option value="1" className="bg-gray-800">Simple (1)</option>
            <option value="2" className="bg-gray-800">Easy (2)</option>
            <option value="3" className="bg-gray-800">Average (3)</option>
            <option value="4" className="bg-gray-800">Hard (4)</option>
            <option value="5" className="bg-gray-800">Daunting (5)</option>
            <option value="Dynamic" className="bg-gray-800">Dynamic</option>
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
            {difficulty !== 'None' && (
              <FilterChip
                label={`Difficulty: ${getDifficultyLabel(difficulty)}`}
                onDelete={() => setDifficulty('None')}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );

  const DisplayItems = () => {
    const filteredCrafts = getFilteredCrafts();

    if (filteredCrafts.length === 0) {
      return (
        <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-12 text-center">
          <svg className="w-16 h-16 text-gray-500 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"></path>
          </svg>
          <h3 className="text-xl font-semibold text-white mb-2">No crafts found</h3>
          <p className="text-gray-400 mb-4">Try adjusting your search criteria to find more crafting recipes</p>
          <button
            onClick={clearAllFilters}
            className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
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
            <svg className="w-6 h-6 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path>
            </svg>
            <h2 className="text-xl font-bold text-white">
              Found {filteredCrafts.length} crafting recipe{filteredCrafts.length !== 1 ? 's' : ''}
            </h2>
          </div>
          <span className="bg-orange-500/20 text-orange-300 px-3 py-1 rounded-full text-sm font-bold">
            {crafts.length} total
          </span>
        </div>

        {/* Crafts Grid */}
        <div className="flex flex-wrap justify-center gap-4">
          {filteredCrafts.map((item, index) => (
            <div key={index} className="transform transition-all duration-300 hover:scale-105">
              <Craft currCraft={item} onShowMaterials={setActiveCraft} />
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-orange-900 to-amber-900">
      <div className="max-w-full mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-900/50 to-amber-900/50 backdrop-blur-lg rounded-2xl border border-white/10 p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center">
                <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path>
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Crafting Workshop</h1>
                <p className="text-orange-300">Discover and search through crafting recipes</p>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-12">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-400 mb-4"></div>
              <h3 className="text-xl font-semibold text-white mb-2">Loading crafting recipes...</h3>
              <p className="text-gray-400">Please wait while we fetch the data</p>
            </div>
          </div>
        ) : crafts.length > 0 ? (
          <>
            {/* Search and Filter Section */}
            <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 overflow-hidden">
              <div className="bg-gradient-to-r from-orange-600/20 to-amber-600/20 p-4 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <svg className="w-6 h-6 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3 7v10a2 2 0 002 2h14l-2-2H5V7h14V5a2 2 0 00-2-2H5a2 2 0 00-2 2v2z"></path>
                      <path d="M21 7H3v2h18V7z"></path>
                    </svg>
                    <h2 className="text-xl font-bold text-white">Search & Filter</h2>
                    {getActiveFilterCount() > 0 && (
                      <span className="bg-orange-500/30 text-orange-300 px-2 py-1 rounded-full text-xs font-bold">
                        {getActiveFilterCount()} active
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="bg-orange-500/20 text-orange-300 px-3 py-1 rounded-full text-sm font-bold">
                      {getFilteredCrafts().length} shown
                    </span>
                    <button 
                      onClick={() => setFiltersOpen(!filtersOpen)}
                      className="md:hidden bg-orange-600/20 hover:bg-orange-600/30 text-orange-400 p-2 rounded-lg transition-colors"
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
                    placeholder="Search crafting recipes by name..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white/5 border border-white/20 rounded-xl pl-12 pr-12 py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-lg"
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
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path>
              </svg>
              <h3 className="text-xl font-semibold text-white mb-2">No crafting recipes available</h3>
              <p className="text-gray-400">There are currently no crafting recipes in the database</p>
            </div>
          </div>
        )}

        {/* Mobile Filter Fab */}
        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          className="md:hidden fixed bottom-6 right-6 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 transform hover:scale-110"
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

      {/* Draggable Material Effects Modal */}
      {activeCraft && <DraggableModal craft={activeCraft} onClose={() => setActiveCraft(null)} />}
    </div>
  );
}

// Draggable Modal Component
const DraggableModal = ({ craft, onClose }) => {
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const materials = craft.dynamicMaterial ? craft.dynamicMaterial.split('/') : [];
  const difficulties = craft.difficultyModifier ? craft.difficultyModifier.split('/') : [];
  const attempts = craft.attemptsModifier ? craft.attemptsModifier.split('/') : [];
  const effects = craft.dynamicEffect ? craft.dynamicEffect.split('/') : [];

  const getDifficultyStyle = (baseDifficulty) => {
    if (baseDifficulty === 'Dynamic') return { bg: '#6366f1', glow: '#818cf8', name: 'DYNAMIC' };
    const diff = parseInt(baseDifficulty);
    if (diff <= 2) return { bg: '#059669', glow: '#10b981', name: 'SIMPLE' };
    if (diff <= 4) return { bg: '#0369a1', glow: '#0ea5e9', name: 'MODERATE' };
    return { bg: '#dc2626', glow: '#ef4444', name: 'MASTER' };
  };

  const diffStyle = getDifficultyStyle(craft.baseDifficulty);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    
    setPosition({
      x: Math.max(0, Math.min(newX, window.innerWidth - 600)),
      y: Math.max(0, Math.min(newY, window.innerHeight - 400))
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragStart]);

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50">
      <div 
        className="absolute bg-slate-900 rounded-2xl border border-gray-600 shadow-2xl w-96 max-w-[90vw] max-h-[80vh] overflow-hidden"
        style={{ 
          left: `${position.x}px`, 
          top: `${position.y}px`,
          boxShadow: `0 20px 40px ${diffStyle.bg}40, 0 0 60px ${diffStyle.glow}20`
        }}
      >
        {/* Draggable Header */}
        <div 
          className="p-4 border-b border-gray-700 cursor-move select-none"
          style={{ background: `linear-gradient(90deg, ${diffStyle.bg}20, ${diffStyle.glow}20)` }}
          onMouseDown={handleMouseDown}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                style={{ backgroundColor: `${diffStyle.bg}30` }}
              >
                🔨
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">{craft.name}</h2>
                <p className="text-sm text-gray-400">Material Effects</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center text-white transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 max-h-96 overflow-y-auto">
          <div className="space-y-4">
            {materials.map((mat, idx) => (
              <div key={idx} className="bg-slate-800 rounded-xl p-4 border border-gray-700">
                {/* Material Header */}
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-white">{mat}</h3>
                  <div className="flex space-x-2">
                    <span 
                      className="px-2 py-1 rounded text-xs font-bold"
                      style={{ backgroundColor: `${diffStyle.bg}30`, color: diffStyle.glow }}
                    >
                      Diff: {difficulties[idx]}
                    </span>
                    <span className="px-2 py-1 bg-amber-600/30 text-amber-300 rounded text-xs font-bold">
                      Att: {attempts[idx]}
                    </span>
                  </div>
                </div>

                {/* Effect Description */}
                <div className="bg-slate-700 rounded-lg p-3">
                  <p className="text-white/90 text-sm leading-relaxed">
                    {effects[idx] || 'No special effects described.'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};