var board;
var mouseDown;
var mouseX, mouseY;
var pieceAssets;
var wireAssets;
var portAssets;
var currentPiece;
// clearInterval(processor);

// This will return the image that is associated with a piece number then the given state if on or off
function pieceAsset(num, bool) {
    if (num > 0) return pieceAssets[(2 * num) - (bool ? 1 : 2)];
}

function wireAsset(num, bool) {
    return wireAssets[num][bool ? 1 : 0];
}

document.addEventListener("DOMContentLoaded", function(event){
    initCanvas();
    mouseDown = false;
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
        "/images/and-off.svg",
        "/images/and-on.svg",
        "/images/or-off.svg",
        "/images/or-on.svg",
        "/images/not-off.svg",
        "/images/not-on.svg"
    ];
    pieceAssets = new Array(images.length);
    images.forEach(
        function(element, index){
            pieceAssets[index] = new Image();
            pieceAssets[index].src = element;
            pieceAssets[index].onload = redraw;
        }
    );

    // Read in all the images
    images = [
        "/images/input-off.svg",
        "/images/input-on.svg",
        "/images/output-off.svg",
        "/images/output-correct.svg",
        "/images/output-incorrect.svg"
    ];
    portAssets = new Array(images.length);
    images.forEach(
        function(element, index){
            portAssets[index] = new Image();
            portAssets[index].src = element;
            portAssets[index].onload = redraw;
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
    startRedraw();
    currentPiece = board.getPiece(event.clientX, event.clientY);
    board.toogleWire(event.clientX, event.clientY, currentPiece);
});

document.addEventListener("mouseup", function(event){
    stopRedraw();
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

