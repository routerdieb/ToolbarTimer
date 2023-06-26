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

        mode = 1;
		include_strategy = ['.topnav','.pagetop','header']
		if (mode == 0){
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
			console.log("i am working");
            $(document.body).prepend(IFrame);
			
			let margins = ['margin-top',"margin-bottom","margin-left","margin-right"];
			for (let i = 0; i < margins.length; i++){
				let margin_in_direction = $('body').css(margins[i]);
				IFrame.css(margins[i],"-"+margin_in_direction);
			}
			var margin_top = $('body').css("margin-top");
			
			
			console.log("i am working2");
            // continuing add-toolbar.js
        }
        if (mode == 2) {
            var bodyStyle = document.body.style;
            var cssTransform = 'transform' in bodyStyle ? 'transform' : 'webkitTransform';
            bodyStyle[cssTransform] = 'translateY(' + height + ')';
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
    }
});
