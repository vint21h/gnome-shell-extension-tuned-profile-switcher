// tuned-profile-switcher
// extension.js


"use strict";


const ExtensionUtils = imports.misc.extensionUtils;  // jshint ignore:line
const Gettext = imports.gettext;  // jshint ignore:line
const PanelMenu = imports.ui.panelMenu;  // jshint ignore:line
const St = imports.gi.St;  // jshint ignore:line
const Gio = imports.gi.Gio;  // jshint ignore:line
const Main = imports.ui.main;  // jshint ignore:line

const Me = ExtensionUtils.getCurrentExtension();
const Domain = Gettext.domain(Me.metadata.uuid);
const _ = Domain.gettext;


/**
 * TuneD Profile Switcher extension main class.
 */
class Extension {

    /**
     * Init extension main class.
     */
    constructor() {
        log(_(`[${Me.metadata.name}]: initializing`));  // jshint ignore:line
        this._indicator = null;
        this._connection = Me.imports.dbus.tunedProxy;
    }

    /**
     * Extension enabled/user logged in/screen unlocked event handler.
     */
    enable() {
        log(_(`[${Me.metadata.name}]: enabling `));  // jshint ignore:line
        // create a panel button
        this._indicator = new PanelMenu.Button(0.0, "", false);

        // add an icon to button
        let icon = new St.Icon({
            gicon: new Gio.ThemedIcon({name: "system-run-symbolic"}),
            style_class: "system-status-icon"
        });
        this._indicator.add_child(icon);
        Main.panel.addToStatusArea("", this._indicator);
    }

    /**
     * Extension uninstalled/disabled/user logged out/screen locked event handler.
     */
    disable() {
        log(_(`[${Me.metadata.name}]: disabling`));  // jshint ignore:line
        this._indicator.destroy();
        this._indicator = null;
    }
}


/**
 * Extension loaded event handler.
 */
function init() {  // jshint ignore:line

    // init translations
    ExtensionUtils.initTranslations(Me.metadata.uuid);

    return new Extension();
}
