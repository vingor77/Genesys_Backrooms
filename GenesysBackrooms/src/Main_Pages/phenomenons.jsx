import { Box, Button, FormControl, Input, InputLabel, MenuItem, Select, Stack, Toolbar, Typography } from "@mui/material";
import { collection, doc, onSnapshot, orderBy, query, setDoc } from "firebase/firestore";
import db from '../Components/firebase';
import NotLoggedIn from "../Components/notLoggedIn";
import { useState } from "react";
import PhenomenonItem from "../Components/phenomenonItem";

export default function Phenomenons() {
  const [phenomena, setPhenomena] = useState([]);
  const [name, setName] = useState('');
  const [type, setType] = useState('All');

  const getFromDB = () => {
    const q = query(collection(db, 'Phenomena'), orderBy("name", "asc"));

    const unsub = onSnapshot(q, (querySnapshot) => {
      const queryData = [];
      querySnapshot.forEach((doc) => {
        queryData.push(doc.data());
      })
      setPhenomena(queryData);
    })

    return () => {
      unsub();
    }
  }

  const DisplayItems = () => {
    let empty = true;

    return (
      <Stack direction='row' flexWrap='wrap' gap={1}>
        {phenomena.map((item) => {
          if(
            (item.type === type || type === 'All') &&
            (item.name.toUpperCase().includes(name.toUpperCase()) || name === '')
          ) {
            empty = false;
            return <PhenomenonItem currPhenomenon={item}/>
          }
        })}
        {empty ? <Typography>There are no phenomena that match your criteria.</Typography> : ""}
      </Stack>
    )
  }

  return (
    localStorage.getItem("loggedIn") === 'false' ? <NotLoggedIn /> :
      <Box>
        {phenomena.length > 0 ?
          <Box>
            <Stack direction={{xs: 'column', md: 'row'}} spacing={2} flexWrap='wrap' gap={1} paddingBottom={2}>
              <Box>
                <Input value={name} onChange={e => setName(e.target.value)} placeholder='Enter Name'></Input>
              </Box>
              <FormControl sx={{minWidth: 150}}>
                <InputLabel id="type">Select Type</InputLabel>
                <Select
                  labelId='type'
                  label={"Select Type"}
                  onChange={e => setType(e.target.value)}
                  value={type}
                >
                  <MenuItem value='All'>Any</MenuItem>
                  <MenuItem value='Environmental'>Environmental</MenuItem>
                  <MenuItem value='Physical'>Physical</MenuItem>
                  <MenuItem value='Mental'>Mental</MenuItem>
                </Select>
              </FormControl>
            </Stack>
            <DisplayItems />
          </Box>
        :
          getFromDB()
        }
      </Box>
  )
}