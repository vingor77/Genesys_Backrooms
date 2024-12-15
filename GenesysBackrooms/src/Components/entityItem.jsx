import { Box, Button, Card, Chip, Divider, Modal, Stack, Typography } from "@mui/material";
import { useState } from "react";

export default function EntityItem(props) {
  const statNames = ["Brawn", "Agility", "Intellect", "Cunning", "Willpower", "Presence"];
  const stats = props.entity.stats.split("/"); //Don't join so the stat name can go with it.
  const defenses = props.entity.defenses.split("/").join(", ");
  const skills = props.entity.skills.split("/").join(", ");
  const drops = props.entity.drops.split("/").join(", ");
  
  const talents = props.entity.talents.split("/");
  const abilities = props.entity.abilities.split("/");
  const actions = props.entity.actions.split("/");
  const equipment = props.entity.equipment.split("/");

  return (
    <Card variant="outlined" sx={{width: {xs: '100%', md: '600px'}, textAlign: 'center', border: '1px solid black', overflow: 'auto', height: '700px', padding: 1}}>
      <Stack direction='row' justifyContent='space-between' alignItems='center'>
        <Typography variant="h4">{props.entity.name}</Typography>
        <Chip label={'Difficulty: ' + props.entity.difficulty} />
      </Stack>

      <br />
      <Typography>{props.entity.description}</Typography>
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
      <Chip label={"Soak: " + props.entity.soak} sx={{width: '25%'}}/>
      <Chip label={"Wounds: " + props.entity.wounds} sx={{width: '25%'}} />
      {props.entity.strain === 0 ? <Chip label={"Strain: N/A"} sx={{width: '25%'}} /> : <Chip label={"Strain: " + props.entity.strain} />}
      <Chip label={"M/R Defenses: " + defenses} sx={{width: '25%'}} />
      <br /><br />
      <Divider />
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
      <br />
      <Typography textAlign='left'><b>Equipment:</b> {equipment}</Typography>
      <br />
      <Typography textAlign='left'><b>Drops:</b> {drops}</Typography>
    </Card>
  )
}