let ToptimerExtension = {};

(async function () {
  // this is the code which will be injected into a given page...

  const dropdownOptions = {
    5: "5 Min",
    25: "25 Min",
    55: "55 Min",
    105: "1:45 Hours (1 hour 45 min)",
  };
  //let points = getOption("points");
  ToptimerExtension.isMuted = false;
  // elements
  const toptimerTimer = $('<div class="toptimer toptimer-timer">');
  const settingsBtn = $('<button id="settings-btn" class="btn toptimer" type="button">');
  $(settingsBtn).click(openSettingPane);

  const rightWrapper = $('<div class="toptimer toptimer-right-wrapper">');
  const leftWrapper = $('<div class="left-wrapper">');
  const controls = $('<div class="toptimer-timer-controls">');
  const dropdownControl = $('<select class="toptimer toptimer-timer-dropdown">');
  const btnGoControl = $('<button class="toptimer-timer-go" type="button">');
  const mute_btn = $('<button id="mute_btn" class="toptimer" type="button">');
  $(mute_btn).html('🔊');
  $(mute_btn).click(toggle_mute);
  //const points_span = $('<span class="toptimer-points">');
  const btnCalendarBtn = $('<button class="toptimer" id="toptimer-calendar-btn" type="button">');
  
  const btnCalendarCloseControl = $('<button class="toptimer toptimer-calendar-popup-close-btn" type="button">');

  const progressBar = $('<div id="myProgress"><div id="myBar"></div></div>');

  btnCalendarCloseControl.text("×");
  $(btnCalendarCloseControl).click(handleCalendarCloseClick);
  //$(points_span).html(points);
  //btnCalendarControl.append(points_span);
  btnCalendarBtn.append(
    $(`<img src="${chrome.runtime.getURL("media/calendar-icon.png")}" />`)
  );


  leftWrapper.append(settingsBtn);
  settingsBtn.append(
    $(`<img src="${chrome.runtime.getURL("media/gear-icon.png")}" />`)
  );
  leftWrapper.append(mute_btn);
  leftWrapper.append("</div>");
  
  const calendarPopup = $('<div class="toptimer-calendar-popup">');
  const countDown = $('<div class="toptimer-timer-countdown">');
  const btnStop = $('<button class="toptimer toptimer-timer-stop">');
  btnStop.html("✕");
  $(btnStop).click(handleStopClick);

  $(toptimerTimer).append(leftWrapper);
  $(toptimerTimer).append(controls);
  $(toptimerTimer).append(rightWrapper);
  
  $(rightWrapper).append(btnCalendarBtn);
  $(btnCalendarBtn).click(handleCalendarClick);
  $(rightWrapper).append(calendarPopup);
  $(calendarPopup).html(
    '<iframe src="https://calendar.google.com/calendar/embed?height=600&amp;wkst=2&amp;bgcolor=%23B39DDB&amp;ctz=Europe%2FBerlin&amp;src=dy5lc29AbGl2ZS5kZQ&amp;src=YWRkcmVzc2Jvb2sjY29udGFjdHNAZ3JvdXAudi5jYWxlbmRhci5nb29nbGUuY29t&amp;color=%234285F4&amp;color=%237986CB&amp;mode=WEEK&amp;showTitle=0&amp;showNav=1&amp;showDate=1&amp;showPrint=1&amp;showTabs=1&amp;showCalendars=0&amp;showTz=0" style="border:solid 1px #777" width="800" height="600" frameborder="0" scrolling="no"></iframe>'
  );
  $(calendarPopup).append(btnCalendarCloseControl);
  $(controls).append(dropdownControl);
  for (const value in dropdownOptions) {
    if (Object.hasOwnProperty.call(dropdownOptions, value)) {
      const label = dropdownOptions[value];
      const option = $(`<option value=${value}>`);
      option.text(label);
      $(dropdownControl).append(option);
    }
  }
  $(controls).append(btnGoControl);
  $(btnGoControl).text("GO!");
  $(btnGoControl).click(handleGoClick);
  

  $(toptimerTimer).append(countDown);
  $(countDown).hide();


  jQuery(document).ready(async function ($) {
    if ($('header').get(0) != "undefined"){
      $('header').prepend(progressBar);
      $('header').prepend(toptimerTimer);
    }else{
      $(document.body).prepend(progressBar);
      $(document.body).prepend(toptimerTimer);
    }
    let hideCal = await getHideCalendar();
    console.log("hideCal"+hideCal)
    if (hideCal){
      $("#toptimer-calendar-btn").hide();
    }
  });
  var interval;

  async function handleGoClick() {

    playAudio("../media/engine-start.mp3");
    
    $(controls).hide();
    
    // Set the date we're counting down to
    const now = new Date().getTime();
    const minutes = parseInt(dropdownControl.val());
    const countDownDate = new Date().getTime() + minutes * 60 * 1000;
    const fullTime = minutes * 60;
    console.log(fullTime)
    const distance = countDownDate - now;
    countDown.html(formatTime(fullTime,distance / 1000));
    
    $(countDown).show();
    // Update the count down every 1 second
    interval = setInterval(function () {
      // Get today's date and time
      const now = new Date().getTime();

      // Find the distance between now and the count down date
      const distance = countDownDate - now;
      countDown.html(formatTime(fullTime,distance / 1000));
      // If the count down is finished, write some text
      $(controls).hide();
      countDown.append(btnStop);
      $(countDown).show();

      if (distance < 0) {
        clearInterval(interval);
        countDown.html("Finished");
        playAudio("../media/ring.mp3");
        
        switch (minutes) {
          case 25:
            points += 1;
            break;
          case 55:
            points += 2;
            break;
          case 105:
            points += 4;
            break;
        }
        //$(points_span).html(points);
        //setOption('points',points);
        document.title = "Go again ?";
        return
      }
      countDown.append(btnStop);
      $(btnStop).click(handleStopClick);
    }, 1000);
  }
  function handleStopClick() {
    console.log("handleStopClick");
    clearInterval(interval);
    countDown.hide();
    controls.show();
    if (ToptimerExtension.audio) {
      ToptimerExtension.audio.pause();
      ToptimerExtension.audio.currentTime = 0;
    }
    document.title = "Timer stopped";
  }

  function handleCalendarClick() {
    console.log("handleCalendarClick call");
    showCalenderPopup();
  }
  function handleCalendarCloseClick() {
    console.log("handleCalendarCloseClick call");
    hideCalenderPopup();
  }
  function showCalenderPopup() {
    $($(calendarPopup).show());
  }
  function hideCalenderPopup() {
    $($(calendarPopup).hide());
  }
  function formatTime(fullTime, seconds) {
    var m = Math.ceil(Math.floor(seconds / 60)),
      s = Math.round(seconds - m * 60);
    if(s == 60){
      m += 1
      s = 0
    }
    if (m < 10) m = "0" + m;
    if (s < 10) s = "0" + s;
    document.title = m + ":" + s;

    console.log(seconds);
    updateProgressBar(100.0 - (seconds / fullTime)*100.0);
    return `<span class="toptimer-timer-countdown-minute">${m}</span>:<span class="toptimer-timer-countdown-second">${s}</span><span style="margin-left: 5px">min</span>`;
  }

  function updateProgressBar(percent){
    elem = document.getElementById("myBar");
    elem.style.width = percent + "%";
  }
})();

function toggle_mute(){
  ToptimerExtension.isMuted = !ToptimerExtension.isMuted;
  if(ToptimerExtension.isMuted){
    $("#mute_btn")[0].innerHTML = "🔇";
    console.log("toptimer muted");
  }else{
    $("#mute_btn")[0].innerHTML = "🔊";
    console.log("toptimer unmuted");
  }
}

function playAudio(file) {
  if (!ToptimerExtension.isMuted){
    if (ToptimerExtension.audio) {
      ToptimerExtension.audio.pause();
      ToptimerExtension.audio.currentTime = 0;
    }
    ToptimerExtension.audio = new Audio(chrome.runtime.getURL(file));
    ToptimerExtension.audio.play();
  }
}
// get and set settings
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


