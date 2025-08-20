const addBookmarkBtn = document.querySelector(".add-bookmark-btn");
console.log();
addBookmarkBtn.addEventListener("click", async () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];
    console.log("ca", activeTab);
    chrome.tabs.sendMessage(activeTab.id, { action: "getTimestamp" });
  });
});
