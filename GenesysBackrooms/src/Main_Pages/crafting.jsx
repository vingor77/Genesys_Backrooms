import { Box, Button, Stack, Typography } from "@mui/material";
import NotLoggedIn from "../Components/notLoggedIn";
import { useState } from "react";
import { collection, doc, onSnapshot, orderBy, query, setDoc } from "firebase/firestore";
import Craft from "../Components/crafts";
import db from '../Components/firebase';

export default function Crafting() {
  const [crafts, setCrafts] = useState([]);

  const data = [{"name":"Worn Sack","components":"Mobile Vacuum Cleaner's Debris Container (Object 83)/A worn down bag of some kind","skills":"Alchemy/Divine","difficulty":5,"tier":0,"attempts":1,"description":"A sack with dirt and grime on it. This bag can store an infinite amount, so long as the item fits within the openening. Anything within the bag no longer factors into your total encumbrance."}]

  const addData = () => {
    for(let i = 0; i < data.length; i++) {
      setDoc(doc(db, 'Crafts', data[i].name), {
        name: data[i].name,
        components: data[i].components,
        skills: data[i].skills,
        difficulty: data[i].difficulty,
        tier: data[i].tier,
        attempts: data[i].attempts,
        description: data[i].description
      })
    }
  }

  const getFromDB = () => {
    const q = query(collection(db, 'Crafts'), orderBy("name", "asc"));

    const unsub = onSnapshot(q, (querySnapshot) => {
      const queryData = [];
      querySnapshot.forEach((doc) => {
        queryData.push(doc.data());
      })
      setCrafts(queryData);
    })

    return () => {
      unsub();
    }
  }

  return (
    localStorage.getItem("loggedIn") === 'false' ? <NotLoggedIn /> :
      <Box>
      <Button onClick={addData}>Add</Button>
        {crafts.length > 0 ? 
          <Stack direction='row' flexWrap='wrap' gap={1}>
            {crafts.map((item) => {
              return <Craft currCraft={item}/>
            })}
          </Stack>
        :
          getFromDB()
        }
      </Box>
  )
}

/*
Worn Sack:
  Made from the Object Mobile Vacuum Cleaner's (Object 83) debris container and a well used bag of any kind.
*/