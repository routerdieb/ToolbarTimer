// Colour
function getColor() {
    sKey = "Color";
    return new Promise(function(resolve, reject) {
      chrome.storage.local.get(sKey, function(items) {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError.message);
          reject(chrome.runtime.lastError.message);
        } else {
          resolve(items[sKey]);
        }
      });
    });
  }
  
  function setColor(value) {  
    chrome.storage.local.set({"Color": value}, function() {
      console.log('Value is set to ' + value);
    });
  }

// Embedded Calendar
function getCalendar() {
    sKey = "CALENDAR_KEY";
    return new Promise(function(resolve, reject) {
      chrome.storage.local.get(sKey, function(items) {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError.message);
          reject(chrome.runtime.lastError.message);
        } else {
          resolve(items[sKey]);
        }
      });
    });
  }
  
  function setCalendar(value) {  
    chrome.storage.local.set({"CALENDAR_KEY": value}, function() {
      console.log('Value is set to ' + value);
    });
  }

// The Calendar
function getHideCalendar() {
    sKey = "HIDE_CALENDAR_KEY";
    return new Promise(function(resolve, reject) {
      chrome.storage.local.get(sKey, function(items) {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError.message);
          reject(chrome.runtime.lastError.message);
        } else {
          resolve(items[sKey]);
        }
      });
    });
  }
  
  function setHideCalendar(value) {  
    chrome.storage.local.set({"HIDE_CALENDAR_KEY": value}, function() {
      console.log('Value is set to ' + value);
    });
    
  }