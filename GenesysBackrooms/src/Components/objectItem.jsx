import { Box, Button, Card, Chip, Dialog, Divider, Modal, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import db from '../Components/firebase';
import { useState } from "react";

export default function ObjectItem(props) {
  const [tableShown, setTableShown] = useState(false);
  const spawns = props.currObject.spawnLocations.join(', ');

  const changeVisibility = () => {
    updateDoc(doc(db, 'Objects', props.currObject.name), {
      shownToPlayer: !props.currObject.shownToPlayer
    })
  }

  const ShowTable = () => {
    if(props.currObject.table === 'No') return;

    const tableData = JSON.parse(props.currObject.table);
    const keys = Object.keys(tableData);
    let innerKeys = Object.keys(tableData[keys[0]]);

    return (
      <Box>
        <Dialog
          open={tableShown}
          onClose={() => setTableShown(false)}
        >
          <Box>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  {props.currObject.name === 'Tarot Deck' ?
                    <TableCell>Effect</TableCell>
                  :
                    innerKeys.map((key) => {
                      return (
                        <TableCell>{key}</TableCell>
                      )
                    })
                  }
                </TableRow>
              </TableHead>
              <TableBody>
                {props.currObject.name === 'Tarot Deck' ?
                  Object.keys(tableData).map((_, index) => {
                    return (
                      <TableRow key={index}>
                        <TableCell>{keys[index]}</TableCell>
                        <TableCell>{tableData[keys[index]]}</TableCell>
                      </TableRow>
                    )
                  })
                :
                  keys.map((key, index) => {
                    return (
                      <TableRow>
                        <TableCell>{key}</TableCell>
                        {Object.keys(tableData[keys[index]]).map((k, index2) => {
                          return (
                            <>
                              <TableCell>{tableData[keys[index]][Object.keys(tableData[keys[index]])[index2]]}</TableCell>
                            </>
                          )
                        })}
                      </TableRow>
                    )
                  })
                }
              </TableBody>
            </Table>
          </Box>
        </Dialog>
      </Box>
    )
  }

  return (
    <Card variant="outlined" sx={{width: {xs: '100%', md: '400px'}, textAlign: 'center', border: '1px solid black', overflow: 'auto', height: '450px'}}>
      <Box sx={{ p: 2 }}>
        <Typography gutterBottom variant="h5">{props.currObject.name}</Typography>
        <Box>
          <Chip label={'Object: ' + props.currObject.objectNumber}/>
          <Chip label={'Rarity: ' + props.currObject.rarity}/>
          <Chip label={'Price: ' + props.currObject.price}/>
          <Chip label={'Encumbrance: ' + props.currObject.encumbrance}/>
          <br /><br />
          <Divider />
          <br />
          <Typography variant="body2" textAlign='justify' marginLeft={1}>{props.currObject.description}</Typography>
        </Box>
        <br />
        <Stack direction='row' justifyContent="space-around">
          {props.currObject.table !== 'No' ? <Button size="small" onClick={() => setTableShown(true)} variant="outlined">Show table</Button> : ""}
          {localStorage.getItem('loggedIn').toUpperCase() === 'ADMIN' && props.currObject.shownToPlayer ?
            <Button size="small" onClick={changeVisibility} variant="outlined">Hide Object</Button>
          :
            <Button size="small" onClick={changeVisibility} variant="outlined">Show Object</Button>
          }
        </Stack>
        <ShowTable />
      </Box>
    </Card>
  )
}