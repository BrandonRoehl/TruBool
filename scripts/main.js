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
        var unitWidth = (this.width - 20) / this.gameWidth;
        var unitHeight = (this.height - 30) / (this.gameHeight + 1);
        if (unitWidth < unitHeight) {
            this._unit = unitWidth;
        } else {
            this._unit = unitHeight;
        }
    }

    get unit(){
        return this._unit;
    }

    get boardWidth(){
        return this.unit * this.gameWidth;
    }

    get boardHeight(){
        return this.unit * this.gameHeight;
    }

    get boardX(){
        return (this.width - this.boardWidth) / 2;
    }

    get boardY(){
        return ((this.height - this.boardHeight - this.unit) / 2) - 5;
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
        var color = false;
        for(var x = 0; x < this.gameWidth; x++){
            if (this.gameWidth % 2 != 0) color = !color;
            for(var y = 0; y < this.gameHeight; y++){
                color = !color;
                canvas.fillStyle = color ? "#555555" : "#333333";
                canvas.fillRect(this.unit * x + this.boardX, this.unit * y + this.boardY, this.unit, this.unit);
                var piece = pieceAsset(this.layout[x][y], false);
                if (piece != null) {
                    canvas.drawImage(piece, this.unit * x + this.boardX, this.unit * y + this.boardY, this.unit, this.unit);
                }
            }
        }
        for(var x = 0; x < this.gameWidth; x++){
            color = !color;
            canvas.fillStyle = color ? "#555555" : "#333333";
            canvas.fillRect(this.unit * x + this.boardX, this.boardHeight + this.boardY + 10, this.unit, this.unit);
            if(x < this.pieces.length){
                canvas.drawImage(pieceAsset(this.pieces[x], false), this.unit * x + this.boardX, this.boardHeight + this.boardY + 10, this.unit, this.unit);
            }
        }
    }

    getPiece(x, y) {
        var tmp = (y - this.boardY - this.boardHeight - 10);
        if (tmp > 0 && tmp < this.unit) {
            tmp = this.getBoardX(x);
            if (0 <= tmp && tmp < this.pieces.length){
                return this.pieces.splice(tmp, 1);
            }
        } else {
            var cx = this.getBoardX(x);
            var cy = this.getBoardY(y);
            if (this.onBoard(cx, cy)) {
                tmp = this.layout[cx][cy];
                this.layout[cx][cy] = undefined;
                return tmp;
            }
        }
        return null;
    }

    setPiece(x, y, p) {
        if (![0, null, undefined].includes(p)) {
            var cx = this.getBoardX(x);
            var cy = this.getBoardY(y);
            if (this.onBoard(cx, cy) && [0, null, undefined].includes(this.layout[cx][cy])) {
                this.layout[cx][cy] = p;
            } else {
                this.pieces.push(p);
            }
        }
    }

    toogleWire(x, y, piece) {
        if ([0, null, undefined].includes(piece)) {
            var cx = this.getBoardX(x);
            var cy = this.getBoardY(y);
            if (this.onBoard(cx, cy) && [0, null, undefined].includes(this.layout[cx][cy])) {
                this.layout[cx][cy] = (piece == 0) ? undefined : 0;
            }
        }
    }

    getBoardX(x) { return Math.trunc((x - this.boardX) / this.unit); }
    getBoardY(y) { return Math.trunc((y - this.boardY) / this.unit); }
    onBoard(x, y) { return 0 <= y && 0 <= x && y < this.gameHeight && x < this.gameWidth}
}

var board;
var canvas;
var mouseDown;
var mouseX, mouseY;
var pieceAssets;
var wireAssets;
var currentPiece;

// This will return the image that is associated with a piece number then the given state if on or off
function pieceAsset(num, bool) { 
    if (num > 0) {
        return pieceAssets[(2 * num) - (bool ? 2 : 1)];
    } else if (num == 0) {
        return wireAssets[1];
    }
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
        }
    );

    // Read in all the images
    images = [
        "/images/0-on.svg",
        "/images/0-off.svg",
        "/images/1-on.svg",
        "/images/1-off.svg",
        "/images/2c-on.svg",
        "/images/2c-off.svg",
        "/images/2s-on.svg",
        "/images/2s-off.svg",
        "/images/3-on.svg",
        "/images/3-off.svg",
        "/images/4-on.svg",
        "/images/4-off.svg"
    ];
    wireAssets = new Array(images.length);
    images.forEach(
        function(element, index){
            wireAssets[index] = new Image();
            wireAssets[index].src = element;
        }
    );

    repaint();
    // This gives it 100ms to actualy load the assets
    setInterval(repaint, 100);
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
    mouseX = event.clientX;
    mouseY = event.clientY;
    mouseDown = true;
    currentPiece = board.getPiece(event.clientX, event.clientY);
    board.toogleWire(event.clientX, event.clientY, currentPiece);
    repaint();
});

document.addEventListener("mouseup", function(event){
    mouseDown = false;
    board.setPiece(event.clientX, event.clientY, currentPiece);
    repaint();
});

document.addEventListener("mousemove", function(event){
    if(mouseDown){
        mouseX = event.clientX;
        mouseY = event.clientY;
        board.toogleWire(event.clientX, event.clientY, currentPiece);
        repaint();
    }
});

function repaint(){
    clear(canvas);
    board.draw(canvas);
    if (mouseDown && ![0, null, undefined].includes(currentPiece)) {
        canvas.drawImage(pieceAsset(currentPiece, false), mouseX - (board.unit * 0.6), mouseY - (board.unit * 0.6), board.unit * 1.2, board.unit * 1.2);
    }
}

function clear(canvas){
    if (canvas != null){
        canvas.clearRect(0, 0, window.innerWidth, window.innerHeight);
    }
}
