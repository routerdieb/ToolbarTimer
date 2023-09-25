import { is_filtered_url } from "./exclusion"
import { MsgRecievers, message, MsgTypes } from "./messageHelper"
import {add_inner_div_for_dialog,add_outside_click_detect} from "./options"

/* 
	This is the starting point of the extension.
	Mode = 3 is currently the default.
	It injects two iframe, one for the toolbar and one for the normal website, you are trying to visit.
*/

const me = [ MsgRecievers.INJECT, MsgRecievers.ACTIVE_INJECT]
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
	//remove_old_page();
	let sandbox_string:string = `sandbox="allow-forms allow-modals allow-orientation-lock allow-popups allow-popups-to-escape-sandbox	 allow-presentation
		allow-same-origin allow-scripts allow-top-navigation-by-user-activation"
	`
	
	
	let content_frame = $(`<iframe id="__toptimer_content_iframe" src="${window.location.href}" ${sandbox_string} class="${very_long_safe_class_string}"</iframe>`);
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
		//console.log(mutations, observer);
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
	console.log('remove old page')
	$('body').children().not('.'+very_long_safe_class_string).not('dialog').remove()
	$(document).find('body').not('.'+very_long_safe_class_string).remove()
	$('body').css('overflow','hidden')
	$('head').remove()
}


// respond to messages from background service worker
chrome.runtime.onMessage.addListener(function (msg:message, sendResponse:any) {
	let response = new message(msg.message_type,msg.payload,msg.msg_recs)
	console.log('it works in Typescript')
    if (response.is_for(me)) {
        console.log(response);


		switch (response.message_type as MsgTypes) {
			case MsgTypes.open_settings_dialog:
				console.log('detected open settings')
            	let dialog_modal:JQuery<HTMLDialogElement> = jQuery(`<dialog data-modal id="_top_timer_modal" class="modal settings_modal toptimer-container ${very_long_safe_class_string}"></dialog>`);
            	add_inner_div_for_dialog(dialog_modal)

            	$(document.body).prepend(dialog_modal);
            	const modal = <any>document.getElementById("_top_timer_modal");
            	modal.showModal(); // todo fix showModal here (deprecated ?)

            	add_outside_click_detect();
				break; 
			case MsgTypes.close_modal:
				console.log('detected close settings')
				$('body').css('overflow','hidden');
				break;

			default:
				console.log('unknown message type')
				break;
		}

    }
});

