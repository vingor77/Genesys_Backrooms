import { Box, Button, FormControl, Icon, IconButton, Input, InputAdornment, InputLabel, Link, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { collection, onSnapshot, query } from "firebase/firestore";
import db from '../Components/firebase';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

export default function Login() {
  const [loginInfo, setLoginInfo] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [failedLogin, setFailedLogin] = useState('');

  const getFromDB = () => {
    const q = query(collection(db, 'logins'));

    const unsub = onSnapshot(q, (querySnapshot) => {
      const queryData = [];
      querySnapshot.forEach((doc) => {
        queryData.push(doc.data());
      })
      setLoginInfo(queryData);
    })

    return () => {
      unsub();
    }
  }

  const attemptLogin = () => {
    if(loginInfo.length === 0) setFailedLogin('Username or password is incorrect.');

    for(let i = 0; i < loginInfo.length; i++) {
      if(loginInfo[i].information[0] === username && loginInfo[i].information[1] === password) {
        localStorage.setItem('loggedIn', username);
        setFailedLogin('Successfully logged in.');
        break;
      }
      else {
        setFailedLogin('Username or password is incorrect.');
      }
    }
  }

  return (
    <Box>
      {loginInfo.length === 0 ? getFromDB() : ""}
      <Stack>
        <Typography>Log in:</Typography>
        <TextField
          label="Username"
          sx={{ m: 1, width: '25ch' }}
          variant="standard"
          onChange={(event) => setUsername(event.target.value)}
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
          />
        </FormControl>
        <Typography>{failedLogin}</Typography>
        <Button variant="contained" sx={{ m: 1, width: '25ch' }} onClick={attemptLogin}>Submit</Button>
        <Typography>Don't have an account? <Link href='/signUp' underline="hover">Click here.</Link></Typography>
      </Stack>
    </Box>
  )
}