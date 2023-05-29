
console.log('service worker started (background.js)');
try{
    chrome.runtime.onMessage.addListener(async function(request, sender) {
		console.log('running listener');
		console.log(request);
        if (request.type == 'go_btn'){
			//send_back_to_all();
			console.log('go_btn logic');
        }
		else if (request.type == 'setting_pane'){
			 console.log('setting pane');
			 send_back_to_all("setting_pane","open");
			 console.log('setting pane logic');
		}
		console.log('between ifs');
		console.log(!!request.reciever);
		if (!!request.reciever){
			console.log('reciver exits');
		}
		
		if (!!request.reciever && request.reciever == 1 || request.reciever == 2){
			console.log('universal logic');
			send_back_to_content(request.reciever,request.type,request.payload);
		}
		
		return true
    });
}catch(err){ console.log(err)}


function send_back_to_all(type,message_text){
	console.log('runnung send back all');
	
	chrome.tabs.query({}, function(tabs) {
    let message = {'type':type,'message_text':message_text};
    for (var i=0; i<tabs.length; ++i) {
		try{
			chrome.tabs.sendMessage(tabs[i].id, message);
		}catch(err){}
    }
	});
}

console.log('finished loading');
const RECIEVER_IFRAME = 1;
const RECIEVER_INJECT = 2;
const RECIEVER_BACKGROUND = 3;

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