import { Box, Button, FormControl, Input, InputLabel, MenuItem, Select, Stack, Toolbar, Typography } from "@mui/material";
import { collection, doc, onSnapshot, orderBy, query, setDoc } from "firebase/firestore";
import db from '../Components/firebase';
import { useState } from "react";
import WeaponItem from "../Components/weaponItem";
import NotLoggedIn from "../Components/notLoggedIn";

export default function Weapons() {
  const [weapons, setWeapons] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('-1');
  const [rarity, setRarity] = useState('-1');

  const data = [{"name":"Axe","description":"A typical single-blade axe with a wooden handle","skill":"Melee","damage":+3,"crit":3,"range":"Engaged","encumbrance":2,"price":2,"rarity":1,"specials":"Vicious 1/Dual-wield","durability":3,"spawnLocations":"All","setBonus":"None","anomalousEffect":"None","hidden":"Yes"},
    {"name":"Greataxe","description":"A double sided metallic axe with a wooden handle","skill":"Melee","damage":+4,"crit":3,"range":"Engaged","encumbrance":4,"price":5,"rarity":4,"specials":"Cumbersome 3/Pierce 2/Vicious 1","durability":3,"spawnLocations":"All","setBonus":"None","anomalousEffect":"None","hidden":"Yes"},
    {"name":"Halberd","description":"A polearm with a blade at the tip and side of the tip","skill":"Melee","damage":+3,"crit":3,"range":"Engaged","encumbrance":5,"price":4,"rarity":3,"specials":"Defensive 1/Pierce 3","durability":3,"spawnLocations":"All","setBonus":"None","anomalousEffect":"None","hidden":"Yes"}]

  //const data = {
  //  "Antimatter Rifle": {name: "", description: "", skill: "", damage: 0, crit: 0, range: "", encumbrance: 0, price: 0, rarity: 0, special: "", setBonus: "", spawnLocations: []},
  //  "Automatic Rifle": {name: "", description: "", skill: "", damage: 0, crit: 0, range: "", encumbrance: 0, price: 0, rarity: 0, special: "", setBonus: "", spawnLocations: []},
  //  "Hunting Rifle": {name: "", description: "", skill: "", damage: 0, crit: 0, range: "", encumbrance: 0, price: 0, rarity: 0, special: "", setBonus: "", spawnLocations: []},
  //  "Laser Gun": {name: "", description: "", skill: "", damage: 0, crit: 0, range: "", encumbrance: 0, price: 0, rarity: 0, special: "", setBonus: "", spawnLocations: []},
  //  "Laser Pistol": {name: "", description: "", skill: "", damage: 0, crit: 0, range: "", encumbrance: 0, price: 0, rarity: 0, special: "", setBonus: "", spawnLocations: []},
  //  "Laser Rifle": {name: "", description: "", skill: "", damage: 0, crit: 0, range: "", encumbrance: 0, price: 0, rarity: 0, special: "", setBonus: "", spawnLocations: []},
  //  "Basic Pistol": {name: "", description: "", skill: "", damage: 0, crit: 0, range: "", encumbrance: 0, price: 0, rarity: 0, special: "", setBonus: "", spawnLocations: []},
  //  "Checkov's Gun": {name: "", description: "", skill: "", damage: 0, crit: 0, range: "", encumbrance: 0, price: 0, rarity: 0, special: "", setBonus: "", spawnLocations: []},
  //  "Revolver": {name: "", description: "", skill: "", damage: 0, crit: 0, range: "", encumbrance: 0, price: 0, rarity: 0, special: "", setBonus: "", spawnLocations: []},
  //  "Shotgun": {name: "", description: "", skill: "", damage: 0, crit: 0, range: "", encumbrance: 0, price: 0, rarity: 0, special: "", setBonus: "", spawnLocations: []},
  //  "Retributor": {name: "", description: "", skill: "", damage: 0, crit: 0, range: "", encumbrance: 0, price: 0, rarity: 0, special: "", setBonus: "", spawnLocations: []},
  //  "Red Knight's Replica Sword": {name: "", description: "", skill: "", damage: 0, crit: 0, range: "", encumbrance: 0, price: 0, rarity: 0, special: "", setBonus: "", spawnLocations: []},
  //}

  const addData = () => {
    for(let i = 0; i < data.length; i++) {
      setDoc(doc(db, 'Weapons', data[i].name), {
        name: data[i].name,
        description: data[i].description,
        skill: data[i].skill,
        damage: data[i].damage,
        crit: data[i].crit,
        range: data[i].range,
        encumbrance: data[i].encumbrance,
        price: data[i].price,
        rarity: data[i].rarity,
        specials: data[i].specials,
        durability: data[i].durability,
        spawnLocations: data[i].spawnLocations,
        setBonus: data[i].setBonus,
        anomalousEffect: data[i].anomalousEffect,
        hidden: data[i].hidden
      })
    }
  }

  const getFromDB = () => {
    const q = query(collection(db, 'Weapons'), orderBy("name", "asc"));

    const unsub = onSnapshot(q, (querySnapshot) => {
      const queryData = [];
      querySnapshot.forEach((doc) => {
        queryData.push(doc.data());
      })
      setWeapons(queryData);
    })

    return () => {
      unsub();
    }
  }

  const DisplayItems = () => {
    let empty = true;

    return (
      <Stack direction='row' flexWrap='wrap' gap={1}>
        {weapons.map((item) => {
          if(
            (item.hidden === 'No' || localStorage.getItem('loggedIn').toUpperCase() === 'ADMIN') &&
            (item.price === parseInt(price) || (item.price >= 10 && parseInt(price) === 10) || price === '-1') &&
            (item.rarity === parseInt(rarity) || rarity === '-1') &&
            (item.name.toUpperCase().includes(name.toUpperCase()) || name === '')
          ) {
            empty = false;
            return <WeaponItem currWeapon={item}/>
          }
        })}
        {empty ? <Typography>There are no weapons that match your criteria.</Typography> : ""}
      </Stack>
    )
  }

  return (
    localStorage.getItem("loggedIn") === 'false' ? <NotLoggedIn /> : 
      <Box>
        <Button onClick={addData}>Add</Button>
        {weapons.length > 0 ?
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