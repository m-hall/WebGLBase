/*global requestAnimationFrame, View  */

/**
 * Main Loop Controller
 */
var Loop = (function () {
    "use strict";

    return {
        time: Date.now(),
        delta: 0,
        frameRequested: false,
        keepRendering: false,

        /**
         * Requests a render frame
         */
        requestFrame: function () {
            if (!Loop.frameRequested) {
                Loop.time = Date.now();
                requestAnimationFrame(Loop.frame);
                Loop.frameRequested = true;
            }
        },
        /**
         * Runs a single frame
         */
        frame: function () {
            var oldTime = Loop.time,
                delta;
            Loop.time = Date.now();
            delta = Loop.time - oldTime;
            Loop.delta = delta;
            Loop.frameRequested = false;

            View.get().render(delta);
            Loop.delta = 0;
            if (Loop.keepRendering) {
                Loop.requestFrame();
            }
        }
    };
}());