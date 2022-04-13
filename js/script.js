
var quest_full_info_modal = new bootstrap.Modal(document.getElementById('quest-full-info-modal'), {
    keyboard: false
});
var add_new_quest_modal = new bootstrap.Modal(document.getElementById('add_new_quest_modal'), {
    keyboard: false
});

$('form').on('submit', function() {
    var title = $(this).find('input[name="title"]').val();
    var type_of_game_id = $(this).find('select[name="type_of_game"]').val();
    var address = $(this).find('input[name="address"]').val();
    var age_limit = $(this).find('input[name="age_limit"]').val();
    var level_of_difficalty = $(this).find('select[name="level_of_difficalty"]').val();
    var level_of_fear = $(this).find('select[name="level_of_fear"]').val();
    var duration = $(this).find('input[name="duration"]').val();
    var min_number_of_players = $(this).find('input[name="min_number_of_players"]').val();
    var max_number_of_players = $(this).find('input[name="max_number_of_players"]').val();
    var annotation = $(this).find('textarea[name="annotation"]').val();
    var full_desc = $(this).find('textarea[name="full_desc"]').val();
    var specifics = $(this).find('textarea[name="specifics"]').val();
    var image = $(this).find('input[name="image"]').prop('files')[0];

    var genresId = [];
    
    $(this).find('input:checkbox:checked').each(function() {
        genresId.push(this.value);
    });

    //console.log(genresId.join(', '));

    
    var formData = new FormData();

    formData.append('title', title)
    formData.append('address', address)
    formData.append('age_limit', age_limit)
    formData.append('level_of_difficalty', level_of_difficalty)
    formData.append('level_of_fear', level_of_fear)
    formData.append('duration', duration)
    formData.append('min_number_of_players', min_number_of_players)
    formData.append('max_number_of_players', max_number_of_players)
    formData.append('annotation', annotation)
    formData.append('full_desc', full_desc)
    formData.append('specifics', specifics)
    formData.append('genresId', genresId)
    formData.append('type_of_game_id', type_of_game_id)
    formData.append('image', image);


    // $.post(
    //     'add_new_quest.php',
    //     {
    //         'title': title,
    //         'address': address,
    //         'age_limit': age_limit,
    //         'level_of_difficalty': level_of_difficalty,
    //         'level_of_fear': level_of_fear,
    //         'duration': duration,
    //         'min_number_of_players': min_number_of_players,
    //         'max_number_of_players': max_number_of_players,
    //         'annotation': annotation,
    //         'full_desc': full_desc,
    //         'specifics': specifics,
    //         'genresId[]': genresId,
    //         'type_of_game_id': type_of_game_id,
    //         'image': image
    //     },
    //     function (data) {
    //         console.log(data);
    //     }
    // );
    
    $.ajax({
        url: "add_new_quest.php", 
        type: 'POST',
        data: formData, 
        processData: false,
        contentType: false,
        success: function (data) {
            console.log(data);
        }
    });

    return false;
})

$(".quest-link").click(function(){

    $.get('getModal.php', {quest_id: $(this).parent().attr('id')}, function(quest) {

        $("#quest_title").html(quest.title);
        $("#quest_modal-img").attr('src', quest.path_to_img);
        $("#quest_desc > p").html(quest.full_desc);
        $("#quest_number_of_players").html(quest.number_of_players);
        $("#quest_age_limit").html(quest.age_limit);
        $("#quest_duration").html(quest.duration);
        $("#quest_address").html(quest.address);
        $("#quest_specifics > p").html(quest.specifics);

        // Загрузка жанров
        $("#quest_genres_list").empty();
        quest.genres.forEach(genre => {
            $("#quest_genres_list").append(`<div class="col mb-2 px-1">
                                                <div class="quest_genre">`
                                                    +genre+
                                                `</div>
                                            </div>`
            );
        });

        // Загрузка расписания
        
        $("#quest_schedule").empty();

        var scheduleJson = JSON.parse(quest.schedule);
        if (Object.keys(scheduleJson).length != 0 || scheduleJson.constructor != Object) {

            $("#quest_schedule").html(`<h3>Розклад</h3>
                                        <div id="contentContainer" class="carousel slide" data-bs-interval="false" data-bs-wrap="false">
                                            <button class="carousel-control-prev" type="button" data-bs-target="#contentContainer" data-bs-slide="prev">
                                                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                                                <span class="visually-hidden">Previous</span>
                                            </button>
                                            <div id="schedule_carusel-inner" class="carousel-inner">

                                            </div>
                                            <button class="carousel-control-next" type="button" data-bs-target="#contentContainer" data-bs-slide="next">
                                                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                                                <span class="visually-hidden">Next</span>
                                            </button>
                                        </div>`
            );

            var page_number = 0;
            var days = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
            var month = ["Січень", "Лютий", "Березень", "Квітень", "Травень", "Червень", "Липень", "Серпень", "Вересень", "Жовтень", "Листопад", "Грудень"];
            var date = new Date();
        
            appendScheduleWeekItem(page_number, date, days, month, scheduleJson, quest.bookings);
            page_number++;
            appendScheduleWeekItem(page_number, date, days, month, scheduleJson, quest.bookings);
            page_number++;
            appendScheduleWeekItem(page_number, date, days, month, scheduleJson, quest.bookings);
            page_number++;
            appendScheduleWeekItem(page_number, date, days, month, scheduleJson, quest.bookings);

        }

    }, "json");

    quest_full_info_modal.show();

});

$("#add_new_quest_btn > .square").click(function() {
    add_new_quest_modal.show();
});

$(".age-limit-range-val").html($('input[type="range"]').val() + "+")
$(document).on('input', '[type="range"]', function() {
    $(".age-limit-range-val").html($(this).val() + "+")
});

function appendScheduleWeekItem (page_number, date, days, month, scheduleJson, bookings) {

    var weekdaysArray = scheduleJson["weekdays"];
    var weekendArray = scheduleJson["weekend"];

    $("#schedule_carusel-inner").append(`<div class="schedule_carusel-item carousel-item">
                                            <div class="schedule_carusel-month"><h3></h3></div>
                                            <div class="row justify-content-end mb-4">
                                                <div class="col px-0"><div id="Mon" class="day"></div></div>
                                                <div class="col px-0"><div id="Tue" class="day"></div></div>
                                                <div class="col px-0"><div id="Wed" class="day"></div></div>
                                                <div class="col px-0"><div id="Thu" class="day"></div></div>
                                                <div class="col px-0"><div id="Fri" class="day"></div></div>
                                                <div class="col px-0"><div id="Sat" class="day"></div></div>
                                                <div class="col px-0"><div id="Sun" class="day"></div></div>
                                            </div>
                                        </div>`
    );

    if (page_number === 0) {
        $(".schedule_carusel-item").eq(0).addClass("active");
    }
    var dateStr = '';
    var pageBlock = $(".schedule_carusel-item").eq(page_number);

    pageBlock.find(".schedule_carusel-month > h3").append(month[date.getMonth()]);

    var currentDate = new Date();

    for (var i = 0; i < 7; i++) {
        var dayBlock = pageBlock.find(".day").eq(i);
        dayBlock.append('<div class="date"><h5>'+ date.getDate() +'</h5><p>' + days[date.getDay()] + '</p></div>');
        //console.log(currentDate.getDate() + '>' + date.getDate());
        switch (date.getDay()) {
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
                weekdaysArray.forEach(element => {
                    dayBlock.append(getScheduleString(element));
                    
                    makingTheQuestDateInactive(dayBlock, element, bookings, currentDate, date);
                });
                break;
            case 0:
            case 6:
                weekendArray.forEach(element => {
                    dayBlock.append(getScheduleString(element));

                    makingTheQuestDateInactive(dayBlock, element, bookings, currentDate, date);
                });
                break;
        }
        date.setDate(date.getDate() + 1);
    }
}

function getScheduleString(element) {

    if(element.price <= 750)
        scheduleStr = '<div class="schedule_item schedule_item-sm_price unselectable">'+element.time+' '+element.price+'грн.</div>';
    else if (element.price <= 850)
        scheduleStr = '<div class="schedule_item schedule_item-md_price unselectable">'+element.time+' '+element.price+'грн.</div>';
    else if (element.price <= 900)
        scheduleStr = '<div class="schedule_item schedule_item-lg_price unselectable">'+element.time+' '+element.price+'грн.</div>';
    else 
        scheduleStr = '<div class="schedule_item schedule_item-xl_price unselectable">'+element.time+' '+element.price+'грн.</div>';

    return scheduleStr;
}

function parseStringToHoursAndMinutes(str) {
    var hoursAndMinutesStr = str.split(':');
    var hoursAndMinutesDate = new Date();

    hoursAndMinutesDate.setHours(hoursAndMinutesStr[0]);
    hoursAndMinutesDate.setMinutes(hoursAndMinutesStr[1]);

    return hoursAndMinutesDate;
}

function makingTheQuestDateInactive (dayBlock, scheduleElement, bookings, currentDate, date) {

    var schedule_dateTime = parseStringToHoursAndMinutes(scheduleElement.time);
    date.setHours(schedule_dateTime.getHours());
    date.setMinutes(schedule_dateTime.getMinutes());

    if (currentDate.getTime() > date.getTime()) {
        dayBlock.find(".schedule_item").last().addClass('booked');
    }

    bookings.forEach(booking => {

        var booking_dateTime = new Date(booking["date_and_time"]);
        //console.log(currentDate.getHours() + '>' + date.getHours());
        if (booking["status"] &&
                booking_dateTime.getFullYear() == date.getFullYear() &&
                booking_dateTime.getMonth() == date.getMonth() &&
                booking_dateTime.getDate() == date.getDate() &&
                booking_dateTime.getHours() === date.getHours() &&
                booking_dateTime.getMinutes() === date.getMinutes()
        ) {
            //console.log(currentDate.getHours() + '>' + date.getHours());
            dayBlock.find(".schedule_item").last().addClass('booked');
        }
    });
} 