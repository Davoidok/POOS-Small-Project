<?php

require 'api.php';
setCORSHeadersAndHTTPMethod();

// Expecting {"firstName":...,"lastName":...,"login":...,"password":...}
$input = getJsonRequest();

try{
    $conn = new PDO("mysql:host=localhost;dbname=$dbname", $dbuser, $dbpassword);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $fname = trim($input['firstName']);
    $lname = trim($input['lastName']);
    $login = $input['login'];
    $passw = $input['password'];

    $stmt = $conn->prepare("SELECT `ID` FROM Users WHERE `Login`=?");
    $stmt->execute([$login]);

    $isInDatabase = $stmt->fetch();

    if($isInDatabase)
        returnWithError("Username already in use");
    else{
        $stmt = $conn->prepare("INSERT INTO Users (`FirstName`, `LastName`, `Login`, `Password`)
                                                       VALUES (?, ?, ?, ?)");
        if($stmt->execute([$fname, $lname, $login, $passw])){
            $userId = $conn->lastInsertId();
            returnWithLoginResult($userId, $fname, $lname);
        };
    }
  
    $conn = null;
    $stmt = null;

} catch(PDOException $e){
    returnWithError($e->getMessage());
}



?>