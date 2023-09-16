"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const exclusion2_1 = require("./exclusion2");
const messageHelper2_1 = require("./messageHelper2");
let finished = false;
function set_up_listening() {
    if ((0, exclusion2_1.is_filtered_url)()) {
        return;
    }
    $(document).ready(function () {
        $('a').attr('target', '_top');
        finished = true;
    });
    setInterval(checkFlag, 1000);
}
set_up_listening();
function checkFlag() {
    if ($(".net-error").length > 0) {
        console.log('oh no');
        console.log(window.location.href);
        (0, messageHelper2_1.send_message_to_backend)(messageHelper2_1.message_recievers.RECIEVER_BACKGROUND, messageHelper2_1.message_types.Iframe_navigation, { 'url': window.location.href });
    }
}
