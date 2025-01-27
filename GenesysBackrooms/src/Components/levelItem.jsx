import { Box, Button, Stack, Typography } from "@mui/material";
import ObjectItem from '../Components/objectItem';
import WeaponItem from '../Components/weaponItem';
import ArmorItem from '../Components/armorItem';
import MundaneItem from '../Components/mundaneItem';
import People from '../Components/people';
import PhenomenonItem from '../Components/phenomenonItem';
import EntityItem from '../Components/entityItem';
import { useState } from "react";

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
      const levelExits = level.exitFromLevel.split('/');
      const exitFromLevelCount = Math.floor(Math.random() * 100) <= parseInt(level.exitFromLevelChance) ? 1: 0;

      return (
        <Box key={roomIndex} sx={{ border: '1px solid black', p: 2, my: 2 }}>
          <Typography variant="h6">Room {roomIndex + 1}</Typography>
          
          <Typography>Room Size: {width} feet by {length} feet by {level.roomHeight} feet</Typography>
          <Typography>Light Level: {lightLevel}</Typography>
          <Typography>Heat Level: {heat}</Typography>
          <Typography>Corrosive Atmosphere: {corrosion}</Typography>
          
          <Typography variant="subtitle1">Exits ({exitsPerRoom}):</Typography>
          <Box pl={2}>
            {exitTypes.map((exit, index) => (
              <Box>
                <Typography key={index}>- {exit}</Typography>
              </Box>
            ))}
          </Box>

          <Typography variant="subtitle1">Exits From Level:</Typography>
          <Box pl={2}>
            <SelectFromCount count={exitFromLevelCount} list={levelExits}/>
          </Box>
  
          <Typography variant="subtitle1">Effects:</Typography>
          <Box pl={2}>
            {effects.map((effect, index) => (
              <Typography key={index}>- {effect}</Typography>
            ))}
          </Box>
  
          <Typography variant="subtitle1">Spawns:</Typography>
          <Stack direction='row' spacing={2}>
            {spawns.map((spawn) => (
              determineSpawns(spawn)
            ))}
          </Stack>
  
          <Typography variant="subtitle1">Defects:</Typography>
          <Box pl={2}>
            {defects.map((defect, index) => (
              <Typography key={index}>- {defect}</Typography>
            ))}
          </Box>
        </Box>
      );
    };
    
    return (
      <Box>
        <Typography variant="h5">Finite Level: {level.name}</Typography>
        <Typography>Total Rooms: {level.roomCount}</Typography>
        
        {[...Array(parseInt(level.roomCount))].map((_, index) => renderRoom(index))}
      </Box>
    );
  }

  const SelectFromCount = (props) => {
    if(props.count === 0) return <Typography>- None</Typography>

    const chosen = [];
    //Props are count and list of possibles.
    for(let i = 0; i < props.count; i++) {
      chosen.push(props.list[Math.floor(Math.random() * props.list.length)]);
    }

    return (
      <Box>
        {chosen.map((item, index) => {
          return <Typography key={index}>- {item}</Typography>
        })}
      </Box>
    )
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

          if(Math.floor(Math.random() * 101) <= 15 || extraSocials[0] === 'None') return <People currPerson={chosen}/>
          return <Typography>{extraSocials[Math.floor(Math.random() * extraSocials.length)]}</Typography>
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
  }

  return (
    <Box>
      <Typography variant="h3" textAlign='center'>Level {level.level}: {level.name}</Typography>
      <Typography textAlign='center'>{level.description}</Typography>
      <br />
      {level.finite === 'Yes' ? <FiniteRoom /> :
        <Box>
          <Button variant="outlined" onClick={() => setRefresh(!refresh)}>Next Room</Button>
          <Box sx={{ p: 2, my: 2 }}>
            <Typography>Room Size: {width} feet by {length} feet by {level.roomHeight} feet</Typography>
            <Typography>Light Level: {lightLevel}</Typography>
            <Typography>Heat Level: {heat}</Typography>
            <Typography>Corrosive Atmosphere: {corrosion}</Typography>
            <br />
            <Typography variant="subtitle1">Exits: ({exitCount})</Typography>
            <Box pl={2}>
              <SelectFromCount count={exitCount} list={exitTypes}/>
            </Box>

            <Typography variant="subtitle1">Exits From Level:</Typography>
            <Box pl={2}>
              <SelectFromCount count={exitFromLevelCount} list={levelExits}/>
            </Box>
            
            <Typography variant="subtitle1">Effects:</Typography>
            <Box pl={2}>
              <SelectFromCount count={effectCount} list={effects} />
            </Box>
            
            {/*Add loop to get more than 1 spawn per room. */}
            <Typography variant="subtitle1">Spawns:</Typography>
            <Stack direction='row' spacing={2}>
              {[...Array(Math.floor(Math.random() * parseInt(level.maxSpawns)) + 1)].map(() => determineSpawns(null))}
            </Stack>
            
            <Typography variant="subtitle1">Defects:</Typography>
            <Box pl={2}>
              <SelectFromCount count={defectCount} list={defects}/>
            </Box>
          </Box>
        </Box>
      }
    </Box>
  )
}