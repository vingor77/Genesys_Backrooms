import { Box, Button, Stack, Toolbar } from "@mui/material";
import { collection, doc, onSnapshot, orderBy, query, setDoc } from "firebase/firestore";
import db from '../Components/firebase';
import NotLoggedIn from "../Components/notLoggedIn";
import { useState } from "react";
import PhenomenonItem from "../Components/phenomenonItem";

export default function Phenomenons() {
  const [phenomena, setPhenomena] = useState([]);

  const data = [{"name":"Glitched","description":"At random intervals you glitch, potentially resulting in an action you did not intend to do.","effect":"Before every skill roll, roll 1d6. If you roll a 1, you glitch during the skill and add 2 setback dice to that roll. Otherwise, nothing happens.","type":"Physical"},
    {"name":"No-Clip","description":"A sudden and instant form of transportation where you go from one place to another regardless of distance and physical barriers.","effect":"Varies depending on location and type.","type":"Physical"}]

  const addData = () => {
    for(let i = 0; i < data.length; i++) {
      setDoc(doc(db, 'Phenomena', data[i].name), {
        name: data[i].name,
        description: data[i].description,
        effect: data[i].effect,
        type: data[i].type
      })
    }
  }

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

  return (
    localStorage.getItem("loggedIn") === 'false' ? <NotLoggedIn /> :
      <Box>
        <Button onClick={addData}>Add</Button>
          {phenomena.length > 0 ? 
            <Stack direction='row' flexWrap='wrap' gap={1}>
              {phenomena.map((item) => {
                return <PhenomenonItem currPhenomenon={item}/>
              })}
            </Stack>
          :
            getFromDB()
          }
      </Box>
  )
}