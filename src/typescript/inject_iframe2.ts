import { is_filtered_url } from "./exclusion2"
import { message_recievers, message_type, message_types } from "./messageHelper2"
import {add_inner_div_for_dialog,add_outside_click_detect} from "./options2"

/* 
	This is the starting point of the extension.
	Mode = 3 is currently the default.
	It injects two iframe, one for the toolbar and one for the normal website, you are trying to visit.
*/
let dialog_modal = {}


const very_long_safe_class_string = "KkJVErhPbp3FBHwt6WAI6qjW";



//console.log('running window.stop()');
//window.stop();
(async function () {
	if(is_filtered_url()){
		return;
	}
	
	let body = document.createElement("body")
	body.setAttribute("class",very_long_safe_class_string)
	
	document.body = body;
	//document.body.innerHTML = "<p>Hello World!</p>";
	
	
	
    // this is the code which will be injected into a given page...
    const height = '50px';
    console.log('running inject iframe')
    const IFrame = $(`<iframe class="${very_long_safe_class_string}" src="${chrome.runtime.getURL('html/extension_iframe.html')}" id="__toptimer_iframe" height="50px"></iframe>`);
    //Init
  
        console.log('site is ready');

		
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
		
		
		MutationObserver = window.MutationObserver;

	var observer = new MutationObserver(function(mutations, observer) {
		// fired when a mutation occurs
		console.log(mutations, observer);
		// ...
		remove_old_page();
	});
	// define what element should be observed by the observer
// and what types of mutations trigger the callback
observer.observe(document.documentElement, {
  subtree: false,
  childList: true,
});
    
})();


function remove_old_page():void{
	console.log('remove old page');
	$('body').children().not('.'+very_long_safe_class_string).not('dialog').remove();
	$(document).find('body').not('.'+very_long_safe_class_string).remove();
}


// respond to messages from background service worker
chrome.runtime.onMessage.addListener(function (response:message_type, sendResponse:chrome.runtime.MessageSender) {
    if (response.reciever == message_recievers.RECIEVER_INJECT || message_recievers.RECIEVER_ACTIVE_INJECT) {
        console.log(response);
        if (response.type == message_types.open_settings_dialog) {
            dialog_modal = $(`<dialog data-modal class="modal settings_modal toptimer-container ${very_long_safe_class_string}"></dialog>`);
            add_inner_div_for_dialog(dialog_modal)

            $(document.body).prepend(dialog_modal);
            const modal = document.querySelector("[data-modal]")
            modal!.showModal();


            add_outside_click_detect();
        }
		if (response.type == message_types.close_modal){
			$('body').css('overflow','hidden');
		}
    }
});
