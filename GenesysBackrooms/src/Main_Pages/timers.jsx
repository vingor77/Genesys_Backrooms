import { Box, Typography } from "@mui/material";
import NotLoggedIn from "../Components/notLoggedIn";

export default function Timers() {
  //Where players can enter thier timers in-game.
  return (
    localStorage.getItem("loggedIn") === 'false' ? <NotLoggedIn /> :
    <Box>
      <Typography>Timers</Typography>
    </Box>
  )
}