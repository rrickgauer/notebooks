<?php 
session_start();

// verify that the session user id is set
if (!isset($_SESSION['userID'])) {
  http_response_code(400);
  exit;
}

// verify that the session user id is set
if (!isset($_GET['notebookID'])) {
  http_response_code(400);
  exit;
}

require_once('DB.php');

$notebook = DB::getNotebook($_GET['notebookID'])->fetch(PDO::FETCH_ASSOC);

?>


<!DOCTYPE html>
<html>
<head>
  <?php include('php/header.php'); ?>
  <title><?php echo $notebook['name']; ?></title>
</head>
<body>

  <?php include('php/navbar.php'); ?>

  <div class="container">
    <h1 class="text-center mt-5"><?php echo $notebook['name']; ?></h1>
    
    <!-- toggle new page modal -->
    <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#modal-page-new">New page</button>
    
    <!-- pages -->
    <h4 class="my-4">Your pages</h4>
    <div class="pages">

      <div class="card card-page">
        <div class="card-header">
          <div class="left">
            <h5 class="card-page-name">third</h5>
            <p>&nbsp;•&nbsp;<span class="card-page-date-created">11/24/2020</span></p>
          </div>

          <div class="right">
            <div class="dropdown">
              <button class="btn btn-sm" type="button" data-toggle="dropdown">
                <i class="bx bx-dots-horizontal"></i>
              </button>
              <div class="dropdown-menu dropdown-menu-right">
                <button class="dropdown-item btn-page-edit" type="button">Edit</button>
                <button class="dropdown-item btn-page-hide" type="button">Hide</button>
                <button class="dropdown-item btn-page-delete" type="button">Delete</button>
              </div>
            </div>
          </div>          
        </div>
        <div class="card-body">
          <div class="content display-mode-normal">

            <div class="rendered">
              null
            </div>

            <div class="edit">
              <nav>
                <div class="nav nav-tabs" role="tablist">
                  <button class="nav-link active" data-toggle="tab" data-target=".card-page[data-page-id='3'] .tab-pane.write">Write</button>
                  <button class="nav-link" data-toggle="tab" data-target=".card-page[data-page-id='3'] .tab-pane.preview">Preview</button>
                </div>
              </nav>
              <div class="tab-content">
                <div class="tab-pane write show active" role="tabpanel">
                  <textarea class="form-control" rows="5"></textarea>

                  <div class="page-edit-buttons d-flex justify-content-end mt-3">
                    <button type="button" class="btn btn-sm btn-outline-danger btn-page-update-cancel mr-2">Cancel</button>
                    <button type="button" class="btn btn-sm btn-success btn-page-update-save">Update note</button>
                  </div>
                </div>




                <div class="tab-pane preview" role="tabpanel">preview</div>
              </div>
            </div>
          </div>
        </div>
      </div>


    </div>



  </div>

  <div class="modals">

    <!-- new page modal -->
    <div class="modal fade modal-page-new" id="modal-page-new" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">New page</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <form class="form-page-new">
              <!-- name -->
              <div class="form-group">
                <label for="page-new-name">Name</label>
                <input type="text" class="form-control" id="page-new-name">
              </div>

              <span>Type</span>

              <!-- type -->
              <div class="form-check mt-1">
                <input class="form-check-input" type="radio" name="page-new-type" id="page-new-type-note" value="note" checked>
                <label class="form-check-label" for="page-new-type-note">Note</label>
              </div>
              <div class="form-check">
                <input class="form-check-input" type="radio" name="page-new-type" id="page-new-type-checklist" value="checklist">
                <label class="form-check-label" for="page-new-type-checklist">Checklist</label>
              </div>

            </form>

          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary btn-page-new-create" disabled>Create new page</button>
          </div>
        </div>
      </div>
    </div>

  </div>




  <?php include('php/footer.php'); ?>
  <script src="js/classes/Page.js"></script>
  <script src="js/notebook.js"></script>

</body>
</html>