const getVideoAndSend = () => {
  let videoUrl = document.querySelector("video")?.src || "";

  if (videoUrl.startsWith("blob:")) {
    videoUrl = location.href;
  } else if (!videoUrl) {
    window.alert("Video not found.");
  }

  if (videoUrl) {
    fetch("http://localhost:44913/play-video", {
      body: videoUrl,
      method: "POST",
    })
      .then((response) => {
        console.log("Video sent to Metaverse!");
      })
      .catch((error) => {
        navigator.clipboard.writeText(videoUrl).then(() => {
          console.error("Failed to send video to Metaverse: ", error);
          window.alert(
            "Failed to send video to Metaverse.\nCopied to clipboard instead."
          );
        });
      });
  }
};

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.msg == "sendToMetaverse") {
    chrome.tabs.query(
      {
        lastFocusedWindow: true,
        active: true,
      },
      function (tabs) {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          function: getVideoAndSend,
        });
      }
    );
  }
});
