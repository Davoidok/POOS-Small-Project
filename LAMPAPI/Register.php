<?php

require 'api.php';

// Expecting {"firstName":...,"lastName":...,"login":...,"password":...}
$input = getJsonRequest();

try{
    $conn = new PDO("mysql:host=localhost;dbname=COP4331", "TheBeast", "WeLoveCOP4331");
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Trim first and last name so they print nicely
    $fname = trim($input['firstName']);
    $lname = trim($input['lastName']);
    $login = $input['login'];
    $passw = $input['password'];

    $stmt = $conn->prepare("SELECT `ID` FROM Users WHERE `Login`=?");
    $stmt->execute([$login]);

    $isInDatabase = $stmt->fetch();

    if(empty($fname) || empty($lname))
        returnWithError("First and last names cannot be blank");
    elseif(str_contains($login, ' '))
        returnWithError("Username cannot have whitespaces");
    elseif(empty($login))
        returnWithError("Must create a username");
    elseif(empty($passw))
        returnWithError("Must create a password");
    elseif(trim($passw) === '')
        returnWithError("Password cannot be blank");
    elseif($isInDatabase)
        returnWithError("Username already in use");
    else{
        $stmt = $conn->prepare("INSERT INTO Users (`FirstName`, `LastName`, `Login`, `Password`)
                                                   VALUES (?, ?, ?, ?)");
        $stmt->execute([$fname, $lname, $login, $passw]);
        returnWithSuccess();
    }
  
    $conn = null;
    $stmt = null;

} catch(PDOException $e){
    returnWithError($e->getMessage());
}

?>