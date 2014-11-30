/**
 * Touch API
 * @return {Object} Public Touch API.
 */
var Touch = (function () {
    "use strict";

    var exports = {};
    exports.touches = {};

    /**
     * Updates the touch state variables when a new touch is started
     * @param  {DOMEvent} e  A DOM touch event
     * @return {false}       False to prevent default browser action
     */
    function handleStart(e) {
        var i,
            l,
            touch,
            change = {};
        for (i = 0, l = e.changedTouches.length; i < l; i++) {
            touch = e.changedTouches[i];
            change[touch.identifier] = {
                x: touch.pageX,
                y: window.innerHeight - touch.pageY
            };
            exports.touches[touch.identifier] = change[touch.identifier];
        }
        Event.fire('touch', change);
        Event.fire('touchEvent', change);
        return Util.preventAction(e);
    }

    /**
     * Updates the touch state variables when a touch is released.
     * @param  {DOMEvent} e  A DOM touch event
     * @return {false}       False to prevent default browser action
     */
    function handleEnd(e) {
        var i,
            l,
            touch,
            change = {};
        for (i = 0, l = e.changedTouches.length; i < l; i++) {
            touch = e.changedTouches[i];
            change[touch.identifier] = {
                x: touch.pageX,
                y: window.innerHeight - touch.pageY,
                ended: true
            };
            delete exports.touches[touch.identifier];
        }
        Event.fire('touch', change);
        Event.fire('touchEvent', change);
        return Util.preventAction(e);
    }

    /**
     * Updates the touch state variables when a touch moves.
     * @param  {DOMEvent} e  A DOM touch event.
     * @return {false}       False to prevent default browser action
     */
    function handleMove(e) {
        var i,
            l,
            touch,
            change = {};
        for (i = 0, l = e.changedTouches.length; i < l; i++) {
            touch = e.changedTouches[i];
            change[touch.identifier] = {
                x: touch.pageX,
                y: window.innerHeight - touch.pageY
            };
            exports.touches[touch.identifier].x = change[touch.identifier].x;
            exports.touches[touch.identifier].y = window.innerHeight - change[touch.identifier].y;
        }
        Event.fire('touchMove', change);
        Event.fire('touchEvent', change);
        return Util.preventAction(e);
    }

    /**
     * Sets up the DOMEvent listeners
     */
    function init() {
        window.addEventListener("touchstart", handleStart, false);
        window.addEventListener("touchend", handleEnd, false);
        window.addEventListener("touchmove", handleMove, false);
    }
    exports.init = init;
    return exports;
}());