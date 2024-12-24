import { Box, Button, Card, Divider, Drawer, MenuItem, Select, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import NotLoggedIn from "../Components/notLoggedIn";
import { useState } from "react";
import { collection, doc, onSnapshot, orderBy, query, setDoc, where } from "firebase/firestore";
import db from '../Components/firebase';
import QuestItem from '../Components/questItem';

export default function Outposts() {
  const [outposts, setOutposts] = useState([]);
  const [quests, setQuests] = useState([]);
  const [tabValue, setTabValue] = useState('Alpha');
  const [selectedGroup, setSelectedGroup] = useState('None');

  const data = [{"name":"A1","description":null,"level":271,"group":"Backrooms Robotics","amenities":null},
    {"name":"A2","description":null,"level":271,"group":"Backrooms Robotics","amenities":null},
    {"name":"Skyscraper","description":null,"level":522,"group":"Backrooms Robotics","amenities":null},
    {"name":"Trader's Keep","description":null,"level":1,"group":"The Backrooms Non-Aligned Trade Group","amenities":null},
    {"name":"Office Space EL3A","description":null,"level":2,"group":"The Backrooms Non-Aligned Trade Group","amenities":null},
    {"name":"Trader's Guild","description":null,"level":230,"group":"The Backrooms Non-Aligned Trade Group","amenities":null},
    {"name":"Recourse Station","description":null,"level":10,"group":"The Backrooms Non-Aligned Trade Group","amenities":null},
    {"name":"Resource Extraction Camp","description":null,"level":283,"group":"The Backrooms Non-Aligned Trade Group","amenities":null},
    {"name":"Plastic Mine","description":null,"level":24,"group":"The Backrooms Non-Aligned Trade Group","amenities":null},
    {"name":"Unit 230","description":null,"level":230,"group":"The Backrooms Non-Aligned Trade Group","amenities":null},
    {"name":"The Arena","description":null,"level":998.2,"group":"The Backrooms Non-Aligned Trade Group","amenities":null},
    {"name":"Floor 283","description":null,"level":283,"group":"The Backrooms Non-Aligned Trade Group","amenities":null},
    {"name":"Watchers","description":null,"level":11,"group":"The Eyes of Argos","amenities":null},
    {"name":"Hideout","description":null,"level":11,"group":"The Iron Fist","amenities":null},
    {"name":"Blue Salvation","description":null,"level":3,"group":"The Followers of Jerry","amenities":null},
    {"name":"Jerry's Salvation","description":null,"level":11,"group":"The Followers of Jerry","amenities":null},
    {"name":"Jerry's Winged Travelers","description":null,"level":'The Hub',"group":"The Followers of Jerry","amenities":null},
    {"name":"Jerry's Room","description":null,"level":274,"group":"The Followers of Jerry","amenities":null},
    {"name":"The Institute","description":null,"level":11,"group":"The Kalag Institute","amenities":null},
    {"name":"Alpha","description":null,"level":1,"group":"The Major Explorer Group","amenities":null},
    {"name":"Omega","description":null,"level":4,"group":"The Major Explorer Group","amenities":null},
    {"name":"Gamma","description":null,"level":3,"group":"The Major Explorer Group","amenities":null},
    {"name":"Beta","description":null,"level":11,"group":"The Major Explorer Group","amenities":null},
    {"name":"Epsilon","description":null,"level":283,"group":"The Major Explorer Group","amenities":null},
    {"name":"Delta","description":null,"level":230,"group":"The Major Explorer Group","amenities":null},
    {"name":"Hollow Nest","description":null,"level":8,"group":"The Major Explorer Group","amenities":null},
    {"name":"Darkness Rangers","description":null,"level":64,"group":"The Major Explorer Group","amenities":null},
    {"name":"De-Aciders","description":null,"level":44,"group":"The Major Explorer Group","amenities":null},
    {"name":"Corridor","description":null,"level":1.1,"group":"The Major Explorer Group","amenities":null},
    {"name":"Frozen City","description":null,"level":159,"group":"The Major Explorer Group","amenities":null},
    {"name":"Station 1","description":null,"level":994,"group":"The Masked Maidens","amenities":null},
    {"name":"Station 2","description":null,"level":67,"group":"The Masked Maidens","amenities":null},
    {"name":"Station 3","description":null,"level":153,"group":"The Masked Maidens","amenities":null},
    {"name":"UEC 76","description":null,"level":76,"group":"The Unbound Explorers Coalition","amenities":null},
    {"name":"UEC 831","description":null,"level":831,"group":"The Unbound Explorers Coalition","amenities":null},
    {"name":"UEC 466","description":null,"level":466,"group":"The Unbound Explorers Coalition","amenities":null},
    {"name":"UEC 502","description":null,"level":502,"group":"The Unbound Explorers Coalition","amenities":null},
    {"name":"General Headquarters","description":null,"level":11,"group":"Backrooms Bureau of Administration and Research","amenities":null},
    {"name":"Institute of Research and Technology","description":null,"level":11,"group":"Backrooms Bureau of Administration and Research","amenities":null},
    {"name":"Main Agency","description":null,"level":11,"group":"The Backrooms Travel Agency","amenities":null},
    {"name":"Secondary Agency","description":null,"level":1,"group":"The Backrooms Travel Agency","amenities":null},
    {"name":"The Hotel Office","description":null,"level":5,"group":"The Backrooms Travel Agency","amenities":null},
    {"name":"The Concrete Office","description":null,"level":162,"group":"The Backrooms Travel Agency","amenities":null},
    {"name":"Astra","description":null,"level":147,"group":"Coalition of Backrooms Survivors","amenities":null},
    {"name":"Tgochi Heaven","description":null,"level":4,"group":"The Completionists","amenities":null},
    {"name":"The Museum","description":null,"level":216,"group":"The Interdimensional Museum of Backrooms History","amenities":null},
    {"name":"VOB Caverns","description":null,"level":181,"group":"The Visionaries of Berry","amenities":null}]

  const addData = () => {
    for(let i = 0; i < data.length; i++) {
      setDoc(doc(db, 'Outposts', data[i].name), {
        name: data[i].name,
        description: data[i].description,
        level: data[i].level,
        group: data[i].group,
        amenities: data[i].amenities
      })
    }
  }

  const getFromDB = () => {
    const q = query(collection(db, 'Outposts'), orderBy("level", "asc"));

    const unsub = onSnapshot(q, (querySnapshot) => {
      const queryData = [];
      querySnapshot.forEach((doc) => {
        queryData.push(doc.data());
      })
      setOutposts(queryData);
    })

    return () => {
      unsub();
    }
  }

  const getQuests = () => {
    const q = query(collection(db, 'Quests'));

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

  const DisplayOutpost = () => {
    return (
      <Card variant="outlined" sx={{textAlign: 'center', border: '1px solid black', overflow: 'auto', height: '700px', padding: 2}}>
        {outposts.map((outpost, index) => {
          if(outpost.name === tabValue) {
            return (
              <Box>
                <Typography variant="h4">{outpost.name}</Typography>
                <Typography>Description</Typography>
                <br />
                <Divider>Amenities</Divider>
                <br />
                <Typography>Amenities (Might have to craft by hand)</Typography>
                <br />
                <Divider>Relevant Quests</Divider>
                <br />
                {quests.length > 0 ? 
                  <Stack direction='row' flexWrap='wrap' gap={1}>
                    {quests.map((item) => {
                      if(item.acquisition === tabValue || item.turnInLocation === tabValue) {
                        return <QuestItem currQuest={item}/>
                      }
                    })}
                  </Stack>
                :
                  getQuests()
                }
              </Box>
            )
          }
        })}
      </Card>
    )
  }

  const SearchOptions = () => {
    const groups = [];

    for(let i = 0; i < outposts.length; i++) {
      if(!groups.includes(outposts[i].group)) groups.push(outposts[i].group);
    }
    
    return (
      <Box padding={2}>
        <Box>
          <Select value={selectedGroup} onChange={e => setSelectedGroup(e.target.value)}>
            <MenuItem value={'None'}>None</MenuItem>
            {groups.map((group, index) => {
              return <MenuItem value={group} key={index}>{group}</MenuItem>
            })}
          </Select>
        </Box>
      </Box>
    )
  }

  const DisplayTable = () => {
    const rows = [];

    for(let i = 0; i < outposts.length; i++) {
      if(outposts[i].group === selectedGroup || selectedGroup === "None") {
        rows.push({
          name: outposts[i].name,
          level: outposts[i].level,
          group: outposts[i].group
        })
      }
    }

    return (
      <TableContainer sx={{maxHeight: '500px'}}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Outpost Name</TableCell>
              <TableCell align="right">Level</TableCell>
              <TableCell align="right">Group</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.name}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row" onClick={() => setTabValue(row.name)}>{row.name}</TableCell>
                <TableCell align="right">{row.level}</TableCell>
                <TableCell align="right">{row.group}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    )
  }

  return (
    localStorage.getItem("loggedIn") === 'false' ? <NotLoggedIn /> :
      <Box padding={2}>
        <Button onClick={addData}>Add</Button>
        {outposts.length > 0 ? 
          <Box>
            <SearchOptions />
            <DisplayTable />
            <br />
            <DisplayOutpost />
          </Box>
        :
          getFromDB()
        }
      </Box>
  )
}

/*
  Major Explorer Group:
    Beta (Level 11) holds the Ouija Board (Object 31).
    Beta (Level 11) has Agrugua Fruit (Object 85) traders.
    Beta (Level 11) has The Everything Machine (Object 97) in it.
    Aries Station (Level 158) has Agrugua Fruit (Object 85) traders.
    Pisces Station (Level 158) has Agrugua Fruit (Object 85) traders.
    Omega (Level 4) has the Object Way-Back Machine (Object 22) in it.
    Epsilon (Level 283) has the Object Tarot Deck (Object 43).

  Backrooms Robotics:
    A1 (Level 271) holds the Reality Lag Machine (Object 86).
    A1 (Level 271) holds the Objects Lamps (Object 8) in it.
    A2 (Level 271) holds the Objects Lamps (Object 8) in it.
    Skyscraper (Level 522) holds the Objects Lamps (Object 8) in it.
  
  Visionaries of Berry:
    Cat Post (Level 181) holds Berry's Necklace (Custom Object).
  
  Followers of Jerry:
    Blue Salvation (Level 3) holds Jerry's Feather (Custom Object).
    Jerry's Salvation (Level 11) holds Jerry's Feather (Custom Object).
  
  Backrooms Non-aligned Trading Group:
    All bases hold the Object Candy for sale (Object 5).
    All bases hold the Object Potion of Sanity Stall (Custom Object).
    All bases hold the Object Deuclidators (Object 4) for sale.
    Recourse Station (Level 10) has Agrugua Fruit (Object 85) traders.
    El3A (Level 2) has the Object Way-Back Machine (Object 22) in it.
    Floor 283 (Level 13) has the Object Way-Back Machine (Object 22) in it.
    Trader's Keep (Level 1) has the Object Leviathan's Tooth (Object 66).

  The Unbound:
    Tunnels (Level 76) has the Object Hermes Device (Object 99) in it.

  The Masked Maidens:
    Station 1 (Level 994) has the Object Wall Mask (Object 24) in it.
    Station 2 (Level 67) has the Object Wall Mask (Object 24) in it.
    Station 3 (Level 153) has the Object Wall Mask (Object 24) in it.
*/