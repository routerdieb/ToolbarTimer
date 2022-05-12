async function open_Calendar(){
    $('#toptimer-calendar-btn').prop('disabled', true);
    html_overflow = '<div id="toptimer__overflow"></div>';
    $(document.body).append(html_overflow);
  
    
    const calendarPopup = $('<div class="toptimer-calendar-popup">');
    const calDiv = $('<div id="calendarPopupDiv" class="toptimer"> Calendar</div>');

    
  const btnCalendarCloseControl = $('<button class="toptimer toptimer-calendar-popup-close-btn" type="button">');
  btnCalendarCloseControl.text("×");
  btnCalendarCloseControl.click(close_Calendar);
  

  calDiv.append(calendarPopup);
  calendarPopup.html(
    '<iframe id="calIframe" src="https://calendar.google.com/calendar/embed?height=600&amp;wkst=2&amp;bgcolor=%23B39DDB&amp;ctz=Europe%2FBerlin&amp;src=dy5lc29AbGl2ZS5kZQ&amp;src=YWRkcmVzc2Jvb2sjY29udGFjdHNAZ3JvdXAudi5jYWxlbmRhci5nb29nbGUuY29t&amp;color=%234285F4&amp;color=%237986CB&amp;mode=WEEK&amp;showTitle=0&amp;showNav=1&amp;showDate=1&amp;showPrint=1&amp;showTabs=1&amp;showCalendars=0&amp;showTz=0" style="border:solid 1px #777" width="800" height="600" frameborder="0" scrolling="no"></iframe>'
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
        closeSettingsPane();
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
