
var myModal = new bootstrap.Modal(document.getElementById('quest-full-info-modal'), {
    keyboard: false
})

$(".quest-link").click(function(){

    $.get('getModal.php', {quest_id: $(this).parent().attr('id')}, function(quest) {

        $(".modal-title").html(quest.title);
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
        
        $("#schedule_carusel-inner").empty();

        var scheduleJson = JSON.parse(quest.schedule);
        if (Object.keys(scheduleJson).length != 0 || scheduleJson.constructor != Object) {

            $("#quest_schedule").html(`<h3>Расписание</h3>
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
            var month = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
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

    myModal.show();

})

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
    
    bookings.forEach(booking => {

        var booking_dateTime = new Date(booking["date_and_time"]);
        var schedule_dateTime = parseStringToHoursAndMinutes(scheduleElement.time);
        date.setHours(schedule_dateTime.getHours());
        date.setMinutes(schedule_dateTime.getMinutes());

        //console.log(currentDate.getHours() + '>' + date.getHours());
        if ((booking["status"] &&
                booking_dateTime.getFullYear() == date.getFullYear() &&
                booking_dateTime.getMonth() == date.getMonth() &&
                booking_dateTime.getDate() == date.getDate() &&
                booking_dateTime.getHours() === date.getHours() &&
                booking_dateTime.getMinutes() === date.getMinutes()) ||
            (currentDate.getTime() > date.getTime())
        ) {
            //console.log(currentDate.getHours() + '>' + date.getHours());
            dayBlock.find(".schedule_item").last().addClass('booked');
        }
    });
} 