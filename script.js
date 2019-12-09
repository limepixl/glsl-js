// Create shader program linking a vertex and fragment shader
function initShaderProgram(gl, vertexSource, fragmentSource) {
    const vertex = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertex, vertexSource);
    gl.compileShader(vertex);

    // Check compilation status
    if (!gl.getShaderParameter(vertex, gl.COMPILE_STATUS)) {
        alert('An error occurred compiling the VERTEX shader: ' + gl.getShaderInfoLog(vertex));
        gl.deleteShader(vertex);
        return null;
    }

    const fragment = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragment, fragmentSource);
    gl.compileShader(fragment);

    // Check compilation status
    if (!gl.getShaderParameter(fragment, gl.COMPILE_STATUS)) {
        alert('An error occurred compiling the FRAGMENT shader: ' + gl.getShaderInfoLog(fragment));
        gl.deleteShader(fragment);
        return null;
    }

    // Create shader program
    const ID = gl.createProgram();
    gl.attachShader(ID, vertex);
    gl.attachShader(ID, fragment);
    gl.linkProgram(ID);

    return ID;
}

function main() {
    // Initialize GL context
    const canvas = document.querySelector("#openGLCanvas");
    gl = canvas.getContext("webgl2");

    // Check if context was created
    if (gl === null) {
        alert("Unable to initialize WebGL.");
        return;
    }

    // Set up environment
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    // Shaders source code
    const vertexSource =
    `attribute vec4 aPos;

    uniform mat4 modelView;
    uniform mat4 projection;

    void main()
    {
        gl_Position = projection * modelView * aPos;
    }`;

    const fragmentSource =
    `precision mediump float;
    uniform float time;
    void main()
    {
        gl_FragColor = vec4((sin(time) + 1.0) / 2.0, 0.0, 0.0, 1.0);
    }`;

    const shaderProgram = initShaderProgram(gl, vertexSource, fragmentSource);

    info = {
        program: shaderProgram,
        attribLocations: {
            aPos: gl.getAttribLocation(shaderProgram, 'aPos')
        },
        uniformLocations: {
            projection: gl.getUniformLocation(shaderProgram, 'projection'),
            modelView: gl.getUniformLocation(shaderProgram, 'modelView'),
            time: gl.getUniformLocation(shaderProgram, 'time')
        }
    }

    // Vertex data
    const positions = 
    [-1.0, -1.0,
      1.0, -1.0,
      1.0,  1.0,
      1.0,  1.0,
     -1.0,  1.0,
     -1.0, -1.0,];

    const VAO = gl.createVertexArray();
    gl.bindVertexArray(VAO);
    
    // Pass vertex positions
    const VBO = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, VBO);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    // Equivalent of glVertexAttribPointer 
    gl.vertexAttribPointer(info.attribLocations.vertexPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(info.attribLocations.vertexPosition);

    const fieldOfView = 45 * Math.PI / 180;
    const projectionMatrix = mat4.create();
    mat4.perspective(projectionMatrix, fieldOfView, gl.canvas.clientWidth / gl.canvas.clientHeight, 0.1, 100.0);

    gl.useProgram(info.program);
    gl.uniformMatrix4fv(info.uniformLocations.projection, false, projectionMatrix);

    window.requestAnimationFrame(drawFrame)
}

var start = null;
function drawFrame(time) {
    time = time * 0.001;
    if (!start)
        start = time;

    var elapsed = time - start;

    const modelViewMatrix = mat4.create();
    mat4.translate(modelViewMatrix, modelViewMatrix, [0.0, 0.0, -6]);
    mat4.rotate(modelViewMatrix, modelViewMatrix, time, [0.0, 1.0, 0.0]);

    gl.useProgram(info.program);
    gl.uniform1f(info.uniformLocations.time, elapsed);
    gl.uniformMatrix4fv(info.uniformLocations.modelView, false, modelViewMatrix);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 6);

    window.requestAnimationFrame(drawFrame)
}

window.onload = main;