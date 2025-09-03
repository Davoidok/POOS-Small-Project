<?php

require 'api.php';

// Expected {"firstName":..., "lastName":..., "phone":..., "email":...}
// userId should be stored once the user is logged in 
// userId should also be sent as an INT
$input = getJsonRequest();

try{
    $conn = new PDO("mysql:host=localhost;dbname=COP4331", "TheBeast", "WeLoveCOP4331");
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $fname = trim($input['firstName']);
    $lname = trim($input['lastName']);
    $phone = trim($input['phone']);
    $email = trim($input['email']);
    $userId = $input['userId'];

    if(empty($fname) || empty($lname))
        returnWithError("First and last names cannot be blank");
    elseif(!is_numeric($phone) || str_contains($phone, '.'))
        returnWithError("Invalid phone number");
    elseif(!validEmail($email))
        returnWithError("Invalid email");
    elseif(!validPhoneNumber($phone))
        returnWithError("Invalid phone number");
    else{
        $stmt = $conn->prepare("INSERT INTO Contacts 
                                                (FirstName, LastName, Phone, Email, UserID)
                                                VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$fname, $lname, $phone, $email, $userId]);
        returnWithSuccess();
    }
  
    $conn = null;
    $stmt = null;

} catch(PDOException $e){
    returnWithError($e->getMessage());
}


/**
 * Verifies if an email is valid given the following constraints
 * 1. Local part must be alphanumeric with non-sequential periods
 * 2. Local part cannot start or end with a period
 * 3. Must contain a single '@'
 * 4. Domain must be alphanumeric and can contain dashes and non-sequential periods
 * 5. Domain must end with at least two letters
 * @param mixed $email Email to be validated
 * @return bool Returns true if the email is valid 
 */
function validEmail($email){
    return preg_match("/^(([\w]+\.)+|[\w]+)+[\w]@([\w\-]+\.)+[A-z]{2,}$/", $email) === 1 ? true : false;
}

/**
 * Verifies if a phone numbers follows one of the two formats:
 * 1. 10 sequential numbers (e.g. 1002003000)
 * 2. Area code, exchange code, and subscriber number separated by dashes (e.g. 100-200-3000)
 * @param mixed $phone Phone number to be validated
 * @return bool Returns true if the phone number is valid
 */
function validPhoneNumber($phone){
    return preg_match("/(^[\d]{10}$)|(^[\d]{3}\-[\d]{3}\-[\d]{4})$/", $phone) === 1 ? true : false;
}

?>