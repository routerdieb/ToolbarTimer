// set all a href to top
let finished = false;
$( document ).ready(function() {
    $('a').attr('target','_top');
	finished = true;
});


function checkFlag() {
    if(finished == false) {
		try {
			$('a').attr('target','_top');
			window.setTimeout(checkFlag, 100); /* this checks the flag every 100 milliseconds*/
		} catch (exep){
			//nothing
		}
    }
}
checkFlag();