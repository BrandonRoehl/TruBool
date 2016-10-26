var board;
var canvas;
var mouseDown;
var mouseX, mouseY;
var pieceAssets;
var wireAssets;
var currentPiece;
var FPS = 60;
var redrawTread;
// clearInterval(processor); 

// This will return the image that is associated with a piece number then the given state if on or off
function pieceAsset(num, bool) { 
    if (num > 0) return pieceAssets[(2 * num) - (bool ? 2 : 1)];
}

function wireAsset(num, bool) {
    return wireAssets[num][bool ? 1 : 0];
}

document.addEventListener("DOMContentLoaded", function(event){
    canvas = document.getElementsByTagName("canvas")[0].getContext("2d");
    isMouseDown = false;
    var gameBoard = document.getElementById("game_board");
    var inputs = toLogicArray(gameBoard, "input");
    var outputs = toLogicArray(gameBoard, "output");
    var piecesHTML = Array.from(gameBoard.getElementsByClassName("pieces")[0].getElementsByTagName("div"));
    var pieces = new Array(piecesHTML.length);
    piecesHTML.forEach(
        function(element, index){
            pieces[index] = parseInt(element.innerHTML);
        }
    );

    board = new Board(
        window.innerWidth,
        window.innerHeight,
        parseInt(gameBoard.getElementsByClassName("width")[0].innerHTML),
        parseInt(gameBoard.getElementsByClassName("height")[0].innerHTML),
        inputs,
        outputs,
        pieces
    );
    console.log(board);

    // Read in all the images
    var images = [
        "/images/and-on.svg",
        "/images/and-off.svg",
        "/images/or-on.svg",
        "/images/or-off.svg",
        "/images/not-on.svg",
        "/images/not-off.svg"
    ];
    pieceAssets = new Array(images.length);
    images.forEach(
        function(element, index){
            pieceAssets[index] = new Image();
            pieceAssets[index].src = element;
            pieceAssets[index].onload = redraw;
        }
    );
    
    wireAssets = new Array(16);
    for (var a = 0; a < 2; a++) {
        for (var b = 0; b < 2; b++) {
            for (var c = 0; c < 2; c++) {
                for (var d = 0; d < 2; d++) {
                    var num = a == 1 ? 8 : 0;
                    if (b == 1) num = num | 4;
                    if (c == 1) num = num | 2;
                    if (d == 1) num = num | 1;
                    wireAssets[num] = new Array(2);
                    for (var e = 0; e < 2; e++) {
                        wireAssets[num][e] = new Image();
                        wireAssets[num][e].src = "/images/wires/" + a + "" + b + "" + c + "" + d + "-" + (e == 1 ? "on" : "off") + ".svg";
                    }
                }
            }
        }
    }
    redrawTread = setInterval(lazyRedraw, 1000 / FPS);
});

// TODO replace this with JSON at some point
function toLogicArray(element, className){
    var inputsHTML = Array.from(element.getElementsByClassName(className));
    var inputs = new Array(inputsHTML.lenght);
    inputsHTML.forEach(
        function(input, inputIndex){
            var elementsHTML = Array.from(input.getElementsByTagName("div"));
            inputs[inputIndex] = new Array(elementsHTML.lenght);
            elementsHTML.forEach(
                function(element, elementIndex){
                    inputs[inputIndex][elementIndex] = parseInt(element.innerHTML);
                }
            );
        }
    );
    return inputs;
}

window.addEventListener("resize", function(event){
    board.width = window.innerWidth;
    board.height = window.innerHeight;
    redraw();
});

document.addEventListener("mousedown", function(event){
    mouseX = event.clientX;
    mouseY = event.clientY;
    mouseDown = true;
    currentPiece = board.getPiece(event.clientX, event.clientY);
    board.toogleWire(event.clientX, event.clientY, currentPiece);
});

document.addEventListener("mouseup", function(event){
    mouseDown = false;
    board.setPiece(event.clientX, event.clientY, currentPiece);
    redraw();
});

document.addEventListener("mousemove", function(event){
    if(mouseDown){
        mouseX = event.clientX;
        mouseY = event.clientY;
        board.toogleWire(event.clientX, event.clientY, currentPiece);
    }
});

function redraw(){
    clear(canvas);
    board.draw(canvas);
    if (mouseDown && ![0, null, undefined].includes(currentPiece)) {
        canvas.drawImage(pieceAsset(currentPiece, false), mouseX - (board.unit * 0.6), mouseY - (board.unit * 0.6), board.unit * 1.2, board.unit * 1.2);
    }
}
function lazyRedraw() {
    if(mouseDown) { redraw(); }
}

function clear(canvas){
    if (canvas != null){
        canvas.clearRect(0, 0, window.innerWidth, window.innerHeight);
    }
}
