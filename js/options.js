function openSettingPane(){
    $('#settings-btn').prop('disabled', true);
    const html_overflow = "<div id=\"toptimer__overflow\"></div>";
    $(document.body).append(html_overflow);
  
    const html_container = "<div id=\"toptimer__settingPaneContainer\">";
    const html_setting_pane = "<div id=\"toptimer__settingPane\" class=\"toptimer\"> This is the settings page. Show me the text !! <\br> Where is the text.<\div>";
    const html = html_container + html_setting_pane + "</div>";
    $(document.body).append(html);
    $("#toptimer__settingPane").append("Shows your Colour:</br>");
  
  
    $("#toptimer__settingPane").append("Google Calendar:</br>");
  
  
    $("#toptimer__settingPane").append("Font:</br>");
  
    create_hide_cal_checkbox();
    $('#cb-hide-calendarLabel').click(function(){
      console.log("clicked checkbox");
      if ($('#cb-hide-calendar')[0].checked) {
        $("#toptimer-calendar-btn").hide();
        console.log("hide cal");
        setOption("hideCal",true);
      } else {
        $("#toptimer-calendar-btn").show();
        console.log("show cal");
        setOption("hideCal",false);
      }
    });
  
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
    $('#toptimer__overflow').remove();
    $('#toptimer__settingPaneContainer').remove();
    //unlock scrolling
    $(document).unbind('scroll'); 
    $('body').css({'overflow':'visible'});
    $('#settings-btn').prop('disabled', false);
}

function create_hide_cal_checkbox(){
  $("#toptimer__settingPane").append("<label for=\"accept\" id=\"cb-hide-calendarLabel\"><input type=\"checkbox\" id=\"cb-hide-calendar\" name=\"accept\" value=\"yes\">  Hide the Calendar </label>");
}