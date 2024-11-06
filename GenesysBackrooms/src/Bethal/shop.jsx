import { Box, Button, Dialog, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { useState } from "react";

export default function Shop(props) {
  const [open, setOpen] = useState(false);

  return (
    <Box>
      <Button variant="outlined" onClick={() => setOpen(true)}>Display shop</Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{fontWeight: 'bold'}}>Name</TableCell>
              <TableCell sx={{fontWeight: 'bold'}}>Price</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.static.map((item) => {
              return (
                <TableRow>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.price}</TableCell>
                </TableRow>
              )
            })}
            {props.variable.map((item) => {
              return (
                item.shown ?
                  <TableRow>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.price}</TableCell>
                  </TableRow>
                :
                  ""
              )
            })}
          </TableBody>
        </Table>
      </Dialog>
    </Box>
  )
}