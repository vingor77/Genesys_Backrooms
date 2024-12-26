import { Box, Button, Card, Chip, Stack, Typography } from "@mui/material";
import { doc, updateDoc } from "firebase/firestore";
import db from '../Components/firebase';

export default function MundaneItem(props) {
  const usedBy = props.currMundane.usedBy.split("/").join(", ");
  
  const flipHidden = () => {
    updateDoc(doc(db, 'MundaneObjects', props.currMundane.name), {
      hidden: props.currMundane.hidden === 'Yes' ? 'No' : 'Yes'
    })
  }

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
        {localStorage.getItem('loggedIn').toUpperCase() === 'ADMIN' ? props.currMundane.hidden === 'Yes' ? <Button onClick={flipHidden} variant="outlined">Show Object</Button> : <Button onClick={flipHidden} variant="outlined">Hide Object</Button> : ""}
      </Box>
    </Card>
  )
}