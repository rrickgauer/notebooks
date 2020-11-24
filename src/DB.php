<?php



class DB {
  public static function dbConnect() {
    include('db-info.php');

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
    $email = filter_var($email, FILTER_SANITIZE_STRING);
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

}









?>