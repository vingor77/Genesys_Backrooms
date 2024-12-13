import { Box, Button, Card, Chip, Divider, Modal, Stack, Typography } from "@mui/material";
import { useState } from "react";

export default function Craft(props) {
  const components = props.currCraft.components.split("/").join(", ");
  const skills = props.currCraft.skills.split("/").join(", ");

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

      </Box>
    </Card>
  )
}