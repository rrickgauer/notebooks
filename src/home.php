<?php 
session_start();

// verify that the session user id is set
if (!isset($_SESSION['userID'])) {
  http_response_code(400);
  exit;
}

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
    <h1 class="text-center mt-5">Home</h1>

    <div class="d-flex justify-content-between align-items-baseline">
      <div>
        <h4 class="mb-3">Your notebooks <span class="badge badge-secondary"><?php echo $user['count_notebooks']; ?></span></h4>
      </div>

      
      <div>        
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