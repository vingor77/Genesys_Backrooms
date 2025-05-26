import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Box,Button,Card,CardContent,Grid,Paper,Stack,TextField,Typography,Chip,IconButton,Collapse,Badge,Fab,Snackbar,Alert,alpha,useTheme,InputAdornment,FormControl,InputLabel,Select,MenuItem,useMediaQuery,AppBar,Toolbar,Fade } from '@mui/material';
import { Search,FilterList,Clear,Add,Tune,ArrowBack, } from '@mui/icons-material';
import { collection, doc, onSnapshot, query, setDoc } from "firebase/firestore";
import db from '../Components/firebase';
import LevelItem from "../Components/levelItem";
import NotLoggedIn from "../Components/notLoggedIn";

export default function Levels() {
  const [levels, setLevels] = useState([]);
  const [entities, setEntities] = useState([]);
  const [objects, setObjects] = useState([]);
  const [mundane, setMundane] = useState([]);
  const [armor, setArmor] = useState([]);
  const [weapons, setWeapons] = useState([]);
  const [interest, setInterest] = useState([]);
  const [phenomena, setPhenomena] = useState([]);
  const [currLevel, setCurrLevel] = useState('Tutorial Level');
  const [searchTerm, setSearchTerm] = useState('');
  const [sdClassFilter, setSdClassFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  
  // Ref to maintain input focus
  const searchInputRef = useRef(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const data = [{"name":"Tutorial Level","description":"Level 0 is a non-linear space, resembling the back rooms of a retail outlet. Similar to its previous form, all rooms in Level 0 appear uniform and share superficial features such as a yellowish wallpaper, damp carpet, and inconsistently placed fluorescent lighting. However, no two rooms within the level are identical.","level":0,"sdClass":1,"time":"x1","lightLevels":"0/8","chanceOfCorrosion":10,"corrosiveAtmosphere":5,"heat":"4/8","effectCount":1,"effects":"Light Mist/Medium Mist/Heavy Mist/Light Fog/Medium Fog/Heavy Fog/Hallucinations of other people/Scratching sounds/Intense humming/Voices of people in a non-coherent tongue/Insect sounds","roomSize":"20!100/20!100","roomHeight":8,"exitCount":5,"exitTypes":"Stairs going up/Stairs going down/A small hole in the wall/An open vent/A locked door/An unlocked door/A slide/A massive hole in the floor","exitFromLevelChance":5,"exitFromLevel":"Zenith Station/Remodeled Mess/Manila Room/Red Rooms/Habitable Zone","defectCount":2,"defects":"A lone dark oak chair/A torn bed/An L shaped couch cemented to the floor/A colored carpet patch/A broken helmet/1d6 small bullets/Neat papers/Scattered papers/A tinkerer hammer/An empty toolbox/A severed left arm/A mutilated human corpse/A large splot of dry blood","tags":"Indoors/Dark/Light/Damp/Daytime","spawnChances":"50/25/0/0/5","finite":"No","roomCount":3,"useAtmosphere":"Yes/Yes/No","sizeOfRooms":"50!40/50!30/50!50","exitsPerRoom":"5/2/3","exitTypesPerRoom":"Door!Door!Vent!Vent!Stairs going up/Door!Locked door/Locked door!Locked door!Door","lightLevelPerRoom":"4/7/9","heatPerRoom":"4/4/4","effectPerRoom":"Effect 1!Effect 4/Effect 2/Effect 3","spawnPerRoom":"Object!Phenomena!Window/Entity/Entity","defectsPerRoom":"Defect 1/Defect 2/Defect 3!Defect 4"}]

  const showToast = useCallback((message, severity = 'success') => {
    setToast({ open: true, message, severity });
  }, []);

  const hideToast = useCallback((event, reason) => {
    if (reason === 'clickaway') return;
    setToast(prev => ({ ...prev, open: false }));
  }, []);

  const addData = async () => {
    try {
      for(let i = 0; i < data.length; i++) {
        await setDoc(doc(db, 'Levels', data[i].name), {
          name: data[i].name,
          description: data[i].description,
          level: data[i].level,
          sdClass: data[i].sdClass,
          time: data[i].time,
          lightLevels: data[i].lightLevels,
          chanceOfCorrosion: data[i].chanceOfCorrosion,
          corrosiveAtmosphere: data[i].corrosiveAtmosphere,
          heat: data[i].heat,
          effectCount: data[i].effectCount,
          effects: data[i].effects,
          roomSize: data[i].roomSize,
          roomHeight: data[i].roomHeight,
          exitCount: data[i].exitCount,
          exitTypes: data[i].exitTypes,
          exitFromLevelChance: data[i].exitFromLevelChance,
          exitFromLevel: data[i].exitFromLevel,
          defectCount: data[i].defectCount,
          defects: data[i].defects,
          environments: data[i].environments,
          tags: data[i].tags,
          spawnChances: data[i].spawnChances,
          maxSpawns: data[i].maxSpawns,
          socialEncounters: data[i].socialEncounters,
          finite: data[i].finite,
          roomCount: data[i].roomCount,
          useAtmosphere: data[i].useAtmosphere,
          sizeOfRooms: data[i].sizeOfRooms,
          exitsPerRoom: data[i].exitsPerRoom,
          exitTypesPerRoom: data[i].exitTypesPerRoom,
          lightLevelPerRoom: data[i].lightLevelPerRoom,
          heatPerRoom: data[i].heatPerRoom,
          effectPerRoom: data[i].effectPerRoom,
          spawnPerRoom: data[i].spawnPerRoom,
          defectsPerRoom: data[i].defectsPerRoom
        });
      }
      showToast('Level data added successfully!');
    } catch (error) {
      showToast('Error adding level data', 'error');
      console.error(error);
    }
  };

  const getFromDB = useCallback((type) => {
    const q = query(collection(db, type));
    const unsub = onSnapshot(q, (querySnapshot) => {
      const queryData = [];
      querySnapshot.forEach((doc) => {
        queryData.push(doc.data());
      });
      
      // Use functional updates to prevent unnecessary re-renders
      if(type === 'Levels') {
        setLevels(prev => {
          // Only update if data actually changed
          if (JSON.stringify(prev) !== JSON.stringify(queryData)) {
            setLoading(false);
            return queryData;
          }
          return prev;
        });
      }
      if(type === 'Entities') setEntities(prev => JSON.stringify(prev) !== JSON.stringify(queryData) ? queryData : prev);
      if(type === 'PeopleOfInterest') setInterest(prev => JSON.stringify(prev) !== JSON.stringify(queryData) ? queryData : prev);
      if(type === 'Phenomena') setPhenomena(prev => JSON.stringify(prev) !== JSON.stringify(queryData) ? queryData : prev);
      if(type === 'Objects') setObjects(prev => JSON.stringify(prev) !== JSON.stringify(queryData) ? queryData : prev);
      if(type === 'Armor') setArmor(prev => JSON.stringify(prev) !== JSON.stringify(queryData) ? queryData : prev);
      if(type === 'Weapons') setWeapons(prev => JSON.stringify(prev) !== JSON.stringify(queryData) ? queryData : prev);
      if(type === 'MundaneObjects') setMundane(prev => JSON.stringify(prev) !== JSON.stringify(queryData) ? queryData : prev);
    });

    return () => { unsub(); };
  }, []);

  const getSdClassColor = useCallback((sdClass) => {
    switch (sdClass) {
      case '0': return { color: 'success', bgColor: '#e8f5e8' };
      case '1': return { color: 'info', bgColor: '#e3f2fd' };
      case '2': return { color: 'primary', bgColor: '#e3f2fd' };
      case '3': return { color: 'warning', bgColor: '#fff8e1' };
      case '4': return { color: 'error', bgColor: '#ffebee' };
      case '5': return { color: 'secondary', bgColor: '#f3e5f5' };
      default: return { color: 'default', bgColor: '#f5f5f5' };
    }
  }, []);

  // Filtered levels based on search and difficulty class
  const filteredLevels = useMemo(() => {
    if (!levels || levels.length === 0) return [];
    
    return levels.filter(level => {
      const matchesSearch = !searchTerm || 
        (level.name && level.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (level.description && level.description.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesSdClass = sdClassFilter === 'All' || 
        (level.sdClass && level.sdClass.toString() === sdClassFilter);
      
      return matchesSearch && matchesSdClass;
    });
  }, [levels, searchTerm, sdClassFilter]);

  // Stable event handlers
  const handleSearchChange = useCallback((event) => {
    const newValue = event.target.value;
    setSearchTerm(newValue);
    
    // Preserve cursor position
    requestAnimationFrame(() => {
      if (searchInputRef.current) {
        const input = searchInputRef.current.querySelector('input');
        if (input && document.activeElement !== input) {
          input.focus();
        }
      }
    });
  }, []);

  const handleSdClassChange = useCallback((event) => {
    setSdClassFilter(event.target.value);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchTerm('');
    if (searchInputRef.current) {
      const input = searchInputRef.current.querySelector('input');
      if (input) input.focus();
    }
  }, []);

  const clearAllFilters = useCallback(() => {
    setSearchTerm('');
    setSdClassFilter('All');
    showToast('All filters cleared');
  }, [showToast]);

  const getActiveFilterCount = useCallback(() => {
    let count = 0;
    if (searchTerm !== '') count++;
    if (sdClassFilter !== 'All') count++;
    return count;
  }, [searchTerm, sdClassFilter]);

  const handleLevelSelect = useCallback((levelName) => {
    setCurrLevel(levelName);
    if (isMobile) {
      setShowDetails(true);
    }
  }, [isMobile]);

  const handleBackToList = useCallback(() => {
    setShowDetails(false);
  }, []);

  // Initialize Firebase listeners once
  useEffect(() => {
    const unsubscribers = [];
    
    unsubscribers.push(getFromDB('Levels'));
    unsubscribers.push(getFromDB('Entities'));
    unsubscribers.push(getFromDB('PeopleOfInterest'));
    unsubscribers.push(getFromDB('Phenomena'));
    unsubscribers.push(getFromDB('Objects'));
    unsubscribers.push(getFromDB('Armor'));
    unsubscribers.push(getFromDB('Weapons'));
    unsubscribers.push(getFromDB('MundaneObjects'));

    return () => {
      unsubscribers.forEach(unsub => unsub && unsub());
    };
  }, [getFromDB]);

  if (localStorage.getItem("loggedIn") === 'false') {
    return <NotLoggedIn />;
  }

  // Render functions - these are stable and won't cause re-renders
  const renderSearchInput = () => (
    <TextField
      ref={searchInputRef}
      placeholder="Search levels by name or description..."
      value={searchTerm}
      onChange={handleSearchChange}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start"><Search /></InputAdornment>
        ),
        endAdornment: searchTerm && (
          <InputAdornment position="end">
            <IconButton size="small" onClick={clearSearch}>
              <Clear />
            </IconButton>
          </InputAdornment>
        ),
      }}
      fullWidth
      size="small"
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: 3,
        }
      }}
    />
  );

  const renderSdClassFilter = () => (
    <FormControl fullWidth size="small">
      <InputLabel>Survival Difficulty Class</InputLabel>
      <Select
        value={sdClassFilter}
        onChange={handleSdClassChange}
        label="Survival Difficulty Class"
        sx={{ borderRadius: 2 }}
      >
        <MenuItem value="All">All Classes</MenuItem>
        <MenuItem value="0">Class 0 (Safest)</MenuItem>
        <MenuItem value="1">Class 1 (Safe)</MenuItem>
        <MenuItem value="2">Class 2 (Moderate)</MenuItem>
        <MenuItem value="3">Class 3 (Dangerous)</MenuItem>
        <MenuItem value="4">Class 4 (Hazardous)</MenuItem>
        <MenuItem value="5">Class 5 (Death Trap)</MenuItem>
      </Select>
    </FormControl>
  );

  const renderFilterSection = () => (
    <Box sx={{ p: 2 }}>
      <Stack spacing={2}>
        {renderSearchInput()}
        {renderSdClassFilter()}

        <Box sx={{ pt: 1, borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="body2" color="text.secondary">
              {filteredLevels.length} of {levels.length} levels
            </Typography>
            <Button
              size="small"
              onClick={clearAllFilters}
              disabled={getActiveFilterCount() === 0}
              startIcon={<Clear />}
            >
              Clear
            </Button>
          </Box>
        </Box>

        {/* Active Filters */}
        {getActiveFilterCount() > 0 && (
          <Box>
            <Typography variant="subtitle2" gutterBottom color="text.secondary">
              Active Filters:
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {searchTerm && (
                <Chip
                  label={`Search: "${searchTerm}"`}
                  onDelete={clearSearch}
                  color="primary"
                  variant="outlined"
                  size="small"
                />
              )}
              {sdClassFilter !== 'All' && (
                <Chip
                  label={`Class: ${sdClassFilter}`}
                  onDelete={() => setSdClassFilter('All')}
                  color="primary"
                  variant="outlined"
                  size="small"
                />
              )}
            </Stack>
          </Box>
        )}
      </Stack>
    </Box>
  );

  const renderLevelsList = () => {
    if (filteredLevels.length === 0) {
      return (
        <Box sx={{ textAlign: 'center', py: 4, px: 2 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {searchTerm || sdClassFilter !== 'All' ? 
              'No levels match your filters' : 'No levels found'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your search or filters
          </Typography>
        </Box>
      );
    }

    return (
      <Stack spacing={1} sx={{ p: 2 }}>
        {filteredLevels.map((level, index) => {
          const sdClassInfo = getSdClassColor(level.sdClass);
          const isSelected = currLevel === level.name;
          
          return (
            <Card 
              key={`level-${level.name}-${level.level || index}`}
              sx={{ 
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                border: isSelected ? '2px solid #1976d2' : '1px solid rgba(0,0,0,0.12)',
                transform: isSelected ? 'scale(1.01)' : 'scale(1)',
                boxShadow: isSelected ? 3 : 1,
                '&:hover': {
                  transform: 'scale(1.01)',
                  boxShadow: 2,
                },
                '&:active': {
                  transform: 'scale(0.99)',
                },
                backgroundColor: isSelected ? 'rgba(25, 118, 210, 0.04)' : 'white'
              }}
              onClick={() => handleLevelSelect(level.name)}
            >
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Box sx={{ flex: 1, pr: 1 }}>
                    <Typography 
                      variant="subtitle1" 
                      sx={{ 
                        fontWeight: 'bold',
                        color: isSelected ? 'primary.main' : 'text.primary',
                        mb: 0.5
                      }}
                    >
                      {level.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Level {level.level}
                    </Typography>
                  </Box>
                  <Stack direction="row" spacing={0.5} flexShrink={0}>
                    <Chip 
                      label={`Class ${level.sdClass}`}
                      color={sdClassInfo.color}
                      size="small"
                      variant="filled"
                      sx={{ fontSize: '0.7rem', height: '24px' }}
                    />
                    <Chip 
                      label={level.time}
                      color="info"
                      size="small"
                      sx={{ fontSize: '0.7rem', height: '24px' }}
                    />
                  </Stack>
                </Box>
                
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{ 
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    lineHeight: 1.4,
                  }}
                >
                  {level.description || 'No description available'}
                </Typography>
              </CardContent>
            </Card>
          );
        })}
      </Stack>
    );
  };

  const renderDisplayLevel = () => {
    const level = levels.find(l => l.name === currLevel);
    if (!level) return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h6" color="text.secondary">
          Select a level from the list to view details
        </Typography>
      </Box>
    );
    
    return (
      <Fade in={true} timeout={500}>
        <Box>
          <LevelItem data={{entities, objects, mundane, armor, weapons, interest, phenomena, level}} />
        </Box>
      </Fade>
    );
  };

  // Mobile view
  if (isMobile) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
        {/* Mobile App Bar */}
        <AppBar position="sticky" elevation={2}>
          <Toolbar>
            {showDetails ? (
              <>
                <IconButton
                  edge="start"
                  color="inherit"
                  onClick={handleBackToList}
                  sx={{ mr: 2 }}
                >
                  <ArrowBack />
                </IconButton>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                  {currLevel}
                </Typography>
              </>
            ) : (
              <>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                  Levels ({filteredLevels.length})
                </Typography>
                <IconButton
                  color="inherit"
                  onClick={() => setFiltersOpen(!filtersOpen)}
                >
                  <Badge badgeContent={getActiveFilterCount()} color="error">
                    <Tune />
                  </Badge>
                </IconButton>
                {localStorage.getItem('loggedIn')?.toUpperCase() === 'ADMIN' && (
                  <IconButton color="inherit" onClick={addData}>
                    <Add />
                  </IconButton>
                )}
              </>
            )}
          </Toolbar>
        </AppBar>

        {/* Mobile Content */}
        {showDetails ? (
          <Box sx={{ p: 2 }}>
            {renderDisplayLevel()}
          </Box>
        ) : (
          <Box>
            {/* Collapsible Filters */}
            <Collapse in={filtersOpen}>
              <Paper elevation={1} sx={{ borderRadius: 0 }}>
                {renderFilterSection()}
              </Paper>
            </Collapse>

            {/* Levels List */}
            <Box sx={{ pb: 8 }}>
              {renderLevelsList()}
            </Box>
          </Box>
        )}

        {/* Mobile FAB for filters */}
        {!filtersOpen && !showDetails && (
          <Fab
            color="primary"
            sx={{
              position: 'fixed',
              bottom: 16,
              right: 16,
            }}
            onClick={() => setFiltersOpen(true)}
          >
            <Badge badgeContent={getActiveFilterCount()} color="error">
              <FilterList />
            </Badge>
          </Fab>
        )}
      </Box>
    );
  }

  // Desktop view
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50', mr: 'auto', ml: 'auto', py: 4 }} maxWidth={{sm: "100%", md: '75%'}}>
      {/* Header */}
      <Paper elevation={3} sx={{ borderRadius: 3, mb: 3, overflow: 'hidden' }}>
        <Box sx={{ 
          background: 'linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%)',
          color: 'white',
          p: 3
        }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                Level Database
              </Typography>
              <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                Explore different levels and dimensions
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

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
          <Typography variant="h6" color="text.secondary">
            Loading levels...
          </Typography>
        </Box>
      ) : levels.length > 0 ? (
        <Grid container spacing={3}>
          {/* Left Panel - Filters and List */}
          <Grid item xs={12} md={4}>
            <Stack spacing={2}>
              {/* Filters */}
              <Paper elevation={2} sx={{ borderRadius: 3 }}>
                <Box sx={{ p: 2, borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
                  <Typography variant="h6" fontWeight="bold" color="primary.main">
                    Search & Filter
                  </Typography>
                </Box>
                {renderFilterSection()}
              </Paper>

              {/* Levels List */}
              <Paper elevation={2} sx={{ borderRadius: 3, maxHeight: '60vh', overflow: 'hidden' }}>
                <Box sx={{ p: 2, borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
                  <Typography variant="h6" fontWeight="bold" color="primary.main">
                    Level Collection
                  </Typography>
                </Box>
                <Box sx={{ maxHeight: 'calc(60vh - 60px)', overflow: 'auto' }}>
                  {renderLevelsList()}
                </Box>
              </Paper>
            </Stack>
          </Grid>

          {/* Right Panel - Level Details */}
          <Grid item xs={12} md={8}>
            <Paper elevation={2} sx={{ borderRadius: 3, minHeight: '70vh' }}>
              <Box sx={{ p: 3, borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
                <Typography variant="h5" fontWeight="bold" color="primary.main">
                  Level Details
                </Typography>
              </Box>
              <Box sx={{ p: 3 }}>
                {renderDisplayLevel()}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      ) : (
        <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
          <Typography variant="h5" color="text.secondary" gutterBottom>
            No levels found
          </Typography>
          {!loading && localStorage.getItem('loggedIn')?.toUpperCase() === 'ADMIN' && (
            <Button variant="contained" onClick={addData} size="large" startIcon={<Add />}>
              Add Levels Now
            </Button>
          )}
        </Paper>
      )}

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