<?php

session_start();
require('DB.php');


///////////////////////////////
// create a new user account //
///////////////////////////////
if (isset($_POST['user-new-email'], $_POST['user-new-password'], $_POST['user-new-name-first'], $_POST['user-new-name-last'])) {
  $email     = $_POST['user-new-email'];
  $password  = $_POST['user-new-password'];
  $nameFirst = $_POST['user-new-name-first'];
  $nameLast  = $_POST['user-new-name-last'];

  $result = DB::insertUser($email, $password, $nameFirst, $nameLast);

  header('Location: create-account.php');
  exit;


}




































?>