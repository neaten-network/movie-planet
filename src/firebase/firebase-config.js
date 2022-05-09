import firebase from "firebase/app";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBUdFiNoQz3cXwp47bLh5WdgywYTt5XY8Q",
  authDomain: "movie-planet-4b04a.firebaseapp.com",
  projectId: "movie-planet-4b04a",
  storageBucket: "movie-planet-4b04a.appspot.com",
  messagingSenderId: "57438494601",
  appId: "1:57438494601:web:d753547ea24544536c4b58",
};

// init firebase
firebase.initializeApp(firebaseConfig);
// init firestore
const projectFirestore = firebase.firestore();
const timestamp = firebase.firestore.FieldValue.serverTimestamp;

export { projectFirestore, timestamp };
