<?php 

require 'api.php';

// Expecting {"login":...,"password":...}
$input = getJsonRequest();

try{
    $conn = new PDO("mysql:host=localhost;dbname=COP4331", "TheBeast", "WeLoveCOP4331");
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $stmt = $conn->prepare("SELECT `ID`, `FirstName`, `LastName` FROM Users WHERE `Login`=? AND `Password`=?");
    
    $login = $input['login'];
    $passw = $input['password'];
    $stmt->bindValue(1, $login);
    $stmt->bindValue(2, $passw);

    $stmt->execute();
    if($result = $stmt->fetch(PDO::FETCH_ASSOC)){ 
        returnWithLoginResult($result['ID'], $result['FirstName'], $result['LastName']);
    }
    else{
        returnWithError("Incorrect Login or Password");
    }

    $conn = null;
    $stmt = null;

} catch(PDOException $e){
    returnWithError($e->getMessage());
}

?>