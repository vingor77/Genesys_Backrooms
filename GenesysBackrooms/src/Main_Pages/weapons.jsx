import { Box, Button, Toolbar } from "@mui/material";
import { doc, setDoc } from "firebase/firestore";
import db from '../Components/firebase';

export default function Weapons() {
  const data = {
    "Antimatter Rifle": {name: "", description: "", skill: "", damage: 0, crit: 0, range: "", encumbrance: 0, price: 0, rarity: 0, special: "", setBonus: "", spawnLocations: []},
    "Automatic Rifle": {name: "", description: "", skill: "", damage: 0, crit: 0, range: "", encumbrance: 0, price: 0, rarity: 0, special: "", setBonus: "", spawnLocations: []},
    "Hunting Rifle": {name: "", description: "", skill: "", damage: 0, crit: 0, range: "", encumbrance: 0, price: 0, rarity: 0, special: "", setBonus: "", spawnLocations: []},
    "Laser Gun": {name: "", description: "", skill: "", damage: 0, crit: 0, range: "", encumbrance: 0, price: 0, rarity: 0, special: "", setBonus: "", spawnLocations: []},
    "Laser Pistol": {name: "", description: "", skill: "", damage: 0, crit: 0, range: "", encumbrance: 0, price: 0, rarity: 0, special: "", setBonus: "", spawnLocations: []},
    "Laser Rifle": {name: "", description: "", skill: "", damage: 0, crit: 0, range: "", encumbrance: 0, price: 0, rarity: 0, special: "", setBonus: "", spawnLocations: []},
    "Basic Pistol": {name: "", description: "", skill: "", damage: 0, crit: 0, range: "", encumbrance: 0, price: 0, rarity: 0, special: "", setBonus: "", spawnLocations: []},
    "Checkov's Gun": {name: "", description: "", skill: "", damage: 0, crit: 0, range: "", encumbrance: 0, price: 0, rarity: 0, special: "", setBonus: "", spawnLocations: []},
    "Revolver": {name: "", description: "", skill: "", damage: 0, crit: 0, range: "", encumbrance: 0, price: 0, rarity: 0, special: "", setBonus: "", spawnLocations: []},
    "Shotgun": {name: "", description: "", skill: "", damage: 0, crit: 0, range: "", encumbrance: 0, price: 0, rarity: 0, special: "", setBonus: "", spawnLocations: []},
    "Retributor": {name: "", description: "", skill: "", damage: 0, crit: 0, range: "", encumbrance: 0, price: 0, rarity: 0, special: "", setBonus: "", spawnLocations: []},
    "Red Knight's Replica Sword": {name: "", description: "", skill: "", damage: 0, crit: 0, range: "", encumbrance: 0, price: 0, rarity: 0, special: "", setBonus: "", spawnLocations: []},

    //"": {name: "", description: "", skill: "", damage: 0, crit: 0, range: "", encumbrance: 0, price: 0, rarity: 0, special: "", setBonus: "", spawnLocations: []},
  }

  const addData = () => {
    for(let i = 0; i < Object.keys(data).length; i++) {
      setDoc(doc(db, 'Weapons', Object.keys(data)[i]), {
        name: data[Object.keys(data)[i]].name,
        description: data[Object.keys(data)[i]].description,
        skill: data[Object.keys(data)[i]].skill,
        damage: data[Object.keys(data)[i]].damage,
        crit: data[Object.keys(data)[i]].crit,
        range: data[Object.keys(data)[i]].range,
        encumbrance: data[Object.keys(data)[i]].encumbrance,
        price: data[Object.keys(data)[i]].price,
        rarity: data[Object.keys(data)[i]].rarity,
        special: data[Object.keys(data)[i]].special,
        setBonus: data[Object.keys(data)[i]].setBonus
      })
    }
  }

  return (
    <Box>
      <Toolbar />
      <Button onClick={addData}>Add</Button>
    </Box>
  )
}