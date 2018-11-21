import firebase from 'firebase'
require('firebase/firestore')

var config = {
    apiKey: "AIzaSyBvE2aCMk_X4GUmFU8o-P9Nz2sUJGStdt0",
    authDomain: "greatnet-recording-text.firebaseapp.com",
    databaseURL: "https://greatnet-recording-text.firebaseio.com",
    projectId: "greatnet-recording-text",
    storageBucket: "greatnet-recording-text.appspot.com",
    messagingSenderId: "760709011732"
  };
  var firebase_init=firebase.initializeApp(config);
  export const Authprovider = new firebase.auth.GoogleAuthProvider();
  export const auth = firebase.auth();
  export const firestore=firebase.firestore();


  
  export default firebase_init;