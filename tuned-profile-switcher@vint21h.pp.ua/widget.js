// tuned-profile-switcher
// tuned-profile-switcher@vint21h.pp.ua/widget.js


"use strict";


const PanelMenu = imports.ui.panelMenu,
    {St, Clutter, GObject} = imports.gi,
    PopupMenu = imports.ui.popupMenu,
    Gettext = imports.gettext,
    ExtensionUtils = imports.misc.extensionUtils,
    This = ExtensionUtils.getCurrentExtension(),
    Domain = Gettext.domain(This.imports.constants.getTextDomain),
    _ = Domain.gettext;


/**
 * TuneD Profile Switcher widget main class.
 */
var TunedProfileSwitcherWidget = GObject.registerClass({
        GTypeName: "TunedProfileSwitcherWidget",
    }, class TunedProfileSwitcherWidget
        extends PanelMenu.Button {

        /**
         * Widget constructor.
         *
         * @param {TunedProxyAdapter} tuned. TuneD DBus proxy adapter instance.
         */
        _init (tuned) {

            super._init(
                0,
                "TunedProfileSwitcherWidget",
                false
            );
            this.profilesMenuItems = {};
            this._tuned = tuned;
            let {activeProfile, mode} = this._tuned;

            // creating widget items
            this.box = new St.BoxLayout();
            this.topLabel = new St.Label({
                "text": activeProfile === null
                    ? _("Unknown")
                    : activeProfile,
                "y_expand": true,
                "y_align": Clutter.ActorAlign.CENTER
            });
            for (let profile of this._tuned.profiles) {
                let profileMenuItem = new PopupMenu.PopupMenuItem(
                    profile,
                    {
                        "reactive": mode === This.imports.constants.tunedModeManual
                    }
                ),
                profileMenuItemSignal = profileMenuItem.connect(
                    "activate",
                    () => {
                        this._tuned.switchProfile(profile);
                    }
                );
                this.profilesMenuItems[profile] = {
                    "item": profileMenuItem,
                    "signal": profileMenuItemSignal
                };
            }
            this.autoSelectProfileMenuItem = new PopupMenu.PopupSwitchMenuItem(
                _("Auto select profile"),
                mode === This.imports.constants.tunedModeAuto
            );
            this.autoSelectProfileMenuItemSignal = this.autoSelectProfileMenuItem.connect(
                "toggled",
                (object, value) => {
                    for (let profile in this.profilesMenuItems) {
                        if (value) {
                            this.profilesMenuItems[profile].item.reactive = false;
                        } else {
                            this.profilesMenuItems[profile].item.reactive = true;
                        }
                    }
                    this._tuned.autoProfile();
                }
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
            for (let profile in this.profilesMenuItems) {
                this.menu.addMenuItem(this.profilesMenuItems[profile].item);
            }
            // connect DBus event listener
            this._tuned.connectSignal(
                This.imports.constants.tunedProfileChangedSignalName,
                (
                    proxy,
                    nameOwner,
                    args
                ) => {
                    this.topLabel.set_text(this._tuned.activeProfile);
                }
            );

        }

        /*
         * Widget destructor.
         */
        destroy () {
            // auto select profile menu item
            this.autoSelectProfileMenuItem.disconnect(this.autoSelectProfileMenuItemSignal);
            this.autoSelectProfileMenuItemSignal = null;
            this.autoSelectProfileMenuItem.destroy();
            this.autoSelectProfileMenuItem = null;
            // profiles menu items
            for (let profile in this.profilesMenuItems) {
                this.profilesMenuItems[profile].item.disconnect(this.profilesMenuItems[profile].signal);
                this.profilesMenuItems[profile].item.destroy();
            }
            // label
            this.topLabel.destroy();
            this.topLabel = null;
            // upper level container
            this.box.destroy();
            this.box = null;
            super.destroy();
        }
});
