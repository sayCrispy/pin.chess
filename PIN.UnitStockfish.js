/*global PIN: false, jQuery: false*/

(function (Core, Util, $) {
    "use strict";

    if (!(Core && Util && $)) {
        throw new ReferenceError("Missing one or more dependencies: PIN.Core, PIN.Util, $");
    }

    function createInstance() {
        var shared,
            instance = {};

        shared = {
            fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w",
            inputTime: Util.generateId(),
            outputTime: Util.generateId(),
            inputCalculate: Util.generateId(),
            progress: Util.generateId(),
            innerRoot: Util.generateId(),
            stockfishProgress: "idle"
        };

        function animateProgress(timePassed) {
            var max = $("#" + shared.outputTime).val();
            if ((timePassed <= max) && (shared.stockfishProgress === "running")) {
                $("#" + shared.progress).val((100 / max) * timePassed);
                setTimeout(function () {animateProgress(timePassed + 0.5); }, 500);
            } else {
                $("#" + shared.progress).val(0);
                shared.stockfishProgress = "idle";
            }
        }

        instance.html =
            "<div class='padded' id='" + shared.innerRoot + "'>" +
            "<p><h2>Ask Stockfish</h2><br>" +
            "<p>Time: <input id='" + shared.inputTime + "' type='range' min='1' max='30' step='1' value='5'/>" +
            "<output id='" + shared.outputTime + "'></output> [in seconds]" +
            "<input id='" + shared.inputCalculate + "' type='button' style='float: right;' value='Go Go'/>" +
            "<p><br><progress id='" + shared.progress + "' style='width: 100%;' max='100' value='100'> Progress: </progress>" +
            "</div>";

        instance.$events = {
            time: {
                events: "input",
                selector: "input#" + shared.inputTime,
                data: null,
                handler: function () {
                    $("#" + shared.outputTime).val($("#" + shared.inputTime).val());
                }
            },
            calculate: {
                events: "click",
                selector: "input#" + shared.inputCalculate,
                data: null,
                handler: function () {
                    var position, timeSeconds;
                    if (shared.stockfishProgress !== "idle") {
                        return;
                    }
                    $('#' + shared.innerRoot).addClass('disabled');

                    shared.stockfishProgress = "running";

                    position = shared.fen;
                    timeSeconds = $("#" + shared.inputTime).val();
                    animateProgress(0);
                    $.ajax({
                        url: "http://chess.bunterbunker.org/cgi-bin/bestmove.pl",
                        type: "GET",
                        dataType: "json",
                        data: {
                            position: position,
                            time: timeSeconds * 1000
                        },
                        success: function (response) {
                            Core.log("Stockfish calculation successful.");
                            if (response.status === "success") {
                                Core.trigger("stockfish:data", {
                                    hash: {
                                        pinId: position,
                                        time: timeSeconds,
                                        score: response.score,
                                        moves: response.moves
                                    }
                                });
                            }
                            if (response.status === "busy") {
                                shared.stockfishProgress = "interrupt";
                                Core.trigger("stockfish:network", {
                                    type: "cgi",
                                    status: "occupied"
                                });
                            }
                            $('#' + shared.innerRoot).removeClass('disabled');
                        },
                        error: function (error) {
                            Core.error("Error with cgi: " + error);
                            $('#' + shared.innerRoot).removeClass('disabled');
                        }
                    });
                }
            }
        };

        instance.systemEvents = {
            boardInput: {
                events: "board:input",
                handler: function(data) {
                    shared.fen = data.fenString;
                }
            }
        };

        instance.start = function () {
            $("#" + shared.outputTime).val($("#" + shared.inputTime).val());
        };
        instance.stop = function () {
        };
        return instance;
    }

    Core.registerUnit("UnitStockfish", {
        createInstance: createInstance
    });
}(PIN.Core, PIN.Util, jQuery));