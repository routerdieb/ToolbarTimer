// enum with message recievers
export const enum message_recievers{
    IFRAME = 1,
    INJECT,
    BACKGROUND,
    ACTIVE_IFRAME,
    ACTIVE_INJECT
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

export class message {
    public message_type:message_types
    msg_recs: message_recievers[]
    public payload: {[key: string]: string | number | boolean | number[]}

    constructor(message_type:message_types ,payload: {[key: string]: string | number | boolean | number[]},message_reciever: message_recievers[]){
        this.msg_recs = message_reciever
        this.message_type = message_type
        this.payload = payload
    }

    is_for(roles:message_recievers[]):boolean {
        for(let i = 0; i < roles.length;i++){
            let rolle = roles[i]
            if(this.msg_recs.indexOf(rolle) !== -1){
                return true
            }
        }
        return false
    }
}



// Todo: Remove all the things below and write message.send function

export function create_message(recievers: message_recievers[],type:message_types, payload?: {[key: string]: string | number | boolean | number[]}):message {
    let msg:message    
    if (payload != undefined){
        msg = new message( type, payload,recievers)
    }else{
        msg = new message( type, {}, recievers)
    }
	return msg
}


export function send_message_to_backend(msg:message) {
    try{
	    chrome.runtime.sendMessage(msg);
    } catch(err) {}
}

// todo merge send back to content with send back to active based on recivers
export function send_msg_to_content(msg:message) {
	chrome.tabs.query({}, function (tabs:any) {
		
		for (var i = 0; i < tabs.length; ++i) {
			try {
				chrome.tabs.sendMessage(tabs[i].id, msg);
			} catch (err) { }
		}
	});
}

export function send_msg_to_active(msg:message) {
	chrome.tabs.query({ currentWindow: true, active: true }, function (tabs:any) {
		for (var i = 0; i < tabs.length; ++i) {
			try {
				chrome.tabs.sendMessage(tabs[i].id, msg);
			} catch (err) { }
		}
	});
}

export function send_to_tab(msg:message, tabID:number){
    console.log(tabID,typeof(tabID))
    console.log(msg,typeof(msg))
    try {
		chrome.tabs.sendMessage(tabID,msg);
	} catch (err) { console.log('issue with init tab');console.log(err) }
}