/*global Selector */

/**
 * A Navigable List component
 */
var NavList = (function () {
    "use strict";
    var center = {};

    /**
     * Checks if a point is inside a rectangular bounds
     * @param  {object} point  An object with x, y coorinates
     * @param  {object} bounds An object with x, y, width height
     * @return {bool}          True if the point is inside the bounds, false otherwise
     */
    function pointInBounds(point, bounds) {
        var x = point.x,
            y = point.y,
            startX = bounds.x - bounds.width / 2,
            startY = bounds.y - bounds.height / 2,
            endX = startX + bounds.width,
            endY = startY + bounds.height;
        return startX < x && startY < y && endX > x && endY > y;
    }


    /**
     * Gets the nearest item in the direction indicated
     * @param  {Navigable}        from   A navigable item
     * @param  {Array<Navigable>} list   A list of navigable items
     * @param  {float}            angle  A direction to check against
     * @return {Navigable}               A navigable item
     */
    function nearestInDirection(from, list, angle) {
        center = Util.getCenter(from.bounds, center);
        var nearest = null,
            distance = null,
            item,
            itemAngle,
            itemCenter = {},
            itemDistance,
            i,
            l;
        for (i = 0, l = list.length; i < l; i++) {
            item = list[i];
            if (from !== item) {
                itemCenter = Util.getCenter(item.bounds, itemCenter);
                itemAngle = Util.angleTo(center, itemCenter);
                if (Util.isAngleNear(angle, itemAngle)) {
                    itemDistance = Util.distance(center, itemCenter);
                    if (!nearest || itemDistance < distance) {
                        nearest = item;
                        distance = itemDistance;
                    }
                }
            }
        }
        return nearest;
    }
    /**
     * Handles mouse button events
     * @this   {NavList}
     * @param  {object} change Lists all changes in mouse button states
     */
    function mouseButton(change) {
        if (change.left !== true) {
            return;
        }
        var items = this.items,
            i,
            l,
            item;
        for (i = 0, l = items.length; i < l; i++) {
            item = items[i];
            if (pointInBounds(Mouse, item.bounds)) {
                return this.onAction(item);
            }
        }
    }
    /**
     * Handles key events
     * @this   {NavList}
     * @param  {object} change Lists all changes in key states
     */
    function keyEvent(change) {
        var newItem = null;
        if (change.up === true) {
            newItem = nearestInDirection(this.selected, this.items, Util.UP);
        } else if (change.down === true) {
            newItem = nearestInDirection(this.selected, this.items, Util.DOWN);
        } else if (change.left === true) {
            newItem = nearestInDirection(this.selected, this.items, Util.LEFT);
        } else if (change.right === true) {
            newItem = nearestInDirection(this.selected, this.items, Util.RIGHT);
        } else if (change.enter === true) {
            this.onAction(this.selected);
            return;
        }

        if (newItem) {
            this.selected = newItem;
            this.selector.animate(newItem.bounds);
        }
    }
    /**
     * Handles touch events
     * @this   {NavList}
     * @param  {object} change  A list of changed touch objects
     */
    function touchEvent(change) {
        var items = this.items,
            i,
            l,
            item,
            keys = Object.keys(change),
            j,
            k = keys.length;
        for (i = 0, l = items.length; i < l; i++) {
            item = items[i];
            for (j = 0; j < k; j++) {
                if (pointInBounds(change[keys[j]], item.bounds)) {
                    this.onAction(item);
                    return true;
                }
            }
        }
    }

    /**
     * NavList component constructor
     */
    function NavListClass(onAction) {
        this.selected = null;
        this.items = [];
        this.onAction = onAction;
        this.mouseListener = mouseButton.bind(this);
        this.keyListener = keyEvent.bind(this);
        this.touchListener = touchEvent.bind(this);
        this.selector = new Selector();
    }
    NavListClass.prototype = {
        /**
         * Adds an item to the NavList
         * @param {Navigable} item  A navigable item.
         */
        add: function (item) {
            this.items.push(item);
            if (this.items.length === 1) {
                this.selected = item;
                this.selector.place(item.bounds);
            }
        },
        /**
         * Removes an item from the list
         * @param  {Navigable} item  A navigable item.
         */
        remove: function (item) {
            var items = this.items,
                i,
                l;
            for (i = 0, l = items.length; i < l; i++) {
                if (items[i] === item) {
                    items.splice(i, 1);
                    if (i >= items.length) {
                        i = items.length - 1;
                    }
                    return;
                }
            }
        },
        /**
         * Renders all items in the NavList
         */
        render: function (delta) {
            var items = this.items,
                i,
                l;
            this.selector.render(delta);
            for (i = 0, l = items.length; i < l; i++) {
                items[i].render(delta);
            }
        },
        /**
         * Destroys all items in the NavList
         */
        destroy: function () {
            this.disable();
            var items = this.items,
                i,
                l;
            for (i = 0, l = items.length; i < l; i++) {
                items[i].destroy();
                items[i] = null;
            }
            this.items = [];
        },
        /**
         * Enables the event listeners
         */
        enable: function () {
            Event.listen('mouseButton', this.mouseListener);
            Event.listen('keyEvent', this.keyListener);
            Event.listen('touch', this.touchListener);
            return;
        },
        /**
         * Disables the event listeners
         */
        disable: function () {
            Event.unlisten('mouseButton', this.mouseListener);
            Event.unlisten('keyEvent', this.keyListener);
            Event.unlisten('touch', this.touchListener);
            return;
        }
    };
    return NavListClass;
}());