(function ($, Drupal) {

  "use strict";

  Drupal.behaviors.prebidjsDfp = {

    attach: function (context, settings) {

      // Gather our global settings.
      var prebidTimeout = Drupal.settings.prebidjsDfp.prebidTimeout || 2000;
      var prebidBidderSequence = Drupal.settings.prebidjsDfp.prebidBidderSequence || 'random';
      var prebidEnableSendAllBids = Drupal.settings.prebidjsDfp.prebidEnableSendAllBids || true;
      var prebidPriceGranularity = Drupal.settings.prebidjsDfp.prebidPriceGranularity || [];

      // Gather bidder information for each of the DFP tags.
      var prebidBidders = Drupal.settings.prebidjsBidders || {};

      var tags = settings.dfpTags || {};
      var adUnits = [];
      var pbjs = window.pbjs || {};
      pbjs.que = window.pbjs.que || [];

      var priceGranularity = null;
      if (prebidPriceGranularity.hasOwnProperty('standard')) {
        priceGranularity = prebidPriceGranularity.standard.value;
      }
      else {
        // @todo: Allow multiple buckets. See prebidjs_dfp_form_alter()
        priceGranularity = {
          'buckets': [{
            'precision': prebidPriceGranularity.custom.precision,
            'min': prebidPriceGranularity.custom.min,
            'max': prebidPriceGranularity.custom.max,
            'increment': prebidPriceGranularity.custom.increment
          }]
        };
      }

      for (var tag in tags) {
        // We only want to add a bidder if the tag has been saved with bidder
        // adapter data.
        if (tags.hasOwnProperty(tag) && prebidBidders.hasOwnProperty(tag)) {
          var currentTag = Object.assign({}, tags[tag]);
          var unit = {};

          var mediaTypes = {
            banner: {
              sizes: []
            }
          };

          unit.bids = [];
          unit.mediaTypes = mediaTypes;

          unit.code = currentTag.placeholder_id + '-wrapper';

          // Add sizes to all the places.
          unit.sizes = unit.mediaTypes.banner.sizes = currentTag.size;

          for (var key in prebidBidders) {
            if (prebidBidders.hasOwnProperty(key)) {
              var item = prebidBidders[key];

              for (var itemBidder in item) {
                if (item.hasOwnProperty(itemBidder)) {
                  var currentBidder = item[itemBidder];
                  if (currentBidder.active) {

                    var thisUnit = {
                      bidder: currentBidder.settings.name ? currentBidder.settings.name : itemBidder,
                      params: currentBidder.settings
                    };

                    unit.bids.push(thisUnit);
                  }
                }
              }
            }
          }

          adUnits.push(unit);
        }
      }

      function sendAdserverRequest() {
        if (pbjs.adserverRequestSent) {
          return;
        }
        pbjs.adserverRequestSent = true;
        googletag.cmd.push(function () {
          pbjs.que.push(function () {
            pbjs.setTargetingForGPTAsync();
            googletag.pubads().refresh();
          });
        });
      }

      if (adUnits.length) {
        pbjs.setConfig({
          priceGranularity: priceGranularity
        });

        pbjs.que.push(function () {
          pbjs.addAdUnits(adUnits);
          pbjs.requestBids({
            bidsBackHandler: sendAdserverRequest
          });
        });

        setTimeout(function () {
          sendAdserverRequest();
        }, prebidTimeout);
      }
    }

  };

})(jQuery, Drupal);
