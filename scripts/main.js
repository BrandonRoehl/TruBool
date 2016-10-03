class Board {
    constructor(width, height, gameWidth, gameHeight){
        this.width = width;
        this.height = height;
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
    }

    boardWidth(){
        return this.width - 20;
    }

    boardHeight(){
        return this.height - 20;
    }

    boardX(){
        return 10;
    }

    boardY(){
        return 10;
    }

    draw(canvas){
        canvas.fillStyle = "#000000";
        canvas.fillRect(this.boardX(),this.boardY(),this.boardWidth(),this.boardHeight());
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

    console.log(toLogicArray(gameBoard, "input"));
    console.log(toLogicArray(gameBoard, "output"));

    board = new Board(
        window.innerWidth,
        window.innerHeight,
        parseInt(gameBoard.getElementsByClassName("width")[0].innerHTML),
        parseInt(gameBoard.getElementsByClassName("height")[0].innerHTML)
    );

    console.log(board);

    repaint();
    alert(board.boardWidth() + "x" + board.boardHeight());
    console.log("This is a test");
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
