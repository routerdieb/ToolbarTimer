(async function() {
    // this is the code which will be injected into a given page...
	const height = '50px';
    console.log('running inject iframe')
	const IFrame = $(`<iframe src="${chrome.runtime.getURL('html/extension_iframe.html')}" width="100%" height=${height} style="margin:0px"></iframe>`);

    //Init
    jQuery(document).ready(async function($) {
        console.log('site is ready');

        mode = 1
        if (mode == 1){
            $(document.body).prepend(IFrame);
            // continuing add-toolbar.js
        }
        if (mode == 2) {
            var bodyStyle = document.body.style;
			var cssTransform = 'transform' in bodyStyle ? 'transform' : 'webkitTransform';
			bodyStyle[cssTransform] = 'translateY(' + height + ')';
        }
        if (mode == 3) {
            //add top, don't care (may work)
            $(document.body).prepend(progressBar);
            $(document.body).prepend(toptimerTimer);
        }
	})
})();




// respond to messages
chrome.runtime.onMessage.addListener(function (response, sendResponse) {
	console.log(response);
	if (response.type == 'setting_pane'){
		openSettingPane();
	}
});