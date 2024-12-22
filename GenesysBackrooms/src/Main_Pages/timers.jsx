import { Box, Button, Card, Divider, Input, MenuItem, Select, Stack, TextField, Toolbar, Tooltip, Typography } from "@mui/material";
import { collection, deleteDoc, doc, onSnapshot, orderBy, query, setDoc } from "firebase/firestore";
import db from '../Components/firebase';
import NotLoggedIn from "../Components/notLoggedIn";
import { useState } from "react";

export default function Timers() {
  const [timers, setTimers] = useState([]);
  const [globalTimers, setGlobalTimers] = useState([]);

  //Used to add timer only.
  const [addTime, setAddTime] = useState(0);
  const [addName, setAddName] = useState("");
  const [addDescription, setAddDescription] = useState("");

  const [editName, setEditName] = useState('');
  const [editTime, setEditTime] = useState(0);
  const [editDescription, setEditDescription] = useState('');

  const [removeName, setRemoveName] = useState('');

  /*
    Timers should consist of a name and a length of time. Additionally, should add a hover for what the timer stands for (a description)
    So, timers need
    {name: "", time: 123, description: "", global: false}

    name is timer name followed by logged in user .toUpperCase()
    time is a number in minutes
    description is just text that was input
  */

  const getFromDB = () => {
    const q = query(collection(db, 'Timers'), orderBy("time", "desc"));

    const unsub = onSnapshot(q, (querySnapshot) => {
      const nonGlobal = [];
      const global = [];

      querySnapshot.forEach((doc) => {
        if(doc.data().global === false && doc.data().user.toUpperCase() === localStorage.getItem("loggedIn").toUpperCase()) nonGlobal.push(doc.data());
        else if(doc.data().global) global.push(doc.data());
      })
      setTimers(nonGlobal);
      setGlobalTimers(global);
      
      if(nonGlobal.length > 0) {
        setEditName(nonGlobal[0].name);
        setEditTime(nonGlobal[0].time);
        setEditDescription(nonGlobal[0].description);

        setRemoveName(nonGlobal[0].name);
      }
    })

    return () => {
      unsub();
    }
  }

  const addTimer = () => {
    let ready = true;

    for(let i = 0; i < timers.length; i++) {
      if(timers[i].name.toUpperCase() === addName.toUpperCase() && timers[i].user.toUpperCase() === localStorage.getItem('loggedIn').toUpperCase()) ready = false;
    }

    if(addName === '') {
      alert('The timer name cannot be empty.');
      return;
    }

    if(parseInt(addTime) <= 0) {
      alert('The value cannot be 0 or lower.');
      return;
    }

    if(ready) {
      if(timers.length === 0) setEditName(addName);

      setDoc(doc(db, 'Timers', addName + localStorage.getItem('loggedIn')), {
        name: addName,
        time: parseInt(addTime),
        user: localStorage.getItem('loggedIn'),
        global: false,
        description: addDescription
      })

      setAddName("");
      setAddTime(0);
      setAddDescription("");
    }
    else alert('That timer already exists.');
  }

  const handleEditSelect = (e) => {
    let timer;
    for(let i = 0; i < timers.length; i++) {
      if(timers[i].name === e.target.value) timer = timers[i];
    }

    setEditName(e.target.value);
    setEditTime(timer.time);
    setEditDescription(timer.description);
  }

  const editTimer = () => {
    if(parseInt(editTime) <= 0) {
      alert('The value cannot be 0 or lower.');
      return;
    }

    setDoc(doc(db, 'Timers', editName + localStorage.getItem('loggedIn')), {
      name: editName,
      time: parseInt(editTime),
      user: localStorage.getItem('loggedIn'),
      global: false,
      description: editDescription
    })
  }

  const removeTimer = () => {
    deleteDoc(doc(db, 'Timers', removeName + localStorage.getItem('loggedIn')));
  }

  return (
    localStorage.getItem("loggedIn") === 'false' ? <NotLoggedIn /> :
      <Box padding={2}>
        <br />
        <Stack direction='row' spacing={1}>
          <Box width='33%' border='1px solid black'>
            <br />
            <Typography variant="h4" textAlign='center'>Add New Timer</Typography>
            <br />
            <Stack direction='row' spacing={2} padding={2}>
              <TextField label='Timer Name' value={addName} variant="outlined" onChange={(e) => setAddName(e.target.value)} />
              <TextField type="number" label='Timer value' variant="outlined" value={addTime} onChange={(e) => setAddTime(e.target.value)} />
              <TextField label='Timer Description' variant="outlined" value={addDescription} onChange={(e) => setAddDescription(e.target.value)} />
              <Button onClick={addTimer} variant="outlined">Confirm</Button>
            </Stack>
          </Box>
          <Box width='33%' border='1px solid black'>
            <br />
            <Typography variant="h4" textAlign='center'>Edit Timer</Typography>
            <br />
            <Stack direction='row' spacing={2} padding={2}>
              <Select value={editName} onChange={handleEditSelect}>
                {timers.map((timer) => {
                  return <MenuItem value={timer.name}>{timer.name}</MenuItem>
                })}
              </Select>
              <TextField type="number" label='New Timer value' variant="outlined" value={editTime} onChange={(e) => setEditTime(e.target.value)} />
              <TextField label='New Timer Description' variant="outlined" value={editDescription} onChange={(e) => setEditDescription(e.target.value)} />
              <Button onClick={editTimer} variant="outlined">Confirm</Button>
            </Stack>
          </Box>
          <Box border='1px solid black' padding={2}>
            <Typography variant="h4" textAlign='center'>Remove Timer</Typography>
            <br />
            <Stack direction='row' spacing={2}>
              <Select value={removeName} onChange={(e) => setRemoveName(e.target.value)}>
                {timers.map((timer) => {
                  return <MenuItem value={timer.name}>{timer.name}</MenuItem>
                })}
              </Select>
              <Button onClick={removeTimer} variant="outlined">Confirm</Button>
            </Stack>
          </Box>
        </Stack>
        <br />
        {timers.length > 0 || globalTimers.length > 0 ?
          <Box>
            <Stack direction='row' height='600px'>
              <Box width='60%' border='1px solid black'>
                <br />
                <Typography variant="h4" textAlign='center'>Your timers</Typography>
                <Stack direction='row' flexWrap='wrap' gap={1} padding={2}>
                  {timers.map((item) => {
                    return (
                      <Card variant="outlined" sx={{width: {xs: '100%', md: '200px'}, textAlign: 'center', border: '1px solid black', overflow: 'auto', height: '150px'}}>
                        <Box sx={{ p: 2 }}>
                          <Tooltip title={item.description}>
                            <Typography variant="h4">{item.name}</Typography>
                          </Tooltip>
                          <Typography>Time remaining: {item.time}</Typography>
                        </Box>
                      </Card>
                    )
                  })}
                </Stack>
              </Box>
              <Box width='40%' border='1px solid black'>
                <br />
                <Typography variant="h4" textAlign='center'>Global timers</Typography>
                <Stack direction='row' flexWrap='wrap' gap={1} padding={2}>
                  {globalTimers.map((item) => {
                    return (
                      <Card variant="outlined" sx={{width: {xs: '100%', md: '200px'}, textAlign: 'center', border: '1px solid black', overflow: 'auto', height: '150px'}}>
                        <Box sx={{ p: 2 }}>
                          <Tooltip title={item.description}>
                            <Typography variant="h4">{item.name}</Typography>
                          </Tooltip>
                          <Typography>Time remaining: {item.time}</Typography>
                        </Box>
                      </Card>
                    )
                  })}
                </Stack>
              </Box>
            </Stack>
          </Box>
        :
          getFromDB()
        }
      </Box>
  )
}