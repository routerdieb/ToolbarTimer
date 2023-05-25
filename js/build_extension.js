let ToptimerExtension = {};




jQuery(document).ready(async function($) {
	ToptimerExtension.isMuted = false;
	
	const dropdownOptions = {
		1: "1 min",
        5: "5 Min",
        25: "25 Min",
        55: "55 Min",
        105: "1:45 Hours (1 hour 45 min)",
    };
    
	///////////////////////////
    ////// Left   Wrapper /////
	///////////////////////////
    const leftWrapper = $('#left_wrapper');
    const btnCalendarBtn = $('<button class="toptimer __TTBUTTON" id="toptimer-calendar-btn" type="button" style="background-color: black !important;">');
    btnCalendarBtn.append(
        $(`<img class="width2020" style="float:left;" src="${chrome.runtime.getURL("media/calendar-icon.png")}" />`)
    );
    //btnCalendarBtn.click(open_Calendar);

    leftWrapper.append(btnCalendarBtn);
	
	///////////////////////////
    ////// Center Wrapper /////
	///////////////////////////
	const centerWrapper = $('#center_wrapper');
	
    ToptimerExtension.dropdownControl = $('<select id="toptimer-dropdown" class="toptimer">');
    ToptimerExtension.btnGo = $('<button id="go_btn" class="__TTBUTTON" type="button">Go!</button>');
    

    ToptimerExtension.countDown = $('<span id="toptimer-countdown">No Time<\span>');
    ToptimerExtension.btnStop = $(`<button class="toptimer __TTBUTTON" id="toptimer-stop">X</button>`);

    for (const value in dropdownOptions) {
        if (Object.hasOwnProperty.call(dropdownOptions, value)) {
            const label = dropdownOptions[value];
            const option = $(`<option value=${value}>`);
            option.text(label);
             ToptimerExtension.dropdownControl.append(option);
        }
    }
    
	ToptimerExtension.btnGo.click(handleGoClick);
	ToptimerExtension.btnStop.click(handleStopClick)

    centerWrapper.append(ToptimerExtension.countDown);
	centerWrapper.append(ToptimerExtension.btnStop);
	centerWrapper.append(ToptimerExtension.dropdownControl);
	centerWrapper.append(ToptimerExtension.btnGo);
	
	ToptimerExtension.countDown.hide()
	ToptimerExtension.btnStop.hide()
	

    ///////////////////////////
    ////// Right  Wrapper /////
	///////////////////////////
	const rightWrapper = $('#right_wrapper');

   
	const mute_btn = $(`<button id="mute_btn" class="toptimer __TTBUTTON" type="button"><\button>`);
	mute_btn.html('&#128266;').click(toggle_mute);
    const settingsBtn = $('<button id="settings-btn" class="toptimer __TTBUTTON" type="button">')//.click(openSettingPane);
    settingsBtn.append(
        $(`<img class="width2020" src="${chrome.runtime.getURL("media/gear-icon.png")}" />`)
    );

    rightWrapper.append(mute_btn);
    rightWrapper.append(settingsBtn);
	
	
	// progress bar
	ToptimerExtension.progress_bar = $('<div id="progress_bar" style="height:6px;width:1%;background-color:red;"></div>');
	const progress_wrapper = $('#progress_container');
	progress_wrapper.append(ToptimerExtension.progress_bar)
	
});




//////////////////////////////////////
////////// Functions /////////////////
//////////////////////////////////////
function updateProgressBar(percent) {
    ToptimerExtension.progress_bar.width(percent + "%");
}


function toggle_mute() {
    ToptimerExtension.isMuted = !ToptimerExtension.isMuted;
    if (ToptimerExtension.isMuted) {
        $("#mute_btn")[0].innerHTML = "&#128263;";
        console.log("toptimer muted");
    } else {
        $("#mute_btn")[0].innerHTML = "&#128266;";
        console.log("toptimer unmuted");
    }
}

chrome.runtime.onMessage.addListener(function (response, sendResponse) {
          console.log(response);
});


function formatedTimeSpan(fullTime, seconds) {
    var m = Math.ceil(Math.floor(seconds / 60)),
        s = Math.round(seconds - m * 60);
    if (s == 60) {
        m += 1
        s = 0
    }
    if (m < 10) m = "0" + m;
    if (s < 10) s = "0" + s;
    document.title = m + ":" + s;

    console.log(seconds);
    updateProgressBar(100.0 - (seconds / fullTime) * 100.0);
    return `<span class="toptimer-timer-countdown-minute">${m}</span>:<span class="toptimer-timer-countdown-second">${s}</span><span style="margin-left: 5px">min</span>`;
}


function playAudio(file) {
    if (!ToptimerExtension.isMuted) {
        if (ToptimerExtension.audio) {
            ToptimerExtension.audio.pause();
            ToptimerExtension.audio.currentTime = 0;
        }
		ToptimerExtension.audio = new Audio(chrome.runtime.getURL(file));
		ToptimerExtension.audio.play();
    }
}


async function handleGoClick() {
		playAudio("../media/engine-start.mp3");
		chrome.runtime.sendMessage({type: "hello",status:"false"});
		
		ToptimerExtension.btnGo.hide();
		ToptimerExtension.dropdownControl.hide();
		ToptimerExtension.countDown.show();
		ToptimerExtension.btnStop.show();

        // Set the date we're counting down to
        const now = new Date().getTime();

        const minutes = parseInt( ToptimerExtension.dropdownControl.val());
        console.log('dropdownControl' + ToptimerExtension.dropdownControl == null)
        const countDownDate = new Date().getTime() + minutes * 60 * 1000;
        const fullTime = minutes * 60;
        console.log(fullTime)
        const distance = countDownDate - now;
        ToptimerExtension.countDown.html(formatedTimeSpan(fullTime, distance / 1000));
		
        // Update the count down every 1 second
        ToptimerExtension.interval = setInterval(() => {
            // Get today's date and time
            const now = new Date().getTime();

            // Find the distance between now and the count down date
            const distance = countDownDate - now;
            ToptimerExtension.countDown.html(formatedTimeSpan(fullTime, distance / 1000));
            // If the count down is finished, write some text

            if (distance < 0) {
                clearInterval(ToptimerExtension.interval);
                ToptimerExtension.countDown.html("Finished");
                playAudio("../media/ring.mp3");
                return;
            }

        }, 1000);
}

function handleStopClick() {
        clearInterval(ToptimerExtension.interval);
		ToptimerExtension.btnGo.show();
		ToptimerExtension.dropdownControl.show();
		ToptimerExtension.countDown.hide();
		ToptimerExtension.btnStop.hide();
		
        if (ToptimerExtension.audio) {
            ToptimerExtension.audio.pause();
            ToptimerExtension.audio.currentTime = 0;
        }
}