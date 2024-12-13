import { Box, Button, Stack, Toolbar } from "@mui/material"
import { collection, doc, onSnapshot, orderBy, query, setDoc } from "firebase/firestore"
import db from '../Components/firebase';
import { useState } from "react";
import MundaneItem from "../Components/mundaneItem";
import NotLoggedIn from "../Components/notLoggedIn";

export default function MundaneObjects() {
  const [mundaneObjects, setMundaneObjects] = useState([]);

  const data = [
    {"name":"AA Battery","description":"A cylindrical object about the size of a pinky finger with a small silver bump in the center of one of the long sides. It says 'AA' with a + on one side and a - on another.","price":1,"rarity":0,"spawnLocations":"All","usedBy":"None"},
    {"name":"C Battery","description":"A cylindrical object about the size of two fingers with a small silver bump in the center of one of the long sides. It says 'C' with a + on one side and a - on another.","price":1,"rarity":0,"spawnLocations":"All","usedBy":"None"},
    {"name":"D Battery","description":"A cylindrical object about the size of two fingers with a small silver bump in the center of one of the long sides. It says 'D' with a + on one side and a - on another.","price":1,"rarity":0,"spawnLocations":"All","usedBy":"None"},
    {"name":"AAA Battery","description":"A cylindrical object about the size of a ring finger with a small silver bump in the center of one of the long sides. It says 'AAA' with a + on one side and a - on another.","price":1,"rarity":0,"spawnLocations":"All","usedBy":"None"},
    {"name":"Specialty Fuel","description":"A dark viscous liquid. It smells heavily of gasoline.","price":1,"rarity":1,"spawnLocations":"All","usedBy":"Hyrum Lanters/Deuclidators"},
    {"name":"Dumb Gum","description":"A hot pink piece of taffy-like gum. The surface is reflective, like glass.","price":1,"rarity":4,"spawnLocations":"All","usedBy":"None"},
    {"name":"Specialty Beaker","description":"A gray-tinted beaker with no markings on the sides.","price":1,"rarity":1,"spawnLocations":"All","usedBy":"Liquid Silence/Liquid Pain"}
  ]

  const addData = () => {
    for(let i = 0; i < data.length; i++) {
      setDoc(doc(db, 'MundaneObjects', data[i].name), {
        name: data[i].name,
        description: data[i].description,
        price: data[i].price,
        rarity: data[i].rarity,
        spawnLocations: data[i].spawnLocations,
        usedBy: data[i].usedBy
      })
    }
  }

  const getFromDB = () => {
    const q = query(collection(db, 'MundaneObjects'), orderBy("name", "asc"));

    const unsub = onSnapshot(q, (querySnapshot) => {
      const queryData = [];
      querySnapshot.forEach((doc) => {
        queryData.push(doc.data());
      })
      setMundaneObjects(queryData);
    })

    return () => {
      unsub();
    }
  }

  return (
    localStorage.getItem("loggedIn") === 'false' ? <NotLoggedIn /> :
      <Box>
        <Button onClick={addData}>Add</Button>
        {mundaneObjects.length > 0 ? 
          <Stack direction='row' flexWrap='wrap' gap={1}>
            {mundaneObjects.map((item) => {
              return <MundaneItem currMundane={item}/>
            })}
          </Stack>
        :
          getFromDB()
        }
      </Box>
  )
}
