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

  $_SESSION['userID'] = DB::getUserID($email);

  header('Location: home.php');
  exit;
}



////////////////////////
// User login attempt //
////////////////////////
else if (isset($_POST['user-login-email'], $_POST['user-login-password'])) {
  $email     = $_POST['user-login-email'];
  $password  = $_POST['user-login-password'];

  // $result = DB::insertUser($email, $password, $nameFirst, $nameLast);

  if (!DB::isValidEmailAndPassword($email, $password)) {
    $_SESSION['error'] = true;
    $_SESSION['error-message'] = 'Invalid email password combo';
    header('Location: login.php');
    exit;
  }
  
  $_SESSION['userID'] = DB::getUserID($email);

  header('Location: home.php');
  exit;
}


///////////////////////////
// Insert a new notebook //
///////////////////////////
else if (isset($_POST['function']) && $_POST['function'] == 'insert-notebook') {
  $userID = $_SESSION['userID'];
  $name = $_POST['name'];

  $result = DB::insertNotebook($userID, $name);

  // get the id of the notebook
  $notebook = DB::getMostRecentNotebook($userID)->fetch(PDO::FETCH_ASSOC);

  echo json_encode($notebook);
  exit;
}


else if (isset($_GET['function']) && $_GET['function'] == 'get-notebooks') {
  $userID = $_SESSION['userID'];

  // echo $userID;

  $notebooks = DB::getNotebooks($userID)->fetchAll(PDO::FETCH_ASSOC);
  echo json_encode($notebooks);
  // echo $notebooks;
  exit;

}






























?>