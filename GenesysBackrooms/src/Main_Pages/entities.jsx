import { Box, Card, Divider, Stack, Toolbar, Typography } from "@mui/material";

export default function Entities() {
  const data = [
    {"name":"Smiler (Rival)","description":"A reflective white gleam in the shape of eyes and a grinning mouth","stats":"2, 4, 1, 2, 2, 2","soak":3,"wounds":10,"strain":0,"defenses":"0, 0","skills":"Athletics 3, Perception 2, Brawl 4","talents":null,"abilities":"Rush: The Smiler may use two movement manuevers per turn","actions":"Charge (attack): Brawl; Damage 8; Range [Engaged]; Pierce 3, Test: Brawl; Damage 0; Critical 2; Range[Engaged]","equipment":null},
    {"name":"Window (Rival)","description":"A window that matches the surrounding area. Within this window sometimes appears a shadowed humanoid figure","stats":"2,1,2,2,2,2","soak":2,"wounds":14,"strain":0,"defenses":"0.0","skills":"Brawl 2,Charm 3","talents":null,"abilities":"Whisper: The Window whispers within a short range. At the start of a player's turn, the player must make a contensted Cool check versus the Window's Charm check. On a fail, the player is staggered and must use thier free maneuver to move towards the Window. For the next 3 turns, that player is unaffected by this ability.","actions":"Grab (Attack): Brawl; Damage 6; Critical 5; Range [Engaged]; Stun Damage","equipment":null}
  ]

  const DisplayEntity = (props) => {
    const statNames = ["Brawn", "Agility", "Intellect", "Cunning", "Willpower", "Presence"];
    const stats = props.entity.stats.split(",");
    const defenses = props.entity.defenses.split(",");
    const skills = props.entity.skills.split(",");
    
    let talents = '', abilities = '', actions = '', equipment = '';
    if(props.entity.talents !== null) talents = props.entity.talents.split("/");
    if(props.entity.abilities !== null) abilities = props.entity.abilities.split("/");
    if(props.entity.actions !== null) actions = props.entity.actions.split("/");
    if(props.entity.equipment !== null) equipment = props.entity.equipment.split("/");

    return (
      <Card variant="outlined" sx={{width: {xs: '100%', md: '700px'}, textAlign: 'center', border: '1px solid black', overflow: 'auto', height: '700px'}}>
        <Typography variant="h4">{props.entity.name}</Typography>
        <Typography>{props.entity.description}</Typography>
        <br />
        <Stack direction='row' gap={2} justifyContent='center'>
          {stats.map((stat, index) => {
            return (
              <Box border='1px solid black' padding={1}>
                <Typography>{statNames[index]}</Typography>
                <Typography>{stat}</Typography>
              </Box>
            )
          })}
        </Stack>
        <br />
        <Stack direction='row' gap={2} justifyContent='center'>
          <Box border='1px solid black' padding={1}>
            <Typography>Soak</Typography>
            <Typography>{props.entity.soak}</Typography>
          </Box>
          <Box border='1px solid black' padding={1}>
            <Typography>Wounds</Typography>
            <Typography>{props.entity.wounds}</Typography>
          </Box>
          <Box border='1px solid black' padding={1}>
            <Typography>Strain</Typography>
            <Typography>{props.entity.strain}</Typography>
          </Box>
          <Box border='1px solid black' padding={1}>
            <Typography>M/R Defense</Typography>
            <Typography>{defenses[0]}, {defenses[1]}</Typography>
          </Box>
        </Stack>
        <Typography><b>Skills:</b> {skills.join(", ")}</Typography>
        <br />
        {talents === '' ?
          <>
            <Typography><b>Talents</b></Typography>
            <Divider />
            <Typography textAlign='left' sx={{textIndent: '20px'}}>None</Typography>
          </>
        :
          <>
            <Typography><b>Talents</b></Typography>
            <Divider />
            {talents.map((talent) => {
              <Typography textAlign='left' sx={{textIndent: '20px'}}>{talent}</Typography>
            })}
          </>
        }
        <br />
        {abilities === '' ? 
          <Typography><b>Abilities:</b> None</Typography>
        :
          <>
            <Typography><b>Abilities</b></Typography>
            <Divider />
            {abilities.map((ability) => {
              return <Typography textAlign='left' sx={{textIndent: '20px'}}>{ability}</Typography>
            })}
          </>
        }
        <br />
        {actions === '' ? 
          <Typography><b>Actions:</b> None</Typography>
        :
          <>
            <Typography><b>Actions</b></Typography>
            <Divider />
            {actions.map((action) => {
              return <Typography textAlign='left' sx={{textIndent: '20px'}}>{action}</Typography>
            })}
          </>
        }
        <br />
        {equipment === '' ?
          <>
            <Typography><b>Equipment</b></Typography>
            <Divider />
            <Typography textAlign='left' sx={{textIndent: '20px'}}>None</Typography>
          </>
        :
          <>
            <Typography><b>Equipment</b></Typography>
            <Divider />
            {equipment.map((equip) => {
              return <Typography textAlign='left' sx={{textIndent: '20px'}}>{equip}</Typography>
            })}
          </>
        }
      </Card>
    )
  }

  return (
    <Box>
      <Toolbar />
      <h1>Entities</h1>
      <Stack direction={{xs: 'column', md: 'row'}} flexWrap='wrap' gap={1} paddingBottom={2}>
        {data.map((entity) => {
          return <DisplayEntity entity={entity}/>
        })}
      </Stack>
    </Box>
  )
}

/*
  Moley's Comedy Club and Bar (Entity 65) has the Wormhole Object (Custom Object).
  Sightless Seer (Enitity 365) drops a blue luminescent slab of skin use in making the Object Seer Tea (Object 365).
  Jerry (Entity 7) may appear randomly and give the Object Jerry's Feather (Custom Object).
  Create The Old Fear. A god.
  Blanche (Entity 140) appears in the dreams of the people who play GAM from the Object BackROM (Object 47).
  The King (Entity 33) gives out the Object The King's Courage (Custom Object) whenever it wants to AND upon The King's death.
  The Musician (Entity 137) gives the Object Cassette Recorder (Object 34) to people.
  The Keymaster (Entity 0) gives out a single Level Key to each person. Once ever.
  Scream Eaters (Entity 97) drops Liquid Silence.
  The Neighborhood Watch (Entity 96) is exclusive to Level 9 and will hunt down any wanderer with the Object Pocket (Object 51) in thier possession.
*/