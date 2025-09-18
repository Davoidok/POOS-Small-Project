<?php

require 'api.php';
setCORSHeadersAndHTTPMethod();

// Expecting {"firstName":...,"lastName":...,"login":...,"password":...}
$input = getJsonRequest();

try{
    $conn = new PDO("mysql:host=localhost;dbname=$dbname", $dbuser, $dbpassword);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Trim first and last name so they print nicely
    $fname = trim($input['firstName']);
    $lname = trim($input['lastName']);
    $login = $input['login'];
    $passw = $input['password'];

    $stmt = $conn->prepare("SELECT `ID` FROM Users WHERE `Login`=?");
    $stmt->execute([$login]);

    $isInDatabase = $stmt->fetch();

    if($fname === '' || $lname === '')
        returnWithError("First and last names cannot be blank");
    elseif(str_contains($login, ' '))
        returnWithError("Username cannot have whitespaces");
    elseif($login === '')
        returnWithError("Must create a username");
    elseif($passw === '')
        returnWithError("Must create a password");
    elseif(trim($passw) === '')
        returnWithError("Password cannot be blank");
    elseif($isInDatabase)
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