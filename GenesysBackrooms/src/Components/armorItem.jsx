import { Box, Button, Card, Chip, Modal, Stack, Typography } from "@mui/material";
import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import db from '../Components/firebase';

export default function ArmorItem(props) {
  const [anomalousDisplayed, setAnomalousDisplayed] = useState(false);

  const defenses = props.currArmor.defense.split("/");
  const specials = props.currArmor.specials.split("/").join(", ");

  const DisplayAnomalousProperty = () => {
    return (
      <Box>
        <Modal
          open={anomalousDisplayed}
          onClose={() => setAnomalousDisplayed(false)}
          aria-labelledby="anomalousEffect"
          aria-describedby="anomalousEffect"
        >
          <Box sx={{position: "absolute", top: '50%', left: '50%', width: 550, bgcolor: 'background.paper', padding: 1, transform: 'translate(-50%, -50%)'}}>
            <Typography variant="h5">{props.currArmor.name}</Typography>
            <Typography>{props.currArmor.anomalousEffect}</Typography>
          </Box>
        </Modal>
      </Box>
    )
  }

  const flipArmor = () => {
    setDoc(doc(db, 'Armor', props.currArmor.name), {
      name: props.currArmor.name,
      defense: props.currArmor.defense,
      soak: props.currArmor.soak,
      encumbrance: props.currArmor.encumbrance,
      price: props.currArmor.price,
      rarity: props.currArmor.rarity,
      specials: props.currArmor.specials,
      setBonus: props.currArmor.setBonus,
      spawnLocations: props.currArmor.spawnLocations,
      durability: props.currArmor.durability,
      description: props.currArmor.description,
      anomalousEffect: props.currArmor.anomalousEffect,
      equippedTo: props.currArmor.equippedTo,
      hidden: props.currArmor.hidden === 'Yes' ? 'No' : 'Yes'
    })
  }

  return (
    <Card variant="outlined" sx={{width: {xs: '100%', md: '400px'}, textAlign: 'center', border: '1px solid black', overflow: 'auto', height: '350px'}}>
      <Box sx={{ p: 2 }}>
        <Typography variant="h5">{props.currArmor.name}</Typography>
        <Stack direction='row' justifyContent="space-between" alignItems="center">
          <Chip label={"Rarity: " + props.currArmor.rarity}></Chip>
          <Chip label={"Type: " + props.currArmor.equippedTo} />
          <Chip label={"Price: " + props.currArmor.price}></Chip>
        </Stack>
        <Typography>{props.currArmor.description}</Typography>
        <Box textAlign='left'>
          <Typography>Durability: {props.currArmor.durability}</Typography>
          <Typography>Melee defense: {defenses[0]}</Typography>
          <Typography>Ranged defense: {defenses[1]}</Typography>
          <Typography>Soak: {props.currArmor.soak}</Typography>
          <Typography>Encumbrance: {props.currArmor.encumbrance}</Typography>
          <Typography>Specials: {specials}</Typography>
          <Typography>Set bonus: {props.currArmor.setBonus}</Typography>
        </Box>
        {props.currArmor.anomalousEffect !== "None" ?
          <Button size="small" onClick={() => setAnomalousDisplayed(true)} variant="outlined">Display Anomalous Effect</Button>
        :
          ""
        }
        <DisplayAnomalousProperty />
        {localStorage.getItem('loggedIn').toUpperCase() === 'ADMIN' ? props.currArmor.hidden === 'Yes' ? <Button onClick={flipArmor} variant="outlined">Show Armor</Button> : <Button onClick={flipArmor} variant="outlined">Hide Armor</Button> : ""}
      </Box>
    </Card>
  )
}