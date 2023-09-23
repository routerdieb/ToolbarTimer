import { is_filtered_url } from "./exclusion";
import {message_types,message_recievers,send_message_to_backend, create_message} from "./messageHelper"

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
		let msg = create_message([message_recievers.BACKGROUND], 
            message_types.Iframe_navigation,{'url':window.location.href})
		send_message_to_backend(msg)
	}
}