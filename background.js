console.log("✅ Background service worker loaded");
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  sendResponse({ message });
  return true;
});
