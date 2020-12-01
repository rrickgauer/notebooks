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

}



?>