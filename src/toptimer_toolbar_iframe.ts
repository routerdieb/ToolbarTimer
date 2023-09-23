import { message_recievers, message, message_types, send_message_to_backend, create_message } from "./messageHelper";
import { getMinOptions, getColor} from "./load_and_store";

jQuery(document).ready(() => {// hacky way for typescript
	build_extension()
});

const me:message_recievers[] = [message_recievers.ACTIVE_IFRAME,message_recievers.IFRAME]
chrome.runtime.onMessage.addListener(responde_to_msg);

let dropdown_time: { [x: string]: any; }
let countDown: JQuery<HTMLElement>

let is_muted:boolean
let min_options:number[]
let dropdownControl: JQuery<HTMLElement>
let progress_bar: JQuery<HTMLElement>
let audio: HTMLAudioElement
let interval: ReturnType<typeof setInterval>
let btnStop: JQuery<HTMLButtonElement>
let btnGo: JQuery<HTMLButtonElement>


async function build_extension() {
	is_muted = false

	btnStop =  jQuery('#stop_btn')
	btnGo	=  jQuery('#go_btn')
	dropdownControl = jQuery('#toptimer-dropdown')
	countDown = jQuery('#toptimer-countdown')
	progress_bar = jQuery('#progress_bar')
	const mute_btn:JQuery<HTMLElement> = jQuery(`#mute_btn`)


	min_options = await getMinOptions()
	dropdown_time = to_time_dict(min_options)


	//options minutes
	apply_time_dict();

	btnGo.click(handleGoClick)
	btnStop.click(handleStopClick)

	countDown.hide()
	btnStop.hide()


	///////////////////////////
	////// Right  Wrapper /////
	///////////////////////////
	
	mute_btn.html('&#128266;').click(handle_mute_click)

	let dialog_btn = jQuery(`#dialog-open`)

	//rightWrapper.append(mute_btn)
	//rightWrapper.append(dialog_btn)
	dialog_btn.append(
		$(`<img src="${chrome.runtime.getURL("media/gear-icon.png")}" />`)
	);
	dialog_btn.click(handle_dialog_click);


	// progress bar
	

	let color:any = await getColor();// todo remove any here
	$("#progress_bar").css("background-color", color)
	btnGo.css("background-color", color)

	let msg = create_message([message_recievers.BACKGROUND],message_types.init_tab)
    send_message_to_backend(msg)

	$('body').css('overflow','hidden')
}




//////////////////////////////////////
////////// Functions /////////////////
//////////////////////////////////////
function updateProgressBar(percent: number) {
	progress_bar.width(percent + "%");
}

function handle_dialog_click() {
	let msg = create_message([message_recievers.ACTIVE_INJECT],message_types.open_settings_dialog)
	send_message_to_backend(msg)
}

function handle_mute_click() {
	is_muted= !is_muted

	let msg = create_message([message_recievers.BACKGROUND,message_recievers.IFRAME],message_types.is_muted,{'is_muted':is_muted})
	send_message_to_backend(msg)
}

function apply_mute(muted:boolean) {
	is_muted = muted
	if (is_muted) {
		$("#mute_btn")[0].innerHTML = "&#128263;";
		audio?.pause();
	} else {
		$("#mute_btn")[0].innerHTML = "&#128266;";
	}
}

//todo rename seconds in function
function formatedTimeSpan(fullTime:number, seconds:number) {
	let m = Math.ceil(Math.floor(seconds / 60))
	let s:number = Math.round(seconds - m * 60)
	if (s == 60) {
		m += 1
		s = 0
	}
    let min_str:string = ""+m
    let sec_str:string = ""+s
	if (m < 10)
    {
        min_str = "0" + m
    }
	if (s < 10){ 
        sec_str = "0" + s
    }
	document.title = min_str + ":" + sec_str;

	//console.log(seconds);
	if (seconds < 0) {
		updateProgressBar(100.0);
		return `<span class="toptimer-timer-countdown-minute">00</span>:<span class="toptimer-timer-countdown-second">00</span><span style="margin-left: 5px">min</span>`;
	} else {
		updateProgressBar(100.0 - (seconds / fullTime) * 100.0);
		return `<span class="toptimer-timer-countdown-minute">${min_str}</span>:<span class="toptimer-timer-countdown-second">${sec_str}</span><span style="margin-left: 5px">min</span>`;
	}
}


function playAudio(file:string) {
	if (!is_muted) {
		if (audio != undefined) {
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

async function handleGoClick() {
	playAudio("../media/engine-start.mp3");

	console.log('handleGOClick')
	let text:any = dropdownControl.val();


	let duration_s:number = 0;
	let countDownDate_ms:number = 0;
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

	start_update_intervall(countDownDate_ms, duration_s)
	let msg = create_message([message_recievers.IFRAME,message_recievers.BACKGROUND],message_types.start_timer,{ 'countDownDate_ms': countDownDate_ms, 'duration_s': duration_s })
	send_message_to_backend(msg)
	
}

function start_update_intervall(countDownDate:number, duration_in_seconds:number) {
	dropdownControl.hide()
	btnGo.hide()
	btnStop.show()
	countDown.show()
	

	const now = new Date().getTime();
	const distance = countDownDate - now;
	countDown.html(formatedTimeSpan(duration_in_seconds, distance / 1000));


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
	let msg = create_message([message_recievers.IFRAME,message_recievers.BACKGROUND],message_types.stop_timer)
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




async function responde_to_msg(msg:message, sendResponse:any) {
	console.log(msg)
	let response = new message(msg.message_type,msg.payload,msg.msg_recs)
	if (response.is_for(me)){
		if (response.message_type == message_types.progressbar_color) {
			$("#progress_bar").css("background-color", <string>response.payload['color']);
			btnGo.css("background-color", <string>response.payload['color']);
		}
		if (response.message_type == message_types.start_timer) {
			clearInterval(interval);
			start_update_intervall(<number>response.payload['countDownDate_ms'], <number>response.payload['duration_s'])
		}
		if (response.message_type == message_types.stop_timer) {
			stop_timer();
		}
		if (response.message_type == message_types.play_stop_sound) {
			playAudio("../media/ring.mp3");
		}

		if (response.message_type == message_types.is_muted) {
			apply_mute(<boolean>response.payload['is_muted']);
		}
		if (response.message_type == message_types.get_init_info) {
			apply_mute(<boolean>response.payload['is_muted']); 

			if ( <boolean>response.payload['is_running']){
				let date:number = <number>response.payload['countDownDate_ms']
				let dur:number = <number>response.payload['duration_s']
				start_update_intervall(date, dur);
			}
		}
		if (response.message_type == message_types.min_options){
			console.log(response);
			min_options = <[number]>response.payload['min_options']
			console.log(min_options);
			
			dropdown_time = to_time_dict(min_options);
			console.log("to_time_dict ",dropdown_time)
			apply_time_dict();
		}
	}
};

function to_time_dict(min_options:number[]){
	console.log(min_options);
	let min_dict:{[key:number]:string} = {};
	for (let i = 0; i < min_options.length; i++) {
		let time_in_min:number = min_options[i];
		min_dict[time_in_min] = `${time_in_min} minutes`
	}
	return min_dict
}

function apply_time_dict(){
	console.log(dropdownControl)
	dropdownControl.empty();
	for (const value in dropdown_time) {
		console.log(value)

		const label = dropdown_time[value];
		const option = $(`<option value=${value}>`);
		option.text(label);
		dropdownControl.append(option);

	}
	//other options
	dropdownControl.append('<hr>');
	const option:JQuery<HTMLElement> = $('<option value=fill_60>till full Hour</option>');
	dropdownControl.append(option);
	const option2:JQuery<HTMLElement> = $('<option value=fill_30>till half Hour</option>');
	dropdownControl.append(option2);
}