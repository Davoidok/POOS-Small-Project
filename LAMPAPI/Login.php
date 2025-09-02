<?php 
/*  Get JSON from client (username and password). Put into assoc ['login'=>..., 'password'=>...]
    Check that username and password are both in a row in DB
        If so, return with JSON of {success, id, firstName, lastName, and empty error}
        If not, return with JSON of {failure, id=0, names empty, and error message}        
 */

require 'api.php';

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
        returnWithResult($result['ID'], $result['FirstName'], $result['LastName']);
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