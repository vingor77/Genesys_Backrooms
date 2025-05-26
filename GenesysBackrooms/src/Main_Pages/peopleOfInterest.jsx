import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
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
  useMediaQuery,
  AppBar,
  Toolbar,
  Fade
} from "@mui/material";
import {
  Search,
  FilterList,
  Clear,
  Add,
  ExpandMore,
  ExpandLess,
  People as PeopleIcon,
  Tune,
  ArrowBack,
  Person
} from '@mui/icons-material';
import { collection, doc, onSnapshot, orderBy, query, setDoc } from "firebase/firestore";
import db from '../Components/firebase';
import People from "../Components/people";
import NotLoggedIn from "../Components/notLoggedIn";

export default function PeopleOfInterest() {
  const [people, setPeople] = useState([]);
  const [name, setName] = useState('');
  const [groupFilter, setGroupFilter] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');
  const [fighterFilter, setFighterFilter] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const [showDetails, setShowDetails] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
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
        await setDoc(doc(db, 'PeopleOfInterest', data[i].name), {
          name: data[i].name,
          introduction: data[i].introduction,
          reason: data[i].reason,
          personality: data[i].personality,
          spawnLocations: data[i].spawnLocations,
          associatedGroup: data[i].associatedGroup,
          hidden: data[i].hidden,
          importantAffiliations: data[i].importantAffiliations,
          fighter: data[i].fighter,
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
          difficulty: data[i].difficulty
        });
      }
      showToast('People data added successfully!');
    } catch (error) {
      showToast('Error adding people data', 'error');
      console.error(error);
    }
  };

  const getFromDB = () => {
    const q = query(collection(db, 'PeopleOfInterest'), orderBy("name", "asc"));
    const unsub = onSnapshot(q, (querySnapshot) => {
      const queryData = [];
      querySnapshot.forEach((doc) => {
        queryData.push(doc.data());
      });
      setPeople(queryData);
      setLoading(false);
    });

    return () => { unsub(); };
  };

  const getUniqueGroups = () => {
    const groups = [...new Set(people.map(person => person.associatedGroup).filter(group => group && typeof group === 'string' && group.trim() !== ''))];
    return groups.sort();
  };

  const getUniqueDifficulties = () => {
    const difficulties = [...new Set(people.map(person => person.difficulty).filter(diff => diff && typeof diff === 'string' && diff.trim() !== ''))];
    return difficulties.sort();
  };

  const getFilteredPeople = () => {
    return people.filter(person => {
      const matchesName = !name || 
        (person.name && person.name.toLowerCase().includes(name.toLowerCase())) ||
        (person.introduction && person.introduction.toLowerCase().includes(name.toLowerCase())) ||
        (person.personality && person.personality.toLowerCase().includes(name.toLowerCase()));
      
      const matchesGroup = !groupFilter || (person.associatedGroup && person.associatedGroup === groupFilter);
      const matchesDifficulty = !difficultyFilter || (person.difficulty && person.difficulty === difficultyFilter);
      const matchesFighter = !fighterFilter || (person.fighter && person.fighter === fighterFilter);
      const matchesVisibility = person.hidden === 'No' || localStorage.getItem('loggedIn')?.toUpperCase() === 'ADMIN';
      
      return matchesName && matchesGroup && matchesDifficulty && matchesFighter && matchesVisibility;
    });
  };

  const clearAllFilters = () => {
    setName('');
    setGroupFilter('');
    setDifficultyFilter('');
    setFighterFilter('');
    showToast('All filters cleared');
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (name !== '') count++;
    if (groupFilter !== '') count++;
    if (difficultyFilter !== '') count++;
    if (fighterFilter !== '') count++;
    return count;
  };

  const getFilteredCount = () => {
    return getFilteredPeople().length;
  };

  const handlePersonSelect = (person) => {
    setSelectedPerson(person);
    if (isMobile) {
      setShowDetails(true);
    }
  };

  const handleBackToList = () => {
    setShowDetails(false);
  };

  const DisplayItems = () => {
    const filteredPeople = getFilteredPeople();

    return (
      <Box sx={{ mt: 3 }}>
        {filteredPeople.length === 0 ? (
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
            <Search sx={{ fontSize: 60, color: 'grey.300', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No people found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try adjusting your search criteria to find more people
            </Typography>
          </Paper>
        ) : (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <PeopleIcon color="primary" />
              Found {filteredPeople.length} person{filteredPeople.length !== 1 ? 's' : ''}
            </Typography>
            <Stack direction="row" flexWrap="wrap" gap={2}>
              {filteredPeople.map((person, index) => (
                <People key={index} currPerson={person} />
              ))}
            </Stack>
          </Box>
        )}
      </Box>
    );
  };

  const renderFilterSection = () => (
    <Box>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth size="small">
            <InputLabel id="group-label">Associated Group</InputLabel>
            <Select
              labelId="group-label"
              label="Associated Group"
              onChange={(e) => setGroupFilter(e.target.value)}
              value={groupFilter}
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="">Any Group</MenuItem>
              {getUniqueGroups().map(group => (
                <MenuItem key={group} value={group}>{group}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth size="small">
            <InputLabel id="difficulty-label">Difficulty Level</InputLabel>
            <Select
              labelId="difficulty-label"
              label="Difficulty Level"
              onChange={(e) => setDifficultyFilter(e.target.value)}
              value={difficultyFilter}
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="">Any Difficulty</MenuItem>
              {getUniqueDifficulties().map(difficulty => (
                <MenuItem key={difficulty} value={difficulty}>{difficulty}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth size="small">
            <InputLabel id="fighter-label">Fighter Status</InputLabel>
            <Select
              labelId="fighter-label"
              label="Fighter Status"
              onChange={(e) => setFighterFilter(e.target.value)}
              value={fighterFilter}
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="">Any Status</MenuItem>
              <MenuItem value="Yes">Fighter</MenuItem>
              <MenuItem value="No">Non-Fighter</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Button
            fullWidth
            variant="outlined"
            onClick={clearAllFilters}
            startIcon={<Clear />}
            disabled={getActiveFilterCount() === 0}
            sx={{ 
              borderRadius: 2,
              py: 1.5
            }}
          >
            Clear Filters
          </Button>
        </Grid>
      </Grid>

      {/* Active Filters Display */}
      {getActiveFilterCount() > 0 && (
        <Box sx={{ mt: 2, pt: 2, borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Active Filters:
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {name && (
              <Chip
                label={`Name: "${name}"`}
                onDelete={() => setName('')}
                color="primary"
                variant="outlined"
                size="small"
              />
            )}
            {groupFilter && (
              <Chip
                label={`Group: ${groupFilter}`}
                onDelete={() => setGroupFilter('')}
                color="primary"
                variant="outlined"
                size="small"
              />
            )}
            {difficultyFilter && (
              <Chip
                label={`Difficulty: ${difficultyFilter}`}
                onDelete={() => setDifficultyFilter('')}
                color="primary"
                variant="outlined"
                size="small"
              />
            )}
            {fighterFilter && (
              <Chip
                label={`Fighter: ${fighterFilter}`}
                onDelete={() => setFighterFilter('')}
                color="primary"
                variant="outlined"
                size="small"
              />
            )}
          </Stack>
        </Box>
      )}
    </Box>
  );

  const renderPeopleList = () => {
    const filteredPeople = getFilteredPeople();

    if (filteredPeople.length === 0) {
      return (
        <Box sx={{ textAlign: 'center', py: 4, px: 2 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {name || groupFilter || difficultyFilter || fighterFilter ? 
              'No people match your filters' : 'No people found'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your search or filters
          </Typography>
        </Box>
      );
    }

    return (
      <Stack spacing={1} sx={{ p: 2 }}>
        {filteredPeople.map((person, index) => {
          const isSelected = selectedPerson?.name === person.name;
          
          return (
            <Card 
              key={`person-${person.name}-${index}`}
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
              onClick={() => handlePersonSelect(person)}
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
                      {person.name}
                    </Typography>
                    {person.associatedGroup && (
                      <Typography variant="body2" color="text.secondary">
                        {person.associatedGroup}
                      </Typography>
                    )}
                  </Box>
                  <Stack direction="row" spacing={0.5} flexShrink={0}>
                    {person.fighter === 'Yes' && (
                      <Chip 
                        label="Fighter"
                        color="error"
                        size="small"
                        variant="filled"
                        sx={{ fontSize: '0.7rem', height: '24px' }}
                      />
                    )}
                    {person.difficulty && (
                      <Chip 
                        label={person.difficulty}
                        color="warning"
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: '0.7rem', height: '24px' }}
                      />
                    )}
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
                  {person.introduction || person.reason || 'No description available'}
                </Typography>
              </CardContent>
            </Card>
          );
        })}
      </Stack>
    );
  };

  useEffect(() => {
    if (localStorage.getItem("loggedIn") !== 'false') {
      getFromDB();
    }
  }, []);

  if (localStorage.getItem("loggedIn") === 'false') {
    return <NotLoggedIn />;
  }

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
                  {selectedPerson?.name || 'Person Details'}
                </Typography>
              </>
            ) : (
              <>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                  People ({getFilteredCount()})
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
            <Fade in={true} timeout={500}>
              <Box>
                {selectedPerson && <People currPerson={selectedPerson} />}
              </Box>
            </Fade>
          </Box>
        ) : (
          <Box>
            {/* Collapsible Filters */}
            <Collapse in={filtersOpen}>
              <Paper elevation={1} sx={{ borderRadius: 0, p: 2 }}>
                <Box sx={{ mb: 2 }}>
                  <TextField
                    fullWidth
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Search by name, introduction, or personality..."
                    variant="outlined"
                    InputProps={{
                      startAdornment: <Search sx={{ mr: 1, color: 'action.active' }} />,
                      endAdornment: name && (
                        <IconButton size="small" onClick={() => setName('')}>
                          <Clear />
                        </IconButton>
                      ),
                    }}
                    size="small"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Box>
                {renderFilterSection()}
              </Paper>
            </Collapse>

            {/* People List */}
            <Box sx={{ pb: 8 }}>
              {renderPeopleList()}
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
      <Paper 
        elevation={3} 
        sx={{ 
          mb: 4, 
          borderRadius: 3, 
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%)',
          color: 'white'
        }}
      >
        <Box sx={{ 
          p: { xs: 2, sm: 3 }
        }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
            <Box>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                People of Interest
              </Typography>
              <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                Browse and search through notable individuals
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
              Loading people collection...
            </Typography>
          </Box>
        ) : people.length > 0 ? (
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
                        label={`${getFilteredCount()} people`} 
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
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Search by name, introduction, or personality..."
                    variant="outlined"
                    InputProps={{
                      startAdornment: <Search sx={{ mr: 1, color: 'action.active' }} />,
                      endAdornment: name && (
                        <IconButton size="small" onClick={() => setName('')}>
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

                {/* Filters - Collapsible on Mobile */}
                <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                  {renderFilterSection()}
                </Box>
                
                <Collapse in={filtersOpen} sx={{ display: { xs: 'block', md: 'none' } }}>
                  {renderFilterSection()}
                </Collapse>
              </CardContent>
            </Card>

            {/* Results */}
            <DisplayItems />
          </Box>
        ) : (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
            <Typography variant="h6" color="text.secondary">
              No people data available
            </Typography>
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
[{"name":"Iravan, The Moon Man","introduction":"You see before you a tall and lanky man with nothing more than a green loincloth. His green hair ruffled and messy with a perfectly shaped bush for a beard. In the dim light his eyes glow a brilliant green. He is muttering to himself in a low, booming tone. Listening for a little longer, you notice he has an intense Scottish accent.","reason":"Iravan can make Worn Sacks when given the materials. Should the materials not be present, he will teach the recipe to create Worn Sacks.","personality":"Iravan is a laid-back individual interested in nothing more than the stories others would tell him. His voice is deep and he has a particularly thick Scottish accent.","spawnLocations":"Dark","associatedGroup":"None","hidden":"Yes","importantAffiliations":"None","fighter":"No","stats":"","soak":null,"wounds":null,"strain":null,"defenses":"","skills":"","talents":"","abilities":"","actions":"","equipment":"","difficulty":null},
    {"name":"The Wizard","introduction":"Appearing out of thin air stands a man of average size in a blue robe covered in moon symbols. He has a pointy blue hat and large round glasses highlighting his crimson red eyes. His magnificent white beard trails halfway down his chest. He promptly holds his staff out before him, using it as a walking stick.","reason":"The Wizard can make and do anything, so long as it doesn't directly relate to a god or thier associated avatars.","personality":"The Wizard is a mysterious yet wise man who loves to share knowledge with others. He is a man of trade and will only assist when assisted back.","spawnLocations":"All","associatedGroup":"None","hidden":"Yes","importantAffiliations":"None","fighter":"Yes","stats":"7/7/7/7/7/7","soak":15,"wounds":68,"strain":73,"defenses":"4/4","skills":"All 4s","talents":"None","abilities":"None","actions":"Anything","equipment":"Wooden Staff","difficulty":10},
    {"name":"Willow Wisp","introduction":"A small light slowly grows in power before you.","reason":"The Willow Wisp helps lead explorers out of Level 6.","personality":"None","spawnLocations":"6","associatedGroup":"None","hidden":"Yes","importantAffiliations":"None","fighter":"No","stats":"","soak":null,"wounds":null,"strain":null,"defenses":"","skills":"","talents":"","abilities":"","actions":"","equipment":"","difficulty":null},
    {"name":"The Actor","introduction":"Before you stands a man seemingly in his late 20s of average height with black hair stretching down to his neck. His Dark Brown eyes and hairless face flash a smile towards you. He holds a blue and white dotted umbrella.","reason":"The Actor will take on any role you ask of him for a price. Essentially, he is a powerful mercenary.","personality":"The Actor is a laid-back and unbothered individual who claims to be an actor and nothing else.","spawnLocations":"All","associatedGroup":"None","hidden":"Yes","importantAffiliations":"Blanche","fighter":"Yes","stats":"3/3/2/2/2/3","soak":6,"wounds":23,"strain":28,"defenses":"2/2","skills":"Athletics 3/Charm 2/Melee 2/Negotiation 2/Ranged 3","talents":"Hamstring Shot: Halve damage but immobilize target/Quick Draw: Draw or holster a weapon as an incidental and decrease an item's prepare value by 1 to a minimum of 1/Forgot to Count?: Spend 2 threats to cause the weapon to run out of ammo after an opponent makes a ranged attack.","abilities":"Shift Personalities: The Actor may change his voice and general personality to match the role he has assigned himself.","actions":"Umbrella Gunsword: Ranged or Melee; Damage 10; Critical 2; Range [Medium]; Vicious 2; Sneak: The first attack in an encounter adds 2 successes automatically.","equipment":"Umbrella Gunsword","difficulty":1},
    {"name":"Aiko Sato","introduction":"A woman in a black shirt with brown eyes, short black hair, and a face mask approaches you. She wears a golden axe on her back and is holding a pen and paper before asking what you would like to order.","reason":"Aiko's goal is to find an exit from the Backrooms and is an incredibly strong fighter. She plays Hero with the help of Fortune, the god of the Golden Axe by slaying entities and then leading the saved to safety. Should Aiko die, the Axe may be attached to another person.","personality":"Aiko is playful in nature and likes to joke around but the people who aren't close to her are treated more coldly and distant. She kills all entities then leaves as soon as she can.","spawnLocations":"Tom's Diner/11","associatedGroup":"Tom's Diner","hidden":"Yes","importantAffiliations":"None","fighter":"Yes","stats":"6/6/6/6/6/6","soak":13,"wounds":58,"strain":63,"defenses":"4/4","skills":"Athletics 4/Cool 3/Melee 5","talents":"Durable 3: Reduce crits by 30/Iajutsu Training: Deal 2 extra damage the first time a weapon is drawn in an encounter for 1 turn./Berserk: Add Success and 2 advantages for an encounter but take 6 strain after./Death Rage: Add 2 damage to melee attacks for each critical injury./Crushing Blow: Take 4 strain to add Breach 1 and Knockdown to the weapon and destroy an item carried by the target unless it has the reinforced quality.","abilities":"Self-inflicted Agony: Every attack Aiko makes adds a Critical Injury of value 1.","actions":"Golden Axe: Melee; Damage 10; Critical 1; Range [Engaged]; Vicious 5; AutoHit; Anomalous(Auto apply a crit)","equipment":"Golden Axe","difficulty":8},
    {"name":"The Alchemist","introduction":"A scruffy man with no eyes but eye sockets, pointy ears, a spotty black and white beard, and a smile full of jagged and broken teeth can be seen holding a flask of orange liquid over a table filled with dozens of colored vials and body parts.","reason":"The Alchemist can procure items, teach things such as crafts, killing methods, inner workings of entities, etc., reviving the dead, and more. So long as its something alchemy can do. This all comes at a price however such as human blood, busywork, your soul, currency (not almond water), a cigarette, etc.","personality":"The Alchemist is an extremely eccentric individual who speaks enthusiastically about everything regardless of his situation and takes great pride in his alchemical work.","spawnLocations":"Safe","associatedGroup":"None","hidden":"Yes","importantAffiliations":"Blanche/The Keymaster/The Game Master/Pillar Scribe/Argos/Kushim/Fengari/Philia","fighter":"No","stats":"","soak":null,"wounds":null,"strain":null,"defenses":"","skills":"","talents":"","abilities":"","actions":"","equipment":"","difficulty":null},
    {"name":"Nara Kagan","introduction":"An older man, roughly 70 years of age, with graying short hair, brown eyes, and a short but bushy facial hair is sitting behind a portable stall with a crystal ball and a sign telling people he will read thier futures.","reason":"Nara can predict the future perfectly regardless of what kind of future. With this, he can help with a quest or some other future endeavor.","personality":"Nara is a calm and relaxed guy but has extreme excitement while reading and describing the future. He always asks before reading a future if they are alright with paying the cost of knowledge.","spawnLocations":"Safe","associatedGroup":"None","hidden":"Yes","importantAffiliations":"None","fighter":"No","stats":"","soak":null,"wounds":null,"strain":null,"defenses":"","skills":"","talents":"","abilities":"","actions":"","equipment":"","difficulty":null},
    {"name":"Caspian","introduction":"A young, assumed around 20 years of age, kid with blue eyes and short dark hair is relaxing in a chair with a golden flute on his lap.","reason":"Caspian stops all entity attacks by playing his music. He will come along for expeditions for a price, usually shortbread.","personality":"Caspian, outside of his performances, is often described as quiet, imaginative, and something of a romantic personality, in more ways than one. He also typically becomes much more avid and outgoing while discussing something in his direct interest, such as art, especially music. In public or at formal gatherings, he also appears much more polite and charismatic. Within performances, Caspian displays a highly eager, passionate side of himself - many of his extroverted traits, well hidden in his typical shyness, exploding into life. He also appears to be very comfortable performing in front of a stage.","spawnLocations":"1","associatedGroup":"None","hidden":"Yes","importantAffiliations":"None","fighter":"No","stats":"","soak":null,"wounds":null,"strain":null,"defenses":"","skills":"","talents":"","abilities":"","actions":"","equipment":"","difficulty":null},
    {"name":"Evangeline Holmes","introduction":"A filipino woman roughly 24 years old wearing a large red mask with golden feathers hiding long brown hair reaching down to her shoulders raises a prosthetic hand towards you as if to suggest she will not harm you.","reason":"Evangaline is the creator and leader of the Masked Maidens.","personality":"Evangaline's personality changes every so often and based on who she is speaking to.","spawnLocations":"Station 1/Station 2/Station 3","associatedGroup":"The Masked Maidens","hidden":"Yes","importantAffiliations":"None","fighter":"No","stats":"","soak":null,"wounds":null,"strain":null,"defenses":"","skills":"","talents":"","abilities":"","actions":"","equipment":"","difficulty":null},
    {"name":"Francisque Alberici (Father Pigeon)","introduction":"A caucasian man with short light brown hair and brown eyes standing roughly at a height of 5 foot 7 inches with no facial hair wearing rectangular shaped glasses appears from the darkness welcoming you in. He wears a blue robe with gold trim.","reason":"Francisque is one of the main leaders of the Followers of Jerry","personality":"Francisque is a talkative and intelligent man who loves to engage in philosophical conversations and explain what Jerry is.","spawnLocations":"Blue Salvation/Jerry's Salvation/Jerry's Room/Jerry's Winger Travelers","associatedGroup":"The Followers of Jerry","hidden":"Yes","importantAffiliations":"Jerry","fighter":"No","stats":"","soak":null,"wounds":null,"strain":null,"defenses":"","skills":"","talents":"","abilities":"","actions":"","equipment":"","difficulty":null},
    {"name":"Gani","introduction":"A brown-skinned man standing at average height with black hair seeming to be around his 20's introduces himself by taking off his cone shaped hat and bowing.","reason":"Gani is the leader of the Kalag Institute.","personality":"Gani is very secretive and reserved but friendly. He will make trades and enjoy speaking with others but watches his tongue.","spawnLocations":"The Institute","associatedGroup":"The Kalag Institute","hidden":"Yes","importantAffiliations":"Blanche","fighter":"No","stats":"","soak":null,"wounds":null,"strain":null,"defenses":"","skills":"","talents":"","abilities":"","actions":"","equipment":"","difficulty":null},
    {"name":"George McCarson","introduction":"An italian man around the age of 45 with brown hair and hazel eyes towers over you with a steak knife in his hands asking what you need from him.","reason":"George is the leader of the B.N.T.G","personality":"George is a cold-blooded killer, a liar, a deceptive gambler, and a drug addict. He finds fun in attacking and killing others then selling thier organs.","spawnLocations":"5.1","associatedGroup":"The Backrooms Non-Aligned Trade Group","hidden":"Yes","importantAffiliations":"None","fighter":"Yes","stats":"4/4/4/2/2/4","soak":8,"wounds":43,"strain":44,"defenses":"2/2","skills":"Athletics 3/Coordination 4/Leadership 4/Negotiation 3/Melee 3","talents":"Painful Blow: Increase difficulty by 1 to make target take 2 strain each maneuver for the encounter./Quick Strike 3: Add 3 boost dice to attacks against targets who haven't taken thier turn yet.","abilities":"None","actions":"Knife: Melee; Damage 5; Critical 3; Range [Engaged]","equipment":"Knife","difficulty":3},
    {"name":"Herne The Huntmaster","introduction":"You slowly look up from a large entity's chest coated in steel to see a deer staring down at you. He is holding a spear roughly double the size of you.","reason":"Herne is a hunter who will hunt for you. He gathers materials from entities that are considered to be rare or hard to get. In addition, Herne can freely travel to the Frontrooms and back and may be capable of helping you escape too.","personality":"Herne is a serious and righteous entity. He is strict yet forgiving and has a sense of extreme dignity.","spawnLocations":"Forest","associatedGroup":"None","hidden":"Yes","importantAffiliations":"None","fighter":"Yes","stats":"6/6/4/3/4/4","soak":10,"wounds":57,"strain":48,"defenses":"3/3","skills":"Melee 5","talents":"None","abilities":"Terrifying Presence: As an action, Herne may force anyone who can see him to make a difficulty 4 fear check with 2 automatic failures. Any affected by this then becomes immune to the effect for the next 24 hours.","actions":"Spear: Melee; Damage 8; Critical 4; Range [Engaged]; Defensive 1; Accurate 1; Reach; Stun 4","equipment":"Spear","difficulty":5},
    {"name":"Alasdair Morgan","introduction":"A medieval set of armor fashioned of rusted metal sits against a wall surrounded by many others in a similar set of armor. Upon seeing you, he removes his helmet to reveal brown short hair, vibrant blue eyes, and a gentle smile.","reason":"Alasdair has information about the inner working of the Eyes of Argos. He also can help take down Argos.","personality":"Alasdair is surprisingly light-hearted and wishes for all near him to be comfortable. He offers food, water, and other supplies while speaking casually.","spawnLocations":"All","associatedGroup":"The Eyes of Argos","hidden":"Yes","importantAffiliations":"Argos","fighter":"Yes","stats":"6/6/6/6/6/6","soak":13,"wounds":58,"strain":63,"defenses":"4/4","skills":"Melee 4/Ranged 4/Stealth 4","talents":"None","abilities":"None","actions":"Sword: Melee; Damage 9; Critical 2; Range [Engaged]; Defensive 1/Shield: Melee; Damage 6; Critical 6; Range [Engaged]; Defensive 1; Deflection 1; Innacurate 1; Knockdown","equipment":"Sword/Shield/Plate Armor","difficulty":8},
    {"name":"Ironsoul","introduction":"A basic looking middle-aged office worker with graying hair and deep red eyes looks in your general direction, avoiding eye contact.","reason":"Ironsoul has completed 72 of the 100 quests in the Tgochi.exe list and will assist for an exchange of goods.","personality":"A lunatic with a messed up moral compass.","spawnLocations":"Gamma","associatedGroup":"The Completionists","hidden":"Yes","importantAffiliations":"Tgochi.exe","fighter":"No","stats":"","soak":null,"wounds":null,"strain":null,"defenses":"","skills":"","talents":"","abilities":"","actions":"","equipment":"","difficulty":null},
    {"name":"Johnny Mason","introduction":"You peer up on stage to a middle-aged man with a matching pair of purple clothing littered with pink flowers and a beige cowboy hat playing a golden fiddle.","reason":"Johnny has the ability to play anything with a stringed instrument. When he plays, he can see the weakness of all who hears it.","personality":"Johnny is friendly but keeps many things secret. He will never outright ignore you and will always play music when asked. He speaks with a heavy southern accent.","spawnLocations":"11","associatedGroup":"None","hidden":"Yes","importantAffiliations":"None","fighter":"No","stats":"","soak":null,"wounds":null,"strain":null,"defenses":"","skills":"","talents":"","abilities":"","actions":"","equipment":"","difficulty":null},
    {"name":"Kimiko","introduction":"Varies, but always female with a large dress.","reason":"Kimiko leads one of the subgroups in the Masked Maidens","personality":"Varies, but generally leans towards courteous and friendly.","spawnLocations":"Station 1/Station 2/Station 3","associatedGroup":"The Masked Maidens","hidden":"Yes","importantAffiliations":"None","fighter":"Yes","stats":"2/5/5/5/5/2","soak":9,"wounds":36,"strain":43,"defenses":"3/3","skills":"Charm 4/Cool 3/Deception 4/Ranged 3","talents":"Sense Emotions: Add a boost to all charm, coercion, and Deception checks/Signature Spell: Reduce difficulty by 1 when using flaming orbs attack","abilities":"Conjure Flames: As a maneuver, Kimiko can create 4 flaming orbs around her, up to a maximum of 8./Multi-attack: Kimiko may attack as many times as she has orbs conjured, each with thier own attack roll, as part of the same action.","actions":"Flame Orbs: Ranged; Damage 6; Critical 0; Range [Long]; Stun 2; Burn 2","equipment":"None","difficulty":4},
    {"name":"Knox Kane","introduction":"A roughly 35 year-old man with short brown hair, stubby facial hair, green eyes, and square lens glasses grabs your arm, standing at an even 6 feet tall.","reason":"Knox lives in the dome of Level 148 and has a mutual agreement with the entity there, helping wanderers be safe. In addition, Knox knows a lot about the Backrooms and will share willingly.","personality":"Knox is a introverted person but is very calm, confident, and friendly.","spawnLocations":"148","associatedGroup":"None","hidden":"Yes","importantAffiliations":"None","fighter":"No","stats":"","soak":null,"wounds":null,"strain":null,"defenses":"","skills":"","talents":"","abilities":"","actions":"","equipment":"","difficulty":null},
    {"name":"Leo Castellos","introduction":"A chiseled man with dark hair and eyes with long facial hair standing at around 5 foot 7 inches, appearing to be in his 30s, anounces his presence from down the hallway.","reason":"Leo is an expert in entities biology and behavior and will share his notes. He also is the curator and manager of a museum on level 222.","personality":"Leo is straightforward and blunt but very passive. He doesn't understand a lot newer words or slang as he is over 2000 years old from Athens, Greece.","spawnLocations":"11/222","associatedGroup":"The Lost","hidden":"Yes","importantAffiliations":"None","fighter":"No","stats":"","soak":null,"wounds":null,"strain":null,"defenses":"","skills":"","talents":"","abilities":"","actions":"","equipment":"","difficulty":null},
    {"name":"Charles Turner","introduction":"A young man in a black cloak with glowing red eyes.","reason":"Charles can tame death rats and has used them to attack anybody associated with the MEG.","personality":"Unknown.","spawnLocations":"1/2/3/4","associatedGroup":"The Major Explorer Group","hidden":"Yes","importantAffiliations":"None","fighter":"Yes","stats":"2/2/4/3/3/4","soak":7,"wounds":28,"strain":33,"defenses":"2/2","skills":"Leadership 3","talents":"None","abilities":"Leader of the Rats: As an action, Charles may add his Leadership as damage to the next attack from a Death Rat.","actions":"Control Rat: As a maneuver, command the death rats to do something that would not harm himself or any of the rats directly./Death Rat Whistle: Once per encounter as an action, summon 6 Death Rats.","equipment":"Death Rat Whistle","difficulty":5},
    {"name":"Tom Von Haderach","introduction":"A teenage boy with shoulder-length blonde wavy hair and purple eyes wearing a black leather jacket runs by you with a nod.","reason":"Tom is Blanche's Butler. He has useful information and free access to the Cygnus Archive.","personality":"Tom is a regular teenage boy, making jokes and acting carefree.","spawnLocations":"All","associatedGroup":"None","hidden":"Yes","importantAffiliations":"Blanche","fighter":"No","stats":"","soak":null,"wounds":null,"strain":null,"defenses":"","skills":"","talents":"","abilities":"","actions":"","equipment":"","difficulty":null}]
    
*/