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
const messageHelper2_1 = require("./messageHelper2");
let are_muted = false;
let current_duration_s = -1;
let current_countDownDate_ms = -1;
let timer = -1;
// start listening
console.log('service worker ts version started');
try {
    chrome.runtime.onMessage.addListener(background_msg_listener);
}
catch (err) {
    console.log(err);
}
// listening to messages
function background_msg_listener(request, sender) {
    return __awaiter(this, void 0, void 0, function* () {
        if (request.reciever == 3) {
            if (request.type == messageHelper2_1.message_types.start_timer) {
                console.log('starting background timer');
                let timeout = parseInt(request.payload['duration_s']) * 1000;
                timer = setTimeout(active_tab_play_stop_music, timeout);
                current_duration_s = request.payload['duration_s'];
                current_countDownDate_ms = request.payload['countDownDate_ms'];
            }
            if (request.type == messageHelper2_1.message_types.is_muted) {
                are_muted = request.payload['is_muted'];
            }
            if (request.type == messageHelper2_1.message_types.stop_timer) {
                current_duration_s = -1;
                current_countDownDate_ms = -1;
                clearTimeout(timer);
            }
            if (request.type == messageHelper2_1.message_types.init_tab) {
                if (sender.tab != undefined && sender.tab.id != undefined) {
                    awnser_tab(sender.tab.id);
                }
            }
        }
        if (request.reciever == 1 || request.reciever == 2) {
            console.log('send back to all');
            (0, messageHelper2_1.send_back_to_content)(request.reciever, request.type, request.payload);
        }
        if (request.reciever == 4 || request.reciever == 5) {
            console.log('send back to active');
            (0, messageHelper2_1.send_back_to_active)(request.reciever, request.type, request.payload);
        }
        return true;
    });
}
function active_tab_play_stop_music() {
    console.log('sending play stop sound');
    (0, messageHelper2_1.send_back_to_content)(messageHelper2_1.message_recievers.RECIEVER_ACTIVE_IFRAME, messageHelper2_1.message_types.play_stop_sound, {});
    current_duration_s = -1;
    current_countDownDate_ms = -1;
}
function awnser_tab(tab_id) {
    let message = (0, messageHelper2_1.create_message)(messageHelper2_1.message_recievers.RECIEVER_ACTIVE_IFRAME, messageHelper2_1.message_types.get_init_info, { 'is_muted': are_muted, 'duration_s': current_duration_s, 'countDownDate_ms': current_countDownDate_ms });
    try {
        chrome.tabs.sendMessage(tab_id, message);
    }
    catch (err) { }
}
// Try to detect an uncatched navigation event
function logURLfiltered(requestDetails) {
    console.log(`Error: ${requestDetails.url}`);
    console.log(`Error: ${requestDetails.tabId}`);
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.update(requestDetails.tabId, { url: requestDetails.url });
    });
}
chrome.webRequest.onBeforeRedirect.addListener(logURLfiltered, {
    urls: ["<all_urls>"], types: ["sub_frame"]
});
