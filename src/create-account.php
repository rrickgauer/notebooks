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
    <h1 class="text-center mt-5">Create Account</h1>

    <form method="post" action="api.notebooks.php">
      <div class="form-group">
        <label for="user-new-name-first">First name</label>
        <input type="text" class="form-control" id="user-new-name-first" name="user-new-name-first" required>
        <div class="invalid-feedback"></div>
      </div>

      <div class="form-group">
        <label for="user-new-name-last">Last name</label>
        <input type="text" class="form-control" id="user-new-name-last" name="user-new-name-last" required>
        <div class="invalid-feedback"></div>
      </div>

      <div class="form-group">
        <label for="user-new-email">Email address</label>
        <input type="email" class="form-control" id="user-new-email" name="user-new-email" required>
        <div class="invalid-feedback"></div>
      </div>

      <div class="form-group">
        <label for="user-new-password">Password</label>
        <input type="password" class="form-control" id="user-new-password" name="user-new-password" required>
        <div class="invalid-feedback"></div>
      </div>


      <button type="submit" class="btn btn-primary">Submit</button>
    </form>

  </div>

  <?php include('php/footer.php'); ?>

</body>
</html>