import { Box, Button, Stack, Typography } from "@mui/material";
import { collection, doc, onSnapshot, query, setDoc } from "firebase/firestore";
import db from '../Components/firebase';
import { useState } from "react";
import NotLoggedIn from "../Components/notLoggedIn";

export default function SetBonuses() {
  const [bonuses, setBonuses] = useState([]);

  const data = [{"name":"Red Knight Replicas Set","equipment":"Red Knight Replica Gloves/Red Knight Replica Greaves/Red Knight Replica Helmet/Red Knight Replica Plate/Red Knight Replica Sword/Red Knight Replica Shield","completionNumber":"2/4/6","effect":"Effect 1/Effect 2/Effect 3"},
    {"name":"Holy Set","equipment":"Holy Arm Guards/Holy Armor/Holy Greaves/Holy Hood/Holy Leggings/Retributor","completionNumber":"2/4/6","effect":"Effect 1/Effect 2/Effect 3"},
    {"name":"Steampunk Set","equipment":"Amplimotive Armor/Goggles of Many Actions","completionNumber":"2","effect":"Enter set bonus here"},
    {"name":"Shadows Set","equipment":"Shadow Hide/Boots of Shadow/Ring of Shadows/Smoked Pants","completionNumber":"3","effect":"Enter set bonus here"},
    {"name":"Healer Set","equipment":"Necklace of Healing/Wristlet of Healing","completionNumber":"2","effect":"At the start of each day, all items part of this set regain 10 charges. In addition, you gain an automatic success and advantage on all healing checks you perform."},
    {"name":"Weather Set","equipment":"Wristband of Summer/Wristband of Winter","completionNumber":"1","effect":"Effect here"},
    {"name":"Flight Set","equipment":"Winged Boots/Wings of Flying","completionNumber":"2","effect":"Effect here"}]
    
  const addData = () => {
    for(let i = 0; i < data.length; i++) {
      setDoc(doc(db, 'setBonuses', data[i].name), {
        name: data[i].name,
        equipment: data[i].equipment,
        completionNumber: data[i].completionNumber,
        effect: data[i].effect
      })
    }
  }

  const getFromDB = () => {
    const q = query(collection(db, 'setBonuses'));

    const unsub = onSnapshot(q, (querySnapshot) => {
      const queryData = [];
      querySnapshot.forEach((doc) => {
        queryData.push(doc.data());
      })
      setBonuses(queryData);
    })

    return () => {
      unsub();
    }
  }

  return (
    localStorage.getItem("loggedIn") === 'false' ? <NotLoggedIn /> :
      <Box>
        <Button onClick={addData}>Add</Button>
        {bonuses.length > 0 ? 
          <Stack>
            {bonuses.map((item) => {
              return (
                <Box>
                  <Box>
                    <Typography variant="h3">{item.name}</Typography>
                    <Stack direction='row' spacing={2}>
                      <Box>
                        {item.equipment.split('/').map((item, index) => {
                          return <Typography key={index}>{item}</Typography>
                        })}
                      </Box>
                      <Box>
                        {item.effect.split('/').map((effect, index) => {
                          return <Typography key={index}><b>With {item.completionNumber.split('/')[index]} item(s):</b> {effect}</Typography>
                        })}
                      </Box>
                    </Stack>
                  </Box>
                </Box>
              )
            })}
          </Stack>
        :
          getFromDB()
        }
      </Box>
  )
}