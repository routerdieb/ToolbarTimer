
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
		console.log(!!request.reciver);
		if (!!request.reciver){
			console.log('reciver exits');
		}
		
		if (!!request.reciver && request.reciver == 1 || request.reciver == 2){
			console.log('universal logic');
			send_back_to_content(request.reciver,request.type,request.payload);
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
