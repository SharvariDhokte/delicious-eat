import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCwNO2_wkBBSi213j4Lx3G5__IKC5QjUuU",
  authDomain: "delicious-eats-cd6e2.firebaseapp.com",
  projectId: "delicious-eats-cd6e2",
  storageBucket: "delicious-eats-cd6e2.appspot.com",
  messagingSenderId: "966955145253",
  appId: "1:966955145253:web:ed25e53a2e4e9ae4ab87cc",
  measurementId: "G-M4VV75S60L"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const db = getFirestore(app)
export {db}

