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
   */
  function Veil(options, callbacks) {
    var that = this;

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

  Veil.prototype = (function() {

    var defaults,
        addCallback,
        _hasCallbackFor,
        _executeCallbacksFor,
        _debug;

    defaults = {
      debug: true
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
      addCallback: addCallback
    };
  })();

  return Veil;
}));