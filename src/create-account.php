<?php 
session_start();
session_destroy();
unset($_SESSION['userID']);
require_once('DB.php'); 

?>


<!DOCTYPE html>
<html>
<head>
  <?php include('php/header.php'); ?>
  <title>Notebooks - Create account</title>
</head>
<body>
  <div class="container">
    <h1 class="text-center mb-5 mt-center">Create Account</h1>

    <div class="d-flex justify-content-center">
      <form method="post" action="api.notebooks.php" class="form-sm">
        <div class="form-group">
          <label for="user-new-name-first">First name</label>
          <input type="text" class="form-control form-control-sm" id="user-new-name-first" name="user-new-name-first" required>
          <div class="invalid-feedback"></div>
        </div>

        <div class="form-group">
          <label for="user-new-name-last">Last name</label>
          <input type="text" class="form-control form-control-sm" id="user-new-name-last" name="user-new-name-last" required>
          <div class="invalid-feedback"></div>
        </div>

        <div class="form-group">
          <label for="user-new-email">Email address</label>
          <input type="email" class="form-control form-control-sm" id="user-new-email" name="user-new-email" required>
          <div class="invalid-feedback"></div>
        </div>

        <div class="form-group">
          <label for="user-new-password">Password</label>
          <input type="password" class="form-control form-control-sm" id="user-new-password" name="user-new-password" required>
          <div class="invalid-feedback"></div>
        </div>

        <div class="form-sm-actions">
          <button type="submit" class="btn btn-sm btn-primary">Create account</button>
          <a href="login.php">Log in</a>
        </div>
      </form>

    </div>



  </div>

  <?php include('php/footer.php'); ?>

</body>
</html>