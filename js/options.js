function closeSettingsPane() {
    //unlock scrolling
    const modal = document.querySelector("[data-modal]")
    modal.close();
}


////////

let colors = ['red', 'green', 'blue', 'orange', 'yellow', 'silver']

function create_color_buttons() {
    string = '<div id="colorContainer">'
    for (const color of colors) {
        string += '<button id="' + color + 'box" class="__toptimer_' + color + ' colorbox"></button>'
    }
    return string + '</div><br>'

}



function AddColorBoxClickListener(outer_element) {

    string = ""
    for (const color of colors) {
        outer_element.find('#' + color + 'box').click(() => {
            console.log('i am executed v2');
            console.log("clicked the colorbox" + color);
            send_message_to_backend(RECIEVER_IFRAME, 'progressbar_color', color);
        })
    }
    return string

}


function add_inner_div_for_dialog(outer_query_element, modal) {

    const optionsCloseButton = $('<button id="optionsClose-btn" class="btn toptimer" type="button">X</button>');
    outer_query_element.append(optionsCloseButton)
    optionsCloseButton.click(() => {
        
        closeSettingsPane();
    })

    const html_setting_pane = $('<h1>Settings<\h1> <hr >');
    outer_query_element.append(html_setting_pane)
    line = $('<div class="line"> Select your Colour:</br> <\div>')
    outer_query_element.append(line);

    outer_query_element.append(create_color_buttons());
    AddColorBoxClickListener(outer_query_element);



    //lock scrolling
    $('body').css({ 'overflow': 'hidden' });
    $(document).bind('scroll', function () {
        window.scrollTo(0, 0);
    });

}


function add_outside_click_detect() {
    const modal = document.querySelector("[data-modal]")
    modal.addEventListener("click", e => {
        const dialogDimensions = modal.getBoundingClientRect()
        if (e.clientX < dialogDimensions.left ||
            e.clientX > dialogDimensions.right ||
            e.clientY < dialogDimensions.top ||
            e.clientY > dialogDimensions.bottom) {
            closeSettingsPane();
        }
    });

    modal.addEventListener("close", (event) => { $('body').css({ 'overflow': 'visible' });
                    $(document).unbind('scroll'); });
}