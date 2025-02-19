import { Box, Button, Input, Stack, Toolbar, Typography } from "@mui/material";
import { collection, doc, onSnapshot, orderBy, query, setDoc } from "firebase/firestore";
import db from '../Components/firebase';
import NotLoggedIn from "../Components/notLoggedIn";
import { useState } from "react";
import People from "../Components/people";

export default function PeopleOfInterest() {
  const [people, setPeople] = useState([]);
  const [name, setName] = useState('');

  const data = [{"name":"Iravan, The Moon Man","introduction":"You see before you a tall and lanky man with nothing more than a green loincloth. His green hair ruffled and messy with a perfectly shaped bush for a beard. In the dim light his eyes glow a brilliant green. He is muttering to himself in a low, booming tone. Listening for a little longer, you notice he has an intense Scottish accent.","reason":"Iravan can make Worn Sacks when given the materials. Should the materials not be present, he will teach the recipe to create Worn Sacks.","personality":"Iravan is a laid-back individual interested in nothing more than the stories others would tell him. His voice is deep and he has a particularly thick Scottish accent.","spawnLocations":"Dark","associatedGroup":"None","hidden":"Yes"},
    {"name":"The Wizard","introduction":"Appearing out of thin air stands a man of average size in a blue robe covered in moon symbols. He has a pointy blue hat and large round glasses highlighting his crimson red eyes. His magnificent white beard trails halfway down his chest. He promptly holds his staff out before him, using it as a walking stick.","reason":"The Wizard can make and do anything, so long as it doesn't directly relate to a god or thier associated avatars.","personality":"The Wizard is a mysterious yet wise man who loves to share knowledge with others. He is a man of trade and will only assist when assisted back.","spawnLocations":"All","associatedGroup":"None","hidden":"Yes"},
    {"name":"Willow Wisp","introduction":"A small light slowly grows in power before you.","reason":"The Willow Wisp helps lead explorers out of Level 6.","personality":"None","spawnLocations":"6","associatedGroup":"None","hidden":"Yes"}]

  const addData = () => {
    for(let i = 0; i < data.length; i++) {
      setDoc(doc(db, 'PeopleOfInterest', data[i].name), {
        name: data[i].name,
        introduction: data[i].introduction,
        reason: data[i].reason,
        personality: data[i].personality,
        spawnLocations: data[i].spawnLocations,
        associatedGroup: data[i].associatedGroup,
        hidden: data[i].hidden
      })
    }
  }

  const getFromDB = () => {
    const q = query(collection(db, 'PeopleOfInterest'), orderBy("name", "asc"));

    const unsub = onSnapshot(q, (querySnapshot) => {
      const queryData = [];
      querySnapshot.forEach((doc) => {
        queryData.push(doc.data());
      })
      setPeople(queryData);
    })

    return () => {
      unsub();
    }
  }

  const DisplayItems = () => {
    let empty = true;

    return (
      <Stack direction='row' flexWrap='wrap' gap={1}>
        {people.map((item) => {
          if(
            (item.name.toUpperCase().includes(name.toUpperCase()) || name === '') && (item.hidden === 'No' || localStorage.getItem('loggedIn').toUpperCase() === 'ADMIN')
          ) {
            empty = false;
            return <People currPerson={item}/>
          }
        })}
        {empty ? <Typography>There are no people that match your criteria.</Typography> : ""}
      </Stack>
    )
  }

  return (
    localStorage.getItem("loggedIn") === 'false' ? <NotLoggedIn /> :
      <Box>
      <Button onClick={addData}>Add</Button>
        {people.length > 0 ?
          <Box>
            <Input value={name} onChange={e => setName(e.target.value)} placeholder='Enter Name'></Input>
            <br /><br />
            <DisplayItems />
          </Box>
        :
          getFromDB()
        }
      </Box>
  )
}