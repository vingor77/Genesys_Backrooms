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
  useTheme
} from "@mui/material";
import {
  Search,
  FilterList,
  Clear,
  Add,
  ExpandMore,
  ExpandLess,
  Inventory2,
  Tune
} from '@mui/icons-material';
import { collection, doc, onSnapshot, orderBy, query, setDoc } from "firebase/firestore";
import db from '../Components/firebase';
import ObjectItem from "../Components/objectItem";
import NotLoggedIn from "../Components/notLoggedIn";

export default function Objects() {
  const [objects, setObjects] = useState([]);
  const [objectName, setObjectName] = useState('');
  const [objectNum, setObjectNum] = useState('');
  const [spawnLocation, setSpawnLocation] = useState('');
  const [price, setPrice] = useState('-1');
  const [rarity, setRarity] = useState('-1');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

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
        await setDoc(doc(db, 'Objects', data[i].name), {
          name: data[i].name,
          description: data[i].description,
          price: data[i].price,
          objectNumber: data[i].objectNumber,
          spawnLocations: data[i].spawnLocations,
          rarity: data[i].rarity,
          encumbrance: data[i].encumbrance,
          table: data[i].table,
          shownToPlayer: data[i].shownToPlayer
        });
      }
      showToast('Object data added successfully!');
    } catch (error) {
      showToast('Error adding object data', 'error');
      console.error(error);
    }
  };

  const getObjectsFromDB = () => {
    const q = query(collection(db, 'Objects'), orderBy("objectNumber", "asc"));
    const unsub = onSnapshot(q, (querySnapshot) => {
      const queryData = [];
      querySnapshot.forEach((doc) => {
        queryData.push(doc.data());
      });
      setObjects(queryData);
      setLoading(false);
    });

    return () => { unsub(); };
  };

  const DisplayObjects = () => {
    let empty = true;
    const filteredObjects = [];

    objects.forEach((object, index) => {
      if(withinParameters(object)) {
        empty = false;
        filteredObjects.push(<ObjectItem key={index} currObject={object} mainPage={true} />);
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
            <Search sx={{ fontSize: 60, color: 'grey.300', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No objects found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try adjusting your search criteria to find more items
            </Typography>
          </Paper>
        ) : (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Inventory2 color="primary" />
              Found {filteredObjects.length} object{filteredObjects.length !== 1 ? 's' : ''}
            </Typography>
            <Stack direction="row" flexWrap="wrap" gap={2}>
              {filteredObjects}
            </Stack>
          </Box>
        )}
      </Box>
    );
  };

  const withinParameters = (object) => {
    const matchesName = object.name.toUpperCase().includes(objectName.toUpperCase()) || objectName === '';
    const matchesNumber = parseInt(object.objectNumber) === parseInt(objectNum) || objectNum === '';
    const matchesRarity = object.rarity === parseInt(rarity) || rarity === '-1';
    const matchesPrice = (price === '10' && object.price >= 10) || 
                        (price !== '10' && price !== '-1' && object.price === parseInt(price)) || 
                        price === '-1';
    const matchesVisibility = object.shownToPlayer || localStorage.getItem('loggedIn')?.toUpperCase() === 'ADMIN';
    
    let matchesSpawn = true;
    if (spawnLocation !== '') {
      matchesSpawn = false;
      if (object.spawnLocations && Array.isArray(object.spawnLocations)) {
        matchesSpawn = object.spawnLocations.some(location => 
          location.toUpperCase().includes(spawnLocation.toUpperCase())
        );
      }
    }

    return matchesName && matchesNumber && matchesRarity && matchesPrice && matchesVisibility && matchesSpawn;
  };

  const clearAllFilters = () => {
    setObjectName('');
    setObjectNum('');
    setSpawnLocation('');
    setPrice('-1');
    setRarity('-1');
    showToast('All filters cleared');
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (objectName !== '') count++;
    if (objectNum !== '') count++;
    if (spawnLocation !== '') count++;
    if (price !== '-1') count++;
    if (rarity !== '-1') count++;
    return count;
  };

  const getFilteredCount = () => {
    return objects.filter(object => withinParameters(object)).length;
  };

  useEffect(() => {
    if (localStorage.getItem("loggedIn") !== 'false') {
      getObjectsFromDB();
    }
  }, []);

  if (localStorage.getItem("loggedIn") === 'false') {
    return <NotLoggedIn />;
  }

  const FilterSection = () => (
    <Box>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            size="small"
            value={objectNum}
            onChange={(e) => setObjectNum(e.target.value)}
            label="Object Number"
            placeholder="Enter number"
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
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

        <Grid item xs={12} sm={6} md={3}>
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
            {objectName && (
              <Chip
                label={`Name: "${objectName}"`}
                onDelete={() => setObjectName('')}
                color="primary"
                variant="outlined"
                size="small"
              />
            )}
            {objectNum && (
              <Chip
                label={`Number: ${objectNum}`}
                onDelete={() => setObjectNum('')}
                color="primary"
                variant="outlined"
                size="small"
              />
            )}
            {spawnLocation && (
              <Chip
                label={`Location: "${spawnLocation}"`}
                onDelete={() => setSpawnLocation('')}
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
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          p: { xs: 2, sm: 3 }
        }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
            <Box>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                Object Collection
              </Typography>
              <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                Browse and search through available objects
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
              Loading object collection...
            </Typography>
          </Box>
        ) : objects.length > 0 ? (
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
                        label={`${getFilteredCount()} items`} 
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
                    value={objectName}
                    onChange={(e) => setObjectName(e.target.value)}
                    placeholder="Search by object name..."
                    variant="outlined"
                    InputProps={{
                      startAdornment: <Search sx={{ mr: 1, color: 'action.active' }} />,
                      endAdornment: objectName && (
                        <IconButton size="small" onClick={() => setObjectName('')}>
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
            <DisplayObjects />
          </Box>
        ) : (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
            <Typography variant="h6" color="text.secondary">
              No object data available
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

let tempTable = {
  "Colombina Mask": {description: "A sleek venetian eye mask, similar to the masks worn in phantom of the opera. These tend to be colorful.", type: "Outstanding", difficulty: "2", effect: 'You become secretive. Your stealth acts as though it is 1 level higher while your discipline acts as though it is 1 level lower.'},
  "Bauta Mask": {description: "A rectangular full face mask with a pointed chin, defined nose, and eye holes. These tend to be one base color.", type: "Outstanding", difficulty: "2", effect: 'You may only use blunt objects to attack. This means no firearms and no sharp weapons.'},
  "Pantalone Mask": {description: "A solid color mask with a nose similar to a beak that ends above the mouth.", type: "Outstanding", difficulty: "2", effect: 'All social interaction checks add 1 difficulty.'},
  "Volto Mask": {description: "A white full face mask with golden swirls on it.", type: "Basic", difficulty: "3", effect: 'Your deception skill acts as though it is 1 level higher. You recieve 2 wounds per round in social encounters.'},
  "Kitsune Mask": {description: "A half mask that ends above the mouth. It tends to be colorful and resembles that of a fox.", type: "Basic", difficulty: "3", effect: 'Your charm skill acts as though it is 1 level higher but uour negotiation skill acts as though it is 1 level lower.'},
  "Arlecchino Mask": {description: "A solid color mask that ends above the mouth. It has a large nose and plump cheeks.", type: "Basic", difficulty: "3", effect: 'You cannot stealth, but you recieve an extra free maneuver per turn. This does not count towards your maneuver per turn limit.'},
  "Buskin Mask": {description: "A tragedy mask.", type: "No", difficulty: "4", effect: 'You automatically gain 3 failures to any check made using cool.'},
  "Oni Mask": {description: "A full mask, generally red in color, with horns and large fangs around the mouth. This is to resemble a demon.", type: "No", difficulty: "4", effect: 'You involintarily attack any you deem as evil or corrupt.'},
  "Sock Mask": {description: "A comedy mask.", type: "No", difficulty: "4", effect: 'You involuntarily attack any not smiling whenever you look at them.'},
}

//console.log(JSON.stringify(tempTable));

/*
  Colombina: You become secretive. Your stealth acts as though it is 1 level higher while your discipline acts as though it is 1 level lower.
  Bauta: You may only use blunt objects to attack. This means no firearms and no sharp weapons.
  Pantalone: All social interaction checks add 1 difficulty.
  Volto: Your deception skill acts as though it is 1 level higher. You recieve 2 wounds per round in social encounters.
  Kitsune: Your charm skill acts as though it is 1 level higher but uour negotiation skill acts as though it is 1 level lower.
  Arlecchino: You cannot stealth, but you recieve an extra free maneuver per turn. This does not count towards your maneuver per turn limit.
  Buskin: You automatically gain 3 failures to any check made using cool.
  Oni: You involintarily attack any you deem as evil or corrupt.
  Sock: You involuntarily attack any not smiling whenever you look at them.


  [
    {price: 0, shownToPlayer: false, objectNumber: 31, spawnLocations: ["Beta"], name: "Ouija Board", rarity: 10, table: "No", encumbrance: 0, description: "The Ouija Board allows you to contact the spirits of the dead. The chance of succeeding changes based on how well you knew the person in life. You may speak for 10 minutes should you succeed. You cannot use the Ouija Board more than once every 24 hours."},
    {price: 1, shownToPlayer: false, objectNumber: 15, spawnLocations: ["All"], name: "Firesalt", rarity: 0, table: "No", encumbrance: 0, description: "A small red crystal that when crushed or thrown, it harmlessly explodes while creating a loud crackling sound. Firesalt when heated melts to form a liquid which may be used to purify food and drinks."},
    {price: 2, shownToPlayer: false, objectNumber: 85, spawnLocations: ["Recourse Station", "Beta", "Aries Station", "Pisces Station", "194"], name: "Agrugua Fruit", rarity: 4, table: "No", encumbrance: 0, description: "These look like standard fruit upon inspection but once consumed, it has a far different effect. When consumed, you heal 3 wounds. Should the juices be squeezed into your eyes, you will be able to see in the dark, out to 2 ranges. This fruit is grown exclusively on level 194."},
    {price: 4, shownToPlayer: false, objectNumber: 23, spawnLocations: ["All"], name: "Consequential Cube", rarity: 3, table: '{"red":{"effect1":"For the next 24 hours, you are blind","effect2":"Upon completion of the Cube, you and any targets of your choosing teleport to a survival difficulty 3 or higher Level","effect3":"For the next 24 hours, you are paralyzed from the waist down"},"orange":{"effect1":"Upon completion of the Cube, you and any targets of your choosing teleport to Level 0","effect2":"Half of the Objects and Items within your inventory disappear, rounded down, of your choosing","effect3":"For the next 24 hours, you may only move 1 range instead of 2"},"yellow":{"effect1":"For the next 5 days (120 hours), you are completely unable to benefit from a rest","effect2":"Immediately gain a level of exhaustion","effect3":"Nothing occurs"},"blue":{"effect1":"Upon completion of the Cube, gain 20 rations","effect2":"Upon completion of the Cube, gain 10 rations","effect3":"Your socks immediately get soggy"},"green":{"effect1":"Upon completion of the Cube, create an infinite feast that lasts for 24 hours.","effect2":"Immediately heal 12 wounds or 1 critical injury","effect3":"Upon completion of the Cube, gain a compass that will lead you to a safe spot within the level. If there is no safe spots, the compass will lead you to an exit. This may only be used once"},"white":{"effect1":"Upon completion of the Cube, you and any targets of your choosing teleport to a survival difficulty 0 Level excluding The Hub","effect2":"Upon completion of the Cube, gain a gray almond water","effect3":"Upon completion of the Cube, gain a small orange and black trinket that, upon being broken or smashed, will teleport you and any targets of your choosing to the nearest outpost within a level. This may only be used once"}}', encumbrance: 0, description: "What appears to be a regular and unsolved Rubix Cube. Upon picking it up, your body becomes intangible, yet frozen in place. The only way to escape this is by completing the Rubix Cube, but be careful as whichever side you complete first as it has some kind of effect."},
    {price: 0, shownToPlayer: false, objectNumber: 86, spawnLocations: ["A1"], name: "Reality Lag Machine", rarity: 10, table: 'No', encumbrance: 999, description: "A huge machine looking similar to a rocket ship engine. When activated, it 'deletes' the reality in a long range in front of it for 1 hour. When you step inside it, you can teleport to any level without any constraints."},
    {price: 100, shownToPlayer: false, objectNumber: 0, spawnLocations: ["Moley's Comedy Club and Bar"], name: "Wormhole", rarity: 10, table: 'No', encumbrance: 1, description: "A clunky device made of silver with a small antenna erecting from it. When you place the antenna on a surface, it creates a portal that quickly fades as though nothing happened. This can be done 4 times before replacing the older portals. Once you enter the portal, you can choose which other portal is the exit. After exiting, both close permanently."},
    {price: 1, shownToPlayer: false, objectNumber: 30, spawnLocations: ["All"], name: "Greasy Marshmallows", rarity: 0, table: 'No', encumbrance: 0, description: "A giant fluffy marshmallow. When eaten in a solid form, you may only move 1 range for the next hour."},
    {price: 250, shownToPlayer: false, objectNumber: 0, spawnLocations: ["All"], name: "Strength Elixir", rarity: 9, table: 'No', encumbrance: 0, description: "A small stone with the letters X and P engraved on it. Upon smashing it upon a surface, you gain 50 experience points immediately."},
    {price: 4, shownToPlayer: false, objectNumber: 0, spawnLocations: ["Cat Post"], name: "Berry's Necklace", rarity: 3, table: 'No', encumbrance: 0, description: "A black and blue beaded necklace. Upon putting it on, you can now speak directly to and hear from any other beings with another one of these necklaces on. This necklace will gain more effects as your relationship with the Visionaries of Berry grow."},
    {price: 500, shownToPlayer: false, objectNumber: 0, spawnLocations: ["None"], name: "Boon Elixir", rarity: 10, table: 'No', encumbrance: 0, description: "A gold and green liquid the consistency of molasses inside of a small tube. When you drink this, you gain 100 experience points that can be spent exclusively on increasing your characteristics. All unspent points are wasted."},
    {price: 1, shownToPlayer: false, objectNumber: 74, spawnLocations: ["All"], name: "Warpberries", rarity: 2, table: 'No', encumbrance: 0, description: "A small black berry. When you eat one, you are instantly teleported to Level 10. Should you consume more than 4 within the span of a week, you will be trapped in Level 10 for 9 days."},
    {price: 120, shownToPlayer: false, objectNumber: 365, spawnLocations: ["None"], name: "Seer Tea", rarity: 9, table: 'No', encumbrance: 0, description: "A blue, luminescent tea made from the Sightlees Seer entity on Level 365. When you drink the entire thing you can choose between: You remove all levels of sanity, You remove all stacks of exhaustion, You cure all diseases, You heal all of your wounds and gain extra temporary wounds equal to your maximum wounds threshold (These do not expire by time), or You cure all critical injuries."},
    {price: 4, shownToPlayer: false, objectNumber: 7, spawnLocations: ["All"], name: "Empty Memory Jar", rarity: 8, table: 'No', encumbrance: 0, description: "This looks like an empty mason jar. Whenever a non-entity dies within long range, the soul is captured within the jar. If you then open the jar, the soul recreates the body it belonged to, fully reviving the person if it has been 24 hours or less since the soul entered the jar. The jar then breaks."},
    {price: 0, shownToPlayer: false, objectNumber: 6, spawnLocations: ["0"], name: "The Mirror", rarity: 10, table: 'No', encumbrance: 999, description: 'A rectangular mirror with a plaque on the bottom side saying "REALITY 1 Cori 13|12". When you look into this mirror, you are treated with visions of your loved ones outside of the Backrooms.'},
    {price: 4, shownToPlayer: false, objectNumber: 42, spawnLocations: ["All"], name: "Artificial Bottle Lightning", rarity: 3, table: 'No', encumbrance: 1, description: "A large bottle filled with a red light zipping around within its confines. The bottle emits electrical bursts around it. You may hook this up to machines to power them."},
    {price: 7, shownToPlayer: false, objectNumber: 0, spawnLocations: ["All"], name: "FU Ring", rarity: 6, table: 'No', encumbrance: 0, description: "A clearly fake golden ring. When you put it on, once per 24 hours if your wound would be set to 0 from any source, you set it to 1 instead. In addition, the attacker, if there is one, loses wound equal to the amount of wound you would have lost past 1 ignoring all soak."},
    {price: 3, shownToPlayer: false, objectNumber: 19, spawnLocations: ["31", "33", "40"], name: "Squirt Gun", rarity: 2, table: 'No', encumbrance: 1, description: "A huge 2-handed nerf super-soaker water gun with a 3 liter capacity. Some liquids have special effects when placed inside of the gun and shot. Almond water deals 1 wound ignoring soak to entities. Cashew Water gains a 15% increase to entity spawn chance. Liquid silence and liquid pain no longer hardens or burns. Any other liquid just simply tastes better."},
    {price: 4, shownToPlayer: false, objectNumber: 0, spawnLocations: ["All"], name: "Firemail", rarity: 3, table: 'No', encumbrance: 0, description: "Once per 48 hours you may open this envelope to send a ball of fire anywhere on the same level as you. The accuracy is based on how well you know the level. If it hits an entity or person, it does 7 wounds."},
    {price: 1, shownToPlayer: false, objectNumber: 5, spawnLocations: ["BNTG"], name: "Candy", rarity: 0, table: '{"Silver Tongues":{"Effect":"For the next 8 rounds you treat your charm as though you had one skill level higher."},"Chocolate Bullets":{"Effect":"For the next 10 rounds you become immune to fear."},"Metal Guns":{"Effect":"For the next 6 rounds your hands become pistols. Refer to the basic pistol weapon for stats."},"Personal Sugar":{"Effect":"For the next 6 rounds you gain 1 melee and ranged defense."},"Sour Waste-Containers":{"Effect":"For the next 5 rounds, as an action, you can breath acid from your mouth. Ranged.Damage 4.Critical 5.Range [Medium].Burn 2"},"Pink Wafers":{"Effect":"For the next 10 rounds you treat your medicine as though you had one skill level higher."},"O-shaped Mints":{"Effect":"No effect."}}', encumbrance: 0, description: "An unlabeled bag which contains 20 pieces of candy. There are 7 kinds of candy and the effects when eaten are shown below."},
    {price: 3, shownToPlayer: false, objectNumber: 0, spawnLocations: ["All"], name: "Gravity Ring", rarity: 2, table: 'No', encumbrance: 0, description: "A small red ring with a white pearl within a socket. While you wear this ring, you may press the pearl in to cause gravity to no longer apply to you for 10 rounds. After the effect ends, the ring must recharge for 1 hour before use."},
    {price: 3, shownToPlayer: false, objectNumber: 29, spawnLocations: ["25", "40", "68", "290"], name: "3D Vision Glasses", rarity: 2, table: 'No', encumbrance: 0, description: "A pair of basic 3D glasses commonly found at movie theaters. While you wear it, you gain a bonus dice to perception but gain a setback dice to coordination."},
    {price: 4, shownToPlayer: false, objectNumber: 0, spawnLocations: ["Blue Salvation", "Jerry's Salvation"], name: "Jerry's Feather", rarity: 3, table: 'No', encumbrance: 0, description: "A blue silky feathed plucked from the Entity Jerry himself. This feather will gain more effects as your relationship with the Followers of Jerry grow."},
    {price: 3, shownToPlayer: false, objectNumber: 0, spawnLocations: ["BNTG"], name: "Potion of Sanity Stall", rarity: 5, table: 'No', encumbrance: 0, description: "A pitch black liquid in a non-descript vial. When you drink it, the next time you would gain a level of sanity, you do not."},
    {price: 4, shownToPlayer: false, objectNumber: 42, spawnLocations: ["All"], name: "Black Bottle Lightning", rarity: 8, table: 'No', encumbrance: 1, description: "A large bottle filled with a black sphere zipping around within its confines. When you open the bottle, pure lightning rockets out in the direction of the openening. If this hits a person or entity, that person or entity takes 12 wounds and 3 strain. After being opened, the bottle becomes empty and the encumbrance drops to 0."},
    {price: 0, shownToPlayer: false, objectNumber: 22, spawnLocations: ["El3A", "Omega", "Floor 283"], name: "Way-Back Machine", rarity: 9, table: 'No', encumbrance: 7, description: "A huge 3D printer that comes with 3 buttons on the side. These buttons have the words 'View', 'Revert', and 'Restore'. If no Object is on the platform, these buttons do nothing. Whenever you press View, the Object present disappears and a document describing everything about the Object appears. Whenever you press Revert, the Object present disappears and the raw materials that make up the Object appear. Whenever you press Restore, the raw materials become an Object. Restore may only be used after using Revert."},
    {price: 3, shownToPlayer: false, objectNumber: 14, spawnLocations: ["All"], name: "Scaraback", rarity: 6, table: 'No', encumbrance: 0, description: "A small porcelain scarab with a blue gem embedded within a socket on the Scarab's back. Whenever the blue gem is pushed in, the Scaraback begins to emit a loud yet low-toned droning noise. Any entities that hear this are stunned until the Scaraback can no longer be heard. This noise lasts for an hour and after use, the porcelain shatters and the gem dissipates."},
    {price: 9, shownToPlayer: false, objectNumber: 0, spawnLocations: ["All"], name: "Hyrum Lantern", rarity: 8, table: 'No', encumbrance: 1, description: "A 70s handheld lantern. When you turn it on, it sheds bright light out to long range. While on, most entities that is within the light burns, dealing 25 wounds per turn. The Lantern uses specific fuel to light and does not last long."},
    {price: 0, shownToPlayer: false, objectNumber: 66, spawnLocations: ["Trader's Keep"], name: "Leviathan's Tooth", rarity: 10, table: 'No', encumbrance: 4, description: "A massive clay tablet with ancient writing upon it. When you touch it, it tells you what it is and what it does. The Leviathan's Tooth, in essence, swaps someone from outside of the Backrooms with yourself, granting escape. The tablet, unfortunately, is broken into 10 pieces and they are scattered around the Backrooms."},
    {price: 250, shownToPlayer: false, objectNumber: 0, spawnLocations: ["All"], name: "Portable God", rarity: 10, table: '{"Siphon":{"Action":"Deal 4 strain and 3 wound to a creature within medium range that you can see and heal that much after soak.","Cost":"1"},"Protect":{"Action":"Heal an ally 2 wounds and 5 strain. If this would heal past maximum wounds/strain, add that much as temporary wounds/strain.","Cost":"2"},"Worship":{"Action":"You become an avatar of the goddess for 10 rounds. Your attacks deal 3 strain extra.","Cost":"6"},"Pray":{"Action":"Make a wish. If the goddess sees fit, it will come true.","Cost":"6"},"Rebuke":{"Action":"For the next 6 rounds, any creature engaged with you that hits you takes 5 strain damage.","Cost":"6"}}', encumbrance: 0, description: "A small idol shrouded in magical darkness. When you touch it, the idol reveals itself to be a goddess of some sort. The idol has 12 charges and these charges can be spent as shown below. Once all charges are used up, only the goddess on the idol can recharge it."},
    {price: 2, shownToPlayer: false, objectNumber: 0, spawnLocations: ["All"], name: "Potion of Sanity", rarity: 4, table: 'No', encumbrance: 0, description: "A dark orange liquid, usually in a glass tube. When you drink it, remove 3 levels of sanity."},
    {price: 300, shownToPlayer: false, objectNumber: 59, spawnLocations: ["All"], name: "Prayer Glass", rarity: 9, table: 'No', encumbrance: 0, description: "A wine glass with the illustration of some god-like being. The prayer glass is known to be used in a ritual to summon 'The Old Fear'. There exist only 6 Prayer Glasses total."},
    {price: 5, shownToPlayer: false, objectNumber: 47, spawnLocations: ["40"], name: "BackROM", rarity: 4, table: '{"GAM":{"description":"An unfinished black and white checkered flat grid with colored objects like teapots and balls. The game is a physics simulator.","effect":"After playing GAM, you will feel paranoid for the next 12 hours, imagining wanderers with heads replaced with teapots. After these 12 hours pass, you will pass out and speak with the Entity Blanche (Entity 140)."},"Death Guy":{"description":"An unplayable game with only one solid image showing a stick figure with the label Zombie above it.","effect":"Whenever Death Guy is mentioned either in text or in a sentence spoken, it changes to ranting about how great the game is."},"CLOWNS":{"description":"It is Payday 2.","effect":"When you insert the game, you and any other players fall asleep for the next 48 hours. While asleep, you play this game and can take items from it, stashing it in your inventory. Each item has a real-life conversion when the game is exited. A diamond turns into a small vial of harmless acid, a gold ingot turns into a leather bag of sand, U.S. Currency turns into an oak tree leaf, any weapon turns into gray almond water, and an ATM turns into a hot tub. There can only be one hot tub per session."},"Totally Finished Game":{"description":"A buggy mess that is missing almost everything about the game. The sprites are not present, levels reset without warning, saved data gets wiped randomly, etc.","effect":"After you play this game for 2 hours, you gain the glitched status for 5 hours."}}', encumbrance: 2, description: "A game system that looks similar to a Playstation 2 thin. Along with this console is a few game discs strapped to the consonle. Below are the games and the effects."},
    {price: 6, shownToPlayer: false, objectNumber: 4, spawnLocations: ["The Casino Room", "BNTG"], name: "Deuclidator", rarity: 5, table: 'No', encumbrance: 0, description: "A small hand-held machine that looks like a mini version of a loom. When you insert a specific kind of fuel to the device, it then readies and allows you to warp reality ahead of you by 'crunching' reality. This crunched reality acts as a bridge for you to walk on, essentially casting a teleport spell. This object can reach infinitely so long as you have line of sight with the location."},
    {price: 0, shownToPlayer: false, objectNumber: 0, spawnLocations: ["None"], name: "The King's Courage", rarity: 9, table: 'No', encumbrance: 0, description: "A blue-ish white liquid contained in a small vial. When you drink this liquid, for the next 20 rounds, you recieve 1 wound that ignores soak. If you survive the 20 rounds, you increase your maximum wound threshold by 10 permanently. If you die, you are unable to be ressurected by any means other than a wish. Each round, other players may attempt to heal you. For rounds 1-5, any person attempting to heal you has a difficulty 2 added on. For rounds 6-10, difficulty 3. 11-15 is difficulty 4. 16-20 is difficulty 5."},
    {price: 9, shownToPlayer: false, objectNumber: 0, spawnLocations: ["87", "229"], name: "Timebomb", rarity: 8, table: 'No', encumbrance: 0, description: "A black and white orb with the similar markings of yinyang and a latch on the cross between the colors that fits in the palm of your hand. When you unlatch this orb, it prompts the user for a target. You may move the target either 8 rounds to the future, or 8 rounds to the past. This triggers any and all round-based mechanics and may remove status effects. The orb, after use, will then close and refuse to open for the next 72 hours."},
    {price: 1, shownToPlayer: false, objectNumber: 40, spawnLocations: ["All"], name: "Backrooms TCG", rarity: 0, table: 'No', encumbrance: 0, description: "A pack of the trading card game based on the Backrooms."},
    {price: 2, shownToPlayer: false, objectNumber: 34, spawnLocations: ["The Musician"], name: "Cassette Recorder", rarity: 4, table: 'No', encumbrance: 0, description: "A cassette player with only one button. When you press this button, a song begins to play. Any entities that hear it must make a difficulty 3 cool skill check. On a failure, that entity becomes docile until attacked or the song ends. The song may be played for a total of 1 hour. After 1 hour of playtime, the cassette stops working."},
    {price: 6, shownToPlayer: false, objectNumber: 32, spawnLocations: ["BRC"], name: "Reality Fresheners", rarity: 5, table: 'No', encumbrance: 0, description: "A small bulbous device with prongs to stick into wall outlets on the back side. When you plug it in, it creates a medium sized bubble centered on itself that denies most entities access. Also while inside the bubble, most anomolous effects cease including entity based diseases. Some entities and the effects they cause are immune to this bubble."},
    {price: 0, shownToPlayer: false, objectNumber: 43, spawnLocations: ["Epsilon"], name: "Tarot Deck", rarity: 10, table: '{"The Fool":"You and any targets of your choice instantly teleport to the previous level you were on.","The Fool Reversed":"You and any targets of your choice instantly teleport to a random level you have not been on before.","The Magician":"For the next 24 hours, treat your coordination skill as though it was 1 skill level higher.","The Magician Reversed":"For the next 24 hours, treat your coordination skill as though it was 1 skill level lower. If this would reduce it below 0, instead add 1 difficulty dice to all rolls with the skill.","The High Priestess":"For the next 24 hours, treat your survival skill as though it was 1 skill level higher.","The High Priestess Reversed":"For the next 24 hours, treat your survival skill as though it was 1 skill level lower. If this would reduce it below 0, instead add 1 difficulty dice to all rolls with the skill.","The Empress":"For the next 24 hours, you add a setback dice to all rolls made using the willpower characteristic.","The Empress Reverse":"For the next 24 hours, you add a boost dice to all rolls made using the willpower characteristic","The Emperor":"For the next 24 hours or 5 shots are fired, you obtain a handgun with ridiculous power. Whenever you shoot this gun, you can control the bullet entirely meaning it automatically will hit your target. Ranged. Damage 14. Critical N/A. Range [Short]. Auto-hit","The Emperor Reversed":"One of your firearms break beyond repair.","The Heirophant":"For the next 24 hours, you gain a boost dice to all social skills.","The Heirophant Reversed":"For the next 24 hours, you gain a setback dice to all social skills.","The Lovers":"For the next 24 hours, treat all characteristics as though it is 1 higher, to a maximum of 6.","The Lovers Reversed":"For the next 24 hours, treat all characteristics as though it is 1 lower, to a minimum of 1.","The Chariot":"For the next 10 rounds, your soak increases by 5, you may now move up to 3 ranges, and you deal an extra 2 damage on all attacks made using Brawn.","The Chariot Reversed":"For the next 10 rounds, your soak decreases by 5, you may now move up to 1 range, and you deal 2 less damage on all attacks made using Brawn.","Justice":"A table appears in front of you. On this table is 20 rations, 2 of each kind of Almond Water, and a random weapon. This table and anything still on it disappears after 24 hours.","Justice Reversed":"A table appears in front of you. On this table is 20 spoiled rations, 8 Cashew Water, and a fragment on a weapon. This table and anything still on it disappears after 24 hours.","The Hermit":"For the next 24 hours, all skills using the Cunning characteristic adds a boost dice.","The Hermit Reversed":"For the next 24 hours, all skills using the Cunning characteristic adds a setback dice.","Wheel of Fortune":"For the next 24 hours, you become lucky. You may reroll any amount of dice up to 3 times.","Wheel of Fortune Reversed":"For the next 24 hours, you become unlucky. The Dungeon Master may reroll any amount of your dice up to 3 times.","Strength":"For the next 4 rounds, you may steal all Brawn from an entity or person. This cannot reduce the target below 1 Brawn.","Strength Reversed":"For the next 4 rounds, your Brawn becomes 1.","The Hanged Man":"For the next 5 rounds, your strain is set to your maximum threshold. All allies upgrade all green dice to yellow during this time. After the 5 rounds are over, set your strain to 0.","The Hanged Man Reversed":"For the next 5 rounds, all allies strain is set to thier maximum threshold. Your strain and wounds cannot change, all dice you roll are now yellow, even if they were negative dice before, and you may take 2 actions per turn. After the 5 rounds, all allies strain become 0.","Death":"All critical injuries are healed.","Death Reversed":"Recieve a critical injury.","Temperance":"For the next 24 hours, upgrade 1 green dice to yellow.","Temperance Reversed":"For the next 24 hours, upgrade 1 purple dice to a red dice.","The Devil":"For the next 24 hours, treat your vigilance and survival skills as though they were 1 skill level higher.","The Devil Reversed":"For the next 24 hours, treat your vigilance and survival skills as though they were 1 skill level lower.","The Tower":"6 small metal bombs that are lit will immediately spawn around you. These bombs will explode in 3 rounds dealing 7 wounds per bomb. The radius is short range.","The Tower Reversed":"The ground around you will immediately rise up, locking you in a cage of dirt.","The Star":"A star appears before you and guides you to your current objective. This star stays until you have arrived at your objective.","The Star Reversed":"A star appears before you and guides you to the nearest danger. This star stays until you have arrived at the danger it detects.","The Moon":"For the next 24 hours, treat all knowledge skills as though it is 1 skill level higher.","The Moon Reversed":"For the next 24 hours, treat all knowledge skills as though it is 1 skill level lower.","The Sun":"Every person besides you are blinded instantly. This blindness lasts for 8 rounds.","The Sun Reversed":"Your are blinded instantly. This blindness lasts for 8 rounds.","Judgement":"Argos appears to judge you. If you are judged as good through tradition means, you are offered to teleport with any targets of your choice to any level. If you are judged as evil, you are forced teleported, along with any targets of your choice, to a Survival Difficulty 4 or higher Level.","Judgement Reversed":"Argos appears to judge you. If you are judged as good through opposite of traditional means, you are offered to teleport with any targets of your choice to any level. If you are judged as evil, you are forced teleported, along with any targets of your choice, to a Survival Difficulty 4 or higher Level.","The World":"For the next 2 rounds, time stops for everything else around you. You may take 2 extra turns.","The World Reversed":"For the next 2 rounds, time stops for you specifically. You lose 2 turns."}', encumbrance: 0, description: "A tarot deck of 42 cards. You may pull a card from the deck once per 48 hours. When you draw a card, its blank. You must then hold the card and think about using it for it to activate. Each effect is listed below."},
    {price: 0, shownToPlayer: false, objectNumber: 18, spawnLocations: ["The Beverly Room"], name: "The Phonograph", rarity: 10, table: 'No', encumbrance: 999, description: "An old phonograph. If you hear the music of the phonograph, you can no longer move and you gain a level of sanity. Afterwards, you may roll a Discipline skill check with difficulty 2. If you fail, gain a level of sanity and break out of the trance. If you succeed, break out of the trance. Once this effect ends, you are immune to it for the next 24 hours."},
    {price: 14, shownToPlayer: false, objectNumber: 87, spawnLocations: ["None"], name: "Worn Sack", rarity: 9, table: 'No', encumbrance: 0, description: "A sack with dirt and grime on it. This bag can store an infinite amount, so long as the item fits within the openening. Anything within the bag no longer factors into your total encumbrance."},
    {price: 4, shownToPlayer: false, objectNumber: 69, spawnLocations: ["All"], name: "Xenon Marbles", rarity: 3, table: 'No', encumbrance: 0, description: "A small blue orb. This egg, upon inspection, will hatch into a Light Guide (Entity 35) unless submerged completely in liquid."},
    {price: 8, shownToPlayer: false, objectNumber: 7, spawnLocations: ["All"], name: "Filled Memory Jar", rarity: 7, table: 'No', encumbrance: 1, description: "This looks like an mason jar with a bright light sitting still inside it. That bright light is a soul of some other person. If you then open the jar, the soul recreates the body it belonged to, fully reviving the person if it has been 24 hours or less since the soul entered the jar. The jar then breaks."},
    {price: 9, shownToPlayer: false, objectNumber: 0, spawnLocations: ["All"], name: "Ring of Resistance: Sanity", rarity: 8, table: 'No', encumbrance: 0, description: "A silver ring with ineligible runes scribed on it. While you wear this ring, once per 24 hours you may choose to not gain a level of sanity when you otherwise would."},
    {price: 3, shownToPlayer: false, objectNumber: 35, spawnLocations: ["143"], name: "Turquoise Blue Dark Reparation Vial", rarity: 5, table: 'No', encumbrance: 0, description: "A small vial with a black liquid. This liquid has a Turqoise Blue crystal inside, though it's difficult to see. When you drink the liquid, you gain 4 points to spend. These points can be spent healing yourself. It requires 1 point for 1 wound and 1 point for 2 strain. Also, heal 1 stage of all diseases you currently have."},
    {price: 4, shownToPlayer: false, objectNumber: 35, spawnLocations: ["205", "260", "299"], name: "Amythest Purple Dark Reparation Vial", rarity: 7, table: 'No', encumbrance: 0, description: "A small vial with a black liquid. This liquid has a Amethyst Purple crystal inside, though it's difficult to see. When you drink the liquid, you take 7 damage."},
    {price: 2, shownToPlayer: false, objectNumber: 35, spawnLocations: ["158"], name: "Ruby Red Dark Reparation Vial", rarity: 3, table: 'No', encumbrance: 0, description: "A small vial with a black liquid. This liquid has a Ruby Red crystal inside, though it's difficult to see. When you drink the liquid, you remove 1 level of exhaustion. If you have no exhaustion, instead prevent the next level of exhaustion you would gain."},
    {price: 1, shownToPlayer: false, objectNumber: 35, spawnLocations: ["All"], name: "Onyx Black Dark Reparation Vial", rarity: 2, table: 'No', encumbrance: 0, description: "A small vial with a black liquid. This liquid has a Onyx Black crystal inside, though it's difficult to see. When you drink the liquid, your strain instantly rises to 1 below your threshold."},
    {price: 2, shownToPlayer: false, objectNumber: 35, spawnLocations: ["197"], name: "Navy Blue Dark Reparation Vial", rarity: 4, table: 'No', encumbrance: 0, description: "A small vial with a black liquid. This liquid has a Navy Blue crystal inside, though it's difficult to see. When you drink the liquid, your movement speed halves for 1 hour."},
    {price: 4, shownToPlayer: false, objectNumber: 35, spawnLocations: ["All"], name: "Quartz White Dark Reparation Vial", rarity: 8, table: 'No', encumbrance: 0, description: "A small vial with a black liquid. This liquid has a Quartz White crystal inside, though it's difficult to see. When you drink the liquid, you polymoprh into a white blob for 3 rounds. On your turn, you may roll to transform back. The difficulty is 2, then 3, then 4. If all 3 rounds pass and you are still a blob, it becomes permanent."},
    {price: 1, shownToPlayer: false, objectNumber: 1, spawnLocations: ["All"], name: "Gray Almond Water", rarity: 0, table: 'No', encumbrance: 0, description: "An aluminum bottle with a grey label saying Almond Water on it. When you drink the entire bottle, you remove two levels of sanity."},
    {price: 3, shownToPlayer: false, objectNumber: 1, spawnLocations: ["All"], name: "Green Almond Water", rarity: 2, table: 'No', encumbrance: 0, description: "An aluminum bottle with a green label saying Almond Water on it. When you drink the entire bottle, you remove three levels of sanity. You also heal one stage of the Crawler's Disease (Enitity 17)."},
    {price: 5, shownToPlayer: false, objectNumber: 1, spawnLocations: ["All"], name: "Red Almond Water", rarity: 4, table: 'No', encumbrance: 0, description: "An aluminum bottle with a red label saying Almond Water on it. When you drink the entire bottle, you remove four levels of sanity. You also heal one stage of The Disease (Entity 19)."},
    {price: 7, shownToPlayer: false, objectNumber: 1, spawnLocations: ["All"], name: "Blue Almond Water", rarity: 6, table: 'No', encumbrance: 0, description: "An aluminum bottle with a blue label saying Almond Water on it. When you drink the entire bottle, you remove five levels of sanity. You also heal one stage of the Wretch's Disease (Entity 15). Once you finish this bottle, you can no longer gain Sanity for the next hour."},
    {price: 4, shownToPlayer: false, objectNumber: 0, spawnLocations: ["All"], name: "Blue Bottle Lightning", rarity: 7, table: 'No', encumbrance: 1, description: "A large bottle filled with a blue sphere zipping around within its confines. When you open the bottle, a very violent surge of energy rockets out in a straight line. Any person or entity in the path of it takes 16 wound and 8 strain. After being opened, the bottle becomes empty and the encumbrance drops to 0."},
    {price: 250, shownToPlayer: false, objectNumber: 2, spawnLocations: ["All", "The Keymaster"], name: "Level Key", rarity: 9, table: 'No', encumbrance: 0, description: "A key similar to an old chest key. The key is related to a specific level. The level number is embedded on the head of the key. This key unlocks and opens the door to the selected level while within The Hub. While inside of the level the key relates to, any locked doors, chests, etc. automatically unlock in the presence of the key."},
    {price: 8, shownToPlayer: false, objectNumber: 20, spawnLocations: ["All", "UEC"], name: "Rixa Gas", rarity: 7, table: 'No', encumbrance: 0, description: "A red gas, usually stored inside of some kind of bottle. When this gas is not contained, it spreads rapidly towards heat. Whenever you breath this gas in, you advance 1 stage of the Wretch(Entity 15)'s disease."},
    {price: 7, shownToPlayer: false, objectNumber: 12, spawnLocations: ["All"], name: "Mortality Shards", rarity: 6, table: 'No', encumbrance: 0, description: "A crystal with a chromatic hue. If you become engaged with the crystal, it lunges at you. You may make a skill check to dodge or block it with a difficulty 1. On a fail, you take 4 strain damage, roll sanity, and become blinded for 4 rounds. Each round while blinded, you take 2 strain damage and roll sanity. If you succeed, the effect ends early."},
    {price: 2, shownToPlayer: false, objectNumber: 25, spawnLocations: ["0", "3", "4"], name: "Babel Balm", rarity: 1, table: 'No', encumbrance: 0, description: "A small tube of lipstick. The color is random. When you put it on, anyone who hears you can understand what you say regardless of its known languages. If you smudge it onto text or handwritten notes, you can read it as though it was in your main language."},
    {price: 9, shownToPlayer: false, objectNumber: 99, spawnLocations: ["UEC 76"], name: "Hermes Device", rarity: 8, table: 'No', encumbrance: 3, description: "A big container filled with a brain, a melted level key, and memory juice. Whenever you apply electrical current to it, you and any targets of your choice may teleport 50 levels higher to 50 levels lower from your current level. After the first use, it has a 25% chance to fry the brain and become unusable. After the second use, a 50% chance. Third, 75%. Fourth, 100%. This device can be fixed by putting in a new brain."},
    {price: 2, shownToPlayer: false, objectNumber: 8, spawnLocations: ["A1", "A2", "Skycraper"], name: "Lamp", rarity: 1, table: 'No', encumbrance: 0, description: "A bulbous lamp with legs. It sheds light out to a large range. Whenever a hostile entity or wanderer approaches, the lamp will hide to look like a random lamp."},
    {price: 18, shownToPlayer: false, objectNumber: 16, spawnLocations: ["23", "56"], name: "Royal Rations", rarity: 8, table: 'No', encumbrance: 0, description: "A pink, taffy-like brick of jello, usually found inside of a small box labeled 'Exodus 3:8'. When you eat it, remove 10 levels of sanity. This allows your stacks to enter negative numbers. If another wanderer learns that you have this food, that wanderer must roll to resist attacking you."},
    {price: 1, shownToPlayer: false, objectNumber: 3, spawnLocations: ["All"], name: "Smiler Repellent", rarity: 0, table: 'No', encumbrance: 0, description: "Clear liquid, usually in a spray bottle. Whenever you spray this liquid on a smiler, it has a 20% chance to instantly kill it."},
    {price: 1, shownToPlayer: false, objectNumber: 0, spawnLocations: ["All"], name: "Cashew Water", rarity: 0, table: 'No', encumbrance: 0, description: "An aluminum bottle with a grey label saying Almond Water on it. This water attracts entities. While you have the water with you, increase the entity spawn chance by 30%. If you ingest the water, you gain a stage of the Wretch (Entity 15)'s Disease."},
    {price: 0, shownToPlayer: false, objectNumber: 88, spawnLocations: ["All"], name: "The Apocrypha Flute", rarity: 10, table: 'No', encumbrance: 0, description: "A red see-through plastic recorder flute. When you are at 5 exhaustion stacks, 10 or more levels of sanity, have less than half of your wounds and strain remaining, this flute will automatically move to your lips and force you to blow into it. When you do this, your mind is transported to an area with sunny skies and big grassy fields with a slight breeze. In the sky there are two shadow-like figures. These are the gods Jacob and Esau. Both of these gods show nothing but love for you yet bicker with each other about your mortality. Any questions you ask here are answered to the best of thier abilities. After what feels like hours pass, you wake up with no exhaustion, no sanity, max wounds, and max strain. The flute is also nowhere to be seen."},
    {price: 9, shownToPlayer: false, objectNumber: 17, spawnLocations: ["93"], name: "Liquid Silence", rarity: 8, table: 'No', encumbrance: 0, description: "Pure black liquid inside of a specialty beaker and is sealed. This liquid comes from Scream Eaters (Entity 97) exclusively. When you open this beaker, the liquid rockets out. Once it lands, in a medium range around it all sound is gone for the next 10 rounds. If another beaker of this liquid is added before the 10 rounds end, the timer resets and the range increases. After these 10 rounds pass without new liquid being added, the liquid congeals into solid silence. The size of the solid silence is based on how many beakers were added."},
    {price: 9, shownToPlayer: false, objectNumber: 17, spawnLocations: ["All"], name: "Solid Silence", rarity: 8, table: 'No', encumbrance: 0, description: "A pure black cube. This cube is formed from Liquid Silence. If you damage this cube in any way, it explodes with the same range as the liquid silence that created it. For each beaker added, the damage also increases. At 1 beaker it does 4 strain and 4 wound. Each extra beyond the first adds 3 strain and 3 wound damage."},
    {price: 1, shownToPlayer: false, objectNumber: 83, spawnLocations: ["All"], name: "Mobile Vacuum Cleaner", rarity: 0, table: 'No', encumbrance: 2, description: "A standard vacuum cleaner. If you call for it, it will move to you."},
    {price: 3, shownToPlayer: false, objectNumber: 51, spawnLocations: ["9"], name: "Pocket", rarity: 2, table: 'No', encumbrance: 0, description: "A small metal bracelet with a golden gem embedded. This item can store an endless amount of items, but does not remove the encumbrance of items inside. The Pocket does, however, add 5 to your maximum encumbrance."},
    {price: 5, shownToPlayer: false, objectNumber: 0, spawnLocations: ["All"], name: "LiberTV", rarity: 4, table: 'No', encumbrance: 4, description: "An old and cumbersome television that plays worthless ads for products that do not exist."},
    {price: 8, shownToPlayer: false, objectNumber: 27, spawnLocations: ["Umi's House"], name: "Umi's Sweets", rarity: 7, table: '{"Paprika Pumpkin Puff":{"Effect":"No effect. Worth 1 Red Almond Water","Price":5},"Almond Sugar":{"Effect":"Heating it creates 5 Gray Almond Water","Price":3},"Marshmellow Crunch":{"Effect":"Removes a level of exhaustion. If more than 1 is eaten within 24 hours, gain a level of the wretched cycle","Price":3},"Lucky Bar":{"Effect":"Roll 1d100. On a 1-50, you automatically gain 3 failures on your next roll. On a 51-100, you automatically gain 3 successes on your next roll.","Price":1},"Mist of Knowledge":{"Effect":"Treat a skill as though it was tier 5. After you use that skill, lose this effect.","Price":4},"Others":{"Effect":"Candies without an effect.","Price":0}}', encumbrance: 0, description: "A bag containing a few different kind of candy and sweets. When you eat one, you gain an effect as shown below."},
    {price: 1, shownToPlayer: false, objectNumber: 38, spawnLocations: ["All"], name: "Red Light White Light", rarity: 0, table: 'No', encumbrance: 0, description: "A small white unactivated glowstick. When put into food or drink, it flashes red if it is contaminated."},
    {price: 2, shownToPlayer: false, objectNumber: 13, spawnLocations: ["4"], name: "Office Terminal", rarity: 1, table: 'No', encumbrance: 2, description: "A dell computer. When you turn it on, you will be prompted for a username. After typing it in and hitting enter, you enter into a chatroom with unknown users. Asking questions here may grant you useful information, but may also grant you harmful information. This username and chatroom persist across all instances of this Object."},
    {price: 0, shownToPlayer: false, objectNumber: 96, spawnLocations: ["All", "906"], name: "Blanche's Gifts", rarity: 9, table: '{"Books":{"Description":"A book in pristine condition complete with a signature from Blanche.","Acquisition":"Found randomly.","Effect":"When you touch the signature, you and any targets of your choice teleport to Level 906."},"MoonJewel Pendant":{"Description":"A silver chained pendant with a blue gem.","Acquisition":"Becoming a true friend to Blanche.","Effect":"Unkown."},"Starlight Perfume":{"Description":"A glass bottle with silver filigree and blue gems. It has the fragrance of lavender, dry wood, and bergamot.","Acquisition":"Ask about or compliment Blanche fragrance.","Effect":"When you apply the perfume to yourself, you gain an extra attack on each attack action taken per turn. This lasts for 5 rounds and the perfume may not be reapplied for another 24 hours."},"Blanchies":{"Description":"Plushies made by Blanche. The appearance of the plush changes based on who it was made for.","Acquisition":"Be a child.","Effect":"While in possession, 50% chance to stop a hostile entity spawn."},"Blankets":{"Description":"Thick wool blankets of varying design.","Acquisition":"Complain about the cold, come from a cold level, or have it be winter.","Effect":"While worn, gain 3 soak."},"Special Packed Lunch":{"Description":"Bento boxes varied in size and shape.","Acquisition":"Meet Blanche.","Effect":"Keep any rations perfectly fresh once placed inside."}}', encumbrance: 0, description: "Multiple different gifts, so long as it was made by Blanche (Entity 140), collectively form this Object. These objects are shown below."},
    {price: 0, shownToPlayer: false, objectNumber: 97, spawnLocations: ["Beta"], name: "The Everything Machine", rarity: 10, table: 'No', encumbrance: 999, description: "A giant box of wires and terminals in various positions and orientations. This machine is capable of destroying and creating anything but it is more complex and complicatied than you could even imagine."},
    {price: 6, shownToPlayer: false, objectNumber: 24, spawnLocations: ["0", "68", "74", "177", "Station 1", "Station 2", "Station 3", "Area 2"], name: "Wall Mask", rarity: 5, table: '{"Colombina Mask":{"description":"A sleek venetian eye mask, similar to the masks worn in phantom of the opera. These tend to be colorful.","type":"Outstanding","difficulty":"2","effect":"You become secretive. Your stealth acts as though it is 1 level higher while your discipline acts as though it is 1 level lower."},"Bauta Mask":{"description":"A rectangular full face mask with a pointed chin, defined nose, and eye holes. These tend to be one base color.","type":"Outstanding","difficulty":"2","effect":"You may only use blunt objects to attack. This means no firearms and no sharp weapons."},"Pantalone Mask":{"description":"A solid color mask with a nose similar to a beak that ends above the mouth.","type":"Outstanding","difficulty":"2","effect":"All social interaction checks add 1 difficulty."},"Volto Mask":{"description":"A white full face mask with golden swirls on it.","type":"Basic","difficulty":"3","effect":"Your deception skill acts as though it is 1 level higher. You recieve 2 wounds per round in social encounters."},"Kitsune Mask":{"description":"A half mask that ends above the mouth. It tends to be colorful and resembles that of a fox.","type":"Basic","difficulty":"3","effect":"Your charm skill acts as though it is 1 level higher but uour negotiation skill acts as though it is 1 level lower."},"Arlecchino Mask":{"description":"A solid color mask that ends above the mouth. It has a large nose and plump cheeks.","type":"Basic","difficulty":"3","effect":"You cannot stealth, but you recieve an extra free maneuver per turn. This does not count towards your maneuver per turn limit."},"Buskin Mask":{"description":"A tragedy mask.","type":"No","difficulty":"4","effect":"You automatically gain 3 failures to any check made using cool."},"Oni Mask":{"description":"A full mask, generally red in color, with horns and large fangs around the mouth. This is to resemble a demon.","type":"No","difficulty":"4","effect":"You involintarily attack any you deem as evil or corrupt."},"Sock Mask":{"description":"A comedy mask.","type":"No","difficulty":"4","effect":"You involuntarily attack any not smiling whenever you look at them."}}', encumbrance: 0, description: "A mask bolted on the wall, or sometimes next to a corpse on the floor. Whenever you see a mask, you must roll vigilance to not be compelled to put the mask on. The difficulty is determined by the type of mask. If you fail, you must attempt to put the mask on. At the end of each hour, you may attempt the vigilance check again to remove the mask. If another player attempts to remove your mask, you automatically enter combat with said player. The attempting player must succeed on an athletics or coordination check against your coordination in order to succeed."},
  ];
*/