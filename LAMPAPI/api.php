<?php
/**
 * Contains functions that handles requests from and responses to the client
 * Not part of the API endpoints. Just auxiliary to help with the other endpoints.
 */

$dbname = "COP4331";
$dbuser = "TheBeast";
$dbpassword = "WeLoveCOP4331";

/**
 * Handles CORS headers (for local development) and checks that method is POST
 * Also ensures that responses have Content-type: application/json
 * @return void
 */
function setCORSHeadersAndHTTPMethod(){
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    header('Content-type: application/json');

    if($_SERVER['REQUEST_METHOD'] === 'OPTIONS'){
        http_response_code(200);
        exit();
    }

    if($_SERVER['REQUEST_METHOD'] !== 'POST'){
        http_response_code(405);
        returnWithError("Method ". $_SERVER['REQUEST_METHOD'] ." not allowed");
        exit();
    }
}

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
 * Responds in JSON with success, empty error, and the database ID of the new contact
 * @param mixed $id The database ID of the newly inserted contact entry
 * @return void
 */
function returnWithId($id) {
    $json = ['success'=>true, 'ID'=>$id, 'error'=>""];
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