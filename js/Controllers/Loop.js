/*global requestAnimationFrame, View  */

/**
 * Main Loop Controller
 */
var Loop = (function () {
    "use strict";

    return {
        time: new Date().getTime(),
        delta: 0,
        frameRequested: false,

        /**
         * Requests a render frame
         */
        requestFrame: function () {
            if (!Loop.frameRequested) {
                Loop.time = Util.now();
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
            Loop.time = Util.now();
            delta = Loop.time - oldTime;
            Loop.delta = delta;
            Loop.frameRequested = false;

            View.get().render(delta);
            Loop.delta = 0;
        }
    };
}());