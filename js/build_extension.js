let ToptimerExtension = {};
console.log('runung script 2');
jQuery(document).ready(async function($) {
	
	console.log('running build extenios inner');
	const dropdownOptions = {
		1: "1 min",
        5: "5 Min",
        25: "25 Min",
        55: "55 Min",
        105: "1:45 Hours (1 hour 45 min)",
    };
    //ToptimerExtension.isMuted = false;
	
	// Left Wrapper
    const leftWrapper = $('#left_wrapper');
	
    const btnCalendarBtn = $('<button class="toptimer __TTBUTTON" id="toptimer-calendar-btn" type="button" style="background-color: black !important;">');
    btnCalendarBtn.append(
        $(`<img class="width2020" style="float:left;" src="${chrome.runtime.getURL("media/calendar-icon.png")}" />`)
    );
    //btnCalendarBtn.click(open_Calendar);

    leftWrapper.append(btnCalendarBtn);
	
    //Center Stuff
	const centerWrapper = $('#center_wrapper');
	
    const dropdownControl = $('<select id="toptimer-dropdown" class="toptimer">');
    const btnGoControl = $('<button id="go_btn" class="__TTBUTTON" type="button">Go!</button>');
    

    const countDown = $('<span id="toptimer-countdown">No Time<\span>');
    const btnStop = $(`<button class="toptimer __TTBUTTON" id="toptimer-stop">X</button>`);
    //btnStop.click(handleStopClick);

    for (const value in dropdownOptions) {
        if (Object.hasOwnProperty.call(dropdownOptions, value)) {
            const label = dropdownOptions[value];
            const option = $(`<option value=${value}>`);
            option.text(label);
            $(dropdownControl).append(option);
        }
    }
    
	btnGoControl.click(handleGoClick);
	btnStop.click(handleStopClick)

    centerWrapper.append(countDown);
	centerWrapper.append(btnStop);
	centerWrapper.append(dropdownControl);
	centerWrapper.append(btnGoControl);
	
	countDown.hide()
	btnStop.hide()
	

    //Right Stuff
	const rightWrapper = $('#right_wrapper');

   
	const mute_btn = $(`<button id="mute_btn" class="toptimer __TTBUTTON" type="button"><\button>`);
	mute_btn.html('&#128263;')//.click(toggle_mute);
    const settingsBtn = $('<button id="settings-btn" class="toptimer __TTBUTTON" type="button">')//.click(openSettingPane);
    settingsBtn.append(
        $(`<img class="width2020" src="${chrome.runtime.getURL("media/gear-icon.png")}" />`)
    );

    rightWrapper.append(mute_btn);
    rightWrapper.append(settingsBtn);
	
	
	
});




//////////////////////////////////////
////////// Functions /////////////////
//////////////////////////////////////
function updateProgressBar(percent) {
    elem = document.getElementById("myBar");
    elem.style.width = percent + "%";
}

/*
function toggle_mute() {
    ToptimerExtension.isMuted = !ToptimerExtension.isMuted;
    if (ToptimerExtension.isMuted) {
        $("#mute_btn")[0].innerHTML = "🔇";
        console.log("toptimer muted");
    } else {
        $("#mute_btn")[0].innerHTML = "🔊";
        console.log("toptimer unmuted");
    }
}
*/




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
    //updateProgressBar(100.0 - (seconds / fullTime) * 100.0);
    return `<span class="toptimer-timer-countdown-minute">${m}</span>:<span class="toptimer-timer-countdown-second">${s}</span><span style="margin-left: 5px">min</span>`;
}



//Github magic: https://stackoverflow.com/questions/754607/can-jquery-get-all-css-styles-associated-with-an-element
function css(a) {
    var sheets = document.styleSheets,
        o = {};
    for (var i in sheets) {
        var rules = sheets[i].rules || sheets[i].cssRules;
        for (var r in rules) {
            if (a.is(rules[r].selectorText)) {
                o = $.extend(o, css2json(rules[r].style), css2json(a.attr('style')));
            }
        }
    }
    return o;
}

function css2json(css) {
    var s = {};
    if (!css) return s;
    if (css instanceof CSSStyleDeclaration) {
        for (var i in css) {
            if ((css[i]).toLowerCase) {
                s[(css[i]).toLowerCase()] = (css[css[i]]);
            }
        }
    } else if (typeof css == "string") {
        css = css.split("; ");
        for (var i in css) {
            var l = css[i].split(": ");
            s[l[0].toLowerCase()] = (l[1]);
        }
    }
    return s;
}



function playAudio(file) {
	audio = new Audio(chrome.runtime.getURL(file));
    audio.play();
    //if (!ToptimerExtension.isMuted) {
    //    if (ToptimerExtension.audio) {
    //        ToptimerExtension.audio.pause();
    //        ToptimerExtension.audio.currentTime = 0;
    //    }   
    //}
}


async function handleGoClick() {
		//todo replace with Toptimer.something
		countDown = $('#toptimer-countdown')
		btnStop = $('#toptimer-stop')
		btnGo 	= $('#go_btn')
		dropdownControl = $('#toptimer-dropdown')

		console.log('activated handle go click');
        //playAudio("../media/engine-start.mp3");
		
		btnGo.hide();
		dropdownControl.hide();
		countDown.show();
		btnStop.show();

        // Set the date we're counting down to
        const now = new Date().getTime();

        const minutes = parseInt(dropdownControl.val());
        console.log('dropdownControl' + dropdownControl == null)
        const countDownDate = new Date().getTime() + minutes * 60 * 1000;
        const fullTime = minutes * 60;
        console.log(fullTime)
        const distance = countDownDate - now;
        countDown.html(formatedTimeSpan(fullTime, distance / 1000));
		
		//$(btnStop).click(handleStopClick);

        // Update the count down every 1 second
        ToptimerExtension.interval = setInterval(() => {
            // Get today's date and time
            const now = new Date().getTime();

            // Find the distance between now and the count down date
            const distance = countDownDate - now;
            countDown.html(formatedTimeSpan(fullTime, distance / 1000));
            // If the count down is finished, write some text

            if (distance < 0) {
                clearInterval(ToptimerExtension.interval);
                countDown.html("Finished");
                //playAudio("../media/ring.mp3");
                return;
            }

        }, 1000);
}

function handleStopClick() {
		countDown = $('#toptimer-countdown')
		btnStop = $('#toptimer-stop')
		btnGo 	= $('#go_btn')
		dropdownControl = $('#toptimer-dropdown')
	
	
        console.log("handleStopClick");
        clearInterval(ToptimerExtension.interval);
		btnGo.show();
		dropdownControl.show();
		countDown.hide();
		btnStop.hide();
		
		
        //controls.show();
        //if (ToptimerExtension.audio) {
        //    ToptimerExtension.audio.pause();
        //    ToptimerExtension.audio.currentTime = 0;
        //}
}