import { Box, Button, FormControl, IconButton, Input, InputAdornment, InputLabel, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { collection, doc, getDocs, onSnapshot, query, setDoc } from "firebase/firestore";
import db, { auth } from '../Components/firebase';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { createUserWithEmailAndPassword } from "firebase/auth";

export default function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSignUp = async e => {
    e.preventDefault();

    let userTaken = false;

    const querySnapshot = await getDocs(query(collection(db, 'Users')));

    querySnapshot.forEach((doc) => {
      console.log(doc.data().userName.toUpperCase() === name.toUpperCase());
      if(doc.data().userName.toUpperCase() === name.toUpperCase()) userTaken = true;
    })

    let promise = new Promise(function(resolve, reject) {
      if(!userTaken) resolve('Not Taken')
      else reject('That username is taken')
    })

    await promise.then(
      async function(value) {
        try {
          await createUserWithEmailAndPassword(auth, email, password);
          const user = auth.currentUser;
          if(user) {
            await(setDoc(doc(db, 'Users', user.uid), {
              email: user.email,
              userName: name
            }))
          }
          localStorage.setItem('loggedIn', name);
          window.location.assign('/');
          console.log(user);
        } catch (error) {
          console.log(error.message);
        }
      },
      function(error) {console.log(error); alert('That username is taken.')}
    )
  }

  return (
    <Box border='1px solid black' width={{sm: '100%', md: '300px'}}>
      <form onSubmit={handleSignUp}>
        <Stack padding={2} alignItems='center'>
          <Typography>Register</Typography>
          <TextField
            label="Username"
            sx={{ m: 1, width: '25ch' }}
            variant="standard"
            onChange={(event) => setName(event.target.value)}
            required
          />
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
              required
              onChange={(event) => setPassword(event.target.value)}
            />
          </FormControl>
          <Button type="submit" variant="outlined" sx={{width: '75%'}}>Submit</Button>
        </Stack>
      </form>
    </Box>
  )
}