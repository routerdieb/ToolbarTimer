const RECIEVER_IFRAME = 1;
const RECIEVER_INJECT = 2;
const RECIEVER_BACKGROUND = 3;

function create_message(reciever, type, payload){
	return {'reciver':reciever,'type':type, 'payload':payload}
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