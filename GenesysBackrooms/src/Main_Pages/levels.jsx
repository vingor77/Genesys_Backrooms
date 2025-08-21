import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { collection, doc, onSnapshot, query, setDoc } from "firebase/firestore";
import db from '../Components/firebase';
import LevelItem from "../Components/levelItem";
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

export default function Levels() {
  const [levels, setLevels] = useState([]);
  const [entities, setEntities] = useState([]);
  const [objects, setObjects] = useState([]);
  const [mundane, setMundane] = useState([]);
  const [armor, setArmor] = useState([]);
  const [weapons, setWeapons] = useState([]);
  const [interest, setInterest] = useState([]);
  const [phenomena, setPhenomena] = useState([]);
  const [currLevel, setCurrLevel] = useState('Tutorial Level');
  const [searchTerm, setSearchTerm] = useState('');
  const [sdClassFilter, setSdClassFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  
  const data = [{"name":"Tutorial Level","description":"Level 0 is a non-linear space, resembling the back rooms of a retail outlet. Similar to its previous form, all rooms in Level 0 appear uniform and share superficial features such as a yellowish wallpaper, damp carpet, and inconsistently placed fluorescent lighting. However, no two rooms within the level are identical.","level":0,"sdClass":1,"time":"x1","lightLevels":"0/8","chanceOfCorrosion":10,"corrosiveAtmosphere":5,"heat":"4/8","effectCount":1,"effects":"Light Mist/Medium Mist/Heavy Mist/Light Fog/Medium Fog/Heavy Fog/Hallucinations of other people/Scratching sounds/Intense humming/Voices of people in a non-coherent tongue/Insect sounds","roomSize":"20!100/20!100","roomHeight":8,"exitCount":5,"exitTypes":"Stairs going up/Stairs going down/A small hole in the wall/An open vent/A locked door/An unlocked door/A slide/A massive hole in the floor","exitFromLevelChance":5,"exitFromLevel":"Zenith Station/Remodeled Mess/Manila Room/Red Rooms/Habitable Zone","defectCount":2,"defects":"A lone dark oak chair/A torn bed/An L shaped couch cemented to the floor/A colored carpet patch/A broken helmet/1d6 small bullets/Neat papers/Scattered papers/A tinkerer hammer/An empty toolbox/A severed left arm/A mutilated human corpse/A large splot of dry blood","tags":"Indoors/Dark/Light/Damp/Daytime","spawnChances":"50/25/0/0/5","finite":"No","roomCount":3,"useAtmosphere":"Yes/Yes/No","sizeOfRooms":"50!40/50!30/50!50","exitsPerRoom":"5/2/3","exitTypesPerRoom":"Door!Door!Vent!Vent!Stairs going up/Door!Locked door/Locked door!Locked door!Door","lightLevelPerRoom":"4/7/9","heatPerRoom":"4/4/4","effectPerRoom":"Effect 1!Effect 4/Effect 2/Effect 3","spawnPerRoom":"Object!Phenomena!Window/Entity/Entity","defectsPerRoom":"Defect 1/Defect 2/Defect 3!Defect 4"}];

  const showToast = useCallback((message, severity = 'success') => {
    setToast({ open: true, message, severity });
  }, []);

  const hideToast = useCallback(() => {
    setToast(prev => ({ ...prev, open: false }));
  }, []);

  const addData = async () => {
    try {
      for(let i = 0; i < data.length; i++) {
        await setDoc(doc(db, 'Levels', data[i].name), {
          name: data[i].name,
          description: data[i].description,
          level: data[i].level,
          sdClass: data[i].sdClass,
          time: data[i].time,
          lightLevels: data[i].lightLevels,
          chanceOfCorrosion: data[i].chanceOfCorrosion,
          corrosiveAtmosphere: data[i].corrosiveAtmosphere,
          heat: data[i].heat,
          effectCount: data[i].effectCount,
          effects: data[i].effects,
          roomSize: data[i].roomSize,
          roomHeight: data[i].roomHeight,
          exitCount: data[i].exitCount,
          exitTypes: data[i].exitTypes,
          exitFromLevelChance: data[i].exitFromLevelChance,
          exitFromLevel: data[i].exitFromLevel,
          defectCount: data[i].defectCount,
          defects: data[i].defects,
          environments: data[i].environments,
          tags: data[i].tags,
          spawnChances: data[i].spawnChances,
          maxSpawns: data[i].maxSpawns,
          socialEncounters: data[i].socialEncounters,
          finite: data[i].finite,
          roomCount: data[i].roomCount,
          useAtmosphere: data[i].useAtmosphere,
          sizeOfRooms: data[i].sizeOfRooms,
          exitsPerRoom: data[i].exitsPerRoom,
          exitTypesPerRoom: data[i].exitTypesPerRoom,
          lightLevelPerRoom: data[i].lightLevelPerRoom,
          heatPerRoom: data[i].heatPerRoom,
          effectPerRoom: data[i].effectPerRoom,
          spawnPerRoom: data[i].spawnPerRoom,
          defectsPerRoom: data[i].defectsPerRoom
        });
      }
      showToast('Level data added successfully!');
    } catch (error) {
      showToast('Error adding level data', 'error');
      console.error(error);
    }
  };

  const getFromDB = useCallback((type) => {
    const q = query(collection(db, type));
    const unsub = onSnapshot(q, (querySnapshot) => {
      const queryData = [];
      querySnapshot.forEach((doc) => {
        queryData.push(doc.data());
      });
      
      if(type === 'Levels') {
        setLevels(prev => {
          if (JSON.stringify(prev) !== JSON.stringify(queryData)) {
            setLoading(false);
            return queryData;
          }
          return prev;
        });
      }
      if(type === 'Entities') setEntities(prev => JSON.stringify(prev) !== JSON.stringify(queryData) ? queryData : prev);
      if(type === 'PeopleOfInterest') setInterest(prev => JSON.stringify(prev) !== JSON.stringify(queryData) ? queryData : prev);
      if(type === 'Phenomena') setPhenomena(prev => JSON.stringify(prev) !== JSON.stringify(queryData) ? queryData : prev);
      if(type === 'Objects') setObjects(prev => JSON.stringify(prev) !== JSON.stringify(queryData) ? queryData : prev);
      if(type === 'Armor') setArmor(prev => JSON.stringify(prev) !== JSON.stringify(queryData) ? queryData : prev);
      if(type === 'Weapons') setWeapons(prev => JSON.stringify(prev) !== JSON.stringify(queryData) ? queryData : prev);
      if(type === 'MundaneObjects') setMundane(prev => JSON.stringify(prev) !== JSON.stringify(queryData) ? queryData : prev);
    });

    return () => { unsub(); };
  }, []);

  const getSdClassColor = useCallback((sdClass) => {
    switch (sdClass?.toString()) {
      case '0': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case '1': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case '2': return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';
      case '3': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case '4': return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      case '5': return 'bg-red-500/20 text-red-300 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  }, []);

  // Filtered levels based on search and difficulty class
  const filteredLevels = useMemo(() => {
    if (!levels || levels.length === 0) return [];
    
    return levels.filter(level => {
      const matchesSearch = !searchTerm || 
        (level.name && level.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (level.description && level.description.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesSdClass = sdClassFilter === 'All' || 
        (level.sdClass && level.sdClass.toString() === sdClassFilter);
      
      return matchesSearch && matchesSdClass;
    });
  }, [levels, searchTerm, sdClassFilter]);

  const clearAllFilters = useCallback(() => {
    setSearchTerm('');
    setSdClassFilter('All');
    showToast('All filters cleared');
  }, [showToast]);

  const getActiveFilterCount = useCallback(() => {
    let count = 0;
    if (searchTerm !== '') count++;
    if (sdClassFilter !== 'All') count++;
    return count;
  }, [searchTerm, sdClassFilter]);

  const handleLevelSelect = useCallback((levelName) => {
    setCurrLevel(levelName);
    setShowDetails(true);
  }, []);

  const handleBackToList = useCallback(() => {
    setShowDetails(false);
  }, []);

  // Initialize Firebase listeners once
  useEffect(() => {
    const unsubscribers = [];
    
    unsubscribers.push(getFromDB('Levels'));
    unsubscribers.push(getFromDB('Entities'));
    unsubscribers.push(getFromDB('PeopleOfInterest'));
    unsubscribers.push(getFromDB('Phenomena'));
    unsubscribers.push(getFromDB('Objects'));
    unsubscribers.push(getFromDB('Armor'));
    unsubscribers.push(getFromDB('Weapons'));
    unsubscribers.push(getFromDB('MundaneObjects'));

    return () => {
      unsubscribers.forEach(unsub => unsub && unsub());
    };
  }, [getFromDB]);

  if (localStorage.getItem("loggedIn") === 'false') {
    return <NotLoggedIn />;
  }

  const FilterChip = ({ label, onDelete }) => (
    <div className="inline-flex items-center space-x-2 bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-sm border border-green-500/30">
      <span>{label}</span>
      <button
        onClick={onDelete}
        className="text-green-400 hover:text-green-200 transition-colors"
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
          <label className="text-sm font-medium text-gray-300">Survival Difficulty Class</label>
          <select
            value={sdClassFilter}
            onChange={(e) => setSdClassFilter(e.target.value)}
            className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
          >
            <option value="All" className="bg-gray-800">All Classes</option>
            <option value="0" className="bg-gray-800">Class 0 (Safest)</option>
            <option value="1" className="bg-gray-800">Class 1 (Safe)</option>
            <option value="2" className="bg-gray-800">Class 2 (Moderate)</option>
            <option value="3" className="bg-gray-800">Class 3 (Dangerous)</option>
            <option value="4" className="bg-gray-800">Class 4 (Hazardous)</option>
            <option value="5" className="bg-gray-800">Class 5 (Death Trap)</option>
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
            {sdClassFilter !== 'All' && (
              <FilterChip
                label={`Class: ${sdClassFilter}`}
                onDelete={() => setSdClassFilter('All')}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );

  const LevelsList = () => {
    if (filteredLevels.length === 0) {
      return (
        <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-12 text-center">
          <svg className="w-16 h-16 text-gray-500 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path>
          </svg>
          <h3 className="text-xl font-semibold text-white mb-2">No levels found</h3>
          <p className="text-gray-400 mb-4">Try adjusting your search criteria to find more levels</p>
          <button
            onClick={clearAllFilters}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
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
            <svg className="w-6 h-6 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path>
            </svg>
            <h2 className="text-xl font-bold text-white">
              Found {filteredLevels.length} level{filteredLevels.length !== 1 ? 's' : ''}
            </h2>
          </div>
          <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-sm font-bold">
            {levels.length} total
          </span>
        </div>

        {/* Levels Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {filteredLevels.map((level, index) => {
            const sdClassColor = getSdClassColor(level.sdClass);
            const isSelected = currLevel === level.name;
            
            return (
              <div 
                key={`level-${level.name}-${level.level || index}`}
                onClick={() => handleLevelSelect(level.name)}
                className={`bg-black/20 backdrop-blur-lg rounded-xl border ${isSelected ? 'border-green-400 ring-2 ring-green-400/50' : 'border-white/10'} p-4 hover:bg-black/30 transition-all duration-300 cursor-pointer transform hover:scale-105 min-h-[200px] flex flex-col`}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <h3 className={`font-bold text-base ${isSelected ? 'text-green-300' : 'text-white'} leading-tight flex-1 pr-2`}>
                    {level.name}
                  </h3>
                  <div className="flex flex-col space-y-1 flex-shrink-0">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${sdClassColor} whitespace-nowrap`}>
                      Class {level.sdClass}
                    </span>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border bg-blue-500/20 text-blue-300 border-blue-500/30 whitespace-nowrap">
                      Level {level.level}
                    </span>
                  </div>
                </div>
                
                {/* Description */}
                <div className="flex-1 mb-3">
                  <p className="text-gray-400 text-sm line-clamp-3 leading-relaxed">
                    {level.description || 'No description available'}
                  </p>
                </div>
                
                {/* Stats Preview */}
                <div className="pt-3 border-t border-white/10 mt-auto">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded px-2 py-1 text-center">
                      <div className="text-yellow-400 font-medium">Time</div>
                      <div className="text-yellow-300 font-bold">{level.time}</div>
                    </div>
                    <div className="bg-purple-500/10 border border-purple-500/20 rounded px-2 py-1 text-center">
                      <div className="text-purple-400 font-medium">Type</div>
                      <div className="text-purple-300 font-bold">{level.finite === 'Yes' ? 'Finite' : 'Infinite'}</div>
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

  const DisplayLevel = () => {
    const level = levels.find(l => l.name === currLevel);
    if (!level) return (
      <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-12 text-center">
        <svg className="w-16 h-16 text-gray-500 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path>
        </svg>
        <h3 className="text-xl font-semibold text-white mb-2">Select a level</h3>
        <p className="text-gray-400">Choose a level from the list to view its details</p>
      </div>
    );
    
    return (
      <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 overflow-hidden">
        <LevelItem data={{entities, objects, mundane, armor, weapons, interest, phenomena, level}} />
      </div>
    );
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900">
      <div className="max-w-full mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-900/50 to-emerald-900/50 backdrop-blur-lg rounded-2xl border border-white/10 p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path>
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Level Database</h1>
                <p className="text-green-300">Explore different levels and dimensions</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {showDetails && (
                <button
                  onClick={handleBackToList}
                  className="xl:hidden bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center space-x-2"
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
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center space-x-2"
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
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-400 mb-4"></div>
              <h3 className="text-xl font-semibold text-white mb-2">Loading level database...</h3>
              <p className="text-gray-400">Please wait while we fetch the data</p>
            </div>
          </div>
        ) : levels.length > 0 ? (
          <>
            {/* Mobile Detail View */}
            {showDetails && (
              <div className="xl:hidden">
                <DisplayLevel />
              </div>
            )}

            {/* Desktop Layout or Mobile List */}
            <div className={`${showDetails ? 'hidden xl:grid' : 'grid'} grid-cols-1 xl:grid-cols-3 gap-6`}>
              {/* Left Panel - Search & Filters & List */}
              <div className="xl:col-span-2 space-y-6">
                {/* Search and Filter Section */}
                <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 overflow-hidden">
                  <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 p-4 border-b border-white/10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <svg className="w-6 h-6 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M3 7v10a2 2 0 002 2h14l-2-2H5V7h14V5a2 2 0 00-2-2H5a2 2 0 00-2 2v2z"></path>
                          <path d="M21 7H3v2h18V7z"></path>
                        </svg>
                        <h2 className="text-xl font-bold text-white">Search & Filter</h2>
                        {getActiveFilterCount() > 0 && (
                          <span className="bg-green-500/30 text-green-300 px-2 py-1 rounded-full text-xs font-bold">
                            {getActiveFilterCount()} active
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-sm font-bold">
                          {filteredLevels.length} shown
                        </span>
                        <button 
                          onClick={() => setFiltersOpen(!filtersOpen)}
                          className="md:hidden bg-green-600/20 hover:bg-green-600/30 text-green-400 p-2 rounded-lg transition-colors"
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
                        placeholder="Search levels by name or description..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white/5 border border-white/20 rounded-xl pl-12 pr-12 py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-lg"
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

                {/* Levels List */}
                <LevelsList />
              </div>

              {/* Right Panel - Level Details (Desktop only) */}
              <div className="hidden xl:block xl:col-span-1">
                <DisplayLevel />
              </div>
            </div>
          </>
        ) : (
          <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-12">
            <div className="flex flex-col items-center justify-center text-center">
              <svg className="w-16 h-16 text-gray-500 mb-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path>
              </svg>
              <h3 className="text-xl font-semibold text-white mb-2">No level data available</h3>
              <p className="text-gray-400 mb-4">There are currently no levels in the database</p>
              {localStorage.getItem('loggedIn')?.toUpperCase() === 'ADMIN' && (
                <button 
                  onClick={addData}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"></path>
                  </svg>
                  <span>Add Levels Now</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Mobile Filter Fab */}
        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          className="md:hidden fixed bottom-6 right-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 transform hover:scale-110"
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