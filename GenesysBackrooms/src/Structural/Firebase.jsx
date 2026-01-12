import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBiWlt7kScqmYQgvpe4CnDHnT67DJOXd5Y",
  authDomain: "genesysbackrooms.firebaseapp.com",
  projectId: "genesysbackrooms",
  storageBucket: "genesysbackrooms.appspot.com",
  messagingSenderId: "821253382266",
  appId: "1:821253382266:web:1bd1ba463825507e1a5bc3"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export default getFirestore(app);