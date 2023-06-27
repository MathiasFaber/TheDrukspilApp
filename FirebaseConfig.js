import firebase from 'firebase/compat'
import 'firebase/compat/storage'
import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyB3ydD1C3Qw0ZFBzZSr-hWSvlgaCCTRX-Q",
    authDomain: "thedrukspilapp.firebaseapp.com",
    databaseURL: "https://thedrukspilapp-default-rtdb.firebaseio.com",
    projectId: "thedrukspilapp",
    storageBucket: "thedrukspilapp.appspot.com",
    messagingSenderId: "848343409134",
    appId: "1:848343409134:web:26722314e80d054fe82eff",
    measurementId: "G-7DH5F4WRHR"
  };

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig)
}

const app = initializeApp(firebaseConfig);
const auth = firebase.auth();

export {app, firebase, auth} 