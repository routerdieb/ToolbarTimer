"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const exclusion2_1 = require("./exclusion2");
const messageHelper2_1 = require("./messageHelper2");
const options2_1 = require("./options2");
/*
    This is the starting point of the extension.
    Mode = 3 is currently the default.
    It injects two iframe, one for the toolbar and one for the normal website, you are trying to visit.
*/
let dialog_modal = {};
const very_long_safe_class_string = "KkJVErhPbp3FBHwt6WAI6qjW";
//console.log('running window.stop()');
//window.stop();
(function () {
    return __awaiter(this, void 0, void 0, function* () {
        if ((0, exclusion2_1.is_filtered_url)()) {
            return;
        }
        let body = document.createElement("body");
        body.setAttribute("class", very_long_safe_class_string);
        document.body = body;
        //document.body.innerHTML = "<p>Hello World!</p>";
        // this is the code which will be injected into a given page...
        const height = '50px';
        console.log('running inject iframe');
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
        let margins = ['margin-top', "margin-bottom", "margin-left", "margin-right"];
        for (let i = 0; i < margins.length; i++) {
            let margin_in_direction = $('body').css(margins[i]);
            IFrame.css(margins[i], "-" + margin_in_direction);
            content_frame.css(margins[i], "-" + margin_in_direction);
        }
        $('body').css('overflow', 'hidden');
        MutationObserver = window.MutationObserver;
        var observer = new MutationObserver(function (mutations, observer) {
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
    });
})();
function remove_old_page() {
    console.log('remove old page');
    $('body').children().not('.' + very_long_safe_class_string).not('dialog').remove();
    $(document).find('body').not('.' + very_long_safe_class_string).remove();
}
// respond to messages from background service worker
chrome.runtime.onMessage.addListener(function (response, sendResponse) {
    if (response.reciever == messageHelper2_1.message_recievers.RECIEVER_INJECT || messageHelper2_1.message_recievers.RECIEVER_ACTIVE_INJECT) {
        console.log(response);
        if (response.type == messageHelper2_1.message_types.open_settings_dialog) {
            dialog_modal = $(`<dialog data-modal class="modal settings_modal toptimer-container ${very_long_safe_class_string}"></dialog>`);
            (0, options2_1.add_inner_div_for_dialog)(dialog_modal);
            $(document.body).prepend(dialog_modal);
            const modal = document.querySelector("[data-modal]");
            modal.showModal();
            (0, options2_1.add_outside_click_detect)();
        }
        if (response.type == messageHelper2_1.message_types.close_modal) {
            $('body').css('overflow', 'hidden');
        }
    }
});
