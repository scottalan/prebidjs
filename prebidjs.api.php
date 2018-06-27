<?php

/**
 * @file
 * Documents API functions for prebidjs module.
 */

/**
 * Implements hook_prebidjs_bidder_adapters_info().
 */
function hook_prebidjs_bidder_adapters_info(){
  $bidder_adapters = array();
  $bidder_adapters['appnexus'] = array(
    'name' => 'AppNexus',
    'settings' => [
      'key' => 'label',
      'key' => 'label'
    ]
  );
  return $bidder_adapters;
}

/**
 * Implements hook_prebidjs_bidder_adapters_alter().
 */
function prebidjs_prebidjs_bidder_adapters_alter(&$bidder_adapters) {
  $bidder_adapters = array();
  $bidder_adapters['openx'] = array(
    'name' => 'openx',
    'settings' => array(
      'unit' => '',
      'delDomain' => '',
    ),
  );
  $bidder_adapters['rubicon'] = array(
    'name' => 'rubicon',
    'settings' => array(
      'accountId' => '',
      'siteId' => '',
      'zoneId' => '',
    ),
  );
  $bidder_adapters['indexExchange'] = array(
    'name' => 'indexExchange',
    'settings' => array(
      'id' => '',
      'siteID' => '',
    ),
  );
}
