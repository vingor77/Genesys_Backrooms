import { Box, Button, Input, InputLabel, Menu, MenuItem, Select, Stack, TextField, Typography } from "@mui/material";
import NotLoggedIn from "../Components/notLoggedIn";
import { useState } from "react";
import { collection, doc, onSnapshot, orderBy, query, setDoc } from "firebase/firestore";
import Craft from "../Components/crafts";
import db from '../Components/firebase';

export default function Crafting() {
  const [crafts, setCrafts] = useState([]);
  const [difficulty, setDifficulty] = useState('None');
  const [name, setName] = useState('');

  const data = [{"name":"Worn Sack","components":"Mobile Vacuum Cleaner's Debris Container (Object 83)/A worn down bag of some kind","skills":"Crafting (General)","baseDifficulty":"5","baseAttempts":3,"hidden":"Yes","dynamicMaterial":"None","difficultyModifier":"None","attemptsModifier":"None","dynamicEffect":"None"},
    {"name":"Armorer's Tools","components":"Component 1/Component 2/Dynamic Component","skills":"Metalworking","baseDifficulty":"1","baseAttempts":3,"hidden":"Yes","dynamicMaterial":"None/Solid Silence/Piece 2","difficultyModifier":"0/+2/+4","attemptsModifier":"0/-1/-2","dynamicEffect":"Nothing/You gain an explosive boost to anything you craft with this tool. You automatically gain 1 success per beaker used in the creation of the Solid Silence used/Effect 3"},
    {"name":"Blacksmith Tools","components":"Component 1/Component 2/Dynamic Component","skills":"Metalworking","baseDifficulty":"Dynamic","baseAttempts":3,"hidden":"Yes","dynamicMaterial":"None/Solid Silence/Piece 2","difficultyModifier":"0/+2/+4","attemptsModifier":"0/-1/-2","dynamicEffect":"Nothing/You gain an explosive boost to anything you craft with this tool. You automatically gain 1 success per beaker used in the creation of the Solid Silence used/Effect 3"},
    {"name":"Goldsmith Tools","components":"Component 1/Component 2/Dynamic Component","skills":"Metalworking","baseDifficulty":"Dynamic","baseAttempts":3,"hidden":"Yes","dynamicMaterial":"None/Solid Silence/Piece 2","difficultyModifier":"0/+2/+4","attemptsModifier":"0/-1/-2","dynamicEffect":"Nothing/You gain an explosive boost to anything you craft with this tool. You automatically gain 1 success per beaker used in the creation of the Solid Silence used/Effect 3"},
    {"name":"Leatherworker's Tools","components":"Component 1/Component 2/Dynamic Component","skills":"Leatherworking","baseDifficulty":"Dynamic","baseAttempts":3,"hidden":"Yes","dynamicMaterial":"None/Solid Silence/Piece 2","difficultyModifier":"0/+2/+4","attemptsModifier":"0/-1/-2","dynamicEffect":"Nothing/You gain an explosive boost to anything you craft with this tool. You automatically gain 1 success per beaker used in the creation of the Solid Silence used/Effect 3"},
    {"name":"Weaver's Tools","components":"Component 1/Component 2/Dynamic Component","skills":"Leatherworking","baseDifficulty":"Dynamic","baseAttempts":3,"hidden":"Yes","dynamicMaterial":"None/Solid Silence/Piece 2","difficultyModifier":"0/+2/+4","attemptsModifier":"0/-1/-2","dynamicEffect":"Nothing/You gain an explosive boost to anything you craft with this tool. You automatically gain 1 success per beaker used in the creation of the Solid Silence used/Effect 3"},
    {"name":"Alchemist Tools","components":"Component 1/Component 2/Dynamic Component","skills":"Metalworking","baseDifficulty":"Dynamic","baseAttempts":3,"hidden":"Yes","dynamicMaterial":"None/Solid Silence/Piece 2","difficultyModifier":"0/+2/+4","attemptsModifier":"0/-1/-2","dynamicEffect":"Nothing/You gain an explosive boost to anything you craft with this tool. You automatically gain 1 success per beaker used in the creation of the Solid Silence used/Effect 3"},
    {"name":"Carpenter Tools","components":"Component 1/Component 2/Dynamic Component","skills":"Crafting (General)","baseDifficulty":"Dynamic","baseAttempts":3,"hidden":"Yes","dynamicMaterial":"None/Solid Silence/Piece 2","difficultyModifier":"0/+2/+4","attemptsModifier":"0/-1/-2","dynamicEffect":"Nothing/You gain an explosive boost to anything you craft with this tool. You automatically gain 1 success per beaker used in the creation of the Solid Silence used/Effect 3"},
    {"name":"Culinarian Tools","components":"Component 1/Component 2/Dynamic Component","skills":"Metalworking/Leatherworking","baseDifficulty":"Dynamic","baseAttempts":3,"hidden":"Yes","dynamicMaterial":"None/Solid Silence/Piece 2","difficultyModifier":"0/+2/+4","attemptsModifier":"0/-1/-2","dynamicEffect":"Nothing/You gain an explosive boost to anything you craft with this tool. You automatically gain 1 success per beaker used in the creation of the Solid Silence used/Effect 3"},
    {"name":"Miner tools","components":"Component 1/Component 2/Dynamic Component","skills":"Metalworking","baseDifficulty":"Dynamic","baseAttempts":3,"hidden":"Yes","dynamicMaterial":"None/Solid Silence/Piece 2","difficultyModifier":"0/+2/+4","attemptsModifier":"0/-1/-2","dynamicEffect":"Nothing/You gain an explosive boost to anything you craft with this tool. You automatically gain 1 success per beaker used in the creation of the Solid Silence used/Effect 3"},
    {"name":"Botanist tools","components":"Component 1/Component 2/Dynamic Component","skills":"Metalworking","baseDifficulty":"Dynamic","baseAttempts":3,"hidden":"Yes","dynamicMaterial":"None/Solid Silence/Piece 2","difficultyModifier":"0/+2/+4","attemptsModifier":"0/-1/-2","dynamicEffect":"Nothing/You gain an explosive boost to anything you craft with this tool. You automatically gain 1 success per beaker used in the creation of the Solid Silence used/Effect 3"},
    {"name":"Ring of Retries","components":"Component 1/Component 2/Component 3","skills":"Metalworking","baseDifficulty":"5","baseAttempts":2,"hidden":"Yes","dynamicMaterial":"None","difficultyModifier":"None","attemptsModifier":"None","dynamicEffect":"None"},
    {"name":"Ring of Teleportation","components":"Component 1/Component 2/Component 3","skills":"Metalworking","baseDifficulty":"5","baseAttempts":1,"hidden":"Yes","dynamicMaterial":"None","difficultyModifier":"None","attemptsModifier":"None","dynamicEffect":"None"},
    {"name":"Helm of Invulnerability","components":"Component 1/Component 2/Component 3","skills":"Metalworking","baseDifficulty":"3","baseAttempts":3,"hidden":"Yes","dynamicMaterial":"None","difficultyModifier":"None","attemptsModifier":"None","dynamicEffect":"None"}]

  const addData = () => {
    for(let i = 0; i < data.length; i++) {
      setDoc(doc(db, 'Crafts', data[i].name), {
        name: data[i].name,
        components: data[i].components,
        skills: data[i].skills,
        baseDifficulty: data[i].baseDifficulty,
        baseAttempts: data[i].baseAttempts,
        hidden: data[i].hidden,
        dynamicMaterial: data[i].dynamicMaterial,
        difficultyModifier: data[i].difficultyModifier,
        attemptsModifier: data[i].attemptsModifier,
        dynamicEffect: data[i].dynamicEffect
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
            (item.baseDifficulty === difficulty || difficulty === 'None') &&
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
                <InputLabel id='difficulty'>Select Base Difficulty</InputLabel>
                <Select
                  id='difficulty'
                  onChange={e => setDifficulty(e.target.value)}
                  value={difficulty}
                  sx={{width: '150px'}}
                >
                  <MenuItem value='None'>Any</MenuItem>
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