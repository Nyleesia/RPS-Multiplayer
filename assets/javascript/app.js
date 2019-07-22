$(document).ready(function(){

//Initializes the firebase VARIABLE
let database = firebase.database();
console.log(database);

//Firebase configuration
  let firebaseConfig = {
    apiKey: "AIzaSyDs1deI2cIl0lO8VHq4yzs2O-ONILbaoCI",
    authDomain: "rps-nschnarr.firebaseapp.com",
    databaseURL: "https://rps-nschnarr.firebaseio.com",
    projectId: "rps-nschnarr",
    storageBucket: "",
    messagingSenderId: "832432259312",
    appId: "1:832432259312:web:b1f69c7b7bd2e979"
  };

//Initializes the firebase DATABASE
firebase.initializeApp(firebaseConfig);
console.log(firebaseConfig);

//Initializes variables to reference items in the firebase database
let playersRef = db.ref('players'); 
let connectionsRef = db.ref("connections"); 
let connectedRef = db.ref(".info/connected");
let p1Ref = playersRef.child('player1'); 
let p2Ref = playersRef.child('player2');
let turnRef = db.ref('turn');
let winsRef = db.ref('wins');
let lossesRef = db.ref('losses');
let chatRef = db.ref('chat');


 // Initializes variables to take in and compare inputs and results for each player


















});