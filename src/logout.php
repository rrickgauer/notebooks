<?php
//////////////////////////////////////////////////
// This file clears all session and cookie data //
//                                              //
// then sends user to login page                //
//////////////////////////////////////////////////


// clear cookie
setcookie('userID', '', time() - 3600, "/");

// clear session data
session_start();
session_destroy();
$_SESSION = array();

header('Location: login.php');
exit;
?>