import { Box, Button, Card, Chip, Divider, Modal, Stack, Typography } from "@mui/material";
import db from '../Components/firebase';
import { doc, setDoc } from "firebase/firestore";

export default function Craft(props) {
  const components = props.currCraft.components.split("/").join(", ");
  const skills = props.currCraft.skills.split("/").join(", ");

  const flipHidden = () => {
    setDoc(doc(db, 'Crafts', props.currCraft.name), {
      name: props.currCraft.name,
      components: props.currCraft.components,
      skills: props.currCraft.skills,
      difficulty: props.currCraft.difficulty,
      tier: props.currCraft.tier,
      attempts: props.currCraft.attempts,
      description: props.currCraft.description,
      hidden: props.currCraft.hidden === 'Yes' ? 'No' : 'Yes'
    })
  }

  return (
    <Card variant="outlined" sx={{width: {xs: '100%', md: '400px'}, textAlign: 'center', border: '1px solid black', overflow: 'auto', height: '350px'}}>
      <Box sx={{ p: 2 }}>
        <Typography variant="h4">{props.currCraft.name}</Typography>
        <Stack direction='row' justifyContent="space-between" alignItems="center">
          <Chip label={"Difficulty: " + props.currCraft.difficulty} />
          <Chip label={"Tier: " + props.currCraft.tier} />
          <Chip label={"Attempts: " + props.currCraft.attempts} />
        </Stack>
        <Typography>{props.currCraft.description}</Typography>
        <br />
        <Divider />
        <br />
        <Typography textAlign='left'><b>Components:</b> {components}</Typography>
        <Typography textAlign='left'><b>Skills:</b> {skills}</Typography>
        {localStorage.getItem('loggedIn').toUpperCase() === 'ADMIN' ? props.currCraft.hidden === 'Yes' ? <Button onClick={flipHidden} variant="outlined">Show Craft</Button> : <Button onClick={flipHidden} variant="outlined">Hide Craft</Button> : ""}
      </Box>
    </Card>
  )
}