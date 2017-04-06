var gameService = gamingPlatform.gameService;
var alphaBetaService = gamingPlatform.alphaBetaService;
var translate = gamingPlatform.translate;
var resizeGameAreaService = gamingPlatform.resizeGameAreaService;
var log = gamingPlatform.log;
var dragAndDropService = gamingPlatform.dragAndDropService;
var gameLogic;
(function (gameLogic) {
    gameLogic.ROWS = 4;
    gameLogic.COLS = 4;
    gameLogic.SIZE = gameLogic.ROWS * gameLogic.COLS / 2;
    /** Returns the initial TicTacToe board, which is a ROWSxCOLS matrix containing ''. */
    function getInitialBoards() {
        var board = [];
        var shownBoard = [];
        var counts = [];
        for (var i = 0; i < gameLogic.SIZE; i++) {
            counts[i] = 0;
        }
        for (var i = 0; i < gameLogic.ROWS; i++) {
            board[i] = [];
            shownBoard[i] = [];
            for (var j = 0; j < gameLogic.COLS; j++) {
                var n = 0;
                while (counts[n] >= 2) {
                    n = Math.floor(Math.random() * gameLogic.SIZE);
                }
                counts[n]++;
                board[i][j] = n;
                shownBoard[i][j] = -1;
            }
        }
        return [board, shownBoard];
    }
    gameLogic.getInitialBoards = getInitialBoards;
    function getInitialState() {
        var initBoards = getInitialBoards();
        return { board: initBoards[0], shownBoard: initBoards[1], delta1: null, delta2: null };
    }
    gameLogic.getInitialState = getInitialState;
    /**
     *
     */
    function hasEmptyGrid(board) {
        for (var i = 0; i < gameLogic.ROWS; i++) {
            for (var j = 0; j < gameLogic.COLS; j++) {
                if (board[i][j] === -1) {
                    // If there is an empty cell then we do not have a tie.
                    return true;
                }
            }
        }
        // No empty cells, so we have a tie!
        return false;
    }
    /**
     *
     */
    function computeScores(board) {
        // scan the board and compute the socre
        var score0 = 0;
        var score1 = 0;
        for (var i = 0; i < gameLogic.ROWS; i++) {
            for (var j = 0; j < gameLogic.COLS; j++) {
                if (board[i][j] == 0) {
                    score0++;
                }
                else if (board[i][j] == 1) {
                    score1++;
                }
            }
        }
        return [score0, score1];
    }
    /**
     * Returns the move that should be performed when player
     * with index turnIndexBeforeMove makes a move in cell row X col.
     */
    function createMove(stateBeforeMove, row, col, turnIndexBeforeMove) {
        if (!stateBeforeMove) {
            stateBeforeMove = getInitialState();
        }
        var board = stateBeforeMove.shownBoard;
        if (board[row][col] !== -1) {
            throw new Error("One can only make a move in an empty position!");
        }
        if (!hasEmptyGrid(board)) {
            throw new Error("Can only make a move if the game is not over!");
        }
        var boardAfterMove = angular.copy(board);
        boardAfterMove[row][col] = turnIndexBeforeMove === 0 ? 1 : 0;
        var scores = computeScores(boardAfterMove);
        var endMatchScores;
        var turnIndex;
        if (!hasEmptyGrid(boardAfterMove)) {
            // Game over.
            turnIndex = -1;
            if (scores[0] > scores[1]) {
                endMatchScores = [1, 0];
            }
            else if (scores[0] < scores[1]) {
                endMatchScores = [0, 1];
            }
            else {
                endMatchScores = [0, 0];
            }
        }
        else {
            // Game continues. Now it's the opponent's turn (the turn switches from 0 to 1 and 1 to 0).
            turnIndex = 1 - turnIndexBeforeMove;
            endMatchScores = null;
        }
        var delta = { row: row, col: col };
        var state = { delta1: delta, delta2: null, shownBoard: boardAfterMove,
            board: stateBeforeMove.board };
        if (stateBeforeMove.delta2 == null) {
            state = { delta1: stateBeforeMove.delta1, delta2: delta, shownBoard: boardAfterMove,
                board: stateBeforeMove.board };
        }
        return {
            endMatchScores: endMatchScores,
            turnIndex: turnIndex,
            state: state
        };
    }
    gameLogic.createMove = createMove;
    function checkMatch(state) {
        var delta1 = state.delta1;
        var delta2 = state.delta2;
        var board = state.board;
        if (delta1 != null && delta2 != null) {
            if (board[delta1.row][delta1.col] != board[delta2.row][delta2.col]) {
                state.shownBoard[delta1.row][delta1.col] = -1;
                state.shownBoard[delta2.row][delta2.col] = -1;
            }
        }
    }
    gameLogic.checkMatch = checkMatch;
    function createInitialMove() {
        return { endMatchScores: null, turnIndex: 0,
            state: getInitialState() };
    }
    gameLogic.createInitialMove = createInitialMove;
    function forSimpleTestHtml() {
        var move = gameLogic.createMove(null, 0, 0, 0);
        log.log("move=", move);
    }
    gameLogic.forSimpleTestHtml = forSimpleTestHtml;
})(gameLogic || (gameLogic = {}));
//# sourceMappingURL=gameLogic.js.map