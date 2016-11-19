//= require board
//= require draw
var board;
var mouseDown;
var mouseX, mouseY;
var pieceAssets;
var wireAssets;
var portAssets;
var currentPiece;
// clearInterval(processor);

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
    startCycle();
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
                    inputs[inputIndex][elementIndex] = parseInt(element.innerHTML) == 1;
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

var cycle;
function startCycle() {
    if (cycle == null) {
        cycle = setInterval(function() {
            board.nextState();
            board.calc();
            redraw();
        }, 1000 * 1);
    }
}
// I have yet to use this
function stopCycle() {
    if (cycle != null) {
        clearInterval(cycle);
        cycle = null;
    }
}

function testSolution() {
    var answer = true;
    for (var state = 0; answer && state < board.inputs[0].length; state++) {
        board.calcState(state);
        for (var index = 0; answer && index < board.outputLocations.length; index++) {
            var element = board.outputLocations[index];
            // This is just weird
            var temp = board.answer[board.gameWidth - 1][element] == undefined ? false : board.answer[board.gameWidth - 1][element];
            answer = (board.outputs[index][state] == temp);
        }
    }
    alert(answer.toString());
}
