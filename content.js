console.log("From Youtube");
const progressBar = document.querySelector(".ytp-progress-bar");
const currentTime = document.querySelector(".ytp-time-current");

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log({ request });
  console.log({ currentTime });
  if (request.action === "getTimestamp") {
    console.log({ currentTime: currentTime.innerText });
    chrome.runtime.sendMessage("cgdpfmfmacgglmhbogfcggdodclmimhm", {
      data: currentTime.innerText,
    });
  }
  return true;
});
