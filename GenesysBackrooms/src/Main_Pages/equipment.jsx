import { Box, Button, Divider, Input, Stack, Typography } from "@mui/material";
import { collection, doc, onSnapshot, orderBy, query, setDoc } from "firebase/firestore";
import db from '../Components/firebase';
import { useState } from "react";
import NotLoggedIn from "../Components/notLoggedIn";

export default function Equipment() {
  const [playerPages, setPlayerPages] = useState([]);
  const [gear, setGear] = useState([]);
  const [jewelry, setJewelry] = useState([]);
  const [resources, setResources] = useState({});
  const [generated, setGenerated] = useState(false);
  const [resourceNames, setResourceNames] = useState([]);

  const addData = () => {
    const generatedResources = {};

    for(let i = 0; i < Object.keys(resources).length; i++) {
      generatedResources[resourceNames[i]] = parseInt(resources[Object.keys(resources)[i]]);
    }

    setDoc(doc(db, 'Equipped', localStorage.getItem('loggedIn')), {
      playerName: localStorage.getItem("loggedIn"),
      gear: gear,
      jewelry: jewelry,
      resources: generatedResources
    })

    alert("Successfully saved");
  }

  const getFromDB = () => {
    const q = query(collection(db, 'Equipped'));

    const unsub = onSnapshot(q, (querySnapshot) => {
      const queryData = [];
      querySnapshot.forEach((doc) => {
        if(doc.data().playerName === localStorage.getItem('loggedIn')) {
          setGear(doc.data().gear);
          setJewelry(doc.data().jewelry);
          setResources(doc.data().resources);

          const names = [];
          for(let i = 0; i < Object.keys(doc.data().resources).length; i++) {
            names.push(Object.keys(doc.data().resources)[i]);
          }
          setResourceNames(names);
        }
        queryData.push(doc.data());
      })
      setPlayerPages(queryData);
    })

    return () => {
      unsub();
    }
  }

  const handleGearChange = (event, index, gear) => {
    const newArr = [];

    for(let i = 0; i < gear.length; i++) {
      if(i === index) newArr.push(event.target.value);
      else newArr.push(gear[i]);
    }

    setGear(newArr);
  }

  const handleJewelryChange = (event, index, jewelry) => {
    const newArr = [];

    for(let i = 0; i < jewelry.length; i++) {
      if(i === index) newArr.push(event.target.value);
      else newArr.push(jewelry[i]);
    }

    setJewelry(newArr);
  }

  const populateDB = () => {
    setGenerated(true);
    let hasPage = false;

    for(let i = 0; i < playerPages.length; i++) if(playerPages[i].playerName === localStorage.getItem('loggedIn')) hasPage = true;

    if(hasPage === false) {
      //add blank document to db
      setDoc(doc(db, 'Equipped', localStorage.getItem('loggedIn')), {
        playerName: localStorage.getItem("loggedIn"),
        gear: ["Nothing", "Nothing", "Nothing", "Nothing", "Nothing"],
        jewelry: ["Nothing", "Nothing", "Nothing", "Nothing", "Nothing"],
        resources: {"Resource 1": ""}
      })

      setGear(["Nothing", "Nothing", "Nothing", "Nothing", "Nothing"]);
      setJewelry(["Nothing", "Nothing", "Nothing", "Nothing", "Nothing"]);
    }
  }

  const handleResourceChange = (event, arr, index) => {
    const temp = {};

    for(let i = 0; i < Object.keys(arr).length; i++) {
      if(i === index) temp[Object.keys(arr)[i]] = event.target.value;
      else temp[Object.keys(arr)[i]] = resources[Object.keys(resources)[i]];
    }

    setResources(temp);
  }

  const handleResourceName = (event, index, arr) => {
    const nameArr = [];

    for(let i = 0; i < Object.keys(arr).length; i++) {
      if(i === index) nameArr.push(event.target.value);
      else nameArr.push(resourceNames[i]);
    }

    setResourceNames(nameArr);
  }

  const addResource = () => {
    const temp = {};
    const names = [];

    for(let i = 0; i < Object.keys(resources).length; i++) {
      temp[Object.keys(resources)[i]] = resources[Object.keys(resources)[i]];
      names.push(Object.keys(resources)[i]);
    }

    temp["New Resource"] = 0;
    names.push("New Resource");

    setResourceNames(names);
    setResources(temp);

    const generatedResources = {};

    for(let i = 0; i < Object.keys(temp).length; i++) {
      generatedResources[names[i]] = parseInt(temp[Object.keys(temp)[i]]);
    }

    setDoc(doc(db, 'Equipped', localStorage.getItem('loggedIn')), {
      playerName: localStorage.getItem("loggedIn"),
      gear: gear,
      jewelry: jewelry,
      resources: generatedResources
    })
  }

  const deleteResource = (resource, arr) => {
    for(let i = 0; i < Object.keys(resources).length; i++) {
      if(resource === Object.keys(resources)[i]) {
        delete arr[Object.keys(resources)[i]];

        if(Object.keys(arr).length === 0) {
          setDoc(doc(db, 'Equipped', localStorage.getItem('loggedIn')), {
            playerName: localStorage.getItem("loggedIn"),
            gear: gear,
            jewelry: jewelry,
            resources: {"New Resource": 0}
          })
        }
        else {
          setDoc(doc(db, 'Equipped', localStorage.getItem('loggedIn')), {
            playerName: localStorage.getItem("loggedIn"),
            gear: gear,
            jewelry: jewelry,
            resources: {...arr, "New Resource": 0}
          })
        }
      }
    }
  }

  return (
    localStorage.getItem("loggedIn") === 'false' ? <NotLoggedIn /> :
      <Box>
        <Button onClick={addData}>Add</Button>
        {playerPages.length > 0 ? 
          <Box>
            {generated === false ? populateDB() : ""}
            {playerPages.map((page) => {
              return (
                <Box>
                  {page.playerName === localStorage.getItem('loggedIn') ?
                    <Stack direction='row' spacing={2}>
                      <Box>
                        <Divider>Gear</Divider>
                        <Stack direction='row' spacing={1}>
                          <Typography>Head:</Typography>
                          <Input value={gear[0]} onChange={(event) => handleGearChange(event, 0, page.gear)}></Input>
                        </Stack>
                        <Stack direction='row' spacing={1}>
                          <Typography>Chest:</Typography>
                          <Input value={gear[1]} onChange={(event) => handleGearChange(event, 1, page.gear)}></Input>
                        </Stack>
                        <Stack direction='row' spacing={1}>
                          <Typography>Arms:</Typography>
                          <Input value={gear[2]} onChange={(event) => handleGearChange(event, 2, page.gear)}></Input>
                        </Stack>
                        <Stack direction='row' spacing={1}>
                          <Typography>Legs:</Typography>
                          <Input value={gear[3]} onChange={(event) => handleGearChange(event, 3, page.gear)}></Input>
                        </Stack>
                        <Stack direction='row' spacing={1}>
                          <Typography>Feet:</Typography>
                          <Input value={gear[4]} onChange={(event) => handleGearChange(event, 4, page.gear)}></Input>
                        </Stack>
                      </Box>
                      <Box>
                        <Divider>Jewelry</Divider>
                        <Stack direction='row' spacing={1}>
                          <Typography>Earrings:</Typography>
                          <Input value={jewelry[0]} onChange={(event) => handleJewelryChange(event, 0, page.jewelry)}></Input>
                        </Stack>
                        <Stack direction='row' spacing={1}>
                          <Typography>Necklace:</Typography>
                          <Input value={jewelry[1]} onChange={(event) => handleJewelryChange(event, 1, page.jewelry)}></Input>
                        </Stack>
                        <Stack direction='row' spacing={1}>
                          <Typography>Bracelet:</Typography>
                          <Input value={jewelry[2]} onChange={(event) => handleJewelryChange(event, 2, page.jewelry)}></Input>
                        </Stack>
                        <Stack direction='row' spacing={1}>
                          <Typography>Left Ring:</Typography>
                          <Input value={jewelry[3]} onChange={(event) => handleJewelryChange(event, 3, page.jewelry)}></Input>
                        </Stack>
                        <Stack direction='row' spacing={1}>
                          <Typography>Right Ring:</Typography>
                          <Input value={jewelry[4]} onChange={(event) => handleJewelryChange(event, 4, page.jewelry)}></Input>
                        </Stack>
                      </Box>
                      <Stack>
                        <Divider>Resources</Divider>
                        <br />
                        {Object.keys(page.resources).map((resource, index) => {
                          if(Object.keys(page.resources).length === 1 && resource === 'New Resource'){
                            return (
                              <Stack direction='row' spacing={1}>
                                <Input value={resourceNames[index]} placeholder="Resource name" onChange={(event) => handleResourceName(event, index, page.resources)}></Input>
                                <Input type='number' value={resources[Object.keys(resources)[index]]} onChange={(event) => handleResourceChange(event, page.resources, index)} placeholder="Resource Value"></Input>
                              </Stack>
                            )
                          }
                          else {
                            return (
                              <Stack direction='row' spacing={1}>
                                <Input value={resourceNames[index]} placeholder="Resource name" onChange={(event) => handleResourceName(event, index, page.resources)}></Input>
                                <Input type='number' value={resources[Object.keys(resources)[index]]} onChange={(event) => handleResourceChange(event, page.resources, index)} placeholder="Resource Value"></Input>
                                <Button variant="outlined" onClick={() => deleteResource(resource, page.resources)}>Delete</Button>
                              </Stack>
                            )
                          }
                        })}
                        <Button onClick={addResource}>New Resource</Button>
                      </Stack>
                      <Button onClick={addData} variant="outlined">Update database</Button>
                    </Stack>
                  :
                    ""
                  }
                </Box>
              )
            })}
          </Box>
        :
          getFromDB()
        }
      </Box>
  )
}