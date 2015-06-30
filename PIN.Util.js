/*global PIN: false*/

(function (PIN, Math) {
    "use strict";

    if (!(PIN && Math)) {
        throw new ReferenceError("Missing one or more dependencies: PIN, Math");
    }

    var createTimer;

    createTimer = function () {
        var tt = {};

        function getTime() {
            var date = new Date();
            return date.getTime();
        }

        return {
            start: function (id) {
                tt[id] = getTime();
            },
            stop: function (id) {
                var endTime = getTime(),
                    time = 0;

                if (tt.hasOwnProperty(id)) {
                    time = endTime - tt[id];
                    delete tt[id];
                }
                return time;
            }
        };
    };

    PIN.Util = {
        getTimer: function () {
            return createTimer();
        },
        generateId: (function () {
            var counter = 0;

            return function generateId() {
                var id = Math.random() * 1000;
                counter = counter + 10000;
                id = Math.round(id);
                id = counter + id;
                id = id.toString();
                return id;
            };
        }())
    };

}(PIN, Math));