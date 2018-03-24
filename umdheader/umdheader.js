(function ($) {

'use strict';

Drupal.umdheader = Drupal.umdheader || {};

/**
 * Initialize the UMD Header.
 */
Drupal.behaviors.umdheader = {
  attach: function(context) {
    $('body').once('umdheader', function() {
      var readyFn;

      readyFn = [];

      /**
       * Drupal core "Toolbar" module
       */
      (function() {
        var DrupalToolbar;

        if ($('#toolbar').length === 0) {
          return;
        }

        // Override the original toolbar methods
        DrupalToolbar = {
          collapse: Drupal.toolbar.collapse,
          expand: Drupal.toolbar.expand,
          trigger: function(action) {
            var umhCont = umdHeader.jQuery('#umh-cont');

            DrupalToolbar[action]();

            // Recalculate body padding to override CSS.
            umhCont.css({
              top: Drupal.toolbar.height()
            });

            // Recalculate the body's top padding
            $('body')
              .removeClass('toolbar-drawer')
              .css('paddingTop', Drupal.toolbar.height() + umhCont.height());

            // Reset the toolbar height variable used during resizes.
            Drupal.umdheader.toolbarHeight = Drupal.toolbar.height();
          }
        };

        /**
         * Override the toolbar collapse method.
         * Only the body paddingTop has been altered.
         */
        Drupal.toolbar.collapse = function() {
          DrupalToolbar.trigger('collapse');
        };

        /**
         * Override the toolbar expand method.
         */
        Drupal.toolbar.expand = function() {
          DrupalToolbar.trigger('expand');
        };

        // umdHeader ready functions.
        readyFn.push(function() {
          var $,
              toolbar,
              umhCont,
              mainCont;

          $ = umdHeader.jQuery;
          toolbar = $('#toolbar');
          umhCont = $('#umh-cont');
          mainCont = $('#umh-main');

          // Offset the Toolbar appropriately.
          umhCont.css({
            top: '+=' + Drupal.toolbar.height(),
            'z-index': toolbar.css('z-index') - 1
          });

          // Save the original toolbar height
          Drupal.umdheader.toolbarHeight = Drupal.toolbar.height();

          $(window).on('resize', function(e, opts) {
            var heightDifference;

            heightDifference = Drupal.toolbar.height() - Drupal.umdheader.toolbarHeight;

            if (heightDifference === 0) {
              return;
            }

            // If the toolbar's height has changed, adjust the UMD Header.
            umhCont.css('top', '+=' + heightDifference);
            $('body').css('paddingTop', '+=' + heightDifference);

            Drupal.umdheader.toolbarHeight = toolbar.height();
          });
        });
      }());

      /**
       * Contrib "Admin Menu" module
       */
      (function() {
        var umdHeaderAdminMenu;

        if (!Drupal.hasOwnProperty('admin')) {
          return;
        }

        umdHeaderAdminMenu = {};

        umdHeaderAdminMenu.trigger = function() {
          var $,
              adminMenu,
              umhCont,

          $ = umdHeader.jQuery;
          adminMenu = $('#admin-menu');
          umhCont = $('#umh-cont');

          umhCont.css({
            top: '+=' + adminMenu.height(),
            'z-index': adminMenu.css('z-index') - 1
          });

          // Save the original toolbar height
          Drupal.umdheader.adminMenuHeight = adminMenu.height();

          $(window).on('resize', function(e, opts) {
            var heightDifference;

            heightDifference = adminMenu.height() - Drupal.umdheader.adminMenuHeight;

            if (heightDifference === 0) {
              return;
            }

            // If the toolbar's height has changed, adjust the UMD Header.
            umhCont.css('top', '+=' + heightDifference);
            $('body').css('paddingTop', '+=' + heightDifference);

            Drupal.umdheader.adminMenuHeight = adminMenu.height();
          });

          umhCont.addClass('umdheader-admin-menu-processed');
        };

        /**
         * Adjust the admin menu position in Admin Menu if the Header is loaded.
         *
         * Used to negotiate race conditions with the Admin Menu and the Header loading.
         */
        Drupal.admin.behaviors.umdHeader = function() {
          // Make sure that the UMD Header is loaded.
          if ($('#umh-cont').length === 0) {
            return;
          }

          umdHeaderAdminMenu.trigger();
        };

        /**
         * Adjust the admin menu position in Admin Menu if the Header is loaded.
         *
         * Used to negotiate race conditions with the Admin Menu and the Header loading.
         */
        readyFn.push(function() {
          // Make sure the the admin menu is loaded
          if ($('#admin-menu:not(.umdheader-admin-menu-processed)').length === 0) {
            return;
          }

          umdHeaderAdminMenu.trigger();
        });
      }());

      // Initialize the UMD Header
      umdHeader.init({
        news: Drupal.settings.umdHeader.news,
        ready: readyFn
      });
    });
  }
};

})(jQuery);
