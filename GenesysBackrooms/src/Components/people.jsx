import { Box, Button, Card, Chip, Divider, Modal, Stack, Typography } from "@mui/material";

export default function People(props) {
  return (
    <Card variant="outlined" sx={{width: {xs: '100%', md: '500px'}, textAlign: 'center', border: '1px solid black', overflow: 'auto', height: '500px'}}>
      <Box sx={{ p: 2 }}>
        <Typography variant="h4">{props.currPerson.name}</Typography>
        <Typography textAlign='left'><b>Introduction:</b> {props.currPerson.introduction}</Typography>
        <br />
        <Divider />
        <br />
        <Typography textAlign='left'><b>Reason for interest:</b> {props.currPerson.reason}</Typography>
        <br />
        <Divider />
        <br />
        <Typography textAlign='left'><b>Personality:</b> {props.currPerson.personality}</Typography>
      </Box>
    </Card>
  )
}