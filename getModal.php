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

$data = bd("SELECT * FROM quest WHERE id=:quest_id", array("quest_id"=>$quest_id));
$path_to_img = $domain.$data[0]["path_to_images"];
$result = array(
    'quest_title' => $data[0]["title"],
    'path_to_img' => $path_to_img,
    'number_of_players' => $data[0]["min_number_of_players"].' - '.$data[0]["max_number_of_players"],
    'age_limit' => $data[0]["age_limit"].'+',
    'duration' => $data[0]["duration"],
    'address' => $data[0]["address"],
    'full_desc' => $data[0]["full_desc"],
    'specifics' => $data[0]["specifics"]
    
);

echo json_encode($result);


