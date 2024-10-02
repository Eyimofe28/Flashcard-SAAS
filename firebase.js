// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD9bkLVviAORCDaMOuCpHtYkwI8SMtc8ZU",
  authDomain: "flashcard-saas-333e0.firebaseapp.com",
  projectId: "flashcard-saas-333e0",
  storageBucket: "flashcard-saas-333e0.appspot.com",
  messagingSenderId: "434849363550",
  appId: "1:434849363550:web:62d417422ea80b3683e6cf",
  measurementId: "G-85LE7FLPYK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app)

export {db}