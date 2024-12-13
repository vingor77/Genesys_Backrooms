import { Box, Button, Card, Chip, Divider, Modal, Stack, Typography } from "@mui/material";

export default function PhenomenonItem(props) {
  return (
    <Card variant="outlined" sx={{width: {xs: '100%', md: '400px'}, textAlign: 'center', border: '1px solid black', overflow: 'auto', height: '350px'}}>
      <Box sx={{ p: 2 }}>
        <Stack direction='row' justifyContent="space-between" alignItems="center">
            <Typography variant="h4">{props.currPhenomenon.name}</Typography>
            <Chip label={"Type: " + props.currPhenomenon.type} />
        </Stack>

        <Typography>{props.currPhenomenon.description}</Typography>
        <br />
        <Divider />
        <br />
        <Typography>{props.currPhenomenon.effect}</Typography>
      </Box>
    </Card>
  )
}