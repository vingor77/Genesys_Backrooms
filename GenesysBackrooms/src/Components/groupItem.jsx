import { Box, Card, Divider, Stack, Typography } from "@mui/material";

export default function GroupItem(props) {
  const bad = [];
  const neutral = [];
  const good = [];

  for(let i = 0; i < props.currGroup.relations.length; i++) {
    switch(props.currGroup.relations[i].split(':')[1]) {
      case '1':
      case '2':
        bad.push(props.currGroup.relations[i].split(':')[0]);
        break;
      case '3':
        neutral.push(props.currGroup.relations[i].split(':')[0]);
        break;
      case '4':
      case '5':
        good.push(props.currGroup.relations[i].split(':')[0]);
        break;
    }
  }

  return (
    <Card variant="outlined" sx={{width: {xs: '100%', md: '600px'}, textAlign: 'center', border: '1px solid black', overflow: 'auto', height: '600px'}}>
      <Box sx={{ p: 2 }}>
        <Typography><b>{props.currGroup.name} ({props.currGroup.shortName})</b></Typography>
        <br />
        <Divider>Who we are</Divider>
        <br />
        <Typography textAlign='left'>{props.currGroup.description}</Typography>
        <br />
        <Divider>Our purpose</Divider>
        <br />
        <Typography textAlign='left'>{props.currGroup.purpose}</Typography>
        <br />
        <Divider>Our relations</Divider>
        <br />
        <Typography textAlign='left'><b>Do not interact</b></Typography>
        <Stack direction='row' spacing={1}>
          {bad.length === 0 ? <Typography>None</Typography> :
            bad.map((group) => {
              return <Typography textAlign='left'>{group}</Typography>
            })
          }
        </Stack>
        <br />
        <Typography textAlign='left'><b>Neutral</b></Typography>
        <Stack direction='row' gap={1} flexWrap='wrap'>
          {neutral.length === 0 ? <Typography>None</Typography> :
            neutral.map((group) => {
              return <Typography textAlign='left'>{group}</Typography>
            })
          }
        </Stack>
        <br />
        <Typography textAlign='left'><b>Our partners</b></Typography>
        <Stack direction='row' spacing={1}>
          {good.length === 0 ? <Typography>None</Typography> :
            good.map((group) => {
              return <Typography textAlign='left'>{group}</Typography>
            })
          }
        </Stack>
      </Box>
    </Card>
  )
}