let finished = false;
function set_up_listening(){
	if is_filtered_url(){
		return;
	}
	$( document ).ready(function() {
		$('a').attr('target','_top');
		finished = true;
	});
	setInterval(checkFlag,1000);
}


function checkFlag() {
    if ($(".net-error").length > 0) {
		console.log('oh no');
		console.log(window.location.href);
		send_message_to_backend(RECIEVER_BACKGROUND, 'Iframe navigation',window.location.href )
	}
}