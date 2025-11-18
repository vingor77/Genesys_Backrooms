import React, { useState, useEffect } from 'react'
import { Drawer } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SwitchAccountIcon from '@mui/icons-material/SwitchAccount';
import HouseIcon from '@mui/icons-material/House';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import TimerIcon from '@mui/icons-material/Timer';
import CategoryIcon from '@mui/icons-material/Category';
import { auth } from './firebase';
import { isDM, hasActiveSession } from './sessionUtils';

export default function Navbar() {
  const [desktopTab, setDesktopTab] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [anchor, setAnchor] = useState(null);
  const [userIsDM, setUserIsDM] = useState(false);
  const [hasSession, setHasSession] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Check session status on mount and update state
    setHasSession(hasActiveSession());
    setUserIsDM(isDM());
    setUserName(localStorage.getItem('loggedIn') || '');
  }, []);

  const generalInfoMenu = ['Crafting', 'Interest', 'Quests', 'Phenomena'];
  const objectMenu = ["Objects", "Sets"];
  const DMInfoMenu = ['Entities', 'Groups', 'Levels', 'Outposts', 'Lethal'];

  const signOut = async () => {
    try {
      await auth.signOut();
      // Clear session data
      localStorage.removeItem('activeSession');
      localStorage.removeItem('sessionRole');
      localStorage.setItem('loggedIn', 'false');
      window.location.assign('/login');
      console.log('Logged out');
    } catch (error) {
      console.log('Error logging out: ' + error.message);
    }
  }

  const isLoggedIn = localStorage.getItem('loggedIn') !== '' && localStorage.getItem('loggedIn') !== 'false';

  return (
    <div className="relative">
      {/* Main Navbar */}
      <div className="bg-gradient-to-r from-gray-900/95 via-purple-900/95 to-indigo-900/95 backdrop-blur-xl border-b border-white/10 shadow-2xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo/Brand */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">⚡</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-white font-bold text-xl bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Backrooms Hub
                </h1>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-2">
              {/* User Name Display */}
              {isLoggedIn && userName && (
                <div className="flex items-center space-x-2 px-4 py-2 bg-indigo-600/20 rounded-lg border border-indigo-500/30 mr-2">
                  <svg className="w-4 h-4 text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                  </svg>
                  <span className="text-indigo-300 text-sm font-medium">{userName}</span>
                </div>
              )}

              {/* Session Indicator */}
              {hasSession && (
                <div className="flex items-center space-x-2 px-3 py-1 bg-purple-600/20 rounded-lg border border-purple-500/30 mr-2">
                  <span className={`w-2 h-2 rounded-full ${userIsDM ? 'bg-amber-400' : 'bg-blue-400'} animate-pulse`}></span>
                  <span className="text-purple-300 text-sm font-medium">
                    {userIsDM ? '👑 DM' : '🎮 Player'}
                  </span>
                </div>
              )}

              {/* Main Navigation Links */}
              <a 
                href='/' 
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200 group"
              >
                <HouseIcon className="w-5 h-5 text-gray-400 group-hover:text-purple-400 transition-colors" />
                <span className="font-medium">Home</span>
              </a>
              
              <a 
                href='/information' 
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200 group"
              >
                <ReceiptLongIcon className="w-5 h-5 text-gray-400 group-hover:text-blue-400 transition-colors" />
                <span className="font-medium">Rules</span>
              </a>
              
              <a 
                href='/functions' 
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200 group"
              >
                <TimerIcon className="w-5 h-5 text-gray-400 group-hover:text-green-400 transition-colors" />
                <span className="font-medium">Player Functions</span>
              </a>

              {/* Pages Dropdown */}
              <div className="relative">
                <button 
                  onClick={(event) => {setDesktopTab(desktopTab === 'Pages' ? null : 'Pages'); setAnchor(event.currentTarget)}} 
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200 group"
                >
                  <CategoryIcon className="w-5 h-5 text-gray-400 group-hover:text-amber-400 transition-colors" />
                  <span className="font-medium">Pages</span>
                  <KeyboardArrowDownIcon className={`w-4 h-4 transition-transform duration-200 ${desktopTab === 'Pages' ? 'rotate-180' : ''}`} />
                </button>

                {/* Custom Dropdown Menu */}
                {desktopTab === 'Pages' && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-black/70 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl py-2 z-50">
                    <div className="max-h-80 overflow-y-auto">
                      {/* General Information Section */}
                      <div className="px-3 py-2">
                        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                          General Information
                        </h4>
                        {generalInfoMenu.map((item) => (
                          <a
                            key={item}
                            href={'/' + item.toLowerCase()}
                            className="block px-3 py-2 text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200 text-sm font-medium rounded-lg"
                            onClick={() => setDesktopTab(null)}
                          >
                            {item}
                          </a>
                        ))}
                      </div>

                      {/* Divider */}
                      <div className="mx-3 my-2 border-t border-white/10"></div>

                      {/* Objects & Equipment Section */}
                      <div className="px-3 py-2">
                        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                          Objects & Equipment
                        </h4>
                        {objectMenu.map((item) => (
                          <a
                            key={item}
                            href={'/' + item.toLowerCase()}
                            className="block px-3 py-2 text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200 text-sm font-medium rounded-lg"
                            onClick={() => setDesktopTab(null)}
                          >
                            {item}
                          </a>
                        ))}
                      </div>

                      {/* Dungeon Master Section - Only show if DM */}
                      {hasSession && userIsDM && (
                        <>
                          <div className="mx-3 my-2 border-t border-white/10"></div>
                          <div className="px-3 py-2">
                            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center">
                              <span className="w-4 h-4 bg-amber-500/30 text-amber-300 rounded text-xs flex items-center justify-center mr-2">👑</span>
                              Dungeon Master
                            </h4>
                            {DMInfoMenu.map((item) => (
                              <a
                                key={item}
                                href={'/' + item.toLowerCase()}
                                className="block px-3 py-2 text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200 text-sm font-medium rounded-lg"
                                onClick={() => setDesktopTab(null)}
                              >
                                {item}
                              </a>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Auth & Mobile Menu */}
            <div className="flex items-center space-x-3">
              {/* Session Selector Link (when logged in with session) */}
              {isLoggedIn && hasSession && (
                <a
                  href="/session-selector"
                  className="hidden sm:flex items-center space-x-2 px-3 py-2 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 rounded-lg font-medium transition-all duration-200 border border-indigo-500/30"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path>
                  </svg>
                  <span className="text-sm">Sessions</span>
                </a>
              )}

              {/* Auth Button */}
              {!isLoggedIn ? (
                <a 
                  href='/login'
                  className="hidden sm:flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  <SwitchAccountIcon className="w-4 h-4" />
                  <span>Sign In</span>
                </a>
              ) : (
                <button 
                  onClick={signOut}
                  className="hidden sm:flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  <SwitchAccountIcon className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="md:hidden p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200"
              >
                <MenuIcon className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Click Outside to Close Dropdown */}
      {desktopTab === 'Pages' && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setDesktopTab(null)}
        />
      )}

      <Drawer 
        open={mobileMenuOpen} 
        onClose={() => setMobileMenuOpen(false)}
        PaperProps={{
          sx: {
            width: 320,
            background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.95), rgba(88, 28, 135, 0.95), rgba(67, 56, 202, 0.95))',
            backdropFilter: 'blur(20px)',
            border: 'none',
            borderLeft: '1px solid rgba(255, 255, 255, 0.1)'
          }
        }}
        anchor="right"
      >
        <div className="h-full flex flex-col">
          {/* Mobile Header with User Name */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">⚡</span>
              </div>
              <div>
                <h2 className="text-white font-bold text-lg">Backrooms Hub</h2>
                <p className="text-purple-300 text-sm">Campaign Resources</p>
              </div>
            </div>

            {/* User Name Display in Mobile */}
            {isLoggedIn && userName && (
              <div className="mb-4 flex items-center space-x-2 px-4 py-3 bg-indigo-600/20 rounded-lg border border-indigo-500/30">
                <svg className="w-5 h-5 text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                </svg>
                <div className="flex-1">
                  <div className="text-xs text-indigo-400 font-medium">Logged in as</div>
                  <div className="text-white font-bold">{userName}</div>
                </div>
              </div>
            )}

            {/* Session Indicator Mobile */}
            {hasSession && (
              <div className="mb-4 flex items-center space-x-2 px-4 py-2 bg-purple-600/20 rounded-lg border border-purple-500/30">
                <span className={`w-2 h-2 rounded-full ${userIsDM ? 'bg-amber-400' : 'bg-blue-400'} animate-pulse`}></span>
                <span className="text-purple-300 text-sm font-medium">
                  {userIsDM ? '👑 DM Mode' : '🎮 Player Mode'}
                </span>
              </div>
            )}

            {/* Mobile Auth */}
            {!isLoggedIn ? (
              <a 
                href='/login'
                className="flex items-center justify-center space-x-2 w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium transition-all duration-200 shadow-lg"
              >
                <SwitchAccountIcon className="w-4 h-4" />
                <span>Sign In</span>
              </a>
            ) : (
              <div className="space-y-2">
                {hasSession && (
                  <a
                    href="/session-selector"
                    className="flex items-center justify-center space-x-2 w-full px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all duration-200 shadow-lg"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path>
                    </svg>
                    <span>Switch Session</span>
                  </a>
                )}
                <button 
                  onClick={signOut}
                  className="flex items-center justify-center space-x-2 w-full px-4 py-3 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white rounded-lg font-medium transition-all duration-200 shadow-lg"
                >
                  <SwitchAccountIcon className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Navigation */}
          <div className="flex-1 overflow-y-auto p-4">
            {/* Main Links */}
            <div className="space-y-2 mb-6">
              <a 
                href='/'
                className="flex items-center space-x-3 px-4 py-3 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200 group"
              >
                <HouseIcon className="w-5 h-5 text-gray-400 group-hover:text-purple-400" />
                <span className="font-medium">Home</span>
              </a>
              
              <a 
                href='/information'
                className="flex items-center space-x-3 px-4 py-3 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200 group"
              >
                <ReceiptLongIcon className="w-5 h-5 text-gray-400 group-hover:text-blue-400" />
                <span className="font-medium">Rules</span>
              </a>
              
              <a 
                href='/functions'
                className="flex items-center space-x-3 px-4 py-3 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200 group"
              >
                <TimerIcon className="w-5 h-5 text-gray-400 group-hover:text-green-400" />
                <span className="font-medium">Player Functions</span>
              </a>
            </div>

            {/* All Pages Section */}
            <div>
              <div className="px-4 py-2 mb-3">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  All Pages
                </h3>
              </div>

              {/* General Information */}
              <div className="mb-4">
                <div className="px-4 py-1 mb-2">
                  <h4 className="text-xs font-medium text-purple-300 uppercase tracking-wider">
                    General Information
                  </h4>
                </div>
                <div className="space-y-1">
                  {generalInfoMenu.map((item) => (
                    <a
                      key={item}
                      href={`/${item.toLowerCase()}`}
                      className="block px-4 py-2 text-white/70 hover:text-white hover:bg-white/5 transition-all duration-200 text-sm rounded-lg"
                    >
                      {item}
                    </a>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className="mx-4 my-3 border-t border-white/10"></div>

              {/* Objects & Equipment */}
              <div className="mb-4">
                <div className="px-4 py-1 mb-2">
                  <h4 className="text-xs font-medium text-blue-300 uppercase tracking-wider">
                    Objects & Equipment
                  </h4>
                </div>
                <div className="space-y-1">
                  {objectMenu.map((item) => (
                    <a
                      key={item}
                      href={`/${item.toLowerCase()}`}
                      className="block px-4 py-2 text-white/70 hover:text-white hover:bg-white/5 transition-all duration-200 text-sm rounded-lg"
                    >
                      {item}
                    </a>
                  ))}
                </div>
              </div>

              {/* Dungeon Master - Only show if DM */}
              {hasSession && userIsDM && (
                <>
                  <div className="mx-4 my-3 border-t border-white/10"></div>
                  <div>
                    <div className="px-4 py-1 mb-2">
                      <h4 className="text-xs font-medium text-amber-300 uppercase tracking-wider flex items-center">
                        <span className="mr-1">👑</span>
                        Dungeon Master
                      </h4>
                    </div>
                    <div className="space-y-1">
                      {DMInfoMenu.map((item) => (
                        <a
                          key={item}
                          href={`/${item.toLowerCase()}`}
                          className="block px-4 py-2 text-white/70 hover:text-white hover:bg-white/5 transition-all duration-200 text-sm rounded-lg"
                        >
                          {item}
                        </a>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Mobile Footer */}
          <div className="p-4 border-t border-white/10">
            <div className="text-center">
              <p className="text-xs text-gray-400">Backrooms Campaign</p>
              <p className="text-xs text-purple-400 font-medium">v2.0 - Session System</p>
            </div>
          </div>
        </div>
      </Drawer>
    </div>
  )
}