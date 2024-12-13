import { Box, Button, Card, Chip, Divider, Modal, Stack, Typography } from "@mui/material";
import { useState } from "react";

export default function QuestItem(props) {
  const rewards = props.currQuest.rewards.split("/").join(", ");

  return (
    <Card variant="outlined" sx={{width: {xs: '100%', md: '400px'}, textAlign: 'center', border: '1px solid black', overflow: 'auto', height: '350px'}}>
      <Box sx={{ p: 2 }}>
        <Typography variant="h4">{props.currQuest.name}</Typography>
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
      </Box>
    </Card>
  )
}