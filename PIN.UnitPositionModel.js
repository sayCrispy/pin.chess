/*global PIN: false, Parse: false*/

(function (Core, Util, Parse) {
    "use strict";

    if (!(Core && Util && Parse)) {
        throw new ReferenceError("Missing one or more dependencies: PIN.Core, PIN.Util, Parse");
    }

    function createInstance() {

        var Position,
            instance = {};

        Position = (function () {
            var validAttributes,
                PositionClass,
                CollectionClass,
                PositionCollection;

            validAttributes = {
                pinId: "",
                time: "",
                score: "",
                moves: ""
            };

            PositionClass = Parse.Object.extend("Position", {
                initialize: function () {
                    this.on("change add", function (model) {
                        Core.trigger("model:change", model.getHash());
                    });
                    this.on("error", function (model) {
                        Core.trigger("model:error", model.getHash());
                    });
                    this.on("invalid", function (model, error) {
                        Core.trigger("model:error", error);
                    });
                },
                validate: function (attrs, options) {
                    for (var att in attrs) {
                        if (attrs.hasOwnProperty(att)) {
                            if (!validAttributes.hasOwnProperty(att) ||
                                    (typeof attrs[att] !== typeof validAttributes[att])) {
                                return {
                                    error: "invalid Attribute:" + att
                                };
                            }
                        }
                    }
                    return false;
                },
                getHash: function () {
                    return {
                        pinId: this.get("pinId"),
                        time: this.get("time"),
                        score: this.get("score"),
                        moves: this.get("moves")
                    };
                }
            }, {
            });

            CollectionClass = Parse.Collection.extend({
                model: PositionClass,

                getByPinId: function (pinId) {
                    var result = null;
                    this.forEach(function (model) {
                        if (model.get("pinId") === pinId) {
                            result = model;
                        }
                    });
                    return result;
                }
            }, {});

            PositionCollection = new CollectionClass();

            return {
                load:   function (fenString) {
                    var query;

                    if (!PositionCollection.getByPinId(fenString)) {
                        query = new Parse.Query("Position");
                        query.equalTo("pinId", fenString);

                        query.first({
                            success: function (position) {
                                if (position === undefined) {
                                    PositionCollection.create({
                                        pinId: fenString,
                                        time: "0",
                                        score: "?",
                                        moves: "?"
                                    });
                                } else {
                                    PositionCollection.add(position);
                                }
                            },

                            error: function (error) {
                                Core.error("Error loading from Parse: " + error.code + ":" +  error.message);
                            }
                        });
                    } else {
                        Core.trigger("model:change", PositionCollection.getByPinId(fenString).getHash());
                    }
                },
                save:   function (hash) {
                    if (!PositionCollection.getByPinId(hash.pinId)) {
                        Core.error("missing Model");
                    } else {
                        if (Number.parseInt(PositionCollection.getByPinId(hash.pinId).get("time")) <
                                Number.parseInt(hash.time)) {
                            PositionCollection.getByPinId(hash.pinId).set(hash);
                            PositionCollection.getByPinId(hash.pinId).save(null, {
                                success: function () {
                                },
                                error: function (error) {
                                    Core.error("Error saving to Parse: " + error.code + ":" +  error.message);
                                }
                            });
                        }
                    }         
                }
            };
        }());

        instance.$events = {};

        instance.systemEvents = {
            boardPosition: {
                events: "board:input",
                handler: function (data) {
                    Position.load(data.fenString);
                }
            },
            stockfishData: {
                events: "stockfish:data",
                handler: function (data) {
                    Position.save(data.hash);
                }
            }
        };

        instance.start = function () {
        };

        instance.stop = function () {
        };

        instance.html = null;

        return instance;
    }


    Core.registerUnit("UnitPositionModel", {
        createInstance: createInstance
    });
}(PIN.Core, PIN.Util, Parse));