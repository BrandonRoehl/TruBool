class Board {
    constructor(width, height){
        this.width = width;
        this.height = height;
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
    board = new Board(window.innerWidth, window.innerHeight);
    canvas = document.getElementsByTagName("canvas")[0].getContext("2d");
    isMouseDown = false;
    repaint();
    alert(board.boardWidth() + "x" + board.boardHeight());
});

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
