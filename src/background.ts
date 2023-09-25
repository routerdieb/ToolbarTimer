import {MsgRecievers,message,send_msg_to_content,send_msg_to_active,create_message,MsgTypes, send_to_specific_tab} from './messageHelper'

let are_muted = false
let current_duration_s:number = -1
let current_countDownDate_ms: number = -1
let is_running : boolean = false
let timer: NodeJS.Timeout | undefined

const me:MsgRecievers[] = [MsgRecievers.BACKGROUND]

// start listening
console.log('service worker ts version started');
try {
	chrome.runtime.onMessage.addListener(background_msg_listener);
} catch (err : unknown) { console.log(err) }

console.log('last thing ???')

// listening to messages
async function background_msg_listener(msg:message, sender:any) {
	
	let request = new message(msg.message_type,msg.payload,msg.msg_recs)
	console.log(request);
	
	if (request.is_for(me)) {
		switch(request.message_type as MsgTypes){
			case MsgTypes.start_timer:
				if (is_running){
					clearTimeout(timer);
				}
				is_running = true
				console.log('starting background timer');
				let timeout = parseInt(<string>request.payload['duration_s']) * 1000
				timer = setTimeout(active_tab_play_stop_music, timeout);
				current_duration_s = <number>request.payload['duration_s']
				current_countDownDate_ms = <number>request.payload['countDownDate_ms']
				break;
			case MsgTypes.stop_timer:
				is_running = false
				current_duration_s = -1;
				current_countDownDate_ms = -1;
				clearTimeout(timer);
				break;
			case MsgTypes.is_muted:
				are_muted = <boolean>request.payload['is_muted']
				break;
			case MsgTypes.init_tab:
				if(sender.tab != undefined && sender.tab.id != undefined){
					let message = create_message([MsgRecievers.ACTIVE_IFRAME], MsgTypes.get_init_info, { 'is_muted': are_muted,'is_running':is_running, 'duration_s': current_duration_s, 'countDownDate_ms': current_countDownDate_ms })
					send_to_specific_tab(message,sender.tab.id)
				}
				break;
		}
	}else{// not for me
		forward(request)
	}
	
	return true
}

console.log('parsing forward')
function forward(request:message){
	/*
		Could be for multible at once.
	*/
	if (request.is_for([MsgRecievers.IFRAME,MsgRecievers.INJECT])) {
		console.log('send back to all')
		try {
			send_msg_to_content(request)
		} catch (err) { console.log(err)}
		
	}
	if (request.is_for([MsgRecievers.ACTIVE_IFRAME,MsgRecievers.ACTIVE_INJECT])) {
		console.log('send back to active')
		
		try {
			send_msg_to_active(request)
		} catch (err) { console.log(err)}
	}
}


function active_tab_play_stop_music() {
	console.log('sending play stop sound');
	try {
		let msg = create_message([MsgRecievers.ACTIVE_IFRAME], MsgTypes.play_stop_sound)
		send_msg_to_content(msg);
	} catch (err) { console.log(err) }
	
	current_duration_s = -1
	current_countDownDate_ms = -1
}


console.log('add navigation listener')
function logOnBefore(details:any) {
	console.log(typeof(details.frameType))
	if (details.frameType == "sub_frame"){
		console.log(`onBeforeNavigate to: ${details.url}`);
		console.log('frameId',details.frameId)
		console.log('tabId',details.tabId)
		console.log(details.frameType)
		console.log(details.parentFrameId)
		console.log('url', details.url)
	}

	
}
  
chrome.webNavigation.onBeforeNavigate.addListener(logOnBefore); 