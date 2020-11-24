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

    <div class="card card-page card-checklist" data-page-id="3">
      <div class="card-header">
        <div class="left">
          <h5 class="card-page-name">third</h5>
          <p>&nbsp;•&nbsp;<span class="card-page-date-created">11/24/2020</span></p>
        </div>

        <div class="right">
          <div class="dropdown">
            <button class="btn btn-sm" type="button" data-toggle="dropdown" aria-expanded="false">
              <i class="bx bx-dots-horizontal"></i>
            </button>
            <div class="dropdown-menu dropdown-menu-right" style="">
              <button class="dropdown-item btn-page-edit" type="button">Edit</button>
              <button class="dropdown-item btn-page-hide" type="button">Hide</button>
              <button class="dropdown-item btn-page-delete" type="button">Delete</button>
            </div>
          </div>
        </div>          
      </div>
      <div class="card-body">
        <div class="content display-mode-normal">


          <div class="items">

            <div class="item">
              <div class="left">
                <div class="form-check">
                  <label class="form-check-label">
                    <input class="form-check-input completed" type="checkbox">
                    <span class="content">Default checkbox</span>
                  </label>
                </div>
              </div>

              <div class="right">
                <div class="dropdown">
                  <button class="btn btn-sm" type="button" data-toggle="dropdown">
                    <i class='bx bx-dots-horizontal'></i>
                  </button>
                  <div class="dropdown-menu dropdown-menu-right">
                    <button class="dropdown-item btn-checklist-item-edit" type="button">Edit</button>
                    <button class="dropdown-item btn-checklist-item-delete" type="button">Delete</button>
                  </div>
                </div>
              </div>
            </div>




            
          </div>


        </div>
      </div>
    </div>








  </div>

  <?php include('php/footer.php'); ?>
  <script src="js/test.js"></script>


</body>
</html>