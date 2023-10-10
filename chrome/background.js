const APIURL = "https://api.malcore.io";
// const APIURL = "https://malcoreapi.internet20test.xyz";
// const APIURL = "http://localhost:3000";

var currentUrl = null;
var currentTabId = null;
var windowId = null;
var browserVersion = null;

/**
 * @description check the url when chrome tab is activated.
 * @description block the web page content while check the url.
 */
chrome.tabs.onActivated.addListener(async function (activeInfo) {
  try {
    const runningMode = await getRunningModeFromLocalStorage();
    const enableStatus = await getEnableStatusFromLocalStorage();
    browserVersion = /Chrome\/([0-9.]+)/.exec(navigator.userAgent)[1];

    if (enableStatus && runningMode === "background") {
      chrome.tabs.get(activeInfo.tabId, async function (tab) {
        try {
          currentUrl = tab.url;
          currentTabId = tab.id;
          // should check the valid urls
          if (currentTabId && (currentUrl.includes("http://") || currentUrl.includes("https://"))) {
            blockContent(currentTabId, false);
            checkUrl(currentUrl, currentTabId);
          }
        } catch (error) {
          console.log(error)
        }
      });
    }
    return;
  } catch (error) {
    console.log(error)
  }
});

function setBlockContent() {
  document.documentElement.innerHTML = ` 
    <body>

    <div class="wrapper">
      <div>
        <div id="alert-icon"></div>
        <div>
          <h1>Deceptive site ahead</h1>
          <p>Malcore WebProbe has identified this website as potentially malicious or suspicious. Avoid sharing any personal or sensitive information on this site to protect your privacy and devices.</p>
            <p>Attackers may use this site for malware installation, phishing, or revealing personal information.</p> 
        </div> 
        <button id="btnGoback" onclick="window.history.back();" >Go back</button>
    </div>

    <style>
      body {
        font-family: 'Segoe UI', Tahoma, sans-serif;
        font-size: 75%;
        background: #d93025;
        color: white;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 20px;
        padding-top: 80px;
      } 
      #alert-icon {
        background-image: -webkit-image-set( url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAMAAABiM0N1AAAA+VBMVEUAAAD////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////9/f3////9/f36+vr8/Pz7+/v7+/v7+/v7+/v////r6+vn5+fk5OT5+fn19fX4+Pju7u7v7+/o6Ojx8fH09PTy8vLz8/Pj4+P39/fm5ubp6eni4uL8/Pzw8PDt7e329vbs7Ozg4ODh4eHe3t7l5eX6+vrd3d3q6urf39/c3NzbRDf7+/vb29vW1tbZ2dk+D9arAAAALXRSTlMA/eIxBfACHj3YwhYJDyfOtfr2WHObgEqpjellgY6c6mZLV3L2qKjOZemN+rUv7NpAAAACcUlEQVR4Xu2U53baQBQGAxiMaQZT3Wt6rnql9uKW9v4Pk5XEspG4WFmJ/GMeYM635cy7/8yePXv23N7uxnNwdHSwE1ENoLYLTz4NkM7vQHQFhKv4nlQCCIlUbFEOXHJxPVVYUY3nKSSpKFmIJbqANRdxPIcnTHRyGEPUAga0onuy4CMb1ZM5Bh/HmYiiGwhwE81TvIYA18VIokvY4DKKp1SBDSqlCKIyIJT5PU1AafL3FVC4q1uDLdS4+4rCXd06bKXO21fKdxcNKFzVzUFQ9KoDJRehr0z0tBgBpcrfVyZavAxM7uo2ABHNO8s2NTW4+8pEs4HUMxS+6rYAEZFBYl+Y8FQ3C5hoIImGMNVVvLp4X1FRZ2n0BU035X+u7jmgomWv/zzWR23lB7ich/b1DBeRQVNNty1FHYLDWVh1TwEXic4gs6105UfPdMrd1/HCffrnqTayrYkqP3qmSom7r9q84xyMDLIUx7Mylfn7OvIGmbYyUYmGbmry99UWnYOZ7sFc5OHb1b2HLbS9QV1vED3dPX9fQXFuWiEeF9kzpfMcfaUZkbyn9+bQTfXwvm4W0iA3RNdQUyIV1lekkDOhSx3sdGh17+At0ctA0plDpr/gLqSvSI+kXt8mAj9DVl20r3hGBM0iOwKmBtZXHOPX79fFXCJ/Ure79Gxr40Owuu9hK8LPp1mnR7JmWuv7ZsM+oH3FGZObFoWx3iY/Ul1J2LVn0b7i6B2RZM1WumwL833MoH3FMQ1hPHIGsadnvk94X3EsctPE4xK8p89FvK84ExIRuoUa6Pt98fU1DJUMosj+3/S15OtrGOsB9LnYqm+e5w+es4JAhYQDdgAAAABJRU5ErkJggg==) 1x, url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJAAAACQCAMAAADQmBKKAAABPlBMVEUAAAD////////////////////////////////6+vr7+/v7+/v7+/v9/f36+vr7+/v7+/v////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////9/f3////////////8/Pz////5+fn////////6+vr////////8/Pz7+/v7+/v////k5OTh4eHf39/e3t7g4OD6+vrbRDf5+fnv7+/x8fH09PTY2Njc3Nz39/fq6ur4+Pjz8/Pn5+f7+/vZ2dnW1tbt7e3U1NTV1dXl5eXr6+v19fXy8vLs7Oz29vba2trb29vo6Ojm5ubu7u7d3d38/Pzp6enj4+Pi4uLw8PD///+BQ30nAAAAQHRSTlMAHhYFDzEJAifiwvb98M76PdjqtoGpZll0c46qj1icTJ1KS42A6WWb2WdadYK1cvCb/cJXV+KA9qioPc5l6Y36uRjySgAABXVJREFUeF7s1kuKwlAUBNDS+JtqggkkmODIH4gPRIgD11P730BDI6HV260Z1Wu4ZxUH/4tzzjnnnHPOOeecq2tEJdlsEsRkT+4RkeGRPA4Rj4YkG0RjfCLJ0xixCPwWEIkd73aIwuTMu/MEMTiwc4AeBhd2LgPolfyhhFzLBy3Eplc+uE6hteWTLaRGCz5ZjKBU8UUFodmNL24z6KQ0pJCpaaohksxpmifQKGhjIXurSbbZhr9qRG81yTYbaJJtNuefcsFbTbLNZnwjE7zVINtsybdK4VttreytHdlml/zIUvTWjmyzFT9USd7akW02pUm22TV7WOveKttswV4K1Vtlm12xp5XmrbLNBvYWhG+15YK3qjab0STb7Fcv5tmcOBKE4Q2Xc7KrTJW3yhs/2RsuZwvBjsQShPd0JxCyJVmA5v//getpgYextLSYKdHf+PbUO93No36Ht77eqHCvNnvASaBLp4rooClvpYGurpx92Sx6Kw3Uv873ZbOHvA7Qtd12m7ZZ6a00UN+225a7F5tt8XpA7Y61rJi1ViPeSgPZ7XZnuVh4zdsseisNhAEtzgOvaZt9yGsCdSwLeJKk16DNSm+lgSCghQAax9NGbfaI1wQSD7YIgnE8H0a3iY4a8FYSyMKAxgJoMqBs1txbaSDs6AR5Zv6Asllzb6WBIKAkiefzCQA5A8Jmjb2VBtoMKHXcUSM2e8x3ADoPAAh4Jr7v5G7IVKLjhr21DHS+DshP0xyAel3CZk29lQa6ebAUeLxe74KwWTNvpYGSFVDqOK4LPFF0QdisibfSQBsdjQFNo9EoI2zWxFtpINiJw+Fs5hcBTaeDwaibETar76000GZAnggIeLqSyNxmD/luQOM4LngceDBP8ACQSnTY+L111geRtqxlMfLDAsiFkV8H1GWSyNBmW7xO+eiJyo7O87B4MCaA1Ixazd9bUwgIgFYd7a8Dwo4GIqYQgc02f291kEcd+YJHVmZusye8djkAlKxHHnjEiEUIVOTDFKKTPdxbXdnRjghI7GjgUSqTNmvurTRRkMQAtBp53IkjJuNRiY72cW8NiwdLHdyJgmcdkGTKTGz2Gd+xPOhoGVAUjZgCo8zas33cW3lviFqWhyF2ND7YbaZM2qy5t9JEs8ITPexoJlFksUzTZo+5Tk3FiIWh7KAKpEzarLm30v/2ckczlYXdsGU6NvuY6wFdJjn+y4OXKR3EytP/WMNbNYD6Y9Ag8WCs/F4yo51t9oBrAoGJzJV/+WokJDow9NbaF7QJAKkNpMyb9KPfjL2VBrLtznLpQ0DlYNTKdrHZp1wfqA0iEjhMYsislN9I9LSmtz7RBxLmGCSxW9k9pYye1LPZR9wACNQagIbutgaSfvTI3Fvp+xDwgDd6ZERAVM9mT7kB0HIZJIn4Ekp7W+KRRKfG3kqfYyAg4HHy6ZZwpB+daHgrVfG///3z5u1l38aODsbFrcH1opJ7VPgRabNnfPeaI8+13REdPV4FBA4CRkQyZWekt2rU8M3lVREQns9AG4XmgxLRjc0+v0d4q1ZNVjznNw8WgsTiviaRXmh5K/19jzsaL+biwVwhsbeXdLUfffa+nrfSX9P4rYjnRcdFBWGSQ+KUf3/ybp7vuX6lFp7woaN9eDBxiUEIwCDH/wfCWzUrXwTrgLCj14rGuhTSxx8Q3qpZLnSQ4MlXHS2He8u+xvqJ8FbdCmEFTXxcQdFAJkPP2qfVNvsLNy1vjg9WBKQsQMKPfiW8Vbt6SkdLFkb50VeEt2rX1MGA4MHUlhkRfvTFh4S3alcEHaSczmr20R+Et+rXCDu63DJsux/9+R7hrQZE0NFEHlVh/UV4q0F1B6zSEdlWF/lSsdn/AccLgKctjBheAAAAAElFTkSuQmCC) 2x);
        height: 80px;
        background-repeat: no-repeat;
      }
      h1 {
        font-size: 1.6rem;
        font-weight: 500;
      }
      p {
        font-size: 1rem;
      }
      .wrapper {
        max-width: 666px;
      }
      #btnGoback {
        background: white;
        border-color: white;
        color: #d93025;
        border: 0;
        border-radius: 4px;
        box-sizing: border-box;
        cursor: pointer;
        float: right;
        font-size: .875rem;
        margin: 0;
        padding: 8px 16px;
        transition: box-shadow 150ms cubic-bezier(0.4, 0, 0.2, 1);
        user-select: none;
      }
      #btnGoback:hover {
        background: #fce8e6;
      }
    </style>
  </body>`;
}

/**
 *
 * @description remove all contents to block the page.
 * @param tabId tab id that is blocked
 */
function blockContent(tabId, contentData = false) {
  try {
    if (contentData) {
      chrome.scripting.executeScript({
        target: { tabId: tabId, allFrames: true },
        func: setBlockContent
      });
    } else {
      chrome.scripting.executeScript({
        target: { tabId: tabId, allFrames: true },
        func: () => {
          document.documentElement.innerHTML = "";
        },
      });
    }
  } catch (error) {}
}

/**
 *
 * @description reload the page to activate the content
 * @param tabId tab id that is activated
 */
function activateContent(tabId) {
  if (windowId) {
    try {
      chrome.windows.remove(windowId, function () {
        chrome.tabs.query({ active: true }, (tabs) => {
          chrome.scripting.executeScript({
            target: { tabId: tabs[0].id, allFrames: true },
            func: () => {
              window.location.reload();
            },
          });
        });
      });
    } catch (error) {}
  } else {
    reloadPage(tabId);
  }
}

/**
 * @description back to previous page if the current page is opened from another one
 */
function backToPage() {
  try {
    if (windowId) {
      chrome.windows.remove(windowId, function () {
        chrome.tabs.query({ active: true }, async function (tabs) {
          chrome.scripting.executeScript({
            target: { tabId: tabs[0].id, allFrames: true },
            func: () => {
              window.history.back();
            },
          });
        });
      });
    }
  } catch (error) {}
}

/**
 * @description reload the active page
 */
function reloadPage(tabId) {
  try {
    chrome.scripting.executeScript({
      target: { tabId: tabId, allFrames: true },
      func: () => {
        window.location.reload();
      },
    });
  } catch (error) {}
}

/**
 *
 * @description check the url with urlcheck endpoint
 * @param url web page url to check
 * @param tabId current tab id that is used to activate the page
 * @returns threat_level string
 */
async function checkUrl(url, tabId) {
  try {
    const apiKey = await getApiKeyFromLocalStorage();
    if (!apiKey || !url) return;

    const response = await fetch(`${APIURL}/api/urlcheck`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apiKey: apiKey,
        source: "api-uploaded",
      },
      body: JSON.stringify({ 
        url: url,
        source: "chrome_extension",
        mode: "background",
        version: browserVersion 
      }),
    });
    const responseData = await response.json();

    const threat_level = responseData.data.data.threat_level;

    // // tempcode
    // blockContent(tabId, true);
    // openPopup();
    // // tempcode

    // enable it
    if (!threat_level.includes("SAFE")) {
      blockContent(tabId, true);
      openPopup();
    } else {
      activateContent(tabId);
    }
  } catch (error) {
    activateContent(tabId);
  }
}

/**
 *
 * @description get malcore api key from local storage
 * @returns api key
 */
function getApiKeyFromLocalStorage() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(null, function (result) {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(result.apiKey);
      }
    });
  });
}

/**
 *
 * @description get running mode from local storage
 * @returns runningMode string
 */
function getRunningModeFromLocalStorage() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(null, function (result) {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(result.runningMode);
      }
    });
  });
}

/**
 *
 * @description get extension enable status from local storage
 * @returns enableStatus string
 */
function getEnableStatusFromLocalStorage() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(null, function (result) {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(result.enableStatus);
      }
    });
  });
}

/**
 *
 * @description get action from background.html and run the function
 * @description used for continue browse and back to page
 */
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "continueBrowse") {
    activateContent(currentTabId);
  } else if (message.action === "backToPage") {
    backToPage();
  }
});

/**
 *
 * @description create a new web page with background.html which is same as extension popup
 */
function openPopup() {
  chrome.windows.create(
    {
      url: chrome.runtime.getURL("background.html"),
      type: "popup",
      width: 380,
      height: 620,
      left: 10,
      top: 0,
    },
    function (window) {
      windowId = window.id;
    }
  );
}
