/**
 * Event Manager
 */
var Event = (function () {
    "use strict";

    var listeners = { };

    /**
     * Adds a listener to an event by name.
     * @param  {string}   key         The name of the event
     * @param  {Callable} listener    A callable function
     */
    function listen(key, listener) {
        var lGroup = listeners[key];
        if (!lGroup) {
            lGroup = listeners[key] = [];
        }
        lGroup.push(listener);
    }

    /**
     * Removes an event listener
     * @param  {string}   key         The name of the event
     * @param  {Callable} listener    A callable function
     * @return {boolean}              True if the listener was removed. False otherwise.
     */
    function unlisten(key, listener) {
        var lGroup = listeners[key],
            item,
            i,
            l;
        if (!lGroup) {
            return false;
        }
        for (i = 0, l = lGroup.length; i < l; i += 1) {
            item = lGroup[i];
            if (item === listener) {
                lGroup.splice(i, 1);
                return true;
            }
        }
        return false;
    }

    /**
     * Fire an event to all listeners in order
     * @param  {strinq} key     The name of the event
     * @param  {Object} [data]  Optional. Data to send to the event.
     */
    function fire(key, data) {
        var lGroup = listeners[key],
            i,
            l;
        if (!lGroup) {
            return;
        }
        for (i = 0, l = lGroup.length; i < l; i += 1) {
            lGroup[i](data);
        }
    }
    return {
        listen: listen,
        unlisten: unlisten,
        fire: fire
    };
}());