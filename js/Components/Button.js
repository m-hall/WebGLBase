
var Button = (function () {
    "use strict";

    /**
     * Button component constructor
     * @param  {object} bounds Bounds object with x, y, z, width, height
     */
    function ButtonClass(bounds) {
        var canvas = document.createElement('canvas'),
            ratio = GL.getRatio();
        canvas.width = bounds.width * ratio;
        canvas.height = bounds.height * ratio;
        this.bounds = bounds;
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
    }
    ButtonClass.prototype = {
        /**
         * Renders the button
         */
        render: function () {
            if (!this.texture) {
                this.texture = GL.initializeTexture(this.canvas);
            }
            GL.renderQuad(this.texture, this.bounds);
        },
        /**
         * Destroys the button's assets
         */
        destroy: function () {
            if (this.texture) {
                GL.deleteTexture(this.texture);
            }
            this.context = null;
            this.canvas = null;
        }
    };
    return ButtonClass;
}());