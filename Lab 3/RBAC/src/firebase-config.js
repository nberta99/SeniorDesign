import Firebase from 'firebase';
import { firebaseConfig } from './firebase-config-secret';

export const app = Firebase.initializeApp(firebaseConfig);