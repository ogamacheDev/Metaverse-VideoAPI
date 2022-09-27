
const bgPage = chrome.extension.getBackgroundPage();

let metaverseButton = document.querySelector("#metaverse-btn");
let clipboardButton = document.querySelector("#clipboard-btn");

metaverseButton.addEventListener("click", () => {
    window.close();
    chrome.runtime.sendMessage({ destination: "VR" });
});

clipboardButton.addEventListener("click", () => {
    window.close();
    chrome.runtime.sendMessage({ destination: "Clipboard" });
});