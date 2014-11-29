/*global View */

/**
 * The Demo view controller
 * @return {ViewAPI}  The public API for the demo view
 */
var Demo = (function () {
    "use strict";

    var textures = [],
        current,
        totalDelta,
        initialized = false;

    /**
     * Initializes the view
     */
    function init() {
        if (initialized) {
            return;
        }
        textures.push(GL.createFlatTexture([255, 0, 0, 100]));
        textures.push(GL.createFlatTexture([0, 255, 0, 100]));
        textures.push(GL.createFlatTexture([0, 0, 255, 100]));
        textures.push(GL.createFlatTexture([255, 255, 255, 100]));
        current = 0;
        totalDelta = 0;
        initialized = true;
    }

    /**
     * Renders the demo view
     * @param  {int} delta  Time since last frame
     */
    function render(delta) {
        Loop.requestFrame();
        totalDelta += delta;
        GL.renderQuad(
            textures[current],
            {
                x: Mouse.x,
                y: Mouse.y,
                z: 0,
                width: 30,
                height: 60
            },
            {
                rotation: [0, 0, totalDelta * 0.002]
            }
        );
        GL.renderQuad(
            textures[(current + 1) % textures.length],
            {
                x: Mouse.x,
                y: window.innerHeight - Mouse.y,
                z: 0,
                width: 40,
                height: 40
            },
            {
                rotation: [0, 0, totalDelta * 0.003]
            }
        );
        GL.renderQuad(
            textures[(current + 2) % textures.length],
            {
                x: window.innerWidth - Mouse.x,
                y: Mouse.y,
                z: 0,
                width: 100,
                height: 10
            },
            {
                rotation: [0, 0, totalDelta * 0.001]
            }
        );
        GL.renderQuad(
            textures[(current + 3) % textures.length],
            {
                x: window.innerWidth - Mouse.x,
                y: window.innerHeight - Mouse.y,
                z: 0,
                width: 80,
                height: 40
            },
            {
                rotation: [0, 0, totalDelta * 0.005]
            }
        );
    }

    /**
     * Responds to mouse button changes
     * @param  {object} data  Mouse data
     */
    function mouseButton(data) {
        if (data.left === true) {
            current = (current + 1) % textures.length;
        }
    }

    /**
     * Opens the view
     */
    function open() {
        init();
        Event.listen('mouseButton', mouseButton);
        Loop.requestFrame();
    }

    /**
     * Uninitializes the view
     */
    function close() {
        var i, l;
        //Unlisten from events
        Event.unlisten('mouseButton', mouseButton);

        //Release GL buffers and textures
        for (i = 0, l = textures.length; i < l; i++) {
            GL.deleteTexture(textures[i]);
        }
        textures = [];

        //Uninitialize
        initialized = false;
    }

    return {
        init: init,
        open: open,
        close: close,
        render: render
    };
}());

View.register('Demo', Demo);