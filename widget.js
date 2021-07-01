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
     * @param {Me.imports.dbus.TunedProxyAdapter} tuned. TuneD DBus proxy adapter instance.
     */
    _init: function (tuned) {
        this.parent(0, "TunedProfileSwitcherWidget", false);
        this._tuned = tuned;
        let activeProfile = this._tuned.activeProfile,
            mode = this._tuned.mode;
        // creating widget items
        this.box = new St.BoxLayout();
        this.topLabel = new St.Label({
            text: activeProfile === null ? _("Unknown"): activeProfile,
            y_expand: true,
            y_align: Clutter.ActorAlign.CENTER
        });
        // TODO: deal with no DBus connection.
        this.autoSelectProfileMenuItem = new PopupMenu.PopupSwitchMenuItem(_("Auto select profile"), mode === Me.imports.constants.tunedModeAuto ? true : false);
        this.profilesMenuItems = {};
        for (let profile of this._tuned.profiles) {
            this.profilesMenuItems[profile] = new PopupMenu.PopupMenuItem(profile, {
                reactive: mode === Me.imports.constants.tunedModeManual ? true : false
            });
        }

        // assemble items by adding top label and arrow icon to layout
        this.box.add(this.topLabel);
        this.box.add(PopupMenu.arrowIcon(St.Side.BOTTOM));
        // adding items to the panel button
        this.add_child(this.box);
        // populate menu with auto profile switcher, separator, and profiles menu items
        this.menu.addMenuItem(this.autoSelectProfileMenuItem);
        this.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());
        for (let profile in this.profilesMenuItems) {
            this.menu.addMenuItem(this.profilesMenuItems[profile]);
        }
    },

    /*
    * Widget destructor.
    */
    destroy: function () {
        // TODO: extend it by calling inner objects destructors.
        this.parent();
    }
});
