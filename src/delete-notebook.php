<?php 
session_start();


if (!isset($_SESSION['userID'])) {          // verify that the session user id is set
  http_response_code(400);
  exit;
} else if (!isset($_GET['notebookID'])) {   // verify that the notebook id is set
  http_response_code(400);
  exit;
}

require_once('DB.php');
?>


<!DOCTYPE html>
<html>

<head>
  <?php include('php/header.php'); ?>
  <title>Delete notebook</title>
</head>

<body>

  <div class="container-md">
    <h4 class="text-center mt-5 mb-5">Confirm password to continue</h4>

    <div class="d-flex justify-content-center">
      <form id="form-notebook-delete" class="form-sm">
        <div class="form-group">
          <label for="form-notebook-delete-password">Password</label>
          <input type="password" class="form-control form-control-sm" id="form-notebook-delete-password">
          <div class="invalid-feedback" id="form-notebook-delete-password-invalid-feedback"></div>
        </div>

        <button type="button" class="btn btn-sm btn-success btn-block" id="form-notebook-delete-btn">Confirm password</button>
      </form>
    </div>

  </div>



  <?php include('php/footer.php'); ?>
  <script src="js/delete-notebook.js"></script>

</body>

</html>