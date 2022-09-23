function videoScraper() {
  let videoUrl = document.querySelector("video")?.src || "";

  if (!videoUrl || videoUrl.startsWith("blob:")) {
    videoUrl = location.href;
  }

  fetch("http://localhost:44913/play-video", {
    body: videoUrl,
    method: "POST",
  });
}

chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: videoScraper,
  });
});
