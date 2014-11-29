/**
 * Mouse API
 * @return {Object} Public Mouse API.
 */
var Mouse = (function () {
    "use strict";

    var exports = {
        x: 0,
        y: 0,
        left: false,
        middle: false,
        right: false
    };

    /**
     * Updates the mouse state variables when a mouse button is pressed.
     * @param  {DOMEvent} e  A DOM mouse event
     * @return {false}       False to prevent default browser action
     */
    function handleDown(e) {
        var change = {};
        if (e.button === 0) {
            exports.left = true;
            change.left = true;
        } else if (e.button === 1) {
            exports.middle = true;
            change.middle = true;
        } else if (e.button === 2) {
            exports.right = true;
            change.right = true;
        }
        Event.fire('mouseButton', change);
        Event.fire('mouseEvent', change);
        return Util.preventAction(e);
    }

    /**
     * Updates the mouse state variables when a mouse button is released.
     * @param  {DOMEvent} e  A DOM mouse event
     * @return {false}       False to prevent default browser action
     */
    function handleUp(e) {
        var change = {};
        if (e.button === 0) {
            exports.left = false;
            change.left = false;
        } else if (e.button === 1) {
            exports.middle = false;
            change.middle = false;
        } else if (e.button === 2) {
            exports.right = false;
            change.right = false;
        }
        Event.fire('mouseButton', change);
        Event.fire('mouseEvent', change);
        return Util.preventAction(e);
    }

    /**
     * Updates the mouse state variables when the mouse moves.
     * @param  {DOMEvent} e  A DOM mouse event.
     */
    function handleMove(e) {
        var change = {};
        change.x = e.pageX - exports.x;
        change.y = window.innerHeight - e.pageY - exports.y;
        exports.x = e.pageX;
        exports.y = window.innerHeight - e.pageY;
        Event.fire('mouseMove', change);
        Event.fire('mouseEvent', change);
    }

    /**
     * Sets up the DOMEvent listeners
     */
    function init() {
        window.addEventListener("mousedown", handleDown, false);
        window.addEventListener("mouseup", handleUp, false);
        window.addEventListener("mousemove", handleMove, false);

        window.addEventListener("mousewheel", Util.preventAction, false);
        window.addEventListener("contextmenu", Util.preventAction, false);
    }
    exports.init = init;
    return exports;
}());