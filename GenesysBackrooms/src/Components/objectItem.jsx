import { Box, Button, Card, Chip, Modal, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { doc, setDoc } from "firebase/firestore";
import db from '../Components/firebase';
import { useState } from "react";

export default function ObjectItem(props) {
  const [tableShown, setTableShown] = useState(false);

  const changeVisibility = () => {
    setDoc(doc(db, 'Objects', props.currObject.name), {
      description: props.currObject.description,
      encumbrance: props.currObject.encumbrance,
      name: props.currObject.name,
      objectNumber: props.currObject.objectNumber,
      price: props.currObject.price,
      rarity: props.currObject.rarity,
      spawnLocations: props.currObject.spawnLocations,
      table: props.currObject.table,
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
        <Modal
          open={tableShown}
          onClose={() => setTableShown(false)}
          aria-labelledby="table"
          aria-describedby="tableDescription"
        >
          <Box sx={{position: "absolute", top: '50%', left: '50%', width: 550, bgcolor: 'background.paper', padding: 1, transform: 'translate(-50%, -50%)', maxHeight: '900px', overflow: 'auto'}}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  {innerKeys.map((key) => {
                    return (
                      <TableCell>{key}</TableCell>
                    )
                  })}
                </TableRow>
              </TableHead>
              <TableBody>
                {keys.map((key, index) => {
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
                })}
              </TableBody>
            </Table>
          </Box>
        </Modal>
      </Box>
    )
  }

  return (
    <Card variant="outlined" sx={{width: {xs: '100%', md: '400px'}, textAlign: 'center', border: '1px solid black', overflow: 'auto', height: '350px'}}>
      <Box sx={{ p: 2 }}>
        <Typography gutterBottom variant="h5">{props.currObject.name}</Typography>
        <Box>
          <Chip label={'Object: ' + props.currObject.objectNumber}/>
          <Chip label={'Rarity: ' + props.currObject.rarity}/>
          <Chip label={'Price: ' + props.currObject.price}/>
          <Chip label={'Encumbrance: ' + props.currObject.encumbrance}/>
          <Typography variant="body2" textAlign='justify' marginLeft={1}>{props.currObject.description}</Typography>
        </Box>

        <Stack direction='row'>
          <Typography>Spawn locations:</Typography>
          {props.currObject.spawnLocations.map((location) => {
            return (
              <Chip label={location}/>
            )
          })}
        </Stack>

        <Stack direction='row' justifyContent="space-between" alignItems="center">
          {props.currObject.table !== 'No' ?
            <Button size="small" onClick={() => setTableShown(true)}>Show table</Button>
          :
            ""
          }
          {props.mainPage ?
            props.currObject.shownToPlayer ?
              <Button size="small" onClick={changeVisibility}>Hide from player</Button>
            :
              <Button size="small" onClick={changeVisibility}>Show to player</Button>
          :
            ""
          }
        </Stack>
        <ShowTable />
      </Box>
    </Card>
  )
}