import { Box, Button, Card, Chip, Divider, Modal, Stack, Typography } from "@mui/material";
import { useState } from "react";
import db from '../Components/firebase';
import { doc, setDoc, updateDoc } from "firebase/firestore";

export default function QuestItem(props) {
  const rewards = props.currQuest.rewards.split("/").join(", ");

  const flipComplete = () => {
    updateDoc(doc(db, 'Quests', props.currQuest.name), {
      completed: props.currQuest.completed === 'Yes' ? 'No' : 'Yes'
    })
  }

  const flipHidden = () => {
    updateDoc(doc(db, 'Quests', props.currQuest.name), {
      hidden: props.currQuest.hidden === 'Yes' ? "No" : "Yes"
    })
  }

  return (
    <Card variant="outlined" sx={{width: {xs: '100%', md: '400px'}, textAlign: 'center', border: props.currQuest.completed === 'Yes' ? "2px solid green" : "2px solid red", overflow: 'auto', height: '400px'}}>
      <Box sx={{ p: 2 }}>
        <Stack direction='row' justifyContent='space-between'>
          <Typography variant="h4">{props.currQuest.name}</Typography>
          <Chip label={props.currQuest.questLine} />
        </Stack>
        <Typography textAlign='left'>{props.currQuest.description}</Typography>
        <br />
        <Divider />
        {props.currQuest.acquisition === 'None' ?
          <Typography textAlign='left'>This quest is automatically acquired</Typography>
        :
          <Typography textAlign='left'>Acquired from {props.currQuest.questGiver} in {props.currQuest.acquisition}</Typography>
        }
        <br />
        <Divider />
        <Typography textAlign='left'><b>Turn in location: </b> {props.currQuest.turnInLocation}</Typography>
        <br />
        <Divider />
        <Typography textAlign='left'><b>Rewards:</b> {rewards}</Typography>
        <br />
        <Typography>Quest status: {props.currQuest.completed === 'Yes' ? "Complete" : "Incomplete"}</Typography>
        <Stack direction='row' justifyContent='space-between'>
          {localStorage.getItem('loggedIn').toUpperCase() === 'ADMIN' ? props.currQuest.completed === 'Yes' ? <Button variant="outlined" onClick={flipComplete}>Mark Quest Incomplete</Button> : <Button variant="outlined" onClick={flipComplete}>Mark Quest Complete</Button> : ""}
          {localStorage.getItem('loggedIn').toUpperCase() === 'ADMIN' ? props.currQuest.hidden === 'Yes' ? <Button variant="outlined" onClick={flipHidden}>Show Quest</Button> : <Button variant="outlined" onClick={flipHidden}>Hide Quest</Button> : ""}
        </Stack>
      </Box>
    </Card>
  )
}