// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import{getAuth,GoogleAuthProvider} from "firebase/auth";



const firebaseConfig = {
  apiKey: "AIzaSyCls2rFxMluWLSrw9cBTH97qiNGP778wDo",
  authDomain: "edusync-92749.firebaseapp.com",
  projectId: "edusync-92749",
  storageBucket: "edusync-92749.firebasestorage.app",
  messagingSenderId: "54356648048",
  appId: "1:54356648048:web:1bb928bbf8e935c29554b5",
  measurementId: "G-29PYP9TK1B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth=getAuth(app);
const provider=new GoogleAuthProvider(app);
export {auth,provider};
// const analytics

