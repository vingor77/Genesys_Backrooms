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

  const data = [{"name":"Worn Sack","components":"Mobile Vacuum Cleaner's Debris Container (Object 83)/A worn down bag of some kind","skills":"Crafting (General)","difficulty":"5","attempts":1,"description":"A sack with dirt and grime on it. This bag can store an infinite amount, so long as the item fits within the openening. Anything within the bag no longer factors into your total encumbrance.","hidden":"Yes","dynamicMaterial":"None"},
    {"name":"Armorer's Tools","components":"Component 1/Component 2/Mystery Component","skills":"Metalworking","difficulty":"Varies","attempts":3,"description":"Tools used to craft armor and other metal objects that aren't weapons or jewelry. Each tool has an added effect based on the material used to craft it as listed below.","hidden":"Yes","dynamicMaterial":"Solid Silence!You gain an explosive boost to anything you craft with this tool. You automatically gain 1 success per beaker used in the creation of the Solid Silence used.!5"},
    {"name":"Blacksmith Tools","components":"Component 1/Component 2/Mystery Component","skills":"Metalworking","difficulty":"Varies","attempts":3,"description":"Tools used to craft weapons. Each tool has an added effect based on the material used to craft it as listed below.","hidden":"Yes","dynamicMaterial":"Solid Silence!You gain an explosive boost to anything you craft with this tool. You automatically gain 1 success per beaker used in the creation of the Solid Silence used.!5"},
    {"name":"Goldsmith Tools","components":"Component 1/Component 2/Mystery Component","skills":"Metalworking","difficulty":"Varies","attempts":3,"description":"Tools used to craft jewelry and anything with gems. Each tool has an added effect based on the material used to craft it as listed below.","hidden":"Yes","dynamicMaterial":"Solid Silence!You gain an explosive boost to anything you craft with this tool. You automatically gain 1 success per beaker used in the creation of the Solid Silence used.!5"},
    {"name":"Leatherworker's Tools","components":"Component 1/Component 2/Mystery Component","skills":"Leatherworking","difficulty":"Varies","attempts":3,"description":"Tools used to craft anything to do with leather. Each tool has an added effect based on the material used to craft it as listed below.","hidden":"Yes","dynamicMaterial":"Solid Silence!You gain an explosive boost to anything you craft with this tool. You automatically gain 1 success per beaker used in the creation of the Solid Silence used.!5"},
    {"name":"Weaver's Tools","components":"Component 1/Component 2/Mystery Component","skills":"Leatherworking","difficulty":"Varies","attempts":3,"description":"Tools used to craft anything to do with cloth or fibers. Each tool has an added effect based on the material used to craft it as listed below.","hidden":"Yes","dynamicMaterial":"Solid Silence!You gain an explosive boost to anything you craft with this tool. You automatically gain 1 success per beaker used in the creation of the Solid Silence used.!5"},
    {"name":"Alchemist Tools","components":"Component 1/Component 2/Mystery Component","skills":"Metalworking","difficulty":"Varies","attempts":3,"description":"Tools used to craft concoctions and potions. Each tool has an added effect based on the material used to craft it as listed below.","hidden":"Yes","dynamicMaterial":"Solid Silence!You gain an explosive boost to anything you craft with this tool. You automatically gain 1 success per beaker used in the creation of the Solid Silence used.!5"},
    {"name":"Carpenter Tools","components":"Component 1/Component 2/Mystery Component","skills":"Crafting (General)","difficulty":"Varies","attempts":3,"description":"Tools used to craft anything involving wood as the primary substance. Each tool has an added effect based on the material used to craft it as listed below.","hidden":"Yes","dynamicMaterial":"Solid Silence!You gain an explosive boost to anything you craft with this tool. You automatically gain 1 success per beaker used in the creation of the Solid Silence used.!5"},
    {"name":"Culinarian Tools","components":"Component 1/Component 2/Mystery Component","skills":"Metalworking/Leatherworking","difficulty":"Varies","attempts":3,"description":"Tools used to cook. Each tool has an added effect based on the material used to craft it as listed below.","hidden":"Yes","dynamicMaterial":"Solid Silence!You gain an explosive boost to anything you craft with this tool. You automatically gain 1 success per beaker used in the creation of the Solid Silence used.!5"},
    {"name":"Miner tools","components":"Component 1/Component 2/Mystery Component","skills":"Metalworking","difficulty":"Varies","attempts":3,"description":"Tools used to gather rock, ore, and water deposits. Each tool has an added effect based on the material used to craft it as listed below.","hidden":"Yes","dynamicMaterial":"Solid Silence!You gain an explosive boost to anything you craft with this tool. You automatically gain 1 success per beaker used in the creation of the Solid Silence used.!5"},
    {"name":"Botanist tools","components":"Component 1/Component 2/Mystery Component","skills":"Metalworking","difficulty":"Varies","attempts":3,"description":"Tools used to gather natural resources. Each tool has an added effect based on the material used to craft it as listed below.","hidden":"Yes","dynamicMaterial":"Solid Silence!You gain an explosive boost to anything you craft with this tool. You automatically gain 1 success per beaker used in the creation of the Solid Silence used.!5"}]

  const addData = () => {
    for(let i = 0; i < data.length; i++) {
      setDoc(doc(db, 'Crafts', data[i].name), {
        name: data[i].name,
        components: data[i].components,
        skills: data[i].skills,
        difficulty: data[i].difficulty,
        attempts: data[i].attempts,
        description: data[i].description,
        hidden: data[i].hidden,
        dynamicMaterial: data[i].dynamicMaterial
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
            (item.difficulty === difficulty || difficulty === 'None') &&
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
                  <MenuItem value='None'>Any</MenuItem>
                  <MenuItem value='1'>1</MenuItem>
                  <MenuItem value='2'>2</MenuItem>
                  <MenuItem value='3'>3</MenuItem>
                  <MenuItem value='4'>4</MenuItem>
                  <MenuItem value='5'>5</MenuItem>
                  <MenuItem value='Varies'>Varied</MenuItem>
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