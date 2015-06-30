/*global PIN: false, jQuery: false*/

(function (Core, Util, $) {
    "use strict";

    /*
     *  test if arguments are defined
     *  any missing depencies should result in an exception
     */

    if (!(Core)) {
        throw new ReferenceError("Missing one or more dependencies: PIN.Core, PIN.Util, jQuery");
    }

    function createInstance() {

        /*
         *  shared:     Data shared between the module's private functions
         *  instance:   Data used for module creation +
         *              handlers for intermodule communication
         */

        var shared,
            log,
            instance = {};

        shared = {
            outputLog: Util.generateId(),
            inputToggleSystem: Util.generateId(),
            inputToggleParse: Util.generateId(),
            inputToggleNetwork: Util.generateId(),
            inputToggleLog: Util.generateId(),
            inputToggleError: Util.generateId(),
            inputClear: Util.generateId()
        };

        log = (function () {
            var visibility  = {};

            visibility[shared.inputToggleSystem] = false;
            visibility[shared.inputToggleParse] = false;
            visibility[shared.inputToggleNetwork] = false;
            visibility[shared.inputToggleLog] = false;
            visibility[shared.inputToggleError] = false;

            function fillEntry(entry, data, step) {
                var val;

                if (step === 0) {
                    return;
                }

                for (val in data) {
                    if (data.hasOwnProperty(val)) {
                        if (typeof data[val] === "string") {
                            entry.append($("<p>").append(val + ": " + data[val]));
                        }
                        if (typeof data[val] === "object") {
                            fillEntry(entry, data[val], step - 1);
                        }
                    }
                }
            }

            return {
                addEntry: function (eventString, data) {
                    var entry = $("<div style='border: solid;'>");

                    switch (eventString) {
                        case "system:log":              entry.addClass("eventSystem");
                                                        if (!visibility[shared.inputToggleSystem]) {
                                                            entry.addClass("invis");
                                                        }
                            break;
                        case "model:change":            entry.addClass("eventParse");
                                                        if (!visibility[shared.inputToggleParse]) {
                                                            entry.addClass("invis");
                                                        }
                            break;
                        case "model:network":           entry.addClass("eventNetwork");
                                                        if (!visibility[shared.inputToggleNetwork]) {
                                                            entry.addClass("invis");
                                                        }
                            break;
                        case "system:warn":
                        case "system:error":            entry.addClass("eventError");
                                                        if (!visibility[shared.inputToggleError]) {
                                                            entry.addClass("invis");
                                                        }
                            break;
                        default:                        entry.addClass("eventLog");
                                                        if (!visibility[shared.inputToggleLog]) {
                                                            entry.addClass("invis");
                                                        }
                    }

                    entry.append("EVENT: [" + eventString + "]");
                    fillEntry(entry, data, 2);
                    entry.appendTo($("#" + shared.outputLog));
                },
                toggleFilter: function (inputId) {

                    switch (inputId) {
                        case shared.inputToggleSystem:  $(".eventSystem").toggleClass("invis");
                                                        visibility[inputId] = !visibility[inputId];
                            break;
                        case shared.inputToggleParse:   $(".eventParse").toggleClass("invis");
                                                        visibility[inputId] = !visibility[inputId];
                            break;
                        case shared.inputToggleNetwork: $(".eventNetwork").toggleClass("invis");
                                                        visibility[inputId] = !visibility[inputId];
                            break;
                        case shared.inputToggleLog:     $(".eventLog").toggleClass("invis");
                                                        visibility[inputId] = !visibility[inputId];
                            break;
                        case shared.inputToggleError:   $(".eventError").toggleClass("invis");
                                                        visibility[inputId] = !visibility[inputId];
                            break;
                        case shared.inputClear:         $("#" + shared.outputLog).children().remove();
                            break;
                        default: Core.warn("unknown inputId");
                    }
                }
            };
        }());

        

        instance.html =
            "<div class='padded'>" +
                "<p>Log and Debugging:</p>" +

                "<div><table style='width: 100%;'><tr>" +
                "<td><input id='" + shared.inputToggleSystem + "' type='button' value='SYSTEM'/></td>" +
                "<td><input id='" + shared.inputToggleParse + "' type='button' value='PARSE'/></td>" +
                "<td><input id='" + shared.inputToggleNetwork + "' type='button' value='NETWORK'/></td>" +
                "<td><input id='" + shared.inputToggleLog + "' type='button' value='LOG'/></td>" +
                "<td><input id='" + shared.inputToggleError + "' type='button' value='ERROR'/></td>" +
                "<td><input id='" + shared.inputClear + "' type='button' value='CLEAR ALL'/></td>" +
                "</tr></table></div>" +

                "<div id='" + shared.outputLog + "'>" +
                "</div>" +
            "</div>";

        instance.$events = {
            showHide: {
                events: "click",
                selector: "input",
                data: null,
                handler: function (event) {
                    log.toggleFilter($(event.target).attr("id"));
                }
            }
        };

        instance.systemEvents = {
            template: {
                events: "all",
                handler: function (eventString, data) {
                    log.addEntry(eventString, data);
                }
            }
        };

        instance.start = function () {
        };

        instance.stop = function () {
        };

        return instance;
    }

    Core.registerUnit("UnitVerboseLog", {
        createInstance: createInstance
    });
}(PIN.Core, PIN.Util, jQuery));