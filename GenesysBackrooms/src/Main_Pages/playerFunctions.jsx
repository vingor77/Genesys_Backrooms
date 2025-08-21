import React, { useEffect, useState, memo, useCallback } from 'react';
import { collection, deleteDoc, doc, onSnapshot, orderBy, query, setDoc, updateDoc, where } from "firebase/firestore";
import db from '../Components/firebase';
import { useForm, useFieldArray } from 'react-hook-form';

// Utility function for debouncing
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// NotLoggedIn component
const NotLoggedIn = () => (
  <div className="h-screen w-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 flex items-center justify-center">
    <div className="bg-black/40 backdrop-blur-lg rounded-2xl border border-white/10 shadow-2xl p-8 text-center max-w-md">
      <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl mx-auto mb-6 flex items-center justify-center">
        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"></path>
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-white mb-4">Access Restricted</h2>
      <p className="text-gray-300">Please authenticate to access the Player Dashboard</p>
    </div>
  </div>
);

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

// Sidebar navigation component
const Sidebar = ({ activeSection, setActiveSection, timers, globalTimers }) => {
  const menuItems = [
    { 
      id: 'overview', 
      name: 'Dashboard', 
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path>
        </svg>
      )
    },
    { 
      id: 'equipment', 
      name: 'Equipment', 
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
        </svg>
      )
    },
    { 
      id: 'timers', 
      name: 'Timers', 
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"></path>
        </svg>
      ),
      badge: timers.length + globalTimers.length
    },
    { 
      id: 'effects', 
      name: 'Status Effects', 
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"></path>
        </svg>
      )
    }
  ];

  return (
    <div className="h-screen w-64 bg-black/20 backdrop-blur-xl border-r border-white/10 flex flex-col">
      {/* Logo/Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">⚡</span>
          </div>
          <div>
            <h1 className="text-white font-bold text-lg">Player Hub</h1>
            <p className="text-purple-300 text-sm">{localStorage.getItem('loggedIn')}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                  activeSection === item.id
                    ? 'bg-purple-600/30 text-white border border-purple-500/50'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className={`transition-colors ${
                  activeSection === item.id ? 'text-purple-400' : 'text-gray-400 group-hover:text-gray-300'
                }`}>
                  {item.icon}
                </span>
                <span className="font-medium flex-1 text-left">{item.name}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="bg-purple-500/20 text-purple-300 text-xs font-bold px-2 py-1 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10">
        <div className="text-xs text-gray-400 text-center">
          <p>Backrooms Campaign</p>
          <p className="text-purple-400">v2.0</p>
        </div>
      </div>
    </div>
  );
};

export default function PlayerFunctions() {
  // State declarations
  const [timers, setTimers] = useState([]);
  const [globalTimers, setGlobalTimers] = useState([]);
  const [allTimers, setAllTimers] = useState([]);
  const [addTime, setAddTime] = useState(0);
  const [addName, setAddName] = useState("");
  const [addDescription, setAddDescription] = useState("");
  const [editName, setEditName] = useState('None');
  const [editTime, setEditTime] = useState(0);
  const [editDescription, setEditDescription] = useState('');
  const [removeName, setRemoveName] = useState('');
  const [page, setPage] = useState({});
  const [activeSection, setActiveSection] = useState('overview');
  const [globalTimer, setGlobalTimer] = useState({
    name: "",
    value: 0,
    description: ""
  });
  const [tick, setTick] = useState(0);
  const [effects, setEffects] = useState(null);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  // Toast functions
  const showToast = (message, severity = 'success') => {
    setToast({ open: true, message, severity });
  };

  const hideToast = () => {
    setToast({ ...toast, open: false });
  };

  // Database functions
  const getFromDB = () => {
    const q = query(collection(db, 'Timers'), orderBy("time", "desc"));
    const unsub = onSnapshot(q, (querySnapshot) => {
      const nonGlobal = [];
      const global = [];
      const queryData = [];

      querySnapshot.forEach((doc) => {
        if(doc.data().global === false && doc.data().user.toUpperCase() === localStorage.getItem("loggedIn").toUpperCase()) nonGlobal.push(doc.data());
        else if(doc.data().global) global.push(doc.data());
        queryData.push(doc.data());
      });
      
      setTimers(nonGlobal);
      setGlobalTimers(global);
      setAllTimers(queryData);
    });

    return () => { unsub(); }
  };

  const getFromEquippedDB = () => {
    const q = query(collection(db, 'Equipped'), where('playerName', "==", localStorage.getItem('loggedIn')));
    const unsub = onSnapshot(q, (querySnapshot) => {
      let empty = true;
      querySnapshot.forEach((doc) => {
        setPage(doc.data());
        setEffects(doc.data().effects);
        empty = false;
      });
      if(empty) {
        setDoc(doc(db, 'Equipped', localStorage.getItem('loggedIn').toUpperCase()), {
          playerName: localStorage.getItem('loggedIn'),
          gear: {head: "", chest: "", arms: "", legs: "", feet: ""},
          jewelry: {earrings: "", choker: "", bracelet: "", leftRing: "", rightRing: ""},
          resources: [{name: "", remaining: "", maximum: ""}],
          effects: {exhaustion: '0', sanity: '0', encumbrance: '0', disease: '0', wretchedCycle: '0', brawn: '0'}
        });
      }
    });
    return () => { unsub(); }
  };

  // Timer management functions
  const addTimer = () => {
    let ready = true;
    for(let i = 0; i < timers.length; i++) {
      if(timers[i].name.toUpperCase() === addName.toUpperCase() && timers[i].user.toUpperCase() === localStorage.getItem('loggedIn').toUpperCase()) ready = false;
    }

    if(addName === '') {
      showToast('Timer name cannot be empty', 'error');
      return;
    }

    if(parseInt(addTime) <= 0) {
      showToast('Timer value must be greater than 0', 'error');
      return;
    }

    if(ready) {
      setDoc(doc(db, 'Timers', addName + localStorage.getItem('loggedIn').toUpperCase()), {
        name: addName,
        time: parseInt(addTime),
        user: localStorage.getItem('loggedIn'),
        global: false,
        description: addDescription
      });

      setAddName("");
      setAddTime(0);
      setAddDescription("");
      showToast('Timer created successfully!');
    } else {
      showToast('That timer already exists', 'error');
    }
  };

  const handleEditSelect = (e) => {
    let timer;
    for(let i = 0; i < timers.length; i++) {
      if(timers[i].name === e.target.value) timer = timers[i];
    }
    setEditName(e.target.value);
    setEditTime(timer?.time || 0);
    setEditDescription(timer?.description || '');
  };

  const editTimer = () => {
    if(parseInt(editTime) <= 0) {
      showToast('Timer value must be greater than 0', 'error');
      return;
    }

    setDoc(doc(db, 'Timers', editName.includes('://:') ? editName.split('://:')[0] + localStorage.getItem('loggedIn').toUpperCase() + 'GLOBAL' : editName + localStorage.getItem('loggedIn').toUpperCase()), {
      name: editName,
      time: parseInt(editTime),
      user: localStorage.getItem('loggedIn'),
      global: editName.includes('://:') ? true : false,
      description: editDescription
    });
    
    showToast('Timer updated successfully!');
  };

  const removeTimer = () => {
    deleteDoc(doc(db, 'Timers', removeName.includes('://:') ? removeName.split('://:')[0] + localStorage.getItem('loggedIn').toUpperCase() + 'GLOBAL' : removeName + localStorage.getItem('loggedIn').toUpperCase()));
    setEditName('None');
    setEditTime(0);
    setEditDescription("");
    setRemoveName('None');
    showToast('Timer removed successfully!');
  };

  const addGlobalTimer = () => {
    let ready = true;
    for(let i = 0; i < globalTimers.length; i++) {
      if(globalTimers[i].name.toUpperCase() === (globalTimer.name + "://:(Global)").toUpperCase() && globalTimers[i].user.toUpperCase() === localStorage.getItem('loggedIn').toUpperCase()) ready = false;
    }

    if(globalTimer.name === '') {
      showToast('Timer name cannot be empty', 'error');
      return;
    }

    if(parseInt(globalTimer.value) <= 0) {
      showToast('Timer value must be greater than 0', 'error');
      return;
    }

    if(ready) {
      setDoc(doc(db, 'Timers', globalTimer.name + localStorage.getItem('loggedIn').toUpperCase() + 'GLOBAL'), {
        name: globalTimer.name + "://:(Global)",
        time: parseInt(globalTimer.value),
        user: localStorage.getItem('loggedIn'),
        global: true,
        description: globalTimer.description
      });
      setGlobalTimer({name: "", value: 0, description: ""});
      showToast('Global timer created successfully!');
    } else {
      showToast('That timer already exists', 'error');
    }
  };

  // Fixed reduceTime function with toast notifications for expired timers
  const reduceTime = () => {
    const expiredTimers = [];

    for(let i = 0; i < allTimers.length; i++) {
      if(allTimers[i].time - tick <= 0) {
        // Collect expired timers for notification
        expiredTimers.push(allTimers[i].name.includes('://:') ? 
          allTimers[i].name.split("://:")[0] + " (Global)" : 
          allTimers[i].name
        );

        // Delete expired timer
        deleteDoc(doc(db, 'Timers', allTimers[i].name.includes('://:') ? 
          allTimers[i].name.split("://:")[0] + allTimers[i].user.toUpperCase() + 'GLOBAL' : 
          allTimers[i].name + localStorage.getItem('loggedIn').toUpperCase()
        ));
      } else {
        // Update remaining timer
        setDoc(doc(db, 'Timers', allTimers[i].name.includes('://:') ? 
          allTimers[i].name.split("://:")[0] + allTimers[i].user.toUpperCase() + 'GLOBAL' : 
          allTimers[i].name + localStorage.getItem('loggedIn').toUpperCase()
        ), {
          name: allTimers[i].name,
          time: (allTimers[i].time - tick),
          user: allTimers[i].user,
          global: allTimers[i].global,
          description: allTimers[i].description
        });
      }
    }

    // Show notifications for expired timers
    if (expiredTimers.length > 0) {
      expiredTimers.forEach((timerName, index) => {
        setTimeout(() => {
          showToast(`Timer "${timerName}" has expired!`, 'warning');
        }, index * 500); // Stagger notifications by 500ms each
      });
    }

    // Show general advancement notification
    showToast(`Advanced all timers by ${tick} units!`);
  };

  // Effects handling
  const handleEffects = (event, effectType) => {
    const newEffects = {...effects, [effectType]: event.target.value};
    setEffects(newEffects);
  };

  const saveEffectsToDb = (effectType, value) => {
    const newEffects = {...effects, [effectType]: value};
    
    setDoc(doc(db, 'Equipped', localStorage.getItem('loggedIn').toUpperCase()), {
      playerName: localStorage.getItem('loggedIn'),
      gear: page.gear,
      jewelry: page.jewelry,
      resources: page.resources,
      effects: newEffects
    });
  };

  const effectsChange = useCallback(
    debounce((effectType, value) => {
      saveEffectsToDb(effectType, value);
    }, 500),
    [page.gear, page.jewelry, page.resources, effects]
  );

  // useEffect for initialization
  useEffect(() => {
    if (localStorage.getItem("loggedIn") !== 'false') {
      getFromDB();
      getFromEquippedDB();
    }
  }, []);

  // Check authentication
  if (localStorage.getItem("loggedIn") === 'false') {
    return <NotLoggedIn />;
  }

  // Timer Card Component
  const TimerCard = memo(({ timer, isGlobal = false, size = 'normal' }) => {
    const getTimerColor = useCallback((time) => {
      if (time <= 50) return 'from-red-600 to-red-800 border-red-500/50';
      if (time <= 150) return 'from-amber-600 to-orange-700 border-amber-500/50';
      return 'from-emerald-600 to-green-700 border-emerald-500/50';
    }, []);

    const displayName = isGlobal ? timer.name.split('://:')[0] : timer.name;
    
    const sizeClasses = {
      small: 'p-2',
      normal: 'p-3',
      large: 'p-4'
    };

    return (
      <div className={`relative bg-gradient-to-br ${getTimerColor(timer.time)} rounded-xl border ${sizeClasses[size]} shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group w-40 flex-shrink-0`}>
        <div className="text-white">
          <div className="mb-1 text-center">
            <h3 className="font-bold text-base truncate pr-2" title={timer.description}>
              {displayName}
            </h3>
          </div>
          
          <div className="text-center mb-1">
            <div className="text-2xl font-bold mb-1">{timer.time}</div>
          </div>
          
          {timer.description && (
            <div className="text-center text-xs text-white/70 line-clamp-1 bg-black/20 rounded p-1">
              {timer.description}
            </div>
          )}
        </div>
      </div>
    );
  });

  // Stats Card Component
  const StatsCard = ({ title, value, subtitle, icon, color = 'purple' }) => {
    const colorClasses = {
      purple: 'from-purple-600 to-indigo-700 border-purple-500/50',
      blue: 'from-blue-600 to-cyan-700 border-blue-500/50',
      green: 'from-emerald-600 to-green-700 border-emerald-500/50',
      red: 'from-red-600 to-pink-700 border-red-500/50',
      amber: 'from-amber-600 to-orange-700 border-amber-500/50'
    };

    return (
      <div className={`bg-gradient-to-br ${colorClasses[color]} rounded-xl border p-6 shadow-lg`}>
        <div className="flex items-center justify-between text-white">
          <div>
            <h3 className="text-sm font-medium text-white/80 mb-1">{title}</h3>
            <div className="text-2xl font-bold mb-1">{value}</div>
            {subtitle && <div className="text-xs text-white/60">{subtitle}</div>}
          </div>
          <div className="text-white/60">
            {icon}
          </div>
        </div>
      </div>
    );
  };

  // Quick Action Button Component
  const QuickActionButton = ({ onClick, icon, label, color = 'purple', disabled = false }) => {
    const colorClasses = {
      purple: 'from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700',
      green: 'from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700',
      red: 'from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700',
      amber: 'from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700'
    };

    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`bg-gradient-to-r ${colorClasses[color]} ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg transform hover:scale-105'} text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center space-x-2`}
      >
        {icon}
        <span>{label}</span>
      </button>
    );
  };

  // Overview Dashboard Component
  const OverviewDashboard = () => {
    const criticalTimers = [...timers, ...globalTimers].filter(timer => timer.time <= 5);
    const warningTimers = [...timers, ...globalTimers].filter(timer => timer.time > 5 && timer.time <= 15);
    
    const criticalEffects = effects ? Object.entries(effects).filter(([key, value]) => {
      if (key === 'exhaustion' && parseInt(value) >= 3) return true;
      if (key === 'sanity' && parseInt(value) <= 19) return true;
      return false;
    }) : [];

    return (
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-purple-900/50 to-indigo-900/50 backdrop-blur-lg rounded-2xl border border-white/10 p-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Welcome back, <span className="text-purple-400">{localStorage.getItem('loggedIn')}</span>
              </h1>
              <p className="text-gray-300">Here's your current status in the Backrooms</p>
            </div>
            <div className="hidden md:block">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center">
                <span className="text-3xl">🎮</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Active Timers"
            value={timers.length}
            subtitle="Personal timers"
            color="blue"
            icon={
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"></path>
              </svg>
            }
          />
          <StatsCard
            title="Global Timers"
            value={globalTimers.length}
            subtitle="Shared timers"
            color="purple"
            icon={
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
              </svg>
            }
          />
          <StatsCard
            title="Resources"
            value={page.resources ? page.resources.length : 0}
            subtitle="Items tracked"
            color="green"
            icon={
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path>
              </svg>
            }
          />
          <StatsCard
            title="Critical Issues"
            value={criticalEffects.length + criticalTimers.length}
            subtitle="Needs attention"
            color="red"
            icon={
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
              </svg>
            }
          />
        </div>

        {/* Critical Alerts */}
        {(criticalTimers.length > 0 || criticalEffects.length > 0) && (
          <div className="bg-red-900/30 backdrop-blur-lg rounded-2xl border border-red-500/30 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <svg className="w-6 h-6 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
              </svg>
              <h2 className="text-xl font-bold text-red-400">Critical Alerts</h2>
            </div>
            
            <div className="space-y-3">
              {criticalTimers.map((timer) => (
                <div key={timer.name} className="bg-red-800/20 rounded-lg p-3 border border-red-500/20">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium">⏰ {timer.name}</span>
                    <span className="text-red-400 font-bold">{timer.time} remaining</span>
                  </div>
                </div>
              ))}
              
              {criticalEffects.map(([effect, value]) => (
                <div key={effect} className="bg-red-800/20 rounded-lg p-3 border border-red-500/20">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium">🩸 {effect.charAt(0).toUpperCase() + effect.slice(1)}</span>
                    <span className="text-red-400 font-bold">Level {value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Timers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Timers Preview */}
          <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Personal Timers</h2>
              <button
                onClick={() => setActiveSection('timers')}
                className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
              >
                View All →
              </button>
            </div>
            
            {timers.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"></path>
                </svg>
                <p>No active timers</p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {timers.slice(0, 4).map((timer) => (
                  <TimerCard key={timer.name} timer={timer} size="small" />
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
            <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
            
            <div className="space-y-3">
              <QuickActionButton
                onClick={() => setActiveSection('timers')}
                icon={
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"></path>
                  </svg>
                }
                label="Manage Timers"
                color="green"
              />
              
              <QuickActionButton
                onClick={() => setActiveSection('equipment')}
                icon={
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                }
                label="Manage Equipment"
                color="purple"
              />
              
              <QuickActionButton
                onClick={() => setActiveSection('effects')}
                icon={
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"></path>
                  </svg>
                }
                label="Check Status Effects"
                color="amber"
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Equipment Section Component
  const EquipmentSection = () => {
    if(Object.keys(page).length === 0) {
      return (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-400 mx-auto mb-4"></div>
            <h3 className="text-xl font-semibold text-white mb-2">Loading equipment data...</h3>
            <p className="text-gray-400">Please wait while we fetch your character information.</p>
          </div>
        </div>
      );
    }

    const resources = [];
    for(let i = 0; i < page.resources.length; i++) {
      resources.push(page.resources[i]);
    }

    const { register, control } = useForm({
      defaultValues: {
        gear: page.gear,
        jewelry: page.jewelry,
        resources: resources,
        effects: page.effects
      }
    });

    const { fields, append, remove } = useFieldArray({
      control,
      name: 'resources'
    });

    const handleGear = (event, piece) => {
      const gear = {};
      for(let i = 0; i < Object.keys(page.gear).length; i++) {
        if(Object.keys(page.gear)[i] === piece) gear[Object.keys(page.gear)[i]] = event.target.value;
        else gear[Object.keys(page.gear)[i]] = page.gear[Object.keys(page.gear)[i]];
      }
      setDoc(doc(db, 'Equipped', localStorage.getItem('loggedIn').toUpperCase()), {
        playerName: localStorage.getItem('loggedIn'),
        gear: gear,
        jewelry: page.jewelry,
        resources: page.resources,
        effects: page.effects
      });
    };

    const handleJewelry = (event, piece) => {
      const jewelry = {};
      for(let i = 0; i < Object.keys(page.jewelry).length; i++) {
        if(Object.keys(page.jewelry)[i] === piece) jewelry[Object.keys(page.jewelry)[i]] = event.target.value;
        else jewelry[Object.keys(page.jewelry)[i]] = page.jewelry[Object.keys(page.jewelry)[i]];
      }
      setDoc(doc(db, 'Equipped', localStorage.getItem('loggedIn').toUpperCase()), {
        playerName: localStorage.getItem('loggedIn'),
        gear: page.gear,
        jewelry: jewelry,
        resources: page.resources,
        effects: page.effects
      });
    };

    const handleResources = (event, index, type) => {
      const resources = [];
      const keys = Object.keys(page.resources);

      if(type === 'name') {
        for(let i = 0; i < keys.length; i++) {
          if(i === index) {
            resources[i] = {
              name: event.target.value,
              remaining: page.resources[keys[i]].remaining,
              maximum: page.resources[keys[i]].maximum
            };
          } else {
            resources[i] = {
              name: page.resources[keys[i]].name,
              remaining: page.resources[keys[i]].remaining,
              maximum: page.resources[keys[i]].maximum
            };
          }
        }
      } else if(type === 'remaining') {
        for(let i = 0; i < keys.length; i++) {
          if(i === index) {
            resources[i] = {
              name: page.resources[keys[i]].name,
              remaining: event.target.value,
              maximum: page.resources[keys[i]].maximum
            };
          } else {
            resources[i] = {
              name: page.resources[keys[i]].name,
              remaining: page.resources[keys[i]].remaining,
              maximum: page.resources[keys[i]].maximum
            };
          }
        }
      } else {
        for(let i = 0; i < keys.length; i++) {
          if(i === index) {
            resources[i] = {
              name: page.resources[keys[i]].name,
              remaining: page.resources[keys[i]].remaining,
              maximum: event.target.value
            };
          } else {
            resources[i] = {
              name: page.resources[keys[i]].name,
              remaining: page.resources[keys[i]].remaining,
              maximum: page.resources[keys[i]].maximum
            };
          }
        }
      }

      setDoc(doc(db, 'Equipped', localStorage.getItem('loggedIn').toUpperCase()), {
        playerName: localStorage.getItem('loggedIn'),
        gear: page.gear,
        jewelry: page.jewelry,
        resources: resources,
        effects: page.effects
      });
    };

    const addResource = () => {
      append({name: 'New Resource', remaining: '', maximum: ''});
      const resources = [];
      for(let i = 0; i < page.resources.length; i++) {
        resources.push(page.resources[i]);
      }
      resources.push({name: "New Resource", remaining: '', maximum: ''});

      setDoc(doc(db, 'Equipped', localStorage.getItem('loggedIn').toUpperCase()), {
        playerName: localStorage.getItem('loggedIn'),
        gear: page.gear,
        jewelry: page.jewelry,
        resources: resources,
        effects: page.effects
      });
    };

    const removeResource = (index) => {
      remove(index);
      const resources = [];
      for(let i = 0; i < page.resources.length; i++) {
        if(i !== index) resources.push(page.resources[i]);
      }
      updateDoc(doc(db, 'Equipped', localStorage.getItem('loggedIn').toUpperCase()), {
        resources: resources
      });
    };

    // Create debounced functions once, outside of the render cycle
    const debouncedGearChange = useCallback(debounce(handleGear, 500), []);
    const debouncedJewelryChange = useCallback(debounce(handleJewelry, 500), []);
    const debouncedResourcesChange = useCallback(debounce(handleResources, 500), []);

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-900/50 to-green-900/50 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
          <div className="flex items-center space-x-3">
            <svg className="w-8 h-8 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
            </svg>
            <div>
              <h1 className="text-2xl font-bold text-white">Equipment & Gear</h1>
              <p className="text-emerald-300">Manage your equipment and resources</p>
            </div>
          </div>
        </div>

        {/* Equipment Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Armor & Protection */}
          <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
              </svg>
              <h2 className="text-xl font-bold text-white">Armor & Protection</h2>
            </div>

            <div className="space-y-4">
              {['head', 'chest', 'arms', 'legs', 'feet'].map((piece) => (
                <div key={piece} className="space-y-2">
                  <label className="text-sm font-medium text-gray-300 capitalize">{piece}</label>
                  <input
                    type="text"
                    placeholder={`${piece.charAt(0).toUpperCase() + piece.slice(1)} equipment...`}
                    defaultValue={page.gear[piece] || ''}
                    onChange={(event) => debouncedGearChange(event, piece)}
                    className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Jewelry & Accessories */}
          <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <svg className="w-6 h-6 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
              <h2 className="text-xl font-bold text-white">Jewelry & Accessories</h2>
            </div>
            
            <div className="space-y-4">
              {[
                { key: 'earrings', label: 'Earrings' },
                { key: 'choker', label: 'Choker' },
                { key: 'bracelet', label: 'Bracelet' },
                { key: 'leftRing', label: 'Left Ring' },
                { key: 'rightRing', label: 'Right Ring' }
              ].map(({ key, label }) => (
                <div key={key} className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">{label}</label>
                  <input
                    type="text"
                    placeholder={`${label}...`}
                    defaultValue={page.jewelry[key] || ''}
                    onChange={(event) => debouncedJewelryChange(event, key)}
                    className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Resources Section */}
        <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <svg className="w-6 h-6 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path>
              </svg>
              <div>
                <h2 className="text-xl font-bold text-white">Resources</h2>
                <p className="text-gray-400 text-sm">Track your consumables and supplies</p>
              </div>
            </div>
            <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-sm font-bold">
              {fields.length} items
            </span>
          </div>
            
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            {fields.map((field, index) => (
              <div key={field.id} className="bg-white/5 rounded-xl border border-white/10 p-4 relative group hover:bg-white/10 transition-all">
                <button
                  onClick={() => removeResource(index)}
                  className="absolute top-2 right-2 text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                  </svg>
                </button>

                <div className="space-y-3 pr-8">
                  <input
                    type="text"
                    placeholder="Resource Name"
                    defaultValue={page.resources[index]?.name || ''}
                    onChange={(event) => debouncedResourcesChange(event, index, "name")}
                    className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  />

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      placeholder="Current"
                      defaultValue={page.resources[index]?.remaining || ''}
                      onChange={(event) => debouncedResourcesChange(event, index, 'remaining')}
                      className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    />
                    <input
                      type="number"
                      placeholder="Maximum"
                      defaultValue={page.resources[index]?.maximum || ''}
                      onChange={(event) => debouncedResourcesChange(event, index, 'maximum')}
                      className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    />
                  </div>

                  {page.resources[index]?.remaining && page.resources[index]?.maximum && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>{page.resources[index].remaining}</span>
                        <span>{page.resources[index].maximum}</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min((page.resources[index].remaining / page.resources[index].maximum) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <button 
            onClick={addResource} 
            className="w-full bg-green-600/20 hover:bg-green-600/30 border-2 border-dashed border-green-500/50 hover:border-green-500 rounded-xl p-6 text-green-400 hover:text-green-300 transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"></path>
            </svg>
            <span className="font-medium">Add New Resource</span>
          </button>
        </div>
      </div>
    );
  };

  // Timers Section Component
  const TimersSection = () => {
    // Local state for input values to prevent focus loss
    const [localAddName, setLocalAddName] = useState(addName);
    const [localAddTime, setLocalAddTime] = useState(addTime);
    const [localAddDescription, setLocalAddDescription] = useState(addDescription);
    const [localEditTime, setLocalEditTime] = useState(editTime);
    const [localEditDescription, setLocalEditDescription] = useState(editDescription);
    const [localGlobalTimer, setLocalGlobalTimer] = useState(globalTimer);
    const [localTick, setLocalTick] = useState(tick);

    // Sync local state with parent state when parent changes
    useEffect(() => {
      setLocalAddName(addName);
    }, [addName]);

    useEffect(() => {
      setLocalAddTime(addTime);
    }, [addTime]);

    useEffect(() => {
      setLocalAddDescription(addDescription);
    }, [addDescription]);

    useEffect(() => {
      setLocalEditTime(editTime);
    }, [editTime]);

    useEffect(() => {
      setLocalEditDescription(editDescription);
    }, [editDescription]);

    useEffect(() => {
      setLocalGlobalTimer(globalTimer);
    }, [globalTimer]);

    useEffect(() => {
      setLocalTick(tick);
    }, [tick]);

    // Custom add timer function that uses local state
    const handleAddTimer = () => {
      let ready = true;
      for(let i = 0; i < timers.length; i++) {
        if(timers[i].name.toUpperCase() === localAddName.toUpperCase() && timers[i].user.toUpperCase() === localStorage.getItem('loggedIn').toUpperCase()) ready = false;
      }

      if(localAddName === '') {
        showToast('Timer name cannot be empty', 'error');
        return;
      }

      if(parseInt(localAddTime) <= 0) {
        showToast('Timer value must be greater than 0', 'error');
        return;
      }

      if(ready) {
        setDoc(doc(db, 'Timers', localAddName + localStorage.getItem('loggedIn').toUpperCase()), {
          name: localAddName,
          time: parseInt(localAddTime),
          user: localStorage.getItem('loggedIn'),
          global: false,
          description: localAddDescription
        });

        // Update parent state and clear local state
        setAddName("");
        setAddTime(0);
        setAddDescription("");
        setLocalAddName("");
        setLocalAddTime(0);
        setLocalAddDescription("");
        showToast('Timer created successfully!');
      } else {
        showToast('That timer already exists', 'error');
      }
    };

    // Custom edit timer function
    const handleEditTimer = () => {
      if(parseInt(localEditTime) <= 0) {
        showToast('Timer value must be greater than 0', 'error');
        return;
      }

      setDoc(doc(db, 'Timers', editName.includes('://:') ? editName.split('://:')[0] + localStorage.getItem('loggedIn').toUpperCase() + 'GLOBAL' : editName + localStorage.getItem('loggedIn').toUpperCase()), {
        name: editName,
        time: parseInt(localEditTime),
        user: localStorage.getItem('loggedIn'),
        global: editName.includes('://:') ? true : false,
        description: localEditDescription
      });

      // Update parent state
      setEditTime(localEditTime);
      setEditDescription(localEditDescription);
      showToast('Timer updated successfully!');
    };

    // Custom global timer function
    const handleAddGlobalTimer = () => {
      let ready = true;
      for(let i = 0; i < globalTimers.length; i++) {
        if(globalTimers[i].name.toUpperCase() === (localGlobalTimer.name + "://:(Global)").toUpperCase() && globalTimers[i].user.toUpperCase() === localStorage.getItem('loggedIn').toUpperCase()) ready = false;
      }

      if(localGlobalTimer.name === '') {
        showToast('Timer name cannot be empty', 'error');
        return;
      }

      if(parseInt(localGlobalTimer.value) <= 0) {
        showToast('Timer value must be greater than 0', 'error');
        return;
      }

      if(ready) {
        setDoc(doc(db, 'Timers', localGlobalTimer.name + localStorage.getItem('loggedIn').toUpperCase() + 'GLOBAL'), {
          name: localGlobalTimer.name + "://:(Global)",
          time: parseInt(localGlobalTimer.value),
          user: localStorage.getItem('loggedIn'),
          global: true,
          description: localGlobalTimer.description
        });

        // Update parent state and clear local state
        setGlobalTimer({name: "", value: 0, description: ""});
        setLocalGlobalTimer({name: "", value: 0, description: ""});
        showToast('Global timer created successfully!');
      } else {
        showToast('That timer already exists', 'error');
      }
    };

    // Custom reduce time function with expired timer notifications
    const handleReduceTime = () => {
      const expiredTimers = [];

      for(let i = 0; i < allTimers.length; i++) {
        if(allTimers[i].time - localTick <= 0) {
          // Collect expired timers for notification
          expiredTimers.push(allTimers[i].name.includes('://:') ? 
            allTimers[i].name.split("://:")[0] + " (Global)" : 
            allTimers[i].name
          );

          // Delete expired timer
          deleteDoc(doc(db, 'Timers', allTimers[i].name.includes('://:') ? 
            allTimers[i].name.split("://:")[0] + allTimers[i].user.toUpperCase() + 'GLOBAL' : 
            allTimers[i].name + localStorage.getItem('loggedIn').toUpperCase()
          ));
        } else {
          // Update remaining timer
          setDoc(doc(db, 'Timers', allTimers[i].name.includes('://:') ? 
            allTimers[i].name.split("://:")[0] + allTimers[i].user.toUpperCase() + 'GLOBAL' : 
            allTimers[i].name + localStorage.getItem('loggedIn').toUpperCase()
          ), {
            name: allTimers[i].name,
            time: (allTimers[i].time - localTick),
            user: allTimers[i].user,
            global: allTimers[i].global,
            description: allTimers[i].description
          });
        }
      }

      // Show notifications for expired timers
      if (expiredTimers.length > 0) {
        expiredTimers.forEach((timerName, index) => {
          setTimeout(() => {
            showToast(`Timer "${timerName}" has expired!`, 'warning');
          }, index * 500); // Stagger notifications by 500ms each
        });
      }

      // Update parent state
      setTick(localTick);
      showToast(`Advanced all timers by ${localTick} units!`);
    };

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900/50 to-cyan-900/50 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
          <div className="flex items-center space-x-3">
            <svg className="w-8 h-8 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"></path>
            </svg>
            <div>
              <h1 className="text-2xl font-bold text-white">Timer Management</h1>
              <p className="text-blue-300">Monitor and control your active timers</p>
            </div>
          </div>
        </div>

        {/* Timer Display Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Personal Timers */}
          <div className="xl:col-span-2">
            <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 p-4 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"></path>
                    </svg>
                    <h2 className="text-xl font-bold text-white">Personal Timers</h2>
                  </div>
                  <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm font-bold">
                    {timers.length} active
                  </span>
                </div>
              </div>

              <div className="p-6 h-96 overflow-y-auto">
                {timers.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <svg className="w-16 h-16 text-gray-500 mb-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"></path>
                    </svg>
                    <h3 className="text-lg font-semibold text-gray-400 mb-2">No Personal Timers</h3>
                    <p className="text-gray-500 mb-4">Create your first timer to get started!</p>
                    <button
                      onClick={() => document.getElementById('add-timer-form').scrollIntoView({ behavior: 'smooth' })}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Create Timer
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {timers.map((timer) => (
                      <TimerCard key={`${timer.name}-${timer.time}`} timer={timer} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Global Timers */}
          <div>
            <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600/20 to-indigo-600/20 p-4 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <svg className="w-6 h-6 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                    <h2 className="text-xl font-bold text-white">Global Timers</h2>
                  </div>
                  <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm font-bold">
                    {globalTimers.length}
                  </span>
                </div>
              </div>
              
              <div className="p-4 h-96 overflow-y-auto">
                {globalTimers.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <svg className="w-12 h-12 text-gray-500 mb-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                    <h3 className="text-sm font-semibold text-gray-400 mb-1">No Global Timers</h3>
                    <p className="text-gray-500 text-xs">No shared timers active</p>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {globalTimers.map((timer) => (
                      <TimerCard key={`${timer.name}-${timer.time}`} timer={timer} isGlobal size="small" />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Timer Management Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              
          {/* Add Timer */}
          <div id="add-timer-form" className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <svg className="w-6 h-6 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"></path>
              </svg>
              <h2 className="text-lg font-bold text-white">Add New Timer</h2>
            </div>
              
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Timer Name"
                value={localAddName}
                onChange={(e) => setLocalAddName(e.target.value)}
                className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              />
              <input
                type="number"
                placeholder="Timer Value"
                value={localAddTime}
                onChange={(e) => setLocalAddTime(e.target.value)}
                className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              />
              <textarea
                placeholder="Timer Description (optional)"
                value={localAddDescription}
                onChange={(e) => setLocalAddDescription(e.target.value)}
                rows={3}
                className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
              />
              <button
                onClick={handleAddTimer}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"></path>
                </svg>
                <span>Create Timer</span>
              </button>
            </div>
          </div>

          {/* Edit Timer */}
          <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <svg className="w-6 h-6 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path>
              </svg>
              <h2 className="text-lg font-bold text-white">Edit Timer</h2>
            </div>
              
            <div className="space-y-4">
              <select
                value={editName || 'None'}
                onChange={handleEditSelect}
                className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
              >
                <option value='None' className="bg-gray-800">Select Timer to Edit</option>
                {timers.map((timer) => (
                  <option key={timer.name} value={timer.name} className="bg-gray-800">{timer.name}</option>
                ))}
                {localStorage.getItem('loggedIn').toUpperCase() === 'ADMIN' &&
                  globalTimers.map((timer) => (
                    <option key={timer.name} value={timer.name} className="bg-gray-800">
                      {timer.name.split("://:")[0] + " (Global)"}
                    </option>
                  ))
                }
              </select>
              <input
                type="number"
                placeholder="New Timer Value"
                value={localEditTime}
                onChange={(e) => setLocalEditTime(e.target.value)}
                disabled={editName === 'None'}
                className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <textarea
                placeholder="New Timer Description"
                value={localEditDescription}
                onChange={(e) => setLocalEditDescription(e.target.value)}
                disabled={editName === 'None'}
                rows={2}
                className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button
                onClick={handleEditTimer}
                disabled={editName === 'None'}
                className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path>
                </svg>
                <span>Update Timer</span>
              </button>
            </div>
          </div>

          {/* Remove Timer */}
          <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <svg className="w-6 h-6 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"></path>
              </svg>
              <h2 className="text-lg font-bold text-white">Remove Timer</h2>
            </div>
              
            <div className="space-y-4">
              <select
                value={removeName || 'None'}
                onChange={(e) => setRemoveName(e.target.value)}
                className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              >
                <option value='None' className="bg-gray-800">Select Timer to Remove</option>
                {timers.map((timer) => (
                  <option key={timer.name} value={timer.name} className="bg-gray-800">{timer.name}</option>
                ))}
                {localStorage.getItem('loggedIn').toUpperCase() === 'ADMIN' &&
                  globalTimers.map((timer) => (
                    <option key={timer.name} value={timer.name} className="bg-gray-800">
                      {timer.name.split("://:")[0] + " (Global)"}
                    </option>
                  ))
                }
              </select>
              <button
                onClick={removeTimer}
                disabled={removeName === 'None'}
                className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"></path>
                </svg>
                <span>Delete Timer</span>
              </button>
            </div>
          </div>
        </div>

        {/* Admin Controls */}
        {localStorage.getItem('loggedIn').toUpperCase() === 'ADMIN' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Add Global Timer */}
            <div className="bg-gradient-to-br from-orange-900/30 to-yellow-900/30 backdrop-blur-lg rounded-2xl border border-orange-500/20 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <svg className="w-6 h-6 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
                <h2 className="text-lg font-bold text-white">Add Global Timer</h2>
                <span className="bg-orange-500/30 text-orange-300 px-2 py-1 rounded text-xs font-bold">
                  ADMIN
                </span>
              </div>

              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Global Timer Name"
                  value={localGlobalTimer.name}
                  onChange={(e) => setLocalGlobalTimer({...localGlobalTimer, name: e.target.value})}
                  className="w-full bg-white/5 border border-orange-500/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                />
                <input
                  type="number"
                  placeholder="Timer Value"
                  value={localGlobalTimer.value}
                  onChange={(e) => setLocalGlobalTimer({...localGlobalTimer, value: e.target.value})}
                  className="w-full bg-white/5 border border-orange-500/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                />
                <textarea
                  placeholder="Timer Description"
                  value={localGlobalTimer.description}
                  onChange={(e) => setLocalGlobalTimer({...localGlobalTimer, description: e.target.value})}
                  rows={2}
                  className="w-full bg-white/5 border border-orange-500/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none"
                />
                <button
                  onClick={handleAddGlobalTimer}
                  className="w-full bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-700 hover:to-yellow-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  <span>Create Global Timer</span>
                </button>
              </div>
            </div>

            {/* Advance All Timers */}
            <div className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 backdrop-blur-lg rounded-2xl border border-purple-500/20 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <svg className="w-6 h-6 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"></path>
                </svg>
                <h2 className="text-lg font-bold text-white">Advance All Timers</h2>
                <span className="bg-purple-500/30 text-purple-300 px-2 py-1 rounded text-xs font-bold">
                  ADMIN
                </span>
              </div>

              <div className="space-y-4">
                <input
                  type="number"
                  placeholder="Tick Value"
                  value={localTick}
                  onChange={(e) => setLocalTick(e.target.value)}
                  className="w-full bg-white/5 border border-purple-500/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
                <div className="text-sm text-gray-400 bg-purple-900/20 rounded-lg p-3">
                  ⚠️ This will advance ALL timers by the specified amount. Timers reaching 0 will be automatically deleted.
                </div>
                <button
                  onClick={handleReduceTime}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"></path>
                  </svg>
                  <span>Advance Time</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Effects Display Components
  const DisplayExhaustion = () => {
    const exhaustionValue = parseInt(effects.exhaustion) > 5 ? 5 : parseInt(effects.exhaustion) || 0;
    const exhaustionEffects = [
      'No Effect', 
      'Add one Setback die to all Brawn and Agility checks.', 
      'Add two Setback die to all Brawn and Agility checks.', 
      'Add three Setback die to all Brawn and Agility checks.',
      'Add four Setback die to all Brawn and Agility checks.',
      'You are Incapacitated until exhaustion is reduced.'
    ];

    const currentEffect = exhaustionEffects[exhaustionValue] || exhaustionEffects[0];
    const severityClass = exhaustionValue === 0 
      ? 'bg-green-500/10 border-green-500/20 text-green-300' 
      : exhaustionValue <= 2 
      ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-300' 
      : 'bg-red-500/10 border-red-500/20 text-red-300';

    return (
      <div className={`rounded-lg p-3 border ${severityClass}`}>
        <p className="text-sm">
          <strong>Level {exhaustionValue}:</strong> {currentEffect}
        </p>
      </div>
    );
  };

  const DisplaySanity = () => {
    const sanityValue = parseInt(effects.sanity) || 100;
    let sanityEffects = {};

    // Determine which effects are active based on sanity percentage
    if (sanityValue <= 79) sanityEffects = { level: 79, effect: 'Add one Setback dice to all mental checks.' };
    if (sanityValue <= 59) sanityEffects = { level: 59, effect: 'Add two Setback dice to all mental checks.' };
    if (sanityValue <= 39) sanityEffects = { level: 39, effect: 'Add three Setback dice to all mental checks and become Disoriented.' };
    if (sanityValue <= 19) sanityEffects = { level: 19, effect: 'Add four Setback dice to all mental checks and become Confused Disoriented.' };
    if (sanityValue <= 0) sanityEffects = { level: 0, effect: 'You are Incapacitated until sanity is restored' };

    const severityClass = sanityValue > 50 
      ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-300' 
      : sanityValue > 20 
      ? 'bg-orange-500/10 border-orange-500/20 text-orange-300'
      : 'bg-red-500/10 border-red-500/20 text-red-300';

    return (
      <div className="space-y-2">
        {sanityValue > 79 ? 
          <div className={`rounded-lg p-3 border ${severityClass}`}>
            <p className="text-sm">
              No Effect
            </p>
          </div>
          :
          <div className={`rounded-lg p-3 border ${severityClass}`}>
            <p className="text-sm">
              {sanityEffects.effect}
            </p>
          </div>
        }
      </div>
    );
  };

  const DisplayEncumbrance = () => {
    const encumbrance = parseInt(effects.encumbrance);
    const brawn = parseInt(effects.brawn);
    const maxEncumbrance = parseInt(5 + brawn);

    let severityClass = "bg-green-500/10 border-green-500/20 text-green-300";
    let message = "No detriment";

    if(encumbrance > maxEncumbrance && encumbrance < (maxEncumbrance + brawn)) {
      severityClass = "bg-yellow-500/10 border-yellow-500/20 text-yellow-300";
      message = `You add ${encumbrance - maxEncumbrance} setback dice to all brawn and agility checks.`;
    } else if(encumbrance >= (maxEncumbrance + brawn)) {
      severityClass = "bg-red-500/10 border-red-500/20 text-red-300";
      message = `You add ${encumbrance - maxEncumbrance} setback dice to all brawn and agility checks and all maneuvers now cost strain.`;
    }

    return (
      <div className={`rounded-lg p-3 border ${severityClass}`}>
        <p className="text-sm">{message}</p>
      </div>
    );
  };

  // Effects Section Component
  const EffectsSection = () => {
    if (!effects) {
      return (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-400 mx-auto mb-4"></div>
            <h3 className="text-xl font-semibold text-white mb-2">Loading effects data...</h3>
            <p className="text-gray-400">Please wait while we fetch your status effects.</p>
          </div>
        </div>
      );
    }

    // Create debounced function once, outside of render cycle
    const debouncedEffectsChange = useCallback(
      debounce((effectType, value) => {
        saveEffectsToDb(effectType, value);
      }, 500),
      [page.gear, page.jewelry, page.resources, effects]
    );

    const effectsData = [
      {
        id: 'exhaustion',
        name: 'Exhaustion',
        value: effects.exhaustion,
        icon: (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        ),
        color: 'orange',
        display: <DisplayExhaustion />
      },
      {
        id: 'sanity',
        name: 'Sanity',
        value: effects.sanity,
        icon: (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"></path>
          </svg>
        ),
        color: 'purple',
        display: <DisplaySanity />
      },
      {
        id: 'encumbrance',
        name: 'Encumbrance',
        value: effects.encumbrance,
        icon: (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path>
          </svg>
        ),
        color: 'green',
        display: <DisplayEncumbrance />
      }
    ];

    const getColorClasses = (color) => {
      const colors = {
        orange: 'from-orange-600/20 to-red-600/20 border-orange-500/20 text-orange-400',
        purple: 'from-purple-600/20 to-indigo-600/20 border-purple-500/20 text-purple-400',
        green: 'from-green-600/20 to-emerald-600/20 border-green-500/20 text-green-400',
        yellow: 'from-yellow-600/20 to-orange-600/20 border-yellow-500/20 text-yellow-400',
        pink: 'from-pink-600/20 to-purple-600/20 border-pink-500/20 text-pink-400'
      };
      return colors[color] || colors.purple;
    };

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
          <div className="flex items-center space-x-3">
            <svg className="w-8 h-8 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"></path>
            </svg>
            <div>
              <h1 className="text-2xl font-bold text-white">Status Effects</h1>
              <p className="text-purple-300">Monitor your character's condition and afflictions</p>
            </div>
          </div>
        </div>

        {/* Effects Grid */}
        <div className="space-y-6">
          {effectsData.map((effect) => (
            <div key={effect.id} className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 overflow-hidden">
              <div className={`bg-gradient-to-r ${getColorClasses(effect.color)} p-4 border-b border-white/10`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className={getColorClasses(effect.color).split(' ')[3]}>
                      {effect.icon}
                    </span>
                    <h2 className="text-xl font-bold text-white">{effect.name}</h2>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                    effect.value == 0 ? 'bg-green-500/30 text-green-300' : 
                    effect.value <= 2 ? 'bg-yellow-500/30 text-yellow-300' : 
                    'bg-red-500/30 text-red-300'
                  }`}>
                    Level {effect.value}
                  </span>
                </div>
              </div>
                
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-1">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      {effect.id === 'sanity' ? 'Sanity Percentage' : `${effect.name} Level`}
                    </label>
                    <input
                      type="number"
                      placeholder={effect.id === 'sanity' ? 'Sanity Percentage (0-100)' : `${effect.name} Level`}
                      defaultValue={effects[effect.id] || ''}
                      onChange={(e) => {
                        handleEffects(e, effect.id);
                        debouncedEffectsChange(effect.id, e.target.value);
                      }}
                      className={`w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-${effect.color}-500 focus:border-transparent transition-all`}
                    />

                    {effect.id === 'encumbrance' && (
                      <div className="mt-4 space-y-3">
                        <input
                          type="number"
                          placeholder="Brawn Score"
                          defaultValue={effects.brawn || ''}
                          onChange={(e) => {
                            handleEffects(e, 'brawn');
                            debouncedEffectsChange('brawn', e.target.value);
                          }}
                          className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        />
                        <input
                          type="number"
                          placeholder="Max Encumbrance"
                          value={parseInt(effects.brawn || 0) + 5}
                          disabled
                          className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 opacity-50 cursor-not-allowed"
                        />
                      </div>
                    )}
                  </div>
                  
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Active Effects
                    </label>
                    <div className="bg-white/5 rounded-lg p-4 border border-white/10 max-h-64 overflow-y-auto">
                      {effect.display}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Main render
  return (
    <div className="h-screen w-full bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 flex overflow-hidden">
      {/* Sidebar */}
      <Sidebar 
        activeSection={activeSection} 
        setActiveSection={setActiveSection} 
        timers={timers} 
        globalTimers={globalTimers} 
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Status Bar */}
        <div className="bg-black/10 backdrop-blur-sm border-b border-white/10 px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-sm font-medium">Connected</span>
              </div>
              
              {effects && (
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-1">
                    <span className="text-gray-400">Exhaustion:</span>
                    <span className={`font-bold ${
                      effects.exhaustion <= 2 ? 'text-green-400' : 
                      effects.exhaustion <= 4 ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {effects.exhaustion}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-gray-400">Sanity:</span>
                    <span className={`font-bold ${
                      effects.sanity > 50 ? 'text-green-400' : 
                      effects.sanity <= 50 && effects.sanity > 19 ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {effects.sanity}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">
                  {localStorage.getItem('loggedIn')?.charAt(0)?.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="w-full mx-auto">
            {activeSection === 'overview' && <OverviewDashboard />}
            {activeSection === 'equipment' && <EquipmentSection />}
            {activeSection === 'timers' && <TimersSection />}
            {activeSection === 'effects' && <EffectsSection />}
          </div>
        </div>
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
};