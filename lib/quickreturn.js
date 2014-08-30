;(function(exports) {
  "use strict";

  var cachedScrollY;
  var scrollYLastPosition =  window.scrollY;
  var isTicking = false;

  function QuickReturn(args) {
    // Enforces `new`
    if (!(this instanceof QuickReturn)) {
      return new QuickReturn();
    }

    this.el = args.el;

    this.$el = document.querySelector(this.el);
  }

  QuickReturn.prototype.init = function() {
    saveCurStyle.call(this);
    bindScrollListener.call(this);
  };

  QuickReturn.prototype.destroy = function() {
    unbindScrollListener.call(this);
    recoversPrevStyle.call(this);
  };

  function saveCurStyle() {
    /* jshint validthis:true */

    this._prevStyle = {
      top: this.$el.style.top,
      position: this.$el.style.position
    };
  }

  function recoversPrevStyle() {
    /* jshint validthis:true */

    this.$el.style.top = this._prevStyle.top;
    this.$el.style.position = this._prevStyle.position;
  }

  function bindScrollListener() {
    /* jshint validthis:true */

    rAFscrollhandler = rAFscrollhandler.bind(this);
    vanillaScrollHandler = vanillaScrollHandler.bind(this);

    if (window.requestAnimationFrame) {
      window.addEventListener("scroll", rAFscrollhandler);
    } else {
      window.addEventListener("scroll", vanillaScrollHandler);
    }
  }

  function unbindScrollListener() {
    /* jshint validthis:true */

    window.removeEventListener("scroll", rAFscrollhandler);
    window.removeEventListener("scroll", vanillaScrollHandler);
  }

  function vanillaScrollHandler(ev) {
    /* jshint validthis:true */

    // Cache `window.scrollY` to not force a layout (reflow)
    cachedScrollY = window.scrollY;

    if (shouldUpdatePosition()) {
      updatePosition.call(this);
    }
  }

  function shouldUpdatePosition(cachedScrollY, scrollYLastPosition) {
    // Ignores "elastic scrolling"
    if (cachedScrollY < 0 || cachedScrollY > (document.body.clientHeight - window.innerHeight)) {
      return false;
    }

    // Case we did not scrolled more than 1px, do nothing
    if (cachedScrollY === scrollYLastPosition) {
      return false;
    }

    return true;
  }

  function isScrollingUp(scrollY, scrollYLastPosition) {
    var bool = null;

    if (scrollY > scrollYLastPosition) {
      bool = false;
    } else if (scrollY < scrollYLastPosition) {
      bool = true;
    }

    return bool;
  }

  function isScrollingDown(scrollY, scrollYLastPosition) {
    return !isScrollingUp(scrollY, scrollYLastPosition);
  }

  function isFullyInViewport(el) {
    var rect = el.getBoundingClientRect();

    return (
      rect.top >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
    );
  }

  function isPartiallyInViewport(el) {
    var rect = el.getBoundingClientRect();

    return (
      (rect.top > 0 && rect.top < (window.innerHeight || document.documentElement.clientHeight)) ||
      (rect.bottom > 0 && rect.bottom < (window.innerHeight || document.documentElement.clientHeight))
    );
  }

  function updatePosition() {
    /* jshint validthis:true */

    if (isScrollingUp(cachedScrollY, scrollYLastPosition) && isFullyInViewport(this.$el)) {
      this.$el.style.position = "fixed";
      this.$el.style.top = 0;
    } else if (isScrollingUp(cachedScrollY, scrollYLastPosition) && !isPartiallyInViewport(this.$el)) {
      this.$el.style.position = "absolute";
      this.$el.style.top = "" + (scrollY - this.$el.offsetHeight) + "px";
    } else if (isScrollingDown(cachedScrollY, scrollYLastPosition) && isFullyInViewport(this.$el)) {
      this.$el.style.position = "absolute";
      this.$el.style.top = scrollY + "px";
    } else if (isScrollingDown(cachedScrollY, scrollYLastPosition) && !isPartiallyInViewport(this.$el)) {

    }

    isTicking = false;
    scrollYLastPosition = window.scrollY;
  }

  function rAFscrollhandler(ev) {
    /* jshint validthis:true */

    cachedScrollY = window.scrollY;

    if (!isTicking && shouldUpdatePosition(cachedScrollY, scrollYLastPosition)) {
      requestAnimationFrame(updatePosition.bind(this));
      isTicking = true;
    }
  }

  exports.QuickReturn = QuickReturn;

}(typeof exports === "object" && exports || this));
