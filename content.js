console.log("From Youtube");
const progressBar = document.querySelector(".ytp-progress-bar");
const currentTime = document.querySelector(".ytp-time-current");

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getTimestamp") {
    chrome.runtime.sendMessage("cgdpfmfmacgglmhbogfcggdodclmimhm", {
      data: currentTime.innerText,
    });
  }
});
