"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.send_back_to_active = exports.send_back_to_content = exports.send_message_to_backend = exports.create_message = exports.message_types = exports.message_recievers = void 0;
// enum with message recievers
var message_recievers;
(function (message_recievers) {
    message_recievers[message_recievers["RECIEVER_IFRAME"] = 1] = "RECIEVER_IFRAME";
    message_recievers[message_recievers["RECIEVER_INJECT"] = 2] = "RECIEVER_INJECT";
    message_recievers[message_recievers["RECIEVER_BACKGROUND"] = 3] = "RECIEVER_BACKGROUND";
    message_recievers[message_recievers["RECIEVER_ACTIVE_IFRAME"] = 4] = "RECIEVER_ACTIVE_IFRAME";
    message_recievers[message_recievers["RECIEVER_ACTIVE_INJECT"] = 5] = "RECIEVER_ACTIVE_INJECT";
})(message_recievers || (exports.message_recievers = message_recievers = {}));
// enum with message_types
var message_types;
(function (message_types) {
    message_types[message_types["start_timer"] = 0] = "start_timer";
    message_types[message_types["stop_timer"] = 1] = "stop_timer";
    message_types[message_types["is_muted"] = 2] = "is_muted";
    message_types[message_types["init_tab"] = 3] = "init_tab";
    message_types[message_types["open_settings_dialog"] = 4] = "open_settings_dialog";
    message_types[message_types["close_modal"] = 5] = "close_modal";
    message_types[message_types["play_stop_sound"] = 6] = "play_stop_sound";
    message_types[message_types["get_init_info"] = 7] = "get_init_info";
    message_types[message_types["Iframe_navigation"] = 8] = "Iframe_navigation";
    message_types[message_types["progressbar_color"] = 9] = "progressbar_color";
    message_types[message_types["min_options"] = 10] = "min_options";
})(message_types || (exports.message_types = message_types = {}));
class message {
    constructor(message_reciever, message_type, payload) {
        this.message_reciever = message_reciever;
        this.message_type = message_type;
        this.payload = payload;
    }
}
function create_message(reciever, type, payload) {
    let msg = { 'reciever': reciever, 'type': type, 'payload': payload };
    return msg;
}
exports.create_message = create_message;
function send_message_to_backend(reciever, type, payload) {
    let message = create_message(reciever, type, payload);
    chrome.runtime.sendMessage(message);
}
exports.send_message_to_backend = send_message_to_backend;
// todo merge send back to content with send back to active based on recivers
function send_back_to_content(reciever, type, payload) {
    chrome.tabs.query({}, function (tabs) {
        let message = create_message(reciever, type, payload);
        for (var i = 0; i < tabs.length; ++i) {
            try {
                chrome.tabs.sendMessage(tabs[i].id, message);
            }
            catch (err) { }
        }
    });
}
exports.send_back_to_content = send_back_to_content;
function send_back_to_active(reciever, type, payload) {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        let message = create_message(reciever, type, payload);
        for (var i = 0; i < tabs.length; ++i) {
            try {
                chrome.tabs.sendMessage(tabs[i].id, message);
            }
            catch (err) { }
        }
    });
}
exports.send_back_to_active = send_back_to_active;
