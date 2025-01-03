import { Box, Button, Chip, Dialog, Divider, Modal, Stack, Typography } from "@mui/material";
import { useState } from "react";

export default function NightEntity(props) {
  const [open, setOpen] = useState(false);
  let statNames = ["Brawn", "Agility", "Intellect", "Cunning", "Willpower", "Presence"];
  const stats = props.data.stats.split("/"); //Don't join so the stat name can go with it.
  const defenses = props.data.defenses.split("/").join(", ");
  const skills = props.data.skills.split("/").join(", ");
  const talents = props.data.talents.split("/");
  const abilities = props.data.abilities.split("/");
  const actions = props.data.actions.split("/");

  return (
    <Box>
      <Button onClick={() => setOpen(true)}>{props.data.name}</Button>
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
        >
        <Box padding={2}>
          <Stack direction='row' justifyContent='space-around' alignItems='center'>
            <Typography variant="h4">{props.data.name}</Typography>
            <Chip label={'Type: ' + props.data.type} />
            <Chip label={'Difficulty: ' + props.data.difficulty} />
          </Stack>
          <br />
          <Typography>{props.data.description}</Typography>
          <br />
          <Stack direction='row' justifyContent="space-between" alignItems="center">
            {stats.map((stat, index) => {
              return (
                <>
                  <Chip label={statNames[index] + ": " + stat} />
                  {index === stats.length - 1 ? "" : <Divider orientation="vertical" variant="middle" flexItem/>}
                </>
              )
            })}
          </Stack>
          <br />
          <Stack direction='row' justifyContent='space-around'>
            <Chip label={"Soak: " + props.data.soak}/>
            <Chip label={"Wounds: " + props.data.wounds} />
            {props.data.strain === 0 ? <Chip label={"Strain: N/A"} /> : <Chip label={"Strain: " + props.data.strain} />}
            <Chip label={"M/R Defenses: " + defenses} />
            <Chip label={'Stun Multiplier: ' + props.data.stunMulti} />
          </Stack>
          <br />
          <Divider />
          <br />
          <Typography textAlign='left'><b>Fear:</b> {Math.round(parseInt(props.data.difficulty) / 2)}</Typography>
          <br />
          <Typography><b>Special Mechanic:</b> {props.data.specialMechanics}</Typography>
          <br />
          <Typography><b>Sound Queue:</b> {String(props.data.soundQueue).split('/')[0]} and can be heard {String(props.data.soundQueue).split('/')[1]} range band(s) away.</Typography>
          <br />
          <Typography textAlign='left'><b>Skills:</b> {skills}</Typography>
          <br />
          <Typography textAlign='left'><b>Talents:</b></Typography>
          {talents.map((talent, index) => {
            return <Typography textAlign='left'>{index + 1}. {talent}</Typography>
          })}
          <br />
          <Typography textAlign='left'><b>Abilities:</b></Typography>
          {abilities.map((ability, index) => {
            return <Typography textAlign='left'>{index + 1}. {ability}</Typography>
          })}
          <br />
          <Typography textAlign='left'><b>Actions:</b></Typography>
          {actions.map((action, index) => {
            return <Typography textAlign='left'>{index + 1}. {action}</Typography>
          })}
        </Box>
      </Dialog>
    </Box>
  )
}