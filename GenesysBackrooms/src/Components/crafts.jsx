import { Box, Button, Card, Chip, Dialog, Divider, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import db from '../Components/firebase';
import { doc, updateDoc } from "firebase/firestore";
import { useState } from "react";

export default function Craft(props) {
  const materials = props.currCraft.dynamicMaterial.split('/');
  const difficulties = props.currCraft.difficultyModifier.split('/');
  const attempts = props.currCraft.attemptsModifier.split('/');
  const effects = props.currCraft.dynamicEffect.split('/');
  const [open, setOpen] = useState(false);

  const flipHidden = () => {
    updateDoc(doc(db, 'Crafts', props.currCraft.name), {
      hidden: props.currCraft.hidden === 'Yes' ? 'No' : 'Yes'
    })
  }

  const DisplayEffect = () => {
    return (
      <Dialog open={open} onClose={() => setOpen(false)}>
        <Box padding={2}>
          <Typography textAlign='center' variant="h4">{props.currCraft.name}</Typography>
          {materials.map((mat, index) => {
            return (
              <Box>
                <Typography><b>{mat}:</b> {effects[index]}</Typography>
                <br />
              </Box>
            )
          })}
        </Box>
      </Dialog>
    )
  }

  return (
    <Card variant="outlined" sx={{width: {xs: '100%', md: '400px'}, textAlign: 'center', border: '1px solid black', overflow: 'auto', height: '400px'}}>
      <Box sx={{ p: 2 }}>
        <Typography variant="h4">{props.currCraft.name}</Typography>
        <Stack direction='row' justifyContent="space-between" alignItems="center">
          <Chip label={"Base Difficulty: " + props.currCraft.baseDifficulty} />
          <Chip label={"Base Attempts: " + props.currCraft.baseAttempts} />
        </Stack>
        <br />
        <Box>
          <Divider>Components</Divider>
          <Stack justifyContent='space-evenly'>
            {props.currCraft.components.split('/').map((component, index) => {
              return <Typography key={index} textAlign='left'><b>{index + 1}:</b> {component}</Typography>
            })}
          </Stack>
        </Box>
        <br />
        <Box>
          <Divider>Skills:</Divider>
          <Stack justifyContent='space-evenly'>
            {props.currCraft.skills.split('/').map((skill, index) => {
              return <Typography key={index} textAlign='left'><b>{index + 1}:</b> {skill}</Typography>
            })}
          </Stack>
        </Box>
        <br />
        {props.currCraft.dynamicMaterial === 'None' || props.currCraft.difficultyModifier === undefined ? "" :
          <Box>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><b>Name</b></TableCell>
                  <TableCell><b>Difficulty</b></TableCell>
                  <TableCell><b>Attempts</b></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {materials.map((mat, index) => {
                  return (
                    <TableRow key={index}>
                      <TableCell>{mat}</TableCell>
                      <TableCell>{difficulties[index]}</TableCell>
                      <TableCell>{attempts[index]}</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
            <Button onClick={() => setOpen(true)} variant="outlined">Reveal Effects</Button>
            <DisplayEffect />
          </Box>
        }
        <Stack direction='row' justifyContent='space-around'>
          {localStorage.getItem('loggedIn').toUpperCase() === 'ADMIN' ? props.currCraft.hidden === 'Yes' ? <Button onClick={flipHidden} variant="outlined">Show Craft</Button> : <Button onClick={flipHidden} variant="outlined">Hide Craft</Button> : ""}
        </Stack>
      </Box>
    </Card>
  )
}