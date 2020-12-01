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
  <title>Notebooks Test</title>
</head>
<body>
  <?php include('php/navbar.php'); ?>

  <div class="container">


  <ul>

    <li class="notebook">

      <div class="date-created-display">11/9/2020</div>

      <div>

      
      </div>

    </li>


  </ul>
















  </div>







  <?php include('php/footer.php'); ?>
  <script src="js/test.js"></script>




</body>
</html>