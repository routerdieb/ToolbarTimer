// set all a href to top
let finished = false;
$( document ).ready(function() {
    $('a').attr('target','_top');
	finished = true;
});


function checkFlag() {
    if(flag == false) {
		$('a').attr('target','_top');
		window.setTimeout(checkFlag, 100); /* this checks the flag every 100 milliseconds*/
    }
}
checkFlag();