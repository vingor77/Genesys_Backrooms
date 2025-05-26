import React, { useState, useEffect, useMemo } from 'react';
import { Box,Button,Card,CardContent,CardHeader,Divider,Grid,Paper,Stack,Typography,Chip,Snackbar,Alert,alpha,useTheme,FormControl,InputLabel,Select,MenuItem,TextField,InputAdornment } from "@mui/material";
import { Add,LocationOn,Group,Search,Public,Assignment,Home,Tune } from '@mui/icons-material';
import { collection, doc, onSnapshot, orderBy, query, setDoc } from "firebase/firestore";
import db from '../Components/firebase';
import QuestItem from '../Components/questItem';
import NotLoggedIn from "../Components/notLoggedIn";

export default function Outposts() {
  const [outposts, setOutposts] = useState([]);
  const [quests, setQuests] = useState([]);
  const [selectedOutpost, setSelectedOutpost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [questsLoading, setQuestsLoading] = useState(true);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const [searchTerm, setSearchTerm] = useState('');
  const [groupFilter, setGroupFilter] = useState('');
  const [levelFilter, setLevelFilter] = useState('');

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
        await setDoc(doc(db, 'Outposts', data[i].name), {
          name: data[i].name,
          description: data[i].description,
          level: data[i].level,
          group: data[i].group,
          amenities: data[i].amenities
        });
      }
      showToast('Outpost data added successfully!');
    } catch (error) {
      showToast('Error adding outpost data', 'error');
      console.error(error);
    }
  };

  const getFromDB = () => {
    const q = query(collection(db, 'Outposts'), orderBy("level", "asc"));
    const unsub = onSnapshot(q, (querySnapshot) => {
      const queryData = [];
      querySnapshot.forEach((doc) => {
        queryData.push(doc.data());
      });
      setOutposts(queryData);
      setLoading(false);
      // Auto-select first outpost if none selected
      if (queryData.length > 0 && !selectedOutpost) {
        setSelectedOutpost(queryData[0]);
      }
    });

    return () => { unsub(); };
  };

  const getQuests = () => {
    const q = query(collection(db, 'Quests'));
    const unsub = onSnapshot(q, (querySnapshot) => {
      const queryData = [];
      querySnapshot.forEach((doc) => {
        queryData.push(doc.data());
      });
      setQuests(queryData);
      setQuestsLoading(false);
    });

    return () => { unsub(); };
  };

  const getUniqueGroups = () => {
    const groups = [...new Set(outposts.map(outpost => outpost.group).filter(Boolean))];
    return groups.sort();
  };

  const getUniqueLevels = () => {
    const levels = [...new Set(outposts.map(outpost => outpost.level).filter(level => level !== undefined))];
    return levels.sort((a, b) => a - b);
  };

  const getFilteredOutposts = () => {
    return outposts.filter(outpost => {
      const matchesSearch = !searchTerm || 
        outpost.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (outpost.description && outpost.description.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesGroup = !groupFilter || outpost.group === groupFilter;
      const matchesLevel = !levelFilter || outpost.level === parseInt(levelFilter);
      
      return matchesSearch && matchesGroup && matchesLevel;
    });
  };

  const getRelevantQuests = (outpostName) => {
    return quests.filter(quest => 
      quest.acquisition === outpostName || quest.turnInLocation === outpostName
    );
  };

  const OutpostDetails = () => {
    if (!selectedOutpost) {
      return (
        <Paper 
          elevation={2} 
          sx={{ 
            p: 4, 
            textAlign: 'center', 
            borderRadius: 3,
            bgcolor: alpha(theme.palette.info.main, 0.05),
            border: `1px dashed ${alpha(theme.palette.info.main, 0.3)}`,
            minHeight: 400
          }}
        >
          <Home sx={{ fontSize: 60, color: 'grey.300', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Select an outpost
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Choose an outpost from the table to view its details
          </Typography>
        </Paper>
      );
    }

    const relevantQuests = getRelevantQuests(selectedOutpost.name);

    return (
      <Card elevation={3} sx={{ borderRadius: 3, minHeight: 400 }}>
        <CardHeader
          title={
            <Box display="flex" alignItems="center" gap={2}>
              <LocationOn color="primary" />
              <Typography variant="h5" fontWeight="bold">
                {selectedOutpost.name}
              </Typography>
              <Chip 
                label={`Level ${selectedOutpost.level}`} 
                color="primary" 
                size="small"
              />
              {selectedOutpost.group && (
                <Chip 
                  label={selectedOutpost.group} 
                  color="secondary" 
                  size="small"
                  icon={<Group />}
                />
              )}
            </Box>
          }
          sx={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            '& .MuiChip-root': {
              color: 'white',
              bgcolor: 'rgba(255,255,255,0.2)',
              '& .MuiChip-icon': {
                color: 'white'
              }
            },
            '& .MuiSvgIcon-root': {
              color: 'white'
            }
          }}
        />
        <CardContent sx={{ p: 3 }}>
          {/* Description Section */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Public color="primary" />
              Description
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {selectedOutpost.description || 'No description available'}
            </Typography>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Amenities Section */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Home color="primary" />
              Amenities
            </Typography>
            {selectedOutpost.amenities && selectedOutpost.amenities.length > 0 ? (
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {selectedOutpost.amenities.map((amenity, index) => (
                  <Chip 
                    key={index} 
                    label={amenity} 
                    variant="outlined" 
                    color="primary"
                  />
                ))}
              </Stack>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No amenities listed (may need to be crafted manually)
              </Typography>
            )}
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Relevant Quests Section */}
          <Box>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Assignment color="primary" />
              Relevant Quests ({relevantQuests.length})
            </Typography>
            {questsLoading ? (
              <Typography variant="body2" color="text.secondary">
                Loading quests...
              </Typography>
            ) : relevantQuests.length > 0 ? (
              <Stack direction="row" flexWrap="wrap" gap={2}>
                {relevantQuests.map((quest, index) => (
                  <QuestItem key={index} currQuest={quest} />
                ))}
              </Stack>
            ) : (
              <Paper 
                elevation={1} 
                sx={{ 
                  p: 2, 
                  textAlign: 'center', 
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.grey[500], 0.05)
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  No quests available for this outpost
                </Typography>
              </Paper>
            )}
          </Box>
        </CardContent>
      </Card>
    );
  };

  const OutpostGrid = () => {
    const filteredOutposts = getFilteredOutposts();

    return (
      <Card elevation={3} sx={{ borderRadius: 3 }}>
        <CardHeader
          title={
            <Box display="flex" alignItems="center" gap={2}>
              <Tune color="primary" />
              <Typography variant="h6" fontWeight="bold">
                Outpost Directory
              </Typography>
              <Chip 
                label={`${filteredOutposts.length} outposts`} 
                color="success" 
                variant="outlined"
                size="small"
              />
            </Box>
          }
        />
        <CardContent>
          {/* Filters */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search outposts..."
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Group</InputLabel>
                <Select
                  value={groupFilter}
                  onChange={(e) => setGroupFilter(e.target.value)}
                  label="Group"
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="">All Groups</MenuItem>
                  {getUniqueGroups().map(group => (
                    <MenuItem key={group} value={group}>{group}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Level</InputLabel>
                <Select
                  value={levelFilter}
                  onChange={(e) => setLevelFilter(e.target.value)}
                  label="Level"
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="">All Levels</MenuItem>
                  {getUniqueLevels().map(level => (
                    <MenuItem key={level} value={level}>{level}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {/* Outpost Cards Grid */}
          <Box sx={{ maxHeight: 600, overflow: 'auto', pr: 1 }}>
            {filteredOutposts.length === 0 ? (
              <Paper 
                elevation={1} 
                sx={{ 
                  p: 4, 
                  textAlign: 'center', 
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.info.main, 0.05),
                  border: `1px dashed ${alpha(theme.palette.info.main, 0.3)}`
                }}
              >
                <Search sx={{ fontSize: 40, color: 'grey.300', mb: 1 }} />
                <Typography variant="body1" color="text.secondary">
                  No outposts match your search criteria
                </Typography>
              </Paper>
            ) : (
              <Grid container spacing={2}>
                {filteredOutposts.map((outpost, index) => (
                  <Grid item xs={12} key={index}>
                    <Card
                      elevation={selectedOutpost?.name === outpost.name ? 4 : 1}
                      sx={{
                        borderRadius: 2,
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        border: selectedOutpost?.name === outpost.name 
                          ? `2px solid ${theme.palette.primary.main}` 
                          : '2px solid transparent',
                        background: selectedOutpost?.name === outpost.name
                          ? `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`
                          : 'white',
                        '&:hover': {
                          elevation: 3,
                          transform: 'translateY(-2px)',
                          boxShadow: theme.shadows[4],
                          borderColor: alpha(theme.palette.primary.main, 0.5)
                        }
                      }}
                      onClick={() => setSelectedOutpost(outpost)}
                    >
                      <CardContent sx={{ p: 2 }}>
                        <Box display="flex" alignItems="center" justifyContent="space-between">
                          <Box display="flex" alignItems="center" gap={2}>
                            <Box
                              sx={{
                                width: 40,
                                height: 40,
                                borderRadius: 2,
                                background: selectedOutpost?.name === outpost.name
                                  ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                                  : `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                            >
                              <LocationOn 
                                sx={{ 
                                  color: selectedOutpost?.name === outpost.name 
                                    ? 'white' 
                                    : theme.palette.primary.main,
                                  fontSize: 20
                                }} 
                              />
                            </Box>
                            <Box>
                              <Typography 
                                variant="h6" 
                                sx={{ 
                                  fontWeight: selectedOutpost?.name === outpost.name ? 'bold' : 'medium',
                                  color: selectedOutpost?.name === outpost.name ? 'primary.main' : 'text.primary'
                                }}
                              >
                                {outpost.name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {outpost.description ? 
                                  `${outpost.description.substring(0, 60)}${outpost.description.length > 60 ? '...' : ''}` 
                                  : 'No description available'
                                }
                              </Typography>
                            </Box>
                          </Box>
                          <Box display="flex" flexDirection="column" alignItems="end" gap={1}>
                            <Chip 
                              label={`Level ${outpost.level}`} 
                              color={selectedOutpost?.name === outpost.name ? "primary" : "default"}
                              size="small" 
                              variant={selectedOutpost?.name === outpost.name ? "filled" : "outlined"}
                            />
                            {outpost.group && (
                              <Chip 
                                label={outpost.group} 
                                color="secondary" 
                                size="small"
                                variant="outlined"
                                icon={<Group sx={{ fontSize: 14 }} />}
                              />
                            )}
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        </CardContent>
      </Card>
    );
  };

  useEffect(() => {
    if (localStorage.getItem("loggedIn") !== 'false') {
      getFromDB();
      getQuests();
    }
  }, []);

  if (localStorage.getItem("loggedIn") === 'false') {
    return <NotLoggedIn />;
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50', py: 4 }}>
      {/* Header */}
      <Paper 
        elevation={3} 
        sx={{ 
          mb: 4, 
          mx: 3,
          borderRadius: 3, 
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white'
        }}
      >
        <Box sx={{ 
          p: { xs: 2, sm: 3 }
        }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
            <Box>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                Outpost Directory
              </Typography>
              <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                Explore and manage outpost locations and their details
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

      <Box sx={{ px: 3, pb: 3 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
            <Typography variant="h6" color="text.secondary">
              Loading outpost directory...
            </Typography>
          </Box>
        ) : outposts.length > 0 ? (
          <Grid container spacing={3}>
            {/* Outpost Grid */}
            <Grid item xs={12} lg={6}>
              <OutpostGrid />
            </Grid>
            
            {/* Outpost Details */}
            <Grid item xs={12} lg={6}>
              <OutpostDetails />
            </Grid>
          </Grid>
        ) : (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
            <Typography variant="h6" color="text.secondary">
              No outpost data available
            </Typography>
          </Box>
        )}
      </Box>

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
  Major Explorer Group:
    Beta (Level 11) holds the Ouija Board (Object 31).
    Beta (Level 11) has Agrugua Fruit (Object 85) traders.
    Beta (Level 11) has The Everything Machine (Object 97) in it.
    Aries Station (Level 158) has Agrugua Fruit (Object 85) traders.
    Pisces Station (Level 158) has Agrugua Fruit (Object 85) traders.
    Omega (Level 4) has the Object Way-Back Machine (Object 22) in it.
    Epsilon (Level 283) has the Object Tarot Deck (Object 43).

  Backrooms Robotics:
    A1 (Level 271) holds the Reality Lag Machine (Object 86).
    A1 (Level 271) holds the Objects Lamps (Object 8) in it.
    A2 (Level 271) holds the Objects Lamps (Object 8) in it.
    Skyscraper (Level 522) holds the Objects Lamps (Object 8) in it.
  
  Visionaries of Berry:
    Cat Post (Level 181) holds Berry's Necklace (Custom Object).
  
  Followers of Jerry:
    Blue Salvation (Level 3) holds Jerry's Feather (Custom Object).
    Jerry's Salvation (Level 11) holds Jerry's Feather (Custom Object).
  
  Backrooms Non-aligned Trading Group:
    All bases hold the Object Candy for sale (Object 5).
    All bases hold the Object Potion of Sanity Stall (Custom Object).
    All bases hold the Object Deuclidators (Object 4) for sale.
    Recourse Station (Level 10) has Agrugua Fruit (Object 85) traders.
    El3A (Level 2) has the Object Way-Back Machine (Object 22) in it.
    Floor 283 (Level 13) has the Object Way-Back Machine (Object 22) in it.
    Trader's Keep (Level 1) has the Object Leviathan's Tooth (Object 66).

  The Unbound:
    Tunnels (Level 76) has the Object Hermes Device (Object 99) in it.

  The Masked Maidens:
    Station 1 (Level 994) has the Object Wall Mask (Object 24) in it.
    Station 2 (Level 67) has the Object Wall Mask (Object 24) in it.
    Station 3 (Level 153) has the Object Wall Mask (Object 24) in it.



  [{"name":"A1","description":null,"level":271,"group":"Backrooms Robotics","amenities":null},
    {"name":"A2","description":null,"level":271,"group":"Backrooms Robotics","amenities":null},
    {"name":"Skyscraper","description":null,"level":522,"group":"Backrooms Robotics","amenities":null},
    {"name":"Trader's Keep","description":null,"level":1,"group":"The Backrooms Non-Aligned Trade Group","amenities":null},
    {"name":"Office Space EL3A","description":null,"level":2,"group":"The Backrooms Non-Aligned Trade Group","amenities":null},
    {"name":"Trader's Guild","description":null,"level":230,"group":"The Backrooms Non-Aligned Trade Group","amenities":null},
    {"name":"Recourse Station","description":null,"level":10,"group":"The Backrooms Non-Aligned Trade Group","amenities":null},
    {"name":"Resource Extraction Camp","description":null,"level":283,"group":"The Backrooms Non-Aligned Trade Group","amenities":null},
    {"name":"Plastic Mine","description":null,"level":24,"group":"The Backrooms Non-Aligned Trade Group","amenities":null},
    {"name":"Unit 230","description":null,"level":230,"group":"The Backrooms Non-Aligned Trade Group","amenities":null},
    {"name":"The Arena","description":null,"level":998.2,"group":"The Backrooms Non-Aligned Trade Group","amenities":null},
    {"name":"Floor 283","description":null,"level":283,"group":"The Backrooms Non-Aligned Trade Group","amenities":null},
    {"name":"Watchers","description":null,"level":11,"group":"The Eyes of Argos","amenities":null},
    {"name":"Hideout","description":null,"level":11,"group":"The Iron Fist","amenities":null},
    {"name":"Blue Salvation","description":null,"level":3,"group":"The Followers of Jerry","amenities":null},
    {"name":"Jerry's Salvation","description":null,"level":11,"group":"The Followers of Jerry","amenities":null},
    {"name":"Jerry's Winged Travelers","description":null,"level":'The Hub',"group":"The Followers of Jerry","amenities":null},
    {"name":"Jerry's Room","description":null,"level":274,"group":"The Followers of Jerry","amenities":null},
    {"name":"The Institute","description":null,"level":11,"group":"The Kalag Institute","amenities":null},
    {"name":"Alpha","description":null,"level":1,"group":"The Major Explorer Group","amenities":null},
    {"name":"Omega","description":null,"level":4,"group":"The Major Explorer Group","amenities":null},
    {"name":"Gamma","description":null,"level":3,"group":"The Major Explorer Group","amenities":null},
    {"name":"Beta","description":null,"level":11,"group":"The Major Explorer Group","amenities":null},
    {"name":"Epsilon","description":null,"level":283,"group":"The Major Explorer Group","amenities":null},
    {"name":"Delta","description":null,"level":230,"group":"The Major Explorer Group","amenities":null},
    {"name":"Hollow Nest","description":null,"level":8,"group":"The Major Explorer Group","amenities":null},
    {"name":"Darkness Rangers","description":null,"level":64,"group":"The Major Explorer Group","amenities":null},
    {"name":"De-Aciders","description":null,"level":44,"group":"The Major Explorer Group","amenities":null},
    {"name":"Corridor","description":null,"level":1.1,"group":"The Major Explorer Group","amenities":null},
    {"name":"Frozen City","description":null,"level":159,"group":"The Major Explorer Group","amenities":null},
    {"name":"Station 1","description":null,"level":994,"group":"The Masked Maidens","amenities":null},
    {"name":"Station 2","description":null,"level":67,"group":"The Masked Maidens","amenities":null},
    {"name":"Station 3","description":null,"level":153,"group":"The Masked Maidens","amenities":null},
    {"name":"UEC 76","description":null,"level":76,"group":"The Unbound Explorers Coalition","amenities":null},
    {"name":"UEC 831","description":null,"level":831,"group":"The Unbound Explorers Coalition","amenities":null},
    {"name":"UEC 466","description":null,"level":466,"group":"The Unbound Explorers Coalition","amenities":null},
    {"name":"UEC 502","description":null,"level":502,"group":"The Unbound Explorers Coalition","amenities":null},
    {"name":"General Headquarters","description":null,"level":11,"group":"Backrooms Bureau of Administration and Research","amenities":null},
    {"name":"Institute of Research and Technology","description":null,"level":11,"group":"Backrooms Bureau of Administration and Research","amenities":null},
    {"name":"Main Agency","description":null,"level":11,"group":"The Backrooms Travel Agency","amenities":null},
    {"name":"Secondary Agency","description":null,"level":1,"group":"The Backrooms Travel Agency","amenities":null},
    {"name":"The Hotel Office","description":null,"level":5,"group":"The Backrooms Travel Agency","amenities":null},
    {"name":"The Concrete Office","description":null,"level":162,"group":"The Backrooms Travel Agency","amenities":null},
    {"name":"Astra","description":null,"level":147,"group":"Coalition of Backrooms Survivors","amenities":null},
    {"name":"Tgochi Heaven","description":null,"level":4,"group":"The Completionists","amenities":null},
    {"name":"The Museum","description":null,"level":216,"group":"The Interdimensional Museum of Backrooms History","amenities":null},
    {"name":"VOB Caverns","description":null,"level":181,"group":"The Visionaries of Berry","amenities":null}]
*/