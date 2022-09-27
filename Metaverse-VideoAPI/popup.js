
const bgPage = chrome.extension.getBackgroundPage();

let metaverseButton = document.querySelector("#metaverseButton");
let clipboardButton = document.querySelector("#clipboardButton");

metaverseButton.addEventListener("click", () => {
    window.close();
    chrome.runtime.sendMessage({ destination: "VR" });
});

clipboardButton.addEventListener("click", () => {
    window.close();
    chrome.runtime.sendMessage({ destination: "Clipboard" });
});