import { Box, Button, Dialog, FormControl, Input, InputLabel, MenuItem, Select, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material"
import { collection, doc, onSnapshot, orderBy, query, setDoc } from "firebase/firestore"
import db from '../Components/firebase';
import { useState } from "react";
import MundaneItem from "../Components/mundaneItem";
import NotLoggedIn from "../Components/notLoggedIn";

export default function MundaneObjects() {
  const [mundaneObjects, setMundaneObjects] = useState([]);
  const [name, setName] = useState('');
  const [rarity, setRarity] = useState('-1');

  const data = [{"name":"AA Battery","description":"A standard 2 inch long and 0.5 inch diameter single cell cylindrical dry battery. This battery can store up to 2,500 milliampere hours or mAH and discharges 1.5 volts.","price":"2 for 4","rarity":5,"spawnLocations":"All","usedBy":"Flashlight","hidden":"No"},
    {"name":"C Battery","description":"A standard 2 inch long and 1 inch diameter single cell cylindrical dry battery.  This battery can store up to 7,800 milliampere hours or mAH and discharges 1.5 volts.","price":"4 for 4","rarity":6,"spawnLocations":"All","usedBy":"Lantern","hidden":"No"},
    {"name":"D Battery","description":"A standard 2.4 inch long and 1.3 inch diameter single cell cylindrical dry battery.  This battery can store up to 10,000 milliampere hours or mAH and discharges 1.5 volts.","price":"5 for 4","rarity":7,"spawnLocations":"All","usedBy":"Lantern","hidden":"No"},
    {"name":"AAA Battery","description":"A standard 1.75 inch long and 0.4 inch diameter single cell cylindrical dry battery.  This battery can store up to 750 milliampere hours or mAH and discharges 1.5 volts.","price":"1 for 4","rarity":2,"spawnLocations":"All","usedBy":"Flashlight","hidden":"No"},
    {"name":"Specialty Fuel","description":"A dark viscous liquid. It smells heavily of gasoline.","price":"1 for 1 liter","rarity":1,"spawnLocations":"All","usedBy":"Hyrum Lanters/Deuclidators","hidden":"Yes"},
    {"name":"Dumb Gum","description":"A hot pink piece of taffy-like gum. The surface is reflective, like glass.","price":"1 for 10","rarity":4,"spawnLocations":"All","usedBy":"None","hidden":"Yes"},
    {"name":"Specialty Beaker","description":"A gray-tinted beaker with no markings on the sides.","price":"1 for 5","rarity":1,"spawnLocations":"All","usedBy":"Liquid Silence/Liquid Pain","hidden":"Yes"},
    {"name":"AAAA Battery","description":"A standard 1.7 inch long and 0.3 inch diameter single cell cylindrical dry battery.  This battery can store up to 550 milliampere hours or mAH and discharges 1.5 volts.","price":"1 for 4","rarity":1,"spawnLocations":"All","usedBy":"Flashlight","hidden":"No"},
    {"name":"9v Battery","description":"A rectangular 0.7 inch by 1 inch by 2 inch electrical battery that. This battery can store up to 1,000 milliampere hours or mAH and discharges 9 volts.","price":"2 for 4","rarity":3,"spawnLocations":"All","usedBy":"Lantern","hidden":"No"},
    {"name":"A23 Battery","description":"A standard 1.1 inch long and 0.4 inch diameter single cell cylindrical dry battery. This battery can store up to 55 milliampere hours or mAH and discharges 12 volts.","price":"1 for 4","rarity":0,"spawnLocations":"All","usedBy":"Flashlight","hidden":"No"},
    {"name":"N Battery","description":"A standard 1.2 inch long and 0.5 inch diameter single cell cylindrical dry battery. This battery can store up to 1,000 milliampere hours or mAH and discharges 1.5 volts.","price":"1 for 4","rarity":4,"spawnLocations":"All","usedBy":"Lantern","hidden":"No"},
    {"name":"Flashlight","description":"A hand-held device that lights up an area. The battery type, power, and range are variable and decided when found. This device can use AA, AAA, AAAA, and A23 batteries.","price":"3 for 1","rarity":2,"spawnLocations":"All","usedBy":"None","hidden":"No"},
    {"name":"Lantern","description":"A hand-held device that lights up an area. The battery type, power, and range are variable and decided when found. This device can use 9V, N, C, and D batteries.","price":"6 for 1","rarity":5,"spawnLocations":"All","usedBy":"None","hidden":"No"},
    {"name":"Armorer's Tools","description":"Tools used to craft armor and other metal objects that aren't weapons or jewelry","price":"1 for 1","rarity":1,"spawnLocations":"All","usedBy":"None","hidden":"No"},
    {"name":"Blacksmith Tools","description":"Tools used to craft weapons","price":"1 for 1","rarity":1,"spawnLocations":"All","usedBy":"None","hidden":"No"},
    {"name":"Goldsmith Tools","description":"Tools used to craft jewelry and anything with gems","price":"1 for 1","rarity":1,"spawnLocations":"All","usedBy":"None","hidden":"No"},
    {"name":"Leatherworker's Tools","description":"Tools used to craft anything to do with leather","price":"1 for 1","rarity":1,"spawnLocations":"All","usedBy":"None","hidden":"No"},
    {"name":"Weaver's Tools","description":"Tools used to craft anything to do with cloth or fibers","price":"1 for 1","rarity":1,"spawnLocations":"All","usedBy":"None","hidden":"No"},
    {"name":"Alchemist Tools","description":"Tools used to craft concoctions and potions","price":"1 for 1","rarity":1,"spawnLocations":"All","usedBy":"None","hidden":"No"},
    {"name":"Carpenter Tools","description":"Tools used to craft anything involving wood as the primary substance","price":"1 for 1","rarity":1,"spawnLocations":"All","usedBy":"None","hidden":"No"},
    {"name":"Culinarian Tools","description":"Tools used to cook","price":"1 for 1","rarity":1,"spawnLocations":"All","usedBy":"None","hidden":"No"},
    {"name":"Miner tools","description":"Tools used to gather rock, ore, and water deposits","price":"1 for 1","rarity":1,"spawnLocations":"All","usedBy":"None","hidden":"No"},
    {"name":"Botanist tools","description":"Tools used to gather natural resources","price":"1 for 1","rarity":1,"spawnLocations":"All","usedBy":"None","hidden":"No"},
    {"name":"Basic Backpack","description":"A brown sack with two straps and a velcrow holding the opening shut. While worn, your encumbrance threshold increases by 4.","price":"4 for 1","rarity":3,"spawnLocations":"All","usedBy":"None","hidden":"No"},
    {"name":"Plague Cloak","description":"A purple cloak exterior with a smooth red interior color. While worn, Plague Goblins will no longer engage you or your belongings","price":"1 for 1","rarity":1,"spawnLocations":"None","usedBy":"None","hidden":"Yes"},
    {"name":"Plague Mask","description":"A plague doctor mask, potentially with bits of skin still attached. While worn, Plague Goblins will no longer engage you or your belongings","price":"1 for 1","rarity":1,"spawnLocations":"None","usedBy":"None","hidden":"Yes"},
    {"name":"Smelter","description":"A portable crucible that can be used to melt down metals, Ink, and plastic.","price":"3 for 1","rarity":2,"spawnLocations":"All","usedBy":"None","hidden":"No"},
    {"name":"Fabric Cutter","description":"A portable machine operated by ambient energy in the air that will break down cloth-based materials.","price":"3 for 1","rarity":2,"spawnLocations":"All","usedBy":"None","hidden":"No"},
    {"name":"Fine Cloak","description":"A silky red cloak. While worn all charm, deception, and leadership checks remove one setback dice from the dice pool.","price":"5 for 1","rarity":4,"spawnLocations":"5","usedBy":"None","hidden":"Yes"},
    {"name":"Herbs","description":"A greenish brown plant-like substance. When making a medicine check, this herb may be used to automatically add a success and an advantage to the roll. This is a one-time use item.","price":"7 for 1","rarity":6,"spawnLocations":"All","usedBy":"None","hidden":"No"},
    {"name":"Thieves' Tools","description":"A collection of lockpicks, files, wires, and oil. When performing a skullduggery check, add an automatic advantage to the roll.","price":"6 for 1","rarity":5,"spawnLocations":"All","usedBy":"None","hidden":"No"},
    {"name":"Torch","description":"A wooden stick with oil-soaked cloth wrapped around the end of it. When lit, it lasts for 5 hours with a light out to short range and a light level of 4. When found its usually already used up.","price":"2 for 1","rarity":1,"spawnLocations":"Dark","usedBy":"None","hidden":"No"},
    {"name":"Aeropack","description":"A device that when worn allows you to fly for up to 30 minutes before running out of fuel. It can hold up to 1 liter of oil.","price":"8 for 1","rarity":7,"spawnLocations":"None","usedBy":"None","hidden":"No"},
    {"name":"Potion of Paralysis","description":"A viscious purple liquid, usually contained within some kind of glass enclosure. This liquid may coated onto a weapon. Whenever this liquid enters the blood stream, a difficulty 3 resilience check must be made or become immobilized for 3 rounds. In addition, any threats on a failure deal 1 strain damage.","price":"7 for 1","rarity":6,"spawnLocations":"None","usedBy":"None","hidden":"Yes"},
    {"name":"First Aid Kit","description":"A plastic box of basic medical needs such as bandages, painkillers, and alcohol for wounds. This kit nullifies the difficulty increase of medicine checks and gives 2 automatic successes to all medicine checks. It can be used 10 times.","price":"3 for 2","rarity":2,"spawnLocations":"None","usedBy":"None","hidden":"No"},
    {"name":"Painkiller","description":"A small red and white pill that when swallowed heals 5 - x wounds where x is the amount of painkillers already taken within 24 hours.","price":"1 for 5","rarity":1,"spawnLocations":"All","usedBy":"First Aid Kit","hidden":"No"},
    {"name":"Personal Access Device","description":"A small handheld computer, similar to a smart phone but thicker and bulkier.","price":"4 for 1","rarity":3,"spawnLocations":"Shops","usedBy":"None","hidden":"No"},
    {"name":"Communications Earpiece","description":"A little bean shaped bead that can be worn in the ear. Any number of these can be connected and allows communication between all others connected while within the same level.","price":"1 for 4","rarity":1,"spawnLocations":"Shops","usedBy":"None","hidden":"Yes"},
    {"name":"Portable Motion Sensor","description":"A small stand with what looks like a camera mounted on top. Any motion within the view of this camera sounds an alarm.","price":"4 for 1","rarity":3,"spawnLocations":"Shops","usedBy":"None","hidden":"Yes"},
    {"name":"Rubbing Alcohol","description":"A dark liquid used to clean wounds. When used, heal 3 wounds but take 1 strain. This can be used 5 times before running out.","price":"2 for 2","rarity":2,"spawnLocations":"All","usedBy":"First Aid Kit","hidden":"No"},
    {"name":"Death Rat Whistle","description":"A whistle that looks eerily close to an Aztec Death Whistle. When blown into, 6 death rats will appear, ready to do as you command.","price":"1 for 6","rarity":5,"spawnLocations":"Dangerous","usedBy":"None","hidden":"No"},
    {"name":"Air Tank","description":"A cylindrical metal tube with a flat bottom and a nozzle at the top. This holds 1 liter of air.","price":"1 for 2","rarity":1,"spawnLocations":"All","usedBy":"Aeropack/Gas Mask","hidden":"No"},
    {"name":"Barrel of Oil","description":"A metal barrel with an icon showing oil. This holds 3 liters of liquid.","price":"1 for 1","rarity":0,"spawnLocations":"1","usedBy":"Aeropack","hidden":"No"},
    {"name":"Glass Vial","description":"A small vial made of glass.","price":"4 for 1","rarity":0,"spawnLocations":"All","usedBy":"Potion of Paralysis","hidden":"No"},
    {"name":"Plastic Bottle","description":"A water bottle. It holds 1 liter of liquid.","price":"10 for 1","rarity":0,"spawnLocations":"All","usedBy":"None","hidden":"No"}]

  const addData = () => {
    for(let i = 0; i < data.length; i++) {
      setDoc(doc(db, 'MundaneObjects', data[i].name), {
        name: data[i].name,
        description: data[i].description,
        price: data[i].price,
        rarity: data[i].rarity,
        spawnLocations: data[i].spawnLocations,
        usedBy: data[i].usedBy,
        hidden: data[i].hidden
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

  const DisplayItems = () => {
    let empty = true;

    return (
      <Stack direction='row' flexWrap='wrap' gap={1}>
        {mundaneObjects.map((item) => {
          if(
            (item.hidden === 'No' || localStorage.getItem('loggedIn').toUpperCase() === 'ADMIN') &&
            (item.rarity === parseInt(rarity) || rarity === '-1') &&
            (item.name.toUpperCase().includes(name.toUpperCase()) || name === '')
          ) {
            empty = false;
            return <MundaneItem currMundane={item}/>
          }
        })}
        {empty ? <Typography>There are no objects that match your criteria.</Typography> : ""}
      </Stack>
    )
  }

  return (
    localStorage.getItem("loggedIn") === 'false' ? <NotLoggedIn /> :
      <Box>
        <Button onClick={addData}>Add</Button>
        {mundaneObjects.length > 0 ?
          <Box>
            <Stack direction={{xs: 'column', md: 'row'}} spacing={2} flexWrap='wrap' gap={1} paddingBottom={2}>
              <Box>
                <Input value={name} onChange={e => setName(e.target.value)} placeholder='Enter Name'></Input>
              </Box>
              <FormControl sx={{minWidth: 150}}>
                <InputLabel id="rarity">Select Rarity</InputLabel>
                <Select
                  labelId='rarity'
                  label={"Select Rarity"}
                  onChange={e => setRarity(e.target.value)}
                  value={rarity}
                >
                  <MenuItem value='-1'>Any</MenuItem>
                  <MenuItem value='0'>0</MenuItem>
                  <MenuItem value='1'>1</MenuItem>
                  <MenuItem value='2'>2</MenuItem>
                  <MenuItem value='3'>3</MenuItem>
                  <MenuItem value='4'>4</MenuItem>
                  <MenuItem value='5'>5</MenuItem>
                  <MenuItem value='6'>6</MenuItem>
                  <MenuItem value='7'>7</MenuItem>
                  <MenuItem value='8'>8</MenuItem>
                  <MenuItem value='9'>9</MenuItem>
                  <MenuItem value='10'>10</MenuItem>
                </Select>
              </FormControl>
            </Stack>
            <DisplayItems />
          </Box>
        :
          getFromDB()
        }
      </Box>
  )
}