"use strict";
// Colour
function getColor() {
    let sKey = "Color";
    return new Promise(function (resolve, reject) {
        chrome.storage.local.get(sKey, function (items) {
            if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError.message);
                reject(chrome.runtime.lastError.message);
            }
            else {
                resolve(items[sKey]);
            }
        });
    });
}
function setColor(value) {
    chrome.storage.local.set({ "Color": value }, function () {
        console.log('Value is set to ' + value);
    });
}
function setMinOptions(values) {
    chrome.storage.local.set({ "Minoptions": values }, function () {
        console.log('Min Options is set to ' + values);
    });
}
function getMinOptions() {
    let sKey = "Minoptions";
    return new Promise(function (resolve, reject) {
        chrome.storage.local.get(sKey, function (items) {
            if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError.message);
                reject(chrome.runtime.lastError.message);
            }
            else {
                let min_options = items[sKey];
                if (min_options === undefined) {
                    console.log('no min options found');
                    min_options = [5, 25, 55, 105];
                }
                ;
                resolve(min_options);
            }
        });
    });
}
