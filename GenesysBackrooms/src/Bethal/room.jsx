import { Box, Card, Checkbox, Chip, Divider, Stack, Typography } from "@mui/material";

export default function Room(props) {
  const explored = props.data.explored ? 'green' : 'red';
  let connections = '';

  return (
    <Card variant="outlined" sx={{border: 3, borderColor: explored, width: {xs: '100%', md: '350px'}, textAlign: 'center', overflow: 'auto', height: '500px', padding: 1}}>
      <Stack direction='row' justifyContent="space-around">
        <Typography sx={{fontWeight: 'bold'}}>{props.data.roomType}</Typography>
        <Chip label={'Room: ' + props.data.roomNum} />
        {props.data.fireExit ? <Chip label={'Fire Exit'} /> : ""}
      </Stack>
      {props.data.connections.sort((a,b) => a-b).map(() => {
        connections = props.data.connections.join(', ');
      })}
      <Divider>Connections</Divider>
      <Typography>{connections}</Typography>
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
      <br />
      <Box>
        <Divider>Doors</Divider>
        <Stack direction='row' justifyContent='space-between'>
          <Typography>{props.data.doorConnections[0] === "" ? "Locked" : props.data.doorConnections[0]}</Typography>
          {props.data.doorType[0] ? <Checkbox checked disabled></Checkbox> : <Checkbox disabled></Checkbox>}
        </Stack>
        <Stack direction='row' justifyContent='space-between'>
          <Typography>{props.data.doorConnections[1] === "" ? "Unlocked" : props.data.doorConnections[1]}</Typography>
          {props.data.doorType[1] ? <Checkbox checked disabled></Checkbox> : <Checkbox disabled></Checkbox>}
        </Stack>
        <Stack direction='row' justifyContent='space-between'>
          <Typography>{props.data.doorConnections[2] === "" ? "Closed Secure" : props.data.doorConnections[2]}</Typography>
          {props.data.doorType[2] ? <Checkbox checked disabled></Checkbox> : <Checkbox disabled></Checkbox>}
        </Stack>
        <Stack direction='row' justifyContent='space-between'>
          <Typography>{props.data.doorConnections[3] === "" ? "Open Secure" : props.data.doorConnections[3]}</Typography>
          {props.data.doorType[3] ? <Checkbox checked disabled></Checkbox> : <Checkbox disabled></Checkbox>}
        </Stack>
      </Box>
      <Box>
        <Divider>Traps</Divider>
        <Stack direction='row' justifyContent='space-between'>
          <Typography>Landmine: </Typography>
          {props.data.landmine ? <Checkbox checked disabled></Checkbox> : <Checkbox disabled></Checkbox>}
        </Stack>
        <Stack direction='row' justifyContent='space-between'>
          <Typography>Spike Trap: </Typography>
          {props.data.spikeTrap ? <Checkbox checked disabled></Checkbox> : <Checkbox disabled></Checkbox>}
        </Stack>
        <Stack direction='row' justifyContent='space-between'>
          <Typography>Turret: </Typography>
          {props.data.turret ? <Checkbox checked disabled></Checkbox> : <Checkbox disabled></Checkbox>}
        </Stack>
      </Box>
      {props.data.scraps.length !== 0 ? 
        <Box>
          <br />
          <Divider>Scraps</Divider>
          {props.data.scraps.length === 1 ?
            <Box>
              <Stack direction='row' justifyContent='space-evenly'>
                <Chip label={'Value: ' + props.data.scraps[0].value} />
                <Typography color={props.data.scraps[0].color}><b>{props.data.scraps[0].name}</b></Typography>
                <Chip label={'Weight: ' + props.data.scraps[0].weight} />
              </Stack>
              <Stack direction='row' justifyContent='space-evenly'>
                <Box>
                  <Typography>Two-Handed</Typography>
                  <Typography>{props.data.scraps[0].twoHanded ? 'Yes' : 'No'}</Typography>
                </Box>
                <Box>
                  <Typography>Conductive</Typography>
                  <Typography>{props.data.scraps[0].conductive ? 'Yes' : 'No'}</Typography>
                </Box>
                <Box>
                  <Typography>Grabbed</Typography>
                  <Typography>{props.data.scraps[0].grabbed ? 'Yes' : 'No'}</Typography>
                </Box>
              </Stack>
            </Box>
          :
            <Box>
              {props.data.scraps.length === 3 ?
                <Box>
                  <Stack direction='row' justifyContent='space-evenly'>
                    <Chip label={'Value: ' + props.data.scraps[2].value} />
                    <Typography color={props.data.scraps[2].color}><b>{props.data.scraps[2].name}</b></Typography>
                    <Chip label={'Weight: ' + props.data.scraps[2].weight} />
                  </Stack>
                  <Stack direction='row' justifyContent='space-evenly'>
                    <Box>
                      <Typography>Two-Handed</Typography>
                      <Typography>{props.data.scraps[2].twoHanded ? 'Yes' : 'No'}</Typography>
                    </Box>
                    <Box>
                      <Typography>Conductive</Typography>
                      <Typography>{props.data.scraps[2].conductive ? 'Yes' : 'No'}</Typography>
                    </Box>
                    <Box>
                      <Typography>Grabbed</Typography>
                      <Typography>{props.data.scraps[2].grabbed ? 'Yes' : 'No'}</Typography>
                    </Box>
                  </Stack>
                  <Divider></Divider>
                </Box> 
              : 
                ""
              }
              <Stack direction='row' spacing={2}>
                {props.data.scraps.map((scrap, index) => {
                  return (
                    index === 2 ? "" :
                    <Box width='50%' key={index}>
                      <Typography color={scrap.color} textAlign='center'><b>{scrap.name}</b></Typography>
                      <Stack direction='row' justifyContent='space-between'>
                        <Typography textAlign='left'>Value</Typography>
                        <Typography>{scrap.value}</Typography>
                      </Stack>
                      <Stack direction='row' justifyContent='space-between'>
                        <Typography textAlign='left'>Weight</Typography>
                        <Typography>{scrap.weight}</Typography>
                      </Stack>
                      <Stack direction='row' justifyContent='space-between'>
                        <Typography>Two-Handed</Typography>
                        <Typography>{scrap.twoHanded ? 'Yes' : 'No'}</Typography>
                      </Stack>
                      <Stack direction='row' justifyContent='space-between'>
                        <Typography>Conductive</Typography>
                        <Typography>{scrap.conductive ? 'Yes' : 'No'}</Typography>
                      </Stack>
                      <Stack direction='row' justifyContent='space-between'>
                        <Typography>Grabbed</Typography>
                        <Typography>{scrap.grabbed ? 'Yes' : 'No'}</Typography>
                      </Stack>
                    </Box>
                  )
                })}
              </Stack>
            </Box>
          }
        </Box>
      :
        <Box>
           <br />
           <Divider />
           <Typography>No scrap present</Typography>
        </Box>
      }
    </Card>
  )
}
