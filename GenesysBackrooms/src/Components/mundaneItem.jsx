import { Box, Card, Chip, Stack, Typography } from "@mui/material";

export default function MundaneItem(props) {
  const usedBy = props.currMundane.usedBy.split("/").join(", ");
  console.log(props);

  return (
    <Card variant="outlined" sx={{width: {xs: '100%', md: '400px'}, textAlign: 'center', border: '1px solid black', overflow: 'auto', height: '350px'}}>
      <Box sx={{ p: 2 }}>
        <Stack direction='row' justifyContent="space-between" alignItems="center">
          <Chip label={"Rarity: " + props.currMundane.rarity}></Chip>
          <Typography variant="h5">{props.currMundane.name}</Typography>
          <Chip label={"Price: " + props.currMundane.price}></Chip>
        </Stack>
        <Typography>{props.currMundane.description}</Typography>
        <Typography textAlign='left'>Used by: {usedBy}</Typography>
      </Box>
    </Card>
  )
}