import firebase from 'firebase/app';
// Firebase cloud product 
import 'firebase/firestore';
//Firebase authentication product
import 'firebase/auth';

const arrayUnion = firebase.firestore.FieldValue.arrayUnion;

// Firebase project configuration
// REACT_APP_API is an key value environmental value being read from .env at the root.
// These Firebase configuration values are okay to be public
const config = {
    apiKey: 'AIzaSyCFtGFV5O42l55uEcVwcORdqChJ4O_Xmg4',
    authDomain: 'crwn-db-2cfba.firebaseapp.com',
    projectId: 'crwn-db-2cfba',
    storageBucket: 'crwn-db-2cfba.appspot.com',
    messagingSenderId: '781441015913',
    appId: '1:781441015913:web:3f09fcf3f5f637e765c2f8',
    measurementId: 'G-FGVPREMDQH'
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
    return userRef;//
  };

  export const getUserCartRef = async userId => {
    // Store document reference, not the data
    const cartsRef = firestore.collection('carts').where('userId', '==', userId);
    // Get the cartsRef info and store in snapShot
    const snapShot = await cartsRef.get();
    // Since you will get an snapShot object regardless,
    // you will need to check to make sure it is not empty.
    if (snapShot.empty) {
      // Store document reference to collection carts in cartDocRef
      const cartDocRef = firestore.collection('carts').doc();
      // Set the document to userID object and cartItems with an empty array value.
      await cartDocRef.set({ userId, cartItems: [] });
      return cartDocRef;
    } else {
      // Not clear on this but is under assumption that you are returning the document ref.
      return snapShot.docs[0].ref;
    }
  };

  export const addCollectionAndDocuments = async (collectionKey, objectsToAdd) => {
    const collectionRef = firestore.collection(collectionKey);

    const batch = firestore.batch();
    objectsToAdd.forEach(obj => {
      const newDocRef = collectionRef.doc();
      batch.set(newDocRef, obj);
    });

    return await batch.commit();
  };

  export const convertCollectionsSnapshotToMap = (collections) => {
    const transformedCollection = collections.docs.map(doc => {
      const { title, items } = doc.data();

      return {
        routeName: encodeURI(title.toLowerCase()),
        id: doc.id,
        title,
        items
      }
    });
    return transformedCollection.reduce((accumulator, collection) => {
      accumulator[collection.title.toLowerCase()] = collection;
      return accumulator;
    }, {});
  }

  export const getCurrentUser = () => {
    return new Promise((resolve, reject) => {
      const unsubscribe = auth.onAuthStateChanged(userAuth => {
          unsubscribe();
          resolve(userAuth);
        }, reject)
    })
  };

  // Making the auth and firestore module available to other files that import these.
  export const auth = firebase.auth();
  export const firestore = firebase.firestore();

 

  export const googleProvider = new firebase.auth.GoogleAuthProvider();
  googleProvider.setCustomParameters({ prompt: 'select_account' });
  export const signInWithGoogle = () => auth.signInWithPopup(googleProvider);

  export default firebase;