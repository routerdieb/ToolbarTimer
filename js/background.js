function send_back_to_first(){
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
		console.log(tabs)
		console.log(tabs.length)
		
		chrome.tabs.sendMessage(tabs[0].id, {action: "open_dialog_box"}, function(response) {});  
	});
}


function send_back_to_all(){
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
		console.log(tabs)
		console.log(tabs.length)
		for tab in tabs{
			chrome.tabs.sendMessage(tab.id, {action: "open_dialog_box"}, function(response) {});
		}			
	});
}


console.log('service worker started (background.js)');
try{
    chrome.runtime.onMessage.addListener(async function(request, sender) {
		//console.log("sender.tab.id")
		//console.log(sender.tab.id)
		console.log('running listener')
		console.log(request)
        if (request.type == "hello"){
            console.log('hello');
			send_back();
        }
    });
}catch(err){}

