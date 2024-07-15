import { useState } from 'react'
import { AppBar, Stack, Toolbar, Button, Box, IconButton, Divider, Drawer, List, ListItem, ListItemButton, ListItemText, ListSubheader } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

export default function Navbar() {
  const [open, setOpen] = useState<boolean | string>('');
  const [openSmall, setOpenSmall] = useState<boolean>(false);
  const generalInfoMenu: (string)[] = ['Avatars', 'Crafting', 'GearSets', 'Gods', 'Groups', 'Objects', 'Quests'];
  const playerInfoMenu: (string)[] = ['Information', 'Functions'];
  const DMInfoMenu: (string)[] = ['Entities', 'Levels', 'Outposts', 'Updates'];


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
            <IconButton onClick={() => setOpenSmall(true)} size='large' color='inherit'><MenuIcon /></IconButton>
            <Drawer open={!!openSmall} onClose={() => setOpenSmall(false)}>
              <Box sx={{ width: 250 }} role="presentation" onClick={() => setOpenSmall(false)}><Menus /></Box>
            </Drawer>
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }}}>
            <DesktopMenu />
            {open === 'General' ?
              <>
                <Drawer open={!!open} onClose={() => setOpen(false)}>
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
                  </Box>
                </Drawer>
              </>
            :
              ""
            }
            {open === 'Player' ?
              <>
                <Drawer open={!!open} onClose={() => setOpen(false)}>
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
                <Drawer open={!!open} onClose={() => setOpen(false)}>
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