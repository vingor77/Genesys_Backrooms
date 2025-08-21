import { collection, doc, onSnapshot, query, setDoc } from "firebase/firestore";
import db from '../Components/firebase';
import { useState, useEffect } from "react";
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

export default function SetBonuses() {
  const [bonuses, setBonuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  const showToast = (message, severity = 'success') => {
    setToast({ open: true, message, severity });
  };

  const hideToast = () => {
    setToast({ ...toast, open: false });
  };

  const getFromDB = () => {
    const q = query(collection(db, 'setBonuses'));
    const unsub = onSnapshot(q, (querySnapshot) => {
      const queryData = [];
      querySnapshot.forEach((doc) => {
        queryData.push(doc.data());
      });
      setBonuses(queryData);
      setLoading(false);
    });
    return () => { unsub(); };
  };

  // Get set theme color based on name
  const getSetTheme = (setName) => {
    const themes = {
      'Red Knight': { 
        gradient: 'from-red-600 to-red-800',
        icon: '⚔️',
        category: 'Combat',
        textColor: 'text-red-300'
      },
      'Holy': { 
        gradient: 'from-yellow-600 to-amber-700',
        icon: '✨',
        category: 'Divine',
        textColor: 'text-yellow-300'
      },
      'Steampunk': { 
        gradient: 'from-indigo-600 to-purple-700',
        icon: '⚙️',
        category: 'Mechanical',
        textColor: 'text-indigo-300'
      },
      'Shadows': { 
        gradient: 'from-gray-600 to-gray-800',
        icon: '🌙',
        category: 'Stealth',
        textColor: 'text-gray-300'
      },
      'Healer': { 
        gradient: 'from-emerald-600 to-green-700',
        icon: '💚',
        category: 'Support',
        textColor: 'text-emerald-300'
      },
      'Weather': { 
        gradient: 'from-blue-600 to-cyan-700',
        icon: '🌤️',
        category: 'Elemental',
        textColor: 'text-blue-300'
      },
      'Flight': { 
        gradient: 'from-purple-600 to-violet-700',
        icon: '🪶',
        category: 'Movement',
        textColor: 'text-purple-300'
      },
      'Glitched': {
        gradient: 'from-pink-600 to-fuchsia-700',
        icon: '⚡',
        category: 'Anomalous',
        textColor: 'text-pink-300'
      },
      'Golden': {
        gradient: 'from-amber-500 to-yellow-600',
        icon: '👑',
        category: 'Legendary',
        textColor: 'text-amber-300'
      }
    };

    for (const [key, theme] of Object.entries(themes)) {
      if (setName.includes(key)) {
        return theme;
      }
    }
    
    return { 
      gradient: 'from-indigo-600 to-purple-700',
      icon: '🛡️',
      category: 'Equipment',
      textColor: 'text-indigo-300'
    };
  };

  const SetCard = ({ setData }) => {
    const theme = getSetTheme(setData.name);
    const equipment = setData.equipment.split('/');
    const effects = setData.effect.split('/');
    const completionNumbers = setData.completionNumber.split('/');
    const maxItems = equipment.length;

    return (
      <div className="bg-black/20 backdrop-blur-lg border border-white/10 rounded-2xl overflow-hidden transition-all duration-300 :bg-black/30 group">
        {/* Header */}
        <div className={`bg-gradient-to-r ${theme.gradient} border-b border-white/10 p-6`}>
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center text-3xl border-2 border-white/30 group-hover:scale-110 transition-transform">
              {theme.icon}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-white/90 transition-colors">
                {setData.name}
              </h2>
              <div className="flex flex-wrap gap-2">
                <div className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-bold border border-white/30">
                  {theme.category}
                </div>
                <div className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-bold border border-white/30 flex items-center space-x-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path>
                  </svg>
                  <span>{maxItems} Items</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Equipment List */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3 mb-4">
                <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
                <h3 className="text-lg font-bold text-white">Equipment Pieces</h3>
              </div>
              <div className="bg-white/5 rounded-xl border border-white/10 p-4">
                <div className="space-y-2">
                  {equipment.map((item, index) => (
                    <div
                      key={index}
                      className="bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 border border-white/10"
                    >
                      {item.trim()}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Set Bonuses */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3 mb-4">
                <svg className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
                <h3 className="text-lg font-bold text-white">Set Bonuses</h3>
              </div>
              <div className="space-y-3">
                {effects.map((effect, index) => {
                  const requiredItems = parseInt(completionNumbers[index]);
                  const progressPercentage = (requiredItems / maxItems) * 100;
                  
                  return (
                    <div
                      key={index}
                      className="bg-white/5 rounded-xl border border-white/10 p-4 hover:bg-white/10 transition-colors duration-200"
                    >
                      <div className="flex items-center space-x-2 mb-3">
                        <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                        <span className="text-sm font-bold text-white">
                          {requiredItems} Item{requiredItems > 1 ? 's' : ''} Required
                        </span>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="mb-3">
                        <div className="w-full bg-white/20 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-yellow-400 to-amber-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${progressPercentage}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <p className="text-gray-300 text-sm leading-relaxed">
                        {effect.trim()}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (localStorage.getItem("loggedIn") !== 'false') {
      getFromDB();
    }
  }, []);

  if (localStorage.getItem("loggedIn") === 'false') {
    return <NotLoggedIn />;
  }

  const isAdmin = localStorage.getItem('loggedIn')?.toUpperCase() === 'ADMIN';

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900">
      <div className="max-w-full mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-900/50 to-indigo-900/50 backdrop-blur-lg rounded-2xl border border-white/10 p-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">Equipment Set Bonuses</h1>
                <p className="text-purple-300 text-lg">Discover powerful synergies by collecting complete equipment sets</p>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-12">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-400 mb-4"></div>
              <h3 className="text-xl font-semibold text-white mb-2">Loading equipment sets...</h3>
              <p className="text-gray-400">Please wait while we fetch the set bonus data</p>
            </div>
          </div>
        ) : bonuses.length > 0 ? (
          <div className="space-y-6">
            {/* Results Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <svg className="w-6 h-6 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
                <h2 className="text-xl font-bold text-white">
                  Available Equipment Sets
                </h2>
              </div>
              <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm font-bold">
                {bonuses.length} set{bonuses.length !== 1 ? 's' : ''}
              </span>
            </div>

            {/* Set Cards */}
            <div className="grid grid-cols-1 gap-6">
              {bonuses.map((setData, index) => (
                <SetCard key={index} setData={setData} />
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-12">
            <div className="flex flex-col items-center justify-center text-center">
              <svg className="w-16 h-16 text-gray-500 mb-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
              <h3 className="text-xl font-semibold text-white mb-2">No equipment sets available</h3>
              <p className="text-gray-400">There are currently no set bonuses in the database</p>
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