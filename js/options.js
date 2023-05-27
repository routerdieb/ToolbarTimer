async function openSettingPane() {
    $('#settings-btn').prop('disabled', true);
    html_overflow = '<div id="toptimer__overflow">';
    $(document.body).append(html_overflow);

    const html_container = '<div id="toptimer__settingPaneContainer">';
    const html_setting_pane = '<div id="toptimer__settingPane" class="toptimer __TTsubTitle">Settings <hr >';
    const html = html_container + html_setting_pane;
    $(document.body).append(html);
    const optionsCloseButton = '<button id="optionsClose-btn" class="btn toptimer" type="button">X</button>';
    $("#toptimer__settingPane").append(optionsCloseButton);
    $("#optionsClose-btn").click(closeSettingsPane);
    $("#toptimer__settingPane").append('<div class="line"> Select your Colour:</br>');

    $("#toptimer__settingPane").append(create_color_div());
    AddColorBoxClickListener();

    $("#toptimer__settingPane").append('<div class="line __TTsubTitle">Google Calendar:');
    $("#toptimer__settingPane").click((event) => {
        event.stopPropagation();
        console.log('stopPropagation');
    });
    $('#toptimer__settingPaneContainer').click(closeSettingsPane); //masks the overflow thing for some reason

    create_hide_cal_checkbox();
    $('#__TTcb-hide-calendarLabel').click(function() {
        console.log("clicked checkbox");
        if ($('#cb-hide-calendar')[0].checked) {
            $("#toptimer-calendar-btn").hide();
            console.log("hide cal");
            setHideCalendar(true);
        } else {
            $("#toptimer-calendar-btn").show();
            console.log("show cal");
            setHideCalendar(false);
        }
    });
    $('#cb-hide-calendar')[0].checked = await getHideCalendar();

    create_SetCalendarText();

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

    $('#setCal').click(() => {
        val = $('#calLink').val()
        if (val.startsWith('<iframe') && val.contains('google')) {
            setCalendar(val)
        } else {
            showErrorMsg('This is not an Google Embed Link');
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

function create_hide_cal_checkbox() {
    $("#toptimer__settingPane").append('<label for="accept" id="__TTcb-hide-calendarLabel"><input type="checkbox" id="cb-hide-calendar" name="accept" value="yes">  Hide the Calendar Button</label>');
}


function create_SetCalendarText() {
    const calContainer = $('<div id="calContainer"><label for="calLink">Insert Google Calendar embedd Link:</label><br><input type="text" id="calLink" name="calLink">');
    const set_button = $('<button id="setCal" type="button">Set!</button>');
    calContainer.append(set_button);
    $("#toptimer__settingPane").append(calContainer);
}



////////

let colors = ['red', 'green', 'blue', 'orange']

function create_color_div() {
    string = '<div id="colorContainer">'
    for (const color of colors) {
        string += '<div id=' + color + 'box class="' + color + ' colorbox"></div>'
    }
    return string + '</div><br>'

}



function AddColorBoxClickListener() {
    string = ""
    for (const color of colors) {
        $('#' + color + 'box').click(() => {
            console.log("clicked the colorbox" + color)
            $("#myBar").css("background-color", color)
            setColor(color)
        })
    }
    return string

}