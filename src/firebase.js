import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBdIRRE8BZUX1-AMOMT0mtIOTXO_M0zzqo",
  authDomain: "focus-buddy-88ba4.firebaseapp.com",
  projectId: "focus-buddy-88ba4",
  storageBucket: "focus-buddy-88ba4.appspot.com", // fixed typo
  messagingSenderId: "146031390928",
  appId: "1:146031390928:web:a249454ccda13484422ed5",
  measurementId: "G-BQ48ZHQGWD"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);

signInAnonymously(auth);

export { app, auth, storage }; 