/*global PIN: false, jQuery: false*/

jQuery(function () {
    "use strict";
    PIN.init({
        a: {
            unitType: "UnitBanner",
            gridId: "banner"
        },
        b: {
            unitType: "UnitPositionView",
            gridId: "sidebar"
        },
        c: {
            unitType: "UnitStockfish",
            gridId: "sidebar"
        },
        d: {
            unitType: "UnitChessBoard",
            gridId: "main"
        },
        e: {
            unitType: "UnitPositionModel",
            gridId: "main"
        }/*,
        f: {
            unitType: "UnitVerboseLog",
            gridId: "log"
        }*/
    });
});