import React from 'react';
// import firebase from 'firebase';
import { render } from 'react-dom';

import { App } from './App';

// setup fake backend
import { configureFakeBackend } from './_helpers';
configureFakeBackend();

// firebase.initializeApp({
//     apiKey: "AIzaSyCIQkVOdkVHZXdMLHZbRbXtGvxrFaX7W_4",
//     authDomain: "ecelab3.firebaseapp.com",
//     projectId: "ecelab3",
//     storageBucket: "ecelab3.appspot.com",
//     messagingSenderId: "389314089404",
//     appId: "1:389314089404:web:b55bd341811da2e5d35bb9",
//     measurementId: "G-K0Z3B1G9NN"
// });

render(
    <App />,
    document.getElementById('app')
);