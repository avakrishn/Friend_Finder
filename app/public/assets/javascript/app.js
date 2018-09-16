//------------------------------------Global Variables

var totalDifference = 0;
var compareUsers = [];
var otherArray = [];
var smallestDiff;
var roommateArray = [];
var roommateURL = "/perfect_roommates/?"

//------------------------------------Functions


// function createUser checks if user info fields are filled in form on index and then assigns action and method attributes to the form

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

// when form submits on roommate_quiz page, the function submitAnswer function checks if an option was selected for each question and then assigns action and method attributes to the form

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

// function findRoommate compares current user's answers to other's users in database to determine the user(s) with the least totalDifference in answers as the most compatible roommates
function findRoommate(){
    // ajax query hits route and gets all data from user_answers from table for all previous users who are not the current user
    $.ajax({
        url: "/potential_roommates",
        method: 'GET'
    }).then(function(otherRes){
        // ajax query gets all data from user_answers from table for the current user
        $.ajax({
            url: "/user",
            method: 'GET'
        }).then(function(userRes){
            // var userArray contains elements that correspond to the current user's answer
            var userArray = [];
            userArray.push(userRes[0].q_1, userRes[0].q_2, userRes[0].q_3, userRes[0].q_4, userRes[0].q_5, userRes[0].q_6, userRes[0].q_7, userRes[0].q_8, userRes[0].q_9, userRes[0].q_10);
           

            // for loops iterates over otherRes which contains previous users answers
            for (var prevUser in otherRes){
                // for each of the previous user push that user's answers into otherArray
                otherArray.push(otherRes[prevUser].q_1, otherRes[prevUser].q_2, otherRes[prevUser].q_3, otherRes[prevUser].q_4, otherRes[prevUser].q_5, otherRes[prevUser].q_6, otherRes[prevUser].q_7, otherRes[prevUser].q_8, otherRes[prevUser].q_9, otherRes[prevUser].q_10);
                
                // for all answers in the userArray compare the user's answer to the question to the previous user's answer and set totalDifference equal to totalDifference + the difference of the user and previous user's answers
                for(var answer in userArray){
                    totalDifference += Math.abs(userArray[answer] - otherArray[answer]);
                    
                }
                // push into the compareUsers array the diff (total Difference in answer score between the current user and the specific previous user) and the previous users's users_id as the value of userID
                compareUsers.push({diff: totalDifference, userID : otherRes[prevUser].users_id});
                totalDifference = 0;
                otherArray = [];
                
            } 
            
            // find the smallest totalDifference value between answer choices in the compareUsers array to find the user(s) with the least amount of answer difference from the user making them the most compatible roommate(s) for the user
            smallestDiff = compareUsers[0].diff;
            for (var m in compareUsers){
                if (compareUsers[m].diff < smallestDiff){
                    smallestDiff = compareUsers[m].diff;
                }
            }

            // account for ties between previous users as most compatible roommates for the current user and create the roommateURL request for the ajax query which will use a route that implements req.query
            for(var a in compareUsers){
                if(compareUsers[a].diff - smallestDiff == 0 && roommateURL == "/perfect_roommates/?"){
                    roommateArray.push(compareUsers[a].userID);
                    roommateURL += `userID=${compareUsers[a].userID}`
                }
                else if(compareUsers[a].diff - smallestDiff == 0 && roommateURL != "/perfect_roommates/?"){
                    roommateArray.push(compareUsers[a].userID);
                    roommateURL += `&userID=${compareUsers[a].userID}`
                }
            }

            // ajax query gets a response which contains data from the most compatible roommate(s) for the current user
            $.ajax({
                url: roommateURL,
                method: 'GET'
            }).then(function(roommateRes){
                console.log(roommateRes);
                // if there a multiple previous users who have tied as the most compatible roommates for the current user
                if(roommateRes.length > 1){
                    var roommates = $('<div>').html("<h3>Your Most Compatible Roommates are: <h3>");

                    for(var c in roommateRes){
                        var newRoommate = $('<h5>').html(roommateRes[c].username);
                        var newRoommateImg = $('<img>').attr("src", roommateRes[c].picture_link).addClass('imageSizeMany');
                        var newDiv = $('<div>').addClass('roommate');
                        newDiv.append(newRoommate, newRoommateImg);
                        roommates.append(newDiv);
                    }

                    var explain = $('<h6>').text("These Roommates Tied in being the Most Compatible Roommates for you.");
                    $('#results').append(roommates, explain);
                }
                // if there is only one previous user who is the most compatible roommate for the current user
                else{
                    var roommates = $('<div>').html("<h3>Your Most Compatible Roommate is: <h3>");
                    var newRoommate = $('<h5>').html(roommateRes[0].username);
                    var newRoommateImg = $('<img>').attr("src", roommateRes[0].picture_link).addClass('imageSizeOne');
                    var newDiv = $('<div>').addClass('roommate');
                    newDiv.append(newRoommate, newRoommateImg);
                    roommates.append(newDiv);
                    $('#results').append(roommates);
                }
            });


            
        });
    });
}