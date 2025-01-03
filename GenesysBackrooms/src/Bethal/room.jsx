import { Box, Card, Checkbox, Chip, Divider, Stack, Typography } from "@mui/material";

export default function Room(props) {
  let connections = '';
  const traps = !props.data.landmine && !props.data.spikeTrap && !props.data.turret && !props.data.lockedDoor;

  return (
    <Card variant="outlined" sx={{width: {xs: '100%', md: '350px'}, textAlign: 'center', border: '1px solid black', overflow: 'auto', height: '500px', padding: 1}}>
      <Stack direction='row' justifyContent="space-around">
        <Typography sx={{fontWeight: 'bold'}}>{props.data.roomType}</Typography>
        <Chip label={'Room: ' + props.data.roomNum} />
        {props.data.fireExit ? <Chip label={'Fire Exit'} /> : ""}
      </Stack>
      <br />
      <Stack direction='row' justifyContent='space-around'>
        <Box width='50%'>
          <Divider>Lights</Divider>
          <Typography>Apparatus Active: {props.data.lightsOn !== undefined ? props.data.lightsOn : 5}</Typography>
          <Typography>Apparatus Inactive: {props.data.lightsOff !== undefined ? props.data.lightsOff : 5}</Typography>
        </Box>
        <Box width='50%'>
          <Divider>Corrosion</Divider>
          <Typography>{props.data.toxicity}</Typography>
        </Box>
      </Stack>

      {props.data.scraps.length !== 0 ? 
        <Box>
          <br />
          <Divider>Scraps</Divider>
          {props.data.scraps.map((scrap, index) => {
            return (
              <Box>
                <Typography><b>{scrap.name}</b></Typography>
                <Stack direction='row' key={index} justifyContent='space-between'>
                  <Box>
                    <Typography>Value</Typography>
                    <Typography>{scrap.value}</Typography>
                  </Box>
                  <Box>
                    <Typography>Weight</Typography>
                    <Typography>{scrap.weight}</Typography>
                  </Box>
                  <Box>
                    <Typography>Two-Handed</Typography>
                    <Typography>{scrap.twoHanded ? 'Yes' : 'No'}</Typography>
                  </Box>
                  <Box>
                    <Typography>Conductive</Typography>
                    <Typography>{scrap.conductive ? 'Yes' : 'No'}</Typography>
                  </Box>
                </Stack>
              </Box>
            )
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
      <Divider>Traps</Divider>
      {traps ? <Typography>None</Typography> :
        <Stack direction='row' justifyContent='space-around'>
          <Box>
            <Typography>Landmine: {props.data.landmine ? <Checkbox checked disabled></Checkbox> : <Checkbox disabled></Checkbox>}</Typography>
            <Typography>Spike Trap: {props.data.spikeTrap ? <Checkbox checked disabled></Checkbox> : <Checkbox disabled></Checkbox>}</Typography>
          </Box>
          <Box>
            <Typography>Turret: {props.data.turret ? <Checkbox checked disabled></Checkbox> : <Checkbox disabled></Checkbox>}</Typography>
            <Typography>{props.data.doorType}: {props.data.lockedDoor ? <Checkbox checked disabled></Checkbox> : <Checkbox disabled></Checkbox>}</Typography>
          </Box>
        </Stack>
      }
      <br />
      {props.data.connections.sort((a,b) => a-b).map(() => {
        connections = props.data.connections.join(', ');
      })}
      <Divider>Connections</Divider>
      <Typography>{connections}</Typography>
    </Card>
  )
}
