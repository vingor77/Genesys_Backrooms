import { Box, Card, Chip, Divider, Stack, Typography } from "@mui/material";

export default function InsideEntity(props) {
  let statNames = ["Brawn", "Agility", "Intellect", "Cunning", "Willpower", "Presence"];
  let stats = [];
  let defenses = [];
  let skills = [];
  let talents = [];
  let abilities = [];
  let actions = [];

  if(Object.keys(props.data.entity).length > 0) {
    stats = props.data.entity.stats.split("/"); //Don't join so the stat name can go with it.
    defenses = props.data.entity.defenses.split("/").join(", ");
    skills = props.data.entity.skills.split("/").join(", ");
    talents = props.data.entity.talents.split("/");
    abilities = props.data.entity.abilities.split("/");
    actions = props.data.entity.actions.split("/");
  }

  return (
    <Box padding={2}>
      {Object.keys(props.data.entity).length !== 0 ?
        <Box textAlign='center'>
          <Box padding={2}>
            <Stack direction='row' justifyContent='space-around' alignItems='center'>
              <Typography variant="h4">{props.data.entity.name}</Typography>
              <Chip label={'Type: ' + props.data.entity.type} />
              <Chip label={'Difficulty: ' + props.data.entity.difficulty} />
            </Stack>
            <br />
            <Typography>{props.data.entity.description}</Typography>
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
              <Chip label={"Soak: " + props.data.entity.soak}/>
              <Chip label={"Wounds: " + props.data.entity.wounds} />
              {props.data.entity.strain === 0 ? <Chip label={"Strain: N/A"} /> : <Chip label={"Strain: " + props.data.entity.strain} />}
              <Chip label={"M/R Defenses: " + defenses} />
              <Chip label={'Stun Multiplier: ' + props.data.entity.stunMulti} />
            </Stack>
            <br />
            <Divider />
            <br />
            <Typography textAlign='left'><b>Fear:</b> {Math.round(parseInt(props.data.entity.difficulty) / 2)}</Typography>
            <br />
            <Typography textAlign='left'><b>Special Mechanic:</b> {props.data.entity.specialMechanics}</Typography>
            <br />
            <Typography textAlign='left'><b>Sound Queue:</b> {String(props.data.entity.soundQueue).split('/')[0]} and can be heard {String(props.data.entity.soundQueue).split('/')[1]} room(s) away.</Typography>
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
        </Box>
      :
        ""
      }
    </Box>
  )
}
