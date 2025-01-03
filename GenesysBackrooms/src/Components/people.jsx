import { Box, Button, Card, Chip, Divider, Modal, Stack, Typography } from "@mui/material";
import db from '../Components/firebase';
import { doc, updateDoc } from "firebase/firestore";

export default function People(props) {
  const flipHidden = () => {
    updateDoc(doc(db, 'PeopleOfInterest', props.currPerson.name), {
      hidden: props.currPerson.hidden === 'Yes' ? 'No' : 'Yes'
    })
  }
console.log(props.currPerson);
  return (
    <Card variant="outlined" sx={{width: {xs: '100%', md: '500px'}, textAlign: 'center', border: '1px solid black', overflow: 'auto', height: '550px'}}>
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
        <br />
        <Divider />
        <br />
        <Typography textAlign='left'><b>Associated with:</b> {props.currPerson.associatedGroup}</Typography>
        {localStorage.getItem('loggedIn').toUpperCase() === 'ADMIN' ? props.currPerson.hidden === 'Yes' ? <Button onClick={flipHidden} variant="outlined">Show Person</Button> : <Button onClick={flipHidden} variant="outlined">Hide Person</Button> : ""}
      </Box>
    </Card>
  )
}