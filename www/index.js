/* global QuickReturn, document, hljs */

;(function(window) { "use strict";

  // QuickReturn
  var navbar = new QuickReturn(".navbar")
  navbar.init()

  // Highlight code blocks
  var codeBlocks = document.querySelectorAll("pre code")
  Array.prototype.forEach.call(codeBlocks, function(codeBlock) {
    hljs.highlightBlock(codeBlock)
  })

  // Event listener for "back to top" button on navbar
  document
    .addEventListener("click", function(ev) {
      if (ev.target.className === "btn navbar__back-to-top") {
        window.scrollTo(0, 0)
      }
    })

}(this));
