console.log("✅ Background service worker loaded");
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log({ message, sender, sendResponse });
});
