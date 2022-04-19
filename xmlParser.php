<?php
require_once("queryProcessing.php");

class RSSParser { 

    var $insideQuest = false; 

    var $tag = ""; 

    var $quests = array("quests" => array());

    function startElement($parser, $tagName, $attrs) { 
        if ($this->insideQuest) { 
            $this->tag = $tagName; 
        } elseif ($tagName == "QUEST") { 
            $this->quests["quests"][] = array();
            $this->insideQuest = true; 
        } 
    } 
    function endElement($parser, $tagName) { 
        if ($tagName == "QUEST") {   
            $this->insideQuest = false; 
        } 
        $this->tag = "";
    } 
    function characterData($parser, $data) {
        if ($this->insideQuest) { 

            $quest = &$this->quests["quests"][count($this->quests["quests"]) - 1];

            switch ($this->tag) { 
            case "TITLE": 
                if (!array_key_exists("title", $quest))
                    $quest["title"] = $data;
                break; 
            case "MIN_NUMBER_OF_PLAYERS": 
                if (!array_key_exists("min_number_of_players", $quest))
                    $quest["min_number_of_players"] = intval(trim($data)); 
                break; 
            case "MAX_NUMBER_OF_PLAYERS": 
                if (!array_key_exists("max_number_of_players", $quest))
                    $quest["max_number_of_players"] = intval(trim($data)); 
                break; 
            case "AGE_LIMIT": 
                if (!array_key_exists("age_limit", $quest))
                    $quest["age_limit"] = intval(trim($data)); 
                break; 
            case "LEVEL_OF_DIFFICULTY": 
                if (!array_key_exists("level_of_difficulty", $quest))
                    $quest["level_of_difficulty"] = intval(trim($data)); 
                break; 
            case "LEVEL_OF_FEAR": 
                if (!array_key_exists("level_of_fear", $quest))
                    $quest["level_of_fear"] = intval(trim($data)); 
                break; 
            case "DURATION": 
                if (!array_key_exists("duration", $quest))
                    $quest["duration"] = intval(trim($data)); 
                break; 
            case "ADDRESS": 
                if (!array_key_exists("address", $quest))
                    $quest["address"] = trim($data); 
                break; 
            case "GENRES_ID": 
                if (!array_key_exists("genres_id", $quest)) {
                    $quest["genres_id"] = explode(",", trim($data));
                }
                break; 
            case "ANNOTATION": 
                if (!array_key_exists("annotation", $quest))
                    $quest["annotation"] = trim($data); 
                break; 
            case "FULL_DESC": 
                if (!array_key_exists("full_desc", $quest))
                    $quest["full_desc"] = trim($data); 
                break; 
            case "SPECIFICS": 
                if (!array_key_exists("specifics", $quest))
                    $quest["specifics"] = trim($data); 
                break; 
            case "SCHEDULE": 
                if (!array_key_exists("schedule", $quest)){
                    $quest["schedule"] = htmlspecialchars(trim($data)); 
                }
                break; 
            case "PATH_TO_IMAGES": 
                if (!array_key_exists("path_to_images", $quest))
                    $quest["path_to_images"] = trim($data); 
                break; 
            case "NUMBER_OF_IMAGES": 
                if (!array_key_exists("number_of_images", $quest))
                    $quest["number_of_images"] = intval(trim($data)); 
                break; 
            case "TYPE_OF_GAME_ID":
                if (!array_key_exists("type_of_game_id", $quest))
                    $quest["type_of_game_id"] = intval(trim($data));
                break;
            } 
        } 
    } 

    function getData() {
        return $this->quests;
    }
}

$xml_parser = xml_parser_create(); 
$rss_parser = new RSSParser(); 
xml_set_object($xml_parser, $rss_parser); 
xml_set_element_handler($xml_parser, "startElement", "endElement"); 

xml_set_character_data_handler($xml_parser, "characterData"); 
$fp = fopen("prim.rss","r") 
   or die("Error reading RSS data."); 
while ($data = fread($fp, 4096)) 
   xml_parse($xml_parser, $data, feof($fp)) 
       or die(sprintf("XML error: %s at line %d",  
           xml_error_string(xml_get_error_code($xml_parser)),  
           xml_get_current_line_number($xml_parser))); 

fclose($fp); 
xml_parser_free($xml_parser);

$insertData = $rss_parser->getData();

// Виведення даних з xml-файлу на екран.
echo '<pre>';
var_dump($insertData);
echo '</pre>';

// Додавання даних з xml-файлу у базу даних.
foreach($insertData['quests'] as $quest) {
    insertIntoQuest(array("title" => $quest['title'], 
            "min_number_of_players" => $quest['min_number_of_players'], 
            "max_number_of_players" => $quest['max_number_of_players'],
            "age_limit" => $quest['age_limit'], 
            "level_of_difficulty" => $quest['level_of_difficulty'], 
            "level_of_fear" => $quest['level_of_fear'],
            "duration" => $quest['duration'], 
            "address" => $quest['address'],
            "annotation" => $quest['annotation'],
            "full_desc" => $quest['full_desc'],
            "specifics" => $quest['specifics'],
            "schedule" => $quest['schedule'],
            "path_to_images" => $quest['path_to_images'],
            "number_of_images" => $quest['number_of_images'],
            "type_of_game_id" => $quest['type_of_game_id'])
    );
}
