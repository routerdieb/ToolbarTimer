import {message_recievers,message,send_msg_to_content,send_msg_to_active,create_message,message_types, send_to_tab} from './messageHelper'

let are_muted = false
let current_duration_s:number = -1
let current_countDownDate_ms: number = -1
let is_running : boolean = false
let timer: NodeJS.Timeout | undefined

const me:message_recievers[] = [message_recievers.BACKGROUND]

// start listening
console.log('service worker ts version started');
try {
	chrome.runtime.onMessage.addListener(background_msg_listener);
} catch (err : unknown) { console.log(err) }

console.log('i should be listening now')
// listening to messages
async function background_msg_listener(msg:message, sender:any) {
	console.log("i run at least once")
	
	let request = new message(msg.message_type,msg.payload,msg.msg_recs)
	console.log(request);
	
	if (request.is_for(me)) {
		console.log('for me')
		if (request.message_type == message_types.start_timer) {
			if (is_running){
				clearTimeout(timer);
			}
			is_running = true
			console.log('starting background timer');
			let timeout = parseInt(<string>request.payload['duration_s']) * 1000
			timer = setTimeout(active_tab_play_stop_music, timeout);
			current_duration_s = <number>request.payload['duration_s']
			current_countDownDate_ms = <number>request.payload['countDownDate_ms']
		}

		else if (request.message_type == message_types.is_muted) {
			console.log('set are muted state')
			are_muted = <boolean>request.payload['is_muted']
		}
		else if (request.message_type == message_types.stop_timer) {
			is_running = false
			current_duration_s = -1;
			current_countDownDate_ms = -1;
			clearTimeout(timer);
		}

		else if (request.message_type == message_types.init_tab) {
			if(sender.tab != undefined && sender.tab.id != undefined){
				let message = create_message([message_recievers.ACTIVE_IFRAME], message_types.get_init_info, { 'is_muted': are_muted,'is_running':is_running, 'duration_s': current_duration_s, 'countDownDate_ms': current_countDownDate_ms })
				send_to_tab(message,sender.tab.id)
			}
		}
	}

	if (request.is_for([message_recievers.IFRAME,message_recievers.INJECT])) {
		console.log('send back to all')
		try {
			send_msg_to_content(request)
		} catch (err) { console.log(err)}
		
	}
	if (request.is_for([message_recievers.ACTIVE_IFRAME,message_recievers.ACTIVE_INJECT])) {
		console.log('send back to active')
		
		try {
			send_msg_to_active(request)
		} catch (err) { console.log(err)}
	}
	
	return true
}


function active_tab_play_stop_music() {
	console.log('sending play stop sound');
	try {
		let msg = create_message([message_recievers.ACTIVE_IFRAME], message_types.play_stop_sound)
		send_msg_to_content(msg);
	} catch (err) { console.log(err) }
	
	current_duration_s = -1
	current_countDownDate_ms = -1
}



//Try to detect an uncatched navigation event
function logURLfiltered(requestDetails:chrome.webRequest.WebRedirectionResponseDetails) {
  console.log(`Error: ${requestDetails.url}`)
  console.log(`Error: ${requestDetails.tabId}`)
  
  chrome.tabs.query( { active: true, currentWindow: true }, function( tabs ) {
		chrome.tabs.update( requestDetails.tabId, { url: requestDetails.url } )
  });
}

chrome.webRequest.onBeforeRedirect.addListener(logURLfiltered, {
  urls: ["<all_urls>"],types:["sub_frame"]
});

