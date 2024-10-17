import {initializeApp} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js'
import {deleteUser, getAuth as _getAuth, signInWithRedirect as _signInWithRedirect, signInWithPopup as _signInWithPopup, GoogleAuthProvider, onAuthStateChanged as _onAuthStateChange, signOut as _signout} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js'
import {getDatabase as _getDatabase, child, push, ref as _ref, update, get, onValue, onChildAdded, onChildChanged, onChildRemoved, set, off} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js"
import { getFunctions as _getFunctions, httpsCallable as _https  } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-functions.js'

const CONFIG = {
    apiKey: "AIzaSyDniS0prRjEmOyKbMd4jequo9gkwe2otKI",
    authDomain: "fashion-galetora.firebaseapp.com",
    databaseURL: "https://fashion-galetora.firebaseio.com",
    projectId: "fashion-galetora",
    storageBucket: "fashion-galetora.appspot.com",
    messagingSenderId: "469438762797",
    appId: "1:469438762797:web:759f543ce82183b9f04da4",
    measurementId: "G-Q7DJ37H3D0"
  };
  

const App = initializeApp(CONFIG);
const Database = _getDatabase(App);
const Auth = _getAuth();
const Functions = _getFunctions(App);

async function signInWithPopup(provider) { return await _signInWithPopup(Auth, provider) }

function getApp() {return App}
function getDatabase() {return Database}
function getAuth() {return Auth}
function getFunctions() {return Functions}
function ref(path) {return _ref(Database, path)}
function signInWithRedirect(provider) {return _signInWithRedirect(Auth, provider)}
function onAuthStateChanged(callback) {return _onAuthStateChange(Auth, callback)}
function httpsCallable(fname) {return _https(Functions, fname)}
function signOut() {return _signout(Auth)}


export {child, push, update, get, onValue, onChildAdded, onChildChanged, onChildRemoved, set, off, GoogleAuthProvider, deleteUser, signOut, getApp, getDatabase, getAuth, ref, signInWithRedirect, onAuthStateChanged, signInWithPopup, getFunctions, httpsCallable }