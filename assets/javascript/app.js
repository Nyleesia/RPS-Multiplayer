$(document).ready(function() {
  let config = {
    apiKey: "AIzaSyDs1deI2cIl0lO8VHq4yzs2O-ONILbaoCI",
    authDomain: "rps-nschnarr.firebaseapp.com",
    databaseURL: "https://rps-nschnarr.firebaseio.com",
    projectId: "rps-nschnarr",
    storageBucket: "",
    messagingSenderId: "832432259312",
  };
    // Initialize Firebase
    firebase.initializeApp(config);

    // Reference the database
    let database= firebase.database();
        
    //Collecting user data for messaging and player info
    //Collects the user information in a form (user name)
    // Initiates user data variables
    let email="";
    let username = "";
    let password = "";
    let userId = 0;
    // Storing the snapshot.val() in a variable
   

    $("#userSubmit").on("click", function(event){
            event.preventDefault();
            let snap = snapshot.val();
            // References values using IDs
            email=$("#email").val().trim();
            username=$("#username").val().trim();
            password=$("#password").val().trim();
            userId = Math.floor(Math.random()*100000);

            // Pushes a user data object for each new player
            database.ref("users").push({
                email:email,
                username: username,
                password: password,
                userId: userId,
                });
        });

        //Looks for additional data added amnd appends it to the users list
        database.ref().on("child_added", function(snapshot) {
            // Storing the snapshot.val() in a variable
            var snap = snapshot.val();
            // Console.loging the last user's data
            console.log(snap.email);
            console.log(snap.username);
            console.log(snap.password);
            console.log(snap.userId);
        }, 
        function(errorObject) {
            console.log("Error: " + errorObject.code);
        });

        $("#submitMsg").on("click", function(event){
            event.preventDefault();
            // References values using IDs
            messageText=$("#usermsg").val();
            
            // Pushes a user data object for each new player
            database.ref("messages").push({
                messageText:messageText,
            });
    });
    database.ref().on("child_added", function(snapshot) {
        // Storing the snapshot.val() in a variable
        var snap = snapshot.val();
        // Console.loging the last user's data
        console.log(snap.username);
        console.log(snap.messageText);
    }, 
    function(errorObject) {
        console.log("Couldn't read message: " + errorObject.code);
    });
});


// Game starts here------------------------------------------------

