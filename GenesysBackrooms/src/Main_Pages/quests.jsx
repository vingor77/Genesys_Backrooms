import { Box, Button, FormControl, Input, InputLabel, Menu, MenuItem, Select, Stack, Typography } from "@mui/material";
import NotLoggedIn from "../Components/notLoggedIn";
import { collection, doc, onSnapshot, orderBy, query, setDoc } from "firebase/firestore";
import { useState } from "react";
import QuestItem from "../Components/questItem";
import db from '../Components/firebase';

export default function Quests() {
  const [quests, setQuests] = useState([]);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [acquisition, setAcquisition] = useState('');
  const [questLine, setQuestLine] = useState('None');

  const data = [{"name":"Introduction","questGiver":"None","turnInLocation":"Trader's Keep","description":"Arrive at the Trader's Keep and speak with The Keeper","rewards":"4 Weapons/4 Armor/4 Gray Almond Water/A compass","completed":"No","hidden":"No","acquisition":"None","questLine":"Starter"},
    {"name":"Introduction2","questGiver":"None","turnInLocation":"Trader's Keep","description":"Arrive at the Trader's Keep and speak with The Keeper","rewards":"4 Weapons/4 Armor/4 Gray Almond Water/A compass","completed":"No","hidden":"No","acquisition":"None","questLine":"Starter 2"}]

  const addData = () => {
    for(let i = 0; i < data.length; i++) {
      setDoc(doc(db, 'Quests', data[i].name), {
        name: data[i].name,
        questGiver: data[i].questGiver,
        turnInLocation: data[i].turnInLocation,
        description: data[i].description,
        rewards: data[i].rewards,
        completed: data[i].completed,
        hidden: data[i].hidden,
        acquisition: data[i].acquisition,
        questLine: data[i].questLine
      })
    }
  }

  const getFromDB = () => {
    const q = query(collection(db, 'Quests'), orderBy("questLine", "asc"));

    const unsub = onSnapshot(q, (querySnapshot) => {
      const queryData = [];
      querySnapshot.forEach((doc) => {
        queryData.push(doc.data());
      })
      setQuests(queryData);
    })

    return () => {
      unsub();
    }
  }

  const DisplayItems = () => {
    let empty = true;

    return (
      <Stack direction='row' flexWrap='wrap' gap={1}>
        {quests.map((item) => {
          if(
            (item.hidden === 'No' || localStorage.getItem('loggedIn').toUpperCase() === 'ADMIN') &&
            (item.name.toUpperCase().includes(name.toUpperCase()) || name === '') &&
            (item.turnInLocation.toUpperCase().includes(location.toUpperCase()) || location === '') &&
            (item.acquisition.toUpperCase().includes(acquisition.toUpperCase()) || acquisition === '') &&
            (item.questLine === questLine || questLine === 'None')
          ) {
            empty = false;
            return <QuestItem currQuest={item}/>
          }
        })}
        {empty ? <Typography>There are no quests that match your criteria.</Typography> : ""}
      </Stack>
    )
  }

  const getQuestLines = () => {
    const questLines = new Map();

    for(let i = 0; i < quests.length; i++) {
      let addNew = 0;
      questLines.forEach((_, key) => {
        if(quests[i].questLine === key) {
          questLines.set(key, '')
        } 
        addNew++;
      })
      if(addNew === questLines.size) questLines.set(quests[i].questLine, '');
      addNew = 0;
    }

    const keys = [];

    questLines.forEach((_, key) => {
      keys.push(key);
    })

    return keys;
  }

  return (
    localStorage.getItem("loggedIn") === 'false' ? <NotLoggedIn /> :
      <Box>
      <Button onClick={addData}>Add</Button>
        {quests.length > 0 ? 
          <Box>
            <Stack direction={{xs: 'column', md: 'row'}} spacing={2} flexWrap='wrap' gap={1} paddingBottom={2}>
              <Box>
                <Input value={name} onChange={e => setName(e.target.value)} placeholder='Enter Name'></Input>
              </Box>
              <Box>
                <Input value={location} onChange={e => setLocation(e.target.value)} placeholder='Enter Turn in Location'></Input>
              </Box>
              <Box>
                <Input value={acquisition} onChange={e => setAcquisition(e.target.value)} placeholder='Enter Acquisition Location'></Input>
              </Box>
              <FormControl sx={{minWidth: 150}}>
                <InputLabel id="questLine">Select Quest Line</InputLabel>
                <Select
                  labelId='questLine'
                  label={"Select Quest Line"}
                  onChange={e => setQuestLine(e.target.value)}
                  value={questLine}
                >
                  <MenuItem value='None'>Any</MenuItem>
                  {getQuestLines().map((qLine, index) => {
                    return <MenuItem value={qLine} key={index}>{qLine}</MenuItem>
                  })}
                </Select>
              </FormControl>
            </Stack>
            <br />
            <DisplayItems />
          </Box>
        :
          getFromDB()
        }
      </Box>
  )
}