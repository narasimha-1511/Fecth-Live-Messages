//Global Varibales
let Cname = null;
let password = null;
let numebr = null;
//-------Functions to get data from local storage-----------------
const getLocalStorage = async () => {
  const data = await chrome.storage.local.get(["mobile","name"]);
  return data;
};
//--------------------Background Starts Running--------------------

getLocalStorage().then((data) => {
  if(data.mobile){
    numebr = data.mobile;
    Cname = data.name;
    setTimeout(openDashboard(), 1000);
  }else{
    //Do Nothing
    console.log("Storage is empty");
  }
});


//---------------------- Send Messages to Background.js ----------------------------------

function sendMessageToBackground(message) {
  chrome.runtime.sendMessage(
    { action: message.action, phoneNumber: message.phoneNumber , name :message.name , password : message.password},
    (respopnse) => {
      if (message.action == "Check-User") {
        if (respopnse == 0) {
          showRegisterForm();
        } else {
          showPassword(respopnse.name,respopnse.password);
        }
      }
      if(message.action == "Register"){
        console.log(" message sent");
        document.getElementById("wrongPassword").innerText="Registration Successfull";
        document.getElementById("wrongPassword").style.display = "block";
        document.getElementsByClassName("main-div")[1].style.display = "none";
        showPassword(message.name,message.password);
      }
    }
  );
}

function setLocalStorage(mobile,name) {
  chrome.storage.local.set({ mobile: mobile ,name: name}).then(() => {
    console.log("Value is set to " + mobile);
  });
}

//--------------------- starting registration and login -----------------------------

document.getElementById("Uni-Button").addEventListener("click", () => {
  const button = document.getElementById("Uni-Button");
  const action = button.innerText;
  switch (action) {
    case "Check User":
      const phoneNumber = document.getElementById("mobile-input").value;
      sendMessageToBackground({
        action: "Check-User",
        phoneNumber: phoneNumber,
      });
      break;
    case "Submit":
      submitPassword();
      break;
      case "Register":
        submitRegister();
        break;
    default:
      console.log("SOmoething went wrong");
      break;
  }
});
function showPassword(a,b) {
  Cname=a;password=b;
  document.getElementById("password-input").style.display = "block";
  document.getElementById("Uni-Button").innerText = "Submit";
}

function submitPassword() {
  var passwordtemp = document.getElementById("password-input").value;
  if(passwordtemp == password){
    document.getElementById("wrongPassword").style.display = "block";
    document.getElementById("wrongPassword").innerText="Login Successfull";
    startLoading();
    setTimeout(openDashboard, 3000);
    setLocalStorage(document.getElementById("mobile-input").value,Cname);
  }else{
    document.getElementById("wrongPassword").style.display = "block";
  }
}

function showRegisterForm() {
  document.getElementsByClassName("main-div")[1].style.display = "block";
  document.getElementById("Uni-Button").innerText = "Register";
}
function submitRegister() {
  var fullName = document.getElementById("register-input-name").value;
  var mobileNumber = document.getElementById("mobile-input").value;
  var password1 = document.getElementById("register-password-1").value;
  var password2 = document.getElementById("register-password-2").value;
  if (fullName === "" || mobileNumber === "" || password === "") {
    alert("Please fill in all fields.");
  } else {
    if(password1 != password2){
      alert("Password not matched");
    }else{
      sendMessageToBackground({
        action: "Register",
        phoneNumber: mobileNumber,
        name : fullName,
        password : password1
      });
    }
    // Submit registration
  }
}

//------------Login and Registration Completed-----------------

function startLoading(){
  document.getElementsByClassName("main-div")[0].style.display = "none";
  document.querySelectorAll('ul')[0].style.display="block"
}

function stopLoading(){
  document.getElementsByClassName("main-div")[0].style.display = "block";
  document.querySelectorAll('ul')[0].style.display="none"
}

function openDashboard(){
  document.querySelectorAll('ul')[0].style.display="none"
  document.getElementsByClassName("main-div")[0].style.display = "none";
  document.getElementsByClassName("scroll-view")[0].style.display = "block";
  document.getElementById("Welcome").innerText="Welcome ,"+Cname;
  startFetchingOtps(numebr);
}

//--------------- OTP Fetching starts ----------------------------

function startFetchingOtps(phoneNumber) {
  console.log("Fetching OTPs");
  sendMessageToBackground({action:"Start-Fetchting",phoneNumber:phoneNumber});
  startListening();
}


function addDatatoList(time,author,message) {

  if(time.minute<10)time.minute="0"+time.minute;
  
  var list = document.getElementById("list");
  var li = document.createElement("li");
  if(time.hour<13)
  li.setAttribute("data-time",time.hour+":"+time.minute+" AM");//TIME
  else
  li.setAttribute("data-time",(time.hour-12)+":"+time.minute+" PM");
  var span = document.createElement("span");
  span.innerText = author;//AUTHOR OF THE MESSAGE
  li.appendChild(span);
  var text = document.createElement("p");
  //MEssage
  text.innerText = message;
  li.appendChild(text);
  list.appendChild(li);
}

function startListening(){
  chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if(message.action==="newMessage"){
      console.log(message)
      addDatatoList(message.time,message.author,message.message);
    }
  });
}


//------------------ Logout & Change Info ----------------------------
document.getElementsByClassName("logout-button")[0].addEventListener("click",()=>{
  chrome.storage.local.clear();
  window.location.reload();
})




// addDatatoList();
// setInterval(addDatatoList, 1000);