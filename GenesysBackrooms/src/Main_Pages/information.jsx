import { Accordion, AccordionDetails, AccordionSummary, Box, Divider, List, ListItem, ListItemText, Stack, Tab, Tabs, Toolbar, Typography } from "@mui/material";
import NotLoggedIn from "../Components/notLoggedIn";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useState } from "react";

export default function Information() {
  const [value, setValue] = useState(0);

  const handleChange = (event, val) => {
    setValue(val);
  }

  const DisplayTab = () => {
    switch(value) {
      case 0:
        return (
          <Stack direction='row' gap={3}>
            <List>
              <ListItem disablePadding>
                <ListItemText><b>One of the following actions per turn</b></ListItemText>
              </ListItem>
              <ListItem disablePadding>
                <ListItemText>Use a maneuver</ListItemText>
              </ListItem>
              <ListItem disablePadding>
                <ListItemText>Activate an ability</ListItemText>
              </ListItem>
              <ListItem disablePadding>
                <ListItemText>Perform a skill check</ListItemText>
              </ListItem>
              <ListItem disablePadding>
                <ListItemText>Perform a combat check</ListItemText>
              </ListItem>
            </List>
            <Divider orientation="vertical" variant="middle" flexItem/>
            <List>
              <ListItem disablePadding>
                <ListItemText><b>Any 2 of the following maneuvers per turn. (Page 98-100)</b></ListItemText>
              </ListItem>
              <ListItem disablePadding>
                <ListItemText>Aim</ListItemText>
              </ListItem>
              <ListItem disablePadding>
                <ListItemText>Assist</ListItemText>
              </ListItem>
              <ListItem disablePadding>
                <ListItemText>Guarded Stance</ListItemText>
              </ListItem>
              <ListItem disablePadding>
                <ListItemText>Interact with Environment</ListItemText>
              </ListItem>
              <ListItem disablePadding>
                <ListItemText>Manage Gear</ListItemText>
              </ListItem>
              <ListItem disablePadding>
                <ListItemText>Mount or Dismount</ListItemText>
              </ListItem>
              <ListItem disablePadding>
                <ListItemText>Move</ListItemText>
              </ListItem>
              <ListItem disablePadding>
                <ListItemText>Drop prone or Stand from prone</ListItemText>
              </ListItem>
              <ListItem disablePadding>
                <ListItemText>Preparation</ListItemText>
              </ListItem>
              <ListItem disablePadding>
                <ListItemText>Another not listed here that does not require a check</ListItemText>
              </ListItem>
            </List>
            <Divider orientation="vertical" variant="middle" flexItem/>
            <List>
              <ListItem disablePadding>
                <ListItemText><b>Any 3 of the following incidentals per turn.</b></ListItemText>
              </ListItem>
              <ListItem disablePadding>
                <ListItemText>Speak to another character</ListItemText>
              </ListItem>
              <ListItem disablePadding>
                <ListItemText>Drop a held item or object</ListItemText>
              </ListItem>
              <ListItem disablePadding>
                <ListItemText>Minor movements like looking behind you or peeking around a corner</ListItemText>
              </ListItem>
              <ListItem disablePadding>
                <ListItemText>Another action that takes very little time or has no measurable impact on the encounter</ListItemText>
              </ListItem>
              <ListItem disablePadding>
                <ListItemText><b>Any 1 incidental outside of your turn from the above list</b></ListItemText>
              </ListItem>
            </List>
          </Stack>
        )
      case 1:
        return (
          <Box>
            <List>
              <ListItem disablePadding>
                <ListItemText>Defense: 4</ListItemText>
              </ListItem>
              <ListItem disablePadding>
                <ListItemText>Soak: 10</ListItemText>
              </ListItem>
              <ListItem disablePadding>
                <ListItemText>Wounds: 150</ListItemText>
              </ListItem>
              <ListItem disablePadding>
                <ListItemText>Strain: 150</ListItemText>
              </ListItem>
              <ListItem disablePadding>
                <ListItemText>Characteristics: 6 (5 in character creation)</ListItemText>
              </ListItem>
              <ListItem disablePadding>
                <ListItemText>Skills: Rank 6 (2 while during character creation)</ListItemText>
              </ListItem>
            </List>
          </Box>
        )
      case 2:
        return (
          <Box>
            <Stack direction='row' gap={3}>
              <List>
                <ListItem disablePadding>
                  <ListItemText><b>Maxiumum dice per source</b></ListItemText>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemText>5 boost dice</ListItemText>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemText>5 setback dice</ListItemText>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemText>2 difficulty dice</ListItemText>
                </ListItem>
              </List>
              <Divider orientation="vertical" variant="middle" flexItem/>
              <Box>
                <Typography><b>Advantage spending:</b></Typography>
                <Divider />
                <Typography>Combat:</Typography>
                <List>
                  <ListItem disablePadding>
                    <ListItemText>Recover strain (1)</ListItemText>
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemText>Add a boost dice to the next ally's check (1)</ListItemText>
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemText>Notice an important detail (1)</ListItemText>
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemText>Perform a free maneuver (2)</ListItemText>
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemText>Add a setback dice to a target's next check (2)</ListItemText>
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemText>Remove 1 melee or ranged defense from target until end of turn (3)</ListItemText>
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemText>Ignore environmental penalties (3)</ListItemText>
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemText>Forgo damage to force the target to skip thier next turn (3)</ListItemText>
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemText>Gain 1 melee or ranged defense until the start of your next turn (3)</ListItemText>
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemText>Disarm the target (3)</ListItemText>
                  </ListItem>
                </List>
                <Divider />
                <Typography>Social:</Typography>
                <List>
                  <ListItem disablePadding>
                    <ListItemText>Recover strain (1)</ListItemText>
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemText>Add a boost dice to the next ally's check (1)</ListItemText>
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemText>Notice an important detail (1)</ListItemText>
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemText>Add a setback dice to a target's next check (2)</ListItemText>
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemText>Learn the strength or flaw of the target (2)</ListItemText>
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemText>Learn the desire or fear of the target (3)</ListItemText>
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemText>Conceal your true goal (3)</ListItemText>
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemText>Learn the target's true goal (3)</ListItemText>
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemText>Inflict a critical remark (4)</ListItemText>
                  </ListItem>
                </List>
              </Box>
              <Divider orientation="vertical" variant="middle" flexItem/>
              <Box>
                <Typography><b>Triumph spending:</b></Typography>
                <Divider />
                <Typography>Combat:</Typography>
                <List>
                  <ListItem disablePadding>
                    <ListItemText>Anything requiring advantages</ListItemText>
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemText>Add 1 difficulty to target's next check (1)</ListItemText>
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemText>Upgrade and ally's next check (1)</ListItemText>
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemText>Do something vital (1)</ListItemText>
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemText>On initiative, perform a free maneuver (1)</ListItemText>
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemText>Inflict a critical injury (1)</ListItemText>
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemText>Destroy the target's weapon [if possible] (2)</ListItemText>
                  </ListItem>
                </List>
                <Divider />
                <Typography>Social:</Typography>
                <List>
                  <ListItem disablePadding>
                    <ListItemText>Anything requiring advantages</ListItemText>
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemText>Add 1 difficulty to target's next check (1)</ListItemText>
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemText>Upgrade and ally's next check (1)</ListItemText>
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemText>Do something vital (1)</ListItemText>
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemText>Inflict a critical remark (1)</ListItemText>
                  </ListItem>
                </List>
              </Box>
              <Divider orientation="vertical" variant="middle" flexItem/>
              <Box>
                <Typography><b>Threat spending:</b></Typography>
                <Divider />
                <Typography>Combat:</Typography>
                <List>
                  <ListItem disablePadding>
                    <ListItemText>Suffer 1 strain (1)</ListItemText>
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemText>Lose the benefits of a previous maneuver (1)</ListItemText>
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemText>Target may perform a maneuver free (2)</ListItemText>
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemText>Add a boost dice to the target's next check (2)</ListItemText>
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemText>The active player adds a setback dice to the next check made (2)</ListItemText>
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemText>Fall prone (3)</ListItemText>
                  </ListItem>
                </List>
                <Divider />
                <Typography>Social:</Typography>
                <List>
                  <ListItem disablePadding>
                    <ListItemText>Suffer 1 strain (1)</ListItemText>
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemText>Add a boost dice to the target's next check (2)</ListItemText>
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemText>The active player adds a setback dice to the next check made (2)</ListItemText>
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemText>The active player reveals thier own strength or flaw (2)</ListItemText>
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemText>The active player reveals thier own desire or fear (3)</ListItemText>
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemText>The active character reveals thier own true goal (3)</ListItemText>
                  </ListItem>
                </List>
              </Box>
              <Divider orientation="vertical" variant="middle" flexItem/>
              <Box>
                <Typography><b>Despair spending:</b></Typography>
                <Divider />
                <Typography>Combat:</Typography>
                <List>
                  <ListItem disablePadding>
                    <ListItemText>Anything requiring threats</ListItemText>
                  </ListItem>
                  <ListItem disablePadding>
                  <ListItemText>The active player's next check is 1 difficulty higher (1)</ListItemText>
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemText>Damage the active player's weapon. If dual-wielding, damage the first weapon (1)</ListItemText>
                  </ListItem>
                </List>
                <Divider />
                <Typography>Social:</Typography>
                <List>
                  <ListItem disablePadding>
                    <ListItemText>Anything requiring threats</ListItemText>
                  </ListItem>
                  <ListItem disablePadding>
                  <ListItemText>The active player's next check is 1 difficulty higher (1)</ListItemText>
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemText>The active player becomes distracted and loses thier next turn (1)</ListItemText>
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemText>Learn a false motivation facet of target (1)</ListItemText>
                  </ListItem>
                </List>
              </Box>
            </Stack>
          </Box>
        )
      case 3:
        return (
          <List>
            <ListItem disablePadding>
              <ListItemText><b>Staggered:</b> You may not use your action while staggered, including downgrading to a maneuver.</ListItemText>
            </ListItem>
            <ListItem disablePadding>
              <ListItemText><b>Immobilized:</b> You may not use any maneuvers, including any that may be part of an extra effect.</ListItemText>
            </ListItem>
            <ListItem disablePadding>
              <ListItemText><b>Disoriented:</b> You add one setback dice to all checks while Disoriented.</ListItemText>
            </ListItem>
            <ListItem disablePadding>
              <ListItemText><b>Prone:</b> Melee attacks add a boost dice and ranged attacks add a setback dice when targeting a prone target.</ListItemText>
            </ListItem>
            <ListItem disablePadding>
              <ListItemText><b>Encumbered:</b> For each point over the encumbrance threshold, that player recieves a setback dice. While encumbered at or above brawn, the player's free maneuver is lost.</ListItemText>
            </ListItem>
            <ListItem disablePadding>
              <ListItemText><b>Critical remark:</b> Inflict 5 strain to the target. This can be done in social conflict only.</ListItemText>
            </ListItem>
          </List>
        )
      case 4:
        return (
          <Stack direction='row' gap={3}>
            <List>
              <ListItem disablePadding>
                <ListItemText><b>Movement requiring 1 maneuver:</b></ListItemText>
              </ListItem>
              <ListItem disablePadding>
                <ListItemText>Between Engaged and Short range</ListItemText>
              </ListItem>
              <ListItem disablePadding>
                <ListItemText>Between Short and Medium range</ListItemText>
              </ListItem>
            </List>
            <Divider orientation="vertical" variant="middle" flexItem/>
            <List>
              <ListItem disablePadding>
                <ListItemText><b>Movement requiring 2 maneuvers:</b></ListItemText>
              </ListItem>
              <ListItem disablePadding>
                <ListItemText>Between Medium and Long range</ListItemText>
              </ListItem>
              <ListItem disablePadding>
                <ListItemText>Between Long and Extreme range</ListItemText>
              </ListItem>
            </List>
            <Divider orientation="vertical" variant="middle" flexItem/>
            <List>
              <ListItem disablePadding>
                <ListItemText><b>Melee attack difficulty</b></ListItemText>
              </ListItem>
              <ListItem disablePadding>
                <ListItemText>Engaged: 2</ListItemText>
              </ListItem>
              <ListItem disablePadding>
                <ListItemText>Short: 3 (with reach)</ListItemText>
              </ListItem>
              <ListItem disablePadding>
                <ListItemText>Medium: N/A</ListItemText>
              </ListItem>
              <ListItem disablePadding>
                <ListItemText>Long: N/A</ListItemText>
              </ListItem>
              <ListItem disablePadding>
                <ListItemText>Extreme: N/A</ListItemText>
              </ListItem>
            </List>
            <Divider orientation="vertical" variant="middle" flexItem/>
            <List>
              <ListItem disablePadding>
                <ListItemText><b>Ranged attack difficulty</b></ListItemText>
              </ListItem>
              <ListItem disablePadding>
                <ListItemText>Engaged: 2 (single-handed) and 3 (two-handed)</ListItemText>
              </ListItem>
              <ListItem disablePadding>
                <ListItemText>Short: 1</ListItemText>
              </ListItem>
              <ListItem disablePadding>
                <ListItemText>Medium: 2</ListItemText>
              </ListItem>
              <ListItem disablePadding>
                <ListItemText>Long: 3</ListItemText>
              </ListItem>
              <ListItem disablePadding>
                <ListItemText>Extreme: 4</ListItemText>
              </ListItem>
            </List>
            <Divider orientation="vertical" variant="middle" flexItem/>
            <Box>
              <Typography><b>Dual wielding:</b></Typography>
              <Typography>Step 0: Determine which weapon will attack first</Typography>
              <Typography>Step 1: Consider both weapons skills</Typography>
              <Typography>Step 2: Take the lowest skill</Typography>
              <Typography>Step 3: Consider both weapons Characteristics</Typography>
              <Typography>Step 4: Take the lowest Characteristic</Typography>
              <Typography>Step 5: Consider both weapons attack difficulty</Typography>
              <Typography>Step 6: Take the higher difficulty and add 1</Typography>
              <Typography>Step 7: Attack</Typography>
              <Typography>Step 8(optional): Spend two advantages to deal the other weapons damage</Typography>
            </Box>
            <Divider orientation="vertical" variant="middle" flexItem/>
            <List>
              <ListItem disablePadding>
                <ListItemText><b>Critical injuries:</b></ListItemText>
              </ListItem>
              <ListItem disablePadding>
                <ListItemText>Critical injuries may only be applied if the attack does more damage than the target's soak</ListItemText>
              </ListItem>
              <ListItem disablePadding>
                <ListItemText>For each critical injury beyond the first in a single attack, add 10 to the roll</ListItemText>
              </ListItem>
              <ListItem disablePadding>
                <ListItemText>Once per combat, whenever a player's wounds surpass the threshold, the player recieves a critical injury</ListItemText>
              </ListItem>
              <ListItem disablePadding>
                <ListItemText>Triumphs may apply a critical injury regardless of the damage. It just requires a successful hit</ListItemText>
              </ListItem>
            </List>
          </Stack>
        )
      case 5:
        return <Typography>Hacking</Typography>
      case 6:
        return <Typography>Healing</Typography>
    }
  }

  return (
    localStorage.getItem("loggedIn") === 'false' ? <NotLoggedIn /> :
      <Box>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>General Genesys rules</AccordionSummary>
          <AccordionDetails>
            <Tabs value={value} onChange={handleChange}>
              <Tab label='Actions per turn' />
              <Tab label='Maximum character stats' />
              <Tab label='Bonuses and Detriments' />
              <Tab label='Keywords' />
              <Tab label='Combat' />
              <Tab label='Hacking' />
              <Tab label='Healing' />
            </Tabs>
            <DisplayTab />
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>Custom Character Creation</AccordionSummary>
          <AccordionDetails>
            <Stack direction='row' gap={3}>
              <List>
                <ListItem disablePadding>
                  <ListItemText><b>Species/Archetype</b></ListItemText>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemText>All characteristics begin at 1</ListItemText>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemText>You may gain a level in any skill of your choosing</ListItemText>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemText>You may create up to two special abilities by spending 5 xp (DMs discretion)</ListItemText>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemText>Your wound and strain thresholds add up to 20 with 8 being the lowest and 12 the highest.</ListItemText>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemText>So, wounds could be 8 + brawn to 12 + brawn where strain would be 12 + willpower to 8 + willpower. 8/12, 9/11, 10/10, etc.</ListItemText>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemText>You gain 230 xp to spend on character creation.</ListItemText>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemText>You may not go over 2 levels in any skill</ListItemText>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemText>You may not go over 5 in any characteristic</ListItemText>
                </ListItem>
              </List>
              <Divider orientation="vertical" variant="middle" flexItem/>
              <List>
                <ListItem disablePadding>
                  <ListItemText><b>Career</b></ListItemText>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemText>Choose 8 skills to be career skills</ListItemText>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemText>Take 4 of those 8 and add 1 level to it</ListItemText>
                </ListItem>
              </List>
            </Stack>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>Skills</AccordionSummary>
          <AccordionDetails>
            <List>
              <ListItem disablePadding>
                <ListItemText>Sanity(Willpower): Used to prevent yourself from going insane.</ListItemText>
              </ListItem>
              <ListItem disablePadding>
                <ListItemText>Knowledge[General](Intelligence): Used to determine non-specific knowledge on a subject.</ListItemText>
              </ListItem>
              <ListItem disablePadding>
                <ListItemText>Knowledge[Mechanics](Intelligence): Used to determine how a piece of machinery or technology operates.</ListItemText>
              </ListItem>
              <ListItem disablePadding>
                <ListItemText>Knowledge[Lore](Intelligence): Used to understand or determine things about how the Backrooms came to be and about the levels and entities.</ListItemText>
              </ListItem>
              <ListItem disablePadding>
                <ListItemText>Knowledge[Objects](Intelligence): Used to determine how an object works or should be interacted with.</ListItemText>
              </ListItem>
            </List>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>Talents</AccordionSummary>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>Equipment Traits</AccordionSummary>
        </Accordion>
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