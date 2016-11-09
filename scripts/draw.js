var FPS = 60;
var canvas;

function initCanvas() {
    canvas = document.getElementsByTagName("canvas")[0].getContext("2d");
}

function draw(board, canvas) {
    canvas.fillStyle = "#222222";
    canvas.fillRect(
        board.boardX - 5,
        board.boardY - 5,
        board.boardWidth + 10,
        board.boardHeight + board.unit + 20
    );
    for (var x = 0; x < board.gameWidth; x++) {
        for (var y = 0; y < board.gameHeight; y++) {
            canvas.fillStyle = "#111111";
            canvas.fillRect(
                board.unit * x + board.boardX,
                board.unit * y + board.boardY,
                board.unit,
                board.unit
            );
            canvas.fillStyle = "#000000";
            canvas.fillRect(
                board.unit * x + board.boardX + 5,
                board.unit * y + board.boardY + 5,
                board.unit - 10,
                board.unit - 10
            );
            if (board.layout[x][y] != null) {
                canvas.drawImage(
                    wireAsset(board.wireStyle[x][y], true),
                    board.unit * x + board.boardX,
                    board.unit * y + board.boardY,
                    board.unit,
                    board.unit
                );
            }
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
    board.inputLocations.forEach(
        function(element, index){
            canvas.drawImage(
                portAssets[board.inputs[index][0]],
                board.boardX,
                board.unit * element + board.boardY,
                board.unit,
                board.unit
            );
        }
    );
    board.outputLocations.forEach(
        function(element, index){
            canvas.drawImage(
                portAssets[2],
                (board.unit * (board.gameWidth - 1)) + board.boardX,
                board.unit * element + board.boardY,
                board.unit,
                board.unit
            );
        }
    );
    for (var x = 0; x < board.gameWidth; x++) {
        canvas.fillStyle = "#333333";
        canvas.fillRect(
            board.unit * x + board.boardX,
            board.boardHeight + board.boardY + 10,
            board.unit,
            board.unit
        );
        canvas.fillStyle = "#222222";
        canvas.fillRect(
            board.unit * x + board.boardX + 5,
            board.boardHeight + board.boardY + 15,
            board.unit - 10,
            board.unit - 10
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
        canvas.fillStyle = "#000000"
        canvas.fillRect(0, 0, window.innerWidth, window.innerHeight);
    }
}
