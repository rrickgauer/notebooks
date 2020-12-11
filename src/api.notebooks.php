<?php

session_start();
require('DB.php');
require_once('php/classes/Constants.php');


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
else if (isset($_POST['function']) && $_POST['function'] == Constants::ApiFunctions['loginAttempt']) {
    $email     = $_POST['email'];
    $password  = $_POST['password'];
    
    if (!DB::isValidEmailAndPassword($email, $password)) {
        http_response_code(401);
        exit;
    } else {
        http_response_code(202);
        $_SESSION['userID'] = DB::getUserID($email);
        exit;
    }
    
}


///////////////////////////
// Insert a new notebook //
///////////////////////////
else if (isset($_POST['function']) && $_POST['function'] == Constants::ApiFunctions['insertNotebook']) {
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
else if(isset($_POST['function']) && $_POST['function'] == Constants::ApiFunctions['deleteNotebook']) {
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
else if (isset($_POST['function']) && $_POST['function'] == Constants::ApiFunctions['updateNotebook']) {
    $notebookID = $_POST['notebookID'];
    $name = $_POST['name'];
    $description = $_POST['description'];

    $result = DB::updateNotebook($notebookID, $name, $description);
    
    if ($result->rowCount() <= 1)
    http_response_code(204);
    else
    http_response_code(400);
    
    exit;
}


/** 
* Retrieve all notebooks for a user 
*/
else if (isset($_GET['function']) && $_GET['function'] == Constants::ApiFunctions['getNotebooks']) {
    $userID = $_SESSION['userID'];
    $notebooks = DB::getNotebooks($userID)->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($notebooks);
    exit;
}

///////////////////////
// Insert a new note //
///////////////////////
else if (isset($_POST['function']) && $_POST['function'] == Constants::ApiFunctions['insertNote']) {
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
else if (isset($_POST['function']) && $_POST['function'] == Constants::ApiFunctions['deleteNote']) {
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
else if (isset($_POST['function']) && $_POST['function'] == Constants::ApiFunctions['deleteChecklist']) {
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
else if (isset($_POST['function']) && $_POST['function'] == Constants::ApiFunctions['updateChecklist']) {
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
else if (isset($_GET['function']) && $_GET['function'] == Constants::ApiFunctions['getPages']) {
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
else if (isset($_POST['function']) && $_POST['function'] == Constants::ApiFunctions['updateNote']) {
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
else if (isset($_POST['function']) && $_POST['function'] == Constants::ApiFunctions['insertChecklist']) {
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
else if (isset($_GET['function']) && $_GET['function'] == Constants::ApiFunctions['getChecklistItems']) {

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
else if (isset($_POST['function']) && $_POST['function'] == Constants::ApiFunctions['insertChecklistItem']) {
    $checklistID = $_POST['checklistID'];
    $content = $_POST['content'];
    $checklistItemID = $_POST['id'];

    // echo json_encode($_POST);
    
    $result = DB::insertChecklistItem($checklistItemID, $checklistID, $content);
    
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
else if (isset($_POST['function']) && $_POST['function'] == Constants::ApiFunctions['updateChecklistItemCompleted']) {  
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
else if (isset($_POST['function']) && $_POST['function'] == Constants::ApiFunctions['updateChecklistItemContent']) {
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
else if (isset($_POST['function']) && $_POST['function'] == Constants::ApiFunctions['deleteChecklistItem']) {
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
else if (isset($_POST['function']) && $_POST['function'] == Constants::ApiFunctions['insertNotebookLabel']) {
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
else if (isset($_GET['function']) && $_GET['function'] == Constants::ApiFunctions['getNotebookLabels']) {
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
else if (isset($_GET['function']) && $_GET['function'] == Constants::ApiFunctions['getNotebookLabel']) {
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
else if (isset($_GET['function']) && $_GET['function'] == Constants::ApiFunctions['getNotebookLabelsAssigned']) {
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
else if (isset($_POST['function']) && $_POST['function'] == Constants::ApiFunctions['insertNotebookLabelsAssigned']) {
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
else if (isset($_POST['function']) && $_POST['function'] == Constants::ApiFunctions['deleteNotebookLabelAssigned']) {
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

/**
* update-notebook-label
* 
* Updates the metadata for a notebook label
* 
* post - labelID
* post - name
* post - color
*/
else if (isset($_POST['function']) && $_POST['function'] == Constants::ApiFunctions['updateNotebookLabel']) {
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


/**
* delete-notebook-label
* 
* remove a notebook label
* 
* post - labelID
*/
else if (isset($_POST['function']) && $_POST['function'] == Constants::ApiFunctions['deleteNotebookLabel']) {
    $labelID = $_POST['labelID'];
    $result = DB::deleteNotebookLabel($labelID);
    
    if ($result->rowCount() == 1) {
        http_response_code(200);
    } else {
        http_response_code(400);
    }
    exit;
}

/**
* get-note-comments
* 
* Get the comments that belong to a note
* 
* get - noteID
*/
else if (isset($_GET['function']) && $_GET['function'] == Constants::ApiFunctions['getCommentsNotes']) {
    $noteID = $_GET['noteID'];
    $comments = DB::getNoteComments($noteID)->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($comments);
    
    exit;
}

/**
 * insert-comment-note
 * 
 * Insert a new note comment 
 * 
 * post - id
 * post - note_id
 * post - content
 */
else if (isset($_POST['function']) && $_POST['function'] == Constants::ApiFunctions['insertCommentNote']) {
    $commentID = $_POST['id'];
    $noteID = $_POST['note_id'];
    $content = $_POST['content'];
    
    $result = DB::insertCommentNote($commentID, $noteID, $content);

    if ($result->rowCount() == 1) {
        http_response_code(201);
    } else {
        http_response_code(400);
    }

    exit;
}

/**
 * update-comment-note
 * 
 * Update a note comment 
 * 
 * post - id
 * post - content
 */
else if (isset($_POST['function']) && $_POST['function'] == Constants::ApiFunctions['updateCommentNote']) {
    $commentID = $_POST['id'];
    $content = $_POST['content'];
    $result = DB::updateCommentNote($commentID, $content);

    if ($result->rowCount() <= 1) {
        http_response_code(202);
    } else {
        http_response_code(400);
    }

    exit;
}

/**
 * delete-comment-note
 * 
 * Delete a new note comment 
 * 
 * post - id
 */
else if (isset($_POST['function']) && $_POST['function'] == Constants::ApiFunctions['deleteCommentNote']) {
    $commentID = $_POST['id'];
    $result = DB::deleteCommentNote($commentID, $content);

    if ($result->rowCount() == 1) {
        http_response_code(202);
    } else {
        http_response_code(400);
    }

    exit;
}

/**
 * get-notebook-all
 * 
 * Returns all of the notebooks data, notes, checklists, and checklist items
 */
else if (isset($_GET['function']) && $_GET['function'] == Constants::ApiFunctions['getNotebookAll']) {
    $result = [];
    $notebookID = $_GET['notebookID'];

    $notebookMeta = DB::getNotebook($notebookID)->fetch(PDO::FETCH_ASSOC);
    $result['notebook'] = $notebookMeta;

    $pages = DB::getPages($notebookID)->fetchAll(PDO::FETCH_ASSOC);

    $notes = [];
    $checklists = [];
    
    // split the pages into their own types
    for ($count = 0; $count < count($pages); $count++) {
        if ($pages[$count]['page_type'] == 'checklist') {
            array_push($checklists, $pages[$count]);
        } else {
            array_push($notes, $pages[$count]);
        }
    }

    // get each note's comments
    for ($count = 0; $count < count($notes); $count++) {
        $comments = DB::getNoteComments($notes[$count]['id'])->fetchAll(PDO::FETCH_ASSOC);
        $notes[$count]['comments'] = $comments;
    }


    $result['notes'] = $notes;

    // get each checklist's items
    for ($count = 0; $count < count($checklists); $count++) {
        $items = DB::getChecklistItems($checklists[$count]['id'])->fetchAll(PDO::FETCH_ASSOC);
        $checklists[$count]['items'] = $items;
    }

    $result['checklists'] = $checklists;

    echo json_encode($result);
}



else if (isset($_POST['function']) && $_POST['function'] == Constants::ApiFunctions['updateChecklistItemsAllComplete']) {
    $checklistID = $_POST['checklistID'];
    $completed = $_POST['completed'];

    $result = DB::updateChecklistItemsAllCompleted($checklistID, $completed);

    if ($result->rowCount() >= 0) {
        http_response_code(202);
    } else {
        http_response_code(404);
    }

    exit;
}


else if (isset($_POST['function']) && $_POST['function'] == Constants::ApiFunctions['deleteChecklistItemsComplete']) {
    $checklistID = $_POST['checklistID'];
    $result = DB::deleteChecklistItemsComplete($checklistID);

    if ($result->rowCount() >= 0) {
        http_response_code(202);
    } else {
        http_response_code(404);
    }

    exit;
}

























?>