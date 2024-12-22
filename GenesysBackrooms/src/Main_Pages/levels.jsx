import { Box, Button, Card, Chip, Divider, FormControl, InputLabel, List, ListItem, MenuItem, Select, Stack, Toolbar, Typography } from "@mui/material";
import { collection, doc, onSnapshot, orderBy, query, setDoc } from "firebase/firestore";
import db from '../Components/firebase';
import { useState } from "react";
import ObjectItem from '../Components/objectItem';
import MundaneItem from '../Components/mundaneItem';
import ArmorItem from '../Components/armorItem';
import WeaponItem from '../Components/weaponItem';
import NotLoggedIn from "../Components/notLoggedIn";

export default function Levels() {
  const [levels, setLevels] = useState([]);
  const [currLevel, setCurrLevel] = useState("Tutorial Level");
  const [generated, setGenerated] = useState(false);
  const [objects, setObjects] = useState([]);
  const [mundane, setMundane] = useState([]);
  const [weapons, setWeapons] = useState([]);
  const [armor, setArmor] = useState([]);

  const getFromDB = (spawnType) => {
    const q = query(collection(db, spawnType));

    const unsub = onSnapshot(q, (querySnapshot) => {
      const queryData = [];
      querySnapshot.forEach((doc) => {
        queryData.push(doc.data());
      })

      if(spawnType === 'Objects') setObjects(queryData);
      if(spawnType === 'MundaneObjects') setMundane(queryData);
      if(spawnType === 'Weapons') setWeapons(queryData);
      if(spawnType === 'Armor') setArmor(queryData);
    })

    return () => {
      unsub();
    };
  }

  const GenerateTile = () => {
    let level = {};
    for(const i of Object.keys(levels)) {
      if(levels[i].name === currLevel) {
        level = levels[i];
      }
    }

    if(level.finite) {
      //Loop through tiles
      //print out tile size, type, defects, spawns, and exit types for each

      return (
        <Box>
          <Typography variant="h2" textAlign='center'>Level {level.level}, {level.name}</Typography>
          <Typography textAlign='center'>{level.description}</Typography>
          <br />
          <Divider />
          <br />
          <Stack direction='row' gap={3} justifyContent='center'>
            <Chip label={'Level Type: ' + level.levelType}></Chip>
            <Chip label={'Time Multiplier: ' + level.time}></Chip>
            <Chip label={'Survival Difficulty Level: ' + level.survivalDifficultyLevel}></Chip>
          </Stack>

          <Stack  direction='row' flexWrap='wrap' gap={1}>
            {level.finiteTiles.map((tile, index) => {
              return (
                <Card variant="outlined" sx={{width: {xs: '100%', md: '400px'}, textAlign: 'center', border: '1px solid black', overflow: 'auto', height: '350px'}} key={index}>
                  <Box sx={{ p: 2 }}>
                    <Typography fontWeight='bold'>Room {index + 1}</Typography>
                    <Typography>{tile.description}</Typography>
                    <Divider />
                    <br />
                    <Typography>Size: {tile.size}</Typography>
                    <Typography>Type: {tile.type}</Typography>
                    {tile.defects.length === 0 ?
                      ""
                    :
                      <Typography>Defect(s): {tile.defects.join(', ')}</Typography>
                    }
                    {tile.spawns.length === 0 ?
                      ""
                    :
                    <Typography>Spawn(s): {tile.spawns.join(', ')}</Typography>
                    }
                    {tile.exitTypes.length === 0 ? 
                      ""
                    :
                    <Typography>Exit Type(s): {tile.exitTypes.join(', ')}</Typography>
                    }
                  </Box>
                </Card>
              )
            })}
          </Stack>
        </Box>
      )
    }

    if(level.tilesGenerated.length > 0) {
      if(Math.floor(Math.random() * 100) <= level.previousTileChance) {
        const tiles = level.tilesGenerated;
        const index = Math.floor(Math.random() * level.tilesGenerated.length);
        const tile = tiles[index];
        
        let tileCount = level.tileCount + 1;
        let drain = false;
        if(tileCount >= level.sanityDrain) {
          tileCount = 0;
          drain = true;
        }

        updateDB(tileCount, tiles, level);
        return <Tile drain={drain} tile={tile}/>
      }
    }

    let size = level.tileSizes[Math.floor(Math.random() * level.tileSizes.length)];
    let type = level.tileTypes[Math.floor(Math.random() * level.tileTypes.length)];
    const defects = [];
    if(level.outdoors) {
      for(let i = 0; i < 3; i++) {
        defects.push(level.tileDefects[Math.floor(Math.random() * level.tileDefects.length)]);
      }
    }
    else {
      if(Math.floor(Math.random() * 100) <= level.tileDefectRate) {
        defects.push(level.tileDefects[Math.floor(Math.random() * level.tileDefects.length)]);
      }
    }

    const spawnCount = Math.floor(Math.random() * 3) + 1;

    const spawns = [];
    for(let i = 0; i < spawnCount; i++) {
      const spawn = Math.floor(Math.random() * 101);
      if(spawn >= level.spawnRates[0] && spawn < level.spawnRates[1]) {
        const objectType = Math.floor(Math.random() * 4);
        switch(objectType) {
          case 0:
            if(objects.length !== 0) {
              const filtered = [];
              const rarity = determineRarity();
              for(let i = 0; i < objects.length; i++) {
                if(objects[i].rarity === rarity || objects[i].rarity === (rarity - 1)) {
                  if(objects[i].spawnLocations.includes(level.level) || objects[i].spawnLocations[0] === 'All') filtered.push(objects[i]);
                }
              }
              spawns.push([filtered[Math.floor(Math.random() * filtered.length)], "Object"]);
            }
            break;
          case 1:
            if(mundane.length !== 0) {
              const filtered = [];
              const rarity = determineRarity();
              for(let i = 0; i < mundane.length; i++) {
                if(mundane[i].rarity === rarity || mundane[i].rarity === (rarity - 1)) {
                  const locations = mundane[i].spawnLocations.split("/");
                  if(locations.includes(level.level) || mundane[i].spawnLocations === 'All') filtered.push(mundane[i]);
                }
              }
              if(filtered.length > 0) //Remove later
                spawns.push([filtered[Math.floor(Math.random() * filtered.length)], "Mundane"]);
              else spawns.push(rarity + " Mundane");
            }
            break;
          case 2:
            if(armor.length !== 0) {
              const filtered = [];
              const rarity = determineRarity();
              for(let i = 0; i < armor.length; i++) {
                if(armor[i].rarity === rarity || armor[i].rarity === (rarity - 1)) {
                  const locations = armor[i].spawnLocations.split("/");
                  if(locations.includes(level.level) || armor[i].spawnLocations === 'All') filtered.push(armor[i]);
                }
              }
              if(filtered.length > 0) //Remove later
                spawns.push([filtered[Math.floor(Math.random() * filtered.length)], "Armor"]);
              else spawns.push(rarity + " Armor");
            }
            break;
          default:
            if(weapons.length !== 0) {
              const filtered = [];
              const rarity = determineRarity();
              for(let i = 0; i < weapons.length; i++) {
                if(weapons[i].rarity === rarity || weapons[i].rarity === (rarity - 1)) {
                  const locations = weapons[i].spawnLocations.split("/");
                  if(locations.includes(level.level) || weapons[i].spawnLocations === 'All') filtered.push(weapons[i]);
                }
              }
              if(filtered.length > 0) //Remove later
                spawns.push([filtered[Math.floor(Math.random() * filtered.length)], "Weapon"]);
              else spawns.push(rarity + " Weapon");
            }
            break;
        }
      }
      else if(spawn >= level.spawnRates[1] && spawn < level.spawnRates[2]) {
        spawns.push(['Entity', 'Entity']);
      }
      else if(spawn >= level.spawnRates[2] && spawn < level.spawnRates[3]) {
        spawns.push(["Event: " + level.events[Math.floor(Math.random() * level.events.length)], "Event"]); //Add people of interest and phenomenons(Environmental only).
      }
      else if(spawn >= level.spawnRates[3] && spawn < level.spawnRates[4]) {
        spawns.push(["Exit: " + level.randomExits[Math.floor(Math.random() * level.randomExits.length)], "Exit"]);
      }
    }

    let exits = Math.floor(Math.random() * level.maxExits);
    if(exits < 1) exits = 1;

    const exitTypes = [];
    for(let i = 0; i < exits; i++) {
      exitTypes.push(level.exitTypes[Math.floor(Math.random() * level.exitTypes.length)]);
    }

    let tileCount = level.tileCount + 1;
    let drain = false;
    if(tileCount >= level.sanityDrain) {
      tileCount = 0;
      drain = true;
    }

    const newTile = {
      tileSize: size,
      tileType: type,
      defectList: defects,
      spawnList: spawns,
      exitList: exitTypes
    }

    updateDB(tileCount, level.tilesGenerated, level, newTile);
    return <Tile drain={drain} tile={newTile}/>
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

  const updateDB = (tileGeneratedCount, generatedTiles, level, newTile) => {
    if(generated) return;

    //add new tile to the generated tiles without duplication. Idk why it wont.

    setDoc(doc(db, 'Levels', level.name), {
      name: level.name,
      level: level.level,
      levelType: level.levelType,
      description: level.description, 
      outdoors: level.outdoors,
      survivalDifficultyLevel: level.survivalDifficultyLevel,
      sanityDrain: level.sanityDrain,
      time: level.time,
      events: level.events,
      randomExits: level.randomExits,
      spawnRates: level.spawnRates,
      finite: level.finite,
      finiteTiles: level.finiteTiles,
      tileSizes: level.tileSizes,
      tileTypes: level.tileTypes,
      tileDefects: level.tileDefects,
      tileDefectRate: level.tileDefectRate,
      tileCount: tileGeneratedCount,
      tilesGenerated: generatedTiles,
      previousTileChance: level.previousTileChance,
      maxExits: level.maxExits,
      exitTypes: level.exitTypes,
      specialExits: level.specialExits,
      tags: level.tags
    })

    setGenerated(true);
  }

  const DisplaySpawned = (props) => {
    switch(props.spawned[1]) {
      case "Object":
        return <ObjectItem currObject={props.spawned[0]} mainPage={false} />
      case "Mundane":
        return <MundaneItem currMundane={props.spawned[0]} />
      case "Armor":
        return <ArmorItem currArmor={props.spawned[0]} />
      case "Weapon":
        return <WeaponItem currWeapon={props.spawned[0]} />
      case "Entity":
        return <Typography>{props.spawned[0]}</Typography>
      case "Event":
        return <Typography>{props.spawned[0]}</Typography>
      case "Exit":
        return <Typography>{props.spawned[0]}</Typography>
      default:
        return;
    }
  }

  const Tile = (props) => {
    let level = {};
    for(const i of Object.keys(levels)) {
      if(levels[i].name === currLevel) {
        level = levels[i];
      }
    }

    return (
      <Box>
        <Typography variant="h2" textAlign='center'>Level {level.level}, {level.name}</Typography>
        <Typography textAlign='center'>{level.description}</Typography>
        <br />
        <Divider />
        <br />
        <Stack direction='row' gap={3} justifyContent='center'>
          <Chip label={'Level Type: ' + level.levelType}></Chip>
          <Chip label={'Time Multiplier: ' + level.time}></Chip>
          <Chip label={'Survival Difficulty Level: ' + level.survivalDifficultyLevel}></Chip>
        </Stack>
        {props.drain ? <Typography>Drain sanity</Typography> : ""}

        {level.specialExits.length > 0 ?
          <>
            <Typography>Non-random exits</Typography>
            <List>
              {Object.keys(level.specialExits).map((exit, index) => {
                return <ListItem key={index}>{exit}: {level.specialExits[exit]}</ListItem>
              })}
            </List>
          </>
        :
          ""  
        }
        <Divider />

        <Typography>Tile Size: {props.tile.tileSize}</Typography>
        <Typography>Tile Type: {props.tile.tileType}</Typography>
        <Divider />
        {props.tile.defectList.length > 0 ?
          <Box>
            <Typography>Defects</Typography>
            <List>
              {props.tile.defectList.map((defect, index) => {
                return <ListItem key={index}>{defect}</ListItem>
              })}
            </List>
            <Divider />
          </Box>
        :
          ""
        }
        {props.tile.spawnList.length > 0 ?
          <Box>
            <Typography>Spawns</Typography>
            <Stack direction='row' gap={1}>
              {props.tile.spawnList.map((spawn) => {
                return (
                  <DisplaySpawned spawned={spawn}/>
                )
              })}
            </Stack>
          </Box>
        :
          ""
        }
        <Typography>Exits</Typography>
        <List>
          {props.tile.exitList.map((exit, index) => {
            return <ListItem key={index}>{exit}</ListItem>
          })}
        </List>
      </Box>
    )
  }

  const data = {
    "Level 0": {
      name: "Tutorial Level",
      level: "0",
      levelType: "Main",
      description: "Level 0 is a non-linear space, resembling the back rooms of a retail outlet. All rooms in Level 0 appear uniform and share superficial features such as a yellowish wallpaper, damp carpet, and inconsistently placed fluorescent lighting. However, no two rooms within the level are identical.", 
      outdoors: false,
      survivalDifficultyLevel: 1,
      sanityDrain: 75,
      time: 1,
      events: [
        "The humming from the flourescent lights becomes deafening, followed by abrupt silence.", 
        "Human-like speech in an unknown language can be heard in the distance or around a corner.", 
        "Sounds of insects chittering.",
        "A floor or ceiling darkens, allowing for noclipping.",
        "A mirror appears."
      ],
      randomExits: ["Red Rooms", "Manila Room", "Zenith Station", "Remodeled Mess"],
      spawnRates: [0, 25, 25, 45, 55],
      finite: false,
      finiteTiles: [],
      tileSizes: ['Small', 'Medium', 'Large'],
      tileTypes: ['Square', 'Rectangle', 'Hallway'],
      tileDefects: ['Pillar', 'Staircase', 'Hole', 'Ramp', 'Door'],
      tileDefectRate: 25,
      tileCount: 0,
      tilesGenerated: [],
      previousTileChance: 6,
      maxExits: 6,
      exitTypes: ["Hole in the wall", "Locked door", "Doorway", "Unlocked door", "Vent", "Small hole"], //What kind of exit to the room.
      specialExits: {"Level 1": "Noclip anywhere on the level."},
      tags: ["Indoors", "Light"] //This is to help items spawn places. These tags can be Indoors, Outdoors, Dark, Light, etc.
    },
    "Red Rooms": {
      name: "Red Rooms",
      level: "0",
      levelType: "Sub",
      description: "The Red Rooms is similar to Level 0, except there is a deep red fog-like hue everywhere, the walls and ceiling are red, and the carpet is coarse and sticky.",
      outdoors: false,
      survivalDifficultyLevel: 3,
      sanityDrain: 25,
      time: 1,
      events: [
        "The humming from the flourescent lights becomes deafening, followed by abrupt silence.", 
        "Human-like speech in an unknown language can be heard in the distance or around a corner.", 
        "Sounds of insects chittering.",
        "A floor or ceiling darkens, allowing for noclipping.",
        "A silhouette of a person appears in the distance, vanishing just as quickly as it appeared.",
        "All electronics cease to work indefinitely while within the Red Rooms."
      ],
      randomExits: [],
      spawnRates: [0, 2, 2, 27, 27],
      finite: false,
      finiteTiles: [],
      tileSizes: ['Small', 'Medium', 'Large'],
      tileTypes: ['Square', 'Rectangle', 'Hallway'],
      tileDefects: ['Pillar', 'Staircase', 'Hole', 'Ramp', 'Door', 'Tally marks on the walls', 'Blood stains', 'Rotted corpses'],
      tileDefectRate: 55,
      tileCount: 0,
      tilesGenerated: [],
      previousTileChance: 40,
      maxExits: 4,
      exitTypes: ["Hole in the wall", "Locked door", "Doorway", "Unlocked door", "Vent", "Small hole"],
      specialExits: {"Level 1": "Noclip anywhere on the level."},
      tags: ["Indoors", "Light"]
    },
    "Manila Room": {
      name: "Manila Room",
      level: "0",
      levelType: "Sub",
      description: "A small room with manila colored wallpaper and carpets.",
      outdoors: false,
      survivalDifficultyLevel: 0,
      sanityDrain: 0,
      time: 1,
      events: [],
      randomExits: [],
      spawnRates: [],
      finite: true,
      finiteTiles: [
        {
          description: "Manila colored wallpaper and dry manila colored carpet.",
          size: "Small",
          type: "Square",
          defects: ["One round table with 8 chairs around it."],
          spawns: ["A folder with a single document in it."],
          exitTypes: []
        }
      ],
      tileSizes: [],
      tileTypes: [],
      tileDefects: [],
      tileDefectRate: 0,
      tileCount: 0,
      tilesGenerated: [],
      previousTileChance: 0,
      maxExits: 0,
      exitTypes: [],
      specialExits: {"Level 0": "Walking through a door."},
      tags: ["Indoors", "Light"]
    },
    "Zenith Station": {
      name: "Zenith Station",
      level: "0",
      levelType: "Sub",
      description: "A megastructure with the workings of a futuristic space ship. It has 10 rooms in total and is made of metal and glass.", 
      outdoors: false,
      survivalDifficultyLevel: 0,
      sanityDrain: 0,
      time: 1,
      events: [],
      randomExits: [],
      spawnRates: [],
      finite: true,
      finiteTiles: [
        { //Bathroom
          description: "Bathroom: Pure white walls and glossy flooring.",
          size: "Small",
          type: "Rectangle",
          defects: ["A standard-looking toilet", "An extravagant off-white vanity holding a sink.", "A shower with 10 different sources for the water."],
          spawns: [],
          exitTypes: ["Unlocked Door"]
        },
        { //Bedroom 1
          description: "Bedroom: Off-white flower wallpaper with seemingly brand new wood flooring.",
          size: "Medium",
          type: "Square",
          defects: ["A large bed with red sheets", "A mohogany nightstand"],
          spawns: ["Grey Almond Water"],
          exitTypes: ["Unlocked Door"]
        },
        { //Bedroom 2
          description: "Bedroom: Dark, almost black walls with grey tile flooring.",
          size: "Medium",
          type: "Square",
          defects: ["A large bed with black sheets", "A mohogany nightstand"],
          spawns: ["Green Almond Water"],
          exitTypes: ["Unlocked Door"]
        },
        { //Bedroom 3
          description: "Bedroom: Pure white walls with space-themed tile flooring.",
          size: "Medium",
          type: "Square",
          defects: ["A large bed with space-themed sheets", "A mohogany nightstand"],
          spawns: ["Red Almond Water"],
          exitTypes: ["Unlocked Door"]
        },
        { //Bedroom 4
          description: "Bedroom: Old-looking green and white striped wallpaper with scuffed oak flooring.",
          size: "Medium",
          type: "Square",
          defects: ["A large bed with green sheets", "A mohogany nightstand."],
          spawns: ["Blue Almond Water"],
          exitTypes: ["Unlocked Door"]
        },
        { //Control Room
          description: "Control room: An all dim-white room with steps down, similar to seating at a concert.",
          size: "Large",
          type: "Rectangle",
          defects: ["A panel with 100s of buttons and levers", "4 chairs of red and gold lining", "Huge window covering one entire wall."],
          spawns: ["Casette player"],
          exitTypes: ["Doorway", "Doorway", "Doorway"]
        },
        { //Cargo Bay
          description: "Cargo Bay: A dimly lit grey room with broken boxes and shattered glass.",
          size: "Medium",
          type: "Rectangle",
          defects: ["An open door", "A huge lever underneath an alarm."],
          spawns: ["Artificial Bottle Lightning"],
          exitTypes: ["Doorway"]
        },
        { //Airlock Room
          description: "Airlock: A dimly lit grey room with yellow lines, similar to warning tape.",
          size: "Medium",
          type: "Rectangle",
          defects: ["A massive circular open door with some kind of gas leaking out."],
          spawns: [""],
          exitTypes: ["Doorway"]
        },
        { //Dining Area
          description: "Dining room: A room with murals on the walls with alternating floor tiles in black and yellow.",
          size: "Medium",
          type: "Rectangle",
          defects: ["A mohogany picnic table."],
          spawns: ["Royal Ration"],
          exitTypes: ["Doorway"]
        },
        { //Kitchen
          description: "Kitchen: A room with murals on the walls with alternating floor tiles in black and yellow.",
          size: "Medium",
          type: "Rectangle",
          defects: ["A counter with a sink, dishwasher, microwave, oven, and air-fryer embedded", "A stack of plastic white plates."],
          spawns: [""],
          exitTypes: ["Doorway"]
        },
      ],
      tileSizes: [],
      tileTypes: [],
      tileDefects: [],
      tileDefectRate: 0,
      tileCount: 0,
      tilesGenerated: [],
      previousTileChance: 0,
      maxExits: 0,
      exitTypes: [],
      specialExits: {"Level 1": "Noclip anywhere on the level."},
      tags: ["Indoors", "Light"]
    },
    "Remodeled Mess": {
      name: "Remodeled Mess",
      level: "0",
      levelType: "Sub",
      description: "Remodeled Mess is similar to Level 0 except the carpet is dry and velvet in color, the walls are clean-looking white, and there is residue of construction work.", 
      outdoors: false,
      survivalDifficultyLevel: 3,
      sanityDrain: 75,
      time: 1,
      events: ["Ceiling tiles fall", "Wall collapses", "Floor breaks"],
      randomExits: ["Level 0"],
      spawnRates: [0, 25, 25, 55, 65],
      finite: false,
      finiteTiles: [],
      tileSizes: ['Small', 'Medium', 'Large'],
      tileTypes: ['Square', 'Rectangle', 'Hallway'],
      tileDefects: ['Pillar', 'Staircase', 'Hole', 'Ramp', 'Door'],
      tileDefectRate: 25,
      tileCount: 0,
      tilesGenerated: [],
      previousTileChance: 6,
      maxExits: 6,
      exitTypes: ["Hole in the wall", "Locked door", "Doorway", "Unlocked door", "Vent", "Small hole"],
      specialExits: {"Level 1": "Noclip anywhere on the level."},
      tags: ["Indoors", "Light"]
    },
    /*
    "": {
      name: "",
      level: "",
      levelType: "",
      description: "", 
      outdoors: false,
      survivalDifficultyLevel: 0,
      sanityDrain: 0,
      time: 0,
      events: [],
      randomExits: [],
      spawnRates: [0, 25, 25, 45, 55],
      finite: false,
      finiteTiles: [],
      tileSizes: [],
      tileTypes: [],
      tileDefects: [],
      tileDefectRate: 0,
      tileCount: 0,
      tilesGenerated: [],
      previousTileChance: 0,
      maxExits: 0,
      exitTypes: [],
      specialExits: {},
      tags: []
    }
    */
  }

  const addData = () => {
    for(const i of Object.keys(data)) {
      setDoc(doc(db, 'Levels', data[i].name), {
        name: data[i].name,
        level: data[i].level,
        levelType: data[i].levelType,
        description: data[i].description, 
        outdoors: data[i].outdoors,
        survivalDifficultyLevel: data[i].survivalDifficultyLevel,
        sanityDrain: data[i].sanityDrain,
        time: data[i].time,
        events: data[i].events,
        randomExits: data[i].randomExits,
        spawnRates: data[i].spawnRates,
        finite: data[i].finite,
        finiteTiles: data[i].finiteTiles,
        tileSizes: data[i].tileSizes,
        tileTypes: data[i].tileTypes,
        tileDefects: data[i].tileDefects,
        tileDefectRate: data[i].tileDefectRate,
        tileCount: data[i].tileCount,
        tilesGenerated: data[i].tilesGenerated,
        previousTileChance: data[i].previousTileChance,
        maxExits: data[i].maxExits,
        exitTypes: data[i].exitTypes,
        specialExits: data[i].specialExits,
        tags: data[i].tags
      })
    }
  }

  const getLevels = () => {
    const q = query(collection(db, 'Levels'), orderBy("level", "asc"));

    const unsub = onSnapshot(q, (querySnapshot) => {
      const queryData = [];
      querySnapshot.forEach((doc) => {
        queryData.push(doc.data());
      })
      setLevels(queryData);
    })

    return () => {
      unsub();
    }
  }

  return (
    localStorage.getItem("loggedIn") === 'false' ? <NotLoggedIn /> :
      <Box>
        <h1>Levels</h1>
        <Button onClick={addData}>Add data</Button>
        {levels.length === 0 ? 
          getLevels() 
        :
          <Box>
            <FormControl sx={{minWidth: 150}}>
              <InputLabel id="level">Select Level</InputLabel>
              <Select
                labelId='level'
                label={"Select Level"}
                onChange={e => {setCurrLevel(e.target.value); setGenerated(false)}}
                value={currLevel}
              >
                {levels.map((level, index) => {
                  return <MenuItem value={level.name} key={index}>{level.name}</MenuItem>
                })}
              </Select>
            </FormControl>
            {objects.length === 0 ? getFromDB('Objects') : ""}
            {mundane.length === 0 ? getFromDB('MundaneObjects') : ""}
            {weapons.length === 0 ? getFromDB('Weapons') : ""}
            {armor.length === 0 ? getFromDB('Armor') : ""}
            <GenerateTile />
          </Box>
        }
      </Box>
  )
}

/*
This list is for things that specifically appear on these levels and nowhere else.

Level 0:
  The Mirror (Object 6) spawns here.
  The Object Babel Balm (Object 25) spawns here.

Level 3:
  The Object Babel Balm (Object 25) spawns here.

Level 4:
  The Object Babel Balm (Object 25) spawns here.

Level 5:
  Casino Room sells Deuclidators (Object 4)
  Beverly Room holds The Phonograph (Object 18)

Level 9:
  The Object Pocket (Object 51) is on this level, specifically inside of houses.
  Umi's House may randomly spawn here. Umi may give out Umi's Sweets here.

Level 10:
  Scarecrows (Object 10) are exclusively on this level.

Level 25:
  3D Vision Glasses (Object 29) spawns here.

Level 31:
  Squirt Gun (Object 19) spawns here.

Level 33:
  Squirt Gun (Object 19) spawns here.

Level 40:
  3D Vision Glasses (Object 29) spawns here.
  Squirt Gun (Object 19) spawns here.
  BackROM (Object 47) spawns here.

Level 68:
  3D Vision Glasses (Object 29) spawns here.

Level 93:
  Liquid Silence (Object 17) comes from Scream Eaters (Entity 97) here.

Level 143:
  Turqoise Blue Dark Reparation Vials (Object 35) spawn here.

Level 158:
  Ruby Red Dark Reparation Vials (Object 35) spawn here.

Level 194:
  Agrugua Fruit (Object 85) spawns here.

Level 197:
  Navy Blue Dark Reparation Vials (Object 35) spawn here.

Level 205:
  Amethyst Purple Dark Reparation Vials (Object 35) spawn here.

Level 260:
  Amethyst Purple Dark Reparation Vials (Object 35) spawn here.

Level 283:
  Has an exit to Level 0 via wooden door that smells of mold.

Level 290:
  3D Vision Glasses (Object 29) spawns here.

Level 299:
  Amethyst Purple Dark Reparation Vials (Object 35) spawn here.

Level 365:
  Seer Tea (Object 365) main component comes only from an entity on this Level.

Level 906:
  Blanche's Gifts (Object 96) are given by Blanche (Entity 140) here.

Add People of Interest into the event section of the levels.
*/