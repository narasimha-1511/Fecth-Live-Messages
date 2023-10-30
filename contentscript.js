console.log("I am content script!");

var optValue = 0;

const menu = document.querySelector('[data-name="academy-header-login"]');

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function myContentScriptFunction(data) {
  menu.click();

  await delay(2000);

  var phoneInput = document.getElementById("login-mobile-number");
  const loginButton = document.querySelector(
    '[data-gtm-element="login_mobile"]'
  );


  loginButton.addEventListener("click", () => {
    console.log(phoneInput.value);
  });

  phoneInput.addEventListener("click", () => {
    phoneInput.setAttribute("value", data);
  });

  phoneInput.click();
  await delay(1000);

  phoneInput.dispatchEvent(new Event("input"));

  loginButton.click();
 
}

gotOTP = (data) => {
      console.log("this is otp :- " + data);
      const otpInput = document.querySelector('[data-cy="login_mobile_otp_input"]');
      const verifyOtpButton = document.querySelector('[data-cy="login_mobile_otp_verify_button"]');
     
      otpInput.value = data;
      verifyOtpButton.click();
}


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "myAction") {
    myContentScriptFunction(request.data);
  }
  if (request.action === "otpValue") {
    optValue = request.data;
  }
  if (request.action === "newOTP") {
    gotOTP(request.data);
    
    sendResponse({ message: "Content script received the action" });
  }

  console.log(request);
});
