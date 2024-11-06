import { Box, Toolbar } from "@mui/material";

export default function Entities() {
  const data = {
    "Window": {
      name: "Window", 
      description: "A window that matches it's surroundings. Within the window is a shadowy humanoid figure.", 
      stats: [2, 1, 2, 2, 2, 2], 
      soak: 2, 
      wounds: 14, 
      strain: 0, 
      defenses: [0, 0], 
      skills: ["Brawl 2", "Charm 3"], 
      talents: {}, 
      abilities: {"Whisper": "The Window whispers within a short range. At the start of a player's turn, the player must make a contensted Cool check versus the Window's Charm check. On a fail, the player is staggered and must use thier free maneuver to move towards the Window. For the next 3 turns, that player is unaffected by this ability."}, 
      actions: {"Grab (Attack)": "Brawl; Damage 6; Critical 5; Range [Engaged]; Stun Damage"}, 
      equipment: []},
  }

  return (
    <Box>
      <Toolbar />
      <h1>Entities</h1>
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