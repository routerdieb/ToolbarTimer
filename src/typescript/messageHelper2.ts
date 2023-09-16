// enum with message recievers
export enum message_recievers{
    RECIEVER_IFRAME = 1,
    RECIEVER_INJECT,
    RECIEVER_BACKGROUND,
    RECIEVER_ACTIVE_IFRAME,
    RECIEVER_ACTIVE_INJECT
}

// enum with message_types
export enum message_types{
    start_timer,
    stop_timer,
    is_muted,
    init_tab,
    open_settings_dialog,
    close_modal,
    play_stop_sound,
    get_init_info,
    Iframe_navigation,
    progressbar_color,
    min_options
}

class message {
    message_type:message_types
    message_reciever: message_recievers
    payload: any

    constructor(message_reciever: message_recievers, message_type:message_types,payload: any){
        this.message_reciever = message_reciever
        this.message_type = message_type
        this.payload = payload
    }
}

// Todo: Remove all the things below and write message.send function

export type message_type = {
    'reciever': message_recievers,
    'type': message_types,
    'payload': {[key:string]:any}
}

export function create_message(reciever: message_recievers, type:message_types, payload?:any):message_type {
    let msg:message_type = { 'reciever': reciever, 'type': type, 'payload': payload }
	return msg
}


export function send_message_to_backend(reciever:message_recievers, type:message_types, payload?:{[key:string]:any}) {
	let message = create_message(reciever, type, payload)
	chrome.runtime.sendMessage(message);
}

// todo merge send back to content with send back to active based on recivers
export function send_back_to_content(reciever:message_recievers, type:message_types, payload?:{[key:string]:any}) {
	chrome.tabs.query({}, function (tabs:any) {
		let message = create_message(reciever, type, payload);
		for (var i = 0; i < tabs.length; ++i) {
			try {
				chrome.tabs.sendMessage(tabs[i].id, message);
			} catch (err) { }
		}
	});
}

export function send_back_to_active(reciever:message_recievers, type:message_types, payload?:{[key:string]:any}) {
	chrome.tabs.query({ currentWindow: true, active: true }, function (tabs:any) {
		let message = create_message(reciever, type, payload);
		for (var i = 0; i < tabs.length; ++i) {
			try {
				chrome.tabs.sendMessage(tabs[i].id, message);
			} catch (err) { }
		}
	});
}