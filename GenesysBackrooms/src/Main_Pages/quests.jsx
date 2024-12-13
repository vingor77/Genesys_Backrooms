import { Box, Button, Stack } from "@mui/material";
import NotLoggedIn from "../Components/notLoggedIn";
import { collection, doc, onSnapshot, orderBy, query, setDoc } from "firebase/firestore";
import { useState } from "react";
import QuestItem from "../Components/questItem";
import db from '../Components/firebase';

export default function Quests() {
  const [quests, setQuests] = useState([]);

  const data = [{"name":"Introduction","questGiver":"None","turnInLocation":"Trader's Keep","description":"Arrive at the Trader's Keep and speak with The Keeper","rewards":"4 Weapons/4 Armor/4 Gray Almond Water/A compass","completed":"No","hidden":"No","acquisition":"None"}]

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
        acquisition: data[i].acquisition
      })
    }
  }

  const getFromDB = () => {
    const q = query(collection(db, 'Quests'), orderBy("name", "asc"));

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

  return (
    localStorage.getItem("loggedIn") === 'false' ? <NotLoggedIn /> :
      <Box>
      <Button onClick={addData}>Add</Button>
        {quests.length > 0 ? 
          <Stack direction='row' flexWrap='wrap' gap={1}>
            {quests.map((item) => {
              return <QuestItem currQuest={item}/>
            })}
          </Stack>
        :
          getFromDB()
        }
      </Box>
  )
}