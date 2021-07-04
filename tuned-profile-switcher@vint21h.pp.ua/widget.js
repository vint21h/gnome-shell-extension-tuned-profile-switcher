// tuned-profile-switcher
// tuned-profile-switcher@vint21h.pp.ua/widget.js


"use strict";


const PanelMenu = imports.ui.panelMenu,
    {St} = imports.gi,
    Lang = imports.lang,
    PopupMenu = imports.ui.popupMenu,
    {Clutter} = imports.gi,
    Gettext = imports.gettext,
    ExtensionUtils = imports.misc.extensionUtils,
    Me = ExtensionUtils.getCurrentExtension(),
    Domain = Gettext.domain(Me.imports.constants.getTextDomain),
    _ = Domain.gettext;


/**
 * TuneD Profile Switcher widget main class.
 */
var TunedProfileSwitcherWidget = new Lang.Class({
    "Name": "TunedProfileSwitcherWidget",
    "Extends": PanelMenu.Button,

    /**
     * Widget constructor.
     *
     * @param {TunedProxyAdapter} tuned. TuneD DBus proxy adapter instance.
     */
    "_init" (tuned) {

        this.parent(
            0,
            "TunedProfileSwitcherWidget",
            false
        );
        this.profilesMenuItems = {};
        this._tuned = tuned;
        const {activeProfile} = this._tuned,
            {mode} = this._tuned;

        // creating widget items
        this.box = new St.BoxLayout();
        this.topLabel = new St.Label({
            "text": activeProfile === null
                ? _("Unknown")
                : activeProfile,
            "y_expand": true,
            "y_align": Clutter.ActorAlign.CENTER
        });
        for (const profile of this._tuned.profiles) {
            const profileMenuItem = new PopupMenu.PopupMenuItem(
                profile,
                {
                    "reactive": mode === Me.imports.constants.tunedModeManual
                }
            );
            profileMenuItem.connect(
                "activate",
                Lang.bind(
                    this,
                    function () {
                        this._tuned.switchProfile(profile);
                    }
                )
            );
            this.profilesMenuItems[profile] = profileMenuItem;
        }
        this.autoSelectProfileMenuItem = new PopupMenu.PopupSwitchMenuItem(
            _("Auto select profile"),
            mode === Me.imports.constants.tunedModeAuto
        );
        this.autoSelectProfileMenuItem.connect(
            "toggled",
            Lang.bind(
                this,
                function (object, value) {
                    for (const profile in this.profilesMenuItems) {
                        if (value) {
                            this.profilesMenuItems[profile].reactive = false;
                        } else {
                            this.profilesMenuItems[profile].reactive = true;
                        }
                    }
                    this._tuned.autoProfile();
                }
            )
        );

        // assemble items by adding top label and arrow icon to layout
        this.box.add(this.topLabel);
        this.box.add(PopupMenu.arrowIcon(St.Side.BOTTOM));
        // adding items to the panel button
        this.add_child(this.box);
        // populate menu with auto profile switcher,
        // separator, and profiles menu items
        this.menu.addMenuItem(this.autoSelectProfileMenuItem);
        this.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());
        for (const profile in this.profilesMenuItems) {
            this.menu.addMenuItem(this.profilesMenuItems[profile]);
        }
        // connect DBus event listener
        this._tuned.connectSignal(
            Me.imports.constants.tunedProfileChangedSignalName,
            (
                proxy,
                nameOwner,
                args
            ) => {
                this.topLabel.set_text(this._tuned.activeProfile);
            }
        );

    },

    /*
     * Widget destructor.
     */
    "destroy" () {
        // TODO: extend it by calling inner objects destructors.
        this.parent();
    }
});
