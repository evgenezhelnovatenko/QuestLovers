
var myModal = new bootstrap.Modal(document.getElementById('quest-full-info-modal'), {
    keyboard: false
})

$(".quest-link").click(function(){

    $.get('getModal.php', {quest_id: $(this).parent().attr('id')}, function(data) {

        $(".modal-title").html(data.quest_title);
        $("#quest_modal-img").attr('src', data.path_to_img)
        $("#quest_desc > p").html(data.full_desc);
        $("#quest_number_of_players").html(data.number_of_players);
        $("#quest_age_limit").html(data.age_limit);
        $("#quest_duration").html(data.duration);
        $("#quest_address").html(data.address);
        $("#quest_specifics > p").html(data.specifics);

        // Log the response to the console
        //console.log("Response: " + data.quest_title + data.path_to_img + data.full_quest_desc);

    }, "json");

    myModal.show()

})

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