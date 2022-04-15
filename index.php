<?php

$path=explode("/", $_SERVER["REQUEST_URI"]);

switch ($path[1]) {
    case '':
        home();
        break;
    default:
        error();
        break;
}

function top($title) {
    $view=file_get_contents("view/top.html");
    $domain=$_SERVER["REQUEST_SCHEME"]."://".$_SERVER["SERVER_NAME"];
    $view=str_replace("{{domain}}",$domain,$view);
    $view=str_replace("{{title}}",$title,$view);
    

    $data=bd("SELECT", "SELECT * FROM genre", array());
    $block = "";
    if(count($data)!=0) {
        foreach($data as $d) {
            $block .='<div class="col-xs categories-dropdown-item">
                        <a class="dropdown-item" href="#">'
                            .$d["name"]
                        .'</a>
                    </div>';
        }
    }
    else {
        $block = '<div class="col-xs categories-dropdown-item"><a class="dropdown-item" href="#">Жанрів немає</a></div>';
    }
    $view=str_replace("{{list_of_genres}}",$block,$view);
    
    echo $view;
}

function bottom() {
    $view=file_get_contents("view/bottom.html");
    $domain=$_SERVER["REQUEST_SCHEME"]."://".$_SERVER["SERVER_NAME"];
    $genreData=bd("SELECT", "SELECT * FROM genre", array());
    $typesOfGamesData=bd("SELECT", "SELECT * FROM type_of_game", array());

    $genres = "";
    $typesOfGames = "";

    if (count($genreData) != 0) {
        foreach($genreData as $d) {
            $genres .= '<div class="col">
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" value="'.$d["id"].'" id="checkbox'.$d["id"].'">
                                <label class="form-check-label" for="checkbox{$d["id"]}">'
                                    .$d["name"].
                                '</label>
                            </div>
                        </div>';
        }
    }

    if (count($typesOfGamesData) != 0) {
        foreach($typesOfGamesData as $d) {
            $typesOfGames .= '<option value="'.$d["id"].'">'.$d["name"].'</option>';
        }
    }
    
    $view=str_replace("{{genres}}", $genres, $view);
    $view=str_replace("{{types_of_games}}", $typesOfGames, $view);
    $view=str_replace("{{domain}}",$domain,$view);

    echo $view;
}

function slider() {
    $view=file_get_contents("view/slider.html");
    $domain=$_SERVER["REQUEST_SCHEME"]."://".$_SERVER["SERVER_NAME"];
    $view=str_replace("{{domain}}",$domain,$view);

    echo $view;
}

function content() {
    $view=file_get_contents("view/content.html");
    $domain=$_SERVER["REQUEST_SCHEME"]."://".$_SERVER["SERVER_NAME"];

    $questData = bd("SELECT", "SELECT * FROM quest", array());
    
    $questCard = "";
    

    if(count($questData)!=0) {
        foreach($questData as $d) {
            $type_of_game = bd("SELECT", "SELECT name FROM type_of_game WHERE id=:type_of_game_id", array("type_of_game_id"=>$d["type_of_game_id"]));

            $questCard .= '<div class="col">
                <div id="'.$d["id"].'" class="quest__card card text-white bg-dark mb-3">
                    <a role="button" class="quest-link">
                        <img src="{{domain}}'.$d["path_to_images"].'" class="card-quest-img card-img-top" alt="...">
                        <div class="card-img-overlay">
                            <p class="card-text">'.$d["annotation"].'</p>
                        </div>
                    </a>
                    <div class="card-body">
                        <h5 class="card-title">'
                            .$d["title"].'
                        </h5>
                        <p class="card-text">'
                            .$type_of_game[0]["name"].'
                        </p>
                        <a href="#" class="btn btn-outline-danger">Бронювати</a>
                    </div>
                    <div type="button" class="delete_quest_btn">
                        <div class="circle">
                            <div class="line"></div>
                        </div>
                    </div>
                </div>
            </div>';
        }
    }
    else {
        $questCard = '<h5 class="card-title">Нажаль, на даний момент немає жодного квесту</h5>';
    }

    

    $view=str_replace("{{quest_cards}}",$questCard,$view);
    $view=str_replace("{{domain}}",$domain,$view);

    echo $view;
}

function main() {
    slider();
    content();
}

function home() {
    top("Головна");

    main();

    bottom();
}

function bd($queryType, $sql, $prm){
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
    $pdo = new PDO($dsn, $user, $pass, $opt);

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

function error() {

}

