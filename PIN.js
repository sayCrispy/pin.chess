/*global Parse: false, jQuery: false*/
/*
 *      creating the PIN namespace
 */
var PIN = (function () {
    "use strict";

    return {
        init: function (layout) {
            if (!(PIN.Core && Parse && jQuery)) {
                console.error("Missing Library! Checklist: PIN.Core, Parse, jQuery");
                console.log("Application shutdown.");
            } else {
                Parse.initialize("8LYKd6tWry5i1q834mdoBy8ctiy7KlU1yUFo7PQ9", "szbcEOokimPLD74iXJWR13rxLzefZTtb6vFtbocu");
                PIN.Core.buildApplication(layout);
            }
        }
    };
}());