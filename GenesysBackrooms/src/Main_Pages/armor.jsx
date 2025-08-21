import React, { useState, useEffect } from 'react';
import { collection, doc, onSnapshot, orderBy, query, setDoc } from "firebase/firestore";
import db from '../Components/firebase';
import ArmorItem from "../Components/armorItem";
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

export default function Armor() {
  const [armor, setArmor] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('-1');
  const [rarity, setRarity] = useState('-1');
  const [setBonus, setSetBonus] = useState('-');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  const showToast = (message, severity = 'success') => {
    setToast({ open: true, message, severity });
  };

  const hideToast = () => {
    setToast({ ...toast, open: false });
  };

  const getFromDB = () => {
    const q = query(collection(db, 'Armor'), orderBy("name", "asc"));
    const unsub = onSnapshot(q, (querySnapshot) => {
      const queryData = [];
      querySnapshot.forEach((doc) => {
        queryData.push(doc.data());
      });
      setArmor(queryData);
      setLoading(false);
    });
    return () => { unsub(); };
  };

  const getFilteredArmor = () => {
    return armor.filter((item) => 
      (item.hidden === 'No' || localStorage.getItem('loggedIn')?.toUpperCase() === 'ADMIN') &&
      (item.price === parseInt(price) || (item.price >= 10 && parseInt(price) === 10) || price === '-1') &&
      (item.rarity === parseInt(rarity) || rarity === '-1') &&
      (item.name.toUpperCase().includes(name.toUpperCase()) || name === '' || item.setBonus.toUpperCase().includes(name.toUpperCase())) &&
      (item.setBonus === setBonus || setBonus === '-')
    );
  };

  const getSetBonusList = () => {
    const bonusList = [];
    for(let i = 0; i < armor.length; i++) {
      let count = 0;
      for(let j = 0; j < bonusList.length; j++) {
        if(armor[i].setBonus === bonusList[j]) {
          count++;
          break;
        }
      }
      if(count === 0 && armor[i].setBonus !== 'None') bonusList.push(armor[i].setBonus);
    }
    return bonusList;
  };

  const clearAllFilters = () => {
    setName('');
    setPrice('-1');
    setRarity('-1');
    setSetBonus('-');
    showToast('All filters cleared');
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (name !== '') count++;
    if (price !== '-1') count++;
    if (rarity !== '-1') count++;
    if (setBonus !== '-') count++;
    return count;
  };

  const DisplayItems = () => {
    const filteredItems = getFilteredArmor();

    return (
      <div className="space-y-6">
        {filteredItems.length === 0 ? (
          <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-12 text-center">
            <svg className="w-16 h-16 text-gray-500 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path>
            </svg>
            <h3 className="text-xl font-semibold text-white mb-2">No armor found</h3>
            <p className="text-gray-400 mb-4">Try adjusting your search criteria to find more items</p>
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
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
                <h2 className="text-xl font-bold text-white">
                  Found {filteredItems.length} armor piece{filteredItems.length !== 1 ? 's' : ''}
                </h2>
              </div>
              <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm font-bold">
                {armor.length} total
              </span>
            </div>

            {/* Armor Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
              {filteredItems.map((item, index) => (
                <div key={index} className="bg-black/20 backdrop-blur-lg rounded-xl border border-white/10 p-1 hover:bg-black/30 transition-all duration-300">
                  <ArmorItem currArmor={item} />
                </div>
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Price Range</label>
          <select
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          >
            <option value="-1" className="bg-gray-800">Any Price</option>
            <option value="0" className="bg-gray-800">Free (0)</option>
            <option value="1" className="bg-gray-800">Budget (1)</option>
            <option value="2" className="bg-gray-800">Cheap (2)</option>
            <option value="3" className="bg-gray-800">Affordable (3)</option>
            <option value="4" className="bg-gray-800">Moderate (4)</option>
            <option value="5" className="bg-gray-800">Standard (5)</option>
            <option value="6" className="bg-gray-800">Premium (6)</option>
            <option value="7" className="bg-gray-800">Expensive (7)</option>
            <option value="8" className="bg-gray-800">Luxury (8)</option>
            <option value="9" className="bg-gray-800">Elite (9)</option>
            <option value="10" className="bg-gray-800">Legendary (10+)</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Rarity Level</label>
          <select
            value={rarity}
            onChange={(e) => setRarity(e.target.value)}
            className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          >
            <option value="-1" className="bg-gray-800">Any Rarity</option>
            <option value="0" className="bg-gray-800">Common (0)</option>
            <option value="1" className="bg-gray-800">Uncommon (1)</option>
            <option value="2" className="bg-gray-800">Rare (2)</option>
            <option value="3" className="bg-gray-800">Epic (3)</option>
            <option value="4" className="bg-gray-800">Legendary (4)</option>
            <option value="5" className="bg-gray-800">Mythic (5)</option>
            <option value="6" className="bg-gray-800">Divine (6)</option>
            <option value="7" className="bg-gray-800">Cosmic (7)</option>
            <option value="8" className="bg-gray-800">Transcendent (8)</option>
            <option value="9" className="bg-gray-800">Omnipotent (9)</option>
            <option value="10" className="bg-gray-800">Absolute (10)</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Set Bonus</label>
          <select
            value={setBonus}
            onChange={(e) => setSetBonus(e.target.value)}
            className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          >
            <option value="-" className="bg-gray-800">No Set Filter</option>
            <option value="None" className="bg-gray-800">No Set Bonus</option>
            {getSetBonusList().map((bonus, index) => (
              <option key={index} value={bonus} className="bg-gray-800">{bonus}</option>
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
            {name && (
              <FilterChip
                label={`Name: "${name}"`}
                onDelete={() => setName('')}
              />
            )}
            {price !== '-1' && (
              <FilterChip
                label={`Price: ${price === '10' ? '10+' : price}`}
                onDelete={() => setPrice('-1')}
              />
            )}
            {rarity !== '-1' && (
              <FilterChip
                label={`Rarity: ${rarity}`}
                onDelete={() => setRarity('-1')}
              />
            )}
            {setBonus !== '-' && (
              <FilterChip
                label={`Set: ${setBonus}`}
                onDelete={() => setSetBonus('-')}
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
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Armor Collection</h1>
                <p className="text-blue-300">Browse and search through available armor pieces</p>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-12">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-400 mb-4"></div>
              <h3 className="text-xl font-semibold text-white mb-2">Loading armor collection...</h3>
              <p className="text-gray-400">Please wait while we fetch the data</p>
            </div>
          </div>
        ) : armor.length > 0 ? (
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
                      {getFilteredArmor().length} shown
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
                    placeholder="Search by name or set bonus..."
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
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
              </svg>
              <h3 className="text-xl font-semibold text-white mb-2">No armor data available</h3>
              <p className="text-gray-400">There are currently no armor pieces in the database</p>
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