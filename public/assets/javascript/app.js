
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


function submitAnswers(){
    
    if($("#q_1").val() != null && $("#q_2").val() != null && $("#q_3").val() != null && $("#q_4").val() != null && $("#q_5").val() != null && $("#q_6").val() != null && $("#q_7").val() != null && $("#q_8").val() != null && $("#q_9").val() != null && $("#q_10").val() != null){
        $('form').attr({
            action: "/submit_q",
            method: "POST"
        });
    }
    else{
        event.preventDefault();
        alert('Please select an answer for all questions.');
    }
    
}