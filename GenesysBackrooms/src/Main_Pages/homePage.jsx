import { Box } from "@mui/material";

export default function Home() {
  if(!localStorage.getItem('loggedIn')) {
    localStorage.setItem('loggedIn', 'false');
  }

  return (
    <Box>
      <h1>Home</h1>
    </Box>
  )
}