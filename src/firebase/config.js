import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBtDUMuTpJPotI42CMUHLZsqC0MhaQXQAU",
  authDomain: "events-platform-4657b.firebaseapp.com",
  projectId: "events-platform-4657b",
  storageBucket: "events-platform-4657b.firebasestorage.app",
  messagingSenderId: "506762231683",
  appId: "1:506762231683:web:c2ab97930725417abbc0b6"
};

///Initialise Firebase
const app = initializeApp(firebaseConfig);

///Initialise Services

const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
