import React, { useState, useEffect } from 'react';
import { Box,Button,Card,CardContent,CardHeader,FormControl,Grid,InputLabel,MenuItem,Paper,Select,Stack,TextField,Typography,Chip,IconButton,Collapse,Badge,Fab,Snackbar,Alert,alpha,useTheme } from '@mui/material';
import { Search,FilterList,Clear,Add,Build,ExpandMore,ExpandLess,Construction,Tune } from '@mui/icons-material';
import { collection, doc, onSnapshot, orderBy, query, setDoc } from "firebase/firestore";
import db from '../Components/firebase';
import Craft from "../Components/crafts";
import NotLoggedIn from "../Components/notLoggedIn";

export default function Crafting() {
  const [crafts, setCrafts] = useState([]);
  const [difficulty, setDifficulty] = useState('None');
  const [name, setName] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  
  const theme = useTheme();
  const data = [{"name":"Worn Sack","components":"Mobile Vacuum Cleaner's Debris Container (Object 83)/A worn down bag of some kind","skills":"Crafting (General)","baseDifficulty":"5","baseAttempts":3,"hidden":"Yes","dynamicMaterial":"None","difficultyModifier":"None","attemptsModifier":"None","dynamicEffect":"None"},
    {"name":"Armorer's Tools","components":"Component 1/Component 2/Dynamic Component","skills":"Metalworking","baseDifficulty":"1","baseAttempts":3,"hidden":"Yes","dynamicMaterial":"None/Solid Silence/Piece 2","difficultyModifier":"0/+2/+4","attemptsModifier":"0/-1/-2","dynamicEffect":"Nothing/You gain an explosive boost to anything you craft with this tool. You automatically gain 1 success per beaker used in the creation of the Solid Silence used/Effect 3"},
    {"name":"Blacksmith Tools","components":"Component 1/Component 2/Dynamic Component","skills":"Metalworking","baseDifficulty":"Dynamic","baseAttempts":3,"hidden":"Yes","dynamicMaterial":"None/Solid Silence/Piece 2","difficultyModifier":"0/+2/+4","attemptsModifier":"0/-1/-2","dynamicEffect":"Nothing/You gain an explosive boost to anything you craft with this tool. You automatically gain 1 success per beaker used in the creation of the Solid Silence used/Effect 3"},
    {"name":"Goldsmith Tools","components":"Component 1/Component 2/Dynamic Component","skills":"Metalworking","baseDifficulty":"Dynamic","baseAttempts":3,"hidden":"Yes","dynamicMaterial":"None/Solid Silence/Piece 2","difficultyModifier":"0/+2/+4","attemptsModifier":"0/-1/-2","dynamicEffect":"Nothing/You gain an explosive boost to anything you craft with this tool. You automatically gain 1 success per beaker used in the creation of the Solid Silence used/Effect 3"},
    {"name":"Leatherworker's Tools","components":"Component 1/Component 2/Dynamic Component","skills":"Leatherworking","baseDifficulty":"Dynamic","baseAttempts":3,"hidden":"Yes","dynamicMaterial":"None/Solid Silence/Piece 2","difficultyModifier":"0/+2/+4","attemptsModifier":"0/-1/-2","dynamicEffect":"Nothing/You gain an explosive boost to anything you craft with this tool. You automatically gain 1 success per beaker used in the creation of the Solid Silence used/Effect 3"},
    {"name":"Weaver's Tools","components":"Component 1/Component 2/Dynamic Component","skills":"Leatherworking","baseDifficulty":"Dynamic","baseAttempts":3,"hidden":"Yes","dynamicMaterial":"None/Solid Silence/Piece 2","difficultyModifier":"0/+2/+4","attemptsModifier":"0/-1/-2","dynamicEffect":"Nothing/You gain an explosive boost to anything you craft with this tool. You automatically gain 1 success per beaker used in the creation of the Solid Silence used/Effect 3"},
    {"name":"Alchemist Tools","components":"Component 1/Component 2/Dynamic Component","skills":"Metalworking","baseDifficulty":"Dynamic","baseAttempts":3,"hidden":"Yes","dynamicMaterial":"None/Solid Silence/Piece 2","difficultyModifier":"0/+2/+4","attemptsModifier":"0/-1/-2","dynamicEffect":"Nothing/You gain an explosive boost to anything you craft with this tool. You automatically gain 1 success per beaker used in the creation of the Solid Silence used/Effect 3"},
    {"name":"Carpenter Tools","components":"Component 1/Component 2/Dynamic Component","skills":"Crafting (General)","baseDifficulty":"Dynamic","baseAttempts":3,"hidden":"Yes","dynamicMaterial":"None/Solid Silence/Piece 2","difficultyModifier":"0/+2/+4","attemptsModifier":"0/-1/-2","dynamicEffect":"Nothing/You gain an explosive boost to anything you craft with this tool. You automatically gain 1 success per beaker used in the creation of the Solid Silence used/Effect 3"},
    {"name":"Culinarian Tools","components":"Component 1/Component 2/Dynamic Component","skills":"Metalworking/Leatherworking","baseDifficulty":"Dynamic","baseAttempts":3,"hidden":"Yes","dynamicMaterial":"None/Solid Silence/Piece 2","difficultyModifier":"0/+2/+4","attemptsModifier":"0/-1/-2","dynamicEffect":"Nothing/You gain an explosive boost to anything you craft with this tool. You automatically gain 1 success per beaker used in the creation of the Solid Silence used/Effect 3"},
    {"name":"Miner tools","components":"Component 1/Component 2/Dynamic Component","skills":"Metalworking","baseDifficulty":"Dynamic","baseAttempts":3,"hidden":"Yes","dynamicMaterial":"None/Solid Silence/Piece 2","difficultyModifier":"0/+2/+4","attemptsModifier":"0/-1/-2","dynamicEffect":"Nothing/You gain an explosive boost to anything you craft with this tool. You automatically gain 1 success per beaker used in the creation of the Solid Silence used/Effect 3"},
    {"name":"Botanist tools","components":"Component 1/Component 2/Dynamic Component","skills":"Metalworking","baseDifficulty":"Dynamic","baseAttempts":3,"hidden":"Yes","dynamicMaterial":"None/Solid Silence/Piece 2","difficultyModifier":"0/+2/+4","attemptsModifier":"0/-1/-2","dynamicEffect":"Nothing/You gain an explosive boost to anything you craft with this tool. You automatically gain 1 success per beaker used in the creation of the Solid Silence used/Effect 3"},
    {"name":"Ring of Retries","components":"Component 1/Component 2/Component 3","skills":"Metalworking","baseDifficulty":"5","baseAttempts":2,"hidden":"Yes","dynamicMaterial":"None","difficultyModifier":"None","attemptsModifier":"None","dynamicEffect":"None"},
    {"name":"Ring of Teleportation","components":"Component 1/Component 2/Component 3","skills":"Metalworking","baseDifficulty":"5","baseAttempts":1,"hidden":"Yes","dynamicMaterial":"None","difficultyModifier":"None","attemptsModifier":"None","dynamicEffect":"None"},
    {"name":"Helm of Invulnerability","components":"Component 1/Component 2/Component 3","skills":"Metalworking","baseDifficulty":"3","baseAttempts":3,"hidden":"Yes","dynamicMaterial":"None","difficultyModifier":"None","attemptsModifier":"None","dynamicEffect":"None"}]

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
        await setDoc(doc(db, 'Crafts', data[i].name), {
          name: data[i].name,
          components: data[i].components,
          skills: data[i].skills,
          baseDifficulty: data[i].baseDifficulty,
          baseAttempts: data[i].baseAttempts,
          hidden: data[i].hidden,
          dynamicMaterial: data[i].dynamicMaterial,
          difficultyModifier: data[i].difficultyModifier,
          attemptsModifier: data[i].attemptsModifier,
          dynamicEffect: data[i].dynamicEffect
        });
      }
      showToast('Crafting data added successfully!');
    } catch (error) {
      showToast('Error adding crafting data', 'error');
      console.error(error);
    }
  };

  const getFromDB = () => {
    const q = query(collection(db, 'Crafts'), orderBy("name", "asc"));
    const unsub = onSnapshot(q, (querySnapshot) => {
      const queryData = [];
      querySnapshot.forEach((doc) => {
        queryData.push(doc.data());
      });
      setCrafts(queryData);
      setLoading(false);
    });

    return () => { unsub(); };
  };

  const DisplayItems = () => {
    let empty = true;
    const filteredItems = [];

    crafts.forEach((item, index) => {
      if(
        (item.baseDifficulty === difficulty || difficulty === 'None') &&
        (item.name.toUpperCase().includes(name.toUpperCase()) || name === '') &&
        (item.hidden === 'No' || localStorage.getItem('loggedIn')?.toUpperCase() === 'ADMIN')
      ) {
        empty = false;
        filteredItems.push(<Craft key={index} currCraft={item} />);
      }
    });

    return (
      <Box sx={{ mt: 3 }}>
        {empty ? (
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
            <Build sx={{ fontSize: 60, color: 'grey.300', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No crafts found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try adjusting your search criteria to find more crafting recipes
            </Typography>
          </Paper>
        ) : (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Construction color="primary" />
              Found {filteredItems.length} crafting recipe{filteredItems.length !== 1 ? 's' : ''}
            </Typography>
            <Stack direction="row" flexWrap="wrap" gap={2}>
              {filteredItems}
            </Stack>
          </Box>
        )}
      </Box>
    );
  };

  const clearAllFilters = () => {
    setName('');
    setDifficulty('None');
    showToast('All filters cleared');
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (name !== '') count++;
    if (difficulty !== 'None') count++;
    return count;
  };

  const getFilteredCount = () => {
    return crafts.filter((item) => 
      (item.baseDifficulty === difficulty || difficulty === 'None') &&
      (item.name.toUpperCase().includes(name.toUpperCase()) || name === '') &&
      (item.hidden === 'No' || localStorage.getItem('loggedIn')?.toUpperCase() === 'ADMIN')
    ).length;
  };

  const getDifficultyLabel = (diff) => {
    const labels = {
      '1': 'Simple (1)',
      '2': 'Easy (2)', 
      '3': 'Average (3)',
      '4': 'Hard (4)',
      '5': 'Daunting (5)'
    };
    return labels[diff] || diff;
  };

  useEffect(() => {
    if (localStorage.getItem("loggedIn") !== 'false') {
      getFromDB();
    }
  }, []);

  if (localStorage.getItem("loggedIn") === 'false') {
    return <NotLoggedIn />;
  }

  const FilterSection = () => (
    <Box>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={6} md={6}>
          <FormControl fullWidth size="small">
            <InputLabel id="difficulty-label">Base Difficulty</InputLabel>
            <Select
              labelId="difficulty-label"
              label="Base Difficulty"
              onChange={(e) => setDifficulty(e.target.value)}
              value={difficulty}
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="None">Any Difficulty</MenuItem>
              <MenuItem value="1">Simple (1)</MenuItem>
              <MenuItem value="2">Easy (2)</MenuItem>
              <MenuItem value="3">Average (3)</MenuItem>
              <MenuItem value="4">Hard (4)</MenuItem>
              <MenuItem value="5">Daunting (5)</MenuItem>
              <MenuItem value="Dynamic">Dynamic</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={6}>
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
            {difficulty !== 'None' && (
              <Chip
                label={`Difficulty: ${getDifficultyLabel(difficulty)}`}
                onDelete={() => setDifficulty('None')}
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
          background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
          color: 'white',
          p: { xs: 2, sm: 3 }
        }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
            <Box>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                Crafting Workshop
              </Typography>
              <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                Discover and search through crafting recipes
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
              Loading crafting recipes...
            </Typography>
          </Box>
        ) : crafts.length > 0 ? (
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
                        label={`${getFilteredCount()} recipes`} 
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
                    placeholder="Search crafting recipes by name..."
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
                  <FilterSection />
                </Box>
                
                <Collapse in={filtersOpen} sx={{ display: { xs: 'block', md: 'none' } }}>
                  <FilterSection />
                </Collapse>
              </CardContent>
            </Card>

            {/* Results */}
            <DisplayItems />
          </Box>
        ) : (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
            <Typography variant="h6" color="text.secondary">
              No crafting recipes available
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
Worn Sack:
  Made from the Object Mobile Vacuum Cleaner's (Object 83) debris container and a well used bag of any kind.
*/