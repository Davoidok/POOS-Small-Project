<?php

require 'api.php';
setCORSHeadersAndHTTPMethod();

// Expected {"search":..., "userId":...}
$input = getJsonRequest();

try{

    $conn = new PDO("mysql:host=localhost;dbname=$dbname", $dbuser, $dbpassword);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $search = trim($input['search']);
    $userId = $input['userId'];

    $stmt = $conn->prepare("SELECT *,
                                                       (`FirstName` LIKE :search) AS matchesFirstName,
                                                       (`LastName`  LIKE :search) AS matchesLastName,
                                                       (CONCAT(`FirstName`,' ',`LastName`) LIKE :search) AS matchesFirstLastName,
                                                       (`Phone`     LIKE :search) AS matchesPhone,
                                                       (`Email`     LIKE :search) AS matchesEmail
                                                        FROM `Contacts` 
                                                        WHERE (`FirstName` LIKE :search 
                                                          OR `LastName` LIKE :search 
                                                          OR CONCAT(`FirstName`,' ',`LastName`) LIKE :search 
                                                          OR `Phone` LIKE :search 
                                                          OR `Email` LIKE :search) 
                                                         AND `UserID`=:userId");
    $stmt->bindValue(":search", '%' . $search . '%');
    $stmt->bindValue(":userId", $userId);
    $stmt->execute();
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
 * Expects ID, FirstName, LastName, Phone, Email
 * @return void
 */
function returnDatabaseSearchResult(array $result){
    $json = ["success"=>true, "result"=>[], "error"=>""];
    foreach($result as $entry){
        $json['result'][] = [
            'ID'=>$entry['ID'],
            'firstName'=>$entry['FirstName'],
            'lastName'=>$entry['LastName'],
            'phone'=>$entry['Phone'],
            'email'=>$entry['Email'],
            'matchesFirstName'=>$entry['matchesFirstName'] == "1" ? true : false,
            'matchesLastName'=>$entry['matchesLastName']  == "1" ? true : false,
            'matchesPhone'=>$entry['matchesPhone']  == "1" ? true : false,
            'matchesEmail'=>$entry['matchesEmail']  == "1" ? true : false
        ];
    }
    sendJsonResult(json_encode($json));
}

?>