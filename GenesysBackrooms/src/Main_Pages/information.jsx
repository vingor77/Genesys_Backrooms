import { Accordion, AccordionDetails, AccordionSummary, Box, Divider, List, ListItem, ListItemText, Stack, Tab, Tabs, Toolbar, Typography } from "@mui/material";
import NotLoggedIn from "../Components/notLoggedIn";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useState } from "react";

export default function Information() {
  const [generalValue, setGeneralValue] = useState(0);
  const [effectValue, setEffectValue] = useState(0);

  const handleGeneralChange = (event, val) => {
    setGeneralValue(val);
  }

  const handleEffectChange = (event, val) => {
    setEffectValue(val);
  }

  const DisplayGeneralTab = () => {
    switch(generalValue) {
      case 0:
        return (
          <Stack direction={{sm: 'column', md: 'row'}} gap={3}>
            <Box>
              <Typography><b>One of the following actions per turn</b></Typography>
              <Typography>Use a maneuver</Typography>
              <Typography>Activate an ability</Typography>
              <Typography>Perform a skill check</Typography>
              <Typography>Perform a combat check</Typography>
            </Box>
            <Divider orientation="vertical" variant="middle" flexItem/>
            <Box>
              <Typography><b>Any 2 of the following maneuvers per turn. (Page 98-100)</b></Typography>
              <Typography>Aim</Typography>
              <Typography>Assist</Typography>
              <Typography>Guarded Stance</Typography>
              <Typography>Interact with Environment</Typography>
              <Typography>Manage Gear</Typography>
              <Typography>Mount or Dismount</Typography>
              <Typography>Move</Typography>
              <Typography>Drop prone or Stand from prone</Typography>
              <Typography>Preparation</Typography>
              <Typography>Another not listed here that does not require a check</Typography>
            </Box>
            <Divider orientation="vertical" variant="middle" flexItem/>
              <Box>
                <Typography><b>Any 3 of the following incidentals per turn.</b></Typography>
                <Typography>Speak to another character</Typography>
                <Typography>Drop a held item or object</Typography>
                <Typography>Minor movements like looking behind you or peeking around a corner</Typography>
                <Typography>Another action that takes very little time or has no measurable impact on the encounter</Typography>
                <Typography><b>Any 1 incidental outside of your turn from the above list</b></Typography>
              </Box>
          </Stack>
        )
      case 1:
        return (
          <Box>
            <Typography>Defense: 4</Typography>
            <Typography>Soak: 10</Typography>
            <Typography>Wounds: 150</Typography>
            <Typography>Strain: 150</Typography>
            <Typography>Characteristics: 6 (5 in character creation)</Typography>
            <Typography>Skills: Rank 6 (2 while during character creation)</Typography>
          </Box>
        )
      case 2:
        return (
          <Box>
            <Stack>
              <Box>
                <Typography><b>Maxiumum dice per source</b></Typography>
                <Typography>5 boost dice</Typography>
                <Typography>5 setback dice</Typography>
                <Typography>2 difficulty dice</Typography>
              </Box>
              <Box>
                <br />
                <Divider><b>Spending Advantages in Combat</b></Divider>
                <br />
                <Stack direction={{sm: 'column', md: 'row'}}>
                  <Box width={{sm: '100%', md: '25%'}}>
                    <Typography variant="h5">Requires 1:</Typography>
                    <Typography>1. Recover strain</Typography>
                    <Typography>2. Add a boost dice to the next ally's check</Typography>
                    <Typography>3. Notice an important detail</Typography>
                  </Box>
                  <Box width={{sm: '100%', md: '25%'}}>
                    <Typography variant="h5">Requires 2:</Typography>
                    <Typography>1. Perform a free maneuver</Typography>
                    <Typography>2. Add a setback dice to a target's next check</Typography>
                  </Box>
                  <Box>
                    <Typography variant="h5">Requires 3:</Typography>
                    <Typography>1. Remove 1 melee or ranged defense from target until end of turn</Typography>
                    <Typography>2. Ignore environmental penalties</Typography>
                    <Typography>3. Forgo damage to force the target to skip thier next turn</Typography>
                    <Typography>4. Gain 1 melee or ranged defense until the start of your next turn</Typography>
                    <Typography>5. Disarm the target</Typography>
                  </Box>
                </Stack>
                <br />
                <Divider><b>Spending Advantages in Social Conflict</b></Divider>
                <br />
                <Stack direction={{sm: 'column', md: 'row'}} alignItems='flex-start' justifyContent='space-between'>
                  <Box width={{sm: '100%', md: '25%'}}>
                    <Typography variant="h5">Requires 1:</Typography>
                    <Typography>1. Recover strain</Typography>
                    <Typography>2. Add a boost dice to the next ally's check</Typography>
                    <Typography>3. Notice an important detail</Typography>
                  </Box>
                  <Box width={{sm: '100%', md: '25%'}}>
                    <Typography variant="h5">Requires 2:</Typography>
                    <Typography>1. Perform a free maneuver</Typography>
                    <Typography>2. Add a setback dice to a target's next check</Typography>
                    <Typography>3. Learn the strength or flaw of the target</Typography>
                  </Box>
                  <Box width={{sm: '100%', md: '25%'}}>
                    <Typography variant="h5">Requires 3:</Typography>
                    <Typography>1. Learn the desire or fear of the target</Typography>
                    <Typography>2. Conceal your true goal</Typography>
                    <Typography>3. Learn the target's true goal</Typography>
                  </Box>
                  <Box width={{sm: '100%', md: '25%'}}>
                    <Typography variant="h5">Requires 4:</Typography>
                    <Typography>1. Inflict a critical remark</Typography>
                  </Box>
                </Stack>
              </Box>
              <Box>
                <br />
                <Divider><b>Spending Triumphs in Combat</b></Divider>
                <br />
                <Stack direction={{sm: 'column', md: 'row'}}>
                  <Box width={{sm: '100%', md: '25%'}}>
                    <Typography variant="h5">Requires 1:</Typography>
                    <Typography>1. Anything requiring advantages</Typography>
                    <Typography>2. Add 1 difficulty to target's next check</Typography>
                    <Typography>3. Upgrade and ally's next check</Typography>
                    <Typography>4. Do something vital</Typography>
                    <Typography>5. On initiative, perform a free maneuver</Typography>
                    <Typography>6. Inflict a critical injury</Typography>
                  </Box>
                  <Box>
                    <Typography variant="h5">Requires 2:</Typography>
                    <Typography>1. Destroy the target's weapon (if possible)</Typography>
                  </Box>
                </Stack>
                <br />
                <Divider><b>Spending Triumphs in Social Conflict</b></Divider>
                <br />
                <Stack direction={{sm: 'column', md: 'row'}}>
                  <Box width={{sm: '100%', md: '25%'}}>
                    <Typography variant="h5">Requires 1:</Typography>
                    <Typography>1. Anything requiring advantages</Typography>
                    <Typography>2. Add 1 difficulty to target's next check</Typography>
                    <Typography>3. Upgrade an ally's next check</Typography>
                    <Typography>4. Do something vital</Typography>
                    <Typography>5. On initiative, perform a free maneuver</Typography>
                    <Typography>6. Inflict a critical Remark</Typography>
                  </Box>
                </Stack>
              </Box>
              <Box>
                <br />
                <Divider><b>Spending Threat in Combat</b></Divider>
                <br />
                <Stack direction={{sm: 'column', md: 'row'}}>
                  <Box width={{sm: '100%', md: '25%'}}>
                    <Typography variant="h5">Requires 1:</Typography>
                    <Typography>1. Suffer 1 strain</Typography>
                    <Typography>2. Lose the benefits of a previous maneuver</Typography>
                  </Box>
                  <Box width={{sm: '100%', md: '25%'}}>
                    <Typography variant="h5">Requires 2:</Typography>
                    <Typography>1. Target may perform a maneuver free</Typography>
                    <Typography>2. Add a boost dice to the target's next check</Typography>
                    <Typography>3. The active player adds a setback dice to the next check made</Typography>
                  </Box>
                  <Box>
                    <Typography variant="h5">Requires 3:</Typography>
                    <Typography>1. Fall prone</Typography>
                  </Box>
                </Stack>
                <br />
                <Divider><b>Spending Threat in Social Conflict</b></Divider>
                <br />
                <Stack direction={{sm: 'column', md: 'row'}}>
                  <Box width={{sm: '100%', md: '25%'}}>
                    <Typography variant="h5">Requires 1:</Typography>
                    <Typography>1. Suffer 1 strain</Typography>
                  </Box>
                  <Box width={{sm: '100%', md: '25%'}}>
                    <Typography variant="h5">Requires 2:</Typography>
                    <Typography>1. Add a boost dice to the target's next check</Typography>
                    <Typography>2. The active player adds a setback dice to the next check made</Typography>
                    <Typography>3. The active player reveals thier own strength or flaw</Typography>
                  </Box>
                  <Box>
                    <Typography variant="h5">Requires 3:</Typography>
                    <Typography>1. The active player reveals thier own desire or fear</Typography>
                    <Typography>2. The active character reveals thier own true goal</Typography>
                  </Box>
                </Stack>
              </Box>
              <Box>
                <br />
                <Divider><b>Spending Despair in Combat</b></Divider>
                <br />
                <Stack direction={{sm: 'column', md: 'row'}}>
                  <Box width={{sm: '100%', md: '25%'}}>
                    <Typography variant="h5">Requires 1:</Typography>
                    <Typography>1. Anything requiring threats</Typography>
                    <Typography>2. The active player's next check is 1 difficulty higher</Typography>
                    <Typography>3. Damage the active player's weapon. If dual-wielding, damage the first weapon</Typography>
                  </Box>
                </Stack>
                <br />
                <Divider><b>Spending Despair in Social Conflict</b></Divider>
                <br />
                <Stack direction={{sm: 'column', md: 'row'}}>
                  <Box width={{sm: '100%', md: '25%'}}>
                    <Typography variant="h5">Requires 1:</Typography>
                    <Typography>1. Anything requiring threats</Typography>
                    <Typography>2. The active player's next check is 1 difficulty higher</Typography>
                    <Typography>3. The active player becomes distracted and loses thier next turn</Typography>
                    <Typography>4. Learn a false motivation facet of target</Typography>
                  </Box>
                </Stack>
              </Box>
            </Stack>
          </Box>
        )
      case 3:
        return (
          <Box>
            <Typography><b>Staggered:</b> You may not use your action while staggered, including downgrading to a maneuver.</Typography>
            <Typography><b>Immobilized:</b> You may not use any maneuvers, including any that may be part of an extra effect.</Typography>
            <Typography><b>Disoriented:</b> You add one setback dice to all checks while Disoriented.</Typography>
            <Typography><b>Prone:</b> Melee attacks add a boost dice and ranged attacks add a setback dice when targeting a prone target.</Typography>
            <Typography><b>Encumbered:</b> For each point over the encumbrance threshold, that player recieves a setback dice. While encumbered at or above brawn, the player's free maneuver is lost.</Typography>
            <Typography><b>Critical remark:</b> Inflict 5 strain to the target. This can be done in social conflict only.</Typography>
            <Typography><b>Cover:</b> While in cover, you recieve 1 ranged defense and any attempting perception against you adds 1 setback dice.</Typography>
            <Typography><b>Difficult terrain:</b> While traversing difficult terrain, it requires double the maneuvers to move.</Typography>
            <Typography><b>Gravity:</b> Stronger gravity adds 1-3 setback dice to all brawn and coordination checks, excluding resilience. Weaker gravity adds boost dice instead.</Typography>
            <Typography><b>Holding your breath:</b> You can hold your breath for brawn rounds.</Typography>
            <Typography><b>Suffocating:</b> You recieve 3 strain damage each round. If you exceed your strain threshold, you recieve a critical injury every round until you either stop suffocating or die.</Typography>
          </Box>
        )
      case 4:
        return (
          <Stack direction={{sm: 'column', md: 'row'}} gap={3}>
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
        return (
          <Box>
            <Divider>Medicine uses</Divider>
            <Typography>Medicine checks may be used to heal wounds, strain, critical injuries, and exhaustion.</Typography>
            <Typography>Each day, you may attempt a medicine check. This resets at dawn.</Typography>
            <Typography>When healing wounds and strain, each success heals 1 wound and each advantage heals 1 strain. Triumphs heal an additional 3 wounds or strain.</Typography>
            <Typography>When healing a critical injury, a success means its removed and a fail means nothing happens. If you fail to heal a critical injury, it may not be the target of another medicine check for a week.</Typography>
            <Typography>In addition, you may attempt to revitalize someone by removing one level of exhaustion every day. The difficulty is equal to the level being removed. This does <b>not</b> use your daily medicine check.</Typography>
            <br />
            <Divider>Medecine check difficulties</Divider>
            <Typography>At half or lower wounds: 1</Typography>
            <Typography>At more than half wounds: 2</Typography>
            <Typography>Over wound threshold: 3</Typography>
            <Typography>Critical injury: Based on the severity of the injury</Typography>
            <Typography>Without a medkit or some other healing tool, the difficulty is increased by 1.</Typography>
            <Typography>Attempting to heal yourself increases the difficulty by 2.</Typography>
            <br/>
            <Divider>Automatic healing</Divider>
            <Typography>After each combat, a difficulty 0 cool or discipline check may be made. For each success, recover 1 strain.</Typography>
            <Typography>Painkillers heal (5 - times used already). This defecit resets 24 hours after the first painkiller was used.</Typography>
          </Box>
        )
    }
  }

  const DisplayEffectTab = () => {
    switch(effectValue) {
      case 0:
        return (
          <Box padding={1}>
            <Divider>Lighting</Divider>
            <Typography>Light levels range from 0 (pitch darkness) to 10 (blinding light). If it becomes too dark or bright, penalties are incurred.</Typography>
            <Typography>Light sources replace the light level of the area you are in, based on the range of the light.</Typography>
            <Typography>Light levels 0-4 are considered to be dark.</Typography>
            <Typography>Light levels 6-10 are considered to be bright or light.</Typography>
            <Typography>Light level 5 is considered to be neither dark nor bright.</Typography>
            <br />
            <Divider>Concealment</Divider>
            <br />
            <Typography>Concealment may take on the form of tall grass, mist, fog, etc. Concealment makes sight based checks harder. Concealment then makes stealth checks easier.</Typography>
            <Typography>Level 1: A light to medium mist, waist-high grass or foliage, and light levels 2 or 8. Add either 1 setback or 1 boost dice.</Typography>
            <Typography>Level 2: A light to medium fog, shoulder-high grass or foliage, and light level 1 or 9. Add either 2 setback or 2 boost dice.</Typography>
            <Typography>Level 3: A heavy fog, thick smoke, head-high grass or foliage, and light levels 0 or 10. Add either 3 setback or 3 boost dice.</Typography>
          </Box>
        )
      case 1:
        return (
          <Box padding={1}>
            <Divider>Ways to get exhaustion</Divider>
            <Typography>After spending 10 rounds in a heat level of 0 or 10 without gear</Typography>
            <Typography>After recieving a critical injury or a critical remark, you may choose to take a level of exhaustion instead, after the roll.</Typography>
            <Typography>After 24 hours of not sleeping, a difficulty 1 resilience check is made. On a fail, you recieve one level of exhaustion. Every 24 hours after the first increases the difficulty by 1.</Typography>
            <Typography>After 24 hours of not eating, a difficulty 1 resilience check is made. On a fail, you recieve one level of exhaustion. Every 24 hours after the first increases the difficulty by 1.</Typography>
            <Typography>After 24 hours of not drinking, a difficulty 1 resilience check is made. On a fail, you recieve two levels of exhaustion. Every 24 hours after the first increases the difficulty by 1.</Typography>
            <br />
            <Divider>Effects of Exhaustion</Divider>
            <br />
            <Typography>Level 1: Add two setback dice to all physical checks</Typography>
            <Typography>Level 2: Your maxiumum manuevers per turn is reduced to one</Typography>
            <Typography>Level 3: Add one difficulty dice to all physical checks</Typography>
            <Typography>Level 4: Your wound threshold is halved</Typography>
            <Typography>Level 5: You become immobilized</Typography>
            <Typography>Level 6+: Death</Typography>
          </Box>
        )
      case 2:
        return (
          <Box padding={1}>
            <Divider>Fear</Divider>
            <Typography>Fear is used when a character encounters something otherworldly and terrifying.</Typography>
            <Typography>Fear checks use the sanity skill, but have different effects.</Typography>
            <Typography>After a fear check is made, another fear check cannot be made against the same source.</Typography>
            <br />
            <Divider>Fear successes and failures</Divider>
            <br />
            <Typography>Failure with 0-1 threats: You become Disoriented for the rest of the encounter</Typography>
            <Typography>Failure with 2-3 threats: You must spend your next turn running from the source of the fear. This includes downgrading your action</Typography>
            <Typography>Failure with more than 3 threats or a despair: You become immobilized and staggered until the end of your next turn</Typography>
            <br />
            <Typography>Passing with any amount of threats: You add a boost dice to your next check but recieve 3 strain damage</Typography>
            <Typography>Passing with 0-1 advantages: You keep your nerves</Typography>
            <Typography>Passing with 2-3 advantages: All allies forced to make a fear check against the same source recieves a boost dice.</Typography>
            <Typography>Passing with more than 3 advantages or a triumph: All allies forced to make a fear check against the same source automatically passes.</Typography>
            <br />
            <Typography>In extreme failures, such as with 5 threats, 2 despairs, or 3 threats and a despair, you recieve a levels of sanity equal to the difficulty of the fear check.</Typography>
            <Typography>In extreme success, such as with 5 advantages, 2 triumphs, or 3 advantages and a triumph, you may remove a level of sanity.</Typography>
            <br />
            <Divider>Sanity</Divider>
            <br />
            <Typography>Sanity is essentially the guage between sane and insane. You recieve these through failures of fear checks and from attacks, abilities, and environmental effects.</Typography>
            <Typography>For each level of sanity, you gain some kind of negative effect. You recieve the effect of the level you are on and all beneath it.</Typography>
            <br />
            <Divider>Sanity Effects</Divider>
            <br />
            <Typography>Level 1: You recieve a setback dice to all social skills</Typography>
            <Typography>Level 2: Nothing</Typography>
            <Typography>Level 3: You recieve a difficulty dice to all social skills</Typography>
            <Typography>Level 4: Nothing</Typography>
            <Typography>Level 5: You recieve a setback dice to all non-social skills</Typography>
            <Typography>Level 6: Nothing</Typography>
            <Typography>Level 7: You recieve a difficulty dice to all non-social skills</Typography>
            <Typography>Level 8: Whenever you would recieve strain damage, you recieve an additional 1</Typography>
            <Typography>Level 9: Your strain threshold is halved</Typography>
            <Typography>Level 10+: You treat all skills as though they were tier 0</Typography>
          </Box>
        )
      case 3:
        return (
          <Box padding={1}>
            <Divider>Length of rests based on danger</Divider>
            <Typography>Danger level 0: You may rest for any amount of time</Typography>
            <Typography>Danger level 1: You may rest for 24 hours</Typography>
            <Typography>Danger level 2: You may rest for 8 hours</Typography>
            <Typography>Danger level 3: You may rest an hour</Typography>
            <Typography>Danger Level 4-5: You may not rest</Typography>
            <Typography>If you attempt to rest over the time alloted, you will be forced into combat with some kind of threat</Typography>
            <br />
            <Divider>Effects of resting</Divider>
            <br />
            <Typography>For every hour of rest, you heal 1 wound and 2 strain</Typography>
            <Typography>For every 24 hours of rest, you may choose from the list of bonuses (shown below). You may benefit from 2 bonuses at a time.</Typography>
            <Typography>At 8 consecutive hours of rest, you heal an additional 5 wounds, 10 strain, and a level of exhaustion</Typography>
            <Typography>At 24 consecutive hours of rest, you may remove 2 levels of sanity and all levels of exhaustion</Typography>
            <Typography>At 168 consecutive hours (one week) of rest, you heal all wounds, heal all strain, remove all exhaustion, remove all sanity, and make a resilience check against a critical injury. On a success, remove it. For each triumph and/or 5 advantages generated, remove the next lowest severity critical injury.</Typography>
            <br />
            <Divider>Bonuses for resting</Divider>
            <br />
            <Typography>1. Gain 5 temporary wounds. When you would recieve wound damage, instead reduce that damage by up to your temporary wounds. This does not stack.</Typography>
            <Typography>2. Gain 5 temporary strain. When you would recieve strain damage, instead reduce that damage by up to your temporary strain. This does not stack.</Typography>
            <Typography>3. Add 2 boost dice to all checks made for the next 8 hours after you finish resting. This stacks up to 4 boost dice.</Typography>
            <Typography>4. You no longer have to spend strain on a second maneuver for the next 24 hours after you finish resting.</Typography>
            <Typography>5. The next level of sanity, level of exhaustion, or critical injury you would recieve is ignored. This effect disappears after 24 hours after you finish resting.</Typography>
          </Box>
        )
      case 4:
        return (
          <Box padding={1}>
            <Typography>Atmospheres may be toxic or corrosive to breathe in. The harshness is determined by a rating scale.</Typography>
            <Typography>At the beginning of each turn while breathing in the atmosphere, you may make a resilience check with a difficulty equal to half of the rating rounded up.</Typography>
            <Typography>On a success, nothing happens. On a failure, you recieve wound damage equal to the rating and recieve the additional effect.</Typography>
            <Typography>Holding your breath allows you to ignore these detriments.</Typography>
            <Divider>Additional effects of a corrosive atmosphere</Divider>
            <Typography>Rating 1-2: No additional effects</Typography>
            <Typography>Rating 3-4: TBD</Typography>
            <Typography>Rating 5-6: TBD</Typography>
            <Typography>Rating 7-8: TBD</Typography>
            <Typography>Rating 9-10: You recieve a critical injury</Typography>
            <br />
            <Divider>Heat levels</Divider>
            <br />
            <Typography>Heat is also on a scale from 0 (below freezing) to 10 (Extreme heat) that impacts your ability to operate.</Typography>
            <Typography>While the heat level is 0 or 1, you treat all movement as difficult terrain as your body begins to slow down. In addition, all physical checks add 1 difficulty.</Typography>
            <Typography>While the heat level is 9 or 10, each maneuver you perform deals 1 strain damage to you due to pushing yourself in unbearable heat.</Typography>
            <Typography>These effects can be completely mitigated should you have equipment to handle it.</Typography>
          </Box>
        )
      case 5:
        return (
          <Box padding={1}>
            <Typography>Falling from a height hurts not only body but also mind. The damage you recieve is based on the height.</Typography>
            <Typography>Short: 10 wounds and 10 strain</Typography>
            <Typography>Medium: 30 wounds and 20 strain</Typography>
            <Typography>Long: Wounds equal to threshold + 1 and a critical injury with a +50 and 30 strain</Typography>
            <Typography>Extreme: Wounds equal to threshold + 1 and a critical injury with a +75 and 40 strain</Typography>
            <br />
            <Typography>All wound damage is reducable by soak. In addition, a difficulty 2 athletics or coordination check is made</Typography>
            <Typography>For each success, reduce the wounds damage by 1. For each advantage, reduce the strain damage by 1.</Typography>
            <Typography>A triumph equates to 3 wounds or 3 strain and if applicable, results in the range being reduced by 1 band.</Typography>
          </Box>
        )
    }
  }

  return (
    localStorage.getItem("loggedIn") === 'false' ? <NotLoggedIn /> :
      <Box>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>General rules</AccordionSummary>
          <AccordionDetails>
            <Tabs value={generalValue} onChange={handleGeneralChange} variant="scrollable">
              <Tab label='Actions per turn' />
              <Tab label='Maximum character stats' />
              <Tab label='Spending Rolls' />
              <Tab label='Keywords' />
              <Tab label='Combat' />
              <Tab label='Hacking' />
              <Tab label='Healing' />
            </Tabs>
            <DisplayGeneralTab />
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>Custom Character Creation</AccordionSummary>
          <AccordionDetails>
            <Typography maxWidth={{sm: '100%', md: '50%'}}>
              <b>Species/Archetype:</b> You start with a 1 in all characteristics, one level in any one skill, no abilities, a wound threshold of 10 + brawn, a strain threshold of 10 + willpower, and 230 xp to spend.
              You may spend 5 xp to gain a custom ability, up to 2 times. You may take abilities from other Species/Archetypes.
            </Typography>
            <Typography><b>Career:</b> You may choose 8 skills to be your career skills. Out of those 8, choose 4 to add a level in. The skill chosen with your species/archetype may be chosen here.</Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>Custom Skills</AccordionSummary>
          <AccordionDetails>
            <Typography><b>Sanity(Willpower):</b> Used to prevent yourself from going insane.</Typography>
            <Typography><b>Knowledge[General](Intelligence):</b> Used to determine non-specific knowledge on a subject.</Typography>
            <Typography><b>Knowledge[Mechanics](Intelligence):</b> Used to determine how a piece of machinery or technology operates.</Typography>
            <Typography><b>Knowledge[Lore](Intelligence):</b> Used to understand or determine things about how the Backrooms came to be and about the levels and entities.</Typography>
            <Typography><b>Knowledge[Objects](Intelligence):</b> Used to determine how an object works or should be interacted with.</Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>Custom Talents</AccordionSummary>
          <AccordionDetails>
            <Typography><b>Healer:</b> Tier: 1. Activation: Active (Action). Ranked: Yes. You may spend an action to perform a medicine check. This may be done equal to the amount of times this talent has been purchased per day.</Typography>
            <Typography><b>Lightning Striker:</b> Tier: 1. Activation: Passive. Ranked: No. Weapons that use brawl have the reactive equipment trait.</Typography>
            <Typography><b>Bulked Load:</b> Tier: 2. Activation: Passive. Ranked: Yes. Your encumbrance threshold is now one higher.</Typography>
            <Typography><b>Adjust Eyes(Dark):</b> Tier: 3. Activation: Active (Action). Ranked: No. You may ignore all difficulties due to darkness.</Typography>
            <Typography><b>Adjust Eyes(Light):</b> Tier: 3. Activation: Active (Action). Ranked: No. You may ignore all difficulties due to light.</Typography>
            <Typography><b>Unshakable Will:</b> Tier: 5. Activation: Passive. Ranked: No. You recieve 5 points. These points may be spent to reduce one strain damage each. These points replenish at the beginning of your turn.</Typography>
            <Typography><b>Unwavering Resilience:</b> Tier: 5. Activation: Passive. Ranked: No. Requires: Toughened 4. Your wound threshold increases by 10.</Typography>
            <Typography><b>Unbreakable Fortitude:</b> Tier: 5. Activation: Passive. Ranked: No. Requires: Grit 4. Your strain threshold increases by 5.</Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>Custom Equipment Traits</AccordionSummary>
          <AccordionDetails>
            <Typography><b>Auto-hit:</b> The weapon automatically hits the target. The dice pool is always two ability and one proficiency dice.</Typography>
            <Typography><b>Reactive:</b> A weapon with the reactive trait allows and attack to be made as an out-of-turn incidental when an enemy leaves engaged range. This attack may not be dual-wielded.</Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>Environmental and Personal Effects</AccordionSummary>
          <Tabs value={effectValue} onChange={handleEffectChange} variant="scrollable">
            <Tab label='Lighting and concealment' />
            <Tab label='Exhaustion' />
            <Tab label='Fear and Sanity' />
            <Tab label='Resting' />
            <Tab label='Atmospheric hazards' />
            <Tab label='Falling' />
          </Tabs>
          <DisplayEffectTab />
        </Accordion>
      </Box>
  )
}


/*
Boon Elixir comes from massive achievements. TBD what those are.

Crafting talents: Each tier has one and it unlocks the ability to craft tiered items. Also gives a boost in some way (WIP)
*/