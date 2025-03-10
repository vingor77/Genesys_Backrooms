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
  const [open, setOpen] = useState(false);

  const data = [{"name":"AA Battery","description":"A standard 2 inch long and 0.5 inch diameter single cell cylindrical dry battery. This battery can store up to 2,500 milliampere hours or mAH and discharges 1.5 volts.","price":"2 for 4","rarity":"5","spawnLocations":"All","usedBy":"Flashlight","hidden":"No","craftingMaterial":"N"},
    {"name":"C Battery","description":"A standard 2 inch long and 1 inch diameter single cell cylindrical dry battery.  This battery can store up to 7,800 milliampere hours or mAH and discharges 1.5 volts.","price":"4 for 4","rarity":"6","spawnLocations":"All","usedBy":"Lantern","hidden":"No","craftingMaterial":"N"},
    {"name":"D Battery","description":"A standard 2.4 inch long and 1.3 inch diameter single cell cylindrical dry battery.  This battery can store up to 10,000 milliampere hours or mAH and discharges 1.5 volts.","price":"5 for 4","rarity":"7","spawnLocations":"All","usedBy":"Lantern","hidden":"No","craftingMaterial":"N"},
    {"name":"AAA Battery","description":"A standard 1.75 inch long and 0.4 inch diameter single cell cylindrical dry battery.  This battery can store up to 750 milliampere hours or mAH and discharges 1.5 volts.","price":"1 for 4","rarity":"2","spawnLocations":"All","usedBy":"Flashlight","hidden":"No","craftingMaterial":"N"},
    {"name":"Specialty Fuel","description":"A dark viscous liquid. It smells heavily of gasoline.","price":"1 for 1 liter","rarity":"1","spawnLocations":"All","usedBy":"Hyrum Lanters/Deuclidators","hidden":"Yes","craftingMaterial":"N"},
    {"name":"Dumb Gum","description":"A hot pink piece of taffy-like gum. The surface is reflective, like glass.","price":"1 for 10","rarity":"4","spawnLocations":"All","usedBy":"None","hidden":"Yes","craftingMaterial":"N"},
    {"name":"Specialty Beaker","description":"A gray-tinted beaker with no markings on the sides.","price":"1 for 5","rarity":"1","spawnLocations":"All","usedBy":"Liquid Silence/Liquid Pain","hidden":"Yes","craftingMaterial":"N"},
    {"name":"AAAA Battery","description":"A standard 1.7 inch long and 0.3 inch diameter single cell cylindrical dry battery.  This battery can store up to 550 milliampere hours or mAH and discharges 1.5 volts.","price":"1 for 4","rarity":"1","spawnLocations":"All","usedBy":"Flashlight","hidden":"No","craftingMaterial":"N"},
    {"name":"9v Battery","description":"A rectangular 0.7 inch by 1 inch by 2 inch electrical battery that. This battery can store up to 1,000 milliampere hours or mAH and discharges 9 volts.","price":"2 for 4","rarity":"3","spawnLocations":"All","usedBy":"Lantern","hidden":"No","craftingMaterial":"N"},
    {"name":"A23 Battery","description":"A standard 1.1 inch long and 0.4 inch diameter single cell cylindrical dry battery. This battery can store up to 55 milliampere hours or mAH and discharges 12 volts.","price":"1 for 4","rarity":"0","spawnLocations":"All","usedBy":"Flashlight","hidden":"No","craftingMaterial":"N"},
    {"name":"N Battery","description":"A standard 1.2 inch long and 0.5 inch diameter single cell cylindrical dry battery. This battery can store up to 1,000 milliampere hours or mAH and discharges 1.5 volts.","price":"1 for 4","rarity":"4","spawnLocations":"All","usedBy":"Lantern","hidden":"No","craftingMaterial":"N"},
    {"name":"Flashlight","description":"A hand-held device that lights up an area. The battery type, power, and range are variable and decided when found. This device can use AA, AAA, AAAA, and A23 batteries.","price":"3 for 1","rarity":"2","spawnLocations":"All","usedBy":"None","hidden":"No","craftingMaterial":"N"},
    {"name":"Lantern","description":"A hand-held device that lights up an area. The battery type, power, and range are variable and decided when found. This device can use 9V, N, C, and D batteries.","price":"6 for 1","rarity":"5","spawnLocations":"All","usedBy":"None","hidden":"No","craftingMaterial":"N"},
    {"name":"Armorer's Tools","description":"Tools used to craft armor and other metal objects that aren't weapons or jewelry","price":"1 for 1","rarity":"1","spawnLocations":"All","usedBy":"None","hidden":"No","craftingMaterial":"N"},
    {"name":"Blacksmith Tools","description":"Tools used to craft weapons","price":"1 for 1","rarity":"1","spawnLocations":"All","usedBy":"None","hidden":"No","craftingMaterial":"N"},
    {"name":"Goldsmith Tools","description":"Tools used to craft jewelry and anything with gems","price":"1 for 1","rarity":"1","spawnLocations":"All","usedBy":"None","hidden":"No","craftingMaterial":"N"},
    {"name":"Leatherworker's Tools","description":"Tools used to craft anything to do with leather","price":"1 for 1","rarity":"1","spawnLocations":"All","usedBy":"None","hidden":"No","craftingMaterial":"N"},
    {"name":"Weaver's Tools","description":"Tools used to craft anything to do with cloth or fibers","price":"1 for 1","rarity":"1","spawnLocations":"All","usedBy":"None","hidden":"No","craftingMaterial":"N"},
    {"name":"Alchemist Tools","description":"Tools used to craft concoctions and potions","price":"1 for 1","rarity":"1","spawnLocations":"All","usedBy":"None","hidden":"No","craftingMaterial":"N"},
    {"name":"Carpenter Tools","description":"Tools used to craft anything involving wood as the primary substance","price":"1 for 1","rarity":"1","spawnLocations":"All","usedBy":"None","hidden":"No","craftingMaterial":"N"},
    {"name":"Culinarian Tools","description":"Tools used to cook","price":"1 for 1","rarity":"1","spawnLocations":"All","usedBy":"None","hidden":"No","craftingMaterial":"N"},
    {"name":"Miner tools","description":"Tools used to gather rock, ore, and water deposits","price":"1 for 1","rarity":"1","spawnLocations":"All","usedBy":"None","hidden":"No","craftingMaterial":"N"},
    {"name":"Botanist tools","description":"Tools used to gather natural resources","price":"1 for 1","rarity":"1","spawnLocations":"All","usedBy":"None","hidden":"No","craftingMaterial":"N"},
    {"name":"Basic Backpack","description":"A brown sack with two straps and a velcrow holding the opening shut. While worn, your encumbrance threshold increases by 4.","price":"4 for 1","rarity":"3","spawnLocations":"All","usedBy":"None","hidden":"No","craftingMaterial":"N"},
    {"name":"Plague Cloak","description":"A purple cloak exterior with a smooth red interior color. While worn, Plague Goblins will no longer engage you or your belongings","price":"1 for 1","rarity":"1","spawnLocations":"None","usedBy":"None","hidden":"Yes","craftingMaterial":"N"},
    {"name":"Plague Mask","description":"A plague doctor mask, potentially with bits of skin still attached. While worn, Plague Goblins will no longer engage you or your belongings","price":"1 for 1","rarity":"1","spawnLocations":"None","usedBy":"None","hidden":"Yes","craftingMaterial":"N"},
    {"name":"Smelter","description":"A portable crucible that can be used to melt down metals, Ink, and plastic.","price":"3 for 1","rarity":"2","spawnLocations":"All","usedBy":"None","hidden":"No","craftingMaterial":"N"},
    {"name":"Fabric Cutter","description":"A portable machine operated by ambient energy in the air that will break down cloth-based materials.","price":"3 for 1","rarity":"2","spawnLocations":"All","usedBy":"None","hidden":"No","craftingMaterial":"N"},
    {"name":"Fine Cloak","description":"A silky red cloak. While worn all charm, deception, and leadership checks remove one setback dice from the dice pool.","price":"5 for 1","rarity":"4","spawnLocations":"5","usedBy":"None","hidden":"Yes","craftingMaterial":"N"},
    {"name":"Herbs","description":"A greenish brown plant-like substance. When making a medicine check, this herb may be used to automatically add a success and an advantage to the roll. This is a one-time use item.","price":"7 for 1","rarity":"6","spawnLocations":"All","usedBy":"None","hidden":"No","craftingMaterial":"Y"},
    {"name":"Thieves' Tools","description":"A collection of lockpicks, files, wires, and oil. When performing a skullduggery check, add an automatic advantage to the roll.","price":"6 for 1","rarity":"5","spawnLocations":"All","usedBy":"None","hidden":"No","craftingMaterial":"N"},
    {"name":"Torch","description":"A wooden stick with oil-soaked cloth wrapped around the end of it. When lit, it lasts for 5 hours with a light out to short range and a light level of 4. When found its usually already used up.","price":"2 for 1","rarity":"1","spawnLocations":"Dark","usedBy":"None","hidden":"No","craftingMaterial":"N"},
    {"name":"Gas Mask","description":"A mask with two circular filters on the sides and a full face shield. While worn in the head slot, atmospheric hazards do not affect you. A tank may be hooked up with air to allow you to breathe underwater for 1 hour before running out. Found usually cracked or broken.","price":"5 for 1","rarity":"4","spawnLocations":"Dangerous","usedBy":"None","hidden":"No","craftingMaterial":"N"},
    {"name":"Air Tank","description":"A large tank full of breathable air.","price":"3 for 1","rarity":"2","spawnLocations":"Outdoors","usedBy":"Gas Mask","hidden":"No","craftingMaterial":"Y"},
    {"name":"Aeropack","description":"A device that when worn allows you to fly for up to 30 minutes before running out of fuel. It can hold up to 1 liter of oil.","price":"8 for 1","rarity":"7","spawnLocations":"None","usedBy":"None","hidden":"No","craftingMaterial":"N"},
    {"name":"Barrel of Oil","description":"A small metal drum filled with oil. It can hold 3 liters.","price":"6 for 1","rarity":"5","spawnLocations":"Indoors","usedBy":"Aeropack/Torch","hidden":"No","craftingMaterial":"Y"},
    {"name":"Potion of Paralysis","description":"A viscious purple liquid, usually contained within some kind of glass enclosure. This liquid may coated onto a weapon. Whenever this liquid enters the blood stream, a difficulty 3 resilience check must be made or become immobilized for 3 rounds. In addition, any threats on a failure deal 1 strain damage.","price":"7 for 1 vial","rarity":"6","spawnLocations":"None","usedBy":"None","hidden":"Yes","craftingMaterial":"N"},
    {"name":"Glass Vial","description":"A small and sturdy circular glass enclosure.","price":"1 for 3","rarity":"1","spawnLocations":"All","usedBy":"Potion of Paralysis","hidden":"No","craftingMaterial":"Y"},
    {"name":"First Aid Kit","description":"A plastic box of basic medical needs such as bandages, painkillers, and alcohol for wounds. This kit nullifies the difficulty increase of medicine checks and gives 2 automatic successes to all medicine checks. It can be used any number of times.","price":"3 for 2","rarity":"2","spawnLocations":"None","usedBy":"None","hidden":"No","craftingMaterial":"N"},
    {"name":"Night Vision Goggles","description":"A matte black pair of goggles with 4 lenses. While worn in the head slot, remove 2 setback dice gained from concealment.","price":"8 for 1","rarity":"7","spawnLocations":"Dark","usedBy":"None","hidden":"No","craftingMaterial":"N"},
    {"name":"Painkiller","description":"A small red and white pill that when swallowed heals 5 - x wounds where x is the amount of painkillers already taken within 24 hours.","price":"1 for 5","rarity":"1","spawnLocations":"All","usedBy":"First Aid Kit","hidden":"No","craftingMaterial":"Y"},
    {"name":"Rope","description":"A 10 to 100 foot long rope.","price":"Varies","rarity":"1","spawnLocations":"All","usedBy":"First Aid Kit","hidden":"No","craftingMaterial":"Y"},
    {"name":"Personal Access Device","description":"A small handheld computer, similar to a smart phone but thicker and bulkier.","price":"4 for 1","rarity":"3","spawnLocations":"Shops","usedBy":"None","hidden":"No","craftingMaterial":"N"},
    {"name":"Communications Earpiece","description":"A little bean shaped bead that can be worn in the ear. Any number of these can be connected and allows communication between all others connected while within the same level.","price":"1 for 4","rarity":"1","spawnLocations":"Shops","usedBy":"None","hidden":"Yes","craftingMaterial":"N"},
    {"name":"Portable Motion Sensor","description":"A small stand with what looks like a camera mounted on top. Any motion within the view of this camera sounds an alarm.","price":"4 for 1","rarity":"3","spawnLocations":"Shops","usedBy":"None","hidden":"Yes","craftingMaterial":"N"},
    {"name":"Rubbing Alcohol","description":"A dark liquid used to clean wounds. When used, heal 3 wounds but take 1 strain. This can be used 5 times before running out.","price":"2 for 2","rarity":"2","spawnLocations":"All","usedBy":"First Aid Kit","hidden":"No","craftingMaterial":"Y"},
    {"name":"Plastic Bottle","description":"A contained made out of plastic with a twist-off plastic lid. It can hold 1 liter of liquid.","price":"1 for 6","rarity":"1","spawnLocations":"All","usedBy":"Rubbing Alcohol","hidden":"No","craftingMaterial":"Y"},
    {"name":"Iron","description":"N/A","price":"N/A","rarity":"N/A","spawnLocations":"N/A","usedBy":"N/A","hidden":"No","craftingMaterial":"Y"},
    {"name":"Steel","description":"N/A","price":"N/A","rarity":"N/A","spawnLocations":"N/A","usedBy":"N/A","hidden":"No","craftingMaterial":"Y"},
    {"name":"Wood","description":"N/A","price":"N/A","rarity":"N/A","spawnLocations":"N/A","usedBy":"N/A","hidden":"No","craftingMaterial":"Y"},
    {"name":"Cotton","description":"N/A","price":"N/A","rarity":"N/A","spawnLocations":"N/A","usedBy":"N/A","hidden":"No","craftingMaterial":"Y"},
    {"name":"Acid","description":"N/A","price":"N/A","rarity":"N/A","spawnLocations":"N/A","usedBy":"N/A","hidden":"No","craftingMaterial":"Y"},
    {"name":"Leather","description":"N/A","price":"N/A","rarity":"N/A","spawnLocations":"N/A","usedBy":"N/A","hidden":"No","craftingMaterial":"Y"},
    {"name":"Clear Blood","description":"N/A","price":"N/A","rarity":"N/A","spawnLocations":"N/A","usedBy":"N/A","hidden":"No","craftingMaterial":"Y"},
    {"name":"Copper","description":"N/A","price":"N/A","rarity":"N/A","spawnLocations":"N/A","usedBy":"N/A","hidden":"No","craftingMaterial":"Y"},
    {"name":"Coal","description":"N/A","price":"N/A","rarity":"N/A","spawnLocations":"N/A","usedBy":"N/A","hidden":"No","craftingMaterial":"Y"},
    {"name":"Silk","description":"N/A","price":"N/A","rarity":"N/A","spawnLocations":"N/A","usedBy":"N/A","hidden":"No","craftingMaterial":"Y"},
    {"name":"Gold","description":"N/A","price":"N/A","rarity":"N/A","spawnLocations":"N/A","usedBy":"N/A","hidden":"No","craftingMaterial":"Y"},
    {"name":"Glass","description":"N/A","price":"N/A","rarity":"N/A","spawnLocations":"N/A","usedBy":"N/A","hidden":"No","craftingMaterial":"Y"},
    {"name":"Plastic","description":"N/A","price":"N/A","rarity":"N/A","spawnLocations":"N/A","usedBy":"N/A","hidden":"No","craftingMaterial":"Y"},
    {"name":"Clay","description":"N/A","price":"N/A","rarity":"N/A","spawnLocations":"N/A","usedBy":"N/A","hidden":"No","craftingMaterial":"Y"},
    {"name":"Ink","description":"N/A","price":"N/A","rarity":"N/A","spawnLocations":"N/A","usedBy":"N/A","hidden":"No","craftingMaterial":"Y"},
    {"name":"Felt","description":"N/A","price":"N/A","rarity":"N/A","spawnLocations":"N/A","usedBy":"N/A","hidden":"No","craftingMaterial":"Y"}]

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