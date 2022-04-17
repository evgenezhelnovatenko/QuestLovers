<?php

require_once("index.php");

if (isset($_POST['action'])) {

    $errors = array();
    $destination_path = getcwd().DIRECTORY_SEPARATOR;

    switch ($_POST['action']) {
    case 'INSERT': {
        $title = null;
        $address = null;
        $age_limit = null;
        $level_of_dificalty = null;
        $level_of_fear = null;
        $duration = null;
        $min_number_of_players = null;
        $max_number_of_players = null;
        $annotation = null;
        $full_desc = null;
        $specifics = null;
        $schedule = "{}";
        $image = null;
        $type_of_game_id = null;

        $genresId = array();

        // echo "<pre>";
        // var_dump($_FILES);
        // echo "</pre>";

        if (isset($_POST['title']) &&
            isset($_POST['min_number_of_players']) &&
            isset($_POST['max_number_of_players']) &&
            isset($_POST['age_limit']) &&
            isset($_POST['level_of_difficalty']) &&
            isset($_POST['level_of_fear']) &&
            isset($_POST['duration']) &&
            isset($_POST['address']) &&
            isset($_POST['annotation']) &&
            isset($_POST['full_desc']) &&
            isset($_POST['specifics']) &&
            isset($_POST['schedule']) &&
            isset($_POST['type_of_game_id']) &&
            isset($_POST['genresId']) &&
            isset($_FILES)
            ) {

            $title =  $_POST['title'];
            $min_number_of_players = $_POST['min_number_of_players'];
            $max_number_of_players = $_POST['max_number_of_players'];
            $age_limit = $_POST['age_limit'];
            $level_of_difficalty = $_POST['level_of_difficalty'];
            $level_of_fear = $_POST['level_of_fear'];
            $duration = $_POST['duration'];
            $address = $_POST['address'];
            $annotation = $_POST['annotation'];
            $full_desc = $_POST['full_desc'];
            $specifics = $_POST['specifics'];
            $schedule = $_POST['schedule'];
            $type_of_game_id = $_POST['type_of_game_id'];
            $genresId = explode(",", $_POST['genresId']);
            

            // if (!is_int($min_number_of_players)) {
            //     array_push($errors, "Поле з мінімальною кількістю гравців повинно бути числовим.");
            // }
            // if (!is_int($max_number_of_players)) {
            //     array_push($errors, "Поле з максимальною кількістю гравців повинно бути числовим.");
            // }
            // if (!is_int($age_limit)) {
            //     array_push($errors, "Поле з віковим обмеженням повинно бути числовим.");
            // }
            // if (!is_int($level_of_difficalty)) {
            //     array_push($errors, "Поле з рівнем складності повинно бути числовим.");
            // }
            // if (!is_int($level_of_fear)) {
            //     array_push($errors, "Поле з рівнем страху повинно бути числовим.");
            // }
            // if (!is_int($duration)) {
            //     array_push($errors, "Поле з тривалістю квесту повинно бути числовим.");
            // }
            // if (!is_int($type_of_game_id)) {
            //     array_push($errors, "Поле з типом гри повинно бути числовим.");
            // }
            // foreach($genresId as $genreId) {
            //     if (!is_int($genreId))  {
            //         array_push($errors, "Один з жанрів не є числовим значенням");
            //         break;
            //     }
            // }

            //var_dump(json_encode($schedule));

            $images = array();
            $diff = count($_FILES['images']) - count($_FILES['images'], COUNT_RECURSIVE);
            if ($diff == 0) {
                $images = array($_FILES['images']);
            } else {
                foreach($_FILES['images'] as $k => $l) {
                    foreach($l as $i => $v) {
                        $images[$i][$k] = $v;
                    }
                }		
            }

            /* Загрузка изображений на сервер */

            //$test = "";
            $path_to_image = 'img/quests/' . translit($title) . "_";
            $numberOfImages = 0;
            foreach ($images as $image) {
                if (!empty($image['error']) || empty($image['tmp_name'])) {
                    $error = 'Не удалось загрузить файл.';
                } elseif ($image['tmp_name'] == 'none' || !is_uploaded_file($image['tmp_name'])) {
                    $error = 'Не удалось загрузить файл.';
                } else {
                    
                    move_uploaded_file($image['tmp_name'], $destination_path . $path_to_image . $numberOfImages . ".jpeg");
                    //$test .= $destination_path . 'img/quests/' . translit($title) . "_" . $numberOfImages . ".jpeg;  ";
                    $numberOfImages++;
                }
            }

            


            //echo $test;

            if (!empty($errors)) {
                echo json_encode(array("status" => "ERROR", "errors" => $errors));
            } else {

                $query = 'INSERT INTO quest (title, 
                                        min_number_of_players, 
                                        max_number_of_players, 
                                        age_limit, 
                                        level_of_difficulty, 
                                        level_of_fear,
                                        duration, 
                                        address, 
                                        annotation, 
                                        full_desc, 
                                        specifics, 
                                        schedule, 
                                        path_to_images, 
                                        number_of_images,
                                        type_of_game_id)
                            VALUE (:title, 
                                    :min_number_of_players, 
                                    :max_number_of_players, 
                                    :age_limit, 
                                    :level_of_difficulty,
                                    :level_of_fear,
                                    :duration, 
                                    :address, 
                                    :annotation, 
                                    :full_desc, 
                                    :specifics,
                                    :schedule, 
                                    :path_to_images, 
                                    :number_of_images,
                                    :type_of_game_id);';

                $questId = bd("INSERT", $query, array("title" => $title, 
                                "min_number_of_players" => $min_number_of_players, 
                                "max_number_of_players" => $max_number_of_players,
                                "age_limit" => $age_limit, 
                                "level_of_difficulty" => $level_of_difficalty, 
                                "level_of_fear" => $level_of_fear,
                                "duration" => $duration, 
                                "address" => $address,
                                "annotation" => $annotation,
                                "full_desc" => $full_desc,
                                "specifics" => $specifics,
                                "schedule" => $schedule,
                                "path_to_images" => $path_to_image,
                                "number_of_images" => $numberOfImages,
                                "type_of_game_id" => $type_of_game_id)
                );


                /* Добавление полей в quest_has_genre */
                
                $query = 'INSERT INTO quest_has_genre (quest_id, genre_id)
                                VALUE (:quest_id, :genre_id);';

                foreach ($genresId as $genreId) {

                    //echo $genreId;
                    bd("INSERT", $query, array("quest_id" => $questId, "genre_id" => $genreId));

                }

                $quest = getQuestById($questId);
                $typeOfGame = getTypeOfGameById($quest['type_of_game_id']);
                $domain=$_SERVER["REQUEST_SCHEME"]."://".$_SERVER["SERVER_NAME"];

                echo json_encode(array(
                    "status" => "SUCCESS", 
                    "domain" => $domain,
                    "quest" => json_encode(array(
                                            "id" => $questId,
                                            "title" => $quest['title'], 
                                            "annotation" => $quest['annotation'], 
                                            "type_of_game" => $typeOfGame,
                                            "path_to_images" => $quest['path_to_images']
                                            )
                                )
                ));
            }
        }
        else
            echo json_encode(array("status" => "ERROR", "errors" => $errors));

        break;
    }
    case 'DELETE': {

        if (isset($_POST['quest_id'])) {
            $quest_id = $_POST['quest_id'];
            
            $quest = getQuestById($quest_id);
            $pathToImages = $quest['path_to_images'];
            $numberOfImages = $quest['number_of_images'];
            $filename = "";

            for ($i = 0; $i < $numberOfImages; $i++) {
                $filename = $destination_path . $pathToImages . $i . ".jpeg";
                //file_put_contents('qw.txt', $filename . "\r\n", FILE_APPEND);
                unlink($filename);
            }
            
            $query = "DELETE FROM quest WHERE id=:quest_id";
            bd("DELETE", $query, array("quest_id" => $quest_id));

            echo "SUCCESS";
        }
        else {
            echo "Error: quest was not deleted.";
        }

        break;
    }
    }
}

function getQuestById($questId) {
    return bd("SELECT", "SELECT * FROM quest WHERE id=:quest_id", array("quest_id"=>$questId))[0];
}

function getTypeOfGameById($typeOfGameId) {
    return bd("SELECT", "SELECT * FROM type_of_game where id=:type_of_game_id", array("type_of_game_id" => $typeOfGameId))[0]['name'];
}

function translit($st) {
    $st = mb_strtolower($st, "utf-8");
    $st = str_replace([
        '?', '!', '.', ',', ':', ';', '*', '(', ')', '{', '}', '[', ']', '%', '#', '№', '@', '$', '^', '-', '+', '/', '\\', '=', '|', '"', '\'',
        'а', 'б', 'в', 'г', 'д', 'е', 'ё', 'з', 'и', 'й', 'к',
        'л', 'м', 'н', 'о', 'п', 'р', 'с', 'т', 'у', 'ф', 'х',
        'ъ', 'ы', 'э', ' ', 'ж', 'ц', 'ч', 'ш', 'щ', 'ь', 'ю', 'я'
    ], [
        '_', '_', '.', '_', '_', '_', '_', '_', '_', '_', '_', '_', '_', '_', '_', '_', '_', '_', '_', '_', '_', '_', '_', '_', '_', '_', '_',
        'a', 'b', 'v', 'g', 'd', 'e', 'e', 'z', 'i', 'y', 'k',
        'l', 'm', 'n', 'o', 'p', 'r', 's', 't', 'u', 'f', 'h',
        'j', 'i', 'e', '_', 'zh', 'ts', 'ch', 'sh', 'shch',
        '', 'yu', 'ya'
    ], $st);
    $st = preg_replace("/[^a-z0-9_.]/", "", $st);
    $st = trim($st, '_');

    $prev_st = '';
    do {
        $prev_st = $st;
        $st = preg_replace("/_[a-z0-9]_/", "_", $st);
    } while ($st != $prev_st);

    $st = preg_replace("/_{2,}/", "_", $st);
    return $st;
}

function escapedString($str) {
    $pdo = getDBConnection();
    return $pdo->quote($str);
}

?>