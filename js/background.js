let are_muted = false;
let current_duration_s = undefined;
let current_countDownDate_ms = undefined;

// messageing
console.log('service worker started (background.js)');
try{
    chrome.runtime.onMessage.addListener(background_msg_listener);
}catch(err){ console.log(err)}

async function background_msg_listener(request,sender){
	console.log('running listener v2');
	console.log(request);
        
	if (request.reciever == 3){
		console.log('msg for me !!');
		if (request.type == 'start_timer'){
			console.log('starting background timer');
			let timeout = parseInt(request.payload['duration_s'])*1000
			setTimeout(active_tab_play_stop_music, timeout );
			current_duration_s = request.payload['duration_s']
			current_countDownDate_ms = request.payload['countDownDate_ms']
		}
		
		if (request.type == 'is_muted'){
			are_muted = request.payload['is_muted']
		}
		if (request.type == 'stop_timer'){
			current_duration_s = undefined;
			current_countDownDate_ms = undefined;
		}
		
		if (request.type == 'init_tab'){
			awnser_tab(sender.tab.id)
		}
	}
		
	if (request.reciever == 1 || request.reciever == 2){
		console.log('send back to all');
		send_back_to_content(request.reciever,request.type,request.payload);
	}
	if (request.reciever == 4 || request.reciever == 5){
		console.log('send back to active');
		send_back_to_active(request.reciever,request.type,request.payload);
	}
	return true;
}

// A function to get the current content options
function new_tab(){}

function active_tab_play_stop_music(){
	console.log('sending play stop sound');
	send_back_to_active(1,'play_stop_sound',{});
	current_duration_s = undefined;
	current_countDownDate_ms = undefined;
}



function awnser_tab(tab_id){
	let message = create_message(RECIEVER_IFRAME,'get_init_info',{'is_muted':are_muted,'duration_s':current_duration_s,'countDownDate_ms':current_countDownDate_ms})
	try{
		chrome.tabs.sendMessage(tab_id, message);
	}catch(err){}
}

// HERE come the copy of message Helper.js

console.log('finished loading');
const RECIEVER_IFRAME = 1;
const RECIEVER_INJECT = 2;
const RECIEVER_BACKGROUND = 3;
const RECIEVER_ACTIVE_IFRAME = 4;
const RECIEVER_ACTIVE_INJECT = 5;

function create_message(reciever, type, payload){
	return {'reciever':reciever,'type':type, 'payload':payload}
}

function send_message_to_backend(reciever, type, payload){
	message = create_message(reciever, type, payload)
	chrome.runtime.sendMessage(message);
}


function send_back_to_content(reciever, type, payload){
	chrome.tabs.query({}, function(tabs) {
    let message = create_message(reciever, type, payload);
    for (var i=0; i<tabs.length; ++i) {
		try{
			chrome.tabs.sendMessage(tabs[i].id, message);
		}catch(err){}
    }
	});
}

function send_back_to_active(reciever, type, payload){
	chrome.tabs.query({ currentWindow: true, active: true }, function(tabs) {
    let message = create_message(reciever, type, payload);
    for (var i=0; i<tabs.length; ++i) {
		try{
			chrome.tabs.sendMessage(tabs[i].id, message);
		}catch(err){}
    }
	});
}


// END of FILE