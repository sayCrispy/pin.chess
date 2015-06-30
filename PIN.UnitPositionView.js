/*global PIN: false, jQuery: false*/

(function (Core, Util, $) {
    "use strict";

    if (!(Core && Util && $)) {
        throw new ReferenceError("Missing one or more dependencies: PIN.Module, PIN.Model, $");
    }

    function createInstance() {
        var shared,
            instance = {};

        shared = {
            outputTime: Util.generateId(),
            outputScore: Util.generateId(),
            outputMoves: Util.generateId()
        };

        function displayPosition(position) {
            $("#" + shared.outputTime).val(position.time);
            $("#" + shared.outputScore).val(position.score);
            $("#" + shared.outputMoves).val(position.moves);
        }

        instance.html =
            "<div class='padded'><p><h2>Evaluation</h2><br>" +
            "<p>Time spent: <output id='" + shared.outputTime + "' style='float: right;'/>" +
            "<p>Score: <output id='" + shared.outputScore + "' style='float: right;'/>" +
            "<p>Best Moves:<output id='" + shared.outputMoves + "' style='float: right;'/>" +
            "</div>";

        instance.$events = {};

        instance.systemEvents = {
            modelPositionData: {
                events: "model:change",
                handler: function (hash) {
                    displayPosition(hash);
                }
            }
        };

        instance.start = function () {
        };

        instance.stop = function () {
        };

        return instance;
    }

    Core.registerUnit("UnitPositionView", {
        createInstance: createInstance
    });
}(PIN.Core, PIN.Util, jQuery));