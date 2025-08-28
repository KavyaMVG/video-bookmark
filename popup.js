const addBookmarkBtn = document.querySelector(".add-bookmark-btn");
const bookmarkList = document.querySelector(".bookmark-list");

const bookmarks = [];

addBookmarkBtn.addEventListener("click", async () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];
    const url = new URL(activeTab.url);
    const videoId = url.searchParams.get("v");
    chrome.tabs.sendMessage(
      activeTab.id,
      { action: "getTimestamp" },
      (response) => {
        const time = response.time;
        const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/0.jpg`;
        const title = `${response.title.slice(0, 20)}...`;

        const bookmarkData = { time, videoId, thumbnailUrl, title };

        chrome.storage.local.get(["bookmarks"], (result) => {
          const bookmarks = result.bookmarks || [];
          const exists = bookmarks.some(
            (bm) => bm.videoId === videoId && bm.time === time
          );
          if (!exists) {
            bookmarks.push(bookmarkData);
            chrome.storage.local.set({ bookmarks });
            bookmarkUI(bookmarkData);
          }
        });
      }
    );
  });
});

const bookmarkUI = (data) => {
  const bookmarkItem = document.createElement("div");
  bookmarkItem.classList.add("bookmark-item");
  const imgDiv = document.createElement("div");
  imgDiv.classList.add("bookmark-img");
  let imgEle = document.createElement("img");
  imgEle.src = data.thumbnailUrl;
  imgDiv.append(imgEle);

  const timeDiv = document.createElement("div");
  timeDiv.classList.add("time");
  timeDiv.innerText = data.time || data;

  const container = document.createElement("div");
  container.classList.add("title-container");

  container.innerText = data.title;

  const controlsDiv = document.createElement("div");
  const playIcon = document.createElement("i");
  playIcon.classList.add("fa-solid", "fa-play");

  playIcon.addEventListener("click", () => {
    const videoUrl = `https://www.youtube.com/watch?v=${data.videoId}&t=${data.time}s`;

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      if (activeTab.url.includes(`v=${data.videoId}`)) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: "playFrom",
          time: data || data.time,
        });
      } else {
        chrome.tabs.update(activeTab.id, { url: videoUrl });
      }
    });
  });

  controlsDiv.appendChild(playIcon);

  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("btn", "delete-btn");

  const trashIcon = document.createElement("i");
  trashIcon.classList.add("fa-solid", "fa-trash");

  deleteBtn.appendChild(trashIcon);
  deleteBtn.addEventListener("click", () => {
    chrome.storage.local.get(["bookmarks"], (result) => {
      let bookmarks = result.bookmarks || [];

      bookmarks = bookmarks.filter((item) => item.time !== data.time);

      chrome.storage.local.set({ bookmarks }, () => {
        bookmarkItem.remove();
      });
    });
  });

  bookmarkItem.appendChild(imgDiv);
  bookmarkItem.appendChild(timeDiv);
  bookmarkItem.appendChild(container);
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
