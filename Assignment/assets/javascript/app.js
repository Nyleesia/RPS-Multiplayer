// global variables
let currentUsers= 0;
let userId = "";
let user = "";
let playerNumber = 0;

$( document ).ready(function() {

    var firebaseConfig = {
        apiKey: "AIzaSyDkPVMdjYtSQCZaIfPCYVB60-pKbs87oUA",
        authDomain: "ticktacno.firebaseapp.com",
        databaseURL: "https://ticktacno.firebaseio.com",
        projectId: "ticktacno",
        storageBucket: "ticktacno.appspot.com",
        messagingSenderId: "843613480744",
        appId: "1:843613480744:web:b5c323ccf7860d50"
      };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

    let database = firebase.database();

    let player1Name = 'FuzzyPants';
    let player2Name = 'PlainPajamas';
    let player1Wins = 0;
    let player1Losses = 0;
    let player1Choice = ''; // rock paper scissors
    let player2Wins = 0;
    let player2Losses = 0;
    let player2Choice = ''; // rock paper scissors



    firebase.auth().signInAnonymously().catch(function(error) {
        // Handle Errors here.
        errorCode = error.code;
        errorMessage = error.message;
        console.log(errorCode + " " + errorMessage);
        // ...
    });

    
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          // User is signed in.
          userId = user.uid;
          // ...
        } else {
          alert("You are not logged in. Most likely too many players")
        }
        // ...
    });

    database.ref("/users/").on('value', function(snapshot) { 
        currentUsers = snapshot.numChildren();
        if( currentUsers == 0 && playerNumber == 0 ) {
            playerNumber = 1;
            writeUserData(userId, playerNumber, player1Name, player1Wins, player1Losses, player1Choice)
            $("#messages").html("Waiting for another player");
          }
        if( currentUsers == 1 && playerNumber == 0 ) {
            playerNumber = 2;
            writeUserData(userId, playerNumber, player2Name, player2Wins, player2Losses, player2Choice)  
        }
        if( currentUsers == 2) {
            $("#messages").html("Let the games begin!");
        }
        if(currentUsers > 2 && playerNumber == 0) {
            alert("Most likely too many players. Come back again!");
        }
    });

    
    function writeUserData(userId, playerNumber, name, wins, losses, choice) {
        database.ref('/users/' + userId).set({
          userName: userId,
          playerNumber: playerNumber,
          playerName: name,
          wins: wins,
          losses : losses,
          choice: choice
        });
        database.ref('/users/' + userId).onDisconnect().remove();
        $("#player").html("Player Name: " + playerNumber);

    }

    function writeChoice(userId, choice) {
        database.ref('/users/' + userId).update({
          choice: choice
        });
        database.ref('/users/').once('value').then(function(snapshot) {
            // find value for rock, paper, scissors to compare
            console.log(snapshot.val())
            // ...
          });

    }




    $(".choice").on("click", function() {
        let id = $(this).attr("id");
        writeChoice(userId, id);

    })


});



