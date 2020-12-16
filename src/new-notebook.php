<?php 

session_start();


// verify that the session user id is set
if (!isset($_SESSION['userID'])) {
  http_response_code(400);
  exit;
}

require_once('DB.php');
include_once('php/classes/HTML-Generator.php');
?>


<!DOCTYPE html>
<html>
<head>
  <?php include('php/header.php'); ?>
  <title>Notebooks - New Notebook</title>
</head>
<body>

  <?php include('php/navbar.php'); ?>

  <div class="container">
    <h1 class="text-center my-5">New notebook</h1>

    

    <form>
      <form method="post" action="api.notebooks.php">

        <!-- name -->
        <div class="form-group">
          <label for="notebook-new-name">Name</label>
          <input type="text" class="form-control" id="notebook-new-name" autofocus>
          <div class="invalid-feedback"></div>
        </div>

        <!-- description -->
        <div class="form-group">
          <label for="notebook-new-name">Description</label>
          <textarea id="notebook-new-description" rows="7" class="form-control"></textarea>
        </div>

        <button type="button" class="btn btn-primary btn-create-new-notebook">Create new notebook</button>
      </form>
    </form>




  </div>

  <?php include('php/footer.php'); ?>
  <script src="js/new-notebook.js"></script>

</body>
</html>





