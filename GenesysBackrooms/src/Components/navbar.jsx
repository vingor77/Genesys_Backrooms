import React, { useState } from 'react'
import { Menu, Button, Box, IconButton, Divider, Drawer, List, ListItem, ListItemButton, ListItemText, MenuItem,AppBar,Toolbar,Typography,Container } from '@mui/material';
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
  const DMInfoMenu = ['Entities', 'Groups', 'Levels', 'Outposts', 'Bethal'];

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
    <AppBar position="static" sx={{ backgroundColor: '#1976d2', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', borderBottom: '1px solid rgba(255,255,255,0.1)'}}>
      <Container maxWidth="xl">
        <Toolbar sx={{ minHeight: { xs: 56, sm: 64 }, px: { xs: 1, sm: 2 } }}>
          
          {/* Mobile Menu */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', width: '100%' }}>
            <IconButton onClick={() => setMobileMenuOpen(true)} sx={{ color: 'white', '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }}}><MenuIcon /></IconButton>
            
            <Drawer 
              open={mobileMenuOpen} 
              onClose={() => setMobileMenuOpen(false)}
              PaperProps={{
                sx: {
                  width: 280,
                  backgroundColor: '#f8f9fa'
                }
              }}
            >
              {/* Mobile Auth Section */}
              <Box sx={{ p: 2, backgroundColor: '#1976d2', color: 'white' }}>
                {!isLoggedIn ?
                  <Button 
                    href='/login' 
                    variant='contained' 
                    startIcon={<SwitchAccountIcon />}
                    fullWidth
                    sx={{ 
                      backgroundColor: 'white', 
                      color: '#1976d2',
                      '&:hover': { backgroundColor: '#f5f5f5' }
                    }}
                  >
                    Sign in
                  </Button>
                :
                  <Button 
                    onClick={signOut} 
                    href='/' 
                    variant='contained' 
                    startIcon={<SwitchAccountIcon />}
                    fullWidth
                    sx={{ 
                      backgroundColor: 'white', 
                      color: '#1976d2',
                      '&:hover': { backgroundColor: '#f5f5f5' }
                    }}
                  >
                    Sign out
                  </Button>
                }
              </Box>

              {/* Main Navigation */}
              <List sx={{ pt: 0 }}>
                <ListItem disablePadding>
                  <ListItemButton 
                    href='/'
                    sx={{ 
                      py: 1.5,
                      '&:hover': { backgroundColor: '#e3f2fd' }
                    }}
                  >
                    <HouseIcon sx={{ mr: 2, color: '#1976d2' }} />
                    <ListItemText 
                      primary="Home" 
                      primaryTypographyProps={{ fontWeight: 500 }}
                    />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton 
                    href='/information'
                    sx={{ 
                      py: 1.5,
                      '&:hover': { backgroundColor: '#e3f2fd' }
                    }}
                  >
                    <ReceiptLongIcon sx={{ mr: 2, color: '#1976d2' }} />
                    <ListItemText 
                      primary="Rules" 
                      primaryTypographyProps={{ fontWeight: 500 }}
                    />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton 
                    href='/functions'
                    sx={{ 
                      py: 1.5,
                      '&:hover': { backgroundColor: '#e3f2fd' }
                    }}
                  >
                    <TimerIcon sx={{ mr: 2, color: '#1976d2' }} />
                    <ListItemText 
                      primary="Player Functions" 
                      primaryTypographyProps={{ fontWeight: 500 }}
                    />
                  </ListItemButton>
                </ListItem>
              </List>

              {/* General Section */}
              <Divider sx={{ my: 1 }} />
              <Box sx={{ px: 2, py: 1 }}>
                <Typography 
                  variant="subtitle2" 
                  sx={{ 
                    color: '#666', 
                    fontWeight: 600, 
                    textTransform: 'uppercase',
                    fontSize: '0.75rem',
                    letterSpacing: 1
                  }}
                >
                  General Information
                </Typography>
              </Box>
              <List sx={{ pt: 0 }}>
                {generalInfoMenu.map((text) => (
                  <ListItem key={text} disablePadding>
                    <ListItemButton 
                      href={'/' + text.toLowerCase()}
                      sx={{ 
                        pl: 3,
                        py: 1,
                        '&:hover': { backgroundColor: '#e8f5e8' }
                      }}
                    >
                      <ListItemText primary={text} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>

              {/* Objects Section */}
              <Divider sx={{ my: 1 }} />
              <Box sx={{ px: 2, py: 1 }}>
                <Typography 
                  variant="subtitle2" 
                  sx={{ 
                    color: '#666', 
                    fontWeight: 600, 
                    textTransform: 'uppercase',
                    fontSize: '0.75rem',
                    letterSpacing: 1
                  }}
                >
                  Objects & Equipment
                </Typography>
              </Box>
              <List sx={{ pt: 0 }}>
                {objectMenu.map((text) => (
                  <ListItem key={text} disablePadding>
                    <ListItemButton 
                      href={'/' + text.toLowerCase()}
                      sx={{ 
                        pl: 3,
                        py: 1,
                        '&:hover': { backgroundColor: '#fff3e0' }
                      }}
                    >
                      <ListItemText primary={text} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>

              {/* DM Section */}
              <Divider sx={{ my: 1 }} />
              <Box sx={{ px: 2, py: 1 }}>
                <Typography 
                  variant="subtitle2" 
                  sx={{ 
                    color: '#666', 
                    fontWeight: 600, 
                    textTransform: 'uppercase',
                    fontSize: '0.75rem',
                    letterSpacing: 1
                  }}
                >
                  Dungeon Master
                </Typography>
              </Box>
              <List sx={{ pt: 0 }}>
                {DMInfoMenu.map((text) => (
                  <ListItem key={text} disablePadding>
                    <ListItemButton 
                      href={'/' + text.toLowerCase()}
                      sx={{ 
                        pl: 3,
                        py: 1,
                        '&:hover': { backgroundColor: '#fce4ec' }
                      }}
                    >
                      <ListItemText primary={text} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Drawer>
          </Box>

          {/* Desktop Menu */}
          <Box sx={{ 
            display: { xs: 'none', md: 'flex' }, 
            alignItems: 'center',
            width: '100%',
            gap: 1
          }}>

            {/* Auth Button */}
            {!isLoggedIn ? 
              <Button 
                startIcon={<SwitchAccountIcon />} 
                href='/login' 
                variant='outlined'
                sx={{
                  color: 'white',
                  borderColor: 'rgba(255,255,255,0.5)',
                  mr: 2,
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255,255,255,0.1)'
                  }
                }}
              >
                Log in
              </Button> 
            : 
              <Button 
                startIcon={<SwitchAccountIcon />} 
                onClick={signOut} 
                variant='outlined'
                sx={{
                  color: 'white',
                  borderColor: 'rgba(255,255,255,0.5)',
                  mr: 2,
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255,255,255,0.1)'
                  }
                }}
              >
                Sign out
              </Button>
            }

            {/* Navigation Buttons */}
            <Button 
              href='/' 
              startIcon={<HouseIcon />} 
              variant='text'
              sx={{
                color: 'white',
                fontWeight: 500,
                px: 2,
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
              }}
            >
              Home
            </Button>
            
            <Button 
              href='/information' 
              startIcon={<ReceiptLongIcon />} 
              variant='text'
              sx={{
                color: 'white',
                fontWeight: 500,
                px: 2,
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
              }}
            >
              Rules
            </Button>
            
            <Button 
              href='/functions' 
              startIcon={<TimerIcon />} 
              variant='text'
              sx={{
                color: 'white',
                fontWeight: 500,
                px: 2,
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
              }}
            >
              Player Functions
            </Button>

            {/* Dropdown Menus */}
            <Button 
              onClick={(event) => {setDesktopTab('General'); setAnchor(event.currentTarget)}} 
              endIcon={<KeyboardArrowDownIcon />}
              startIcon={<InfoIcon />}
              variant='text'
              sx={{
                color: 'white',
                fontWeight: 500,
                px: 2,
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
              }}
            >
              General
            </Button>
            <Menu 
              open={desktopTab === 'General'} 
              onClose={() => setDesktopTab(null)} 
              anchorEl={anchor}
              PaperProps={{
                sx: {
                  mt: 1,
                  minWidth: 180,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }
              }}
            >
              {generalInfoMenu.map((text, index) => {
                return (
                  <MenuItem 
                    onClick={() => window.location.assign('/' + text)} 
                    key={index}
                    sx={{
                      py: 1.5,
                      '&:hover': { backgroundColor: '#e8f5e8' }
                    }}
                  >
                    {text}
                  </MenuItem>
                )
              })}
            </Menu>

            <Button 
              onClick={(event) => {setDesktopTab('Objects'); setAnchor(event.currentTarget)}} 
              endIcon={<KeyboardArrowDownIcon />}
              startIcon={<CategoryIcon />}
              variant='text'
              sx={{
                color: 'white',
                fontWeight: 500,
                px: 2,
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
              }}
            >
              Objects
            </Button>
            <Menu 
              open={desktopTab === 'Objects'} 
              onClose={() => setDesktopTab(null)} 
              anchorEl={anchor}
              PaperProps={{
                sx: {
                  mt: 1,
                  minWidth: 180,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }
              }}
            >
              {objectMenu.map((text, index) => {
                return (
                  <MenuItem 
                    onClick={() => window.location.assign('/' + text)} 
                    key={index}
                    sx={{
                      py: 1.5,
                      '&:hover': { backgroundColor: '#fff3e0' }
                    }}
                  >
                    {text}
                  </MenuItem>
                )
              })}
            </Menu>

            <Button 
              onClick={(event) => {setDesktopTab('DM'); setAnchor(event.currentTarget)}} 
              endIcon={<KeyboardArrowDownIcon />}
              startIcon={<AdminPanelSettingsIcon />}
              variant='text'
              sx={{
                color: 'white',
                fontWeight: 500,
                px: 2,
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
              }}
            >
              Dungeon Master
            </Button>
            <Menu 
              open={desktopTab === 'DM'} 
              onClose={() => setDesktopTab(null)} 
              anchorEl={anchor}
              PaperProps={{
                sx: {
                  mt: 1,
                  minWidth: 180,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }
              }}
            >
              {DMInfoMenu.map((text, index) => {
                return (
                  <MenuItem 
                    onClick={() => window.location.assign('/' + text)} 
                    key={index}
                    sx={{
                      py: 1.5,
                      '&:hover': { backgroundColor: '#fce4ec' }
                    }}
                  >
                    {text}
                  </MenuItem>
                )
              })}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}