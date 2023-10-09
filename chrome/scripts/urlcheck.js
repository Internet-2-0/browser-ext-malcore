"use strict";
var btnAnalysisYes = document.getElementById("btnAnalysisYes");
var btnAnalysisNo = document.getElementById("btnAnalysisNo");
var urlcheckWapper = document.getElementById("urlcheck-wrapper");
var domainAnalysisWrapper = document.getElementById("domain-analysis-result-wrapper");
var domainError = document.getElementById("domain-error");

// check url with urlcheck endpoint
async function handleDomainAnalysis() {
  try {
    showSpinner();
    domainError.style.display = "none";

    if (scanUrl && apiKey) {
      if (localStorage.getItem("domainAnalysisData") !== null) {
        const historyAnalysisData = JSON.parse(localStorage.getItem("domainAnalysisData"));

        const savedData = historyAnalysisData.filter((item) => item.url == scanUrl);
        if (savedData.length) {
          hideSpinner();
          openFullHistory(savedData[0].timestamp);
          return;
        }
      }

      const response = await fetch(`${APIURL}/api/domain`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apiKey: apiKey,
          source: "api-uploaded",
        },
        body: JSON.stringify({ 
          domain: scanUrl, 
          source: "chrome_extension",
          mode: "realtime" 
        }),
      });

      const responseData = await response.json();
      generateAnalysisContent(responseData.data.data.results);

      saveResponse(scanUrl, responseData.data.data.results);

      hideSpinner();
      urlcheckWapper.style.display = "none";
      domainAnalysisWrapper.style.display = "flex";

      // tempcode
      // domainError.style.display = "block";
    } else {
      hideSpinner();
    }
  } catch (error) {
    hideSpinner();
    domainError.style.display = "block";
  }
}

// handle domain analysis
btnAnalysisYes.addEventListener("click", function () {
  handleDomainAnalysis();
});

// if url is safe, close the extension
btnAnalysisNo.addEventListener("click", function () {
  if (isSafe) {
    window.close();
  } else {
    urlcheckWapper.style.display = "none";
    domainAnalysisWrapper.style.display = "flex";
    document.getElementById("analysis-result").style.display = "none";
  }
});
