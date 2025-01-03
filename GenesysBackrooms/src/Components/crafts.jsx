import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Card, Chip, Dialog, Divider, Modal, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import db from '../Components/firebase';
import { doc, updateDoc } from "firebase/firestore";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useState } from "react";

export default function Craft(props) {
  const [open, setOpen] = useState(false);
  const components = props.currCraft.components.split("/").join(", ");
  const skills = props.currCraft.skills.split("/").join(", ");
  const material = props.currCraft.dynamicMaterial.split('/');

  const flipHidden = () => {
    updateDoc(doc(db, 'Crafts', props.currCraft.name), {
      hidden: props.currCraft.hidden === 'Yes' ? 'No' : 'Yes'
    })
  }

  return (
    <Card variant="outlined" sx={{width: {xs: '100%', md: '400px'}, textAlign: 'center', border: '1px solid black', overflow: 'auto', height: '400px'}}>
      <Box sx={{ p: 2 }}>
        <Typography variant="h4">{props.currCraft.name}</Typography>
        <Stack direction='row' justifyContent="space-between" alignItems="center">
          <Chip label={"Difficulty: " + props.currCraft.difficulty} />
          <Chip label={"Attempts: " + props.currCraft.attempts} />
        </Stack>
        <Typography>{props.currCraft.description}</Typography>
        <br />
        <Divider />
        <br />
        <Typography textAlign='left'><b>Components:</b> {components}</Typography>
        <Typography textAlign='left'><b>Skills:</b> {skills}</Typography>
        <Stack direction='row' justifyContent='space-around'>
          {localStorage.getItem('loggedIn').toUpperCase() === 'ADMIN' ? props.currCraft.hidden === 'Yes' ? <Button onClick={flipHidden} variant="outlined">Show Craft</Button> : <Button onClick={flipHidden} variant="outlined">Hide Craft</Button> : ""}
          {props.currCraft.dynamicMaterial === 'None' ? "" : <Button onClick={() => setOpen(true)} variant="outlined">Show Dynamic Materials</Button>}
        </Stack>
        <Dialog open={open} onClose={() => setOpen(false)}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Effect</TableCell>
                <TableCell>Difficulty</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {material.map((mat, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell>{mat.split('!')[0]}</TableCell>
                    <TableCell>{mat.split('!')[1]}</TableCell>
                    <TableCell>{mat.split('!')[2]}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </Dialog>
      </Box>
    </Card>
  )
}