<?php

/**
 * @file prebidjs_dfp.api.php
 *
 */

/**
 * This hooks allows providing a custom prebid.js file from
 * http://prebid.org/download.html.
 *
 * The $options provided cannot be modified as they are not passed by reference
 * and are used to ensure the javascript is added to the page correctly.
 *
 * @param array $options
 *   Options that should be passed along to drupal_add_js().
 */
function hook_prebidjs_dfp_add_js($options) {
  drupal_add_js(drupal_get_path('module', 'MY_MODULE') . '/js/prebid.js', $options);
}
