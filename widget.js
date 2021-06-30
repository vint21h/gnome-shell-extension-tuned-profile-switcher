// tuned-profile-switcher
// widget.js


"use strict";


const PanelMenu = imports.ui.panelMenu;  // jshint ignore:line
const St = imports.gi.St;  // jshint ignore:line
const Lang = imports.lang;  // jshint ignore:line
const PopupMenu = imports.ui.popupMenu;  // jshint ignore:line
const Clutter = imports.gi.Clutter;  // jshint ignore:line
const Gettext = imports.gettext;  // jshint ignore:line
const ExtensionUtils = imports.misc.extensionUtils;  // jshint ignore:line

const Me = ExtensionUtils.getCurrentExtension();
const Domain = Gettext.domain(Me.imports.constants.getTextDomain);
const _ = Domain.gettext;

/**
 * TuneD Profile Switcher widget main class.
 */
var TunedProfileSwitcherWidget = new Lang.Class({  // jshint ignore:line
    Name: "TunedProfileSwitcherWidget",
    Extends: PanelMenu.Button,

    /**
     * Widget constructor.
     *
     * @param {imports.gi.Gio.DBusProxy|null} tunedProxy. TuneD DBus proxy class instance.
     */
    _init: function (tunedProxy) {
        this.parent(0, "TunedProfileSwitcherWidget", false);
        if (tunedProxy) {
            this._tunedProxy = tunedProxy;
            // creating widget items
            this.layoutManager = new St.BoxLayout();
            this.topLabel = new St.Label({
                text: tunedProxy.active_profileSync().toString(),
                y_expand: true,
                y_align: Clutter.ActorAlign.CENTER
            });
            this.autoProfileMenuItem = new PopupMenu.PopupSwitchMenuItem(_("Auto select profile"), this.getTunedMode() == Me.imports.constants.tunedModeAuto ? true : false);
            this.profilesMenuItems = {};
            for (let profile in this.getTunedProfiles()) {
                this.profilesMenuItems[profile] = new PopupMenu.PopupMenuItem(profile);
            }

            // assemble items by adding top label and arrow icon to layout
            this.layoutManager.add(this.topLabel);
            this.layoutManager.add(PopupMenu.arrowIcon(St.Side.BOTTOM));
            // adding items to the panel button
            this.add_child(this.layoutManager);
            // populate menu with auto profile switcher, separator, and profiles menu items
            this.menu.addMenuItem(this.autoProfileMenuItem);
            this.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());
            for (let profile in this.profilesMenuItems) {
                this.menu.addMenuItem(this.profilesMenuItems[profile]);
            }
        }
    },

    /*
    * Detect TuneD mode.
    *
    * @return {bool}. TuneD mode name ["auto", "manual"].
    */
    getTunedMode: function () {
        try {
            return this._tunedProxy.profile_modeSync().toString().split(",")[0];
        } catch (error) {
            logError(`[${Me.metadata.name}]: error. ${error}`);  // jshint ignore:line
            return Me.imports.constants.tunedModeManual;
        }
    },

    /*
    * Get TuneD profiles.
    *
    * @return {Array[String]}. TuneD profiles list.
    */
    getTunedProfiles: function () {
        try {
            return this._tunedProxy.profilesSync().toString().split(",");
        } catch (error) {
            logError(`[${Me.metadata.name}]: error. ${error}`);  // jshint ignore:line
            return [];
        }
    },

    /*
    * Widget destructor.
    */
    destroy: function () {
        this.parent();
    }
});
