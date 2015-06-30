/*global PIN: false*/

(function (Core) {
    "use strict";

    if (!(Core)) {
        throw new ReferenceError("Missing one or more dependencies: PIN.Core");
    }

    function createInstance() {
        var shared = {},
            instance = {};

        instance.html =
            "<div>" +
            "<h2>chess.</h2>" +
            "<h1>bunterBunker</h1><br>" +
            "</div>";

        instance.$events = {};
        instance.systemEvents = {};

        instance.start = function () {
        };
        instance.stop = function () {
        };

        return instance;
    }

    Core.registerUnit("UnitBanner", {
        createInstance: createInstance
    });
}(PIN.Core));