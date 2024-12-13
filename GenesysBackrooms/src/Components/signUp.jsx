import { Box, Button, FormControl, Icon, IconButton, Input, InputAdornment, InputLabel, Link, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { collection, doc, onSnapshot, query, setDoc } from "firebase/firestore";
import db from '../Components/firebase';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

export default function SignUp() {
  const [loginInfo, setLoginInfo] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [failedSignUp, setFailedSignUp] = useState("");

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

  const uploadToDB = () => {
    setDoc(doc(db, 'logins', username), {
      information: [username, password]
    })
  }

  const attemptSignUp = () => {
    setFailedSignUp(false);
    let nameAvailable = true;

    for(let i = 0; i < loginInfo.length; i++) {
      if(loginInfo[i].information[0] === username || username === 'false') {
        setFailedSignUp('That username is already in use.');
        nameAvailable = false;
      }
    }

    if(nameAvailable) {
      setFailedSignUp('Succesfully signed up.');
      localStorage.setItem('loggedIn', username);
      uploadToDB();
    }
  }

  return (
    <Box>
      {loginInfo.length === 0 ? getFromDB() : ""}
      <Stack>
        <Typography>Sign up:</Typography>
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
        {failedSignUp}
        <Button variant="contained" sx={{ m: 1, width: '25ch' }} onClick={attemptSignUp}>Submit</Button>
      </Stack>
    </Box>
  )
}