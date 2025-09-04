<?php 
/* Contains functions for validating various fields input by the user. 
 */

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
    return preg_match("/^(([\w]+\.)+|[\w]+)+[\w]@([\w\-]+\.)+[A-z]{2,}$/", $email);
}

/**
 * Verifies that a user inputted phone number is 10 digits (e.g 1002003000)
 * @param mixed $phone Phone number to be validated
 * @return bool Returns true if the phone number is valid
 */
function validPhoneNumber($phone){
    return ctype_digit($phone) && strlen($phone) === 10;
}

?>