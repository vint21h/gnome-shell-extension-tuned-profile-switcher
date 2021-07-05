// tuned-profile-switcher
// tuned-profile-switcher@vint21h.pp.ua/extension.js


"use strict";


const ExtensionUtils = imports.misc.extensionUtils,
    Main = imports.ui.main,
    This = ExtensionUtils.getCurrentExtension();


/**
 * TuneD Profile Switcher extension main class.
 */
class Extension {
    /**
     * Init extension main class.
     */
    constructor () {
        log(`[${This.metadata.name}]: initializing`);
        this._tuned = new This.imports.dbus.TunedProxyAdapter();
        this._widget = null;
    }

    /**
     * Extension enabled/user logged in/screen unlocked event handler.
     */
    enable () {
        log(`[${This.metadata.name}]: enabling`);
        this._widget = new This.imports.widget.TunedProfileSwitcherWidget(this._tuned);
        Main.panel.addToStatusArea(
            "TunedProfileSwitcherWidget",
            this._widget
        );
    }

    /**
     * Extension uninstalled/disabled/user logged out/screen locked event handler.
     */
    disable () {
        log(`[${This.metadata.name}]: disabling`);
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
    ExtensionUtils.initTranslations(This.imports.constants.getTextDomain);
    return new Extension();
}
