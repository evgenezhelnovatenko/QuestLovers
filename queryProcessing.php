<?php

require_once("index.php");

if (isset($_POST['action'])) {

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

        $genresId = [];

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
            $_FILES && $_FILES["image"]["error"]== UPLOAD_ERR_OK
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
            $image = $_FILES['image'];
            $type_of_game_id = $_POST['type_of_game_id'];
            $genresId = explode(",", $_POST['genresId']);

            //var_dump(json_encode($schedule));

            $destination_path = getcwd().DIRECTORY_SEPARATOR;
            move_uploaded_file($image['tmp_name'], $destination_path . 'img/quests/'. basename($image['name']));

            $path_to_image = '/img/quests/'. basename($image['name']);

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
                            )
                );
        }
        else
            echo json_encode(array("status" => "ERROR"));

        break;
    }
    case 'DELETE': {

        if (isset($_POST['quest_id'])) {
            $quest_id = $_POST['quest_id'];
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

?>