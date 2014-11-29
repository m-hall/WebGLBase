var Selector = (function () {
    "use strict";
    var time = 300;
    var tex;
    var baseBounds = {
        x: 0,
        y: 0,
        z: 0,
        width: 0,
        height: 0
    };

    /**
     * Creates a new Selector
     * @constructor
     * @param  {object} [bounds]  Bounds with x, y, width height
     */
    function exports(bounds) {
        this.bounds = Util.clone(bounds || baseBounds);
        this.endBounds = this.bounds;
        this.startBounds = this.bounds;
        this.animating = false;
        this.delta = 0;
        if (!tex) {
            tex = GL.createFlatTexture([107, 68, 159, 150]);
        }
    }
    /**
     * Places the selector at new bounds
     * @param  {object} bounds  Bounds with x, y, width, height
     */
    exports.prototype.place = function (bounds) {
        bounds = Util.clone(bounds);
        this.bounds = bounds;
        this.endBounds = bounds;
        this.startBounds = bounds;
        this.delta = 0;
        this.animating = false;
    };
    /**
     * Starts an animation for the selector to new bounds
     * @param  {object} bounds  Bounds with x, y, width, height
     */
    exports.prototype.animate = function (bounds) {
        this.endBounds = Util.clone(bounds);
        this.startBounds = Util.clone(this.bounds);
        this.delta = 0;
        this.animating = true;
        Loop.requestFrame();
    };
    /**
     * Updates the animation of the selector
     * @param  {int} delta  Number of milliseconds since last frame
     */
    exports.prototype.update = function (delta) {
        if (!this.animating) {
            return;
        }
        this.delta += delta || 0;
        var percent = this.delta / time;
        var start = this.startBounds;
        var end = this.endBounds;
        var bounds = this.bounds;
        if (percent >= 1) {
            this.bounds = this.endBounds;
            this.startBounds = this.endBounds;
        } else {
            Loop.requestFrame();
            bounds.x = (end.x - start.x) * percent + start.x;
            bounds.y = (end.y - start.y) * percent + start.y;
            bounds.z = (end.z - start.z) * percent + start.z;
            bounds.width = (end.width - start.width) * percent + start.width;
            bounds.height = (end.height - start.height) * percent + start.height;
            this.bounds = bounds;
        }
    };
    /**
     * Renders the selector to GL
     * @param  {int} delta  Number of milliseconds since last frame
     */
    exports.prototype.render = function (delta) {
        this.update(delta);
        GL.renderQuad(
            tex,
            this.bounds
        );
    };
    return exports;
}());