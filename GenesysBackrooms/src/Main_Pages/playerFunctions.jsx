import React, { useEffect, useState, memo, useCallback } from 'react';
import { collection, deleteDoc, doc, onSnapshot, query, setDoc, where } from "firebase/firestore";
import db, { auth } from '../Components/firebase';
import { isDM, getActiveSession } from '../Components/sessionUtils';
import { onAuthStateChanged } from 'firebase/auth';

// NotLoggedIn component
const NotLoggedIn = () => (
  <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
    <div className="bg-black/40 backdrop-blur-lg rounded-2xl border border-white/10 shadow-2xl p-6 md:p-8 text-center max-w-md w-full">
      <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl mx-auto mb-6 flex items-center justify-center">
        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"></path>
        </svg>
      </div>
      <h2 className="text-xl md:text-2xl font-bold text-white mb-4">Access Restricted</h2>
      <p className="text-gray-300 mb-4">Please authenticate to access the Player Dashboard</p>
      <a 
        href="/login"
        className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-200"
      >
        Sign In
      </a>
    </div>
  </div>
);

// NoSession component
const NoSession = () => (
  <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
    <div className="bg-black/40 backdrop-blur-lg rounded-2xl border border-white/10 shadow-2xl p-6 md:p-8 text-center max-w-md w-full">
      <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl mx-auto mb-6 flex items-center justify-center">
        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path>
        </svg>
      </div>
      <h2 className="text-xl md:text-2xl font-bold text-white mb-4">No Active Session</h2>
      <p className="text-gray-300 mb-6">You need to select or create a campaign session to use player functions</p>
      <a 
        href="/session-selector"
        className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-200"
      >
        Select Session
      </a>
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
    <div className="fixed top-4 right-4 left-4 md:left-auto z-50 animate-slide-down">
      <div className={`${severityClasses[severity]} text-white px-4 md:px-6 py-3 md:py-4 rounded-lg border shadow-xl flex items-center space-x-3 w-full md:min-w-80 md:w-auto`}>
        <div className="text-lg md:text-xl font-bold">{icons[severity]}</div>
        <span className="flex-1 text-sm md:text-base">{message}</span>
        <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

// Mobile-friendly Sidebar navigation component
const Sidebar = ({ activeSection, setActiveSection, timers, globalTimers, userIsDM, isMobileMenuOpen, setIsMobileMenuOpen }) => {
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
    },
    { 
      id: 'diseases', 
      name: 'Diseases', 
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd"></path>
        </svg>
      )
    }
  ];

  const handleMenuClick = (itemId) => {
    setActiveSection(itemId);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex h-screen w-64 bg-black/20 backdrop-blur-xl border-r border-white/10 flex-col">
        {/* Logo/Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">⚡</span>
            </div>
            <div>
              <h1 className="text-white font-bold text-lg">Player Hub</h1>
              <p className="text-purple-300 text-sm truncate">{localStorage.getItem('loggedIn')}</p>
              {userIsDM && (
                <span className="inline-block mt-1 bg-amber-500/20 text-amber-300 text-xs px-2 py-0.5 rounded-full font-medium">
                  👑 DM Mode
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
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
            <p className="text-purple-400">v2.0 - Session System</p>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div className={`lg:hidden fixed inset-y-0 left-0 w-64 bg-black/95 backdrop-blur-xl border-r border-white/10 z-50 transform transition-transform duration-300 ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Mobile Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">⚡</span>
            </div>
            <div>
              <h1 className="text-white font-bold">Player Hub</h1>
              <p className="text-purple-300 text-xs truncate">{localStorage.getItem('loggedIn')}</p>
              {userIsDM && (
                <span className="inline-block mt-0.5 bg-amber-500/20 text-amber-300 text-xs px-2 py-0.5 rounded-full font-medium">
                  👑 DM
                </span>
              )}
            </div>
          </div>
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-gray-400 hover:text-white"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        <nav className="p-4 overflow-y-auto h-full pb-20">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleMenuClick(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    activeSection === item.id
                      ? 'bg-purple-600/30 text-white border border-purple-500/50'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className={activeSection === item.id ? 'text-purple-400' : 'text-gray-400'}>
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
      </div>
    </>
  );
};

export default function PlayerFunctions() {
  // Authentication and session state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionId, setSessionId] = useState(null);
  const [userIsDM, setUserIsDM] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // State declarations
  const [timers, setTimers] = useState([]);
  const [globalTimers, setGlobalTimers] = useState([]);
  const [allTimers, setAllTimers] = useState([]);
  const [page, setPage] = useState({});
  const [activeSection, setActiveSection] = useState('overview');
  const [effects, setEffects] = useState(null);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const [lastTickAmount, setLastTickAmount] = useState(0);

  // Toast functions
  const showToast = (message, severity = 'success') => {
    setToast({ open: true, message, severity });
  };

  const hideToast = () => {
    setToast({ ...toast, open: false });
  };

  // Check authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.warn(user);
        setIsAuthenticated(true);
        
        const activeSession = getActiveSession();
        if (activeSession) {
          setSessionId(activeSession);
          setUserIsDM(isDM());
        }
      } else {
        setIsAuthenticated(false);
        localStorage.setItem('loggedIn', 'false');
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const getFromDB = useCallback(() => {
    if (!sessionId) return;

    console.log('Setting up timers listener for session:', sessionId);

    try {
      // Simple query without orderBy (no index needed)
      const q = query(
        collection(db, 'Timers'),
        where('sessionId', '==', sessionId)
      );

      const unsub = onSnapshot(q, 
        (querySnapshot) => {
          console.log('Timers snapshot received, documents:', querySnapshot.size);
          const nonGlobal = [];
          const global = [];
          const queryData = [];

          querySnapshot.forEach((doc) => {
            const data = doc.data();
            console.log('Timer document:', data);

            if(data.global === false && data.user.toUpperCase() === localStorage.getItem("loggedIn").toUpperCase()) {
              nonGlobal.push(data);
            } else if(data.global) {
              global.push(data);
            }
            queryData.push(data);
          });

          // Sort in memory instead of in query (no index needed)
          nonGlobal.sort((a, b) => b.time - a.time);
          global.sort((a, b) => b.time - a.time);
          queryData.sort((a, b) => b.time - a.time);

          console.log('Personal timers:', nonGlobal.length, 'Global timers:', global.length);
          setTimers(nonGlobal);
          setGlobalTimers(global);
          setAllTimers(queryData);
        }, 
        (error) => {
          console.error("Error fetching timers:", error);
          console.error("Error code:", error.code);
          console.error("Error message:", error.message);
          showToast(`Error loading timers: ${error.message}`, 'error');
        }
      );

      return unsub;
    } catch (error) {
      console.error("Error setting up timers query:", error);
      showToast('Error setting up timers listener', 'error');
    }
  }, [sessionId]);

  const getFromEquippedDB = useCallback(() => {
    if (!sessionId) return;

    console.log('Setting up equipment listener for session:', sessionId, 'player:', localStorage.getItem('loggedIn'));

    try {
      // Use direct document reference instead of query (no index needed)
      const docId = `${sessionId}_${localStorage.getItem('loggedIn').toUpperCase()}`;
      const docRef = doc(db, 'Equipped', docId);

      const unsub = onSnapshot(docRef, 
        (docSnapshot) => {
          console.log('Equipment snapshot received, exists:', docSnapshot.exists());

          if (docSnapshot.exists()) {
            console.log('Equipment document:', docSnapshot.data());
            setPage(docSnapshot.data());
            setEffects(docSnapshot.data().effects);
          } else {
            console.log('No equipment found, creating default document');
            const defaultData = {
              playerName: localStorage.getItem('loggedIn'),
              sessionId: sessionId,
              gear: {head: "", chest: "", arms: "", legs: "", feet: ""},
              jewelry: {earrings: "", choker: "", bracelet: "", leftRing: "", rightRing: ""},
              resources: [],
              effects: {exhaustion: '0', sanity: '100', encumbrance: '0', disease: '0', wretchedCycle: '0', brawn: '0'}
            };

            setDoc(docRef, defaultData)
              .then(() => {
                console.log('Default equipment document created successfully');
              })
              .catch(error => {
                console.error("Error creating equipped document:", error);
                showToast(`Error initializing equipment: ${error.message}`, 'error');
              });
          }
        }, 
        (error) => {
          console.error("Error fetching equipment:", error);
          showToast(`Error loading equipment: ${error.message}`, 'error');
        }
      );

      return unsub;
    } catch (error) {
      console.error("Error setting up equipment query:", error);
      showToast('Error setting up equipment listener', 'error');
    }
  }, [sessionId]);

  // Set up database listeners when sessionId is available
  useEffect(() => {
    if (!sessionId || !isAuthenticated) return;
    
    const unsubTimer = getFromDB();
    const unsubEquipped = getFromEquippedDB();
    
    return () => {
      if (unsubTimer) unsubTimer();
      if (unsubEquipped) unsubEquipped();
    };
  }, [sessionId, isAuthenticated, getFromDB, getFromEquippedDB]);

  // NEW: Reverse time function
  const reverseTime = () => {
    if (!sessionId) {
      showToast('No active session', 'error');
      return;
    }

    if (!userIsDM) {
      showToast('Only the DM can reverse timers', 'error');
      return;
    }

    if (lastTickAmount === 0) {
      showToast('No previous advance to reverse', 'error');
      return;
    }

    const updatePromises = allTimers.map((timer) => {
      const isGlobal = timer.global;
      const cleanName = isGlobal ? timer.name.split('://:')[0] : timer.name;
      const docId = isGlobal 
        ? `${sessionId}_${cleanName}_GLOBAL`
        : `${sessionId}_${timer.name}_${timer.user.toUpperCase()}`;

      return setDoc(doc(db, 'Timers', docId), {
        name: timer.name,
        time: (timer.time + lastTickAmount),
        user: timer.user,
        global: timer.global,
        description: timer.description,
        sessionId: sessionId
      });
    });

    Promise.all(updatePromises).then(() => {
      showToast(`Reversed all timers by ${lastTickAmount} units!`, 'info');
      setLastTickAmount(0);
    }).catch(error => {
      console.error("Error reversing timers:", error);
      showToast('Error reversing timers', 'error');
    });
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <h3 className="text-xl font-semibold text-white mb-2">Loading...</h3>
          <p className="text-gray-400">Checking authentication</p>
        </div>
      </div>
    );
  }

  // Check authentication
  if (!isAuthenticated) {
    return <NotLoggedIn />;
  }

  // Check session
  if (!sessionId) {
    return <NoSession />;
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
      <div className={`relative bg-gradient-to-br ${getTimerColor(timer.time)} rounded-xl border ${sizeClasses[size]} shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group w-32 md:w-40 flex-shrink-0`}>
        <div className="text-white">
          <div className="mb-1 text-center">
            <h3 className="font-bold text-sm md:text-base truncate pr-2" title={timer.description}>
              {displayName}
            </h3>
          </div>
          
          <div className="text-center mb-1">
            <div className="text-xl md:text-2xl font-bold mb-1">{timer.time}</div>
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
      <div className={`bg-gradient-to-br ${colorClasses[color]} rounded-xl border p-4 md:p-6 shadow-lg`}>
        <div className="flex items-center justify-between text-white">
          <div>
            <h3 className="text-xs md:text-sm font-medium text-white/80 mb-1">{title}</h3>
            <div className="text-xl md:text-2xl font-bold mb-1">{value}</div>
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
        className={`bg-gradient-to-r ${colorClasses[color]} ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg transform hover:scale-105'} text-white font-semibold py-2 md:py-3 px-4 md:px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 text-sm md:text-base w-full`}
      >
        {icon}
        <span>{label}</span>
      </button>
    );
  };

  // Overview Dashboard Component
  const OverviewDashboard = () => {
    const criticalTimers = [...timers, ...globalTimers].filter(timer => timer.time <= 5);
    
    const criticalEffects = effects ? Object.entries(effects).filter(([key, value]) => {
      if (key === 'exhaustion' && parseInt(value) >= 3) return true;
      if (key === 'sanity' && parseInt(value) <= 19) return true;
      return false;
    }) : [];

    return (
      <div className="space-y-4 md:space-y-6">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-purple-900/50 to-indigo-900/50 backdrop-blur-lg rounded-2xl border border-white/10 p-4 md:p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Welcome back, <span className="text-purple-400">{localStorage.getItem('loggedIn')}</span>
              </h1>
              <p className="text-sm md:text-base text-gray-300">Here's your current status in the Backrooms</p>
              {userIsDM && (
                <p className="text-amber-400 text-sm mt-1">👑 You have DM privileges in this session</p>
              )}
            </div>
            <div className="hidden md:block">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center">
                <span className="text-2xl md:text-3xl">🎮</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <StatsCard
            title="Active Timers"
            value={timers.length}
            subtitle="Personal"
            color="blue"
            icon={
              <svg className="w-6 h-6 md:w-8 md:h-8" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"></path>
              </svg>
            }
          />
          <StatsCard
            title="Global Timers"
            value={globalTimers.length}
            subtitle="Shared"
            color="purple"
            icon={
              <svg className="w-6 h-6 md:w-8 md:h-8" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
              </svg>
            }
          />
          <StatsCard
            title="Resources"
            value={page.resources ? page.resources.length : 0}
            subtitle="Tracked"
            color="green"
            icon={
              <svg className="w-6 h-6 md:w-8 md:h-8" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path>
              </svg>
            }
          />
          <StatsCard
            title="Critical Issues"
            value={criticalEffects.length + criticalTimers.length}
            subtitle="Attention"
            color="red"
            icon={
              <svg className="w-6 h-6 md:w-8 md:h-8" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
              </svg>
            }
          />
        </div>

        {/* Critical Alerts */}
        {(criticalTimers.length > 0 || criticalEffects.length > 0) && (
          <div className="bg-red-900/30 backdrop-blur-lg rounded-2xl border border-red-500/30 p-4 md:p-6">
            <div className="flex items-center space-x-3 mb-4">
              <svg className="w-5 h-5 md:w-6 md:h-6 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
              </svg>
              <h2 className="text-lg md:text-xl font-bold text-red-400">Critical Alerts</h2>
            </div>
            
            <div className="space-y-2 md:space-y-3">
              {criticalTimers.map((timer) => (
                <div key={timer.name} className="bg-red-800/20 rounded-lg p-3 border border-red-500/20">
                  <div className="flex items-center justify-between text-sm md:text-base">
                    <span className="text-white font-medium">⏰ {timer.name}</span>
                    <span className="text-red-400 font-bold">{timer.time} remaining</span>
                  </div>
                </div>
              ))}
              
              {criticalEffects.map(([effect, value]) => (
                <div key={effect} className="bg-red-800/20 rounded-lg p-3 border border-red-500/20">
                  <div className="flex items-center justify-between text-sm md:text-base">
                    <span className="text-white font-medium">🩸 {effect.charAt(0).toUpperCase() + effect.slice(1)}</span>
                    <span className="text-red-400 font-bold">Level {value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Timers & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Personal Timers Preview */}
          <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-4 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg md:text-xl font-bold text-white">Personal Timers</h2>
              <button
                onClick={() => setActiveSection('timers')}
                className="text-blue-400 hover:text-blue-300 text-xs md:text-sm font-medium transition-colors"
              >
                View All →
              </button>
            </div>
            
            {timers.length === 0 ? (
              <div className="text-center py-6 md:py-8 text-gray-400">
                <svg className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-3 opacity-50" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"></path>
                </svg>
                <p className="text-sm md:text-base">No active timers</p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2 overflow-x-auto">
                {timers.slice(0, 4).map((timer) => (
                  <TimerCard key={timer.name} timer={timer} size="small" />
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-bold text-white mb-4">Quick Actions</h2>
            
            <div className="space-y-2 md:space-y-3">
              <QuickActionButton
                onClick={() => setActiveSection('timers')}
                icon={
                  <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"></path>
                  </svg>
                }
                label="Manage Timers"
                color="green"
              />
              
              <QuickActionButton
                onClick={() => setActiveSection('equipment')}
                icon={
                  <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                }
                label="Manage Equipment"
                color="purple"
              />
              
              <QuickActionButton
                onClick={() => setActiveSection('effects')}
                icon={
                  <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 20 20">
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

  const ResourcesManager = ({ page, sessionId }) => {
    const [localResources, setLocalResources] = useState([]);
    const [isInitialized, setIsInitialized] = useState(false);

    // Initialize local state when page data loads
    useEffect(() => {
      if (page.resources && !isInitialized) {
        // Don't filter out empty resources - we need them for new entries
        const resources = page.resources.length > 0 ? page.resources : [];
        setLocalResources(resources);
        setIsInitialized(true);
      }
    }, [page.resources, isInitialized]);

    // Sync when resources change from database (but only after initialization)
    useEffect(() => {
      if (page.resources && isInitialized && page.resources.length !== localResources.length) {
        setLocalResources(page.resources);
      }
    }, [page.resources]);

    const handleResourceChange = (index, field, value) => {
      const updatedResources = [...localResources];
      updatedResources[index] = {
        ...updatedResources[index],
        [field]: value
      };
      setLocalResources(updatedResources);
    };

    const saveResource = (index) => {
      if (!sessionId) return;

      setDoc(doc(db, 'Equipped', `${sessionId}_${localStorage.getItem('loggedIn').toUpperCase()}`), {
        playerName: localStorage.getItem('loggedIn'),
        sessionId: sessionId,
        gear: page.gear,
        jewelry: page.jewelry,
        resources: localResources,
        effects: page.effects
      }).catch(error => {
        console.error("Error updating resource:", error);
        showToast('Error updating resource', 'error');
      });
    };

    const addResource = () => {
      const newResource = { name: "", remaining: "", maximum: "" };
      const updatedResources = [...localResources, newResource];
      setLocalResources(updatedResources);

      // Save immediately
      setDoc(doc(db, 'Equipped', `${sessionId}_${localStorage.getItem('loggedIn').toUpperCase()}`), {
        playerName: localStorage.getItem('loggedIn'),
        sessionId: sessionId,
        gear: page.gear,
        jewelry: page.jewelry,
        resources: updatedResources,
        effects: page.effects
      }).then(() => {
        showToast('Resource slot added!', 'success');
      }).catch(error => {
        console.error("Error adding resource:", error);
        showToast('Error adding resource', 'error');
      });
    };

    const removeResource = (index) => {
      const updatedResources = localResources.filter((_, i) => i !== index);
      setLocalResources(updatedResources);

      // Save immediately
      setDoc(doc(db, 'Equipped', `${sessionId}_${localStorage.getItem('loggedIn').toUpperCase()}`), {
        playerName: localStorage.getItem('loggedIn'),
        sessionId: sessionId,
        gear: page.gear,
        jewelry: page.jewelry,
        resources: updatedResources,
        effects: page.effects
      }).then(() => {
        showToast('Resource removed!', 'success');
      }).catch(error => {
        console.error("Error removing resource:", error);
        showToast('Error removing resource', 'error');
      });
    };

    return (
      <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-4 md:p-6">
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <div className="flex items-center space-x-3">
            <svg className="w-5 h-5 md:w-6 md:h-6 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path>
            </svg>
            <h2 className="text-lg md:text-xl font-bold text-white">Resources</h2>
          </div>
          <button
            onClick={addResource}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-2 px-4 rounded-lg transition-all text-sm flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"></path>
            </svg>
            <span>Add Resource</span>
          </button>
        </div>

        {localResources.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path>
            </svg>
            <p className="text-sm">No resources tracked</p>
            <p className="text-xs text-gray-500 mt-1">Click "Add Resource" to start tracking</p>
          </div>
        ) : (
          <div className="space-y-3">
            {localResources.map((resource, index) => (
              <div key={index} className="bg-white/5 border border-white/10 rounded-lg p-3 md:p-4">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                  {/* Resource Name */}
                  <div className="md:col-span-5">
                    <label className="text-xs font-medium text-gray-300 mb-1 block">Resource Name</label>
                    <input
                      type="text"
                      placeholder="e.g., Health Potions"
                      value={resource.name || ''}
                      onChange={(e) => handleResourceChange(index, 'name', e.target.value)}
                      onBlur={() => saveResource(index)}
                      className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                    />
                  </div>

                  {/* Current Value */}
                  <div className="md:col-span-3">
                    <label className="text-xs font-medium text-gray-300 mb-1 block">Current</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={resource.remaining || ''}
                      onChange={(e) => handleResourceChange(index, 'remaining', e.target.value)}
                      onBlur={() => saveResource(index)}
                      className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                    />
                  </div>

                  {/* Maximum Value */}
                  <div className="md:col-span-3">
                    <label className="text-xs font-medium text-gray-300 mb-1 block">Maximum</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={resource.maximum || ''}
                      onChange={(e) => handleResourceChange(index, 'maximum', e.target.value)}
                      onBlur={() => saveResource(index)}
                      className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                    />
                  </div>

                  {/* Delete Button */}
                  <div className="md:col-span-1 flex justify-end">
                    <button
                      onClick={() => removeResource(index)}
                      className="bg-red-600/20 hover:bg-red-600/40 text-red-400 p-2 rounded-lg transition-all"
                      title="Remove resource"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"></path>
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Resource Bar */}
                {resource.remaining !== '' && resource.maximum !== '' && parseInt(resource.maximum) > 0 && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                      <span>{resource.remaining} / {resource.maximum}</span>
                      <span>{Math.round((parseInt(resource.remaining) / parseInt(resource.maximum)) * 100)}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-300 ${
                          (parseInt(resource.remaining) / parseInt(resource.maximum)) > 0.5 
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                            : (parseInt(resource.remaining) / parseInt(resource.maximum)) > 0.25
                            ? 'bg-gradient-to-r from-yellow-500 to-amber-500'
                            : 'bg-gradient-to-r from-red-500 to-orange-500'
                        }`}
                        style={{ 
                          width: `${Math.min(100, (parseInt(resource.remaining) / parseInt(resource.maximum)) * 100)}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Equipment Section Component
  const EquipmentSection = () => {
    // Add local state for inputs
    const [localGear, setLocalGear] = useState({head: "", chest: "", arms: "", legs: "", feet: ""});
    const [localJewelry, setLocalJewelry] = useState({earrings: "", choker: "", bracelet: "", leftRing: "", rightRing: ""});

    // Initialize local state when page data loads (only once)
    useEffect(() => {
      if (page.gear && Object.keys(localGear).every(key => localGear[key] === "")) {
        setLocalGear(page.gear);
      }
    }, [page.gear]);

    useEffect(() => {
      if (page.jewelry && Object.keys(localJewelry).every(key => localJewelry[key] === "")) {
        setLocalJewelry(page.jewelry);
      }
    }, [page.jewelry]);

    if(Object.keys(page).length === 0) {
      return (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 md:h-16 md:w-16 border-b-2 border-purple-400 mx-auto mb-4"></div>
            <h3 className="text-lg md:text-xl font-semibold text-white mb-2">Loading equipment data...</h3>
            <p className="text-sm md:text-base text-gray-400">Please wait</p>
          </div>
        </div>
      );
    }

    const handleGear = (event, piece) => {
      const value = event.target.value;
      setLocalGear(prev => ({...prev, [piece]: value}));
    };

    const handleJewelry = (event, piece) => {
      const value = event.target.value;
      setLocalJewelry(prev => ({...prev, [piece]: value}));
    };

    const saveGear = (piece) => {
      const gear = {...page.gear, [piece]: localGear[piece]};
      setDoc(doc(db, 'Equipped', `${sessionId}_${localStorage.getItem('loggedIn').toUpperCase()}`), {
        playerName: localStorage.getItem('loggedIn'),
        sessionId: sessionId,
        gear: gear,
        jewelry: page.jewelry,
        resources: page.resources,
        effects: page.effects
      }).catch(error => {
        console.error("Error updating gear:", error);
        showToast('Error updating equipment', 'error');
      });
    };

    const saveJewelry = (piece) => {
      const jewelry = {...page.jewelry, [piece]: localJewelry[piece]};
      setDoc(doc(db, 'Equipped', `${sessionId}_${localStorage.getItem('loggedIn').toUpperCase()}`), {
        playerName: localStorage.getItem('loggedIn'),
        sessionId: sessionId,
        gear: page.gear,
        jewelry: jewelry,
        resources: page.resources,
        effects: page.effects
      }).catch(error => {
        console.error("Error updating jewelry:", error);
        showToast('Error updating jewelry', 'error');
      });
    };

    return (
      <div className="space-y-4 md:space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-900/50 to-green-900/50 backdrop-blur-lg rounded-2xl border border-white/10 p-4 md:p-6">
          <div className="flex items-center space-x-3">
            <svg className="w-6 h-6 md:w-8 md:h-8 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
            </svg>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-white">Equipment & Gear</h1>
              <p className="text-sm md:text-base text-emerald-300">Manage your equipment for this session</p>
            </div>
          </div>
        </div>

        {/* Equipment Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
          {/* Armor & Protection */}
          <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-4 md:p-6">
            <div className="flex items-center space-x-3 mb-4 md:mb-6">
              <svg className="w-5 h-5 md:w-6 md:h-6 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
              </svg>
              <h2 className="text-lg md:text-xl font-bold text-white">Armor & Protection</h2>
            </div>

            <div className="space-y-3 md:space-y-4">
              {['head', 'chest', 'arms', 'legs', 'feet'].map((piece) => (
                <div key={piece} className="space-y-2">
                  <label className="text-xs md:text-sm font-medium text-gray-300 capitalize">{piece}</label>
                  <input
                    type="text"
                    placeholder={`${piece.charAt(0).toUpperCase() + piece.slice(1)} equipment...`}
                    value={localGear[piece] || ''}
                    onChange={(event) => handleGear(event, piece)}
                    onBlur={() => saveGear(piece)}
                    className="w-full bg-white/5 border border-white/20 rounded-lg px-3 md:px-4 py-2 md:py-3 text-sm md:text-base text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Jewelry & Accessories */}
          <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-4 md:p-6">
            <div className="flex items-center space-x-3 mb-4 md:mb-6">
              <svg className="w-5 h-5 md:w-6 md:h-6 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
              <h2 className="text-lg md:text-xl font-bold text-white">Jewelry & Accessories</h2>
            </div>
            
            <div className="space-y-3 md:space-y-4">
              {[
                { key: 'earrings', label: 'Earrings' },
                { key: 'choker', label: 'Choker' },
                { key: 'bracelet', label: 'Bracelet' },
                { key: 'leftRing', label: 'Left Ring' },
                { key: 'rightRing', label: 'Right Ring' }
              ].map(({ key, label }) => (
                <div key={key} className="space-y-2">
                  <label className="text-xs md:text-sm font-medium text-gray-300">{label}</label>
                  <input
                    type="text"
                    placeholder={`${label}...`}
                    value={localJewelry[key] || ''}
                    onChange={(event) => handleJewelry(event, key)}
                    onBlur={() => saveJewelry(key)}
                    className="w-full bg-white/5 border border-white/20 rounded-lg px-3 md:px-4 py-2 md:py-3 text-sm md:text-base text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Resources Section - Now using the ResourcesManager component */}
        <ResourcesManager page={page} sessionId={sessionId} />
      </div>
    );
  };

  // Timers Section Component
  const TimersSection = () => {
    // Local state for timer inputs
    const [localAddName, setLocalAddName] = useState("");
    const [localAddTime, setLocalAddTime] = useState("");
    const [localAddDescription, setLocalAddDescription] = useState("");
    const [localGlobalTimer, setLocalGlobalTimer] = useState({
      name: "",
      value: "",
      description: ""
    });
    const [localTick, setLocalTick] = useState("");

    // Edit/Delete state
    const [selectedTimer, setSelectedTimer] = useState("");
    const [editTimerName, setEditTimerName] = useState("");
    const [editTimerValue, setEditTimerValue] = useState("");
    const [editTimerDescription, setEditTimerDescription] = useState("");

    // Get available timers for edit/delete dropdown
    const getAvailableTimers = () => {
      const available = [...timers]; // All personal timers
      if (userIsDM) {
        available.push(...globalTimers); // DM can also edit global timers
      }
      return available;
    };

    const availableTimers = getAvailableTimers();

    // Handle timer selection for edit/delete
    const handleTimerSelect = (e) => {
      const timerName = e.target.value;
      setSelectedTimer(timerName);

      if (timerName === "") {
        setEditTimerName("");
        setEditTimerValue("");
        setEditTimerDescription("");
        return;
      }

      // Find the selected timer
      const timer = availableTimers.find(t => 
        t.name === timerName || t.name.split('://:')[0] === timerName
      );

      if (timer) {
        const displayName = timer.global ? timer.name.split('://:')[0] : timer.name;
        setEditTimerName(displayName);
        setEditTimerValue(timer.time.toString());
        setEditTimerDescription(timer.description || "");
      }
    };

    const updateTimer = () => {
      if (!sessionId) {
        showToast('No active session', 'error');
        return;
      }

      if (selectedTimer === "") {
        showToast('Please select a timer to edit', 'error');
        return;
      }

      if (parseInt(editTimerValue) <= 0) {
        showToast('Timer value must be greater than 0', 'error');
        return;
      }

      // Find the timer to determine if it's global
      const timer = availableTimers.find(t => 
        t.name === selectedTimer || t.name.split('://:')[0] === selectedTimer
      );

      if (!timer) {
        showToast('Timer not found', 'error');
        return;
      }

      const isGlobal = timer.global;
      const docId = isGlobal 
        ? `${sessionId}_${editTimerName}_GLOBAL`
        : `${sessionId}_${timer.name}_${timer.user.toUpperCase()}`;

      const timerName = isGlobal ? `${editTimerName}://:(Global)` : timer.name;

      setDoc(doc(db, 'Timers', docId), {
        name: timerName,
        time: parseInt(editTimerValue),
        user: timer.user,
        global: isGlobal,
        description: editTimerDescription,
        sessionId: sessionId
      }).then(() => {
        showToast('Timer updated successfully!');
      }).catch(error => {
        console.error("Error updating timer:", error);
        showToast('Error updating timer', 'error');
      });
    };

    const deleteTimer = () => {
      if (!sessionId) {
        showToast('No active session', 'error');
        return;
      }

      if (selectedTimer === "") {
        showToast('Please select a timer to delete', 'error');
        return;
      }

      // Find the timer to determine if it's global
      const timer = availableTimers.find(t => 
        t.name === selectedTimer || t.name.split('://:')[0] === selectedTimer
      );

      if (!timer) {
        showToast('Timer not found', 'error');
        return;
      }

      const isGlobal = timer.global;
      const cleanName = isGlobal ? timer.name.split('://:')[0] : timer.name;
      const docId = isGlobal 
        ? `${sessionId}_${cleanName}_GLOBAL`
        : `${sessionId}_${timer.name}_${timer.user.toUpperCase()}`;

      deleteDoc(doc(db, 'Timers', docId)).then(() => {
        setSelectedTimer("");
        setEditTimerName("");
        setEditTimerValue("");
        setEditTimerDescription("");
        showToast('Timer deleted successfully!');
      }).catch(error => {
        console.error("Error deleting timer:", error);
        showToast('Error deleting timer', 'error');
      });
    };

    return (
      <div className="space-y-4 md:space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900/50 to-cyan-900/50 backdrop-blur-lg rounded-2xl border border-white/10 p-4 md:p-6">
          <div className="flex items-center space-x-3">
            <svg className="w-6 h-6 md:w-8 md:h-8 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"></path>
            </svg>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-white">Timer Management</h1>
              <p className="text-sm md:text-base text-blue-300">Monitor and control your active timers</p>
            </div>
          </div>
        </div>

        {/* Timer Display Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6">
          {/* Personal Timers */}
          <div className="xl:col-span-2">
            <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 p-3 md:p-4 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 md:space-x-3">
                    <svg className="w-5 h-5 md:w-6 md:h-6 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"></path>
                    </svg>
                    <h2 className="text-lg md:text-xl font-bold text-white">Personal Timers</h2>
                  </div>
                  <span className="bg-blue-500/20 text-blue-300 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-bold">
                    {timers.length} active
                  </span>
                </div>
              </div>

              <div className="p-4 md:p-6 h-64 md:h-96 overflow-y-auto">
                {timers.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <svg className="w-12 h-12 md:w-16 md:h-16 text-gray-500 mb-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"></path>
                    </svg>
                    <h3 className="text-base md:text-lg font-semibold text-gray-400 mb-2">No Personal Timers</h3>
                    <p className="text-sm text-gray-500">Create your first timer to get started!</p>
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
              <div className="bg-gradient-to-r from-purple-600/20 to-indigo-600/20 p-3 md:p-4 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 md:space-x-3">
                    <svg className="w-5 h-5 md:w-6 md:h-6 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                    <h2 className="text-lg md:text-xl font-bold text-white">Global</h2>
                  </div>
                  <span className="bg-purple-500/20 text-purple-300 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-bold">
                    {globalTimers.length}
                  </span>
                </div>
              </div>
              
              <div className="p-3 md:p-4 h-64 md:h-96 overflow-y-auto">
                {globalTimers.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <svg className="w-10 h-10 md:w-12 md:h-12 text-gray-500 mb-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                    <h3 className="text-xs md:text-sm font-semibold text-gray-400 mb-1">No Global Timers</h3>
                    <p className="text-xs text-gray-500">No shared timers active</p>
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

        {/* Add Timer Section */}
        <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-bold text-white mb-4">Add New Timer</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
            <input
              type="text"
              placeholder="Timer Name"
              value={localAddName}
              onChange={(e) => setLocalAddName(e.target.value)}
              className="w-full bg-white/5 border border-white/20 rounded-lg px-3 md:px-4 py-2 md:py-3 text-sm md:text-base text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
            />
            <input
              type="number"
              placeholder="Timer Value"
              value={localAddTime}
              onChange={(e) => setLocalAddTime(e.target.value)}
              className="w-full bg-white/5 border border-white/20 rounded-lg px-3 md:px-4 py-2 md:py-3 text-sm md:text-base text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
            />
            <button
              onClick={() => {
                if (!sessionId) {
                  showToast('No active session', 'error');
                  return;
                }

                let ready = true;
                for(let i = 0; i < timers.length; i++) {
                  if(timers[i].name.toUpperCase() === localAddName.toUpperCase() && timers[i].user.toUpperCase() === localStorage.getItem('loggedIn').toUpperCase()) {
                    ready = false;
                  }
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
                  setDoc(doc(db, 'Timers', `${sessionId}_${localAddName}_${localStorage.getItem('loggedIn').toUpperCase()}`), {
                    name: localAddName,
                    time: parseInt(localAddTime),
                    user: localStorage.getItem('loggedIn'),
                    global: false,
                    description: localAddDescription,
                    sessionId: sessionId
                  }).then(() => {
                    setLocalAddName("");
                    setLocalAddTime("");
                    setLocalAddDescription("");
                    showToast('Timer created successfully!');
                  }).catch(error => {
                    console.error("Error adding timer:", error);
                    showToast('Error creating timer', 'error');
                  });
                } else {
                  showToast('That timer already exists', 'error');
                }
              }}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-2 md:py-3 rounded-lg transition-all text-sm md:text-base"
            >
              Create Timer
            </button>
          </div>
        </div>

        {/* Edit/Delete Timer Section */}
        {availableTimers.length > 0 && (
          <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-bold text-white mb-4">Edit or Delete Timer</h2>

            {/* Timer Selection Dropdown */}
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-300 mb-2 block">Select Timer</label>
              <select
                value={selectedTimer}
                onChange={handleTimerSelect}
                className="w-full bg-white/5 border border-white/20 rounded-lg px-3 md:px-4 py-2 md:py-3 text-sm md:text-base text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              >
                <option value="" className="bg-gray-800">-- Select a timer --</option>
                {availableTimers.map((timer) => {
                  const displayName = timer.global ? timer.name.split('://:')[0] : timer.name;
                  const label = timer.global ? `${displayName} (Global)` : displayName;
                  return (
                    <option key={timer.name} value={displayName} className="bg-gray-800">
                      {label} - {timer.time}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Edit Fields */}
            {selectedTimer && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-1 gap-3 md:gap-4 mb-4">
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">Timer Value</label>
                    <input
                      type="number"
                      placeholder="Timer Value"
                      value={editTimerValue}
                      onChange={(e) => setEditTimerValue(e.target.value)}
                      className="w-full bg-white/5 border border-white/20 rounded-lg px-3 md:px-4 py-2 md:py-3 text-sm md:text-base text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <button
                    onClick={updateTimer}
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-2 md:py-3 rounded-lg transition-all text-sm md:text-base flex items-center justify-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path>
                    </svg>
                    <span>Update Timer</span>
                  </button>
                  <button
                    onClick={deleteTimer}
                    className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-semibold py-2 md:py-3 rounded-lg transition-all text-sm md:text-base flex items-center justify-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"></path>
                    </svg>
                    <span>Delete Timer</span>
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* DM Controls */}
        {userIsDM && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            {/* Add Global Timer */}
            <div className="bg-gradient-to-br from-orange-900/30 to-yellow-900/30 backdrop-blur-lg rounded-2xl border border-orange-500/20 p-4 md:p-6">
              <div className="flex items-center space-x-2 md:space-x-3 mb-4">
                <h2 className="text-base md:text-lg font-bold text-white">Add Global Timer</h2>
                <span className="bg-orange-500/30 text-orange-300 px-2 py-1 rounded text-xs font-bold">DM</span>
              </div>

              <div className="space-y-3 md:space-y-4">
                <input
                  type="text"
                  placeholder="Global Timer Name"
                  value={localGlobalTimer.name}
                  onChange={(e) => setLocalGlobalTimer({...localGlobalTimer, name: e.target.value})}
                  className="w-full bg-white/5 border border-orange-500/20 rounded-lg px-3 md:px-4 py-2 md:py-3 text-sm md:text-base text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                />
                <input
                  type="number"
                  placeholder="Timer Value"
                  value={localGlobalTimer.value}
                  onChange={(e) => setLocalGlobalTimer({...localGlobalTimer, value: e.target.value})}
                  className="w-full bg-white/5 border border-orange-500/20 rounded-lg px-3 md:px-4 py-2 md:py-3 text-sm md:text-base text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                />
                <button
                  onClick={() => {
                    if (!sessionId) {
                      showToast('No active session', 'error');
                      return;
                    }

                    if (!userIsDM) {
                      showToast('Only the DM can create global timers', 'error');
                      return;
                    }

                    let ready = true;
                    for(let i = 0; i < globalTimers.length; i++) {
                      if(globalTimers[i].name.toUpperCase() === (localGlobalTimer.name + "://:(Global)").toUpperCase()) {
                        ready = false;
                      }
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
                      setDoc(doc(db, 'Timers', `${sessionId}_${localGlobalTimer.name}_GLOBAL`), {
                        name: localGlobalTimer.name + "://:(Global)",
                        time: parseInt(localGlobalTimer.value),
                        user: localStorage.getItem('loggedIn'),
                        global: true,
                        description: localGlobalTimer.description,
                        sessionId: sessionId
                      }).then(() => {
                        setLocalGlobalTimer({name: "", value: "", description: ""});
                        showToast('Global timer created successfully!');
                      }).catch(error => {
                        console.error("Error adding global timer:", error);
                        showToast('Error creating global timer', 'error');
                      });
                    } else {
                      showToast('That timer already exists', 'error');
                    }
                  }}
                  className="w-full bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-700 hover:to-yellow-700 text-white font-semibold py-2 md:py-3 rounded-lg transition-all text-sm md:text-base"
                >
                  Create Global Timer
                </button>
              </div>
            </div>

            {/* Advance All Timers */}
            <div className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 backdrop-blur-lg rounded-2xl border border-purple-500/20 p-4 md:p-6">
              <div className="flex items-center space-x-2 md:space-x-3 mb-4">
                <h2 className="text-base md:text-lg font-bold text-white">Advance All Timers</h2>
                <span className="bg-purple-500/30 text-purple-300 px-2 py-1 rounded text-xs font-bold">DM</span>
              </div>

              <div className="space-y-3 md:space-y-4">
                <input
                  type="number"
                  placeholder="Tick Value"
                  value={localTick}
                  onChange={(e) => setLocalTick(e.target.value)}
                  className="w-full bg-white/5 border border-purple-500/20 rounded-lg px-3 md:px-4 py-2 md:py-3 text-sm md:text-base text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                />
                <button
                  onClick={() => {
                    if (!sessionId) {
                      showToast('No active session', 'error');
                      return;
                    }

                    if (!userIsDM) {
                      showToast('Only the DM can advance timers', 'error');
                      return;
                    }

                    const tickValue = parseInt(localTick);
                    const expiredTimers = [];
                    setLastTickAmount(tickValue);

                    const updatePromises = allTimers.map((timer) => {
                      if(timer.time - tickValue <= 0) {
                        expiredTimers.push(timer.name.includes('://:') ? 
                          timer.name.split("://:")[0] + " (Global)" : 
                          timer.name
                        );

                        const isGlobal = timer.global;
                        const cleanName = isGlobal ? timer.name.split('://:')[0] : timer.name;
                        const docId = isGlobal 
                          ? `${sessionId}_${cleanName}_GLOBAL`
                          : `${sessionId}_${timer.name}_${timer.user.toUpperCase()}`;

                        return deleteDoc(doc(db, 'Timers', docId));
                      } else {
                        const isGlobal = timer.global;
                        const cleanName = isGlobal ? timer.name.split('://:')[0] : timer.name;
                        const docId = isGlobal 
                          ? `${sessionId}_${cleanName}_GLOBAL`
                          : `${sessionId}_${timer.name}_${timer.user.toUpperCase()}`;

                        return setDoc(doc(db, 'Timers', docId), {
                          name: timer.name,
                          time: (timer.time - tickValue),
                          user: timer.user,
                          global: timer.global,
                          description: timer.description,
                          sessionId: sessionId
                        });
                      }
                    });

                    Promise.all(updatePromises).then(() => {
                      if (expiredTimers.length > 0) {
                        expiredTimers.forEach((timerName, index) => {
                          setTimeout(() => {
                            showToast(`Timer "${timerName}" has expired!`, 'warning');
                          }, index * 500);
                        });
                      }

                      showToast(`Advanced all timers by ${tickValue} units!`);
                    }).catch(error => {
                      console.error("Error advancing timers:", error);
                      showToast('Error advancing timers', 'error');
                    });
                  }}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-2 md:py-3 rounded-lg transition-all text-sm md:text-base"
                >
                  Advance Time
                </button>
                {lastTickAmount > 0 && (
                  <button
                    onClick={reverseTime}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-2 md:py-3 rounded-lg transition-all text-sm md:text-base flex items-center justify-center space-x-2"
                  >
                    <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd"></path>
                    </svg>
                    <span className="text-xs md:text-base">Undo ({lastTickAmount})</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Effects Section
  const EffectsSection = () => {
    // Add local state for effects
    const [localEffects, setLocalEffects] = useState({
      exhaustion: '0', 
      sanity: '100', 
      encumbrance: '0',
      brawn: '0'
    });

    // Initialize local state when effects load (only once)
    useEffect(() => {
      if (effects && localEffects.sanity === '100' && localEffects.exhaustion === '0' && localEffects.encumbrance === '0') {
        setLocalEffects({
          exhaustion: effects.exhaustion || '0',
          sanity: effects.sanity || '100',
          encumbrance: effects.encumbrance || '0',
          brawn: effects.brawn || '0'
        });
      }
    }, [effects]);

    if (!effects) {
      return (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 md:h-16 md:w-16 border-b-2 border-purple-400 mx-auto mb-4"></div>
            <h3 className="text-lg md:text-xl font-semibold text-white mb-2">Loading effects...</h3>
          </div>
        </div>
      );
    }

    const handleEffectsChange = (event, effectType) => {
      const value = event.target.value;
      setLocalEffects(prev => ({...prev, [effectType]: value}));
    };

    const saveEffects = (effectType) => {
      if (!sessionId) return;

      const newEffects = {...effects, [effectType]: localEffects[effectType]};

      setDoc(doc(db, 'Equipped', `${sessionId}_${localStorage.getItem('loggedIn').toUpperCase()}`), {
        playerName: localStorage.getItem('loggedIn'),
        sessionId: sessionId,
        gear: page.gear,
        jewelry: page.jewelry,
        resources: page.resources,
        effects: newEffects
      }).catch(error => {
        console.error("Error saving effects:", error);
        showToast('Error saving effects', 'error');
      });
    };

    // Helper functions to get status information
    const getSanityEffects = () => {
      const sanity = parseInt(localEffects.sanity) || 0;
      if (sanity === 0) {
        return { severity: 'critical', effects: ['Incapacitated until Sanity restored'] };
      } else if (sanity >= 1 && sanity <= 19) {
        return { severity: 'critical', effects: ['4 Setback dice to all mental checks', 'Disoriented', 'Confused'] };
      } else if (sanity >= 20 && sanity <= 39) {
        return { severity: 'severe', effects: ['3 Setback dice to all mental checks', 'Disoriented'] };
      } else if (sanity >= 40 && sanity <= 59) {
        return { severity: 'moderate', effects: ['2 Setback dice to all mental checks'] };
      } else if (sanity >= 60 && sanity <= 79) {
        return { severity: 'mild', effects: ['1 Setback die to all mental checks'] };
      } else {
        return { severity: 'none', effects: ['No effects'] };
      }
    };

    const getExhaustionEffects = () => {
      const exhaustion = parseInt(localEffects.exhaustion) || 0;
      if (exhaustion >= 5) {
        return { severity: 'critical', effects: ['Incapacitated until Exhaustion reduced'] };
      } else if (exhaustion === 4) {
        return { severity: 'severe', effects: ['4 Setback dice to all Brawn and Agility checks'] };
      } else if (exhaustion === 3) {
        return { severity: 'moderate', effects: ['3 Setback dice to all Brawn and Agility checks'] };
      } else if (exhaustion === 2) {
        return { severity: 'moderate', effects: ['2 Setback dice to all Brawn and Agility checks'] };
      } else if (exhaustion === 1) {
        return { severity: 'mild', effects: ['1 Setback die to all Brawn and Agility checks'] };
      } else {
        return { severity: 'none', effects: ['No effects'] };
      }
    };

    const getEncumbranceEffects = () => {
      const encumbrance = parseInt(localEffects.encumbrance) || 0;
      const brawn = parseInt(localEffects.brawn) || 0;
      const limit = brawn + 5;
      const overLimit = encumbrance - limit;

      if (overLimit <= 0) {
        return { 
          severity: 'none', 
          effects: ['No effects'],
          limit: limit,
          overLimit: 0
        };
      }

      const effects = [];
      let severity = 'mild';

      // Add setback dice
      effects.push(`${overLimit} Setback ${overLimit === 1 ? 'die' : 'dice'} to all Brawn and Agility checks`);

      // Check for maneuver cost increase
      if (overLimit >= brawn && overLimit < brawn + 2) {
        effects.push('Maneuvers cost 2 strain to perform');
        severity = 'moderate';
      }

      // Check for maneuver limit
      if (overLimit >= brawn + 2) {
        effects.push('Maneuvers cost 2 strain to perform');
        effects.push('Maximum 1 maneuver per turn');
        severity = 'severe';
      }

      return { 
        severity, 
        effects,
        limit: limit,
        overLimit: overLimit
      };
    };

    const sanityStatus = getSanityEffects();
    const exhaustionStatus = getExhaustionEffects();
    const encumbranceStatus = getEncumbranceEffects();

    const getSeverityColor = (severity) => {
      switch(severity) {
        case 'critical': return 'from-red-900/50 to-red-800/50 border-red-500/50';
        case 'severe': return 'from-orange-900/50 to-red-900/50 border-orange-500/50';
        case 'moderate': return 'from-yellow-900/50 to-orange-900/50 border-yellow-500/50';
        case 'mild': return 'from-blue-900/50 to-cyan-900/50 border-blue-500/50';
        default: return 'from-green-900/50 to-emerald-900/50 border-green-500/50';
      }
    };

    const getSeverityIcon = (severity) => {
      switch(severity) {
        case 'critical':
          return (
            <svg className="w-6 h-6 text-red-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
            </svg>
          );
        case 'severe':
        case 'moderate':
          return (
            <svg className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
            </svg>
          );
        case 'mild':
          return (
            <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
            </svg>
          );
        default:
          return (
            <svg className="w-6 h-6 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
            </svg>
          );
      }
    };

    return (
      <div className="space-y-4 md:space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 backdrop-blur-lg rounded-2xl border border-white/10 p-4 md:p-6">
          <h1 className="text-xl md:text-2xl font-bold text-white mb-2">Status Effects</h1>
          <p className="text-sm md:text-base text-purple-300">Monitor your character's condition</p>
        </div>

        {/* Input Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Sanity Input */}
          <div className="bg-black/20 backdrop-blur-lg rounded-xl border border-white/10 p-4">
            <h3 className="text-base font-bold text-white mb-2">Sanity</h3>
            <input
              type="number"
              value={localEffects.sanity || ''}
              onChange={(e) => handleEffectsChange(e, 'sanity')}
              onBlur={() => saveEffects('sanity')}
              min="0"
              max="100"
              className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
            />
          </div>

          {/* Exhaustion Input */}
          <div className="bg-black/20 backdrop-blur-lg rounded-xl border border-white/10 p-4">
            <h3 className="text-base font-bold text-white mb-2">Exhaustion</h3>
            <input
              type="number"
              value={localEffects.exhaustion || ''}
              onChange={(e) => handleEffectsChange(e, 'exhaustion')}
              onBlur={() => saveEffects('exhaustion')}
              min="0"
              className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
            />
          </div>

          {/* Brawn Input */}
          <div className="bg-black/20 backdrop-blur-lg rounded-xl border border-white/10 p-4">
            <h3 className="text-base font-bold text-white mb-2">Brawn</h3>
            <input
              type="number"
              value={localEffects.brawn || ''}
              onChange={(e) => handleEffectsChange(e, 'brawn')}
              onBlur={() => saveEffects('brawn')}
              min="0"
              className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
            />
          </div>

          {/* Encumbrance Input */}
          <div className="bg-black/20 backdrop-blur-lg rounded-xl border border-white/10 p-4">
            <h3 className="text-base font-bold text-white mb-2">Encumbrance</h3>
            <input
              type="number"
              value={localEffects.encumbrance || ''}
              onChange={(e) => handleEffectsChange(e, 'encumbrance')}
              onBlur={() => saveEffects('encumbrance')}
              min="0"
              className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
            />
            <p className="text-xs text-gray-400 mt-2">
              Limit: {encumbranceStatus.limit} {encumbranceStatus.overLimit > 0 && (
                <span className="text-yellow-400">(+{encumbranceStatus.overLimit} over)</span>
              )}
            </p>
          </div>
        </div>

        {/* Status Display Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Sanity Status */}
          <div className={`bg-gradient-to-br ${getSeverityColor(sanityStatus.severity)} backdrop-blur-lg rounded-2xl border p-4 md:p-6`}>
            <div className="flex items-center space-x-3 mb-4">
              {getSeverityIcon(sanityStatus.severity)}
              <div>
                <h3 className="text-lg font-bold text-white">Sanity Effects</h3>
                <p className="text-sm text-gray-300">Current: {localEffects.sanity}/100</p>
              </div>
            </div>
            
            <div className="space-y-2">
              {sanityStatus.effects.map((effect, index) => (
                <div key={index} className="bg-black/20 rounded-lg p-2 text-sm text-white">
                  • {effect}
                </div>
              ))}
            </div>
          </div>

          {/* Exhaustion Status */}
          <div className={`bg-gradient-to-br ${getSeverityColor(exhaustionStatus.severity)} backdrop-blur-lg rounded-2xl border p-4 md:p-6`}>
            <div className="flex items-center space-x-3 mb-4">
              {getSeverityIcon(exhaustionStatus.severity)}
              <div>
                <h3 className="text-lg font-bold text-white">Exhaustion Effects</h3>
                <p className="text-sm text-gray-300">Level: {localEffects.exhaustion}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              {exhaustionStatus.effects.map((effect, index) => (
                <div key={index} className="bg-black/20 rounded-lg p-2 text-sm text-white">
                  • {effect}
                </div>
              ))}
            </div>
          </div>

          {/* Encumbrance Status */}
          <div className={`bg-gradient-to-br ${getSeverityColor(encumbranceStatus.severity)} backdrop-blur-lg rounded-2xl border p-4 md:p-6`}>
            <div className="flex items-center space-x-3 mb-4">
              {getSeverityIcon(encumbranceStatus.severity)}
              <div>
                <h3 className="text-lg font-bold text-white">Encumbrance Effects</h3>
                <p className="text-sm text-gray-300">
                  {localEffects.encumbrance}/{encumbranceStatus.limit}
                </p>
              </div>
            </div>
            
            <div className="space-y-2">
              {encumbranceStatus.effects.map((effect, index) => (
                <div key={index} className="bg-black/20 rounded-lg p-2 text-sm text-white">
                  • {effect}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Reference Guide */}
        <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-4 md:p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
            <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
            </svg>
            <span>Quick Reference</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            {/* Sanity Reference */}
            <div className="bg-white/5 rounded-lg p-3">
              <h4 className="font-bold text-purple-300 mb-2">Sanity Thresholds</h4>
              <ul className="space-y-1 text-gray-300 text-xs">
                <li>• 80-100: No effect</li>
                <li>• 60-79: 1 Setback (mental)</li>
                <li>• 40-59: 2 Setback (mental)</li>
                <li>• 20-39: 3 Setback + Disoriented</li>
                <li>• 1-19: 4 Setback + Confused</li>
                <li>• 0: Incapacitated</li>
              </ul>
            </div>

            {/* Exhaustion Reference */}
            <div className="bg-white/5 rounded-lg p-3">
              <h4 className="font-bold text-amber-300 mb-2">Exhaustion Levels</h4>
              <ul className="space-y-1 text-gray-300 text-xs">
                <li>• Level 1: 1 Setback (physical)</li>
                <li>• Level 2: 2 Setback (physical)</li>
                <li>• Level 3: 3 Setback (physical)</li>
                <li>• Level 4: 4 Setback (physical)</li>
                <li>• Level 5+: Incapacitated</li>
              </ul>
            </div>

            {/* Encumbrance Reference */}
            <div className="bg-white/5 rounded-lg p-3">
              <h4 className="font-bold text-green-300 mb-2">Encumbrance Rules</h4>
              <ul className="space-y-1 text-gray-300 text-xs">
                <li>• Limit: Brawn + 5</li>
                <li>• Each over: +1 Setback (physical)</li>
                <li>• At Limit + Brawn: 2 strain/maneuver</li>
                <li>• At Limit + Brawn + 2: Max 1 maneuver</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Diseases Section
  const DiseasesSection = () => {
    const [localDiseases, setLocalDiseases] = useState({
      entityNineteen: '0',
      wretchedCycle: '0',
      sanguineFestivus: '0',
      hydrolitis: '0',
      hydrolitisPulmonary: false,
      hydrolotisSepticemic: false,
      mandela: '0'
    });
  
    // Initialize local state when effects load
    useEffect(() => {
      if (effects && effects.disease !== undefined) {
        // Parse the disease string or object from effects
        const diseaseData = typeof effects.disease === 'string' ? JSON.parse(effects.disease || '{}') : effects.disease;
        setLocalDiseases({
          entityNineteen: diseaseData.entityNineteen || '0',
          wretchedCycle: diseaseData.wretchedCycle || '0',
          sanguineFestivus: diseaseData.sanguineFestivus || '0',
          hydrolitis: diseaseData.hydrolitis || '0',
          hydrolitisPulmonary: diseaseData.hydrolitisPulmonary || false,
          hydrolotisSepticemic: diseaseData.hydrolotisSepticemic || false,
          mandela: diseaseData.mandela || '0'
        });
      }
    }, [effects]);
  
    if (!effects) {
      return (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 md:h-16 md:w-16 border-b-2 border-purple-400 mx-auto mb-4"></div>
            <h3 className="text-lg md:text-xl font-semibold text-white mb-2">Loading diseases...</h3>
          </div>
        </div>
      );
    };
  
    const handleDiseaseChange = (disease, value) => {
      setLocalDiseases(prev => ({...prev, [disease]: value}));
    };
  
    const saveDiseases = () => {
      if (!sessionId) return;
    
      const newEffects = {...effects, disease: JSON.stringify(localDiseases)};
      
      setDoc(doc(db, 'Equipped', `${sessionId}_${localStorage.getItem('loggedIn').toUpperCase()}`), {
        playerName: localStorage.getItem('loggedIn'),
        sessionId: sessionId,
        gear: page.gear,
        jewelry: page.jewelry,
        resources: page.resources,
        effects: newEffects
      }).catch(error => {
        console.error("Error saving diseases:", error);
        showToast('Error saving diseases', 'error');
      });
    };
  
    // Helper functions to get disease status
    const getEntityNineteenStatus = () => {
      const stage = parseInt(localDiseases.entityNineteen) || 0;
      if (stage === 0) return { severity: 'none', stage: 0, effects: ['No infection'] };
      if (stage === 1) return { severity: 'moderate', stage: 1, effects: ['Sickened', 'Sanity loss doubled'] };
      if (stage === 2) return { severity: 'severe', stage: 2, effects: ['Disoriented', '1 strain per hour'] };
      if (stage >= 3) return { severity: 'critical', stage: 3, effects: ['Incapacitated', 'Death in 24 hours'] };
    };
  
    const getWretchedCycleStatus = () => {
      const stage = parseInt(localDiseases.wretchedCycle) || 0;
      if (stage === 0) return { severity: 'none', stage: 0, effects: ['No infection'] };
      if (stage === 1) return { severity: 'moderate', stage: 1, effects: ['Confused (1 round/day)', '+1 Setback to social'] };
      if (stage === 2) return { severity: 'severe', stage: 2, effects: ['Frightened (of reflection)', '1 wound/week', 'Healing halved'] };
      if (stage >= 3) return { severity: 'critical', stage: 3, effects: ['Stunned 3', 'Blinded', 'Becomes NPC if not cured'] };
    };
  
    const getSanguineFestivusStatus = () => {
      const stage = parseInt(localDiseases.sanguineFestivus) || 0;
      if (stage === 0) return { severity: 'none', stage: 0, effects: ['No infection'] };
      if (stage === 1) return { severity: 'mild', stage: 1, effects: ['Maneuvers cost +1 strain'] };
      if (stage === 2) return { severity: 'moderate', stage: 2, effects: ['All strain +2', 'Sickened'] };
      if (stage >= 3) return { severity: 'severe', stage: 3, effects: ['Confused', 'Frightened (of non-infected)'] };
    };
  
    const getHydrolitisStatus = () => {
      const stage = parseInt(localDiseases.hydrolitis) || 0;
      const isPulmonary = localDiseases.hydrolitisPulmonary;
      const isSepticemic = localDiseases.hydrolotisSepticemic;
      
      if (stage === 0) return { severity: 'none', stage: 0, type: 'None', effects: ['No infection'] };
      
      if (isPulmonary) {
        if (stage === 1) return { severity: 'moderate', stage: 1, type: 'Pulmonary', effects: ['Strain costs doubled', '+2 Setback to Athletics/Coordination'] };
        if (stage >= 2) return { severity: 'severe', stage: 2, type: 'Pulmonary', effects: ['Stunned 2', '1 wound per day'] };
      }
      
      if (isSepticemic) {
        if (stage === 1) return { severity: 'severe', stage: 1, type: 'Septicemic', effects: ['Exhaustion in half time', 'Disoriented'] };
        if (stage >= 2) return { severity: 'critical', stage: 2, type: 'Septicemic', effects: ['Incapacitated', '2 wounds per hour'] };
      }
      
      return { severity: 'none', stage: 0, type: 'Unknown', effects: ['Select type'] };
    };
  
    const getMandelaStatus = () => {
      const stage = parseInt(localDiseases.mandela) || 0;
      if (stage === 0) return { severity: 'none', stage: 0, effects: ['No infection'] };
      if (stage === 1) return { severity: 'mild', stage: 1, effects: ['Cannot benefit from rest'] };
      if (stage === 2) return { severity: 'moderate', stage: 2, effects: ['+2 Setback to mental checks'] };
      if (stage === 3) return { severity: 'moderate', stage: 3, effects: ['Poisoned', '1 strain per hour'] };
      if (stage === 4) return { severity: 'severe', stage: 4, effects: ['Stunned 4', 'Cannot eat/drink', '1 wound per hour'] };
      if (stage >= 5) return { severity: 'critical', stage: 5, effects: ['Incapacitated', '2 wounds per hour', 'Death in 6 hours'] };
    };
  
    const entityNineteenStatus = getEntityNineteenStatus();
    const wretchedCycleStatus = getWretchedCycleStatus();
    const sanguineFestivusStatus = getSanguineFestivusStatus();
    const hydrolitiStatus = getHydrolitisStatus();
    const mandelaStatus = getMandelaStatus();
  
    const getSeverityColor = (severity) => {
      switch(severity) {
        case 'critical': return 'from-red-900/50 to-red-800/50 border-red-500/50';
        case 'severe': return 'from-orange-900/50 to-red-900/50 border-orange-500/50';
        case 'moderate': return 'from-yellow-900/50 to-orange-900/50 border-yellow-500/50';
        case 'mild': return 'from-blue-900/50 to-cyan-900/50 border-blue-500/50';
        default: return 'from-green-900/50 to-emerald-900/50 border-green-500/50';
      }
    };
  
    const getSeverityIcon = (severity) => {
      switch(severity) {
        case 'critical':
          return <span className="text-2xl">💀</span>;
        case 'severe':
          return <span className="text-2xl">🦠</span>;
        case 'moderate':
          return <span className="text-2xl">🤒</span>;
        case 'mild':
          return <span className="text-2xl">🤧</span>;
        default:
          return <span className="text-2xl">✅</span>;
      }
    };
  
    return (
      <div className="space-y-4 md:space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-lime-900/50 to-green-900/50 backdrop-blur-lg rounded-2xl border border-white/10 p-4 md:p-6">
          <h1 className="text-xl md:text-2xl font-bold text-white mb-2">Disease Tracker</h1>
          <p className="text-sm md:text-base text-lime-300">Monitor active diseases and their progression</p>
        </div>
    
        {/* Disease Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Entity 19 - "The Disease" */}
          <div className={`bg-gradient-to-br ${getSeverityColor(entityNineteenStatus.severity)} backdrop-blur-lg rounded-2xl border p-4 md:p-6`}>
            <div className="flex items-center justify-between mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                {getSeverityIcon(entityNineteenStatus.severity)}
                <div>
                  <h3 className="text-lg font-bold text-white">Entity 19</h3>
                  <p className="text-sm text-gray-300">"The Disease"</p>
                </div>
              </div>
              <select
                value={localDiseases.entityNineteen}
                onChange={(e) => handleDiseaseChange('entityNineteen', e.target.value)}
                onBlur={saveDiseases}
                className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-lime-500"
              >
                <option value="0" className="bg-gray-800">Stage 0 - Healthy</option>
                <option value="1" className="bg-gray-800">Stage 1 - Early (5-24h)</option>
                <option value="2" className="bg-gray-800">Stage 2 - Moderate (24-72h)</option>
                <option value="3" className="bg-gray-800">Stage 3 - Critical (72h+)</option>
              </select>
            </div>
            
            <div className="space-y-2">
              {entityNineteenStatus.effects.map((effect, index) => (
                <div key={index} className="bg-black/20 rounded-lg p-2 text-sm text-white">
                  • {effect}
                </div>
              ))}
            </div>
            
            {entityNineteenStatus.stage > 0 && (
              <div className="mt-4 p-3 bg-black/30 rounded-lg border border-white/10">
                <p className="text-xs text-gray-300"><strong>Source:</strong> Moist environments, rotten wallpaper, stagnant water</p>
              </div>
            )}
          </div>
          
          {/* The Wretched Cycle */}
          <div className={`bg-gradient-to-br ${getSeverityColor(wretchedCycleStatus.severity)} backdrop-blur-lg rounded-2xl border p-4 md:p-6`}>
            <div className="flex items-center justify-between mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                {getSeverityIcon(wretchedCycleStatus.severity)}
                <div>
                  <h3 className="text-lg font-bold text-white">Wretched Cycle</h3>
                  <p className="text-sm text-gray-300">Neglect Disease</p>
                </div>
              </div>
              <select
                value={localDiseases.wretchedCycle}
                onChange={(e) => handleDiseaseChange('wretchedCycle', e.target.value)}
                onBlur={saveDiseases}
                className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="0" className="bg-gray-800">Stage 0 - Healthy</option>
                <option value="1" className="bg-gray-800">Stage 1 - Early (1-2 weeks)</option>
                <option value="2" className="bg-gray-800">Stage 2 - Moderate (2-5 weeks)</option>
                <option value="3" className="bg-gray-800">Stage 3 - Critical (5-6 weeks)</option>
              </select>
            </div>
            
            <div className="space-y-2">
              {wretchedCycleStatus.effects.map((effect, index) => (
                <div key={index} className="bg-black/20 rounded-lg p-2 text-sm text-white">
                  • {effect}
                </div>
              ))}
            </div>
            
            {wretchedCycleStatus.stage > 0 && (
              <div className="mt-4 p-3 bg-black/30 rounded-lg border border-white/10">
                <p className="text-xs text-gray-300"><strong>Source:</strong> 1 week without food, water, or sleep (halved if alone)</p>
              </div>
            )}
          </div>
          
          {/* Sanguine Festivus Virus */}
          <div className={`bg-gradient-to-br ${getSeverityColor(sanguineFestivusStatus.severity)} backdrop-blur-lg rounded-2xl border p-4 md:p-6`}>
            <div className="flex items-center justify-between mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                {getSeverityIcon(sanguineFestivusStatus.severity)}
                <div>
                  <h3 className="text-lg font-bold text-white">SFV</h3>
                  <p className="text-sm text-gray-300">Sanguine Festivus Virus</p>
                </div>
              </div>
              <select
                value={localDiseases.sanguineFestivus}
                onChange={(e) => handleDiseaseChange('sanguineFestivus', e.target.value)}
                onBlur={saveDiseases}
                className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <option value="0" className="bg-gray-800">Stage 0 - Healthy</option>
                <option value="1" className="bg-gray-800">Stage 1 - Early (2-6h)</option>
                <option value="2" className="bg-gray-800">Stage 2 - Moderate (6h-3d)</option>
                <option value="3" className="bg-gray-800">Stage 3 - Severe (3d+)</option>
              </select>
            </div>
            
            <div className="space-y-2">
              {sanguineFestivusStatus.effects.map((effect, index) => (
                <div key={index} className="bg-black/20 rounded-lg p-2 text-sm text-white">
                  • {effect}
                </div>
              ))}
            </div>
            
            {sanguineFestivusStatus.stage > 0 && (
              <div className="mt-4 p-3 bg-black/30 rounded-lg border border-white/10">
                <p className="text-xs text-gray-300"><strong>Source:</strong> Level Fun exposure, Partygoer contact</p>
                <p className="text-xs text-pink-300 mt-1">⚠️ Highly contagious</p>
              </div>
            )}
          </div>
          
          {/* Hydrolitis Plague */}
          <div className={`bg-gradient-to-br ${getSeverityColor(hydrolitiStatus.severity)} backdrop-blur-lg rounded-2xl border p-4 md:p-6`}>
            <div className="flex items-center justify-between mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                {getSeverityIcon(hydrolitiStatus.severity)}
                <div>
                  <h3 className="text-lg font-bold text-white">Hydrolitis</h3>
                  <p className="text-sm text-gray-300">{hydrolitiStatus.type}</p>
                </div>
              </div>
              <select
                value={localDiseases.hydrolitis}
                onChange={(e) => handleDiseaseChange('hydrolitis', e.target.value)}
                onBlur={saveDiseases}
                className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="0" className="bg-gray-800">Stage 0 - Healthy</option>
                <option value="1" className="bg-gray-800">Stage 1 - Early</option>
                <option value="2" className="bg-gray-800">Stage 2 - Critical</option>
              </select>
            </div>
          
            {parseInt(localDiseases.hydrolitis) > 0 && (
              <div className="mb-4 space-y-2">
                <p className="text-sm text-white font-semibold">Type:</p>
                <div className="flex gap-2">
                  <label className="flex items-center space-x-2 bg-black/20 px-3 py-2 rounded-lg cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localDiseases.hydrolitisPulmonary}
                      onChange={(e) => {
                        handleDiseaseChange('hydrolitisPulmonary', e.target.checked);
                        if (e.target.checked) handleDiseaseChange('hydrolotisSepticemic', false);
                        saveDiseases();
                      }}
                      className="form-checkbox text-blue-500"
                    />
                    <span className="text-sm text-white">Pulmonary</span>
                  </label>
                  <label className="flex items-center space-x-2 bg-black/20 px-3 py-2 rounded-lg cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localDiseases.hydrolotisSepticemic}
                      onChange={(e) => {
                        handleDiseaseChange('hydrolotisSepticemic', e.target.checked);
                        if (e.target.checked) handleDiseaseChange('hydrolitisPulmonary', false);
                        saveDiseases();
                      }}
                      className="form-checkbox text-red-500"
                    />
                    <span className="text-sm text-white">Septicemic</span>
                  </label>
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              {hydrolitiStatus.effects.map((effect, index) => (
                <div key={index} className="bg-black/20 rounded-lg p-2 text-sm text-white">
                  • {effect}
                </div>
              ))}
            </div>
            
            {hydrolitiStatus.stage > 0 && (
              <div className="mt-4 p-3 bg-black/30 rounded-lg border border-white/10">
                <p className="text-xs text-gray-300"><strong>Source:</strong> Contaminated water contact</p>
                <p className="text-xs text-cyan-300 mt-1">Pulmonary: Inhaled vapor | Septicemic: Skin contact</p>
              </div>
            )}
          </div>
          
          {/* Mandela Virus */}
          <div className={`bg-gradient-to-br ${getSeverityColor(mandelaStatus.severity)} backdrop-blur-lg rounded-2xl border p-4 md:p-6 lg:col-span-2`}>
            <div className="flex items-center justify-between mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                {getSeverityIcon(mandelaStatus.severity)}
                <div>
                  <h3 className="text-lg font-bold text-white">Mandela Virus (PV-A)</h3>
                  <p className="text-sm text-gray-300">Rapid Progression Disease</p>
                </div>
              </div>
              <select
                value={localDiseases.mandela}
                onChange={(e) => handleDiseaseChange('mandela', e.target.value)}
                onBlur={saveDiseases}
                className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="0" className="bg-gray-800">Stage 0 - Healthy</option>
                <option value="1" className="bg-gray-800">Stage 1 (20-60min)</option>
                <option value="2" className="bg-gray-800">Stage 2 (1-3h)</option>
                <option value="3" className="bg-gray-800">Stage 3 (3-5h)</option>
                <option value="4" className="bg-gray-800">Stage 4 (5-7h)</option>
                <option value="5" className="bg-gray-800">Stage 5 - Fatal (7-17h)</option>
              </select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {mandelaStatus.effects.map((effect, index) => (
                <div key={index} className="bg-black/20 rounded-lg p-2 text-sm text-white">
                  • {effect}
                </div>
              ))}
            </div>
            
            {mandelaStatus.stage > 0 && (
              <div className="mt-4 p-3 bg-black/30 rounded-lg border border-white/10">
                <p className="text-xs text-gray-300"><strong>Source:</strong> Skin contact with infected substances/liquids</p>
                <p className="text-xs text-red-300 mt-1">⚠️ Highly contagious • Extremely rapid progression</p>
              </div>
            )}
          </div>
        </div>
          
        {/* Disease Information Reference */}
        <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-4 md:p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
            <svg className="w-5 h-5 text-lime-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
            </svg>
            <span>Disease Mechanics</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <div className="bg-white/5 rounded-lg p-3">
              <h4 className="font-bold text-lime-300 mb-2">Progression</h4>
              <p className="text-gray-300 text-xs">Diseases advance through stages automatically unless treated or cured</p>
            </div>
          
            <div className="bg-white/5 rounded-lg p-3">
              <h4 className="font-bold text-lime-300 mb-2">Status Effects</h4>
              <p className="text-gray-300 text-xs">Diseases apply existing status effects from the Status Effects tab</p>
            </div>
          
            <div className="bg-white/5 rounded-lg p-3">
              <h4 className="font-bold text-lime-300 mb-2">Multiple Diseases</h4>
              <p className="text-gray-300 text-xs">Characters can suffer from multiple diseases simultaneously - effects stack</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Main render
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 flex flex-col lg:flex-row">
      {/* Sidebar */}
      <Sidebar 
        activeSection={activeSection} 
        setActiveSection={setActiveSection} 
        timers={timers} 
        globalTimers={globalTimers}
        userIsDM={userIsDM}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Top Bar */}
        <div className="lg:hidden bg-black/20 backdrop-blur-xl border-b border-white/10 px-4 py-3 flex items-center justify-between">
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="text-white p-2"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path>
            </svg>
          </button>
          <h2 className="text-white font-bold">
            {activeSection === 'overview' && 'Dashboard'}
            {activeSection === 'equipment' && 'Equipment'}
            {activeSection === 'timers' && 'Timers'}
            {activeSection === 'effects' && 'Status Effects'}
            {activeSection === 'diseases' && 'Diseases'}
          </h2>
          <div className="w-6"></div>
        </div>

        {/* Desktop Top Status Bar */}
        <div className="hidden lg:block bg-black/10 backdrop-blur-sm border-b border-white/10 px-6 py-3">
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
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="w-full max-w-7xl mx-auto">
            {activeSection === 'overview' && <OverviewDashboard />}
            {activeSection === 'equipment' && <EquipmentSection />}
            {activeSection === 'timers' && <TimersSection />}
            {activeSection === 'effects' && <EffectsSection />}
            {activeSection === 'diseases' && <DiseasesSection />}
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
}