<?php

require 'api.php';
require 'validation.php';

// Deletes a Contacts entry based off of database ID
// Expected {"ID":...}
// ID should be input as an INT
$input = getJsonRequest();

try{
    $conn = new PDO("mysql:host=localhost;dbname=COP4331", "TheBeast", "WeLoveCOP4331");
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $contactId = $input['ID'];

    $stmt = $conn->prepare("SELECT * FROM Contacts WHERE ID=?");
    $stmt->execute([$contactId]);
    $contact = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($contact) {
        $stmt = $conn->prepare("DELETE FROM Contacts WHERE ID = ?");
        $stmt->execute([$contactId]);
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