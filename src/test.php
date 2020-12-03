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


        <div class="card card-page card-note display-mode-normal " data-page-id="13" data-page-hidden="n">
            <div class="card-header">
                <div class="card-header-normal">
                    <div class="left">
                        <h5 class="card-page-name">sdf</h5>
                        <p>&nbsp;•&nbsp;<span class="card-page-date-created">12/01/2020</span></p>
                    </div>

                    <div class="right">
                        <div class="dropdown">
                            <button class="btn btn-sm" type="button" data-toggle="dropdown" aria-expanded="false">
                                <i class="bx bx-dots-horizontal"></i>
                            </button>
                            <div class="dropdown-menu dropdown-menu-right" style="">
                                <button class="dropdown-item btn-page-edit" type="button">Edit</button>
                                <button class="dropdown-item btn-page-hide" type="button">Hide</button>
                                <button class="dropdown-item btn-page-popout" type="button">Pop out</button>
                                <div class="dropdown-divider"></div>
                                <button class="dropdown-item btn-page-collapse" type="button">Collapse</button>
                                <button class="dropdown-item btn-page-expand" type="button">Expand</button>
                                <div class="dropdown-divider"></div>
                                <button class="dropdown-item btn-page-delete" type="button">Delete</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="card-header-edit">
                    <input type="text" class="form-control page-edit-name-input" placeholder="Update the name"
                        value="sdf">
                </div>

            </div>
            <div class="card-body">
                <div class="content">
                    <div class="rendered github-css">
                        <p>asdfasd asdfasdf</p>
                        <p>asdfasd asdfasdf</p>
                        <p>asdfasd asdfasdf</p>
                        <p>asdfasd asdfasdf</p>
                        <p>asdfasd asdfasdf</p>
                    </div>

                    <div class="edit">

                        <div class="tab-pane write show active" role="tabpanel">
                            <textarea class="form-control edit-input textarea-plus" rows="5"
                                placeholder="Add some content..." style="display: none;"></textarea>
                            <div class="CodeMirror cm-s-default CodeMirror-empty">
                                <div style="overflow: hidden; position: relative; width: 3px; height: 0px;"><textarea
                                        autocorrect="off" autocapitalize="off" spellcheck="false" tabindex="0"
                                        style="position: absolute; bottom: -1em; padding: 0px; width: 1000px; height: 1em; outline: none;"></textarea>
                                </div>
                                <div class="CodeMirror-vscrollbar" tabindex="-1" cm-not-content="true">
                                    <div style="min-width: 1px;"></div>
                                </div>
                                <div class="CodeMirror-hscrollbar" tabindex="-1" cm-not-content="true">
                                    <div style="height: 100%; min-height: 1px;"></div>
                                </div>
                                <div class="CodeMirror-scrollbar-filler" cm-not-content="true"></div>
                                <div class="CodeMirror-gutter-filler" cm-not-content="true"></div>
                                <div class="CodeMirror-scroll" tabindex="-1">
                                    <div class="CodeMirror-sizer" style="margin-left: 0px; min-width: 3px;">
                                        <div style="position: relative;">
                                            <div class="CodeMirror-lines" role="presentation">
                                                <div role="presentation" style="position: relative; outline: none;">
                                                    <pre class="CodeMirror-placeholder CodeMirror-line-like"
                                                        style="height: 0px; overflow: visible; direction: ltr;">Add some content...</pre>
                                                    <div class="CodeMirror-measure"><span><span>​</span>x</span></div>
                                                    <div class="CodeMirror-measure">
                                                        <pre class="CodeMirror-line"
                                                            role="presentation"><span role="presentation" style="padding-right: 0.1px;"><span cm-text="" style="display: inline-block; width: 1px; margin-right: -1px;">&nbsp;</span></span></pre>
                                                    </div>
                                                    <div style="position: relative; z-index: 1;"></div>
                                                    <div class="CodeMirror-cursors"></div>
                                                    <div class="CodeMirror-code" role="presentation"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div style="position: absolute; height: 50px; width: 1px;"></div>
                                    <div class="CodeMirror-gutters" style="display: none;"></div>
                                </div>
                            </div>
                        </div>


                        <div class="page-edit-buttons d-flex justify-content-end mt-3">
                            <button type="button"
                                class="btn btn-sm btn-outline-danger btn-page-update-cancel mr-2">Cancel</button>
                            <button type="button" class="btn btn-sm btn-success btn-page-update-save">Update
                                note</button>
                        </div>
                    </div>
                </div>
                <div class="comments-toggle-container">
                    <button type="button" class="btn btn-sm btn-light btn-comment-list-toggle">Comments</button>
                </div>
            </div>


            <div class="card-footer">
                <div class="d-flex justify-content-around align-items-center">
                    <form class="form-new-comment ">
                        <div class="w-100">
                            <input type="text" class="form-control" placeholder="New comment...">
                        </div>
                        <button type="button" class="btn btn-light">Add comment</button>
                    </form>
                </div>
                <ul class="comment-list list-unstyled mt-5"></ul>
            </div>

        </div>

    </div>







    <?php include('php/footer.php'); ?>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/uuid/8.1.0/uuidv4.min.js"></script>
    <script src="js/classes/Page-Comment.js"></script>
    <script src="js/test.js"></script>




</body>

</html>