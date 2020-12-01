<?php 
session_start();

// verify that the session user id is set
if (!isset($_SESSION['userID'])) {
  http_response_code(400);
  exit;
}

require_once('DB.php');
?>


<!DOCTYPE html>
<html>
<head>
  <?php include('php/header.php'); ?>


  <link rel="stylesheet" href="css/external/codemirror/codemirror.css">
  <link rel="stylesheet" href="css/external/codemirror/fullscreen.css">

  




  <title>Notebooks Test</title>
</head>
<body>
  <?php include('php/navbar.php'); ?>

  <div class="container">

  <h1 class="text-center my-5">Test</h1>



  <textarea class="textarea-plus" rows="10"></textarea>







  </div>







  <?php include('php/footer.php'); ?>
  <script src="js/test.js"></script>




</body>
</html>