import React, { useState, useEffect } from 'react';
import { collection, doc, onSnapshot, orderBy, query, setDoc } from "firebase/firestore";
import db from '../Components/firebase';
import WeaponItem from "../Components/weaponItem";
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

export default function Weapons() {
  const [weapons, setWeapons] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('-1');
  const [rarity, setRarity] = useState('-1');
  const [setBonus, setSetBonus] = useState('-');
  const [skillFilter, setSkillFilter] = useState('');
  const [rangeFilter, setRangeFilter] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

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
        await setDoc(doc(db, 'Weapons', data[i].name), {
          name: data[i].name,
          description: data[i].description,
          skill: data[i].skill,
          damage: data[i].damage,
          crit: data[i].crit,
          range: data[i].range,
          encumbrance: data[i].encumbrance,
          price: data[i].price,
          rarity: data[i].rarity,
          specials: data[i].specials,
          durability: data[i].durability,
          spawnLocations: data[i].spawnLocations,
          setBonus: data[i].setBonus,
          anomalousEffect: data[i].anomalousEffect,
          hidden: data[i].hidden,
          repairSkill: data[i].repairSkill
        });
      }
      showToast('Weapon data added successfully!');
    } catch (error) {
      showToast('Error adding weapon data', 'error');
      console.error(error);
    }
  };

  const getFromDB = () => {
    const q = query(collection(db, 'Weapons'), orderBy("name", "asc"));
    const unsub = onSnapshot(q, (querySnapshot) => {
      const queryData = [];
      querySnapshot.forEach((doc) => {
        queryData.push(doc.data());
      });
      setWeapons(queryData);
      setLoading(false);
    });
    return () => { unsub(); };
  };

  const getSetBonusList = () => {
    const bonusSet = new Set();
    weapons.forEach(weapon => {
      if (weapon.setBonus && weapon.setBonus !== 'None' && typeof weapon.setBonus === 'string') {
        bonusSet.add(weapon.setBonus);
      }
    });
    return Array.from(bonusSet).sort();
  };

  const getUniqueSkills = () => {
    const skills = [...new Set(weapons.map(weapon => weapon.skill).filter(skill => skill && typeof skill === 'string' && skill.trim() !== ''))];
    return skills.sort();
  };

  const getUniqueRanges = () => {
    const ranges = [...new Set(weapons.map(weapon => weapon.range).filter(range => range && typeof range === 'string' && range.trim() !== ''))];
    return ranges.sort();
  };

  const getFilteredWeapons = () => {
    return weapons.filter(weapon => {
      const matchesName = !name || 
        (weapon.name && weapon.name.toLowerCase().includes(name.toLowerCase())) ||
        (weapon.setBonus && weapon.setBonus.toLowerCase().includes(name.toLowerCase())) ||
        (weapon.description && weapon.description.toLowerCase().includes(name.toLowerCase()));
      
      const matchesPrice = price === '-1' || 
        (price === '10' && weapon.price >= 10) || 
        (price !== '10' && weapon.price === parseInt(price));
      
      const matchesRarity = rarity === '-1' || weapon.rarity === parseInt(rarity);
      const matchesSetBonus = setBonus === '-' || weapon.setBonus === setBonus;
      const matchesSkill = !skillFilter || weapon.skill === skillFilter;
      const matchesRange = !rangeFilter || weapon.range === rangeFilter;
      const matchesVisibility = weapon.hidden === 'No' || localStorage.getItem('loggedIn')?.toUpperCase() === 'ADMIN';
      
      return matchesName && matchesPrice && matchesRarity && matchesSetBonus && 
             matchesSkill && matchesRange && matchesVisibility;
    });
  };

  const clearAllFilters = () => {
    setName('');
    setPrice('-1');
    setRarity('-1');
    setSetBonus('-');
    setSkillFilter('');
    setRangeFilter('');
    showToast('All filters cleared');
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (name !== '') count++;
    if (price !== '-1') count++;
    if (rarity !== '-1') count++;
    if (setBonus !== '-') count++;
    if (skillFilter !== '') count++;
    if (rangeFilter !== '') count++;
    return count;
  };

  const DisplayItems = () => {
    const filteredWeapons = getFilteredWeapons();

    return (
      <div className="space-y-6">
        {filteredWeapons.length === 0 ? (
          <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-12 text-center">
            <svg className="w-16 h-16 text-gray-500 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path>
            </svg>
            <h3 className="text-xl font-semibold text-white mb-2">No weapons found</h3>
            <p className="text-gray-400 mb-4">Try adjusting your search criteria to find more weapons</p>
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
                <svg className="w-6 h-6 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <h2 className="text-xl font-bold text-white">
                  Found {filteredWeapons.length} weapon{filteredWeapons.length !== 1 ? 's' : ''}
                </h2>
              </div>
              <span className="bg-orange-500/20 text-orange-300 px-3 py-1 rounded-full text-sm font-bold">
                {weapons.length} total
              </span>
            </div>

            {/* Weapons Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
              {filteredWeapons.map((weapon, index) => (
                <div key={index} className="bg-black/20 backdrop-blur-lg rounded-xl border border-white/10 p-1 hover:bg-black/30 transition-all duration-300">
                  <WeaponItem currWeapon={weapon} />
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
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
            {getSetBonusList().map(bonus => (
              <option key={bonus} value={bonus} className="bg-gray-800">{bonus}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Weapon Skill</label>
          <select
            value={skillFilter}
            onChange={(e) => setSkillFilter(e.target.value)}
            className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          >
            <option value="" className="bg-gray-800">Any Skill</option>
            {getUniqueSkills().map(skill => (
              <option key={skill} value={skill} className="bg-gray-800">{skill}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Range Type</label>
          <select
            value={rangeFilter}
            onChange={(e) => setRangeFilter(e.target.value)}
            className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          >
            <option value="" className="bg-gray-800">Any Range</option>
            {getUniqueRanges().map(range => (
              <option key={range} value={range} className="bg-gray-800">{range}</option>
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
                label={`Search: "${name}"`}
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
            {skillFilter && (
              <FilterChip
                label={`Skill: ${skillFilter}`}
                onDelete={() => setSkillFilter('')}
              />
            )}
            {rangeFilter && (
              <FilterChip
                label={`Range: ${rangeFilter}`}
                onDelete={() => setRangeFilter('')}
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
        <div className="bg-gradient-to-r from-orange-900/50 to-red-900/50 backdrop-blur-lg rounded-2xl border border-white/10 p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Weapon Arsenal</h1>
                <p className="text-orange-300">Browse and search through available weapons</p>
              </div>
            </div>
            
            {localStorage.getItem('loggedIn')?.toUpperCase() === 'ADMIN' && (
              <button 
                onClick={addData}
                className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center space-x-2"
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
              <h3 className="text-xl font-semibold text-white mb-2">Loading weapon arsenal...</h3>
              <p className="text-gray-400">Please wait while we fetch the data</p>
            </div>
          </div>
        ) : weapons.length > 0 ? (
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
                    <span className="bg-orange-500/20 text-orange-300 px-3 py-1 rounded-full text-sm font-bold">
                      {getFilteredWeapons().length} shown
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
                    placeholder="Search by name, set bonus, or description..."
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
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <h3 className="text-xl font-semibold text-white mb-2">No weapon data available</h3>
              <p className="text-gray-400">There are currently no weapons in the database</p>
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