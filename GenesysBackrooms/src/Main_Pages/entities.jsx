import { Box, Button, Typography, Paper, Grid, Card, CardContent, Chip, Container, Divider, TextField, InputAdornment, Fade, Skeleton, Avatar, IconButton, Stack, Alert, AlertTitle, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import { Search, Add } from "@mui/icons-material";
import NotLoggedIn from "../Components/notLoggedIn";
import { collection, doc, onSnapshot, orderBy, query, setDoc } from "firebase/firestore";
import { useMemo, useState, useEffect } from "react";
import db from '../Components/firebase';
import EntityItem from "../Components/entityItem";

export default function Entities() {
  const [entities, setEntities] = useState([]);
  const [currEntity, setCurrEntity] = useState('Deathmoth');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('All');
  const [difficultyFilter, setDifficultyFilter] = useState('All');

  const data = [{"name":"Smiler","description":"A reflective white gleam in the shape of eyes and a grinning mouth.","stats":"3/3/2/2/2/1","soak":4,"wounds":16,"strain":0,"defenses":"1/0","skills":"Athletics 3/Brawl 3/Perception 2","talents":"None","abilities":"Quick: The Clump may perform two free maneuvers per turn./Darkvision: When making skill checks, The Smiler removes up to two setback dice imposed due to darkness.","actions":"Charge(Attack): Brawl; Damage 10; Range [Engaged]; Pierce 3","equipment":"None","drops":"Iron Tooth","difficulty":1,"spawnLocations":"All","type":"Rival","behavior":"Hostile","fear":-1},
  {"name":"Window","description":"A window that matches the surrounding area. Within this window sometimes appears a shadowed humanoid figure","stats":"3/1/2/2/2/3","soak":4,"wounds":22,"strain":0,"defenses":"0/0","skills":"Brawl 2/Charm 3","talents":"None","abilities":"Whisper: The Window whispers within a short range. At the start of a player's turn, the player must make a contested Cool check versus the Window's Charm check. On a fail, the player is staggered and must use thier free maneuver to move towards the Window. For the next 3 turns, that player is unaffected by this ability","actions":"Grab(Attack): Brawl; Damage 7; Critical 5; Range [Engaged]; Stun Damage","equipment":"None","drops":"Sheet of Steel or Plank of Wood","difficulty":1,"spawnLocations":"Indoors","type":"Rival","behavior":"Hostile","fear":-1},
  {"name":"Deathmoth","description":"A giant moth.","stats":"2/3/1/2/2/3","soak":4,"wounds":20,"strain":0,"defenses":"0/1","skills":"Brawl 3/Ranged 2","talents":"Quick Strike 2: Add two boost dice to any target who has not taken thier turn yet in the current encounter.","abilities":"Darkvision: When making skill checks, The Deathmoth removes up to two setback dice imposed due to darkness.","actions":"Charge(Attack): Brawl; Damage 7; Range [Engaged]/Dissolve(Action): The Deathmoth attempts to dissolve a metal or wooden object held or worn; Range [Engaged]/Spit(Attack)[Female]: Ranged; Damage 7; Range [Medium]","equipment":"None","drops":"Cotton Wing (Male)/Vial of Acid (Female)","difficulty":1,"spawnLocations":"All","type":"Rival","behavior":"Males are docile unless attacked. Females are hostile.","fear":-1},
  {"name":"Clump","description":"A strange bundle of limbs with a large central mouth. The Clump is Blind and Deaf.","stats":"3/3/1/2/2/2","soak":4,"wounds":19,"strain":0,"defenses":"1/1","skills":"Athletics 3/Brawl 3","talents":"Rapid Reaction 2: May spend 1 strain to gain 1 success to initiative up to 2 times./Swift: Ignore difficult terrain.","abilities":"Enhanced awareness: Difficulty added through blindness is reduced by 2./Quick: The Clump may perform two free maneuvers per turn.","actions":"Grapple(Out-of-Turn-Incidental): The Clump reaches out to grapple a target entering within engaged range./Bite(Attack): Brawl; Damage 5; Critical 3; Range [Engaged]; Concussive 1; Vicious 1/Become Aware(Action): The Clump grows eyes and ears, allowing it to see and hear without problem.","equipment":"None","drops":"Leather Piece of Skin","difficulty":1,"spawnLocations":"All","type":"Rival","behavior":"Hostile","fear":-1},
  {"name":"Duller","description":"A dark grey humanoid with a lack of facial properties such as eyes, ears, and a mouth.","stats":"3/3/3/3/2/3","soak":6,"wounds":23,"strain":0,"defenses":"1/0","skills":"Brawl 3/Athletics 2/Stealth 2","talents":"Duelist: When engaged with a single opponent, gain 1 boost dice to all melee combat checks. While engaged with 3 or more, add 1 setback dice instead./Swift: Ignore difficult terrain.","abilities":"Quick: The Clump may perform two free maneuvers per turn.","actions":"Grapple(Action): The Duller reaches through a wall and attempts to grapple and pull the target through the wall./Maul(Attack): Brawl; Damage 13; Critical 3; Range [Engaged]; Disorient 3","equipment":"A rarity 0 or 1 Object or Mundane item.","drops":"Leather Pieces of Skin","difficulty":3,"spawnLocations":"Indoors","type":"Rival","behavior":"Runs from direct conflict, instead opting to pull the target through a wall and attack them individually.","fear":-1},
  {"name":"Hound","description":"A humanoid that walks on all 4s, similar to a dog.","stats":"2/2/1/1/1/1","soak":3,"wounds":5,"strain":0,"defenses":"0/0","skills":"Brawl","talents":"None","abilities":"None","actions":"Bite(Attack): Brawl; Damage 3; Critical 4; Range [Engaged]","equipment":"None","drops":"Iron Teeth","difficulty":1,"spawnLocations":"All","type":"Minion","behavior":"Hostile but can be stunned or scared off by loud noises and bright lights. Travels in packs of 3.","fear":-1},
  {"name":"Faceling","description":"Facelings have an uncanny similarity to humans but are always on the tall side, lanky, and have no facial features.","stats":"1/1/2/1/1/2","soak":3,"wounds":5,"strain":0,"defenses":"0/0","skills":"Melee","talents":"None","abilities":"None","actions":"Stab(Attack): Melee; Damage 2; Critical 3; Range [Engaged]; Dual-Wield/Punch(Attack): Brawl; Damage 1; Critical 5; Range [Engaged]; Dual-Wield","equipment":"A Knife/A gray Almond Water","drops":"Leather Piece of Skin","difficulty":1,"spawnLocations":"All","type":"Minion","behavior":"Adult Facelings are docile unless attacked or agitated in some way. Children Facelings are mischevious and considered hostile. Adults travel in packs of 2. Children travel in packs of 4.","fear":-1},
  {"name":"Skin-Stealer","description":"The Skin-Stealer has two forms: True form and Stealth form. The true form is a large bulky mess of yellow-ish tentacles in a humanoid shape and a massive sideways mouth between two dark red eyes. The stealth form is the exact look of a human.","stats":"3/2/3/2/2/3","soak":5,"wounds":22,"strain":0,"defenses":"1/0","skills":"Brawl 2","talents":"Dual Wielder: Reduce the difficulty of dual wielding by 1./Parry 3: May spend 3 strain to reduce the damage from an attack by 6./Parry (Improved): After parrying, use either 1 despair or 3 threats from the attacker's roll to deal 5 damage back.","abilities":"None","actions":"Shapeshift(Action): The Skin-Stealer can change into skin it has stolen or into it true form./Punch(Attack): Brawl; Damage 5; Critical 5; Range [Engaged]; Dual-Wield","equipment":"None","drops":"Leather Piece of Skin/1 Vial of Clear Blood","difficulty":2,"spawnLocations":"All","type":"Rival","behavior":"While in the true form, hostile. While in the stealth form, docile.","fear":-1},
  {"name":"Burster","description":"A spiked animalistic being with spores growing all around the spikes.","stats":"2/3/3/3/2/2","soak":5,"wounds":20,"strain":0,"defenses":"1/1","skills":"Ranged 3/Brawl 2","talents":"Natural (Brawn and Agility): May reroll 1 skill check using Brawn and 1 skill check using Agility once per session.","abilities":"None","actions":"Spray(Attack): Ranged; Damage 5; Critical 0; Range [Short]; Burn 1/Pierce(Attack): Brawl; Damage 5; Critical 3; Range [Engaged]; Pierce 2","equipment":"None","drops":"4 Copper Spikes","difficulty":2,"spawnLocations":"3","type":"Rival","behavior":"Hostile when hungry","fear":-1},
  {"name":"Transporter","description":"A humanoid silhouette that floats. The Transporter does not have legs or a pelvis and instead has 3 long arms split into 4 joint segments instead of 2. The Transporter wears a wide-brimmed fedora.","stats":"1/3/2/3/3/1","soak":4,"wounds":17,"strain":0,"defenses":"1/1","skills":"Athletics 3","talents":"Defensive Stance 2: Once per round as a maneuver, recieve up to 3 strain to increase all melee attacks by 1 difficulty per strain spent.","abilities":"Grow Arm: As an Action, the Transporter can grow an additional arm./Multi-Attack: For each arm the Transporter has, it can make one attack./No-Clip: As a maneuver, the Transporter can no-clip.","actions":"Slap(Attack): Brawl; Damage 1 per arm; Critical 3; Range [Engaged]","equipment":"None","drops":"Nothing","difficulty":1,"spawnLocations":"Indoors","type":"Rival","behavior":"Docile unless absolutely forced to defend itself. The Transporter always asks a wanderer what level they would like to visit. If no level is decided upon, the wanderer is transported to a random level of survival difficulty 3 or lower safely and instantaneously.","fear":-1},
  {"name":"Reviook","description":"A circular body with two large muscular arms in front and 3 small legs in the back. The Reviook is covered in black beady eyes and has a small tube-like mouth.","stats":"3/3/2/3/3/3","soak":6,"wounds":25,"strain":0,"defenses":"1/0","skills":"Brawl 3/Perception 2/Stealth","talents":"None","abilities":"Burrow: The Reviook can burrow through a solid surface with ease./Enhanced Grapple: The target of the Reviook's grapple suffers 2 setback dice to break out of the grapple.","actions":"Grapple(Action): The Reviook reaches through a solid surface and attempts to grapple and pull the target through the surface./Punch(Attack): Brawl; Damage 13; Critical 5; Range [Engaged]; Stun 3","equipment":"None","drops":"2 Coal Eyes","difficulty":3,"spawnLocations":"All","type":"Rival","behavior":"Hostile. Burrows into a surface and waits for its prey before bursting out and grabbing the target, shrinking back into the hole it created.","fear":-1},
  {"name":"Wretch","description":"A humanoid in a late stage of decomposition with reddish-brown, dry, and flaky skin, yellow and rotted teeth, bloodshot eyes, and an exposed brain.","stats":"3/3/1/3/3/2","soak":5,"wounds":28,"strain":0,"defenses":"0/0","skills":"Brawl 3","talents":"None","abilities":"Inflict Cycle: Whenever the Wretch deals more than 7 damage in a single attack, the target recieves a level of the Wretched Cycle. This is after soak is calculated.","actions":"Bite(Attack): Brawl; Damage 10; Critical 5; Range [Engaged]","equipment":"None","drops":"Leather Piece of Skin","difficulty":2,"spawnLocations":"All","type":"Rival","behavior":"Hostile","fear":-1},
  {"name":"Nguithr'xurh","description":"A black and brown 16-legged spider that spans about 4 inches wide and 8 inches long.","stats":"3/3/1/1/1/1","soak":5,"wounds":9,"strain":0,"defenses":"0/0","skills":"Stealth/Brawl","talents":"None","abilities":"None","actions":"Spin Web(Maneuver): The Nguithr'xurh creates a ball of web./Drop(Action): The Nguithr'xurh cuts any number of balls. Anybody undernearth must succeed on a difficulty x coordination or athletics check where x is the number of balls dropping or be hit and become disoriented for 2 rounds per ball./Bite(Attack): Brawl; Damage 7; Critical 4; Range [Engaged]","equipment":"None","drops":"Ball of Silk","difficulty":3,"spawnLocations":"Indoors","type":"Minion","behavior":"Hostile. Hides on the ceiling creating little white balls of web. It then drops these balls onto wanderers before attacking. Travels in packs of 3. A random one of the pack explodes upon death inflicting the Happy Dance phenomenon. This can be avoided by a difficulty 3 athletics or coordination check.","fear":-1},
  {"name":"The Disease","description":"An intangible sickness that usually hovers around mold and corpses.","stats":"0/0/0/0/0/0","soak":0,"wounds":0,"strain":0,"defenses":"0/0","skills":"None","talents":"None","abilities":"None","actions":"None","equipment":"None","drops":"Nothing","difficulty":1,"spawnLocations":"All","type":"Nemesis","behavior":"Docile, due to it being a disease.","fear":0},
  {"name":"Scit","description":"A large crustaceous almost shrimp-like being","stats":"1/1/1/1/1/1","soak":0,"wounds":1,"strain":0,"defenses":"0/0","skills":"None","talents":"None","abilities":"None","actions":"None","equipment":"None","drops":"Nothing","difficulty":1,"spawnLocations":"All","type":"Minion","behavior":"Docile. Absolutely will not attack. The Scit counts as a ration.","fear":0},
  {"name":"Unapproachable Horse","description":"A dark-brown horse of unknown gender and age.","stats":"6/6/6/6/6/6","soak":13,"wounds":58,"strain":63,"defenses":"4/4","skills":"Brawl 5/Athletics 4","talents":"Duelist: When engaged with a single opponent, gain 1 boost dice to all melee combat checks. While engaged with 3 or more, add 1 setback dice instead./Resolve 2: When involuntarily losing strain, reduce it by 2 to a minimum of 1.","abilities":"Forcefield: Any organic material may not move within Medium range of the Unapproachable Horse./Allowance: As an action, a target is now unaffected by the forcefield.","actions":"Charge(Action): The Unapproachable Horse charges, pushing any organic material back into walls and other solid objects. If pushed, the target must succeed on a contested Brawl check or take damage equal to the corresponding fall damage distance. The maximum push distance is Long./Stomp(Attack): Brawl; Damage 38; Critical 3; Range [Engaged]","equipment":"None","drops":"4 Golden Hooves","difficulty":8,"spawnLocations":"Outdoors","type":"Nemesis","behavior":"Docile unless attacked. May use the charge action without intent of harm.","fear":-1},
  {"name":"Death Rat","description":"A rat that varies depending on the level or environment it is seen in.","stats":"2/2/2/2/2/2","soak":7,"wounds":13,"strain":0,"defenses":"1/1","skills":"Melee/Brawl","talents":"None","abilities":"None","actions":"Bite(Attack): Brawl; Damage 11; Critical 2; Range [Engaged]; Pierce 1","equipment":"Varies","drops":"Varies","difficulty":5,"spawnLocations":"All","type":"Minion","behavior":"While on a difficulty 2 or lower level, docile. Else, hostile. Depending on the environment, the Death Rat may have additional skills and actions. In addition, the drops may change. Travels in packs of 3.","fear":-1},
  {"name":"Plague Goblin","description":"A small fox-like creature with a plague doctor mask as a face and wears a purple cloak.","stats":"1/2/2/1/1/1","soak":3,"wounds":5,"strain":0,"defenses":"0/0","skills":"Brawl","talents":"None","abilities":"None","actions":"Vanish(Action): The Plague Goblin disappears into its cape and becomes invisible./Scratch(Attack): Brawl; Damage 3; Critical 5; Range [Engaged]; Disorient 2","equipment":"Plague Cloak/Plague Mask","drops":"Nothing","difficulty":1,"spawnLocations":"Indoors","type":"Minion","behavior":"Does not want to fight. Attempts to steal resources then run away instead. Travels in packs of 6.","fear":-1},
  {"name":"Samantha","description":"A black and white domestic house cat.","stats":"1/4/1/1/4/4","soak":6,"wounds":27,"strain":28,"defenses":"2/0","skills":"Ranged 3/Charm 2/Negotiation 2/Coercion 3","talents":"Clever Retort: As an out-of-turn-incidental once per encounter, add 2 threats to a player's social check./Scathing Tirade 3: As an action, make difficulty 2 Coercion check. Deal strain damage equal to successes, then deal strain damage equal to advantages.","abilities":"Polyglot: Samantha can speak and understand all languages./Telepathy: Samantha may speak through telepathy.","actions":"Repel(Attack): Ranged; Damage 6; Critical 0; Range [Medium]; Stun Damage","equipment":"None","drops":"Nothing","difficulty":1,"spawnLocations":"All","type":"Nemesis","behavior":"If aggression is shown, uses Repel. Otherwise, exchanges information for physical goods or other information.","fear":0},
  {"name":"Athenian Duck","description":"A duck","stats":"1/1/1/1/1/1","soak":2,"wounds":30,"strain":0,"defenses":"0/0","skills":"None","talents":"None","abilities":"None","actions":"Bite(Attack): Brawl; Damage 1; Critical 5; Range [Engaged]; Stun 2","equipment":"None","drops":"2 Balls of Silk","difficulty":1,"spawnLocations":"Outdoors","type":"Rival","behavior":"It's a duck. Tanky, but still a duck.","fear":0},
  {"name":"Camo Crawler","description":"A humanoid with four arms covered in a grayish-brown fur-like material. Thier eyes are bright white and are blind. Around its face is a pair of razor sharp pincers.","stats":"4/4/4/4/2/1","soak":7,"wounds":26,"strain":0,"defenses":"2/2","skills":"Stealth 4/Brawl 2/Skullduggery 4","talents":"Backstab: When target is unaware. may use skullduggery instead of brawl on attack. Each success is +2 damage instead of +1 for this attack.","abilities":"Perfect Camouflage: The Camo Crawler can blend into any wall perfectly. A contested Stealth vs. Perception check must be won in order to see it./Grappler: Add two boost dice to grapple checks./Super hearing: Reduce difficulty gain through blindness by 2.","actions":"Grapple(Action): Attempt to grapple a target./Pinch(Attack): Brawl; Damage 13; Critical 2; Range [Engaged]; Pierce 2; Vicious 2","equipment":"Riot Armor","drops":"2 Steel Pincers, or 2 glass eyes.","difficulty":4,"spawnLocations":"Indoors","type":"Rival","behavior":"Aggressive. Hides within the walls and listens for its prey. Once nearby, the Camo Crawler will lunge at it.","fear":-1},
  {"name":"Animation","description":"The look of an Animation may be different from one another but all are humanoid and look animated. There are 3 types of animations that all act the same: Clay, Wood, and Plastic.","stats":"3/2/1/1/2/2","soak":6,"wounds":11,"strain":0,"defenses":"1/1","skills":"Melee(Wood, Plastic)","talents":"None","abilities":"None","actions":"Submerge(Attack)[Clay]: Brawl; Damage 9; Critical 0; Range [Engaged]; Absorb: Absorb the target and begin to drown it within the clay. At the end of each of thier turns, the target may make a difficulty 3 athletics check to escape. While submerged, the target adds 1 black dice to all attacks made./Hammer(Attack)[Plastic]: Melee; Damage 9; Critical 3; Range [Engaged]; Concussive 1/Wooden Halberd(Attack)[Wood]: Melee; Damage 6; Critical 3; Defensive 1; Pierce 3","equipment":"Plastic Hammer/Wooden Halberd","drops":"Sheet of Plastic/Plank of Wood/Hardened Clay","difficulty":4,"spawnLocations":"94","type":"Minion","behavior":"Aggressive during the night towards non-animated things. Travels in packs of 3 (May be different types together)","fear":-1},
  {"name":"Dollface","description":"A roughly 3 foot tall Raggedy Ann doll complete with the darkened brownish skin, bright yellow messy hair, and black button eyes.","stats":"3/3/1/1/2/3","soak":4,"wounds":17,"strain":0,"defenses":"1/1","skills":"Melee 3","talents":"None","abilities":"None","actions":"Replicate(Action): The Dollface creates an exact replica of itself, including its current wounds and afflictions./Cotton Greataxe(Attack): Melee; Damage 7; Critical 3; Range [Engaged]; Cumbersome 3; Pierce 2; Vicious 1","equipment":"Cotton Greataxe","drops":"Ball of Cotton","difficulty":4,"spawnLocations":"All","type":"Rival","behavior":"Passive unless in a group of 3 or more. Replicates itself whenever it feels threatened or wants a friend.","fear":1},
  {"name":"Light Guide","description":"A tiny orb of light. The color can be changed at will.","stats":"1/1/1/1/1/1","soak":0,"wounds":1,"strain":0,"defenses":"0/0","skills":"None","talents":"None","abilities":"None","actions":"None","equipment":"None","drops":"Nothing","difficulty":1,"spawnLocations":"All","type":"Rival","behavior":"Docile. Helps lead wanderers to safe spaces and avoid entities.","fear":0},
  {"name":"Humanoid [White]","description":"Looks like a human but with pitch black skin. The facial features: Eyes, Nose, Mouth, and ears, are a glowing white.","stats":"2/2/3/2/2/2","soak":4,"wounds":21,"strain":0,"defenses":"1/1","skills":"Charm 3/Cool 2/Negotiation 3","talents":"Probing Question: If knows flaw or fear, add 3 strain to any social checks that deal strain to the target./Interjection: As an Out-Of-Turn-Incidental, take 3 strain and make a difficulty 2 vigilance check to add failures equal to successes and threats equal to advantages on a target's social check.","abilities":"Friendly: Any combat checks made against this target causes the attacker to suffer 3 strain damage.","actions":"Knife(Attack): Melee; Damage 3; Critical 3; Range [Engaged]","equipment":"None","drops":"Spool of White Felt","difficulty":1,"spawnLocations":"Safe","type":"Rival","behavior":"Docile. Very talkative and helpful.","fear":0},
  {"name":"Humanoid [Red]","description":"Looks like a human but with pitch black skin. The facial features: Eyes, Nose, Mouth, and ears, are a glowing Red.","stats":"4/4/1/2/2/4","soak":6,"wounds":23,"strain":0,"defenses":"1/1","skills":"Ranged 3/Melee 2","talents":"Quick Strike 2: Add two boost dice to any target who has not taken thier turn yet in the current encounter./Barrage 3: Add 3 damage when attacking at long range./Feral Strength 3: Add 3 damage to melee attacks.","abilities":"Fearful: Any fear checks made against this entity automatically adds 2 threats./Ammo Creation: Any ranged weapon that uses ammo does not need to be reloaded when within the hands of this entity./Heavy Lifter: Encumbrance does not affect this entity.","actions":"Browning(Attack): Ranged; Damage 10; Critical 3; Range [Long]; Auto-fire; Cumbersome 2; Pierce 2; Vicious 2/Saber: Melee; Damage 6; Critical 2; Range [Engaged]; Pierce 1","equipment":"Browning Automatic Rifle/Saber","drops":"Spool of Red Felt","difficulty":3,"spawnLocations":"Dangerous","type":"Rival","behavior":"Docile to humans. Cannot communicate.","fear":-1},
  {"name":"Humanoid [Yellow]","description":"Looks like a human but with pitch black skin. The facial features: Eyes, Nose, Mouth, and ears, are a glowing Yellow.","stats":"3/2/4/4/4/4","soak":8,"wounds":44,"strain":0,"defenses":"2/2","skills":"Charm 4/Cool 3/Negotiation 4","talents":"Probing Question: If knows flaw or fear, add 3 strain to any social checks that deal strain to the target./Interjection: As an Out-Of-Turn-Incidental, take 3 strain and make a difficulty 2 vigilance check to add failures equal to successes and threats equal to advantages on a target's social check./Commanding Presence: As an action, make a cool vs. discipline check to force a target to leave the encounter. This can be done once per session.","abilities":"STEM proficency: Any checks relating to the STEM category of learning adds 2 successes, 1 success and 2 advantage, or 4 advantages./Friendly: Any combat checks made against this target causes the attacker to suffer 3 strain damage.","actions":"Knife(Attack): Melee; Damage 4; Critical 3; Range [Engaged]","equipment":"Microscope/Knife","drops":"Spool of Yellow Felt","difficulty":5,"spawnLocations":"All","type":"Rival","behavior":"Docile to humans. Incredibly intelligent and often times assists in STEM research fields.","fear":0},
  {"name":"Humanoid [Blue]","description":"Looks like a human but with pitch black skin. The facial features: Eyes, Nose, Mouth, and ears, are a glowing Blue.","stats":"5/4/5/4/4/4","soak":10,"wounds":20,"strain":0,"defenses":"3/3","skills":"Gunnery 5","talents":"Barrage 5: Add 5 damage when attacking at long range./Heavy Hitter: Spend Triumph to add Breach 1 to ranged attack. (Or add 1 breach)","abilities":"Heavy Lifter: Encumbrance does not affect this entity.","actions":"Antimatter Rifle(Attack): Gunnery; Damage 20; Critical 3; Range [Extreme]; Auto-fire; Burn 6; Limited Ammo 24; Breach 1; Prepare 3","equipment":"Antimatter Rifle","drops":"Spool of Blue Felt","difficulty":7,"spawnLocations":"All","type":"Rival","behavior":"Hostile.","fear":-1},
  {"name":"Humanoid [Static]","description":"Looks like a human but with pitch black skin. The facial features: Eyes, Nose, Mouth, and ears, are a glowing static.","stats":"7/7/7/7/7/7","soak":15,"wounds":68,"strain":73,"defenses":"4/4","skills":"Charm 5/Cool 3/Negotiation 4/Ranged 6/Melee 4/Gunnery 6","talents":"Adversary 2: Increase combat checks by 2 difficulty./Commanding Presence: As an action, make a cool vs. discipline check to force a target to leave the encounter. This can be done once per session./Feral Strength 6: Add 6 damage to melee attacks./Just Kidding!: As an Incidental, spend a story point to ignore a despair on a social check.","abilities":"Friendly: Any combat checks made against this target causes the attacker to suffer 3 strain damage./Fearful: Any fear checks made against this entity automatically adds 2 threats./Information proficency: Any checks relating to the information or knowledge adds 2 successes, 1 success and 2 advantage, or 4 advantages.","actions":"Static Grenade Launcher: Ranged; Damage 41; Critical 3; Range [Medium]; Blast 5; Burn 1; Limited Ammo 6; Unstable: After shooting with this weapon, the area where it exploded becomes a glitchy mess. All checks made within the area automatically recieves a despair./Sword of Static: Melee; Damage 40; Critical 1; Range [Engaged]; Breach 2; Disorient 4; Stun Damage; Stun 6; Superior; Vicious 4; Glitch: Whenever you hit with this weapon, the target gains the Glitched phenomenon permanently. If the target already has this effect, instead inflict a despair on its next check.","equipment":"Static Grenade Launcher/Sword of Static","drops":"Reusable Static Felt/A random rarity 9 or 10 Object (Any category) excluding endgame sets (Red Knight, Glitched, Holy)","difficulty":10,"spawnLocations":"All","type":"Nemesis","behavior":"Docile unless provoked. Shares its infinite wisdom should a wanderer ask to learn.","fear":-1},
  {"name":"Organigun","description":"A plant that looks and acts like a firearm. The type can range from a simple pistol all the way to an explosive launcher of some sort.","stats":"1/1/1/1/1/1","soak":4,"wounds":20,"strain":0,"defenses":"0/1","skills":"None","talents":"None","abilities":"None","actions":"None","equipment":"None","drops":"Nothing","difficulty":1,"spawnLocations":"All","type":"Rival","behavior":"Docile. Steals blood from a person holding it but produces extra blood cells to keep the host alive and healthy. Otherwise, it's a gun that can be used with infinite ammo.","fear":0},
  {"name":"The Artist","description":"A teenage girl of average height with brown hair and eyes. She wears purple glasses and pajamas.","stats":"2/5/2/2/2/2","soak":3,"wounds":70,"strain":66,"defenses":"0/0","skills":"None","talents":"None","abilities":"None","actions":"Summon(Action): The Artist paints an entity of difficulty 2 or lower at random except it has half of its wounds and strain and all attacks have the stun damage property. These entities drop ink versions of thier normal drops./Shield(Out-Of-Turn-Incidental): Paint around herself to gain 8 soak for one attack.","equipment":"Magicked Brush/Magicked Palette","drops":"Bucket of Infinite Ink","difficulty":5,"spawnLocations":"Studio","type":"Nemesis","behavior":"Friendly unless provoked. Uses ink to create entities to fight for her when threatened.","fear":-1},
  {"name":"Memory Wyrm","description":"A colossal red worm with a massive mouth in place of its eyes.","stats":"6/6/6/6/6/6","soak":13,"wounds":58,"strain":63,"defenses":"4/4","skills":"Brawl 5/Stealth 2","talents":"Reckless Charge: Spend incidental after using the move maneuver to take 2 strain and add 2 successes and 2 threats on the next brawl check./Whirlwind: As an action, take 4 strain to bite everything engaged with the Memory Wyrm but does not put any into its mouth.","abilities":"Loss of Senses: All Cunning-related checks add 2 automatic failures while the Memory Wyrm is within a long range./Permanent death: If someone dies to the Memory Wyrm, any and all memories of thier existence cease to be./Distracted: The Memory Wyrm may be distracted by a filled memory jar.","actions":"Burrow(Action): Destroy the ground beneath it and move directly underground. This does not use a maneuver./Bite(Attack): Brawl; Damage 25; Critical 5; Range [Engaged]; Pierce 3; Disorient 1; Swallowed: While within the mouth, the target is considered grappled. The target may escape if the Memory Wyrm takes 7 or more wounds in one turn. Up to 5 targets may be in its mouth at one time./Swallow(Action): Only usable on creatures within the Memory Wyrm's mouth. Swallow any within its mouth. Refer to Behavior section for rules.","equipment":"None","drops":"4-6 Empty Memory Jars","difficulty":8,"spawnLocations":"Outdoors","type":"Nemesis","behavior":"Hostile. Burrows within the ground waiting for prey to become comfortable before striking. While swallowed: Anything within the stomach will take 5 wounds and 5 strain at the end of thier turn. As an action while swallowed, a difficulty 5 survival check may be made. Each success reduces the damage taken at the end of the turn by 1 (both wounds and strain) and on a success in general gain 1 point towards surviving. After 3 points are gained, the target may exit the wyrm's stomach.","fear":-1}]

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
        type: data[i].type,
        behavior: data[i].behavior,
        fear: data[i].fear
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
      setLoading(false);
    })

    return () => {
      unsub();
    }
  }

  useEffect(() => {
    if (entities.length === 0) {
      getFromDB();
    }
  }, []);

  // Helper functions for styling
  const getDifficultyColor = (difficulty) => {
    if (difficulty < 2) return { color: 'primary', label: 'Easy' };
    if (difficulty < 4) return { color: 'success', label: 'Medium' };
    if (difficulty < 6) return { color: 'warning', label: 'Hard' };
    if(difficulty < 8) return {color: 'error', label: 'Very Hard'}
    return { color: 'secondary', label: 'Extreme' };
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Minion': return { color: 'default', bgColor: '#e3f2fd' };
      case 'Rival': return { color: 'primary', bgColor: '#f3e5f5' };
      case 'Nemesis': return { color: 'error', bgColor: '#ffebee' };
      default: return { color: 'default', bgColor: '#f5f5f5' };
    }
  };

  const getDifficultyRange = (difficulty) => {
    if (difficulty < 2) return 'Easy';
    if (difficulty < 4) return 'Medium';
    if (difficulty < 6) return 'Hard';
    if (difficulty < 8) return 'Very Hard';
    return 'Extreme';
  };

  // Filtered entities based on search, type filter, and difficulty filter
  const filteredEntities = useMemo(() => {
    return entities.filter(entity => {
      const matchesSearch = entity.name.toLowerCase().includes(searchTerm.toLowerCase()) || entity.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'All' || entity.type === filterType;
      const matchesDifficulty = difficultyFilter === 'All' || getDifficultyRange(entity.difficulty) === difficultyFilter;
      
      return matchesSearch && matchesType && matchesDifficulty;
    });
  }, [entities, searchTerm, filterType, difficultyFilter]);

  const displayTable = () => {
    if (filteredEntities.length === 0) {
      return (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>{searchTerm || filterType !== 'All' || difficultyFilter !== 'All' ? 'No entities match your filters' : 'No entities found'}</Typography>
          <Typography variant="body2" color="text.secondary">Try adjusting your search or filters</Typography>
        </Box>
      );
    }

    return (
      <Grid container spacing={2}>
        {filteredEntities.map((entity) => {
          const difficultyInfo = getDifficultyColor(entity.difficulty);
          const typeInfo = getTypeColor(entity.type);
          const isSelected = currEntity === entity.name;
          
          return (
            <Grid item xs={12} key={entity.name}>
              <Card 
                sx={{ 
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  border: isSelected ? '2px solid #1976d2' : '1px solid rgba(0,0,0,0.12)',
                  transform: isSelected ? 'scale(1.01)' : 'scale(1)',
                  boxShadow: isSelected ? 3 : 1,
                  '&:hover': {
                    transform: 'scale(1.01)',
                    boxShadow: 2,
                  },
                  backgroundColor: isSelected ? 'rgba(25, 118, 210, 0.04)' : 'white'
                }}
                onClick={() => setCurrEntity(entity.name)}
              >
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 'bold',
                        fontSize: '1rem',
                        color: isSelected ? 'primary.main' : 'text.primary'
                      }}
                    >
                      {entity.name}
                    </Typography>
                    <Stack direction="row" spacing={1}>
                      <Chip 
                        label={entity.type}
                        color={typeInfo.color}
                        size="small"
                        variant="filled"
                      />
                      <Chip 
                        label={`${difficultyInfo.label} ${entity.difficulty}`}
                        color={difficultyInfo.color}
                        size="small"
                      />
                    </Stack>
                  </Box>
                  
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ 
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      lineHeight: 1.4,
                    }}
                  >
                    {entity.description || 'No description available'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    );
  };

  const table = useMemo(() => displayTable(), [filteredEntities, currEntity, loading]);

  const DisplayEntity = () => {
    const entity = entities.find(e => e.name === currEntity);
    if (!entity) return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h6" color="text.secondary">
          Select an entity from the list to view details
        </Typography>
      </Box>
    );
    
    return (
      <Fade in={true} timeout={500}>
        <Box>
          <EntityItem entity={entity} person={false}/>
        </Box>
      </Fade>
    );
  };

  if (localStorage.getItem("loggedIn") === 'false') {
    return <NotLoggedIn />;
  }

  return (
    <Container maxWidth="100%" sx={{ py: 4, bgcolor: '#f8f9fa', minHeight: '100vh', marginTop: '0px' }}>
      <Paper sx={{ p: 3, mb: 3, bgcolor: 'white', borderRadius: 2, boxShadow: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 1 }}>Entities</Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button 
              variant="contained" 
              startIcon={<Add />}
              onClick={addData}
              sx={{ 
                px: 3, 
                py: 1,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 'bold'
              }}
            >
              Add Data
            </Button>
          </Box>
        </Box>
      </Paper>

      {entities.length > 0 ? (
        <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start', maxHeight: '80%' }}>
          <Box sx={{ flex: '0 0 30%', maxWidth: '30%' }}>
            <Paper sx={{ p: 3, mb: 3, bgcolor: 'white', borderRadius: 2 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  placeholder="Search entities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start"><Search /></InputAdornment>
                    ),
                  }}
                  fullWidth
                  size="small"
                />
                
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {['All', 'Minion', 'Rival', 'Nemesis'].map((type) => (
                    <Chip
                      key={type}
                      label={type}
                      onClick={() => setFilterType(type)}
                      color={filterType === type ? 'primary' : 'default'}
                      variant={filterType === type ? 'filled' : 'outlined'}
                      size="small"
                    />
                  ))}
                </Box>

                <FormControl fullWidth size="small">
                  <InputLabel>Difficulty</InputLabel>
                  <Select
                    value={difficultyFilter}
                    onChange={(e) => setDifficultyFilter(e.target.value)}
                    label="Difficulty"
                  >
                    <MenuItem value="All">All Difficulties</MenuItem>
                    <MenuItem value="Easy">Easy (0-1)</MenuItem>
                    <MenuItem value="Medium">Medium (2-3)</MenuItem>
                    <MenuItem value="Hard">Hard (4-5)</MenuItem>
                    <MenuItem value="Very Hard">Very Hard (6-7)</MenuItem>
                    <MenuItem value="Extreme">Extreme (8+)</MenuItem>
                  </Select>
                </FormControl>

                <Typography variant="body2" color="text.secondary">
                  Showing {filteredEntities.length} of {entities.length} entities
                </Typography>
              </Box>
            </Paper>

            <Paper sx={{ p: 3, bgcolor: 'white', borderRadius: 2, maxHeight: '70vh', overflow: 'auto' }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 2, color: 'primary.main' }}>Entity Collection</Typography>
              {table}
            </Paper>
          </Box>

          <Box sx={{ flex: 1 }}>
            <Paper sx={{ p: 3, bgcolor: 'white', borderRadius: 2, minHeight: '70vh' }}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3, color: 'primary.main' }}>Entity Details</Typography>
              <DisplayEntity />
            </Paper>
          </Box>
        </Box>
      ) : (
        <Paper sx={{ p: 6, textAlign: 'center', bgcolor: 'white', borderRadius: 2 }}>
          <Typography variant="h5" color="text.secondary" gutterBottom>No entities found</Typography>
          {!loading && (
            <Button variant="contained" onClick={addData} size="large" startIcon={<Add />}>Add Entities Now</Button>
          )}
        </Paper>
      )}
    </Container>
  );
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