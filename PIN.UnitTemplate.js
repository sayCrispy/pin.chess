/*global PIN: false, jQuery: false*/

(function (Core) {
    "use strict";

    /*
     *  test if arguments are defined
     *  any missing depencies should result in an exception
     */

    if (!(Core)) {
        throw new ReferenceError("Missing one or more dependencies: PIN.Core");
    }

    function createInstance() {

        /*
         *  shared:     Data shared between the module's private functions
         *  instance:   Data used for module creation +
         *              handlers for intermodule communication
         */

        var shared,
            instance = {};

        /*  ___________________________________________________
         *  Define  private functions here:
         */





        /*
         *  ____________________________________________________
         */

        /*
         *  If implementing a view place your html into instance.html.
         *  If not set instance.html to null and instance.$events to {}
         * 
         *
         */

        instance.html = "<div></div>";

        /*
         *  instance.$events:    Each property of instance.events defines an
         *                      event to be registered. instance.events is
         *                      passed to registerEvents()      (Module.js)
         *
         *                      How to define an event:
         *                      events:     JQuery event type (click)
         *                      selector:   JQuery selector of the Node that
         *                                  defines the eventscope
         *                      handler:    Is called on event
         *                                  Gets passed an JQuery Event object
         *                      data:       Data to be passed to the handler
         *                                  in event.data
         *
         *                      For further information
         *                      see JQuery's on() documentation.
         */

        instance.$events = {
            template: {
                events: "template",
                selector: "template",
                data: null,
                handler: function (event) {
                }
            }
        };

        /*
         *  define event handlers for intermodule communication
         *
         */

        instance.systemEvents = {
            template: {
                events: "template",
                handler: function (data) {
                }
            }
        };

        instance.start = function () {
            /*
             *      Gets called after all Modules have been created.
             *      At this Point all HTML is embedded into the DOM.
             */
        };

        instance.stop = function () {

        };

        return instance;
    }

    Core.registerUnit("UnitTemplate", {
        createInstance: createInstance
    });
}(PIN.Core));