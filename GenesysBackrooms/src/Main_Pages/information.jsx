import { Box, Toolbar } from "@mui/material";

export default function Information() {
  return (
    <Box>
      <Toolbar />
      <h1>Information</h1>
    </Box>
  )
}


/*
Boon Elixir comes from massive achievements.

Glitched: At random intervals you glitch, potentially resulting in an action you did not intend to do. Before every skill roll, roll 1d6. If you roll a 1, you glitch during the skill and add 2 setback dice to that roll. Otherwise, nothing happens.

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

Exhaustion.
  There are 5 levels of exhaustion.
  Level 1: 
  Level 2:
  Level 3:
  Level 4:
  Level 5:
  5+: Death

Tier 5 Talent: Gain 3 soak to strain
*/