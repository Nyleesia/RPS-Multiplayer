// Initializes global variables
//User variables
let currentUsers= 0;
let userId = "";
let playerNumber = 0;
let gamesPlayed = 0;
let username = ""; //Trying to figure out how to make these unique as well (not for MVP)

//Player variables
let player1Name = "YellowElephant";
let player2Name = "PlainPajamas";
let player1Wins = 0;
let player1Losses = 0;
let player1Choice = ""; // Rock or paper or scissors
let player2Wins = 0;
let player2Losses = 0;
let player2Choice = ""; // Rock or paper or scissors

//Configure/set-up Firebase
var firebaseConfig = {
    apiKey: "AIzaSyDs1deI2cIl0lO8VHq4yzs2O-ONILbaoCI",
    authDomain: "rps-nschnarr.firebaseapp.com",
    databaseURL: "https://rps-nschnarr.firebaseio.com",
    projectId: "rps-nschnarr",
    storageBucket: "rps-nschnarr.appspot.com",
    messagingSenderId: "832432259312",
    appId: "1:832432259312:web:b14ec919a8ef5602"
};
//Initialize Firebase
firebase.initializeApp(firebaseConfig);

let database = firebase.database(); //Reference the database

//Initializes some variables for user info and messages
let userRef = firebase.database().ref("/users/");
let messagesRef = firebase.database().ref("/messages/");
let playerStatsRef= firebase.database().ref("/playerStats/");
let userTree = {};

$( document ).ready(function() { //Start of document ready function

    firebase.auth().signInAnonymously().catch(function(error) {
        //Handles sign-in errors here
        errorCode = error.code;
        errorMessage = error.message;
        console.log(errorCode + " " + errorMessage);
    });

    //Collects the user messages in a form
    $("#chatinput").keypress("keypress", function(event){
        //If not press return then ignore
        if(event.which != '13'){
            return;
        }
        //References input using id
        chattext=$("#chatinput").val().trim();

        //Pushes each new player message to the messages document
        database.ref("/messages/").push({
            message: username + ": " + chattext
        });
        $("#chatinput").val("");
        event.preventDefault();//Prevents page reload before form submit
    });

    //Retrieves last ten messages
    messagesRef.limitToLast(10).on("value", function(snapshot) { 
        
        //Empties messages
        $("#messages").empty();
                
        //Adds ten messages
        snapshot.forEach(function(childSnapshot) {
            $("#messages").append(`${childSnapshot.val().message} <br>`);
        });
    });

    //Collects the user information in a form on submit
    $("#userSubmit").on("click", function(event){
        event.preventDefault();//Prevents page reload before form submit

        //References values using IDs
        username=$("#username").val().trim();

        //Pushes a user data object for each new player
        database.ref("/users/" + userId).update({
            userName: username
        });
        $("#userForm").html("");
    });
    
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          //User is signed in.
          userId = user.uid;
        } else {
          //Alert("You are not logged in. Most likely too many players")
        }
    });

    function writeUserData(userId, playerNumber, name, wins, losses, choice) {
      
        //Adds a player to database
        database.ref("/users/" + userId).set({
            userName: userId,
            playerNumber: playerNumber,
            userName: name,
            wins: wins,
            losses : losses,
            choice: choice,
        });

      database.ref("/users/" + userId).onDisconnect().remove();
      $("#player").html("Player Name: " + name);
    }

    function updateResult(userId, wins, losses) {

      //Adds total wins and losses
      player1Wins = player1Wins + wins;
      player1Losses = player1Losses + losses;

      //Resets choices
      let choice = "";
      player1Choice = "";
      player2Choice = "";

      //Updates wins and losses
      database.ref("/users/" + userId).update({
        wins: player1Wins,
        losses : player1Losses,
        choice: choice,
      });
    }

    function writeChoice(userId, choice) {

        //Waiting until you other player (opponent) makes a choice
        if (choice != "") {
          $("#gameAlerts").html(`You selected " ${choice} " waiting for opponent to choose.`); //How to get this to show up on only on player's screen
          $("#game").prepend(this.choice);
        }
        database.ref("/users/" + userId).update({
          choice: choice,
        });
    }

    function decideWinner(p1Choice, p2Choice) {

        //Keeps track of games played locally
        gamesPlayed += 1;

      //If both players make the same choice, this resets choice and it's tie
      if(p1Choice == p2Choice) {
        $("#gameUpdates").prepend("You both choose " + p1Choice + ". It's a tie!");
        writeChoice(userId,"");
        player1Choice = "";
        player2Choice = "";
      }
      //Announces game play results for each round and adds to wins/ losses for each player
      else if (p1Choice == "rock" && p2Choice == "scissors") {
        $("#gameUpdates").html(`${player1Name} played ${p1Choice} and ${player2Name} played ${p2Choice}. ${player1Name} won! ${player2Name} lost.`);
        updateResult(userId, +1,0);
      }
      else if (p1Choice == "rock" && p2Choice == "paper") {
        $("#gameUpdates").html(`${player1Name} played ${p1Choice} and ${player2Name} played ${p2Choice}. ${player2Name} won! ${player1Name} lost.`);
        updateResult(userId, 0,+1);
      }
      else if (p1Choice == "paper" && p2Choice == "rock") {
        $("#gameUpdates").html(`${player1Name} played ${p1Choice} and ${player2Name} played ${p2Choice}. ${player2Name} won! ${player1Name} lost.`);
        updateResult(userId, +1,0);
      }
      else if (p1Choice == "paper" && p2Choice == "scissors") {
        $("#gameUpdates").html(`${player1Name} played ${p1Choice} and ${player2Name} played ${p2Choice}. ${player2Name} won! ${player1Name} lost.`);
        updateResult(userId, 0,+1);
      }
      else if (p1Choice == "scissors" && p2Choice == "rock") {
        $("#gameUpdates").html(`${player1Name} played ${p1Choice} and ${player2Name} played ${p2Choice}. ${player2Name} won! ${player1Name} lost.`);
        updateResult(userId, 0,+1);
      }
      else if (p1Choice == "scissors" && p2Choice == "paper") {
        $("#gameUpdates").html(`${player1Name} played ${p1Choice} and ${player2Name} played ${p2Choice}. ${player1Name} won! ${player2Name} lost.`);
        updateResult(userId, +1,0);
      }
    }

    userRef.on("value", function(snapshot) { 
        currentUsers = snapshot.numChildren();
        let firstTimerUser = true;
        
        snapshot.forEach(function(childSnapshot) {
          // Key will be userId, if user already playing then exit
          if (userId == childSnapshot.key) {
            //Gets and saves first player's information
            firstTimerUser = false;
            $("#name1").html(": " + childSnapshot.val().userName);
            if (player1Wins == 0 && player1Losses == 0) {
              player1Wins = childSnapshot.val().wins;
              player1Losses = childSnapshot.val().losses;
            }
          }
          else {
            // Gets and saves opponent's information
            $("#name2").html(": " + childSnapshot.val().userName);
            player2Choice = childSnapshot.val().choice;
            player2Wins = childSnapshot.val().wins;
            player2Losses = childSnapshot.val().losses;
          }
        });

        if(gamesPlayed > 0 ) {
          // track wins and losses
          $("#wins1").html(`Wins: ${player1Wins}`);
          $("#losses1").html(`Losses: ${player1Losses}`);
          $("#wins2").html(`Wins: ${player2Wins}`);
          $("#losses2").html(`Losses: ${player2Losses}`);
        }
        if (player1Choice != "" && player2Choice != "") {
          // Decides winner
          decideWinner(player1Choice, player2Choice);
        }
        if( currentUsers == 2 && gamesPlayed == 0 && player1Choice == "") {
          // Only show if the game has not started 
          $("#gameAlerts").html("Let the games begin!");
        }
        //If the game has started already, message is not shown
        if (firstTimerUser == false) {
          return;
        }
        if( currentUsers == 0 && playerNumber == 0) {
            //Show if player 1 waiting
            playerNumber = 1;
            writeUserData(userId, playerNumber, player1Name, player1Wins, player1Losses, player1Choice)
            $("#gameAlerts").html("Waiting for another player");
        }
        else if( currentUsers == 1 && playerNumber == 0) {
            //Show if the player is player 2 
            playerNumber = 2;
            writeUserData(userId, playerNumber, player2Name, player2Wins, player2Losses, player2Choice)  
        }
        else if(currentUsers > 2 && playerNumber == 0) {
            // Show if more than two people try to enter the game
            alert("Most likely too many players. Come back again!");
        }
    });

    //Save players choice for rock paper scissors
    $(".choice").on("click", function() {
        player1Choice = $(this).attr("id");
        writeChoice(userId, player1Choice);
    })
});//End of document ready function



