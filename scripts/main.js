class Board {
    constructor(width, height){
        this.width = width;
        this.height = height;
    }

    boardWidth(){
        return this.width - 20;
    }

    boardHeight(){
        return this.width - 20;
    }

    boardX(){
        return 10;
    }

    boardY(){
        return 10;
    }
}

var board;
var canvas;

window.addEventListener("DOMContentLoaded", function(){
    board = new Board(window.innerWidth, window.innerHeight);
    canvas = document.getElementById("canvas").getContext("2d");
    repaint();
    alert(board.boardWidth() + "x" + board.boardHeight());
});

function repaint(canvas){
    clear(canvas);
    canvas.fillRect(25,25,100,100);
}

function clear(canvas){
    if (canvas != null){
        canvas.clearRect(0, 0, window.innerWidth, window.innerHeight);
    }
}
