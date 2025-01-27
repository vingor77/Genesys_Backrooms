import { Box, Card, Chip, Divider, Icon, Stack, Tooltip, Typography } from "@mui/material";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

export default function PhenomenonItem(props) {
  const descriptionSegments = props.currPhenomenon.description.split('/');
  const effectSegments = props.currPhenomenon.effect.split('/');

  return (
    <Card variant="outlined" sx={{width: {xs: '100%', md: '400px'}, textAlign: 'center', border: '1px solid black', overflow: 'auto', height: '350px'}}>
      <Box sx={{ p: 2 }}>
        <Stack direction='row' justifyContent="space-between" alignItems="center">
        <Typography variant="h4">{props.currPhenomenon.name}</Typography>
        <Tooltip title={props.currPhenomenon.notes} enterTouchDelay={10} sx={{fontSize: 24}}>
          <MoreHorizIcon />
        </Tooltip>
        </Stack>
        <Stack direction='row' justifyContent="space-between" alignItems="center">
            <Chip label={"Type: " + props.currPhenomenon.type} />
            <Chip label={"Size: " + props.currPhenomenon.size} />
        </Stack>
        <Stack>
          {descriptionSegments.map((segment, index) => {
            return ( 
            <Box key={index}>
              <Typography textAlign='left'>{index > 0 ? <b>{segment.split(':')[0]}:</b> : segment.split(':')[0]} {segment.split(':')[1]}</Typography>
              <br />
            </Box>
            )
          })}
        </Stack>
        <Divider>Effects</Divider>
        <br />
        {effectSegments.map((segment, index) => {
          return ( 
          <Box key={index}>
            <Typography textAlign='left'>{effectSegments.length > 1 ? <b>{segment.split(':')[0]}:</b> : segment.split(':')[0]} {segment.split(':')[1]}</Typography>
            <br />
          </Box>
          )
        })}
      </Box>
    </Card>
  )
}