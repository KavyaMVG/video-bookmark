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

  //   const pauseIcon = document.createElement("i");
  //   pauseIcon.classList.add("fa-solid", "fa-pause");
  //   pauseIcon.style.display = "none";

  playIcon.addEventListener("click", () => {
    // playIcon.style.display = "none";
    // pauseIcon.style.display = "inline-block";

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: "playFrom",
        time: data,
      });
    });
  });

  //   pauseIcon.addEventListener("click", () => {
  //     pauseIcon.style.display = "none";
  //     playIcon.style.display = "inline-block";
  //   });

  controlsDiv.appendChild(playIcon);
  //   controlsDiv.appendChild(pauseIcon);

  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("btn", "delete-btn");

  const trashIcon = document.createElement("i");
  trashIcon.classList.add("fa-solid", "fa-trash");

  deleteBtn.appendChild(trashIcon);
  deleteBtn.addEventListener("click", () => {
    chrome.storage.local.get(["bookmarks"], (result) => {
      let bookmarks = result.bookmarks || [];

      bookmarks = bookmarks.filter((item) => item !== data);

      chrome.storage.local.set({ bookmarks }, () => {
        bookmarkItem.remove();
      });
    });
  });

  //   playIcon.addEventListener("click", () => {
  //     console.log("time", data);
  //   });

  bookmarkItem.appendChild(imgDiv);
  bookmarkItem.appendChild(timeDiv);
  bookmarkItem.appendChild(controlsDiv);
  bookmarkItem.appendChild(deleteBtn);

  bookmarkList.appendChild(bookmarkItem);
};

document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.local.get(["bookmarks"], (result) => {
    console.log({ result });
    const bookmarks = result.bookmarks || [];
    bookmarks.forEach((item) => {
      bookmarkUI(item);
    });
  });
});
