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
  $description = $_POST['description'];

  $result = DB::insertNotebook($userID, $name, $description);

  // get the id of the notebook
  $notebook = DB::getMostRecentNotebook($userID)->fetch(PDO::FETCH_ASSOC);

  echo json_encode($notebook);
  exit;
}

/**
 * Update a notebook name and description
 */

 else if (isset($_POST['function']) && $_POST['function'] == 'update-notebook') {
   $notebookID = $_POST['notebookID'];
   $name = $_POST['name'];
   $description = $_POST['description'];

   $result = DB::updateNotebook($notebookID, $name, $description);

   if ($result->rowCount() == 1)
      http_response_code(204);
  else
    http_response_code(400);

   exit;
 }


/** 
 * Retrieve all notebooks for a user 
 */
else if (isset($_GET['function']) && $_GET['function'] == 'get-notebooks') {
  $userID = $_SESSION['userID'];
  $notebooks = DB::getNotebooks($userID)->fetchAll(PDO::FETCH_ASSOC);
  echo json_encode($notebooks);
  exit;
}

///////////////////////
// Insert a new note //
///////////////////////
else if (isset($_POST['function']) && $_POST['function'] == 'insert-note') {
  $notebookID  = $_POST['notebookID'];
  $name        = $_POST['name'];

  $result = DB::insertNote($notebookID, $name);

  if ($result->rowCount() == 1)
    http_response_code(201);
  else
    http_response_code(400);

  exit;
}


/**
 * get-pages
 * 
 * Return all the pages that belong to a specific notebook
 *
 * get -> notebookID
 */
else if (isset($_GET['function']) && $_GET['function'] == 'get-pages') {
  $notebookID = $_GET['notebookID'];
  $pages = DB::getPages($notebookID)->fetchAll(PDO::FETCH_ASSOC);
  echo json_encode($pages);
  http_response_code(200);
  exit;
}

/**
 * update-note
 *
 * Updates a note's content
 *
 * post - noteID
 * post - content
 */
else if (isset($_POST['function']) && $_POST['function'] == 'update-note') {
  $noteID = $_POST['noteID'];
  $content = $_POST['content'];

  $result = DB::updateNote($noteID, $content);

  if ($result->rowCount() != 1) {
    http_response_code(400);
  } else {
    http_response_code(202);
  }

  exit;
}

/**
 * insert-checklist
 *
 * Insert a new checklist into the database
 *
 * post - notebookID
 * post - name
 */
else if (isset($_POST['function']) && $_POST['function'] == 'insert-checklist') {
  $notebookID  = $_POST['notebookID'];
  $name        = $_POST['name'];

  $result = DB::insertChecklist($notebookID, $name);

  if ($result->rowCount() == 1)
    http_response_code(201);
  else
    http_response_code(400);

  exit;
}

/**
 * get-checklist-items
 *
 * return all items of a checklist
 *
 * get - checklistID
 */
else if (isset($_GET['function']) && $_GET['function'] == 'get-checklist-items') {
  $checklistID = $_GET['checklistID'];
  $checklistItems = DB::getChecklistItems($checklistID)->fetchAll(PDO::FETCH_ASSOC);
  echo json_encode($checklistItems);
  http_response_code(200);
  exit;
}

/**
 * insert-checklist-item
 * 
 * Insert a new checklist item
 * 
 * post - checklistID
 * post - content
 */
else if (isset($_POST['function']) && $_POST['function'] == 'insert-checklist-item') {
  $checklistID = $_POST['checklistID'];
  $content = $_POST['content'];

  $result = DB::insertChecklistItem($checklistID, $content);

  if ($result->rowCount() == 1) {
    http_response_code(201);
  } else {
    http_response_code(400);
  }

  exit;
}

/**
 * update-checklist-item-completed
 * 
 * Update the completed status of a checklist item
 * 
 * post - checklistItemID
 * post - completed ('y', 'n')
 */
else if (isset($_POST['function']) && $_POST['function'] == 'update-checklist-item-completed') {  
  $checklistItemID = $_POST['checklistItemID'];
  $completed = $_POST['completed'];

  $result = DB::updateChecklistItemCompleted($checklistItemID, $completed);

  if ($result->rowCount() == 1) {
    http_response_code(204);
  } else {
    http_response_code(400);
  }

  exit;
}

/**
 * update-checklist-item-content
 * 
 * Updates the checklist item content
 * 
 * post - checklistItemID
 * post - content
 */
else if (isset($_POST['function']) && $_POST['function'] == 'update-checklist-item-content') {
  $checklistItemID = $_POST['checklistItemID'];
  $content = $_POST['content'];
  $result = DB::updateChecklistItemContent($checklistItemID, $content);

  if ($result->rowCount() == 1) {
    http_response_code(204);
  } else {
    http_response_code(400);
  }

  exit;
}

/**
 * delete-checklist-item
 * 
 * Deletes a checklist item
 * 
 * post - checklistItemID
 */
else if (isset($_POST['function']) && $_POST['function'] == 'delete-checklist-item') {
  $checklistItemID = $_POST['checklistItemID'];
  $result = DB::deleteChecklistItem($checklistItemID);

  if ($result->rowCount() == 1) {
    http_response_code(204);
  } else {
    http_response_code(400);
  }
  
  exit;
}























?>