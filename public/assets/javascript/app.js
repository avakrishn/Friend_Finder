
function createUser(){
    if($('#username').val().trim() !=0 && $('#picture_link').val().trim() != 0){
        $('form').attr({
            action: "/create_user",
            method: "POST"
        });
    }
    else{
        event.preventDefault();
        alert('Please fill in all of the fields.');
    }
}

