(function () {
    'use strict'


    var quest_full_info_modal = new bootstrap.Modal(document.getElementById('quest-full-info-modal'), {
        keyboard: false
    });
    var add_new_quest_modal = new bootstrap.Modal(document.getElementById('add_new_quest_modal'), {
        keyboard: false
    });


    $('.delete_quest_btn').click(function() {

        var questBlock = $(this).closest('.quest__card');
        deleteQuest(questBlock);
        
    });

    $("#add_new_weekdays_schedule_item_btn").click(function() {

        var scheduleItems = $("#weekdays-schedule-items > .schedule-item");

        addNewScheduleItem(scheduleItems);

        scheduleItems = $("#weekdays-schedule-items > .schedule-item");
        var newScheduleItemTime = scheduleItems.last().find('input[type="time"]');

        newScheduleItemTime.blur(function() {
            validateScheduleTime(this);
        });
    });

    $("#add_new_weekend_schedule_item_btn").click(function() {

        var scheduleItems = $("#weekend-schedule-items > .schedule-item");

        addNewScheduleItem(scheduleItems);

        scheduleItems = $("#weekend-schedule-items > .schedule-item");
        var newScheduleItemTime = scheduleItems.last().find('input[type="time"]');

        newScheduleItemTime.blur(function() {
            validateScheduleTime(this);
        });
    });

    $('#duplicate_schedule_to_weekend_btn').click(function() {

        var weekendSchedule = $('#weekend-schedule-items');
        var weekendScheduleItems = weekendSchedule.find('.schedule-item');

        weekendScheduleItems.remove();

        $('#weekdays-schedule-items').find('.schedule-item').each(function(index) {
            var clone = $(this).clone(true);
            weekendScheduleItems = weekendSchedule.find('.schedule-item');

            $('#weekend-schedule-items > div').eq(weekendScheduleItems.length).before(clone);
        });

    });

    $('.needs-validation').each(function() {
        $(this).on('submit', function(event) {
            if (!this.checkValidity()) {
                
                event.preventDefault();
                event.stopPropagation();
            }
            else {
                if ($(this).attr('id') === 'add_new_quest_form') {
                    addNewQuest(this);
                }
            }

            $(this).addClass('was-validated');

            return false;
        });
    });

    $('.schedule-item').each(function() {
        $(this).find('input[type="time"]').blur(function() {
            validateScheduleTime(this)
        });
    });

    $('input[name="min_number_of_players"]').blur(function() {
        var minNumberOfPlayers = parseInt($(this).val());
        var maxNumberOfPlayersObj = $(this).closest('.number_of_players').find('input[name="max_number_of_players"]');
        var maxNumberOfPlayers = parseInt(maxNumberOfPlayersObj.val());

        if (isNaN(minNumberOfPlayers) || 
            (minNumberOfPlayers < 0)) {

            if (!$(this).hasClass('is-invalid')) {
                $(this).addClass('is-invalid');
            }
        }
        else if (!isNaN(maxNumberOfPlayers) && (minNumberOfPlayers > maxNumberOfPlayers)) {
            if (!$(this).hasClass('is-invalid')) {
                $(this).addClass('is-invalid');
            }
            if (!maxNumberOfPlayersObj.hasClass('is-invalid')) {
                maxNumberOfPlayersObj.addClass('is-invalid');
            }
        }
        else {
            if ($(this).hasClass('is-invalid')) {
                $(this).removeClass('is-invalid');
            }
            if (maxNumberOfPlayersObj.hasClass('is-invalid')) {
                maxNumberOfPlayersObj.removeClass('is-invalid');
            }
        }
    });

    $('input[name="max_number_of_players"]').blur(function() {
        var maxNumberOfPlayers = parseInt($(this).val());
        var minNumberOfPlayersObj = $(this).closest('.number_of_players').find('input[name="min_number_of_players"]');
        var minNumberOfPlayers = parseInt(minNumberOfPlayersObj.val());

        if (isNaN(maxNumberOfPlayers) ||
            (maxNumberOfPlayers < 0)) {

            if (!$(this).hasClass('is-invalid')) {
                $(this).addClass('is-invalid');
            }
        }
        else if (!isNaN(minNumberOfPlayers) && (maxNumberOfPlayers < minNumberOfPlayers)) {
            if (!$(this).hasClass('is-invalid')) {
                $(this).addClass('is-invalid');
            }
            if (!minNumberOfPlayersObj.hasClass('is-invalid')) {
                minNumberOfPlayersObj.addClass('is-invalid');
            }
        }
        else {
            if ($(this).hasClass('is-invalid')) {
                $(this).removeClass('is-invalid');
            }
            if (minNumberOfPlayersObj.hasClass('is-invalid')) {
                minNumberOfPlayersObj.removeClass('is-invalid');
            }
        }
    });


    $(".quest-link").click(function(){

        loadFullInfoAboutQuest(this);
        
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
        var scheduleStr = '';

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

    function addNewScheduleItem(scheduleItems) {
        var startTimeOfTheLastQuestStr = scheduleItems.last().find('input[type="time"]').val();
        var startTimeOfTheLastQuest = stringToTime(startTimeOfTheLastQuestStr);
        
        var timeLimit = new Date();
        timeLimit.setHours(22);
        timeLimit.setMinutes(0);

        var duration = $('input[name=duration]').val();
        var startTimeOfTheNextQuestStr = "";

        if (duration && startTimeOfTheLastQuestStr) {
            
            var startTimeOfTheNextQuest = getTheStartTimeOfTheNextQuest(startTimeOfTheLastQuest, parseInt(duration) + 30); // +30 - Плюс время на перерыв между квестами.
            if (startTimeOfTheNextQuest.getTime() > timeLimit.getTime()) {
                return;
            }
            startTimeOfTheNextQuestStr = timeToString(startTimeOfTheNextQuest);
        }


        scheduleItems.last().after(`<div class="col-12 schedule-item">
                                        <input type="time" name="time`+scheduleItems.length+`" class="form-control
                                            min="09:00" max="22:00" value="`+startTimeOfTheNextQuestStr+`" required>
                                        &#8594;
                                        <input type="number" name="price`+scheduleItems.length+`" class="form-control" min="0" required>
                                    </div>`
        );
    }

    function stringToTime(str) {
        var hoursAndMinutesStr = str.split(':');
        var hoursAndMinutesDate = new Date();

        hoursAndMinutesDate.setHours(hoursAndMinutesStr[0]);
        hoursAndMinutesDate.setMinutes(hoursAndMinutesStr[1]);

        return hoursAndMinutesDate;
    }

    function getTheStartTimeOfTheNextQuest(startTimeOfTheLastQuest, duration) {

        var durationMilliseconds = duration * 60 * 1000;
        
        startTimeOfTheLastQuest.setTime(startTimeOfTheLastQuest.getTime() + durationMilliseconds);
        
        return startTimeOfTheLastQuest;
    }

    function timeToString(time) {
        return time.getHours() + ":" + ((time.getMinutes() < 10) 
                                            ? ('0' + time.getMinutes()) 
                                            : time.getMinutes());
    }

    function isOneTimeMoreThanAnother(time1, time2) {
        return time1.getTime() > time2.getTime();
    }

    function validateScheduleTime(time) {
        var thisTimeObj = $(time);
        var thisTimeStr = thisTimeObj.val();

        if (!thisTimeStr) {
            return;
        }

        var thisTimeDataTime = stringToTime(thisTimeStr);
        var parent = thisTimeObj.closest('.schedule-item')
        var previousScheduleItems = parent.prevAll();

        previousScheduleItems.each(function() {
            var previousTimeObj = $(this).find('input[type="time"]');
            var previousTimeStr = previousTimeObj.val();

            if (previousTimeStr) {

                var previousTimeDataTime = stringToTime(previousTimeStr);

                if (isOneTimeMoreThanAnother(previousTimeDataTime, thisTimeDataTime)) {
                    if (!thisTimeObj.hasClass('is-invalid')) {
                        thisTimeObj.addClass('is-invalid');
                    }
                    //thisTimeObj.val('');
                    return false;
                }
                else {
                    if (thisTimeObj.hasClass('is-invalid')) {
                        thisTimeObj.removeClass('is-invalid');
                    }
                }
            }
        });

        var nextScheduleItems = parent.nextAll();

        nextScheduleItems.each(function() {
            var nextTimeObj = $(this).find('input[type="time"]');
            var nextTimeStr = nextTimeObj.val();

            if (nextTimeStr) {

                var nextTimeDataTime = stringToTime(nextTimeStr);

                if (isOneTimeMoreThanAnother(thisTimeDataTime, nextTimeDataTime)) {
                    if (!nextTimeObj.hasClass('is-invalid')) {
                        nextTimeObj.addClass('is-invalid');
                    }
                    //nextTimeObj.val('');

                }
                else {
                    if (nextTimeObj.hasClass('is-invalid')) {
                        nextTimeObj.removeClass('is-invalid');
                    }
                }
            }
        })
    }

    function addNewQuest(form) {

        var title = $(form).find('input[name="title"]').val();
        var type_of_game_id = $(form).find('select[name="type_of_game"]').val();
        var address = $(form).find('input[name="address"]').val();
        var age_limit = $(form).find('input[name="age_limit"]').val();
        var level_of_difficalty = $(form).find('select[name="level_of_difficalty"]').val();
        var level_of_fear = $(form).find('select[name="level_of_fear"]').val();
        var duration = $(form).find('input[name="duration"]').val();
        var min_number_of_players = $(form).find('input[name="min_number_of_players"]').val();
        var max_number_of_players = $(form).find('input[name="max_number_of_players"]').val();
        var annotation = $(form).find('textarea[name="annotation"]').val();
        var full_desc = $(form).find('textarea[name="full_desc"]').val();
        var specifics = $(form).find('textarea[name="specifics"]').val();

        var genresId = [];
        
        /* Считываение жанров */
        $(form).find('input:checkbox:checked').each(function() {
            genresId.push(this.value);
        });

        /* Считывание рассписания */
        var schedule = {};

        var weekdaysSchedule = [];
        var weekendSchedule = [];

        var weekdaysScheduleItems = $("#weekdays-schedule-items > .schedule-item");
        var weekendScheduleItems = $("#weekend-schedule-items > .schedule-item");

        weekdaysScheduleItems.each(function(index) {
            var time = $(this).find('input[name="time'+index+'"]').val();
            var price = $(this).find('input[name="price'+index+'"]').val();
            //console.log(time + "   " + price);
            weekdaysSchedule.push({time: time, price: price});
        });
        
        weekendScheduleItems.each(function(index) {
            var time = $(this).find('input[name="time'+index+'"]').val();
            var price = $(this).find('input[name="price'+index+'"]').val();
            //console.log(time + "   " + price);

            weekendSchedule.push({time: time, price: price});
        });

        schedule.weekdays = weekdaysSchedule;
        schedule.weekend = weekendSchedule;
        
        var formData = new FormData();

        formData.append('action', 'INSERT');
        formData.append('title', title);
        formData.append('address', address);
        formData.append('age_limit', age_limit);
        formData.append('level_of_difficalty', level_of_difficalty);
        formData.append('level_of_fear', level_of_fear);
        formData.append('duration', duration);
        formData.append('min_number_of_players', min_number_of_players);
        formData.append('max_number_of_players', max_number_of_players);
        formData.append('annotation', annotation);
        formData.append('full_desc', full_desc);
        formData.append('specifics', specifics);
        formData.append('schedule', JSON.stringify(schedule));
        formData.append('genresId', genresId);
        formData.append('type_of_game_id', type_of_game_id);

        $.each($(form).find('input[name="image"]')[0].files,function(key, input){
			formData.append('images[]', input);
		});
        
        $.ajax({
            url: "queryProcessing.php", 
            type: 'POST',
            data: formData, 
            processData: false,
            contentType: false,
            success: function (receivedData) {
                
                var receivedDataJSON = JSON.parse(receivedData);
                
                if (receivedDataJSON.status === 'SUCCESS') {
                    
                    var quest = JSON.parse(receivedDataJSON.quest);
                    var domain = receivedDataJSON.domain;
                    //console.log(receivedDataJSON.quest_id);

                    $('.quest_list > .col')
                    .last()
                    .before(`<div class="col">
                                <div id="`+ quest.id +`" class="quest__card card text-white bg-dark mb-3">
                                    <a role="button" class="quest-link">
                                        <img src="`+ domain + `/` + quest.path_to_images +`0.jpeg" class="card-quest-img card-img-top" alt="...">
                                        <div class="card-img-overlay">
                                            <p class="card-text">`+ quest.annotation +`</p>
                                        </div>
                                    </a>
                                    <div class="card-body">
                                        <h5 class="card-title">
                                            `+ quest.title +`
                                        </h5>
                                        <p class="card-text">
                                            `+ quest.type_of_game +`
                                        </p>
                                        <a href="#" class="btn btn-outline-danger">Бронювати</a>
                                    </div>
                                    <div type="button" class="delete_quest_btn">
                                        <div class="circle">
                                            <div class="line"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>`
                    );


                    // Добавляем обработчики на новосозданную карточку квеста.
                    $('.quest_list > .col').last().prev().find('.quest-link').click(function(){
                        loadFullInfoAboutQuest(this);
                        quest_full_info_modal.show();
                    });
                    $('.quest_list > .col').last().prev().find('.delete_quest_btn').click(function() {
                        var questBlock = $(this).closest('.quest__card');
                        deleteQuest(questBlock);
                    });

                    $(form).removeClass('was-validated');
                    form.reset();
                    add_new_quest_modal.hide();
                }
                else if (receivedDataJSON.status === 'ERROR') {
                    console.log("error");
                    var errors = receivedDataJSON.errors;

                    if (errors.length != 0) {
                        errors.forEach(element => {
                            console.log(element);
                        });
                    }
                }

            }
        });
    }

    function deleteQuest(questBlock) {

        var questId = questBlock.attr('id');

        var formData = new FormData();
        formData.append('action', 'DELETE');
        formData.append('quest_id', questId);

        $.ajax({
            url: "queryProcessing.php", 
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: (data) => {
                if (data === 'SUCCESS') {
                    console.log(data);
                    questBlock.closest('div.col').remove();
                }
            }
        });
    }

    function loadFullInfoAboutQuest(questBlock) {
        $.get('getModal.php', {quest_id: $(questBlock).parent().attr('id')}, function(quest) {

            $("#quest_title").html(quest.title);
            $("#quest_desc > p").html(quest.full_desc);
            $("#quest_number_of_players").html(quest.number_of_players);
            $("#quest_age_limit").html(quest.age_limit);
            $("#quest_duration").html(quest.duration);
            $("#quest_address").html(quest.address);
            $("#quest_specifics > p").html(quest.specifics);

            // Загрузка изображений
            var carouselInner = $("#quest-full-info-img-carousel > .carousel-inner");

            for (var i = 0; i < quest.number_of_images; i++) {
                carouselInner.append(`<div class="carousel-item quest-modal-carousel-item`+(i == 0 ? ` active` : ``)+`">
                                        <img class="quest_modal-img d-block w-100 quest-modal-carousel-item-img" src="`+ quest.path_to_images + i + `.jpeg" class="card-img-top"
                                            alt="...">
                                    </div>`
                );
            }

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
                                                <button class="carousel-control-prev schedule-carousel-control-prev" type="button" data-bs-target="#contentContainer" data-bs-slide="prev">
                                                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                                                    <span class="visually-hidden">Previous</span>
                                                </button>
                                                <div id="schedule_carusel-inner" class="carousel-inner">

                                                </div>
                                                <button class="carousel-control-next schedule-carousel-control-next" type="button" data-bs-target="#contentContainer" data-bs-slide="next">
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

    }

    function makingTheQuestDateInactive (dayBlock, scheduleElement, bookings, currentDate, date) {

        var schedule_dateTime = stringToTime(scheduleElement.time);
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
})()