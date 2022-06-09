let ToptimerExtension = {};

(async function() {
    // this is the code which will be injected into a given page...

    const dropdownOptions = {
        5: "5 Min",
        25: "25 Min",
        55: "55 Min",
        105: "1:45 Hours (1 hour 45 min)",
    };
    //let points = getOption("points");
    ToptimerExtension.isMuted = false;
    // The Bar
    const toptimerTimer = $('<div id="toptimer-bar" class="toptimer">');
    const progressBar = $('<div id="myProgress"><div id="myBar">');
    const controls = $('<div class="toptimer-timer-controls">');
    const rightWrapper = $('<div class="toptimer toptimer-right-wrapper">');
    const leftWrapper = $('<div class="left-wrapper">');

    toptimerTimer.append(leftWrapper).append(controls).append(rightWrapper);

    //Left Wrapper
    const btnCalendarBtn = $('<button class="toptimer __TTBUTTON" id="toptimer-calendar-btn" type="button" style="background-color: black !important;">');
    btnCalendarBtn.append(
        $(`<img class="width2020" src="${chrome.runtime.getURL("media/calendar-icon.png")}" />`)
    );
    btnCalendarBtn.click(open_Calendar);

    leftWrapper.append(btnCalendarBtn);

    //Center Stuff
    const dropdownControl = $('<select id="toptimer-timer-dropdown" class="toptimer">');
    ToptimerExtension.dropdownControl = dropdownControl
    const btnGoControl = $('<button id="go_btn" class="__TTBUTTON" type="button">');
    const mute_btn = $('<button id="mute_btn" class="toptimer __TTBUTTON" type="button">');
    controls.append(dropdownControl);

    const countDown = $('<div class="toptimer-timer-countdown">');
    const btnStop = $('<button class="toptimer toptimer-timer-stop __TTBUTTON">');
    btnStop.html("✕");
    btnStop.click(handleStopClick);

    for (const value in dropdownOptions) {
        if (Object.hasOwnProperty.call(dropdownOptions, value)) {
            const label = dropdownOptions[value];
            const option = $(`<option value=${value}>`);
            option.text(label);
            $(dropdownControl).append(option);
        }
    }
    controls.append(btnGoControl);
    btnGoControl.text("GO!").click(handleGoClick);

    toptimerTimer.append(countDown);
    countDown.hide();

    //Right Stuff

    mute_btn.html('🔊').click(toggle_mute);

    const settingsBtn = $('<button id="settings-btn" class="toptimer __TTBUTTON" type="button">').click(openSettingPane);
    settingsBtn.append(
        $(`<img class="width2020" src="${chrome.runtime.getURL("media/gear-icon.png")}" />`)
    );

    rightWrapper.append(mute_btn);
    rightWrapper.append(settingsBtn);

    //Init
    jQuery(document).ready(async function($) {
        console.log('site is ready')
            //if ($('header').get(0) != "undefined"){
            //  $('header').prepend(progressBar);
            //  $('header').prepend(toptimerTimer);
            //  console.log('prepending to header');
            //}else{
        moveToDiv();

        $(document.body).prepend(progressBar);
        $(document.body).prepend(toptimerTimer);

        console.log('prepending to body');

        let color = await getColor();
        $("#myBar").css("background-color", color)

        close_Calendar();
        let hideCal = await getHideCalendar();
        console.log("hideCal" + hideCal)
        if (hideCal) {
            $("#toptimer-calendar-btn").hide();
        }

        //make my css more important
        if (window.document.styleSheets.length > 0) {
            var sheet = window.document.styleSheets[window.document.styleSheets.length - 1];
            url = chrome.runtime.getURL('css/styles.css');
            fetch(url).then((a) => console.log(a));


        }


    });

    async function handleGoClick() {

        playAudio("../media/engine-start.mp3");

        controls.hide();

        // Set the date we're counting down to
        const now = new Date().getTime();

        const minutes = parseInt(ToptimerExtension.dropdownControl.val());
        console.log('ToptimerExtension val' + ToptimerExtension == null)
        console.log('dropdownControl' + dropdownControl == null)
        const countDownDate = new Date().getTime() + minutes * 60 * 1000;
        const fullTime = minutes * 60;
        console.log(fullTime)
        const distance = countDownDate - now;
        countDown.html(formatedTimeSpan(fullTime, distance / 1000));

        countDown.show();
        // Update the count down every 1 second
        ToptimerExtension.interval = setInterval(() => {
            // Get today's date and time
            const now = new Date().getTime();

            // Find the distance between now and the count down date
            const distance = countDownDate - now;
            countDown.html(formatedTimeSpan(fullTime, distance / 1000));
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
                return;
            }
            countDown.append(btnStop);
            $(btnStop).click(handleStopClick);
        }, 1000);
    }

    function handleStopClick() {
        console.log("handleStopClick");
        clearInterval(ToptimerExtension.interval);
        countDown.hide();
        controls.show();
        if (ToptimerExtension.audio) {
            ToptimerExtension.audio.pause();
            ToptimerExtension.audio.currentTime = 0;
        }
        document.title = "Timer stopped";
    }
})(); // End of Async init function

//////////////////////////////////////
////////// Functions /////////////////
//////////////////////////////////////
function updateProgressBar(percent) {
    elem = document.getElementById("myBar");
    elem.style.width = percent + "%";
}

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

function moveToDiv() {
    //BODY
    $(document.body).prepend('<div id="copyOfBody123">');
    var style = css($("body"));
    $("#copyOfBody123").css(style);

    $(document.body).css("all", "unset");
    let childs = Array.from($('body').children());


    childs.forEach((item, index) => $(item).appendTo($('#copyOfBody123')));

    //IMAGE
    //var style = css($("select"));
    //console.log(style)
    //$("#copyOfBody123 select").css(style);
    //$("select").css("all","unset");

}