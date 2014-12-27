/**
 * Mouse API
 * @return {Object} Public Mouse API.
 */
var Mouse = (function () {
    "use strict";

    var exports = {
            x: null,
            y: null,
            left: false,
            middle: false,
            right: false
        },
        changeKey = {},
        changePosition = {
            x: 0,
            y: 0
        };

    /**
     * Updates the mouse state variables when a mouse button is pressed.
     * @param  {DOMEvent} e  A DOM mouse event
     * @return {false}       False to prevent default browser action
     */
    function handleDown(e) {
        delete changeKey.left;
        delete changeKey.middle;
        delete changeKey.right;
        if (e.button === 0) {
            exports.left = true;
            changeKey.left = true;
        } else if (e.button === 1) {
            exports.middle = true;
            changeKey.middle = true;
        } else if (e.button === 2) {
            exports.right = true;
            changeKey.right = true;
        }
        Event.fire('mouseButton', changeKey);
        Event.fire('mouseEvent', changeKey);
        return Util.preventAction(e);
    }

    /**
     * Updates the mouse state variables when a mouse button is released.
     * @param  {DOMEvent} e  A DOM mouse event
     * @return {false}       False to prevent default browser action
     */
    function handleUp(e) {
        delete changeKey.left;
        delete changeKey.middle;
        delete changeKey.right;
        if (e.button === 0) {
            exports.left = false;
            changeKey.left = false;
        } else if (e.button === 1) {
            exports.middle = false;
            changeKey.middle = false;
        } else if (e.button === 2) {
            exports.right = false;
            changeKey.right = false;
        }
        Event.fire('mouseButton', changeKey);
        Event.fire('mouseEvent', changeKey);
        return Util.preventAction(e);
    }

    /**
     * Updates the mouse state variables when the mouse moves.
     * @param  {DOMEvent} e  A DOM mouse event.
     */
    function handleMove(e) {
        changePosition.x = e.pageX - (exports.x || 0);
        changePosition.y = window.innerHeight - e.pageY - (exports.y || 0);
        exports.x = e.pageX;
        exports.y = window.innerHeight - e.pageY;
        Event.fire('mouseMove', changePosition);
        Event.fire('mouseEvent', changePosition);
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