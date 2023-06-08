
async function openSettingPane() {
    $('#settings-btn').prop('disabled', true);
    html_overflow = '<div id="toptimer__overflow">';
    $(document.body).append(html_overflow);

    const html_container = '<div id="toptimer__settingPaneContainer" class="toptimer-container">';
    const html_setting_pane = '<div id="toptimer__settingPane" class="toptimer __TTsubTitle">Settings <hr >';
    const html = html_container + html_setting_pane;
    $(document.body).append(html);
    const optionsCloseButton = '<button id="optionsClose-btn" class="btn toptimer" type="button">X</button>';
    $("#toptimer__settingPane").append(optionsCloseButton);
    $("#optionsClose-btn").click(closeSettingsPane);
    $("#toptimer__settingPane").append('<div class="line"> Select your Colour:</br>');

    $("#toptimer__settingPane").append(create_color_buttons());
    AddColorBoxClickListener();

    $("#toptimer__settingPane").click((event) => {
        event.stopPropagation();
        console.log('stopPropagation');
    });
    $('#toptimer__settingPaneContainer').click(closeSettingsPane); //masks the overflow thing for some reason

    

    //lock scrolling
    $('body').css({ 'overflow': 'hidden' });
    $(document).bind('scroll', function() {
        window.scrollTo(0, 0);
    });

    //
    $(document).keydown(function(event) {

        if (event.key === "Escape") {
            console.log("esc was pressed");
            closeSettingsPane();
        }
    });

}




function closeSettingsPane() {
    console.log("closeSettings Called")
    $('#toptimer__overflow').remove();
    $('#toptimer__settingPaneContainer').remove();
    //unlock scrolling
    $(document).unbind('scroll');
    $('body').css({ 'overflow': 'visible' });
    $('#settings-btn').prop('disabled', false);
}


////////

let colors = ['red', 'green', 'blue', 'orange','yellow']

function create_color_buttons() {
    string = '<div id="colorContainer">'
    for (const color of colors) {
        string += '<button id="' + color + 'box" yellow class="' + color + ' colorbox"></button>'
    }
    return string + '</div><br>'

}



function AddColorBoxClickListener() {
    string = ""
    for (const color of colors) {
        $('#' + color + 'box').click(() => {
            console.log("clicked the colorbox" + color);
            setColor(color);
			send_message_to_backend(RECIEVER_IFRAME,'progressbar_color',color);
        })
    }
    return string

}