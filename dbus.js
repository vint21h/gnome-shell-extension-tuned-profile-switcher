// tuned-profile-switcher
// dbus.js


"use strict";


const Gio = imports.gi.Gio;  // jshint ignore:line
const ExtensionUtils = imports.misc.extensionUtils;  // jshint ignore:line

const Me = ExtensionUtils.getCurrentExtension();
const tunedDBusProxy = Gio.DBusProxy.makeProxyWrapper(Me.imports.constants.tunedInterface);
try {
    var tunedProxy = new tunedDBusProxy(  // jshint ignore:line
        Gio.DBus.system,
        "com.redhat.tuned",
        "/Tuned"
    );
} catch (error) {
    var tunedProxy = null;  // jshint ignore:line
    logError(`[${Me.metadata.name}]: error. ${error}`);  // jshint ignore:line
}
