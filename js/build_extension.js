let ToptimerExtension = {};
chrome.runtime.onMessage.addListener(responde_to_msg);
jQuery(document).ready(build_extension);

async function build_extension($) {
	ToptimerExtension.isMuted = false;
	const leftWrapper = $('#left_wrapper');

	///////////////////////////
	////// Center Wrapper /////
	///////////////////////////
	const centerWrapper = $('#center_wrapper');

	ToptimerExtension.dropdownControl = $('<select id="toptimer-dropdown">');
	ToptimerExtension.btnGo = $('<button id="go_btn" type="button">Go!</button>');


	ToptimerExtension.countDown = $('<span id="toptimer-countdown">No Time<\span>');
	ToptimerExtension.btnStop = $(`<button id="toptimer-stop">X</button>`);

	min_options = await getMinOptions()
	ToptimerExtension.dropdown_time = to_time_dict(min_options);


	//options minutes
	apply_time_dict();

	

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


	const mute_btn = $(`<button id="mute_btn" type="button"><\button>`);
	mute_btn.html('&#128266;').click(handle_mute_click);


	ToptimerExtension.dialog_btn = $(`<button id="toptimer-stop"></button>`);

	rightWrapper.append(mute_btn);
	//rightWrapper.append(settingsBtn);
	rightWrapper.append(ToptimerExtension.dialog_btn);
	ToptimerExtension.dialog_btn.append(
		$(`<img src="${chrome.runtime.getURL("media/gear-icon.png")}" />`)
	);
	ToptimerExtension.dialog_btn.click(handle_dialog_click);


	// progress bar
	ToptimerExtension.progress_bar = $('<div id="progress_bar" style="height:6px;width:1%;background-color:red;"></div>');
	const progress_wrapper = $('#progress_container');
	progress_wrapper.append(ToptimerExtension.progress_bar)

	let color = await getColor();
	$("#progress_bar").css("background-color", color);
	ToptimerExtension.btnGo.css("background-color", color);

	send_message_to_backend(3, 'init_tab', {});
}




//////////////////////////////////////
////////// Functions /////////////////
//////////////////////////////////////
function updateProgressBar(percent) {
	ToptimerExtension.progress_bar.width(percent + "%");
}

function handle_dialog_click() {
	send_message_to_backend(RECIEVER_ACTIVE_INJECT, "open_settings_dialog", {})
}

function handle_mute_click() {
	ToptimerExtension.isMuted = !ToptimerExtension.isMuted;

	send_message_to_backend(RECIEVER_IFRAME, 'is_muted', { 'is_muted': ToptimerExtension.isMuted });
	send_message_to_backend(RECIEVER_BACKGROUND, 'is_muted', { 'is_muted': ToptimerExtension.isMuted });
	toggle_mute();
}

function toggle_mute() {

	if (ToptimerExtension.isMuted) {
		$("#mute_btn")[0].innerHTML = "&#128263;";
		ToptimerExtension.audio.pause();
	} else {
		$("#mute_btn")[0].innerHTML = "&#128266;";
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

	//console.log(seconds);
	if (seconds < 0) {
		updateProgressBar(100.0);
		return `<span class="toptimer-timer-countdown-minute">00</span>:<span class="toptimer-timer-countdown-second">00</span><span style="margin-left: 5px">min</span>`;
	} else {
		updateProgressBar(100.0 - (seconds / fullTime) * 100.0);
		return `<span class="toptimer-timer-countdown-minute">${m}</span>:<span class="toptimer-timer-countdown-second">${s}</span><span style="margin-left: 5px">min</span>`;
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

function msToNextHour() {
    return 3600000 - new Date().getTime() % 3600000;
}

function msToNextHalfHour() {
    return 1800000 - new Date().getTime() % 3600000;
}

async function handleGoClick() {
	playAudio("../media/engine-start.mp3");

	text = ToptimerExtension.dropdownControl.val();
	let duration_s;
	let countDownDate_ms;
	if (text.startsWith('fill',0)){
		if (text == 'fill_30'){
			countDownDate_ms = new Date().getTime() + msToNextHalfHour();
			duration_s = msToNextHalfHour()/1000.0;
		}else if (text == 'fill_60'){
			countDownDate_ms = new Date().getTime() + msToNextHour();
			duration_s = msToNextHour()/1000.0;
		}
	}else{
		const minutes = parseInt(text);
		countDownDate_ms = new Date().getTime() + minutes * 60 * 1000;
		duration_s = minutes * 60;
	}
	send_message_to_backend(RECIEVER_IFRAME, 'start_timer', { 'countDownDate_ms': countDownDate_ms, 'duration_s': duration_s })
	send_message_to_backend(RECIEVER_BACKGROUND, 'start_timer', { 'countDownDate_ms': countDownDate_ms, 'duration_s': duration_s })
	start_update_intervall(countDownDate_ms, duration_s)
}

function start_update_intervall(countDownDate, duration_in_seconds) {
	const now = new Date().getTime();
	const distance = countDownDate - now;
	ToptimerExtension.countDown.html(formatedTimeSpan(duration_in_seconds, distance / 1000));

	ToptimerExtension.btnGo.hide();
	ToptimerExtension.dropdownControl.hide();
	ToptimerExtension.countDown.show();
	ToptimerExtension.btnStop.show();

	// Update the count down every 1 second
	ToptimerExtension.interval = setInterval(() => {
		// Get today's date and time
		const now = new Date().getTime();

		// Find the distance between now and the count down date
		const distance = countDownDate - now;
		ToptimerExtension.countDown.html(formatedTimeSpan(duration_in_seconds, distance / 1000));
		// If the count down is finished, write some text

		if (distance <= 0) {
			clearInterval(ToptimerExtension.interval);
			ToptimerExtension.countDown.html("Finished");
			return;
		}

	}, 1000);
}

function handleStopClick() {
	send_message_to_backend(RECIEVER_IFRAME, 'stop_timer', {});
	send_message_to_backend(RECIEVER_BACKGROUND, 'stop_timer', {});
	stop_timer();
}

function stop_timer() {
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




function responde_to_msg(response, sendResponse) {
	if (response.reciever == RECIEVER_ACTIVE_IFRAME || response.reciever == RECIEVER_IFRAME) {
		if (response.type == 'progressbar_color') {
			$("#progress_bar").css("background-color", response.payload);
			ToptimerExtension.btnGo.css("background-color", response.payload);
		}
		if (response.type == 'start_timer') {
			clearInterval(ToptimerExtension.interval);
			start_update_intervall(response.payload['countDownDate_ms'], response.payload['duration_s'])
		}
		if (response.type == 'stop_timer') {
			stop_timer();
		}
		if (response.type == 'play_stop_sound') {
			playAudio("../media/ring.mp3");
		}

		if (response.type == 'is_muted') {
			ToptimerExtension.isMuted = response.payload['is_muted']
			toggle_mute();
		}
		if (response.type == 'get_init_info') {
			ToptimerExtension.isMuted = response.payload['is_muted']
			toggle_mute();
			if ('countDownDate_ms' in response.payload) {
				date = response.payload['countDownDate_ms']
				dur = response.payload['duration_s']
				start_update_intervall(date, dur);
			}
		}
		if (response.type == 'min_options'){
			console.log(response);
			min_options = response.payload
			console.log(min_options);
			
			ToptimerExtension.dropdown_time = to_time_dict(min_options);
			console.log("to_time_dict ",ToptimerExtension.dropdown_time)
			apply_time_dict();
		}
	}
};

function to_time_dict(min_options){
	console.log(min_options);
	min_dict = {};
	for (let i = 0; i < min_options.length; i++) {
		time_in_min = min_options[i];
		min_dict[time_in_min] = `${time_in_min} minutes`
	}
	return min_dict
}

function apply_time_dict(){
	ToptimerExtension.dropdownControl.empty();
	for (const value in ToptimerExtension.dropdown_time) {
		if (Object.hasOwnProperty.call(ToptimerExtension.dropdown_time, value)) {
			const label = ToptimerExtension.dropdown_time[value];
			const option = $(`<option value=${value}>`);
			option.text(label);
			ToptimerExtension.dropdownControl.append(option);
		}
	}
	//other options
	ToptimerExtension.dropdownControl.append('<hr>');
	let option = $(`<option value=fill_60>till full Hour</option>`);
	ToptimerExtension.dropdownControl.append(option);
	option = $(`<option value=fill_30>till half Hour</option>`);
	ToptimerExtension.dropdownControl.append(option);
}