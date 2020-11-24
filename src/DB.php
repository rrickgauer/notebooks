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
  public static function insertNotebook($userID, $name) {
    $stmt = 'INSERT INTO Notebooks (user_id, name, date_created) VALUES (:userID, :name, NOW())';

    $sql = DB::dbConnect()->prepare($stmt);

    // sanitize and bind id
    $userID = filter_var($userID, FILTER_SANITIZE_NUMBER_INT);
    $sql->bindParam(':userID', $userID, PDO::PARAM_INT);

    // sanitize and bind notebook name
    $name = filter_var($name, FILTER_SANITIZE_STRING);
    $sql->bindParam(':name', $name, PDO::PARAM_STR);

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
    $stmt = 'SELECT * FROM Notebooks where id = :notebookID LIMIT 1';

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
    n.date_created,
    DATE_FORMAT(n.date_created, "%c/%d/%Y") as date_created_display
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
    DATE_FORMAT(n.date_modified, "%c/%d/%Y") as date_modified_display
    FROM Notes n
    WHERE n.notebook_id = :notebookID
    ORDER BY date_created desc';

    $sql = DB::dbConnect()->prepare($stmt);

    // notebook id
    $notebookID = filter_var($notebookID, FILTER_SANITIZE_NUMBER_INT);
    $sql->bindParam(':notebookID', $notebookID, PDO::PARAM_INT);

    $sql->execute();

    return $sql;

  }

  /////////////////////////////
  // Update a note's content //
  /////////////////////////////
  public static function updateNote($noteID, $content) {
    $stmt = '
    UPDATE Notes SET content = :content, date_modified = NOW()
    WHERE id = :noteID';

    $sql = DB::dbConnect()->prepare($stmt);

    // note id
    $noteID = filter_var($noteID, FILTER_SANITIZE_NUMBER_INT);
    $sql->bindParam(':noteID', $noteID, PDO::PARAM_INT);

    // note id
    $content = filter_var($content, FILTER_SANITIZE_STRING);
    $sql->bindParam(':content', $content, PDO::PARAM_STR);

    $sql->execute();

    return $sql;
  }

}












?>