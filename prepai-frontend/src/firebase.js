import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAtPYKpD3p8cXZtP5snTb6wa3drz-oCHZw",
  authDomain: "prepai-32722.firebaseapp.com",
  projectId: "prepai-32722",
  storageBucket: "prepai-32722.firebasestorage.app",
  messagingSenderId: "1081722712410",
  appId: "1:1081722712410:web:a1629148f068b68105c363",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
