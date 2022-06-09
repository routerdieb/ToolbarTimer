function showErrorMsg(message){
    console.log('Error Msg should appear')
    div = $(`<div class="msgBox1"> ${message} </div>`);
    $(document.body).append(div);
    ok_button = $('<button id="okButtonMsgBox"> OK </button>');

    rel_div = $('<div id="msgButtonContainer">');
    div.append(rel_div);
    rel_div.append(ok_button)
    ok_button.click(()=>{
        $('.msgBox1').remove();
    })
}