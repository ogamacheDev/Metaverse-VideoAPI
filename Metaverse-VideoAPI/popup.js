
const bgPage = chrome.extension.getBackgroundPage();
const allBtns = document.querySelectorAll("button[href]");

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

allBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        chrome.tabs.create({url: btn.getAttribute('href')});
    })
});