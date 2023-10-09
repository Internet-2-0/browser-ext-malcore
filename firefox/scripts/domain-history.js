// "use strict";

var domainHistoryWrapper = document.getElementById("domain-history-wrapper");
document.getElementById("btnHistory").addEventListener("click", function () {
  popoverContent.style.display = "none";
  domainHistoryWrapper.style.display = "flex";
  getDomainAnalysisHistory();
});

document.getElementById("close-history-details").addEventListener("click", function () {
  domainHistoryWrapper.style.display = "none";
});

/**
 * @description get the recent 5 domain history results from local storage and display it in the table
 */
function getDomainAnalysisHistory() {
  const historyTable = document.getElementById("table-history-full-content");
  let tableData = ``;
  if (localStorage.getItem("domainAnalysisData") !== null) {
    const historyAnalysisData = JSON.parse(localStorage.getItem("domainAnalysisData"));
    historyAnalysisData.forEach((data) => {
      const parseDate = new Date(data.timestamp).toLocaleDateString(undefined, { month: "2-digit", day: "2-digit" });
      // <td class="hr-date view-full-analysis" data-id="${data.timestamp}">${parseDate}</td>
      const row = `
        <tr id="tr${data.timestamp}">
          <td class="view-full-analysis" data-id="${data.timestamp}">${data.url}</td>
          <td class="hr-delete" data-id="${data.timestamp}">
            <svg onclick="removeHistoryItem(${data.timestamp})" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="red"
              class="bi bi-trash-fill" viewBox="0 0 16 16">
              <path
                d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z" />
            </svg>
          </td>
        </tr>
      `;
      tableData += row;
    });
    historyTable.innerHTML = tableData;

    var historyElements = document.querySelectorAll(".view-full-analysis");
    for (let i = 0; i < historyElements.length; i++) {
      const element = historyElements[i];
      element.addEventListener("click", function () {
        const timestamp = this.getAttribute("data-id");
        openFullHistory(timestamp);
      });
    }

    var hrDeleteButtons = document.querySelectorAll(".hr-delete");
    for (let i = 0; i < hrDeleteButtons.length; i++) {
      const element = hrDeleteButtons[i];
      element.addEventListener("click", function () {
        const timestamp = this.getAttribute("data-id");
        removeHistoryItem(timestamp);
      });
    }
  }
}

/**
 * @description get the saved domain analysis data from local storage and display it in the full analysis modal.
 * @param id timestamp value to get the selected response data from local storage.
 */
function openFullHistory(id) {
  try {
    // get data from local storage
    if (localStorage.getItem("domainAnalysisData") !== null) {
      const historyAnalysisData = JSON.parse(localStorage.getItem("domainAnalysisData"));

      const savedData = historyAnalysisData.filter((item) => item.timestamp == id);
      if (savedData.length) {
        generateAnalysisContent(savedData[0].data);
        domainError.style.display = "none";
        urlcheckWapper.style.display = "none";
        domainHistoryWrapper.style.display = "none";

        domainAnalysisWrapper.style.display = "flex";
        domainAnalysisDetails.style.display = "flex";
      }
    }
  } catch (error) {
    console.log(error);
  }
}

/**
 * @description delete the selected history data from local storage
 * @param id timestamp value to get the selected response data from local storage.
 */
function removeHistoryItem(timestamp) {
  try {
    if (localStorage.getItem("domainAnalysisData") !== null) {
      const historyAnalysisData = JSON.parse(localStorage.getItem("domainAnalysisData"));

      const index = historyAnalysisData.findIndex(function (element) {
        return element.timestamp == timestamp;
      });
      if (index !== -1) {
        historyAnalysisData.splice(index, 1);
        localStorage.setItem("domainAnalysisData", JSON.stringify(historyAnalysisData));
        chrome.storage.local.set({ domainAnalysisData: JSON.stringify(historyAnalysisData) });
        document.getElementById(`tr${timestamp}`).style.display = "none";
      }
    }
  } catch (error) {}
}
