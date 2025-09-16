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
        $error = False;
        if($fname === '')
            $fname = $contact['FirstName'];
        if($lname === '')
            $lname = $contact['LastName'];

        if($email === "")
            $email = $contact['Email'];
        elseif(!validEmail($email)){
            returnWithError("Invalid email");
            $error = True;
        }

        if(!$error && $phone === '')
            $phone = $contact['Phone'];
        elseif(!$error && !validPhoneNumber($phone)){
            returnWithError("Invalid phone number");
            $error = True;
        }

        if(!$error){
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