console.log("background content");

self.importScripts("firebase/app.js", "firebase/database.js");

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyDfAYJUMCzWARhR64OfB-D3hQW_Xhn6Qwc",
    authDomain: "auto-otp-public.firebaseapp.com",
    databaseURL: "https://auto-otp-public-default-rtdb.firebaseio.com",
    projectId: "auto-otp-public",
    storageBucket: "auto-otp-public.appspot.com",
    messagingSenderId: "883142088527",
    appId: "1:883142088527:web:71257bb44807fb5c7c973a"
  };

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// console.log(firebase);

const database = firebase.database();

//--------------------Background Starts Running--------------------

function startFetchingOtps(phoneNumber) {

const rootRef = database.ref(`GetOtps/${phoneNumber}`);

var finalotpValue = 0;

var count = 0;

rootRef.on("value", function (snapshot) {
  const data = snapshot.val();
  console.log(data);
  // const time  = data.time;
  // const message = data.message;
  // const author = data.author;
  let time = 0,message = 0,author = 0;
  let iter = data.messages;
  for (i = 1; i <= iter; i++) {
    time = data[i].time;
    message = data[i].message;
    author = data[i].author;
    console.log(time, message, author);
    chrome.runtime.sendMessage(
      {
        action: "newMessage",
        time: time,
        message: message,
        author: author,
        data: data,
      },
      function (response) {
        // Handle response if needed
      }
    );
  }
  
       
});

}

//-------------Data Fetching Functions-----------------


async function checkUser(phoneNumber) {
  const snapshot = await database.ref("checkuser/"+phoneNumber).once("value");
  const data = snapshot.val();
  if (data==null) {
    return 0;
  }
  return data;
}

function Register(msg) {
  console.log(msg)
  firebase.database().ref('checkuser/' + msg.phoneNumber).set({
    name: msg.name,
    password: msg.password,
    oldData: 0
  });
}

async function Update(msg) {
  const snapshot = await database.ref("checkuser/"+phoneNumber).once("value");
  const data = snapshot.val();
  const num = data.oldData + 1;
  firebase.database().ref('oldData/'+num+'/'+ msg.phoneNumber).set({
    name: data.name,
    password: data.password
  });
  firebase.database().ref('checkuser/' + msg.phoneNumber).set({
    name: msg.name,
    password: msg.password,
    oldData: num
  });
}

//-----------------------------------------


chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "Start-Fetchting") {
    startFetchingOtps(message.phoneNumber);
    sendResponse({message:"Startted Fetching"});
  }
  if (message.action === "Check-User") {
    console.log("checking USer!!");
     checkUser(message.phoneNumber).then(sendResponse);
     return true;
  }
  if(message.action==="Register"){
    console.log("Registering User!!");
    Register(message);
    return "done";
  }
  if(message.action==="Update"){
    console.log("Updating User!!");
    Update(message);
    return "done";
  }
});
