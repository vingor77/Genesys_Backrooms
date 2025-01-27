import { Accordion, AccordionDetails, AccordionSummary, Box, Divider, List, ListItem, ListItemText, Stack, Tab, Tabs, Toolbar, Typography } from "@mui/material";
import NotLoggedIn from "../Components/notLoggedIn";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useState } from "react";

export default function Information() {
  const [generalValue, setGeneralValue] = useState(0);
  const [effectValue, setEffectValue] = useState(0);
  const [lethalValue, setLethalValue] = useState(0);

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
          <Stack direction={{sm: 'column', md: 'row'}} gap={3} maxHeight='750px' overflow='auto'>
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
          <Box maxHeight='750px' overflow='auto'>
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
          <Box maxHeight='750px' overflow='auto'>
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
                    <Typography>7. Damage the target's armor or weapon</Typography>
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
                    <Typography>4. Damage the active player's armor</Typography>
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
          <Box maxHeight='750px' overflow='auto'>
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
            <Typography><b>Grapple:</b> The target must succeed on a contested Brawl check to resist being grabbed. While grappled, you are immobilized. At the end of each of your turns, you may perform another contested Brawl check to escape.</Typography>
            <Typography><b>Blind:</b> You add 3 difficulty to Perception and Vigilance checks and 2 to all other checks.</Typography>
            <Typography><b>Deaf:</b> You add 3 difficulty to Perception checks based on sound.</Typography>
          </Box>
        )
      case 4:
        return (
          <Stack direction={{sm: 'column', md: 'row'}} gap={3} maxHeight='750px' overflow='auto'>
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
              <Divider>Range Lengths</Divider>
              <ListItem disablePadding>
                <ListItemText>Engaged: 0 to 3 feet</ListItemText>
              </ListItem>
              <ListItem disablePadding>
                <ListItemText>Short: 4 to 33 feet</ListItemText>
              </ListItem>
              <ListItem disablePadding>
                <ListItemText>Medium: 34 to 144 feet</ListItemText>
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
              <Divider>Range Lengths</Divider>
              <ListItem disablePadding>
                <ListItemText>Long: 145 to 500 feet</ListItemText>
              </ListItem>
              <ListItem disablePadding>
                <ListItemText>Extreme: 501+ feet</ListItemText>
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
        return (
          <Box maxHeight='750px' overflow='auto'>
            <Typography>To begin the hacking encounter, a terminal or some kind of access point must be present.</Typography>
            <Typography>Hacking encounters share initiatives the same way combat encounters do. This means you can hack while the rest of your team is in combat if needed.</Typography>
            <Divider>Steps to hacking</Divider>
            <Typography><b>Step 1</b></Typography>
            <Typography>The hacker needs to access the terminal and perform an Access System check. The difficulty is based on the type of system being hacked into. The check type is the Computers skill.</Typography>
            <Typography>Unsecured/password known: 0</Typography>
            <Typography>Public terminal, PAD, Personal computer: 1</Typography>
            <Typography>Small business server: 2</Typography>
            <Typography>Government network/corporate server: 3</Typography>
            <Typography>Hacker darknet or military server: 4</Typography>
            <Typography>Megacorp core system, intelligence agency server: 5</Typography>
            <br />
            <Typography><b>Step 2</b></Typography>
            <Typography>After gaining basic access to the system, there may be a need to override a security program. This is done through a difficulty 2 Computers check.</Typography>
            <Typography>In order to success in overriding a program, you must have as many successes as the strength of the program.</Typography>
            <br />
            <Typography><b>Step 3</b></Typography>
            <Typography>Once you have access to the part of a system, you unlock the Enact Command and Activate Programs maneuvers.</Typography>
            <Typography>Enact Command allows you to do something within the system(s) that you have access to.</Typography>
            <Typography>Activate Programs allows you to activate/re-activate some kind of security program.</Typography>
            <br />
            <Divider>Steps to defending a hack</Divider>
            <br />
            <Typography><b>Step 1</b></Typography>
            <Typography>Upon noticing that a system is being hacked, you may immediately perform the Trace User action. This is a contested Computers check. On a success, you are one step closer to tracing the hacker.</Typography>
            <Typography>Normally in a hacking combat, tracing the user helps to pinpoint the physical location. In the Backrooms, it does something a little bit different.</Typography>
            <Typography>First success: You know what level the hacker is on. Decrease the Lockout action difficulty by one.</Typography>
            <Typography>Second success: You know the group or groups the hacker is asocciated with. Decrease the Lockout action difficulty by one.</Typography>
            <Typography>Third success: You know the exact location of the hacker. Decrease the Lockout action difficulty by one.</Typography>
            <Typography>Fourth success: You know the exact access point the hacker is using. Decrease the Lockout action difficulty action by one.</Typography>
            <Typography>Anything more than four successes allows for personal data such as name, age, and other physical features to be determined.</Typography>
            <br />
            <Typography><b>Step 2</b></Typography>
            <Typography>Now that you know about the hacker, you may attempt to boot them from the system entirely. The Lockout action may be taken with a difficulty of 5 - Trace successes.</Typography>
            <Typography>On a successful Lockout, the hacker loses access to the system. Sometimes its permanent while sometimes the hacker can get back in, but the difficulty is increased by 2.</Typography>
            <br />
            <Divider>Security Programs</Divider>
            <br />
            <Typography>Firewall: Program strength: 3. Failure effect: None.</Typography>
            <Typography>Sentry: Program strength: 2. Failure effect: The sysops (defender) is immediately notified and gives one automatic Trace success.</Typography>
            <Typography>Gate: Program strength: 2. Failure effect: You lose access to the system.</Typography>
            <Typography>Gate (Pop-up): Program strength: 1. Failure effect: You take 2 strain and should honestly think about your life choices.</Typography>
            <br />
            <Divider>Spending rolls</Divider>
            <br />
            <Typography><b>One advantage</b></Typography>
            <Typography>1. Add a boost dice to your next computers check.</Typography>
            <Typography>2. If a security program was successfully overridden, it cannot be reactivated for an extra round. (Hacker Only)</Typography>
            <br />
            <Typography><b>Two advantages</b></Typography>
            <Typography>1. You may immediately perform an additional Enact Command maneuver as an incidental.</Typography>
            <Typography>2. You may add a setback dice to the next Trace command. (Hacker Only)</Typography>
            <Typography>3. You may modify a program to add a setback dice to all Override Security Program actions. (Defender Only)</Typography>
            <br />
            <Typography><b>Three advantages</b></Typography>
            <Typography>1. You may make the opponent take 3 strain damage.</Typography>
            <Typography>2. You may make a backdoor access, causing all Access System checks to be of difficulty 1. (Hacker Only)</Typography>
            <Typography>3. You may automatically succeed on the Trace action, in addition to the effect of the roll. (Defender Only)</Typography>
            <br />
            <Typography><b>A triumph</b></Typography>
            <Typography>1. If you succeeded on an Override Security Program, the program may be permanently disabled. (Hacker Only)</Typography>
            <Typography>2. You may cancel a successful Trace action. (Hacker Only)</Typography>
            <Typography>3. You may give a system an immediate backup firewall of strength 3, protecting the chosen server. (Defender Only)</Typography>
            <Typography>4. You may remove a backdoor access if there is one. (Defender Only)</Typography>
            <br />
            <Typography><b>One threat</b></Typography>
            <Typography>1. You recieve a setback dice to your next Computers check.</Typography>
            <Typography>2. You recieve two setback dice to any non-Computers check on your next turn.</Typography>
            <br />
            <Typography><b>Two threats</b></Typography>
            <Typography>1. You may perform either one action or one maneuver on your next turn. (Hacker Only)</Typography>
            <Typography>2. You gain a 2nd success the next time you successfully use the Trace action. (Defender Only)</Typography>
            <Typography>3. Reduce the strength of a system to a minimum of 1. (Defender Only)</Typography>
            <br />
            <Typography><b>Three threats</b></Typography>
            <Typography>1. All users with access to the system know you are hacking. (Hacker Only)</Typography>
            <Typography>2. You accidentally create a backdoor for the hacker, causing all Access System actions to be of difficulty 1. (Defender Only)</Typography>
            <br />
            <Typography><b>A Despair</b></Typography>
            <Typography>1. You allow the defender to automatically succeed on a Trace action. (Hacker Only)</Typography>
            <Typography>2. You get the wrong person. This does not remove any Traces but does remove any real-world retaliation. (Defender Only)</Typography>
          </Box>
        )
      case 6:
        return (
          <Box maxHeight='750px' overflow='auto'>
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
      case 7:
        return (
          <Box maxHeight='750px' overflow='auto'>
            <Divider>The passage of time</Divider>
            <Typography>Time passes on a room to room basis with a minimum but no maximum.</Typography>
            <Typography>Each room is considered to be 1 minute of time passing while traversing through and small or medium sized room.</Typography>
            <Typography>A large sized room is 2 minutes of time. These are the basis for time.</Typography>
            <Typography>Time passing is modified by two things: time dilation and actions.</Typography>
            <Typography>For each action performed within a room, 1 minute is added to the time spent there.</Typography>
            <Typography>The time dilation is based upon the level or area you reside in and could range from going twice as fast to twice as slow.</Typography>
            <Typography>For every round in combat, 1 minute passes regardless.</Typography>
            <br />
            <Typography><b>For example:</b></Typography>
            <Typography>A small room takes 1 minute. You find an object and examine it. This adds 1 minute. You also decide to search the room for secrets. This adds another minute.</Typography>
            <Typography>This leaves you at 3 minutes of time taken, or 2 if that search check was done by a different player at the same time. Finally, the time dilation of the level is 1.5x</Typography>
            <Typography>This all comes together to say you took either 3 minutes or 4.5 minutes if the search was done at the same time. Any decimals round normally. This translates to 3 or 5 minutes.</Typography>
            <br />
            <Divider>Sanity in regards to time</Divider>
            <br />
            <Typography>You must perform a sanity check once every 4 hours while within a level that has a difficulty level of 1 or higher.</Typography>
            <Typography>This time is augmented based on the level you currently reside on. Your basic timer is as follows</Typography>
            <Typography>Survival Difficulty 1: 4 hours</Typography>
            <Typography>Survival Difficulty 2: 2 hours</Typography>
            <Typography>Survival Difficulty 3: 1 hour</Typography>
            <Typography>Survival Difficulty 4: 30 minutes</Typography>
            <Typography>Survival Difficulty 5: 15 minutes</Typography>
          </Box>
        )
      case 8:
        return (
          <Box maxHeight='750px' overflow='auto'>
            <Divider>Weapon Durability</Divider>
            <Typography>At maximum durability there are no effects.</Typography>
            <Typography>Losing 1 durability gives a setback dice to all checks made using the weapon.</Typography>
            <Typography>Losing 2 durability increases the difficulty by 1 when using the weapon.</Typography>
            <Typography>Losing 3 durability upgrades a difficulty dice when using the weapon.</Typography>
            <Typography>Losing 4 durability causes the weapon to be unwieldy and you treat the skill used for this weapon as though it were tier 0 when using the weapon.</Typography>
            <Typography>Losing 5 durability causes the weapon to break and it loses all effects and bonuses.</Typography>
            <Typography>All weapons replace thier durability effect with breaking if it hits 0.</Typography>
            <br />
            <Divider>Armor Durability</Divider>
            <br />
            <Typography>At maximum durability there are no effects.</Typography>
            <Typography>Losing 1 durability: Add a setback dice to all Brawn and Agility based checks while worn</Typography>
            <Typography>Losing 2 durability: Lose 1 defense and 1 soak</Typography>
            <Typography>Losing 3 durability: Increase the difficulty of all Brawn and Agility based checks while worn</Typography>
            <Typography>Losing 4 durability: Upgrade a difficulty dice to all Brawn and Agility based checks while worn</Typography>
            <Typography>Losing 5 durability: The armor breaks and loses all effects</Typography>
            <Typography>All armor replace thier durability effect with breaking if it hits 0.</Typography>
            <br />
            <Divider>Repairing</Divider>
            <br />
            <Typography>You must succeed on a Metalworking, Leatherworking, or Crafting[General] check of difficulty equal to the durability lost in order to repair the gear.</Typography>
            <Typography>The difficulty is increased by 1 if you do not have tools.</Typography>
            <Typography>The difficulty is increased by 1 if you attempt to fix it in half the time.</Typography>
            <Typography>Repairing takes 1 hour per difficulty to fix as a standard rate.</Typography>
            <Typography>It costs 20% of the original item's value per difficulty to fix. For each advantage during the roll, reduce this price by 10%. Round the price down.</Typography>
          </Box>
        )
      case 9:
        return (
          <Box maxHeight='750px' overflow='auto'>
            <Divider>The Wretched Cycle</Divider>
            <Typography>The Wretched cycle is a potentially terminal disease that originates from Wretches. It causes you to lose your humanity and slowly transforms you into a Wretch yourself. Any time you would recieve a Wretched cycle stage while already at stage 3, add 1 difficulty to the next check made to resist turning into a Wretch.</Typography>
            <br />
            <Typography>Stage 1: You begin to itch and develop a rash similar to when touching poison ivy. Also, the disease will attempt to alter your mental state. Immediately roll a difficulty 4 sanity check. On a fail, you recieve a permanent level of sanity until cleansed of this disease.</Typography>
            <Typography>Stage 2: You lose your ability to speak clearly and you begin to lose your strength. While on Stage 2, you add 2 setback dice to all social checks and you treat your brawn and agility characteristics as though they were 1 lower.</Typography>
            <Typography>Stage 3: The final stage. You decay to a point where you can no longer speak, rest, eat or drink on your own. You ooze brown sludge from all orifices that burn anybody it touches for 5 damage. Immediately when reaching this stage and every 24 hours afterwards, you must succeed on a difficulty 1 + previous successes resilience check or fully transform into a Wretch.</Typography>
            <br />
            <Divider>The Disease</Divider>
            <br />
            <Typography>The Disease is the hardest to treat disease within the Backrooms. It creates blood clots within your body, causing necrosis in limbs and hemorrhaging. The Disease spreads through breathing in contaminated air or contact with contaminated blood. There are 4 stages of The Disease.</Typography>
            <br />
            <Typography>Stage 1: Symptoms are non-existant at this stage.</Typography>
            <Typography>Stage 2: One of your limbs slows down as the blood vessels become more restricted from blood clots. While at this stage or above, you have a critical injury with a rating of 96.</Typography>
            <Typography>Stage 3: Your blood vessels are now compromised to a severe degree and you begin to bleed from your orifices. You lose your free maneuver per turn, may only take either an action or maneuver per turn, and you gain 1 (unsoakable) wound per action taken.</Typography>
            <Typography>Stage 4+: Your body can no longer keep up and you lose access to your limbs. Upon reaching this stage, one of your limbs becomes necrotic and you cannot use it. For each stage gained passed 4, another limb becomes necrotic. If all 4 major limbs (arms and legs) are necrotic and you would gain another level of this disease, you die.</Typography>
          </Box>
        )
    }
  }

  const DisplayEffectTab = () => {
    switch(effectValue) {
      case 0:
        return (
          <Box padding={1} maxHeight='750px' overflow='auto'>
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
          <Box padding={1} maxHeight='750px' overflow='auto'>
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
          <Box padding={1} maxHeight='750px' overflow='auto'>
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
          <Box padding={1} maxHeight='750px' overflow='auto'>
            <Divider>Length of rests</Divider>
            <Typography>You are alloted a certain amount of hours to rest while on the level based off the danger level.</Typography>
            <Typography>Danger level 0: You may rest for any amount of time</Typography>
            <Typography>Danger level 1: You may rest for 72 hours</Typography>
            <Typography>Danger level 2: You may rest for 24 hours</Typography>
            <Typography>Danger level 3: You may rest for 3 hours</Typography>
            <Typography>Danger Level 4-5: You may not rest</Typography>
            <Typography>If you attempt to rest over the time alloted, there is a high chance a threat will appear.</Typography>
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
          <Box padding={1} maxHeight='750px' overflow='auto'>
            <Typography>Atmospheres may be toxic or corrosive to breathe in. The harshness is determined by a rating scale.</Typography>
            <Typography>At the beginning of each turn while breathing in the atmosphere, you may make a resilience check with a difficulty equal to half of the rating rounded up.</Typography>
            <Typography>On a success, nothing happens. On a failure, you recieve wound damage equal to the rating and recieve the additional effect.</Typography>
            <Typography>Holding your breath allows you to ignore these detriments.</Typography>
            <Divider>Additional effects of a corrosive atmosphere</Divider>
            <Typography>Rating 1-2: No additional effects</Typography>
            <Typography>Rating 3-4: Recieve 1 strain damage</Typography>
            <Typography>Rating 5-6: Recieve 3 strain damage</Typography>
            <Typography>Rating 7-8: Recieve 5 strain damage</Typography>
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
          <Box padding={1} maxHeight='750px' overflow='auto'>
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

  const DisplayLethalTab = () => {
    switch(lethalValue) {
      case 0:
        return (
          <Box maxHeight='750px' overflow='auto'>
            <Typography>1. You may use your scanner as an incidental on your turn</Typography>
            <Typography>2. Previously explored rooms are traversed at double the speed</Typography>
            <Typography>3. Should you die, you may remove 1 critical injury at random. Sometimes the injury is chosen if it makes sense</Typography>
            <Typography>4. All rooms except for the factory, locker, and Storage rooms are considered medium distance from door to door. These are considered long.</Typography>
            <Typography>5. You no longer recieve 20 xp per session. Instead, you recieve 10 xp per day completed.</Typography>
          </Box>
        )
      case 1:
        return (
          <Box maxHeight='750px' overflow='auto'>
            <Typography>Your Encumbrance is 20 times your brawn plus 10</Typography>
            <Typography>For every 20 weight over, recieve 1 setback dice to all agility and brawn based checks</Typography>
            <Typography>While encumbered past your threshold plus 20 times your brawn, you lose your free maneuver per turn.</Typography>
            <Typography>While holding a 2-handed object, your action may be spent on a maneuver only.</Typography>
          </Box>
        )
      case 2:
        return (
          <Box maxHeight='750px' overflow='auto'>
            <Typography><b>Clear:</b> No Effect</Typography>
            <Typography><b>Rainy:</b> Every turn, there is a 1/6 chance you walk into a puddle. A difficulty 2 athletics or coordination check is then made. On a fail, you sink further in and must repeat the save again at 1 higher difficulty. After 3 fails, you die</Typography>
            <Typography><b>Stormy:</b> Every turn, there is a x/4 chance of lightning striking you where x is the amount of conductive items in your inventory. The difficulty is set at 1 + x</Typography>
            <Typography><b>Foggy:</b> Every turn, the fog shifts in or out and makes seeing harder or easier. The difficulty is based on the fog level</Typography>
            <Typography><b>Flooded:</b> The planet slowly floods. This value is kept hidden.</Typography>
            <Typography><b>Eclipsed:</b> An extra, unknown, amount of entities begin spawned within the facility. Also, night entities begin spawning immediately.</Typography>
          </Box>
        )
      case 3:
        return (
          <Box maxHeight='750px' overflow='auto'>
            <Typography>The ship door may be opened or closed, but it can only remain closed for so long.</Typography>
            <Typography>While the door is open, the atmosphere may enter into the ship. After the door is closed, it takes 1 extra round for it to be filtered out.</Typography>
            <Typography>Once the ship door is closed, it spends 1 power per round. The door has 6 power.</Typography>
            <Typography>While the door is open, each round it regains 2 power.</Typography>
            <br />
            <Divider>Actions</Divider>
            <Typography><b>Scan Room:</b> You may view a room adjacent to a player, whether it has a direct entrance or not. Movement will not be observed using this method.</Typography>
            <Typography><b>Seek Entity:</b> You may determine if an Entity is within two rooms of a player. This does not work diagonally.</Typography>
            <Typography><b>Activate Teleporter:</b> You may use either teleporter. This may be used as an out-of-turn incidental.</Typography>
            <Typography><b>Access system:</b> You may make an Access Systems check to gain access to a trap within the facility. The difficulty varies based on the trap. This uses the Computers skill and initiates a hacking encounter.</Typography>
            <Typography><b>Override Security Program:</b> You may make a difficulty 2 Computers check to override a security program within the system after succeeding on an Access System action. You must get at least as many successes as the program's strength to succeed. Failure may result in some negative effect.</Typography>
            <br />
            <Divider>Maneuvers</Divider>
            <Typography><b>Toggle Trap [NOT USED. ARCHIVE.]</b> You may activate or deactivate any trap within the facility. A maximum of 3 may be activated at once. One must be re-enabled before disabling a 4th.</Typography>
            <Typography><b>Send Message:</b> You may send a message no more than 10 characters long to all players.</Typography>
            <Typography><b>Planetary Scan:</b> You may scan the outdoors as though it were a normal scanner.</Typography>
            <Typography><b>Enact Command:</b> While you have access to a system, you may cause the system to do a command, so long as you have access to that part of the system.</Typography>
            <Typography><b>Activate Programs:</b> You may activate some kind of security program. As a hacker, this can be done to introduce an unknown roadblock for the defender.</Typography>
            <br />
            <Divider>Incidentals</Divider>
            <Typography><b>Check Time:</b> You may move outside to check the time. If crouching, this will take two Incidentals.</Typography>
            <Typography><b>Use Walkie-Talkie:</b> Out-of-turn, you may use the Walkie Talkie to assist a player in a non-physical skill check. The difficulty of the check is reduced by 1 and both you and the player make the check. If either one passes, the check is considered passed.</Typography>
            <Typography><b>Operate Ship Door:</b> You may open or close the ship door.</Typography>
          </Box>
        )
      case 4:
        return (
          <Box maxHeight='750px' overflow='auto'>
            <Divider>Alterations</Divider>
            <Typography>You may carry a single one-handed item with a weight less than or equal to 30. If you have Bulked Load, you may carry a two-handed item and the weight maximum becomes 40.</Typography>
            <Typography>You may use either an Action or a Maneuver each turn, instead of both. Strain may not be used to perform an extra Maneuver.</Typography>
            <Typography>You may not speak or use any items such as Walkie-Talkies and Flashlights.</Typography>
            <Typography>You can not be seen or heard by players who are alive, but can see any items you are carrying.</Typography>
            <br />
            <Divider>Actions</Divider>
            <Typography><b>Possess:</b> You may attempt to possess an entity by rolling a Coercion check. The difficulty is based on the health of the entity. With no wounds, the difficulty is 5. At half or lower, the difficulty is 4. At over half, the difficulty is 3. While you are possessing an entity, you may use its free maneuver each turn. Also, the entity may not spend strain on a maneuver</Typography>
            <Typography><b>Assist:</b> You may prepare to assist a player with a physical skill check. The difficulty is reduced by 1 for that player. You may also make this skill check but at 1 difficulty higher instead of 1 lower. If either succeeds, the check is considered passed.</Typography>
            <br />
            <Divider>Incidentals</Divider>
            <Typography><b>Flicker:</b> Out-of-turn you may cause a flashlight to flicker to alert a player of danger. The player gains two boost dice to the next check that player makes.</Typography>
          </Box>
        )
      case 5:
        return (
          <Box maxHeight='750px' overflow='auto'>
            <Typography>Flashlights have a power of 4 and last for 13 rounds</Typography>
            <Typography>Pro-Flashlights have a power of 7 and last for 28 rounds</Typography>
            <Typography>Flashlights lose power if on at the beginning of your turn. You may spend a maneuver to turn it off before the power is lost</Typography>
          </Box>
        )
      case 6:
        return (
          <Box maxHeight='750px' overflow='auto'>
            <Divider>Items</Divider>
            <Typography><b>Painkillers:</b> Costs 200 credits to buy. Weight 5. Has 5 uses. </Typography>
            <Typography><b>Medkits:</b> Costs 50 credits to buy. Weight 12. Has 5 uses.</Typography>
            <Typography><b>20 Experience Points:</b> Costs 1000 credits to buy.</Typography>
            <Typography><b>Flare:</b> Costs 110 credits to buy. Weight 3. Has 1 use. It may be used to prevent all navigation checks on the current planet to be higher than two difficulty.</Typography>
            <Typography><b>Signal Upgrader:</b> Costs 400 credits to buy. Upgrades the Signal Translator to allow for 30 characters instead of 10 and the message is sent instantly.</Typography>
            <Typography><b>Teleporter Upgrade:</b> Costs 1400 credits to buy. Upgrades the teleporter to become instant and items are not dropped upon teleport.</Typography>
            <Typography><b>Brass Knuckles:</b> Costs 150 credits to buy.</Typography>
            <Typography><b>Shotgun Shell:</b> Costs 25 credits to buy. Weight 0. May stack 2 per inventory slot.</Typography>
            <Typography><b>Revolver Bullet:</b> Costs 15 credits to buy. Weight 0. May stack 6 per inventory slot.</Typography>
            <Typography><b>Assault Rifle Clip (30):</b> Costs 300 credits to buy. Weight 5.</Typography>
            <br />
            <Divider>Talents</Divider>
            <Typography><b>Stronger Scanner:</b> Tier: 1. Activation: Passive. Add a boost dice to scans.</Typography>
            <Typography><b>Stronger Scanner II:</b> Tier: 2. Activation: Passive. Requirement: Stronger Scanner. Upgrade one ability dice for scans. If no ability dice can be upgraded, add one to the dice pool.</Typography>
            <Typography><b>Stronger Scanner III:</b> Tier: 3. Activation: Passive. Requirement: Stronger Scanner II. All obstacles are now ignored by the scanner. All adjacent rooms with an open door are scanned as well.</Typography>
            <Typography><b>Bulked-Load:</b> Tier: 2. Activation: Passive. Requirement: 4 or higher Brawn. You may carry an extra 2-handed item.</Typography>
            <Typography><b>Expanded Inventory:</b> Tier: 5. Activation: Passive. Ranked: Yes. You may now carry an additional item in your inventory. You may not exceed 8 slots.</Typography>
          </Box>
        )
      case 7:
        return (
          <Box maxHeight='750px' overflow='auto'>
            <Typography>When buying a suit, you recieve a singular suit rather than for the entire group.</Typography>
            <Typography>Suits may be swapped between while in orbit at will.</Typography>
            <Typography>Suits that have a choice of effect may be swapped while in orbit at will.</Typography>
            <br />
            <Divider>Suit Effects</Divider>
            <br />
            <Typography><b>Decoy:</b> Soak: 1. Defense: 0.</Typography>
            <Typography><b>Brown:</b> Soak: 0. Defense: 1.</Typography>
            <Typography><b>Green:</b> Soak: 2. Defense: 0. You add two boost dice to all stealth checks.</Typography>
            <Typography><b>Purple:</b> Soak: 0. Defense: 2.</Typography>
            <Typography><b>Hazard:</b> Soak: 3. Defense: 0. You add two setback dice to all stealth checks.</Typography>
            <Typography><b>Bee:</b> Soak: 1. Defense: 0. You do not take any damage from bees. You add two boost dice to attacks made against the Bunker Spider, Hoarding Bug, Snare Flea, and Spore Lizard.</Typography>
            <Typography><b>Bunny:</b></Typography>
            <Typography>Option 1: Soak: 1. Defense: 2.</Typography>
            <Typography>Option 2: Soak: 0. Defense: 0. You gain an extra free maneuver per turn. You may now take 3 maneuvers per turn.</Typography>
            <Typography><b>Pajama:</b></Typography>
            <Typography>Option 1: Soak: 0. Defense: 0. You gain an extra action per turn and you may ignore the strain costs spent on maneuvers 3 times per day.</Typography>
            <Typography>Option 2: Soak: 0. Defense: 3.</Typography>
            <Typography>Option 3: Soak: 2. Defense: 2.</Typography>
          </Box>
        )
      case 8:
        return (
          <Box maxHeight='750px' overflow='auto'>
            <Typography>Some additional rules, taken from the above rules and altered slightly, are as follows:</Typography>
            <Typography>1. Hacking system is added to the ship actions.</Typography>
            <Typography>2. Sanity is added. Every 8 rounds, or 2 hours, a sanity roll is made.</Typography>
            <Typography>3. Fear is added. Each entity will have a fear rating and will be enacted on when encountering the entity.</Typography>
            <Typography>4. Exhaustion, specifically the portion about healing it and gaining a level in exchange for a critical injury.</Typography>
            <Typography>5. Durability for weapons and armor. The weapon durability effects are described in "General Rules" under "Durability and Repairs".</Typography>
            <br />
            <Divider>System structures</Divider>
            <Typography>Normally, the structure is kept hidden but due to this being testing material, the structure is shown for all.</Typography>
            <br />
            <Typography>A door trap has a difficulty of 1 to access the system. The door has no security programs.</Typography>
            <Typography>A landmine trap has a difficulty of 2 to access the system. The landmine has a Firewall defending shutdown.</Typography>
            <Typography>A spike trap has a difficulty of 4 to access the system. The spike trap has a Firewall defending shutdown and a Sentry defending sensors. Shutdown is only accessible when Sensors has been overridden.</Typography>
            <Typography>A turret has a difficulty of 4 to access the system. The turret has a Firewall defending shutdown, a Sentry defending sensors, and a Gate defending the firing section. Shutdown is only accessible when Sensors and Firing has been overridden.</Typography>
            <br />
            <Divider>Armor Durability</Divider>
            <br />
            <Typography>Suits may be broken down through enemy triumphs or own despairs. Suits have a durability of 3.</Typography>
            <Typography>The effects are as follows:</Typography>
            <Typography>3: No effects</Typography>
            <Typography>2: Your suit cracks or rips slightly. This allows the potentially toxic atmosphere to get into your suit. It however is not broken enough to cause loss of breath</Typography>
            <Typography>1: Your suit is too broken to absorb damage. Your suit loses its soak.</Typography>
            <Typography>0: The suit is unusable. Your suit loses its defense and you become unable to breathe while outside or in a room with outside atmosphere in it</Typography>
          </Box>
        )
      case 9:
        return (
          <Box maxHeight='750px' overflow='auto'>
            <Typography><b>Shotgun:</b> Ranged; Damage 10; Critical 3; Range [Short]</Typography>
            <Typography><b>Shovel:</b> Melee; Damage +4; Critical 3; Range [Engaged]; Cumbersome 3; Pierce 2; Vicious 1. Weight is 16.</Typography>
            <Typography><b>Sign:</b> Melee; Damage +4; Critical 2; Range [Engaged]; Defensive 1; Pierce 1; Unwieldy 3. Weight is 14.</Typography>
            <Typography><b>Brass Knuckles:</b> Brawl; Damage +1; Critical 4; Range [Engaged]; Disorient 3. Weight is 4.</Typography>
            <Typography><b>Revolver:</b> Ranged; Damage 6; Critical 4; Range [Medium]; Accurate 1. Weight is 8.</Typography>
            <Typography><b>Assault Rifle</b> Ranged; Damage 8; Critical 3; Range [Long]; Auto-fire. Weight is 24.</Typography>
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
              <Tab label='Time' />
              <Tab label='Durability and Repairs' />
              <Tab label='Diseases' />
            </Tabs>
            <DisplayGeneralTab />
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>Character Creation and Experience Points</AccordionSummary>
          <AccordionDetails>
            <Typography><b>Custom Species/Archetype</b></Typography>
            <Typography>1. All of your characteristics begin at 1.</Typography>
            <Typography>2. You gain a level in any skill of your choosing.</Typography>
            <Typography>3. Your wound threshold is between 8 and 12 plus your brawn. <b>Example: 9 Wounds chosen, 4 Brawn = 13 wounds.</b></Typography>
            <Typography>4. Your strain threshold is 20 - (chosen wounds) plus your willpower. <b>Example: 20 - 9 = 11, 3 Willpower = 14 strain.</b></Typography>
            <Typography>5. You have 230 xp to spend. Two abilities may be chosen or made. The cost of the abilities are determined by the strength of it.</Typography>
            <Typography>6. Additionally, you gain 50 xp to spend on non-characteristics to start.</Typography>
            <br />
            <Typography><b>Custom Career</b> You may choose 8 skills to be your career skills. Out of those 8, choose 4 to add a level in. The skill chosen with your species/archetype may be chosen here.</Typography>
            <Typography>1. Choose 8 skills to be a part of your career.</Typography>
            <Typography>2. Choose 4 out of the 8 to gain a level in.</Typography>
            <br />
            <Typography><b>Experience per session</b></Typography>
            <Typography>1. You gain 5 xp as a baseline.</Typography>
            <Typography>2. For every social, combat, or hacking encounter you succeed in, you gain 1 xp to a maximum of 5.</Typography>
            <Typography>3. Special events and achievements may award more.</Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>Skills</AccordionSummary>
          <AccordionDetails>
            <Typography>Tier 6 skills can only be acquired by having the skill at tier 5 and having a skill upgrade point. These points are awarded for quests and achievements.</Typography>
            <Typography>The Alchemy skill has been removed from the game.</Typography>
            <br />
            <Divider>Custom Skills</Divider>
            <br />
            <Typography><b>Sanity(Willpower):</b> Used to prevent yourself from going insane.</Typography>
            <Typography><b>Knowledge[General](Intellect):</b> Used to determine non-specific knowledge on a subject.</Typography>
            <Typography><b>Knowledge[Mechanics](Intellect):</b> Used to determine how a piece of machinery or technology operates.</Typography>
            <Typography><b>Knowledge[Lore](Intellect):</b> Used to understand or determine things about how the Backrooms came to be and about the levels and entities.</Typography>
            <Typography><b>Knowledge[Objects](Intellect):</b> Used to determine how an object works or should be interacted with.</Typography>
            <Typography><b>Metalworking(Brawn):</b> Used to craft things using the Armorer, Blacksmith, or Goldsmith tools.</Typography>
            <Typography><b>Leatherworking(Agility):</b> Used to craft things using the Leatherworker and Weaver tools.</Typography>
            <Typography><b>Crafting[General](Intellect):</b> Used to craft things using the Alchemist, Carpenter, and Culinarian tools.</Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>Talents</AccordionSummary>
          <AccordionDetails>
            <Divider>Custom Talents</Divider>
            <Typography><b>Healer:</b> Tier: 1. Activation: Active (Action). Ranked: Yes. You may spend an action to perform a medicine check. This may be done equal to the amount of times this talent has been purchased per day.</Typography>
            <Typography><b>Lightning Striker:</b> Tier: 1. Activation: Passive. Ranked: No. Weapons that use brawl have the reactive equipment trait.</Typography>
            <Typography><b>Bulked Load:</b> Tier: 2. Activation: Passive. Ranked: Yes. Your encumbrance threshold is now one higher.</Typography>
            <Typography><b>Adjust Eyes(Dark):</b> Tier: 3. Activation: Active (Action). Ranked: No. You may ignore all difficulties due to darkness for the next 5 rounds.</Typography>
            <Typography><b>Adjust Eyes(Light):</b> Tier: 3. Activation: Active (Action). Ranked: No. You may ignore all difficulties due to light for the next 5 rounds.</Typography>
            <Typography><b>Savage Attacker:</b>Tier: 4. Activation: Active (Incidental). Ranked: No. When you inflict a critical injury, you may spend 2 strain and an incidental to activate this talent. You may select the critical injury inflicted that is within the same severity as the one rolled.</Typography>
            <Typography><b>Unshakable Will:</b> Tier: 5. Activation: Passive. Ranked: No. You recieve 5 points. These points may be spent to reduce one strain damage each. These points replenish at the beginning of your turn.</Typography>
            <Typography><b>Unwavering Resilience:</b> Tier: 5. Activation: Passive. Ranked: No. Requires: Toughened 4. Your wound threshold increases by 10.</Typography>
            <Typography><b>Unbreakable Fortitude:</b> Tier: 5. Activation: Passive. Ranked: No. Requires: Grit 4. Your strain threshold increases by 5.</Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>Equipment Traits</AccordionSummary>
          <AccordionDetails>
            <Divider>Custom Equipment Traits</Divider>
            <Typography><b>AutoHit:</b> The weapon automatically hits the target. The dice pool is always two ability and one proficiency dice.</Typography>
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
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>Lethal Company Rules</AccordionSummary>
          <AccordionDetails>
            <Tabs value={lethalValue} onChange={(e, val) => setLethalValue(val)} variant="scrollable">
              <Tab label='General Rulings' />
              <Tab label='Weight and Objects' />
              <Tab label='Weather' />
              <Tab label='Ship' />
              <Tab label='Death' />
              <Tab label='Lighting' />
              <Tab label='Homebrew' />
              <Tab label='Suit Effects' />
              <Tab label='Additional Rules' />
              <Tab label='Weapon Statistics' />
            </Tabs>
            <DisplayLethalTab />
          </AccordionDetails>
        </Accordion>
      </Box>
  )
}


/*
Boon Elixir comes from massive achievements. TBD what those are.

Crafting talents: Each tier has one and it unlocks the ability to craft tiered items. Also gives a boost in some way (WIP)
*/