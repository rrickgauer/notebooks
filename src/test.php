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

  <h1 class="text-center my-5">Test</h1>

  <ul class="list-group list-group-flush list-notebooks">

    <li class="list-group-item notebook">
      <div class="d-flex">
        <h5 class="name"><a href="#">Name of the notebook</a></h5>
      </div>
      
      <div class="date-created">
        <span>Added on </span>
        <span class="date-created-display">11/15/2020</span>
      </div>
      <div class="description">This is where the description will go</div>

      <div class="page-counts">
        <span class="page-counts-item page-counts-notes"><i class='bx bx-note'></i><span class="page-count-data">32</span></span>
        <span class="page-counts-item page-counts-checklists"><i class='bx bx-list-check'></i><span class="page-count-data">32</span></span>
      </div>
    </li>




  </ul>









  </div>







  <?php include('php/footer.php'); ?>
  <script src="js/test.js"></script>


</body>
</html>