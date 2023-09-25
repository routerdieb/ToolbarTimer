import { is_filtered_url } from "./exclusion";
import {MsgTypes,MsgRecievers,send_message_to_backend, create_message} from "./messageHelper"

let finished:boolean = false;
function set_up_listening(){
	if (is_filtered_url()){
		return;
	}
	$( document ).ready(function() {
		$('a').attr('target','_top');
		finished = true;
	});
	setInterval(checkFlag,1000);
}
set_up_listening();

function checkFlag() {
    if ($(".net-error").length > 0) {
		console.log('oh no');
		console.log(window.location.href);
		let msg = create_message([MsgRecievers.BACKGROUND], 
            MsgTypes.iframe_navigation,{'url':window.location.href})
		send_message_to_backend(msg)
	}
}