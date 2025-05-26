import { Box, Button, Typography, Card,CardContent,CardHeader,Grid,Chip,Stack,Paper,Fade,Avatar,Accordion,AccordionSummary,AccordionDetails } from "@mui/material";
import ObjectItem from '../Components/objectItem';
import WeaponItem from '../Components/weaponItem';
import ArmorItem from '../Components/armorItem';
import MundaneItem from '../Components/mundaneItem';
import People from '../Components/people';
import PhenomenonItem from '../Components/phenomenonItem';
import EntityItem from '../Components/entityItem';
import { useState } from "react";
import { Home,Refresh,Visibility,Thermostat,Dangerous,ExitToApp,AutoAwesome,Group,Construction,ExpandMore,Room,Map } from '@mui/icons-material';

export default function LevelItem(props) {
  const [refresh, setRefresh] = useState(false);

  const level = props.data.level;
  const lightLevel = Math.floor(Math.random() * (parseInt(level.lightLevels.split('/')[1]) - parseInt(level.lightLevels.split('/')[0]) + 1)) + parseInt(level.lightLevels.split('/')[0]);
  const corrosion = Math.floor(Math.random() * 100) <= level.chanceOfCorrosion ? Math.floor(Math.random() * (level.corrosiveAtmosphere + 1)) : 0;
  const heat = Math.floor(Math.random() * (parseInt(level.heat.split('/')[1]) - parseInt(level.heat.split('/')[0]) + 1)) + parseInt(level.heat.split('/')[0]);
  const effectCount = Math.floor(Math.random() * (level.effectCount + 1));
  const effects = level.effects.split('/');
  const roomSizes = level.roomSize.split('/');
  const width = Math.floor(Math.random() * (parseInt(roomSizes[0].split('!')[1]) - parseInt(roomSizes[0].split('!')[0]) + 1)) + parseInt(roomSizes[0].split('!')[0]);
  const length = Math.floor(Math.random() * (parseInt(roomSizes[1].split('!')[1]) - parseInt(roomSizes[1].split('!')[0]) + 1)) + parseInt(roomSizes[1].split('!')[0]);
  const exitCount = Math.floor(Math.random() * parseInt(level.exitCount)) + 1;
  const exitTypes = level.exitTypes.split('/');
  const exitFromLevelCount = Math.floor(Math.random() * 100) <= parseInt(level.exitFromLevelChance) ? 1: 0;
  const levelExits = level.exitFromLevel.split('/');
  const defectCount = Math.floor(Math.random() * (parseInt(level.defectCount) + 1));
  const defects = level.defects.split('/');
  const spawnChances = level.spawnChances.split('/');

  // Get level difficulty theme
  const getLevelTheme = () => {
    const difficulty = parseInt(level.sdClass);
    if (difficulty <= 1) {
      return {
        color: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        category: 'Safe',
        icon: '🏠'
      };
    } else if (difficulty > 1 && difficulty <= 3) {
      return {
        color: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
        category: 'Moderate',
        icon: '🏢'
      };
    } else if (difficulty > 3 && difficulty <= 4) {
      return {
        color: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        category: 'Dangerous',
        icon: '⚠️'
      };
    } else {
      return {
        color: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
        category: 'Lethal',
        icon: '💀'
      };
    }
  };

  const theme = getLevelTheme();

  const StatCard = ({ icon, label, value, color = 'rgba(255,255,255,0.9)' }) => (
    <Paper
      elevation={2}
      sx={{
        p: 2,
        borderRadius: 2,
        background: 'rgba(255,255,255,0.1)',
        backdropFilter: 'blur(10px)',
        textAlign: 'center'
      }}
    >
      <Box display="flex" alignItems="center" justifyContent="center" gap={1} mb={1}>
        {icon}
        <Typography variant="subtitle2" fontWeight="bold" color="white">
          {label}
        </Typography>
      </Box>
      <Typography variant="h6" fontWeight="bold" color={color}>
        {value}
      </Typography>
    </Paper>
  );

  const SectionCard = ({ icon, title, children, defaultExpanded = true }) => (
    <Accordion 
      defaultExpanded={defaultExpanded}
      sx={{
        background: 'rgba(255,255,255,0.1)',
        backdropFilter: 'blur(10px)',
        '&:before': { display: 'none' },
        borderRadius: 2,
        mb: 2
      }}
    >
      <AccordionSummary 
        expandIcon={<ExpandMore sx={{ color: 'white' }} />}
        sx={{ color: 'white' }}
      >
        <Box display="flex" alignItems="center" gap={1}>
          {icon}
          <Typography variant="h6" fontWeight="bold">
            {title}
          </Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        {children}
      </AccordionDetails>
    </Accordion>
  );

  const FiniteRoom = () => {
    const level = props.data.level;

    const renderRoom = (roomIndex) => {
      // Parse room-specific data
      const exitsPerRoom = level.exitsPerRoom.split('/')[roomIndex];
      const exitTypes = level.exitTypesPerRoom.split('/')[roomIndex].split('!');
      const lightLevel = level.lightLevelPerRoom.split('/')[roomIndex];
      const heat = level.heatPerRoom.split('/')[roomIndex];
      const effects = level.effectPerRoom.split('/')[roomIndex].split('!');
      const spawns = level.spawnPerRoom.split('/')[roomIndex].split('!');
      const defects = level.defectsPerRoom.split('/')[roomIndex].split('!');
      const roomSizes = level.sizeOfRooms.split('/');
      const width = roomSizes[roomIndex].split('!')[0];
      const length = roomSizes[roomIndex].split('!')[1];
      const corrosion = level.useAtmopshere.split('/')[roomIndex] === 'Yes' ? (Math.floor(Math.random() * level.corrosiveAtmosphere) + 1) : 0;
      const exitFromLevelCount = Math.floor(Math.random() * 100) <= parseInt(level.exitFromLevelChance) ? 1: 0;

      return (
        <Card 
          key={roomIndex} 
          elevation={4}
          sx={{ 
            mb: 3,
            borderRadius: 3,
            background: 'rgba(255,255,255,0.08)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.2)'
          }}
        >
          <CardHeader
            avatar={
              <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}>
                <Room />
              </Avatar>
            }
            title={
              <Typography variant="h5" fontWeight="bold" color="white">
                Room {roomIndex + 1}
              </Typography>
            }
            sx={{ color: 'white' }}
          />
          <CardContent>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={6} sm={3}>
                <StatCard 
                  icon={<Home fontSize="small" />} 
                  label="Size" 
                  value={`${width}×${length}×${level.roomHeight} ft`} 
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <StatCard 
                  icon={<Visibility fontSize="small" />} 
                  label="Light" 
                  value={lightLevel} 
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <StatCard 
                  icon={<Thermostat fontSize="small" />} 
                  label="Heat" 
                  value={heat} 
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <StatCard 
                  icon={<Dangerous fontSize="small" />} 
                  label="Corrosion" 
                  value={corrosion} 
                  color={corrosion > 0 ? '#ef4444' : 'rgba(255,255,255,0.9)'}
                />
              </Grid>
            </Grid>

            <SectionCard icon={<ExitToApp />} title={`Exits (${exitsPerRoom})`}>
              <Stack spacing={1}>
                {exitTypes.map((exit, index) => (
                  <Chip
                    key={index}
                    label={exit}
                    size="small"
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      justifyContent: 'flex-start'
                    }}
                  />
                ))}
              </Stack>
            </SectionCard>

            <SectionCard icon={<Map />} title="Level Exits">
              <SelectFromCount count={exitFromLevelCount} list={levelExits} type={'exitsFromLevel'}/>
            </SectionCard>

            <SectionCard icon={<AutoAwesome />} title="Effects">
              <Stack spacing={1}>
                {effects.map((effect, index) => (
                  <Chip
                    key={index}
                    label={effect}
                    size="small"
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      justifyContent: 'flex-start'
                    }}
                  />
                ))}
              </Stack>
            </SectionCard>

            <SectionCard icon={<Group />} title="Spawns">
              <Grid container spacing={2}>
                {spawns.map((spawn, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    {determineSpawns(spawn)}
                  </Grid>
                ))}
              </Grid>
            </SectionCard>

            <SectionCard icon={<Construction />} title="Defects">
              <Stack spacing={1}>
                {defects.map((defect, index) => (
                  <Chip
                    key={index}
                    label={defect}
                    size="small"
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      justifyContent: 'flex-start'
                    }}
                  />
                ))}
              </Stack>
            </SectionCard>
          </CardContent>
        </Card>
      );
    };
    
    return (
      <Box>
        <Typography variant="h4" fontWeight="bold" color="white" textAlign="center" sx={{ mb: 3 }}>
          Finite Level Layout
        </Typography>
        <Paper
          elevation={2}
          sx={{
            p: 2,
            mb: 3,
            borderRadius: 2,
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
            textAlign: 'center'
          }}
        >
          <Typography variant="h6" color="white">
            Total Rooms: {level.roomCount}
          </Typography>
        </Paper>
        
        {[...Array(parseInt(level.roomCount))].map((_, index) => renderRoom(index))}
      </Box>
    );
  }

  const SelectFromCount = (props) => {
    if(props.count === 0) return (
      <Typography color="rgba(255,255,255,0.7)" fontStyle="italic">
        None
      </Typography>
    );

    const chosen = [];
    //Props are count, list of possibles, and type of list.
    for(let i = 0; i < props.count; i++) {
      chosen.push(props.list[Math.floor(Math.random() * props.list.length)]);
    }

    let exitNum = -1;
    if(props.count > 0 && props.type === 'exitsFromLevel') exitNum = Math.floor(Math.random() * level.exitCount);

    return (
      <Stack spacing={1}>
        {chosen.map((item, index) => (
          <Chip
            key={index}
            label={`${item} ${props.type === 'exitsFromLevel' ? `(${exitNum})` : ""}`}
            size="small"
            sx={{
              bgcolor: 'rgba(255,255,255,0.2)',
              color: 'white',
              justifyContent: 'flex-start'
            }}
          />
        ))}
      </Stack>
    );
  }

  const determineSpawns = (spawn) => {
    let runningTotal = 0;
    for(let i = 0; i < spawnChances.length; i++) {
      runningTotal += parseInt(spawnChances[i]);
    }
  
    const values = [parseFloat(spawnChances[0] / runningTotal) * 100];
    for(let i = 1; i < spawnChances.length; i++) {
      values.push(parseFloat(spawnChances[i]) / runningTotal * 100 + values[i - 1]);
    }
  
    const value = ((Math.random() * 100) + 1);
    const spawnTypes = ['NOTHING', 'OBJECT', 'ENTITY', 'SOCIAL', 'PHENOMENA'];
    let selectedType = spawnTypes[0]; // Default to NOTHING
  
    const makeTool = (maxP, minP, maxR, minR, cap, battery, tool) => {
      const multi = tool === 'Lantern' ? 2 : 1;
      const power = Math.floor(Math.random() * (maxP - minP + 1)) + minP;
      const range = Math.floor(Math.random() * (maxR - minR + 1)) + minR;
      let rangeBand = '';
      if(range === 1) rangeBand = 'Engaged';
      if(range === 2) rangeBand = 'Short';
      if(range === 3) rangeBand = 'Medium';
      if(range === 4) rangeBand = 'Long';
      if(range === 5) rangeBand = 'Extreme';
      const batteryDrain = Math.round((multi * cap) / (power * range * (cap * 0.01)));

      return 'This ' + tool + ' uses + ' + battery + ' batteries and lasts for ' + batteryDrain + ' hours with a power of ' + power + ' and a range of ' + rangeBand;
    }

    const Flashlight = (props) => {
      switch(props.batteryType) {
        case 0:
          return <MundaneItem currMundane={{
            name: chosen.name,
            description: makeTool(9, 4, 4, 2, 2500, 'AA', 'flashlight'),
            price: chosen.price,
            rarity: chosen.rarity,
            spawnLocations: chosen.spawnLocations,
            usedBy: chosen.usedBy,
            hidden: chosen.hidden
          }}/>
        case 1:
          return <MundaneItem currMundane={{
            name: chosen.name,
            description: makeTool(8, 3, 3, 2, 750, 'AAA', 'flashlight'),
            price: chosen.price,
            rarity: chosen.rarity,
            spawnLocations: chosen.spawnLocations,
            usedBy: chosen.usedBy,
            hidden: chosen.hidden
          }}/>
        case 2:
          return <MundaneItem currMundane={{
            name: chosen.name,
            description: makeTool(6, 2, 3, 2, 550, 'AAAA', 'flashlight'),
            price: chosen.price,
            rarity: chosen.rarity,
            spawnLocations: chosen.spawnLocations,
            usedBy: chosen.usedBy,
            hidden: chosen.hidden
          }}/>
        default:
          return <MundaneItem currMundane={{
            name: chosen.name,
            description: makeTool(4, 1, 2, 2, 55, 'A23', 'flashlight'),
            price: chosen.price,
            rarity: chosen.rarity,
            spawnLocations: chosen.spawnLocations,
            usedBy: chosen.usedBy,
            hidden: chosen.hidden
          }}/>
      }
    }

    const Lantern = (props) => {
      switch(props.batteryType) {
        case 0:
          return <MundaneItem currMundane={{
            name: chosen.name,
            description: makeTool(6, 3, 4, 2, 1000, '9V', 'Lantern'),
            price: chosen.price,
            rarity: chosen.rarity,
            spawnLocations: chosen.spawnLocations,
            usedBy: chosen.usedBy,
            hidden: chosen.hidden
          }}/>
        case 1:
          return <MundaneItem currMundane={{
            name: chosen.name,
            description: makeTool(10, 7, 4, 4, 1000, 'N', 'Lantern'),
            price: chosen.price,
            rarity: chosen.rarity,
            spawnLocations: chosen.spawnLocations,
            usedBy: chosen.usedBy,
            hidden: chosen.hidden
          }}/>
        case 2:
          return <MundaneItem currMundane={{
            name: chosen.name,
            description: makeTool(8, 4, 4, 3, 7800, 'C', 'Lantern'),
            price: chosen.price,
            rarity: chosen.rarity,
            spawnLocations: chosen.spawnLocations,
            usedBy: chosen.usedBy,
            hidden: chosen.hidden
          }}/>
        default:
          return <MundaneItem currMundane={{
            name: chosen.name,
            description: makeTool(10, 5, 4, 3, 10000, 'D', 'Lantern'),
            price: chosen.price,
            rarity: chosen.rarity,
            spawnLocations: chosen.spawnLocations,
            usedBy: chosen.usedBy,
            hidden: chosen.hidden
          }}/>
      }
    }

    const determineRarity = () => {
      const rarity = Math.floor(Math.random() * 100) + 1;
      let chosenRarity = 0;
      if(rarity < 40) chosenRarity = 1;
      else if(rarity >= 40 && rarity < 70) chosenRarity = 3;
      else if(rarity >= 70 && rarity < 90) chosenRarity = 5;
      else if(rarity >= 90 && rarity < 98) chosenRarity = 7;
      else chosenRarity = 9;
  
      return chosenRarity;
    }

    const determineDifficulty = () => {
      const difficulty = Math.floor(Math.random() * 100) + 1;
      let chosenDifficulty = 0;
      if(difficulty <= 40) chosenDifficulty = 1;
      else if(difficulty <= 65) chosenDifficulty = 2;
      else if(difficulty <= 80) chosenDifficulty = 3;
      else if(difficulty <= 88) chosenDifficulty = 4;
      else if(difficulty <= 93) chosenDifficulty = 5;
      else if(difficulty <= 97) chosenDifficulty = 6;
      else if(difficulty <= 99) chosenDifficulty = 7;
      else chosenDifficulty = 8;
  
      return chosenDifficulty;
    }

    for(let i = 0; i < values.length; i++) {
      if(value <= values[i]) {
        selectedType = spawnTypes[i];
        if(spawn !== null) selectedType = spawn.toUpperCase();
        if(selectedType === 'OBJECT') {
          const objectRoll = Math.floor(Math.random() * 100) + 1;
          if(objectRoll <= 25) {
            const rarity = determineRarity();
            const filtered = [];
            for(let i = 0; i < props.data.armor.length; i++) {
              if(props.data.armor[i].rarity === rarity || props.data.armor[i].rarity === (rarity - 1)) {
                for(let j = 0; j < props.data.armor[i].spawnLocations.split('/').length; j++) {
                  if(props.data.armor[i].spawnLocations.split('/')[j] === 'All' || props.data.armor[i].spawnLocations.split('/') === level.level || props.data.armor[i].spawnLocations.split('/') === level.name || level.tags.includes(props.data.armor[i].spawnLocations.split('/')[j])) {
                    filtered.push(props.data.armor[i]);
                    break;
                  }
                }
              }
            }

            const random = filtered.length === 0 ? Math.floor(Math.random() * props.data.armor.length) : Math.floor(Math.random() * filtered.length);
            let chosen = filtered.length === 0 ? props.data.armor[random] : filtered[random];

            return <ArmorItem currArmor={chosen}/>
          }
          else if (objectRoll <= 50) {
            const rarity = determineRarity();
            const filtered = [];
            for(let i = 0; i < props.data.weapons.length; i++) {
              if(props.data.weapons[i].rarity === rarity || props.data.weapons[i].rarity === (rarity - 1)) {
                for(let j = 0; j < props.data.weapons[i].spawnLocations.split('/').length; j++) {
                  if(props.data.weapons[i].spawnLocations.split('/')[j] === 'All' || props.data.weapons[i].spawnLocations.split('/') === level.level || props.data.weapons[i].spawnLocations.split('/') === level.name || level.tags.includes(props.data.weapons[i].spawnLocations.split('/')[j])) {
                    filtered.push(props.data.weapons[i]);
                    break;
                  }
                }
              }
            }

            const random = filtered.length === 0 ? Math.floor(Math.random() * props.data.weapons.length) : Math.floor(Math.random() * filtered.length);
            let chosen = filtered.length === 0 ? props.data.weapons[random] : filtered[random];

            return <WeaponItem currWeapon={chosen}/>
          }
          else if (objectRoll <= 75) {
            const rarity = determineRarity();
            const filtered = [];
            for(let i = 0; i < props.data.objects.length; i++) {
              if(props.data.objects[i].rarity === rarity || props.data.objects[i].rarity === (rarity - 1)) {
                for(let j = 0; j < props.data.objects[i].spawnLocations.length; j++) {
                  if(props.data.objects[i].spawnLocations[j] === 'All' || props.data.objects[i].spawnLocations[j] === level.level || props.data.objects[i].spawnLocations[j] === level.name || level.tags.includes(props.data.objects[i].spawnLocations[j])) {
                    filtered.push(props.data.objects[i]);
                    break;
                  }
                }
              }
            }

            const random = filtered.length === 0 ? Math.floor(Math.random() * props.data.objects.length) : Math.floor(Math.random() * filtered.length);
            let chosen = filtered.length === 0 ? props.data.objects[random] : filtered[random];
            return <ObjectItem currObject={chosen}/>
          }
          else {
            const rarity = determineRarity();
            const filtered = [];
            for(let i = 0; i < props.data.mundane.length; i++) {
              if(props.data.mundane[i].rarity === rarity || props.data.mundane[i].rarity === (rarity - 1)) {
                for(let j = 0; j < props.data.mundane[i].spawnLocations.length; j++) {
                  if(props.data.mundane[i].spawnLocations.split('/')[j] === 'All' || props.data.mundane[i].spawnLocations.split('/')[j] === level.level || props.data.mundane[i].spawnLocations.split('/')[j] === level.name || level.tags.includes(props.data.mundane[i].spawnLocations.split('/')[j])) {
                    filtered.push(props.data.mundane[i]);
                    break;
                  }
                }
              }
            }

            const random = filtered.length === 0 ? Math.floor(Math.random() * props.data.mundane.length) : Math.floor(Math.random() * filtered.length);
            let chosen = filtered.length === 0 ? props.data.mundane[random] : filtered[random];

            if(chosen.name === 'Flashlight') {
              const batteryType = Math.floor(Math.random() * 4);
              return <Flashlight batteryType={batteryType}/>
            }

            if(chosen.name === 'Lantern') {
              const batteryType = Math.floor(Math.random() * 4);
              return <Lantern batteryType={batteryType} />
            }

            return <MundaneItem currMundane={chosen}/>
          }
        }
        if(selectedType === 'ENTITY') {
          const difficulty = determineDifficulty();
          const filtered = [];
          for(let i = 0; i < props.data.entities.length; i++) {
            if(props.data.entities[i].difficulty === difficulty) {
              for(let j = 0; j < props.data.entities[i].spawnLocations.length; j++) {
                if(props.data.entities[i].spawnLocations.split('/')[j] === 'All' || props.data.entities[i].spawnLocations.split('/')[j] === level.level || props.data.entities[i].spawnLocations.split('/')[j] === level.name || level.tags.includes(props.data.entities[i].spawnLocations.split('/')[j])) {
                  filtered.push(props.data.entities[i]);
                  break;
                }
              }
            }
          }

          const random = filtered.length === 0 ? Math.floor(Math.random() * props.data.entities.length) : Math.floor(Math.random() * filtered.length);
          let chosen = filtered.length === 0 ? props.data.entities[random] : filtered[random];

          return <EntityItem entity={chosen} />
        }
        if(selectedType === 'SOCIAL') {
          const filtered = [];
          for(let i = 0; i < props.data.interest.length; i++) {
            for(let j = 0; j < props.data.interest[i].spawnLocations.split('/').length; j++) {
              if(props.data.interest[i].spawnLocations.split('/')[j] === level.level || props.data.interest[i].spawnLocations.split('/')[j] === level.name || props.data.interest[i].spawnLocations.split('/')[j] === 'All' || level.tags.includes(props.data.interest[i].spawnLocations.split('/')[j])) {
                filtered.push(props.data.interest[i]);
                break;
              }
            }
          }

          const extraSocials = level.socialEncounters.split('/');

          const random = filtered.length === 0 ? Math.floor(Math.random() * props.data.interest.length) : Math.floor(Math.random() * filtered.length);
          let chosen = filtered.length === 0 ? props.data.interest[random] : filtered[random];

          if(Math.floor(Math.random() * 101) > 15 || extraSocials[0] === 'None') return <People currPerson={chosen}/>
          return (
            <Paper
              elevation={2}
              sx={{
                p: 2,
                borderRadius: 2,
                background: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
                textAlign: 'center'
              }}
            >
              <Typography variant="body2" color="white">
                {extraSocials[Math.floor(Math.random() * extraSocials.length)]}
              </Typography>
            </Paper>
          );
        }
        if(selectedType === 'PHENOMENA') {
          const filtered = [];
          for(let i = 0; i < props.data.phenomena.length; i++) {
            if(props.data.phenomena[i].type === 'Environmental' && props.data.phenomena[i].howOccur.split('/').includes('Random')) filtered.push(props.data.phenomena[i]);
          }

          const random = filtered.length === 0 ? Math.floor(Math.random() * props.data.phenomena.length) : Math.floor(Math.random() * filtered.length);
          let chosen = filtered.length === 0 ? props.data.phenomena[random] : filtered[random];

          return <PhenomenonItem currPhenomenon={chosen}/>
        }
        break;
      }
    }

    return (
      <Paper
        elevation={2}
        sx={{
          p: 2,
          borderRadius: 2,
          background: 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(10px)',
          textAlign: 'center'
        }}
      >
        <Typography variant="body2" color="rgba(255,255,255,0.7)">
          Nothing spawned
        </Typography>
      </Paper>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', background: theme.color, p: 3 }}>
      <Fade in timeout={800}>
        <Box>
          {/* Header */}
          <Card
            elevation={8}
            sx={{
              mb: 4,
              borderRadius: 4,
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)'
            }}
          >
            <CardHeader
              avatar={
                <Avatar
                  sx={{
                    width: 70,
                    height: 70,
                    bgcolor: 'rgba(255,255,255,0.2)',
                    border: '3px solid rgba(255,255,255,0.3)',
                    fontSize: '2rem'
                  }}
                >
                  {theme.icon}
                </Avatar>
              }
              title={
                <Typography variant="h3" fontWeight="bold" color="white">
                  Level {level.level}: {level.name}
                </Typography>
              }
              subheader={
                <Box>
                  <Typography variant="h6" color="rgba(255,255,255,0.9)" sx={{ mb: 1 }}>
                    {level.description}
                  </Typography>
                  <Stack direction='row' spacing={2}>
                    <Typography color='white'>Tags:</Typography>
                    {level.tags.split('/').map((tag, index) => {
                      return <Chip 
                        label={tag}
                        sx={{
                          bgcolor: 'rgba(255,255,255,0.2)',
                          color: 'white',
                          fontWeight: 'bold'
                        }}
                        key={index}
                      />
                    })}
                  </Stack>
                </Box>
              }
              sx={{ p: 3 }}
            />
          </Card>

          {/* Content */}
          {level.finite === 'Yes' ? (
            <FiniteRoom />
          ) : (
            <Card
              elevation={8}
              sx={{
                borderRadius: 4,
                background: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)'
              }}
            >
              <CardHeader
                title={
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h4" fontWeight="bold" color="white">
                      Procedural Room Generator
                    </Typography>
                    <Button
                      variant="contained"
                      onClick={() => setRefresh(!refresh)}
                      startIcon={<Refresh />}
                      sx={{
                        bgcolor: 'rgba(255,255,255,0.2)',
                        color: 'white',
                        backdropFilter: 'blur(10px)',
                        '&:hover': {
                          bgcolor: 'rgba(255,255,255,0.3)'
                        },
                        borderRadius: 3
                      }}
                    >
                      Generate New Room
                    </Button>
                  </Box>
                }
                sx={{ color: 'white', pb: 1 }}
              />
              <CardContent>
                {/* Current Environment */}
                {level.environments !== 'None' && (
                  <Paper
                    elevation={2}
                    sx={{
                      p: 2,
                      mb: 3,
                      borderRadius: 2,
                      background: 'rgba(255,255,255,0.1)',
                      backdropFilter: 'blur(10px)',
                      textAlign: 'center'
                    }}
                  >
                    <Typography variant="h6" color="white" fontWeight="bold">
                      Current Environment: {level.environments.split('/')[Math.floor(Math.random() * level.environments.split('/').length)]}
                    </Typography>
                  </Paper>
                )}

                {/* Room Stats */}
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={6} sm={3}>
                    <StatCard 
                      icon={<Home fontSize="small" />} 
                      label="Room Size" 
                      value={`${width}×${length}×${level.roomHeight} ft`} 
                    />
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <StatCard 
                      icon={<Visibility fontSize="small" />} 
                      label="Light Level" 
                      value={lightLevel} 
                    />
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <StatCard 
                      icon={<Thermostat fontSize="small" />} 
                      label="Heat Level" 
                      value={heat} 
                    />
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <StatCard 
                      icon={<Dangerous fontSize="small" />} 
                      label="Corrosion" 
                      value={corrosion} 
                      color={corrosion > 0 ? '#ef4444' : 'rgba(255,255,255,0.9)'}
                    />
                  </Grid>
                </Grid>

                {/* Room Content Sections */}
                <SectionCard icon={<ExitToApp />} title={`Exits (${exitCount})`}>
                  <SelectFromCount count={exitCount} list={exitTypes} type={'exits'}/>
                </SectionCard>

                <SectionCard icon={<Map />} title="Level Exits">
                  <SelectFromCount count={exitFromLevelCount} list={levelExits} type={'exitsFromLevel'}/>
                </SectionCard>

                <SectionCard icon={<AutoAwesome />} title="Environmental Effects">
                  <SelectFromCount count={effectCount} list={effects} type={'effects'}/>
                </SectionCard>

                <SectionCard icon={<Group />} title="Spawned Objects & Entities" defaultExpanded={true}>
                  <Grid container spacing={2}>
                    {[...Array(Math.floor(Math.random() * parseInt(level.maxSpawns)) + 1)].map((_, index) => (
                      <Grid item xs={12} sm={6} md={4} key={index}>
                        {determineSpawns(null)}
                      </Grid>
                    ))}
                  </Grid>
                </SectionCard>

                <SectionCard icon={<Construction />} title="Room Defects">
                  <SelectFromCount count={defectCount} list={defects} type={'defects'}/>
                </SectionCard>
              </CardContent>
            </Card>
          )}
        </Box>
      </Fade>
    </Box>
  );
}