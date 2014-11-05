/* global window, document, requestAnimationFrame, exports */

;(function(exports) {
  "use strict";

  var cachedScrollY
  var scrollYLastPosition =  window.scrollY

  /**
    QuickReturn constructor
    @param {String} elSelector a CSS selector of the element to be manipulated.
   */
  function QuickReturn(elSelector) {
    // Returns a new object even if that constructor is called like a function.
    if (!(this instanceof QuickReturn)) {
      return new QuickReturn()
    }

    this._validateElSelector(elSelector)

    // Instance Properties
    // -------------------

    // Here is defined *all* properties used in the entire life of the object.

    // Cached DOM element we are manipulating.
    this._el = this._getEl(elSelector)

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
    this._saveCurStyle()

    this._createClone()
    this._hideClone()

    this._setupEl(this._el)

    this._bindScrollListener()

    return this
  }

  QuickReturn.prototype.destroy = function() {
    this._unbindScrollListener()
    this._recoversPrevStyle()

    return this
  }

  // Private
  // -------

  /**
    Validates the selector passed as argument. Throws an error if it is
    invalid.

    @param {String} elSelector
   */
  QuickReturn.prototype._validateElSelector = function(elSelector) {
    // There should be only one DOM node that matches with the selector.
    if (document.querySelectorAll(elSelector) > 1) {
      throw new Error("There is more than one DOM node that matches with " +
                      "the selector passed as argument.")
    }

    // There must exist one, and only one, DOM node that matches with the
    // selector.
    if (document.querySelector(elSelector) === null) {
      throw new Error(
        "There is no DOM node that matches the passed selector."
      )
    }
  }

  /**
    Returns DOM node that matches the selector passed as argument.

    @param {String} selector
    @return {HTML Element}
   */
  QuickReturn.prototype._getEl = function(selector) {
    var el = document.querySelector(selector)

    return el
  }

  QuickReturn.prototype._createClone = function() {
    this._elClone = this._el.cloneNode(true)
    this._elClone = this._el.parentNode.insertBefore(this._elClone, this._el)
  }

  QuickReturn.prototype._hideClone = function() {
    this._elClone.style.display = "none"
  }

  QuickReturn.prototype._showClone = function() {
    this._elClone.style.display = this._originalStyle.display
  }

  QuickReturn.prototype._saveCurStyle = function() {
    this._originalStyle = {
      top: this._el.style.top,
      position: this._el.style.position,
      display: this._el.style.display
    }
  }

  QuickReturn.prototype._recoversPrevStyle = function() {
    this._el.style.top = this._originalStyle.top
    this._el.style.position = this._originalStyle.position
  }

  QuickReturn.prototype._getTopZindex = function() {
    var els = document.querySelectorAll("*")
    var topZindex = 0

    Array.prototype.forEach.call(els, function(el) {
      var elZindex = parseInt(el.style.zIndex, 10)
      if (elZindex > topZindex) {
        topZindex = elZindex
      }
    })

    return topZindex
  }

  QuickReturn.prototype._setupEl = function(el) {
    el.className = el.className + " quickreturn"
    el.style.zIndex = this._getTopZindex() + 1
  }

  QuickReturn.prototype._bindScrollListener = function() {
    this._rAFscrollhandler = this._rAFscrollhandler.bind(this)
    this._vanillaScrollHandler = this._vanillaScrollHandler.bind(this)

    if (window.requestAnimationFrame) {
      window.addEventListener("scroll", this._rAFscrollhandler)
    } else {
      window.addEventListener("scroll", this._vanillaScrollHandler)
    }
  }

  QuickReturn.prototype._unbindScrollListener = function() {
    window.removeEventListener("scroll", this._rAFscrollhandler)
    window.removeEventListener("scroll", this._vanillaScrollHandler)
  }

  QuickReturn.prototype._vanillaScrollHandler = function() {
    // Cache `window.scrollY` to not force a layout (reflow)
    cachedScrollY = window.scrollY

    if (this._shouldUpdatePosition(cachedScrollY, scrollYLastPosition)) {
      this._updatePosition()
    }
  }

  /**
    Does some verifications if the navbar should have its position updated.
    Returns `true` if it has to be updated; `false` otherwise.

    @param {Integer} cachedScrollY
    @param {Integer} scrollYLastPosition
    @return {Boolean}
   */
  QuickReturn.prototype._shouldUpdatePosition = function(cachedScrollY,
                                                         scrollYLastPosition) {
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
  QuickReturn.prototype._isScrollingUp = function(scrollY,
                                                  scrollYLastPosition) {
    var bool = null

    if (scrollY > scrollYLastPosition) {
      bool = false
    } else if (scrollY < scrollYLastPosition) {
      bool = true
    }

    return bool
  }

  /**
    The opposite of `this._isScrollingUp`. Just a convenience function.

    @param {Integer]} scrollY
    @param {Integer} scrollYLastPosition
    @return {Boolean} Returns `true` if is scrolling up, `false` if is
      scrolling down.
   */
  QuickReturn.prototype._isScrollingDown = function(scrollY,
                                                    scrollYLastPosition) {
    return !this._isScrollingUp(scrollY, scrollYLastPosition)
  }

  QuickReturn.prototype._isFullyInViewport = function(el) {
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
  QuickReturn.prototype._isPartiallyInViewport = function(el) {
    var rect = el.getBoundingClientRect()
    var documentHeight = window.innerHeight ||
                         document.documentElement.clientHeight

    return (
      (rect.top > 0 && rect.top < documentHeight) ||
      (rect.bottom > 0 && rect.bottom < documentHeight)
    )
  }

  QuickReturn.prototype._updatePosition = function() {
    // TODO: only touch the DOM when needed
    if (cachedScrollY <= this._elOffsetTop) {
      this._recoversPrevStyle()
      this._hideClone()
    } else if (this._isScrollingUp(cachedScrollY, scrollYLastPosition) &&
               this._isFullyInViewport(this._el)) {
      this._el.style.position = "fixed"
      this._el.style.top = 0
      this._showClone()
    } else if (this._isScrollingUp(cachedScrollY, scrollYLastPosition) &&
               !this._isPartiallyInViewport(this._el)) {
      this._el.style.position = "absolute"
      this._el.style.top = "" + (cachedScrollY - this._el.offsetHeight) + "px"
      this._showClone()
    } else if (this._isScrollingDown(cachedScrollY, scrollYLastPosition) &&
               this._isFullyInViewport(this._el) &&
               cachedScrollY > this._elOffsetTop) {
      this._el.style.position = "absolute"
      this._el.style.top = cachedScrollY + "px"
      this._showClone()
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
  QuickReturn.prototype._rAFscrollhandler = function() {
    cachedScrollY = window.scrollY

    if (!this._isTicking &&
        this._shouldUpdatePosition(cachedScrollY, scrollYLastPosition)) {
      requestAnimationFrame(this._updatePosition.bind(this))
      this._isTicking = true
    }
  }

  exports.QuickReturn = QuickReturn
}(typeof exports === "object" && exports || this))
