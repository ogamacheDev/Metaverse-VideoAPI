
const bgPage = chrome.extension.getBackgroundPage();

let metaverseButton = document.querySelector("#metaverseButton");

metaverseButton.addEventListener("click", () => {
    window.close();
    chrome.runtime.sendMessage({ msg: "sendToMetaverse" });
});