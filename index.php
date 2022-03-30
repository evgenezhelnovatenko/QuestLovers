<?php

// $link = mysqli_connect("localhost", "root", "dinamo03");

// if ($link == false){
//     print("Ошибка: Невозможно подключиться к MySQL " . mysqli_connect_error());
// }
// else {
//     print("Соединение установлено успешно");
// }



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
    

    $data=bd("SELECT * FROM genre", array());
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

    $data = bd("SELECT * FROM quest", array());
    $block = "";
    if(count($data)!=0) {
        foreach($data as $d) {
            $type_of_game = bd("SELECT name FROM type_of_game WHERE id=:type_of_game_id", array("type_of_game_id"=>$d["type_of_game_id"]));

            $block .= '<div class="col">
            <div id="'.$d["id"].'" class="quest__card card text-white bg-dark mb-3">
                <a role="button" class="quest-link">
                    <img src="{{domain}}'.$d["path_to_images"].'" class="card-img-top" alt="...">
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
                </div>
            </div>';
        }
    }
    else {
        $block = '<h5 class="card-title">Нажаль, на даний момент немає жодного квесту</h5>';
    }

    $view=str_replace("{{quest_cards}}",$block,$view);
    $view=str_replace("{{domain}}",$domain,$view);

    echo $view;
}

// function modal($quest_id) {
//     $viewModal=file_get_contents("view/content.html");

//     $data = bd("SELECT * FROM quest WHERE id=:quest_id", array("quest_id"=>$quest_id));

//     echo 'dfsdlkfjklsfklsdhflkshfklshfkl';

//     $viewModal=str_replace("{{quest_title}}",$data[0]["title"],$viewModal);
//     //$viewModal=str_replace("{{path_to_img}}",$data["path_to_img"],$viewModal);
//     //$viewModal=str_replace("{{full_quest_desc}}",$data["full_desc"],$viewModal);

//     // $viewContent = file_get_contents("view/content.html");
//     // $viewContent=str_replace("{{modal_window}}",$viewModal,$viewContent);
 
// }

function main() {
    slider();
    content();
}

function home() {
    top("Головна");

    main();

    bottom();
}

function bd($sql, $prm){
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
    $stmt = $pdo->prepare($sql);
    $stmt->execute($prm);
    $data=$stmt->fetchAll();
    //var_dump($data);
    return $data;
}

function error() {
    // $view=file_get_contents("view/head.html");
    // $domain=$_SERVER["REQUEST_SCHEME"]."://".$_SERVER["SERVER_NAME"];
    // $view=str_replace("{{domain}}",$domain,$view);
    // $view=str_replace("{{title}}",$title,$view);
    // echo $view;
    // echo '<div class="container"><h1>#404</h1><h5>Сторінка відсутня</h5></div>';

}

