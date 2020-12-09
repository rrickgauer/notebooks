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


    <button type="button" class="btn btn-outline-primary mt-5">Outline the button</button>
    <button type="button" class="btn btn-primary mt-5">Outline the button</button>



    </div>







    <?php include('php/footer.php'); ?>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/uuid/8.1.0/uuidv4.min.js"></script>
    <script src="js/classes/Page-Comment.js"></script>
    <script src="js/test.js"></script>




</body>

</html>