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

  <!-- header -->
  <section id="notebook-header">
    <div class="container">

      <div class="notebook-meta">
        <div class="notebook-meta-info">
          <h1 class="notebook-meta-name"><?php echo $notebook['name']; ?></h1>
          <div class="notebook-meta-description"><?php echo $notebook['description']; ?></div>
        </div>

        <div class="notebook-meta-buttons">
          <button type="button" class="btn btn-sm btn-light btn-notebook-meta-edit">Edit</button>
          <!-- toggle new page modal -->
          <button type="button" class="btn btn-sm btn-success" data-toggle="modal" data-target="#modal-page-new">New page</button>
        </div>
      </div>

      <!-- edit notebook meta data -->
      <div class="notebook-meta-edit d-none">
        <div class="inputs">
          <!-- description -->
          <div class="form-group">
            <input type="text" class="form-control form-control-lg" id="notebook-edit-name" value="<?php echo $notebook['name']; ?>">
            <div class="invalid-feedback">Please enter a name</div>
          </div>

          <!-- description -->
          <div class="form-group">
            <textarea id="notebook-edit-description" rows="7" class="form-control"><?php echo $notebook['description']; ?></textarea>
          </div>
        </div>

        <div class="buttons">
          <button type="button" class="btn btn-sm btn-success btn-notebook-meta-update-save">Save</button>
          <button type="button" class="btn btn-sm btn-light btn-notebook-meta-update-cancel">Cancel</button>
        </div>

      </div>


    </div>
  </section>

  <!-- body -->
  <section id="notebook-body" class="mt-5">
    <div class="container-md">

      <!-- table of content -->
      <div class="pages-toc mb-3">
        <details open>
          <summary open class="h4">Table of content</summary>
          <ol class="pages-toc-list"></ol>
        </details>
      </div>


      <!-- pages -->
      <div class="row">
        <!-- action buttons -->
        <div class="col-sm-12 col-md-3 order-md-2">
          <ul class="list-group list-group-flush notebook-action-list">
            <!-- sorting -->
            <li class="list-group-item notebook-action sorting">
              <h6 class="notebook-action-header">Sort</h6>
              <!-- oldest -->
              <div class="form-check">
                <input class="form-check-input" type="radio" name="notebook-action-sort" id="notebook-action-sort-oldest" value="oldest">
                <label class="form-check-label" for="notebook-action-sort-oldest">Oldest</label>
              </div>
              <!-- newest -->
              <div class="form-check">
                <input class="form-check-input" type="radio" name="notebook-action-sort" id="notebook-action-sort-newest" value="newest">
                <label class="form-check-label" for="notebook-action-sort-newest">Newest</label>
              </div>
              <!-- name -->
              <div class="form-check">
                <input class="form-check-input" type="radio" name="notebook-action-sort" id="notebook-action-sort-name" value="name">
                <label class="form-check-label" for="notebook-action-sort-name">Name</label>
              </div>
            </li>

            <!-- filter pages -->
            <li class="list-group-item notebook-action">
              <h6 class="notebook-action-header">Page types</h6>
              <!-- notes -->
              <div class="form-check">
                <input class="form-check-input" type="checkbox" value="notes" name="notebook-action-filter-type" id="notebook-action-filter-type-notes" checked>
                <label class="form-check-label" for="notebook-action-filter-type-notes">Notes</label>
              </div>
              <!-- checklists -->
              <div class="form-check">
                <input class="form-check-input" type="checkbox" value="checklists" name="notebook-action-filter-type" id="notebook-action-filter-type-checklists" checked>
                <label class="form-check-label" for="notebook-action-filter-type-checklists">Checklists</label>
              </div>
            </li>

            <!-- toggle hidden pages -->
            <li class="list-group-item notebook-action">
              <h6 class="notebook-action-header">Hidden pages</h6>
              <div class="custom-control custom-switch">
                <input type="checkbox" class="custom-control-input" id="notebook-action-hidden-toggle">
                <label class="custom-control-label" for="notebook-action-hidden-toggle">Show</label>
              </div>
            </li>

            <!-- expand/shrink pages -->
            <li class="list-group-item notebook-action">
              <h6 class="notebook-action-header">View</h6>
              <button type="button" class="btn btn-sm btn-light btn-block btn-notebook-action-view btn-notebook-view-collapse">Collapse</button>
              <button type="button" class="btn btn-sm btn-light btn-block btn-notebook-action-view btn-notebook-view-expand">Expand</button>
            </li>

            <!-- edit labels -->
            <li class="list-group-item notebook-action">
              <h6 class="notebook-action-header">Labels</h6>
              <button type="button" class="btn btn-sm btn-light btn-block btn-notebook-action-labels" data-toggle="modal" data-target="#modal-notebook-labels">Edit labels</button>
            </li>

            <!-- delete notebook -->
            <li class="list-group-item notebook-action">
              <h6 class="notebook-action-header">Delete</h6>
              <button type="button" class="btn btn-sm btn-outline-danger btn-block btn-notebook-action-delete" data-toggle="modal" data-target="#modal-notebook-delete">Delete notebook</button>
            </li>
          </ul>
        </div>

          <!-- pages -->
          <div class="col-sm-12 col-md-9 order-md-1">
          <h4>Your pages <span class="notebook-meta-count-pages badge badge-secondary"><?php echo $notebook['count_pages']; ?></span></h4>
          <div class="pages"></div>
        </div>
      </div>
    </div>
  </section>


  <!-- modals -->
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


    <!-- delete notebook modal -->
    <div class="modal fade modal-notebook-delete" id="modal-notebook-delete" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Delete notebook</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">

            <h6>Are you sure you want to delete this notebook?</h6>

            <ul>
              <li>This cannot be undone</li>
              <li>All notes will be deleted</li>
              <li>All checklists will be deleted</li>
            </ul>

            <a href="delete-notebook.php?notebookID=<?php echo $_GET['notebookID']; ?>" class="btn btn-sm btn-outline-danger btn-block btn-delete-notebook">Delete this notebook</a>
          </div>
        </div>
      </div>
    </div>

    <!-- edit labels modal-->
    <div class="modal fade modal-notebook-labels" id="modal-notebook-labels" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Labels</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            
            <!-- create new label -->
            <p><b>Create a new label</b></p>
            <form id="form-notebooks-labels-new">
              <div class="form-row align-items-center">
                <!-- name -->
                <div class="col-8">
                  <input type="text" class="form-control form-control-sm" id="form-notebooks-labels-new-name" placeholder="Name">
                </div>
                <!-- color -->
                <div class="col-auto">
                  <input type="text" class="color-picker" id="form-notebooks-labels-new-color">
                </div>
                <!-- submit -->
                <div class="col-auto">
                  <button type="submit" class="btn btn-sm btn-primary" id="form-notebooks-labels-new-btn" disabled>Create</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

  </div>




  <?php include('php/footer.php'); ?>
  <script src="js/classes/Note.js"></script>
  <script src="js/classes/Checklist-Item.js"></script>
  <script src="js/classes/Checklist.js"></script>
  <script src="js/notebook.js"></script>

</body>
</html>