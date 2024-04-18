// ColoredPoints.js

// Vertex shader program
var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  uniform float u_Size;
  void main() {
    gl_Position = a_Position;
    gl_PointSize = u_Size;
}`

 // Fragment shader program
var FSHADER_SOURCE = `
precision mediump float;
uniform vec4 u_FragColor;
void main(){
    gl_FragColor = u_FragColor;
} `

// Global Variables
let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_Size;



function setupWebGL(){
    canvas = document.getElementById('webgl');
    gl = canvas.getContext("webgl", { preserveDrawingBuffer: true});

    if(!gl){
        console.log('Failed to ge the rendering context for WebGL');
        return;
    }
}

function connectVariablesToGLSL(){
    // Initialize shaders ==========================================
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to intialize shaders.');
        return;
    }
 
    // Get the storage location of attribute variable ==============
    a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return;
    }
 
    // Get the storage location of attribute variable ==============
    u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    if (!u_FragColor) {
        console.log('Failed to get u_FragColor');
        return;
    }
 
    u_Size = gl.getUniformLocation(gl.program, 'u_Size');
    if (!u_Size) {
        console.log('Failed to get u_Size');
        return;
    }
 
 }

const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 3;
 // Globals related to UI Elements
let g_selectedColor=[1.0,1.0,1.0,1.0];
let g_selectedSize=5;
let g_numofsegments =1;
let g_selectedType=POINT;

function addActionsForHtmlUI(){
    // Button Events
   
    document.getElementById('green').onclick = function() {g_selectedColor = [0.0,1.0,0.0,1.0]; };
    document.getElementById('red').onclick = function() {g_selectedColor = [1.0,0.0,0.0,1.0]; }; 
    document.getElementById('clearButton').onclick = function() {g_shapesList=[]; renderAllShapes(); };

    document.getElementById('pointButton').onclick = function() {g_selectedType = POINT};
    document.getElementById('triButton').onclick = function() {g_selectedType = TRIANGLE};
    document.getElementById('circleButton').onclick = function() {g_selectedType = CIRCLE};

    document.getElementById('drawButton').onclick = function() {drawPicture(); };
    
    document.getElementById('redSlide').addEventListener('mouseup', function() { g_selectedColor[0] = this.value/100; });
    document.getElementById('greenSlide').addEventListener('mouseup', function() { g_selectedColor[1] = this.value/100; });
    document.getElementById('blueSlide').addEventListener('mouseup', function() { g_selectedColor[2] = this.value/100; });

    document.getElementById('sizeSlide').addEventListener('mouseup', function() { g_selectedSize = this.value; });
    document.getElementById('sizeSlide').addEventListener('mouseup', function() { g_numofsegments = this.value; });
}   


 function main() {
 // Initialize shaders
   setupWebGL();
   connectVariablesToGLSL();
   addActionsForHtmlUI();

   canvas.onmousedown = click;
   canvas.onmousemove = function(ev) {if(ev.buttons == 1) { click(ev) } };

   gl.clearColor(0.0,0.0,0.0,1.0);

   gl.clear(gl.COLOR_BUFFER_BIT);
}


var g_shapesList = [];

/*var g_points = []; // The array for a mouse press
var g_colors = []; // The array to store the color of a point
var g_sizes = [];*/

function click(ev) {
   let [x,y] = convertCoordinatesEventToGL(ev);

   let point;
   if(g_selectedType==POINT){
    point = new Point();
   } else if (g_selectedType == TRIANGLE){
    point = new Triangle();
   } else{
    point = new Circle();
   }
   point.position=[x,y];
   point.color=g_selectedColor.slice();
   point.size=g_selectedSize;

   if(g_selectedType == CIRCLE){
    point.segments = g_numofsegments;
   }
   
   g_shapesList.push(point);
   /* Store the coordinates to g_points array
   g_points.push([x, y]);

   //g_colors.push(g_selectedColor);

   g_colors.push(g_selectedColor.slice());

   g_sizes.push(g_selectedSize);*/

   renderAllShapes();
 } 

// convertCoordinatesEventToGL =====================================
function convertCoordinatesEventToGL(ev){
   var x = ev.clientX; // x coordinate of a mouse pointer
   var y = ev.clientY; // y coordinate of a mouse pointer
   var rect = ev.target.getBoundingClientRect();

   x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
   y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

   return([x,y]);
 }


 // renderAllShapes =================================================
function renderAllShapes(){
    // Clear <canvas>
    var startTime = performance.now();

    gl.clear(gl.COLOR_BUFFER_BIT);
 
    //var len = g_points.length;
    var len = g_shapesList.length;

    for (var i = 0; i < len; i++) {
       g_shapesList[i].render();
    }
    var duration = performance.now() - startTime;
    sendTextToHTML("numdot: " + len + " ms: " + Math.floor(duration) + " fps: " + Math.floor(10000/duration)/10, "numdot");
 }

 function sendTextToHTML(text, htmlID){
    var htmlElm = document.getElementById(htmlID);
    if(!htmlElm){
        console.log("Failed to get " + htmlID + " from HTML");
        return;
    }
    htmlElm.innerHTML = text;
 }

function drawPicture(){
    let point;
    let [x, y] = [0, 0];

    renderAllShapes();
}