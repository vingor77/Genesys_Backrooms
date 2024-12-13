import { Box, Button, Card, Chip, Modal, Stack, Typography } from "@mui/material";
import { useState } from "react";

export default function WeaponItem(props) {
  const [anomalousDisplayed, setAnomalousDisplayed] = useState(false);

  const specials = props.currWeapon.specials.split("/").join(", ");

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
            <Typography variant="h5">{props.currWeapon.name}</Typography>
            <Typography>{props.currWeapon.anomalousEffect}</Typography>
          </Box>
        </Modal>
      </Box>
    )
  }

  return (
    <Card variant="outlined" sx={{width: {xs: '100%', md: '400px'}, textAlign: 'center', border: '1px solid black', overflow: 'auto', height: '350px'}}>
      <Box sx={{ p: 2 }}>
        <Stack direction='row' justifyContent="space-between" alignItems="center">
          <Chip label={"Rarity: " + props.currWeapon.rarity}></Chip>
          <Typography variant="h5">{props.currWeapon.name}</Typography>
          <Chip label={"Price: " + props.currWeapon.price}></Chip>
        </Stack>
        <Typography>{props.currWeapon.description}</Typography>
        <Box textAlign='left'>
          <Typography>Durability: {props.currWeapon.durability}</Typography>
          <Typography>Skill: {props.currWeapon.skill}</Typography>
          <Typography>Damage: {props.currWeapon.damage}</Typography>
          <Typography>Crit: {props.currWeapon.crit}</Typography>
          <Typography>Range: {props.currWeapon.range}</Typography>
          <Typography>Encumbrance: {props.currWeapon.encumbrance}</Typography>
          <Typography>Specials: {specials}</Typography>
          <Typography>Set bonus: {props.currWeapon.setBonus}</Typography>
        </Box>
        {props.currWeapon.anomalousEffect !== "None" ?
          <Button size="small" onClick={() => setAnomalousDisplayed(true)}>Display Anomalous Effect</Button>
        :
          ""
        }
        <DisplayAnomalousProperty />
      </Box>
    </Card>
  )
}