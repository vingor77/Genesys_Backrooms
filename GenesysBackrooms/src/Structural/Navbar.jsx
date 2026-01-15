import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getActiveSession, isDM } from './Session_Utils';

export default function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sessionSelectorOpen, setSessionSelectorOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const sessionRef = useRef(null);
  const userRef = useRef(null);
  const userIsDM = isDM();
  const activeSession = getActiveSession();
  const username = localStorage.getItem('loggedIn') || 'User';

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(null);
      }
      if (sessionRef.current && !sessionRef.current.contains(event.target)) {
        setSessionSelectorOpen(false);
      }
      if (userRef.current && !userRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = () => {
    localStorage.setItem('loggedIn', 'false');
    localStorage.removeItem('activeSession');
    localStorage.removeItem('sessionRole');
    navigate('/login');
  };

  // Navigation structure
  const navGroups = [
    {
      id: 'main',
      label: 'Main',
      items: [
        { path: '/', label: 'Home', icon: '🏠' },
        { path: '/rules', label: 'Rules', icon: '📖' },
      ]
    },
    {
      id: 'tools',
      label: 'Tools',
      items: [
        { path: '/player-features', label: 'Player Features', icon: '🎮' },
        { path: '/dm-features', label: 'DM Features', icon: '🎮' },
        { path: '/game-runner', label: 'Game Runner', icon: '⚙️', dmOnly: true, placeholder: true },
      ]
    },
    {
      id: 'content',
      label: 'Content',
      items: [
        { path: '/crafts', label: 'Crafting', icon: '🔨' },
        { path: '/objects', label: 'Objects', icon: '📦' },
        { path: '/gear-sets', label: 'Gear Sets', icon: '🎽' },
        { path: '/entities', label: 'Entities', icon: '👹' },
        { path: '/factions', label: 'Factions', icon: '🏛️' },
        { path: '/levels', label: 'Levels', icon: '🗺️' },
      ]
    },
    {
      id: 'world',
      label: 'World',
      items: [
        { path: '/poi', label: 'People of Interest', icon: '👤' },
        { path: '/outposts', label: 'Outposts', icon: '🏕️' },
        { path: '/quests', label: 'Quests', icon: '📜' },
        { path: '/phenomena', label: 'Phenomena', icon: '✨' },
        { path: '/relations', label: 'Relations', icon: '🤝' },
      ]
    }
  ];

  const DropdownMenu = ({ group, items }) => (
    <div className="absolute top-full left-0 mt-2 w-64 bg-gray-900/95 backdrop-blur-xl border border-purple-500/30 rounded-lg shadow-2xl shadow-purple-500/20 overflow-hidden z-50">
      {items.map((item) => {
        // Skip DM-only items if user is not DM
        if (item.dmOnly && !userIsDM) return null;
        
        return (
          <button
            key={item.path}
            onClick={() => {
              if (item.placeholder) {
                // Placeholder - do nothing or show toast
                return;
              }
              navigate(item.path);
              setDropdownOpen(null);
              setMobileMenuOpen(false);
            }}
            className={`
              w-full px-4 py-3 text-left transition-all flex items-center space-x-3
              ${item.placeholder 
                ? 'text-gray-600 cursor-not-allowed' 
                : 'text-gray-300 hover:bg-purple-500/20 hover:text-white'
              }
              ${item.dmOnly ? 'border-l-2 border-purple-500' : ''}
            `}
            disabled={item.placeholder}
          >
            <span className="text-xl">{item.icon}</span>
            <div className="flex-1">
              <div className="font-medium">{item.label}</div>
              {item.placeholder && (
                <div className="text-xs text-gray-600">Coming Soon</div>
              )}
            </div>
            {item.dmOnly && (
              <span className="text-xs px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded border border-purple-500/50 font-bold">
                DM
              </span>
            )}
          </button>
        );
      })}
    </div>
  );

  const SessionSelector = () => (
    <div className="absolute top-full right-0 mt-2 w-72 bg-gray-900/95 backdrop-blur-xl border border-blue-500/30 rounded-lg shadow-2xl shadow-blue-500/20 overflow-hidden z-50">
      <div className="p-4 border-b border-white/10">
        <div className="text-sm text-gray-400 mb-1">Active Session</div>
        <div className="text-white font-bold">{activeSession || 'No Session Selected'}</div>
      </div>
      <div className="p-2">
        <button 
          onClick={() => {
            navigate('/session-selector');
            setSessionSelectorOpen(false);
            setDropdownOpen(null);
          }}
          className="w-full px-4 py-2 text-left text-gray-300 hover:bg-blue-500/20 hover:text-white rounded transition-all"
        >
          Change Session
        </button>
        <button 
          onClick={() => {
            navigate('/session-settings');
            setSessionSelectorOpen(false);
            setDropdownOpen(null);
          }}
          className="w-full px-4 py-2 text-left text-gray-300 hover:bg-blue-500/20 hover:text-white rounded transition-all"
        >
          Session Settings
        </button>
      </div>
    </div>
  );

  const UserMenu = () => (
    <div className="absolute top-full right-0 mt-2 w-64 bg-gray-900/95 backdrop-blur-xl border border-white/30 rounded-lg shadow-2xl overflow-hidden z-50">
      <div className="p-4 border-b border-white/10">
        <div className="text-sm text-gray-400 mb-1">Signed in as</div>
        <div className="text-white font-bold">{username}</div>
        {userIsDM && (
          <div className="text-xs px-2 py-1 bg-purple-500/20 text-purple-400 rounded border border-purple-500/50 font-bold inline-block mt-2">
            Game Master
          </div>
        )}
      </div>
      <div className="p-2">
        <button 
          onClick={() => {
            navigate('/profile-settings');
            setUserMenuOpen(false);
            setDropdownOpen(null);
          }}
          className="w-full px-4 py-2 text-left text-gray-300 hover:bg-white/10 hover:text-white rounded transition-all"
        >
          Profile Settings
        </button>
        <button 
          onClick={() => {
            navigate('/preferences');
            setUserMenuOpen(false);
            setDropdownOpen(null);
          }}
          className="w-full px-4 py-2 text-left text-gray-300 hover:bg-white/10 hover:text-white rounded transition-all"
        >
          Preferences
        </button>
        <button 
          onClick={() => {
            handleSignOut();
            setUserMenuOpen(false);
            setDropdownOpen(null);
          }}
          className="w-full px-4 py-2 text-left text-red-400 hover:bg-red-500/20 hover:text-red-300 rounded transition-all"
        >
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <nav className="bg-gradient-to-r from-gray-900 via-purple-900/50 to-gray-900 border-b border-purple-500/30 shadow-lg shadow-purple-500/10 sticky top-0 z-50 backdrop-blur-xl">
      <div className="max-w-[1920px] mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo / Brand */}
          <div className="flex items-center space-x-8">
            <button
              onClick={() => navigate('/')}
              className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent hover:from-purple-300 hover:to-blue-300 transition-all"
            >
              ⚠️ BACKROOMS RPG
            </button>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1" ref={dropdownRef}>
              {navGroups.map((group) => (
                <div key={group.id} className="relative">
                  <button
                    onClick={() => setDropdownOpen(dropdownOpen === group.id ? null : group.id)}
                    className={`
                      px-4 py-2 rounded-lg font-medium transition-all flex items-center space-x-2
                      ${dropdownOpen === group.id
                        ? 'bg-purple-500/20 text-white'
                        : 'text-gray-300 hover:bg-white/10 hover:text-white'
                      }
                    `}
                  >
                    <span>{group.label}</span>
                    <svg 
                      className={`w-4 h-4 transition-transform ${dropdownOpen === group.id ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {dropdownOpen === group.id && (
                    <DropdownMenu group={group} items={group.items} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Session & User */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Session Indicator */}
            <div className="relative" ref={sessionRef}>
              <button
                onClick={() => {
                  setSessionSelectorOpen(!sessionSelectorOpen);
                  setUserMenuOpen(false);
                }}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 rounded-lg transition-all"
              >
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <div className="text-left">
                  <div className="text-xs text-gray-400">Session</div>
                  <div className="text-sm font-bold text-white truncate max-w-[150px]">
                    {activeSession || 'None'}
                  </div>
                </div>
              </button>
              {sessionSelectorOpen && <SessionSelector />}
            </div>

            {/* User Menu */}
            <div className="relative" ref={userRef}>
              <button
                onClick={() => {
                  setUserMenuOpen(!userMenuOpen);
                  setSessionSelectorOpen(false);
                }}
                className={`
                  flex items-center space-x-2 px-4 py-2 rounded-lg transition-all border
                  ${userIsDM 
                    ? 'bg-purple-500/10 hover:bg-purple-500/20 border-purple-500/30' 
                    : 'bg-white/5 hover:bg-white/10 border-white/20'
                  }
                `}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                  userIsDM ? 'bg-purple-500 text-white' : 'bg-blue-500 text-white'
                }`}>
                  {username.charAt(0).toUpperCase()}
                </div>
                <span className="text-white font-medium">{username}</span>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {userMenuOpen && <UserMenu />}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-white/10">
            {/* Session Info */}
            <div className="px-4 py-3 mb-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <div className="text-xs text-gray-400 mb-1">Active Session</div>
              <div className="text-white font-bold">{activeSession || 'No Session'}</div>
            </div>

            {/* User Info */}
            <div className="px-4 py-3 mb-4 bg-white/5 border border-white/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  userIsDM ? 'bg-purple-500 text-white' : 'bg-blue-500 text-white'
                }`}>
                  {username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="text-white font-bold">{username}</div>
                  {userIsDM && (
                    <div className="text-xs text-purple-400">Game Master</div>
                  )}
                </div>
              </div>
            </div>

            {/* Navigation Groups */}
            {navGroups.map((group) => (
              <div key={group.id} className="mb-4">
                <div className="px-4 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  {group.label}
                </div>
                <div className="space-y-1">
                  {group.items.map((item) => {
                    if (item.dmOnly && !userIsDM) return null;
                    
                    return (
                      <button
                        key={item.path}
                        onClick={() => {
                          if (item.placeholder) return;
                          navigate(item.path);
                          setMobileMenuOpen(false);
                        }}
                        disabled={item.placeholder}
                        className={`
                          w-full px-4 py-3 text-left flex items-center space-x-3 rounded-lg transition-all
                          ${item.placeholder
                            ? 'text-gray-600 cursor-not-allowed'
                            : 'text-gray-300 hover:bg-purple-500/20 hover:text-white'
                          }
                          ${item.dmOnly ? 'border-l-2 border-purple-500' : ''}
                        `}
                      >
                        <span className="text-xl">{item.icon}</span>
                        <div className="flex-1">
                          <div className="font-medium">{item.label}</div>
                          {item.placeholder && (
                            <div className="text-xs text-gray-600">Coming Soon</div>
                          )}
                        </div>
                        {item.dmOnly && (
                          <span className="text-xs px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded border border-purple-500/50 font-bold">
                            DM
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Mobile Sign Out */}
            <button
              onClick={handleSignOut}
              className="w-full px-4 py-3 text-left text-red-400 hover:bg-red-500/20 hover:text-red-300 rounded-lg transition-all mt-4"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}