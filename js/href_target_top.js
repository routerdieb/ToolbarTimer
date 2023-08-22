console.log('i am helping');
// set all a href to top
let finished = false;
$( document ).ready(function() {
    $('a').attr('target','_top');
	finished = true;
});



setInterval(checkFlag,1000);
function checkFlag() {
    if ($(".net-error").length > 0) {
		console.log('oh no');
		console.log(window.location.href);
		send_message_to_backend(RECIEVER_BACKGROUND, 'Iframe navigation',window.location.href )
	}
}

function onload2(){
	send_message_to_backend(RECIEVER_BACKGROUND, 'Iframe navigation',window.location.href )
}