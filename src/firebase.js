import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";


const firebaseConfig = {
    apiKey: "AIzaSyB_i9awV0qzivYUI2hSg9KVyX5uYusoNaI",
    authDomain: "fantasy-basketball-562eb.firebaseapp.com",
    projectId: "fantasy-basketball-562eb",
    storageBucket: "fantasy-basketball-562eb.appspot.com",
    messagingSenderId: "787309564012",
    appId: "1:787309564012:web:8f46f2b147168f5df30849",
    measurementId: "G-1BSZSESCPV"
  };

  const app = initializeApp(firebaseConfig);

  export const auth = getAuth(app);
  export default app;