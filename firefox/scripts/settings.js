"use strict";
var popoverTrigger = document.getElementById("popoverTrigger");
var popoverContent = document.getElementById("popoverContent");

var realtimeButton = document.getElementById("realtimeButton");
var backgroundButton = document.getElementById("backgroundButton");
var enableButton = document.getElementById("enableButton");

popoverTrigger.addEventListener("click", function () {
  if (popoverContent.style.display === "none") {
    popoverContent.style.display = "flex";
  } else {
    popoverContent.style.display = "none";
  }
});

document.addEventListener("click", function (event) {
  if (!popoverTrigger.contains(event.target) && !popoverContent.contains(event.target)) {
    popoverContent.style.display = "none";
  }
});

document.getElementById("btnSettings").addEventListener("click", function (event) {
  showSettings();
});

function showSettings() {
  popoverContent.style.display = "none";
  document.getElementById("settings-wrapper").style.display = "flex";
}

function showDisabledPage() {
  popoverContent.style.display = "none";
  document.getElementById("login-wrapper").style.display = "none";
  document.getElementById("report-wrapper").style.display = "none";
  document.getElementById("disble-wrapper").style.display = "flex";
}

document.getElementById("btnCloseSettings").addEventListener("click", function (event) {
  document.getElementById("settings-wrapper").style.display = "none";

  // check which page should display based on enabled settings
  if(!isEnabled){
    showDisabledPage();
  } else {
    document.getElementById("disble-wrapper").style.display = "none";
    if(apiKey) {
      if(urlChecked) {
        document.getElementById("report-wrapper").style.display = "block";
      } else {
        requestUrlCheck();
      }
    } else {
      showLoginContainer();
    }
  }
});

// save running mode update in the local storage
realtimeButton.addEventListener("change", function () { 

  if (realtimeButton.checked) {
    runningMode = "realtime";
    backgroundButton.checked = false;
  } else {
    runningMode = "background";
    backgroundButton.checked = true;
  }

  window.localStorage.setItem("runningMode", runningMode);
  chrome.storage.local.set({ runningMode: runningMode });
});

// save running mode update in the local storage
backgroundButton.addEventListener("change", function () { 

  if (backgroundButton.checked) {
    runningMode = "background";
    realtimeButton.checked = false;
  } else {
    runningMode = "realtime";
    realtimeButton.checked = true;
  }

  window.localStorage.setItem("runningMode", runningMode);
  chrome.storage.local.set({ runningMode: runningMode });
});

// save plugin enable status in the local storage
enableButton.addEventListener("change", function () {
  enableButton.classList.toggle("checked"); 

  isEnabled = enableButton.checked;

  window.localStorage.setItem("enableStatus", enableButton.checked);
  chrome.storage.local.set({ enableStatus: enableButton.checked });
});

