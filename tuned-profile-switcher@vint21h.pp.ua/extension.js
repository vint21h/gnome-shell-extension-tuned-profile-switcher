// tuned-profile-switcher
// tuned-profile-switcher@vint21h.pp.ua/extension.js


"use strict";


const ExtensionUtils = imports.misc.extensionUtils,
    Main = imports.ui.main,
    Me = ExtensionUtils.getCurrentExtension();


/**
 * TuneD Profile Switcher extension main class.
 */
class Extension {
    /**
     * Init extension main class.
     */
    constructor () {
        log(`[${Me.metadata.name}]: initializing`); // jshint ignore:line
        this._tuned = new Me.imports.dbus.TunedProxyAdapter();
        this._widget = null;
    }

    /**
     * Extension enabled/user logged in/screen unlocked event handler.
     */
    enable () {
        log(`[${Me.metadata.name}]: enabling`); // jshint ignore:line
        this._widget = new Me.imports.widget.TunedProfileSwitcherWidget(this._tuned);
        Main.panel.addToStatusArea(
            "TunedProfileSwitcherWidget",
            this._widget
        );
    }

    /**
     * Extension uninstalled/disabled/user logged out/screen locked event handler.
     */
    disable () {
        log(`[${Me.metadata.name}]: disabling`); // jshint ignore:line
        this._widget.destroy();
        this._widget = null;
    }
}


/**
 * Extension loaded event handler.
 *
 * @return {Extension}. Initialized extension class instance.
 */
function init() {
    // init translations
    ExtensionUtils.initTranslations(Me.imports.constants.getTextDomain);
    return new Extension();
}
