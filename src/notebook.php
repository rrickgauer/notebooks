<?php 
session_start();

// verify that the session user id is set
if (!isset($_SESSION['userID'])) {
  http_response_code(400);
  exit;
}

// verify that the session user id is set
if (!isset($_GET['notebookID'])) {
  http_response_code(400);
  exit;
}

require_once('DB.php');

$notebook = DB::getNotebook($_GET['notebookID'])->fetch(PDO::FETCH_ASSOC);

?>


<!DOCTYPE html>
<html>
<head>
  <?php include('header.php'); ?>
  <title><?php echo $notebook['name']; ?></title>
</head>
<body>
  <div class="container">
    <h1 class="text-center mt-5"><?php echo $notebook['name']; ?></h1>

  </div>

  <?php include('footer.php'); ?>
  <script src="js/home.js"></script>

</body>
</html>