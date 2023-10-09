"use strict";

const APIURL = "https://api.malcore.io";
// const APIURL = "https://malcoreapi.internet20test.xyz";
var apiKey = null;
var scanUrl = null;
var runningMode = "realtime";
var isSafe = false;
var isEnabled = true;
var urlChecked = false;

window.addEventListener("DOMContentLoaded", function () {
  apiKey = localStorage.getItem("apiKey");
  runningMode = localStorage.getItem("runningMode") || "realtime";
  if (runningMode === "background") {
    backgroundButton.click();
  }
  if(localStorage.getItem("enableStatus") !== null) {
    isEnabled = localStorage.getItem("enableStatus") === "true" ? true : false;
  }

  if (apiKey) {
    requestUrlCheck();
  } else {
    showLoginContainer();
  }
});

// check url with urlcheck endpoint
async function requestUrlCheck() {
  try {
    showSpinner();

    // query is different from popup.js for the background.js
    // *** this is called twice bc url is already scanned in background.js. need to fix
    chrome.tabs.query({ active: true }, async function (tabs) {
      scanUrl = tabs[0].url;

      const response = await fetch(`${APIURL}/api/urlcheck`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apiKey: apiKey,
          source: "api-uploaded",
        },
        body: JSON.stringify({ 
          url: scanUrl, 
          // source: "firefox_extension",
          // mode: "background" 
        }),
      });

      const responseData = await response.json();
      const threat_level = responseData.data.data.threat_level;

      hideSpinner();
      showReportContainer(threat_level);
      urlChecked = true;
    });
  } catch (error) {
    hideSpinner();
  }
}

function handleLogin() {
  document.getElementById("err-auth").style.display = "none";

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  if (!username) {
    document.getElementById("err-username").style.display = "block";
    document.getElementById("username").focus();
    return;
  }

  if (!password) {
    document.getElementById("err-password").style.display = "block";
    document.getElementById("password").focus();
    return;
  }

  try {
    document.getElementById("btnSignin").disabled = true;
    showSpinner();

    var xhr = new XMLHttpRequest();
    xhr.open("POST", APIURL + "/auth/login", true);
    xhr.setRequestHeader("Content-Type", "application/json");

    var formData = JSON.stringify({
      email: username,
      password: password,
    });
    xhr.send(formData);

    xhr.onload = function () {
      if (xhr.status === 200) {
        var jsonData = JSON.parse(xhr.responseText);
        if (jsonData.success) {
          apiKey = jsonData.data.user.apiKey;
          var firstName = jsonData.data.user.firstName ? jsonData.data.user.firstName : "";
          var lastName = jsonData.data.user.lastName ? jsonData.data.user.lastName : "";
          var userName = firstName + " " + lastName;

          if (userName == " ") {
            userName = jsonData.data.user.email;
          }

          // Check if localStorage is supported
          window.localStorage.setItem("apiKey", apiKey);
          // send the api key to the background script
          chrome.storage.local.set({ apiKey: apiKey });

          requestUrlCheck();
        } else {
          var err_msg = jsonData.messages[0].message;
          document.getElementById("auth-err-label").innerHTML = err_msg;
          document.getElementById("err-auth").style.display = "block";
        }
      } else {
        document.getElementById("auth-err-label").innerHTML = "Cannot login to the server";
        document.getElementById("err-auth").style.display = "block";
      }
      document.getElementById("btnSignin").disabled = false;
      hideSpinner();
    };
  } catch (error) {
    document.getElementById("auth-err-label").innerHTML = "Cannot login to the server";
    document.getElementById("err-auth").style.display = "block";
    document.getElementById("btnSignin").disabled = false;
    hideSpinner();
  }
}
document.getElementById("btnSignin").addEventListener("click", handleLogin);

function handleLogout() {
  try {
    localStorage.removeItem("apiKey");
    localStorage.removeItem("runningMode");
    chrome.storage.local.remove("apiKey", function () {});
    chrome.storage.local.remove("runningMode", function () {});
    showLoginContainer();
  } catch (error) {}
}
document.getElementById("btnLogout").addEventListener("click", handleLogout);

function handleRegister() {
  window.open("https://app.malcore.io/register");
}
document.getElementById("btnRegister").addEventListener("click", handleRegister);

function handleResetPassword() {
  window.open("https://app.malcore.io/password");
}
document.getElementById("btnForgot").addEventListener("click", handleResetPassword);

function handleChangeUsername() {
  document.getElementById("err-username").style.display = "none";
}
document.getElementById("username").addEventListener("keydown", handleChangeUsername);

function handleChangePassword() {
  document.getElementById("err-password").style.display = "none";
}
document.getElementById("password").addEventListener("keydown", handleChangePassword);

function showSpinner() {
  document.getElementById("spinner-container").style.display = "block";
}

function hideSpinner() {
  document.getElementById("spinner-container").style.display = "none";
}

function showLoginContainer() {
  document.getElementById("login-wrapper").style.display = "flex";
  document.getElementById("report-wrapper").style.display = "none";
}

function showReportContainer(threat_level) {
  document.getElementById("login-wrapper").style.display = "none";
  document.getElementById("report-wrapper").style.display = "block";
  var urlCheckTitle = document.getElementById("url-check-title");
  var urlDangerIcon = document.getElementById("url-danger-icon");
  var urlSafeIcon = document.getElementById("url-safe-icon");

  if (threat_level.includes("SAFE")) {
    urlCheckTitle.innerHTML = "URL is safe";
    urlCheckTitle.classList.remove("url-danger");
    urlCheckTitle.classList.add("url-safe");
    urlDangerIcon.style.display = "none";
    urlSafeIcon.style.display = "inline";
    isSafe = true;
  } else {
    urlCheckTitle.innerHTML = "URL is dangerous";
    urlCheckTitle.classList.add("url-danger");
    urlCheckTitle.classList.remove("url-safe");
    urlDangerIcon.style.display = "inline";
    urlSafeIcon.style.display = "none";
    isSafe = false;
  }
}

document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();
});

document.getElementById("btnContinueYes").addEventListener("click", function () {
  chrome.runtime.sendMessage({ action: "continueBrowse" });
});

document.getElementById("btnContinueGoback").addEventListener("click", function () {
  chrome.runtime.sendMessage({ action: "backToPage" });
});

document.getElementById("btnPreContinueYes").addEventListener("click", function () {
  chrome.runtime.sendMessage({ action: "continueBrowse" });
});

document.getElementById("btnPreContinueGoback").addEventListener("click", function () {
  chrome.runtime.sendMessage({ action: "backToPage" });
});
