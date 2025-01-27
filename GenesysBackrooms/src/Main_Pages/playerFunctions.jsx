import { Box, Button, Card, Divider, debounce, MenuItem, Select, Stack, TextField, Tooltip, Typography, CardContent, CardHeader, Tabs, Tab } from "@mui/material";
import { collection, deleteDoc, doc, onSnapshot, orderBy, query, setDoc, updateDoc, where } from "firebase/firestore";
import db from '../Components/firebase';
import NotLoggedIn from "../Components/notLoggedIn";
import { useEffect, useState } from "react";
import { TextFieldElement, useFieldArray, useForm } from 'react-hook-form-mui';
import { Add, Delete } from '@mui/icons-material';

export default function PlayerFunctions() {
  const [timers, setTimers] = useState([]);
  const [globalTimers, setGlobalTimers] = useState([]);
  const [allTimers, setAllTimers] = useState([]);
  const [addTime, setAddTime] = useState(0);
  const [addName, setAddName] = useState("");
  const [addDescription, setAddDescription] = useState("");
  const [editName, setEditName] = useState('None');
  const [editTime, setEditTime] = useState(0);
  const [editDescription, setEditDescription] = useState('');
  const [removeName, setRemoveName] = useState('');
  const [page, setPage] = useState({});
  const [tabValue, setTabValue] = useState(0);
  const [globalTimer, setGlobalTimer] = useState({
    name: "",
    value: 0,
    description: ""
  })
  const [tick, setTick] = useState(0);

  const getFromDB = () => {
    const q = query(collection(db, 'Timers'), orderBy("time", "desc"));

    const unsub = onSnapshot(q, (querySnapshot) => {
      const nonGlobal = [];
      const global = [];
      const queryData = [];

      querySnapshot.forEach((doc) => {
        if(doc.data().global === false && doc.data().user.toUpperCase() === localStorage.getItem("loggedIn").toUpperCase()) nonGlobal.push(doc.data());
        else if(doc.data().global) global.push(doc.data());

        queryData.push(doc.data());
      })
      setTimers(nonGlobal);
      setGlobalTimers(global);
      setAllTimers(queryData);
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
      setDoc(doc(db, 'Timers', addName + localStorage.getItem('loggedIn').toUpperCase()), {
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

    setDoc(doc(db, 'Timers', editName.includes('://:') ? editName.split('://:')[0] + localStorage.getItem('loggedIn').toUpperCase() + 'GLOBAL' : editName + localStorage.getItem('loggedIn').toUpperCase()), {
      name: editName,
      time: parseInt(editTime),
      user: localStorage.getItem('loggedIn'),
      global: editName.includes('://:') ? true : false,
      description: editDescription
    })
  }

  const removeTimer = () => {
    deleteDoc(doc(db, 'Timers', removeName.includes('://:') ? removeName.split('://:')[0] + localStorage.getItem('loggedIn').toUpperCase() + 'GLOBAL' : removeName + localStorage.getItem('loggedIn').toUpperCase()));
    setEditName('None');
    setEditTime(0);
    setEditDescription("");
    setRemoveName('None');
  }

  const getFromEquippedDB = () => {
    const q = query(collection(db, 'Equipped'), where('playerName', "==", localStorage.getItem('loggedIn')));

    const unsub = onSnapshot(q, (querySnapshot) => {
      let empty = true;
      querySnapshot.forEach((doc) => {
        setPage(doc.data());
        empty = false;
      })
      if(empty) {
        setDoc(doc(db, 'Equipped', localStorage.getItem('loggedIn').toUpperCase()), {
          playerName: localStorage.getItem('loggedIn'),
          gear: {head: "", chest: "", arms: "", legs: "", feet: ""},
          jewelry: {earrings: "", choker: "", bracelet: "", leftRing: "", rightRing: ""},
          resources: [{name: "", remaining: "", maximum: ""}]
        })
      }
    })

    return () => {
      unsub();
    }
  }

  const HandleForm = () => {
    if(Object.keys(page).length === 0) return;

    const resources = [];

    for(let i = 0; i < page.resources.length; i++) {
      resources.push(page.resources[i]);
    }

    const {control} = useForm({
      defaultValues: {
        gear: {
          head: page.gear.head,
          chest: page.gear.chest,
          arms: page.gear.arms,
          legs: page.gear.legs,
          feet: page.gear.feet
        },
        jewelry: {
          earrings: page.jewelry.earrings,
          choker: page.jewelry.choker,
          bracelet: page.jewelry.bracelet,
          leftRing: page.jewelry.leftRing,
          rightRing: page.jewelry.rightRing
        },
        resources: resources
      }
    });

    const {fields, append, remove} = useFieldArray({
      control,
      name: 'resources'
    })

    const handleGear = (event, piece) => {
      const gear = {};

      for(let i = 0; i < Object.keys(page.gear).length; i++) {
        if(Object.keys(page.gear)[i] === piece) gear[Object.keys(page.gear)[i]] = event.target.value
        else gear[Object.keys(page.gear)[i]] = page.gear[Object.keys(page.gear)[i]]
      }

      setDoc(doc(db, 'Equipped', localStorage.getItem('loggedIn').toUpperCase()), {
        playerName: localStorage.getItem('loggedIn'),
        gear: gear,
        jewelry: page.jewelry,
        resources: page.resources
      })
    }

    const handleJewelry = (event, piece) => {
      const jewelry = {};

      for(let i = 0; i < Object.keys(page.jewelry).length; i++) {
        if(Object.keys(page.jewelry)[i] === piece) jewelry[Object.keys(page.jewelry)[i]] = event.target.value
        else jewelry[Object.keys(page.jewelry)[i]] = page.jewelry[Object.keys(page.jewelry)[i]]
      }

      setDoc(doc(db, 'Equipped', localStorage.getItem('loggedIn').toUpperCase()), {
        playerName: localStorage.getItem('loggedIn'),
        gear: page.gear,
        jewelry: jewelry,
        resources: page.resources
      })
    }

    const handleResources = (event, index, type) => {
      const resources = [];
      const keys = Object.keys(page.resources);

      if(type === 'name') {
        for(let i = 0; i < keys.length; i++) {
          if(i === index) {
            resources[i] = {
              name: event.target.value,
              remaining: page.resources[keys[i]].remaining,
              maximum: page.resources[keys[i]].maximum
            }
          }
          else {
            resources[i] = {
              name: page.resources[keys[i]].name,
              remaining: page.resources[keys[i]].remaining,
              maximum: page.resources[keys[i]].maximum
            }
          }
        }
      }
      else if(type === 'remaining') {
        for(let i = 0; i < keys.length; i++) {
          if(i === index) {
            resources[i] = {
              name: page.resources[keys[i]].name,
              remaining: event.target.value,
              maximum: page.resources[keys[i]].maximum
            }
          }
          else {
            resources[i] = {
              name: page.resources[keys[i]].name,
              remaining: page.resources[keys[i]].remaining,
              maximum: page.resources[keys[i]].maximum
            }
          }
        }
      }
      else {
        for(let i = 0; i < keys.length; i++) {
          if(i === index) {
            resources[i] = {
              name: page.resources[keys[i]].name,
              remaining: page.resources[keys[i]].remaining,
              maximum: event.target.value
            }
          }
          else {
            resources[i] = {
              name: page.resources[keys[i]].name,
              remaining: page.resources[keys[i]].remaining,
              maximum: page.resources[keys[i]].maximum
            }
          }
        }
      }

      setDoc(doc(db, 'Equipped', localStorage.getItem('loggedIn').toUpperCase()), {
        playerName: localStorage.getItem('loggedIn'),
        gear: page.gear,
        jewelry: page.jewelry,
        resources: resources
      })
    }

    const addResource = () => {
      append({name: 'New Resource', remaining: '', maximum: ''});

      const resources = [];

      for(let i = 0; i < page.resources.length; i++) {
        resources.push(page.resources[i]);
      }
      resources.push({name: "New Resource", remaining: '', maximum: ''});

      setDoc(doc(db, 'Equipped', localStorage.getItem('loggedIn').toUpperCase()), {
        playerName: localStorage.getItem('loggedIn'),
        gear: page.gear,
        jewelry: page.jewelry,
        resources: resources
      })
    }

    const removeResource = (index) => {
      remove(index);

      const resources = [];

      for(let i = 0; i < page.resources.length; i++) {
        if(i !== index) resources.push(page.resources[i])
      }

      updateDoc(doc(db, 'Equipped', localStorage.getItem('loggedIn').toUpperCase()), {
        resources: resources
      })
    }

    const gearChange = debounce(handleGear, 500);
    const jewelryChange = debounce(handleJewelry, 500);
    const resourcesChange = debounce(handleResources, 500);

    return (
      <Box>
        <Card>
          <CardHeader title="Equipped Gear" />
          <CardContent>
            <Stack gap={1} direction={{sm: 'column', md: 'row'}}>
              <Stack gap={1} width={{sm: '100%', md: '50%'}}>
                <TextFieldElement fullWidth control={control} name="gear.head" label='Head' onChange={(event) => gearChange(event, "head")} />
                <TextFieldElement fullWidth control={control} name="gear.chest" label='Chest' onChange={(event) => gearChange(event, "chest")} />
                <TextFieldElement fullWidth control={control} name="gear.arms" label='Arms' onChange={(event) => gearChange(event, "arms")} />
                <TextFieldElement fullWidth control={control} name="gear.legs" label='Legs' onChange={(event) => gearChange(event, "legs")} />
                <TextFieldElement fullWidth control={control} name="gear.feet" label='Feet' onChange={(event) => gearChange(event, "feet")} />
              </Stack>
              <Stack gap={1} width={{sm: '100%', md: '50%'}}>
                <TextFieldElement fullWidth control={control} name="jewelry.earrings" label='Earrings' onChange={(event) => jewelryChange(event, "earrings")} />
                <TextFieldElement fullWidth control={control} name="jewelry.choker" label='Choker' onChange={(event) => jewelryChange(event, "choker")} />
                <TextFieldElement fullWidth control={control} name="jewelry.bracelet" label='Bracelet' onChange={(event) => jewelryChange(event, "bracelet")} />
                <TextFieldElement fullWidth control={control} name="jewelry.leftRing" label='Left Ring' onChange={(event) => jewelryChange(event, "leftRing")} />
                <TextFieldElement fullWidth control={control} name="jewelry.rightRing" label='Right Ring' onChange={(event) => jewelryChange(event, "rightRing")} />
              </Stack>
            </Stack>
          </CardContent>
        </Card>
        <Card>
          <CardHeader title='Resources' />
          <CardContent>
            <Stack direction='row' gap={1} flexWrap='wrap'>
              {fields.map((field, index) => (
                <Box key={field.id}>
                  <Stack spacing={1}>
                    <TextFieldElement control={control} label="Resource Name" name={`resources.${index}.name`} onChange={(event) => resourcesChange(event, index, "name")} />
                    <TextFieldElement control={control} label="Resources Remaining" name={`resources.${index}.remaining`} type="number" onChange={(event) => resourcesChange(event, index, 'remaining')} />
                    <TextFieldElement control={control} label="Resource Maximum" name={`resources.${index}.maximum`} type="number" onChange={(event) => resourcesChange(event, index, 'maximum')} />
                  </Stack>
                  <Box mt={2}>
                    <Button onClick={() => removeResource(index)} color="error" startIcon={<Delete />}>Delete</Button>
                  </Box>
                </Box>
              ))}
            </Stack>
            <br />
            <Divider />
            <br />
            <Box>
              <Button onClick={addResource} startIcon={<Add />}>Add Item</Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    )
  }

  const handleTabChange = (event, val) => {
    setTabValue(val);
  }

  const addGlobalTimer = () => {
    let ready = true;

    for(let i = 0; i < globalTimers.length; i++) {
      if(globalTimers[i].name.toUpperCase() === (globalTimer.name + "://:(Global)").toUpperCase() && globalTimers[i].user.toUpperCase() === localStorage.getItem('loggedIn').toUpperCase()) ready = false;
    }

    if(globalTimer.name === '') {
      alert('The timer name cannot be empty.');
      return;
    }

    if(parseInt(globalTimer.value) <= 0) {
      alert('The value cannot be 0 or lower.');
      return;
    }

    if(ready) {
      setDoc(doc(db, 'Timers', globalTimer.name + localStorage.getItem('loggedIn').toUpperCase() + 'GLOBAL'), {
        name: globalTimer.name + "://:(Global)",
        time: parseInt(globalTimer.value),
        user: localStorage.getItem('loggedIn'),
        global: true,
        description: globalTimer.description
      })

      setGlobalTimer({name: "", value: 0, description: ""});
    }
    else {
      alert("That timer already exists.");
    }
  }

  const reduceTime = () => {
    for(let i = 0; i < allTimers.length; i++) {
      if(allTimers[i].time - tick <= 0) {
        deleteDoc(doc(db, 'Timers', allTimers[i].name.includes('://:') ? allTimers[i].name.split("://:")[0] + allTimers[i].user.toUpperCase() + 'GLOBAL' : allTimers[i].name + localStorage.getItem('loggedIn').toUpperCase()));
        setEditName('None');
        setEditTime(0);
        setEditDescription("");
        setRemoveName('None');
      }
      else {
        setDoc(doc(db, 'Timers', allTimers[i].name.includes('://:') ? allTimers[i].name.split("://:")[0] + allTimers[i].user.toUpperCase() + 'GLOBAL' : allTimers[i].name + localStorage.getItem('loggedIn').toUpperCase()), {
          name: allTimers[i].name,
          time: (allTimers[i].time - tick),
          user: allTimers[i].user,
          global: allTimers[i].global,
          description: allTimers[i].description
        })
      }
    }
  }

  return (
    localStorage.getItem("loggedIn") === 'false' ? <NotLoggedIn /> :
      <Box padding={2}>
        <br />
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label='Gear and Resources'/>
          <Tab label='Timers' />
        </Tabs>

        {tabValue === 0 ?
          <Box>
            <Divider>Gear and Resources</Divider>
            {Object.keys(page).length > 0 ? 
              <HandleForm />
            :
              getFromEquippedDB()
            }
          </Box>
        :
          ""
        }
        {tabValue === 1 ?
        <Box>
          <Divider>Timers</Divider>
          <br />
          {timers.length > 0 || globalTimers.length > 0 ?
            <Box>
              <Stack direction={{sm: 'column', md: 'row'}} maxHeight='500px' gap={1}>
                <Box width={{sm: '100%', md: '60%'}} border='1px solid black' maxHeight='500px' overflow='auto'>
                  <br />
                  <Typography variant="h4" textAlign='center'>Personal Timers</Typography>
                  <Stack direction={{sm: 'column', md: 'row'}} flexWrap='wrap' gap={1} padding={2}>
                    {timers.length === 0 ? "" : timers.map((item) => {
                      return (
                        <Card variant="outlined" sx={{width: {xs: '100%', md: '300px'}, textAlign: 'center', border: '1px solid black', overflow: 'auto', height: '150px'}}>
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
                <Box width={{sm: '100%', md: '40%'}} border='1px solid black' maxHeight='500px' overflow='auto'>
                  <br />
                  <Typography variant="h4" textAlign='center'>Global Timers</Typography>
                  <Stack direction='row' flexWrap='wrap' gap={1} padding={2}>
                    {globalTimers.length === 0 ? "" : globalTimers.map((item) => {
                      return (
                        <Card variant="outlined" sx={{width: {xs: '100%', md: '300px'}, textAlign: 'center', border: '1px solid black', overflow: 'auto', height: '150px'}}>
                          <Box sx={{ p: 2 }}>
                            <Tooltip title={item.description}>
                              <Typography variant="h4">{item.name.split('://:')[0]}</Typography>
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
          <br />
          <Stack direction={{sm: 'column', md: 'row'}} spacing={1}>
            <Box width={{sm: '100%', md: '33%'}} border='1px solid black'>
              <br />
              <Typography variant="h4" textAlign='center'>Add New Timer</Typography>
              <br />
              <Stack direction={{sm: 'column', md: 'row'}} gap={1} padding={2}>
                <TextField label='Timer Name' value={addName} variant="outlined" onChange={(e) => setAddName(e.target.value)} />
                <TextField type="number" label='Timer value' variant="outlined" value={addTime} onChange={(e) => setAddTime(e.target.value)} />
                <TextField label='Timer Description' variant="outlined" value={addDescription} onChange={(e) => setAddDescription(e.target.value)} />
                <Button onClick={addTimer} variant="outlined">Confirm</Button>
              </Stack>
            </Box>
            {localStorage.getItem('loggedIn').toUpperCase() === 'ADMIN' ?
              <Box border='1px solid black' padding={2}>
                <Typography variant="h4" textAlign='center'>Add Global Timer</Typography>
                <br />
                <Stack direction={{sm: 'column', md: 'row'}} spacing={2}>
                  <Stack direction={{sm: 'column', md: 'row'}} gap={1} padding={2}>
                    <TextField label='Timer Name' value={globalTimer.name} variant="outlined" onChange={(e) => setGlobalTimer({...globalTimer, name: e.target.value})} />
                    <TextField type="number" label='Timer value' variant="outlined" value={globalTimer.value} onChange={(e) => setGlobalTimer({...globalTimer, value: e.target.value})} />
                    <TextField label='Timer Description' variant="outlined" value={globalTimer.description} onChange={(e) => setGlobalTimer({...globalTimer, description: e.target.value})} />
                    <Button onClick={addGlobalTimer} variant="outlined">Confirm</Button>
                  </Stack>
                </Stack>
              </Box>
            :
              ""
            }
            <Box width={{sm: '100%', md: '33%'}} border='1px solid black'>
              <br />
              <Typography variant="h4" textAlign='center'>Edit Timer</Typography>
              <br />
              <Stack direction={{sm: 'column', md: 'row'}} gap={1} padding={2}>
                <Select value={editName || 'None'} onChange={handleEditSelect}>
                  {timers.length === 0 ? "" : timers.map((timer) => {
                    return <MenuItem value={timer.name}>{timer.name}</MenuItem>
                  })}
                  {localStorage.getItem('loggedIn').toUpperCase() === 'ADMIN' ?
                    globalTimers.map((timer) => {
                      return <MenuItem value={timer.name}>{timer.name.split("://:")[0] + " " + timer.name.split("://:")[1]}</MenuItem>
                    })
                  :
                    ""
                  }
                  <MenuItem value='None'>None Selected</MenuItem>
                </Select>
                <TextField type="number" label='New Timer value' variant="outlined" value={editTime} onChange={(e) => setEditTime(e.target.value)} />
                <TextField label='New Timer Description' variant="outlined" value={editDescription} onChange={(e) => setEditDescription(e.target.value)} />
                <Button onClick={editTimer} variant="outlined">Confirm</Button>
              </Stack>
            </Box>
            <Box border='1px solid black' padding={2}>
              <Typography variant="h4" textAlign='center'>Remove Timer</Typography>
              <br />
              <Stack direction={{sm: 'column', md: 'row'}} spacing={2}>
                <Select value={removeName || 'None'} onChange={(e) => setRemoveName(e.target.value)}>
                  {timers.map((timer) => {
                    return <MenuItem value={timer.name}>{timer.name}</MenuItem>
                  })}
                  {localStorage.getItem('loggedIn').toUpperCase() === 'ADMIN' ?
                    globalTimers.map((timer) => {
                      return <MenuItem value={timer.name}>{timer.name.split("://:")[0] + " " + timer.name.split("://:")[1]}</MenuItem>
                    })
                  :
                    ""
                  }
                  <MenuItem value='None'>None Selected</MenuItem>
                </Select>
                <Button onClick={removeTimer} variant="outlined">Confirm</Button>
              </Stack>
            </Box>
            {localStorage.getItem('loggedIn').toUpperCase() === 'ADMIN' ?
              <Box border='1px solid black' padding={2}>
                <Typography variant="h4" textAlign='center'>Tick Timers</Typography>
                <br />
                <Stack direction={{sm: 'column', md: 'row'}} spacing={2}>
                  <Stack direction={{sm: 'column', md: 'row'}} gap={1} padding={2}>
                    <TextField type="number" label='Tick Value' value={tick} variant="outlined" onChange={(e) => setTick(e.target.value)} />
                    <Button onClick={reduceTime} variant="outlined">Confirm</Button>
                  </Stack>
                </Stack>
              </Box>
            :
              ""
            }
          </Stack>
        </Box>
        :
          ""
        }
      </Box>
  )
}