import firebase from 'firebase/app';
// Firebase cloud product 
import 'firebase/firestore';
//Firebase authentication product
import 'firebase/auth';

// Firebase project configuration
// REACT_APP_API is an key value environmental value being read from .env at the root.
// These Firebase configuration values are okay to be public
const config = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTHDOMAIN,
    projectId: process.env.REACT_APP_PROJECTID,
    storageBucket: process.env.REACT_APP_STORAGEBUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGINGSENDERID,
    appId: process.env.REACT_APP_ID,
    measurementId: process.env.REACT_APP_MEASUREMENTID
  };

 
  // Initial Firebase
  firebase.initializeApp(config);

  // const to create a user in Firebase
  export const createUserProfileDocument = async (userAuth, additionalData) => {
    // If user is not authenticated, exit this function.
    if (!userAuth) return;
    // userRef holds reference to collection called, users, document id
    const userRef = firestore.doc(`users/${userAuth.uid}`);
  
    const snapShot = await userRef.get();
  
    if (!snapShot.exists) {
      const { displayName, email } = userAuth;
      const createdAt = new Date();
      try {
        await userRef.set({
          displayName,
          email,
          createdAt,
          ...additionalData
        });
      } catch (error) {
        console.log('error creating user', error.message);
      }
    }
  
    return userRef;
  };

  // Making the auth and firestore module available to other files that import these.
  export const auth = firebase.auth();
  export const firestore = firebase.firestore();

 

  const provider = new firebase.auth.GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  export const signInWithGoogle = () => auth.signInWithPopup(provider);

  export default firebase;