import { Box, Button, Card, debounce, MenuItem, Select, Stack, TextField, Tooltip, Typography, CardContent, CardHeader, Tabs, Tab,Grid,Paper,Chip,IconButton,Alert,LinearProgress,Badge,Slide } from "@mui/material";
import { collection, deleteDoc, doc, onSnapshot, orderBy, query, setDoc, updateDoc, where } from "firebase/firestore";
import db from '../Components/firebase';
import NotLoggedIn from "../Components/notLoggedIn";
import { useEffect, useState, memo, useCallback } from "react";
import { TextFieldElement, useFieldArray, useForm } from 'react-hook-form-mui';
import { Add, Delete, Timer, Shield, Diamond,AccessTime,AdminPanelSettings,Edit,RemoveCircle,PlayArrow,Psychology,LocalHospital,Warning,FitnessCenter } from '@mui/icons-material';

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
  const [effects, setEffects] = useState(null);

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
        setEffects(doc.data().effects);
        empty = false;
      })
      if(empty) {
        setDoc(doc(db, 'Equipped', localStorage.getItem('loggedIn').toUpperCase()), {
          playerName: localStorage.getItem('loggedIn'),
          gear: {head: "", chest: "", arms: "", legs: "", feet: ""},
          jewelry: {earrings: "", choker: "", bracelet: "", leftRing: "", rightRing: ""},
          resources: [{name: "", remaining: "", maximum: ""}],
          effects: {exhaustion: '0', sanity: '0', encumbrance: '0', disease: '0', wretchedCycle: '0', brawn: '0'}
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
        resources: resources,
        effects: page.effects
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
        resources: page.resources,
        effects: page.effects
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
        resources: page.resources,
        effects: page.effects
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
        resources: resources,
        effects: page.effects
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
        resources: resources,
        effects: page.effects
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
      <Box sx={{ mt: 3 }}>
        <Grid container spacing={3}>
          {/* Equipment Card */}
          <Grid item xs={12}>
            <Card 
              elevation={4}
              sx={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                borderRadius: 3
              }}
            >
              <CardHeader 
                title={
                  <Box display="flex" alignItems="center" gap={1}>
                    <Shield />
                    <Typography variant="h5" fontWeight="bold">Equipped Gear</Typography>
                  </Box>
                }
                sx={{ pb: 1 }}
              />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Paper elevation={2} sx={{ p: 3, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.1)' }}>
                      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Shield fontSize="small" />
                        Armor & Protection
                      </Typography>
                      <Stack spacing={2}>
                        <TextFieldElement fullWidth control={control} name="gear.head" label='Head' 
                          onChange={(event) => gearChange(event, "head")} 
                          sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'rgba(255,255,255,0.9)' } }}
                        />
                        <TextFieldElement fullWidth control={control} name="gear.chest" label='Chest' 
                          onChange={(event) => gearChange(event, "chest")} 
                          sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'rgba(255,255,255,0.9)' } }}
                        />
                        <TextFieldElement fullWidth control={control} name="gear.arms" label='Arms' 
                          onChange={(event) => gearChange(event, "arms")} 
                          sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'rgba(255,255,255,0.9)' } }}
                        />
                        <TextFieldElement fullWidth control={control} name="gear.legs" label='Legs' 
                          onChange={(event) => gearChange(event, "legs")} 
                          sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'rgba(255,255,255,0.9)' } }}
                        />
                        <TextFieldElement fullWidth control={control} name="gear.feet" label='Feet' 
                          onChange={(event) => gearChange(event, "feet")} 
                          sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'rgba(255,255,255,0.9)' } }}
                        />
                      </Stack>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Paper elevation={2} sx={{ p: 3, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.1)' }}>
                      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Diamond fontSize="small" />
                        Jewelry & Accessories
                      </Typography>
                      <Stack spacing={2}>
                        <TextFieldElement fullWidth control={control} name="jewelry.earrings" label='Ears' 
                          onChange={(event) => jewelryChange(event, "earrings")} 
                          sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'rgba(255,255,255,0.9)' } }}
                        />
                        <TextFieldElement fullWidth control={control} name="jewelry.choker" label='Neck' 
                          onChange={(event) => jewelryChange(event, "choker")} 
                          sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'rgba(255,255,255,0.9)' } }}
                        />
                        <TextFieldElement fullWidth control={control} name="jewelry.bracelet" label='Wrist' 
                          onChange={(event) => jewelryChange(event, "bracelet")} 
                          sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'rgba(255,255,255,0.9)' } }}
                        />
                        <TextFieldElement fullWidth control={control} name="jewelry.leftRing" label='Left Ring' 
                          onChange={(event) => jewelryChange(event, "leftRing")} 
                          sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'rgba(255,255,255,0.9)' } }}
                        />
                        <TextFieldElement fullWidth control={control} name="jewelry.rightRing" label='Right Ring' 
                          onChange={(event) => jewelryChange(event, "rightRing")} 
                          sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'rgba(255,255,255,0.9)' } }}
                        />
                      </Stack>
                    </Paper>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Resources Card */}
          <Grid item xs={12}>
            <Card elevation={4} sx={{ borderRadius: 3 }}>
              <CardHeader 
                title={
                  <Box display="flex" alignItems="center" gap={1}>
                    <FitnessCenter color="primary" />
                    <Typography variant="h5" fontWeight="bold">Resources</Typography>
                  </Box>
                }
                sx={{ bgcolor: 'primary.main', color: 'white' }}
              />
              <CardContent>
                <Grid container spacing={3}>
                  {fields.map((field, index) => (
                    <Grid item xs={12} md={6} lg={4} key={field.id}>
                      <Paper 
                        elevation={2} 
                        sx={{ 
                          p: 3, 
                          borderRadius: 2,
                          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                          color: 'white',
                          position: 'relative'
                        }}
                      >
                        <IconButton
                          onClick={() => removeResource(index)}
                          sx={{ position: 'absolute', top: 8, right: 8, color: 'white' }}
                          size="small"
                        >
                          <Delete />
                        </IconButton>
                        <Stack spacing={2} sx={{ mt: 1 }}>
                          <TextFieldElement 
                            control={control} 
                            label="Resource Name" 
                            name={`resources.${index}.name`} 
                            onChange={(event) => resourcesChange(event, index, "name")}
                            sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'rgba(255,255,255,0.9)' } }}
                          />
                          <Box display="flex" gap={1}>
                            <TextFieldElement 
                              control={control} 
                              label="Current" 
                              name={`resources.${index}.remaining`} 
                              type="number" 
                              onChange={(event) => resourcesChange(event, index, 'remaining')}
                              sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'rgba(255,255,255,0.9)' } }}
                            />
                            <TextFieldElement 
                              control={control} 
                              label="Maximum" 
                              name={`resources.${index}.maximum`} 
                              type="number" 
                              onChange={(event) => resourcesChange(event, index, 'maximum')}
                              sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'rgba(255,255,255,0.9)' } }}
                            />
                          </Box>
                          {page.resources[index]?.remaining && page.resources[index]?.maximum && (
                            <LinearProgress 
                              variant="determinate" 
                              value={(page.resources[index].remaining / page.resources[index].maximum) * 100}
                              sx={{ height: 8, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.3)' }}
                            />
                          )}
                        </Stack>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
                <Box mt={3} display="flex" justifyContent="center">
                  <Button 
                    onClick={addResource} 
                    startIcon={<Add />}
                    variant="contained"
                    size="large"
                    sx={{ borderRadius: 3, px: 4 }}
                  >
                    Add Resource
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
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

  const updateEffects = () => {
    setDoc(doc(db, 'Equipped', localStorage.getItem('loggedIn').toUpperCase()), {
      playerName: localStorage.getItem('loggedIn'),
      gear: page.gear,
      jewelry: page.jewelry,
      resources: page.resources,
      effects: effects
    })
  }

  const DisplayExhaustion = () => {
    const exhaustionEffects = [
      'No Effect', 
      'Add two setback dice to all physical checks.', 
      'Your maximum maneuvers per turn is reduced to one.', 
      'Add one difficulty to all physical checks.',
      'Your wound threshold is halved.',
      'You are immobilized.',
      'You are dead.'
    ];

    return (
      <Box>
        {exhaustionEffects.map((effect, index) => {
          if(index <= effects.exhaustion) {
            return (
              <Alert 
                key={index}
                severity={index === 0 ? "success" : index <= 2 ? "warning" : "error"}
                sx={{ mb: 1 }}
              >
                <Typography><strong>Level {index}:</strong> {effect}</Typography>
              </Alert>
            )
          }
        })}
      </Box>
    )
  }

  const DisplayDisease = () => {
    const diseaseEffects = [
      'No Effect', 
      'Symptoms are non-existent.', 
      'One of your limbs slows down as the blood vessels become more restricted from blood clots. While at this stage or above, you have a critical injury with a rating of 96.', 
      'Your blood vessels are now compromised to a severe degree and you begin to bleed from your orifices. You lose your free maneuver per turn, may only take either an action or maneuver per turn, and you gain 1 (unsoakable) wound per action taken.',
      'Your body can no longer keep up and you lose access to your limbs. Upon reaching this stage, one of your limbs becomes necrotic and you cannot use it. For each stage gained passed 4, another limb becomes necrotic. If all 4 major limbs (arms and legs) are necrotic and you would gain another level of this disease, you die.'
    ];

    return (
      <Box>
        {diseaseEffects.map((effect, index) => {
          if(index <= effects.disease) {
            return (
              <Alert 
                key={index}
                severity={index === 0 ? "success" : index <= 1 ? "info" : index <= 2 ? "warning" : "error"}
                sx={{ mb: 1 }}
              >
                <Typography><strong>Stage {index}:</strong> {effect}</Typography>
              </Alert>
            )
          }
        })}
      </Box>
    )
  }

  const DisplayWretched = () => {
    const wretchedEffects = [
      'No Effect', 
      'You begin to itch and develop a rash similar to when touching poison ivy. Also, the disease will attempt to alter your mental state. Immediately roll a difficulty 4 sanity check. On a fail, you recieve a permanent level of sanity until cleansed of this disease.', 
      'You lose your ability to speak clearly and you begin to lose your strength. While on Stage 2, you add 2 setback dice to all social checks and you treat your brawn and agility characteristics as though they were 1 lower.', 
      'The final stage. You decay to a point where you can no longer speak, rest, eat or drink on your own. You ooze brown sludge from all orifices that burn anybody it touches for 5 damage. Immediately when reaching this stage and every 24 hours afterwards, you must succeed on a difficulty 1 + previous successes resilience check or fully transform into a Wretch.',
    ];

    return (
      <Box>
        {wretchedEffects.map((effect, index) => {
          if(index <= effects.wretchedCycle) {
            return (
              <Alert 
                key={index}
                severity={index === 0 ? "success" : index === 1 ? "warning" : "error"}
                sx={{ mb: 1 }}
              >
                <Typography><strong>Stage {index}:</strong> {effect}</Typography>
              </Alert>
            )
          }
        })}
      </Box>
    )
  }

  const DisplaySanity = () => {
    let count = 0;

    const sanityEffects = [
      'No Effect', 
      'You recieve a setback dice to all social skills',
      'None',
      'You recieve a difficulty dice to all social skills',
      'None',
      'You recieve a setback dice to all non-social skills',
      'None',
      'You recieve a difficulty dice to all non-social skills',
      'Whenever you would recieve strain damage, you recieve an additional 1',
      'Your strain threshold is halved',
      'You treat all skills as though they were tier 0'
    ];

    return (
      <Box>
        {sanityEffects.map((effect, index) => {
          if(index <= effects.sanity && sanityEffects[index] !== 'None') {
            count++;
            return (
              <Alert 
                key={index}
                severity={count <= 2 ? "info" : count <= 4 ? "warning" : "error"}
                sx={{ mb: 1 }}
              >
                <Typography><strong>Level {index}:</strong> {effect}</Typography>
              </Alert>
            )
          }
        })}
      </Box>
    )
  }

  const DisplayEncumbrance = () => {
    const encumbrance = parseInt(effects.encumbrance);
    const brawn = parseInt(effects.brawn);
    const maxEncumbrance = parseInt(5 + brawn);

    let severity = "success";
    let message = "No detriment";

    if(encumbrance > maxEncumbrance && encumbrance < (maxEncumbrance + brawn)) {
      severity = "warning";
      message = `You add ${encumbrance - maxEncumbrance} setback dice to all brawn and agility checks.`;
    } else if(encumbrance >= (maxEncumbrance + brawn)) {
      severity = "error";
      message = `You add ${encumbrance - maxEncumbrance} setback dice to all brawn and agility checks and all maneuvers now cost strain.`;
    }

    return (
      <Alert severity={severity}>
        <Typography>{message}</Typography>
      </Alert>
    )
  }

  const DisplayEffects = () => {
    return (
      <Box sx={{ mt: 3 }}>
        <Box display="flex" justifyContent="center" mb={4}>
          <Button 
            onClick={updateEffects} 
            variant="contained" 
            size="large"
            startIcon={<LocalHospital />}
            sx={{ borderRadius: 3, px: 4, py: 1.5 }}
          >
            Update Effects
          </Button>
        </Box>

        <Grid container spacing={3}>
          {/* Exhaustion */}
          <Grid item xs={12} lg={6}>
            <Card elevation={4} sx={{ borderRadius: 3, height: '100%' }}>
              <CardHeader 
                title={
                  <Box display="flex" alignItems="center" gap={1}>
                    <FitnessCenter />
                    <Typography variant="h6">Exhaustion</Typography>
                    <Chip 
                      label={`Level ${effects.exhaustion}`} 
                      color={effects.exhaustion == 0 ? "success" : effects.exhaustion <= 2 ? "warning" : "error"}
                      size="small"
                    />
                  </Box>
                }
                sx={{ bgcolor: 'error.main', color: 'white', pb: 1 }}
              />
              <CardContent>
                <TextField 
                  type="number" 
                  label='Exhaustion Level' 
                  value={effects.exhaustion} 
                  variant="outlined" 
                  onChange={(e) => setEffects({...effects, exhaustion: e.target.value})} 
                  fullWidth
                  sx={{ mb: 2 }}
                />
                <DisplayExhaustion />
              </CardContent>
            </Card>
          </Grid>

          {/* Disease */}
          <Grid item xs={12} lg={6}>
            <Card elevation={4} sx={{ borderRadius: 3, height: '100%' }}>
              <CardHeader 
                title={
                  <Box display="flex" alignItems="center" gap={1}>
                    <LocalHospital />
                    <Typography variant="h6">The Disease</Typography>
                    <Chip 
                      label={`Stage ${effects.disease}`} 
                      color={effects.disease == 0 ? "success" : effects.disease <= 2 ? "warning" : "error"}
                      size="small"
                    />
                  </Box>
                }
                sx={{ bgcolor: 'warning.main', color: 'white', pb: 1 }}
              />
              <CardContent>
                <TextField 
                  type="number" 
                  label='The Disease Level' 
                  value={effects.disease} 
                  variant="outlined" 
                  onChange={(e) => setEffects({...effects, disease: e.target.value})} 
                  fullWidth
                  sx={{ mb: 2 }}
                />
                <DisplayDisease />
              </CardContent>
            </Card>
          </Grid>

          {/* Wretched Cycle */}
          <Grid item xs={12} lg={6}>
            <Card elevation={4} sx={{ borderRadius: 3, height: '100%' }}>
              <CardHeader 
                title={
                  <Box display="flex" alignItems="center" gap={1}>
                    <Warning />
                    <Typography variant="h6">Wretched Cycle</Typography>
                    <Chip 
                      label={`Stage ${effects.wretchedCycle}`} 
                      color={effects.wretchedCycle == 0 ? "success" : effects.wretchedCycle == 1 ? "warning" : "error"}
                      size="small"
                    />
                  </Box>
                }
                sx={{ bgcolor: 'secondary.main', color: 'white', pb: 1 }}
              />
              <CardContent>
                <TextField 
                  type="number" 
                  label='The Wretched Cycle Level' 
                  value={effects.wretchedCycle} 
                  variant="outlined" 
                  onChange={(e) => setEffects({...effects, wretchedCycle: e.target.value})} 
                  fullWidth
                  sx={{ mb: 2 }}
                />
                <DisplayWretched />
              </CardContent>
            </Card>
          </Grid>

          {/* Sanity */}
          <Grid item xs={12} lg={6}>
            <Card elevation={4} sx={{ borderRadius: 3, height: '100%' }}>
              <CardHeader 
                title={
                  <Box display="flex" alignItems="center" gap={1}>
                    <Psychology />
                    <Typography variant="h6">Sanity</Typography>
                    <Chip 
                      label={`Level ${effects.sanity}`} 
                      color={effects.sanity == 0 ? "success" : effects.sanity <= 4 ? "info" : effects.sanity <= 7 ? "warning" : "error"}
                      size="small"
                    />
                  </Box>
                }
                sx={{ bgcolor: 'info.main', color: 'white', pb: 1 }}
              />
              <CardContent>
                <TextField 
                  type="number" 
                  label='Sanity Level' 
                  value={effects.sanity} 
                  variant="outlined" 
                  onChange={(e) => setEffects({...effects, sanity: e.target.value})} 
                  fullWidth
                  sx={{ mb: 2 }}
                />
                <DisplaySanity />
              </CardContent>
            </Card>
          </Grid>

          {/* Encumbrance */}
          <Grid item xs={12}>
            <Card elevation={4} sx={{ borderRadius: 3 }}>
              <CardHeader 
                title={
                  <Box display="flex" alignItems="center" gap={1}>
                    <FitnessCenter />
                    <Typography variant="h6">Encumbrance & Capacity</Typography>
                  </Box>
                }
                sx={{ bgcolor: 'success.main', color: 'white', pb: 1 }}
              />
              <CardContent>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={4}>
                    <TextField 
                      type="number" 
                      label='Current Encumbrance' 
                      value={effects.encumbrance} 
                      variant="outlined" 
                      onChange={(e) => setEffects({...effects, encumbrance: e.target.value})} 
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField 
                      type="number" 
                      label='Brawn Score' 
                      value={effects.brawn} 
                      variant="outlined" 
                      onChange={(e) => setEffects({...effects, brawn: e.target.value})} 
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField 
                      type="number" 
                      label='Max Encumbrance' 
                      value={parseInt(effects.brawn) + 5} 
                      variant="outlined" 
                      fullWidth
                      disabled
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Box mt={2}>
                      <Typography variant="subtitle2" gutterBottom>Encumbrance Status:</Typography>
                      <DisplayEncumbrance />
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    )
  }

  const TimerCard = memo(({ timer, isGlobal = false }) => {
    const getTimerColor = useCallback((time) => {
      if (time <= 5) return 'error';
      if (time <= 15) return 'warning';
      return 'success';
    }, []);

    const displayName = isGlobal ? timer.name.split('://:')[0] : timer.name;

    return (
      <Card 
        elevation={2}
        sx={{ 
          borderRadius: 2,
          background: isGlobal 
            ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
          color: 'white',
          position: 'relative',
          minHeight: '120px',
          '&:hover': {
            transform: 'translateY(-2px)',
            transition: 'transform 0.2s ease'
          }
        }}
      >
        {isGlobal && (
          <Chip
            label="Global"
            size="small"
            sx={{ 
              position: 'absolute', 
              top: 4, 
              right: 4, 
              bgcolor: 'rgba(255,255,255,0.2)',
              color: 'white',
              fontSize: '0.7rem',
              height: '20px'
            }}
          />
        )}
        <CardContent sx={{ textAlign: 'center', p: 2, '&:last-child': { pb: 2 } }}>
          <Tooltip title={timer.description} arrow>
            <Typography 
              variant="subtitle1" 
              fontWeight="bold" 
              gutterBottom 
              sx={{ 
                cursor: 'help',
                fontSize: '0.95rem',
                lineHeight: 1.2,
                mb: 1,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {displayName}
            </Typography>
          </Tooltip>
          <Box display="flex" alignItems="center" justifyContent="center" gap={0.5} mb={1}>
            <AccessTime fontSize="small" />
            <Typography variant="h6" fontWeight="bold">
              {timer.time}
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={Math.min((timer.time / 100) * 100, 100)}
            color={getTimerColor(timer.time)}
            sx={{ 
              height: 6, 
              borderRadius: 3,
              bgcolor: 'rgba(255,255,255,0.3)',
              '& .MuiLinearProgress-bar': {
                borderRadius: 3
              }
            }}
          />
        </CardContent>
      </Card>
    );
  });

  // Memoize the timer list to prevent unnecessary re-renders
  const TimersList = memo(({ timers, isGlobal = false, title, color }) => (
    <Card elevation={4} sx={{ borderRadius: 3, height: '500px' }}>
      <CardHeader 
        title={
          <Box display="flex" alignItems="center" gap={1}>
            {isGlobal ? <AdminPanelSettings /> : <Timer />}
            <Typography variant="h6">{title}</Typography>
            <Chip label={timers.length} color={color} size="small" />
          </Box>
        }
        sx={{ bgcolor: `${color}.main`, color: 'white', py: 1 }}
      />
      <CardContent sx={{ height: 'calc(100% - 56px)', overflow: 'auto', p: 2 }}>
        {timers.length === 0 ? (
          <Typography variant="body1" textAlign="center" color="text.secondary" sx={{ mt: 4 }}>
            No {isGlobal ? 'global' : 'personal'} timers active
          </Typography>
        ) : (
          <Grid container spacing={1.5}>
            {timers.map((timer) => (
              <Grid item xs={6} sm={4} md={3} lg={6} xl={4} key={`${timer.name}-${timer.time}`}>
                <TimerCard timer={timer} isGlobal={isGlobal} />
              </Grid>
            ))}
          </Grid>
        )}
      </CardContent>
    </Card>
  ));

  return (
    localStorage.getItem("loggedIn") === 'false' ? <NotLoggedIn /> :
      <Box sx={{ p: 3, minHeight: '100vh', bgcolor: 'grey.50' }}>
        <Typography variant="h3" fontWeight="bold" textAlign="center" gutterBottom sx={{ mb: 4 }}>
          Player Dashboard
        </Typography>
        
        <Paper elevation={2} sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{ 
              '& .MuiTab-root': { 
                fontSize: '1.1rem', 
                fontWeight: 'bold',
                py: 2
              }
            }}
          >
            <Tab 
              label={
                <Box display="flex" alignItems="center" gap={1}>
                  <Shield />
                  Gear & Resources
                </Box>
              }
            />
            <Tab 
              label={
                <Box display="flex" alignItems="center" gap={1}>
                  <Timer />
                  Timers
                </Box>
              }
            />
            <Tab 
              label={
                <Box display="flex" alignItems="center" gap={1}>
                  <Psychology />
                  Effects
                </Box>
              }
            />
          </Tabs>
        </Paper>

        {/* Gear and Resources Tab */}
        {tabValue === 0 && (
          <Slide direction="right" in={tabValue === 0} timeout={300}>
            <Box>
              {Object.keys(page).length > 0 ? (
                <HandleForm />
              ) : (
                getFromEquippedDB()
              )}
            </Box>
          </Slide>
        )}

        {/* Timers Tab */}
        {tabValue === 1 && (
          <Slide direction="right" in={tabValue === 1} timeout={300}>
            <Box sx={{ mt: 3 }}>
              {/* Timer Display Section */}
              {timers.length > 0 || globalTimers.length > 0 ? (
                <Grid container spacing={3} sx={{ mb: 4 }}>
                  {/* Personal Timers */}
                  <Grid item xs={12} lg={8}>
                    <TimersList 
                      timers={timers} 
                      title="Personal Timers" 
                      color="primary" 
                    />
                  </Grid>

                  {/* Global Timers */}
                  <Grid item xs={12} lg={4}>
                    <TimersList 
                      timers={globalTimers} 
                      title="Global Timers" 
                      color="secondary" 
                      isGlobal
                    />
                  </Grid>
                </Grid>
              ) : (
                getFromDB()
              )}

              {/* Timer Management Section */}
              <Grid container spacing={3}>
                {/* Add New Timer */}
                <Grid item xs={12} lg={4}>
                  <Card elevation={4} sx={{ borderRadius: 3 }}>
                    <CardHeader 
                      title={
                        <Box display="flex" alignItems="center" gap={1}>
                          <Add />
                          <Typography variant="h6">Add New Timer</Typography>
                        </Box>
                      }
                      sx={{ bgcolor: 'success.main', color: 'white' }}
                    />
                    <CardContent>
                      <Stack spacing={2}>
                        <TextField 
                          label='Timer Name' 
                          value={addName} 
                          variant="outlined" 
                          onChange={(e) => setAddName(e.target.value)}
                          fullWidth
                        />
                        <TextField 
                          type="number" 
                          label='Timer Value' 
                          variant="outlined" 
                          value={addTime} 
                          onChange={(e) => setAddTime(e.target.value)}
                          fullWidth
                        />
                        <TextField 
                          label='Timer Description' 
                          variant="outlined" 
                          value={addDescription} 
                          onChange={(e) => setAddDescription(e.target.value)}
                          multiline
                          rows={3}
                          fullWidth
                        />
                        <Button 
                          onClick={addTimer} 
                          variant="contained" 
                          size="large"
                          startIcon={<Add />}
                          sx={{ borderRadius: 3 }}
                        >
                          Create Timer
                        </Button>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Admin Global Timer */}
                {localStorage.getItem('loggedIn').toUpperCase() === 'ADMIN' && (
                  <Grid item xs={12} lg={4}>
                    <Card elevation={4} sx={{ borderRadius: 3 }}>
                      <CardHeader 
                        title={
                          <Box display="flex" alignItems="center" gap={1}>
                            <AdminPanelSettings />
                            <Typography variant="h6">Add Global Timer</Typography>
                          </Box>
                        }
                        sx={{ bgcolor: 'warning.main', color: 'white' }}
                      />
                      <CardContent>
                        <Stack spacing={2}>
                          <TextField 
                            label='Timer Name' 
                            value={globalTimer.name} 
                            variant="outlined" 
                            onChange={(e) => setGlobalTimer({...globalTimer, name: e.target.value})}
                            fullWidth
                          />
                          <TextField 
                            type="number" 
                            label='Timer Value' 
                            variant="outlined" 
                            value={globalTimer.value} 
                            onChange={(e) => setGlobalTimer({...globalTimer, value: e.target.value})}
                            fullWidth
                          />
                          <TextField 
                            label='Timer Description' 
                            variant="outlined" 
                            value={globalTimer.description} 
                            onChange={(e) => setGlobalTimer({...globalTimer, description: e.target.value})}
                            multiline
                            rows={3}
                            fullWidth
                          />
                          <Button 
                            onClick={addGlobalTimer} 
                            variant="contained" 
                            size="large"
                            startIcon={<AdminPanelSettings />}
                            sx={{ borderRadius: 3 }}
                          >
                            Create Global Timer
                          </Button>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                )}

                {/* Edit Timer */}
                <Grid item xs={12} lg={4}>
                  <Card elevation={4} sx={{ borderRadius: 3 }}>
                    <CardHeader 
                      title={
                        <Box display="flex" alignItems="center" gap={1}>
                          <Edit />
                          <Typography variant="h6">Edit Timer</Typography>
                        </Box>
                      }
                      sx={{ bgcolor: 'info.main', color: 'white' }}
                    />
                    <CardContent>
                      <Stack spacing={2}>
                        <Select 
                          value={editName || 'None'} 
                          onChange={handleEditSelect}
                          fullWidth
                          displayEmpty
                        >
                          <MenuItem value='None'>Select Timer to Edit</MenuItem>
                          {timers.map((timer) => (
                            <MenuItem key={timer.name} value={timer.name}>{timer.name}</MenuItem>
                          ))}
                          {localStorage.getItem('loggedIn').toUpperCase() === 'ADMIN' &&
                            globalTimers.map((timer) => (
                              <MenuItem key={timer.name} value={timer.name}>
                                {timer.name.split("://:")[0] + " " + timer.name.split("://:")[1]}
                              </MenuItem>
                            ))
                          }
                        </Select>
                        <TextField 
                          type="number" 
                          label='New Timer Value' 
                          variant="outlined" 
                          value={editTime} 
                          onChange={(e) => setEditTime(e.target.value)}
                          fullWidth
                          disabled={editName === 'None'}
                        />
                        <TextField 
                          label='New Timer Description' 
                          variant="outlined" 
                          value={editDescription} 
                          onChange={(e) => setEditDescription(e.target.value)}
                          multiline
                          rows={3}
                          fullWidth
                          disabled={editName === 'None'}
                        />
                        <Button 
                          onClick={editTimer} 
                          variant="contained" 
                          size="large"
                          startIcon={<Edit />}
                          disabled={editName === 'None'}
                          sx={{ borderRadius: 3 }}
                        >
                          Update Timer
                        </Button>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Remove Timer */}
                <Grid item xs={12} lg={4}>
                  <Card elevation={4} sx={{ borderRadius: 3 }}>
                    <CardHeader 
                      title={
                        <Box display="flex" alignItems="center" gap={1}>
                          <RemoveCircle />
                          <Typography variant="h6">Remove Timer</Typography>
                        </Box>
                      }
                      sx={{ bgcolor: 'error.main', color: 'white' }}
                    />
                    <CardContent>
                      <Stack spacing={2}>
                        <Select 
                          value={removeName || 'None'} 
                          onChange={(e) => setRemoveName(e.target.value)}
                          fullWidth
                          displayEmpty
                        >
                          <MenuItem value='None'>Select Timer to Remove</MenuItem>
                          {timers.map((timer) => (
                            <MenuItem key={timer.name} value={timer.name}>{timer.name}</MenuItem>
                          ))}
                          {localStorage.getItem('loggedIn').toUpperCase() === 'ADMIN' &&
                            globalTimers.map((timer) => (
                              <MenuItem key={timer.name} value={timer.name}>
                                {timer.name.split("://:")[0] + " " + timer.name.split("://:")[1]}
                              </MenuItem>
                            ))
                          }
                        </Select>
                        <Button 
                          onClick={removeTimer} 
                          variant="contained" 
                          color="error"
                          size="large"
                          startIcon={<Delete />}
                          disabled={removeName === 'None'}
                          sx={{ borderRadius: 3, mt: 4 }}
                        >
                          Delete Timer
                        </Button>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Admin Tick Timers */}
                {localStorage.getItem('loggedIn').toUpperCase() === 'ADMIN' && (
                  <Grid item xs={12} lg={4}>
                    <Card elevation={4} sx={{ borderRadius: 3 }}>
                      <CardHeader 
                        title={
                          <Box display="flex" alignItems="center" gap={1}>
                            <PlayArrow />
                            <Typography variant="h6">Tick All Timers</Typography>
                          </Box>
                        }
                        sx={{ bgcolor: 'purple', color: 'white' }}
                      />
                      <CardContent>
                        <Stack spacing={2}>
                          <TextField 
                            type="number" 
                            label='Tick Value' 
                            value={tick} 
                            variant="outlined" 
                            onChange={(e) => setTick(e.target.value)}
                            fullWidth
                          />
                          <Button 
                            onClick={reduceTime} 
                            variant="contained" 
                            size="large"
                            startIcon={<PlayArrow />}
                            sx={{ 
                              borderRadius: 3, 
                              mt: 4,
                              bgcolor: 'purple',
                              '&:hover': { bgcolor: 'darkmagenta' }
                            }}
                          >
                            Advance Time
                          </Button>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                )}
              </Grid>
            </Box>
          </Slide>
        )}

        {/* Effects Tab */}
        {tabValue === 2 && (
          <Slide direction="right" in={tabValue === 2} timeout={300}>
            <Box>
              {effects && <DisplayEffects />}
            </Box>
          </Slide>
        )}
      </Box>
  )
}