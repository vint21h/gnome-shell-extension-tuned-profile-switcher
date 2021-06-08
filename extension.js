// tuned-profile-switcher
// extension.js


const {St, Clutter} = imports.gi;
const Gio = imports.gi.Gio;
const ExtensionUtils = imports.misc.extensionUtils;
const Main = imports.ui.main;


/**
 * TuneD Profile Switcher extension main class.
 */
class Extension {

    /**
     * Init extension main class.
     */
    constructor() {
        this.self = ExtensionUtils.getCurrentExtension();
        this._button = new St.Bin({
            style_class : "panel-button",
        });
        let icon = new St.Icon({
            gicon: new Gio.ThemedIcon({name: "preferences-other"}),
            // style_class: "system-status-icon",
            y_align: Clutter.ActorAlign.CENTER,
        });
        this._button.add_child(icon);
    }

    /**
     * Extension enabled/user logged in/screen unlocked event handler.
     */
    enable() {
        Main.panel._rightBox.insert_child_at_index(this._button, 0);
    }

    /**
     * Extension uninstalled/disabled/user logged out/screen locked event handler.
     */
    disable() {
        Main.panel._rightBox.remove_child(this._button);
    }
}


/**
 * Extension loaded event handler.
 */
function init() {
    return new Extension();
}
