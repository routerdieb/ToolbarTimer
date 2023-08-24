/* 
	This is the starting point of the extension.
	Mode = 3 is currently the default.
	It injects two iframe, one for the toolbar and one for the normal website, you are trying to visit.
*/
let dialog_modal = {};


const very_long_safe_class_string = "KkJVErhPbp3FBHwt6WAI6qjW";



//console.log('running window.stop()');
//window.stop();
(async function () {
	const filterlist = ["stackoverflow.com"];
	for (filter_url of filterlist) {
		if(document.URL.indexOf(filter_url) > -1){
			return;
		}
	}
		
	
	console.log('stopped the window');
	document.body = document.createElement("body");
	document.body.innerHTML = "<p>Hello World!</p>";
	
	
	
    // this is the code which will be injected into a given page...
    const height = '50px';
    console.log('running inject iframe')
    const IFrame = $(`<iframe class="${very_long_safe_class_string}" src="${chrome.runtime.getURL('html/extension_iframe.html')}" id="__toptimer_iframe" height='${height}'></iframe>`);
    //Init
  
        console.log('site is ready');

        mode = 3;
		include_strategy = ['.topnav','.pagetop','header']
		if (mode == 0){ // something about adding to already floating element
			for (i = 0; i < include_strategy.length; i++) {
				string = include_strategy[i];
				console.log('trying '+string);
				
				if ($(string).length){
					if ($(string).length > 1){
						$(string)[0].prepend(IFrame);
					}else{
						$(string).prepend(IFrame);
					}
					
					
					console.log(string);
					return;
				}
			}
			//$(document.body).prepend(IFrame);
			//console.log('body');
		}
        if (mode == 1) {
            $(document.body).prepend(IFrame);
			
			let margins = ['margin-top',"margin-bottom","margin-left","margin-right"];
			for (let i = 0; i < margins.length; i++){
				let margin_in_direction = $('body').css(margins[i]);
				IFrame.css(margins[i],"-"+margin_in_direction);
			}
			
            // continuing add-toolbar.js
        }
        if (mode == 2) { // old something transform
            var bodyStyle = document.body.style;
            var cssTransform = 'transform' in bodyStyle ? 'transform' : 'webkitTransform';
            bodyStyle[cssTransform] = 'translateY(' + height + ')';
        }
		
		if (mode == 3) {
			// step one clear body
			remove_old_page();
			
			let content_frame = $(`<iframe id="__toptimer_content_iframe" src="${window.location.href}" class="${very_long_safe_class_string}"</iframe>`);
			$(document.body).prepend(content_frame);
			// step two, add iframe of current site
			$(document.body).prepend(IFrame);
			content_frame.show();
			
			let margins = ['margin-top',"margin-bottom","margin-left","margin-right"];
			for (let i = 0; i < margins.length; i++){
				let margin_in_direction = $('body').css(margins[i]);
				IFrame.css(margins[i],"-"+margin_in_direction);
				content_frame.css(margins[i],"-"+margin_in_direction);
			}
			$('body').css('overflow','hidden');
		}
    
})();


function remove_old_page(){
	$('body').find('*').not('.'+very_long_safe_class_string).remove();
}


MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

var observer = new MutationObserver(function(mutations, observer) {
    // fired when a mutation occurs
    console.log(mutations, observer);
    // ...
	remove_old_page();
});

// define what element should be observed by the observer
// and what types of mutations trigger the callback
observer.observe(document.body, {
  subtree: false,
  childList: true,
});



// respond to messages from background service worker
chrome.runtime.onMessage.addListener(function (response, sendResponse) {
    if (response.reciever == RECIEVER_INJECT || response.reciever == RECIEVER_ACTIVE_INJECT) {
        console.log(response);
        if (response.type == 'open_settings_dialog') {
            dialog_modal = $('<dialog data-modal class="modal settings_modal toptimer-container"></dialog>');
            add_inner_div_for_dialog(dialog_modal)

            $(document.body).prepend(dialog_modal);
            const modal = document.querySelector("[data-modal]")
            modal.showModal();

            add_outside_click_detect();
        }
		if (response.type == 'close_modal'){
			$('body').css('overflow','hidden');
		}
    }
});
