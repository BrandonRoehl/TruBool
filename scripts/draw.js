var FPS = 60;
var canvas;

function initCanvas() {
    canvas = document.getElementsByTagName("canvas")[0].getContext("2d");
}

function draw(board, canvas) {
    var color = false;
    var flipColor = board.gameWidth % 2 != 0;
    for (var x = 0; x < board.gameWidth; x++) {
        if (flipColor) color = !color;
        for (var y = 0; y < board.gameHeight; y++) {
            color = !color;
            canvas.fillStyle = color ? "#111111" : "#222222";
            canvas.fillRect(
                board.unit * x + board.boardX,
                board.unit * y + board.boardY,
                board.unit,
                board.unit
            );
            if (board.layout[x][y] == 0) {
                canvas.drawImage(
                    wireAsset(board.wireStyle[x][y], true),
                    board.unit * x + board.boardX,
                    board.unit * y + board.boardY,
                    board.unit,
                    board.unit
                );
            } else {
                var piece = pieceAsset(board.layout[x][y], true);
                if (piece != null) {
                    canvas.drawImage(
                        piece,
                        board.unit * x + board.boardX,
                        board.unit * y + board.boardY,
                        board.unit,
                        board.unit
                    );
                }
            }
        }
    }
    for (var x = 0; x < board.gameWidth; x++) {
        color = !color;
        canvas.fillStyle = color ? "#111111" : "#222222";
        canvas.fillRect(
            board.unit * x + board.boardX,
            board.boardHeight + board.boardY + 10,
            board.unit,
            board.unit
        );
        if (x < board.pieces.length) {
            canvas.drawImage(
                pieceAsset(board.pieces[x], false),
                board.unit * x + board.boardX,
                board.boardHeight + board.boardY + 10,
                board.unit,
                board.unit
            );
        }
    }
}

function redraw() {
    clear(canvas);
    draw(board, canvas);
    if (mouseDown && ![0, null, undefined].includes(currentPiece)) {
        canvas.drawImage(
            pieceAsset(currentPiece, false),
            mouseX - (board.unit * 0.6),
            mouseY - (board.unit * 0.6),
            board.unit * 1.2,
            board.unit * 1.2
        );
    }
}

var redrawTread;
function startRedraw() {
    if (redrawTread == null) {
        redrawTread = setInterval(redraw, 1000 / FPS);
    }
}

function stopRedraw() {
    if (redrawTread != null) {
        clearInterval(redrawTread);
        redrawTread = null;
    }
}

function clear(canvas) {
    if (canvas != null){
        canvas.clearRect(0, 0, window.innerWidth, window.innerHeight);
    }
}
