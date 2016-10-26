class Board {
    // Creates a new board object
    // This is the stuff that should be coming from the view
    constructor(width, height, gameWidth, gameHeight, inputs, outputs, pieces){
        this.layout = new Array(gameWidth);
        for(var i = 0; i < gameWidth; i++){
            this.layout[i] = new Array(gameHeight);
        }
        this.wireStyle = new Array(gameWidth);
        for(var i = 0; i < gameWidth; i++){
            this.wireStyle[i] = new Array(gameHeight);
        }
        this.width = width;
        this.height = height;
        this.inputs = inputs;
        this.outputs = outputs;
        this.pieces = pieces;
    }

    // Uses "private" vars so we also calc dim unit size
    set width(width) {
        this._width = width;
        this.updateBoardDim();
    }
    get width() {
        return this._width;
    }
    set height(height) {
        this._height = height;
        this.updateBoardDim();
    }
    get height() {
        return this._height;
    }

    // Dinamicaly set the unit scale of pieces based on the new width and height
    updateBoardDim() {
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

    // Returns the private unit calculation
    get unit() {
        return this._unit;
    }

    // Commom values that are needed in a lot of places so can be got
    // as if they were variables themselves
    get boardWidth() { return this.unit * this.gameWidth; }
    get boardHeight() { return this.unit * this.gameHeight; }
    get boardX() { return (this.width - this.boardWidth) / 2; }
    get boardY() { return ((this.height - this.boardHeight - this.unit) / 2) - 5; }
    get gameWidth() { return this.layout.length; }
    get gameHeight() { return this.layout[0].length; }

    // These are common calculations that require extra bits of info such as x and y cords
    getBoardX(x) { return Math.trunc((x - this.boardX) / this.unit); }
    getBoardY(y) { return Math.trunc((y - this.boardY) / this.unit); }
    onBoard(x, y) { return 0 <= y && 0 <= x && y < this.gameHeight && x < this.gameWidth}

    /**
     * Returns a piece from the board and removes it from the board
     * based on x and y cordanate location
     *
     * @param x corordanate on the canvas that was drawn to
     * @param y corordanate on the canvas that was drawn to
     * @return game piece
     */
    getPiece(x, y) {
        // Start by seeing if the piece is in the y height of the dock
        var tmp = (y - this.boardY - this.boardHeight - 10);
        if (tmp > 0 && tmp < this.unit) {
            // Then check to see if there is a piece there for it
            tmp = this.getBoardX(x);
            if (0 <= tmp && tmp < this.pieces.length){
                // If there is remove the piece from the list and return it
                return this.pieces.splice(tmp, 1)[0];
            }
        } else {
            // Start by seing if the x, y is on the board
            var cx = this.getBoardX(x);
            var cy = this.getBoardY(y);
            if (this.onBoard(cx, cy)) {
                // If it is remove it and return it
                tmp = this.layout[cx][cy];
                this.layout[cx][cy] = undefined;
                this._updateWire(cx, cy);
                return tmp;
            }
        }
        return null;
    }

    /**
     * This sets a piece on the board based on screen cords to a piece id that is passed in
     *
     * @param x corodanate on the canvas that is drawn to
     * @param y corodanate on the canvas that is drawn to
     * @param p an id identifying what piece to place
     */
    setPiece(x, y, p) {
        // Make sure there is a piece and its not wire
        if (![0, null, undefined].includes(p)) {
            var cx = this.getBoardX(x);
            var cy = this.getBoardY(y);
            // Check to see if the location is on the board and the board doesn't already have a piece there
            if (this.onBoard(cx, cy) && [0, null, undefined].includes(this.layout[cx][cy])) {
                // If its good add it to the locaiton
                this.layout[cx][cy] = p;
                this._updateWire(cx, cy);
            } else {
                // The spot was invalid so we should add it to the end of the palate so we don't loose it
                this.pieces.push(p);
            }
        }
    }

    /**
     * This is for the drawing of wires on the board
     *
     * @param x corodanate on the canvas that is drawn to
     * @param y corodanate on the canvas that is drawn to
     * @param p an id identifying what piece was last clicked on
     */
    toogleWire(x, y, piece) {
        // If the piece that was given is a wire or nothing
        if ([0, null, undefined].includes(piece)) {
            var cx = this.getBoardX(x);
            var cy = this.getBoardY(y);
            // If the spot was on the board and not a piece
            if (this.onBoard(cx, cy) && [0, null, undefined].includes(this.layout[cx][cy])) {
                // Then set it to the oposite of the piece given
                this.layout[cx][cy] = (piece == 0) ? undefined : 0;
                this._updateWire(cx, cy);
            }
        }
    }

    // Only update the wires around the new one
    _updateWire(x, y) {
        this._setWire(i, y);
        if (x > 0) this._setWire(x - 1, y);
        if (x < this.gameWidth - 1) this._setWire(x + 1,  y);
        if (y > 0) this._setWire(x, y - 1);
        if (y < this.gameHeight - 1) this._setWire(x,  y + 1);
    }
    _setWire(x , y) {
        // console.log(x + " " + y);
        if(this.layout[x][y] == 0) {
            var sides = new Array(4);
            // Left
            sides[0] = (x > 1 && [0, 1, 2, 3].includes(this.layout[x - 1][y]));
            // Right
            sides[1] = (x < this.gameWidth - 1 && [0, 3].includes(this.layout[x + 1][y]));
            // Top
            sides[2] = (y > 0 && [0, 1, 2, 3].includes(this.layout[x][y - 1]));
            // Bottom
            sides[3] = (y < this.gameHeight - 1 && [0, 1, 2, 3].includes(this.layout[x][y + 1]));

            var num = 0
            sides.forEach(function(element, index, array){
                if (element) num = num | Math.pow(2, array.length - 1 - index);
            });
            this.wireStyle[x][y] = num;
        } else {
            this.wireStyle[x][y] = null;
        }
        // console.log(this.wireStyle);
    }

    draw (canvas) {
        var color = false;
        var flipColor = this.gameWidth % 2 != 0;
        for (var x = 0; x < this.gameWidth; x++) {
            if (flipColor) color = !color;
            for (var y = 0; y < this.gameHeight; y++) {
                color = !color;
                canvas.fillStyle = color ? "#111111" : "#222222";
                canvas.fillRect(
                    this.unit * x + this.boardX,
                    this.unit * y + this.boardY,
                    this.unit,
                    this.unit
                );
                if (this.layout[x][y] == 0) {
                    canvas.drawImage(
                        wireAsset(this.wireStyle[x][y], true),
                        this.unit * x + this.boardX,
                        this.unit * y + this.boardY,
                        this.unit,
                        this.unit
                    );
                } else {
                    var piece = pieceAsset(this.layout[x][y], true);
                    if (piece != null) {
                        canvas.drawImage(
                            piece,
                            this.unit * x + this.boardX,
                            this.unit * y + this.boardY,
                            this.unit,
                            this.unit
                        );
                    }
                }
            }
        }
        for (var x = 0; x < this.gameWidth; x++) {
            color = !color;
            canvas.fillStyle = color ? "#111111" : "#222222";
            canvas.fillRect(
                this.unit * x + this.boardX,
                this.boardHeight + this.boardY + 10,
                this.unit,
                this.unit
            );
            if (x < this.pieces.length) {
                canvas.drawImage(
                    pieceAsset(this.pieces[x], false), 
                    this.unit * x + this.boardX,
                    this.boardHeight + this.boardY + 10,
                    this.unit,
                    this.unit
                );
            }
        }
    }
}
