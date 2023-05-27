function send_back_to_first(){
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
		console.log(tabs)
		console.log(tabs.length)
		
		chrome.tabs.sendMessage(tabs[0].id, {action: "open_dialog_box"}, function(response) {});  
	});
}


console.log('service worker started (background.js)');
try{
    chrome.runtime.onMessage.addListener(async function(request, sender) {
		//console.log("sender.tab.id")
		//console.log(sender.tab.id)
		console.log('running listener')
		console.log(request)
		console.log(request['type'])
        if (request.type == 'go_btn'){
			//send_back_to_all();
        }
		else if (request.type == 'setting_pane'){
			 console.log('setting pane');
			 send_back_to_all("setting_pane","open");
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
