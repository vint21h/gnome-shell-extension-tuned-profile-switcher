// tuned-profile-switcher
// extension.js


"use strict";


const ExtensionUtils = imports.misc.extensionUtils;  // jshint ignore:line
const Main = imports.ui.main;  // jshint ignore:line

const Me = ExtensionUtils.getCurrentExtension();


/**
 * TuneD Profile Switcher extension main class.
 */
class Extension {

    /**
     * Init extension main class.
     */
    constructor() {
        log(`[${Me.metadata.name}]: initializing`);  // jshint ignore:line
        this._widget = null;
        this._tunedProxy = Me.imports.dbus.tunedProxy;
    }

    /**
     * Extension enabled/user logged in/screen unlocked event handler.
     */
    enable() {
        log(`[${Me.metadata.name}]: enabling`);  // jshint ignore:line
        this._widget = new Me.imports.widget.TunedProfileSwitcherWidget(this._tunedProxy);
        Main.panel.addToStatusArea("TunedProfileSwitcherWidget", this._widget);
    }

    /**
     * Extension uninstalled/disabled/user logged out/screen locked event handler.
     */
    disable() {
        log(`[${Me.metadata.name}]: disabling`);  // jshint ignore:line
        this._widget.destroy();
        this._widget = null;
    }
}


/**
 * Extension loaded event handler.
 */
function init() {  // jshint ignore:line
    // init translations
    ExtensionUtils.initTranslations(Me.imports.constants.getTextDomain);

    return new Extension();
}
