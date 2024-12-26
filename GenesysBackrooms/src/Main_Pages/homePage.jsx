import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import db, { auth } from '../Components/firebase';
import { doc, getDoc } from "firebase/firestore";
import Login from "../Components/login";

export default function Home() {
  const [userDetails, setUserDetails] = useState(null);
  const fetchUserData = async () => {
    auth.onAuthStateChanged(async(user) => {
      console.log(user);
      const docRef = doc(db, 'Users', user.uid);
      const docSnap = await getDoc(docRef);
      if(docSnap.exists()) {
        setUserDetails(docSnap.data());
        localStorage.setItem('loggedIn', docSnap.data().userName);
      }
      else {
        console.log('User not logged in.');
      }
    })
  }
  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <Box>
      {userDetails ? 
        <Box>
          <Typography>Logged in</Typography>
        </Box>
      :
        <Login />
      }
    </Box>
  )
}