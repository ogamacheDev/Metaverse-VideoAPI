const getVideoAndSend = (destination) => {
  let videoUrl = document.querySelector("video")?.src || "";

  if (videoUrl.startsWith("blob:")) {
    videoUrl = location.href;
  } else if (!videoUrl) {
    window.alert("Video not found.");
  }

  if (videoUrl) {
    if (destination == "VR") {
      fetch("http://localhost:44913/play-video", {
        body: videoUrl,
        method: "POST",
      })
        .then((response) => {
          console.log("Video sent to Metaverse!");
        })
        .catch((error) => {
          navigator.clipboard.writeText(videoUrl).then(() => {
            console.error("Failed to send video to VR: ", error);
            window.alert(
              "Failed to send video to VR.\nCopied to clipboard instead."
            );
          });
        });
    } else if (destination == "Clipboard") {
      setTimeout(() => {
        navigator.clipboard.writeText(videoUrl).then(() => {
          console.log("Copied to clipboard!");
          window.alert(
            "Copied to clipboard!"
          );
        });
      }, 500);
    }
  }
};

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    chrome.tabs.query(
      {
        lastFocusedWindow: true,
        active: true,
      },
      function (tabs) {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          function: getVideoAndSend,
          args: [request.destination]
        });
      }
    );
});
