/*global Veil, SpecHelper, describe, xdescribe, it, xit, beforeEach, afterEach, expect, runs, waitsFor, spyOn, spyOnEvent */

describe("Veil", function() {
  "use strict";

  var veil,
      overlaySelector   = '.veil-overlay',
      backdropSelector  = '.veil-backdrop';

  beforeEach(function() {
    
  });

  afterEach(function() {
    veil.destroy();
    if (Veil.backdropExists()) {
      Veil.$backdrop.remove();
      Veil.$backdrop = null;
    }
  });

  describe("overlay markup", function() {
    it("should be lazy and not create markup on initialization", function() {
      veil = new Veil();

      expect($(overlaySelector).length).toEqual(0);
    });

    it("should create overlay markup on show()", function() {
      veil = new Veil();
      veil.show();

      expect($(overlaySelector).length).toEqual(1);
    });

    it("should create overlay markup when overlay() is accessed before show()", function() {
      veil = new Veil();
      veil.overlay();

      expect($(overlaySelector).length).toEqual(1);
    });

    it("should not remove overlay markup on hide()", function() {
      veil = new Veil();
      veil.show();

      veil.hide();

      expect($(overlaySelector).length).toEqual(1);
    });

    it("should remove the overlay from DOM on destroy()", function() {
      veil = new Veil();
      veil.show();
      veil.destroy();

      expect($(overlaySelector).length).toEqual(0);
    });
  });

  describe("backdrop markup", function() {
    it("should be created on show()", function() {
      veil = new Veil();
      veil.show();

      expect($(backdropSelector).length).toEqual(1);
    });

    it("should only be created once for multiple overlays", function() {
      var veil2;

      veil = new Veil();
      veil.show();

      veil2 = new Veil();
      veil2.show();

      expect($(backdropSelector).length).toEqual(1);

      veil2.destroy();
    });

    it("should not be removed from DOM when the last instance if destroyed", function() {
      veil = new Veil();
      veil.show();
      veil.destroy();

      expect($(backdropSelector).length).toEqual(1);
    });
  });

  describe("content", function() {
    it("should update existing markup when setContent is called", function() {
      veil = new Veil();
      veil.setContent("foo");
      veil.show();
      veil.hide();

      veil.setContent("bar");

      expect($(overlaySelector).text()).toEqual("bar");
    });
  });

  // Testing whether the visibility classes .activating, .active and .deactivating are applied
  // correctly is a little bit more involved. Both .activating and .deactivating are only applied
  // temporarily, so we attach a DOM mutation observer to see whether that happened.

  describe("visibility css classes lifecycle", function() {
    var globalOptionsBackup = Veil.globalOptions;

    afterEach(function() {
      Veil.globalOptions = globalOptionsBackup;
    });

    it("should add .activating and .active to the overlay on show()", function() {
      var hasActivatingClass  = false,
          hasActiveClass      = false,
          classChangeCounter  = 0,
          overlay,
          observer;

      runs(function() {
        veil    = new Veil();
        overlay = veil.overlay();

        observer = SpecHelper.onClassChange(overlay, function(target){
          classChangeCounter += 1;

          if (target.hasClass('activating')) {
            hasActivatingClass = true;
          }

          if (target.hasClass('active')) {
            hasActiveClass = true;
          }
        });

        veil.show();
      });

      waitsFor(function() {
        return classChangeCounter >= 2;
      }, "The overlays class should have mutated twice", 100);

      runs(function() {
        observer.disconnect();
        expect(hasActivatingClass).toBeTruthy();
        expect(hasActiveClass).toBeTruthy();
      });
    });

    it("should add .deactivating to the overlay on hide(), then remove all visibility classes after the transition is finished", function() {
      var hasDeactivatingClass      = false,
          classChangeCounter        = 0,
          waitForTransitionComplete = false,
          overlay,
          observer;

      runs(function() {
        veil    = new Veil({overlayClass: 'transition-test'});
        overlay = veil.overlay();
        veil.show();
      });

      waitsFor(function() {
        return veil.overlay().hasClass('active');
      }, "Veil should have become active", 100);

      runs(function() {
        observer = SpecHelper.onClassChange(overlay, function(target){
          classChangeCounter += 1;

          if (target.hasClass('deactivating')) {
            hasDeactivatingClass = true;
          }
        });

        veil.hide();
      });

      waitsFor(function() {
        return classChangeCounter >= 1;
      }, "The overlays class should have mutated", 100);

      runs(function() {
        observer.disconnect();

        expect(hasDeactivatingClass).toBeTruthy();
        expect($(overlaySelector).hasClass('active')).toBeFalsy();

        setTimeout(function() {
          waitForTransitionComplete = true;
        }, 850);
      });

      waitsFor(function() {
        return waitForTransitionComplete;
      }, "The wait flag should have been triggered", 1000);

      runs(function() {
        expect($(overlaySelector).hasClass('deactivating')).toBeFalsy();
      });
    });

    it("should add .activating and .active to the backdrop on show()", function() {
      var hasActivatingClass  = false,
          hasActiveClass      = false,
          classChangeCounter  = 0,
          backdrop,
          observer;

      runs(function() {
        veil = new Veil();

        // create the backdrop manually
        Veil.$backdrop = $(Veil.globalOptions.backdropMarkup);
        $('body').append(Veil.$backdrop);

        observer = SpecHelper.onClassChange(Veil.$backdrop, function(target){
          classChangeCounter += 1;

          if (target.hasClass('activating')) {
            hasActivatingClass = true;
          }

          if (target.hasClass('active')) {
            hasActiveClass = true;
          }
        });

        veil.show();
      });

      waitsFor(function() {
        return classChangeCounter >= 2;
      }, "The overlays class should have mutated twice", 100);

      runs(function() {
        observer.disconnect();
        expect(hasActivatingClass).toBeTruthy();
        expect(hasActiveClass).toBeTruthy();
      });
    });

    it("should add .deactivating to the backdrop on hide(), then remove all visibility classes after the transition is finished", function() {
      var hasDeactivatingClass      = false,
          classChangeCounter        = 0,
          waitForTransitionComplete = false,
          backdrop,
          observer;

      Veil.globalOptions.backdropMarkup = "<div class='veil-backdrop transition-test'></div>";

      runs(function() {
        veil      = new Veil();
        veil.show();
      });

      waitsFor(function() {
        return Veil.$backdrop.hasClass('active');
      }, "Veil should have become active", 100);

      runs(function() {
        observer = SpecHelper.onClassChange(Veil.$backdrop, function(target){
          classChangeCounter += 1;

          if (target.hasClass('deactivating')) {
            hasDeactivatingClass = true;
          }
        });

        veil.hide();
      });

      waitsFor(function() {
        return classChangeCounter >= 1;
      }, "The backdrops' class should have mutated", 100);

      runs(function() {
        observer.disconnect();

        expect(hasDeactivatingClass).toBeTruthy();
        expect($(backdropSelector).hasClass('active')).toBeFalsy();

        setTimeout(function() {
          waitForTransitionComplete = true;
        }, 750);
      });

      waitsFor(function() {
        return waitForTransitionComplete;
      }, "The wait flag should have been triggered", 1000);

      runs(function() {
        expect($(backdropSelector).hasClass('deactivating')).toBeFalsy();
      });
    });
  });

  describe("callbacks", function() {
    it("should trigger afterCreate after create, before show()", function() {
      var overlayVisible  = true,
          callbackFired   = false,
          callback        = function(overlay) { overlayVisible = overlay.hasClass('active'); callbackFired = true; };

      veil = new Veil({}, {afterCreate: callback});
      veil.show();

      expect(callbackFired).toBeTruthy();
      expect(overlayVisible).toBeFalsy();
    });

    it("should trigger afterShow after show()", function() {
      var callbackFired = false,
          callback      = function() { callbackFired = true; };

      veil = new Veil({}, {afterShow: callback});
      veil.show();

      expect(callbackFired).toBeTruthy();
    });
  });

  describe("global options", function() {
    var globalOptionsBackup = Veil.globalOptions;

    afterEach(function() {
      Veil.globalOptions = globalOptionsBackup;
    });

    it("backdropMarkup: null should disable the backdrop", function() {
      Veil.globalOptions.backdropMarkup = null;

      veil = new Veil();
      veil.show();

      expect($(backdropSelector).length).toEqual(0);
    });

    it("backdropMarkup should allow the backdrop markup to be customized", function() {
      Veil.globalOptions.backdropMarkup = '<div id="custom-backdrop"></div>';
      veil = new Veil();
      veil.show();

      expect($('#custom-backdrop').length).toEqual(1);
      expect($(backdropSelector).length).toEqual(0);
    });
  });

  describe("options", function() {
    it("overlayClass should apply a provided CSS class to the overlay", function() {
      veil = new Veil({overlayClass: 'additional-class-test'});
      veil.show();

      expect(veil.overlay().hasClass('additional-class-test')).toBeTruthy();
    });
  });
});