<?php
/**
 * Contains functions for accepting and returning JSON
 * Not part of the API endpoints. Just auxiliary to help with the other endpoints.
 */

/**
 * @return array Incoming JSON request as an associative array.
 */
function getJsonRequest(){
    return json_decode(file_get_contents('php://input'), true);
}

/**
 * Sends JSON directly in response body via HTTP
 * @param string $json The JSON response pre-formatted into a string
 * @return void
 */
function sendJsonResult(string $json){
    header('Content-type: application/json');
    echo $json;
}

/**
 * Responds in JSON with success = false and error message
 * @param string $error The error message to be sent to the client
 * @return void
 */
function returnWithError(string $error){
    $json = ['success'=>false, 'error'=>$error];
    sendJsonResult(json_encode($json));
}

/**
 * Responds in JSON with success and empty error message
 * @return void
 */
function returnWithSuccess(){
    $json = ['success'=>true, 'error'=>""];
    sendJsonResult(json_encode($json));
}

/**
 * Parse the id and first and last names into JSON and send it as response
 * @param int $id The unique ID belonging to the user in the database
 * @param string $firstName First name of user found in the database
 * @param string $lastName Last name of user found in the database
 * @return void
 */
function returnWithLoginResult(int $id, string $firstName, string $lastName){
    $json = ['success'=>true, 'id'=>$id, 'firstName'=>$firstName, 'lastName'=>$lastName, 'error'=>""];
    sendJsonResult(json_encode($json));
}

?>