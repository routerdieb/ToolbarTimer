(async function() {
    // this is the code which will be injected into a given page...

    console.log('running inject iframe')
    const IFrame = $(`<iframe src="${chrome.runtime.getURL('html/extension_iframe.html')}" width="100%" height="50px" style="margin:0px"></iframe>`);

    //Init
    jQuery(document).ready(async function($) {
        console.log('site is ready')

        mode = 1
        if (mode == 1){
            $(document.body).prepend(IFrame);
            //IFrame.prepend(progressBar);
            //IFrame.prepend(toptimerTimer);
        }
        if (mode == 2) {
            //add to html5 header element
            $('header').prepend(progressBar);
            $('header').prepend(toptimerTimer);
        }
        if (mode == 3) {
            //add top, don't care (may work)
            $(document.body).prepend(progressBar);
            $(document.body).prepend(toptimerTimer);
        }
        if (mode == 4){
            $(document.body).prepend(IFrame);
        }


        //let color = await getColor();
        //$("#myBar").css("background-color", color)

        //close_Calendar();
        //let hideCal = await getHideCalendar();
        //console.log("hideCal" + hideCal)
        //if (hideCal) {
        //    $("#toptimer-calendar-btn").hide();
        //)
    });
})();

function playAudio(file) {
	audio = new Audio(chrome.runtime.getURL(file));
    audio.play();
    //if (!ToptimerExtension.isMuted) {
    //    if (ToptimerExtension.audio) {
    //        ToptimerExtension.audio.pause();
    //        ToptimerExtension.audio.currentTime = 0;
    //    }   
    //}
}
    