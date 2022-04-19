<?php

function getDBConnection() {
    $host = 'localhost';
    $db   = 'quest_lovers';
    $user = 'root';
    $pass = 'dinamo03';
    $charset = 'utf8';
    $dsn = "mysql:host=$host;dbname=$db;charset=$charset";
    $opt = [
        PDO::ATTR_ERRMODE =>PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ];

    return new PDO($dsn, $user, $pass, $opt);
}

function bd($queryType, $sql, $prm){
    
    $pdo = getDBConnection();

    switch ($queryType){
        case 'SELECT': {
            $stmt = $pdo->prepare($sql);
            $stmt->execute($prm);
            $data=$stmt->fetchAll();
            //var_dump($data);
            return $data;
        }
        case 'INSERT': {
            $pdo->prepare($sql)->execute($prm);
            return $pdo->lastInsertId();
        }
        case 'DELETE': {
            $pdo->prepare($sql)->execute($prm);
        }
    }

}

function getQuestById($questId) {
    return bd("SELECT", "SELECT * FROM quest WHERE id=:quest_id", array("quest_id"=>$questId))[0];
}

function getTypeOfGameById($typeOfGameId) {
    return bd("SELECT", "SELECT * FROM type_of_game where id=:type_of_game_id", array("type_of_game_id" => $typeOfGameId))[0]['name'];
}

function insertIntoQuest($prm) {
    $query = 'INSERT INTO quest (';
    $valueStr = 'VALUE (';

    $i = 0;
    foreach($prm as $key => $value) {
        $query .= ($key . ($i < (count($prm) - 1) ? ',' : ')')); 
        $valueStr .= (':' . $key . ($i < (count($prm) - 1) ? ',' : ');')); 
        $i++;
    }
    $query .= (' ' . $valueStr);

    return bd("INSERT", $query, $prm);
}

function insertIntoQuestHasGenre($questId, $genresId) {
    $query = 'INSERT INTO quest_has_genre (quest_id, genre_id)
    VALUE (:quest_id, :genre_id);';

    foreach ($genresId as $genreId) {

        bd("INSERT", $query, array("quest_id" => $questId, "genre_id" => $genreId));

    }
}