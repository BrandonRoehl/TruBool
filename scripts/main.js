class Board {
    constructor(width, height, gameWidth, gameHeight, inputs, outputs, pieces){
        this.layout = new Array(gameWidth);
        for(var i = 0; i < gameWidth; i++){
            this.layout[i] = new Array(gameHeight);
        }
        this.width = width;
        this.height = height;
        this.inputs = inputs;
        this.outputs = outputs;
        this.pieces = pieces;
    }

    set width(width){
        this._width = width;
        this.updateBoardDim();
    }

    get width(){
        return this._width;
    }

    set height(height){
        this._height = height;
        this.updateBoardDim();
    }

    get height(){
        return this._height;
    }

    updateBoardDim(){
        // Find a scale unit on the board
        // This is the number of pixels a square takes up
        var unitWidth = this.width / this.gameWidth;
        var unitHeight = this.height / this.gameHeight;
        if (unitWidth < unitHeight) {
            this._unit = unitWidth;
        } else {
            this._unit = unitHeight;
        }
    }

    get scale(){
        return this._scale;
    }

    get boardWidth(){
        return this.width - 20;
    }

    get boardHeight(){
        return this.height - 20;
    }

    get boardX(){
        return 10;
    }

    get boardY(){
        return 10;
    }

    get gameWidth(){
        return this.layout.length;
    }

    get gameHeight(){
        return this.layout[0].length;
    }

    draw(canvas){
        canvas.fillStyle = "#000000";
        canvas.fillRect(this.boardX ,this.boardY, this.boardWidth, this.boardHeight);
    }
}

var board;
var canvas;
var mouseDown;
var mouseX, mouseY;

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

    repaint();
    alert(board.gameWidth + " X " + board.gameHeight);
});

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
    repaint();
});

document.addEventListener("mousedown", function(event){
    mouseDown = true;
    repaint();
});

document.addEventListener("mouseup", function(event){
    mouseDown = false;
    repaint();
});

document.addEventListener("mousemove", function(event){
    mouseX = event.clientX;
    mouseY = event.clientY;
    repaint();
});

function repaint(){
    clear(canvas);
    board.draw(canvas);
    if (mouseDown) {
        canvas.fillStyle = "#ffffff";
        canvas.fillRect(mouseX - 50, mouseY - 50, 100, 100);
    }
}

function clear(canvas){
    if (canvas != null){
        canvas.clearRect(0, 0, window.innerWidth, window.innerHeight);
    }
}
