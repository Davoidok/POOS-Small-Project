<?php

require 'api.php';

// Expected {"firstName":..., "lastName":..., "phone":..., "email":..., "userId":...}
$input = getJsonRequest();


try{

    $conn = new PDO("mysql:host=localhost;dbname=COP4331", "TheBeast", "WeLoveCOP4331");
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $fields = ['firstName'=>"FirstName",
                'lastName'=>"LastName",
                   'phone'=>"Phone",
                   'email'=>"Email"];

    $search_str = [];
    $params = [];
    foreach($fields as $k=>$col){
        if(!(trim($input[$k]) === '')){
            $search_str[] = "`$col` LIKE ?";
            $params[] = '%' . trim($input[$k]) . '%';
        }
    }
    $search_str[] = "`UserID`=?";
    $params[] = $input['userId'];

    $stmt = $conn->prepare("SELECT `FirstName`, `LastName`, `Phone`, `Email`
                                               FROM `Contacts` WHERE ". implode(' AND ', $search_str));
    $stmt->execute($params);
    $res = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    returnDatabaseSearchResult($res);
    
    $conn = null;
    $stmt = null;

} catch(PDOException $e){
    returnWithError($e->getMessage());
}

/**
 * Sends a search result from the database in JSON format.
 * @param array $result An associative array fetched directly from the database.
 * Expectes FirstName, LastName, Phone, Email, and UserID
 * @return void
 */
function returnDatabaseSearchResult(array $result){
    $json = ["success"=>true];
    foreach($result as &$entry){
        $entry['firstName'] = $entry['FirstName'];
        $entry['lastName'] = $entry['LastName'];
        $entry['phone'] = $entry['Phone'];
        $entry['email'] = $entry['Email'];

        unset($entry['FirstName'], $entry['LastName'], $entry['Phone'], $entry['Email']);
    }
    unset($entry);
    $json['result'] = $result;
    $json['error'] = "";
    sendJsonResult(json_encode($json));
}

?>