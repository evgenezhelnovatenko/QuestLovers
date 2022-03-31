
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

        var sheduleJson = JSON.parse(data.shedule);
        var weekdaysArray = sheduleJson["weekdays"];
        var weekendArray = sheduleJson["weekend"];

        $("#quest_shedule > .row").empty();
        var block = '';
        var i = 0;
        for (; i < 5; i++) {
            $("#quest_shedule > .row").append('<div class="col"><div class="shedule_for_the_day"></div></div>');
            
            weekdaysArray.forEach(element => {
                block = getSheduleString(element);
                $("#quest_shedule > .row > .col").eq(i).find(".shedule_for_the_day").append(block);
            });

        }

        for (; i < 7; i++) {
            $("#quest_shedule > .row").append('<div class="col"><div class="shedule_for_the_day "></div></div>');
            weekendArray.forEach(element => {
                block = getSheduleString(element);
                $("#quest_shedule > .row > .col").eq(i).find(".shedule_for_the_day").append(block);
            });

        }

        // Log the response to the console
        //console.log("Response: " + data.quest_title + data.path_to_img + data.full_quest_desc);

    }, "json");

    myModal.show();

})

function getSheduleString(element) {
    var sheduleStr = '';

    if(element.price <= 750)
        sheduleStr = '<div class="shedule_item shedule_item-sm_price">'+element.time+' '+element.price+'грн.</div>';
    else if (element.price <= 850)
        sheduleStr = '<div class="shedule_item shedule_item-md_price">'+element.time+' '+element.price+'грн.</div>';
    else if (element.price <= 900)
        sheduleStr = '<div class="shedule_item shedule_item-lg_price">'+element.time+' '+element.price+'грн.</div>';
    else 
        sheduleStr = '<div class="shedule_item shedule_item-xl_price">'+element.time+' '+element.price+'грн.</div>';

    return sheduleStr;
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