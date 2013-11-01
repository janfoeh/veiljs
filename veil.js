// Expose plugin as an AMD module if AMD loader is present:
(function (factory) {
  'use strict';

  if (typeof define === 'function' && define.amd) {
    define(['jquery'], factory);
  } else {
    window.Veil = factory(jQuery);
  }

}(function ($) {
  'use strict';

  /**
   * Veil
   *
   * @class
   * @global
   * @param {Object} [options]
   * @param {String} [options.overlayClass] - additional CSS class(es) to apply to the overlay markup
   * @param {Boolean} [options.debug=false] - provide debug information and error handling in the console
   *
   * @param {Object} [callbacks] - callbacks to be triggered at various lifecycle moments
   * @param {afterCreateCallback} [callbacks.afterCreate] - called after the overlay markup has been created
   * @param {afterShowCallback} [callbacks.afterShow] - called each time after the overlay is shown
   */
  function Veil(options, callbacks) {
    var that = this;

    this.$overlay;

    this.options = $.extend({}, this.defaults, options);

    this.callbacks = {
      'afterCreate':  [],
      'afterShow':    []
    };

    if (typeof callbacks !== 'undefined') {
      for(var callbackName in callbacks){
         if (callbacks.hasOwnProperty(callbackName)) {
           this.addCallback(callbackName, callbacks[callbackName]);
         }
      }
    }

    this.initialize();
  }

  Veil.instances = [];

  Veil.prototype = (function() {

    var defaults,
        initialize,
        show,
        hide,
        destroy,
        overlay,
        exists,
        isActive,
        setContent,
        addCallback,
        _createMarkup,
        _hasCallbackFor,
        _executeCallbacksFor,
        _debug;

    defaults = {
      debug: true
    };

    initialize = function initialize() {

    };

    /**
     * Show the overlay. Create the markup first if it does not exist yet
     *
     * @memberOf Veil
     * @public
     */
    show = function show() {
      if ( !this.exists() ) {
        _createMarkup.call(this);
      }

      // trigger a style recalculation in order to prevent the browser
      // from coalescing the style changes from removing 'inactive' and
      // adding 'active'. Coalescing the changes makes entry animations
      // impossible, since the popover changes display from 'none' to 'block'
      this.$overlay.removeClass('inactive');
      this.$overlay.get(0).offsetHeight;
      this.$overlay.addClass('active');

      _executeCallbacksFor.call(this, 'afterShow', this.$overlay);
    };

    /**
     * Hide the overlay. Create the markup first if it does not exist yet
     *
     * @memberOf Veil
     * @public
     */
    hide = function hide() {
      if (!this.isActive()) {
        return false;
      }

      // trigger a style recalculation in order to prevent the browser
      // from coalescing the style changes from removing 'active' and
      // adding 'inactive'. Coalescing the changes makes exit animations
      // impossible, since the popover changes display from 'block' to 'none'
      this.$overlay.removeClass('active');
      this.$overlay.get(0).offsetHeight;
      this.$overlay.addClass('inactive');
    };

    /**
     * A jQuery object of the overlay markup in the DOM
     * 
     * @memberOf Veil
     * @public
     * @returns {jQuery}
     */
    overlay = function overlay() {
      return this.$overlay;
    };

    /**
     * Does the overlay markup exist in the DOM?
     *
     * @memberOf Veil
     * @public
     * @returns {Boolean}
     */
    exists = function exists() {
      return typeof this.$overlay !== 'undefined' && this.$overlay.length === 1;
    };

    /**
     * Is this overlay currently active?
     *
     * @memberOf Veil
     * @public
     * @returns {Boolean}
     */
    isActive = function isActive() {
      return this.exists() && this.$overlay.hasClass('active');
    };

    /**
     * Modifies the content markup of the overlay
     *
     * @memberOf Veil
     * @public
     * @param {String} content
     */
    setContent = function setContent(content) {
      this.content = content;

      if (this.exists()) {
        this.$overlay.html(this.content);
      }
    };

    /**
     * Hide the overlay, remove it from DOM and remove event handlers from the anchor element
     *
     * @memberOf Veil
     * @public
     */
    destroy = function destroy() {
      if ( !this.exists() ) {
        return false;
      }

      this.$overlay.remove();
    };

    /**
     * Create the popover markup in the DOM
     *
     * @memberOf Veil
     * @private
     */
    _createMarkup = function _createMarkup() {
      this.$overlay = $('<div class="veil-overlay inactive"></div>').addClass(this.options.overlayClass);

      this.$overlay.html(this.content);

      $('body').append(this.$overlay);
      _executeCallbacksFor.call(this, 'afterCreate', this.$overlay);
    };

    /**
     * Add a callback that is executed at trigger
     *
     * @memberOf Veil
     * @public
     * @param {String} trigger - at what point in the lifecycle to trigger the callback
     * @param {Function} callback
     */
    addCallback = function addCallback(trigger, callback) {
      if (typeof this.callbacks[trigger] === 'undefined') {
         _debug.call(this, "Warning: unknown callback %s will never be triggered", trigger);
         return false;
      }

      this.callbacks[trigger].push(callback);
    };

    /**
     * Tests whether one or more callbacks are available for the given trigger
     *
     * @memberOf Veil
     * @private
     * @param {String} trigger
     * @returns {Boolean}
     */
    _hasCallbackFor = function _hasCallbackFor(trigger) {
      return typeof this.callbacks[trigger] !== 'undefined' && this.callbacks[trigger].length > 0;
    };

    /**
     * Execute all callbacks for a given trigger
     *
     * @memberOf Veil
     * @private
     * @param {String} trigger
     * @param {...mixed} arguments - arguments to be handed to the callbacks
     */
    _executeCallbacksFor = function _executeCallbacksFor(trigger) {
      var that              = this,
          callbackArguments = Array.prototype.slice.call(arguments);

      // remove the trigger name
      callbackArguments.shift();

      if (_hasCallbackFor.call(this, trigger)) {
        this.callbacks[trigger].forEach(function(cb) { cb.apply(that, callbackArguments); });
      }
    };

    /**
     * Write a debug message to console if debugging is enabled
     * 
     * @memberOf Veil
     * @private
     * @param {...mixed} - all arguments are handed to console.log
     */
    _debug = function _debug() {
      if (this.options.debug) {
        console.log.apply( console, Array.prototype.slice.call(arguments) );
      }
    };

    return {
      defaults: defaults,
      initialize: initialize,
      show: show,
      hide: hide,
      destroy: destroy,
      overlay: overlay,
      exists: exists,
      isActive: isActive,
      setContent: setContent,
      addCallback: addCallback
    };
  })();

  return Veil;
}));

/**
 * Callback called after the overlay markup has been created
 *
 * @callback afterCreateCallback
 * @this Veil
 *
 * @param {jQuery} overlayElement
 */

/**
 * Callback called after a overlay has been displayed
 *
 * @callback afterShowCallback
 * @this Veil
 *
 * @param {jQuery} overlayElement
 */