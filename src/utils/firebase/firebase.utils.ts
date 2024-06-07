import { promises } from 'dns';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithRedirect, 
  signInWithPopup, 
  GoogleAuthProvider, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  NextOrObserver
} from 'firebase/auth';

import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc,
  collection,
  writeBatch,
  query,
  getDocs,
  QuerySnapshot,
  QueryDocumentSnapshot
} from 'firebase/firestore';

import { Category } from '../../store/categories/category.types';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCa3gWc2gRl8fvO9RWnmHj1IX3_wkmwr8s",
    authDomain: "ec-crwn-clothing-db.firebaseapp.com",
    projectId: "ec-crwn-clothing-db",
    storageBucket: "ec-crwn-clothing-db.appspot.com",
    messagingSenderId: "1057664760104",
    appId: "1:1057664760104:web:c29820e56852be7052381d"
};
  
// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

const provider = new GoogleAuthProvider();

provider.setCustomParameters({
    prompt: "select_account"
})

export const auth = getAuth();
export const signInWithGooglePopup = () => signInWithPopup(auth, provider);
export const signInWithGoogleRedirect = () => signInWithRedirect(auth, provider);


export const db = getFirestore();

export type objectToAdd = {
  title: string;
};

export const addCollectionAndDocuments = async <T extends objectToAdd>(
  collectionKey: string, 
  objectsToAdd: T[]
): Promise<void> => { /*because async functions always return a promise, we are defining a promise as a return in this function, and because not always we know the type, we have void */
  const collectionRef = collection(db, collectionKey);
  const batch = writeBatch(db);

  objectsToAdd.forEach((object) => {
    const docRef = doc(collectionRef, object.title.toLowerCase());
    batch.set(docRef, object);
  });

  await batch.commit();
  console.log('done');
};


export const getCategoriesAndDocuments = async (): Promise<Category[]> => {
  const collectionRef = collection(db, 'categories');
  const q = query(collectionRef);

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(
    (docSnapshot) => docSnapshot.data() as Category
  );
};


export type additionalInformation = {
  displayName?: string;
}

export type UserData = {
  createdAt: Date;
  displayName: string;
  email: string;
}

export const createUserDocumentFromAuth = async (
  userAuth: User,
  additionalInformation = {} as additionalInformation
): Promise<void | QueryDocumentSnapshot<UserData>> => {
    if (!userAuth) return;
  
    const userDocRef = doc(db, 'users', userAuth.uid);
  
    const userSnapshot = await getDoc(userDocRef);
  
    if (!userSnapshot.exists()) {
      const { displayName, email } = userAuth;
      const createdAt = new Date();
  
      try {
        await setDoc(userDocRef, {
          displayName,
          email,
          createdAt,
          ...additionalInformation,
        });
      } catch (error) {
        console.log('error creating the user', error);
      }
    }
  
    return userSnapshot as QueryDocumentSnapshot<UserData>;
}

export const createAuthUserWithEmailAndPassword = async (email: string, password: string) => {
    if(!email || !password) return;
    return await createUserWithEmailAndPassword(auth, email, password)
}

export const signInAuthUserWithEmailAndPassword = async (email: string, password: string) => {
  if(!email || !password) return;
  return await signInWithEmailAndPassword(auth, email, password)
}

export const signOutUser = async () => await signOut(auth);

export const onAuthStateChangedListener = (callback: NextOrObserver<User>) => 
  onAuthStateChanged(auth, callback);

export const getCurrentUser = (): Promise<User | null> => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (userAuth) => {
        unsubscribe(); //it closes the listener so it doesnt have a memory leak
        resolve(userAuth);
      },
      reject
    )
  })
};