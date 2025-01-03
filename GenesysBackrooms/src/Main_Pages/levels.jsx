import { Box, Button, Typography } from "@mui/material";
import { collection, doc, onSnapshot, query, setDoc } from "firebase/firestore";
import db from '../Components/firebase';
import { useMemo, useState } from "react";
import NotLoggedIn from "../Components/notLoggedIn";
import { DataGrid } from '@mui/x-data-grid';
import LevelItem from "../Components/levelItem";

export default function Levels() {
  const [levels, setLevels] = useState([]);
  const [entities, setEntites] = useState([]);
  const [objects, setObjects] = useState([]);
  const [mundane, setMundane] = useState([]);
  const [armor, setArmor] = useState([]);
  const [weapons, setWeapons] = useState([]);
  const [interest, setInterest] = useState([]);
  const [phenomena, setPhenomena] = useState([]);
  const [currLevel, setCurrLevel] = useState('Tutorial Level');

  const data = [{"name":"Tutorial Level","description":"Level 0 is a non-linear space, resembling the back rooms of a retail outlet. Similar to its previous form, all rooms in Level 0 appear uniform and share superficial features such as a yellowish wallpaper, damp carpet, and inconsistently placed fluorescent lighting. However, no two rooms within the level are identical.","level":0,"sdClass":1,"time":"x1","lightLevels":"0/8","chanceOfCorrosion":10,"corrosiveAtmosphere":5,"heat":"4/8","effectCount":1,"effects":"Light Mist/Medium Mist/Heavy Mist/Light Fog/Medium Fog/Heavy Fog/Hallucinations of other people/Scratching sounds/Intense humming/Voices of people in a non-coherent tongue/Insect sounds","roomSize":"20!100/20!100","roomHeight":8,"exitCount":5,"exitTypes":"Stairs going up/Stairs going down/A small hole in the wall/An open vent/A locked door/An unlocked door/A slide/A massive hole in the floor","exitFromLevelChance":5,"exitFromLevel":"Zenith Station/Remodeled Mess/Manila Room/Red Rooms/Habitable Zone","defectCount":2,"defects":"A lone dark oak chair/A torn bed/An L shaped couch cemented to the floor/A colored carpet patch/A broken helmet/1d6 small bullets/Neat papers/Scattered papers/A tinkerer hammer/An empty toolbox/A severed left arm/A mutilated human corpse/A large splot of dry blood","tags":"Indoors/Dark/Light/Damp/Daytime","spawnChances":"50/25/0/0/5","finite":"No","roomCount":3,"useAtmosphere":"Yes/Yes/No","sizeOfRooms":"50!40/50!30/50!50","exitsPerRoom":"5/2/3","exitTypesPerRoom":"Door!Door!Vent!Vent!Stairs going up/Door!Locked door/Locked door!Locked door!Door","lightLevelPerRoom":"4/7/9","heatPerRoom":"4/4/4","effectPerRoom":"Effect 1!Effect 4/Effect 2/Effect 3","spawnPerRoom":"Object!Phenomena!Window/Entity/Entity","defectsPerRoom":"Defect 1/Defect 2/Defect 3!Defect 4"}]

  const addData = () => {
    for(let i = 0; i < data.length; i++) {
      setDoc(doc(db, 'Levels', data[i].name), {
        name: data[i].name,
        description: data[i].description,
        level: data[i].level,
        sdClass: data[i].sdClass,
        time: data[i].time,
  
        // Atmosphere and effects
        lightLevels: data[i].lightLevels,
        chanceOfCorrosion: data[i].chanceOfCorrosion,
        corrosiveAtmosphere: data[i].corrosiveAtmosphere,
        heat: data[i].heat,
        effectCount: data[i].effectCount,
        effects: data[i].effects,
  
        // Physical room properties
        roomSize: data[i].roomSize,
        roomHeight: data[i].roomHeight,
        exitCount: data[i].exitCount,
        exitTypes: data[i].exitTypes,
        exitFromLevelChance: data[i].exitFromLevelChance,
        exitFromLevel: data[i].exitFromLevel,
        defectCount: data[i].defectCount,
        defects: data[i].defects,
  
        // Metadata
        tags: data[i].tags,
        spawnChances: data[i].spawnChances,
  
        // Finite level properties
        finite: data[i].finite,
        roomCount: data[i].roomCount,
        useAtmopshere: data[i].useAtmosphere,
        sizeOfRooms: data[i].sizeOfRooms,
        exitsPerRoom: data[i].exitsPerRoom,
        exitTypesPerRoom: data[i].exitTypesPerRoom,
        lightLevelPerRoom: data[i].lightLevelPerRoom,
        heatPerRoom: data[i].heatPerRoom,
        effectPerRoom: data[i].effectPerRoom,
        spawnPerRoom: data[i].spawnPerRoom,
        defectsPerRoom: data[i].defectsPerRoom
      })
    }
  }

  const getFromDB = (type) => {
    const q = query(collection(db, type));

    const unsub = onSnapshot(q, (querySnapshot) => {
      const queryData = [];
      querySnapshot.forEach((doc) => {
        queryData.push(doc.data());
      })
      if(type === 'Levels') setLevels(queryData);
      if(type === 'Entities') setEntites(queryData);
      if(type === 'PeopleOfInterest') setInterest(queryData);
      if(type === 'Phenomena') setPhenomena(queryData);
      if(type === 'Objects') setObjects(queryData);
      if(type === 'Armor') setArmor(queryData);
      if(type === 'Weapons') setWeapons(queryData);
      if(type === 'MundaneObjects') setMundane(queryData);
    })

    return () => {
      unsub();
    }
  }

  const displayTable = () => {
    const columns = [
      {
        field: 'name',
        headerName: 'Level Name',
        flex: 1,
        editable: false,
        renderCell: (params) => <Button onClick={() => setCurrLevel(params.row.name)}>{params.row.name}</Button>
      },
      { 
        field: 'level',
        headerName: 'Level',
        flex: 1,
      },
      {
        field: 'sdclass',
        headerName: 'Survival Difficulty Class',
        flex: 1,
        editable: false,
      },
      {
        field: 'time',
        headerName: 'Time Flow',
        flex: 1,
        editable: false,
      }
    ];

    const rows = [];

    for(let i = 0; i < levels.length; i++) {
      rows.push({
        id: i,
        name: levels[i].name,
        level: levels[i].level,
        sdclass: levels[i].sdClass,
        time: levels[i].time
      })
    }

    return (
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5]}
        disableRowSelectionOnClick
        sx={{minWidth: '50%'}}
      />
    )
  }

  const table = useMemo(() => displayTable(), [entities]);

  return (
    localStorage.getItem("loggedIn") === 'false' ? <NotLoggedIn /> :
      <Box>
        <Button onClick={addData}>Add data</Button>
        {levels.length > 0 ? 
          <Box>
            {table}
            {levels.map((level) => {
              if(level.name === currLevel) {
                return <LevelItem data={{entities, objects, mundane, armor, weapons, interest, phenomena, level}}/>
              }
            })}
          </Box>
        :
          <Box>
            {getFromDB('Levels')}
            {getFromDB('Entities')}
            {getFromDB('PeopleOfInterest')}
            {getFromDB('Phenomena')}
            {getFromDB('Objects')}
            {getFromDB('Armor')}
            {getFromDB('Weapons')}
            {getFromDB('MundaneObjects')}
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