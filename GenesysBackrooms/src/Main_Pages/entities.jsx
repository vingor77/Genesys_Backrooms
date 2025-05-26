import React, { useMemo, useState, useEffect } from 'react';
import { Box,Button,Typography,Paper,Grid,Card,CardContent,Chip,TextField,InputAdornment,Fade,Stack,MenuItem,Select,FormControl,InputLabel,IconButton,AppBar,Toolbar,Badge,Fab,Collapse,alpha,useTheme,useMediaQuery } from '@mui/material';
import { Search,Add,FilterList,ArrowBack,Menu as MenuIcon,Clear,Tune, } from '@mui/icons-material';
import { collection, doc, onSnapshot, orderBy, query, setDoc } from "firebase/firestore";
import db from '../Components/firebase';
import EntityItem from "../Components/entityItem";
import NotLoggedIn from "../Components/notLoggedIn";

export default function Entities() {
  const [entities, setEntities] = useState([]);
  const [currEntity, setCurrEntity] = useState('Deathmoth');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('All');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [showDetails, setShowDetails] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const data = [];

  const addData = async () => {
    try {
      for(let i = 0; i < data.length; i++) {
        await setDoc(doc(db, 'Entities', data[i].name), {
          name: data[i].name,
          description: data[i].description,
          stats: data[i].stats,
          soak: data[i].soak,
          wounds: data[i].wounds,
          strain: data[i].strain,
          defenses: data[i].defenses,
          skills: data[i].skills,
          talents: data[i].talents,
          abilities: data[i].abilities,
          actions: data[i].actions,
          equipment: data[i].equipment,
          drops: data[i].drops,
          difficulty: data[i].difficulty,
          spawnLocations: data[i].spawnLocations,
          type: data[i].type,
          behavior: data[i].behavior,
          fear: data[i].fear
        });
      }
    } catch (error) {
      console.error('Error adding data:', error);
    }
  };

  const getFromDB = () => {
    const q = query(collection(db, 'Entities'), orderBy("name", "asc"));
    const unsub = onSnapshot(q, (querySnapshot) => {
      const queryData = [];
      querySnapshot.forEach((doc) => {
        queryData.push(doc.data());
      });
      setEntities(queryData);
      setLoading(false);
    });

    return () => { unsub(); };
  };

  useEffect(() => {
    if (entities.length === 0) {
      getFromDB();
    }
  }, []);

  // Helper functions for styling
  const getDifficultyColor = (difficulty) => {
    if (difficulty < 2) return { color: 'primary', label: 'Easy' };
    if (difficulty < 4) return { color: 'success', label: 'Medium' };
    if (difficulty < 6) return { color: 'warning', label: 'Hard' };
    if(difficulty < 8) return {color: 'error', label: 'Very Hard'}
    return { color: 'secondary', label: 'Extreme' };
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Minion': return { color: 'default', bgColor: '#e3f2fd' };
      case 'Rival': return { color: 'primary', bgColor: '#f3e5f5' };
      case 'Nemesis': return { color: 'error', bgColor: '#ffebee' };
      default: return { color: 'default', bgColor: '#f5f5f5' };
    }
  };

  const getDifficultyRange = (difficulty) => {
    if (difficulty < 2) return 'Easy';
    if (difficulty < 4) return 'Medium';
    if (difficulty < 6) return 'Hard';
    if (difficulty < 8) return 'Very Hard';
    return 'Extreme';
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (searchTerm !== '') count++;
    if (filterType !== 'All') count++;
    if (difficultyFilter !== 'All') count++;
    return count;
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setFilterType('All');
    setDifficultyFilter('All');
  };

  // Filtered entities based on search, type filter, and difficulty filter
  const filteredEntities = useMemo(() => {
    return entities.filter(entity => {
      const matchesSearch = entity.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          entity.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'All' || entity.type === filterType;
      const matchesDifficulty = difficultyFilter === 'All' || getDifficultyRange(entity.difficulty) === difficultyFilter;
      
      return matchesSearch && matchesType && matchesDifficulty;
    });
  }, [entities, searchTerm, filterType, difficultyFilter]);

  const handleEntitySelect = (entityName) => {
    setCurrEntity(entityName);
    if (isMobile) {
      setShowDetails(true);
    }
  };

  const handleBackToList = () => {
    setShowDetails(false);
  };

  const FilterSection = () => (
    <Box sx={{ p: 2 }}>
      <Stack spacing={2}>
        <TextField
          placeholder="Search entities..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start"><Search /></InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => setSearchTerm('')}>
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
        
        <Box>
          <Typography variant="subtitle2" gutterBottom color="text.secondary">
            Entity Type
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {['All', 'Minion', 'Rival', 'Nemesis'].map((type) => (
              <Chip
                key={type}
                label={type}
                onClick={() => setFilterType(type)}
                color={filterType === type ? 'primary' : 'default'}
                variant={filterType === type ? 'filled' : 'outlined'}
                size="small"
              />
            ))}
          </Stack>
        </Box>

        <FormControl fullWidth size="small">
          <InputLabel>Difficulty</InputLabel>
          <Select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            label="Difficulty"
            sx={{ borderRadius: 2 }}
          >
            <MenuItem value="All">All Difficulties</MenuItem>
            <MenuItem value="Easy">Easy (0-1)</MenuItem>
            <MenuItem value="Medium">Medium (2-3)</MenuItem>
            <MenuItem value="Hard">Hard (4-5)</MenuItem>
            <MenuItem value="Very Hard">Very Hard (6-7)</MenuItem>
            <MenuItem value="Extreme">Extreme (8+)</MenuItem>
          </Select>
        </FormControl>

        <Box sx={{ pt: 1, borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="body2" color="text.secondary">
              {filteredEntities.length} of {entities.length} entities
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
                  onDelete={() => setSearchTerm('')}
                  color="primary"
                  variant="outlined"
                  size="small"
                />
              )}
              {filterType !== 'All' && (
                <Chip
                  label={`Type: ${filterType}`}
                  onDelete={() => setFilterType('All')}
                  color="primary"
                  variant="outlined"
                  size="small"
                />
              )}
              {difficultyFilter !== 'All' && (
                <Chip
                  label={`Difficulty: ${difficultyFilter}`}
                  onDelete={() => setDifficultyFilter('All')}
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

  const EntityList = () => {
    if (filteredEntities.length === 0) {
      return (
        <Box sx={{ textAlign: 'center', py: 4, px: 2 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {searchTerm || filterType !== 'All' || difficultyFilter !== 'All' ? 
              'No entities match your filters' : 'No entities found'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your search or filters
          </Typography>
        </Box>
      );
    }

    return (
      <Stack spacing={1} sx={{ p: 2 }}>
        {filteredEntities.map((entity) => {
          const difficultyInfo = getDifficultyColor(entity.difficulty);
          const typeInfo = getTypeColor(entity.type);
          const isSelected = currEntity === entity.name;
          
          return (
            <Card 
              key={entity.name}
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
              onClick={() => handleEntitySelect(entity.name)}
            >
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Typography 
                    variant="subtitle1" 
                    sx={{ 
                      fontWeight: 'bold',
                      color: isSelected ? 'primary.main' : 'text.primary',
                      flex: 1,
                      pr: 1
                    }}
                  >
                    {entity.name}
                  </Typography>
                  <Stack direction="row" spacing={0.5} flexShrink={0}>
                    <Chip 
                      label={entity.type}
                      color={typeInfo.color}
                      size="small"
                      variant="filled"
                      sx={{ fontSize: '0.7rem', height: '24px' }}
                    />
                    <Chip 
                      label={entity.difficulty}
                      color={difficultyInfo.color}
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
                  {entity.description || 'No description available'}
                </Typography>
              </CardContent>
            </Card>
          );
        })}
      </Stack>
    );
  };

  const DisplayEntity = () => {
    const entity = entities.find(e => e.name === currEntity);
    if (!entity) return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h6" color="text.secondary">
          Select an entity from the list to view details
        </Typography>
      </Box>
    );
    
    return (
      <Fade in={true} timeout={500}>
        <Box>
          <EntityItem entity={entity} person={false}/>
        </Box>
      </Fade>
    );
  };

  if (localStorage.getItem("loggedIn") === 'false') {
    return <NotLoggedIn />;
  }

  // Mobile view with drawer
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
                  {currEntity}
                </Typography>
              </>
            ) : (
              <>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                  Entities ({filteredEntities.length})
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
            <DisplayEntity />
          </Box>
        ) : (
          <Box>
            {/* Collapsible Filters */}
            <Collapse in={filtersOpen}>
              <Paper elevation={1} sx={{ borderRadius: 0 }}>
                <FilterSection />
              </Paper>
            </Collapse>

            {/* Entity List */}
            <Box sx={{ pb: 8 }}>
              <EntityList />
            </Box>
          </Box>
        )}

        {/* Mobile FAB for filters when not expanded */}
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

  // Desktop view (similar to original but refined)
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50', p: 3 }}>
      {/* Header */}
      <Paper elevation={3} sx={{ borderRadius: 3, mb: 3, overflow: 'hidden' }}>
        <Box sx={{ 
          background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
          color: 'white',
          p: 3
        }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                Entity Database
              </Typography>
              <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                Browse and explore game entities
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

      {entities.length > 0 ? (
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
                <FilterSection />
              </Paper>

              {/* Entity List */}
              <Paper elevation={2} sx={{ borderRadius: 3, maxHeight: '60vh', overflow: 'hidden' }}>
                <Box sx={{ p: 2, borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
                  <Typography variant="h6" fontWeight="bold" color="primary.main">
                    Entity Collection
                  </Typography>
                </Box>
                <Box sx={{ maxHeight: 'calc(60vh - 60px)', overflow: 'auto' }}>
                  <EntityList />
                </Box>
              </Paper>
            </Stack>
          </Grid>

          {/* Right Panel - Entity Details */}
          <Grid item xs={12} md={8}>
            <Paper elevation={2} sx={{ borderRadius: 3, minHeight: '70vh' }}>
              <Box sx={{ p: 3, borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
                <Typography variant="h5" fontWeight="bold" color="primary.main">
                  Entity Details
                </Typography>
              </Box>
              <Box sx={{ p: 3 }}>
                <DisplayEntity />
              </Box>
            </Paper>
          </Grid>
        </Grid>
      ) : (
        <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
          <Typography variant="h5" color="text.secondary" gutterBottom>
            No entities found
          </Typography>
          {!loading && localStorage.getItem('loggedIn')?.toUpperCase() === 'ADMIN' && (
            <Button variant="contained" onClick={addData} size="large" startIcon={<Add />}>
              Add Entities Now
            </Button>
          )}
        </Paper>
      )}
    </Box>
  );
}

/*
  Moley's Comedy Club and Bar (Entity 65) has the Wormhole Object (Custom Object).
  Sightless Seer (Enitity 365) drops a blue luminescent slab of skin use in making the Object Seer Tea (Object 365).
  Jerry (Entity 7) may appear randomly and give the Object Jerry's Feather (Custom Object).
  Create The Old Fear. A god.
  Blanche (Entity 140) appears in the dreams of the people who play GAM from the Object BackROM (Object 47).
  The King (Entity 33) gives out the Object The King's Courage (Custom Object) whenever it wants to AND upon The King's death.
  The Musician (Entity 137) gives the Object Cassette Recorder (Object 34) to people.
  The Keymaster (Entity 0) gives out a single Level Key to each person. Once ever.
  Scream Eaters (Entity 97) drops Liquid Silence.
  The Neighborhood Watch (Entity 96) is exclusive to Level 9 and will hunt down any wanderer with the Object Pocket (Object 51) in thier possession.
*/