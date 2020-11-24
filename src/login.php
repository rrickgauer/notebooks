<?php 
session_start();
session_destroy();
unset($_SESSION['userID']);
require_once('DB.php'); 

if (isset($_SESSION['error'])) {
  echo $_SESSION['error-message'];
  unset($_SESSION['error']);
  unset($_SESSION['error-message']);
}


?>


<!DOCTYPE html>
<html>
<head>
  <?php include('php/header.php'); ?>
  <title>Notebooks - Create account</title>
</head>
<body>
  <div class="container">
    <h1 class="text-center mt-5">Log in</h1>

    <form method="post" action="api.notebooks.php">
      <div class="form-group">
        <label for="user-login-email">Email address</label>
        <input type="email" class="form-control" id="user-login-email" name="user-login-email" required>
        <div class="invalid-feedback"></div>
      </div>

      <div class="form-group">
        <label for="user-login-password">Password</label>
        <input type="password" class="form-control" id="user-login-password" name="user-login-password" required>
        <div class="invalid-feedback"></div>
      </div>

      <div class="d-flex align-items-center justify-content-between">
        <button type="submit" class="btn btn-primary">Log in</button>
        <a href="create-account.php">Don't have an account? Signup</a>
      </div>
      
    </form>

  </div>

  <?php include('php/footer.php'); ?>

</body>
</html>