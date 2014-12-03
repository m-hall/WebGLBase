/*global View */

/**
 * The Demo view controller
 * @return {ViewAPI}  The public API for the demo view
 */
var Demo = (function () {
    "use strict";

    var current,
        totalDelta,
        initialized = false,
        rects = [],
        moveSpeed = 0.3;

    /**
     * Gets a new "rect"
     * @param  {int} [x]  Optional. Start X position.
     * @param  {int} [y]  Optional. Start Y position.
     * @return {Object}   An object that defines a rect.
     */
    function getRect(x, y) {
        var round = Math.round,
            random = Math.random,
            r = round(random() * 155) + 100,
            g = round(random() * 155) + 100,
            b = round(random() * 155) + 100,
            a = round(random() * 100) + 100;
        return {
            texture: GL.createFlatTexture([r, g, b, a]),
            width: 100 * random() + 10,
            height: 100 * random() + 10,
            x: x || round(window.innerWidth / 2),
            y: y || round(window.innerHeight / 2),
            z: 0,
            startDelta: totalDelta,
            deltaMultiplier: random() * 0.005 + 0.002
        };
    }

    /**
     * Adds a rect at the current location
     */
    function addRect() {
        current = getRect(current.x, current.y);
        rects.push(current);
    }
    /**
     * Handles keyboard move controls
     * @param  {int} delta  Milliseconds since last frame
     */
    function moveKeys(delta) {
        var keyState = Keyboard.state,
            distance = moveSpeed * delta;
        if (!keyState) {
            return;
        }
        if (keyState.up || keyState.w) {
            current.y += distance;
        }
        if (keyState.left || keyState.a) {
            current.x -= distance;
        }
        if (keyState.down || keyState.s) {
            current.y -= distance;
        }
        if (keyState.right || keyState.d) {
            current.x += distance;
        }
    }
    /**
     * Initializes the view
     */
    function init() {
        if (initialized) {
            return;
        }
        totalDelta = 0;
        current = getRect();
        rects.push(current);
        initialized = true;
    }

    /**
     * Renders the demo view
     * @param  {int} delta  Time since last frame
     */
    function render(delta) {
        Loop.requestFrame();
        moveKeys(delta);
        totalDelta += delta;
        var i, l, rect;
        for (i = 0, l = rects.length; i < l; i++) {
            rect = rects[i];
            GL.renderQuad(
                rect.texture,
                rect,
                {
                    rotation: [0, 0, (totalDelta - rect.startDelta) * rect.deltaMultiplier]
                }
            );
        }
    }

    /**
     * Responds to mouse button changes
     * @param  {Object} data  Mouse button changes
     */
    function mouseButton(data) {
        if (data.left === true) {
            addRect();
            return;
        }
    }

    /**
     * Responds to mouse movement
     * @param  {Object} data  Mouse x, y changes
     */
    function mouseMove(data) {
        current.x = Mouse.x;
        current.y = Mouse.y;
    }

    /**
     * Handles keyboard events
     * @param  {Object} data Keyboard key change data
     */
    function keyEvent(data) {
        if (data.space || data.enter) {
            addRect();
        } else if (data.escape) {
            View.set('Menu');
        }
    }

    /**
     * Opens the view
     */
    function open() {
        init();
        Event.listen('mouseButton', mouseButton);
        Event.listen('mouseMove', mouseMove);
        Event.listen('keyEvent', keyEvent);
        Loop.requestFrame();
    }

    /**
     * Uninitializes the view
     */
    function close() {
        var i, l;
        //Unlisten from events
        Event.unlisten('mouseButton', mouseButton);
        Event.unlisten('mouseMove', mouseMove);
        Event.unlisten('keyEvent', keyEvent);

        //Release GL buffers and textures
        for (i = 0, l = rects.length; i < l; i++) {
            GL.deleteTexture(rects[i].texture);
        }
        rects = [];

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