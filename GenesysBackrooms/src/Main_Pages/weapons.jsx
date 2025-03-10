import { Box, Button, FormControl, Input, InputLabel, MenuItem, Select, Stack, Toolbar, Typography } from "@mui/material";
import { collection, doc, onSnapshot, orderBy, query, setDoc } from "firebase/firestore";
import db from '../Components/firebase';
import { useState } from "react";
import WeaponItem from "../Components/weaponItem";
import NotLoggedIn from "../Components/notLoggedIn";

export default function Weapons() {
  const [weapons, setWeapons] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('-1');
  const [rarity, setRarity] = useState('-1');
  const [setBonus, setSetBonus] = useState('-');

  const data = [{"name":"Axe","description":"A typical single-blade axe with a wooden handle","skill":"Melee","damage":3,"crit":3,"range":"Engaged","encumbrance":2,"price":2,"rarity":1,"specials":"Vicious 1/Dual-wield","durability":3,"spawnLocations":"All","setBonus":"None","anomalousEffect":"None","hidden":"No","repairSkill":"Carpenter"},
    {"name":"Greataxe","description":"A double sided metallic axe with a wooden handle","skill":"Melee","damage":4,"crit":3,"range":"Engaged","encumbrance":4,"price":5,"rarity":4,"specials":"Cumbersome 3/Pierce 2/Vicious 1","durability":3,"spawnLocations":"All","setBonus":"None","anomalousEffect":"None","hidden":"No","repairSkill":"Blacksmith"},
    {"name":"Halberd","description":"A polearm with a blade at the tip and side of the tip","skill":"Melee","damage":3,"crit":3,"range":"Engaged","encumbrance":5,"price":4,"rarity":3,"specials":"Defensive 1/Pierce 3/Reach","durability":3,"spawnLocations":"All","setBonus":"None","anomalousEffect":"None","hidden":"No","repairSkill":"Blacksmith"},
    {"name":"Knife","description":"A simple steel knife that looks like its used to cut steak.","skill":"Melee","damage":1,"crit":3,"range":"Engaged","encumbrance":1,"price":2,"rarity":1,"specials":"None","durability":3,"spawnLocations":"All","setBonus":"None","anomalousEffect":"None","hidden":"No","repairSkill":"Blacksmith"},
    {"name":"Tear Gas","description":"A small cannister that releases visible smoke when the pin is pulled.","skill":"Ranged","damage":2,"crit":0,"range":"Short","encumbrance":1,"price":3,"rarity":2,"specials":"Blast 3/Stun Damage/Disorient 2/Limited Ammo 1/Burn 3/Breaking","durability":1,"spawnLocations":"All","setBonus":"None","anomalousEffect":"None","hidden":"No","repairSkill":"Alchemist"},
    {"name":"Bola","description":"A group of 3 stone balls attacked by a long and slender rope.","skill":"Ranged","damage":5,"crit":3,"range":"Short","encumbrance":1,"price":5,"rarity":4,"specials":"Knockdown/Accurate 2/Ensnare/Limited Ammo 1/Unwieldy 3","durability":5,"spawnLocations":"All","setBonus":"None","anomalousEffect":"None","hidden":"No","repairSkill":"Weaver"},
    {"name":"Boomerang","description":"A curved piece of wood that upon being thrown, will return to the thrower.","skill":"Ranged","damage":3,"crit":2,"range":"Medium","encumbrance":0,"price":2,"rarity":1,"specials":"Vicious 2/Stun 2/Limited Ammo 1/Concussive 1/Unwieldy 4","durability":4,"spawnLocations":"All","setBonus":"None","anomalousEffect":"None","hidden":"No","repairSkill":"Carpenter"},
    {"name":"Crossbow","description":"A mechanism with a short bow affixed to a stock.","skill":"Ranged","damage":7,"crit":2,"range":"Medium","encumbrance":3,"price":5,"rarity":4,"specials":"Pierce 2/Prepare 1","durability":3,"spawnLocations":"All","setBonus":"None","anomalousEffect":"None","hidden":"No","repairSkill":"Blacksmith"},
    {"name":"Longbow","description":"A large bow","skill":"Ranged","damage":8,"crit":3,"range":"Long","encumbrance":3,"price":5,"rarity":4,"specials":"Unwieldy 3","durability":3,"spawnLocations":"All","setBonus":"None","anomalousEffect":"None","hidden":"No","repairSkill":"Carpenter"},
    {"name":"Flame Thrower","description":"A backpack with two tanks full of gasoline and a nozel connected that spews flames","skill":"Ranged","damage":4,"crit":0,"range":"Short","encumbrance":3,"price":9,"rarity":8,"specials":"Auto-Fire/Burn 5/Limited Ammo 50","durability":3,"spawnLocations":"All","setBonus":"None","anomalousEffect":"None","hidden":"Yes","repairSkill":"Blacksmith"},
    {"name":"Crude Club","description":"A heavy stick","skill":"Melee","damage":2,"crit":3,"range":"Engaged","encumbrance":2,"price":1,"rarity":0,"specials":"Concussive 1/Inferior/Breaking","durability":3,"spawnLocations":"All","setBonus":"None","anomalousEffect":"None","hidden":"No","repairSkill":"Carpenter"},
    {"name":"Spear","description":"A long wooden shaft with a sharp metal point","skill":"Melee","damage":2,"crit":4,"range":"Engaged","encumbrance":2,"price":2,"rarity":1,"specials":"Defensive 1/Accurate 1/Reach","durability":3,"spawnLocations":"All","setBonus":"None","anomalousEffect":"None","hidden":"No","repairSkill":"Blacksmith"},
    {"name":"Pike","description":"A long heavy wooden shaft with a small leaf-shaped steel point","skill":"Melee","damage":4,"crit":3,"range":"Short","encumbrance":5,"price":6,"rarity":5,"specials":"Pierce 2/Defense 1/Innacurate 1/Cumbersome 4","durability":3,"spawnLocations":"All","setBonus":"None","anomalousEffect":"None","hidden":"No","repairSkill":"Carpenter"},
    {"name":"Sword","description":"A straightened metal blade with a wide base and a pointy tip","skill":"Melee","damage":3,"crit":2,"range":"Engaged","encumbrance":1,"price":3,"rarity":2,"specials":"Defensive 1","durability":3,"spawnLocations":"All","setBonus":"None","anomalousEffect":"None","hidden":"No","repairSkill":"Blacksmith"},
    {"name":"Saber","description":"A thin metal blade with a piercing tip","skill":"Melee","damage":2,"crit":2,"range":"Engaged","encumbrance":1,"price":3,"rarity":2,"specials":"Pierce 1","durability":3,"spawnLocations":"All","setBonus":"None","anomalousEffect":"None","hidden":"No","repairSkill":"Blacksmith"},
    {"name":"Tomahawk","description":"A smaller single-sided hatchet. It can be thrown.","skill":"Melee","damage":2,"crit":3,"range":"Engaged","encumbrance":1,"price":2,"rarity":1,"specials":"None","durability":3,"spawnLocations":"All","setBonus":"None","anomalousEffect":"None","hidden":"No","repairSkill":"Carpenter"},
    {"name":"Grenade","description":"A small, usually green, egg-shaped device with a pin","skill":"Ranged","damage":8,"crit":3,"range":"Short","encumbrance":1,"price":7,"rarity":6,"specials":"Blast 5/Burn 1/Limited Ammo 1","durability":1,"spawnLocations":"All","setBonus":"None","anomalousEffect":"None","hidden":"No","repairSkill":"Blacksmith"},
    {"name":"Bazooka","description":"A large tube with two handles","skill":"Gunnery","damage":20,"crit":2,"range":"Extreme","encumbrance":8,"price":10,"rarity":9,"specials":"Blast 10/Breach 2/Cumbersome 3/Guided 3/Limited Ammo 1/Prepare 1","durability":3,"spawnLocations":"All","setBonus":"None","anomalousEffect":"None","hidden":"Yes","repairSkill":"Blacksmith"},
    {"name":"Blowgun","description":"A small bamboo tube","skill":"Ranged","damage":2,"crit":5,"range":"Short","encumbrance":0,"price":1,"rarity":0,"specials":"None","durability":1,"spawnLocations":"All","setBonus":"None","anomalousEffect":"None","hidden":"No","repairSkill":"Carpenter"},
    {"name":"Carbine","description":"A light, short-barelled rifle.","skill":"Ranged","damage":8,"crit":3,"range":"Long","encumbrance":2,"price":5,"rarity":4,"specials":"Accurate 1/Limited Ammo 2","durability":3,"spawnLocations":"All","setBonus":"None","anomalousEffect":"None","hidden":"No","repairSkill":"Blacksmith"},
    {"name":"Pistol","description":"A small black barrel with a grip and a trigger","skill":"Ranged","damage":6,"crit":3,"range":"Medium","encumbrance":1,"price":4,"rarity":3,"specials":"None","durability":3,"spawnLocations":"All","setBonus":"None","anomalousEffect":"None","hidden":"No","repairSkill":"Blacksmith"},
    {"name":"Revolver","description":"Similar to a pistol but with a cylinder that rotates","skill":"Ranged","damage":6,"crit":4,"range":"Medium","encumbrance":2,"price":5,"rarity":4,"specials":"Accurate 1/Limited Ammo 6","durability":3,"spawnLocations":"All","setBonus":"None","anomalousEffect":"None","hidden":"No","repairSkill":"Blacksmith"},
    {"name":"Shotgun","description":"A smoothbore shoulder weapon that fires multiple pellets","skill":"Ranged","damage":8,"crit":3,"range":"Short","encumbrance":3,"price":4,"rarity":3,"specials":"Blast 4/Knockdown/Vicious 2","durability":3,"spawnLocations":"All","setBonus":"None","anomalousEffect":"None","hidden":"No","repairSkill":"Blacksmith"},
    {"name":"AK-47","description":"A shoulder weapon with a wooden handle and stock and a long curved metal casing for ammunition","skill":"Ranged","damage":8,"crit":3,"range":"Long","encumbrance":4,"price":8,"rarity":7,"specials":"Auto-fire","durability":3,"spawnLocations":"All","setBonus":"None","anomalousEffect":"None","hidden":"No","repairSkill":"Blacksmith"},
    {"name":"Browning Automatic Rifle","description":"A large rifle with a stand at the tip of the barrel and a metallic clip","skill":"Gunnery","damage":10,"crit":3,"range":"Long","encumbrance":6,"price":7,"rarity":6,"specials":"Auto-fire/Cumbersome 2/Pierce 2/Vicious 2","durability":3,"spawnLocations":"All","setBonus":"None","anomalousEffect":"None","hidden":"No","repairSkill":"Blacksmith"},
    {"name":"Uzi","description":"A compact automatic weapon","skill":"Ranged","damage":5,"crit":3,"range":"Medium","encumbrance":2,"price":7,"rarity":6,"specials":"Auto-fire","durability":2,"spawnLocations":"All","setBonus":"None","anomalousEffect":"None","hidden":"No","repairSkill":"Blacksmith"},
    {"name":"Antimatter Rifle","description":"A rifle about the same size as a bazooka complete with blue-ish symbols plastered on the sides","skill":"Gunnery","damage":20,"crit":3,"range":"Extreme","encumbrance":5,"price":10,"rarity":9,"specials":"Auto-fire/Burn 6/Limited Ammo 24/Breach 1/Prepare 3","durability":5,"spawnLocations":"All","setBonus":"None","anomalousEffect":"If the weapon does not kill the target, the target takes an extra 10 strain damage.","hidden":"Yes","repairSkill":"Blacksmith"},
    {"name":"Laser Pistol","description":"A pistol with glowing blue stripes","skill":"Ranged","damage":6,"crit":3,"range":"Short","encumbrance":2,"price":8,"rarity":7,"specials":"Accurate 1/Burn 1","durability":3,"spawnLocations":"All","setBonus":"None","anomalousEffect":"None","hidden":"No","repairSkill":"Goldsmith"},
    {"name":"Laser Rifle","description":"An AK-47 with glowing blue stripes","skill":"Ranged","damage":8,"crit":3,"range":"Medium","encumbrance":4,"price":8,"rarity":7,"specials":"Accurate 1/Burn 1","durability":3,"spawnLocations":"All","setBonus":"None","anomalousEffect":"None","hidden":"No","repairSkill":"Goldsmith"},
    {"name":"Retributor","description":"A simple old-style handgun, similar to a revolver","skill":"Ranged","damage":4,"crit":2,"range":"Short","encumbrance":0,"price":250,"rarity":10,"specials":"Breach 1/Stun 6","durability":100,"spawnLocations":"None","setBonus":"Holy Set","anomalousEffect":"Ammunition is not required for this weapon to fire. In addition, whenever this weapon deals the killing blow, it steals the soul and converts it into a physical soul bottle.","hidden":"Yes","repairSkill":"None"},
    {"name":"Red Knight's Replica Sword","description":"A subtle red glow surrounding a blood red blade","skill":"Melee","damage":10,"crit":2,"range":"Engaged","encumbrance":1,"price":6000,"rarity":10,"specials":"Pierce 4/Defensive 2/Superior/Vicious 4","durability":100,"spawnLocations":"None","setBonus":"Red Knight Replica Set","anomalousEffect":"When an attack is successful, a triumph may be spent to open a rift near the target. The target must then succeed on a difficulty 4 Athletics or Coordination check to not be sucked in, dying immediately. On a success however, the target loses something of the attacker's choosing whether it be a non-essential body part, a piece of gear, or some kind of memory.","hidden":"Yes","repairSkill":"None"},
    {"name":"Chechov's Gun","description":"A wooden-colored single shot rifle","skill":"Ranged","damage":8,"crit":3,"range":"Long","encumbrance":4,"price":30,"rarity":10,"specials":"Limited Ammo 1","durability":5,"spawnLocations":"None","setBonus":"None","anomalousEffect":"Ammunition is not required to fire this weapon. The firing mechanism is completely silent. This weapon only appears when near death and as it appears, a single shot that does 30 unsoakable wound damage is loaded.","hidden":"Yes","repairSkill":"Blacksmith"},
    {"name":"Shield","description":"A small circular piece of wood with a metal plate in the center.","skill":"Melee","damage":0,"crit":6,"range":"Engaged","encumbrance":2,"price":1,"rarity":0,"specials":"Defensive 1/Deflection 1/Inaccurate 1/Knockdown","durability":3,"spawnLocations":"All","setBonus":"None","anomalousEffect":"None","hidden":"No","repairSkill":"Armorer"},
    {"name":"Red Knight's Replica Shield","description":"A bulky crimson red tower shield with spiky pieces of metal pointing outwards. This may not be dual-wielded","skill":"Melee","damage":5,"crit":0,"range":"Engaged","encumbrance":3,"price":6000,"rarity":10,"specials":"Defensive 1/Deflection 1/Superior/Knockdown","durability":100,"spawnLocations":"None","setBonus":"Red Knight Replica Set","anomalousEffect":"While wielding this shield, whenever an attack is failed against you, you may spend your out-of-turn-incidental to attack.","hidden":"Yes","repairSkill":"None"},
    {"name":"Plastic Hammer","description":"A large mallet-like hammer made entirely of hardened plastic.","skill":"Melee","damage":6,"crit":3,"range":"Engaged","encumbrance":3,"price":4,"rarity":3,"specials":"Concussive 1","durability":2,"spawnLocations":"None","setBonus":"None","anomalousEffect":"None","hidden":"No","repairSkill":"None"},
    {"name":"Static Grenade Launcher","description":"A bright and unstable piece of unknown weaponry that constantly shifts with the similar feature always being a trigger, a grip, and a barrel.","skill":"Ranged","damage":41,"crit":3,"range":"Medium","encumbrance":0,"price":0,"rarity":10,"specials":"Blast 5/Burn 1/Limited Ammo 6","durability":100,"spawnLocations":"None","setBonus":"Glitched","anomalousEffect":"After shooting with this weapon, the area where it exploded becomes a glitchy mess. All checks made within the area automatically recieves a despair.","hidden":"Yes","repairSkill":"None"},
    {"name":"Sword of Static","description":"A bright and unstable sword that changes forms constantly yet the blade remains the same length.","skill":"Melee","damage":34,"crit":1,"range":"Engaged","encumbrance":0,"price":0,"rarity":10,"specials":"Breach 2/Disorient 4/Stun Damage/Stun 6/Superior/Vicious 4","durability":100,"spawnLocations":"None","setBonus":"Glitched","anomalousEffect":"Whenever you hit with this weapon, the target gains the Glitched phenomenon permanently. If the target already has this effect, instead inflict a despair on its next check.","hidden":"Yes","repairSkill":"None"},
    {"name":"Magicked Brush and Palette","description":"A pure white brush with a fine tip where the bristles meet and a long wooden handle roughly 3 feet long accompanied by a light brown tray full of colored paints that never seem to run out.","skill":"None","damage":0,"crit":0,"range":"Short","encumbrance":2,"price":2500,"rarity":10,"specials":"Breaking","durability":100,"spawnLocations":"None","setBonus":"None","anomalousEffect":"As an action, this brush may summon any entity of difficulty 1 or lower to help fight. This entity has half of its wounds and strain and deals stun damage only. While paired with the infinite bucket of paint, up to a difficulty 2 entity may be summoned and the health totals are not halved. There may only be 1 entity summoned at a time, 2 with the infinite bucket of paint.","hidden":"Yes","repairSkill":"Carpenter"}]
    
  const addData = () => {
    for(let i = 0; i < data.length; i++) {
      setDoc(doc(db, 'Weapons', data[i].name), {
        name: data[i].name,
        description: data[i].description,
        skill: data[i].skill,
        damage: data[i].damage,
        crit: data[i].crit,
        range: data[i].range,
        encumbrance: data[i].encumbrance,
        price: data[i].price,
        rarity: data[i].rarity,
        specials: data[i].specials,
        durability: data[i].durability,
        spawnLocations: data[i].spawnLocations,
        setBonus: data[i].setBonus,
        anomalousEffect: data[i].anomalousEffect,
        hidden: data[i].hidden,
        repairSkill: data[i].repairSkill
      })
    }
  }

  const getFromDB = () => {
    const q = query(collection(db, 'Weapons'), orderBy("name", "asc"));

    const unsub = onSnapshot(q, (querySnapshot) => {
      const queryData = [];
      querySnapshot.forEach((doc) => {
        queryData.push(doc.data());
      })
      setWeapons(queryData);
    })

    return () => {
      unsub();
    }
  }

  const DisplayItems = () => {
    let empty = true;

    return (
      <Stack direction='row' flexWrap='wrap' gap={1}>
        {weapons.map((item) => {
          if(
            (item.hidden === 'No' || localStorage.getItem('loggedIn').toUpperCase() === 'ADMIN') &&
            (item.price === parseInt(price) || (item.price >= 10 && parseInt(price) === 10) || price === '-1') &&
            (item.rarity === parseInt(rarity) || rarity === '-1') &&
            (item.name.toUpperCase().includes(name.toUpperCase()) || name === '' || item.setBonus.toUpperCase().includes(name.toUpperCase())) &&
            (item.setBonus === setBonus || setBonus === '-')
          ) {
            empty = false;
            return <WeaponItem currWeapon={item}/>
          }
        })}
        {empty ? <Typography>There are no weapons that match your criteria.</Typography> : ""}
      </Stack>
    )
  }

  const getSetBonusList = () => {
    const bonusList = [];

    for(let i = 0; i < weapons.length; i++) {
      let count = 0;
      for(let j = 0; j < bonusList.length; j++) {
        if(weapons[i].setBonus === bonusList[j]) {
          count++;
          break;
        }
      }
      if(count === 0 && weapons[i].setBonus !== 'None') bonusList.push(weapons[i].setBonus)
    }

    return bonusList.map((bonus, index) => {
      return <MenuItem value={bonus} key={index}>{bonus}</MenuItem>
    })
  }

  return (
    localStorage.getItem("loggedIn") === 'false' ? <NotLoggedIn /> : 
      <Box>
        <Button onClick={addData}>Add</Button>
        {weapons.length > 0 ?
          <Box>
            <Stack direction={{xs: 'column', md: 'row'}} spacing={2} flexWrap='wrap' gap={1} paddingBottom={2}>
              <Box>
                <Input value={name} onChange={e => setName(e.target.value)} placeholder='Enter Name'></Input>
              </Box>
              <FormControl sx={{minWidth: 150}}>
                <InputLabel id="price">Select Price</InputLabel>
                <Select
                  labelId='price'
                  label={"Select Price"}
                  onChange={e => setPrice(e.target.value)}
                  value={price}
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
                  <MenuItem value='10'>10+</MenuItem>
                </Select>
              </FormControl>
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
              <FormControl sx={{minWidth: 150}}>
                <InputLabel id="rarity">Select Set Bonus</InputLabel>
                <Select
                  labelId='setBonus'
                  label={"Select Set Bonus"}
                  onChange={e => setSetBonus(e.target.value)}
                  value={setBonus}
                >
                  <MenuItem value='-'>No Set</MenuItem>
                  {getSetBonusList()}
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