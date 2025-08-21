import React, { useState } from 'react'
import { Menu, Button, Box, IconButton, Divider, Drawer, List, ListItem, ListItemButton, ListItemText, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SwitchAccountIcon from '@mui/icons-material/SwitchAccount';
import HouseIcon from '@mui/icons-material/House';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import TimerIcon from '@mui/icons-material/Timer';
import InfoIcon from '@mui/icons-material/Info';
import CategoryIcon from '@mui/icons-material/Category';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { auth } from './firebase';

export default function Navbar() {
  const [desktopTab, setDesktopTab] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [anchor, setAnchor] = useState(null);

  const generalInfoMenu = ['Crafting', 'Interest', 'Quests', 'Phenomena'];
  const objectMenu = ['Armor', 'Mundane', "Objects", "Weapons", "Sets"];
  const DMInfoMenu = ['Entities', 'Groups', 'Levels', 'Outposts', 'Lethal'];

  const allMenuItems = [
    ...generalInfoMenu,
    ...objectMenu,
    ...DMInfoMenu
  ];

  const signOut = async () => {
    try {
      await auth.signOut();
      window.location.assign('/login');
      console.log('Logged out');
    } catch (error) {
      console.log('Error logging out: ' + error.message);
    }
    localStorage.setItem('loggedIn', 'false');
  }

  const isLoggedIn = localStorage.getItem('loggedIn') !== '' && localStorage.getItem('loggedIn') !== 'false';

  return (
    <div className="relative">
      {/* Main Navbar */}
      <nav className="bg-gradient-to-r from-gray-900/95 via-purple-900/95 to-indigo-900/95 backdrop-blur-xl border-b border-white/10 shadow-2xl sticky top-0 z-50">
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
                            href={`/${item.toLowerCase()}`}
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
                            href={`/${item.toLowerCase()}`}
                            className="block px-3 py-2 text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200 text-sm font-medium rounded-lg"
                            onClick={() => setDesktopTab(null)}
                          >
                            {item}
                          </a>
                        ))}
                      </div>

                      {/* Divider */}
                      <div className="mx-3 my-2 border-t border-white/10"></div>

                      {/* Dungeon Master Section */}
                      <div className="px-3 py-2">
                        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                          Dungeon Master
                        </h4>
                        {DMInfoMenu.map((item) => (
                          <a
                            key={item}
                            href={`/${item.toLowerCase()}`}
                            className="block px-3 py-2 text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200 text-sm font-medium rounded-lg"
                            onClick={() => setDesktopTab(null)}
                          >
                            {item}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Auth & Mobile Menu */}
            <div className="flex items-center space-x-3">
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
      </nav>

      {/* Click Outside to Close Dropdown */}
      {desktopTab === 'Pages' && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setDesktopTab(null)}
        />
      )}

      {/* Mobile Drawer */}
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
          {/* Mobile Header */}
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
              <button 
                onClick={signOut}
                className="flex items-center justify-center space-x-2 w-full px-4 py-3 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white rounded-lg font-medium transition-all duration-200 shadow-lg"
              >
                <SwitchAccountIcon className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
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

              {/* Divider */}
              <div className="mx-4 my-3 border-t border-white/10"></div>

              {/* Dungeon Master */}
              <div>
                <div className="px-4 py-1 mb-2">
                  <h4 className="text-xs font-medium text-pink-300 uppercase tracking-wider">
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
            </div>
          </div>

          {/* Mobile Footer */}
          <div className="p-4 border-t border-white/10">
            <div className="text-center">
              <p className="text-xs text-gray-400">Backrooms Campaign</p>
              <p className="text-xs text-purple-400 font-medium">v2.0</p>
            </div>
          </div>
        </div>
      </Drawer>
    </div>
  )
}