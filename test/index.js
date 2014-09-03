/* global module */

module.exports = {
  "Navbar without offset" : function (client) {
    "use strict";

    // Navbar should be visible on scrollY === 0
    client
      .url("http://localhost:8000/examples/index.html")
      .moveToElement("body", 0, 0)
      .assert.hidden(".navbar")
      
    // Navbar should be hidden on scrollY > navbar.height
    client
      .url("http://localhost:8000/examples/index.html")
      .moveToElement("body", 0, 500)
      .assert.hidden(".navbar")

    // Navbar should be visible on scrollY to 0, scrollY to 500 and back to 100.
    client
      .url("http://localhost:8000/examples/index.html")
      .moveToElement("body", 0, 0)
      .moveToElement("body", 0, 500)
      .moveToElement("body", 0, 100)
      .assert.visible(".quickreturn")
      .end()    
  }
}
