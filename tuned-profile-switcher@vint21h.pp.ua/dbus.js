// tuned-profile-switcher
// tuned-profile-switcher@vint21h.pp.ua/dbus.js


"use strict";


const {Gio} = imports.gi,
    ExtensionUtils = imports.misc.extensionUtils,
    Me = ExtensionUtils.getCurrentExtension(),
    TunedDBusProxy = Gio.DBusProxy.makeProxyWrapper(Me.imports.constants.tunedInterface);


/**
 * TuneD DBus proxy adapter.
 */
class TunedProxyAdapter {

    /**
     * Adapter constructor.
     *
     * Creates DBus proxy instance.
     */
    constructor () {
        try {
            this._tunedProxy = new TunedDBusProxy(
                Gio.DBus.system,
                Me.imports.constants.tunedDBusName,
                Me.imports.constants.tunedDBusPath
            );
        } catch (error) {
            this._tunedProxy = null; // jshint ignore:line
            logError( // jshint ignore:line
                error,
                `[${Me.metadata.name}]: error. ${error}`
            );
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
            logError( // jshint ignore:line
                error,
                `[${Me.metadata.name}]: error. ${error}`
            );
            return null;
        }

    }

    /**
     * Detect TuneD mode.
     *
     * @return {String|null}. TuneD mode name ["auto", "manual"].
     */
    get mode () {
        try {
            return this._tunedProxy.profile_modeSync()
                .toString()
                .split(",")[0];
        } catch (error) {
            logError( // jshint ignore:line
                error,
                `[${Me.metadata.name}]: error. ${error}`
            );
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
            return this._tunedProxy.profilesSync()
                .toString()
                .split(",");
        } catch (error) {
            logError( // jshint ignore:line
                error,
                `[${Me.metadata.name}]: error. ${error}`
            );
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
            logError( // jshint ignore:line
                error,
                `[${Me.metadata.name}]: error. ${error}`
            );
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
            logError( // jshint ignore:line
                error,
                `[${Me.metadata.name}]: error. ${error}`
            );
        }
    }

    /**
     * Connect listener to DBus signal.
     *
     * @param {String} signal. Signal name to listen to.
     * @param {function} listener. Signal handler function.
     */
    connectSignal (signal, listener) {
        this._tunedProxy.connectSignal(
            signal,
            (proxy, nameOwner, args) => {

                listener(
                    proxy,
                    nameOwner,
                    args
                );

            }
        );
    }

}
