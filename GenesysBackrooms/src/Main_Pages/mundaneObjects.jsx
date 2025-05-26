import { Box, Button,FormControl,InputLabel, MenuItem, Select, Stack, Typography,TextField,Paper,Grid,IconButton,InputAdornment,Chip,useTheme,useMediaQuery,Fade,Container,AppBar,Toolbar,Fab } from "@mui/material";
import { Add, Search, Clear, FilterList, Inventory } from "@mui/icons-material";
import { collection, doc, onSnapshot, orderBy, query, setDoc } from "firebase/firestore";
import db from '../Components/firebase';
import { useState, useEffect, useCallback } from "react";
import MundaneItem from "../Components/mundaneItem";
import NotLoggedIn from "../Components/notLoggedIn";

export default function MundaneObjects() {
  const [mundaneObjects, setMundaneObjects] = useState([]);
  const [name, setName] = useState('');
  const [rarity, setRarity] = useState('-1');
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const data = [{"name":"AA Battery","description":"A standard 2 inch long and 0.5 inch diameter single cell cylindrical dry battery. This battery can store up to 2,500 milliampere hours or mAH and discharges 1.5 volts.","price":"2 for 4","rarity":5,"spawnLocations":"All","usedBy":"Flashlight","hidden":"No"},
    {"name":"C Battery","description":"A standard 2 inch long and 1 inch diameter single cell cylindrical dry battery.  This battery can store up to 7,800 milliampere hours or mAH and discharges 1.5 volts.","price":"4 for 4","rarity":6,"spawnLocations":"All","usedBy":"Lantern","hidden":"No"},
    {"name":"D Battery","description":"A standard 2.4 inch long and 1.3 inch diameter single cell cylindrical dry battery.  This battery can store up to 10,000 milliampere hours or mAH and discharges 1.5 volts.","price":"5 for 4","rarity":7,"spawnLocations":"All","usedBy":"Lantern","hidden":"No"},
    {"name":"AAA Battery","description":"A standard 1.75 inch long and 0.4 inch diameter single cell cylindrical dry battery.  This battery can store up to 750 milliampere hours or mAH and discharges 1.5 volts.","price":"1 for 4","rarity":2,"spawnLocations":"All","usedBy":"Flashlight","hidden":"No"},
    {"name":"Specialty Fuel","description":"A dark viscous liquid. It smells heavily of gasoline.","price":"1 for 1 liter","rarity":1,"spawnLocations":"All","usedBy":"Hyrum Lanters/Deuclidators","hidden":"Yes"},
    {"name":"Dumb Gum","description":"A hot pink piece of taffy-like gum. The surface is reflective, like glass.","price":"1 for 10","rarity":4,"spawnLocations":"All","usedBy":"None","hidden":"Yes"},
    {"name":"Specialty Beaker","description":"A gray-tinted beaker with no markings on the sides.","price":"1 for 5","rarity":1,"spawnLocations":"All","usedBy":"Liquid Silence/Liquid Pain","hidden":"Yes"},
    {"name":"AAAA Battery","description":"A standard 1.7 inch long and 0.3 inch diameter single cell cylindrical dry battery.  This battery can store up to 550 milliampere hours or mAH and discharges 1.5 volts.","price":"1 for 4","rarity":1,"spawnLocations":"All","usedBy":"Flashlight","hidden":"No"},
    {"name":"9v Battery","description":"A rectangular 0.7 inch by 1 inch by 2 inch electrical battery that. This battery can store up to 1,000 milliampere hours or mAH and discharges 9 volts.","price":"2 for 4","rarity":3,"spawnLocations":"All","usedBy":"Lantern","hidden":"No"},
    {"name":"A23 Battery","description":"A standard 1.1 inch long and 0.4 inch diameter single cell cylindrical dry battery. This battery can store up to 55 milliampere hours or mAH and discharges 12 volts.","price":"1 for 4","rarity":0,"spawnLocations":"All","usedBy":"Flashlight","hidden":"No"},
    {"name":"N Battery","description":"A standard 1.2 inch long and 0.5 inch diameter single cell cylindrical dry battery. This battery can store up to 1,000 milliampere hours or mAH and discharges 1.5 volts.","price":"1 for 4","rarity":4,"spawnLocations":"All","usedBy":"Lantern","hidden":"No"},
    {"name":"Flashlight","description":"A hand-held device that lights up an area. The battery type, power, and range are variable and decided when found. This device can use AA, AAA, AAAA, and A23 batteries.","price":"3 for 1","rarity":2,"spawnLocations":"All","usedBy":"None","hidden":"No"},
    {"name":"Lantern","description":"A hand-held device that lights up an area. The battery type, power, and range are variable and decided when found. This device can use 9V, N, C, and D batteries.","price":"6 for 1","rarity":5,"spawnLocations":"All","usedBy":"None","hidden":"No"},
    {"name":"Armorer's Tools","description":"Tools used to craft armor and other metal objects that aren't weapons or jewelry","price":"1 for 1","rarity":1,"spawnLocations":"All","usedBy":"None","hidden":"No"},
    {"name":"Blacksmith Tools","description":"Tools used to craft weapons","price":"1 for 1","rarity":1,"spawnLocations":"All","usedBy":"None","hidden":"No"},
    {"name":"Goldsmith Tools","description":"Tools used to craft jewelry and anything with gems","price":"1 for 1","rarity":1,"spawnLocations":"All","usedBy":"None","hidden":"No"},
    {"name":"Leatherworker's Tools","description":"Tools used to craft anything to do with leather","price":"1 for 1","rarity":1,"spawnLocations":"All","usedBy":"None","hidden":"No"},
    {"name":"Weaver's Tools","description":"Tools used to craft anything to do with cloth or fibers","price":"1 for 1","rarity":1,"spawnLocations":"All","usedBy":"None","hidden":"No"},
    {"name":"Alchemist Tools","description":"Tools used to craft concoctions and potions","price":"1 for 1","rarity":1,"spawnLocations":"All","usedBy":"None","hidden":"No"},
    {"name":"Carpenter Tools","description":"Tools used to craft anything involving wood as the primary substance","price":"1 for 1","rarity":1,"spawnLocations":"All","usedBy":"None","hidden":"No"},
    {"name":"Culinarian Tools","description":"Tools used to cook","price":"1 for 1","rarity":1,"spawnLocations":"All","usedBy":"None","hidden":"No"},
    {"name":"Miner tools","description":"Tools used to gather rock, ore, and water deposits","price":"1 for 1","rarity":1,"spawnLocations":"All","usedBy":"None","hidden":"No"},
    {"name":"Botanist tools","description":"Tools used to gather natural resources","price":"1 for 1","rarity":1,"spawnLocations":"All","usedBy":"None","hidden":"No"},
    {"name":"Basic Backpack","description":"A brown sack with two straps and a velcrow holding the opening shut. While worn, your encumbrance threshold increases by 4.","price":"4 for 1","rarity":3,"spawnLocations":"All","usedBy":"None","hidden":"No"},
    {"name":"Plague Cloak","description":"A purple cloak exterior with a smooth red interior color. While worn, Plague Goblins will no longer engage you or your belongings","price":"1 for 1","rarity":1,"spawnLocations":"None","usedBy":"None","hidden":"Yes"},
    {"name":"Plague Mask","description":"A plague doctor mask, potentially with bits of skin still attached. While worn, Plague Goblins will no longer engage you or your belongings","price":"1 for 1","rarity":1,"spawnLocations":"None","usedBy":"None","hidden":"Yes"},
    {"name":"Smelter","description":"A portable crucible that can be used to melt down metals, Ink, and plastic.","price":"3 for 1","rarity":2,"spawnLocations":"All","usedBy":"None","hidden":"No"},
    {"name":"Fabric Cutter","description":"A portable machine operated by ambient energy in the air that will break down cloth-based materials.","price":"3 for 1","rarity":2,"spawnLocations":"All","usedBy":"None","hidden":"No"},
    {"name":"Fine Cloak","description":"A silky red cloak. While worn all charm, deception, and leadership checks remove one setback dice from the dice pool.","price":"5 for 1","rarity":4,"spawnLocations":"5","usedBy":"None","hidden":"Yes"},
    {"name":"Herbs","description":"A greenish brown plant-like substance. When making a medicine check, this herb may be used to automatically add a success and an advantage to the roll. This is a one-time use item.","price":"7 for 1","rarity":6,"spawnLocations":"All","usedBy":"None","hidden":"No"},
    {"name":"Thieves' Tools","description":"A collection of lockpicks, files, wires, and oil. When performing a skullduggery check, add an automatic advantage to the roll.","price":"6 for 1","rarity":5,"spawnLocations":"All","usedBy":"None","hidden":"No"},
    {"name":"Torch","description":"A wooden stick with oil-soaked cloth wrapped around the end of it. When lit, it lasts for 5 hours with a light out to short range and a light level of 4. When found its usually already used up.","price":"2 for 1","rarity":1,"spawnLocations":"Dark","usedBy":"None","hidden":"No"},
    {"name":"Aeropack","description":"A device that when worn allows you to fly for up to 30 minutes before running out of fuel. It can hold up to 1 liter of oil.","price":"8 for 1","rarity":7,"spawnLocations":"None","usedBy":"None","hidden":"No"},
    {"name":"Potion of Paralysis","description":"A viscious purple liquid, usually contained within some kind of glass enclosure. This liquid may coated onto a weapon. Whenever this liquid enters the blood stream, a difficulty 3 resilience check must be made or become immobilized for 3 rounds. In addition, any threats on a failure deal 1 strain damage.","price":"7 for 1","rarity":6,"spawnLocations":"None","usedBy":"None","hidden":"Yes"},
    {"name":"First Aid Kit","description":"A plastic box of basic medical needs such as bandages, painkillers, and alcohol for wounds. This kit nullifies the difficulty increase of medicine checks and gives 2 automatic successes to all medicine checks. It can be used 10 times.","price":"3 for 2","rarity":2,"spawnLocations":"None","usedBy":"None","hidden":"No"},
    {"name":"Painkiller","description":"A small red and white pill that when swallowed heals 5 - x wounds where x is the amount of painkillers already taken within 24 hours.","price":"1 for 5","rarity":1,"spawnLocations":"All","usedBy":"First Aid Kit","hidden":"No"},
    {"name":"Personal Access Device","description":"A small handheld computer, similar to a smart phone but thicker and bulkier.","price":"4 for 1","rarity":3,"spawnLocations":"Shops","usedBy":"None","hidden":"No"},
    {"name":"Communications Earpiece","description":"A little bean shaped bead that can be worn in the ear. Any number of these can be connected and allows communication between all others connected while within the same level.","price":"1 for 4","rarity":1,"spawnLocations":"Shops","usedBy":"None","hidden":"Yes"},
    {"name":"Portable Motion Sensor","description":"A small stand with what looks like a camera mounted on top. Any motion within the view of this camera sounds an alarm.","price":"4 for 1","rarity":3,"spawnLocations":"Shops","usedBy":"None","hidden":"Yes"},
    {"name":"Rubbing Alcohol","description":"A dark liquid used to clean wounds. When used, heal 3 wounds but take 1 strain. This can be used 5 times before running out.","price":"2 for 2","rarity":2,"spawnLocations":"All","usedBy":"First Aid Kit","hidden":"No"},
    {"name":"Death Rat Whistle","description":"A whistle that looks eerily close to an Aztec Death Whistle. When blown into, 6 death rats will appear, ready to do as you command.","price":"1 for 6","rarity":5,"spawnLocations":"Dangerous","usedBy":"None","hidden":"No"},
    {"name":"Air Tank","description":"A cylindrical metal tube with a flat bottom and a nozzle at the top. This holds 1 liter of air.","price":"1 for 2","rarity":1,"spawnLocations":"All","usedBy":"Aeropack/Gas Mask","hidden":"No"},
    {"name":"Barrel of Oil","description":"A metal barrel with an icon showing oil. This holds 3 liters of liquid.","price":"1 for 1","rarity":0,"spawnLocations":"1","usedBy":"Aeropack","hidden":"No"},
    {"name":"Glass Vial","description":"A small vial made of glass.","price":"4 for 1","rarity":0,"spawnLocations":"All","usedBy":"Potion of Paralysis","hidden":"No"},
    {"name":"Plastic Bottle","description":"A water bottle. It holds 1 liter of liquid.","price":"10 for 1","rarity":0,"spawnLocations":"All","usedBy":"None","hidden":"No"}]

  const addData = useCallback(async () => {
    try {
      for(let i = 0; i < data.length; i++) {
        await setDoc(doc(db, 'MundaneObjects', data[i].name), {
          name: data[i].name,
          description: data[i].description,
          price: data[i].price,
          rarity: data[i].rarity,
          spawnLocations: data[i].spawnLocations,
          usedBy: data[i].usedBy,
          hidden: data[i].hidden
        });
      }
    } catch (error) {
      console.error("Error adding data:", error);
    }
  }, [data]);

  const getFromDB = useCallback(() => {
    const q = query(collection(db, 'MundaneObjects'), orderBy("name", "asc"));

    const unsub = onSnapshot(q, (querySnapshot) => {
      const queryData = [];
      querySnapshot.forEach((doc) => {
        queryData.push(doc.data());
      });
      setMundaneObjects(queryData);
      setLoading(false);
    });

    return () => {
      unsub();
    };
  }, []);

  const handleNameChange = useCallback((e) => {
    setName(e.target.value);
  }, []);

  const handleRarityChange = useCallback((e) => {
    setRarity(e.target.value);
  }, []);

  const clearFilters = useCallback(() => {
    setName('');
    setRarity('-1');
  }, []);

  const getActiveFilterCount = useCallback(() => {
    let count = 0;
    if (name !== '') count++;
    if (rarity !== '-1') count++;
    return count;
  }, [name, rarity]);

  const getRarityColor = (rarityValue) => {
    const colors = {
      0: '#9e9e9e',  // Grey
      1: '#8bc34a',  // Light Green
      2: '#4caf50',  // Green
      3: '#2196f3',  // Blue
      4: '#3f51b5',  // Indigo
      5: '#9c27b0',  // Purple
      6: '#e91e63',  // Pink
      7: '#f44336',  // Red
      8: '#ff5722',  // Deep Orange
      9: '#ff9800',  // Orange
      10: '#ffc107'  // Amber
    };
    return colors[rarityValue] || '#9e9e9e';
  };

  const DisplayItems = () => {
    const filteredItems = mundaneObjects.filter(item => {
      const matchesVisibility = item.hidden === 'No' || localStorage.getItem('loggedIn')?.toUpperCase() === 'ADMIN';
      const matchesRarity = item.rarity === parseInt(rarity) || rarity === '-1';
      const matchesName = item.name.toUpperCase().includes(name.toUpperCase()) || name === '';
      
      return matchesVisibility && matchesRarity && matchesName;
    });

    if (filteredItems.length === 0) {
      return (
        <Paper 
          sx={{ 
            p: isMobile ? 3 : 4, 
            textAlign: 'center', 
            borderRadius: 3,
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
          }}
        >
          <Typography 
            variant={isMobile ? "h6" : "h5"} 
            color="text.secondary" 
            gutterBottom
          >
            No Objects Found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {name || rarity !== '-1' ? 
              'Try adjusting your search filters' : 
              'No mundane objects are currently available'
            }
          </Typography>
          {getActiveFilterCount() > 0 && (
            <Button 
              onClick={clearFilters} 
              sx={{ mt: 2 }}
              startIcon={<Clear />}
            >
              Clear Filters
            </Button>
          )}
        </Paper>
      );
    }

    return (
      <Stack direction="row" flexWrap="wrap" gap={2}>
        {filteredItems.map((item, index) => (
          <MundaneItem currMundane={item} />
        ))}
      </Stack>
    );
  };

  const FilterSection = () => (
    <Paper 
      elevation={2} 
      sx={{ 
        p: isMobile ? 2 : 3, 
        borderRadius: 3,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white'
      }}
    >
      <Typography 
        variant={isMobile ? "h6" : "h5"} 
        fontWeight="bold" 
        gutterBottom
        sx={{ mb: 3 }}
      >
        Search & Filter
      </Typography>
      
      <Stack spacing={isMobile ? 2.5 : 3}>
        <TextField
          fullWidth
          placeholder="Search by name..."
          value={name}
          onChange={handleNameChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: 'rgba(255,255,255,0.7)' }} />
              </InputAdornment>
            ),
            endAdornment: name && (
              <InputAdornment position="end">
                <IconButton 
                  size="small" 
                  onClick={() => setName('')}
                  sx={{ color: 'rgba(255,255,255,0.7)' }}
                >
                  <Clear />
                </IconButton>
              </InputAdornment>
            ),
            style: { color: 'white' }
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 3,
              '& fieldset': {
                borderColor: 'rgba(255,255,255,0.3)',
              },
              '&:hover fieldset': {
                borderColor: 'rgba(255,255,255,0.5)',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'rgba(255,255,255,0.8)',
              },
            },
            '& .MuiInputLabel-root': {
              color: 'rgba(255,255,255,0.7)',
            },
          }}
        />

        <FormControl fullWidth>
          <InputLabel 
            sx={{ 
              color: 'rgba(255,255,255,0.7)',
              '&.Mui-focused': { color: 'rgba(255,255,255,0.9)' }
            }}
          >
            Rarity Level
          </InputLabel>
          <Select
            value={rarity}
            onChange={handleRarityChange}
            label="Rarity Level"
            sx={{
              borderRadius: 3,
              color: 'white',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255,255,255,0.3)',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255,255,255,0.5)',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255,255,255,0.8)',
              },
              '& .MuiSvgIcon-root': {
                color: 'rgba(255,255,255,0.7)',
              },
            }}
          >
            <MenuItem value='-1'>Any Rarity</MenuItem>
            {[0,1,2,3,4,5,6,7,8,9,10].map(level => (
              <MenuItem key={level} value={level.toString()}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      backgroundColor: getRarityColor(level)
                    }}
                  />
                  Rarity {level}
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Active Filters Display */}
        {getActiveFilterCount() > 0 && (
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1, opacity: 0.9 }}>
              Active Filters:
            </Typography>
            <Stack direction={isMobile ? "column" : "row"} spacing={1} flexWrap="wrap" useFlexGap>
              {name && (
                <Chip
                  label={`Name: "${name}"`}
                  onDelete={() => setName('')}
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    '& .MuiChip-deleteIcon': {
                      color: 'rgba(255,255,255,0.7)',
                      '&:hover': { color: 'white' }
                    }
                  }}
                />
              )}
              {rarity !== '-1' && (
                <Chip
                  label={`Rarity: ${rarity}`}
                  onDelete={() => setRarity('-1')}
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    '& .MuiChip-deleteIcon': {
                      color: 'rgba(255,255,255,0.7)',
                      '&:hover': { color: 'white' }
                    }
                  }}
                />
              )}
            </Stack>
          </Box>
        )}

        {/* Filter Summary */}
        <Box 
          sx={{ 
            pt: 2, 
            borderTop: '1px solid rgba(255,255,255,0.2)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            {mundaneObjects.filter(item => {
              const matchesVisibility = item.hidden === 'No' || localStorage.getItem('loggedIn')?.toUpperCase() === 'ADMIN';
              const matchesRarity = item.rarity === parseInt(rarity) || rarity === '-1';
              const matchesName = item.name.toUpperCase().includes(name.toUpperCase()) || name === '';
              return matchesVisibility && matchesRarity && matchesName;
            }).length} of {mundaneObjects.length} items
          </Typography>
          <Button
            size="small"
            onClick={clearFilters}
            disabled={getActiveFilterCount() === 0}
            startIcon={<Clear />}
            sx={{ 
              color: 'rgba(255,255,255,0.8)',
              '&:hover': { color: 'white' }
            }}
          >
            Clear All
          </Button>
        </Box>
      </Stack>
    </Paper>
  );

  useEffect(() => {
    if (mundaneObjects.length === 0) {
      getFromDB();
    }
  }, [mundaneObjects.length, loading, getFromDB]);

  if (localStorage.getItem("loggedIn") === 'false') {
    return <NotLoggedIn />;
  }

  // Mobile Layout
  if (isMobile) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
        {/* Mobile App Bar */}
        <AppBar position="sticky" elevation={2}>
          <Toolbar>
            <Inventory sx={{ mr: 2 }} />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Mundane Objects
            </Typography>
            <IconButton
              color="inherit"
              onClick={() => setShowFilters(!showFilters)}
            >
              <FilterList badge={getActiveFilterCount()} />
            </IconButton>
            {localStorage.getItem('loggedIn')?.toUpperCase() === 'ADMIN' && (
              <IconButton color="inherit" onClick={addData}>
                <Add />
              </IconButton>
            )}
          </Toolbar>
        </AppBar>

        <Container maxWidth="lg" sx={{ py: 2 }}>
          {/* Collapsible Filters */}
          {showFilters && (
            <Fade in={showFilters}>
              <Box sx={{ mb: 3 }}>
                <FilterSection />
              </Box>
            </Fade>
          )}

          {/* Content */}
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
              <Typography variant="h6" color="text.secondary">
                Loading objects...
              </Typography>
            </Box>
          ) : (
            <DisplayItems />
          )}
        </Container>

        {/* Mobile FAB for filters */}
        {!showFilters && (
          <Fab
            color="primary"
            sx={{
              position: 'fixed',
              bottom: 16,
              right: 16,
            }}
            onClick={() => setShowFilters(true)}
          >
            <FilterList />
          </Fab>
        )}
      </Box>
    );
  }

  // Desktop Layout
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50', mr: 'auto', ml: 'auto', py: 4 }} maxWidth="75%">
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
        <Box sx={{ p: 4 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h3" fontWeight="bold" gutterBottom>
                Mundane Objects Database
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                Browse and manage everyday items and tools
              </Typography>
            </Box>
            {localStorage.getItem('loggedIn')?.toUpperCase() === 'ADMIN' && (
              <Button
                onClick={addData}
                variant="contained"
                startIcon={<Add />}
                size="large"
                sx={{
                  bgcolor: 'rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.3)'
                  }
                }}
              >
                Add Objects
              </Button>
            )}
          </Box>
        </Box>
      </Paper>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <Typography variant="h5" color="text.secondary">
            Loading mundane objects...
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={4}>
          {/* Left Panel - Filters */}
          <Grid item xs={12} md={4} lg={3}>
            <Box sx={{ position: 'sticky', top: 24 }}>
              <FilterSection />
            </Box>
          </Grid>

          {/* Right Panel - Items */}
          <Grid item xs={12} md={8} lg={9}>
            <Paper 
              elevation={2} 
              sx={{ 
                borderRadius: 3,
                minHeight: '60vh',
                p: 3
              }}
            >
              <Box sx={{ mb: 3 }}>
                <Typography variant="h5" fontWeight="bold" color="primary.main">
                  Items Collection
                </Typography>
              </Box>
              <DisplayItems />
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}