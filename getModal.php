<?php

require_once("index.php");

date_default_timezone_set('Europe/London');

//Ищем все входящие GET запросы
$logs = "";
foreach ($_GET as $key => $value) {
    $logs .= date("Y-m-d H:i:s").' || '. $key. '|'. $value;
}
//Записываем результат с новой строки
file_put_contents('logs.txt', $logs. "\r\n", FILE_APPEND);

$quest_id = $_REQUEST["quest_id"];
$domain=$_SERVER["REQUEST_SCHEME"]."://".$_SERVER["SERVER_NAME"];

$quest = bd("SELECT", "SELECT * FROM quest WHERE id=:quest_id", array("quest_id"=>$quest_id));
$genres_id = bd('SELECT', "SELECT genre_id FROM quest_has_genre WHERE quest_id=:id", array("id"=>$quest_id));
$quest_bookings = bd("SELECT", "SELECT date_and_time, status FROM booking WHERE quest_id=:id", array("id"=>$quest_id));
$genres = array();

foreach ($genres_id as $genre_id) {
    $genre = bd("SELECT", "SELECT name FROM genre WHERE id=:genre_id", array("genre_id"=>$genre_id["genre_id"]));
    array_push($genres, $genre[0]["name"]);
}

$path_to_img = $domain.$quest[0]["path_to_images"];
$result = array(
    'title' => $quest[0]["title"],
    'path_to_img' => $path_to_img,
    'number_of_players' => $quest[0]["min_number_of_players"].' - '.$quest[0]["max_number_of_players"],
    'age_limit' => $quest[0]["age_limit"].'+',
    'duration' => $quest[0]["duration"],
    'address' => $quest[0]["address"],
    'full_desc' => $quest[0]["full_desc"],
    'specifics' => $quest[0]["specifics"],
    'genres' => $genres,
    'path_to_images' => $quest[0]['path_to_images'],
    'number_of_images' => $quest[0]['number_of_images'],
    'schedule' => $quest[0]["schedule"],
    'bookings' => $quest_bookings
);

echo json_encode($result);


