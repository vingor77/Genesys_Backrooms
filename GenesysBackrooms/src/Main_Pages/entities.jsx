import { Box, Button } from "@mui/material";
import NotLoggedIn from "../Components/notLoggedIn";
import { collection, doc, onSnapshot, orderBy, query, setDoc } from "firebase/firestore";
import { useMemo, useState } from "react";
import db from '../Components/firebase';
import EntityItem from "../Components/entityItem";
import { DataGrid } from '@mui/x-data-grid';

export default function Entities() {
  const [entities, setEntities] = useState([]);
  const [currEntity, setCurrEntity] = useState('Deathmoth');

  const data = [{"name":"Smiler","description":"A reflective white gleam in the shape of eyes and a grinning mouth","stats":"3/3/2/2/2/1","soak":4,"wounds":16,"strain":0,"defenses":"1/0","skills":"Athletics 3/Brawl 3/Perception 2","talents":"None","abilities":"Quick: The Clump may perform two free maneuvers per turn./Darkvision: When making skill checks, The Smiler removes up to two setback dice imposed due to darkness.","actions":"Charge(Attack): Brawl; Damage 10; Range [Engaged]; Pierce 3","equipment":"None","drops":"A tooth","difficulty":1,"spawnLocations":"All","type":"Rival"},
    {"name":"Window","description":"A window that matches the surrounding area. Within this window sometimes appears a shadowed humanoid figure","stats":"3/1/2/2/2/3","soak":4,"wounds":22,"strain":0,"defenses":"0/0","skills":"Brawl 2/Charm 3","talents":"None","abilities":"Whisper: The Window whispers within a short range. At the start of a player's turn, the player must make a contested Cool check versus the Window's Charm check. On a fail, the player is staggered and must use thier free maneuver to move towards the Window. For the next 3 turns, that player is unaffected by this ability","actions":"Grab(Attack): Brawl; Damage 7; Critical 5; Range [Engaged]; Stun Damage","equipment":"None","drops":"A plank of wood/A sheet of metal","difficulty":1,"spawnLocations":"Indoors","type":"Rival"},
    {"name":"Deathmoth","description":"A giant moth. Male Deathmoths are docile unless attacked while female Deathmoths are aggressive","stats":"2/3/1/2/2/3","soak":4,"wounds":20,"strain":0,"defenses":"0/1","skills":"Brawl 3/Ranged 2","talents":"Quick Strike 2: Add two boost dice to any target who has not taken thier turn yet in the current encounter.","abilities":"Darkvision: When making skill checks, The Deathmoth removes up to two setback dice imposed due to darkness.","actions":"Charge(Attack): Brawl; Damage 7; Range [Engaged]/Dissolve(Action): The Deathmoth attempts to dissolve a metal or wooden object held or worn; Range [Engaged]/Spit(Attack)[Female]: Ranged; Damage 7; Range [Medium]","equipment":"None","drops":"2 Moth Wings(Male)/1 Vial of Acid(Female)","difficulty":1,"spawnLocations":"All","type":"Rival"},
    {"name":"Clump","description":"A strange bundle of limbs with a large central mouth. The Clump is Blind and Deaf.","stats":"3/3/1/2/2/2","soak":4,"wounds":14,"strain":0,"defenses":"1/1","skills":"Athletics 3/Brawl 3","talents":"Rapid Reaction 2: May spend 1 strain to gain 1 success to initiative up to 2 times./Swift: Ignore difficult terrain.","abilities":"Enhanced awareness: Difficulty added through blindness is reduced by 3./Quick: The Clump may perform two free maneuvers per turn.","actions":"Grapple(Out-of-Turn-Incidental): The Clump reaches out to grapple a target entering within engaged range./Bite(Attack): Brawl; Damage 5; Critical 3; Range [Engaged]; Concussive 1; Vicious 1/Become Aware(Action): The Clump grows eyes and ears, allowing it to see and hear without problem.","equipment":"None","drops":"A tooth, an eye, or an ear","difficulty":1,"spawnLocations":"All","type":"Rival"},
    {"name":"Duller","description":"A dark grey humanoid with a lack of facial properties such as eyes, ears, and a mouth. The Duller runs from direct conflict, instead opting to pull the target through a wall and attack them individually.","stats":"3/3/3/3/2/3","soak":6,"wounds":23,"strain":0,"defenses":"1/0","skills":"Brawl 3/Athletics 2/Stealth 2","talents":"Duelist: When engaged with a single opponent, gain 1 boost dice to all melee combat checks. While engaged with 3 or more, add 1 setback dice instead./Swift: Ignore difficult terrain.","abilities":"Quick: The Clump may perform two free maneuvers per turn.","actions":"Grapple(Action): The Duller reaches through a wall and attempts to grapple and pull the target through the wall./Maul(Attack): Brawl; Damage 13; Critical 3; Range [Engaged]; Disorient 3","equipment":"A rarity 0 or 1 Object or Mundane item.","drops":"A piece of leather","difficulty":3,"spawnLocations":"Indoors","type":"Rival"},
    {"name":"Hound","description":"A humanoid that walks on all 4s, similar to a dog. Afraid of direct eye contact and loud noises.","stats":"2/2/1/1/1/1","soak":3,"wounds":5,"strain":0,"defenses":"0/0","skills":"Brawl","talents":"None","abilities":"None","actions":"Bite(Attack): Brawl; Damage 3; Critical 4; Range [Engaged]","equipment":"None","drops":"A tooth, an eye, or a lock of hair","difficulty":1,"spawnLocations":"All","type":"Minion"},
    {"name":"Faceling","description":"A humanoid without a face. Facelings are harmless unless attacked or aggravated in some way.","stats":"1/1/2/1/1/2","soak":3,"wounds":5,"strain":0,"defenses":"0/0","skills":"Melee","talents":"None","abilities":"None","actions":"Stab(Attack): Melee; Damage +1; Critical 3; Range [Engaged]/Punch(Attack): Brawl; Damage 1; Critical 5; Range [Engaged]","equipment":"A Knife/A gray Almond Water","drops":"A piece of leather/A knife","difficulty":1,"spawnLocations":"All","type":"Minion"},
    {"name":"Skin-Stealer","description":"The Skin-Stealer either can look exactly like a normal human or can look like a yellow-ish humanoid figure with hundreds of tiny tendrils all over its body. The Skin-Stealer is either in an aggressive hungered state or in a docile sated state.","stats":"3/2/3/2/2/3","soak":5,"wounds":17,"strain":0,"defenses":"1/0","skills":"Brawl 2","talents":"Dual Wielder: Reduce the difficulty of dual wielding by 1./Parry 3: May spend 3 strain to reduce the damage from an attack by 6./Parry (Improved): After parrying, use either 1 despair or 3 threats from the attacker's roll to deal 5 damage back.","abilities":"None","actions":"Shapeshift(Action): The Skin-Stealer can change into skin it has stolen or into it true form./Punch(Attack): Brawl; Damage 5; Critical 5; Range [Engaged]","equipment":"None","drops":"1d6 tendrils","difficulty":2,"spawnLocations":"All","type":"Rival"},
    {"name":"Burster","description":"A spiked animalistic being with spores growing all around the spikes.","stats":"2/3/3/3/2/2","soak":5,"wounds":15,"strain":0,"defenses":"1/1","skills":"Ranged 3","talents":"Natural (Brawn and Agility): May reroll 1 skill check using Brawn and 1 skill check using Agility once per session.","abilities":"None","actions":"Spray(Attack): Ranged; Damage 5; Critical N/A; Range [Short]; Burn 1/Pierce(Attack): Brawl; Damage 5; Critical 3; Range [Engaged]; Pierce 2","equipment":"None","drops":"A vial of acid/1d10 spikes","difficulty":2,"spawnLocations":"3","type":"Rival"}]
    
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
        spawnLocations: data[i].spawnLocations,
        type: data[i].type
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

  const displayTable = () => {
    const columns = [
      {
        field: 'name',
        headerName: 'Entity Name',
        flex: 1,
        editable: false,
        renderCell: (params) => <Button onClick={() => setCurrEntity(params.row.name)}>{params.row.name}</Button>
      },
      { 
        field: 'difficulty',
        headerName: 'Difficulty',
        flex: 1,
      },
      {
        field: 'drops',
        headerName: 'Drops',
        flex: 1,
        editable: false,
      }
    ];

    const rows = [];

    for(let i = 0; i < entities.length; i++) {
      rows.push({
        id: i,
        name: entities[i].name,
        difficulty: entities[i].difficulty,
        drops: entities[i].drops
      })
    }

    return (
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5]}
        disableRowSelectionOnClick
      />
    )
  }

  const table = useMemo(() => displayTable(), [entities]);

  const DisplayEntity = () => {
    for(let i = 0; i < entities.length; i++) {
      if(entities[i].name === currEntity) return <EntityItem entity={entities[i]}/>
    }
  }

  return (
    localStorage.getItem("loggedIn") === 'false' ? <NotLoggedIn /> :
      <Box>
      <Button onClick={addData}>Add</Button>
        {entities.length > 0 ?
          <Box>
            {table}
            <br />
            <DisplayEntity />
          </Box>
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