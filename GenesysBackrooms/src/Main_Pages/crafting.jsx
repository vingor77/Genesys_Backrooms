import { Box, Button, Input, InputLabel, MenuItem, Select, Stack, TextField, Typography } from "@mui/material";
import NotLoggedIn from "../Components/notLoggedIn";
import { useState } from "react";
import { collection, doc, onSnapshot, orderBy, query, setDoc } from "firebase/firestore";
import Craft from "../Components/crafts";
import db from '../Components/firebase';

export default function Crafting() {
  const [crafts, setCrafts] = useState([]);
  const [difficulty, setDifficulty] = useState(-1);
  const [tier, setTier] = useState(-1);
  const [name, setName] = useState('');

  const data = [{"name":"Worn Sack","components":"Mobile Vacuum Cleaner's Debris Container (Object 83)/A worn down bag of some kind","skills":"Alchemy/Divine","difficulty":5,"tier":0,"attempts":1,"description":"A sack with dirt and grime on it. This bag can store an infinite amount, so long as the item fits within the openening. Anything within the bag no longer factors into your total encumbrance.",'hidden':'Yes'}]

  const addData = () => {
    for(let i = 0; i < data.length; i++) {
      setDoc(doc(db, 'Crafts', data[i].name), {
        name: data[i].name,
        components: data[i].components,
        skills: data[i].skills,
        difficulty: data[i].difficulty,
        tier: data[i].tier,
        attempts: data[i].attempts,
        description: data[i].description,
        hidden: data[i].hidden
      })
    }
  }

  const getFromDB = () => {
    const q = query(collection(db, 'Crafts'), orderBy("name", "asc"));

    const unsub = onSnapshot(q, (querySnapshot) => {
      const queryData = [];
      querySnapshot.forEach((doc) => {
        queryData.push(doc.data());
      })
      setCrafts(queryData);
    })

    return () => {
      unsub();
    }
  }

  const DisplayItems = () => {
    let empty = true;

    return (
      <Stack direction='row' flexWrap='wrap' gap={1}>
        {crafts.map((item) => {
          if(
            (item.tier === parseInt(tier) || parseInt(tier) === -1) &&
            (item.difficulty === parseInt(difficulty) || parseInt(difficulty) === -1) &&
            (item.name.toUpperCase().includes(name.toUpperCase()) || name === '') &&
            (item.hidden === 'No' || localStorage.getItem('loggedIn').toUpperCase() === 'ADMIN')
          ) {
            empty = false;
            return <Craft currCraft={item}/>
          }
        })}
        {empty ? <Typography>There are no crafts that match your criteria.</Typography> : ""}
      </Stack>
    )
  }

  return (
    localStorage.getItem("loggedIn") === 'false' ? <NotLoggedIn /> :
      <Box>
      <Button onClick={addData}>Add</Button>
        {crafts.length > 0 ?
          <Box>
            <Stack direction={{sm: 'column', md: 'row'}} spacing={2}>
              <Box>
                <Input value={name} onChange={e => setName(e.target.value)} placeholder='Enter Name'></Input>
              </Box>
              <Box>
                <InputLabel id='difficulty'>Select Difficulty</InputLabel>
                <Select
                  id='difficulty'
                  onChange={e => setDifficulty(e.target.value)}
                  value={difficulty}
                  sx={{width: '150px'}}
                >
                  <MenuItem value='-1'>All</MenuItem>
                  <MenuItem value='0'>0</MenuItem>
                  <MenuItem value='1'>1</MenuItem>
                  <MenuItem value='2'>2</MenuItem>
                  <MenuItem value='3'>3</MenuItem>
                  <MenuItem value='4'>4</MenuItem>
                  <MenuItem value='5'>5</MenuItem>
                </Select>
              </Box>
              <Box>
                <InputLabel id='tier'>Select Tier</InputLabel>
                <Select
                  id='tier'
                  onChange={e => setTier(e.target.value)}
                  value={tier}
                  sx={{width: '150px'}}
                >
                  <MenuItem value='-1'>Any</MenuItem>
                  <MenuItem value='0'>0</MenuItem>
                  <MenuItem value='1'>1</MenuItem>
                  <MenuItem value='2'>2</MenuItem>
                  <MenuItem value='3'>3</MenuItem>
                  <MenuItem value='4'>4</MenuItem>
                  <MenuItem value='5'>5</MenuItem>
                </Select>
              </Box>
            </Stack>
            <br />
            <DisplayItems />
          </Box>
        :
          getFromDB()
        }
      </Box>
  )
}

/*
Worn Sack:
  Made from the Object Mobile Vacuum Cleaner's (Object 83) debris container and a well used bag of any kind.
*/