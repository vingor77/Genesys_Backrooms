import { Box, Button, FormControl, Icon, IconButton, Input, InputAdornment, InputLabel, Link, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { collection, onSnapshot, query } from "firebase/firestore";
import db, { auth } from '../Components/firebase';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { signInWithEmailAndPassword } from "firebase/auth";

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      window.location.assign("/");
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <Box border='1px solid black' width={{sm: '100%', md: '300px'}}>
      <form onSubmit={handleSubmit}>
        <Stack padding={2} alignItems='center'>
          <Typography>Sign In</Typography>
          <TextField
            label="Email"
            sx={{ m: 1, width: '25ch' }}
            variant="standard"
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          <FormControl sx={{ m: 1, width: '25ch' }} variant="standard">
            <InputLabel htmlFor="password">Password</InputLabel>
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label={
                      showPassword ? 'hide the password' : 'display the password'
                    }
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </FormControl>
          <Button type="submit" variant="outlined" sx={{width: '75%'}}>Submit</Button>
          <Typography>Don't have an account? <a href="/signUp">Click here.</a></Typography>
        </Stack>
      </form>
    </Box>
  )
}