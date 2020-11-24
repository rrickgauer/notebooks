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
  <?php include('header.php'); ?>
  <title>Notebooks Home</title>
</head>
<body>
  <div class="container">
    <h1 class="text-center mt-5">Home</h1>

    
    <?php echo $_SESSION['userID']; ?>

  </div>

  <?php include('footer.php'); ?>
  <script src="js/home.js"></script>

</body>
</html>