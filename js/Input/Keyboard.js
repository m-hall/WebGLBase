/**
 * Keyboard API
 * @return {Object} Public Keyboard API.
 */
var Keyboard = (function () {
    "use strict";
    var exports = {};
    var keyCodes = [];
    var keywords = {};
    var keys = {
        'backspace': 8,
        'tab': 9,
        'enter': 13,
        'shift': 16,
        'ctrl': 17,
        'alt': 18,
        'capsLock': 20,
        'escape': 27,
        ' ': 32,
        'space': 32,
        'pageUp': 33,
        'pageDown': 34,
        'end': 35,
        'home': 36,
        'left': 37,
        'up': 38,
        'right': 39,
        'down': 40,
        'insert': 41,
        'delete': 42,
        '0': 48,
        '1': 49,
        '2': 50,
        '3': 51,
        '4': 52,
        '5': 53,
        '6': 54,
        '7': 55,
        '8': 56,
        '9': 57,
        'a': 65,
        'b': 66,
        'c': 67,
        'd': 68,
        'e': 69,
        'f': 70,
        'g': 71,
        'h': 72,
        'i': 73,
        'j': 74,
        'k': 75,
        'l': 76,
        'm': 77,
        'n': 78,
        'o': 79,
        'p': 80,
        'q': 81,
        'r': 82,
        's': 83,
        't': 84,
        'u': 85,
        'v': 86,
        'w': 87,
        'x': 88,
        'y': 89,
        'z': 90,
        'window': 91,
        'windowLeft': 91,
        'windowRight': 92,
        'command': 91,
        'commandLeft': 91,
        'commandRight': 93,
        'select': 93,
        'num0': 96,
        'num1': 97,
        'num2': 98,
        'num3': 99,
        'num4': 100,
        'num5': 101,
        'num6': 102,
        'num7': 103,
        'num8': 104,
        'num9': 105,
        'multiply': 106,
        'add': 107,
        'subtract': 109,
        'decimal': 110,
        'divide': 111,
        'f1': 112,
        'f2': 113,
        'f3': 114,
        'f4': 115,
        'f5': 116,
        'f6': 117,
        'f7': 118,
        'f8': 119,
        'f9': 120,
        'f10': 121,
        'f11': 122,
        'f12': 123,
        'numLock': 144,
        'scrollLock': 145,
        'semiColon': 186,
        ';': 186,
        'equals': 187,
        '=': 187,
        'comma': 188,
        ',': 188,
        'dash': 189,
        '-': 189,
        'period': 190,
        '.': 190,
        'slash': 191,
        '\/': 191,
        'graveAccent': 192,
        '`': 192,
        'openBracket': 219,
        '[': 219,
        'backslash': 220,
        '\\': 220,
        'closeBracket': 221,
        ']': 221,
        'singleQuote': 222,
        '\'': 222
    };

    /**
     * Adds keywords to an object representing the current keyCode
     * @param  {Object} obj      An object
     * @param  {int}    keycode  A keyboard key code
     * @param  {bool}   keyState The state of the key
     * @return {Object}          The original object with new state
     */
    function stateKeywords(obj, keycode, keyState) {
        var words = keywords[keycode],
            i,
            l;
        for (i = 0, l = words.length; i < l; i++) {
            obj[words[i]] = keyState;
        }
        return obj;
    }

    /**
     * Updates the current state of the Keyboard
     */
    function updateState() {
        var state = {};
        var i, l;
        for (i = 0, l = keyCodes.length; i < l; i++) {
            state[keyCodes[i]] = true;
            stateKeywords(state, keyCodes[i], true);
        }
        exports.state = state;
    }

    /**
     * Updates the key states when a key is pressed
     * @param  {DOMEvent} e  A DOM key event
     * @return {false}       False to prevent default browser action
     */
    function handleDown(e) {
        var change = {};
        if (Util.indexOf(keyCodes, e.keyCode) === -1) {
            keyCodes.push(e.keyCode);
        }
        change[e.keyCode] = true;
        stateKeywords(change, e.keyCode, true);
        updateState();
        Event.fire('keyEvent', change);
        return Util.preventAction(e);
    }
    /**
     * Updates the key states when a key is released
     * @param  {DOMEvent} e  A DOM key event
     * @return {false}       False to prevent default browser action
     */
    function handleUp(e) {
        var change = {};
        var i = keyCodes.indexOf(e.keyCode);
        keyCodes.splice(i, 1);
        change[e.keyCode] = false;
        stateKeywords(change, e.keyCode, false);
        updateState();
        Event.fire('keyEvent', change);
        return Util.preventAction(e);
    }
    /**
     * Initializes the listeners for key events
     */
    function init() {
        var words = Object.keys(keys),
            i,
            l;
        for (i = 0, l = words.length; i < l; i++) {
            if (!keywords[keys[words[i]]]) {
                keywords[keys[words[i]]] = [];
            }
            keywords[keys[words[i]]].push(words[i]);
        }
        window.addEventListener("keydown", handleDown, false);
        window.addEventListener("keyup", handleUp, false);
    }

    exports.init = init;
    exports.keys = keys;
    exports.keyCodes = keyCodes;
    return exports;
}());