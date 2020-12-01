<?php 
session_start();

// go to home page if user has already logged on
if (isset($_COOKIE['userID'])) {
  $_SESSION['userID'] = $_COOKIE['userID'];
  header('Location: home.php');
  exit;
}

require_once('DB.php');
?>


<!DOCTYPE html>
<html>

<head>
  <?php include('php/header.php'); ?>
  <title>Notebooks - Log in</title>
</head>

<body>
  <div class="container">
    <h1 class="text-center">Log in</h1>

    <div class="d-flex justify-content-center">
      <form method="post" action="api.notebooks.php" class="form-sm">
        <div class="form-group">
          <label for="user-login-email">Email address</label>
          <input type="email" class="form-control form-control-sm" id="user-login-email" name="user-login-email"
            required>
          <div class="invalid-feedback"></div>
        </div>

        <div class="form-group">
          <label for="user-login-password">Password</label>
          <input type="password" class="form-control form-control-sm" id="user-login-password"
            name="user-login-password" required>
          <div class="invalid-feedback"></div>
        </div>

        <div class="form-sm-actions">
          <button type="submit" class="btn btn-sm btn-primary">Log in</button>
          <a href="create-account.php">Create account</a>
        </div>
      </form>

    </div>

  </div>

  <?php include('php/footer.php'); ?>

</body>

</html>