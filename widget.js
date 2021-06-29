// tuned-profile-switcher
// widget.js


"use strict";


const PanelMenu = imports.ui.panelMenu;  // jshint ignore:line
const St = imports.gi.St;  // jshint ignore:line
const Gio = imports.gi.Gio;  // jshint ignore:line
const Lang = imports.lang;  // jshint ignore:line
const PopupMenu = imports.ui.popupMenu;  // jshint ignore:line
const Clutter = imports.gi.Clutter;  // jshint ignore:line


/**
 * TuneD Profile Switcher widget main class.
 */
var TunedProfileSwitcherWidget = new Lang.Class({  // jshint ignore:line
    Name: "TunedProfileSwitcherWidget",
    Extends: PanelMenu.Button,

    /**
     * Widget constructor.
     *
     * @param {imports.gi.Gio.DBusProxy} tunedProxy. TuneD DBus proxy class instance.
     */
    _init: function(tunedProxy) {
        this._tunedProxy = tunedProxy;
        this.parent(0, "TunedProfileSwitcherWidget", false);
        this.box = new St.BoxLayout();
        this.icon = new St.Icon({
            gicon: new Gio.ThemedIcon({name: "system-run-symbolic"}),
            style_class: "system-status-icon"
        });
        this.topLabel = new St.Label({
            text: tunedProxy.active_profileSync().toString(),
            y_expand: true,
            y_align: Clutter.ActorAlign.CENTER
        });

        // assemble box items by adding icon, top label and arrow icon to it
        this.box.add(this.icon);
        this.box.add(this.topLabel);
        this.box.add(PopupMenu.arrowIcon(St.Side.BOTTOM));
        // adding box to the panel button
        this.add_child(this.box);
    },

    /*
    * Widget destructor.
    */
    destroy: function() {
        this.parent();
    }
});
