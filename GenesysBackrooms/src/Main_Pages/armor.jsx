import { Box, Button, Toolbar } from "@mui/material";
import { doc, setDoc } from "firebase/firestore";
import db from '../Components/firebase';

export default function Armor() {
  const data = {
    "Red Knight Replica Gloves": {name: "", defense: "", soak: "", encumbrance: "", price: 0, rarity: 0, special: "", setBonus: "", spawnLocations: []},
    "Red Knight Replica Greaves": {name: "", defense: "", soak: "", encumbrance: "", price: 0, rarity: 0, special: "", setBonus: "", spawnLocations: []},
    "Red Knight Replica Helmet": {name: "", defense: "", soak: "", encumbrance: "", price: 0, rarity: 0, special: "", setBonus: "", spawnLocations: []},
    "Red Knight Replica Plate": {name: "", defense: "", soak: "", encumbrance: "", price: 0, rarity: 0, special: "", setBonus: "", spawnLocations: []},
    "Red Knight Replica Shield": {name: "", defense: "", soak: "", encumbrance: "", price: 0, rarity: 0, special: "", setBonus: "", spawnLocations: []},
    "Shadow Hide Armor": {name: "", defense: "", soak: "", encumbrance: "", price: 0, rarity: 0, special: "", setBonus: "", spawnLocations: []},
    "Questionably Stealthy Boots": {name: "", defense: "", soak: "", encumbrance: "", price: 0, rarity: 0, special: "", setBonus: "", spawnLocations: []},
    "Ring of Ridiculous Speed": {name: "", defense: "", soak: "", encumbrance: "", price: 0, rarity: 0, special: "", setBonus: "", spawnLocations: []},

    //"": {name: "", defense: "", soak: "", encumbrance: "", price: 0, rarity: 0, special: "", setBonus: "", spawnLocations: []},
  }

  const addData = () => {
    for(let i = 0; i < Object.keys(data).length; i++) {
      setDoc(doc(db, 'Armor', Object.keys(data)[i]), {
        name: data[Object.keys(data)[i]].name,
        defense: data[Object.keys(data)[i]].defense,
        soak: data[Object.keys(data)[i]].soak,
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