;(function() {
  "use strict";

  function QuickReturn(opts) {
    this.el = opts.el;

    this._scrollLastPos = window.scrollY;
    this.$el = document.querySelector(this.el);
  }

  QuickReturn.prototype.init = function() {
    var self = this;
    this._lastScrollHandlerCall = 0;

    this.bindScrollListener();
  };

  QuickReturn.prototype.bindScrollListener = function() {
    window.addEventListener("scroll", this.scrollHandler.bind(this));
  };

  QuickReturn.prototype.scrollHandler = function(ev) {
    // Cache `window.scrollY` to not force a layout (reflow)
    var scrollY = window.scrollY;

    // In OS X, with "elastic scroll" enabled, the scrolling can get values
    // below 0
    if (scrollY < 0) {
      return;
    }

    // Case we did not scrolled more than 1px, do nothing
    if (scrollY === this._scrollLastPos) {
      return;
    }

    this._updatePosition();

    // Renew cached variables
    this._scrollLastPos = scrollY;
    this._lastScrollHandlerCall = (new Date()).getTime();
  };

  QuickReturn.prototype._isScrollingUp = function() {
    var bool = null;

    if (window.scrollY > this._scrollLastPos) {
      bool = false;
    } else if (window.scrollY < this._scrollLastPos) {
      bool = true;
    }

    return bool;
  };

  QuickReturn.prototype._isScrollingDown = function() {
    return !this._isScrollingUp();
  };

  QuickReturn.prototype._isFullyInViewport = function() {
    var rect = this.$el.getBoundingClientRect();

    var isFullyInViewport = (
        rect.top >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
    );


    return isFullyInViewport;
  };

  QuickReturn.prototype._isPartiallyInViewport = function() {
    var rect = this.$el.getBoundingClientRect();

    var isPartiallyInViewport = (
        (rect.top > 0 && rect.top < (window.innerHeight || document.documentElement.clientHeight)) ||
        (rect.bottom > 0 && rect.bottom < (window.innerHeight || document.documentElement.clientHeight))
    );

    return isPartiallyInViewport;
  };

  QuickReturn.prototype._updatePosition = function() {
    if (this._isScrollingUp() && this._isFullyInViewport()) {
      this.$el.style.position = "fixed";
      this.$el.style.top = 0;
    } else if (this._isScrollingUp() && !this._isPartiallyInViewport()) {
      this.$el.style.position = "absolute";
      this.$el.style.top = "" + (scrollY - this.$el.offsetHeight + 1) + "px";
    } else if (this._isScrollingDown() && this._isFullyInViewport()) {
      this.$el.style.position = "absolute";
      this.$el.style.top = scrollY + "px";
    } else if (this._isScrollingDown() && !this._isPartiallyInViewport()) {

    }
  };

  window.QuickReturn = QuickReturn;
}());

