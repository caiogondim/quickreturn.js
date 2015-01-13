/* global window, document, requestAnimationFrame, exports, HTMLElement */

;(function(exports) {
  "use strict";

  var cachedScrollY
  var scrollYLastPosition =  window.scrollY

  /**
    QuickReturn constructor
    @param {String} elSelector a CSS selector of the element to be manipulated.
   */
  function QuickReturn(args) {
    // Returns a new object even if that constructor is called like a function.
    if (!(this instanceof QuickReturn)) {
      return new QuickReturn()
    }

    validateEl(args.el)

    // Instance Properties
    // -------------------

    // Here is defined *all* properties used in the entire life of the object.

    // Cached DOM element we are manipulating.
    this._el = args.el

    // Original offset top from DOM node.
    this._elOffsetTop = this._el.offsetTop

    // Cached DOM element we cloned.
    this._elClone = null

    // Original CSS of the element before initialization of QuickReturn object.
    this._originalStyle = null

    // True if the animation frame was requested and the computation
    // has not finished.
    this._isTicking = false

    // Explicitly returns the new object.
    return this
  }

  // Public
  // ------

  QuickReturn.prototype.init = function() {
    saveCurStyle.call(this)

    createClone.call(this)
    hideClone.call(this)

    setupEl.call(this, this._el)

    bindScrollListener.call(this)

    return this
  }

  QuickReturn.prototype.destroy = function() {
    unbindScrollListener.call(this)
    recoversPrevStyle.call(this)

    return this
  }

  // Private
  // -------

  /**
    Validates the DOM node passed as argument. Throws an error if it is
    invalid.

    @param {String} elSelector
   */
  function validateEl(el) {
    if (!(el instanceof HTMLElement)) {
      throw new Error(
        "The argument `el` argument is not an HTMLElement"
      )
    }
  }

  function createClone() {
    /* jshint validthis:true */
    this._elClone = this._el.cloneNode(true)
    this._elClone = this._el.parentNode.insertBefore(this._elClone, this._el)
  }

  function hideClone() {
    /* jshint validthis:true */
    this._elClone.style.display = "none"
  }

  function showClone() {
    /* jshint validthis:true */
    this._elClone.style.display = this._originalStyle.display
  }

  function saveCurStyle() {
    /* jshint validthis:true */
    this._originalStyle = {
      top: this._el.style.top,
      position: this._el.style.position,
      display: this._el.style.display
    }
  }

  function recoversPrevStyle() {
    /* jshint validthis:true */
    this._el.style.top = this._originalStyle.top
    this._el.style.position = this._originalStyle.position
  }

  function getTopZindex(subTree) {
    var els = subTree.querySelectorAll("*")
    var topZindex = 0

    Array.prototype.forEach.call(els, function(el) {
      var style = window.getComputedStyle(el)
      var elZindex = parseInt(style["z-index"], 10)
      if (!isNaN(elZindex) && elZindex > topZindex) {
        topZindex = elZindex
      }
    })

    return topZindex
  }

  function setupEl(el) {
    el.className = el.className + " quickreturn"
    el.style.zIndex = getTopZindex(window.document) + 1
  }

  function bindScrollListener() {
    /* jshint validthis:true */
    this._rAFscrollhandler = rAFscrollhandler.bind(this)
    this._vanillaScrollHandler = vanillaScrollHandler.bind(this)

    if (window.requestAnimationFrame) {
      window.addEventListener("scroll", this._rAFscrollhandler)
    } else {
      window.addEventListener("scroll", this._vanillaScrollHandler)
    }
  }

  function unbindScrollListener() {
    /* jshint validthis:true */
    window.removeEventListener("scroll", this._rAFscrollhandler)
    window.removeEventListener("scroll", this._vanillaScrollHandler)
  }

  function vanillaScrollHandler() {
    /* jshint validthis:true */

    // Cache `window.scrollY` to not force a layout (reflow)
    cachedScrollY = window.scrollY

    if (shouldUpdatePosition.call(this, cachedScrollY, scrollYLastPosition)) {
      updatePosition.call(this)
    }
  }

  /**
    Does some verifications if the navbar should have its position updated.
    Returns `true` if it has to be updated; `false` otherwise.

    @param {Integer} cachedScrollY
    @param {Integer} scrollYLastPosition
    @return {Boolean}
   */
  function shouldUpdatePosition(cachedScrollY, scrollYLastPosition) {
    // Ignores "elastic scrolling"
    if (cachedScrollY < 0 ||
        cachedScrollY > (document.body.clientHeight - window.innerHeight)) {
      return false
    }

    // Case we did not scrolled more than 1px, do nothing
    if (cachedScrollY === scrollYLastPosition) {
      return false
    }

    return true
  }

  /**
    Checks if the user is scrolling up.

    @param {Integer} scrollY Current scrollY position
    @param {Integer} scrollYLastPosition Last scrollY position
    @return {Boolean} Returns `true` if is scrolling up, `false` if is
      scrolling down.
   */
  function isScrollingUp(scrollY, scrollYLastPosition) {
    var bool = null

    if (scrollY > scrollYLastPosition) {
      bool = false
    } else if (scrollY < scrollYLastPosition) {
      bool = true
    }

    return bool
  }

  /**
    The opposite of `isScrollingUp`. Just a convenience function.

    @param {Integer]} scrollY
    @param {Integer} scrollYLastPosition
    @return {Boolean} Returns `true` if is scrolling up, `false` if is
      scrolling down.
   */
  function isScrollingDown(scrollY, scrollYLastPosition) {
    return !isScrollingUp(scrollY, scrollYLastPosition)
  }

  function isFullyInViewport(el) {
    var rect = el.getBoundingClientRect()
    var documentHeight = window.innerHeight ||
                         document.documentElement.clientHeight

    return (
      rect.top >= 0 &&
      rect.bottom <= (documentHeight)
    )
  }

  /**
    Returns `true` if the `el` is partially visible; `false` otherwise.

    @param  {HTML Element} el
    @return {Boolean}
   */
  function isPartiallyInViewport(el) {
    var rect = el.getBoundingClientRect()
    var documentHeight = window.innerHeight ||
                         document.documentElement.clientHeight

    return (
      (rect.top > 0 && rect.top < documentHeight) ||
      (rect.bottom > 0 && rect.bottom < documentHeight)
    )
  }

  function updatePosition() {
    /* jshint validthis:true */

    // TODO: only touch the DOM when needed
    if (cachedScrollY <= this._elOffsetTop) {
      recoversPrevStyle.call(this)
      hideClone.call(this)
    } else if (isScrollingUp(cachedScrollY, scrollYLastPosition) &&
               isFullyInViewport(this._el)) {
      this._el.style.position = "fixed"
      this._el.style.top = 0
      showClone.call(this)
    } else if (isScrollingUp(cachedScrollY, scrollYLastPosition) &&
               !isPartiallyInViewport(this._el)) {
      this._el.style.position = "absolute"
      this._el.style.top = "" + (cachedScrollY - this._el.offsetHeight) + "px"
      showClone.call(this)
    } else if (isScrollingDown(cachedScrollY, scrollYLastPosition) &&
               isFullyInViewport(this._el) &&
               cachedScrollY > this._elOffsetTop) {
      this._el.style.position = "absolute"
      this._el.style.top = cachedScrollY + "px"
      showClone.call(this)
    }

    // Updates `scrollYLastPosition` with current value.
    scrollYLastPosition = window.scrollY

    // Now we allow another `_rAFscrollhandler` to be called.
    this._isTicking = false
  }

  /**
    `requestAnimationFrame`, or rAF, scroll handler.
    Every scroll event, it verify if the element `_shouldUpdatePosition`
    and if it is not `_ticking` already. If not, it `requestAnimationFrame` and
    sets `_isTicking` to `false`.
   */
  function rAFscrollhandler() {
    /* jshint validthis:true */
    cachedScrollY = window.scrollY

    if (!this._isTicking &&
        shouldUpdatePosition.call(this, cachedScrollY, scrollYLastPosition)) {
      requestAnimationFrame(updatePosition.bind(this))
      this._isTicking = true
    }
  }

  exports.QuickReturn = QuickReturn
}(typeof exports === "object" && exports || this))
