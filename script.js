
var myModal = new bootstrap.Modal(document.getElementById('quest-full-info-modal'), {
    keyboard: false
})

$(".quest-link").click(function(){

    $.get('getModal.php', {quest_id: $(this).parent().attr('id')}, function(data) {

        $(".modal-title").html(data.quest_title);
        $("#quest_modal-img").attr('src', data.path_to_img);
        $("#quest_desc > p").html(data.full_desc);
        $("#quest_number_of_players").html(data.number_of_players);
        $("#quest_age_limit").html(data.age_limit);
        $("#quest_duration").html(data.duration);
        $("#quest_address").html(data.address);
        $("#quest_specifics > p").html(data.specifics);

        $("#quest_genres_list").empty();
        data.genres.forEach(genre => {
            //console.log(genre);
            $("#quest_genres_list").append(`<div class="col mb-2 px-1">
                                                <div class="quest_genre">`
                                                    +genre+
                                                `</div>
                                            </div>`);
            
        });

        var scheduleJson = JSON.parse(data.schedule);
        var weekdaysArray = scheduleJson["weekdays"];
        var weekendArray = scheduleJson["weekend"];

        $("#quest_schedule > .row").empty();
        var block = '';
        var i = 0;
        for (; i < 7; i++) {
            $("#quest_schedule > .row").append('<div class="col"><div class="schedule_for_the_day"></div></div>');
            
            switch (i) {
                case 0:
                    $("#quest_schedule > .row > .col").eq(i).prepend('<h5>Понедельник</h5>');
                    break;
                case 1:
                    $("#quest_schedule > .row > .col").eq(i).prepend('<h5>Вторник</h5>');
                    break;
                case 2:
                    $("#quest_schedule > .row > .col").eq(i).prepend('<h5>Среда</h5>');
                    break;
                case 3:
                    $("#quest_schedule > .row > .col").eq(i).prepend('<h5>Четверг</h5>');
                    break;
                case 4:
                    $("#quest_schedule > .row > .col").eq(i).prepend('<h5>Пятница</h5>');
                    break;
                case 5:
                    $("#quest_schedule > .row > .col").eq(i).prepend('<h5>Суббота</h5>');
                    break;
                case 6:
                    $("#quest_schedule > .row > .col").eq(i).prepend('<h5>Воскресенье</h5>');
                    break;
            }

            if (i < 5) {
                weekdaysArray.forEach(element => {
                    block = getscheduleString(element);
                    $("#quest_schedule > .row > .col").eq(i).find(".schedule_for_the_day").append(block);
                });
            } else {
                $("#quest_schedule > .row").append('<div class="col"><div class="schedule_for_the_day "></div></div>');
                weekendArray.forEach(element => {
                    block = getscheduleString(element);
                    $("#quest_schedule > .row > .col").eq(i).find(".schedule_for_the_day").append(block);
                });
            }

        }

        // Log the response to the console
        //console.log("Response: " + data.quest_title + data.path_to_img + data.full_quest_desc);

    }, "json");

    myModal.show();

})

function getscheduleString(element) {
    var scheduleStr = '';

    if(element.price <= 750)
        scheduleStr = '<div class="schedule_item schedule_item-sm_price">'+element.time+' '+element.price+'грн.</div>';
    else if (element.price <= 850)
        scheduleStr = '<div class="schedule_item schedule_item-md_price">'+element.time+' '+element.price+'грн.</div>';
    else if (element.price <= 900)
        scheduleStr = '<div class="schedule_item schedule_item-lg_price">'+element.time+' '+element.price+'грн.</div>';
    else 
        scheduleStr = '<div class="schedule_item schedule_item-xl_price">'+element.time+' '+element.price+'грн.</div>';

    return scheduleStr;
}

function showModal(element) {

    
    // $.ajax(
    //     'getModal.php',
    //     {
    //         success: function(data) {
    //           alert('AJAX call was successful!');
    //           alert('Data from the server' + data);
    //         },
    //         error: function() {
    //           alert('There was some error performing the AJAX call!');
    //         }
    //      }
    // );
    // var quest_id = element.parentNode.id
    
    // var xmlhttp = new XMLHttpRequest();
    // xmlhttp.onreadystatechange = function() {
    //     if (this.readyState == 4 && this.status == 200) {
    //         quest_id.innerHTML = this.responseText;
    //     }
    // };
    // xmlhttp.open("GET", "getModal.php?quest_id=" + quest_id, true);
    // xmlhttp.send()
    // console.log("hyinya")
    // myModal.show()
}