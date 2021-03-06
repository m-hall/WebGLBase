
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
         * Gets the index of an item in an array. Works like array.indexOf, but faster.
         * @param  {Array} arr   An array
         * @param  {Mixes} item  Anything
         * @return {int}         The numeric index of the item if it exists, -1 otherwise
         */
        indexOf: function (arr, item) {
            var i = arr.length;
            while (i--) {
                if (arr[i] === item) {
                    return i;
                }
            }
            return -1;
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
         * @param  {object} o     An object to clone
         * @param  {object} [out] An output object
         * @return {object}       A new object with the same properties
         */
        clone: function (o, out) {
            var keys = Object.keys(o),
                i,
                l;
            out = out || {};
            for (i = 0, l = keys.length; i < l; i++) {
                out[keys[i]] = o[keys[i]];
            }
            return out;
        },
        /**
         * Clones a bounds object of it's properties to a new bounds object.
         * Cloned properties: x, y, z, width, height, radius.
         * @param  {bounds} o     An object to clone
         * @param  {bounds} [out] An output object
         * @return {bounds}       A new object with the same properties
         */
        cloneBounds: function (o, out) {
            out = out || {};
            out.x = o.x;
            out.y = o.y;
            out.z = o.z;
            if (o.width || o.height) {
                out.width = o.width;
                out.height = o.height;
            }
            if (o.radius) {
                out.radius = o.radius;
            }
            return out;
        },
        /**
         * Gets the center point of a bounds object
         * @param  {object} bounds  Bounds with x, y, width, height
         * @param  {object} [out]   An output object
         * @return {object}         Point with x, y
         */
        getCenter: function (bounds, out) {
            out = out || {};
            out.x = bounds.x + bounds.width / 2;
            out.y = bounds.y + bounds.height / 2;
            return out;
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