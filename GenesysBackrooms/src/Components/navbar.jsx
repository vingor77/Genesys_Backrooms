import React, { useState } from 'react'
import { AppBar, Stack, Toolbar, Link, Menu, Button, MenuItem, Box, IconButton, Divider, Drawer, Typography, Input, List, ListItem, ListItemButton, ListItemText, ListItemIcon, ListSubheader, Icon } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

export default function Navbar() {
  const [open, setOpen] = useState('');
  const [openSmall, setOpenSmall] = useState(null);
  const generalInfoMenu = ['Crafting', 'Groups', 'Interest', 'Quests'];
  const objectMenu = ['Armor', 'Mundane', "Objects", "Weapons"];
  const playerInfoMenu = ['Information', 'Phenomenons'];
  const DMInfoMenu = ['Entities', 'Levels', 'Outposts', 'Bethal'];


  const Menus = () => {
    return (
      <>
        <Toolbar />
        <List>
          <ListItem disablePadding>
            <ListItemButton href='/'>
              <ListItemText primary='Home'></ListItemText>
            </ListItemButton>
          </ListItem>
        </List>
        <List>
          <ListSubheader>General Links</ListSubheader>
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
          <ListSubheader>Object Links</ListSubheader>
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
          <ListSubheader>Player Links</ListSubheader>
          {playerInfoMenu.map((text) => (
            <ListItem key={text} disablePadding>
              <ListItemButton href={'/' + text.toLowerCase()}>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          <ListSubheader>DM Links</ListSubheader>
          {DMInfoMenu.map((text) => (
            <ListItem key={text} disablePadding>
              <ListItemButton href={'/' + text.toLowerCase()}>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </>
    )
  }

  const DesktopMenu = () => {
    return (
      <>
        <Toolbar />
        <Stack direction='row'>
          <Button href='/' color='inherit'>Home</Button>
          <Button onClick={() => setOpen('General')} color='inherit'>General Links</Button>
          <Button onClick={() => setOpen('Player')} color='inherit'>Player Links</Button>
          <Button onClick={() => setOpen('DM')} color='inherit'>DM Links</Button>
        </Stack>
      </>
    )
  }

  return (
    <Box paddingLeft={5} paddingRight={5}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' }}}>
            <IconButton onClick={(event) => setOpenSmall(true)} size='large' color='inherit'><MenuIcon /></IconButton>
            <Drawer open={openSmall} onClose={() => setOpenSmall(false)}>
              <Box sx={{ width: 250 }} role="presentation" onClick={() => setOpenSmall(false)}><Menus /></Box>
            </Drawer>
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }}}>
            <DesktopMenu />
            {open === 'General' ?
              <>
                <Drawer open={open} onClose={() => setOpen(false)}>
                  <Toolbar />
                  <Box sx={{ width: 250 }} role="presentation" onClick={() => setOpen(false)}>
                    <List>
                      <ListSubheader>General Links</ListSubheader>
                      <Divider />
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
                      <ListSubheader>Object Links</ListSubheader>
                      {objectMenu.map((text) => (
                        <ListItem key={text} disablePadding>
                          <ListItemButton href={'/' + text.toLowerCase()}>
                            <ListItemText primary={text} />
                          </ListItemButton>
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                </Drawer>
              </>
            :
              ""
            }
            {open === 'Player' ?
              <>
                <Drawer open={open} onClose={() => setOpen(false)}>
                  <Toolbar />
                  <Box sx={{ width: 250 }} role="presentation" onClick={() => setOpen(false)}>
                    <List>
                      <ListSubheader>Player Links</ListSubheader>
                      <Divider />
                      {playerInfoMenu.map((text) => (
                        <ListItem key={text} disablePadding>
                          <ListItemButton href={'/' + text.toLowerCase()}>
                            <ListItemText primary={text} />
                          </ListItemButton>
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                </Drawer>
              </>
            :
              ""
            }
            {open === 'DM' ?
              <>
                <Drawer open={open} onClose={() => setOpen(false)}>
                  <Toolbar />
                  <Box sx={{ width: 250 }} role="presentation" onClick={() => setOpen(false)}>
                    <List>
                      <ListSubheader>DM Links</ListSubheader>
                      <Divider />
                      {DMInfoMenu.map((text) => (
                        <ListItem key={text} disablePadding>
                          <ListItemButton href={'/' + text.toLowerCase()}>
                            <ListItemText primary={text} />
                          </ListItemButton>
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                </Drawer>
              </>
            :
              ""
            }
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  )
}