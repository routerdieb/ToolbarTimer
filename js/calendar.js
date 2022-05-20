async function open_Calendar(){
    $('#toptimer-calendar-btn').prop('disabled', true);
    html_overflow = '<div id="toptimer__overflow"></div>';
    $(document.body).append(html_overflow);
  
    
    const calendarPopup = $('<div class="toptimer-calendar-popup">');
    const calDiv = $('<div id="calendarPopupDiv" class="toptimer"> Calendar</div>');

    $(".toptimer-calendar-popup").click((event)=> {
      event.stopPropagation();
      console.log('stopPropagation');
    });
    $('#toptimer__overflow').click(close_Calendar);//masks the overflow thing for some reason
    
  const btnCalendarCloseControl = $('<button class="toptimer toptimer-calendar-popup-close-btn" type="button">');
  btnCalendarCloseControl.text("×");
  btnCalendarCloseControl.click(close_Calendar);
  
  calendarIFrame = await getCalendar()
  calendarIFrame = calendarIFrame ? calendarIFrame : '<div class="error"> Set the Calendar in the settings.</div>';
  calDiv.append(calendarPopup);
  
  console.log(" heyho "+calendarIFrame)
  calendarPopup.html(
    calendarIFrame
  );
  calendarPopup.append(btnCalendarCloseControl);
  btnCalendarCloseControl.click(close_Calendar);

    


    $(document.body).prepend(calDiv);
    //lock scrolling
    $('body').css({'overflow':'hidden'});
    $(document).bind('scroll',function () { 
         window.scrollTo(0,0); 
    });
  
    //
    $(document).keydown(function(event) {
      
      if (event.key === "Escape") {
        console.log("esc was pressed");
        close_Calendar();
      }
    });
  
    
      
    
}


function close_Calendar(){
    $('#toptimer__overflow').remove();
    $('#toptimer-calendar-btn').prop('disabled', false);
    $('#calendarPopupDiv').remove();
    $('.toptimer-calendar-popup').remove();
    $(document).unbind('scroll'); 
    $('body').css({'overflow':'visible'});
}
