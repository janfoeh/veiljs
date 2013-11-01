/*global Veil, describe, xdescribe, it, xit, beforeEach, afterEach, expect, runs, waitsFor, spyOn, spyOnEvent */

describe("Veil", function() {
  "use strict";

  var veil;

  beforeEach(function() {
    
  });

  afterEach(function() {
    veil.destroy();
  });

  it("should be lazy and not create markup on initialization", function() {
    veil = new Veil();

    expect($('.veil-overlay').length).toEqual(0);
  });

  it("should create popover markup on show()", function() {
    veil = new Veil();
    veil.show();

    expect($('.veil-overlay').length).toEqual(1);
  });

  it("should mark popover as active on show()", function() {
    veil = new Veil();
    veil.show();

    expect($('.veil-overlay').hasClass('inactive')).toBeFalsy();
    expect($('.veil-overlay').hasClass('active')).toBeTruthy();
  });

  it("should mark popover as inactive on hide()", function() {
    veil = new Veil();
    veil.show();

    veil.hide();

    expect($('.veil-overlay').hasClass('active')).toBeFalsy();
    expect($('.veil-overlay').hasClass('inactive')).toBeTruthy();
  });

  it("should not remove popover markup on hide()", function() {
    veil = new Veil();
    veil.show();

    veil.hide();

    expect($('.veil-overlay').length).toEqual(1);
  });

  it("should remove the popover from DOM when destroyed", function() {
    veil = new Veil();
    veil.show();
    veil.destroy();

    expect($('.veil-overlay').length).toEqual(0);
  });

  it("should update existing markup when setContent is called", function() {
    veil = new Veil();
    veil.setContent("foo");
    veil.show();
    veil.hide();

    veil.setContent("bar");

    expect($('.veil-overlay').text()).toEqual("bar");
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
    it("should apply a provided CSS class to the popover", function() {
      veil = new Veil({overlayClass: 'additional-class-test'});
      veil.show();

      expect(veil.overlay().hasClass('additional-class-test')).toBeTruthy();
    });
  });
});