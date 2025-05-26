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
  Tune,
  ArrowBack,
  Security
} from '@mui/icons-material';
import { collection, doc, onSnapshot, orderBy, query, setDoc } from "firebase/firestore";
import db from '../Components/firebase';
import WeaponItem from "../Components/weaponItem";
import NotLoggedIn from "../Components/notLoggedIn";

export default function Weapons() {
  const [weapons, setWeapons] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('-1');
  const [rarity, setRarity] = useState('-1');
  const [setBonus, setSetBonus] = useState('-');
  const [skillFilter, setSkillFilter] = useState('');
  const [rangeFilter, setRangeFilter] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const [showDetails, setShowDetails] = useState(false);
  const [selectedWeapon, setSelectedWeapon] = useState(null);

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
        await setDoc(doc(db, 'Weapons', data[i].name), {
          name: data[i].name,
          description: data[i].description,
          skill: data[i].skill,
          damage: data[i].damage,
          crit: data[i].crit,
          range: data[i].range,
          encumbrance: data[i].encumbrance,
          price: data[i].price,
          rarity: data[i].rarity,
          specials: data[i].specials,
          durability: data[i].durability,
          spawnLocations: data[i].spawnLocations,
          setBonus: data[i].setBonus,
          anomalousEffect: data[i].anomalousEffect,
          hidden: data[i].hidden,
          repairSkill: data[i].repairSkill
        });
      }
      showToast('Weapon data added successfully!');
    } catch (error) {
      showToast('Error adding weapon data', 'error');
      console.error(error);
    }
  };

  const getFromDB = () => {
    const q = query(collection(db, 'Weapons'), orderBy("name", "asc"));
    const unsub = onSnapshot(q, (querySnapshot) => {
      const queryData = [];
      querySnapshot.forEach((doc) => {
        queryData.push(doc.data());
      });
      setWeapons(queryData);
      setLoading(false);
    });

    return () => { unsub(); };
  };

  const getSetBonusList = () => {
    const bonusSet = new Set();
    weapons.forEach(weapon => {
      if (weapon.setBonus && weapon.setBonus !== 'None' && typeof weapon.setBonus === 'string') {
        bonusSet.add(weapon.setBonus);
      }
    });
    return Array.from(bonusSet).sort();
  };

  const getUniqueSkills = () => {
    const skills = [...new Set(weapons.map(weapon => weapon.skill).filter(skill => skill && typeof skill === 'string' && skill.trim() !== ''))];
    return skills.sort();
  };

  const getUniqueRanges = () => {
    const ranges = [...new Set(weapons.map(weapon => weapon.range).filter(range => range && typeof range === 'string' && range.trim() !== ''))];
    return ranges.sort();
  };

  const getFilteredWeapons = () => {
    return weapons.filter(weapon => {
      const matchesName = !name || 
        (weapon.name && weapon.name.toLowerCase().includes(name.toLowerCase())) ||
        (weapon.setBonus && weapon.setBonus.toLowerCase().includes(name.toLowerCase())) ||
        (weapon.description && weapon.description.toLowerCase().includes(name.toLowerCase()));
      
      const matchesPrice = price === '-1' || 
        (price === '10' && weapon.price >= 10) || 
        (price !== '10' && weapon.price === parseInt(price));
      
      const matchesRarity = rarity === '-1' || weapon.rarity === parseInt(rarity);
      const matchesSetBonus = setBonus === '-' || weapon.setBonus === setBonus;
      const matchesSkill = !skillFilter || weapon.skill === skillFilter;
      const matchesRange = !rangeFilter || weapon.range === rangeFilter;
      const matchesVisibility = weapon.hidden === 'No' || localStorage.getItem('loggedIn')?.toUpperCase() === 'ADMIN';
      
      return matchesName && matchesPrice && matchesRarity && matchesSetBonus && 
             matchesSkill && matchesRange && matchesVisibility;
    });
  };

  const clearAllFilters = () => {
    setName('');
    setPrice('-1');
    setRarity('-1');
    setSetBonus('-');
    setSkillFilter('');
    setRangeFilter('');
    showToast('All filters cleared');
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (name !== '') count++;
    if (price !== '-1') count++;
    if (rarity !== '-1') count++;
    if (setBonus !== '-') count++;
    if (skillFilter !== '') count++;
    if (rangeFilter !== '') count++;
    return count;
  };

  const getFilteredCount = () => {
    return getFilteredWeapons().length;
  };

  const handleWeaponSelect = (weapon) => {
    setSelectedWeapon(weapon);
    if (isMobile) {
      setShowDetails(true);
    }
  };

  const handleBackToList = () => {
    setShowDetails(false);
  };

  const getSkillColor = (skill) => {
    const skillColors = {
      'melee': 'error',
      'ranged': 'primary',
      'brawl': 'warning',
      'lightsaber': 'secondary',
      'gunnery': 'info',
      'thrown': 'success'
    };
    return skillColors[skill?.toLowerCase()] || 'default';
  };

  const DisplayItems = () => {
    const filteredWeapons = getFilteredWeapons();

    return (
      <Box sx={{ mt: 3 }}>
        {filteredWeapons.length === 0 ? (
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
              No weapons found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try adjusting your search criteria to find more weapons
            </Typography>
          </Paper>
        ) : (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              Found {filteredWeapons.length} weapon{filteredWeapons.length !== 1 ? 's' : ''}
            </Typography>
            <Stack direction="row" flexWrap="wrap" gap={2}>
              {filteredWeapons.map((weapon, index) => (
                <WeaponItem key={index} currWeapon={weapon} />
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
        <Grid item xs={12} sm={6} md={2}>
          <FormControl fullWidth size="small">
            <InputLabel id="price-label">Price Range</InputLabel>
            <Select
              labelId="price-label"
              label="Price Range"
              onChange={(e) => setPrice(e.target.value)}
              value={price}
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="-1">Any Price</MenuItem>
              <MenuItem value="0">Free (0)</MenuItem>
              <MenuItem value="1">Budget (1)</MenuItem>
              <MenuItem value="2">Cheap (2)</MenuItem>
              <MenuItem value="3">Affordable (3)</MenuItem>
              <MenuItem value="4">Moderate (4)</MenuItem>
              <MenuItem value="5">Standard (5)</MenuItem>
              <MenuItem value="6">Premium (6)</MenuItem>
              <MenuItem value="7">Expensive (7)</MenuItem>
              <MenuItem value="8">Luxury (8)</MenuItem>
              <MenuItem value="9">Elite (9)</MenuItem>
              <MenuItem value="10">Legendary (10+)</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <FormControl fullWidth size="small">
            <InputLabel id="rarity-label">Rarity Level</InputLabel>
            <Select
              labelId="rarity-label"
              label="Rarity Level"
              onChange={(e) => setRarity(e.target.value)}
              value={rarity}
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="-1">Any Rarity</MenuItem>
              <MenuItem value="0">Common (0)</MenuItem>
              <MenuItem value="1">Uncommon (1)</MenuItem>
              <MenuItem value="2">Rare (2)</MenuItem>
              <MenuItem value="3">Epic (3)</MenuItem>
              <MenuItem value="4">Legendary (4)</MenuItem>
              <MenuItem value="5">Mythic (5)</MenuItem>
              <MenuItem value="6">Divine (6)</MenuItem>
              <MenuItem value="7">Cosmic (7)</MenuItem>
              <MenuItem value="8">Transcendent (8)</MenuItem>
              <MenuItem value="9">Omnipotent (9)</MenuItem>
              <MenuItem value="10">Absolute (10)</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <FormControl fullWidth size="small">
            <InputLabel id="set-label">Set Bonus</InputLabel>
            <Select
              labelId="set-label"
              label="Set Bonus"
              onChange={(e) => setSetBonus(e.target.value)}
              value={setBonus}
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="-">No Set Filter</MenuItem>
              <MenuItem value="None">No Set Bonus</MenuItem>
              {getSetBonusList().map(bonus => (
                <MenuItem key={bonus} value={bonus}>{bonus}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <FormControl fullWidth size="small">
            <InputLabel id="skill-label">Weapon Skill</InputLabel>
            <Select
              labelId="skill-label"
              label="Weapon Skill"
              onChange={(e) => setSkillFilter(e.target.value)}
              value={skillFilter}
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="">Any Skill</MenuItem>
              {getUniqueSkills().map(skill => (
                <MenuItem key={skill} value={skill}>{skill}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <FormControl fullWidth size="small">
            <InputLabel id="range-label">Range Type</InputLabel>
            <Select
              labelId="range-label"
              label="Range Type"
              onChange={(e) => setRangeFilter(e.target.value)}
              value={rangeFilter}
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="">Any Range</MenuItem>
              {getUniqueRanges().map(range => (
                <MenuItem key={range} value={range}>{range}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
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
                label={`Search: "${name}"`}
                onDelete={() => setName('')}
                color="primary"
                variant="outlined"
                size="small"
              />
            )}
            {price !== '-1' && (
              <Chip
                label={`Price: ${price === '10' ? '10+' : price}`}
                onDelete={() => setPrice('-1')}
                color="primary"
                variant="outlined"
                size="small"
              />
            )}
            {rarity !== '-1' && (
              <Chip
                label={`Rarity: ${rarity}`}
                onDelete={() => setRarity('-1')}
                color="primary"
                variant="outlined"
                size="small"
              />
            )}
            {setBonus !== '-' && (
              <Chip
                label={`Set: ${setBonus}`}
                onDelete={() => setSetBonus('-')}
                color="primary"
                variant="outlined"
                size="small"
              />
            )}
            {skillFilter && (
              <Chip
                label={`Skill: ${skillFilter}`}
                onDelete={() => setSkillFilter('')}
                color="primary"
                variant="outlined"
                size="small"
              />
            )}
            {rangeFilter && (
              <Chip
                label={`Range: ${rangeFilter}`}
                onDelete={() => setRangeFilter('')}
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

  const renderWeaponsList = () => {
    const filteredWeapons = getFilteredWeapons();

    if (filteredWeapons.length === 0) {
      return (
        <Box sx={{ textAlign: 'center', py: 4, px: 2 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {getActiveFilterCount() > 0 ? 
              'No weapons match your filters' : 'No weapons found'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your search or filters
          </Typography>
        </Box>
      );
    }

    return (
      <Stack spacing={1} sx={{ p: 2 }}>
        {filteredWeapons.map((weapon, index) => {
          const isSelected = selectedWeapon?.name === weapon.name;
          
          return (
            <Card 
              key={`weapon-${weapon.name}-${index}`}
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
              onClick={() => handleWeaponSelect(weapon)}
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
                      {weapon.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {weapon.skill && `${weapon.skill} weapon`}
                      {weapon.damage && ` • Damage: ${weapon.damage}`}
                    </Typography>
                  </Box>
                  <Stack direction="row" spacing={0.5} flexShrink={0}>
                    {weapon.skill && (
                      <Chip 
                        label={weapon.skill}
                        color={getSkillColor(weapon.skill)}
                        size="small"
                        variant="filled"
                        sx={{ fontSize: '0.7rem', height: '24px' }}
                      />
                    )}
                    {weapon.rarity !== undefined && (
                      <Chip 
                        label={`R${weapon.rarity}`}
                        color="secondary"
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
                  {weapon.description || weapon.specials || 'No description available'}
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
                  {selectedWeapon?.name || 'Weapon Details'}
                </Typography>
              </>
            ) : (
              <>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                  Weapons ({getFilteredCount()})
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
                {selectedWeapon && <WeaponItem currWeapon={selectedWeapon} />}
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
                    placeholder="Search by name, set bonus, or description..."
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

            {/* Weapons List */}
            <Box sx={{ pb: 8 }}>
              {renderWeaponsList()}
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
          background: 'linear-gradient(135deg, #FF5722 0%, #FF8A50 100%)',
          color: 'white'
        }}
      >
        <Box sx={{ 
          p: { xs: 2, sm: 3 }
        }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
            <Box>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                Weapon Arsenal
              </Typography>
              <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                Browse and search through available weapons
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
              Loading weapon arsenal...
            </Typography>
          </Box>
        ) : weapons.length > 0 ? (
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
                        label={`${getFilteredCount()} weapons`} 
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
                    placeholder="Search by name, set bonus, or description..."
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
              No weapon data available
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
[{"name":"Axe","description":"A typical single-blade axe with a wooden handle","skill":"Melee","damage":3,"crit":3,"range":"Engaged","encumbrance":2,"price":2,"rarity":1,"specials":"Vicious 1/Dual-wield","durability":3,"spawnLocations":"All","setBonus":"None","anomalousEffect":"None","hidden":"No","repairSkill":"Carpenter"},
    {"name":"Greataxe","description":"A double sided metallic axe with a wooden handle","skill":"Melee","damage":4,"crit":3,"range":"Engaged","encumbrance":4,"price":5,"rarity":4,"specials":"Cumbersome 3/Pierce 2/Vicious 1","durability":3,"spawnLocations":"All","setBonus":"None","anomalousEffect":"None","hidden":"No","repairSkill":"Blacksmith"},
    {"name":"Halberd","description":"A polearm with a blade at the tip and side of the tip","skill":"Melee","damage":3,"crit":3,"range":"Engaged","encumbrance":5,"price":4,"rarity":3,"specials":"Defensive 1/Pierce 3/Reach","durability":3,"spawnLocations":"All","setBonus":"None","anomalousEffect":"None","hidden":"No","repairSkill":"Blacksmith"},
    {"name":"Knife","description":"A simple steel knife that looks like its used to cut steak.","skill":"Melee","damage":1,"crit":3,"range":"Engaged","encumbrance":1,"price":2,"rarity":1,"specials":"None","durability":3,"spawnLocations":"All","setBonus":"None","anomalousEffect":"None","hidden":"No","repairSkill":"Blacksmith"},
    {"name":"Tear Gas","description":"A small cannister that releases visible smoke when the pin is pulled.","skill":"Ranged","damage":2,"crit":0,"range":"Short","encumbrance":1,"price":3,"rarity":2,"specials":"Blast 3/Stun Damage/Disorient 2/Limited Ammo 1/Burn 3/Breaking","durability":1,"spawnLocations":"All","setBonus":"None","anomalousEffect":"None","hidden":"No","repairSkill":"Alchemist"},
    {"name":"Bola","description":"A group of 3 stone balls attacked by a long and slender rope.","skill":"Ranged","damage":5,"crit":3,"range":"Short","encumbrance":1,"price":5,"rarity":4,"specials":"Knockdown/Accurate 2/Ensnare/Limited Ammo 1/Unwieldy 3","durability":5,"spawnLocations":"All","setBonus":"None","anomalousEffect":"None","hidden":"No","repairSkill":"Weaver"},
    {"name":"Boomerang","description":"A curved piece of wood that upon being thrown, will return to the thrower.","skill":"Ranged","damage":3,"crit":2,"range":"Medium","encumbrance":0,"price":2,"rarity":1,"specials":"Vicious 2/Stun 2/Limited Ammo 1/Concussive 1/Unwieldy 4","durability":4,"spawnLocations":"All","setBonus":"None","anomalousEffect":"None","hidden":"No","repairSkill":"Carpenter"},
    {"name":"Crossbow","description":"A mechanism with a short bow affixed to a stock.","skill":"Ranged","damage":7,"crit":2,"range":"Medium","encumbrance":3,"price":5,"rarity":4,"specials":"Pierce 2/Prepare 1","durability":3,"spawnLocations":"All","setBonus":"None","anomalousEffect":"None","hidden":"No","repairSkill":"Blacksmith"},
    {"name":"Longbow","description":"A large bow","skill":"Ranged","damage":8,"crit":3,"range":"Long","encumbrance":3,"price":5,"rarity":4,"specials":"Unwieldy 3","durability":3,"spawnLocations":"All","setBonus":"None","anomalousEffect":"None","hidden":"No","repairSkill":"Carpenter"},
    {"name":"Flame Thrower","description":"A backpack with two tanks full of gasoline and a nozel connected that spews flames","skill":"Ranged","damage":4,"crit":0,"range":"Short","encumbrance":3,"price":9,"rarity":8,"specials":"Auto-Fire/Burn 5/Limited Ammo 50","durability":3,"spawnLocations":"All","setBonus":"None","anomalousEffect":"None","hidden":"Yes","repairSkill":"Blacksmith"},
    {"name":"Crude Club","description":"A heavy stick","skill":"Melee","damage":2,"crit":3,"range":"Engaged","encumbrance":2,"price":1,"rarity":0,"specials":"Concussive 1/Inferior/Breaking","durability":3,"spawnLocations":"All","setBonus":"None","anomalousEffect":"None","hidden":"No","repairSkill":"Carpenter"},
    {"name":"Spear","description":"A long wooden shaft with a sharp metal point","skill":"Melee","damage":2,"crit":4,"range":"Engaged","encumbrance":2,"price":2,"rarity":1,"specials":"Defensive 1/Accurate 1/Reach","durability":3,"spawnLocations":"All","setBonus":"None","anomalousEffect":"None","hidden":"No","repairSkill":"Blacksmith"},
    {"name":"Pike","description":"A long heavy wooden shaft with a small leaf-shaped steel point","skill":"Melee","damage":4,"crit":3,"range":"Short","encumbrance":5,"price":6,"rarity":5,"specials":"Pierce 2/Defense 1/Innacurate 1/Cumbersome 4","durability":3,"spawnLocations":"All","setBonus":"None","anomalousEffect":"None","hidden":"No","repairSkill":"Carpenter"},
    {"name":"Sword","description":"A straightened metal blade with a wide base and a pointy tip","skill":"Melee","damage":3,"crit":2,"range":"Engaged","encumbrance":1,"price":3,"rarity":2,"specials":"Defensive 1","durability":3,"spawnLocations":"All","setBonus":"None","anomalousEffect":"None","hidden":"No","repairSkill":"Blacksmith"},
    {"name":"Saber","description":"A thin metal blade with a piercing tip","skill":"Melee","damage":2,"crit":2,"range":"Engaged","encumbrance":1,"price":3,"rarity":2,"specials":"Pierce 1","durability":3,"spawnLocations":"All","setBonus":"None","anomalousEffect":"None","hidden":"No","repairSkill":"Blacksmith"},
    {"name":"Tomahawk","description":"A smaller single-sided hatchet. It can be thrown.","skill":"Melee","damage":2,"crit":3,"range":"Engaged","encumbrance":1,"price":2,"rarity":1,"specials":"None","durability":3,"spawnLocations":"All","setBonus":"None","anomalousEffect":"None","hidden":"No","repairSkill":"Carpenter"},
    {"name":"Grenade","description":"A small, usually green, egg-shaped device with a pin","skill":"Ranged","damage":8,"crit":3,"range":"Short","encumbrance":1,"price":7,"rarity":6,"specials":"Blast 5/Burn 1/Limited Ammo 1","durability":1,"spawnLocations":"All","setBonus":"None","anomalousEffect":"None","hidden":"No","repairSkill":"Blacksmith"},
    {"name":"Bazooka","description":"A large tube with two handles","skill":"Gunnery","damage":20,"crit":2,"range":"Extreme","encumbrance":8,"price":10,"rarity":9,"specials":"Blast 10/Breach 2/Cumbersome 3/Guided 3/Limited Ammo 1/Prepare 1","durability":3,"spawnLocations":"All","setBonus":"None","anomalousEffect":"None","hidden":"Yes","repairSkill":"Blacksmith"},
    {"name":"Blowgun","description":"A small bamboo tube","skill":"Ranged","damage":2,"crit":5,"range":"Short","encumbrance":0,"price":1,"rarity":0,"specials":"None","durability":1,"spawnLocations":"All","setBonus":"None","anomalousEffect":"None","hidden":"No","repairSkill":"Carpenter"},
    {"name":"Carbine","description":"A light, short-barelled rifle.","skill":"Ranged","damage":8,"crit":3,"range":"Long","encumbrance":2,"price":5,"rarity":4,"specials":"Accurate 1/Limited Ammo 2","durability":3,"spawnLocations":"All","setBonus":"None","anomalousEffect":"None","hidden":"No","repairSkill":"Blacksmith"},
    {"name":"Pistol","description":"A small black barrel with a grip and a trigger","skill":"Ranged","damage":6,"crit":3,"range":"Medium","encumbrance":1,"price":4,"rarity":3,"specials":"None","durability":3,"spawnLocations":"All","setBonus":"None","anomalousEffect":"None","hidden":"No","repairSkill":"Blacksmith"},
    {"name":"Revolver","description":"Similar to a pistol but with a cylinder that rotates","skill":"Ranged","damage":6,"crit":4,"range":"Medium","encumbrance":2,"price":5,"rarity":4,"specials":"Accurate 1/Limited Ammo 6","durability":3,"spawnLocations":"All","setBonus":"None","anomalousEffect":"None","hidden":"No","repairSkill":"Blacksmith"},
    {"name":"Shotgun","description":"A smoothbore shoulder weapon that fires multiple pellets","skill":"Ranged","damage":8,"crit":3,"range":"Short","encumbrance":3,"price":4,"rarity":3,"specials":"Blast 4/Knockdown/Vicious 2","durability":3,"spawnLocations":"All","setBonus":"None","anomalousEffect":"None","hidden":"No","repairSkill":"Blacksmith"},
    {"name":"AK-47","description":"A shoulder weapon with a wooden handle and stock and a long curved metal casing for ammunition","skill":"Ranged","damage":8,"crit":3,"range":"Long","encumbrance":4,"price":8,"rarity":7,"specials":"Auto-fire","durability":3,"spawnLocations":"All","setBonus":"None","anomalousEffect":"None","hidden":"No","repairSkill":"Blacksmith"},
    {"name":"Browning Automatic Rifle","description":"A large rifle with a stand at the tip of the barrel and a metallic clip","skill":"Gunnery","damage":10,"crit":3,"range":"Long","encumbrance":6,"price":7,"rarity":6,"specials":"Auto-fire/Cumbersome 2/Pierce 2/Vicious 2","durability":3,"spawnLocations":"All","setBonus":"None","anomalousEffect":"None","hidden":"No","repairSkill":"Blacksmith"},
    {"name":"Uzi","description":"A compact automatic weapon","skill":"Ranged","damage":5,"crit":3,"range":"Medium","encumbrance":2,"price":7,"rarity":6,"specials":"Auto-fire","durability":2,"spawnLocations":"All","setBonus":"None","anomalousEffect":"None","hidden":"No","repairSkill":"Blacksmith"},
    {"name":"Antimatter Rifle","description":"A rifle about the same size as a bazooka complete with blue-ish symbols plastered on the sides","skill":"Gunnery","damage":20,"crit":3,"range":"Extreme","encumbrance":5,"price":10,"rarity":9,"specials":"Auto-fire/Burn 6/Limited Ammo 24/Breach 1/Prepare 3","durability":5,"spawnLocations":"All","setBonus":"None","anomalousEffect":"If the weapon does not kill the target, the target takes an extra 10 strain damage.","hidden":"Yes","repairSkill":"Blacksmith"},
    {"name":"Laser Pistol","description":"A pistol with glowing blue stripes","skill":"Ranged","damage":6,"crit":3,"range":"Short","encumbrance":2,"price":8,"rarity":7,"specials":"Accurate 1/Burn 1","durability":3,"spawnLocations":"All","setBonus":"None","anomalousEffect":"None","hidden":"No","repairSkill":"Goldsmith"},
    {"name":"Laser Rifle","description":"An AK-47 with glowing blue stripes","skill":"Ranged","damage":8,"crit":3,"range":"Medium","encumbrance":4,"price":8,"rarity":7,"specials":"Accurate 1/Burn 1","durability":3,"spawnLocations":"All","setBonus":"None","anomalousEffect":"None","hidden":"No","repairSkill":"Goldsmith"},
    {"name":"Retributor","description":"A simple old-style handgun, similar to a revolver","skill":"Ranged","damage":4,"crit":2,"range":"Short","encumbrance":0,"price":250,"rarity":10,"specials":"Breach 1/Stun 6","durability":100,"spawnLocations":"None","setBonus":"Holy Set","anomalousEffect":"Ammunition is not required for this weapon to fire. In addition, whenever this weapon deals the killing blow, it steals the soul and converts it into a physical soul bottle.","hidden":"Yes","repairSkill":"None"},
    {"name":"Red Knight's Replica Sword","description":"A subtle red glow surrounding a blood red blade","skill":"Melee","damage":10,"crit":2,"range":"Engaged","encumbrance":1,"price":6000,"rarity":10,"specials":"Pierce 4/Defensive 2/Superior/Vicious 4","durability":100,"spawnLocations":"None","setBonus":"Red Knight Replica Set","anomalousEffect":"When an attack is successful, a triumph may be spent to open a rift near the target. The target must then succeed on a difficulty 4 Athletics or Coordination check to not be sucked in, dying immediately. On a success however, the target loses something of the attacker's choosing whether it be a non-essential body part, a piece of gear, or some kind of memory.","hidden":"Yes","repairSkill":"None"},
    {"name":"Chechov's Gun","description":"A wooden-colored single shot rifle","skill":"Ranged","damage":8,"crit":3,"range":"Long","encumbrance":4,"price":30,"rarity":10,"specials":"Limited Ammo 1","durability":5,"spawnLocations":"None","setBonus":"None","anomalousEffect":"Ammunition is not required to fire this weapon. The firing mechanism is completely silent. This weapon only appears when near death and as it appears, a single shot that does 30 unsoakable wound damage is loaded.","hidden":"Yes","repairSkill":"Blacksmith"},
    {"name":"Shield","description":"A small circular piece of wood with a metal plate in the center.","skill":"Melee","damage":0,"crit":6,"range":"Engaged","encumbrance":2,"price":1,"rarity":0,"specials":"Defensive 1/Deflection 1/Inaccurate 1/Knockdown","durability":3,"spawnLocations":"All","setBonus":"None","anomalousEffect":"None","hidden":"No","repairSkill":"Armorer"},
    {"name":"Red Knight's Replica Shield","description":"A bulky crimson red tower shield with spiky pieces of metal pointing outwards. This may not be dual-wielded","skill":"Melee","damage":5,"crit":0,"range":"Engaged","encumbrance":3,"price":6000,"rarity":10,"specials":"Defensive 1/Deflection 1/Superior/Knockdown","durability":100,"spawnLocations":"None","setBonus":"Red Knight Replica Set","anomalousEffect":"While wielding this shield, whenever an attack is failed against you, you may spend your out-of-turn-incidental to attack.","hidden":"Yes","repairSkill":"None"},
    {"name":"Plastic Hammer","description":"A large mallet-like hammer made entirely of hardened plastic.","skill":"Melee","damage":6,"crit":3,"range":"Engaged","encumbrance":3,"price":4,"rarity":3,"specials":"Concussive 1","durability":2,"spawnLocations":"None","setBonus":"None","anomalousEffect":"None","hidden":"No","repairSkill":"None"},
    {"name":"Static Grenade Launcher","description":"A bright and unstable piece of unknown weaponry that constantly shifts with the similar feature always being a trigger, a grip, and a barrel.","skill":"Ranged","damage":41,"crit":3,"range":"Medium","encumbrance":0,"price":0,"rarity":10,"specials":"Blast 5/Burn 1/Limited Ammo 6","durability":100,"spawnLocations":"None","setBonus":"Glitched Set","anomalousEffect":"After shooting with this weapon, the area where it exploded becomes a glitchy mess. All checks made within the area automatically recieves a despair.","hidden":"Yes","repairSkill":"None"},
    {"name":"Sword of Static","description":"A bright and unstable sword that changes forms constantly yet the blade remains the same length.","skill":"Melee","damage":34,"crit":1,"range":"Engaged","encumbrance":0,"price":0,"rarity":10,"specials":"Breach 2/Disorient 4/Stun Damage/Stun 6/Superior/Vicious 4","durability":100,"spawnLocations":"None","setBonus":"Glitched Set","anomalousEffect":"Whenever you hit with this weapon, the target gains the Glitched phenomenon permanently. If the target already has this effect, instead inflict a despair on its next check.","hidden":"Yes","repairSkill":"None"},
    {"name":"Magicked Brush and Palette","description":"A pure white brush with a fine tip where the bristles meet and a long wooden handle roughly 3 feet long accompanied by a light brown tray full of colored paints that never seem to run out.","skill":"None","damage":0,"crit":0,"range":"Short","encumbrance":2,"price":2500,"rarity":10,"specials":"Breaking","durability":100,"spawnLocations":"None","setBonus":"None","anomalousEffect":"As an action, this brush may summon any entity of difficulty 1 or lower to help fight. This entity has half of its wounds and strain and deals stun damage only. While paired with the infinite bucket of paint, up to a difficulty 2 entity may be summoned and the health totals are not halved. There may only be 1 entity summoned at a time, 2 with the infinite bucket of paint.","hidden":"Yes","repairSkill":"Carpenter"},
    {"name":"Umbrella Gunsword","description":"A standard umbrella with white dots scattered on a blue base. Two small switches sit on the handle.","skill":"Melee or Ranged","damage":10,"crit":2,"range":"Medium","encumbrance":2,"price":5,"rarity":4,"specials":"Vicious 2/Sneak","durability":2,"spawnLocations":"None","setBonus":"None","anomalousEffect":"None","hidden":"Yes","repairSkill":"Weaver"},
    {"name":"Golden Axe","description":"A purely gold double sided war axe with symbols etched into the handle.","skill":"Melee","damage":10,"crit":1,"range":"Engaged","encumbrance":0,"price":100,"rarity":10,"specials":"Vicious 5/AutoHit/Anomalous","durability":100,"spawnLocations":"None","setBonus":"Golden Set","anomalousEffect":"The axe has a diety within it assisting in all attacks. Automatcally apply a critical injury whenever an attack hits.","hidden":"Yes","repairSkill":"Medicine"}]
    
*/