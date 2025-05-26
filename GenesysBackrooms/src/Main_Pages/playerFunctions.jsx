import React, { useEffect, useState, memo, useCallback } from 'react';
import {
  Box,
  Button,
  Card,
  debounce,
  MenuItem,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
  CardContent,
  CardHeader,
  Tabs,
  Tab,
  Grid,
  Paper,
  Chip,
  IconButton,
  Alert,
  LinearProgress,
  Badge,
  Slide,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Container,
  useTheme,
  alpha
} from "@mui/material";
import {
  Add,
  Delete,
  Timer,
  Shield,
  Diamond,
  AccessTime,
  AdminPanelSettings,
  Edit,
  RemoveCircle,
  PlayArrow,
  Psychology,
  LocalHospital,
  Warning,
  FitnessCenter,
  ExpandMore,
  Close,
  Save,
  Visibility,
  VisibilityOff
} from '@mui/icons-material';
import { collection, deleteDoc, doc, onSnapshot, orderBy, query, setDoc, updateDoc, where } from "firebase/firestore";
import db from '../Components/firebase';
import { TextFieldElement, useFieldArray, useForm } from 'react-hook-form-mui';

// Mock NotLoggedIn component
const NotLoggedIn = () => <Typography>Please log in to access this page.</Typography>;

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
  });
  const [tick, setTick] = useState(0);
  const [effects, setEffects] = useState(null);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const [dialogOpen, setDialogOpen] = useState({ add: false, edit: false, remove: false, tick: false });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const theme = useTheme();

  const showToast = (message, severity = 'success') => {
    setToast({ open: true, message, severity });
  };

  const hideToast = (event, reason) => {
    if (reason === 'clickaway') return;
    setToast({ ...toast, open: false });
  };

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
      });
      
      setTimers(nonGlobal);
      setGlobalTimers(global);
      setAllTimers(queryData);
    });

    return () => { unsub(); }
  };

  const addTimer = () => {
    let ready = true;
    for(let i = 0; i < timers.length; i++) {
      if(timers[i].name.toUpperCase() === addName.toUpperCase() && timers[i].user.toUpperCase() === localStorage.getItem('loggedIn').toUpperCase()) ready = false;
    }

    if(addName === '') {
      showToast('Timer name cannot be empty', 'error');
      return;
    }

    if(parseInt(addTime) <= 0) {
      showToast('Timer value must be greater than 0', 'error');
      return;
    }

    if(ready) {
      setDoc(doc(db, 'Timers', addName + localStorage.getItem('loggedIn').toUpperCase()), {
        name: addName,
        time: parseInt(addTime),
        user: localStorage.getItem('loggedIn'),
        global: false,
        description: addDescription
      });

      setAddName("");
      setAddTime(0);
      setAddDescription("");
      setDialogOpen({...dialogOpen, add: false});
      showToast('Timer created successfully!');
    } else {
      showToast('That timer already exists', 'error');
    }
  };

  const handleEditSelect = (e) => {
    let timer;
    for(let i = 0; i < timers.length; i++) {
      if(timers[i].name === e.target.value) timer = timers[i];
    }
    setEditName(e.target.value);
    setEditTime(timer.time);
    setEditDescription(timer.description);
  };

  const editTimer = () => {
    if(parseInt(editTime) <= 0) {
      showToast('Timer value must be greater than 0', 'error');
      return;
    }

    setDoc(doc(db, 'Timers', editName.includes('://:') ? editName.split('://:')[0] + localStorage.getItem('loggedIn').toUpperCase() + 'GLOBAL' : editName + localStorage.getItem('loggedIn').toUpperCase()), {
      name: editName,
      time: parseInt(editTime),
      user: localStorage.getItem('loggedIn'),
      global: editName.includes('://:') ? true : false,
      description: editDescription
    });
    
    setDialogOpen({...dialogOpen, edit: false});
    showToast('Timer updated successfully!');
  };

  const removeTimer = () => {
    deleteDoc(doc(db, 'Timers', removeName.includes('://:') ? removeName.split('://:')[0] + localStorage.getItem('loggedIn').toUpperCase() + 'GLOBAL' : removeName + localStorage.getItem('loggedIn').toUpperCase()));
    setEditName('None');
    setEditTime(0);
    setEditDescription("");
    setRemoveName('None');
    setDialogOpen({...dialogOpen, remove: false});
    showToast('Timer removed successfully!');
  };

  const getFromEquippedDB = () => {
    const q = query(collection(db, 'Equipped'), where('playerName', "==", localStorage.getItem('loggedIn')));
    const unsub = onSnapshot(q, (querySnapshot) => {
      let empty = true;
      querySnapshot.forEach((doc) => {
        setPage(doc.data());
        setEffects(doc.data().effects);
        empty = false;
      });
      if(empty) {
        setDoc(doc(db, 'Equipped', localStorage.getItem('loggedIn').toUpperCase()), {
          playerName: localStorage.getItem('loggedIn'),
          gear: {head: "", chest: "", arms: "", legs: "", feet: ""},
          jewelry: {earrings: "", choker: "", bracelet: "", leftRing: "", rightRing: ""},
          resources: [{name: "", remaining: "", maximum: ""}],
          effects: {exhaustion: '0', sanity: '0', encumbrance: '0', disease: '0', wretchedCycle: '0', brawn: '0'}
        });
      }
    });
    return () => { unsub(); }
  };

  const addGlobalTimer = () => {
    let ready = true;
    for(let i = 0; i < globalTimers.length; i++) {
      if(globalTimers[i].name.toUpperCase() === (globalTimer.name + "://:(Global)").toUpperCase() && globalTimers[i].user.toUpperCase() === localStorage.getItem('loggedIn').toUpperCase()) ready = false;
    }

    if(globalTimer.name === '') {
      showToast('Timer name cannot be empty', 'error');
      return;
    }

    if(parseInt(globalTimer.value) <= 0) {
      showToast('Timer value must be greater than 0', 'error');
      return;
    }

    if(ready) {
      setDoc(doc(db, 'Timers', globalTimer.name + localStorage.getItem('loggedIn').toUpperCase() + 'GLOBAL'), {
        name: globalTimer.name + "://:(Global)",
        time: parseInt(globalTimer.value),
        user: localStorage.getItem('loggedIn'),
        global: true,
        description: globalTimer.description
      });
      setGlobalTimer({name: "", value: 0, description: ""});
      showToast('Global timer created successfully!');
    } else {
      showToast('That timer already exists', 'error');
    }
  };

  const reduceTime = () => {
    for(let i = 0; i < allTimers.length; i++) {
      if(allTimers[i].time - tick <= 0) {
        deleteDoc(doc(db, 'Timers', allTimers[i].name.includes('://:') ? allTimers[i].name.split("://:")[0] + allTimers[i].user.toUpperCase() + 'GLOBAL' : allTimers[i].name + localStorage.getItem('loggedIn').toUpperCase()));
      } else {
        setDoc(doc(db, 'Timers', allTimers[i].name.includes('://:') ? allTimers[i].name.split("://:")[0] + allTimers[i].user.toUpperCase() + 'GLOBAL' : allTimers[i].name + localStorage.getItem('loggedIn').toUpperCase()), {
          name: allTimers[i].name,
          time: (allTimers[i].time - tick),
          user: allTimers[i].user,
          global: allTimers[i].global,
          description: allTimers[i].description
        });
      }
    }
    setDialogOpen({...dialogOpen, tick: false});
    showToast(`Advanced all timers by ${tick} units!`);
  };

  const updateEffects = () => {
    setDoc(doc(db, 'Equipped', localStorage.getItem('loggedIn').toUpperCase()), {
      playerName: localStorage.getItem('loggedIn'),
      gear: page.gear,
      jewelry: page.jewelry,
      resources: page.resources,
      effects: effects
    });
    showToast('Effects updated successfully!');
  };

  const handleEffects = (event, effectType) => {
    // Update local state immediately for responsive UI
    const newEffects = {...effects, [effectType]: event.target.value};
    setEffects(newEffects);
  };

  const saveEffectsToDb = (effectType, value) => {
    const newEffects = {...effects, [effectType]: value};
    
    setDoc(doc(db, 'Equipped', localStorage.getItem('loggedIn').toUpperCase()), {
      playerName: localStorage.getItem('loggedIn'),
      gear: page.gear,
      jewelry: page.jewelry,
      resources: page.resources,
      effects: newEffects
    });
  };

  const effectsChange = useCallback(
    debounce((effectType, value) => {
      saveEffectsToDb(effectType, value);
    }, 500),
    [page.gear, page.jewelry, page.resources, effects]
  );

  const HandleForm = () => {
    if(Object.keys(page).length === 0) return null;

    const resources = [];
    for(let i = 0; i < page.resources.length; i++) {
      resources.push(page.resources[i]);
    }

    const {control} = useForm({
      defaultValues: {
        gear: page.gear,
        jewelry: page.jewelry,
        resources: resources,
        effects: page.effects
      }
    });

    const {fields, append, remove} = useFieldArray({
      control,
      name: 'resources'
    });

    const handleGear = (event, piece) => {
      const gear = {};
      for(let i = 0; i < Object.keys(page.gear).length; i++) {
        if(Object.keys(page.gear)[i] === piece) gear[Object.keys(page.gear)[i]] = event.target.value;
        else gear[Object.keys(page.gear)[i]] = page.gear[Object.keys(page.gear)[i]];
      }
      setDoc(doc(db, 'Equipped', localStorage.getItem('loggedIn').toUpperCase()), {
        playerName: localStorage.getItem('loggedIn'),
        gear: gear,
        jewelry: page.jewelry,
        resources: page.resources,
        effects: page.effects
      });
    };

    const handleJewelry = (event, piece) => {
      const jewelry = {};
      for(let i = 0; i < Object.keys(page.jewelry).length; i++) {
        if(Object.keys(page.jewelry)[i] === piece) jewelry[Object.keys(page.jewelry)[i]] = event.target.value;
        else jewelry[Object.keys(page.jewelry)[i]] = page.jewelry[Object.keys(page.jewelry)[i]];
      }
      setDoc(doc(db, 'Equipped', localStorage.getItem('loggedIn').toUpperCase()), {
        playerName: localStorage.getItem('loggedIn'),
        gear: page.gear,
        jewelry: jewelry,
        resources: page.resources,
        effects: page.effects
      });
    };

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
            };
          } else {
            resources[i] = {
              name: page.resources[keys[i]].name,
              remaining: page.resources[keys[i]].remaining,
              maximum: page.resources[keys[i]].maximum
            };
          }
        }
      } else if(type === 'remaining') {
        for(let i = 0; i < keys.length; i++) {
          if(i === index) {
            resources[i] = {
              name: page.resources[keys[i]].name,
              remaining: event.target.value,
              maximum: page.resources[keys[i]].maximum
            };
          } else {
            resources[i] = {
              name: page.resources[keys[i]].name,
              remaining: page.resources[keys[i]].remaining,
              maximum: page.resources[keys[i]].maximum
            };
          }
        }
      } else {
        for(let i = 0; i < keys.length; i++) {
          if(i === index) {
            resources[i] = {
              name: page.resources[keys[i]].name,
              remaining: page.resources[keys[i]].remaining,
              maximum: event.target.value
            };
          } else {
            resources[i] = {
              name: page.resources[keys[i]].name,
              remaining: page.resources[keys[i]].remaining,
              maximum: page.resources[keys[i]].maximum
            };
          }
        }
      }

      setDoc(doc(db, 'Equipped', localStorage.getItem('loggedIn').toUpperCase()), {
        playerName: localStorage.getItem('loggedIn'),
        gear: page.gear,
        jewelry: page.jewelry,
        resources: resources,
        effects: page.effects
      });
    };

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
      });
    };

    const removeResource = (index) => {
      remove(index);
      const resources = [];
      for(let i = 0; i < page.resources.length; i++) {
        if(i !== index) resources.push(page.resources[i]);
      }
      updateDoc(doc(db, 'Equipped', localStorage.getItem('loggedIn').toUpperCase()), {
        resources: resources
      });
    };

    const gearChange = debounce(handleGear, 500);
    const jewelryChange = debounce(handleJewelry, 500);
    const resourcesChange = debounce(handleResources, 500);

    return (
      <Box sx={{ mt: 2 }}>
        <Stack spacing={3}>
          {/* Equipment Section */}
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMore />} sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
              <Box display="flex" alignItems="center" gap={1}>
                <Shield color="primary" />
                <Typography variant="h6" fontWeight="bold">Equipment & Gear</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Shield fontSize="small" />
                      Armor & Protection
                    </Typography>
                    <Stack spacing={2}>
                      <TextFieldElement fullWidth control={control} name="gear.head" label='Head' size="small"
                        onChange={(event) => gearChange(event, "head")} 
                      />
                      <TextFieldElement fullWidth control={control} name="gear.chest" label='Chest' size="small"
                        onChange={(event) => gearChange(event, "chest")} 
                      />
                      <TextFieldElement fullWidth control={control} name="gear.arms" label='Arms' size="small"
                        onChange={(event) => gearChange(event, "arms")} 
                      />
                      <TextFieldElement fullWidth control={control} name="gear.legs" label='Legs' size="small"
                        onChange={(event) => gearChange(event, "legs")} 
                      />
                      <TextFieldElement fullWidth control={control} name="gear.feet" label='Feet' size="small"
                        onChange={(event) => gearChange(event, "feet")} 
                      />
                    </Stack>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Diamond fontSize="small" />
                      Jewelry & Accessories
                    </Typography>
                    <Stack spacing={2}>
                      <TextFieldElement fullWidth control={control} name="jewelry.earrings" label='Earrings' size="small"
                        onChange={(event) => jewelryChange(event, "earrings")} 
                      />
                      <TextFieldElement fullWidth control={control} name="jewelry.choker" label='Choker' size="small"
                        onChange={(event) => jewelryChange(event, "choker")} 
                      />
                      <TextFieldElement fullWidth control={control} name="jewelry.bracelet" label='Bracelet' size="small"
                        onChange={(event) => jewelryChange(event, "bracelet")} 
                      />
                      <TextFieldElement fullWidth control={control} name="jewelry.leftRing" label='Left Ring' size="small"
                        onChange={(event) => jewelryChange(event, "leftRing")} 
                      />
                      <TextFieldElement fullWidth control={control} name="jewelry.rightRing" label='Right Ring' size="small"
                        onChange={(event) => jewelryChange(event, "rightRing")} 
                      />
                    </Stack>
                  </Paper>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* Resources Section */}
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMore />} sx={{ bgcolor: alpha(theme.palette.success.main, 0.1) }}>
              <Box display="flex" alignItems="center" gap={1}>
                <FitnessCenter color="success" />
                <Typography variant="h6" fontWeight="bold">Resources</Typography>
                <Chip label={fields.length} color="success" size="small" />
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={2}>
                {fields.map((field, index) => (
                  <Paper 
                    key={field.id}
                    elevation={2} 
                    sx={{ 
                      p: 2, 
                      borderRadius: 2,
                      border: `2px solid ${alpha(theme.palette.success.main, 0.3)}`,
                      position: 'relative'
                    }}
                  >
                    <IconButton
                      onClick={() => removeResource(index)}
                      sx={{ position: 'absolute', top: 4, right: 4 }}
                      size="small"
                      color="error"
                    >
                      <Delete />
                    </IconButton>
                    <Stack spacing={2} sx={{ pr: 5 }}>
                      <TextFieldElement 
                        control={control} 
                        label="Resource Name" 
                        name={`resources.${index}.name`} 
                        size="small"
                        onChange={(event) => resourcesChange(event, index, "name")}
                      />
                      <Box display="flex" gap={1}>
                        <TextFieldElement 
                          control={control} 
                          label="Current" 
                          name={`resources.${index}.remaining`} 
                          type="number" 
                          size="small"
                          onChange={(event) => resourcesChange(event, index, 'remaining')}
                        />
                        <TextFieldElement 
                          control={control} 
                          label="Maximum" 
                          name={`resources.${index}.maximum`} 
                          type="number" 
                          size="small"
                          onChange={(event) => resourcesChange(event, index, 'maximum')}
                        />
                      </Box>
                      {page.resources[index]?.remaining && page.resources[index]?.maximum && (
                        <LinearProgress 
                          variant="determinate" 
                          value={(page.resources[index].remaining / page.resources[index].maximum) * 100}
                          sx={{ height: 8, borderRadius: 4 }}
                          color="success"
                        />
                      )}
                    </Stack>
                  </Paper>
                ))}
                <Button 
                  onClick={addResource} 
                  startIcon={<Add />}
                  variant="outlined"
                  color="success"
                  sx={{ alignSelf: 'center', mt: 2 }}
                >
                  Add Resource
                </Button>
              </Stack>
            </AccordionDetails>
          </Accordion>
        </Stack>
      </Box>
    );
  };

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
          minHeight: '100px',
          background: isGlobal 
            ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
          color: 'white',
          position: 'relative'
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
              fontSize: '0.7rem'
            }}
          />
        )}
        <CardContent sx={{ textAlign: 'center', p: 2, '&:last-child': { pb: 2 } }}>
          <Tooltip title={timer.description} arrow>
            <Typography 
              variant="subtitle2" 
              fontWeight="bold" 
              gutterBottom 
              sx={{ 
                cursor: 'help',
                lineHeight: 1.2,
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
              height: 4, 
              borderRadius: 2,
              bgcolor: 'rgba(255,255,255,0.3)'
            }}
          />
        </CardContent>
      </Card>
    );
  });

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
      <Stack spacing={1}>
        {exhaustionEffects.map((effect, index) => {
          if(index <= effects.exhaustion) {
            return (
              <Alert 
                key={index}
                severity={index === 0 ? "success" : index <= 2 ? "warning" : "error"}
                sx={{ fontSize: '0.8rem' }}
              >
                <Typography variant="body2"><strong>Level {index}:</strong> {effect}</Typography>
              </Alert>
            );
          }
        })}
      </Stack>
    );
  };

  const DisplayDisease = () => {
    const diseaseEffects = [
      'No Effect', 
      'Symptoms are non-existent.', 
      'One of your limbs slows down as the blood vessels become more restricted from blood clots. While at this stage or above, you have a critical injury with a rating of 96.', 
      'Your blood vessels are now compromised to a severe degree and you begin to bleed from your orifices. You lose your free maneuver per turn, may only take either an action or maneuver per turn, and you gain 1 (unsoakable) wound per action taken.',
      'Your body can no longer keep up and you lose access to your limbs. Upon reaching this stage, one of your limbs becomes necrotic and you cannot use it. For each stage gained passed 4, another limb becomes necrotic. If all 4 major limbs (arms and legs) are necrotic and you would gain another level of this disease, you die.'
    ];

    return (
      <Stack spacing={1}>
        {diseaseEffects.map((effect, index) => {
          if(index <= effects.disease) {
            return (
              <Alert 
                key={index}
                severity={index === 0 ? "success" : index <= 1 ? "info" : index <= 2 ? "warning" : "error"}
                sx={{ fontSize: '0.8rem' }}
              >
                <Typography variant="body2"><strong>Stage {index}:</strong> {effect}</Typography>
              </Alert>
            );
          }
        })}
      </Stack>
    );
  };

  const DisplayWretched = () => {
    const wretchedEffects = [
      'No Effect', 
      'You begin to itch and develop a rash similar to when touching poison ivy. Also, the disease will attempt to alter your mental state. Immediately roll a difficulty 4 sanity check. On a fail, you recieve a permanent level of sanity until cleansed of this disease.', 
      'You lose your ability to speak clearly and you begin to lose your strength. While on Stage 2, you add 2 setback dice to all social checks and you treat your brawn and agility characteristics as though they were 1 lower.', 
      'The final stage. You decay to a point where you can no longer speak, rest, eat or drink on your own. You ooze brown sludge from all orifices that burn anybody it touches for 5 damage. Immediately when reaching this stage and every 24 hours afterwards, you must succeed on a difficulty 1 + previous successes resilience check or fully transform into a Wretch.',
    ];

    return (
      <Stack spacing={1}>
        {wretchedEffects.map((effect, index) => {
          if(index <= effects.wretchedCycle) {
            return (
              <Alert 
                key={index}
                severity={index === 0 ? "success" : index === 1 ? "warning" : "error"}
                sx={{ fontSize: '0.8rem' }}
              >
                <Typography variant="body2"><strong>Stage {index}:</strong> {effect}</Typography>
              </Alert>
            );
          }
        })}
      </Stack>
    );
  };

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
      <Stack spacing={1}>
        {sanityEffects.map((effect, index) => {
          if(index <= effects.sanity && sanityEffects[index] !== 'None') {
            count++;
            return (
              <Alert 
                key={index}
                severity={count <= 2 ? "info" : count <= 4 ? "warning" : "error"}
                sx={{ fontSize: '0.8rem' }}
              >
                <Typography variant="body2"><strong>Level {index}:</strong> {effect}</Typography>
              </Alert>
            );
          }
        })}
      </Stack>
    );
  };

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
        <Typography variant="body2">{message}</Typography>
      </Alert>
    );
  };

  const handleTabChange = (event, val) => {
    setTabValue(val);
  };

  useEffect(() => {
    if (localStorage.getItem("loggedIn") !== 'false') {
      getFromDB();
      getFromEquippedDB();
    }
  }, []);

  if (localStorage.getItem("loggedIn") === 'false') {
    return <NotLoggedIn />;
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50', mr: 'auto', ml: 'auto', py: 4 }} maxWidth={{sm: "100%", md: '75%'}}>
      {/* Header */}
      <Paper elevation={3} sx={{ borderRadius: 3, mb: 3, overflow: 'hidden' }}>
        <Box sx={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          p: 3,
          textAlign: 'center'
        }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Player Dashboard
          </Typography>
          <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
            Welcome back, {localStorage.getItem('loggedIn')}
          </Typography>
        </Box>
        
        {/* Navigation Tabs */}
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{ 
            '& .MuiTab-root': { 
              fontSize: { xs: '0.8rem', sm: '1rem' },
              fontWeight: 'bold',
              py: 2
            }
          }}
        >
          <Tab 
            label={
              <Box display="flex" alignItems="center" gap={1} flexDirection={{ xs: 'column', sm: 'row' }}>
                <Shield />
                <span>Gear</span>
              </Box>
            }
          />
          <Tab 
            label={
              <Box display="flex" alignItems="center" gap={1} flexDirection={{ xs: 'column', sm: 'row' }}>
                <Timer />
                <span>Timers</span>
              </Box>
            }
          />
          <Tab 
            label={
              <Box display="flex" alignItems="center" gap={1} flexDirection={{ xs: 'column', sm: 'row' }}>
                <Psychology />
                <span>Effects</span>
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
              <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <Typography>Loading equipment data...</Typography>
              </Box>
            )}
          </Box>
        </Slide>
      )}

      {/* Timers Tab */}
      {tabValue === 1 && (
        <Slide direction="right" in={tabValue === 1} timeout={300}>
          <Box sx={{ mt: 2 }}>
            {/* Active Timers Display */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              {/* Personal Timers */}
              <Grid item xs={12} lg={8}>
                <Card elevation={3} sx={{ borderRadius: 3, height: '400px' }}>
                  <CardHeader 
                    title={
                      <Box display="flex" alignItems="center" gap={1}>
                        <Timer color="primary" />
                        <Typography variant="h6">Personal Timers</Typography>
                        <Chip label={timers.length} color="primary" size="small" />
                      </Box>
                    }
                    sx={{ bgcolor: 'primary.main', color: 'white', py: 1 }}
                  />
                  <CardContent sx={{ height: 'calc(100% - 64px)', overflow: 'auto', p: 2 }}>
                    {timers.length === 0 ? (
                      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100%">
                        <Timer sx={{ fontSize: 60, color: 'grey.300', mb: 2 }} />
                        <Typography variant="body1" color="text.secondary">
                          No personal timers active
                        </Typography>
                      </Box>
                    ) : (
                      <Grid container spacing={1.5}>
                        {timers.map((timer) => (
                          <Grid item xs={6} sm={4} md={3} key={`${timer.name}-${timer.time}`}>
                            <TimerCard timer={timer} />
                          </Grid>
                        ))}
                      </Grid>
                    )}
                  </CardContent>
                </Card>
              </Grid>

              {/* Global Timers */}
              <Grid item xs={12} lg={4}>
                <Card elevation={3} sx={{ borderRadius: 3, height: '400px' }}>
                  <CardHeader 
                    title={
                      <Box display="flex" alignItems="center" gap={1}>
                        <AdminPanelSettings color="secondary" />
                        <Typography variant="h6">Global</Typography>
                        <Chip label={globalTimers.length} color="secondary" size="small" />
                      </Box>
                    }
                    sx={{ bgcolor: 'secondary.main', color: 'white', py: 1 }}
                  />
                  <CardContent sx={{ height: 'calc(100% - 64px)', overflow: 'auto', p: 2 }}>
                    {globalTimers.length === 0 ? (
                      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100%">
                        <AdminPanelSettings sx={{ fontSize: 60, color: 'grey.300', mb: 2 }} />
                        <Typography variant="body2" color="text.secondary" textAlign="center">
                          No global timers active
                        </Typography>
                      </Box>
                    ) : (
                      <Stack spacing={1.5}>
                        {globalTimers.map((timer) => (
                          <TimerCard key={`${timer.name}-${timer.time}`} timer={timer} isGlobal />
                        ))}
                      </Stack>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Timer Actions - Mobile Friendly Cards */}
            <Stack spacing={2}>
              {/* Add Timer */}
              <Card elevation={3} sx={{ borderRadius: 3 }}>
                <CardHeader 
                  title={
                    <Box display="flex" alignItems="center" gap={1}>
                      <Add color="success" />
                      <Typography variant="h6">Add New Timer</Typography>
                    </Box>
                  }
                  sx={{ bgcolor: 'success.main', color: 'white', py: 1 }}
                />
                <CardContent>
                  <Stack spacing={2}>
                    <TextField 
                      label='Timer Name' 
                      value={addName} 
                      variant="outlined" 
                      onChange={(e) => setAddName(e.target.value)}
                      fullWidth
                      size="small"
                    />
                    <TextField 
                      type="number" 
                      label='Timer Value' 
                      variant="outlined" 
                      value={addTime} 
                      onChange={(e) => setAddTime(e.target.value)}
                      fullWidth
                      size="small"
                    />
                    <TextField 
                      label='Timer Description' 
                      variant="outlined" 
                      value={addDescription} 
                      onChange={(e) => setAddDescription(e.target.value)}
                      multiline
                      rows={2}
                      fullWidth
                      size="small"
                    />
                    <Button 
                      onClick={addTimer} 
                      variant="contained" 
                      color="success"
                      startIcon={<Add />}
                      sx={{ borderRadius: 2 }}
                    >
                      Create Timer
                    </Button>
                  </Stack>
                </CardContent>
              </Card>

              {/* Admin Global Timer */}
              {localStorage.getItem('loggedIn').toUpperCase() === 'ADMIN' && (
                <Card elevation={3} sx={{ borderRadius: 3 }}>
                  <CardHeader 
                    title={
                      <Box display="flex" alignItems="center" gap={1}>
                        <AdminPanelSettings color="warning" />
                        <Typography variant="h6">Add Global Timer</Typography>
                      </Box>
                    }
                    sx={{ bgcolor: 'warning.main', color: 'white', py: 1 }}
                  />
                  <CardContent>
                    <Stack spacing={2}>
                      <TextField 
                        label='Timer Name' 
                        value={globalTimer.name} 
                        variant="outlined" 
                        onChange={(e) => setGlobalTimer({...globalTimer, name: e.target.value})}
                        fullWidth
                        size="small"
                      />
                      <TextField 
                        type="number" 
                        label='Timer Value' 
                        variant="outlined" 
                        value={globalTimer.value} 
                        onChange={(e) => setGlobalTimer({...globalTimer, value: e.target.value})}
                        fullWidth
                        size="small"
                      />
                      <TextField 
                        label='Timer Description' 
                        variant="outlined" 
                        value={globalTimer.description} 
                        onChange={(e) => setGlobalTimer({...globalTimer, description: e.target.value})}
                        multiline
                        rows={2}
                        fullWidth
                        size="small"
                      />
                      <Button 
                        onClick={addGlobalTimer} 
                        variant="contained" 
                        color="warning"
                        startIcon={<AdminPanelSettings />}
                        sx={{ borderRadius: 2 }}
                      >
                        Create Global Timer
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              )}

              {/* Edit Timer */}
              <Card elevation={3} sx={{ borderRadius: 3 }}>
                <CardHeader 
                  title={
                    <Box display="flex" alignItems="center" gap={1}>
                      <Edit color="info" />
                      <Typography variant="h6">Edit Timer</Typography>
                    </Box>
                  }
                  sx={{ bgcolor: 'info.main', color: 'white', py: 1 }}
                />
                <CardContent>
                  <Stack spacing={2}>
                    <Select 
                      value={editName || 'None'} 
                      onChange={handleEditSelect}
                      fullWidth
                      displayEmpty
                      size="small"
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
                      size="small"
                    />
                    <TextField 
                      label='New Timer Description' 
                      variant="outlined" 
                      value={editDescription} 
                      onChange={(e) => setEditDescription(e.target.value)}
                      multiline
                      rows={2}
                      fullWidth
                      disabled={editName === 'None'}
                      size="small"
                    />
                    <Button 
                      onClick={editTimer} 
                      variant="contained" 
                      color="info"
                      startIcon={<Edit />}
                      disabled={editName === 'None'}
                      sx={{ borderRadius: 2 }}
                    >
                      Update Timer
                    </Button>
                  </Stack>
                </CardContent>
              </Card>

              {/* Remove Timer */}
              <Card elevation={3} sx={{ borderRadius: 3 }}>
                <CardHeader 
                  title={
                    <Box display="flex" alignItems="center" gap={1}>
                      <Delete color="error" />
                      <Typography variant="h6">Remove Timer</Typography>
                    </Box>
                  }
                  sx={{ bgcolor: 'error.main', color: 'white', py: 1 }}
                />
                <CardContent>
                  <Stack spacing={2}>
                    <Select 
                      value={removeName || 'None'} 
                      onChange={(e) => setRemoveName(e.target.value)}
                      fullWidth
                      displayEmpty
                      size="small"
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
                      startIcon={<Delete />}
                      disabled={removeName === 'None'}
                      sx={{ borderRadius: 2 }}
                    >
                      Delete Timer
                    </Button>
                  </Stack>
                </CardContent>
              </Card>

              {/* Admin Tick Timers */}
              {localStorage.getItem('loggedIn').toUpperCase() === 'ADMIN' && (
                <Card elevation={3} sx={{ borderRadius: 3 }}>
                  <CardHeader 
                    title={
                      <Box display="flex" alignItems="center" gap={1}>
                        <PlayArrow />
                        <Typography variant="h6">Advance All Timers</Typography>
                      </Box>
                    }
                    sx={{ bgcolor: '#9c27b0', color: 'white', py: 1 }}
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
                        size="small"
                      />
                      <Button 
                        onClick={reduceTime} 
                        variant="contained" 
                        startIcon={<PlayArrow />}
                        sx={{ 
                          borderRadius: 2,
                          bgcolor: '#9c27b0',
                          '&:hover': { bgcolor: '#7b1fa2' }
                        }}
                      >
                        Advance Time
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              )}
            </Stack>
          </Box>
        </Slide>
      )}

      {/* Effects Tab */}
      {tabValue === 2 && (
        <Slide direction="right" in={tabValue === 2} timeout={300}>
          <Box sx={{ mt: 2 }}>
            {effects ? (
              <Stack spacing={3}>
                {/* Effects Accordion */}
                <Accordion defaultExpanded>
                  <AccordionSummary expandIcon={<ExpandMore />} sx={{ bgcolor: alpha(theme.palette.error.main, 0.1) }}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <FitnessCenter color="error" />
                      <Typography variant="h6" fontWeight="bold">Exhaustion</Typography>
                      <Chip 
                        label={`Level ${effects.exhaustion}`} 
                        color={effects.exhaustion == 0 ? "success" : effects.exhaustion <= 2 ? "warning" : "error"}
                        size="small"
                      />
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Stack spacing={2}>
                      <TextField 
                        type="number" 
                        label='Exhaustion Level' 
                        value={effects.exhaustion} 
                        variant="outlined" 
                        onChange={(e) => {
                          handleEffects(e, 'exhaustion');
                          effectsChange('exhaustion', e.target.value);
                        }} 
                        fullWidth
                        size="small"
                      />
                      <DisplayExhaustion />
                    </Stack>
                  </AccordionDetails>
                </Accordion>

                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMore />} sx={{ bgcolor: alpha(theme.palette.info.main, 0.1) }}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Psychology color="info" />
                      <Typography variant="h6" fontWeight="bold">Sanity</Typography>
                      <Chip 
                        label={`Level ${effects.sanity}`} 
                        color={effects.sanity == 0 ? "success" : effects.sanity <= 4 ? "info" : effects.sanity <= 7 ? "warning" : "error"}
                        size="small"
                      />
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Stack spacing={2}>
                      <TextField 
                        type="number" 
                        label='Sanity Level' 
                        value={effects.sanity} 
                        variant="outlined" 
                        onChange={(e) => {
                          handleEffects(e, 'sanity');
                          effectsChange('sanity', e.target.value);
                        }} 
                        fullWidth
                        size="small"
                      />
                      <DisplaySanity />
                    </Stack>
                  </AccordionDetails>
                </Accordion>

                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMore />} sx={{ bgcolor: alpha(theme.palette.success.main, 0.1) }}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <FitnessCenter color="success" />
                      <Typography variant="h6" fontWeight="bold">Encumbrance</Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Stack>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <TextField 
                            type="number" 
                            label='Current Encumbrance' 
                            value={effects.encumbrance} 
                            variant="outlined" 
                            onChange={(e) => {
                              handleEffects(e, 'encumbrance');
                              effectsChange('encumbrance', e.target.value);
                            }} 
                            fullWidth
                            size="small"
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField 
                            type="number" 
                            label='Brawn Score' 
                            value={effects.brawn} 
                            variant="outlined" 
                            onChange={(e) => {
                              handleEffects(e, 'brawn');
                              effectsChange('brawn', e.target.value);
                            }} 
                            fullWidth
                            size="small"
                          />
                        </Grid>
                        <Grid item xs={12}>
                        <TextField 
                          type="number" 
                          label='Max Encumbrance' 
                          value={parseInt(effects.brawn) + 5} 
                          variant="outlined" 
                          fullWidth
                          disabled
                          size="small"
                        />
                        </Grid>
                      </Grid>
                      <br />
                      <DisplayEncumbrance />
                    </Stack>
                  </AccordionDetails>
                </Accordion>

                {/* Disease Effects */}
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMore />} sx={{ bgcolor: alpha(theme.palette.warning.main, 0.1) }}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <LocalHospital color="warning" />
                      <Typography variant="h6" fontWeight="bold">The Disease</Typography>
                      <Chip 
                        label={`Stage ${effects.disease}`} 
                        color={effects.disease == 0 ? "success" : effects.disease <= 2 ? "warning" : "error"}
                        size="small"
                      />
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Stack spacing={2}>
                      <TextField 
                        type="number" 
                        label='Disease Level' 
                        value={effects.disease} 
                        variant="outlined" 
                        onChange={(e) => {
                          handleEffects(e, 'disease');
                          effectsChange('disease', e.target.value);
                        }} 
                        fullWidth
                        size="small"
                      />
                      <DisplayDisease />
                    </Stack>
                  </AccordionDetails>
                </Accordion>

                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMore />} sx={{ bgcolor: alpha(theme.palette.secondary.main, 0.1) }}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Warning color="secondary" />
                      <Typography variant="h6" fontWeight="bold">Wretched Cycle</Typography>
                      <Chip 
                        label={`Stage ${effects.wretchedCycle}`} 
                        color={effects.wretchedCycle == 0 ? "success" : effects.wretchedCycle == 1 ? "warning" : "error"}
                        size="small"
                      />
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Stack spacing={2}>
                      <TextField 
                        type="number" 
                        label='Wretched Cycle Level' 
                        value={effects.wretchedCycle} 
                        variant="outlined" 
                        onChange={(e) => {
                          handleEffects(e, 'wretchedCycle');
                          effectsChange('wretchedCycle', e.target.value);
                        }} 
                        fullWidth
                        size="small"
                      />
                      <DisplayWretched />
                    </Stack>
                  </AccordionDetails>
                </Accordion>
              </Stack>
            ) : (
              <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <Typography>Loading effects data...</Typography>
              </Box>
            )}
          </Box>
        </Slide>
      )}

      {/* Toast Notifications */}
      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={hideToast}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={hideToast}
          severity={toast.severity}
          variant="filled"
          sx={{ width: '100%', borderRadius: 2 }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}