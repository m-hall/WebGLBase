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
    function SelectorClass(bounds) {
        this.bounds = Util.cloneBounds(bounds || baseBounds);
        this.endBounds = Util.cloneBounds(this.bounds);
        this.startBounds = Util.cloneBounds(this.bounds);
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
    SelectorClass.prototype.place = function (bounds) {
        Util.cloneBounds(bounds, this.bounds);
        Util.cloneBounds(bounds, this.endBounds);
        Util.cloneBounds(bounds, this.startBounds);
        this.delta = 0;
        this.animating = false;
    };
    /**
     * Starts an animation for the selector to new bounds
     * @param  {object} bounds  Bounds with x, y, width, height
     */
    SelectorClass.prototype.animate = function (bounds) {
        Util.cloneBounds(bounds, this.endBounds);
        Util.cloneBounds(this.bounds, this.startBounds);
        this.delta = 0;
        this.animating = true;
        Loop.requestFrame();
    };
    /**
     * Updates the animation of the selector
     * @param  {int} delta  Number of milliseconds since last frame
     */
    SelectorClass.prototype.update = function (delta) {
        if (!this.animating) {
            return;
        }
        this.delta += delta || 0;
        var percent = this.delta / time;
        var start = this.startBounds;
        var end = this.endBounds;
        var bounds = this.bounds;
        if (percent >= 1) {
            Util.cloneBounds(this.endBounds, this.bounds);
            Util.cloneBounds(this.endBounds, this.startBounds);
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
    SelectorClass.prototype.render = function (delta) {
        this.update(delta);
        GL.renderQuad(
            tex,
            this.bounds
        );
    };
    return SelectorClass;
}());