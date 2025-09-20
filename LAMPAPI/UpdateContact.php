<?php

require 'api.php';
require 'validation.php';
setCORSHeadersAndHTTPMethod();

// Changes the contact details based off of database ID
// Expected {"ID":..., "firstName":..., "lastName":..., "phone":..., "email":..., "userId":...}
// ID should be input as an INT
$input = getJsonRequest();

try{
    $conn = new PDO("mysql:host=localhost;dbname=$dbname", $dbuser, $dbpassword);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Data is expected to be checked by the frontend, so assume it's valid
    $dbId = $input['ID'];
    $fname = trim($input['firstName']);
    $lname = trim($input['lastName']);
    $phone = trim($input['phone']);
    $email = trim($input['email']);
    $userId = $input['userId'];

    $stmt = $conn->prepare("SELECT * FROM Contacts WHERE ID=?");
    $stmt->execute([$dbId]);
    $contact = $stmt->fetch(PDO::FETCH_ASSOC);

    if($contact) {
        if($fname === '')
            $fname = $contact['FirstName'];
        if($lname === '')
            $lname = $contact['LastName'];
        if($email === "")
            $email = $contact['Email'];
        if($phone === '')
            $phone = $contact['Phone'];

        $stmt = $conn->prepare("UPDATE Contacts
                    SET FirstName = ?, 
                        LastName = ?, 
                        Phone = ?, 
                        Email = ?, 
                        UserID = ?
                    WHERE ID = ?");
        $stmt->execute([$fname, $lname, $phone, $email, $userId, $dbId]);
        returnWithSuccess();
    }
    else {
        returnWithError("ID does not exist");
    }
  
    $conn = null;
    $stmt = null;

} catch(PDOException $e){
    returnWithError($e->getMessage());
}

?>