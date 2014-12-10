/*jslint bitwise: true */
/*global Float32Array, Uint8Array, mat4 */

/**
 * GL utility
 */
var GL = (function () {
    "use strict";

    var initialized = false,
        exports = { };

    var blankTexture;

    var canvas = null,
        gl = null,
        ratio = 1;

    var quad = {
        center: [
            -1.0, -1.0, 0.0,
            -1.0, 1.0, 0.0,
            1.0, -1.0, 0.0,

            -1.0, 1.0, 0.0,
            1.0, -1.0, 0.0,
            1.0, 1.0, 0.0
        ],
        tex: [
            0.0, 1.0,
            0.0, 0.0,
            1.0, 1.0,

            0.0, 0.0,
            1.0, 1.0,
            1.0, 0.0
        ],
        texBuffer: null,
    };

    var perspectiveMatrix;

    var shader = null,
        vertexShader = [
            "attribute vec3 vertex;",
            "attribute vec2 textureCoord;",
            "uniform mat4 modelView;",
            "uniform mat4 perspective;",
            "varying vec2 texCoord;",
            "void main(void) {",
            "    gl_Position = perspective * modelView * vec4(vertex, 1.0);",
            "    texCoord = textureCoord;",
            "}"
        ].join('\n'),

        fragmentShader = [
            "#ifdef GL_ES",
            "precision lowp float;",
            "#endif",
            "uniform sampler2D tex;",
            "uniform float alpha;",
            "varying vec2 texCoord;",
            "void main(void) {",
            "    vec4 o = texture2D(tex, texCoord);",
            "    gl_FragColor = vec4(o.rgb, o.a * alpha);",
            "}"
        ].join('\n');

    /**
     * Gets the pixel ratio
     * @return {float} Pixel ratio
     */
    function getRatio() {
        return ratio;
    }

    /**
     * Creates the default shader program.
     */
    function createProgram() {
        var vert = gl.createShader(gl.VERTEX_SHADER),
            frag = gl.createShader(gl.FRAGMENT_SHADER);

        gl.shaderSource(vert, vertexShader);
        gl.shaderSource(frag, fragmentShader);
        gl.compileShader(vert);
        gl.compileShader(frag);

        shader = gl.createProgram();
        gl.attachShader(shader, vert);
        gl.attachShader(shader, frag);
        gl.linkProgram(shader);
        gl.useProgram(shader);

        // params
        shader.vertex = gl.getAttribLocation(shader, 'vertex');
        gl.enableVertexAttribArray(shader.vertex);
        shader.textureCoord = gl.getAttribLocation(shader, 'textureCoord');
        gl.enableVertexAttribArray(shader.textureCoord);
        shader.tex = gl.getUniformLocation(shader, 'tex');

        shader.alpha = gl.getUniformLocation(shader, 'alpha');

        // modelView matrix
        shader.modelView = gl.getUniformLocation(shader, 'modelView');

        // perspective matrix
        shader.perspective = gl.getUniformLocation(shader, 'perspective');
        perspectiveMatrix = mat4.create();
        mat4.ortho(perspectiveMatrix, 0, exports.width, 0, exports.height, 0, 1);
        gl.uniformMatrix4fv(shader.perspective, false, perspectiveMatrix);
    }

    /**
     * Updates the GL renderer when the window size changes.
     */
    function update() {
        var width = window.innerWidth;
        var height = window.innerHeight;
        canvas.style.width = width + "px";
        canvas.style.height = height + "px";
        canvas.width = width * ratio;
        canvas.height = height * ratio;
        gl.viewport(0, 0, width * ratio, height * ratio);

        exports.width = width;
        exports.height = height;

        if (initialized) {
            mat4.ortho(perspectiveMatrix, 0, width, 0, height, 0, 1);
            gl.uniformMatrix4fv(shader.perspective, false, perspectiveMatrix);
        }
        Event.fire('resize');
    }

    /**
     * Gets coordinates for a Quad with given width and height
     * @param  {int}     width  Pixel width
     * @param  {int}     height Pixel height
     * @return {Array}          A set of vertices
     */
    function quadCoords(width, height) {
        var q = quad.center.slice(0),
            w = width * 0.5,
            h = height * 0.5,
            i,
            l;
        for (i = 0, l = q.length; i < l; i += 3) {
            q[i] *= w;
            q[i + 1] *= h;
        }
        return q;
    }

    /**
     * Creates a GL buffer from an array based on item size
     * @param  {int}       itemSize The number of properties per attribute
     * @param  {Array}     data     A set of data scalars to be buffered
     * @return {GLBuffer}           A WebGL data buffer
     */
    function bufferData(itemSize, data) {
        var buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
        buffer.itemSize = itemSize;
        buffer.numItems = Math.ceil(data.length / itemSize);
        return buffer;
    }

    /**
     * Initializes a texture from a DOM image
     * @param  {Image}     img  A DOM image object. Image/Canvas/Picture.
     * @return {GLTexture}      A WebGL texture
     */
    function initializeTexture(img) {
        var tex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, tex);
        //gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.bindTexture(gl.TEXTURE_2D, null);
        return tex;
    }
    /**
     * Creates a 1x1 texture that is the passed in color as a GL texture.
     * @param   {Array}      color  An array with 4 elements, red, green, blue and alpha values.
     * @returns {GLTexture}         The solid coloured GL texture
     */
    function createFlatTexture(color) {
        var texture = gl.createTexture();
        var c = color || [255, 255, 255, 255];
        gl.bindTexture(gl.TEXTURE_2D, texture); //bind the image to this entry's texture
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(c)); //create the 1x1 texture
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        texture.width = 1;
        texture.height = 1;
        return texture;
    }

    /**
     * Gets a blank 1x1 texture
     * @return {GLTexture}  A WebGL texture
     */
    function getBlankTexture() {
        if (blankTexture) {
            return blankTexture;
        }
        blankTexture = createFlatTexture([0.0, 0.0, 0.0, 0.0]);
        return blankTexture;
    }

    /**
     * Deletes a WebGL texture
     * @param  {GLTexture} texture  A WebGL texture
     */
    function deleteTexture(texture) {
        gl.deleteTexture(texture);
    }

    /**
     * Renders a Quad to the GL Viewport.
     * @param  {GLTexture} texture    A WebGL texture
     * @param  {Object}    bounds     An object with x, y, z, width and height
     * @param  {Object}    [options]  Options to modify the quad. Options include: rotation
     */
    function renderQuad(texture, bounds, options) {
        options = options || {};
        var rotation = options.rotation || [0, 0, 0];
        var rDelta = Math.max(rotation[0], rotation[1], rotation[2]);

        var modelView = mat4.create(); // identity
        mat4.translate(modelView, modelView, [bounds.x, bounds.y, bounds.z || 0]);
        mat4.rotate(modelView, modelView, rDelta, rotation);

        var triangleBuffer = bufferData(3, quadCoords(bounds.width, bounds.height));
        var texBuffer = quad.texBuffer;

        gl.uniform1f(shader.alpha, isNaN(options.alpha) ? 1 : options.alpha);
        gl.uniformMatrix4fv(shader.modelView, false, modelView);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.uniform1i(shader.tex, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, triangleBuffer);
        gl.vertexAttribPointer(shader.vertex, triangleBuffer.itemSize, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, texBuffer);
        gl.vertexAttribPointer(shader.textureCoord, texBuffer.itemSize, gl.FLOAT, false, 0, 0);
        gl.drawArrays(gl.TRIANGLES, 0, triangleBuffer.numItems);
    }

    /**
     * Initializes the GL viewport and renderer
     */
    function init() {
        canvas = document.createElement('canvas');
        gl = canvas.getContext('webgl');
        ratio = window.devicePixelRatio || 1;
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

        update();
        createProgram();
        blankTexture = getBlankTexture();
        quad.texBuffer = bufferData(2, quad.tex);

        document.body.appendChild(canvas);
        window.addEventListener('resize', update, false);
        initialized = true;
    }
    exports.init = init;
    exports.getBlankTexture = getBlankTexture;
    exports.initializeTexture = initializeTexture;
    exports.createFlatTexture = createFlatTexture;
    exports.deleteTexture = deleteTexture;
    exports.renderQuad = renderQuad;
    exports.getRatio = getRatio;
    return exports;
}());