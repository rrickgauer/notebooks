<?php 
session_start();

// verify that the session user id is set
if (!isset($_SESSION['userID'])) {
  header('Location: create-account.php');
  exit;
}

require_once('DB.php');

// $user = DB::getUser($_SESSION['userID'])->fetch(PDO::FETCH_ASSOC);
?>


<!DOCTYPE html>
<html>

<head>
  <?php include('php/header.php'); ?>
  <title>Notebook Labels</title>
</head>

<body>
  <?php include('php/navbar.php'); ?>

  <div class="container-md">
    <h1 class="text-center">Notebook Labels</h1>




    <div class="card card-notebook-labels">
      <div class="card-header">
        <div class="top">
        <h6>8 Labels</h6>
        <button type="button" class="btn btn-sm btn-primary" data-toggle="collapse" data-target=".new-label-section">New label</button>
        </div>

        <div class="new-label-section collapse mt-3">
          <form class="form-notebook-labels-new">
            <div class="inputs">
              <!-- name -->
              <div class="item name">
                <label for="form-notebook-labels-new-name">Name</label>
                <input type="text" id="form-notebook-labels-new-name" class="form-control form-control-sm">
                <div class="invalid-feedback">Please provide a name.</div>
              </div>
              <!-- color -->
              <div class="item color ml-3">
                <label for="form-notebook-labels-new-name">Color</label>
                <input type="color" id="form-notebook-labels-new-color" class="form-control form-control-sm">
              </div>
            </div>
            <div class="buttons">
              <button type="button" class="btn btn-sm btn-success btn-notebook-labels-new-save">Create label</button>
              <button type="button" class="btn btn-sm btn-secondary btn-notebook-labels-new-cancel">Cancel</button>
            </div>
          </form>
        </div>


      </div>

      <div class="card-body">
        <ul class="list-group list-group-flush"></ul>
      </div>
    </div>





  </div>

  <?php include('php/footer.php'); ?>
  <script src="js/notebook-labels.js"></script>

</body>

</html>