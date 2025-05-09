"use strict";
var EventsCRUD;
(function (EventsCRUD) {
    EventsCRUD[EventsCRUD["INSERT"] = 0] = "INSERT";
    EventsCRUD[EventsCRUD["DELETE"] = 1] = "DELETE";
    EventsCRUD[EventsCRUD["UPDATE"] = 2] = "UPDATE";
    EventsCRUD[EventsCRUD["READ"] = 3] = "READ";
    EventsCRUD[EventsCRUD["ERASE_MODIFIERS"] = 4] = "ERASE_MODIFIERS";
    EventsCRUD[EventsCRUD["RESET_PAINEL"] = 5] = "RESET_PAINEL";
})(EventsCRUD || (EventsCRUD = {}));
class EventItemMixPanel {
    constructor(itemMixPanel, eventCrud, date) {
        this.itemMixPanel = itemMixPanel;
        this.date = date ? date : this._getTime();
        this.eventCrud = eventCrud;
    }
    _getTime() {
        return new Date().getTime();
    }
}
