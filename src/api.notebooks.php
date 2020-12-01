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
 * Delete a notebook
 */
else if(isset($_POST['function']) && $_POST['function'] == 'delete-notebook') {
  $password = $_POST['password'];
  $notebookID = $_POST['notebookID'];

  // verify user password is ok
  $user = DB::getUser($_SESSION['userID'])->fetch(PDO::FETCH_ASSOC);

  if (!DB::isValidEmailAndPassword($user['email'], $password)) {
    echo 'Invalid password';
    http_response_code(400);
    exit;
  }

  $result = DB::deleteNotebook($notebookID);

  if ($result->rowCount() == 1) {
    http_response_code(200);
  } else {
    http_response_code(400);
  }

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
 * delete-note
 * 
 * delete a note from the database
 * 
 * post - noteID
 */
else if (isset($_POST['function']) && $_POST['function'] == 'delete-note') {
  $noteID = $_POST['noteID'];
  $result = DB::deleteNote($noteID);

  if ($result->rowCount() == 1) {
    http_response_code(200);
  } else {
    http_response_code(400);
  }

  exit;
}


/**
 * delete-checklist
 * 
 * delete a checklist from the database
 * 
 * post - checklistID
 */
else if (isset($_POST['function']) && $_POST['function'] == 'delete-checklist') {
  $noteID = $_POST['checklistID'];
  $result = DB::deleteChecklist($noteID);

  if ($result->rowCount() == 1) {
    http_response_code(200);
  } else {
    http_response_code(400);
  }

  exit;
}

/**
 * update-checklist
 * 
 * Update a checklist's name and hidden
 * 
 * post - checklistID
 * post - name
 */
else if (isset($_POST['function']) && $_POST['function'] == 'update-checklist') {
  $checklistID = $_POST['checklistID'];
  $name = $_POST['name'];
  $hidden = $_POST['hidden'];

  $result = DB::updateChecklist($checklistID, $name, $hidden);

  if ($result->rowCount() == 1) {
    http_response_code(202);
  } else {
    http_response_code(400);
  }

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
 * Updates a note's  content, name
 *
 * post - noteID
 * post - content
 */
else if (isset($_POST['function']) && $_POST['function'] == 'update-note') {
  $noteID = $_POST['noteID'];
  $content = $_POST['content'];
  $name = $_POST['name'];
  $hidden = $_POST['hidden'];

  $result = DB::updateNote($noteID, $content, $name, $hidden);

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

/**
 * insert-notebook-label
 * 
 * Creates a new user notebook label
 * 
 * post - name
 * post - color
 */
else if (isset($_POST['function']) && $_POST['function'] == 'insert-notebook-label') {
  $name = $_POST['name'];
  $color = $_POST['color'];
  $userID = $_SESSION['userID'];

  $result = DB::insertNotebookLabel($userID, $name, $color);

  $response = [];
  $response['name'] = $name;
  $response['id'] = $result;

  echo json_encode($response);
  http_response_code(201);
    
  exit;
}

/**
 * get-notebook-labels
 * 
 * Get all notebooks labels belonging to a user
 * 
 */
else if (isset($_GET['function']) && $_GET['function'] == 'get-notebook-labels') {
  $userID = $_SESSION['userID'];

  $result = DB::getNotebookLabels($userID)->fetchAll(PDO::FETCH_ASSOC);
  echo json_encode($result);
  http_response_code(200);
  exit;
}

/**
 * get-notebook-label
 * 
 * Get data for a notebook label
 * 
 * get - labelID
 * 
 */
else if (isset($_GET['function']) && $_GET['function'] == 'get-notebook-label') {
  $labelID = $_GET['labelID'];
  $result = DB::getNotebookLabel($labelID)->fetch(PDO::FETCH_ASSOC);
  echo json_encode($result);
  http_response_code(200);
  exit;
}

/**
 * get-notebook-labels-assigned
 * 
 * gets all the assigned labels for a notebook
 * 
 * get - notebookID
 */
else if (isset($_GET['function']) && $_GET['function'] == 'get-notebook-labels-assigned') {
  $notebookID = $_GET['notebookID'];
  $assignedLabels = DB::getNotebookLabelsAssigned($notebookID)->fetchAll(PDO::FETCH_ASSOC);
  echo json_encode($assignedLabels);
  http_response_code(200);
  exit;
}

/**
 * insert-notebook-labels-assigned
 * 
 * assign a label to a notebook
 * 
 * post - labelID
 * post - notebookID
 */
else if (isset($_POST['function']) && $_POST['function'] == 'insert-notebook-labels-assigned') {
  $labelID = $_POST['labelID'];
  $notebookID = $_POST['notebookID'];
  $result = DB::insertNotebookLabelsAssigned($labelID, $notebookID);
  
  if ($result->rowCount() == 1) {
    http_response_code(201);
  } else {
    http_response_code(400);
  }

  exit;
}

/**
 * delete-notebook-label-assigned
 * 
 * deletes a row from  assigned notebook labels table
 * 
 * post - labelID
 * post - notebookID
 */
else if (isset($_POST['function']) && $_POST['function'] == 'delete-notebook-label-assigned') {
  $labelID = $_POST['labelID'];
  $notebookID = $_POST['notebookID'];
  $result = DB::deleteNotebookLabelsAssigned($labelID, $notebookID);
  
  if ($result->rowCount() == 1) {
    http_response_code(200);
  } else {
    http_response_code(400);
  }

  exit;
}

else if (isset($_POST['function']) && $_POST['function'] == 'update-notebook-label') {
  $labelID = $_POST['labelID'];
  $name = $_POST['name'];
  $color = $_POST['color'];

  $result = DB::updateNotebookLabel($labelID, $name, $color);

  if ($result->rowCount() <= 1) {
    http_response_code(202);
  } else {
    http_response_code(400);
  }

  exit;
}

else if (isset($_POST['function']) && $_POST['function'] == 'delete-notebook-label') {
  $labelID = $_POST['labelID'];
  $result = DB::deleteNotebookLabel($labelID);

  if ($result->rowCount() == 1) {
    http_response_code(200);
  } else {
    http_response_code(400);
  }
  exit;
}























?>