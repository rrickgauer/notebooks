<?php

class HTML {

  public static function getNotebookLabelsListItems($numLabels) {
    $html = '';
    for ($count = 0; $count < $numLabels; $count++) {
      $html .= '
      <li class="list-group-item notebook-label">
        <div class="skeleton-text skeleton-effect-wave">asdfasdf asfeqweqwe</div>
      </li>';
    }

    return $html;
  }

  public static function getNotebooks($numNotebooks) {

    $html = '';
    for ($count = 0; $count < $numNotebooks; $count++) {
      $html .= '
      <li class="list-group-item notebook">
        <div class="d-flex">
          <h5 class="name"><div class="skeleton-text skeleton-effect-wave">This is the name</div></h5>
        </div>
          
        <div class="description">
          <div class="skeleton-text skeleton-effect-wave">this is the description I am guna use for my dipshit cunt face</div>
        </div>

        <div class="labels mt-3">
          <span class="skeleton-text skeleton-effect-wave mr-3 mt-3 mb-2">Label name</span>
          <span class="skeleton-text skeleton-effect-wave mr-3 mt-3 mb-2">Label name</span>
          <span class="skeleton-text skeleton-effect-wave mr-3 mt-3 mb-2">Label name</span>
        </div>
      
        <div class="page-counts">
          <span class="page-counts-item page-counts-date-created">
            <span class="page-count-data skeleton-text skeleton-effect-wave">11/25/2020</span>
          </span>
          <span class="page-counts-item page-counts-notes">
            <span class="page-count-data skeleton-text skeleton-effect-wave">11/25/2020</span>
          </span>
          <span class="page-counts-item page-counts-checklists">
            <span class="page-count-data skeleton-text skeleton-effect-wave">11/25/2020</span>
          </span>
        </div>
      </li>';
    }

    return $html;


  }

}



?>