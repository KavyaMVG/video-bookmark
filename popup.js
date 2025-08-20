const addBookmarkBtn = document.querySelector(".add-bookmark-btn");
const bookmarkList = document.querySelector(".bookmark-list");

addBookmarkBtn.addEventListener("click", async () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, { action: "getTimestamp" });
  });
});

const bookmarks = [];
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  chrome.storage.local.get(["bookmarks"], (result) => {
    const bookmarks = result.bookmarks || [];
    bookmarks.push(request.data);

    chrome.storage.local.set({ bookmarks });
    bookmarkUI(request.data);
  });
});

const bookmarkUI = (data) => {
  const bookmarkItem = document.createElement("div");
  bookmarkItem.classList.add("bookmark-item");

  const imgDiv = document.createElement("div");
  imgDiv.classList.add("bookmark-img");
  let imgEle = document.createElement("img");
  imgEle.src = "./assets/vintageBuilding.jpg";
  imgEle.width = "50";
  imgEle.height = "50";
  imgDiv.append(imgEle);

  const timeDiv = document.createElement("div");
  timeDiv.innerText = data;

  const controlsDiv = document.createElement("div");
  const playIcon = document.createElement("i");
  playIcon.classList.add("fa-solid", "fa-play");
  const pauseIcon = document.createElement("i");
  pauseIcon.classList.add("fa-solid", "fa-pause");
  controlsDiv.appendChild(playIcon);
  controlsDiv.appendChild(pauseIcon);

  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("btn", "delete-btn");

  const trashIcon = document.createElement("i");
  trashIcon.classList.add("fa-solid", "fa-trash");

  deleteBtn.appendChild(trashIcon);

  bookmarkItem.appendChild(imgDiv);
  bookmarkItem.appendChild(timeDiv);
  bookmarkItem.appendChild(controlsDiv);
  bookmarkItem.appendChild(deleteBtn);

  bookmarkList.appendChild(bookmarkItem);
};

document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.local.get(["bookmarks"], (result) => {
    const bookmarks = result.bookmarks || [];
    bookmarks.forEach((item) => {
      bookmarkUI(item);
    });
  });
});
