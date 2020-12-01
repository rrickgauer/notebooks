<?php 
session_start();

// verify that the session user id is set
if (!isset($_SESSION['userID'])) {
  header('Location: create-account.php');
  exit;
}

// remeber the users login for a month extending every time they login
setcookie('userID', $_SESSION['userID'], time() + (86400 * 30), '/');

require_once('DB.php');

$user = DB::getUser($_SESSION['userID'])->fetch(PDO::FETCH_ASSOC);
?>


<!DOCTYPE html>
<html>
<head>
  <?php include('php/header.php'); ?>
  <title>Notebooks Home</title>
</head>
<body>
  <?php include('php/navbar.php'); ?>

  <div class="container-md">
    <h1 class="text-center page-header">Home</h1>

    <!-- <div class="d-flex flex-sm-row justify-content-between align-items-baseline"> -->
    <div class="home-header">
      <div>
        <h4 class="mb-3">Your notebooks <span class="badge badge-secondary"><?php echo $user['count_notebooks']; ?></span></h4>
      </div>

      <div class="home-header-inputs">        
        <div class="d-flex">
          <!-- sort notebooks -->
          <div class="dropdown mr-3">
            <button class="btn btn-light dropdown-toggle" type="button" data-toggle="dropdown">Sort</button>
            <div class="dropdown-menu">
              <button class="dropdown-item notebooks-sort oldest" type="button">Oldest</button>
              <button class="dropdown-item notebooks-sort newest" type="button">Newest</button>
              <button class="dropdown-item notebooks-sort name" type="button">Name</button>
            </div>
          </div>

          <!-- search for notebook -->
          <div class="input-group">
            <div class="input-group-prepend">
              <span class="input-group-text"><i class="bx bx-search"></i></span>
            </div>
            <input type="text" class="form-control" id="notebooks-search-input" placeholder="Find a notebook...">
          </div>
        </div>
      </div>    
    </div>

    

    <!-- notebooks -->
    <ul class="list-group list-group-flush list-notebooks"></ul>
    
 

  </div>

  <?php include('php/footer.php'); ?>
  <script src="js/home.js"></script>

</body>
</html>