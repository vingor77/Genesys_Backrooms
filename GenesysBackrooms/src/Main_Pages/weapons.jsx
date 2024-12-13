import { Box, Button, Stack, Toolbar } from "@mui/material";
import { collection, doc, onSnapshot, orderBy, query, setDoc } from "firebase/firestore";
import db from '../Components/firebase';
import { useState } from "react";
import WeaponItem from "../Components/weaponItem";
import NotLoggedIn from "../Components/notLoggedIn";

export default function Weapons() {
  const [weapons, setWeapons] = useState([]);

  const data = [{"name":"Axe","description":"A typical single-blade axe with a wooden handle","skill":"Melee","damage":+3,"crit":3,"range":"Engaged","encumbrance":2,"price":2,"rarity":1,"specials":"Vicious 1/Dual-wield","durability":3,"spawnLocations":"All","setBonus":"None","anomalousEffect":"None"},
    {"name":"Greataxe","description":"A double sided metallic axe with a wooden handle","skill":"Melee","damage":+4,"crit":3,"range":"Engaged","encumbrance":4,"price":5,"rarity":4,"specials":"Cumbersome 3/Pierce 2/Vicious 1","durability":3,"spawnLocations":"All","setBonus":"None","anomalousEffect":"None"},
    {"name":"Halberd","description":"A polearm with a blade at the tip and side of the tip","skill":"Melee","damage":+3,"crit":3,"range":"Engaged","encumbrance":5,"price":4,"rarity":3,"specials":"Defensive 1/Pierce 3","durability":3,"spawnLocations":"All","setBonus":"None","anomalousEffect":"None"}]
    
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
        anomalousEffect: data[i].anomalousEffect
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

  return (
    localStorage.getItem("loggedIn") === 'false' ? <NotLoggedIn /> : 
      <Box>
        <Button onClick={addData}>Add</Button>
        {weapons.length > 0 ? 
          <Stack direction='row' flexWrap='wrap' gap={1}>
            {weapons.map((item) => {
              return <WeaponItem currWeapon={item}/>
            })}
          </Stack>
        :
          getFromDB()
        }
      </Box>
  )
}