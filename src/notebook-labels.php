<?php 
session_start();

// verify that the session user id is set
if (!isset($_SESSION['userID'])) {
  header('Location: create-account.php');
  exit;
}

require_once('DB.php');

// $user = DB::getUser($_SESSION['userID'])->fetch(PDO::FETCH_ASSOC);
?>


<!DOCTYPE html>
<html>

<head>
  <?php include('php/header.php'); ?>
  <title>Notebook Labels</title>
</head>

<body>
  <?php include('php/navbar.php'); ?>

  <div class="container-md">
    <h1 class="text-center">Notebook Labels</h1>
    
    <div class="card card-notebook-labels">
      <div class="card-header">
        <h6>8 Labels</h6>
      </div>

      <div class="card-body">
        <ul class="list-group list-group-flush"></ul>
      </div>
    </div>





  </div>

  <?php include('php/footer.php'); ?>
  <script src="js/notebook-labels.js"></script>

</body>

</html>