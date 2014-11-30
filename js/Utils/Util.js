
/**
 * Generic Utility functions that haven't been sorted into specific utility classes
 * @return {object}  Public Util API
 */
var Util = (function () {
    "use strict";
    return {
        UP: 0,
        RIGHT: Math.PI * 0.5,
        DOWN: Math.PI,
        LEFT: Math.PI * 1.5,

        /**
         * An empty function that does nothing
         */
        empty: function () {
            return;
        },

        /**
         * Verifies that an angle is close to another angle
         * @param  {float}  from  An angle in radians
         * @param  {float}  to    An angle in radians
         * @param  {float}  [by]  The allowable difference in the angles
         * @return {Boolean}      True if the angles are similar, false otherwise
         */
        isAngleNear: function (from, to, by) {
            by = isNaN(by) ? Math.PI * 0.25 : by;
            var diff = Math.abs(from - to);
            return (diff < by || Math.PI * 2 - diff < by);
        },

        /**
         * Gets the distance between 2 points
         * @param  {object} from  Point with x, y
         * @param  {object} to    Point with x, y
         * @return {float}        Distance between the points
         */
        distance: function (from, to) {
            var y = to.y - from.y,
                x = to.x - from.x;
            return Math.sqrt(x * x + y * y);
        },
        /**
         * Gets the angle in radians between 2 points
         * @param  {object} from  Point with x, y
         * @param  {object} to    Point with x, y
         * @return {float}        Angle in radians
         */
        angleTo: function (from, to) {
            var angle,
                modifier = 0,
                y = to.y - from.y,
                x = to.x - from.x;
            if (y === 0) {
                if (x < 0) {
                    return Util.LEFT;
                }
                if (x > 0) {
                    return Util.RIGHT;
                }
                return Util.UP;
            }
            angle = Math.atan2(x, y);
            if (x < 0) {
                modifier = Math.PI * 2;
            }
            return angle + modifier;
        },
        /**
         * Clones an object of it's properties to a new object
         * @param  {object} o  An object to clone
         * @return {object}    A new object with the same properties
         */
        clone: function (o) {
            var keys = Object.keys(o),
                newO = {},
                i,
                l;
            for (i = 0, l = keys.length; i < l; i++) {
                newO[keys[i]] = o[keys[i]];
            }
            return newO;
        },
        /**
         * Gets the center point of a bounds object
         * @param  {object} bounds  Bounds with x, y, width, height
         * @return {object}         Point with x, y
         */
        getCenter: function (bounds) {
            var center = {
                x: bounds.x + bounds.width / 2,
                y: bounds.y + bounds.height / 2
            };
            return center;
        },
        /**
         * Prevents a browser event from continuing.
         * @param  {DOMEvent} e  A DOM event
         * @return {false}       False to prevent default browser action
         */
        preventAction: function (e) {
            e.preventDefault();
            return false;
        },
        /**
         * Gets the current time in milliseconds
         * @return {int} Timestamp
         */
        now: function () {
            return (new Date()).getTime();
        },
        /**
         * Gets a canvas with size scaled to provided width and height
         * @param  {int}       width  Width of the canvas
         * @param  {int}       height Height of the canvas
         * @return {DOMCanvas}        A DOM canvas with context scaled
         */
        getCanvas: function (width, height) {
            var ratio = GL.getRatio();
            var canvas = document.createElement('canvas');
            canvas.width = width * ratio;
            canvas.height = height * ratio;
            canvas.ctx = canvas.getContext('2d');
            canvas.ctx.scale(ratio, ratio);
            return canvas;
        }
    };
}());