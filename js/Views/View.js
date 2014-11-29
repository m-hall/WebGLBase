/**
 * View Controller constructor (singleton)
 */
var View = (function () {
    "use strict";

    var views = { },
        current = false;

    /**
     * Adds a View interface to the list
     * @param  {string}      name  Unique name of a View
     * @param  {ViewInterface} view    A View interface
     * @throws {Exception}         If name is not defined or View is invalid
     */
    function register(name, view) {
        if (!name) {
            throw "A View must be registered with a name";
        }
        if (!view.open || !view.close || !view.render) {
            throw "View could not be registered with name: " + name;
        }
        views[name] = view;
    }

    /**
     * Returns the current View Interface
     * @return {ViewInterface}  A View Interface
     */
    function get() {
        return current;
    }

    /**
     * Sets the current View Interface
     * @param  {string}            name  The name of an available View Interface
     * @return {ViewInterface|false}       Returns the View Interface or false
     */
    function set(name) {
        if (current) {
            current.close();
        }
        current = views[name];
        if (current) {
            current.open();
            return current;
        }
        return false;
    }
    return {
        register: register,
        get: get,
        set: set
    };
}());