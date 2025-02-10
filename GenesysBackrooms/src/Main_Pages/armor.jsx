import { Box, Button, FormControl, Input, InputLabel, MenuItem, Select, Stack, Toolbar, Typography } from "@mui/material";
import { collection, doc, onSnapshot, orderBy, query, setDoc } from "firebase/firestore";
import db from '../Components/firebase';
import { useState } from "react";
import ArmorItem from "../Components/armorItem";
import NotLoggedIn from "../Components/notLoggedIn";

export default function Armor() {
  const [armor, setArmor] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('-1');
  const [rarity, setRarity] = useState('-1');
  const [setBonus, setSetBonus] = useState('-');

  const data = [{"name":"Chainmail","defense":"0/0","soak":2,"encumbrance":3,"price":5,"rarity":4,"specials":"None","setBonus":"None","spawnLocations":"All","durability":3,"description":"A basic set of chainmail armor","anomalousEffect":"None","equippedTo":"Chest","hidden":"No","repairSkill":"Armorer"},
    {"name":"Plate Armor","defense":"1/1","soak":2,"encumbrance":4,"price":7,"rarity":6,"specials":"None","setBonus":"None","spawnLocations":"All","durability":3,"description":"A basic set of plate armor","anomalousEffect":"None","equippedTo":"Chest","hidden":"No","repairSkill":"Armorer"},
    {"name":"Leather Armor","defense":"0/0","soak":1,"encumbrance":2,"price":4,"rarity":3,"specials":"None","setBonus":"None","spawnLocations":"All","durability":3,"description":"A basic set of leather armor","anomalousEffect":"None","equippedTo":"Chest","hidden":"No","repairSkill":"Leatherworker"},
    {"name":"Tesla Coil","defense":"0/3","soak":0,"encumbrance":2,"price":9,"rarity":8,"specials":"None","setBonus":"None","spawnLocations":"All","durability":2,"description":"A small piece of blue metal in a square surrounded by black wires","anomalousEffect":"None","equippedTo":"Chest","hidden":"No","repairSkill":"Goldsmith"},
    {"name":"Flak Vest","defense":"0/0","soak":2,"encumbrance":3,"price":6,"rarity":5,"specials":"None","setBonus":"None","spawnLocations":"All","durability":3,"description":"A basic flak vest","anomalousEffect":"None","equippedTo":"Chest","hidden":"No","repairSkill":"Weaver"},
    {"name":"Riot Armor","defense":"2/2","soak":1,"encumbrance":5,"price":7,"rarity":6,"specials":"None","setBonus":"None","spawnLocations":"All","durability":3,"description":"A basic set of armor used typically for riots","anomalousEffect":"None","equippedTo":"Chest","hidden":"No","repairSkill":"Armorer"},
    {"name":"Personal Force Field","defense":"3/3","soak":0,"encumbrance":1,"price":9,"rarity":8,"specials":"None","setBonus":"None","spawnLocations":"All","durability":3,"description":"A small orange disk","anomalousEffect":"None","equippedTo":"Chest","hidden":"No","repairSkill":"Goldsmith"},
    {"name":"Red Knight's Replica Gloves","defense":"1/1","soak":2,"encumbrance":3,"price":6000,"rarity":10,"specials":"Anomalous","setBonus":"Red Knight Replica Set","spawnLocations":"None","durability":100,"description":"A bulky crimson red set of gloves with spiky pieces of metal pointing outwards.","anomalousEffect":"While wearing these gloves, your battle sense increases. All weapons critical is decreased by 1, to a minimum of 1. Unarmed strikes decrease by 2 instead.","equippedTo":"Arms","hidden":"Yes","repairSkill":"None"},
    {"name":"Red Knight's Replica Greaves","defense":"1/1","soak":2,"encumbrance":3,"price":6000,"rarity":10,"specials":"Anomalous","setBonus":"Red Knight Replica Set","spawnLocations":"None","durability":100,"description":"A bulky crimson red set of boots with spiky pieces of metal pointing outwards. Leg armor may not be equipped while this is equipped.","anomalousEffect":"While wearing these greaves, you no longer take fall damage and you recieve a free maneuver per turn that does not count towards your maneuvers per turn.","equippedTo":"Feet","hidden":"Yes","repairSkill":"None"},
    {"name":"Red Knight's Replica Helmet","defense":"1/1","soak":2,"encumbrance":3,"price":6000,"rarity":10,"specials":"Anomalous","setBonus":"Red Knight Replica Set","spawnLocations":"None","durability":100,"description":"A bulky crimson red helmet with spiky pieces of metal pointing outwards and a horizontal piece of sheer material.","anomalousEffect":"While wearing this helmet, you have an enhanced sense of danger. You now have the Adversary 1 talent.","equippedTo":"Head","hidden":"Yes","repairSkill":"None"},
    {"name":"Red Knight's Replica Plate","defense":"1/1","soak":2,"encumbrance":3,"price":6000,"rarity":10,"specials":"Anomalous","setBonus":"Red Knight Replica Set","spawnLocations":"None","durability":100,"description":"Bulky crimson red plate armor with spiky pieces of metal pointing outwards.","anomalousEffect":"While wearing this armor, your defense maximum is now 6 and your soak maximum is 15.","equippedTo":"Chest","hidden":"Yes","repairSkill":"None"},
    {"name":"Shadow Hide","defense":"1/1","soak":1,"encumbrance":2,"price":7,"rarity":6,"specials":"Anomalous","setBonus":"Shadows Set","spawnLocations":"Dark","durability":3,"description":"A pure black set of hide armor.","anomalousEffect":"While wearing this armor, you gain one boost dice to all stealth checks. In addition, while successfully stealthed you may teleport any two range bands regardless of distance.","equippedTo":"Chest","hidden":"Yes","repairSkill":"Weaver"},
    {"name":"Ring of Ridiculous Speed","defense":"0/0","soak":0,"encumbrance":0,"price":8,"rarity":7,"specials":"Anomalous","setBonus":"None","spawnLocations":"All","durability":3,"description":"A small golden ring with a lightning bolt engraved on the side.","anomalousEffect":"While wearing this ring, you may take an extra free maneuver each turn. This extra maneuver does not count towards your manuevers per turn.","equippedTo":"Ring","hidden":"No","repairSkill":"Goldsmith"},
    {"name":"Amplimotive Armor","defense":"1/1","soak":2,"encumbrance":3,"price":8,"rarity":7,"specials":"Anomalous","setBonus":"Steampunk Set","spawnLocations":"All","durability":3,"description":"A large suit of metal armor covered in thick steel plating.","anomalousEffect":"While wearing this armor, your brawn is increased by 1 but your agility is decreased by 1.","equippedTo":"Chest","hidden":"No","repairSkill":"Armorer"},
    {"name":"Goggles of many actions","defense":"0/0","soak":0,"encumbrance":1,"price":3,"rarity":2,"specials":"Anomalous","setBonus":"Steampunk Set","spawnLocations":"All","durability":2,"description":"A hat similar to a train conductor's with brass-colored goggles","anomalousEffect":"The eye pieces of the goggles can be interchanged to have different beneficial effects. When found, it has the magnifying eye equipped. This increases your perception skill by 1 rank while equipped. So long as one eye is equipped, the bonus is gained.","equippedTo":"Head","hidden":"No","repairSkill":"Goldsmith"},
    {"name":"Amulet of Health","defense":"0/0","soak":0,"encumbrance":0,"price":6,"rarity":5,"specials":"Anomalous","setBonus":"None","spawnLocations":"Safe","durability":3,"description":"A little golden amulet fastened to a chain to be worn around as a necklace.","anomalousEffect":"You may exceed your threshold maximum by an additional 3 before falling unconcious.","equippedTo":"Neck","hidden":"No","repairSkill":"Goldsmith"},
    {"name":"Leggings of Charisma","defense":"0/0","soak":1,"encumbrance":2,"price":4,"rarity":3,"specials":"Anomalous","setBonus":"None","spawnLocations":"All","durability":3,"description":"A brass-colored silky pair of leggings.","anomalousEffect":"While wearing these leggings, you add a boost dice to all cunning checks.","equippedTo":"Legs","hidden":"No","repairSkill":"Leatherworker"},
    {"name":"Boots of Shadows","defense":"0/1","soak":0,"encumbrance":1,"price":7,"rarity":6,"specials":"Anomalous","setBonus":"Shadows Set","spawnLocations":"Dark","durability":3,"description":"A pure black pair of pointy-tipped boots. ","anomalousEffect":"While wearing these boots, you gain one boost dice to all stealth checks. In addition, while successfully stealthed you do not have to spend strain on maneuvers.","equippedTo":"Feet","hidden":"Yes","repairSkill":"Leatherworker"},
    {"name":"Wristband of Winter","defense":"0/0","soak":0,"encumbrance":0,"price":4,"rarity":3,"specials":"Anomalous","setBonus":"Weather Set","spawnLocations":"Cold","durability":3,"description":"A blueish-white leather bracelet with a snowflake engraved in it.","anomalousEffect":"While within freezing weather, it takes an extra 5 rounds to recieve a level of exhaustion.","equippedTo":"Wrist","hidden":"No","repairSkill":"Leatherworker"},
    {"name":"Earrings of Wind","defense":"1/1","soak":0,"encumbrance":0,"price":8,"rarity":7,"specials":"Anomalous","setBonus":"None","spawnLocations":"All","durability":3,"description":"A brass and gold pair of chimes with a metal hook","anomalousEffect":"You add an automatic success and advantage on ranged checks.","equippedTo":"Ears","hidden":"No","repairSkill":"Goldsmith"},
    {"name":"Ring of Charming","defense":"0/0","soak":1,"encumbrance":0,"price":5,"rarity":4,"specials":"Anomalous","setBonus":"None","spawnLocations":"All","durability":3,"description":"A slightly transparent light blue gem embedded on a brilliant gold ring.","anomalousEffect":"Three times per day you may cause a target to automatically recieve a failure and two threats on a social check.","equippedTo":"Ring","hidden":"No","repairSkill":"Goldsmith"},
    {"name":"Gloves of Reflection","defense":"0/2","soak":0,"encumbrance":2,"price":8,"rarity":7,"specials":"Anomalous","setBonus":"None","spawnLocations":"Dangerous","durability":3,"description":"Blue and purple silk fingerless gloves","anomalousEffect":"Once per day, reduce the damage you take from an attack by 1d10 + your agility and deal that much damage back as strain.","equippedTo":"Arms","hidden":"No","repairSkill":"Weaver"},
    {"name":"Detection Medallion","defense":"0/0","soak":0,"encumbrance":0,"price":10,"rarity":9,"specials":"Anomalous/Breaking","setBonus":"None","spawnLocations":"Dangerous/Cold","durability":1,"description":"A golden skull with two red gem eyes attached to a silver chain.","anomalousEffect":"As an action, you may learn the fear of a target. After using it, this medallion breaks.","equippedTo":"Neck","hidden":"Yes","repairSkill":"Goldsmith"},
    {"name":"Necklace of Healing","defense":"2/2","soak":2,"encumbrance":2,"price":25,"rarity":9,"specials":"Anomalous","setBonus":"Healer Set","spawnLocations":"Safe","durability":100,"description":"A rope tied to connect 6 cylinders of translucent blue.","anomalousEffect":"You have a pool of 150 points. You may heal yourself or a target by 1 wound per point as an action. Any number of points may be spent per use. These points do not come back.","equippedTo":"Neck","hidden":"Yes","repairSkill":"Leatherworker"},
    {"name":"Periapt of Diseases","defense":"0/0","soak":0,"encumbrance":0,"price":3,"rarity":2,"specials":"Anomalous","setBonus":"None","spawnLocations":"All","durability":3,"description":"A solid red heart made of aluminum attached to a golden ring","anomalousEffect":"Whenever you make a check regarding a disease, you add two boost dice to it.","equippedTo":"Neck","hidden":"No","repairSkill":"Goldsmith"},
    {"name":"Wristlet of Healing","defense":"0/0","soak":0,"encumbrance":0,"price":15,"rarity":9,"specials":"Anomalous","setBonus":"Healer Set","spawnLocations":"All","durability":3,"description":"A rope bracelet with a blue translucent cylinder hanging from it.","anomalousEffect":"You have a pool of 100 points. You may heal yourself or a target by 1 strain per point as an action. Any number of points may be spent per use. These points do not come back.","equippedTo":"Wrist","hidden":"Yes","repairSkill":"Leatherworker"},
    {"name":"Ring of Evasion","defense":"3/3","soak":0,"encumbrance":0,"price":9,"rarity":8,"specials":"None","setBonus":"None","spawnLocations":"All","durability":3,"description":"A golden ring with a green and blue bird on the top.","anomalousEffect":"None","equippedTo":"Ring","hidden":"No","repairSkill":"Goldsmith"},
    {"name":"Ring of Shadows","defense":"0/1","soak":1,"encumbrance":0,"price":7,"rarity":6,"specials":"Anomalous","setBonus":"Shadows Set","spawnLocations":"Dark","durability":3,"description":"A pure black ring with no distinguishable features.","anomalousEffect":"While wearing this ring, you gain two boost dice to all stealth checks.","equippedTo":"Ring","hidden":"Yes","repairSkill":"Goldsmith"},
    {"name":"Protection Ring","defense":"1/1","soak":1,"encumbrance":0,"price":5,"rarity":4,"specials":"None","setBonus":"None","spawnLocations":"All","durability":3,"description":"A ring with a gray and green shield","anomalousEffect":"None","equippedTo":"Ring","hidden":"No","repairSkill":"Goldsmith"},
    {"name":"Anti-Asphyxiation Earrings","defense":"0/0","soak":0,"encumbrance":0,"price":4,"rarity":3,"specials":"Anomalous","setBonus":"None","spawnLocations":"All","durability":3,"description":"A deep blue silk ring","anomalousEffect":"You can hold your breath for an additional 2 rounds","equippedTo":"Ears","hidden":"No","repairSkill":"Weaver"},
    {"name":"Wristband of Summer","defense":"0/0","soak":0,"encumbrance":0,"price":4,"rarity":3,"specials":"Anomalous","setBonus":"Weather Set","spawnLocations":"Hot","durability":3,"description":"A red and black leather bracelet with a flame symbol engraved in it.","anomalousEffect":"While within extremely hot weather, it takes an extra 5 rounds to recieve a level of exhaustion.","equippedTo":"Wrist","hidden":"No","repairSkill":"Leatherworker"},
    {"name":"Sentinel Leg Guards","defense":"2/2","soak":1,"encumbrance":3,"price":5,"rarity":4,"specials":"Anomalous","setBonus":"None","spawnLocations":"All","durability":3,"description":"A silver set of shimmering knee armor.","anomalousEffect":"While wearing this leg guard, you automtically add 1 success to initiative and perception checks ","equippedTo":"Legs","hidden":"No","repairSkill":"Armorer"},
    {"name":"Winged Boots","defense":"0/0","soak":0,"encumbrance":2,"price":8,"rarity":7,"specials":"Anomalous","setBonus":"Flight Set","spawnLocations":"Dangerous","durability":2,"description":"A pair of dark brown boots with white feathered wings.","anomalousEffect":"While wearing these boots, you may fly. Range bands work the same for vertical movement.","equippedTo":"Feet","hidden":"No","repairSkill":"Leatherworker"},
    {"name":"Wings of Flying","defense":"0/0","soak":0,"encumbrance":2,"price":8,"rarity":7,"specials":"Anomalous","setBonus":"Flight Set","spawnLocations":"Dangerous","durability":2,"description":"A gauntlet of brass and steel with white feathered wings attached.","anomalousEffect":"While wearing these wings, you may fly. Range bands work the same for vertical movement.","equippedTo":"Arms","hidden":"No","repairSkill":"Armorer"},
    {"name":"Amulet of Deception","defense":"0/0","soak":1,"encumbrance":0,"price":7,"rarity":6,"specials":"Anomalous","setBonus":"None","spawnLocations":"All","durability":3,"description":"A golden coin with unknown engravings.","anomalousEffect":"Whenever someone attempts to learn your fear, that person adds two setback dice to the check.","equippedTo":"Neck","hidden":"No","repairSkill":"Goldsmith"},
    {"name":"Commandment Bangle","defense":"0/0","soak":1,"encumbrance":0,"price":9,"rarity":8,"specials":"Anomalous","setBonus":"None","spawnLocations":"All","durability":2,"description":"A copper bracelet with two small stones on either side.","anomalousEffect":"Whenever you sucessfully deal damage to a target, you may spend a maneuver to allow an ally to spend thier out-of-turn-incidental to make an attack against the same target. This can only be done once per turn.","equippedTo":"Wrist","hidden":"No","repairSkill":"Goldsmith"},
    {"name":"Helm of Invulnerability","defense":"2/1","soak":2,"encumbrance":5,"price":300,"rarity":10,"specials":"Anomalous","setBonus":"None","spawnLocations":"None","durability":100,"description":"A golden helmet with brass and silver inlets and two curved horns of red steel.","anomalousEffect":"As an action once per encounter, you may become invulnerable to damage for 3 rounds. After the invulnerability ends, you now take double damage for 1 turn.","equippedTo":"Head","hidden":"No","repairSkill":"Armorer"},
    {"name":"Holy Hood","defense":"0/0","soak":2,"encumbrance":2,"price":1000,"rarity":10,"specials":"Anomalous","setBonus":"Holy Set","spawnLocations":"None","durability":100,"description":"A pure white hood with two sleeves, similar to a backpack.","anomalousEffect":"While wearing this helmet, you reduce all strain damage taken by 1.","equippedTo":"Head","hidden":"Yes","repairSkill":"None"},
    {"name":"Holy Arm Guards","defense":"1/1","soak":2,"encumbrance":2,"price":1000,"rarity":10,"specials":"Anomalous","setBonus":"Holy Set","spawnLocations":"None","durability":100,"description":"A pure white set of shoulder and elbow pads.","anomalousEffect":"White wearing these arm guards, your attacks also have the trait Stun Damage 2.","equippedTo":"Arms","hidden":"Yes","repairSkill":"None"},
    {"name":"Holy Leggings","defense":"1/1","soak":2,"encumbrance":2,"price":1000,"rarity":10,"specials":"Anomalous","setBonus":"Holy Set","spawnLocations":"None","durability":100,"description":"A pure white pair of leggings.","anomalousEffect":"While wearing these leggings, you may move between range bands with 1 maneuver, regardless of distance.","equippedTo":"Legs","hidden":"Yes","repairSkill":"None"},
    {"name":"Holy Greaves","defense":"1/1","soak":2,"encumbrance":2,"price":1000,"rarity":10,"specials":"Anomalous","setBonus":"Holy Set","spawnLocations":"None","durability":100,"description":"A pure white pair of shoes, similar to modern-day sneakers.","anomalousEffect":"While wearing these greaves, you no longer take fall damage.","equippedTo":"Feet","hidden":"Yes","repairSkill":"None"},
    {"name":"Holy Armor","defense":"1/1","soak":2,"encumbrance":3,"price":1000,"rarity":10,"specials":"Anomalous","setBonus":"Holy Set","spawnLocations":"None","durability":100,"description":"A pure white tunic without sleeves.","anomalousEffect":"While wearing this armor, any melee attacks against you harm the attacker. The attacker takes 5 automatic strain damage for each attack taken against you.","equippedTo":"Chest","hidden":"Yes","repairSkill":"None"},
    {"name":"Adamantine Leglets","defense":"2/0","soak":0,"encumbrance":3,"price":5,"rarity":4,"specials":"Anomalous","setBonus":"None","spawnLocations":"All","durability":3,"description":"A pair of gray armored pants","anomalousEffect":"While wearing these pants, you reduce critical injuries by 20.","equippedTo":"Legs","hidden":"No","repairSkill":"Armorer"},
    {"name":"Ring of Protection","defense":"2/2","soak":0,"encumbrance":0,"price":8,"rarity":7,"specials":"None","setBonus":"None","spawnLocations":"Dangerous","durability":1,"description":"A teal steel ring with runes on the sides.","anomalousEffect":"None","equippedTo":"Ring","hidden":"No","repairSkill":"Goldsmith"},
    {"name":"Illusionist Greaves","defense":"0/0","soak":0,"encumbrance":2,"price":6,"rarity":5,"specials":"Anomalous","setBonus":"None","spawnLocations":"Dark/Cold","durability":3,"description":"A black and purple set of leather boots with dark red feathers","anomalousEffect":"You have 2 defense when wearing this armor until you take wound damage. Afterwards, you lose this bonus for a round.","equippedTo":"Feet","hidden":"No","repairSkill":"Armorer"},
    {"name":"Ring of Teleportation","defense":"0/0","soak":1,"encumbrance":0,"price":120,"rarity":10,"specials":"Anomalous/Breaking","setBonus":"None","spawnLocations":"None","durability":3,"description":"A non-descript ring.","anomalousEffect":"You may teleport to any level you want, but it loses one durability upon use.","equippedTo":"Ring","hidden":"Yes","repairSkill":"Goldsmith"},
    {"name":"Fearless Crown","defense":"0/0","soak":1,"encumbrance":2,"price":8,"rarity":7,"specials":"Anomalous","setBonus":"None","spawnLocations":"Dark","durability":2,"description":"A golden crown adorned with black gems representing the alchemical symbol of death","anomalousEffect":"While wearing this crown, reduce all fear checks by 2 difficulty, to a minimum of 1.","equippedTo":"Head","hidden":"No","repairSkill":"Goldsmith"},
    {"name":"Smoked Pants","defense":"0/1","soak":0,"encumbrance":3,"price":4,"rarity":3,"specials":"Anomalous","setBonus":"Shadows Set","spawnLocations":"Dark","durability":3,"description":"A pure black pair of basic pants enshrouded in smoke.","anomalousEffect":"Once per encounter, you may spread the smoke from these pants to permeate to a distance of medium away from you. This counts as Level 3 concealment.","equippedTo":"Legs","hidden":"Yes","repairSkill":"Weaver"},
    {"name":"Light Ring","defense":"0/0","soak":0,"encumbrance":0,"price":2,"rarity":1,"specials":"Anomalous","setBonus":"None","spawnLocations":"Light","durability":2,"description":"An off-white ring made of leather.","anomalousEffect":"You may spend an action to activate this ring. While activated, it eminates light out to a medium distance in all directions with a light level of 5. This ring may be on for 5 minutes. In order to recharge it, you must hold a light source over it for 1 minute.","equippedTo":"Ring","hidden":"No","repairSkill":"Leatherworker"},
    {"name":"Transparency Visor","defense":"0/0","soak":1,"encumbrance":1,"price":4,"rarity":3,"specials":"Anomalous","setBonus":"None","spawnLocations":"All","durability":4,"description":"A purple sheer wooden pair of glasses.","anomalousEffect":"While you wear this visor, you may see through walls and other objects. It only allows you to see through 1 wall at a time however.","equippedTo":"Head","hidden":"No","repairSkill":"Carpenter"},
    {"name":"Dark Ring","defense":"0/0","soak":0,"encumbrance":0,"price":2,"rarity":1,"specials":"Anomalous","setBonus":"None","spawnLocations":"Dark","durability":2,"description":"A gray ring made of leather.","anomalousEffect":"You may spend an action to activate this ring. While activated, out to a medium range is darkened by 3 light level. This ring may be on for 5 minutes. In order to recharge it, it must be in the dark for 1 minute.","equippedTo":"Ring","hidden":"No","repairSkill":"Leatherworker"},
    {"name":"False Appearance Earrings","defense":"1/1","soak":0,"encumbrance":0,"price":7,"rarity":6,"specials":"Anomalous","setBonus":"None","spawnLocations":"All","durability":3,"description":"These earrings change shape each time its found.","anomalousEffect":"As an action, you may change your appearance to another person or back to your original form.","equippedTo":"Ears","hidden":"Yes","repairSkill":"Any"},
    {"name":"Thunderous Overalls","defense":"0/0","soak":2,"encumbrance":3,"price":7,"rarity":6,"specials":"Anomalous","setBonus":"None","spawnLocations":"All","durability":3,"description":"A pair of overalls made of the same materials as a flak vest but with a subtle blue glow around it.","anomalousEffect":"As an action, you may create a thunderous aura around yourself. This increases your soak by 2.","equippedTo":"Legs","hidden":"No","repairSkill":"Weaver"},
    {"name":"Armwraps of power","defense":"0/0","soak":1,"encumbrance":0,"price":8,"rarity":7,"specials":"Anomalous","setBonus":"None","spawnLocations":"All","durability":100,"description":"A pre-wrapped section of gauze.","anomalousEffect":"Your brawl attacks have the auto-hit trait.","equippedTo":"Arms","hidden":"No","repairSkill":"Weaver"},
    {"name":"Earrings of Insight","defense":"1/1","soak":0,"encumbrance":0,"price":3,"rarity":2,"specials":"None","setBonus":"None","spawnLocations":"All","durability":2,"description":"A vibrant orange set of jeweled earrings","anomalousEffect":"None","equippedTo":"Ears","hidden":"No","repairSkill":"Goldsmith"},
    {"name":"Ring of Retries","defense":"0/0","soak":0,"encumbrance":0,"price":80,"rarity":10,"specials":"Anomalous/Breaking","setBonus":"None","spawnLocations":"None","durability":100,"description":"A black ring with a bronze beetle.","anomalousEffect":"Whenever you would fail a check, you may reroll it. Each time you use this, the ring loses one durability and cannot be repaired.","equippedTo":"Ring","hidden":"Yes","repairSkill":"None"}]
    
  const addData = () => {
    for(let i = 0; i < data.length; i++) {
      setDoc(doc(db, 'Armor', data[i].name), {
        name: data[i].name,
        defense: data[i].defense,
        soak: data[i].soak,
        encumbrance: data[i].encumbrance,
        price: data[i].price,
        rarity: data[i].rarity,
        specials: data[i].specials,
        setBonus: data[i].setBonus,
        spawnLocations: data[i].spawnLocations,
        durability: data[i].durability,
        description: data[i].description,
        anomalousEffect: data[i].anomalousEffect,
        equippedTo: data[i].equippedTo,
        hidden: data[i].hidden,
        repairSkill: data[i].repairSkill
      })
    }
  }

  const getFromDB = () => {
    const q = query(collection(db, 'Armor'), orderBy("name", "asc"));

    const unsub = onSnapshot(q, (querySnapshot) => {
      const queryData = [];
      querySnapshot.forEach((doc) => {
        queryData.push(doc.data());
      })
      setArmor(queryData);
    })

    return () => {
      unsub();
    }
  }

  const DisplayItems = () => {
    let empty = true;

    return (
      <Stack direction='row' flexWrap='wrap' gap={1}>
        {armor.map((item) => {
          if(
            (item.hidden === 'No' || localStorage.getItem('loggedIn').toUpperCase() === 'ADMIN') &&
            (item.price === parseInt(price) || (item.price >= 10 && parseInt(price) === 10) || price === '-1') &&
            (item.rarity === parseInt(rarity) || rarity === '-1') &&
            (item.name.toUpperCase().includes(name.toUpperCase()) || name === '' || item.setBonus.toUpperCase().includes(name.toUpperCase())) &&
            (item.setBonus === setBonus || setBonus === '-')
          ) {
            empty = false;
            return <ArmorItem currArmor={item}/>
          }
        })}
        {empty ? <Typography>There is no armor that match your criteria.</Typography> : ""}
      </Stack>
    )
  }

  const getSetBonusList = () => {
    const bonusList = [];

    for(let i = 0; i < armor.length; i++) {
      let count = 0;
      for(let j = 0; j < bonusList.length; j++) {
        if(armor[i].setBonus === bonusList[j]) {
          count++;
          break;
        }
      }
      if(count === 0 && armor[i].setBonus !== 'None') bonusList.push(armor[i].setBonus)
    }

    return bonusList.map((bonus, index) => {
      return <MenuItem value={bonus} key={index}>{bonus}</MenuItem>
    })
  }

  return (
    localStorage.getItem("loggedIn") === 'false' ? <NotLoggedIn /> :
      <Box>
      <Button onClick={addData}>Add</Button>
        {armor.length > 0 ?
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