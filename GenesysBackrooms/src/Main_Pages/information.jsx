import { Box, Toolbar } from "@mui/material";
import NotLoggedIn from "../Components/notLoggedIn";

export default function Information() {
  return (
    localStorage.getItem("loggedIn") === 'false' ? <NotLoggedIn /> :
      <Box>
        <h1>Information</h1>
      </Box>
  )
}


/*
Boon Elixir comes from massive achievements. TBD what those are.

Resting.
  Resting can be done for any amount of time so long as the area is deemed as safe. The benefits for resting are as follows:
  Per hour rested: 
    Remove 1 level of sanity drain up to 7.
    Heal 1 wound up to 7.
    Heal all strain.
  At 8 hours rested:
    A critical injury may be removed. To do so, roll medicine with difficulty dice equal to the critical injury's difficulty.
    Heal 1 exhaustion.
  At 24 hours rested:
    Remove all sanity drain.
    Heal 1 critical injury without a roll.
    Heal all exhaustion.

Sanity.
  Level 1: Add setback dice.
  Level 3: Add difficulty dice.
  Level 5: Upgrade difficulty dice.
  Level 7: Add difficulty dice.
  Level 9: Upgrade difficulty dice.
  Level 10+: Treat your skills as though they were tier 0.

  If it says "Roll Sanity", its a default difficulty 2 to see if a level of sanity drain is gained or not.

Crafting talents: Each tier has one and it unlocks the ability to craft tiered items. Also gives a boost in some way (WIP)
*/