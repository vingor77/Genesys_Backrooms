import React, { useState, useEffect } from 'react';
import { Box, Button, Card, CardContent, CardHeader, FormControl, Grid, InputLabel, MenuItem, Paper, Select, Stack, TextField, Typography, Chip, IconButton, Collapse, Badge, Fab, Snackbar, Alert, alpha, useTheme, useMediaQuery, AppBar, Toolbar, Fade } from "@mui/material";
import { Search, FilterList, Clear, Add, ExpandMore, ExpandLess, Science, Tune, ArrowBack } from '@mui/icons-material';
import { collection, doc, onSnapshot, orderBy, query, setDoc } from "firebase/firestore";
import db from '../Components/firebase';
import PhenomenonItem from "../Components/phenomenonItem";
import NotLoggedIn from "../Components/notLoggedIn";

export default function Phenomenons() {
  const [phenomena, setPhenomena] = useState([]);
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const [showDetails, setShowDetails] = useState(false);
  const [selectedPhenomenon, setSelectedPhenomenon] = useState(null);

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
        await setDoc(doc(db, 'Phenomena', data[i].name), {
          ...data[i]
        });
      }
      showToast('Phenomena data added successfully!');
    } catch (error) {
      showToast('Error adding phenomena data', 'error');
      console.error(error);
    }
  };

  const getFromDB = () => {
    const q = query(collection(db, 'Phenomena'), orderBy("name", "asc"));
    const unsub = onSnapshot(q, (querySnapshot) => {
      const queryData = [];
      querySnapshot.forEach((doc) => {
        queryData.push(doc.data());
      });
      setPhenomena(queryData);
      setLoading(false);
    });

    return () => { unsub(); };
  };

  const getUniqueTypes = () => {
    const types = [...new Set(phenomena.map(phenomenon => phenomenon.type).filter(type => type && typeof type === 'string' && type.trim() !== ''))];
    return types.sort();
  };

  const getUniqueSeverities = () => {
    const severities = [...new Set(phenomena.map(phenomenon => phenomenon.severity).filter(severity => severity && typeof severity === 'string' && severity.trim() !== ''))];
    return severities.sort();
  };

  const getUniqueLocations = () => {
    const locations = [...new Set(phenomena.map(phenomenon => phenomenon.location).filter(location => location && typeof location === 'string' && location.trim() !== ''))];
    return locations.sort();
  };

  const getFilteredPhenomena = () => {
    return phenomena.filter(phenomenon => {
      const matchesName = !name || 
        (phenomenon.name && phenomenon.name.toLowerCase().includes(name.toLowerCase())) ||
        (phenomenon.description && phenomenon.description.toLowerCase().includes(name.toLowerCase()));
      
      const matchesType = !type || (phenomenon.type && phenomenon.type === type);
      const matchesSeverity = !severityFilter || (phenomenon.severity && phenomenon.severity === severityFilter);
      const matchesLocation = !locationFilter || (phenomenon.location && phenomenon.location === locationFilter);
      
      return matchesName && matchesType && matchesSeverity && matchesLocation;
    });
  };

  const clearAllFilters = () => {
    setName('');
    setType('');
    setSeverityFilter('');
    setLocationFilter('');
    showToast('All filters cleared');
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (name !== '') count++;
    if (type !== '') count++;
    if (severityFilter !== '') count++;
    if (locationFilter !== '') count++;
    return count;
  };

  const getFilteredCount = () => {
    return getFilteredPhenomena().length;
  };

  const handlePhenomenonSelect = (phenomenon) => {
    setSelectedPhenomenon(phenomenon);
    if (isMobile) {
      setShowDetails(true);
    }
  };

  const handleBackToList = () => {
    setShowDetails(false);
  };

  const getTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'environmental': return 'success';
      case 'physical': return 'error';
      case 'mental': return 'secondary';
      case 'temporal': return 'warning';
      case 'spatial': return 'info';
      default: return 'default';
    }
  };

  const DisplayItems = () => {
    const filteredPhenomena = getFilteredPhenomena();

    return (
      <Box sx={{ mt: 3 }}>
        {filteredPhenomena.length === 0 ? (
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
              No phenomena found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try adjusting your search criteria to find more phenomena
            </Typography>
          </Paper>
        ) : (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Science color="primary" />
              Found {filteredPhenomena.length} phenomenon{filteredPhenomena.length !== 1 ? 'a' : ''}
            </Typography>
            <Stack direction="row" flexWrap="wrap" gap={2}>
              {filteredPhenomena.map((phenomenon, index) => (
                <PhenomenonItem key={index} currPhenomenon={phenomenon} />
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
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel id="type-label">Phenomenon Type</InputLabel>
            <Select
              labelId="type-label"
              label="Phenomenon Type"
              onChange={(e) => setType(e.target.value)}
              value={type}
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="">Any Type</MenuItem>
              <MenuItem value="Environmental">Environmental</MenuItem>
              <MenuItem value="Physical">Physical</MenuItem>
              <MenuItem value="Mental">Mental</MenuItem>
              <MenuItem value="Temporal">Temporal</MenuItem>
              <MenuItem value="Spatial">Spatial</MenuItem>
              {getUniqueTypes().map(uniqueType => (
                !['Environmental', 'Physical', 'Mental', 'Temporal', 'Spatial'].includes(uniqueType) && (
                  <MenuItem key={uniqueType} value={uniqueType}>{uniqueType}</MenuItem>
                )
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel id="severity-label">Severity Level</InputLabel>
            <Select
              labelId="severity-label"
              label="Severity Level"
              onChange={(e) => setSeverityFilter(e.target.value)}
              value={severityFilter}
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="">Any Severity</MenuItem>
              {getUniqueSeverities().map(severity => (
                <MenuItem key={severity} value={severity}>{severity}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel id="location-label">Location</InputLabel>
            <Select
              labelId="location-label"
              label="Location"
              onChange={(e) => setLocationFilter(e.target.value)}
              value={locationFilter}
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="">Any Location</MenuItem>
              {getUniqueLocations().map(location => (
                <MenuItem key={location} value={location}>{location}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
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
            {type && (
              <Chip
                label={`Type: ${type}`}
                onDelete={() => setType('')}
                color="primary"
                variant="outlined"
                size="small"
              />
            )}
            {severityFilter && (
              <Chip
                label={`Severity: ${severityFilter}`}
                onDelete={() => setSeverityFilter('')}
                color="primary"
                variant="outlined"
                size="small"
              />
            )}
            {locationFilter && (
              <Chip
                label={`Location: ${locationFilter}`}
                onDelete={() => setLocationFilter('')}
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

  const renderPhenomenaList = () => {
    const filteredPhenomena = getFilteredPhenomena();

    if (filteredPhenomena.length === 0) {
      return (
        <Box sx={{ textAlign: 'center', py: 4, px: 2 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {name || type || severityFilter || locationFilter ? 
              'No phenomena match your filters' : 'No phenomena found'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your search or filters
          </Typography>
        </Box>
      );
    }

    return (
      <Stack spacing={1} sx={{ p: 2 }}>
        {filteredPhenomena.map((phenomenon, index) => {
          const isSelected = selectedPhenomenon?.name === phenomenon.name;
          
          return (
            <Card 
              key={`phenomenon-${phenomenon.name}-${index}`}
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
              onClick={() => handlePhenomenonSelect(phenomenon)}
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
                      {phenomenon.name}
                    </Typography>
                    {phenomenon.location && (
                      <Typography variant="body2" color="text.secondary">
                        {phenomenon.location}
                      </Typography>
                    )}
                  </Box>
                  <Stack direction="row" spacing={0.5} flexShrink={0}>
                    {phenomenon.type && (
                      <Chip 
                        label={phenomenon.type}
                        color={getTypeColor(phenomenon.type)}
                        size="small"
                        variant="filled"
                        sx={{ fontSize: '0.7rem', height: '24px' }}
                      />
                    )}
                    {phenomenon.severity && (
                      <Chip 
                        label={phenomenon.severity}
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
                  {phenomenon.description || 'No description available'}
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
                  {selectedPhenomenon?.name || 'Phenomenon Details'}
                </Typography>
              </>
            ) : (
              <>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                  Phenomena ({getFilteredCount()})
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
                {selectedPhenomenon && <PhenomenonItem currPhenomenon={selectedPhenomenon} />}
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

            {/* Phenomena List */}
            <Box sx={{ pb: 8 }}>
              {renderPhenomenaList()}
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
          background: 'linear-gradient(135deg, #9C27B0 0%, #E1BEE7 100%)',
          color: 'white'
        }}
      >
        <Box sx={{ 
          p: { xs: 2, sm: 3 }
        }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
            <Box>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                Phenomena Collection
              </Typography>
              <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                Explore mysterious and anomalous phenomena
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
              Loading phenomena collection...
            </Typography>
          </Box>
        ) : phenomena.length > 0 ? (
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
                        label={`${getFilteredCount()} phenomena`} 
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
              No phenomena data available
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