console.log("From Youtube");
const progressBar = document.querySelector(".ytp-progress-bar");
const currentTime = document.querySelector(".ytp-time-current");
const seconds = parseInt(progressBar.getAttribute("aria-valuenow"), 10);
const video = document.querySelector("video");

const formatTime = (time) => {
  let minutes = Math.floor(time / 60);
  let seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

const toSeconds = (time) => {
  let totalSeconds = 0;
  let timeSplit = time.split(":");
  if (timeSplit.length === 2) {
    let [minute, seconds] = timeSplit;
    totalSeconds += Number(minute) * 60 + Number(seconds);
  } else if (timeSplit.length === 3) {
    let [hour, minute, seconds] = timeSplit;
    totalSeconds +=
      Number(hour) * 60 * 60 + Number(minute) * 60 + Number(seconds);
  }
  return totalSeconds;
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getTimestamp") {
    chrome.runtime.sendMessage("cgdpfmfmacgglmhbogfcggdodclmimhm", {
      data: currentTime.innerText,
    });
  }
  if (request.action === "playFrom") {
    console.log("fjgefj", toSeconds(request.time));
    video.currentTime = toSeconds(request.time);
    video.play();
  }
});
