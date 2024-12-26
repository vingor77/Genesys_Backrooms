import { Box, Button, Typography } from "@mui/material";
import { collection, doc, onSnapshot, query, setDoc } from "firebase/firestore";
import db from '../Components/firebase';
import { useState } from "react";
import NotLoggedIn from "../Components/notLoggedIn";
import { DataGrid } from '@mui/x-data-grid';

export default function Levels() {
  const [levels, setLevels] = useState([]);
  const [currLevel, setCurrLevel] = useState('Tutorial Level');

  const data = [
    {
      name: 'Tutorial Level',
      level: '0',
      sdClass: 1,
      time: 'x1'
      //More to come.
    },
    {
      name: 'Red Rooms',
      level: '0',
      sdClass: 3,
      time: 'x1'
    }
  ];

  const addData = () => {
    for(let i = 0; i < data.length; i++) {
      setDoc(doc(db, 'Levels', data[i].name), {
        name: data[i].name,
        level: data[i].level,
        sdClass: data[i].sdClass,
        time: data[i].time
      })
    }
  }

  const getLevels = () => {
    const q = query(collection(db, 'Levels'));

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

  const DisplayTable = () => {
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

  const DisplayLevel = () => {
    //This will be a sub file later on.
    for(let i = 0; i < levels.length; i++) {
      if(levels[i].name === currLevel) return <Typography variant="h4">{levels[i].name}</Typography>
    }
  }

  return (
    localStorage.getItem("loggedIn") === 'false' ? <NotLoggedIn /> :
      <Box>
        <Button onClick={addData}>Add data</Button>
        {levels.length > 0 ? 
          <Box>
            <DisplayTable />
            <DisplayLevel />
          </Box>
        :
          getLevels()
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