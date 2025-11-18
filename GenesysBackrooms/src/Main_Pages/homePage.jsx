import React, { useEffect, useState } from "react";
import db, { auth } from '../Components/firebase';
import { doc, getDoc } from "firebase/firestore";
import Login from "../Components/login";
import { hasActiveSession, isDM, getActiveSession } from '../Components/sessionUtils';

export default function Home() {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionInfo, setSessionInfo] = useState(null);
  
  const fetchUserData = async () => {
    auth.onAuthStateChanged(async(user) => {
      if (user) {
        try {
          const docRef = doc(db, 'Users', user.uid);
          const docSnap = await getDoc(docRef);
          if(docSnap.exists()) {
            setUserDetails(docSnap.data());
            localStorage.setItem('loggedIn', docSnap.data().userName);
            
            // Check for active session
            if (!hasActiveSession()) {
              window.location.assign('/session-selector');
              return;
            }
            
            // Load session info if exists
            if (docSnap.data().activeSession) {
              const sessionRef = doc(db, 'Sessions', docSnap.data().activeSession);
              const sessionSnap = await getDoc(sessionRef);
              if (sessionSnap.exists()) {
                setSessionInfo(sessionSnap.data());
              }
            }
          } else {
            console.log('User document not found.');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        console.log('User not logged in.');
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // Check if user is logged in via localStorage as backup
  const isLoggedIn = userDetails || (localStorage.getItem('loggedIn') !== 'false' && localStorage.getItem('loggedIn') !== '');

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <h3 className="text-xl font-semibold text-white mb-2">Loading...</h3>
          <p className="text-gray-400">Connecting to the Backrooms</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Login />;
  }

  const userName = userDetails?.userName || localStorage.getItem('loggedIn') || 'Explorer';

  const quickLinks = [
    { name: 'Crafting', icon: '🔨', href: '/crafting', description: 'Create and upgrade items', color: 'from-amber-600 to-orange-600' },
    { name: 'Quests', icon: '📜', href: '/quests', description: 'Track your ongoing adventures', color: 'from-blue-600 to-cyan-600' },
    { name: 'Phenomena', icon: '✨', href: '/phenomena', description: 'Discover anomalous events', color: 'from-purple-600 to-pink-600' },
    { name: 'Objects', icon: '📦', href: '/objects', description: 'Explore all items and equipment', color: 'from-indigo-600 to-purple-600' },
    { name: 'Interest', icon: '👥', href: '/interest', description: 'People of significance', color: 'from-green-600 to-emerald-600' },
    { name: 'Sets', icon: '⚡', href: '/sets', description: 'Equipment set bonuses', color: 'from-red-600 to-pink-600' }
  ];

  const dmOnlyLinks = [
    { name: 'Entities', icon: '👹', href: '/entities', description: 'Manage hostile creatures', color: 'from-red-600 to-orange-600' },
    { name: 'Groups', icon: '🏛️', href: '/groups', description: 'Faction management', color: 'from-blue-600 to-indigo-600' },
    { name: 'Levels', icon: '🗺️', href: '/levels', description: 'Level information', color: 'from-green-600 to-teal-600' },
    { name: 'Outposts', icon: '🏕️', href: '/outposts', description: 'Safe haven locations', color: 'from-purple-600 to-indigo-600' }
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        
        {/* Hero Section */}
        <div className="bg-black/20 backdrop-blur-lg rounded-3xl border border-white/10 overflow-hidden">
          <div className="relative p-8 lg:p-12">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/30 to-pink-600/30"></div>
              <div className="absolute inset-0" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}></div>
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-2xl">
                  <span className="text-white font-bold text-2xl">⚡</span>
                </div>
                <div>
                  <h1 className="text-4xl lg:text-5xl font-bold text-white mb-2">
                    Welcome back, <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">{userName}</span>
                  </h1>
                  <p className="text-xl text-gray-300">Ready to explore the Backrooms?</p>
                </div>
              </div>
              
              {/* Session Info */}
              {hasActiveSession() && (
                <div className="mt-6 inline-flex items-center space-x-3 bg-purple-600/20 px-6 py-3 rounded-xl border border-purple-500/30">
                  <span className={`w-3 h-3 rounded-full ${isDM() ? 'bg-amber-400' : 'bg-blue-400'} animate-pulse`}></span>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-purple-300 font-medium">
                        {isDM() ? '👑 Dungeon Master Mode' : '🎮 Player Mode'}
                      </span>
                    </div>
                    {sessionInfo && (
                      <p className="text-purple-400 text-sm">Campaign: {sessionInfo.name}</p>
                    )}
                  </div>
                  <a 
                    href="/session-selector"
                    className="ml-4 text-purple-300 hover:text-purple-200 text-sm underline"
                  >
                    Switch Session
                  </a>
                </div>
              )}
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                <div className="lg:col-span-2">
                  <p className="text-gray-200 text-lg leading-relaxed mb-6">
                    The Backrooms Hub is your comprehensive campaign resource center. Navigate through endless 
                    corridors of information, track your quests, manage your equipment, and discover the 
                    mysteries that await in the depths of this infinite maze.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <span className="bg-purple-500/20 text-purple-300 px-4 py-2 rounded-full text-sm border border-purple-500/30">
                      🗺️ Interactive Maps
                    </span>
                    <span className="bg-blue-500/20 text-blue-300 px-4 py-2 rounded-full text-sm border border-blue-500/30">
                      📊 Character Tracking
                    </span>
                    <span className="bg-green-500/20 text-green-300 px-4 py-2 rounded-full text-sm border border-green-500/30">
                      🎲 Campaign Tools
                    </span>
                    <span className="bg-amber-500/20 text-amber-300 px-4 py-2 rounded-full text-sm border border-amber-500/30">
                      🔨 Crafting System
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Access Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <span className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                🚀
              </span>
              Quick Access
            </h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className="group bg-black/20 backdrop-blur-lg rounded-xl border border-white/10 p-6 hover:bg-black/30 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${link.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <span className="text-2xl">{link.icon}</span>
                </div>
                <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-purple-300 transition-colors">
                  {link.name}
                </h3>
                <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">
                  {link.description}
                </p>
              </a>
            ))}
          </div>
        </div>

        {/* DM-Only Section */}
        {hasActiveSession() && isDM() && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <span className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center mr-3">
                  👑
                </span>
                Dungeon Master Tools
              </h2>
              <span className="bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full text-sm border border-amber-500/30">
                DM Only
              </span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {dmOnlyLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="group bg-gradient-to-br from-amber-900/20 to-orange-900/20 backdrop-blur-lg rounded-xl border border-amber-500/20 p-6 hover:from-amber-900/30 hover:to-orange-900/30 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                >
                  <div className={`w-12 h-12 bg-gradient-to-br ${link.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <span className="text-2xl">{link.icon}</span>
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-amber-300 transition-colors">
                    {link.name}
                  </h3>
                  <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">
                    {link.description}
                  </p>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Footer Info */}
        <div className="bg-black/20 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="text-center lg:text-left mb-4 lg:mb-0">
              <h3 className="text-white font-semibold mb-2">Need Help Getting Started?</h3>
              <p className="text-gray-400 text-sm">
                Check out the campaign rules and player functions to familiarize yourself with the system.
              </p>
            </div>
            <div className="flex space-x-3">
              <a 
                href="/information" 
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                📋 Campaign Rules
              </a>
              <a 
                href="/functions" 
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                ⚙️ Player Tools
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}