<?php

require 'api.php';
require 'validation.php';
setCORSHeadersAndHTTPMethod();

// Expected {"firstName":..., "lastName":..., "phone":..., "email":..., "userId":...}
// userId should be stored once the user is logged in 
// userId should also be sent as an INT
$input = getJsonRequest();

try{
    $conn = new PDO("mysql:host=localhost;dbname=$dbname", $dbuser, $dbpassword);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Details are expected to be checked by the frontend already
    $fname = trim($input['firstName']);
    $lname = trim($input['lastName']);
    $phone = trim($input['phone']);
    $email = trim($input['email']);
    $userId = $input['userId'];

    $stmt = $conn->prepare("INSERT INTO Contacts 
                                            (FirstName, LastName, Phone, Email, UserID)
                                            VALUES (?, ?, ?, ?, ?)");
    $stmt->execute([$fname, $lname, $phone, $email, $userId]);
    returnWithId($conn->lastInsertId());
  
    $conn = null;
    $stmt = null;

} catch(PDOException $e){
    returnWithError($e->getMessage());
}

?>