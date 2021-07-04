// tuned-profile-switcher
// tuned-profile-switcher@vint21h.pp.ua/dbus.js


"use strict";


const Gio = imports.gi.Gio;  // jshint ignore:line
const ExtensionUtils = imports.misc.extensionUtils;  // jshint ignore:line

const Me = ExtensionUtils.getCurrentExtension();

const TunedDBusProxy = Gio.DBusProxy.makeProxyWrapper(Me.imports.constants.tunedInterface);


/*
* TuneD DBus proxy adapter.
*/
class TunedProxyAdapter {  // jshint ignore:line

    /*
    * Adapter constructor.
    *
    * Creates DBus proxy instance.
    */
    constructor() {
        try {
            this._tunedProxy = new TunedDBusProxy(  // jshint ignore:line
                Gio.DBus.system,
                Me.imports.constants.tunedDBusName,
                Me.imports.constants.tunedDBusPath
            );
        } catch (error) {
            this._tunedProxy = null;  // jshint ignore:line
            logError(error, `[${Me.metadata.name}]: error. ${error}`);  // jshint ignore:line
        }
    }

    /**
    * Get TuneD active profile.
    *
    * @return {String|null}. TuneD active profile.
    */
    get activeProfile () {
        try {
            return this._tunedProxy.active_profileSync().toString();
        } catch (error) {
            logError(error, `[${Me.metadata.name}]: error. ${error}`);  // jshint ignore:line
            return null;
        }
    }

    /**
    * Detect TuneD mode.
    *
    * @return {String|null}. TuneD mode name ["auto", "manual"].
    */
    get mode() {
        try {
            return this._tunedProxy.profile_modeSync().toString().split(",")[0];
        } catch (error) {
            logError(error, `[${Me.metadata.name}]: error. ${error}`);  // jshint ignore:line
            return null;
        }
    }

    /**
    * Get TuneD profiles.
    *
    * @return {Array}. TuneD profiles list.
    */
    get profiles () {
        try {
            return this._tunedProxy.profilesSync().toString().split(",");
        } catch (error) {
            logError(error, `[${Me.metadata.name}]: error. ${error}`);  // jshint ignore:line
            return [];
        }
    }

    /**
     * Set TuneD profile automatically.
     */
    autoProfile () {
        try {
            this._tunedProxy.auto_profileSync();
        } catch (error) {
            logError(error, `[${Me.metadata.name}]: error. ${error}`);  // jshint ignore:line
        }

    }

    /**
     * Set TuneD profile.
     *
     * @param {String} profile. TuneD profile name.
     */
    switchProfile (profile) {
        try {
            this._tunedProxy.switch_profileSync(profile);
        } catch (error) {
            logError(error, `[${Me.metadata.name}]: error. ${error}`);  // jshint ignore:line
        }
    }

    /**
     * Connect listener to DBus signal.
     *
     * @param {String} signal. Signal name to listen to.
     * @param {function} listener. Signal handler function.
    */
    connectSignal (signal, listener) {
        this._tunedProxy.connectSignal(signal, function(proxy, nameOwner, args) {
            listener(proxy, nameOwner, args);
        });
    }
}
