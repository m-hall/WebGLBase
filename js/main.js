/*global Loop, View  */


/*** Main.js ***/
(function () {
    "use strict";

    /**
     * Initializes the base component for the application
     */
    function initialize() {
        Mouse.init();
        Keyboard.init();
        Touch.init();
        GL.init();

        Event.listen('resize', Loop.requestFrame.bind(Loop));
    }

    /**
     * Runs the main application
     */
    function main() {
        initialize();
        View.set('Menu');
        Loop.requestFrame();
    }

    window.addEventListener('load', main, false);
}());