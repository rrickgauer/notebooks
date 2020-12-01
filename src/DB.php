<?php



class DB {
  public static function dbConnect() {
    include('php/db-info.php');

    try {
      // connect to database
      $pdo = new PDO("mysql:host=$host;dbname=$dbName",$user,$password);
      $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

      return $pdo;

    } catch(PDOexception $e) {
        echo $e;
        return 0;
    }
  }

  ///////////////////////////////////
  // Insert user into the database //
  ///////////////////////////////////
  public static function insertUser($email, $password, $nameFirst, $nameLast) {
    $stmt = 'INSERT INTO Users 
    (email, password, name_first, name_last, date_created) 
    VALUES (:email, :password, :nameFirst, :nameLast, NOW())';

    $sql = DB::dbConnect()->prepare($stmt);

    // sanitize and bind email
    $email = filter_var($email, FILTER_SANITIZE_EMAIL);
    $sql->bindParam(':email', $email, PDO::PARAM_STR);

    // sanitize, hash, and bind password
    $password = filter_var($password, FILTER_SANITIZE_STRING);
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
    $sql->bindParam(':password', $hashedPassword, PDO::PARAM_STR);


    // sanitize and bind first name
    $nameFirst = filter_var($nameFirst, FILTER_SANITIZE_STRING);
    $sql->bindParam(':nameFirst', $nameFirst, PDO::PARAM_STR);


    // sanitize and bind last name
    $nameLast = filter_var($nameLast, FILTER_SANITIZE_STRING);
    $sql->bindParam(':nameLast', $nameLast, PDO::PARAM_STR);

    $sql->execute();

    echo $stmt;

    return $sql;
  }

  /**
   * Get user info from db
   */
  public static function getUser($userID) {
    $stmt = 'SELECT u.id as id,
    u.name_first as name_first,
    u.name_last as name_last,
    u.email as email,
    u.date_created as date_created,
    DATE_FORMAT(u.date_created, "%c/%d/%Y") as date_created_display,
    (SELECT count(n.id) FROM Notebooks n WHERE n.user_id= u.id) AS count_notebooks
    FROM Users u
    WHERE u.id = :userID
    LIMIT 1';

    $sql = DB::dbConnect()->prepare($stmt);

    // sanitize and bind id
    $userID = filter_var($userID, FILTER_SANITIZE_NUMBER_INT);
    $sql->bindParam(':userID', $userID, PDO::PARAM_INT);

    $sql->execute();

    return $sql;
  }


  /////////////////////////////////////////////////////////////
  // Returns the user id by looking for the email associated //
  /////////////////////////////////////////////////////////////
  public static function getUserID($email) {
    $stmt = 'SELECT id FROM Users where email = :email LIMIT 1';
    $sql = DB::dbConnect()->prepare($stmt);

    // sanitize and bind email
    $email = filter_var($email, FILTER_SANITIZE_STRING);
    $sql->bindParam(':email', $email, PDO::PARAM_STR);

    $sql->execute();

    $results = $sql->fetch(PDO::FETCH_ASSOC);
    return $results['id'];
  }

  ///////////////////////////////////////////////////////////
  // Verifies that the user email and password combo match //
  ///////////////////////////////////////////////////////////
  public static function isValidEmailAndPassword($email, $password) {
    $stmt = '
    SELECT password
    FROM   Users
    WHERE  email = :email
    LIMIT  1';

    $sql = DB::dbConnect()->prepare($stmt);

    // sanitize and bind username
    $email = filter_var($email, FILTER_SANITIZE_EMAIL);
    $sql->bindParam(':email', $email, PDO::PARAM_STR);
    
    $sql->execute();

    // check if password matches the hashed password stored in the db
    $hash = $sql->fetch(PDO::FETCH_ASSOC);
    $hash = $hash['password'];
    return password_verify($password, $hash);
  }


  ///////////////////////////
  // Create a new notebook //
  ///////////////////////////
  public static function insertNotebook($userID, $name, $description = null) {
    $stmt = 'INSERT INTO Notebooks (user_id, name, description, date_created) VALUES (:userID, :name, :description, NOW())';

    $sql = DB::dbConnect()->prepare($stmt);

    // sanitize and bind id
    $userID = filter_var($userID, FILTER_SANITIZE_NUMBER_INT);
    $sql->bindParam(':userID', $userID, PDO::PARAM_INT);

    // sanitize and bind notebook name
    $name = filter_var($name, FILTER_SANITIZE_STRING);
    $sql->bindParam(':name', $name, PDO::PARAM_STR);

    // description
    $description = filter_var($description, FILTER_SANITIZE_STRING);
    if ($description == '') {
      $description = null;
    }
    
    $sql->bindParam(':description', $description, PDO::PARAM_STR);
    
    $sql->execute();
    return $sql;
  }


  public static function updateNotebook($notebookID, $name, $description) {
    $stmt = 'UPDATE Notebooks
    SET name = :name,
    description = :description
    WHERE id = :notebookID';

    $sql = DB::dbConnect()->prepare($stmt);

    // sanitize and bind id
    $notebookID = filter_var($notebookID, FILTER_SANITIZE_NUMBER_INT);
    $sql->bindParam(':notebookID', $notebookID, PDO::PARAM_INT);

    // sanitize and bind notebook name
    $name = filter_var($name, FILTER_SANITIZE_STRING);
    $sql->bindParam(':name', $name, PDO::PARAM_STR);

    // description
    $description = filter_var($description, FILTER_SANITIZE_STRING);
    if ($description == '') {
      $description = null;
    }
    
    $sql->bindParam(':description', $description, PDO::PARAM_STR);
    
    $sql->execute();
    return $sql;

  }

  /**
   * Delete a notebook from the database
   */
  public static function deleteNotebook($notebookID) {
    $stmt = 'DELETE FROM Notebooks where id = :notebookID';
    $sql = DB::dbConnect()->prepare($stmt);

    // sanitize and bind id
    $notebookID = filter_var($notebookID, FILTER_SANITIZE_NUMBER_INT);
    $sql->bindParam(':notebookID', $notebookID, PDO::PARAM_INT);

    $sql->execute();
    return $sql;
  }

  //////////////////////////////////////////////////////
  // Get the most recently created notebook           //
  //////////////////////////////////////////////////////
  public static function getMostRecentNotebook($userID) {
    $stmt = '
    SELECT id, name, date_created FROM Notebooks 
    WHERE user_id = :userID 
    ORDER BY date_created desc LIMIT 1';

    $sql = DB::dbConnect()->prepare($stmt);

    // sanitize and bind id
    $userID = filter_var($userID, FILTER_SANITIZE_NUMBER_INT);
    $sql->bindParam(':userID', $userID, PDO::PARAM_INT);

    $sql->execute();

    return $sql;
  }

  ////////////////////////////
  // Get notebook meta data //
  ////////////////////////////
  public static function getNotebook($notebookID) {
    // $stmt = 'SELECT * FROM Notebooks where id = :notebookID LIMIT 1';

    $stmt = 'SELECT 
    n.id AS id, 
    n.name AS name, 
    n.description AS description,
    n.date_created AS date_created,
    DATE_FORMAT(n.date_created, "%c/%d/%Y") AS date_created_display,
    (SELECT COUNT(n2.id) FROM Notes n2 WHERE n2.notebook_id = n.id) AS count_notes,
    (SELECT COUNT(c.id) FROM Checklists c WHERE c.notebook_id = n.id) AS count_checklists,
    (SELECT count_notes + count_checklists) AS count_pages,
    (SELECT COUNT(*) FROM Notebook_Labels_Assigned nbl WHERE nbl.notebook_id = n.id) as count_labels
    FROM Notebooks n 
    WHERE id = :notebookID 
    LIMIT 1';

    $sql = DB::dbConnect()->prepare($stmt);

    // sanitize and bind id
    $notebookID = filter_var($notebookID, FILTER_SANITIZE_NUMBER_INT);
    $sql->bindParam(':notebookID', $notebookID, PDO::PARAM_INT);

    $sql->execute();

    return $sql;
  }

  ////////////////////////
  // Get user notebooks //
  ////////////////////////
  public static function getNotebooks($userID) {
    $stmt = 'SELECT n.id, 
    n.name, 
    n.description as description,
    n.date_created,
    DATE_FORMAT(n.date_created, "%c/%d/%Y") as date_created_display,
    (SELECT COUNT(n2.id) FROM Notes n2 WHERE n2.notebook_id = n.id) AS count_notes,
    (SELECT COUNT(c.id) FROM Checklists c WHERE c.notebook_id = n.id) AS count_checklists,
    (SELECT count_notes + count_checklists) AS count_pages,
    (SELECT COUNT(*) FROM Notebook_Labels_Assigned nbl WHERE nbl.notebook_id = n.id) as count_labels
    FROM Notebooks n 
    where n.user_id = :userID';

    $sql = DB::dbConnect()->prepare($stmt);

    // sanitize and bind id
    $userID = filter_var($userID, FILTER_SANITIZE_NUMBER_INT);
    $sql->bindParam(':userID', $userID, PDO::PARAM_INT);

    $sql->execute();

    return $sql;
  }




  ///////////////////////////////////////
  // Insert a new note into a notebook //
  ///////////////////////////////////////
  public static function insertNote(int $notebookID, string $name) {
    $stmt = 'INSERT INTO Notes (notebook_id, name, date_created, date_modified)
    VALUES (:notebookID, :name, NOW(), NOW())';

    $sql = DB::dbConnect()->prepare($stmt);

    // notebook id
    $notebookID = filter_var($notebookID, FILTER_SANITIZE_NUMBER_INT);
    $sql->bindParam(':notebookID', $notebookID, PDO::PARAM_INT);

    // name
    $name = filter_var($name, FILTER_SANITIZE_STRING);
    $sql->bindParam(':name', $name, PDO::PARAM_STR);

    $sql->execute();

    return $sql;
  }

  /**
   * Delete a note
   */
  public static function deleteNote($noteID) {
    $stmt = 'DELETE FROM Notes WHERE id = :noteID';
    $sql = DB::dbConnect()->prepare($stmt);

    // notebook id
    $noteID = filter_var($noteID, FILTER_SANITIZE_NUMBER_INT);
    $sql->bindParam(':noteID', $noteID, PDO::PARAM_INT);

    $sql->execute();
    return $sql;
  }


  //////////////////////////////////////////////
  // Return the pages belonging to a notebook //
  //////////////////////////////////////////////
  public static function getPages($notebookID) {
    $stmt = '
    SELECT n.id as id, 
    n.notebook_id as notebook_id, 
    n.name as name, 
    n.content as content, 
    n.hidden as hidden, 
    n.date_created as date_created,
    n.date_modified as date_modified,
    DATE_FORMAT(n.date_created, "%c/%d/%Y") as date_created_display,
    DATE_FORMAT(n.date_modified, "%c/%d/%Y") as date_modified_display,
    "note" as page_type
    FROM Notes n
    WHERE n.notebook_id = :notebookIDNotes

    UNION ALL
        
    SELECT 
    c.id,
    c.notebook_id,
    c.name,
    null,
    c.hidden,
    c.date_created,
    null,
    DATE_FORMAT(c.date_created, "%c/%d/%Y"),
    null,
    "checklist"
    from Checklists c 
    WHERE c.notebook_id = :notebookIDChecklist

    ORDER BY date_created desc';

    $sql = DB::dbConnect()->prepare($stmt);

    // notebook id notes
    $notebookID = filter_var($notebookID, FILTER_SANITIZE_NUMBER_INT);
    $sql->bindParam(':notebookIDNotes', $notebookID, PDO::PARAM_INT);

    // notebook id checklists
    $notebookID = filter_var($notebookID, FILTER_SANITIZE_NUMBER_INT);
    $sql->bindParam(':notebookIDChecklist', $notebookID, PDO::PARAM_INT);

    $sql->execute();

    return $sql;

  }

  /////////////////////////////
  // Update a note's content, name, hidden //
  /////////////////////////////
  public static function updateNote($noteID, $content, $name, $hidden = 'n') {
    $stmt = 'UPDATE Notes 
    SET content = :content, 
    date_modified = NOW(),
    name = :name,
    hidden = :hidden
    WHERE id = :noteID';

    $sql = DB::dbConnect()->prepare($stmt);

    // note id
    $noteID = filter_var($noteID, FILTER_SANITIZE_NUMBER_INT);
    $sql->bindParam(':noteID', $noteID, PDO::PARAM_INT);

    // content
    $content = filter_var($content, FILTER_SANITIZE_STRING);
    $sql->bindParam(':content', $content, PDO::PARAM_STR);

    // name
    $name = filter_var($name, FILTER_SANITIZE_STRING);
    $sql->bindParam(':name', $name, PDO::PARAM_STR);

     // hidden
    if ($hidden != 'n') {
      $hidden = 'y';
    }

    $hidden = filter_var($hidden, FILTER_SANITIZE_STRING);
    $sql->bindParam(':hidden', $hidden, PDO::PARAM_STR);

    $sql->execute();

    return $sql;
  }


  //////////////////////////////////////////////
  // Insert a new checklist into the database //
  //////////////////////////////////////////////
  public static function insertChecklist($notebookID, $name) {
    $stmt = 'INSERT INTO Checklists (notebook_id, name, date_created)
    VALUES (:notebookID, :name, NOW())';

    $sql = DB::dbConnect()->prepare($stmt);

    // notebook id
    $notebookID = filter_var($notebookID, FILTER_SANITIZE_NUMBER_INT);
    $sql->bindParam(':notebookID', $notebookID, PDO::PARAM_INT);

    // name
    $name = filter_var($name, FILTER_SANITIZE_STRING);
    $sql->bindParam(':name', $name, PDO::PARAM_STR);

    $sql->execute();

    return $sql;
  }

  /**
   * Delete a checklist
   */
  public static function deleteChecklist($checklistID) {
    $stmt = 'DELETE FROM Checklists WHERE id = :checklistID';
    $sql = DB::dbConnect()->prepare($stmt);

    // notebook id
    $checklistID = filter_var($checklistID, FILTER_SANITIZE_NUMBER_INT);
    $sql->bindParam(':checklistID', $checklistID, PDO::PARAM_INT);

    $sql->execute();
    return $sql;
  }

  /**
   * Update a checklist name and hidden
   */
  public static function updateChecklist($checklistID, $name, $hidden = 'n') {
    $stmt = 'UPDATE Checklists 
    SET name = :name,
    hidden = :hidden 
    WHERE id = :checklistID';

    $sql = DB::dbConnect()->prepare($stmt);

    // name
    $name = filter_var($name, FILTER_SANITIZE_STRING);
    $sql->bindParam(':name', $name, PDO::PARAM_STR);

    // hidden
    if ($hidden != 'n') {
      $hidden = 'y';
    }

    $hidden = filter_var($hidden, FILTER_SANITIZE_STRING);
    $sql->bindParam(':hidden', $hidden, PDO::PARAM_STR);


    // checklist id
    $checklistID = filter_var($checklistID, FILTER_SANITIZE_NUMBER_INT);
    $sql->bindParam(':checklistID', $checklistID, PDO::PARAM_INT);

    $sql->execute();

    return $sql;
  }

  /////////////////////////////////////////////
  // Get all checklist items for a checklist //
  /////////////////////////////////////////////
  public static function getChecklistItems($checklistID) {
    $stmt = '
    SELECT 
    c.id as id,
    c.checklist_id as checklist_id,
    c.content as content,
    c.completed as completed,
    c.date_created as date_created,
    c.date_modified as date_modified
    from Checklist_Items c 
    where c.checklist_id = :checklistID 
    order by date_created asc';

    $sql = DB::dbConnect()->prepare($stmt);

    // checklist id
    $checklistID = filter_var($checklistID, FILTER_SANITIZE_NUMBER_INT);
    $sql->bindParam(':checklistID', $checklistID, PDO::PARAM_INT);

    $sql->execute();

    return $sql;
  }


  /////////////////////////////////
  // Insert a new checklist item //
  /////////////////////////////////
  public static function insertChecklistItem($checklistID, $content) {

    $stmt = '
    INSERT INTO Checklist_Items (checklist_id, content, date_created, date_modified) 
    VALUES (:checklistID, :content, NOW(), NOW())';

    $sql = DB::dbConnect()->prepare($stmt);

    // checklist id
    $checklistID = filter_var($checklistID, FILTER_SANITIZE_NUMBER_INT);
    $sql->bindParam(':checklistID', $checklistID, PDO::PARAM_INT);

    // content
    $content = filter_var($content, FILTER_SANITIZE_STRING);
    $sql->bindParam(':content', $content, PDO::PARAM_STR);

    $sql->execute();
    return $sql;
  }

  /**
   * Update a checklist item's completed status
   */
  public static function updateChecklistItemCompleted($checklistItemID, $completed = 'y') {
    $stmt = '
    UPDATE Checklist_Items SET completed = :completed, date_modified = NOW()
    WHERE id = :checklistItemID';

    $sql = DB::dbConnect()->prepare($stmt);

    // checklist item id
    $checklistItemID = filter_var($checklistItemID, FILTER_SANITIZE_NUMBER_INT);
    $sql->bindParam(':checklistItemID', $checklistItemID, PDO::PARAM_INT);

    // completed
    if ($completed != 'y') {
      $completed = 'n';
    }

    $completed = filter_var($completed, FILTER_SANITIZE_STRING);
    $sql->bindParam(':completed', $completed, PDO::PARAM_STR);

    $sql->execute();
    return $sql;
  }


  /**
   * Update a checklist item's content
   */
  public static function updateChecklistItemContent($checklistItemID, $content) {
    $stmt = '
    UPDATE Checklist_Items SET content = :content, date_modified = NOW()
    WHERE id = :checklistItemID';

    $sql = DB::dbConnect()->prepare($stmt);

    // checklist item id
    $checklistItemID = filter_var($checklistItemID, FILTER_SANITIZE_NUMBER_INT);
    $sql->bindParam(':checklistItemID', $checklistItemID, PDO::PARAM_INT);

    // content
    $content = filter_var($content, FILTER_SANITIZE_STRING);
    $sql->bindParam(':content', $content, PDO::PARAM_STR);

    $sql->execute();
    return $sql;
  }

  /**
   * Update a checklist item's content
   */
  public static function deleteChecklistItem($checklistItemID) {
    $stmt = '
    DELETE FROM Checklist_Items WHERE id = :checklistItemID';

    $sql = DB::dbConnect()->prepare($stmt);

    // checklist item id
    $checklistItemID = filter_var($checklistItemID, FILTER_SANITIZE_NUMBER_INT);
    $sql->bindParam(':checklistItemID', $checklistItemID, PDO::PARAM_INT);

    $sql->execute();
    return $sql;
  }

  /**
   * Inserts a new notebook label into the database
   */
  public static function insertNotebookLabel($userID, $name, $color) {
    $stmt = 'INSERT INTO Notebook_Labels 
    (user_id, name, color) 
    VALUES (:userID, :name, :color)';

    $pdo = DB::dbConnect();
    $sql = $pdo->prepare($stmt);

    // user id
    $userID = filter_var($userID, FILTER_SANITIZE_NUMBER_INT);
    $sql->bindParam(':userID', $userID, PDO::PARAM_INT);

    // name
    $name = filter_var($name, FILTER_SANITIZE_STRING);
    $sql->bindParam(':name', $name, PDO::PARAM_STR);

    // color
    $color = filter_var($color, FILTER_SANITIZE_STRING);
    $sql->bindParam(':color', $color, PDO::PARAM_STR);

    $sql->execute();

    return $pdo->lastInsertId();
  }

  /**
   * Get all the user made labels
   */
  public static function getNotebookLabels($userID) {
    $stmt = 'SELECT 
    nl.id as id,
    nl.name as name,
    nl.color as color
    FROM Notebook_Labels nl
    WHERE nl.user_id = :userID
    ORDER BY name ASC';

    $sql = DB::dbConnect()->prepare($stmt);

    // user id
    $userID = filter_var($userID, FILTER_SANITIZE_NUMBER_INT);
    $sql->bindParam(':userID', $userID, PDO::PARAM_INT);

    $sql->execute();
    return $sql;
  }

  /**
   * Return the data for 1 notebook label
   */
  public static function getNotebookLabel($labelID) {
    $stmt = 'SELECT 
    nl.id as id,
    nl.name as name,
    nl.color as color
    FROM Notebook_Labels nl
    WHERE nl.id = :labelID
    LIMIT 1';

    $sql = DB::dbConnect()->prepare($stmt);

    // label id
    $labelID = filter_var($labelID, FILTER_SANITIZE_NUMBER_INT);
    $sql->bindParam(':labelID', $labelID, PDO::PARAM_INT);

    $sql->execute();
    return $sql;
  }





  /**
   * Retrieve all the assigned labels beloning to a notebook
   */
  public static function getNotebookLabelsAssigned($notebookID) {
    $stmt = 'SELECT 
    label.id as id,
    label.name as name,
    label.color as color,
    assigned.date_assigned as date_assigned
    from Notebook_Labels_Assigned assigned 
    left join Notebook_Labels label on assigned.notebook_label_id = label.id
    where assigned.notebook_id = :notebookID
    ORDER BY name ASC';

    $sql = DB::dbConnect()->prepare($stmt);

    // notebook ID
    $notebookID = filter_var($notebookID, FILTER_SANITIZE_NUMBER_INT);
    $sql->bindParam(':notebookID', $notebookID, PDO::PARAM_INT);

    $sql->execute();
    return $sql;
  }

  /**
   * Assign a label to a notebook
   */
  public static function insertNotebookLabelsAssigned($labelID, $notebookID) {
    $stmt = 'INSERT INTO Notebook_Labels_Assigned 
    (notebook_label_id, notebook_id, date_assigned) 
    VALUES (:labelID, :notebookID, NOW())';

    $sql = DB::dbConnect()->prepare($stmt);

    // label ID
    $labelID = filter_var($labelID, FILTER_SANITIZE_NUMBER_INT);
    $sql->bindParam(':labelID', $labelID, PDO::PARAM_INT);

    // notebook ID
    $notebookID = filter_var($notebookID, FILTER_SANITIZE_NUMBER_INT);
    $sql->bindParam(':notebookID', $notebookID, PDO::PARAM_INT);

    $sql->execute();
    return $sql;
  }

  /**
   * deletes a row from  assigned notebook labels table
   */
  public static function deleteNotebookLabelsAssigned($labelID, $notebookID) {
    $stmt = 'DELETE FROM Notebook_Labels_Assigned
    WHERE notebook_label_id = :labelID 
    AND notebook_id = :notebookID';

    $sql = DB::dbConnect()->prepare($stmt);

    // label ID
    $labelID = filter_var($labelID, FILTER_SANITIZE_NUMBER_INT);
    $sql->bindParam(':labelID', $labelID, PDO::PARAM_INT);

    // notebook ID
    $notebookID = filter_var($notebookID, FILTER_SANITIZE_NUMBER_INT);
    $sql->bindParam(':notebookID', $notebookID, PDO::PARAM_INT);

    $sql->execute();
    return $sql;
  }

  public static function updateNotebookLabel($labelID, $name, $color) {
    $stmt = 'UPDATE Notebook_Labels
    SET name = :name,
    color = :color 
    WHERE id = :labelID';

    $sql = DB::dbConnect()->prepare($stmt);

    // notebook ID
    $labelID = filter_var($labelID, FILTER_SANITIZE_NUMBER_INT);
    $sql->bindParam(':labelID', $labelID, PDO::PARAM_INT);

    // name
    $name = filter_var($name, FILTER_SANITIZE_STRING);
    $sql->bindParam(':name', $name, PDO::PARAM_STR);

    // color
    $color = filter_var($color, FILTER_SANITIZE_STRING);
    $sql->bindParam(':color', $color, PDO::PARAM_STR);

    $sql->execute();
    return $sql;

  }
  

}












?>