/*global PIN: false, jQuery: false, Parse: false*/

(function (PIN, Util, $, Parse) {
    "use strict";

    if (!(PIN && Util && $ && Parse)) {
        throw new ReferenceError("Missing one or more dependencies: PIN, PIN.Util, jQuery, Parse");
    }
    
    var log,
        Units,
        systemEvents,
        status;

    systemEvents = Object.create(Parse.Events);

    function systemLog(message) {
        systemEvents.trigger("system:log", {
            message: message
        });
        console.log("PIN: " + message);
    }

    Units = (function () {
        var registeredUnits = {},
            activeUnits = {};

        function forAllUnitsDo(func) {
            var id;
            for (id in activeUnits) {
                if (activeUnits.hasOwnProperty(id)) {
                    func(activeUnits[id]);
                }
            }
        }

        function registerSystemEvents(events) {
            var event;
            for (event in events) {
                if (events.hasOwnProperty(event)) {
                    event = events[event];
                    systemEvents.on(event.events, event.handler);
                }
            }
        }

        function register$Events(root, events) {
            var event;
            for (event in events) {
                if (events.hasOwnProperty(event)) {
                    event = events[event];
                    root.on(event.events, event.selector, event.data, event.handler);
                }
            }
        }

        return {
            registerUnit: function (unitType, spec) {
                if (!registeredUnits[unitType]) {
                    registeredUnits[unitType] = spec;
                } else {
                    PIN.Core.error("Couldn't register unit!");
                }
            },
            loadUnit: function (unitType, gridId) {
                /*
                 *  module:     Interface for Core.js
                 *  instance:   Result of the module's constructor
                 *  root:       JQuery ParentNode (div tag) of HTML-Representation
                 */

                var unit,
                    instance,
                    root,
                    id;

                if (!registeredUnits[unitType]) {
                    throw new Error("Unit spec not found!");
                }

                instance = registeredUnits[unitType].createInstance();
                id = Util.generateId();

                if (instance.html !== null) {
                    root = $("<div>")
                        .attr("id", id)
                        .attr("data-pin-unitType", unitType)
                        .append(instance.html)
                        .addClass("pinMod")
                        .appendTo($("#" + gridId));

                    register$Events(root, instance.$events);
                }

                unit = {
                    id: id,
                    start: instance.start,
                    stop: instance.stop
                };

                registerSystemEvents(instance.systemEvents);

                activeUnits[id] = unit;
            },
            startUnits: function () {
                forAllUnitsDo(function (u) {
                    u.start();
                });
            }
        };
    }());

    log = {
        log: function (logMessage) {
            systemEvents.trigger("unit:log", {
                message: logMessage
            });
        },
        warn: function (warnMessage) {
            systemEvents.trigger("unit:warn", {
                message: warnMessage
            });
            console.warn(warnMessage);
        },
        error: function (errorMessage) {
            systemEvents.trigger("unit:error", {
                message: errorMessage
            });
            console.error(errorMessage);
        }
    };

    PIN.Core = {
        buildApplication: function (layout) {
            if (status) {
                PIN.Core.log("Application status: " + status);
            } else {
                try {
                    var unit;
                    for (unit in layout) {
                        if (layout.hasOwnProperty(unit)) {
                            Units.loadUnit(layout[unit].unitType, layout[unit].gridId);
                            
                        }
                    }
                    systemLog("Units loaded");

                    Units.startUnits();
                    systemLog("Units started");

                    status = "build successful";
                    systemLog("Application building complete");
                } catch (error) {
                    status = "build crashed";
                    PIN.Core.error("Could not build Application! " + error.message);
                }
            }
        },
        registerUnit: Units.registerUnit,
        trigger: function (event, data) {
            systemEvents.trigger(event, data);
        },
        log: function (logMessage) {
            log.log(logMessage);
        },
        warn: function (warnMessage) {
            log.warn(warnMessage);
        },
        error: function (errorMessage) {
            log.error(errorMessage);
        }
    };

}(PIN, PIN.Util, jQuery, Parse));