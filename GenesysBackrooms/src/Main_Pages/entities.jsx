import { Box, Button, Card, Chip, Divider, Stack, Toolbar, Typography } from "@mui/material";
import NotLoggedIn from "../Components/notLoggedIn";
import { collection, doc, onSnapshot, orderBy, query, setDoc } from "firebase/firestore";
import { useState } from "react";
import db from '../Components/firebase';
import EntityItem from "../Components/entityItem";

export default function Entities() {
  const [entities, setEntities] = useState([]);

  const data = [{"name":"Smiler (Rival)","description":"A reflective white gleam in the shape of eyes and a grinning mouth","stats":"3/3/2/2/2/1","soak":4,"wounds":16,"strain":0,"defenses":"1/0","skills":"Athletics 3/Brawl 4/Perception 2","talents":"None","abilities":"Rush: The Smiler does not use strain to perform a second maneuver each turn./Darkvision: When making skill checks, The Smiler removes up to two setback dice imposed due to darkness.","actions":"Charge(attack): Brawl; Damage 10; Range [Engaged]; Pierce 3","equipment":"None","drops":"1 Smiler Eye","difficulty":1,"spawnLocations":"All"},
    {"name":"Window (Rival)","description":"A window that matches the surrounding area. Within this window sometimes appears a shadowed humanoid figure","stats":"3/1/2/2/2/3","soak":4,"wounds":22,"strain":0,"defenses":"0/0","skills":"Brawl 2/Charm 3","talents":"None","abilities":"Whisper: The Window whispers within a short range. At the start of a player's turn, the player must make a contensted Cool check versus the Window's Charm check. On a fail, the player is staggered and must use thier free maneuver to move towards the Window. For the next 3 turns, that player is unaffected by this ability","actions":"Grab(Attack): Brawl; Damage 7; Critical 5; Range [Engaged]; Stun Damage","equipment":"None","drops":"1 Plank of Wood","difficulty":1,"spawnLocations":"Indoors"},
    {"name":"Deathmoth (Rival)","description":"A giant moth. Male Deathmoths are docile unless attacked while female Deathmoths are aggressive","stats":"2/3/1/2/2/3","soak":4,"wounds":20,"strain":0,"defenses":"0/1","skills":"Brawl 3/Ranged 2","talents":"Quick Strike 2: Add two boost dice to any target who has not taken thier turn yet in the current encounter.","abilities":"Darkvision: When making skill checks, The Deathmoth removes up to two setback dice imposed due to darkness.","actions":"Charge(Attack): Brawl; Damage 7; Range [Engaged]/Dissolve: The Deathmoth attempts to dissolve a metal or wooden object held or worn; Range [Engaged]/Spit(Attack)[Female]: Ranged; Damage 7; Range [Medium]","equipment":"None","drops":"2 Moth Wings(Male)/1 Vial of Acid(Female)","difficulty":1,"spawnLocations":"All"}]
    
  const addData = () => {
    for(let i = 0; i < data.length; i++) {
      setDoc(doc(db, 'Entities', data[i].name), {
        name: data[i].name,
        description: data[i].description,
        stats: data[i].stats,
        soak: data[i].soak,
        wounds: data[i].wounds,
        strain: data[i].strain,
        defenses: data[i].defenses,
        skills: data[i].skills,
        talents: data[i].talents,
        abilities: data[i].abilities,
        actions: data[i].actions,
        equipment: data[i].equipment,
        drops: data[i].drops,
        difficulty: data[i].difficulty,
        spawnLocations: data[i].spawnLocations
      })
    }
  }

  const getFromDB = () => {
    const q = query(collection(db, 'Entities'), orderBy("name", "asc"));

    const unsub = onSnapshot(q, (querySnapshot) => {
      const queryData = [];
      querySnapshot.forEach((doc) => {
        queryData.push(doc.data());
      })
      setEntities(queryData);
    })

    return () => {
      unsub();
    }
  }

  return (
    localStorage.getItem("loggedIn") === 'false' ? <NotLoggedIn /> :
      <Box>
      <Button onClick={addData}>Add</Button>
        {entities.length > 0 ? 
          <Stack direction='row' flexWrap='wrap' gap={1}>
            {entities.map((item) => {
              return <EntityItem entity={item}/>
            })}
          </Stack>
        :
          getFromDB()
        }
      </Box>
  )
}

/*
  Moley's Comedy Club and Bar (Entity 65) has the Wormhole Object (Custom Object).
  Sightless Seer (Enitity 365) drops a blue luminescent slab of skin use in making the Object Seer Tea (Object 365).
  Jerry (Entity 7) may appear randomly and give the Object Jerry's Feather (Custom Object).
  Create The Old Fear. A god.
  Blanche (Entity 140) appears in the dreams of the people who play GAM from the Object BackROM (Object 47).
  The King (Entity 33) gives out the Object The King's Courage (Custom Object) whenever it wants to AND upon The King's death.
  The Musician (Entity 137) gives the Object Cassette Recorder (Object 34) to people.
  The Keymaster (Entity 0) gives out a single Level Key to each person. Once ever.
  Scream Eaters (Entity 97) drops Liquid Silence.
  The Neighborhood Watch (Entity 96) is exclusive to Level 9 and will hunt down any wanderer with the Object Pocket (Object 51) in thier possession.
*/