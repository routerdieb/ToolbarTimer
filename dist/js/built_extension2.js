"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const messageHelper2_1 = require("./messageHelper2");
let ToptimerExtension = {};
chrome.runtime.onMessage.addListener(responde_to_msg);
jQuery(document).ready(build_extension);
let dropdown_time;
let countDown;
let btnStop;
let btnGo;
let is_muted;
let min_options;
let dropdownControl;
let progress_bar;
let audio;
let interval;
function build_extension($) {
    return __awaiter(this, void 0, void 0, function* () {
        is_muted = false;
        const leftWrapper = $('#left_wrapper');
        ///////////////////////////
        ////// Center Wrapper /////
        ///////////////////////////
        const centerWrapper = $('#center_wrapper');
        dropdownControl = $('<select id="toptimer-dropdown">');
        btnGo = $('<button id="go_btn" type="button">Go!</button>');
        countDown = $('<span id="toptimer-countdown">No Time<\span>');
        btnStop = $(`<button id="toptimer-stop">X</button>`);
        min_options = yield getMinOptions();
        dropdown_time = to_time_dict(min_options);
        //options minutes
        apply_time_dict();
        btnGo.click(handleGoClick);
        btnStop.click(handleStopClick);
        centerWrapper.append(countDown);
        centerWrapper.append(btnStop);
        centerWrapper.append(dropdownControl);
        centerWrapper.append(btnGo);
        countDown.hide();
        btnStop.hide();
        ///////////////////////////
        ////// Right  Wrapper /////
        ///////////////////////////
        const rightWrapper = $('#right_wrapper');
        const mute_btn = $(`<button id="mute_btn" type="button"><\button>`);
        mute_btn.html('&#128266;').click(handle_mute_click);
        let dialog_btn = $(`<button id="toptimer-stop"></button>`);
        rightWrapper.append(mute_btn);
        //rightWrapper.append(settingsBtn);
        rightWrapper.append(dialog_btn);
        dialog_btn.append($(`<img src="${chrome.runtime.getURL("media/gear-icon.png")}" />`));
        dialog_btn.click(handle_dialog_click);
        // progress bar
        progress_bar = $('<div id="progress_bar" style="height:6px;width:1%;background-color:red;"></div>');
        const progress_wrapper = $('#progress_container');
        progress_wrapper.append(progress_bar);
        let color = yield getColor();
        $("#progress_bar").css("background-color", color);
        btnGo.css("background-color", color);
        (0, messageHelper2_1.send_message_to_backend)(messageHelper2_1.message_recievers.RECIEVER_BACKGROUND, messageHelper2_1.message_types.init_tab, {});
    });
}
//////////////////////////////////////
////////// Functions /////////////////
//////////////////////////////////////
function updateProgressBar(percent) {
    progress_bar.width(percent + "%");
}
function handle_dialog_click() {
    (0, messageHelper2_1.send_message_to_backend)(messageHelper2_1.message_recievers.RECIEVER_ACTIVE_INJECT, messageHelper2_1.message_types.open_settings_dialog, {});
}
function handle_mute_click() {
    is_muted = !is_muted;
    (0, messageHelper2_1.send_message_to_backend)(messageHelper2_1.message_recievers.RECIEVER_IFRAME, messageHelper2_1.message_types.is_muted, { 'is_muted': 'is_muted' });
    (0, messageHelper2_1.send_message_to_backend)(messageHelper2_1.message_recievers.RECIEVER_BACKGROUND, messageHelper2_1.message_types.is_muted, { 'is_muted': 'is_muted' });
    toggle_mute();
}
function toggle_mute() {
    if (is_muted) {
        $("#mute_btn")[0].innerHTML = "&#128263;";
        audio.pause();
    }
    else {
        $("#mute_btn")[0].innerHTML = "&#128266;";
    }
}
//todo rename seconds in function
function formatedTimeSpan(fullTime, seconds) {
    let m = Math.ceil(Math.floor(seconds / 60));
    let s = Math.round(seconds - m * 60);
    if (s == 60) {
        m += 1;
        s = 0;
    }
    let min_str = "" + m;
    let sec_str = "" + s;
    if (m < 10) {
        min_str = "0" + m;
    }
    if (s < 10) {
        sec_str = "0" + s;
    }
    document.title = min_str + ":" + sec_str;
    //console.log(seconds);
    if (seconds < 0) {
        updateProgressBar(100.0);
        return `<span class="toptimer-timer-countdown-minute">00</span>:<span class="toptimer-timer-countdown-second">00</span><span style="margin-left: 5px">min</span>`;
    }
    else {
        updateProgressBar(100.0 - (seconds / fullTime) * 100.0);
        return `<span class="toptimer-timer-countdown-minute">${min_str}</span>:<span class="toptimer-timer-countdown-second">${sec_str}</span><span style="margin-left: 5px">min</span>`;
    }
}
function playAudio(file) {
    if (!is_muted) {
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
        }
        audio = new Audio(chrome.runtime.getURL(file));
        audio.play();
    }
}
function msToNextHour() {
    return 3600000 - new Date().getTime() % 3600000;
}
function msToNextHalfHour() {
    return 1800000 - new Date().getTime() % 3600000;
}
function handleGoClick() {
    return __awaiter(this, void 0, void 0, function* () {
        playAudio("../media/engine-start.mp3");
        let text = dropdownControl.val();
        let duration_s = 0;
        let countDownDate_ms = 0;
        if (text.startsWith('fill', 0)) {
            if (text == 'fill_30') {
                countDownDate_ms = new Date().getTime() + msToNextHalfHour();
                duration_s = msToNextHalfHour() / 1000.0;
            }
            else if (text == 'fill_60') {
                countDownDate_ms = new Date().getTime() + msToNextHour();
                duration_s = msToNextHour() / 1000.0;
            }
        }
        else {
            const minutes = parseInt(text);
            countDownDate_ms = new Date().getTime() + minutes * 60 * 1000;
            duration_s = minutes * 60;
        }
        (0, messageHelper2_1.send_message_to_backend)(messageHelper2_1.message_recievers.RECIEVER_IFRAME, messageHelper2_1.message_types.start_timer, { 'countDownDate_ms': countDownDate_ms, 'duration_s': duration_s });
        (0, messageHelper2_1.send_message_to_backend)(messageHelper2_1.message_recievers.RECIEVER_BACKGROUND, messageHelper2_1.message_types.start_timer, { 'countDownDate_ms': countDownDate_ms, 'duration_s': duration_s });
        start_update_intervall(countDownDate_ms, duration_s);
    });
}
function start_update_intervall(countDownDate, duration_in_seconds) {
    const now = new Date().getTime();
    const distance = countDownDate - now;
    countDown.html(formatedTimeSpan(duration_in_seconds, distance / 1000));
    btnGo.hide();
    dropdownControl.hide();
    countDown.show();
    btnStop.show();
    // Update the count down every 1 second
    interval = setInterval(() => {
        // Get today's date and time
        const now = new Date().getTime();
        // Find the distance between now and the count down date
        const distance = countDownDate - now;
        countDown.html(formatedTimeSpan(duration_in_seconds, distance / 1000));
        // If the count down is finished, write some text
        if (distance <= 0) {
            clearInterval(interval);
            countDown.html("Finished");
            return;
        }
    }, 1000);
}
function handleStopClick() {
    (0, messageHelper2_1.send_message_to_backend)(messageHelper2_1.message_recievers.RECIEVER_IFRAME, messageHelper2_1.message_types.stop_timer);
    (0, messageHelper2_1.send_message_to_backend)(messageHelper2_1.message_recievers.RECIEVER_BACKGROUND, messageHelper2_1.message_types.stop_timer);
    stop_timer();
}
function stop_timer() {
    clearInterval(interval);
    btnGo.show();
    dropdownControl.show();
    countDown.hide();
    btnStop.hide();
    if (audio) {
        audio.pause();
        audio.currentTime = 0;
    }
}
function responde_to_msg(response, sendResponse) {
    if (response.reciever == messageHelper2_1.message_recievers.RECIEVER_ACTIVE_IFRAME || response.reciever == messageHelper2_1.message_recievers.RECIEVER_IFRAME) {
        if (response.type == messageHelper2_1.message_types.progressbar_color) {
            $("#progress_bar").css("background-color", response.payload);
            btnGo.css("background-color", response.payload);
        }
        if (response.type == messageHelper2_1.message_types.start_timer) {
            clearInterval(interval);
            start_update_intervall(response.payload['countDownDate_ms'], response.payload['duration_s']);
        }
        if (response.type == messageHelper2_1.message_types.stop_timer) {
            stop_timer();
        }
        if (response.type == messageHelper2_1.message_types.play_stop_sound) {
            playAudio("../media/ring.mp3");
        }
        if (response.type == messageHelper2_1.message_types.is_muted) {
            is_muted = response.payload['is_muted'];
            toggle_mute();
        }
        if (response.type == messageHelper2_1.message_types.get_init_info) {
            is_muted = response.payload['is_muted'];
            toggle_mute();
            if ('countDownDate_ms' in response.payload) {
                let date = response.payload['countDownDate_ms'];
                let dur = response.payload['duration_s'];
                start_update_intervall(date, dur);
            }
        }
        if (response.type == messageHelper2_1.message_types.min_options) {
            console.log(response);
            min_options = response.payload['min_options'];
            console.log(min_options);
            dropdown_time = to_time_dict(min_options);
            console.log("to_time_dict ", dropdown_time);
            apply_time_dict();
        }
    }
}
;
function to_time_dict(min_options) {
    console.log(min_options);
    let min_dict = {};
    for (let i = 0; i < min_options.length; i++) {
        let time_in_min = min_options[i];
        min_dict[time_in_min] = `${time_in_min} minutes`;
    }
    return min_dict;
}
function apply_time_dict() {
    dropdownControl.empty();
    for (const value in dropdown_time) {
        if (Object.hasOwnProperty.call(dropdown_time, value)) {
            const label = dropdown_time[value];
            const option = $(`<option value=${value}>`);
            option.text(label);
            dropdownControl.append(option);
        }
    }
    //other options
    dropdownControl.append('<hr>');
    let option = $(`<option value=fill_60>till full Hour</option>`);
    dropdownControl.append(option);
    option = $(`<option value=fill_30>till half Hour</option>`);
    dropdownControl.append(option);
}
