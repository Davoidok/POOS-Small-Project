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
 * Expects FirstName, LastName, Phone, Email
 * @return void
 */
function returnDatabaseSearchResult(array $result){
    $json = ["success"=>true, "result"=>[], "error"=>""];
    foreach($result as $entry){
        $json['result'][] = [
            'firstName'=>$entry['FirstName'],
            'lastName'=>$entry['LastName'],
            'phone'=>$entry['Phone'],
            'email'=>$entry['Email']
        ];
    }
    sendJsonResult(json_encode($json));
}

?>