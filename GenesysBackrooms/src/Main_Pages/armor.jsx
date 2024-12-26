import { Box, Button, FormControl, Input, InputLabel, MenuItem, Select, Stack, Toolbar, Typography } from "@mui/material";
import { collection, doc, onSnapshot, orderBy, query, setDoc } from "firebase/firestore";
import db from '../Components/firebase';
import { useState } from "react";
import ArmorItem from "../Components/armorItem";
import NotLoggedIn from "../Components/notLoggedIn";

export default function Armor() {
  const [armor, setArmor] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('-1');
  const [rarity, setRarity] = useState('-1');

  const data = [{"name":"Chainmail","defense":"0/0","soak":2,"encumbrance":3,"price":5,"rarity":4,"specials":"None","setBonus":"None","spawnLocations":"All","durability":3,"description":"A basic set of chainmail armor","anomalousEffect":"None","equippedTo":"Chest","hidden":"Yes"},
    {"name":"Plate Armor","defense":"1/1","soak":2,"encumbrance":4,"price":7,"rarity":6,"specials":"None","setBonus":"None","spawnLocations":"All","durability":3,"description":"A basic set of plate armor","anomalousEffect":"None","equippedTo":"Chest","hidden":"Yes"},
    {"name":"Leather Armor","defense":"0/0","soak":1,"encumbrance":2,"price":4,"rarity":3,"specials":"None","setBonus":"None","spawnLocations":"All","durability":3,"description":"A basic set of leather armor","anomalousEffect":"None","equippedTo":"Chest","hidden":"Yes"},
    {"name":"Tesla Coil","defense":"0/3","soak":0,"encumbrance":2,"price":9,"rarity":8,"specials":"None","setBonus":"None","spawnLocations":"All","durability":2,"description":"A small piece of blue metal in a square surrounded by black wires","anomalousEffect":"None","equippedTo":"Chest","hidden":"Yes"},
    {"name":"Flak Vest","defense":"0/0","soak":2,"encumbrance":3,"price":6,"rarity":5,"specials":"None","setBonus":"None","spawnLocations":"All","durability":3,"description":"A basic flak vest","anomalousEffect":"None","equippedTo":"Chest","hidden":"Yes"},
    {"name":"Riot Armor","defense":"2/2","soak":1,"encumbrance":5,"price":7,"rarity":6,"specials":"None","setBonus":"None","spawnLocations":"All","durability":3,"description":"A basic set of armor used typically for riots","anomalousEffect":"None","equippedTo":"Chest","hidden":"Yes"},
    {"name":"Personal Force Field","defense":"3/3","soak":0,"encumbrance":1,"price":9,"rarity":8,"specials":"None","setBonus":"None","spawnLocations":"All","durability":3,"description":"A small orange disk","anomalousEffect":"None","equippedTo":"Chest","hidden":"Yes"},
    {"name":"Red Knight Gloves","defense":"","soak":null,"encumbrance":null,"price":null,"rarity":null,"specials":"","setBonus":"","spawnLocations":"","durability":null,"description":"","anomalousEffect":"","equippedTo":"Arms","hidden":"Yes"},
    {"name":"Red Knight Greaves","defense":"","soak":null,"encumbrance":null,"price":null,"rarity":null,"specials":"","setBonus":"","spawnLocations":"","durability":null,"description":"","anomalousEffect":"","equippedTo":"Feet","hidden":"Yes"},
    {"name":"Red Knight Helmet","defense":"","soak":null,"encumbrance":null,"price":null,"rarity":null,"specials":"","setBonus":"","spawnLocations":"","durability":null,"description":"","anomalousEffect":"","equippedTo":"Head","hidden":"Yes"},
    {"name":"Red Knight Plate","defense":"","soak":null,"encumbrance":null,"price":null,"rarity":null,"specials":"","setBonus":"","spawnLocations":"","durability":null,"description":"","anomalousEffect":"","equippedTo":"Chest","hidden":"Yes"},
    {"name":"Red Knight Shield","defense":"","soak":null,"encumbrance":null,"price":null,"rarity":null,"specials":"","setBonus":"","spawnLocations":"","durability":null,"description":"","anomalousEffect":"","equippedTo":"None","hidden":"Yes"},
    {"name":"Shadow Hide","defense":"1/1","soak":1,"encumbrance":2,"price":7,"rarity":6,"specials":"Anomalous","setBonus":"None","spawnLocations":"Dark","durability":3,"description":"A pure black set of hide armor.","anomalousEffect":"While wearing this armor, you gain two boost dice to all stealth checks. In addition, while successfully stealthed you may teleport any two range bands regardless of distance.","equippedTo":"Chest","hidden":"Yes"},
    {"name":"Ring of Ridiculous Speed","defense":"0/0","soak":0,"encumbrance":0,"price":8,"rarity":7,"specials":"Anomalous","setBonus":"None","spawnLocations":"All","durability":3,"description":"A small golden ring with a lightning bolt engraved on the side.","anomalousEffect":"While wearing this ring, you may take an extra free maneuver each turn. This extra maneuver does not count towards your manuevers per turn.","equippedTo":"Ring","hidden":"Yes"}]

  const addData = () => {
    for(let i = 0; i < data.length; i++) {
      setDoc(doc(db, 'Armor', data[i].name), {
        name: data[i].name,
        defense: data[i].defense,
        soak: data[i].soak,
        encumbrance: data[i].encumbrance,
        price: data[i].price,
        rarity: data[i].rarity,
        specials: data[i].specials,
        setBonus: data[i].setBonus,
        spawnLocations: data[i].spawnLocations,
        durability: data[i].durability,
        description: data[i].description,
        anomalousEffect: data[i].anomalousEffect,
        equippedTo: data[i].equippedTo,
        hidden: data[i].hidden
      })
    }
  }

  const getFromDB = () => {
    const q = query(collection(db, 'Armor'), orderBy("name", "asc"));

    const unsub = onSnapshot(q, (querySnapshot) => {
      const queryData = [];
      querySnapshot.forEach((doc) => {
        queryData.push(doc.data());
      })
      setArmor(queryData);
    })

    return () => {
      unsub();
    }
  }

  const DisplayItems = () => {
    let empty = true;

    return (
      <Stack direction='row' flexWrap='wrap' gap={1}>
        {armor.map((item) => {
          if(
            (item.hidden === 'No' || localStorage.getItem('loggedIn').toUpperCase() === 'ADMIN') &&
            (item.price === parseInt(price) || (item.price >= 10 && parseInt(price) === 10) || price === '-1') &&
            (item.rarity === parseInt(rarity) || rarity === '-1') &&
            (item.name.toUpperCase().includes(name.toUpperCase()) || name === '')
          ) {
            empty = false;
            return <ArmorItem currArmor={item}/>
          }
        })}
        {empty ? <Typography>There is no armor that match your criteria.</Typography> : ""}
      </Stack>
    )
  }

  return (
    localStorage.getItem("loggedIn") === 'false' ? <NotLoggedIn /> :
      <Box>
      <Button onClick={addData}>Add</Button>
        {armor.length > 0 ?
          <Box>
            <Stack direction={{xs: 'column', md: 'row'}} spacing={2} flexWrap='wrap' gap={1} paddingBottom={2}>
              <Box>
                <Input value={name} onChange={e => setName(e.target.value)} placeholder='Enter Name'></Input>
              </Box>
              <FormControl sx={{minWidth: 150}}>
                <InputLabel id="price">Select Price</InputLabel>
                <Select
                  labelId='price'
                  label={"Select Price"}
                  onChange={e => setPrice(e.target.value)}
                  value={price}
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
                  <MenuItem value='10'>10+</MenuItem>
                </Select>
              </FormControl>
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