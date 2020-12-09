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

    <h1 class="custom-font">Headong 1</h1>



    </div>







    <?php include('php/footer.php'); ?>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/uuid/8.1.0/uuidv4.min.js"></script>
    <script src="js/classes/Page-Comment.js"></script>
    <script src="js/test.js"></script>




</body>

</html>