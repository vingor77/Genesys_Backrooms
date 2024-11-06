import { Box, Button, Divider, Modal, Stack, Typography } from "@mui/material";
import { useState } from "react";

export default function NightEntity(props) {
  const [open, setOpen] = useState(false);
  const stats = ['Brawn', 'Agility', 'Intellect', 'Cunning', 'Willpower', 'Presence'];
  let skills = '';

  return (
    <Box>
      <Button onClick={() => setOpen(true)}>{props.data.name}</Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="statBlock"
        aria-describedby="statBlockDescription"
      >
        <Box sx={{position: "absolute", top: '50%', left: '50%', width: 550, bgcolor: 'background.paper', padding: 1, transform: 'translate(-50%, -50%)'}}>
          <Typography variant="h5" textAlign='center'>{props.data.name} (Nemesis)</Typography>
          <Typography textAlign='center'>{props.data.description}</Typography>
          <br />
          <Divider />
          <Typography sx={{fontWeight: 'bold'}} textAlign='center'>Characteristics</Typography>
          <Stack direction='row' gap={1} justifyContent="space-between" alignItems="center" textAlign='center'>
            {props.data.stats.map((stat, index) => {
              return (
                <Stack>
                  <Typography>{stats[index]}</Typography>
                  <Typography>{stat}</Typography>
                </Stack>
              )
            })}
          </Stack>
          <Divider />
          <br />
          <Stack direction='row' gap={1} justifyContent="space-between" alignItems="center" textAlign='center'>
            <Typography>Soak: {props.data.soak}</Typography>
            <Typography>Wounds: {props.data.wounds}</Typography>
            <Typography>M/R defense: {props.data.defenses[0]}/{props.data.defenses[1]}</Typography>
            <Typography>Stun Multiplier: {props.data.stunMulti}</Typography>
          </Stack>
          <br />
          <Divider />
          <br />
          {props.data.skills.length === 0 ? 
            <Typography><b>Skills:</b> None</Typography>
          :
            <Box>
              {props.data.skills.map(() => {
                skills = props.data.skills.join(" ");
              })}
              <Typography><b>Skills:</b> {skills}</Typography>
            </Box>
          }
          <br />
          <Divider />
          <br />
          {props.data.weapons.length === 0 ? 
            <Typography><b>Weapons:</b> None</Typography>
          :
            <Box>
              <Typography sx={{fontWeight: 'bold'}} textAlign='center'>Weapons</Typography>
              {props.data.weapons.map((weapon) => {
                const separated = weapon.split(":");
                return <Typography><b>{separated[0]}:</b> {separated[1]}</Typography>
              })}
            </Box>
          }
        </Box>
      </Modal>
    </Box>
  )
}