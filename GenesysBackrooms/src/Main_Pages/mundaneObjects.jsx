import { Box, Button, FormControl, Input, InputLabel, MenuItem, Select, Stack, Toolbar, Typography } from "@mui/material"
import { collection, doc, onSnapshot, orderBy, query, setDoc } from "firebase/firestore"
import db from '../Components/firebase';
import { useState } from "react";
import MundaneItem from "../Components/mundaneItem";
import NotLoggedIn from "../Components/notLoggedIn";

export default function MundaneObjects() {
  const [mundaneObjects, setMundaneObjects] = useState([]);
  const [name, setName] = useState('');
  const [rarity, setRarity] = useState('-1');

  const data = [{"name":"AA Battery","description":"This battery has 2,500 mAh of power to spare.","price":"2 for 4","rarity":5,"spawnLocations":"All","usedBy":"Flashlight","hidden":"Yes"},
    {"name":"C Battery","description":"This battery has 7,800 mAh of power to spare.","price":"4 for 4","rarity":6,"spawnLocations":"All","usedBy":"None","hidden":"Yes"},
    {"name":"D Battery","description":"This battery has 10,000 mAh of power to spare.","price":"5 for 4","rarity":7,"spawnLocations":"All","usedBy":"None","hidden":"Yes"},
    {"name":"AAA Battery","description":"This battery has 750 mAh of power to spare.","price":"1 for 4","rarity":2,"spawnLocations":"All","usedBy":"Flashlight","hidden":"Yes"},
    {"name":"Specialty Fuel","description":"A dark viscous liquid. It smells heavily of gasoline.","price":"1 for 1 liter","rarity":1,"spawnLocations":"All","usedBy":"Hyrum Lanters/Deuclidators","hidden":"Yes"},
    {"name":"Dumb Gum","description":"A hot pink piece of taffy-like gum. The surface is reflective, like glass.","price":"1 for 10","rarity":4,"spawnLocations":"All","usedBy":"None","hidden":"Yes"},
    {"name":"Specialty Beaker","description":"A gray-tinted beaker with no markings on the sides.","price":"1 for 5","rarity":1,"spawnLocations":"All","usedBy":"Liquid Silence/Liquid Pain","hidden":"Yes"},
    {"name":"AAAA Battery","description":"This battery has 550 mAh of power to spare.","price":"1 for 4","rarity":1,"spawnLocations":"All","usedBy":"Flashlight","hidden":"Yes"},
    {"name":"9v Battery","description":"This battery has 1,000 mAh of power to spare.","price":"2 for 4","rarity":3,"spawnLocations":"All","usedBy":"None","hidden":"Yes"},
    {"name":"A23 Battery","description":"This battery has 55 mAh of power to spare.","price":"1 for 4","rarity":0,"spawnLocations":"All","usedBy":"Flashlight","hidden":"Yes"},
    {"name":"N Battery","description":"This battery has 1,000 mAh of power to spare.","price":"1 for 4","rarity":4,"spawnLocations":"All","usedBy":"None","hidden":"Yes"},
    {"name":"Flashlight","description":"A hand-held device that lights up an area. The battery type, power, and range are variable and decided when found. This device can use AA, AAA, AAAA, and A23 batteries.","price":"3 for 1","rarity":2,"spawnLocations":"All","usedBy":"None","hidden":"Yes"}]

  const addData = () => {
    for(let i = 0; i < data.length; i++) {
      setDoc(doc(db, 'MundaneObjects', data[i].name), {
        name: data[i].name,
        description: data[i].description,
        price: data[i].price,
        rarity: data[i].rarity,
        spawnLocations: data[i].spawnLocations,
        usedBy: data[i].usedBy,
        hidden: data[i].hidden
      })
    }
  }

  const getFromDB = () => {
    const q = query(collection(db, 'MundaneObjects'), orderBy("name", "asc"));

    const unsub = onSnapshot(q, (querySnapshot) => {
      const queryData = [];
      querySnapshot.forEach((doc) => {
        queryData.push(doc.data());
      })
      setMundaneObjects(queryData);
    })

    return () => {
      unsub();
    }
  }

  const DisplayItems = () => {
    let empty = true;

    return (
      <Stack direction='row' flexWrap='wrap' gap={1}>
        {mundaneObjects.map((item) => {
          if(
            (item.hidden === 'No' || localStorage.getItem('loggedIn').toUpperCase() === 'ADMIN') &&
            (item.rarity === parseInt(rarity) || rarity === '-1') &&
            (item.name.toUpperCase().includes(name.toUpperCase()) || name === '')
          ) {
            empty = false;
            return <MundaneItem currMundane={item}/>
          }
        })}
        {empty ? <Typography>There are no objects that match your criteria.</Typography> : ""}
      </Stack>
    )
  }

  return (
    localStorage.getItem("loggedIn") === 'false' ? <NotLoggedIn /> :
      <Box>
        <Button onClick={addData}>Add</Button>
        {mundaneObjects.length > 0 ?
          <Box>
            <Stack direction={{xs: 'column', md: 'row'}} spacing={2} flexWrap='wrap' gap={1} paddingBottom={2}>
              <Box>
                <Input value={name} onChange={e => setName(e.target.value)} placeholder='Enter Name'></Input>
              </Box>
              <FormControl sx={{minWidth: 150}}>
                <InputLabel id="rarity">Select Rarity</InputLabel>
                <Select
                  labelId='rarity'
                  label={"Select Rarity"}
                  onChange={e => setRarity(e.target.value)}
                  value={rarity}
                >
                  <MenuItem value='-1'>Any</MenuItem>
                  <MenuItem value='0'>0</MenuItem>
                  <MenuItem value='1'>1</MenuItem>
                  <MenuItem value='2'>2</MenuItem>
                  <MenuItem value='3'>3</MenuItem>
                  <MenuItem value='4'>4</MenuItem>
                  <MenuItem value='5'>5</MenuItem>
                  <MenuItem value='6'>6</MenuItem>
                  <MenuItem value='7'>7</MenuItem>
                  <MenuItem value='8'>8</MenuItem>
                  <MenuItem value='9'>9</MenuItem>
                  <MenuItem value='10'>10</MenuItem>
                </Select>
              </FormControl>
            </Stack>
            <DisplayItems />
          </Box>
        :
          getFromDB()
        }
      </Box>
  )
}
