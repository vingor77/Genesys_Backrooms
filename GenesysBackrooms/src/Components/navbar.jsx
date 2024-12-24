import React, { useState } from 'react'
import { Menu, Button, Box, IconButton, Divider, Drawer, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SwitchAccountIcon from '@mui/icons-material/SwitchAccount';
import HouseIcon from '@mui/icons-material/House';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import TimerIcon from '@mui/icons-material/Timer';

export default function Navbar() {
  const [desktopTab, setDesktopTab] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const generalInfoMenu = ['Crafting', 'Interest', 'Quests', 'Phenomenons'];
  const objectMenu = ['Armor', 'Mundane', "Objects", "Weapons"];
  const DMInfoMenu = ['Entities', 'Groups', 'Levels', 'Outposts', 'Bethal'];

  const signOut = () => {
    localStorage.setItem('loggedIn', 'false');
  }

  return (
    <Box>
      <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' }}}>
        <IconButton onClick={() => setMobileMenuOpen(true)}><MenuIcon /></IconButton>
        <Drawer open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)}>
          <List>
            <ListItem disablePadding>
              {localStorage.getItem('loggedIn') === 'false' || !localStorage.getItem('loggedIn') ?
                <Button href='/login' variant='outlined' startIcon={<SwitchAccountIcon />}>Sign in</Button>
              :
                <Button onClick={signOut} href='/' variant='outlined' startIcon={<SwitchAccountIcon />}>Sign out</Button>
              }
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton href='/'>
                <ListItemText>Home</ListItemText>
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton href='/information'>
                <ListItemText>Rules</ListItemText>
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton href='/functions'>
                <ListItemText>Player Functions</ListItemText>
              </ListItemButton>
            </ListItem>
          </List>
          <Divider />
          <List>
            {generalInfoMenu.map((text) => (
              <ListItem key={text} disablePadding>
                <ListItemButton href={'/' + text.toLowerCase()}>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            {objectMenu.map((text) => (
              <ListItem key={text} disablePadding>
                <ListItemButton href={'/' + text.toLowerCase()}>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            {DMInfoMenu.map((text) => (
              <ListItem key={text} disablePadding>
                <ListItemButton href={'/' + text.toLowerCase()}>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Drawer>
      </Box>

      {/* Desktop Menu */}
      <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }}}>
        {localStorage.getItem('loggedIn') === 'false' || !localStorage.getItem('loggedIn') ? <Button startIcon={<SwitchAccountIcon />} href='/login' variant='outlined'>Log in</Button> : <Button startIcon={<SwitchAccountIcon />} onClick={signOut} variant='outlined'>Sign out</Button>}
        <Button href='/' startIcon={<HouseIcon />} variant='outlined'>Home</Button>
        <Button href='/information' startIcon={<ReceiptLongIcon />} variant='outlined'>Rules</Button>
        <Button href='/functions' startIcon={<TimerIcon />} variant='outlined'>Player Functions</Button>

        <Button onClick={() => setDesktopTab('General')} endIcon={<KeyboardArrowDownIcon />} variant='outlined'>General</Button>
        <Menu open={desktopTab === 'General'} onClose={() => setDesktopTab(null)}>
        <List>
            {generalInfoMenu.map((text) => {
              return (
                <ListItem dense>
                  <ListItemButton href={'/' + text}>
                    <ListItemText>{text}</ListItemText>
                  </ListItemButton>
                </ListItem>
              )
            })}
          </List>
        </Menu>

        <Button onClick={() => setDesktopTab('Objects')} endIcon={<KeyboardArrowDownIcon />} variant='outlined'>objects</Button>
        <Menu open={desktopTab === 'Objects'} onClose={() => setDesktopTab(null)}>
          <List>
            {objectMenu.map((text) => {
              return (
                <ListItem dense>
                  <ListItemButton href={'/' + text}>
                    <ListItemText>{text}</ListItemText>
                  </ListItemButton>
                </ListItem>
              )
            })}
          </List>
        </Menu>

        <Button onClick={() => setDesktopTab('DM')} endIcon={<KeyboardArrowDownIcon />} variant='outlined'>Dungeon Master</Button>
        <Menu open={desktopTab === 'DM'} onClose={() => setDesktopTab(null)}>
        <List>
            {DMInfoMenu.map((text) => {
              return (
                <ListItem dense>
                  <ListItemButton href={'/' + text}>
                    <ListItemText>{text}</ListItemText>
                  </ListItemButton>
                </ListItem>
              )
            })}
          </List>
        </Menu>
      </Box>
    </Box>
  )
}