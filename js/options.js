async function openSettingPane(){
    $('#settings-btn').prop('disabled', true);
    html_overflow = '<div id="toptimer__overflow"></div>';
    $(document.body).append(html_overflow);
  
    const html_container = "<div id=\"toptimer__settingPaneContainer\">";
    const html_setting_pane = "<div id=\"toptimer__settingPane\" class=\"toptimer\"> Settings <hr> ...</div>";
    const html = html_container + html_setting_pane + "</div>";
    $(document.body).append(html);
    const optionsCloseButton = "<button id=\"optionsClose-btn\" class=\"btn toptimer\" type=\"button\">X</button>";
    $("#toptimer__settingPane").append(optionsCloseButton);
    $("#optionsClose-btn").click(closeSettingsPane);
    $("#toptimer__settingPane").append("Shows your Colour:</br>");
  
  
    $("#toptimer__settingPane").append("Google Calendar:</br>");
    $("#toptimer__settingPane").click((event)=> {
      event.stopPropagation();
      console.log('stopPropagation');
    });
    $('#toptimer__settingPaneContainer').click(closeSettingsPane);//masks the overflow thing for some reason
  
    $("#toptimer__settingPane").append("Font:</br>");
  
    create_hide_cal_checkbox();
    $('#cb-hide-calendarLabel').click(function(){
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
    $('body').css({'overflow':'hidden'});
    $(document).bind('scroll',function () { 
         window.scrollTo(0,0); 
    });
  
    //
    $(document).keydown(function(event) {
      
      if (event.key === "Escape") {
        console.log("esc was pressed");
        closeSettingsPane();
      }
    });
  
    
      
    
}


function closeSettingsPane(){
  console.log("closeSettings Called")
    $('#toptimer__overflow').remove();
    $('#toptimer__settingPaneContainer').remove();
    //unlock scrolling
    $(document).unbind('scroll'); 
    $('body').css({'overflow':'visible'});
    $('#settings-btn').prop('disabled', false);
}

function create_hide_cal_checkbox(){
  $("#toptimer__settingPane").append('<label for="accept" id="cb-hide-calendarLabel"><input type="checkbox" id="cb-hide-calendar" name="accept" value="yes">  Hide the Calendar </label>');
}


function create_SetCalendarText(){
  const calContainer = $('<div id="calContainer"><label for="calLink">Insert Google Calendar Link:</label><input type="text" id="calLink" name="calLink"><br></div>');
  const set_button = $('<button type="button">Set!</button>');
  calContainer.append(set_button);
  $("#toptimer__settingPane").append(calContainer);
}