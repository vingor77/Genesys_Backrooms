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
  Assignment,
  Tune,
  ArrowBack,
  PlaylistAddCheck
} from '@mui/icons-material';
import { collection, doc, onSnapshot, orderBy, query, setDoc } from "firebase/firestore";
import db from '../Components/firebase';
import QuestItem from "../Components/questItem";
import NotLoggedIn from "../Components/notLoggedIn";

export default function Quests() {
  const [quests, setQuests] = useState([]);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [acquisition, setAcquisition] = useState('');
  const [questLine, setQuestLine] = useState('');
  const [completedFilter, setCompletedFilter] = useState('');
  const [questGiverFilter, setQuestGiverFilter] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const [showDetails, setShowDetails] = useState(false);
  const [selectedQuest, setSelectedQuest] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const data = [
    {"name":"Introduction","questGiver":"None","turnInLocation":"Trader's Keep","description":"Arrive at the Trader's Keep and speak with The Keeper","rewards":"4 Weapons/4 Armor/4 Gray Almond Water/A compass","completed":"No","hidden":"No","acquisition":"None","questLine":"Starter"}
  ];

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
        await setDoc(doc(db, 'Quests', data[i].name), {
          name: data[i].name,
          questGiver: data[i].questGiver,
          turnInLocation: data[i].turnInLocation,
          description: data[i].description,
          rewards: data[i].rewards,
          completed: data[i].completed,
          hidden: data[i].hidden,
          acquisition: data[i].acquisition,
          questLine: data[i].questLine
        });
      }
      showToast('Quest data added successfully!');
    } catch (error) {
      showToast('Error adding quest data', 'error');
      console.error(error);
    }
  };

  const getFromDB = () => {
    const q = query(collection(db, 'Quests'), orderBy("questLine", "asc"));
    const unsub = onSnapshot(q, (querySnapshot) => {
      const queryData = [];
      querySnapshot.forEach((doc) => {
        queryData.push(doc.data());
      });
      setQuests(queryData);
      setLoading(false);
    });

    return () => { unsub(); };
  };

  const getQuestLines = () => {
    const questLines = [...new Set(quests.map(quest => quest.questLine).filter(line => line && typeof line === 'string' && line.trim() !== ''))];
    return questLines.sort();
  };

  const getUniqueLocations = () => {
    const locations = [...new Set(quests.map(quest => quest.turnInLocation).filter(loc => loc && typeof loc === 'string' && loc.trim() !== ''))];
    return locations.sort();
  };

  const getUniqueAcquisitions = () => {
    const acquisitions = [...new Set(quests.map(quest => quest.acquisition).filter(acq => acq && typeof acq === 'string' && acq.trim() !== ''))];
    return acquisitions.sort();
  };

  const getUniqueQuestGivers = () => {
    const questGivers = [...new Set(quests.map(quest => quest.questGiver).filter(giver => giver && typeof giver === 'string' && giver.trim() !== '' && giver !== 'None'))];
    return questGivers.sort();
  };

  const getFilteredQuests = () => {
    return quests.filter(quest => {
      const matchesName = !name || 
        (quest.name && quest.name.toLowerCase().includes(name.toLowerCase())) ||
        (quest.description && quest.description.toLowerCase().includes(name.toLowerCase()));
      
      const matchesLocation = !location || 
        (quest.turnInLocation && quest.turnInLocation.toLowerCase().includes(location.toLowerCase()));
      
      const matchesAcquisition = !acquisition || 
        (quest.acquisition && quest.acquisition.toLowerCase().includes(acquisition.toLowerCase()));
      
      const matchesQuestLine = !questLine || (quest.questLine && quest.questLine === questLine);
      const matchesCompleted = !completedFilter || (quest.completed && quest.completed === completedFilter);
      const matchesQuestGiver = !questGiverFilter || (quest.questGiver && quest.questGiver === questGiverFilter);
      const matchesVisibility = quest.hidden === 'No' || localStorage.getItem('loggedIn')?.toUpperCase() === 'ADMIN';
      
      return matchesName && matchesLocation && matchesAcquisition && matchesQuestLine && 
             matchesCompleted && matchesQuestGiver && matchesVisibility;
    });
  };

  const clearAllFilters = () => {
    setName('');
    setLocation('');
    setAcquisition('');
    setQuestLine('');
    setCompletedFilter('');
    setQuestGiverFilter('');
    showToast('All filters cleared');
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (name !== '') count++;
    if (location !== '') count++;
    if (acquisition !== '') count++;
    if (questLine !== '') count++;
    if (completedFilter !== '') count++;
    if (questGiverFilter !== '') count++;
    return count;
  };

  const getFilteredCount = () => {
    return getFilteredQuests().length;
  };

  const handleQuestSelect = (quest) => {
    setSelectedQuest(quest);
    if (isMobile) {
      setShowDetails(true);
    }
  };

  const handleBackToList = () => {
    setShowDetails(false);
  };

  const getQuestLineColor = (questLine) => {
    const colors = ['primary', 'secondary', 'success', 'warning', 'error', 'info'];
    const hash = questLine?.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    return colors[Math.abs(hash) % colors.length];
  };

  const DisplayItems = () => {
    const filteredQuests = getFilteredQuests();

    return (
      <Box sx={{ mt: 3 }}>
        {filteredQuests.length === 0 ? (
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
              No quests found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try adjusting your search criteria to find more quests
            </Typography>
          </Paper>
        ) : (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Assignment color="primary" />
              Found {filteredQuests.length} quest{filteredQuests.length !== 1 ? 's' : ''}
            </Typography>
            <Stack direction="row" flexWrap="wrap" gap={2}>
              {filteredQuests.map((quest, index) => (
                <QuestItem key={index} currQuest={quest} />
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
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            size="small"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            label="Turn-in Location"
            placeholder="Enter location"
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            size="small"
            value={acquisition}
            onChange={(e) => setAcquisition(e.target.value)}
            label="Acquisition Location"
            placeholder="Enter acquisition"
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <FormControl fullWidth size="small">
            <InputLabel id="questline-label">Quest Line</InputLabel>
            <Select
              labelId="questline-label"
              label="Quest Line"
              onChange={(e) => setQuestLine(e.target.value)}
              value={questLine}
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="">Any Quest Line</MenuItem>
              {getQuestLines().map(line => (
                <MenuItem key={line} value={line}>{line}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <FormControl fullWidth size="small">
            <InputLabel id="completed-label">Completion Status</InputLabel>
            <Select
              labelId="completed-label"
              label="Completion Status"
              onChange={(e) => setCompletedFilter(e.target.value)}
              value={completedFilter}
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="">Any Status</MenuItem>
              <MenuItem value="Yes">Completed</MenuItem>
              <MenuItem value="No">Not Completed</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <FormControl fullWidth size="small">
            <InputLabel id="questgiver-label">Quest Giver</InputLabel>
            <Select
              labelId="questgiver-label"
              label="Quest Giver"
              onChange={(e) => setQuestGiverFilter(e.target.value)}
              value={questGiverFilter}
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="">Any Quest Giver</MenuItem>
              {getUniqueQuestGivers().map(giver => (
                <MenuItem key={giver} value={giver}>{giver}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
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
            {location && (
              <Chip
                label={`Location: "${location}"`}
                onDelete={() => setLocation('')}
                color="primary"
                variant="outlined"
                size="small"
              />
            )}
            {acquisition && (
              <Chip
                label={`Acquisition: "${acquisition}"`}
                onDelete={() => setAcquisition('')}
                color="primary"
                variant="outlined"
                size="small"
              />
            )}
            {questLine && (
              <Chip
                label={`Quest Line: ${questLine}`}
                onDelete={() => setQuestLine('')}
                color="primary"
                variant="outlined"
                size="small"
              />
            )}
            {completedFilter && (
              <Chip
                label={`Status: ${completedFilter === 'Yes' ? 'Completed' : 'Not Completed'}`}
                onDelete={() => setCompletedFilter('')}
                color="primary"
                variant="outlined"
                size="small"
              />
            )}
            {questGiverFilter && (
              <Chip
                label={`Giver: ${questGiverFilter}`}
                onDelete={() => setQuestGiverFilter('')}
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

  const renderQuestsList = () => {
    const filteredQuests = getFilteredQuests();

    if (filteredQuests.length === 0) {
      return (
        <Box sx={{ textAlign: 'center', py: 4, px: 2 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {getActiveFilterCount() > 0 ? 
              'No quests match your filters' : 'No quests found'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your search or filters
          </Typography>
        </Box>
      );
    }

    return (
      <Stack spacing={1} sx={{ p: 2 }}>
        {filteredQuests.map((quest, index) => {
          const isSelected = selectedQuest?.name === quest.name;
          
          return (
            <Card 
              key={`quest-${quest.name}-${index}`}
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
              onClick={() => handleQuestSelect(quest)}
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
                      {quest.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {quest.turnInLocation && `Turn in: ${quest.turnInLocation}`}
                    </Typography>
                  </Box>
                  <Stack direction="row" spacing={0.5} flexShrink={0}>
                    {quest.completed === 'Yes' && (
                      <Chip 
                        label="Completed"
                        color="success"
                        size="small"
                        variant="filled"
                        sx={{ fontSize: '0.7rem', height: '24px' }}
                        icon={<PlaylistAddCheck sx={{ fontSize: 14 }} />}
                      />
                    )}
                    {quest.questLine && (
                      <Chip 
                        label={quest.questLine}
                        color={getQuestLineColor(quest.questLine)}
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
                  {quest.description || 'No description available'}
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
                  {selectedQuest?.name || 'Quest Details'}
                </Typography>
              </>
            ) : (
              <>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                  Quests ({getFilteredCount()})
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
                {selectedQuest && <QuestItem currQuest={selectedQuest} />}
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
                    placeholder="Search by name or description..."
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

            {/* Quests List */}
            <Box sx={{ pb: 8 }}>
              {renderQuestsList()}
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
          background: 'linear-gradient(135deg, #2196F3 0%, #21CBF3 100%)',
          color: 'white'
        }}
      >
        <Box sx={{ 
          p: { xs: 2, sm: 3 }
        }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
            <Box>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                Quest Collection
              </Typography>
              <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                Manage and track your quest progress
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
              Loading quest collection...
            </Typography>
          </Box>
        ) : quests.length > 0 ? (
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
                        label={`${getFilteredCount()} quests`} 
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
                    placeholder="Search by name or description..."
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
              No quest data available
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