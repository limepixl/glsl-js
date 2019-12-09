var x = 1.0;
var y = 1.0;
var z = 1.0;

var rot = 360;

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
    uniform vec3 color;
    void main()
    {
        gl_FragColor = vec4(color, 1.0);
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
            color: gl.getUniformLocation(shaderProgram, 'color')
        }
    }

    // Vertex data
    positions = [
        // Front face
        -1.0, -1.0,  1.0,
         1.0, -1.0,  1.0,
         1.0,  1.0,  1.0,
        -1.0,  1.0,  1.0,
        
        // Back face
        -1.0, -1.0, -1.0,
        -1.0,  1.0, -1.0,
         1.0,  1.0, -1.0,
         1.0, -1.0, -1.0,
        
        // Top face
        -1.0,  1.0, -1.0,
        -1.0,  1.0,  1.0,
         1.0,  1.0,  1.0,
         1.0,  1.0, -1.0,
        
        // Bottom face
        -1.0, -1.0, -1.0,
         1.0, -1.0, -1.0,
         1.0, -1.0,  1.0,
        -1.0, -1.0,  1.0,
        
        // Right face
         1.0, -1.0, -1.0,
         1.0,  1.0, -1.0,
         1.0,  1.0,  1.0,
         1.0, -1.0,  1.0,
        
        // Left face
        -1.0, -1.0, -1.0,
        -1.0, -1.0,  1.0,
        -1.0,  1.0,  1.0,
        -1.0,  1.0, -1.0,
    ];

    indices = [
        0, 1, 2,
        2, 3, 0,
        4, 5, 6,
        6, 7, 4,
        8, 9, 10,
        10, 11, 8,
        12, 13, 14,
        14, 15, 12,
        16, 17, 18,
        18, 19, 16,
        20, 21, 22,
        22, 23, 20
    ];

    const VAO = gl.createVertexArray();
    gl.bindVertexArray(VAO);
    
    // Pass vertex positions
    const VBO = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, VBO);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    // Equivalent of glVertexAttribPointer 
    gl.vertexAttribPointer(info.attribLocations.vertexPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(info.attribLocations.vertexPosition);

    // Pass indices
    const EBO = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, EBO);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(indices), gl.STATIC_DRAW);

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
    mat4.rotate(modelViewMatrix, modelViewMatrix, rot * (Math.PI / 180), [0.0, 1.0, 0.0]);

    gl.useProgram(info.program);

    gl.uniform3f(info.uniformLocations.color, x, y, z);
    gl.uniformMatrix4fv(info.uniformLocations.modelView, false, modelViewMatrix);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    if(polygonViewCheckbox.checked)
        gl.drawElements(gl.LINE_STRIP, indices.length, gl.UNSIGNED_INT, 0);
    else
        gl.drawElements(gl.TRIANGLE_STRIP, indices.length, gl.UNSIGNED_INT, 0);

    window.requestAnimationFrame(drawFrame)
}

window.onload = main;