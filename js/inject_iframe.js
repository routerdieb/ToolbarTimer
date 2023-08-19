let dialog_modal = {};

(async function () {
    // this is the code which will be injected into a given page...
    const height = '50px';
    console.log('running inject iframe')
    const IFrame = $(`<iframe src="${chrome.runtime.getURL('html/extension_iframe.html')}" id="__toptimer_iframe" height=${height}></iframe>`);
	const IFrameContainer = $("<div id='toptimer-fixed-container'></div>");
    //Init
    jQuery(document).ready(async function ($) {
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
			$('body').empty();
			
			// step two, add iframe of current site
			$(document.body).prepend(IFrame);
			
			
			let url = window.location.href
			let content_frame = $(`<iframe id="__toptimer_content_iframe" src="${url}"</iframe>`);
			$(document.body).append(content_frame);
			
			let margins = ['margin-top',"margin-bottom","margin-left","margin-right"];
			for (let i = 0; i < margins.length; i++){
				let margin_in_direction = $('body').css(margins[i]);
				IFrame.css(margins[i],"-"+margin_in_direction);
				content_frame.css(margins[i],"-"+margin_in_direction);
			}
			$('body').css('overflow','hidden');
			
		}
    })
})();




// respond to messages
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
