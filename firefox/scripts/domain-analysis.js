"use strict";
var domainAnalysisDetails = document.getElementById("domain-analysis-full-wrapper");
var btnContinueGoback = document.getElementById("btnContinueGoback");

document.getElementById("button-domain-view").addEventListener("click", function () {
  domainAnalysisDetails.style.display = "flex";
});

document.getElementById("close-domain-details").addEventListener("click", function () {
  domainAnalysisDetails.style.display = "none";
});

/**
 *
 * @description generate a html content with results data
 * @param results api/domain endpoint result. data.data.results
 */
function generateAnalysisContent(results) {
  try {
    let discovered_ip_addresses = results?.domain_information?.discovered_ip_addresses;

    let discovered_ip_addresses_text = discovered_ip_addresses.slice(0, 5).map((ip) => `<div class="ipaddress-item">${ip}</div>`);
    discovered_ip_addresses_text = discovered_ip_addresses_text.join("");

    var ipaddress_content = ` 
    ${discovered_ip_addresses_text} 
    <div class="ipaddress-item">...</div> 
    `;
    document.getElementById("ipaddress-container").innerHTML = ipaddress_content;
  } catch (error) {
    var ipaddress_content = ` 
      <div class="ipaddress-item">Not found ip address</div> 
    `;
    document.getElementById("ipaddress-container").innerHTML = ipaddress_content;
  }

  generateFullAnalysisContent(results);
}

/**
 *
 * @description generate the full analysis html content with results data
 * @param results api/domain endpoint result. data.data.results
 */
function generateFullAnalysisContent(results) {
  try {
    let discovered_ip_addresses = results?.domain_information?.discovered_ip_addresses;
    let determined_ip_addresses = results?.domain_information?.all_results?.determined_ip_addresses;
    let subdomains = results?.domain_information?.all_results?.subdomains;

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi dropdown-icon bi-chevron-down" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
      </svg>`;

    let discovered_ip_addresses_all = "";
    if (discovered_ip_addresses && discovered_ip_addresses.length) {
      discovered_ip_addresses_all = discovered_ip_addresses.map((ip) => `<div class="ipaddress-item">${ip}</div>`);
      discovered_ip_addresses_all = discovered_ip_addresses_all.join("");
      discovered_ip_addresses_all = `<div class="panel-header mt-2">
          <label class="domain-report-label">Discovered IP Address</label>${svg}</h2>
        </div>
        <div class="ipaddress-container panel-content"> 
          ${discovered_ip_addresses_all}
        </div>
        `;
    }

    let determined_ip_addresses_all = "";
    if (determined_ip_addresses && determined_ip_addresses.length) {
      determined_ip_addresses_all = determined_ip_addresses.map((ip) => `<div class="ipaddress-item">${ip}</div>`);
      determined_ip_addresses_all = determined_ip_addresses_all.join("");
      determined_ip_addresses_all = `<div class="panel-header mt-2">
        <label class="domain-report-label ">Determined IP Address</label>${svg}</h2>
      </div>
      <div class="ipaddress-container panel-content"> 
        ${determined_ip_addresses_all}
      </div>`;
    }

    let subdomains_all = "";
    if (subdomains && subdomains.length) {
      subdomains_all = subdomains.map((ip) => `<div class="ipaddress-item">${ip}</div>`);
      subdomains_all = subdomains_all.join("");
      subdomains_all = `<div class="panel-header mt-2">
        <label class="domain-report-label ">Subdomains</label>${svg}</h2>
      </div>
      <div class="ipaddress-container panel-content"> 
        ${subdomains_all}
      </div>`;
    }

    var ip_information = results?.domain_information?.ip_information;
    var historical_dns_info_array = [];
    var malware_http_array = [];
    var malware_dns_array = [];
    var nsglue_array = [];

    Object.entries(ip_information).map(([key, val]) => {
      if (val.historical_dns_info.length) {
        historical_dns_info_array.push(val.historical_dns_info);
      }
      if (val.malware_http.length) {
        malware_http_array.push(val.malware_http);
      }
      if (val.malware_dns.length) {
        malware_dns_array.push(val.malware_dns);
      }
      if (val.nsglue.length) {
        nsglue_array.push(val.nsglue);
      }
    });

    var historical_dns_info_all = "";
    for (let index = 0; index < historical_dns_info_array.length; index++) {
      const history_array = historical_dns_info_array[index];

      for (let j = 0; j < history_array.length; j++) {
        const history = history_array[j];
        historical_dns_info_all += '<div class="information-item">';
        if (history.value_ip) historical_dns_info_all += `<div class="ipaddress-item"><span>VALUE IP</span>: ${history.value_ip}</div>`;
        if (history.domain) historical_dns_info_all += `<div class="ipaddress-item"><span>DOMAIN</span>: ${history.domain}</div>`;
        if (history.type) historical_dns_info_all += `<div class="ipaddress-item"><span>TYPE</span>: ${history.type}</div>`;
        if (history.qname) historical_dns_info_all += `<div class="ipaddress-item"><span>QNAME</span>: ${history.qname}</div>`;
        if (history.value) historical_dns_info_all += `<div class="ipaddress-item"><span>VALUE</span>: ${history.value}</div>`;
        if (history.country_iso_code)
          historical_dns_info_all += `<div class="ipaddress-item"><span>COUNTRY ISO CODE</span>: ${history.geoip?.country_iso_code}</div>`;
        if (history.date) historical_dns_info_all += `<div class="ipaddress-item"><span>DATE</span>: ${history.date}</div>`;
        if (history.qtype) historical_dns_info_all += `<div class="ipaddress-item"><span>QTYPE</span>: ${history.qtype}</div>`;
        if (history.last_seen) historical_dns_info_all += `<div class="ipaddress-item"><span>LAST SEEN</span>: ${history.last_seen}</div>`;
        historical_dns_info_all += "</div>";
      }
    }
    if (historical_dns_info_all) {
      historical_dns_info_all = `<div class="panel-header mt-2">
        <label class="domain-report-label ">HISTORICAL DNS INFO</label>${svg}</h2>
      </div>
      <div class="ipaddress-container panel-content"> 
        ${historical_dns_info_all}
      </div>`;
    }

    var malware_dns_all = "";
    for (let index = 0; index < malware_dns_array.length; index++) {
      const malware_array = malware_dns_array[index];
      for (let j = 0; j < malware_array.length; j++) {
        const history = malware_array[j];
        malware_dns_all += '<div class="information-item">';
        if (history.hname) malware_dns_all += `<div class="ipaddress-item"><span>HNAME</span>: ${history.hname}</div>`;
        if (history.iplog) malware_dns_all += `<div class="ipaddress-item"><span>IPLOG</span>: ${JSON.stringify(history.iplog)}</div>`;
        if (history.hash) malware_dns_all += `<div class="ipaddress-item"><span>HASH</span>: ${history.hash}</div>`;
        if (history.first_ts) malware_dns_all += `<div class="ipaddress-item"><span>FIRST TS</span>: ${history.first_ts}</div>`;
        if (history.last_ts) malware_dns_all += `<div class="ipaddress-item"><span>LAST TS</span>: ${history.last_ts}</div>`;
        malware_dns_all += "</div>";
      }
    }
    if (malware_dns_all) {
      malware_dns_all = `<div class="panel-header mt-2">
        <label class="domain-report-label ">MALWARE DNS</label>${svg}</h2>
      </div>
      <div class="ipaddress-container panel-content"> 
        ${malware_dns_all}
      </div>`;
    }

    var nsglue_all = "";
    for (let index = 0; index < nsglue_array.length; index++) {
      const malware_array = nsglue_array[index];
      for (let j = 0; j < malware_array.length; j++) {
        const history = malware_array[j];
        nsglue_all += '<div class="information-item">';
        if (history.ip) nsglue_all += `<div class="ipaddress-item"><span>IP</span>: ${history.ip}</div>`;
        if (history.hname) nsglue_all += `<div class="ipaddress-item"><span>HNAME</span>: ${history.hname}</div>`;
        if (history.updated_ts) nsglue_all += `<div class="ipaddress-item"><span>UPDATED TS</span>: ${history.updated_ts}</div>`;
        if (history.first_ts) nsglue_all += `<div class="ipaddress-item"><span>FIRST TS</span>: ${history.first_ts}</div>`;
        if (history.last_ts) nsglue_all += `<div class="ipaddress-item"><span>LAST TS</span>: ${history.last_ts}</div>`;
        nsglue_all += "</div>";
      }
    }
    if (nsglue_all) {
      nsglue_all = `<div class="panel-header mt-2">
        <label class="domain-report-label ">NSGLUE</label>${svg}</h2>
      </div>
      <div class="ipaddress-container panel-content"> 
        ${nsglue_all}
      </div>`;
    }

    var full_content = `
      <div class="content"> 
        ${discovered_ip_addresses_all}  
        ${determined_ip_addresses_all} 
        ${subdomains_all} 
        ${historical_dns_info_all}  
        ${malware_dns_all}  
        ${nsglue_all} 
      </div>
    `;
    document.getElementById("domain-analysis-full-content").innerHTML = full_content;

    const panelHeaders = document.querySelectorAll(".panel-header");

    panelHeaders.forEach((panelHeader) => {
      panelHeader.addEventListener("click", function () {
        const panelContent = this.nextElementSibling;
        panelContent.classList.toggle("panel-content-show");

        const dropdownIcon = this.querySelector(".dropdown-icon");
        dropdownIcon.style.transform = panelContent.classList.contains("panel-content-show") ? "rotateX(180deg)" : "rotateX(0)";
      });
    });
  } catch (error) {
    var full_content = `
      <div class="content">
        <label class="domain-report-label">Cannot display data</label> 
      </div>
    `;
    document.getElementById("domain-analysis-full-content").innerHTML = full_content;
  }
}

/**
 * @description Save API response data in the local storage
 * @param apiResponseData responseData.data.data.results
 * @param url scanned website url
 */
function saveResponse(url, apiResponseData) {
  // Check if the local storage already contains any data
  if (localStorage.getItem("domainAnalysisData") !== null) {
    // Retrieve the existing data from local storage and parse it into an array
    const historyAnalysisData = JSON.parse(localStorage.getItem("domainAnalysisData"));

    const urlExist = historyAnalysisData.some((item) => item.url === url);
    if (!urlExist) {
      // Add the new API response data and the current timestamp to the array
      historyAnalysisData.push({
        data: apiResponseData,
        url: url,
        timestamp: new Date().getTime(),
      });

      // Sort the array based on the timestamps in descending order
      historyAnalysisData.sort((a, b) => b.timestamp - a.timestamp);

      // Truncate the array to keep only the first 5 elements
      const saveData = historyAnalysisData.slice(0, 5);

      // Convert the array back to a string and store it in the local storage
      localStorage.setItem("domainAnalysisData", JSON.stringify(saveData));
      chrome.storage.local.set({ domainAnalysisData: JSON.stringify(saveData) });
    }
  } else {
    // If local storage is empty, create a new array with the current API response data and timestamp
    const newData = [
      {
        data: apiResponseData,
        timestamp: new Date().getTime(),
      },
    ];

    localStorage.setItem("domainAnalysisData", JSON.stringify(newData));
    chrome.storage.local.set({ domainAnalysisData: JSON.stringify(saveData) });
  }
}
