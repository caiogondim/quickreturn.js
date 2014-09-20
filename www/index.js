/* global QuickReturn */

;(function(window) { "use strict";

  var navbar = new QuickReturn(".navbar")
  navbar.init()

  window.document
    .addEventListener("click", function(ev) {
      if (ev.target.className === "navbar__back-to-top") {
        window.scrollTo(0, 0)
      }
    })

}(this));
