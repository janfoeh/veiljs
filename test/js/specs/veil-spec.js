/*global Veil, describe, xdescribe, it, xit, beforeEach, afterEach, expect, runs, waitsFor, spyOn, spyOnEvent */

describe("Veil", function() {
  "use strict";

  var veil,
      overlaySelector     = '.veil-overlay',
      backgroundSelector  = '.veil-background';

  beforeEach(function() {
    
  });

  afterEach(function() {
    veil.destroy();
    $(backgroundSelector).remove();
  });

  it("should be lazy and not create markup on initialization", function() {
    veil = new Veil();

    expect($(overlaySelector).length).toEqual(0);
  });

  it("should create overlay markup on show()", function() {
    veil = new Veil();
    veil.show();

    expect($(overlaySelector).length).toEqual(1);
  });

  it("should create background markup on show()", function() {
    veil = new Veil();
    veil.show();

    expect($(backgroundSelector).length).toEqual(1);
  });

  it("should create overlay markup when overlay() is accessed before show()", function() {
    veil = new Veil();
    veil.overlay();

    expect($(overlaySelector).length).toEqual(1);
  });

  it("should add the .activating and .active classes to the overlay on show()", function() {
    veil = new Veil();
    veil.show();

    expect($(overlaySelector).hasClass('inactive')).toBeFalsy();
    expect($(overlaySelector).hasClass('active')).toBeTruthy();
  });

  it("should mark background as active on show()", function() {
    veil = new Veil();
    veil.show();

    expect($(backgroundSelector).hasClass('inactive')).toBeFalsy();
    expect($(backgroundSelector).hasClass('active')).toBeTruthy();
  });

  it("should mark overlay as inactive on hide()", function() {
    veil = new Veil();
    veil.show();

    veil.hide();

    expect($(overlaySelector).hasClass('active')).toBeFalsy();
    expect($(overlaySelector).hasClass('inactive')).toBeTruthy();
  });

  it("should mark background as inactive on hide()", function() {
    veil = new Veil();
    veil.show();

    veil.hide();

    expect($(backgroundSelector).hasClass('active')).toBeFalsy();
    expect($(backgroundSelector).hasClass('inactive')).toBeTruthy();
  });

  it("should not remove overlay markup on hide()", function() {
    veil = new Veil();
    veil.show();

    veil.hide();

    expect($(overlaySelector).length).toEqual(1);
  });

  it("should remove the overlay and background from DOM when destroyed", function() {
    veil = new Veil();
    veil.show();
    veil.destroy();

    expect($(overlaySelector).length).toEqual(0);
    expect($(backgroundSelector).length).toEqual(0);
  });

  it("should update existing markup when setContent is called", function() {
    veil = new Veil();
    veil.setContent("foo");
    veil.show();
    veil.hide();

    veil.setContent("bar");

    expect($(overlaySelector).text()).toEqual("bar");
  });

  describe("callbacks", function() {
    it("should trigger the afterCreate callback after create, before show()", function() {
      var overlayVisible  = true,
          callbackFired   = false,
          callback        = function(overlay) { overlayVisible = overlay.hasClass('active'); callbackFired = true; };

      veil = new Veil({}, {afterCreate: callback});
      veil.show();

      expect(callbackFired).toBeTruthy();
      expect(overlayVisible).toBeFalsy();
    });

    it("should trigger the afterShow callback after show()", function() {
      var callbackFired = false,
          callback      = function() { callbackFired = true; };

      veil = new Veil({}, {afterShow: callback});
      veil.show();

      expect(callbackFired).toBeTruthy();
    });
  });

  describe("options", function() {
    it("should apply a provided CSS class to the overlay", function() {
      veil = new Veil({overlayClass: 'additional-class-test'});
      veil.show();

      expect(veil.overlay().hasClass('additional-class-test')).toBeTruthy();
    });

    it("should not create a background if backgroundMarkup is set to null", function() {
      veil = new Veil({backgroundMarkup: null});
      veil.show();

      expect($(backgroundSelector).length).toEqual(0);
    });

    it("should allow the background markup to be customized", function() {
      veil = new Veil({backgroundMarkup: '<div id="custom-background"></div>'});
      veil.show();

      expect($('#custom-background').length).toEqual(1);
      expect($(backgroundSelector).length).toEqual(0);
    });
  });
});