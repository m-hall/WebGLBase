/*global View, NavList, Button */

/**
 * Menu View
 * @return {object}  View API for Menu
 */
var Menu = (function () {
    "use strict";

    var initialized = false,
        navList;

    /**
     * Starts the Demo View
     */
    function startDemo() {
        View.set('Demo');
    }
    /**
     * Starts the Settings View
     */
    function startSettings() {
        alert('I don\'t do anything yet.');
    }

    /**
     * Action event when the NavList needs to run an action
     * @param  {Navigable} button  A button with an action
     */
    function onAction(button) {
        button.action();
    }

    /**
     * Creates a text menu button
     * @param  {string} text  Text for the button
     * @param  {int}    y     The Y position of the button
     * @return {Button}       A new Button instance
     */
    function menuButton(text, y) {
        var button,
            ctx,
            x = window.innerWidth / 2,
            width = 240,
            height = 80,
            ratio = GL.getRatio();
        button = new Button({
            x: x,
            y: y,
            z: 0,
            width: width,
            height: height
        });
        button.action = startDemo;
        ctx = button.context;
        ctx.scale(ratio, ratio);
        ctx.font = "50px verdana";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "rgba(100, 100, 100, 0.5)";
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = "rgba(255, 255, 255, 1)";
        ctx.fillText(text, width / 2, height / 2);
        return button;
    }

    /**
     * Initializes the view
     */
    function init() {
        var button,
            y = window.innerHeight * 0.5;
        if (initialized) {
            return;
        }
        navList = new NavList(onAction);
        button = menuButton("Demo", y);
        button.action = startDemo;
        navList.add(button);
        y -= 100;
        button = menuButton("Settings", y);
        button.action = startSettings;
        navList.add(button);
        navList.enable();
        Loop.requestFrame();
        initialized = true;
    }
    /**
     * Opens the view
     */
    function open() {
        init();
    }
    /**
     * Uninitializes the view
     */
    function close() {
        navList.destroy();
        navList = null;
        initialized = false;
    }
    /**
     * Renders the Menu view
     * @param  {int} delta  Milliseconds since last frame
     */
    function render(delta) {
        navList.render(delta);
    }
    return {
        init: init,
        open: open,
        close: close,
        render: render
    };
}());

View.register('Menu', Menu);