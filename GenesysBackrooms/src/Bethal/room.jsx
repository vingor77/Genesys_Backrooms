import { Box, Button, Card, Chip, Divider, Modal, Stack, Typography } from "@mui/material";
import { useState } from "react";

export default function Room(props) {
  const [statBlockOpen, setStatBlockOpen] = useState(false);
  const stats = ['Brawn', 'Agility', 'Intellect', 'Cunning', 'Willpower', 'Presence'];
  let connections = '';
  let skills = '';
  let talents = '';
  let equipment = '';

  return (
    <Card variant="outlined" sx={{width: {xs: '100%', md: '350px'}, textAlign: 'center', border: '1px solid black', overflow: 'auto', height: '435px', padding: 1}}>
      <Stack justifyContent="space-between" alignItems="center">
        {props.data.fireExit ? <Typography sx={{fontWeight: 'bold'}}>{props.data.roomType} (Fire Exit)</Typography> : <Typography sx={{fontWeight: 'bold'}}>{props.data.roomType}</Typography>}
        <Chip label={'Room: ' + props.data.roomNum} />
      </Stack>
      {props.data.scraps.length !== 0 ? 
        <Box>
          <br />
          <Divider />
          <Typography sx={{fontWeight: 'bold'}}>Scrap in this room:</Typography>
          {props.data.scraps.map((scrap, index) => {
            return <Typography>{index + 1}: {scrap.name} valued at {scrap.value} and weighs {scrap.weight}</Typography>
          })}
        </Box>
      :
        <Box>
           <br />
           <Divider />
           <Typography>No scrap present</Typography>
        </Box>
      }
      <br />
      <Divider />
      <Typography sx={{fontWeight: 'bold'}}>Room variants:</Typography>
      {props.data.landmine ? <Typography>Landmine</Typography> : <Typography>No Landmine</Typography>}
      {props.data.spikeTrap ? <Typography>Spike Trap</Typography> : <Typography>No Spike Trap</Typography>}
      {props.data.turret ? <Typography>Turret</Typography> : <Typography>No Turret</Typography>}
      <br />
      <Divider />
      {props.data.connections.sort((a,b) => a-b).map(() => {
        connections = props.data.connections.join(', ');
      })}
      <Typography><b>Connection(s):</b> {connections}</Typography>

      {Object.keys(props.data.entity).length !== 0 ?
        <Box textAlign='center'>
          <br />
          <Divider />
          <Typography sx={{fontWeight: 'bold'}}>Entity: </Typography>
          <Button onClick={() => setStatBlockOpen(true)} variant="outlined">{props.data.entity.name}</Button>
          <Modal
            open={statBlockOpen}
            onClose={() => setStatBlockOpen(false)}
            aria-labelledby="statBlock"
            aria-describedby="statBlockDescription"
          >
            <Box sx={{position: "absolute", top: '50%', left: '50%', width: 550, bgcolor: 'background.paper', padding: 1, transform: 'translate(-50%, -50%)'}}>
              <Typography variant="h5" textAlign='center'>{props.data.entity.name} ({props.data.entity.type})</Typography>
              <Typography textAlign='center'>{props.data.entity.description}</Typography>
              <br />
              <Divider />
              <Typography sx={{fontWeight: 'bold'}} textAlign='center'>Characteristics</Typography>
              <Stack direction='row' gap={1} justifyContent="space-between" alignItems="center" textAlign='center'>
                {props.data.entity.stats.map((stat, index) => {
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
                <Typography>Soak: {props.data.entity.soak}</Typography>
                <Typography>Wounds: {props.data.entity.wounds}</Typography>
                <Typography>M/R defense: {props.data.entity.defenses[0]}/{props.data.entity.defenses[1]}</Typography>
                <Typography>Stun Multiplier: {props.data.entity.stunMulti}</Typography>
              </Stack>

              <br />
              <Divider />
              <br />
              {props.data.entity.skills.length === 0 ? 
                <Typography><b>Skills:</b> None</Typography>
              :
                <Box>
                  {props.data.entity.skills.map(() => {
                    skills = props.data.entity.skills.join(" ");
                  })}
                  <Typography><b>Skills:</b> {skills}</Typography>
                </Box>
              }

              <br />
              <Divider />
              <br />
              {props.data.entity.talents.length === 0 ? 
                <Typography><b>Talents:</b> None</Typography>
              :
                <Box>
                  {props.data.entity.talents.map(() => {
                    talents = props.data.entity.talents.join(" ");
                  })}
                  <Typography><b>Talents:</b> {talents}</Typography>
                </Box>
              }

              <br />
              <Divider />
              <br />
              {props.data.entity.abilities.length === 0 ? 
                <Typography><b>Abilities:</b> None</Typography>
              :
                <Stack gap={1}>
                  <Typography sx={{fontWeight: 'bold'}} textAlign='center'>Abilities</Typography>
                  {props.data.entity.abilities.map((ability) => {
                    const separated = ability.split(":");
                    return <Typography><b>{separated[0]}:</b> {separated[1]}</Typography>
                  })}
                </Stack>
              }

              <br />
              <Divider />
              <br />
              {props.data.entity.equipment.length === 0 ? 
                <Typography><b>Equipment:</b> None</Typography>
              :
                <Box>
                  {props.data.entity.equipment.map(() => {
                    equipment = props.data.entity.equipment.join(", ");
                  })}
                  <Typography><b>Equipment:</b> {equipment}</Typography>
                </Box>
              }

              <br />
              <Divider />
              <br />
              {props.data.entity.weapons.length === 0 ? 
                <Typography><b>Weapons:</b> None</Typography>
              :
                <Box>
                  <Typography sx={{fontWeight: 'bold'}} textAlign='center'>Weapons</Typography>
                  {props.data.entity.weapons.map((weapon) => {
                    const separated = weapon.split(":");
                    return <Typography><b>{separated[0]}:</b> {separated[1]}</Typography>
                  })}
                </Box>
              }
            </Box>
          </Modal>
        </Box>
      :
        ""
      }
    </Card>
  )
}
