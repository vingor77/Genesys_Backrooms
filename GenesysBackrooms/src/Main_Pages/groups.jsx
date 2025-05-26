import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
  Chip,
  IconButton,
  Collapse,
  Badge,
  Fab,
  Snackbar,
  Alert,
  alpha,
  useTheme,
  InputAdornment
} from '@mui/material';
import {
  Search,
  FilterList,
  Clear,
  Add,
  Group,
  ExpandMore,
  ExpandLess,
  Tune,
  Groups as GroupsIcon,
  Business
} from '@mui/icons-material';
import { collection, doc, onSnapshot, query, setDoc } from "firebase/firestore";
import db from '../Components/firebase';
import GroupItem from "../Components/groupItem";
import NotLoggedIn from "../Components/notLoggedIn";

export default function Groups() {
  const [groups, setGroups] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const [filtersOpen, setFiltersOpen] = useState(false);
  
  const theme = useTheme();
  const data = [];

  const showToast = (message, severity = 'success') => {
    setToast({ open: true, message, severity });
  };

  const hideToast = (event, reason) => {
    if (reason === 'clickaway') return;
    setToast({ ...toast, open: false });
  };

  const addData = async () => {
    try {
      for(let i = 0; i < data.length; i++) {
        await setDoc(doc(db, 'Groups', data[i].name), {
          name: data[i].name,
          primaryGoal: data[i].primaryGoal,
          subGroups: data[i].subGroups,
          relations: data[i].relations,
          link: data[i].link,
          outposts: data[i].outposts
        });
      }
      showToast('Group data added successfully!');
    } catch (error) {
      showToast('Error adding group data', 'error');
      console.error(error);
    }
  };

  const getFromDB = () => {
    const q = query(collection(db, 'Groups'));
    const unsub = onSnapshot(q, (querySnapshot) => {
      const queryData = [];
      querySnapshot.forEach((doc) => {
        queryData.push(doc.data());
      });
      setGroups(queryData);
      setLoading(false);
    });

    return () => { unsub(); };
  };

  const filteredGroups = groups.filter(group => 
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (group.primaryGoal && group.primaryGoal.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const clearSearch = () => {
    setSearchTerm('');
    showToast('Search cleared');
  };

  const getActiveFilterCount = () => {
    return searchTerm !== '' ? 1 : 0;
  };

  useEffect(() => {
    if (groups.length === 0) {
      getFromDB();
    }
  }, []);

  if (localStorage.getItem("loggedIn") === 'false') {
    return <NotLoggedIn />;
  }

  const DisplayItems = () => {
    if (filteredGroups.length === 0) {
      return (
        <Paper 
          elevation={2} 
          sx={{ 
            p: 4, 
            textAlign: 'center', 
            borderRadius: 3,
            bgcolor: alpha(theme.palette.info.main, 0.05),
            border: `1px dashed ${alpha(theme.palette.info.main, 0.3)}`
          }}
        >
          <GroupsIcon sx={{ fontSize: 60, color: 'grey.300', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {searchTerm ? 'No groups match your search' : 'No groups found'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {searchTerm ? 'Try adjusting your search term' : 'Groups will appear here when available'}
          </Typography>
        </Paper>
      );
    }

    return (
      <Box>
        <Typography variant="h6" gutterBottom sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Business color="primary" />
          Found {filteredGroups.length} group{filteredGroups.length !== 1 ? 's' : ''}
        </Typography>
        <Stack direction="row" flexWrap="wrap" gap={2}>
          {filteredGroups.map((item, index) => (
            <GroupItem key={index} currGroup={item} />
          ))}
        </Stack>
      </Box>
    );
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50', mr: 'auto', ml: 'auto', py: 4 }} maxWidth={{sm: "100%", md: '75%'}}>
      {/* Header */}
      <Paper 
        elevation={3} 
        sx={{ 
          mb: 4, 
          borderRadius: 3, 
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white'
        }}
      >
        <Box sx={{ 
          background: 'linear-gradient(135deg, #9C27B0 0%, #E91E63 100%)',
          color: 'white',
          p: { xs: 2, sm: 3 }
        }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
            <Box>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                Group Directory
              </Typography>
              <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                Explore organizations and factions
              </Typography>
            </Box>
            {localStorage.getItem('loggedIn')?.toUpperCase() === 'ADMIN' && (
              <Button 
                onClick={addData}
                variant="contained"
                startIcon={<Add />}
                sx={{ 
                  bgcolor: 'rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.3)'
                  }
                }}
              >
                Add Data
              </Button>
            )}
          </Box>
        </Box>
      </Paper>

      <Box sx={{ px: { xs: 1, sm: 2, md: 3 }, pb: 3 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
            <Typography variant="h6" color="text.secondary">
              Loading groups...
            </Typography>
          </Box>
        ) : groups.length > 0 ? (
          <Box>
            {/* Search and Filter Section */}
            <Card elevation={3} sx={{ borderRadius: 3, mb: 3 }}>
              <CardHeader
                title={
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box display="flex" alignItems="center" gap={2}>
                      <Tune color="primary" />
                      <Typography variant="h6" fontWeight="bold">
                        Search & Filter
                      </Typography>
                      {getActiveFilterCount() > 0 && (
                        <Chip 
                          label={`${getActiveFilterCount()} active`} 
                          color="primary" 
                          size="small"
                        />
                      )}
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Chip 
                        label={`${filteredGroups.length} groups`} 
                        color="success" 
                        variant="outlined"
                        size="small"
                      />
                      <IconButton 
                        onClick={() => setFiltersOpen(!filtersOpen)}
                        sx={{ 
                          display: { xs: 'flex', md: 'none' },
                          bgcolor: alpha(theme.palette.primary.main, 0.1)
                        }}
                      >
                        <Badge badgeContent={getActiveFilterCount()} color="error">
                          {filtersOpen ? <ExpandLess /> : <ExpandMore />}
                        </Badge>
                      </IconButton>
                    </Box>
                  </Box>
                }
                sx={{ pb: 1 }}
              />
              <CardContent>
                {/* Search Bar - Always Visible */}
                <Box sx={{ mb: 2 }}>
                  <TextField
                    fullWidth
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search groups by name or goal..."
                    variant="outlined"
                    InputProps={{
                      startAdornment: <Search sx={{ mr: 1, color: 'action.active' }} />,
                      endAdornment: searchTerm && (
                        <IconButton size="small" onClick={clearSearch}>
                          <Clear />
                        </IconButton>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.1)}`
                        },
                        '&.Mui-focused': {
                          boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`
                        }
                      }
                    }}
                  />
                </Box>

                {/* Mobile Collapsible Filter Info */}
                <Collapse in={filtersOpen} sx={{ display: { xs: 'block', md: 'none' } }}>
                  <Box sx={{ p: 2, bgcolor: alpha(theme.palette.info.main, 0.05), borderRadius: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Search filters organizations by name or primary goal. More advanced filtering options coming soon!
                    </Typography>
                    {searchTerm && (
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          Active Search:
                        </Typography>
                        <Chip
                          label={`"${searchTerm}"`}
                          onDelete={clearSearch}
                          color="primary"
                          variant="outlined"
                          size="small"
                        />
                      </Box>
                    )}
                  </Box>
                </Collapse>

                {/* Desktop Filter Info */}
                <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2" color="text.secondary">
                      Search through {groups.length} organizations and factions
                    </Typography>
                    {searchTerm && (
                      <Button
                        size="small"
                        onClick={clearSearch}
                        startIcon={<Clear />}
                      >
                        Clear Search
                      </Button>
                    )}
                  </Box>
                  {searchTerm && (
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Active Search:
                      </Typography>
                      <Chip
                        label={`"${searchTerm}"`}
                        onDelete={clearSearch}
                        color="primary"
                        variant="outlined"
                        size="small"
                      />
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>

            {/* Results */}
            <DisplayItems />
          </Box>
        ) : (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
            <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No groups available
              </Typography>
              {localStorage.getItem('loggedIn')?.toUpperCase() === 'ADMIN' && (
                <Button variant="contained" onClick={addData} size="large" startIcon={<Add />}>
                  Add Groups Now
                </Button>
              )}
            </Paper>
          </Box>
        )}
      </Box>

      {/* Mobile Filter Fab */}
      <Fab
        color="primary"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          display: { xs: 'flex', md: 'none' }
        }}
        onClick={() => setFiltersOpen(!filtersOpen)}
      >
        <Badge badgeContent={getActiveFilterCount()} color="error">
          <FilterList />
        </Badge>
      </Fab>

      {/* Toast Notifications */}
      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={hideToast}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={hideToast}
          severity={toast.severity}
          variant="filled"
          sx={{ width: '100%', borderRadius: 2 }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

/*
Followers of Jerry:
  The Object Jerry's Feather (Custom Object) upgrades when certain quests are done.

Visionaries of Berry:
  The Object Berry's Necklace (Custom Object) upgrades when certain quests are done.

Backrooms Remodeling Company:
  The Object Reality Fresheners (Object 32) are given out or left behind by specifically this group.

  [{"name":"Backrooms Robotics","description":"The Backrooms Robotics is a technologically advanced group of individuals who strive to create and distribute mechanical and technological items throughout the Backrooms.","purpose":"The surface purpose of Backrooms Robotics is to spread helpful devices to the people of the Backrooms. The hidden agenda however, is much more nefarious. Backrooms Robotics rig all of thier devices to track everything possible about a person using thier product. Thier true goal is to use this information to feed into an all-encompassing AI to wipe out not just the Backrooms but also the Frontrooms.","relations":"BNTG:3/EOA:2/INF:3/FOJ:3/KGI:3/MEG:2/MM:3/UEC:3/BBAR:3/BTA:3/CBS:3/CPS:3/IMBH:3/VOB:3","subGroups":"None","shortName":"BSR"},
    {"name":"The Backrooms Non-Aligned Trade Group","description":"The BNTG is a large group originally created by the MEG but has since become independant.","purpose":"The purpose of the BNTG is to trade with all wanderers regardless of group affiliation and personal beliefs.","relations":"BSR:3/EOA:2/INF:3/FOJ:3/KGI:3/MEG:5/MM:3/UEC:3/BBAR:3/BTA:3/CBS:3/CPS:3/IMBH:3/VOB:3","subGroups":"None","shortName":"BNTG"},
    {"name":"The Eyes of Argos","description":"The Eyes of Argos is a group run by Argos, an avatar, who judge people based on some scale unknown to any not within the group.","purpose":"The purpose of the Eyes of Argos is to punish the evildoers, or at least those evil in the eyes of the Argos religion.","relations":"BSR:2/BNTG:3/INF:1/FOJ:2/KGI:3/MEG:3/MM:3/UEC:1/BBAR:3/BTA:3/CBS:3/CPS:3/IMBH:3/VOB:2","subGroups":"Inquisitors of Truth: The personal guard of Argos. The Inquisitors of Truth are brutal and will kill criminals on sight. They are strict though and will never kill a person other than thier target./Justice Seekers: The prosecuters. The Justice Seekers track, catch, and prosecute criminals in the fairest way possible./Law Keepers: The librarians and historians of the Eyes of Argos. They keep records of all forms of justice, religious or righteous, with pen and paper and discuss what kind of justice is more correct./Sin Hunters: The bounty hunters. The Sin Hunters are similar to the Inquisitors of Truth except they imprison rather than kill. Only should the Sin Hunters fail does the Inquisitors of Truth engage./Sentinels of the Watch: The protectors of the outposts owned by the Eyes of Argos.","shortName":"EOA"},
    {"name":"The Iron Fist","description":"The Iron Fist is a fiery group of people who feels betrayed by the gods of the realm.","purpose":"The purpose of the Iron Fist is to slaughter all gods, benevolent or evil, and to eradicate all worship within the Backrooms.","relations":"BSR:3/BNTG:3/EOA:1/FOJ:1/KGI:3/MEG:2/MM:3/UEC:5/BBAR:3/BTA:3/CBS:3/CPS:2/IMBH:3/VOB:1","subGroups":"Mars: The soldiers. Mars is the section of the Iron Fist that does the actual fighting with these gods./Jupiter: The intelligence. Jupiter gathers as much information on the targets through espionage or by research./Saturn: The conductors. Saturn is comprised of only the leaders of every of sub group and is the conductors of all operations./Sol: The creators. Sol creates all of the tools and weapons utilized by the rest of the group./Mercury: The assassins. Mercury silently infiltrates a targets domain to slay it when direct confrontation becomes ill-advised.","shortName":"INF"},
    {"name":"The Followers of Jerry","description":"The Followers of Jerry is a mindless flock of worshipers catering to Jerry, a blue macaw parrot.","purpose":"The purpose of the Followers of Jerry is to cater to every need Jerry has. It appears to be almost involuntary.","relations":"BSR:3/BNTG:3/EOA:2/INF:1/KGI:3/MEG:3/MM:3/UEC:1/BBAR:3/BTA:3/CBS:3/CPS:3/IMBH:3/VOB:1","subGroups":"None","shortName":"FOJ"},
    {"name":"The Kalag Institute","description":"The Kalag Institute is an institute that archives and records information about every human death within the Backrooms.","purpose":"The purpose of The Kalag Institute is to document all deaths with a date, time, and cause in order to help those in need of closure.","relations":"BSR:3/BNTG:3/EOA:3/INF:3/FOJ:3/MEG:3/MM:3/UEC:3/BBAR:3/BTA:3/CBS:3/CPS:3/IMBH:3/VOB:3","subGroups":"None","shortName":"KGI"},
    {"name":"The Major Explorer Group","description":"The Major Explorer Group is a group made by the general people of the Backrooms who wanted to be safe from the dangers.","purpose":"The surface purpose of The Major Explorer Group is to keep all wanderers safe from entities, traps, and other groups. The hidden agenda is to use the people of the Backrooms to experiment and learn about it. This information is being pumped directly to some militaries and scientists to learn how to utilize it for war.","relations":"BSR:2/BNTG:5/EOA:3/INF:2/FOJ:3/KGI:3/MM:1/UEC:1/BBAR:3/BTA:3/CBS:1/CPS:2/IMBH:3/VOB:3","subGroups":"Overseer: The leaders of the MEG. The Overseers are in charge of all other sub groups./Compass Point: The unknown explorers. Compass Point travels into levels and areas that have never been documented or known. The goal is to find any and all entraces and exits and the type of things that inhabit the area or level./Wild Warriors: The entity removal specialists. The Wild Warriors actively eliminate entities through combat. This may be done in tandem with Compass Point or at an outpost to relieve entity tension./Quick Match: The rescue team. Quick Match is sent in to rescue people who have become lost, stranded, or otherwise held captive by an entity./Track Mappers: The mappers. The Track Mappers take the data from Compass Point and create maps and paths of least resistance from entrance to exit./First Response: The communications experts. First Response coordinates these teams during missions to ensure all remain aware of the situation.","shortName":"MEG"},
    {"name":"The Masked Maidens","description":"The Masked Maidens are people who have begun to wear an object called a Wall Mask and feels like the MEG has done them wrong.","purpose":"The purpose of the Masked Maidens is to shut down the MEG. They actively place people on the inside to learn the structure of the MEG and plan for an all-out elimination event.","relations":"BSR:3/BNTG:3/EOA:3/INF:3/FOJ:3/KGI:3/MEG:1/UEC:4/BBAR:3/BTA:3/CBS:4/CPS:3/IMBH:3/VOB:3","subGroups":"Colombina: The leaders of the Masked Maidens. The Colombina has the final say on all actions to be made and is the only sub group to actively monitor outside of Maiden outposts./Bauta: The interrogators. The Bauta gain intelligence through private interrogation and sometimes torture./Pantalone: The informants. The Pantalone use all information gather from the other sub groups to form a coherent image of a person or thing./Volto: The illusionists. The Volto go into heavily populated areas and spread rumors about the Masked Maidens to muddle the truth the Masked Maidens do not want revealed./Kitsune: The impersonators. The Kitsune use the information from the Pantalone to infiltrate personal lives and act as a loved one to gain further information./Arlecchino: The distractions. The Arlecchino generally work with other sub groups in order to distract people who are not targets and lure them away from the site./Buskin: The Hunters. The Buskin hunt down and kill people who knew too much about the masks without the leader's permission./Oni: The Judge. The Oni decides whether or not a person gets to live based on thier past and any current actions after being interrogated by the Bauta./Sock: The brutes. The Sock is known to be unwieldy and violent due to thier lack of self awareness. This sub group is usually taken on dangerous missions only due to the risk they pose.","shortName":"MM"},
    {"name":"The Unbound Explorers Coalition","description":"The Unbound Explorers Coalition is a group of people who put the safety of the people first, regardless of anything else.","purpose":"The purpose of the Unbound Explorers Coalition is to overwrite what the MEG has done and give safehavens to the people of the Backrooms.","relations":"BSR:3/BNTG:3/EOA:1/INF:5/FOJ:1/KGI:3/MEG:1/MM:4/BBAR:3/BTA:3/CBS:3/CPS:3/IMBH:3/VOB:3","subGroups":"The Hands of Athena: The leaders. The Hands of Athena control all other sub groups and specifically hand-pick the media other members may see and hear about./The Partisans of Arete: The soldiers. The Partisans of Arete use violence and war as a means to expand the Unbound Explorers Coalition, killing any who dare retaliate./The Homeland Defense Force: The protectors. The Homeland Defense Force stands proudly at Unbound Explorers Coalition outposts to protect the members./The Servants of Ponos: The scavengers. The Servants of Ponos scour the levels for valuable resources.","shortName":"UEC"},
    {"name":"Backrooms Bureau of Administration and Research","description":"The Backrooms Bureau of Administration and Research is a governmentalist and federal orginization formed by formed feds, bureaucrats, and politicians.","purpose":"The purpose of the Backrooms Bureau of Administration and Research is to bring law and order to the Backrooms through diplomatic and politcal means. The secondary purpose is to research all things Backrooms","relations":"BSR:3/BNTG:3/EOA:3/INF:3/FOJ:3/KGI:3/MEG:3/MM:3/UEC:3/BTA:3/CBS:3/CPS:3/IMBH:3/VOB:3","subGroups":"Office Branch: The office workers. The Office Branch does all of the documentation, law writing, external affairs, and general administration./Ethical Committee: The judges and congress. The Ethical Committee helps the Office Branch sometimes but usually instead takes the laws written by the Office Branch and votes whether or not it should be passed. At the same time, this sub group acts as the judge, evaluating the violations of passed laws and determining the punishments required. The total member count is always 16./Field Agent Branch: The investigators. The Field Agent Branch is split into three sections with each having a different purpose. A team of 6-10 people are assigned to a section as needed. One section researches and studies objects, levels, and sometimes entities. Another section explores levels, usually newer or unknown levels, and documents everything there is to know about it. The final section investigates any potential threats to the general public./The Dark Pheonix Company: The military. The Dark Pheonix Company is a group of soldiers who, in exchange for resources, carry out potentially combat-heavy jobs for other groups and sometimes individuals. They also protect the BBAR if neccessary.","shortName":"BBAR"},
    {"name":"The Backrooms Travel Agency","description":"The Backrooms Travel Agency is a dedicated group of people offering services to people for travel.","purpose":"The purpose of the Backrooms Travel Agency is to safely and securely escort all paying customers to thier destinations.","relations":"BSR:3/BNTG:3/EOA:3/INF:3/FOJ:3/KGI:3/MEG:3/MM:3/UEC:3/BBAR:3/CBS:3/CPS:3/IMBH:3/VOB:3","subGroups":"None","shortName":"BTA"},
    {"name":"Coalition of Backrooms Survivors","description":"The Coalition of Backrooms Survivors is a union assembled from several Backrooms groups comprised of engineers, scientists, and other experts in the STEM field.","purpose":"The purpose of the Coalition of Backrooms Survivors is to escape from the Backrooms.","relations":"BSR:3/BNTG:3/EOA:3/INF:3/FOJ:3/KGI:3/MEG:1/MM:4/UEC:3/BBAR:3/BTA:3/CPS:3/IMBH:3/VOB:3","subGroups":"Bullet Dodgers: The bodygaurds. The Bullet Dodgers act as escorts and bodyguards for non-combat members. This sub group wears Kitsune masks./Theatergoers: The survey team. The Theatergoers investigate the levels that have been found and entered by means of Level Keys. This sub group wears Oni masks./Cleaners: The soldiers. The Cleaners clear out areas from entities and other people whenever the CBS requires peace and quiet in a certain location. This sub group wears Comedy and Tragedy masks./Designers: The artisans. The Designers are responsible for gathering materials and crafting them into weaponry, inventing machines, and fixing broken machinery./Archivists: The office workers. The Archivists gather and organize the data and instruct other sub groups in order to allow flawless coordination./Scientific Department: The Scientists. The Scientific Department researches almost exclusively entities, both alive and dead./Animal Trainers: The Animal Trainers are responsible for finding a way to harvest and use entities for the good of humanity. This includes studying them, dissecting them, and altering the blood and cells within the entity (if it has any).","shortName":"CBS"},
    {"name":"The Completionists","description":"The Completionists is a group of lunatics who worship an entity who goes by the name Tgochi.exe, also known as entity 106. ","purpose":"The purpose of the Completionists is to complete every achievement that Tgochi.exe has given out, as they believe it to be an exit from the Backrooms.","relations":"BSR:3/BNTG:3/EOA:3/INF:2/FOJ:3/KGI:3/MEG:2/MM:3/UEC:3/BBAR:3/BTA:3/CBS:3/IMBH:3/VOB:3","subGroups":"None","shortName":"CPS"},
    {"name":"The Interdimensional Museum of Backrooms History","description":"The Interdimensional Museum of Backrooms History is a group of enthusiastic people who want to share the history and knowledge of the Backrooms with all who seek it.","purpose":"The purpose of the Interdimensional Museum of Backrooms History is to help people understand the world around them more and help them rest easy.","relations":"BSR:3/BNTG:3/EOA:3/INF:3/FOJ:3/KGI:3/MEG:3/MM:3/UEC:3/BBAR:3/BTA:3/CBS:3/CPS:3/VOB:3","subGroups":"Records and Cataloging: This sub group gathers and stores digital and physical references and data about the history of the Backrooms and how it all came to be./Biology and Anthropology: This sub group stores information about entities, creatures, and cultrures from within the Backrooms. Sometimes this group can be seen doing field research with other groups./Archeology: This sub group gathers and stores historical objects found within levels and catalogs everything about it, theorizing how it could have been made and how its been placed there. This group can also sometimes be found on field missions./Public Relations: This sub group handles all communication between the other sub groups, other groups, and the general public from within the Museum. Whenever a guest has a question or needs to speak with staff, this is the group that responds first.","shortName":"IMBH"},
    {"name":"The Visionaries of Berry","description":"The Visionaries of Berry is a group of dedicated worshippers to the entity Berry, a black cat. ","purpose":"The purpose of the Visionaries of Berry is to analyze the false prophecies of the entity known as Berry. They believe this entity can bring them the truth about existence itself and how to overcome it.","relations":"BSR:3/BNTG:3/EOA:2/INF:1/FOJ:1/KGI:3/MEG:3/MM:3/UEC:3/BBAR:3/BTA:3/CBS:3/CPS:3/IMBH:3","subGroups":"None","shortName":"VOB"}]
*/