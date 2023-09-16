import { message_recievers, message_types, send_message_to_backend } from "./messageHelper2";

let min_options:[number]
const colors = ['red', 'green', 'blue', 'orange', 'yellow', 'silver']


function closeSettingsPane() {
    //unlock scrolling
    const modal = document.querySelector("[data-modal]")
    if(modal != undefined){
        modal.close();
    }
    send_message_to_backend(message_recievers.RECIEVER_ACTIVE_INJECT,message_types.close_modal);
}


////////

function create_color_buttons() {
    let string = '<div id="colorContainer">'
    for (const color of colors) {
        string += '<button id="' + color + 'box" class="__toptimer_' + color + ' colorbox"></button>'
    }
    return string + '</div><br>'

}

function AddColorBoxClickListener(outer_element) {
    let string = ""
    for (const color of colors) {
        outer_element.find('#' + color + 'box').click(() => {
            console.log("clicked the colorbox" + color);
			setColor(color);
            send_message_to_backend(message_recievers.RECIEVER_IFRAME, message_types.progressbar_color, {'color':color});
        })
    }
    return string
}


export async function add_inner_div_for_dialog(outer_query_element) {

    const optionsCloseButton = $('<button id="optionsClose-btn" class="btn toptimer" type="button">X</button>');
    outer_query_element.append(optionsCloseButton)
    optionsCloseButton.click(() => {
        
        closeSettingsPane();
    })

    const html_setting_pane = $('<h1>Settings<\h1> <hr >');
    outer_query_element.append(html_setting_pane)
    let line = $('<div class="line"> Select your Colour:</br> <\div>')
    outer_query_element.append(line);

    outer_query_element.append(create_color_buttons());
    AddColorBoxClickListener(outer_query_element);

	const html_minute_options_header = $('<br><br><br><div class="line">Minute Options<\div>');
    outer_query_element.append(html_minute_options_header);
	
	min_options = await getMinOptions();

	outer_query_element.append('<\hr>');
	outer_query_element.append(get_minute_options_div(min_options));
	outer_query_element.append('<\hr>');
	let add_option_ta = $('<textarea id="add_minutes" rows="1" cols="50"></textarea>')
	outer_query_element.append(add_option_ta);
	
	$('#add_minutes').keypress(function(e){
	  console.log('keypress');
      if(e.which == 13){
           // submit via ajax or
		   let new_string = add_option_ta.val()
		   let new_int:number = parseInt(new_string);
		   console.log(new_int);
		   if (isNaN(new_int)){
			   add_option_ta.val('insert a minute time');
		   }else{
			   console.log('do the magic');
			   min_options.push(new_int);
			   console.log('min options',min_options);
               send_message_to_backend(message_recievers.RECIEVER_IFRAME,message_types.min_options,{'min_options':min_options})
			   setMinOptions(min_options);
			   console.log('done some of the magic');
			   let selection_div = $('#selection_div');
			   add_min_option(selection_div,new_int)
		   }
		   return false;
       }
    });

    //lock scrolling
    //$('body').css({ 'overflow': 'hidden' });
    //$(document).bind('scroll', function () {
    //    window.scrollTo(0, 0);
    //});

}


export function add_outside_click_detect() {
    const modal = document.querySelector("[data-modal]")
    if(modal != undefined){
        modal.addEventListener("click", e => {
            const dialogDimensions = modal.getBoundingClientRect()
            if (e.clientX < dialogDimensions.left ||
                e.clientX > dialogDimensions.right ||
                e.clientY < dialogDimensions.top ||
                e.clientY > dialogDimensions.bottom) {
                closeSettingsPane();
            }
        });
    }

}

function get_minute_options_div(min_options:[number]){
	// todo replace with load
	console.log(min_options);
	
	const selection_div = $('<div id="selection_div"><\div>');
	for (let i = 0; i < min_options.length; i++) {
		let time = min_options[i];
		add_min_option(selection_div,time)
	}
	console.log(selection_div);
	return selection_div
}

function add_min_option(parent_element,time){
	let button1 = $(`<button id='tt_btn_${time}' class="non_float">X</button>`);
		
		button1.click(function(e){
			let time_id = this.id.split("_")[2];
			
			console.log(`removing ${time_id}`);
			$(`#timeoption_${time_id}`).remove();
			
			let time_int = parseInt(time_id);
			var index = min_options.indexOf(time_int);
			console.log('index ',index);
			if (index !== -1) {
				min_options.splice(index, 1);
			}

			console.log(min_options);
			setMinOptions(min_options);
            send_message_to_backend(message_recievers.RECIEVER_IFRAME,message_types.min_options,{'min_options':min_options})
		});
		let s = $(`<div id="timeoption_${time}">${time} minutes</div>`)
		s.prepend(button1);
		parent_element.append(s); 
}