/*global PIN: false, jQuery: false, Chess: false, ChessBoard: false*/

(function (Core, Util, $) {
    "use strict";

    if (!(Core && Util && $)) {
        throw new ReferenceError("Missing one or more dependencies: PIN.Core, PIN.Util, $");
    }

    function createInstance() {

        var shared = {
            time: 5000,
            innerRoot: Util.generateId(),
            player: Util.generateId(),
            inputFlip: Util.generateId(),
            inputRollback: Util.generateId()
        },
            instance = {};

        function spreadPosition(fenString) {
            Core.trigger("board:input", {
                fenString: fenString
            });
        }

        function displayPlayer() {
            if (shared.chess.turn() === "w") {
                $("#" + shared.player).html("White's move");
            } else {
                $("#" + shared.player).html("Black's move");
            }
        }

        shared.history = (function () {
            var history = [];
            return {
                rollback: function () {
                    if (history.length === 1) {
                        return;
                    }
                    Core.log("Reversing Move: " + history.pop());
                    shared.chess.load(history.pop());
                    shared.board.position(shared.chess.fen());
                    displayPlayer();
                    shared.history.addMove(shared.chess.fen());
                    spreadPosition(shared.chess.fen());
                },
                addMove: function (fen) {
                    history.push(fen);
                }
            };
        }());

        instance.html =
            "<div id='" + shared.innerRoot + "'>" +
            "<span id='" + shared.player + "'></span>" +
            "<div id='board'></div>" +
            "<div><input id='" + shared.inputFlip + "' type='button' style='float: right;' value='Flip Board'>" +
            "<input id='" + shared.inputRollback + "' type='button' value='Reverse last Move'></div>" +
            "</div>";

        instance.$events = {
            flipBoard: {
                events: "click",
                selector: "input#" + shared.inputFlip,
                data: null,
                handler: function () {
                    shared.board.flip();
                }
            },
            rollback: {
                events: "click",
                selector: "input#" + shared.inputRollback,
                data: null,
                handler: function () {
                    shared.history.rollback();
                }
            }
        };

        instance.systemEvents = {
        };

        instance.start = function () {
            shared.chess = new Chess();
            shared.board = new ChessBoard('board', {
                position: shared.chess.fen(),
                draggable: true,
                // following code copied and modified from: http://chessboardjs.com/examples#5000
                onDragStart: function (source, piece, position, orientation) {
                    if (shared.chess.game_over() === true ||
                            (shared.chess.turn() === 'w' && piece.search(/^b/) !== -1) ||
                            (shared.chess.turn() === 'b' && piece.search(/^w/) !== -1)) {
                        return false;
                    }
                },
                onDrop: function (source, target) {
                    var move = shared.chess.move({
                        from: source,
                        to: target,
                        promotion: 'q'
                    });

                    if (move === null) {
                        return 'snapback';
                    }
                },
                onSnapEnd: function () {
                    shared.board.position(shared.chess.fen());
                    displayPlayer();
                    shared.history.addMove(shared.chess.fen());
                    spreadPosition(shared.chess.fen());
                }
                // end of copied code
            });
            shared.history.addMove(shared.chess.fen());
            displayPlayer();
        };

        return instance;
    }

    Core.registerUnit("UnitChessBoard", {
        createInstance: createInstance
    });
}(PIN.Core, PIN.Util, jQuery));