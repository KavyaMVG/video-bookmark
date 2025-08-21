chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  sendResponse({ message });
  return true;
});
